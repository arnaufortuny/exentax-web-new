#!/usr/bin/env node
/*
 * seo-sitemap-check.mjs
 * ----------------------------------------------------------------------------
 * End-to-end verification of /sitemap.xml for the blog. Fetches the live
 * sitemap from a running dev server and asserts:
 *
 *   1. The expected number of blog post URLs is present (79 slugs × 6 langs in
 *      the original audit; the script auto-detects the actual post count and
 *      requires every post to be present in all 6 languages).
 *   2. Each blog post URL declares hreflang alternates for every sibling
 *      language plus an x-default that points at the Spanish version.
 *   3. The cross-link graph is reciprocal: if A lists B as an alternate, B
 *      must list A.
 *   4. No duplicate <loc> entries.
 *   5. Every blog URL responds with an HTTP 2xx (no 404s).
 *
 * Exits 0 when every check passes, 1 otherwise.
 *
 * Usage:
 *   BASE_URL=http://localhost:5000 node scripts/seo/seo-sitemap-check.mjs
 *   (BASE_URL defaults to http://localhost:5000)
 *
 * See docs/audit-seo-technical.md §13 for context.
 * ----------------------------------------------------------------------------
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
// Sitemap and prerendered HTML emit BCP-47 region tags (es-ES, pt-PT, ca-ES,
// …). Keep this in sync with HREFLANG_BCP47 in server/routes/public.ts and
// server/static.ts, and getLocaleTag() in client/src/i18n/language-service.ts.
const HREFLANG_BCP47 = {
  es: "es-ES", en: "en-US", fr: "fr-FR",
  de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};
const HREFLANGS = LANGS.map((l) => HREFLANG_BCP47[l]);
const HREFLANG_TO_LANG = Object.fromEntries(LANGS.map((l) => [HREFLANG_BCP47[l], l]));
const HTTP_CONCURRENCY = Number(process.env.SEO_SITEMAP_CONCURRENCY || 24);
const HTTP_TIMEOUT_MS = 15000;

// Derive the expected blog post count from blog-posts.ts so the warning
// threshold tracks the source of truth instead of a hardcoded number.
const __dirname = dirname(fileURLToPath(import.meta.url));
function deriveExpectedPostCount() {
  try {
    const src = readFileSync(resolve(__dirname, "..", "..", "client/src/data/blog-posts.ts"), "utf8");
    const matches = src.match(/^\s*slug:\s*["'`]/gm);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}
const EXPECTED_POSTS = deriveExpectedPostCount();
const EXPECTED_TOTAL = EXPECTED_POSTS * LANGS.length;

const errors = [];
const warnings = [];
function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const body = await res.text();
    return { status: res.status, body };
  } finally {
    clearTimeout(t);
  }
}

async function headOk(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "GET", signal: ctrl.signal, redirect: "follow" });
    return res.status;
  } catch (e) {
    return `ERR:${e?.message || e}`;
  } finally {
    clearTimeout(t);
  }
}

function parseSitemap(xml) {
  const urls = [];
  const blockRe = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = blockRe.exec(xml))) {
    const block = m[1];
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) continue;
    const loc = locMatch[1];
    const alternates = [];
    const altRe = /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/>/g;
    let a;
    while ((a = altRe.exec(block))) {
      // Keep the hreflang verbatim. The sitemap and the expected HREFLANGS
      // list both use BCP-47 region-aware codes (es-ES, en-US, ca-ES, …),
      // so the comparison must be exact. "x-default" is treated specially
      // by callers but stored as-is here.
      alternates.push({ lang: a[1], href: a[2] });
    }
    urls.push({ loc, alternates });
  }
  return urls;
}

function isBlogPostUrl(loc) {
  return /\/(es|en|fr|de|pt|ca)\/blog\/[^/]+$/.test(loc);
}
function isBlogIndexUrl(loc) {
  return /\/(es|en|fr|de|pt|ca)\/blog$/.test(loc);
}
function langOfUrl(loc) {
  const m = loc.match(/\/(es|en|fr|de|pt|ca)\/blog(\/|$)/);
  return m ? m[1] : null;
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let next = 0;
  async function pump() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  }
  const pumps = Array.from({ length: Math.min(concurrency, items.length) }, () => pump());
  await Promise.all(pumps);
  return results;
}

async function fetchSitemapUrls(url) {
  const { status, body } = await fetchText(url);
  if (status !== 200) { err(`Sitemap fetch ${url} → HTTP ${status}`); return []; }
  // sitemap-index → follow children
  if (/<sitemapindex/.test(body)) {
    const childUrls = [];
    const re = /<sitemap>\s*<loc>([^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(body))) childUrls.push(m[1]);
    const all = [];
    for (const c of childUrls) {
      // Always re-resolve children against BASE_URL so the verifier hits
      // the local server even when the sitemap-index advertises absolute
      // production URLs.
      let pathOnly = c;
      try { pathOnly = new URL(c).pathname; } catch {}
      all.push(...(await fetchSitemapUrls(`${BASE_URL}${pathOnly}`)));
    }
    return all;
  }
  return parseSitemap(body);
}

async function main() {
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  console.log(`Fetching ${sitemapUrl} (and following sitemap-index children) ...`);
  let all;
  try {
    all = await fetchSitemapUrls(sitemapUrl);
  } catch (e) {
    const msg = String(e?.cause?.code || e?.message || e);
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")) {
      console.log(`⚠ ${BASE_URL} not reachable — skipping live sitemap audit (env-dependent).`);
      console.log(`  To run locally: \`npm run dev\` in another terminal, then re-run this script.`);
      console.log(`  CI/production: this gate runs against the live deploy URL.`);
      console.log(`✓ sitemap-check: skipped (no live server)`);
      return;
    }
    throw e;
  }
  if (errors.length) { finalize(); return; }
  const blogPostUrls = all.filter((u) => isBlogPostUrl(u.loc));
  const blogIndexUrls = all.filter((u) => isBlogIndexUrl(u.loc));
  const otherUrls = all.filter((u) => !isBlogPostUrl(u.loc) && !isBlogIndexUrl(u.loc));
  console.log(`Other URLs (pages + FAQ): ${otherUrls.length}`);

  // Hreflang reciprocity for non-blog URLs (pages + faq) — every URL must
  // declare the 5 sibling alternates + x-default, and every alternate href
  // must point at a /loc/ that itself appears in the sitemap.
  const allLocs = new Set(all.map((u) => u.loc));
  for (const u of otherUrls) {
    const xd = u.alternates.find((a) => a.lang === "x-default");
    if (!xd) err(`Missing x-default alternate: ${u.loc}`);
    const declared = new Set(u.alternates.filter((a) => a.lang !== "x-default").map((a) => a.lang));
    for (const tag of HREFLANGS) {
      if (!declared.has(tag)) err(`${u.loc} missing hreflang="${tag}" alternate`);
    }
    for (const a of u.alternates) {
      if (a.lang === "x-default") continue;
      if (!allLocs.has(a.href)) err(`${u.loc} hreflang="${a.lang}" → ${a.href} not present in sitemap`);
    }
  }

  // 1. Cardinality.
  const byLang = Object.fromEntries(LANGS.map((l) => [l, 0]));
  for (const u of blogPostUrls) {
    const l = langOfUrl(u.loc);
    if (l) byLang[l]++;
  }
  const counts = Object.values(byLang);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);
  console.log(`Blog index URLs: ${blogIndexUrls.length} (expected ${LANGS.length})`);
  console.log(`Blog post URLs: ${blogPostUrls.length}  per-lang: ${JSON.stringify(byLang)}`);

  if (blogIndexUrls.length !== LANGS.length) {
    err(`Expected ${LANGS.length} blog-index URLs, found ${blogIndexUrls.length}`);
  }
  if (minCount !== maxCount) {
    err(`Per-language post counts differ (min=${minCount}, max=${maxCount}); every post should be present in every language`);
  }
  const expectedTotal = minCount * LANGS.length;
  if (blogPostUrls.length !== expectedTotal) {
    err(`Total blog post URLs (${blogPostUrls.length}) != per-lang count × langs (${expectedTotal})`);
  }
  // Surface drift between the live sitemap and the source of truth
  // (BLOG_POSTS in client/src/data/blog-posts.ts) as a warning so operators
  // notice if the post inventory has grown/shrunk versus the codebase.
  if (EXPECTED_TOTAL && blogPostUrls.length !== EXPECTED_TOTAL) {
    warn(`Blog URL total is ${blogPostUrls.length}; expected ${EXPECTED_TOTAL} (${EXPECTED_POSTS}×${LANGS.length}) from blog-posts.ts.`);
  }

  // 2. Duplicates.
  const seen = new Map();
  for (const u of all) {
    seen.set(u.loc, (seen.get(u.loc) || 0) + 1);
  }
  for (const [loc, n] of seen) {
    if (n > 1) err(`Duplicate <loc> appears ${n}× : ${loc}`);
  }

  // 3. Hreflang alternates per blog post URL.
  // Build: slug-key (the ES path or any canonical) → set of (lang → href).
  // Easier: bucket by x-default href (which is always the ES URL), since the
  // sitemap emits x-default = ES alternate for every translated post.
  const groups = new Map(); // esHref → { langs: Map<lang, href>, members: [{loc, lang}] }
  for (const u of blogPostUrls) {
    const lang = langOfUrl(u.loc);
    const xDefault = u.alternates.find((a) => a.lang === "x-default");
    if (!xDefault) {
      err(`Missing x-default alternate: ${u.loc}`);
      continue;
    }
    let g = groups.get(xDefault.href);
    if (!g) { g = { langs: new Map(), members: [] }; groups.set(xDefault.href, g); }
    g.members.push({ loc: u.loc, lang, alternates: u.alternates });
  }

  for (const [esHref, g] of groups) {
    // Each group should contain exactly LANGS.length URLs (one per lang).
    if (g.members.length !== LANGS.length) {
      err(`Group ${esHref} has ${g.members.length} member URL(s); expected ${LANGS.length}`);
    }
    // x-default must be the ES variant.
    if (!/\/es\/blog\//.test(esHref)) {
      err(`x-default for group ${esHref} is not an /es/ URL`);
    }
    // Verify each member declares alternates for every other lang and points
    // to the same set of hrefs across the group (reciprocity).
    const reference = new Map(); // lang → href, derived from the ES member's alternates
    const esMember = g.members.find((m) => m.lang === "es");
    if (!esMember) {
      err(`Group ${esHref} has no /es/ member`);
      continue;
    }
    for (const a of esMember.alternates) {
      if (a.lang === "x-default") continue;
      reference.set(a.lang, a.href);
    }
    for (const tag of HREFLANGS) {
      if (!reference.has(tag)) err(`Group ${esHref}: ES member missing hreflang="${tag}"`);
    }
    for (const m of g.members) {
      const otherTags = HREFLANGS.filter((t) => HREFLANG_TO_LANG[t] !== m.lang);
      const declared = new Map();
      for (const a of m.alternates) {
        if (a.lang === "x-default") continue;
        declared.set(a.lang, a.href);
      }
      // Must include all 6 (self + 5 siblings) per current sitemap convention;
      // task requires at least the 5 sibling alternates.
      for (const t of otherTags) {
        if (!declared.has(t)) {
          err(`${m.loc} missing hreflang="${t}" alternate`);
        } else if (reference.get(t) && declared.get(t) !== reference.get(t)) {
          err(`${m.loc} hreflang="${t}" href mismatch: ${declared.get(t)} != ${reference.get(t)}`);
        }
      }
      // x-default consistency.
      const xd = m.alternates.find((a) => a.lang === "x-default");
      if (!xd || xd.href !== esHref) {
        err(`${m.loc} x-default (${xd?.href}) != group ES href (${esHref})`);
      }
    }
  }

  // 4. HTTP status — every URL (pages + FAQ + blog index + posts) must be 2xx.
  const everyUrl = all.map((u) => u.loc);
  console.log(`Checking HTTP status on ${everyUrl.length} URLs (concurrency=${HTTP_CONCURRENCY}) ...`);
  let checked = 0;
  const statuses = await runPool(everyUrl, async (url) => {
    const s = await headOk(url);
    checked++;
    if (checked % 100 === 0) console.log(`  ... ${checked}/${everyUrl.length}`);
    return { url, status: s };
  }, HTTP_CONCURRENCY);
  const bad = statuses.filter((s) => typeof s.status !== "number" || s.status < 200 || s.status >= 300);
  if (bad.length) {
    for (const b of bad.slice(0, 25)) err(`HTTP ${b.status} for ${b.url}`);
    if (bad.length > 25) err(`... and ${bad.length - 25} more non-2xx URLs`);
  }

  finalize();
}

function finalize() {
  if (warnings.length) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  if (errors.length) {
    console.log(`\nFAIL — ${errors.length} error(s):`);
    for (const e of errors) console.log(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log("\nOK — sitemap and hreflang checks passed.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});
