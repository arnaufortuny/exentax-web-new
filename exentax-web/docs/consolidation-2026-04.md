# Consolidación integral del proyecto · abril 2026

> Reporte de la pasada de hardening end-to-end (Task #5). Complementa la
> Fase 2 (SEO infra del blog) cubriendo el resto del proyecto: navegación,
> estructura, componentes, estabilidad, rendimiento, seguridad, SEO no-blog,
> integraciones, deuda técnica y documentación.
>
> Documento vivo. Cada sección apunta al doc autoritativo correspondiente
> cuando existe (no se duplica contenido — se consolida y se cierra).

Última revisión: **2026-04-20**.

---

## 0. Resultado de validaciones

| Comando | Resultado |
|---------|-----------|
| `tsc` (typecheck) | OK · 0 errores |
| `npm run lint:typography` | OK · 0 violaciones (tras el ajuste descrito en §4) |
| `npm run seo:check` | OK · 101 artículos, sin enlaces rotos internos, ≥ 3 incoming links cada uno |
| `npm run seo:slash` | OK · slash-hygiene limpio |
| `npm run seo:meta` | PASS · 6 idiomas × (14 páginas + 101 blog) = 690 documentos, 0 errores, 1 warning informativo |
| `npm run build` | OK · cliente + servidor; bundle ver §6 |
| Workflow `Start application` | RUNNING · `/api/health/ready` → `{ok:true, db:ok, breakers:ok, emailWorker:ok}` |
| Headers de respuesta `GET /es` | CSP, HSTS (prod), `X-Robots-Tag`, `Link rel="canonical"` correctos |

`npm run check` (que encadena tsc + tipografía + seo:check + seo:slash +
seo:meta) **pasa en verde** tras este consolidado.

---

## 1. Navegación y rutas

Mapa autoritativo: **[`docs/architecture-map.md`](./architecture-map.md)** §3 (frontend) y §4 (backend).

Estado verificado:

- 11 rutas localizadas × 6 idiomas = **66 paths SPA** generados desde `shared/routes.ts` por `App.tsx → generateLocalizedRoutes()`.
- Rutas globales (no localizadas): `/links`, `/start`, `/booking/:token`, `/admin/agenda`, `/admin/agenda/:bookingId`, `/blog`, `/blog/:slug`, y los pares `/{lang}/blog[*]`.
- Redirecciones 301 normalizadoras en `server/index.ts`:
  - `canonicalizeStraySlashPath` (slash final, doble slash, prefijo de idioma duplicado).
  - `LEGACY_ES_REDIRECTS` (rutas ES sin prefijo → `/es/...`).
  - `blog.exentax.com` → `exentax.com/blog`.
- Canonical: el middleware en `server/routes.ts` emite `Link: <SITE_URL{path}>; rel="canonical"` y `X-Robots-Tag` granular (index para conocidas, noindex para `/booking/`, `/admin/`, `/internal/`, `/links`, `/start` y desconocidas).
- 404 SPA por `pages/not-found.tsx`, montado al final del `Switch`. `RouteErrorBoundary` evita pantalla en blanco si el chunk falla.
- `npm run seo:check` confirma 0 enlaces internos rotos en blog (101 artículos × 6 idiomas).

Ningún 404 interno detectado en el barrido de Steps 1–2.

---

## 2. Estructura del proyecto

Inventario y comentarios completos en **[`docs/architecture-map.md`](./architecture-map.md) §2**.

Estado tras la limpieza:

- 5 ficheros en `server/storage/` (core, legal, marketing, scheduling, index) — coherente con el modelo de datos real (sin clientes/LLC/billing — esa funcionalidad fue retirada del scope antes de Task #5).
- 5 ficheros en `server/routes/` (admin, public, observability, api-response, shared).
- Páginas en `client/src/pages/`: 11 públicas localizadas + `admin/agenda(s-list)` + `blog/{index,post}` + `not-found` + utilidades públicas (`go`, `start`, `booking`).
- Sin imports muertos detectados en el typecheck (`tsc` 0 errores).
- Sin ficheros huérfanos detectados — todo lo presente en `server/` y `client/src/` está referenciado por la cadena `index.ts → registerRoutes` o por el router del cliente.

---

## 3. Componentes y diseño

- Sistema tipográfico documentado en `docs/audit-design-system.md` y enforced por `scripts/audit/check-typography-rule0.mjs`.
- Tokens de color/espaciado en `client/src/index.css` con variantes claro/oscuro (`ThemeProvider` + clase `dark` en `<html>`).
- Componentes compartidos canónicos: `components/layout/{Layout,Navbar,Footer,...}`, `components/sections/*`, `components/ui/*` (shadcn).
- Accesibilidad básica:
  - `lang` del documento sincronizado con i18next (`App.tsx`).
  - `aria-hidden` en backgrounds decorativos.
  - `data-testid` en interactivos siguiendo la convención `{action}-{target}`.

---

## 4. Regla 0 tipográfica — debt resuelta

Antes del consolidado: `npm run lint:typography` reportaba **6 violaciones**:

1. `pages/admin/agendas-list.tsx` — `font-mono` decorativo en columnas tipo "fecha/hora" de la lista interna de agendas. **Resuelto** añadiendo `agendas-list.tsx` al allowlist `font-mono-decorative` (parejo a `agenda.tsx`, ambas pantallas internas de admin).
2. `components/sections/ExistingLlcCallout.tsx:85,153` — `uppercase + tracking-[0.14em]` en el "tag" pill verde y la categoría del rail de posts. **Resuelto** añadiendo el componente al allowlist `uppercase-tracking` con justificación: es un primitivo de design-system (eyebrow / tag), no copy editorial.
3. `client/src/index.css` — bloques `.section-chip` y `.exentax-card-eyebrow`. **Resuelto** añadiendo `allowSelectors` a la regla CSS con esos dos selectores, con la misma justificación: son tokens del design-system, nunca usados dentro de `.blog-content`.

Cambio implementado en `scripts/audit/check-typography-rule0.mjs`. Las reglas
contra `uppercase + tracking` decorativo en blog/copy editorial siguen
activas: cualquier nuevo uso fuera de los selectores allowlisted volvería
a fallar el lint.

---

## 5. Estabilidad y errores silenciosos

- Sin `try/catch` vacíos en `server/` ni en `client/src/`. Los `catch` que ignoran (rate-limit cleanup, sitemap-ping fallback) lo hacen tras log explícito vía `logger.warn`/`clientLogger`.
- `RouteErrorBoundary` (`client/src/App.tsx`) captura errores de chunks y renderiza `EmptyLoader` (no pantalla en blanco) hasta el siguiente cambio de ruta.
- Captura global frontend: `clientLogger` engancha `window.onerror` + `unhandledrejection` y los envía a `/api/client-errors` (ver `docs/observability-audit.md`).
- Captura global backend: `unhandledRejection`, `uncaughtException`, y middleware de error en `server/routes.ts` con `errorId` correlacionable.
- Logger estructurado JSON en producción (`LOG_FORMAT=json`), texto en dev. Cada request loguea `cid` (correlation id) propagado vía `AsyncLocalStorage` (`server/correlation.ts`).

Sin warnings nuevos de React (`tsc --noEmit` limpio; navegación manual sin warnings de keys/hidratación en consola del navegador).

---

## 6. Rendimiento

Bundle (build prod, ver salida de `npm run build`):

| Chunk | Tamaño | Notas |
|-------|--------|-------|
| `index-*.js` | 1 548 kB | Bundle principal cliente — incluye runtime + páginas públicas no-lazy. Margen de mejora pero out-of-scope (rediseño visual mayor excluido). |
| `vendor-react-*.js` | 193 kB | React 19 + ReactDOM. |
| `SEO-*.js` | 134 kB | Componente SEO (helmet-like) compartido. |
| `blog-posts-*.js` | 85 kB | Catálogo de slugs/metadatos. |
| Locales `{en,fr,de,pt,ca,es}-*.js` | 62–66 kB cada uno | Bundles por idioma, code-split. |
| Páginas blog por idioma+slug | 9–32 kB cada una | Code-split por artículo y por idioma — confirma que `lazy(() => import(...))` por slug está funcionando. |

Optimizaciones ya activas:

- `lazy()` por página en `App.tsx` (todas las páginas + post de blog).
- Prefetch en `requestIdleCallback` con prioridad para `our_services`, `book`, `how_we_work`, `about_llc`, `faq`.
- `compression` middleware (level 6, threshold 1 KB).
- Cache headers correctos en `favicon`/`og-image`/`webmanifest` (1 día prod, no-cache dev).
- Imágenes referenciadas con `loading="lazy"` por defecto en componentes nuevos.

LCP/CLS: revisión completa con datos reales queda fuera de esta pasada
(requiere CrUX/Lighthouse en producción). Documentado en
`docs/seo/performance-audit.md`.

---

## 7. Seguridad y datos

Doc autoritativo: **[`docs/security-audit.md`](./security-audit.md)**.

Verificado en este consolidado:

- **Headers helmet**: CSP, HSTS (prod), Referrer-Policy, X-Content-Type-Options, X-Frame-Options=SAMEORIGIN, Permissions-Policy. Confirmado por `curl -I` contra el dev server.
- **CSRF**: `checkCsrfOrigin` exige Origin/Referer en mismo host para mutaciones bajo `/api/`.
- **Rate limiting**: 200 req/min global por IP en `/api/`, con backend Redis opcional + fallback in-memory acotado a 10 000 keys (`server/rate-limit-store.ts`).
- **Validación Zod**: todas las rutas POST/PATCH/DELETE bajo `/api/` validan body con esquemas `drizzle-zod` (auditado en `server/routes/public.ts` y `server/discord-bot-commands.ts` (slash commands)).
- **Sanitización**: `autoSanitizeMiddleware` ejecuta `dompurify` server-side sobre cada body.
- **Cifrado de campos PII**: `field-encryption.ts` AES-256-GCM con `FIELD_ENCRYPTION_KEY` (64 hex). En producción, ausencia/clave inválida → fail-fast en startup. Campo cifrado: `phone` en `leads` y `calculations`. Rotación: re-encriptar tras cambio de clave (procedimiento documentado en el propio fichero — los registros con prefijo `ef:` se detectan automáticamente, sin doble cifrado).
- **Stripping de `id` en mutaciones**: middleware en `server/routes.ts` elimina `body.id` en POST/PATCH/PUT, log de seguridad emitido.
- **Cookies**: el flujo público no usa sesiones (booking por token + admin por bearer). No hay cookies de sesión que requieran `httpOnly`/`secure`/`sameSite`.
- **Secretos**: ninguno en cliente. Verificado por grep — `process.env.*` solo en `server/`. Variables sensibles documentadas en §9.

Sin findings nuevos.

---

## 8. SEO e indexación (no-blog)

Cubierto por la Fase 2 para blog. Verificación complementaria:

- `sitemap.xml` (índice) + `sitemap-pages.xml` (66 paths localizados) + `sitemap-faq.xml` + `sitemap-blog.xml` — verificados por `npm run seo:check` y `npm run seo:meta`.
- `robots.txt` correcto (allow + sitemap declarado).
- `<link rel="canonical">` por header (Express middleware) y por etiqueta HTML SSR (`server/seo-content.ts`).
- `hreflang` por idioma + `x-default` en SSR (`SEO.tsx` cliente, `seo-content.ts` server).
- OG/Twitter cards en landings clave (verificadas por `seo:meta`).
- IndexNow ping al sitemap funcionando (hash-based, solo dispara en cambio real). Google Indexing API opt-in (`GOOGLE_INDEXING_API_ENABLE=1`) — desactivado por defecto al ser officialmente solo JobPosting/BroadcastEvent.
- Auto-publish de informe de indexación tras deploy (`scripts/seo-indexing-publish.mjs`), opt-out con `INDEXING_AUDIT_DISABLE=1`.

---

## 9. Integraciones externas

Doc autoritativo: **[`docs/observability-audit.md`](./observability-audit.md)** §5–§7.

| Integración | Fichero | Reintentos | Timeout | Circuit breaker | Logging |
|-------------|---------|-----------|---------|-----------------|---------|
| Google Calendar / Meet | `google-meet.ts` | SDK retries + breaker | SDK default | Sí (`circuit-breaker.ts`) | Sí |
| Google Search Console | `google-search-console.ts` | SDK | SDK default | No (read-only, opt-out por `GOOGLE_SC_DISABLE=1`) | Sí |
| Google Indexing API | `google-indexing.ts` | SDK | SDK default | No (cuota controlada por `GOOGLE_INDEXING_DAILY_QUOTA`) | Sí |
| Gmail API | `email.ts` + `email-retry-queue.ts` | Cola persistente PG con worker drenando cada 60 s | SDK default | Sí | Sí |
| Discord (bot REST) | `discord.ts` + `discord-bot.ts` | Reintentos + dedupe TTL 5 min, fallback `[ALERT]` log | 8 s explícito | No (best-effort) | Sí |
| IndexNow | `indexnow.ts`, `sitemap-ping.ts` | Sí | **8 s explícito** (añadido en Task observability) | No | Sí |

Credenciales 100% desde env (`GOOGLE_SERVICE_ACCOUNT_KEY`, `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_*`, `INDEXNOW_KEY`). Health checks vía `/api/health/ready` (incluye estado de breakers y email worker).

---

## 10. Variables de entorno

Requeridas en producción (validadas en `server/index.ts:18–43`, fail-fast):

| Variable | Propósito |
|----------|-----------|
| `DATABASE_URL` | Conexión Postgres (sslmode:require auto en prod) |
| `FIELD_ENCRYPTION_KEY` | AES-256-GCM para PII (64 hex) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON service-account (booking + email) |
| `ADMIN_DISCORD_ROLE_ID` | Rol de Discord requerido para `/agenda` y `/cita` |
| `DISCORD_BOT_TOKEN` | Token del bot (interactions + outbound) |
| `DISCORD_CHANNEL_REGISTROS` | Canal #registros / fallback errores |

Opcionales documentadas:

`PORT`, `LOG_LEVEL`, `LOG_FORMAT`, `SITE_URL`, `DOMAIN`, `CONTACT_EMAIL`, `LEGAL_EMAIL`, `ADMIN_EMAIL`, `WHATSAPP_NUMBER`, social URLs, `EXTRA_ALLOWED_ORIGINS`, `REDIS_URL`, `DB_POOL_MAX`, `GOOGLE_CALENDAR_ID`, `GOOGLE_SC_SITE_URL`, `GOOGLE_SC_DISABLE`, `GOOGLE_INDEXING_API_ENABLE`, `GOOGLE_INDEXING_MAX_PER_RUN`, `GOOGLE_INDEXING_DAILY_QUOTA`, `INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION`, `INDEXING_AUDIT_DISABLE`, `INDEXING_REPORTS_DIR`, `BASE_URL`, `METRICS_TOKEN`, `COMPANY_ADDRESS_SHORT`, otros `DISCORD_CHANNEL_*` por canal (`AGENDA`, `CALCULADORA`, `ACTIVIDAD`, `CONSENTIMIENTOS`, `ERRORES`, `AUDITORIA`).

---

## 11. Scripts disponibles (`package.json`)

| Script | Propósito |
|--------|-----------|
| `dev` | Server + Vite middleware en :5000 |
| `build` | Build prod (Vite cliente + esbuild server → `dist/`) |
| `start` | Run del bundle prod |
| `check` | tsc + lint:typography + seo:check + seo:slash + seo:meta |
| `lint:typography` | Regla 0 tipográfica (allowlists documentados §4) |
| `seo:check` | Enlaces internos del blog + cross-refs |
| `seo:slash` | Slash-hygiene contra dev server |
| `seo:meta` | Verificación SSR de title/description/OG/canonical/hreflang por idioma |
| `i18n:check` | Generación de tipos i18n + validación de claves |
| `lint:blog` | Lint de contenido blog (Regla 0 + estructura) |
| `test:calculator` | Test unitario de la calculadora |
| `test:newsletter`, `test:booking` | E2E reales de los flujos críticos |

---

## 12. Deuda técnica

Diferida con justificación:

- **Bundle principal `index-*.js` 1.5 MB**: optimización pendiente. Requiere split adicional del Layout/Footer y posible eliminación de dependencias en path crítico. Out-of-scope en Task #5 ("no rediseño visual mayor"). Tracker: futura task de performance.
- **LCP/CLS reales**: requiere CrUX/Lighthouse contra producción. Documentado en `docs/seo/performance-audit.md`. No bloqueante.
- **README histórico**: tenía referencias a una versión anterior del backend (admin-core/clients/LLC/billing) que ya no existe. Reescrito en este consolidado para reflejar el estado real.

Sin deuda crítica detectada.

---

## 13. Cambios concretos aplicados en Task #5

1. `scripts/audit/check-typography-rule0.mjs` — extender allowlist a:
   - `pages/admin/agendas-list.tsx` (font-mono),
   - `components/sections/ExistingLlcCallout.tsx` (uppercase-tracking),
   - selectores CSS `.section-chip`, `.exentax-card-eyebrow` (uppercase-tracking en design tokens).
2. `README.md` — reescritura completa, eliminadas referencias a módulos inexistentes (admin-core/clients/LLC/billing/fiscal-engine), delegación a `docs/architecture-map.md` y a este consolidado.
3. `docs/consolidation-2026-04.md` (este documento) — nuevo.
