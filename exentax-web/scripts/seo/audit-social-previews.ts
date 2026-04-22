#!/usr/bin/env tsx
/**
 * Social previews audit (Open Graph + Twitter Cards)
 *
 * Inspects every static page, every service subpage and every blog post
 * across 6 languages and writes:
 *   docs/audits/previews-audit.json       — full inventory + per-entry issues
 *   docs/audits/previews-optimizadas.json — the optimized OG copy now in
 *                                           the i18n bundles + blog data.
 *
 * Run with: npx tsx scripts/seo/audit-social-previews.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = resolve(__dirname, "..", "..");
const I18N_LOC = join(REPO, "client/src/i18n/locales");
const SUBPAGES_FILE = join(REPO, "client/src/i18n/data/subpages.ts");
const BLOG_I18N = join(REPO, "client/src/data/blog-i18n");
const BLOG_POSTS = join(REPO, "client/src/data/blog-posts.ts");
const OUT_DIR = join(REPO, "docs/audits");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;
type Lang = (typeof LANGS)[number];

const LOCALE_MAP: Record<Lang, string> = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_PT",
  ca: "ca_ES",
};

const OG_TITLE_MAX = 60;
const OG_TITLE_MIN = 20;
const OG_DESC_MAX = 160;
const OG_DESC_MIN = 120;

type PageEntry = {
  scope: "static" | "subpage" | "blog";
  ns: string;
  page: string;
  lang: Lang;
  ogLocale: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string | null;
  ogDescription: string | null;
  effectiveOgTitle: string;
  effectiveOgDescription: string;
  twitterCard: "summary_large_image";
  ogImage: string;
  issues: string[];
};

const DEFAULT_OG_IMAGE = "/og-image.png";

const read = (file: string) => readFileSync(file, "utf8");

function buildEntry(
  scope: "static" | "subpage" | "blog",
  ns: string,
  page: string,
  lang: Lang,
  metaTitle: string,
  metaDescription: string,
  ogTitle: string | null,
  ogDescription: string | null,
): PageEntry {
  const effectiveOgTitle = (ogTitle && ogTitle.trim()) || metaTitle;
  const effectiveOgDescription = (ogDescription && ogDescription.trim()) || metaDescription;
  const issues: string[] = [];
  if (!effectiveOgTitle) issues.push("missing-og-title");
  if (!effectiveOgDescription) issues.push("missing-og-description");
  if (effectiveOgTitle.length > OG_TITLE_MAX) issues.push(`og-title-too-long(${effectiveOgTitle.length}>${OG_TITLE_MAX})`);
  if (effectiveOgTitle.length > 0 && effectiveOgTitle.length < OG_TITLE_MIN) issues.push(`og-title-too-short(${effectiveOgTitle.length}<${OG_TITLE_MIN})`);
  if (effectiveOgDescription.length > OG_DESC_MAX) issues.push(`og-description-too-long(${effectiveOgDescription.length}>${OG_DESC_MAX})`);
  if (effectiveOgDescription.length > 0 && effectiveOgDescription.length < OG_DESC_MIN)
    issues.push(`og-description-short(${effectiveOgDescription.length}<${OG_DESC_MIN})`);
  return {
    scope,
    ns,
    page,
    lang,
    ogLocale: LOCALE_MAP[lang],
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    effectiveOgTitle,
    effectiveOgDescription,
    twitterCard: "summary_large_image",
    ogImage: DEFAULT_OG_IMAGE,
    issues,
  };
}

function extractStaticPages(lang: Lang): PageEntry[] {
  const src = read(join(I18N_LOC, `${lang}.ts`));
  const lines = src.split("\n");
  const out: PageEntry[] = [];
  for (let i = 0; i < lines.length; i++) {
    const mt = lines[i].match(/(?:seoTitle)\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (!mt) continue;
    // Walk backwards tracking brace balance to find the immediately
    // enclosing namespace block. Each unmatched `}` raises depth and each
    // matching `xxx: {` we encounter lowers it; the candidate that brings
    // depth to -1 is our parent.
    let ns = "?";
    let depth = 0;
    for (let k = i - 1; k >= 0; k--) {
      const closes = (lines[k].match(/\}/g) || []).length;
      const opens = (lines[k].match(/\{/g) || []).length;
      depth += closes - opens;
      if (depth < 0) {
        const m = lines[k].match(/^\s*([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*\{/);
        if (m) {
          ns = m[1];
          break;
        }
        depth = 0; // not a named block (e.g. arrow body); keep searching
      }
    }
    let metaDesc = "";
    let ogTitle: string | null = null;
    let ogDesc: string | null = null;
    for (let j = i + 1; j < Math.min(i + 14, lines.length); j++) {
      const md = lines[j].match(/(?:seoDesc|seoDescription)\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (md) metaDesc = md[1];
      const mot = lines[j].match(/ogTitle\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (mot) ogTitle = mot[1];
      const mod = lines[j].match(/(?:ogDesc|ogDescription)\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (mod) ogDesc = mod[1];
      if (/^\s{0,4}\}/.test(lines[j])) break;
    }
    out.push(buildEntry("static", ns, ns, lang, mt[1], metaDesc, ogTitle, ogDesc));
  }
  return out;
}

function extractSubpages(): PageEntry[] {
  const src = read(SUBPAGES_FILE);
  const lines = src.split("\n");
  const langStarts: { lang: Lang; start: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^const\s+(es|en|fr|de|pt|ca)\s*:\s*SubpagesBase\s*=\s*\{/);
    if (m) langStarts.push({ lang: m[1] as Lang, start: i });
  }
  const out: PageEntry[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*seo:\s*\{\s*$/.test(lines[i])) continue;
    let lang: Lang | null = null;
    for (const ls of langStarts) if (i >= ls.start) lang = ls.lang;
    if (!lang) continue;
    let page = "?";
    for (let k = i - 1; k > 0; k--) {
      const pm = lines[k].match(/^\s{2}([a-zA-Z]+):\s*\{/);
      if (pm && ["llcNm", "llcWy", "llcDe", "llcFl", "itin"].includes(pm[1])) {
        page = pm[1];
        break;
      }
    }
    let title = "";
    let desc = "";
    let ogTitle: string | null = null;
    let ogDesc: string | null = null;
    for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
      if (/^\s*\},?\s*$/.test(lines[j])) break;
      const mt = lines[j].match(/title\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (mt && !title) title = mt[1];
      const md = lines[j].match(/description\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (md && !desc) desc = md[1];
      const mot = lines[j].match(/ogTitle\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (mot) ogTitle = mot[1];
      const mod = lines[j].match(/ogDescription\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (mod) ogDesc = mod[1];
    }
    out.push(buildEntry("subpage", "subpages." + page, page, lang, title, desc, ogTitle, ogDesc));
  }
  return out;
}

type BlogMeta = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  socialDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
};

function pickField(block: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const m = block.match(re);
  return m ? m[1] : null;
}

function extractBlogEs(): BlogMeta[] {
  const src = read(BLOG_POSTS);
  // Split by entry separators: each entry is wrapped in `{ ... }` inside BLOG_POSTS.
  // Anchor on `slug:` lines, then take the chunk up to the next `slug:` or end.
  const slugRe = /(\n\s+\{\n\s+slug:\s*"([a-z0-9-]+)",[\s\S]*?\n\s+\},)/g;
  const items: BlogMeta[] = [];
  let m: RegExpExecArray | null;
  while ((m = slugRe.exec(src))) {
    const block = m[1];
    const slug = m[2];
    const metaTitle = pickField(block, "metaTitle") || "";
    if (!metaTitle) continue;
    items.push({
      slug,
      metaTitle,
      metaDescription: pickField(block, "metaDescription") || "",
      socialDescription: pickField(block, "socialDescription"),
      ogTitle: pickField(block, "ogTitle"),
      ogDescription: pickField(block, "ogDescription"),
    });
  }
  return items;
}

function extractBlogI18n(lang: Exclude<Lang, "es">): BlogMeta[] {
  const file = join(BLOG_I18N, `${lang}.ts`);
  if (!existsSync(file)) return [];
  const src = read(file);
  const items: BlogMeta[] = [];
  // Each entry sits on a single line: "slug": { … },
  const lineRe = /^\s*"([a-z0-9-]+)":\s*\{(.*)\}\s*,?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(src))) {
    const slug = m[1];
    const body = m[2];
    const metaTitle = pickField(body, "metaTitle") || "";
    if (!metaTitle) continue;
    items.push({
      slug,
      metaTitle,
      metaDescription: pickField(body, "metaDescription") || "",
      socialDescription: pickField(body, "socialDescription"),
      ogTitle: pickField(body, "ogTitle"),
      ogDescription: pickField(body, "ogDescription"),
    });
  }
  return items;
}

// ---------------- main ----------------
const allEntries: PageEntry[] = [];
for (const lang of LANGS) {
  for (const e of extractStaticPages(lang)) allEntries.push(e);
}
for (const e of extractSubpages()) allEntries.push(e);

for (const lang of LANGS) {
  const items = lang === "es" ? extractBlogEs() : extractBlogI18n(lang);
  for (const b of items) {
    allEntries.push(
      buildEntry("blog", "blog", b.slug, lang, b.metaTitle, b.metaDescription, b.ogTitle, b.ogDescription || b.socialDescription),
    );
  }
}

type Sum = { total: number; static: number; subpages: number; blog: number; withExplicitOgTitle: number; withExplicitOgDescription: number; issues: number };
const empty = (): Sum => ({ total: 0, static: 0, subpages: 0, blog: 0, withExplicitOgTitle: 0, withExplicitOgDescription: 0, issues: 0 });
const summary: Record<Lang, Sum> = { es: empty(), en: empty(), fr: empty(), de: empty(), pt: empty(), ca: empty() };

for (const e of allEntries) {
  const s = summary[e.lang];
  s.total++;
  if (e.scope === "static") s.static++;
  if (e.scope === "subpage") s.subpages++;
  if (e.scope === "blog") s.blog++;
  if (e.ogTitle) s.withExplicitOgTitle++;
  if (e.ogDescription) s.withExplicitOgDescription++;
  if (e.issues.length) s.issues++;
}

mkdirSync(OUT_DIR, { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  rules: {
    ogTitleMax: OG_TITLE_MAX,
    ogTitleMin: OG_TITLE_MIN,
    ogDescriptionMax: OG_DESC_MAX,
    ogDescriptionMin: OG_DESC_MIN,
    twitterCard: "summary_large_image",
    ogImage: DEFAULT_OG_IMAGE,
    localeMap: LOCALE_MAP,
  },
  summary,
  entries: allEntries,
};
writeFileSync(join(OUT_DIR, "previews-audit.json"), JSON.stringify(audit, null, 2), "utf8");

const optimized = {
  generatedAt: new Date().toISOString(),
  description:
    "Snapshot of the optimized social preview copy (Open Graph + Twitter Cards) now persisted in the i18n bundles, the service subpage data and the blog metadata files. ogTitle is capped at 60 chars; ogDescription is windowed to 120–160 chars by scripts/seo/inject-blog-og.mjs (blog) and by hand for static + subpages.",
  staticPages: allEntries
    .filter((e) => e.scope === "static" && e.ogTitle)
    .map((e) => ({
      ns: e.ns,
      lang: e.lang,
      ogLocale: e.ogLocale,
      ogTitle: e.ogTitle,
      ogDescription: e.ogDescription || e.metaDescription,
      ogImage: e.ogImage,
      twitterCard: e.twitterCard,
    })),
  subpages: allEntries
    .filter((e) => e.scope === "subpage" && e.ogTitle)
    .map((e) => ({
      page: e.page,
      lang: e.lang,
      ogLocale: e.ogLocale,
      ogTitle: e.ogTitle,
      ogDescription: e.ogDescription || e.metaDescription,
      ogImage: e.ogImage,
      twitterCard: e.twitterCard,
    })),
  blog: allEntries
    .filter((e) => e.scope === "blog")
    .map((e) => ({
      slug: e.page,
      lang: e.lang,
      ogLocale: e.ogLocale,
      ogTitle: e.effectiveOgTitle,
      ogDescription: e.effectiveOgDescription,
      ogImage: e.ogImage,
      twitterCard: e.twitterCard,
    })),
};
writeFileSync(join(OUT_DIR, "previews-optimizadas.json"), JSON.stringify(optimized, null, 2), "utf8");

const totals = {
  totalEntries: allEntries.length,
  totalIssues: allEntries.reduce((n, e) => n + (e.issues.length ? 1 : 0), 0),
};
console.log("Wrote", join(OUT_DIR, "previews-audit.json"));
console.log("Wrote", join(OUT_DIR, "previews-optimizadas.json"));
console.log("Summary:", JSON.stringify({ ...totals, perLang: summary }, null, 2));
