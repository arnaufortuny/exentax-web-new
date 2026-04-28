/**
 * Drip-sequence worker
 * --------------------
 * Polls `drip_enrollments` for rows whose `next_send_at` is due, claims
 * them atomically (`SELECT ... FOR UPDATE SKIP LOCKED` via the storage
 * helper), sends the next nurture step, and either schedules the next
 * step or marks the enrollment completed.
 *
 * The cadence is days 0, 3, 6, 9, 12, 15 — i.e. step 1 fires immediately
 * (sent inline by the route handler at enroll-time, not by this worker)
 * and steps 2–6 each follow the previous one by `STEP_DELAY_MS = 3 days`.
 *
 * Failures are non-fatal: the storage helper records `last_error` and
 * releases the claim, so the row will be retried on the next due tick
 * (next_send_at is unchanged on failure — we don't compound delays).
 */
import { logger } from "../logger";
import { sendDripEmailOnce } from "../email";
import {
  claimDueDripEnrollments,
  advanceDripEnrollment,
  markDripEnrollmentError,
} from "../storage/marketing";

const STEP_DELAY_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

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
 * `null` when `nextStep` is past the final step (6) — the storage
 * helper interprets that as "completed", clearing `next_send_at` and
 * setting `completed_at`.
 */
function nextSendAtFor(nextStep: number): string | null {
  if (nextStep > 6) return null;
  return new Date(Date.now() + STEP_DELAY_MS).toISOString();
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
      // currentStep is the LAST sent step (0 means none sent yet). The
      // step we are about to send is currentStep + 1, capped at 6.
      const stepToSend = Math.min(6, (row.currentStep ?? 0) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      try {
        await sendDripEmailOnce({
          email: row.email,
          name: row.name ?? null,
          language: row.language,
          step: stepToSend,
          unsubToken: (row as { unsubscribeToken?: string | null }).unsubscribeToken ?? null,
        });
        await advanceDripEnrollment({
          id: row.id,
          toStep: stepToSend,
          nextSendAt: nextSendAtFor(stepToSend + 1),
        });
        logger.info(
          `Drip worker: enrollment ${row.id} advanced to step ${stepToSend}${stepToSend === 6 ? " (completed)" : ""}`,
          "drip-worker",
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await markDripEnrollmentError({ id: row.id, error: message });
        logger.warn(
          `Drip worker: enrollment ${row.id} step ${stepToSend} failed: ${message.slice(0, 200)}`,
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
 * Helper for the route layer: schedule step 1 to fire immediately
 * after a fresh enrollment is created. Sent in fire-and-forget mode
 * because the HTTP response should not wait on Gmail RTT.
 *
 * On failure, the enrollment row keeps `current_step = 0` and the
 * worker will pick it up on its next tick (next_send_at is "now()").
 */
export async function sendImmediateStep1(args: {
  id: string;
  email: string;
  name: string | null;
  language: string;
  unsubToken?: string | null;
}): Promise<void> {
  try {
    await sendDripEmailOnce({
      email: args.email,
      name: args.name,
      language: args.language,
      step: 1,
      unsubToken: args.unsubToken ?? null,
    });
    await advanceDripEnrollment({
      id: args.id,
      toStep: 1,
      nextSendAt: nextSendAtFor(2),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markDripEnrollmentError({ id: args.id, error: message }).catch(() => {});
    logger.warn(
      `Drip immediate step 1 failed for ${args.id} (worker will retry): ${message.slice(0, 200)}`,
      "drip-worker",
    );
  }
}
