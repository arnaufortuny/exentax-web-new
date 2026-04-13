import { db, type DbOrTx } from "../db";
import { eq, and, sql } from "drizzle-orm";
import * as s from "../../shared/schema";
import { generateId, wrapStorageError, normalizeEmail } from "./core";
import crypto from "crypto";
import { encryptSensitiveFields, decryptSensitiveFields, type SensitiveFieldName } from "../field-encryption";

const LEAD_SENSITIVE: readonly SensitiveFieldName[] = ["dni", "taxId", "phone", "address", "city", "postalCode"];
function decryptLead<T extends Record<string, unknown>>(row: T): T {
  return decryptSensitiveFields(row, LEAD_SENSITIVE);
}

export async function insertLead(data: s.InsertLead, txDb?: DbOrTx) {
  try {
    const encrypted = encryptSensitiveFields(data as unknown as Record<string, unknown>, LEAD_SENSITIVE) as unknown as s.InsertLead;
    const [row] = await (txDb || db).insert(s.leads).values(encrypted).returning();
    return decryptLead(row as unknown as Record<string, unknown>) as unknown as s.Lead;
  } catch (err) { throw wrapStorageError("insertLead", err); }
}

export async function insertVisita(data: s.InsertVisita) {
  try {
    const [row] = await db.insert(s.visitas).values(data).returning();
    return row;
  } catch (err) { throw wrapStorageError("insertVisita", err); }
}


export async function upsertNewsletterSubscriber(email: string, name: string, source: string, interests?: string[]) {
  try {
    const id = generateId("NS");
    const unsubToken = crypto.randomBytes(24).toString("hex");
    const [row] = await db.insert(s.newsletterSuscriptores).values({
      id,
      email,
      name: name || null,
      source,
      interests: interests && interests.length > 0 ? interests : null,
      unsubscribeToken: unsubToken,
      subscribedAt: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: s.newsletterSuscriptores.email,
      set: {
        unsubscribedAt: null,
        name: name || sql`${s.newsletterSuscriptores.name}`,
        ...(interests && interests.length > 0 ? {
          interests: sql`COALESCE(
            (SELECT array_agg(DISTINCT u) FROM unnest(
              COALESCE(${s.newsletterSuscriptores.interests}, '{}') || ${interests}::text[]
            ) AS u),
            '{}'
          )`,
        } : {}),
      },
    }).returning();
    return row;
  } catch (err) { throw wrapStorageError("upsertNewsletterSubscriber", err); }
}

export async function findNewsletterByUnsubToken(token: string) {
  try {
    const rows = await db.select().from(s.newsletterSuscriptores)
      .where(and(eq(s.newsletterSuscriptores.unsubscribeToken, token), sql`${s.newsletterSuscriptores.unsubscribedAt} IS NULL`))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("findNewsletterByUnsubToken", err); }
}

export async function updateNewsletterSuscriptor(id: string, updates: Partial<s.InsertNewsletterSuscriptor>) {
  try {
    const [row] = await db.update(s.newsletterSuscriptores).set(updates).where(eq(s.newsletterSuscriptores.id, id)).returning();
    return row ?? null;
  } catch (err) { throw wrapStorageError("updateNewsletterSuscriptor", err); }
}
