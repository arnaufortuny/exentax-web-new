# SPRINT-PLAN — 29 sprints, 4 slugs cada uno (final operativo aprobado por PM)

> Plan de ejecución del programa editorial 2026.  
> Cada sprint se propone como tarea separada (`Sprint #N — …`) tras el cierre del anterior.  
> Sprints 1–19: rewrite-completo (verdict FALLA).  
> **Cómputo:** 111 slugs = 74 FALLA + 37 PASA. A 4 slugs por sprint: 74÷4 = 18,5 → **19 sprints rewrite** (sprints 1–19, el último con sólo 2 slugs); 37÷4 = 9,25 → **10 sprints polish** (sprints 20–29, el último con sólo 1 slug). Total **29 sprints** alineados al recuento de `PRIORITY-QUEUE.md`.  
> Sprints 20–29: polish-verificacion (verdict PASA).

## Reglas de ejecución

1. **Orden interno**: cada sprint completa el slug nº1 íntegro (ES + 5 nativas + meta + validadores) **antes** de pasar al nº2.
2. **Validadores que gatean cierre del sprint**: `blog:validate-all`, `lint:blog`, `i18n:check`, `lint:pt-pt`, `seo:meta`, audit re-ejecutado sobre los slugs del sprint → todos PASA.
3. **Cierre**: entrada en `docs/editorial/sprints/SPRINT-LOG.md` con palabras finales por idioma, ratio nativa/ES, fuentes citadas, commit hash.
4. **Worksheets**: los sprints **1–8** ya tienen worksheet generado (`docs/editorial/worksheets/<slug>.md`). Sprints 9+ generan worksheet on-demand cuando se proponen como tarea.
5. **Dependencia**: cada sprint depende del cierre del anterior (no se ejecutan en paralelo). El master Task #26 es prerequisito común.

## Cuadro general

| Sprint | Tipo | Slugs |
|---:|---|---|
| 1 | rewrite | `residentes-no-residentes-llc-diferencias` · `diferencia-llc-corporation-s-corp-c-corp` · `iva-servicios-digitales-internacional` · `llc-estados-unidos-guia-completa-2026` |
| 2 | rewrite | `form-5472-que-es-como-presentarlo` · `boi-report-fincen-guia-completa-2026` · `como-obtener-itin-numero-fiscal-irs` · `cuota-autonomo-2026` |
| 3 | rewrite | `cuotas-autonomos-2026-guia-completa` · `ein-numero-fiscal-llc-como-obtenerlo` · `cuenta-bancaria-mercury-llc-extranjero` · `mantenimiento-anual-llc-obligaciones` |
| 4 | rewrite | `como-operar-llc-dia-a-dia` · `separar-dinero-personal-llc-por-que-importa` · `itin-ssn-que-son-como-obtenerlos` · `tributacion-pass-through-llc-como-funciona` |
| 5 | rewrite | `wise-business-llc-guia` · `amazon-ecommerce-llc-vender-online` · `criptomonedas-trading-llc-impuestos` · `gastos-deducibles-llc-que-puedes-deducir` |
| 6 | rewrite | `cambiar-divisas-llc-mejores-opciones` · `pasarelas-pago-llc-stripe-paypal-dodo` · `bancos-vs-fintech-llc-donde-abrir-cuenta` · `iban-swift-routing-number-que-son` |
| 7 | rewrite | `tiempos-pagos-ach-wire-transfer` · `facturar-sin-ser-autonomo-alternativas-2026` · `gastos-deducibles-autonomos-2026` · `modulos-vs-estimacion-directa-2026` |
| 8 | rewrite | `que-es-irs-guia-duenos-llc` · `retenciones-irpf-factura` · `sociedad-limitada-espana-costes-ventajas` · `tramos-irpf-2026` |
| 9 | rewrite | `tributacion-llc-segun-actividad-economica` · `boe-febrero-2020-llc-doctrina-administrativa` · `crs-cuentas-bancarias-llc-intercambio-informacion` · `crs-residentes-espana-latam-implicaciones` |
| 10 | rewrite | `dac8-criptomonedas-reporting-fiscal-2026` · `evitar-bloqueos-mercury-wise-revolut` · `extension-irs-form-1120-como-solicitarla` · `fiscalidad-llc-por-pais-residencia` |
| 11 | rewrite | `fiscalidad-socios-llc-cambio-residencia-mid-year` · `llc-desarrolladores-software-saas` · `que-pasa-si-no-presentas-5472-multas-irs` · `riesgos-fiscales-mala-estructuracion-internacional` |
| 12 | rewrite | `visa-mastercard-reporting-tarjetas-hacienda` · `w8-ben-y-w8-ben-e-guia-completa` · `wise-business-crs-reporting-fiscal` · `auditoria-rapida-llc-12-puntos-30-minutos` |
| 13 | rewrite | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` · `como-disolver-cerrar-llc-paso-a-paso` · `convenio-doble-imposicion-usa-espana-llc` · `crear-empresa-andorra-ventajas` |
| 14 | rewrite | `crs-2-0-carf-por-que-usa-no-firmara-llc` · `dac7-plataformas-digitales-reporting-2026` · `diseno-estructura-fiscal-internacional-solida` · `documentar-separacion-fondos-llc-historial` |
| 15 | rewrite | `empresa-bulgaria-10-tributacion` · `escalar-negocio-digital-llc-americana` · `exit-tax-espana-llc-cripto-interactive-brokers` · `holding-empresarial-como-funciona` |
| 16 | rewrite | `irs-1120-5472-que-son-cuando-aplican` · `iva-intracomunitario-servicios-europa` · `llc-agencias-marketing-digital` · `llc-interactive-brokers-invertir-bolsa-usa` |
| 17 | rewrite | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` · `prevencion-blanqueo-capitales-llc` · `problemas-comunes-llc-como-evitarlos` · `recuperar-llc-boi-5472-atrasados-procedimiento` |
| 18 | rewrite | `revolut-business-crs-reporting-fiscal` · `single-member-multi-member-llc-implicaciones-fiscales` · `testaferros-prestanombres-llc-ilegal-riesgos` · `vender-o-cerrar-llc-comparativa-practica` |
| 19 | rewrite | `wise-bancos-llc-stack-bancaria-completa` · `wise-iban-llc-que-reporta-hacienda` |
| 20 | polish | `nuevo-mexico-vs-wyoming-vs-delaware` · `autonomo-espana-vs-llc-estados-unidos` · `pagar-cero-impuestos-legalmente-llc` · `operating-agreement-llc-que-es` |
| 21 | polish | `constituir-llc-proceso-paso-a-paso` · `autonomos-espana-por-que-dejar-de-serlo` · `ventajas-desventajas-llc-no-residentes` · `impuestos-clientes-internacionales-espana` |
| 22 | polish | `nomada-digital-residencia-fiscal` · `registered-agent-que-es-por-que-necesitas` · `errores-fiscales-freelancers-espanoles` · `documentos-llc-cuales-necesitas` |
| 23 | polish | `bookkeeping-llc-paso-a-paso` · `caminos-legales-minimos-impuestos` · `cuentas-bancarias-usa-reportan-hacienda-verdad` · `dubai-uae-mito-no-impuestos` |
| 24 | polish | `due-diligence-bancario-llc-americana` · `empresa-panama-fiscalidad-residencia` · `empresa-reino-unido-uk-ltd` · `errores-criticos-llc-ya-constituida` |
| 25 | polish | `estructura-fiscal-optima-freelancer-internacional` · `estructura-offshore-beneficios-riesgos` · `fiscalidad-estonia-como-funciona` · `fiscalidad-internacional-emprendedores-digitales` |
| 26 | polish | `hong-kong-offshore-realidad` · `justificar-origen-fondos-kyc-bancario-segunda-ronda` · `llc-alternativa-autonomo-espana` · `llc-creadores-contenido-youtube-twitch` |
| 27 | polish | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` · `llc-seguridad-juridica-proteccion-patrimonial` · `llc-unica-estructura-holding-cuando-como-cuesta` · `por-que-abrir-llc-estados-unidos-ventajas` |
| 28 | polish | `por-que-no-abrir-empresa-estonia` · `primer-mes-llc-que-esperar` · `privacidad-llc-americana-secreto-ventaja` · `reorganizar-banca-llc-mercury-relay-wise` |
| 29 | polish | `tengo-llc-checklist-gestion-correcta` |

## Detalle por sprint

### Sprint #1 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `residentes-no-residentes-llc-diferencias` | 2363 | gancho-generico, datos-sin-fuente, longitud-insuficiente | 102 |
| 2 | `diferencia-llc-corporation-s-corp-c-corp` | 2266 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 78 |
| 3 | `iva-servicios-digitales-internacional` | 2102 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 60 |
| 4 | `llc-estados-unidos-guia-completa-2026` | 4106 | gancho-generico | 56 |

→ Worksheets: [residentes-no-residentes-llc-diferencias](../worksheets/residentes-no-residentes-llc-diferencias.md) · [diferencia-llc-corporation-s-corp-c-corp](../worksheets/diferencia-llc-corporation-s-corp-c-corp.md) · [iva-servicios-digitales-internacional](../worksheets/iva-servicios-digitales-internacional.md) · [llc-estados-unidos-guia-completa-2026](../worksheets/llc-estados-unidos-guia-completa-2026.md)

### Sprint #2 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `form-5472-que-es-como-presentarlo` | 2907 | datos-sin-fuente | 55 |
| 2 | `boi-report-fincen-guia-completa-2026` | 2634 | objeciones-no-resueltas, datos-sin-fuente | 52 |
| 3 | `como-obtener-itin-numero-fiscal-irs` | 4324 | objeciones-no-resueltas, datos-sin-fuente | 52 |
| 4 | `cuota-autonomo-2026` | 1247 | objeciones-no-resueltas, longitud-insuficiente | 52 |

→ Worksheets: [form-5472-que-es-como-presentarlo](../worksheets/form-5472-que-es-como-presentarlo.md) · [boi-report-fincen-guia-completa-2026](../worksheets/boi-report-fincen-guia-completa-2026.md) · [como-obtener-itin-numero-fiscal-irs](../worksheets/como-obtener-itin-numero-fiscal-irs.md) · [cuota-autonomo-2026](../worksheets/cuota-autonomo-2026.md)

### Sprint #3 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `cuotas-autonomos-2026-guia-completa` | 2013 | objeciones-no-resueltas, longitud-insuficiente | 52 |
| 2 | `ein-numero-fiscal-llc-como-obtenerlo` | 2721 | datos-sin-fuente | 52 |
| 3 | `cuenta-bancaria-mercury-llc-extranjero` | 4595 | gancho-generico | 51 |
| 4 | `mantenimiento-anual-llc-obligaciones` | 3267 | exentax-forzado | 39 |

→ Worksheets: [cuotas-autonomos-2026-guia-completa](../worksheets/cuotas-autonomos-2026-guia-completa.md) · [ein-numero-fiscal-llc-como-obtenerlo](../worksheets/ein-numero-fiscal-llc-como-obtenerlo.md) · [cuenta-bancaria-mercury-llc-extranjero](../worksheets/cuenta-bancaria-mercury-llc-extranjero.md) · [mantenimiento-anual-llc-obligaciones](../worksheets/mantenimiento-anual-llc-obligaciones.md)

### Sprint #4 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `como-operar-llc-dia-a-dia` | 3744 | gancho-generico, objeciones-no-resueltas | 34 |
| 2 | `separar-dinero-personal-llc-por-que-importa` | 4389 | gancho-generico | 28 |
| 3 | `itin-ssn-que-son-como-obtenerlos` | 2857 | datos-sin-fuente | 26 |
| 4 | `tributacion-pass-through-llc-como-funciona` | 2392 | longitud-insuficiente | 26 |

→ Worksheets: [como-operar-llc-dia-a-dia](../worksheets/como-operar-llc-dia-a-dia.md) · [separar-dinero-personal-llc-por-que-importa](../worksheets/separar-dinero-personal-llc-por-que-importa.md) · [itin-ssn-que-son-como-obtenerlos](../worksheets/itin-ssn-que-son-como-obtenerlos.md) · [tributacion-pass-through-llc-como-funciona](../worksheets/tributacion-pass-through-llc-como-funciona.md)

### Sprint #5 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `wise-business-llc-guia` | 2340 | datos-sin-fuente, longitud-insuficiente | 26 |
| 2 | `amazon-ecommerce-llc-vender-online` | 2247 | datos-sin-fuente, longitud-insuficiente | 22 |
| 3 | `criptomonedas-trading-llc-impuestos` | 2805 | datos-sin-fuente | 21 |
| 4 | `gastos-deducibles-llc-que-puedes-deducir` | 3048 | objeciones-no-resueltas, datos-sin-fuente | 20 |

→ Worksheets: [wise-business-llc-guia](../worksheets/wise-business-llc-guia.md) · [amazon-ecommerce-llc-vender-online](../worksheets/amazon-ecommerce-llc-vender-online.md) · [criptomonedas-trading-llc-impuestos](../worksheets/criptomonedas-trading-llc-impuestos.md) · [gastos-deducibles-llc-que-puedes-deducir](../worksheets/gastos-deducibles-llc-que-puedes-deducir.md)

### Sprint #6 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `cambiar-divisas-llc-mejores-opciones` | 2248 | objeciones-no-resueltas, longitud-insuficiente | 16 |
| 2 | `pasarelas-pago-llc-stripe-paypal-dodo` | 2202 | longitud-insuficiente | 12 |
| 3 | `bancos-vs-fintech-llc-donde-abrir-cuenta` | 2307 | datos-sin-fuente, longitud-insuficiente | 10 |
| 4 | `iban-swift-routing-number-que-son` | 2376 | datos-sin-fuente, longitud-insuficiente | 6 |

→ Worksheets: [cambiar-divisas-llc-mejores-opciones](../worksheets/cambiar-divisas-llc-mejores-opciones.md) · [pasarelas-pago-llc-stripe-paypal-dodo](../worksheets/pasarelas-pago-llc-stripe-paypal-dodo.md) · [bancos-vs-fintech-llc-donde-abrir-cuenta](../worksheets/bancos-vs-fintech-llc-donde-abrir-cuenta.md) · [iban-swift-routing-number-que-son](../worksheets/iban-swift-routing-number-que-son.md)

### Sprint #7 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `tiempos-pagos-ach-wire-transfer` | 2441 | longitud-insuficiente | 4 |
| 2 | `facturar-sin-ser-autonomo-alternativas-2026` | 813 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |
| 3 | `gastos-deducibles-autonomos-2026` | 1686 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |
| 4 | `modulos-vs-estimacion-directa-2026` | 1294 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |

→ Worksheets: [tiempos-pagos-ach-wire-transfer](../worksheets/tiempos-pagos-ach-wire-transfer.md) · [facturar-sin-ser-autonomo-alternativas-2026](../worksheets/facturar-sin-ser-autonomo-alternativas-2026.md) · [gastos-deducibles-autonomos-2026](../worksheets/gastos-deducibles-autonomos-2026.md) · [modulos-vs-estimacion-directa-2026](../worksheets/modulos-vs-estimacion-directa-2026.md)

### Sprint #8 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `que-es-irs-guia-duenos-llc` | 2340 | gancho-generico, datos-sin-fuente, longitud-insuficiente | 3 |
| 2 | `retenciones-irpf-factura` | 1751 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |
| 3 | `sociedad-limitada-espana-costes-ventajas` | 701 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |
| 4 | `tramos-irpf-2026` | 1081 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |

→ Worksheets: [que-es-irs-guia-duenos-llc](../worksheets/que-es-irs-guia-duenos-llc.md) · [retenciones-irpf-factura](../worksheets/retenciones-irpf-factura.md) · [sociedad-limitada-espana-costes-ventajas](../worksheets/sociedad-limitada-espana-costes-ventajas.md) · [tramos-irpf-2026](../worksheets/tramos-irpf-2026.md)

### Sprint #9 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `tributacion-llc-segun-actividad-economica` | 2117 | objeciones-no-resueltas, datos-sin-fuente, longitud-insuficiente | 3 |
| 2 | `boe-febrero-2020-llc-doctrina-administrativa` | 3069 | objeciones-no-resueltas, datos-sin-fuente | 2 |
| 3 | `crs-cuentas-bancarias-llc-intercambio-informacion` | 2886 | objeciones-no-resueltas, datos-sin-fuente | 2 |
| 4 | `crs-residentes-espana-latam-implicaciones` | 3070 | objeciones-no-resueltas, datos-sin-fuente | 2 |

### Sprint #10 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `dac8-criptomonedas-reporting-fiscal-2026` | 2435 | objeciones-no-resueltas, longitud-insuficiente | 2 |
| 2 | `evitar-bloqueos-mercury-wise-revolut` | 2132 | datos-sin-fuente, longitud-insuficiente | 2 |
| 3 | `extension-irs-form-1120-como-solicitarla` | 2151 | datos-sin-fuente, longitud-insuficiente | 2 |
| 4 | `fiscalidad-llc-por-pais-residencia` | 2687 | objeciones-no-resueltas, datos-sin-fuente | 2 |

### Sprint #11 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `fiscalidad-socios-llc-cambio-residencia-mid-year` | 3132 | objeciones-no-resueltas, datos-sin-fuente | 2 |
| 2 | `llc-desarrolladores-software-saas` | 2439 | datos-sin-fuente, longitud-insuficiente | 2 |
| 3 | `que-pasa-si-no-presentas-5472-multas-irs` | 3832 | objeciones-no-resueltas, datos-sin-fuente | 2 |
| 4 | `riesgos-fiscales-mala-estructuracion-internacional` | 2322 | objeciones-no-resueltas, longitud-insuficiente | 2 |

### Sprint #12 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `visa-mastercard-reporting-tarjetas-hacienda` | 4633 | objeciones-no-resueltas, datos-sin-fuente | 2 |
| 2 | `w8-ben-y-w8-ben-e-guia-completa` | 4334 | objeciones-no-resueltas, datos-sin-fuente | 2 |
| 3 | `wise-business-crs-reporting-fiscal` | 2460 | objeciones-no-resueltas, longitud-insuficiente | 2 |
| 4 | `auditoria-rapida-llc-12-puntos-30-minutos` | 2752 | datos-sin-fuente | 1 |

### Sprint #13 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | 2701 | datos-sin-fuente | 1 |
| 2 | `como-disolver-cerrar-llc-paso-a-paso` | 4404 | objeciones-no-resueltas | 1 |
| 3 | `convenio-doble-imposicion-usa-espana-llc` | 3928 | objeciones-no-resueltas | 1 |
| 4 | `crear-empresa-andorra-ventajas` | 2643 | objeciones-no-resueltas | 1 |

### Sprint #14 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `crs-2-0-carf-por-que-usa-no-firmara-llc` | 3038 | datos-sin-fuente | 1 |
| 2 | `dac7-plataformas-digitales-reporting-2026` | 2962 | objeciones-no-resueltas | 1 |
| 3 | `diseno-estructura-fiscal-internacional-solida` | 3276 | objeciones-no-resueltas | 1 |
| 4 | `documentar-separacion-fondos-llc-historial` | 2559 | datos-sin-fuente | 1 |

### Sprint #15 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `empresa-bulgaria-10-tributacion` | 3413 | datos-sin-fuente | 1 |
| 2 | `escalar-negocio-digital-llc-americana` | 2899 | objeciones-no-resueltas | 1 |
| 3 | `exit-tax-espana-llc-cripto-interactive-brokers` | 3740 | datos-sin-fuente | 1 |
| 4 | `holding-empresarial-como-funciona` | 2636 | objeciones-no-resueltas | 1 |

### Sprint #16 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `irs-1120-5472-que-son-cuando-aplican` | 3244 | datos-sin-fuente | 1 |
| 2 | `iva-intracomunitario-servicios-europa` | 1705 | longitud-insuficiente | 1 |
| 3 | `llc-agencias-marketing-digital` | 2477 | longitud-insuficiente | 1 |
| 4 | `llc-interactive-brokers-invertir-bolsa-usa` | 3168 | objeciones-no-resueltas | 1 |

### Sprint #17 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | 4997 | objeciones-no-resueltas | 1 |
| 2 | `prevencion-blanqueo-capitales-llc` | 2405 | longitud-insuficiente | 1 |
| 3 | `problemas-comunes-llc-como-evitarlos` | 3371 | objeciones-no-resueltas | 1 |
| 4 | `recuperar-llc-boi-5472-atrasados-procedimiento` | 2399 | longitud-insuficiente | 1 |

### Sprint #18 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `revolut-business-crs-reporting-fiscal` | 3035 | objeciones-no-resueltas | 1 |
| 2 | `single-member-multi-member-llc-implicaciones-fiscales` | 2877 | datos-sin-fuente | 1 |
| 3 | `testaferros-prestanombres-llc-ilegal-riesgos` | 2973 | objeciones-no-resueltas | 1 |
| 4 | `vender-o-cerrar-llc-comparativa-practica` | 2328 | longitud-insuficiente | 1 |

### Sprint #19 — Reescritura completa

| Orden | Slug | WC actual | Fallos | Score |
|---:|---|---:|---|---:|
| 1 | `wise-bancos-llc-stack-bancaria-completa` | 4040 | objeciones-no-resueltas | 1 |
| 2 | `wise-iban-llc-que-reporta-hacienda` | 4010 | objeciones-no-resueltas | 1 |

### Sprint #20 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `nuevo-mexico-vs-wyoming-vs-delaware` | 3223 | verificar fuentes + refrescar cifras + revisar registro nativo | 26.5 |
| 2 | `autonomo-espana-vs-llc-estados-unidos` | 3411 | verificar fuentes + refrescar cifras + revisar registro nativo | 24.5 |
| 3 | `pagar-cero-impuestos-legalmente-llc` | 3513 | verificar fuentes + refrescar cifras + revisar registro nativo | 23.5 |
| 4 | `operating-agreement-llc-que-es` | 3491 | verificar fuentes + refrescar cifras + revisar registro nativo | 20 |

### Sprint #21 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `constituir-llc-proceso-paso-a-paso` | 3239 | verificar fuentes + refrescar cifras + revisar registro nativo | 15.5 |
| 2 | `autonomos-espana-por-que-dejar-de-serlo` | 3172 | verificar fuentes + refrescar cifras + revisar registro nativo | 15 |
| 3 | `ventajas-desventajas-llc-no-residentes` | 3219 | verificar fuentes + refrescar cifras + revisar registro nativo | 12.5 |
| 4 | `impuestos-clientes-internacionales-espana` | 2763 | verificar fuentes + refrescar cifras + revisar registro nativo | 11.5 |

### Sprint #22 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `nomada-digital-residencia-fiscal` | 5345 | verificar fuentes + refrescar cifras + revisar registro nativo | 10.5 |
| 2 | `registered-agent-que-es-por-que-necesitas` | 3068 | verificar fuentes + refrescar cifras + revisar registro nativo | 9 |
| 3 | `errores-fiscales-freelancers-espanoles` | 4020 | verificar fuentes + refrescar cifras + revisar registro nativo | 8.5 |
| 4 | `documentos-llc-cuales-necesitas` | 2838 | verificar fuentes + refrescar cifras + revisar registro nativo | 7 |

### Sprint #23 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `bookkeeping-llc-paso-a-paso` | 3847 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 2 | `caminos-legales-minimos-impuestos` | 3644 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 3 | `cuentas-bancarias-usa-reportan-hacienda-verdad` | 3758 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 4 | `dubai-uae-mito-no-impuestos` | 3041 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |

### Sprint #24 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `due-diligence-bancario-llc-americana` | 2535 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 2 | `empresa-panama-fiscalidad-residencia` | 3000 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 3 | `empresa-reino-unido-uk-ltd` | 2503 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 4 | `errores-criticos-llc-ya-constituida` | 4673 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |

### Sprint #25 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `estructura-fiscal-optima-freelancer-internacional` | 2986 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 2 | `estructura-offshore-beneficios-riesgos` | 3564 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 3 | `fiscalidad-estonia-como-funciona` | 2659 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 4 | `fiscalidad-internacional-emprendedores-digitales` | 3025 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |

### Sprint #26 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `hong-kong-offshore-realidad` | 3407 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 2 | `justificar-origen-fondos-kyc-bancario-segunda-ronda` | 2970 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 3 | `llc-alternativa-autonomo-espana` | 4598 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 4 | `llc-creadores-contenido-youtube-twitch` | 2548 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |

### Sprint #27 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | 4059 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 2 | `llc-seguridad-juridica-proteccion-patrimonial` | 3015 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 3 | `llc-unica-estructura-holding-cuando-como-cuesta` | 2955 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 4 | `por-que-abrir-llc-estados-unidos-ventajas` | 3174 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |

### Sprint #28 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `por-que-no-abrir-empresa-estonia` | 3921 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 2 | `primer-mes-llc-que-esperar` | 2857 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 3 | `privacidad-llc-americana-secreto-ventaja` | 2657 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |
| 4 | `reorganizar-banca-llc-mercury-relay-wise` | 2936 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |

### Sprint #29 — Polish + verificación

| Orden | Slug | WC actual | Foco | Score |
|---:|---|---:|---|---:|
| 1 | `tengo-llc-checklist-gestion-correcta` | 3917 | verificar fuentes + refrescar cifras + revisar registro nativo | 0 |


## Estimación de capacidad

- Rewrite-completo (1 slug × 6 idiomas): 2-3h de agente.
- Polish-verificacion (1 slug × 6 idiomas): 30-45 min.
- Sprint medio rewrite: 8-12h (4 slugs × 2-3h).
- Sprint medio polish: 2-3h.

Total aproximado del programa: ~190h de rewrite + ~25h de polish ≈ **215h** de trabajo de agente repartido en 29 merges incrementales.
