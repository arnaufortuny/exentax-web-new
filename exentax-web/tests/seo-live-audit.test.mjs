/*
 * tests/seo-live-audit.test.mjs
 * ----------------------------------------------------------------------------
 * Self-test that locks the post-deploy SEO-live-audit Discord alert format
 * in place so it cannot silently drift from `notifySeoIndexing()` in
 * `server/discord.ts` (which is the source of truth for the runtime
 * sitemap-ping alert format).
 *
 * `scripts/seo/seo-live-audit.mjs` builds its own Discord embed because it
 * runs as a standalone .mjs script (no TypeScript transpile) and therefore
 * cannot import from `server/discord.ts`. To keep both code paths producing
 * an identical-looking embed, we assert here that the live-audit's helpers
 * agree with the runtime contract on:
 *
 *   - EXENTAX_NEON colour      (0x00E510, brand-policy single-colour palette)
 *   - CRITICALITY_PREFIX map   ([INFO] / [AVISO] / [ERROR])
 *   - CRITICALITY_LABEL map    (Info / Warning / Error)
 *   - the four mandatory header fields                        (Type, Severity,
 *                                                              Origin, Status)
 *   - the trailing "Logged at" footer field
 *   - the brand avatar/footer icon URL
 *
 * Plus one assertion per result class returned by
 * `buildDiscordEnvelopeForResult()` — skipped, ok, failed — so a future
 * change to the envelope shape (renaming a field, dropping the Base URL,
 * forgetting to map criticality to status) trips the gate before it ships.
 * ----------------------------------------------------------------------------
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDiscordEnvelopeForResult,
  buildDiscordEmbed,
  EXENTAX_NEON,
  EXENTAX_AVATAR_URL,
  CRITICALITY_PREFIX,
  CRITICALITY_LABEL,
} from "../scripts/seo/seo-live-audit.mjs";

// ─── Helpers ──────────────────────────────────────────────────────────────

const BASE_URL = "https://exentax.com";

function emptyStats(overrides = {}) {
  return {
    sitemaps: {
      "/sitemap.xml":       { status: 200, contentType: "application/xml" },
      "/sitemap-pages.xml": { status: 200, contentType: "application/xml", urlCount: 102 },
      "/sitemap-blog.xml":  { status: 200, contentType: "application/xml", urlCount: 672 },
      "/sitemap-faq.xml":   { status: 200, contentType: "application/xml", urlCount: 6 },
      ...overrides.sitemaps,
    },
    totals: { urls: 780, groups: 130, reciprocityFailures: 0, ...overrides.totals },
    routes: overrides.routes ?? Array.from({ length: 14 }, (_, i) => ({ idx: i })),
  };
}

function findField(fields, name) {
  return fields.find((f) => f.name === name);
}

// ─── Brand-contract constants ─────────────────────────────────────────────

test("EXENTAX_NEON matches the brand-policy single-colour value (0x00E510)", () => {
  // Mirrors the constant in server/discord.ts so a future re-brand has to
  // touch both files (and trip this test if it forgets one).
  assert.equal(EXENTAX_NEON, 0x00e510);
});

test("EXENTAX_AVATAR_URL points at the canonical brand icon", () => {
  assert.equal(EXENTAX_AVATAR_URL, "https://exentax.com/ex-icon-green.png");
});

test("CRITICALITY_PREFIX produces the same [INFO]/[AVISO]/[ERROR] tags as discord.ts", () => {
  // Brand policy: severity is conveyed only via this ASCII prefix in the
  // title (no emoji, no colour variations). Drift here would let the
  // post-deploy alert ship with a different prefix than the runtime alert.
  assert.equal(CRITICALITY_PREFIX.info,    "[INFO]");
  assert.equal(CRITICALITY_PREFIX.warning, "[AVISO]");
  assert.equal(CRITICALITY_PREFIX.error,   "[ERROR]");
});

test("CRITICALITY_LABEL produces the same Severity strings as discord.ts", () => {
  assert.equal(CRITICALITY_LABEL.info,    "Info");
  assert.equal(CRITICALITY_LABEL.warning, "Warning");
  assert.equal(CRITICALITY_LABEL.error,   "Error");
});

// ─── buildDiscordEnvelopeForResult — skipped ──────────────────────────────

test("envelope (skipped): warning criticality, omitido title, status=skipped, surfaces first warning", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: "",
    errors: [],
    warnings: ["DATABASE_URL not set — skipping live audit (no server to spawn)."],
    stats: emptyStats(),
  });
  assert.equal(env.criticality, "warning");
  assert.equal(env.status,      "skipped");
  assert.equal(env.origin,      "seo-live-audit");
  assert.equal(env.title,       "SEO live-audit — omitido");
  assert.equal(env.description, "DATABASE_URL not set — skipping live audit (no server to spawn).");
  // One body field: the warning count.
  const warningsField = findField(env.fields, "Warnings");
  assert.ok(warningsField, "expected a Warnings field");
  assert.equal(warningsField.value, "1");
});

test("envelope (skipped): falls back to a generic description when there are no warnings", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: "",
    errors: [],
    warnings: [],
    stats: emptyStats(),
  });
  assert.equal(env.description, "No live server reachable; audit skipped.");
});

// ─── buildDiscordEnvelopeForResult — ok ───────────────────────────────────

test("envelope (ok): info criticality, status=ok, OK title, all sitemap stats surfaced", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors: [],
    warnings: [],
    stats: emptyStats(),
  });
  assert.equal(env.criticality, "info");
  assert.equal(env.status,      "ok");
  assert.equal(env.origin,      "seo-live-audit");
  assert.equal(env.title,       "SEO live-audit — OK");
  // Body fields the operator must see at a glance.
  assert.equal(findField(env.fields, "Base URL").value,      BASE_URL);
  assert.equal(findField(env.fields, "Sitemaps OK").value,   "4/4");
  assert.equal(findField(env.fields, "URLs").value,          "780");
  assert.equal(findField(env.fields, "Groups").value,        "130");
  assert.equal(findField(env.fields, "Routes probed").value, "14");
});

// ─── buildDiscordEnvelopeForResult — failed ───────────────────────────────

test("envelope (failed): error criticality, status=failed, fallo title, surfaces the first errors", () => {
  const errors = [
    "sitemap /sitemap-blog.xml: HTTP 500",
    "headers /es: expected HTTP 200 (got 404)",
    "robots.txt: missing Cache-Control header",
  ];
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors,
    warnings: [],
    stats: emptyStats({
      sitemaps: { "/sitemap-blog.xml": { status: 500 } },
      totals: { urls: 108, groups: 18, reciprocityFailures: 2 },
    }),
  });
  assert.equal(env.criticality, "error");
  assert.equal(env.status,      "failed");
  assert.equal(env.origin,      "seo-live-audit");
  assert.equal(env.title,       "SEO live-audit — fallo");
  // Description must include the first error so the operator sees the
  // root cause without opening the report.
  assert.ok(
    env.description.includes("Detected 3 regression(s)") &&
      env.description.includes("sitemap /sitemap-blog.xml: HTTP 500"),
    `unexpected description:\n${env.description}`,
  );
  assert.equal(findField(env.fields, "Base URL").value,    BASE_URL);
  assert.equal(findField(env.fields, "Errors").value,      "3");
  assert.equal(findField(env.fields, "URLs").value,        "108");
  assert.equal(findField(env.fields, "Reciprocity").value, "2 failure(s)");
  assert.equal(findField(env.fields, "Sitemaps OK").value, "3/4");
  // Report links must be present so the alert is actionable.
  assert.ok(findField(env.fields, "Report (JSON)"), "missing JSON report link");
  assert.ok(findField(env.fields, "Report (MD)"),   "missing MD report link");
});

test("envelope (failed): caps the description to the first 5 errors", () => {
  const errors = Array.from({ length: 12 }, (_, i) => `err-${i + 1}`);
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors,
    warnings: [],
    stats: emptyStats(),
  });
  // The first five must be quoted, the sixth must not (otherwise the
  // alert would become unreadable on big regressions).
  for (let i = 1; i <= 5; i++) assert.ok(env.description.includes(`err-${i}`));
  assert.ok(!env.description.includes("err-6"));
  // The Errors field still reports the full count.
  assert.equal(findField(env.fields, "Errors").value, "12");
});

// ─── buildDiscordEmbed — final shape posted to Discord ────────────────────

test("embed (ok): title is prefixed [INFO], colour is EXENTAX_NEON, footer carries the brand avatar", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors: [],
    warnings: [],
    stats: emptyStats(),
  });
  const embed = buildDiscordEmbed(env);
  assert.equal(embed.title.startsWith("[INFO] "), true, `title was: ${embed.title}`);
  assert.equal(embed.title, "[INFO] SEO live-audit — OK");
  assert.equal(embed.color, EXENTAX_NEON);
  assert.equal(embed.footer.icon_url, EXENTAX_AVATAR_URL);
  // Mandatory header fields, in order.
  assert.equal(embed.fields[0].name, "Type");
  assert.equal(embed.fields[0].value, "seo_indexing");
  assert.equal(embed.fields[1].name, "Severity");
  assert.equal(embed.fields[1].value, "Info");
  assert.equal(embed.fields[2].name, "Origin");
  assert.equal(embed.fields[2].value, "seo-live-audit");
  assert.equal(embed.fields[3].name, "Status");
  assert.equal(embed.fields[3].value, "OK");
  // Trailer: Logged at must be the last field (mirrors notifyEvent's trailer).
  assert.equal(embed.fields[embed.fields.length - 1].name, "Logged at");
});

test("embed (skipped): title is prefixed [AVISO] and Severity = Warning", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: "",
    errors: [],
    warnings: ["nope"],
    stats: emptyStats(),
  });
  const embed = buildDiscordEmbed(env);
  assert.equal(embed.title, "[AVISO] SEO live-audit — omitido");
  assert.equal(embed.color, EXENTAX_NEON);
  assert.equal(findField(embed.fields, "Severity").value, "Warning");
  assert.equal(findField(embed.fields, "Status").value,   "SKIPPED");
});

test("embed (failed): title is prefixed [ERROR] and Severity = Error", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors: ["boom"],
    warnings: [],
    stats: emptyStats(),
  });
  const embed = buildDiscordEmbed(env);
  assert.equal(embed.title, "[ERROR] SEO live-audit — fallo");
  assert.equal(embed.color, EXENTAX_NEON);
  assert.equal(findField(embed.fields, "Severity").value, "Error");
  assert.equal(findField(embed.fields, "Status").value,   "FAILED");
});

test("embed: does not double-prefix a title that was already prefixed", () => {
  // Defensive: notifyEvent in server/discord.ts has the same guard — keep
  // the live-audit consistent so a copy/paste of the title constant by
  // hand does not produce "[ERROR] [ERROR] …".
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors: ["boom"],
    warnings: [],
    stats: emptyStats(),
  });
  // Pre-pend the prefix, simulating a misuse of the constant.
  const env2 = { ...env, title: `[ERROR] ${env.title}` };
  const embed = buildDiscordEmbed(env2);
  assert.equal(embed.title.startsWith("[ERROR] [ERROR]"), false, `double prefix: ${embed.title}`);
});

test("embed: drops envelope fields with blank values (mirrors notifyEvent's pushAlways guard)", () => {
  const env = buildDiscordEnvelopeForResult({
    baseUrl: BASE_URL,
    errors: [],
    warnings: [],
    stats: emptyStats(),
  });
  // Inject a blank field; it must not survive into the rendered embed.
  env.fields.push({ name: "Empty", value: "   ", inline: true });
  env.fields.push({ name: "Null",  value: null,  inline: true });
  const embed = buildDiscordEmbed(env);
  assert.equal(findField(embed.fields, "Empty"), undefined);
  assert.equal(findField(embed.fields, "Null"),  undefined);
});
