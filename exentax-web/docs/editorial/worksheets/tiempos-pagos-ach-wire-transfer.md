# Worksheet — `tiempos-pagos-ach-wire-transfer`

> Sprint #7 · Tipo: **rewrite-completo** · Score: 4 · WC actual: 2441  
> Categoría: Operativa · Verdict: FALLA (longitud-insuficiente)  
> Tags temáticos: `Operativa-LLC`

## Título y meta SEO actuales

- **Title:** ¿Cuánto tardan los pagos ACH y Wire Transfer? Tiempos reales
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `¿Cuánto tardan los pagos ACH y Wire Transfer? Tiempos reales` · `Análisis práctico de ¿cuánto tardan los pagos ach y wire transfer? tiempos reales con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del eq…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (50ch):** `ACH vs wire transfer: tiempos y costes reales 2026`
- **Candidato metaDescription (135ch):** `ACH 1-3 días $0-5, same-day cut-off 4:45pm ET, wire same-day $20-45 y por qué a internacional sólo SWIFT funciona. Reversibilidad real.`

## Primer párrafo actual (auditoría)

> Una de las preguntas más frecuentes cuando empiezas a operar tu LLC es: "Le mandé dinero a un cliente, ¿cuándo llega?" O al revés: "Me van a pagar, ¿cuándo lo veo en mi cuenta?"…

## Gancho objetivo (rewrite-completo)

> **ACH tarda 1-3 días business y cuesta $0-5 (NACHA rules); domestic wire llega el mismo día por $20-45; international wire 1-5 días + spread FX 1-3% del monto. Para cobrar de cliente US a tu Mercury, ACH es la opción default; para enviar a tu cuenta española, sólo wire (con o sin Wise como intermediario) funciona.**

### Dato concreto a usar en los primeros 100 palabras

NACHA Operating Rules 2026: ACH same-day disponible desde 2016 (cut-off 4:45pm ET) por $1-5 extra; Standard ACH 1-3 days settlement. Fedwire: SLA same-day si origen antes de 6pm ET; coste medio domestic $20-45, international $35-60 + IBAN/SWIFT relay. International wire UE: SEPA Instant gratuito intra-EUR; SWIFT global 1-5 días con spread del banco intermediario 0.5-3%.

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

1. "¿ACH internacional existe?" → No: ACH es exclusivo US (NACHA); para enviar fuera necesitas wire SWIFT o servicio fintech (Wise) que internamente usa ACH local + corresponsal extranjero.
2. "¿Wire reversible?" → No: una vez settled (mismo día) el wire es final; sólo recall vía banco origen si beneficiary no ha retirado; ACH sí reversible 60 días.
3. "¿Por qué Wise tarda 0-2 días si dice "instant"?" → El leg local (ACH US o SEPA EU) es instantáneo; el cambio de divisa y matching interno toma horas-días según el corredor.
4. "¿Un wire de $50K levanta sospechas?" → Por encima de $10K activa CTR (Currency Transaction Report) FinCEN automático; legal pero el banco puede pedir source-of-funds.


## Plan de corrección del audit

- Expandir de 2441 a ≥2.500 palabras (faltan ~59). Añadir secciones específicas según el tema: FAQ con objeciones reales + caso real anonimizado + checklist accionable.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [FinCEN — BOI](https://www.fincen.gov/boi) — `<a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">FinCEN — BOI</a>`

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
