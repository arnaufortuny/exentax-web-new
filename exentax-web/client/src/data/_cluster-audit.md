# Blog cluster & cannibalization audit

_Last updated: 2026-04-16 (Task #23)_

This document is the canonical reference for the topical positioning of every
article in `blog-posts.ts`. It exists so that no two articles compete for the
same Google query and so that overlapping content gets consolidated into a
single canonical page with internal links from the rest.

> **How to use this file**
> - Before publishing or rewriting an article, find its row in §2 and respect
>   the documented primary keyword and angle.
> - Before adding a paragraph that already lives in another article, check §3
>   and instead link to the canonical page.
> - When adjusting `metaTitle` / `metaDescription` (Spanish in
>   `blog-posts.ts`, the other 5 languages in `blog-posts-i18n.ts`), keep them
>   aligned with the angle column below.

---

## 1. Summary

- **Articles audited:** 67 (Spanish source) × 6 languages = 402 URLs.
- **Clusters with cannibalization risk:** 8.
- **Worst offenders (Spanish meta updated in this task):**
  - Mercury setup vs. banking ecosystem vs. fintech-vs-banks comparison were
    all targeting the same multi-tool query → narrowed each meta to its own
    angle.
  - Pass-through mechanics vs. "0% taxes legally" were both ranking for
    "pagar 0 impuestos LLC" → split into mechanics vs. feasibility.
  - "Why open an LLC" vs. "Pros and cons of an LLC" were both pros listings
    → split into 5-pillar strategic case vs. honest pros/cons.
  - "Separar finanzas personales" was a Mercury/Relay/Slash/Wallester listing
    → tightened to the principle and risks (corporate veil, Form 5472, audit
    risk).

---

## 2. Article registry — primary keyword & angle

Format: `slug` → primary keyword (Spanish) → angle (one sentence).

### Foundations & getting started
- `llc-estados-unidos-guia-completa-2026` → "LLC Estados Unidos guía" → **canonical pillar** for the whole topic, broad overview.
- `constituir-llc-proceso-paso-a-paso` → "constituir LLC paso a paso" → operational walkthrough, no opinion.
- `cuanto-cuesta-constituir-llc` → "cuánto cuesta constituir LLC" → cost-only, line-by-line breakdown.
- `por-que-abrir-llc-estados-unidos-ventajas` → "por qué abrir LLC EE.UU." → the **5-pillar strategic case** (jurisdiction, privacy, infra, fiscal, reputation). Not an exhaustive pros list.
- `ventajas-desventajas-llc-no-residentes` → "ventajas y desventajas LLC" → **honest pros AND cons**, including who should NOT open one.
- `nuevo-mexico-vs-wyoming-vs-delaware` → "Nuevo México Wyoming Delaware LLC" → state-comparison matrix.
- `primer-mes-llc-que-esperar` → "primer mes LLC" → week-by-week timeline post-formation.
- `como-operar-llc-dia-a-dia` → "operar LLC día a día" → recurring operational rhythm.
- `documentos-llc-cuales-necesitas` → "documentos LLC" → list of artifacts (Articles, EIN letter, OA, BOI, etc.) and where each is used.
- `mantenimiento-anual-llc-obligaciones` → "mantenimiento anual LLC" → calendar of annual obligations + costs.
- `problemas-comunes-llc-como-evitarlos` → "problemas LLC" → 7 real client incidents, prevention.

### Identifiers, agents, governance
- `ein-numero-fiscal-llc-como-obtenerlo` → "EIN LLC" → the EIN itself, end to end.
- `itin-ssn-que-son-como-obtenerlos` → "ITIN SSN LLC" → comparison of EIN/ITIN/SSN, when each is needed.
- `registered-agent-que-es-por-que-necesitas` → "registered agent LLC" → role, cost, picking one.
- `operating-agreement-llc-que-es` → "operating agreement LLC" → governance document.
- `que-es-irs-guia-duenos-llc` → "qué es el IRS" → glossary-style intro to the IRS for non-residents.

### Banking & fintech (heavy cannibalization risk — see §3)
- `cuenta-bancaria-mercury-llc-extranjero` → "cuenta Mercury LLC" → **Mercury onboarding only**.
- `wise-business-llc-guia` → "Wise Business LLC" → **Wise onboarding & multi-currency** only.
- `bancos-vs-fintech-llc-donde-abrir-cuenta` → "bancos vs fintech LLC" → **comparison framework**, not a tool tutorial.
- `separar-dinero-personal-llc-por-que-importa` → "separar dinero personal LLC" → **the principle** (corporate veil, audit risk), not a tool list.
- `due-diligence-bancario-llc-americana` → "due diligence bancario LLC" → what banks check at onboarding.
- `evitar-bloqueos-mercury-wise-revolut` → "evitar bloqueos Mercury Wise Revolut" → freeze-prevention checklist.
- `pasarelas-pago-llc-stripe-paypal-dodo` → "pasarelas de pago LLC" → Stripe / PayPal / Adyen / DoDo comparison.
- `cambiar-divisas-llc-mejores-opciones` → "cambiar divisas LLC" → FX cost comparison.
- `tiempos-pagos-ach-wire-transfer` → "ACH vs wire LLC" → settlement timelines.
- `iban-swift-routing-number-que-son` → "IBAN SWIFT routing number" → glossary.

### Taxation core (federal mechanics)
- `tributacion-pass-through-llc-como-funciona` → "tributación pass-through LLC" → **how the mechanism works** (Disregarded Entity, attribution).
- `pagar-cero-impuestos-legalmente-llc` → "pagar 0 impuestos LLC" → **when 0% is and isn't possible**, three legal scenarios.
- `gastos-deducibles-llc-que-puedes-deducir` → "gastos deducibles LLC" → expense list + IRS limits.
- `residentes-no-residentes-llc-diferencias` → "LLC residente vs no residente" → tax treatment fork.
- `extension-irs-form-1120-como-solicitarla` → "Form 7004 extensión 1120" → procedural.
- `form-5472-que-es-como-presentarlo` → "Form 5472" → procedural (mandatory filing).
- `boi-report-fincen-guia-completa-2026` → "BOI Report FinCEN" → procedural.

### Country & residency angle
- `fiscalidad-llc-por-pais-residencia` → "fiscalidad LLC por país" → ES/MX/CO/AR matrix.
- `boe-febrero-2020-llc-doctrina-administrativa` → "doctrina DGT TEAC LLC" → Spanish jurisprudence.
- `autonomo-espana-vs-llc-estados-unidos` → "autónomo España vs LLC" → numerical comparison.
- `autonomos-espana-por-que-dejar-de-serlo` → "dejar de ser autónomo España" → motivational + alternatives (LLC, Beckham, sociedad).
- `errores-fiscales-freelancers-espanoles` → "errores fiscales freelancers España" → 10 mistakes.
- `impuestos-clientes-internacionales-espana` → "impuestos clientes internacionales España" → IVA/IRPF for international invoicing.
- `nomada-digital-residencia-fiscal` → "nómada digital residencia fiscal" → 183-day rule + favourable jurisdictions.

### International tax design
- `fiscalidad-internacional-emprendedores-digitales` → "fiscalidad internacional emprendedores" → conceptual map (residency, source, EP, BEPS).
- `estructura-fiscal-optima-freelancer-internacional` → "estructura fiscal óptima freelancer" → comparative scoring of structures.
- `diseno-estructura-fiscal-internacional-solida` → "estructura fiscal internacional sólida" → 6-step design framework.
- `riesgos-fiscales-mala-estructuracion-internacional` → "riesgos estructura fiscal internacional" → 6 anti-patterns (simulation, CFC, treaty shopping…).
- `por-que-no-abrir-empresa-estonia` → "Estonia vs LLC EE.UU." → why Estonian OÜ usually loses.

### CRS / FATCA / reporting
- `crs-cuentas-bancarias-llc-intercambio-informacion` → "CRS LLC" → **canonical CRS+FATCA overview**.
- `cuentas-bancarias-usa-reportan-hacienda-verdad` → "cuentas USA reportan hacienda" → focused on the question "do US banks report?".
- `crs-residentes-espana-latam-implicaciones` → "CRS España LATAM" → regional implications.
- `revolut-business-crs-reporting-fiscal` → "Revolut Business CRS" → vendor-specific.
- `wise-business-crs-reporting-fiscal` → "Wise Business CRS" → vendor-specific.
- `dac7-plataformas-digitales-reporting-2026` → "DAC7 plataformas digitales" → procedural.
- `dac8-criptomonedas-reporting-fiscal-2026` → "DAC8 criptomonedas" → procedural.
- `prevencion-blanqueo-capitales-llc` → "AML LLC" → BSA/CTR/SAR + KYC, distinct from CRS.

### Legal & risk
- `llc-seguridad-juridica-proteccion-patrimonial` → "LLC protección patrimonial" → charging order, piercing the veil.
- `privacidad-llc-americana-secreto-ventaja` → "privacidad LLC" → privacy vs anonymity, NM/WY/DE detail.
- `testaferros-prestanombres-llc-ilegal-riesgos` → "testaferros LLC" → why nominees are fraud, legal alternatives.

### Verticals (LLC for X)
- `llc-creadores-contenido-youtube-twitch` → "LLC creadores contenido"
- `llc-agencias-marketing-digital` → "LLC agencias marketing digital"
- `llc-desarrolladores-software-saas` → "LLC desarrolladores SaaS"
- `amazon-ecommerce-llc-vender-online` → "LLC Amazon ecommerce"
- `criptomonedas-trading-llc-impuestos` → "LLC criptomonedas trading"
- `tributacion-llc-segun-actividad-economica` → "tributación LLC actividad" → cross-vertical fiscal comparison (canonical for "how does activity X tax").
- `escalar-negocio-digital-llc-americana` → "escalar negocio digital LLC" → growth playbook.
- `iva-servicios-digitales-internacional` → "IVA servicios digitales internacional" → VAT rules across B2B/B2C/OSS.

---

## 3. Cannibalization clusters & canonicalization

For each cluster: the **canonical** article owns the head term; the others
must (a) target their distinct angle and (b) link to the canonical instead of
restating the shared paragraph.

### Cluster A — "0% federal / pass-through" mechanics
- **Canonical (mechanics):** `tributacion-pass-through-llc-como-funciona`
- **Canonical (legality across scenarios):** `pagar-cero-impuestos-legalmente-llc`
- Other articles touching the topic must summarize in ≤2 sentences and link to one of the canonicals:
  - `por-que-abrir-llc-estados-unidos-ventajas`
  - `ventajas-desventajas-llc-no-residentes`
  - `residentes-no-residentes-llc-diferencias`
  - `gastos-deducibles-llc-que-puedes-deducir`
  - `autonomo-espana-vs-llc-estados-unidos`
  - `errores-fiscales-freelancers-espanoles`
  - all "LLC for X" verticals

### Cluster B — Banking setup
- **Canonical (Mercury):** `cuenta-bancaria-mercury-llc-extranjero`
- **Canonical (Wise):** `wise-business-llc-guia`
- **Canonical (banks vs fintech overview):** `bancos-vs-fintech-llc-donde-abrir-cuenta`
- **Canonical (separation principle):** `separar-dinero-personal-llc-por-que-importa`
- **Canonical (onboarding compliance):** `due-diligence-bancario-llc-americana`
- **Canonical (freeze prevention):** `evitar-bloqueos-mercury-wise-revolut`
- Articles that previously listed Mercury+Slash+Wallester+Wise as a generic "stack" (operativa, primer-mes, escalar, agencias, creadores, desarrolladores) must now reference the Mercury canonical and the Wise canonical instead of duplicating onboarding instructions.

### Cluster C — CRS & FATCA reporting
- **Canonical:** `crs-cuentas-bancarias-llc-intercambio-informacion`
- Sibling angles (link back to canonical for the CRS primer):
  - `cuentas-bancarias-usa-reportan-hacienda-verdad` (US-banks-only angle)
  - `crs-residentes-espana-latam-implicaciones` (regional implications)
  - `revolut-business-crs-reporting-fiscal` (vendor)
  - `wise-business-crs-reporting-fiscal` (vendor)

### Cluster D — Compliance / AML / FinCEN
- **Canonical (AML overview):** `prevencion-blanqueo-capitales-llc`
- **Canonical (BOI):** `boi-report-fincen-guia-completa-2026`
- **Canonical (Form 5472):** `form-5472-que-es-como-presentarlo`
- **Canonical (annual ops):** `mantenimiento-anual-llc-obligaciones`
- `testaferros-prestanombres-llc-ilegal-riesgos` references the AML canonical for the BSA framing.

### Cluster E — Spanish freelancer / autónomo
- **Canonical (numerical comparison):** `autonomo-espana-vs-llc-estados-unidos`
- **Canonical (motivational case to leave):** `autonomos-espana-por-que-dejar-de-serlo`
- **Canonical (mistakes):** `errores-fiscales-freelancers-espanoles`
- **Canonical (international clients):** `impuestos-clientes-internacionales-espana`
- These four overlap heavily — each must keep a unique opening hook and refer to siblings rather than restating the autónomo cuotas table.

### Cluster F — International tax structuring
- **Canonical (concepts):** `fiscalidad-internacional-emprendedores-digitales`
- **Canonical (structure comparison):** `estructura-fiscal-optima-freelancer-internacional`
- **Canonical (design framework):** `diseno-estructura-fiscal-internacional-solida`
- **Canonical (risks):** `riesgos-fiscales-mala-estructuracion-internacional`
- **Canonical (residency for nomads):** `nomada-digital-residencia-fiscal`

### Cluster G — Verticals (LLC for X)
- **Canonical (cross-vertical fiscal):** `tributacion-llc-segun-actividad-economica`
- Each vertical (`llc-creadores-contenido-youtube-twitch`, `llc-agencias-marketing-digital`, `llc-desarrolladores-software-saas`, `amazon-ecommerce-llc-vender-online`, `criptomonedas-trading-llc-impuestos`) keeps its own audience-specific angle and refers to the cross-vertical article for general fiscal treatment.

### Cluster H — Country / residency tax
- **Canonical (matrix):** `fiscalidad-llc-por-pais-residencia`
- **Canonical (Spanish doctrine):** `boe-febrero-2020-llc-doctrina-administrativa`
- `crs-residentes-espana-latam-implicaciones` cites both rather than restating the IRPF/CRS interaction.

---

## 4. Required internal-link edits (per language content files)

Replace duplicated explainers with a one-sentence summary + link to the canonical.
Status as of 2026-04-16:

| In article | Section that currently duplicates | Replaced with link to | Status (ES) |
| --- | --- | --- | --- |
| `por-que-abrir-llc-estados-unidos-ventajas` | Mercury/Relay/Wise inventory + 0% federal explainer + deductibles list | Mercury canonical, `bancos-vs-fintech-llc-donde-abrir-cuenta`, pass-through canonical, `pagar-cero-impuestos-legalmente-llc`, `gastos-deducibles-llc-no-residentes` | ✅ done |
| `ventajas-desventajas-llc-no-residentes` | §1 0% federal claim + §3 & §9 banking inventory | pass-through canonical + `pagar-cero-impuestos-legalmente-llc`, Mercury canonical, `bancos-vs-fintech-llc-donde-abrir-cuenta` | ✅ done |
| `errores-fiscales-freelancers-espanoles` | "Error 8: pass-through" full explainer | pass-through canonical + `gastos-deducibles-llc-no-residentes` | ✅ done |
| `autonomo-espana-vs-llc-estados-unidos` | "Impuesto federal $0" pass-through restatement | pass-through canonical | ✅ done |
| `criptomonedas-trading-llc-impuestos` | "La clave: fiscalidad de la LLC para trading" pass-through restatement | pass-through canonical | ✅ done |
| `separar-dinero-personal-llc-por-que-importa` | Mercury product tour | Mercury canonical | ✅ done |
| `como-operar-llc-dia-a-dia` | Mercury / Wise / Slash setup paragraphs | Mercury canonical, `wise-business-llc-guia` | ⏳ pending (deferred — see §6) |
| `primer-mes-llc-que-esperar` | Mercury onboarding week | Mercury canonical | ⏳ pending |
| `escalar-negocio-digital-llc-americana` | Banking stack listing | `bancos-vs-fintech-llc-donde-abrir-cuenta` | ⏳ pending |
| `llc-creadores-contenido-youtube-twitch` | Pass-through explainer | pass-through canonical | ⏳ pending |
| `llc-agencias-marketing-digital` | Pass-through explainer + Mercury setup | pass-through canonical + Mercury canonical | ⏳ pending |
| `llc-desarrolladores-software-saas` | Pass-through + Stripe | pass-through canonical + `pasarelas-pago-llc-stripe-paypal-dodo` | ⏳ pending |
| `amazon-ecommerce-llc-vender-online` | Pass-through + Mercury | pass-through canonical + Mercury canonical | ⏳ pending |
| `residentes-no-residentes-llc-diferencias` | Pass-through paragraph | pass-through canonical | ⏳ pending |
| `impuestos-clientes-internacionales-espana` | Autónomo cuota table | `autonomo-espana-vs-llc-estados-unidos` | ⏳ pending |
| `crs-residentes-espana-latam-implicaciones` | CRS primer paragraph | `crs-cuentas-bancarias-llc-intercambio-informacion` | ✅ already cross-linked (no change needed) |
| `cuentas-bancarias-usa-reportan-hacienda-verdad` | CRS primer paragraph | same as above | ✅ already cross-linked |
| `revolut-business-crs-reporting-fiscal` | CRS primer paragraph | same as above | ✅ already cross-linked |
| `wise-business-crs-reporting-fiscal` | CRS primer paragraph | same as above | ✅ already cross-linked |
| `evitar-bloqueos-mercury-wise-revolut` | Mercury onboarding tips | Mercury canonical | ✅ kept (canonical for blocks-prevention angle, mentions are integral) |
| `due-diligence-bancario-llc-americana` | Mercury onboarding tips | Mercury canonical | ✅ kept (canonical for due-diligence angle) |

These edits apply to all 6 languages. The Spanish file is the source of truth;
the EN/FR/DE/PT/CA mirrors should be updated in the next pass when the pending
rows are tackled (currently EN-DE-FR-PT-CA still carry the verbatim duplicates
the Spanish source had before this pass). Tracked as follow-up #28.

---

## 5. Search Console keyword targets (after this audit)

To prevent two articles competing for the same query, the following primary
targets are reserved (one slug per query):

| Query (ES) | Owner |
| --- | --- |
| `cómo abrir cuenta Mercury LLC` | `cuenta-bancaria-mercury-llc-extranjero` |
| `cuenta bancaria LLC no residente` | `bancos-vs-fintech-llc-donde-abrir-cuenta` |
| `Wise Business LLC` | `wise-business-llc-guia` |
| `pass-through LLC qué es` | `tributacion-pass-through-llc-como-funciona` |
| `pagar 0 impuestos LLC` | `pagar-cero-impuestos-legalmente-llc` |
| `por qué abrir LLC EE.UU.` | `por-que-abrir-llc-estados-unidos-ventajas` |
| `ventajas desventajas LLC` | `ventajas-desventajas-llc-no-residentes` |
| `separar finanzas personales LLC` | `separar-dinero-personal-llc-por-que-importa` |
| `CRS cuentas bancarias LLC` | `crs-cuentas-bancarias-llc-intercambio-informacion` |
| `cuentas EE.UU. reportan a Hacienda` | `cuentas-bancarias-usa-reportan-hacienda-verdad` |
| `Form 5472` | `form-5472-que-es-como-presentarlo` |
| `BOI Report FinCEN` | `boi-report-fincen-guia-completa-2026` |
| `autónomo España vs LLC` | `autonomo-espana-vs-llc-estados-unidos` |
| `dejar de ser autónomo España` | `autonomos-espana-por-que-dejar-de-serlo` |
| `LLC creadores contenido` | `llc-creadores-contenido-youtube-twitch` |
| `LLC agencias marketing` | `llc-agencias-marketing-digital` |
| `LLC desarrolladores SaaS` | `llc-desarrolladores-software-saas` |
| `LLC Amazon ecommerce` | `amazon-ecommerce-llc-vender-online` |
| `LLC criptomonedas trading` | `criptomonedas-trading-llc-impuestos` |
| `tributación LLC por actividad` | `tributacion-llc-segun-actividad-economica` |
| `fiscalidad LLC por país residencia` | `fiscalidad-llc-por-pais-residencia` |
| `Estonia vs LLC EE.UU.` | `por-que-no-abrir-empresa-estonia` |

For the other 5 languages, the same mapping applies on the translated slug
defined in `blog-posts-slugs.ts`.

---

## 6. Out of scope for this audit (follow-up work)

- Completing the ⏳ pending rows in §4 for the Spanish content file
  (`como-operar-llc-dia-a-dia`, `primer-mes-llc-que-esperar`,
  `escalar-negocio-digital-llc-americana`, the 4 vertical articles,
  `residentes-no-residentes-llc-diferencias`,
  `impuestos-clientes-internacionales-espana`).
- Mirroring all §4 paragraph consolidations from Spanish into the EN, FR,
  DE, PT and CA content files.
- The translated `metaTitle` / `metaDescription` in `blog-posts-i18n.ts`
  for the 7 deconflicted slugs were aligned in this task; remaining slugs
  whose Spanish meta is still generic can be tightened in the next pass.
