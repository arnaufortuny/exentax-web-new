#!/usr/bin/env tsx
/*
 * reconcile-agenda-zombies.ts
 * ---------------------------------------------------------------------------
 * CLI wrapper around `server/agenda-reconcile.ts`. Detects (and optionally
 * repairs) inconsistent states between `agenda`, `booking_drafts`, and
 * external Google Calendar events. Designed to be run on demand from the
 * shell when the team suspects drift, and as a periodic sanity check after
 * major incidents.
 *
 * The detection / repair logic itself lives in `server/agenda-reconcile.ts`
 * so it can also be invoked by the daily scheduler in
 * `server/scheduled/reconcile-zombies.ts`.
 *
 * What it looks for
 * -----------------
 *  A. Cancelled or no-show agenda rows that still carry a populated
 *     `google_meet_event_id`. The booking is dead but the calendar event
 *     is still alive, which means the cleanup `deleteGoogleMeetEvent` call
 *     either failed or was never made (process crashed mid-cancel, Google
 *     API was down, etc). Repair: best-effort delete the event AND clear
 *     the column so it is not retried forever. The DB column is cleared
 *     even if the Google call fails so the next run does not double-up.
 *
 *  B. Active agenda rows whose `google_meet_event_id` is NULL but whose
 *     `meeting_type` is `google_meet`. This usually means Google was down
 *     when the booking landed; the booking went through but the user got
 *     a `null` Meet link. We REPORT these — the operator can hit the
 *     Discord `/cita reprogramar` flow which recreates the event, but we
 *     never auto-create one because that would also fire user-facing
 *     emails through `sendRescheduleConfirmation`.
 *
 *  C. Drafts whose `completed_at` is set but no matching active agenda
 *     row exists for the same email. Either the booking was completed and
 *     later cancelled (which is fine — `completed_at` is one-shot history)
 *     or the draft was wrongly marked completed. We REPORT these — too
 *     ambiguous to auto-repair without losing audit history.
 *
 *  D. Blocked days that contain active agenda rows. Means a day was
 *     blocked AFTER bookings landed there. We REPORT these so the team
 *     can decide whether to reschedule each affected booking. We never
 *     mass-cancel because that would also fire user-facing notifications.
 *
 * Usage
 * -----
 *   tsx exentax-web/scripts/reconcile-agenda-zombies.ts            # dry-run report
 *   tsx exentax-web/scripts/reconcile-agenda-zombies.ts --apply    # also performs repair (A)
 *
 * Exit code is 0 even when zombies are found (the script is informational
 * by default). Pass `--fail-on-zombies` to make CI/cron treat any finding
 * as a failure.
 *
 * Safe to re-run: every action is idempotent (DELETE-if-exists on Google
 * side, NULL update on DB side). Only the apply mode writes anything.
 * ---------------------------------------------------------------------------
 */
import { closePool } from "../server/db";
import {
  detectFindings,
  repairInactiveWithEvent,
  formatFindingsReport,
  totalFindings,
} from "../server/agenda-reconcile";

const ARGS = new Set(process.argv.slice(2));
const APPLY = ARGS.has("--apply");
const FAIL_ON_ZOMBIES = ARGS.has("--fail-on-zombies");

async function main() {
  const mode = APPLY ? "APPLY" : "dry-run";
  console.log(`[reconcile-agenda-zombies] mode=${mode}\n`);

  const findings = await detectFindings();
  const total = totalFindings(findings);

  console.log(formatFindingsReport(findings));

  if (APPLY && findings.inactiveWithEvent.length > 0) {
    console.log(`\nApplying repair on (A) — deleting ${findings.inactiveWithEvent.length} stranded Google events…`);
    const r = await repairInactiveWithEvent(findings.inactiveWithEvent);
    console.log(`  deleted=${r.deleted} cleared=${r.cleared} failed=${r.failed}`);
  } else if (findings.inactiveWithEvent.length > 0) {
    console.log("\n(dry-run) Re-run with --apply to delete the stranded Google events listed in (A).");
  }

  console.log(`\nTotal findings: ${total}`);
  await closePool();
  if (FAIL_ON_ZOMBIES && total > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  closePool().finally(() => process.exit(1));
});
