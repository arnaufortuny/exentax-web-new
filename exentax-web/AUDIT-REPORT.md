# Exentax — Auditoría Integral

**Fecha:** 2026-04-15
**Alcance:** SEO multi-idioma, indexación, código huérfano, estructura, datos, seguridad, encriptación, emails, i18n, analytics y componentes.

---

## 1. SEO — Sitemap & Robots

### Hallazgos
- **Sitemap estático duplicado:** `client/public/sitemap.xml` contenía rutas legacy (`/agendar-asesoria`, `/start`, `/servicios`) sin hreflang, compitiendo con el sitemap dinámico del servidor que sí genera hreflang correctos para los 6 idiomas.
- **robots.txt:** Faltaba `Disallow: /admin/` — las rutas de administración estaban accesibles para crawlers.

### Cambios realizados
- ✅ Eliminado `client/public/sitemap.xml` estático — el servidor ya genera uno dinámico correcto en `/sitemap.xml`
- ✅ Añadido `Disallow: /admin/` al robots.txt dinámico en `server/routes/public.ts`

### Estado final
- Sitemap dinámico incluye todas las páginas públicas × 6 idiomas con hreflang correcto y x-default apuntando a `/es`
- robots.txt bloquea: `/api/`, `/admin/`, `/links`, `/start`, `/booking/`
- Coherencia total entre sitemap (solo rutas indexables), robots.txt (disallow no-index paths) y X-Robots-Tag headers

---

## 2. Rutas Legacy en SEO Content

### Hallazgos
- **39 referencias** a `/agendar-asesoria` en `seo-content.ts` — ruta inexistente en el sistema de routing actual
- Links de navegación internos en SEO content usaban rutas bare sin prefijo de idioma: `/servicios`, `/como-trabajamos`, `/sobre-las-llc`, `/preguntas-frecuentes`
- Structured data (JSON-LD) en BreadcrumbList y Service schemas apuntaban a `/agendar-asesoria` y `/servicios`
- `parseMarkdown()` en `blog/post.tsx` usaba `/agendar-asesoria` como fallback por defecto

### Cambios realizados
- ✅ Reemplazadas las 39 referencias a `/agendar-asesoria` → `/es/agendar` en `seo-content.ts`
- ✅ Actualizados todos los links de navegación interna a rutas localizadas:
  - `/servicios` → `/es/nuestros-servicios`
  - `/como-trabajamos` → `/es/como-trabajamos`
  - `/sobre-las-llc` → `/es/sobre-las-llc`
  - `/preguntas-frecuentes` → `/es/preguntas-frecuentes`
- ✅ Actualizado JSON-LD: BreadcrumbList items, Service offer URLs, HowTo step URLs
- ✅ Actualizado fallback de `parseMarkdown()` en `blog/post.tsx`: `/agendar-asesoria` → `/es/agendar`

### Estado final
- Zero referencias a `/agendar-asesoria` en todo el codebase
- Todos los links internos en SEO content usan rutas localizadas con prefijo de idioma

---

## 3. Indexación y noindex

### Verificación
| Ruta | X-Robots-Tag | meta robots (SEO.tsx) | Sitemap | robots.txt | Estado |
|------|-------------|----------------------|---------|-----------|--------|
| `/start` | `noindex, nofollow` via NOINDEX_PATHS | `noindex: true` en PAGE_META | Excluida | `Disallow: /start` | ✅ Coherente |
| `/links` | `noindex, nofollow` via NOINDEX_PATHS | `noindex: true` en PAGE_META | Excluida | `Disallow: /links` | ✅ Coherente |
| `/booking/*` | `noindex, nofollow` via NOINDEX_PREFIXES | No tiene SEO component | Excluida | `Disallow: /booking/` | ✅ Coherente |
| `/admin/*` | `noindex, nofollow` via NOINDEX_PREFIXES | No tiene SEO component | Excluida | `Disallow: /admin/` | ✅ Coherente |

### Estado final
- Sin contradicciones entre las tres capas (servidor headers, componente SEO.tsx, sitemap)

---

## 4. Limpieza de Assets

### Hallazgos
- `partner-wallester.png` — No referenciado en ningún componente (la versión `.webp` se usa en BanksCarousel.tsx y go.tsx)
- `partner-lili.webp` — Preloaded en `index.html` pero no renderizado en ningún componente

### Cambios realizados
- ✅ Eliminado `client/public/img/partner-wallester.png` (redundante, se usa `.webp`)
- ✅ Eliminado preload de `partner-lili.webp` en `client/index.html`

### Assets verificados como en uso
- `partner-mercury.webp`, `partner-relay.webp`, `partner-visa.webp`, `partner-stripe.webp`, `partner-wallester.webp`: BanksCarousel.tsx + go.tsx + index.html preload
- `partner-wise.png`: BanksCarousel.tsx + index.html preload
- `partner-interactive-brokers.png`, `partner-kraken.png`, `partner-slash.png`: BanksCarousel.tsx
- `partner-trustpilot.png`: go.tsx + Footer.tsx
- `partner-lili.webp`: **Solo asset, sin componente que lo renderice** — conservado en disco por si se re-incorpora
- Flags (`/img/flags/*.png`): calculator.ts

---

## 5. Código Huérfano e Imports

### Verificación
- **`client/src/lib/sanitize.ts`:** ✅ Confirmado en uso — importado en 8 archivos (HomeFAQ.tsx, about-llc.tsx, blog/post.tsx, cookies.tsx, disclaimer.tsx, privacy.tsx, refunds.tsx, terms.tsx)
- **Imports sin uso:** No se encontraron imports muertos en archivos clave
- **Componentes huérfanos:** No detectados — todos los lazy-loaded components en App.tsx están asignados a rutas activas
- **`sendFollowupStepsEmail` y `sendFollowupReviewEmail`:** Estaban definidos en email.ts pero nunca se invocaban desde ninguna ruta. **Eliminados** junto con sus traducciones i18n en los 6 idiomas y las interfaces TypeScript asociadas.

---

## 6. i18n — Limpieza

### Resultados de validate-i18n.ts
- **6 idiomas:** ES (referencia), EN, FR, DE, PT, CA
- **1078 keys** en cada idioma — total consistencia
- **0 keys faltantes** en cualquier idioma
- **0 keys extra** en cualquier idioma
- **0 valores vacíos**
- **0 mismatches de placeholders**
- **0 keys huérfanas** (no referenciadas en código)
- **230 "possibly untranslated"** — son brand names, URLs, technical terms (nav.whatsapp, footer.social.instagram, etc.) que correctamente mantienen el mismo valor en todos los idiomas

### Cambios realizados
- ✅ Ejecutado `generate-i18n-types.ts` — regenerados 1078 keys, 104 namespaces en `keys.generated.ts`

### Estado final
- Sin acción necesaria sobre keys — el sistema i18n está limpio y consistente

---

## 7. Email — Auditoría

### Templates activos
| Template | Invocado desde | Estado |
|---------|---------------|--------|
| `sendBookingConfirmation` | public.ts (`/api/booking`), admin.ts | ✅ Activo |
| `sendCalculatorEmail` | public.ts (`/api/calculator`) | ✅ Activo |
| `sendRescheduleConfirmation` | public.ts (`/api/booking/reschedule`), admin.ts | ✅ Activo |
| `sendCancellationEmail` | public.ts (`/api/booking/cancel`), admin.ts | ✅ Activo |
| `sendReminderEmail` | route-helpers.ts (cron/background) | ✅ Activo |
| `sendNoShowRescheduleEmail` | admin.ts (mark no-show) | ✅ Activo |
| `sendFollowupStepsEmail` | No invocado | ❌ Eliminado (código muerto) |
| `sendFollowupReviewEmail` | No invocado | ❌ Eliminado (código muerto) |

### email-i18n.ts
- Traducciones completas en los 6 idiomas para todos los templates activos
- `resolveEmailLang()` normaliza correctamente el idioma del usuario y cae a `es` como fallback

### Decisión
- Los templates de followup han sido **eliminados** — no se invocaban desde ninguna ruta, endpoint ni cron. Se eliminaron las funciones, interfaces y traducciones i18n (6 idiomas) correspondientes.
- También se limpió el README: eliminada referencia al endpoint fantasma `/api/admin/clients/:id/trustpilot-invite` y las env vars `TRUSTPILOT_URL`/`TRUSTPILOT_SAF_EMAIL` que no existían en el servidor.

---

## 8. Analytics — Auditoría

### Tracking.tsx
- **IDs de tracking:** ✅ Todos vienen de env vars (`VITE_GA4_ID`, `VITE_GTM_ID`, `VITE_META_PIXEL_ID`) — ninguno hardcodeado
- **Pageview duplicado:** ✅ No hay duplicación — GA4 configurado con `send_page_view: false`, el pageview manual se dispara solo vía cambio de location
- **Consent mode:** ✅ Correcto — por defecto todo en `denied`, se actualiza a `granted` solo tras consentimiento explícito del usuario
- **reportVisit:** ✅ Solo envía datos cuando `consent === "all"` — respeta el consentimiento
- **GTM:** Se inicializa solo con consentimiento, no duplica eventos de GA4 por diseño (GA4 usa gtag directo, GTM usa dataLayer)
- **Meta Pixel:** Se inicializa solo con consentimiento, trackea PageView solo en `trackPageView()` con consent check

### Estado final
- Sin issues de analytics detectados

---

## 9. Seguridad y Datos

### Encriptación (AES-256-GCM)
- **Campo `phone`:** ✅ Encriptado consistentemente en `leads`, `agenda` y `calculations` tables
- **Formato:** `ef:<iv>:<tag>:<ciphertext>` en hex
- **Key management:** Variable de entorno `FIELD_ENCRYPTION_KEY`, validación estricta en producción
- **Backward compatibility:** `decryptField()` retorna valores sin prefijo `ef:` como plaintext (legacy data)

### Booking tokens
- ✅ `timingSafeEqual` usado en `admin.ts` (line 41) y `scheduling.ts` (line 45) para comparación de tokens

### Sanitización
- ✅ `autoSanitizeMiddleware` cubre HTML escaping, prototype pollution (`__proto__`, `constructor`, `prototype`), recursión depth limits (10), key limits (500), array limits (200)
- ✅ Aplicado a `req.query`, `req.params` y `req.body`

### ID Override Protection
- ✅ Middleware en `routes.ts` (line 79-85) elimina `body.id` en PUT/PATCH/POST requests

### CSRF
- ✅ `checkCsrfOrigin` valida origin/referer en todos los requests mutadores a `/api/`

### API Response Data
- Decryption ocurre en storage layer antes de devolver datos — las respuestas API para admin contienen datos descifrados (necesario para operación). Las respuestas públicas no exponen datos de otros usuarios.

### Campos de DB documentados
- **`irpfSimulation`** (tabla `calculations`): Almacenado como `text` con valores "yes"/"no" — por compatibilidad legacy. No cambiar tipo sin migración planificada.
- **Columnas en español** (`nombre`, `telefono`, `simulacion_irpf`): Se mantienen por estabilidad de datos existentes. Renombrar requiere migración coordinada.

---

## 10. Backend Audit — Endpoints, Storage, Security & Infrastructure

### 10.1 Endpoint Validation Matrix

All public endpoints have Zod schema validation, rate limiting, and structured error responses:

| Endpoint | Method | Rate Limiter | Zod Schema | Auth |
|----------|--------|-------------|------------|------|
| `/api/bookings/blocked-days` | GET | `publicDataLimiter` (60/min) | — | — |
| `/api/bookings/available-slots` | GET | `publicDataLimiter` (60/min) | `slotsQuerySchema` (date) | — |
| `/api/bookings/book` | POST | `bookingLimiter` (5/hr) | `bookingRequestSchema` (name, email, phone, date, time, profit, etc.) | — |
| `/api/booking/:bookingId` | GET | `bookingLimiter` (5/hr) | ID+token length checks | Token (query) |
| `/api/booking/:id/reschedule` | POST | `bookingLimiter` (5/hr) | `rescheduleSchema` (date, startTime) | Token (query) |
| `/api/booking/:id/cancel` | POST | `bookingLimiter` (5/hr) | Logic checks | Token (query) |
| `/api/calculator-leads` | POST | `calcLimiter` (10/hr) | `calculatorLeadSchema` (email, phone, country, income, savings, breakdown) | — |
| `/api/consent` | POST | `consentLimiter` (20/min) | `cookieConsentSchema` (tipo, aceptado, version, idioma) | — |
| `/api/newsletter/subscribe` | POST | `newsletterLimiter` (3/hr) | `newsletterSubscribeSchema` (email, consent) | — |
| `/api/visitor` | POST | `visitorLimiter` (30/min) | `visitorSchema` (UTM, page, screen) + bot check | — |
| `/api/legal/versions` | GET | — | — | — |
| `/api/newsletter/unsubscribe/:token` | GET | — | Token length < 200 | Token (param) |

All admin endpoints protected by `adminAuth` middleware (token via query/header, `timingSafeEqual`):

| Endpoint | Method | Validation |
|----------|--------|-----------|
| `/api/admin/verify` | GET | `adminAuth` only |
| `/api/admin/agenda/:bookingId` | GET | bookingId length < 100 |
| `/api/admin/agenda/:id/reschedule` | POST | `parseSchema` (date, startTime) + weekday/past/blocked checks |
| `/api/admin/agenda/:id/cancel` | POST | bookingId length < 100 + status check |
| `/api/admin/agenda/:id/no-show` | POST | bookingId length < 100 + status check |
| `/api/admin/agenda/:id/send-noshow` | POST | bookingId length < 100 |
| `/api/admin/agenda/:id/resend-confirmation` | POST | bookingId length < 100 |

### 10.2 Rate Limit Coverage Map

| Limiter | Max | Window | Used By |
|---------|-----|--------|---------|
| `bookingLimiter` | 5 | 1 hour | book, reschedule, cancel, booking GET |
| `calcLimiter` | 10 | 1 hour | calculator-leads |
| `newsletterLimiter` | 3 | 1 hour | newsletter/subscribe |
| `publicDataLimiter` | 60 | 1 min | available-slots, blocked-days |
| `visitorLimiter` | 30 | 1 min | visitor |
| `consentLimiter` | 20 | 1 min | consent |

All state-mutating endpoints have rate limits. Read-only `/api/legal/versions` is unprotected (low-cost, cacheable).

### 10.3 Storage Layer Audit

| Module | Functions | Error Handling | Encryption |
|--------|-----------|---------------|------------|
| `storage/core.ts` | `generateId`, `normalizeEmail`, `wrapStorageError` | All functions throw via `wrapStorageError` | — |
| `storage/scheduling.ts` | `insertAgenda`, `updateAgenda`, `getAgendaByIdAndToken`, etc. | Consistent `wrapStorageError` | `AGENDA_SENSITIVE` (phone) |
| `storage/marketing.ts` | `insertLead`, `insertVisit`, `upsertNewsletterSubscriber`, etc. | Consistent `wrapStorageError` | `LEAD_SENSITIVE` (phone) |
| `storage/legal.ts` | `insertLegalDocVersion`, `getActiveLegalDocVersion`, etc. | Consistent `wrapStorageError` | — |

Findings:
- ✅ All storage functions use `wrapStorageError` consistently — no silent swallowing
- ✅ No duplicated queries across modules
- ✅ Encryption applied consistently to `phone` in both `leads` and `agenda` tables
- ✅ `timingSafeEqual` for token comparison (scheduling + admin)

### 10.4 Security Verification

| Layer | Status | Details |
|-------|--------|---------|
| CSRF | ✅ | `checkCsrfOrigin` validates Origin/Referer on all `/api/` mutations |
| Sanitization | ✅ | `autoSanitizeMiddleware` covers HTML escaping, prototype pollution, depth/key/array limits |
| Field Encryption | ✅ | AES-256-GCM on phone fields; `ef:` prefix format; backward-compatible plaintext fallback |
| ID Override | ✅ | Middleware strips `body.id` on PUT/PATCH/POST |
| Rate Limiting | ✅ | All mutation endpoints rate-limited (see map above) |
| Admin Auth | ✅ | `timingSafeEqual` token comparison, no timing leaks |
| PII in Logs | ✅ | `logger.ts` redacts 28+ sensitive field patterns |
| Token Generation | ✅ | `crypto.randomBytes(24)` for booking tokens, unsubscribe tokens |

### 10.5 Backend Code Changes (This Audit)

| File | Change | Audit Area |
|------|--------|-----------|
| `server/discord.ts` | Removed dead `notifySystemEvent` export | Dead code |
| `server/static.ts` | Removed redundant `SupportedLang` type alias, unused `ROUTE_SLUGS`/`ALL_ROUTE_KEYS` imports | Dead code, types |
| `server/email-i18n.ts` | Removed redundant `Lang` type alias | Types |
| `server/field-encryption.ts` | Fixed `encryptField` returning `undefined` instead of `null` for null input | Correctness |
| `server/storage/core.ts` | Defensive guard in `normalizeEmail` for empty input | Input validation |
| `server/storage/scheduling.ts` | Input validation guard in `getAgendaByIdAndToken` | Input validation |
| `server/routes/admin.ts` | `bookingId.length > 100` validation on all 5 admin endpoints | Input validation |
| `server/routes/public.ts` | Fixed variable shadowing (`schema` → `rescheduleSchema`) | Correctness |
| `server/routes/shared.ts` | Removed 3 dead backend labels (`zodNameRequired`, `missingFields`, `validEmailRequired`) | Dead code |
| `server/email.ts` | Enhanced `logEmail()` structured output; removed dead `gastosDeducibles` | Dead code, logging |
| `server/index.ts` | Removed redundant `log()` wrapper (7 callsites) | Dead code |
| `server/sanitize-middleware.ts` | Removed dead `SKIP_PATHS` array | Dead code |
| `server/route-helpers.ts` | Exported `PHONE_MIN_DIGITS` constant | Consistency |
| `server/server-constants.ts` | Exported `DATE_LOCALE_ISO` constant | Consistency |
| `server/google-meet.ts` | Added defensive input validation guards | Input validation |
| `server/google-sheets.ts` | Upgraded append errors to `logger.error` with stack traces | Error handling |
| `server/rate-limit-store.ts` | Added cleanup activity debug logging | Observability |
| `server/circuit-breaker.ts` | Removed dead `getStatus()` method (never called) | Dead code |

### 10.6 Files Audited — No Changes Needed

| File | Reason |
|------|--------|
| `server/logger.ts` | Clean — PII redaction comprehensive (28+ patterns), log levels correct |
| `server/db.ts` | Clean — Pool config correct, idempotent column migrations, proper error handling |
| `server/google-credentials.ts` | Clean — Graceful degradation when key missing, validation for required fields |
| `server/google-utils.ts` | Clean — `isTransient`/`isAuthError` helpers correctly used by meet/email |
| `server/routes/api-response.ts` | Clean — Standardized response wrappers, i18n resolution |
| `server/storage/index.ts` | Clean — Barrel export, all re-exports verified active |
| `server/storage/legal.ts` | Clean — Consistent `wrapStorageError`, proper seed idempotency |
| `server/storage/marketing.ts` | Clean — Encryption on insert/decrypt on read, proper upsert logic |
| `server/email-layout.ts` | Clean — All helpers/constants actively used, i18n for 6 languages |
| `shared/schema.ts` | Clean — All fields verified in active use; boolean-as-text fields documented |

---

## 11. Resumen de Cambios

| Archivo | Acción |
|---------|--------|
| `client/public/sitemap.xml` | Eliminado (sitemap dinámico del servidor lo reemplaza) |
| `client/public/img/partner-wallester.png` | Eliminado (redundante, se usa .webp) |
| `client/index.html` | Eliminado preload de `partner-lili.webp` |
| `server/routes/public.ts` | Añadido `Disallow: /admin/` en robots.txt |
| `server/seo-content.ts` | Reemplazadas 39 refs `/agendar-asesoria` → `/es/agendar`; actualizados links internos y JSON-LD a rutas localizadas |
| `client/src/pages/blog/post.tsx` | Actualizado fallback de parseMarkdown |
| `client/src/i18n/keys.generated.ts` | Regenerado tras validación i18n |
| `server/email.ts` | Eliminados `sendFollowupStepsEmail`, `sendFollowupReviewEmail` y sus interfaces |
| `server/email-i18n.ts` | Eliminados bloques `followupSteps` y `followupReview` (tipo + 6 idiomas) |
| `README.md` | Eliminado endpoint fantasma `trustpilot-invite`, env vars `TRUSTPILOT_URL`/`TRUSTPILOT_SAF_EMAIL`, ref "Trustpilot" en tree |

### Sin cambios necesarios
- `sanitize.ts` — Confirmado en uso (8+ archivos)
- `Tracking.tsx` — Sin issues de duplicación ni consent
- `email.ts` / `email-i18n.ts` — Traducciones completas, templates activos correctos
- `field-encryption.ts` — Encriptación consistente
- `SEO.tsx` — Coherente con servidor headers y sitemap
- Esquema de base de datos — Sin cambios (fuera de scope)

---

## Pre-existing Issues (No Modificados, Documentados)

1. **TypeScript error pre-existente:** `server/routes/admin.ts:289` — Type `"no_show"` no asignable a tipo esperado. No introducido por esta auditoría.
2. **`partner-lili.webp`:** Asset conservado en disco pero sin componente que lo renderice. Puede eliminarse o incorporarse a BanksCarousel si se desea mostrar.
3. **`sendFollowupStepsEmail` / `sendFollowupReviewEmail`:** Eliminados — eran código muerto sin invocación.
4. **`irpfSimulation` como text:** Almacena "yes"/"no" como string por compatibilidad legacy. Migración a boolean requiere planificación separada.
