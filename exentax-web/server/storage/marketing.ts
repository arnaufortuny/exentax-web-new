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
  userAgent?: string | null;
}

/**
 * Persist a consent record and return its generated `con_*` identifier so
 * the same ID can be echoed in the Discord audit notification. The ID is the
 * authoritative cross-reference between the `#consentimientos` channel and
 * the `consent_log` row — never lose it (used for GDPR subject-access /
 * deletion responses).
 *
 * IP and User-Agent are persisted to satisfy the GDPR/AEPD audit-trail
 * requirement for proof of consent. Callers MUST pass an already-truncated
 * IP (via `truncateIp` from `route-helpers.ts`) — `consent_log` is a
 * compliance-log table, not an AML/KYC store, so storing the full IP would
 * be excessive under data-minimization. The User-Agent is truncated here
 * defensively at 300 chars to keep the row size sane.
 */
const MAX_USER_AGENT_LEN = 300;

export async function insertConsentLog(entry: ConsentLogEntry, txDb?: DbOrTx): Promise<string> {
  try {
    const id = generateId("CON");
    const ua = entry.userAgent ? entry.userAgent.slice(0, MAX_USER_AGENT_LEN) : null;
    // A4 fix: accept an optional `txDb` so the consent row commits atomically
    // with the surrounding business write (booking / calculator / newsletter).
    // GDPR/AEPD audit-trail requires the consent record to exist iff the
    // user-facing event was recorded — losing the consent row to a process
    // crash between commit and the floating `.then(...)` was a real
    // regulatory exposure (see `docs/audits/produccion-2026-04/01-funcional.md`
    // §6.b row A4).
    await (txDb || db).insert(s.consentLog).values({
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
      userAgent: ua,
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

/**
 * Audit Task #18 (April 2026): "agenda + leads sincronizados — cuando se
 * crea agenda, se actualiza `lead.scheduledCall=true` si existe lead
 * matching; si no, no se duplica."
 *
 * `leads` has only a non-unique index on `email` (because the calculator
 * flow already started its own dedup via `usedCalculator=true` updates),
 * so the booking handler used to blindly insert a fresh row on every
 * confirmation — producing two leads for the same address whenever a
 * visitor calculated first and booked second. This helper centralises
 * the upsert: if an active lead row exists for `data.email` we update
 * it (forcing `scheduledCall=true`, refreshing booking-relevant fields)
 * and return the resolved row; otherwise we insert with the supplied
 * id.
 *
 * The select+update path lives inside the caller's transaction so the
 * agenda + lead writes stay atomic. Phone is encrypted at the DB layer
 * exactly like `insertLead`.
 *
 * Returns `{ row, created }` so callers can decide whether to fire a
 * "new lead" Discord notification or stay quiet on the upsert path.
 */
export async function upsertLeadOnBooking(data: s.InsertLead, txDb?: DbOrTx): Promise<{ row: s.Lead; created: boolean }> {
  try {
    const conn = txDb || db;
    const email = normalizeEmail(data.email);
    const existingRows = await conn.select().from(s.leads).where(eq(s.leads.email, email)).limit(1);
    const existing = existingRows[0];
    if (existing) {
      // Refresh booking-relevant fields. Keep `usedCalculator` if it was
      // already true so we never lose the audit fact that the visitor
      // also ran the simulator. Phone is encrypted in place; if no new
      // phone was supplied, the existing (already-encrypted) value is
      // preserved verbatim — never re-wrap or it would double-encrypt.
      const updates: Partial<Record<string, unknown>> = {
        firstName: data.firstName,
        scheduledCall: true,
        source: data.source ?? existing.source,
        privacyAccepted: data.privacyAccepted ?? existing.privacyAccepted,
        termsAccepted: data.termsAccepted ?? existing.termsAccepted,
        marketingAccepted: data.marketingAccepted ?? existing.marketingAccepted,
        consentDateTime: data.consentDateTime ?? existing.consentDateTime,
        economicActivity: data.economicActivity ?? existing.economicActivity,
        ip: data.ip ?? existing.ip,
        date: data.date ?? existing.date,
      };
      if (data.lastName) updates.lastName = data.lastName;
      if (existing.usedCalculator === true) updates.usedCalculator = true;
      if (data.phone) updates.phone = data.phone;
      const encryptedUpdates = encryptSensitiveFields(updates as Record<string, unknown>, LEAD_SENSITIVE);
      const [row] = await conn.update(s.leads).set(encryptedUpdates as Record<string, unknown>).where(eq(s.leads.id, existing.id)).returning();
      return { row: decryptLead(row as unknown as Record<string, unknown>) as unknown as s.Lead, created: false };
    }
    const encrypted = encryptSensitiveFields(data as unknown as Record<string, unknown>, LEAD_SENSITIVE) as unknown as s.InsertLead;
    const [row] = await conn.insert(s.leads).values(encrypted).returning();
    return { row: decryptLead(row as unknown as Record<string, unknown>) as unknown as s.Lead, created: true };
  } catch (err) { throw wrapStorageError("upsertLeadOnBooking", err); }
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

export async function upsertNewsletterSubscriber(email: string, name: string, source: string, interests?: string[], txDb?: DbOrTx) {
  try {
    const id = generateId("NS");
    const unsubToken = crypto.randomBytes(24).toString("hex");
    const interestsLiteral = interests && interests.length > 0 ? toPgTextArrayLiteral(interests) : null;
    // A4 fix: accept an optional `txDb` so the subscription commits atomically
    // with the surrounding business write (booking / calculator / newsletter
    // footer). Previously, a process crash between the booking commit and the
    // floating `.catch()` could leave a confirmed booking with no newsletter
    // membership — silent marketing-consent loss for a contact who explicitly
    // opted in. See `docs/audits/produccion-2026-04/01-funcional.md` §6.b A4.
    //
    // We add `isNew` via PostgreSQL's `xmax` system column: rows produced by
    // a fresh INSERT have xmax = 0; rows produced by ON CONFLICT DO UPDATE
    // have a non-zero xmax (the row's previous version). This is the
    // standard idiomatic insert-vs-update signal in Postgres and is
    // race-free (it's evaluated atomically per row).
    const rows = await (txDb || db).insert(s.newsletterSubscribers).values({
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

export type DripSource = "guide" | "booking" | "calculator";

/**
 * Atomically create an active drip enrollment for `email` at step 0.
 * If an active enrollment already exists for the email
 * (`completed_at IS NULL`), the partial unique index causes
 * `ON CONFLICT DO NOTHING` to silently no-op and we return `null` so
 * the caller can skip the immediate-step send too.
 *
 * `nextSendAt` defaults to `now()` (used by the GUIDE flow, where step
 * 1 is sent inline by the route handler via `sendImmediateStep1`). The
 * CALCULATOR flow passes `nextSendAt = now() + 2 days` so the worker
 * fires step 1 (Laura case) two days after the immediate personalised
 * report email — the spec is 4 emails total at days 0/2/4/6 and the
 * day-0 email is `sendCalculatorEmail`, not a drip step.
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
  /**
   * Optional override. When omitted, defaults to "now" (the guide
   * flow's contract). Calculator passes "+2 days" so the worker waits
   * for the configured cadence before firing step 1.
   */
  nextSendAt?: string;
}, txDb?: DbOrTx): Promise<s.DripEnrollment | null> {
  try {
    const id = generateId("DRIP");
    const nextSendAt = opts.nextSendAt ?? new Date().toISOString();
    const cleanName = opts.name?.trim() || null;
    // RFC 8058 one-click unsubscribe token, generated alongside the row so
    // every drip email can carry a `List-Unsubscribe` header pointing to a
    // unique HTTPS endpoint. 32 bytes hex = 64 chars, indistinguishable
    // from random by an attacker without the secret.
    const unsubToken = (await import("node:crypto")).randomBytes(32).toString("hex");
    // Task #38: accept optional `txDb` so the enrollment row commits in the
    // SAME transaction as the outbox row (and the consent_log /
    // newsletter_subscribers writes). Previously the enrollment was created
    // OUTSIDE the route's `withTransaction`, which left a window where the
    // floating fire-and-forget `sendImmediateStep1` could race the worker
    // for the same row. With the outbox model, route handlers MUST pass
    // `txDb` so the enrollment + outbox row land atomically.
    const inserted = await (txDb || db).execute(sql`
      INSERT INTO drip_enrollments (id, email, name, language, source, current_step, last_sent_step, next_send_at, unsubscribe_token)
      VALUES (${id}, ${opts.email}, ${cleanName}, ${opts.language}, ${opts.source}, 0, 0, ${nextSendAt}, ${unsubToken})
      ON CONFLICT (email) WHERE completed_at IS NULL DO NOTHING
      RETURNING id, email, name, language, source, current_step AS "currentStep",
                last_sent_step AS "lastSentStep",
                next_send_at AS "nextSendAt", completed_at AS "completedAt",
                claimed_at AS "claimedAt", last_error AS "lastError",
                unsubscribe_token AS "unsubscribeToken",
                fecha_creacion AS "createdAt"
    `);
    const rows = (inserted as unknown as { rows: s.DripEnrollment[] }).rows ?? [];
    return rows[0] ?? null;
  } catch (err) {
    throw wrapStorageError("tryCreateDripEnrollment", err);
  }
}

// ─── Email outbox (Task #38, 2026-04-30) ─────────────────────────────────────
// Transactional outbox that replaces the legacy "send-then-mark-sentinel"
// pattern. See `shared/schema.ts:emailOutbox` for the full lifecycle and
// the audit doc row A2 for the residuals it eliminates.

/**
 * Shape of `email_outbox.payload`. The outbox row carries everything the
 * worker needs to dispatch the email — the worker never re-derives this
 * from `drip_enrollments` so a row that was enqueued under one schema
 * version is still dispatchable after a deploy that changes the
 * enrollment table.
 */
export interface OutboxPayload {
  kind: "guide" | "calculator";
  email: string;
  name: string | null;
  language: string;
  step: number;
  unsubToken: string | null;
}

/**
 * Idempotently insert one outbox row inside the caller's transaction.
 * Re-issuing the same `(enrollmentId, step)` is a no-op — the unique
 * index on `(enrollment_id, step)` guarantees at-most-one row per
 * enrollment+step combination, which is what makes the outbox
 * idempotent across route retries / replays / page double-submits.
 *
 * Returns the inserted row, or `null` when the row already existed
 * (caller can branch on this if they need to know whether they actually
 * enqueued anything new — e.g. to decide whether to fire a worker
 * wake-up tick).
 */
export async function enqueueOutboxRow(opts: {
  enrollmentId: string;
  step: number;
  payload: OutboxPayload;
  /** ISO timestamp; defaults to now (immediately due). */
  nextAttemptAt?: string;
}, txDb?: DbOrTx): Promise<s.EmailOutboxRow | null> {
  try {
    const id = generateId("OBX");
    const nextAttemptAt = opts.nextAttemptAt ?? new Date().toISOString();
    const inserted = await (txDb || db).execute(sql`
      INSERT INTO email_outbox (id, enrollment_id, step, payload, next_attempt_at)
      VALUES (${id}, ${opts.enrollmentId}, ${opts.step}, ${JSON.stringify(opts.payload)}, ${nextAttemptAt})
      ON CONFLICT (enrollment_id, step) DO NOTHING
      RETURNING id, enrollment_id AS "enrollmentId", step, payload,
                claimed_at AS "claimedAt", claim_version AS "claimVersion",
                attempts, max_attempts AS "maxAttempts",
                sent_at AS "sentAt", last_error AS "lastError",
                next_attempt_at AS "nextAttemptAt",
                fecha_creacion AS "createdAt"
    `);
    const rows = (inserted as unknown as { rows: s.EmailOutboxRow[] }).rows ?? [];
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("enqueueOutboxRow", err); }
}

/**
 * Atomically claim up to `limit` due outbox rows. Mirrors
 * `claimDueDripEnrollments` (`SELECT … FOR UPDATE SKIP LOCKED` inside an
 * `UPDATE … RETURNING`) so concurrent workers cannot grab the same
 * row. Each successful claim:
 *   - Bumps `claim_version` by 1 (this is the fencing token returned to
 *     the caller).
 *   - Bumps `attempts` by 1 — bounding residual (c) above. After
 *     `attempts >= max_attempts` the row falls out of the eligibility
 *     filter even if `next_attempt_at` keeps rolling over, so a row
 *     stuck in a SMTP-OK + sentinel-fail loop can produce at most
 *     `max_attempts` total dispatches across its lifetime.
 *   - Sets `claimed_at` to `now`.
 *
 * Eligibility:
 *   - `sent_at IS NULL` (still pending)
 *   - `next_attempt_at <= now` (backoff is up)
 *   - `attempts < max_attempts` (budget not exhausted)
 *   - `claimed_at IS NULL OR claimed_at < now - staleSeconds` (treats
 *     a long-stuck claim as a crashed worker)
 */
export async function claimDueOutboxRows(opts: {
  limit: number;
  staleSeconds: number;
}): Promise<s.EmailOutboxRow[]> {
  try {
    const result = await db.execute(sql`
      UPDATE email_outbox AS o
         SET claimed_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
             claim_version = o.claim_version + 1,
             attempts = o.attempts + 1
       WHERE o.id IN (
         SELECT id FROM email_outbox
          WHERE sent_at IS NULL
            AND next_attempt_at <= to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            AND attempts < max_attempts
            AND (
              claimed_at IS NULL
              OR claimed_at < to_char((now() - (${opts.staleSeconds} || ' seconds')::interval) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            )
          ORDER BY next_attempt_at
          LIMIT ${opts.limit}
          FOR UPDATE SKIP LOCKED
       )
      RETURNING o.id, o.enrollment_id AS "enrollmentId", o.step, o.payload,
                o.claimed_at AS "claimedAt",
                o.claim_version AS "claimVersion",
                o.attempts, o.max_attempts AS "maxAttempts",
                o.sent_at AS "sentAt", o.last_error AS "lastError",
                o.next_attempt_at AS "nextAttemptAt",
                o.fecha_creacion AS "createdAt"
    `);
    const rows = (result as unknown as { rows: s.EmailOutboxRow[] }).rows ?? [];
    return rows;
  } catch (err) { throw wrapStorageError("claimDueOutboxRows", err); }
}

/**
 * Fencing-CAS: mark the row as durably sent IFF our `claim_version`
 * still matches what the worker recorded at claim time. If a stale
 * lease was reclaimed by another worker, the version no longer
 * matches and this UPDATE no-ops — the original worker's belated
 * call thus cannot overwrite the newer claim's eventual `sent_at`,
 * preserving the exactly-once contract on the persistence layer.
 *
 * Returns `true` when the CAS succeeded, `false` otherwise. Caller
 * uses the false branch to abandon the row (a parallel worker is
 * handling it) without releasing the claim or scheduling retries.
 */
export async function markOutboxRowSent(opts: { id: string; claimVersion: number }, txDb?: DbOrTx): Promise<boolean> {
  try {
    const result = await (txDb || db).execute(sql`
      UPDATE email_outbox
         SET sent_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
             claimed_at = NULL,
             last_error = NULL
       WHERE id = ${opts.id}
         AND claim_version = ${opts.claimVersion}
         AND sent_at IS NULL
      RETURNING id
    `);
    const rows = (result as unknown as { rows: { id: string }[] }).rows ?? [];
    return rows.length > 0;
  } catch (err) { throw wrapStorageError("markOutboxRowSent", err); }
}

/**
 * Fencing-CAS release: SMTP failed (no email was sent). Clear the claim
 * and schedule the next attempt. Only writes if our `claim_version`
 * still matches — if a stale lease was reclaimed elsewhere we silently
 * no-op (no spurious release of someone else's claim).
 */
export async function releaseOutboxRowOnError(opts: {
  id: string;
  claimVersion: number;
  error: string;
  nextAttemptAt: string;
}): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      UPDATE email_outbox
         SET claimed_at = NULL,
             last_error = ${opts.error.slice(0, 500)},
             next_attempt_at = ${opts.nextAttemptAt}
       WHERE id = ${opts.id}
         AND claim_version = ${opts.claimVersion}
         AND sent_at IS NULL
      RETURNING id
    `);
    const rows = (result as unknown as { rows: { id: string }[] }).rows ?? [];
    return rows.length > 0;
  } catch (err) { throw wrapStorageError("releaseOutboxRowOnError", err); }
}

/**
 * Fencing-CAS poison: SMTP delivered but the post-send sentinel write
 * (`markOutboxRowSent`) failed every retry. Park the row so neither
 * the claim selector nor the staleness sweeper can re-pick it: set
 * `next_attempt_at` to the far future and prefix `last_error` with
 * `POISONED:` so the periodic Discord alert layer can flag it for
 * operator triage.
 *
 * The fencing CAS prevents poison from clobbering a row that another
 * worker has already successfully marked sent (we'd never want to
 * shadow a real `sent_at`).
 */
export async function poisonOutboxRow(opts: {
  id: string;
  claimVersion: number;
  step: number;
  error: string;
}): Promise<boolean> {
  try {
    // Far future — effectively "never" for the worker. Operator
    // recovery is to confirm SMTP delivery via gmail logs and then
    // either delete the row or set sent_at manually.
    const farFuture = "9999-12-31T00:00:00.000Z";
    const result = await db.execute(sql`
      UPDATE email_outbox
         SET next_attempt_at = ${farFuture},
             last_error = ${`POISONED:step=${opts.step}:${opts.error}`.slice(0, 500)}
       WHERE id = ${opts.id}
         AND claim_version = ${opts.claimVersion}
         AND sent_at IS NULL
      RETURNING id
    `);
    const rows = (result as unknown as { rows: { id: string }[] }).rows ?? [];
    return rows.length > 0;
  } catch (err) { throw wrapStorageError("poisonOutboxRow", err); }
}

/**
 * Pre-send fencing helper: read the row's CURRENT `claim_version` so the
 * worker can verify, immediately before SMTP dispatch, that no other worker
 * has stolen the lease (stale-claim reclaim) since this worker last saw it.
 *
 * Returns:
 *   - The current `claim_version` if the row still exists and has NOT been
 *     sent yet (i.e. is a candidate for the worker about to dispatch).
 *   - `null` if the row no longer exists OR has already been sent.
 *
 * Cheap single-row read, NOT transactional. The only safety guarantee we
 * need at this point is: "if the value read here equals row.claimVersion,
 * we still own the row right now, so SMTP is safe to fire". A reclaim
 * arriving in the interval between this read and the SMTP call would still
 * race, but the window is microseconds (the reclaim only happens after
 * STALE_CLAIM_SECONDS = 600s of inactivity), so in practice this eliminates
 * residual (b) at the delivery level.
 *
 * Bug history (round 7 audit): a previous implementation restricted the
 * WHERE clause to rows that were `POISONED` or `attempts >= max_attempts`,
 * which made the function return `null` for healthy claimed rows. Callers
 * interpret `null` as "the row is gone, skip the send" — leaking dispatches
 * AND leaving rows orphan in `claimed` state until lease expiry. The WHERE
 * is now intentionally minimal: row exists AND not yet sent.
 */
export async function getOutboxClaimVersion(id: string): Promise<number | null> {
  try {
    const result = await db.execute(sql`
      SELECT claim_version AS "claimVersion"
        FROM email_outbox
       WHERE id = ${id} AND sent_at IS NULL
       LIMIT 1
    `);
    const rows = (result as unknown as { rows: { claimVersion: number }[] }).rows ?? [];
    return rows[0]?.claimVersion ?? null;
  } catch (err) { throw wrapStorageError("getOutboxClaimVersion", err); }
}

export interface PoisonedOutboxSampleRow {
  id: string;
  enrollmentId: string;
  step: number;
  emailMasked: string;
  kind: string;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  reason: "poisoned" | "exhausted";
}

function maskEmailForAlert(email: string | null | undefined): string {
  if (!email || typeof email !== "string") return "(unknown)";
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const head = local.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, local.length - 2))}${domain}`;
}

/**
 * Operator alerting helper (Task #69): count outbox rows that are stuck
 * and will never re-send on their own. Two failure modes are aggregated
 * because both produce the same downstream symptom (the next step in
 * the drip sequence will never fire — silent marketing-funnel data loss):
 *
 *   1. POISONED rows — `last_error LIKE 'POISONED:%'`. Set by
 *      `poisonOutboxRow` when SMTP delivered but the post-send sentinel
 *      write failed every retry; `next_attempt_at = 9999-12-31` parks
 *      the row out of the worker's claim selector forever.
 *   2. EXHAUSTED rows — `attempts >= max_attempts AND sent_at IS NULL`.
 *      The claim selector's `attempts < max_attempts` filter makes the
 *      row ineligible even if `next_attempt_at` rolls over.
 *
 * Returns aggregate counts plus up to `sampleLimit` rows for the Discord
 * alert. Ordered by `fecha_creacion DESC` so the freshest stuck rows
 * surface first — they are usually the ones the operator can still
 * recover before the recipient notices the missing follow-up.
 */
export async function countPoisonedOutboxRows(opts: { sampleLimit: number }): Promise<{
  total: number;
  poisoned: number;
  exhausted: number;
  sample: PoisonedOutboxSampleRow[];
}> {
  try {
    const totals = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE last_error LIKE 'POISONED:%')::int AS poisoned,
        COUNT(*) FILTER (WHERE attempts >= max_attempts AND sent_at IS NULL)::int AS exhausted,
        COUNT(*) FILTER (
          WHERE last_error LIKE 'POISONED:%'
             OR (attempts >= max_attempts AND sent_at IS NULL)
        )::int AS total
      FROM email_outbox
    `);
    const totalsRow = (totals as unknown as {
      rows: { poisoned: number; exhausted: number; total: number }[];
    }).rows[0] ?? { poisoned: 0, exhausted: 0, total: 0 };

    let sample: PoisonedOutboxSampleRow[] = [];
    if (totalsRow.total > 0 && opts.sampleLimit > 0) {
      const sampleRes = await db.execute(sql`
        SELECT id, enrollment_id AS "enrollmentId", step, payload,
               attempts, max_attempts AS "maxAttempts", last_error AS "lastError"
          FROM email_outbox
         WHERE last_error LIKE 'POISONED:%'
            OR (attempts >= max_attempts AND sent_at IS NULL)
         ORDER BY fecha_creacion DESC
         LIMIT ${opts.sampleLimit}
      `);
      const rows = (sampleRes as unknown as {
        rows: Array<{
          id: string;
          enrollmentId: string;
          step: number;
          payload: string;
          attempts: number;
          maxAttempts: number;
          lastError: string | null;
        }>;
      }).rows ?? [];
      sample = rows.map((r) => {
        let kind = "?";
        let email = "";
        try {
          const p = JSON.parse(r.payload) as Partial<OutboxPayload>;
          kind = String(p.kind ?? "?");
          email = String(p.email ?? "");
        } catch {
          // Malformed payload — fine; row is stuck for a different reason.
        }
        const reason: "poisoned" | "exhausted" =
          r.lastError && r.lastError.startsWith("POISONED:") ? "poisoned" : "exhausted";
        return {
          id: r.id,
          enrollmentId: r.enrollmentId,
          step: r.step,
          emailMasked: maskEmailForAlert(email),
          kind,
          attempts: r.attempts,
          maxAttempts: r.maxAttempts,
          lastError: r.lastError,
          reason,
        };
      });
    }

    return {
      total: totalsRow.total,
      poisoned: totalsRow.poisoned,
      exhausted: totalsRow.exhausted,
      sample,
    };
  } catch (err) { throw wrapStorageError("countPoisonedOutboxRows", err); }
}

/**
 * Operator-triggered recovery (Task #69): reset a stuck outbox row so
 * the worker re-tries delivery on its next tick. Only acts on rows
 * still pending (`sent_at IS NULL`) — a row already marked sent must
 * NOT be revived from the operator path (that would risk a duplicate
 * marketing email, which is the very thing the outbox lifecycle exists
 * to prevent).
 *
 * Returns `true` if the row was found and reset, `false` if the id is
 * unknown or the row was already sent (caller should respond 404 in
 * that case so the operator notices their mistake).
 */
export async function retryPoisonedOutboxRow(id: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      UPDATE email_outbox
         SET attempts = 0,
             next_attempt_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
             last_error = NULL,
             claimed_at = NULL
       WHERE id = ${id} AND (last_error LIKE 'POISONED:%' OR attempts >= max_attempts)
         AND sent_at IS NULL
      RETURNING id
    `);
    const rows = (result as unknown as { rows: { id: string }[] }).rows ?? [];
    return rows.length > 0;
  } catch (err) { throw wrapStorageError("retryPoisonedOutboxRow", err); }
}

/**
 * Test-only / operator helper: look up the outbox row for an enrollment
 * + step. Used by the regression test to assert the row's terminal
 * state after each scenario.
 */
export async function findOutboxRow(opts: { enrollmentId: string; step: number }): Promise<s.EmailOutboxRow | null> {
  try {
    const result = await db.execute(sql`
      SELECT id, enrollment_id AS "enrollmentId", step, payload,
             claimed_at AS "claimedAt",
             claim_version AS "claimVersion",
             attempts, max_attempts AS "maxAttempts",
             sent_at AS "sentAt", last_error AS "lastError",
             next_attempt_at AS "nextAttemptAt",
             fecha_creacion AS "createdAt"
        FROM email_outbox
       WHERE enrollment_id = ${opts.enrollmentId}
         AND step = ${opts.step}
       LIMIT 1
    `);
    const rows = (result as unknown as { rows: s.EmailOutboxRow[] }).rows ?? [];
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("findOutboxRow", err); }
}

/**
 * Mark step `n` as just-sent and schedule the next send for `opts.nextSendAt`.
 * The worker passes `nextSendAt = null` when `n` was the final step for that
 * source (guide=6, calculator=3, legacy booking=6). In that case we set
 * `completed_at = now()` and leave `next_send_at = null` so the
 * `drip_enrollments_active_email_uniq` partial index releases the email for
 * any future re-enrollment (e.g. user does the calculator and later requests
 * the guide).
 */
export async function advanceDripEnrollment(opts: {
  id: string;
  toStep: number;
  nextSendAt: string | null;
}, txDb?: DbOrTx) {
  try {
    const isFinalStep = opts.nextSendAt === null;
    const completedAt = isFinalStep ? new Date().toISOString() : null;
    // Task #38: accept optional `txDb` so the post-SMTP write set
    // (markOutboxRowSent + advanceDripEnrollment + lastSentStep update +
    // enqueueOutboxRow(nextStep)) commits as a single transaction. Without
    // this the enrollment would advance via the global `db` even when
    // the surrounding tx rolls back, leaving partial state (e.g. enrollment
    // at step N+1 but outbox row for step N still pending) that can
    // produce duplicate sends.
    await (txDb || db).update(s.dripEnrollments).set({
      currentStep: opts.toStep,
      nextSendAt: opts.nextSendAt,
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
 * Mark `step` as durably sent at the SMTP layer. Called by the drip
 * worker IMMEDIATELY after Gmail's send returns OK, in a write that is
 * separate from `advanceDripEnrollment`. The compare-and-set
 * (`last_sent_step < toStep`) is what guarantees the exactly-once
 * contract: a concurrent worker that already marked the same step
 * (rolling deploy, dev + audit script co-tenancy) cannot double-mark
 * — it's a no-op UPDATE that returns 0 affected rows.
 *
 * This is intentionally a SECOND DB round-trip after the SMTP send (we
 * could do it inside the same UPDATE that advances `currentStep`, but
 * the whole point of the sentinel is to survive the case where
 * `advanceDripEnrollment` itself errors after a successful send). The
 * cost is one extra UPDATE per drip step — fine at the cadence this
 * runs at (single-digit emails per minute).
 */
export async function markDripStepSent(opts: { id: string; toStep: number }): Promise<void> {
  try {
    await db.execute(sql`
      UPDATE drip_enrollments
         SET last_sent_step = ${opts.toStep}
       WHERE id = ${opts.id}
         AND last_sent_step < ${opts.toStep}
    `);
  } catch (err) { throw wrapStorageError("markDripStepSent", err); }
}

/**
 * Park an enrollment as poisoned: SMTP succeeded for `step` but we
 * could not durably persist the `last_sent_step` sentinel after several
 * retries. To preserve the exactly-once contract we MUST NOT release
 * the claim (`markDripEnrollmentError` would, and the next claim would
 * re-send) and we MUST NOT advance `current_step`. Instead we NULL
 * `next_send_at` so the row no longer matches the claim selector
 * (`claimDueDripEnrollments` filters on `next_send_at IS NOT NULL`)
 * and we record a structured `last_error` prefixed with `POISONED:` so
 * the periodic-reports / Discord alert layer can flag it for manual
 * triage. The operator's recovery action is: confirm via SMTP logs
 * whether the email actually delivered, then either set
 * `last_sent_step = ${step}` and restore `next_send_at` (if delivered)
 * or null `last_sent_step` and restore `next_send_at` (to retry).
 */
export async function poisonDripEnrollment(opts: { id: string; step: number; error: string }): Promise<void> {
  try {
    await db.update(s.dripEnrollments).set({
      nextSendAt: null,
      lastError: `POISONED:step=${opts.step}:${opts.error}`.slice(0, 500),
    }).where(eq(s.dripEnrollments.id, opts.id));
  } catch (err) { throw wrapStorageError("poisonDripEnrollment", err); }
}

/**
 * Single-row atomic claim used by `sendImmediateStep1` so the route's
 * fire-and-forget immediate dispatch cannot race with a concurrent
 * `claimDueDripEnrollments` (worker tick) on the SAME row.
 *
 * Without this, the newsletter / calculator route flow:
 *     tryCreateDripEnrollment(next_send_at = now())  // row is "due"
 *     void sendImmediateStep1(...)                   // dispatches SMTP
 * could be raced by drainTick, which independently claims due rows and
 * dispatches step 1. Both paths would `sendDripEmailOnce` before either
 * `markDripStepSent` becomes visible — the CAS in markDripStepSent
 * prevents a duplicate sentinel WRITE but cannot prevent the duplicate
 * SMTP. So the only way to get strict exactly-once is to make the
 * immediate path acquire the same `claimed_at` lock the worker uses.
 *
 * Returns `true` if this caller now owns the row (proceed with
 * dispatch), `false` if another worker beat us (do nothing — that
 * worker will dispatch).
 */
export async function tryClaimDripEnrollmentForImmediate(opts: { id: string; expectedStep: number }): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      UPDATE drip_enrollments
         SET claimed_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
       WHERE id = ${opts.id}
         AND completed_at IS NULL
         AND claimed_at IS NULL
         AND last_sent_step < ${opts.expectedStep}
      RETURNING id
    `);
    const rows = (result as unknown as { rows: { id: string }[] }).rows ?? [];
    return rows.length > 0;
  } catch (err) { throw wrapStorageError("tryClaimDripEnrollmentForImmediate", err); }
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
                d.last_sent_step AS "lastSentStep",
                d.next_send_at AS "nextSendAt",
                d.completed_at AS "completedAt",
                d.claimed_at  AS "claimedAt",
                d.last_error  AS "lastError",
                d.unsubscribe_token AS "unsubscribeToken",
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

/**
 * Resolve a drip enrollment by its RFC 8058 unsubscribe token. Used by
 * the public `/api/drip/unsubscribe/:token` endpoint to identify which
 * row to terminate when the recipient clicks the one-click link in their
 * mail client. Returns null when the token is unknown — the route
 * layer maps that to a generic 200 to avoid leaking enumeration signal.
 */
export async function findDripEnrollmentByUnsubToken(token: string) {
  try {
    const rows = await db.select().from(s.dripEnrollments)
      .where(eq(s.dripEnrollments.unsubscribeToken, token))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("findDripEnrollmentByUnsubToken", err); }
}

/**
 * Idempotently mark a drip enrollment as unsubscribed: sets `completed_at`
 * (so the active-uniq index releases the email) and clears `next_send_at`
 * (so the worker stops scheduling further steps). Safe to call multiple
 * times — re-running on an already-completed row is a cheap no-op.
 */
export async function unsubscribeDripEnrollment(id: string): Promise<void> {
  try {
    await db.update(s.dripEnrollments).set({
      completedAt: new Date().toISOString(),
      nextSendAt: null,
      claimedAt: null,
    }).where(eq(s.dripEnrollments.id, id));
  } catch (err) { throw wrapStorageError("unsubscribeDripEnrollment", err); }
}

// ─── GDPR retention purges ──────────────────────────────────────────────────
/**
 * Each helper deletes rows older than `cutoffDate` (a JS Date in UTC) and
 * returns the number of rows removed. The cutoff is computed by the caller
 * (`server/scheduled/retention-purge.ts`) so the retention matrix lives in
 * one place. Each function is independent and idempotent — re-running on a
 * quiet table is a cheap no-op.
 *
 * Tables NOT purged here (regulatory hold):
 *   - `leads`     — AML/KYC requires 7-year retention.
 *   - `agenda`    — booking record tied to lead, same 7-year hold.
 *   - `legal_document_versions` — immutable audit trail of consent
 *      versions; never deleted.
 */
export async function purgeOldVisits(cutoffDate: Date): Promise<number> {
  try {
    const result = await db.delete(s.visits)
      .where(sql`${s.visits.createdAt} < ${cutoffDate}`);
    // drizzle returns { rowCount } on pg; fallback to 0 for typing safety.
    return (result as unknown as { rowCount?: number }).rowCount ?? 0;
  } catch (err) { throw wrapStorageError("purgeOldVisits", err); }
}

export async function purgeOldConsentLog(cutoffDate: Date): Promise<number> {
  try {
    const result = await db.delete(s.consentLog)
      .where(sql`${s.consentLog.createdAt} < ${cutoffDate}`);
    return (result as unknown as { rowCount?: number }).rowCount ?? 0;
  } catch (err) { throw wrapStorageError("purgeOldConsentLog", err); }
}

export async function purgeOldCalculations(cutoffDate: Date): Promise<number> {
  try {
    const result = await db.delete(s.calculations)
      .where(sql`${s.calculations.createdAt} < ${cutoffDate}`);
    return (result as unknown as { rowCount?: number }).rowCount ?? 0;
  } catch (err) { throw wrapStorageError("purgeOldCalculations", err); }
}

export async function purgeUnsubscribedNewsletter(cutoffDate: Date): Promise<number> {
  try {
    // Only delete subscribers who actively unsubscribed AND whose
    // unsubscribe happened before the cutoff. Active subscribers are
    // retained indefinitely until they unsubscribe themselves.
    const cutoffIso = cutoffDate.toISOString();
    const result = await db.delete(s.newsletterSubscribers)
      .where(and(
        sql`${s.newsletterSubscribers.unsubscribedAt} IS NOT NULL`,
        sql`${s.newsletterSubscribers.unsubscribedAt} < ${cutoffIso}`,
      ));
    return (result as unknown as { rowCount?: number }).rowCount ?? 0;
  } catch (err) { throw wrapStorageError("purgeUnsubscribedNewsletter", err); }
}
