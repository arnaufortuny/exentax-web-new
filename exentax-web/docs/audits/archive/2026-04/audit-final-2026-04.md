# Auditoría exhaustiva final — Exentax (abril 2026)

**Fecha de cierre:** 2026-04-18
**Alcance:** revisión end-to-end de Exentax (Vite + React + Express, 6 idiomas: ES, EN, FR, DE, PT, CA) para dejar el proyecto listo para producción.
**Objetivo:** SEO impecable, i18n completa, blog editorial limpio (pro-Exentax), cero errores de tipos/build, funcionalidad verificada, documentación al día.

---

## 1. Resultado global

**Veredicto: APROBADO.** Todos los gates automáticos pasan, el build de producción se completa sin avisos críticos, y los endpoints clave responden 200 en el smoke test. El único issue real detectado durante la auditoría (25 enlaces internos cross-locale en posts EN del blog) ha sido corregido.

---

## 2. Evidencia — gates automáticos

Todos ejecutados desde `exentax-web/`:

| Gate | Comando | Resultado |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | **OK** (0 errores) |
| SEO links | `node scripts/seo-check-links.mjs` | **OK** — 0 enlaces rotos, los 74 artículos tienen ≥3 enlaces entrantes |
| Locale lint blog | `node scripts/blog-link-locale-lint.mjs` | **OK** — 380 archivos analizados, todos los `<a href="/blog/...">` coinciden con la carpeta de su idioma |
| Content lint blog | `node scripts/blog-content-lint.mjs` | **OK** — 0 menciones prohibidas (precios, tarifas, dirección) |
| Tipografía regla 0 | `node scripts/check-typography-rule0.mjs` | **OK** — 0 violaciones decorativas en TS/TSX/CSS |
| i18n | `npx tsx scripts/validate-i18n.ts` | **PASS** — 0 claves faltantes, 0 vacías, 0 placeholders inconsistentes; 242 cognados detectados como “possibly untranslated” (esperado: términos de marca, navegación y palabras idénticas entre lenguas romances) |
| SEO blog audit | `node scripts/seo-blog-audit.mjs` | **PASS** — 74 posts × 6 idiomas = 444 artículos. 0 metadatos faltantes, 0 títulos/descripciones duplicados o fuera de rango, 0 problemas H1, 0 saltos jerárquicos, 0 lang-leak (excepto 1 caso fronterizo preexistente en PT) |
| Build producción | `npm run build` | **OK** — Vite + esbuild, bundle servidor 2.1 MB, bundle cliente principal 1.4 MB |

---

## 3. Smoke test runtime (puerto 5000)

```
GET /                  → 200
GET /en/blog           → 200
GET /api/health        → 200
GET /sitemap.xml       → 200 (599 743 bytes)
GET /sitemap-blog.xml  → 200 (215 586 bytes)
GET /robots.txt        → 200 (disallow correcto: /api/, /admin/, /links, /start, /booking/, query strings UTM/ref/gclid/fbclid/mc_*)
```

---

## 4. Hallazgo único y corrección aplicada

**Hallazgo (fase SEO).** El guard `blog-link-locale-lint` reportó 25 enlaces `<a href="/blog/<slug>">` (sin prefijo de idioma) dentro de 5 posts EN del blog. Estos enlaces apuntaban a slugs en español que, al servirse desde `/en/...`, habrían filtrado contenido ES dentro del subsite EN.

**Complicación.** Una traducción literal de los slugs no funcionaba: el router EN deriva las URLs del mapa `BLOG_SLUG_I18N` (`exentax-web/client/src/data/blog-posts-slugs.ts`), que define un slug canónico EN distinto al ES (p. ej. `wise-business-llc-guia` → `wise-business-with-your-llc-the-complete-guide-to-multi-currency-management`).

**Corrección.** Reescritura programática vía un script de un solo uso que cargó `BLOG_SLUG_I18N` y reemplazó cada `/blog/<slug-es>` por `/en/blog/<slug-en-canónico>` en los 5 archivos afectados:

- `client/src/data/blog-content/en/errores-criticos-llc-ya-constituida.ts`
- `client/src/data/blog-content/en/irs-1120-5472-que-son-cuando-aplican.ts`
- `client/src/data/blog-content/en/llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais.ts`
- `client/src/data/blog-content/en/tengo-llc-checklist-gestion-correcta.ts`
- `client/src/data/blog-content/en/wise-bancos-llc-stack-bancaria-completa.ts`

Total: 25 enlaces corregidos. Tras el fix, `blog-link-locale-lint` y `seo-check-links` pasan en verde.

---

## 5. Estado por área

### 5.1 SEO
- Sitemap principal y sitemap blog generados, cacheados 1h, con `<lastmod>` basado en contenido (no spam de frescura).
- `robots.txt` bloquea áreas privadas y query strings de tracking.
- Hreflang bidireccional, recíproco, con `x-default = /es/...` en cada URL.
- 74 posts × 6 idiomas con título y `metaDescription` reales (no stubs).
- Cero enlaces internos rotos; cada post recibe ≥3 enlaces entrantes.
- Locale-leak corregido (este informe).

### 5.2 i18n
- 1088 claves por idioma, 0 faltantes, 0 vacías, 0 placeholders inconsistentes en ninguno de los 6 locales.
- 242 “possibly untranslated” son cognados aceptables (nav, marca, términos universales como “Marketing”, “Newsletter”). No requieren cambio.
- Tipos generados (`generate-i18n-types.ts`) consistentes con el código.

### 5.3 Blog editorial
- Content-lint no detecta menciones prohibidas (precios fijos, tarifas, dirección, etc.) en ninguno de los 444 artículos.
- Auditoría editorial automatizada limpia (sin titulares/descripciones duplicados, longitudes en rango, jerarquía H1→H2→H3 correcta).
- Voz y posicionamiento pro-Exentax preservados; los gates ya garantizan que no se reintroduzcan menciones bloqueadas en futuras ediciones.

### 5.4 Funcionalidad y código
- `tsc --noEmit` limpio.
- Build de producción OK.
- Workflow `Start application` arranca, `/api/health` 200, conexión a Postgres establecida, migraciones aplicadas, versiones legales sembradas.

### 5.5 Documentación
- `replit.md` actualizado: conteo de posts (74), guard `lint:blog-links` documentado.
- `.env.example` añadido (raíz del repo) con todas las variables requeridas y opcionales que el código consume realmente (`process.env.*`).
- Este informe de cierre.

---

## 6. Pendiente / fuera de alcance

Ninguna acción bloqueante. Para una segunda iteración opcional:

- Reescritura editorial profunda 1×1 de los 444 artículos (sólo necesaria si Exentax decide cambiar tono/posicionamiento; el contenido actual cumple con los gates).
- Añadir featured images a los 73–74 posts por idioma (`no-images` en el reporte SEO; el formato actual es texto-only por decisión editorial).
- Lighthouse audit manual en producción (no automatizable desde el sandbox).
- Endurecer los 242 cognados i18n con marcadores explícitos `// cognate-ok` si se quiere silenciar el ruido del validador.

---

## 7. Cómo reproducir esta auditoría

```bash
cd exentax-web
npx tsc --noEmit
node scripts/seo-check-links.mjs
node scripts/blog-link-locale-lint.mjs
node scripts/blog-content-lint.mjs
node scripts/check-typography-rule0.mjs
node scripts/seo-blog-audit.mjs
npx tsx scripts/validate-i18n.ts
npm run build
```

Smoke test (con servidor arrancado en `:5000`):

```bash
for p in / /en/blog /api/health /sitemap.xml /sitemap-blog.xml /robots.txt; do
  curl -s -o /dev/null -w "%{http_code}  $p\n" http://localhost:5000$p
done
```

---

## Anexo B — Ronda 9 (2026-04-18) — Endurecimiento pre-producción

> Las cifras de esta sección reflejan el estado **al inicio de la ronda 9**, no son acumuladas con rondas previas (1, 3, etc.). Los 12 enlaces rotos en 3 archivos EN listados aquí son los detectados en esta ronda; los 25 enlaces / 5 archivos de la ronda 1 ya estaban resueltos al iniciar.

**Estado global: PASS**

### Gates automáticos (todos verdes)
- `tsc --noEmit`: clean
- `seo-check-links`: 0 enlaces rotos (los 12 EN previos resueltos mapeando a slugs canónicos vía `BLOG_SLUG_I18N`)
- `blog-link-locale-lint`: OK · 370 ficheros escaneados, todos los enlaces internos coinciden con su locale
- `blog-content-lint`: OK
- `check-typography-rule0`: 0 violaciones decorativas
- `seo-blog-audit`: PASS · solo 2 lang-leak en PT (cubierto por follow-up existente, no bloqueante)
- `validate-i18n`: PASS · 0 missing/extra/empty/placeholder · 242 cognados aceptables

### Verificaciones manuales
| Área | Resultado | Nota |
|---|---|---|
| Calculadora IRPF (escala 19/24/30/37/45/47, deducción 5550 €) | PASS | `lib/calculator.ts:107-135` |
| Cuota autónomos 2025 (15 tramos, 200-590 €/mes) | PASS | `lib/calculator.ts:143-162` |
| Sanitización inputs calculadora | PASS | `MONTHLY_MAX = 100000` clamp activo en `components/calculator/index.tsx:98` |
| Reservas — locks de slot/booking, double-book | PASS | `withSlotLock`/`withBookingLock` + `SlotConflictError` |
| Reservas — recovery de recordatorios al arranque | PASS | `server/index.ts:413-485` |
| Helmet CSP/HSTS/Permissions-Policy | PASS | `server/index.ts:50-86,137` |
| Rate limit global + por-endpoint | PASS | 200 req/min global + límites específicos |
| Validación Zod en rutas | PASS | 58 schemas en 22 endpoints (cobertura ~100% de inputs) |
| Cookies/RGPD: banner + consent log + version | PASS | `getCachedPrivacyVersion` + `insertConsentLog` |
| Error handler central + Discord notify 5xx | PASS | `server/index.ts:377-404` |

### npm audit (prod)
8 advisories, **todas en herramientas de build/dev no enviadas al runtime de producción**:
- `drizzle-kit` chain: `@esbuild-kit/*`, `esbuild`, `yaml` (CLI de migraciones, no runtime)
- `path-to-regexp`/`picomatch` vía vite/drizzle-kit (build-time)
- `brace-expansion` (transitivo de globbing dev)

Sin vulnerabilidades en código que se ejecute en producción. Sin acción inmediata.

### Código huérfano (informe, no removido)
Detectados como exportados sin uso externo confirmado, pero conservados por estar previstos para uso futuro o ser API explícita:
- `client/src/components/Tracking.tsx` → `trackOutboundLink` (helper opcional)
- `client/src/data/blog-posts-i18n.ts` → `prefetchBlogI18nForLang`, `getMetaAvailableLangs`

Ningún hallazgo en `server/` tras verificación cruzada (`hasExistingBooking` y `unmarkReminderSent` están en uso activo).

### Cambios aplicados en esta ronda
- Reparados 12 enlaces internos rotos en 3 artículos EN (`wise-bancos-llc-stack-bancaria-completa`, `errores-criticos-llc-ya-constituida`, `tengo-llc-checklist-gestion-correcta`) usando los slugs canónicos EN del mapa `BLOG_SLUG_I18N`.

### Conclusión
La aplicación cumple los criterios de calidad para producción: cálculos correctos, reservas robustas con locks y recovery, validación de inputs en backend y frontend, cabeceras de seguridad correctas, RGPD trazado, sin vulnerabilidades de runtime, sin enlaces rotos. Los follow-ups ya propuestos cubren las mejoras incrementales restantes (traducciones cortas, hero images, detección PT lang-leak).

---

## Addendum — cierre Task #18 (18-abr-2026)

Re-ejecución completa de gates con la base ya saneada y limpieza del único falso positivo conocido del propio auditor:

| Gate | Resultado |
| --- | --- |
| `tsc --noEmit` | OK |
| `npm run seo:check` | OK (74 posts, 0 enlaces rotos, ≥3 entrantes en cada uno) |
| `npm run i18n:validate` | OK (0 missing/extra/empty/placeholders) |
| `npm run lint:blog` | OK (0 menciones prohibidas) |
| `node scripts/blog-link-locale-lint.mjs` | OK (370 archivos, todos los enlaces internos respetan el locale de la carpeta) |
| `node scripts/check-typography-rule0.mjs` | OK (0 violaciones decorativas) |
| `node scripts/seo-blog-audit.mjs` | OK (444 artículos, 0 metadatos fuera de rango, 0 duplicados, 0 H1 issues, **0 lang-leak en todos los idiomas**) |
| `node scripts/link-graph.mjs` | OK (0 artículos under-linked) |
| `npm run build` | OK (Vite + esbuild, sin errores) |
| Smoke runtime | `/sitemap.xml`, `/sitemap-blog.xml`, `/robots.txt` → **200** |

**Cambio aplicado.** `scripts/seo-blog-audit.mjs`: la regla de detección de "fugas de idioma" en PT incluía la palabra `porque`, que es portuguesa legítima ("porque é importante", "porque a LLC é Disregarded"). Eliminado del set `LANG_FORBIDDEN.pt` para que el auditor refleje fielmente la realidad. Tras el ajuste, el reporte queda en cero fugas en los seis idiomas sin tocar contenido editorial.

**Documentación añadida.** `exentax-web/.env.example` con el inventario completo de variables (5 obligatorias en producción + 6 webhooks opcionales + operación + branding + frontend `VITE_GA4_ID`/`VITE_META_PIXEL_ID` + bloque comentado para CI/E2E: `BASE_URL`, `BUILD_ANALYZE`, `*_E2E_PORT`). El bloque obligatorio coincide 1:1 con el fail-fast de `server/index.ts` y la sección "Required environment variables (production)" de `replit.md`.

**Higiene confirmada.** Cero `console.log` en `client/src`, server `console.*` solo dentro de `server/logger.ts`, cero `TODO`/`FIXME` en código de aplicación, SEO centralizado en `<SEO />` en todas las rutas core.

**Veredicto final.** Todos los gates en verde; el proyecto puede publicarse. Mejoras opcionales restantes (artículos pilar, traducciones cortas, hero images, FX en vivo, tests de calculadora, etc.) ya están registradas como tareas independientes y no bloquean el despliegue.
