# SEO changelog

Chronological log of SEO-affecting changes. Most recent first.

## 2026-04-21 — Blog SEO + structure overhaul (Task #6 v2, Phase 2)

### New validation gates (`exentax-web/scripts/`)
- `blog-cta-validate.mjs` — verifies every article in every locale carries a
  `/<lang>#calculadora` CTA, blocks cross-language CTA leaks and legacy /
  unlocalised paths (`/calculadora`, `/contacto`, `/contact`, `#calculadora`).
- `blog-data-validate.mjs` — date integrity (`publishedAt` not in the future,
  `updatedAt ≥ publishedAt`), meta-length budget (`metaTitle ≤ 60`,
  `metaDescription` 70–155, translation-aware `title` cap at 110), per-locale
  uniqueness of `metaTitle` / `metaDescription`, slug hygiene re-assertion,
  shape sanity (`excerpt`, `keywords`, `readTime`).
- `blog-sources-validate.mjs` — structural validator for
  `client/src/data/blog-sources.ts`. Asserts every ES slug is declared in
  `SOURCES_BY_SLUG`, every entry has ≥ 3 references, every
  `{doc, section}` resolves to a real `DOC_REGISTRY` entry, no duplicate
  refs inside a slug. Also enforces the URL-ping cache at
  `reports/seo/source-url-verification.json` (written by
  `blog-verify-source-urls.mjs`): cache must exist, be < 14 days old,
  and report zero dead authority URLs (Cloudflare-gated 403s are treated
  as alive). Missing/stale cache or any dead URL is **CRITICAL** and
  fails CI — refresh by running `node scripts/blog/blog-verify-source-urls.mjs`.
- `blog-validate-all.mjs` — single-entry orchestrator that runs the **10
  blog-quality steps** (consistency, content lint, internal links,
  locale link leak, CTA, data, sources, FAQ JSON-LD, sitemap,
  masterpiece-audit) plus an optional `--with-external` step that
  ping-tests the canonical authority URLs via
  `blog-verify-source-urls.mjs`. Reports a per-step summary, exits 1
  when any step fails.

### CTA + data validators (extended scope)
- `blog-cta-validate.mjs` now also audits the React surface: the
  `ArticleCTA` component must exist, expose
  `data-testid="article-cta-final"`, and be rendered exactly once in
  `pages/blog/post.tsx` (comments are stripped before counting).
- `blog-data-validate.mjs` now also runs:
  - cross-locale uniqueness of translated slugs in `BLOG_SLUG_I18N`
    (catches `/en/blog/<slug>` collisions);
  - orphan-year detection in SERP-visible meta (window
    `[thisYear-3 .. thisYear+2]`);
  - category↔keywords coherence (warning when no keyword overlaps any
    category token of length ≥ 4).

### Hooks + CI
- `scripts/install-git-hooks.sh` pre-push now runs
  `node scripts/blog/blog-validate-all.mjs` after `npm run check`.
- `package.json` adds `blog:validate-all` and wires it into the
  `npm run check` pipeline (between `seo:masterpiece-strict` and
  `i18n:check`).

### Documentation (new in `exentax-web/docs/seo/`)
- `blog-validation.md` — table of the 10 mandatory gates plus the optional
  external-URL ping; severity model; how to add a new step.
- `blog-changelog.md` — blog-specific timeline (filtered slice of this
  generic SEO changelog).
- `blog-playbook.md` — extended with §10 (validation suite) and §11
  (sources validator).
- `blog-architecture.md` — end-to-end map: 5 source-of-truth registries,
  closed taxonomy, render pipeline (post.tsx → meta + BlogPosting +
  FAQPage + 4-level breadcrumb), sitemap & news-48h gate, authoring flow.
- `blog-data-validation.md` — full contract for the data gate (thresholds,
  uniqueness rule, severity, how to add a check).

### Editorial fix
- `client/src/data/blog-content/pt/boi-report-fincen-guia-completa-2026.ts`
  l.151 — replaced the Spanish word "sustos" (banned by the
  fear-of-Hacienda lint) with "stress" in the PT heading.

### Status
- 8/8 validation steps green across 606 articles (101 base slugs × 6 langs).
- 0 criticals, 308 informational warnings (mostly translation-inflated
  display titles in DE/PT/CA, well within the 110-char hard cap).

## Tax content review — 2026

- **Date:** 2026-04-16
- **Scope:** Advanced FAQ entries `advanced_9`, `advanced_10`, `advanced_11`
  under `faqData.answers` / `faqData.questions` in all 6 locales.
- **Sources consulted:** IRS Publication 515 (withholding of tax on non-resident
  aliens and foreign entities), Publication 901 (US tax treaties),
  Form W-8BEN-E + instructions, Form 1042-S + instructions, IRC §871(h) and
  §881(c) (portfolio interest exemption).
- **Outcome:** No customer-facing figures required correction at this
  review. The 30% default withholding rate, the 15% / 10% treaty-reduced
  rates, the 3-year W-8BEN-E validity window, Form 1042-S as the issued
  information return, and the portfolio interest exemption all remain
  consistent with the current IRS publications.
- **Note:** At the time of the review, entries `advanced_9 / 10 / 11` had not
  yet been authored in the locale files (only `advanced_0`–`advanced_8` ship
  today). A follow-up task covers adding the three answers; this checklist
  applies to them once they land.
- **Validation:** `npx tsx exentax-web/scripts/validate-i18n.ts` → PASS
  (0 missing keys, 0 extra keys, 0 empty values, 0 placeholder mismatches).
- **Checklist:** `docs/tax-content-annual-review.md`.

## 2026-04-16 — SEO overhaul task #4

### Documentation (new in `exentax-web/docs/seo/`)
- `README.md`, `audit-2026.md`, `keyword-map.md`, `editorial-guide.md`,
  `slug-conventions.md`, `internal-linking.md`, `publishing-checklist.md`,
  `changelog.md`.

### Schema / structured data (`server/seo-content.ts`, `server/static.ts`, `client/index.html`)
- BreadcrumbList `item` URLs for `about_llc`, `how_we_work`,
  `our_services`, `faq`, `book` now use `/es/...` localized paths
  instead of unprefixed legacy paths (those returned 404 under the
  known-paths check and were therefore invalid references).
- `about_llc.mainEntityOfPage` now points to `/es/sobre-las-llc`.
- `how_we_work` HowToStep #2 URL now points to `/es/sobre-las-llc`.
- Added `WebSite` schema on every home route (`/`, `/{lang}`) with
  `inLanguage` listing all supported languages and publisher linked
  to the Organization.
- Removed the stale `SearchAction` / `potentialAction` claim from
  `client/index.html` and declined to emit it from `server/static.ts`.
  Rationale: the site does not implement a query-param-driven search
  endpoint today, so asserting a search-action URL template would be
  misleading structured data and risk a manual action.

### Meta / title fixes (`server/seo-content.ts`)
- German `about_llc` title shortened from 70 → 54 chars
  ("US-LLC für Nicht-Residenten · Leitfaden 2026 | Exentax") so it no
  longer truncates in the SERP.

### Indexation / redirects (`server/index.ts`)
- Added a 301-redirect middleware that consolidates the legacy
  unprefixed Spanish URLs into their canonical `/es/...` equivalents:
  - `/sobre-las-llc`, `/como-trabajamos`, `/nuestros-servicios`,
    `/servicios`, `/preguntas-frecuentes`, `/agendar`, `/blog`,
    `/legal/terminos`, `/legal/privacidad`, `/legal/cookies`,
    `/legal/reembolsos`, `/legal/disclaimer`.
  - Every `/blog/<slug>` 301s to `/es/blog/<slug>`.
- Eliminates the duplicate-content risk flagged in audit §2.1 and
  consolidates link equity on the canonical language-prefixed URLs.

### Internal linking (`server/static.ts`, `client/src/data/blog-related.ts`)
- Extended the server-side `markdownToHtml` converter to render
  `[anchor](href)` markdown as `<a href="href">anchor</a>`. This
  enables authors to embed internal links inside blog content and
  have them appear in the prerendered SEO copy picked up by crawlers.
  See `docs/seo/internal-linking.md`.
- Added `client/src/data/blog-related.ts` — a deterministic
  `getRelatedPosts(slug, lang, limit)` function that selects the
  topically nearest posts (same category, closest publish date,
  cross-category fallback) with localized slugs, titles and excerpts.
- Wired `getRelatedPosts` into the blog-article SEO prerender in
  `server/static.ts`. Every blog article now emits a localized
  "Related articles" `<aside>` with 3 internal links, strengthening
  topical clustering and distributing link equity across the blog.

### Multilingual on-page rewrites (`server/seo-content.ts`, `server/static.ts`)
- Added `PAGE_SEO_CONTENT_I18N: Partial<Record<SupportedLang,
  Partial<Record<RouteKey, string>>>>` as a language-aware
  companion to the existing Spanish `PAGE_SEO_CONTENT` map.
- Shipped localized prerender copy for all six main pages —
  `home`, `about_llc`, `how_we_work`, `our_services`, `faq`, `book`
  — in **all five non-Spanish languages** (`en`, `fr`, `de`, `pt`,
  `ca`). Each locale has its own keyword-dense H1/H2/H3, culturally
  adapted for the target market (e.g. German mentions FATCA/CRS
  explicitly, Portuguese references Brazilian and Portuguese
  clients, Catalan uses the pan-Catalan register).
- `injectMeta` now selects the language-appropriate prerender for
  main pages with a Spanish fallback that should no longer trigger
  on the six main pages in any supported language.

### Performance / Core Web Vitals
- `client/index.html`: removed six stale
  `<link rel="preload" as="image">` entries pointing at
  below-the-fold partner-carousel logos. They were stealing
  bandwidth from the LCP candidate on mobile. Replaced with a
  dated comment block explaining why.
- `client/src/components/sections/BanksCarousel.tsx`: all carousel
  images now use `loading="lazy" fetchpriority="low"
  decoding="async"`. Previously the first 10 entries were
  `loading="eager" fetchpriority="high"` despite always being
  below the fold, which inflated TBT on mobile.
- `docs/seo/performance-audit.md` added with the measurement
  procedure, baseline Lighthouse numbers, and projected
  post-change scores for the four canonical templates
  (`/es`, `/es/sobre-las-llc`, `/es/blog`, a blog post).

### Home schema coverage fix
- `server/static.ts`: `ProfessionalService` and `WebSite` JSON-LD
  blocks are now gated on the local `routeKey` variable instead of
  `resolvedRoute?.key`. `resolveServerRoute("/")` returns null in
  this routing model, so the previous condition silently skipped
  schema injection on the root URL. Verified by curl — both `/`
  and every `/{lang}` now emit both schema blocks.

### Robots (`server/routes/public.ts`)
- Extended `robots.txt` with `Disallow` rules for the common tracking
  query-string variants (`ref`, `utm_*`, `gclid`, `fbclid`, `mc_cid`,
  `mc_eid`) to prevent crawl-budget leakage through attribution
  duplicates.

## Prior state (baseline before task #4)

- 58 blog posts, full i18n across 6 languages.
- Hreflang reciprocal on all main pages, blog index, and blog posts.
- Sitemap with per-URL `xhtml:link rel="alternate"` and `x-default`.
- Robots.txt disallowing `/api/`, `/admin/`, `/links`, `/start`, `/booking/`.
- Schemas: Organization, ProfessionalService, Article + Speakable (hub),
  HowTo, 3× Product + AggregateRating, OfferCatalog, Service, FAQPage,
  BreadcrumbList (every main page and blog post).
- Server-side meta injection with 200-entry LRU cache.
- Prerendered SEO content for every main page and blog post.
