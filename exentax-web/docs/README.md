# Exentax — Documentation Index

This directory groups the living documentation for the Exentax web project:
architecture, content guidelines, audits and operational guides. Use this
index as the entry point.

## Architecture & data
- [architecture-map.md](./architecture-map.md) — High-level architecture, modules and dependencies.
- [data-flow.md](./data-flow.md) — End-to-end request and event flow.
- [calculator-cases.md](./calculator-cases.md) — Calculator scenarios and expected outputs.

## Content & i18n
- [i18n-audit-report.md](./i18n-audit-report.md) — Translation coverage baseline.
- [i18n-check.md](./i18n-check.md) — How to run the i18n validation tooling.
- [i18n-deep-audit-2026-04.md](./i18n-deep-audit-2026-04.md) — Deep audit (Apr 2026) across the 6 supported languages.
- [i18n-quality-audit-2026-04.md](./i18n-quality-audit-2026-04.md) — Tone/quality review per language.
- [i18n-glossary.md](./i18n-glossary.md) — Authoritative glossary for fiscal/legal terms.
- [tax-content-annual-review.md](./tax-content-annual-review.md) — Yearly review of tax content.
- [banking-facts-2026.md](./banking-facts-2026.md) — Source-checked banking facts.
- [fact-check-2026.md](./fact-check-2026.md) / [veracity-audit.md](./veracity-audit.md) — Fact-checking notes.
- [blog/](./blog) — Editorial guidelines and per-article notes.

## SEO & indexing
- [audit-seo-technical.md](./audit-seo-technical.md) — Technical SEO audit (canonical, sitemap, robots, hreflang).
- [seo-audit-report.md](./seo-audit-report.md) — Functional SEO review.
- [seo-blog-audit.md](./seo-blog-audit.md) — Blog-specific SEO audit.
- [indexing-audit-2026-04.md](./indexing-audit-2026-04.md) — IndexNow + Google Indexing API status.
- [seo/](./seo) — Generated SEO artefacts.

## Design & UX
- [audit-design-system.md](./audit-design-system.md) — Design-system audit (tokens, components, dark mode).
- [screenshots/](./screenshots) — Reference screenshots used by audits.

## Security & operations
- [security-audit.md](./security-audit.md) — Helmet/CSP/HSTS/rate-limit posture.
- [observability-audit.md](./observability-audit.md) — Health, metrics, client errors, alerting.
- [audits/](./audits) — Point-in-time audit reports.
- [consolidation-2026-04.md](./consolidation-2026-04.md) — Repo consolidation log.

## Quality pipeline

A single command runs the full project quality check end-to-end and exits
non-zero if any step fails:

```bash
npm run check
```

It chains, in order: TypeScript (`tsc`), typography lint
(`lint:typography`), blog content lint (`lint:blog`), SEO link / slash /
meta checks (`seo:check`, `seo:slash`, `seo:meta`), i18n validation
(`i18n:check`), the script unit tests
(`test:seo-check`, `test:seo-slash`, `test:lint-blog`, `test:calculator`),
the Discord neon regression (`test:discord-neon`), and the newsletter
and booking end-to-end tests (`test:newsletter`, `test:booking`). The
E2E steps require `DATABASE_URL` to be set, exactly like `npm run dev`.

### Automatic enforcement

The same pipeline runs automatically on every change so regressions are
caught before they reach the live site:

- **CI (GitHub Actions)** — `.github/workflows/quality-pipeline.yml`
  runs `npm run check` end-to-end on every `push` and `pull_request`
  targeting `main`. The job spins up a PostgreSQL 16 service, bootstraps
  the schema via `drizzle-kit push` from `shared/schema.ts`, and a
  failure in any step blocks the merge with the failing script name in
  the log.
- **Local pre-push hook** — `bash exentax-web/scripts/install-git-hooks.sh`
  installs both a scoped `pre-commit` hook (i18n bundles only) and a
  `pre-push` hook that runs the full `npm run check` pipeline. The push
  is aborted on the first failing script. Bypass for a single push with
  `SKIP_QUALITY_CHECK=1 git push`.

## Brand policy — Discord notifications
All Discord embeds emitted by the server use **exclusively** the Exentax neon
green (`0x00E510`). The colour is forced inside `server/discord.ts:send()`,
so any caller-supplied colour is overridden. Severity is communicated via
title prefix only (🟢 info/business · 🟡 warning · 🔴 error). The
regression test `npm run test:discord-neon` enforces both the runtime
override and a static guard against re-introducing the legacy palette.
