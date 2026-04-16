import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { BLOG_POSTS } from "../../client/src/data/blog-posts";
import { BLOG_I18N } from "../../client/src/data/blog-posts-i18n";
import { BLOG_SLUG_I18N } from "../../client/src/data/blog-posts-slugs";

export type SupportedLang = "es" | "en" | "fr" | "de" | "pt" | "ca";

export const SUPPORTED_LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];

export interface ArticleKeyword {
  slug: string;
  lang: SupportedLang;
  localizedSlug: string;
  keyword: string;
  pageUrl: string;
}

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const OVERRIDES_PATH = path.join(HERE, "keyword-overrides.json");

type KeywordOverrides = Record<string, Partial<Record<SupportedLang, string>>>;

const BLOG_PATH_PREFIX: Record<SupportedLang, string> = {
  es: "/es/blog",
  en: "/en/blog",
  fr: "/fr/blog",
  de: "/de/blog",
  pt: "/pt/blog",
  ca: "/ca/blog",
};

function loadOverrides(): KeywordOverrides {
  if (!fs.existsSync(OVERRIDES_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8")) as KeywordOverrides;
  } catch (err) {
    console.warn(`[seo] could not parse ${OVERRIDES_PATH}:`, (err as Error).message);
    return {};
  }
}

export function deriveKeywordFromTitle(metaTitle: string | undefined, fallbackSlug: string): string {
  if (!metaTitle) {
    return fallbackSlug.replace(/-/g, " ").replace(/\b\d{4}\b/g, "").trim().toLowerCase();
  }
  const withoutBrand = metaTitle
    .replace(/\s*\|\s*Exentax\s*$/i, "")
    .replace(/\s*[-–—]\s*Exentax\s*$/i, "")
    .trim();
  const beforeColon = withoutBrand.split(/[:\u2013\u2014]/)[0]?.trim() || withoutBrand;
  return beforeColon.toLowerCase();
}

export function getLocalizedSlug(spanishSlug: string, lang: SupportedLang): string {
  if (lang === "es") return spanishSlug;
  return BLOG_SLUG_I18N[spanishSlug]?.[lang] ?? spanishSlug;
}

export function getLocalizedUrl(spanishSlug: string, lang: SupportedLang): string {
  return `${BLOG_PATH_PREFIX[lang]}/${getLocalizedSlug(spanishSlug, lang)}`;
}

export function buildArticleKeywords(): ArticleKeyword[] {
  const overrides = loadOverrides();
  const rows: ArticleKeyword[] = [];

  for (const post of BLOG_POSTS) {
    for (const lang of SUPPORTED_LANGS) {
      const override = overrides[post.slug]?.[lang];
      let keyword: string | undefined;
      let metaTitle: string | undefined;

      if (lang === "es") {
        metaTitle = post.metaTitle;
      } else {
        metaTitle = BLOG_I18N[post.slug]?.[lang]?.metaTitle;
        if (!metaTitle) {
          // No translation for this language — skip silently.
          continue;
        }
      }

      keyword = override ?? deriveKeywordFromTitle(metaTitle, post.slug);

      rows.push({
        slug: post.slug,
        lang,
        localizedSlug: getLocalizedSlug(post.slug, lang),
        keyword,
        pageUrl: getLocalizedUrl(post.slug, lang),
      });
    }
  }

  return rows;
}

export function summarizeCoverage(rows: ArticleKeyword[]) {
  const byLang = new Map<SupportedLang, number>();
  const uniqueSlugs = new Set<string>();
  const uniqueKeywords = new Set<string>();
  for (const r of rows) {
    byLang.set(r.lang, (byLang.get(r.lang) ?? 0) + 1);
    uniqueSlugs.add(r.slug);
    uniqueKeywords.add(`${r.lang}::${r.keyword}`);
  }
  return {
    totalRows: rows.length,
    uniqueArticles: uniqueSlugs.size,
    uniqueKeywords: uniqueKeywords.size,
    byLang: Object.fromEntries(byLang.entries()),
  };
}
