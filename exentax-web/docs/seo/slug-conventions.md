# Slug conventions — Exentax

URL slugs are a permanent commitment. Changing them breaks backlinks. Follow these rules for every new slug.

## 1. General rules

- **Lower-case** ASCII only. No accents, no ñ, no ç.
- **Kebab-case** — words separated by `-`.
- **Length**: 3–60 chars total, 2–8 words.
- **No stopwords** unless they change meaning (keep "con", "para" when dropping them creates ambiguity).
- **No dates or versions** in the slug (keep those in the content). Exception: explicit year-in-title posts that are designed to be re-dated yearly (e.g. `guia-completa-2026` → `guia-completa-2027`). Prefer rewriting content year-to-year over changing the slug.
- **No trailing slash** (server drops it).
- **Unique across the site** — two posts cannot share the same slug, even in different languages. The i18n system uses a Spanish slug as the canonical key.

## 2. Language rules

- Every post has a **Spanish slug** (the canonical key in `client/src/data/blog-posts.ts`).
- Each language's slug lives in `client/src/data/blog-posts-slugs.ts` under `SLUG_TRANSLATIONS[spanishSlug]`.
- When no explicit translation exists, the Spanish slug is reused (acceptable for `ca`).
- Localize the slug whenever the primary keyword has a natural translation. Example:
  - es: `cuenta-bancaria-mercury-llc-extranjero`
  - en: `mercury-bank-account-llc-foreigner`
  - fr: `compte-bancaire-mercury-llc-etranger`
  - de: `mercury-bankkonto-llc-auslaender`
  - pt: `conta-bancaria-mercury-llc-estrangeiro`
  - ca: `compte-bancari-mercury-llc-estranger`

## 3. Route slugs (main pages)

Main pages are managed in **two files that MUST stay in sync**:

- `server/route-slugs.ts` (server)
- `client/src/lib/routes.ts` (client)

To add or rename a main-page slug:

1. Add the `RouteKey` to both unions.
2. Add the `ROUTE_SLUGS[key]` entry with all 6 languages.
3. Add the page component to `client/src/pages/` and register it in `client/src/App.tsx`.
4. Add the meta + schema in `server/seo-content.ts` (PAGE_META_I18N via `buildI18nMeta`, and optionally `PAGE_SEO_CONTENT` / `PAGE_SCHEMAS`).
5. Add the route to the sitemap priority table in `server/routes/public.ts` (sitemap handler).
6. Run `npm run check` — TypeScript will catch missing languages.

## 4. Blog slug naming patterns

Prefer the **question or how-to** pattern; it matches search intent:

- `que-es-X` → "what is X"
- `como-X` → "how to X"
- `X-vs-Y` → comparison
- `X-para-Y` → "X for Y" (audience targeting)
- `ventajas-X` / `desventajas-X` → pros/cons
- `X-paso-a-paso` → step-by-step

Avoid:

- `la-mejor-X`, `el-mejor-X` (too generic; rework into "cómo-elegir-X").
- Slugs that merely echo the meta title word-for-word — the slug should carry the **primary KW** only.

## 5. Renaming a slug (last resort)

If a slug absolutely must change:

1. Update `blog-posts.ts` with the new Spanish slug.
2. Update `blog-posts-slugs.ts` for every language.
3. Update `blog-posts-i18n.ts` (the key moves with the Spanish slug).
4. Add a 301 redirect in `server/static.ts` (new middleware) from old → new for every language.
5. Add an entry to `docs/seo/changelog.md` with the date and reason.
6. Re-submit the sitemap in Google Search Console.

## 6. Anti-patterns (never do these)

- Adding query strings to "clean" URLs (e.g. `/blog?p=42`). Our SPA does not use these and adding them creates duplicates.
- Creating language variants of a slug that mean different things (e.g. `ein-guide` vs `guia-ein-completa` — pick one concept per slug family).
- Using Spanish slugs verbatim in English (`/en/blog/sobre-las-llc`). Always localize.
- Shipping a new post without a Catalan translation — all 6 languages must have at least the meta (title/description) even if content reuses the Spanish slug.

---

*End of conventions.*
