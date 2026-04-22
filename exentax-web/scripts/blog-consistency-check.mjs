#!/usr/bin/env node
/**
 * blog-consistency-check.mjs
 * ----------------------------------------------------------------------------
 * Single source of truth for the parity invariant of the blog corpus.
 *
 * Five registries must agree on the exact same set of base (Spanish) slugs:
 *
 *   1. `client/src/data/blog-posts.ts`            — `BLOG_POSTS` array.
 *   2. `client/src/data/blog-content/es/*.ts`     — physical content files.
 *   3. `client/src/data/blog-posts-slugs.ts`      — `BLOG_SLUG_I18N` map.
 *   4. `client/src/data/blog-sources.ts`          — `SOURCES_BY_SLUG` map.
 *   5. `client/src/data/blog-content/<lang>/*.ts` — for every supported
 *      language a content file must exist for every base slug.
 *
 * Additionally:
 *   - Every `BLOG_POSTS[i].category` must be a member of the closed
 *     taxonomy declared in `client/src/lib/blog-categories.ts`
 *     (`BLOG_CATEGORIES`).
 *   - Every base slug must be kebab-case ASCII (`/^[a-z0-9-]+$/`) and
 *     ≤ 80 characters (URL hygiene + Search Console truncation).
 *   - No duplicate base slugs.
 *
 * Exits 0 when every check passes, 1 otherwise. Prints a single
 * machine-friendly summary block plus a human-readable failure detail.
 *
 * Used by:
 *   - `scripts/install-git-hooks.sh` (pre-push)
 *   - `npm run check` (recommended addition)
 *   - `scripts/blog-new-article.mjs` after scaffolding a new article.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

const SUPPORTED_LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const SLUG_RE = /^[a-z0-9-]+$/;
const SLUG_MAX = 80;

function read(rel) {
  return readFileSync(resolve(REPO, rel), "utf8");
}

function listSlugs(lang) {
  const dir = resolve(REPO, `client/src/data/blog-content/${lang}`);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""));
}

function extractBlogPostsSlugs() {
  const src = read("client/src/data/blog-posts.ts");
  const slugs = [...src.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
  const cats = [...src.matchAll(/^\s*category:\s*"([^"]+)"/gm)].map((m) => m[1]);
  // Pair them up — `BLOG_POSTS` order matches.
  return { slugs, categories: cats };
}

function extractI18nSlugs() {
  const src = read("client/src/data/blog-posts-slugs.ts");
  // Match top-level keys of BLOG_SLUG_I18N only. The file also contains
  // BLOG_SLUG_LEGACY_I18N (kept for 301 redirects); slice out just the
  // first map's body so legacy keys are not treated as orphans.
  const startMarker = "BLOG_SLUG_I18N";
  const startIdx = src.indexOf(startMarker);
  if (startIdx < 0) return [];
  const openBrace = src.indexOf("{", startIdx);
  const closeBrace = src.indexOf("};", openBrace);
  const block = src.slice(openBrace, closeBrace);
  return [...block.matchAll(/^  "([a-z0-9-]+)":/gm)].map((m) => m[1]);
}

function extractSourcesSlugs() {
  const src = read("client/src/data/blog-sources.ts");
  const lines = src.split("\n");
  const start = lines.findIndex((l) => /SOURCES_BY_SLUG.*=.*\{/.test(l));
  if (start < 0) return [];
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\};/.test(lines[i])) {
      end = i;
      break;
    }
  }
  const block = lines.slice(start, end + 1).join("\n");
  return [...block.matchAll(/^  "([a-z0-9-]+)":/gm)].map((m) => m[1]);
}

function extractCategoryTaxonomy() {
  const src = read("client/src/lib/blog-categories.ts");
  const m = src.match(/BLOG_CATEGORIES\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function diff(a, b) {
  const setB = new Set(b);
  return a.filter((x) => !setB.has(x));
}

function header(name, ok) {
  return `[${ok ? " ok " : "FAIL"}] ${name}`;
}

function main() {
  const failures = [];
  const summary = [];

  const blog = extractBlogPostsSlugs();
  const esContent = listSlugs("es");
  const i18n = extractI18nSlugs();
  const sources = extractSourcesSlugs();
  const taxonomy = extractCategoryTaxonomy();

  summary.push(`BLOG_POSTS         : ${blog.slugs.length}`);
  summary.push(`ES content files   : ${esContent.length}`);
  summary.push(`BLOG_SLUG_I18N     : ${i18n.length}`);
  summary.push(`SOURCES_BY_SLUG    : ${sources.length}`);
  summary.push(`Categories allowed : ${taxonomy.length}`);

  // 1. Slug format.
  const malformed = blog.slugs.filter((s) => !SLUG_RE.test(s) || s.length > SLUG_MAX);
  const ok1 = malformed.length === 0;
  console.log(header("Slug format (kebab-case, ≤80 chars)", ok1));
  if (!ok1) failures.push(`Malformed slugs: ${malformed.join(", ")}`);

  // 2. Duplicate slugs in BLOG_POSTS.
  const dup = blog.slugs.filter((s, i) => blog.slugs.indexOf(s) !== i);
  const ok2 = dup.length === 0;
  console.log(header("No duplicate slugs in BLOG_POSTS", ok2));
  if (!ok2) failures.push(`Duplicates: ${[...new Set(dup)].join(", ")}`);

  // 3. BLOG_POSTS ↔ ES content.
  const inBpNotEs = diff(blog.slugs, esContent);
  const inEsNotBp = diff(esContent, blog.slugs);
  const ok3 = inBpNotEs.length === 0 && inEsNotBp.length === 0;
  console.log(header("BLOG_POSTS ↔ ES content parity", ok3));
  if (!ok3) {
    if (inBpNotEs.length) failures.push(`In BLOG_POSTS but no ES file: ${inBpNotEs.join(", ")}`);
    if (inEsNotBp.length) failures.push(`In ES but missing BLOG_POSTS entry: ${inEsNotBp.join(", ")}`);
  }

  // 4. ES ↔ BLOG_SLUG_I18N parity.
  const inEsNotI18n = diff(esContent, i18n);
  const inI18nNotEs = diff(i18n, esContent);
  const ok4 = inEsNotI18n.length === 0 && inI18nNotEs.length === 0;
  console.log(header("ES content ↔ BLOG_SLUG_I18N parity", ok4));
  if (!ok4) {
    if (inEsNotI18n.length) failures.push(`No i18n mapping: ${inEsNotI18n.join(", ")}`);
    if (inI18nNotEs.length) failures.push(`Orphan i18n mapping: ${inI18nNotEs.join(", ")}`);
  }

  // 5. ES ↔ SOURCES_BY_SLUG parity.
  const inEsNotSrc = diff(esContent, sources);
  const inSrcNotEs = diff(sources, esContent);
  const ok5 = inEsNotSrc.length === 0 && inSrcNotEs.length === 0;
  console.log(header("ES content ↔ SOURCES_BY_SLUG parity", ok5));
  if (!ok5) {
    if (inEsNotSrc.length) failures.push(`No sources entry: ${inEsNotSrc.join(", ")}`);
    if (inSrcNotEs.length) failures.push(`Orphan sources entry: ${inSrcNotEs.join(", ")}`);
  }

  // 6. Per-language content file presence.
  for (const lang of SUPPORTED_LANGS) {
    if (lang === "es") continue;
    const langSlugs = listSlugs(lang);
    const missing = diff(esContent, langSlugs);
    const orphan = diff(langSlugs, esContent);
    const okLang = missing.length === 0 && orphan.length === 0;
    console.log(header(`${lang}/ content file parity vs ES`, okLang));
    if (!okLang) {
      if (missing.length) failures.push(`${lang} missing files: ${missing.join(", ")}`);
      if (orphan.length) failures.push(`${lang} orphan files: ${orphan.join(", ")}`);
    }
  }

  // 7. Categories belong to the taxonomy.
  const taxSet = new Set(taxonomy);
  const badCats = blog.categories.filter((c) => !taxSet.has(c));
  const ok7 = badCats.length === 0;
  console.log(header(`All categories ∈ BLOG_CATEGORIES (${taxonomy.length})`, ok7));
  if (!ok7) failures.push(`Unknown categories: ${[...new Set(badCats)].join(", ")}`);

  console.log("");
  console.log("--- summary ---");
  summary.forEach((s) => console.log("  " + s));
  console.log("");

  if (failures.length === 0) {
    console.log(`[blog-consistency] ✅ ${blog.slugs.length} articles, parity holds across 5 registries.`);
    process.exit(0);
  } else {
    console.log(`[blog-consistency] ❌ ${failures.length} failure(s):`);
    failures.forEach((f) => console.log("  - " + f));
    process.exit(1);
  }
}

main();
