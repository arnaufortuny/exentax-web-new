# Cleanup & Hardening — 2026-04 (Task #36)

End-to-end housekeeping pass on the Exentax Web codebase: dead code removal, script archival, repo-root tidying, documentation consolidation, and full validation sweep.

## Scope & constraints
- No changes to `package.json`, `vite.config.ts`, `drizzle.config.ts`, or `server/vite.ts`.
- No changes to Drizzle schema primary keys.
- Non-destructive on blog content (101 articles × 6 languages preserved).

## Changes applied

### 1. Dead client code removed
- `client/src/components/ui/Button.tsx` — custom variant, **0 imports** in the codebase. Project uses `btn-primary` / `btn-wa` Tailwind utility classes directly.
- `client/src/components/ui/Badge.tsx` — custom variant, **0 imports**. Blog uses `client/src/components/blog/CategoryBadge.tsx` instead.
- The empty `client/src/components/ui/` directory was removed.

### 2. Repo root tidied
- `seo-meta-report.json` (generated artefact) → `reports/seo/seo-meta-report.json`. The generator (`scripts/seo/verify-meta.ts`) was also patched so future runs of `npm run seo:meta` write to the new location instead of recreating the file at the repo root.
- **Guard rail (Task #37):** `scripts/audit/check-stray-reports.mjs` (wired into `npm run check` as `npm run lint:stray-reports`) fails if any `*-report.json`, `*-report.md`, or `bundle-visualizer.html` ends up outside `reports/` or `docs/`. If a new audit/report script lands in the future, point its output at `reports/<area>/` from the start — the guard will catch drift before it ships.
- `EDITORIAL_GUIDE.md` (Spanish, 125 lines, the canonical editorial reference) → `docs/EDITORIAL_GUIDE.md`. Coexists with the shorter English `docs/seo/editorial-guide.md` (70 lines, voice/tone primer).
- `docs/seo/bundle-visualizer.html` removed (build artefact). To regenerate it, run `npm run build` — `rollup-plugin-visualizer` writes a fresh copy as part of the production build (see `vite.config.ts`). The file is intentionally left out of version control.

> **Architectural note — generic UI primitives:** the project does not use a generic `client/src/components/ui/` directory. Buttons are styled with Tailwind utility classes (`btn-primary`, `btn-wa`) defined in `client/src/index.css`; badges live next to their consumer (e.g. `client/src/components/blog/CategoryBadge.tsx`). Do not reintroduce a generic `Button.tsx` / `Badge.tsx` without a real, multi-page consumer that justifies the abstraction.

### 3. Scripts archived
Twenty-eight one-off scripts that completed their purpose during the Q1–Q2 2026 blog overhaul (Tasks #18, #20) and the Q1 2026 SEO audit moved to `scripts/archive/2026-04-task36/`:

`republish-tier-a-fase1.mts`, `blog-emdash-cleanup.mjs`, `blog-stepwise-parent-fix.mjs`, `blog-strip-extra-cta.mjs`, `blog-strip-extra-recap.mjs`, `discord-restore-identity.mjs`, `redirect-hub-trims.mjs`, `cta-faq-rewrite.mjs`, `cta-rewrite.mjs`, `blog-fix-broken-links.mjs`, `blog-fix-missing-calc-cta.mjs`, `blog-inject-localized-cta.mjs`, `blog-inject-calculator-cta.mjs`, `blog-align-batch.mjs`, `blog-audit-2026.mjs`, `blog-audit-table.mjs`, `cleanup-blog-sources.mjs`, `rebalance-links.mjs`, `seo-add-cross-refs.mjs`, `seo-blog-audit.mjs`, `seo-fix-broken-links.mjs`, `seo-task4-check.mjs`, `seo-orphans.mjs`, `seo-indexing-publish.mjs`, `seo-indexing-audit.mjs`, `check-blog-links.ts`, `check-blog-sources.ts`.

`scripts/seo/link-graph.mjs` was kept (consumed at runtime by `seo-check-links.mjs`).

`scripts/` root went from 65 → 37 entries (excluding `archive/` and `seo/`).

### 4. False alarm — restored
`client/src/pages/services-sections.tsx` was initially flagged as orphan because no static import targets it; it is in fact lazy-loaded by `client/src/pages/services.tsx` via `lazy(() => import("./services-sections"))`. Restored from git after TSC caught the regression. Documented here so future audits do not repeat the mistake.

## What we deliberately did not touch
- **Server `console.*`**: only legitimate occurrences remain — `server/indexnow.test.ts` (test harness output) and `clientLogger.ts` / `i18n/index.ts` (DEV-gated or last-resort error reporting). Nothing actionable.
- **Blog `TODO/FIXME` matches**: all 46 hits are false positives — the substring `XXX` appears inside ITIN/SSN/SWIFT format examples (`9XX-XX-XXXX`, `CLNOUSPAXXX`, etc.) within blog articles.
- **API endpoints**: 32 routes audited (`server/routes.ts` + `server/routes/{admin,public,observability,shared,api-response}.ts`) — every one is wired into the running app. No orphan handlers.
- **i18n keys**: 922 unique `t()` references resolve in ES (no phantom keys); 0 missing/extra/empty/placeholder/structure mismatches across all six locales. Two cosmetic candidates flagged (`finalCta.whatsappCta`, `finalCta.whatsappMsg`) — left in place pending the FAQ rewrite (already tracked separately).
- **`docs/`**: not reorganised. Several i18n audit reports overlap, but they are timestamped historical records; rewriting them is out of scope for a hygiene task.

## Validation (post-cleanup)

| Check | Result |
| --- | --- |
| `tsc --noEmit` | ✓ 0 errors |
| `validate-i18n.ts` | ✓ PASS (0 missing / 0 extra / 0 empty) |
| `seo-check-links.mjs` | ✓ no broken internal blog links, all 101 articles ≥ 3 incoming links |
| `seo-slash-hygiene.mjs` | ✓ clean |
| `blog-i18n-sync-check.mjs` | ✓ 101 articles × 6 langs, 0 missing, 0 duplicate slugs, 0 invalid |
| `blog-link-locale-lint.mjs` | ✓ 505 article files, every internal blog link matches its folder locale |
| `blog-content-lint.mjs` | ✓ 610 files, no forbidden mentions |

## Bundle baseline (post-cleanup, pre-rebuild)

Initial chunk: `index-*.js` 1.55 MB. Heaviest lazy chunks: `SEO-*.js` 134 KB (shared SEO component), `blog-posts-*.js` 85 KB (slug map). Locale chunks 62–66 KB each (loaded on demand for non-Spanish visitors). Total assets ~14 MB across 650 chunks (mostly per-article + per-locale blog post chunks). LCP/bundle reduction is tracked independently — not in scope here.
