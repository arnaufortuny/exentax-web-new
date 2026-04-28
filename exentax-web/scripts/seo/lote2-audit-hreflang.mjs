#!/usr/bin/env node
/*
 * lote2-audit-hreflang.mjs
 * ----------------------------------------------------------------------------
 * Task #5 (LOTE 2). Audit the hreflang matrix in every sitemap entry:
 *   1. Each <url> declares 6 BCP-47 alternates + x-default
 *   2. Cross-link reciprocity: if A lists B, B must list A
 *   3. x-default points to the ES URL
 *   4. Every alternate URL appears as its own <loc>
 *
 * Output: reports/seo/lote2-hreflang.json (machine-readable summary that
 * lote2-summary.md will reference).
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
const REQUIRED_TAGS = new Set(Object.values(HREFLANG_BCP47));

function localUrl(prodUrl) {
  return prodUrl.startsWith(PROD_URL) ? BASE_URL + prodUrl.slice(PROD_URL.length) : prodUrl;
}

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.text();
}

function parseUrls(xml) {
  const urls = [];
  const reBlock = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = reBlock.exec(xml))) {
    const body = m[1];
    const loc = (body.match(/<loc>([^<]+)<\/loc>/) || [])[1]?.trim();
    if (!loc) continue;
    const alts = [];
    const reAlt = /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/>/g;
    let am;
    while ((am = reAlt.exec(body))) alts.push({ hreflang: am[1], href: am[2] });
    urls.push({ loc, alts });
  }
  return urls;
}

async function main() {
  const children = ["sitemap-pages.xml", "sitemap-blog.xml", "sitemap-faq.xml"];
  const all = [];
  for (const c of children) {
    const xml = await fetchText(`${BASE_URL}/${c}`);
    const us = parseUrls(xml);
    console.log(`[hreflang] ${c}: ${us.length} <url>`);
    all.push(...us.map((u) => ({ ...u, sitemap: c })));
  }
  console.log(`[hreflang] total ${all.length} <url> entries`);

  const issues = [];
  const locSet = new Set(all.map((u) => u.loc));

  for (const u of all) {
    const tagsPresent = new Set();
    let xDefault = null;
    for (const a of u.alts) {
      if (a.hreflang === "x-default") xDefault = a.href;
      else tagsPresent.add(a.hreflang);
    }
    for (const req of REQUIRED_TAGS) {
      if (!tagsPresent.has(req)) issues.push({ kind: "missing-bcp47", loc: u.loc, missing: req });
    }
    for (const tag of tagsPresent) {
      if (!REQUIRED_TAGS.has(tag)) issues.push({ kind: "unexpected-bcp47", loc: u.loc, tag });
    }
    if (!xDefault) issues.push({ kind: "missing-x-default", loc: u.loc });
    else {
      // x-default must point at the ES variant. Two forms are accepted:
      //   1. The site root: `https://exentax.com` (or trailing slash) — only
      //      valid for the home <url> whose own loc is the bare host.
      //   2. Any URL whose pathname begins with `/es/` (or is exactly `/es`).
      let path = "";
      try { path = new URL(xDefault).pathname; } catch { path = xDefault; }
      let locPath = "";
      try { locPath = new URL(u.loc).pathname; } catch { locPath = u.loc; }
      const isRoot = path === "" || path === "/";
      const locIsHome = locPath === "" || locPath === "/";
      const isEs = path === "/es" || path.startsWith("/es/");
      if (isRoot && !locIsHome) {
        // Root x-default is only legal on the home <url>. Anywhere else
        // it would send Google off-context and undermines the audit, so
        // flag it as a hard issue.
        issues.push({ kind: "x-default-root-on-non-home", loc: u.loc, xDefault });
      } else if (!isRoot && !isEs) {
        issues.push({ kind: "x-default-not-es", loc: u.loc, xDefault });
      }
    }
  }

  // Reciprocity within each <url>'s alternate group.
  // Build groups keyed by alternate-set (sorted hrefs minus x-default).
  for (const u of all) {
    const peers = u.alts.filter((a) => a.hreflang !== "x-default").map((a) => a.href);
    for (const peer of peers) {
      // peer URL must also exist as <loc> in some sitemap
      if (!locSet.has(peer)) {
        // Allowed: blog ES-fallback peers in posts that haven't been translated yet.
        // The fallback href is always the ES version which IS in the sitemap, so
        // a missing-loc here is a real bug.
        issues.push({ kind: "alt-not-in-sitemap", loc: u.loc, alt: peer });
        continue;
      }
      // Find peer entry; check it lists `loc` back as one of its alternates.
      const peerEntry = all.find((x) => x.loc === peer);
      if (!peerEntry) continue;
      const peerHrefs = peerEntry.alts.filter((a) => a.hreflang !== "x-default").map((a) => a.href);
      if (!peerHrefs.includes(u.loc)) {
        // Fallback case: peer might be ES and `u` is a non-translated lang
        // pointing to ES; ES wouldn't list `u` because `u` doesn't exist
        // as a separate entry. But `u` IS a separate <loc>, so this should
        // always reciprocate. Treat as issue.
        issues.push({ kind: "non-reciprocal", loc: u.loc, peer });
      }
    }
  }

  const grouped = {};
  for (const i of issues) (grouped[i.kind] ||= []).push(i);
  const summary = { total: all.length, issues: issues.length };
  for (const [k, v] of Object.entries(grouped)) summary[k] = v.length;
  console.log("[hreflang] summary:", summary);

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(
    pathResolve(REPORTS_DIR, "lote2-hreflang.json"),
    JSON.stringify({ baseUrl: BASE_URL, summary, issues }, null, 2),
  );
  console.log(`[hreflang] report → reports/seo/lote2-hreflang.json`);
  // Fail-fast — the audit must be a real CI gate, not a silent report.
  if (issues.length > 0) {
    console.error(`[hreflang] FAIL: ${issues.length} issue(s) detected`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[hreflang] crashed:", err?.stack || err);
  process.exit(1);
});
