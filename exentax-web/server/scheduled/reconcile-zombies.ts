/**
 * Reconcile-agenda-zombies — daily safety sweep.
 *
 * Runs the same drift detection as `scripts/reconcile-agenda-zombies.ts`
 * once per day in dry-run mode. A green run is silent; any non-zero finding
 * fires a single embed to the Discord `#sistema-errores` channel summarising
 * the four buckets so an operator can review and re-run the script with
 * `--apply` to actually delete the stranded Google Calendar events.
 *
 * Why dry-run only:
 *   The repair path (bucket A) deletes external Google Calendar events.
 *   Although idempotent and safe, we still want a human to glance at the
 *   summary first — drift counts in the double digits would normally
 *   indicate a Google API outage in progress, and blind --apply during an
 *   outage would silently swallow legitimate retries. Operators run the
 *   --apply flag manually after reviewing.
 *
 * Why daily at 06:00 server time:
 *   Bookings tail off after 23:00 Madrid and pick up again around 09:00,
 *   so 06:00 is the quietest window — any cancel/reschedule mid-flight is
 *   already finished and there are no fresh Google API calls competing.
 *
 * Idempotency / multi-instance safety:
 *   - `_lastRunDate` (process-local) skips a second tick within the same
 *     local calendar day after the first sweep landed.
 *   - The Discord alert uses a date-suffixed `dedupKey`, which the in-memory
 *     dedup window in `discord.ts` honours per process. Across instances,
 *     duplicates would still be possible but harmless (one extra embed per
 *     day, exactly the same content) — and in practice we only run a single
 *     server replica.
 */

import { logger } from "../logger";
import { notifyEvent, EVENT_TYPES } from "../discord";
import {
  detectFindings,
  formatFindingsReport,
  totalFindings,
  type Findings,
} from "../agenda-reconcile";

const HOUR_MS = 60 * 60 * 1000;
const TARGET_HOUR = 6;          // 06:00 server local time
const WARMUP_MS = 60_000;       // first tick 60s after server boot

let _running = false;
let _lastRunDate = "";          // YYYY-MM-DD of the most recent successful sweep

function todayISO(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function buildBucketsField(f: Findings): string {
  return [
    `(A) Inactive bookings with live Google event: **${f.inactiveWithEvent.length}**`,
    `(B) Active google_meet bookings without an event id: **${f.activeWithoutEvent.length}**`,
    `(C) Drafts marked completed without an active booking: **${f.draftCompletedWithoutBooking.length}**`,
    `(D) Active bookings on blocked days: **${f.bookingsOnBlockedDays.length}**`,
  ].join("\n");
}

/**
 * Runs a single dry-run reconcile pass. Always logs the full dry-run report
 * (so the operator has the exact data they would feed into `--apply`), and
 * posts a single Discord embed only when at least one bucket is non-empty.
 *
 * Exposed for tests and for manual invocation from a debugging shell.
 */
export async function runReconcileZombiesSweep(): Promise<{ total: number; report: string }> {
  if (_running) {
    logger.debug("[reconcile-zombies] sweep already in progress — skipping", "reconcile");
    return { total: 0, report: "" };
  }
  _running = true;
  try {
    const findings = await detectFindings();
    const total = totalFindings(findings);
    const report = formatFindingsReport(findings);

    // Always preserve the full dry-run output in the application log so an
    // operator can review what would change before re-running with --apply.
    logger.info(
      `[reconcile-zombies] daily sweep — total=${total} ` +
        `inactiveWithEvent=${findings.inactiveWithEvent.length} ` +
        `activeWithoutEvent=${findings.activeWithoutEvent.length} ` +
        `draftCompletedWithoutBooking=${findings.draftCompletedWithoutBooking.length} ` +
        `bookingsOnBlockedDays=${findings.bookingsOnBlockedDays.length}`,
      "reconcile",
    );

    if (total === 0) {
      // Green run: silent on Discord, only a heartbeat in the logs.
      return { total, report };
    }

    // Persist the full report alongside the summary so an operator looking
    // at the logs after seeing the Discord ping has the row-by-row detail
    // without re-running the script.
    logger.info(`[reconcile-zombies] dry-run report:\n${report}`, "reconcile");

    notifyEvent({
      type: EVENT_TYPES.SYSTEM_ERROR,
      criticality: "warning",
      title: `Agenda drift detected (daily reconcile) — ${total} item${total === 1 ? "" : "s"}`,
      description:
        "Daily safety check found drift between `agenda`, `booking_drafts`, blocked days and Google Calendar events. " +
        "Review the full dry-run report in the server logs and re-run `tsx exentax-web/scripts/reconcile-agenda-zombies.ts --apply` " +
        "to delete the stranded Google events listed in bucket (A).",
      origin: "scheduler/reconcile-zombies",
      fields: [
        { name: "Buckets", value: buildBucketsField(findings), inline: false },
      ],
      // Date-suffixed key so the daily alert always lands (the in-memory
      // dedup window is only 5 min, but this guarantees uniqueness even if
      // the scheduler ticks twice in the same hour after a hot reload).
      dedupKey: `reconcile_zombies:${todayISO()}`,
    });

    return { total, report };
  } catch (err) {
    logger.error(
      "[reconcile-zombies] daily sweep crashed (non-fatal)",
      "reconcile",
      err,
    );
    return { total: 0, report: "" };
  } finally {
    _running = false;
  }
}

/**
 * Schedules the daily sweep. Hour-grained tick like `periodic-reports.ts` —
 * cheap, robust to clock drift and to process restarts mid-window.
 */
export function startReconcileZombiesScheduler(): NodeJS.Timeout {
  const tick = async () => {
    const now = new Date();
    if (now.getHours() !== TARGET_HOUR) return;
    const today = todayISO(now);
    if (_lastRunDate === today) return;
    _lastRunDate = today;
    await runReconcileZombiesSweep();
  };

  // Warmup tick handles the (rare) case where the server boots inside the
  // target hour and the next interval fire would miss the window.
  const warmup = setTimeout(() => { void tick(); }, WARMUP_MS);
  warmup.unref();

  const interval = setInterval(() => { void tick(); }, HOUR_MS);
  return interval;
}
