# scripts/archive/2026-04-orphans

Scripts huérfanos detectados en scan dead-code 2026-04-26 (sesión consolidación).

## Detección

```
for s in blog-i18n-sync-check audit-markdown-quality; do
  refs=$(grep -rl --include="*.json" --include="*.mjs" --include="*.ts" --include="*.sh" \
         "$s" exentax-web 2>/dev/null | grep -v "^exentax-web/scripts/$s" | grep -v node_modules | wc -l)
  echo "$refs $s"
done
```

## Archivados

| Script | Refs externos | Por qué archivado |
|---|---:|---|
| `blog-i18n-sync-check.mjs` | 0 | Sin uso desde package.json ni otros scripts. Audit one-off útil para diagnóstico puntual. |
| `audit-markdown-quality.mjs` | 0 | Solo se referencia a sí mismo. Audit one-off útil para diagnóstico puntual. |

## Re-activación

Si en el futuro se necesitan, mover de vuelta a `scripts/` y opcionalmente
añadir comando en `package.json` (e.g., `"audit:i18n-sync"`,
`"audit:markdown-quality"`).

Ambos scripts son **read-only** (solo emiten reports, no modifican código),
por lo que ejecutarlos cuando haga falta diagnóstico no tiene riesgo.

## Funcionalidad reemplazada

- `blog-i18n-sync-check.mjs`: la cobertura sync `blog-content/{lang}/` vs
  `blog-i18n/{lang}.ts` está cubierta por `blog-data-validate.mjs` y
  el step `coverage` de `blog:validate-all`.
- `audit-markdown-quality.mjs`: las reglas (heading depth, list markers,
  smart-quotes, broken anchors, trailing whitespace) están parcialmente
  cubiertas por `blog-content-lint.mjs` + `blog-masterpiece-audit.mjs`.

Ningún linter activo depende de estos scripts; archivarlos no rompe
ningún workflow.
