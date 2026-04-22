#!/usr/bin/env node
/*
 * seo-orphans.mjs
 * ----------------------------------------------------------------------------
 * Detects orphan public pages — URLs in the sitemap with zero inbound
 * navigational links from anywhere in the React component tree.
 *
 * Only "real" navigational link emitters are counted — string literals in
 * SEO/meta blocks, JSON-LD payloads, og:url props, comments, and other
 * non-navigational mentions are ignored. Recognised emitters:
 *
 *   <Link href="/...">                       (wouter <Link>)
 *   <a href="/...">                          (anchor)
 *   useLocation() / setLocation(...)         (wouter)
 *   navigate("/...")                         (programmatic)
 *   lp("...") / getLocalizedPath("...")      (localised route helpers)
 *
 * Dynamic emitters: when a component contains a literal navigational
 * generator like
 *     <Link href={`/${lang}/blog/${getTranslatedSlug(slug, lang)}`}>
 * we expand it to every (lang, available-slug) pair — that *is* a real
 * navigational link source because the component renders one <Link> per
 * post in the lang's index.
 *
 * Exposes:
 *   getInboundCount(url)  → number of navigational link emitters that can
 *                           resolve to `url` (used by the indexing audit).
 *
 * Exit code: 0 if zero orphans, 1 otherwise.
 * ----------------------------------------------------------------------------
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

function read(rel) {
  const p = resolve(ROOT, rel);
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

// ---------- Universe ------------------------------------------------------
const routesSrc = read("shared/routes.ts");
const routeSlugs = {};
{
  const block = routesSrc.match(/ROUTE_SLUGS[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  if (block) {
    const lineRe = /(\w+):\s*\{([^}]+)\}/g;
    let m;
    while ((m = lineRe.exec(block[1]))) {
      const inner = m[2];
      const slugs = {};
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
  const dir = resolve(ROOT, `client/src/data/blog-content/${lang}`);
  blogAvailable[lang] = new Set();
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (f.endsWith(".ts")) blogAvailable[lang].add(f.slice(0, -3));
  }
}

const universe = new Set();
for (const key of Object.keys(routeSlugs)) {
  for (const lang of LANGS) {
    const p = localizedPath(key, lang);
    if (p) universe.add(p);
  }
}
for (const lang of LANGS) universe.add(`/${lang}/blog`);
for (const slug of blogSlugs) {
  for (const lang of LANGS) {
    if (!blogAvailable[lang]?.has(slug)) continue;
    universe.add(`/${lang}/blog/${getTranslatedSlug(slug, lang)}`);
  }
}

// ---------- Inbound link graph -------------------------------------------
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(p);
  }
  return out;
}
const sourceFiles = walk(resolve(ROOT, "client/src"));

// inbound[url] = number of navigational emitters that can resolve to it
const inbound = new Map();
function bump(url, by = 1) {
  if (!url) return;
  inbound.set(url, (inbound.get(url) || 0) + by);
}
function bumpRouteKey(key) {
  for (const lang of LANGS) {
    const p = localizedPath(key, lang);
    if (p) bump(p);
  }
}
function bumpBlogIndex() { for (const lang of LANGS) bump(`/${lang}/blog`); }
function bumpBlogSlug(esSlug) {
  for (const lang of LANGS) {
    if (!blogAvailable[lang]?.has(esSlug)) continue;
    bump(`/${lang}/blog/${getTranslatedSlug(esSlug, lang)}`);
  }
}

const ROUTE_KEY_NAMES = new Set(Object.keys(routeSlugs));

// Only inspect navigational emitters. We deliberately scope each regex to
// JSX-attribute / call-expression contexts, NOT to bare string literals in
// metadata files (which previously caused false reachability claims).
const NAV_EMITTERS = [
  // <Link href="/lang/...">  or  href={`/lang/...`}
  /<Link\b[^>]*?\bhref=\{?["'`]\/(es|en|fr|de|pt|ca)(\/[^"'`#?\s}]*)?["'`]\}?/g,
  // <a href="/lang/...">
  /<a\b[^>]*?\bhref=\{?["'`]\/(es|en|fr|de|pt|ca)(\/[^"'`#?\s}]*)?["'`]\}?/g,
  // setLocation("/lang/..."), navigate("/lang/...")
  /\b(?:setLocation|navigate)\(\s*["'`]\/(es|en|fr|de|pt|ca)(\/[^"'`#?]*)?["'`]/g,
];

// Generic /blog routes
const NAV_BLOG_EMITTERS = [
  /<Link\b[^>]*?\bhref=\{?["'`]\/(blog(?:\/[\w-]+)?)["'`]\}?/g,
  /<a\b[^>]*?\bhref=\{?["'`]\/(blog(?:\/[\w-]+)?)["'`]\}?/g,
  /\b(?:setLocation|navigate)\(\s*["'`]\/(blog(?:\/[\w-]+)?)["'`]/g,
];

for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");

  // Localised route helpers (lp / getLocalizedPath) — only count when wrapped
  // in a navigational context. SEO/canonical/meta uses are intentionally
  // ignored to avoid false reachability claims.
  // Patterns covered:
  //   href={lp("...")}, href={`...${lp("...")}...`}, to={lp("...")},
  //   setLocation(lp("...")), navigate(lp("...")),
  //   <Link href={lp(...)}>, <a href={lp(...)}>
  const navLpPatterns = [
    /\bhref=\{?[^}]*?(?:\blp|getLocalizedPath)\(\s*["'`]([^"'`]+)["'`]/g,
    /\bto=\{?[^}]*?(?:\blp|getLocalizedPath)\(\s*["'`]([^"'`]+)["'`]/g,
    /\b(?:setLocation|navigate)\(\s*(?:\blp|getLocalizedPath)\(\s*["'`]([^"'`]+)["'`]/g,
    // Object-literal nav descriptors used by .map(item => <Link href={item.href}>)
    /\bhref\s*:\s*(?:\blp|getLocalizedPath)\(\s*["'`]([^"'`]+)["'`]/g,
    /\bto\s*:\s*(?:\blp|getLocalizedPath)\(\s*["'`]([^"'`]+)["'`]/g,
    /\bpath\s*:\s*(?:\blp|getLocalizedPath)\(\s*["'`]([^"'`]+)["'`]/g,
  ];
  for (const re of navLpPatterns) {
    for (const m of src.matchAll(re)) {
      const target = m[1];
      if (target === "/blog") bumpBlogIndex();
      else if (target.startsWith("/blog/")) bumpBlogSlug(target.slice(6));
      else if (ROUTE_KEY_NAMES.has(target)) bumpRouteKey(target);
    }
  }

  for (const re of NAV_EMITTERS) {
    for (const m of src.matchAll(re)) {
      bump(`/${m[1]}${m[2] || ""}`);
    }
  }
  for (const re of NAV_BLOG_EMITTERS) {
    for (const m of src.matchAll(re)) {
      if (m[1] === "blog") bumpBlogIndex();
      else bumpBlogSlug(m[1].slice(5));
    }
  }

  // Dynamic blog post emitter — `<Link href={`/${lang}/blog/${getTranslatedSlug(...)}`}>`.
  // The blog index renders one such <Link> per slug in the lang's available
  // posts → expand to every (lang, available-slug) pair.
  if (/<(?:Link|a)\b[^>]*?\bhref=\{`\/\$\{lang\}\/blog\/\$\{getTranslatedSlug\(/.test(src)) {
    for (const lang of LANGS) {
      for (const slug of blogSlugs) {
        if (!blogAvailable[lang]?.has(slug)) continue;
        bump(`/${lang}/blog/${getTranslatedSlug(slug, lang)}`);
      }
    }
  }

  // Language switcher: emits per-lang variants of the *current* main route
  // via getEquivalentPath. Detected only when the helper is used in a
  // navigational context (Link/setLocation), not in metadata/SEO blocks.
  if (/(?:<(?:Link|a)\b[^>]*?\bhref=\{[^}]*?getEquivalentPath\b|(?:setLocation|navigate)\(\s*getEquivalentPath\b)/.test(src)) {
    for (const key of Object.keys(routeSlugs)) bumpRouteKey(key);
    bumpBlogIndex();
  }
}

// blog-related.ts is consumed by RelatedReadsBlock.tsx, which renders
// <Link href={...}>: each related slug is therefore navigational.
const relatedSrc = read("client/src/data/blog-related.ts");
for (const m of relatedSrc.matchAll(/["']([a-z0-9][a-z0-9-]+)["']/g)) {
  if (blogSlugs.includes(m[1])) bumpBlogSlug(m[1]);
}

// ---------- Output --------------------------------------------------------
const orphans = [...universe].filter((u) => !inbound.has(u)).sort();
const orphanByKind = { pages: [], faq: [], blog: [], legal: [], other: [] };
for (const o of orphans) {
  if (/\/(es|en|fr|de|pt|ca)\/blog(\/|$)/.test(o)) orphanByKind.blog.push(o);
  else if (/\/legal\//.test(o)) orphanByKind.legal.push(o);
  else if (Object.values(routeSlugs.faq || {}).some((s) => o.endsWith(`/${s}`))) orphanByKind.faq.push(o);
  else orphanByKind.pages.push(o);
}

console.log(`Universe: ${universe.size} expected public URLs`);
console.log(`Distinct URLs with at least one inbound navigational link: ${[...inbound.keys()].filter(u => universe.has(u)).length}`);
console.log(`Orphans (in universe, no inbound navigational link): ${orphans.length}`);
for (const kind of Object.keys(orphanByKind)) {
  if (orphanByKind[kind].length === 0) continue;
  console.log(`  - ${kind} (${orphanByKind[kind].length}):`);
  for (const o of orphanByKind[kind].slice(0, 30)) console.log(`      ${o}`);
  if (orphanByKind[kind].length > 30) console.log(`      ... +${orphanByKind[kind].length - 30} more`);
}

if (orphans.length === 0) {
  console.log("\nOK — zero orphan public URLs.");
} else {
  console.log(`\nFAIL — ${orphans.length} orphan URL(s).`);
}

if (process.argv.includes("--json")) {
  const payload = { universe: [...universe], inbound: Object.fromEntries(inbound), orphans };
  console.log("---JSON---");
  console.log(JSON.stringify(payload));
}

process.exit(orphans.length === 0 ? 0 : 1);
