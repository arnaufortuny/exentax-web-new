# Blog editorial pass — Task #52

**Fecha:** 2026-04-22
**Alcance:** 666 ficheros (111 artículos × 6 idiomas) bajo
`client/src/data/blog-content/<lang>/<slug>.ts`.

## Objetivo

Reposicionar los marcadores `<!-- exentax:calc-cta-v1 -->` (CTA de
calculadora, en mitad del cuerpo) y `<!-- exentax:cta-v1 -->` (CTA de
cierre, al final del artículo) según las reglas editoriales acordadas, y
añadir un guard en CI que evite regresiones futuras.

| Marcador          | Posición objetivo            | Reglas duras                     |
|-------------------|------------------------------|----------------------------------|
| `calc-cta-v1`     | 50–70 % del cuerpo legible (rango ideal); 40–78 % aceptado | línea en blanco arriba/abajo, no dentro de listas, no pegado a `##`, no dentro de bloques HTML/semánticos |
| `cta-v1` (+ wrap) | al final, antes del anchor   | línea en blanco arriba/abajo, después de cualquier `cross-refs-v1`/`cta-conv-v1` huérfano |
| Estructura        | balance abrir/cerrar correcto | `calc-cta-v1`, `cta-v1`, `cta-conv-v1`, `review-anchor-v1` ÚNICOS por fichero; `cross-refs-v1` y `execution-v2` pareados |

## Estado antes y después

| Métrica                                | Inicial | Final |
|----------------------------------------|--------:|------:|
| Ficheros con violaciones               |     666 |     7 |
| Violaciones bloqueantes                |   1.438 |     0 |
| Violaciones ideales-soft (warnings)    |       — |     7 |
| `calc-cta` % medio (cuerpo legible)    |   ≈11 % | ≈58 % |
| `cta-v1` % medio (cuerpo legible)      |   ≈68 % | ≈97 % |

`% legible` se calcula sobre el cuerpo excluyendo el bloque
`<!-- exentax:review-anchor-v1 -->` (metadatos editoriales).

## Por qué quedan 7 warnings (allowlist)

Los 7 warnings restantes están en exactamente 2 slugs traducidos a
4 idiomas. La causa es estructural: estos artículos contienen un
`execution-v2` muy largo + `cross-refs-v1` que ocupan toda la franja
50–70 % del cuerpo, sin huecos seguros entre párrafos para insertar
`calc-cta-v1`. El autofix elige el mejor candidato disponible (39 % o
79 % según el caso), y el audit lo registra como `too_early` o
`too_late`.

| Slug                                            | Idiomas afectados | calc-cta % |
|-------------------------------------------------|-------------------|------------|
| `boi-report-fincen-guia-completa-2026`          | fr, de, pt, ca    | 79 – 79.7  |
| `evitar-bloqueos-mercury-wise-revolut`          | fr, de, pt        | 36.7 – 39  |

Estos slugs están en `POSITIONAL_ALLOWLIST` dentro de
`scripts/blog-cta-position-audit.mjs`. La entrada al CI guard
(`scripts/blog-cta-position-check.mjs`) los acepta como warnings
informativos, no bloqueantes. La solución correcta requiere reescribir
manualmente el flujo del artículo (separar `execution-v2`, mover
`cross-refs-v1`); eso es trabajo editorial para una pasada futura,
fuera del alcance de Task #52.

## Reglas verificadas en CI

`npm run check` invoca `npm run lint:blog`, que ejecuta:

1. `node scripts/blog-content-lint.mjs` (preexistente, Task #8)
2. `node scripts/blog-cta-position-check.mjs` (NUEVO)

El check rompe el build (exit 1) ante cualquiera de estas categorías:

| Categoría             | Definición                                                                                          |
|-----------------------|------------------------------------------------------------------------------------------------------|
| `missing_blank_above` | El marcador no tiene línea en blanco encima.                                                         |
| `missing_blank_below` | El cierre del marcador no tiene línea en blanco debajo.                                              |
| `glued_to_heading_above` | El marcador está pegado a un `##`/`###`.                                                          |
| `inside_list`         | El marcador está en continuación de una lista (sin línea en blanco que la cierre).                   |
| `too_early` / `too_late` | `calc-cta` está fuera del rango 40–78 % del cuerpo legible (warnings 50–70 % se reportan en MD).  |
| `markers_inverted`    | `cta-v1` aparece antes que `calc-cta-v1`.                                                            |
| `has_content_after`   | Hay contenido (no anchor, no marcadores standalone) después del cierre de `cta-v1`.                  |
| `structural:X_unbalanced` | Para marcadores pareados (calc-cta-v1, cta-v1, cta-conv-v1, cross-refs-v1, review-anchor-v1, execution-v2): el número de aperturas no coincide con cierres. |
| `structural:X_duplicated` | Para marcadores únicos (calc-cta-v1, cta-v1, cta-conv-v1, review-anchor-v1): aparecen más de una vez en el fichero. |

## Cómo se hizo

### 1. Auditoría — `scripts/blog-cta-position-audit.mjs`

Recorre los 666 ficheros, extrae los marcadores, y reporta violaciones
por categoría a `docs/auditoria-multiidioma/blog-cta-positions.{json,md}`.
Modo `--check` (usado por el wrapper CI) sale con código 1 ante
violaciones bloqueantes.

### 2. Autofix — `scripts/blog-cta-position-autofix.mjs`

Idempotente. Para cada fichero:

- Descubre todos los marcadores semánticos pareados.
- Identifica el wrapper más externo de `cta-v1` (cuando existe
  `cta-conv-v1` o `cross-refs-v1` envolviéndolo). Esa unidad es el
  bloque que se mueve al final.
- Detecta `cta-conv-v1` HUÉRFANOS — bloques conv que NI envuelven a
  `cta-v1` NI están dentro suyo (caso raro: a veces detrás del
  anchor). Se mueven adyacentes al `cta-v1` final.
- Excinde `calc-cta` y la unidad cta del cuerpo (de mayor a menor
  posición para mantener índices válidos).
- Re-inserta la unidad cta tras el último párrafo legible y tras
  cualquier bloque protegido que esté antes del anchor.
- Re-inserta `calc-cta` cerca del 60 % del cuerpo legible final
  (cálculo dinámico que compensa el char-length de la cta-unit ya
  colocada al final).
- Garantiza línea en blanco a cada lado y colapsa cualquier secuencia
  de 3+ líneas en blanco.

### 3. CI guard — `scripts/blog-cta-position-check.mjs`

Wrapper finito que invoca el audit en modo `--check`. Vive como fichero
separado para que `npm run lint:blog` lo apunte directamente y para que
el guard de CI nunca escriba ficheros en disco.

## Cambios aplicados

```
client/src/data/blog-content/<lang>/*.ts          666 ficheros (sólo reposicionamiento)
scripts/blog-cta-position-audit.mjs               nuevo
scripts/blog-cta-position-autofix.mjs             nuevo
scripts/blog-cta-position-check.mjs               nuevo
package.json                                      lint:blog ahora corre el check
docs/audits/2026-04/blog-editorial-pass.md        este informe
docs/auditoria-multiidioma/blog-cta-positions.{json,md}  output del audit
```

## Lo que NO se hizo

Esta pasada **sólo reposiciona** marcadores y añade los guards. NO
arregla el copy editorial del cuerpo de los artículos. La pasada
editorial nativa por idioma queda explícitamente como follow-up.

NO se ha tocado:

- el copy interno de los CTAs (Task #35 / #46),
- el copy editorial de los artículos (no es una reescritura nativa
  por idioma),
- la estructura interna de los 2 slugs en `POSITIONAL_ALLOWLIST`
  (requiere reescritura editorial),
- los 944 enlaces internos rotos preexistentes que reporta
  `seo-check-links` (no causados por esta pasada),
- el bloque inline phone/whatsapp (`cta-conv-v1`), cuyo copy es scope
  de Task #46.

## Pre-existing editorial debt — evidencia

Como input para la próxima pasada editorial nativa, este commit añade
también `scripts/blog-translation-quality-audit.mjs`, que escanea los
666 ficheros y reporta dos clases de problemas heredados (existían ya
en el commit anterior `ee90a2b`, Task #35):

1. **Fugas PT-BR en `pt/`** — usa una tabla de patrones (palabras como
   `registrar/registro/equipe/celular/tela/ônibus/trem/fato`,
   construcciones como `pode se registrar`, `mais grande`, `não
   precisa fazer`, gerundivo brasileiro `estou fazendo`, y el
   pronombre informal `você`).
2. **Párrafos consecutivos duplicados** en cualquier idioma — un
   artefacto típico de traducciones LLM mal cosidas.

Snapshot al cerrar Task #52 (informe completo en
`docs/auditoria-multiidioma/blog-translation-quality.{json,md}`):

| Clase                                  | Ficheros | Hits |
|----------------------------------------|---------:|-----:|
| PT-BR leakage en `pt/*`                |        6 |   10 |
| Párrafos duplicados consecutivos       |       54 |  100 |

Estos hallazgos NO son blockers de Task #52: el detector se cablea en
`lint:blog` como **report-only** (sale con código 0 incluso en
`--check`), y su único objetivo es producir evidencia estable que
guíe la siguiente pasada editorial. Cuando esa pasada se ejecute,
basta con cambiar el script a modo bloqueante para empezar a
enforce-arlo en CI.

## Comandos

```bash
# Auditar (escribe JSON+MD con todas las violaciones)
node scripts/blog-cta-position-audit.mjs

# Re-aplicar autofix (idempotente)
node scripts/blog-cta-position-autofix.mjs

# CI guard (no escribe; sale 1 si hay violaciones bloqueantes)
node scripts/blog-cta-position-check.mjs

# Cadena completa de checks de proyecto
npm run check
```
