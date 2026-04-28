#!/usr/bin/env node
/*
 * lote2-crawl-urls.mjs
 * ----------------------------------------------------------------------------
 * Task #5 (LOTE 2). Crawl every URL referenced in the live sitemap-index
 * and assert each responds 200. For each non-200, capture the path so it can
 * be fixed before the report is signed off.
 *
 * Output: reports/seo/lote2-urls-200.md (markdown table) +
 *         reports/seo/lote2-urls-200.json (machine-readable).
 *
 * Run against a local dev server:
 *     BASE_URL=http://localhost:5000 node scripts/seo/lote2-crawl-urls.mjs
 * ----------------------------------------------------------------------------
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = pathResolve(__dirname, "..", "..");
const REPORTS_DIR = pathResolve(ROOT, "reports", "seo");

const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const PROD_URL = "https://exentax.com";
const CONCURRENCY = Number(process.env.LOTE2_CONCURRENCY || 16);
const TIMEOUT_MS = 15000;

function localUrl(prodUrl) {
  return prodUrl.startsWith(PROD_URL) ? BASE_URL + prodUrl.slice(PROD_URL.length) : prodUrl;
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "manual" });
    const body = await res.text();
    return { status: res.status, body, location: res.headers.get("location") };
  } finally {
    clearTimeout(t);
  }
}

async function probeStatus(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "manual" });
    return { status: res.status, location: res.headers.get("location") };
  } catch (err) {
    return { status: 0, error: err?.message ?? String(err) };
  } finally {
    clearTimeout(t);
  }
}

function extractLocs(xml) {
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

async function pool(items, worker, n) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(new Array(n).fill(0).map(async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx], idx);
    }
  }));
  return results;
}

async function main() {
  console.log(`[lote2-crawl] base=${BASE_URL}`);
  const idx = await fetchText(`${BASE_URL}/sitemap.xml`);
  if (idx.status !== 200) throw new Error(`sitemap.xml returned ${idx.status}`);
  const childrenProd = extractLocs(idx.body);
  console.log(`[lote2-crawl] sitemap-index points to ${childrenProd.length} children`);

  const allProd = [];
  for (const child of childrenProd) {
    const local = localUrl(child);
    const r = await fetchText(local);
    if (r.status !== 200) throw new Error(`${child} -> ${r.status}`);
    const locs = extractLocs(r.body);
    console.log(`[lote2-crawl] ${child}: ${locs.length} <loc>`);
    allProd.push(...locs);
  }

  const unique = Array.from(new Set(allProd));
  console.log(`[lote2-crawl] total ${allProd.length} URLs (${unique.length} unique)`);

  const results = await pool(unique, async (url) => {
    const local = localUrl(url);
    const r = await probeStatus(local);
    return { url, status: r.status, location: r.location || null, error: r.error || null };
  }, CONCURRENCY);

  const counts = { ok: 0, fail: 0, redirect: 0 };
  const failures = [];
  const redirects = [];
  for (const r of results) {
    if (r.status === 200) counts.ok++;
    else if (r.status >= 300 && r.status < 400) { counts.redirect++; redirects.push(r); }
    else { counts.fail++; failures.push(r); }
  }
  console.log(`[lote2-crawl] OK=${counts.ok} REDIRECT=${counts.redirect} FAIL=${counts.fail}`);

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(
    pathResolve(REPORTS_DIR, "lote2-urls-200.json"),
    JSON.stringify({ baseUrl: BASE_URL, prodUrl: PROD_URL, total: unique.length, counts, results }, null, 2),
  );

  const md = [];
  md.push(`# LOTE 2 — URLs en sitemap (HTTP status)`);
  md.push("");
  md.push(`Generado: ${new Date().toISOString()}`);
  md.push(`Base local: ${BASE_URL}`);
  md.push(`URLs prod (sitemap): ${PROD_URL}`);
  md.push("");
  md.push(`## Resumen`);
  md.push("");
  md.push(`- Total URLs: **${unique.length}** (${allProd.length} antes de dedupe)`);
  md.push(`- HTTP 200: **${counts.ok}**`);
  md.push(`- 3xx (redirects): **${counts.redirect}**`);
  md.push(`- 4xx/5xx/0: **${counts.fail}**`);
  md.push("");
  if (failures.length > 0) {
    md.push(`## Fallos (NO 200)`);
    md.push("");
    md.push(`| status | URL | location | error |`);
    md.push(`| --- | --- | --- | --- |`);
    for (const f of failures) {
      md.push(`| ${f.status} | ${f.url} | ${f.location ?? ""} | ${f.error ?? ""} |`);
    }
    md.push("");
  }
  if (redirects.length > 0) {
    md.push(`## Redirects (3xx)`);
    md.push("");
    md.push(`| status | from | location |`);
    md.push(`| --- | --- | --- |`);
    for (const r of redirects) {
      md.push(`| ${r.status} | ${r.url} | ${r.location ?? ""} |`);
    }
    md.push("");
  }
  md.push(`## Por tipo`);
  md.push("");
  const byType = { pages: [], blogIndex: [], blogPosts: [], faq: [], other: [] };
  // FAQ slugs across all 6 locales (es/en/fr/de/pt/ca). Keep this list aligned
  // with the canonical FAQ paths emitted by getLocalizedPath("faq", lang).
  const FAQ_SLUGS = [
    "preguntas-frecuentes",   // es
    "faq",                    // en
    "questions-frequentes",   // fr
    "haufige-fragen",         // de
    "perguntas-frequentes",   // pt
    "preguntes-frequents",    // ca
  ];
  const FAQ_RE = new RegExp(`/(?:es|en|fr|de|pt|ca)/(?:${FAQ_SLUGS.join("|")})$`);
  for (const r of results) {
    if (/\/blog\/[^/]+$/.test(r.url)) byType.blogPosts.push(r);
    else if (/\/blog$/.test(r.url)) byType.blogIndex.push(r);
    else if (FAQ_RE.test(r.url)) byType.faq.push(r);
    else if (r.url === PROD_URL || /\/(es|en|fr|de|pt|ca)(\/|$)/.test(r.url.replace(PROD_URL, ""))) byType.pages.push(r);
    else byType.other.push(r);
  }
  for (const [k, list] of Object.entries(byType)) {
    const okN = list.filter((r) => r.status === 200).length;
    md.push(`- ${k}: ${list.length} (200 OK: ${okN})`);
  }
  md.push("");
  writeFileSync(pathResolve(REPORTS_DIR, "lote2-urls-200.md"), md.join("\n"));
  console.log(`[lote2-crawl] report → reports/seo/lote2-urls-200.md`);
  // Acceptance criteria: 780/780 must be 200. Anything else (3xx, 4xx, 5xx,
  // timeouts) breaks the gate so the report cannot silently miss a redirect.
  if (counts.ok !== unique.length) {
    console.error(`[lote2-crawl] FAIL: ${unique.length - counts.ok} URL(s) returned non-200 (${counts.redirect} redirects, ${counts.fail} failures)`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[lote2-crawl] crashed:", err?.stack || err);
  process.exit(1);
});
