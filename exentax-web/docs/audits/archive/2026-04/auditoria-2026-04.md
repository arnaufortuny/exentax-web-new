# Auditoría integral del proyecto — abril 2026

> Documento de **solo lectura**: recoge hallazgos detectados sobre el estado actual de `exentax-web`. No se ha modificado ningún código de aplicación, traducción, asset ni configuración.
>
> - Fecha: 2026-04-19
> - Alcance: `exentax-web/` (cliente, servidor, compartido, scripts, docs) + raíz del workspace.
> - Severidades: **Crítico** (bloquea producción / datos / SEO indexable) · **Alto** (degrada experiencia o calidad observable) · **Medio** (mantenibilidad / consistencia) · **Bajo** (limpieza / cosmético).

---

## 0. Resumen ejecutivo

El proyecto está, en líneas generales, **maduro y bien estructurado**: rutas localizadas centralizadas, lazy-load por página, prefetch inteligente, sitemap multi-idioma con `hreflang`, SEO server-side, helmet + CSP, rate-limit, circuit breaker, cola de reintentos para email, cifrado de campos sensibles, IndexNow operativo y validación con Zod en endpoints públicos y de admin.

Los hallazgos más relevantes son **higiene y consistencia**, no defectos críticos:

1. **Estructura de `client/src/i18n/locales/es.ts` divergente** del resto de idiomas (riesgo de `[object Object]` o claves resueltas a `undefined` en es).
2. **53 archivos `*.txt` huérfanos en la raíz del workspace** (`*_keys*.txt`, `missing_*.txt`, `*_slugs.txt`, `*_meta_slugs.txt`) que no están referenciados desde ningún script ni documentación, y cuyo contenido está desactualizado.
3. **Duplicación de tipos** entre `shared/schema.ts`, `client/src/lib/calculator.ts` y `server/email.ts`.
4. **Algunos PNG sin convertir a WebP/AVIF** (`partner-trustpilot.png`, `logo-tight.png`).
5. **Lógica de búsqueda/filtrado FAQ duplicada** entre `components/sections/FAQ.tsx` y la home FAQ embebida.
6. **Ausencia de `interface IStorage` formal** en `server/storage/*` (patrón funcional consistente, pero sin contrato tipado).

A continuación se detalla cada hallazgo con evidencia y recomendación. Al final se incluye una tabla resumen y una lista priorizada de tareas de seguimiento sugeridas (no ejecutadas).

---

## 1. Inventario y estructura

### 1.1 Páginas (`client/src/pages`)
Todas las páginas están registradas en `App.tsx` y/o `shared/routes.ts`:

| Página | Ruta / uso | Estado |
| --- | --- | --- |
| `home.tsx` | `home` | OK |
| `services.tsx` (+ `services-sections.tsx`) | `our_services` | OK — split deliberado above/below the fold |
| `how-we-work.tsx` | `how_we_work` | OK |
| `about-llc.tsx` | `about_llc` | OK |
| `faq-page.tsx` | `faq` | OK |
| `book.tsx` | `book` (flujo público) | OK |
| `booking.tsx` | `/booking/:token` (gestión post-reserva) | OK |
| `start.tsx` | `/start` (calculadora landing) | OK, `noindex` correcto |
| `go.tsx` | `/links` (linktree) | OK, `noindex` correcto |
| `admin/agenda.tsx` | `/admin/agenda/:bookingId` | OK, protegida por token |
| `blog/index.tsx`, `blog/post.tsx` | `/[lang]/blog[/slug]` | OK |
| `legal/*` (5 páginas) | `legal_*` | OK |
| `not-found.tsx` | fallback | OK |

> **Nota** — `book.tsx` vs `booking.tsx` parecen duplicados por nombre, **pero no lo son**: `book.tsx` es el funnel público, `booking.tsx` la pantalla de gestión por token. **Recomendación (Bajo)**: renombrar uno de los dos para reducir el coste cognitivo (p. ej. `book-management.tsx` o moverlo a `pages/booking/manage.tsx`).

### 1.2 Server (`server/`, `server/routes/`, `server/storage/`)
Estructura limpia: `routes.ts` ensambla, `routes/public.ts` y `routes/admin.ts` agrupan endpoints, `routes/api-response.ts` estandariza respuestas. Storage dividido en `core / legal / marketing / scheduling`.

### 1.3 Archivos huérfanos en raíz — **Severidad: Medio**
- 53 archivos `.txt` en `/` (`ca_keys.txt`, `ca_keys_v2.txt`, … `pt_meta_slugs.txt`, `missing_*_v4.txt`, …).
- `grep` confirma que **ningún script ni código** los referencia.
- Su contenido está **obsoleto** (p. ej. `missing_en.txt` lista `freelancer-digital` y `Guías`, claves que sí existen en `en.ts`; `en_keys_final.txt` solo tiene 4 líneas frente a >1000 claves reales).

**Recomendación**: archivar en `exentax-web/scripts/i18n-snapshots/` o eliminar. Si se quieren conservar como histórico, mover a `exentax-web/docs/audits/2026-04/i18n-snapshots/`.

### 1.4 Otros archivos a revisar
- Raíz: `blog-test.spec.ts` (parece test antiguo fuera de `tests/`). **Bajo**: mover bajo `exentax-web/tests/`.
- `docs/` raíz vs `exentax-web/docs/`: existen dos carpetas de documentación (root y dentro del paquete). **Medio**: consolidar en una sola para evitar fuentes de verdad duplicadas (`PRODUCTION_AUDIT.md`, `seo-audit-report.md`, `seo-blog-audit.md` están en root; el resto en `exentax-web/docs`).

---

## 2. Navegación y sitemap

### 2.1 Cobertura
- Cada `RouteKey` de `shared/routes.ts:ROUTE_SLUGS` está mapeado a un componente en `App.tsx:PAGE_COMPONENTS` (líneas 51-63).
- Todos aparecen en el navbar (`components/layout/Navbar.tsx` líneas 132-237) y/o footer (`components/layout/Footer.tsx`).
- Sitemap dinámico generado en `server/routes/public.ts` líneas 933-1024 itera `ALL_ROUTE_KEYS × SUPPORTED_LANGS` y añade `<xhtml:link rel="alternate" hreflang="...">`.
- `robots.txt` (mismo archivo, líneas 1092-1133) bloquea `/api/`, `/admin/`, `/booking/` y declara `sitemap.xml` y `sitemap-blog.xml`.

### 2.2 Hallazgos
- **Bajo** — `/links` y `/start` están correctamente marcados `noindex,nofollow` en `server/routes.ts:24`, pero **no aparecen en el sitemap** (correcto) **ni en el `robots.txt`** como `Disallow` (consistente con `noindex`). Conviene documentar esta política para que no se cambie por error.
- **Medio** — No existe redirección explícita de versiones legacy de slugs si en el futuro se renombran (no hay tabla de redirects 301 en `server/`). Hoy no hay rotura, pero si se cambia un slug se romperán enlaces externos. Recomendación: tabla `LEGACY_SLUG_REDIRECTS` en `shared/routes.ts` consumida por un middleware en `routes.ts`.

---

## 3. i18n y claves de traducción

### 3.1 Estructura inconsistente de `es.ts` — **Severidad: Alto**
- `client/src/i18n/locales/{en,ca,fr,de,pt}.ts` usan estructura anidada idéntica (~969 claves cada uno).
- `client/src/i18n/locales/es.ts` mezcla planos y anidados (~977 tokens), y reutiliza `footer` como objeto y string en distintos contextos (líneas aprox. 799, 956, 962). Esto es el patrón clásico que produce `[object Object]` en pantalla si `t("footer")` se llama esperando string.
- `keys.generated.ts` está alineado con `en.ts`, por lo que la **safety de tipos no detecta el desfase en español**.

**Recomendación**: refactor de `es.ts` para igualar estructura de `en.ts` y volver a ejecutar `npm run i18n:generate-types`. Añadir un test (existe `scripts/validate-i18n.ts`) que falle CI si las raíces de claves no coinciden entre locales.

### 3.2 Snapshots `*_keys_*.txt` y `missing_*.txt` desactualizados — **Severidad: Bajo**
Ya descrito en §1.3. No reflejan estado real, inducen a error.

### 3.3 Detección y fallback — OK
`client/src/i18n/index.ts` usa `localStorage("exentax_lang")` + `navigator.language`, con cadena de fallback razonable (`ca,pt → es → en`; `fr,de → en → es`). En dev se loguean claves faltantes.

### 3.4 Claves blog
Las traducciones de blog viven en `client/src/data/blog-i18n*` (no en `locales/*.ts`). Está documentado, pero no hay verificación cruzada de que cada post tenga las 6 traducciones. **Medio**: añadir comprobación a `scripts/blog-content-lint.mjs`.

---

## 4. SEO y posicionamiento

### 4.1 Estado general — Bueno
- Inyección server-side de `<title>`, `<meta description>`, canonical y `hreflang` (incluido `x-default → es`) en `server/static.ts:157-194`.
- JSON-LD: `ProfessionalService` + `WebSite` en home, `FAQPage` en FAQ, `Article` + `BreadcrumbList` para posts (`server/static.ts:371-408`).
- IndexNow plenamente operativo (`server/indexnow.ts`, ping en arranque de producción `server/index.ts:393`).
- `X-Robots-Tag` y `Link: rel="canonical"` añadidos a respuestas no-API/no-static por middleware (`server/routes.ts:47-66`).

### 4.2 Hallazgos
- **Medio** — La consistencia de slugs por idioma (`shared/routes.ts:ROUTE_SLUGS`) **no se valida en CI** contra los archivos `*_slugs.txt`/`*_meta_slugs.txt` legacy. Como esos `.txt` son obsoletos, mejor borrarlos y considerar `ROUTE_SLUGS` como única fuente de verdad.
- **Bajo** — Sitemap usa `lastmod` estático para páginas core (decisión deliberada documentada en `docs/seo-blog-audit.md`). Está bien, pero conviene revisitarlo cada trimestre.
- **Bajo** — Falta `og:image` localizada por idioma en algunas páginas legales (heredan la genérica). Verificar en `SEO.tsx`.

---

## 5. Componentes, código duplicado y código muerto

### 5.1 Componentes huérfanos
No se han detectado componentes sin uso en `client/src/components/`. Comprobaciones puntuales OK: `AiSummaryButtons`, `CategoryBadge`, `FloatingMobileCTA`, `NavbarFunnel`, `LegalLayout`, calculator, etc.

### 5.2 Lógica duplicada — **Severidad: Medio**
- **Búsqueda/filtro FAQ**: implementación en `components/sections/FAQ.tsx` y en home FAQ son similares pero no idénticas. Consolidar en un hook `useFaqSearch` reutilizable.
- **Tipos duplicados**:
  - `client/src/lib/calculator.ts` define `IrpfBracketDetail`, `CalcOptions`, etc. que no derivan de `shared/`.
  - `server/email.ts` define `BookingEmailData` redundante con tipos de `shared/schema.ts`.
  - **Recomendación**: mover esos tipos a `shared/` (o un `shared/calculator.ts`) y reusarlos.

### 5.3 Assets
La mayoría de logos partner están en WebP. Aún quedan PNG: `partner-trustpilot.png`, `logo-tight.png`. **Bajo**: convertir a WebP/AVIF.

---

## 6. Diseño y consistencia visual

### 6.1 Sistema liquid-glass
Aplicado en home, FAQ, services y formularios. Variables centralizadas en `client/src/index.css` y `tailwind.config.ts`. **Coherente** entre páginas observadas.

### 6.2 Hallazgos
- **Bajo** — Algunas tarjetas (reseñas en home) usan radio y sombras ligeramente distintos a las del sistema; ya hay tarea abierta ("Tarjeta de reseña liquid glass redonda sin efectos") que lo aborda.
- **Bajo** — Footer y navbar usan sus propios tokens de tipografía en algunos puntos en lugar de los de `tailwind.config.ts`. Convendría auditar puntualmente con `scripts/check-typography-rule0.mjs` (ya existe; comprobar si está en CI).

---

## 7. Rendimiento

### 7.1 Aciertos
- Lazy-loading sistemático de páginas (`App.tsx:32-49`).
- `prefetchAllPages` con prioridades (`App.tsx:104-118`) y `requestIdleCallback` (`App.tsx:307`).
- `services.tsx` divide hero (eager) de pricing (lazy `services-sections.tsx`).
- Blog: prefetch on hover/focus/touch en `pages/blog/index.tsx:44`, idle prefetch top 5 (línea 190).
- React Query: `staleTime 30s`, `gcTime 5m` (`lib/queryClient.ts:65-66`); claves array; `invalidateQueries` post-mutación en `booking.tsx:169`.

### 7.2 Riesgos
- **Medio** — `client/src/data/blog-content/*` y `blog-posts-i18n.ts` crecen con cada post. A medida que escale, considerar code-splitting por post (`import()` dinámico en lugar de map estático) o moverlo a backend (`/api/blog/posts/:slug`).
- **Bajo** — Aún hay PNGs no convertidos (ver §5.3).

---

## 8. Estabilidad y errores

### 8.1 Backend
- Middleware global de errores en `server/routes.ts:96-121` traduce `NotFoundError`, `ValidationError`, `StorageError` a respuestas seguras y localizadas.
- `circuit-breaker.ts` (closed/open/half-open, threshold y cooldown configurables) protege Google Calendar y email.
- `email-retry-queue.ts` con backoff exponencial (1m → 12h) y rescate de claims obsoletos (línea 138). **Robusto**.

### 8.2 Frontend
- `RouteErrorBoundary` envuelve el router (`App.tsx:129`).
- Pages como `booking.tsx` y `book.tsx` manejan `isLoading`/`isError`.

### 8.3 Hallazgos
- **Medio** — No se observa logging estructurado de errores **frontend** hacia backend (Sentry/equivalente). `clientLogger` solo escribe a consola. Considerar endpoint `/api/log/client-error` con rate-limit, o integración Sentry.
- **Bajo** — `not-found.tsx` no captura intentos a rutas localizadas mal escritas con sugerencia de la ruta correcta. Mejora UX.

---

## 9. Seguridad

### 9.1 Aciertos
- `helmet` con CSP estricta, HSTS en producción, etc. (`server/index.ts:60-89`).
- CSRF por origen/referer whitelisted (`server/route-helpers.ts:288-327`) aplicado en `routes.ts:68-78`.
- Rate-limit global + específicos (booking, newsletter) con backend Redis o memoria.
- `sanitize-middleware.ts` recursivo con límites de profundidad y nº de claves (anti ReDoS / prototype pollution).
- `field-encryption.ts` AES-256-GCM para campos sensibles (p. ej. `phone`).
- Strip de `id` en bodies PUT/PATCH (`routes.ts:81-86`).
- `adminAuth` con `crypto.timingSafeEqual` (`routes/admin.ts:31-47`).
- Drizzle ORM (sin SQL crudo).
- Zod en todos los endpoints POST/PATCH revisados.

### 9.2 Hallazgos
- **Medio** — `ADMIN_TOKEN` se compara contra un solo valor estático. Considerar rotación o emisión de tokens efímeros para sesiones largas del panel.
- **Medio** — La página `/admin/agenda/:bookingId` se sirve **al cliente** sin barrera SSR; la protección depende del middleware sobre las llamadas a `/api/admin/*`. Verificar que ningún dato sensible se renderice antes de la autenticación de la API y que el bundle no incluya secretos por error.
- **Bajo** — `google-credentials.ts` lee `GOOGLE_SERVICE_ACCOUNT_KEY` correctamente, pero conviene documentar en `replit.md` que es un secret obligatorio.
- **Bajo** — Newsletter y formularios públicos: confirmar que el rate-limit por IP no se evade tras el proxy (revisar `trust proxy` en `server/index.ts`).

---

## 10. Limpieza de archivos en raíz

- 53 `.txt` huérfanos (ver §1.3, §3.2). **Eliminar o archivar.**
- `blog-test.spec.ts` en root: mover a `exentax-web/tests/`.
- `screenshots/` en root: confirmar si es de uso humano (capturas de revisión) o residuo. Si se mantiene, añadir entrada en `.gitignore` para nuevas capturas no esenciales.
- `docs/` (root) duplica propósito de `exentax-web/docs/`. Consolidar.

---

## 11. Solidez estructural y consistencia de código

- **Convenciones**: kebab-case para páginas y componentes principales, PascalCase para componentes React. Consistente.
- **`IStorage`** — **Severidad: Medio**: el patrón usado es funcional (módulos exportando funciones async), no hay `interface IStorage`. La guía interna del proyecto sugiere ese contrato. Recomendación: introducir interfaces por dominio (`IBookingStorage`, `INewsletterStorage`, ...) en `server/storage/index.ts` y tipar las funciones para facilitar mocks/test.
- **Separación cliente/servidor/compartido**: limpia. Tipos críticos en `shared/schema.ts`. Solo se detecta duplicación en calculator y email (§5.2).
- **Tests**: hay scripts e2e (`scripts/run-*-e2e.ts`) y unit (`calculator.test.ts`, `seo-check-links.test.mjs`, `blog-content-lint.test.mjs`). **Bajo**: no se ha verificado cobertura ni que estén integrados en CI (revisar `.github/workflows` si existe).

---

## 11.bis Ficha estandarizada de hallazgos

> Para cumplir el formato pedido en el "Done looks like" (descripción + evidencia + impacto + recomendación por hallazgo), aquí está cada hallazgo desglosado en bloque homogéneo. Los IDs (H1…H18) coinciden con la tabla resumen.

### H1 — Estructura de `es.ts` divergente — **Alto** · i18n
- **Descripción**: el locale español usa nesting/planos distintos al resto y reusa la clave `footer` como objeto y como string en distintos sitios.
- **Evidencia**: `exentax-web/client/src/i18n/locales/es.ts` (búsquedas de `footer:` y `footer.` muestran ambos usos) vs `exentax-web/client/src/i18n/locales/en.ts` (estructura puramente anidada). `keys.generated.ts` derivado de `en.ts`.
- **Impacto**: riesgo de `[object Object]` en pantalla, claves resueltas a `undefined`, y los tipos generados no protegen al locale por defecto del sitio (es).
- **Recomendación**: refactor de `es.ts` para igualar `en.ts`; regenerar `keys.generated.ts`; añadir lint cross-locale en CI vía `scripts/validate-i18n.ts`.

### H2 — 53 `.txt` huérfanos en raíz — **Medio** · Limpieza — RESUELTO (Task #19, 2026-04-19)
- **Descripción**: archivos `*_keys*.txt`, `missing_*.txt`, `*_slugs.txt`, `*_meta_slugs.txt` no referenciados y desactualizados.
- **Evidencia**: `ls *.txt` en raíz devuelve 53 entradas; `grep` en `exentax-web/` y `scripts/` sin coincidencias; `missing_en.txt` lista claves ya existentes; `en_keys_final.txt` solo 4 líneas.
- **Impacto**: ruido cognitivo, induce a falsas conclusiones de auditoría, ensucia el árbol del repo.
- **Resolución**: los 54 snapshots se archivaron en `exentax-web/docs/audits/2026-04/i18n-snapshots/`. La raíz queda limpia.

### H3 — Lógica FAQ duplicada — **Medio** · Código
- **Descripción**: filtrado/búsqueda FAQ implementado dos veces con leves diferencias.
- **Evidencia**: `exentax-web/client/src/components/sections/FAQ.tsx` y FAQ embebida en home (`pages/home.tsx`).
- **Impacto**: doble mantenimiento, divergencia de comportamiento entre home y página FAQ.
- **Recomendación**: extraer hook `useFaqSearch` reutilizable.

### H4 — Tipos calculator/email no compartidos — **Medio** · Tipos
- **Descripción**: `IrpfBracketDetail`, `CalcOptions`, `BookingEmailData` definidos fuera de `shared/`.
- **Evidencia**: `exentax-web/client/src/lib/calculator.ts`, `exentax-web/server/email.ts`.
- **Impacto**: drift entre frontend, backend y schema; cambios en `shared/schema.ts` no se propagan.
- **Recomendación**: mover a `exentax-web/shared/calculator.ts` y `shared/email.ts`.

### H5 — Falta `interface IStorage` formal — **Medio** · Estructura
- **Descripción**: `server/storage/*` exporta funciones async sin interfaz tipada.
- **Evidencia**: `exentax-web/server/storage/{core,legal,marketing,scheduling,index}.ts`.
- **Impacto**: dificulta mocks/tests y oculta el contrato real de cada dominio.
- **Recomendación**: definir `IBookingStorage`, `INewsletterStorage`, etc. en `server/storage/index.ts`.

### H6 — `clientLogger` no reporta al backend — **Medio** · Observabilidad
- **Descripción**: errores cliente solo se loguean en consola del navegador.
- **Evidencia**: `exentax-web/client/src/lib/clientLogger.ts` (solo `console.*`); `App.tsx:129` `RouteErrorBoundary` también solo llama a `clientLogger.error`.
- **Impacto**: errores en producción invisibles para el equipo.
- **Recomendación**: endpoint `/api/log/client-error` con rate-limit, o integrar Sentry.

### H7 — `ADMIN_TOKEN` único, sin rotación — **Medio** · Seguridad
- **Descripción**: comparación segura, pero un único token estático de larga vida.
- **Evidencia**: `exentax-web/server/routes/admin.ts:31-47`.
- **Impacto**: si se filtra una vez, queda comprometido hasta despliegue manual con nuevo valor.
- **Recomendación**: emisión de tokens efímeros (JWT corto) o rotación periódica documentada.

### H8 — Crecimiento sin code-split del blog — **Medio** · Performance
- **Descripción**: contenido y traducciones del blog son objetos TS estáticos importados eager.
- **Evidencia**: `exentax-web/client/src/data/blog-content/*`, `blog-posts-i18n.ts`.
- **Impacto**: bundle del blog crece linealmente con cada post.
- **Recomendación**: code-split por slug con `import()` dinámico o servir desde `/api/blog/posts/:slug`.

### H9 — Doble carpeta `docs/` — **Medio** · Docs — RESUELTO (Task #19, 2026-04-19)
- **Descripción**: existían `/docs/` (raíz) y `exentax-web/docs/` con materiales solapados.
- **Evidencia**: `/docs/PRODUCTION_AUDIT.md`, `/docs/seo-audit-report.md`, `/docs/seo-blog-audit.md` vs `exentax-web/docs/audit-final-2026-04.md`, etc.
- **Impacto**: dos fuentes de verdad para auditorías y SEO.
- **Resolución**: los tres documentos del root `docs/` se movieron a `exentax-web/docs/` y la carpeta raíz se eliminó. Ahora hay una única carpeta de documentación.

### H10 — Sin tabla central de redirects 301 — **Medio** · SEO
- **Descripción**: si se renombra un slug, no hay redirect declarado.
- **Evidencia**: `exentax-web/shared/routes.ts` solo define slugs vigentes; `server/routes.ts` no implementa middleware de legacy.
- **Impacto**: cualquier cambio futuro de slug rompería enlaces externos sin red.
- **Recomendación**: `LEGACY_SLUG_REDIRECTS` en `shared/routes.ts` + middleware 301 en `server/routes.ts`.

### H11 — Naming `book.tsx` vs `booking.tsx` — **Bajo** · Naming
- **Descripción**: dos páginas con nombres casi idénticos pero propósitos distintos (funnel público vs gestión por token).
- **Evidencia**: `exentax-web/client/src/pages/book.tsx`, `exentax-web/client/src/pages/booking.tsx`; mapeo en `App.tsx:16-17, 27`.
- **Impacto**: coste cognitivo y riesgo de editar el archivo equivocado.
- **Recomendación**: renombrar uno (p. ej. `pages/booking/manage.tsx`).

### H12 — PNGs no optimizados — **Bajo** · Assets
- **Descripción**: assets restantes en PNG cuando el resto migró a WebP.
- **Evidencia**: `partner-trustpilot.png`, `logo-tight.png` en `client/public` o `attached_assets`.
- **Impacto**: peso extra en hero/footer.
- **Recomendación**: convertir a WebP/AVIF y actualizar referencias.

### H13 — Posibles desviaciones tipográficas en navbar/footer — **Bajo** · Diseño
- **Descripción**: uso ocasional de tokens tipográficos propios fuera de `tailwind.config.ts`.
- **Evidencia**: `exentax-web/client/src/components/layout/Navbar.tsx`, `Footer.tsx`.
- **Impacto**: drift visual menor.
- **Recomendación**: ejecutar `scripts/check-typography-rule0.mjs` y dejarlo en CI.

### H14 — `not-found.tsx` sin sugerencia — **Bajo** · UX
- **Descripción**: la 404 no propone una ruta cercana.
- **Evidencia**: `exentax-web/client/src/pages/not-found.tsx`.
- **Impacto**: rebote evitable.
- **Recomendación**: matching difuso contra `ALL_ROUTE_KEYS` × idioma actual y mostrar enlace sugerido.

### H15 — `blog-test.spec.ts` en raíz — **Bajo** · Tests
- **Descripción**: spec fuera de `exentax-web/tests/`.
- **Evidencia**: `/blog-test.spec.ts`.
- **Impacto**: confunde al runner de tests y al desarrollador.
- **Recomendación**: mover a `exentax-web/tests/blog.spec.ts`.

### H16 — Sin lint que exija 6 traducciones por post — **Medio** · i18n blog
- **Descripción**: nada garantiza que cada post tenga `es/en/ca/fr/de/pt`.
- **Evidencia**: `exentax-web/scripts/blog-content-lint.mjs` no comprueba cobertura por idioma.
- **Impacto**: posts publicados parcialmente traducidos llegan a producción.
- **Recomendación**: añadir comprobación al lint y bloquear CI si falta algún idioma.

### H17 — Falta `og:image` localizada en algunas legales — **Bajo** · SEO
- **Descripción**: páginas legales heredan la `og:image` genérica.
- **Evidencia**: `exentax-web/client/src/components/SEO.tsx`, páginas en `client/src/pages/legal/*`.
- **Impacto**: previews sociales menos relevantes en es/en/ca/fr/de/pt.
- **Recomendación**: imagen específica por sección legal y/o por idioma.

### H18 — Verificar `trust proxy` y rate-limit por IP — **Bajo** · Seguridad
- **Descripción**: tras un proxy reverso, `req.ip` puede ser la IP del proxy si `app.set('trust proxy', ...)` no está bien configurado, anulando el rate-limit por IP.
- **Evidencia**: `exentax-web/server/index.ts` (revisar configuración `trust proxy`).
- **Impacto**: rate-limit efectivo solo a nivel global, no por usuario.
- **Recomendación**: confirmar configuración `trust proxy` y validar con header `X-Forwarded-For` real.

---

## 12. Tabla resumen de hallazgos

| # | Categoría | Severidad | Hallazgo | Evidencia |
| --- | --- | --- | --- | --- |
| H1 | i18n | Alto | Estructura de `es.ts` divergente del resto de locales (riesgo runtime) | `client/src/i18n/locales/es.ts` vs `en.ts` |
| H2 | Limpieza | Medio | 53 `.txt` huérfanos en raíz | `ca_keys*.txt`, `missing_*.txt`, `*_slugs.txt`, `*_meta_slugs.txt` |
| H3 | Código | Medio | Lógica FAQ duplicada (search/filter) | `components/sections/FAQ.tsx` + home FAQ |
| H4 | Tipos | Medio | Tipos `calculator` y `BookingEmailData` no compartidos | `client/src/lib/calculator.ts`, `server/email.ts` |
| H5 | Storage | Medio | Falta `interface IStorage` formal | `server/storage/*.ts` |
| H6 | Observabilidad | Medio | `clientLogger` no envía errores al backend (sin Sentry) | `client/src/lib/clientLogger.ts` |
| H7 | Seguridad | Medio | `ADMIN_TOKEN` único, sin rotación ni sesiones efímeras | `server/routes/admin.ts:31-47` |
| H8 | Performance | Medio | `blog-posts-i18n` y `blog-content/*` crecen sin code-split por post | `client/src/data/blog-*` |
| H9 | Docs | Medio | Dos carpetas `docs/` (root + paquete) | `/docs`, `exentax-web/docs` |
| H10 | SEO | Medio | Sin tabla central de redirects 301 para slugs legacy | `shared/routes.ts`, `server/routes.ts` |
| H11 | Naming | Bajo | `book.tsx` vs `booking.tsx` confusos | `client/src/pages/` |
| H12 | Assets | Bajo | PNGs sin convertir a WebP/AVIF | `partner-trustpilot.png`, `logo-tight.png` |
| H13 | Tipografía | Bajo | Posibles desviaciones puntuales en navbar/footer | `components/layout/*` |
| H14 | UX | Bajo | `not-found.tsx` no sugiere ruta cercana | `client/src/pages/not-found.tsx` |
| H15 | Tests | Bajo | `blog-test.spec.ts` en raíz fuera de `tests/` | `/blog-test.spec.ts` |
| H16 | i18n blog | Medio | Sin lint que exija las 6 traducciones por post | `scripts/blog-content-lint.mjs` |
| H17 | SEO | Bajo | Falta `og:image` localizada en algunas páginas legales | `client/src/components/SEO.tsx` |
| H18 | Seguridad | Bajo | Verificar `trust proxy` para rate-limit por IP | `server/index.ts` |

---

## 13. Lista priorizada de tareas de seguimiento sugeridas

> Solo títulos. **No se han creado** como tareas; son recomendaciones para que el responsable decida.

**Prioridad 1 (impacto directo en calidad / SEO / estabilidad)**
1. Refactor de `es.ts` para alinear estructura con el resto de locales (resuelve H1).
2. Lint i18n cross-locale obligatorio en CI (claves y estructura coincidentes).
3. Limpieza de los 53 `.txt` huérfanos en raíz (H2).
4. Consolidar `docs/` raíz dentro de `exentax-web/docs/` (H9).

**Prioridad 2 (mantenibilidad)**

5. Extraer `useFaqSearch` reutilizable y unificar FAQ home/sección (H3).
6. Mover tipos compartidos de calculator y email a `shared/` (H4).
7. Introducir `interface IStorage*` por dominio en `server/storage/` (H5).
8. Lint que verifique las 6 traducciones de cada post de blog (H16).
9. Tabla central de redirects 301 para slugs legacy (H10).

**Prioridad 3 (observabilidad y seguridad)**

10. Endpoint `/api/log/client-error` o integración Sentry para errores frontend (H6).
11. Plan de rotación / sesiones efímeras para `ADMIN_TOKEN` (H7).
12. Verificación de `trust proxy` y eficacia real del rate-limit por IP (H18).

**Prioridad 4 (cosmético / housekeeping)**

13. Renombrar `book.tsx` o `booking.tsx` para diferenciar funnel vs gestión (H11).
14. Convertir PNGs partner restantes a WebP/AVIF (H12).
15. Pasada de `check-typography-rule0` sobre navbar/footer y dejarlo en CI (H13).
16. Mover `blog-test.spec.ts` a `exentax-web/tests/` (H15).
17. Sugerencia de ruta cercana en `not-found.tsx` (H14).
18. Auditoría de `og:image` localizadas en páginas legales (H17).
19. Code-splitting por post en blog cuando el catálogo crezca (H8).

---

_Fin del informe._
