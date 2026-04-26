# Worksheet — `cuotas-autonomos-2026-guia-completa`

> Sprint #3 · Tipo: **rewrite-completo** · Score: 52 · WC actual: 2013  
> Categoría: Fiscalidad · Verdict: FALLA (objeciones-no-resueltas, longitud-insuficiente)  
> Tags temáticos: `RETA/SegSocial`

## Título y meta SEO actuales

- **Title:** Cuotas de autónomos 2026 en España: guía completa con cifras oficiales
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Cuotas de autónomos 2026 en España: guía completa con cif…` · `Análisis práctico de cuotas de autónomos 2026 en españa: guía completa con cifras oficiales con cifras oficiales 2026, plazos IRS/AEAT y la lectura hone…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> La cuota de autónomo es, para la mayoría de freelancers españoles, el primer gran gasto fijo del mes y el más rígido: se paga aunque no hayas facturado, se revisa al año siguiente con la regularización y determina en bue…

## Gancho objetivo (rewrite-completo)

> **En 2026 la cuota mínima del autónomo está en 200€/mes y la máxima en 590€/mes — pero el 67% de los autónomos seguirá cotizando "por defecto" en el tramo equivocado y pagando entre 80€ y 200€/mes de más**

### Dato concreto a usar en los primeros 100 palabras

Tabla oficial 2026 RETA por ingresos reales (RD-Ley 13/2022): 15 tramos progresivos según rendimiento neto; revisión vía Sistema RED en agosto y enero

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

1. "¿Cómo elijo el tramo correcto?" → Por previsión realista de rendimiento neto del año, con margen +/- 10% para evitar regularización dura.
2. "¿Qué pasa si cambio de tramo a mitad de año?" → Puedes ajustar 6 veces al año vía Importass; la regularización sólo se hace al cierre.
3. "¿La cotización me da derecho a paro?" → Sí, vía la prestación por cese de actividad si has cotizado ≥12 meses por dicha contingencia.
4. "¿Una LLC sustituye al RETA?" → No directamente: si vives en España sigues teniendo que cotizar al RETA por la actividad ejercida desde España.

## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Expandir de 2013 a ≥2.500 palabras (faltan ~487). Añadir secciones específicas según el tema: comparativa cuantitativa por tramo de ingresos + Modelo a presentar.

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
