/**
 * Regression test: every booking notification posted to #agenda is sent
 * via the bot REST API (`POST /channels/{id}/messages` with
 * `Authorization: Bot <token>`) AND carries the standard 2-row, 5-component
 * action set (Confirmar / Reprogramar / Cancelar / No-show + email select).
 *
 * Discord only renders `components` when the message is sent by a
 * webhook owned by your application or directly by the bot. If we ever
 * regress to a classic incoming webhook the buttons would silently
 * disappear in production — this test fails fast in CI before that can
 * happen.
 *
 * Strategy:
 *  1. Set bot-token + channel-ID env vars (no webhook URLs).
 *  2. Stub global `fetch` to capture URL, headers and body of every
 *     outbound Discord call.
 *  3. Invoke `notifyBookingCreated` and `notifyBookingRescheduled`.
 *  4. Wait for the queue to drain.
 *  5. Assert: every captured call hits `/channels/{id}/messages`, uses a
 *     `Bot ` Authorization header, and the LAST captured payload of each
 *     event carries the 2 expected component rows with the right
 *     custom_ids and the booking ID round-trips through them.
 *
 * Run: `npx tsx scripts/discord/test-discord-bot-buttons.ts`
 */

// MUST be the first import: pins DISCORD_QUEUE_BACKEND=memory before
// any code path can load server/discord.ts, and exposes the shared
// importDiscordModule() helper that asserts the module surface.
import { importDiscordModule } from "./__test-utils";

const AGENDA_CHANNEL_ID = "100000000000000004";
process.env.DISCORD_BOT_TOKEN                = "test-bot-token";
process.env.DISCORD_CHANNEL_REGISTROS        = "100000000000000001";
process.env.DISCORD_CHANNEL_CALCULADORA      = "100000000000000002";
process.env.DISCORD_CHANNEL_ACTIVIDAD        = "100000000000000003";
process.env.DISCORD_CHANNEL_AGENDA           = AGENDA_CHANNEL_ID;
process.env.DISCORD_CHANNEL_CONSENTIMIENTOS  = "100000000000000005";
process.env.DISCORD_CHANNEL_ERRORES          = "100000000000000006";
process.env.DISCORD_CHANNEL_AUDITORIA        = "100000000000000007";

interface Captured {
  url: string;
  authorization: string | null;
  body: any;
}
const captured: Captured[] = [];

const realFetch = global.fetch;
global.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
  const u = typeof url === "string" ? url : url instanceof URL ? url.toString() : url.url;
  const headers = (init?.headers ?? {}) as Record<string, string>;
  const auth = headers.Authorization || headers.authorization || null;
  let body: any = null;
  try { body = init?.body ? JSON.parse(String(init.body)) : null; } catch { /* ignore */ }
  captured.push({ url: u, authorization: auth, body });
  return new Response(null, { status: 204 });
}) as unknown as typeof fetch;

function fail(msg: string): never {
  console.error(`\n❌ ${msg}`);
  console.error("   Captured calls:");
  for (const c of captured) {
    console.error(`     • ${c.url}  auth=${c.authorization ? c.authorization.slice(0, 12) + "…" : "<none>"}  components=${Array.isArray(c.body?.components) ? c.body.components.length : 0}`);
  }
  process.exit(1);
}

async function main() {
  const d = await importDiscordModule();

  d.notifyBookingCreated({
    bookingId: "bk_buttons_create",
    name: "Ada", lastName: "Lovelace",
    email: "ada@test.dev",
    date: "2026-05-01", startTime: "10:00", endTime: "10:30",
    language: "es",
  });
  d.notifyBookingRescheduled({
    bookingId: "bk_buttons_resched",
    name: "Ada", email: "ada@test.dev",
    newDate: "2026-05-02", newStartTime: "11:00", newEndTime: "11:30",
    language: "es",
  });

  const HARD_CAP_MS = 15_000;
  const start = Date.now();
  while (Date.now() - start < HARD_CAP_MS) {
    if (d.getDiscordQueueSize() === 0 && captured.length >= 2) break;
    await new Promise((r) => setTimeout(r, 250));
  }
  await new Promise((r) => setTimeout(r, 300));

  if (captured.length === 0) fail("No Discord calls captured — fetch stub misconfigured.");

  // 1. Every call must be a bot REST channels-messages POST or PATCH.
  //    Strict shape: https://discord.com/api/v10/channels/{snowflake}/messages
  //    optionally followed by /{snowflake} for edits. Anything else (e.g.
  //    /webhooks/..., /channels/{id}/typing, etc.) fails the test.
  const ALLOWED_URL = /^https:\/\/discord\.com\/api\/v10\/channels\/\d+\/messages(?:\/\d+)?$/;
  for (const c of captured) {
    if (!ALLOWED_URL.test(c.url)) {
      fail(`Outbound URL is not a bot channel-messages endpoint: ${c.url}`);
    }
    if (!c.authorization || !c.authorization.startsWith("Bot ")) {
      fail(`Outbound call missing 'Bot <token>' Authorization header: ${c.authorization}`);
    }
    // Webhook URLs would look like `/webhooks/...` — explicitly forbid them.
    if (c.url.includes("/webhooks/")) {
      fail(`Outbound call still hits a webhook URL: ${c.url}`);
    }
  }

  // 2. Find the agenda calls and locate the one carrying components.
  const agendaCalls = captured.filter((c) => c.url.includes(`/channels/${AGENDA_CHANNEL_ID}/messages`));
  if (agendaCalls.length < 2) fail(`Expected at least 2 calls to #agenda, got ${agendaCalls.length}.`);

  const callsWithComponents = agendaCalls.filter((c) => Array.isArray(c.body?.components) && c.body.components.length > 0);
  if (callsWithComponents.length < 2) {
    fail(`Expected booking notifications to carry components — only ${callsWithComponents.length}/${agendaCalls.length} did.`);
  }

  // 3. Validate the component shape on every booking notification.
  for (const c of callsWithComponents) {
    const rows = c.body.components as any[];
    if (rows.length !== 2) fail(`Expected 2 component rows (buttons + email select), got ${rows.length}.`);
    const [buttonsRow, selectRow] = rows;
    if (buttonsRow.type !== 1) fail(`Row 1 is not an action row (type=1).`);
    const buttons = buttonsRow.components as any[];
    if (buttons.length !== 4) fail(`Row 1 must have exactly 4 buttons, got ${buttons.length}.`);
    const verbs = buttons.map((b) => String(b.custom_id || "").split(":")[1]);
    const expectedVerbs = ["confirm", "reschedule", "cancel", "noshow"];
    for (let i = 0; i < expectedVerbs.length; i++) {
      if (verbs[i] !== expectedVerbs[i]) {
        fail(`Button ${i} has verb '${verbs[i]}', expected '${expectedVerbs[i]}'.`);
      }
    }
    if (selectRow.type !== 1) fail(`Row 2 is not an action row (type=1).`);
    const select = selectRow.components?.[0];
    if (!select || select.type !== 3) fail(`Row 2 must contain a string select menu (type=3).`);
    if (!String(select.custom_id || "").startsWith("agenda:email_select:")) {
      fail(`Email select custom_id is malformed: ${select.custom_id}`);
    }
    const optionValues = (select.options as any[]).map((o) => o.value);
    for (const v of ["confirmation", "recordatorio", "noshow", "seguimiento"]) {
      if (!optionValues.includes(v)) fail(`Email select missing option '${v}' (got ${optionValues.join(", ")}).`);
    }
    // Total of 5 interactive components per booking message: 4 buttons + 1 select.
    const total = buttons.length + (selectRow.components as any[]).length;
    if (total !== 5) fail(`Expected 5 interactive components per booking message, got ${total}.`);
  }

  // 4. The booking ID must round-trip through every custom_id so the
  //    interactions endpoint can route the click back to the right row.
  const idCreate = "bk_buttons_create";
  const idResched = "bk_buttons_resched";
  const haystack = JSON.stringify(callsWithComponents);
  if (!haystack.includes(`agenda:confirm:${idCreate}`)) fail(`Booking ID '${idCreate}' missing from confirm button custom_id.`);
  if (!haystack.includes(`agenda:email_select:${idResched}`)) fail(`Booking ID '${idResched}' missing from reschedule email select custom_id.`);

  console.log(`✅ Discord bot REST API + components OK — ${captured.length} calls captured, ${callsWithComponents.length} booking notifications carried the 5-component action set.`);
  global.fetch = realFetch;
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
