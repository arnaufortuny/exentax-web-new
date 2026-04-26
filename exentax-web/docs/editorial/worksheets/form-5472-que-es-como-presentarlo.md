# Worksheet — `form-5472-que-es-como-presentarlo`

> Sprint #2 · Tipo: **rewrite-completo** · Score: 55 · WC actual: 2907  
> Categoría: Compliance · Verdict: FALLA (datos-sin-fuente)  
> Tags temáticos: `IRS-Forms`

## Título y meta SEO actuales

- **Title:** Form 5472: qué es, quién lo presenta y cómo cumplir sin líos
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Form 5472: qué es, quién lo presenta y cómo cumplir sin líos` · `Análisis práctico de form 5472: qué es, quién lo presenta y cómo cumplir sin líos con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del eq…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (45ch):** `Form 5472 LLC no residente: $25K si lo omites`
- **Candidato metaDescription (137ch):** `Pro-forma 1120 + 5472 antes del 15 abril, IRC §6038A, transacciones reportables (incluye aportes de capital) y por qué TurboTax no sirve.`

## Primer párrafo actual (auditoría)

> Si tienes una LLC en Estados Unidos como no residente, el Form 5472 es una declaración informativa que el IRS solicita cada año. Suena intimidante, pero tranquilo: es papeleo informativo, no es un pago de impuestos, y en…

## Gancho objetivo (rewrite-completo)

> **25,000 USD por formulario y año: la sanción más previsible y más cara del calendario IRS para una LLC de no residente — y empieza a contar el 16 de abril sin aviso previo**

### Dato concreto a usar en los primeros 100 palabras

IRC §6038A + Treas. Reg. §1.6038A-1: Single-Member LLC con foreign owner ≥25% se trata como corporación a efectos del 5472 desde 2017; presentación obligatoria por correo certificado o fax al IRS Service Center de Ogden, Utah (no e-file)

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

1. "¿Y si mi LLC no movió un dólar este año?" → Sigues obligado al 5472 si hubo cualquier transacción reportable (incluido capital aportado o préstamo del owner).
2. "¿Puedo presentarlo yo en TurboTax?" → No: TurboTax y otros softwares de e-file no soportan el 1120 pro-forma + 5472 attached para LLCs disregarded.
3. "¿La extensión Form 7004 es automática?" → Sí, si la presentas antes del 15 de abril; sin ella, la sanción se devenga.
4. "¿Las llamadas del IRS a mi banco activan la sanción?" → No: la sanción la activa el IRS al notificarte la omisión; el banco es vehículo de cobro posterior.

## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — Form 5472](https://www.irs.gov/forms-pubs/about-form-5472) — `<a href="https://www.irs.gov/forms-pubs/about-form-5472" target="_blank" rel="noopener">IRS — Form 5472</a>`
- [IRS — Form 1120](https://www.irs.gov/forms-pubs/about-form-1120) — `<a href="https://www.irs.gov/forms-pubs/about-form-1120" target="_blank" rel="noopener">IRS — Form 1120</a>`
- [IRS — Form 7004 (extensión)](https://www.irs.gov/forms-pubs/about-form-7004) — `<a href="https://www.irs.gov/forms-pubs/about-form-7004" target="_blank" rel="noopener">IRS — Form 7004 (extensión)</a>`

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
- [ ] Entrada de cierre en `docs/editorial/sprints/SPRINT-LOG.md`.
