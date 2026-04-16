# Exentax SEO documentation

This folder is the single source of truth for everything SEO at exentax.com.

## Files

| File | Purpose |
|------|---------|
| [`audit-2026.md`](./audit-2026.md) | Full SEO audit April 2026. Prioritized actions. |
| [`keyword-map.md`](./keyword-map.md) | Multilingual keyword strategy, new-post roadmap. |
| [`editorial-guide.md`](./editorial-guide.md) | Voice, tone, structural rules for writing. |
| [`slug-conventions.md`](./slug-conventions.md) | URL / slug rules for new pages and posts. |
| [`internal-linking.md`](./internal-linking.md) | Internal-link policy and implementation plan. |
| [`publishing-checklist.md`](./publishing-checklist.md) | Pre-merge QA checklist for any SEO change. |
| [`ranking-monitor.md`](./ranking-monitor.md) | Weekly Google ranking check script and alerting. |
| [`changelog.md`](./changelog.md) | Log of SEO-affecting changes. |

## Where the SEO engine lives in the code

| Concern | File |
|---------|------|
| Meta (title, description, OG, canonical) | `server/seo-content.ts` → `PAGE_META_I18N`, `PAGE_META` |
| Hreflang, JSON-LD, prerender injection | `server/static.ts` → `injectMeta` |
| Structured data | `server/seo-content.ts` → `PAGE_SCHEMAS`, `FAQ_SCHEMA_ENTRIES` |
| Route slugs (server) | `server/route-slugs.ts` |
| Route slugs (client) | `client/src/lib/routes.ts` |
| Blog posts (source, Spanish) | `client/src/data/blog-posts.ts` |
| Blog posts (i18n) | `client/src/data/blog-posts-i18n.ts` |
| Blog slug translations | `client/src/data/blog-posts-slugs.ts` |
| Sitemap + robots | `server/routes/public.ts` (`/sitemap.xml`, `/robots.txt`) |
| HTML template | `client/index.html` |
| Client-side meta updates | `client/src/components/SEO.tsx` |

## Quick-start for a new post

1. Read `publishing-checklist.md`.
2. Pick a slug per `slug-conventions.md`.
3. Draft in Spanish following `editorial-guide.md`.
4. Translate to all 6 languages.
5. Commit changes in `blog-posts.ts` + `blog-posts-i18n.ts` + `blog-posts-slugs.ts`.
6. Tick the checklist, log the change in `changelog.md`, open PR.

## Quick-start for a new main page

1. Read `slug-conventions.md` § 3.
2. Add `RouteKey` + localized slugs in both `server/route-slugs.ts` and `client/src/lib/routes.ts` (MUST stay in sync).
3. Register page component in `client/src/App.tsx`.
4. Add meta in `server/seo-content.ts` (title + description for all 6 languages inside `buildI18nMeta`).
5. Add schema in `PAGE_SCHEMAS[key]` (BreadcrumbList + page-type).
6. Add priority entry in the sitemap handler (`server/routes/public.ts`).
7. Type-check (`npm run check`), build (`npm run build`).
8. Follow `publishing-checklist.md`.
