/**
 * End-to-end test for the public booking flow.
 *
 * Verifies:
 *   1. POST /api/bookings/book creates an `agenda` row (status=pending,
 *      manage_token set) and a matching `leads` row (source=booking_web,
 *      scheduled_call=true) and writes a `consent_log` entry of type
 *      `booking`.
 *   2. GET /api/booking/:id?token=... returns the booking with the same
 *      date/time/status.
 *   3. POST /api/booking/:id/reschedule moves the meeting to a new
 *      slot, transitions status -> rescheduled, increments
 *      reschedule_count and sets last_rescheduled_at.
 *   4. POST /api/booking/:id/cancel transitions status -> cancelled and
 *      sets cancelled_at; replaying cancel is rejected with
 *      ALREADY_CANCELLED.
 *   5. Regression coverage (Task #4):
 *      a. Cancelling a slot frees it: re-booking the same (date,startTime)
 *         immediately afterwards succeeds. Proves the partial unique index
 *         `agenda_active_slot_uniq_idx` correctly excludes cancelled rows.
 *      b. Two concurrent POST /api/bookings/book against the same slot
 *         resolve to exactly one 201 and one 409 SLOT_TAKEN — the in-process
 *         slot lock plus the partial unique index keep doubles out.
 *      c. POST /api/booking/:id/reschedule into a slot already held by
 *         another active booking is rejected with 409 SLOT_TAKEN.
 *      d. Two concurrent insertAgenda() against the same slot, bypassing
 *         the in-process slot lock, surface exactly one SlotConflictError
 *         from the DB unique index — the second-line-of-defense the slot
 *         lock relies on for multi-instance correctness.
 *      e. markReminderSent is idempotent across simulated reminder sweeps:
 *         five concurrent claims on the same agenda row return exactly one
 *         winning row, so a restart-induced overlap with the in-process
 *         timer cannot double-send the reminder email.
 *
 * External calls are stubbed by leaving GOOGLE_SERVICE_ACCOUNT_KEY and the
 * DISCORD_BOT_TOKEN / DISCORD_CHANNEL_* vars unset for the spawned server (handled in the
 * wrapper). With those unset, getGmailClient() and getCalendarClient() both
 * return null, so the production code paths that call them no-op gracefully.
 *
 * Usage: tsx exentax-web/scripts/test-booking-e2e.ts
 * Requires the dev server to be running on $BASE_URL (defaults to
 * http://localhost:5000).
 */
import { db } from "../server/db";
import { eq, and, like } from "drizzle-orm";
import * as s from "../shared/schema";
import {
  getBlockedDay, getBookedSlots, insertAgenda, markReminderSent,
} from "../server/storage/scheduling";
import { SlotConflictError } from "../server/storage/core";
import { isWeekdayISO } from "../shared/madrid-time";
import { LEAD_SOURCES } from "../server/server-constants";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const TEST_TAG = `e2e-booking-${Date.now()}`;
const TEST_EMAIL = `${TEST_TAG}@e2e.exentax.test`;

interface Result {
  name: string;
  ok: boolean;
  detail?: string;
}
const results: Result[] = [];
const createdBookingIds: string[] = [];
const createdEmails: string[] = [TEST_EMAIL];

function record(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail });
  const tag = ok ? "PASS" : "FAIL";
  console.log(`  [${tag}] ${name}${detail ? ` — ${detail}` : ""}`);
}

function assert(name: string, cond: boolean, detail?: string) {
  record(name, !!cond, cond ? undefined : detail || "assertion failed");
  return !!cond;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + n);
  return d;
}

function isoOf(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Walk forward from `start` looking for a weekday with at least one
 * unblocked, unbooked slot. Returns the first such (date, slot).
 * The slot list intentionally avoids the 08:00/19:30 edges to keep the
 * test future-proof against business-hour tweaks.
 */
async function findFreeSlot(start: Date, preferredSlots: string[]): Promise<{ date: string; slot: string } | null> {
  for (let i = 0; i < 30; i++) {
    const candidate = addDays(start, i);
    const iso = isoOf(candidate);
    if (!isWeekdayISO(iso)) continue;
    const blocked = await getBlockedDay(iso);
    if (blocked) continue;
    const taken = await getBookedSlots(iso);
    for (const slot of preferredSlots) {
      if (!taken.has(slot)) return { date: iso, slot };
    }
  }
  return null;
}

async function httpJson(method: "GET" | "POST", path: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: BASE_URL,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: unknown = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }
  return { status: res.status, body: json as Record<string, unknown> | null, raw: text };
}

async function getAgendaRow(id: string) {
  const rows = await db.select().from(s.agenda).where(eq(s.agenda.id, id)).limit(1);
  return rows[0] ?? null;
}
async function getLeadRow(id: string) {
  const rows = await db.select().from(s.leads).where(eq(s.leads.id, id)).limit(1);
  return rows[0] ?? null;
}
async function getConsentRows(email: string) {
  return db.select().from(s.consentLog).where(eq(s.consentLog.email, email));
}

async function cleanup() {
  try {
    for (const id of createdBookingIds) {
      await db.delete(s.agenda).where(eq(s.agenda.id, id));
      await db.delete(s.leads).where(eq(s.leads.id, id));
    }
    for (const email of createdEmails) {
      await db.delete(s.consentLog).where(eq(s.consentLog.email, email));
      // Belt-and-braces in case the booking insert ever stops sharing the lead id.
      await db.delete(s.agenda).where(eq(s.agenda.email, email));
      await db.delete(s.leads).where(eq(s.leads.email, email));
    }
    // Sweep stragglers from earlier crashed runs that share the test domain.
    await db.delete(s.consentLog).where(and(
      eq(s.consentLog.source, "booking"),
      like(s.consentLog.email, "%@e2e.exentax.test"),
    ));
    console.log(`\nCleanup: removed ${createdBookingIds.length} test booking(s).`);
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

async function main() {
  console.log(`Running booking E2E against ${BASE_URL}`);
  console.log(`Test tag: ${TEST_TAG}\n`);

  // ----------------------------------------------------------------------
  // 0. Find two free weekday slots (one for the booking, one for the
  //    reschedule). We start ~45 days out so we are well clear of any
  //    real bookings or short-term blocked days an admin might add.
  // ----------------------------------------------------------------------
  console.log("Step 0 — Locating two free weekday slots");
  const start = addDays(new Date(), 45);
  const initial = await findFreeSlot(start, ["10:00", "10:30", "11:00"]);
  if (!initial) {
    record("locate initial free slot", false, "no free slot found in 30 days starting +45");
    await cleanup();
    process.exit(1);
  }
  // Search for the reschedule slot starting the day AFTER the initial booking
  // so the two are guaranteed to be on different dates (avoids SAME_SLOT).
  const reschedStart = addDays(new Date(initial.date + "T12:00:00"), 1);
  const rescheduled = await findFreeSlot(reschedStart, ["14:00", "14:30", "15:00"]);
  if (!rescheduled) {
    record("locate reschedule free slot", false, "no second free slot found");
    await cleanup();
    process.exit(1);
  }
  console.log(`  initial slot:     ${initial.date} ${initial.slot}`);
  console.log(`  reschedule slot:  ${rescheduled.date} ${rescheduled.slot}`);

  // ----------------------------------------------------------------------
  // 1. Create the booking via the public HTTP endpoint.
  // ----------------------------------------------------------------------
  console.log("\nStep 1 — POST /api/bookings/book");
  const bookPayload = {
    name: "E2E Tester",
    lastName: "Bot",
    email: TEST_EMAIL,
    phone: "+34600000000",
    notes: "automated booking e2e",
    context: "ci",
    activity: "software",
    date: initial.date,
    startTime: initial.slot,
    monthlyProfit: "5000",
    globalClients: true,
    digitalOperation: true,
    shareNote: "ok",
    attendanceCommitment: true,
    privacyAccepted: true,
    marketingAccepted: false,
    language: "es",
  };
  const bookRes = await httpJson("POST", "/api/bookings/book", bookPayload);
  assert("book endpoint returns 201", bookRes.status === 201, `status=${bookRes.status} body=${bookRes.raw.slice(0, 200)}`);
  assert("book response is ok=true", bookRes.body?.ok === true);
  assert("book response status=confirmed", bookRes.body?.status === "confirmed");
  assert("book response echoes date", bookRes.body?.date === initial.date);
  assert("book response echoes startTime", bookRes.body?.startTime === initial.slot);

  // The route writes the consent log + lead asynchronously; give them a beat.
  await new Promise((r) => setTimeout(r, 600));

  // Find the row by email (the route does not return the id, but the
  // booking is the only active row for this email).
  const agendaRows = await db.select().from(s.agenda).where(eq(s.agenda.email, TEST_EMAIL));
  assert("agenda row created", agendaRows.length === 1, `found ${agendaRows.length} rows`);
  const bookingId = agendaRows[0]?.id;
  if (bookingId) createdBookingIds.push(bookingId);
  const initialRow = agendaRows[0];
  assert("agenda manage_token set", !!initialRow?.manageToken && initialRow.manageToken.length >= 32);
  assert("agenda meeting_date matches", initialRow?.meetingDate === initial.date);
  assert("agenda start_time matches", initialRow?.startTime === initial.slot);
  assert("agenda status defaults to pending", initialRow?.status === "pending");
  assert("agenda reschedule_count starts at 0", (initialRow?.rescheduleCount ?? 0) === 0);
  assert("agenda cancelled_at is null", initialRow?.cancelledAt == null);

  const leadRow = bookingId ? await getLeadRow(bookingId) : null;
  assert("leads row created with same id", !!leadRow, `leadRow=${JSON.stringify(leadRow)}`);
  assert(`lead source=${LEAD_SOURCES.BOOKING_WEB}`, leadRow?.source === LEAD_SOURCES.BOOKING_WEB, `source=${leadRow?.source}`);
  assert("lead scheduled_call=true", leadRow?.scheduledCall === true);

  const consentRows = await getConsentRows(TEST_EMAIL);
  const bookingConsent = consentRows.find((r) => r.formType === "booking");
  assert("consent_log entry written for booking", !!bookingConsent, `rows=${JSON.stringify(consentRows)}`);
  assert("consent_log records privacy_accepted=true", bookingConsent?.privacyAccepted === true);

  if (!bookingId || !initialRow?.manageToken) {
    record("booking id + token captured", false, "missing id/token, aborting later steps");
    await cleanup();
    process.exit(1);
  }
  const manageToken = initialRow.manageToken;

  // ----------------------------------------------------------------------
  // 2. Manage endpoint: GET /api/booking/:id?token=...
  // ----------------------------------------------------------------------
  console.log("\nStep 2 — GET /api/booking/:id?token=...");
  const manageRes = await httpJson("GET", `/api/booking/${bookingId}?token=${manageToken}`);
  assert("manage endpoint returns 200", manageRes.status === 200, `status=${manageRes.status}`);
  assert("manage endpoint reflects pending status", manageRes.body?.status === "pending", `status=${manageRes.body?.status}`);
  assert("manage endpoint echoes date", manageRes.body?.date === initial.date);
  assert("manage endpoint echoes startTime", manageRes.body?.startTime === initial.slot);

  // ----------------------------------------------------------------------
  // 2b. Negative: wrong token on GET /api/booking/:id returns 404.
  //     The manage endpoints sit behind the generous bookingManage
  //     limiter (60/hour) — the create limiter (5/hour) is untouched by
  //     these extra checks.
  // ----------------------------------------------------------------------
  console.log("\nStep 2b — Wrong-token 404");
  const wrongToken = "0".repeat(manageToken.length);
  const wrongRes = await httpJson("GET", `/api/booking/${bookingId}?token=${wrongToken}`);
  assert("wrong token returns 404", wrongRes.status === 404, `status=${wrongRes.status} body=${wrongRes.raw.slice(0, 120)}`);

  // ----------------------------------------------------------------------
  // 2c. Negative: rescheduling to the exact same (date, startTime) is
  //     rejected with SAME_SLOT before any DB mutation.
  // ----------------------------------------------------------------------
  console.log("\nStep 2c — SAME_SLOT reschedule rejection");
  const sameSlotRes = await httpJson(
    "POST",
    `/api/booking/${bookingId}/reschedule?token=${manageToken}`,
    { date: initial.date, startTime: initial.slot },
  );
  assert("same-slot reschedule returns 400 SAME_SLOT",
    sameSlotRes.status === 400 && sameSlotRes.body?.code === "SAME_SLOT",
    `status=${sameSlotRes.status} code=${sameSlotRes.body?.code}`);

  const stillPending = await getAgendaRow(bookingId);
  assert("same-slot reject did not mutate row", stillPending?.status === "pending" && stillPending?.rescheduleCount === 0);

  // ----------------------------------------------------------------------
  // 3. Reschedule the booking.
  // ----------------------------------------------------------------------
  console.log("\nStep 3 — POST /api/booking/:id/reschedule");
  const rescRes = await httpJson("POST", `/api/booking/${bookingId}/reschedule?token=${manageToken}`, {
    date: rescheduled.date,
    startTime: rescheduled.slot,
  });
  assert("reschedule endpoint returns 200", rescRes.status === 200, `status=${rescRes.status} body=${rescRes.raw.slice(0, 200)}`);
  assert("reschedule status=rescheduled", rescRes.body?.status === "rescheduled");
  assert("reschedule echoes new date", rescRes.body?.date === rescheduled.date);
  assert("reschedule echoes new startTime", rescRes.body?.startTime === rescheduled.slot);

  const afterResched = await getAgendaRow(bookingId);
  assert("DB meeting_date moved", afterResched?.meetingDate === rescheduled.date);
  assert("DB start_time moved", afterResched?.startTime === rescheduled.slot);
  assert("DB status=rescheduled", afterResched?.status === "rescheduled");
  assert("DB reschedule_count incremented to 1", afterResched?.rescheduleCount === 1);
  assert("DB last_rescheduled_at populated", typeof afterResched?.lastRescheduledAt === "string" && (afterResched?.lastRescheduledAt?.length ?? 0) > 0);

  // ----------------------------------------------------------------------
  // 4. Cancel the booking.
  // ----------------------------------------------------------------------
  console.log("\nStep 4 — POST /api/booking/:id/cancel");
  const cancelRes = await httpJson("POST", `/api/booking/${bookingId}/cancel?token=${manageToken}`);
  assert("cancel endpoint returns 200", cancelRes.status === 200, `status=${cancelRes.status} body=${cancelRes.raw.slice(0, 200)}`);
  assert("cancel response status=cancelled", cancelRes.body?.status === "cancelled");

  const afterCancel = await getAgendaRow(bookingId);
  assert("DB status=cancelled", afterCancel?.status === "cancelled");
  assert("DB cancelled_at populated", typeof afterCancel?.cancelledAt === "string" && (afterCancel?.cancelledAt?.length ?? 0) > 0);

  // Replay cancel must be rejected with ALREADY_CANCELLED. The manage
  // limiter is generous (60/hour) so we can keep stacking negative checks
  // after this without tripping 429.
  const cancelAgain = await httpJson("POST", `/api/booking/${bookingId}/cancel?token=${manageToken}`);
  assert("re-cancel rejected (400 ALREADY_CANCELLED)",
    cancelAgain.status === 400 && cancelAgain.body?.code === "ALREADY_CANCELLED",
    `status=${cancelAgain.status} code=${cancelAgain.body?.code}`);

  // ----------------------------------------------------------------------
  // 4b. Negative: reschedule after cancel is rejected with BOOKING_CANCELLED.
  // ----------------------------------------------------------------------
  console.log("\nStep 4b — Reschedule-after-cancel rejection");
  const rescheduleAfterCancel = await httpJson(
    "POST",
    `/api/booking/${bookingId}/reschedule?token=${manageToken}`,
    { date: rescheduled.date, startTime: rescheduled.slot },
  );
  assert("reschedule-after-cancel rejected (400 BOOKING_CANCELLED)",
    rescheduleAfterCancel.status === 400 && rescheduleAfterCancel.body?.code === "BOOKING_CANCELLED",
    `status=${rescheduleAfterCancel.status} code=${rescheduleAfterCancel.body?.code}`);
  const stillCancelled = await getAgendaRow(bookingId);
  assert("post-cancel row remains cancelled", stillCancelled?.status === "cancelled");

  // ----------------------------------------------------------------------
  // 5. Regression: cancel + re-book the SAME slot succeeds.
  //    Proves the partial unique index excludes the cancelled row so the
  //    slot is genuinely free again.
  // ----------------------------------------------------------------------
  console.log("\nStep 5 — Re-book the slot just cancelled");
  const REBOOK_EMAIL = `${TEST_TAG}-rebook@e2e.exentax.test`;
  createdEmails.push(REBOOK_EMAIL);
  const rebookPayload = { ...bookPayload, email: REBOOK_EMAIL, date: rescheduled.date, startTime: rescheduled.slot };
  const rebookRes = await httpJson("POST", "/api/bookings/book", rebookPayload);
  assert("rebook of cancelled slot returns 201",
    rebookRes.status === 201,
    `status=${rebookRes.status} body=${rebookRes.raw.slice(0, 200)}`);
  assert("rebook echoes same date/slot",
    rebookRes.body?.date === rescheduled.date && rebookRes.body?.startTime === rescheduled.slot);
  await new Promise((r) => setTimeout(r, 400));
  const rebookRows = await db.select().from(s.agenda).where(eq(s.agenda.email, REBOOK_EMAIL));
  assert("rebook agenda row created", rebookRows.length === 1, `found ${rebookRows.length}`);
  const rebookId = rebookRows[0]?.id ?? null;
  if (rebookId) createdBookingIds.push(rebookId);

  // ----------------------------------------------------------------------
  // 6. Regression: two concurrent POST /api/bookings/book against the
  //    same fresh slot — exactly one must win, the other must get
  //    409 SLOT_TAKEN. Different emails so the duplicate-booking guard
  //    does not pre-empt the slot race.
  // ----------------------------------------------------------------------
  console.log("\nStep 6 — Concurrent double-booking attempt");
  const concurrentSlot = await findFreeSlot(addDays(new Date(rescheduled.date + "T12:00:00"), 1), ["16:00", "16:30", "17:00"]);
  if (!concurrentSlot) {
    record("locate concurrent free slot", false, "no third free slot found");
    await cleanup();
    process.exit(1);
  }
  // Lowercase suffixes so they match the email after the bookingRequestSchema
  // .toLowerCase() transform (the row in DB is the normalized form).
  const CONC_EMAIL_A = `${TEST_TAG}-conca@e2e.exentax.test`;
  const CONC_EMAIL_B = `${TEST_TAG}-concb@e2e.exentax.test`;
  createdEmails.push(CONC_EMAIL_A, CONC_EMAIL_B);
  const concPayloadA = { ...bookPayload, email: CONC_EMAIL_A, date: concurrentSlot.date, startTime: concurrentSlot.slot };
  const concPayloadB = { ...bookPayload, email: CONC_EMAIL_B, date: concurrentSlot.date, startTime: concurrentSlot.slot };
  const [concResA, concResB] = await Promise.all([
    httpJson("POST", "/api/bookings/book", concPayloadA),
    httpJson("POST", "/api/bookings/book", concPayloadB),
  ]);
  const statuses = [concResA.status, concResB.status].sort();
  assert("concurrent booking outcome is exactly {201, 409}",
    statuses[0] === 201 && statuses[1] === 409,
    `statuses=${JSON.stringify(statuses)} bodies=${concResA.raw.slice(0,120)} | ${concResB.raw.slice(0,120)}`);
  const loser = concResA.status === 409 ? concResA : concResB;
  assert("concurrent loser code=SLOT_TAKEN",
    loser.body?.code === "SLOT_TAKEN",
    `loser code=${loser.body?.code} body=${loser.raw.slice(0, 200)}`);
  await new Promise((r) => setTimeout(r, 400));
  const concRowsA = await db.select().from(s.agenda).where(eq(s.agenda.email, CONC_EMAIL_A));
  const concRowsB = await db.select().from(s.agenda).where(eq(s.agenda.email, CONC_EMAIL_B));
  const totalConcRows = concRowsA.length + concRowsB.length;
  assert("exactly one concurrent booking persisted", totalConcRows === 1, `A=${concRowsA.length} B=${concRowsB.length}`);
  const concWinner = concRowsA[0] ?? concRowsB[0];
  if (concWinner?.id) createdBookingIds.push(concWinner.id);

  // ----------------------------------------------------------------------
  // 7. Regression: rescheduling into a slot already taken by another
  //    active booking is rejected with 409 SLOT_TAKEN, and the source
  //    booking row is left untouched.
  // ----------------------------------------------------------------------
  console.log("\nStep 7 — Reschedule into a taken slot");
  if (concWinner?.id && concWinner.manageToken) {
    const beforeDate = concWinner.meetingDate;
    const beforeTime = concWinner.startTime;
    const stealRes = await httpJson(
      "POST",
      `/api/booking/${concWinner.id}/reschedule?token=${concWinner.manageToken}`,
      { date: rescheduled.date, startTime: rescheduled.slot },
    );
    assert("reschedule into taken slot returns 409 SLOT_TAKEN",
      stealRes.status === 409 && stealRes.body?.code === "SLOT_TAKEN",
      `status=${stealRes.status} code=${stealRes.body?.code} body=${stealRes.raw.slice(0, 200)}`);
    const afterSteal = await getAgendaRow(concWinner.id);
    assert("source booking unchanged after rejected reschedule",
      afterSteal?.meetingDate === beforeDate && afterSteal?.startTime === beforeTime && afterSteal?.status === "pending");
  } else {
    record("step 7 prerequisite (concurrent winner row + token)", false, "missing winner id/token");
  }

  // ----------------------------------------------------------------------
  // 8. Regression: two concurrent storage-layer insertAgenda() against
  //    the same slot, BYPASSING withSlotLock. This proves the partial
  //    unique index is the second line of defence the slot lock relies
  //    on for any future multi-instance deployment.
  // ----------------------------------------------------------------------
  console.log("\nStep 8 — DB-level concurrent slot conflict");
  const dbSlot = await findFreeSlot(addDays(new Date(concurrentSlot.date + "T12:00:00"), 1), ["09:00", "09:30", "12:30"]);
  if (!dbSlot) {
    record("locate db-level free slot", false, "no fourth free slot found");
  } else {
    const idA = `BOOK_${TEST_TAG}_dbA`.slice(0, 60);
    const idB = `BOOK_${TEST_TAG}_dbB`.slice(0, 60);
    createdBookingIds.push(idA, idB);
    const [dbStartH, dbStartM] = dbSlot.slot.split(":").map(Number);
    const dbEndTotal = dbStartH * 60 + dbStartM + 30;
    const dbEndTime = `${pad(Math.floor(dbEndTotal / 60))}:${pad(dbEndTotal % 60)}`;
    const baseRow = {
      name: "E2E DB Race",
      phone: null,
      meetingDate: dbSlot.date,
      startTime: dbSlot.slot,
      endTime: dbEndTime,
      status: "pending",
      language: "es",
      privacy: true,
      marketing: false,
      bookingDate: dbSlot.date,
    };
    const settled = await Promise.allSettled([
      insertAgenda({ id: idA, email: `${TEST_TAG}-dbA@e2e.exentax.test`, ...baseRow }),
      insertAgenda({ id: idB, email: `${TEST_TAG}-dbB@e2e.exentax.test`, ...baseRow }),
    ]);
    createdEmails.push(`${TEST_TAG}-dbA@e2e.exentax.test`, `${TEST_TAG}-dbB@e2e.exentax.test`);
    const fulfilled = settled.filter((r) => r.status === "fulfilled");
    const rejected = settled.filter((r) => r.status === "rejected");
    assert("db-level race resolves to exactly one success",
      fulfilled.length === 1 && rejected.length === 1,
      `fulfilled=${fulfilled.length} rejected=${rejected.length}`);
    const reason = (rejected[0] as PromiseRejectedResult | undefined)?.reason;
    assert("db-level loser raises SlotConflictError",
      reason instanceof SlotConflictError,
      `reason type=${reason?.constructor?.name} message=${reason instanceof Error ? reason.message : String(reason)}`);
    const dbRows = await db.select().from(s.agenda)
      .where(and(eq(s.agenda.meetingDate, dbSlot.date), eq(s.agenda.startTime, dbSlot.slot)));
    assert("only one row exists for the contested slot", dbRows.length === 1, `rows=${dbRows.length}`);
  }

  // ----------------------------------------------------------------------
  // 9. Regression: markReminderSent is the atomic primitive both the
  //    in-process timer and the periodic recovery sweep call before
  //    sending. Five concurrent claims on the same row must resolve to
  //    exactly one winning row — proves the recovery sweep cannot
  //    double-send a reminder a restart already triggered.
  // ----------------------------------------------------------------------
  console.log("\nStep 9 — Reminder claim idempotency");
  const reminderId = `BOOK_${TEST_TAG}_rem`.slice(0, 60);
  const reminderEmail = `${TEST_TAG}-rem@e2e.exentax.test`;
  createdBookingIds.push(reminderId);
  createdEmails.push(reminderEmail);
  // Pick a genuinely free weekday slot far enough out so the row passes
  // getFutureAgenda's filter and does not collide with the partial unique
  // slot index in shared/CI databases.
  const reminderSlot = await findFreeSlot(addDays(new Date(), 60), ["09:00", "09:30", "12:30", "13:00"]);
  if (!reminderSlot) {
    record("locate reminder free slot", false, "no free slot for reminder test");
    await cleanup();
    process.exit(1);
  }
  const [remStartH, remStartM] = reminderSlot.slot.split(":").map(Number);
  const remEndTotal = remStartH * 60 + remStartM + 30;
  const remEndTime = `${pad(Math.floor(remEndTotal / 60))}:${pad(remEndTotal % 60)}`;
  await insertAgenda({
    id: reminderId,
    name: "E2E Reminder",
    email: reminderEmail,
    phone: null,
    meetingDate: reminderSlot.date,
    startTime: reminderSlot.slot,
    endTime: remEndTime,
    status: "pending",
    language: "es",
    privacy: true,
    marketing: false,
    bookingDate: reminderSlot.date,
    reminderSent: false,
  });
  const claims = await Promise.all([
    markReminderSent(reminderId),
    markReminderSent(reminderId),
    markReminderSent(reminderId),
    markReminderSent(reminderId),
    markReminderSent(reminderId),
  ]);
  const winners = claims.filter((c) => c !== null);
  assert("exactly one concurrent reminder claim wins",
    winners.length === 1,
    `winners=${winners.length} (expected 1)`);
  const finalRow = await getAgendaRow(reminderId);
  assert("agenda row reminder_sent=true after claim", finalRow?.reminderSent === true);
  // Re-claim after the winning send is impossible — proves an extra
  // sweep right after a restart cannot trigger another email.
  const replayClaim = await markReminderSent(reminderId);
  assert("replay markReminderSent returns null (already claimed)", replayClaim === null,
    `replayClaim=${JSON.stringify(replayClaim)}`);

  // ----------------------------------------------------------------------
  // Summary + cleanup.
  // ----------------------------------------------------------------------
  await cleanup();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
  if (failed.length > 0) {
    console.log("FAILED:");
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail ?? ""}`);
    process.exit(1);
  }
}

main()
  .catch(async (err) => {
    console.error("Booking E2E run crashed:", err);
    await cleanup().catch(() => {});
    process.exit(1);
  })
  .finally(async () => {
    try { await (await import("../server/db")).closePool(); } catch { /* noop */ }
  });
