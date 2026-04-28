/**
 * Persistent email retry queue.
 *
 * Buffers transactional emails (booking confirmations, reminders,
 * reschedule/cancel/no-show notices, post-meeting follow-ups, calculator
 * reports, incomplete-booking reminders) and the drip-sequence steps
 * that failed to send because Gmail was not configured at the time of
 * the event, or because the underlying transport raised a transient
 * error. The queue is durable (Postgres-backed) so retries survive
 * process restarts and rolling deploys.
 *
 * The weekly newsletter broadcast is intentionally NOT routed through
 * this queue: it has its own resumable job table
 * (`newsletter_campaign_jobs`) that the broadcast worker uses to
 * checkpoint per-recipient progress and a 2/sec throttle, so unifying
 * here would double-retry. The drip-worker also does not enqueue: it
 * uses the throwing `sendDripEmailOnce()` and re-claims the row on the
 * next worker tick if the send failed (`next_send_at` is left
 * unchanged on error so cadence is preserved). The retry queue
 * therefore covers booking + calculator + incomplete-booking flows;
 * `drip_step` and `newsletter_broadcast` types are kept in the schema
 * so that ad-hoc callers (test scripts, future re-routing) can use the
 * `withRetryQueue` wrapper without schema churn, but the production
 * paths bypass this queue.
 *
 * The queue is intentionally tiny in surface area:
 *   - `enqueueEmail(type, payload)`         → persist a job
 *   - `registerEmailRetryHandler(type, fn)` → bind a sender to a type
 *   - `startEmailRetryWorker(intervalMs)`   → poll every N ms and re-attempt
 *
 * Backoff is computed from `attempts`: 1m, 5m, 15m, 1h, 4h, 12h (cap).
 * After `MAX_ATTEMPTS` the row is left in place with `attempts >= max` so
 * an operator can inspect it; the worker stops trying.
 *
 * Adding a new template = three steps: (1) add the literal to
 * `EmailRetryType`, (2) call `registerEmailRetryHandler(type, fn)` from
 * `email.ts`, (3) wrap the new sender with `enqueueEmail(type, …)` on
 * the failure path. No changes to this file are required beyond #1.
 */

import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, type DbOrTx } from "./db";
import { emailRetryQueue, type InsertEmailRetryJob, type EmailRetryJob } from "../shared/schema";
import { logger } from "./logger";

export type EmailRetryType =
  | "booking_confirmation"
  | "booking_reminder"
  | "reschedule_notification"
  | "cancellation_notification"
  | "no_show_followup"
  | "post_meeting_followup"
  | "calculator_report"
  | "incomplete_booking_reminder"
  | "drip_step"
  | "calc_drip_step"
  | "newsletter_broadcast";

const MAX_ATTEMPTS = 6;
// A row whose `claimed_at` is older than this is considered abandoned by a
// worker that crashed mid-send and becomes re-claimable. Must be safely larger
// than the worst-case email send latency (Gmail timeouts + circuit-breaker
// retries) so we don't yank a row out from under an in-flight handler.
const STALE_CLAIM_MS = 10 * 60_000;
const CLAIM_BATCH_SIZE = 20;
const BACKOFF_MS_BY_ATTEMPT = [
  60_000,        // 1 min
  5 * 60_000,    // 5 min
  15 * 60_000,   // 15 min
  60 * 60_000,   // 1 h
  4 * 60 * 60_000,   // 4 h
  12 * 60 * 60_000,  // 12 h
];

let _worker: NodeJS.Timeout | null = null;
let _draining = false;
// Monotonic timestamp of the last completed drain attempt (success or
// caught failure). Used by `/api/health/ready` to detect a stuck or
// crashed worker without paying for a DB round-trip per probe.
let _lastDrainAt = 0;
let _workerIntervalMs = 60_000;

export function getEmailWorkerHeartbeat(): { lastDrainAt: number; intervalMs: number; running: boolean } {
  return { lastDrainAt: _lastDrainAt, intervalMs: _workerIntervalMs, running: _worker !== null };
}

function nextAttemptAtIso(attempts: number): string {
  const idx = Math.max(0, Math.min(attempts, BACKOFF_MS_BY_ATTEMPT.length - 1));
  const delay = BACKOFF_MS_BY_ATTEMPT[idx];
  return new Date(Date.now() + delay).toISOString();
}

export async function enqueueEmail(
  type: EmailRetryType,
  payload: unknown,
  opts?: { reason?: string; tx?: DbOrTx; immediate?: boolean },
): Promise<string | null> {
  const conn: DbOrTx = opts?.tx ?? db;
  // When the caller passes a transaction, atomicity is the whole point of
  // this code path: if the queue insert fails, the surrounding write (e.g.
  // creating an `agenda` row) MUST roll back so we never end up with a
  // booking in the DB that has no confirmation email queued. We therefore
  // let the error propagate. For fire-and-forget callers (no `tx`) we keep
  // the soft behaviour and return null on insert failure.
  const strict = opts?.tx != null;
  try {
    const row: InsertEmailRetryJob = {
      id: randomUUID(),
      emailType: type,
      payload: JSON.stringify(payload),
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      lastError: opts?.reason ?? null,
      // When `immediate=true`, schedule the job to be due NOW so the
      // post-commit drain trigger can pick it up on the very next tick.
      // Otherwise apply normal first-attempt backoff.
      nextAttemptAt: opts?.immediate
        ? new Date().toISOString()
        : nextAttemptAtIso(0),
    };
    await conn.insert(emailRetryQueue).values(row);
    logger.info(`Email retry queue: enqueued ${type} job ${row.id} (reason: ${opts?.reason ?? "transient"})`, "email-retry");
    return row.id;
  } catch (err) {
    logger.warn(
      `Email retry queue: enqueue failed for ${type}: ${err instanceof Error ? err.message : String(err)}`,
      "email-retry",
    );
    if (strict) throw err;
    return null;
  }
}

/**
 * Trigger an immediate drain attempt outside the worker interval. Used by
 * write paths that just enqueued a job atomically (inside their tx) and want
 * the email to go out on the next tick instead of waiting up to `intervalMs`.
 * Safe to call concurrently — the internal `_draining` guard de-duplicates.
 */
export function triggerEmailDrain(): void {
  setImmediate(() => { void drainOnce(); });
}

type SendFn = (payload: unknown) => Promise<void>;

const handlers = new Map<EmailRetryType, SendFn>();

export function registerEmailRetryHandler(type: EmailRetryType, fn: SendFn): void {
  handlers.set(type, fn);
}

/**
 * Atomically claim up to `CLAIM_BATCH_SIZE` due rows for this worker.
 *
 * Uses `SELECT ... FOR UPDATE SKIP LOCKED` inside an `UPDATE ... RETURNING`
 * so concurrent worker instances (horizontal scaling, rolling deploys) cannot
 * observe — let alone send — the same row under normal conditions. A row is
 * "due" when:
 *   - `next_attempt_at <= now`
 *   - `attempts < max_attempts`
 *   - it is unclaimed, OR its claim is older than `STALE_CLAIM_MS`
 *     (treated as a crashed worker that failed to release).
 *
 * Both `now` and the stale-claim cutoff are evaluated using Postgres `now()`
 * rather than the calling process's clock, so workers on hosts with skewed
 * system clocks still agree on what counts as stale. The claim itself is
 * durable (`claimed_at` column), so even a process that crashes after the
 * claim but before the send simply leaves the row hidden for `STALE_CLAIM_MS`
 * before another worker rescues it.
 */
async function claimDueJobs(): Promise<EmailRetryJob[]> {
  const staleSeconds = Math.floor(STALE_CLAIM_MS / 1000);
  const claimed = await db.execute(sql`
    UPDATE email_retry_queue AS q
       SET claimed_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
     WHERE q.id IN (
       SELECT id FROM email_retry_queue
        WHERE next_attempt_at <= to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
          AND attempts < max_attempts
          AND (
            claimed_at IS NULL
            OR claimed_at < to_char((now() - (${staleSeconds} || ' seconds')::interval) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
          )
        ORDER BY next_attempt_at
        LIMIT ${CLAIM_BATCH_SIZE}
        FOR UPDATE SKIP LOCKED
     )
    RETURNING q.id, q.email_type AS "emailType", q.payload, q.attempts,
              q.max_attempts AS "maxAttempts", q.last_error AS "lastError",
              q.next_attempt_at AS "nextAttemptAt", q.claimed_at AS "claimedAt",
              q.fecha_creacion AS "createdAt"
  `);
  // node-postgres returns { rows }; drizzle's execute exposes them on `.rows`.
  const rows = (claimed as unknown as { rows: EmailRetryJob[] }).rows ?? [];
  return rows;
}

async function drainOnce(): Promise<void> {
  if (_draining) return;
  _draining = true;
  try {
    const due = await claimDueJobs();
    if (due.length === 0) return;

    for (const job of due) {
      const handler = handlers.get(job.emailType as EmailRetryType);
      if (!handler) {
        logger.warn(`Email retry queue: no handler registered for type '${job.emailType}', skipping`, "email-retry");
        continue;
      }
      let payload: unknown;
      try {
        payload = JSON.parse(job.payload);
      } catch (err) {
        logger.warn(`Email retry queue: corrupt payload for job ${job.id}, removing`, "email-retry");
        await db.delete(emailRetryQueue).where(eq(emailRetryQueue.id, job.id));
        continue;
      }
      try {
        await handler(payload);
        await db.delete(emailRetryQueue).where(eq(emailRetryQueue.id, job.id));
        logger.info(`Email retry queue: ${job.emailType} job ${job.id} sent successfully (attempt ${job.attempts + 1})`, "email-retry");
      } catch (err) {
        const attempts = (job.attempts ?? 0) + 1;
        const message = err instanceof Error ? err.message : String(err);
        await db.update(emailRetryQueue)
          .set({
            attempts,
            lastError: message.slice(0, 500),
            nextAttemptAt: nextAttemptAtIso(attempts),
            // Release the claim so any worker (this one or another instance)
            // can pick the row up at the next due time. Backoff alone now
            // governs the delay.
            claimedAt: null,
          })
          .where(eq(emailRetryQueue.id, job.id));
        if (attempts >= (job.maxAttempts ?? MAX_ATTEMPTS)) {
          logger.error(
            `Email retry queue: ${job.emailType} job ${job.id} exhausted retries (${attempts}/${job.maxAttempts}); left in queue for inspection`,
            "email-retry",
          );
        } else {
          logger.warn(
            `Email retry queue: ${job.emailType} job ${job.id} failed attempt ${attempts}: ${message.slice(0, 200)}`,
            "email-retry",
          );
        }
      }
    }
  } catch (err) {
    logger.warn(
      `Email retry queue: drain error: ${err instanceof Error ? err.message : String(err)}`,
      "email-retry",
    );
  } finally {
    _draining = false;
    _lastDrainAt = Date.now();
  }
}

export function startEmailRetryWorker(intervalMs = 60_000): NodeJS.Timeout {
  if (_worker) return _worker;
  _workerIntervalMs = intervalMs;
  _worker = setInterval(() => { void drainOnce(); }, intervalMs);
  _worker.unref();
  // Fire one immediate drain on startup so jobs that became due while the
  // process was down are processed without waiting a full interval.
  setTimeout(() => { void drainOnce(); }, 5_000).unref();
  logger.info(`Email retry queue: worker started (interval ${intervalMs}ms)`, "email-retry");
  return _worker;
}

/**
 * Snapshot of queue size for `/api/metrics`. Cheap (single COUNT). Best-effort:
 * any failure returns 0 so a transient DB blip never crashes the metrics path.
 */
export async function getEmailRetryQueueSize(): Promise<number> {
  try {
    const result = await db.execute(sql`SELECT count(*)::int AS n FROM email_retry_queue WHERE attempts < max_attempts`);
    const rows = (result as unknown as { rows: { n: number }[] }).rows ?? [];
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

export function stopEmailRetryWorker(): void {
  if (_worker) {
    clearInterval(_worker);
    _worker = null;
  }
}
