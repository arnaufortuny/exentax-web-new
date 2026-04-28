/**
 * Regression test: every Discord embed must use the Exentax neon green
 * (0x00E510). Brand policy — no other colour is permitted.
 *
 * Strategy:
 *  1. Set dummy bot-token + channel-ID env vars so `send()` actually enqueues payloads.
 *  2. Stub global `fetch` to capture every outgoing Discord payload.
 *  3. Invoke every public notify* wrapper with minimally valid options.
 *  4. Wait for the queue to drain, then assert every captured embed has
 *     `color === 0x00E510`.
 *  5. Also assert the source no longer references the legacy multi-color
 *     palette (`COLOR.RED`, `CRITICALITY_COLOR`, etc.).
 *
 * Run: `npx tsx scripts/discord/test-discord-neon.ts`
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const EXENTAX_NEON = 0x00E510;

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
  return new Response("", { status: 204 });
}) as unknown as typeof fetch;

// ─── 3. Invoke every notify* wrapper ─────────────────────────────────────
async function main() {
  const d = await import(resolve(dirname(fileURLToPath(import.meta.url)), "..", "server", "discord.ts"));

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

  // The FIFO queue drains exactly one item per DRAIN_INTERVAL_MS (1.5 s).
  // 14 wrappers → ~21 s worst-case; poll the exposed queue size and wait
  // up to a hard cap so the test stays bounded even if something stalls.
  const HARD_CAP_MS = 35_000;
  const start = Date.now();
  while (Date.now() - start < HARD_CAP_MS) {
    if (d.getDiscordQueueSize() === 0 && captured.length >= 14) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  // One final beat to let the last in-flight send resolve.
  await new Promise((r) => setTimeout(r, 500));

  // ─── 4. Assertions ─────────────────────────────────────────────────────
  if (captured.length === 0) {
    throw new Error("No Discord payloads captured — test stub is misconfigured.");
  }

  // Coverage guard: every notify* wrapper invoked above must produce at
  // least one captured embed. We exercise 14 wrappers; some events share a
  // dedupKey window so we require a conservative minimum rather than an
  // exact count, but still high enough to fail loudly if the queue stops
  // draining or if a wrapper silently no-ops.
  const MIN_EXPECTED = 14;
  if (captured.length < MIN_EXPECTED) {
    console.error(`❌ Only ${captured.length} embeds captured — expected at least ${MIN_EXPECTED}.`);
    console.error("   Captured titles:");
    for (const e of captured) console.error(`     • ${e.title}`);
    process.exit(1);
  }

  const offenders = captured.filter((e) => e.color !== EXENTAX_NEON);
  if (offenders.length > 0) {
    console.error("\n❌ Discord neon policy VIOLATED. Non-neon embeds:");
    for (const e of offenders) {
      console.error(`   color=0x${(e.color ?? 0).toString(16).padStart(6, "0").toUpperCase()}  title="${e.title}"`);
    }
    process.exit(1);
  }

  // ─── 5. Static guard: legacy palette must be gone ──────────────────────
  const here = dirname(fileURLToPath(import.meta.url));
  const rawSrc = readFileSync(resolve(here, "..", "server", "discord.ts"), "utf8");
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

  console.log(`✅ Discord neon policy OK — ${captured.length} embeds captured, all 0x00E510.`);
  global.fetch = realFetch;
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
