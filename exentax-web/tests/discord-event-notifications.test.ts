/**
 * Unit tests for the remaining Discord notification events:
 *   - consent_logged   (notifyConsent)
 *   - seo_indexing     (notifySeoIndexing)
 *   - admin_action     (notifyAdminAction)
 *
 * Each event is asserted at three levels:
 *   1. Embed shape: title prefix (severity tag), correct event type tag in
 *      the header fields, and event-specific body fields.
 *   2. Channel routing: the outbound HTTP POST hits
 *      `https://discord.com/api/v10/channels/<id>/messages` with the channel
 *      id taken from the expected env var.
 *   3. Graceful degradation: when the channel's env var is unset (and any
 *      fallback for that channel is also unset), no fetch is performed and
 *      no exception is raised — calls are fire-and-forget.
 *
 * Tests run fully offline by stubbing `global.fetch` (same pattern as
 * `tests/discord-no-token-leak.test.ts`).
 *
 * Run: `tsx exentax-web/tests/discord-event-notifications.test.ts`
 */
process.env.NODE_ENV = "test";
process.env.DISCORD_BOT_TOKEN = "test-token";
// Force the in-memory queue backend so this test cannot race against any
// other test (or worker) that touches the shared Postgres
// `discord_outbound_queue` table. Under `npm run check` the runner spawns
// many child processes in parallel; if this test used the persistent
// backend, a sister test's drain worker could claim our enqueued payloads
// from Postgres and route them through ITS own fetch stub, leaving our
// `SENT[]` empty and turning every assertion into a confusing false
// failure (observed under `scripts/check.mjs` parallel runner). Setting
// this env var BEFORE the dynamic `import("../server/discord")` is
// load-bearing — see `server/discord.ts:607`.
process.env.DISCORD_QUEUE_BACKEND = "memory";
process.env.DISCORD_CHANNEL_CONSENTIMIENTOS = "1000000000000000001";
process.env.DISCORD_CHANNEL_ERRORES         = "1000000000000000002";
process.env.DISCORD_CHANNEL_AUDITORIA       = "1000000000000000003";
process.env.DISCORD_CHANNEL_REGISTROS       = "1000000000000000004";

interface Captured { url: string; body: string }
const SENT: Captured[] = [];

const originalFetch = global.fetch;
global.fetch = (async (input: any, init?: any) => {
  const url = typeof input === "string" ? input : (input?.url ?? String(input));
  const body = typeof init?.body === "string" ? init.body : "";
  SENT.push({ url, body });
  return new Response(JSON.stringify({ id: "fake_msg" }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}) as any;

const failures: string[] = [];
function assert(cond: unknown, msg: string) {
  if (!cond) failures.push(msg);
  else process.stdout.write(`  ok  ${msg}\n`);
}

// Drain interval inside discord.ts is 1.5s — wait a bit longer to guarantee
// every queued payload has been flushed before we inspect the captures.
async function flush(ms = 1800) { await new Promise(r => setTimeout(r, ms)); }

function findFor(channelId: string): Captured[] {
  return SENT.filter(s => s.url.includes(`/channels/${channelId}/messages`));
}

async function main() {
  const d: typeof import("../server/discord") = await import("../server/discord");

  // ───────────────────────── consent_logged ──────────────────────────────
  SENT.length = 0;
  d.notifyConsent({
    consentId: "con_unit_consent_001",
    formType: "booking",
    email: "consent@test.local",
    privacyAccepted: true,
    marketingAccepted: false,
    language: "es",
    privacyVersion: "1.0",
  });
  await flush();

  const consentSent = findFor("1000000000000000001");
  assert(consentSent.length > 0, "notifyConsent routes to DISCORD_CHANNEL_CONSENTIMIENTOS");
  {
    const blob = consentSent.map(s => s.body).join("\n");
    const parsed = JSON.parse(consentSent[0].body);
    const embed = parsed.embeds?.[0];
    assert(typeof embed?.title === "string" && embed.title.startsWith("[INFO]"),
      "notifyConsent embed title carries the [INFO] severity prefix");
    assert(Array.isArray(embed?.fields) && embed.fields.some((f: any) => f.name === "Type" && f.value === "consent_logged"),
      "notifyConsent embed declares Type=consent_logged in the header fields");
    assert(blob.includes("con_unit_consent_001"),
      "notifyConsent embed surfaces the consent id (con_*) in the payload");
    assert(blob.includes("Privacidad") && blob.includes("Marketing"),
      "notifyConsent embed exposes Privacidad and Marketing fields");
  }

  // Graceful degradation — channel unset
  SENT.length = 0;
  const savedConsent = process.env.DISCORD_CHANNEL_CONSENTIMIENTOS;
  delete process.env.DISCORD_CHANNEL_CONSENTIMIENTOS;
  let threw = false;
  try {
    d.notifyConsent({
      consentId: "con_unit_consent_002",
      formType: "booking",
      email: "consent2@test.local",
      privacyAccepted: true,
      marketingAccepted: false,
    });
  } catch { threw = true; }
  await flush();
  assert(!threw, "notifyConsent does not throw when DISCORD_CHANNEL_CONSENTIMIENTOS is unset");
  assert(SENT.length === 0, "notifyConsent emits no HTTP request when DISCORD_CHANNEL_CONSENTIMIENTOS is unset");
  process.env.DISCORD_CHANNEL_CONSENTIMIENTOS = savedConsent;

  // ───────────────────────── seo_indexing ────────────────────────────────
  SENT.length = 0;
  d.notifySeoIndexing({
    source: "indexnow",
    status: "ok",
    title: "IndexNow OK",
    summary: "Submitted 5 URLs to IndexNow.",
    fields: [
      { name: "URLs", value: "5", inline: true },
      { name: "Endpoint", value: "api.indexnow.org", inline: true },
    ],
    dedupKey: "seo_indexing:unit:001",
  });
  await flush();

  const seoSent = findFor("1000000000000000002");
  assert(seoSent.length > 0, "notifySeoIndexing routes to DISCORD_CHANNEL_ERRORES");
  {
    const parsed = JSON.parse(seoSent[0].body);
    const embed = parsed.embeds?.[0];
    assert(typeof embed?.title === "string" && embed.title.startsWith("[INFO]") && embed.title.includes("IndexNow OK"),
      "notifySeoIndexing embed title carries the [INFO] prefix and the caller-provided title");
    assert(embed.fields.some((f: any) => f.name === "Type" && f.value === "seo_indexing"),
      "notifySeoIndexing embed declares Type=seo_indexing in the header fields");
    assert(embed.fields.some((f: any) => f.name === "Estado" && f.value === "OK"),
      "notifySeoIndexing surfaces Estado=OK from the status argument");
    assert(embed.fields.some((f: any) => f.name === "URLs" && f.value === "5"),
      "notifySeoIndexing forwards caller-provided fields verbatim");
  }

  // Failed status — should map to [ERROR] severity prefix.
  SENT.length = 0;
  d.notifySeoIndexing({
    source: "indexnow",
    status: "failed",
    title: "IndexNow failed",
    summary: "HTTP 500.",
    dedupKey: "seo_indexing:unit:002",
  });
  await flush();
  {
    const seoFailSent = findFor("1000000000000000002");
    assert(seoFailSent.length > 0, "notifySeoIndexing(failed) is delivered to errores");
    const parsed = JSON.parse(seoFailSent[0].body);
    assert(parsed.embeds?.[0]?.title?.startsWith("[ERROR]"),
      "notifySeoIndexing(status=failed) carries the [ERROR] severity prefix");
  }

  // Graceful degradation — both DISCORD_CHANNEL_ERRORES and its
  // DISCORD_CHANNEL_REGISTROS fallback unset means nothing should be sent.
  SENT.length = 0;
  const savedErrores = process.env.DISCORD_CHANNEL_ERRORES;
  const savedRegistros = process.env.DISCORD_CHANNEL_REGISTROS;
  delete process.env.DISCORD_CHANNEL_ERRORES;
  delete process.env.DISCORD_CHANNEL_REGISTROS;
  threw = false;
  try {
    d.notifySeoIndexing({
      source: "indexnow",
      status: "ok",
      title: "IndexNow OK (no channel)",
      dedupKey: "seo_indexing:unit:003",
    });
  } catch { threw = true; }
  await flush();
  assert(!threw, "notifySeoIndexing does not throw when DISCORD_CHANNEL_ERRORES is unset");
  assert(SENT.length === 0,
    "notifySeoIndexing emits no HTTP request when both DISCORD_CHANNEL_ERRORES and DISCORD_CHANNEL_REGISTROS are unset");
  process.env.DISCORD_CHANNEL_ERRORES = savedErrores;
  process.env.DISCORD_CHANNEL_REGISTROS = savedRegistros;

  // ───────────────────────── admin_action ────────────────────────────────
  SENT.length = 0;
  d.notifyAdminAction({
    actor: { id: "987654321098765432", name: "operator-test" },
    action: "agenda:confirm",
    title: "Cita confirmada",
    description: "Operator confirmed booking bk_admin_001.",
    fields: [
      { name: "Booking ID", value: "`bk_admin_001`", inline: true },
      { name: "Cliente", value: "Ada Lovelace", inline: true },
    ],
  });
  await flush();

  const adminSent = findFor("1000000000000000003");
  assert(adminSent.length > 0, "notifyAdminAction routes to DISCORD_CHANNEL_AUDITORIA");
  {
    const parsed = JSON.parse(adminSent[0].body);
    const embed = parsed.embeds?.[0];
    assert(typeof embed?.title === "string" && embed.title.startsWith("[INFO]") && embed.title.includes("Cita confirmada"),
      "notifyAdminAction embed title carries the [INFO] prefix and the caller-provided title");
    assert(embed.fields.some((f: any) => f.name === "Type" && f.value === "admin_action"),
      "notifyAdminAction embed declares Type=admin_action in the header fields");
    assert(embed.fields.some((f: any) => f.name === "Origin" && f.value === "discord-bot"),
      "notifyAdminAction embed declares Origin=discord-bot");
    assert(embed.fields.some((f: any) => f.name === "Operador" && f.value.includes("operator-test") && f.value.includes("987654321098765432")),
      "notifyAdminAction surfaces the actor id and name in the Operador field");
    assert(embed.fields.some((f: any) => f.name === "Acción" && f.value.includes("agenda:confirm")),
      "notifyAdminAction surfaces the action verb in the Acción field");
    assert(embed.fields.some((f: any) => f.name === "Booking ID" && f.value.includes("bk_admin_001")),
      "notifyAdminAction forwards caller-provided fields verbatim");
  }

  // Graceful degradation — channel unset
  SENT.length = 0;
  const savedAuditoria = process.env.DISCORD_CHANNEL_AUDITORIA;
  delete process.env.DISCORD_CHANNEL_AUDITORIA;
  threw = false;
  try {
    d.notifyAdminAction({
      actor: { id: "1", name: "noop" },
      action: "agenda:noop",
      title: "Sin canal",
    });
  } catch { threw = true; }
  await flush();
  assert(!threw, "notifyAdminAction does not throw when DISCORD_CHANNEL_AUDITORIA is unset");
  assert(SENT.length === 0, "notifyAdminAction emits no HTTP request when DISCORD_CHANNEL_AUDITORIA is unset");
  process.env.DISCORD_CHANNEL_AUDITORIA = savedAuditoria;
}

main().then(() => {
  global.fetch = originalFetch;
  if (failures.length > 0) {
    console.error("\nFAILED ASSERTIONS:");
    for (const f of failures) console.error("  - " + f);
    process.exit(1);
  }
  console.log("\nAll Discord event notification tests passed.");
  process.exit(0);
}).catch((err) => {
  console.error("Test crashed:", err);
  process.exit(1);
});
