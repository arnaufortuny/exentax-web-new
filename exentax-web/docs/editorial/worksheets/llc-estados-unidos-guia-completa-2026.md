# Worksheet — `llc-estados-unidos-guia-completa-2026`

> Sprint #1 · Tipo: **rewrite-completo** · Score: 56 · WC actual: 4106  
> Categoría: Guías · Verdict: FALLA (gancho-generico)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** LLC en Estados Unidos: guía completa para no residentes en 2026
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `LLC en Estados Unidos: guía completa para no residentes e…` · `Análisis práctico de llc en estados unidos: guía completa para no residentes en 2026 con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> Una LLC (Limited Liability Company) es la estructura empresarial más utilizada por freelancers y emprendedores digitales no residentes que operan desde fuera de Estados Unidos. Combina protección patrimonial con una fisc…

## Gancho objetivo (rewrite-completo)

> **En 2026 la LLC americana es la herramienta más mal entendida del Reino emprendedor: 8 de cada 10 dueños de LLC creen que pagan 0% en todas partes — y descubren a los 18 meses que la atribución de rentas en residencia se les comió la mitad**

### Dato concreto a usar en los primeros 100 palabras

Tras la IFR de FinCEN de marzo 2025, las domestic LLCs ya no presentan BOI Report (ventaja competitiva); el calendario IRS sigue intacto: Form 5472 + 1120 pro-forma con vencimiento 15 abril, sanción 25,000 USD/año/forma

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
12. **CTA** — bloque cerrado canónico (`services_overview`).

## Objeciones a resolver (mínimo 3, ideal 5)

1. "¿La LLC me hace residente fiscal de EE. UU.?" → No: la LLC en sí no genera residencia fiscal. La residencia se determina por substantial presence test (días físicos en suelo US).
2. "¿Pago algo a Hacienda España por mi LLC?" → Sí: como residente fiscal en España tributas por las rentas atribuidas (LIRPF art. 87) o por dividendo, según el régimen.
3. "¿Cuánto tarda en estar operativa de verdad?" → 3-5 semanas end-to-end (filing + EIN + banca), no las 24h que prometen los servicios low-cost.
4. "¿Puedo cambiar de Wyoming a Nuevo México si me arrepiento?" → Sí, vía domestication; conserva EIN y banca.

## Plan de corrección del audit

- Reescribir el primer párrafo (motivo: abre con definición o frase boilerplate sin gancho concreto). Abrir con la objeción, cifra o pregunta más punzante del tema "LLC en Estados Unidos: guía completa para no residentes en 2026" — no con definición ni con "En este artículo".

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `services_overview` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "services_overview").
- **Mid-article:** variante `start_today` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `start_today`).
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
- [ ] CTA cierre patrón `services_overview` verbatim.
- [ ] Mid-CTA variante `start_today`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
