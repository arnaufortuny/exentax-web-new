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
        ADD COLUMN IF NOT EXISTS cancelled_at text
    `);
    logger.debug("Column migrations applied.", "db");
  } catch (err) {
    logger.error(`Column migration failed: ${err instanceof Error ? err.message : String(err)}`, "db");
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
