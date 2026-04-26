# Worksheet — `wise-business-llc-guia`

> Sprint #5 · Tipo: **rewrite-completo** · Score: 26 · WC actual: 2340  
> Categoría: Herramientas · Verdict: FALLA (datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `LLC/IRS` · `Banca/Fintech`

## Título y meta SEO actuales

- **Title:** Wise Business para tu LLC: guía completa
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Wise Business para tu LLC: guía completa` · `Análisis práctico de wise business para tu llc: guía completa con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equipo Exentax.`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (50ch):** `Wise Business para LLC US: alta 33$ y FX 0,41-0,6%`
- **Candidato metaDescription (134ch):** `IBAN BE/GB/HU multi-divisa, ACH/SWIFT vía Community Federal y por qué Wise + Mercury es el setup estándar del freelance internacional.`

## Primer párrafo actual (auditoría)

> **Wise Business** (antes TransferWise) es una de las herramientas financieras más útiles para propietarios de LLCs que operan internacionalmente. Te permite recibir, convertir y enviar dinero en más de 40 divisas con tip…

## Gancho objetivo (rewrite-completo)

> **Wise Business para LLC US no residente cuesta $33 one-time + 0.41-0.6% por conversión EUR/USD; abre cuentas en 50+ divisas con IBAN belga/británico/húngaro propio, lo que permite cobrar de clientes UE como si fueras europeo — pero NO funciona como banco US (el routing number es de Community Federal Savings, no propio).**

### Dato concreto a usar en los primeros 100 palabras

Wise Business: alta $33 USD one-time fee, sin monthly fees; cuentas multi-currency con IBAN BE/GB/HU/RO + ACH/SWIFT US (vía Community Federal Savings Bank, NY); spread 0.41-0.6% sobre mid-market FX (depende del corredor); FDIC pass-through hasta $250K en US accounts; FCA-regulated en UK con safeguarding (no FSCS).

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
12. **CTA** — bloque cerrado canónico (`book_consultation`).

## Objeciones a resolver (mínimo 3, ideal 5)

1. "¿Wise sustituye Mercury para mi LLC?" → No para nómina ACH ni cobros 1099-K; sí para conversión FX y cuentas en EUR/GBP/HUF.
2. "¿IBAN belga de Wise me sirve para domiciliar en España?" → Sí: SEPA acepta IBAN BE como cualquier IBAN español para ingresos.
3. "¿Wise reporta al IRS si soy no residente?" → Sí emite 1099-K si superas $5,000 cobrados en 2026 (Notice 2024-85); el W-8BEN-E evita la retención del 30% pero no elimina el reporte informativo.
4. "¿Mantener Wise + Mercury es overkill?" → No: Mercury para receivables ACH US y Wise para FX y EUR/GBP es el setup estándar de freelancers internacionales.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: irs.gov, fincen.gov, fdic.gov.
- Expandir de 2340 a ≥2.500 palabras (faltan ~160). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`
- [FDIC — deposit insurance](https://www.fdic.gov) — `<a href="https://www.fdic.gov" target="_blank" rel="noopener">FDIC — deposit insurance</a>`
- [FinCEN — KYC / AML](https://www.fincen.gov) — `<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN — KYC / AML</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `book_consultation` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "book_consultation").
- **Mid-article:** variante `free_consult` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `free_consult`).
- **WhatsApp (`<!-- exentax:cta-conv-v1 -->`):** Opcional; sólo añadir si el tema toca dolor inmediato.

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
- [ ] CTA cierre patrón `book_consultation` verbatim.
- [ ] Mid-CTA variante `free_consult`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
