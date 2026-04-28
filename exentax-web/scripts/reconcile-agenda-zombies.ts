#!/usr/bin/env tsx
/*
 * reconcile-agenda-zombies.ts
 * ---------------------------------------------------------------------------
 * One-off operational script to detect and (optionally) repair inconsistent
 * states between `agenda`, `booking_drafts`, and external Google Calendar
 * events. Designed to be run on demand from the shell when the team
 * suspects drift, and as a periodic sanity check after major incidents.
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
import { db, closePool } from "../server/db";
import { eq, and, sql, isNotNull } from "drizzle-orm";
import * as s from "../shared/schema";
import { deleteGoogleMeetEvent } from "../server/google-meet";
import { logger } from "../server/logger";
import { AGENDA_STATUSES } from "../server/server-constants";

const ARGS = new Set(process.argv.slice(2));
const APPLY = ARGS.has("--apply");
const FAIL_ON_ZOMBIES = ARGS.has("--fail-on-zombies");

interface Findings {
  inactiveWithEvent: Array<{ id: string; status: string | null; eventId: string }>;
  activeWithoutEvent: Array<{ id: string; meetingDate: string | null; startTime: string | null; email: string | null }>;
  draftCompletedWithoutBooking: Array<{ id: string; email: string; completedAt: string | null }>;
  bookingsOnBlockedDays: Array<{ id: string; meetingDate: string; email: string | null }>;
}

async function detect(): Promise<Findings> {
  // A. Inactive (cancelled / no_show) agenda rows that still hold a Google
  // event id. Use a raw SQL list since `inArray` against a literal needs
  // an explicit `as` cast at the type level.
  const inactiveWithEvent = await db
    .select({ id: s.agenda.id, status: s.agenda.status, eventId: s.agenda.googleMeetEventId })
    .from(s.agenda)
    .where(and(
      isNotNull(s.agenda.googleMeetEventId),
      sql`${s.agenda.status} IN (${AGENDA_STATUSES.CANCELLED}, ${AGENDA_STATUSES.NO_SHOW})`,
    ));

  // B. Active google_meet bookings without an event id.
  const activeWithoutEvent = await db
    .select({
      id: s.agenda.id,
      meetingDate: s.agenda.meetingDate,
      startTime: s.agenda.startTime,
      email: s.agenda.email,
    })
    .from(s.agenda)
    .where(and(
      sql`${s.agenda.googleMeetEventId} IS NULL`,
      sql`${s.agenda.meetingType} = 'google_meet'`,
      sql`${s.agenda.status} IS NULL OR ${s.agenda.status} NOT IN ('cancelled','no_show')`,
    ));

  // C. Drafts marked completed but with no active agenda for the email.
  const draftCompletedWithoutBooking = await db.execute(sql`
    SELECT d.id, d.email, d.completed_at AS "completedAt"
    FROM booking_drafts d
    WHERE d.completed_at IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM agenda a
        WHERE a.email = d.email
          AND (a.estado IS NULL OR a.estado NOT IN ('cancelled','no_show'))
      )
  `);

  // D. Bookings sitting on a blocked day.
  const bookingsOnBlockedDays = await db.execute(sql`
    SELECT a.id, a.fecha_reunion AS "meetingDate", a.email
    FROM agenda a
    JOIN blocked_days b ON b.fecha = a.fecha_reunion
    WHERE a.estado IS NULL OR a.estado NOT IN ('cancelled','no_show')
  `);

  return {
    inactiveWithEvent: inactiveWithEvent.map(r => ({
      id: r.id, status: r.status, eventId: r.eventId as string,
    })),
    activeWithoutEvent: activeWithoutEvent.map(r => ({
      id: r.id,
      meetingDate: r.meetingDate,
      startTime: r.startTime,
      email: r.email,
    })),
    draftCompletedWithoutBooking: (draftCompletedWithoutBooking.rows as Array<{ id: string; email: string; completedAt: string | null }>) ?? [],
    bookingsOnBlockedDays: (bookingsOnBlockedDays.rows as Array<{ id: string; meetingDate: string; email: string | null }>) ?? [],
  };
}

async function repairInactiveWithEvent(rows: Findings["inactiveWithEvent"]): Promise<{ deleted: number; cleared: number; failed: number }> {
  let deleted = 0;
  let cleared = 0;
  let failed = 0;
  for (const r of rows) {
    let gone = false;
    try {
      await deleteGoogleMeetEvent(r.eventId);
      gone = true;
      deleted++;
    } catch (err) {
      // Treat "Resource has been deleted" / 404 from Google as already gone.
      const msg = err instanceof Error ? err.message : String(err);
      if (/410|404|deleted|notFound/i.test(msg)) {
        gone = true;
      } else {
        failed++;
        logger.warn(`[reconcile] Google delete failed for ${r.id} (${r.eventId}): ${msg}`, "reconcile");
      }
    }
    // Whether the delete succeeded or the event is already gone, clear the
    // column so the next run does not retry the same id forever. If the
    // delete genuinely failed (network hiccup), the next pass will pick
    // the new orphan up only if a fresh `googleMeetEventId` ever appears,
    // which is impossible for a cancelled row — so clearing is safe.
    if (gone) {
      try {
        await db.update(s.agenda)
          .set({ googleMeetEventId: null })
          .where(eq(s.agenda.id, r.id));
        cleared++;
      } catch (err) {
        logger.warn(`[reconcile] DB clear failed for ${r.id}: ${err instanceof Error ? err.message : String(err)}`, "reconcile");
        failed++;
      }
    }
  }
  return { deleted, cleared, failed };
}

function fmt(rows: unknown[]): string {
  if (rows.length === 0) return "  (none)";
  return rows.map(r => "  - " + JSON.stringify(r)).join("\n");
}

async function main() {
  const mode = APPLY ? "APPLY" : "dry-run";
  console.log(`[reconcile-agenda-zombies] mode=${mode}\n`);

  const findings = await detect();
  const total =
    findings.inactiveWithEvent.length +
    findings.activeWithoutEvent.length +
    findings.draftCompletedWithoutBooking.length +
    findings.bookingsOnBlockedDays.length;

  console.log(`A. Inactive bookings with live Google event (${findings.inactiveWithEvent.length}):`);
  console.log(fmt(findings.inactiveWithEvent));
  console.log(`\nB. Active google_meet bookings without an event id (${findings.activeWithoutEvent.length}):`);
  console.log(fmt(findings.activeWithoutEvent));
  console.log(`\nC. Drafts marked completed without an active booking (${findings.draftCompletedWithoutBooking.length}):`);
  console.log(fmt(findings.draftCompletedWithoutBooking));
  console.log(`\nD. Active bookings on blocked days (${findings.bookingsOnBlockedDays.length}):`);
  console.log(fmt(findings.bookingsOnBlockedDays));

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
