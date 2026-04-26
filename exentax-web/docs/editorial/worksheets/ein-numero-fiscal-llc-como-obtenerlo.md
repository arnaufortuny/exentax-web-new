# Worksheet — `ein-numero-fiscal-llc-como-obtenerlo`

> Sprint #3 · Tipo: **rewrite-completo** · Score: 52 · WC actual: 2721  
> Categoría: Guías · Verdict: FALLA (datos-sin-fuente)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** EIN: qué es el número fiscal de tu LLC y cómo obtenerlo paso a paso
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `EIN: qué es el número fiscal de tu LLC y cómo obtenerlo p…` · `Análisis práctico de ein: qué es el número fiscal de tu llc y cómo obtenerlo paso a paso con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (54ch):** `EIN para LLC sin SSN/ITIN: fax 6 semanas o llamada IRS`
- **Candidato metaDescription (131ch):** `Form SS-4 al fax 855-641-6935 o teléfono +1-267-941-1099, qué poner en línea 10 y por qué el portal online no acepta no residentes.`

## Primer párrafo actual (auditoría)

> El EIN (Employer Identification Number) es el número de identificación fiscal que el IRS asigna a tu LLC. Piensa en él como el NIF o CIF de tu empresa en Estados Unidos. Sin este número, tu LLC existe legalmente pero no …

## Gancho objetivo (rewrite-completo)

> **El EIN para LLC de no residente sin SSN/ITIN sólo se obtiene por fax (4-6 semanas) o teléfono al +1-267-941-1099 (M-F 6am-11pm ET, espera 30-90 min) — no por el portal IRS online, que sí funciona si firmas con tu SSN/ITIN/EIN previo.**

### Dato concreto a usar en los primeros 100 palabras

Form SS-4 para LLC sin SSN/ITIN del responsible party: vía fax al +1 855-641-6935 (típico 4-6 semanas en 2026) o llamada internacional +1-267-941-1099 (recibes EIN al colgar); el portal IRS online (sa.www4.irs.gov/modiein) exige SSN/ITIN/EIN previo del responsible party.

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

1. "¿Puedo poner el EIN del registered agent como responsible party?" → No: el responsible party debe ser la persona física con control efectivo (beneficial owner), no una entidad.
2. "¿Tarda 6 semanas siempre?" → En temporada baja (mayo-octubre) 3-4 semanas por fax; enero-abril sube a 8-10. Vía teléfono sale en 1 llamada.
3. "¿Puedo pedir el EIN antes de tener el certificate of formation?" → No: el SS-4 línea 8a requiere fecha de formación y estado; sin filing aprobado no procede.
4. "¿Qué pongo en SS-4 línea 10 (reason for applying)?" → "Started new business" para LLC nueva; "Banking purpose only" si planeas operar disregarded sin actividad inmediata.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.

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
- [ ] Entrada de cierre en `docs/editorial/sprints/SPRINT-LOG.md`.
