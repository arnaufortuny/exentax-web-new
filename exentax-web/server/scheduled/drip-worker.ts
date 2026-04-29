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
 *  - `booking`    → legacy. New booking submissions no longer enroll
 *    (the spec is: booking gets the confirmation + day-before reminder
 *    only, plus newsletter membership). Existing in-flight rows keep
 *    completing on the original 6-step / 3-day cadence so we don't
 *    drop them mid-sequence.
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
} from "../storage/marketing";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const STEP_DELAY_MS_BY_SOURCE: Record<string, number> = {
  guide: 3 * ONE_DAY_MS,
  booking: 3 * ONE_DAY_MS, // legacy — kept for in-flight rows
  calculator: 2 * ONE_DAY_MS,
};
const TOTAL_STEPS_BY_SOURCE: Record<string, number> = {
  guide: 6,
  booking: 6, // legacy
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
 * Dispatch the right sender for the row's `source`. Calc-drip steps
 * are typed 1..3; guide/booking steps are 1..6. The narrowing is safe
 * because `stepToSend` is already clamped to `totalStepsFor(source)`
 * by the caller.
 */
async function dispatchStep(row: ClaimedDripRow, stepToSend: number): Promise<void> {
  const basePayload = {
    email: row.email,
    name: row.name ?? null,
    language: row.language,
    unsubToken: (row as { unsubscribeToken?: string | null }).unsubscribeToken ?? null,
  };
  if (row.source === "calculator") {
    await sendCalcDripEmailOnce({ ...basePayload, step: stepToSend as 1 | 2 | 3 });
    return;
  }
  await sendDripEmailOnce({ ...basePayload, step: stepToSend as 1 | 2 | 3 | 4 | 5 | 6 });
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
      try {
        await dispatchStep(row, stepToSend);
        await advanceDripEnrollment({
          id: row.id,
          toStep: stepToSend,
          nextSendAt: nextSendAtFor(row.source, stepToSend + 1),
        });
        const completed = stepToSend >= total ? " (completed)" : "";
        logger.info(
          `Drip worker: enrollment ${row.id} (${row.source}) advanced to step ${stepToSend}${completed}`,
          "drip-worker",
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await markDripEnrollmentError({ id: row.id, error: message });
        logger.warn(
          `Drip worker: enrollment ${row.id} (${row.source}) step ${stepToSend} failed: ${message.slice(0, 200)}`,
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
      nextSendAt: nextSendAtFor("guide", 2),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // No dejar el fallo de marcado en silencio: si la fila no se puede
    // marcar como errónea, registramos el motivo para que el operador
    // sepa que la próxima pasada del worker la verá con el `currentStep`
    // intacto y la reintentará igualmente (fail-soft).
    await markDripEnrollmentError({ id: args.id, error: message }).catch((markErr) => {
      logger.warn(
        `Drip immediate step 1: markDripEnrollmentError failed for ${args.id}: ${markErr instanceof Error ? markErr.message : String(markErr)}`,
        "drip-worker",
      );
    });
    logger.warn(
      `Drip immediate step 1 failed for ${args.id} (worker will retry): ${message.slice(0, 200)}`,
      "drip-worker",
    );
  }
}
