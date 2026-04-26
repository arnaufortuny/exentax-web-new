# Worksheet — `que-es-irs-guia-duenos-llc`

> Sprint #8 · Tipo: **rewrite-completo** · Score: 3 · WC actual: 2340  
> Categoría: Guías · Verdict: FALLA (gancho-generico, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `IRS-Forms`

## Título y meta SEO actuales

- **Title:** ¿Qué es el IRS? Guía completa para dueños de LLC
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `¿Qué es el IRS? Guía completa para dueños de LLC` · `Análisis práctico de ¿qué es el irs? guía completa para dueños de llc con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equipo Exentax.`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (56ch):** `IRS para dueños de LLC no residentes: qué te puede pedir`
- **Candidato metaDescription (140ch):** `Estructura LB&I/SB-SE, centro Austin para no residentes, Notice CP-2000 y por qué federal no incluye sales tax estatal. Plazos y appeal CAP.`

## Primer párrafo actual (auditoría)

> Si tienes una LLC en Estados Unidos, o estás pensando en tener una, vas a escuchar mucho sobre el **IRS**. Mucho. Es la entidad con la que tendrás más relación desde el punto de vista fiscal. Y es mejor entenderla bien d…

## Gancho objetivo (rewrite-completo)

> **El IRS no es Hacienda US: es la Internal Revenue Service del Department of Treasury, con jurisdicción exclusiva sobre impuestos federales (income, payroll, excise) — NO sobre sales tax (estatal) ni property tax (municipal); para LLC no residente, el IRS sólo te ve si tienes ETBUS, US-source income o eres responsible party del Form 5472.**

### Dato concreto a usar en los primeros 100 palabras

IRS estructura 2026: 4 divisiones operativas (LB&I large business, SB/SE small business/self-employed, W&I wage & investment, TE/GE tax-exempt); centros de procesamiento internacional para no residentes en Austin TX (1040-NR, W-7, SS-4 fax) y Ogden UT (1120, 5472); plazo respuesta carta IRS 30-60 días con derecho a CAP appeal antes de Tax Court.

## Esquema de secciones recomendado (12 bloques)

1. **Gancho** — opener con la frase del bloque "Gancho objetivo".
2. **Datos / Cifras / Tablas** — primer bloque cuantitativo (tabla, comparativa o lista de cifras).
3. **Comparativa por perfil** — para quién encaja qué.
4. **Visión a 24 meses o escenarios A/B/C** — proyección con números.
5. **El coste de NO hacerlo** — quantificar la inacción para este tema concreto.
6. **Lo que NO cambia** — mitos vs realidad / desambiguación.
7. **"¿Y si...?"** — 3-5 objeciones tipificadas (ver lista abajo).
8. **Hechos legales y de procedimiento** — bloque con citas oficiales.
9. **FAQ** — 6-8 preguntas reales del cliente.
10. **Qué incluye Exentax** — el servicio aplicable a este tema.
11. **Referencias normativas** — bloque con BOE / IRS / FinCEN / OCDE / etc.
12. **CTA** — bloque cerrado canónico (`compliance_checkup`).

## Objeciones a resolver (mínimo 3, ideal 5)

1. "¿El IRS me puede embargar cuentas en España?" → No directamente: convenios de doble imposición (España-EE. UU. de 1990, Protocolo 2019) permiten cooperación pero el IRS no tiene autoridad ejecutiva en España.
2. "¿IRS puede revocar mi EIN?" → No revoca; lo desactiva si la LLC se disuelve o no presenta returns durante 5+ años (clasificación dormant).
3. "¿Qué es un Notice CP-2000?" → Carta IRS que informa de inconsistencia entre tu return y datos de terceros (1099, W-2); no es auditoría todavía pero sí riesgo si no respondes en 60 días.
4. "¿Carta del IRS en sobre azul?" → Es comunicación oficial; nunca es spam. Verificar siempre vía irs.gov o llamada al 1-800-829-1040 antes de pagar.


## Plan de corrección del audit

- Reescribir el primer párrafo (motivo: abre con definición o frase boilerplate sin gancho concreto). Abrir con la objeción, cifra o pregunta más punzante del tema "¿Qué es el IRS? Guía completa para dueños de LLC" — no con definición ni con "En este artículo".
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.
- Expandir de 2340 a ≥2.500 palabras (faltan ~160). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — Form 5472](https://www.irs.gov/forms-pubs/about-form-5472) — `<a href="https://www.irs.gov/forms-pubs/about-form-5472" target="_blank" rel="noopener">IRS — Form 5472</a>`
- [IRS — Form 1120](https://www.irs.gov/forms-pubs/about-form-1120) — `<a href="https://www.irs.gov/forms-pubs/about-form-1120" target="_blank" rel="noopener">IRS — Form 1120</a>`
- [IRS — Form 7004 (extensión)](https://www.irs.gov/forms-pubs/about-form-7004) — `<a href="https://www.irs.gov/forms-pubs/about-form-7004" target="_blank" rel="noopener">IRS — Form 7004 (extensión)</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `compliance_checkup` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "compliance_checkup").
- **Mid-article:** variante `talk_to_team` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `talk_to_team`).
- **WhatsApp (`<!-- exentax:cta-conv-v1 -->`):** **Sí** (artículo de alta intención).

## Capa regulatoria por idioma

| Idioma | Capa específica obligatoria |
|---|---|
| ES | Marco español aplicable + Modelo correspondiente (303, 720, 721, 232) + LIRPF/LIS arts. relevantes + tratamiento RETA si aplica. |
| EN | US (IRS, FinCEN) + UK angle (HMRC, Anson v HMRC para LLC opaque/transparent debate). Para audiencia anglo-sajona neutra usa US-first; menciona UK cuando el tema toque foreign income / SA106. |
| FR | France métropolitaine (CGI 209 B CFC, formulaire 3916/3916-bis, URSSAF micro vs réel). Mencionar Bélgica (BNB), Suiza (Wertschriftenverzeichnis), Québec (T1135 ARC) cuando aplique al tema. |
| DE | DACH con tratamiento Sie/Ihr estricto: AStG §§7-14 (Hinzurechnungsbesteuerung), Anlage AUS, KStG. Mencionar Austria (BMF, EAS 3401/3422) y Suiza (ESTV, Wertschriftenverzeichnis) cuando aplique. |
| PT | PT-PT estricto (sin brasileñismos): CIRS art. 16.º (residência), CIRC art. 66.º (TFI), Modelo 58 do BdP. Mencionar Brasil (RFB, DCBE, e-Financeira, carnê-leão, DIRF) cuando el slug toque LATAM lusófono. |
| CA | Català oriental con vostè estricto: capa autonòmica IRPF (tram català), ATC, Model 720/721 amb el matís català de l'STJUE C-788/19. Mencionar Andorra (impostos.ad, IRPF Andorra art. 49) quan apliqui. |

> **Importante**: cada nativa debe tener ratio de palabras ≥ 0.85 vs ES y citar al menos 1 fuente oficial local del idioma (no sólo IRS/FinCEN).

## Checklist de cierre

- [ ] ES ≥ 2.500 palabras netas.
- [ ] 5 nativas ≥ 0.85 × ES.
- [ ] ≥ 3 dominios autoritativos distintos en ES.
- [ ] Exentax: 4-12 menciones distribuidas.
- [ ] Gancho concreto en primeros 100 palabras (cifra/objeción/pregunta).
- [ ] ≥ 3 secciones de objeción.
- [ ] CTA cierre patrón `compliance_checkup` verbatim.
- [ ] Mid-CTA variante `talk_to_team`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
