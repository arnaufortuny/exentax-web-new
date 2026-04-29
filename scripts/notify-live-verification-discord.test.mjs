#!/usr/bin/env node
/**
 * Tests para `notify-live-verification-discord.mjs` (Task #56).
 *
 * Cubre las funciones puras del notifier:
 *   1. parseReport         — extrae PASS/FAIL/SKIP, baseURL y filas FAIL.
 *   2. classifyIncident    — distingue ok / down / vps-not-deployed.
 *   3. decideAction        — transiciones de estado y duración del incidente.
 *   4. buildEmbed          — embed Discord con paleta + sin emojis.
 *
 * Uso:   node scripts/notify-live-verification-discord.test.mjs
 * Exit:  0 si todos los assertions pasan; 1 en caso contrario.
 */
import assert from "node:assert/strict";

const EXENTAX_RED = 0xe53935;
const EXENTAX_NEON = 0x00e510;
// Política Exentax: sin emojis en mensajes Discord.
const EMOJI_RE =
  /[\u2600-\u27BF\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u;

const {
  parseReport,
  classifyIncident,
  decideAction,
  formatDuration,
  buildEmbed,
} = await import("./notify-live-verification-discord.mjs");

const REPORT_VPS_DOWN = `# live-verification report

- **Base URL**: \`https://exentax.com\`
- **Generated (UTC)**: 2026-04-29T12:00:00Z
- **Result**: PASS=1 · FAIL=9 · SKIP=16 · TOTAL=26

### F-1 · Health & connectivity

| Status | Check | Detail |
|---|---|---|
| FAIL | GET /api/health | HTTP 404 — body: <html>... |
| FAIL | GET /api/health/ready | HTTP 404 — body: <html>... |
| FAIL | Security headers on / | HSTS=1 CSP=0 XFO=0 REF=0 UNSAFE_EVAL=0 (need HSTS+CSP+XFO+ReferrerPolicy) |

### F-2 · SEO

| Status | Check | Detail |
|---|---|---|
| FAIL | GET /sitemap.xml | Got urlset instead of sitemapindex |
| FAIL | GET /sitemap-blog.xml | 0 \\| entries — expected ≈672 |
| FAIL | GET /robots.txt | missing one of: sitemap-pages, sitemap-blog |
| FAIL | hreflang discovery on / | Found 2 alternates (expected ≥3) |

### F-3 · Security

| Status | Check | Detail |
|---|---|---|
| FAIL | POST /api/calculator-leads sin Origin | Esperado 403, obtenido 404 |
| FAIL | Rate-limit on /api/health | Sent 220 reqs, never saw 429 |
| PASS | something OK | ok |
| SKIP | a manual step | needs ssh |
`;

const REPORT_REAL_DOWN = `# live-verification report

- **Base URL**: \`https://exentax.com\`
- **Generated (UTC)**: 2026-04-29T12:30:00Z
- **Result**: PASS=8 · FAIL=2 · SKIP=16 · TOTAL=26

### F-1 · Health & connectivity

| Status | Check | Detail |
|---|---|---|
| PASS | GET /api/health → 200 with status:ok | uptime ok |
| PASS | GET /api/health/ready → 200 ready:true | ready true |
| FAIL | Security headers on / | HSTS=1 CSP=1 XFO=1 REF=1 UNSAFE_EVAL=1 |

### F-2 · SEO

| Status | Check | Detail |
|---|---|---|
| FAIL | GET /sitemap-blog.xml | 480 <loc> entries — expected ≈672 |
`;

const REPORT_OK = `# live-verification report

- **Base URL**: \`https://exentax.com\`
- **Generated (UTC)**: 2026-04-29T13:00:00Z
- **Result**: PASS=10 · FAIL=0 · SKIP=16 · TOTAL=26

### F-1 · Health & connectivity

| Status | Check | Detail |
|---|---|---|
| PASS | GET /api/health → 200 with status:ok | uptime ok |
| PASS | GET /api/health/ready → 200 ready:true | ready true |
| PASS | Security headers on / | HSTS=1 CSP=1 XFO=1 REF=1 UNSAFE_EVAL=0 |
`;

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ok   ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL ${name}`);
    console.error(err);
    failed++;
  }
}

console.log("notify-live-verification-discord.test.mjs");

// ──────────────── parseReport ────────────────
test("parseReport extrae baseUrl y contadores", () => {
  const p = parseReport(REPORT_VPS_DOWN);
  assert.equal(p.baseUrl, "https://exentax.com");
  assert.equal(p.pass, 1);
  assert.equal(p.fail, 9);
  assert.equal(p.skip, 16);
  assert.equal(p.total, 26);
});

test("parseReport extrae sólo filas FAIL con label + detail", () => {
  const p = parseReport(REPORT_VPS_DOWN);
  assert.equal(p.fails.length, 9);
  const labels = p.fails.map((f) => f.label);
  assert.ok(labels.includes("GET /api/health"));
  assert.ok(labels.includes("GET /api/health/ready"));
  assert.ok(labels.includes("POST /api/calculator-leads sin Origin"));
  // Verifica que el escape de pipes se deshace.
  const sitemapBlog = p.fails.find((f) => f.label === "GET /sitemap-blog.xml");
  assert.ok(sitemapBlog);
  assert.match(sitemapBlog.detail, /0 \| entries/);
});

test("parseReport tolera reporte vacío", () => {
  const p = parseReport("");
  assert.deepEqual(p, {
    baseUrl: "",
    pass: 0,
    fail: 0,
    skip: 0,
    total: 0,
    fails: [],
  });
});

// ──────────────── classifyIncident ────────────────
test("classifyIncident: FAIL=0 → ok", () => {
  const c = classifyIncident(parseReport(REPORT_OK));
  assert.equal(c.status, "ok");
});

test("classifyIncident: ambos health 404 → vps-not-deployed", () => {
  const c = classifyIncident(parseReport(REPORT_VPS_DOWN));
  assert.equal(c.status, "vps-not-deployed");
  assert.match(c.reason, /backend/i);
});

test("classifyIncident: degradación parcial → down", () => {
  const c = classifyIncident(parseReport(REPORT_REAL_DOWN));
  assert.equal(c.status, "down");
});

// ──────────────── decideAction ────────────────
test("decideAction sin estado previo + ok → silent", () => {
  const d = decideAction(null, "ok", "2026-04-29T13:00:00.000Z");
  assert.equal(d.action, "silent");
});

test("decideAction sin estado previo + down → notify-down", () => {
  const d = decideAction(null, "down", "2026-04-29T13:00:00.000Z");
  assert.equal(d.action, "notify-down");
  assert.equal(d.since, "2026-04-29T13:00:00.000Z");
});

test("decideAction sin estado previo + vps-not-deployed → notify-vps-not-deployed", () => {
  const d = decideAction(null, "vps-not-deployed", "2026-04-29T13:00:00.000Z");
  assert.equal(d.action, "notify-vps-not-deployed");
});

test("decideAction mismo estado vps-not-deployed → silent (anti-spam)", () => {
  const d = decideAction(
    { status: "vps-not-deployed", since: "2026-04-29T11:00:00.000Z" },
    "vps-not-deployed",
    "2026-04-29T13:00:00.000Z",
  );
  assert.equal(d.action, "silent");
  assert.equal(d.since, "2026-04-29T11:00:00.000Z");
});

test("decideAction mismo estado down → silent (anti-spam)", () => {
  const d = decideAction(
    { status: "down", since: "2026-04-29T11:00:00.000Z" },
    "down",
    "2026-04-29T13:00:00.000Z",
  );
  assert.equal(d.action, "silent");
});

test("decideAction down → ok = notify-recovery con duración", () => {
  const d = decideAction(
    { status: "down", since: "2026-04-29T11:00:00.000Z" },
    "ok",
    "2026-04-29T13:30:00.000Z",
  );
  assert.equal(d.action, "notify-recovery");
  // 2 h 30 min = 9000000 ms
  assert.equal(d.durationMs, 9000000);
});

test("decideAction vps-not-deployed → ok = notify-recovery", () => {
  const d = decideAction(
    { status: "vps-not-deployed", since: "2026-04-29T10:00:00.000Z" },
    "ok",
    "2026-04-29T11:00:00.000Z",
  );
  assert.equal(d.action, "notify-recovery");
  assert.equal(d.durationMs, 3600000);
});

test("decideAction ok → down = notify-down", () => {
  const d = decideAction(
    { status: "ok", since: "2026-04-29T11:00:00.000Z" },
    "down",
    "2026-04-29T11:15:00.000Z",
  );
  assert.equal(d.action, "notify-down");
});

test("decideAction down → vps-not-deployed = notify-vps-not-deployed", () => {
  const d = decideAction(
    { status: "down", since: "2026-04-29T11:00:00.000Z" },
    "vps-not-deployed",
    "2026-04-29T11:30:00.000Z",
  );
  assert.equal(d.action, "notify-vps-not-deployed");
});

// ──────────────── formatDuration ────────────────
test("formatDuration sub-minute", () => {
  assert.equal(formatDuration(45000), "45 s");
});

test("formatDuration mixed h/min", () => {
  assert.equal(formatDuration(2 * 3600 * 1000 + 13 * 60 * 1000), "2 h 13 min");
});

test("formatDuration days+hours", () => {
  assert.equal(formatDuration(26 * 3600 * 1000), "1 d 2 h");
});

// ──────────────── buildEmbed ────────────────
function assertNoEmoji(s) {
  assert.ok(
    typeof s === "string" && !EMOJI_RE.test(s),
    `Embed string contiene emoji prohibido por brand: ${JSON.stringify(s)}`,
  );
}

test("buildEmbed notify-down usa color RED y top-5 FAILs", () => {
  const parsed = parseReport(REPORT_REAL_DOWN);
  const e = buildEmbed({
    action: "notify-down",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T12:30:00.000Z",
    durationMs: 0,
    runUrl: "https://github.com/example/run/1",
    repo: "example/repo",
  });
  assert.equal(e.color, EXENTAX_RED);
  assertNoEmoji(e.title);
  assertNoEmoji(e.description);
  for (const f of e.fields) {
    assertNoEmoji(f.name);
    assertNoEmoji(f.value);
  }
  // El embed debe listar al menos un FAIL real del reporte.
  assert.match(e.description, /Security headers on \//);
  // El footer es la marca de live-verification.
  assert.equal(e.footer.text, "Exentax · CI · live-verification");
});

test("buildEmbed notify-vps-not-deployed usa RED y única alerta agrupada", () => {
  const parsed = parseReport(REPORT_VPS_DOWN);
  const e = buildEmbed({
    action: "notify-vps-not-deployed",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T12:00:00.000Z",
    durationMs: 0,
  });
  assert.equal(e.color, EXENTAX_RED);
  assert.match(e.title, /VPS no desplegado/);
  // No debe escupir las 9 filas FAIL: sólo la explicación agrupada.
  assert.equal(/GET \/api\/health/.test(e.description), false);
});

test("buildEmbed notify-recovery usa NEON y formatea duración", () => {
  const parsed = parseReport(REPORT_OK);
  const e = buildEmbed({
    action: "notify-recovery",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T11:00:00.000Z",
    durationMs: 2 * 3600 * 1000 + 30 * 60 * 1000,
  });
  assert.equal(e.color, EXENTAX_NEON);
  assert.match(e.title, /RECUPERADA/);
  assert.match(e.description, /2 h 30 min/);
});

// ──────────────── main() fallback when report is missing ────────────────
test("main: con reporte ausente y exit!=0 cae a 'down' y escribe estado", async () => {
  const { mkdtempSync, rmSync, existsSync, readFileSync } = await import(
    "node:fs"
  );
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const dir = mkdtempSync(path.join(tmpdir(), "lv-fallback-"));
  const reportPath = path.join(dir, "no-such-report.md");
  const statePath = path.join(dir, "state", "state.json");

  const prevEnv = { ...process.env };
  process.env.LIVE_VERIFICATION_REPORT = reportPath;
  process.env.LIVE_VERIFICATION_STATE = statePath;
  process.env.LIVE_VERIFICATION_EXIT = "1";
  process.env.LIVE_VERIFICATION_BASE_URL = "https://exentax.com";
  // Sin DISCORD_BOT_TOKEN: main() debe escribir estado pero no postear.
  delete process.env.DISCORD_BOT_TOKEN;
  delete process.env.DISCORD_CHANNEL_ERRORES;

  const { main } = await import("./notify-live-verification-discord.mjs");
  try {
    await main();
    assert.equal(existsSync(statePath), true, "state file should be written");
    const persisted = JSON.parse(readFileSync(statePath, "utf8"));
    assert.equal(persisted.status, "down");
    assert.equal(persisted.lastFailCount, 1);
  } finally {
    process.env = prevEnv;
    rmSync(dir, { recursive: true, force: true });
  }
});

test("buildEmbed: el token Discord nunca aparece en embeds (sanity)", () => {
  // Defensa por si en el futuro alguien añade fields dinámicos.
  const parsed = parseReport(REPORT_REAL_DOWN);
  const e = buildEmbed({
    action: "notify-down",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T12:30:00.000Z",
    durationMs: 0,
    runUrl: "https://github.com/example/run/1",
    repo: "example/repo",
  });
  const serialized = JSON.stringify(e);
  assert.equal(/DISCORD_BOT_TOKEN|Bot\s+[A-Za-z0-9.\-_]{20,}/.test(serialized), false);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
