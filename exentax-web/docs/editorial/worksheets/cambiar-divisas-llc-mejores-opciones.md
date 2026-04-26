# Worksheet — `cambiar-divisas-llc-mejores-opciones`

> Sprint #6 · Tipo: **rewrite-completo** · Score: 16 · WC actual: 2248  
> Categoría: Operativa · Verdict: FALLA (objeciones-no-resueltas, longitud-insuficiente)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** Cómo cambiar divisas en tu LLC: las mejores opciones
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Cómo cambiar divisas en tu LLC: las mejores opciones` · `Análisis práctico de cómo cambiar divisas en tu llc: las mejores opciones con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equipo Exe…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (48ch):** `Cambiar divisas LLC: bancos vs Wise vs broker FX`
- **Candidato metaDescription (130ch):** `Spread bancario 1,5-2% vs Wise 0,41-0,6% vs OFX/AFEX 0,4-0,7% con forward. Ganancia patrimonial AEAT y cuándo conviene fragmentar.`

## Primer párrafo actual (auditoría)

> Si operas una LLC en Estados Unidos y vives en España, México, Colombia o cualquier otro país fuera de EE.UU. el cambio de divisas es una parte esencial de tu día a día financiero. Cobras en dólares, pero tus gastos pers…

## Gancho objetivo (rewrite-completo)

> **Mover $50,000 USD desde tu LLC a tu cuenta personal en EUR puede costarte $750 con el wire bancario tradicional, $200 con Wise Business, o $80 con un broker FX como OFX/CurrencyFair — y la diferencia se acumula cada mes en tu margen real.**

### Dato concreto a usar en los primeros 100 palabras

Spread típico EUR/USD: bancos US tradicionales 1.5-2% sobre mid-market + $25-45 wire fee; Wise Business 0.41-0.6% + sin fee fijo en envíos < $5K; Revolut Business plan free 0.6%; brokers FX (OFX, CurrencyFair, AFEX) 0.4-0.7% para volúmenes ≥ $10K con forward contracts.

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

1. "¿Wise es seguro para volumen alto?" → Hasta £85K en UK / $250K en US vía partner banks; por encima conviene fragmentar o usar broker FX regulado por CFTC/FCA con segregated client accounts.
2. "¿Pago impuestos por ganancia cambiaria al convertir USD→EUR?" → En España: sí, ganancia patrimonial al cambio (LIRPF art. 33); usar tipo de cambio oficial BCE del día de cada operación.
3. "¿Forward contract para fijar el tipo a 6 meses?" → OFX y AFEX lo ofrecen sin coste explícito (incluido en spread); útil para facturación recurrente en EUR mientras tu LLC cobra en USD.
4. "¿Crypto stablecoin para mover USD→EUR?" → Posible vía USDC, pero la conversión USDC→EUR sigue cobrando 0.5-1.5% en Kraken/Bitstamp y suma trazabilidad fiscal extra (cada conversión es operación AEAT).


## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Expandir de 2248 a ≥2.500 palabras (faltan ~252). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`

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
- [ ] Entrada de cierre en `docs/editorial/sprints/SPRINT-LOG.md`.
