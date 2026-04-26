# Worksheet — `separar-dinero-personal-llc-por-que-importa`

> Sprint #4 · Tipo: **rewrite-completo** · Score: 28 · WC actual: 4389  
> Categoría: Operativa · Verdict: FALLA (gancho-generico)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** Separar dinero personal y de tu LLC: por qué importa y cómo hacerlo
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Separar dinero personal y de tu LLC: por qué importa y có…` · `Análisis práctico de separar dinero personal y de tu llc: por qué importa y cómo hacerlo con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (54ch):** `Separar dinero LLC vs personal: piercing the veil real`
- **Candidato metaDescription (142ch):** `Doctrina alter ego desde Walkovszky 1966, charging order Wyoming exclusivo y por qué un cargo personal accidental ya suma evidencia en juicio.`

## Primer párrafo actual (auditoría)

> Si tienes una LLC en Estados Unidos, una de las mejores prácticas que puedes adoptar desde el primer día es mantener una separación clara entre tu dinero personal y el dinero de tu empresa. Es una práctica profesional qu…

## Gancho objetivo (rewrite-completo)

> **Mezclar 1 sólo gasto personal en la cuenta de la LLC ("commingling") basta para que un juez aplique "piercing the corporate veil" en disputa civil US — y entonces toda tu protección patrimonial desaparece. La doctrina alter ego (Walkovszky v. Carlton, NY 1966) sigue vigente y la usan en cobros judiciales contra LLCs no residentes.**

### Dato concreto a usar en los primeros 100 palabras

Doctrina "piercing the corporate veil" / "alter ego": criterios consolidados (Walkovszky v. Carlton 18 NY 2d 414, 1966; restated en Restatement Third of Agency §7.01): commingling de fondos, falta de capitalización adecuada, no observancia de formalidades, uso para evadir obligaciones personales. Aplica a LLCs single-member en 47 estados con jurisprudencia estatal específica.

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

1. "¿1 cargo accidental con tarjeta personal por la LLC rompe todo?" → No automáticamente, pero suma evidencia. Documentar como "owner contribution" en libro contable y devolver al owner en el siguiente extracto reduce el riesgo.
2. "¿Y si la LLC tiene cuenta única y yo soy single-member?" → Mantén separación funcional: la cuenta de la LLC sólo paga gastos del business; los retiros al owner se documentan como "distribution" o "owner draw" en libro contable.
3. "¿Necesito operating agreement aunque sea single-member?" → Sí: 5 estados (CA, NY, MO, ME, DE) lo exigen estatutariamente; el resto lo recomiendan como evidencia anti-piercing.
4. "¿La protección patrimonial de Wyoming es mayor que la de Delaware?" → Sí en charging order: Wyoming reconoce charging order como "exclusive remedy" para acreedores del miembro (WY Stat §17-29-503); Delaware sólo lo hace para multi-member LLC.


## Plan de corrección del audit

- Reescribir el primer párrafo (motivo: abre con definición o frase boilerplate sin gancho concreto). Abrir con la objeción, cifra o pregunta más punzante del tema "Separar dinero personal y de tu LLC: por qué importa y cómo hacerlo" — no con definición ni con "En este artículo".

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`

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
