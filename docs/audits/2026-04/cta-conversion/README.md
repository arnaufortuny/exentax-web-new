# Auditoría CTAs (conversión) — Audit 2026-04

Cobertura: **111** artículos × **6** idiomas. Generado por `exentax-web/scripts/audit-2026-04-cta-conversion.mjs` (idempotente).

## Política canónica de CTA por artículo

Cada artículo del blog cumple, en este orden, los siguientes contratos de conversión:

1. **Calculadora** — bloque inline `<!-- exentax:calc-cta-v1 -->` con copy contextual al tema (verificado por `scripts/check-blog-links.ts` en CI).
2. **Agenda** — enlace canónico a `/{lang}/(agendar|book|reserver|buchen)` con copy localizado y verbo de acción + beneficio (validado en `ctas-rewrite.md` §3, cobertura 100 %).
3. **Acción inmediata (tel + WhatsApp)** — bloque inyectado en este pase (`<!-- exentax:cta-conv-v1 -->`) con `tel:+34614916910` (`+34 614 916 910`) y `wa.me/34614916910?text=…` con mensaje prefijado contextual al artículo.
4. **Subpágina LLC** — para todo artículo LLC, enlace a la página de estado más relevante (Wyoming / Delaware / Florida / Nuevo México) detectada por slug y por frecuencia de menciones en cuerpo. URL canónica por idioma desde `shared/routes.ts`.
5. **Subpágina ITIN** — para artículos ITIN, enlace a la página de servicio ITIN localizada.

**Total CTAs nuevos inyectados en esta corrida** — action-row (tel + WhatsApp): 386 · enlaces LLC subpágina: 391 · enlaces ITIN subpágina: 18. Sentencias con copy genérico ("haz clic aquí", "más información", "click here"…) flagged para reescritura: 1.

## Tabla maestra (slug × cobertura final)

Una fila por artículo. Las columnas reflejan el **estado FINAL** después del pase, por idioma. ✅ = artículo con agenda + tel + WhatsApp en los 6 idiomas. La columna *LLC* / *ITIN* indica si el artículo es de esa familia y si el enlace contextual a la subpágina está activo.

| # | Slug | LLC | ITIN | Cobertura agenda | Cobertura tel + WA | Confirmación |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [amazon-ecommerce-llc-vender-online](./amazon-ecommerce-llc-vender-online.md) | sí | sí | 6/6 | 6/6 | ✅ |
| 2 | [auditoria-rapida-llc-12-puntos-30-minutos](./auditoria-rapida-llc-12-puntos-30-minutos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 3 | [autonomo-espana-vs-llc-estados-unidos](./autonomo-espana-vs-llc-estados-unidos.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 4 | [autonomos-espana-por-que-dejar-de-serlo](./autonomos-espana-por-que-dejar-de-serlo.md) | sí | — | 6/6 | 6/6 | ✅ |
| 5 | [bancos-vs-fintech-llc-donde-abrir-cuenta](./bancos-vs-fintech-llc-donde-abrir-cuenta.md) | sí | — | 6/6 | 6/6 | ✅ |
| 6 | [boe-febrero-2020-llc-doctrina-administrativa](./boe-febrero-2020-llc-doctrina-administrativa.md) | sí | — | 6/6 | 6/6 | ✅ |
| 7 | [boi-report-fincen-guia-completa-2026](./boi-report-fincen-guia-completa-2026.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 8 | [bookkeeping-llc-paso-a-paso](./bookkeeping-llc-paso-a-paso.md) | sí | — | 6/6 | 6/6 | ✅ |
| 9 | [cambiar-divisas-llc-mejores-opciones](./cambiar-divisas-llc-mejores-opciones.md) | sí | — | 6/6 | 6/6 | ✅ |
| 10 | [cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad](./cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad.md) | sí | — | 6/6 | 6/6 | ✅ |
| 11 | [caminos-legales-minimos-impuestos](./caminos-legales-minimos-impuestos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 12 | [como-disolver-cerrar-llc-paso-a-paso](./como-disolver-cerrar-llc-paso-a-paso.md) | sí | — | 6/6 | 6/6 | ✅ |
| 13 | [como-obtener-itin-numero-fiscal-irs](./como-obtener-itin-numero-fiscal-irs.md) | sí | sí | 3/6 | 6/6 | ⚠ |
| 14 | [como-operar-llc-dia-a-dia](./como-operar-llc-dia-a-dia.md) | sí | — | 6/6 | 6/6 | ✅ |
| 15 | [constituir-llc-proceso-paso-a-paso](./constituir-llc-proceso-paso-a-paso.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 16 | [convenio-doble-imposicion-usa-espana-llc](./convenio-doble-imposicion-usa-espana-llc.md) | sí | — | 6/6 | 6/6 | ✅ |
| 17 | [crear-empresa-andorra-ventajas](./crear-empresa-andorra-ventajas.md) | sí | — | 6/6 | 6/6 | ✅ |
| 18 | [criptomonedas-trading-llc-impuestos](./criptomonedas-trading-llc-impuestos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 19 | [crs-cuentas-bancarias-llc-intercambio-informacion](./crs-cuentas-bancarias-llc-intercambio-informacion.md) | sí | — | 6/6 | 6/6 | ✅ |
| 20 | [crs-residentes-espana-latam-implicaciones](./crs-residentes-espana-latam-implicaciones.md) | sí | — | 6/6 | 6/6 | ✅ |
| 21 | [cuanto-cuesta-constituir-llc](./cuanto-cuesta-constituir-llc.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 22 | [cuenta-bancaria-mercury-llc-extranjero](./cuenta-bancaria-mercury-llc-extranjero.md) | sí | — | 6/6 | 6/6 | ✅ |
| 23 | [cuentas-bancarias-usa-reportan-hacienda-verdad](./cuentas-bancarias-usa-reportan-hacienda-verdad.md) | sí | — | 6/6 | 6/6 | ✅ |
| 24 | [cuota-autonomo-2026](./cuota-autonomo-2026.md) | — | — | 6/6 | 6/6 | ✅ |
| 25 | [cuotas-autonomos-2026-guia-completa](./cuotas-autonomos-2026-guia-completa.md) | sí | — | 6/6 | 6/6 | ✅ |
| 26 | [dac7-plataformas-digitales-reporting-2026](./dac7-plataformas-digitales-reporting-2026.md) | sí | — | 6/6 | 6/6 | ✅ |
| 27 | [dac8-criptomonedas-reporting-fiscal-2026](./dac8-criptomonedas-reporting-fiscal-2026.md) | sí | — | 6/6 | 6/6 | ✅ |
| 28 | [diferencia-llc-corporation-s-corp-c-corp](./diferencia-llc-corporation-s-corp-c-corp.md) | sí | — | 6/6 | 6/6 | ✅ |
| 29 | [diseno-estructura-fiscal-internacional-solida](./diseno-estructura-fiscal-internacional-solida.md) | sí | — | 6/6 | 6/6 | ✅ |
| 30 | [documentar-separacion-fondos-llc-historial](./documentar-separacion-fondos-llc-historial.md) | sí | — | 6/6 | 6/6 | ✅ |
| 31 | [documentos-llc-cuales-necesitas](./documentos-llc-cuales-necesitas.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 32 | [dubai-uae-mito-no-impuestos](./dubai-uae-mito-no-impuestos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 33 | [due-diligence-bancario-llc-americana](./due-diligence-bancario-llc-americana.md) | sí | — | 6/6 | 6/6 | ✅ |
| 34 | [ein-numero-fiscal-llc-como-obtenerlo](./ein-numero-fiscal-llc-como-obtenerlo.md) | sí | sí | 1/6 | 6/6 | ⚠ |
| 35 | [empresa-bulgaria-10-tributacion](./empresa-bulgaria-10-tributacion.md) | sí | — | 6/6 | 6/6 | ✅ |
| 36 | [empresa-panama-fiscalidad-residencia](./empresa-panama-fiscalidad-residencia.md) | sí | — | 6/6 | 6/6 | ✅ |
| 37 | [empresa-reino-unido-uk-ltd](./empresa-reino-unido-uk-ltd.md) | sí | — | 6/6 | 6/6 | ✅ |
| 38 | [errores-criticos-llc-ya-constituida](./errores-criticos-llc-ya-constituida.md) | sí | — | 6/6 | 6/6 | ✅ |
| 39 | [errores-fiscales-freelancers-espanoles](./errores-fiscales-freelancers-espanoles.md) | sí | — | 6/6 | 6/6 | ✅ |
| 40 | [escalar-negocio-digital-llc-americana](./escalar-negocio-digital-llc-americana.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 41 | [estructura-fiscal-optima-freelancer-internacional](./estructura-fiscal-optima-freelancer-internacional.md) | sí | — | 6/6 | 6/6 | ✅ |
| 42 | [estructura-offshore-beneficios-riesgos](./estructura-offshore-beneficios-riesgos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 43 | [evitar-bloqueos-mercury-wise-revolut](./evitar-bloqueos-mercury-wise-revolut.md) | sí | — | 6/6 | 6/6 | ✅ |
| 44 | [exit-tax-espana-llc-cripto-interactive-brokers](./exit-tax-espana-llc-cripto-interactive-brokers.md) | sí | — | 6/6 | 6/6 | ✅ |
| 45 | [extension-irs-form-1120-como-solicitarla](./extension-irs-form-1120-como-solicitarla.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 46 | [facturar-sin-ser-autonomo-alternativas-2026](./facturar-sin-ser-autonomo-alternativas-2026.md) | sí | — | 6/6 | 6/6 | ✅ |
| 47 | [fiscalidad-estonia-como-funciona](./fiscalidad-estonia-como-funciona.md) | sí | — | 6/6 | 6/6 | ✅ |
| 48 | [fiscalidad-internacional-emprendedores-digitales](./fiscalidad-internacional-emprendedores-digitales.md) | sí | — | 6/6 | 6/6 | ✅ |
| 49 | [fiscalidad-llc-por-pais-residencia](./fiscalidad-llc-por-pais-residencia.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 50 | [fiscalidad-socios-llc-cambio-residencia-mid-year](./fiscalidad-socios-llc-cambio-residencia-mid-year.md) | sí | — | 6/6 | 6/6 | ✅ |
| 51 | [form-5472-que-es-como-presentarlo](./form-5472-que-es-como-presentarlo.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 52 | [gastos-deducibles-autonomos-2026](./gastos-deducibles-autonomos-2026.md) | — | — | 6/6 | 6/6 | ✅ |
| 53 | [gastos-deducibles-llc-que-puedes-deducir](./gastos-deducibles-llc-que-puedes-deducir.md) | sí | — | 6/6 | 6/6 | ✅ |
| 54 | [holding-empresarial-como-funciona](./holding-empresarial-como-funciona.md) | sí | — | 6/6 | 6/6 | ✅ |
| 55 | [hong-kong-offshore-realidad](./hong-kong-offshore-realidad.md) | sí | — | 6/6 | 6/6 | ✅ |
| 56 | [iban-swift-routing-number-que-son](./iban-swift-routing-number-que-son.md) | sí | — | 6/6 | 6/6 | ✅ |
| 57 | [impuestos-clientes-internacionales-espana](./impuestos-clientes-internacionales-espana.md) | sí | — | 6/6 | 6/6 | ✅ |
| 58 | [irs-1120-5472-que-son-cuando-aplican](./irs-1120-5472-que-son-cuando-aplican.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 59 | [itin-ssn-que-son-como-obtenerlos](./itin-ssn-que-son-como-obtenerlos.md) | sí | sí | 1/6 | 6/6 | ⚠ |
| 60 | [iva-intracomunitario-servicios-europa](./iva-intracomunitario-servicios-europa.md) | — | — | 6/6 | 6/6 | ✅ |
| 61 | [iva-servicios-digitales-internacional](./iva-servicios-digitales-internacional.md) | sí | — | 6/6 | 6/6 | ✅ |
| 62 | [justificar-origen-fondos-kyc-bancario-segunda-ronda](./justificar-origen-fondos-kyc-bancario-segunda-ronda.md) | sí | — | 6/6 | 6/6 | ✅ |
| 63 | [llc-agencias-marketing-digital](./llc-agencias-marketing-digital.md) | sí | — | 6/6 | 6/6 | ✅ |
| 64 | [llc-alternativa-autonomo-espana](./llc-alternativa-autonomo-espana.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 65 | [llc-creadores-contenido-youtube-twitch](./llc-creadores-contenido-youtube-twitch.md) | sí | — | 6/6 | 6/6 | ✅ |
| 66 | [llc-desarrolladores-software-saas](./llc-desarrolladores-software-saas.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 67 | [llc-estados-unidos-guia-completa-2026](./llc-estados-unidos-guia-completa-2026.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 68 | [llc-interactive-brokers-invertir-bolsa-usa](./llc-interactive-brokers-invertir-bolsa-usa.md) | sí | — | 6/6 | 6/6 | ✅ |
| 69 | [llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais](./llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 70 | [llc-seguridad-juridica-proteccion-patrimonial](./llc-seguridad-juridica-proteccion-patrimonial.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 71 | [llc-unica-estructura-holding-cuando-como-cuesta](./llc-unica-estructura-holding-cuando-como-cuesta.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 72 | [mantenimiento-anual-llc-obligaciones](./mantenimiento-anual-llc-obligaciones.md) | sí | — | 2/6 | 6/6 | ⚠ |
| 73 | [modelo-720-721-residentes-espana-cuentas-cripto-extranjero](./modelo-720-721-residentes-espana-cuentas-cripto-extranjero.md) | sí | — | 6/6 | 6/6 | ✅ |
| 74 | [modulos-vs-estimacion-directa-2026](./modulos-vs-estimacion-directa-2026.md) | — | — | 6/6 | 6/6 | ✅ |
| 75 | [nomada-digital-residencia-fiscal](./nomada-digital-residencia-fiscal.md) | sí | — | 6/6 | 6/6 | ✅ |
| 76 | [nuevo-mexico-vs-wyoming-vs-delaware](./nuevo-mexico-vs-wyoming-vs-delaware.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 77 | [operating-agreement-llc-que-es](./operating-agreement-llc-que-es.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 78 | [pagar-cero-impuestos-legalmente-llc](./pagar-cero-impuestos-legalmente-llc.md) | sí | — | 6/6 | 6/6 | ✅ |
| 79 | [pasarelas-pago-llc-stripe-paypal-dodo](./pasarelas-pago-llc-stripe-paypal-dodo.md) | sí | sí | 6/6 | 6/6 | ✅ |
| 80 | [por-que-abrir-llc-estados-unidos-ventajas](./por-que-abrir-llc-estados-unidos-ventajas.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 81 | [por-que-no-abrir-empresa-estonia](./por-que-no-abrir-empresa-estonia.md) | sí | — | 6/6 | 6/6 | ✅ |
| 82 | [prevencion-blanqueo-capitales-llc](./prevencion-blanqueo-capitales-llc.md) | sí | — | 6/6 | 6/6 | ✅ |
| 83 | [primer-mes-llc-que-esperar](./primer-mes-llc-que-esperar.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 84 | [privacidad-llc-americana-secreto-ventaja](./privacidad-llc-americana-secreto-ventaja.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 85 | [problemas-comunes-llc-como-evitarlos](./problemas-comunes-llc-como-evitarlos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 86 | [que-es-irs-guia-duenos-llc](./que-es-irs-guia-duenos-llc.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 87 | [que-pasa-si-no-presentas-5472-multas-irs](./que-pasa-si-no-presentas-5472-multas-irs.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 88 | [recuperar-llc-boi-5472-atrasados-procedimiento](./recuperar-llc-boi-5472-atrasados-procedimiento.md) | sí | — | 6/6 | 6/6 | ✅ |
| 89 | [registered-agent-que-es-por-que-necesitas](./registered-agent-que-es-por-que-necesitas.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 90 | [reorganizar-banca-llc-mercury-relay-wise](./reorganizar-banca-llc-mercury-relay-wise.md) | sí | — | 6/6 | 6/6 | ✅ |
| 91 | [residentes-no-residentes-llc-diferencias](./residentes-no-residentes-llc-diferencias.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 92 | [retenciones-irpf-factura](./retenciones-irpf-factura.md) | — | — | 6/6 | 6/6 | ✅ |
| 93 | [revolut-business-crs-reporting-fiscal](./revolut-business-crs-reporting-fiscal.md) | sí | — | 6/6 | 6/6 | ✅ |
| 94 | [riesgos-fiscales-mala-estructuracion-internacional](./riesgos-fiscales-mala-estructuracion-internacional.md) | sí | — | 6/6 | 6/6 | ✅ |
| 95 | [separar-dinero-personal-llc-por-que-importa](./separar-dinero-personal-llc-por-que-importa.md) | sí | — | 6/6 | 6/6 | ✅ |
| 96 | [single-member-multi-member-llc-implicaciones-fiscales](./single-member-multi-member-llc-implicaciones-fiscales.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 97 | [sociedad-limitada-espana-costes-ventajas](./sociedad-limitada-espana-costes-ventajas.md) | sí | — | 6/6 | 1/6 | ⚠ |
| 98 | [tengo-llc-checklist-gestion-correcta](./tengo-llc-checklist-gestion-correcta.md) | sí | — | 6/6 | 6/6 | ✅ |
| 99 | [testaferros-prestanombres-llc-ilegal-riesgos](./testaferros-prestanombres-llc-ilegal-riesgos.md) | sí | — | 6/6 | 6/6 | ✅ |
| 100 | [tiempos-pagos-ach-wire-transfer](./tiempos-pagos-ach-wire-transfer.md) | sí | — | 6/6 | 6/6 | ✅ |
| 101 | [tramos-irpf-2026](./tramos-irpf-2026.md) | — | — | 6/6 | 6/6 | ✅ |
| 102 | [tributacion-llc-segun-actividad-economica](./tributacion-llc-segun-actividad-economica.md) | sí | — | 3/6 | 6/6 | ⚠ |
| 103 | [tributacion-pass-through-llc-como-funciona](./tributacion-pass-through-llc-como-funciona.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 104 | [vender-o-cerrar-llc-comparativa-practica](./vender-o-cerrar-llc-comparativa-practica.md) | sí | — | 6/6 | 6/6 | ✅ |
| 105 | [ventajas-desventajas-llc-no-residentes](./ventajas-desventajas-llc-no-residentes.md) | sí | — | 1/6 | 6/6 | ⚠ |
| 106 | [visa-mastercard-reporting-tarjetas-hacienda](./visa-mastercard-reporting-tarjetas-hacienda.md) | sí | — | 6/6 | 6/6 | ✅ |
| 107 | [w8-ben-y-w8-ben-e-guia-completa](./w8-ben-y-w8-ben-e-guia-completa.md) | sí | — | 6/6 | 6/6 | ✅ |
| 108 | [wise-bancos-llc-stack-bancaria-completa](./wise-bancos-llc-stack-bancaria-completa.md) | sí | — | 6/6 | 6/6 | ✅ |
| 109 | [wise-business-crs-reporting-fiscal](./wise-business-crs-reporting-fiscal.md) | sí | — | 6/6 | 6/6 | ✅ |
| 110 | [wise-business-llc-guia](./wise-business-llc-guia.md) | sí | — | 6/6 | 6/6 | ✅ |
| 111 | [wise-iban-llc-que-reporta-hacienda](./wise-iban-llc-que-reporta-hacienda.md) | sí | — | 6/6 | 6/6 | ✅ |

## Idempotencia y reversibilidad

- Cada inyección está envuelta en `<!-- exentax:cta-conv-v1 -->` … `<!-- /exentax:cta-conv-v1 -->`. Una segunda corrida del script reemplaza el bloque (no lo duplica) y mantiene la cobertura.
- Para revertir el pase: borrar todos los bloques `exentax:cta-conv-v1` con `sed -i '/<!-- exentax:cta-conv-v1 -->/,/<!-- \/exentax:cta-conv-v1 -->/d' client/src/data/blog-content/**/*.ts`.
- El número de teléfono y WhatsApp viven en `client/src/lib/constants.ts`. Si cambian, el script debe re-ejecutarse para regenerar los enlaces inyectados.