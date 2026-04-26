# Worksheet — `sociedad-limitada-espana-costes-ventajas`

> Sprint #8 · Tipo: **rewrite-completo** · Score: 3 · WC actual: 701  
> Categoría: Guías · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `IVA/VAT`

## Título y meta SEO actuales

- **Title:** Sociedad limitada en España 2026: costes, ventajas y comparativa con LLC
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Sociedad limitada en España 2026: costes, ventajas y comp…` · `Análisis práctico de sociedad limitada en españa 2026: costes, ventajas y comparativa con llc con cifras oficiales 2026, plazos IRS/AEAT y la lectura ho…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> Constituir una sociedad limitada (SL) sigue siendo el paso natural cuando un autónomo crece y empieza a sentir que el régimen personal le queda pequeño. Pero la SL no es siempre la mejor respuesta: arrastra costes fijos,…

## Gancho objetivo (rewrite-completo)

> **Constituir SL en España en 2026 cuesta entre 600€ (CIRCE telemático con socio único) y 1.500€ (notaría + registro + Modelo 600 + asesoría); pero el coste real es la cotización del administrador (340€/mes mínimo en RETA o nómina con SS empresa 30%) y el Impuesto Sociedades 23% del primer tramo (Ley 11/2020).**

### Dato concreto a usar en los primeros 100 palabras

Costes constitución SL 2026: capital mínimo 1€ desde Ley 18/2022 ("SL Express" o SLNE); notaría 80-300€, Registro Mercantil 60-150€, Modelo 600 ITP 1% (exento desde Ley 14/2013 art. 45.I.B.11 si capital ≤ 3.000€); IS tipo reducido 23% primeros 1M€ rendimiento neto (LIS art. 29.1, redacción Ley 11/2020).

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

1. "¿La SL me protege más que el autónomo?" → Sólo del riesgo civil empresarial; no del IRPF/IRS personal. El administrador único responde personalmente de deudas SS y AEAT en SL.
2. "¿Capital 1€ es real o necesito 3.000€?" → 1€ legal desde Ley 18/2022 con régimen SLNE/SL Express, pero pierdes acceso a línea ICO y financiación bancaria.
3. "¿Cuándo conviene SL frente a LLC US?" → SL si operas 100% en España con clientes españoles; LLC si > 50% facturación es internacional B2B y planificas residencia futura distinta a España.
4. "¿Pago IS aunque no reparta dividendo?" → Sí: el IS grava el beneficio del ejercicio; el dividendo a posteriori tributa de nuevo en IRPF socio (rentas del capital mobiliario 19-28%).


## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: agenciatributaria.gob.es, boe.es.
- Expandir de 701 a ≥2.500 palabras (faltan ~1799). Añadir secciones específicas según el tema: FAQ con objeciones reales + caso real anonimizado + checklist accionable.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [AEAT — IVA](https://sede.agenciatributaria.gob.es/Sede/iva.html) — `<a href="https://sede.agenciatributaria.gob.es/Sede/iva.html" target="_blank" rel="noopener">AEAT — IVA</a>`
- [Comisión Europea — VAT rules](https://ec.europa.eu/taxation_customs/taxation-1/value-added-tax-vat_en) — `<a href="https://ec.europa.eu/taxation_customs/taxation-1/value-added-tax-vat_en" target="_blank" rel="noopener">Comisión Europea — VAT rules</a>`

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
