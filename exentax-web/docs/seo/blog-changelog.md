# Blog changelog

Blog-specific timeline (a slice of `docs/seo/changelog.md` filtered to events
that touch `client/src/data/blog-*` or `scripts/blog-*`). Most recent first.

## 2026-04-21 — Task #6 v2 (Phase 2): 10-gate validation suite

### New scripts (`exentax-web/scripts/`)
- `blog-cta-validate.mjs` — verifies every article in every locale carries
  `/<lang>#calculadora`, blocks cross-language CTA leaks (e.g. EN article
  pointing to `/es#calculadora`) and unlocalised legacy paths
  (`/calculadora`, `/contacto`, `#calculadora`). Also audits the React
  surface: `<ArticleCTA>` is rendered exactly once in `pages/blog/post.tsx`
  and exposes the canonical `data-testid="article-cta-final"`.
- `blog-data-validate.mjs` — date integrity (`publishedAt` not in the
  future, `updatedAt ≥ publishedAt`), meta-length budget
  (`metaTitle ≤ 60`, `metaDescription` 70–155, translation-aware `title`
  cap at 110), per-locale uniqueness of `metaTitle` / `metaDescription`,
  cross-locale uniqueness of translated slugs in `BLOG_SLUG_I18N`,
  orphan-year detection in SERP-visible meta, category↔keywords
  coherence, slug hygiene re-assertion, shape sanity (`excerpt`,
  `keywords`, `readTime`).
- `blog-sources-validate.mjs` — structural validator for
  `client/src/data/blog-sources.ts`. Asserts every ES slug is declared in
  `SOURCES_BY_SLUG`, every entry has ≥ 3 references, every
  `{ doc, section }` resolves to a real `DOC_REGISTRY` entry, and no
  duplicate references inside a slug bundle. Also enforces
  `reports/seo/source-url-verification.json` (written by
  `blog-verify-source-urls.mjs`): cache must exist, be < 14 days old,
  and report 0 dead URLs (CF-gated 403 = alive). Otherwise CRITICAL.
- `blog-validate-all.mjs` — single-entry orchestrator over the **10
  mandatory steps** (consistency → content-lint → internal-links →
  locale-link-leak → cta → data → sources → faq-jsonld → sitemap →
  masterpiece-audit) plus an optional `--with-external` step
  (`blog-verify-source-urls.mjs`).

### CI/hook wiring
- `npm run check` now invokes `blog:validate-all` after
  `seo:masterpiece-strict` (single new script entry in `package.json`).
- `scripts/install-git-hooks.sh` pre-push runs the orchestrator after
  `npm run check`.

### Documentation
- `docs/seo/blog-validation.md` — table of the 10 gates + severity model.
- `docs/seo/blog-architecture.md` — end-to-end map: 5 source-of-truth
  registries, render pipeline, sitemap + news-48h gate, authoring flow.
- `docs/seo/blog-data-validation.md` — full contract for the data gate.
- `docs/seo/blog-playbook.md` — extended with the §10 validation chapter
  and the data/sources/CTA contracts.

### Editorial fix
- `client/src/data/blog-content/pt/boi-report-fincen-guia-completa-2026.ts`
  l.151 — replaced "sustos" (banned by the fear-of-Hacienda lint) with
  "stress".

### Status
- 10/10 gates green across 606 articles. 0 criticals, ~308 informational
  warnings (mostly translation-inflated DE/PT/CA H1 titles, all under
  the 110-char hard cap). Masterpiece audit mean score: 100/100 in every
  locale.
- Out of scope per explicit user directive: OG images.

## 2026-04-20 — Blog editorial overhaul (Tasks #1–#4)

See the consolidated entry in `docs/seo/changelog.md` (2026-04-20). 101
articles × 6 languages rewritten pro-Exentax/pro-LLC, ≥ 3000 chars each,
exactly 2 CTAs per article (booking + calculator), 27/27 source URLs
verified, sitemap pings dispatched.

## 2026-04-20 — Owner-focused inserts (Task #27, Phase 1)

See `docs/seo/blog-overhaul-2026.md`. 36 idempotent inserts on the 6
owner-focused articles × 6 languages.
