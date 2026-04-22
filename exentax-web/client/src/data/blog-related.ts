import { BLOG_POSTS, getRelatedPosts as getRelatedBlogPosts } from "./blog-posts";
import { getLocalizedBlogMeta } from "./blog-posts-i18n";
import { getTranslatedSlug } from "./blog-posts-slugs";
type SupportedLang = "es" | "en" | "fr" | "de" | "pt" | "ca";

export interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  category: string;
  publishedAt: string;
}

/**
 * Return `limit` blog posts related to `slug`, localized for `lang`.
 *
 * Selection delegates to `getRelatedPosts` in `blog-posts.ts` so the SSR
 * prerender matches what the client renders. Algorithm: per-post overrides
 * via `relatedSlugs`, then a score combining shared category, keyword
 * overlap, country overlap and recency proximity.
 *
 * See docs/seo/internal-linking.md §2.3.
 */
export function getRelatedPosts(
  slug: string,
  lang: SupportedLang,
  limit = 3,
): RelatedPost[] {
  const source = BLOG_POSTS.find((p) => p.slug === slug);
  if (!source) return [];

  const pool = getRelatedBlogPosts(source, () => true, limit);

  return pool.map((p) => {
    const i18n = lang !== "es" ? getLocalizedBlogMeta(p.slug, lang) : undefined;
    const translatedSlug = getTranslatedSlug(p.slug, lang);
    return {
      slug: translatedSlug,
      title: i18n?.title ?? p.title,
      excerpt: i18n?.excerpt ?? p.excerpt,
      href: `/${lang}/blog/${translatedSlug}`,
      category: p.category,
      publishedAt: p.publishedAt,
    };
  });
}
