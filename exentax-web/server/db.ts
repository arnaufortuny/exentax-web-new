import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
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

export const db = drizzle(pool, { schema });

export async function closePool() {
  await pool.end();
}

/**
 * Idempotent column migrations — runs at startup, safe to run multiple times.
 * Use ADD COLUMN IF NOT EXISTS to add new columns without breaking existing deployments.
 */
export async function runColumnMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE agenda
        ADD COLUMN IF NOT EXISTS reschedule_count integer DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_rescheduled_at text,
        ADD COLUMN IF NOT EXISTS cancelled_at text,
        ADD COLUMN IF NOT EXISTS meeting_type text DEFAULT 'google_meet'
    `);
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'agenda_meeting_type_check'
        ) THEN
          ALTER TABLE agenda ADD CONSTRAINT agenda_meeting_type_check
            CHECK (meeting_type IS NULL OR meeting_type IN ('google_meet','phone_call'));
        END IF;
      END $$;
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS seo_rankings (
        id serial PRIMARY KEY,
        snapshot_date text NOT NULL,
        slug text NOT NULL,
        lang text NOT NULL,
        keyword text NOT NULL,
        page_url text NOT NULL,
        impressions integer NOT NULL DEFAULT 0,
        clicks integer NOT NULL DEFAULT 0,
        ctr text NOT NULL DEFAULT '0',
        position text NOT NULL DEFAULT '0',
        has_data boolean NOT NULL DEFAULT false,
        created_at timestamp DEFAULT now()
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS seo_rankings_snapshot_idx ON seo_rankings(snapshot_date)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS seo_rankings_slug_lang_idx ON seo_rankings(slug, lang)
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS seo_rankings_snapshot_slug_lang_idx
        ON seo_rankings(snapshot_date, slug, lang)
    `);
    // Pre-clean: cancel duplicate active slots (keep oldest by id) before
    // creating the partial unique index, so the migration is safe even if
    // historical data accidentally contains overlapping bookings.
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
      logger.warn(`[migration] Auto-cancelled ${dupCleanup.rowCount} duplicate active agenda row(s) before creating unique slot index: ${ids}`, "db");
    }
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS agenda_active_slot_uniq_idx
        ON agenda (fecha_reunion, hora_inicio)
        WHERE estado IS NULL OR estado NOT IN ('cancelled','no_show')
    `);
    // Persistent email retry queue (drained by server/email-retry-queue.ts).
    // Buffers transactional emails (currently booking confirmations) that
    // could not be sent at event time so the worker can re-attempt them
    // with exponential backoff after Gmail config / transport issues clear.
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_retry_queue (
        id varchar(64) PRIMARY KEY,
        email_type text NOT NULL,
        payload text NOT NULL,
        attempts integer NOT NULL DEFAULT 0,
        max_attempts integer NOT NULL DEFAULT 6,
        last_error text,
        next_attempt_at text NOT NULL,
        fecha_creacion timestamp DEFAULT now()
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS email_retry_next_attempt_idx ON email_retry_queue(next_attempt_at)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS email_retry_type_idx ON email_retry_queue(email_type)
    `);
    // Per-row claim marker so multiple worker instances (horizontal scaling
    // or rolling deploys) cannot pick up the same job and emit duplicate
    // booking-confirmation emails. Drained atomically via FOR UPDATE SKIP
    // LOCKED in server/email-retry-queue.ts.
    await client.query(`
      ALTER TABLE email_retry_queue
        ADD COLUMN IF NOT EXISTS claimed_at text
    `);
    // Audit trail for the Discord agenda bot. Persists every action a
    // staff member triggers (slash command or button) so we keep history
    // even after Discord messages are deleted or channels purged.
    await client.query(`
      CREATE TABLE IF NOT EXISTS agenda_admin_actions (
        id varchar(64) PRIMARY KEY,
        booking_id varchar(64),
        actor_discord_id text NOT NULL,
        actor_discord_name text,
        action text NOT NULL,
        payload text,
        fecha_creacion timestamp DEFAULT now()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS agenda_admin_actions_booking_idx ON agenda_admin_actions(booking_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS agenda_admin_actions_actor_idx ON agenda_admin_actions(actor_discord_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS agenda_admin_actions_created_at_idx ON agenda_admin_actions(fecha_creacion)`);
    logger.debug("Column migrations applied.", "db");
  } catch (err) {
    // Migration failures must be fatal: silently degraded indexes (especially
    // agenda_active_slot_uniq_idx) would weaken our concurrency guarantees.
    logger.error(`Column migration failed: ${err instanceof Error ? err.message : String(err)}`, "db");
    throw err;
  } finally {
    client.release();
  }
}

export type DbOrTx = typeof db;

export async function withTransaction<T>(fn: (tx: DbOrTx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    return fn(tx as unknown as DbOrTx);
  });
}
