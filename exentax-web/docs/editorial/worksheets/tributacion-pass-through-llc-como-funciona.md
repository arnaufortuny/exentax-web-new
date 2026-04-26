# Worksheet — `tributacion-pass-through-llc-como-funciona`

> Sprint #4 · Tipo: **rewrite-completo** · Score: 26 · WC actual: 2392  
> Categoría: Fiscalidad · Verdict: FALLA (longitud-insuficiente)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** Pass-Through de las LLC: qué es, cómo funciona y por qué es ventaja
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Pass-Through de las LLC: qué es, cómo funciona y por qué…` · `Análisis práctico de pass-through de las llc: qué es, cómo funciona y por qué es ventaja con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> Si alguien te ha dicho que con una LLC puedes pagar $0 de impuestos federales en Estados Unidos, no te estaba tomando el pelo. Es real, es legal, y tiene un nombre técnico: **tributación pass-through**. Es probablemente …

## Gancho objetivo (rewrite-completo)

> **Pass-through significa que la LLC NO paga impuesto de sociedades federal: el income "pasa" al owner que lo declara en su 1040 (residente) o 1040-NR (no residente con ETBUS); pero si eres no residente sin ETBUS y sin US-source income, no hay pass-through fiscal en EE. UU. — toda la tributación queda en tu país residencia.**

### Dato concreto a usar en los primeros 100 palabras

Treas. Reg. §301.7701-3 ("check-the-box"): single-member LLC clasificada por defecto como "disregarded entity" (gastos al owner directamente); multi-member LLC clasificada por defecto como partnership (Form 1065 + K-1 a cada miembro). Elección a corporation vía Form 8832; a S-Corp vía Form 2553 (sólo US persons o residentes).

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

1. "¿Si soy no residente y la LLC factura $100K, pago algo en US?" → Sólo si hay ETBUS o US-source income (FDIC, dividendos, alquileres); si todo es servicio prestado fuera de US a clientes no-US, federal income tax 0%.
2. "¿Multi-member LLC con 2 no residentes funciona?" → Sí: partnership por defecto; Form 1065 + K-1 a cada miembro; sin ETBUS, los miembros no rellenan 1040-NR.
3. "¿Si elegimos corporation perdemos pass-through?" → Sí: la C-Corp tributa 21% IS federal y luego dividendo grava de nuevo (doble imposición); útil sólo si planeas reinvertir todo o atraer VCs.
4. "¿La SMLLC de un residente puede tener pass-through a Schedule C como una de no residente?" → Sí, pero el residente paga self-employment tax (15.3%) y el no residente no.


## Plan de corrección del audit

- Expandir de 2392 a ≥2.500 palabras (faltan ~108). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales.

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
