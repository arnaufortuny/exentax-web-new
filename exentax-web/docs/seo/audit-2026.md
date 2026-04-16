# Exentax — SEO Audit 2026

**Date:** April 2026
**Scope:** exentax.com (Vite + React SPA, Express SSR meta injection)
**Languages covered:** es (primary), en, fr, de, pt, ca
**Auditor:** Internal SEO review — task #4

---

## 1. Executive summary

Exentax has a mature, well-engineered SEO foundation:

- **Server-side meta injection** (`server/static.ts` + `server/seo-content.ts`) with an in-memory cache, 200 items max.
- **Hreflang rendering** is bidirectional, reciprocal, and includes `x-default` on every localized URL (main pages, blog index, blog posts).
- **i18n routing** is fully slug-translated for the six languages in `server/route-slugs.ts` and mirrored in `client/src/lib/routes.ts`.
- **Blog system**: 58 posts, translated titles/descriptions/excerpts/content for every language via `client/src/data/blog-posts-i18n.ts` and slug translation in `blog-posts-slugs.ts`.
- **Structured data** includes Organization, ProfessionalService, Article, HowTo, FAQPage, BreadcrumbList, Product + AggregateRating, OfferCatalog, Service and Speakable on the flagship guide.
- **Sitemap.xml** is localized, emits `xhtml:link rel="alternate"` for every language on every URL, includes `x-default`. It is cached 1h.
- **Robots.txt** correctly disallows `/api/`, `/admin/`, `/links`, `/start`, `/booking/` and declares the sitemap.
- **Prerendered SEO content** is injected in a hidden `<div id="seo-prerender">` so crawlers get the full copy before React hydrates.

**Status:** Technical SEO is in very good shape. The primary leverage points for 2026 are **content**, **internal linking at scale** and **on-SERP presentation** (titles, first-line hooks).

### Priority actions (from highest to lowest impact)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Publish 12 new long-form pillar posts on ITIN, EIN, no-resident taxation, LLC comparisons (keyword-map.md) | High | High |
| 2 | Rewrite home H1 in every language to front-load the primary query ("LLC USA no residentes") | Low | High |
| 3 | Build a deterministic internal-linking module for blog → hub pages and related posts (internal-linking.md) | Medium | High |
| 4 | Add `Review` schema with real customer testimonials on `/es/nuestros-servicios` (Product rating already declared) | Medium | High |
| 5 | Emit `Organization` + `WebSite` (with SearchAction) schema on the home route for every language (today only Spanish) | Low | Medium |
| 6 | Add `article:author` Person schema with real author pages for the blog | Medium | Medium |
| 7 | Serve an `image/webp` open-graph variant at 1200×630 and declare `og:image:width/height` (already in index.html — verify) | Low | Medium |
| 8 | Add `Disallow: /*?ref=` and `Disallow: /*?utm_*` to `robots.txt` to avoid crawl-budget leakage from UTM variants | Low | Low |
| 9 | Document the publishing checklist and slug-naming convention (see `publishing-checklist.md` and `slug-conventions.md`) | — | — |

---

## 2. Technical SEO

### 2.1 Indexation

- **Indexable surfaces**: home (`/`, `/{lang}`), 7 main pages × 6 languages = 42 URLs, blog index × 6 = 6 URLs, 58 blog posts × 6 = 348 URLs. **Total indexable**: ≈ 396.
- **No-index surfaces (correct)**: `/links`, `/start`, `/booking/:id`, unknown paths (404 + `noindex,nofollow` header).
- **Canonicals**: one per URL, always pointing to the language-prefixed version (`/es/...`). The unprefixed Spanish equivalents (`/sobre-las-llc`, `/blog/slug`) are still served by the SPA; `injectMeta` correctly rewrites canonical + hreflang to the `/es/` version, but we recommend hard 301 redirects to eliminate the duplicate entirely — see action below.

#### Action: add 301 from unprefixed Spanish paths to `/es/*`

Add early middleware (before `serveStatic`) that redirects `/sobre-las-llc`, `/como-trabajamos`, `/nuestros-servicios`, `/preguntes-frecuentes`, `/preguntas-frecuentes`, `/agendar`, `/blog`, `/blog/*`, `/legal/*` to their `/es/...` counterpart with HTTP 301. Benefits: avoids duplicate crawling, consolidates link equity.

### 2.2 Canonicals & hreflang

**Verified in `server/static.ts` (lines 213–243):**

- Blog articles: 6 hreflang + `x-default = /es/...` ✓
- Blog index: 6 hreflang + `x-default = /es/blog` ✓
- Main pages: 6 hreflang (from `resolveServerRoute`) + `x-default = /es/<key>` ✓
- Unknown paths: fallback hreflang pointing to the same URL (not ideal, but acceptable because these routes are `noindex`).

**Reciprocity check (manual)**: sampled `/en/about-llc` → `hreflang="es"` points to `/es/sobre-las-llc` → returns `hreflang="en" → /en/about-llc`. ✓

### 2.3 Sitemap

- **Path:** `/sitemap.xml`, cache 1 h, also exposes `xhtml:link rel="alternate"`.
- **Coverage:** all main pages × 6, blog index × 6, 58 blog posts × 6 = **414 URLs**.
- **Priorities:** home 1.0, hub pages 0.9, FAQ/book 0.8, blog index 0.8, posts 0.7, legal 0.3.
- **Changefreq:** home/book `weekly`, rest `monthly`, legal `yearly`. Reasonable.
- **Lastmod:** `todayMadridISO()` on main pages; blog posts use `updatedAt || publishedAt`.

**Improvement:** emit `<lastmod>` only when it really changed (today's date on every page signals "freshness spam" to Google). Use the route's configured `lastmod` date constant instead of `todayMadridISO()` for the main pages, and bump it manually when copy changes. Tracked in `changelog.md`.

### 2.4 Robots.txt

Current rules are correct. Suggested additions:

```
Disallow: /*?ref=
Disallow: /*?utm_source=
Disallow: /*?utm_medium=
Disallow: /*?utm_campaign=
Disallow: /*?gclid=
Disallow: /*?fbclid=
```

This prevents query-string duplicates from polluting the index.

### 2.5 Performance (Core Web Vitals — high-level)

The index HTML already:

- Preconnects & DNS-prefetches ([verify](../../client/index.html)).
- Uses hashed, `immutable`-cached JS/CSS under `/assets/*`.
- No-cache on HTML so meta changes propagate instantly.
- Defers non-critical JS.

**Recommendations to measure and fix** (run Lighthouse on `/es`, `/es/sobre-las-llc`, `/es/blog`, `/es/blog/llc-estados-unidos-guia-completa-2026`):

- LCP target ≤ 2.5 s on mobile 4G. If the hero image is the LCP, add `fetchpriority="high"` and an AVIF/WebP source.
- CLS target < 0.1. Check the hero calculator block: inputs often cause shift when fonts load.
- INP target < 200 ms. React hydration of heavy pages (pricing) can spike; consider `react.lazy()` for below-the-fold components on `/nuestros-servicios`.
- Reduce unused JS: run `rollup-plugin-visualizer` build report; audit `date-fns`, `framer-motion`, `recharts` (code-split).

### 2.6 Structured data coverage

| Page | Schemas |
|------|---------|
| Home | Organization (full), ProfessionalService, BreadcrumbList |
| About LLC | BreadcrumbList, Article with Speakable |
| How we work | BreadcrumbList, HowTo (4 steps) |
| Our services | BreadcrumbList, 3× Product with AggregateRating, ProfessionalService with OfferCatalog |
| FAQ | BreadcrumbList, FAQPage (full Q&A list) |
| Book | BreadcrumbList, Service |
| Blog index | — (relies on OG/basic meta) |
| Blog post | BreadcrumbList (3 levels), Article (full) |

**Gaps to fix:**

- Home: emit `WebSite` schema with `potentialAction = SearchAction` (`/es/blog?q={search_term_string}` — requires adding query param support in the blog search) to qualify for sitelinks search box.
- Services: the Product prices (`priceCurrency` only) should include a real `price` as soon as prices are publishable. Today this fails Google's strict Product validator despite the `AggregateRating` being accepted.
- Blog posts: add `author` as a `Person` (not Organization) once author pages exist (see Action #6).

### 2.7 Meta length validation

Script `scripts/seo-validate.mjs` should check that every title ≤ 60 chars and every description ≤ 155 chars (Google's truncation thresholds). Current state — spot check:

- `home/en`: title "Pay less taxes legally with your US LLC | Exentax" = 52 chars ✓
- `about_llc/en`: "US LLC for non-residents · Complete guide 2026 | Exentax" = 57 chars ✓
- `home/de`: "Zahlen Sie legal weniger Steuern mit Ihrer US-LLC | Exentax" = 60 chars — at the limit.
- `about_llc/de`: "US-LLC für Nicht-Residenten · Vollständiger Leitfaden 2026 | Exentax" = **70 chars, will truncate**. Shorten.

Proposal: `"US-LLC für Nicht-Residenten · Leitfaden 2026 | Exentax"` (53 chars).

### 2.8 Open Graph / Twitter

`og-image.png` is served from `/og-image.png` (public), 1200×630 expected. Verified. Blog posts currently reuse the same OG image — ideal long-term is a per-post image, but acceptable for v1.

---

## 3. On-page SEO — main pages

### 3.1 `/` + `/es` (home)

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | "Paga menos impuestos legalmente con tu LLC en EE.UU. \| Exentax" | ✓ Keep |
| H1 | "Exentax — Paga menos impuestos legalmente" (prerender) | Front-load primary query: "Paga menos impuestos con tu LLC en EE.UU. (sin residir allí)" |
| Description | 160 chars | Shorten to 152 chars and add a number ("-37%") early |
| Internal links from home | 5 internal | Add links to 4 cornerstone blog posts (LLC guía 2026, Form 5472, Mercury, EIN) |

Same structural recommendation for `/en`, `/fr`, `/de`, `/pt`, `/ca`.

### 3.2 `/es/sobre-las-llc` (cornerstone LLC guide)

Already has Article + Speakable. 2 500 words.

- **Add** an explicit table of contents with anchor links (`#ventajas`, `#estados`, `#ein`, `#stripe`, `#obligaciones-irs`) so Google can emit jump-links in the SERP.
- **Add** "Preguntas frecuentes sobre LLC" section at the bottom with 6 FAQPage-qualifying Q&A. Emit a **second** FAQPage schema for this page.
- **Add** outbound authoritative links to IRS.gov (Form 5472, Form 1120, W-8BEN) once — good for E-E-A-T.

### 3.3 `/es/como-trabajamos`

HowTo schema is solid. Recommendations:

- Add photos or illustrative icons for each step (currently text-only) to improve dwell time.
- Cross-link each step to the most relevant deep-dive: step 1 → `/es/agendar`, step 2 → `/es/blog/constituir-llc-proceso-paso-a-paso`, step 3 → `/es/blog/cuenta-bancaria-mercury-llc-extranjero`, step 4 → `/es/blog/mantenimiento-anual-llc-obligaciones`.

### 3.4 `/es/nuestros-servicios`

- Each plan (NM, WY, DE) currently has the same copy template. **Differentiate** the copy for each state by 150–200 words so Google does not collapse them as duplicates.
- Add a comparison table (NM vs WY vs DE) with a `<caption>` and `<th scope="col">` — good for Featured Snippet.
- Start collecting real reviews → emit `Review` schema (currently only aggregate).

### 3.5 `/es/preguntas-frecuentes`

Already excellent. Gaps:

- Structure answers with `<p>` paragraphs, not single lines — Google snippets prefer 40–60 word answers.
- Group questions into `<section>` blocks with `<h2>` headers: "Legalidad", "Costes", "Estados", "Impuestos", "Proceso".

### 3.6 `/es/agendar`

Correct `Service` schema. Low-priority SEO page (conversion-focused). Nothing urgent.

### 3.7 Legal pages

Already `noindex` alternative not needed — they are thin and rightfully `priority 0.3`. No action.

---

## 4. Blog SEO

### 4.1 Inventory

58 posts, all translated in 6 languages. Files:

- Source (Spanish): `client/src/data/blog-posts.ts`
- Translations: `client/src/data/blog-posts-i18n.ts`
- Slug translations: `client/src/data/blog-posts-slugs.ts`

### 4.2 Recommendations

- **Title tags**: ensure every localized `metaTitle` ends with `| Exentax` to reinforce brand recall in the SERP. Spot-checked `en` — most already do.
- **Slug hygiene**: all slugs are kebab-case ASCII, ≤ 60 chars. ✓
- **Excerpts**: currently used as `description` fallback. Make sure every localized `metaDescription` is written fresh (not just a truncation of the Spanish).
- **Internal linking target**: every post should contain **at least 3 internal links** to (a) the hub page (`sobre-las-llc`, `nuestros-servicios`, or `como-trabajamos`), (b) two topically related posts. See `internal-linking.md`.
- **Author transparency (E-E-A-T)**: the Article schema currently emits `author.@type = Organization`. Plan to introduce author pages (e.g. `/es/autor/[slug]`) with `Person` schema, LinkedIn `sameAs`, and bio. Blocked by product decision.
- **Dates**: `publishedAt` + `updatedAt` drive `datePublished` / `dateModified`. Every time a post is updated, bump `updatedAt` — this is what sustains "freshness".

### 4.3 Topic cluster map

See `keyword-map.md` for the full cluster and the new post briefs.

---

## 5. Redirects & legacy URLs

- No `.htaccess` — Express app serves everything.
- Add a middleware to 301 from unprefixed Spanish paths (see §2.1).
- Old WordPress slugs (if any) — none reported — can be handled in the same middleware.

---

## 6. International SEO

- **Hreflang**: verified complete and reciprocal.
- **Language detection**: user-level; the SPA picks up the language from the URL (no `Accept-Language`-based silent redirect — correct).
- **Catalan** (`ca`) is the smallest market; content parity is maintained, which is more than most competitors do.
- **Portuguese** (`pt`) currently uses European Portuguese phrasing — good for Portugal, acceptable for Brazil. If Brazilian volume grows, consider a split (`pt-BR`).

---

## 7. Monitoring & KPIs

Set up (recommended):

- Google Search Console: submit `/sitemap.xml`, verify each language-prefixed folder as a separate "property" so average position can be tracked per language.
- Bing Webmaster: same.
- Ahrefs / Semrush weekly rank tracker for the cornerstone queries listed in `keyword-map.md`.
- Track: CTR, average position, impressions per query group, indexed URL count, Core Web Vitals per URL group.

---

## 8. Validation checklist (run before merging a content change)

1. `curl -s https://exentax.com/<new-url> | grep -E 'title|description|canonical|hreflang'` — confirm meta rendered.
2. Run [Rich Results Test](https://search.google.com/test/rich-results) on the URL.
3. Run Lighthouse (mobile) on the URL.
4. Check `/sitemap.xml` contains the new URL.
5. Click every internal link in the new content.
6. Add an entry to `docs/seo/changelog.md`.

---

*End of audit.*
