import { db, type DbOrTx } from "../db";
import { eq, and, asc, gte, sql, type SQL } from "drizzle-orm";
import * as s from "../../shared/schema";
import { normalizeEmail, wrapStorageError, SlotConflictError, isSlotUniqueViolation } from "./core";
import { todayMadridISO } from "../server-constants";
import { encryptSensitiveFields, decryptSensitiveFields, type SensitiveFieldName } from "../field-encryption";
import crypto from "crypto";

const AGENDA_SENSITIVE: readonly SensitiveFieldName[] = ["phone"];

function decryptAgenda<T extends Record<string, unknown>>(row: T): T {
  return decryptSensitiveFields(row, AGENDA_SENSITIVE);
}

export async function getFutureAgenda() {
  try {
    const today = todayMadridISO();
    const rows = await db.select().from(s.agenda).where(
      and(
        gte(s.agenda.meetingDate, today),
        sql`${s.agenda.status} NOT IN ('cancelled', 'no_show')`,
        sql`COALESCE(${s.agenda.reminderSent}, false) = false`,
      )
    );
    return rows.map(r => decryptAgenda(r as unknown as Record<string, unknown>) as unknown as s.Agenda);
  } catch (err) { throw wrapStorageError("getFutureAgenda", err); }
}

/**
 * Atomically claim a reminder slot: sets reminderSent=true only if it was
 * false (or NULL). Returns the row when the caller wins the claim, or null
 * if another worker/timer already claimed it. Use as a gate BEFORE sending
 * the email so that overlapping sweeps and the in-process timer cannot
 * trigger duplicate reminders.
 */
export async function markReminderSent(agendaId: string) {
  try {
    const [row] = await db.update(s.agenda)
      .set({ reminderSent: true })
      .where(and(eq(s.agenda.id, agendaId), sql`COALESCE(${s.agenda.reminderSent}, false) = false`))
      .returning();
    return row ?? null;
  } catch (err) { throw wrapStorageError("markReminderSent", err); }
}

/**
 * Revert a reminder claim when the email actually failed to send, so the next
 * recovery sweep will retry it. Safe to call even if the row no longer exists.
 */
export async function unmarkReminderSent(agendaId: string) {
  try {
    await db.update(s.agenda).set({ reminderSent: false }).where(eq(s.agenda.id, agendaId));
  } catch (err) { throw wrapStorageError("unmarkReminderSent", err); }
}

export async function getAgendaByIdAndToken(id: string, token: string) {
  try {
    if (!id || !token || typeof token !== "string") return null;
    const rows = await db.select().from(s.agenda)
      .where(eq(s.agenda.id, id))
      .limit(1);
    const row = rows[0] ?? null;
    if (!row || !row.manageToken) return null;
    const a = Buffer.from(row.manageToken);
    const b = Buffer.from(token);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return decryptAgenda(row as unknown as Record<string, unknown>) as unknown as s.Agenda;
  } catch (err) { throw wrapStorageError("getAgendaByIdAndToken", err); }
}

export async function insertAgenda(data: s.InsertAgenda, txDb?: DbOrTx) {
  try {
    const encrypted = encryptSensitiveFields(data as unknown as Record<string, unknown>, AGENDA_SENSITIVE) as unknown as s.InsertAgenda;
    const [row] = await (txDb || db).insert(s.agenda).values(encrypted).returning();
    return decryptAgenda(row as unknown as Record<string, unknown>) as unknown as s.Agenda;
  } catch (err) {
    if (isSlotUniqueViolation(err)) throw new SlotConflictError("insertAgenda", err);
    throw wrapStorageError("insertAgenda", err);
  }
}

export async function updateAgenda(id: string, updates: Partial<Omit<s.InsertAgenda, "id">>) {
  try {
    const encrypted = encryptSensitiveFields(updates as unknown as Record<string, unknown>, AGENDA_SENSITIVE) as unknown as Partial<Omit<s.InsertAgenda, "id">>;
    const [row] = await db.update(s.agenda).set(encrypted).where(eq(s.agenda.id, id)).returning();
    if (!row) return null;
    return decryptAgenda(row as unknown as Record<string, unknown>) as unknown as s.Agenda;
  } catch (err) {
    if (isSlotUniqueViolation(err)) throw new SlotConflictError("updateAgenda", err);
    throw wrapStorageError("updateAgenda", err);
  }
}

export async function getBookedSlots(date: string): Promise<Set<string>> {
  try {
    const rows = await db.select({ startTime: s.agenda.startTime })
      .from(s.agenda)
      .where(and(eq(s.agenda.meetingDate, date), sql`${s.agenda.status} NOT IN ('cancelled', 'no_show')`));
    return new Set(rows.map(r => r.startTime).filter(Boolean) as string[]);
  } catch (err) { throw wrapStorageError("getBookedSlots", err); }
}

export async function isSlotBooked(date: string, time: string): Promise<boolean> {
  try {
    const rows = await db.select({ cnt: sql<number>`COUNT(*)` })
      .from(s.agenda)
      .where(and(
        eq(s.agenda.meetingDate, date),
        eq(s.agenda.startTime, time),
        sql`${s.agenda.status} NOT IN ('cancelled', 'no_show')`
      ));
    return (rows[0]?.cnt ?? 0) > 0;
  } catch (err) { throw wrapStorageError("isSlotBooked", err); }
}

export async function hasExistingBooking(email: string): Promise<boolean> {
  try {
    const todayStr = todayMadridISO();
    const rows = await db.select({ id: s.agenda.id })
      .from(s.agenda)
      .where(and(
        eq(s.agenda.email, normalizeEmail(email)),
        sql`${s.agenda.meetingDate} >= ${todayStr}`,
        sql`${s.agenda.status} NOT IN ('cancelled', 'no_show')`,
      ))
      .limit(1);
    return rows.length > 0;
  } catch (err) { throw wrapStorageError("hasExistingBooking", err); }
}

export async function getAgendaById(id: string) {
  try {
    const rows = await db.select().from(s.agenda).where(eq(s.agenda.id, id)).limit(1);
    if (!rows[0]) return null;
    return decryptAgenda(rows[0] as unknown as Record<string, unknown>) as unknown as s.Agenda;
  } catch (err) { throw wrapStorageError("getAgendaById", err); }
}

export interface ListAgendasFilter {
  from?: string | null;
  to?: string | null;
  status?: string | null;
  language?: string | null;
  q?: string | null;
  limit?: number;
}

export async function listAgendasFiltered(opts: ListAgendasFilter = {}) {
  try {
    const conds: SQL[] = [];
    if (opts.from) conds.push(gte(s.agenda.meetingDate, opts.from));
    if (opts.to) conds.push(sql`${s.agenda.meetingDate} <= ${opts.to}`);
    if (opts.status && opts.status !== "all") {
      conds.push(eq(s.agenda.status, opts.status));
    }
    if (opts.language && opts.language !== "all") {
      conds.push(eq(s.agenda.language, opts.language));
    }
    if (opts.q) {
      // Match by booking ID (exact, case-insensitive) OR partial match on
      // name/email so the Discord `/agenda buscar` command supports the
      // three identifiers operators actually use in practice.
      const raw = opts.q.trim();
      const needle = `%${raw.toLowerCase()}%`;
      conds.push(sql`(LOWER(${s.agenda.id}) = ${raw.toLowerCase()} OR LOWER(${s.agenda.name}) LIKE ${needle} OR LOWER(${s.agenda.email}) LIKE ${needle})`);
    }
    const limit = Math.min(Math.max(opts.limit ?? 200, 1), 1000);
    const where = conds.length ? and(...conds) : undefined;
    const baseQuery = db.select().from(s.agenda);
    const filteredQuery = where ? baseQuery.where(where) : baseQuery;
    const rows = await filteredQuery
      .orderBy(asc(s.agenda.meetingDate), asc(s.agenda.startTime))
      .limit(limit);
    return rows.map(r => decryptAgenda(r as unknown as Record<string, unknown>) as unknown as s.Agenda);
  } catch (err) { throw wrapStorageError("listAgendasFiltered", err); }
}

export async function getAllBlockedDays() {
  try {
    return await db.select().from(s.blockedDays).orderBy(asc(s.blockedDays.date));
  } catch (err) { throw wrapStorageError("getAllBlockedDays", err); }
}

export async function getBlockedDay(date: string) {
  try {
    const rows = await db.select().from(s.blockedDays).where(eq(s.blockedDays.date, date)).limit(1);
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("getBlockedDay", err); }
}

/**
 * Idempotent insert: blocking the same day twice from Discord must not raise
 * a unique-violation, since the operator may not remember which days are
 * already blocked. Returns the row that ends up persisted.
 */
export async function insertBlockedDay(date: string, reason: string | null) {
  try {
    const existing = await getBlockedDay(date);
    if (existing) return existing;
    const [row] = await db.insert(s.blockedDays)
      .values({ id: crypto.randomUUID(), date, reason: reason ?? null })
      .returning();
    return row;
  } catch (err) { throw wrapStorageError("insertBlockedDay", err); }
}

export async function deleteBlockedDay(date: string): Promise<boolean> {
  try {
    const res = await db.delete(s.blockedDays).where(eq(s.blockedDays.date, date)).returning({ id: s.blockedDays.id });
    return res.length > 0;
  } catch (err) { throw wrapStorageError("deleteBlockedDay", err); }
}

/**
 * Append-only audit log for the Discord agenda bot. Captures every action a
 * staff member performs (slash command or button) so the history survives
 * even when the originating Discord message is deleted or the channel is
 * purged. Failures are swallowed by the caller — losing audit lines must
 * never break a moderator-facing flow, but we still log them.
 */
export async function logAdminAction(entry: {
  bookingId?: string | null;
  actorDiscordId: string;
  actorDiscordName?: string | null;
  action: string;
  payload?: unknown;
}): Promise<s.AgendaAdminAction | null> {
  try {
    const [row] = await db.insert(s.agendaAdminActions).values({
      id: crypto.randomUUID(),
      bookingId: entry.bookingId ?? null,
      actorDiscordId: entry.actorDiscordId,
      actorDiscordName: entry.actorDiscordName ?? null,
      action: entry.action,
      payload: entry.payload != null ? JSON.stringify(entry.payload).slice(0, 4000) : null,
    }).returning();
    return row ?? null;
  } catch (err) {
    throw wrapStorageError("logAdminAction", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking drafts (incomplete-booking reminder email)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea un draft de reserva la primera vez que el visitante introduce su
 * email en el formulario de booking. Idempotente: si ya existe un draft
 * abierto reciente (creado en las últimas 24h, sin completar ni recordar)
 * para el mismo email, no inserta otro — solo refresca idioma/IP/UA.
 */
export async function upsertBookingDraft(input: {
  email: string;
  name?: string | null;
  language?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<s.BookingDraft | null> {
  try {
    const email = normalizeEmail(input.email);
    const cleanName = (input.name ?? "").trim() || null;
    const language = input.language ?? null;
    const ip = input.ip ?? null;
    const userAgent = input.userAgent ?? null;

    // Look for an open draft created within the last 24h.
    const cutoffMs = Date.now() - 24 * 60 * 60_000;
    const cutoffIso = new Date(cutoffMs).toISOString();
    const open = await db.select().from(s.bookingDrafts).where(
      and(
        eq(s.bookingDrafts.email, email),
        sql`${s.bookingDrafts.completedAt} IS NULL`,
        sql`${s.bookingDrafts.reminderSentAt} IS NULL`,
        sql`${s.bookingDrafts.createdAt} >= ${cutoffIso}`,
      ),
    ).limit(1);

    if (open[0]) {
      const [updated] = await db.update(s.bookingDrafts)
        .set({
          name: cleanName ?? open[0].name,
          language: language ?? open[0].language,
          ip: ip ?? open[0].ip,
          userAgent: userAgent ?? open[0].userAgent,
        })
        .where(eq(s.bookingDrafts.id, open[0].id))
        .returning();
      return updated ?? open[0];
    }

    const [row] = await db.insert(s.bookingDrafts).values({
      id: crypto.randomUUID(),
      email,
      name: cleanName,
      language,
      ip,
      userAgent,
    }).returning();
    return row ?? null;
  } catch (err) { throw wrapStorageError("upsertBookingDraft", err); }
}

/**
 * Sella `completedAt` en todos los drafts abiertos (sin completar y sin
 * recordatorio enviado) que coincidan con el email indicado. Se llama
 * justo después de confirmar una reserva (POST /api/bookings/book).
 */
export async function markBookingDraftCompleted(email: string): Promise<number> {
  try {
    const normalized = normalizeEmail(email);
    const nowIso = new Date().toISOString();
    const rows = await db.update(s.bookingDrafts)
      .set({ completedAt: nowIso })
      .where(and(
        eq(s.bookingDrafts.email, normalized),
        sql`${s.bookingDrafts.completedAt} IS NULL`,
      ))
      .returning({ id: s.bookingDrafts.id });
    return rows.length;
  } catch (err) { throw wrapStorageError("markBookingDraftCompleted", err); }
}

/**
 * Devuelve drafts elegibles para enviar el recordatorio "Reserva incompleta":
 *   - Creados hace ≥ `minAgeMs` (por defecto 30 minutos)
 *   - Creados hace ≤ `maxAgeMs` (por defecto 24h — más viejos se descartan)
 *   - Sin `reminderSentAt`
 *   - Sin `completedAt`
 *   - Email no coincide con ninguna agenda activa (defensa en profundidad por
 *     si `markBookingDraftCompleted` no se llamó por alguna razón).
 */
export async function getBookingDraftsForReminder(opts?: {
  minAgeMs?: number;
  maxAgeMs?: number;
  limit?: number;
}): Promise<s.BookingDraft[]> {
  try {
    const minAgeMs = opts?.minAgeMs ?? 30 * 60_000;
    const maxAgeMs = opts?.maxAgeMs ?? 24 * 60 * 60_000;
    const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 500);
    const now = Date.now();
    const minIso = new Date(now - minAgeMs).toISOString();
    const maxIso = new Date(now - maxAgeMs).toISOString();
    const rows = await db.select().from(s.bookingDrafts).where(and(
      sql`${s.bookingDrafts.reminderSentAt} IS NULL`,
      sql`${s.bookingDrafts.completedAt} IS NULL`,
      sql`${s.bookingDrafts.createdAt} <= ${minIso}`,
      sql`${s.bookingDrafts.createdAt} >= ${maxIso}`,
      sql`NOT EXISTS (
        SELECT 1 FROM ${s.agenda} a
        WHERE a.email = ${s.bookingDrafts.email}
          AND (a.estado IS NULL OR a.estado NOT IN ('cancelled','no_show'))
      )`,
    ))
    .orderBy(asc(s.bookingDrafts.createdAt))
    .limit(limit);
    return rows;
  } catch (err) { throw wrapStorageError("getBookingDraftsForReminder", err); }
}

/**
 * Reclamo atómico: sella `reminderSentAt` solo si todavía estaba a NULL.
 * Devuelve la fila si el caller "ganó" la carrera, null en caso contrario.
 * Úsalo ANTES de enviar el email para que sweeps solapados no provoquen
 * recordatorios duplicados.
 */
export async function claimBookingDraftReminder(id: string): Promise<s.BookingDraft | null> {
  try {
    const nowIso = new Date().toISOString();
    const [row] = await db.update(s.bookingDrafts)
      .set({ reminderSentAt: nowIso })
      .where(and(
        eq(s.bookingDrafts.id, id),
        sql`${s.bookingDrafts.reminderSentAt} IS NULL`,
        sql`${s.bookingDrafts.completedAt} IS NULL`,
      ))
      .returning();
    return row ?? null;
  } catch (err) { throw wrapStorageError("claimBookingDraftReminder", err); }
}

/**
 * Revierte el reclamo cuando el envío del email ha fallado, para que el
 * próximo barrido pueda intentarlo de nuevo. Seguro de llamar aunque la
 * fila ya no exista.
 */
export async function unclaimBookingDraftReminder(id: string): Promise<void> {
  try {
    await db.update(s.bookingDrafts)
      .set({ reminderSentAt: null })
      .where(eq(s.bookingDrafts.id, id));
  } catch (err) { throw wrapStorageError("unclaimBookingDraftReminder", err); }
}
