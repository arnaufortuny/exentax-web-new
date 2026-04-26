# Worksheet — `criptomonedas-trading-llc-impuestos`

> Sprint #5 · Tipo: **rewrite-completo** · Score: 21 · WC actual: 2805  
> Categoría: Fiscalidad · Verdict: FALLA (datos-sin-fuente)  
> Tags temáticos: `LLC/IRS` · `Cripto/Trading`

## Título y meta SEO actuales

- **Title:** Criptomonedas y trading con LLC: fiscalidad completa para traders
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Criptomonedas y trading con LLC: fiscalidad completa para…` · `Análisis práctico de criptomonedas y trading con llc: fiscalidad completa para traders con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta d…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> El trading de criptomonedas genera obligaciones fiscales que muchos traders ignoran, hasta que las autoridades fiscales llaman a la puerta. Si operas con Bitcoin, Ethereum, stablecoins o cualquier otro criptoactivo, nece…

## Gancho objetivo (rewrite-completo)

> **Tradear cripto a través de una LLC US no exime del IRS: cada swap (BTC→ETH) es taxable event como capital gain, el IRS introdujo 1099-DA obligatorio para brokers desde 2025 (Form 1099-DA, Notice 2024-56), y residentes en España sumáis Modelo 721 (informativa de cripto en exchanges no españoles, sanción mínima 300€).**

### Dato concreto a usar en los primeros 100 palabras

IRS Form 1099-DA obligatorio para brokers de criptoactivos a partir de operaciones realizadas desde el 1 de enero de 2025 (Notice 2024-56); en España, Modelo 721 (RD 249/2023) exige declarar saldos cripto > 50.000€ en exchanges extranjeros antes del 31 de marzo del año siguiente.

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

1. "¿Si la LLC es disregarded el residente fiscal español tributa al 19-26% como ganancia patrimonial?" → Sí: la AEAT mira el subyacente; cada swap es alteración patrimonial computada en EUR al tipo del día.
2. "¿Wash sale rule aplica a cripto?" → A enero 2026 sigue sin aplicar (IRC §1091 sólo cubre securities); permitido vender BTC en pérdida y recomprar inmediatamente para realizar la pérdida.
3. "¿Staking rewards son income desde día 1?" → Sí: Rev. Rul. 2023-14 confirma que rewards de staking son ordinary income al fair market value el día que el contribuyente toma control.
4. "¿Puedo usar Coinbase Business con LLC no residente?" → Sí (Coinbase Prime exige KYB del beneficial owner); algunas exchanges como Kraken Pro restringen a residentes US verificados.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 0). Sugeridos según el tema: irs.gov, fincen.gov.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`
- [IRS — Digital assets](https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets" target="_blank" rel="noopener">IRS — Digital assets</a>`
- [AEAT — Modelo 721 (cripto)](https://sede.agenciatributaria.gob.es/Sede/declaraciones-informativas/modelo-721-declaracion-informativa-monedas-virtuales-situadas-extranjero.html) — `<a href="https://sede.agenciatributaria.gob.es/Sede/declaraciones-informativas/modelo-721-declaracion-informativa-monedas-virtuales-situadas-extranjero.html" target="_blank" rel="noopener">AEAT — Modelo 721 (cripto)</a>`

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
