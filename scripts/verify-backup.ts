#!/usr/bin/env tsx
/**
 * Backup verification utility.
 *
 * The platform is responsible for snapshotting the managed Postgres
 * instance (point-in-time recovery is provided by the database vendor).
 * This script complements that with end-to-end checks an operator can
 * run on demand or from a scheduled job:
 *
 *   1. Live database sanity (PITR has something current to roll forward
 *      against): connectivity, required tables present, the
 *      `agenda_active_slot_uniq_idx` invariant, and a non-empty workload
 *      (a backup that restores zero rows almost always means the wrong
 *      instance was snapshotted).
 *
 *   2. (Optional) Real restore verification — pipes a `pg_dump` artifact
 *      into a freshly-created throwaway database, re-runs the schema
 *      invariants against it, and unconditionally drops the database
 *      afterwards. This is the only way to catch corrupt or partial
 *      dumps before an actual incident. Requires `pg_restore` (or `psql`
 *      for plain SQL dumps) and `createdb`/`dropdb` on PATH; if any of
 *      them are missing the check is skipped with a clear message.
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed (error printed to stderr)
 *   2 — usage / configuration error
 *
 * Usage:
 *   DATABASE_URL=postgres://… tsx scripts/verify-backup.ts
 *   DATABASE_URL=postgres://… tsx scripts/verify-backup.ts --dump=/tmp/dump.sql
 *   DATABASE_URL=postgres://… tsx scripts/verify-backup.ts --dump=/tmp/dump.dump --restore
 */
import { Client } from "pg";
import { spawn } from "child_process";
import { existsSync, statSync } from "fs";
import { randomBytes } from "crypto";

interface Check { name: string; ok: boolean; detail?: string }

const REQUIRED_TABLES = [
  "agenda",
  "leads",
  "calculations",
  "visits",
  "newsletter_subscribers",
  "blocked_days",
  "legal_document_versions",
  "consent_log",
  "email_retry_queue",
  "seo_rankings",
];

function runCmd(cmd: string, args: string[], opts: { env?: NodeJS.ProcessEnv; stdinFile?: string } = {}): Promise<{ code: number; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { env: { ...process.env, ...(opts.env ?? {}) }, stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("error", (err) => resolve({ code: 127, stderr: String(err) }));
    child.on("close", (code) => resolve({ code: code ?? 1, stderr }));
  });
}

function hasBinary(name: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(process.platform === "win32" ? "where" : "which", [name], { stdio: "ignore" });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

async function liveChecks(client: Client): Promise<Check[]> {
  const checks: Check[] = [];
  const version = await client.query<{ version: string }>("SELECT version()");
  checks.push({ name: "connect", ok: true, detail: version.rows[0]?.version.split(" ")[0] });

  const tableRes = await client.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
  );
  const present = new Set(tableRes.rows.map(r => r.table_name));
  const missing = REQUIRED_TABLES.filter(t => !present.has(t));
  checks.push({
    name: "tables",
    ok: missing.length === 0,
    detail: missing.length === 0 ? `${REQUIRED_TABLES.length}/${REQUIRED_TABLES.length} present` : `missing: ${missing.join(", ")}`,
  });

  const idxRes = await client.query<{ indexname: string }>(
    `SELECT indexname FROM pg_indexes WHERE tablename = 'agenda' AND indexname = 'agenda_active_slot_uniq_idx'`,
  );
  checks.push({
    name: "agenda-unique-slot-index",
    ok: idxRes.rowCount === 1,
    detail: idxRes.rowCount === 1 ? "ok" : "missing — concurrency guarantee weakened",
  });

  const counts = await client.query<{ leads: string; visits: string; agenda: string }>(
    `SELECT
       (SELECT count(*) FROM leads)  AS leads,
       (SELECT count(*) FROM visits) AS visits,
       (SELECT count(*) FROM agenda) AS agenda`,
  );
  const row = counts.rows[0];
  const total = Number(row?.leads ?? 0) + Number(row?.visits ?? 0) + Number(row?.agenda ?? 0);
  checks.push({
    name: "workload-sanity",
    ok: total > 0,
    detail: `leads=${row?.leads} visits=${row?.visits} agenda=${row?.agenda}`,
  });

  const recent = await client.query<{ recent: string }>(
    `SELECT count(*)::text AS recent FROM visits WHERE fecha_creacion > now() - interval '30 days'`,
  );
  checks.push({
    name: "recent-activity-30d",
    ok: true,
    detail: `${recent.rows[0]?.recent ?? "0"} visits in last 30 days`,
  });
  return checks;
}

/**
 * Restore the dump into a throwaway database and re-run the schema
 * invariants. Always drops the database in `finally`, even on early
 * failure, so repeated runs never leak databases on the server.
 */
async function restoreCheck(adminUrl: URL, dumpPath: string): Promise<Check[]> {
  const checks: Check[] = [];
  if (!existsSync(dumpPath)) {
    checks.push({ name: "dump-file", ok: false, detail: `not found: ${dumpPath}` });
    return checks;
  }
  const size = statSync(dumpPath).size;
  checks.push({ name: "dump-file", ok: size > 0, detail: `${size} bytes` });
  if (size === 0) return checks;

  const isCustomFormat = dumpPath.endsWith(".dump") || dumpPath.endsWith(".pgdump") || dumpPath.endsWith(".tar");
  const restoreBin = isCustomFormat ? "pg_restore" : "psql";
  const required = ["createdb", "dropdb", restoreBin];
  for (const bin of required) {
    if (!(await hasBinary(bin))) {
      checks.push({ name: `tool-${bin}`, ok: false, detail: "not on PATH — restore verification skipped" });
      return checks;
    }
  }

  // Build env for libpq tools without leaking secrets to argv.
  const env: NodeJS.ProcessEnv = {
    PGHOST: adminUrl.hostname,
    PGPORT: adminUrl.port || "5432",
    PGUSER: decodeURIComponent(adminUrl.username),
    PGPASSWORD: decodeURIComponent(adminUrl.password),
  };
  const sslMode = adminUrl.searchParams.get("sslmode");
  if (sslMode) env.PGSSLMODE = sslMode;

  const tempDb = `verify_${randomBytes(6).toString("hex")}`;
  let created = false;
  try {
    const create = await runCmd("createdb", [tempDb], { env });
    if (create.code !== 0) {
      checks.push({ name: "restore-createdb", ok: false, detail: create.stderr.trim().slice(0, 300) || `exit ${create.code}` });
      return checks;
    }
    created = true;

    const restoreArgs = isCustomFormat
      ? ["--dbname", tempDb, "--no-owner", "--no-privileges", "--exit-on-error", dumpPath]
      : ["--dbname", tempDb, "--single-transaction", "--set", "ON_ERROR_STOP=on", "--file", dumpPath];
    const restore = await runCmd(restoreBin, restoreArgs, { env });
    checks.push({
      name: "restore",
      ok: restore.code === 0,
      detail: restore.code === 0 ? `${restoreBin} ok` : `${restoreBin} exit ${restore.code}: ${restore.stderr.trim().slice(0, 300)}`,
    });
    if (restore.code !== 0) return checks;

    // Re-run schema invariants against the restored DB so we catch
    // dumps that loaded but are missing critical objects (e.g. partial
    // pg_dump filtered by table list).
    const verifyUrl = new URL(adminUrl.toString());
    verifyUrl.pathname = `/${tempDb}`;
    const verifyClient = new Client({ connectionString: verifyUrl.toString(), statement_timeout: 10_000 });
    await verifyClient.connect();
    try {
      const tableRes = await verifyClient.query<{ table_name: string }>(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      );
      const present = new Set(tableRes.rows.map(r => r.table_name));
      const missing = REQUIRED_TABLES.filter(t => !present.has(t));
      checks.push({
        name: "restore-tables",
        ok: missing.length === 0,
        detail: missing.length === 0 ? `${REQUIRED_TABLES.length}/${REQUIRED_TABLES.length} present` : `missing: ${missing.join(", ")}`,
      });
      const idxRes = await verifyClient.query(
        `SELECT 1 FROM pg_indexes WHERE tablename = 'agenda' AND indexname = 'agenda_active_slot_uniq_idx'`,
      );
      checks.push({
        name: "restore-agenda-index",
        ok: idxRes.rowCount === 1,
        detail: idxRes.rowCount === 1 ? "ok" : "missing in restored DB",
      });
    } finally {
      await verifyClient.end();
    }
  } finally {
    if (created) {
      const drop = await runCmd("dropdb", ["--if-exists", tempDb], { env });
      if (drop.code !== 0) {
        checks.push({ name: "restore-cleanup", ok: false, detail: `dropdb failed: ${drop.stderr.trim().slice(0, 200)}` });
      }
    }
  }
  return checks;
}

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("verify-backup: DATABASE_URL must be set");
    process.exit(2);
  }
  const dumpArg = process.argv.find(a => a.startsWith("--dump="));
  const dumpPath = dumpArg ? dumpArg.slice("--dump=".length) : null;

  const checks: Check[] = [];
  const client = new Client({ connectionString: dbUrl, statement_timeout: 10_000 });
  await client.connect();
  try {
    checks.push(...await liveChecks(client));
  } finally {
    await client.end();
  }

  if (dumpPath) {
    // Use the same admin host but an admin database (`postgres`) so
    // createdb/dropdb don't require touching the live application DB.
    const adminUrl = new URL(dbUrl);
    adminUrl.pathname = "/postgres";
    try {
      checks.push(...await restoreCheck(adminUrl, dumpPath));
    } catch (err) {
      checks.push({ name: "restore", ok: false, detail: err instanceof Error ? err.message : String(err) });
    }
  }

  let failed = 0;
  for (const c of checks) {
    const tag = c.ok ? "OK   " : "FAIL ";
    console.log(`[${tag}] ${c.name.padEnd(28)} ${c.detail ?? ""}`);
    if (!c.ok) failed++;
  }
  if (failed > 0) {
    console.error(`verify-backup: ${failed} check(s) failed`);
    process.exit(1);
  }
  console.log(`verify-backup: all ${checks.length} checks passed`);
}

main().catch((err) => {
  console.error("verify-backup: fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
