# Worksheet — `cuota-autonomo-2026`

> Sprint #2 · Tipo: **rewrite-completo** · Score: 52 · WC actual: 1247  
> Categoría: Fiscalidad · Verdict: FALLA (objeciones-no-resueltas, longitud-insuficiente)  
> Tags temáticos: `RETA/SegSocial`

## Título y meta SEO actuales

- **Title:** Cuota de autónomo 2026 en España: tabla por tramos y planificación
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Cuota de autónomo 2026 en España: tabla por tramos y plan…` · `Análisis práctico de cuota de autónomo 2026 en españa: tabla por tramos y planificación con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta …`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (56ch):** `Cuota de autónomo 2026: tabla por tramos y planificación`
- **Candidato metaDescription (132ch):** `15 tramos por ingresos reales, 200€ a 590€/mes, regularización Mod. 145 y cuándo conviene saltar a LLC. Cifras BOE 2026 verificadas.`

## Primer párrafo actual (auditoría)

> El régimen especial de trabajadores autónomos en España (RETA) cotiza desde su entrada en vigor por ingresos reales y, actualmente, los tramos consolidados ya no son una novedad sino un coste fijo importante de planifica…

## Gancho objetivo (rewrite-completo)

> **Si en 2026 facturas 60.000€/año como autónomo en España, tu cuota es de 590€/mes (7.080€/año) — un 100% más de lo que pagabas en 2022 con la base mínima, y la regularización del año siguiente puede subirla todavía más**

### Dato concreto a usar en los primeros 100 palabras

Tabla 2026 RD-Ley 13/2022 (RETA por ingresos reales): 15 tramos de cotización; tramo 1 (≤670€/mes net) cotiza 200€/mes, tramo 12 (≥6000€/mes net) cotiza 590€/mes; revisión anual con regularización Mod. 145

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

1. "¿Si me equivoco al estimar mis ingresos pago de más?" → No, la regularización al año siguiente devuelve el exceso o cobra el déficit.
2. "¿Cuándo conviene saltar a LLC?" → Cuando facturas a clientes internacionales y tu efectivo (cuota + IRPF) supera el 30%, casi siempre conviene.
3. "¿La tarifa plana 80€ sigue?" → Sí en 2026: 80€/mes los primeros 12 meses, prorrogable 12 más si ingresos < SMI.
4. "¿Cotizo por dividendos de mi LLC?" → No, los dividendos no cotizan a la Seguridad Social; sólo a IRPF (rentas del capital mobiliario).

## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Expandir de 1247 a ≥2.500 palabras (faltan ~1253). Añadir secciones específicas según el tema: comparativa cuantitativa por tramo de ingresos + Modelo a presentar.

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
- [ ] Entrada de cierre en `docs/editorial/sprints/SPRINT-LOG.md`.
