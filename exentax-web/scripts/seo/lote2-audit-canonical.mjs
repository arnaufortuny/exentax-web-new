#!/usr/bin/env node
/*
 * lote2-audit-canonical.mjs
 * ----------------------------------------------------------------------------
 * Task #5 (LOTE 2). Audit <link rel="canonical"> + hreflang tags in the
 * server-rendered HTML for every URL in the sitemap. For each URL, assert:
 *   - exactly ONE <link rel="canonical"> tag (no duplicates)
 *   - canonical href === self URL (production)
 *   - exactly 6 BCP-47 hreflang <link> tags + 1 x-default in <head>
 *   - per-language href maps to the correct localized URL family:
 *       * the alternate hreflang="<bcp47>" must point at the lang prefix
 *         that matches the BCP-47 lang code (es-ES → /es/..., en-US → /en/...)
 *       * the alternate URL must equal the canonical URL of the alternate page
 *         when fetched (HTML-level bidirectional reciprocity)
 *   - x-default href === ES alternate href
 *
 * Output: reports/seo/lote2-canonical.json
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
const HREFLANG_BCP47 = {
  es: "es-ES", en: "en-US", fr: "fr-FR",
  de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};
const BCP47_TO_LANG = Object.fromEntries(Object.entries(HREFLANG_BCP47).map(([k, v]) => [v, k]));
const REQUIRED_TAGS = new Set(Object.values(HREFLANG_BCP47));
const CONCURRENCY = Number(process.env.LOTE2_CONCURRENCY || 8);

function localUrl(prodUrl) {
  return prodUrl.startsWith(PROD_URL) ? BASE_URL + prodUrl.slice(PROD_URL.length) : prodUrl;
}

async function fetchText(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ExentaxLote2/1.0)",
      "Accept": "text/html",
    },
  });
  const body = await r.text();
  return { status: r.status, body };
}

function extractHead(html) {
  const m = html.match(/<head>([\s\S]*?)<\/head>/i);
  return m ? m[1] : "";
}

function findCanonicals(head) {
  const out = [];
  const re = /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi;
  let m;
  while ((m = re.exec(head))) {
    const href = m[0].match(/href=["']([^"']+)["']/i);
    out.push(href ? href[1] : null);
  }
  return out;
}

function findHreflangs(head) {
  const out = [];
  const re = /<link\s+[^>]*rel=["']alternate["'][^>]*>/gi;
  let m;
  while ((m = re.exec(head))) {
    const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
    const hl = m[0].match(/hreflang=["']([^"']+)["']/i)?.[1];
    if (href && hl) out.push({ hreflang: hl, href });
  }
  return out;
}

function langPrefixMatches(bcp47, href) {
  const lang = BCP47_TO_LANG[bcp47];
  if (!lang) return false;
  try {
    const u = new URL(href);
    const seg = u.pathname.split("/")[1];
    return seg === lang;
  } catch { return false; }
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
  const children = ["sitemap-pages.xml", "sitemap-blog.xml", "sitemap-faq.xml"];
  const all = [];
  for (const c of children) {
    const xml = (await fetchText(`${BASE_URL}/${c}`)).body;
    all.push(...extractLocs(xml));
  }
  const allSet = new Set(all);
  console.log(`[canonical] auditing ${all.length} URLs`);

  // Phase 1 — for each URL, parse head and capture canonical + hreflang map.
  const headData = new Map();
  await pool(all, async (prodUrl) => {
    const local = localUrl(prodUrl);
    const r = await fetchText(local);
    if (r.status !== 200) {
      headData.set(prodUrl, { status: r.status, issues: [{ kind: "non-200" }] });
      return null;
    }
    const head = extractHead(r.body);
    if (!head) {
      headData.set(prodUrl, { status: r.status, issues: [{ kind: "no-head" }] });
      return null;
    }
    const canonicals = findCanonicals(head);
    const hreflangs = findHreflangs(head);
    const issues = [];
    if (canonicals.length === 0) issues.push({ kind: "missing-canonical" });
    else if (canonicals.length > 1) issues.push({ kind: "duplicate-canonical", count: canonicals.length });
    const canonical = canonicals[0] || null;
    if (canonical && canonical !== prodUrl) issues.push({ kind: "canonical-mismatch", expected: prodUrl, actual: canonical });
    const tags = new Map(); // bcp47 -> href
    let xDefault = null;
    let xDefaultCount = 0;
    for (const h of hreflangs) {
      if (h.hreflang === "x-default") { xDefault = h.href; xDefaultCount++; }
      else {
        if (tags.has(h.hreflang)) issues.push({ kind: "duplicate-hreflang", tag: h.hreflang });
        tags.set(h.hreflang, h.href);
      }
    }
    if (xDefaultCount > 1) issues.push({ kind: "duplicate-x-default", count: xDefaultCount });
    if (!xDefault) issues.push({ kind: "missing-x-default" });
    for (const req of REQUIRED_TAGS) {
      if (!tags.has(req)) issues.push({ kind: "missing-hreflang", missing: req });
    }
    for (const tag of tags.keys()) {
      if (!REQUIRED_TAGS.has(tag)) issues.push({ kind: "unexpected-hreflang", tag });
    }
    // Per-lang URL prefix correctness.
    for (const [tag, href] of tags) {
      if (!langPrefixMatches(tag, href)) {
        issues.push({ kind: "hreflang-lang-prefix-mismatch", tag, href });
      }
    }
    // x-default must equal the es-ES alternate.
    const esHref = tags.get("es-ES");
    if (xDefault && esHref && xDefault !== esHref) {
      issues.push({ kind: "x-default-not-es", xDefault, esHref });
    }
    // Every alternate (except fallback to ES used by un-translated blog
    // posts) must itself appear as a sitemap <loc>.
    for (const [tag, href] of tags) {
      if (!allSet.has(href) && href !== esHref) {
        issues.push({ kind: "alt-not-in-sitemap", tag, href });
      }
    }
    headData.set(prodUrl, { status: r.status, canonical, hreflangs: Object.fromEntries(tags), xDefault, issues });
    return null;
  }, CONCURRENCY);

  // Phase 2 — bidirectional reciprocity at HTML level: for each URL A and
  // each alternate href B (≠ self, ≠ ES fallback shared), B's HTML must
  // include an alternate that points back at A with the matching hreflang.
  const recipIssues = [];
  for (const [a, dataA] of headData) {
    if (!dataA?.hreflangs) continue;
    const aBcp = Object.entries(dataA.hreflangs).find(([, href]) => href === a)?.[0];
    if (!aBcp) {
      recipIssues.push({ url: a, kind: "self-not-in-hreflangs" });
      continue;
    }
    for (const [bTag, bHref] of Object.entries(dataA.hreflangs)) {
      if (bHref === a) continue;
      // Skip blog posts whose B is just the ES fallback (multiple non-ES
      // alternates intentionally collapse to /es/... when the post has no
      // translation yet). The fallback is detectable as: A and B share the
      // same href as some other alternate already-claimed for ES.
      if (bHref === dataA.hreflangs["es-ES"] && bTag !== "es-ES") continue;
      const dataB = headData.get(bHref);
      if (!dataB) {
        recipIssues.push({ url: a, kind: "alt-not-fetched", peer: bHref, peerTag: bTag });
        continue;
      }
      if (!dataB.hreflangs) continue;
      const bsAlts = dataB.hreflangs;
      if (bsAlts[aBcp] !== a) {
        recipIssues.push({
          url: a, kind: "non-reciprocal-html", peer: bHref, peerTag: bTag,
          expectedSelfTag: aBcp, peerSawForSelfTag: bsAlts[aBcp] || null,
        });
      }
    }
  }

  // Aggregate.
  const issues = [];
  let withIssues = 0;
  for (const [url, data] of headData) {
    if (data?.issues?.length) {
      withIssues++;
      for (const i of data.issues) issues.push({ url, ...i });
    }
  }
  for (const i of recipIssues) issues.push(i);
  const grouped = {};
  for (const i of issues) grouped[i.kind] = (grouped[i.kind] || 0) + 1;
  const summary = { total: all.length, withIssues, recipFailures: recipIssues.length, ...grouped };
  console.log("[canonical] summary:", summary);

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(
    pathResolve(REPORTS_DIR, "lote2-canonical.json"),
    JSON.stringify({ baseUrl: BASE_URL, summary, issues }, null, 2),
  );
  console.log(`[canonical] report → reports/seo/lote2-canonical.json`);
  if (issues.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[canonical] crashed:", err?.stack || err);
  process.exit(1);
});
