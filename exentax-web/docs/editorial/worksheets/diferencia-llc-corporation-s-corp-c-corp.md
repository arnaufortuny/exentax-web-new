# Worksheet — `diferencia-llc-corporation-s-corp-c-corp`

> Sprint #1 · Tipo: **rewrite-completo** · Score: 78 · WC actual: 2266  
> Categoría: Comparativas · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** LLC vs Corporation vs S-Corp vs C-Corp: guía 2026 para no residentes
- **Meta sugerida (60ch / 140ch):** `LLC vs Corporation vs S-Corp vs C-Corp: guía 2026 para no…` · `Análisis práctico de llc vs corporation vs s-corp vs c-corp: guía 2026 para no residentes con cifras oficiales 2026, plazos IRS/AEAT y la lectura honest…`

## Primer párrafo actual (auditoría)

> Cuando alguien dice "empresa americana", la mayoría imagina una LLC; otros, una "corporation". La realidad es que en EE. UU. existen cuatro vehículos principales para hacer negocios: **LLC**, **Corporation**, **S-Corpora…

## Gancho objetivo (rewrite-completo)

> **Una LLC puede tributar como las 4 cosas a la vez (disregarded, partnership, S-Corp, C-Corp) según el Form 8832 que firmes — y esa elección vale o cuesta decenas de miles de dólares anuales**

### Dato concreto a usar en los primeros 100 palabras

C-Corp paga 21% federal flat (TCJA 2017) sobre beneficios + 15-20% adicional al distribuir dividendos; S-Corp evita doble imposición pero está vetada para no residentes (sólo US persons o residentes pueden ser shareholders)

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

1. "¿Una S-Corp paga menos impuestos que una LLC?" → Para muchos US persons sí, vía split de salary + distribution. Para no residentes no aplica.
2. "¿Por qué los startups de Sand Hill Road siempre son Delaware C-Corp?" → Por el Court of Chancery, el pool de stock options con ISOs y la familiaridad de los VCs. No por impuestos.
3. "¿Puedo cambiar de LLC a C-Corp después?" → Sí, vía Form 8832 (check-the-box) o conversion estatutaria; conserva EIN.
4. "¿La S-Corp protege patrimonio igual que la LLC?" → Sí en la mayoría de estados, pero con menos flexibilidad operativa.

## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 1). Sugeridos según el tema: irs.gov, fincen.gov.
- Expandir de 2266 a ≥2.500 palabras (faltan ~234). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `llc_state_compare` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "llc_state_compare").
- **Mid-article:** variante `discover_llc` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `discover_llc`).
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
- [ ] CTA cierre patrón `llc_state_compare` verbatim.
- [ ] Mid-CTA variante `discover_llc`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
