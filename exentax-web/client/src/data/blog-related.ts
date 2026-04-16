import { BLOG_POSTS, type BlogPost } from "./blog-posts";
import { BLOG_I18N } from "./blog-posts-i18n";
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

function daysBetween(a: string, b: string): number {
  const ta = new Date(a).getTime();
  const tb = new Date(b).getTime();
  if (Number.isNaN(ta) || Number.isNaN(tb)) return Number.POSITIVE_INFINITY;
  return Math.abs(ta - tb) / 86_400_000;
}

/**
 * Return `limit` blog posts related to `slug`, localized for `lang`.
 *
 * Selection: same `category`, sorted by proximity of `publishedAt`,
 * falling back to cross-category recency if the category pool is too small.
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

  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === source.category,
  ).sort(
    (a, b) =>
      daysBetween(a.publishedAt, source.publishedAt) -
      daysBetween(b.publishedAt, source.publishedAt),
  );

  let pool: BlogPost[] = sameCategory.slice(0, limit);
  if (pool.length < limit) {
    const fallback = BLOG_POSTS.filter(
      (p) => p.slug !== slug && !pool.includes(p),
    )
      .sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, limit - pool.length);
    pool = [...pool, ...fallback];
  }

  return pool.map((p) => {
    const i18n = lang !== "es" ? BLOG_I18N[p.slug]?.[lang] : undefined;
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
