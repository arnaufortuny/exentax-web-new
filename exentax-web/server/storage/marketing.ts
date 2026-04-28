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

// ─── Drip enrollments ────────────────────────────────────────────────────────
// Owns the lifecycle of the 6-step nurture sequence. Step 1 is sent
// synchronously by the route handler immediately after enrollment; the
// background worker (server/scheduled/drip-worker.ts) advances steps 2–6
// on the day-3/6/9/12/15 cadence.

export type DripSource = "guide" | "booking";

/**
 * Atomically create an active drip enrollment for `email` at step 0
 * with `nextSendAt = now()`. If an active enrollment already exists for
 * the email (completed_at IS NULL), the partial unique index causes
 * `ON CONFLICT DO NOTHING` to silently no-op and we return `null` so
 * the caller can skip the immediate-step send too.
 *
 * Returns the freshly inserted row, or `null` if the email already has
 * an active enrollment (idempotent across page reloads / double-submits
 * / signup-then-booking).
 */
export async function tryCreateDripEnrollment(opts: {
  email: string;
  name?: string | null;
  language: string;
  source: DripSource;
}): Promise<s.DripEnrollment | null> {
  try {
    const id = generateId("DRIP");
    const nowIso = new Date().toISOString();
    const cleanName = opts.name?.trim() || null;
    const inserted = await db.execute(sql`
      INSERT INTO drip_enrollments (id, email, name, language, source, current_step, next_send_at)
      VALUES (${id}, ${opts.email}, ${cleanName}, ${opts.language}, ${opts.source}, 0, ${nowIso})
      ON CONFLICT (email) WHERE completed_at IS NULL DO NOTHING
      RETURNING id, email, name, language, source, current_step AS "currentStep",
                next_send_at AS "nextSendAt", completed_at AS "completedAt",
                claimed_at AS "claimedAt", last_error AS "lastError",
                fecha_creacion AS "createdAt"
    `);
    const rows = (inserted as unknown as { rows: s.DripEnrollment[] }).rows ?? [];
    return rows[0] ?? null;
  } catch (err) {
    throw wrapStorageError("tryCreateDripEnrollment", err);
  }
}

/**
 * Mark step `n` as just-sent and schedule step `n+1` for `nextDelayMs`
 * from now. When `n === 6`, sets `completed_at` and clears
 * `next_send_at` so the active-uniq index releases the email for any
 * future re-enrollment.
 */
export async function advanceDripEnrollment(opts: {
  id: string;
  toStep: number;
  nextSendAt: string | null;
}) {
  try {
    const completedAt = opts.toStep >= 6 ? new Date().toISOString() : null;
    await db.update(s.dripEnrollments).set({
      currentStep: opts.toStep,
      nextSendAt: opts.toStep >= 6 ? null : opts.nextSendAt,
      completedAt,
      claimedAt: null,
      lastError: null,
    }).where(eq(s.dripEnrollments.id, opts.id));
  } catch (err) { throw wrapStorageError("advanceDripEnrollment", err); }
}

/**
 * Mark a drip enrollment as failed for the current step (keeps step
 * unchanged, releases the claim, records the error). Worker will retry
 * on its next tick when `next_send_at <= now()`.
 */
export async function markDripEnrollmentError(opts: { id: string; error: string }) {
  try {
    await db.update(s.dripEnrollments).set({
      claimedAt: null,
      lastError: opts.error.slice(0, 500),
    }).where(eq(s.dripEnrollments.id, opts.id));
  } catch (err) { throw wrapStorageError("markDripEnrollmentError", err); }
}

/**
 * Atomically claim up to `limit` due enrollments for the drip worker.
 *
 * Mirrors the email-retry-queue pattern: `SELECT ... FOR UPDATE SKIP
 * LOCKED` inside an `UPDATE ... RETURNING` so concurrent workers (e.g.
 * during a rolling deploy) cannot send the same step twice. A row is
 * "due" when:
 *   - `next_send_at <= now()` (Postgres clock — no host clock skew)
 *   - `completed_at IS NULL` (still active)
 *   - it is unclaimed, OR its claim is older than `staleSeconds`
 *     (treated as a crashed worker that failed to release).
 *
 * `claimed_at` is durable in the row, so a process that crashes after
 * the claim but before the send simply leaves the row hidden until
 * the stale timeout, when another worker rescues it.
 */
export async function claimDueDripEnrollments(opts: { limit: number; staleSeconds: number }): Promise<s.DripEnrollment[]> {
  try {
    const result = await db.execute(sql`
      UPDATE drip_enrollments AS d
         SET claimed_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
       WHERE d.id IN (
         SELECT id FROM drip_enrollments
          WHERE completed_at IS NULL
            AND next_send_at IS NOT NULL
            AND next_send_at <= to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            AND (
              claimed_at IS NULL
              OR claimed_at < to_char((now() - (${opts.staleSeconds} || ' seconds')::interval) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            )
          ORDER BY next_send_at
          LIMIT ${opts.limit}
          FOR UPDATE SKIP LOCKED
       )
      RETURNING d.id, d.email, d.name, d.language, d.source,
                d.current_step AS "currentStep",
                d.next_send_at AS "nextSendAt",
                d.completed_at AS "completedAt",
                d.claimed_at  AS "claimedAt",
                d.last_error  AS "lastError",
                d.fecha_creacion AS "createdAt"
    `);
    const rows = (result as unknown as { rows: s.DripEnrollment[] }).rows ?? [];
    return rows;
  } catch (err) { throw wrapStorageError("claimDueDripEnrollments", err); }
}

export async function findActiveDripEnrollmentByEmail(email: string) {
  try {
    const rows = await db.select().from(s.dripEnrollments)
      .where(and(eq(s.dripEnrollments.email, email), sql`${s.dripEnrollments.completedAt} IS NULL`))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("findActiveDripEnrollmentByEmail", err); }
}
