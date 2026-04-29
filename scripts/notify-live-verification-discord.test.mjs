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
  isPrivilegedTrigger,
  secretsMissing,
  decideStickyIssueAction,
  DIGEST_STALE_THRESHOLD_MS,
  DIGEST_CADENCE_MS,
  getLaneConfig,
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

// Reporte producido por el carril SEO+headers (Task #60): el runner se
// invoca con `--only F1-headers,F2`, así que NUNCA aparecen filas de
// /api/health (ni siquiera como FAIL). Incluso si el backend está caído,
// este carril sólo reporta la regresión de cabeceras / robots / sitemap.
const REPORT_SEO_DOWN = `# live-verification report

- **Base URL**: \`https://exentax.com\`
- **Generated (UTC)**: 2026-04-29T14:00:00Z
- **Result**: PASS=2 · FAIL=3 · SKIP=1 · TOTAL=6

### F-1 · Health & connectivity

| Status | Check | Detail |
|---|---|---|
| FAIL | Security headers on / | HSTS=0 CSP=0 XFO=0 REF=0 UNSAFE_EVAL=0 |

### F-2 · SEO (sitemap · robots · IndexNow · hreflang)

| Status | Check | Detail |
|---|---|---|
| FAIL | GET /sitemap.xml | Got urlset instead of sitemapindex referencing pages/blog/faq |
| FAIL | GET /robots.txt | missing one of: sitemap-pages, sitemap-blog, Disallow /api, Disallow /admin, GPTBot |
| PASS | GET /sitemap-blog.xml | 672 <loc> entries |
| PASS | 3 random hreflang alternates → 200 | https://exentax.com/es https://exentax.com/en https://exentax.com/fr |
| SKIP | IndexNow key file | Set --indexnow-key |
`;

let passed = 0;
let failed = 0;
let chain = Promise.resolve();
function test(name, fn) {
  chain = chain.then(async () => {
    try {
      await fn();
      console.log(`  ok   ${name}`);
      passed++;
    } catch (err) {
      console.error(`  FAIL ${name}`);
      console.error(err);
      failed++;
    }
  });
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

// ──────────────── decideAction · digest diario (Task #59) ────────────────
test("decideAction: incidente fresco (<6h) y mismo estado = silent", () => {
  // 2 h dentro del incidente, sin digests previos → sigue silent.
  const d = decideAction(
    {
      status: "down",
      since: "2026-04-29T10:00:00.000Z",
      lastFailCount: 5,
      lastDigestAt: null,
      lastDigestFailCount: null,
    },
    "down",
    "2026-04-29T12:00:00.000Z",
  );
  assert.equal(d.action, "silent");
});

test("decideAction: incidente >6h sin digest previo = notify-digest", () => {
  // 7 h dentro del incidente, primer digest todavía pendiente.
  const sinceMs = Date.parse("2026-04-29T05:00:00.000Z");
  const nowMs = sinceMs + DIGEST_STALE_THRESHOLD_MS + 60 * 60 * 1000; // +7h
  const d = decideAction(
    {
      status: "down",
      since: new Date(sinceMs).toISOString(),
      lastFailCount: 3,
      lastDigestAt: null,
      lastDigestFailCount: null,
    },
    "down",
    new Date(nowMs).toISOString(),
  );
  assert.equal(d.action, "notify-digest");
  assert.equal(d.since, new Date(sinceMs).toISOString(), "since debe preservarse del incidente original");
  assert.ok(
    d.durationMs >= DIGEST_STALE_THRESHOLD_MS,
    `durationMs (${d.durationMs}) debe reflejar la edad del incidente`,
  );
});

test("decideAction: incidente >6h con digest reciente (<24h) = silent", () => {
  // 30 h dentro del incidente, pero el último digest fue hace 12 h → silent.
  const sinceMs = Date.parse("2026-04-28T08:00:00.000Z");
  const nowMs = sinceMs + 30 * 60 * 60 * 1000;
  const lastDigestMs = nowMs - 12 * 60 * 60 * 1000;
  const d = decideAction(
    {
      status: "vps-not-deployed",
      since: new Date(sinceMs).toISOString(),
      lastFailCount: 9,
      lastDigestAt: new Date(lastDigestMs).toISOString(),
      lastDigestFailCount: 9,
    },
    "vps-not-deployed",
    new Date(nowMs).toISOString(),
  );
  assert.equal(d.action, "silent");
});

test("decideAction: incidente >6h con digest hace >24h = notify-digest", () => {
  // Último digest hace 25 h → toca el siguiente.
  const sinceMs = Date.parse("2026-04-27T08:00:00.000Z");
  const nowMs = sinceMs + 60 * 60 * 60 * 1000; // 60h dentro del incidente
  const lastDigestMs = nowMs - (DIGEST_CADENCE_MS + 60 * 60 * 1000); // 25h ago
  const d = decideAction(
    {
      status: "down",
      since: new Date(sinceMs).toISOString(),
      lastFailCount: 4,
      lastDigestAt: new Date(lastDigestMs).toISOString(),
      lastDigestFailCount: 6,
    },
    "down",
    new Date(nowMs).toISOString(),
  );
  assert.equal(d.action, "notify-digest");
});

test("decideAction: ok → ok jamás emite digest, aunque pase mucho tiempo", () => {
  const d = decideAction(
    {
      status: "ok",
      since: "2026-04-01T00:00:00.000Z",
      lastFailCount: 0,
      lastDigestAt: null,
      lastDigestFailCount: null,
    },
    "ok",
    "2026-04-29T12:00:00.000Z",
  );
  assert.equal(d.action, "silent");
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

test("buildEmbed notify-digest muestra FAIL count, edad y delta vs digest anterior", () => {
  const parsed = parseReport(REPORT_REAL_DOWN);
  const e = buildEmbed({
    action: "notify-digest",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-27T08:00:00.000Z",
    durationMs: 60 * 3600 * 1000, // 60h en down
    runUrl: "https://github.com/example/run/9",
    repo: "example/repo",
    prevDigestFailCount: 1, // antes de hoy había 1 FAIL
    prevDigestAt: "2026-04-28T11:00:00.000Z",
  });
  assert.equal(e.color, EXENTAX_RED);
  assertNoEmoji(e.title);
  assertNoEmoji(e.description);
  assert.match(e.title, /digest/i);
  // FAIL count actual del REPORT_REAL_DOWN es 2.
  assert.match(e.description, /FAIL count actual: \*\*2\*\*/);
  // Delta = 2 - 1 = +1
  assert.match(e.description, /\+1/);
  // Refleja la edad del incidente formateada.
  assert.match(e.description, /2 d 12 h/);
  // Field con la fecha del digest anterior.
  const prevField = e.fields.find((f) => f.name === "Digest anterior");
  assert.ok(prevField, "el embed debe incluir el field 'Digest anterior'");
  assert.equal(prevField.value, "2026-04-28T11:00:00.000Z");
});

test("buildEmbed notify-digest sin digest previo declara 'primer digest'", () => {
  const parsed = parseReport(REPORT_VPS_DOWN);
  const e = buildEmbed({
    action: "notify-digest",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T05:00:00.000Z",
    durationMs: 7 * 3600 * 1000,
    // Sin prevDigestFailCount / prevDigestAt → primer digest del incidente.
  });
  assert.equal(e.color, EXENTAX_RED);
  assert.match(e.description, /Primer digest/i);
  assert.equal(
    e.fields.some((f) => f.name === "Digest anterior"),
    false,
    "no debe haber field 'Digest anterior' en el primer digest",
  );
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

// ──────────────── carril seo-headers (Task #60) ────────────────
test("getLaneConfig devuelve lane backend por defecto y respeta seo-headers", () => {
  const def = getLaneConfig(undefined);
  assert.equal(def.footer, "Exentax · CI · live-verification");
  assert.match(def.titleDown, /Web pública degradada/);

  const seo = getLaneConfig("seo-headers");
  assert.equal(seo.footer, "Exentax · CI · live-verification (SEO+headers)");
  assert.match(seo.titleDown, /SEO\/cabeceras/);
  assert.match(seo.titleRecovery, /SEO\/cabeceras/);

  // Lanes desconocidos caen al backend para que un typo no rompa nada.
  const unknown = getLaneConfig("does-not-exist");
  assert.equal(unknown.footer, "Exentax · CI · live-verification");
});

test("REPORT_SEO_DOWN nunca clasifica como vps-not-deployed (Task #60 AC)", () => {
  // El runner del carril seo-headers no toca /api/health, así que la
  // heurística que detecta "ambos health 404" jamás aplicará. Esto es lo
  // que permite que la alerta dispare independientemente del silencio
  // anti-spam del carril principal cuando el backend está caído.
  const c = classifyIncident(parseReport(REPORT_SEO_DOWN));
  assert.equal(c.status, "down");
  assert.notEqual(c.status, "vps-not-deployed");
});

test("buildEmbed lane=seo-headers usa título y footer SEO + intro distinta", () => {
  const parsed = parseReport(REPORT_SEO_DOWN);
  const e = buildEmbed({
    action: "notify-down",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T14:00:00.000Z",
    durationMs: 0,
    runUrl: "https://github.com/example/run/2",
    repo: "example/repo",
    lane: "seo-headers",
  });
  assert.equal(e.color, EXENTAX_RED);
  assert.match(e.title, /SEO\/cabeceras/);
  assert.equal(e.footer.text, "Exentax · CI · live-verification (SEO+headers)");
  // Debe explicar que es independiente del backend.
  assert.match(e.description, /independiente del estado del backend/);
  // Top FAIL del subset HTTP-only (cabeceras + sitemap + robots).
  assert.match(e.description, /Security headers on \//);
  // El embed apunta al artefacto SEO (no al artefacto del carril principal).
  assert.match(e.description, /live-verification-seo-report/);
  assert.equal(/`live-verification-report`/.test(e.description), false);
  assertNoEmoji(e.title);
  assertNoEmoji(e.description);
  for (const f of e.fields) {
    assertNoEmoji(f.name);
    assertNoEmoji(f.value);
  }
});

test("buildEmbed default lane apunta al artefacto live-verification-report", () => {
  const parsed = parseReport(REPORT_REAL_DOWN);
  const e = buildEmbed({
    action: "notify-down",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T12:30:00.000Z",
    durationMs: 0,
  });
  assert.match(e.description, /`live-verification-report`/);
});

test("buildEmbed lane=seo-headers recovery usa NEON y título SEO", () => {
  const parsed = parseReport(REPORT_OK);
  const e = buildEmbed({
    action: "notify-recovery",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T13:00:00.000Z",
    durationMs: 60 * 60 * 1000,
    lane: "seo-headers",
  });
  assert.equal(e.color, EXENTAX_NEON);
  assert.match(e.title, /SEO\/cabeceras .* RECUPERADOS/);
  assert.match(e.description, /1 h/);
});

test("buildEmbed default lane (backend) sigue idéntico al texto previo (no regresión)", () => {
  const parsed = parseReport(REPORT_REAL_DOWN);
  const e = buildEmbed({
    action: "notify-down",
    parsed,
    classification: classifyIncident(parsed),
    since: "2026-04-29T12:30:00.000Z",
    durationMs: 0,
  });
  assert.equal(e.title, "Web pública degradada");
  assert.equal(e.footer.text, "Exentax · CI · live-verification");
});

test("main: lane=seo-headers persiste en el state.json (Task #60)", async () => {
  const { mkdtempSync, rmSync, existsSync, readFileSync } = await import(
    "node:fs"
  );
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const dir = mkdtempSync(path.join(tmpdir(), "lv-seo-"));
  const reportPath = path.join(dir, "report.md");
  const statePath = path.join(dir, "state", "state.json");
  const { writeFileSync } = await import("node:fs");
  writeFileSync(reportPath, REPORT_SEO_DOWN, "utf8");

  const prevEnv = { ...process.env };
  process.env.LIVE_VERIFICATION_REPORT = reportPath;
  process.env.LIVE_VERIFICATION_STATE = statePath;
  process.env.LIVE_VERIFICATION_EXIT = "1";
  process.env.LIVE_VERIFICATION_LANE = "seo-headers";
  process.env.LIVE_VERIFICATION_BASE_URL = "https://exentax.com";
  delete process.env.DISCORD_BOT_TOKEN;
  delete process.env.DISCORD_CHANNEL_ERRORES;

  const { main } = await import("./notify-live-verification-discord.mjs");
  try {
    await main();
    assert.equal(existsSync(statePath), true);
    const persisted = JSON.parse(readFileSync(statePath, "utf8"));
    assert.equal(persisted.status, "down");
    assert.equal(persisted.lane, "seo-headers");
    assert.equal(persisted.lastFailCount, 3);
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

// ──────────────── Task #61: detección de monitoring offline ────────────────
test("isPrivilegedTrigger: schedule y workflow_dispatch son privilegiados", () => {
  assert.equal(isPrivilegedTrigger("schedule"), true);
  assert.equal(isPrivilegedTrigger("workflow_dispatch"), true);
});

test("isPrivilegedTrigger: pull_request / push / undefined no son privilegiados", () => {
  assert.equal(isPrivilegedTrigger("pull_request"), false);
  assert.equal(isPrivilegedTrigger("push"), false);
  assert.equal(isPrivilegedTrigger(""), false);
  assert.equal(isPrivilegedTrigger(undefined), false);
});

test("secretsMissing: detecta cada secret ausente o con whitespace", () => {
  assert.deepEqual(
    secretsMissing({}),
    ["DISCORD_BOT_TOKEN", "DISCORD_CHANNEL_ERRORES"],
  );
  assert.deepEqual(
    secretsMissing({
      DISCORD_BOT_TOKEN: "abc.def",
      DISCORD_CHANNEL_ERRORES: "12345",
    }),
    [],
  );
  assert.deepEqual(
    secretsMissing({
      DISCORD_BOT_TOKEN: "   ",
      DISCORD_CHANNEL_ERRORES: "12345",
    }),
    ["DISCORD_BOT_TOKEN"],
  );
  assert.deepEqual(
    secretsMissing({ DISCORD_BOT_TOKEN: "tok" }),
    ["DISCORD_CHANNEL_ERRORES"],
  );
});

test("decideStickyIssueAction: schedule + secrets ausentes → open-or-update", () => {
  // Caso central que pide el task: silencio del cron sin alerta visible.
  // El helper debe pedir abrir/actualizar el sticky issue.
  const d = decideStickyIssueAction({
    eventName: "schedule",
    env: {
      DISCORD_BOT_TOKEN: "",
      DISCORD_CHANNEL_ERRORES: "",
    },
  });
  assert.equal(d.action, "open-or-update");
  assert.deepEqual(
    d.missing.sort(),
    ["DISCORD_BOT_TOKEN", "DISCORD_CHANNEL_ERRORES"].sort(),
  );
  assert.match(d.reason, /DISCORD_BOT_TOKEN/);
  assert.match(d.reason, /DISCORD_CHANNEL_ERRORES/);
});

test("decideStickyIssueAction: schedule + secret parcial → open-or-update sólo el ausente", () => {
  const d = decideStickyIssueAction({
    eventName: "schedule",
    env: {
      DISCORD_BOT_TOKEN: "valid-token",
      DISCORD_CHANNEL_ERRORES: "",
    },
  });
  assert.equal(d.action, "open-or-update");
  assert.deepEqual(d.missing, ["DISCORD_CHANNEL_ERRORES"]);
});

test("decideStickyIssueAction: workflow_dispatch + secrets ausentes → open-or-update", () => {
  const d = decideStickyIssueAction({
    eventName: "workflow_dispatch",
    env: {},
  });
  assert.equal(d.action, "open-or-update");
});

test("decideStickyIssueAction: schedule + secrets presentes → close-if-open", () => {
  const d = decideStickyIssueAction({
    eventName: "schedule",
    env: {
      DISCORD_BOT_TOKEN: "abc.def.ghi",
      DISCORD_CHANNEL_ERRORES: "1234567890",
    },
  });
  assert.equal(d.action, "close-if-open");
  assert.deepEqual(d.missing, []);
});

test("decideStickyIssueAction: pull_request (fork) + secrets ausentes → skip", () => {
  // Crítico: en PR de fork los secrets jamás están disponibles. NO debe
  // abrirse issue desde un fork — sería ruido y además el token de un
  // fork no tiene `issues: write`.
  const d = decideStickyIssueAction({
    eventName: "pull_request",
    env: {},
  });
  assert.equal(d.action, "skip");
  assert.deepEqual(d.missing, []);
});

test("decideStickyIssueAction: push + secrets ausentes → skip (no PR ni cron)", () => {
  const d = decideStickyIssueAction({
    eventName: "push",
    env: {},
  });
  assert.equal(d.action, "skip");
});

// ──────── Task #63: privilegedTriggers override por workflow ────────
test("isPrivilegedTrigger: lista custom respeta workflows distintos al cron", () => {
  // diagnostic-audit pasa ["push"]; el cron por defecto NO trata push
  // como privilegiado (y eso no debe cambiar para los workflows que
  // no opten in).
  assert.equal(isPrivilegedTrigger("push", ["push"]), true);
  assert.equal(isPrivilegedTrigger("push", ["pull_request"]), false);
  // Lista vacía / falsy → cae al default histórico.
  assert.equal(isPrivilegedTrigger("schedule", []), true);
  assert.equal(isPrivilegedTrigger("schedule", undefined), true);
  assert.equal(isPrivilegedTrigger("push", null), false);
});

test("decideStickyIssueAction: push + privilegedTriggers=['push'] + secrets ausentes → open-or-update", () => {
  // Modela el step de Task #63 en `diagnostic-audit.yml`: cuando un
  // push a main fallido al gate intenta notificar pero los secrets
  // están ausentes, el sticky "Auditoria CI monitoring is offline"
  // debe abrirse.
  const d = decideStickyIssueAction({
    eventName: "push",
    env: {},
    privilegedTriggers: ["push"],
  });
  assert.equal(d.action, "open-or-update");
  assert.deepEqual(
    d.missing.sort(),
    ["DISCORD_BOT_TOKEN", "DISCORD_CHANNEL_ERRORES"].sort(),
  );
});

test("decideStickyIssueAction: pull_request + privilegedTriggers=['pull_request'] + secrets ausentes → open-or-update", () => {
  // Modela el step de Task #63 en `notify-perf-gate-bypass-merged.yml`:
  // el job ya filtró merged + label, así que pull_request cuenta como
  // privilegiado para este workflow concreto.
  const d = decideStickyIssueAction({
    eventName: "pull_request",
    env: { DISCORD_BOT_TOKEN: "tok" },
    privilegedTriggers: ["pull_request"],
  });
  assert.equal(d.action, "open-or-update");
  assert.deepEqual(d.missing, ["DISCORD_CHANNEL_ERRORES"]);
});

test("decideStickyIssueAction: pull_request + privilegedTriggers=['pull_request'] + secrets presentes → close-if-open", () => {
  const d = decideStickyIssueAction({
    eventName: "pull_request",
    env: {
      DISCORD_BOT_TOKEN: "abc.def.ghi",
      DISCORD_CHANNEL_ERRORES: "1234567890",
    },
    privilegedTriggers: ["pull_request"],
  });
  assert.equal(d.action, "close-if-open");
});

test("decideStickyIssueAction: trigger fuera de la lista custom → skip", () => {
  // Si pasamos privilegedTriggers=['push'] y llega un schedule, el
  // helper debe seguir tratándolo como NO privilegiado para ese
  // workflow (el cron tiene su propia copia con su propia lista).
  const d = decideStickyIssueAction({
    eventName: "schedule",
    env: {},
    privilegedTriggers: ["push"],
  });
  assert.equal(d.action, "skip");
});

test("decideStickyIssueAction: privilegedTriggers no afecta el comportamiento por defecto", () => {
  // Sanity: omitir privilegedTriggers debe mantener el comportamiento
  // exacto que esperan los tests pre-Task-#63 (live-verification cron).
  const d1 = decideStickyIssueAction({
    eventName: "schedule",
    env: { DISCORD_BOT_TOKEN: "", DISCORD_CHANNEL_ERRORES: "" },
  });
  assert.equal(d1.action, "open-or-update");

  const d2 = decideStickyIssueAction({
    eventName: "push",
    env: {},
  });
  assert.equal(d2.action, "skip");
});

test("main: warn ::warning:: cuando schedule + secrets ausentes y down", async () => {
  // Cubre la rama nueva en main(): si el trigger es privilegiado y los
  // secrets faltan en una transición real (down), tiene que dejar
  // huella visible en el log con el formato `::warning::` que la UI de
  // GitHub Actions resalta.
  const { mkdtempSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const dir = mkdtempSync(path.join(tmpdir(), "lv-warn-"));
  const reportPath = path.join(dir, "report.md");
  const statePath = path.join(dir, "state.json");
  const { writeFileSync } = await import("node:fs");
  writeFileSync(reportPath, REPORT_REAL_DOWN, "utf8");

  const prevEnv = { ...process.env };
  process.env.LIVE_VERIFICATION_REPORT = reportPath;
  process.env.LIVE_VERIFICATION_STATE = statePath;
  process.env.LIVE_VERIFICATION_EXIT = "1";
  process.env.LIVE_VERIFICATION_BASE_URL = "https://exentax.com";
  process.env.GITHUB_EVENT_NAME = "schedule";
  delete process.env.DISCORD_BOT_TOKEN;
  delete process.env.DISCORD_CHANNEL_ERRORES;

  const captured = [];
  const origWarn = console.warn;
  console.warn = (msg) => captured.push(String(msg));

  try {
    const { main } = await import("./notify-live-verification-discord.mjs");
    await main();
    const warning = captured.find((l) =>
      l.includes("::warning") && l.includes("monitoring is offline"),
    );
    assert.ok(
      warning,
      `Esperaba un ::warning:: con "monitoring is offline" en console.warn, recibido: ${JSON.stringify(captured)}`,
    );
    assert.match(warning, /DISCORD_BOT_TOKEN/);
    assert.match(warning, /DISCORD_CHANNEL_ERRORES/);
  } finally {
    console.warn = origWarn;
    process.env = prevEnv;
    rmSync(dir, { recursive: true, force: true });
  }
});

// ──────────────── Task #65: live-verification.sh --only typo guard ────────────────
// Black-box: invocamos directamente el runner bash con una clave que no
// existe en LEGAL_KEYS y comprobamos que aborta con exit 2 en vez de
// producir el reporte vacío "PASS=0 FAIL=0 SKIP=0 TOTAL=0" que antes
// pasaba como verde por los carriles de monitorización (Task #60).
test("scripts/live-verification.sh --only F1-typo aborta con exit 2 (Task #65)", async () => {
  const { spawnSync } = await import("node:child_process");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const here = path.dirname(fileURLToPath(import.meta.url));
  const runner = path.join(here, "live-verification.sh");

  const result = spawnSync(
    "bash",
    [runner, "https://example.invalid", "--only", "F1-typo"],
    { encoding: "utf8", timeout: 30_000 },
  );

  assert.equal(
    result.status,
    2,
    `Esperaba exit 2 ('usage error') con clave desconocida; recibido status=${result.status}\nstdout=${result.stdout}\nstderr=${result.stderr}`,
  );
  assert.match(
    result.stderr,
    /Unknown --only key:\s*F1-typo/,
    "El mensaje de error debe identificar la clave desconocida",
  );
  // El mensaje debe enumerar las claves legales para que el operador
  // sepa cuál usar — sin esto el remedio es leer el script.
  assert.match(result.stderr, /F1-health/);
  assert.match(result.stderr, /F1-headers/);
  assert.match(result.stderr, /F2-sitemap/);
  // El runner NO debe haber escrito un summary "PASS=0 FAIL=0 SKIP=0".
  assert.equal(
    /PASS=0 .* FAIL=0 .* SKIP=0/.test(result.stdout),
    false,
    "El runner no debe haber producido un resumen vacío silencioso",
  );
});

test("scripts/live-verification.sh --only F1-headers,F2 sigue siendo válido (no regresión Task #60)", async () => {
  // Sanity: las dos invocaciones reales que hace CI
  // (live-verification.yml usa --only nada, y
  // live-verification-seo-headers.yml usa --only F1-headers,F2) deben
  // seguir pasando la validación.
  const { spawnSync } = await import("node:child_process");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const here = path.dirname(fileURLToPath(import.meta.url));
  const runner = path.join(here, "live-verification.sh");

  // --help debe enumerar las claves desde el array (single source of truth).
  const help = spawnSync("bash", [runner, "--help"], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Claves --only soportadas/);
  // Cada KEY usada por los workflows debe aparecer en la ayuda.
  for (const k of [
    "F1-headers",
    "F2-sitemap",
    "F2-sitemap-blog",
    "F2-robots",
    "F2-indexnow",
    "F2-hreflang",
  ]) {
    assert.match(
      help.stdout,
      new RegExp(`\\b${k}\\b`),
      `--help debe listar la clave ${k}`,
    );
  }
});

await chain;
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
