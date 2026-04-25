# LOG-BATCH-12 — Cluster final cripto + AML + IRS + regularización US (7 slugs) — CIERRE BACKLOG

**Fecha:** 2026-04-25 (Sesión 28)
**Objetivo:** procesar los **7 slugs finales** del barrido sistemático 672 .ts y cerrar al 100 % el backlog `exentax:review-anchor-v1` iniciado en LOG-BATCH-1.

---

## Resultado audit — CIERRE COMPLETO

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 42 | **0** ✅ |
| Anchor pendiente (slugs únicos) | 7 | **0** ✅ |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` | PASS | **PASS** |

---

## Slugs procesados

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `criptomonedas-trading-llc-impuestos` | 6 idiomas | DE +155 |
| 2 | `prevencion-blanqueo-capitales-llc` | 6 idiomas | DE +115 |
| 3 | `privacidad-llc-americana-secreto-ventaja` | 6 idiomas | — |
| 4 | `que-es-irs-guia-duenos-llc` | 6 idiomas | DE +91 |
| 5 | `recuperar-llc-boi-5472-atrasados-procedimiento` | 6 idiomas | FR +103 / DE +277 / PT +102 / CA +117 |
| 6 | `sociedad-limitada-espana-costes-ventajas` | 6 idiomas | — |
| 7 | `tramos-irpf-2026` | 6 idiomas | — |

Total bloques completos eliminados: 42. Total bloques locales insertados: 7.

---

## Bloques locales insertados (verificación oficial)

### `criptomonedas-trading-llc-impuestos` — DE +155
- BFH IX R 3/22 14.02.2023 BStBl. II 2023 S. 571 (cripto = Wirtschaftsgut sui generis); §23 Abs. 1 Nr. 2 EStG private Veräußerungsgeschäfte 1 año / 10 años staking; BMF 10.05.2022 BStBl. I 2022 S. 668 + 06.03.2025; Typenvergleich BMF 19.03.2004; §49 EStG ECI; DBA D-USA art. 23; §22 Nr. 3 EStG sonstige Einkünfte freigrenze €256/año; MiCAR Verordnung EU 2023/1114 vigente 30.12.2024; §1 Abs. 11 GwG.

### `prevencion-blanqueo-capitales-llc` — DE +115
- GwG 23.06.2017 BGBl. I 2017 S. 1822; 5. EU-AMLD 2018/843; 6. EU-AMLD 2018/1673; AML-Verordnung EU 2024/1624 + AMLA Frankfurt EU 2024/1620 vigente 2025; §§19-20 GwG Transparenzregister; §56 GwG €5M / 10 % Jahresumsatz; §10-11 GwG CDD; FIU Köln §43 GwG; §8 GwG aufzeichnung 5 años.

### `que-es-irs-guia-duenos-llc` — DE +91
- BZSt vs IRS; FATCA-Abkommen 31.05.2013 BGBl. II 2013 S. 1362 vigente 11.12.2013; CRS desde 2017 (USA no participa, FATCA bilateral); §117 AO Auskunftsersuchen; DBA D-USA art. 26 (i.d.F. Protokoll 2006).

### `recuperar-llc-boi-5472-atrasados-procedimiento`
- **FR +103**: FBAR FinCEN 114; IRC §6038A(d) USD 25k/form/año; CTA §6403 USD 591/día; Streamlined Filing Compliance (Foreign + Domestic); 3916 + 2042-NR; art. L. 102 B LPF 6 años; CDI Francia-USA 31/08/1994 art. 27.
- **DE +277**: SFOP / Delinquent FBAR / VDP procedures IRS; §138 Abs. 2 Nr. 2 AO + §379 AO €25k/año; Anlage AUS retroactiva; §371 AO Selbstanzeige + §371 Abs. 2 AO Sperrwirkung; §§19-20 GwG + §56 GwG €5M; FATCA-Abkommen 31.05.2013 BGBl. II 2013 S. 1362; DBA D-USA art. 26 Protokoll 2006; §147 AO 10 años; AT §49a FinStrG + §109 BAO; CH Art. 175 DBG SR 642.11 + Art. 175 Abs. 3 DBG straflose Selbstanzeige.
- **PT +102**: SFOP / VDP IRS; Anexo J Modelo 3 IRS retroactivo; Modelo 38 transferencias > €12.500 Lei 5/2002; FATCA Portugal-EUA 06/08/2015 (Lei 82-B/2014); art. 130.º CIRS 10 años.
- **CA +117**: SFOP / VDP IRS; Modelo 100 IRPF retroactivo; Modelo 720 RD 1065/2007 + Llei 5/2022 post-STJUE C-788/19 27/01/2022; FATCA Espanya-EUA BOE 22/04/2015; Andorra acord FATCA Llei 19/2016; art. 30 Codi Comerç 6 años.

---

## Cierre del barrido sistemático (LOG-BATCH-1 → LOG-BATCH-12)

| Lote | Slugs | Bloques eliminados | Bloques locales | Anchor pendiente al cierre |
|---|---|---|---|---|
| LOG-BATCH-1 | 5 | 30 | 8 | (no medido) |
| LOG-BATCH-2 a LOG-BATCH-7 | 35 | 210 | ~30 | 282 archivos / 47 slugs |
| LOG-BATCH-8 | 10 | 60 | 10 (+ 4 correcciones Mercury) | 222 / 37 |
| LOG-BATCH-9 | 10 | 60 | 6 | 162 / 27 |
| LOG-BATCH-10 | 10 | 60 | 2 | 102 / 17 |
| LOG-BATCH-11 | 10 | 60 | 8 | 42 / 7 |
| **LOG-BATCH-12** | **7** | **42** | **7** | **0 / 0** ✅ |

Total acumulado: **97 slugs** procesados con **522 bloques `exentax:review-anchor-v1` eliminados** y **~71 bloques locales** insertados con verificación contra fuentes oficiales (DE/AT/CH, FR, PT/BR, ES/AND, US, UK).

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0 / low ratio: 0 / untranslated: 0

npm run blog:validate-all → OK 11/11
npm run i18n:check → PASS

anchor pendiente: 0 archivos / 0 slugs ✅
```
