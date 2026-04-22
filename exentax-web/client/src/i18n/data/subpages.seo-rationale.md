# Subpage SEO copy — per-language angles

This file documents the editorial angle each language uses in the SEO
`title` / `description` blocks of `subpages.ts` for the five service pages
(`llcNm`, `llcWy`, `llcDe`, `llcFl`, `itin`). The goal is to avoid a single
template translated six times: every market opens with a distinctive benefit
that resonates with searchers in that language.

The strict gate in `scripts/seo/verify-meta.ts` (titles 50–60 chars,
descriptions 145–160 chars, soft-CTA tail per language, no duplicates) still
applies — keep edits within those budgets.

## Per-language hooks

- **es (Spain / LATAM, hispanohablantes)** — ventaja fiscal directa.
  Abre con cifras concretas (0% impuesto estatal, charging order,
  Court of Chancery, mercado hispano de Miami).
- **en (international founders)** — scale and credibility.
  Lead with "low-cost privacy", "gold-standard asset protection",
  "VC-ready jurisdiction", "gateway to Latin America", "skip the IRS office".
- **ca (autònoms catalans)** — simplicitat i estalvi de paperasses.
  Abre amb "cost mínim", "blindatge patrimonial", "aixecar capital VC",
  "pont català cap al mercat llatí", "sense viatjar als EUA".
- **fr (freelances et nomades francophones)** — simplicité administrative
  et accès au marché US. Abre amb "zéro paperasse", "bouclier patrimonial",
  "prête pour la levée de fonds", "marché latino", "sans ambassade".
- **de (Selbstständige, Investoren)** — Vermögensschutz, Rechtssicherheit
  und Steueroptimierung. Öffnet mit "steueroptimiert",
  "Vermögensschutz nach US-Standard", "Rechtssicherheit für Investoren",
  "Tor zum lateinamerikanischen Markt", "ohne Botschaft".
- **pt (founders e freelancers brasileiros)** — dolarização e acesso ao
  mercado hispano de Miami. Abre com "estrutura enxuta",
  "blindagem patrimonial premium", "pronta para investidores e M&A",
  "ponte para o mercado de Miami", "sem viajar aos EUA".

## Per-page angle matrix

| Page  | es                              | en                                  | ca                                | fr                                  | de                                       | pt                                       |
| ----- | ------------------------------- | ----------------------------------- | --------------------------------- | ----------------------------------- | ---------------------------------------- | ---------------------------------------- |
| llcNm | 0% impuesto estatal             | low-cost privacy, solo founders     | cost mínim, sense paperasses      | zéro paperasse annuelle             | steueroptimiert für Selbstständige       | estrutura enxuta e barata                |
| llcWy | blindaje patrimonial líder      | gold-standard asset protection      | blindatge patrimonial dels EUA    | bouclier patrimonial américain      | Vermögensschutz nach US-Standard         | blindagem patrimonial premium            |
| llcDe | favorita de los inversores      | choice of VCs and B2B buyers        | per aixecar capital VC            | prête pour la levée de fonds        | Rechtssicherheit für Investoren          | pronta para investidores e M&A           |
| llcFl | puerta al mercado hispano Miami | gateway to Miami's Latin market     | pont català cap al mercat llatí   | accès direct au marché latino       | Tor zum lateinamerikanischen Markt       | ponte para o mercado de Miami            |
| itin  | sin viajar a EE. UU.            | without leaving home, skip the IRS  | sense viatjar als EUA             | sans ambassade, géré à distance     | ohne Botschaft, alles aus einer Hand     | sem viajar aos EUA                       |

## Editing rules for future passes

1. Keep the per-language hook above as the description's opener; do not
   revert to a literal translation of the Spanish copy.
2. Run `npx tsx scripts/seo/verify-meta.ts` after any change — the strict
   subpage gate must stay green (titles 50–60, descriptions 145–160, soft
   CTA, no duplicates across the global SEO index).
3. The soft-CTA endings allowed per language are listed in
   `SUBPAGE_CTA_ENDINGS` inside the verifier. Pick one that fits the angle
   instead of always closing with the same phrase.
4. When adding a new language, define its own hook per page before copying
   any other language's wording.
