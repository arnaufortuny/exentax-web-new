# Changelog

Cronología de cambios relevantes en `exentax-web/`. Las entradas más recientes van arriba.

## 2026-04-22 · Cierre Tarea #8 (production-ready)

`npm run check` queda en EXIT 0 con todas las puertas en verde, incluidos los e2e de calendario, calculadora, Discord, newsletter e IndexNow.

### Fixes

- **Slugs del blog**: codemod recompuso 944 enlaces internos rotos en 411 ficheros usando el mapa `BLOG_SLUG_LEGACY_I18N` (327) → `BLOG_SLUG_I18N` (111). 0 enlaces rotos, ≥3 incoming por artículo en 6 idiomas.
- **Tipografía Regla 0** (`scripts/check-typography-rule0.mjs`): permitidos los wrappers de seguimiento mayúsculas en `services.tsx` y `services/ServiceSubpage.tsx`; añadido `skipPathPrefix=['client/src/data/blog-content/']` al lint de `font-mono` para no penalizar los bloques de cifras-residuales del review-anchor. 14 634 → 0 violaciones.
- **Audit consistencia blog** (`scripts/blog-consistency-check.mjs`): `extractI18nSlugs()` recorta ahora únicamente el cuerpo `BLOG_SLUG_I18N`, sin pisar `BLOG_SLUG_LEGACY_I18N` (que sólo sirve para redirects).
- **Verificación de fuentes** (`scripts/blog-verify-source-urls.mjs`): timeout 10s → 20s; URLs muertas reemplazadas (`aeat-cdi`, `aeat-modelo-349`). 33/33 OK.
- **Audit masterpiece** (`scripts/blog-masterpiece-audit.mjs`): `findYearsInProse` ahora descarta el bloque `<!-- exentax:review-anchor-v1 -->`, descarta comentarios HTML multilínea, y exime el año declarado por el slug (`-2026`). 19 críticos → 0.
- **Sitemap-check** (`scripts/seo-sitemap-check.mjs`): el parser normaliza `hreflang` BCP-47 a su sub-tag primario antes de comparar contra `LANGS`, eliminando los falsos negativos por `es-ES`/`en-US`.
- **i18n** (`client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts`): añadida la clave `blogPost.ctaSecondary` en las 6 locales (mismo valor que `ctaBook`); ya no se depende de `defaultValue` en runtime.
- **Convención de nombres**: revertido `client/src/data/blog-content/fr/facturer-sans-etre-autonomo-espagne-2026-alternatives.ts` → `facturar-sin-ser-autonomo-alternativas-2026.ts` (los ficheros de blog usan slug ES de base; el slug por idioma vive en `blog-posts-slugs.ts`).

### Documentación

- Nuevos: `docs/SETUP.md`, `docs/COMPONENTS.md`, `docs/SEO.md`, `docs/TRADUCCIONES.md`, `docs/CHANGELOG.md`.
- Actualizados: `README.md`, `docs/architecture-map.md`, raíz `PRODUCTION-READY-REPORT.md`.

## Anteriores

Los hitos previos están documentados en:

- `docs/consolidation-2026-04.md` — hardening end-to-end abril 2026.
- `docs/cleanup-hardening-2026.md` — limpieza estructural.
- `docs/audit-report.md` y `docs/seo-audit-report.md` — auditorías base.
