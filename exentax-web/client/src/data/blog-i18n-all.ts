import { type BlogPostMeta, seedBlogI18nCache } from "./blog-posts-i18n";
import EN from "./blog-i18n/en";
import FR from "./blog-i18n/fr";
import DE from "./blog-i18n/de";
import PT from "./blog-i18n/pt";
import CA from "./blog-i18n/ca";

seedBlogI18nCache("en", EN);
seedBlogI18nCache("fr", FR);
seedBlogI18nCache("de", DE);
seedBlogI18nCache("pt", PT);
seedBlogI18nCache("ca", CA);

type SupportedLang = "es" | "en" | "fr" | "de" | "pt" | "ca";

type BlogI18nMap = Record<string, Partial<Record<SupportedLang, BlogPostMeta>>>;

const ALL_BY_LANG: Record<Exclude<SupportedLang, "es">, Record<string, BlogPostMeta>> = {
  en: EN,
  fr: FR,
  de: DE,
  pt: PT,
  ca: CA,
};

function buildBlogI18n(): BlogI18nMap {
  const out: BlogI18nMap = {};
  for (const lang of Object.keys(ALL_BY_LANG) as Array<Exclude<SupportedLang, "es">>) {
    const map = ALL_BY_LANG[lang];
    for (const slug of Object.keys(map)) {
      if (!out[slug]) out[slug] = {};
      out[slug][lang] = map[slug];
    }
  }
  return out;
}

export const BLOG_I18N: BlogI18nMap = buildBlogI18n();
