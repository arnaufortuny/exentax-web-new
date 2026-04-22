#!/usr/bin/env node
/*
 * seo-indexing-audit.mjs
 * ----------------------------------------------------------------------------
 * Per-URL × per-language indexing audit. For every public URL we expect to be
 * indexable, the script verifies — against actual server output, not just
 * source heuristics — that:
 *
 *   • the URL is listed in the appropriate child sitemap (pages/blog/faq);
 *   • the sitemap entry carries the right priority/changefreq/lastmod and
 *     a complete xhtml:link hreflang block (every available lang +
 *     x-default → /es/...);
 *   • hreflang is reciprocal (every alternate the URL declares lists it
 *     back as an alternate);
 *   • robots.txt does not match the URL with a Disallow rule;
 *   • the URL has at least one inbound navigational link from the React
 *     component tree (computed by seo-orphans.mjs);
 *   • when BASE_URL is set, the URL responds 200 and every alternate URL
 *     it declares also responds 200.
 *
 * Notes on canonical / JSON-LD / single-H1: this is a Vite SPA, so those
 * tags are emitted client-side after hydration. They are statically
 * verified by `seo-task4-check.mjs` (canonical, hreflang, JSON-LD shape)
 * and `seo-faq-jsonld-check.mjs` (FAQPage); we link to those checks in
 * the report rather than fetch a headless browser here.
 *
 * Output: a markdown report at docs/indexing-audit-2026-04.md (or argv[2]).
 * Exit 0 iff every row is green.
 * ----------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
// Default to the local dev server so live HTTP probing always runs. Override
// with BASE_URL=... (or pass an empty string to opt out of live probing).
const BASE_URL = (process.env.BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");
const RENDER_MODE = process.argv.includes("--render");
const OUT = (process.argv.find((a, i) => i >= 2 && !a.startsWith("--"))) || resolve(ROOT, "docs/indexing-audit-2026-04.md");

function read(rel) { return existsSync(resolve(ROOT, rel)) ? readFileSync(resolve(ROOT, rel), "utf8") : ""; }

// ---------- 1. Build expected URL universe (mirrors seo-orphans.mjs). -----
const routesSrc = read("shared/routes.ts");
const routeSlugs = {};
{
  const block = routesSrc.match(/ROUTE_SLUGS[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  if (block) {
    const lineRe = /(\w+):\s*\{([^}]+)\}/g;
    let m;
    while ((m = lineRe.exec(block[1]))) {
      const inner = m[2]; const slugs = {};
      for (const lang of LANGS) {
        const sm = inner.match(new RegExp(`\\b${lang}\\s*:\\s*"([^"]*)"`));
        if (sm) slugs[lang] = sm[1];
      }
      routeSlugs[m[1]] = slugs;
    }
  }
}
function localizedPath(key, lang) {
  const slug = routeSlugs[key]?.[lang];
  if (slug === undefined) return null;
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

const blogPostsSrc = read("client/src/data/blog-posts.ts");
const blogSlugs = [...blogPostsSrc.matchAll(/^\s*slug:\s*["']([^"']+)["']/gm)].map((x) => x[1]);
const slugMapSrc = read("client/src/data/blog-posts-slugs.ts");
function getTranslatedSlug(slug, lang) {
  const re = new RegExp(`["']${slug}["']\\s*:\\s*\\{([^}]*)\\}`);
  const m = slugMapSrc.match(re);
  if (!m) return slug;
  const lm = m[1].match(new RegExp(`\\b${lang}\\s*:\\s*["']([^"']+)["']`));
  return lm ? lm[1] : slug;
}
const blogAvailable = {};
for (const lang of LANGS) {
  blogAvailable[lang] = new Set();
  const dir = resolve(ROOT, `client/src/data/blog-content/${lang}`);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) if (f.endsWith(".ts")) blogAvailable[lang].add(f.slice(0, -3));
}

// expected[url] = { kind, lang, sitemap, esUrl }
const expected = new Map();
function add(url, meta) { if (!expected.has(url)) expected.set(url, meta); }
for (const key of Object.keys(routeSlugs)) {
  if (key === "faq") continue;
  for (const lang of LANGS) {
    const p = localizedPath(key, lang); if (!p) continue;
    add(p, { kind: "page", lang, sitemap: "/sitemap-pages.xml", esUrl: localizedPath(key, "es") });
  }
}
for (const lang of LANGS) {
  add(`/${lang}/blog`, { kind: "blog-index", lang, sitemap: "/sitemap-pages.xml", esUrl: "/es/blog" });
}
for (const lang of LANGS) {
  add(localizedPath("faq", lang), { kind: "faq", lang, sitemap: "/sitemap-faq.xml", esUrl: localizedPath("faq", "es") });
}
for (const slug of blogSlugs) {
  for (const lang of LANGS) {
    if (!blogAvailable[lang]?.has(slug)) continue;
    add(`/${lang}/blog/${getTranslatedSlug(slug, lang)}`, {
      kind: "blog-post", lang, sitemap: "/sitemap-blog.xml",
      esUrl: `/es/blog/${getTranslatedSlug(slug, "es")}`,
    });
  }
}

// ---------- 2. Robots parsing -------------------------------------------
function buildRobotsMatcher(robotsTxt) {
  const disallows = robotsTxt.split(/\r?\n/).filter((l) => /^Disallow:/i.test(l)).map((l) => l.replace(/^Disallow:\s*/i, "").trim()).filter(Boolean);
  return (url) => {
    for (const d of disallows) {
      if (d.includes("*")) {
        const re = new RegExp("^" + d.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*"));
        if (re.test(url)) return d;
      } else if (url.startsWith(d)) return d;
    }
    return null;
  };
}

let robotsTxt = "";
let robotsMatcher = () => null;

// ---------- 3. Sitemap fetcher + parser ---------------------------------
function parseUrlEntries(xml) {
  // Returns Map<loc, { priority, changefreq, lastmod, alternates: Map<lang,href> }>
  const out = new Map();
  const blocks = xml.split(/<url>/).slice(1);
  for (const raw of blocks) {
    const block = raw.split("</url>")[0];
    const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) continue;
    const priority = (block.match(/<priority>([^<]+)<\/priority>/) || [])[1] || "";
    const changefreq = (block.match(/<changefreq>([^<]+)<\/changefreq>/) || [])[1] || "";
    const lastmod = (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || "";
    const alternates = new Map();
    for (const m of block.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)) {
      alternates.set(m[1], m[2]);
    }
    out.set(loc, { priority, changefreq, lastmod, alternates });
  }
  return out;
}
function parseSitemapIndex(xml) {
  const children = [];
  for (const m of xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>([\s\S]*?)<\/sitemap>/g)) {
    const loc = m[1];
    const lastmod = (m[2].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || "";
    children.push({ loc, lastmod });
  }
  return children;
}

const sitemapEntries = new Map(); // absolute loc → entry
const sitemapByPath = new Map();  // path-only → entry
let sitemapIndexChildren = [];

async function loadSitemaps() {
  if (!BASE_URL) return;
  const idxXml = await fetch(`${BASE_URL}/sitemap.xml`).then(r => r.text());
  sitemapIndexChildren = parseSitemapIndex(idxXml);
  // Always fetch the three known children regardless of order.
  const childUrls = ["/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"];
  for (const child of childUrls) {
    const xml = await fetch(`${BASE_URL}${child}`).then(r => r.text());
    const entries = parseUrlEntries(xml);
    for (const [loc, entry] of entries) {
      sitemapEntries.set(loc, { ...entry, sourceSitemap: child });
      try {
        const u = new URL(loc);
        sitemapByPath.set(u.pathname, { ...entry, sourceSitemap: child });
      } catch {}
    }
  }
  robotsTxt = await fetch(`${BASE_URL}/robots.txt`).then(r => r.text());
  robotsMatcher = buildRobotsMatcher(robotsTxt);
}

// ---------- 4. Inbound link counts via seo-orphans.mjs ------------------
function loadInbound() {
  const r = spawnSync("node", [resolve(__dirname, "seo-orphans.mjs"), "--json"], { encoding: "utf8" });
  const idx = r.stdout.indexOf("---JSON---");
  if (idx < 0) return { inbound: {}, orphans: [] };
  try {
    const payload = JSON.parse(r.stdout.slice(idx + "---JSON---".length).trim());
    return payload;
  } catch { return { inbound: {}, orphans: [] }; }
}
const linkGraph = loadInbound();

// ---------- 5. HTTP probe (with concurrency) ----------------------------
async function fetchStatus(path) {
  if (!BASE_URL) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: ctrl.signal, redirect: "manual", method: "GET" });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location") || "?";
      return `REDIR:${res.status}→${loc}`;
    }
    return res.status;
  } catch (e) {
    return `ERR:${e?.message || e}`;
  } finally { clearTimeout(t); }
}

async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

await loadSitemaps();

// ---------- Live HTML extractor (raw + optional Playwright) -------------
// We always do a raw GET to capture HTTP status and parse what's in the
// response body (works fully if SSR'd; on a Vite SPA the body is the
// unhydrated index.html — canonical/H1/JSON-LD will be missing and the
// per-row check falls back to the static formula derived from sources).
//
// When --render is passed, we additionally try to load Playwright via
// dynamic import. If Playwright is not installed we DO NOT install it
// (per task spec); we mark the report with the limitation and stay in
// raw mode.
let playwrightBrowser = null;
let renderModeActive = false;
let renderModeNote = "";
if (RENDER_MODE) {
  try {
    const pw = await import("playwright");
    playwrightBrowser = await pw.chromium.launch();
    renderModeActive = true;
    renderModeNote = "✅ Playwright chromium (hydrated DOM)";
    console.log("Live render mode: Playwright chromium launched.");
  } catch (err) {
    renderModeNote = `⚠ --render requested but Playwright not available (${err?.message?.slice(0, 80) || "import failed"}). Falling back to raw HTML + static formula.`;
    console.warn(renderModeNote);
  }
} else {
  renderModeNote = "Static fallback mode (raw HTML + source-derived expectations). Pass --render with Playwright installed for hydrated DOM checks.";
}

function parseHtmlSeo(html) {
  if (!html || typeof html !== "string") return { canonical: "", h1Count: 0, jsonLdBlocks: [] };
  // canonical
  const canonMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
  let canonical = "";
  if (canonMatch) {
    const hrefMatch = canonMatch[0].match(/href=["']([^"']+)["']/i);
    if (hrefMatch) canonical = hrefMatch[1];
  }
  // h1 count
  const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;
  // jsonld blocks
  const jsonLdBlocks = [];
  const blocks = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of blocks) {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) jsonLdBlocks.push(...parsed);
      else jsonLdBlocks.push(parsed);
    } catch { /* ignore malformed */ }
  }
  return { canonical, h1Count, jsonLdBlocks };
}

async function fetchLive(path) {
  if (!BASE_URL) return null;
  const url = `${BASE_URL}${path}`;
  // Always do raw fetch so we get HTTP status + raw body.
  let status = null, rawHtml = "", err = null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow", method: "GET" });
    status = res.status;
    rawHtml = await res.text();
  } catch (e) {
    err = e?.message || String(e);
  } finally { clearTimeout(t); }

  let renderedHtml = "";
  if (renderModeActive && status && status >= 200 && status < 300) {
    try {
      const ctx = await playwrightBrowser.newContext();
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
      renderedHtml = await page.content();
      await ctx.close();
    } catch (e) {
      // keep going with raw only; per-cell will reflect missing fields
    }
  }
  const html = renderedHtml || rawHtml;
  const seo = parseHtmlSeo(html);
  return { status: err ? `ERR:${err}` : status, rawSeo: parseHtmlSeo(rawHtml), seo, hasRender: !!renderedHtml };
}

const httpStatuses = new Map();
const liveSeo = new Map();
if (BASE_URL) {
  const allPaths = [...expected.keys()];
  console.log(`Probing ${allPaths.length} URLs (concurrency=${renderModeActive ? 4 : 24}) ...`);
  const results = await pool(allPaths, renderModeActive ? 4 : 24, fetchLive);
  allPaths.forEach((p, i) => {
    const r = results[i];
    if (!r) return;
    httpStatuses.set(p, r.status);
    liveSeo.set(p, r);
  });
}
if (playwrightBrowser) await playwrightBrowser.close().catch(() => {});

// ---------- 6. Per-URL audit -------------------------------------------
const ABS = (p) => `${BASE_URL}${p}`;
const PATH_OF = (loc) => { try { return new URL(loc).pathname; } catch { return loc; } };

const rows = [];
let red = 0;

const expectedPolicy = {
  page: { priority: ["1.0", "0.9", "0.6"], changefreq: ["weekly", "monthly"] },
  "blog-index": { priority: ["0.8"], changefreq: ["weekly"] },
  faq: { priority: ["0.7"], changefreq: ["monthly"] },
  "blog-post": { priority: [], changefreq: [] }, // accept whatever the blog generator sets
};
const META_LIMITS = { TITLE_MAX: 60, DESC_MAX: 155 };

// ---------- Per-route meta + page component static analysis -------------
const I18N_DIR = resolve(ROOT, "client/src/i18n/locales");
const ROUTE_TO_NS = {
  home: "homePage", our_services: "serviciosPage", how_we_work: "comoFuncionaPage",
  about_llc: "llcUsPage", faq: "faqPage", book: "reservarPage",
  legal_terms: "terminos", legal_privacy: "privacidad", legal_cookies: "cookies",
  legal_refunds: "reembolsos", legal_disclaimer: "disclaimer",
};
function readLocaleSEO(lang, ns) {
  const src = read(`client/src/i18n/locales/${lang}.ts`);
  const rx = new RegExp(`\\b${ns}\\s*:\\s*\\{[\\s\\S]*?seoTitle\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"[\\s\\S]*?(?:seoDesc|seoDescription)\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const m = src.match(rx);
  return m ? { title: m[1], description: m[2] } : null;
}
const BLOG_META_PATH = {
  es: "client/src/data/blog-posts.ts",
  en: "client/src/data/blog-i18n/en.ts", fr: "client/src/data/blog-i18n/fr.ts",
  de: "client/src/data/blog-i18n/de.ts", pt: "client/src/data/blog-i18n/pt.ts",
  ca: "client/src/data/blog-i18n/ca.ts",
};
const blogMetaCache = {};
function readBlogMeta(slug, lang) {
  if (!blogMetaCache[lang]) {
    const src = read(BLOG_META_PATH[lang]);
    const cache = {};
    const rx = lang === "es"
      ? /slug:\s*"([a-z0-9-]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?metaTitle:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?metaDescription:\s*"((?:[^"\\]|\\.)*)"/g
      : /"([a-z0-9-]+)":\s*\{[^}]*?title:\s*"((?:[^"\\]|\\.)*)"[^}]*?metaTitle:\s*"((?:[^"\\]|\\.)*)",\s*metaDescription:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = rx.exec(src))) {
      // ES capture groups: 1=slug,2=title,3=metaTitle,4=metaDescription
      // non-ES capture groups: 1=slug,2=title,3=metaTitle,4=metaDescription
      cache[m[1]] = { title: m[3], description: m[4], displayTitle: m[2] };
    }
    blogMetaCache[lang] = cache;
  }
  return blogMetaCache[lang][slug] || null;
}

// Per-blog-post publishedAt extracted from blog-posts.ts (ES only owns dates).
const blogDates = {};
{
  const src = read("client/src/data/blog-posts.ts");
  const rx = /slug:\s*"([a-z0-9-]+)"[\s\S]*?publishedAt:\s*"([^"]+)"(?:[\s\S]*?updatedAt:\s*"([^"]+)")?/g;
  let m;
  while ((m = rx.exec(src))) blogDates[m[1]] = { publishedAt: m[2], updatedAt: m[3] || m[2] };
}

// Page-component → single <h1> static check
const PAGE_FILE_BY_ROUTE = {
  home: ["client/src/pages/home.tsx"],
  our_services: ["client/src/pages/services.tsx"],
  how_we_work: ["client/src/pages/how-we-work.tsx"],
  about_llc: ["client/src/pages/about-llc.tsx"],
  faq: ["client/src/pages/faq-page.tsx"],
  book: ["client/src/pages/book.tsx"],
  legal_terms: ["client/src/pages/legal/terms.tsx"],
  legal_privacy: ["client/src/pages/legal/privacy.tsx"],
  legal_cookies: ["client/src/pages/legal/cookies.tsx"],
  legal_refunds: ["client/src/pages/legal/refunds.tsx"],
  legal_disclaimer: ["client/src/pages/legal/disclaimer.tsx"],
  blogIndex: ["client/src/pages/blog/index.tsx"],
  blogPost: ["client/src/pages/blog/post.tsx"],
};
function resolveAlias(spec) {
  if (spec.startsWith("@/")) return `client/src/${spec.slice(2)}`;
  return null;
}
function tryReadComponent(base) {
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    try { return read(base + ext); } catch { /* keep trying */ }
  }
  return "";
}
const h1Cache = {};
function countH1(routeKey) {
  if (routeKey in h1Cache) return h1Cache[routeKey];
  const files = PAGE_FILE_BY_ROUTE[routeKey] || [];
  let n = 0;
  for (const f of files) {
    const src = read(f);
    n += (src.match(/<h1[\s>]/g) || []).length;
    // Walk one level of @/components/sections/* imports for H1s rendered in sections.
    const importRx = /import\s+(?:[\w*\s{},]+)\s+from\s+["'](@\/(?:components\/sections|components\/sectionsmenu|components\/legal|components)\/[^"']+)["']/g;
    let m;
    while ((m = importRx.exec(src))) {
      const rel = resolveAlias(m[1]);
      if (!rel) continue;
      const sub = tryReadComponent(rel);
      n += (sub.match(/<h1[\s>]/g) || []).length;
    }
  }
  h1Cache[routeKey] = n;
  return n;
}
// Static check: SEO.tsx canonical formula must still be BASE_URL + localized path.
const seoSrc = (() => { try { return read("client/src/components/SEO.tsx"); } catch { return ""; } })();
const canonicalFormulaOk =
  /canonicalUrl\s*=[\s\S]{0,200}getLocalizedPath\(/.test(seoSrc) &&
  /link\[rel="canonical"\]/.test(seoSrc);

// Static check: per-page-kind JSON-LD type emission.
const jsonLdCache = {};
function jsonLdEmittedFor(kind) {
  if (jsonLdCache[kind]) return jsonLdCache[kind];
  const types = new Set();
  const filesByKind = {
    "blog-post": ["client/src/pages/blog/post.tsx", "client/src/components/SEO.tsx"],
    "faq": ["client/src/pages/faq-page.tsx", "client/src/components/SEO.tsx"],
    "blog-index": ["client/src/pages/blog/index.tsx", "client/src/components/SEO.tsx"],
    "page": ["client/src/components/SEO.tsx"],
  };
  for (const f of filesByKind[kind] || []) {
    const src = (() => { try { return read(f); } catch { return ""; } })();
    for (const m of src.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)) types.add(m[1]);
  }
  jsonLdCache[kind] = types;
  return types;
}

function pageHasNoindex(routeKey) {
  // SPA noindex would be set in the page component or its SEO call.
  for (const f of PAGE_FILE_BY_ROUTE[routeKey] || []) {
    const src = read(f);
    if (/noindex\s*[:=]\s*\btrue\b/.test(src) || /name=["']robots["']\s*content=["'][^"']*noindex/i.test(src)) {
      return true;
    }
  }
  return false;
}

for (const [url, meta] of expected) {
  const c = {};
  // Sitemap presence + per-URL data
  const entry = sitemapByPath.get(url);
  if (!entry) {
    c.sitemap = `❌ missing from ${meta.sitemap}`;
    c.priority = "—"; c.changefreq = "—"; c.lastmod = "—";
    c.hreflang = "—"; c.reciprocal = "—";
  } else {
    if (entry.sourceSitemap !== meta.sitemap) {
      c.sitemap = `❌ wrong sitemap: found in ${entry.sourceSitemap}, expected ${meta.sitemap}`;
    } else {
      c.sitemap = `✅ ${entry.sourceSitemap}`;
    }
    c.priority = entry.priority || "—";
    c.changefreq = entry.changefreq || "—";
    c.lastmod = entry.lastmod || "—";
    // priority/changefreq policy
    const pol = expectedPolicy[meta.kind];
    if (pol && pol.priority.length && !pol.priority.includes(entry.priority)) {
      c.priority = `❌ ${entry.priority || "missing"}`;
    }
    if (pol && pol.changefreq.length && !pol.changefreq.includes(entry.changefreq)) {
      c.changefreq = `❌ ${entry.changefreq || "missing"}`;
    }
    // hreflang block — must be exactly {es,en,fr,de,pt,ca,x-default}, with
    // x-default pointing at the ES URL.
    const REQUIRED = new Set([...LANGS, "x-default"]);
    const declared = new Set(entry.alternates.keys());
    const missing = [...REQUIRED].filter((k) => !declared.has(k));
    const extra = [...declared].filter((k) => !REQUIRED.has(k));
    const xDefaultOk = declared.has("x-default") && PATH_OF(entry.alternates.get("x-default")) === meta.esUrl;
    if (missing.length || extra.length || !xDefaultOk) {
      const parts = [];
      if (missing.length) parts.push(`missing=${missing.join(",")}`);
      if (extra.length) parts.push(`extra=${extra.join(",")}`);
      if (!xDefaultOk) parts.push("xdefault→ES bad");
      c.hreflang = `❌ ${parts.join(" ")}`;
    } else {
      c.hreflang = `✅ 6 langs + x-default→ES`;
    }
    // hreflang reciprocity: every declared alternate (except x-default) must
    // also be present in the sitemap and list this URL back.
    let recOk = true; let recBad = "";
    for (const [lng, href] of entry.alternates) {
      if (lng === "x-default") continue;
      const altPath = PATH_OF(href);
      const altEntry = sitemapByPath.get(altPath);
      if (!altEntry) { recOk = false; recBad = `alt ${lng} missing`; break; }
      if (!altEntry.alternates.has(meta.lang) || PATH_OF(altEntry.alternates.get(meta.lang)) !== url) {
        recOk = false; recBad = `alt ${lng} does not list ${meta.lang}→${url}`; break;
      }
    }
    c.reciprocal = recOk ? "✅" : `❌ ${recBad}`;
  }

  // Robots
  const blocked = robotsMatcher(url);
  c.robots = blocked ? `❌ blocked by ${blocked}` : "✅ allowed";

  // Inbound links (orphan check)
  const inboundCount = linkGraph.inbound?.[url] || 0;
  c.inbound = inboundCount > 0 ? `✅ ${inboundCount}` : "❌ 0 (orphan)";

  // ---- Per-URL meta length, single-H1, noindex absence ----
  let title = ""; let desc = ""; let h1Count = 0; let noindex = false;
  if (meta.kind === "page") {
    const ns = ROUTE_TO_NS[Object.keys(routeSlugs).find((k) => localizedPath(k, meta.lang) === url) || ""];
    const m = ns ? readLocaleSEO(meta.lang, ns) : null;
    title = m?.title || "";
    desc = m?.description || "";
    const routeKey = Object.keys(routeSlugs).find((k) => localizedPath(k, meta.lang) === url);
    h1Count = countH1(routeKey);
    noindex = pageHasNoindex(routeKey);
  } else if (meta.kind === "blog-index") {
    const m = readLocaleSEO(meta.lang, "blogPost") || readLocaleSEO(meta.lang, "blogIndex");
    title = m?.title || "";
    desc = m?.description || "";
    h1Count = countH1("blogIndex");
    noindex = pageHasNoindex("blogIndex");
  } else if (meta.kind === "faq") {
    const m = readLocaleSEO(meta.lang, "faq");
    title = m?.title || "";
    desc = m?.description || "";
    h1Count = countH1("faq");
    noindex = pageHasNoindex("faq");
  } else if (meta.kind === "blog-post") {
    // Look up by ES slug → translated slug per lang
    const esSlug = blogSlugs.find((s) => `/${meta.lang}/blog/${getTranslatedSlug(s, meta.lang)}` === url);
    const bm = esSlug ? readBlogMeta(esSlug, meta.lang) : null;
    title = bm?.title || "";
    desc = bm?.description || "";
    h1Count = countH1("blogPost");
    noindex = pageHasNoindex("blogPost");
  }
  c.title_len = title.length === 0 ? "❌ missing"
              : title.length > META_LIMITS.TITLE_MAX ? `❌ ${title.length}`
              : `✅ ${title.length}`;
  c.desc_len = desc.length === 0 ? "❌ missing"
             : desc.length > META_LIMITS.DESC_MAX ? `❌ ${desc.length}`
             : `✅ ${desc.length}`;
  c.h1 = h1Count === 1 ? "✅ 1"
       : h1Count === 0 ? "❌ 0"
       : `❌ ${h1Count}`;
  c.noindex = noindex ? "❌ noindex set" : "✅ absent";

  // HTTP status (URL itself + every declared alternate)
  if (BASE_URL) {
    const s = httpStatuses.get(url);
    if (typeof s === "number" && s >= 200 && s < 300) c.http = `✅ ${s}`;
    else c.http = `❌ ${s ?? "no response"}`;
    if (entry) {
      let altRedFlag = false; let firstBad = "";
      for (const [lng, href] of entry.alternates) {
        if (lng === "x-default") continue;
        const altPath = PATH_OF(href);
        const status = httpStatuses.get(altPath);
        if (typeof status !== "number" || status < 200 || status >= 300) {
          altRedFlag = true; firstBad = `${lng}=${status}`; break;
        }
      }
      c.alts_http = altRedFlag ? `❌ ${firstBad}` : "✅ all 200";
    } else {
      c.alts_http = "—";
    }
  }

  // ---- Per-URL canonical (statically derived from SEO.tsx formula) ----
  // SEO.tsx sets <link rel="canonical" href={`${BASE_URL}${getLocalizedPath(...)}`}>.
  // The expected canonical for every URL in our universe is therefore
  // `${SITE_URL}${url}` (or for blog posts, the URL itself).
  c.canonical = canonicalFormulaOk
    ? `✅ ${BASE_URL || "https://exentax.com"}${url}`
    : `❌ SEO.tsx canonical formula drift`;

  // ---- Per-URL JSON-LD types (statically derived from page sources) ----
  // Schema.org: BlogPosting extends Article, so either is acceptable for blog
  // posts. We use BlogPosting (more specific, Google-preferred for blogs).
  const jsonLdExpect = meta.kind === "blog-post"
    ? [["Article", "BlogPosting"], "BreadcrumbList"]
    : meta.kind === "faq"
      ? ["FAQPage", "BreadcrumbList"]
      : ["BreadcrumbList"];
  const emitted = jsonLdEmittedFor(meta.kind);
  const missing = jsonLdExpect.filter((t) => Array.isArray(t)
    ? !t.some((sub) => emitted.has(sub))
    : !emitted.has(t));
  c.json_ld = missing.length === 0
    ? `✅ ${jsonLdExpect.join(" + ")}`
    : `❌ missing ${missing.join(", ")}`;

  // ---- LIVE checks against running server (canonical/h1/JSON-LD) -------
  // Always populated when BASE_URL is set. Source = hydrated DOM if --render
  // mode succeeded, otherwise the raw HTML response (which on a Vite SPA
  // contains only the unhydrated index.html shell, so the live values fall
  // back to "(SPA shell)" and the cell is verified against the static
  // formula derived from `client/src/components/seo/SEO.tsx` + the page
  // component sources).
  if (BASE_URL) {
    const live = liveSeo.get(url);
    const expectedCanonical = `${(process.env.SITE_URL || "https://exentax.com").replace(/\/$/, "")}${url}`;
    if (!live) {
      c.live_canonical = "—";
      c.live_h1 = "—";
      c.live_jsonld = "—";
    } else {
      // SPA-shell detection: when --render is OFF and the response is the
      // unhydrated index.html, we always see the static head canonical
      // (= SITE_URL root) regardless of route. In that case there is no
      // way to inspect the post-hydration values without Playwright, and
      // each cell falls back to the static formula already checked above.
      const siteRoot = (process.env.SITE_URL || "https://exentax.com").replace(/\/$/, "");
      const isShell = !live.hasRender && (
        live.seo.canonical === siteRoot ||
        live.seo.canonical === `${siteRoot}/` ||
        url !== "/" && live.seo.canonical && !live.seo.canonical.endsWith(url)
      );
      // canonical
      if (isShell) {
        c.live_canonical = `ℹ SPA shell (canonical=${live.seo.canonical || "—"}) — verified by SEO.tsx formula above`;
      } else if (live.seo.canonical) {
        c.live_canonical = live.seo.canonical === expectedCanonical
          ? `✅ ${live.seo.canonical}`
          : `❌ got ${live.seo.canonical}`;
      } else if (live.hasRender) {
        c.live_canonical = `❌ rendered DOM had no <link rel=canonical>`;
      } else {
        c.live_canonical = `ℹ SPA shell — verified by SEO.tsx formula above`;
      }
      // h1
      if (isShell) {
        c.live_h1 = `ℹ SPA shell — verified by page component above`;
      } else if (live.seo.h1Count > 0 || live.hasRender) {
        c.live_h1 = live.seo.h1Count === 1
          ? `✅ 1`
          : live.seo.h1Count === 0 ? `❌ 0` : `❌ ${live.seo.h1Count}`;
      } else {
        c.live_h1 = `ℹ SPA shell — verified by page component above`;
      }
      // jsonld presence
      const blocks = live.seo.jsonLdBlocks;
      const types = new Set();
      for (const b of blocks) {
        const t = b && b["@type"];
        if (Array.isArray(t)) t.forEach((x) => types.add(x));
        else if (typeof t === "string") types.add(t);
      }
      const reqTypes = meta.kind === "blog-post"
        ? ["BlogPosting|Article", "BreadcrumbList"]
        : meta.kind === "faq"
          ? ["FAQPage", "BreadcrumbList"]
          : ["BreadcrumbList"];
      const missingTypes = reqTypes.filter((t) => {
        if (t.includes("|")) return !t.split("|").some((x) => types.has(x));
        return !types.has(t);
      });
      if (isShell) {
        c.live_jsonld = `ℹ SPA shell (head emits ${[...types].join("+") || "(none)"}) — runtime verified by source emitter above`;
      } else if (blocks.length > 0 || live.hasRender) {
        c.live_jsonld = missingTypes.length === 0
          ? `✅ ${[...types].join("+") || "(none)"}`
          : `❌ missing ${missingTypes.join(", ")}`;
      } else {
        c.live_jsonld = `ℹ SPA shell — verified by source emitter above`;
      }
    }
    // ---- Per-URL BlogPosting field validation against source data ----
    // Mirrors what client/src/pages/blog/post.tsx renders at runtime:
    //   { "@type":"BlogPosting", inLanguage, headline, datePublished,
    //     dateModified, author:{ "@type":"Organization", name: BRAND.NAME } }
    if (meta.kind === "blog-post") {
      // The URL slug may be a per-lang translated slug; the dates and the
      // i18n meta caches are keyed by the ES (canonical) slug, so resolve
      // it from `meta.esUrl` (which always points at the ES variant).
      const esBaseSlug = (meta.esUrl || "").split("/").pop();
      const dates = blogDates[esBaseSlug];
      const langMeta = readBlogMeta(esBaseSlug, meta.lang);
      const liveBlock = (live?.seo.jsonLdBlocks || []).find((b) => {
        const t = b && b["@type"];
        return t === "BlogPosting" || t === "Article" || (Array.isArray(t) && t.some((x) => x === "BlogPosting" || x === "Article"));
      });
      const fieldErrs = [];
      const expectedHeadline = langMeta?.displayTitle || "";
      const expectedDate = dates?.publishedAt || "";
      const expectedLang = meta.lang;
      const expectedAuthor = "Exentax";
      // Source-side completeness (always checked, deterministic)
      if (!expectedHeadline) fieldErrs.push("source headline missing");
      if (!expectedDate) fieldErrs.push("source datePublished missing");
      // Live-side equality (only when block actually rendered into HTML)
      if (liveBlock) {
        if (liveBlock.inLanguage && liveBlock.inLanguage !== expectedLang) fieldErrs.push(`inLanguage=${liveBlock.inLanguage}≠${expectedLang}`);
        if (liveBlock.headline && expectedHeadline && liveBlock.headline !== expectedHeadline) fieldErrs.push("headline≠source");
        if (liveBlock.datePublished && expectedDate && !liveBlock.datePublished.startsWith(expectedDate)) fieldErrs.push("datePublished≠source");
        const authorName = liveBlock.author?.name || (typeof liveBlock.author === "string" ? liveBlock.author : "");
        if (authorName && authorName !== expectedAuthor) fieldErrs.push(`author=${authorName}≠${expectedAuthor}`);
      }
      c.jsonld_fields = fieldErrs.length === 0
        ? (liveBlock ? `✅ live: lang=${expectedLang}, head=${expectedHeadline.slice(0, 24)}…, date=${expectedDate}` : `✅ source: lang=${expectedLang}, head=${expectedHeadline.slice(0, 24)}…, date=${expectedDate}`)
        : `❌ ${fieldErrs.join("; ")}`;
    } else {
      c.jsonld_fields = "—";
    }
  }

  // ---- Hreflang fallback flag (alternate URL == ES URL but lang != es) ----
  if (entry) {
    const fallbacks = [];
    for (const [lng, href] of entry.alternates) {
      if (lng === "x-default" || lng === "es") continue;
      const altPath = PATH_OF(href);
      // If altPath equals the ES URL, this lang's translation is missing.
      if (altPath === meta.esUrl) fallbacks.push(lng);
    }
    if (fallbacks.length) {
      c.hreflang = `⚠ fallback→es: ${fallbacks.join(",")}`;
    }
  }

  const isRed = Object.values(c).some((v) => typeof v === "string" && v.startsWith("❌"));
  if (isRed) red++;
  rows.push({ url, ...meta, c, isRed });
}

// ---------- 7. Render report -------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const md = [];
md.push(`# Indexing audit — ${today}`);
md.push(``);
md.push(`Generated by \`scripts/seo-indexing-audit.mjs\`. Universe: ${rows.length} URLs (` +
  `${rows.filter(r => r.kind === "page").length} main pages, ` +
  `${rows.filter(r => r.kind === "blog-index").length} blog indexes, ` +
  `${rows.filter(r => r.kind === "faq").length} FAQ, ` +
  `${rows.filter(r => r.kind === "blog-post").length} blog posts).`);
md.push(``);
md.push(`Sitemap split: \`/sitemap.xml\` (sitemap-index) → \`/sitemap-pages.xml\`, \`/sitemap-blog.xml\`, \`/sitemap-faq.xml\`.`);
md.push(``);
md.push(`Sitemap-index children fetched: ${sitemapIndexChildren.map(c => c.loc).join(", ") || "(none)"}`);
md.push(``);
md.push(`Live extraction mode: ${renderModeNote}`);
md.push(``);
// Surface the last automatic sitemap ping (server/sitemap-ping.ts) so the
// indexing audit can be cross-checked against what was actually submitted to
// search engines on the most recent deploy.
{
  const statePath = resolve(ROOT, "data/sitemap-ping-state.json");
  if (existsSync(statePath)) {
    try {
      const state = JSON.parse(readFileSync(statePath, "utf8"));
      const last = state?.last;
      if (last) {
        const hashShort = (last.hash || "").slice(0, 12);
        let line = `Last automatic sitemap ping: **${last.status}** at ${last.at} (hash \`${hashShort || "—"}\`)`;
        if (last.status === "ok") line += ` — submitted ${last.submitted?.length ?? 0} URL(s) to IndexNow, HTTP ${last.httpStatus}.`;
        else if (last.status === "failed") line += ` — IndexNow error: ${last.error}.`;
        else if (last.status === "skipped") line += ` — ${last.reason}.`;
        else if (last.status === "unchanged") line += ` — sitemap unchanged since previous ping.`;
        md.push(line);
        const g = last.google;
        if (g) {
          let gline = `Google Search Console Sitemaps API: **${g.status}** at ${g.at}`;
          if (g.status === "ok") gline += ` — submitted ${g.sitemapUrl} to ${g.siteUrl} (HTTP ${g.httpStatus}).`;
          else if (g.status === "failed") gline += ` — ${g.sitemapUrl} → ${g.siteUrl}: ${g.error}.`;
          else if (g.status === "skipped") gline += ` — ${g.reason}.`;
          md.push(gline);
        } else {
          md.push(`Google Search Console Sitemaps API: not run yet (no \`google\` field in state). Once \`GOOGLE_SERVICE_ACCOUNT_KEY\` is configured and the service-account email is added as an owner on the Search Console property, the next sitemap change will trigger a submit.`);
        }
        md.push(``);
        md.push(`> Google deprecated its public sitemap-ping endpoint in 2023; Bing's was deprecated in 2022. We rely on IndexNow (Bing/Yandex/Seznam) and on Google Search Console for Google.`);
        md.push(``);
      }
    } catch { /* ignore — purely informational */ }
  }
}
// Per-article submission state (IndexNow + Google Indexing API).
// IndexNow stores per-URL last-pinged updatedAt in data/indexnow-pinged.json;
// Google Indexing stores per-URL last-submitted outcome in
// data/google-indexing-pinged.json (see server/google-indexing.ts).
{
  const blogRows = rows.filter((r) => r.kind === "blog-post");
  const blogTotal = blogRows.length;

  // State files store canonical URLs built from server-side SITE_URL, NOT
  // from BASE_URL (which is the local loopback used for HTTP probing in
  // production auto-publish). Mirror server/server-constants.ts here so the
  // counts are accurate regardless of where the audit is run.
  const CANONICAL_BASE = (process.env.SITE_URL || "https://exentax.com").replace(/\/$/, "");

  // ---- IndexNow per-article ----
  const inPath = resolve(ROOT, "data/indexnow-pinged.json");
  let inSubmitted = 0;
  let inUpdatedAt = "—";
  if (existsSync(inPath)) {
    try {
      const raw = JSON.parse(readFileSync(inPath, "utf8"));
      inUpdatedAt = raw.updatedAt || "—";
      const entries = raw.entries || {};
      const urls = new Set(blogRows.map((r) => `${CANONICAL_BASE}${r.url}`));
      for (const k of Object.keys(entries)) if (urls.has(k)) inSubmitted++;
    } catch { /* ignore */ }
  }
  md.push(
    `Per-article IndexNow (Bing/Yandex/Seznam): **${inSubmitted}/${blogTotal}** blog URLs already submitted` +
      (inUpdatedAt !== "—" ? ` (state last updated ${inUpdatedAt}).` : ` (no state yet — first submission will run on next deploy).`),
  );

  // ---- Google Indexing API per-article ----
  const gPath = resolve(ROOT, "data/google-indexing-pinged.json");
  if (existsSync(gPath)) {
    try {
      const raw = JSON.parse(readFileSync(gPath, "utf8"));
      const entries = raw.entries || {};
      const last = raw.last;
      const urls = new Set(blogRows.map((r) => `${CANONICAL_BASE}${r.url}`));
      let gOk = 0;
      let gFailed = 0;
      let gPending = 0;
      for (const url of urls) {
        const e = entries[url];
        if (!e) { gPending++; continue; }
        if (e.lastStatus === "ok") gOk++;
        else if (e.lastStatus === "failed") gFailed++;
        else gPending++;
      }
      let line = `Per-article Google Indexing API: **${gOk}/${blogTotal}** blog URLs accepted (failed=${gFailed}, pending=${gPending}).`;
      if (last) {
        line += ` Last run: **${last.status}** at ${last.at}`;
        if (last.reason) line += ` — ${last.reason}`;
        if (last.capped) line += ` — capped at ${last.submitted + last.failed}/${last.total}, ${last.pendingAfterCap} deferred to next run`;
        line += `.`;
      }
      md.push(line);

      // ---- Rolling 24h quota tracker ----
      // Recompute from the persisted timestamps so the report reflects the
      // current window even if the last run was hours ago. Default daily
      // quota for the publish endpoint is 200/project; flag a warning when
      // ≤10% remains.
      const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;
      const quotaLimit = (last?.quota?.limit && Number.isFinite(last.quota.limit))
        ? last.quota.limit
        : 200;
      const allTimestamps = Array.isArray(raw.callTimestamps) ? raw.callTimestamps : [];
      const cutoff = Date.now() - QUOTA_WINDOW_MS;
      const used24h = allTimestamps.filter((t) => {
        const n = Date.parse(t);
        return Number.isFinite(n) && n >= cutoff;
      }).length;
      const remaining = Math.max(0, quotaLimit - used24h);
      const warnThreshold = Math.ceil(quotaLimit * 0.10);
      const warn = remaining <= warnThreshold;
      const marker = warn ? "⚠ " : "";
      let qline = `${marker}Google Indexing API publish quota: **${used24h}/${quotaLimit}** calls used in the last 24h (${remaining} remaining).`;
      if (warn) {
        qline += ` Within ${Math.round((1 - remaining / quotaLimit) * 100)}% of the daily limit — submissions will be auto-deferred to the next run to avoid 429s.`;
      }
      if (last?.quotaCapped) {
        qline += ` Last run was quota-capped.`;
      }
      md.push(qline);
      md.push(``);
      md.push(`> Google's Indexing API is officially restricted to JobPosting/BroadcastEvent. We submit blog URLs anyway via the well-known "non-supported but tolerated" path; this is opt-in via \`GOOGLE_INDEXING_API_ENABLE=1\` (see \`server/google-indexing.ts\`).`);
    } catch { /* ignore */ }
  } else {
    md.push(
      `Per-article Google Indexing API: not run yet. Set \`GOOGLE_INDEXING_API_ENABLE=1\` to opt in (see \`server/google-indexing.ts\` for the JobPosting/BroadcastEvent caveat).`,
    );
  }
  md.push(``);
}

md.push(`**Red rows: ${red} / ${rows.length}**.`);
md.push(``);

// ---------- 101 × 6 matrix view (per-article × per-language) ----------
// Compact summary requested by the indexation spec: one row per ES base
// slug, one column per language, single ✅/❌ per cell aggregating all
// per-URL checks. The detailed per-URL table follows below.
{
  const blogRows = rows.filter((r) => r.kind === "blog-post");
  if (blogRows.length > 0) {
    // Group by ES base slug (every blog row has meta.esUrl pointing at the ES variant).
    const byBase = new Map();
    for (const r of blogRows) {
      const baseSlug = (r.esUrl || "").split("/").pop();
      if (!byBase.has(baseSlug)) byBase.set(baseSlug, {});
      byBase.get(baseSlug)[r.lang] = r;
    }
    md.push(`## Article × language matrix (${byBase.size} articles × 6 languages)`);
    md.push(``);
    md.push(`Each cell is the aggregate verdict for one (article, language) URL: ✅ when every per-URL check passed, ❌ otherwise. Drill into the per-URL table further down for the failing column.`);
    md.push(``);
    md.push(`| # | ES base slug | es | en | fr | de | pt | ca |`);
    md.push(`| ---: | --- | :---: | :---: | :---: | :---: | :---: | :---: |`);
    let i = 0;
    let matrixRed = 0;
    for (const [baseSlug, langs] of byBase) {
      i++;
      const cells = LANGS.map((lng) => {
        const r = langs[lng];
        if (!r) return "—";
        if (r.isRed) { matrixRed++; return "❌"; }
        return "✅";
      });
      md.push(`| ${i} | \`${baseSlug}\` | ${cells.join(" | ")} |`);
    }
    md.push(``);
    md.push(`Matrix totals: **${byBase.size * LANGS.length - matrixRed} / ${byBase.size * LANGS.length}** cells green (${matrixRed} red).`);
    md.push(``);
  }
}
md.push(`Companion verifiers (run from \`scripts/\`):`);
md.push(`- \`seo-task4-check.mjs\` — SEO.tsx canonical/hreflang/JSON-LD shape (SPA-emitted).`);
md.push(`- \`seo-faq-jsonld-check.mjs\` — FAQPage shape × 6 locales.`);
md.push(`- \`seo-orphans.mjs\` — navigational link graph (feeds the inbound column below).`);
md.push(`- \`seo-sitemap-check.mjs\` — sitemap-index + child fetch + URL HTTP 200.`);
md.push(`- \`seo-meta-check.mjs\` — title/description length / dup detection (\`npm run seo:meta\`).`);
md.push(``);
const headers = ["lang", "url", "kind", "sitemap", "priority", "changefreq", "lastmod", "hreflang", "recip.", "robots", "noindex", "inbound", "title (≤60)", "desc (≤155)", "h1 (src)", "canonical (src)", "json-ld (src)"];
if (BASE_URL) headers.push("http", "alts http", "live canonical", "live h1", "live json-ld", "json-ld fields");
md.push(`| ${headers.join(" | ")} |`);
md.push(`| ${headers.map(() => "---").join(" | ")} |`);
for (const r of rows) {
  const row = [r.lang, "`" + r.url + "`", r.kind, r.c.sitemap, r.c.priority, r.c.changefreq, r.c.lastmod, r.c.hreflang, r.c.reciprocal, r.c.robots, r.c.noindex, r.c.inbound, r.c.title_len, r.c.desc_len, r.c.h1, r.c.canonical, r.c.json_ld];
  if (BASE_URL) row.push(r.c.http, r.c.alts_http, r.c.live_canonical || "—", r.c.live_h1 || "—", r.c.live_jsonld || "—", r.c.jsonld_fields || "—");
  md.push(`| ${row.join(" | ")} |`);
}
writeFileSync(OUT, md.join("\n") + "\n", "utf8");

console.log(`Indexing audit: ${rows.length} rows, ${red} red.`);
console.log(`Report → ${OUT}`);
process.exit(red === 0 ? 0 : 1);
