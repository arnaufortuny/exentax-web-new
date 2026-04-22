# QA Report — Task #37

**Scope:** Regenerate `audits/traducciones-mejoradas.json` and `audits/markdown-quality.json`,
apply the corresponding native-translation corrections (preserving formal `Sie` /
`vous` / `o senhor` / `vostè`) and markdown fixes across
`client/src/data/blog-content/**`, then verify the i18n and blog quality checks.

**Date:** 2026-04-22
**Repo subtree:** `exentax-web/`

---

## 1. Deliverables

| # | Artifact | Path | Status |
|---|---|---|---|
| 1 | Markdown-quality auditor script | `exentax-web/scripts/audit-markdown-quality.mjs` | NEW — dry-run + `--fix` modes, preserves historical `fixesApplied` block on dry-run |
| 2 | Markdown-quality audit | `exentax-web/audits/markdown-quality.json` | REGENERATED — all-zero summary; historical fix log preserved |
| 3 | Translation-improvements audit | `exentax-web/audits/traducciones-mejoradas.json` | REGENERATED — 52 corrections itemised, full verification block |
| 4 | i18n / locale corrections | `client/src/i18n/data/subpages.ts`, `client/src/i18n/locales/{de,fr,pt,ca}.ts`, `scripts/i18n-intentional-identical.json`, `client/src/components/blog/ArticleCTA.tsx` | APPLIED |

---

## 2. Verification matrix

| Check | Command | Result |
|---|---|---|
| i18n parity / placeholders / phantoms | `npm run i18n:check` | **PASS** — 0 missing, 0 extra, 0 empty, 0 placeholder mismatches, 0 structural mismatches, 0 phantom keys |
| Static type-check (full project) | `npx tsc --noEmit -p exentax-web/tsconfig.json` | **PASS** — 0 errors |
| Markdown quality re-audit | `node exentax-web/scripts/audit-markdown-quality.mjs` | **PASS** — all-zero counts |
| Blog content lint | `node scripts/blog-content-lint.mjs` (via `blog-validate-all`) | **OK** |
| Locale link leak | (via `blog-validate-all`) | **OK** |
| CTA presence | (via `blog-validate-all`) | **OK** |
| Data | (via `blog-validate-all`) | **OK** |
| FAQ JSON-LD | (via `blog-validate-all`) | **OK** |
| Sitemap | (via `blog-validate-all`, requires dev server on :5000) | **OK** |
| Sitemap BCP-47 | (via `blog-validate-all`) | **OK** |
| Masterpiece audit | (via `blog-validate-all`) | **OK** — mean score 99/100 across 666 articles |
| Workflow `Start application` | restart + boot | **OK** — Express listens on :5000, DB initialised, legal versions seeded |

### Pre-existing failures (untouched, out of scope)

These three steps inside `blog-validate-all.mjs` were already failing before
this task and were explicitly noted in the project goal as out of scope:

| Failing step | Pre-existing root cause |
|---|---|
| `consistency` | 1 orphan i18n mapping covering ~150 slug variants (`BLOG_SLUG_I18N` ↔ ES content parity). |
| `internal-links` | 944 broken intra-blog `/[locale]/blog/...` links across 666 article files. |
| `sources` | External AEAT URL for *Modelo 349* returns HTTP 404. Already documented as failing in `docs/seo/blog-sources-canonical.md` row 18. |

None of these were introduced or worsened by this task.

---

## 3. Translation corrections (52 total)

Full per-key list lives in `audits/traducciones-mejoradas.json`. Summary:

| Locale | Count | Categories |
|---|---|---|
| **de** | 38 | Register formalisation across the entire ITIN subpage, all four LLC nav cards, all four LLC hero `h1`, ITIN nav strings, and `links.sub*` lines. Every `du / dein / deine` rewritten to `Sie / Ihr / Ihre`. |
| **fr** | 9 | ITIN subpage and ITIN nav strings: `tu / ton / ta` → `vous / votre`. |
| **pt** | 3 | (a) `blogPost.countryFilterHint`: `teu` → `seu`; (b) `agenda.equipa` → `agenda.time` (canonical key restored); (c) `booking.atTime` placeholder `{{equipa}}` → `{{time}}` (canonical placeholder restored). |
| **ca** | 2 | (a) `calculator.bd.italia.ires`: missing Catalan accent added (`societaria` → `societària`). (b) `calculator.bd.italia.dividendi`: Castilian leak `dividendos` replaced with Catalan plural `dividends`. |

Categories:

- `registerFormalisation` — 47
- `nativeSpelling` — 2 (Catalan accent, German `Ihre`)
- `languageLeak` — 1 (Castilian word inside Catalan locale)
- `keyRename` — 2 (PT canonical key/placeholder restoration)

### Side fixes

- Removed stale allowlist entry `calculator.bd.italia.ires` from
  `scripts/i18n-intentional-identical.json` (it now legitimately differs from ES).
- Removed phantom `t("blogPost.ctaSecondary", …)` from
  `client/src/components/blog/ArticleCTA.tsx`; the existing `ctaBook` fallback
  is now used directly. This eliminates the long-standing phantom-key warning.

### Register and key-parity safety net

Spot checks performed after the edits:

- `subpages.ts` DE block: no remaining `du / dein / deine` second-person forms in
  any of the edited subpages (LLC NM/WY/DE/FL hero + nav + ITIN + links).
  False positives that remain are inside the FR block (`du`, `du stock`,
  `du W-7` are French articles, not German pronouns).
- `subpages.ts` FR ITIN block: no remaining `tu / ton / toi` second-person
  forms. The FR block consistently uses `vous / votre`.
- All ICU placeholders (`{country}`, `{amount}`, `{n}`, `{date}`, `{time}`, …)
  are now identical across every locale (verified by `i18n:check`).

---

## 4. Markdown corrections (94 files)

`scripts/audit-markdown-quality.mjs --fix` was run once across
`client/src/data/blog-content/{es,en,fr,de,pt,ca}/*.ts`. It applied:

- **201** trailing-whitespace lines stripped.
- **145** stray curly apostrophes (`’`) inside ASCII-quoted strings normalised to
  ASCII apostrophes so a single string never mixes both styles.

Categories with **zero** findings before and after:

- Heading-level jumps (`H{n} → H{n+2}`).
- Mixed list markers within a single block (`-`, `*`, `+`).
- Broken intra-document `#anchor` links.

### Auditor design notes

- Reads each blog file, unwraps the `export default \`…\`` template literal,
  strips fenced code blocks, then evaluates the remaining markdown body.
- `--fix` is idempotent: a second invocation makes no changes.
- A bare invocation (no `--fix`) is a pure dry-run that **preserves** the
  historical `fixesApplied` block in `audits/markdown-quality.json` so the audit
  artifact retains its provenance.

---

## 5. Files changed in this task

```
exentax-web/audits/QA-REPORT.md                                NEW (this file)
exentax-web/audits/markdown-quality.json                       NEW
exentax-web/audits/traducciones-mejoradas.json                 NEW
exentax-web/scripts/audit-markdown-quality.mjs                 NEW
exentax-web/scripts/i18n-intentional-identical.json            EDIT (drop stale CA italia.ires entry)
exentax-web/client/src/i18n/data/subpages.ts                   EDIT (DE/FR formal register)
exentax-web/client/src/i18n/locales/de.ts                      EDIT (links.sub*)
exentax-web/client/src/i18n/locales/pt.ts                      EDIT (countryFilterHint, agenda.time, booking.atTime)
exentax-web/client/src/i18n/locales/ca.ts                      EDIT (italia.ires accent, italia.dividendi leak)
exentax-web/client/src/components/blog/ArticleCTA.tsx          EDIT (drop phantom ctaSecondary)
exentax-web/client/src/data/blog-content/**/*.ts               EDIT (whitespace + apostrophe normalisation, 94 files)
```

---

## 6. Follow-ups proposed

| Ref | Title | Why deferred |
|---|---|---|
| #53 | *Polish remaining cognate translations flagged as 'possibly untranslated'* | 14 cognate strings (`Cookies`, `Hora`, status labels, "5 min read") need editorial decisions per key — outside the 50-string scope of this task. |
| #54 | *Remove the long-standing phantom 'blogPost.ctaSecondary' key* | Already resolved in this task; will be marked obsolete on review. |
