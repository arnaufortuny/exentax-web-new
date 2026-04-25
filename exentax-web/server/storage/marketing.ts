import { db, type DbOrTx } from "../db";
import { eq, and, sql } from "drizzle-orm";
import * as s from "../../shared/schema";
import { generateId, wrapStorageError, normalizeEmail } from "./core";
import crypto from "crypto";
import { encryptSensitiveFields, decryptSensitiveFields, type SensitiveFieldName } from "../field-encryption";

export interface ConsentLogEntry {
  formType: string;
  email?: string | null;
  privacyAccepted: boolean;
  marketingAccepted?: boolean | null;
  language?: string | null;
  source?: string | null;
  privacyVersion?: string | null;
  ip?: string | null;
}

/**
 * Persist a consent record and return its generated `con_*` identifier so
 * the same ID can be echoed in the Discord audit notification. The ID is the
 * authoritative cross-reference between the `#consentimientos` channel and
 * the `consent_log` row — never lose it (used for GDPR subject-access /
 * deletion responses).
 */
export async function insertConsentLog(entry: ConsentLogEntry): Promise<string> {
  try {
    const id = generateId("CON");
    await db.insert(s.consentLog).values({
      id,
      formType: entry.formType,
      email: entry.email || null,
      privacyAccepted: entry.privacyAccepted,
      marketingAccepted: entry.marketingAccepted ?? null,
      timestamp: new Date().toISOString(),
      language: entry.language || null,
      source: entry.source || null,
      privacyVersion: entry.privacyVersion || null,
      ip: entry.ip || null,
    });
    return id;
  } catch (err) { throw wrapStorageError("insertConsentLog", err); }
}

const LEAD_SENSITIVE: readonly SensitiveFieldName[] = ["phone"];
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

export async function insertVisit(data: s.InsertVisit) {
  try {
    const [row] = await db.insert(s.visits).values(data).returning();
    return row;
  } catch (err) { throw wrapStorageError("insertVisit", err); }
}


function toPgTextArrayLiteral(values: readonly string[]): string {
  // Build a Postgres text[] literal like `{"a","b\\"c"}` so it can be bound
  // as a single string parameter and cast to text[] in SQL. Drizzle's sql
  // template spreads JS arrays into N comma-separated params, which is not
  // what we want here.
  const escaped = values.map((v) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
  return `{${escaped.join(",")}}`;
}

export async function upsertNewsletterSubscriber(email: string, name: string, source: string, interests?: string[]) {
  try {
    const id = generateId("NS");
    const unsubToken = crypto.randomBytes(24).toString("hex");
    const interestsLiteral = interests && interests.length > 0 ? toPgTextArrayLiteral(interests) : null;
    // We add `isNew` via PostgreSQL's `xmax` system column: rows produced by
    // a fresh INSERT have xmax = 0; rows produced by ON CONFLICT DO UPDATE
    // have a non-zero xmax (the row's previous version). This is the
    // standard idiomatic insert-vs-update signal in Postgres and is
    // race-free (it's evaluated atomically per row).
    const rows = await db.insert(s.newsletterSubscribers).values({
      id,
      email,
      name: name || null,
      source,
      interests: interests && interests.length > 0 ? interests : null,
      unsubscribeToken: unsubToken,
      subscribedAt: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: s.newsletterSubscribers.email,
      set: {
        unsubscribedAt: null,
        name: name || sql`${s.newsletterSubscribers.name}`,
        ...(interestsLiteral ? {
          interests: sql`COALESCE(
            (SELECT array_agg(DISTINCT u) FROM unnest(
              COALESCE(${s.newsletterSubscribers.interests}, '{}'::text[]) || ${interestsLiteral}::text[]
            ) AS u),
            '{}'::text[]
          )`,
        } : {}),
      },
    }).returning({
      id: s.newsletterSubscribers.id,
      email: s.newsletterSubscribers.email,
      name: s.newsletterSubscribers.name,
      source: s.newsletterSubscribers.source,
      interests: s.newsletterSubscribers.interests,
      unsubscribeToken: s.newsletterSubscribers.unsubscribeToken,
      subscribedAt: s.newsletterSubscribers.subscribedAt,
      unsubscribedAt: s.newsletterSubscribers.unsubscribedAt,
      isNew: sql<boolean>`(xmax = 0)`.as("is_new"),
    });
    return rows[0];
  } catch (err) { throw wrapStorageError("upsertNewsletterSubscriber", err); }
}

export async function findNewsletterByUnsubToken(token: string) {
  try {
    const rows = await db.select().from(s.newsletterSubscribers)
      .where(and(eq(s.newsletterSubscribers.unsubscribeToken, token), sql`${s.newsletterSubscribers.unsubscribedAt} IS NULL`))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("findNewsletterByUnsubToken", err); }
}

export async function updateNewsletterSubscriber(id: string, updates: Partial<s.InsertNewsletterSubscriber>) {
  try {
    const [row] = await db.update(s.newsletterSubscribers).set(updates).where(eq(s.newsletterSubscribers.id, id)).returning();
    return row ?? null;
  } catch (err) { throw wrapStorageError("updateNewsletterSubscriber", err); }
}
