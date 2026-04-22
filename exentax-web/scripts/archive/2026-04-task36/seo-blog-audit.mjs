#!/usr/bin/env node
/**
 * seo-blog-audit.mjs
 * Comprehensive SEO audit for the 74 blog posts × 6 languages.
 * Outputs a JSON report and a human-readable summary.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const DATA = join(REPO, "client/src/data");
const CONTENT = join(DATA, "blog-content");
const I18N = join(DATA, "blog-i18n");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const TITLE_MAX = 60;   // Google SERP title limit
const DESC_MAX = 155;   // description limit
const DESC_MIN = 70;    // too-short threshold
const TITLE_MIN = 30;

// --- Load blog-posts.ts (Spanish source) ---
const blogPostsSrc = readFileSync(join(DATA, "blog-posts.ts"), "utf8");

function extractObjects(src) {
  const startIdx = src.indexOf("BLOG_POSTS");
  const eqIdx = src.indexOf("=", startIdx);
  const arrStart = src.indexOf("[", eqIdx);
  let depth = 0, end = -1;
  for (let i = arrStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const arrSrc = src.slice(arrStart + 1, end);
  const items = [];
  let bd = 0, ostart = -1;
  for (let i = 0; i < arrSrc.length; i++) {
    const c = arrSrc[i];
    if (c === "{") { if (bd === 0) ostart = i; bd++; }
    else if (c === "}") { bd--; if (bd === 0) items.push(arrSrc.slice(ostart, i + 1)); }
  }
  return items.map(parseObj);
}

function parseObj(s) {
  const get = (k) => {
    const re = new RegExp(`${k}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
    const m = s.match(re);
    return m ? m[1].replace(/\\"/g, '"') : undefined;
  };
  const getNum = (k) => {
    const m = s.match(new RegExp(`${k}:\\s*(\\d+)`));
    return m ? Number(m[1]) : undefined;
  };
  const getArr = (k) => {
    const re = new RegExp(`${k}\\s*:\\s*\\[([^\\]]*)\\]`);
    const m = s.match(re);
    if (!m) return [];
    return [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
  };
  return {
    slug: get("slug"),
    title: get("title"),
    excerpt: get("excerpt"),
    category: get("category"),
    readTime: getNum("readTime"),
    publishedAt: get("publishedAt"),
    updatedAt: get("updatedAt"),
    metaTitle: get("metaTitle"),
    metaDescription: get("metaDescription"),
    keywords: getArr("keywords"),
    countries: getArr("countries"),
  };
}

const POSTS = extractObjects(blogPostsSrc);

// --- Load i18n metadata for non-ES languages ---
const I18N_META = { es: {} };
for (const slug of POSTS.map(p => p.slug)) {
  I18N_META.es[slug] = {
    title: POSTS.find(p => p.slug === slug).title,
    excerpt: POSTS.find(p => p.slug === slug).excerpt,
    metaTitle: POSTS.find(p => p.slug === slug).metaTitle,
    metaDescription: POSTS.find(p => p.slug === slug).metaDescription,
    keywords: POSTS.find(p => p.slug === slug).keywords,
  };
}
for (const lang of LANGS.filter(l => l !== "es")) {
  const file = join(I18N, `${lang}.ts`);
  const src = readFileSync(file, "utf8");
  // Each entry: "slug": { title: "...", excerpt: "...", metaTitle: "...", metaDescription: "...", keywords: [...] }
  I18N_META[lang] = {};
  const re = /"([a-z0-9-]+)":\s*\{\s*title:\s*"((?:[^"\\]|\\.)*)",\s*excerpt:\s*"((?:[^"\\]|\\.)*)",\s*metaTitle:\s*"((?:[^"\\]|\\.)*)",\s*metaDescription:\s*"((?:[^"\\]|\\.)*)"(?:,\s*keywords:\s*\[([^\]]*)\])?/g;
  let m;
  while ((m = re.exec(src))) {
    I18N_META[lang][m[1]] = {
      title: m[2].replace(/\\"/g, '"'),
      excerpt: m[3].replace(/\\"/g, '"'),
      metaTitle: m[4].replace(/\\"/g, '"'),
      metaDescription: m[5].replace(/\\"/g, '"'),
      keywords: m[6] ? [...m[6].matchAll(/"([^"]+)"/g)].map(x => x[1]) : [],
    };
  }
}

// --- Heading hierarchy scan ---
function analyzeContent(text) {
  const lines = text.split("\n");
  const headings = [];
  let inFence = false;
  let inTable = false;
  let words = 0;
  let images = 0;
  let intLinks = 0;
  let extLinks = 0;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (line.startsWith("|") && line.endsWith("|")) { inTable = true; continue; }
    if (inTable && (!line.startsWith("|"))) inTable = false;
    const hm = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (hm) headings.push({ level: hm[1].length, text: hm[2] });
    // word count
    words += (line.replace(/[#*_`>\-]/g, " ").match(/\S+/g) || []).length;
    // images
    images += (line.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
    images += (line.match(/<img\b/g) || []).length;
    // links
    const links = [...line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    for (const [, , href] of links) {
      if (/^https?:\/\//.test(href)) extLinks++;
      else intLinks++;
    }
  }
  // headings issues
  const h1Count = headings.filter(h => h.level === 1).length;
  const issues = [];
  if (h1Count > 1) issues.push(`multiple-h1:${h1Count}`);
  let prev = 1;
  for (const h of headings) {
    if (h.level > prev + 1) issues.push(`skip-${prev}-to-${h.level}:"${h.text.slice(0,40)}"`);
    prev = h.level;
  }
  return { headings, h1Count, issues, words, images, intLinks, extLinks };
}

// Heuristic: language consistency check (sample of obviously-foreign markers)
const LANG_FORBIDDEN = {
  es: [/\b(the|and|with|because|however|therefore)\b/gi],
  en: [/\b(el|la|los|las|porque|sin embargo|pero también)\b/gi],
  fr: [/\b(the|and|porque|sin embargo)\b/gi],
  de: [/\b(the|and|porque|sin embargo)\b/gi],
  pt: [/\b(the|and)\b/gi, /\bel \b/gi],
  ca: [/\b(the|and|porque|sin embargo)\b/gi],
};

const report = { perLang: {}, duplicates: {}, slugs: [], summary: {} };
const allTitlesByLang = {};
const allDescsByLang = {};

for (const lang of LANGS) {
  report.perLang[lang] = { posts: [], stats: { titleOver: 0, descOver: 0, titleShort: 0, descShort: 0, missingMeta: 0, h1Issues: 0, headingSkips: 0, noImages: 0, lowWords: 0, langLeak: 0 } };
  allTitlesByLang[lang] = new Map();
  allDescsByLang[lang] = new Map();
  const langDir = join(CONTENT, lang);
  for (const p of POSTS) {
    const meta = I18N_META[lang][p.slug];
    const contentPath = join(langDir, `${p.slug}.ts`);
    const exists = existsSync(contentPath);
    let analysis = null;
    if (exists) {
      const raw = readFileSync(contentPath, "utf8");
      const m = raw.match(/^export default `([\s\S]*)`;?\s*$/);
      const body = m ? m[1] : raw;
      analysis = analyzeContent(body);
    }
    const item = { slug: p.slug, exists, meta: meta || null, analysis };
    if (!meta) report.perLang[lang].stats.missingMeta++;
    if (meta) {
      const tLen = meta.metaTitle.length;
      const dLen = meta.metaDescription.length;
      if (tLen > TITLE_MAX) report.perLang[lang].stats.titleOver++;
      if (tLen < TITLE_MIN) report.perLang[lang].stats.titleShort++;
      if (dLen > DESC_MAX) report.perLang[lang].stats.descOver++;
      if (dLen < DESC_MIN) report.perLang[lang].stats.descShort++;
      const tk = meta.metaTitle.toLowerCase().trim();
      const dk = meta.metaDescription.toLowerCase().trim();
      if (!allTitlesByLang[lang].has(tk)) allTitlesByLang[lang].set(tk, []);
      allTitlesByLang[lang].get(tk).push(p.slug);
      if (!allDescsByLang[lang].has(dk)) allDescsByLang[lang].set(dk, []);
      allDescsByLang[lang].get(dk).push(p.slug);
    }
    if (analysis) {
      if (analysis.h1Count !== 0 && analysis.h1Count !== 1) report.perLang[lang].stats.h1Issues++;
      if (analysis.issues.some(i => i.startsWith("skip-"))) report.perLang[lang].stats.headingSkips++;
      if (analysis.images === 0) report.perLang[lang].stats.noImages++;
      if (analysis.words < 600) report.perLang[lang].stats.lowWords++;
      // language leak
      const text = readFileSync(contentPath, "utf8");
      let leakCount = 0;
      for (const rx of LANG_FORBIDDEN[lang] || []) {
        const matches = text.match(rx);
        if (matches) leakCount += matches.length;
      }
      item.langLeak = leakCount;
      if (leakCount >= 5) report.perLang[lang].stats.langLeak++;
    }
    report.perLang[lang].posts.push(item);
  }
  // duplicates
  report.duplicates[lang] = { titles: [], descriptions: [] };
  for (const [k, slugs] of allTitlesByLang[lang]) {
    if (slugs.length > 1) report.duplicates[lang].titles.push({ key: k, slugs });
  }
  for (const [k, slugs] of allDescsByLang[lang]) {
    if (slugs.length > 1) report.duplicates[lang].descriptions.push({ key: k, slugs });
  }
}

report.summary.totalPosts = POSTS.length;
report.summary.totalLanguages = LANGS.length;
report.summary.totalArticles = POSTS.length * LANGS.length;

// Slug analysis
report.slugs = POSTS.map(p => ({
  slug: p.slug,
  len: p.slug.length,
  hasStop: /\b(de|el|la|los|las|por|que|para|con|y|o|a)\b/.test(p.slug.split("-").join(" ")),
}));
const longSlugs = report.slugs.filter(s => s.len > 70);
report.summary.longSlugs = longSlugs.length;

// Output
const out = JSON.stringify(report, null, 2);
writeFileSync(join(REPO, "../.local/seo-blog-audit-report.json"), out);

// Human summary
const lines = [];
lines.push("=".repeat(70));
lines.push("SEO BLOG AUDIT — SUMMARY");
lines.push("=".repeat(70));
lines.push(`Total posts: ${report.summary.totalPosts} × ${LANGS.length} langs = ${report.summary.totalArticles} articles\n`);
for (const lang of LANGS) {
  const s = report.perLang[lang].stats;
  lines.push(`[${lang.toUpperCase()}]`);
  lines.push(`  missing-meta:${s.missingMeta}  title>60:${s.titleOver}  title<30:${s.titleShort}  desc>155:${s.descOver}  desc<70:${s.descShort}`);
  lines.push(`  h1-issues:${s.h1Issues}  heading-skips:${s.headingSkips}  no-images:${s.noImages}  low-words(<600):${s.lowWords}  lang-leak:${s.langLeak}`);
  lines.push(`  duplicate-titles: ${report.duplicates[lang].titles.length}  duplicate-descs: ${report.duplicates[lang].descriptions.length}`);
}
lines.push("");
lines.push(`Long slugs (>70 chars): ${longSlugs.length}`);
if (longSlugs.length) lines.push("  " + longSlugs.map(s => `${s.len}: ${s.slug}`).join("\n  "));
console.log(lines.join("\n"));
