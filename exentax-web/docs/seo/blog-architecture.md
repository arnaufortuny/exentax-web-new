# Blog architecture (Exentax)

End-to-end diagram of how a base slug becomes 6 indexed URLs, validated by 8
gates and surfaced through the public site, the sitemap and the
`?category=` filter.

## Source-of-truth registries (5)

Single ground truth: the **Spanish base slug** (kebab-case ASCII, ≤ 80
chars). Every registry below must agree on the exact same set of base slugs
(101 today). Parity is enforced by `scripts/blog/blog-consistency-check.mjs`.

| Registry                                              | Role                                                   | Edited by                                |
|-------------------------------------------------------|--------------------------------------------------------|------------------------------------------|
| `client/src/data/blog-posts.ts` → `BLOG_POSTS[]`      | Editorial metadata (ES baseline): title, excerpt, dates, category, keywords, related slugs. | Hand + `scripts/blog/blog-new-article.mjs`. |
| `client/src/data/blog-content/es/<slug>.ts`           | Long-form Spanish body (Markdown-with-HTML).           | Hand.                                    |
| `client/src/data/blog-content/<lang>/<slug>.ts`       | Per-locale long-form body (en, fr, de, pt, ca).        | Hand + translation pipeline.             |
| `client/src/data/blog-posts-slugs.ts` → `BLOG_SLUG_I18N` | Per-locale URL slug for each base slug (allows non-ES URL hygiene). | Hand + `blog-new-article.mjs`. |
| `client/src/data/blog-sources.ts` → `SOURCES_BY_SLUG` | Citations bundle (≥ 3 refs per article from `DOC_REGISTRY`). | Hand. |

**Plus** the per-locale meta map (`client/src/data/blog-i18n/<lang>.ts`) for
non-ES `title / metaTitle / metaDescription / keywords`. Loaded lazily by
`blog-posts-i18n.ts`.

## Closed taxonomy

`client/src/lib/blog-categories.ts` declares the closed list of categories
(currently 7). Every `BLOG_POSTS[i].category` MUST be in the list. The
category powers the breadcrumb 4th level (`Home → Blog → <Category> →
Article`) and the `?category=<slug>` filter on `/<lang>/blog`.

## Render pipeline

```
                ┌──────────────────┐
                │ BLOG_POSTS (es)  │── meta ──┐
                └──────────────────┘          │
                ┌──────────────────┐          ▼
   /<lang>/blog │ blog-i18n/<l>.ts │── meta ──► <head> + JSON-LD
                └──────────────────┘
                ┌──────────────────┐          ▼
   /<lang>/blog │ blog-content/<l> │── body ──► <article>  + faq-extract → FAQPage JSON-LD
   /<slug>      └──────────────────┘             + breadcrumb (Home/Blog/Category/Article)
                ┌──────────────────┐
                │ SOURCES_BY_SLUG  │──────────► <aside>Sources block
                └──────────────────┘
```

- `client/src/pages/blog/post.tsx` emits, for every article and locale:
  - `<meta>` title/description/canonical/hreflang.
  - `BlogPosting` JSON-LD with author (Exentax), datePublished, dateModified.
  - `FAQPage` JSON-LD derived from the body via `lib/blog-faq-extract.ts`.
  - 4-level `BreadcrumbList` JSON-LD (matches the visible breadcrumb).
- `client/src/pages/blog/index.tsx` surfaces 101 cards per locale, filterable
  by `?category=<slug>`, with state synced to URL via `useSearchParams`.

## Sitemap & news

`server/routes/public.ts` builds `sitemap.xml` (sitemap-index + per-locale
children). The `news:news` block is gated to ≤ 48 h (Google News spec): only
articles whose `publishedAt` is within the last 48 h emit a news entry.

`scripts/seo/seo-sitemap-check.mjs` HEAD-pings every URL.

## Validation gates

Eight orchestrated steps (see `docs/seo/blog-validation.md`). `pre-push`
runs the full `npm run check` pipeline plus `node scripts/blog/blog-validate-all.mjs`.

## Authoring flow

1. `node scripts/blog/blog-new-article.mjs --slug=<kebab> --category=<closed>`
   - Validates slug shape (≤ 80, kebab-case ASCII).
   - Cross-checks BLOG_SLUG_I18N for collisions across all 6 langs.
   - Scaffolds 6 content files (es, en, fr, de, pt, ca) + meta entries.
   - Runs `blog-consistency-check.mjs` post-scaffold; aborts if it fails.
2. Author the ES body, fill out citations in `SOURCES_BY_SLUG`.
3. Translate via the i18n pipeline (each locale gets its own meta + body).
4. `node scripts/blog/blog-validate-all.mjs` (or `git push` to trigger the hook).

## Files referenced

- `exentax-web/client/src/data/blog-posts.ts`
- `exentax-web/client/src/data/blog-posts-slugs.ts`
- `exentax-web/client/src/data/blog-posts-i18n.ts`
- `exentax-web/client/src/data/blog-i18n/{en,fr,de,pt,ca}.ts`
- `exentax-web/client/src/data/blog-content/{es,en,fr,de,pt,ca}/*.ts`
- `exentax-web/client/src/data/blog-sources.ts`
- `exentax-web/client/src/lib/blog-categories.ts`
- `exentax-web/client/src/lib/blog-faq-extract.ts`
- `exentax-web/client/src/pages/blog/{index,post}.tsx`
- `exentax-web/server/routes/public.ts` (sitemap, hreflang, news gate)
