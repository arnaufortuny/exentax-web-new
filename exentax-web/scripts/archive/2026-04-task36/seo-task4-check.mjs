#!/usr/bin/env node
/*
 * seo-task4-check.mjs
 * ----------------------------------------------------------------------------
 * Static SEO invariants required by Task #4 (SEO técnico, sitemap, AI summary
 * e indexación). Complements scripts/seo-sitemap-check.mjs (which exercises
 * the live sitemap) by validating code-level guarantees that should never
 * regress:
 *
 *   1. blogPost.aiSummary { title, prompt, openWith } exists in all six
 *      i18n locales (es/en/ca/de/fr/pt) and the prompt template references
 *      both {{title}} and {{url}}.
 *   2. blogPost.seoTag1 / seoTag2 / seoAbout exist in all six locales (used
 *      as default article:tag values when an article does not override).
 *   3. The blog post page (client/src/pages/blog/post.tsx) injects an
 *      Article JSON-LD with the required schema.org keys: @type=Article,
 *      headline, description, datePublished, dateModified, author,
 *      publisher (with logo), mainEntityOfPage, url, image, inLanguage.
 *   4. The post page passes ogType="article" with articleMeta containing
 *      publishedTime / modifiedTime / section / tags.
 *   5. The SEO component generates per-language hreflang alternates plus an
 *      x-default pointing at the Spanish version.
 *   6. The blog post fallback (post not found) is the only place that uses
 *      noindex within the blog flow — no production blog URL is excluded.
 *   7. The sitemap and blog sitemap routes emit xhtml:link alternates and
 *      x-default for every blog post URL (string-level inspection of
 *      server/routes/public.ts).
 *
 * Exits 0 when every check passes, 1 otherwise.
 *
 * Usage:
 *   node scripts/seo-task4-check.mjs
 * ----------------------------------------------------------------------------
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "ca", "de", "fr", "pt"];

const errors = [];
const checks = [];
function ok(msg) { checks.push(`✔ ${msg}`); }
function fail(msg) { errors.push(`✘ ${msg}`); }

function read(rel) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) {
    fail(`missing file: ${rel}`);
    return "";
  }
  return readFileSync(p, "utf8");
}

// 1 + 2: i18n locale checks
for (const lang of LANGS) {
  const src = read(`client/src/i18n/locales/${lang}.ts`);
  if (!src) continue;
  const aiBlock = src.match(/aiSummary:\s*\{([\s\S]*?)\},/);
  if (!aiBlock) {
    fail(`[${lang}] missing blogPost.aiSummary block`);
  } else {
    const body = aiBlock[1];
    for (const key of ["title", "prompt", "openWith"]) {
      if (!new RegExp(`\\b${key}\\s*:`).test(body)) {
        fail(`[${lang}] aiSummary.${key} missing`);
      }
    }
    if (!/\{\{title\}\}/.test(body) || !/\{\{url\}\}/.test(body)) {
      fail(`[${lang}] aiSummary.prompt must reference {{title}} and {{url}}`);
    } else {
      ok(`[${lang}] aiSummary block has title/prompt/openWith with template vars`);
    }
  }
  for (const key of ["seoTag1", "seoTag2", "seoAbout"]) {
    if (!new RegExp(`\\b${key}\\s*:\\s*"`).test(src)) {
      fail(`[${lang}] blogPost.${key} missing`);
    }
  }
}

// 3 + 4: blog post page invariants
const postSrc = read("client/src/pages/blog/post.tsx");
if (postSrc) {
  const required = [
    [/"@type":\s*"(Article|BlogPosting)"/, '@type Article|BlogPosting'],
    [/"headline":/, 'headline'],
    [/"description":/, 'description'],
    [/"datePublished":/, 'datePublished'],
    [/"dateModified":/, 'dateModified'],
    [/"author":\s*\{/, 'author object'],
    [/"publisher":\s*\{[\s\S]*?"logo":/, 'publisher with logo'],
    [/"mainEntityOfPage":/, 'mainEntityOfPage'],
    [/"url":/, 'url'],
    [/"image":/, 'image'],
    [/"inLanguage":/, 'inLanguage'],
  ];
  for (const [re, label] of required) {
    if (!re.test(postSrc)) fail(`post.tsx Article JSON-LD missing: ${label}`);
  }
  if (!/ogType="article"/.test(postSrc)) fail(`post.tsx must pass ogType="article"`);
  if (!/articleMeta=\{/.test(postSrc)) fail(`post.tsx must pass articleMeta`);
  for (const f of ["publishedTime", "modifiedTime", "section", "tags"]) {
    if (!new RegExp(`${f}:`).test(postSrc)) fail(`post.tsx articleMeta.${f} missing`);
  }
  // 6: noindex only on fallback
  const noindexHits = (postSrc.match(/noindex/g) || []).length;
  if (noindexHits > 1) {
    fail(`post.tsx has ${noindexHits} noindex usages (expected 1: 404 fallback)`);
  } else {
    ok(`post.tsx Article JSON-LD + ogType + articleMeta + single noindex fallback`);
  }
}

// 5: SEO component hreflang + x-default
const seoSrc = read("client/src/components/SEO.tsx");
if (seoSrc) {
  if (!/rel\s*=\s*["']alternate["']/.test(seoSrc) || !/hreflang\s*=/.test(seoSrc.replace(/\n/g, ""))) {
    fail(`SEO.tsx must emit <link rel="alternate" hreflang>`);
  }
  if (!/x-default/.test(seoSrc)) fail(`SEO.tsx must emit hreflang="x-default"`);
  if (!/getAvailableLangsForSlug/.test(seoSrc)) {
    fail(`SEO.tsx must scope blog hreflang to actually-translated slugs`);
  } else {
    ok(`SEO.tsx emits hreflang per available lang + x-default`);
  }
}

// 7: server sitemap routes (sitemap-index + per-content-type children)
const routesSrc = read("server/routes/public.ts");
if (routesSrc) {
  // /sitemap.xml is now a sitemap-index; the per-content-type children carry
  // the URLs. See docs/indexing-audit-2026-04.md §3.
  const indexBlock = routesSrc.slice(routesSrc.indexOf('app.get("/sitemap.xml"'), routesSrc.indexOf('app.get("/sitemap-pages.xml"'));
  if (!/<sitemapindex/.test(indexBlock)) fail(`/sitemap.xml is not a <sitemapindex>`);
  for (const child of ["/sitemap-pages.xml", "/sitemap-blog.xml", "/sitemap-faq.xml"]) {
    if (!indexBlock.includes(child)) fail(`/sitemap.xml index missing reference to ${child}`);
  }

  const pagesStart = routesSrc.indexOf('app.get("/sitemap-pages.xml"');
  if (pagesStart < 0) {
    fail(`/sitemap-pages.xml route missing`);
  } else {
    const block = routesSrc.slice(pagesStart, pagesStart + 6000);
    if (!/for \(const routeKey of ALL_ROUTE_KEYS\)/.test(block)) fail(`/sitemap-pages.xml does not iterate route keys`);
    if (!/hreflang="x-default"/.test(block)) fail(`/sitemap-pages.xml missing x-default`);
  }

  const faqStart = routesSrc.indexOf('app.get("/sitemap-faq.xml"');
  if (faqStart < 0) {
    fail(`/sitemap-faq.xml route missing`);
  } else {
    const block = routesSrc.slice(faqStart, faqStart + 4000);
    if (!/getLocalizedPath\("faq"/.test(block)) fail(`/sitemap-faq.xml does not emit FAQ URLs per language`);
    if (!/hreflang="x-default"/.test(block)) fail(`/sitemap-faq.xml missing x-default`);
  }

  const blogSitemapStart = routesSrc.indexOf('app.get("/sitemap-blog.xml"');
  if (blogSitemapStart < 0) {
    fail(`/sitemap-blog.xml route missing`);
  } else {
    const blogBlock = routesSrc.slice(blogSitemapStart, blogSitemapStart + 4000);
    if (!/for \(const post of BLOG_POSTS\)/.test(blogBlock)) fail(`/sitemap-blog.xml does not iterate BLOG_POSTS`);
    for (const needle of [
      'xhtml:link rel="alternate" hreflang=',
      'hreflang="x-default"',
      '<news:news>',
    ]) {
      if (!blogBlock.includes(needle)) fail(`/sitemap-blog.xml missing: ${needle}`);
    }
    ok(`/sitemap.xml index + pages/blog/faq children emit per-lang xhtml:link + x-default`);
  }

  if (!/Disallow:\s*\/api\//.test(routesSrc)
      || !/Sitemap:.*sitemap\.xml/.test(routesSrc)
      || !/Sitemap:.*sitemap-pages\.xml/.test(routesSrc)
      || !/Sitemap:.*sitemap-blog\.xml/.test(routesSrc)
      || !/Sitemap:.*sitemap-faq\.xml/.test(routesSrc)) {
    fail(`robots.txt missing api disallow or one of the four Sitemap: lines`);
  } else {
    ok(`robots.txt advertises sitemap-index + 3 child sitemaps and disallows /api`);
  }
}

console.log("\nSEO Task #4 invariants\n----------------------");
for (const c of checks) console.log(c);
if (errors.length) {
  console.log("\nFailures:");
  for (const e of errors) console.log(e);
  console.log(`\n${errors.length} failure(s).`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed.`);
