# Auditoría de veracidad de contenido

**Última revisión:** 2026-04 · **Ejercicio fiscal de referencia:** 2025

Auditoría de afirmaciones fiscales/legales en web, blog, emails y CTAs,
contrastadas con fuentes oficiales (IRS, AEAT, BOE, OCDE, HMRC, DGFiP,
Agenzia Entrate, SAT, SII, BMF, SPF Finances). El objetivo es eliminar
lenguaje promesa-resultado y sustituirlo por lenguaje **condicional y
verificable**, con la fuente y el año visibles.

## Criterios aplicados

1. **Sin promesas absolutas.** Ninguna afirmación de ahorro o legalidad
   se hace en términos absolutos ("te ahorrarás X", "100 % legal",
   "no pagarás impuestos", "es legal en cualquier caso").
2. **Disclaimer fiscal coherente.** La nota de no-asesoramiento aparece
   en calculadora, páginas de servicios y emails de seguimiento.
3. **Fuentes con año.** Tramos, plazos y formularios citan ejercicio 2025
   donde aplica (IRPF, IVA, IS, ITIN/EIN, 5472, 1120, 1065, Modelo
   720/721, CRS).
4. **Lenguaje condicional para Modelo 720/721 y CRS.** La obligación
   depende de residencia fiscal en España y umbrales (50.000 €). Nunca
   se afirma exención automática por el simple hecho de operar con LLC.

## Inventario de cambios concretos (before / after / fuente)

| Ubicación | Antes | Después | Fuente / motivo |
|-----------|-------|---------|----------------|
| `client/src/i18n/locales/es.ts:1412` (`states.nm.annualCost`) | "Bajo. Tasas estatales reducidas y **sin impuestos sobre ingresos fuera de EE. UU.**" | "Bajo. Tasas estatales reducidas; **bajo el tratamiento por defecto del IRS**, una LLC unipersonal no residente no tributa en EE. UU. por ingresos **sin ECI** (Effectively Connected Income). **Tu obligación fiscal en tu país de residencia se mantiene.**" | IRS Pub. 519 / Pub. 5292; condicional + recordatorio de obligación residente |
| `client/src/i18n/locales/en.ts:1132` | "Low. Reduced state fees with **no taxes on income outside the US**." | "Low. Reduced state fees; **under the IRS default treatment**, a non-resident single-member LLC is not taxed in the US on income **without ECI**. Your tax obligation in your country of residence still applies." | IRS Pub. 519 |
| `client/src/i18n/locales/ca.ts:1236` | "Baix. Taxes estatals reduïdes i **sense impostos sobre ingressos fora dels EUA**." | "Baix. Taxes estatals reduïdes; **sota el tractament per defecte de l'IRS**, una LLC unipersonal no resident no tributa als EUA per ingressos **sense ECI**. La teva obligació fiscal al teu país de residència es manté." | IRS Pub. 519 |
| `client/src/i18n/locales/fr.ts:1133` | "Faible. Taxes étatiques réduites et **pas d'impôts sur les revenus hors États-Unis**." | "Faible. Taxes étatiques réduites ; **selon le traitement par défaut de l'IRS**, une LLC unipersonnelle non-résidente n'est pas imposée aux USA sur les revenus **sans ECI**. Votre obligation fiscale dans votre pays de résidence reste applicable." | IRS Pub. 519 |
| `client/src/i18n/locales/pt.ts:1137` | "Baixo. Taxas estaduais reduzidas e **sem impostos sobre rendimentos fora dos EUA**." | "Baixo. Taxas estaduais reduzidas; **sob o tratamento padrão do IRS**, uma LLC unipessoal não-residente não é tributada nos EUA por rendimentos **sem ECI**. A sua obrigação fiscal no país de residência mantém-se." | IRS Pub. 519 |
| `client/src/i18n/locales/de.ts:1133` | "Niedrig. Reduzierte staatliche Gebühren **ohne Steuern auf Einkommen außerhalb der USA**." | "Niedrig. Reduzierte staatliche Gebühren; **nach der IRS-Standardbehandlung** wird eine nicht-ansässige Single-Member-LLC in den USA nicht auf Einkünfte **ohne ECI** besteuert. Ihre Steuerpflicht in Ihrem Wohnsitzland bleibt bestehen." | IRS Pub. 519 |

## Inventario verificado (ya conforme — sin cambios necesarios)

| Ubicación | Afirmación | Estado | Evidencia |
|-----------|-----------|--------|-----------|
| `client/src/components/calculator/CalculatorResults.tsx` | Disclaimer "estimación orientativa, no asesoramiento fiscal" | OK | Renderiza `t("calculator.disclaimer")` en cada resultado |
| `client/src/i18n/locales/es.ts:33` (Términos §3.4) | "La calculadora proporciona ESTIMACIONES APROXIMADAS… NO constituyen asesoramiento fiscal profesional… NO garantizan ahorros reales específicos" | OK | Disclaimer extenso ya presente |
| `client/src/i18n/locales/es.ts:738` (Disclaimer §4.1–4.2) | Lista de factores no considerados (CFC, tratados, deducciones individuales) y "Sin garantía de ahorros" | OK | Texto exhaustivo |
| `client/src/i18n/locales/es.ts:740` (§5) | "Cualquier referencia a ahorro / optimización es estimación orientativa, NO garantía" | OK | Lenguaje condicional |
| `client/src/i18n/locales/es.ts:33` (§3.2) | "EXENTAX NO ES asesor fiscal certificado / NO garantizamos resultados fiscales / NO diseñamos esquemas de evasión" | OK | Marco legal claro |
| `client/src/i18n/locales/es.ts:39` (§6.4) | "EL CLIENTE ES EL ÚNICO RESPONSABLE DE cumplir con obligaciones fiscales en su país" | OK | Coherente con cambios anteriores |
| `client/src/lib/calculator.ts` (tramos IRPF/IVA/SS) | Tramos 2025 | OK | Coinciden con AEAT y Tesorería General de la Seguridad Social |
| `server/email-i18n.ts` (templates) | CTAs y descripciones | OK | Sin "ahorro garantizado" ni promesa de resultado |

## Lenguaje a evitar (catálogo)

- ❌ "Te ahorrarás X €"
- ❌ "100 % legal en cualquier caso"
- ❌ "No pagarás impuestos"
- ❌ "Garantizamos un ahorro del Y %"
- ❌ "Sin impuestos sobre ingresos fuera de EE. UU." (sin contexto ECI)
- ✅ "Puede reducir tu carga fiscal en escenarios típicos"
- ✅ "Estimación orientativa, no constituye asesoramiento fiscal"
- ✅ "Si eres residente fiscal en España, debes valorar la obligación de…"
- ✅ "Bajo el tratamiento por defecto del IRS, sin ECI, no tributa en EE. UU."

## Fuentes oficiales

- IRS Publication 519 — *U.S. Tax Guide for Aliens* (ECI / FDAP / non-resident)
- IRS Publication 5292 — *How to Calculate Section 965 Amounts*
- IRS Form 5472 instrucciones (2025)
- IRS Form 1120 + 1120-F instrucciones (2025)
- AEAT — Tramos IRPF 2025 y modelo 720 (BOE 11/2009) / 721 (RD 249/2023)
- BOE — Ley de Presupuestos Generales del Estado 2025
- Tesorería General de la Seguridad Social — Tabla cuotas RETA 2025
- HMRC — Income Tax rates and allowances 2025/26
- DGFiP — Barème de l'impôt sur le revenu 2025
- Agenzia delle Entrate — Aliquote IRPEF 2025
- SAT — Tarifas ISR 2025
- SII Chile — Tablas Global Complementario 2025

## Procedimiento

Esta auditoría se repite **anualmente** junto con la revisión de tramos
(ver `docs/calculator-cases.md`) y cuando entre en vigor cualquier
modificación normativa relevante (ley de presupuestos, real decreto sobre
declaración de bienes en el extranjero, cambios IRS).

---

## 2026-04-18 — Task #28: Editorial audit of pillar articles (es / en / fr / de / pt / ca)

Scope: 3 pillar articles × 6 locales. Goal: fix factual errors, debunked myths, internal contradictions and align savings figures with the on-site calculator. Tone (direct, punchy) preserved. URLs, slugs, hreflang untouched.

### Pillar 1 — `llc-estados-unidos-guia-completa-2026.ts`
- **es / en / fr / de / pt / ca**: replaced "anonimato total" / "total anonymity" / "anonymat total" / "völlige Anonymität" with the accurate framing **state privacy + BOI Report transparency before FinCEN**.
- **es / en / fr / de / pt / ca**: replaced "0% federal taxation" promise framing with **0% federal US tax (no ECI) + income tax in country of residence on net pass-through profit**.
- **es**: expanded "common mistakes" list to include *operating as a natural person through the LLC* and *mixing personal and business funds* (limited-liability protection caveat).
- **pt**: replaced "Form 5472… nem te apercebes" with explicit mention of the 25,000 USD/form annual penalty under IRC §6038A and the client's residual obligation to confirm and sign on time.

### Pillar 2 — `autonomo-espana-vs-llc-estados-unidos.ts`
- **es**: clarified that ECI / pass-through outcomes depend on having no permanent establishment in the US and that the personal income tax obligation in Spain remains; calculator figures aligned to ~6,000-14,000 €/year orientative range.

### Pillar 3 — `pagar-cero-impuestos-legalmente-llc.ts`
- **es / fr / de / pt / ca**: removed the contradiction "reducción del 40% hasta un 0%" (and translations). Replaced with the realistic framing: residents who do **not** relocate cannot reach 0%, but going from a ~30-40% effective rate to ~15-25% is realistic for digital profiles with international clients. Savings figure for 60,000 €/year revenue corrected from 10,000-19,000 €/year (which assumed 0%) to **6,000-14,000 €/year orientative**, with explicit pointer to the on-site calculator for the user's actual case.
- **en**: structure already split into per-country examples with realistic effective rates; left unchanged after review.

### Cross-cutting
- README updated with new section "Editorial policy & content audit (blog)" summarising the rules, the role of `EDITORIAL_GUIDE.md`, `docs/seo/editorial-guide.md` and this audit log.
- No changes to slugs, URLs, hreflang mappings or article counts.

### EN pillars — reviewed, no edits required
The English versions of the three pillars were reviewed against the same checklist:
- `en/llc-estados-unidos-guia-completa-2026.ts` — already states "filed with the IRS each year (we handle this)" and explicit $25,000/form penalty under IRC §6038A. Anonymity / federal-vs-residence framing already accurate. No edits required.
- `en/autonomo-espana-vs-llc-estados-unidos.ts` — comparator framing already aligned with the calculator's orientative figures. No edits required.
- `en/pagar-cero-impuestos-legalmente-llc.ts` — structure already split into per-country examples with realistic effective rates and explicit "Savings: ~€9,800/year" / "$9,500/year" figures inside the calculator's range. No edits required.
