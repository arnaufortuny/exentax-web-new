/**
 * Closed taxonomy of blog categories used by `BLOG_POSTS`.
 *
 * The list is intentionally short (≤ 8 items): we want every article to
 * land in a clear bucket and the breadcrumb level to mean something for
 * SEO. Adding a new category requires:
 *
 *  1. Append the Spanish label to `BLOG_CATEGORIES`.
 *  2. Add the i18n translations under `blogPost.categories.<key>` in
 *     every locale bundle.
 *  3. Run `node scripts/blog-consistency-check.mjs` — the gate enforces
 *     that every `BLOG_POSTS[i].category` is in this list.
 *
 * The URL slug is the lowercased, ASCII-safe version of the Spanish
 * label (no diacritics, no spaces). It powers the category breadcrumb
 * link and the `?category=` filter on `/<lang>/blog`.
 */

export const BLOG_CATEGORIES = [
  "Fiscalidad",
  "Compliance",
  "Guías",
  "Operativa",
  "Comparativas",
  "Herramientas",
  "Legal",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

const SLUG_OVERRIDES: Record<string, string> = {
  Fiscalidad: "fiscalidad",
  Compliance: "compliance",
  "Guías": "guias",
  Operativa: "operativa",
  Comparativas: "comparativas",
  Herramientas: "herramientas",
  Legal: "legal",
};

export function categoryToSlug(category: string): string {
  if (SLUG_OVERRIDES[category]) return SLUG_OVERRIDES[category];
  return category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isValidCategory(category: string): boolean {
  return (BLOG_CATEGORIES as readonly string[]).includes(category);
}
