import type { SupportedLang } from "@/i18n";
import { BLOG_CONTENT_EN } from "./blog-posts-content-en";
import { BLOG_CONTENT_FR } from "./blog-posts-content-fr";
import { BLOG_CONTENT_DE } from "./blog-posts-content-de";

import { BLOG_CONTENT_PT } from "./blog-posts-content-pt";
import { BLOG_CONTENT_CA } from "./blog-posts-content-ca";

const CONTENT_MAP: Partial<Record<SupportedLang, Record<string, string>>> = {
  en: BLOG_CONTENT_EN,
  fr: BLOG_CONTENT_FR,
  de: BLOG_CONTENT_DE,

  pt: BLOG_CONTENT_PT,
  ca: BLOG_CONTENT_CA,
};

export function getLocalizedBlogContent(slug: string, lang: SupportedLang): string | undefined {
  if (lang === "es") return undefined;
  return CONTENT_MAP[lang]?.[slug];
}
