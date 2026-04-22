#!/usr/bin/env node
/**
 * SEO meta audit — fails the build if blog post metadata is incomplete or
 * out of bounds in any of the 6 supported languages (es/en/fr/de/pt/ca).
 *
 * Rules enforced:
 *  - Every entry in BLOG_POSTS must declare metaTitle and metaDescription.
 *  - metaTitle ≤ 60 chars (Google cuts ~580 px around there).
 *  - metaDescription ≤ 160 chars (hard SERP cap).
 *  - For every translated content file present on disk under
 *    `client/src/data/blog-content/<lang>/<slug>.ts`, an entry must exist in
 *    `client/src/data/blog-i18n/<lang>.ts` with non-empty metaTitle and
 *    metaDescription that respect the same length caps.
 *
 * Exit code 0 = clean. Exit code 1 = at least one violation (CI-friendly).
 *
 * Usage:  node exentax-web/scripts/seo-meta-audit.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "..", "client", "src", "data");
const CONTENT = path.join(DATA, "blog-content");
const LANGS_T = ["en", "fr", "de", "pt", "ca"];

const TITLE_MAX = 60;
const DESC_MAX = 160;

const read = p => fs.readFileSync(p, "utf8");
const exists = p => { try { fs.accessSync(p); return true; } catch { return false; } };

function parseEsPosts() {
  const src = read(path.join(DATA, "blog-posts.ts"));
  const start = src.indexOf("export const BLOG_POSTS");
  const eq = src.indexOf("=", start);
  const body = src.slice(eq + 1);
  const arrStart = body.indexOf("[");
  let depth = 0, end = -1;
  for (let i = arrStart; i < body.length; i++) {
    if (body[i] === "[") depth++;
    else if (body[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const arrText = body.slice(arrStart + 1, end);
  const out = [];
  let buf = "", inStr = false, sc = "";
  depth = 0;
  for (let j = 0; j < arrText.length; j++) {
    const c = arrText[j], prev = arrText[j - 1];
    if (inStr) { buf += c; if (c === sc && prev !== "\\") inStr = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = true; sc = c; buf += c; continue; }
    if (c === "{") { depth++; buf += c; continue; }
    if (c === "}") { depth--; buf += c; if (depth === 0) { out.push(buf); buf = ""; } continue; }
    if (depth > 0) buf += c;
  }
  return out.map(t => {
    const get = re => { const m = t.match(re); return m ? m[1] : ""; };
    const slug = get(/slug:\s*"([^"]+)"/);
    if (!slug) return null;
    return {
      slug,
      metaTitle: get(/metaTitle:\s*"((?:[^"\\]|\\.)*)"/),
      metaDescription: get(/metaDescription:\s*"((?:[^"\\]|\\.)*)"/),
    };
  }).filter(Boolean);
}

function parseI18n(lang) {
  const f = path.join(DATA, "blog-i18n", `${lang}.ts`);
  if (!exists(f)) return {};
  const src = read(f);
  const map = {};
  const re = /"([^"]+)":\s*\{\s*title:\s*"(?:[^"\\]|\\.)*",\s*excerpt:\s*"(?:[^"\\]|\\.)*",\s*metaTitle:\s*"((?:[^"\\]|\\.)*)",\s*metaDescription:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))) map[m[1]] = { metaTitle: m[2], metaDescription: m[3] };
  return map;
}

const errors = [];
const warn = (slug, lang, msg) => errors.push(`${slug} [${lang}] — ${msg}`);

const posts = parseEsPosts();
for (const p of posts) {
  if (!p.metaTitle) warn(p.slug, "es", "metaTitle missing");
  else if (p.metaTitle.length > TITLE_MAX) warn(p.slug, "es", `metaTitle ${p.metaTitle.length} > ${TITLE_MAX}`);
  if (!p.metaDescription) warn(p.slug, "es", "metaDescription missing");
  else if (p.metaDescription.length > DESC_MAX) warn(p.slug, "es", `metaDescription ${p.metaDescription.length} > ${DESC_MAX}`);
}

const esSlugs = new Set(posts.map(p => p.slug));
for (const lang of LANGS_T) {
  const meta = parseI18n(lang);
  const dir = path.join(CONTENT, lang);
  if (!exists(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts")).map(f => f.replace(/\.ts$/, ""));
  for (const slug of files) {
    if (!esSlugs.has(slug)) continue;
    const m = meta[slug];
    if (!m) { warn(slug, lang, "translated meta entry missing in blog-i18n/" + lang + ".ts"); continue; }
    if (!m.metaTitle) warn(slug, lang, "metaTitle missing");
    else if (m.metaTitle.length > TITLE_MAX) warn(slug, lang, `metaTitle ${m.metaTitle.length} > ${TITLE_MAX}`);
    if (!m.metaDescription) warn(slug, lang, "metaDescription missing");
    else if (m.metaDescription.length > DESC_MAX) warn(slug, lang, `metaDescription ${m.metaDescription.length} > ${DESC_MAX}`);
  }
}

// ---------------------------------------------------------------------------
// Static SEO/H1 hygiene check on public pages.
//
// Every "public" page (anything that lands on a /<lang>/... URL the user can
// reach) MUST:
//   - render exactly one <h1> (heading hierarchy)
//   - mount the <SEO> component (which sets canonical + og:* + twitter:*).
//
// Pages explicitly excluded: 404, internal-only routes, non-page components.
// ---------------------------------------------------------------------------
const PAGES_DIR = path.resolve(__dirname, "..", "client", "src", "pages");
// Files that are NOT public pages (admin, internal components, 404, route
// shells used by other pages, or non-route entry points without their own
// canonical URL).
// Only the 404 shell and non-route helper components are out of scope.
// Booking / start / go / legal/* are public URLs and MUST satisfy the
// audit; noindex pages get a relaxed h1 rule (handled below) but still
// need a <SEO> component.
const PAGE_EXEMPT = new Set([
  "not-found.tsx",
  "services-sections.tsx",
]);
function walkPages(dir, rel = "") {
  const out = [];
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "admin") continue; // admin = private, never public.
      out.push(...walkPages(p, r));
    } else if (e.name.endsWith(".tsx")) {
      out.push(r);
    }
  }
  return out;
}
// Components known to render a single <h1>. A page that imports any of them
// satisfies the H1 hygiene check even if it does not declare <h1> directly.
const H1_PROVIDERS = new Set(["Hero", "FAQ", "LegalLayout", "ServiceSubpage"]);
// Components known to render <SEO> internally. A page that imports any of
// them satisfies the SEO hygiene check.
const SEO_PROVIDERS = new Set(["LegalLayout", "ServiceSubpage"]);
const pageFiles = walkPages(PAGES_DIR);
let pagesChecked = 0;
for (const rel of pageFiles) {
  if (PAGE_EXEMPT.has(rel) || PAGE_EXEMPT.has(path.basename(rel))) continue;
  const txt = read(path.join(PAGES_DIR, rel));
  const directSEO = /<SEO\b/.test(txt) || /useDocumentMeta\s*\(/.test(txt);
  const isNoindex = /<SEO\b[^>]*\bnoindex\b/.test(txt) || /noindex\s*[:=]\s*true/.test(txt);
  const directH1 = (txt.match(/<h1\b/g) || []).length;
  const importedNames = [...txt.matchAll(/import\s+(?:\{\s*([\w,\s]+)\s*\}|(\w+))\s+from\s+["']([^"']+)["']/g)]
    .flatMap(m => (m[1] ? m[1].split(",").map(s => s.trim()) : [m[2]]))
    .filter(Boolean);
  // Also detect lazy dynamic imports: `const Foo = lazy(() => import("..."))`.
  // Without this, lazy-loaded H1 providers (e.g. `FAQ` in faq-page.tsx) are
  // treated as absent and the audit blocks the build.
  const lazyImportedNames = [...txt.matchAll(/const\s+(\w+)\s*=\s*lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(/g)]
    .map(m => m[1])
    .filter(Boolean);
  const allImportedNames = [...importedNames, ...lazyImportedNames];
  const importedH1 = allImportedNames.some(name => H1_PROVIDERS.has(name));
  const importedSEO = allImportedNames.some(name => SEO_PROVIDERS.has(name));
  const hasSEO = directSEO || importedSEO;
  const h1Effective = directH1 + (importedH1 ? 1 : 0);
  if (!hasSEO) errors.push(`${rel} [page] — missing <SEO> component (canonical / og / twitter not set; SEO_PROVIDERS=${[...SEO_PROVIDERS].join("/")})`);
  // noindex pages may legitimately render >1 <h1> across mutually-exclusive
  // conditional branches (e.g. booking lookup: not-found vs found state).
  // They still need at least one h1, but multiplicity is tolerated.
  if (h1Effective < 1) errors.push(`${rel} [page] — no <h1> found (direct or via H1_PROVIDERS ${[...H1_PROVIDERS].join("/")})`);
  if (!isNoindex && h1Effective > 1) errors.push(`${rel} [page] — multiple <h1> sources detected (direct=${directH1}, via providers=${importedH1?1:0}); set noindex if these are conditional renders`);
  pagesChecked++;
}

if (errors.length) {
  console.error(`SEO META AUDIT — ${errors.length} violation(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`SEO META AUDIT — OK (${posts.length} posts × ${1 + LANGS_T.length} langs, ${pagesChecked} public pages).`);
