# Internal linking policy — Exentax

Internal links are the single biggest lever we have over Google's understanding of site architecture. This document defines deterministic rules and the implementation plan.

## 1. Rules

### 1.1 Rule of 3 for blog posts

Every blog post MUST contain, as a minimum, three internal links:

1. **One "up" link** to the thematic hub (`sobre-las-llc`, `como-trabajamos`, `nuestros-servicios`, `preguntas-frecuentes`, `agendar`). The thematic hub is chosen by the post's `category`:
   - "Estructuración fiscal" → `sobre-las-llc`
   - "Cómo abrir una LLC" → `como-trabajamos`
   - "Gestión de la LLC" → `nuestros-servicios`
   - "Banca y pagos" → `sobre-las-llc`
   - "Impuestos y compliance" → `sobre-las-llc`
   - default → `sobre-las-llc`
2. **Two "lateral" links** to the two most topically related posts (same `category`, nearest `publishedAt`, and excluding self).
3. **One "CTA" link** (T-intent) to `/agendar` at the end of the post. This doesn't count toward the 3, it's additional.

### 1.2 Rule of 4 for hub pages

Every cornerstone / hub page (`sobre-las-llc`, `como-trabajamos`, `nuestros-servicios`) MUST link to **at least four** blog posts in a "related reading" section. These are picked manually and refreshed quarterly.

### 1.3 Anchor text policy

- **Do NOT** use generic anchors like "click here", "read more", "learn more".
- **Use** descriptive anchors that include a keyword variant, e.g. `<a href="/es/blog/form-5472-que-es-como-presentarlo">Cómo se presenta el Form 5472</a>`.
- Natural phrasing > exact match stuffing. Rotate synonyms across posts.
- Localize the anchor: the Spanish version links to `/es/...`, the English to `/en/...`, etc.

### 1.4 No orphan pages

Every indexable URL must receive at least one internal link from another indexable page. Enforce in CI (see 3.3).

## 2. Implementation plan

### 2.1 Short term (manual)

- When writing or editing a blog post (in `client/src/data/blog-posts.ts` + `blog-posts-i18n.ts`), add internal links as markdown inside the `content` field: `[anchor](/es/blog/target-slug)`.
- The markdown-to-HTML converter in `server/static.ts` (`markdownToHtml`) already renders `<a>` tags via the Vite Markdown in the frontend; the prerendered SEO content inherits these links. Verify that the converter handles `[...](...)` — **today it does not**. See the action below.

### 2.2 Medium term — extend the markdown converter

The current `markdownToHtml` in `server/static.ts` (lines 16–58) only recognizes headings, lists, bold and italic. Add link support:

```ts
function fmtInline(t: string): string {
  return t
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
```

This lets us write `[Form 5472](/es/blog/form-5472-que-es-como-presentarlo)` inside the Spanish content and have it rendered in the SEO prerender and in the client-side markdown component (already supported via `react-markdown`).

### 2.3 Long term — deterministic related-posts component

Create a pure function `getRelatedPosts(currentSlug: string, lang: SupportedLang): BlogPostRef[]` in `client/src/data/blog-related.ts`:

```ts
export function getRelatedPosts(slug: string, lang: SupportedLang, limit = 3) {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return [];
  return BLOG_POSTS
    .filter(p => p.slug !== slug && p.category === post.category)
    .sort((a, b) => Math.abs(daysBetween(a.publishedAt, post.publishedAt))
                  - Math.abs(daysBetween(b.publishedAt, post.publishedAt)))
    .slice(0, limit)
    .map(p => ({
      slug: getTranslatedSlug(p.slug, lang),
      title: BLOG_I18N[p.slug]?.[lang]?.title ?? p.title,
      excerpt: BLOG_I18N[p.slug]?.[lang]?.excerpt ?? p.excerpt,
      href: `/${lang}/blog/${getTranslatedSlug(p.slug, lang)}`,
    }));
}
```

Use this in the `BlogPost` page and in the SEO prerender (inside `server/static.ts`, append a `<nav>` with the 3 related-post links to the prerender string).

## 3. Validation

### 3.1 Manual check

For any post you write, run:

```bash
grep -c ']\(/es/' client/src/data/blog-posts.ts # should be ≥ 3 × post count
```

### 3.2 Link checker

`scripts/seo-check-links.mjs` (run via `npm run seo:check`) reuses the graph
from `scripts/link-graph.mjs` to enforce two invariants:

1. **No broken links** — every `/<lang>/blog/<slug>` href found in any per-
   article content file under `client/src/data/blog-content/<lang>/` must
   resolve to a known slug for that language (per `BLOG_SLUG_I18N` in
   `client/src/data/blog-posts-slugs.ts`). Broken hrefs are reported with
   their file, line number, and source article.
2. **No under-linked articles** — every Spanish article must receive at least
   three incoming contextual links from other Spanish articles (rule §1.4).

The script exits non-zero if either check fails, with a human-readable list
of every offender. Unit tests live in `scripts/seo-check-links.test.mjs`
(`npm run test:seo-check`).

### 3.3 CI enforcement

`npm run seo:check` is chained into `npm run check` (after `tsc`), so any push
or PR pipeline that runs `npm run check` will fail when a link breaks or an
article drops below the 3-incoming-links floor.

## 4. Internal-link audit — current state

Spot checks (April 2026) on representative Spanish posts:

| Post | Internal links | Rule status |
|------|---------------:|-------------|
| llc-estados-unidos-guia-completa-2026 | 6 | ✓ |
| form-5472-que-es-como-presentarlo | 4 | ✓ |
| cuenta-bancaria-mercury-llc-extranjero | 3 | ✓ |
| ein-numero-fiscal-llc-como-obtenerlo | 2 | ✗ add 1 |
| autonomo-espana-vs-llc-estados-unidos | 5 | ✓ |

Other languages have the **same number** of links because they inherit from the Spanish content structure — good.

Action: audit the remaining 53 posts (batched) and bring every underperformer to ≥ 3.

---

*End of policy.*
