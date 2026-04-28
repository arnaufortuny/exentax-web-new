import { drizzle } from "drizzle-orm/node-postgres";
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

export type DbOrTx = typeof db;

export async function withTransaction<T>(fn: (tx: DbOrTx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    return fn(tx as unknown as DbOrTx);
  });
}
