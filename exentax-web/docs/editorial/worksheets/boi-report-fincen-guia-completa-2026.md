# Worksheet — `boi-report-fincen-guia-completa-2026`

> Sprint #2 · Tipo: **rewrite-completo** · Score: 52 · WC actual: 2634  
> Categoría: Compliance · Verdict: FALLA (objeciones-no-resueltas, datos-sin-fuente)  
> Tags temáticos: `BOI/FinCEN`

## Título y meta SEO actuales

- **Title:** BOI Report (FinCEN): guía completa para dueños de LLC en 2026
- **Meta sugerida (60ch / 140ch):** `BOI Report (FinCEN): guía completa para dueños de LLC en…` · `Análisis práctico de boi report (fincen): guía completa para dueños de llc en 2026 con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del e…`

## Primer párrafo actual (auditoría)

> El BOI Report (Beneficial Ownership Information Report o BOIR) es una declaración ante FinCEN (Financial Crimes Enforcement Network) que identifica a los propietarios beneficiarios reales de determinadas empresas registr…

## Gancho objetivo (rewrite-completo)

> **En marzo 2025 FinCEN dio un giro de 180º con su Interim Final Rule: las domestic LLCs (formadas en EE. UU.) ya NO presentan BOI Report — sólo las foreign reporting companies. Si presentaste BOI antes, conserva el acuse**

### Dato concreto a usar en los primeros 100 palabras

IFR de FinCEN de marzo 2025 (publicada en Federal Register, 31 CFR 1010.380) restringe la obligación a "foreign reporting companies"; el régimen anterior (sanción 591 USD/día acumulativos) sigue vigente para ese subconjunto

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

1. "¿Y si la regla cambia otra vez?" → Plausible: el caso NSBA v. Yellen sigue en apelación. Hay que monitorizar fincen.gov en cada presentación.
2. "¿Qué pasa con los BOI ya presentados antes de marzo 2025?" → Conserva el acuse; no hay que retirarlo, simplemente no necesitas actualizarlo.
3. "¿Una foreign-formed LLC registrada como foreign en otro estado sigue presentando?" → Sí, esa es exactamente la "foreign reporting company" del nuevo perímetro.
4. "¿Tengo que volver a presentar si cambia mi dirección?" → Sólo si tu LLC entra en el perímetro vigente. Si es domestic, no.

## Plan de corrección del audit

- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [FinCEN — BOI home](https://www.fincen.gov/boi) — `<a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">FinCEN — BOI home</a>`
- [FinCEN — BOI FAQ](https://www.fincen.gov/boi-faqs) — `<a href="https://www.fincen.gov/boi-faqs" target="_blank" rel="noopener">FinCEN — BOI FAQ</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `compliance_checkup` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "compliance_checkup").
- **Mid-article:** variante `talk_to_team` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `talk_to_team`).
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
- [ ] CTA cierre patrón `compliance_checkup` verbatim.
- [ ] Mid-CTA variante `talk_to_team`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
