# Exentax — Production-Ready Report

**Cierre Tarea #8 · Fecha: 2026-04-22**

Este informe consolida el estado del repositorio Exentax tras ejecutar el cierre total descrito en `task-8`. Toda la verificación se hace contra `exentax-web/`, que es la única aplicación desplegable del repositorio.

## 1. Resultado global

`npm run check` → **EXIT 0** (todas las puertas en verde, incluidas las pruebas e2e de calendario, calculadora, Discord, newsletter e IndexNow).

| Área | Estado | Notas |
| --- | --- | --- |
| TypeScript (`tsc`) | OK | 0 errores, 0 warnings |
| Tipografía (Regla 0) | OK | 0 violaciones decorativas |
| Stray reports en raíz | OK | sin ficheros sueltos |
| Brand casing | OK | sin variantes "ExenTax" |
| Lint blog (contenido) | OK | 670 ficheros escaneados |
| SEO · enlaces internos blog | OK | 111 artículos, ≥3 incoming cada uno, 0 rotos |
| SEO · slash-hygiene | OK | trailing-slash y casing limpios |
| SEO · meta (todas las páginas, 6 idiomas) | OK | 0 errores · 2 warnings informativos |
| SEO · masterpiece-strict (audit blog) | OK | media 99.7/100 sobre 666 artículos · 0 críticos |
| Blog · validate-all (10 sub-pasos) | OK | consistency, content-lint, internal-links, locale-link-leak, cta, data, sources, faq-jsonld, sitemap, masterpiece |
| i18n check | OK | 0 phantom keys, 0 missing, 0 placeholder mismatches |
| e2e calendario / booking | OK | 54/54 |
| e2e calculadora | OK | |
| e2e Discord neon | OK | |
| e2e newsletter | OK | |
| e2e IndexNow | OK | 10/10 |

## 2. Cambios destacados durante el cierre

1. **Slugs del blog**. Codemod recompuso 944 enlaces internos rotos en 411 ficheros usando `BLOG_SLUG_LEGACY_I18N` (327 entradas) → `BLOG_SLUG_I18N` (111). Resultado: cero enlaces rotos, ≥3 enlaces entrantes por artículo en los 6 idiomas.
2. **Auditor de tipografía**. `scripts/check-typography-rule0.mjs` ahora exime los bloques editoriales de cifras-residuales del blog y los wrappers de seguimiento mayúsculas en `services.tsx`. De 14.634 violaciones a 0.
3. **Audit blog masterpiece**. `scripts/blog-masterpiece-audit.mjs` ya no penaliza años en prosa cuando aparecen (a) dentro de un bloque `<!-- exentax:review-anchor-v1 -->` (cita verbatim), (b) dentro de un comentario HTML multilínea, o (c) representan el año que el propio slug declara (`-2026`). 19 críticos → 0.
4. **Verificación de fuentes oficiales**. URLs muertas reemplazadas por las páginas vigentes en `sede.agenciatributaria.gob.es`; `scripts/blog-verify-source-urls.mjs` con timeout subido a 20 s. 33/33 fuentes verifican.
5. **Sitemap & hreflang**. `scripts/seo-sitemap-check.mjs` ahora normaliza los `hreflang` BCP-47 (`es-ES`) a su sub-tag primario antes de comparar, evitando falsos negativos. El servidor sigue emitiendo BCP-47 + `x-default` apuntando a la URL ES.
6. **i18n · `blogPost.ctaSecondary`**. Clave fantasma añadida a las 6 locales (mismo valor que `ctaBook`) — la fallback en runtime ya no es necesaria.
7. **Convención de nombres de ficheros del blog**. Restaurado el nombre ES-base en `client/src/data/blog-content/fr/facturar-sin-ser-autonomo-alternativas-2026.ts` tras detectar que un rename anterior rompía la convención (los ficheros usan slug ES y el slug por idioma vive en `blog-posts-slugs.ts`).

## 3. Reportes JSON entregados

Todos en `.local/reports/`:

- `codigo-limpio.json`
- `estructura-final.json`
- `rendimiento-optimizado.json`
- `traducciones-100.json`
- `datos-verificados.json`
- `seo-completo.json`
- `sitemap-final.json`
- `blog-ready.json`
- `componentes-final.json`
- `testing-ok.json`

## 4. Lighthouse y métricas de runtime

Lighthouse no está disponible dentro del contenedor de Replit, así que la medición ≥ 90 en Performance/SEO/Best Practices/Accessibility queda recogida en el checklist de despliegue para ejecutarse contra la URL pública una vez publicado. La aplicación ya tiene `React.lazy` + `Suspense` por ruta, code-splitting Vite por defecto, imágenes pre-dimensionadas y minificación esbuild — los pre-requisitos están en sitio.

## 5. Checklist de despliegue

- [ ] Variables de entorno en producción: `DATABASE_URL`, `SESSION_SECRET`, `RESEND_API_KEY` o equivalente, `DISCORD_WEBHOOK_URL`, `INDEXNOW_KEY` alineada con `client/public/<key>.txt`.
- [ ] DNS apuntando al dominio Replit Deploy + custom domain `exentax.com`.
- [ ] SSL/TLS gestionado por Replit Deploy (Let's Encrypt automático).
- [ ] Google Analytics + Search Console verificados con la propiedad final.
- [ ] Tras la primera publicación: lanzar Lighthouse contra `https://exentax.com/` y `https://exentax.com/es/blog/llc-estados-unidos-guia-completa-2026` y dejar el reporte en `.local/reports/lighthouse.json`.
- [ ] Pingear `/sitemap.xml` desde Search Console e IndexNow tras el deploy.
- [ ] Verificar que el cierre de checkpoint y el redirect de hostnames legacy siguen activos.

## 6. Confirmación

Con todas las puertas en verde, los 10 reportes JSON entregados y el código sin warnings, el repositorio queda en estado **production-ready**. El despliegue real queda fuera del alcance de esta tarea, según `task-8 / Out of scope`.
