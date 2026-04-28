# Translation Quality Report — Exentax (6 locales)

_Last refresh: 2026-04-25 (Task #5 closing snapshot)_

This document is the canonical, point-in-time view of translation quality for
the six product locales (`es`, `en`, `fr`, `de`, `pt`, `ca`). It is generated
from the existing automated audits and is regenerated whenever any of the
audits change. Every metric below is reproducible locally with the commands
listed in the **How to reproduce** section.

> Source of truth: `npm run i18n:check` + `npx tsx scripts/i18n/i18n-quality-audit.ts`
> + `npx tsx scripts/i18n/i18n-glossary-lint.ts`. The calculator surface (regime
> labels, currency labels, period switchers) is intentionally kept in Spanish
> across locales by product decision and is excluded from "untranslated" gates
> via `scripts/i18n-intentional-identical.json` and the per-locale cognate
> allowlists in `scripts/i18n/i18n-quality-audit.ts`.

---

## 1. Headline status

| Gate                              | Status |
|-----------------------------------|--------|
| Missing keys (any locale)         | 0      |
| Extra keys (any locale)           | 0      |
| Empty values (any locale)         | 0      |
| Placeholder mismatches            | 0      |
| Structure mismatches              | 0      |
| Glossary violations (6 locales)   | 0      |
| Hardcoded i18n attribute violations | 0    |
| Possibly untranslated (allowlisted) | 8    |
| Spanish leaks into other locales  | 0      |
| Register coherence conflict-keys  | 0      |
| Refined "same-as-ES" cognates flagged | 0  |

`npm run i18n:check` → **PASS**.
`npm run lint:blog` → **PASS**.
`npm run blog:validate-all` → **PASS** (13/13 steps).
`npx tsc --noEmit` → **PASS**.

---

## 2. Locale sizes

| Locale | Lines (`client/src/i18n/locales/<lang>.ts`) |
|--------|---------------------------------------------|
| `es`   | 2,765 (master / source of truth)            |
| `en`   | 2,337                                       |
| `fr`   | 2,340                                       |
| `de`   | 2,339                                       |
| `pt`   | 2,343                                       |
| `ca`   | 2,344                                       |

ES is the master locale. All other locales must mirror its key tree exactly
(`Total missing keys: 0` confirms this).

---

## 3. Register coherence (formality)

The audit walks every long string in every locale and counts informal vs
formal markers (e.g. `tú/tu/tus` vs `usted/su/le`). A "conflict-key" is a
single string that mixes both registers in a way the audit cannot otherwise
allow-list.

| Locale | Informal markers | Formal markers | Conflict keys |
|--------|------------------|----------------|---------------|
| `es`   | 513              | 19             | **0**         |
| `en`   | n/a (English does not carry T/V distinction) | n/a | 0 |
| `fr`   | 0                | 1,052 (vouvoiement) | 0          |
| `de`   | 0                | 1,244 (Sie-Form)    | 0          |
| `pt`   | 0                | 659 (terceira pessoa formal) | 0 |
| `ca`   | 482 (segona persona) | 12         | 0          |

**Notes**

- ES is intentionally informal-leaning ("tú") with formal-leaning legal copy
  — by product decision. The 19 formal markers are concentrated in the legal
  pages and the audit confirms the two registers do not collide inside the
  same string.
- CA mirrors ES (informal "tu" by product decision) and shows the same
  pattern at a slightly smaller scale.
- FR, DE and PT are 100% formal address as required by their target
  audiences (vouvoiement / Sie-Form / terceira pessoa).

The single residual ES conflict (`legal.reembolsos.body` — "Si elige
corrección, …") was rewritten to "Si opta por la corrección, la ejecutamos
en máximo 15 días" so the formal voice stays intact end-to-end. The earlier
"(usted elige)" parenthetical was rewritten to "(a su elección)" for the
same reason.

---

## 4. Glossary discipline

`npx tsx scripts/i18n/i18n-glossary-lint.ts` enforces, per locale, a small set of
must-use / must-not-use terms (e.g. PT must say "trabalhador independente"
not "autônomo", DE must say "LLC" not "GmbH" when referring to the US
entity, etc.).

| Locale | Violations |
|--------|------------|
| `es`   | 0          |
| `en`   | 0          |
| `fr`   | 0          |
| `de`   | 0          |
| `pt`   | 0          |
| `ca`   | 0          |

**Notes**

- Two PT keys were updated this cycle to maintain the glossary:
  `calculator.deltaVsAutonomo` → "LLC vs trabalhador independente" and
  `calculator.useTotal` → "Utilizar total".
- The accompanying allowlist hygiene check (`stale allowlist entries`)
  removed `pt:calculator.useTotal` from
  `scripts/i18n-intentional-identical.json` because the value is no longer
  identical to ES.

---

## 5. "Same-as-ES" surface (untranslated risk)

`scripts/i18n/i18n-quality-audit.ts` produces a refined "same-as-ES" list per
locale that excludes numerics, URLs, brand strings, and per-locale
cognates. The cognate allowlist is encoded as a regex per locale at the top
of that script.

| Locale | Refined same-as-ES (after cognate allowlist) |
|--------|----------------------------------------------|
| `en`   | 0                                            |
| `fr`   | 0                                            |
| `de`   | 0                                            |
| `pt`   | 0                                            |
| `ca`   | 0                                            |

The 27 keys flagged at session start were resolved as follows:

- **Real translations** (2 keys): `pt:calculator.deltaVsAutonomo`,
  `pt:calculator.useTotal`.
- **Generic brand / technical-literal cognates** (~20 keys):
  registered in the per-locale `cognateAllowlist` regex inside
  `scripts/i18n/i18n-quality-audit.ts`. These are values that may legitimately
  appear under several keys (`Florida`, `Google Meet`, `min de lectura`,
  `Reprogramada`, `Completada`, the ISR-Mexicano labels, `~26,8% sobre
  base neta`, `E-commerce / dropshipping`, etc.).
- **Unique key-bound identicals** (5 PT keys + already-listed
  EN counterparts): registered in the per-key allowlist
  `scripts/i18n-intentional-identical.json` and consumed by both the
  validate-i18n gate and the quality audit. Specifically added in this
  cycle: `pt:legal.cookies.ogTitle` (brand OG string),
  `pt:subpages.llc{Nm,Wy,De,Fl}.comparison.youLabel` ("Esta página" — PT
  literal cognate of the ES form). `pt:agenda.timezone` and
  `en:calculator.activityLabels.coachingMentoring` were already present.

The 8 entries still surfaced by `npm run i18n:check` under "Possibly
untranslated" are all in the calculator surface (regime labels, period
switchers, currency labels) and are explicitly allow-listed in
`scripts/i18n-intentional-identical.json`. They are kept identical across
locales by product decision.

---

## 6. Validation pipeline (CI gates)

| Gate                                | Command                                  | Status |
|-------------------------------------|------------------------------------------|--------|
| i18n schema + allowlist hygiene     | `npm run i18n:check`                     | PASS   |
| Glossary discipline (6 locales)     | `npx tsx scripts/i18n/i18n-glossary-lint.ts`  | PASS   |
| Quality audit (leaks/register/cognates) | `npx tsx scripts/i18n/i18n-quality-audit.ts` | PASS   |
| Blog content + CTA copy lock        | `npm run lint:blog`                      | PASS   |
| Full blog topology suite (13 steps) | `npm run blog:validate-all`              | PASS   |
| TypeScript                          | `npx tsc --noEmit`                       | PASS   |

---

## 7. How to reproduce

```bash
cd exentax-web

# Quality + glossary
npm run i18n:check
npx tsx scripts/i18n/i18n-quality-audit.ts
npx tsx scripts/i18n/i18n-glossary-lint.ts

# Blog + topology + types
npm run lint:blog
npm run blog:validate-all
npx tsc --noEmit
```

Audit artefacts (raw JSON dumps) are written to `exentax-web/.local-audit/`:

- `flat-locales.json` — flattened key/value map per locale.
- `leaks.json` — Spanish-word leaks into non-ES locales.
- `register-stats.json` — per-locale informal/formal marker counts.
- `refined-same-as-es.json` — final "same-as-ES" list after cognate allowlist.
- `html-issues.json` — HTML balance issues inside translated values.
- `term-stats.json` — glossary term frequency counters.

These artefacts are gitignored — they are produced fresh on every audit run
and are intended for local inspection only.

---

## 8. Allowlists policy (intentional-identical)

Two complementary allowlists exist. They are now wired together so the
key-scoped list is the single source of truth for unique strings, while
the regex stays for value-shaped patterns that are reusable across keys.

- **`scripts/i18n-intentional-identical.json`** — per-locale list of keys
  whose value is **intentionally identical to ES** (calculator surface,
  brand literals, etc.). Consumed by:
  - `npm run i18n:check` (silences the "Possibly untranslated" gate).
  - `npx tsx scripts/i18n/i18n-quality-audit.ts` (silences refined-same-as-ES
    for those exact keys; integrated this cycle for auditability).
  Stale entries (no longer identical to ES) are surfaced by the script's
  "Allowlist Hygiene" section and must be removed.
- **`cognateAllowlist`** (regex per locale, inside
  `scripts/i18n/i18n-quality-audit.ts`) — per-locale list of value-shaped
  patterns (brands, technical literals, registry labels) that exist with
  the same form in both ES and the target locale. Use this only when the
  value can legitimately appear under several keys; for unique strings
  prefer the per-key list above.

**Authoring rule (this cycle):** when in doubt, add to
`i18n-intentional-identical.json` (per-key, surgical, auditable). The
regex is reserved for genuinely reusable label patterns. Adding a new
entry to either list requires a one-line justification in the PR
description. Removing an entry requires confirmation that the underlying
string has been retranslated.
