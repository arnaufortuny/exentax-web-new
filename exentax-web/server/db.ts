import { drizzle } from "drizzle-orm/node-postgres";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient } from "pg";
import * as schema from "../shared/schema";
import { logger } from "./logger";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || (isProduction ? "25" : "10"), 10),
  min: isProduction ? 2 : 0,
  idleTimeoutMillis: isProduction ? 60000 : 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 30000,
  query_timeout: 30000,
  allowExitOnIdle: !isProduction,
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

pool.on("error", (err) => {
  logger.error(`Unexpected pool error: ${err.message}`, "db");
});

pool.on("connect", () => {
  logger.debug("New DB connection established", "db");
});

// Slow-query observability. Wraps `pool.query` (the function Drizzle calls
// under the hood) so we can measure every statement and emit a WARN when it
// crosses the threshold. The pool itself enforces `statement_timeout`, so
// this is purely diagnostic — it never cancels a query, never alters its
// result, and degrades safely if `performance.now` is unavailable.
const SLOW_QUERY_MS = parseInt(process.env.DB_SLOW_QUERY_MS || "1000", 10);
let _slowQueryCount = 0;
let _totalQueryCount = 0;
function summariseSql(sql: unknown): string {
  if (typeof sql !== "string") {
    if (sql && typeof (sql as { text?: string }).text === "string") {
      return summariseSql((sql as { text: string }).text);
    }
    return "<non-string>";
  }
  // Single-line, collapsed whitespace, length-capped — never log full bodies.
  return sql.replace(/\s+/g, " ").trim().slice(0, 160);
}
// Wrap `pool.query` with a slow-query timer. The cast through `unknown` is
// intentional: pg's `Pool.query` ships nine overloads (callback + promise +
// typed Submittable variants) and there is no public generic that lets us
// re-emit them all from a single wrapper signature. The wrapper is a pure
// pass-through — same args in, same return value out — so callers continue to
// see the original overload-resolved types via `pool.query`. `wrapPoolQuery`
// is isolated so the casting surface lives in one place and is easy to audit.
function wrapPoolQuery(targetPool: Pool, slowMs: number): void {
  type AnyQueryFn = (...args: unknown[]) => unknown;
  const handle = targetPool as unknown as { query: AnyQueryFn };
  const orig: AnyQueryFn = handle.query.bind(targetPool) as AnyQueryFn;
  handle.query = (...args: unknown[]): unknown => {
    const start = Date.now();
    _totalQueryCount++;
    const result = orig(...args);
    if (result && typeof (result as { then?: unknown }).then === "function") {
      (result as Promise<unknown>).then(
        () => {
          const ms = Date.now() - start;
          if (ms >= slowMs) {
            _slowQueryCount++;
            logger.warn(`slow query ${ms}ms: ${summariseSql(args[0])}`, "db");
          }
        },
        () => { /* errors surface to the caller; do not double-log here */ },
      );
    }
    return result;
  };
}
wrapPoolQuery(pool, SLOW_QUERY_MS);

export function getPoolStats(): { total: number; idle: number; waiting: number; max: number; totalQueries: number; slowQueries: number } {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: (pool.options as { max?: number }).max ?? 0,
    totalQueries: _totalQueryCount,
    slowQueries: _slowQueryCount,
  };
}

export const db = drizzle(pool, { schema });

export async function closePool() {
  await pool.end();
}

/**
 * Defensive startup migration. The source of truth for the schema is
 * `./migrations/*.sql` (drizzle-kit). This function only applies idempotent
 * deltas that may not yet be present on a legacy production DB.
 * See `exentax-web/docs/data-model.md` §8 for the full migration flow.
 */
export async function runColumnMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    // FK constraints. Use NOT VALID so adding the constraint never fails on
    // legacy orphan rows; subsequent VALIDATE attempts to enforce on existing
    // data and is non-fatal if it can't (orphans are logged for cleanup).
    await ensureForeignKeyNotValid(client, {
      table: "newsletter_campaign_jobs",
      constraint: "newsletter_campaign_jobs_campaign_id_newsletter_campaigns_id_fk",
      definition: "FOREIGN KEY (campaign_id) REFERENCES newsletter_campaigns(id) ON DELETE CASCADE",
    });
    await ensureForeignKeyNotValid(client, {
      table: "newsletter_campaign_jobs",
      constraint: "newsletter_campaign_jobs_subscriber_id_newsletter_subscribers_id_fk",
      definition: "FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id) ON DELETE CASCADE",
    });
    await ensureForeignKeyNotValid(client, {
      table: "agenda_admin_actions",
      constraint: "agenda_admin_actions_booking_id_agenda_id_fk",
      definition: "FOREIGN KEY (booking_id) REFERENCES agenda(id) ON DELETE SET NULL",
    });

    // Partial indices for hot sweep paths.
    await client.query(`
      CREATE INDEX IF NOT EXISTS newsletter_subs_active_idx
        ON newsletter_subscribers (unsubscribed_at)
        WHERE unsubscribed_at IS NULL
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS booking_drafts_pending_sweep_idx
        ON booking_drafts (fecha_creacion)
        WHERE completed_at IS NULL AND reminder_sent_at IS NULL
    `);

    // Slot uniqueness — the only mechanism preventing double-booking. Recreate
    // defensively. Pre-cleanup cancels duplicate active rows (keeping the
    // oldest by id) so the unique index can always be created.
    const dupCleanup = await client.query(`
      WITH dups AS (
        SELECT id,
               row_number() OVER (
                 PARTITION BY fecha_reunion, hora_inicio
                 ORDER BY id
               ) AS rn
        FROM agenda
        WHERE estado IS NULL OR estado NOT IN ('cancelled','no_show')
      )
      UPDATE agenda
        SET estado = 'cancelled',
            cancelled_at = COALESCE(cancelled_at, to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
      WHERE id IN (SELECT id FROM dups WHERE rn > 1)
      RETURNING id, fecha_reunion, hora_inicio
    `);
    if (dupCleanup.rowCount && dupCleanup.rowCount > 0) {
      const ids = dupCleanup.rows.map((r: { id: string; fecha_reunion: string; hora_inicio: string }) => `${r.id}@${r.fecha_reunion} ${r.hora_inicio}`).join(", ");
      logger.warn(`[migration] Auto-cancelled ${dupCleanup.rowCount} duplicate active agenda row(s) before ensuring unique slot index: ${ids}`, "db");
    }
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS agenda_active_slot_uniq_idx
        ON agenda (fecha_reunion, hora_inicio)
        WHERE estado IS NULL OR estado NOT IN ('cancelled','no_show')
    `);

    // Discord outbound queue (shipped post-baseline). Idempotent so existing
    // production DBs auto-migrate at boot without operator intervention. The
    // canonical schema lives in `migrations/0001_discord_outbound_queue.sql`.
    await client.query(`
      CREATE TABLE IF NOT EXISTS discord_outbound_queue (
        id varchar(64) PRIMARY KEY NOT NULL,
        channel_id text NOT NULL,
        payload text NOT NULL,
        attempts integer DEFAULT 0 NOT NULL,
        max_attempts integer DEFAULT 3 NOT NULL,
        last_error text,
        next_attempt_at text NOT NULL,
        claimed_at text,
        fecha_creacion timestamp DEFAULT now()
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS discord_outbound_next_attempt_idx
        ON discord_outbound_queue (next_attempt_at)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS discord_outbound_created_at_idx
        ON discord_outbound_queue (fecha_creacion)
    `);

    // Drip-enrollment one-click unsubscribe token (Task #1, 2026-04-28).
    // The drip sender, the worker drain, and `routes/public.ts:GET|POST
    // /api/drip/unsubscribe/:token` all dereference this column at runtime.
    // Without this idempotent ALTER, a fresh DB (or any environment that
    // skipped the manual `drizzle-kit push`) would fail every drip insert
    // (`tryCreateDripEnrollment` writes the column) and every unsub click
    // would 404. Hex token, 64 chars; nullable so legacy rows that pre-date
    // the migration coexist (sender falls back to mailto). Partial index on
    // active tokens because the only lookup pattern is "find the still-
    // subscribed enrollment by token" in the unsubscribe handler.
    await client.query(`
      ALTER TABLE drip_enrollments
        ADD COLUMN IF NOT EXISTS unsubscribe_token varchar(64)
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS drip_enrollments_unsub_token_uniq_idx
        ON drip_enrollments (unsubscribe_token)
        WHERE unsubscribe_token IS NOT NULL
    `);

    // Task #28 (2026-04-30): partial UNIQUE on `leads(email)`. Belt-and-
    // braces against the duplicate-lead bug Task #18 fixed in application
    // code (see `upsertLeadOnBooking` in `server/storage/marketing.ts` and
    // the calculator handler in `server/routes/public.ts`). The
    // `withLeadEmailLock` wrapper already serialises concurrent writes for
    // the same email, but the lock store is process-local in dev and
    // Redis-backed in production — neither guarantees absolute global
    // mutual exclusion across a partitioned cluster. This DB-level
    // constraint makes a duplicate row physically impossible.
    //
    // Pre-cleanup merges any legacy duplicate rows (none expected on a
    // healthy production DB post Task #18, but defensive) so the unique
    // index can always be created. Strategy: keep the OLDEST row per email
    // (preserving the original `id` referenced by any
    // calculation/agenda/email logs by email but no FK chain — verified
    // 2026-04-30: no FK targets `leads.id`), OR-merge the boolean flags
    // and COALESCE the long-text fields from each duplicate into the
    // survivor so we never lose `usedCalculator=true` or
    // `scheduledCall=true` set on a younger row, then DELETE the rest.
    // The dedup runs in a single statement so it is atomic w.r.t. the
    // index creation that follows. Logged at WARN with the merged ids
    // so any production occurrence is visible in `#alertas`.
    const leadDup = await client.query(`
      WITH dups AS (
        SELECT id,
               email,
               row_number() OVER (
                 PARTITION BY email
                 ORDER BY fecha_creacion ASC NULLS LAST, id ASC
               ) AS rn
        FROM leads
        WHERE email IS NOT NULL AND email <> ''
      ),
      survivors AS (
        SELECT email, id AS keep_id FROM dups WHERE rn = 1
      ),
      merge AS (
        SELECT s.keep_id,
               bool_or(COALESCE(l.uso_calculadora, false))   AS uso_calculadora,
               bool_or(COALESCE(l.agendo_llamada, false))    AS agendo_llamada,
               bool_or(COALESCE(l.privacidad_aceptada, false)) AS privacidad_aceptada,
               bool_or(COALESCE(l.terminos_aceptados, false))  AS terminos_aceptados,
               bool_or(COALESCE(l.marketing_aceptado, false))  AS marketing_aceptado
        FROM survivors s
        JOIN leads l ON l.email = s.email
        GROUP BY s.keep_id
      ),
      merged AS (
        UPDATE leads l
          SET uso_calculadora      = m.uso_calculadora,
              agendo_llamada       = m.agendo_llamada,
              privacidad_aceptada  = m.privacidad_aceptada,
              terminos_aceptados   = m.terminos_aceptados,
              marketing_aceptado   = m.marketing_aceptado
          FROM merge m
          WHERE l.id = m.keep_id
            AND EXISTS (
              SELECT 1 FROM dups d WHERE d.email = l.email AND d.rn > 1
            )
          RETURNING l.id, l.email
      )
      DELETE FROM leads
        WHERE id IN (SELECT id FROM dups WHERE rn > 1)
        RETURNING id, email
    `);
    if (leadDup.rowCount && leadDup.rowCount > 0) {
      const ids = leadDup.rows.map((r: { id: string; email: string }) => `${r.id}@${r.email}`).join(", ");
      logger.warn(`[migration] Auto-merged ${leadDup.rowCount} duplicate lead row(s) before ensuring unique email index: ${ids}`, "db");
    }
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS leads_email_uniq_idx
        ON leads (email)
        WHERE email <> ''
    `);

    // A2 fix (Task #36, 2026-04-30) — exactly-once dispatch sentinel.
    // Updated post-SMTP-ACK in a write separate from `currentStep`, so a
    // transient `advanceDripEnrollment` failure after the email has already
    // gone out does NOT cause the worker to re-fire the same step on the
    // next 60s tick. See `shared/schema.ts` field docstring + worker
    // dispatch loop in `server/scheduled/drip-worker.ts`. Idempotent ALTER
    // so legacy rows default to `0` and the next worker pass treats them
    // as "no step sent yet at the sentinel layer" — same as a fresh row.
    await client.query(`
      ALTER TABLE drip_enrollments
        ADD COLUMN IF NOT EXISTS last_sent_step integer NOT NULL DEFAULT 0
    `);

    // Transactional outbox for drip emails (Task #38, 2026-04-30). The
    // canonical schema lives in `shared/schema.ts:emailOutbox` and a
    // drizzle-kit migration would land it on a fresh DB; this idempotent
    // CREATE TABLE makes legacy production DBs self-migrate at boot.
    // See the schema docstring for the lifecycle rationale (eliminates
    // residuals (a) SMTP-ACK→sentinel window, (b) lease overlap, and
    // bounds (c) sentinel + poison double-fail via the attempts cap).
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_outbox (
        id varchar(64) PRIMARY KEY NOT NULL,
        enrollment_id varchar(64) NOT NULL,
        step integer NOT NULL,
        payload text NOT NULL,
        claimed_at text,
        claim_version integer NOT NULL DEFAULT 0,
        attempts integer NOT NULL DEFAULT 0,
        max_attempts integer NOT NULL DEFAULT 8,
        sent_at text,
        last_error text,
        next_attempt_at text NOT NULL,
        fecha_creacion timestamp DEFAULT now(),
        CONSTRAINT email_outbox_step_check CHECK (step >= 1 AND step <= 6)
      )
    `);
    await ensureForeignKeyNotValid(client, {
      table: "email_outbox",
      constraint: "email_outbox_enrollment_id_drip_enrollments_id_fk",
      definition: "FOREIGN KEY (enrollment_id) REFERENCES drip_enrollments(id) ON DELETE CASCADE",
    });
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS email_outbox_enrollment_step_uniq
        ON email_outbox (enrollment_id, step)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS email_outbox_pending_idx
        ON email_outbox (next_attempt_at)
        WHERE sent_at IS NULL
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS email_outbox_enrollment_idx
        ON email_outbox (enrollment_id)
    `);

    logger.debug("Column migrations applied.", "db");
  } catch (err) {
    // Slot uniqueness is the only mechanism preventing double-booking, so
    // migration failures are fatal — silently degraded indexes would weaken
    // concurrency guarantees. FK additions above are non-fatal (NOT VALID).
    logger.error(`Column migration failed: ${err instanceof Error ? err.message : String(err)}`, "db");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Add a FK constraint as NOT VALID (skips checking existing rows so legacy
 * orphans don't block startup), then attempt VALIDATE in a separate step.
 * VALIDATE failures are logged at WARN — they signal orphan data that needs
 * a manual cleanup but don't prevent the server from booting.
 */
async function ensureForeignKeyNotValid(
  client: PoolClient,
  opts: { table: string; constraint: string; definition: string },
): Promise<void> {
  const { table, constraint, definition } = opts;
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${constraint}') THEN
        ALTER TABLE ${table}
          ADD CONSTRAINT ${constraint} ${definition} NOT VALID;
      END IF;
    END $$;
  `);
  try {
    await client.query(`ALTER TABLE ${table} VALIDATE CONSTRAINT ${constraint}`);
  } catch (err) {
    logger.warn(
      `[migration] FK ${constraint} on ${table} added but VALIDATE failed (legacy orphan rows present): ${
        err instanceof Error ? err.message : String(err)
      }. New writes are still enforced; clean up orphans and re-run VALIDATE manually.`,
      "db",
    );
  }
}

/**
 * Handle that accepts either the top-level `db` or a transaction object
 * passed by `withTransaction`. Encoded as a true union (`db | PgTransaction`)
 * — NOT `typeof db` — so the type system distinguishes a transaction handle
 * from the global pool. Without the union, a `tx` parameter would be typed
 * as a full `db` (because it was cast through `as unknown as DbOrTx` at the
 * `withTransaction` boundary), and Drizzle would happily accept calls like
 * `tx.transaction(...)` — which start a NEW outer transaction on a fresh
 * connection rather than a savepoint, silently splitting writes across
 * connections and breaking atomicity guarantees. With the union, attempting
 * to nest transactions through a `DbOrTx` handle no longer compiles.
 *
 * Generic parameters mirror the `drizzle-orm` types for `PgTransaction`:
 *   - `NodePgQueryResultHKT` — the result HKT for the node-postgres driver.
 *   - `typeof schema` — our app schema, used for type inference of `tx.<table>`.
 *   - `ExtractTablesWithRelations<typeof schema>` — relational query API
 *     surface (currently unused but required by the type for completeness).
 */
export type DbOrTx =
  | typeof db
  | PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export async function withTransaction<T>(fn: (tx: DbOrTx) => Promise<T>): Promise<T> {
  // The `tx` argument is a `PgTransaction<...>`, which is one of the union
  // members of `DbOrTx` — no cast needed.
  return db.transaction((tx) => fn(tx));
}
