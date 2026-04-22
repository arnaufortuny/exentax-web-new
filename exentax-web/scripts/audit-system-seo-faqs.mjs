#!/usr/bin/env node
/**
 * audit-system-seo-faqs.mjs
 * ----------------------------------------------------------------------------
 * Diagnostic audit (read-only) producing JSON reports under
 * docs/auditoria-sistema-seo-faqs/.
 *
 * Strategy: evidence-based whenever possible. The script:
 *   1. Fetches the live /sitemap*.xml and /robots.txt artifacts from a running
 *      server (BASE_URL, default http://localhost:5000) and parses them to
 *      enumerate the *real* URL surface — including blog URLs.
 *   2. Fetches the rendered HTML for each canonical page × language and parses
 *      <title>, meta description, canonical, hreflang, OG/Twitter, JSON-LD
 *      blocks (with @type) and visible H1 count.
 *   3. Cross-references the FAQ × language matrix against the parsed sitemap,
 *      robots.txt rules, rendered FAQPage JSON-LD and inbound internal-link
 *      counts.
 *   4. Performs source-level analysis (i18n parity, legal docs structure,
 *      duplicate components/configs) for static issues that don't need a
 *      running server.
 *
 * Every issue is emitted with `criticality`, `area`, `location`, `description`,
 * `evidence`, `suggestion`, AND `languages` (array — uses ["all"] when the
 * finding is language-agnostic).
 *
 * Outputs:
 *   docs/auditoria-sistema-seo-faqs/{sistema,documentos,seo,sitemap-completo,
 *   faqs,faqs-indexacion}.json + RESUMEN.md
 *
 * Exit code is always 0 — this is a diagnostic.
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildImportRegex } from "./lib/orphan-detect.mjs";
import {
  SPANISH_TELLS_BY_LANG,
  matchesSpanishTells,
  BLOG_FAQ_HEADINGS,
  extractBlogFaqQAs,
  findBlogFaqSpanishTells,
} from "./audit-system-seo-faqs.lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "auditoria-sistema-seo-faqs");
fs.mkdirSync(OUT, { recursive: true });

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const ALL_LANGS = ["all"];

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

function listFilesRec(dir, accept = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const p = path.join(cur, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".git", "dist", "build"].includes(entry.name)) continue;
        stack.push(p);
      } else if (accept(p)) {
        out.push(p);
      }
    }
  }
  return out;
}
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

// ---------------------------------------------------------------------------
// Helper: ensure every issue has the canonical schema before pushing it
// ---------------------------------------------------------------------------
function makeIssue({ criticality, area, location, description, evidence, suggestion, languages }) {
  return {
    criticality,
    area,
    location,
    description,
    evidence: evidence == null ? "" : (typeof evidence === "string" ? evidence : JSON.stringify(evidence)),
    suggestion,
    languages: Array.isArray(languages) && languages.length ? languages : ALL_LANGS,
  };
}

// ---------------------------------------------------------------------------
// Live fetchers
// ---------------------------------------------------------------------------
async function tryFetch(url, opts = {}) {
  try {
    const res = await fetch(url, { ...opts, redirect: "manual" });
    const text = await res.text();
    return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers), body: text };
  } catch (err) {
    return { ok: false, status: 0, headers: {}, body: "", error: String(err) };
  }
}

const liveAvailable = await (async () => {
  const r = await tryFetch(`${BASE_URL}/robots.txt`);
  return r.ok;
})();
console.log(`[live] ${BASE_URL} reachable: ${liveAvailable}`);

// ---------------------------------------------------------------------------
// Source-of-truth loader: import server/seo-content.ts via tsx so we evaluate
// what `injectMeta()` would actually emit — independent of whether the live
// server is dev (no SSR meta) or prod (build may not have all data).
// This is more reliable evidence than scraping unstable HTML.
// ---------------------------------------------------------------------------
function loadSeoContentSourceOfTruth() {
  const tmp = path.join(ROOT, ".audit-sot-out.json");
  const script = `
Promise.all([
  import("./server/seo-content.ts"),
  import("./server/faq-schema-i18n.ts"),
]).then(([m, faqI18n]) => {
  const { writeFileSync } = require("fs");
  writeFileSync(${JSON.stringify(tmp)}, JSON.stringify({
    PAGE_META: m.PAGE_META,
    PAGE_META_I18N: m.PAGE_META_I18N,
    FAQ_SCHEMA_ENTRIES: m.FAQ_SCHEMA_ENTRIES,
    FAQ_SCHEMA_ENTRIES_I18N: faqI18n.FAQ_SCHEMA_ENTRIES_I18N || null,
    PAGE_SCHEMAS_KEYS: Object.keys(m.PAGE_SCHEMAS || {}),
    PAGE_SCHEMAS_TYPES: Object.fromEntries(Object.entries(m.PAGE_SCHEMAS || {}).map(([k, arr]) => [k, (arr || []).map(s => s["@type"])])),
    PAGE_SEO_CONTENT_H1: Object.fromEntries(Object.entries(m.PAGE_SEO_CONTENT || {}).map(([k, html]) => [k, ((html || "").match(/<h1[^>]*>[\\s\\S]*?<\\/h1>/g) || []).length])),
    PAGE_SEO_CONTENT_I18N_H1: Object.fromEntries(Object.entries(m.PAGE_SEO_CONTENT_I18N || {}).map(([lang, bucket]) => [lang, Object.fromEntries(Object.entries(bucket || {}).map(([k, html]) => [k, ((html || "").match(/<h1[^>]*>[\\s\\S]*?<\\/h1>/g) || []).length]))])),
  }));
}).catch(e => { console.error(e); process.exit(1); });`.trim();
  const res = spawnSync("npx", ["--yes", "tsx", "-e", script], {
    cwd: ROOT, encoding: "utf8", timeout: 60000,
    env: { ...process.env, NODE_OPTIONS: "" },
  });
  if (res.status !== 0) {
    console.warn(`[sot] tsx import failed (status=${res.status}): ${res.stderr.slice(0, 300)}`);
    return null;
  }
  try {
    const data = JSON.parse(fs.readFileSync(tmp, "utf8"));
    fs.unlinkSync(tmp);
    return data;
  } catch (e) {
    console.warn(`[sot] failed to read sot output: ${e}`);
    return null;
  }
}
const SOT = loadSeoContentSourceOfTruth();
if (SOT) {
  console.log(`[sot] loaded source-of-truth: PAGE_META=${Object.keys(SOT.PAGE_META).length}, PAGE_META_I18N=${Object.keys(SOT.PAGE_META_I18N).length}, FAQ_SCHEMA_ENTRIES=${SOT.FAQ_SCHEMA_ENTRIES.length}`);
} else {
  console.warn(`[sot] WARNING: source-of-truth unavailable; SEO/FAQ-indexation will be limited to live HTML evidence`);
}
function sotMetaForPath(p) {
  if (!SOT) return null;
  // Prefer PAGE_META_I18N (richer, populated by buildI18nMeta with keywords
  // for every route × language) over the legacy PAGE_META (ES-anchored map
  // without keywords). Previously the legacy source shadowed the I18N one,
  // producing false-positive `keyword-map-partial` issues for ~11 ES routes
  // and ~6 routes per other language whose keywords were correctly declared
  // in PAGE_META_I18N but never surfaced by the audit.
  return SOT.PAGE_META_I18N[p] || SOT.PAGE_META[p] || null;
}
function sotSchemasForRouteKey(key) {
  if (!SOT) return [];
  return SOT.PAGE_SCHEMAS_TYPES?.[key] || [];
}
function sotH1CountFor(key, lang) {
  if (!SOT) return 0;
  const langBucket = SOT.PAGE_SEO_CONTENT_I18N_H1?.[lang];
  if (langBucket && typeof langBucket[key] === "number") return langBucket[key];
  return SOT.PAGE_SEO_CONTENT_H1?.[key] || 0;
}

// ---------------------------------------------------------------------------
// Source-of-truth parsing (no server needed)
// ---------------------------------------------------------------------------
const ROUTE_KEYS = [
  "home", "how_we_work", "our_services", "about_llc", "faq", "book",
  "service_llc_nm", "service_llc_wy", "service_llc_de", "service_llc_fl", "service_itin",
  "legal_terms", "legal_privacy", "legal_cookies", "legal_refunds", "legal_disclaimer",
];

const ROUTE_SLUGS_SRC = read("shared/routes.ts");
const ROUTE_SLUGS = (() => {
  const out = {};
  for (const k of ROUTE_KEYS) {
    const re = new RegExp(`^\\s*${k}:\\s*\\{([^}]+)\\}`, "m");
    const m = ROUTE_SLUGS_SRC.match(re);
    if (!m) continue;
    const inner = m[1];
    const langMap = {};
    for (const lang of LANGS) {
      const lm = inner.match(new RegExp(`${lang}:\\s*"([^"]*)"`));
      langMap[lang] = lm ? lm[1] : null;
    }
    out[k] = langMap;
  }
  return out;
})();
const getLocalizedPath = (key, lang) => {
  const slug = ROUTE_SLUGS[key]?.[lang] ?? "";
  return slug ? `/${lang}/${slug}` : `/${lang}`;
};

const FAQ_DATA_SRC = read("client/src/components/sections/faq-data.tsx");
const FAQ_SECTIONS = (() => {
  const out = [];
  const sectionRe = /title:\s*t\("faqData\.sections\.([a-z]+)"\)[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = sectionRe.exec(FAQ_DATA_SRC)) !== null) {
    const ids = [...m[2].matchAll(/faqData\.questions\.(\w+)/g)].map(x => x[1]);
    out.push({ key: m[1], count: ids.length, ids });
  }
  return out;
})();
const FAQ_TOTAL = FAQ_SECTIONS.reduce((a, s) => a + s.count, 0);

// Blog FAQs — embedded inside blog post content (### FAQ heading + **Q?** A pattern).
// Each post may contain a FAQ section in any of the 6 languages; we audit per slug × lang.
// `BLOG_FAQ_HEADINGS` y `extractBlogFaqQAs` viven en `audit-system-seo-faqs.lib.mjs`
// para poderse reusar desde tests de regresión sin disparar la auditoría.
const BLOG_FAQ_INVENTORY = (() => {
  const inventory = { bySlug: {}, totals: { postsScanned: 0, postsWithFaq: {} } };
  for (const lang of LANGS) inventory.totals.postsWithFaq[lang] = 0;
  const baseDir = path.join(ROOT, "client/src/data/blog-content");
  if (!fs.existsSync(baseDir)) return inventory;
  const slugs = new Set();
  for (const lang of LANGS) {
    const dir = path.join(baseDir, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".ts"))) {
      slugs.add(f.replace(/\.ts$/, ""));
    }
  }
  for (const slug of slugs) {
    inventory.totals.postsScanned++;
    inventory.bySlug[slug] = {};
    for (const lang of LANGS) {
      const fp = path.join(baseDir, lang, `${slug}.ts`);
      if (!fs.existsSync(fp)) {
        inventory.bySlug[slug][lang] = { postPresent: false, hasFaqSection: false, qaCount: 0, questions: [] };
        continue;
      }
      const src = fs.readFileSync(fp, "utf8");
      const headingRe = BLOG_FAQ_HEADINGS[lang];
      const hasSection = headingRe.test(src);
      let qaCount = 0; let questions = []; let spanishTells = [];
      if (hasSection) {
        const qas = extractBlogFaqQAs(src, lang);
        qaCount = qas.length;
        questions = qas.slice(0, 30).map(x => x.question);
        if (qaCount > 0) inventory.totals.postsWithFaq[lang]++;
        // Reusamos `findBlogFaqSpanishTells` (mismo `SPANISH_TELLS_BY_LANG`
        // del audit de FAQs de sistema) para detectar residuos castellanos
        // en la FAQ embebida sin volver a leer el archivo más tarde.
        // Task #49 — test de regresión en audit-system-seo-faqs.test.mjs.
        spanishTells = findBlogFaqSpanishTells(src, lang);
      }
      // `spanishTells` se consume en `auditFaqs()` y luego se elimina antes
      // de serializar `faqs.blogFaqs` para no engordar `faqs-audit.json`.
      inventory.bySlug[slug][lang] = { postPresent: true, hasFaqSection: hasSection, qaCount, questions, spanishTells };
    }
  }
  return inventory;
})();

const LOCALE_SRC = Object.fromEntries(LANGS.map(l => [l, read(`client/src/i18n/locales/${l}.ts`)]));

function offsetToLine(src, offset) {
  if (offset == null || offset < 0) return null;
  let line = 1;
  for (let i = 0; i < offset && i < src.length; i++) if (src.charCodeAt(i) === 10) line++;
  return line;
}
function findLegalKeyLine(lang, key) {
  const src = LOCALE_SRC[lang]; if (!src) return null;
  const legalIdx = src.indexOf(" legal: {"); if (legalIdx < 0) return null;
  const keyIdx = src.indexOf(`${key}: {`, legalIdx); if (keyIdx < 0) return null;
  return offsetToLine(src, keyIdx);
}
function findFaqIdLine(lang, faqId, kind /* "questions" | "answers" */) {
  const src = LOCALE_SRC[lang]; if (!src) return null;
  const faqDataIdx = src.indexOf("faqData:"); if (faqDataIdx < 0) return null;
  const kindIdx = src.indexOf(`${kind}: {`, faqDataIdx); if (kindIdx < 0) return null;
  const re = new RegExp(`\\b${faqId}\\s*:`);
  const m = re.exec(src.slice(kindIdx));
  if (!m) return null;
  return offsetToLine(src, kindIdx + m.index);
}

function extractI18nValue(lang, ...keys) {
  const src = LOCALE_SRC[lang];
  let idx = 0;
  for (const k of keys.slice(0, -1)) {
    const i = src.indexOf(`${k}: {`, idx);
    if (i < 0) return null;
    idx = i + k.length + 3;
  }
  const lastKey = keys[keys.length - 1];
  const re = new RegExp(`\\b${lastKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const slice = src.slice(idx, idx + 200000);
  const m = slice.match(re);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------------------
// Live artifact parsing
// ---------------------------------------------------------------------------
function parseSitemapXml(xml) {
  // Extract <url> blocks (not <sitemap> blocks).
  const urls = [];
  const urlRe = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = urlRe.exec(xml)) !== null) {
    const block = m[1];
    const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1] || null;
    const lastmod = (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || null;
    const priority = (block.match(/<priority>([^<]+)<\/priority>/) || [])[1] || null;
    const changefreq = (block.match(/<changefreq>([^<]+)<\/changefreq>/) || [])[1] || null;
    const alternates = [...block.matchAll(/<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)]
      .map(x => ({ hreflang: x[1], href: x[2] }));
    urls.push({ loc, lastmod, priority, changefreq, alternates });
  }
  return urls;
}

function parseRobotsTxt(txt) {
  const lines = txt.split(/\r?\n/);
  const userAgents = [];
  let cur = null;
  const sitemaps = [];
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const [_, k, v] = m;
    const key = k.toLowerCase();
    if (key === "user-agent") {
      cur = { agent: v, allow: [], disallow: [] };
      userAgents.push(cur);
    } else if (key === "allow" && cur) cur.allow.push(v);
    else if (key === "disallow" && cur) cur.disallow.push(v);
    else if (key === "sitemap") sitemaps.push(v);
  }
  return { userAgents, sitemaps };
}

function robotsAllowsPath(robots, urlPath) {
  // Apply the * group rules with longest-match wins (RFC robots.txt semantics).
  const grp = robots.userAgents.find(g => g.agent === "*");
  if (!grp) return true;
  const wildcardMatch = (rule, p) => {
    if (!rule) return false;
    // Normalise: allow * wildcard
    const pattern = "^" + rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + (rule.endsWith("$") ? "" : "");
    try { return new RegExp(pattern).test(p); } catch { return false; }
  };
  let bestRule = null;
  for (const r of [...grp.allow.map(s => ({ rule: s, allow: true })), ...grp.disallow.map(s => ({ rule: s, allow: false }))]) {
    if (wildcardMatch(r.rule, urlPath)) {
      if (!bestRule || r.rule.length > bestRule.rule.length) bestRule = r;
    }
  }
  return bestRule ? bestRule.allow : true; // default allow
}

const liveSitemaps = {
  index: liveAvailable ? await tryFetch(`${BASE_URL}/sitemap.xml`) : null,
  pages: liveAvailable ? await tryFetch(`${BASE_URL}/sitemap-pages.xml`) : null,
  faq: liveAvailable ? await tryFetch(`${BASE_URL}/sitemap-faq.xml`) : null,
  blog: liveAvailable ? await tryFetch(`${BASE_URL}/sitemap-blog.xml`) : null,
};
const liveRobots = liveAvailable ? await tryFetch(`${BASE_URL}/robots.txt`) : null;
const robotsParsed = liveRobots?.ok ? parseRobotsTxt(liveRobots.body) : { userAgents: [], sitemaps: [] };
const sitemapPages = liveSitemaps.pages?.ok ? parseSitemapXml(liveSitemaps.pages.body) : [];
const sitemapFaq = liveSitemaps.faq?.ok ? parseSitemapXml(liveSitemaps.faq.body) : [];
const sitemapBlog = liveSitemaps.blog?.ok ? parseSitemapXml(liveSitemaps.blog.body) : [];

// Build URL → sitemap-shard index
const urlToShard = new Map();
for (const u of sitemapPages) urlToShard.set(u.loc, "sitemap-pages.xml");
for (const u of sitemapFaq) urlToShard.set(u.loc, "sitemap-faq.xml");
for (const u of sitemapBlog) urlToShard.set(u.loc, "sitemap-blog.xml");

// SITE_URL as observed in the live sitemap (origin without trailing slash)
const SITE_URL = (() => {
  const sample = sitemapPages[0]?.loc || sitemapFaq[0]?.loc || `${BASE_URL}`;
  try { const u = new URL(sample); return `${u.protocol}//${u.host}`; } catch { return BASE_URL; }
})();
console.log(`[live] SITE_URL detected: ${SITE_URL}`);

// ---------------------------------------------------------------------------
// HTML parsers for SEO cells
// ---------------------------------------------------------------------------
function parseHtmlSeo(html) {
  if (!html) return null;
  const head = html.split(/<\/head>/i)[0] || html;
  const get = (re) => (head.match(re) || [])[1] || null;
  const all = (re) => [...head.matchAll(re)].map(m => m[1]);
  const title = get(/<title>([\s\S]*?)<\/title>/i);
  const metaDescription = get(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
    || get(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const canonical = get(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const ogTitle = get(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
  const ogDescription = get(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const ogType = get(/<meta\s+property=["']og:type["']\s+content=["']([^"']*)["']/i);
  const ogImage = get(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  const twitterCard = get(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i);
  const robots = get(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const hreflang = [...head.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/g)]
    .map(m => ({ hreflang: m[1], href: m[2] }));
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => { try { return JSON.parse(m[1]); } catch { return null; } })
    .filter(Boolean);
  const jsonLdTypes = [];
  for (const b of jsonLdBlocks) {
    const items = Array.isArray(b) ? b : [b];
    for (const it of items) if (it && it["@type"]) jsonLdTypes.push(Array.isArray(it["@type"]) ? it["@type"].join(",") : it["@type"]);
  }
  // H1 from full body (rendered HTML may put it in #seo-prerender or after hydration)
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const h1First = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, "").trim() || null;
  return {
    title, titleLen: title ? title.length : 0,
    metaDescription, metaDescriptionLen: metaDescription ? metaDescription.length : 0,
    canonical, ogTitle, ogDescription, ogType, ogImage, twitterCard, robots,
    hreflang, hreflangCount: hreflang.length,
    jsonLdBlocks, jsonLdTypes, jsonLdCount: jsonLdBlocks.length,
    h1Count, h1First,
  };
}

const FAQ_PATHS = LANGS.map(l => ({ lang: l, path: getLocalizedPath("faq", l) }));

const renderedHtml = {}; // path -> { ok, status, body, parsed }
async function fetchAndParse(p) {
  const url = `${BASE_URL}${p}`;
  const r = await tryFetch(url);
  const parsed = r.ok ? parseHtmlSeo(r.body) : null;
  renderedHtml[p] = { url, status: r.status, ok: r.ok, parsed, bodyLength: r.body.length };
  return renderedHtml[p];
}

// Always-fetched: 96 canonical pages + the FAQ pages (already in 96).
console.log(`[live] fetching ${ROUTE_KEYS.length * LANGS.length} canonical pages...`);
if (liveAvailable) {
  const allPaths = ROUTE_KEYS.flatMap(k => LANGS.map(l => getLocalizedPath(k, l)));
  await Promise.all(allPaths.map(p => fetchAndParse(p)));
}

// ---------------------------------------------------------------------------
// 1) SISTEMA — duplicates / dead code / config drift
// ---------------------------------------------------------------------------
const sistema = { generatedAt: new Date().toISOString(), summary: {}, issues: [] };

(function auditSistema() {
  const pageFiles = listFilesRec(path.join(ROOT, "client/src/pages"), p => p.endsWith(".tsx"));
  const pageRels = pageFiles.map(rel);
  const appSrc = read("client/src/App.tsx");
  for (const k of ROUTE_KEYS) {
    if (!appSrc.includes(`pageImports.${k}`) && !appSrc.includes(`"${k}"`)) {
      sistema.issues.push(makeIssue({
        criticality: "P1", area: "routing",
        location: "client/src/App.tsx",
        description: `RouteKey "${k}" definido en shared/routes.ts pero no registrado en App.tsx`,
        evidence: `grep no encuentra referencia al key`,
        suggestion: "Añadir entrada en pageImports / PAGE_COMPONENTS",
        languages: ALL_LANGS,
      }));
    }
  }

  const knownPagePaths = new Set([
    "client/src/pages/home.tsx", "client/src/pages/services.tsx",
    "client/src/pages/how-we-work.tsx", "client/src/pages/faq-page.tsx",
    "client/src/pages/book.tsx", "client/src/pages/about-llc.tsx",
    "client/src/pages/booking.tsx", "client/src/pages/start.tsx",
    "client/src/pages/go.tsx", "client/src/pages/not-found.tsx",
    "client/src/pages/services-sections.tsx",
    "client/src/pages/services/llc-new-mexico.tsx",
    "client/src/pages/services/llc-wyoming.tsx",
    "client/src/pages/services/llc-delaware.tsx",
    "client/src/pages/services/llc-florida.tsx",
    "client/src/pages/services/itin.tsx",
    "client/src/pages/services/ServiceSubpage.tsx",
    "client/src/pages/legal/terms.tsx", "client/src/pages/legal/privacy.tsx",
    "client/src/pages/legal/cookies.tsx", "client/src/pages/legal/refunds.tsx",
    "client/src/pages/legal/disclaimer.tsx",
    "client/src/pages/blog/index.tsx", "client/src/pages/blog/post.tsx",
  ]);
  for (const p of pageRels) {
    if (!knownPagePaths.has(p)) {
      sistema.issues.push(makeIssue({
        criticality: "P2", area: "dead-code",
        location: p,
        description: "Archivo en client/src/pages no inventariado en App.tsx",
        evidence: "no aparece en pageImports",
        suggestion: "Eliminar si no se usa o registrarlo formalmente",
        languages: ALL_LANGS,
      }));
    }
  }

  // i18n duplicate top-level keys
  for (const lang of LANGS) {
    const src = LOCALE_SRC[lang];
    const lines = src.split("\n");
    const topKeys = new Map();
    let depth = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const stripped = line.replace(/\/\/.*$/, "");
      const opens = (stripped.match(/\{/g) || []).length;
      const closes = (stripped.match(/\}/g) || []).length;
      if (depth === 1) {
        const m = stripped.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*\{/);
        if (m) {
          const k = m[1];
          if (topKeys.has(k)) {
            sistema.issues.push(makeIssue({
              criticality: "P1", area: "i18n-duplicate",
              location: `client/src/i18n/locales/${lang}.ts:${i + 1}`,
              description: `Clave i18n top-level duplicada: "${k}" (anterior en línea ${topKeys.get(k)})`,
              evidence: line.trim(),
              suggestion: "Fusionar ambas definiciones para evitar override silencioso de i18next",
              languages: [lang],
            }));
          } else {
            topKeys.set(k, i + 1);
          }
        }
      }
      depth += opens - closes;
      if (depth < 0) depth = 0;
    }
  }

  // i18n parity (ES baseline)
  const esTopKeys = new Set();
  {
    const src = LOCALE_SRC.es;
    const lines = src.split("\n");
    let depth = 0;
    for (const line of lines) {
      const stripped = line.replace(/\/\/.*$/, "");
      const opens = (stripped.match(/\{/g) || []).length;
      const closes = (stripped.match(/\}/g) || []).length;
      if (depth === 1) {
        const m = stripped.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*\{/);
        if (m) esTopKeys.add(m[1]);
      }
      depth += opens - closes;
      if (depth < 0) depth = 0;
    }
  }
  for (const lang of LANGS.filter(l => l !== "es")) {
    for (const k of esTopKeys) {
      if (!new RegExp(`^\\s+${k}\\s*:\\s*\\{`, "m").test(LOCALE_SRC[lang])) {
        sistema.issues.push(makeIssue({
          criticality: "P1", area: "i18n-orphan",
          location: `client/src/i18n/locales/${lang}.ts`,
          description: `Sección "${k}" presente en es pero ausente en ${lang}`,
          evidence: `regex /^\\s+${k}\\s*:\\s*\\{/m no coincide`,
          suggestion: "Añadir traducción o aclarar que es intencional",
          languages: [lang],
        }));
      }
    }
  }

  const WORKSPACE_ROOT = path.resolve(ROOT, "..");
  const fileExistsAnywhere = (f) => fs.existsSync(path.join(ROOT, f)) || fs.existsSync(path.join(WORKSPACE_ROOT, f));
  for (const f of ["vite.config.ts", "tsconfig.json", "tailwind.config.ts", "drizzle.config.ts"].filter(x => !fileExistsAnywhere(x))) {
    if (!exists(f)) {
      sistema.issues.push(makeIssue({
        criticality: "P1", area: "config",
        location: f, description: `Archivo de configuración esperado ausente`,
        evidence: "fs.existsSync == false",
        suggestion: "Restaurar el archivo o documentar su eliminación",
        languages: ALL_LANGS,
      }));
    }
  }

  // Orphan components
  const components = listFilesRec(path.join(ROOT, "client/src/components"), p => p.endsWith(".tsx"));
  const allClientSrc = listFilesRec(path.join(ROOT, "client/src"), p => p.endsWith(".tsx") || p.endsWith(".ts"))
    .map(f => fs.readFileSync(f, "utf8")).join("\n");
  for (const c of components) {
    const name = path.basename(c, ".tsx");
    if (name === "index" || name.startsWith("_")) continue;
    if (c.includes("/components/ui/")) continue;
    // Detecta cualquier patrón de import: estático (`from "./Foo"`),
    // dinámico (`import("./Foo")` usado con React.lazy), re-export
    // (`export { default } from "./Foo"`), CommonJS (`require("./Foo")`),
    // alias absolutos (`@/components/...`, `@shared/...`) y rutas con o sin
    // extensión. Ver scripts/lib/orphan-detect.mjs y su test (Task #39).
    const importRe = buildImportRegex(name);
    if (!importRe.test(allClientSrc)) {
      sistema.issues.push(makeIssue({
        criticality: "P2", area: "dead-code",
        location: rel(c),
        description: `Componente "${name}" sin importadores conocidos en client/src`,
        evidence: "regex de import no coincide",
        suggestion: "Verificar uso o eliminar",
        languages: ALL_LANGS,
      }));
    }
  }

  sistema.summary = {
    routeKeys: ROUTE_KEYS.length,
    pageFilesScanned: pageFiles.length,
    componentsScanned: components.length,
    localesScanned: LANGS.length,
    issuesByCriticality: sistema.issues.reduce((a, x) => (a[x.criticality] = (a[x.criticality] || 0) + 1, a), {}),
    issuesByArea: sistema.issues.reduce((a, x) => (a[x.area] = (a[x.area] || 0) + 1, a), {}),
    totalIssues: sistema.issues.length,
  };
})();
fs.writeFileSync(path.join(OUT, "sistema-audit.json"), JSON.stringify(sistema, null, 2));
console.log(`✓ sistema-audit.json — ${sistema.issues.length} issues`);

// ---------------------------------------------------------------------------
// 2) DOCUMENTOS LEGALES
// ---------------------------------------------------------------------------
const documentos = { generatedAt: new Date().toISOString(), summary: {}, matrix: {}, issues: [] };

(function auditDocumentos() {
  const DOC_KEYS = [
    { key: "terminos", route: "legal_terms", label: "Términos y Condiciones" },
    { key: "privacidad", route: "legal_privacy", label: "Política de Privacidad" },
    { key: "cookies", route: "legal_cookies", label: "Política de Cookies" },
    { key: "reembolsos", route: "legal_refunds", label: "Política de Reembolsos" },
    { key: "disclaimer", route: "legal_disclaimer", label: "Disclaimer" },
  ];
  const REQUIRED_FIELDS = ["title", "seoTitle", "seoDescription", "seoKeywords", "body"];

  function extractDocBody(lang, key) {
    const src = LOCALE_SRC[lang];
    const legalIdx = src.indexOf(" legal: {");
    if (legalIdx < 0) return null;
    const keyIdx = src.indexOf(`${key}: {`, legalIdx);
    if (keyIdx < 0) return null;
    const slice = src.slice(keyIdx, keyIdx + 80000);
    const bodyMatch = slice.match(/body\s*:\s*`([\s\S]*?)`/);
    return {
      title: (slice.match(/title\s*:\s*"([^"]*)"/) || [])[1] || null,
      seoTitle: (slice.match(/seoTitle\s*:\s*"([^"]*)"/) || [])[1] || null,
      seoDescription: (slice.match(/seoDescription\s*:\s*"([^"]*)"/) || [])[1] || null,
      seoKeywords: (slice.match(/seoKeywords\s*:\s*"([^"]*)"/) || [])[1] || null,
      bodyLen: bodyMatch ? bodyMatch[1].length : 0,
      h2Count: bodyMatch ? (bodyMatch[1].match(/<h2[^>]*>/g) || []).length : 0,
      h2Titles: bodyMatch ? [...bodyMatch[1].matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, "").trim()) : [],
      lastUpdate: (slice.match(/(?:Última actualización|Last update[d]?|Dernière mise à jour|Letzte Aktualisierung|Última atualização|Darrera actualització)\s*:?\s*([^<\n"`,]{4,80})/i) || [])[1] || null,
    };
  }

  // Required legal references per (doc × language). EU langs require GDPR-equivalent
  // citation; ES/CA additionally require RGPD/AEPD/LSSI/AEAT references.
  const REQ_REFS = {
    privacidad: {
      es: [/RGPD|Reglamento\s*\(UE\)\s*2016\/679/i, /AEPD|Agencia Espa[ñn]ola de Protecci[óo]n de Datos/i, /LOPDGDD|Ley\s*Org[áa]nica\s*3\/2018/i],
      ca: [/RGPD|Reglament\s*\(UE\)\s*2016\/679/i, /AEPD/i, /LOPDGDD|Llei\s*Org[àa]nica\s*3\/2018/i],
      en: [/GDPR|Regulation\s*\(EU\)\s*2016\/679/i],
      fr: [/RGPD|R[èe]glement\s*\(UE\)\s*2016\/679/i, /CNIL/i],
      de: [/DSGVO|Verordnung\s*\(EU\)\s*2016\/679/i],
      pt: [/RGPD|Regulamento\s*\(UE\)\s*2016\/679/i, /CNPD/i],
    },
    cookies: {
      es: [/LSSI|Ley\s*34\/2002/i, /ePrivacy|Directiva\s*2002\/58/i],
      ca: [/LSSI|Llei\s*34\/2002/i, /ePrivacy|Directiva\s*2002\/58/i],
      en: [/ePrivacy|Directive\s*2002\/58/i],
      fr: [/ePrivacy|Directive\s*2002\/58/i],
      de: [/ePrivacy|Richtlinie\s*2002\/58/i],
      pt: [/ePrivacy|Diretiva\s*2002\/58/i],
    },
    terminos: { es: [/jurisdicci[óo]n|legislaci[óo]n aplicable/i], ca: [/jurisdicci[óo]|legislaci[óo] aplicable/i], en: [/governing law|jurisdiction/i], fr: [/loi applicable|juridiction/i], de: [/anwendbares Recht|Gerichtsstand/i], pt: [/lei aplic[áa]vel|jurisdi[çc][ãa]o/i] },
    reembolsos: { es: [/14\s*d[ií]as|reembolso|devoluci[óo]n/i], ca: [/14\s*dies|reemborsament|devoluci[óo]/i], en: [/refund|14\s*days/i], fr: [/remboursement|14\s*jours/i], de: [/Erstattung|14\s*Tage/i], pt: [/reembolso|14\s*dias/i] },
    disclaimer: { es: [/no constituye asesoramiento|sin garant[ií]a/i], ca: [/no constitueix assessorament|sense garantia/i], en: [/not legal advice|no warranty/i], fr: [/pas un conseil juridique|aucune garantie/i], de: [/keine Rechtsberatung|ohne Gew[äa]hr/i], pt: [/n[ãa]o constitui aconselhamento|sem garantia/i] },
  };
  // Cross-link expectations: terminos→privacidad/cookies; privacidad→cookies; cookies→privacidad
  const CROSS_LINKS = {
    terminos: ["legal_privacy", "legal_cookies"],
    privacidad: ["legal_cookies"],
    cookies: ["legal_privacy"],
  };
  function extractDocBodyText(lang, key) {
    const src = LOCALE_SRC[lang];
    const legalIdx = src.indexOf(" legal: {");
    const keyIdx = src.indexOf(`${key}: {`, legalIdx);
    if (keyIdx < 0) return "";
    const slice = src.slice(keyIdx, keyIdx + 80000);
    const bodyMatch = slice.match(/body\s*:\s*`([\s\S]*?)`/);
    return bodyMatch ? bodyMatch[1] : "";
  }

  for (const lang of LANGS) {
    documentos.matrix[lang] = {};
    for (const d of DOC_KEYS) {
      const body = extractDocBody(lang, d.key);
      if (!body) {
        documentos.matrix[lang][d.key] = { present: false };
        documentos.issues.push(makeIssue({
          criticality: "P0", area: "missing-doc",
          location: `client/src/i18n/locales/${lang}.ts › legal.${d.key}`,
          description: `${d.label} no encontrado en ${lang}`,
          evidence: `bloque legal.${d.key} ausente`,
          languages: [lang], suggestion: "Añadir bloque traducido del documento",
        }));
        continue;
      }
      const bodyText = extractDocBodyText(lang, d.key);
      const refs = REQ_REFS[d.key]?.[lang] || [];
      const refsHits = refs.map(r => ({ pattern: r.source, found: r.test(bodyText) }));
      const refsMissing = refsHits.filter(x => !x.found).map(x => x.pattern);
      const expectedLinks = CROSS_LINKS[d.key] || [];
      const linksMissing = [];
      for (const linkKey of expectedLinks) {
        const targetSlug = ROUTE_SLUGS[linkKey]?.[lang];
        if (!targetSlug) continue;
        if (!bodyText.includes(targetSlug)) linksMissing.push(`${linkKey} (${targetSlug})`);
      }
      documentos.matrix[lang][d.key] = { present: true, ...body, refsExpected: refs.length, refsMissing, crossLinksExpected: expectedLinks, crossLinksMissing: linksMissing };
      const legalLine = findLegalKeyLine(lang, d.key);
      const locBase = `client/src/i18n/locales/${lang}.ts${legalLine ? `:${legalLine}` : ""} › legal.${d.key}.body`;
      if (refsMissing.length) {
        documentos.issues.push(makeIssue({
          criticality: "P1", area: "legal-reference-missing",
          location: locBase,
          description: `${d.label} (${lang}): falta referencia normativa requerida`,
          evidence: JSON.stringify({ missingPatterns: refsMissing, bodyLen: bodyText.length }),
          languages: [lang],
          suggestion: `Citar la(s) referencia(s): ${refsMissing.join(" | ")}`,
        }));
      }
      if (linksMissing.length) {
        documentos.issues.push(makeIssue({
          criticality: "P2", area: "legal-cross-link-missing",
          location: locBase,
          description: `${d.label} (${lang}): no enlaza a documento(s) relacionado(s)`,
          evidence: JSON.stringify({ missing: linksMissing }),
          languages: [lang],
          suggestion: `Añadir enlace interno a ${linksMissing.join(", ")}`,
        }));
      }
      for (const f of REQUIRED_FIELDS) {
        const value = f === "body" ? body.bodyLen : body[f];
        if (!value || (typeof value === "string" && value.length < 5)) {
          documentos.issues.push(makeIssue({
            criticality: "P1", area: "missing-field",
            location: `client/src/i18n/locales/${lang}.ts › legal.${d.key}.${f}`,
            description: `Campo "${f}" vacío o ausente en ${lang} para ${d.label}`,
            evidence: f === "body" ? `bodyLen=${body.bodyLen}` : `valor=${JSON.stringify(value)}`,
            languages: [lang], suggestion: `Rellenar ${f} con traducción equivalente al ES`,
          }));
        }
      }
    }
  }

  for (const d of DOC_KEYS) {
    const esCount = documentos.matrix.es?.[d.key]?.h2Count || 0;
    for (const lang of LANGS.filter(l => l !== "es")) {
      const langCount = documentos.matrix[lang]?.[d.key]?.h2Count || 0;
      if (esCount && langCount && Math.abs(langCount - esCount) > 1) {
        documentos.issues.push(makeIssue({
          criticality: "P1", area: "structure-divergence",
          location: `client/src/i18n/locales/${lang}.ts › legal.${d.key}.body`,
          description: `${d.label} (${lang}): ${langCount} secciones <h2> vs ${esCount} en ES (Δ=${langCount - esCount})`,
          evidence: `ES h2=${esCount}, ${lang} h2=${langCount}`,
          languages: [lang],
          suggestion: "Alinear la estructura con la versión ES (fuente canónica)",
        }));
      }
      if (esCount && !langCount) {
        documentos.issues.push(makeIssue({
          criticality: "P0", area: "empty-body",
          location: `client/src/i18n/locales/${lang}.ts › legal.${d.key}.body`,
          description: `${d.label} (${lang}): cuerpo vacío o sin <h2>`,
          evidence: `langCount=0, esCount=${esCount}`,
          languages: [lang], suggestion: "Traducir el documento completo desde ES",
        }));
      }
    }
    for (const lang of LANGS) {
      const last = documentos.matrix[lang]?.[d.key]?.lastUpdate;
      if (documentos.matrix[lang]?.[d.key]?.present && !last) {
        documentos.issues.push(makeIssue({
          criticality: "P2", area: "missing-date",
          location: `client/src/i18n/locales/${lang}.ts › legal.${d.key}.body`,
          description: `${d.label} (${lang}): no se detectó fecha de "Última actualización"`,
          evidence: "regex de fecha no coincide",
          languages: [lang],
          suggestion: "Añadir párrafo con fecha de última revisión",
        }));
      }
    }
  }

  documentos.summary = {
    docsExpected: DOC_KEYS.length,
    languagesExpected: LANGS.length,
    cellsExpected: DOC_KEYS.length * LANGS.length,
    issuesByCriticality: documentos.issues.reduce((a, x) => (a[x.criticality] = (a[x.criticality] || 0) + 1, a), {}),
    issuesByArea: documentos.issues.reduce((a, x) => (a[x.area] = (a[x.area] || 0) + 1, a), {}),
    totalIssues: documentos.issues.length,
  };
})();
fs.writeFileSync(path.join(OUT, "documentos-audit.json"), JSON.stringify(documentos, null, 2));
console.log(`✓ documentos-audit.json — ${documentos.issues.length} issues`);

// ---------------------------------------------------------------------------
// 3) SEO TÉCNICA — evidence-based per route × lang from rendered HTML
// ---------------------------------------------------------------------------
const seo = { generatedAt: new Date().toISOString(), summary: {}, pages: [], issues: [] };

(function auditSeo() {
  const REQUIRED_SCHEMAS_HOME = ["Organization", "WebSite", "BreadcrumbList"];
  const REQUIRED_SCHEMAS_SERVICE = ["Service"];
  const REQUIRED_SCHEMAS_FAQ = ["FAQPage"];

  for (const key of ROUTE_KEYS) {
    for (const lang of LANGS) {
      const p = getLocalizedPath(key, lang);
      const r = renderedHtml[p];
      // Source-of-truth: what server/seo-content.ts → injectMeta() will emit
      // for this path. This is the authoritative SEO surface; live HTML is
      // only augmentation (in dev it doesn't run, in prod the build can lose
      // optional data such as blog posts).
      const sotMeta = sotMetaForPath(p);
      const sotTypes = sotSchemasForRouteKey(key);
      const cell = {
        routeKey: key, lang, path: p,
        canonicalExpected: `${SITE_URL}${p}`,
        // SOT-resolved fields (canonical truth):
        sotPresent: !!sotMeta,
        title: sotMeta?.title ?? r?.parsed?.title ?? null,
        titleLength: (sotMeta?.title || r?.parsed?.title || "").length,
        metaDescription: sotMeta?.description ?? r?.parsed?.metaDescription ?? null,
        metaDescriptionLength: (sotMeta?.description || r?.parsed?.metaDescription || "").length,
        canonical: sotMeta?.canonical ?? r?.parsed?.canonical ?? null,
        sotKeywords: sotMeta?.keywords ?? null,
        sotNoindex: !!sotMeta?.noindex,
        sotJsonLdTypes: sotTypes,
        // Live-HTML augmentation:
        fetched: !!r?.ok,
        httpStatus: r?.status ?? null,
        ogTitle: r?.parsed?.ogTitle ?? null,
        ogDescription: r?.parsed?.ogDescription ?? null,
        ogType: r?.parsed?.ogType ?? null,
        ogImage: r?.parsed?.ogImage ?? null,
        twitterCard: r?.parsed?.twitterCard ?? null,
        metaRobots: r?.parsed?.robots ?? null,
        hreflangCount: r?.parsed?.hreflangCount ?? 0,
        hreflangLangs: r?.parsed?.hreflang?.map(h => h.hreflang) ?? [],
        h1Count: Math.max(sotH1CountFor(key, lang), r?.parsed?.h1Count ?? 0),
        h1CountSot: sotH1CountFor(key, lang),
        h1CountLive: r?.parsed?.h1Count ?? 0,
        h1First: r?.parsed?.h1First ?? null,
        jsonLdCount: r?.parsed?.jsonLdCount ?? 0,
        jsonLdTypes: r?.parsed?.jsonLdTypes ?? [],
        slashHygiene: !p.endsWith("/") || p === "/",
      };
      seo.pages.push(cell);

      if (!cell.sotPresent && !cell.fetched) {
        seo.issues.push(makeIssue({
          criticality: "P0", area: "page-untracked",
          location: p,
          description: `${key}/${lang}: ruta sin entrada en PAGE_META/PAGE_META_I18N y sin HTML accesible`,
          evidence: JSON.stringify({ httpStatus: cell.httpStatus, sot: false }),
          suggestion: "Añadir entrada a server/seo-content.ts → PAGE_META o buildI18nMeta()",
          languages: [lang],
        }));
        continue;
      }
      if (!cell.title) {
        seo.issues.push(makeIssue({
          criticality: "P0", area: "title-missing", location: p,
          description: `Página sin <title>`, evidence: "regex no coincide",
          suggestion: "Asegurar que el SSR (server/seo-content.ts) inyecta title", languages: [lang],
        }));
      } else if (cell.titleLength > 60) {
        seo.issues.push(makeIssue({
          criticality: "P2", area: "title-too-long", location: p,
          description: `Título de ${cell.titleLength} caracteres (>60)`,
          evidence: cell.title, suggestion: "Acortar a ≤60 para evitar truncado en SERP", languages: [lang],
        }));
      } else if (cell.titleLength < 20) {
        seo.issues.push(makeIssue({
          criticality: "P2", area: "title-too-short", location: p,
          description: `Título corto (${cell.titleLength}<20 car)`,
          evidence: cell.title, suggestion: "Ampliar el título con keywords relevantes", languages: [lang],
        }));
      }
      if (!cell.metaDescription) {
        seo.issues.push(makeIssue({
          criticality: "P0", area: "meta-description-missing", location: p,
          description: "Sin meta description", evidence: "regex no coincide",
          suggestion: "Añadir entrada en PAGE_META de seo-content.ts", languages: [lang],
        }));
      } else if (cell.metaDescriptionLength > 160) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "meta-description-too-long", location: p,
          description: `Meta description de ${cell.metaDescriptionLength} (>160)`,
          evidence: cell.metaDescription, suggestion: "Acortar a ≤160", languages: [lang],
        }));
      } else if (cell.metaDescriptionLength < 70) {
        seo.issues.push(makeIssue({
          criticality: "P2", area: "meta-description-too-short", location: p,
          description: `Meta description corta (${cell.metaDescriptionLength}<70)`,
          evidence: cell.metaDescription, suggestion: "Aprovechar 120–160 caracteres", languages: [lang],
        }));
      }
      if (!cell.canonical) {
        seo.issues.push(makeIssue({
          criticality: "P0", area: "canonical-missing", location: p,
          description: "Sin <link rel=canonical>", evidence: "no encontrado",
          suggestion: "Inyectar canonical absoluto desde SSR", languages: [lang],
        }));
      } else if (cell.canonical !== cell.canonicalExpected) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "canonical-mismatch", location: p,
          description: `Canonical "${cell.canonical}" no coincide con esperado "${cell.canonicalExpected}"`,
          evidence: JSON.stringify({ got: cell.canonical, expected: cell.canonicalExpected }),
          suggestion: "Asegurar que canonical apunta al URL absoluto del idioma activo", languages: [lang],
        }));
      }
      if (cell.hreflangCount < LANGS.length + 1) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "hreflang-incomplete", location: p,
          description: `${cell.hreflangCount} alternates hreflang (esperados ${LANGS.length}+x-default)`,
          evidence: JSON.stringify({ langs: cell.hreflangLangs }),
          suggestion: "Emitir un alternate por idioma + x-default", languages: [lang],
        }));
      }
      if (!cell.ogTitle || !cell.ogDescription) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "open-graph", location: p,
          description: `OG incompleto (title=${!!cell.ogTitle}, description=${!!cell.ogDescription})`,
          evidence: JSON.stringify({ ogTitle: cell.ogTitle, ogDescription: cell.ogDescription }),
          suggestion: "Inyectar og:title/og:description/og:image", languages: [lang],
        }));
      }
      if (!cell.twitterCard) {
        seo.issues.push(makeIssue({
          criticality: "P2", area: "twitter-card", location: p,
          description: "Sin meta twitter:card", evidence: "regex no coincide",
          suggestion: "Añadir twitter:card summary_large_image", languages: [lang],
        }));
      }
      if (cell.h1Count === 0) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "h1-missing", location: p,
          description: "Sin <h1> visible en el HTML inicial", evidence: "regex /<h1/ no coincide",
          suggestion: "Asegurar h1 en el SSR (importante para SEO sin JS)", languages: [lang],
        }));
      }
      // Keyword positioning: tokenise sotKeywords into primary tokens (≥4 chars,
      // first 5), then check whether each token appears in title / metaDescription /
      // H1-equivalent (PAGE_SEO_CONTENT). Surfaces keyword↔target-page coverage gaps.
      if (cell.sotKeywords) {
        const tokens = (cell.sotKeywords || "")
          .toLowerCase().split(/[,;|]/).map(s => s.trim()).filter(s => s.length >= 4)
          .slice(0, 5);
        const haystackTitle = (cell.title || "").toLowerCase();
        const haystackDesc = (cell.metaDescription || "").toLowerCase();
        const missing = tokens.filter(t => !haystackTitle.includes(t) && !haystackDesc.includes(t));
        cell.keywordTokens = tokens;
        cell.keywordTokensMissingInTitleOrDesc = missing;
        if (tokens.length > 0 && missing.length === tokens.length) {
          seo.issues.push(makeIssue({
            criticality: "P1", area: "keyword-positioning",
            location: p,
            description: `Ninguna keyword declarada aparece en title o description (${missing.length}/${tokens.length} ausentes)`,
            evidence: JSON.stringify({ keywords: tokens, title: cell.title, description: cell.metaDescription }),
            suggestion: "Reescribir title o meta description para incluir al menos 1 keyword principal",
            languages: [lang],
          }));
        } else if (tokens.length > 0 && missing.length > 0 && missing.length >= Math.ceil(tokens.length / 2)) {
          seo.issues.push(makeIssue({
            criticality: "P2", area: "keyword-positioning",
            location: p,
            description: `${missing.length}/${tokens.length} keywords sin presencia en title o description`,
            evidence: JSON.stringify({ missing, presentTokens: tokens.filter(t => !missing.includes(t)) }),
            suggestion: "Reforzar la keyword principal en title; secundarias en description",
            languages: [lang],
          }));
        }
      }
      if (cell.h1Count > 1) {
        seo.issues.push(makeIssue({
          criticality: "P2", area: "h1-multiple", location: p,
          description: `${cell.h1Count} <h1> detectados`, evidence: `count=${cell.h1Count}`,
          suggestion: "Mantener un único H1 por página", languages: [lang],
        }));
      }
      // Schema applicability — check the union of SOT (PAGE_SCHEMAS + special
      // FAQPage handling in injectMeta) and live HTML JSON-LD blocks. SOT is
      // authoritative; live HTML is augmentation for client-side schemas.
      const faqPageInjected = key === "faq"; // injectMeta() unconditionally pushes FAQPage for faq route
      const homeInjected = key === "home" ? ["ProfessionalService"] : [];
      const effectiveTypes = new Set([
        ...cell.sotJsonLdTypes,
        ...cell.jsonLdTypes,
        ...(faqPageInjected ? ["FAQPage"] : []),
        ...homeInjected,
      ]);
      cell.effectiveJsonLdTypes = [...effectiveTypes];
      if (key === "faq" && !effectiveTypes.has("FAQPage")) {
        seo.issues.push(makeIssue({
          criticality: "P0", area: "schema-faqpage-missing", location: p,
          description: "Página FAQ sin JSON-LD FAQPage (SOT ni live)",
          evidence: JSON.stringify({ sot: cell.sotJsonLdTypes, live: cell.jsonLdTypes }),
          suggestion: "Verificar que injectMeta() emite FAQPage en este idioma", languages: [lang],
        }));
      }
      if (key.startsWith("service_") && ![...effectiveTypes].some(t => /Service/.test(t))) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "schema-service-missing", location: p,
          description: "Página de servicio sin JSON-LD Service",
          evidence: JSON.stringify({ sot: cell.sotJsonLdTypes, live: cell.jsonLdTypes }),
          suggestion: "Añadir entrada a PAGE_SCHEMAS[<routeKey>] en server/seo-content.ts", languages: [lang],
        }));
      }
      if (key === "home") {
        for (const must of REQUIRED_SCHEMAS_HOME) {
          if (!effectiveTypes.has(must)) {
            seo.issues.push(makeIssue({
              criticality: "P1", area: "schema-home-incomplete", location: p,
              description: `Home sin JSON-LD ${must}`,
              evidence: JSON.stringify({ sot: cell.sotJsonLdTypes, live: cell.jsonLdTypes }),
              suggestion: `Añadir bloque ${must} a PAGE_SCHEMAS.home en SSR`, languages: [lang],
            }));
          }
        }
      }
      if (cell.sotNoindex || (cell.metaRobots && /noindex/i.test(cell.metaRobots))) {
        seo.issues.push(makeIssue({
          criticality: "P0", area: "noindex-public", location: p,
          description: `Página pública con meta robots noindex`, evidence: cell.metaRobots,
          suggestion: "Eliminar noindex en rutas públicas indexables", languages: [lang],
        }));
      }
    }
  }

  // Keyword-map coverage rollup: count cells per language with declared keywords
  for (const lang of LANGS) {
    const cellsLang = seo.pages.filter(c => c.lang === lang && c.sotPresent);
    const withKw = cellsLang.filter(c => c.sotKeywords).length;
    if (cellsLang.length > 0 && withKw === 0) {
      seo.issues.push(makeIssue({
        criticality: "P1", area: "keyword-map-absent",
        location: `server/seo-content.ts › PAGE_META_I18N[${lang}]`,
        description: `Ninguna de las ${cellsLang.length} rutas en ${lang} declara campo "keywords" en PAGE_META (no hay mapa keyword→página objetivo)`,
        evidence: JSON.stringify({ lang, totalRoutes: cellsLang.length, withKeywords: 0 }),
        suggestion: "Definir keywords[] por (ruta × idioma) en PAGE_META_I18N para auditar posicionamiento y evitar canibalización",
        languages: [lang],
      }));
    } else if (cellsLang.length > 0 && withKw < cellsLang.length) {
      seo.issues.push(makeIssue({
        criticality: "P2", area: "keyword-map-partial",
        location: `server/seo-content.ts › PAGE_META_I18N[${lang}]`,
        description: `${cellsLang.length - withKw}/${cellsLang.length} rutas en ${lang} sin keywords declaradas`,
        evidence: JSON.stringify({ withKeywords: withKw, total: cellsLang.length }),
        suggestion: "Completar keywords[] en las rutas restantes",
        languages: [lang],
      }));
    }
  }

  // Robots.txt sanity
  if (robotsParsed.userAgents.length === 0) {
    seo.issues.push(makeIssue({
      criticality: "P0", area: "robots-empty", location: "/robots.txt",
      description: "robots.txt vacío o no accesible",
      evidence: JSON.stringify({ ok: liveRobots?.ok, status: liveRobots?.status }),
      suggestion: "Verificar handler en server/routes/public.ts",
      languages: ALL_LANGS,
    }));
  } else {
    const expectedSitemaps = ["/sitemap.xml", "/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"];
    const declared = robotsParsed.sitemaps.map(s => { try { return new URL(s).pathname; } catch { return s; } });
    for (const e of expectedSitemaps) {
      if (!declared.includes(e)) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "robots-sitemap-missing",
          location: "/robots.txt",
          description: `robots.txt no declara ${e}`,
          evidence: JSON.stringify({ declared }),
          suggestion: "Añadir Sitemap: <URL> correspondiente",
          languages: ALL_LANGS,
        }));
      }
    }
    for (const must of ["/api/", "/internal/", "/__mockup/", "/booking/"]) {
      const grp = robotsParsed.userAgents.find(g => g.agent === "*");
      if (grp && !grp.disallow.some(r => r === must || r.startsWith(must))) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "robots-disallow-missing",
          location: "/robots.txt",
          description: `Sin Disallow: ${must} en User-agent: *`,
          evidence: JSON.stringify({ disallow: grp.disallow }),
          suggestion: `Añadir "Disallow: ${must}"`,
          languages: ALL_LANGS,
        }));
      }
    }
  }

  // Slash policy on slugs
  for (const key of ROUTE_KEYS) {
    for (const lang of LANGS) {
      const slug = ROUTE_SLUGS[key]?.[lang];
      if (slug && /\/$/.test(slug)) {
        seo.issues.push(makeIssue({
          criticality: "P1", area: "slash-policy",
          location: `shared/routes.ts › ${key}/${lang}`,
          description: `Slug con trailing slash: "${slug}"`,
          evidence: slug, suggestion: "Eliminar slash final por consistencia",
          languages: [lang],
        }));
      }
    }
  }

  // Explicit rollup: keyword positioning per language (map vs implementation)
  seo.keywordPositioning = {
    note: "Mapa keyword→página objetivo declarado en server/seo-content.ts vía PAGE_META.keywords. Auditoría cruza tokens contra title+description del SSR.",
    byLang: Object.fromEntries(LANGS.map(lang => {
      const cells = seo.pages.filter(c => c.lang === lang && c.sotPresent);
      const withKw = cells.filter(c => c.sotKeywords);
      const partialMatch = withKw.filter(c => (c.keywordTokensMissingInTitleOrDesc || []).length > 0 && (c.keywordTokensMissingInTitleOrDesc || []).length < (c.keywordTokens || []).length);
      const noMatch = withKw.filter(c => (c.keywordTokens || []).length > 0 && (c.keywordTokensMissingInTitleOrDesc || []).length === (c.keywordTokens || []).length);
      return [lang, {
        routesTotal: cells.length,
        routesWithKeywordsDeclared: withKw.length,
        routesWithoutKeywords: cells.length - withKw.length,
        routesWithFullKeywordCoverage: withKw.length - partialMatch.length - noMatch.length,
        routesWithPartialKeywordCoverage: partialMatch.length,
        routesWithNoKeywordInTitleOrDesc: noMatch.length,
      }];
    })),
  };
  // Explicit rollup: robots.txt diagnostics
  seo.robotsAudit = {
    fetched: !!liveRobots?.ok,
    httpStatus: liveRobots?.status ?? null,
    sitemapsDeclared: robotsParsed.sitemaps,
    sitemapsExpected: ["/sitemap.xml", "/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"],
    sitemapsMissing: ["/sitemap.xml", "/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"].filter(e => !robotsParsed.sitemaps.map(s => { try { return new URL(s).pathname; } catch { return s; } }).includes(e)),
    userAgentGroups: robotsParsed.userAgents.map(g => ({ agent: g.agent, allowCount: g.allow.length, disallowCount: g.disallow.length, disallow: g.disallow })),
    expectedDisallow: ["/api/", "/internal/", "/__mockup/", "/booking/"],
  };
  seo.summary = {
    routes: ROUTE_KEYS.length, languages: LANGS.length,
    pageCells: seo.pages.length,
    pagesFetched: seo.pages.filter(c => c.fetched).length,
    schemaTypesObserved: [...new Set(seo.pages.flatMap(c => c.jsonLdTypes))].sort(),
    sitemapsDeclaredInRobots: robotsParsed.sitemaps,
    keywordPositioningRollupAvailable: true,
    robotsAuditRollupAvailable: true,
    issuesByCriticality: seo.issues.reduce((a, x) => (a[x.criticality] = (a[x.criticality] || 0) + 1, a), {}),
    issuesByArea: seo.issues.reduce((a, x) => (a[x.area] = (a[x.area] || 0) + 1, a), {}),
    totalIssues: seo.issues.length,
  };
})();
fs.writeFileSync(path.join(OUT, "seo-audit.json"), JSON.stringify(seo, null, 2));
console.log(`✓ seo-audit.json — ${seo.issues.length} issues across ${seo.pages.length} celdas`);

// ---------------------------------------------------------------------------
// 4) SITEMAP COMPLETO — real surface, every shard, including blog
// ---------------------------------------------------------------------------
const sitemap = { generatedAt: new Date().toISOString(), summary: {}, urls: [], shards: {}, issues: [] };

(function auditSitemap() {
  sitemap.shards = {
    "sitemap.xml":          { ok: liveSitemaps.index?.ok, status: liveSitemaps.index?.status, urlCount: 0 /* index, no <url> */ },
    "sitemap-pages.xml":    { ok: liveSitemaps.pages?.ok, status: liveSitemaps.pages?.status, urlCount: sitemapPages.length },
    "sitemap-blog.xml":     { ok: liveSitemaps.blog?.ok,  status: liveSitemaps.blog?.status,  urlCount: sitemapBlog.length },
    "sitemap-faq.xml":      { ok: liveSitemaps.faq?.ok,   status: liveSitemaps.faq?.status,   urlCount: sitemapFaq.length },
  };
  // Suggested priority taxonomy (current sitemap-pages emits 0.6 for legals)
  const SUGGESTED = {
    home: "1.0", our_services: "0.9", about_llc: "0.9", how_we_work: "0.9",
    service_llc_nm: "0.8", service_llc_wy: "0.8", service_llc_de: "0.8", service_llc_fl: "0.8", service_itin: "0.8",
    faq: "0.7", book: "0.6",
    legal_terms: "0.4", legal_privacy: "0.4", legal_cookies: "0.4", legal_refunds: "0.4", legal_disclaimer: "0.4",
  };

  // Route × lang surface
  for (const key of ROUTE_KEYS) {
    for (const lang of LANGS) {
      const p = getLocalizedPath(key, lang);
      const url = `${SITE_URL}${p}`;
      const sm = sitemapPages.find(u => u.loc === url) || sitemapFaq.find(u => u.loc === url);
      const shard = sm ? (sitemapPages.includes(sm) ? "sitemap-pages.xml" : "sitemap-faq.xml") : null;
      const cell = {
        routeKey: key, lang, path: p, url,
        inSitemap: !!sm, shard,
        currentPriority: sm?.priority || null,
        suggestedPriority: SUGGESTED[key] || null,
        changefreq: sm?.changefreq || null,
        lastmod: sm?.lastmod || null,
        hreflangAlternates: sm?.alternates?.length || 0,
      };
      sitemap.urls.push(cell);
      if (!cell.inSitemap) {
        sitemap.issues.push(makeIssue({
          criticality: "P0", area: "missing-from-sitemap",
          location: `${url}`,
          description: `${key}/${lang} no presente en ningún sitemap shard`,
          evidence: `<loc> esperado: ${url}`,
          languages: [lang],
          suggestion: `Añadir entrada al shard correspondiente en server/routes/public.ts`,
        }));
      }
      if (cell.currentPriority && cell.suggestedPriority && cell.currentPriority !== cell.suggestedPriority) {
        sitemap.issues.push(makeIssue({
          criticality: "P2", area: "priority-tuning",
          location: `${url}`,
          description: `Prioridad actual ${cell.currentPriority} vs sugerida ${cell.suggestedPriority}`,
          evidence: JSON.stringify({ current: cell.currentPriority, suggested: cell.suggestedPriority }),
          languages: [lang],
          suggestion: `Ajustar prioridad a ${cell.suggestedPriority} (jerarquía home>servicios>FAQ>legales)`,
        }));
      }
      if (sm) {
        const haveTags = new Set(sm.alternates.map(a => a.hreflang));
        // Sitemap emits BCP-47 region tags (es-ES, pt-PT, ca-ES, …); see
        // HREFLANG_BCP47 in server/routes/public.ts.
        const HREFLANG_BCP47 = { es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES" };
        for (const L of [...LANGS, "x-default"]) {
          const tag = L === "x-default" ? "x-default" : HREFLANG_BCP47[L];
          if (!haveTags.has(tag)) {
            sitemap.issues.push(makeIssue({
              criticality: "P1", area: "sitemap-hreflang-missing",
              location: `${url}`,
              description: `Sitemap entry para ${url} sin alternate hreflang="${tag}"`,
              evidence: JSON.stringify({ have: [...haveTags] }),
              languages: [lang],
              suggestion: `Emitir <xhtml:link rel="alternate" hreflang="${tag}" .../> para esta entrada`,
            }));
          }
        }
      }
    }
  }

  // Blog index per language (already in sitemap-pages with /xx/blog)
  for (const lang of LANGS) {
    const url = `${SITE_URL}/${lang}/blog`;
    const sm = sitemapPages.find(u => u.loc === url);
    sitemap.urls.push({
      routeKey: "blog_index", lang, path: `/${lang}/blog`, url,
      inSitemap: !!sm, shard: sm ? "sitemap-pages.xml" : null,
      currentPriority: sm?.priority || null, suggestedPriority: "0.8",
      changefreq: sm?.changefreq || null, lastmod: sm?.lastmod || null,
      hreflangAlternates: sm?.alternates?.length || 0,
    });
    if (!sm) {
      sitemap.issues.push(makeIssue({
        criticality: "P0", area: "missing-from-sitemap",
        location: url, description: `blog index ${lang} no en sitemap`,
        evidence: `<loc> esperado: ${url}`,
        languages: [lang], suggestion: "Verificar generador en server/routes/public.ts",
      }));
    }
  }

  // Blog posts — enumerate from sitemap (the *real* surface)
  const blogByLang = {};
  for (const u of sitemapBlog) {
    const m = u.loc.match(/\/(es|en|fr|de|pt|ca)\/blog\/([^/?#]+)$/);
    if (!m) continue;
    const [_, lang, slug] = m;
    blogByLang[lang] = (blogByLang[lang] || 0) + 1;
    sitemap.urls.push({
      routeKey: "blog_post", lang, slug, path: `/${lang}/blog/${slug}`, url: u.loc,
      inSitemap: true, shard: "sitemap-blog.xml",
      currentPriority: u.priority, suggestedPriority: "0.7",
      changefreq: u.changefreq, lastmod: u.lastmod,
      hreflangAlternates: u.alternates.length,
    });
  }

  // Cross-reference: shard URL count vs known surface
  const expectedShards = ["/sitemap.xml", "/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"];
  for (const s of expectedShards) {
    const fetched = liveSitemaps[s.includes("pages") ? "pages" : s.includes("blog") ? "blog" : s.includes("faq") ? "faq" : "index"];
    if (!fetched?.ok) {
      sitemap.issues.push(makeIssue({
        criticality: "P0", area: "shard-unreachable",
        location: s, description: `Shard de sitemap "${s}" no accesible (status ${fetched?.status ?? "n/a"})`,
        evidence: JSON.stringify({ status: fetched?.status }),
        suggestion: "Verificar handler y caché", languages: ALL_LANGS,
      }));
    }
  }

  // Duplicate <loc> detection across all shards
  const allLocs = [...sitemapPages, ...sitemapFaq, ...sitemapBlog].map(u => u.loc);
  const dupes = allLocs.filter((v, i, a) => a.indexOf(v) !== i);
  if (dupes.length) {
    sitemap.issues.push(makeIssue({
      criticality: "P1", area: "sitemap-duplicates",
      location: "sitemap-*.xml",
      description: `${dupes.length} URLs duplicadas en sitemaps`,
      evidence: JSON.stringify(dupes.slice(0, 5)),
      suggestion: "Eliminar duplicados", languages: ALL_LANGS,
    }));
  }

  sitemap.summary = {
    totalUrlsCatalogued: sitemap.urls.length,
    inSitemap: sitemap.urls.filter(u => u.inSitemap).length,
    missingFromSitemap: sitemap.urls.filter(u => !u.inSitemap).length,
    blogPostsByLang: blogByLang,
    blogPostsTotal: sitemapBlog.length,
    issuesByCriticality: sitemap.issues.reduce((a, x) => (a[x.criticality] = (a[x.criticality] || 0) + 1, a), {}),
    issuesByArea: sitemap.issues.reduce((a, x) => (a[x.area] = (a[x.area] || 0) + 1, a), {}),
    totalIssues: sitemap.issues.length,
  };
})();
fs.writeFileSync(path.join(OUT, "sitemap-completo.json"), JSON.stringify(sitemap, null, 2));
console.log(`✓ sitemap-completo.json — ${sitemap.issues.length} issues, ${sitemap.urls.length} URLs catalogadas`);

// ---------------------------------------------------------------------------
// 5) FAQs — content & translation quality
// ---------------------------------------------------------------------------
// Para serialización: clonamos `bySlug` sin el campo interno `spanishTells`
// (sólo lo necesitamos para emitir issues, no para el JSON público).
const BLOG_FAQ_SERIALIZABLE = Object.fromEntries(
  Object.entries(BLOG_FAQ_INVENTORY.bySlug).map(([slug, row]) => [
    slug,
    Object.fromEntries(Object.entries(row).map(([lang, cell]) => {
      const { spanishTells: _omit, ...rest } = cell;
      return [lang, rest];
    })),
  ]),
);
const faqs = { generatedAt: new Date().toISOString(), summary: {}, structure: FAQ_SECTIONS, items: [], blogFaqs: { totals: BLOG_FAQ_INVENTORY.totals, slugs: BLOG_FAQ_SERIALIZABLE }, issues: [] };

(function auditFaqs() {
  // Detección de residuos castellanos por idioma (Task #38, 2026-04-22).
  // El mapa `SPANISH_TELLS_BY_LANG` y el helper `matchesSpanishTells` viven
  // en `audit-system-seo-faqs.lib.mjs` para que el test de regresión de la
  // Task #44 pueda importarlos sin disparar la auditoría completa.
  // Ver `docs/auditoria-sistema-seo-faqs/DECISIONES.md` (entrada Task #44).
  const TODO_RE = /\b(?:TODO|FIXME|@TODO|XXX)\b|lorem ipsum|\[placeholder\]|\?\?\?\?+/;

  for (const sec of FAQ_SECTIONS) {
    for (const id of sec.ids) {
      const item = { faqId: id, section: sec.key, byLang: {} };
      const esQ = extractI18nValue("es", "faqData", "questions", id);
      const esA = extractI18nValue("es", "faqData", "answers", id);
      for (const lang of LANGS) {
        const q = extractI18nValue(lang, "faqData", "questions", id);
        const a = extractI18nValue(lang, "faqData", "answers", id);
        const cell = {
          present: !!q && !!a,
          questionLength: q ? q.length : 0,
          answerLength: a ? a.length : 0,
          identicalToEs: lang !== "es" && q && esQ && q === esQ,
          containsTodo: !!(q && TODO_RE.test(q)) || !!(a && TODO_RE.test(a)),
          containsSpanishTells: matchesSpanishTells(lang, q) || matchesSpanishTells(lang, a),
          suspiciouslyShort: lang !== "es" && esA && a && esA.length > 150 && a.length < esA.length * 0.4,
        };
        item.byLang[lang] = cell;

        const qLine = findFaqIdLine(lang, id, "questions");
        const aLine = findFaqIdLine(lang, id, "answers");
        const faqLocBoth = `client/src/i18n/locales/${lang}.ts${qLine ? `:${qLine}` : ""} › faqData.*.${id}`;
        const faqLocQ = `client/src/i18n/locales/${lang}.ts${qLine ? `:${qLine}` : ""} › faqData.questions.${id}`;
        const faqLocA = `client/src/i18n/locales/${lang}.ts${aLine ? `:${aLine}` : ""} › faqData.answers.${id}`;
        if (!cell.present) {
          faqs.issues.push(makeIssue({
            criticality: "P0", area: "missing-faq",
            location: faqLocBoth,
            description: `FAQ ${id} ausente o vacía en ${lang}`,
            evidence: `q=${cell.questionLength}, a=${cell.answerLength}`,
            languages: [lang], suggestion: "Añadir traducción profesional desde la versión ES",
          }));
        }
        if (cell.containsTodo) {
          faqs.issues.push(makeIssue({
            criticality: "P0", area: "placeholder-text",
            location: faqLocBoth,
            description: `FAQ ${id} (${lang}) contiene marcador TODO/placeholder`,
            evidence: "regex TODO|FIXME coincide",
            languages: [lang], suggestion: "Reemplazar con texto definitivo",
          }));
        }
        if (cell.identicalToEs) {
          faqs.issues.push(makeIssue({
            criticality: "P1", area: "untranslated",
            location: faqLocQ,
            description: `Pregunta ${id} idéntica al ES en ${lang} (probable sin traducir)`,
            evidence: "string equality con ES",
            languages: [lang],
            suggestion: "Traducir o documentar como intencional en i18n-intentional-identical.json",
          }));
        }
        if (cell.containsSpanishTells) {
          faqs.issues.push(makeIssue({
            criticality: "P1", area: "language-leak",
            location: faqLocBoth,
            description: `FAQ ${id} (${lang}) contiene palabras en español ("además", "gestión"…)`,
            evidence: `regex SPANISH_TELLS_BY_LANG[${lang}] coincide`,
            languages: [lang], suggestion: "Revisión nativa para localizar terminología fiscal",
          }));
        }
        if (cell.suspiciouslyShort) {
          faqs.issues.push(makeIssue({
            criticality: "P2", area: "answer-length",
            location: faqLocA,
            description: `Respuesta ${id} (${lang}) sospechosamente corta vs ES`,
            evidence: `${cell.answerLength} vs ${esA?.length} (ratio < 0.4)`,
            languages: [lang], suggestion: "Verificar contenido equivalente",
          }));
        }
      }
      faqs.items.push(item);
    }
  }

  // ── Blog-embedded FAQs: per-post translation parity ─────────────────────
  for (const slug of Object.keys(BLOG_FAQ_INVENTORY.bySlug)) {
    const row = BLOG_FAQ_INVENTORY.bySlug[slug];
    const esCell = row.es;
    const esHasFaq = esCell?.hasFaqSection && esCell.qaCount > 0;
    if (!esHasFaq) continue;
    for (const lang of LANGS.filter(l => l !== "es")) {
      const c = row[lang];
      if (!c?.postPresent) {
        faqs.issues.push(makeIssue({
          criticality: "P1", area: "blog-translation-missing",
          location: `client/src/data/blog-content/${lang}/${slug}.ts`,
          description: `Blog "${slug}": post no traducido al ${lang} (existe en ES con sección FAQ de ${esCell.qaCount} Q/A)`,
          evidence: `archivo ${lang}/${slug}.ts ausente`,
          languages: [lang], suggestion: `Crear traducción del post (incluye sección FAQ con ${esCell.qaCount} Q/A)`,
        }));
        continue;
      }
      if (!c.hasFaqSection) {
        faqs.issues.push(makeIssue({
          criticality: "P1", area: "blog-faq-section-missing",
          location: `client/src/data/blog-content/${lang}/${slug}.ts`,
          description: `Blog "${slug}" (${lang}): post existe pero no tiene sección FAQ traducida (ES tiene ${esCell.qaCount} Q/A)`,
          evidence: `regex BLOG_FAQ_HEADINGS[${lang}] no coincide`,
          languages: [lang], suggestion: `Añadir sección "${({en:'### Frequently asked questions',fr:'### Questions fréquentes',de:'### Häufige Fragen',pt:'### Perguntas frequentes',ca:'### Preguntes freqüents'})[lang]}" con ${esCell.qaCount} Q/A`,
        }));
      } else if (c.qaCount < esCell.qaCount) {
        faqs.issues.push(makeIssue({
          criticality: "P2", area: "blog-faq-coverage-gap",
          location: `client/src/data/blog-content/${lang}/${slug}.ts`,
          description: `Blog "${slug}" (${lang}): ${c.qaCount} Q/A vs ${esCell.qaCount} en ES`,
          evidence: JSON.stringify({ es: esCell.qaCount, [lang]: c.qaCount }),
          languages: [lang], suggestion: "Alinear cantidad de Q/A con la versión ES",
        }));
      }

      // ── Residuos castellanos en FAQs embebidas (Task #49, 2026-04-22) ──
      // Los tells ya se computaron en `BLOG_FAQ_INVENTORY` reutilizando el
      // mismo `SPANISH_TELLS_BY_LANG` que el audit de FAQs de sistema. Aquí
      // sólo los traducimos a issues. Test de regresión:
      // `scripts/audit-system-seo-faqs.test.mjs`.
      const tells = Array.isArray(c.spanishTells) ? c.spanishTells : [];
      for (const t of tells) {
        const snippet = t.text.length > 160 ? t.text.slice(0, 160) + "…" : t.text;
        faqs.issues.push(makeIssue({
          criticality: "P1", area: "blog-faq-spanish-tells",
          location: `client/src/data/blog-content/${lang}/${slug}.ts`,
          description: `Blog "${slug}" (${lang}): FAQ embebida con residuo castellano en ${t.kind === "question" ? "pregunta" : "respuesta"} #${t.index + 1}`,
          evidence: snippet,
          languages: [lang],
          suggestion: `Traducir el término castellano detectado al ${lang} (mapa SPANISH_TELLS_BY_LANG en scripts/audit-system-seo-faqs.lib.mjs)`,
        }));
      }
    }
  }

  faqs.summary = {
    totalFaqs: FAQ_TOTAL,
    sectionCount: FAQ_SECTIONS.length,
    languages: LANGS.length,
    cellsExpected: FAQ_TOTAL * LANGS.length,
    blogPostsScanned: BLOG_FAQ_INVENTORY.totals.postsScanned,
    blogPostsWithFaqByLang: BLOG_FAQ_INVENTORY.totals.postsWithFaq,
    issuesByCriticality: faqs.issues.reduce((a, x) => (a[x.criticality] = (a[x.criticality] || 0) + 1, a), {}),
    issuesByArea: faqs.issues.reduce((a, x) => (a[x.area] = (a[x.area] || 0) + 1, a), {}),
    totalIssues: faqs.issues.length,
  };
})();
fs.writeFileSync(path.join(OUT, "faqs-audit.json"), JSON.stringify(faqs, null, 2));
console.log(`✓ faqs-audit.json — ${faqs.issues.length} issues across ${FAQ_TOTAL} FAQs × ${LANGS.length} idiomas`);

// ---------------------------------------------------------------------------
// 6) FAQ INDEXACIÓN — evidence-based
// ---------------------------------------------------------------------------
const faqIndex = { generatedAt: new Date().toISOString(), summary: {}, faqPageEvidence: {}, matrix: {}, issues: [] };

(function auditFaqIndexation() {
  // Evidence per /xx/faq URL: rendered HTML, FAQPage JSON-LD validity, sitemap-faq presence,
  // robots.txt allowance, canonical, meta robots, hreflang.
  const faqInboundLinkSources = (() => {
    // Count pages that link to /<lang>/faq via lp("faq") or absolute paths
    const files = listFilesRec(path.join(ROOT, "client/src"), p => p.endsWith(".tsx") || p.endsWith(".ts"));
    const counts = Object.fromEntries(LANGS.map(l => [l, 0]));
    for (const f of files) {
      if (f.endsWith("faq-page.tsx")) continue;
      const src = fs.readFileSync(f, "utf8");
      const usesHelper = /\blp\(\s*"faq"\s*\)/.test(src) || /\blp\(\s*'faq'\s*\)/.test(src);
      if (usesHelper) for (const l of LANGS) counts[l]++;
      for (const l of LANGS) {
        const p = getLocalizedPath("faq", l);
        if (src.includes(`"${p}"`) || src.includes(`'${p}'`) || src.includes(`href="${p}`)) counts[l]++;
      }
    }
    return counts;
  })();

  // Source-of-truth FAQPage entries.
  //
  // Preferred: per-language FAQ_SCHEMA_ENTRIES_I18N (built dynamically from
  // i18n locales by server/faq-schema-i18n.ts). When present we treat each
  // language's set as the SSR payload for /xx/faq.
  //
  // Legacy fallback: the hard-coded ES-only FAQ_SCHEMA_ENTRIES — used only
  // when the per-language module is unavailable so the audit still runs on
  // older builds.
  const sotFaqEntriesByLang = SOT?.FAQ_SCHEMA_ENTRIES_I18N || null;
  const sotFaqEntriesLegacy = SOT?.FAQ_SCHEMA_ENTRIES || [];
  const sotFaqQuestionsByLang = {};
  for (const l of LANGS) {
    const entries = sotFaqEntriesByLang?.[l] || sotFaqEntriesLegacy;
    sotFaqQuestionsByLang[l] = new Set((entries || []).map(e => (e?.name || "").trim()).filter(Boolean));
  }

  for (const lang of LANGS) {
    const p = getLocalizedPath("faq", lang);
    const url = `${SITE_URL}${p}`;
    const r = renderedHtml[p];
    // Live HTML JSON-LD (may be empty in dev — SOT covers that).
    let faqPageJsonLd = null;
    if (r?.parsed) {
      for (const block of r.parsed.jsonLdBlocks) {
        const items = Array.isArray(block) ? block : [block];
        for (const it of items) {
          if (it && (it["@type"] === "FAQPage" || (Array.isArray(it["@type"]) && it["@type"].includes("FAQPage")))) {
            faqPageJsonLd = it; break;
          }
        }
        if (faqPageJsonLd) break;
      }
    }
    const sitemapEntry = sitemapFaq.find(u => u.loc === url);
    const robotsAllowed = robotsAllowsPath(robotsParsed, p);
    const metaRobots = r?.parsed?.robots ?? null;
    const sotMeta = sotMetaForPath(p);

    // SSR FAQPage is unconditional for routeKey==="faq" → always present.
    const ssrFaqPagePresent = true;
    const ssrMainEntityCount = (sotFaqEntriesByLang?.[lang] || sotFaqEntriesLegacy).length;
    // Live HTML augmentation count (post-hydration faq-page.tsx adds more):
    const liveMainEntityCount = faqPageJsonLd?.mainEntity?.length || 0;

    const evidence = {
      url, fetched: !!r?.ok, httpStatus: r?.status ?? null,
      sitemapPresent: !!sitemapEntry,
      sitemapAlternates: sitemapEntry?.alternates?.length || 0,
      sitemapPriority: sitemapEntry?.priority || null,
      robotsTxtAllowed: robotsAllowed,
      metaRobots,
      canonical: sotMeta?.canonical || r?.parsed?.canonical || null,
      canonicalExpected: url,
      hreflangCount: r?.parsed?.hreflangCount || 0,
      ssrFaqPagePresent,
      ssrFaqPageMainEntityCount: ssrMainEntityCount,
      ssrFaqPageLanguage: sotFaqEntriesByLang ? lang : "es",
      liveFaqPageJsonLdPresent: !!faqPageJsonLd,
      liveFaqPageJsonLdMainEntityCount: liveMainEntityCount,
      liveFaqPageJsonLdInLanguage: faqPageJsonLd?.inLanguage || null,
      inboundInternalLinks: faqInboundLinkSources[lang],
    };
    faqIndex.faqPageEvidence[lang] = evidence;

    // Per-FAQ matrix (granular, but issue rollup happens after the loop)
    const langSummary = {
      faqsTotal: FAQ_TOTAL,
      faqsTranslated: 0,
      faqsInSsrJsonLd: 0,
      faqsInLiveJsonLd: 0,
    };
    for (const sec of FAQ_SECTIONS) {
      for (const id of sec.ids) {
        if (!faqIndex.matrix[id]) faqIndex.matrix[id] = {};
        const q = extractI18nValue(lang, "faqData", "questions", id);
        const a = extractI18nValue(lang, "faqData", "answers", id);
        const qNorm = (q || "").trim();
        const inSsrJsonLd = !!qNorm && sotFaqQuestionsByLang[lang].has(qNorm);
        const inLiveJsonLd = !!qNorm && !!(faqPageJsonLd?.mainEntity || []).find(e => e?.name && e.name.trim() === qNorm);
        const cell = {
          url, anchor: `#${id}`,
          translationPresent: !!q && !!a,
          questionLen: q ? q.length : 0,
          answerLen: a ? a.length : 0,
          schemaSsrFaqPagePresent: ssrFaqPagePresent,
          schemaContainsThisFaqInSsr: inSsrJsonLd,
          schemaContainsThisFaqInLive: inLiveJsonLd,
          ssrSchemaLanguage: sotFaqEntriesByLang ? lang : "es",
          inSitemap: evidence.sitemapPresent,
          sitemapShard: "sitemap-faq.xml",
          hreflangAlternatesInSitemap: evidence.sitemapAlternates,
          hreflangAlternatesInHtml: evidence.hreflangCount,
          metaRobotsNoindex: !!(metaRobots && /noindex/i.test(metaRobots)),
          robotsTxtAllowed: robotsAllowed,
          canonical: evidence.canonical,
          canonicalMatchesExpected: evidence.canonical === evidence.canonicalExpected,
          inboundInternalLinks: evidence.inboundInternalLinks,
          status: "OK", actions: [],
        };
        if (cell.translationPresent) langSummary.faqsTranslated++;
        if (inSsrJsonLd) langSummary.faqsInSsrJsonLd++;
        if (inLiveJsonLd) langSummary.faqsInLiveJsonLd++;
        const blocking = [];
        if (!cell.translationPresent) blocking.push("Q/A vacía en este idioma");
        if (!inSsrJsonLd && !inLiveJsonLd && cell.translationPresent) blocking.push("FAQ no aparece en mainEntity (ni SSR ni cliente)");
        if (!cell.inSitemap) blocking.push("URL no presente en sitemap-faq.xml");
        if (cell.metaRobotsNoindex) blocking.push("meta robots noindex");
        if (!cell.robotsTxtAllowed) blocking.push("robots.txt bloquea esta URL");
        if (!cell.canonicalMatchesExpected) blocking.push(`canonical ${cell.canonical || "ausente"} ≠ esperado ${evidence.canonicalExpected}`);
        if (cell.inboundInternalLinks === 0) blocking.push("sin enlaces internos entrantes");
        if (blocking.length) { cell.status = "ATTENTION"; cell.actions = blocking; }
        faqIndex.matrix[id][lang] = cell;
      }
    }

    // ─── Roll up issues per language by root cause (not per FAQ) ───────────
    // This avoids the 470-issue noise when a single config gap (e.g. only ES
    // questions in FAQ_SCHEMA_ENTRIES) cascades across all 79 FAQs.
    const missingFromSsr = FAQ_SECTIONS.flatMap(sec => sec.ids).filter(id => {
      const c = faqIndex.matrix[id]?.[lang];
      return c && c.translationPresent && !c.schemaContainsThisFaqInSsr;
    });
    const untranslated = FAQ_SECTIONS.flatMap(sec => sec.ids).filter(id => {
      const c = faqIndex.matrix[id]?.[lang];
      return c && !c.translationPresent;
    });

    // Root cause #1: SSR mainEntity coverage gap (the big one)
    if (missingFromSsr.length > 0) {
      const sample = missingFromSsr.slice(0, 8);
      const isLanguageMismatch = lang !== "es" && langSummary.faqsInSsrJsonLd === 0;
      faqIndex.issues.push(makeIssue({
        criticality: "P0", area: "faq-indexation-ssr-coverage",
        location: `${url} (FAQ_SCHEMA_ENTRIES en server/seo-content.ts)`,
        description: isLanguageMismatch
          ? `FAQ/${lang}: 0 de ${langSummary.faqsTranslated} preguntas traducidas aparecen en el JSON-LD SSR (FAQ_SCHEMA_ENTRIES está hard-codeado en ES y se sirve para todos los idiomas)`
          : `FAQ/${lang}: ${missingFromSsr.length} de ${langSummary.faqsTranslated} preguntas traducidas no aparecen en el mainEntity SSR`,
        evidence: JSON.stringify({
          ssrEntriesTotal: ssrMainEntityCount,
          ssrLanguage: "es",
          translationsExisting: langSummary.faqsTranslated,
          ssrCoverage: langSummary.faqsInSsrJsonLd,
          missingIds: sample,
          missingTotal: missingFromSsr.length,
        }),
        languages: [lang],
        suggestion: isLanguageMismatch
          ? "Hacer FAQ_SCHEMA_ENTRIES dependiente del idioma (Record<lang, entries[]>) y usar el bucket correcto en injectMeta()"
          : `Ampliar FAQ_SCHEMA_ENTRIES con las ${missingFromSsr.length} preguntas faltantes (actualmente solo ${ssrMainEntityCount} de ${FAQ_TOTAL})`,
      }));
    }

    // Root cause #2: per-language untranslated FAQs (still per-language, not per-FAQ)
    if (untranslated.length > 0) {
      faqIndex.issues.push(makeIssue({
        criticality: "P0", area: "faq-indexation-translation-gap",
        location: `client/src/i18n/locales/${lang}.ts › faqData.questions/answers`,
        description: `FAQ/${lang}: ${untranslated.length} de ${FAQ_TOTAL} FAQs sin traducir (Q o A vacías)`,
        evidence: JSON.stringify({ sample: untranslated.slice(0, 10), total: untranslated.length }),
        languages: [lang],
        suggestion: "Añadir traducciones profesionales para las preguntas y respuestas listadas",
      }));
    }

    // Root cause #3: per-language sitemap entry missing
    if (!evidence.sitemapPresent) {
      faqIndex.issues.push(makeIssue({
        criticality: "P0", area: "faq-indexation-sitemap",
        location: url,
        description: `FAQ/${lang}: URL ${url} no presente en sitemap-faq.xml`,
        evidence: JSON.stringify({ shardOk: liveSitemaps.faq?.ok, shardCount: sitemapFaq.length }),
        languages: [lang],
        suggestion: "Añadir loc + alternates hreflang a sitemap-faq.xml en server/routes/public.ts",
      }));
    }

    // Root cause #4: canonical mismatch (only emit if SOT has a canonical we can compare against)
    if (sotMeta?.canonical && sotMeta.canonical !== evidence.canonicalExpected) {
      faqIndex.issues.push(makeIssue({
        criticality: "P0", area: "faq-indexation-canonical",
        location: `${url} (SOT canonical)`,
        description: `FAQ/${lang}: canonical SOT "${sotMeta.canonical}" ≠ URL real "${evidence.canonicalExpected}"`,
        evidence: JSON.stringify({ sot: sotMeta.canonical, expected: evidence.canonicalExpected }),
        languages: [lang],
        suggestion: "Asegurar que PAGE_META_I18N[/<lang>/faq].canonical coincide con la URL absoluta del idioma",
      }));
    }

    // Root cause #5: meta robots noindex on a public route
    if (metaRobots && /noindex/i.test(metaRobots)) {
      faqIndex.issues.push(makeIssue({
        criticality: "P0", area: "faq-indexation-noindex",
        location: url,
        description: `FAQ/${lang}: meta robots noindex en una ruta pública`,
        evidence: metaRobots, languages: [lang],
        suggestion: "Eliminar noindex en server/seo-content.ts para esta ruta",
      }));
    }

    // Root cause #6: robots.txt blocks this language route
    if (!robotsAllowed) {
      faqIndex.issues.push(makeIssue({
        criticality: "P0", area: "faq-indexation-robots-blocked",
        location: "/robots.txt",
        description: `FAQ/${lang}: robots.txt bloquea ${p}`,
        evidence: JSON.stringify({ disallow: robotsParsed.userAgents.find(g => g.agent === "*")?.disallow || [] }),
        languages: [lang],
        suggestion: "Quitar la regla Disallow que cubre esta ruta",
      }));
    }

    // Root cause #7: no inbound internal links (P1, not blocking but big SEO smell)
    if (evidence.inboundInternalLinks === 0) {
      faqIndex.issues.push(makeIssue({
        criticality: "P1", area: "faq-indexation-no-inbound",
        location: url,
        description: `FAQ/${lang}: ${url} sin enlaces internos entrantes detectados desde client/src/**`,
        evidence: `grep de href="${p}" + lp("faq") en cliente = 0`,
        languages: [lang],
        suggestion: "Añadir enlaces contextuales desde servicios y blog hacia la FAQ",
      }));
    }

    // Per-language summary attached to evidence for downstream consumers
    evidence.summary = langSummary;
  }

  // Per-language summary
  const byLang = {};
  for (const lang of LANGS) {
    let ok = 0, attn = 0;
    for (const id of Object.keys(faqIndex.matrix)) {
      const c = faqIndex.matrix[id][lang];
      if (c.status === "OK") ok++; else attn++;
    }
    byLang[lang] = { totalFaqs: FAQ_TOTAL, ok, needsAttention: attn };
  }

  faqIndex.summary = {
    totalFaqs: FAQ_TOTAL, languages: LANGS.length, cells: FAQ_TOTAL * LANGS.length,
    architectureNote: "FAQPage JSON-LD se emite client-side por /xx/faq y agrupa todas las Q/A en mainEntity. El status por celda combina presencia de la Q/A en mainEntity, presencia en sitemap, robots.txt, canonical, meta robots y enlaces internos.",
    byLang,
    issuesByCriticality: faqIndex.issues.reduce((a, x) => (a[x.criticality] = (a[x.criticality] || 0) + 1, a), {}),
    issuesByArea: faqIndex.issues.reduce((a, x) => (a[x.area] = (a[x.area] || 0) + 1, a), {}),
    totalIssues: faqIndex.issues.length,
  };
})();
fs.writeFileSync(path.join(OUT, "faqs-indexacion.json"), JSON.stringify(faqIndex, null, 2));
console.log(`✓ faqs-indexacion.json — ${faqIndex.issues.length} issues across ${FAQ_TOTAL * LANGS.length} celdas`);

// ---------------------------------------------------------------------------
// 7) RESUMEN.md
// ---------------------------------------------------------------------------
const allIssues = [
  ...sistema.issues, ...documentos.issues, ...seo.issues, ...sitemap.issues, ...faqs.issues, ...faqIndex.issues,
];
const counts = {
  P0: allIssues.filter(i => i.criticality === "P0").length,
  P1: allIssues.filter(i => i.criticality === "P1").length,
  P2: allIssues.filter(i => i.criticality === "P2").length,
};
const top10 = [...allIssues]
  .sort((a, b) => (a.criticality === b.criticality ? 0 : a.criticality < b.criticality ? -1 : 1))
  .slice(0, 10);

const indexTable = LANGS.map(l => {
  const s = faqIndex.summary.byLang[l];
  return `| ${l.toUpperCase()} | ${s.totalFaqs} | ${s.ok} | ${s.needsAttention} |`;
}).join("\n");

const resumen = `# Auditoría sistema, SEO, sitemap y FAQs — Resumen ejecutivo

Generado: ${new Date().toISOString()}
Servidor analizado: ${BASE_URL} (origin sitemap: ${SITE_URL})

## Conteos por área
| Área | Total | P0 | P1 | P2 |
|---|---:|---:|---:|---:|
| Sistema (consistencia) | ${sistema.issues.length} | ${sistema.summary.issuesByCriticality?.P0 || 0} | ${sistema.summary.issuesByCriticality?.P1 || 0} | ${sistema.summary.issuesByCriticality?.P2 || 0} |
| Documentos legales | ${documentos.issues.length} | ${documentos.summary.issuesByCriticality?.P0 || 0} | ${documentos.summary.issuesByCriticality?.P1 || 0} | ${documentos.summary.issuesByCriticality?.P2 || 0} |
| SEO técnico | ${seo.issues.length} | ${seo.summary.issuesByCriticality?.P0 || 0} | ${seo.summary.issuesByCriticality?.P1 || 0} | ${seo.summary.issuesByCriticality?.P2 || 0} |
| Sitemap | ${sitemap.issues.length} | ${sitemap.summary.issuesByCriticality?.P0 || 0} | ${sitemap.summary.issuesByCriticality?.P1 || 0} | ${sitemap.summary.issuesByCriticality?.P2 || 0} |
| FAQs (contenido) | ${faqs.issues.length} | ${faqs.summary.issuesByCriticality?.P0 || 0} | ${faqs.summary.issuesByCriticality?.P1 || 0} | ${faqs.summary.issuesByCriticality?.P2 || 0} |
| FAQs indexación | ${faqIndex.issues.length} | ${faqIndex.summary.issuesByCriticality?.P0 || 0} | ${faqIndex.summary.issuesByCriticality?.P1 || 0} | ${faqIndex.summary.issuesByCriticality?.P2 || 0} |
| **Total** | **${allIssues.length}** | **${counts.P0}** | **${counts.P1}** | **${counts.P2}** |

## Inventario de URLs (sitemap real)
- sitemap-pages.xml: ${sitemapPages.length} URLs
- sitemap-faq.xml:   ${sitemapFaq.length} URLs
- sitemap-blog.xml:  ${sitemapBlog.length} URLs
- Total catalogado en \`sitemap-completo.json\`: ${sitemap.urls.length} (incluye blog posts y blog index)

## Estado de indexación de FAQs por idioma
| Idioma | FAQs | OK | Necesita atención |
|---|---:|---:|---:|
${indexTable}

> Nota arquitectónica: el JSON-LD FAQPage se construye **client-side** en \`client/src/pages/faq-page.tsx\` y agrupa todas las \`useFaqSections()\` en \`mainEntity\`. Una única URL por idioma (\`/xx/faq\`) cubre las ${FAQ_TOTAL} Q/A; los anchors \`#id\` son fragments SPA. El estado por celda se valida cruzando la traducción i18n, la presencia en \`mainEntity\` del JSON-LD renderizado, la presencia en \`sitemap-faq.xml\`, las reglas de \`robots.txt\`, el \`canonical\` real y los enlaces internos entrantes.

## Top 10 hallazgos
${top10.map((i, n) => `${n + 1}. **[${i.criticality}] ${i.area}** — ${i.description} _(\`${i.location}\`)_`).join("\n")}

## Plan de corrección priorizado

### P0 — Bloqueantes (0–7 días)
- Reparar todas las celdas \`faqs-indexacion.json\` con status \`ATTENTION\` (especialmente JSON-LD ausente, FAQ no presente en \`mainEntity\` o canonical incorrecto).
- Resolver placeholders/faltantes en \`faqs-audit.json\` y \`documentos-audit.json\`.
- Garantizar que cada página de servicio/legal tiene \`<title>\`, meta description, canonical absoluto y JSON-LD aplicable (ver \`seo-audit.json\` áreas \`title-missing\`, \`meta-description-missing\`, \`canonical-*\`).
- Eliminar cualquier shard de sitemap inaccesible (\`sitemap-completo.json\` › \`shard-unreachable\`).

### P1 — Alto impacto (1–4 semanas)
- Igualar la estructura (<h2>) de los documentos legales en los 6 idiomas con la base ES.
- Normalizar prioridades del sitemap a la jerarquía sugerida (home > servicios > FAQ > legales).
- Eliminar duplicados i18n top-level y rellenar secciones huérfanas (\`sistema-audit.json\`).
- Verificar al menos un enlace interno entrante por FAQ-page por idioma.
- Localizar terminología fiscal en FAQs marcadas con \`language-leak\`.
- Garantizar OG/Twitter completos (\`seo-audit.json\` › \`open-graph\`, \`twitter-card\`).

### P2 — Optimización (4–8 semanas)
- Acortar títulos SEO que excedan 60 caracteres y enriquecer descripciones <70.
- Añadir fechas de "Última actualización" a documentos legales que no las declaran.
- Limpieza de componentes/utilidades sin importadores.
- Documentar duplicaciones intencionales entre \`server/seo-content.ts\` y \`client/src/data\`.

## Reportes generados
- \`sistema-audit.json\`
- \`documentos-audit.json\`
- \`seo-audit.json\` (con \`pages[]\` por ruta×idioma: title/desc/H1/canonical/hreflang/OG/Twitter/JSON-LD types)
- \`sitemap-completo.json\` (incluye URLs de blog posts del sitemap real)
- \`faqs-audit.json\`
- \`faqs-indexacion.json\` (matriz FAQ×idioma con evidencia: JSON-LD mainEntity, sitemap, robots, canonical, inbound links)

## Alcance y método
Auditoría puramente diagnóstica. El script \`exentax-web/scripts/audit-system-seo-faqs.mjs\` no modifica código del sitio. Recolecta evidencia desde el servidor en ejecución (sitemaps, robots, HTML renderizado) y desde el código fuente (locales, faq-data, routes). Las heurísticas (longitud, fugas idiomáticas, comparación con ES) son orientativas; cada issue debe verificarse manualmente antes de corregir. Re-ejecutable con \`node exentax-web/scripts/audit-system-seo-faqs.mjs\` (BASE_URL configurable).
`;

fs.writeFileSync(path.join(OUT, "RESUMEN.md"), resumen);
console.log(`✓ RESUMEN.md — ${allIssues.length} issues totales (P0=${counts.P0}, P1=${counts.P1}, P2=${counts.P2})`);
console.log(`\nReportes en: ${rel(OUT)}`);
