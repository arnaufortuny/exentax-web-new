# Mapa de rutas · exentax-web

Última actualización: 21 abr 2026 (Task #3 — Rutas, Navegación y Componentes).
Documento vivo: actualizar al añadir/quitar rutas. Complementa `docs/architecture-map.md` §3-§4 con foco operativo (path → componente → guard → estado HTTP/SEO).

Convenciones:

- **Idioma**: las páginas localizadas se generan dinámicamente en `client/src/App.tsx` desde `shared/routes.ts::ROUTE_SLUGS` para los 6 idiomas soportados (`es, en, fr, de, pt, ca`).
- **Guard SEO**: aplicado por `server/routes.ts` (cabecera `X-Robots-Tag` + `Link rel=canonical`) y por `server/static.ts` en producción (meta `<robots>` + 200/404).
- **Guard auth**: ninguna ruta cliente requiere sesión. Las únicas rutas con tokens son `/booking/:token` (token en query string firmado al crear la reserva, comparado server-side). Toda la operación admin pasa por el bot de Discord (`/agenda`, `/cita …`) gated por `ADMIN_DISCORD_ROLE_ID`. No existe ningún panel admin en el cliente.
- **Estado**: `Activa` = ruta canónica indexable; `Activa (noindex)` = SPA real pero excluida del índice; `Tombstone` = página estática que sustituye a una ruta legacy retirada; `Redirect` = redirección 30x; `404` = ruta no registrada que devuelve fallback `not-found.tsx` con `noindex`.

---

## 1. Rutas SPA cliente (wouter)

### 1.1 Rutas localizadas (×6 idiomas, generadas en `App.tsx::generateLocalizedRoutes`)

| RouteKey         | Página                                | Slug ES                  | Slug EN          | Estado | Guard SEO                         | Notas |
|------------------|---------------------------------------|--------------------------|------------------|--------|-----------------------------------|-------|
| `home`           | `pages/home.tsx`                      | `/es` (raíz idioma)      | `/en`            | Activa | `index, follow` + canonical       | LangSyncEffect aplica idioma |
| `how_we_work`    | `pages/how-we-work.tsx`               | `como-trabajamos`        | `how-we-work`    | Activa | `index, follow` + canonical       | |
| `our_services`   | `pages/services.tsx` (+ lazy `services-sections.tsx`) | `nuestros-servicios` | `our-services` | Activa | `index, follow` + canonical | Split eager/lazy para LCP |
| `about_llc`      | `pages/about-llc.tsx`                 | `sobre-las-llc`          | `about-llc`      | Activa | `index, follow` + canonical       | |
| `faq`            | `pages/faq-page.tsx`                  | `preguntas-frecuentes`   | `faq`            | Activa | `index, follow` + canonical       | Reusa `sections/FAQ.tsx` |
| `book`           | `pages/book.tsx`                      | `agendar`                | `book`           | Activa | `index, follow` + canonical       | Embebe `BookingCalendar` |
| `legal_terms`    | `pages/legal/terms.tsx`               | `legal/terminos`         | `legal/terms`    | Activa | `index, follow` + canonical       | `LegalLayout` |
| `legal_privacy`  | `pages/legal/privacy.tsx`             | `legal/privacidad`       | `legal/privacy`  | Activa | `index, follow` + canonical       | `LegalLayout` |
| `legal_cookies`  | `pages/legal/cookies.tsx`             | `legal/cookies`          | `legal/cookies`  | Activa | `index, follow` + canonical       | `LegalLayout` |
| `legal_refunds`  | `pages/legal/refunds.tsx`             | `legal/reembolsos`       | `legal/refunds`  | Activa | `index, follow` + canonical       | `LegalLayout` |
| `legal_disclaimer` | `pages/legal/disclaimer.tsx`        | `legal/disclaimer`       | `legal/disclaimer` | Activa | `index, follow` + canonical     | `LegalLayout` |

(Slugs FR/DE/PT/CA en `shared/routes.ts::ROUTE_SLUGS`; cobertura completa por idioma.)

### 1.2 Blog (indexable, doble forma con/sin prefijo de idioma)

| Path                       | Componente                | Estado | Guard SEO                        |
|----------------------------|---------------------------|--------|----------------------------------|
| `/blog`                    | `pages/blog/index.tsx`    | Activa | `index, follow` + canonical (sin lang) |
| `/blog/:slug`              | `pages/blog/post.tsx`     | Activa | `index, follow` + canonical            |
| `/:lang/blog`              | `pages/blog/index.tsx` (con `BlogLangEffect`) | Activa | `index, follow` |
| `/:lang/blog/:slug`        | `pages/blog/post.tsx` (con `BlogLangEffect`)  | Activa | `index, follow` |

Validaciones:
- Si `:lang` no está en `SUPPORTED_LANGS`, se redirige a `/blog` o `/blog/:slug` (sin prefijo) en cliente.
- `/:lang/blog` sin slug entra al índice; con slug entra al post.

### 1.3 Rutas SPA noindex (200 OK, no indexables)

| Path                       | Componente                  | Estado            | Guard SEO                                  | Notas |
|----------------------------|-----------------------------|-------------------|--------------------------------------------|-------|
| `/links`                   | `pages/go.tsx`              | Activa (noindex)  | `noindex, nofollow` (forzado en `routes.ts::NOINDEX_PATHS`) | Linktree público |
| `/start`                   | `pages/start.tsx`           | Activa (noindex)  | `noindex, nofollow`                        | Funnel UTM, usa `NavbarFunnel` |
| `/booking/:token`          | `pages/booking.tsx`         | Activa (noindex)  | `noindex, nofollow` (matched por `/booking/` en NOINDEX_PREFIXES y `NOINDEX_KNOWN_RE` en `static.ts`) | Token = `manageToken` enviado por email; validado server-side |

### 1.4 Raíz y fallback

| Path  | Comportamiento                                                                                  |
|-------|-------------------------------------------------------------------------------------------------|
| `/`   | `RootRedirect` → `/{lang}` según preferencia almacenada (`LanguageService.getStoredPreference()`) o `navigator.language` con fallback a `es`. |
| `*`   | `pages/not-found.tsx` con layout. SSR responde 404 + `noindex, nofollow` (`server/static.ts`). |

---

## 2. Endpoints servidor (Express)

### 2.1 API pública (`server/routes/public.ts`)

| Método | Path                                      | Guard                                   | Estado |
|--------|-------------------------------------------|-----------------------------------------|--------|
| GET    | `/api/bookings/blocked-days`              | público + rate-limit                    | Activa |
| GET    | `/api/bookings/available-slots`           | público + rate-limit                    | Activa |
| POST   | `/api/bookings/book`                      | CSRF (origin) + rate-limit + Zod        | Activa |
| GET    | `/api/booking/:bookingId?token=…`         | `token` query = `manageToken` (timing-safe compare) | Activa |
| POST   | `/api/booking/:bookingId/reschedule`      | `token` + CSRF + Zod                    | Activa |
| POST   | `/api/booking/:bookingId/cancel`          | `token` + CSRF                          | Activa |
| POST   | `/api/calculator-leads`                   | CSRF + Zod + sanitize                   | Activa |
| POST   | `/api/consent`                            | CSRF + Zod                              | Activa |
| POST   | `/api/newsletter/subscribe`               | CSRF + Zod + double opt-in              | Activa |
| GET    | `/api/newsletter/unsubscribe/:token`      | token-based                             | Activa |
| POST   | `/api/visitor`                            | CSRF + rate-limit                       | Activa |
| GET    | `/api/legal/versions`                     | público                                 | Activa |
| GET    | `/sitemap.xml`                            | público                                 | Activa |
| GET    | `/sitemap-pages.xml`                      | público                                 | Activa |
| GET    | `/sitemap-faq.xml`                        | público                                 | Activa |
| GET    | `/sitemap-blog.xml`                       | público                                 | Activa |
| GET    | `/robots.txt`                             | público                                 | Activa |
| GET    | `/api/health`                             | público (en `server/index.ts`)          | Activa |

### 2.2 Discord bot

| Path                           | Método | Guard                                              | Estado |
|--------------------------------|--------|----------------------------------------------------|--------|
| `/api/discord/interactions`    | POST   | Verificación Ed25519 (firma de Discord) — exento de CSRF (raw body) | Activa |

Slash commands (`/agenda`, `/cita`, `/ayuda`) gated por `ADMIN_DISCORD_ROLE_ID`. Sin endpoint REST equivalente.

### 2.3 Rutas internas (`server/routes/public.ts`)

| Path                                       | Guard                                | Estado |
|--------------------------------------------|--------------------------------------|--------|
| `/internal/reports/indexing`               | `noindex` por prefijo `/internal/`; sin auth (solo accesible vía curl manual) | Activa (interno) |
| `/internal/reports/indexing/:file`         | idem                                 | Activa (interno) |

### 2.4 IndexNow

| Path                          | Guard           | Estado |
|-------------------------------|-----------------|--------|
| `GET /<INDEXNOW_KEY>.txt`     | público         | Activa |

### 2.5 Endpoints retirados (regresión protegida por test)

| Path legacy                         | Comportamiento actual                          | Cobertura |
|-------------------------------------|------------------------------------------------|-----------|
| `/api/admin/*` (cualquier cosa)     | **404** vía catch-all `app.all("/api/{*rest}")` con `apiNotFound`. Sin auth, sin token, sin payload. | `tests/admin-api-removed.test.ts` |

**Por qué 404 y no 410 Gone**: el catch-all aplica a todo `/api/*` desconocido (futuro y pasado), por lo que un 410 específico requeriría una whitelist legacy que ensucia el router sin beneficio operativo. La superficie admin se canaliza íntegramente por el bot de Discord (slash commands).

---

## 3. Middleware de cabeceras

### 3.1 `server/routes.ts` (siempre activo, dev y prod)

```
NOINDEX_PATHS    = { "/links", "/start" }
NOINDEX_PREFIXES = [ "/booking/", "/internal/" ]
KNOWN_PATHS      = todas las rutas localizadas + "/blog" + "/{lang}/blog" + "/links" + "/start"
```

- Si `path ∈ NOINDEX_PATHS` o empieza por algún `NOINDEX_PREFIXES` o no es conocido → `X-Robots-Tag: noindex, nofollow`.
- Si es conocido → `X-Robots-Tag: index, follow, max-snippet:-1, max-image-preview:large` + `Link: <SITE_URL{canonical}>; rel="canonical"`.

### 3.2 `server/static.ts` (solo prod, fallback HTML del SPA)

```
NOINDEX_KNOWN_RE = /^\/booking\/[^/]+$/
```

- Match → 200 OK + meta `<robots noindex,nofollow>` + cabecera idem (página real del SPA, jamás indexable).
- No match y path no conocido → 404 + meta y cabecera noindex (incluye logging server-side de path/referrer/UA, sin query strings ni cookies).
- Match conocido (KNOWN_PATHS o blog) → 200 OK con meta inyectada por `seo-content.ts`.

### 3.3 CSRF (`server/routes.ts`)

- Aplicado a métodos no seguros (`POST`/`PATCH`/`PUT`/`DELETE`) sobre `/api/*` excepto `/api/discord/interactions` (firma Ed25519).
- Verifica `Origin`/`Referer` contra orígenes permitidos (`SITE_URL` + `EXTRA_ALLOWED_ORIGINS`).

---

## 4. Rutas reparadas / cambios en este pase

La superficie `/admin` (cliente y servidor) ha sido eliminada por completo: ya no existen rutas SPA, tombstones, prefijos NOINDEX ni regex específicos para admin. La operación admin se canaliza íntegramente por el bot de Discord.

Sin rutas huérfanas detectadas en cliente ni en servidor.

---

## 5. Convenciones para próximas pasadas

- Cualquier ruta SPA nueva debe registrarse en `shared/routes.ts::ROUTE_SLUGS` (si va al sitemap) **o** añadirse manualmente al `KNOWN_PATHS` de `server/routes.ts` y `server/static.ts` (si es noindex pero pública).
- Las páginas que muestran datos de usuario detrás de un token deben:
  1. Añadirse al `NOINDEX_PREFIXES` (cabecera).
  2. Añadirse al `NOINDEX_KNOWN_RE` (HTML del SPA en prod).
  3. Validar el token en server-side con comparación timing-safe.
- Los endpoints `/api/admin/*` permanecen fuera del router por diseño y bloqueados por el catch-all `apiNotFound`. Cualquier necesidad operativa se canaliza por el bot de Discord.
