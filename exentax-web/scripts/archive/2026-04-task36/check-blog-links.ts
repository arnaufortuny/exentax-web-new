#!/usr/bin/env -S npx tsx
/*
 * scripts/check-blog-links.ts
 * ---------------------------------------------------------------------------
 * Hard guard for blog editorial integrity (Task #7). Walks every Markdown
 * source file under client/src/data/blog-content/{lang}/*.ts and fails when
 * it finds any of:
 *
 *   1. Internal links to a blog slug that does not exist in
 *      BLOG_SLUG_I18N (broken intra-blog links).
 *   2. Internal links to a non-blog route that is not registered in
 *      shared/routes.ts (e.g. /en/contact, which never existed).
 *   3. Cross-language blog links (e.g. /en/blog/... inside an /es/ file).
 *   4. Hardcoded CTA links (booking/WhatsApp) outside the two sanctioned
 *      marker blocks (`exentax:cta-v1`, `exentax:calc-cta-v1`).
 *   5. Literal renderable "undefined" tokens leaking into prose.
 *   6. Missing required mid-article calculator CTA: every article must
 *      contain either the canonical Spanish blockquote that links to
 *      `/es#calculadora` (Spanish files) or the
 *      `<!-- exentax:calc-cta-v1 -->` marker pair (all other languages).
 *
 * Run:
 *   npx tsx scripts/check-blog-links.ts
 *
 * Exit code 0 = clean, 1 = findings reported.
 * ---------------------------------------------------------------------------
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { BLOG_SLUG_I18N } from "../client/src/data/blog-posts-slugs.ts";
import { ROUTE_SLUGS, SUPPORTED_LANGS, type SupportedLang } from "../shared/routes.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");
const CONTENT_DIR = join(REPO_DIR, "client", "src", "data", "blog-content");

type Finding = {
  file: string;
  line: number;
  rule: string;
  message: string;
};

// ---------------------------------------------------------------------------
// Build slug + route lookup tables.
// ---------------------------------------------------------------------------
const SPANISH_SLUGS = new Set<string>(Object.keys(BLOG_SLUG_I18N));
const SLUG_BY_LANG: Record<SupportedLang, Set<string>> = {
  es: new Set(SPANISH_SLUGS),
  en: new Set(),
  fr: new Set(),
  de: new Set(),
  pt: new Set(),
  ca: new Set(),
};
for (const [es, map] of Object.entries(BLOG_SLUG_I18N)) {
  for (const lang of SUPPORTED_LANGS) {
    if (lang === "es") continue;
    const translated = (map as Partial<Record<SupportedLang, string>>)[lang];
    if (translated) SLUG_BY_LANG[lang].add(translated);
    else SLUG_BY_LANG[lang].add(es); // fallback used by getTranslatedSlug
  }
}

const ROUTES_BY_LANG: Record<SupportedLang, Set<string>> = {
  es: new Set(),
  en: new Set(),
  fr: new Set(),
  de: new Set(),
  pt: new Set(),
  ca: new Set(),
};
for (const key of Object.keys(ROUTE_SLUGS)) {
  for (const lang of SUPPORTED_LANGS) {
    const slug = ROUTE_SLUGS[key as keyof typeof ROUTE_SLUGS][lang];
    const path = slug ? `/${lang}/${slug}` : `/${lang}`;
    ROUTES_BY_LANG[lang].add(path);
  }
  // also accept the bare /{lang}/blog and /{lang}/blog/{slug} which the
  // SPA handles directly outside of ROUTE_SLUGS.
}
for (const lang of SUPPORTED_LANGS) {
  ROUTES_BY_LANG[lang].add(`/${lang}/blog`);
}

// ---------------------------------------------------------------------------
// Marker blocks where CTA links are allowed.
// ---------------------------------------------------------------------------
const ALLOWED_CTA_MARKERS: Array<[string, string]> = [
  ["<!-- exentax:cta-v1 -->", "<!-- /exentax:cta-v1 -->"],
  ["<!-- exentax:calc-cta-v1 -->", "<!-- /exentax:calc-cta-v1 -->"],
];

function buildAllowedRanges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  for (const [open, close] of ALLOWED_CTA_MARKERS) {
    let from = 0;
    while (true) {
      const o = text.indexOf(open, from);
      if (o === -1) break;
      const c = text.indexOf(close, o);
      if (c === -1) break;
      ranges.push([o, c + close.length]);
      from = c + close.length;
    }
  }
  return ranges;
}

function inRange(idx: number, ranges: Array<[number, number]>): boolean {
  for (const [a, b] of ranges) if (idx >= a && idx < b) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------
// Markdown link [text](path) and HTML href="path"
const LINK_RE = /(?:\]\(|href\s*=\s*["'])(\/[^)"'\s]+)/g;
const CTA_PATH_RE = /^\/(es|en|fr|de|pt|ca)\/(agendar|book|reserver|reservar|buchen)(?:[/?#]|$)/i;
const WHATSAPP_RE = /https?:\/\/(?:wa\.me|api\.whatsapp\.com)/gi;
// We deliberately do NOT flag literal `null` or `NaN` here: `null` collides
// with legitimate German ("Null-Steuer"), French and Catalan prose. The only
// reliable rendering-bug token is the literal English word `undefined`, which
// has no editorial use in any of the six supported languages.
const UNDEFINED_RE = /\bundefined\b/g;

// ---------------------------------------------------------------------------
// File walking
// ---------------------------------------------------------------------------
function listLangFiles(lang: SupportedLang): string[] {
  const dir = join(CONTENT_DIR, lang);
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  return readdirSync(dir)
    .filter((n) => n.endsWith(".ts"))
    .map((n) => join(dir, n));
}

function lineOfIndex(text: string, idx: number): number {
  let line = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function checkFile(path: string, lang: SupportedLang): Finding[] {
  const findings: Finding[] = [];
  const text = readFileSync(path, "utf8");
  const rel = relative(REPO_DIR, path);
  const ctaRanges = buildAllowedRanges(text);

  // 1-3: link analysis
  LINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = LINK_RE.exec(text)) !== null) {
    const fullPath = m[1].split("#")[0].split("?")[0].replace(/\/$/, "");
    const linkIdx = m.index + m[0].length - m[1].length;
    const lineNo = lineOfIndex(text, linkIdx);

    // /xx/blog/... links
    const blog = fullPath.match(/^\/([a-z]{2})\/blog\/([^/]+)$/);
    if (blog) {
      const linkLang = blog[1] as SupportedLang;
      const slug = blog[2];
      if (!SUPPORTED_LANGS.includes(linkLang)) {
        findings.push({ file: rel, line: lineNo, rule: "unknown-lang",
          message: `Unknown language prefix in ${fullPath}` });
        continue;
      }
      if (linkLang !== lang) {
        findings.push({ file: rel, line: lineNo, rule: "cross-lang-link",
          message: `Cross-language blog link ${fullPath} inside ${lang} article` });
      }
      if (!SLUG_BY_LANG[linkLang].has(slug)) {
        findings.push({ file: rel, line: lineNo, rule: "broken-blog-slug",
          message: `Broken blog slug ${fullPath} (no entry in BLOG_SLUG_I18N for ${linkLang})` });
      }
      continue;
    }

    // /{lang}/blog index — accepted
    if (/^\/[a-z]{2}\/blog$/.test(fullPath)) continue;
    // /xx/... non-blog routes
    const langed = fullPath.match(/^\/([a-z]{2})(\/[^/].*)?$/);
    if (langed) {
      const linkLang = langed[1] as SupportedLang;
      if (!SUPPORTED_LANGS.includes(linkLang)) continue;
      if (!ROUTES_BY_LANG[linkLang].has(fullPath)) {
        findings.push({ file: rel, line: lineNo, rule: "broken-route",
          message: `Internal link to unregistered route ${fullPath}` });
      }
      // CTA detection: link to booking page outside marker block
      if (CTA_PATH_RE.test(fullPath) && !inRange(m.index, ctaRanges)) {
        findings.push({ file: rel, line: lineNo, rule: "hardcoded-cta",
          message: `Booking CTA link ${fullPath} outside of sanctioned CTA marker block` });
      }
    }
  }

  // 4b: WhatsApp links outside markers
  WHATSAPP_RE.lastIndex = 0;
  while ((m = WHATSAPP_RE.exec(text)) !== null) {
    if (!inRange(m.index, ctaRanges)) {
      findings.push({ file: rel, line: lineOfIndex(text, m.index),
        rule: "hardcoded-cta",
        message: `WhatsApp CTA link outside of sanctioned CTA marker block` });
    }
  }

  // 5: literal undefined / null / NaN inside prose (skip TS keywords on
  // export lines or template tail/head). We only inspect the body inside the
  // backticks of the template literal.
  const bodyStart = text.indexOf("`");
  const bodyEnd = text.lastIndexOf("`");
  if (bodyStart !== -1 && bodyEnd > bodyStart) {
    const body = text.slice(bodyStart + 1, bodyEnd);
    UNDEFINED_RE.lastIndex = 0;
    while ((m = UNDEFINED_RE.exec(body)) !== null) {
      const absIdx = bodyStart + 1 + m.index;
      findings.push({ file: rel, line: lineOfIndex(text, absIdx),
        rule: "undefined-token",
        message: `Renderable literal '${m[0]}' inside article body` });
    }
  }

  // 6: required mid-article calculator CTA
  const REQUIRED_MARKER = "<!-- exentax:calc-cta-v1 -->";
  const ES_INLINE = "/es#calculadora";
  const hasCta = lang === "es" ? text.includes(ES_INLINE) : text.includes(REQUIRED_MARKER);
  if (!hasCta) {
    findings.push({ file: rel, line: 1, rule: "missing-calc-cta",
      message: lang === "es"
        ? `Spanish article is missing the canonical inline calculator CTA linking to ${ES_INLINE}`
        : `Article is missing the required '${REQUIRED_MARKER}' marker block` });
  }

  return findings;
}

function main(): void {
  const all: Finding[] = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const file of listLangFiles(lang)) {
      all.push(...checkFile(file, lang));
    }
  }

  if (all.length === 0) {
    console.log("check-blog-links: clean ✓");
    return;
  }

  // Group by rule for readable output
  const byRule = new Map<string, Finding[]>();
  for (const f of all) {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule)!.push(f);
  }
  for (const [rule, list] of byRule) {
    console.log(`\n[${rule}] ${list.length} finding(s):`);
    for (const f of list) {
      console.log(`  ${f.file}:${f.line}  ${f.message}`);
    }
  }
  console.log(`\nTotal findings: ${all.length}`);
  process.exit(1);
}

main();
