# Worksheet — `itin-ssn-que-son-como-obtenerlos`

> Sprint #4 · Tipo: **rewrite-completo** · Score: 26 · WC actual: 2857  
> Categoría: Guías · Verdict: FALLA (datos-sin-fuente)  
> Tags temáticos: `ITIN`

## Título y meta SEO actuales

- **Title:** ITIN y SSN: qué son, cuál necesitas y cómo obtenerlos para tu LLC
- **Meta sugerida (60ch / 140ch):** `ITIN y SSN: qué son, cuál necesitas y cómo obtenerlos par…` · `Análisis práctico de itin y ssn: qué son, cuál necesitas y cómo obtenerlos para tu llc con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta d…`

## Primer párrafo actual (auditoría)

> Cuando empiezas a moverte en el mundo de las LLC americanas, enseguida aparecen dos siglas que generan confusión: ITIN y SSN. Suenan parecido, tienen 9 dígitos los dos, y ambos sirven para identificarte ante el IRS. Pero…

## Gancho objetivo (rewrite-completo)

> **Sin SSN ni ITIN no puedes presentar 1040-NR ni reclamar treaty benefits: SSN sólo emitido a residentes/visados de trabajo (SSA Form SS-5), ITIN para no residentes con obligación fiscal US (Form W-7 vía CAA o por correo a Austin TX, 7-11 semanas).**

### Dato concreto a usar en los primeros 100 palabras

SSN: emitido por SSA bajo SSI Act §205(c)(2)(B); requiere status migratorio válido (USC, LPR, work-authorized). ITIN: 9 dígitos formato 9XX-7X-XXXX o 9XX-8X-XXXX, gestionado por IRS bajo IRC §6109(i); Form W-7 + 1040-NR adjunto + pasaporte original o copia certificada CAA. Renovación cada 3 años si no se usa.

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
12. **CTA** — bloque cerrado canónico (`itin_help`).

## Objeciones a resolver (mínimo 3, ideal 5)

1. "¿Necesito ITIN si mi LLC es disregarded sin actividad efectiva US?" → No: el responsible party del SS-4 puede ser identificado por nombre+pasaporte; ITIN sólo se requiere si vas a presentar 1040-NR personal.
2. "¿Puedo solicitar ITIN online?" → No: el W-7 actual sigue requiriendo papel firmado a Austin, Texas. Los servicios "online" son intermediarios CAA.
3. "¿Cuánto tarda realmente?" → IRS oficial 7 semanas; realista 9-11 semanas en temporada de tax filing (enero-abril).
4. "¿Necesito enviar mi pasaporte original al IRS?" → No si usas un Certifying Acceptance Agent (CAA) reconocido; el CAA certifica copia y tú conservas el original.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — ITIN overview](https://www.irs.gov/individuals/individual-taxpayer-identification-number) — `<a href="https://www.irs.gov/individuals/individual-taxpayer-identification-number" target="_blank" rel="noopener">IRS — ITIN overview</a>`
- [IRS — Form W-7](https://www.irs.gov/forms-pubs/about-form-w-7) — `<a href="https://www.irs.gov/forms-pubs/about-form-w-7" target="_blank" rel="noopener">IRS — Form W-7</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `itin_help` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "itin_help").
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
- [ ] CTA cierre patrón `itin_help` verbatim.
- [ ] Mid-CTA variante `talk_to_team`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
