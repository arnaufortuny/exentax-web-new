# Blog data validation contract

Reference for `scripts/blog-data-validate.mjs` (Task #6 v2 — step 4). This
gate audits the **structured data** of every article (it does NOT read the
body — bodies are covered by `blog-content-lint.mjs` and `seo-check-links.mjs`).

## Scope

- Source-of-truth: `client/src/data/blog-posts.ts` (Spanish baseline).
- Per-locale meta: `client/src/data/blog-i18n/<lang>.ts` for en / fr / de /
  pt / ca.

## Checks

### 1. Date integrity

- `publishedAt` must match `YYYY-MM-DD` and parse as a real UTC date.
- `publishedAt` must NOT be in the future (UTC end-of-day).
- `updatedAt`, when present, must match `YYYY-MM-DD`, parse, be ≥
  `publishedAt` and not be in the future.

### 2. Meta-length budget

| Field             | Min | Warn-low | Warn-high | Critical                     |
|-------------------|----:|---------:|----------:|------------------------------|
| `title` (H1)      |   — |       — |        75 | > 110 chars                  |
| `metaTitle`       |   — |       — |        58 | > 60 chars (SERP truncation) |
| `metaDescription` |  70 |      90 |       150 | < 70 or > 155 chars          |

`title` thresholds are loose because translations to DE/PT/CA inflate by
~30%; the SERP-truncating field is `metaTitle`.

### 3. Uniqueness (per language)

Within a single locale (es / en / fr / de / pt / ca), no two articles may
share:

- the exact (case-insensitive) `metaTitle`, or
- the exact (case-insensitive) `metaDescription`.

Duplicate canonical meta is a SERP cannibalisation risk.

### 4. Slug hygiene

Re-asserted defensively (the consistency gate is the primary owner):

- Matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Length ≤ 80.
- No leading/trailing hyphen, no double hyphens.

### 5. Shape sanity

- `excerpt` non-empty after trim.
- `keywords` (when present) is a non-empty array, length ≤ 10 (warn).
- `readTime` is a finite positive integer ≤ 30 (warn otherwise).

## Severity & exit codes

- 0 — zero criticals (warnings allowed and expected).
- 1 — at least one critical.
- 2 — parser / IO crash.

## Why not use the existing `seo:meta` script

`scripts/seo/verify-meta.ts` is a separate gate that focuses on the i18n
locale pages (`/`, `/blog`, etc.) and emits a JSON report under
`reports/seo/seo-meta-report.json`. `blog-data-validate.mjs` complements
it with the per-article surface and is intentionally fast (< 200 ms,
zero TS dependency, parses the source files with a stripped-down
JS-literal evaluator).

## Adding a check

1. Append the rule to `blog-data-validate.mjs` (`checkDates`, `checkLengths`,
   `checkUniqueness`, `checkSlug`, `checkShape`).
2. Mirror the threshold or invariant in this document under the matching
   section.
3. Run `node scripts/blog-data-validate.mjs` locally to ensure the corpus
   passes (or surface debt as warnings before promoting to critical).
