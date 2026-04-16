import type { SupportedLang } from "@/i18n";

const CONTENT_MODULES = import.meta.glob<{ default: string }>(
  "./blog-content/*/*.ts"
);

function buildKey(lang: SupportedLang, slug: string): string {
  return `./blog-content/${lang}/${slug}.ts`;
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
