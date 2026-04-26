# Blog translation triage — PT-BR + duplicated paragraphs

Date: 2026-04-26 · Maintainer: Exentax web team
Source: `node scripts/blog-translation-quality-audit.mjs --check`
Logged at: `/tmp/blog-tq-audit.log`
Generated report: `docs/auditoria-multiidioma/blog-translation-quality.{json,md}`

---

## 0. Audit run output (current)

```
$ cd exentax-web && node scripts/blog-translation-quality-audit.mjs --check
blog-translation-quality-audit --check: REPORT-ONLY
  (PT-BR hits: 0 in 0 files;
   duplicate paragraphs: 0 in 0 files)
```

The audit is **clean as of this run** (2026-04-26). The historical
counts referenced in `docs/internal/PENDING.md §10` (4 PT-BR hits, 93
duplicate paragraphs in 52 files) were closed by:

- Duplicate paragraphs: `scripts/dedup-consecutive-paragraphs.mjs`
  in commit `8a63855` and follow-up — see PENDING.md §1 (Alta).
  Final state: 0 dups in 0 files.
- PT-BR hits: cleared during the LOG-BATCH-3 editorial pass on the
  PT articles (Sesión 20, 2026-04-25) when local jurisdiction
  blocks were rewritten in PT-PT register.

This triage document therefore records the **historical findings**
plus the audit policy going forward. If the audit reports new hits
in a future run, append them in §1 / §2 below and re-classify under
§3.

## 1. PT-BR hits

**Current count: 0 hits in 0 files** (audit run 2026-04-26).

Historical reference (4 hits in 3 files, per
`PENDING.md §10` and §2 of the same file, both now resolved):

| # | File:line | Offending PT-BR phrase | PT-PT replacement | Status |
|---|---|---|---|---|
| 1 | `client/src/data/blog-content/pt/*.ts` (cleared in LOG-BATCH-3) | `o registro` | `o registo` | **FIXED** |
| 2 | `client/src/data/blog-content/pt/*.ts` (cleared in LOG-BATCH-3) | `pode se registrar` | `pode registar-se` (ênclise PT-PT) | **FIXED** |
| 3 | `client/src/data/blog-content/pt/*.ts` (cleared in LOG-BATCH-3) | `equipe` | `equipa` | **FIXED** |
| 4 | `client/src/data/blog-content/pt/*.ts` (cleared in LOG-BATCH-3) | `o fato de` | `o facto de` | **FIXED** |

The exact file:line per hit is no longer recoverable from the audit
output (the report is regenerated in place and the previous JSON was
overwritten with a clean run). The substitution rules above cover
every hit the lint catches; see `scripts/audit-pt-pt.mjs` for the
authoritative pattern set.

## 2. Duplicated paragraphs

**Current count: 0 occurrences in 0 files** (audit run 2026-04-26).

Historical reference (93 occurrences in 52 files, per
`PENDING.md §1` Alta — `**CERRADO**`):

The 93 historical duplicates were grouped by article slug across
the six locales. The dedup script removed them in two passes; the
script is **idempotent** (re-running on a clean tree is a no-op).

Because all 93 were resolved before this triage was authored, the
slug-by-slug grouping is no longer present in the live audit JSON.
For archaeological purposes the dedup commit (`8a63855` + follow-up)
contains the full diff; recover with:

```
git show 8a63855 -- 'client/src/data/blog-content/**/*.ts' | head -200
```

If the audit reports new duplicates in a future run, group them
here under the article slug (e.g. `## crs-residentes-espana-latam`)
with one row per `{file, paragraph index}` and the first 60 chars
of the duplicate text for identification.

## 3. Triage decision

Decision rules applied across the historical findings; same rules
apply to any future hits.

| Finding type | Rule | Status |
|---|---|---|
| Duplicate where the repeat is **intentional** (CTA repeats, contact-info echoes, "as we said in the introduction" rephrasing) | `KEEP — intentional` | n/a (none currently flagged) |
| Duplicate that is a **true editorial duplicate** (same paragraph copy-pasted by an LLM) | `FIX — manual edit needed` | All 93 historical: **FIXED** by dedup script |
| **PT-BR hit** in a `pt/*` blog file or in `pt.ts` SEO blurb | `FIX — replace with PT-PT equivalent` | All 4 historical: **FIXED** in LOG-BATCH-3 |

For the dedup CTA-buffer-aware logic, the script
`scripts/dedup-consecutive-paragraphs.mjs` distinguishes a real
editorial duplicate from a deliberate CTA echo by looking for the
inline `<!-- exentax:cta-* -->` markers; the buffer protects them
automatically. New duplicates introduced inside CTA buffers are
**KEEP — intentional** by construction.

## 4. Action plan

> **Sesión dedicada de 2 h, 1 reviewer, prioridad cuando se contrate
> el reviewer PT del Task G1** (ver `docs/internal/translator-brief.md`).

The audit is currently green, so the next session is **preventive**
rather than corrective: the PT reviewer (per the translator-brief)
re-runs the audit, validates the PT-PT substitution rules in
`scripts/audit-pt-pt.mjs` are still aligned with the editorial
register, and reviews the dedup CTA-buffer rules for false positives.
Effort: 2 hours, single PT reviewer, no code changes expected
beyond pattern tuning if any new PT-BR variant is found in the wild.
