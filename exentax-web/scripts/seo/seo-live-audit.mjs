#!/usr/bin/env node
/*
 * seo-live-audit.mjs (Task #42)
 * ----------------------------------------------------------------------------
 * Repeatable post-deploy SEO regression check. Runs against a live server
 * (BASE_URL or a freshly-spawned local one) and verifies the public SEO
 * surface that historically used to be checked by hand with `curl` after
 * every release:
 *
 *   1. The 4 sitemap endpoints return HTTP 200 with the right Content-Type:
 *        /sitemap.xml         (sitemap-index)
 *        /sitemap-pages.xml
 *        /sitemap-blog.xml
 *        /sitemap-faq.xml
 *   2. The total URL count across the 3 child sitemaps is recorded
 *      (and reported in the Discord embed when >0 / when the audit fails).
 *   3. Hreflang reciprocity is 100 % across every <url> in every child
 *      sitemap (uses the same `computeReciprocity()` primitive that
 *      `seo-cierre-audit.mjs` and its unit tests rely on).
 *   4. The runtime headers per route family are correct:
 *        - public localised home (/es, /en, /fr, /de, /pt, /ca) →
 *          `X-Robots-Tag: index, follow…` + `Link: rel=canonical`
 *        - public blog post / FAQ → same as above
 *        - private surfaces (/booking/*, /start, /thank-you, /links,
 *          /preview/*, /__mockup/*) → `X-Robots-Tag: noindex, nofollow`
 *   5. /robots.txt responds HTTP 200 with `Content-Type: text/plain` and
 *      a non-empty `Cache-Control` header (the route declares
 *      `public, max-age=86400`).
 *
 * Wired as `npm run seo:live-audit` and triggered automatically by the
 * post-deploy hook in `server/index.ts` (alongside `sitemap-ping`). On
 * failure it posts a Discord embed to `#exentax-errores` matching the
 * format produced by `notifySeoIndexing()` (same `[ERROR]/[AVISO]/[INFO]`
 * title prefix, EXENTAX_NEON colour, `Severity / Origin / Status` fields,
 * Madrid timestamp footer) so operators see regressions in chat instead
 * of having to wait for Search Console.
 *
 * The script is intentionally non-throwing: it always completes the audit
 * (and always writes the JSON+MD report) even when the live server can't
 * be reached, so the post-deploy hook never blocks a release. Exit code
 * is 0 on full pass, 1 on any audit failure, 2 on an unexpected fatal
 * error (the hook ignores both — Discord is the channel that matters).
 *
 * Usage:
 *   BASE_URL=http://localhost:5000 node scripts/seo/seo-live-audit.mjs
 *   (BASE_URL defaults to probing http://localhost:5000, then spawning
 *   `tsx server/index.ts` on a free port if DATABASE_URL is configured.)
 *
 * Env knobs:
 *   BASE_URL                       full origin to audit (no trailing slash).
 *   SITE_HOST                      production host advertised by sitemaps;
 *                                  defaults to "https://exentax.com".
 *   SEO_LIVE_AUDIT_TIMEOUT_MS      server boot ceiling when spawning a
 *                                  temp server. Default 180000.
 *   SEO_LIVE_AUDIT_NOTIFY_OK       "1" → also post a Discord embed on
 *                                  pass (off by default to avoid noise).
 *   DISCORD_BOT_TOKEN              required to post; otherwise the
 *                                  notification is silently skipped.
 *   DISCORD_CHANNEL_ERRORES        target channel ID (falls back to
 *                                  DISCORD_CHANNEL_REGISTROS, mirroring
 *                                  the channel routing in server/discord.ts).
 * ----------------------------------------------------------------------------
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

import {
  parseUrls,
  computeReciprocity,
  validateHeaderRoute,
} from "./lib/cierre-audit-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = pathResolve(__dirname, "..", "..");
const REPORT_DIR = pathResolve(ROOT, "reports", "seo");
const JSON_REPORT = pathResolve(REPORT_DIR, "seo-live-audit.json");
const MD_REPORT = pathResolve(REPORT_DIR, "seo-live-audit.md");

const SITE_HOST = (process.env.SITE_HOST || "https://exentax.com").replace(/\/$/, "");
const HREFLANGS = ["es-ES", "en-US", "fr-FR", "de-DE", "pt-PT", "ca-ES"];
const SITEMAP_INDEX = "/sitemap.xml";
const CHILD_SITEMAPS = ["/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"];
const ALL_SITEMAPS = [SITEMAP_INDEX, ...CHILD_SITEMAPS];

// One sample per route family. `kind` controls reporting bucketing in the
// Markdown report; `expect` is what `validateHeaderRoute()` enforces.
// A blog-post probe is appended dynamically once /sitemap-blog.xml has
// been fetched (see `pickBlogProbeFrom()`), so the audit follows the
// real catalog instead of pinning a slug that could be deleted.
const STATIC_ROUTE_PROBES = [
  { path: "/es", kind: "home",     expect: "public" },
  { path: "/en", kind: "home",     expect: "public" },
  { path: "/fr", kind: "home",     expect: "public" },
  { path: "/de", kind: "home",     expect: "public" },
  { path: "/pt", kind: "home",     expect: "public" },
  { path: "/ca", kind: "home",     expect: "public" },
  { path: "/en/faq",          kind: "faq",  expect: "public" },
  { path: "/booking/cita",    kind: "private", expect: "private" },
  { path: "/start",           kind: "private", expect: "private" },
  { path: "/thank-you",       kind: "private", expect: "private" },
  { path: "/links",           kind: "private", expect: "private" },
  { path: "/preview/test",    kind: "private", expect: "private" },
  { path: "/__mockup/foo",    kind: "private", expect: "private" },
];
// Acceptable Content-Type prefixes for the XML sitemap endpoints. The
// server emits `application/xml; charset=utf-8` today; we accept the
// equally-valid `text/xml` variant so the audit doesn't false-positive
// on a future, equally-correct change of MIME label.
const SITEMAP_CT_PREFIXES = ["application/xml", "text/xml"];

const HTTP_TIMEOUT_MS = 15000;
const SERVER_READY_TIMEOUT_MS = Number(process.env.SEO_LIVE_AUDIT_TIMEOUT_MS || 180000);
const SKIP_LIVE = process.env.SEO_LIVE_AUDIT_SKIP === "1";

let BASE_URL = (process.env.BASE_URL || "").replace(/\/$/, "");
let spawnedServer = null;

const errors = [];
const warnings = [];
const stats = {
  baseUrl: "",
  startedAt: new Date().toISOString(),
  sitemaps: {},                    // path → { status, contentType, urlCount?, expected? }
  totals: { urls: 0, groups: 0, reciprocityFailures: 0 },
  routes: [],                      // probe results
  routeFamilies: { home: 0, blog: 0, faq: 0, private: 0 },
  robots: {},
  finishedAt: null,
  ok: false,
};

// ─── HTTP helpers ──────────────────────────────────────────────────────────

async function fetchWithTimeout(url, init) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(path) {
  const res = await fetchWithTimeout(BASE_URL + path);
  return {
    status: res.status,
    contentType: res.headers.get("content-type") || "",
    cacheControl: res.headers.get("cache-control") || "",
    body: await res.text(),
  };
}

async function fetchHeaders(path) {
  const res = await fetchWithTimeout(BASE_URL + path, { method: "GET", redirect: "manual" });
  return {
    status: res.status,
    xRobotsTag: res.headers.get("x-robots-tag") || "",
    linkHeader: res.headers.get("link") || "",
  };
}

async function waitFor200(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetchWithTimeout(url);
      if (r.status === 200) return true;
    } catch { /* keep polling */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function pickFreePort() {
  return await new Promise((res, rej) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", rej);
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close(() => res(port));
    });
  });
}

// Resolve a usable BASE_URL. Returns true when the live server is reachable
// and audit can proceed; false when the audit should be reported as
// "skipped — no live server" (sandbox, missing DATABASE_URL, slow boot).
async function ensureLiveServer() {
  if (BASE_URL) {
    const ok = await waitFor200(`${BASE_URL}/sitemap.xml`, 5000);
    if (!ok) {
      warnings.push(`BASE_URL=${BASE_URL} provided but /sitemap.xml is not reachable — skipping live audit.`);
      return false;
    }
    return true;
  }
  const probe = "http://localhost:5000";
  if (await waitFor200(`${probe}/sitemap.xml`, 1500)) {
    BASE_URL = probe;
    return true;
  }
  if (!process.env.DATABASE_URL) {
    warnings.push("DATABASE_URL not set — skipping live audit (no server to spawn).");
    return false;
  }
  const port = await pickFreePort();
  spawnedServer = spawn(
    process.execPath,
    [pathResolve(ROOT, "node_modules/tsx/dist/cli.mjs"), pathResolve(ROOT, "server/index.ts")],
    {
      cwd: ROOT,
      env: { ...process.env, PORT: String(port), NODE_ENV: "development" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  spawnedServer.stdout?.on("data", () => {});
  spawnedServer.stderr?.on("data", () => {});
  BASE_URL = `http://localhost:${port}`;
  const ok = await waitFor200(`${BASE_URL}/sitemap.xml`, SERVER_READY_TIMEOUT_MS);
  if (!ok) {
    stopLiveServer();
    warnings.push(`Temp server on ${BASE_URL} did not serve /sitemap.xml within ${SERVER_READY_TIMEOUT_MS}ms — skipping live audit.`);
    return false;
  }
  return true;
}

function stopLiveServer() {
  if (!spawnedServer) return;
  try { spawnedServer.kill("SIGTERM"); } catch { /* best-effort */ }
  spawnedServer = null;
}

// ─── Audit steps ───────────────────────────────────────────────────────────

function assertSitemapContentType(path, contentType) {
  const ct = (contentType || "").toLowerCase();
  if (!SITEMAP_CT_PREFIXES.some((prefix) => ct.startsWith(prefix))) {
    errors.push(
      `sitemap ${path}: Content-Type "${contentType || "(missing)"}" is not one of ` +
      `${SITEMAP_CT_PREFIXES.join(" / ")}`,
    );
  }
}

async function checkSitemapIndex() {
  const r = await fetchText(SITEMAP_INDEX);
  stats.sitemaps[SITEMAP_INDEX] = { status: r.status, contentType: r.contentType };
  if (r.status !== 200) {
    errors.push(`sitemap-index ${SITEMAP_INDEX}: HTTP ${r.status}`);
    return;
  }
  assertSitemapContentType(SITEMAP_INDEX, r.contentType);
  if (!/<sitemapindex/.test(r.body)) {
    errors.push(`sitemap-index ${SITEMAP_INDEX}: not a <sitemapindex>`);
  }
  for (const child of CHILD_SITEMAPS) {
    if (!r.body.includes(`${SITE_HOST}${child}`)) {
      errors.push(`sitemap-index: missing child ${child}`);
    }
  }
}

async function checkChildSitemap(path) {
  const r = await fetchText(path);
  stats.sitemaps[path] = { status: r.status, contentType: r.contentType, urlCount: 0 };
  if (r.status !== 200) {
    errors.push(`sitemap ${path}: HTTP ${r.status}`);
    return [];
  }
  assertSitemapContentType(path, r.contentType);
  const urls = parseUrls(r.body);
  stats.sitemaps[path].urlCount = urls.length;
  if (urls.length === 0) {
    errors.push(`sitemap ${path}: returned 0 <url> entries`);
  }
  return urls;
}

// Pick a stable, runtime-derived blog post URL so the per-route header
// audit always probes a real /{lang}/blog/{slug} entry that currently
// exists in the catalog. Prefers an /en/ post for stability across
// translations; falls back to any localised blog post in the sitemap.
function pickBlogProbeFrom(urls) {
  const langPrefer = ["en", "es", "fr", "de", "pt", "ca"];
  for (const lang of langPrefer) {
    const re = new RegExp(`/${lang}/blog/[^/]+$`);
    const match = urls
      .map((u) => u.loc)
      .filter(Boolean)
      .find((loc) => re.test(loc));
    if (match) {
      try {
        const path = new URL(match).pathname;
        return { path, kind: "blog", expect: "public" };
      } catch {
        return null;
      }
    }
  }
  return null;
}

async function checkRouteHeaders(probe) {
  let res;
  try {
    res = await fetchHeaders(probe.path);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(`headers ${probe.path}: fetch failed (${msg})`);
    stats.routes.push({ ...probe, status: 0, xRobotsTag: "", linkHasCanonical: false, error: msg });
    return;
  }
  const linkHasCanonical = /rel="canonical"/i.test(res.linkHeader);
  stats.routes.push({
    ...probe,
    status: res.status,
    xRobotsTag: res.xRobotsTag,
    linkHasCanonical,
  });
  stats.routeFamilies[probe.kind] = (stats.routeFamilies[probe.kind] || 0) + 1;
  errors.push(...validateHeaderRoute(
    { path: probe.path, status: res.status, xRobotsTag: res.xRobotsTag, linkHeader: res.linkHeader },
    { expect: probe.expect },
  ));
}

async function checkRobotsTxt() {
  const r = await fetchText("/robots.txt");
  stats.robots = {
    status: r.status,
    contentType: r.contentType,
    cacheControl: r.cacheControl,
    bytes: r.body.length,
  };
  if (r.status !== 200) errors.push(`robots.txt: HTTP ${r.status}`);
  if (!/^text\/plain/i.test(r.contentType)) {
    errors.push(`robots.txt: Content-Type "${r.contentType}" does not start with text/plain`);
  }
  if (!r.cacheControl.trim()) {
    errors.push(`robots.txt: missing Cache-Control header`);
  }
  // Sanity — body must advertise the canonical sitemap entry.
  if (r.status === 200 && !r.body.includes(`${SITE_HOST}/sitemap.xml`)) {
    errors.push(`robots.txt: body does not advertise ${SITE_HOST}/sitemap.xml`);
  }
}

// ─── Discord notification ──────────────────────────────────────────────────
//
// Intentionally mirrors the embed shape produced by `notifySeoIndexing()`
// (server/discord.ts) so an operator sees the same look-and-feel for both
// runtime sitemap pings and post-deploy audits:
//   - title prefixed with [ERROR] / [AVISO] / [INFO] (Criticality)
//   - description = summary
//   - color EXENTAX_NEON (0x00E510)
//   - fields: Severity, Origin, Status, …caller fields, Logged at
//   - footer = Madrid timestamp + Exentax avatar
//
// The token is sent via the Exentax bot REST API (no webhooks). Failure
// to post is logged but never propagated — the audit's primary signal is
// the report on disk + the script exit code.

const EXENTAX_NEON = 0x00e510;
const EXENTAX_AVATAR_URL = "https://exentax.com/ex-icon-green.png";

const CRITICALITY_PREFIX = {
  info:    "[INFO]",
  warning: "[AVISO]",
  error:   "[ERROR]",
};

const CRITICALITY_LABEL = {
  info: "Info",
  warning: "Warning",
  error: "Error",
};

function madridTimestamp() {
  const fmt = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

function envOrEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function truncate(s, max) {
  if (!s) return s;
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

// Pure function that maps an envelope to the exact Discord embed payload
// posted by `postEmbedToDiscord`. Extracted so a self-test can lock the
// shape (title prefix, color, footer, severity field) in place against
// `notifySeoIndexing()` in server/discord.ts. The runtime POST and the
// dynamic `timestamp` are intentionally excluded from the embed produced
// here so the helper stays deterministic and unit-testable.
function buildDiscordEmbed(envelope) {
  const prefix = CRITICALITY_PREFIX[envelope.criticality];
  const title = envelope.title.startsWith(prefix) ? envelope.title : `${prefix} ${envelope.title}`;
  const fields = [
    { name: "Type",     value: "seo_indexing", inline: true },
    { name: "Severity", value: CRITICALITY_LABEL[envelope.criticality], inline: true },
    { name: "Origin",   value: envelope.origin, inline: true },
    { name: "Status",   value: envelope.status.toUpperCase(), inline: true },
    ...envelope.fields.filter((f) => (f.value ?? "").toString().trim().length > 0).map((f) => ({
      name: f.name,
      value: truncate(String(f.value), 1000),
      inline: f.inline ?? true,
    })),
    { name: "Logged at", value: madridTimestamp(), inline: false },
  ];
  return {
    title: truncate(title, 256),
    description: truncate(envelope.description || "", 3800),
    color: EXENTAX_NEON,
    fields,
    footer: { text: madridTimestamp(), icon_url: EXENTAX_AVATAR_URL },
  };
}

async function postEmbedToDiscord(envelope) {
  const token = envOrEmpty("DISCORD_BOT_TOKEN");
  const channelId = envOrEmpty("DISCORD_CHANNEL_ERRORES") || envOrEmpty("DISCORD_CHANNEL_REGISTROS");
  if (!token || !channelId) {
    console.warn("[seo-live-audit] DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ERRORES missing — Discord notification skipped.");
    return;
  }
  const embed = {
    ...buildDiscordEmbed(envelope),
    timestamp: new Date().toISOString(),
  };
  try {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${token}`,
        "User-Agent": "Exentax SEO Live-Audit Notifier (https://exentax.com, 1.0)",
      },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[seo-live-audit] Discord API ${res.status}: ${truncate(body, 400)}`);
      return;
    }
    console.log(`[seo-live-audit] Discord notification posted (${envelope.status}).`);
  } catch (e) {
    console.warn(`[seo-live-audit] Failed to post Discord notification: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ─── Reports ───────────────────────────────────────────────────────────────

function writeReports() {
  mkdirSync(REPORT_DIR, { recursive: true });
  stats.finishedAt = new Date().toISOString();
  stats.ok = errors.length === 0;
  stats.baseUrl = BASE_URL;
  const json = { ...stats, warnings, errors };
  writeFileSync(JSON_REPORT, JSON.stringify(json, null, 2));
  const md = [
    "# SEO live-audit report (Task #42)",
    "",
    `Generated: ${stats.finishedAt}`,
    `Base URL:  ${BASE_URL || "(none — skipped)"}`,
    `Result:    ${stats.ok ? "PASS" : "FAIL"}  (errors=${errors.length}, warnings=${warnings.length})`,
    "",
    "## Sitemaps",
    "",
    "| Endpoint | Status | Content-Type | URLs |",
    "|---|---:|---|---:|",
    ...ALL_SITEMAPS.map((p) => {
      const s = stats.sitemaps[p];
      if (!s) return `| ${p} | — | — | — |`;
      return `| ${p} | ${s.status} | \`${s.contentType || "—"}\` | ${s.urlCount ?? "—"} |`;
    }),
    "",
    `Total URLs across child sitemaps: **${stats.totals.urls}**, alternate-groups: **${stats.totals.groups}**, reciprocity failures: **${stats.totals.reciprocityFailures}**.`,
    "",
    "## Route headers",
    "",
    "| Path | Family | Expect | Status | X-Robots-Tag | rel=canonical |",
    "|---|---|---|---:|---|:---:|",
    ...stats.routes.map((r) => `| ${r.path} | ${r.kind} | ${r.expect} | ${r.status || "—"} | \`${r.xRobotsTag || "—"}\` | ${r.linkHasCanonical ? "yes" : (r.expect === "public" ? "no" : "n/a")} |`),
    "",
    "## /robots.txt",
    "",
    `- HTTP status: ${stats.robots.status ?? "—"}`,
    `- Content-Type: \`${stats.robots.contentType || "—"}\``,
    `- Cache-Control: \`${stats.robots.cacheControl || "—"}\``,
    `- Bytes: ${stats.robots.bytes ?? "—"}`,
    "",
    warnings.length ? "## Warnings\n\n" + warnings.map((w) => `- ${w}`).join("\n") + "\n" : "",
    errors.length ? "## Errors\n\n" + errors.map((e) => `- ${e}`).join("\n") + "\n" : "",
  ].filter(Boolean).join("\n");
  writeFileSync(MD_REPORT, md);
}

// Pure mapping from (BASE_URL, errors, warnings, stats) → envelope. Accepts
// an optional `ctx` so the self-test in tests/seo-live-audit.test.mjs can
// drive each result class (skipped / ok / failed) deterministically without
// touching module-level state. Defaults read live module state at call
// time so the production caller (`main()`) is unchanged.
function buildDiscordEnvelopeForResult(ctx) {
  const baseUrl = ctx?.baseUrl ?? BASE_URL;
  const errs    = ctx?.errors  ?? errors;
  const warns   = ctx?.warnings ?? warnings;
  const st      = ctx?.stats   ?? stats;
  if (!baseUrl) {
    return {
      criticality: "warning",
      status: "skipped",
      origin: "seo-live-audit",
      title: "SEO live-audit — omitido",
      description: warns[0] || "No live server reachable; audit skipped.",
      fields: [
        { name: "Warnings", value: String(warns.length), inline: true },
      ],
    };
  }
  if (errs.length === 0) {
    const totalSitemapsOk = ALL_SITEMAPS.filter((p) => st.sitemaps[p]?.status === 200).length;
    return {
      criticality: "info",
      status: "ok",
      origin: "seo-live-audit",
      title: "SEO live-audit — OK",
      description: "Sitemaps, hreflang reciprocity, route headers and robots.txt are all in order.",
      fields: [
        { name: "Base URL",     value: baseUrl, inline: false },
        { name: "Sitemaps OK",  value: `${totalSitemapsOk}/${ALL_SITEMAPS.length}`, inline: true },
        { name: "URLs",         value: String(st.totals.urls), inline: true },
        { name: "Groups",       value: String(st.totals.groups), inline: true },
        { name: "Routes probed",value: String(st.routes.length), inline: true },
      ],
    };
  }
  return {
    criticality: "error",
    status: "failed",
    origin: "seo-live-audit",
    title: "SEO live-audit — fallo",
    description: `Detected ${errs.length} regression(s). First few:\n` +
      errs.slice(0, 5).map((e) => `• ${e}`).join("\n"),
    fields: [
      { name: "Base URL",       value: baseUrl, inline: false },
      { name: "Errors",         value: String(errs.length), inline: true },
      { name: "URLs",           value: String(st.totals.urls), inline: true },
      { name: "Reciprocity",    value: st.totals.reciprocityFailures > 0 ? `${st.totals.reciprocityFailures} failure(s)` : "OK", inline: true },
      { name: "Sitemaps OK",    value: `${ALL_SITEMAPS.filter((p) => st.sitemaps[p]?.status === 200).length}/${ALL_SITEMAPS.length}`, inline: true },
      { name: "Report (JSON)",  value: pathRelativeFromRoot(JSON_REPORT), inline: false },
      { name: "Report (MD)",    value: pathRelativeFromRoot(MD_REPORT),  inline: false },
    ],
  };
}

function pathRelativeFromRoot(p) {
  const rel = p.startsWith(ROOT) ? p.slice(ROOT.length).replace(/^[\\/]/, "") : p;
  return `\`${rel}\``;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  if (SKIP_LIVE) {
    warnings.push("SEO_LIVE_AUDIT_SKIP=1 — live audit skipped by env flag.");
    writeReports();
    console.log("[seo-live-audit] skipped via SEO_LIVE_AUDIT_SKIP=1");
    return 0;
  }
  let live = false;
  try {
    live = await ensureLiveServer();
    if (live) {
      await checkSitemapIndex();
      const allUrls = [];
      let blogUrls = [];
      for (const child of CHILD_SITEMAPS) {
        const urls = await checkChildSitemap(child);
        if (child === "/sitemap-blog.xml") blogUrls = urls;
        allUrls.push(...urls);
      }
      stats.totals.urls = allUrls.length;
      const recip = computeReciprocity(allUrls, HREFLANGS);
      stats.totals.groups = recip.groups.size;
      stats.totals.reciprocityFailures = recip.errors.length;
      // Surface every reciprocity failure (the post-deploy alert needs to
      // catch the first regression, not just the count).
      errors.push(...recip.errors);

      // Build the final probe list: static routes + a runtime-derived blog
      // post so the per-route-family audit covers blog entries too. If the
      // blog sitemap returned no usable URL the blog family is recorded
      // as a soft warning (the missing/empty blog sitemap is already a
      // hard error from `checkChildSitemap`).
      const probes = [...STATIC_ROUTE_PROBES];
      const blogProbe = pickBlogProbeFrom(blogUrls);
      if (blogProbe) {
        probes.push(blogProbe);
      } else {
        warnings.push("Could not derive a blog post probe from /sitemap-blog.xml — blog header family not exercised this run.");
      }
      for (const probe of probes) await checkRouteHeaders(probe);
      await checkRobotsTxt();
    }
  } finally {
    stopLiveServer();
  }

  writeReports();

  const envelope = buildDiscordEnvelopeForResult();
  const shouldNotify =
    envelope.criticality !== "info" ||
    envOrEmpty("SEO_LIVE_AUDIT_NOTIFY_OK") === "1";
  if (shouldNotify) await postEmbedToDiscord(envelope);

  if (!live) {
    // Skipped audit: not a failure, but communicate clearly.
    console.warn(`[seo-live-audit] SKIPPED — ${warnings[warnings.length - 1] || "no live server"}`);
    return 0;
  }
  if (errors.length === 0) {
    console.log(
      `[seo-live-audit] OK — ${stats.totals.urls} URLs, ${stats.totals.groups} alternate-group(s), ` +
      `${stats.routes.length} route(s) probed. Report → ${pathRelativeFromRoot(MD_REPORT)}`,
    );
    return 0;
  }
  console.error(`[seo-live-audit] FAIL — ${errors.length} error(s):`);
  for (const e of errors.slice(0, 25)) console.error(`  - ${e}`);
  if (errors.length > 25) console.error(`  …and ${errors.length - 25} more (see ${MD_REPORT})`);
  return 1;
}

const isCli = (() => {
  try {
    const invoked = process.argv[1] && pathResolve(process.argv[1]);
    const here = fileURLToPath(import.meta.url);
    return invoked === here;
  } catch {
    return false;
  }
})();

if (isCli) {
  main()
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(`[seo-live-audit] fatal error: ${e instanceof Error ? e.message : String(e)}`);
      process.exit(2);
    });
}

export {
  main,
  buildDiscordEnvelopeForResult,
  buildDiscordEmbed,
  madridTimestamp,
  EXENTAX_NEON,
  EXENTAX_AVATAR_URL,
  CRITICALITY_PREFIX,
  CRITICALITY_LABEL,
};
