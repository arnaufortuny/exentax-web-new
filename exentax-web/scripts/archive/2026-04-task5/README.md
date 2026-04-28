# Archive — 2026-04 Task #5 (Orphan code + structure cleanup)

These one-shot scripts were executed once during 2026-03/04 cleanup waves
(Tasks #4, #34/35, BOI lockdown, OG cleanup, Discord re-registration) and
left no runtime callers, package.json scripts, GitHub workflow steps,
documentation links, or test imports. Detected by Task #5 orphan-detect
(see `reports/cleanup/orphan-2026-04.md`) and archived here for history.

## Blog one-shots
- `blog-conversion-fill.mjs` — backfilled CTA contracts under Task #34/35
  (replaced by `audit-conversion-112x6.mjs` which is the active CI gate).
- `blog-cta-position-autofix.mjs` — one-time autofix for CTA position; now
  enforced by `blog-cta-position-check.mjs`.
- `blog-fix-boi-not-mandatory.mjs` — single migration to flip BOI tone
  after FinCEN lifted the rule for U.S. companies; replaced by the active
  `blog-fix-boi-mandatory.mjs` enforcement script.
- `blog-strip-inline-related.mjs` — purged legacy "Artículos relacionados"
  inline blocks; now blocked by `blog-no-inline-related.mjs` (active gate).
- `blog-structure-trim.mjs` — Task #4 structural trim (TL;DR, FAQ counts).
- `blog-task35-refresh-ctas.mjs` — refreshed Task #35 conversion CTA copy.

## Discord one-shots
- `de-register-action-list.mjs` — removed legacy slash-command shortlist.
- `de-register-apply-safe.mjs` — safe-mode deregistration helper, used
  once during the Task-#36 Discord migration.

## SEO / OG one-shots
- `inject-pillar-links.mjs` — wired pillar→cluster anchor block; replaced
  by the live `blog-cluster-audit.mjs` gate.
- `seo/check-social-previews.sh` — wrapper around two now-archived OG
  helpers; the live gate is `seo/audit-social-previews.ts` invoked via
  `npm run seo:check`.
- `seo/fix-subpages-og-order.mjs` — one-time OG-tag reordering pass.
- `seo/inject-og-titles.mjs` / `seo/inject-og-titles-2.mjs` — OG title
  backfill (rounds 1 + 2).
- `seo/inject-subpages-og-titles.mjs` — OG title backfill for sub-pages.
- `seo/pad-subpages-og.mjs` — OG description padding pass.

## Restoring (rare)

These scripts are kept only for archaeology. Do not re-run them as-is:
the corpus they targeted has since changed shape (CTA contracts, BOI
mandatory flag, OG tag layout). If a similar one-shot is ever needed,
copy the relevant logic into a new script under the appropriate
`scripts/<domain>/` folder rather than restoring these files.
