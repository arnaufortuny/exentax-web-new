# Blog validation suite

End-to-end quality gate for the Exentax blog corpus (101 base slugs × 6 langs
= 606 articles). Single entry point:

```bash
npm run blog:validate-all                          # 10 local steps (offline)
npm run blog:validate-all -- --with-external       # adds source-URL ping
node scripts/blog/blog-validate-all.mjs --with-external # equivalent
```

The orchestrator runs every step in sequence as a child process, prints a
single summary, and exits with code 1 when at least one step fails. It is
wired into:

- `npm run check` (between `seo:masterpiece-strict` and `i18n:check`).
- The `pre-push` git hook installed by `scripts/install-git-hooks.sh`.

## The 10 mandatory steps

| #  | Step id            | Script                                  | What it guarantees                                                                                          |
|---:|--------------------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------|
|  1 | `consistency`      | `scripts/blog/blog-consistency-check.mjs`    | 5-registry parity (BLOG_POSTS ↔ es files ↔ BLOG_SLUG_I18N ↔ SOURCES_BY_SLUG ↔ per-locale content), kebab-case ≤80, closed taxonomy. |
|  2 | `content-lint`     | `scripts/blog/blog-content-lint.mjs`         | No forbidden price/address mentions; no fear-of-Hacienda phrasing; allow-list (IRS $25K, BOI $591/d, FDIC $250K, Stripe 2.9%, $0 editorial). |
|  3 | `internal-links`   | `scripts/seo/seo-check-links.mjs`           | Zero broken `/<lang>/blog/<slug>` links; every ES article has ≥3 incoming contextual links.                  |
|  4 | `locale-link-leak` | `scripts/blog/blog-link-locale-lint.mjs`     | No FR article links to `/es/blog/...`, etc. Cross-language leak inside the body is a hard fail.              |
|  5 | `cta`              | `scripts/blog/blog-cta-validate.mjs`         | Every article carries `/<lang>#calculadora`; no cross-language CTA leak; no legacy paths; React surface intact (`ArticleCTA` rendered exactly once with `data-testid="article-cta-final"`). |
|  6 | `data`             | `scripts/blog/blog-data-validate.mjs`        | Date integrity, meta-length budget (`metaTitle ≤ 60`, `metaDescription` 70–155), per-locale + cross-locale uniqueness, orphan-year detection in SERP-visible meta, category↔keywords coherence, slug hygiene, shape sanity. |
|  7 | `sources`          | `scripts/blog/blog-sources-validate.mjs`     | Every ES slug declared in `SOURCES_BY_SLUG`, each entry ≥ 3 refs, every `{doc, section}` resolves to `DOC_REGISTRY`. |
|  8 | `faq-jsonld`       | `scripts/seo/seo-faq-jsonld-check.mjs`      | FAQPage JSON-LD wires correctly to the rendered tree, every Q/A is translated (no byte-identical ES leakage). |
|  9 | `sitemap`          | `scripts/seo/seo-sitemap-check.mjs`         | Sitemap shape (101 × 6 + index + pages), hreflang round-trip, every URL responds 2xx/3xx.                    |
| 10 | `masterpiece-audit`| `scripts/blog/blog-masterpiece-audit.mjs`    | v2 editorial rules (calc-cta marker, sources block, year-in-prose, length, authority block). Strict variant `seo:masterpiece-strict` is run earlier in `npm run check`. |

## Optional step (`--with-external`)

| Step id            | Script                                | Notes                                                                                              |
|--------------------|---------------------------------------|----------------------------------------------------------------------------------------------------|
| `external-sources` | `scripts/blog/blog-verify-source-urls.mjs` | HEAD/GET ping against the 27 canonical authority URLs (IRS, FinCEN, OECD, EUR-Lex, BOE, AEAT, …). Excluded from the default suite because it depends on third-party availability. Cloudflare-gated 403s are accepted as alive. |

### Weekly scheduled run

The external-source step is opt-in for PRs but runs automatically once a
week so link-rot in citations is caught before users (or auditors) hit it.

- **Workflow:** `.github/workflows/blog-source-health-weekly.yml`
- **Schedule:** every Monday at 06:00 UTC (cron `0 6 * * 1`); also exposed
  via `workflow_dispatch` for ad-hoc reruns from the Actions tab.
- **Command:** `node scripts/blog/blog-validate-all.mjs --with-external` (run
  inside `exentax-web/`).
- **Artifact:** `source-url-verification` (90 d retention) — contains
  `reports/seo/source-url-verification.json` and the regenerated
  `docs/seo/blog-sources-canonical.md`.
- **On failure:** an issue titled `[blog] Dead authority URLs detected
  (YYYY-MM-DD)` is opened (or commented on if one is already open) with
  labels `blog-link-rot`, `seo`, `automated`. The body lists every dead
  URL (citation, status, error) and the remediation checklist:
    1. Re-run the workflow once to rule out a transient outage.
    2. Find the new canonical URL on the issuing authority's site and
       update `scripts/blog/blog-verify-source-urls.mjs`.
    3. Update any inline references in article bodies that cite the same
       URL (`rg "<old-url>" client`).
    4. Close the issue once `--with-external` is green locally.

  Failures unrelated to the external step (e.g. a regression in one of
  the 10 mandatory steps) do **not** open a link-rot issue — they only
  surface as a red workflow run.

## Severity model

Each step distinguishes **criticals** (fail the gate) from **warnings**
(reported but never fatal). The data-validation thresholds are deliberately
strict on what truncates in the SERP:

- `title` (display H1): warning ≥ 75, warning > 80, critical > 110.
  Translations to DE/PT/CA naturally inflate by ~30% so cap is generous.
- `metaTitle` (SERP title): warning ≥ 58, **critical > 60**.
- `metaDescription`: warning ≤ 90 or ≥ 150, **critical < 70 or > 155**.

## Exit codes

- `0` — every step OK.
- `1` — at least one step FAILED (specific ids printed in the summary).
- `2` — orchestrator itself crashed (parser / IO error in
  `blog-data-validate.mjs`, etc.).

## Adding a new step

1. Add the script under `exentax-web/scripts/` with the same `import.meta.url
   === file://${process.argv[1]}` guard so it's both invokable directly and
   importable from tests.
2. Append the step to the `STEPS` array in `blog-validate-all.mjs` (or
   `EXTRA_EXTERNAL` if it's network-dependent).
3. Document its contract in the table above.
4. Wire its tests under `scripts/<id>.test.mjs` and add the matching entry
   in `package.json#scripts.test:*` (ask before editing `package.json`).
