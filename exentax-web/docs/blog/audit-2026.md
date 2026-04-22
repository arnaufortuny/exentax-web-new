# Auditoría integral del blog Exentax — 2026

**Fecha:** 2026-04-20  
**Alcance:** 100 artículos × 6 idiomas (600 ficheros) + FAQ.  
**Línea editorial fijada por el cliente:** pro-LLC, respaldo a Exentax, veracidad 2026, sin alarmismo, citación legal precisa, inclusión de CFC/TFI cuando aplique.  
**Naturaleza del documento:** sólo lectura — ningún contenido fue modificado en esta tarea.

## 0. Marco legal de referencia para reescrituras

Toda afirmación legal o regulatoria en el blog y la FAQ debe citar al menos una de estas fuentes reales (no inventar artículos):

**España:** Ley 35/2006 IRPF (LIRPF), Ley 27/2014 IS (LIS), Ley 58/2003 General Tributaria (LGT) — en particular art. 15 (conflicto en aplicación de la norma) y art. 16 (simulación), Real Decreto 1065/2007 (Reglamento General de Gestión e Inspección), Real Decreto 439/2007 (RIRPF), Modelo 720 (declaración de bienes en el extranjero, umbral 50.000 € por categoría — atención: STJUE C-788/19 de 27/01/2022 anuló el régimen sancionador específico, sustituido por Ley 5/2022), Modelo 232 (operaciones vinculadas), Modelo 721 (criptoactivos en el extranjero), Modelo 100 (IRPF), DGT consultas vinculantes, doctrina del TEAC, CDI España–EE.UU. (BOE 22/12/1990, Protocolo de 2013 en vigor desde 27/11/2019).

**EE.UU.:** Treas. Reg. §301.7701-1 a §301.7701-3 (check-the-box), IRC §882 (ECI de personas extranjeras), IRC §871 (FDAP), IRC §6038A y Treas. Reg. §1.6038A (Form 5472), Form 1120 pro forma, Corporate Transparency Act (31 USC §5336) y FinCEN BOI Rule (31 CFR §1010.380), Bank Secrecy Act, FATCA (IRC §1471–§1474), W-8BEN/W-8BEN-E.  
**Estados:** New Mexico LLC Act (NMSA §53-19), Wyoming LLC Act (Wyo. Stat. §17-29), Delaware LLC Act (6 Del. C. §18).

**EU/OCDE:** DAC6 (Directiva 2018/822, transpuesta por Ley 10/2020 y RD 243/2021), DAC7 (Directiva 2021/514), DAC8 (Directiva 2023/2226), ATAD I (2016/1164) y ATAD II (2017/952), CRS (Directiva 2014/107), OECD Model Tax Convention (Art. 5 establecimiento permanente, Art. 7 beneficios empresariales), BEPS Actions 5/6/7/13/15.

**CFC / Transparencia Fiscal Internacional (España):** art. 100 LIS y art. 91 LIRPF — aplica cuando la entidad no residente está sometida a baja tributación (< 75% de la que correspondería en España) y obtiene rentas pasivas; con la modificación de Ley 11/2021 (lucha contra el fraude) se reforzó su ámbito. **Una LLC operativa de servicios profesionales ejecutados por el socio residente en España normalmente NO encaja en el supuesto de CFC pasiva, pero la renta se imputa por atribución de rentas (art. 87 LIRPF) si la LLC se considera entidad en régimen de atribución.**

**Referencia "20 de febrero de 2020" del briefing:** ⚠️ **TO_VERIFY**. No se ha localizado en mi base de conocimiento un evento jurídico-fiscal español inequívoco de esa fecha exacta vinculado a LLCs o Modelo 720 (la sentencia del TJUE sobre Modelo 720 es **C-788/19, de 27/01/2022**; la STS sobre LLCs como entidades en atribución es de 2018). **Antes de citar esta fecha en cualquier artículo, debe verificarse manualmente** (BOE, CENDOJ, base de datos AEAT). No incluir hasta confirmación.

## 1. Resumen ejecutivo

| Métrica | Valor |
|---|---|
| Artículos catalogados | 100 |
| Idiomas soportados | es, en, ca, de, fr, pt |
| Contenido presente (ES) | 100 / 100 |
| Contenido presente (EN) | 100 / 100 |
| Contenido presente (CA) | 100 / 100 |
| Contenido presente (DE) | 100 / 100 |
| Contenido presente (FR) | 100 / 100 |
| Contenido presente (PT) | 100 / 100 |
| ES — mediana de palabras | 1750 |
| ES — artículos < 800 palabras | 0 (0%) |
| ES — artículos < 1200 palabras | 13 (13%) |
| ES — artículos con huecos de citación legal severos (3+ claims, 0 citas) | 7 |
| ES — artículos con probable necesidad de CFC sin mencionarlo | 0 |
| ES — referencias 2021-2025 sin "2026" | 7 |
| ES — títulos con em-dash o doble dos puntos | 0 |
| ES — meta-título / meta-descripción fuera de rango | 6 |
| FAQ — preguntas / respuestas | 76 / 76 |
| FAQ — claims legales detectados | 0 |
| FAQ — citas legales detectadas | 0 |

## 2. Cobertura de palabras (todos los idiomas)

| Idioma | n | min | p25 | mediana | p75 | max | < 800 |
|---|---:|---:|---:|---:|---:|---:|---:|
| ES | 100 | 846 | 1443 | 1750 | 2115 | 3218 | 0 |
| EN | 100 | 823 | 1113 | 1267 | 1591 | 3051 | 0 |
| CA | 100 | 319 | 878 | 1187 | 1606 | 2393 | 17 |
| DE | 100 | 315 | 812 | 1124 | 1497 | 2239 | 24 |
| FR | 100 | 417 | 951 | 1293 | 1734 | 2522 | 16 |
| PT | 100 | 333 | 871 | 1192 | 1583 | 2353 | 18 |

> Estándar mínimo objetivo: 800 palabras / artículo. Guías "completa" o "guía 2026" deben superar 1500.

## 3. Equilibrio de stack bancario en ES

Total de menciones en cuerpos ES y nº de artículos donde aparece cada marca:

| Banco / fintech | Menciones totales | Artículos donde aparece |
|---|---:|---:|
| Mercury | 467 | 79 |
| Slash | 147 | 51 |
| Wise | 443 | 73 |
| Relay | 202 | 55 |
| Wallester | 126 | 53 |
| Revolut | 141 | 47 |
| Brex | 4 | 2 |

**Lectura editorial:** Mercury sigue siendo la opción ancla por madurez (Column NA, FDIC pass-through hasta $5M con sweep), pero el cliente ha pedido **promover Slash, Wise Business y Relay** y **moderar el peso relativo de Mercury**. Acción en Task #2: en cada guía bancaria ofrecer trío Mercury + Relay + Slash, y para multi-divisa Wise Business + Wallester (IBAN euro). Mantener Revolut como complemento, no como núcleo.

## 4. Huecos de citación legal severos (ES)

Artículos que mencionan ≥3 áreas legales/regulatorias **sin ninguna cita verificable**. Prioridad alta para Task #2:

| # | Slug | Áreas legales mencionadas |
|---:|---|---|
| 1 | `dubai-uae-mito-no-impuestos` | ES-IRPF, ES-AEAT, ES-Residencia, ES-183d, ES-IVA, US-CheckTheBox, OECD-BEPS |
| 2 | `estructura-offshore-beneficios-riesgos` | ES-Modelo720, ES-AEAT, ES-sanciones, ES-Residencia, ES-TFI/CFC, US-FATCA, US-CheckTheBox, Treaty-CDI, OECD-BEPS, OECD-CRS |
| 3 | `empresa-reino-unido-uk-ltd` | ES-IRPF, ES-AEAT, ES-sanciones, ES-Residencia, ES-IVA, US-5472, US-CheckTheBox, Treaty-CDI |
| 4 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | ES-sanciones, US-IRS, US-CTA/BOI, US-RegisteredAgent |
| 5 | `recuperar-llc-boi-5472-atrasados-procedimiento` | ES-AEAT, ES-sanciones, US-5472, US-IRS, US-CTA/BOI, US-RegisteredAgent |
| 6 | `single-member-multi-member-llc-implicaciones-fiscales` | ES-IRPF, ES-sanciones, ES-Residencia, ES-TFI/CFC, US-5472, US-7004, US-ECI, US-IRS, US-CTA/BOI, US-CheckTheBox |
| 7 | `vender-o-cerrar-llc-comparativa-practica` | ES-sanciones, US-ECI, US-IRS, US-CTA/BOI |

## 5. CFC / TFI: artículos donde falta y probablemente debería estar

El cliente exige tratar CFC rules. Estos artículos hablan de residencia / autónomo en España / estructuras / nómadas / jurisdicciones de baja tributación, pero **no mencionan CFC ni transparencia fiscal internacional**:

_Ninguno detectado._

**Recomendación de bloque-tipo (≤120 palabras) a insertar donde aplique:**

> "Si tu LLC es operativa (servicios reales que tú prestas) y tributa en EE.UU. como entidad transparente, en España las rentas no se imputan por el régimen de **transparencia fiscal internacional** (art. 100 LIS / art. 91 LIRPF), porque ese régimen aplica fundamentalmente a entidades que generan rentas pasivas con baja tributación. Lo que sí ocurre es que esos beneficios se integran en tu IRPF por **atribución de rentas** (art. 87 LIRPF), tributando como rendimientos de actividad económica. Esto **no es elusión**, es la mecánica que la propia normativa española prevé para entidades extranjeras consideradas transparentes."

## 6. Veracidad 2026 — referencias temporales obsoletas

Artículos que contienen años 2021-2025 sin actualización a 2026:

- `autonomo-espana-vs-llc-estados-unidos` (3 ocurrencias)
- `llc-desarrolladores-software-saas` (2 ocurrencias)
- `boi-report-fincen-guia-completa-2026` (4 ocurrencias)
- `llc-interactive-brokers-invertir-bolsa-usa` (2 ocurrencias)
- `convenio-doble-imposicion-usa-espana-llc` (2 ocurrencias)
- `llc-unica-estructura-holding-cuando-como-cuesta` (2 ocurrencias)
- `fiscalidad-socios-llc-cambio-residencia-mid-year` (2 ocurrencias)

## 7. Framing pro-LLC — riesgo de tono perjudicial

Artículos donde aparecen términos potencialmente negativos (ilegal, opaco, evasión, ocultar, paraíso fiscal). **Revisar contexto** — pueden ser usos defensivos correctos (p. ej. "no es opaco frente a las autoridades"), pero deben quedar enmarcados de forma que defiendan la legalidad de la LLC:

| Slug | Términos negativos | Términos positivos |
|---|---:|---:|
| `llc-estados-unidos-guia-completa-2026` | 5 | 2 |
| `form-5472-que-es-como-presentarlo` | 1 | 2 |
| `nuevo-mexico-vs-wyoming-vs-delaware` | 1 | 2 |
| `cuenta-bancaria-mercury-llc-extranjero` | 1 | 2 |
| `autonomo-espana-vs-llc-estados-unidos` | 1 | 2 |
| `impuestos-clientes-internacionales-espana` | 1 | 2 |
| `pagar-cero-impuestos-legalmente-llc` | 4 | 2 |
| `nomada-digital-residencia-fiscal` | 1 | 2 |
| `errores-fiscales-freelancers-espanoles` | 1 | 2 |
| `operating-agreement-llc-que-es` | 1 | 2 |
| `mantenimiento-anual-llc-obligaciones` | 1 | 2 |
| `residentes-no-residentes-llc-diferencias` | 1 | 2 |
| `constituir-llc-proceso-paso-a-paso` | 1 | 2 |
| `autonomos-espana-por-que-dejar-de-serlo` | 1 | 2 |
| `bancos-vs-fintech-llc-donde-abrir-cuenta` | 2 | 2 |
| `ventajas-desventajas-llc-no-residentes` | 1 | 2 |
| `llc-seguridad-juridica-proteccion-patrimonial` | 2 | 2 |
| `llc-desarrolladores-software-saas` | 1 | 2 |
| `escalar-negocio-digital-llc-americana` | 1 | 2 |
| `due-diligence-bancario-llc-americana` | 1 | 2 |
| `estructura-fiscal-optima-freelancer-internacional` | 1 | 2 |
| `prevencion-blanqueo-capitales-llc` | 3 | 2 |
| `fiscalidad-internacional-emprendedores-digitales` | 1 | 2 |
| `tributacion-pass-through-llc-como-funciona` | 1 | 2 |
| `problemas-comunes-llc-como-evitarlos` | 1 | 2 |
| `fiscalidad-llc-por-pais-residencia` | 1 | 2 |
| `crs-cuentas-bancarias-llc-intercambio-informacion` | 2 | 2 |
| `privacidad-llc-americana-secreto-ventaja` | 2 | 2 |
| `boi-report-fincen-guia-completa-2026` | 1 | 2 |
| `testaferros-prestanombres-llc-ilegal-riesgos` | 4 | 2 |
| `por-que-no-abrir-empresa-estonia` | 1 | 2 |
| `crs-residentes-espana-latam-implicaciones` | 5 | 2 |
| `revolut-business-crs-reporting-fiscal` | 3 | 2 |
| `wise-business-crs-reporting-fiscal` | 1 | 2 |
| `wise-iban-llc-que-reporta-hacienda` | 3 | 2 |
| `visa-mastercard-reporting-tarjetas-hacienda` | 1 | 2 |
| `dac7-plataformas-digitales-reporting-2026` | 2 | 2 |
| `dac8-criptomonedas-reporting-fiscal-2026` | 2 | 2 |
| `boe-febrero-2020-llc-doctrina-administrativa` | 2 | 2 |
| `riesgos-fiscales-mala-estructuracion-internacional` | 1 | 2 |
| `diseno-estructura-fiscal-internacional-solida` | 2 | 2 |
| `tengo-llc-checklist-gestion-correcta` | 1 | 2 |
| `errores-criticos-llc-ya-constituida` | 1 | 2 |
| `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | 4 | 3 |
| `llc-interactive-brokers-invertir-bolsa-usa` | 1 | 2 |
| `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | 1 | 2 |
| `llc-alternativa-autonomo-espana` | 2 | 2 |
| `w8-ben-y-w8-ben-e-guia-completa` | 2 | 2 |
| `convenio-doble-imposicion-usa-espana-llc` | 2 | 2 |
| `como-obtener-itin-numero-fiscal-irs` | 1 | 2 |
| _y 13 más_ | | |

## 8. Títulos con em-dash o doble dos puntos

El cliente quiere **menos em-dashes y menos títulos en cascada**. Candidatos a reescribir título y metaTitle:

_Ninguno._

## 9. SEO — meta-título / meta-descripción fuera de rango (ES)

Rangos objetivo: metaTitle 30-65 caracteres, metaDescription 110-165 caracteres.

| Slug | Incidencias |
|---|---|
| `errores-fiscales-freelancers-espanoles` | metaDesc 99ch |
| `boe-febrero-2020-llc-doctrina-administrativa` | metaDesc 92ch |
| `llc-alternativa-autonomo-espana` | metaDesc 173ch |
| `w8-ben-y-w8-ben-e-guia-completa` | metaDesc 184ch |
| `convenio-doble-imposicion-usa-espana-llc` | metaDesc 189ch |
| `justificar-origen-fondos-kyc-bancario-segunda-ronda` | metaTitle 0ch, metaDesc 0ch |

## 10. Paridad de traducciones

### EN — faltantes: 0
_OK._

### CA — faltantes: 0
_OK._

### DE — faltantes: 0
_OK._

### FR — faltantes: 0
_OK._

### PT — faltantes: 0
_OK._

## 11. CTAs e enlazado interno

- Artículos ES sin ningún CTA detectado (Exentax / contacto / precios / calculadora / "reserva"): **0**
- Artículos ES con < 3 enlaces internos: **3**

**Pocos enlaces internos (primeros 30):**
- `due-diligence-bancario-llc-americana` (2 enlaces)
- `cuentas-bancarias-usa-reportan-hacienda-verdad` (2 enlaces)
- `llc-interactive-brokers-invertir-bolsa-usa` (1 enlaces)

## 12. FAQ — análisis específico

- Preguntas detectadas: **76**
- Respuestas detectadas: **76**
- Áreas legales mencionadas en respuestas: _ninguna_
- Citas legales formales detectadas: **0** — la FAQ debe citar al menos LIRPF, LIS, LGT, Treas. Reg. §301.7701-3, CDI España-EE.UU. y CTA/BOI

## 13. Plan de prioridades sugerido (entrada a Task #2)

**Tier S — máxima prioridad** (artículos pilar, alto tráfico potencial, alto riesgo legal sin citar):
- `llc-estados-unidos-guia-completa-2026`
- `form-5472-que-es-como-presentarlo`
- `pagar-cero-impuestos-legalmente-llc`
- `autonomo-espana-vs-llc-estados-unidos`
- `tributacion-pass-through-llc-como-funciona`
- `residentes-no-residentes-llc-diferencias`
- `fiscalidad-internacional-emprendedores-digitales`
- `nomada-digital-residencia-fiscal`
- `ventajas-desventajas-llc-no-residentes`
- `constituir-llc-proceso-paso-a-paso`

**Tier A — alta prioridad** (compliance fundamental):
- `ein-numero-fiscal-llc-como-obtenerlo`
- `operating-agreement-llc-que-es`
- `mantenimiento-anual-llc-obligaciones`
- `registered-agent-que-es-por-que-necesitas`
- `prevencion-blanqueo-capitales-llc`
- `que-es-irs-guia-duenos-llc`
- `cuanto-cuesta-constituir-llc`
- `extension-irs-form-1120-como-solicitarla`
- `itin-ssn-que-son-como-obtenerlos`
- `nuevo-mexico-vs-wyoming-vs-delaware`

**Tier B — media prioridad** (banca, operativa, vertical-specific). Resto del catálogo, agrupado por bloques:
- **Banca y pagos:** cuenta-bancaria-mercury-llc-extranjero, bancos-vs-fintech-llc-donde-abrir-cuenta, evitar-bloqueos-mercury-wise-revolut, wise-business-llc-guia, pasarelas-pago-llc-stripe-paypal-dodo, due-diligence-bancario-llc-americana, tiempos-pagos-ach-wire-transfer, iban-swift-routing-number-que-son, cambiar-divisas-llc-mejores-opciones.
- **Verticales:** llc-creadores-contenido-youtube-twitch, llc-agencias-marketing-digital, llc-desarrolladores-software-saas, amazon-ecommerce-llc-vender-online, criptomonedas-trading-llc-impuestos.
- **Operativa España:** errores-fiscales-freelancers-espanoles, autonomos-espana-por-que-dejar-de-serlo, impuestos-clientes-internacionales-espana, iva-servicios-digitales-internacional.
- **Resto:** todos los demás slugs hasta completar los 100.

## 14. Estándar editorial obligatorio para Task #2 (a aplicar artículo por artículo)

1. **Pro-LLC, pro-Exentax, sin alarmismo.** Toda afirmación de riesgo debe ir acompañada de "y así es como Exentax lo gestiona correctamente".
2. **Citar la ley.** Cada afirmación legal lleva una referencia real (ver §0). Si una afirmación no se puede sostener con norma, se reformula o se elimina.
3. **2026 en todas las cifras y fechas.** Umbrales, plazos, formularios, tipos impositivos: revisar y datar.
4. **CFC/TFI tratado correctamente:** distinguir entre TFI (rentas pasivas, art. 100 LIS / art. 91 LIRPF) y atribución de rentas (art. 87 LIRPF) para LLCs operativas.
5. **Elusión lícita ≠ evasión.** Citar art. 15 LGT (conflicto en aplicación de la norma) y art. 16 LGT (simulación) cuando se hable de planificación.
6. **Hacienda con precisión.** Modelo 720 (50.000 €/categoría, régimen sancionador post-STJUE C-788/19), Modelo 232 (vinculadas), Modelo 721 (cripto en el extranjero).
7. **Stack bancario equilibrado:** Mercury + Relay + Slash en banca operativa USD; Wise Business + Wallester en multi-divisa; Revolut como complemento.
8. **Mínimo 800 palabras**, 1500 para guías "completas".
9. **3+ enlaces internos** y **1 CTA explícito a Exentax** (precios, contacto o calculadora) por artículo.
10. **Títulos sin em-dash y como máximo un dos puntos**. MetaTitle 30-65 ch, metaDescription 110-165 ch.
11. **No tocar la fecha "20 de febrero de 2020"** del briefing hasta verificarla manualmente.
12. **FAQ:** reescribir incluyendo citas a LIRPF, LIS, LGT, Treas. Reg. §301.7701-3, CDI España-EE.UU., 31 USC §5336 (CTA/BOI).

## 15. Anexo — métricas por artículo (ES)

| # | Slug | Palabras | Claims | Citas | Cob. | Enl. int. | CTA | 2026 | Stale | CFC | em-dash |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|:-:|:-:|
| 1 | `llc-estados-unidos-guia-completa-2026` | 2728 | 25 | 7 | 0.28 | 12 | 5 | 2 | 6 | ✓ | · |
| 2 | `form-5472-que-es-como-presentarlo` | 2054 | 22 | 7 | 0.32 | 8 | 5 | 4 | 6 | ✓ | · |
| 3 | `nuevo-mexico-vs-wyoming-vs-delaware` | 1796 | 22 | 7 | 0.32 | 10 | 5 | 2 | 6 | ✓ | · |
| 4 | `separar-dinero-personal-llc-por-que-importa` | 2996 | 18 | 6 | 0.33 | 8 | 5 | 2 | 4 | ✓ | · |
| 5 | `ein-numero-fiscal-llc-como-obtenerlo` | 1487 | 18 | 6 | 0.33 | 5 | 5 | 2 | 4 | ✓ | · |
| 6 | `cuenta-bancaria-mercury-llc-extranjero` | 2595 | 21 | 7 | 0.33 | 6 | 5 | 2 | 6 | ✓ | · |
| 7 | `autonomo-espana-vs-llc-estados-unidos` | 2251 | 21 | 3 | 0.14 | 7 | 5 | 0 | 3 | ✓ | · |
| 8 | `impuestos-clientes-internacionales-espana` | 1903 | 23 | 7 | 0.3 | 4 | 5 | 2 | 6 | ✓ | · |
| 9 | `pagar-cero-impuestos-legalmente-llc` | 2115 | 24 | 7 | 0.29 | 7 | 5 | 3 | 8 | ✓ | · |
| 10 | `nomada-digital-residencia-fiscal` | 2408 | 21 | 7 | 0.33 | 8 | 5 | 4 | 7 | ✓ | · |
| 11 | `criptomonedas-trading-llc-impuestos` | 1443 | 18 | 6 | 0.33 | 3 | 5 | 2 | 5 | ✓ | · |
| 12 | `iva-servicios-digitales-internacional` | 1112 | 2 | 0 | 0 | 3 | 5 | 0 | 0 | · | · |
| 13 | `registered-agent-que-es-por-que-necesitas` | 1750 | 18 | 6 | 0.33 | 3 | 5 | 2 | 4 | ✓ | · |
| 14 | `errores-fiscales-freelancers-espanoles` | 2166 | 22 | 7 | 0.32 | 5 | 5 | 3 | 6 | ✓ | · |
| 15 | `como-operar-llc-dia-a-dia` | 2305 | 18 | 6 | 0.33 | 7 | 5 | 2 | 4 | ✓ | · |
| 16 | `operating-agreement-llc-que-es` | 2216 | 22 | 7 | 0.32 | 5 | 5 | 2 | 6 | ✓ | · |
| 17 | `documentos-llc-cuales-necesitas` | 1595 | 18 | 6 | 0.33 | 5 | 5 | 2 | 6 | ✓ | · |
| 18 | `mantenimiento-anual-llc-obligaciones` | 1538 | 20 | 6 | 0.3 | 11 | 5 | 2 | 4 | ✓ | · |
| 19 | `wise-business-llc-guia` | 1438 | 2 | 0 | 0 | 6 | 5 | 0 | 0 | · | · |
| 20 | `pasarelas-pago-llc-stripe-paypal-dodo` | 1071 | 1 | 0 | 0 | 5 | 5 | 0 | 0 | · | · |
| 21 | `amazon-ecommerce-llc-vender-online` | 1123 | 1 | 0 | 0 | 4 | 5 | 0 | 0 | · | · |
| 22 | `gastos-deducibles-llc-que-puedes-deducir` | 1816 | 18 | 6 | 0.33 | 5 | 5 | 2 | 4 | ✓ | · |
| 23 | `residentes-no-residentes-llc-diferencias` | 1530 | 23 | 7 | 0.3 | 5 | 5 | 2 | 6 | ✓ | · |
| 24 | `cambiar-divisas-llc-mejores-opciones` | 1108 | 0 | 0 | – | 4 | 5 | 0 | 0 | · | · |
| 25 | `constituir-llc-proceso-paso-a-paso` | 1950 | 21 | 7 | 0.33 | 5 | 5 | 2 | 7 | ✓ | · |
| 26 | `autonomos-espana-por-que-dejar-de-serlo` | 1882 | 23 | 7 | 0.3 | 5 | 5 | 2 | 7 | ✓ | · |
| 27 | `bancos-vs-fintech-llc-donde-abrir-cuenta` | 1231 | 0 | 0 | – | 3 | 5 | 0 | 0 | · | · |
| 28 | `tiempos-pagos-ach-wire-transfer` | 1154 | 0 | 0 | – | 5 | 5 | 0 | 0 | · | · |
| 29 | `iban-swift-routing-number-que-son` | 1220 | 0 | 0 | – | 3 | 5 | 0 | 0 | · | · |
| 30 | `cuanto-cuesta-constituir-llc` | 1245 | 21 | 6 | 0.29 | 4 | 5 | 2 | 4 | ✓ | · |
| 31 | `ventajas-desventajas-llc-no-residentes` | 2042 | 21 | 7 | 0.33 | 6 | 5 | 3 | 6 | ✓ | · |
| 32 | `evitar-bloqueos-mercury-wise-revolut` | 927 | 2 | 0 | 0 | 5 | 5 | 0 | 0 | · | · |
| 33 | `que-es-irs-guia-duenos-llc` | 1472 | 20 | 6 | 0.3 | 4 | 5 | 2 | 4 | ✓ | · |
| 34 | `llc-seguridad-juridica-proteccion-patrimonial` | 1590 | 18 | 6 | 0.33 | 6 | 5 | 2 | 4 | ✓ | · |
| 35 | `llc-creadores-contenido-youtube-twitch` | 1276 | 20 | 6 | 0.3 | 3 | 5 | 2 | 4 | ✓ | · |
| 36 | `llc-agencias-marketing-digital` | 1204 | 20 | 6 | 0.3 | 3 | 5 | 2 | 4 | ✓ | · |
| 37 | `primer-mes-llc-que-esperar` | 1525 | 19 | 6 | 0.32 | 3 | 5 | 2 | 4 | ✓ | · |
| 38 | `llc-desarrolladores-software-saas` | 1320 | 13 | 2 | 0.15 | 3 | 5 | 0 | 2 | ✓ | · |
| 39 | `escalar-negocio-digital-llc-americana` | 1650 | 22 | 7 | 0.32 | 7 | 5 | 2 | 6 | ✓ | · |
| 40 | `due-diligence-bancario-llc-americana` | 1336 | 2 | 0 | 0 | 2 | 5 | 0 | 0 | · | · |
| 41 | `estructura-fiscal-optima-freelancer-internacional` | 1643 | 22 | 7 | 0.32 | 9 | 5 | 2 | 6 | ✓ | · |
| 42 | `prevencion-blanqueo-capitales-llc` | 1115 | 18 | 6 | 0.33 | 6 | 5 | 3 | 4 | ✓ | · |
| 43 | `fiscalidad-internacional-emprendedores-digitales` | 1705 | 22 | 7 | 0.32 | 12 | 5 | 3 | 6 | ✓ | · |
| 44 | `extension-irs-form-1120-como-solicitarla` | 1306 | 19 | 6 | 0.32 | 6 | 5 | 2 | 4 | ✓ | · |
| 45 | `itin-ssn-que-son-como-obtenerlos` | 1639 | 18 | 6 | 0.33 | 7 | 5 | 2 | 4 | ✓ | · |
| 46 | `tributacion-pass-through-llc-como-funciona` | 1598 | 22 | 6 | 0.27 | 10 | 5 | 2 | 4 | ✓ | · |
| 47 | `por-que-abrir-llc-estados-unidos-ventajas` | 1936 | 20 | 6 | 0.3 | 12 | 5 | 4 | 4 | ✓ | · |
| 48 | `problemas-comunes-llc-como-evitarlos` | 2075 | 21 | 6 | 0.29 | 12 | 5 | 2 | 5 | ✓ | · |
| 49 | `fiscalidad-llc-por-pais-residencia` | 1873 | 22 | 7 | 0.32 | 9 | 5 | 3 | 6 | ✓ | · |
| 50 | `crs-cuentas-bancarias-llc-intercambio-informacion` | 1569 | 21 | 6 | 0.29 | 11 | 5 | 3 | 4 | ✓ | · |
| 51 | `cuentas-bancarias-usa-reportan-hacienda-verdad` | 1830 | 21 | 6 | 0.29 | 2 | 5 | 2 | 4 | ✓ | · |
| 52 | `privacidad-llc-americana-secreto-ventaja` | 1714 | 19 | 6 | 0.32 | 9 | 5 | 3 | 4 | ✓ | · |
| 53 | `boi-report-fincen-guia-completa-2026` | 846 | 3 | 1 | 0.33 | 5 | 5 | 0 | 4 | · | · |
| 54 | `testaferros-prestanombres-llc-ilegal-riesgos` | 1587 | 21 | 7 | 0.33 | 8 | 5 | 3 | 6 | ✓ | · |
| 55 | `por-que-no-abrir-empresa-estonia` | 2700 | 23 | 7 | 0.3 | 13 | 5 | 4 | 6 | ✓ | · |
| 56 | `crs-residentes-espana-latam-implicaciones` | 1853 | 13 | 3 | 0.23 | 13 | 5 | 1 | 3 | ✓ | · |
| 57 | `revolut-business-crs-reporting-fiscal` | 1910 | 15 | 3 | 0.2 | 10 | 5 | 4 | 4 | ✓ | · |
| 58 | `wise-business-crs-reporting-fiscal` | 1739 | 13 | 3 | 0.23 | 7 | 5 | 3 | 4 | ✓ | · |
| 59 | `wise-iban-llc-que-reporta-hacienda` | 2917 | 20 | 7 | 0.35 | 12 | 5 | 5 | 6 | ✓ | · |
| 60 | `visa-mastercard-reporting-tarjetas-hacienda` | 3218 | 22 | 7 | 0.32 | 7 | 5 | 3 | 6 | ✓ | · |
| 61 | `dac7-plataformas-digitales-reporting-2026` | 1795 | 18 | 3 | 0.17 | 9 | 5 | 4 | 12 | ✓ | · |
| 62 | `dac8-criptomonedas-reporting-fiscal-2026` | 1559 | 18 | 6 | 0.33 | 6 | 5 | 12 | 14 | ✓ | · |
| 63 | `boe-febrero-2020-llc-doctrina-administrativa` | 1928 | 16 | 4 | 0.25 | 7 | 5 | 1 | 2 | ✓ | · |
| 64 | `tributacion-llc-segun-actividad-economica` | 1401 | 10 | 2 | 0.2 | 12 | 5 | 3 | 0 | ✓ | · |
| 65 | `riesgos-fiscales-mala-estructuracion-internacional` | 1512 | 16 | 2 | 0.13 | 11 | 5 | 1 | 0 | ✓ | · |
| 66 | `diseno-estructura-fiscal-internacional-solida` | 1977 | 22 | 6 | 0.27 | 20 | 5 | 3 | 4 | ✓ | · |
| 67 | `tengo-llc-checklist-gestion-correcta` | 2465 | 22 | 7 | 0.32 | 10 | 5 | 5 | 7 | ✓ | · |
| 68 | `errores-criticos-llc-ya-constituida` | 2763 | 23 | 7 | 0.3 | 8 | 5 | 5 | 7 | ✓ | · |
| 69 | `wise-bancos-llc-stack-bancaria-completa` | 2858 | 18 | 6 | 0.33 | 10 | 5 | 2 | 4 | ✓ | · |
| 70 | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | 2107 | 24 | 7 | 0.29 | 3 | 5 | 2 | 6 | ✓ | · |
| 71 | `irs-1120-5472-que-son-cuando-aplican` | 1978 | 20 | 6 | 0.3 | 5 | 5 | 3 | 4 | ✓ | · |
| 72 | `que-pasa-si-no-presentas-5472-multas-irs` | 2478 | 20 | 6 | 0.3 | 7 | 5 | 5 | 4 | ✓ | · |
| 73 | `llc-interactive-brokers-invertir-bolsa-usa` | 1956 | 15 | 3 | 0.2 | 1 | 5 | 0 | 2 | ✓ | · |
| 74 | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | 2620 | 15 | 3 | 0.2 | 10 | 5 | 5 | 9 | ✓ | · |
| 75 | `llc-alternativa-autonomo-espana` | 2816 | 27 | 7 | 0.26 | 4 | 5 | 4 | 6 | ✓ | · |
| 76 | `w8-ben-y-w8-ben-e-guia-completa` | 2968 | 22 | 7 | 0.32 | 5 | 5 | 2 | 6 | ✓ | · |
| 77 | `convenio-doble-imposicion-usa-espana-llc` | 2485 | 20 | 2 | 0.1 | 4 | 5 | 0 | 2 | ✓ | · |
| 78 | `como-obtener-itin-numero-fiscal-irs` | 3101 | 21 | 7 | 0.33 | 4 | 5 | 3 | 6 | ✓ | · |
| 79 | `como-disolver-cerrar-llc-paso-a-paso` | 3056 | 22 | 7 | 0.32 | 4 | 5 | 2 | 6 | ✓ | · |
| 80 | `bookkeeping-llc-paso-a-paso` | 2658 | 22 | 7 | 0.32 | 5 | 5 | 2 | 6 | ✓ | · |
| 81 | `hong-kong-offshore-realidad` | 2232 | 19 | 7 | 0.37 | 4 | 5 | 5 | 8 | ✓ | · |
| 82 | `empresa-bulgaria-10-tributacion` | 2221 | 21 | 7 | 0.33 | 3 | 5 | 3 | 6 | ✓ | · |
| 83 | `empresa-panama-fiscalidad-residencia` | 1799 | 17 | 6 | 0.35 | 3 | 5 | 3 | 6 | ✓ | · |
| 84 | `dubai-uae-mito-no-impuestos` | 1566 | 7 | 0 | 0 | 3 | 5 | 1 | 9 | · | · |
| 85 | `fiscalidad-estonia-como-funciona` | 1991 | 13 | 2 | 0.15 | 4 | 5 | 2 | 4 | ✓ | · |
| 86 | `estructura-offshore-beneficios-riesgos` | 1558 | 10 | 0 | 0 | 4 | 5 | 2 | 0 | ✓ | · |
| 87 | `holding-empresarial-como-funciona` | 1992 | 14 | 3 | 0.21 | 3 | 5 | 1 | 2 | ✓ | · |
| 88 | `caminos-legales-minimos-impuestos` | 2011 | 17 | 2 | 0.12 | 4 | 5 | 1 | 3 | ✓ | · |
| 89 | `crear-empresa-andorra-ventajas` | 2009 | 17 | 2 | 0.12 | 4 | 5 | 1 | 2 | ✓ | · |
| 90 | `empresa-reino-unido-uk-ltd` | 1681 | 8 | 0 | 0 | 3 | 5 | 1 | 4 | · | · |
| 91 | `auditoria-rapida-llc-12-puntos-30-minutos` | 1051 | 10 | 1 | 0.1 | 5 | 5 | 2 | 0 | · | · |
| 92 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | 1060 | 4 | 0 | 0 | 5 | 5 | 0 | 0 | · | · |
| 93 | `llc-unica-estructura-holding-cuando-como-cuesta` | 1494 | 15 | 2 | 0.13 | 5 | 5 | 0 | 2 | ✓ | · |
| 94 | `recuperar-llc-boi-5472-atrasados-procedimiento` | 1106 | 6 | 0 | 0 | 5 | 5 | 1 | 0 | · | · |
| 95 | `reorganizar-banca-llc-mercury-relay-wise` | 1381 | 2 | 0 | 0 | 5 | 5 | 0 | 0 | · | · |
| 96 | `documentar-separacion-fondos-llc-historial` | 1139 | 2 | 0 | 0 | 5 | 5 | 0 | 0 | · | · |
| 97 | `single-member-multi-member-llc-implicaciones-fiscales` | 1149 | 10 | 0 | 0 | 5 | 5 | 0 | 0 | ✓ | · |
| 98 | `vender-o-cerrar-llc-comparativa-practica` | 1221 | 4 | 0 | 0 | 6 | 5 | 0 | 0 | · | · |
| 99 | `fiscalidad-socios-llc-cambio-residencia-mid-year` | 1714 | 17 | 2 | 0.12 | 5 | 5 | 0 | 2 | ✓ | · |
| 100 | `justificar-origen-fondos-kyc-bancario-segunda-ronda` | 1486 | 1 | 0 | 0 | 5 | 5 | 0 | 0 | · | · |

---
_Informe generado por `scripts/blog-audit-2026.mjs`. No modifica contenido. Próximo paso: aprobar Task #2 con el estándar editorial de §14 incorporado._