import type { SupportedLang } from "@/i18n";

export interface BlogPostMeta {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  /**
   * Short social-card variant (≤110 chars) used by the blog post page as
   * ogDescription so LinkedIn / X / WhatsApp link previews don't truncate.
   * Falls back to metaDescription when omitted.
   */
  socialDescription?: string;
  /** Persuasive Open Graph title (≤60). Falls back to metaTitle. */
  ogTitle?: string;
  /** Persuasive Open Graph description (120–160). Falls back to socialDescription/metaDescription. */
  ogDescription?: string;
  /**
   * Optional per-article social card image (1200x630) for this language.
   * When omitted, the SEO component falls back to the post's default
   * `ogImage` and finally to the brand card at `/og-image.png`.
   */
  ogImage?: string;
  keywords?: string[];
}

type MetaMap = Record<string, BlogPostMeta>;

const META_LOADERS: Partial<Record<SupportedLang, () => Promise<MetaMap>>> = {
  en: () => import("./blog-i18n/en").then(m => m.default),
  fr: () => import("./blog-i18n/fr").then(m => m.default),
  de: () => import("./blog-i18n/de").then(m => m.default),
  pt: () => import("./blog-i18n/pt").then(m => m.default),
  ca: () => import("./blog-i18n/ca").then(m => m.default),
};

const CACHE: Partial<Record<SupportedLang, MetaMap>> = {};
const PENDING: Partial<Record<SupportedLang, Promise<void>>> = {};
const FAILED: Partial<Record<SupportedLang, true>> = {};
const LISTENERS = new Set<() => void>();

function notify() {
  LISTENERS.forEach(fn => {
    try { fn(); } catch { /* swallow */ }
  });
}

export function seedBlogI18nCache(lang: SupportedLang, data: MetaMap): void {
  CACHE[lang] = data;
  notify();
}

export function subscribeBlogI18n(fn: () => void): () => void {
  LISTENERS.add(fn);
  return () => { LISTENERS.delete(fn); };
}

export function isBlogI18nReady(lang: SupportedLang): boolean {
  if (lang === "es") return true;
  return CACHE[lang] !== undefined || FAILED[lang] === true;
}

export function loadBlogI18nForLang(lang: SupportedLang): Promise<void> {
  if (lang === "es") return Promise.resolve();
  if (CACHE[lang]) return Promise.resolve();
  const existing = PENDING[lang];
  if (existing) return existing;
  const loader = META_LOADERS[lang];
  if (!loader) return Promise.resolve();
  // If a previous attempt failed, allow this call to retry from scratch.
  FAILED[lang] = undefined;
  const promise = loader()
    .then((data) => {
      CACHE[lang] = data;
    })
    .catch((err) => {
      // Mark as failed so isBlogI18nReady returns true and consumers can
      // fall through (e.g. show NotFound) instead of staying blank forever.
      FAILED[lang] = true;
      if (typeof console !== "undefined") {
        console.warn("[blog-i18n] failed to load meta for", lang, err);
      }
    })
    .finally(() => {
      PENDING[lang] = undefined;
      notify();
    });
  PENDING[lang] = promise;
  return promise;
}

export function prefetchBlogI18nForLang(lang: SupportedLang): void {
  void loadBlogI18nForLang(lang);
}

export function getLocalizedBlogMeta(
  slug: string,
  lang: SupportedLang
): BlogPostMeta | undefined {
  if (lang === "es") return undefined;
  return CACHE[lang]?.[slug];
}

export function hasBlogMetaTranslation(slug: string, lang: SupportedLang): boolean {
  if (lang === "es") return true;
  const entry = CACHE[lang]?.[slug];
  if (!entry) return false;
  return Boolean(
    entry.title?.trim() &&
    entry.excerpt?.trim() &&
    entry.metaTitle?.trim() &&
    entry.metaDescription?.trim()
  );
}

export function getMetaAvailableLangs(slug: string): SupportedLang[] {
  const result: SupportedLang[] = ["es"];
  for (const lang of ["en", "fr", "de", "pt", "ca"] as const) {
    if (hasBlogMetaTranslation(slug, lang)) result.push(lang);
  }
  return result;
}
