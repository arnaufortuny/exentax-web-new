#!/usr/bin/env node
/*
 * seo-cierre-audit.mjs
 * ----------------------------------------------------------------------------
 * Machine-verifiable closure audit for the SEO indexing layer (Tarea #24).
 *
 * Hits a running server and asserts the full surface described in
 * docs/audits/produccion-2026-04/06-seo-cierre.md:
 *
 *   1. /sitemap.xml is a valid sitemapindex with the 3 expected children.
 *   2. /sitemap-pages.xml, /sitemap-blog.xml, /sitemap-faq.xml return 200
 *      with the expected URL counts (or with the auto-detected counts when
 *      run before the catalog is finalised).
 *   3. Every <url> in every child sitemap declares:
 *        - 6 BCP-47 hreflang alternates (es-ES, en-US, fr-FR, de-DE, pt-PT,
 *          ca-ES),
 *        - a self-hreflang (alternate.href === <loc>),
 *        - x-default pointing at the Spanish canonical of the same group.
 *   4. Hreflang reciprocity across the whole sitemap (full bidirectional
 *      equivalence: each canonical group has exactly 6 members, each member
 *      lists the same 6 URLs, no fragmented mappings, no URL belongs to
 *      more than one group).
 *   5. Public localized routes (`/{lang}` and `/{lang}/blog/{slug}`) emit
 *      `X-Robots-Tag: index, follow, ...` and a `Link: rel=canonical`.
 *   6. Private surfaces (`/booking/*`, `/start`, `/thank-you`, `/links`,
 *      `/preview/*`, `/__mockup/*`) emit `X-Robots-Tag: noindex, nofollow`.
 *   7. /robots.txt advertises the 4 sitemaps, the AI-bot allow-list and the
 *      private-surface Disallow rules.
 *
 * Pure logic lives in `lib/cierre-audit-lib.mjs` and is unit-tested by
 * `tests/seo-cierre-audit.test.mjs` (failure cases included).
 *
 * Exits 0 when every check passes, 1 otherwise. Always writes a JSON +
 * Markdown report under reports/seo/seo-cierre-audit.{json,md} so CI and
 * the post-deploy hook can attach the diff.
 *
 * Usage:
 *   BASE_URL=http://localhost:5000 node scripts/seo/seo-cierre-audit.mjs
 *   (BASE_URL defaults to http://localhost:5000)
 * ----------------------------------------------------------------------------
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseUrls,
  validateUrlEntry,
  computeReciprocity,
  validateRobotsTxt,
  validateHeaderRoute,
} from "./lib/cierre-audit-lib.mjs";

const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const SITE_HOST = process.env.SITE_HOST || "https://exentax.com";
const HREFLANGS = ["es-ES", "en-US", "fr-FR", "de-DE", "pt-PT", "ca-ES"];
const SITEMAP_INDEX = "/sitemap.xml";
const CHILD_SITEMAPS = ["/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"];
const PUBLIC_PROBE_PATHS = [
  // One sample per locale home (covers the 6 hreflang families) +
  // a localized blog post + a localized FAQ route.
  "/es",
  "/en",
  "/fr",
  "/de",
  "/pt",
  "/ca",
  "/en/blog/quick-audit-of-your-llc-in-30-minutes-12-points-to-review",
  "/en/faq",
];
const PRIVATE_PROBE_PATHS = [
  "/booking/cita",
  "/start",
  "/thank-you",
  "/links",
  "/preview/test",
  "/__mockup/foo",
];
// Hard expected sitemap cardinalities (override per env to allow growth).
// Without these, the audit could report PASS on a materially smaller
// catalog because the structural checks alone would still hold.
const EXPECTED_COUNTS = {
  "/sitemap-pages.xml": Number(process.env.EXPECT_PAGES ?? 102),
  "/sitemap-blog.xml":  Number(process.env.EXPECT_BLOG  ?? 672),
  "/sitemap-faq.xml":   Number(process.env.EXPECT_FAQ   ??   6),
};
const EXPECTED_TOTAL = Number(process.env.EXPECT_TOTAL ?? 780);
const REQUIRED_SITEMAPS = [
  `${SITE_HOST}/sitemap.xml`,
  `${SITE_HOST}/sitemap-pages.xml`,
  `${SITE_HOST}/sitemap-blog.xml`,
  `${SITE_HOST}/sitemap-faq.xml`,
];
// Token names match the User-agent strings advertised by each crawler
// exactly (case-sensitive) — see AI_BOTS in server/routes/public.ts.
const REQUIRED_AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web",
  "anthropic-ai", "PerplexityBot", "Google-Extended", "Applebot-Extended",
  "CCBot",
];
const REQUIRED_DISALLOWS = [
  "/api/", "/internal/", "/booking/", "/start", "/links",
  "/thank-you", "/preview/", "/__mockup/",
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = resolve(__dirname, "..", "..", "reports", "seo");
const JSON_REPORT = resolve(REPORT_DIR, "seo-cierre-audit.json");
const MD_REPORT = resolve(REPORT_DIR, "seo-cierre-audit.md");

const errors = [];
const stats = {
  baseUrl: BASE_URL,
  startedAt: new Date().toISOString(),
  sitemaps: {},
  totals: { urls: 0, groups: 0, reciprocityFailures: 0 },
  routes: { public: [], private: [] },
  robots: { sitemapsFound: [], aiBotsFound: [], aiBotsAllowed: [], disallowsFound: [] },
};

async function fetchText(path) {
  const res = await fetch(BASE_URL + path);
  return { status: res.status, body: await res.text() };
}

async function checkSitemapIndex() {
  const { status, body } = await fetchText(SITEMAP_INDEX);
  stats.sitemaps[SITEMAP_INDEX] = { status, urlCount: null };
  if (status !== 200) { errors.push(`sitemap-index ${SITEMAP_INDEX}: HTTP ${status}`); return; }
  if (!/<sitemapindex/.test(body)) errors.push(`sitemap-index ${SITEMAP_INDEX}: not a <sitemapindex>`);
  for (const child of CHILD_SITEMAPS) {
    if (!body.includes(`${SITE_HOST}${child}`)) errors.push(`sitemap-index: missing child ${child}`);
  }
}

async function checkChildSitemap(path) {
  const { status, body } = await fetchText(path);
  stats.sitemaps[path] = { status, urlCount: 0, expected: EXPECTED_COUNTS[path] };
  if (status !== 200) { errors.push(`sitemap ${path}: HTTP ${status}`); return []; }
  const urls = parseUrls(body);
  stats.sitemaps[path].urlCount = urls.length;
  const expected = EXPECTED_COUNTS[path];
  if (expected !== undefined && urls.length !== expected) {
    errors.push(`sitemap ${path}: expected ${expected} URLs, got ${urls.length}`);
  }
  for (const u of urls) errors.push(...validateUrlEntry(u, HREFLANGS));
  return urls;
}

async function checkHeaderRoute(path, expect) {
  const res = await fetch(BASE_URL + path, { redirect: "manual" });
  const xRobotsTag = res.headers.get("x-robots-tag") || "";
  const linkHeader = res.headers.get("link") || "";
  const entry = {
    path, status: res.status, xRobotsTag,
    hasCanonical: /rel="canonical"/i.test(linkHeader),
  };
  errors.push(...validateHeaderRoute(
    { path, status: res.status, xRobotsTag, linkHeader },
    { expect },
  ));
  if (expect === "public") stats.routes.public.push(entry);
  else stats.routes.private.push(entry);
}

async function checkRobotsTxt() {
  const { status, body } = await fetchText("/robots.txt");
  if (status !== 200) { errors.push(`robots.txt: HTTP ${status}`); return; }
  const r = validateRobotsTxt(body, {
    sitemaps: REQUIRED_SITEMAPS,
    aiBots: REQUIRED_AI_BOTS,
    disallows: REQUIRED_DISALLOWS,
  });
  stats.robots.sitemapsFound = r.sitemapsFound;
  stats.robots.aiBotsFound = r.aiBotsFound;
  stats.robots.aiBotsAllowed = r.aiBotsAllowed;
  stats.robots.disallowsFound = r.disallowsFound;
  errors.push(...r.errors);
}

function writeReports() {
  mkdirSync(REPORT_DIR, { recursive: true });
  const finishedAt = new Date().toISOString();
  const json = { ...stats, finishedAt, ok: errors.length === 0, errors };
  writeFileSync(JSON_REPORT, JSON.stringify(json, null, 2));
  const md = [
    `# SEO closure audit (Tarea #24)`,
    ``,
    `Generated: ${finishedAt}`,
    `Base URL:  ${BASE_URL}`,
    `Result:    ${json.ok ? "✅ PASS" : "❌ FAIL"}  (errors=${errors.length})`,
    ``,
    `## Sitemaps`,
    ``,
    `| Endpoint | Status | URLs | Expected |`,
    `|---|---:|---:|---:|`,
    ...Object.entries(stats.sitemaps).map(([p, s]) => `| ${p} | ${s.status} | ${s.urlCount ?? "—"} | ${s.expected ?? "—"} |`),
    ``,
    `Total URLs: **${stats.totals.urls}** (expected **${stats.totals.expected}**), alternate-groups: **${stats.totals.groups}**, reciprocity failures: **${stats.totals.reciprocityFailures}**.`,
    ``,
    `## Header probes`,
    ``,
    `### Public (must be index, follow + rel=canonical)`,
    ``,
    `| Path | Status | X-Robots-Tag | rel=canonical |`,
    `|---|---:|---|:---:|`,
    ...stats.routes.public.map((r) => `| ${r.path} | ${r.status} | \`${r.xRobotsTag || "—"}\` | ${r.hasCanonical ? "✓" : "✗"} |`),
    ``,
    `### Private (must be noindex, nofollow)`,
    ``,
    `| Path | Status | X-Robots-Tag |`,
    `|---|---:|---|`,
    ...stats.routes.private.map((r) => `| ${r.path} | ${r.status} | \`${r.xRobotsTag || "—"}\` |`),
    ``,
    `## robots.txt`,
    ``,
    `- Sitemaps declared: ${stats.robots.sitemapsFound.length} (required: ${REQUIRED_SITEMAPS.length})`,
    `- AI bots declared: ${stats.robots.aiBotsFound.length}/${REQUIRED_AI_BOTS.length}`,
    `- AI bots with explicit \`Allow: /\`: ${stats.robots.aiBotsAllowed.length}/${REQUIRED_AI_BOTS.length}`,
    `- Disallow rules covered: ${REQUIRED_DISALLOWS.filter((d) => stats.robots.disallowsFound.includes(d)).length}/${REQUIRED_DISALLOWS.length}`,
    ``,
    errors.length ? `## Errors\n\n${errors.map((e) => `- ${e}`).join("\n")}\n` : "",
  ].filter(Boolean).join("\n");
  writeFileSync(MD_REPORT, md);
}

async function main() {
  await checkSitemapIndex();
  const allUrls = [];
  for (const child of CHILD_SITEMAPS) {
    const urls = await checkChildSitemap(child);
    allUrls.push(...urls);
  }
  stats.totals.urls = allUrls.length;
  stats.totals.expected = EXPECTED_TOTAL;
  if (allUrls.length !== EXPECTED_TOTAL) {
    errors.push(`sitemap totals: expected ${EXPECTED_TOTAL} URLs across all child sitemaps, got ${allUrls.length}`);
  }
  const recip = computeReciprocity(allUrls, HREFLANGS);
  stats.totals.groups = recip.groups.size;
  stats.totals.reciprocityFailures = recip.errors.length;
  errors.push(...recip.errors);
  for (const p of PUBLIC_PROBE_PATHS) await checkHeaderRoute(p, "public");
  for (const p of PRIVATE_PROBE_PATHS) await checkHeaderRoute(p, "private");
  await checkRobotsTxt();
  writeReports();

  const summary = `seo-cierre-audit: ${errors.length === 0 ? "PASS" : "FAIL"} ` +
    `(urls=${stats.totals.urls}, groups=${stats.totals.groups}, ` +
    `errors=${errors.length})`;
  if (errors.length === 0) {
    console.log(`✓ ${summary}`);
    console.log(`  Report → ${JSON_REPORT}`);
    process.exit(0);
  } else {
    console.error(`✗ ${summary}`);
    for (const e of errors.slice(0, 20)) console.error(`  - ${e}`);
    if (errors.length > 20) console.error(`  …and ${errors.length - 20} more (see ${MD_REPORT})`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`seo-cierre-audit: fatal error: ${e?.message || e}`);
  process.exit(2);
});
