#!/usr/bin/env node
/*
 * seo-orphan-audit.mjs
 * ----------------------------------------------------------------------------
 * Per-locale audit that compares three URL surfaces and writes a single
 * markdown report:
 *
 *   1. App canonical URLs       — every URL the app actually serves
 *      (static routes from `shared/routes.ts`, blog index, blog posts whose
 *      content file exists in `client/src/data/blog-content/<lang>/<slug>.ts`
 *      and whose required meta is complete per `BLOG_AVAILABILITY` rules).
 *
 *   2. Sitemap URLs             — URLs advertised by the live `/sitemap.xml`
 *      (and its sitemap-index children).
 *
 *   3. Reachable-from-home URLs — URLs reachable from `/{lang}` in ≤3 clicks
 *      following the static link graph: global Navbar+Footer +
 *      page-level `lp("...")`/`href="/lang/..."` references + blog content
 *      cross-links.
 *
 * Then for each sitemap URL it also fetches the live HTTP response to detect:
 *   - 404 / non-2xx
 *   - 3xx redirects (with location)
 *   - noindex via `<meta name="robots">` or `X-Robots-Tag`
 *
 * Output: <repo-root>/reports/seo/orphan-urls-2026-04.md
 * Exit code: 0 by default (audit). With `--strict` (or env ORPHAN_AUDIT_STRICT=1)
 * the script exits 1 if any of the following counts is > 0:
 *   - orphans-toward (in app & reachable but not in sitemap)
 *   - orphans-on-site (in sitemap but unreachable ≤ MAX_DEPTH clicks)
 *   - ghost URLs (sitemap entries returning 4xx / 3xx / noindex / network err)
 * Hreflang reciprocity is intentionally NOT part of the strict gate because
 * it is already covered by the dedicated `seo-sitemap-bcp47.test.mjs` step
 * earlier in `blog-validate-all.mjs`.
 *
 * Usage:
 *   BASE_URL=http://localhost:5000 node exentax-web/scripts/seo-orphan-audit.mjs
 *   BASE_URL=http://localhost:5000 node exentax-web/scripts/seo-orphan-audit.mjs --strict
 * ----------------------------------------------------------------------------
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const WS_ROOT = resolve(__dirname, "..");
const REPORT_PATH = resolve(REPO_ROOT, "reports/seo/orphan-urls-2026-04.md");
const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const SITE_URL_RE = /^https?:\/\/[^/]+/;
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const HREFLANG_BCP47 = { es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES" };
const MAX_DEPTH = 3;
const HTTP_CONCURRENCY = 16;
const HTTP_TIMEOUT_MS = 15000;

// -- Static parse helpers ---------------------------------------------------
function readSrc(p) { return readFileSync(p, "utf8"); }

function parseRouteSlugs() {
  const src = readSrc(resolve(WS_ROOT, "shared/routes.ts"));
  const block = src.match(/ROUTE_SLUGS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) throw new Error("ROUTE_SLUGS block not found");
  const out = {};
  const rowRe = /^\s*([a-z_]+):\s*\{([^}]+)\}/gm;
  let m;
  while ((m = rowRe.exec(block[1]))) {
    const key = m[1];
    const slugs = {};
    const slugRe = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let s;
    while ((s = slugRe.exec(m[2]))) slugs[s[1]] = s[2];
    out[key] = slugs;
  }
  return out;
}

function localizedPath(slug, lang) {
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

function parseBlogSlugMap() {
  const src = readSrc(resolve(WS_ROOT, "client/src/data/blog-posts-slugs.ts"));
  const out = {};
  const re = /"([^"]+)":\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const esSlug = m[1];
    if (esSlug.startsWith("legacy_")) continue;
    const tr = { es: esSlug };
    const inner = m[2];
    const tre = /(en|fr|de|pt|ca):\s*"([^"]+)"/g;
    let t;
    while ((t = tre.exec(inner))) tr[t[1]] = t[2];
    out[esSlug] = tr;
  }
  return out;
}

function parseBlogPostsRegistry() {
  const src = readSrc(resolve(WS_ROOT, "client/src/data/blog-posts.ts"));
  const slugs = [];
  const re = /^\s*slug:\s*["']([^"']+)["']/gm;
  let m;
  while ((m = re.exec(src))) slugs.push(m[1]);
  return slugs;
}

function blogContentSlugs(lang) {
  const dir = resolve(WS_ROOT, `client/src/data/blog-content/${lang}`);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".ts")).map((f) => f.slice(0, -3));
}

// Returns map<lang, Set<esSlug>> of posts considered "available" using same
// rule as `BLOG_AVAILABILITY` in server/routes/public.ts.
function buildBlogAvailability(blogMetaByLang) {
  const map = {};
  for (const lang of LANGS) {
    const set = new Set();
    for (const slug of blogContentSlugs(lang)) {
      if (lang === "es") { set.add(slug); continue; }
      const m = blogMetaByLang[lang]?.[slug];
      if (m && m.title && m.excerpt && m.metaTitle && m.metaDescription) set.add(slug);
    }
    map[lang] = set;
  }
  return map;
}

function parseBlogI18nMeta(lang) {
  const file = resolve(WS_ROOT, `client/src/data/blog-i18n/${lang}.ts`);
  if (!existsSync(file)) return {};
  const src = readSrc(file);
  // Each entry is a single-line object: `"slug": { title: "...", ... },`
  // Walk character-by-character to correctly handle nested braces / brackets
  // and quoted commas. Only top-level entries inside the MAP literal matter.
  const out = {};
  // Find the start of MAP body.
  const mapStart = src.search(/=\s*\{/);
  if (mapStart < 0) return out;
  let i = src.indexOf("{", mapStart) + 1;
  while (i < src.length) {
    // Skip whitespace.
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] === "}") break;
    if (src[i] !== '"') { i++; continue; }
    const slugStart = i + 1;
    let slugEnd = slugStart;
    while (slugEnd < src.length && src[slugEnd] !== '"') slugEnd++;
    const slug = src.slice(slugStart, slugEnd);
    // Find the entry value object.
    let j = slugEnd + 1;
    while (j < src.length && src[j] !== "{") j++;
    if (src[j] !== "{") break;
    // Walk braces / brackets / strings to find matching close.
    let depth = 0;
    let k = j;
    while (k < src.length) {
      const c = src[k];
      if (c === '"') {
        // skip string
        k++;
        while (k < src.length && src[k] !== '"') {
          if (src[k] === "\\") k++;
          k++;
        }
      } else if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) { k++; break; }
      }
      k++;
    }
    const body = src.slice(j, k);
    const get = (key) => {
      const re = new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*?)"`);
      const x = body.match(re);
      return x ? x[1] : "";
    };
    out[slug] = {
      title: get("title"),
      excerpt: get("excerpt"),
      metaTitle: get("metaTitle"),
      metaDescription: get("metaDescription"),
    };
    i = k;
    // Skip optional comma.
    while (i < src.length && /[,\s]/.test(src[i])) i++;
  }
  return out;
}

// -- Build canonical URL set ------------------------------------------------
function buildCanonicalUrls() {
  const routeSlugs = parseRouteSlugs();
  const blogSlugMap = parseBlogSlugMap();
  const registrySlugs = new Set(parseBlogPostsRegistry());
  const blogMetaByLang = { es: {}, en: parseBlogI18nMeta("en"), fr: parseBlogI18nMeta("fr"), de: parseBlogI18nMeta("de"), pt: parseBlogI18nMeta("pt"), ca: parseBlogI18nMeta("ca") };
  const availability = buildBlogAvailability(blogMetaByLang);
  const byLang = {};
  for (const lang of LANGS) byLang[lang] = new Set();

  for (const [key, slugs] of Object.entries(routeSlugs)) {
    for (const lang of LANGS) byLang[lang].add(localizedPath(slugs[lang], lang));
  }
  for (const lang of LANGS) byLang[lang].add(`/${lang}/blog`);

  for (const lang of LANGS) {
    for (const esSlug of availability[lang]) {
      // Only emit if also in BLOG_POSTS registry (sitemap iterates registry).
      if (!registrySlugs.has(esSlug)) continue;
      const localized = blogSlugMap[esSlug]?.[lang] || esSlug;
      byLang[lang].add(`/${lang}/blog/${localized}`);
    }
  }
  return { byLang, routeSlugs, blogSlugMap, availability, registrySlugs };
}

// -- Static link graph ------------------------------------------------------
function collectGlobalLinks(routeSlugs) {
  // Navbar + Footer + FloatingMobileCTA + NavbarFunnel are global.
  const files = [
    "client/src/components/layout/Navbar.tsx",
    "client/src/components/layout/Footer.tsx",
    "client/src/components/layout/FloatingMobileCTA.tsx",
    "client/src/components/layout/NavbarFunnel.tsx",
  ];
  const routeKeys = new Set();
  let blogIndexSeen = false;
  for (const f of files) {
    const p = resolve(WS_ROOT, f);
    if (!existsSync(p)) continue;
    const src = readSrc(p);
    const re = /lp\(\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(src))) {
      const key = m[1];
      if (key === "/blog") { blogIndexSeen = true; continue; }
      if (routeSlugs[key]) routeKeys.add(key);
    }
    if (/lp\(\s*["']\/blog["']/.test(src)) blogIndexSeen = true;
  }
  return { routeKeys, blogIndexSeen };
}

// Build per-page link map: for each page (canonical URL) → set of outgoing
// canonical URLs found via lp() calls or static href="/lang/..." patterns.
function collectPageLinks(routeSlugs, blogSlugMap, availability, registrySlugs) {
  // Map of page-component file → routeKey it renders.
  const pageFileForRoute = {
    home: "client/src/pages/home.tsx",
    how_we_work: "client/src/pages/how-we-work.tsx",
    our_services: "client/src/pages/services.tsx",
    about_llc: "client/src/pages/about-llc.tsx",
    faq: "client/src/pages/faq-page.tsx",
    book: "client/src/pages/book.tsx",
    pillar_open_llc: "client/src/pages/abrir-llc.tsx",
    service_llc_nm: "client/src/pages/services/llc-new-mexico.tsx",
    service_llc_wy: "client/src/pages/services/llc-wyoming.tsx",
    service_llc_de: "client/src/pages/services/llc-delaware.tsx",
    service_llc_fl: "client/src/pages/services/llc-florida.tsx",
    service_itin: "client/src/pages/services/itin.tsx",
    legal_terms: "client/src/pages/legal/terms.tsx",
    legal_privacy: "client/src/pages/legal/privacy.tsx",
    legal_cookies: "client/src/pages/legal/cookies.tsx",
    legal_refunds: "client/src/pages/legal/refunds.tsx",
    legal_disclaimer: "client/src/pages/legal/disclaimer.tsx",
  };

  // For pages that may be split into sibling files, allow extra files per route.
  // The 5 service subpages are thin wrappers around `ServiceSubpage.tsx`, which
  // is where the real outgoing `lp(...)` calls live; include it for each.
  const SERVICE_SHARED = ["client/src/pages/services/ServiceSubpage.tsx"];
  const extraFiles = {
    our_services: ["client/src/pages/services-sections.tsx"],
    home: [
      "client/src/components/sections/hero.tsx",
      "client/src/components/sections/services.tsx",
      "client/src/components/sections/how-it-works.tsx",
      "client/src/components/sections/social-proof.tsx",
    ],
    service_llc_nm: SERVICE_SHARED,
    service_llc_wy: SERVICE_SHARED,
    service_llc_de: SERVICE_SHARED,
    service_llc_fl: SERVICE_SHARED,
    service_itin: SERVICE_SHARED,
  };

  function extractRouteKeysFromSrc(src) {
    const out = new Set();
    let m;
    const re = /lp\(\s*["']([^"']+)["']/g;
    while ((m = re.exec(src))) {
      const k = m[1];
      out.add(k);
    }
    return out;
  }

  function extractStaticUrls(src) {
    const out = new Set();
    const re = /href=\{?\s*["'`](\/(?:es|en|fr|de|pt|ca)\/[^"'`#?]+)["'`]/g;
    let m;
    while ((m = re.exec(src))) {
      const u = m[1].replace(/\/+$/, "") || `/${m[1].split("/")[1]}`;
      out.add(u);
    }
    // Also catch `${SITE_URL}/lang/...` and Link to= patterns.
    const reTo = /to=\{?\s*["'`](\/(?:es|en|fr|de|pt|ca)\/[^"'`#?]+)["'`]/g;
    while ((m = reTo.exec(src))) {
      const u = m[1].replace(/\/+$/, "") || `/${m[1].split("/")[1]}`;
      out.add(u);
    }
    return out;
  }

  // links[lang][canonicalUrl] = Set of outgoing canonical URLs
  const links = {};
  for (const lang of LANGS) links[lang] = {};

  // Read each page src and compute outgoing route keys + static urls.
  for (const [routeKey, file] of Object.entries(pageFileForRoute)) {
    const files = [file, ...(extraFiles[routeKey] || [])];
    let src = "";
    for (const f of files) {
      const p = resolve(WS_ROOT, f);
      if (existsSync(p)) src += "\n" + readSrc(p);
    }
    if (!src) continue;
    const outKeys = extractRouteKeysFromSrc(src);
    const outStatic = extractStaticUrls(src);
    for (const lang of LANGS) {
      const here = localizedPath(routeSlugs[routeKey][lang], lang);
      const set = new Set();
      for (const k of outKeys) {
        if (k === "/blog") { set.add(`/${lang}/blog`); continue; }
        if (routeSlugs[k]) set.add(localizedPath(routeSlugs[k][lang], lang));
      }
      // Static URLs are usually language-specific; keep them only for the
      // matching lang to avoid cross-locale leakage.
      for (const u of outStatic) {
        if (u.startsWith(`/${lang}/`)) set.add(u);
      }
      links[lang][here] = set;
    }
  }

  // Blog index page → link to every available post in that lang.
  const blogIndexFile = resolve(WS_ROOT, "client/src/pages/blog/index.tsx");
  for (const lang of LANGS) {
    const set = new Set();
    for (const esSlug of availability[lang]) {
      if (!registrySlugs.has(esSlug)) continue;
      const localized = blogSlugMap[esSlug]?.[lang] || esSlug;
      set.add(`/${lang}/blog/${localized}`);
    }
    links[lang][`/${lang}/blog`] = set;
  }
  void blogIndexFile;

  // Blog post pages: parse blog-content/<lang>/<slug>.ts for inline links.
  for (const lang of LANGS) {
    for (const esSlug of availability[lang]) {
      if (!registrySlugs.has(esSlug)) continue;
      const localized = blogSlugMap[esSlug]?.[lang] || esSlug;
      const here = `/${lang}/blog/${localized}`;
      const file = resolve(WS_ROOT, `client/src/data/blog-content/${lang}/${esSlug}.ts`);
      if (!existsSync(file)) { links[lang][here] = new Set(); continue; }
      const src = readSrc(file);
      const set = new Set();
      const re = /href="(\/(?:es|en|fr|de|pt|ca)\/[^"#?]+)"/g;
      let m;
      while ((m = re.exec(src))) {
        const u = m[1].replace(/\/+$/, "");
        set.add(u);
      }
      // Posts also receive the global blog-cta-routes; treat them as outbound.
      links[lang][here] = set;
    }
  }

  return links;
}

function buildReachable(canonicalByLang, routeSlugs, blogSlugMap, availability, registrySlugs, allCanonical) {
  const { routeKeys: globalRouteKeys, blogIndexSeen } = collectGlobalLinks(routeSlugs);
  const pageLinks = collectPageLinks(routeSlugs, blogSlugMap, availability, registrySlugs);

  const reachableByLang = {};
  for (const lang of LANGS) {
    const start = `/${lang}`;
    const visited = new Set([start]);
    // Depth 1: global (nav+footer) + first-page links.
    const queue = [];
    for (const k of globalRouteKeys) {
      const u = localizedPath(routeSlugs[k][lang], lang);
      if (!visited.has(u)) { visited.add(u); queue.push({ u, d: 1 }); }
    }
    if (blogIndexSeen) {
      const u = `/${lang}/blog`;
      if (!visited.has(u)) { visited.add(u); queue.push({ u, d: 1 }); }
    }
    // BFS up to depth MAX_DEPTH.
    while (queue.length) {
      const { u, d } = queue.shift();
      if (d >= MAX_DEPTH) continue;
      const out = pageLinks[lang][u] || new Set();
      for (const next of out) {
        if (!visited.has(next) && allCanonical.has(next)) {
          visited.add(next);
          queue.push({ u: next, d: d + 1 });
        }
      }
      // Also re-add global links from any visited page (Navbar+Footer reappear).
      for (const k of globalRouteKeys) {
        const g = localizedPath(routeSlugs[k][lang], lang);
        if (!visited.has(g)) { visited.add(g); queue.push({ u: g, d: d + 1 }); }
      }
      if (blogIndexSeen) {
        const g = `/${lang}/blog`;
        if (!visited.has(g)) { visited.add(g); queue.push({ u: g, d: d + 1 }); }
      }
    }
    reachableByLang[lang] = visited;
  }
  return reachableByLang;
}

// -- Sitemap fetch ----------------------------------------------------------
async function fetchText(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, ...opts });
    const body = await res.text();
    return { status: res.status, headers: res.headers, body };
  } finally { clearTimeout(t); }
}

async function fetchSitemapTree(baseUrl) {
  const root = await fetchText(`${baseUrl}/sitemap.xml`);
  if (root.status !== 200) throw new Error(`/sitemap.xml → ${root.status}`);
  const childRe = /<sitemap>\s*<loc>([^<]+)<\/loc>/g;
  const children = [];
  if (/<sitemapindex/.test(root.body)) {
    let m;
    while ((m = childRe.exec(root.body))) {
      let pathOnly = m[1];
      try { pathOnly = new URL(m[1]).pathname; } catch {}
      children.push(pathOnly);
    }
  }
  const blocks = [];
  for (const child of children) {
    const r = await fetchText(`${baseUrl}${child}`);
    if (r.status === 200) blocks.push(r.body);
  }
  if (blocks.length === 0) blocks.push(root.body);
  // Parse <url> blocks from each.
  const urls = [];
  const blockRe = /<url>([\s\S]*?)<\/url>/g;
  for (const xml of blocks) {
    let m;
    while ((m = blockRe.exec(xml))) {
      const block = m[1];
      const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
      if (!loc) continue;
      const alts = [];
      const altRe = /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/>/g;
      let a;
      while ((a = altRe.exec(block))) alts.push({ lang: a[1], href: a[2] });
      urls.push({ loc, alternates: alts });
    }
  }
  return urls;
}

function locToPath(loc) {
  return loc.replace(SITE_URL_RE, "").replace(/\/+$/, "") || "/";
}

function langOfPath(p) {
  const seg = p.split("/")[1];
  return LANGS.includes(seg) ? seg : null;
}

// -- Live HTTP probe --------------------------------------------------------
async function probeUrl(baseUrl, path) {
  // First HEAD to detect 30x quickly via redirect:manual.
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}${path}`, { method: "GET", redirect: "manual", signal: ctrl.signal });
    const status = res.status;
    const xRobots = res.headers.get("x-robots-tag") || "";
    let location = "";
    if (status >= 300 && status < 400) {
      location = res.headers.get("location") || "";
      // Drain body to free socket.
      try { await res.text(); } catch {}
      return { status, noindex: false, location };
    }
    let noindex = /noindex/i.test(xRobots);
    if (!noindex && (res.headers.get("content-type") || "").includes("text/html")) {
      const body = await res.text();
      const m = body.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
      if (m && /noindex/i.test(m[1])) noindex = true;
    } else {
      try { await res.text(); } catch {}
    }
    return { status, noindex, location: "" };
  } catch (e) {
    return { status: -1, noindex: false, location: "", error: String(e?.message || e) };
  } finally {
    clearTimeout(t);
  }
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
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => pump()));
  return results;
}

// -- Main -------------------------------------------------------------------
async function main() {
  console.log(`[seo-orphan-audit] base=${BASE_URL}`);
  const { byLang: canonicalByLang, routeSlugs, blogSlugMap, availability, registrySlugs } = buildCanonicalUrls();
  const allCanonical = new Set();
  for (const lang of LANGS) for (const u of canonicalByLang[lang]) allCanonical.add(u);

  const sitemapUrls = await fetchSitemapTree(BASE_URL);
  const sitemapByLang = {};
  for (const lang of LANGS) sitemapByLang[lang] = new Set();
  const sitemapAll = new Set();
  for (const u of sitemapUrls) {
    const p = locToPath(u.loc);
    sitemapAll.add(p);
    const lang = langOfPath(p);
    if (lang) sitemapByLang[lang].add(p);
  }
  console.log(`[seo-orphan-audit] sitemap urls: ${sitemapUrls.length}`);

  const reachableByLang = buildReachable(canonicalByLang, routeSlugs, blogSlugMap, availability, registrySlugs, allCanonical);

  // Probe every sitemap URL.
  const probePaths = Array.from(sitemapAll);
  const probeResults = new Map();
  console.log(`[seo-orphan-audit] probing ${probePaths.length} URLs (concurrency=${HTTP_CONCURRENCY})`);
  const start = Date.now();
  const arr = await runPool(probePaths, async (p) => probeUrl(BASE_URL, p), HTTP_CONCURRENCY);
  for (let i = 0; i < probePaths.length; i++) probeResults.set(probePaths[i], arr[i]);
  console.log(`[seo-orphan-audit] probed in ${Math.round((Date.now() - start) / 1000)}s`);

  // -- Compose report --
  const lines = [];
  const today = new Date().toISOString().slice(0, 10);
  lines.push(`# SEO orphan-URL audit — ${today}`);
  lines.push("");
  lines.push(`Base URL probed: \`${BASE_URL}\` (live SPA on port 5000).`);
  lines.push(`Sitemap source: \`/sitemap.xml\` index → \`/sitemap-pages.xml\`, \`/sitemap-blog.xml\`, \`/sitemap-faq.xml\`.`);
  lines.push("");
  lines.push("Locales audited (BCP-47):");
  lines.push("");
  for (const lang of LANGS) lines.push(`- \`${lang}\` (${HREFLANG_BCP47[lang]})`);
  lines.push("");
  lines.push("## Methodology");
  lines.push("");
  lines.push("Three URL surfaces are computed per locale:");
  lines.push("");
  lines.push("1. **App canonical** — every URL the app actually serves: `ALL_ROUTE_KEYS × LANGS`");
  lines.push("   from `shared/routes.ts`, `/{lang}/blog` index, and every blog post whose");
  lines.push("   content file exists in `client/src/data/blog-content/<lang>/<slug>.ts` AND whose");
  lines.push("   meta is complete (`title + excerpt + metaTitle + metaDescription` for non-ES).");
  lines.push("2. **Sitemap** — URLs advertised by the live `/sitemap.xml` tree.");
  lines.push("3. **Reachable** — BFS from `/{lang}` ≤ 3 clicks following `lp(...)` calls in");
  lines.push("   global (Navbar/Footer/FloatingMobileCTA), `lp(...)` calls and");
  lines.push("   `href=\"/lang/...\"` patterns inside each page component, plus inline");
  lines.push("   `<a href=\"/lang/blog/<slug>\">` links inside blog content files.");
  lines.push("");
  lines.push("Live HTTP probe checks every sitemap URL with `redirect:manual` and parses");
  lines.push("`<meta name=\"robots\">` + `X-Robots-Tag` for `noindex`.");
  lines.push("");

  // Globals
  lines.push("## Global counts");
  lines.push("");
  lines.push(`- Sitemap URLs total: **${sitemapUrls.length}**`);
  let totalCanonical = 0;
  for (const lang of LANGS) totalCanonical += canonicalByLang[lang].size;
  lines.push(`- App canonical URLs total: **${totalCanonical}**`);
  let totalReach = 0;
  for (const lang of LANGS) totalReach += reachableByLang[lang].size;
  lines.push(`- Reachable URLs total: **${totalReach}**`);
  // 404 / 30x / noindex
  let n404 = 0, n30x = 0, nNoindex = 0, nErr = 0;
  for (const [p, r] of probeResults) {
    if (r.status >= 300 && r.status < 400) n30x++;
    else if (r.status >= 400) n404++;
    else if (r.status < 0) nErr++;
    if (r.noindex) nNoindex++;
  }
  lines.push(`- Sitemap entries returning 4xx: **${n404}**`);
  lines.push(`- Sitemap entries returning 3xx: **${n30x}**`);
  lines.push(`- Sitemap entries flagged \`noindex\`: **${nNoindex}**`);
  lines.push(`- Sitemap entries unreachable (network error): **${nErr}**`);
  lines.push("");

  // Per-locale sections.
  let totalOrphansToward = 0, totalOrphansOnSite = 0, totalGhost = 0;
  for (const lang of LANGS) {
    lines.push(`## Locale \`${lang}\` (${HREFLANG_BCP47[lang]})`);
    lines.push("");
    const cset = canonicalByLang[lang];
    const sset = sitemapByLang[lang];
    const rset = reachableByLang[lang];
    lines.push(`- App canonical: ${cset.size}`);
    lines.push(`- Sitemap entries: ${sset.size}`);
    lines.push(`- Reachable from \`/${lang}\` (≤3 clicks): ${rset.size}`);
    lines.push("");

    // (a) reachable & in-app but NOT in sitemap
    const orphansToward = [];
    for (const u of cset) {
      if (rset.has(u) && !sset.has(u)) orphansToward.push(u);
    }
    orphansToward.sort();
    totalOrphansToward += orphansToward.length;
    lines.push(`### (a) Reachable in-app but NOT in sitemap — ${orphansToward.length}`);
    if (orphansToward.length === 0) lines.push("_None._");
    else for (const u of orphansToward) lines.push(`- \`${u}\``);
    lines.push("");

    // (b) sitemap entries NOT reachable ≤3 clicks
    const orphansOnSite = [];
    for (const u of sset) {
      if (!rset.has(u)) orphansOnSite.push(u);
    }
    orphansOnSite.sort();
    totalOrphansOnSite += orphansOnSite.length;
    lines.push(`### (b) Sitemap entries NOT reachable ≤3 clicks from \`/${lang}\` — ${orphansOnSite.length}`);
    if (orphansOnSite.length === 0) lines.push("_None._");
    else for (const u of orphansOnSite) lines.push(`- \`${u}\``);
    lines.push("");

    // (c) sitemap entries returning 404 / 30x / noindex
    const ghost = [];
    for (const u of sset) {
      const r = probeResults.get(u);
      if (!r) continue;
      if (r.status >= 400 || r.status < 0 || (r.status >= 300 && r.status < 400) || r.noindex) {
        const tag = r.noindex ? "noindex" : (r.status >= 300 && r.status < 400 ? `redirect ${r.status}→${r.location}` : `HTTP ${r.status}${r.error ? ` (${r.error})` : ""}`);
        ghost.push(`\`${u}\` — ${tag}`);
      }
    }
    ghost.sort();
    totalGhost += ghost.length;
    lines.push(`### (c) Sitemap entries returning 404 / redirect / noindex — ${ghost.length}`);
    if (ghost.length === 0) lines.push("_None._");
    else for (const g of ghost) lines.push(`- ${g}`);
    lines.push("");

    // Bonus: in-app canonical but not sitemap AND not reachable (truly hidden).
    const trulyHidden = [];
    for (const u of cset) {
      if (!sset.has(u) && !rset.has(u)) trulyHidden.push(u);
    }
    trulyHidden.sort();
    if (trulyHidden.length) {
      lines.push(`### (d) Truly hidden — in app, not in sitemap, not reachable — ${trulyHidden.length}`);
      for (const u of trulyHidden) lines.push(`- \`${u}\``);
      lines.push("");
    }
  }

  // -- Hreflang reciprocity ------------------------------------------------
  // For each <url>, verify: (1) every audited locale is present as a BCP-47
  // alternate, (2) `x-default` is present, (3) every alternate href is itself
  // a canonical URL advertised somewhere in the sitemap tree (so search
  // engines never see an alternate that 404s).
  const expectedBcp47 = new Set(LANGS.map((l) => HREFLANG_BCP47[l]));
  const hreflangIssues = [];
  for (const u of sitemapUrls) {
    const altLangs = new Set(u.alternates.map((a) => a.lang));
    const missing = [...expectedBcp47].filter((b) => !altLangs.has(b));
    if (missing.length) {
      hreflangIssues.push(`\`${locToPath(u.loc)}\` — missing alternate(s): ${missing.join(", ")}`);
    }
    if (!altLangs.has("x-default")) {
      hreflangIssues.push(`\`${locToPath(u.loc)}\` — missing x-default alternate`);
    }
    // Reciprocity: every alternate href must point to a known sitemap entry.
    for (const a of u.alternates) {
      const p = locToPath(a.href);
      if (!sitemapAll.has(p)) {
        hreflangIssues.push(`\`${locToPath(u.loc)}\` — alternate \`${a.lang}\` → \`${p}\` not present in sitemap`);
      }
    }
  }

  lines.push("## Hreflang reciprocity");
  lines.push("");
  lines.push(`Audited ${sitemapUrls.length} \`<url>\` blocks across the sitemap tree. For each block we require that all six BCP-47 codes (\`${[...expectedBcp47].join("`, `")}\`) plus an \`x-default\` alternate are present, and that every \`xhtml:link rel="alternate"\` \`href\` resolves to another URL inside the same sitemap tree.`);
  lines.push("");
  lines.push(`- Hreflang inconsistencies detected: **${hreflangIssues.length}**`);
  if (hreflangIssues.length === 0) {
    lines.push("- All sitemap entries advertise the full 6-locale BCP-47 set + `x-default` and every alternate `href` is itself a sitemap entry. Confirms reciprocal hreflang clusters of 7 (6 locales + x-default) per canonical URL.");
  } else {
    lines.push("");
    for (const h of hreflangIssues.slice(0, 50)) lines.push(`- ${h}`);
    if (hreflangIssues.length > 50) lines.push(`- … (+${hreflangIssues.length - 50} more)`);
  }
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Orphans (reachable but not in sitemap): **${totalOrphansToward}**`);
  lines.push(`- Orphans (in sitemap but unreachable ≤3 clicks): **${totalOrphansOnSite}**`);
  lines.push(`- Ghost URLs (sitemap entries 404/redirect/noindex): **${totalGhost}**`);
  lines.push(`- Hreflang inconsistencies: **${hreflangIssues.length}**`);
  lines.push("");

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, lines.join("\n"));
  console.log(`[seo-orphan-audit] wrote ${relative(REPO_ROOT, REPORT_PATH)}`);
  console.log(`[seo-orphan-audit] summary: orphans-toward=${totalOrphansToward} orphans-on-site=${totalOrphansOnSite} ghost=${totalGhost}`);

  const strict = process.argv.includes("--strict") || process.env.ORPHAN_AUDIT_STRICT === "1";
  if (strict) {
    const failures = totalOrphansToward + totalOrphansOnSite + totalGhost;
    if (failures > 0) {
      console.error(`[seo-orphan-audit] STRICT FAIL: ${totalOrphansToward} orphans-toward, ${totalOrphansOnSite} orphans-on-site, ${totalGhost} ghost URL(s). See ${relative(REPO_ROOT, REPORT_PATH)}`);
      process.exit(1);
    }
    console.log(`[seo-orphan-audit] STRICT OK (0 orphans, 0 ghost URLs)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
