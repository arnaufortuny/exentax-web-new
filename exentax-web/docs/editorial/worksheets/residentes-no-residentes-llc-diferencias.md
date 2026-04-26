# Worksheet — `residentes-no-residentes-llc-diferencias`

> Sprint #1 · Tipo: **rewrite-completo** · Score: 102 · WC actual: 2363  
> Categoría: Fiscalidad · Verdict: FALLA (gancho-generico, datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** LLC para residentes y no residentes de EE.UU.: diferencias clave
- **Meta sugerida (60ch / 140ch):** `LLC para residentes y no residentes de EE.UU.: diferencia…` · `Análisis práctico de llc para residentes y no residentes de ee.uu.: diferencias clave con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta de…`

## Primer párrafo actual (auditoría)

> No es lo mismo tener una LLC siendo residente de Estados Unidos que siendo no residente. La estructura legal es la misma, pero la **fiscalidad y las obligaciones** cambian radicalmente.…

## Gancho objetivo (rewrite-completo)

> **Mismo Wyoming LLC, mismo EIN: el residente paga 0% federal y el no residente puede pagar 0% O 30% retenido en origen — la diferencia depende de si tiene ECI o FDAP**

### Dato concreto a usar en los primeros 100 palabras

$25,000 USD/año por Form 5472 omitido aplica solo a la LLC propiedad de no residentes (IRC §6038A); el residente declara con Schedule C en su 1040 y no toca el 5472 nunca

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

1. "Si soy residente y mi LLC es disregarded, ¿realmente no necesito el 5472?" → No, el 5472 sólo aplica si hay 25% foreign ownership.
2. "¿Y si tengo green card pero vivo fuera 11 meses al año?" → Sigues siendo US person mientras tengas green card; el día que la entregues (Form I-407) cambia el régimen.
3. "¿La SMLLC de un residente puede tener pass-through a Schedule C como una de no residente?" → Sí, pero el residente paga self-employment tax (15.3%) y el no residente no.
4. "¿Necesito ITIN si soy residente?" → No, tienes SSN. El ITIN es exclusivo para no residentes sin SSN.

## Plan de corrección del audit

- Reescribir el primer párrafo (motivo: primer párrafo sin cifra, año o pregunta-objeción). Abrir con la objeción, cifra o pregunta más punzante del tema "LLC para residentes y no residentes de EE.UU.: diferencias clave" — no con definición ni con "En este artículo".
- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.
- Expandir de 2363 a ≥2.500 palabras (faltan ~137). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

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
