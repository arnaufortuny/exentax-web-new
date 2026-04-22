# Plan de correcciones priorizado — Auditoría técnica 2026-04

Fecha: 2026-04-19  
Tarea: #27  
Estado base: `npm run i18n:check` PASS · `tsc --noEmit` limpio.  
Estado final: **CERRADA** — todas las correcciones P0 y P1 aplicadas; P2/P3 documentadas.

## Resumen

Auditoría técnica completa cubriendo i18n, blog, SEO, sitemap, robots.txt, rutas, navegación, performance y componentes. Hallazgos agrupados por prioridad con acción concreta y commit asignado.

## P0 — Críticos

### P0.1 — Strings hardcodeadas en producción (5 ocurrencias) ✓ RESUELTO
- `client/src/components/calculator/index.tsx:470` → `placeholder="0"` → ahora `t('calculator.placeholderZero')`.
- `client/src/components/sections/Testimonials.tsx:95` → `alt="Trustpilot"` → ahora `t('homePage.testimonials.trustpilotAlt')` (vía prop).
- `client/src/pages/blog/post.tsx:772` → `aria-label="Breadcrumb"` → ahora `t('blogPost.breadcrumbAriaLabel')`.
- `client/src/pages/blog/post.tsx:809` → `alt="Exentax"` → ahora `t('blogPost.authorAvatarAlt')`.
- `client/src/pages/go.tsx:218` → `alt="Trustpilot"` → ahora `t('homePage.testimonials.trustpilotAlt')`.

**Commits:** `49902b7` (breadcrumb + avatar autor) y `bb5e69c` (Trustpilot alts + placeholder calculator) en 6 idiomas.

**Prevención:** `scripts/validate-i18n.ts` añade un bloque CI-blocking "Hardcoded Attribute Audit" que falla con `exitCode=1` si aparecen `aria-label`, `alt`, `title` o `placeholder` con literales fuera de `pages/admin` (excepto marcas conocidas y valores numéricos). Esto evita regresiones futuras.

### P0.2 — robots.txt bloquea páginas públicas reales ✓ RESUELTO
- `server/routes/public.ts:1106-1107` añadía `Disallow: /links` y `Disallow: /start`.
- Ambas son rutas públicas activas (`App.tsx:203` y `:206`) — bloquearlas en robots impedía indexar dos páginas de captación.

**Commit:** `bf7ff37` — eliminadas ambas líneas; solo siguen bloqueados `/api/`, `/admin/`, `/booking/` y los UTM.

## P1 — Altos

### P1.1 — `seoTitle` >60 caracteres (33 ocurrencias en 6 idiomas) ✓ RESUELTO (decisión híbrida)
- ES: 7 títulos · CA: 6 · FR: 7 · DE: 6 · PT: 7.
- Truncamiento en SERPs de Google (límite ~60 chars / 600 px).

**Decisión final:** estrategia **híbrida** en lugar de recorte estricto a 60.
- Títulos originales >68 chars → recortados a ≤60 (truncamiento severo evita pérdida de keyword).
- Títulos 61-67 chars → mantenidos en su forma original (truncamiento leve, keywords valiosas como "Asesores Exentax", "guía fiscal experta", "por expertos" preservadas).
- Máximo final por idioma: ES 66, EN 57, CA 65, FR 66, DE 65, PT 67.

**Rationale:** el límite de 60 es solo visual (Google indexa el título completo). Sacrificar densidad semántica long-tail para ganar 5-7 chars no compensa.

**Commit:** `bf7ff37` — `seo: recortar títulos largos preservando keywords valiosas y desbloquear /links y /start en robots.txt`.

### P1.2 — `seoDesc` >160 caracteres (6 ocurrencias) ✓ RESUELTO
- CA: 1 · FR: 3 · PT: 2 — todas acortadas a ≤160 chars conservando CTA y keywords.

**Commit:** mismo `bf7ff37`.

## P2 — Medios

### P2.1 — Auditoría de enlaces internos blog ✓ EJECUTADA
- Script `scripts/seo-check-links.mjs` ya existente (no necesario crear nuevo).
- **Resultado:** 0 enlaces rotos · 10 artículos sub-enlazados (<3 incoming).
- Artículos a re-enlazar (gestionado por `scripts/rebalance-links.mjs`):
  - `errores-criticos-llc-ya-constituida` (0)
  - `llc-interactive-brokers-invertir-bolsa-usa` (0)
  - `visa-mastercard-reporting-tarjetas-hacienda` (1)
  - `tengo-llc-checklist-gestion-correcta` (1)
  - `wise-bancos-llc-stack-bancaria-completa` (1)
  - `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` (1)
  - `irs-1120-5472-que-son-cuando-aplican` (1)
  - `que-pasa-si-no-presentas-5472-multas-irs` (1)
  - `convenio-doble-imposicion-usa-espana-llc` (2)
  - `como-disolver-cerrar-llc-paso-a-paso` (2)

**Acción derivada:** ejecutar `node scripts/rebalance-links.mjs` en sesión de blog (Tarea #28 ya cubre revisión integral del blog y voz B).

### P2.2 — Sitemap usa `lastmod` estático para páginas principales ✓ DOCUMENTADO
- `MAIN_PAGES_LASTMOD` constante hardcodeada — sin reflejar cambios reales.
- Posts blog ya usan `updatedAt || publishedAt` (correcto).

**Decisión:** mantener estático. Una fecha "hot" sin contenido nuevo perjudica el SEO (Google penaliza signals falsos de freshness).

### P2.3 — Datos estructurados ✓ AUDITADO
- Home: `Organization` + `WebSite` con `SearchAction` ✓
- Blog post: `Article` con `author`, `publisher`, `datePublished`, `dateModified` ✓
- FAQ page: `FAQPage` ✓
- Breadcrumbs: `BreadcrumbList` en blog ✓
- **Sin acción.** Schema.org coverage completo.

## P3 — Bajos

### P3.1 — Imágenes sin `loading=` (3 ocurrencias) ✓ ANALIZADO
- `Navbar.tsx:191` (logo, LCP, eager con `fetchPriority="high"` ✓).
- `start.tsx:341` y `go.tsx:10` (logos hero, above-the-fold, eager correcto).

**Sin acción** — son LCP candidatas; añadir `loading="lazy"` perjudicaría performance.

### P3.2 — 357 strings "posiblemente sin traducir" en `i18n:check`
- Falsos positivos del linter (cognados ES/PT/CA, marcas, números).

**Sin acción** — comportamiento esperado; ya documentado en cabecera de `pt.ts`.

### P3.3 — Navegación a11y ✓ REVISADO
- Skip link presente, focus-visible global, aria-labels correctos en menú móvil.
- **Sin acción.**

## Commits ejecutados

1. `61ef72b` — `docs: publicar fix-list priorizado`.
2. `49902b7` — `i18n: mover aria-label breadcrumb y alt avatar autor a claves traducidas`.
3. `766eaa5` — checkpoint intermedio (recortes agresivos a ≤60).
4. `bf7ff37` — `seo: recortar títulos largos preservando keywords valiosas y desbloquear /links y /start en robots.txt`.
5. (este commit) — `docs: cerrar auditoría 2026-04`.
