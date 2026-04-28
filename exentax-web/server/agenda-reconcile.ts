/*
 * agenda-reconcile.ts
 * ---------------------------------------------------------------------------
 * Shared library used by both the CLI script `scripts/reconcile-agenda-zombies.ts`
 * and the daily scheduler `server/scheduled/reconcile-zombies.ts`.
 *
 * Detects (and optionally repairs) drift between `agenda`, `booking_drafts`,
 * blocked days, and external Google Calendar events. See the script header
 * for the full contract — this module exposes the detect/repair functions
 * without any CLI parsing or process exit handling so they can be invoked
 * safely from a long-running server process.
 *
 * Buckets reported:
 *  A. Inactive (cancelled / no_show) agenda rows still holding a Google
 *     event id. Repairable by `repairInactiveWithEvent`.
 *  B. Active google_meet bookings without an event id (report-only).
 *  C. Drafts marked completed without a matching active booking (report-only).
 *  D. Active bookings sitting on a blocked day (report-only).
 * ---------------------------------------------------------------------------
 */
import { db } from "./db";
import { eq, and, sql, isNotNull } from "drizzle-orm";
import * as s from "../shared/schema";
import { deleteGoogleMeetEvent } from "./google-meet";
import { logger } from "./logger";
import { AGENDA_STATUSES } from "./server-constants";

export interface Findings {
  inactiveWithEvent: Array<{ id: string; status: string | null; eventId: string }>;
  activeWithoutEvent: Array<{ id: string; meetingDate: string | null; startTime: string | null; email: string | null }>;
  draftCompletedWithoutBooking: Array<{ id: string; email: string; completedAt: string | null }>;
  bookingsOnBlockedDays: Array<{ id: string; meetingDate: string; email: string | null }>;
}

export async function detectFindings(): Promise<Findings> {
  // A. Inactive (cancelled / no_show) agenda rows that still hold a Google
  // event id.
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

export async function repairInactiveWithEvent(
  rows: Findings["inactiveWithEvent"],
): Promise<{ deleted: number; cleared: number; failed: number }> {
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
      const msg = err instanceof Error ? err.message : String(err);
      if (/410|404|deleted|notFound/i.test(msg)) {
        gone = true;
      } else {
        failed++;
        logger.warn(`[reconcile] Google delete failed for ${r.id} (${r.eventId}): ${msg}`, "reconcile");
      }
    }
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

export function totalFindings(f: Findings): number {
  return (
    f.inactiveWithEvent.length +
    f.activeWithoutEvent.length +
    f.draftCompletedWithoutBooking.length +
    f.bookingsOnBlockedDays.length
  );
}

function fmt(rows: unknown[]): string {
  if (rows.length === 0) return "  (none)";
  return rows.map(r => "  - " + JSON.stringify(r)).join("\n");
}

/**
 * Renders the same dry-run report the CLI prints to stdout, as a single
 * multi-line string. Callers can log it verbatim or attach it to alerts.
 */
export function formatFindingsReport(f: Findings): string {
  const lines: string[] = [];
  lines.push(`A. Inactive bookings with live Google event (${f.inactiveWithEvent.length}):`);
  lines.push(fmt(f.inactiveWithEvent));
  lines.push("");
  lines.push(`B. Active google_meet bookings without an event id (${f.activeWithoutEvent.length}):`);
  lines.push(fmt(f.activeWithoutEvent));
  lines.push("");
  lines.push(`C. Drafts marked completed without an active booking (${f.draftCompletedWithoutBooking.length}):`);
  lines.push(fmt(f.draftCompletedWithoutBooking));
  lines.push("");
  lines.push(`D. Active bookings on blocked days (${f.bookingsOnBlockedDays.length}):`);
  lines.push(fmt(f.bookingsOnBlockedDays));
  return lines.join("\n");
}
