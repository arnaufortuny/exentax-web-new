import type { SupportedLang } from "@/i18n";
import { hasBlogMetaTranslation } from "./blog-posts-i18n";

const CONTENT_MODULES = import.meta.glob<{ default: string }>(
  "./blog-content/*/*.ts"
);

function buildKey(lang: SupportedLang, slug: string): string {
  return `./blog-content/${lang}/${slug}.ts`;
}

const AVAILABILITY: Record<string, Set<string>> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const key of Object.keys(CONTENT_MODULES)) {
    const m = key.match(/^\.\/blog-content\/([^/]+)\/([^/]+)\.ts$/);
    if (!m) continue;
    const [, lang, slug] = m;
    (map[lang] ||= new Set()).add(slug);
  }
  return map;
})();

export function hasBlogContent(slug: string, lang: SupportedLang): boolean {
  return AVAILABILITY[lang]?.has(slug) ?? false;
}

export function hasBlogTranslation(slug: string, lang: SupportedLang): boolean {
  return hasBlogContent(slug, lang) && hasBlogMetaTranslation(slug, lang);
}

export function getAvailableLangsForSlug(slug: string): SupportedLang[] {
  const result: SupportedLang[] = [];
  for (const lang of Object.keys(AVAILABILITY) as SupportedLang[]) {
    if (hasBlogTranslation(slug, lang as SupportedLang)) result.push(lang as SupportedLang);
  }
  return result;
}

export async function loadBlogContent(
  slug: string,
  lang: SupportedLang
): Promise<string | undefined> {
  const key = buildKey(lang, slug);
  const loader = CONTENT_MODULES[key];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.default;
}

export function prefetchBlogContent(slug: string, lang: SupportedLang): void {
  const key = buildKey(lang, slug);
  const loader = CONTENT_MODULES[key];
  if (loader) void loader();
}
