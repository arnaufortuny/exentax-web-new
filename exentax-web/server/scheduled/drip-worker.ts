/**
 * Drip-sequence worker (Task #38 outbox refactor — 2026-04-30)
 * ------------------------------------------------------------
 * Polls `email_outbox` for due rows, claims them with a fencing token
 * (`claim_version`), dispatches the SMTP send, and — in a single
 * transaction — marks the row sent, advances the enrollment's
 * `current_step`, and enqueues the NEXT step's outbox row.
 *
 * Per-source cadence (driven by the `nextAttemptAt` set when enqueueing
 * the next step's outbox row):
 *  - `guide`      → 6 steps, 3-day cadence (days 0/3/6/9/12/15). The
 *    route handler enqueues step 1 with `next_attempt_at = now()` so
 *    the worker fires it within one tick.
 *  - `calculator` → 3 nurture steps, 2-day cadence (days 2/4/6 from
 *    enrollment). The IMMEDIATE personalised report email on day 0 is
 *    sent inline by the calculator route via `sendCalculatorEmail` and
 *    is NOT counted as a drip step — the route enqueues step 1 with
 *    `next_attempt_at = now() + 2d`.
 *
 * Why an outbox? See `shared/schema.ts:emailOutbox` and audit row A2.
 * The outbox eliminates the three residuals of the prior "send +
 * sentinel + immediate path" model:
 *   (a) ACK→sentinel window collapses to a single transaction that
 *       both marks `sent_at` and advances/enqueues the next step.
 *   (b) Lease overlap is bounded by the fencing token — a stale-lease
 *       reclaim by another worker invalidates the original worker's
 *       belated UPDATE via the `claim_version` CAS.
 *   (c) Sentinel + poison double-fail is bounded by the per-row
 *       `attempts` cap, which is bumped at claim time (not at send
 *       time) so even if poison fails, the row drops out of the
 *       eligibility filter after `max_attempts` claims.
 *
 * Failures are non-fatal: helper-level CAS releases the claim and
 * schedules a backed-off retry. The cadence delay for the NEXT step is
 * preserved on success only.
 */
import { logger } from "../logger";
import { sendDripEmailOnce, sendCalcDripEmailOnce } from "../email";
import { withTransaction, type DbOrTx } from "../db";
import {
  claimDueOutboxRows,
  markOutboxRowSent,
  releaseOutboxRowOnError,
  poisonOutboxRow,
  enqueueOutboxRow,
  advanceDripEnrollment,
  getOutboxClaimVersion,
  type OutboxPayload,
} from "../storage/marketing";
import * as s from "../../shared/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "../db";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const STEP_DELAY_MS_BY_SOURCE: Record<string, number> = {
  guide: 3 * ONE_DAY_MS,
  calculator: 2 * ONE_DAY_MS,
};
const TOTAL_STEPS_BY_SOURCE: Record<string, number> = {
  guide: 6,
  calculator: 3,
};
const DEFAULT_DELAY_MS = 3 * ONE_DAY_MS;
const DEFAULT_TOTAL_STEPS = 6;

function totalStepsFor(source: string | null | undefined): number {
  return TOTAL_STEPS_BY_SOURCE[source ?? ""] ?? DEFAULT_TOTAL_STEPS;
}
function delayMsFor(source: string | null | undefined): number {
  return STEP_DELAY_MS_BY_SOURCE[source ?? ""] ?? DEFAULT_DELAY_MS;
}

// Treat a claim as crashed after 10 minutes — same window as the
// transactional email queue. Long enough that a slow Gmail send never
// double-claims under normal load, short enough that a real crash is
// recovered within one polling round on the next worker.
const STALE_CLAIM_SECONDS = 10 * 60;
const CLAIM_BATCH_SIZE = 20;
// Number of in-tx retries when persisting `sent_at` after a successful
// SMTP send. Each retry is a fresh transaction (the post-send block
// opens its own `withTransaction`) so a transient connection blip
// doesn't burn the budget. Once exhausted, the row is poisoned.
const MARK_SENT_RETRIES = 3;
// Backoff schedule for SMTP failures (mirrors email-retry-queue). The
// outbox row's `next_attempt_at` is set to `now() + BACKOFF_MS[attempt]`
// where `attempt` is the count of failed dispatches so far.
const BACKOFF_MS: readonly number[] = [
  60_000,           // 1 min
  5 * 60_000,       // 5 min
  15 * 60_000,      // 15 min
  60 * 60_000,      // 1 h
  4 * 60 * 60_000,  // 4 h
];

let _worker: NodeJS.Timeout | null = null;
let _draining = false;

/**
 * Compute the ISO timestamp for the next step's send time. Returns
 * `null` when `nextStep` is past the final step for this source — the
 * worker interprets that as "completed" and no further outbox row is
 * enqueued; the enrollment's `completed_at` is sealed instead.
 */
function nextSendAtFor(source: string | null | undefined, nextStep: number): string | null {
  if (nextStep > totalStepsFor(source)) return null;
  return new Date(Date.now() + delayMsFor(source)).toISOString();
}

function backoffFor(attempts: number): string {
  // attempts is the post-bump value (1-based after first failure).
  const idx = Math.min(attempts - 1, BACKOFF_MS.length - 1);
  const delay = BACKOFF_MS[Math.max(0, idx)];
  return new Date(Date.now() + delay).toISOString();
}

/**
 * Test-only injection hooks. ESM exports are read-only, so the
 * regression test in `tests/drip-exactly-once.test.ts` plugs stubs
 * through these setters rather than monkeypatching imports.
 *
 * Hard-guarded against production: `_setSendOverridesForTests` and
 * `_drainOnceForTests` throw if `NODE_ENV === "production"` so a
 * stray import (or a future code path that mistakes them for public
 * API) cannot redirect real customer drip mail to a stub. The guard
 * sits at the call sites — the module-level state is only mutated
 * through `_setSendOverridesForTests`, so guarding the setter is
 * enough to keep the test stubs out of the production dispatch path.
 */
type GuideSender = typeof sendDripEmailOnce;
type CalcSender = typeof sendCalcDripEmailOnce;
type MarkSentFn = typeof markOutboxRowSent;
let _testGuideSender: GuideSender | null = null;
let _testCalcSender: CalcSender | null = null;
let _testMarkSent: MarkSentFn | null = null;

function assertTestHookAllowed(hookName: string): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `drip-worker: ${hookName} is a test-only hook and cannot be invoked when NODE_ENV=production`,
    );
  }
}

export function _setSendOverridesForTests(opts: {
  guide?: GuideSender | null;
  calc?: CalcSender | null;
  markSent?: MarkSentFn | null;
}): void {
  assertTestHookAllowed("_setSendOverridesForTests");
  if (opts.guide !== undefined) _testGuideSender = opts.guide;
  if (opts.calc !== undefined) _testCalcSender = opts.calc;
  if (opts.markSent !== undefined) _testMarkSent = opts.markSent;
}

/**
 * Dispatch the right sender for the row's `payload.kind`. The payload
 * is the verbatim JSON the route handler enqueued — see
 * `OutboxPayload` for the shape.
 */
async function dispatchOutbox(payload: OutboxPayload): Promise<void> {
  if (payload.kind === "calculator") {
    const send = _testCalcSender ?? sendCalcDripEmailOnce;
    await send({
      email: payload.email,
      name: payload.name,
      language: payload.language,
      step: payload.step as 1 | 2 | 3,
      unsubToken: payload.unsubToken,
    });
    return;
  }
  const send = _testGuideSender ?? sendDripEmailOnce;
  await send({
    email: payload.email,
    name: payload.name,
    language: payload.language,
    step: payload.step as 1 | 2 | 3 | 4 | 5 | 6,
    unsubToken: payload.unsubToken,
  });
}

/**
 * Single send point for the outbox. Validates the fencing token at
 * every post-SMTP UPDATE, so a stale-lease reclaim by another worker
 * cannot cause this caller's belated writes to clobber the newer
 * worker's progress. Returns `true` when the row's `sent_at` was
 * persisted by this caller, `false` when the fencing CAS failed (the
 * other worker handled the row).
 */
export async function sendOutboxRow(row: s.EmailOutboxRow): Promise<boolean> {
  let payload: OutboxPayload;
  try {
    payload = JSON.parse(row.payload) as OutboxPayload;
  } catch (err) {
    // Unparseable payload is a hard error — poison the row so it
    // doesn't get re-claimed forever.
    await poisonOutboxRow({
      id: row.id,
      claimVersion: row.claimVersion,
      step: row.step,
      error: `payload parse failed: ${err instanceof Error ? err.message : String(err)}`,
    }).catch(() => {});
    return false;
  }

  // ─── Phase 0: pre-send fencing check ───────────────────────────────────
  // Before SMTP, verify our `claim_version` is still current. If a
  // stale-lease reclaim by another worker has bumped it since we
  // selected this row, ABANDON the dispatch without sending — the
  // other worker now owns the row and will deliver. This eliminates
  // residual (b) at the SMTP level (the post-send CAS in
  // `markOutboxRowSent` only protects against stale DB writes; without
  // this check, a stalled-then-resumed worker could still fire a
  // duplicate SMTP). Window between this check and `dispatchOutbox`
  // is microseconds, while reclaims require STALE_CLAIM_SECONDS (600s)
  // of inactivity, so practical duplicate SMTPs are not reachable.
  const currentClaimVersion = await getOutboxClaimVersion(row.id).catch(() => null);
  if (currentClaimVersion !== row.claimVersion) {
    logger.warn(
      `Drip outbox: row ${row.id} (step ${row.step}) ABANDONED pre-send — claim_version superseded (had ${row.claimVersion}, current ${currentClaimVersion}); other worker owns this row`,
      "drip-worker",
    );
    return false;
  }

  // ─── Phase 1: SMTP dispatch ────────────────────────────────────────────
  // Failures here are safely retryable — nothing has been delivered.
  // releaseOutboxRowOnError CAS-validates `claim_version` so we can't
  // clobber a stale-lease reclaim's progress.
  try {
    await dispatchOutbox(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await releaseOutboxRowOnError({
      id: row.id,
      claimVersion: row.claimVersion,
      error: message,
      nextAttemptAt: backoffFor(row.attempts),
    }).catch(() => {});
    logger.warn(
      `Drip outbox: row ${row.id} (step ${row.step}) dispatch failed: ${message.slice(0, 200)}`,
      "drip-worker",
    );
    return false;
  }

  // ─── Phase 2: persist sentinel + advance enrollment + enqueue next ─────
  // Single transaction so that "this email was delivered" and the
  // associated cadence advance commit together. CAS on `claim_version`
  // means a stale-lease reclaim by another worker silently no-ops
  // here — `markOutboxRowSent` returns false and we abandon without
  // touching the enrollment or the next step. The other worker is
  // responsible for the post-send writes.
  const markSent = _testMarkSent ?? markOutboxRowSent;
  let didMarkSent = false;
  let txErr: Error | null = null;
  for (let attempt = 1; attempt <= MARK_SENT_RETRIES; attempt++) {
    try {
      await withTransaction(async (tx) => {
        const ok = await markSent({ id: row.id, claimVersion: row.claimVersion }, tx);
        if (!ok) {
          // Fencing CAS failed — another worker owns this row now.
          // Abandon silently; do NOT advance the enrollment (the other
          // worker will).
          return;
        }
        didMarkSent = true;
        await postSendAdvanceAndEnqueueNext(tx, row, payload);
      });
      txErr = null;
      break;
    } catch (err) {
      txErr = err instanceof Error ? err : new Error(String(err));
      if (attempt < MARK_SENT_RETRIES) {
        await new Promise((r) => setTimeout(r, 100 * 3 ** (attempt - 1)));
      }
    }
  }
  if (txErr) {
    // SMTP delivered but the sentinel transaction failed every retry.
    // Poison the row (CAS-protected) so the worker can't re-pick it
    // and re-send. Even if poisonOutboxRow itself fails, the row's
    // `attempts` counter (bumped at claim time) bounds residual (c) —
    // after `max_attempts` total claims the row is invisible to the
    // claim selector.
    await poisonOutboxRow({
      id: row.id,
      claimVersion: row.claimVersion,
      step: row.step,
      error: txErr.message,
    }).catch((poisonErr) => {
      logger.error(
        `Drip outbox: row ${row.id} (step ${row.step}) CRITICAL — SMTP delivered but markOutboxRowSent AND poisonOutboxRow both failed: ${txErr!.message} / ${poisonErr instanceof Error ? poisonErr.message : String(poisonErr)} (attempts=${row.attempts}/${row.maxAttempts}, attempts cap will bound further claims)`,
        "drip-worker",
      );
    });
    logger.error(
      `Drip outbox: row ${row.id} (step ${row.step}) POISONED — SMTP delivered but sentinel transaction failed after ${MARK_SENT_RETRIES} retries: ${txErr.message}`,
      "drip-worker",
    );
    return false;
  }

  return didMarkSent;
}

/**
 * Inside the post-send transaction: advance the enrollment's
 * `current_step` to the just-sent step, set `last_sent_step` (kept for
 * legacy queries / observability), and enqueue the NEXT step's outbox
 * row if there is one. When the just-sent step was the final one we
 * seal `completed_at` and skip the enqueue.
 */
async function postSendAdvanceAndEnqueueNext(
  tx: DbOrTx,
  row: s.EmailOutboxRow,
  payload: OutboxPayload,
): Promise<void> {
  // Look up the enrollment for source + unsub token. We need the source
  // to compute cadence + total steps; unsub token persists across all
  // outbox rows for this enrollment.
  const enrollmentRows = await tx
    .select()
    .from(s.dripEnrollments)
    .where(eq(s.dripEnrollments.id, row.enrollmentId))
    .limit(1);
  const enrollment = enrollmentRows[0];
  if (!enrollment) {
    // Enrollment vanished (FK CASCADE on unsubscribe). Nothing to
    // advance / enqueue — sent_at is already set on this row, leave it.
    return;
  }
  if (enrollment.completedAt) {
    // Enrollment already completed/unsubscribed. Don't enqueue further.
    return;
  }

  const total = totalStepsFor(enrollment.source);
  const justSent = row.step;
  const nextStep = justSent + 1;
  const nextAt = nextSendAtFor(enrollment.source, nextStep);
  // Pass `tx` so the enrollment advance commits atomically with
  // markOutboxRowSent + lastSentStep + enqueueOutboxRow(nextStep). A
  // rollback in this tx must roll back ALL post-SMTP state so the row
  // is re-claimable in a clean state, not partially-advanced.
  await advanceDripEnrollment({
    id: row.enrollmentId,
    toStep: justSent,
    nextSendAt: nextAt,
  }, tx);

  // markDripStepSent is preserved for legacy observability — bump
  // `last_sent_step` in the enrollment table so dashboards / audit
  // queries that joined on it still work. Inline the UPDATE to keep
  // it in the same tx.
  await tx
    .update(s.dripEnrollments)
    .set({ lastSentStep: justSent })
    .where(eq(s.dripEnrollments.id, row.enrollmentId));

  if (nextStep <= total && nextAt !== null) {
    const nextPayload: OutboxPayload = {
      kind: payload.kind,
      email: payload.email,
      name: payload.name,
      language: payload.language,
      step: nextStep,
      unsubToken: payload.unsubToken,
    };
    await enqueueOutboxRow({
      enrollmentId: row.enrollmentId,
      step: nextStep,
      payload: nextPayload,
      nextAttemptAt: nextAt,
    }, tx);
  }
}

/**
 * One-shot migration helper (Task #38, 2026-04-30): for every active
 * `drip_enrollments` row that doesn't yet have an outbox row for its
 * NEXT pending step, insert one. Required for a smooth deploy — the
 * legacy worker advanced enrollments through `next_send_at` directly,
 * so on first boot after this refactor an in-flight contact (e.g. step
 * 3 of the 6-step guide drip) would otherwise stall forever because
 * no outbox row exists for them.
 *
 * Idempotent (the unique `(enrollment_id, step)` constraint on
 * `email_outbox` makes re-runs a no-op) and bounded (one row per
 * active enrollment, at most). Runs at worker startup before the
 * first drain tick.
 */
export async function backfillOutboxFromEnrollments(): Promise<number> {
  // Find every active enrollment that has more steps to send. Joining
  // against `email_outbox` lets us SKIP rows that already have an
  // outbox row for their next step (idempotent re-runs).
  const result = await db.execute(sql`
    SELECT e.id AS "id", e.email AS "email", e.name AS "name",
           e.language AS "language", e.source AS "source",
           e.current_step AS "currentStep",
           e.last_sent_step AS "lastSentStep",
           e.next_send_at AS "nextSendAt",
           e.unsubscribe_token AS "unsubscribeToken"
      FROM drip_enrollments e
     WHERE e.completed_at IS NULL
       AND NOT EXISTS (
         SELECT 1 FROM email_outbox o
          WHERE o.enrollment_id = e.id
            AND o.sent_at IS NULL
       )
  `);
  const rows = (result as unknown as { rows: Array<{
    id: string; email: string; name: string | null; language: string | null;
    source: string | null; currentStep: number; lastSentStep: number;
    nextSendAt: string | null; unsubscribeToken: string | null;
  }> }).rows ?? [];

  let enqueued = 0;
  for (const row of rows) {
    // Reconcile sentinel: if a previous worker incarnation left
    // lastSentStep > currentStep (SMTP succeeded but advance failed),
    // count the higher value as the just-sent step so we don't re-send.
    const justSent = Math.max(row.currentStep, row.lastSentStep);
    const nextStep = justSent + 1;
    const total = totalStepsFor(row.source);
    if (nextStep > total) {
      // Should already be completed; safety-seal `completed_at` so the
      // SELECT above doesn't keep returning this row on every boot.
      await db.execute(sql`
        UPDATE drip_enrollments SET completed_at = now()
         WHERE id = ${row.id} AND completed_at IS NULL
      `);
      continue;
    }
    const kind: OutboxPayload["kind"] = row.source === "calculator" ? "calculator" : "guide";
    const payload: OutboxPayload = {
      kind,
      email: row.email,
      name: row.name,
      language: row.language ?? "es",
      step: nextStep,
      unsubToken: row.unsubscribeToken,
    };
    // Honour the legacy `next_send_at` schedule so a contact who is
    // mid-cadence doesn't get the next email immediately.
    const nextAt = row.nextSendAt ?? new Date().toISOString();
    const inserted = await enqueueOutboxRow({
      enrollmentId: row.id,
      step: nextStep,
      payload,
      nextAttemptAt: nextAt,
    });
    if (inserted) enqueued++;
  }
  if (enqueued > 0) {
    logger.info(`Drip outbox backfill: enqueued ${enqueued} legacy enrollment(s) into the outbox`, "drip-worker");
  }
  return enqueued;
}

async function drainOnce(): Promise<void> {
  if (_draining) return;
  _draining = true;
  try {
    const claimed = await claimDueOutboxRows({
      limit: CLAIM_BATCH_SIZE,
      staleSeconds: STALE_CLAIM_SECONDS,
    });
    if (claimed.length === 0) return;

    for (const row of claimed) {
      await sendOutboxRow(row);
    }
  } catch (err) {
    logger.warn(
      `Drip outbox: drain error: ${err instanceof Error ? err.message : String(err)}`,
      "drip-worker",
    );
  } finally {
    _draining = false;
  }
}

/**
 * Test-only: invoke a single drain pass synchronously. Used by
 * `tests/drip-exactly-once.test.ts` to reproduce the residual scenarios
 * without waiting on the worker timer. Hard-guarded against production
 * (see `assertTestHookAllowed` above).
 */
export async function _drainOnceForTests(): Promise<void> {
  assertTestHookAllowed("_drainOnceForTests");
  await drainOnce();
}

/**
 * Wake the worker out of band so a freshly enqueued outbox row is
 * dispatched without waiting a full polling interval. Safe to call
 * from a route handler post-commit — it's a fire-and-forget single
 * drain pass; concurrent invocations short-circuit via the
 * `_draining` guard.
 */
export function wakeOutboxWorker(): void {
  // Defer to the next tick so the route handler's HTTP response is
  // already on the wire before we start hitting the DB again.
  setTimeout(() => { void drainOnce(); }, 0).unref();
}

export function startDripWorker(intervalMs = 60_000): NodeJS.Timeout {
  if (_worker) return _worker;
  _worker = setInterval(() => { void drainOnce(); }, intervalMs);
  _worker.unref();
  // Boot sequence:
  //   1. Backfill outbox rows for any legacy enrollment that pre-dates
  //      the outbox model (idempotent — see `backfillOutboxFromEnrollments`
  //      docstring). Without this, the first deploy of Task #38 would
  //      strand in-flight contacts whose enrollment exists but whose
  //      next-step outbox row was never enqueued by a route handler.
  //   2. Drain once so steps that became due while the process was down
  //      fire without waiting a full polling interval.
  setTimeout(() => {
    backfillOutboxFromEnrollments()
      .catch((err) => logger.warn(
        `Drip outbox: backfill failed (will retry on next restart): ${err instanceof Error ? err.message : String(err)}`,
        "drip-worker",
      ))
      .finally(() => { void drainOnce(); });
  }, 5_000).unref();
  logger.info(`Drip outbox worker: started (interval ${intervalMs}ms)`, "drip-worker");
  return _worker;
}

export function stopDripWorker(): void {
  if (_worker) {
    clearInterval(_worker);
    _worker = null;
  }
}

// Re-export `db` for the test scenario that needs to manipulate the
// outbox table directly. Keeping the import surface narrow.
export { db };
