# Worksheet — `amazon-ecommerce-llc-vender-online`

> Sprint #5 · Tipo: **rewrite-completo** · Score: 22 · WC actual: 2247  
> Categoría: Operativa · Verdict: FALLA (datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** Amazon y ecommerce con LLC: cómo vender online desde cualquier país
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Amazon y ecommerce con LLC: cómo vender online desde cual…` · `Análisis práctico de amazon y ecommerce con llc: cómo vender online desde cualquier país con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> Si quieres vender productos (físicos o digitales) en Amazon, Shopify, Etsy o cualquier plataforma de ecommerce, tener una <a href="/es/blog/constituir-llc-proceso-paso-a-paso">LLC en Estados Unidos</a> te abre puertas qu…

## Gancho objetivo (rewrite-completo)

> **Vender en Amazon US con LLC no te exime del sales tax: Wayfair v. South Dakota (2018) obliga a recaudar en cualquier estado donde superes 200 transacciones o $100K — y Amazon retiene por ti en 47 estados pero NO en 3 (Alaska, Delaware, Montana, Oregón sin sales tax base, plus Missouri sólo desde 2023).**

### Dato concreto a usar en los primeros 100 palabras

South Dakota v. Wayfair (2018) fijó el umbral de nexo económico en $100,000 ventas o 200 transacciones por estado/año; Amazon como Marketplace Facilitator recauda y remite en 47 estados pero no exime al seller del informe consolidado (Form 1099-K si > $5,000/año en 2026).

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

1. "¿Si Amazon recauda el sales tax, sigo necesitando seller permit?" → Sí en algunos estados (California, Texas, Colorado) aunque Amazon facilite — porque la responsabilidad legal de registro recae en el seller residente o foreign seller con nexo.
2. "¿Mi LLC Wyoming/NM puede vender en Amazon.com?" → Sí, pero necesitas EIN, dirección US física (no PO Box) y cuenta bancaria US; Amazon Seller Account ya no acepta IBAN europeo desde 2022.
3. "¿Y si vendo a través de FBA con stock en almacén US?" → Triggers nexo físico inmediato en cualquier estado donde Amazon almacene; tienes que registrarte y reportar income tax estatal aunque la LLC no tenga otros vínculos.
4. "¿Pago income tax en EE. UU. siendo no residente vendiendo en Amazon?" → Si no tienes ETBUS (Engaged in Trade or Business in US), no pagas federal income tax; pero si Amazon FBA almacena tu mercancía, IRS puede sostener que sí hay ETBUS. Consultar.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.
- Expandir de 2247 a ≥2.500 palabras (faltan ~253). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

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
