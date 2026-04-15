import { db, type DbOrTx } from "../db";
import { eq, and, asc, gte, sql } from "drizzle-orm";
import * as s from "../../shared/schema";
import { normalizeEmail, wrapStorageError } from "./core";
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

export async function markReminderSent(agendaId: string) {
  try {
    const [row] = await db.update(s.agenda).set({ reminderSent: true }).where(eq(s.agenda.id, agendaId)).returning();
    return row ?? null;
  } catch (err) { throw wrapStorageError("markReminderSent", err); }
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
  } catch (err) { throw wrapStorageError("insertAgenda", err); }
}

export async function updateAgenda(id: string, updates: Partial<Omit<s.InsertAgenda, "id">>) {
  try {
    const encrypted = encryptSensitiveFields(updates as unknown as Record<string, unknown>, AGENDA_SENSITIVE) as unknown as Partial<Omit<s.InsertAgenda, "id">>;
    const [row] = await db.update(s.agenda).set(encrypted).where(eq(s.agenda.id, id)).returning();
    if (!row) return null;
    return decryptAgenda(row as unknown as Record<string, unknown>) as unknown as s.Agenda;
  } catch (err) { throw wrapStorageError("updateAgenda", err); }
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
