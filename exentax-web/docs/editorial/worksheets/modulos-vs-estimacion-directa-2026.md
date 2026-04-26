# Worksheet — `modulos-vs-estimacion-directa-2026`

> Sprint #7 · Tipo: **rewrite-completo** · Score: 3 · WC actual: 1294  
> Categoría: Fiscalidad · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `BOI/FinCEN`

## Título y meta SEO actuales

- **Title:** Módulos vs estimación directa 2026: cuál te conviene como autónomo
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Módulos vs estimación directa 2026: cuál te conviene como…` · `Análisis práctico de módulos vs estimación directa 2026: cuál te conviene como autónomo con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta …`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> El régimen de tributación que escoges como autónomo determina cómo calculas tu IRPF y tu IVA, qué documentación tienes que llevar y, sobre todo, cuánto pagas al final del año. En España coexisten dos grandes opciones: mó…

## Gancho objetivo (rewrite-completo)

> **Si facturas > 250.000€ a empresarios o > 150.000€ totales (cualquier cliente) en 2026 quedas excluido de módulos automáticamente (RD 1065/2007 art. 32-bis); el régimen de estimación directa simplificada se vuelve obligatorio y los pagos fraccionados se calculan al 20% del rendimiento neto trimestral (Modelo 130) en lugar del % fijo del módulo.**

### Dato concreto a usar en los primeros 100 palabras

Umbrales 2026 estimación objetiva (módulos): rendimientos íntegros ≤ 250.000€ totales o 125.000€ a empresarios (Orden HFP/1115/2024); compras ≤ 250.000€/año; resto del límite mantenido en Ley 9/2017. Estimación directa simplificada: amortización tabla simplificada art. 30 RIRPF, gastos de difícil justificación 5% (máx. 2.000€).

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

1. "¿Puedo elegir estimación directa aunque cumpla módulos?" → Sí: renuncia vía Modelo 036 antes del 31 de diciembre del año previo; vinculación 3 años.
2. "¿Módulos siempre paga menos?" → Sólo si rindes por debajo del módulo unitario; si tu margen real supera el módulo, módulos paga más que directa.
3. "¿Qué pasa si supero el umbral en Q3?" → Sales del régimen al año siguiente, no al instante; pero declaras Q4 ya con riesgo de comprobación.
4. "¿Estimación directa simplificada o normal?" → Simplificada hasta 600.000€/año cifra de negocios; normal obligatoria por encima.


## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: irs.gov, boe.es.
- Expandir de 1294 a ≥2.500 palabras (faltan ~1206). Añadir secciones específicas según el tema: FAQ con objeciones reales + caso real anonimizado + checklist accionable.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [FinCEN — BOI home](https://www.fincen.gov/boi) — `<a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">FinCEN — BOI home</a>`
- [FinCEN — BOI FAQ](https://www.fincen.gov/boi-faqs) — `<a href="https://www.fincen.gov/boi-faqs" target="_blank" rel="noopener">FinCEN — BOI FAQ</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `book_consultation` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "book_consultation").
- **Mid-article:** variante `free_consult` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `free_consult`).
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
- [ ] CTA cierre patrón `book_consultation` verbatim.
- [ ] Mid-CTA variante `free_consult`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
