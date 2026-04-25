# LOG-BATCH-7 — Cluster banking / fintech / CRS-FATCA reporting (10 slugs)

**Fecha:** 2026-04-25 (Sesión 24)
**Objetivo:** procesar 10 slugs nuevos del cluster temático banking / fintech / CRS-FATCA con limpieza completa de bloque `exentax:review-anchor-v1` y refuerzo de paridad lingüística cuando sea necesario.

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 342 | **282** (−60) |
| Anchor pendiente (slugs únicos) | 57 | **47** (−10) |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |

---

## Slugs procesados

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `cuenta-bancaria-mercury-llc-extranjero` | 6 idiomas | — (todos ratios ≥ 0.88) |
| 2 | `evitar-bloqueos-mercury-wise-revolut` | 6 idiomas | — (todos ratios ≥ 0.85) |
| 3 | `wise-bancos-llc-stack-bancaria-completa` | 6 idiomas | FR +180 / DE +435 / PT +313 / CA +398 |
| 4 | `wise-business-llc-guia` | 6 idiomas | DE +94 |
| 5 | `wise-business-crs-reporting-fiscal` | 6 idiomas | — (todos ratios ≥ 1.08) |
| 6 | `cuentas-bancarias-usa-reportan-hacienda-verdad` | 6 idiomas | EN +93 |
| 7 | `visa-mastercard-reporting-tarjetas-hacienda` | 6 idiomas | DE +205 |
| 8 | `crs-cuentas-bancarias-llc-intercambio-informacion` | 6 idiomas | — (todos ratios ≥ 0.88) |
| 9 | `crs-residentes-espana-latam-implicaciones` | 6 idiomas | — (todos ratios ≥ 0.98) |
| 10 | `cambiar-divisas-llc-mejores-opciones` | 6 idiomas | — (todos ratios ≥ 0.86) |

Total bloques completos eliminados: 60. Total bloques locales insertados: 7.

---

## Bloques locales insertados (verificación oficial)

### `wise-bancos-llc-stack-bancaria-completa`
- **FR +180**: Wise Business Europe SA BCE 0708.022.075 + NBB PSD2 + loi belge 11/03/2018; Mercury via Choice Financial Group FDIC #14583 + Evolve Bank & Trust FDIC #1299; 12 CFR §330; CGI art. 1649 A + formulaire 3916 + sanction 1.500/10.000 €; CGI art. 238-0 A NCST; conv. fr-USA 31/08/1994 BOI-INT-CVB-USA-10-20
- **DE +435**: Wise Belgique BCE 0708.022.075 + NBB PSD2 + ZAG BGBl. I 2017 S. 2446; AT ZaDiG 2018; CH FINIG; Art. 10 EMD II Lloyds Bank treuhänderisch; §138 Abs. 2 Nr. 4 AO + §379 AO €25.000 + §370 AO; GwG BGBl. I 2017 S. 1822 §10 + §15; AT KontRegG BGBl. I Nr. 116/2015 + §109 BAO; CH BankG SR 952.0 + GwG SR 955.0 + AIA-Gesetz SR 653.1 + Art. 125 Abs. 1 lit. b DBG SR 642.11; FATCA IGA Modell 1 BGBl. II 2013 S. 1362; CRS DAC2 Richtlinie 2014/107/EU
- **PT +313**: Wise Belgique BCE + NBB DSP2 + DL 91/2018; Mercury Choice Financial + Evolve FDIC; art. 63.º-A LGT + DL 64/2016 + Anexo J Modelo 3; Modelo 38; Lei 83/2017 transpõe Diretiva (UE) 2015/849; Brasil DCBE BCB Resolução 4.973/2021 + Lei 14.286/2021 marco cambial 31/12/2022; DIRPF código 31; Solução de Consulta COSIT 14/2018
- **CA +398**: Wise Belgique BCE + Banc Nacional + PSD2 + Llei 7/2020 + RDL 19/2018; Modelo 720 RD 1065/2007 + Ley 5/2022 post-STJUE C-788/19 27/01/2022; Modelo 721 OM HFP/886/2023; art. 100 LIRPF TFI; DGT V0290-20; conv. ESP-EUA BOE 22/12/1990 + Protocol 27/11/2019; Andorra Llei 8/2013 + 14/2017 AFA; conveni Andorra-EUA 01/01/2024; conveni Andorra-Espanya BOE 07/12/2015 + Protocol 03/05/2023

### `wise-business-llc-guia`
- **DE +94**: Wise Belgique BCE 0708.022.075 + NBB PSD2 + ZAG BGBl. I 2017 S. 2446 + AT ZaDiG 2018 + CH FINIG; Art. 10 EMD II Lloyds Bank treuhänderisch (no FDIC, sí insolvenzfeste Trennungsmasse)

### `cuentas-bancarias-usa-reportan-hacienda-verdad`
- **EN +93**: IRC §§1471-1474 + Treas. Reg. §1.1471-1 a §1.1474-7 TD 9610 17/01/2013; UK-US IGA 12/09/2012 Modelo 1 + HMRC regulations 2014/1506; Article 27 EOIR

### `visa-mastercard-reporting-tarjetas-hacienda`
- **DE +205**: Visa/Mastercard/Amex no FATCA / no CRS (§1 Abs. 1 Nr. 6 ZAG); DAC7 Richtlinie 2021/514/EU + PStTG BGBl. I 2022 S. 2730 desde 01.01.2023 (umbral 30 transacciones / €2.000); §90 Abs. 2 + §147a AO

---

## Reglas operativas aplicadas

- **Limpieza de bloque completo:** regex DOTALL.
- **Inserción correcta:** bloques locales insertados ANTES de `<!-- exentax:cta-v1 -->`.
- **Independencia por idioma:** cada bloque cubre la jurisdicción del idioma con normativa local.
- **Verificación previa a la escritura:** cada cifra/ley/resolución contra fuente oficial (NBB, BaFin, FMA, BCE, AT, BdP, BCB, DGT, AFA, IRS, HMRC).

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0 / low ratio: 0 / untranslated: 0

npm run blog:validate-all → OK 11/11
npm run i18n:check → PASS
```

---

## Backlog restante

- **47 slugs únicos × 6 idiomas = 282 archivos** con `exentax:review-anchor-v1` aún sin barrido formal.
- A ritmo de 10 slugs por lote: ~5 lotes adicionales para cierre completo.
