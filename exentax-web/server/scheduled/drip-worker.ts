/**
 * Drip-sequence worker
 * --------------------
 * Polls `drip_enrollments` for rows whose `next_send_at` is due, claims
 * them atomically (`SELECT ... FOR UPDATE SKIP LOCKED` via the storage
 * helper), sends the next nurture step, and either schedules the next
 * step or marks the enrollment completed.
 *
 * Per-source cadence:
 *  - `guide`      → 6 steps, 3-day cadence (days 0/3/6/9/12/15). Step 1
 *    fires immediately (sent inline by the route handler at enroll-time
 *    via `sendImmediateStep1`); the worker fires steps 2..6.
 *  - `calculator` → 3 nurture steps, 2-day cadence (days 2/4/6 from
 *    enrollment). The IMMEDIATE personalised report email on day 0 is
 *    sent inline by the calculator route via `sendCalculatorEmail` and
 *    is NOT counted as a drip step — the row enters with
 *    `currentStep = 0` and `next_send_at = now() + 2d`, so the worker
 *    fires step 1 first.
 *
 * Note: a third `booking` cohort existed historically (Audit 05, §5.2).
 * The booking flow stopped enrolling new rows ages ago — the booking
 * spec became "confirmation + day-before reminder + newsletter
 * membership", with no drip sequence — and the cohort was retired in
 * Task #41 (2026-04-30) once the production DB was confirmed empty of
 * legacy in-flight rows. The schema CHECK constraint on
 * `drip_enrollments.source` now disallows the value entirely.
 *
 * Failures are non-fatal: the storage helper records `last_error` and
 * releases the claim, so the row will be retried on the next due tick
 * (next_send_at is unchanged on failure — we don't compound delays).
 */
import { logger } from "../logger";
import { sendDripEmailOnce, sendCalcDripEmailOnce } from "../email";
import {
  claimDueDripEnrollments,
  advanceDripEnrollment,
  markDripEnrollmentError,
  markDripStepSent,
  poisonDripEnrollment,
  tryClaimDripEnrollmentForImmediate,
} from "../storage/marketing";

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

let _worker: NodeJS.Timeout | null = null;
let _draining = false;

/**
 * Compute the ISO timestamp for the next step's send time. Returns
 * `null` when `nextStep` is past the final step for this source — the
 * storage helper interprets that as "completed", clearing
 * `next_send_at` and setting `completed_at`.
 */
function nextSendAtFor(source: string | null | undefined, nextStep: number): string | null {
  if (nextStep > totalStepsFor(source)) return null;
  return new Date(Date.now() + delayMsFor(source)).toISOString();
}

type ClaimedDripRow = Awaited<ReturnType<typeof claimDueDripEnrollments>>[number];

/**
 * Test-only injection hook so `tests/drip-exactly-once.test.ts` can
 * count send invocations without touching ESM-frozen exports. Set via
 * `_setSendOverridesForTests` in test setup; default is `null` and the
 * production import path is used.
 */
type GuideSender = typeof sendDripEmailOnce;
type CalcSender = typeof sendCalcDripEmailOnce;
type AdvanceFn = typeof advanceDripEnrollment;
type MarkSentFn = typeof markDripStepSent;
let _testGuideSender: GuideSender | null = null;
let _testCalcSender: CalcSender | null = null;
let _testAdvance: AdvanceFn | null = null;
let _testMarkSent: MarkSentFn | null = null;

export function _setSendOverridesForTests(opts: {
  guide?: GuideSender | null;
  calc?: CalcSender | null;
  advance?: AdvanceFn | null;
  markSent?: MarkSentFn | null;
}): void {
  if (opts.guide !== undefined) _testGuideSender = opts.guide;
  if (opts.calc !== undefined) _testCalcSender = opts.calc;
  if (opts.advance !== undefined) _testAdvance = opts.advance;
  if (opts.markSent !== undefined) _testMarkSent = opts.markSent;
}

/**
 * Dispatch the right sender for the row's `source`. Calc-drip steps
 * are typed 1..3; guide steps are 1..6. The narrowing is safe because
 * `stepToSend` is already clamped to `totalStepsFor(source)` by the
 * caller.
 */
async function dispatchStep(row: ClaimedDripRow, stepToSend: number): Promise<void> {
  const basePayload = {
    email: row.email,
    name: row.name ?? null,
    language: row.language,
    unsubToken: (row as { unsubscribeToken?: string | null }).unsubscribeToken ?? null,
  };
  if (row.source === "calculator") {
    const send = _testCalcSender ?? sendCalcDripEmailOnce;
    await send({ ...basePayload, step: stepToSend as 1 | 2 | 3 });
    return;
  }
  const send = _testGuideSender ?? sendDripEmailOnce;
  await send({ ...basePayload, step: stepToSend as 1 | 2 | 3 | 4 | 5 | 6 });
}

async function drainOnce(): Promise<void> {
  if (_draining) return;
  _draining = true;
  try {
    const claimed = await claimDueDripEnrollments({
      limit: CLAIM_BATCH_SIZE,
      staleSeconds: STALE_CLAIM_SECONDS,
    });
    if (claimed.length === 0) return;

    for (const row of claimed) {
      const total = totalStepsFor(row.source);
      // currentStep is the LAST sent step (0 means none sent yet). The
      // step we are about to send is currentStep + 1, capped at the
      // per-source total.
      const stepToSend = Math.min(total, (row.currentStep ?? 0) + 1);
      // A2 fix: exactly-once dispatch sentinel. If `lastSentStep` is
      // already at-or-above `stepToSend`, a previous worker pass
      // successfully completed the SMTP send for this step and crashed
      // (or errored) before `advanceDripEnrollment` committed. Re-running
      // `dispatchStep` here would deliver a duplicate marketing email.
      // Skip the send and only re-attempt the advance, which is the only
      // unfinished step in the previous pass.
      const lastSent = (row as { lastSentStep?: number | null }).lastSentStep ?? 0;
      const alreadySent = lastSent >= stepToSend;

      // ─── Phase 1: SMTP dispatch ────────────────────────────────────────
      // Failures here are safely retryable — nothing has been delivered.
      // We release the claim via markDripEnrollmentError and the next
      // worker pass will retry from scratch.
      if (!alreadySent) {
        try {
          await dispatchStep(row, stepToSend);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          await markDripEnrollmentError({ id: row.id, error: message });
          logger.warn(
            `Drip worker: enrollment ${row.id} (${row.source}) step ${stepToSend} dispatch failed: ${message.slice(0, 200)}`,
            "drip-worker",
          );
          continue;
        }

        // ─── Phase 2: persist exactly-once sentinel ──────────────────────
        // SMTP succeeded. We MUST record `last_sent_step = stepToSend`
        // before any path that could release the claim, or the next pass
        // would re-send the same email. Retry up to MARK_SENT_RETRIES
        // times with exponential backoff to absorb transient DB blips. If
        // it still fails, POISON the row (NULL `next_send_at` while
        // KEEPING `claimed_at` set) so neither the claim selector nor
        // the staleness sweeper can re-select it. Operator triage is
        // required — see `poisonDripEnrollment` docstring.
        const MARK_SENT_RETRIES = 3;
        let markErr: Error | null = null;
        const markSent = _testMarkSent ?? markDripStepSent;
        for (let attempt = 1; attempt <= MARK_SENT_RETRIES; attempt++) {
          try {
            await markSent({ id: row.id, toStep: stepToSend });
            markErr = null;
            break;
          } catch (err) {
            markErr = err instanceof Error ? err : new Error(String(err));
            if (attempt < MARK_SENT_RETRIES) {
              await new Promise((r) => setTimeout(r, 100 * 3 ** (attempt - 1)));
            }
          }
        }
        if (markErr) {
          // Best-effort poison. If even this UPDATE fails, the staleness
          // sweeper would eventually re-claim — but at that point the DB
          // is so degraded that broader alarms will have fired. Log
          // critical and abandon the row for this pass.
          await poisonDripEnrollment({
            id: row.id,
            step: stepToSend,
            error: markErr.message,
          }).catch((poisonErr) => {
            logger.error(
              `Drip worker: enrollment ${row.id} (${row.source}) step ${stepToSend} CRITICAL — SMTP delivered but markDripStepSent AND poisonDripEnrollment both failed: ${markErr!.message} / ${poisonErr instanceof Error ? poisonErr.message : String(poisonErr)}`,
              "drip-worker",
            );
          });
          logger.error(
            `Drip worker: enrollment ${row.id} (${row.source}) step ${stepToSend} POISONED — SMTP delivered but sentinel write failed after ${MARK_SENT_RETRIES} retries: ${markErr.message}`,
            "drip-worker",
          );
          continue;
        }
      }

      // ─── Phase 3: advance currentStep ─────────────────────────────────
      // If this fails the claim is released by markDripEnrollmentError,
      // but the next pass sees `lastSentStep >= stepToSend` and takes
      // the `alreadySent` branch — only the advance is retried, the
      // SMTP send is NOT repeated. This is the recovery path covered
      // by `tests/drip-exactly-once.test.ts`.
      try {
        const advance = _testAdvance ?? advanceDripEnrollment;
        await advance({
          id: row.id,
          toStep: stepToSend,
          nextSendAt: nextSendAtFor(row.source, stepToSend + 1),
        });
        const completed = stepToSend >= total ? " (completed)" : "";
        const recovered = alreadySent ? " (recovered: send was already sent, advance retried)" : "";
        logger.info(
          `Drip worker: enrollment ${row.id} (${row.source}) advanced to step ${stepToSend}${completed}${recovered}`,
          "drip-worker",
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await markDripEnrollmentError({ id: row.id, error: message });
        logger.warn(
          `Drip worker: enrollment ${row.id} (${row.source}) step ${stepToSend} advance failed: ${message.slice(0, 200)}`,
          "drip-worker",
        );
      }
    }
  } catch (err) {
    logger.warn(
      `Drip worker: drain error: ${err instanceof Error ? err.message : String(err)}`,
      "drip-worker",
    );
  } finally {
    _draining = false;
  }
}

/**
 * Test-only: invoke a single drain pass synchronously. Used by
 * `tests/drip-exactly-once.test.ts` to reproduce the
 * dispatch-OK + advance-fail race without waiting on the worker timer.
 * Not part of the public worker API — production code paths should use
 * `startDripWorker` so the interval scheduler owns the cadence.
 */
export async function _drainOnceForTests(): Promise<void> {
  await drainOnce();
}

export function startDripWorker(intervalMs = 60_000): NodeJS.Timeout {
  if (_worker) return _worker;
  _worker = setInterval(() => { void drainOnce(); }, intervalMs);
  _worker.unref();
  // Fire one immediate drain on startup so steps that became due while
  // the process was down are processed without waiting a full interval.
  setTimeout(() => { void drainOnce(); }, 5_000).unref();
  logger.info(`Drip worker: started (interval ${intervalMs}ms)`, "drip-worker");
  return _worker;
}

export function stopDripWorker(): void {
  if (_worker) {
    clearInterval(_worker);
    _worker = null;
  }
}

/**
 * Helper for the route layer: schedule guide-drip step 1 to fire
 * immediately after a fresh GUIDE enrollment is created. Sent in
 * fire-and-forget mode because the HTTP response should not wait on
 * Gmail RTT.
 *
 * On failure, the enrollment row keeps `current_step = 0` and the
 * worker will pick it up on its next tick (next_send_at is "now()").
 *
 * Calculator enrollments do NOT use this helper — their day-0 email
 * is the personalised report sent inline by the calculator route via
 * `sendCalculatorEmail`, and the row is created with
 * `next_send_at = now() + 2d` so the worker fires step 1 (Laura case)
 * after the cadence delay.
 */
export async function sendImmediateStep1(args: {
  id: string;
  email: string;
  name: string | null;
  language: string;
  unsubToken?: string | null;
}): Promise<void> {
  // ─── Phase 0: atomic claim ────────────────────────────────────────────
  // The newsletter / calculator routes call this fire-and-forget right
  // after `tryCreateDripEnrollment(next_send_at = now())`. Without a
  // claim, the worker `drainTick` running concurrently could pick up
  // the same row via `claimDueDripEnrollments` and dispatch step 1 in
  // parallel — both paths would fire SMTP before either's
  // `markDripStepSent` becomes visible. We acquire the same per-row
  // `claimed_at` lock the worker uses; if another worker already owns
  // it we abort silently (that worker will dispatch).
  let owned = false;
  try {
    owned = await tryClaimDripEnrollmentForImmediate({ id: args.id, expectedStep: 1 });
  } catch (err) {
    // DB error trying to claim is treated as "do nothing" — worker
    // will pick the row up on its next tick (next_send_at <= now()).
    logger.warn(
      `Drip immediate step 1: claim attempt failed for ${args.id}, deferring to worker: ${err instanceof Error ? err.message : String(err)}`,
      "drip-worker",
    );
    return;
  }
  if (!owned) {
    logger.info(
      `Drip immediate step 1: enrollment ${args.id} already claimed (worker raced or step 1 already sent) — deferring`,
      "drip-worker",
    );
    return;
  }

  // ─── Phase 1: SMTP dispatch ────────────────────────────────────────────
  // Failures here are safely retryable — nothing was delivered. Release
  // the claim with markDripEnrollmentError so the worker picks it up.
  // Routed through `_testGuideSender` so the exactly-once regression
  // test can stub SMTP without hitting Gmail.
  try {
    const send = _testGuideSender ?? sendDripEmailOnce;
    await send({
      email: args.email,
      name: args.name,
      language: args.language,
      step: 1,
      unsubToken: args.unsubToken ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markDripEnrollmentError({ id: args.id, error: message }).catch((markErr) => {
      logger.warn(
        `Drip immediate step 1: markDripEnrollmentError failed for ${args.id}: ${markErr instanceof Error ? markErr.message : String(markErr)}`,
        "drip-worker",
      );
    });
    logger.warn(
      `Drip immediate step 1 dispatch failed for ${args.id} (worker will retry): ${message.slice(0, 200)}`,
      "drip-worker",
    );
    return;
  }

  // ─── Phase 2: persist exactly-once sentinel ──────────────────────────
  // SMTP succeeded. We MUST record `last_sent_step = 1` before any path
  // that could release the claim, or the worker would re-send step 1
  // when it picks the row up later. Identical retry+poison policy as
  // the worker `drainOnce` — see that block for the rationale. Routed
  // through `_testMarkSent` so the regression test can stub failures.
  const MARK_SENT_RETRIES = 3;
  let markErr: Error | null = null;
  const markSent = _testMarkSent ?? markDripStepSent;
  for (let attempt = 1; attempt <= MARK_SENT_RETRIES; attempt++) {
    try {
      await markSent({ id: args.id, toStep: 1 });
      markErr = null;
      break;
    } catch (err) {
      markErr = err instanceof Error ? err : new Error(String(err));
      if (attempt < MARK_SENT_RETRIES) {
        await new Promise((r) => setTimeout(r, 100 * 3 ** (attempt - 1)));
      }
    }
  }
  if (markErr) {
    await poisonDripEnrollment({ id: args.id, step: 1, error: markErr.message }).catch((poisonErr) => {
      logger.error(
        `Drip immediate step 1: enrollment ${args.id} CRITICAL — SMTP delivered but markDripStepSent AND poisonDripEnrollment both failed: ${markErr!.message} / ${poisonErr instanceof Error ? poisonErr.message : String(poisonErr)}`,
        "drip-worker",
      );
    });
    logger.error(
      `Drip immediate step 1: enrollment ${args.id} POISONED — SMTP delivered but sentinel write failed after ${MARK_SENT_RETRIES} retries: ${markErr.message}`,
      "drip-worker",
    );
    return;
  }

  // ─── Phase 3: advance currentStep ─────────────────────────────────────
  // If this fails the claim is released; the worker's next pass sees
  // `lastSentStep >= 1` and takes the `alreadySent` branch — only the
  // advance is retried, the SMTP send is NOT repeated.
  try {
    await advanceDripEnrollment({
      id: args.id,
      toStep: 1,
      nextSendAt: nextSendAtFor("guide", 2),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markDripEnrollmentError({ id: args.id, error: message }).catch((markErr2) => {
      logger.warn(
        `Drip immediate step 1: markDripEnrollmentError failed for ${args.id}: ${markErr2 instanceof Error ? markErr2.message : String(markErr2)}`,
        "drip-worker",
      );
    });
    logger.warn(
      `Drip immediate step 1 advance failed for ${args.id} (worker will retry advance only): ${message.slice(0, 200)}`,
      "drip-worker",
    );
  }
}
