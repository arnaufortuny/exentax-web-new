# Exentax

Plataforma web multilingüe (ES referencia + EN/FR/DE/PT/CA) que ayuda a
emprendedores digitales — principalmente hispanohablantes — a constituir y
mantener su LLC en Estados Unidos, gestionar la calculadora fiscal y
reservar consultoría a través del flujo de booking propio.

> **Documentación**: la fuente autoritativa es **`docs/architecture-map.md`**
> (mapa de carpetas, rutas, tablas, integraciones). Para el último
> hardening end-to-end ver **`docs/consolidation-2026-04.md`**. Este README
> resume el estado real para onboarding rápido y referencia operativa.

---

## Tech stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite 7, Wouter, TanStack Query v5, Tailwind 3, i18next (es/en/fr/de/pt/ca) |
| Backend | Express 5 (ESM), TypeScript 5.9, tsx (dev), esbuild (build) |
| BD | PostgreSQL vía Drizzle ORM (`drizzle-orm` + `drizzle-zod`) |
| Email | Gmail API (service account JWT) con cola persistente de reintentos |
| Reuniones | Google Calendar + Google Meet (service account) |
| Observabilidad | Logger estructurado (JSON en prod) + correlation id + métricas Prometheus |
| Runtime | Node.js 20+ |

---

## Estructura

Resumen — detalle completo en `docs/architecture-map.md` §2.

```
exentax-web/
├── client/                       # React SPA
│   └── src/
│       ├── App.tsx               # Router wouter + lazy + ScrollToTop + ErrorBoundary
│       ├── components/           # layout, sections, ui (shadcn), SEO, Tracking, …
│       ├── pages/                # 11 páginas localizadas + blog/{index,post} + utilidades
│       ├── i18n/                 # 6 locales + LanguageService + tipos generados
│       ├── lib/                  # calculator, queryClient, sanitize, clientLogger, lang-utils
│       ├── hooks/                # useReveal, useScrolled, useStats, useInlineMessage, …
│       ├── data/                 # blog-content/<lang>/*.ts + blog-i18n + blog-related
│       └── index.css             # design tokens + glass system + blog typography
├── server/
│   ├── index.ts                  # bootstrap, helmet, compression, redirects, JSON parsing, rate-limit, schedulers
│   ├── routes.ts                 # canonical + X-Robots middleware + delegación
│   ├── routes/
│   │   ├── public.ts             # booking público, calculator-leads, consent, newsletter, visitor, sitemaps, robots
│   │   ├── observability.ts      # /api/health/ready, /api/metrics, /api/client-errors
│   │   ├── api-response.ts       # helpers JSON (apiOk, apiFail, apiNotFound)
│   │   └── shared.ts             # tipos compartidos + i18n de mensajes backend
│   ├── storage/                  # core, scheduling, marketing, legal, index (Drizzle DAL)
│   ├── field-encryption.ts       # AES-256-GCM (FIELD_ENCRYPTION_KEY)
│   ├── google-credentials.ts     # service account loader
│   ├── google-meet.ts            # Calendar + Meet
│   ├── google-search-console.ts  # GSC (lecturas, opt-out con GOOGLE_SC_DISABLE)
│   ├── google-indexing.ts        # Indexing API (opt-in con GOOGLE_INDEXING_API_ENABLE)
│   ├── indexnow.ts               # ping IndexNow + ruta de verificación
│   ├── sitemap-ping.ts           # ping a buscadores hash-based
│   ├── discord.ts                # Bot REST API (POST /channels/:id/messages) + dedupe + circuit fallback
│   ├── discord-bot.ts            # Slash command + interactions endpoint (Ed25519 verified)
│   ├── discord-bot-commands.ts   # /agenda /cita /ayuda handlers + role gate
│   ├── email.ts, email-i18n.ts, email-layout.ts, email-retry-queue.ts  # Gmail API + cola PG
│   ├── circuit-breaker.ts        # CB con estado expuesto en métricas
│   ├── correlation.ts            # AsyncLocalStorage para X-Correlation-Id
│   ├── logger.ts                 # logger estructurado + redacción PII
│   ├── metrics.ts                # Prometheus + JSON
│   ├── rate-limit-store.ts       # Redis opcional (REDIS_URL) o in-memory
│   ├── lock-store.ts             # idem
│   ├── sanitize-middleware.ts    # XSS prevention (dompurify server-side)
│   ├── route-helpers.ts          # CSRF check, schedulers, helpers
│   ├── seo-content.ts            # SSR HTML por ruta + JSON-LD + breadcrumbs
│   ├── server-constants.ts       # constantes de configuración
│   ├── db.ts                     # pg Pool + Drizzle
│   ├── static.ts                 # serve dist + 404 + noindex de paths desconocidos
│   └── vite.ts                   # middleware Vite en dev
├── shared/
│   ├── routes.ts                 # ROUTE_SLUGS por idioma + resolveRoute
│   ├── schema.ts                 # 10 tablas Drizzle + insert schemas + tipos
│   └── madrid-time.ts            # helpers de zona horaria
├── docs/                         # mapa, auditorías, changelogs (ver índice abajo)
├── scripts/                      # validadores i18n, seo, lints, e2e booking/newsletter
├── tests/                        # Playwright E2E
├── package.json, tailwind.config.ts, vite.config.ts, tsconfig.json
└── playwright.config.ts
```

---

## Modelo de datos

10 tablas en `shared/schema.ts`:

| Tabla | Propósito |
|-------|-----------|
| `leads` | Leads del formulario público (con `phone` cifrado) |
| `agenda` | Reservas (booking) — índice parcial único anti-double-book |
| `calculations` | Submisiones de la calculadora fiscal (con `phone` cifrado) |
| `visits` | Tracking de visitas (consent-gated) |
| `newsletter_subscribers` | Suscriptores newsletter con token de unsubscribe |
| `blocked_days` | Días bloqueados para booking (gestionado vía bot Discord) |
| `legal_document_versions` | Versiones de documentos legales (terms/privacy/cookies/refund/disclaimer) |
| `consent_log` | Registro de consentimientos (cookies + legales) |
| `seo_rankings` | Snapshots de posicionamiento (alimenta dashboards SEO) |
| `email_retry_queue` | Cola persistente de emails fallidos (worker drena cada 60 s) |

`drizzle-zod` genera los `insertXSchema` correspondientes.

---

## API endpoints

Públicos (`server/routes/public.ts`):

| Ruta | Método | Notas |
|------|--------|-------|
| `/api/bookings/blocked-days` | GET | — |
| `/api/bookings/available-slots` | GET | — |
| `/api/bookings/book` | POST | Crea booking + Calendar/Meet + email confirmación |
| `/api/booking/:id` | GET | Vista por token |
| `/api/booking/:id/reschedule` | POST | — |
| `/api/booking/:id/cancel` | POST | — |
| `/api/calculator-leads` | POST | Crea lead desde la calculadora |
| `/api/consent` | POST | Registra consentimientos |
| `/api/newsletter/subscribe` | POST | — |
| `/api/newsletter/unsubscribe/:token` | GET | Token firmado |
| `/api/visitor` | POST | Tracking, gated por consent |
| `/api/legal/versions` | GET | Versiones vigentes de docs legales |
| `/sitemap.xml`, `/sitemap-pages.xml`, `/sitemap-faq.xml`, `/sitemap-blog.xml` | GET | Sitemaps SEO |
| `/robots.txt` | GET | — |

Operaciones internas (Discord bot — `server/discord-bot-commands.ts`, gated por `ADMIN_DISCORD_ROLE_ID`):

| Slash command | Action |
|---|---|
| `/agenda` | List upcoming bookings (paged, status-filtered). |
| `/cita ver id:<bookingId>` | Show full booking detail. |
| `/cita reagendar id:<bookingId> fecha:<…> hora:<…>` | Reschedule. |
| `/cita cancelar id:<bookingId> [motivo:<…>]` | Cancel. |
| `/cita noshow id:<bookingId>` | Mark no-show + send no-show email. |
| `/cita reenviar id:<bookingId>` | Resend booking confirmation email. |
| `/cita nueva …` | Create a booking from Discord. |
| `/ayuda` | Operator reference (ephemeral). |

Every action is mirrored to `#sistema-auditoria` via `notifyAdminAction`.

Observabilidad (`server/routes/observability.ts`):

| Ruta | Método | Propósito |
|------|--------|-----------|
| `/api/health` | GET | Liveness — no toca BD |
| `/api/health/ready` | GET | Readiness — BD + breakers + email worker |
| `/api/metrics` | GET | Prometheus (token por `METRICS_TOKEN` en prod) o JSON |
| `/api/client-errors` | POST | Ingesta de errores `window.onerror`/unhandledrejection |

Detalle de respuestas y errores en `server/routes/api-response.ts`.

---

## Variables de entorno

**Requeridas en producción** (fail-fast en `server/index.ts:18–43`):

| Variable | Propósito |
|----------|-----------|
| `DATABASE_URL` | Postgres (`sslmode=require` automático en prod) |
| `FIELD_ENCRYPTION_KEY` | AES-256-GCM PII (64 hex) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON (Calendar/Meet + Gmail) |
| `DISCORD_BOT_TOKEN` | Token del bot Exentax — entrega TODA notificación + sirve `/api/discord/interactions` |
| `DISCORD_CHANNEL_REGISTROS` | Channel ID `#exentax-registros` (registros + fallback errores) |

> El servidor entrega el 100% de las notificaciones a Discord usando el
> bot REST API (`POST /channels/{id}/messages` con `Authorization: Bot
> $DISCORD_BOT_TOKEN`). Las acciones del bot pueden además editar el
> embed original con `PATCH /channels/{id}/messages/{id}`.

Opcionales:

`PORT`, `NODE_ENV`, `LOG_LEVEL`, `LOG_FORMAT`, `SITE_URL`, `DOMAIN`,
`CONTACT_EMAIL`, `LEGAL_EMAIL`, `ADMIN_EMAIL`, `WHATSAPP_NUMBER`,
`COMPANY_ADDRESS_SHORT`, `INSTAGRAM_URL`, `TIKTOK_URL`, `YOUTUBE_URL`,
`FACEBOOK_URL`, `LINKEDIN_URL`, `EXTRA_ALLOWED_ORIGINS`, `REDIS_URL`,
`DB_POOL_MAX`, `GOOGLE_CALENDAR_ID`, `GOOGLE_SC_SITE_URL`,
`GOOGLE_SC_DISABLE`, `GOOGLE_INDEXING_API_ENABLE`,
`GOOGLE_INDEXING_MAX_PER_RUN`, `GOOGLE_INDEXING_DAILY_QUOTA`,
`INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION`, `INDEXING_AUDIT_DISABLE`,
`INDEXING_REPORTS_DIR`, `BASE_URL`, `METRICS_TOKEN`,
`DISCORD_APP_ID`, `DISCORD_PUBLIC_KEY`, `ADMIN_DISCORD_ROLE_ID`,
`DISCORD_GUILD_ID`,
`DISCORD_CHANNEL_AGENDA`, `DISCORD_CHANNEL_CALCULADORA`,
`DISCORD_CHANNEL_CONSENTIMIENTOS`, `DISCORD_CHANNEL_ACTIVIDAD`,
`DISCORD_CHANNEL_ERRORES`, `DISCORD_CHANNEL_AUDITORIA`.

---

## Seguridad

Resumen — auditoría completa en `docs/security-audit.md`.

- Helmet con CSP estricta, HSTS (prod, 2 años + preload), Referrer-Policy, X-Content-Type-Options, X-Frame-Options=SAMEORIGIN, Permissions-Policy.
- CSRF: `checkCsrfOrigin` exige Origin/Referer mismo host en mutaciones `/api/`.
- Rate limit global 200 req/min/IP con backend Redis opcional + fallback in-memory acotado.
- Validación Zod en todos los POST/PATCH/DELETE bajo `/api/`.
- Sanitización `dompurify` server-side de cada body.
- Cifrado de campos PII (`phone`) con AES-256-GCM, fail-fast si la clave falta en prod.
- Stripping de `body.id` en mutaciones.
- Sin secretos en cliente.

---

## Observabilidad

Resumen — auditoría completa en `docs/observability-audit.md`.

- Logger estructurado JSON (prod) / texto (dev), con `cid` (correlation id) propagado por `AsyncLocalStorage`.
- `unhandledRejection` + `uncaughtException` capturados con notificación a Discord (canal `errores`).
- Captura global frontend: `window.onerror` + `unhandledrejection` → `/api/client-errors`.
- Métricas Prometheus en `/api/metrics` (HTTP, breakers, colas, event-loop).
- Email retry queue persistente (PG) con worker drenando cada 60 s.
- Circuit breakers en Gmail + Calendar; estado en `/api/health/ready` y métricas.

---

## Scripts (`package.json`)

| Script | Propósito |
|--------|-----------|
| `npm run dev` | Server + Vite middleware en `:5000` |
| `npm run build` | Build prod (Vite cliente + esbuild server → `dist/`) |
| `npm run start` | Run prod (`node dist/index.mjs`) |
| `npm run check` | tsc + lint:typography + seo:check + seo:slash + seo:meta |
| `npm run lint:typography` | Regla 0 tipográfica (allowlists en `scripts/check-typography-rule0.mjs`) |
| `npm run lint:blog` | Lint contenido blog (Regla 0 + estructura) |
| `npm run seo:check` | Enlaces internos blog + cross-refs |
| `npm run seo:slash` | Slash-hygiene contra dev server |
| `npm run seo:meta` | Verificación SSR de metadatos por idioma |
| `npm run i18n:check` | Generación de tipos i18n + validación de claves |
| `npm run test:calculator` | Test unitario calculadora |
| `npm run test:newsletter`, `test:booking` | E2E reales |
| `npm run test:e2e` | Playwright E2E (booking + calculator + language switch) — ver `tests/e2e/README.md` |

### E2E booking — cobertura

`tests/e2e/booking-flow.spec.ts` cubre, sin BD ni Calendar/Gmail (todo
stubbed con `page.route`), tanto el camino feliz como las rutas de error
que el usuario real encuentra a diario:

| Bloque | Caso |
|--------|------|
| Happy path | ES `/agendar` + EN `/book` (i18n + payload del POST) |
| Manage feliz | Reschedule + cancel desde `/booking/:token` |
| **Negative book** | 409 slot ocupado (mensaje del servidor + retry) |
| **Negative book** | 422 validación (mensaje del servidor + retry) |
| **Negative book** | 500 error genérico (`booking.bookingError` + retry) |
| **Negative book** | Network abort (`route.abort` + retry) |
| **Negative manage** | Reserva ya cancelada (badge + acciones ocultas) |
| **Negative manage** | Reserva ya pasada (badge + CTA "reservar otra") |

Cada test negativo verifica que: (1) el error se muestra al usuario en
`booking-error`, (2) el formulario sigue siendo interactivo, y (3) un
reintento con respuesta OK alcanza `booking-success` — es decir, el
estado de error no envenena el formulario.

---

## Desarrollo

```bash
cd exentax-web
npm install
npm run dev    # servidor + Vite middleware en :5000
```

Requiere Node 20+ y un Postgres accesible vía `DATABASE_URL`. En dev, las
variables `prodOnly` (`FIELD_ENCRYPTION_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY`,
`DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, `DISCORD_APP_ID`, `DISCORD_GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`, `DISCORD_CHANNEL_REGISTROS`, `DISCORD_CHANNEL_AGENDA`, `DISCORD_CHANNEL_CONSENTIMIENTOS`) sólo emiten warning si faltan
— el servidor arranca igual.

---

## Build & deploy

```bash
npm run build  # Vite (client) + esbuild (server) → dist/
npm run start  # node dist/index.mjs
```

El bundle servidor sirve también el cliente desde `dist/public/`. `trust
proxy: 1` está activo (correcto detrás de Nginx/Caddy con TLS terminado).
HSTS y `upgrade-insecure-requests` se activan automáticamente en prod.

Tras cada deploy, en el orden indicado:

1. `pingSitemapIfChanged` (5 s) — sólo dispara si `/sitemap.xml` cambió.
2. `pingIndexNowForNewArticles` (7 s) — IndexNow.
3. `pingGoogleIndexingForNewArticles` (9 s) — sólo si `GOOGLE_INDEXING_API_ENABLE=1`.
4. `seo-indexing-publish.mjs` — auto-publish del informe de indexación a `uploads/reports/indexing/` (opt-out con `INDEXING_AUDIT_DISABLE=1`).

---

## Índice de docs

| Documento | Propósito |
|-----------|-----------|
| `docs/architecture-map.md` | Mapa autoritativo de carpetas, rutas, tablas, integraciones |
| `docs/data-flow.md` | Flujos principales (lead, booking, newsletter, consent) |
| `docs/security-audit.md` | Auditoría de seguridad |
| `docs/observability-audit.md` | Auditoría de observabilidad y resiliencia |
| `docs/consolidation-2026-04.md` | Pasada de hardening end-to-end (Task #5) |
| `docs/seo/audit-2026.md` | Auditoría SEO global |
| `docs/seo/url-slash-policy.md` | Política de slash y redirecciones |
| `docs/seo/internal-linking.md` | Estrategia de enlazado interno |
| `docs/seo/performance-audit.md` | Auditoría de rendimiento (LCP/CLS pendiente CrUX) |
| `docs/blog/audit-2026.md` | Auditoría editorial blog |
| `docs/i18n-check.md` | Validación i18n y CI |
| `docs/audit-design-system.md` | Sistema de diseño y Regla 0 |
