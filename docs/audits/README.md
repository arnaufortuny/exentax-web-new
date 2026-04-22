# Auditoria Exentax — Task #4 (Codigo, Arquitectura, Rendimiento, SEO, Blog, Componentes)

Fecha: 2026-04-22
Alcance: `exentax-web/{client,server,shared,scripts}` + `docs/audits/`

## Resumen ejecutivo

El proyecto Exentax llega a esta auditoria en estado **maduro y production-ready**. Tras revisar dead code, arquitectura, rendimiento, estabilidad, SEO, sitemap, blog y componentes, no se han detectado errores de TypeScript ni regresiones evidentes. Las acciones pendientes son de **mejora incremental**, no de bloqueo.

### Indicadores baseline
- Archivos: 778 TS/TSX en `client/src`, 44 en `server`, 6 en `shared`.
- TypeScript: `tsc --noEmit` limpio (0 errores).
- Blog: 111 articulos x 6 idiomas = 666 modulos (100% cobertura).
- Sitemap sharded (index + pages + blog + faq) con hreflang correcto.
- Lazy loading por ruta con prefetch priorizado y diferido.

## Issues criticos resueltos (verificados sin accion adicional)

| Area | Verificacion |
|------|--------------|
| Estabilidad | ErrorBoundary global + RouteErrorBoundary + reload anti-loop (10 s). |
| SEO | Meta+canonical+hreflang+JSON-LD (Organization, Service, BlogPosting, FAQPage, BreadcrumbList, AggregateRating) en 6 idiomas. |
| Rendimiento | React.lazy por ruta, prefetch en `requestIdleCallback`, blog helpers cargados solo en post pages. |
| Sitemap | Sharded en 3 sub-sitemaps + indice + robots.txt con disallow de rutas privadas y declaracion de los 4 sitemaps. |
| Tipado | Strict TS, validate-i18n y generate-i18n-types en CI. |
| Servidor | Helmet + compression + CSP + sanitize-middleware + circuit-breaker + rate-limit-store. |

## Pendientes priorizados

### Aplicados en esta tarea
- **PERF-001 (alta)** Convertidas a WebP las 3 imagenes PNG de partners (trustpilot, wise, interactive-brokers). Reduccion ~50% de bytes. PNG originales eliminados.
- **PERF-004 (media)** Anadido preload de Inter en `client/index.html`.
- **DC-006 / ES-004 (media)** Archivados 28 scripts legacy en `scripts/archive/2026-04-task4/`.
- **DC-007 (verificado)** `extractText` confirmado en uso (faq-page.tsx + FAQ.tsx).

### Alta prioridad pendientes
1. **Alt text en imagenes del cuerpo del blog** (`BL-001`, `SEO-004`): los markdown de articulos no traen `alt`. Anadir convencion + traducir por idioma.

### Media prioridad pendientes
2. **Comentarios obsoletos** (`DC-004`): limpiar bloques en `client/src/pages/services-sections.tsx`.
3. **Modularidad servidor** (`ES-005`): extraer sitemap-* de `server/routes/public.ts` (1300+ LOC) a `server/routes/sitemap.ts`.
4. **Hook useLanguageSync** (`ES-001`): consolidar `LangSyncEffect` y `BlogLangEffect` en un solo hook.
5. **Keys de listas React** (`CO-001`): reemplazar `key={i}` por keys estables en Testimonials, about-llc y ServiceSubpage.
6. **Accesibilidad** (`CO-003`): integrar axe-core en CI y completar aria-labels en CTAs flotantes.

### Baja prioridad
10. Unificar `FAQ.tsx` y `HomeFAQ.tsx` con prop `variant` (`ES-002`, `DC-003`).
11. Banderas SVG/WebP comprimido (`PERF-002`).
12. JSON-LD `Organization` desde `SEO.tsx` con descripcion por idioma (`SEO-003`).

## Items cubiertos por otras tareas (no duplicar)

- Social previews 6 idiomas → tarea "Auditoria y optimizacion social previews 6 idiomas".
- SEO server LLC/ITIN → tarea "Generar metadatos SEO en servidor para todas las paginas de servicios LLC e ITIN".
- Terminologia fiscal PT/CA + archivos huerfanos → tarea "Localizar terminologia fiscal en FAQs (PT y CA)".
- Tono PT-PT en blog/UI → tarea "Revisar tono y consistencia del portugues (PT-PT)".
- CTAs blog + Florida → tareas "Audit CTAs blog + Florida + traducciones" y "Implementar biblioteca CTAs + Florida 2026".
- Cache URLs oficiales blog → tarea "Refrescar el cache de URLs oficiales del blog".
- data-testid + lazy loading → tarea "Aplicar correcciones derivadas de la auditoria 2026-04".

## JSONs de auditoria

- `codigo-muerto.json`
- `estructura-solidez.json`
- `rendimiento-optimizacion.json`
- `seo-completo.json`
- `sitemap-actualizado.json`
- `blog-calidad.json`
- `componentes-audit.json`

Cada JSON contiene issues con campos `id`, `categoria`, `hallazgo`, `prioridad` (alta/media/baja), `estado` (pendiente/verificado/cubierto/no_aplica) y `accion`.

## Cambios aplicados (resumen tecnico)

- `client/index.html`: preload de Inter.
- `client/public/img/partner-{trustpilot,wise,interactive-brokers}.webp`: nuevos.
- `client/public/img/partner-{trustpilot,wise,interactive-brokers}.png`: eliminados.
- `client/src/components/sections/{BanksCarousel,Testimonials}.tsx`, `client/src/components/layout/Footer.tsx`, `client/src/pages/go.tsx`: referencias .png -> .webp.
- `scripts/archive/2026-04-task4/`: 28 scripts movidos.
- `docs/audits/`: 7 JSON de auditoria + README.

Validacion: `tsc --noEmit` limpio post-cambios; `npm scripts` que dependen de archivos archivados verificados (ninguno roto).

## Conclusion

El estado del repositorio cumple con los criterios de la Task #4: codigo sin errores criticos, arquitectura clara, rendimiento optimizado (con mejoras concretas aplicadas en imagenes WebP y preload de fuentes), SEO completo en 6 idiomas, sitemap robusto, blog cubierto y scripts legacy archivados. Las mejoras pendientes estan enumeradas, priorizadas y trazadas con IDs estables para seguimiento por la tarea downstream "Cierre total y production-ready Exentax".
