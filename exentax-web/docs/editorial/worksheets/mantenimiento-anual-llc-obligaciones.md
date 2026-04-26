# Worksheet — `mantenimiento-anual-llc-obligaciones`

> Sprint #3 · Tipo: **rewrite-completo** · Score: 39 · WC actual: 3267  
> Categoría: Compliance · Verdict: FALLA (exentax-forzado)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** Mantenimiento anual de tu LLC: obligaciones, plazos y costes
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Mantenimiento anual de tu LLC: obligaciones, plazos y costes` · `Análisis práctico de mantenimiento anual de tu llc: obligaciones, plazos y costes con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del eq…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> Constituir una LLC es solo el primer paso. Para que tu empresa siga activa, en regla y con el Good Standing intacto, hay obligaciones anuales que debes cumplir. La buena noticia: en Exentax nos encargamos de absolutament…

## Gancho objetivo (rewrite-completo)

> **Mantener una LLC en good standing cuesta entre $110/año (Wyoming: $60 annual report + $50 RA) y $850/año (Delaware: $300 franchise tax + $50 annual report + $50-150 RA + tax fees) — más el filing federal IRS Form 5472 + 1120 pro-forma con sanción de $25,000 si se omite.**

### Dato concreto a usar en los primeros 100 palabras

Annual report fees por estado 2026: Wyoming $60 (jul 1), Nuevo México $0 (sin annual report), Delaware $300 franchise + $50 annual report (jun 1), Florida $138.75 (may 1); BOI report obligatorio para "domestic reporting companies" desde 2024 en 30 días desde cualquier cambio (FinCEN, sanción $591/día tras Inflation Adjustment 2024).

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
12. **CTA** — bloque cerrado canónico (`compliance_checkup`).

## Objeciones a resolver (mínimo 3, ideal 5)

1. "¿Si pierdo el good standing puedo recuperarlo?" → Sí, vía reinstatement filing + back-fees + late penalty; puede tardar 4-12 semanas, durante las cuales no puedes operar.
2. "¿Necesito pagar state income tax si no tengo nexo?" → No estados sin income tax (WY, NV, FL, TX, SD); en NM, DE etc. sí hay annual filing aunque no haya income.
3. "¿La extensión Form 7004 es automática?" → Sí, si la presentas antes del 15 de abril; sin ella, la sanción se devenga.
4. "¿BOI sigue vigente en 2026?" → Sí para domestic reporting companies; el alcance se redujo en marzo 2025 (excluyó a foreign reporting companies por interim rule), pero las US-formed siguen obligadas con sanción $591/día.


## Plan de corrección del audit

- Reducir y reposicionar las 25 menciones a Exentax: dejarlas solo donde aparezcan como consecuencia lógica del argumento, no como recordatorio comercial repetido.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `compliance_checkup` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "compliance_checkup").
- **Mid-article:** variante `talk_to_team` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `talk_to_team`).
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
- [ ] CTA cierre patrón `compliance_checkup` verbatim.
- [ ] Mid-CTA variante `talk_to_team`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
