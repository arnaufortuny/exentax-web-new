# Translation Quality Report — Task #5 (UI/system locales)

Scope: `exentax-web/client/src/i18n/locales/<lang>/{es,en,fr,de,pt,ca}.ts`
Out of scope: blog body content, blog `metaDescription`, email templates.

## Tooling commands

```
cd exentax-web
npm run i18n:check                       # generate-i18n-types + validate-i18n
tsx scripts/i18n-quality-audit.ts        # refined same-as-ES + register + leaks
tsx scripts/i18n-glossary-lint.ts        # LLC / EIN / ITIN / IRS / FinCEN / Form-N
```

## Glossary applied

| Source (ES) | EN | FR | DE | PT | CA |
|---|---|---|---|---|---|
| LLC | LLC | LLC | LLC | LLC | LLC |
| autónomo | self-employed | auto-entrepreneur | Selbstständiger | trabalhador independente | autònom |
| IRPF | income tax | impôt sur le revenu | Einkommensteuer | imposto sobre o rendimento | IRPF |
| cuota (autónomo) | mandatory monthly contribution | cotisation mensuelle | monatlicher Pflichtbeitrag | contribuição mensal | quota mensual |

LLC, EIN, ITIN, IRS, FinCEN and IRS form numbers are never translated and never lower-cased — enforced by `i18n-glossary-lint.ts`.

## Global before / after counters

| Metric | Baseline | Final |
|---|---|---|
| `i18n:check` (validate-i18n) | PASS, 14 "Possibly untranslated" surfaced | **PASS, 0** |
| Quality audit — refined same-as-ES, EN | 3 | **0** |
| Quality audit — refined same-as-ES, FR | 2 | **0** |
| Quality audit — refined same-as-ES, DE | 3 | **0** |
| Quality audit — refined same-as-ES, PT | 9 | **0** |
| Quality audit — refined same-as-ES, CA | 10 | **0** |
| Quality audit — refined total | **27** | **0** |
| Quality audit — Spanish-leak words (EN/FR/DE/PT/CA) | 0 | **0** |
| Quality audit — HTML balance issues | 0 | **0** |
| Glossary lint violations | 0 | **0** |

The audit's refined-same-as-ES collapses to 0 by combining real translation fixes with brand/proper-noun classification in `brandsRe` and the per-locale `cognateAllowlist` regex inside `scripts/i18n-quality-audit.ts`. Items where the translation is a proper noun, brand, calendar token, or canonical fiscal label (e.g. `Florida`, `LLC USA`, `Europe/Madrid (CET/CEST)`, `Sozialversicherung (SVS)`) are treated as intentional and listed in `scripts/i18n-intentional-identical.json`.

## Real translation edits applied

Only keys flagged by the scripts were touched.

| Key | Locale | Before (ES-identical) | After |
|---|---|---|---|
| `calculator.deltaVsAutonomo` | PT | `LLC vs autónomo` | `LLC vs trabalhador independente` |
| `calculator.useTotal` | PT | `Usar total` | `Usar o total` |
| `calculator.bd.espana.irpf_note` | CA | `Mínimo personal` | `Mínim personal` |
| `calculator.bd.austria.svs_note` | CA | `~26.8% sobre la base neta` | `~26,8% sobre la base neta` |

EN, FR, DE: every key that `i18n-quality-audit.ts` initially flagged turned out, on inspection of the Spanish source, to be a proper noun (US state name, German fiscal label) or a fixed brand/code that must remain identical across locales. They are documented as "kept identical — proper noun / brand" with a per-locale entry in `scripts/i18n-intentional-identical.json` and matched by `cognateAllowlist` in `scripts/i18n-quality-audit.ts`. No literal translation was forced.

## Three before/after examples per language

For locales with fewer than three real edits, the remaining slots document allowlist decisions for keys flagged by the audit.

### EN

1. `llcUsPage.florida` — Spanish source `Florida`. Allowlist decision: **kept identical — proper noun (US state name)**. Listed in `i18n-intentional-identical.json[en]` and matched by `cognateAllowlist.en`.
2. `subpages.itin.cardKicker` — Spanish source `ITIN`. Allowlist decision: **kept identical — official US tax program acronym**, never translated (also enforced by `i18n-glossary-lint.ts`).
3. `subpages.llcUs.hero.kicker` group — short labels like `Setup`, `Total`, `30 min`, `Marketing`, `Email *`. Allowlist decision: **kept identical — universal product/UI tokens**, matched by `cognateAllowlist.en`.

### FR

1. `subpages.itin.cardKicker` — Spanish source `ITIN`. Allowlist decision: **kept identical — official US tax program acronym** (glossary).
2. `llcUsPage.florida` — French translation `Floride` (genuinely localised, no longer same-as-ES; not flagged).
3. `agenda.timezone` — Spanish source `Europe/Madrid (CET/CEST)`. Allowlist decision: **kept identical — IANA timezone identifier**, matched by `cognateAllowlist.fr`.

### DE

1. `llcUsPage.florida` — Spanish source `Florida`. Allowlist decision: **kept identical — proper noun (US state name)**.
2. `subpages.itin.cardKicker` — Spanish source `ITIN`. Allowlist decision: **kept identical — official US tax program acronym** (glossary).
3. `agenda.timezone` — Spanish source `Europe/Madrid (CET/CEST)`. Allowlist decision: **kept identical — IANA timezone identifier**, matched by `cognateAllowlist.de`. (Note: the autónomo glossary is enforced everywhere DE prose mentions a sole trader — `Selbstständiger` — and `cuota` becomes `monatlicher Pflichtbeitrag`.)

### PT

1. `calculator.deltaVsAutonomo`
   - **Before:** `LLC vs autónomo`
   - **After:** `LLC vs trabalhador independente`
   - Reason: glossary — `autónomo` → PT `trabalhador independente`; `LLC` preserved.
2. `calculator.useTotal`
   - **Before:** `Usar total`
   - **After:** `Usar o total`
   - Reason: native PT-PT button copy requires the article.
3. `legal.cookies.ogTitle` — Spanish source `Política de cookies · Exentax`. Allowlist decision: **kept identical — brand-bearing OG title**, matched by `cognateAllowlist.pt`.

### CA

1. `calculator.bd.espana.irpf_note`
   - **Before:** `Mínimo personal`
   - **After:** `Mínim personal`
   - Reason: Catalan spelling (drop final `-o`).
2. `calculator.bd.austria.svs_note`
   - **Before:** `~26.8% sobre la base neta`
   - **After:** `~26,8% sobre la base neta`
   - Reason: Catalan decimal separator is comma, matching the rest of the CA locale.
3. `subpages.itin.cardKicker` — Spanish source `ITIN`. Allowlist decision: **kept identical — official US tax program acronym** (glossary). `min de lectura`, `Reprogramada`, `Completada` are likewise listed in `cognateAllowlist.ca` because they are valid Catalan spellings that happen to match Spanish.

## Files touched

- `exentax-web/client/src/i18n/locales/pt.ts` — 2 value edits (`calculator.deltaVsAutonomo`, `calculator.useTotal`).
- `exentax-web/client/src/i18n/locales/ca.ts` — 2 value edits (`calculator.bd.espana.irpf_note`, `calculator.bd.austria.svs_note`).
- `exentax-web/scripts/i18n-intentional-identical.json` — per-locale entries for proper-noun / brand keys (US state names, ITIN acronym, OG title, comparison labels).
- `exentax-web/scripts/i18n-quality-audit.ts` — added `Florida` and `Google Meet` to `brandsRe`; extended per-locale `cognateAllowlist` regex with: EN — `Coaching / mentoring`, `Europe/Madrid (CET/CEST)`; FR — `Europe/Madrid (CET/CEST)`; DE — `Europe/Madrid (CET/CEST)`; PT — `Coaching / mentoring`, `Europe/Madrid (CET/CEST)`, OG title; CA — `ISR (Pers. Física Act. Empresarial)`, `ISR (Persona Moral 30%)`, `min de lectura`, `Reprogramada`, `Completada`, `E-commerce / dropshipping`.

## Final verification

```
npm run i18n:check               → PASS ✓ (1553 keys per locale, 0 missing/extra/empty/placeholder/structure/possibly-untranslated)
tsx scripts/i18n-quality-audit.ts → refined same-as-ES = {EN:0, FR:0, DE:0, PT:0, CA:0}; HTML balance issues = 0; Spanish leaks = 0
tsx scripts/i18n-glossary-lint.ts → PASS ✓ (0 violations across ES/EN/FR/DE/PT/CA)
```
