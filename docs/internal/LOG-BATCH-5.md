# LOG-BATCH-5 — Limpieza de bloque completo + 10 slugs nuevos

**Fecha:** 2026-04-25 (Sesión 22)
**Objetivo:** corregir limpieza superficial del LOG-BATCH-4 (solo eliminó la apertura `<!-- exentax:review-anchor-v1 -->`, dejando el bloque `<aside>` con `[REVISIÓN MANUAL]` + el cierre `<!-- /exentax:review-anchor-v1 -->`) y procesar 10 slugs nuevos con limpieza completa de bloque.

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 462 | **402** (−60) |
| Anchor pendiente (slugs únicos) | 77 | **67** (−10) |
| Bloques `aside` con `[REVISIÓN MANUAL]` huérfanos en 10 slugs LOG-BATCH-4 | 60 | **0** |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |

---

## Operativa

### A. Re-limpieza de los 10 slugs del LOG-BATCH-4

La regex usada en LOG-BATCH-4 (`<!--\s*exentax:review-anchor-v1\s*-->`) solo eliminaba la apertura, dejando huérfano todo el bloque `<aside>` (con sus `<li>` `[REVISIÓN MANUAL]`) + el cierre `<!-- /exentax:review-anchor-v1 -->`. La nueva regex DOTALL `\n?<!--\s*exentax:review-anchor-v1\s*-->[\s\S]*?<!--\s*\/exentax:review-anchor-v1\s*-->\n?` elimina el bloque entero.

Re-procesados: errores-fiscales-freelancers-espanoles · modelo-720-721-residentes-espana-cuentas-cripto-extranjero · mantenimiento-anual-llc-obligaciones · tiempos-pagos-ach-wire-transfer · wise-iban-llc-que-reporta-hacienda · nomada-digital-residencia-fiscal · modulos-vs-estimacion-directa-2026 · errores-criticos-llc-ya-constituida · llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais · llc-seguridad-juridica-proteccion-patrimonial.

Total cierres huérfanos eliminados: 60.

### B. Limpieza completa de los 10 slugs nuevos

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `escalar-negocio-digital-llc-americana` | 6 idiomas | DE +102 |
| 2 | `empresa-reino-unido-uk-ltd` | 6 idiomas | — (todos ratio ≥ 0.85) |
| 3 | `empresa-panama-fiscalidad-residencia` | 6 idiomas | — |
| 4 | `empresa-bulgaria-10-tributacion` | 6 idiomas | — |
| 5 | `iban-swift-routing-number-que-son` | 6 idiomas | — |
| 6 | `due-diligence-bancario-llc-americana` | 6 idiomas | DE +74 |
| 7 | `hong-kong-offshore-realidad` | 6 idiomas | — |
| 8 | `testaferros-prestanombres-llc-ilegal-riesgos` | 6 idiomas | DE +139 / PT +96 |
| 9 | `llc-unica-estructura-holding-cuando-como-cuesta` | 6 idiomas | FR +88 / DE +249 / PT +183 / CA +134 |
| 10 | `holding-empresarial-como-funciona` | 6 idiomas | — |

Total bloques completos eliminados: 60. Total bloques locales insertados: 8.

---

## Bloques locales insertados (verificación oficial)

### `escalar-negocio-digital-llc-americana` — DE
- §19 UStG Kleinunternehmer €22.000 + §141 AO Buchführungspflicht €600.000/€60.000
- OSS Art. 369a–369k MwSt-RL B2C, §13b UStG Reverse-Charge B2B
- BMF 19.03.2004 Typenvergleich + §15 EStG transparente Zurechnung
- Austria §6 Abs. 1 Z 27 UStG €55.000

### `due-diligence-bancario-llc-americana` — DE
- Mercury/Relay docs requeridos (Reisepass, JVEG-Übersetzung, EIN CP 575/147C)
- §10 GwG Source-of-Funds umbral €15.000
- 12 CFR §330 FDIC USD 250.000 vs §8 EinSiG €100.000

### `testaferros-prestanombres-llc-ilegal-riesgos` — DE / PT
- DE: §42 AO Missbrauch + §233a AO 6 % p.a. Zinsen + §370 AO Steuerhinterziehung 5/10 años; §§19–20 GwG Transparenzregister + §56 GwG sanción €150.000–€1 Mio.; AT WiEReG €200.000; CH GwG SR 955.0 + VStrR
- PT: art. 104.º RGIT 1–5 años + €165.000; Lei 89/2017 RCBE €50.000

### `llc-unica-estructura-holding-cuando-como-cuesta` — FR / DE / PT / CA
- FR: BOI-INT-DG-20-20-100 + CE 391396 27/06/2018, IR + 17,2 % prélèvements sociaux, conv. 31/08/1994 art. 24
- DE: BMF 19.03.2004 Typenvergleich; §8b KStG Schachtelprivileg 95 % ≥10 % vs Streubesitz; §3 Nr. 40 EStG Teileinkünfteverfahren 40 %; §§7–14 AStG ATAD BGBl. I 2021 4147; AT §10 KStG + §10a KStG; CH Art. 69–70 DBG Beteiligungsabzug ≥10 % o CHF 1 Mio.; DBA CH-USA 02.10.1996 SR 0.672.933.61
- PT: art. 6.º CIRC transparência; fichas AT 2018003278 / 2019002491; art. 51.º CIRC participation exemption 95 % ≥10 % + 12 meses; Portaria 150/2004 paraísos; art. 66.º CIRC CFC; conv. PT-EUA DR 152/95
- CA: art. 100 LIRPF TFI; TEAC 6555/2017 19/02/2020; Andorra Llei 95/2010 IS participation exemption ≥5 % o €250.000; conveni Andorra-EUA 01/01/2024

---

## Reglas operativas aplicadas

- **Limpieza de bloque completo:** regex DOTALL `<!-- exentax:review-anchor-v1 -->[\s\S]*?<!-- /exentax:review-anchor-v1 -->` — elimina apertura + contenido `<aside>` + cierre. Fallback con regex de huérfanos para slugs ya parcialmente limpiados.
- **Inserción correcta:** bloques locales insertados ANTES de `<!-- exentax:cta-v1 -->` (no antes del CTA anidado `cta-conv-v1`).
- **Independencia por idioma:** cada bloque cubre la jurisdicción del idioma con normativa local.
- **Verificación previa a la escritura:** cada cifra/ley/resolución contra fuente oficial (BOE, BMF, BOFIP, AT, BdP, AFA, EU OJ).

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0 / low ratio: 0 / untranslated: 0

npm run blog:validate-all → OK 11/11
npm run i18n:check → PASS (0 missing/extra/empty)
```

---

## Backlog restante

- 67 slugs únicos × 6 idiomas = 402 archivos con `exentax:review-anchor-v1` aún sin barrido formal.
- A ritmo de 10 slugs por lote: ~7 lotes adicionales para cierre completo.
