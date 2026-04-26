# SUMMARY — Auditoría conversión 111 artículos ES (2026-04)

Generado: 2026-04-26 · Fuente: `docs/audits/2026-04/conversion/audit-es.md`

## Totales

- Auditados: **111** (los 112 ES menos `cuanto-cuesta-constituir-llc`, cubierto por Task #1)
- **PASA:** 111 (100.0%)
- **FALLA:** 0 (0.0%)

- Word count: min 2535 · mediana 3236 · máx 5617
- Artículos < 2.500 palabras: **0** / 111

## Top 10 categorías de fallo

| # | Categoría | Artículos afectados |
|---:|---|---:|

## Distribución por número de fallos por artículo

| Nº de categorías que fallan | Artículos |
|---:|---:|
| 0 | 111 |

## Lista priorizada de reescritura (top 30)

Criterio: tráfico potencial × distancia al test de conversión (nº de categorías que fallan). La columna **score** es la métrica compuesta interna; sólo sirve para ordenar.

| # | Slug | Word count | Fallos | Tráfico | Score | Categorías |
|---:|---|---:|---:|---:|---:|---|

## Notas para la ola B (reescritura)

- El plan corto por artículo está en `audit-es.md`. La lista priorizada aquí indica el orden en el que abordar la ola B para máximo impacto.
- El umbral 2.500 palabras del brief es duro — varios artículos cortos pasarán test si se completan secciones (FAQ, escenarios reales, comparativa cuantitativa) en lugar de añadir relleno.
- Las heurísticas tienen ~5-10 % de falsos positivos (sobre todo en `gancho-generico` cuando el tema impone un opener definicional). Cualquier artículo en zona dudosa debe re-evaluarse antes de tocar.
- Las categorías `exentax-invisible`/`exentax-forzado` son señales de calibrado: ningún artículo debería tener < 2 ni > 22 menciones a Exentax. Ajustar a 4-12 menciones repartidas.
- `datos-sin-fuente` se activa sólo cuando el artículo hace afirmaciones legales (IRS, FinCEN, LIRPF, DAC, Modelo 720…). Artículos puramente operativos no caen en esta categoría aunque citen pocas fuentes.
- Esta auditoría es **read-only**: ni una línea de `client/src/data/blog-content/**` ha sido modificada. La ola B (downstream) será la que aplique los planes.

