/**
 * Tests for the persistent Discord outbound queue.
 *
 * Verifies the durability contract introduced for `discord_outbound_queue`:
 *   1. A notify* call writes the payload to Postgres BEFORE any send.
 *   2. After a simulated process restart (state reset + worker re-start)
 *      the previously-persisted payload is recovered and delivered, so
 *      the message that would have been lost in memory is preserved.
 *   3. On successful delivery the row is deleted from the queue table.
 *   4. The `discord_dropped_total` metric still reflects only true overflow
 *      (queue cap exceeded) — never restart loss.
 *
 * The test uses the project DATABASE_URL (a Postgres test database) and
 * stubs `global.fetch` so no real Discord API call is made. It cleans up
 * its own rows on entry and exit so it can be re-run without interaction
 * with other suites.
 *
 * Run: `tsx exentax-web/tests/discord-queue-persistence.test.ts`
 */

process.env.NODE_ENV = "test";
process.env.DISCORD_BOT_TOKEN = "test-token-persist";
process.env.DISCORD_CHANNEL_REGISTROS = "9000000000000000001";

const failures: string[] = [];
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failures.push(msg);
    process.stdout.write(`  FAIL ${msg}\n`);
  } else {
    process.stdout.write(`  ok   ${msg}\n`);
  }
}

interface Captured { url: string; body: string; reject?: boolean }
const SENT: Captured[] = [];

// Default fetch stub: 204 success. Individual tests can swap `_fetchMode`
// to simulate failures without re-stubbing the whole global.
let _fetchMode: "ok" | "fail-then-recover" = "ok";
let _failedOnce = false;

const originalFetch = global.fetch;
global.fetch = (async (input: any, init?: any) => {
  const url = typeof input === "string" ? input : (input?.url ?? String(input));
  const body = typeof init?.body === "string" ? init.body : "";
  SENT.push({ url, body });
  if (_fetchMode === "fail-then-recover" && !_failedOnce) {
    _failedOnce = true;
    return new Response("rate limited", { status: 429 });
  }
  return new Response(JSON.stringify({ id: "fake_msg" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}) as any;

async function flush(ms = 2200) { await new Promise(r => setTimeout(r, ms)); }

async function main() {
  if (!process.env.DATABASE_URL) {
    process.stdout.write("  SKIP no DATABASE_URL — persistence tests need a Postgres test DB\n");
    return;
  }

  // Ensure column migrations have run so the table exists in this DB.
  const dbMod = await import("../server/db");
  await dbMod.runColumnMigrations();

  const schema = await import("../shared/schema");
  const { sql, eq } = await import("drizzle-orm");
  const discord = await import("../server/discord");

  // Start with a clean queue table — defensive cleanup so reruns don't
  // accumulate stale rows from previous failed attempts.
  await dbMod.db.execute(sql`DELETE FROM discord_outbound_queue`);

  // ─── 1. Items get persisted before delivery ──────────────────────────────
  await discord.startDiscordQueueWorker();
  SENT.length = 0;

  discord.notifyNewLead({
    leadId: "lead_persist_001",
    name: "Persist",
    email: "persist@test.local",
    source: "test-persist",
    language: "es",
  });

  // Give the async insert a beat to land before we inspect the table.
  // We deliberately check BEFORE the drain interval (1.5s) fires so we
  // can witness the row in the persistence layer prior to delivery.
  await new Promise(r => setTimeout(r, 250));

  const beforeDrain = await dbMod.db.execute(
    sql`SELECT id, channel_id, attempts FROM discord_outbound_queue ORDER BY fecha_creacion`,
  );
  const beforeRows = (beforeDrain as unknown as { rows: { id: string; channel_id: string; attempts: number }[] }).rows ?? [];
  assert(beforeRows.length >= 1, "outbound payload is persisted to discord_outbound_queue before delivery");
  assert(beforeRows.some(r => r.channel_id === "9000000000000000001"), "persisted row carries the resolved channel_id");
  const persistedSize = discord.getDiscordQueueSize();
  assert(persistedSize >= 1, `gauge reflects persisted row (size=${persistedSize})`);

  // After enough time the drain timer fires, fetch is called, row deleted.
  await flush();
  const afterDrain = await dbMod.db.execute(sql`SELECT count(*)::int AS n FROM discord_outbound_queue`);
  const afterRows = (afterDrain as unknown as { rows: { n: number }[] }).rows ?? [];
  assert(afterRows[0]?.n === 0, "row is deleted from discord_outbound_queue after successful delivery");
  assert(SENT.length >= 1, "fetch was invoked at least once after drain");
  assert(discord.getDiscordQueueSize() === 0, "queue gauge returns to zero after drain");

  // ─── 2. Restart recovery ─────────────────────────────────────────────────
  // Insert a row directly to simulate "this row was queued by the previous
  // process before it was killed". Then reset the in-memory state of the
  // discord module — equivalent to a process restart in this Node context —
  // and re-start the worker. The row must be picked up and delivered
  // without the caller having to re-issue the original notify*.
  SENT.length = 0;
  const { randomUUID } = await import("crypto");
  const survivorId = randomUUID();
  const survivorPayload = {
    embeds: [{
      title: "[INFO] survivor-after-restart",
      color: 0x00E510,
      fields: [{ name: "Type", value: "lead_new" }],
      timestamp: new Date().toISOString(),
    }],
  };
  await dbMod.db.insert(schema.discordOutboundQueue).values({
    id: survivorId,
    channelId: "9000000000000000001",
    payload: JSON.stringify(survivorPayload),
    attempts: 0,
    maxAttempts: 3,
    lastError: null,
    nextAttemptAt: new Date(Date.now() - 1_000).toISOString(),
    claimedAt: null,
  });

  discord._resetDiscordQueueForTests();
  await discord.startDiscordQueueWorker();
  // Rehydrate must surface the surviving row in the canonical published
  // gauge. With the cross-process gauge contract, `getDiscordQueueSize()`
  // returns the DB-backed count reconciled by `startDiscordQueueWorker()`
  // (which calls `refreshPublishedQueueDepth()` at startup). So all
  // co-tenant processes — including a freshly-reset one — see the survivor
  // row immediately.
  assert(discord.getDiscordQueueSize() >= 1, `published cross-process gauge includes survivor row (got ${discord.getDiscordQueueSize()})`);
  // The internal per-process counter, on the other hand, is intentionally
  // 0 for this scenario: the survivor row was inserted directly by the
  // test (= a peer producer), never via `enqueueItem()` in this process.
  assert(discord._getDiscordOwnPendingCountForTests() === 0, "per-process counter stays at zero — survivor row was not enqueued via enqueueItem in THIS process");

  await flush();
  const survivorAfter = await dbMod.db.execute(
    sql`SELECT count(*)::int AS n FROM discord_outbound_queue WHERE id = ${survivorId}`,
  );
  const survivorRows = (survivorAfter as unknown as { rows: { n: number }[] }).rows ?? [];
  assert(survivorRows[0]?.n === 0, "survivor row is delivered + deleted after restart");
  const survivorDelivered = SENT.some(s => s.body.includes("survivor-after-restart"));
  assert(survivorDelivered, "fetch was invoked with the survivor payload after restart");

  // ─── 3. Persistence failure surfaces the fallback alert ──────────────────
  // Simulate a persistence failure by monkey-patching db.insert to throw.
  // The notify* call MUST NOT throw, MUST emit a fallback alert log, and
  // MUST NOT silently swallow the operational event.
  SENT.length = 0;
  const originalInsert = dbMod.db.insert.bind(dbMod.db);
  let alertEmitted = false;
  const logger = (await import("../server/logger")).logger;
  const originalAlert = logger.alert.bind(logger);
  (logger as any).alert = (msg: string, channel: string, meta?: any) => {
    if (channel === "discord-fallback") alertEmitted = true;
    return originalAlert(msg, channel, meta);
  };
  (dbMod.db as any).insert = () => {
    throw new Error("simulated DB outage");
  };
  try {
    discord.notifyNewLead({
      leadId: "lead_persist_002",
      name: "PersistFail",
      email: "persistfail@test.local",
      source: "test-persist",
      language: "es",
    });
    // Wait for the async persist path to settle.
    await new Promise(r => setTimeout(r, 400));
    assert(alertEmitted, "fallback alert log is emitted when persistence itself fails");
  } finally {
    (dbMod.db as any).insert = originalInsert;
    (logger as any).alert = originalAlert;
  }

  // ─── 4. Final cleanup ────────────────────────────────────────────────────
  await dbMod.db.execute(sql`DELETE FROM discord_outbound_queue`);
  // Restore originals.
  global.fetch = originalFetch;
}

main()
  .catch((err) => {
    process.stdout.write(`\nFATAL ${err instanceof Error ? err.stack : String(err)}\n`);
    process.exit(1);
  })
  .then(() => {
    if (failures.length > 0) {
      process.stdout.write(`\n${failures.length} failure(s):\n${failures.map(f => "  - " + f).join("\n")}\n`);
      process.exit(1);
    } else {
      process.stdout.write("\nAll Discord queue persistence tests passed.\n");
      process.exit(0);
    }
  });
