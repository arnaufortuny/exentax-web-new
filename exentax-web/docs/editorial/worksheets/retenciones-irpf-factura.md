# Worksheet — `retenciones-irpf-factura`

> Sprint #8 · Tipo: **rewrite-completo** · Score: 3 · WC actual: 1751  
> Categoría: Fiscalidad · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `AEAT/IRPF` · `Facturación`

## Título y meta SEO actuales

- **Title:** Retenciones de IRPF en la factura: cuándo, cuánto y modelos 111/115/130
- **Meta sugerida (60ch / 140ch):** `Retenciones de IRPF en la factura: cuándo, cuánto y model…` · `Análisis práctico de retenciones de irpf en la factura: cuándo, cuánto y modelos 111/115/130 con cifras oficiales 2026, plazos IRS/AEAT y la lectura hon…`

## Primer párrafo actual (auditoría)

> Las retenciones de IRPF en factura son la manera que tiene Hacienda de cobrar a cuenta tu impuesto sin esperar al cierre del ejercicio. Si eres autónomo profesional y tu cliente es empresa o autónomo, tu factura debe inc…

## Gancho objetivo (rewrite-completo)

> **Como autónomo en España aplicas 7% de retención en tus 2 primeros años desde alta (RD 1804/2008) y 15% después; pero si tu cliente es persona física que no actúa como empresario (B2C) NO retienes nada, y eso suele confundir hasta a contables senior.**

### Dato concreto a usar en los primeros 100 palabras

Retención IRPF en factura de profesional autónomo (LIRPF art. 101): 15% general; 7% durante el año de inicio + 2 años siguientes (RD 439/2007 art. 95.1); B2B obligatorio cuando cliente es empresario o profesional con obligación de retener (LGT art. 23); B2C no procede retención.

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

1. "¿Aplico 7% si reactivo el alta tras varios años?" → Sólo si han pasado al menos 12 meses desde la baja anterior (consulta vinculante DGT V0867-12); si no, sigues con el 15%.
2. "¿Si trabajo para cliente extranjero retengo igual?" → No: clientes no residentes sin establecimiento permanente en España no tienen obligación de retener; tú declaras el ingreso íntegro.
3. "¿La retención cuenta como pago a cuenta de mi IRPF anual?" → Sí: la suma de retenciones aparece en tu Renta vía 190 cliente y se descuenta de la cuota total.
4. "¿Servicios artísticos o agrarios tienen retención distinta?" → Sí: rentas de actividades profesionales agrícolas 2% (RD 439/2007 art. 95.4), determinadas actividades artísticas hasta 19%; consultar tabla específica.


## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: agenciatributaria.gob.es, boe.es.
- Expandir de 1751 a ≥2.500 palabras (faltan ~749). Añadir secciones específicas según el tema: comparativa cuantitativa por tramo de ingresos + Modelo a presentar.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [AEAT — sede electrónica](https://sede.agenciatributaria.gob.es) — `<a href="https://sede.agenciatributaria.gob.es" target="_blank" rel="noopener">AEAT — sede electrónica</a>`
- [BOE — LIRPF (Ley 35/2006)](https://www.boe.es/eli/es/l/2006/11/28/35/con) — `<a href="https://www.boe.es/eli/es/l/2006/11/28/35/con" target="_blank" rel="noopener">BOE — LIRPF (Ley 35/2006)</a>`
- [Petete (DGT)](https://petete.tributos.hacienda.gob.es) — `<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">Petete (DGT)</a>`
- [AEAT — facturación electrónica](https://sede.agenciatributaria.gob.es/Sede/factura-electronica.html) — `<a href="https://sede.agenciatributaria.gob.es/Sede/factura-electronica.html" target="_blank" rel="noopener">AEAT — facturación electrónica</a>`
- [BOE — RD 1619/2012 (Reglamento facturación)](https://www.boe.es/eli/es/rd/2012/11/30/1619/con) — `<a href="https://www.boe.es/eli/es/rd/2012/11/30/1619/con" target="_blank" rel="noopener">BOE — RD 1619/2012 (Reglamento facturación)</a>`

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
