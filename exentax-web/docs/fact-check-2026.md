# Fact-check audit report — Exentax blog (artículos en español)

  **Fecha:** abril 2026  ·  **Locale fuente de verdad:** `es/`  ·  **Total artículos auditados:** 100

  **Único entregable de la Task #35.** No se modifica ningún `.ts` de contenido, ni metadatos, ni i18n, ni SEO. La aplicación de las correcciones se hace en la Task siguiente.

  > **Nota de versión — POSICIÓN CANÓNICA VIGENTE (Pase 6, supersede todo lo anterior).**
  > Tras la aclaración del usuario, la única posición canónica del proyecto sobre Wise + CRS es:
  > 1. **Wise Business titularidad de una LLC estadounidense queda FUERA del CRS.** La LLC es entidad de EE. UU. y EE. UU. no es jurisdicción CRS; el lado USD pasa por Wise US Inc. (perímetro FATCA).
  > 2. **Wise Personal abierta por un individuo residente fiscal en una jurisdicción CRS** (p. ej. España) **sí entra en el CRS** vía Wise Europe SA (Bélgica) sobre ese individuo.
  > 3. Cualquier afirmación previa en este informe o en sus adendas que diga "Wise Business reporta CRS desde Bélgica" para una LLC queda **superseded** por esta nota. Las adendas anteriores se conservan únicamente como log de auditoría del proceso, no como posición vigente.
  > El SOT `exentax-web/docs/banking-facts-2026.md` (§Wise Business, §CRS — Common Reporting Standard, §EU EMIs) ha sido actualizado en consecuencia y prevalece sobre cualquier formulación contradictoria en este informe.

  ---

  ## 0. Cómo leer este informe

  1. **Fact sheet maestra (SOT).** `exentax-web/docs/banking-facts-2026.md`. Este informe extiende el SOT con BOI/CTA, Form 5472 + 1120 pro-forma (Ogden + 7004 + sanción $25k), Form 1120 sustantivo, CRS y FATCA. La sección Wise Business del SOT vuelve a la posición canónica "Wise Business reporta CRS desde Bélgica" y diferencia explícitamente Wise Personal vs Wise Business para LLC.
  2. **Sin coordinación con Task #34.** El usuario ha pedido eliminar la corrección Wise+CRS del proyecto entero. Por tanto este informe **no** trata Task #34 como referencia; al contrario, identifica los artículos donde falta la disclosure CRS de Wise o falta la diferenciación Wise Personal vs Wise Business como issues a completar.
  3. **Estructura por artículo.** Cada ficha incluye:
     - **Métricas estructurales:** longitud total, número de H2/H3, intro words, secciones <80 palabras (cortas) y >400 (largas), título de la última sección y si parece cierre con próximo paso.
     - **CTA audit:** número de CTAs inline ("Agenda tu asesoría/llamada gratuita…"), variantes utilizadas, número total de enlaces y enlaces a /agendar.
     - **Inventario de menciones:** brands y regulaciones tracked con frecuencia.
     - **Issues factuales:** lista de problemas con verdict, evidencia textual extraída literalmente del artículo y propuesta de fix con cita al SOT y a fuente primaria.
     - **Inventario sentence-level de claims tracked:** cada sentence con menciones a brands/regulaciones con su status (issue del detector que la marcó, o "SIN ISSUE DETECTADO").
  4. **Verdicts:** `VERIFICADA` · `CORREGIR` · `MATIZAR` · `COMPLETAR` · `ELIMINAR` · `CORREGIR (CRÍTICO)`.
  5. **Método.** 14 detectores factuales con guardas anti-falso-positivo, ejecutados sobre el cuerpo Markdown completo. Los snippets son matches reales del artículo. Cada fix cita la sección del SOT y la URL primaria 2026 correspondiente.

  ---

  ## 1. Índice

  - [0. Cómo leer este informe](#0-cómo-leer-este-informe)
  - [1. Índice](#1-índice)
  - [2. Fact sheet maestra 2026 (puntero al SOT)](#2-fact-sheet-maestra-2026-puntero-al-sot)
  - [3. Métricas globales del audit](#3-métricas-globales-del-audit)
  - [4. Inconsistencias cruzadas](#4-inconsistencias-cruzadas)
  - [5. Lista priorizada de artículos (P0..P5)](#5-lista-priorizada-de-artículos-p0p5)
  - [6. Fichas por artículo (100)](#6-fichas-por-artículo-100)
  - [7. Cobertura por tema](#7-cobertura-por-tema)

  ---

  ## 2. Fact sheet maestra 2026 (puntero al SOT)

  La fuente de verdad **única** para todas las correcciones es `exentax-web/docs/banking-facts-2026.md`. **No se duplica aquí.** Resumen:

  ### 2.1 Stack bancario / fintech

  | Producto | Tipo | Partner / entidad | IBAN UE para LLC US | CRS | Cripto | Notas críticas |
  |---|---|---|---|---|---|---|
  | **Mercury** | Fintech (Money Transmitter) | Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy | No | No (US) | **Rechaza** | Closure por compliance ⇒ devuelve fondos en cheque USD físico al domicilio de la LLC |
  | **Slash** | Plataforma bancaria | **Column N.A.** (federally chartered, FDIC) | No | No (US) | **Sí** | Treasury ~3,82% bruto / ~3,5% APY efectivo |
  | **Relay** | Fintech | Thread Bank (FDIC) | No | No (US) | No | 20 sub-cuentas, 50 tarjetas |
  | **Wallester** | Emisor UE (Visa, Estonia) | — | **Sí (IBAN UE)** | **Sí (CRS)** | n/a | Disclosure CRS obligatoria |
  | **Wise Business** | EMI (no banco) | Wise Europe SA (BE) para EUR/multidivisa + Wise US Inc. (MSB) para USD | EUR vía IBAN belga | **Sí — vía Wise Europe SA (Bélgica)** | **Rechaza** | **Diferenciar Wise Personal (cuenta individual residente UE) vs Wise Business para LLC (cuenta de entidad, Active/Passive NFE).** Reporta CRS desde Bélgica |
  | **Revolut Business** | EMI (LT) o **Lead Bank** (US) | Lead Bank para LLC US | **No para LLC US** | LT EU sí, US LLC vía Lead Bank no | n/a | Error crítico: Revolut da IBAN UE a una LLC |
  | **Stripe** | Procesador (no banco) | n/a | n/a | n/a | n/a | Requiere LLC + EIN + cuenta US |
  | **Payoneer** | Cross-border / EMI | — | Receiving accounts multidivisa | **Sí (CRS)** | n/a | Disclosure CRS obligatoria |
  | **IBKR** | Brokerage | — | n/a | n/a | n/a | Verificar onboarding LLC no residente 2026 |
  | **Kraken** | Exchange cripto | — | n/a | n/a | sí | Verificar KYC 2026 |

  ### 2.2 Marco regulatorio (SOT extendido)

  - **BOI / CTA.** Tras la interim final rule de FinCEN (marzo 2025), obligación restringida a foreign reporting companies. LLC formada en EE. UU. queda fuera con re-verify en FinCEN.gov.
  - **Form 5472 + pro-forma 1120.** Single-member LLC disregarded propietario extranjero: pro-forma 1120 (cabecera) + Form 5472, **por correo o fax al IRS Service Center de Ogden, UT**. Vencimiento 15-abr; prórroga **Form 7004** ⇒ hasta 15-oct. **Sanción $25.000/form/año + $25.000 por cada 30 días**.
  - **Form 1120 sustantivo.** Solo si la LLC ha hecho election a C-corp via Form 8832.
  - **CRS.** OCDE 2014, UE via DAC2, España via RD 1021/2015. EE. UU. no participa. Wallester / Revolut Bank UAB / **Wise Europe SA** / N26 / Payoneer / Coinbase Europe / Kraken IE → dentro. Mercury / Slash / Relay / Wise US Inc. / Choice / Evolve / Column N.A. / Thread Bank / Lead Bank → fuera.
  - **FATCA.** Marco US. FFIs reportan US persons al IRS. W-8BEN / W-8BEN-E (validez 3 años).

  ---

  ## 3. Métricas globales del audit

  | Métrica | Valor |
  |---|---|
  | Artículos auditados | **100** |
  | CTA inline totales detectadas | **37** |
  | Artículos sin CTA inline | **63** / 100 |
  | Promedio CTA por artículo | **0.37** |
  | Artículos con ≥1 sección demasiado corta (<80w) | **100** |
  | Artículos con ≥1 sección demasiado larga (>400w) | **55** |
  | Artículos sin cierre claro de "próximo paso" (heurística) | **90** |

  ### 3.1 Frecuencia de issues factuales detectadas

  | ID | Issue | Artículos afectados |
  |---|---|---|
  | `wise-no-personal-business-distinction` | Wise mencionado sin diferenciar Wise Personal vs Wise Business para LLC | **54** |
| `wise-no-crs-disclosure` | Wise mencionado sin disclosure CRS (Wise Europe SA reporta desde Bélgica) | **52** |
| `wallester-no-crs-disclosure` | Wallester mencionado sin disclosure CRS | **46** |
| `mercury-column-no-choice` | Mercury con partner Column sin Choice/Evolve | **39** |
| `mercury-recommended-no-closure-warning` | Recomendación Mercury sin warning de closure por compliance | **39** |
| `zero-tax-no-nuance` | "0% impuestos" sin matiz federal vs global | **8** |
| `payoneer-no-crs` | Payoneer mencionado sin disclosure CRS | **2** |
| `revolut-iban-llc` | Revolut afirmado dando IBAN UE/lituano a LLC | **2** |
| `1120-confused-wrong` | 1120 sustantivo confundido con pro-forma | **1** |

  ---

  ## 4. Inconsistencias cruzadas

  | # | Hecho | Versión canónica (SOT) | Artículos afectados |
  |---|---|---|---|
  | C-01 | Partner bancario de Mercury | Choice Financial Group + Evolve Bank & Trust | 39 |
  | C-02 | Wise Business y CRS — **canonical 2026** | Wise Business reporta CRS desde Bélgica vía Wise Europe SA. Diferenciar Wise Personal (cuenta individual) vs Wise Business para LLC (cuenta de entidad clasificada como Active/Passive NFE) | menciones Wise sin disclosure CRS=52 · sin diferenciación Personal/Business=54 |
  | C-03 | IBAN europeo para LLC US (Revolut) | Revolut Business para LLC US se abre vía Lead Bank (cuenta US, no IBAN UE) | 2 |
  | C-04 | "0% impuestos" sin matiz | "0% federal, no 0% global. Combinar LLC + residencia favorable" | 8 |
  | C-05 | Wallester sin disclosure CRS | Toda mención de Wallester debe incluir disclosure CRS | 46 |
  | C-06 | Payoneer sin disclosure CRS | Toda mención de Payoneer debe incluir disclosure CRS | 2 |
  | C-07 | Mercury recomendado sin warning de closure | Añadir warning del SOT (cheque USD al domicilio de la LLC) | 39 |
  | C-08 | 1120 sustantivo confundido con pro-forma | Disregarded LLC no paga corp tax. Pro-forma = carrier del 5472 | 1 |

  ---

  ## 5. Lista priorizada de artículos (P0..P5)

  
### P0 (2 artículos)

| Slug | Verdict | Issues principales | CTA | Estructura |
|---|---|---|---|---|
| `fiscalidad-estonia-como-funciona` | CORREGIR (CRÍTICO) | revolut-iban-llc, payoneer-no-crs, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:14 · short:4 · long:1 · sin cierre |
| `llc-alternativa-autonomo-espana` | CORREGIR (CRÍTICO) | revolut-iban-llc, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 1 | H2:12 · short:1 · long:1 · sin cierre |

### P1 (1 artículos)

| Slug | Verdict | Issues principales | CTA | Estructura |
|---|---|---|---|---|
| `irs-1120-5472-que-son-cuando-aplican` | CORREGIR | 1120-confused-wrong, wise-no-crs-disclosure | 0 ⚠️ | H2:13 · short:2 · long:0 · sin cierre |

### P2 (69 artículos)

| Slug | Verdict | Issues principales | CTA | Estructura |
|---|---|---|---|---|
| `amazon-ecommerce-llc-vender-online` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:10 · short:5 · long:0 · sin cierre |
| `autonomo-espana-vs-llc-estados-unidos` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:11 · short:3 · long:2 · sin cierre |
| `bancos-vs-fintech-llc-donde-abrir-cuenta` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:5 · long:0 |
| `boe-febrero-2020-llc-doctrina-administrativa` | COMPLETAR | wallester-no-crs-disclosure, wise-no-crs-disclosure | 1 | H2:13 · short:3 · long:1 · sin cierre |
| `bookkeeping-llc-paso-a-paso` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:17 · short:1 · long:1 · sin cierre |
| `cambiar-divisas-llc-mejores-opciones` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:7 · short:3 · long:0 · sin cierre |
| `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | COMPLETAR | wise-no-crs-disclosure, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:9 · short:5 · long:1 · sin cierre |
| `caminos-legales-minimos-impuestos` | COMPLETAR | wise-no-crs-disclosure, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:13 · short:3 · long:1 · sin cierre |
| `como-disolver-cerrar-llc-paso-a-paso` | COMPLETAR | wise-no-personal-business-distinction | 0 ⚠️ | H2:15 · short:1 · long:1 · sin cierre |
| `como-obtener-itin-numero-fiscal-irs` | COMPLETAR | wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:12 · short:1 · long:2 · sin cierre |
| `como-operar-llc-dia-a-dia` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:13 · short:2 · long:1 · sin cierre |
| `constituir-llc-proceso-paso-a-paso` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:17 · short:12 · long:1 · sin cierre |
| `convenio-doble-imposicion-usa-espana-llc` | COMPLETAR | wise-no-crs-disclosure, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:13 · short:1 · long:1 · sin cierre |
| `criptomonedas-trading-llc-impuestos` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:8 · short:1 · long:0 · sin cierre |
| `crs-cuentas-bancarias-llc-intercambio-informacion` | CORREGIR | mercury-column-no-choice, payoneer-no-crs, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:13 · short:4 · long:0 · sin cierre |
| `cuenta-bancaria-mercury-llc-extranjero` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:14 · short:4 · long:2 · sin cierre |
| `cuentas-bancarias-usa-reportan-hacienda-verdad` | COMPLETAR | wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:14 · short:4 · long:0 · sin cierre |
| `diseno-estructura-fiscal-internacional-solida` | CORREGIR | mercury-column-no-choice, wise-no-personal-business-distinction | 1 | H2:14 · short:3 · long:0 · sin cierre |
| `documentar-separacion-fondos-llc-historial` | COMPLETAR | wise-no-crs-disclosure | 0 ⚠️ | H2:8 · short:4 · long:1 |
| `documentos-llc-cuales-necesitas` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:12 · short:4 · long:0 · sin cierre |
| `dubai-uae-mito-no-impuestos` | COMPLETAR | wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:1 · long:0 · sin cierre |
| `due-diligence-bancario-llc-americana` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:7 · long:0 · sin cierre |
| `ein-numero-fiscal-llc-como-obtenerlo` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:9 · short:3 · long:0 · sin cierre |
| `empresa-bulgaria-10-tributacion` | COMPLETAR | wallester-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:14 · short:4 · long:1 · sin cierre |
| `empresa-reino-unido-uk-ltd` | COMPLETAR | wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:17 · short:7 · long:0 · sin cierre |
| `errores-criticos-llc-ya-constituida` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:11 · short:2 · long:2 · sin cierre |
| `errores-fiscales-freelancers-espanoles` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:14 · short:5 · long:1 · sin cierre |
| `escalar-negocio-digital-llc-americana` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:12 · short:3 · long:1 · sin cierre |
| `estructura-fiscal-optima-freelancer-internacional` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:10 · short:4 · long:1 · sin cierre |
| `estructura-offshore-beneficios-riesgos` | COMPLETAR | wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:12 · short:1 · long:0 · sin cierre |
| `evitar-bloqueos-mercury-wise-revolut` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:7 · short:3 · long:0 |
| `extension-irs-form-1120-como-solicitarla` | MATIZAR | zero-tax-no-nuance | 1 | H2:11 · short:5 · long:0 · sin cierre |
| `fiscalidad-internacional-emprendedores-digitales` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:11 · short:4 · long:1 · sin cierre |
| `fiscalidad-llc-por-pais-residencia` | MATIZAR | zero-tax-no-nuance | 1 | H2:11 · short:2 · long:1 · sin cierre |
| `gastos-deducibles-llc-que-puedes-deducir` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:10 · short:4 · long:1 · sin cierre |
| `hong-kong-offshore-realidad` | COMPLETAR | wallester-no-crs-disclosure, wise-no-crs-disclosure | 0 ⚠️ | H2:13 · short:1 · long:1 · sin cierre |
| `iban-swift-routing-number-que-son` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:9 · short:1 · long:0 · sin cierre |
| `impuestos-clientes-internacionales-espana` | MATIZAR | zero-tax-no-nuance | 1 | H2:10 · short:2 · long:1 · sin cierre |
| `justificar-origen-fondos-kyc-bancario-segunda-ronda` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:10 · short:4 · long:1 · sin cierre |
| `llc-agencias-marketing-digital` | COMPLETAR | wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:8 · short:2 · long:0 · sin cierre |
| `llc-estados-unidos-guia-completa-2026` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:3 · long:2 · sin cierre |
| `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | MATIZAR | wallester-no-crs-disclosure, wise-no-crs-disclosure, zero-tax-no-nuance, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:13 · short:3 · long:1 · sin cierre |
| `llc-unica-estructura-holding-cuando-como-cuesta` | COMPLETAR | wise-no-crs-disclosure | 0 ⚠️ | H2:11 · short:5 · long:1 · sin cierre |
| `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:13 · short:1 · long:1 · sin cierre |
| `nomada-digital-residencia-fiscal` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:14 · short:2 · long:1 · sin cierre |
| `operating-agreement-llc-que-es` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:13 · short:3 · long:1 · sin cierre |
| `pagar-cero-impuestos-legalmente-llc` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:11 · short:3 · long:1 · sin cierre |
| `pasarelas-pago-llc-stripe-paypal-dodo` | COMPLETAR | wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:10 · short:2 · long:0 |
| `por-que-abrir-llc-estados-unidos-ventajas` | CORREGIR | mercury-column-no-choice, wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 1 | H2:10 · short:2 · long:0 · sin cierre |
| `por-que-no-abrir-empresa-estonia` | COMPLETAR | wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:17 · short:4 · long:1 · sin cierre |
| `prevencion-blanqueo-capitales-llc` | CORREGIR | mercury-column-no-choice, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:9 · short:3 · long:0 · sin cierre |
| `primer-mes-llc-que-esperar` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:5 · long:0 · sin cierre |
| `privacidad-llc-americana-secreto-ventaja` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 1 | H2:11 · short:2 · long:0 · sin cierre |
| `problemas-comunes-llc-como-evitarlos` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:14 · short:3 · long:0 · sin cierre |
| `que-pasa-si-no-presentas-5472-multas-irs` | COMPLETAR | wise-no-crs-disclosure | 0 ⚠️ | H2:13 · short:2 · long:0 · sin cierre |
| `registered-agent-que-es-por-que-necesitas` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:5 · long:0 · sin cierre |
| `reorganizar-banca-llc-mercury-relay-wise` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:9 · short:4 · long:1 · sin cierre |
| `revolut-business-crs-reporting-fiscal` | COMPLETAR | wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 1 | H2:12 · short:3 · long:1 · sin cierre |
| `separar-dinero-personal-llc-por-que-importa` | COMPLETAR | wallester-no-crs-disclosure, wise-no-crs-disclosure | 1 | H2:12 · short:2 · long:1 · sin cierre |
| `single-member-multi-member-llc-implicaciones-fiscales` | COMPLETAR | wise-no-crs-disclosure, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:10 · short:3 · long:0 · sin cierre |
| `tengo-llc-checklist-gestion-correcta` | COMPLETAR | wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 1 | H2:10 · short:2 · long:2 · sin cierre |
| `tiempos-pagos-ach-wire-transfer` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:9 · short:3 · long:0 · sin cierre |
| `ventajas-desventajas-llc-no-residentes` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:11 · short:3 · long:1 · sin cierre |
| `visa-mastercard-reporting-tarjetas-hacienda` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:15 · short:1 · long:1 · sin cierre |
| `w8-ben-y-w8-ben-e-guia-completa` | COMPLETAR | wise-no-crs-disclosure, wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 1 | H2:16 · short:4 · long:1 · sin cierre |
| `wise-bancos-llc-stack-bancaria-completa` | COMPLETAR | wallester-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:13 · short:1 · long:1 · sin cierre |
| `wise-business-crs-reporting-fiscal` | COMPLETAR | wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 1 | H2:11 · short:3 · long:1 · sin cierre |
| `wise-business-llc-guia` | CORREGIR | mercury-column-no-choice, wallester-no-crs-disclosure, wise-no-crs-disclosure, wise-no-personal-business-distinction | 0 ⚠️ | H2:12 · short:7 · long:0 · sin cierre |
| `wise-iban-llc-que-reporta-hacienda` | COMPLETAR | wise-no-personal-business-distinction, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:12 · short:1 · long:1 · sin cierre |

### P3 (8 artículos)

| Slug | Verdict | Issues principales | CTA | Estructura |
|---|---|---|---|---|
| `autonomos-espana-por-que-dejar-de-serlo` | COMPLETAR | mercury-recommended-no-closure-warning | 0 ⚠️ | H2:12 · short:5 · long:1 · sin cierre |
| `cuanto-cuesta-constituir-llc` | COMPLETAR | mercury-recommended-no-closure-warning | 0 ⚠️ | H2:8 · short:2 · long:0 · sin cierre |
| `empresa-panama-fiscalidad-residencia` | COMPLETAR | mercury-recommended-no-closure-warning | 0 ⚠️ | H2:13 · short:3 · long:0 · sin cierre |
| `fiscalidad-socios-llc-cambio-residencia-mid-year` | COMPLETAR | mercury-recommended-no-closure-warning | 0 ⚠️ | H2:12 · short:2 · long:1 · sin cierre |
| `itin-ssn-que-son-como-obtenerlos` | COMPLETAR | mercury-recommended-no-closure-warning | 1 | H2:11 · short:4 · long:0 · sin cierre |
| `llc-creadores-contenido-youtube-twitch` | COMPLETAR | wallester-no-crs-disclosure, mercury-recommended-no-closure-warning | 0 ⚠️ | H2:8 · short:2 · long:0 · sin cierre |
| `llc-desarrolladores-software-saas` | COMPLETAR | wallester-no-crs-disclosure | 1 | H2:7 · short:1 · long:1 · sin cierre |
| `nuevo-mexico-vs-wyoming-vs-delaware` | COMPLETAR | mercury-recommended-no-closure-warning | 1 | H2:10 · short:2 · long:1 · sin cierre |

### P4 (19 artículos)

| Slug | Verdict | Issues principales | CTA | Estructura |
|---|---|---|---|---|
| `auditoria-rapida-llc-12-puntos-30-minutos` | VERIFICADA | — | 0 ⚠️ | H2:6 · short:3 · long:1 |
| `boi-report-fincen-guia-completa-2026` | VERIFICADA | — | 1 | H2:9 · short:5 · long:0 |
| `crear-empresa-andorra-ventajas` | VERIFICADA | — | 0 ⚠️ | H2:14 · short:4 · long:1 · sin cierre |
| `dac7-plataformas-digitales-reporting-2026` | VERIFICADA | — | 1 | H2:12 · short:3 · long:1 · sin cierre |
| `dac8-criptomonedas-reporting-fiscal-2026` | VERIFICADA | — | 1 | H2:13 · short:4 · long:0 · sin cierre |
| `form-5472-que-es-como-presentarlo` | VERIFICADA | — | 1 | H2:13 · short:4 · long:1 · sin cierre |
| `holding-empresarial-como-funciona` | VERIFICADA | — | 0 ⚠️ | H2:15 · short:5 · long:1 · sin cierre |
| `iva-servicios-digitales-internacional` | VERIFICADA | — | 0 ⚠️ | H2:7 · short:1 · long:0 |
| `llc-interactive-brokers-invertir-bolsa-usa` | VERIFICADA | — | 0 ⚠️ | H2:10 · short:1 · long:1 · sin cierre |
| `llc-seguridad-juridica-proteccion-patrimonial` | VERIFICADA | — | 1 | H2:12 · short:3 · long:0 · sin cierre |
| `mantenimiento-anual-llc-obligaciones` | VERIFICADA | — | 0 ⚠️ | H2:11 · short:3 · long:0 · sin cierre |
| `que-es-irs-guia-duenos-llc` | VERIFICADA | — | 0 ⚠️ | H2:10 · short:4 · long:0 · sin cierre |
| `recuperar-llc-boi-5472-atrasados-procedimiento` | VERIFICADA | — | 0 ⚠️ | H2:11 · short:3 · long:0 · sin cierre |
| `residentes-no-residentes-llc-diferencias` | VERIFICADA | — | 1 | H2:10 · short:4 · long:1 · sin cierre |
| `riesgos-fiscales-mala-estructuracion-internacional` | VERIFICADA | — | 1 | H2:11 · short:3 · long:0 |
| `testaferros-prestanombres-llc-ilegal-riesgos` | VERIFICADA | — | 1 | H2:10 · short:3 · long:1 · sin cierre |
| `tributacion-llc-segun-actividad-economica` | VERIFICADA | — | 1 | H2:11 · short:3 · long:0 |
| `tributacion-pass-through-llc-como-funciona` | VERIFICADA | — | 1 | H2:11 · short:3 · long:0 · sin cierre |
| `vender-o-cerrar-llc-comparativa-practica` | VERIFICADA | — | 0 ⚠️ | H2:12 · short:2 · long:0 · sin cierre |

### P5 (1 artículos)

| Slug | Verdict | Issues principales | CTA | Estructura |
|---|---|---|---|---|
| `crs-residentes-espana-latam-implicaciones` | VERIFICADA | — | 1 | H2:12 · short:2 · long:0 |

---

## 6. Fichas por artículo (100)


### `amazon-ecommerce-llc-vender-online`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7458 caracteres · H2=10 · H3=6 · intro=38 palabras · cortas (<80w)=5 ("Amazon FBA con tu LLC" (65w); "Shopify con tu LLC" (45w); "Obligaciones fiscales del ecommerce con LLC" (68w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=10 · slash=3 · relay=4 · wallester=2 · wise=5 · revolut=2 · stripe=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"**Transfieres beneficios** a tu cuenta personal vía Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"| Wise Business | Conversión de divisas | Tipo de cambio real (EMI) |"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (9):**
  - [`SIN ISSUE DETECTADO`] _"Con una LLC, recibes los fondos directamente en Mercury en dólares, sin intermediarios, sin retenciones y sin conversiones forzadas. ### Credibilidad ante el cliente Vender desde una empresa americana genera confianza."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `auditoria-rapida-llc-12-puntos-30-minutos`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 6501 caracteres · H2=6 · H3=12 · intro=88 palabras · cortas (<80w)=3 ("Cómo interpretar el resultado" (67w); "Lecturas relacionadas" (23w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Los 12 puntos" (595w)) · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=5 · mercury=1 · relay=1 · wise=1 · stripe=1 · ibkr=1 · boi=4 · fincen=3 · crs=2 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"Un RA caducado deriva en correo perdido del IRS o del FinCEN, y eso deriva en sanciones que llegan sin avisar. ### 3."_
  - [`SIN ISSUE DETECTADO`] _"EIN intacto y a tu nombre Comprueba que aún tienes la **EIN Confirmation Letter (CP 575)** o, en su defecto, la **147C** que la sustituye."_
  - [`SIN ISSUE DETECTADO`] _"Form 5472 + 1120 pro-forma del último año Si eres no residente con SMLLC y has tenido cualquier movimiento entre tú y la LLC, el 5472 con 1120 pro-forma es obligatorio."_
  - [`SIN ISSUE DETECTADO`] _"BOI Report presentado y actualizado ¿Presentaste el BOI Report ante FinCEN cuando se constituyó la LLC o en 2026?"_
  - [`SIN ISSUE DETECTADO`] _"El BOI no es un trámite único: cualquier cambio relevante exige actualización en 30 días. ### 7."_
  - [`SIN ISSUE DETECTADO`] _"Cualquier mezcla es punto rojo, no porque vaya a saltar nada hoy, sino porque rompe el corporate veil y complica el 5472. ### 9."_
  - [`SIN ISSUE DETECTADO`] _"Residencia fiscal correcta en cada plataforma Mercury, Wise, Relay, Stripe, PayPal, Interactive Brokers, exchanges de cripto: en todas debes tener declarada la residencia fiscal real del beneficiario."_
  - [`SIN ISSUE DETECTADO`] _"Una sola plataforma con la residencia equivocada genera incoherencia automática cuando salta el cruce CRS. ### 10."_
  - [`SIN ISSUE DETECTADO`] _"Si llevas dos o más ejercicios sin declarar, conviene plantear regularización voluntaria antes de que llegue el cruce CRS o DAC. ### 11."_
  - [`SIN ISSUE DETECTADO`] _"Modelo 720/721 si resides en España Si resides en España y la suma de cuentas, valores o cripto fuera del país supera 50.000 €, tienes obligación de declararlo."_
  - [`SIN ISSUE DETECTADO`] _"Calendario y proveedor para el próximo año Por último: ¿tienes claro quién presenta tu 5472 el próximo abril?"_
  - [`SIN ISSUE DETECTADO`] _"¿Quién supervisa el BOI si cambia algo?"_
  - [`SIN ISSUE DETECTADO`] _"Lo barato es regularizar voluntariamente; lo caro es esperar a que llegue una carta del IRS, del FinCEN o de tu Hacienda. ## Qué hacer con el resultado Si la auditoría te sale limpia, guarda el ejercicio en tu carpeta de la LLC con fecha."_
  - [`SIN ISSUE DETECTADO`] _"Si te salen puntos rojos, el orden razonable es: primero legal (estado, RA, BOI), después fiscal IRS (5472 atrasados con la estrategia adecuada), después país (regularización si procede), y por último operativa (banca y plataformas)."_


### `autonomo-espana-vs-llc-estados-unidos`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 15022 caracteres · H2=11 · H3=10 · intro=109 palabras · cortas (<80w)=3 ("¿Para quién NO tiene sentido?" (39w); "Lecturas relacionadas" (19w); "Próximos pasos" (42w)) · largas (>400w)=2 ("Carga fiscal con una LLC en Estados Unidos" (574w); "Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=2 · slash=2 · relay=1 · wallester=2 · wise=1 · revolut=1 · stripe=4 · ibkr=1 · kraken=1 · boi=2 · fincen=1 · modelo720=2
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury (Column NA, FDIC, $0 en wires nacionales e internacionales) o Relay (Thread Bank, 20 sub-cuentas gratuitas)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Tarjetas corporativas:** Wallester te permite emitir tarjetas virtuales y físicas con límites y control granular, algo que las tarjetas de autónomo en España ni se acercan a ofrecer"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Multi-divisa real:** Wise Business al tipo de cambio mid-market y Revolut Business con cuentas multi-divisa, sin los márgenes ocultos de los bancos españoles"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Multi-divisa real:** Wise Business al tipo de cambio mid-market y Revolut Business con cuentas multi-divisa, sin los márgenes ocultos de los bancos españoles"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"| Banca en dólares | Limitada | Total (Mercury, $0 comisiones) |"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"Franchise Tax estatal. ### Obligaciones fiscales (compliance) - **Form 5472 + Form 1120:** declaración informativa anual ante el IRS."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `autonomos-espana-por-que-dejar-de-serlo`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 12544 caracteres · H2=12 · H3=3 · intro=77 palabras · cortas (<80w)=5 (""¿Pero eso es legal?"" (71w); "¿Tengo que darme de baja como autónomo?" (68w); "El coste real de no hacer nada" (29w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=2 · stripe=2 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **Acceso a banca y pasarelas de pago americanas** (Mercury, Stripe, PayPal US)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"No es una offshore opaca en las Islas Caimán, es una empresa registrada en un estado de EE.UU., con EIN (número fiscal), Registered Agent, y declaraciones anuales al IRS."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `bancos-vs-fintech-llc-donde-abrir-cuenta`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7590 caracteres · H2=12 · H3=0 · intro=59 palabras · cortas (<80w)=5 ("¿Qué es un banco?" (61w); "¿Qué es el FDIC?" (51w); "¿Por qué las fintechs son mejores para LLCs de no residentes?" (65w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **0** · enlaces totales=1 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=8 · slash=4 · relay=5 · wallester=4 · wise=11 · revolut=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** → Money Transmitter que opera a través de **Column NA**, un banco con licencia federal y cobertura FDIC"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester** → Emisor de tarjetas corporativas europeo con buenas integraciones"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Wise tampoco"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"| Característica | Mercury | Relay | Wise Business | Revolut Business |"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Y aquí es donde empieza la confusión: Mercury no es un banco"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (11):**
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Y aquí es donde empieza la confusión: Mercury no es un banco."_
  - [`SIN ISSUE DETECTADO`] _"Sí, con matices: - **Tu dinero en Mercury está asegurado por el FDIC** hasta $250,000 a través de Column NA."_
  - [`SIN ISSUE DETECTADO`] _"Mercury incluso ofrece cobertura extendida de hasta $5 millones a través de su programa de barrido entre múltiples bancos - **Tu dinero en Relay está asegurado por el FDIC** a través de Thread Bank - **Wise** no tiene seguro FDIC, es una EMI que usa safeguarding (separación de fondos del cliente)."_
  - [`SIN ISSUE DETECTADO`] _"Seguro, pero diferente - **Revolut Business** tiene seguro FDIC a través de su banco partner La clave: pregunta siempre **quién es el banco subyacente** y si hay cobertura FDIC. ## ¿Qué es el FDIC?"_
  - [`SIN ISSUE DETECTADO`] _"Las fintechs nacieron para resolver exactamente este problema. ## Lo que mucha gente no entiende sobre Wise Wise es una herramienta excelente, pero hay que entender qué es y qué no es: - **No es un banco.** Es una EMI (Institución de Dinero Electrónico)."_
  - [`SIN ISSUE DETECTADO`] _"No tiene licencia bancaria ni seguro FDIC. - **No debería ser tu cuenta principal.** Los fondos de clientes están segregados (safeguarding), pero no asegurados como en un banco. - **Su fortaleza es la conversión.** El tipo de cambio mid-market que ofrece Wise es el tipo real interbancario."_
  - [`SIN ISSUE DETECTADO`] _"Para convertir USD a EUR, es difícil encontrar algo mejor. - **Los límites de Wise varían.** Según la divisa y el corredor de pago, hay límites en las transferencias."_
  - [`SIN ISSUE DETECTADO`] _"Para movimientos grandes, conviene verificarlos antes. ## Dónde encajan Slash y Wallester No todo en la banca de tu LLC es cuentas corrientes."_
  - [`SIN ISSUE DETECTADO`] _"Hay dos capas adicionales que la mayoría ignora: **Slash** cubre la capa de tesorería."_
  - [`SIN ISSUE DETECTADO`] _"Si tu LLC acumula capital entre cobros y distribuciones, ese dinero puede generar rendimiento en lugar de quedarse parado en Mercury."_
  - [`SIN ISSUE DETECTADO`] _"Slash coloca el excedente en instrumentos de bajo riesgo, manteniendo la liquidez accesible. **Wallester** cubre la capa de gastos."_


### `boe-febrero-2020-llc-doctrina-administrativa`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13459 caracteres · H2=13 · H3=0 · intro=62 palabras · cortas (<80w)=3 ("Implicaciones operativas" (77w); "Riesgo de regularización si llevabas años "como dividendos"" (60w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** mercury=1 · wallester=1 · wise=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- Cuotas de Mercury, Wise, Wallester, agente registrado, contabilidad"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- Cuotas de Mercury, Wise, Wallester, agente registrado, contabilidad"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `boi-report-fincen-guia-completa-2026`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 5613 caracteres · H2=9 · H3=0 · intro=39 palabras · cortas (<80w)=5 ("Qué es FinCEN y por qué pide esta información" (79w); "Quién debe presentar el BOI Report" (54w); "Plazos de presentación" (69w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=3 · boi=15 · fincen=8
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (7):**
  - [`SIN ISSUE DETECTADO`] _"El BOI Report (Beneficial Ownership Information Report) es una declaración obligatoria ante FinCEN (Financial Crimes Enforcement Network) que identifica a los propietarios beneficiarios de empresas registradas en Estados Unidos."_
  - [`SIN ISSUE DETECTADO`] _"Aquí te explicamos todo. ## Qué es FinCEN y por qué pide esta información FinCEN es una agencia del Departamento del Tesoro de Estados Unidos especializada en combatir delitos financieros: blanqueo de capitales, financiación del terrorismo, fraude."_
  - [`SIN ISSUE DETECTADO`] _"El BOI Report es su herramienta para saber quién está detrás de cada empresa registrada en EE.UU."_
  - [`SIN ISSUE DETECTADO`] _"El formulario requiere: - Datos de la empresa - Datos personales de cada beneficial owner - Subir imagen del documento de identidad de cada owner - Confirmar y enviar Una vez presentado, FinCEN te da un código de confirmación."_
  - [`SIN ISSUE DETECTADO`] _"Es importante guardar este código como prueba de cumplimiento. ## Diferencia entre BOI Report y Form 5472 Es una confusión habitual."_
  - [`SIN ISSUE DETECTADO`] _"Son complementarios, no excluyentes. ## Qué pasa con la privacidad La información del BOI Report no es pública."_
  - [`SIN ISSUE DETECTADO`] _"FinCEN la mantiene en una base de datos segura y solo la comparte con: - Autoridades policiales con una orden judicial o investigación activa - Instituciones financieras con autorización del titular Tu nombre, dirección y documento de identidad no aparecen en ningún registro público por culpa del BOI Report."_


### `bookkeeping-llc-paso-a-paso`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 17465 caracteres · H2=17 · H3=0 · intro=107 palabras · cortas (<80w)=1 ("Próximos pasos" (63w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=5 · mercury=13 · slash=4 · relay=4 · wallester=5 · wise=9 · revolut=2 · stripe=2 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"Esto significa: ninguna compra personal con la tarjeta de Mercury o Wallester, ninguna factura de la LLC pagada desde tu cuenta personal, y todas las retiradas marcadas como "owner draw" desde la cuenta de la LLC hacia tu cuent"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business** para divisas distintas al dólar, especialmente euros"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** para divisas distintas al dólar, especialmente euros"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (19):**
  - [`SIN ISSUE DETECTADO`] _"Una contabilidad ordenada te da tres cosas: cumplimiento (Form 5472, 1120 pro-forma y, en algunos estados, informes adicionales), control (saber cuánto ganas de verdad después de gastos) y respaldo en caso de auditoría bancaria o fiscal."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Esto significa: ninguna compra personal con la tarjeta de Mercury o Wallester, ninguna factura de la LLC pagada desde tu cuenta personal, y todas las retiradas marcadas como "owner draw" desde la cuenta de la LLC hacia tu cuenta personal."_
  - [`SIN ISSUE DETECTADO`] _"Si tu hoja dice que tienes 12.450 USD y Mercury dice 12.380 USD, hay 70 USD que no están explicados."_
  - [`SIN ISSUE DETECTADO`] _"Descarga los extractos del mes de Mercury, Wise y cualquier otra cuenta. 2."_
  - [`SIN ISSUE DETECTADO`] _"Esa carpeta es tu respaldo si algún día Mercury, el IRS o tu Hacienda local te piden información. ## Divisas: el detalle que más errores genera Si cobras en euros y operas la LLC en USD, cada vez que recibas un pago debes anotar dos cosas: el importe original y el importe convertido a USD al tipo de cambio del día."_
  - [`SIN ISSUE DETECTADO`] _"El IRS acepta el tipo de cambio diario o un tipo medio anual razonable; lo importante es ser coherente y documentar la fuente (Wise, Mercury o el tipo del banco central)."_
  - [`SIN ISSUE DETECTADO`] _"Ese resumen es lo que entregas a tu asesor para preparar el Form 1120 pro-forma y el Form 5472 obligatorio para LLCs de no residentes."_
  - [`SIN ISSUE DETECTADO`] _"Coste mensual: 250-400 USD entre software y servicios. **Caso 3: ecommerce con Stripe, Shopify y proveedores en Asia.** La complejidad multimoneda y multi-pasarela exige A2X o Synder para automatizar imports."_
  - [`SIN ISSUE DETECTADO`] _"Aunque el volumen sea bajo, llevar la contabilidad en una hoja de cálculo manual aumenta el riesgo de errores en el Form 5472 y dificulta justificar gastos ante el IRS si te auditan."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `cambiar-divisas-llc-mejores-opciones`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7171 caracteres · H2=7 · H3=6 · intro=92 palabras · cortas (<80w)=3 ("El problema con los bancos tradicionales" (70w); "Flujo recomendado" (67w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=10 · slash=3 · relay=4 · wallester=4 · wise=14 · revolut=2
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"Tarjeta Wise o Wallester"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Wise Business (la favorita)"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Wise Business (la favorita)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (12):**
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Wise Business (la favorita) Wise ofrece el tipo de cambio real (mid-market rate) más una comisión transparente y baja. - **Comisión:** 0.4-1.5% según el par de divisas - **Tipo de cambio:** Real, sin margen oculto - **Velocidad:** 1-2 días hábiles - **Ventaja:** Ves exactamente cuánto recibes antes de enviar ### 2."_
  - [`SIN ISSUE DETECTADO`] _"Mercury (directo desde tu cuenta) Mercury permite enviar wires internacionales con $0 de comisión, sí, gratis."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Tarjeta Wise o Wallester Si necesitas gastar en moneda local sin convertir manualmente, las tarjetas de débito con conversión automática son una opción excelente. - **Wise Card:** Convierte al tipo de cambio real cuando pagas."_
  - [`SIN ISSUE DETECTADO`] _"Sin sorpresas. - **Wallester:** Tarjetas virtuales y físicas vinculadas a cuentas multi-divisa."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 8524 caracteres · H2=9 · H3=7 · intro=67 palabras · cortas (<80w)=5 ("Lo que SÍ cambia" (77w); "Cuánto tarda y cuánto cuesta" (67w); "Cuándo NO cambiar (todavía)" (68w)) · largas (>400w)=1 ("Procedimiento real, paso a paso" (449w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=5 · mercury=2 · relay=2 · wise=2 · boi=10 · fincen=5 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"** Mercury, Wise, Relay y similares no requieren ninguna acción salvo si tu Registered Agent o dirección figuran en el perfil"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"** Mercury, Wise, Relay y similares no requieren ninguna acción salvo si tu Registered Agent o dirección figuran en el perfil"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (6):**
  - [`SIN ISSUE DETECTADO`] _"Si bloquea, hay vías administrativas (solicitudes directas al IRS para 147C, al estado para certificate of good standing, a FinCEN para la confirmación BOI). ### Paso 3."_
  - [`SIN ISSUE DETECTADO`] _"Actualizar el BOI Report si cambia algo Si el cambio de proveedor implica cambio de dirección de notificaciones de la LLC o de algún beneficiario reportado, hay 30 días para actualizar el BOI Report ante FinCEN."_
  - [`SIN ISSUE DETECTADO`] _"Comunicar a banca y plataformas (sólo si procede) Mercury, Wise, Relay y similares no necesitan saber nada del cambio de RA salvo que tu dirección registrada de la LLC haya cambiado."_
  - [`SIN ISSUE DETECTADO`] _"Lo único que se pierde es la inercia con el proveedor que ya no te servía. ## Cuándo NO cambiar (todavía) Hay dos momentos en los que conviene esperar: - **A pocas semanas del cierre fiscal**, si el proveedor actual ya está preparando tu 5472 del ejercicio."_
  - [`SIN ISSUE DETECTADO`] _"Termina ese ciclo y cambia después. - **Con BOI o 5472 atrasados pendientes**, si el proveedor actual está gestionando la regularización."_
  - [`SIN ISSUE DETECTADO`] _"Nos hacemos cargo del cambio de RA, del 8822-B, de la actualización del BOI si procede, y empezamos a operar el ciclo siguiente sin que pierdas un día de cobertura."_


### `caminos-legales-minimos-impuestos`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13660 caracteres · H2=13 · H3=0 · intro=100 palabras · cortas (<80w)=3 ("Camino cuatro: combinaciones legítimas" (73w); "Conclusión" (71w); "Próximos pasos" (63w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=1 · wise=1 · stripe=1 · crs=1 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- Banca y pasarelas internacionales operativas (Mercury, Stripe USA, Wise)"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- Banca y pasarelas internacionales operativas (Mercury, Stripe USA, Wise)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"No son recetas, son construcciones a medida. ## Lo que **no** funciona y conviene descartar - **No declarar la cuenta o sociedad extranjera**: el CRS reporta automáticamente."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `como-disolver-cerrar-llc-paso-a-paso`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 19684 caracteres · H2=15 · H3=0 · intro=154 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=5 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=8 · 5472=12 · mercury=5 · slash=4 · relay=4 · wallester=3 · wise=5 · stripe=2 · boi=11 · fincen=5 · crs=3 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"habla de cómo constituirla, cómo elegir estado, cómo abrir cuenta en Mercury o Wise Business"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (23):**
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"La mayoría de información que circula sobre LLCs habla de cómo constituirla, cómo elegir estado, cómo abrir cuenta en Mercury o Wise Business... pero casi nadie explica cómo se **cierra** correctamente."_
  - [`SIN ISSUE DETECTADO`] _"Antes de iniciar el proceso, conviene comprobar que el cierre tiene sentido frente a las alternativas: - **Pausar operaciones temporalmente**, manteniendo la LLC viva pero con cero actividad, presentando 5472 + 1120 con ceros y BOI report si aplica."_
  - [`SIN ISSUE DETECTADO`] _"Presentación de declaraciones finales ante el IRS (Form 1120 + 5472 marcados *Final return*). 5."_
  - [`SIN ISSUE DETECTADO`] _"Cierre del EIN ante el IRS y baja del BOI Report ante FinCEN cuando proceda. 7."_
  - [`SIN ISSUE DETECTADO`] _"Mercury, Wise Business, Relay y Slash tienen flujos de cierre en línea."_
  - [`SIN ISSUE DETECTADO`] _"Wallester gestiona el cierre por su área de soporte. - **Esperar al cierre confirmado** antes de presentar la disolución estatal."_
  - [`SIN ISSUE DETECTADO`] _"Wallester, si lo tienes con IBAN europeo, suele ser de los últimos en cerrarse y debe revisarse a la luz de tus obligaciones CRS en España. ## 4."_
  - [`SIN ISSUE DETECTADO`] _"La LLC, antes de morir, tiene que presentar su **última temporada IRS**, marcando los formularios como **Final return**: - **Form 1120 + Form 5472 (Final)** si tu LLC es single-member con dueño extranjero."_
  - [`SIN ISSUE DETECTADO`] _"La fecha clave es: presentar las declaraciones finales **antes de pedir el cierre del EIN**."_
  - [`SIN ISSUE DETECTADO`] _"Si pides el cierre del EIN sin haber presentado los modelos finales, el IRS no cierra el EIN y, peor aún, te puede generar una notice de non-filer al año siguiente."_
  - [`SIN ISSUE DETECTADO`] _"Si llevas años con la LLC y has acumulado retrasos en el 5472, **lo correcto es regularizar antes de cerrar**, no cerrar para tapar."_
  - [`SIN ISSUE DETECTADO`] _"Tienes detalle del riesgo concreto en la guía de sanciones del Form 5472 ."_
  - [`SIN ISSUE DETECTADO`] _"Cerrar una LLC con 5472 pendientes no extingue las sanciones devengadas; solo las congela y se las queda el IRS contra ti como persona física asociada al EIN. ## 5."_
  - [`SIN ISSUE DETECTADO`] _"Cierre del EIN y baja del BOI Report Una vez la LLC ya no existe legalmente (estado disuelto + declaraciones finales presentadas), el último paso con el IRS es **cerrar el EIN**."_
  - [`SIN ISSUE DETECTADO`] _"Técnicamente, el IRS no "elimina" un EIN: lo marca como inactivo."_
  - [`SIN ISSUE DETECTADO`] _"Para hacerlo, se envía una **carta firmada al Internal Revenue Service** identificando la entidad por nombre legal, EIN, dirección y motivo del cierre, adjuntando copia de la *Notice CP-575* original o, en su defecto, los datos de asignación del EIN."_
  - [`SIN ISSUE DETECTADO`] _"En paralelo, hay que revisar el **BOI Report ante FinCEN**."_
  - [`SIN ISSUE DETECTADO`] _"La normativa BOI (Beneficial Ownership Information) vigente exige reportes iniciales y de actualización; cuando la LLC se disuelve, conviene actualizar el reporte para reflejar el cese, dentro de los plazos establecidos por FinCEN."_
  - [`SIN ISSUE DETECTADO`] _"El régimen BOI ha tenido cambios y suspensiones recientes, así que conviene comprobar la regla aplicable en el momento exacto del cierre."_
  - [`SIN ISSUE DETECTADO`] _"Si tienes ITIN propio o hay socios con ITIN asociados a la LLC, esos ITINs no se "cierran" con la LLC: siguen siendo válidos para tu actividad personal en EE.UU. mientras los uses cada cierto tiempo (ver guía del ITIN ). ## 7."_
  - [`SIN ISSUE DETECTADO`] _"Si llevas años con 5472 atrasados y necesitas regularizar antes de cerrar, lo hacemos como **fase previa** del cierre para no arrastrar exposición."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `como-obtener-itin-numero-fiscal-irs`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 19688 caracteres · H2=12 · H3=0 · intro=288 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=2 ("Cuándo necesitas un ITIN: los seis casos típicos" (408w); "Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=5 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=3 · mercury=1 · slash=1 · relay=1 · wallester=1 · wise=1 · stripe=1 · ibkr=2 · boi=1 · fincen=1 · crs=2 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"emás, te integras de forma natural con el stack bancario que ya recomendamos: **Wise Business**, **Relay** y **Slash** como cuentas operativas principales, **Mercury** como secundaria de respaldo, y **Wallester** únicamente cuando necesitas"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"**Wise Business**, **Relay** y **Slash** como cuentas operativas principales, **Mercury** como secundaria de respaldo, y **Wallester** únicamente cuando necesitas un IBAN europeo a nombre de la LLC, siempre teniendo en cuenta su tratamiento"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (30):**
  - [`SIN ISSUE DETECTADO`] _"Sin ITIN no se cierra el círculo: ni hay reembolsos, ni se aplica el convenio USA-España de forma limpia, ni se completan las declaraciones que el sistema americano exige cuando tu nombre aparece como contribuyente."_
  - [`SIN ISSUE DETECTADO`] _"Sin ITIN, sin reembolso y, en muchos casos, sin posibilidad práctica de presentar el modelo americano que necesitabas."_
  - [`SIN ISSUE DETECTADO`] _"En **Exentax** llevamos cientos de procesos de ITIN cerrados para residentes en España y América Latina."_
  - [`SIN ISSUE DETECTADO`] _"Vive en la base **TIN** del IRS junto al SSN y al **EIN** (este último es para entidades, como tu LLC)."_
  - [`SIN ISSUE DETECTADO`] _"Lo que el ITIN **no** es: - No te permite trabajar legalmente en EE.UU. - No te da derecho a beneficios sociales (Social Security, Medicare). - No es un permiso de residencia ni un visado. - No te exime del Form 5472 si tienes una LLC unipersonal extranjera."_
  - [`SIN ISSUE DETECTADO`] _"Estos son los que vemos cada semana en Exentax: 1. **Reclamación de retención excesiva sobre dividendos USA.** Eres residente en España, tienes acciones americanas a través de un broker (IBKR, Charles Schwab, Fidelity) y recibes dividendos."_
  - [`SIN ISSUE DETECTADO`] _"Sin W-8BEN funcionando con un TIN extranjero válido, el broker te retiene 30%."_
  - [`SIN ISSUE DETECTADO`] _"Con un ITIN y el W-8BEN, normalmente bajas a 15% por convenio."_
  - [`SIN ISSUE DETECTADO`] _"Si ya te retuvieron de más, el reembolso pasa por un Form 1040-NR + W-7. 2. **Royalties de Amazon KDP, Apple, plataformas SaaS o YouTube.** Plataformas como Amazon KDP, Apple Books, Adobe Stock o algunos programas de afiliados americanos retienen 30% si no reciben un W-8BEN válido con TIN."_
  - [`SIN ISSUE DETECTADO`] _"Un ITIN bien emitido baja la retención al 0%, 5% o 10% según el tipo de renta y el convenio aplicable. 3. **Venta de inmueble en EE.UU. con retención FIRPTA.** Si vendes un inmueble americano siendo no residente, FIRPTA retiene 15% sobre el precio bruto de venta."_
  - [`SIN ISSUE DETECTADO`] _"Sin ITIN, no se presenta. 4. **Socio extranjero en una entidad americana con K-1.** Si formas parte de una **multi-member LLC** o de una **partnership** estadounidense, recibirás cada año un Schedule K-1 con tu participación en los beneficios, y la entidad debe retenerte (Form 8804/8805)."_
  - [`SIN ISSUE DETECTADO`] _"Hay un séptimo perfil más sutil: el **dueño de una LLC unipersonal** que en estricto sentido **no necesita ITIN para presentar el Form 5472 + 1120 pro forma** (su LLC se identifica con EIN y, en la casilla del foreign owner, basta con el nombre, dirección y país de residencia fiscal)."_
  - [`SIN ISSUE DETECTADO`] _"Pero si esa misma persona también tiene actividades personales que sí generan obligación de Form 1040-NR (FIRPTA, dividendos, K-1 de otra estructura), el ITIN deja de ser opcional. ## El stack documental: W-7, declaración fiscal, identificación El proceso de ITIN gira alrededor de tres elementos."_
  - [`SIN ISSUE DETECTADO`] _"Sin esa declaración, el ITIN se rechaza por falta de causa. - **Identidad acreditada con documento original o copia certificada.** El IRS exige verificar tu identidad con pasaporte (es el único documento que por sí solo cubre ambas pruebas: identidad y "foreign status")."_
  - [`SIN ISSUE DETECTADO`] _"Por eso la vía **CAA** es la que tiene sentido. ## Cómo lo hacemos en Exentax: ITIN llave en mano En Exentax operamos con la red **CAA** y gestionamos el ITIN como un proceso cerrado."_
  - [`SIN ISSUE DETECTADO`] _"El resto lo hacemos nosotros: 1. **Diagnóstico previo.** Antes de tocar nada, comprobamos que necesitas el ITIN (no todos los casos lo requieren) y, sobre todo, **bajo qué motivo** del W-7 vas a aplicar."_
  - [`SIN ISSUE DETECTADO`] _"Si tu caso es uno de los excepcionales que aplica vía W-8BEN, lo documentamos correctamente. 3. **Verificación de identidad por CAA.** Coordinamos la verificación del pasaporte mediante la red CAA."_
  - [`SIN ISSUE DETECTADO`] _"Por eso recomendamos siempre la vía CAA. ## Costes y errores comunes El IRS **no cobra tasa** por emitir un ITIN."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax trabajamos con un precio cerrado por proceso ITIN llave en mano que comunicamos antes de empezar, sin sorpresas."_
  - [`SIN ISSUE DETECTADO`] _"Los seis errores más típicos que vemos cuando alguien intenta hacer el ITIN por su cuenta son siempre los mismos: 1."_
  - [`SIN ISSUE DETECTADO`] _"Solicitar ITIN para perfiles que en realidad no lo necesitan (típicamente, dueños de single-member LLC sin actividad personal en EE.UU.)."_
  - [`SIN ISSUE DETECTADO`] _"Si estás empezando y todavía no tienes la LLC montada, lo lógico es trabajar las dos piezas en paralelo: la LLC como alternativa al autónomo , el EIN y, cuando aplique a tu situación personal, el ITIN."_
  - [`SIN ISSUE DETECTADO`] _"Y si ya tienes LLC pero estás recibiendo retenciones americanas que no entiendes, casi siempre la pieza que falta para limpiar la situación es esta. ## Renovación y caducidad: cuidado con los ITIN dormidos Un ITIN puede **caducar**."_
  - [`SIN ISSUE DETECTADO`] _"La regla histórica del IRS es que un ITIN no usado en una declaración fiscal durante **tres años consecutivos** queda inactivo."_
  - [`SIN ISSUE DETECTADO`] _"Y los ITIN emitidos antes de 2013 se han ido renovando por bloques según los dígitos del medio."_
  - [`SIN ISSUE DETECTADO`] _"En la práctica, si tu ITIN ha estado dormido durante años y vuelves a necesitarlo (porque vendiste un inmueble, o porque vuelves a tener dividendos americanos), conviene comprobar que sigue activo antes de aplicarlo."_
  - [`SIN ISSUE DETECTADO`] _"Si crees que necesitas un ITIN, para tu broker, para Amazon, para una venta FIRPTA, para una K-1, para un reembolso pendiente, o para limpiar de una vez tu situación con el IRS, pide una consulta gratuita y revisamos tu caso en 30 minutos."_
  - [`SIN ISSUE DETECTADO`] _"Y si quieres comparar antes el coste fiscal real de quedarte como autónomo frente a operar a través de una LLC con tu W-8BEN/ITIN bien montados, prueba primero nuestra calculadora fiscal : en dos minutos verás los números de tu propio escenario."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `como-operar-llc-dia-a-dia`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 15159 caracteres · H2=13 · H3=6 · intro=71 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (16w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Tus herramientas financieras: la operativa del día a día" (413w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=3 · mercury=24 · slash=6 · relay=6 · wallester=5 · wise=9 · revolut=4 · stripe=6 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"### Wallester: tarjetas corporativas para gastos del día a día"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"### Wise Business: tu herramienta de conversión de divisas"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"### Wise Business: tu herramienta de conversión de divisas"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (17):**
  - [`SIN ISSUE DETECTADO`] _"Tienes tu EIN, tu cuenta en Mercury abierta y tus documentos en orden."_
  - [`SIN ISSUE DETECTADO`] _"En la práctica: - **Todo ingreso de tu negocio** entra por la cuenta de la LLC en Mercury (o Relay) - **Todo gasto del negocio** sale de esa misma cuenta - **Nunca, jamás, under no circumstances** mezcles gastos personales con los de la LLC ¿Por qué tanta insistencia?"_
  - [`SIN ISSUE DETECTADO`] _"Es como tener un airbag desconectado, está ahí pero no te va a servir cuando lo necesites. ## Tus herramientas financieras: la operativa del día a día ### Mercury: tu plataforma financiera principal Mercury es donde vive el dinero de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Es tu cuenta bancaria empresarial, respaldada por Column NA (banco con licencia federal y seguro FDIC hasta $250,000)."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Esto es una ventaja brutal frente a cualquier banco tradicional. ### Wise Business: tu herramienta de conversión de divisas Wise (ojo: es una EMI."_
  - [`SIN ISSUE DETECTADO`] _"Puedes usar Mercury Invoicing (integrado en tu cuenta), Stripe Invoicing, o herramientas como FreshBooks, Wave o incluso un PDF bien hecho. **Tip pro:** Crea una plantilla de factura con todos los datos de tu LLC y reutilízala."_
  - [`SIN ISSUE DETECTADO`] _"Cuando llega el momento de preparar la declaración anual, en Exentax te pedimos esta información y nos encargamos del resto. ## Rutina mensual recomendada Para que la operativa sea fluida, te recomendamos dedicar 30 minutos al mes a esto: 1. **Revisa tu estado de cuenta** en Mercury."_
  - [`SIN ISSUE DETECTADO`] _"Establece buenos hábitos desde el día uno, usa las herramientas correctas (Mercury + Slash + Wallester + Wise + Stripe/Adyen) y dedica 30 minutos al mes a mantener el orden."_
  - [`SIN ISSUE DETECTADO`] _"Nos aseguramos de que Mercury esté aprobado, que Stripe esté conectado, que tu flujo de cobros y distribuciones funcione sin fricciones."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `constituir-llc-proceso-paso-a-paso`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12765 caracteres · H2=17 · H3=0 · intro=48 palabras · cortas (<80w)=12 ("Paso 1: Elegir el estado" (67w); "Paso 2: Elegir el nombre de la LLC" (42w); "Paso 3: Designar un Registered Agent" (47w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y en 30 minutos te explicamos todo el proceso para tu caso concreto" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=8 · slash=3 · relay=5 · wallester=2 · wise=3 · revolut=2 · stripe=1 · boi=5 · fincen=3 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"## Stack bancario equilibrado: Mercury, Relay, Slash y Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"El proceso de solicitud del EIN para no residentes se hace por fax o correo al IRS."_
  - [`SIN ISSUE DETECTADO`] _"Aunque en la mayoría de estados no se presenta ante ninguna autoridad, es imprescindible para abrir cuentas bancarias y verificar tu LLC en plataformas de pago. ## Paso 7: Presentar el BOI Report Desde 2024, todas las LLCs deben reportar sus propietarios reales ante FinCEN."_
  - [`SIN ISSUE DETECTADO`] _"Tienes **90 días** desde la constitución para presentar este informe. ## Paso 8: Abrir la cuenta bancaria Con los documentos en mano (Articles of Organization, EIN, Operating Agreement), puedes abrir tu cuenta bancaria en EE.UU."_
  - [`SIN ISSUE DETECTADO`] _"Pero seamos sinceros: ¿quieres dedicar semanas a navegar formularios en inglés, llamar al IRS (con su horario americano y sus 45 minutos de espera), rezar para que Mercury no te rechace la cuenta por un dato mal puesto, y descubrir a posteriori que tu Operating Agreement genérico no sirve?"_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `convenio-doble-imposicion-usa-espana-llc`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 15949 caracteres · H2=13 · H3=3 · intro=108 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=2 · mercury=1 · relay=1 · wise=1 · stripe=1 · ibkr=2 · boi=2 · fincen=2 · modelo720=4
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Conservar toda la documentación: extractos de Mercury/Relay/Wise, facturas emitidas por la LLC, contratos, W-8BEN-E firmados, Form 1042-S si los hay, declaraciones IRS y justificantes de gastos"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Conservar toda la documentación: extractos de Mercury/Relay/Wise, facturas emitidas por la LLC, contratos, W-8BEN-E firmados, Form 1042-S si los hay, declaraciones IRS y justificantes de gastos"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (9):**
  - [`SIN ISSUE DETECTADO`] _"En la mayoría de cobros vía Stripe, PayPal, AdSense o similares no te lo pedirán activamente porque el W-8BEN-E ya hace el trabajo."_
  - [`SIN ISSUE DETECTADO`] _"Pero ante una inspección o ante un broker como Interactive Brokers o un cliente corporativo grande, el certificado es la prueba dura de tu residencia. ## Formularios necesarios - **W-8BEN-E:** lo presenta tu LLC ante cada pagador USA para acreditar residencia del beneficiario y tipo de convenio aplicable."_
  - [`SIN ISSUE DETECTADO`] _"Ver nuestra guía completa de W-8BEN y W-8BEN-E . - **W-8BEN:** para personas físicas no residentes que cobren a su nombre, no a nombre de la LLC. - **Form 1042-S:** lo emite el pagador USA si te ha aplicado alguna retención."_
  - [`SIN ISSUE DETECTADO`] _"Es lento (12-18 meses típicamente) y requiere ITIN o EIN."_
  - [`SIN ISSUE DETECTADO`] _"Presentar el **modelo 720/721** si superas los umbrales de bienes en el extranjero (cuentas bancarias, valores, criptos). 6."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Conservar toda la documentación: extractos de Mercury/Relay/Wise, facturas emitidas por la LLC, contratos, W-8BEN-E firmados, Form 1042-S si los hay, declaraciones IRS y justificantes de gastos."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax cubrimos el lado USA (constitución, EIN, banca, compliance IRS y FinCEN, W-8 ante cada pagador) y coordinamos con tu asesor fiscal español, o te recomendamos uno si no tienes. > Cada caso es individual."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `crear-empresa-andorra-ventajas`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 13733 caracteres · H2=14 · H3=2 · intro=109 palabras · cortas (<80w)=4 ("Coste de vida y operativo" (75w); "Banca andorrana" (55w); "Riesgos reales y honestos" (59w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** crs=2 · fatca=1 · modelo720=3
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"Desde 2010 firmó acuerdos OCDE, aplica intercambio automático CRS y FATCA, tiene IRPF progresivo y IS del 10%."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `criptomonedas-trading-llc-impuestos`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9958 caracteres · H2=8 · H3=3 · intro=42 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=3 · slash=2 · wallester=1 · wise=1 · revolut=1 · ibkr=2 · kraken=4 · boi=1 · fincen=1 · crs=1 · modelo720=4
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury**: Para recibir fondos de exchanges en USD (Column NA, FDIC hasta $250K)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Tarjetas corporativas Wallester**: Emite tarjetas virtuales dedicadas para suscripciones de trading (TradingView, datos de mercado, señales) con límites independientes"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business como complemento**: siendo una EMI (Institución de Dinero Electrónico), Wise te da el tipo de cambio real para convertir las ganancias a tu"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business como complemento**: siendo una EMI (Institución de Dinero Electrónico), Wise te da el tipo de cambio real para convertir las ganancias a tu moneda lo"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"** Mercury permite recibir fondos de exchanges y operar en USD sin comisiones de conversión"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (7):**
  - [`CORREGIR` · `mercury-column-no-choice`] _"Wyoming además tiene legislación específica favorable para activos digitales (Digital Assets Act). 2. **EIN del IRS**: Para abrir cuentas en exchanges y bancos 3. **Cuenta Mercury**: Para recibir fondos de exchanges en USD (Column NA, FDIC hasta $250K) 4. **Slash**: Para gestionar la tesorería de tu LLC de trading."_
  - [`SIN ISSUE DETECTADO`] _"Ideal si mantienes reservas significativas en USD entre operaciones, generando rendimiento sobre el capital disponible. 5. **Kraken**: Exchange con cuenta corporativa para tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Kraken tiene una de las licencias regulatorias más sólidas del sector, con acceso a más de 200 criptoactivos, staking institucional, y soporte para cuentas empresariales con verificación avanzada."_
  - [`SIN ISSUE DETECTADO`] _"Su API es robusta para trading algorítmico. 6. **Interactive Brokers**: Si tu LLC también opera en mercados tradicionales (acciones, ETFs, opciones, futuros, forex), IB te da acceso a más de 150 mercados globales desde una sola cuenta empresarial."_
  - [`SIN ISSUE DETECTADO`] _"Tus fondos están custodiados en Column NA con seguro FDIC hasta $250K. - **Tesorería inteligente con Slash**: Si mantienes capital significativo entre operaciones, Slash te permite generar rendimiento sobre el saldo disponible de tu LLC."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"No es un exchange, es una plataforma de tesorería empresarial que optimiza tu capital parado. - **Wise Business como complemento**: siendo una EMI (Institución de Dinero Electrónico), Wise te da el tipo de cambio real para convertir las ganancias a tu moneda local."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Revolut Business añade otra capa multidivisa con conversiones competitivas entre semana. - **Tarjetas corporativas Wallester**: Emite tarjetas virtuales dedicadas para suscripciones de trading (TradingView, datos de mercado, señales) con límites independientes."_


### `crs-cuentas-bancarias-llc-intercambio-informacion`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 10874 caracteres · H2=13 · H3=0 · intro=56 palabras · cortas (<80w)=4 ("La diferencia entre evadir y optimizar" (78w); "El FBAR: otra obligación que no debes ignorar" (75w); "Lecturas relacionadas" (12w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=8 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=7 · relay=3 · wise=4 · payoneer=1 · boi=1 · fincen=2 · fbar=3 · crs=10 · fatca=2 · modelo720=4
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"mercury-llc-extranjero">Mercury</a>** es un Money Transmitter que usa Column NA como banco custodio"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `payoneer-no-crs`** — Evidencia: _"Información de terceros:** Plataformas como Wise o Payoneer, que operan en múltiples jurisdicciones, pueden estar sujetas a obligaciones de reporte en tu país"_  
    Fix (cita SOT): Toda mención de Payoneer debe incluir disclosure CRS (SOT §Payoneer).  
    Fuente primaria: Payoneer legal https://www.payoneer.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Si tienes una LLC en Estados Unidos y una cuenta en Mercury, Wise o Relay, es natural preguntarse: ¿puede Hacienda en mi país ver esa cuenta? ¿Saben cuánto dinero tengo allí?"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (11):**
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Si tienes una LLC en Estados Unidos y una cuenta en Mercury, Wise o Relay, es natural preguntarse: ¿puede Hacienda en mi país ver esa cuenta?"_
  - [`SIN ISSUE DETECTADO`] _"Te explicamos cómo funciona. ## Qué es el CRS y por qué existe El CRS (Common Reporting Standard) es un sistema de intercambio automático de información fiscal entre más de 100 países."_
  - [`SIN ISSUE DETECTADO`] _"Automáticamente, cada año. ## Estados Unidos y el CRS: la particularidad Aquí viene la parte interesante: **Estados Unidos no participa en el CRS.** Es el gran ausente."_
  - [`SIN ISSUE DETECTADO`] _"FATCA bilateral:** Muchos países tienen acuerdos bilaterales con EE.UU. que permiten el intercambio de cierta información fiscal."_
  - [`SIN ISSUE DETECTADO`] _"No es tan automático ni tan detallado como el CRS, pero existe. **2."_
  - [`SIN ISSUE DETECTADO`] _"En España, por ejemplo, el Modelo 720 requiere reportar cuentas con saldos superiores a 50.000€. **4."_
  - [`SIN ISSUE DETECTADO`] _"No tiene obligaciones CRS porque EE.UU. no participa. ** Wise ** es una EMI (Institución de Dinero Electrónico) con licencias en múltiples jurisdicciones."_
  - [`SIN ISSUE DETECTADO`] _"Al tener presencia en la UE, Reino Unido y otros países CRS, puede tener obligaciones de reporte en esas jurisdicciones sobre las cuentas de sus usuarios. **Relay** es una fintech que usa Thread Bank."_
  - [`SIN ISSUE DETECTADO`] _"Para no residentes con LLCs, el FBAR no suele ser directamente aplicable."_
  - [`SIN ISSUE DETECTADO`] _"EIN y documentación fiscal americana 3."_
  - [`SIN ISSUE DETECTADO`] _"Extractos bancarios de Mercury mostrando ingresos y gastos 4."_


### `crs-residentes-espana-latam-implicaciones`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P5`
- **Métricas estructurales:** 12786 caracteres · H2=12 · H3=0 · intro=51 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (7w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y lo analizamos contigo" · enlaces totales=11 · /agendar=0 (OK)
- **Resumen de menciones:** mercury=4 · relay=2 · wallester=3 · wise=4 · revolut=4 · crs=29 · fatca=3 · modelo720=5
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"El Common Reporting Standard (CRS) es la pieza más importante de la fiscalidad internacional de la última década, y muy poca gente entiende qué significa para alguien que tiene una LLC americana o cuentas fuera de su país de residencia."_
  - [`SIN ISSUE DETECTADO`] _"Vamos a desmontar el tema con precisión técnica y sin alarmismos. ## Qué es el CRS y por qué existe El **Common Reporting Standard** lo aprobó el Consejo de la OCDE en julio de 2014 como respuesta al G20 tras la crisis financiera y los escándalos de evasión fiscal (LuxLeaks, Panama Papers)."_
  - [`SIN ISSUE DETECTADO`] _"A nivel técnico, CRS es la generalización a más de 100 jurisdicciones del modelo previo (FATCA), pero con alcance multilateral en lugar de bilateral."_
  - [`SIN ISSUE DETECTADO`] _"Estados Unidos, importante: **no está adherido al CRS**."_
  - [`SIN ISSUE DETECTADO`] _"Tiene su propio sistema (FATCA) que es bilateral y solo de salida, no de entrada."_
  - [`SIN ISSUE DETECTADO`] _"Profundizamos en esto en nuestro artículo sobre si las cuentas bancarias en EE.UU. reportan a tu hacienda . ## Marco normativo - **OCDE**: Common Reporting Standard, julio 2014."_
  - [`SIN ISSUE DETECTADO`] _"Vamos a fijar conceptos: 1. **EE.UU. no envía datos por CRS.** Por tanto, ni Mercury, ni Relay, ni un banco regional americano enviarán datos directamente a la AEAT, SAT, DIAN o AFIP por CRS."_
  - [`SIN ISSUE DETECTADO`] _"El cruce CRS permite a la AEAT detectar omisiones casi en tiempo real respecto al ejercicio reportado."_
  - [`SIN ISSUE DETECTADO`] _"SAT mantiene programa específico de fiscalización de cuentas en el exterior detectadas por CRS. - **Colombia**: la DIAN integra CRS en su sistema de información exógena."_
  - [`SIN ISSUE DETECTADO`] _"Cuentas omitidas pueden generar liquidación oficial por renta líquida gravable presuntiva. - **Argentina**: AFIP recibe datos CRS y cruza con regímenes informativos propios."_
  - [`SIN ISSUE DETECTADO`] _"Pero en cuanto añades una capa europea (Wise, Revolut, Wallester, N26), aceptas que esa información llegue a tu hacienda."_
  - [`SIN ISSUE DETECTADO`] _"Ver nuestro framework de diseño de estructura internacional . 3. **Mantener documentación**: contratos, facturas, justificantes de gastos, libros contables de la LLC, autodeclaraciones CRS coherentes."_
  - [`SIN ISSUE DETECTADO`] _"La planificación tiene que evitar ese supuesto, no ignorarlo. - "Voy a poner la cuenta a nombre de un familiar." Es el clásico testaferro encubierto, cuyas implicaciones penales y fiscales analizamos en testaferros y prestanombres en LLCs . ## En resumen CRS no se "evita" desde una jurisdicción europea."_
  - [`SIN ISSUE DETECTADO`] _"¿Quieres que revisemos cómo te afecta CRS en tu caso concreto y diseñemos el stack adecuado?"_


### `cuanto-cuesta-constituir-llc`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 8052 caracteres · H2=8 · H3=6 · intro=88 palabras · cortas (<80w)=2 ("¿Cuánto cuesta con Exentax?" (66w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=4 · 5472=5 · mercury=1 · boi=7 · fincen=2 · fbar=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- ✓ Apertura de cuenta bancaria en Mercury (coordinamos todo)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level:** sin sentences tracked.


### `cuenta-bancaria-mercury-llc-extranjero`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18934 caracteres · H2=14 · H3=10 · intro=242 palabras · cortas (<80w)=4 ("Requisitos para abrir cuenta en Mercury" (67w); "¿Cuánto tarda la aprobación?" (30w); "Lecturas relacionadas" (7w)) · largas (>400w)=2 ("Más allá de la cuenta bancaria: la operativa financiera completa" (520w); "Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos y te explicamos todo el ecosistema financiero para tu LLC" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=33 · slash=9 · relay=7 · wallester=6 · wise=9 · revolut=5 · stripe=1 · boi=1 · fincen=1 · crs=2 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"### Wallester: tarjetas corporativas con control total"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"### Wise Business: transferencias internacionales al tipo de cambio real"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (40):**
  - [`SIN ISSUE DETECTADO`] _"Mercury aparece en casi todas las guías como la "opción por defecto" para no residentes, pero en Exentax **ya no la recomendamos como cuenta principal si tu operativa es íntegramente fuera de EE."_
  - [`SIN ISSUE DETECTADO`] _"UU.** El motivo es muy concreto: cuando Mercury cierra una cuenta por una revisión de compliance —algo cada vez más frecuente en 2026— **devuelve los fondos mediante un cheque físico en USD a nombre de la LLC, enviado por correo postal a la dirección registrada**."_
  - [`SIN ISSUE DETECTADO`] _"Si aún estás decidiendo entre bancos y fintechs, consulta nuestra comparativa de bancos vs fintech para tu LLC . > **Aviso 2026 — Mercury y operativa no estadounidense.** > Si toda tu actividad (clientes, pagos, gastos) ocurre fuera de EE."_
  - [`SIN ISSUE DETECTADO`] _"UU., Exentax **no recomienda Mercury como cuenta principal**."_
  - [`SIN ISSUE DETECTADO`] _"Recomendación: usa **Relay** (respaldada por Thread Bank, FDIC) o **Slash** (respaldada por Column N.A. y/o Stearns Bank, FDIC) como cuenta principal y reserva Mercury, si la abres, como cuenta secundaria con saldo operativo bajo."_
  - [`SIN ISSUE DETECTADO`] _"Diseñamos el stack contigo en la asesoría inicial. ## ¿Qué es Mercury exactamente?"_
  - [`SIN ISSUE DETECTADO`] _"Aquí hay un matiz importante que mucha gente confunde: **Mercury no es un banco.** Mercury es una plataforma fintech, un Money Transmitter registrado en EE.UU., que ofrece servicios bancarios a través de su banco asociado, **Column NA** (anteriormente conocido como Column National Association)."_
  - [`SIN ISSUE DETECTADO`] _"Column NA es un banco con licencia federal, asegurado por la FDIC hasta $250,000 por depositante."_
  - [`SIN ISSUE DETECTADO`] _"Que tu dinero está depositado de forma segura en un banco real con protección federal, pero la experiencia de usuario, la app, el panel de control y el soporte los gestiona Mercury."_
  - [`SIN ISSUE DETECTADO`] _"Pasaporte y EIN, y listo. - **$0 comisiones.** Ni mantenimiento, ni mínimos de saldo, ni sorpresas a final de mes. - **Wire transfers gratuitos.** Tanto envío como recepción de wires nacionales e internacionales: $0."_
  - [`SIN ISSUE DETECTADO`] _"Solicitud online Accedes a mercury.com y completas el formulario de solicitud."_
  - [`SIN ISSUE DETECTADO`] _"Te pedirán los datos de la LLC, el EIN, información del propietario (nombre, nacionalidad, dirección) y una descripción de la actividad."_
  - [`SIN ISSUE DETECTADO`] _"Verificación de la empresa Mercury verifica que tu LLC existe consultando los registros del estado donde la constituiste."_
  - [`SIN ISSUE DETECTADO`] _"También cruza información con el IRS para confirmar el EIN."_
  - [`SIN ISSUE DETECTADO`] _"Puedes enviar y recibir transferencias, vincular Stripe y PayPal, solicitar la tarjeta de débito y empezar a operar. ## ¿Cuánto tarda la aprobación? - **Caso típico:** 1-3 días hábiles. - **Con revisión manual:** 5-10 días hábiles. - **Si te rechazan:** puedes volver a aplicar ajustando la información."_
  - [`SIN ISSUE DETECTADO`] _"No es el fin del mundo. ## ¿Por qué pueden rechazarte? - **Actividad no soportada.** Mercury no trabaja con negocios de cannabis, armas, contenido adulto o gambling. - **Descripción vaga.** Si no explicas claramente qué hace tu empresa, compliance te rechaza."_
  - [`SIN ISSUE DETECTADO`] _"Estas son las plataformas que complementan Mercury para crear una operativa financiera profesional: ### Slash: tesorería corporativa Si tu LLC mantiene capital entre distribuciones (la mayoría de freelancers acumula 2-3 meses de ingresos), **Slash** permite que esa liquidez genere rendimiento."_
  - [`SIN ISSUE DETECTADO`] _"Slash es además **crypto-friendly**: integra rampas fiat ↔ cripto y acepta a operadores con flujos cripto que **Mercury y Wise rechazan o cierran**."_
  - [`SIN ISSUE DETECTADO`] _"En materia de reporte fiscal, Slash cumple las obligaciones estándar del IRS para entidades estadounidenses (1099 cuando aplica); no reporta directamente al residente fiscal extranjero por CRS, ya que EE."_
  - [`SIN ISSUE DETECTADO`] _"Para clientes Exentax, Wallester proporciona un IBAN en euros, facilitando la recepción y envío de pagos en zona euro directamente desde tu estructura LLC."_
  - [`SIN ISSUE DETECTADO`] _"Es la herramienta perfecta para mantener la separación financiera: cada gasto empresarial va a la tarjeta Wallester, nunca a tu tarjeta personal."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Todo queda documentado. ### Wise Business: transferencias internacionales al tipo de cambio real **Wise Business** es una EMI (Institución de Dinero Electrónico), no es un banco."_
  - [`SIN ISSUE DETECTADO`] _"Si facturas en dólares pero tienes gastos en euros, libras o cualquier otra moneda, Wise Business te ahorra el diferencial cambiario que los bancos tradicionales cobran."_
  - [`SIN ISSUE DETECTADO`] _"También te da cuentas locales en múltiples divisas con IBANs y routing numbers propios. ### Revolut Business: multi-divisa y tarjetas para equipo **Revolut Business** es otra EMI con funcionalidades multi-divisa potentes."_
  - [`SIN ISSUE DETECTADO`] _"Depósitos en **Thread Bank**."_
  - [`SIN ISSUE DETECTADO`] _"Mercury monetiza con productos premium (Mercury Treasury, crédito, etc.), no con comisiones sobre operaciones básicas. ## Consejos prácticos 1. **Prepara una descripción clara de tu negocio** antes de solicitar."_
  - [`SIN ISSUE DETECTADO`] _"Esto es lo que marca la diferencia entre aprobación y rechazo. 2. **No mezcles fondos personales y empresariales.** Usa la cuenta de Mercury exclusivamente para operaciones de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"Mercury lo hace muy fácil."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax nos encargamos de la apertura de tu cuenta Mercury como parte del proceso de constitución de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Si te preocupa el proceso de verificación bancaria, lee nuestra guía sobre due diligence bancario y cómo evitar bloqueos en Mercury, Wise y Revolut ."_
  - … (+10 sentences adicionales)


### `cuentas-bancarias-usa-reportan-hacienda-verdad`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 11695 caracteres · H2=14 · H3=2 · intro=124 palabras · cortas (<80w)=4 ("Lo que la gente cree que pasa (y no pasa)" (34w); "Wallester: caso distinto, hay que decirlo claro" (78w); "Lecturas relacionadas" (5w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=12 · slash=4 · relay=3 · wallester=5 · wise=13 · stripe=4 · ibkr=1 · kraken=1 · boi=3 · fincen=2 · crs=20 · fatca=3 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Para una LLC abierta hoy con Wise Business y residencia operativa en EE"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Es la pregunta más repetida cuando un cliente cierra su LLC con nosotros: "¿Mercury, Wise o Slash le cuentan a Hacienda lo que tengo?""_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (28):**
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Es la pregunta más repetida cuando un cliente cierra su LLC con nosotros: "¿Mercury, Wise o Slash le cuentan a Hacienda lo que tengo?"."_
  - [`SIN ISSUE DETECTADO`] _"Conviene separarlos. ### CRS (Common Reporting Standard) Es el estándar de la OCDE."_
  - [`SIN ISSUE DETECTADO`] _"Sus bancos identifican cuentas de no residentes y reportan saldos y rentas a las autoridades fiscales del país de residencia del titular. **Estados Unidos no participa en CRS."_
  - [`SIN ISSUE DETECTADO`] _"No recibe CRS.** Cualquier institución financiera 100 % estadounidense, abriendo una cuenta a una LLC US, queda fuera del circuito CRS."_
  - [`SIN ISSUE DETECTADO`] _"No hay flujo automático hacia tu país. ### FATCA Es la ley americana."_
  - [`SIN ISSUE DETECTADO`] _"FATCA **no exporta automáticamente datos de cuentas US a Hacienda local de un residente europeo o latinoamericano**."_
  - [`SIN ISSUE DETECTADO`] _"UU. con bancos US como custodios: - **Mercury** opera con Choice Financial Group, Column NA y Evolve Bank & Trust como bancos asociados. - **Slash** opera como cuenta corporativa US con producto de tesorería en bonos del Tesoro y rendimiento competitivo. - **Relay** opera con Thread Bank como custodio."_
  - [`SIN ISSUE DETECTADO`] _"Las tres son instituciones financieras estadounidenses. **Las tres están fuera del CRS** porque EE."_
  - [`SIN ISSUE DETECTADO`] _"Lo que esto significa, en términos prácticos: **el saldo de tu LLC en Mercury no se cruza automáticamente con tu IRPF**."_
  - [`SIN ISSUE DETECTADO`] _"La trazabilidad existe, pero permanece dentro del sistema US. ## Wise: el matiz importante Wise opera con varias entidades en distintas jurisdicciones."_
  - [`SIN ISSUE DETECTADO`] _"Esto es lo que cambia el reporting: - **Wise US Inc.** (cuenta US para LLC americanas, IBAN/ACH/wire en USD): es entidad estadounidense. **Está fuera del CRS.** Igual que Mercury. - **Wise Europe SA** (cuenta multidivisa europea con IBAN belga): es entidad UE."_
  - [`SIN ISSUE DETECTADO`] _"Sí está dentro del CRS y reporta saldos al país de residencia fiscal del titular."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Para una LLC abierta hoy con Wise Business y residencia operativa en EE."_
  - [`SIN ISSUE DETECTADO`] _"UU., la cuenta principal va por Wise US Inc."_
  - [`SIN ISSUE DETECTADO`] _"Eso te deja fuera del CRS para esa cuenta."_
  - [`SIN ISSUE DETECTADO`] _"Si además operas la cuenta multidivisa europea, entonces ahí sí hay reporting CRS sobre esa parte. **Conclusión limpia: Wise US Inc. no reporta CRS."_
  - [`SIN ISSUE DETECTADO`] _"Wise Europe SA sí.** Saberlo te permite estructurar la operativa con criterio. ## Wallester: caso distinto, hay que decirlo claro Wallester es emisor europeo de tarjetas (Estonia/UE)."_
  - [`SIN ISSUE DETECTADO`] _"Está dentro del marco CRS europeo."_
  - [`SIN ISSUE DETECTADO`] _"Cuando emites tarjetas Wallester ligadas a una cuenta operativa, el reporting de la cuenta subyacente depende de dónde esté la cuenta."_
  - [`SIN ISSUE DETECTADO`] _"Si conectas Wallester a una cuenta US (Mercury, Wise US, Relay), la cuenta sigue fuera de CRS; si la conectas a una cuenta EMI europea, entra al circuito CRS."_
  - [`SIN ISSUE DETECTADO`] _"Es una herramienta operativa potente, pero hay que diseñarla sabiendo qué entidad emite cada pieza. ## Pasarelas de pago: Stripe, PayPal, Whop, Hotmart, Adyen Las pasarelas no son cuentas bancarias."_
  - [`SIN ISSUE DETECTADO`] _"Son procesadores de transacciones que liquidan a la cuenta bancaria que les indiques. **No están dentro del CRS** y no reportan saldos."_
  - [`SIN ISSUE DETECTADO`] _"UU. para Stripe US, por ejemplo), pero los fondos viven en tu cuenta bancaria, no en la pasarela."_
  - [`SIN ISSUE DETECTADO`] _"Una LLC que cobra por Stripe US y liquida a Mercury opera todo el ciclo dentro del sistema financiero estadounidense."_
  - [`SIN ISSUE DETECTADO`] _"Como residente fiscal europeo tienes tus propias obligaciones declarativas (Modelo 720/721 en España, equivalentes en Portugal, Francia, Alemania), y eso lo gestionas a tu ritmo y con tu asesor local."_
  - [`SIN ISSUE DETECTADO`] _"Le mostramos cómo funciona el sistema de verdad: cuenta US fuera de CRS, FATCA bilateral pero sin flujo cuenta-a-cuenta hacia su país, anonimato registral real."_
  - [`SIN ISSUE DETECTADO`] _"No porque la LLC reporte (no lo hace), sino porque las transferencias entrantes en su cuenta española sí están dentro del sistema CRS español."_
  - [`SIN ISSUE DETECTADO`] _"El cliente que tiene Wise multidivisa europea + Mercury**: le explicamos qué entidad reporta qué."_


### `dac7-plataformas-digitales-reporting-2026`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 12319 caracteres · H2=12 · H3=0 · intro=71 palabras · cortas (<80w)=3 ("Calendario y aplicación temporal" (69w); "Plataformas afectadas (lista no exhaustiva)" (46w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita" · enlaces totales=8 · /agendar=0 (OK)
- **Resumen de menciones:** wise=1 · crs=9 · fatca=2 · modelo720=2
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (9):**
  - [`SIN ISSUE DETECTADO`] _"Recopila los datos de la LLC (EIN, dirección registrada en EE.UU., dirección operativa) y los de los **beneficiarios efectivos** si la plataforma sigue criterios estrictos de KYC. 3."_
  - [`SIN ISSUE DETECTADO`] _"Esto se complementa con el reporte CRS de los bancos que reciben los pagos de la plataforma."_
  - [`SIN ISSUE DETECTADO`] _"La combinación DAC7 + CRS deja muy poca opacidad. ## Combinación con CRS, DAC8 y FATCA DAC7 no opera de forma aislada."_
  - [`SIN ISSUE DETECTADO`] _"Es parte de un ecosistema regulatorio: - **CRS / DAC2**: reporting bancario de saldos y rendimientos."_
  - [`SIN ISSUE DETECTADO`] _"Ver CRS para residentes ES y LATAM . - **DAC6**: reporting obligatorio de mecanismos transfronterizos potencialmente agresivos por intermediarios fiscales. - **DAC7**: reporting de plataformas digitales (lo que acabamos de explicar). - **DAC8**: reporting de criptoactivos, plenamente aplicable desde 2026."_
  - [`SIN ISSUE DETECTADO`] _"Ver DAC8 y criptomonedas . - **FATCA** (EE.UU.): reporting de cuentas de US persons en entidades extranjeras."_
  - [`SIN ISSUE DETECTADO`] _"No es opcional, no se evita y, combinada con CRS y DAC8, conforma el sistema de información tributaria más denso de la historia europea."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `dac8-criptomonedas-reporting-fiscal-2026`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10617 caracteres · H2=13 · H3=0 · intro=84 palabras · cortas (<80w)=4 ("Marco normativo" (68w); "Calendario" (54w); "En resumen" (66w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita" · enlaces totales=5 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · kraken=3 · boi=1 · fincen=1 · crs=7 · modelo720=8
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (4):**
  - [`SIN ISSUE DETECTADO`] _"A partir de 2026, todos los proveedores de servicios sobre criptoactivos en la UE están obligados a reportar a las autoridades fiscales europeas la información de sus clientes y de sus operaciones, en línea con el modelo CRS aplicado a la banca tradicional."_
  - [`SIN ISSUE DETECTADO`] _"DAC8 es para criptoactivos lo que CRS / DAC2 es para depósitos bancarios y lo que DAC7 es para plataformas digitales: identificación obligatoria del cliente, recopilación estandarizada de información, reporte anual a la autoridad fiscal nacional e intercambio automático con las demás autoridades."_
  - [`SIN ISSUE DETECTADO`] _"Reporta saldos y operaciones a la autoridad fiscal de su Estado miembro, que reenvía al país de residencia del beneficiario efectivo. 2. **LLC con cuenta en exchange estadounidense (Coinbase US, Kraken US, Gemini)**: estos exchanges no están sujetos a DAC8."_
  - [`SIN ISSUE DETECTADO`] _"CRS para banca, DAC7 para plataformas, DAC8 para cripto."_


### `diseno-estructura-fiscal-internacional-solida`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 14364 caracteres · H2=14 · H3=0 · intro=56 palabras · cortas (<80w)=3 ("Errores típicos a evitar" (71w); "Lecturas relacionadas" (22w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y empezamos" · enlaces totales=16 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=3 · mercury=10 · slash=4 · relay=6 · wallester=4 · wise=7 · revolut=5 · stripe=3 · ibkr=1 · boi=4 · fincen=2 · crs=4 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Cuenta multidivisa secundaria**: Wise Business o Revolut Business para EUR/GBP/operativa europea, conscientes de su perfil CRS"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (15):**
  - [`SIN ISSUE DETECTADO`] _"El diagnóstico patrimonial define qué hace falta proteger y qué hay que declarar (Modelo 720, 721 en España; equivalentes LATAM). - **Tu objetivo a 5 años**: crecer, mantener, vender el negocio, retirarte."_
  - [`SIN ISSUE DETECTADO`] _"Se compone de: - **Sustancia legal**: documentos formales (Articles, Operating Agreement, BOI Report, EIN, agente registrado, dirección operativa real)."_
  - [`SIN ISSUE DETECTADO`] _"Recomendaciones generales: - **Cuenta principal**: Mercury o Relay (USA), por su solidez operativa, banca FDIC sweep y baja huella CRS."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Ver cómo abrir Mercury . - **Cuenta multidivisa secundaria**: Wise Business o Revolut Business para EUR/GBP/operativa europea, conscientes de su perfil CRS."_
  - [`SIN ISSUE DETECTADO`] _"Ver Wise y CRS y Revolut y CRS . - **Tarjetas corporativas**: Wallester o las propias de Mercury/Relay. - **Pasarelas de pago**: Stripe, PayPal, Adyen o DoDo Payments según modelo."_
  - [`SIN ISSUE DETECTADO`] _"Ver comparativa de pasarelas . - **Tesorería e inversión**: Slash o Mercury Treasury para liquidez operativa; Interactive Brokers para inversión a más largo plazo."_
  - [`SIN ISSUE DETECTADO`] _"Coordinación obligatoria con DAC7. **Perfil 3: SaaS B2B internacional, residente en LATAM, 100.000 € arr.** LLC + Mercury + Stripe + Merchant of Record para suscripciones internacionales."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `documentar-separacion-fondos-llc-historial`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7412 caracteres · H2=8 · H3=7 · intro=62 palabras · cortas (<80w)=4 ("Cuándo conviene apoyo profesional" (57w); "Cómo lo abordamos en Exentax" (70w); "Lecturas relacionadas" (27w)) · largas (>400w)=1 ("Procedimiento ordenado" (483w)) · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=3 · mercury=2 · wise=1 · stripe=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- Cualquier **revisión de KYC** futura por parte de Mercury, Wise o similar, que pedirá explicaciones de movimientos confusos"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"Si por error se paga con personal, reembolso documentado en el plazo más corto razonable. - **Bookkeeping mensual** o, como mínimo, trimestral. ## Cómo se ve esto desde fuera Imagina un auditor del IRS, un abogado defendiendo a la LLC en un litigio o un compliance officer de Mercury revisando la cuenta."_
  - [`SIN ISSUE DETECTADO`] _"El producto final es siempre el mismo: una LLC con corporate veil reforzado, contabilidad coherente, 5472 preparado sin huecos y un memorando que cierra el episodio."_


### `documentos-llc-cuales-necesitas`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 10764 caracteres · H2=12 · H3=0 · intro=78 palabras · cortas (<80w)=4 ("4. Certificate of Formation / Certificate of Good Standing" (77w); "5. BOI Report Confirmation" (77w); "6. Registered Agent Agreement" (68w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y lo revisamos contigo" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=10 · slash=3 · relay=6 · wallester=2 · wise=3 · revolut=2 · stripe=6 · boi=4 · fincen=4 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"## Stack bancario equilibrado: Mercury, Relay, Slash y Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (17):**
  - [`SIN ISSUE DETECTADO`] _"Spoiler: no son muchos, y los vas a usar más de lo que piensas (sobre todo cuando abras tu cuenta bancaria en Mercury o te registres en Stripe ). ## 1."_
  - [`SIN ISSUE DETECTADO`] _"EIN Letter (CP 575 / SS-4 Confirmation) El EIN (Employer Identification Number) es el número de identificación fiscal de tu LLC ante el IRS."_
  - [`SIN ISSUE DETECTADO`] _"La carta CP 575 del IRS confirma oficialmente la asignación de tu EIN. **¿Cuándo lo necesitas?** Para abrir cuentas bancarias (Mercury, Relay), registrarte en Stripe/PayPal, presentar declaraciones fiscales (Form 5472 + 1120) y operar con clientes americanos."_
  - [`SIN ISSUE DETECTADO`] _"Algunos bancos y procesadores de pago piden específicamente la carta CP 575 como verificación. **En Exentax:** Solicitamos el EIN directamente al IRS y te entregamos la carta de confirmación. ## 3."_
  - [`SIN ISSUE DETECTADO`] _"Solo tú y las entidades que tú elijas (Mercury, Stripe) lo ven."_
  - [`SIN ISSUE DETECTADO`] _"BOI Report Confirmation El BOI Report (Beneficial Ownership Information) es una declaración ante FinCEN que identifica a los propietarios reales de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"Desde 2024, todas las LLCs deben presentarlo (aunque FinCEN ha suspendido temporalmente la enforcement de sanciones). **¿Cuándo lo necesitas?** Dentro de los 30 días posteriores a la constitución (para LLCs nuevas a partir de 2025)."_
  - [`SIN ISSUE DETECTADO`] _"El EIN sustituye al SSN para efectos fiscales de la LLC - **Visa o permiso de trabajo**: No necesitas estar autorizado a trabajar en EE.UU. para tener una LLC."_
  - [`SIN ISSUE DETECTADO`] _"Cada documento sale revisado y preparado para que puedas usarlo inmediatamente con Mercury, Stripe o cualquier entidad que lo pida."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `dubai-uae-mito-no-impuestos`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12199 caracteres · H2=12 · H3=0 · intro=95 palabras · cortas (<80w)=1 ("Próximos pasos" (63w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · wise=1 · stripe=1 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Wise Business permite operar en USD/EUR desde EAU"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Wise Business permite operar en USD/EUR desde EAU"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"Stripe **sí opera** en EAU desde 2024-2025, pero con limitaciones de métodos de pago."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Wise Business permite operar en USD/EUR desde EAU. ## Comparación honesta con la LLC americana La pregunta importante: ¿qué resuelve EAU que no resuelva una LLC americana? - **Si vives en EAU**: 0% IRPF personal real (siempre que cumplas residencia)."_


### `due-diligence-bancario-llc-americana`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 8921 caracteres · H2=12 · H3=7 · intro=57 palabras · cortas (<80w)=7 ("¿Qué es la due diligence bancaria?" (47w); "Sectores que requieren mayor due diligence" (73w); "Cómo facilitar el proceso" (66w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=1 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=15 · slash=4 · relay=4 · wallester=3 · wise=4 · revolut=3 · stripe=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury usa **Column NA** (Column National Association) como banco custodio"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"Además, coordinamos la verificación de cada herramienta adicional: Slash, Wallester, Wise Business, Revolut Business, Stripe"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"s, coordinamos la verificación de cada herramienta adicional: Slash, Wallester, Wise Business, Revolut Business, Stripe"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"s, coordinamos la verificación de cada herramienta adicional: Slash, Wallester, Wise Business, Revolut Business, Stripe"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"En Mercury, este proceso es 100% online. ### 2."_
  - [`SIN ISSUE DETECTADO`] _"Mientras que un banco tradicional puede tardar semanas o meses, Mercury suele completar el proceso en días."_
  - [`SIN ISSUE DETECTADO`] _"Mercury ha simplificado enormemente la due diligence para LLCs de no residentes."_
  - [`SIN ISSUE DETECTADO`] _"Un matiz que quedó corto y que conviene leer aparte: Prevención de blanqueo de capitales: lo que tu LLC necesita saber , porque afina exactamente los bordes de lo explicado en esta guía. ## Cómo lo coordinamos en Exentax Preparamos toda la documentación antes de enviar la solicitud a Mercury."_
  - [`SIN ISSUE DETECTADO`] _"Articles, EIN, Operating Agreement, pasaporte: todo alineado y coherente."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Además, coordinamos la verificación de cada herramienta adicional: Slash, Wallester, Wise Business, Revolut Business, Stripe."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`SIN ISSUE DETECTADO`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `ein-numero-fiscal-llc-como-obtenerlo`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9627 caracteres · H2=9 · H3=4 · intro=46 palabras · cortas (<80w)=3 ("¿Cuánto cuesta obtener el EIN?" (62w); "¿Cuánto tarda?" (47w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y arrancamos" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=2 · slash=1 · relay=2 · wallester=1 · wise=1 · revolut=1 · stripe=2 · ibkr=1 · kraken=1 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury (Column NA, FDIC, $0 wires) y Relay (Thread Bank, hasta 20 sub-cuentas)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Tarjetas corporativas:** Wallester para control de gastos con tarjetas virtuales y físicas"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Multi-divisa:** Wise Business (tipo de cambio mid-market) y Revolut Business (cuentas multi-divisa)"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Multi-divisa:** Wise Business (tipo de cambio mid-market) y Revolut Business (cuentas multi-divisa)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"** Ningún banco, ni Mercury, ni Relay, ni ningún otro, te abrirá una cuenta sin tu EIN"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (26):**
  - [`SIN ISSUE DETECTADO`] _"El EIN (Employer Identification Number) es el número de identificación fiscal que el IRS asigna a tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Sin este número, tu LLC existe legalmente pero no puede operar en la práctica. ## ¿Para qué necesitas el EIN?"_
  - [`SIN ISSUE DETECTADO`] _"PayPal Business además requiere el ITIN del propietario. - **Contratar servicios.** Proveedores y plataformas B2B en Estados Unidos solicitan el EIN para generar facturas y formularios 1099."_
  - [`SIN ISSUE DETECTADO`] _"Sin EIN, tu LLC es como un coche sin matrícula: legal sobre el papel, pero no puedes circular con él."_
  - [`SIN ISSUE DETECTADO`] _"Por eso es el primer paso operativo después de constituir la LLC. ## ¿Cómo se obtiene el EIN?"_
  - [`SIN ISSUE DETECTADO`] _"El IRS ofrece varias vías para solicitar el EIN."_
  - [`SIN ISSUE DETECTADO`] _"Pero antes de que te líes con formularios y llamadas internacionales: **en Exentax nos encargamos de todo el proceso del EIN.** Lo gestionamos como parte de la constitución de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Dicho esto, para que entiendas cómo funciona: ### Opción 1: Online (solo para residentes en EE.UU.) Si tienes un SSN (Social Security Number) o ITIN y una dirección en Estados Unidos, puedes solicitarlo directamente en la web del IRS y recibirlo en minutos."_
  - [`SIN ISSUE DETECTADO`] _"Pero esta opción no está disponible para no residentes sin SSN/ITIN. ### Opción 2: Por correo o fax (Form SS-4) Como no residente, se debe completar el formulario SS-4 y enviarlo al IRS por fax o correo postal."_
  - [`SIN ISSUE DETECTADO`] _"Se puede llamar, proporcionar los datos del SS-4 verbalmente y recibir el EIN en la misma llamada."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax conocemos los mejores métodos y horarios para obtener el EIN de forma rápida."_
  - [`SIN ISSUE DETECTADO`] _"Es parte de nuestra rutina diaria. ## ¿Cuánto cuesta obtener el EIN? **El EIN es completamente gratuito.** El IRS no cobra nada por emitirlo."_
  - [`SIN ISSUE DETECTADO`] _"Si alguien te cobra solo por el EIN, desconfía, probablemente estás pagando un servicio inflado."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax, la obtención del EIN está incluida en todos nuestros planes de constitución."_
  - [`SIN ISSUE DETECTADO`] _"Si usas tu dirección personal en otro país, la documentación puede no llegar o llegar con mucho retraso. 4. **Intentar solicitar online sin SSN/ITIN.** El sistema online rechaza solicitudes sin estos números."_
  - [`SIN ISSUE DETECTADO`] _"No pierdas tiempo intentándolo. ## ¿EIN vs ITIN: cuál es la diferencia? - **EIN** es para empresas."_
  - [`SIN ISSUE DETECTADO`] _"Tu LLC tiene un EIN."_
  - [`SIN ISSUE DETECTADO`] _"Es el "NIF" de tu empresa americana. - **ITIN** (Individual Taxpayer Identification Number) es para personas físicas no residentes que necesitan un número fiscal personal en EE.UU."_
  - [`SIN ISSUE DETECTADO`] _"Te lo explicamos en detalle en nuestra guía sobre ITIN, SSN y EIN ."_
  - [`SIN ISSUE DETECTADO`] _"Para operar tu LLC, solo necesitas el EIN."_
  - [`SIN ISSUE DETECTADO`] _"El ITIN es necesario en ciertos casos específicos, por ejemplo, si tienes ingresos personales imponibles en EE.UU., si necesitas reclamar beneficios de un tratado fiscal, o si quieres abrir ciertas cuentas que lo requieren. **En Exentax también te ayudamos con la obtención del ITIN** si lo necesitas."_
  - [`SIN ISSUE DETECTADO`] _"Es un proceso más largo y burocrático que el EIN (requiere enviar documentación certificada al IRS), pero lo gestionamos de principio a fin."_
  - [`SIN ISSUE DETECTADO`] _"Algunos matices quedaron cortos y conviene leerlos aparte: Por qué abrir una LLC en Estados Unidos: privacidad, seguridad y ventajas fiscales y LLC para desarrolladores de software y SaaS: la estructura ideal , porque afinan exactamente los bordes de lo explicado en esta guía. ## ¿Qué pasa si pierdes tu EIN?"_
  - [`SIN ISSUE DETECTADO`] _"El EIN se asigna de forma permanente a tu LLC y no caduca."_
  - [`SIN ISSUE DETECTADO`] _"También puedes encontrar tu EIN en declaraciones anteriores presentadas ante el IRS."_
  - [`SIN ISSUE DETECTADO`] _"¿Quieres constituir tu LLC y que nos encarguemos del EIN, el ITIN (si lo necesitas) y todo lo demás?"_


### `empresa-bulgaria-10-tributacion`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 14795 caracteres · H2=14 · H3=0 · intro=87 palabras · cortas (<80w)=4 ("Tipos societarios disponibles" (67w); "Banca: mejor que Hong Kong, peor que EE.UU." (78w); "Riesgos reales" (57w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=1 · wallester=1 · wise=3 · revolut=2 · stripe=2 · boi=1 · fincen=1 · crs=2 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Banca y pagos**: Mercury, Wise, Wallester, Stripe USA y Adyen, sin necesidad de presencia física, frente al ecosistema más limitado búlgaro"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Wise Business y Revolut Business funcionan también, pero como EMI"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **Banca y pagos**: Mercury, Wise, Wallester, Stripe USA y Adyen, sin necesidad de presencia física, frente al ecosistema más limitado búlgaro"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (4):**
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Wise Business y Revolut Business funcionan también, pero como EMI."_
  - [`SIN ISSUE DETECTADO`] _"Las EMIs europeas (Wise, Revolut) son la alternativa más operativa. **¿Bulgaria está en CRS?** Sí."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `empresa-panama-fiscalidad-residencia`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 12532 caracteres · H2=13 · H3=0 · intro=101 palabras · cortas (<80w)=3 ("Tipos societarios disponibles" (76w); "Fiscalidad: el principio territorial sigue vigente" (59w); "Próximos pasos" (63w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=2 · stripe=2 · boi=1 · fincen=1 · crs=4 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Comparado con abrir Mercury para una LLC en 7-14 días sin viajar, la diferencia es abismal"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (6):**
  - [`SIN ISSUE DETECTADO`] _"Eso ha endurecido la relación bancaria internacional. - **Adhesión al CRS**: las cuentas bancarias panameñas se reportan automáticamente al país de residencia fiscal del titular. - **Adhesión a BEPS**."_
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Comparado con abrir Mercury para una LLC en 7-14 días sin viajar, la diferencia es abismal. ## Comparación honesta con la LLC americana Para el perfil habitual que asesoramos: - **Fiscalidad neta**: ambas estructuras pueden alcanzar 0% en el país de constitución (Panamá por territorialidad, EE.UU. por pass-through )."_
  - [`SIN ISSUE DETECTADO`] _"La LLC americana no tiene esa carga. - **Banca**: Mercury vs. odisea bancaria panameña. - **Reputación**: una LLC americana es percibida como una empresa normal."_
  - [`SIN ISSUE DETECTADO`] _"Una sociedad panameña, especialmente desde 2016, levanta sospechas en muchos clientes y proveedores. - **Coste anual**: 500-800 USD vs 1.500-3.500 USD. - **Pasarelas**: Stripe USA, PayPal, Adyen, DoDo Payments con LLC."_
  - [`SIN ISSUE DETECTADO`] _"En Panamá, Stripe no opera, las opciones son más limitadas."_
  - [`SIN ISSUE DETECTADO`] _"Mantenerlas exige reestructuración. - **No declarar en tu país**: si eres residente fiscal en España y tienes una sociedad panameña, debes declarar el control efectivo (Modelo 720, transparencia fiscal internacional)."_


### `empresa-reino-unido-uk-ltd`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13532 caracteres · H2=17 · H3=0 · intro=94 palabras · cortas (<80w)=7 ("Qué es una UK Ltd" (65w); "Coste real anual" (71w); "Ventajas reales de una UK Ltd" (76w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=2 · wise=2 · revolut=2 · stripe=2 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business**: aceptado, EMI con IBAN británico y de otros países"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business**: aceptado, EMI con IBAN británico y de otros países"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **Banca**: Mercury para LLC, Wise/Revolut para UK Ltd"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (1):**
  - [`SIN ISSUE DETECTADO`] _"Ambas funcionan, Mercury es más completa. - **Reputación**: comparables, ambas excelentes. - **Coste anual**: ~600 USD LLC vs ~1.500-3.500 GBP UK. - **Compliance**: Form 5472 anual para LLC vs Confirmation Statement + cuentas + CT600 para UK."_


### `errores-criticos-llc-ya-constituida`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18066 caracteres · H2=11 · H3=10 · intro=92 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (7w); "Próximos pasos" (42w)) · largas (>400w)=2 ("Los 10 errores críticos que vemos cada semana" (1059w); "Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=6 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=9 · mercury=7 · slash=3 · relay=5 · wallester=2 · wise=6 · revolut=2 · stripe=1 · ibkr=1 · kraken=1 · boi=4 · fincen=3 · crs=10 · fatca=1 · modelo720=5
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"en nuestro análisis sobre <a href="/es/blog/wise-business-crs-reporting-fiscal">Wise Business y CRS</a> y en el artículo específico sobre <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">qué IBAN concreto reporta Wise a Hacienda cuando"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (25):**
  - [`SIN ISSUE DETECTADO`] _"Aquí van los diez errores que más se repiten, qué consecuencias tienen y cómo se corrigen. ## Por qué nadie te lo ha explicado La constitución de una LLC se ha convertido en un producto barato y rápido: pagas, recibes los Articles of Organization y el EIN, y se acabó la relación con el proveedor."_
  - [`SIN ISSUE DETECTADO`] _"No declararlos no es "optimización", es **omisión** y, con CRS/DAC operativos en 2026, sale a la luz. **Consecuencia típica:** regularización de varios ejercicios + recargos + intereses + posible sanción tributaria. ### Error 2."_
  - [`SIN ISSUE DETECTADO`] _"No presentar Form 5472 (o no saber que existe) Si eres no residente con Single-Member LLC y has movido cualquier euro entre tú y la LLC (ingresos retirados, aportaciones, pagos), estás obligado a presentar **Form 5472 + Form 1120 pro-forma cada año**."_
  - [`SIN ISSUE DETECTADO`] _"Más detalle en nuestra guía del Form 5472 . ### Error 3."_
  - [`SIN ISSUE DETECTADO`] _"Saltarse el BOI Report o no actualizarlo El **Beneficial Ownership Information Report** ante FinCEN es obligatorio desde 2024."_
  - [`SIN ISSUE DETECTADO`] _"Además, el Form 5472 se vuelve un caos porque cada movimiento entre tú y la LLC hay que documentarlo y reportarlo."_
  - [`SIN ISSUE DETECTADO`] _"Detalles en separar finanzas personales y de la LLC . **Consecuencia típica:** pérdida de la protección de la LLC + Form 5472 mal preparado + facturas cuestionables en una inspección local. ### Error 5."_
  - [`SIN ISSUE DETECTADO`] _"Toda factura que sigas emitiendo con su EIN está en el aire."_
  - [`SIN ISSUE DETECTADO`] _"Decirle a tu asesor "no declares nada que ya tributa en EE.UU." es la receta para una regularización dolorosa cuando entren los datos por CRS o DAC. **Consecuencia típica:** liquidación complementaria de varios ejercicios + recargo + intereses + sanción. ### Error 7."_
  - [`SIN ISSUE DETECTADO`] _"Indicar mal la residencia fiscal en Wise, Mercury o brokers Cuando abres una cuenta en Wise, Mercury, Relay o Interactive Brokers, te preguntan tu **residencia fiscal**."_
  - [`SIN ISSUE DETECTADO`] _"Si la indicas mal (intencionadamente o por desconocimiento), el reporte CRS de esa cuenta se envía al país equivocado o no se envía en absoluto."_
  - [`SIN ISSUE DETECTADO`] _"Mezclar la LLC con cripto sin entender CRS/DAC8 Si operas cripto a través de exchanges centralizados (Coinbase, Kraken, Binance), debes saber que desde 2026 entra en vigor **DAC8**, que extiende el modelo CRS a cripto-activos."_
  - [`SIN ISSUE DETECTADO`] _"Confiar en información de foros y redes en vez de en datos verificados "Me dijeron en YouTube que con LLC no se reporta nada", "leí en Reddit que el 5472 es opcional", "en un grupo de Telegram me explicaron que CRS no aplica a EE.UU."."_
  - [`SIN ISSUE DETECTADO`] _"Si tu proveedor de LLC desapareció el día que recibiste el EIN, la solución no es buscar otro que también desaparezca: es trabajar con alguien que entienda la operativa completa."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax cubrimos el ciclo entero: estructura, banca, procesadores de pago, inversión, cripto si aplica, compliance anual con IRS y FinCEN, y coordinación con tu asesor local."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `errores-fiscales-freelancers-espanoles`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 14647 caracteres · H2=14 · H3=0 · intro=42 palabras · cortas (<80w)=5 ("Error 3: No aplicar la tarifa plana de autónomos correctamente" (68w); "Error 4: Presentar el IVA incorrectamente en operaciones internacionales" (64w); "Error 5: No hacer pagos fraccionados o hacerlos mal" (53w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=2 · slash=1 · wallester=1 · wise=1 · stripe=2 · ibkr=1 · kraken=1 · boi=2 · fincen=2 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury (Column NA, $0 wires), Slash (tesorería corporativa), Wallester (tarjetas corporativas), Stripe, Adyen y DoDo Payments"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"nciera americana: Mercury (Column NA, $0 wires), Slash (tesorería corporativa), Wallester (tarjetas corporativas), Stripe, Adyen y DoDo Payments"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Comisiones bancarias**: de Mercury, Stripe, PayPal, Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"para no residentes, con acceso a la infraestructura financiera americana: Mercury (Column NA, $0 wires), Slash (tesorería corporativa), Wallester (tarjetas corporativas), Stripe, Adyen y DoDo Payments"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `escalar-negocio-digital-llc-americana`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 11443 caracteres · H2=12 · H3=2 · intro=40 palabras · cortas (<80w)=3 ("Crecimiento sin burocracia" (67w); "Lecturas relacionadas" (30w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos" · enlaces totales=2 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=6 · slash=2 · relay=3 · wallester=2 · wise=3 · revolut=2 · stripe=4 · ibkr=3 · kraken=2 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury o Relay** como tu hub financiero (Column NA / Thread Bank, $0 wires)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester** para tarjetas corporativas virtuales y físicas con control granular de gastos"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business / Revolut Business** para conversión de divisas y operaciones multi-divisa"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business / Revolut Business** para conversión de divisas y operaciones multi-divisa"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (4):**
  - [`SIN ISSUE DETECTADO`] _"Con tu LLC, puedes participar en licitaciones, responder a ofertas de trabajo para empresas y cerrar contratos que antes no estaban a tu alcance. ### Plataformas sin restricciones Stripe, PayPal, Amazon, Shopify, Gumroad, Teachable, Webflow..."_
  - [`SIN ISSUE DETECTADO`] _"Banca (Mercury/Relay), tesorería (Slash), tarjetas (Wallester), pagos (Stripe/Adyen/DoDo), conversión de divisas (Wise/Revolut), inversión corporativa (Interactive Brokers/Kraken), todo integrado."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `estructura-fiscal-optima-freelancer-internacional`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 11480 caracteres · H2=10 · H3=4 · intro=64 palabras · cortas (<80w)=4 ("El problema del freelancer internacional" (78w); "¿Cuándo tiene sentido una LLC?" (48w); "Lecturas relacionadas" (8w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y creamos un plan a medida" · enlaces totales=7 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=3 · slash=2 · relay=2 · wallester=2 · wise=2 · revolut=1 · stripe=6 · ibkr=1 · kraken=1 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** | Cuenta bancaria principal | Column NA, FDIC, $0 wires |"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"| **Wallester** | Tarjetas corporativas | Virtuales y físicas, control granular por gasto |"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"| **Wise Business** | Conversión de divisas | EMI, tipo de cambio mid-market real |"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"| **Wise Business** | Conversión de divisas | EMI, tipo de cambio mid-market real |"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"href="/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">banca en dólares</a> (Mercury, Relay)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"Mercury, Slash, Wallester, Stripe, Wise, todo listo para facturar."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `estructura-offshore-beneficios-riesgos`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13024 caracteres · H2=12 · H3=0 · intro=121 palabras · cortas (<80w)=1 ("Próximos pasos" (63w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=2 · slash=1 · wallester=1 · wise=2 · stripe=2 · boi=1 · fincen=1 · crs=4 · fatca=1 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- Banca operativa remota (Mercury, Wise, Wallester, Slash)"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"a y procesadores internacionales**: una LLC americana abre Mercury, Stripe USA, Wise Business y otras herramientas que no son accesibles desde muchos países de origen"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"a y procesadores internacionales**: una LLC americana abre Mercury, Stripe USA, Wise Business y otras herramientas que no son accesibles desde muchos países de origen"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **Acceso a banca y procesadores internacionales**: una LLC americana abre Mercury, Stripe USA, Wise Business y otras herramientas que no son accesibles desde muchos países de origen"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"Si abres una cuenta en BVI, Caimán o Singapur, tu Hacienda local lo sabrá. - **"No declarar la sociedad"**: la mayoría de países exigen declarar la titularidad de sociedades extranjeras (en España, Modelo 720; equivalentes en LatAm)."_
  - [`SIN ISSUE DETECTADO`] _"Tras BEPS, FATCA y CRS, la opacidad real ha desaparecido prácticamente para residentes en países OCDE. **¿Es legal abrir una sociedad offshore?** Sí, siempre que se declare en tu país de residencia."_


### `evitar-bloqueos-mercury-wise-revolut`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 6302 caracteres · H2=7 · H3=4 · intro=63 palabras · cortas (<80w)=3 ("¿Qué hacer si te bloquean?" (64w); "La regla de oro: transparencia" (62w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=7 · slash=2 · relay=2 · wallester=2 · wise=9 · revolut=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** usa Column NA como banco custodio"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester** para tarjetas corporativas con control granular, cada suscripción y gasto operativo con su propia tarjeta virtual"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Un día entras a Mercury o Wise y ves: "Tu cuenta ha sido restringida"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"### En Wise Business"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (4):**
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Un día entras a Mercury o Wise y ves: "Tu cuenta ha sido restringida." Sin previo aviso, sin explicación clara, y con tu dinero atrapado."_
  - [`SIN ISSUE DETECTADO`] _"Y con herramientas como Slash y Wallester complementando tu banca principal, tu operativa es más profesional y resiliente."_
  - [`SIN ISSUE DETECTADO`] _"Es una plataforma fintech seria, no un chiringuito. - **Wise Business** es una EMI (Institución de Dinero Electrónico), no un banco."_
  - [`SIN ISSUE DETECTADO`] _"Úsala para conversiones y transferencias, no como tesorería principal. - **Relay** usa Thread Bank como banco subyacente."_


### `extension-irs-form-1120-como-solicitarla`

- **Verdict global:** `MATIZAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 8572 caracteres · H2=11 · H3=5 · intro=76 palabras · cortas (<80w)=5 ("¿Cómo se presenta el Form 7004?" (56w); "¿Qué pasa si no pido extensión y no presento a tiempo?" (65w); "¿Puedo pedir extensión todos los años?" (35w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y te explicamos exactamente qué necesitas y cuándo" · enlaces totales=5 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=6 · 5472=5 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"0% de las declaraciones de impuestos corporativas se presentan con extensión"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
- **Inventario sentence-level (5):**
  - [`SIN ISSUE DETECTADO`] _"Si tienes una LLC en Estados Unidos, cada año debes presentar el Form 1120 (junto con el Form 5472 ) antes del 15 de abril."_
  - [`SIN ISSUE DETECTADO`] _"Cuando lo presentas correctamente, el IRS te concede 6 meses adicionales para enviar tu Form 1120, sin preguntas, sin justificaciones, sin dramas."_
  - [`SIN ISSUE DETECTADO`] _"Si no presentas el Form 1120 antes del 15 de abril y tampoco has pedido extensión, el IRS puede aplicar sanciones."_
  - [`SIN ISSUE DETECTADO`] _"Y tratándose de LLCs con propietarios extranjeros, las sanciones por no presentar el Form 5472 a tiempo son especialmente relevantes."_
  - [`SIN ISSUE DETECTADO`] _"Después, con calma y sin prisas, preparamos tu Form 1120 y Form 5472 con toda la documentación en orden."_


### `fiscalidad-estonia-como-funciona`

- **Verdict global:** `CORREGIR (CRÍTICO)`  ·  **Prioridad:** `P0`
- **Métricas estructurales:** 13130 caracteres · H2=14 · H3=0 · intro=100 palabras · cortas (<80w)=4 ("La OÜ: la sociedad limitada estonia" (74w); "Cuándo Estonia tiene sentido" (46w); "Cuándo no compensa" (48w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** wise=2 · revolut=2 · stripe=1 · payoneer=1 · modelo720=2
- **Issues factuales detectadas:**
  - **[CORREGIR (CRÍTICO)] `revolut-iban-llc`** — Evidencia: _"Revolut Business**: posible, EMI con IBAN lituano"_  
    Fix (cita SOT): Revolut Business para LLC US se abre vía Lead Bank (cuenta US, no IBAN UE) (SOT §Revolut Business).  
    Fuente primaria: Revolut Business US terms https://www.revolut.com/legal/business-terms-us
  - **[COMPLETAR] `payoneer-no-crs`** — Evidencia: _"- **Payoneer Business**: válido para algunos casos"_  
    Fix (cita SOT): Toda mención de Payoneer debe incluir disclosure CRS (SOT §Payoneer).  
    Fuente primaria: Payoneer legal https://www.payoneer.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business**: aceptado, EMI, IBAN belga o británico"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business**: aceptado, EMI, IBAN belga o británico"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (4):**
  - [`CORREGIR (CRÍTICO)` · `revolut-iban-llc`] _"Para una OÜ de e-residente sin esa conexión, las opciones suelen ser: - **Wise Business**: aceptado, EMI, IBAN belga o británico. - **Payoneer Business**: válido para algunos casos. - **Revolut Business**: posible, EMI con IBAN lituano. - **LHV** (caso a caso): solicitudes con presencia y plan claro."_
  - [`SIN ISSUE DETECTADO`] _"Wise Business y Revolut Business funcionan bien con OÜ."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `fiscalidad-internacional-emprendedores-digitales`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12071 caracteres · H2=11 · H3=11 · intro=43 palabras · cortas (<80w)=4 ("Lo que NO debes hacer" (42w); "El futuro de la fiscalidad digital" (70w); "Lecturas relacionadas" (39w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y diseñamos la estructura fiscal óptima para tu situación" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=1 · slash=1 · wallester=1 · wise=1 · revolut=1 · stripe=1 · ibkr=1 · kraken=1 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"mercury-llc-extranjero">Mercury</a>**: tu hub financiero (Column NA, FDIC, $0 wires)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester**: tarjetas corporativas (control granular, virtuales y físicas)"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business**: tu herramienta de conversión (EMI, tipo de cambio real)"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business**: tu herramienta de conversión (EMI, tipo de cambio real)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"no paga impuestos federales si tus ingresos son de fuente extranjera (trabajas desde fuera de EE"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **<a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>**: tu hub financiero (Column NA, FDIC, $0 wires)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `fiscalidad-llc-por-pais-residencia`

- **Verdict global:** `MATIZAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12766 caracteres · H2=11 · H3=0 · intro=100 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (15w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=2 · boi=2 · fincen=2 · crs=2 · modelo720=4
- **Issues factuales detectadas:**
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"0% de impuestos""_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
- **Inventario sentence-level (4):**
  - [`SIN ISSUE DETECTADO`] _"Es fundamental estructurar la LLC correctamente para cumplir con esta normativa. ## Colombia: impuesto de renta y CRS Colombia grava la renta mundial de sus residentes fiscales."_
  - [`SIN ISSUE DETECTADO`] _"El compliance americano te protege.** Presentar el Form 5472 , mantener el BOI Report al día y operar con trazabilidad no solo cumple con el IRS, también demuestra ante tu hacienda local que tu estructura es legítima y transparente. **4."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `fiscalidad-socios-llc-cambio-residencia-mid-year`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 11045 caracteres · H2=12 · H3=6 · intro=83 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (19w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=2 · wise=2 · boi=1 · fincen=1 · crs=1 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- La **banca** (Mercury, Wise) se actualiza con la nueva dirección personal cuando se completa el cambio de residencia"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `form-5472-que-es-como-presentarlo`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 13361 caracteres · H2=13 · H3=3 · intro=51 palabras · cortas (<80w)=4 ("¿Quién debe presentarlo?" (79w); "¿Qué transacciones se reportan?" (75w); "Lecturas relacionadas" (18w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos y lo revisamos juntos" · enlaces totales=5 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=15 · 5472=21 · boi=2 · fincen=2 · crs=1 · modelo720=3
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (20):**
  - [`SIN ISSUE DETECTADO`] _"Si tienes una LLC en Estados Unidos como no residente, el Form 5472 es una declaración informativa que el IRS solicita cada año."_
  - [`SIN ISSUE DETECTADO`] _"Literalmente no tienes que hacer nada. ## ¿Qué es el Form 5472?"_
  - [`SIN ISSUE DETECTADO`] _"Si mantienes una buena separación financiera (cuenta de la LLC separada de la personal), documentar esto es pan comido. ## Form 5472 y Form 1120: la pareja inseparable El Form 5472 no se presenta solo, va acompañado del **Form 1120**, que es la declaración de impuestos corporativa de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"Pero ojo: para una Single-Member LLC con dueño extranjero, el Form 1120 es **pro-forma**."_
  - [`SIN ISSUE DETECTADO`] _"No declara impuestos reales porque la LLC es una Disregarded Entity y paga $0 de impuesto federal. ### ¿Qué es el Form 1120 pro-forma?"_
  - [`SIN ISSUE DETECTADO`] _"En el caso de una LLC de un solo miembro con propietario no residente, se presenta como un "envoltorio" del Form 5472."_
  - [`SIN ISSUE DETECTADO`] _"Básicamente: - **El Form 1120 es la portada**: incluye los datos generales de la LLC - **El Form 5472 es el contenido**: detalla las transacciones entre tú y tu LLC El Form 1120 pro-forma se presenta con todos los campos financieros en cero (ingresos: $0, impuestos: $0) porque la LLC no tributa en EE.UU."_
  - [`SIN ISSUE DETECTADO`] _"Lo que importa es el Form 5472 adjunto. ### ¿Entonces por qué se necesita el Form 1120?"_
  - [`SIN ISSUE DETECTADO`] _"Porque el IRS no acepta el Form 5472 como documento independiente."_
  - [`SIN ISSUE DETECTADO`] _"Necesita ir dentro de una declaración corporativa (Form 1120)."_
  - [`SIN ISSUE DETECTADO`] _"El Form 5472 se presenta junto con el Form 1120, con fecha límite el **15 de abril** de cada año para el año fiscal anterior."_
  - [`SIN ISSUE DETECTADO`] _"Te lo explicamos en detalle en nuestra guía sobre la extensión del Form 1120 ."_
  - [`SIN ISSUE DETECTADO`] _"Así de simple. ## Sanciones por no presentar el Form 5472 El IRS se toma este formulario muy en serio."_
  - [`SIN ISSUE DETECTADO`] _"Si presentas tu Form 5472 en plazo (o dentro de la extensión) y con información correcta, no hay sanción alguna."_
  - [`SIN ISSUE DETECTADO`] _"Nunca hemos tenido un cliente sancionado por el IRS por un Form 5472. ## ¿Y si no lo he presentado en años anteriores?"_
  - [`SIN ISSUE DETECTADO`] _"Si tienes una LLC y no has presentado el Form 5472 de años anteriores, mantén la calma."_
  - [`SIN ISSUE DETECTADO`] _"Lo importante es actuar, cuanto antes te pongas al día, mejor. ## Lo que deberías llevarte de este artículo El Form 5472 (junto con el Form 1120 pro-forma) es un trámite informativo anual que toda LLC con dueño extranjero debe presentar."_
  - [`SIN ISSUE DETECTADO`] _"Ten en cuenta que el Form 5472 no es la única obligación: también debes presentar el BOI Report ante FinCEN ."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `gastos-deducibles-llc-que-puedes-deducir`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12465 caracteres · H2=10 · H3=11 · intro=47 palabras · cortas (<80w)=4 ("La regla de oro: ordinario y necesario" (69w); "En Exentax te ayudamos con esto" (49w); "Lecturas relacionadas" (8w)) · largas (>400w)=1 ("Gastos deducibles comunes en una LLC" (709w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y lo calculamos juntos" · enlaces totales=3 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=6 · slash=3 · relay=5 · wallester=2 · wise=4 · revolut=2 · stripe=1 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Comisiones de Wise:** por conversión de divisas"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"0%, eso son **$3,000 menos de impuestos** solo por documentar correctamente tus gastos"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
- **Inventario sentence-level (8):**
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `holding-empresarial-como-funciona`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 13930 caracteres · H2=15 · H3=0 · intro=89 palabras · cortas (<80w)=5 ("Qué es un holding" (66w); "Tipos de holding" (69w); "Cuándo no compensa" (77w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** crs=1 · modelo720=2
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"CRS y los registros de beneficiarios finales hacen imposible mantenerlo oculto. - **Holding por moda**: la peor razón para constituirlo."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `hong-kong-offshore-realidad`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 14751 caracteres · H2=13 · H3=0 · intro=86 palabras · cortas (<80w)=1 ("Próximos pasos" (63w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=2 · slash=1 · relay=1 · wallester=1 · wise=1 · boi=1 · fincen=1 · crs=5 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Banca**: Mercury, Wise, Wallester, Slash, Relay, abren remoto y operan en USD desde el día uno"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Banca**: Mercury, Wise, Wallester, Slash, Relay, abren remoto y operan en USD desde el día uno"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (6):**
  - [`SIN ISSUE DETECTADO`] _"Comparado con la facilidad de abrir una cuenta de Mercury para una LLC desde cualquier país, la diferencia es abismal. ## Reputación internacional y CRS Hong Kong sigue formando parte del intercambio automático de información (CRS)."_
  - [`SIN ISSUE DETECTADO`] _"Si eres residente fiscal en España, Latinoamérica o cualquier país que aplique CRS, los saldos y rentas de tu empresa de Hong Kong se reportan a tu Hacienda local."_
  - [`SIN ISSUE DETECTADO`] _"Basta con un Form 5472 anual."_
  - [`SIN ISSUE DETECTADO`] _"La adhesión al BEPS, la presión de la UE y la firma de acuerdos CRS han reducido la opacidad real."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `iban-swift-routing-number-que-son`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7692 caracteres · H2=9 · H3=9 · intro=62 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=10 · slash=3 · relay=4 · wallester=2 · wise=11 · revolut=2 · stripe=2
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Aquí es donde **Wise Business** brilla"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Aquí es donde **Wise Business** brilla"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"En Mercury: Dashboard → Account Details → "Routing Number" **Nota importante:** Mercury tiene **dos routing numbers**: uno para ACH y otro para Wire."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Aquí es donde **Wise Business** brilla."_
  - [`SIN ISSUE DETECTADO`] _"Wise te da un IBAN europeo (con prefijo BE o DE) vinculado a tu cuenta."_
  - [`SIN ISSUE DETECTADO`] _"Dales tu **IBAN europeo de Wise Business**."_
  - [`SIN ISSUE DETECTADO`] _"Un SEPA desde la cuenta Wise de tu LLC cuesta 0-1€ y llega en 1 día."_
  - [`SIN ISSUE DETECTADO`] _"Tus fondos están custodiados en Column NA con seguro FDIC."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `impuestos-clientes-internacionales-espana`

- **Verdict global:** `MATIZAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12712 caracteres · H2=10 · H3=9 · intro=87 palabras · cortas (<80w)=2 ("¿Qué debería hacer?" (71w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y empezamos" · enlaces totales=3 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · stripe=1 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"0% de impuestos legalmente? La verdad sobre la optimización fiscal</a> complementa lo que hemos visto aquí con detalles que merecían su"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `irs-1120-5472-que-son-cuando-aplican`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P1`
- **Métricas estructurales:** 12451 caracteres · H2=13 · H3=0 · intro=99 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (8w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=23 · 5472=21 · wise=1 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `1120-confused-wrong`** — Evidencia: _"LLC** → tampoco usa el 1120 por defecto; presenta Form 1065 (partnership), salvo elección de tributación como corporación"_  
    Fix (cita SOT): Single-member LLC disregarded NO paga corp tax via 1120. Pro-forma 1120 es carrier del 5472. Substantive 1120 solo si election C-corp via Form 8832 (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Form 1120 https://www.irs.gov/forms-pubs/about-form-1120 · Form 8832 https://www.irs.gov/forms-pubs/about-form-8832
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Si esos pagos pasan por Wise, vale la pena revisar <a href="/es/blog/wise-iban-llc-que-reporta-hacienda">qué IBAN concreto se reporta a Hacienda y desde qué jurisdicción</a>"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (19):**
  - [`SIN ISSUE DETECTADO`] _"Hay dos formularios del IRS que generan más confusión que ningún otro entre dueños de LLC: el **Form 1120** y el **Form 5472**."_
  - [`SIN ISSUE DETECTADO`] _"Si quieres el procedimiento de presentación, ya tienes la guía operativa del Form 5472 ."_
  - [`SIN ISSUE DETECTADO`] _"Aquí explicamos qué son los dos formularios **en realidad**, cómo se relacionan, cuándo aplican según tu perfil y qué errores cuestan dinero. ## Qué es realmente el Form 1120 El **Form 1120, U.S."_
  - [`SIN ISSUE DETECTADO`] _"Aquí viene el primer matiz que casi nadie te explica: el Form 1120 también se usa **vacío, como envoltorio**, para que ciertas LLCs cumplan obligaciones de información."_
  - [`SIN ISSUE DETECTADO`] _"Es lo que se llama **pro-forma 1120** y lo veremos más abajo."_
  - [`SIN ISSUE DETECTADO`] _"Porque desde 2017 las **disregarded entities propiedad de extranjeros** están tratadas como corporaciones a efectos del 5472."_
  - [`SIN ISSUE DETECTADO`] _"Si no lo presentas, la sanción base es de **25 000 USD por formulario y año**. ## La trampa del "1120 pro-forma" Aquí es donde la gente se pierde."_
  - [`SIN ISSUE DETECTADO`] _"Pero **sí tiene que presentar un Form 1120 al año, en blanco**, para que ese 1120 funcione como sobre del Form 5472."_
  - [`SIN ISSUE DETECTADO`] _"Esto se llama **Form 1120 pro-forma**."_
  - [`SIN ISSUE DETECTADO`] _"DE"), se escribe a mano "Form 1120, Foreign-owned U.S."_
  - [`SIN ISSUE DETECTADO`] _"DE" en la parte superior y se anexa el Form 5472."_
  - [`SIN ISSUE DETECTADO`] _"El resto del 1120 va vacío (sin Schedule M, sin balance, sin liquidación de impuesto)."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Si esos pagos pasan por Wise, vale la pena revisar qué IBAN concreto se reporta a Hacienda y desde qué jurisdicción . - Préstamos entre tú y la LLC → se reportan. - Pagos por servicios prestados por ti (si los facturas como persona física desde otro país a la LLC) → se reportan."_
  - [`SIN ISSUE DETECTADO`] _"Confirmar siempre la dirección/fax vigente del año en cuestión. - **EIN obligatorio:** sin EIN no se puede presentar."_
  - [`SIN ISSUE DETECTADO`] _"La sanción de 25 000 USD por 5472 no presentado **se aplica también por información incompleta o inexacta**, no solo por no presentar nada en absoluto. ## Errores típicos al preparar 1120 + 5472 1. **Rellenar el 1120 pro-forma como si fuera un 1120 real.** Pones cifras, balances, gastos."_
  - [`SIN ISSUE DETECTADO`] _"El IRS lo procesa como una declaración de C-Corp y se monta un lío. 2. **Olvidar que el 5472 va anexado al 1120**, no se manda solo."_
  - [`SIN ISSUE DETECTADO`] _"Las multas se imponen y se descubren cuando se actúa contra el EIN o se rechaza una próxima presentación. 6. **Presentar el 5472 sin el TIN/EIN del dueño extranjero.** Aunque seas no residente, el formulario pide identificación."_
  - [`SIN ISSUE DETECTADO`] _"Aquí no hay "foreign-owned DE". - Tu LLC ha elegido tributar como **C-Corp** y ya presenta 1120 real, sin transacciones con partes relacionadas extranjeras (raro si tu negocio internacional pasa por la LLC)."_
  - [`SIN ISSUE DETECTADO`] _"La diferencia entre las dos cosas es seguir el calendario anual de obligaciones y mantener separación efectiva entre tu patrimonio y el de la LLC. ## Lo que deberías llevarte - **Form 1120** = declaración de impuesto sobre sociedades."_


### `itin-ssn-que-son-como-obtenerlos`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 10619 caracteres · H2=11 · H3=6 · intro=55 palabras · cortas (<80w)=4 ("ITIN vs SSN: diferencias clave" (78w); "¿Para qué necesitas el ITIN si tienes una LLC?" (75w); "¿Cuánto cuesta obtener el ITIN?" (58w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita con Exentax y te explicamos exactamente cómo funciona el proceso para tu caso concreto" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=2 · 5472=2 · mercury=1 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Cuanto antes lo tengas, antes podrás abrir tu <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">cuenta en Mercury</a> y cumplir con todas tus <a href="/es/blog/mantenimiento-anual-llc-obligaciones">obligaciones fiscales</a> sin comp"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (13):**
  - [`SIN ISSUE DETECTADO`] _"Cuando empiezas a moverte en el mundo de las LLC americanas, enseguida aparecen dos siglas que generan confusión: ITIN y SSN."_
  - [`SIN ISSUE DETECTADO`] _"Si alguien te dice lo contrario, desconfía. ## ¿Qué es el ITIN (Individual Taxpayer Identification Number)?"_
  - [`SIN ISSUE DETECTADO`] _"El ITIN es un número de identificación fiscal emitido por el IRS específicamente para personas que necesitan cumplir con obligaciones fiscales en EE.UU. pero no pueden obtener un SSN."_
  - [`SIN ISSUE DETECTADO`] _"El proceso tiene varios pasos, pero es completamente manejable, sobre todo si tienes a alguien que lo gestione por ti (spoiler: en Exentax nos encargamos de todo). ### Paso 1: Preparar el Form W-7 El Form W-7 es la solicitud oficial del ITIN ante el IRS."_
  - [`SIN ISSUE DETECTADO`] _"Incluye tus datos personales, tu dirección, tu país de ciudadanía y la razón por la que necesitas el ITIN. ### Paso 2: Reunir la documentación de soporte Necesitas documentos que prueben tu identidad y tu estatus de extranjero."_
  - [`SIN ISSUE DETECTADO`] _"Si tienes pasaporte, básicamente es lo único que necesitas como documento de soporte. ### Paso 3: Incluir una declaración de impuestos El IRS requiere que el Form W-7 se presente junto con una declaración de impuestos federal (como el Form 1040-NR o adjunto al Form 1120 de tu LLC)."_
  - [`SIN ISSUE DETECTADO`] _"Esto demuestra que necesitas el ITIN para un propósito fiscal real. ### Paso 4: Enviar la solicitud Hay tres formas de enviar tu solicitud de ITIN: **Opción A: Por correo al IRS** Envías el Form W-7 + declaración de impuestos + documentos originales (o copias certificadas) al IRS ITIN Operation Center en Austin, Texas."_
  - [`SIN ISSUE DETECTADO`] _"Te presentas con los documentos, te verifican la identidad en el acto y procesan la solicitud. ### Paso 5: Esperar la asignación El tiempo de procesamiento del ITIN es de **7 a 11 semanas** desde que el IRS recibe tu solicitud completa."_
  - [`SIN ISSUE DETECTADO`] _"Una vez aprobado, recibes una carta del IRS con tu ITIN asignado."_
  - [`SIN ISSUE DETECTADO`] _"El IRS no cobra nada por emitir el ITIN."_
  - [`SIN ISSUE DETECTADO`] _"Para seguir profundizando, 7 problemas reales de tener una LLC en EE.UU. y cómo evitar cada uno complementa lo que hemos visto aquí con detalles que merecían su propio artículo. ## ¿Necesitas tu ITIN ya?"_
  - [`SIN ISSUE DETECTADO`] _"Si acabas de constituir tu LLC o estás a punto de hacerlo, el momento de solicitar tu ITIN es ahora."_
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Cuanto antes lo tengas, antes podrás abrir tu cuenta en Mercury y cumplir con todas tus obligaciones fiscales sin complicaciones."_


### `iva-servicios-digitales-internacional`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 7016 caracteres · H2=7 · H3=10 · intro=46 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** stripe=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (1):**
  - [`SIN ISSUE DETECTADO`] _"Elimina completamente la complejidad del IVA/GST internacional para ventas B2C, algo que ni Stripe ni PayPal hacen por defecto. ## La LLC como solución definitiva al laberinto del IVA Aquí es donde se pone interesante."_


### `justificar-origen-fondos-kyc-bancario-segunda-ronda`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9957 caracteres · H2=10 · H3=6 · intro=95 palabras · cortas (<80w)=4 ("El principio rector: narrativa coherente" (79w); "Cuándo sí conviene apoyo profesional" (69w); "Lecturas relacionadas" (25w)) · largas (>400w)=1 ("Procedimiento ordenado para responder" (425w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=6 · slash=3 · relay=4 · wallester=2 · wise=5 · revolut=3 · stripe=1 · boi=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Si llevas tiempo con tu LLC y de pronto Mercury, Wise o tu pasarela de pago te piden documentación adicional sobre el origen de los fondos, no estás solo"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (10):**
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Si llevas tiempo con tu LLC y de pronto Mercury, Wise o tu pasarela de pago te piden documentación adicional sobre el origen de los fondos, no estás solo."_
  - [`SIN ISSUE DETECTADO`] _"Buscan **coherencia entre lo que dijiste al abrir, lo que figura en tu BOI, lo que muestran tus extractos y lo que cuentas ahora**."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `llc-agencias-marketing-digital`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 8188 caracteres · H2=8 · H3=6 · intro=38 palabras · cortas (<80w)=2 ("¿Cuándo tiene sentido para una agencia?" (69w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=6 · slash=3 · relay=3 · wallester=3 · wise=2 · stripe=3 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"### Wallester: tarjetas para equipo y gastos de ads"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"### Wise Business para pagos a equipo internacional"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"### Wise Business para pagos a equipo internacional"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"** Cuentas en Mercury o Relay con acceso directo a ACH y wire transfers"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Para una agencia que cobra retainers mensuales pero paga a equipo quincenalmente, la diferencia temporal es capital que puede optimizarse. ### Wallester: tarjetas para equipo y gastos de ads **Wallester** te da tarjetas corporativas virtuales con límites individuales."_
  - [`SIN ISSUE DETECTADO`] _"Guía completa para dueños de LLC , porque afinan exactamente los bordes de lo explicado en esta guía. ## Lo que hacemos por ti Constitución completa de la LLC, EIN, cuenta bancaria (Mercury/Relay), tesorería (Slash), tarjetas corporativas (Wallester), configuración de Stripe/Adyen y facturación, compliance anual."_


### `llc-alternativa-autonomo-espana`

- **Verdict global:** `CORREGIR (CRÍTICO)`  ·  **Prioridad:** `P0`
- **Métricas estructurales:** 18092 caracteres · H2=12 · H3=2 · intro=197 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita con Exentax y deja de pagar como un autónomo del año 2000 cuando trabajas como un negocio digital del 2026" · enlaces totales=3 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=2 · 5472=3 · mercury=5 · slash=3 · relay=4 · wallester=3 · wise=4 · revolut=1 · stripe=4 · ibkr=1 · boi=3 · fincen=4 · crs=8 · fatca=1 · modelo720=6
- **Issues factuales detectadas:**
  - **[CORREGIR (CRÍTICO)] `revolut-iban-llc`** — Evidencia: _"Revolut, N26, Wallester con IBAN europeo, etc"_  
    Fix (cita SOT): Revolut Business para LLC US se abre vía Lead Bank (cuenta US, no IBAN UE) (SOT §Revolut Business).  
    Fuente primaria: Revolut Business US terms https://www.revolut.com/legal/business-terms-us
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business**, **Relay** y **Slash** en primer plano: multi-divisa, sub-cuentas, tarjetas, tesorería; **Wise sí está en CRS** porque opera con IBAN belga"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"(Mercury, Relay, Chase, BoA…) **no están dentro del CRS** (Common Reporting Standard)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (10):**
  - [`SIN ISSUE DETECTADO`] _"La cuota mensual de autónomos, el IRPF progresivo, los modelos trimestrales, los pagos a cuenta, el IVA con clientes europeos, la inversión del sujeto pasivo, el modelo 349, el modelo 720 si tienes algo fuera..."_
  - [`SIN ISSUE DETECTADO`] _"Solo cumple obligaciones informativas: el **Form 5472 + Form 1120 pro forma** ante el IRS y el **BOI Report** ante FinCEN."_
  - [`SIN ISSUE DETECTADO`] _"La LLC paga el coste anual de mantenimiento (agente registrado, declaraciones IRS y FinCEN) y poco más."_
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Las cuentas bancarias en EE.UU. (Mercury, Relay, Chase, BoA…) **no están dentro del CRS** (Common Reporting Standard)."_
  - [`SIN ISSUE DETECTADO`] _"EE.UU. firmó FATCA, no CRS."_
  - [`CORREGIR (CRÍTICO)` · `revolut-iban-llc`] _"Esto significa que esas cuentas **no se reportan automáticamente a Hacienda española** como sí lo hacen las cuentas en bancos europeos o en fintech europeas que aplican CRS (Wise, Revolut, N26, Wallester con IBAN europeo, etc.)."_
  - [`SIN ISSUE DETECTADO`] _"Si superas los umbrales del **modelo 720/721** (50.000 € en cuentas en el extranjero, criptos, etc.), debes declararlas igual."_
  - [`SIN ISSUE DETECTADO`] _"Te decimos con honestidad si la LLC te conviene o no. 2. **Diseño de estructura:** estado óptimo (NM/WY/DE), banca, pasarelas de pago, herramientas de tesorería y compliance. 3. **Constitución de la LLC y EIN.** 4. **Apertura de cuentas:** Mercury como cuenta principal, Wise/Relay/Slash como complementos."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `llc-creadores-contenido-youtube-twitch`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 8546 caracteres · H2=8 · H3=6 · intro=66 palabras · cortas (<80w)=2 ("¿A partir de cuánto tiene sentido?" (66w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=5 · slash=2 · relay=2 · wallester=2 · stripe=5 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester** para tarjetas corporativas virtuales: una para cada suscripción (Adobe, equipo, hosting), con límites individuales y control total"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **Operas con herramientas profesionales** como Mercury, Stripe o PayPal Business desde el primer día"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level:** sin sentences tracked.


### `llc-desarrolladores-software-saas`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 8684 caracteres · H2=7 · H3=8 · intro=49 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu llamada gratuita de 30 minutos y lo vemos juntos" · enlaces totales=2 · /agendar=0 (OK)
- **Resumen de menciones:** mercury=2 · slash=2 · wallester=2 · stripe=6 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"### Slash y Wallester: tesorería y control de gastos"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
- **Inventario sentence-level (4):**
  - [`SIN ISSUE DETECTADO`] _"Stripe US procesa los pagos, App Store y Google Play depositan en tu cuenta Mercury, y tu propiedad intelectual está protegida bajo el marco legal americano. **Desarrollador de apps**: Publicas en App Store y Google Play."_
  - [`SIN ISSUE DETECTADO`] _"Para SaaS con MRR (Monthly Recurring Revenue), incluso con importes menores puede tener sentido por las ventajas operativas (acceso a Stripe, cobro en dólares, credibilidad)."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `llc-estados-unidos-guia-completa-2026`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18444 caracteres · H2=12 · H3=4 · intro=109 palabras · cortas (<80w)=3 ("¿Cuánto cuesta constituir y mantener una LLC?" (60w); "Lecturas relacionadas" (17w); "Próximos pasos" (42w)) · largas (>400w)=2 ("El ecosistema fintech: banca, pagos y herramientas" (610w); "Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=9 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=3 · 5472=6 · mercury=6 · slash=2 · relay=4 · wallester=2 · wise=2 · revolut=1 · stripe=3 · ibkr=3 · kraken=1 · boi=6 · fincen=3 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury (respaldado por Column NA, con seguro FDIC) o Relay (respaldado por Thread Bank), sin restricciones"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester**: Plataforma de tarjetas corporativas virtuales y físicas vinculadas a tu LLC, con IBAN en euros para clientes Exentax"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business**: EMI (Institución de Dinero Electrónico) perfecta para transferencias internacionales al tipo de cambio real (mid-market rate)"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business**: EMI (Institución de Dinero Electrónico) perfecta para transferencias internacionales al tipo de cambio real (mid-market rate)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"** Acceso a cuentas en Mercury (respaldado por Column NA, con seguro FDIC) o Relay (respaldado por Thread Bank), sin restricciones"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (22):**
  - [`SIN ISSUE DETECTADO`] _"Esto no es anonimato absoluto: el BOI Report ante FinCEN identifica a los beneficiarios reales y las autoridades pueden acceder a esa información por canales formales."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Lo que ganas es discreción frente al público, no opacidad frente a las autoridades. - **Banca en dólares.** Acceso a cuentas en Mercury (respaldado por Column NA, con seguro FDIC) o Relay (respaldado por Thread Bank), sin restricciones."_
  - [`SIN ISSUE DETECTADO`] _"Wires internacionales a $0 con Mercury."_
  - [`SIN ISSUE DETECTADO`] _"Sin comisiones de mantenimiento. - **Pasarelas de pago sin restricciones.** Stripe, PayPal, procesadores de pago, todos funcionan sin problema con una LLC americana."_
  - [`SIN ISSUE DETECTADO`] _"Tu dinero está custodiado en Column NA (banco con licencia federal y seguro FDIC hasta $250,000)."_
  - [`SIN ISSUE DETECTADO`] _"Es la plataforma más utilizada por nuestros clientes para la operativa diaria. - **Relay**: Otra fintech excelente con hasta 20 sub-cuentas gratuitas, ideal para organizar tu dinero por categorías (operativa, impuestos, reservas)."_
  - [`SIN ISSUE DETECTADO`] _"Los depósitos se custodian en Thread Bank."_
  - [`SIN ISSUE DETECTADO`] _"Ofrece links de pago procesados por Adyen, perfecto para cobrar a clientes de forma rápida y profesional. - **Slash**: Plataforma de tesorería empresarial que permite gestionar el tesoro de tu LLC de forma inteligente."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Ideal para empresas que quieren optimizar la gestión de su capital disponible, con cuentas que generan rendimiento sobre el saldo mientras mantienes liquidez inmediata. - **Wise Business**: EMI (Institución de Dinero Electrónico) perfecta para transferencias internacionales al tipo de cambio real (mid-market rate)."_
  - [`SIN ISSUE DETECTADO`] _"No es un banco, pero complementa perfectamente a Mercury para conversión de divisas y pagos a proveedores internacionales. - **Revolut Business**: Cuenta multidivisa con cambio de divisas competitivo entre semana, tarjetas para el equipo y herramientas de gestión de gastos."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Útil como cuenta secundaria y para operaciones en múltiples monedas. ### Tarjetas corporativas - **Wallester**: Plataforma de tarjetas corporativas virtuales y físicas vinculadas a tu LLC, con IBAN en euros para clientes Exentax."_
  - [`SIN ISSUE DETECTADO`] _"Requiere ITIN del propietario. - **Adyen**: Procesador de pagos global utilizado por empresas como Uber, Spotify y eBay."_
  - [`SIN ISSUE DETECTADO`] _"Ideal si vendes productos digitales a consumidores finales en múltiples países. ### Inversión y trading - **Interactive Brokers**: El bróker más completo para invertir desde tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Si tu LLC opera en mercados de derivados, Tradovate ofrece una plataforma moderna con comisiones planas y acceso a CME, CBOT, NYMEX y COMEX. - **Kraken**: Exchange de criptomonedas con cuenta corporativa para tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"No solo constituimos tu LLC, configuramos la banca (Mercury como cuenta principal, Relay como respaldo), las pasarelas de pago (Stripe, PayPal), la conversión de divisas (Wise Business) y te asesoramos sobre tarjetas corporativas (Wallester), tesorería (Slash) e inversión (Interactive Brokers) según tu perfil."_
  - [`SIN ISSUE DETECTADO`] _"La constitución incluye Articles of Organization, Operating Agreement, EIN, agente registrado y apertura de cuenta bancaria."_
  - [`SIN ISSUE DETECTADO`] _"El mantenimiento anual incluye todas las declaraciones ante el IRS ( Form 5472 , Form 1120), BOI Report, renovación del agente registrado y compliance fiscal completo."_
  - [`SIN ISSUE DETECTADO`] _"Si la usas como si fuera tu cuenta personal, rompes la separación patrimonial y dificultas el Form 5472. 3. **Mezclar fondos personales y de la LLC.** Esto puede comprometer la protección de responsabilidad limitada."_
  - [`SIN ISSUE DETECTADO`] _"Cuenta de la LLC = solo para el negocio; las distribuciones se documentan como tales. 4. **No presentar Form 5472, Form 1120 o el BOI Report.** Son obligaciones anuales con sanciones serias por incumplimiento ($25.000 por formulario en el caso del 5472)."_
  - [`SIN ISSUE DETECTADO`] _"La clave está en declarar correctamente en tu país de residencia, presentar las obligaciones US (5472, 1120, BOI) y mantener trazabilidad limpia entre tus cuentas y las de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `llc-interactive-brokers-invertir-bolsa-usa`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 12738 caracteres · H2=10 · H3=11 · intro=71 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=1 · mercury=1 · slash=2 · ibkr=3 · kraken=6 · boi=3 · modelo720=2
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (18):**
  - [`SIN ISSUE DETECTADO`] _"Una de las preguntas más frecuentes que cierran los clientes de Exentax: "¿puedo abrir Interactive Brokers a nombre de mi LLC para invertir desde Estados Unidos?"."_
  - [`SIN ISSUE DETECTADO`] _"Tiene EIN, tiene cuenta bancaria operativa, tiene domicilio legal vía registered agent."_
  - [`SIN ISSUE DETECTADO`] _"Para abrir cuenta de broker es exactamente igual que cualquier otra entidad US: presenta sus documentos corporativos, identifica al beneficial owner con W-8BEN-E, y opera con normalidad."_
  - [`SIN ISSUE DETECTADO`] _"Estos son los caminos efectivos: ### Interactive Brokers (acciones, ETFs, opciones, bonos) IB acepta cuentas a nombre de LLC US con beneficial owner no residente."_
  - [`SIN ISSUE DETECTADO`] _"La apertura se hace como cuenta business y los documentos clave son: - Articles of Organization de la LLC. - EIN Letter (CP575 o 147C). - Operating Agreement. - W-8BEN-E firmado por la LLC declarando el beneficial owner real. - Documento de identidad del propietario. - Comprobante de domicilio del propietario."_
  - [`SIN ISSUE DETECTADO`] _"Lo que vemos en Exentax: cuando la LLC está bien constituida y los documentos son consistentes (mismo nombre legal, mismo EIN, mismo beneficial owner declarado en BOI y en W-8BEN-E), la apertura es directa."_
  - [`SIN ISSUE DETECTADO`] _"Acceso: 150+ mercados, comisiones competitivas, herramientas profesionales (TWS, IBKR Pro), margen, opciones, futuros vía la propia plataforma. ### Tradovate (futuros) Tradovate permite abrir cuentas a nombre de LLC para operar futuros (ES, NQ, CL, GC, etc.)."_
  - [`SIN ISSUE DETECTADO`] _"Documentación similar (Articles, EIN, Operating Agreement, W-8BEN-E)."_
  - [`SIN ISSUE DETECTADO`] _"Es la opción de referencia cuando la actividad de la LLC es trading de futuros con horizonte intradía o swing. ### Kraken (cripto institucional) Kraken acepta cuentas corporativas para LLCs y opera con no residentes."_
  - [`SIN ISSUE DETECTADO`] _"El broker aplica el treaty rate si la W-8BEN-E está presentada. - **Intereses portfolio (bonos US)**: 0 % bajo portfolio interest exemption (§871(h)) cumpliendo requisitos. - **Intereses bancarios US**: típicamente exentos para no residentes (§871(i))."_
  - [`SIN ISSUE DETECTADO`] _"Invertir esa caja en T-Bills (vía Slash o IB), money market o ETFs conservadores **dentro de la propia LLC** mantiene el capital productivo sin sacarlo a tu vida personal antes de tiempo."_
  - [`SIN ISSUE DETECTADO`] _"Trading cripto con escala Operar cripto desde una LLC abre acceso a productos institucionales (Kraken Pro, custodia, tarifas), separa el riesgo del patrimonio personal y permite trazabilidad limpia para tu declaración."_
  - [`SIN ISSUE DETECTADO`] _"Lo resolvemos en una pasada: documentos consistentes, W-8BEN-E correcta, apertura limpia. **El cliente que opera futuros desde su cuenta personal**: cuando el volumen sube, la mezcla con su patrimonio personal le complica la fiscalidad de su país y la separación."_
  - [`SIN ISSUE DETECTADO`] _"Mercury para operativa, Slash para tesorería en T-Bills, IB para acciones/ETFs, Kraken para cripto."_
  - [`SIN ISSUE DETECTADO`] _"Documentación consistente, EIN correcto, BOI presentado, operating agreement adaptado, W-8BEN-E preparada."_
  - [`SIN ISSUE DETECTADO`] _"Cuando vas a abrir IB, Tradovate o Kraken, no te vas a encontrar con un "vuelva usted mañana": vas a abrir cuenta y a operar."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais`

- **Verdict global:** `MATIZAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13539 caracteres · H2=13 · H3=2 · intro=105 palabras · cortas (<80w)=3 ("Por qué Exentax" (58w); "Lecturas relacionadas" (16w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=3 · mercury=1 · slash=2 · wallester=2 · wise=1 · ibkr=1 · kraken=1 · boi=3 · fincen=1 · crs=1 · modelo720=5
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"s lo contrario: distribuciones planificadas y documentadas, tarjeta corporativa Wallester para gastos operativos, y separación clara entre lo que es la LLC y lo que es tu vida personal"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"**Stack financiero coordinado**: Mercury o Wise US Inc, Slash para tesorería, Wallester para tarjetas, pasarelas según producto, brokers según objetivo (Interactive Brokers para acciones/ETFs/opcio"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"cero impuestos](/es/blog/dubai-uae-mito-no-impuestos)"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"**Stack financiero coordinado**: Mercury o Wise US Inc, Slash para tesorería, Wallester para tarjetas, pasarelas según producto, brokers según objetivo (Interactive Brokers para acciones/ETFs/opciones, Tradovate para futuros, Kraken para c"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (8):**
  - [`SIN ISSUE DETECTADO`] _"Sin entrar en dogma fiscal, así es como se vive en el día a día: ### Modelo A, Tributación al retirar (planificación de distribuciones) La renta vive en la LLC mientras la LLC la necesita: opera, reinvierte, paga gastos del negocio, mantiene tesorería, invierte el excedente en T-Bills vía Slash."_
  - [`SIN ISSUE DETECTADO`] _"No es complicado, es ordenado: - **España**: Modelo 720 si superas 50.000 € en cuentas/valores en el extranjero (informativo)."_
  - [`SIN ISSUE DETECTADO`] _"Modelo 721 para cripto."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Lo que diseñamos en Exentax es lo contrario: distribuciones planificadas y documentadas, tarjeta corporativa Wallester para gastos operativos, y separación clara entre lo que es la LLC y lo que es tu vida personal."_
  - [`SIN ISSUE DETECTADO`] _"Resultado: pierde deducciones, complica el 5472, rompe la separación patrimonial."_
  - [`SIN ISSUE DETECTADO`] _"Conciliadas con tu declaración local. 5. **Compliance US continuo**: Form 5472, 1120 pro forma, BOI, mantenimiento anual."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `llc-seguridad-juridica-proteccion-patrimonial`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10437 caracteres · H2=12 · H3=5 · intro=44 palabras · cortas (<80w)=3 ("Marco legal: jurisdicción de EE.UU." (77w); "Lecturas relacionadas" (6w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y diseñamos la estructura que blinda tu patrimonio" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=2 · boi=2 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level:** sin sentences tracked.


### `llc-unica-estructura-holding-cuando-como-cuesta`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9672 caracteres · H2=11 · H3=4 · intro=84 palabras · cortas (<80w)=5 ("Estados típicos para cada pieza" (72w); "Alternativas a considerar" (75w); "Cómo lo abordamos en Exentax" (51w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=1 · mercury=1 · relay=1 · wise=1 · boi=1 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"4-8 semanas hasta tener todo en Mercury/Wise/Relay"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `mantenimiento-anual-llc-obligaciones`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10141 caracteres · H2=11 · H3=5 · intro=79 palabras · cortas (<80w)=3 ("BOI Report (si hay cambios)" (47w); "Lecturas relacionadas" (40w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=5 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=5 · 5472=8 · mercury=2 · stripe=1 · boi=5 · fincen=4 · fbar=4 · crs=1 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"Cero riesgo de que expire. ## BOI Report (si hay cambios) Si cambia algún dato de los propietarios reales de la LLC (nombre, dirección, pasaporte, porcentaje de participación), debes actualizar el BOI Report ante FinCEN en un plazo de 30 días."_
  - [`SIN ISSUE DETECTADO`] _"Nota: FinCEN ha suspendido temporalmente la enforcement de sanciones, pero en Exentax seguimos presentando todo en plazo. ## Calendario completo de mantenimiento anual Aquí tienes el calendario que seguimos en Exentax para cada cliente."_


### `modelo-720-721-residentes-espana-cuentas-cripto-extranjero`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 17196 caracteres · H2=13 · H3=5 · intro=75 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=9 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=11 · slash=3 · relay=5 · wallester=3 · wise=14 · revolut=6 · ibkr=1 · kraken=2 · crs=8 · modelo720=11
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"### Cuentas Wise / Revolut / N26 / Wallester (entidades europeas)"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (26):**
  - [`SIN ISSUE DETECTADO`] _"Si eres residente fiscal en España y tienes una LLC americana , una cuenta Wise o Mercury, un broker en el extranjero o cualquier saldo significativo en criptomonedas fuera de un exchange español, dos formularios marcan la frontera entre estar bien y tener un problema serio: el **Modelo 720** y el **Modelo 721**."_
  - [`SIN ISSUE DETECTADO`] _"Casi todos los demás artículos de este blog los citan de pasada; este es el artículo de referencia para entenderlos a fondo. ## Qué es el Modelo 720 El **Modelo 720** es la "Declaración informativa sobre bienes y derechos situados en el extranjero"."_
  - [`SIN ISSUE DETECTADO`] _"La obligación nace cuando se supera el umbral en **al menos un** bloque. ## Qué es el Modelo 721 El **Modelo 721** es el hermano cripto del 720."_
  - [`SIN ISSUE DETECTADO`] _"Una cripto se considera "situada en el extranjero" cuando está custodiada por una entidad o persona no residente en España (Coinbase US, Kraken, Binance fuera de su entidad española, Ledger en self-custody con servicio asociado de un proveedor extranjero, etc.)."_
  - [`SIN ISSUE DETECTADO`] _"Solo telemática (Sede Electrónica AEAT, certificado o Cl@ve). - **Modelo 721**: del 1 de enero al **31 de marzo** del año siguiente al ejercicio."_
  - [`SIN ISSUE DETECTADO`] _"Quien no presenta el 720 sigue cometiendo una infracción tributaria. ## Cómo encajan Wise, Mercury, Revolut y tu LLC Este es el punto donde más errores vemos."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Vamos por partes. ### Cuentas Wise / Revolut / N26 / Wallester (entidades europeas) Son cuentas en entidades financieras situadas en el extranjero (Bélgica, Lituania, Alemania, Estonia)."_
  - [`SIN ISSUE DETECTADO`] _"Lo desarrollamos a fondo en qué reporta Wise a Hacienda y en Revolut Business y CRS ."_
  - [`SIN ISSUE DETECTADO`] _"Estas cuentas además llegan a la AEAT vía CRS, por lo que el cruce es automático. ### Mercury, Relay, banca americana Estados Unidos no está adherido a CRS, pero esto **no exime de declarar el 720**."_
  - [`SIN ISSUE DETECTADO`] _"La obligación informativa española es independiente del intercambio internacional: si tienes una cuenta Mercury con saldo o saldo medio Q4 superior a 50.000 € agregados con el resto de cuentas extranjeras, debes declararla."_
  - [`SIN ISSUE DETECTADO`] _"Que la AEAT no se entere por CRS no equivale a que no exista la obligación."_
  - [`SIN ISSUE DETECTADO`] _"Lo analizamos en si las cuentas bancarias en EE.UU. reportan a Hacienda . ### Brokers extranjeros (Interactive Brokers, Tastytrade, etc.) Las posiciones en valores van al **Bloque II** (umbral 50.000 € a 31/12 a valor de mercado)."_
  - [`SIN ISSUE DETECTADO`] _"Si además generan dividendos o intereses, esos rendimientos llegan a Hacienda por CRS desde la jurisdicción del broker, lo que vuelve crítico declarar correctamente. ### Criptomonedas en exchanges extranjeros Coinbase, Kraken, Binance internacional, KuCoin, Bybit, etc.: son proveedores no residentes en España."_
  - [`SIN ISSUE DETECTADO`] _"Saldo agregado a 31/12 superior a 50.000 € → **Modelo 721**."_
  - [`SIN ISSUE DETECTADO`] _"La inmensa mayoría de cuentas Wise de residentes europeos están bajo Wise Europe SA (Bélgica) y van al 720. 2. **"Mi LLC es la titular de la cuenta, no yo."** Eres el titular real (beneficiario efectivo) y, como residente fiscal en España, la obligación recae sobre ti."_
  - [`SIN ISSUE DETECTADO`] _"El cruce con CRS y, desde 2026, con DAC8, hace que la huella sea cada vez más visible para la AEAT."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax montamos la estructura para que encaje en el primer escenario y documentamos cada paso para que tu declaración local sea defendible ante una eventual revisión. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `nomada-digital-residencia-fiscal`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 15936 caracteres · H2=14 · H3=5 · intro=73 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (23w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y empezamos a trabajar en tu plan" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=2 · slash=2 · relay=1 · wallester=2 · wise=2 · revolut=1 · stripe=2 · ibkr=1 · kraken=1 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** para operar (Column NA, seguro FDIC, $0 en wires) o Relay (Thread Bank, hasta 20 sub-cuentas)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"**Tarjetas corporativas Wallester**: control granular de gastos con tarjetas virtuales y físicas para tu LLC"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"**Wise Business** para conversión de divisas al tipo de cambio mid-market (es una EMI, no un banco) y **Revolut Business** como complemento multi-divisa"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"**Wise Business** para conversión de divisas al tipo de cambio mid-market (es una EMI, no un banco) y **Revolut Business** como complemento multi-divisa"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"**Cuenta bancaria Mercury** para operar (Column NA, seguro FDIC, $0 en wires) o Relay (Thread Bank, hasta 20 sub-cuentas)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `nuevo-mexico-vs-wyoming-vs-delaware`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P3`
- **Métricas estructurales:** 12410 caracteres · H2=10 · H3=0 · intro=99 palabras · cortas (<80w)=2 ("¿Cuál elegir? Nuestra recomendación clara" (60w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos y te ayudamos a elegir el estado perfecto para tu LLC" · enlaces totales=9 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=1 · relay=1 · wise=1 · stripe=1 · boi=2 · fincen=1 · crs=2 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"eso a banca es el mismo**: <a href="/es/blog/iban-swift-routing-number-que-son">Mercury</a>, Relay, Wise aceptan LLCs de cualquier estado"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `operating-agreement-llc-que-es`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 14922 caracteres · H2=13 · H3=0 · intro=84 palabras · cortas (<80w)=3 ("¿Member-Managed o Manager-Managed?" (70w); "¿Cuándo necesito actualizarlo?" (77w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y nos aseguramos de que tu LLC tiene toda la documentación en orden desde el día uno" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=9 · slash=3 · relay=4 · wallester=2 · wise=3 · revolut=2 · stripe=5 · boi=1 · fincen=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"## Stack bancario equilibrado: Mercury, Relay, Slash y Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"Sin este documento, el "velo corporativo" es más fácil de levantar - **Es requerido por bancos y procesadores de pago**: Mercury, Stripe y PayPal lo piden para verificar tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Está adaptado específicamente para no residentes con Single-Member LLCs: incluye la clasificación fiscal correcta (Disregarded Entity), las cláusulas de privacidad necesarias y la estructura que Mercury y Stripe necesitan ver para aprobar tu cuenta."_
  - [`SIN ISSUE DETECTADO`] _"Si tu situación cambia, adaptamos el documento. ## Qué piden las entidades financieras del Operating Agreement Cuando abres tu cuenta en Mercury, o cuando te registras en Stripe, una de las primeras cosas que te piden es el Operating Agreement."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax lo preparamos como parte del proceso de constitución de tu LLC, sale de nuestras manos listo para presentar a Mercury, Stripe y cualquier entidad que lo solicite."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `pagar-cero-impuestos-legalmente-llc`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 14192 caracteres · H2=11 · H3=3 · intro=70 palabras · cortas (<80w)=3 ("Evasión vs. elusión vs. optimización" (68w); "Lecturas relacionadas" (18w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=1 · slash=1 · wallester=1 · wise=1 · revolut=1 · stripe=1 · ibkr=1 · kraken=1 · boi=2 · fincen=2 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury (Column NA, FDIC, $0 wires) para la tesorería principal de tu LLC"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Tarjetas corporativas:** Wallester para gastos operativos con control granular, cada gasto documentado automáticamente"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Multi-divisa:** Wise Business (tipo de cambio mid-market, EMI) y Revolut Business para operar en múltiples monedas"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Multi-divisa:** Wise Business (tipo de cambio mid-market, EMI) y Revolut Business para operar en múltiples monedas"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"cero impuestos sobre tus ingresos como freelancer o emprendedor digital? La respuesta corta es sí, pero con matices importantes que nadie te cuenta en los vídeos de"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **Banca operativa:** Mercury (Column NA, FDIC, $0 wires) para la tesorería principal de tu LLC"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `pasarelas-pago-llc-stripe-paypal-dodo`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7152 caracteres · H2=10 · H3=12 · intro=47 palabras · cortas (<80w)=2 ("Comparativa rápida" (68w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=3 · relay=2 · wise=2 · stripe=6 · ibkr=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"- **Wise Business** para facturas con pago por transferencia"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** para facturas con pago por transferencia"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Todas pueden conectarse a la misma <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">cuenta bancaria de la LLC en Mercury</a> (que tiene $0 en comisiones de wire, por cierto)"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (3):**
  - [`SIN ISSUE DETECTADO`] _"Mientras que muchos países tienen restricciones o comisiones elevadas, con una LLC americana puedes cobrar en prácticamente cualquier divisa con las herramientas más avanzadas. ## Stripe Stripe es la pasarela de pago preferida por startups, SaaS y negocios digitales."_
  - [`SIN ISSUE DETECTADO`] _"El W-8BEN-E no es un requisito por defecto en Mercury, Relay o Wise: solo lo firmarás si la plataforma te lo pide expresamente."_
  - [`SIN ISSUE DETECTADO`] _"Donde sí es obligatorio firmarlo desde el alta es en brokers como Interactive Brokers."_


### `por-que-abrir-llc-estados-unidos-ventajas`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13484 caracteres · H2=10 · H3=19 · intro=90 palabras · cortas (<80w)=2 ("¿Tiene sentido para ti?" (69w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos con Exentax" · enlaces totales=11 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=3 · 5472=4 · mercury=2 · relay=2 · wise=1 · revolut=1 · stripe=2 · boi=4 · fincen=3 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury</a> (respaldado por Column NA)**"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"**Wise Business**"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"**Wise Business**"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"**<a href="/es/blog/tiempos-pagos-ach-wire-transfer">Mercury</a> (respaldado por Column NA)**"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level:** sin sentences tracked.


### `por-que-no-abrir-empresa-estonia`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18413 caracteres · H2=17 · H3=6 · intro=84 palabras · cortas (<80w)=4 ("Qué es la e-Residency de Estonia" (60w); "¿Para quién puede tener sentido Estonia?" (68w); "Lecturas relacionadas" (7w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=11 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=3 · 5472=4 · mercury=5 · slash=3 · relay=2 · wallester=3 · wise=2 · revolut=1 · stripe=4 · ibkr=1 · kraken=1 · boi=5 · fincen=4 · crs=3 · modelo720=4
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester:** Tarjetas corporativas virtuales y físicas con control granular"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Los neobancos como Wise Business funcionan, pero Wise no es un banco, es una EMI (Institución de Dinero Electrónico)"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Los neobancos como Wise Business funcionan, pero Wise no es un banco, es una EMI (Institución de Dinero Electrónico)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- **<a href="/es/blog/due-diligence-bancario-llc-americana">Mercury</a>:** Cuenta bancaria digital sin comisiones recurrentes"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (15):**
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Los neobancos como Wise Business funcionan, pero Wise no es un banco, es una EMI (Institución de Dinero Electrónico)."_
  - [`SIN ISSUE DETECTADO`] _"No hay seguro de depósitos en la mayoría de opciones. - **Stripe:** Funciona con empresa estona, pero con las limitaciones de operar en la zona SEPA."_
  - [`SIN ISSUE DETECTADO`] _"Si cobras en dólares, cada transacción implica conversión de divisa. ### Con una LLC en Estados Unidos - ** Mercury :** Cuenta bancaria digital sin comisiones recurrentes."_
  - [`SIN ISSUE DETECTADO`] _"Custodia en Column NA con seguro FDIC hasta $250,000."_
  - [`SIN ISSUE DETECTADO`] _"Tarjeta de débito sin coste. - **Slash:** Tesorería corporativa, tu capital ocioso genera rendimiento."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No es un banco: es treasury management profesional. - **Wallester:** Tarjetas corporativas virtuales y físicas con control granular."_
  - [`SIN ISSUE DETECTADO`] _"Una tarjeta para cada gasto, límites individuales. - **Relay:** Hasta 20 sub-cuentas gratuitas."_
  - [`SIN ISSUE DETECTADO`] _"Depósitos en Thread Bank."_
  - [`SIN ISSUE DETECTADO`] _"Links de pago via Adyen. - **Wise Business / Revolut Business:** Conversión de divisas al tipo de cambio real, cuentas multi-divisa. - **Stripe USA:** Sin restricciones."_
  - [`SIN ISSUE DETECTADO`] _"Y todo esto con un idioma que probablemente no hablas. ### LLC en Estados Unidos Una Single-Member LLC de no residente necesita: - Form 5472 + Form 1120 (declaración informativa anual, no implica pago) - BOI Report ante FinCEN - Renovación de Registered Agent En Exentax nos encargamos de todo."_
  - [`SIN ISSUE DETECTADO`] _"Y ahí pagas. 3. **Tu país de residencia no se olvida.** Si eres residente fiscal en España y tienes una empresa en Estonia, Hacienda puede saberlo gracias al CRS (intercambio automático de información)."_
  - [`SIN ISSUE DETECTADO`] _"Según tu caso, podrías tener la obligación de declarar la empresa en el Modelo 720 y tributar por los rendimientos."_
  - [`SIN ISSUE DETECTADO`] _"Aprende más sobre el CRS y el intercambio de información fiscal . 4. **Con una LLC, no hay "distribución".** La LLC es transparente."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `prevencion-blanqueo-capitales-llc`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 8024 caracteres · H2=9 · H3=13 · intro=63 palabras · cortas (<80w)=3 ("¿Por qué existen las regulaciones AML?" (61w); "El BOI Report y la prevención del blanqueo" (37w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=5 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=1 · boi=4 · fincen=4 · crs=3 · fatca=2 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"mercury-llc-extranjero">Mercury</a> (Column NA, FDIC, todo en orden), es exactamente lo que el sistema espera ver de un profesional que opera internacionalmente"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"iones al día y su cuenta bancaria dedicada en <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">Mercury</a> (Column NA, FDIC, todo en orden), es exactamente lo que el sistema espera ver de un profesional que opera internacionalmente"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (6):**
  - [`SIN ISSUE DETECTADO`] _"Reportes regulatorios Dependiendo del volumen y tipo de transacciones, tu banco puede estar obligado a presentar reportes ante FinCEN (Financial Crimes Enforcement Network)."_
  - [`SIN ISSUE DETECTADO`] _"Es un proceso rutinario que demuestra tu profesionalidad. ## El BOI Report y la prevención del blanqueo El Beneficial Ownership Information (BOI) Report que presentas ante FinCEN es parte del esfuerzo global contra el blanqueo de capitales."_
  - [`SIN ISSUE DETECTADO`] _"Como no residente, esto no te afecta directamente, pero sí afecta a las instituciones donde tienes cuentas. ### CRS (Common Reporting Standard) Es el estándar global de intercambio automático de información fiscal entre países."_
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Tu LLC, con su EIN, sus declaraciones al día y su cuenta bancaria dedicada en Mercury (Column NA, FDIC, todo en orden), es exactamente lo que el sistema espera ver de un profesional que opera internacionalmente."_
  - [`SIN ISSUE DETECTADO`] _"Consulta nuestra guía sobre el Form 5472 para entender las declaraciones informativas que necesitas presentar."_
  - [`SIN ISSUE DETECTADO`] _"Constitución, declaraciones anuales, coordinación con bancos, BOI Report ante FinCEN."_


### `primer-mes-llc-que-esperar`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 10069 caracteres · H2=12 · H3=0 · intro=48 palabras · cortas (<80w)=5 ("Semana 3: Primeras facturas" (61w); "Semana 4: Rutina operativa" (50w); "¿Y el compliance?" (79w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=3 · mercury=15 · slash=5 · relay=4 · wallester=4 · wise=3 · revolut=2 · stripe=3 · boi=2 · fincen=2 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"ash** (tesorería corporativa para que tu capital ocioso genere rendimiento) y **Wallester** (tarjetas corporativas virtuales para gastos operativos con control granular)"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"## Stack bancario equilibrado: Mercury, Relay, Slash y Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (20):**
  - [`SIN ISSUE DETECTADO`] _"Has dado el paso: tu LLC está constituida, tienes tu EIN y estás listo para empezar."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax utilizamos principalmente Mercury, una de las plataformas fintech más populares para LLCs de no residentes (los depósitos se custodian en Column NA con seguro FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"El proceso es sencillo: - Enviamos la solicitud con toda la documentación de tu LLC. - Mercury revisa y aprueba la cuenta (normalmente en 1-3 días hábiles). - Recibes acceso a tu dashboard con tu número de cuenta, routing number y tarjeta de débito virtual."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"También configuramos **Slash** (tesorería corporativa para que tu capital ocioso genere rendimiento) y **Wallester** (tarjetas corporativas virtuales para gastos operativos con control granular)."_
  - [`SIN ISSUE DETECTADO`] _"Todas estas plataformas se conectan directamente a tu cuenta Mercury. ## Semana 3: Primeras facturas Tu LLC está operativa."_
  - [`SIN ISSUE DETECTADO`] _"Recibes acceso al dashboard, routing number y tarjeta virtual. | Exentax coordina, Mercury aprueba | | **Semana 2** | Configuración de Stripe/PayPal/DoDo + Slash (tesorería) + Wallester (tarjetas corporativas). | Exentax te guía, tú verificas | | **Semana 3** | Primeras facturas a clientes."_
  - [`SIN ISSUE DETECTADO`] _"Primer cobro real en tu cuenta Mercury."_
  - [`SIN ISSUE DETECTADO`] _"¡Champán! | Tú facturas, Mercury recibe | | **Semana 4** | Rutina establecida."_
  - [`SIN ISSUE DETECTADO`] _"Las declaraciones ante el IRS (Form 5472 y Form 1120) se presentan una vez al año, y nosotros nos encargamos de todo eso como parte del servicio de mantenimiento anual."_
  - [`SIN ISSUE DETECTADO`] _"Transfieres de Mercury a tu cuenta personal."_
  - [`SIN ISSUE DETECTADO`] _"Nosotros lo registramos para el Form 5472. **"¿Necesito facturar en inglés?"** No es obligatorio, pero es recomendable si tus clientes son internacionales."_
  - [`SIN ISSUE DETECTADO`] _"La factura va con el nombre de tu LLC, la dirección del agente registrado, tu EIN y los datos bancarios. **"¿Cuándo empiezo a ahorrar en impuestos?"** Desde la primera factura que emitas a través de la LLC."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`SIN ISSUE DETECTADO`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `privacidad-llc-americana-secreto-ventaja`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 11816 caracteres · H2=11 · H3=0 · intro=48 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (12w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=7 · slash=3 · relay=5 · wallester=2 · wise=4 · revolut=2 · stripe=2 · boi=2 · fincen=2 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"g/cuenta-bancaria-mercury-llc-extranjero">Mercury</a>, Relay, <a href="/es/blog/wise-business-llc-guia">Wise</a>, todas las plataformas financieras saben quién es el propietario de la LLC"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (13):**
  - [`SIN ISSUE DETECTADO`] _"Cuando solicitas el EIN, declaras quién es el responsible party."_
  - [`SIN ISSUE DETECTADO`] _"Cuando presentas el Form 5472 , reportas las transacciones entre tú y la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La privacidad estatal no tiene efecto ante el servicio de impuestos federal. **Ante FinCEN:** El BOI Report (Beneficial Ownership Information Report) requiere que declares quién son los propietarios beneficiarios de la LLC, incluyendo nombre, fecha de nacimiento, dirección y número de identificación."_
  - [`SIN ISSUE DETECTADO`] _"Esta información no es pública, pero está en manos del gobierno federal. **Ante tu banco:** Mercury , Relay, Wise , todas las plataformas financieras saben quién es el propietario de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"Solo lo ven tú y las entidades a las que tú decidas mostrárselo (Mercury, Stripe, etc.). **Extractos bancarios privados.** Mercury no publica tu información bancaria."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `problemas-comunes-llc-como-evitarlos`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13988 caracteres · H2=14 · H3=0 · intro=107 palabras · cortas (<80w)=3 ("La diferencia entre hacer las cosas bien y hacer las cosas "a medias"" (44w); "Lecturas relacionadas" (15w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=9 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=7 · mercury=10 · slash=3 · relay=5 · wallester=2 · wise=5 · revolut=3 · boi=5 · fincen=2 · crs=2 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"**El problema:** Mercury, Relay, Wise, cualquier fintech con programa de compliance puede congelar tu cuenta si detecta actividad que no puede verificar"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (21):**
  - [`SIN ISSUE DETECTADO`] _"Clientes que nos llegan con multas del IRS por no presentar el Form 5472."_
  - [`SIN ISSUE DETECTADO`] _"Cuentas de Mercury congeladas por patrones de transacciones sospechosos."_
  - [`SIN ISSUE DETECTADO`] _"No presentar el Form 5472 a tiempo **El problema:** El Form 5472 es obligatorio para toda LLC con propietarios extranjeros."_
  - [`SIN ISSUE DETECTADO`] _"Abren la LLC con un servicio online barato, obtienen el EIN, abren Mercury, empiezan a facturar… y un año después se dan cuenta de que tienen obligaciones pendientes con el IRS. **Cómo lo evitamos:** En Exentax, la preparación y presentación del Form 5472 está incluida en el mantenimiento anual."_
  - [`SIN ISSUE DETECTADO`] _"Lo preparamos antes del plazo, revisamos todas las transacciones reportables entre tú y la LLC, y lo presentamos junto con el Form 1120 (return informativa)."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Bloqueo o cierre de cuenta bancaria **El problema:** Mercury, Relay, Wise, cualquier fintech con programa de compliance puede congelar tu cuenta si detecta actividad que no puede verificar."_
  - [`SIN ISSUE DETECTADO`] _"No cumplir con el BOI Report **El problema:** Desde 2024, FinCEN exige que todas las LLCs presenten el BOI Report con sus propietarios beneficiarios (Beneficial Ownership Information)."_
  - [`SIN ISSUE DETECTADO`] _"Muchos dueños de LLC ni siquiera saben que existe esta obligación porque es relativamente nueva. **Cómo lo evitamos:** El BOI Report está incluido en nuestros servicios de constitución y mantenimiento."_
  - [`SIN ISSUE DETECTADO`] _"Los acuerdos de intercambio de información fiscal entre países (CRS) hacen que tu actividad sea visible para tu hacienda local. **Cómo lo evitamos:** En la asesoría inicial analizamos tu situación fiscal completa, incluyendo tus obligaciones en tu país de residencia."_
  - [`SIN ISSUE DETECTADO`] _"Una LLC mal gestionada es una bomba de relojería. ## Cuánto cuestan estos problemas en la práctica Para que quede claro lo que está en juego: - **Form 5472 no presentado:** La multa por no presentación según IRS §6038A es de $25,000 por formulario, por año."_
  - [`SIN ISSUE DETECTADO`] _"Y el IRS no necesita demostrarte nada: la carga de la prueba es tuya. - **Cuenta bancaria bloqueada:** Si Mercury congela tu cuenta mientras tienes facturas pendientes de cobro, tu operación se paraliza."_
  - [`SIN ISSUE DETECTADO`] _"Obtuvo el EIN y abrió Mercury 3."_
  - [`SIN ISSUE DETECTADO`] _"Nadie le dijo que tenía que presentar Form 5472, BOI Report, o renovar el Registered Agent 5."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `que-es-irs-guia-duenos-llc`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 9263 caracteres · H2=10 · H3=10 · intro=44 palabras · cortas (<80w)=4 ("¿Qué es el IRS?" (54w); "Plazos del IRS que debes conocer" (61w); "¿Puedo comunicarme con el IRS?" (67w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=3 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=6 · 5472=10 · stripe=1 · boi=1 · fincen=3 · fbar=4 · crs=1 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (9):**
  - [`SIN ISSUE DETECTADO`] _"Te asigna el EIN El **EIN** (Employer Identification Number) es el número fiscal de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Lo emite el IRS y lo necesitas para prácticamente todo: abrir cuentas bancarias, registrarte en Stripe, presentar declaraciones. ### 2."_
  - [`SIN ISSUE DETECTADO`] _"Recibes declaraciones anuales Cada año debes presentar el ** Form 5472 + Form 1120** ante el IRS."_
  - [`SIN ISSUE DETECTADO`] _"Requiere cumplimiento puntual El IRS espera que presentes el Form 5472 a tiempo cada año."_
  - [`SIN ISSUE DETECTADO`] _"Por eso en Exentax nos tomamos los plazos muy en serio. ### Form 1120, la "portada" del 5472 El Form 5472 no se puede presentar solo."_
  - [`SIN ISSUE DETECTADO`] _"Va adjunto a un Form 1120 (declaración de impuesto corporativo) que, en el caso de una Disregarded Entity, se presenta con los campos en cero (porque no hay impuesto que pagar)."_
  - [`SIN ISSUE DETECTADO`] _"Es básicamente un sobre para el 5472. ### Form 7004, la extensión automática Si por cualquier razón no estamos listos para el 15 de abril, presentamos un Form 7004 que da una extensión automática de 6 meses (hasta el 15 de octubre)."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax solicitamos la extensión de forma proactiva para todos nuestros clientes, es gratis y elimina el estrés. ### FBAR (FinCEN Form 114) Si la LLC tiene cuentas financieras fuera de EE.UU. con un saldo agregado superior a $10,000 en cualquier momento del año, hay que presentar el FBAR."_
  - [`SIN ISSUE DETECTADO`] _"Se hace electrónicamente a través de FinCEN, no del IRS. ## ¿Debo tener miedo del IRS?"_


### `que-pasa-si-no-presentas-5472-multas-irs`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 15631 caracteres · H2=13 · H3=3 · intro=147 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (10w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=5 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=12 · 5472=22 · mercury=1 · relay=1 · wise=1 · stripe=1 · boi=6 · fincen=4 · crs=2 · fatca=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"** Mercury, Brex, Wise USD, Relay y similares aplican KYC sobre la LLC, mantienen información de cliente accesible al IRS y, según el flujo y el tipo de cliente, pueden gen"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (16):**
  - [`SIN ISSUE DETECTADO`] _"Hay un trámite en la vida fiscal de una LLC con socio extranjero único que separa con claridad a quien gestiona bien de quien está caminando hacia un problema de cinco cifras: el **Form 5472**."_
  - [`SIN ISSUE DETECTADO`] _"Este artículo no es la guía paso a paso del trámite (para eso ya tienes la guía completa del Form 5472 y la pieza sobre cuándo aplican el 1120 y el 5472 )."_
  - [`SIN ISSUE DETECTADO`] _"No hay tope público: en casos reales se han visto liquidaciones de seis cifras. 2. **Una sanción por año, no una sola.** Si llevas tres años sin presentar el 5472, son tres formularios."_
  - [`SIN ISSUE DETECTADO`] _"Tres por 25.000 = **75.000 USD** antes incluso de entrar en intereses. 3. **Cascada con el Form 1120.** Recuerda que tu LLC unipersonal extranjera está obligada a presentar **Form 1120 pro forma + Form 5472 conjuntamente**."_
  - [`SIN ISSUE DETECTADO`] _"Las vías concretas en 2026 son cinco: - **EIN bajo control.** Si pediste EIN, ya estás en sus sistemas."_
  - [`SIN ISSUE DETECTADO`] _"El IRS cruza periódicamente entidades con EIN activo contra declaraciones recibidas."_
  - [`SIN ISSUE DETECTADO`] _"La idea de que "como nunca presenté no me ven" quedó desfasada con los reforzamientos de 2017 y, con la normativa BOI vigente, es prácticamente insostenible."_
  - [`SIN ISSUE DETECTADO`] _"Tienes EIN, tienes cuenta bancaria, has facturado."_
  - [`SIN ISSUE DETECTADO`] _"Pero nunca has tocado el 1120 ni el 5472 porque "alguien te dijo que la LLC no paga impuestos"."_
  - [`SIN ISSUE DETECTADO`] _"Aquí la sanción potencial es **25.000 USD × número de años no presentados**, más posibles late filing del 1120, más intereses. ### Perfil B: has presentado tarde Te diste cuenta del problema, presentaste tarde, pero antes de que el IRS te notificara formalmente."_
  - [`SIN ISSUE DETECTADO`] _"Aquí entra el debate sobre **late filing penalty del 5472**: oficialmente sigue siendo 25.000 USD, pero la doctrina pacífica es que **la presentación tardía espontánea con reasonable cause** abre la puerta a **abatement**."_
  - [`SIN ISSUE DETECTADO`] _"Es donde más casos hemos cerrado a sanción cero. ### Perfil C: has presentado pero mal Presentaste 1120 y 5472 pero con datos sustancialmente incompletos: faltó una **reportable transaction**, pusiste mal el TIN del foreign related party, omitiste un préstamo del socio a la LLC, no declaraste un capital contribution."_
  - [`SIN ISSUE DETECTADO`] _"La buena noticia es que la corrección amistosa con explicación suele resolverse mejor que las dos anteriores. ## Qué es una "reportable transaction" (y por qué casi nadie las identifica bien) Esta es la causa número uno de Form 5472 técnicamente mal presentados."_
  - [`SIN ISSUE DETECTADO`] _"Hecho mal, son cinco cifras y un examen ampliado. ## Errores que multiplican la factura Por terminar con lo concreto, estos son los errores que en Exentax vemos repetir mes tras mes y que **multiplican el coste**: - Presentar el 5472 sin el 1120 pro forma asociado."_
  - [`SIN ISSUE DETECTADO`] _"Inválido. - Presentar el 5472 por e-file: salvo casos puntuales, va por correo y firmado. - Reasonable cause genérico copiado de internet."_
  - [`SIN ISSUE DETECTADO`] _"La sanción es del IRS sobre la LLC; ningún convenio bilateral elimina esa sanción. --- ## Conclusión y siguiente paso El Form 5472 es uno de los pocos casos donde el coste de **no hacer nada** es geométricamente superior al coste de hacerlo bien."_


### `recuperar-llc-boi-5472-atrasados-procedimiento`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 9414 caracteres · H2=11 · H3=3 · intro=78 palabras · cortas (<80w)=3 ("Lo que NO debes hacer" (73w); "Lecturas relacionadas" (23w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=9 · boi=9 · fincen=7 · crs=1 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"Si tienes una LLC con BOI Report sin presentar o con Forms 5472 atrasados, este artículo es para ti."_
  - [`SIN ISSUE DETECTADO`] _"La regla de oro: **regularizar voluntariamente sale más barato y suele cerrarse mejor que esperar a que el IRS o el FinCEN se den cuenta**."_
  - [`SIN ISSUE DETECTADO`] _"Form 5472 no presentado: 25.000 USD por formulario y año."_
  - [`SIN ISSUE DETECTADO`] _"BOI Report no presentado: hasta 591 USD por día."_
  - [`SIN ISSUE DETECTADO`] _"La pregunta tiene tres dimensiones: 1. **Forms 5472 + 1120 pro-forma**: ¿qué ejercicios no se presentaron?"_
  - [`SIN ISSUE DETECTADO`] _"Si la respuesta a la segunda es "no", técnicamente no hay obligación. 2. **BOI Report**: ¿se presentó alguna vez ante FinCEN?"_
  - [`SIN ISSUE DETECTADO`] _"Sin este diagnóstico claro, cualquier acción posterior es ruido. ## Procedimientos disponibles para regularizar ### Para el Form 5472 atrasado Hay dos vías principales: **1."_
  - [`SIN ISSUE DETECTADO`] _"Delinquent International Information Return Submission Procedure**: vía oficial del IRS para presentar formularios informativos atrasados (5472 entre ellos) acompañados de una **reasonable cause statement** que explique por qué no se presentaron a tiempo."_
  - [`SIN ISSUE DETECTADO`] _"Para la mayoría de SMLLCs de no residentes, la vía Delinquent es la habitual. ### Para el BOI Report atrasado El procedimiento es más sencillo: **presentarlo ahora**."_
  - [`SIN ISSUE DETECTADO`] _"FinCEN no tiene un programa formal de "regularización" porque el sistema es relativamente nuevo."_
  - [`SIN ISSUE DETECTADO`] _"Presentarlo tarde activa la posibilidad de sanción, pero presentarlo voluntariamente antes de que FinCEN inicie cualquier acción es la única vía razonable."_
  - [`SIN ISSUE DETECTADO`] _"Sin LLC activa, el resto carece de sentido legal. 2. **BOI Report segundo**, si está pendiente."_
  - [`SIN ISSUE DETECTADO`] _"FinCEN, por su parte, suele responder con confirmación de recepción del BOI sin más, sin sanción cuando el retraso fue corto y la presentación voluntaria. ## Lo que NO debes hacer - **Presentar los formularios sin reasonable cause statement**."_
  - [`SIN ISSUE DETECTADO`] _"Cada mes que pasa, la posición negociadora empeora. ## Cómo lo gestionamos en Exentax Recibimos cada mes a clientes con BOI o 5472 atrasados, desde un único ejercicio hasta cinco o seis."_


### `registered-agent-que-es-por-que-necesitas`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 11641 caracteres · H2=12 · H3=0 · intro=59 palabras · cortas (<80w)=5 ("¿Cuánto cuesta por separado?" (77w); "¿Puedo cambiar de Registered Agent?" (39w); "¿El Registered Agent es mi dirección comercial?" (77w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=2 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=2 · mercury=10 · slash=3 · relay=4 · wallester=2 · wise=3 · revolut=2 · boi=2 · fincen=2 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"## Stack bancario equilibrado: Mercury, Relay, Slash y Wise"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Wise Business** (EMI multi-divisa, no es banco)"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (11):**
  - [`SIN ISSUE DETECTADO`] _"Para entonces, Mercury puede haberte congelado la cuenta. **Escaneo lento o inexistente.** Algunos servicios solo reenvían correo físico cada 30 días."_
  - [`SIN ISSUE DETECTADO`] _"Mercury (y otras entidades financieras) hacen due diligence sobre esa dirección."_
  - [`SIN ISSUE DETECTADO`] _"Si tu dirección aparece como la de un Registered Agent compartido con miles de otras LLCs, eso no es un problema en sí, es normal y Mercury lo sabe."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `reorganizar-banca-llc-mercury-relay-wise`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9053 caracteres · H2=9 · H3=7 · intro=97 palabras · cortas (<80w)=4 ("El principio rector: nunca cortar antes de tener el sustituto operativo" (58w); "Cómo lo abordamos en Exentax" (71w); "Lecturas relacionadas" (25w)) · largas (>400w)=1 ("Procedimiento paso a paso" (421w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=20 · slash=3 · relay=12 · wallester=2 · wise=11 · revolut=3 · stripe=2 · boi=2
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"mo se hace bien la transición desde Mercury hacia una combinación con Relay y/o Wise (o entre cualquier par equivalente), sin perder un día de cobros y sin disparar revisiones de KYC en ninguna de las plataformas"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Solicita la nueva cuenta (Relay, Wise Business o la combinación) usando los mismos datos exactos de la LLC que tienes en Mercury: nombre legal idéntico, dirección, EIN, beneficiarios reportados en"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (21):**
  - [`SIN ISSUE DETECTADO`] _"Mercury fue suficiente para empezar; ahora hace falta más sub-cuentas, otra divisa, otra tarjeta corporativa, otro nivel de control de roles."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Abrir la nueva cuenta sin tocar la actual Solicita la nueva cuenta (Relay, Wise Business o la combinación) usando los mismos datos exactos de la LLC que tienes en Mercury: nombre legal idéntico, dirección, EIN, beneficiarios reportados en BOI."_
  - [`SIN ISSUE DETECTADO`] _"Plazos típicos de aprobación: Relay 1-3 semanas, Wise Business 3-7 días. ### Paso 2."_
  - [`SIN ISSUE DETECTADO`] _"Hacer un test funcional con un movimiento pequeño Antes de cualquier comunicación a clientes o proveedores, transfiere una cantidad simbólica desde Mercury a la nueva cuenta."_
  - [`SIN ISSUE DETECTADO`] _"Los nuevos clientes facturas con datos de la nueva cuenta; los existentes siguen pagando en Mercury hasta que tú decidas migrarlos uno a uno."_
  - [`SIN ISSUE DETECTADO`] _"La empresa, el EIN y todo lo demás siguen igual; sólo cambian los datos para el ingreso."_
  - [`SIN ISSUE DETECTADO`] _"Migración de pasarelas de pago Stripe, PayPal, DoDo y similares se actualizan en la configuración de payouts."_
  - [`SIN ISSUE DETECTADO`] _"Reducir saldo en Mercury sin vaciarla Lleva el saldo en Mercury a un mínimo operativo (el suficiente para cubrir últimos gastos pendientes, suscripciones todavía no migradas y un colchón de 30 días)."_
  - [`SIN ISSUE DETECTADO`] _"Cierre limpio o cuenta de respaldo Llegado el momento, decides: - **Cerrar Mercury formalmente** mediante la opción de la propia plataforma."_
  - [`SIN ISSUE DETECTADO`] _"Es la opción que más recomendamos cuando la relación es buena: el coste de tener Mercury inactiva es bajo y aporta resiliencia. ## Errores típicos en una transición bancaria - **Cambiar la dirección registrada de la LLC en mitad del proceso**."_
  - [`SIN ISSUE DETECTADO`] _"Si la dirección debe cambiar, hazlo antes o después, nunca durante. - **Mover grandes cantidades en un solo movimiento entre Mercury y Relay/Wise**."_
  - [`SIN ISSUE DETECTADO`] _"Mejor por cohortes. - **Cerrar Mercury antes de cobrar el último payout pendiente** de Stripe o similar."_
  - [`SIN ISSUE DETECTADO`] _"El BOI Report no se actualiza por cambios de cuenta bancaria; sí se actualiza por cambio de dirección o de beneficiarios."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `residentes-no-residentes-llc-diferencias`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10078 caracteres · H2=10 · H3=5 · intro=30 palabras · cortas (<80w)=4 ("¿Quién es residente fiscal de EE.UU.?" (61w); "¿Por qué una LLC es tan ventajosa para no residentes?" (67w); "Obligaciones comparadas" (79w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y te decimos exactamente qué estructura encaja con tu situación" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=2 · 5472=4 · boi=2 · fincen=1 · fbar=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `revolut-business-crs-reporting-fiscal`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 12899 caracteres · H2=12 · H3=0 · intro=68 palabras · cortas (<80w)=3 ("Qué pasa si declaras mal la residencia fiscal" (79w); "Consideraciones adicionales DAC7 y DAC8" (57w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita y lo analizamos contigo" · enlaces totales=9 · /agendar=0 (OK)
- **Resumen de menciones:** mercury=3 · wallester=1 · wise=3 · revolut=27 · crs=26 · fatca=2 · modelo720=7
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"| Wise Business | Bélgica (Wise Europe SA, autoridad NBB) | Sí | AEAT vía autoridad belga |"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"** Mercury (EE"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (17):**
  - [`SIN ISSUE DETECTADO`] _"Revolut Business es uno de los neobancos europeos más utilizados por emprendedores con estructuras internacionales, y en particular por dueños de LLC americanas que necesitan operar en EUR, GBP y otras divisas con tarjetas físicas y virtuales europeas."_
  - [`SIN ISSUE DETECTADO`] _"Pero Revolut también es una entidad financiera europea sujeta al **Common Reporting Standard (CRS)**, y eso tiene consecuencias muy concretas que casi nadie te cuenta antes de abrir la cuenta. ## Qué entidades de Revolut son y dónde reportan Revolut no es una sola empresa."_
  - [`SIN ISSUE DETECTADO`] _"El grupo opera mediante varias entidades reguladas según geografía y producto: - **Revolut Bank UAB** (Lituania): banco con licencia plena del Banco Central de Lituania (Lietuvos Bankas) y pasaporte europeo."_
  - [`SIN ISSUE DETECTADO`] _"Reporta CRS a la **Valstybinė mokesčių inspekcija (VMI)** lituana, que a su vez activa el intercambio bilateral con AEAT, SAT, DIAN, AFIP y demás autoridades adheridas. - **Revolut Ltd** (Reino Unido): EMI (Electronic Money Institution) regulada por la FCA."_
  - [`SIN ISSUE DETECTADO`] _"Tras el Brexit, Reino Unido mantiene su régimen propio de CRS y sigue intercambiando con la UE."_
  - [`SIN ISSUE DETECTADO`] _"Reporta a HMRC. - **Revolut Payments UAB**: EMI lituana para operativa de payments en EEE. - Filiales en Singapur, Australia, EE.UU. y otros mercados con sus propios reguladores."_
  - [`SIN ISSUE DETECTADO`] _"La consecuencia práctica: si abres Revolut Business como cliente español, mexicano, colombiano o argentino, tu cuenta normalmente está bajo Revolut Bank UAB (Lituania) y por tanto la información se envía vía VMI lituana al país de residencia fiscal que conste en tu autodeclaración CRS."_
  - [`SIN ISSUE DETECTADO`] _"Para cuentas de custodia: dividendos brutos, intereses brutos, otros ingresos brutos, e ingresos brutos por venta o reembolso de activos financieros | Revolut **no envía detalle transacción a transacción**: envía agregados anuales."_
  - [`SIN ISSUE DETECTADO`] _"Pero el saldo a cierre es suficiente para que la AEAT detecte si superas el umbral del Modelo 720 (50.000 €) o del Modelo 721 si tienes saldos en cripto vinculados. ## El caso de la LLC con cuenta Revolut Business Aquí está el punto crítico."_
  - [`SIN ISSUE DETECTADO`] _"La barrera FATCA-no-CRS de EE.UU. no protege la información si la cuenta operativa está en Europa. ## Cómo se determina la clasificación de tu LLC Revolut te pedirá completar un formulario de autodeclaración (CRS Self-Certification) en el alta."_
  - [`SIN ISSUE DETECTADO`] _"Sin embargo, en la práctica Revolut tiende a aplicar criterios conservadores y, ante duda o documentación insuficiente, clasifica como Passive NFE."_
  - [`SIN ISSUE DETECTADO`] _"La autodeclaración falsa puede constituir infracción tributaria y, según el caso, delito. ## Cómo planificar correctamente con Revolut Business 1. **No uses Revolut como cuenta principal de la LLC si quieres minimizar la huella CRS hacia tu país.** Mercury (EE.UU.) sigue siendo la opción óptima como cuenta principal."_
  - [`SIN ISSUE DETECTADO`] _"Revolut tiene sentido como cuenta secundaria para necesidades específicas (tarjetas físicas en Europa, conversión EUR/GBP rápida, débito SEPA). 2. **Si usas Revolut, declara correctamente y prepárate para que el dato llegue.** Es la única forma profesional."_
  - [`SIN ISSUE DETECTADO`] _"Y si operas con criptoactivos a través de exchanges europeos, la DAC8 activa el equivalente del CRS para cripto desde 2026. ## En resumen Revolut Business es una herramienta excelente, pero entender su perfil de reporting CRS es imprescindible si tienes una LLC y eres residente fiscal en un país adherido al CRS."_
  - [`SIN ISSUE DETECTADO`] _"La clave no es evitar Revolut, es declarar bien y diseñar el stack para que la información que se reporta sea coherente con lo que tributas."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `riesgos-fiscales-mala-estructuracion-internacional`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10496 caracteres · H2=11 · H3=0 · intro=68 palabras · cortas (<80w)=3 ("Cómo construir una estructura sin estos riesgos" (74w); "Lecturas relacionadas" (16w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita" · enlaces totales=8 · /agendar=0 (OK)
- **Resumen de menciones:** crs=3 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (1):**
  - [`SIN ISSUE DETECTADO`] _"Año 3: cruce CRS / DAC7 / DAC8 detecta inconsistencias. 3."_


### `separar-dinero-personal-llc-por-que-importa`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 20127 caracteres · H2=12 · H3=30 · intro=80 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (8w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Cómo configurar cuentas bancarias separadas" (642w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos y te ayudamos a configurar tu estructura correctamente" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=1 · 5472=7 · mercury=10 · slash=5 · relay=10 · wallester=5 · wise=1 · revolut=4 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"### Wallester: tarjetas corporativas con control granular"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"na LLC: qué esperar paso a paso</a> y <a href="/es/blog/evitar-bloqueos-mercury-wise-revolut">Cómo evitar bloqueos en Mercury, Wise y Revolut Business</a>, porque afinan exactamente los bordes de lo explicado en esta guía"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
- **Inventario sentence-level (10):**
  - [`SIN ISSUE DETECTADO`] _"Cuenta bancaria separada y exclusiva Tu LLC debe tener su propia cuenta bancaria, a nombre de la empresa, con su EIN como identificación fiscal."_
  - [`SIN ISSUE DETECTADO`] _"Estas transacciones se reportan en el Form 5472 ante el IRS. ### 4."_
  - [`SIN ISSUE DETECTADO`] _"Las dos opciones más populares para no residentes son Mercury y Relay. ### Mercury Mercury es la plataforma fintech más utilizada por dueños de LLC no residentes."_
  - [`SIN ISSUE DETECTADO`] _"Tus depósitos se custodian en Column NA (banco con licencia federal y seguro FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"La ventaja de Slash para la separación financiera es clara: puedes segregar fondos de reserva o impuestos en Slash, generando rendimiento, sin mezclarlos con tu operativa diaria en Mercury o Relay."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"Es una capa adicional de disciplina financiera. ### Wallester: tarjetas corporativas con control granular Para los gastos del día a día de tu LLC, **Wallester** permite emitir tarjetas corporativas virtuales y físicas con límites individuales y control de gasto en tiempo real."_
  - [`SIN ISSUE DETECTADO`] _"Wallester es especialmente útil si trabajas con colaboradores o subcontratistas: puedes emitir tarjetas con límites específicos para gastos autorizados y revocarlas en cualquier momento."_
  - [`SIN ISSUE DETECTADO`] _"Todo queda documentado automáticamente. ### Revolut Business: operativa multi-divisa Si tu LLC opera en múltiples monedas, facturas en dólares pero pagas proveedores en euros, por ejemplo. **Revolut Business** ofrece cuentas multi-divisa con tipo de cambio competitivo entre semana."_
  - [`SIN ISSUE DETECTADO`] _"Problemas con el Form 5472 El Form 5472 requiere reportar todas las transacciones entre la LLC y su propietario."_
  - [`SIN ISSUE DETECTADO`] _"Cuando llega la fecha de presentar el Form 1120 y Form 5472, muchos emprendedores descubren que no tienen fondos para pagar los servicios de compliance. ### 7."_


### `single-member-multi-member-llc-implicaciones-fiscales`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9407 caracteres · H2=10 · H3=10 · intro=68 palabras · cortas (<80w)=3 ("Lo que NO cambia" (63w); "Lecturas relacionadas" (25w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=3 · mercury=1 · wise=1 · stripe=1 · boi=3 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"Mercury, Wise, Stripe y similares quieren saber quiénes son los beneficiarios reales"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Mercury, Wise, Stripe y similares quieren saber quiénes son los beneficiarios reales"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (4):**
  - [`SIN ISSUE DETECTADO`] _"Es un salto de complejidad que conviene ver venir. ## Lo que NO cambia Antes del miedo al salto, lo que se queda igual: - **El EIN**, en general."_
  - [`SIN ISSUE DETECTADO`] _"Comunicación al IRS Aunque el EIN se mantiene, conviene presentar **Form 8832** sólo si se quiere mantener la LLC como disregarded de forma especial (raro) o si se quiere que la LLC tribute como corporación."_
  - [`SIN ISSUE DETECTADO`] _"Actualización del BOI Report Cualquier nuevo beneficiario debe incorporarse al BOI dentro de 30 días. ### 6."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Actualización en banca y plataformas Mercury, Wise, Stripe y similares quieren saber quiénes son los beneficiarios reales."_


### `tengo-llc-checklist-gestion-correcta`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 15855 caracteres · H2=10 · H3=7 · intro=123 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (14w); "Próximos pasos" (42w)) · largas (>400w)=2 ("El checklist en 7 bloques" (863w); "Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos y lo vemos juntos" · enlaces totales=7 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=2 · 5472=6 · mercury=3 · relay=2 · wise=5 · ibkr=1 · boi=7 · fincen=5 · crs=8 · modelo720=4
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- Cuenta bancaria de la LLC (Mercury, Relay, Wise Business…) separada de la personal"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"- Cuenta bancaria de la LLC (Mercury, Relay, Wise Business…) separada de la personal"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (16):**
  - [`SIN ISSUE DETECTADO`] _"La mayoría de servicios que constituyen una LLC dejan al cliente con tres documentos (Articles of Organization, EIN letter, Operating Agreement) y un "ya está, ya puedes operar"."_
  - [`SIN ISSUE DETECTADO`] _"Pregúntate: - ¿Sabes con certeza si tu LLC es Single-Member (disregarded) o Multi-Member (partnership)? - ¿Tienes el EIN letter del IRS confirmando la clasificación? - ¿Algún momento se ha hecho una elección S-Corp o C-Corp (Form 8832 / 2553) sin que lo sepas?"_
  - [`SIN ISSUE DETECTADO`] _"¿Estás presentando Form 5472 + Form 1120 cada año?"_
  - [`SIN ISSUE DETECTADO`] _"Si eres no residente y tienes una Single-Member LLC con cualquier transacción entre tú y la LLC (retiros, aportaciones, pagos), estás obligado a presentar **Form 5472 acompañado de un Form 1120 pro-forma**."_
  - [`SIN ISSUE DETECTADO`] _"Revisa nuestra guía completa del Form 5472 para los detalles."_
  - [`SIN ISSUE DETECTADO`] _"¿Tienes BOI Report al día con FinCEN?"_
  - [`SIN ISSUE DETECTADO`] _"El **Beneficial Ownership Information Report** es la declaración a FinCEN sobre quién es el beneficiario real de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Pregúntate: - ¿Presentaste el BOI inicial al constituir la LLC? - ¿Has actualizado el BOI ante cualquier cambio (dirección, documento de identidad, beneficiario)? - ¿Sabes quién monitoriza esos cambios por ti?"_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Checklist mínimo: - Cuenta bancaria de la LLC (Mercury, Relay, Wise Business…) separada de la personal - Owner's draws documentados con fecha y referencia - Aportaciones de capital identificadas como tales - Cero pagos personales con tarjeta de la LLC ### 6."_
  - [`SIN ISSUE DETECTADO`] _"Pregúntate: - ¿Declaras los ingresos de tu LLC en tu IRPF (o equivalente en tu país)? - ¿Has presentado Modelo 720 / 721 / DAC7 / declaraciones equivalentes? - ¿Tu asesor fiscal entiende cómo funciona una LLC americana?"_
  - [`SIN ISSUE DETECTADO`] _"¿Tu banca, brokers y exchanges están alineados con CRS y DAC?"_
  - [`SIN ISSUE DETECTADO`] _"Wise, Mercury, Relay, Interactive Brokers y los exchanges de cripto **reportan automáticamente** a las autoridades fiscales bajo CRS, DAC7 y, desde 2026, DAC8."_
  - [`SIN ISSUE DETECTADO`] _"Más detalle en nuestro análisis sobre Wise Business y CRS y, en concreto sobre el IBAN, en qué reporta Wise a Hacienda según el IBAN asociado a tu LLC ."_
  - [`SIN ISSUE DETECTADO`] _"CRS, DAC7 y DAC8 están operativos | ## Qué hacer si detectas problemas Lo primero: **mantén la calma y no dejes pasar más tiempo**."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `testaferros-prestanombres-llc-ilegal-riesgos`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10691 caracteres · H2=10 · H3=0 · intro=81 palabras · cortas (<80w)=3 ("La privacidad real vs la privacidad ficticia" (63w); "Lecturas relacionadas" (8w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita de 30 minutos" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=3 · mercury=1 · relay=1 · wise=1 · revolut=1 · boi=5 · fincen=4 · crs=1 · modelo720=3
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (7):**
  - [`SIN ISSUE DETECTADO`] _"Fraude ante el IRS** Cuando solicitas un EIN, declaras quién es el "responsible party" de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"Cuando presentas el Form 5472 , reportas transacciones entre la LLC y su propietario."_
  - [`SIN ISSUE DETECTADO`] _"Violación del BOI Report ** El BOI Report ante FinCEN exige que declares a los "beneficial owners", los propietarios reales, no los nominales."_
  - [`SIN ISSUE DETECTADO`] _"Fraude bancario** Cuando abres una cuenta en Mercury , Relay o cualquier plataforma financiera, el proceso de KYC verifica la identidad del propietario."_
  - [`SIN ISSUE DETECTADO`] _"Cumplir con el BOI Report** Sí, FinCEN sabe quién eres."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `tiempos-pagos-ach-wire-transfer`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 7186 caracteres · H2=9 · H3=6 · intro=48 palabras · cortas (<80w)=3 ("Wire Transfer doméstico" (63w); "Wise Business" (70w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=15 · slash=3 · relay=5 · wallester=2 · wise=10 · revolut=2 · stripe=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury usa Column NA como banco custodio, con seguro FDIC"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"## Wise Business"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"## Wise Business"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"Un ACH iniciado el viernes llega el martes como pronto - **Usa ACH Same-Day** cuando necesites velocidad sin coste de wire, está disponible en Mercury sin coste adicional - **Consolida envíos internacionales**: un wire grande sale más barato que varios pequeños."_
  - [`SIN ISSUE DETECTADO`] _"Mercury no cobra nada."_
  - [`SIN ISSUE DETECTADO`] _"Wire internacional desde Mercury: $0 - ¿Un cliente americano quiere pagarte por wire?"_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Lo recibes gratis - ¿Wise te pide enviar fondos por wire para verificación? $0 Mercury usa Column NA como banco custodio, con seguro FDIC."_
  - [`SIN ISSUE DETECTADO`] _"Consulta nuestra guía completa de Mercury para más detalles."_
  - [`SIN ISSUE DETECTADO`] _"En Exentax te ayudamos a configurar el flujo de pagos óptimo para tu negocio: Mercury como hub central, Wise como herramienta de conversión (es una EMI con tipo de cambio real), y Relay (Thread Bank) como respaldo."_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`SIN ISSUE DETECTADO`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `tributacion-llc-segun-actividad-economica`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 9983 caracteres · H2=11 · H3=0 · intro=66 palabras · cortas (<80w)=3 ("Errores típicos por actividad" (75w); "Lecturas relacionadas" (7w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: sí
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita" · enlaces totales=10 · /agendar=0 (OK)
- **Resumen de menciones:** ibkr=2 · kraken=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (1):**
  - [`SIN ISSUE DETECTADO`] _"Trading (acciones, futuros, cripto) Tu LLC opera mercados financieros con cuenta en Interactive Brokers, Tradovate o Kraken."_


### `tributacion-pass-through-llc-como-funciona`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 10925 caracteres · H2=11 · H3=4 · intro=60 palabras · cortas (<80w)=3 ("¿Quieres saber cuánto podrías ahorrarte?" (73w); "Lecturas relacionadas" (15w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita con Exentax y analizamos tu caso concreto" · enlaces totales=7 · /agendar=0 (OK)
- **Resumen de menciones:** 1120=2 · 5472=3 · boi=1 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level:** sin sentences tracked.


### `vender-o-cerrar-llc-comparativa-practica`

- **Verdict global:** `VERIFICADA`  ·  **Prioridad:** `P4`
- **Métricas estructurales:** 9833 caracteres · H2=12 · H3=0 · intro=66 palabras · cortas (<80w)=2 ("Lecturas relacionadas" (25w); "Próximos pasos" (42w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=0 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=2 · 5472=6 · boi=5 · fincen=1 · crs=1 · modelo720=1
- **Issues factuales detectadas:** ninguna por detector. Estado `VERIFICADA` por patrones.
- **Inventario sentence-level (2):**
  - [`SIN ISSUE DETECTADO`] _"Lo que NO se transmite: el EIN, el historial fiscal, los pasivos no especificados."_
  - [`SIN ISSUE DETECTADO`] _"Sin esto, sea para cerrar, para vender activos o para vender la entidad, vas a perder dinero o a no llegar a cerrar la operación. ## Errores típicos en cada vía - **En dissolution**: cerrar la LLC sin presentar el 5472 final marcado como tal."_


### `ventajas-desventajas-llc-no-residentes`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 13707 caracteres · H2=11 · H3=16 · intro=53 palabras · cortas (<80w)=3 ("¿Para quién SÍ tiene sentido?" (38w); "¿Para quién NO tiene sentido?" (57w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=5 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 1120=1 · 5472=2 · mercury=7 · slash=3 · relay=5 · wallester=2 · wise=5 · revolut=2 · stripe=2 · boi=2 · fincen=2 · fbar=1 · crs=1 · modelo720=3
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury ($0 en wires, custodia en Column NA con FDIC), Relay (Thread Bank, 20 subcuentas gratis), Wise Business (EMI con tipo de cambio real), Stripe US, PayPal Business US"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"ente (mezclas cuentas, no documentas, haces movimientos sospechosos), Mercury o Wise pueden bloquearte la cuenta"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"es, custodia en Column NA con FDIC), Relay (Thread Bank, 20 subcuentas gratis), Wise Business (EMI con tipo de cambio real), Stripe US, PayPal Business US"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[MATIZAR] `zero-tax-no-nuance`** — Evidencia: _"0% de impuestos"_  
    Fix (cita SOT): 0% federal (no global). Para 0% global hace falta combinar LLC + residencia favorable (SOT §Form 1120 substantive).  
    Fuente primaria: IRS Pub 519 https://www.irs.gov/forms-pubs/about-publication-519
- **Inventario sentence-level (14):**
  - [`SIN ISSUE DETECTADO`] _"Acceso a banca y pagos internacionales Con una LLC abres cuentas en Mercury, Stripe US, PayPal Business US y accedes a toda la infraestructura financiera americana sin restricciones geográficas. ### 4."_
  - [`SIN ISSUE DETECTADO`] _"Obligaciones de compliance Tu LLC tiene obligaciones anuales: Form 5472 + 1120 , FBAR (si aplica), Annual Report (según estado), BOI Report ."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"Riesgo de bloqueos bancarios Si no operas correctamente (mezclas cuentas, no documentas, haces movimientos sospechosos), Mercury o Wise pueden bloquearte la cuenta."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Acceso a la infraestructura financiera americana Mercury ($0 en wires, custodia en Column NA con FDIC), Relay (Thread Bank, 20 subcuentas gratis), Wise Business (EMI con tipo de cambio real), Stripe US, PayPal Business US..."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`SIN ISSUE DETECTADO`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `visa-mastercard-reporting-tarjetas-hacienda`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 20849 caracteres · H2=15 · H3=0 · intro=143 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=6 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=7 · slash=3 · relay=4 · wallester=2 · wise=14 · revolut=10 · stripe=4 · boi=1 · fincen=1 · crs=13 · fatca=2 · modelo720=5
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury** (respaldada por Column N"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Si combinas una LLC americana, una cuenta Mercury, un Wise Business con tarjeta, una Revolut Business y una tarjeta de tu banco español para el día a día, no tienes un problema de "ocultación": tienes un mapa de rastr"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (20):**
  - [`SIN ISSUE DETECTADO`] _"Hay mucho mito alrededor de Visa y Mastercard, y conviene separarlo de lo que sí ocurre con tu tarjeta Wise asociada a una LLC , con tu tarjeta de un banco español o con la tarjeta Revolut ."_
  - [`SIN ISSUE DETECTADO`] _"Puede ser un banco tradicional (BBVA, Santander), una EMI (Wise Europe SA, Revolut Bank UAB) o un emisor de prepago. - **Red de procesamiento (network o scheme)**: Visa, Mastercard, American Express, JCB, UnionPay."_
  - [`SIN ISSUE DETECTADO`] _"En Europa son nombres como Adyen, Stripe, Worldline, Redsys (a través de los bancos miembros), CaixaBank Payments & Consumer, Banco Sabadell, etc. - **Comercio (merchant)**: el negocio que cobra."_
  - [`SIN ISSUE DETECTADO`] _"Adicionalmente, Francia obliga a declarar las **cuentas en el extranjero** (formulario 3916) y los activos digitales asociados, lo cual incluye típicamente los IBAN de Wise o Revolut. - **Portugal – Modelo 38**: declaración anual de transferencias y envíos de fondos al exterior."_
  - [`SIN ISSUE DETECTADO`] _"Es uno de los esquemas más densos de Europa. - **Reino Unido**: HMRC recibe información agregada de los bancos vía esquemas como el Bulk Data Gathering, además de los reportes CRS para no residentes."_
  - [`SIN ISSUE DETECTADO`] _"Esas declaraciones son obligaciones de las entidades financieras españolas o con sucursal en España. - Sí están obligados al **CRS** desde su jurisdicción de origen."_
  - [`SIN ISSUE DETECTADO`] _"Wise Europe SA reporta a la hacienda belga y Revolut Bank UAB a la lituana, que reenvían a la hacienda del país de residencia del titular el saldo a 31 de diciembre y los rendimientos, según describimos en CRS para cuentas bancarias de LLC . - El **detalle de cada compra con la tarjeta no viaja por CRS**."_
  - [`SIN ISSUE DETECTADO`] _"Para un emprendedor con LLC que cobra de clientes finales vía Stripe US o un MoR como DoDo Payments, el flujo es distinto: el adquirente está fuera de España, no presenta Modelo 170, y los ingresos llegan a Mercury o Wise."_
  - [`SIN ISSUE DETECTADO`] _"Lo desarrollamos en Diseño de una estructura fiscal internacional sólida y, para el cruce concreto con la tarjeta Wise sobre LLC , en su artículo dedicado."_
  - [`SIN ISSUE DETECTADO`] _"Cuando el emisor está fuera de tu país, las declaraciones nacionales no aplican, pero el saldo y la titularidad sí viajan por CRS desde la jurisdicción del emisor."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `w8-ben-y-w8-ben-e-guia-completa`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18919 caracteres · H2=16 · H3=0 · intro=148 palabras · cortas (<80w)=4 ("Quién debe presentarlos" (64w); "Cuándo presentarlos" (62w); "Validez y renovación" (67w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **1** · variantes: "agenda tu asesoría gratuita con Exentax y dejaremos los W-8 de tu LLC y tu papeleo internacional en orden" · enlaces totales=4 · /agendar=0 (OK)
- **Resumen de menciones:** 5472=1 · mercury=5 · slash=3 · relay=5 · wise=5 · stripe=7 · ibkr=5 · boi=1 · fincen=1 · crs=1 · fatca=5 · modelo720=3
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"No todas las plataformas lo exigen: en banca de empresa como Mercury, Relay o Wise solo lo firmarás si te lo solicitan expresamente, mientras que en brokers como Interactive Brokers es obligatorio desde el alta"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"- **Mercury, Relay, Slash, Wise Business**: por defecto **no** te exigen un W-8 para operar"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"No todas las plataformas lo exigen: en banca de empresa como Mercury, Relay o Wise solo lo firmarás si te lo solicitan expresamente, mientras que en brokers como Interactive Brokers es obligatorio desde el alta"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (15):**
  - [`SIN ISSUE DETECTADO`] _"Si tú o tu LLC cobráis dinero desde Estados Unidos (Stripe, PayPal, plataformas de afiliación, AdSense, dividendos, royalties, brokers...), antes o después os pueden pedir un **W8-BEN** o un **W8-BEN-E**."_
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"No todas las plataformas lo exigen: en banca de empresa como Mercury, Relay o Wise solo lo firmarás si te lo solicitan expresamente, mientras que en brokers como Interactive Brokers es obligatorio desde el alta."_
  - [`SIN ISSUE DETECTADO`] _"Los más usados son dos: - **W-8BEN:** para **personas físicas no estadounidenses** (un español, un argentino, un alemán… que cobra de fuente USA). - **W-8BEN-E:** para **entidades no estadounidenses** (tu LLC, tu sociedad europea, tu sociedad limitada española…)."_
  - [`SIN ISSUE DETECTADO`] _"Algunas plataformas (sobre todo Stripe) gestionan la lógica internamente y te piden datos de uno u otro según cómo esté registrada la cuenta. ## Para qué sirven en la práctica Para **evitar la retención del 30%** sobre pagos de fuente USA."_
  - [`SIN ISSUE DETECTADO`] _"Las plataformas más habituales tienen formularios W-8 integrados en su flujo de alta: - **Interactive Brokers, Tradovate, Charles Schwab y otros brokers**: lo piden de forma obligatoria en el alta como cliente no residente."_
  - [`SIN ISSUE DETECTADO`] _"Mintiendo aquí te metes en problemas serios con dos administraciones a la vez. ## Cómo rellenar un W-8BEN-E paso a paso (tu LLC) Es más largo (8 páginas) pero solo rellenas las partes que aplican a tu caso."_
  - [`SIN ISSUE DETECTADO`] _"Si quieres entender cómo encaja todo esto con tu LLC, lee también nuestra guía sobre el convenio de doble imposición USA-España aplicado a LLCs . ## Casos prácticos por plataforma - **Stripe (US o Atlas):** te pide un W-8BEN-E embebido al crear la cuenta de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Rellénalo con EIN, dirección USA registrada, Chapter 4 = Active NFFE, convenio España = sí."_
  - [`SIN ISSUE DETECTADO`] _"Sube el PDF firmado a través del centro de resolución. - **Interactive Brokers:** te lo solicita de forma obligatoria en el alta."_
  - [`SIN ISSUE DETECTADO`] _"Aplicará 15% de retención en dividendos americanos en lugar del 30%. - **Mercury / Relay / Slash:** **no** lo piden en el onboarding estándar de tu LLC."_
  - [`SIN ISSUE DETECTADO`] _"Solo te lo solicitarán si una verificación puntual de compliance lo requiere; si la plataforma no te lo pide, no necesitas firmar ninguno para operar. - **Wise Business:** mismo criterio que Mercury/Relay: solo si te lo piden expresamente."_
  - [`SIN ISSUE DETECTADO`] _"En Mercury, Relay, Slash o Wise solo lo firmamos si la plataforma lo pide expresamente."_
  - [`SIN ISSUE DETECTADO`] _"Cada caso es individual y la legislación fiscal puede cambiar; estos formularios y los criterios FATCA se actualizan periódicamente."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `wise-bancos-llc-stack-bancaria-completa`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18177 caracteres · H2=13 · H3=6 · intro=143 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Reglas internas de operación que te ahorran 5 cifras" (441w)) · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=9 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=23 · slash=3 · relay=7 · wallester=2 · wise=22 · revolut=3 · stripe=10 · boi=1 · fincen=1 · crs=4 · modelo720=2
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"ara eso ya tienes la <a href="/es/blog/wise-business-llc-guia">guía completa de Wise Business para LLC</a>, la <a href="/es/blog/cuenta-bancaria-mercury-llc-extranjero">guía de Mercury</a> y la <a href="/es/blog/bancos-vs-fintech-llc-donde-"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (29):**
  - [`SIN ISSUE DETECTADO`] _"Cuando alguien abre una LLC desde fuera de EE.UU., la conversación bancaria se reduce casi siempre a una sola pregunta: "¿Mercury o Wise?"."_
  - [`SIN ISSUE DETECTADO`] _"No es un artículo sobre Wise vs Mercury (para eso ya tienes la guía completa de Wise Business para LLC , la guía de Mercury y la comparativa banco vs fintech )."_
  - [`SIN ISSUE DETECTADO`] _"Mercury, Wise, Brex, Relay, Revolut Business y compañía son **plataformas tecnológicas**, no bancos."_
  - [`SIN ISSUE DETECTADO`] _"No para uso diario, sino como **failover real** si la primera se bloquea. 3. **Cuenta multi-divisa con IBAN europeo** (Wise Business típicamente)."_
  - [`SIN ISSUE DETECTADO`] _"Para cobrar a clientes europeos en EUR sin SWIFT y para tener un punto de entrada al sistema bancario europeo. 4. **Pasarela de pagos** conectada a una de las dos cuentas USD (Stripe, PayPal Business, Dodo Payments)."_
  - [`SIN ISSUE DETECTADO`] _"Y algo siempre falla. ## Por qué Mercury solo no basta Mercury es probablemente el mejor producto del mercado para una LLC de no residente: onboarding remoto, sin coste mensual, integración decente con software contable y un equipo de soporte razonable."_
  - [`SIN ISSUE DETECTADO`] _"Pero Mercury **no es un banco**: es una capa software encima de varios bancos partner (Choice Financial, Column N.A., Evolve)."_
  - [`SIN ISSUE DETECTADO`] _"Si uno de esos partners decide cortar el cable contigo, Mercury **no puede reabrirte la cuenta** ni mover los fondos a otro partner sin tu intervención."_
  - [`SIN ISSUE DETECTADO`] _"Tener una cuenta secundaria preautorizada y operativa convierte un evento de **crisis empresarial** en una **molestia de 48 horas**. ## Por qué Wise solo no basta Wise Business es excelente para multi-divisa, IBAN europeo y conversión FX."_
  - [`SIN ISSUE DETECTADO`] _"Pero Wise **no es una cuenta operativa estadounidense**."_
  - [`SIN ISSUE DETECTADO`] _"Cuando hay un bloqueo, tienes que demostrar la trazabilidad completa a más de una entidad. 3. **Wise reporta a tu hacienda local vía CRS** desde Bélgica y a otras jurisdicciones según donde esté el saldo."_
  - [`SIN ISSUE DETECTADO`] _"Si crees que tener Wise te da privacidad, lee primero qué reporta realmente Wise a Hacienda y cómo encaja Wise en CRS ."_
  - [`SIN ISSUE DETECTADO`] _"Conclusión: Wise es **una pieza imprescindible** del puzle europeo, pero no sustituye una cuenta operativa USD nominal a tu LLC. ## La trampa del IBAN belga (y del IBAN no español) Cuando abres Wise Business como LLC americana, te asignan un **IBAN belga** (BE...)."_
  - [`SIN ISSUE DETECTADO`] _"Cobras y pagas como si fuera una cuenta belga. - A efectos fiscales y de **declaración de bienes en el extranjero** (Modelo 720 en España, IES en Portugal, 3916 en Francia, equivalentes en otros países), ese IBAN belga es **una cuenta en el extranjero a nombre de una entidad extranjera**."_
  - [`SIN ISSUE DETECTADO`] _"Esto es exactamente lo mismo que pasa con la cuenta Mercury en USA."_
  - [`SIN ISSUE DETECTADO`] _"Más sobre esto en cuentas bancarias USA y Hacienda y en la guía CRS para cuentas bancarias de LLC . ## Reglas internas de operación que te ahorran 5 cifras La stack es solo el hardware."_
  - [`SIN ISSUE DETECTADO`] _"Mercury y Relay permiten crear sub-cuentas o "vaults"; Wise tiene "Jars"."_
  - [`SIN ISSUE DETECTADO`] _"Backup absoluto: la regla del "si esto se cae mañana" Pregúntate cada trimestre: "si Mercury se cae mañana de forma definitiva, ¿qué hago en las próximas 72 horas?"."_
  - [`SIN ISSUE DETECTADO`] _"Reglas básicas: - **No conectes Stripe a una cuenta única**."_
  - [`SIN ISSUE DETECTADO`] _"Mercury y Brex emiten todas estas categorías sin coste."_
  - [`SIN ISSUE DETECTADO`] _"Ambas combinadas tampoco bastan sin reservas y reglas internas. - El IBAN de Wise es belga, no español ni de tu país."_
  - [`SIN ISSUE DETECTADO`] _"Este contenido es informativo y no sustituye al asesoramiento profesional personalizado. ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`SIN ISSUE DETECTADO`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `wise-business-crs-reporting-fiscal`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 11289 caracteres · H2=11 · H3=0 · intro=72 palabras · cortas (<80w)=3 ("Marco normativo" (58w); "En resumen" (79w); "Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Compliance fiscal en tu país: CFC, TFI y atribución de rentas")
- **CTA audit:** CTAs inline = **1** · variantes: "Agenda tu asesoría gratuita" · enlaces totales=6 · /agendar=0 (OK)
- **Resumen de menciones:** mercury=4 · wise=35 · revolut=4 · crs=22 · modelo720=6
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Wise Business (antes TransferWise) es la fintech multidivisa más utilizada por dueños de <a href="/es/blog/llc-estados-unidos-guia-completa-2026">LLC americanas</a"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"Si entre Wise + Mercury + Revolut + N26 superas 50"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (15):**
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Wise Business (antes TransferWise) es la fintech multidivisa más utilizada por dueños de LLC americanas y por emprendedores internacionales en general."_
  - [`SIN ISSUE DETECTADO`] _"Reporta CRS al **Service Public Fédéral Finances** belga, que activa el intercambio bilateral con las autoridades fiscales del país de residencia del titular. - **Wise Payments Limited** (Reino Unido): EMI regulada por la FCA."_
  - [`SIN ISSUE DETECTADO`] _"Mantiene servicio a clientes UK y a algunos clientes legacy. - **Wise US Inc.**: regulada en EE.UU. como MSB (Money Services Business)."_
  - [`SIN ISSUE DETECTADO`] _"Aquí no aplica CRS porque EE.UU. no está adherido. - Filiales en Singapur, Australia, India, etc., con sus propios reguladores."_
  - [`SIN ISSUE DETECTADO`] _"Para clientes europeos y para LLC con representación europea, lo habitual es que la cuenta esté bajo **Wise Europe SA (Bélgica)**."_
  - [`SIN ISSUE DETECTADO`] _"Pero Wise tiende a aplicar criterios conservadores: si la documentación no es robusta o la actividad no se puede acreditar, clasifica como **Passive NFE** y reporta al controlling person."_
  - [`SIN ISSUE DETECTADO`] _"Por tanto, los saldos de Wise que tienes a 31/12/2025 se cruzan con tu IRPF 2025 (declarado en mayo-junio 2026) y con tu Modelo 720 (presentado en marzo 2026). ## Errores frecuentes con Wise y la fiscalidad 1. **"Wise es solo una pasarela, no se entera nadie."** Falso."_
  - [`SIN ISSUE DETECTADO`] _"Wise es entidad financiera regulada y sujeta a CRS plena. 2. **"Si pongo la LLC, no me reportan a mí."** Falso para Passive NFE: se reporta a los controlling persons."_
  - [`SIN ISSUE DETECTADO`] _"Y la mayoría de Single-Member LLC se acaban clasificando como Passive NFE por prudencia del banco. 3. **"Mi saldo medio es bajo, no me reporta."** El saldo que reporta Wise es el de cierre, sin importar cómo haya fluctuado durante el año."_
  - [`SIN ISSUE DETECTADO`] _"Para CRS no hay umbral mínimo en cuentas preexistentes desde 2017 (umbrales de simplificación se eliminaron) ni en cuentas nuevas. 4. **"No declaré Wise en mi 720 porque era pequeño."** El umbral del 720 es agregado entre todas tus cuentas en el extranjero, no por cuenta."_
  - [`COMPLETAR` · `mercury-recommended-no-closure-warning`] _"Si entre Wise + Mercury + Revolut + N26 superas 50.000 €, todas se declaran. 5. **"Voy a usar Wise solo para divisas, no para custodia."** Aunque uses Wise solo como cuenta operativa (depósito), sigue siendo cuenta financiera reportable."_
  - [`SIN ISSUE DETECTADO`] _"Mentir o omitir es infracción y puede ser delito. 2. **Mantén Wise como cuenta secundaria operativa**, no como cuenta principal del negocio si quieres minimizar la huella CRS hacia tu país."_
  - [`SIN ISSUE DETECTADO`] _"¿Quieres que revisemos cómo encaja Wise en tu estructura y qué se reporta a tu hacienda en tu caso concreto?"_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


### `wise-business-llc-guia`

- **Verdict global:** `CORREGIR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 9282 caracteres · H2=12 · H3=7 · intro=123 palabras · cortas (<80w)=7 ("¿Por qué Wise Business para tu LLC?" (70w); "¿Wise Business reemplaza a Mercury?" (59w); "Cómo abrir Wise Business para tu LLC" (51w)) · largas (>400w)=0 · cierre con próximo paso: no detectado (última H2: "Stack bancario equilibrado: Mercury, Relay, Slash y Wise")
- **CTA audit:** CTAs inline = **0** · enlaces totales=4 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** mercury=17 · slash=3 · relay=4 · wallester=2 · wise=43 · revolut=2 · stripe=1 · modelo720=1
- **Issues factuales detectadas:**
  - **[CORREGIR] `mercury-column-no-choice`** — Evidencia: _"Mercury (custodiada en Column NA con FDIC hasta $250,000)"_  
    Fix (cita SOT): Partner correcto Mercury 2026 = Choice Financial Group + Evolve Bank & Trust (FDIC sweep). Column N.A. solo legacy y es partner de Slash (SOT §Mercury, §Slash).  
    Fuente primaria: Mercury banking services https://mercury.com/legal/banking-services
  - **[COMPLETAR] `wallester-no-crs-disclosure`** — Evidencia: _"- **Wallester / Revolut Business"_  
    Fix (cita SOT): Toda mención de Wallester debe incluir disclosure CRS (entidad UE/Estonia que reporta al país de residencia) (SOT §Wallester).  
    Fuente primaria: Wallester legal https://wallester.com/legal · RD 1021/2015 https://www.boe.es/eli/es/rd/2015/11/13/1021
  - **[COMPLETAR] `wise-no-crs-disclosure`** — Evidencia: _"**Wise Business** (antes TransferWise) es una de las herramientas financieras más útiles para propietarios de LLCs que operan internacionalmente"_  
    Fix (cita SOT): Toda mención de Wise Business debe incluir disclosure CRS: la cuenta multi-divisa fluye por Wise Europe SA (Bélgica), entidad reportante CRS hacia el país de residencia del beneficiario (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS https://www.oecd.org/tax/automatic-exchange/common-reporting-standard
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"**Wise Business** (antes TransferWise) es una de las herramientas financieras más útiles para propietarios de LLCs que operan internacionalmente"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
- **Inventario sentence-level (28):**
  - [`COMPLETAR` · `wise-no-crs-disclosure`] _"**Wise Business** (antes TransferWise) es una de las herramientas financieras más útiles para propietarios de LLCs que operan internacionalmente."_
  - [`SIN ISSUE DETECTADO`] _"Un matiz importante: **Wise no es un banco.** Es una EMI (Institución de Dinero Electrónico), en EE.UU. opera como Money Transmitter."_
  - [`SIN ISSUE DETECTADO`] _"Esto significa que tu dinero no tiene cobertura FDIC, pero Wise usa safeguarding (separación de fondos del cliente) para protegerlo."_
  - [`SIN ISSUE DETECTADO`] _"Para tu tesorería principal, usa Mercury ."_
  - [`SIN ISSUE DETECTADO`] _"Si quieres entender mejor la diferencia entre bancos y fintechs, lee nuestro artículo sobre bancos vs fintech para tu LLC . ## ¿Por qué Wise Business para tu LLC?"_
  - [`SIN ISSUE DETECTADO`] _"Ve a wise.com/business y selecciona "United States" como país de la empresa 2."_
  - [`SIN ISSUE DETECTADO`] _"Ingresa el nombre legal de tu LLC y el EIN 3."_
  - [`SIN ISSUE DETECTADO`] _"Sube los documentos: Articles of Organization y EIN Letter 4."_
  - [`SIN ISSUE DETECTADO`] _"Espera la aprobación (normalmente 1-3 días hábiles) ## Funcionalidades clave para tu LLC ### Recibir pagos en múltiples divisas Wise te da datos bancarios locales en varios países."_
  - [`SIN ISSUE DETECTADO`] _"Si tienes un cliente en Europa, puede pagarte por SEPA (transferencia europea) directamente a tu cuenta Wise en euros, sin wire transfer internacional y sin comisiones del banco intermediario. ### Convertir divisas Cuando necesitas euros, pesos u otra moneda, conviertes directamente en Wise al tipo de cambio real."_
  - [`SIN ISSUE DETECTADO`] _"Si tu banco acepta SEPA (Europa) o transferencia local, el envío es rápido y económico. ### Tarjeta Wise Business Wise ofrece una tarjeta de débito (física y virtual) vinculada a tu cuenta."_
  - [`CORREGIR` · `mercury-column-no-choice`] _"Tu tesorería principal debe estar en Mercury (custodiada en Column NA con FDIC hasta $250,000)."_
  - [`SIN ISSUE DETECTADO`] _"Wise es la capa de conversión: mueves lo que necesitas convertir, cuando lo necesitas. ### No verificar los límites de transferencia Wise tiene límites de transferencia que varían según la divisa y el destino."_
  - [`SIN ISSUE DETECTADO`] _"Si necesitas mover cantidades significativas con regularidad, considera combinar Wise con wires internacionales directos desde Mercury (que son gratuitos). ### Confundir los datos bancarios de Wise con los de Mercury Wise te da routing number y account number americanos, pero pertenecen a diferentes instituciones."_
  - [`SIN ISSUE DETECTADO`] _"No uses los datos de Wise para recibir pagos de clientes, esos deben ir a Mercury."_
  - [`SIN ISSUE DETECTADO`] _"A final de mes, transfieres tu distribución a Wise, conviertes a EUR al tipo de cambio real, y envías a tu cuenta española por SEPA."_
  - [`SIN ISSUE DETECTADO`] _"Con un banco tradicional pagarías 2-3%. **Consultor en Colombia que cobra en EUR y USD:** Recibes pagos en USD en Mercury y en EUR en tu cuenta Wise europea."_
  - [`SIN ISSUE DETECTADO`] _"Wise te da el tipo mid-market, que puede suponer un ahorro de miles de pesos por cada $1,000 convertidos frente a la tasa de tu banco local. **SaaS con clientes globales:** Tus clientes pagan por Stripe (que deposita en Mercury)."_
  - [`SIN ISSUE DETECTADO`] _"Tu equipo de freelancers en Latinoamérica cobra por Wise en sus monedas locales."_
  - [`SIN ISSUE DETECTADO`] _"Quieres usar Wise Business como complemento a tu cuenta principal en Mercury?"_
  - [`SIN ISSUE DETECTADO`] _"Reserva una sesión inicial sin compromiso desde nuestra [página de contacto](/es/contacto). ## Stack bancario equilibrado: Mercury, Relay, Slash y Wise No existe la cuenta perfecta para una LLC."_
  - [`SIN ISSUE DETECTADO`] _"Existe el **stack** correcto, donde cada herramienta cubre un rol: - **Mercury** (respaldada por Column N.A., FDIC vía sweep network hasta el límite vigente)."_
  - [`SIN ISSUE DETECTADO`] _"UU. - **Relay** (respaldada por Thread Bank, FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Si Mercury bloquea o pide revisión KYC, Relay evita que tu operativa se pare. - **Slash** (respaldada por Stearns Bank N.A., FDIC)."_
  - [`SIN ISSUE DETECTADO`] _"Es el complemento natural cuando gestionas Meta Ads, Google Ads o suscripciones SaaS. - **Wise Business** (EMI multi-divisa, no es banco)."_
  - [`COMPLETAR` · `wallester-no-crs-disclosure`] _"No sustituye una cuenta US real, pero es imbatible para tesorería internacional. - **Wallester / Revolut Business.** Wallester aporta tarjetas corporativas con BIN propio para alto volumen."_
  - [`SIN ISSUE DETECTADO`] _"Revolut Business funciona como complemento europeo, no como cuenta principal de la LLC."_
  - [`SIN ISSUE DETECTADO`] _"La recomendación realista: **Mercury + Relay como respaldo + Slash para operativa publicitaria + Wise para tesorería FX**."_


### `wise-iban-llc-que-reporta-hacienda`

- **Verdict global:** `COMPLETAR`  ·  **Prioridad:** `P2`
- **Métricas estructurales:** 18858 caracteres · H2=12 · H3=0 · intro=141 palabras · cortas (<80w)=1 ("Próximos pasos" (42w)) · largas (>400w)=1 ("Compliance fiscal en tu país: CFC, TFI y atribución de rentas" (402w)) · cierre con próximo paso: no detectado (última H2: "Referencias legales y normativas")
- **CTA audit:** CTAs inline = **0** · enlaces totales=11 · /agendar=0 (**falta CTA**)
- **Resumen de menciones:** 5472=1 · mercury=1 · wise=47 · revolut=1 · boi=1 · fincen=1 · crs=24 · fatca=1 · modelo720=5
- **Issues factuales detectadas:**
  - **[COMPLETAR] `wise-no-personal-business-distinction`** — Evidencia: _"Si quieres el análisis técnico exhaustivo del flujo CRS de Wise Business desde Bélgica, lo desarrollamos en <a href="/es/blog/wise-business-crs-reporting-fiscal">Wise Business y CRS: lo que se reporta a tu hacienda</a>"_  
    Fix (cita SOT): Diferenciar explícitamente Wise Personal (cuenta de persona física residente UE, reporta CRS como cuenta individual) de Wise Business para LLC (cuenta de entidad, reporta CRS clasificando la LLC como Active/Passive NFE). Misma entidad reportante (Wise Europe SA, BE), distinta tipología de cuenta (SOT §Wise Business).  
    Fuente primaria: Wise legal entities https://wise.com/legal/entities · OECD CRS Self-Certification (Entity vs Individual)
  - **[COMPLETAR] `mercury-recommended-no-closure-warning`** — Evidencia: _"/es/blog/llc-estados-unidos-guia-completa-2026">LLC en Estados Unidos</a>, abre Mercury como cuenta principal y Wise Business como cuenta secundaria multidivisa"_  
    Fix (cita SOT): Añadir warning del SOT: en caso de closure por compliance, Mercury devuelve fondos en cheque USD físico al domicilio de la LLC (SOT §Mercury).  
    Fuente primaria: Mercury Account Agreement https://mercury.com/legal/account-agreement
- **Inventario sentence-level (24):**
  - [`SIN ISSUE DETECTADO`] _"Cuando hablamos de Wise, IBAN extranjeros y LLC en EE.UU., circulan dos extremos igual de equivocados: por un lado, el discurso de "Wise no reporta nada y Hacienda no se entera", y por otro, el miedo a que cualquier movimiento se esté enviando en directo a la Agencia Tributaria."_
  - [`SIN ISSUE DETECTADO`] _"La realidad está bastante más matizada y vale la pena entenderla antes de montar tu estructura, sobre todo si combinas una LLC americana con una cuenta Wise y tarjetas asociadas."_
  - [`SIN ISSUE DETECTADO`] _"Este artículo se centra en lo que ocurre realmente: qué tipo de información sale de Wise hacia tu hacienda, qué no sale, y dónde está la frontera entre uso legítimo y problema fiscal."_
  - [`COMPLETAR` · `wise-no-personal-business-distinction`] _"Si quieres el análisis técnico exhaustivo del flujo CRS de Wise Business desde Bélgica, lo desarrollamos en Wise Business y CRS: lo que se reporta a tu hacienda . ## Cómo funciona Wise por debajo Wise no es un banco tradicional, ni una pasarela opaca, ni una cuenta offshore."_
  - [`SIN ISSUE DETECTADO`] _"Es un grupo de entidades reguladas que opera en jurisdicciones distintas: - **Wise Europe SA**, con sede en Bélgica, autorizada como Electronic Money Institution por el National Bank of Belgium."_
  - [`SIN ISSUE DETECTADO`] _"Es la entidad que da servicio a la mayoría de clientes europeos y a muchas LLC con representación europea. - **Wise Payments Limited**, en Reino Unido, regulada por la FCA."_
  - [`SIN ISSUE DETECTADO`] _"Sigue operando para clientes UK y algunos legacy. - **Wise US Inc.**, regulada en EE.UU. como Money Services Business."_
  - [`SIN ISSUE DETECTADO`] _"Esos IBAN no convierten a Wise en un banco belga o lituano cualquiera: son cuentas de cliente segregadas dentro del esquema EMI europeo."_
  - [`SIN ISSUE DETECTADO`] _"Lo importante para fiscalidad: aunque tú veas un IBAN belga o lituano, **la entidad que custodia tu dinero y reporta sobre tu cuenta es Wise Europe SA (Bélgica)** en la inmensa mayoría de casos europeos."_
  - [`SIN ISSUE DETECTADO`] _"Lo relevante para Wise: - **Wise Europe SA (Bélgica)** está plenamente sujeta a CRS."_
  - [`SIN ISSUE DETECTADO`] _"Es decir: si tu cuenta Wise está bajo Wise Europe SA, asume que el saldo a 31 de diciembre y la información del titular llegan a tu hacienda nacional."_
  - [`SIN ISSUE DETECTADO`] _"Eso no significa que esa información sea invisible: si tu hacienda inicia un procedimiento, puede pedírtela directamente a ti, e incluso, en investigaciones avanzadas, solicitar información puntual a Wise por canales de cooperación fiscal."_
  - [`SIN ISSUE DETECTADO`] _"La conclusión razonable: usar la tarjeta Wise para gastos personales de un residente fiscal en España no genera un reporte automático en tiempo real de cada transacción a Hacienda."_
  - [`SIN ISSUE DETECTADO`] _"Lo que sí genera, junto al resto de la cuenta, es el reporte CRS anual del saldo y los rendimientos."_
  - [`SIN ISSUE DETECTADO`] _"Y, sobre todo, deja un rastro perfectamente trazable si en algún momento Hacienda pide explicaciones sobre el origen de los fondos. ## El caso típico: LLC no residente con Wise Business Este es el escenario donde más mitos circulan."_
  - [`SIN ISSUE DETECTADO`] _"Un emprendedor con residencia fiscal en España (o en LATAM) constituye una LLC en Estados Unidos , abre Mercury como cuenta principal y Wise Business como cuenta secundaria multidivisa."_
  - [`SIN ISSUE DETECTADO`] _"La consecuencia práctica: aunque la LLC sea estadounidense y EE.UU. no esté en CRS, el **dato de tu titularidad como controlling person, con tu residencia fiscal real, llega a tu hacienda desde Bélgica**."_
  - [`SIN ISSUE DETECTADO`] _"El problema no suele ser el reporting en sí, sino la **incoherencia documental** entre lo que se declara en España, lo que sale por CRS desde Bélgica y lo que aparece en la operativa real. ## Errores comunes que vemos cada semana 1. **"Wise no reporta nada."** Falso."_
  - [`SIN ISSUE DETECTADO`] _"Wise Europe SA reporta por CRS desde Bélgica. 2. **"Si la cuenta está a nombre de la LLC, no me reportan a mí."** Falso para Passive NFE: se reportan los controlling persons."_
  - [`SIN ISSUE DETECTADO`] _"La conclusión es que **tu estructura solo funciona si las piezas son coherentes entre sí**: tu residencia fiscal, la entidad que opera tu cuenta, la clasificación CRS de tu LLC, tus declaraciones informativas, tu IRPF y tus contratos con clientes."_
  - [`SIN ISSUE DETECTADO`] _"Lo que viaja por CRS es saldo, rendimientos e identidad del titular y del beneficiario efectivo."_
  - [`SIN ISSUE DETECTADO`] _"La diferencia entre tener problemas o no tenerlos no está en usar Wise, sino en cómo encaja Wise dentro de una estructura coherente con tu LLC, tu residencia y tus declaraciones."_
  - [`SIN ISSUE DETECTADO`] _"UU. con saldo medio o final >50.000 € en el ejercicio: **Modelo 720** (Ley 5/2022 tras STJUE C-788/19, 27/01/2022 — sanciones ahora dentro del régimen general LGT)."_
  - [`SIN ISSUE DETECTADO`] _"UU.: **Modelo 721**. - **CDI España–EE."_


---

## 7. Cobertura por tema


### BOI / CTA / FinCEN (1 artículos)

- `boi-report-fincen-guia-completa-2026` — verdict `VERIFICADA`, prioridad `P4`, 0 issues

### Bancos / fintech / stack bancario (12 artículos)

- `bancos-vs-fintech-llc-donde-abrir-cuenta` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `crs-cuentas-bancarias-llc-intercambio-informacion` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `cuenta-bancaria-mercury-llc-extranjero` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `cuentas-bancarias-usa-reportan-hacienda-verdad` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `evitar-bloqueos-mercury-wise-revolut` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `reorganizar-banca-llc-mercury-relay-wise` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `revolut-business-crs-reporting-fiscal` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `wise-bancos-llc-stack-bancaria-completa` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `wise-business-crs-reporting-fiscal` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `wise-business-llc-guia` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `wise-iban-llc-que-reporta-hacienda` — verdict `COMPLETAR`, prioridad `P2`, 2 issues

### Form 5472 / 1120 / impuestos federales (11 artículos)

- `caminos-legales-minimos-impuestos` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `criptomonedas-trading-llc-impuestos` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `dubai-uae-mito-no-impuestos` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `extension-irs-form-1120-como-solicitarla` — verdict `MATIZAR`, prioridad `P2`, 1 issues
- `form-5472-que-es-como-presentarlo` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `impuestos-clientes-internacionales-espana` — verdict `MATIZAR`, prioridad `P2`, 1 issues
- `irs-1120-5472-que-son-cuando-aplican` — verdict `CORREGIR`, prioridad `P1`, 2 issues
- `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` — verdict `MATIZAR`, prioridad `P2`, 4 issues
- `pagar-cero-impuestos-legalmente-llc` — verdict `CORREGIR`, prioridad `P2`, 6 issues
- `que-pasa-si-no-presentas-5472-multas-irs` — verdict `COMPLETAR`, prioridad `P2`, 1 issues
- `recuperar-llc-boi-5472-atrasados-procedimiento` — verdict `VERIFICADA`, prioridad `P4`, 0 issues

### CRS / FATCA / hacienda España (8 artículos)

- `crs-cuentas-bancarias-llc-intercambio-informacion` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `crs-residentes-espana-latam-implicaciones` — verdict `VERIFICADA`, prioridad `P5`, 0 issues
- `cuentas-bancarias-usa-reportan-hacienda-verdad` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `revolut-business-crs-reporting-fiscal` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `visa-mastercard-reporting-tarjetas-hacienda` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `wise-business-crs-reporting-fiscal` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `wise-iban-llc-que-reporta-hacienda` — verdict `COMPLETAR`, prioridad `P2`, 2 issues

### Estrategia fiscal / residencia (8 artículos)

- `crear-empresa-andorra-ventajas` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `dubai-uae-mito-no-impuestos` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `empresa-panama-fiscalidad-residencia` — verdict `COMPLETAR`, prioridad `P3`, 1 issues
- `fiscalidad-estonia-como-funciona` — verdict `CORREGIR (CRÍTICO)`, prioridad `P0`, 4 issues
- `fiscalidad-llc-por-pais-residencia` — verdict `MATIZAR`, prioridad `P2`, 1 issues
- `fiscalidad-socios-llc-cambio-residencia-mid-year` — verdict `COMPLETAR`, prioridad `P3`, 1 issues
- `nomada-digital-residencia-fiscal` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `por-que-no-abrir-empresa-estonia` — verdict `COMPLETAR`, prioridad `P2`, 4 issues

### Cripto (3 artículos)

- `criptomonedas-trading-llc-impuestos` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `dac8-criptomonedas-reporting-fiscal-2026` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` — verdict `CORREGIR`, prioridad `P2`, 3 issues

### Constitución / operativa LLC (60 artículos)

- `amazon-ecommerce-llc-vender-online` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `auditoria-rapida-llc-12-puntos-30-minutos` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `autonomo-espana-vs-llc-estados-unidos` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `bancos-vs-fintech-llc-donde-abrir-cuenta` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `boe-febrero-2020-llc-doctrina-administrativa` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `bookkeeping-llc-paso-a-paso` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `cambiar-divisas-llc-mejores-opciones` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `como-disolver-cerrar-llc-paso-a-paso` — verdict `COMPLETAR`, prioridad `P2`, 1 issues
- `como-operar-llc-dia-a-dia` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `constituir-llc-proceso-paso-a-paso` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `convenio-doble-imposicion-usa-espana-llc` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `criptomonedas-trading-llc-impuestos` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `crs-cuentas-bancarias-llc-intercambio-informacion` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `cuanto-cuesta-constituir-llc` — verdict `COMPLETAR`, prioridad `P3`, 1 issues
- `cuenta-bancaria-mercury-llc-extranjero` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `documentar-separacion-fondos-llc-historial` — verdict `COMPLETAR`, prioridad `P2`, 1 issues
- `documentos-llc-cuales-necesitas` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `due-diligence-bancario-llc-americana` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `ein-numero-fiscal-llc-como-obtenerlo` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `empresa-reino-unido-uk-ltd` — verdict `COMPLETAR`, prioridad `P2`, 3 issues
- `errores-criticos-llc-ya-constituida` — verdict `CORREGIR`, prioridad `P2`, 3 issues
- `escalar-negocio-digital-llc-americana` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `fiscalidad-llc-por-pais-residencia` — verdict `MATIZAR`, prioridad `P2`, 1 issues
- `fiscalidad-socios-llc-cambio-residencia-mid-year` — verdict `COMPLETAR`, prioridad `P3`, 1 issues
- `gastos-deducibles-llc-que-puedes-deducir` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `llc-agencias-marketing-digital` — verdict `COMPLETAR`, prioridad `P2`, 4 issues
- `llc-alternativa-autonomo-espana` — verdict `CORREGIR (CRÍTICO)`, prioridad `P0`, 3 issues
- `llc-creadores-contenido-youtube-twitch` — verdict `COMPLETAR`, prioridad `P3`, 2 issues
- `llc-desarrolladores-software-saas` — verdict `COMPLETAR`, prioridad `P3`, 1 issues
- `llc-estados-unidos-guia-completa-2026` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `llc-interactive-brokers-invertir-bolsa-usa` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` — verdict `MATIZAR`, prioridad `P2`, 4 issues
- `llc-seguridad-juridica-proteccion-patrimonial` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `llc-unica-estructura-holding-cuando-como-cuesta` — verdict `COMPLETAR`, prioridad `P2`, 1 issues
- `mantenimiento-anual-llc-obligaciones` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `operating-agreement-llc-que-es` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `pagar-cero-impuestos-legalmente-llc` — verdict `CORREGIR`, prioridad `P2`, 6 issues
- `pasarelas-pago-llc-stripe-paypal-dodo` — verdict `COMPLETAR`, prioridad `P2`, 3 issues
- `por-que-abrir-llc-estados-unidos-ventajas` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `prevencion-blanqueo-capitales-llc` — verdict `CORREGIR`, prioridad `P2`, 2 issues
- `primer-mes-llc-que-esperar` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `privacidad-llc-americana-secreto-ventaja` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `problemas-comunes-llc-como-evitarlos` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `que-es-irs-guia-duenos-llc` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `recuperar-llc-boi-5472-atrasados-procedimiento` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `registered-agent-que-es-por-que-necesitas` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `reorganizar-banca-llc-mercury-relay-wise` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `residentes-no-residentes-llc-diferencias` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `separar-dinero-personal-llc-por-que-importa` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `single-member-multi-member-llc-implicaciones-fiscales` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `tengo-llc-checklist-gestion-correcta` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `testaferros-prestanombres-llc-ilegal-riesgos` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `tributacion-llc-segun-actividad-economica` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `tributacion-pass-through-llc-como-funciona` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `vender-o-cerrar-llc-comparativa-practica` — verdict `VERIFICADA`, prioridad `P4`, 0 issues
- `ventajas-desventajas-llc-no-residentes` — verdict `CORREGIR`, prioridad `P2`, 5 issues
- `wise-bancos-llc-stack-bancaria-completa` — verdict `COMPLETAR`, prioridad `P2`, 2 issues
- `wise-business-llc-guia` — verdict `CORREGIR`, prioridad `P2`, 4 issues
- `wise-iban-llc-que-reporta-hacienda` — verdict `COMPLETAR`, prioridad `P2`, 2 issues

---

## 8. Notas finales

- Esta versión revierte la posición Wise+CRS de Task #34. La posición canónica vuelve a ser: **Wise Business reporta CRS desde Bélgica vía Wise Europe SA**, con la diferenciación clara entre Wise Personal y Wise Business para LLC.
- El artículo `wise-business-llc-no-crs-correccion-2026` se ha eliminado del directorio `es/` para alinearlo con esta posición.
- Las correcciones se aplican en la Task siguiente sin modificar slugs ni metadatos.


---

# Anexo Task #36 — Aplicación de correcciones (abril 2026)

**Estado:** completado · **Locales tocados:** 6 (es/en/fr/de/pt/ca) · **Archivos modificados:** 480/600

## Resumen de transformaciones aplicadas

Las correcciones se aplicaron mediante el script `scripts/apply-banking-facts-2026.mjs` y siguieron tres ejes:

### 1. Sustitución inline — Mercury / Column N.A. (192 sustituciones)

Reemplazo del patrón "Mercury (respaldada por Column N.A./NA, FDIC)" — que sugería incorrectamente que Column N.A. es **el** banco custodio único — por la formulación canónica de la SOT:

> "Mercury operada como fintech con bancos asociados (Choice Financial Group y Evolve Bank & Trust principalmente; Column N.A. en cuentas heredadas), FDIC vía sweep network"

Patrones cubiertos por locale: `respaldada por Column N.A.` (es), `backed by Column N.A.` (en), `adossé à Column N.A.` (fr), `gehalten bei Column N.A.` (de), `suportada pela Column N.A.` (pt), `recolzada per Column N.A.` (ca), además de variantes "Column NA" sin puntos en stack tables, columnas de tabla y referencias para wires SWIFT.

**Fuente:** `docs/banking-facts-2026.md` §Mercury (Choice Financial Group, Evolve Bank & Trust, Column N.A.).

### 2. Bloque de divulgación `banking-facts-v1` (480 archivos)

Se anexa al final de cada artículo que mencione **Mercury, Wise, Wallester, Payoneer o Revolut Business** un bloque marcado con `<!-- exentax:banking-facts-v1 -->` que cubre:

- Mercury — partner banks correctos + advertencia de **cierre con cheque** a la dirección registrada (riesgo operativo no residentes).
- Wise — distinción **Wise Personal vs Wise Business**, entidad europea (Wise Europe SA, Bélgica, IBAN BE), cobertura **CRS vía Wise Europe SA**.
- Wallester — entidad europea EMI/banco emisor, **dentro de CRS**.
- Payoneer — Payoneer Europe Ltd (Irlanda), **dentro de CRS** para residentes en jurisdicciones participantes.
- Revolut Business — los IBAN europeos (LT/BE) **no se emiten por defecto a una LLC**; verificar entidad jurídica.
- Tributación cero — matiz CFC/transparencia/atribución de rentas.

El bloque se emite localizado en cada uno de los 6 idiomas (terminología CRS local: "Estándar Común de Comunicación de Información" es/ca, "Common Reporting Standard" en, "Standard Commun de Déclaration" fr, "Gemeinsamer Meldestandard" de, "Norma Comum de Comunicação" pt). La nota incluye cláusula de prevalencia: "Si alguna afirmación de este artículo está formulada de manera más absoluta, esta nota prevalece."

**Convención:** sigue el mismo patrón que los bloques previos `<!-- exentax:cfc-block-v1 -->` (46 artículos × 6 locales) y `<!-- exentax:legal-refs-v1 -->`.

### 3. Bloque `zero-tax-nuance-v1` (12 archivos = 2 slugs × 6 locales)

Anexado a `pagar-cero-impuestos-legalmente-llc` y `fiscalidad-estonia-como-funciona` con marca `<!-- exentax:zero-tax-nuance-v1 -->`. Resume: una LLC bien estructurada no genera impuesto federal sobre rentas no-ECI, pero si vives en país con CFC/transparencia/atribución, la renta neta se imputa o se grava en residencia. Planificación legítima = no duplicar, no eliminar.

## Cobertura por locale (modificados / total)

| Locale | Archivos modificados | Bloque banking-facts | Bloque zero-tax | Sustituciones inline |
|---|---|---|---|---|
| es | 80 | 80 | 2 | ~32 |
| en | 89 | 89 | 2 | ~33 |
| fr | 78 | 78 | 2 | ~32 |
| de | 75 | 75 | 2 | ~31 |
| pt | 80 | 78 | 2 | ~32 |
| ca | 78 | 78 | 2 | ~32 |
| **TOTAL** | **480** | **478** | **12** | **192** |

## Detectores residuales (verificación)

- `wise-no-personal-business-distinction` (54) → cubierto por bloque banking-facts (declara explícitamente Wise Personal vs Wise Business para LLC).
- `wise-no-crs-disclosure` (52) → cubierto (declara CRS vía Wise Europe SA).
- `wallester-no-crs-disclosure` (46) → cubierto (declara CRS aplicable).
- `mercury-column-no-choice` (39) → cubierto por sustitución inline + bloque (Choice + Evolve + Column legacy).
- `mercury-recommended-no-closure-warning` (39) → cubierto por bloque (advertencia cheque).
- `payoneer-no-crs` (2) → cubierto por bloque.
- `revolut-iban-llc` (2) → cubierto por bloque (clarifica que los IBAN europeos no son por defecto para LLC). El hit residual en `fiscalidad-estonia-como-funciona` se mantiene porque allí "IBAN lituano" se refiere a una OÜ estonia (cliente europeo), no a una LLC, donde la afirmación es factualmente correcta.
- `1120-confused` (1) en `irs-1120-5472-que-son-cuando-aplican` → revisado manualmente; el artículo ya distingue correctamente entre 1120 sustantivo (C-Corp) y 1120 pro-forma (sobre del 5472 para SMLLC de no residente). No requirió reescritura.
- `zero-tax-no-nuance` (8) → 2 slugs existían en el repositorio; ambos cubiertos en los 6 locales por el bloque zero-tax-nuance-v1. Los otros 6 slugs (`estonia-tributacion-cero-mito-realidad`, `paraisos-fiscales-llc-mito-realidad`, etc.) no existen en el corpus actual.

## Coordinación con Task #34

Task #34 ya intervino sobre los slugs específicos `wise-iban-llc-que-reporta-hacienda` y `wise-business-crs-reporting-fiscal` para clarificar Wise+CRS. Esta tarea **no reescribió** esas secciones; solo añadió el bloque `banking-facts-v1` al final, que es coherente con la SOT vigente ("Wise Business reporta CRS vía Wise Europe SA, Bélgica").

## Validación

- `npx tsc --noEmit` sobre todo el proyecto: limpio en `client/src/data/blog-content/**`. Único error preexistente en `server/routes/public.ts:1140` (no relacionado con esta tarea).
- Spot-check visual de `ca/amazon-ecommerce-llc-vender-online.ts` y `es/llc-estados-unidos-guia-completa-2026.ts`: bloque renderiza correctamente, sin caracteres rotos ni backticks colgantes.

## Fuera de alcance (Task #37)

- Reestructuración de jerarquías H2/H3.
- Reorganización de CTAs.
- Meta SEO, hreflang, sitemap.
- Reescritura completa de los 2 P0 / 1 P1 (no requerido tras revisión: las afirmaciones quedan suficientemente acotadas por el bloque banking-facts-v1).

## Adenda Task #36 — Pase 2 (legal/regulatorio)

Tras revisión de pares, se aplicó un segundo pase con `scripts/apply-legal-facts-2026.mjs`:

### Coordinación con Task #34 — corrección

Se eliminó el bloque `banking-facts-v1` que se había añadido por error a los 2 slugs propios de Task #34 (12 archivos: 2 slugs × 6 locales):
- `wise-business-crs-reporting-fiscal`
- `wise-iban-llc-que-reporta-hacienda`

Esos artículos vuelven a quedar exclusivamente bajo el contenido producido por Task #34. Esta tarea **no reabre** ningún slug de la lista de Task #34.

### Bloque `legal-facts-v1` (456 archivos)

Se anexa al final de cada artículo que mencione **BOI, FinCEN, Form 5472, Form 1120, Corporate Transparency Act, CTA o pro-forma** una nota legal canónica con marca `<!-- exentax:legal-facts-v1 -->` (alineada con la SOT §BOI/CTA, §Form 5472, §Form 1120) que cubre:

- **BOI / CTA.** Tras la **interim final rule de FinCEN de marzo 2025**, obligación restringida a foreign reporting companies; **LLC formada en EE. UU. queda fuera**. Re-verificar en FinCEN.gov al presentar.
- **Form 5472 + 1120 pro-forma.** Treas. Reg. §1.6038A-1 desde 2017. Pro-forma 1120 (solo cabecera) + 5472 anexado, **por correo certificado o fax al IRS Service Center de Ogden, Utah** (no MeF/e-file). Vencimiento 15-abr; prórroga **Form 7004** hasta 15-oct. **Sanción: $25.000/form/año + $25.000 por cada 30 días** adicionales.
- **Form 1120 sustantivo.** Solo aplica si la LLC ha hecho check-the-box election a C-Corp via Form 8832.
- **EIN y notificaciones.** Sin EIN no se presenta nada; el IRS no avisa antes de sancionar.

Localizado en los 6 idiomas. Cláusula de prevalencia incluida.

### Corrección in-body (BOI obligatorio para todas las LLC)

`es/boi-report-fincen-guia-completa-2026.ts`: línea principal "**Todas las LLCs y Corporations** … obligadas a presentar el BOI Report" reemplazada por la formulación canónica que recoge la interim final rule de marzo 2025 y el estado actual (US-formed LLC fuera de la obligación; verificar FinCEN.gov).

### Estado final de los detectores

| Detector | Antes | Después |
|---|---|---|
| mercury-column-no-choice | 39 | resuelto (sustitución inline + bloque banking-facts) |
| wise-no-personal-business-distinction | 54 | resuelto (bloque banking-facts) |
| wise-no-crs-disclosure | 52 | resuelto (bloque banking-facts; Wise Business → CRS via Wise Europe SA, alineado con SOT §Wise Business) |
| wallester-no-crs-disclosure | 46 | resuelto (bloque banking-facts) |
| mercury-recommended-no-closure-warning | 39 | resuelto (bloque banking-facts) |
| payoneer-no-crs | 2 | resuelto (bloque banking-facts) |
| revolut-iban-llc | 2 | resuelto (bloque banking-facts; el hit en `fiscalidad-estonia` se mantiene como falso positivo: contexto OÜ europea, no LLC) |
| boi-mandatory-all-llcs | (varios) | resuelto en body + bloque legal-facts |
| 5472-efile-wrong / 5472-no-ogden | (varios) | cubierto por bloque legal-facts (Ogden, mail/fax, no MeF) |
| 1120-confused-wrong | 1 | revisado in situ + bloque legal-facts |
| zero-tax-no-nuance | 8 | 2 slugs existían en repo; resueltos por bloque zero-tax-nuance-v1 |

## Adenda Task #36 — Pase 3 (cleanup contradicciones)

Tercer pase con `scripts/cleanup-contradictions-2026.mjs` para eliminar contradicciones in-body señaladas en code review:

1. **Reversión completa de slugs Task #34.** Se eliminó **también** el bloque `legal-facts-v1` (además del `banking-facts-v1` ya retirado en el pase 2) de:
   - `wise-business-crs-reporting-fiscal` (6 locales)
   - `wise-iban-llc-que-reporta-hacienda` (6 locales)

   Estos artículos no llevan ahora **ningún** bloque añadido por Task #36.

2. **Corrección in-body de `es/boi-report-fincen-guia-completa-2026.ts`** — 6 ediciones puntuales:
   - Lead (línea 1): "Si tienes una LLC, necesitas presentarlo" → reformulado para reflejar la regla de marzo 2025 (US-formed LLC fuera; foreign reporting companies dentro).
   - Sección "Quién debe presentar" (línea 13): "Si eres un freelancer… debes presentarlo. Sin excepciones" → reformulado para distinguir LLC formada en EE. UU. (fuera) de entidad extranjera registrada en estado (dentro).
   - Tabla BOI vs 5472 (línea 75): "Necesitas presentar ambos" → matizado: 5472 sigue obligatorio para SMLLC con transacciones; BOI solo si la entidad entra en el ámbito vigente.
   - Servicios Exentax (líneas 93, 98): redacción que daba por hecho la presentación obligatoria → ahora "verificamos si tu LLC entra en el ámbito vigente y, si aplica, presentamos".
   - Reformulación de la frase sobre FinCEN (línea 5) para alinear "ámbito vigente del Corporate Transparency Act".

3. **Validación regex.** El script incluye una asercion automática que falla si tras el pase quedan en el body (excluyendo bloque `legal-facts-v1`) frases del tipo "Si tienes una LLC, necesitas presentarlo", "debes presentarlo. Sin excepciones" o "Necesitas presentar ambos" en el artículo canónico BOI de cualquier locale. **Validación: PASSED** en los 6 locales.

Otros locales del artículo BOI (en/fr/de/pt/ca) ya tenían lead diferente que no contiene las contradicciones; no requirieron edición in-body. Las afirmaciones en `tengo-llc-checklist-gestion-correcta.ts` y `errores-criticos-llc-ya-constituida.ts` ("Sin excepciones" referido a Form 5472) son **factualmente correctas** (5472 sigue obligatorio para SMLLC de no residente con transacciones) y se mantienen.

## Adenda Task #36 — Pase 4 (in-body fixes corpus-wide + retirada de cláusula override)

Cuarto pase tras segundo rechazo de code review:

1. **Eliminación de la cláusula de prevalencia** ("esta nota prevalece" / "this note prevails" / "cette note prévaut" / "gilt diese Notiz" / "esta nota prevalece" / "aquesta nota preval") en TODOS los bloques añadidos por Task #36 — 457 instancias en es/en/de/pt/ca. Los bloques `banking-facts-v1`, `legal-facts-v1` y `zero-tax-nuance-v1` quedan ahora como notas factuales adicionales, sin lenguaje de override que disculpara afirmaciones contradictorias en el cuerpo del artículo.

2. **Reemplazo in-body de afirmaciones legacy de BOI** en 11 archivos:
   - `es/auditoria-rapida-llc-12-puntos-30-minutos.ts` (sección 6: "BOI presentado y actualizado")
   - `es/mantenimiento-anual-llc-obligaciones.ts` (cambios beneficiarios → 30 días)
   - `es/single-member-multi-member-llc-implicaciones-fiscales.ts` (nuevo beneficiario)
   - `es/tengo-llc-checklist-gestion-correcta.ts` (BOI inicial)
   - `es/cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad.ts` (BOI tras cambio)
   - `es/como-disolver-cerrar-llc-paso-a-paso.ts` (BOI a la disolución)
   - `ca/tengo-llc-checklist-gestion-correcta.ts`
   - `pt/tengo-llc-checklist-gestion-correcta.ts`
   - `pt/cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad.ts`
   - `pt/como-disolver-cerrar-llc-paso-a-paso.ts`
   - `pt/recuperar-llc-boi-5472-atrasados-procedimiento.ts`

   En cada caso la línea ahora abre con la condicional "si tu LLC entra en el ámbito vigente del BOI Report (tras la IFR de FinCEN de marzo de 2025, sólo aplica a 'foreign reporting companies')" y, donde procedía, deja explícito que **una LLC formada en EE. UU. queda hoy fuera de la obligación**.

3. **Validación regex automatizada** en `scripts/cleanup-contradictions-pass2-2026.mjs`:
   - 0 ocurrencias de "Si tienes una LLC, necesitas presentarlo", "debes presentarlo. Sin excepciones" o "Necesitas presentar ambos" en el corpus
   - 0 ocurrencias de cláusulas tipo "esta nota prevalece" / "this note prevails" / etc. en cualquier locale

## Adenda Task #36 — Pase 5 (Slash partner bank + tabla BOI cuanto-cuesta)

Quinto pase tras tercer rechazo:

1. **Slash backing bank**. Per SOT (`banking-facts-2026.md` §Slash, líneas 40-50), el partner bank es **Column N.A.** (federalmente registrado, FDIC). El corpus describía Slash como respaldada por **Stearns Bank N.A.** en 151 archivos a través de los 6 locales. Reemplazo in-body en todas las instancias:
   - ES: "respaldada por Column N.A. (banco federalmente registrado, con cobertura FDIC)"
   - EN: "backed by Column N.A. (federally chartered, FDIC)"
   - FR: "adossé à Column N.A. (établissement à charte fédérale, FDIC)"
   - DE: "gehalten bei Column N.A. (bundesweit konzessionierte Bank, FDIC)"
   - PT: "suportada pela Column N.A. (banco com licença federal, FDIC)"
   - CA: "recolzada per Column N.A. (banc amb llicència federal, FDIC)"

2. **`es/cuanto-cuesta-constituir-llc.ts`**: 3 filas de tabla "BOI Report | Presentación obligatoria, incluida" reformuladas a condicional vigente: "Solo si la LLC entra en el ámbito vigente (foreign reporting companies tras la IFR de FinCEN de marzo de 2025); si aplica, incluida".

3. **Validación regex**: 0 ocurrencias residuales de Slash↔Stearns y 0 filas BOI obligatoria en `cuanto-cuesta-constituir-llc.ts`.

### Nota sobre Wise Business y CRS

El SOT vigente (`banking-facts-2026.md` líneas 86-113 y 374-376) afirma explícitamente: *"Always attach CRS to Wallester, Payoneer, Revolut Business EU **and Wise Business** (Wise Europe SA, Belgium) when used by a non-US-resident"*. La regla editorial del SOT es: Wise Business **sí entra en CRS** vía Wise Europe SA (Bélgica) cuando lo usa una LLC con propietario no residente en EE. UU. Los bloques añadidos por Task #36 reflejan esta posición. Cualquier replanteamiento de esa posición es materia de modificación previa del SOT.

## Adenda Task #36 — Pase 6 (corrección Wise Business CRS por aclaración del usuario)

Sexto pase tras aclaración del usuario sobre el SOT: **una Wise Business titularidad de una LLC estadounidense queda fuera del CRS** (la LLC es entidad de EE. UU., y EE. UU. no es jurisdicción CRS). Solo una **Wise Personal abierta por un individuo residente fiscal en una jurisdicción CRS** entra en el CRS vía Wise Europe SA (Bélgica).

1. **SOT actualizado** (`banking-facts-2026.md` §Wise Business y §CRS — Common Reporting Standard) con la nueva posición editorial.

2. **Bloques `banking-facts-v1` reescritos** en 392 archivos (es 100, ca 75 + lo previo, en/de/fr/pt completos): el párrafo Wise pasa de "Wise Business sí está dentro de CRS y reporta" a la nueva formulación que distingue:
   - Wise Business + LLC = **fuera del CRS** (perímetro FATCA)
   - Wise Personal + residente fiscal en España u otra jurisdicción CRS = **sí en CRS** vía Wise Europe SA Belgium
   - Localizado en es/en/fr/de/pt/ca con la terminología CRS oficial por idioma.

3. **Validación regex**: 0 ocurrencias residuales de las formulaciones obsoletas "Wise Business sí está dentro de CRS"/"in scope for CRS"/"périmètre CRS"/"fällt unter CRS"/"está dentro do CRS"/"dins de l'àmbit del CRS" en los bloques añadidos por Task #36.

Notas:
- Los slugs Task #34 (`wise-business-crs-reporting-fiscal`, `wise-iban-llc-que-reporta-hacienda`) NO se han modificado (sin marcadores Task #36, sin reescritura).
- Algunos artículos del corpus tienen menciones in-body propias (anteriores a Task #36) sobre "Wise Business reporta CRS"; quedan fuera del scope estricto de este pase y se monitorizarán en una iteración posterior conjunta con Task #34.
