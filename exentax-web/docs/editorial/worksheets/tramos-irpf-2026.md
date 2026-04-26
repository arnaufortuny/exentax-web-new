# Worksheet — `tramos-irpf-2026`

> Sprint #8 · Tipo: **rewrite-completo** · Score: 3 · WC actual: 1081  
> Categoría: Fiscalidad · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `AEAT/IRPF`

## Título y meta SEO actuales

- **Title:** Tramos del IRPF 2026 en España: tabla, cálculo y planificación
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Tramos del IRPF 2026 en España: tabla, cálculo y planific…` · `Análisis práctico de tramos del irpf 2026 en españa: tabla, cálculo y planificación con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del …`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> El Impuesto sobre la Renta de las Personas Físicas (IRPF) sigue siendo, actualmente, el tributo que más impacta tu nómina, tu factura como autónomo y tu rendimiento de capital en España. Conocer la tabla de tramos vigent…

## Gancho objetivo (rewrite-completo)

> **El IRPF estatal 2026 tiene 6 tramos (BOE Ley 11/2020 + actualización Presupuestos): 19% hasta 12.450€, 24% hasta 20.200€, 30% hasta 35.200€, 37% hasta 60.000€, 45% hasta 300.000€, 47% por encima — más el tramo autonómico, que en Madrid baja al 8.5% mínimo y en Cataluña/Valencia sube hasta el 25.5%.**

### Dato concreto a usar en los primeros 100 palabras

Tarifa IRPF 2026 (LIRPF art. 63 + escala estatal Ley 11/2020 + Presupuestos 2024 prorrogados): tramo estatal 9.5% hasta 12.450€, 12% hasta 20.200€, 15% hasta 35.200€, 18.5% hasta 60.000€, 22.5% hasta 300.000€, 24.5% por encima. Sumar tarifa autonómica (varía por CCAA). Mínimo personal 5.550€; mínimo familiar adicional desde art. 58 LIRPF.

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

1. "¿El tramo del 47% es marginal o medio?" → Marginal: sólo aplica al euro 300.001 en adelante. Tu tipo medio efectivo siempre es menor.
2. "¿Las rentas del ahorro tributan al mismo tipo?" → No: escala separada 19% hasta 6K€, 21% hasta 50K€, 23% hasta 200K€, 27% hasta 300K€, 28% por encima (LIRPF art. 66, Ley 11/2020).
3. "¿La deducción por maternidad se aplica al tramo?" → No: es deducción de cuota (1.200€/año por hijo < 3 años, LIRPF art. 81-bis); reduce cuota directamente.
4. "¿Madrid o Andalucía pagan menos IRPF?" → Madrid tiene escala autonómica más baja (8.5% mínimo); Andalucía bajó al 9% mínimo en 2023; Cataluña y Valencia mantienen 10.5-12% en tramos altos.


## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: agenciatributaria.gob.es, boe.es.
- Expandir de 1081 a ≥2.500 palabras (faltan ~1419). Añadir secciones específicas según el tema: comparativa cuantitativa por tramo de ingresos + Modelo a presentar.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [AEAT — sede electrónica](https://sede.agenciatributaria.gob.es) — `<a href="https://sede.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT — sede electrónica</a>`
- [BOE — LIRPF (Ley 35/2006)](https://www.boe.es/eli/es/l/2006/11/28/35/con) — `<a href="https://www.boe.es/eli/es/l/2006/11/28/35/con" target="_blank" rel="noopener">BOE — LIRPF (Ley 35/2006)</a>`
- [Petete (DGT)](https://petete.tributos.hacienda.gob.es) — `<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">Petete (DGT)</a>`

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
