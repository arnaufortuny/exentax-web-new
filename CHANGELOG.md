# Changelog

Todos los cambios notables de este repositorio se documentan aquí.
Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased] — 2026-04-22

### Limpieza estructural del repositorio
- Historial consolidado en un único commit `Exentax web — snapshot production-ready`
  tras rebase/squash completo (rewrite de autor a `Arnau Fortuny`).
- Ramas remotas obsoletas eliminadas: 21 × `subrepl-*`, `replit-agent`, `main-repl/main`.
- Tag `exentax-3.0` re-apuntado al commit activo (el histórico `ad602a1` quedó huérfano).
- `screenshots/` eliminado (capturas sueltas no referenciadas).
- `.gitignore` extendido para ignorar `exentax-web/audits/` (outputs regenerables
  de `scripts/audit-markdown-quality.mjs`).
- `exentax-web/audits/markdown-quality.json` y `traducciones-mejoradas.json`
  dejan de estar versionados (el segundo era dead file, eliminado del disco).

### Datos fiscales 2026 actualizados
- `shared/lib/calculator-config.ts`:
  - `SS_AUTONOMO_BRACKETS_2025` → `SS_AUTONOMO_BRACKETS_2026` con los 15 tramos
    oficiales 2026: **200,00 € (tramo 1) → 604,80 € (tramo 15)**. Los 12 valores
    intermedios estaban desactualizados vs la tabla RETA 2026 (venían de 2025).
  - Comentarios de `IRPF_BRACKETS` y `SPAIN_DIVIDEND_BRACKETS` actualizados a 2026
    + referencia cruzada al artículo `tramos-irpf-2026.ts`.
  - Comentario de `TARIFA_PLANA_MONTHLY_ES` (80 €/mes) actualizado (RD-Ley 13/2022
    prorrogado 2026).
- `client/src/lib/calculator.ts` + `calculator.test.ts`: imports renombrados.
  116/116 aserciones siguen pasando.

### Precios Exentax unificados (2.000 € setup / 1.400 €/año mantenimiento)
Todas las apariciones con `~1.500 €/año` o aproximaciones (`~`) sustituidas por
los valores canónicos exactos:

| Archivo | Antes | Después |
|---|---|---|
| `client/src/i18n/locales/es.ts:2384` | `~2.000 € de setup y ~1.500 €/año` | `2.000 € de setup y 1.400 €/año` |
| `client/src/i18n/locales/ca.ts:1963` | `~2.000 € de setup i ~1.500 €/any` | `2.000 € de setup i 1.400 €/any` |
| `client/src/i18n/locales/de.ts:2190` | `~2.000 € Setup und ~1.500 €/Jahr` | `2.000 € Setup und 1.400 €/Jahr` |
| `client/src/i18n/locales/en.ts:2188` | `~€2,000 setup and ~€1,500/year` | `€2,000 setup and €1,400/year` |
| `client/src/i18n/locales/fr.ts:2191` | `~2 000 € de setup et ~1 500 €/an` | `2 000 € de setup et 1 400 €/an` |
| `client/src/i18n/locales/pt.ts:2194` | `~€2.000 de setup e ~€1.500/ano` | `€2.000 de setup e €1.400/ano` |
| `client/src/components/calculator/CalculatorResults.tsx:210` | `~2.000 € … ~1.400 €` (fallback) | `2.000 € … 1.400 €` (fallback) |

### SEO
- `client/src/components/SEO.tsx`: añadido `og:locale:alternate` para las otras
  5 locales en cada render. Completa la cobertura Open Graph multilingüe.

### Identidad Git
- `user.name = Arnau Fortuny`
- `user.email = 240033972+arnaufortuny@users.noreply.github.com`

### Verificaciones que pasan tras los cambios
- `tsc --noEmit` → exit 0, 0 errores.
- `validate-i18n.ts` → 6 idiomas con 1552 claves cada uno, sin placeholders rotos,
  sin phantom keys, 360 allowlisted entries válidas.
- `calculator.test.ts` → 116/116 aserciones.
- `check-typography-rule0.mjs` → 0 violaciones.
- `brand-casing-check.mjs` → sin `ExenTax`.
- `audit-pt-pt.mjs` → sin brasileñismos.
- `blog-content-lint.mjs` → 670 ficheros, sin menciones prohibidas.
- `seo-check-links.mjs` → sin enlaces internos rotos.

### Sin cambios funcionales
- API, rutas, esquema DB, webhooks Discord (retirados ya), plantillas de email,
  slash commands, integraciones Google (Calendar/Meet/Search Console), IndexNow
  y sitemap dinámico no se han tocado — la auditoría confirmó estado operativo.
