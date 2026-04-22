# Archived scripts — April 2026

These scripts have already done their job and are kept here for historical
auditability only. They are **not** wired into `package.json`,
`scripts/post-merge.sh` or any CI workflow. If you need to regenerate the
effect, prefer the reusable auditors that still live in `scripts/`
(`blog-audit-2026.mjs`, `blog-content-lint.mjs`, `blog-i18n-sync-check.mjs`,
`blog-link-locale-lint.mjs`, `blog-structure-audit.mjs`, `seo-*.mjs`).

> **Note:** these files are *historical snapshots*, not guaranteed to run
> in-place. Several keep relative imports that pointed to siblings in
> `scripts/` (e.g. `report-link-graph.mjs` imports `./link-graph.mjs`),
> so executing them from the archive path may fail without first copying
> them back next to their dependencies. Read them as a record of what was
> done, not as a re-runnable tool.
## One-shot content migrations

| Script                                    | Origin task | What it did                                                                                                                                            |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apply-banking-facts-2026.mjs`            | #34         | Applied the 2026 banking-facts fixes (Wise / Mercury / Relay / Stearns) across the 6-language blog corpus once.                                        |
| `apply-legal-facts-2026.mjs`              | #34         | Applied the 2026 legal-facts fixes (CRS / FATCA / IRS reporting) across the corpus once.                                                               |
| `cleanup-contradictions-2026.mjs`         | #34         | First pass that removed contradictions introduced by the older fact set.                                                                               |
| `cleanup-contradictions-pass2-2026.mjs`   | #34         | Second pass that mopped up edge cases the first script missed.                                                                                         |
| `cleanup-slash-stearns-2026.mjs`          | #34         | Removed the obsolete "Stearns / slash-bank" mentions after the 2026 banking review.                                                                    |
| `fix-wise-crs-2026.mjs`                   | #34         | Hot-fix for the two protected slugs `wise-business-crs-reporting-fiscal` and `wise-iban-llc-que-reporta-hacienda` (do not regenerate without #34 SOT). |
| `blog-fixes-task2.mjs`                    | #36         | Bulk structural fixes for blog Task #36 (CTA cleanups, related-reads dedup, locale anchors).                                                           |
| `blog-fixes-task3.mjs`                    | #37         | Bulk structural fixes for blog Task #37 (heading skips, missing next-step closers).                                                                    |
| `blog-add-next-steps.mjs`                 | #37         | One-time pass that added the closing "next steps" section to articles that still lacked it.                                                            |
| `blog-structure-fix-h3.mjs`               | #37         | One-time pass that inserted H3 sub-headings into >400-word sections.                                                                                   |

The structural rules these scripts enforced are now guarded by the CI job
`.github/workflows/blog-audit.yml` (added in Task #49), so any regression
would be caught at PR time without needing to re-run the migrations.

## Candidates with zero external references (kept for one cycle)

These were not part of the task migration set but had **zero** references in
`package.json`, `scripts/post-merge.sh`, any GitHub workflow and any docs at
the time of the cleanup. They are archived rather than deleted in case
anyone has them wired in a personal automation. If still unused at the next
audit, delete them.

| Script                                | Why archived                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `audit-related.ts`                    | Superseded by `blog-audit-2026.mjs` + `blog-i18n-sync-check.mjs`. No callers found.                                           |
| `report-link-graph.mjs`               | Diagnostic helper around `scripts/link-graph.mjs`; not invoked by any script or workflow. (Independent of `redirect-hub-trims.mjs`, which is its own helper kept under `scripts/`.) |
| `seo-stray-slash-redirect.test.mjs`   | Stand-alone test file outside the Vitest config; never executed by CI.                                                        |

## Not archived (still live elsewhere)

- `redirect-hub-trims.mjs` — kept under `scripts/` because, although also
  unreferenced today, it is documented in `replit.md` as a manual
  redirect-trim helper.
- All `seo-*.mjs`, `blog-audit-2026.mjs`, `blog-content-lint.mjs`,
  `blog-i18n-sync-check.mjs`, `blog-link-locale-lint.mjs`,
  `blog-structure-audit.mjs`, `seo-indexing-audit.mjs`,
  `seo-indexing-publish.mjs`, `i18n-glossary-lint.ts` — reusable auditors,
  some wired into CI (`.github/workflows/blog-audit.yml`).
