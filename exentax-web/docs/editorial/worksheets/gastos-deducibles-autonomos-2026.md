# Worksheet — `gastos-deducibles-autonomos-2026`

> Sprint #7 · Tipo: **rewrite-completo** · Score: 3 · WC actual: 1686  
> Categoría: Fiscalidad · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `RETA/SegSocial`

## Título y meta SEO actuales

- **Title:** Gastos deducibles para autónomos en 2026: la lista práctica
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Gastos deducibles para autónomos en 2026: la lista práctica` · `Análisis práctico de gastos deducibles para autónomos en 2026: la lista práctica con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equ…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (53ch):** `Gastos deducibles autónomo 2026: lista real con LIRPF`
- **Candidato metaDescription (138ch):** `Suministros 30%, manutención 26,67€/día, kilometraje 0,26€/km y los gastos que la AEAT siempre rechaza. Sentencias y consultas DGT al día.`

## Primer párrafo actual (auditoría)

> La factura fiscal de un autónomo en España depende menos del tipo marginal y más de los gastos que sabe documentar. La diferencia entre quien declara 50.000 euros de rendimiento neto y quien declara 35.000 con la misma f…

## Gancho objetivo (rewrite-completo)

> **El 30% de tu suministro doméstico (luz, agua, gas, internet) es deducible si declaras local afecto al trabajo en Modelo 036 — pero la Sentencia TS 1462/2018 limita el cómputo a la proporción de m² registrada, y la AEAT exige factura emitida a tu NIF como autónomo, no al IBI del piso.**

### Dato concreto a usar en los primeros 100 palabras

Reforma LIRPF 2018 (Ley 6/2017 art. 11): suministros vivienda parcialmente afecta al 30% del % declarado de m² (ej. piso 100m² con 20m² afectos = 6% del recibo); manutención hasta 26,67€/día España y 48,08€/día extranjero (RD 439/2007 art. 9.A.3); kilometraje propio 0,26€/km (sin variación 2026).

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

1. "¿Móvil 100% deducible?" → No automático: AEAT exige líneas separadas o prueba de uso profesional > 50%; criterio TEAC 2453/2017.
2. "¿Software SaaS extranjero (Notion, Zoom)?" → 100% deducible si factura B2B; si proveedor UE no tiene tu ROI registrado puede facturar con IVA local irrecuperable.
3. "¿Comida con cliente (sin pernoctación)?" → Deducible vía art. 30 LIRPF: hasta 26,67€/día en España, justificable con ticket simplificado < 400€ + identificación del cliente en el reverso.
4. "¿Vehículo afecto si lo uso también para personal?" → No deducible salvo afectación 100% (criterio TEAC 5957/2018); excepción taxis, autoescuela, comerciales y agencia de viajes.


## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: agenciatributaria.gob.es, boe.es.
- Expandir de 1686 a ≥2.500 palabras (faltan ~814). Añadir secciones específicas según el tema: comparativa cuantitativa por tramo de ingresos + Modelo a presentar.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [Seguridad Social — RETA bases](https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537) — `<a href="https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537" target="_blank" rel="noopener">Seguridad Social — RETA bases</a>`
- [BOE — RD-Ley 13/2022 (RETA por ingresos reales)](https://www.boe.es/eli/es/rdl/2022/07/26/13/con) — `<a href="https://www.boe.es/eli/es/rdl/2022/07/26/13/con" target="_blank" rel="noopener">BOE — RD-Ley 13/2022 (RETA por ingresos reales)</a>`

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
