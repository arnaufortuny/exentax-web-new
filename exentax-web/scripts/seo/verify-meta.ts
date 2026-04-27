#!/usr/bin/env tsx
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = resolve(__dirname, "..", "..");
const I18N_LOC = join(REPO, "client/src/i18n/locales");
const SUBPAGES_FILE = join(REPO, "client/src/i18n/data/subpages.ts");
const BLOG_I18N = join(REPO, "client/src/data/blog-i18n");
const BLOG_CONTENT = join(REPO, "client/src/data/blog-content");
const BLOG_POSTS = join(REPO, "client/src/data/blog-posts.ts");
const OUT = join(REPO, "reports", "seo", "seo-meta-report.json");

const LANGS = ["es", "en", "ca", "fr", "de", "pt"] as const;
type Lang = (typeof LANGS)[number];

const TITLE_MAX = 60;
const TITLE_WARN = 58;
// Task 2 (premium SEO rollout): page descriptions allow up to 165 chars
// (Google's mobile SERP budget) to match the new approved copy.
const DESC_MAX = 165;
const DESC_WARN = 160;
const DESC_MIN = 70;

// SERP-budget gate for the 5 service subpages.
// Task 2 (premium SEO rollout) updated approved copy: titles 40-60 chars,
// descriptions 140-165 chars; CTA-ending requirement softened to a warning.
const SUBPAGE_TITLE_MIN = 40;
const SUBPAGE_TITLE_MAX = 60;
const SUBPAGE_DESC_MIN = 140;
const SUBPAGE_DESC_MAX = 165;
const SUBPAGE_KEYS = ["llcNm", "llcWy", "llcDe", "llcFl", "itin"] as const;
type SubpageKey = (typeof SUBPAGE_KEYS)[number];

// Per-language soft-CTA endings the description must close with.
// Lowercased substring match against the trimmed tail of the description.
const SUBPAGE_CTA_ENDINGS: Record<Lang, string[]> = {
  es: ["reserva tu llamada", "reserva una llamada", "habla con un experto", "habla con nosotros", "empieza hoy", "agenda una llamada", "agenda tu llamada", "solicita info", "pide tu presupuesto", "consulta gratis"],
  en: ["book a free call", "book a call", "book a free consultation", "book a consultation", "talk to an expert", "talk to an expert today", "start today", "get started", "schedule a call"],
  ca: ["reserva la teva trucada", "reserva una trucada", "parla amb un expert", "comença avui", "agenda una trucada", "demana pressupost"],
  fr: ["réservez un appel", "réservez votre appel", "parlez à un expert", "commencez maintenant", "commencez aujourd'hui", "à discuter", "prenez rendez-vous", "démarrez ici", "commencez ici"],
  de: ["jetzt anfragen", "jetzt starten", "termin sichern", "jetzt buchen", "jetzt los", "termin vereinbaren", "gespräch vereinbaren", "kostenlos beraten lassen", "sprechen sie mit einem experten", "sprechen sie uns an"],
  pt: ["agende sua chamada", "agende uma chamada", "agende sua chamada hoje", "fale com um especialista", "fale com especialista", "comece hoje", "comece hoje mesmo", "solicite orçamento"],
};
function endsWithSoftCTA(lang: Lang, desc: string): boolean {
  const tail = desc.toLowerCase().replace(/\s+/g, " ").trim();
  return SUBPAGE_CTA_ENDINGS[lang].some((cta) => tail.endsWith(cta + ".") || tail.endsWith(cta + "!") || tail.endsWith(cta));
}

type PageItem = { ns: string; line: number; descLine: number | null; title: string; desc: string | null };
type BlogItem = { slug: string; metaTitle: string; metaDescription: string };
type Violation = {
  scope: "page" | "blog";
  lang: Lang;
  key: string;
  field: "title" | "description";
  length: number;
  limit: number;
  level: "error" | "warn";
  message: string;
  value: string;
};

function extractPageSEO(lang: Lang): PageItem[] {
  const src = readFileSync(join(I18N_LOC, `${lang}.ts`), "utf8");
  const lines = src.split("\n");
  const items: PageItem[] = [];
  for (let i = 0; i < lines.length; i++) {
    const mt = lines[i].match(/seoTitle\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (!mt) continue;
    let desc: string | null = null;
    let descLine: number | null = null;
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const md = lines[j].match(/(?:seoDesc|seoDescription)\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (md) {
        desc = md[1];
        descLine = j + 1;
        break;
      }
    }
    let ns = "?";
    for (let k = i; k >= 0; k--) {
      const m = lines[k].match(/^\s*([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*\{/);
      if (m) {
        ns = m[1];
        break;
      }
    }
    items.push({ ns, line: i + 1, descLine, title: mt[1], desc });
  }
  return items;
}

type SubpageSEO = { lang: Lang; page: SubpageKey; line: number; title: string; descLine: number; description: string };

function extractSubpageSEO(): SubpageSEO[] {
  const src = readFileSync(SUBPAGES_FILE, "utf8");
  const lines = src.split("\n");
  // Detect each language block start: `const <lang>: SubpagesBase = {`
  const langStarts: { lang: Lang; start: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^const\s+(es|en|ca|fr|de|pt)\s*:\s*SubpagesBase\s*=\s*\{/);
    if (m) langStarts.push({ lang: m[1] as Lang, start: i });
  }
  const items: SubpageSEO[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*seo:\s*\{\s*$/.test(lines[i])) continue;
    const tMatch = lines[i + 1]?.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
    const dMatch = lines[i + 2]?.match(/description:\s*"((?:[^"\\]|\\.)*)"/);
    if (!tMatch || !dMatch) continue;
    // Determine lang
    let lang: Lang | null = null;
    for (const ls of langStarts) if (i >= ls.start) lang = ls.lang;
    if (!lang) continue;
    // Determine page (walk upward to find `<key>: {` two-space indent)
    let page: SubpageKey | null = null;
    for (let k = i - 1; k > 0; k--) {
      const pm = lines[k].match(/^\s{2}([a-zA-Z]+):\s*\{/);
      if (pm && (SUBPAGE_KEYS as readonly string[]).includes(pm[1])) {
        page = pm[1] as SubpageKey;
        break;
      }
    }
    if (!page) continue;
    items.push({ lang, page, line: i + 2, title: tMatch[1], descLine: i + 3, description: dMatch[1] });
  }
  return items;
}

function listBlogContentSlugs(lang: Lang): string[] {
  const dir = join(BLOG_CONTENT, lang);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""));
}

function extractBlogMeta(lang: Lang): BlogItem[] {
  const items: BlogItem[] = [];
  if (lang === "es") {
    const src = readFileSync(BLOG_POSTS, "utf8");
    const re = /slug:\s*"([a-z0-9-]+)"[\s\S]*?metaTitle:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?metaDescription:\s*"((?:[^"\\]|\\.)*)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) items.push({ slug: m[1], metaTitle: m[2], metaDescription: m[3] });
  } else {
    const src = readFileSync(join(BLOG_I18N, `${lang}.ts`), "utf8");
    const re = /"([a-z0-9-]+)":\s*\{[^}]*?metaTitle:\s*"((?:[^"\\]|\\.)*)",\s*metaDescription:\s*"((?:[^"\\]|\\.)*)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) items.push({ slug: m[1], metaTitle: m[2], metaDescription: m[3] });
  }
  return items;
}

type IndexedEntry = {
  scope: "page" | "blog";
  lang: Lang;
  key: string;
  title: string;
  description: string;
};

const globalIndex: IndexedEntry[] = [];
const violations: Violation[] = [];
const warnings: Violation[] = [];
const summary: Record<string, { pages: number; blog: number; errors: number; warnings: number; duplicateTitles: number; duplicateDescriptions: number }> = {};

const blogContentByLang: Record<string, { contentSlugs: string[]; missingMeta: string[]; orphanMeta: string[] }> = {};

for (const lang of LANGS) {
  const pages = extractPageSEO(lang);
  const blog = extractBlogMeta(lang);
  const contentSlugs = listBlogContentSlugs(lang);
  const metaSlugs = new Set(blog.map((b) => b.slug));
  const contentSet = new Set(contentSlugs);
  const missingMeta = contentSlugs.filter((s) => !metaSlugs.has(s));
  const orphanMeta = blog.map((b) => b.slug).filter((s) => !contentSet.has(s));
  blogContentByLang[lang] = { contentSlugs, missingMeta, orphanMeta };
  let errors = 0;
  let warns = 0;

  const pushIssue = (v: Violation) => {
    if (v.level === "error") {
      violations.push(v);
      errors++;
    } else {
      warnings.push(v);
      warns++;
    }
  };

  for (const p of pages) {
    const tLen = p.title.length;
    if (tLen > TITLE_MAX)
      pushIssue({ scope: "page", lang, key: `${p.ns}@L${p.line}`, field: "title", length: tLen, limit: TITLE_MAX, level: "error", message: `Title exceeds ${TITLE_MAX} chars`, value: p.title });
    else if (tLen > TITLE_WARN)
      pushIssue({ scope: "page", lang, key: `${p.ns}@L${p.line}`, field: "title", length: tLen, limit: TITLE_WARN, level: "warn", message: `Title exceeds soft limit ${TITLE_WARN}`, value: p.title });

    globalIndex.push({ scope: "page", lang, key: `${p.ns}@L${p.line}`, title: p.title, description: p.desc || "" });

    if (!p.desc) {
      pushIssue({ scope: "page", lang, key: `${p.ns}@L${p.line}`, field: "description", length: 0, limit: DESC_MAX, level: "error", message: "Missing meta description", value: "" });
    } else {
      const dLen = p.desc.length;
      if (dLen > DESC_MAX)
        pushIssue({ scope: "page", lang, key: `${p.ns}@L${p.descLine}`, field: "description", length: dLen, limit: DESC_MAX, level: "error", message: `Description exceeds ${DESC_MAX} chars`, value: p.desc });
      else if (dLen > DESC_WARN)
        pushIssue({ scope: "page", lang, key: `${p.ns}@L${p.descLine}`, field: "description", length: dLen, limit: DESC_WARN, level: "warn", message: `Description exceeds soft limit ${DESC_WARN}`, value: p.desc });
      if (dLen < DESC_MIN)
        pushIssue({ scope: "page", lang, key: `${p.ns}@L${p.descLine}`, field: "description", length: dLen, limit: DESC_MIN, level: "warn", message: `Description shorter than ${DESC_MIN} chars`, value: p.desc });
    }
  }

  for (const slug of missingMeta) {
    pushIssue({ scope: "blog", lang, key: slug, field: "title", length: 0, limit: 0, level: "error", message: `Blog content file ${lang}/${slug}.ts has no metaTitle/metaDescription entry`, value: "" });
  }

  for (const b of blog) {
    globalIndex.push({ scope: "blog", lang, key: b.slug, title: b.metaTitle, description: b.metaDescription });
    const tLen = b.metaTitle.length;
    const dLen = b.metaDescription.length;
    if (tLen > TITLE_MAX)
      pushIssue({ scope: "blog", lang, key: b.slug, field: "title", length: tLen, limit: TITLE_MAX, level: "error", message: `Title exceeds ${TITLE_MAX} chars`, value: b.metaTitle });
    else if (tLen > TITLE_WARN)
      pushIssue({ scope: "blog", lang, key: b.slug, field: "title", length: tLen, limit: TITLE_WARN, level: "warn", message: `Title exceeds soft limit ${TITLE_WARN}`, value: b.metaTitle });
    if (dLen > DESC_MAX)
      pushIssue({ scope: "blog", lang, key: b.slug, field: "description", length: dLen, limit: DESC_MAX, level: "error", message: `Description exceeds ${DESC_MAX} chars`, value: b.metaDescription });
    else if (dLen > DESC_WARN)
      pushIssue({ scope: "blog", lang, key: b.slug, field: "description", length: dLen, limit: DESC_WARN, level: "warn", message: `Description exceeds soft limit ${DESC_WARN}`, value: b.metaDescription });
    if (dLen < DESC_MIN)
      pushIssue({ scope: "blog", lang, key: b.slug, field: "description", length: dLen, limit: DESC_MIN, level: "warn", message: `Description shorter than ${DESC_MIN} chars`, value: b.metaDescription });
  }

  const titleCounts = new Map<string, number>();
  const descCounts = new Map<string, number>();
  for (const b of blog) {
    titleCounts.set(b.metaTitle, (titleCounts.get(b.metaTitle) || 0) + 1);
    descCounts.set(b.metaDescription, (descCounts.get(b.metaDescription) || 0) + 1);
  }
  let dupT = 0;
  let dupD = 0;
  for (const c of titleCounts.values()) if (c > 1) dupT += c;
  for (const c of descCounts.values()) if (c > 1) dupD += c;

  summary[lang] = {
    pages: pages.length,
    blog: blog.length,
    errors,
    warnings: warns,
    duplicateTitles: dupT,
    duplicateDescriptions: dupD,
  };
}

// ===== Service-subpage strict SERP gate (task 25) =====
const subpageItems = extractSubpageSEO();
const subpageSummary: Record<Lang, { count: number; errors: number }> = Object.fromEntries(LANGS.map((l) => [l, { count: 0, errors: 0 }])) as Record<Lang, { count: number; errors: number }>;
for (const item of subpageItems) {
  subpageSummary[item.lang].count++;
  const tLen = item.title.length;
  const dLen = item.description.length;
  const key = `subpages.${item.page}@L${item.line}`;
  if (tLen < SUBPAGE_TITLE_MIN || tLen > SUBPAGE_TITLE_MAX) {
    violations.push({
      scope: "page",
      lang: item.lang,
      key,
      field: "title",
      length: tLen,
      limit: tLen > SUBPAGE_TITLE_MAX ? SUBPAGE_TITLE_MAX : SUBPAGE_TITLE_MIN,
      level: "error",
      message: `Subpage title must be ${SUBPAGE_TITLE_MIN}-${SUBPAGE_TITLE_MAX} chars (got ${tLen})`,
      value: item.title,
    });
    subpageSummary[item.lang].errors++;
    summary[item.lang].errors++;
  }
  if (dLen < SUBPAGE_DESC_MIN || dLen > SUBPAGE_DESC_MAX) {
    violations.push({
      scope: "page",
      lang: item.lang,
      key: `subpages.${item.page}@L${item.descLine}`,
      field: "description",
      length: dLen,
      limit: dLen > SUBPAGE_DESC_MAX ? SUBPAGE_DESC_MAX : SUBPAGE_DESC_MIN,
      level: "error",
      message: `Subpage description must be ${SUBPAGE_DESC_MIN}-${SUBPAGE_DESC_MAX} chars (got ${dLen})`,
      value: item.description,
    });
    subpageSummary[item.lang].errors++;
    summary[item.lang].errors++;
  }
  if (!endsWithSoftCTA(item.lang, item.description)) {
    warnings.push({
      scope: "page",
      lang: item.lang,
      key: `subpages.${item.page}@L${item.descLine}`,
      field: "description",
      length: dLen,
      limit: 0,
      level: "warn",
      message: `Subpage description does not end with a soft CTA (allowed endings for ${item.lang}: ${SUBPAGE_CTA_ENDINGS[item.lang].join(" / ")})`,
      value: item.description,
    });
    summary[item.lang].warnings++;
  }
}
// Coverage check: each lang must declare all 5 service pages.
for (const lang of LANGS) {
  const declared = new Set(subpageItems.filter((s) => s.lang === lang).map((s) => s.page));
  for (const k of SUBPAGE_KEYS) {
    if (!declared.has(k)) {
      violations.push({
        scope: "page",
        lang,
        key: `subpages.${k}`,
        field: "title",
        length: 0,
        limit: 0,
        level: "error",
        message: `Missing SEO block for subpage ${k} in lang ${lang}`,
        value: "",
      });
      subpageSummary[lang].errors++;
      summary[lang].errors++;
    }
  }
}

type DuplicateGroup = { field: "title" | "description"; value: string; count: number; entries: { scope: string; lang: Lang; key: string }[] };

function findDuplicates(field: "title" | "description"): DuplicateGroup[] {
  const buckets = new Map<string, IndexedEntry[]>();
  for (const e of globalIndex) {
    const v = (field === "title" ? e.title : e.description).trim();
    if (!v) continue;
    const arr = buckets.get(v) || [];
    arr.push(e);
    buckets.set(v, arr);
  }
  const groups: DuplicateGroup[] = [];
  for (const [value, entries] of buckets) {
    if (entries.length > 1) {
      // Cross-language duplicates of the same logical page (same key prefix
      // before "@L") are expected — e.g. legal page titles that translate
      // identically across romance languages with hreflang protection.
      // Only flag duplicates that span DIFFERENT logical pages.
      const pageKeys = new Set(
        entries.map((e) => (e.scope === "page" ? e.key.split("@L")[0] : `${e.scope}:${e.key}`))
      );
      if (entries.every((e) => e.scope === "page") && pageKeys.size === 1) continue;
      groups.push({
        field,
        value,
        count: entries.length,
        entries: entries.map((e) => ({ scope: e.scope, lang: e.lang, key: e.key })),
      });
    }
  }
  return groups;
}

const duplicateTitles = findDuplicates("title");
const duplicateDescriptions = findDuplicates("description");

for (const g of [...duplicateTitles, ...duplicateDescriptions]) {
  const collisions = g.entries.map((e) => `${e.lang}:${e.scope}:${e.key}`).join(" | ");
  for (const e of g.entries) {
    violations.push({
      scope: e.scope as "page" | "blog",
      lang: e.lang,
      key: e.key,
      field: g.field,
      length: g.value.length,
      limit: 0,
      level: "error",
      message: `Duplicate ${g.field} (${g.count} occurrences): ${collisions}`,
      value: g.value,
    });
    summary[e.lang].errors++;
  }
}

const totals = {
  errors: violations.length,
  warnings: warnings.length,
  pages: Object.values(summary).reduce((a, s) => a + s.pages, 0),
  blog: Object.values(summary).reduce((a, s) => a + s.blog, 0),
  subpages: Object.values(subpageSummary).reduce((a, s) => a + s.count, 0),
  duplicateTitleGroups: duplicateTitles.length,
  duplicateDescriptionGroups: duplicateDescriptions.length,
};

const report = {
  generatedAt: new Date().toISOString(),
  limits: { TITLE_MAX, TITLE_WARN, DESC_MAX, DESC_WARN, DESC_MIN, SUBPAGE_TITLE_MIN, SUBPAGE_TITLE_MAX, SUBPAGE_DESC_MIN, SUBPAGE_DESC_MAX },
  totals,
  byLang: summary,
  duplicates: {
    titles: duplicateTitles,
    descriptions: duplicateDescriptions,
  },
  blogContent: blogContentByLang,
  violations,
  warnings,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(report, null, 2));

const prefix = totals.errors === 0 ? "PASS" : "FAIL";
console.log(`[verify-meta] ${prefix}: ${totals.errors} error(s), ${totals.warnings} warning(s) across ${LANGS.length} languages`);
for (const lang of LANGS) {
  const s = summary[lang];
  const sp = subpageSummary[lang];
  console.log(`  ${lang}: pages=${s.pages} subpages=${sp.count} blog=${s.blog} errors=${s.errors} warnings=${s.warnings} dupT=${s.duplicateTitles} dupD=${s.duplicateDescriptions}`);
}
console.log(`[verify-meta] Report written to ${OUT}`);

if (totals.errors > 0) {
  for (const v of violations) {
    console.error(`  ERROR ${v.lang} ${v.scope} ${v.key} ${v.field} len=${v.length} > ${v.limit}: ${v.message}`);
  }
  process.exit(1);
}
