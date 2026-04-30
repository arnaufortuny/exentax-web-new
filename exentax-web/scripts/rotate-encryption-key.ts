#!/usr/bin/env tsx
/*
 * rotate-encryption-key.ts
 * ---------------------------------------------------------------------------
 * Re-encrypts every PII column protected by `server/field-encryption.ts`
 * (currently `leads.telefono` and `agenda.telefono`) from an OLD master key
 * to a NEW master key, in batches, inside transactions.
 *
 * Why this script exists
 * ----------------------
 * The `ef:` envelope used by `server/field-encryption.ts` carries the IV and
 * the GCM auth tag but no key id. Once the key in `FIELD_ENCRYPTION_KEY`
 * changes, every existing ciphertext becomes unreadable until the rows are
 * re-encrypted under the new key. Until this script existed the procedure
 * was a manual SQL/console session — error-prone, easy to corrupt rows.
 * See `docs/data-model.md` §5.
 *
 * What it does
 * ------------
 *   For each (table, column) in TARGETS:
 *     1. Iterate primary keys ascending in batches of --batch-size.
 *     2. For each row whose value starts with the `ef:` envelope:
 *        a. Try decrypt with NEW_KEY → succeeded means already rotated, skip.
 *        b. Else try decrypt with OLD_KEY → re-encrypt with NEW_KEY → UPDATE.
 *        c. Else neither key works → record as an error row, continue.
 *     3. Each batch's UPDATE statements run inside a single transaction; on
 *        error the batch rolls back and the script exits non-zero.
 *
 * Idempotency
 * -----------
 * Step 2(a) makes re-running safe: rows already migrated decrypt cleanly with
 * NEW_KEY and are skipped. So a partial run that crashed halfway can be
 * resumed simply by invoking the script again with the same OLD_KEY/NEW_KEY.
 * Plaintext (legacy, never-encrypted) rows are also skipped — they don't
 * carry the `ef:` prefix.
 *
 * Operational guarantees
 * ----------------------
 *  - Read-only on `--dry-run` (the default if no flag is passed). Reports
 *    counts and surfaces unreadable rows but writes nothing.
 *  - Writes only when `--apply` is passed.
 *  - Refuses to start if OLD_KEY === NEW_KEY (no-op rotation that would also
 *    hide bugs in the comparison logic).
 *  - Refuses to start if either key is not exactly 64 hex chars (= 32 bytes).
 *  - Logs row IDs that fail to decrypt under either key — these are the
 *    only rows the operator must investigate manually after a rotation.
 *
 * Usage
 * -----
 *   # dry-run (no writes), counts what would rotate
 *   OLD_KEY=<64-hex> NEW_KEY=<64-hex> tsx exentax-web/scripts/rotate-encryption-key.ts
 *
 *   # actually rotate, in batches of 100
 *   OLD_KEY=<64-hex> NEW_KEY=<64-hex> tsx exentax-web/scripts/rotate-encryption-key.ts --apply
 *
 *   # bigger batches (defaults to 100)
 *   OLD_KEY=<64-hex> NEW_KEY=<64-hex> tsx exentax-web/scripts/rotate-encryption-key.ts --apply --batch-size=500
 *
 * After it finishes successfully, swap `FIELD_ENCRYPTION_KEY` in the
 * environment to NEW_KEY and restart the app. The runtime decrypt path
 * (`server/field-encryption.ts`) will then read the rotated rows
 * transparently.
 * ---------------------------------------------------------------------------
 */
import { db, closePool } from "../server/db";
import { sql } from "drizzle-orm";
import {
  encryptFieldWithKey,
  tryDecryptFieldWithKey,
  isFieldEncryptionEnvelope,
} from "../server/field-encryption";

interface Target {
  /** Display name only — uses Drizzle table name. */
  table: string;
  /** PostgreSQL column name (snake_case as on disk). */
  column: string;
  /** Primary-key column name. */
  pk: string;
}

// Currently encrypted PII columns. Keep in sync with `LEAD_SENSITIVE` /
// `AGENDA_SENSITIVE` in `server/storage/marketing.ts` and
// `server/storage/scheduling.ts`. If you add a new encrypted column there,
// add it here too — the rotation script will not discover it automatically.
const TARGETS: readonly Target[] = [
  { table: "leads", column: "telefono", pk: "id" },
  { table: "agenda", column: "telefono", pk: "id" },
];

interface CliArgs {
  apply: boolean;
  batchSize: number;
}

function parseArgs(argv: readonly string[]): CliArgs {
  let apply = false;
  let batchSize = 100;
  for (const raw of argv) {
    if (raw === "--apply") apply = true;
    else if (raw === "--dry-run") apply = false;
    else if (raw.startsWith("--batch-size=")) {
      const n = parseInt(raw.slice("--batch-size=".length), 10);
      if (!Number.isFinite(n) || n <= 0) {
        throw new Error(`invalid --batch-size: ${raw}`);
      }
      batchSize = n;
    } else if (raw === "--help" || raw === "-h") {
      console.log("Usage: tsx scripts/rotate-encryption-key.ts [--apply] [--batch-size=N]");
      console.log("Env:   OLD_KEY=<64 hex> NEW_KEY=<64 hex>");
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${raw}`);
    }
  }
  return { apply, batchSize };
}

function loadKey(name: "OLD_KEY" | "NEW_KEY"): Buffer {
  const raw = process.env[name];
  if (!raw) throw new Error(`${name} env var is required (64 hex chars = 32 bytes)`);
  if (!/^[0-9a-fA-F]{64}$/.test(raw)) {
    throw new Error(`${name} must be exactly 64 hex chars (got length=${raw.length})`);
  }
  return Buffer.from(raw, "hex");
}

interface BatchStats {
  scanned: number;
  skippedAlreadyRotated: number;
  rotated: number;
  /**
   * Rows we could not handle. `reason` distinguishes:
   *   - "wrong-key": envelope is structurally valid but neither OLD_KEY nor
   *     NEW_KEY opens it (key was generated outside this rotation pair, or
   *     ciphertext was tampered with).
   *   - "malformed": value started with the `ef:` prefix but the parts that
   *     follow are not a valid IV/tag/ciphertext triple (data corruption
   *     somewhere upstream — never written by `encryptField`).
   * Both surface the same way to the operator; both keep the script's exit
   * code at 2 so they cannot be missed.
   */
  unreadable: { id: string; table: string; reason: "wrong-key" | "malformed" }[];
}

function emptyStats(): BatchStats {
  return { scanned: 0, skippedAlreadyRotated: 0, rotated: 0, unreadable: [] };
}

/**
 * Rotate a single (table, column). Iterates by ascending PK in batches.
 * Each batch runs inside a transaction so partial network failure cannot
 * leave a half-updated batch behind. On any decryption failure or DB error
 * the transaction rolls back and the function throws.
 */
async function rotateColumn(
  target: Target,
  oldKey: Buffer,
  newKey: Buffer,
  apply: boolean,
  batchSize: number,
): Promise<BatchStats> {
  const stats = emptyStats();
  let cursor: string | null = null;

  // Identifier interpolation is safe because TARGETS is a hard-coded
  // allow-list — no user input ever reaches here. Drizzle's sql.identifier
  // would be cleaner but the CLI surface is internal.
  const table = sql.identifier(target.table);
  const column = sql.identifier(target.column);
  const pk = sql.identifier(target.pk);

  for (;;) {
    // Pull the next page. We only fetch rows whose value starts with the
    // envelope prefix so plaintext rows never enter the batch — that keeps
    // the transaction footprint small and the UPDATE list tight.
    const result = await db.execute(
      cursor === null
        ? sql`SELECT ${pk} AS id, ${column} AS value FROM ${table}
              WHERE ${column} LIKE 'ef:%'
              ORDER BY ${pk} ASC
              LIMIT ${batchSize}`
        : sql`SELECT ${pk} AS id, ${column} AS value FROM ${table}
              WHERE ${column} LIKE 'ef:%' AND ${pk} > ${cursor}
              ORDER BY ${pk} ASC
              LIMIT ${batchSize}`,
    );
    const batch = result.rows as { id: string; value: string }[];
    if (batch.length === 0) break;

    // Compute the new ciphertext for every row that needs it BEFORE opening
    // the transaction. This minimises the window in which row-level locks
    // are held, and lets us decide up front whether the batch has any work.
    const updates: { id: string; next: string }[] = [];
    for (const row of batch) {
      stats.scanned++;
      const value = row.value;
      if (!isFieldEncryptionEnvelope(value)) {
        // The SQL LIKE filter selected `ef:%` rows, so reaching this branch
        // means the prefix is there but the IV/tag/ciphertext triple is
        // malformed (data corruption). Treat as orphaned ciphertext rather
        // than silently skipping — silent skipping would hide corruption
        // from the operator's exit-code-2 report.
        stats.unreadable.push({ id: row.id, table: target.table, reason: "malformed" });
        continue;
      }
      // Idempotency: rows already encrypted under NEW_KEY decrypt cleanly
      // and need no work. This is what makes the script safe to re-run.
      if (tryDecryptFieldWithKey(newKey, value) !== null) {
        stats.skippedAlreadyRotated++;
        continue;
      }
      const plaintext = tryDecryptFieldWithKey(oldKey, value);
      if (plaintext === null) {
        // Neither key opens the envelope — surface and continue. We do NOT
        // throw here because one bad row would otherwise block rotation
        // for the entire table; the operator gets the full list at the end.
        stats.unreadable.push({ id: row.id, table: target.table, reason: "wrong-key" });
        continue;
      }
      updates.push({ id: row.id, next: encryptFieldWithKey(newKey, plaintext) });
    }

    if (apply && updates.length > 0) {
      await db.transaction(async (tx) => {
        for (const u of updates) {
          await tx.execute(sql`UPDATE ${table} SET ${column} = ${u.next} WHERE ${pk} = ${u.id}`);
        }
      });
    }
    stats.rotated += updates.length;

    // Advance cursor by the largest PK we observed. Even rows we skipped
    // (already-rotated, unreadable) must move the cursor forward, otherwise
    // the next page would re-read the same set forever.
    cursor = batch[batch.length - 1].id;

    // If the page came back smaller than batchSize we're done. Avoids an
    // extra empty SELECT at the end.
    if (batch.length < batchSize) break;
  }

  return stats;
}

function formatStats(target: Target, stats: BatchStats): string {
  const malformed = stats.unreadable.filter(u => u.reason === "malformed").length;
  const wrongKey = stats.unreadable.filter(u => u.reason === "wrong-key").length;
  const lines = [
    `[${target.table}.${target.column}]`,
    `  scanned:              ${stats.scanned}`,
    `  skipped (already new):${stats.skippedAlreadyRotated}`,
    `  rotated:              ${stats.rotated}`,
    `  unreadable:           ${stats.unreadable.length} (wrong-key=${wrongKey}, malformed=${malformed})`,
  ];
  if (stats.unreadable.length > 0) {
    lines.push("  unreadable IDs:");
    for (const u of stats.unreadable.slice(0, 20)) {
      lines.push(`    - ${u.id} (${u.reason})`);
    }
    if (stats.unreadable.length > 20) {
      lines.push(`    … and ${stats.unreadable.length - 20} more`);
    }
  }
  return lines.join("\n");
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  const oldKey = loadKey("OLD_KEY");
  const newKey = loadKey("NEW_KEY");
  if (oldKey.equals(newKey)) {
    throw new Error("OLD_KEY and NEW_KEY are identical — nothing to rotate. Refusing.");
  }

  const mode = args.apply ? "APPLY" : "dry-run";
  console.log(`[rotate-encryption-key] mode=${mode} batchSize=${args.batchSize}`);
  console.log(`[rotate-encryption-key] targets: ${TARGETS.map(t => `${t.table}.${t.column}`).join(", ")}\n`);

  let totalUnreadable = 0;
  let totalRotated = 0;
  for (const target of TARGETS) {
    const stats = await rotateColumn(target, oldKey, newKey, args.apply, args.batchSize);
    console.log(formatStats(target, stats));
    console.log("");
    totalUnreadable += stats.unreadable.length;
    totalRotated += stats.rotated;
  }

  if (!args.apply) {
    console.log(`(dry-run) Would rotate ${totalRotated} row(s). Re-run with --apply to write.`);
  } else {
    console.log(`Rotated ${totalRotated} row(s) across ${TARGETS.length} target column(s).`);
    console.log("Next step: set FIELD_ENCRYPTION_KEY=$NEW_KEY in the environment and restart the app.");
  }

  if (totalUnreadable > 0) {
    console.error(`\nWARNING: ${totalUnreadable} row(s) could not be decrypted with either key.`);
    console.error("These rows are now orphaned ciphertext — investigate manually before retiring OLD_KEY.");
    return 2;
  }
  return 0;
}

main()
  .then(async (code) => {
    await closePool();
    process.exit(code);
  })
  .catch(async (err) => {
    console.error("[rotate-encryption-key] FATAL:", err instanceof Error ? err.message : err);
    await closePool().catch(() => {});
    process.exit(1);
  });
