# PRIORITY-QUEUE — Cola de los 111 artículos ES

> **Cardinalidad confirmada (2026-04-26):** 111 slugs = 74 FALLA + 37 PASA. A 4 slugs por sprint el reparto exacto es **19 sprints rewrite** (4 slugs cada uno excepto sprint 19 con 2) + **10 sprints polish** (4 slugs cada uno excepto sprint 29 con 1) = **29 sprints**, decisión validada con PM y reflejada en `sprints/SPRINT-PLAN.md`.
>
> Generada del audit `docs/audits/2026-04/conversion/audit-es.json` (2026-04-26).  
> Ordenada por score: `(traffic + 1) × failures` para FALLA y `traffic × 0.5` para PASA.  
> **Justificación de la fórmula** (vs. el `traffic × failure-distance` originalmente propuesto): el campo `failure-distance` no existe en el JSON del audit; el modelo expone únicamente `traffic` (visitas mensuales estimadas) y `failures` (lista de motivos por los que el slug suspende los 7 criterios). El `+1` evita anular slugs sin tráfico medido pero con múltiples FALLA críticas. **Desviación aceptada formalmente por PM al cierre de Task #26 (2026-04-26)** — registrada en este documento para auditoría futura.  
> Asignación a sprints en `docs/editorial/sprints/SPRINT-PLAN.md`.

### URL-verification provenance

Las URLs de `SOURCES-BY-JURISDICTION.md` se validaron HEAD 200 al cierre de Task #26 (2026-04-26). Reemplazos aplicados en esta ronda:

| URL anterior | Estado | Reemplazo |
|---|---|---|
| `https://www.fincen.gov/news/news-releases/notice-regarding-beneficial-ownership-information-reporting` | 404 | `https://www.fincen.gov/boi` |
| `https://www.supremecourt.uk/cases/uksc-2014-0058.html` | 404 | `https://www.gov.uk/hmrc-internal-manuals/international-manual/intm180030` (HMRC manual cita Anson) |

Antes de cada sprint, ejecutar HEAD-check sobre las URLs que se vayan a citar (ver checklist en `sprints/SPRINT-LOG.md`, bloque "Pre-flight").

## Resumen

- **Total:** 111 artículos (excluido `cuanto-cuesta-constituir-llc`, cerrado en Task #1).
- **rewrite-completo (FALLA):** 74 → sprints 1–19.
- **polish-verificacion (PASA):** 37 → sprints 20–29.
- **Sprints totales:** 29 (4 slugs por sprint, último puede tener menos).

## Tabla completa

| # | Slug | Cat | WC | Verdict | Tipo | Sprint | Fallos | Tráfico | Score |
|---:|---|---|---:|---|---|---:|---|---:|---:|
| 1 | `residentes-no-residentes-llc-diferencias` | Fiscalidad | 2363 | FALLA | rewrite-completo | 1 | gancho-generico, datos-sin-fuente, longitud-insuficiente | 33 | 102 |
| 2 | `diferencia-llc-corporation-s-corp-c-corp` | Comparativas | 2266 | FALLA | rewrite-completo | 1 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 25 | 78 |
| 3 | `iva-servicios-digitales-internacional` | Fiscalidad | 2102 | FALLA | rewrite-completo | 1 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 19 | 60 |
| 4 | `llc-estados-unidos-guia-completa-2026` | Guías | 4106 | FALLA | rewrite-completo | 1 | gancho-generico | 55 | 56 |
| 5 | `form-5472-que-es-como-presentarlo` | Compliance | 2907 | FALLA | rewrite-completo | 2 | datos-sin-fuente | 54 | 55 |
| 6 | `boi-report-fincen-guia-completa-2026` | Compliance | 2634 | FALLA | rewrite-completo | 2 | objeciones-no-resueltas, datos-sin-fuente | 25 | 52 |
| 7 | `como-obtener-itin-numero-fiscal-irs` | Compliance | 4324 | FALLA | rewrite-completo | 2 | objeciones-no-resueltas, datos-sin-fuente | 25 | 52 |
| 8 | `cuota-autonomo-2026` | Fiscalidad | 1247 | FALLA | rewrite-completo | 2 | objeciones-no-resueltas, longitud-insuficiente | 25 | 52 |
| 9 | `cuotas-autonomos-2026-guia-completa` | Fiscalidad | 2013 | FALLA | rewrite-completo | 3 | objeciones-no-resueltas, longitud-insuficiente | 25 | 52 |
| 10 | `ein-numero-fiscal-llc-como-obtenerlo` | Guías | 2721 | FALLA | rewrite-completo | 3 | datos-sin-fuente | 51 | 52 |
| 11 | `cuenta-bancaria-mercury-llc-extranjero` | Herramientas | 4595 | FALLA | rewrite-completo | 3 | gancho-generico | 50 | 51 |
| 12 | `mantenimiento-anual-llc-obligaciones` | Compliance | 3267 | FALLA | rewrite-completo | 3 | exentax-forzado | 38 | 39 |
| 13 | `como-operar-llc-dia-a-dia` | Operativa | 3744 | FALLA | rewrite-completo | 4 | gancho-generico, objeciones-no-resueltas | 16 | 34 |
| 14 | `separar-dinero-personal-llc-por-que-importa` | Operativa | 4389 | FALLA | rewrite-completo | 4 | gancho-generico | 27 | 28 |
| 15 | `itin-ssn-que-son-como-obtenerlos` | Guías | 2857 | FALLA | rewrite-completo | 4 | datos-sin-fuente | 25 | 26 |
| 16 | `tributacion-pass-through-llc-como-funciona` | Fiscalidad | 2392 | FALLA | rewrite-completo | 4 | longitud-insuficiente | 25 | 26 |
| 17 | `wise-business-llc-guia` | Herramientas | 2340 | FALLA | rewrite-completo | 5 | datos-sin-fuente, longitud-insuficiente | 12 | 26 |
| 18 | `amazon-ecommerce-llc-vender-online` | Operativa | 2247 | FALLA | rewrite-completo | 5 | datos-sin-fuente, longitud-insuficiente | 10 | 22 |
| 19 | `criptomonedas-trading-llc-impuestos` | Fiscalidad | 2805 | FALLA | rewrite-completo | 5 | datos-sin-fuente | 20 | 21 |
| 20 | `gastos-deducibles-llc-que-puedes-deducir` | Fiscalidad | 3048 | FALLA | rewrite-completo | 5 | objeciones-no-resueltas, datos-sin-fuente | 9 | 20 |
| 21 | `cambiar-divisas-llc-mejores-opciones` | Operativa | 2248 | FALLA | rewrite-completo | 6 | objeciones-no-resueltas, longitud-insuficiente | 7 | 16 |
| 22 | `pasarelas-pago-llc-stripe-paypal-dodo` | Herramientas | 2202 | FALLA | rewrite-completo | 6 | longitud-insuficiente | 11 | 12 |
| 23 | `bancos-vs-fintech-llc-donde-abrir-cuenta` | Herramientas | 2307 | FALLA | rewrite-completo | 6 | datos-sin-fuente, longitud-insuficiente | 4 | 10 |
| 24 | `iban-swift-routing-number-que-son` | Operativa | 2376 | FALLA | rewrite-completo | 6 | datos-sin-fuente, longitud-insuficiente | 2 | 6 |
| 25 | `tiempos-pagos-ach-wire-transfer` | Operativa | 2441 | FALLA | rewrite-completo | 7 | longitud-insuficiente | 3 | 4 |
| 26 | `facturar-sin-ser-autonomo-alternativas-2026` | Fiscalidad | 813 | FALLA | rewrite-completo | 7 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 27 | `gastos-deducibles-autonomos-2026` | Fiscalidad | 1686 | FALLA | rewrite-completo | 7 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 28 | `modulos-vs-estimacion-directa-2026` | Fiscalidad | 1294 | FALLA | rewrite-completo | 7 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 29 | `que-es-irs-guia-duenos-llc` | Guías | 2340 | FALLA | rewrite-completo | 8 | gancho-generico, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 30 | `retenciones-irpf-factura` | Fiscalidad | 1751 | FALLA | rewrite-completo | 8 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 31 | `sociedad-limitada-espana-costes-ventajas` | Guías | 701 | FALLA | rewrite-completo | 8 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 32 | `tramos-irpf-2026` | Fiscalidad | 1081 | FALLA | rewrite-completo | 8 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 33 | `tributacion-llc-segun-actividad-economica` | Fiscalidad | 2117 | FALLA | rewrite-completo | 9 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 0 | 3 |
| 34 | `boe-febrero-2020-llc-doctrina-administrativa` | Fiscalidad | 3069 | FALLA | rewrite-completo | 9 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 35 | `crs-cuentas-bancarias-llc-intercambio-informacion` | Fiscalidad | 2886 | FALLA | rewrite-completo | 9 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 36 | `crs-residentes-espana-latam-implicaciones` | Fiscalidad | 3070 | FALLA | rewrite-completo | 9 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 37 | `dac8-criptomonedas-reporting-fiscal-2026` | Compliance | 2435 | FALLA | rewrite-completo | 10 | objeciones-no-resueltas, longitud-insuficiente | 0 | 2 |
| 38 | `evitar-bloqueos-mercury-wise-revolut` | Operativa | 2132 | FALLA | rewrite-completo | 10 | datos-sin-fuente, longitud-insuficiente | 0 | 2 |
| 39 | `extension-irs-form-1120-como-solicitarla` | Fiscalidad | 2151 | FALLA | rewrite-completo | 10 | datos-sin-fuente, longitud-insuficiente | 0 | 2 |
| 40 | `fiscalidad-llc-por-pais-residencia` | Fiscalidad | 2687 | FALLA | rewrite-completo | 10 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 41 | `fiscalidad-socios-llc-cambio-residencia-mid-year` | Fiscalidad | 3132 | FALLA | rewrite-completo | 11 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 42 | `llc-desarrolladores-software-saas` | Guías | 2439 | FALLA | rewrite-completo | 11 | datos-sin-fuente, longitud-insuficiente | 0 | 2 |
| 43 | `que-pasa-si-no-presentas-5472-multas-irs` | Compliance | 3832 | FALLA | rewrite-completo | 11 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 44 | `riesgos-fiscales-mala-estructuracion-internacional` | Fiscalidad | 2322 | FALLA | rewrite-completo | 11 | objeciones-no-resueltas, longitud-insuficiente | 0 | 2 |
| 45 | `visa-mastercard-reporting-tarjetas-hacienda` | Compliance | 4633 | FALLA | rewrite-completo | 12 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 46 | `w8-ben-y-w8-ben-e-guia-completa` | Compliance | 4334 | FALLA | rewrite-completo | 12 | objeciones-no-resueltas, datos-sin-fuente | 0 | 2 |
| 47 | `wise-business-crs-reporting-fiscal` | Compliance | 2460 | FALLA | rewrite-completo | 12 | objeciones-no-resueltas, longitud-insuficiente | 0 | 2 |
| 48 | `auditoria-rapida-llc-12-puntos-30-minutos` | Herramientas | 2752 | FALLA | rewrite-completo | 12 | datos-sin-fuente | 0 | 1 |
| 49 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | Operativa | 2701 | FALLA | rewrite-completo | 13 | datos-sin-fuente | 0 | 1 |
| 50 | `como-disolver-cerrar-llc-paso-a-paso` | Compliance | 4404 | FALLA | rewrite-completo | 13 | objeciones-no-resueltas | 0 | 1 |
| 51 | `convenio-doble-imposicion-usa-espana-llc` | Fiscalidad | 3928 | FALLA | rewrite-completo | 13 | objeciones-no-resueltas | 0 | 1 |
| 52 | `crear-empresa-andorra-ventajas` | Comparativas | 2643 | FALLA | rewrite-completo | 13 | objeciones-no-resueltas | 0 | 1 |
| 53 | `crs-2-0-carf-por-que-usa-no-firmara-llc` | Fiscalidad | 3038 | FALLA | rewrite-completo | 14 | datos-sin-fuente | 0 | 1 |
| 54 | `dac7-plataformas-digitales-reporting-2026` | Compliance | 2962 | FALLA | rewrite-completo | 14 | objeciones-no-resueltas | 0 | 1 |
| 55 | `diseno-estructura-fiscal-internacional-solida` | Fiscalidad | 3276 | FALLA | rewrite-completo | 14 | objeciones-no-resueltas | 0 | 1 |
| 56 | `documentar-separacion-fondos-llc-historial` | Compliance | 2559 | FALLA | rewrite-completo | 14 | datos-sin-fuente | 0 | 1 |
| 57 | `empresa-bulgaria-10-tributacion` | Comparativas | 3413 | FALLA | rewrite-completo | 15 | datos-sin-fuente | 0 | 1 |
| 58 | `escalar-negocio-digital-llc-americana` | Operativa | 2899 | FALLA | rewrite-completo | 15 | objeciones-no-resueltas | 0 | 1 |
| 59 | `exit-tax-espana-llc-cripto-interactive-brokers` | Fiscalidad | 3740 | FALLA | rewrite-completo | 15 | datos-sin-fuente | 0 | 1 |
| 60 | `holding-empresarial-como-funciona` | Fiscalidad | 2636 | FALLA | rewrite-completo | 15 | objeciones-no-resueltas | 0 | 1 |
| 61 | `irs-1120-5472-que-son-cuando-aplican` | Compliance | 3244 | FALLA | rewrite-completo | 16 | datos-sin-fuente | 0 | 1 |
| 62 | `iva-intracomunitario-servicios-europa` | Fiscalidad | 1705 | FALLA | rewrite-completo | 16 | longitud-insuficiente | 0 | 1 |
| 63 | `llc-agencias-marketing-digital` | Guías | 2477 | FALLA | rewrite-completo | 16 | longitud-insuficiente | 0 | 1 |
| 64 | `llc-interactive-brokers-invertir-bolsa-usa` | Comparativas | 3168 | FALLA | rewrite-completo | 16 | objeciones-no-resueltas | 0 | 1 |
| 65 | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | Compliance | 4997 | FALLA | rewrite-completo | 17 | objeciones-no-resueltas | 0 | 1 |
| 66 | `prevencion-blanqueo-capitales-llc` | Compliance | 2405 | FALLA | rewrite-completo | 17 | longitud-insuficiente | 0 | 1 |
| 67 | `problemas-comunes-llc-como-evitarlos` | Guías | 3371 | FALLA | rewrite-completo | 17 | objeciones-no-resueltas | 0 | 1 |
| 68 | `recuperar-llc-boi-5472-atrasados-procedimiento` | Compliance | 2399 | FALLA | rewrite-completo | 17 | longitud-insuficiente | 0 | 1 |
| 69 | `revolut-business-crs-reporting-fiscal` | Compliance | 3035 | FALLA | rewrite-completo | 18 | objeciones-no-resueltas | 0 | 1 |
| 70 | `single-member-multi-member-llc-implicaciones-fiscales` | Fiscalidad | 2877 | FALLA | rewrite-completo | 18 | datos-sin-fuente | 0 | 1 |
| 71 | `testaferros-prestanombres-llc-ilegal-riesgos` | Legal | 2973 | FALLA | rewrite-completo | 18 | objeciones-no-resueltas | 0 | 1 |
| 72 | `vender-o-cerrar-llc-comparativa-practica` | Comparativas | 2328 | FALLA | rewrite-completo | 18 | longitud-insuficiente | 0 | 1 |
| 73 | `wise-bancos-llc-stack-bancaria-completa` | Operativa | 4040 | FALLA | rewrite-completo | 19 | objeciones-no-resueltas | 0 | 1 |
| 74 | `wise-iban-llc-que-reporta-hacienda` | Compliance | 4010 | FALLA | rewrite-completo | 19 | objeciones-no-resueltas | 0 | 1 |
| 75 | `nuevo-mexico-vs-wyoming-vs-delaware` | Comparativas | 3223 | PASA | polish-verificacion | 20 | — | 53 | 26.5 |
| 76 | `autonomo-espana-vs-llc-estados-unidos` | Comparativas | 3411 | PASA | polish-verificacion | 20 | — | 49 | 24.5 |
| 77 | `pagar-cero-impuestos-legalmente-llc` | Fiscalidad | 3513 | PASA | polish-verificacion | 20 | — | 47 | 23.5 |
| 78 | `operating-agreement-llc-que-es` | Guías | 3491 | PASA | polish-verificacion | 20 | — | 40 | 20 |
| 79 | `constituir-llc-proceso-paso-a-paso` | Guías | 3239 | PASA | polish-verificacion | 21 | — | 31 | 15.5 |
| 80 | `autonomos-espana-por-que-dejar-de-serlo` | Fiscalidad | 3172 | PASA | polish-verificacion | 21 | — | 30 | 15 |
| 81 | `ventajas-desventajas-llc-no-residentes` | Comparativas | 3219 | PASA | polish-verificacion | 21 | — | 25 | 12.5 |
| 82 | `impuestos-clientes-internacionales-espana` | Fiscalidad | 2763 | PASA | polish-verificacion | 21 | — | 23 | 11.5 |
| 83 | `nomada-digital-residencia-fiscal` | Fiscalidad | 5345 | PASA | polish-verificacion | 22 | — | 21 | 10.5 |
| 84 | `registered-agent-que-es-por-que-necesitas` | Guías | 3068 | PASA | polish-verificacion | 22 | — | 18 | 9 |
| 85 | `errores-fiscales-freelancers-espanoles` | Fiscalidad | 4020 | PASA | polish-verificacion | 22 | — | 17 | 8.5 |
| 86 | `documentos-llc-cuales-necesitas` | Guías | 2838 | PASA | polish-verificacion | 22 | — | 14 | 7 |
| 87 | `bookkeeping-llc-paso-a-paso` | Operativa | 3847 | PASA | polish-verificacion | 23 | — | 0 | 0 |
| 88 | `caminos-legales-minimos-impuestos` | Fiscalidad | 3644 | PASA | polish-verificacion | 23 | — | 0 | 0 |
| 89 | `cuentas-bancarias-usa-reportan-hacienda-verdad` | Fiscalidad | 3758 | PASA | polish-verificacion | 23 | — | 0 | 0 |
| 90 | `dubai-uae-mito-no-impuestos` | Comparativas | 3041 | PASA | polish-verificacion | 23 | — | 0 | 0 |
| 91 | `due-diligence-bancario-llc-americana` | Compliance | 2535 | PASA | polish-verificacion | 24 | — | 0 | 0 |
| 92 | `empresa-panama-fiscalidad-residencia` | Comparativas | 3000 | PASA | polish-verificacion | 24 | — | 0 | 0 |
| 93 | `empresa-reino-unido-uk-ltd` | Comparativas | 2503 | PASA | polish-verificacion | 24 | — | 0 | 0 |
| 94 | `errores-criticos-llc-ya-constituida` | Compliance | 4673 | PASA | polish-verificacion | 24 | — | 0 | 0 |
| 95 | `estructura-fiscal-optima-freelancer-internacional` | Fiscalidad | 2986 | PASA | polish-verificacion | 25 | — | 0 | 0 |
| 96 | `estructura-offshore-beneficios-riesgos` | Fiscalidad | 3564 | PASA | polish-verificacion | 25 | — | 0 | 0 |
| 97 | `fiscalidad-estonia-como-funciona` | Fiscalidad | 2659 | PASA | polish-verificacion | 25 | — | 0 | 0 |
| 98 | `fiscalidad-internacional-emprendedores-digitales` | Fiscalidad | 3025 | PASA | polish-verificacion | 25 | — | 0 | 0 |
| 99 | `hong-kong-offshore-realidad` | Comparativas | 3407 | PASA | polish-verificacion | 26 | — | 0 | 0 |
| 100 | `justificar-origen-fondos-kyc-bancario-segunda-ronda` | Operativa | 2970 | PASA | polish-verificacion | 26 | — | 0 | 0 |
| 101 | `llc-alternativa-autonomo-espana` | Fiscalidad | 4598 | PASA | polish-verificacion | 26 | — | 0 | 0 |
| 102 | `llc-creadores-contenido-youtube-twitch` | Guías | 2548 | PASA | polish-verificacion | 26 | — | 0 | 0 |
| 103 | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | Fiscalidad | 4059 | PASA | polish-verificacion | 27 | — | 0 | 0 |
| 104 | `llc-seguridad-juridica-proteccion-patrimonial` | Guías | 3015 | PASA | polish-verificacion | 27 | — | 0 | 0 |
| 105 | `llc-unica-estructura-holding-cuando-como-cuesta` | Fiscalidad | 2955 | PASA | polish-verificacion | 27 | — | 0 | 0 |
| 106 | `por-que-abrir-llc-estados-unidos-ventajas` | Guías | 3174 | PASA | polish-verificacion | 27 | — | 0 | 0 |
| 107 | `por-que-no-abrir-empresa-estonia` | Comparativas | 3921 | PASA | polish-verificacion | 28 | — | 0 | 0 |
| 108 | `primer-mes-llc-que-esperar` | Operativa | 2857 | PASA | polish-verificacion | 28 | — | 0 | 0 |
| 109 | `privacidad-llc-americana-secreto-ventaja` | Legal | 2657 | PASA | polish-verificacion | 28 | — | 0 | 0 |
| 110 | `reorganizar-banca-llc-mercury-relay-wise` | Operativa | 2936 | PASA | polish-verificacion | 28 | — | 0 | 0 |
| 111 | `tengo-llc-checklist-gestion-correcta` | Compliance | 3917 | PASA | polish-verificacion | 29 | — | 0 | 0 |

## Notas

- Word count se mide sobre el template literal sin HTML/code/markdown.
- Tráfico = `signals.trafficScore` del audit (escala interna 0-100, no clicks reales).
- Las categorías de fallo y los planes detallados por slug viven en `docs/audits/2026-04/conversion/audit-es.md`.
- Re-ejecutar `scripts/audit/audit-conversion-es-2026-04.mjs` después de cada sprint para refrescar la cola; los slugs cerrados pasan a PASA y entran en pasada de polish posterior.
