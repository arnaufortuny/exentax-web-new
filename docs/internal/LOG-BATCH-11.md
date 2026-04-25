# LOG-BATCH-11 — Cluster autónomos ES + IVA + LLC operativa (10 slugs)

**Fecha:** 2026-04-25 (Sesión 27)
**Objetivo:** procesar 10 slugs del cluster autónomos España + IVA intracomunitario/digital + DAC7 + pasarelas + retenciones + LLC ventajas.

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 102 | **42** (−60) |
| Anchor pendiente (slugs únicos) | 17 | **7** (−10) |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` | PASS | **PASS** |

---

## Slugs procesados

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `cuota-autonomo-2026` | 6 idiomas | — |
| 2 | `dac7-plataformas-digitales-reporting-2026` | 6 idiomas | — |
| 3 | `facturar-sin-ser-autonomo-alternativas-2026` | 6 idiomas | — |
| 4 | `gastos-deducibles-autonomos-2026` | 6 idiomas | DE +74 |
| 5 | `impuestos-clientes-internacionales-espana` | 6 idiomas | — |
| 6 | `iva-intracomunitario-servicios-europa` | 6 idiomas | — |
| 7 | `iva-servicios-digitales-internacional` | 6 idiomas | DE +127 / PT +101 / CA +88 |
| 8 | `pasarelas-pago-llc-stripe-paypal-dodo` | 6 idiomas | DE +185 / PT +102 / CA +88 |
| 9 | `por-que-abrir-llc-estados-unidos-ventajas` | 6 idiomas | DE +71 |
| 10 | `retenciones-irpf-factura` | 6 idiomas | — |

Total bloques completos eliminados: 60. Total bloques locales insertados: 8.

---

## Bloques locales insertados (verificación oficial)

### `gastos-deducibles-autonomos-2026` — DE +74
- §4 Abs. 4 EStG Betriebsausgaben; §4 Abs. 5 EStG geschenke €35 + bewirtung 70 %; §4 Abs. 5 Satz 1 Nr. 6b EStG häusliches Arbeitszimmer Pauschale €1.260 (JStG 2022); §7 EStG AfA; §7g EStG Investitionsabzugsbetrag.

### `iva-servicios-digitales-internacional`
- **DE +127**: MwSt-Reform 2015 + EU-Richtlinie 2017/2455; §3a Abs. 5 UStG B2C destination; umbral €10.000/año; §18i, 18j, 18k UStG OSS desde 01/07/2021; IOSS €150 Sendungswert; §14 UStG Rechnungspflicht; §147 AO 10 años + GoBD.
- **PT +101**: DL 47/2020 transpone Directiva 2017/2455; art. 6.º-A CIVA OSS; umbral €10.000/año; Portal das Finanças OSS-DS trimestral; IOSS Importações ≤ €150; art. 52.º CIVA 10 años; art. 116.º RGIT €375-€22.500.
- **CA +88**: art. 70 LIVA modificado RD-Llei 7/2021; OSS desde 01/07/2021; Modelo 035 + Modelo 369 trimestral AEAT; conservación 6 años art. 30 Codi Comerç; Andorra Llei 11/2012 IGI 4,5 % art. 41.

### `pasarelas-pago-llc-stripe-paypal-dodo`
- **DE +185**: §13b UStG Reverse-Charge USA; §3 Abs. 11a UStG Vermittlungsleistungen; Stripe/PayPal §4 Nr. 8 UStG steuerbefreit; PStTG BGBl. I 2022 S. 2730 DAC7 desde 01/01/2023; umbral 30 transacciones / €2.000 BZSt 31/01; §3 Abs. 4 PStTG exclusión pasarelas puras; §147 AO 10 años.
- **PT +102**: Lei 36/2023 transpone DAC7; reporte 31/01 a AT; umbral 30 transacciones / €2.000; art. 5.º/3 Lei 36/2023 exclusión pasarelas; art. 36.º CIVA + SAF-T (PT); art. 52.º CIVA 10 años.
- **CA +88**: RD-Llei 7/2021 + RD-Llei 23/2024 transponen DAC7; Modelo 238 31/01 AEAT; art. 1 RD-Llei 23/2024 umbral 30 op / €2.000; exclusión pasarelas puras; RD 1619/2012 facturación; art. 30 Codi Comerç 6 años.

### `por-que-abrir-llc-estados-unidos-ventajas` — DE +71
- §49 EStG ECI; DBA D-USA Protokoll 2006 art. 23 Anrechnung + LOB Art. 28; Form 8832 Check-the-Box Treas. Reg. §301.7701-3; §138 Abs. 2 AO; Anlage AUS; Transparenzregister §§19-20 GwG; AT WiEReG; CH AIA.
