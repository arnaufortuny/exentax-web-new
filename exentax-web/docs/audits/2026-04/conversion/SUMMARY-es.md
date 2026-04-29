# SUMMARY — Auditoría conversión 111 artículos ES (2026-04)

Generado: 2026-04-29 · Fuente: `docs/audits/2026-04/conversion/audit-es.md`

## Totales

- Auditados: **111** (los 112 ES menos `cuanto-cuesta-constituir-llc`, cubierto por Task #1)
- **PASA:** 94 (84.7%)
- **FALLA:** 17 (15.3%)

- Word count: min 2563 · mediana 3407 · máx 5728
- Artículos < 2.500 palabras: **0** / 111

## Top 10 categorías de fallo

| # | Categoría | Artículos afectados |
|---:|---|---:|
| 1 | `gancho-generico` | 11 |
| 2 | `exentax-forzado` | 5 |
| 3 | `datos-sin-fuente` | 1 |

## Distribución por número de fallos por artículo

| Nº de categorías que fallan | Artículos |
|---:|---:|
| 0 | 94 |
| 1 | 17 |

## Lista priorizada de reescritura (top 30)

Criterio: tráfico potencial × distancia al test de conversión (nº de categorías que fallan). La columna **score** es la métrica compuesta interna; sólo sirve para ordenar.

| # | Slug | Word count | Fallos | Tráfico | Score | Categorías |
|---:|---|---:|---:|---:|---:|---|
| 1 | `operating-agreement-llc-que-es` | 3645 | 1 | 40 | 41 | `gancho-generico` |
| 2 | `mantenimiento-anual-llc-obligaciones` | 2972 | 1 | 38 | 39 | `exentax-forzado` |
| 3 | `nomada-digital-residencia-fiscal` | 4508 | 1 | 21 | 22 | `gancho-generico` |
| 4 | `registered-agent-que-es-por-que-necesitas` | 3203 | 1 | 18 | 19 | `gancho-generico` |
| 5 | `documentos-llc-cuales-necesitas` | 3024 | 1 | 14 | 15 | `exentax-forzado` |
| 6 | `iban-swift-routing-number-que-son` | 3149 | 1 | 2 | 3 | `gancho-generico` |
| 7 | `auditoria-rapida-llc-12-puntos-30-minutos` | 3717 | 1 | 0 | 1 | `exentax-forzado` |
| 8 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | 3538 | 1 | 0 | 1 | `gancho-generico` |
| 9 | `errores-criticos-llc-ya-constituida` | 4531 | 1 | 0 | 1 | `exentax-forzado` |
| 10 | `fiscalidad-socios-llc-cambio-residencia-mid-year` | 3950 | 1 | 0 | 1 | `gancho-generico` |
| 11 | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | 3548 | 1 | 0 | 1 | `datos-sin-fuente` |
| 12 | `primer-mes-llc-que-esperar` | 2982 | 1 | 0 | 1 | `gancho-generico` |
| 13 | `privacidad-llc-americana-secreto-ventaja` | 3180 | 1 | 0 | 1 | `gancho-generico` |
| 14 | `que-pasa-si-no-presentas-5472-multas-irs` | 4878 | 1 | 0 | 1 | `exentax-forzado` |
| 15 | `tengo-llc-checklist-gestion-correcta` | 4151 | 1 | 0 | 1 | `gancho-generico` |
| 16 | `wise-business-crs-reporting-fiscal` | 3455 | 1 | 0 | 1 | `gancho-generico` |
| 17 | `wise-iban-llc-que-reporta-hacienda` | 4598 | 1 | 0 | 1 | `gancho-generico` |

## Notas para la ola B (reescritura)

- El plan corto por artículo está en `audit-es.md`. La lista priorizada aquí indica el orden en el que abordar la ola B para máximo impacto.
- El umbral 2.500 palabras del brief es duro — varios artículos cortos pasarán test si se completan secciones (FAQ, escenarios reales, comparativa cuantitativa) en lugar de añadir relleno.
- Las heurísticas tienen ~5-10 % de falsos positivos (sobre todo en `gancho-generico` cuando el tema impone un opener definicional). Cualquier artículo en zona dudosa debe re-evaluarse antes de tocar.
- Las categorías `exentax-invisible`/`exentax-forzado` son señales de calibrado: ningún artículo debería tener < 2 ni > 22 menciones a Exentax. Ajustar a 4-12 menciones repartidas.
- `datos-sin-fuente` se activa sólo cuando el artículo hace afirmaciones legales (IRS, FinCEN, LIRPF, DAC, Modelo 720…). Artículos puramente operativos no caen en esta categoría aunque citen pocas fuentes.
- Esta auditoría es **read-only**: ni una línea de `client/src/data/blog-content/**` ha sido modificada. La ola B (downstream) será la que aplique los planes.

