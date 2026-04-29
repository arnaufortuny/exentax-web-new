/**
 * Regression test: every Discord embed must use the Exentax neon green
 * (0x00E510). Brand policy — no other colour is permitted.
 *
 * Strategy:
 *  1. Import `__test-utils` FIRST so `DISCORD_QUEUE_BACKEND=memory` is
 *     pinned before `server/discord.ts` is loaded — otherwise the test
 *     would race the persistent Postgres-backed queue and dedup state
 *     persisted by previous runs would silently swallow embeds.
 *  2. Set dummy bot-token + channel-ID env vars so `send()` actually
 *     enqueues payloads.
 *  3. Stub global `fetch` to capture every outgoing Discord payload.
 *  4. Invoke every public notify* wrapper with minimally valid options.
 *  5. Wait for the queue to drain, then assert:
 *       (a) the imported module exposes every symbol the test relies on
 *           (regression guard against the off-by-one path bug fixed in
 *           task #68),
 *       (b) the captured count matches the expected total exactly,
 *       (c) every captured embed has `color === 0x00E510`,
 *       (d) the source no longer references the legacy multi-colour
 *           palette (`COLOR.RED`, `CRITICALITY_COLOR`, etc.).
 *
 * Run: `npx tsx scripts/discord/test-discord-neon.ts`
 */

// MUST be the first import: pins DISCORD_QUEUE_BACKEND=memory before
// any code path can load server/discord.ts.
import {
  EXENTAX_NEON,
  DISCORD_MODULE_PATH,
  importDiscordModule,
} from "./__test-utils";

import { readFileSync } from "node:fs";

// ─── 1. Webhook env (must exist before importing discord.ts) ─────────────
// These names must match `CHANNEL_ENV` in server/discord.ts exactly.
process.env.DISCORD_BOT_TOKEN                = "test-bot-token";
process.env.DISCORD_CHANNEL_REGISTROS        = "100000000000000001";
process.env.DISCORD_CHANNEL_CALCULADORA      = "100000000000000002";
process.env.DISCORD_CHANNEL_ACTIVIDAD        = "100000000000000003";
process.env.DISCORD_CHANNEL_AGENDA           = "100000000000000004";
process.env.DISCORD_CHANNEL_CONSENTIMIENTOS  = "100000000000000005";
process.env.DISCORD_CHANNEL_ERRORES          = "100000000000000006";
process.env.DISCORD_CHANNEL_AUDITORIA        = "100000000000000007";

// ─── 2. Capture outgoing fetch payloads ──────────────────────────────────
interface CapturedEmbed {
  color?: number | null;
  title?: string;
}
const captured: CapturedEmbed[] = [];

const realFetch = global.fetch;
global.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
  try {
    if (init?.body) {
      const body = typeof init.body === "string" ? init.body : "";
      const parsed = JSON.parse(body);
      if (Array.isArray(parsed.embeds)) {
        for (const e of parsed.embeds) captured.push({ color: e.color, title: e.title });
      }
    }
  } catch { /* ignore */ }
  // 204 No Content — the Response constructor rejects a body for 204 in
  // Node 18+, so we MUST pass `null`. Returning a non-OK / throwing
  // response would push every send through the retry path and make the
  // captured count depend on retry timing instead of the (deterministic)
  // notify* fan-out.
  return new Response(null, { status: 204 });
}) as unknown as typeof fetch;

// Expected total embed count produced by exercising every notify* wrapper
// below. With a successful (204) fetch stub each wrapper produces exactly
// one captured embed (no retries), so the count maps 1:1 to the wrapper
// invocations in `main()`. If a new notify* call is added — or one of
// the wrappers below changes its embed-partition behaviour — bump this
// constant deliberately.
//
// NOTE: an earlier revision of this script returned a Response that
// threw at construction time, which forced every send through 3 retries
// and produced a non-deterministic count between runs (observed 23, 30,
// 35 on the same input). Fixing the stub gives us a clean fixed count.
const EXPECTED_EMBEDS = 14;

const formatHex = (n: number | null | undefined): string =>
  `0x${(n ?? 0).toString(16).padStart(6, "0").toUpperCase()}`;

// ─── 3. Invoke every notify* wrapper ─────────────────────────────────────
async function main() {
  // Loads the discord module via the helper, which also asserts every
  // symbol below is exported. If the import path ever drifts the helper
  // throws here with an actionable error instead of letting the test
  // crash deep inside `d.notifyBookingCreated is not a function`.
  const d = await importDiscordModule();

  const baseBooking = {
    bookingId: "bk_test_1",
    name: "Ada",
    lastName: "Lovelace",
    email: "ada@test.dev",
    date: "2026-05-01",
    startTime: "10:00",
    endTime: "10:30",
    language: "es",
  };

  d.notifyBookingCreated({ ...baseBooking });
  d.notifyBookingRescheduled({
    bookingId: "bk_test_2",
    name: "Ada", email: "ada@test.dev",
    newDate: "2026-05-02", newStartTime: "10:00", newEndTime: "10:30",
    language: "es",
  });
  d.notifyBookingCancelled({
    bookingId: "bk_test_3",
    name: "Ada", email: "ada@test.dev",
    date: "2026-05-01", startTime: "10:00", endTime: "10:30",
    language: "es",
  });
  d.notifyNoShow({
    bookingId: "bk_test_4",
    name: "Ada", email: "ada@test.dev",
    date: "2026-05-01", startTime: "10:00", endTime: "10:30",
    language: "es",
  });
  d.notifyCalculatorLead({
    leadId: "lead_calc_1",
    email: "ada@test.dev",
    ahorro: 12000,
    annualIncome: 50000,
    language: "es",
  });
  d.notifyNewsletterSubscribe({
    email: "ada-news@test.dev",
    language: "es",
  });
  d.notifyNewLead({
    leadId: "lead_new_1",
    name: "Ada", email: "ada@test.dev", source: "footer",
    language: "es",
  });
  d.notifyWebVisit({
    ip: "127.0.0.1", page: "/", language: "es", isNew: true,
  });
  d.notifyConsent({
    consentId: "con_smoke_test",
    formType: "cookies:accept_all",
    privacyAccepted: true, marketingAccepted: false,
    language: "es",
  });
  d.notifyValidationFailed({
    route: "/api/bookings/book", method: "POST", language: "es",
    details: { email: "invalid" },
  });
  d.notifyCriticalError({
    context: "test/context", message: "boom",
  });
  d.notifySeoIndexing({
    source: "indexnow", status: "ok", title: "Sitemap pinged",
  });
  d.notifySeoIndexing({
    source: "indexnow", status: "skipped", title: "Sitemap skipped",
  });
  d.notifySeoIndexing({
    source: "indexnow", status: "failed", title: "Sitemap failed",
  });

  // The FIFO queue drains exactly one item per DRAIN_INTERVAL_MS (1.5 s)
  // and may schedule retries on transient errors. Poll the exposed queue
  // size and the captured count, with a hard cap so the test stays
  // bounded if something stalls.
  const HARD_CAP_MS = 45_000;
  const start = Date.now();
  while (Date.now() - start < HARD_CAP_MS) {
    if (d.getDiscordQueueSize() === 0 && captured.length >= EXPECTED_EMBEDS) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  // One final beat to let the last in-flight send resolve.
  await new Promise((r) => setTimeout(r, 500));

  // ─── 4. Assertions ─────────────────────────────────────────────────────
  if (captured.length !== EXPECTED_EMBEDS) {
    console.error(
      `\n❌ Captured ${captured.length} Discord embed(s), expected exactly ${EXPECTED_EMBEDS}.`,
    );
    console.error(
      `   queueSize=${d.getDiscordQueueSize()} after ${Date.now() - start}ms; titles captured:`,
    );
    if (captured.length === 0) {
      console.error("     (none — fetch stub may be misconfigured or the queue never drained)");
    } else {
      for (const e of captured) {
        console.error(`     • color=${formatHex(e.color)}  title="${e.title ?? ""}"`);
      }
    }
    console.error(
      `   If a notify* wrapper was added/removed deliberately, update EXPECTED_EMBEDS.`,
    );
    process.exit(1);
  }

  const offenders = captured.filter((e) => e.color !== EXENTAX_NEON);
  if (offenders.length > 0) {
    console.error(
      `\n❌ Discord neon policy VIOLATED — every embed must be ${formatHex(EXENTAX_NEON)}.`,
    );
    console.error(`   ${offenders.length}/${captured.length} embed(s) used a non-neon colour:`);
    for (const e of offenders) {
      console.error(`     • color=${formatHex(e.color)}  title="${e.title ?? ""}"`);
    }
    process.exit(1);
  }

  // ─── 5. Static guard: legacy palette must be gone ──────────────────────
  const rawSrc = readFileSync(DISCORD_MODULE_PATH, "utf8");
  // Strip line comments and block comments before scanning so that explanatory
  // text mentioning the legacy palette doesn't trigger a false positive.
  const src = rawSrc
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, ""))
    .join("\n");
  const banned = [
    /\bCRITICALITY_COLOR\b/,
    /\bCOLOR\.(RED|RED_INTENSE|ORANGE|YELLOW|BLUE|PURPLE|TEAL|GREY|GREEN)\b/,
    /\bcolor:\s*COLOR\./,
  ];
  for (const re of banned) {
    if (re.test(src)) {
      console.error(`❌ Legacy color reference still present in discord.ts: ${re}`);
      process.exit(1);
    }
  }

  // Ensure the only hex literal that resembles a colour is EXENTAX_NEON.
  const hexMatches = src.match(/0x[0-9A-Fa-f]{6}/g) ?? [];
  const nonNeon = hexMatches.filter((h) => h.toLowerCase() !== "0x00e510");
  if (nonNeon.length > 0) {
    console.error(`❌ Non-neon hex literals found in discord.ts: ${nonNeon.join(", ")}`);
    process.exit(1);
  }

  console.log(
    `✅ Discord neon policy OK — ${captured.length} embeds captured (expected ${EXPECTED_EMBEDS}), all ${formatHex(EXENTAX_NEON)}.`,
  );
  global.fetch = realFetch;
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
