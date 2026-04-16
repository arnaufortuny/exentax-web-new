import type { SupportedLang } from "@/i18n";

type ContentMap = Record<string, string>;

const LOADERS: Record<SupportedLang, () => Promise<ContentMap>> = {
  es: () => import("./blog-posts-content-es").then(m => m.BLOG_CONTENT_ES),
  en: () => import("./blog-posts-content-en").then(m => m.BLOG_CONTENT_EN),
  fr: () => import("./blog-posts-content-fr").then(m => m.BLOG_CONTENT_FR),
  de: () => import("./blog-posts-content-de").then(m => m.BLOG_CONTENT_DE),
  pt: () => import("./blog-posts-content-pt").then(m => m.BLOG_CONTENT_PT),
  ca: () => import("./blog-posts-content-ca").then(m => m.BLOG_CONTENT_CA),
};

const cache: Partial<Record<SupportedLang, Promise<ContentMap>>> = {};

function load(lang: SupportedLang): Promise<ContentMap> {
  if (!cache[lang]) cache[lang] = LOADERS[lang]();
  return cache[lang]!;
}

export async function loadBlogContent(slug: string, lang: SupportedLang): Promise<string | undefined> {
  const map = await load(lang);
  return map[slug];
}

export function prefetchBlogContent(lang: SupportedLang): void {
  void load(lang);
}
