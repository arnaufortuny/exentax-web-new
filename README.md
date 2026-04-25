# Exentax Web

Web pública de Exentax: landing, blog multilingüe, sistema de reservas de asesoría con Google Meet, calculadora fiscal, newsletter, páginas legales y operación admin íntegramente vía bot de Discord. Aplicación full-stack en un único proceso Node que sirve frontend (SPA React) y backend (API Express) con SEO multiidioma server-side.

> **Estado (2026-04-22):** Task #8 — cierre total production-ready en verde. `npm run check` EXIT 0 (TS + lints + 10 puertas SEO/blog + i18n + 5 e2e). Reportes en `.local/reports/` y `docs/internal/PRODUCTION-READY-REPORT.md`. Detalle en `replit.md`, `exentax-web/docs/CHANGELOG.md` y `exentax-web/docs/`. Para agentes automatizados: leer `docs/internal/AGENT-RULES.md` antes de cualquier sesión.

---

## Stack

- **Frontend:** React 19 · Vite 7 · Wouter (routing) · TanStack Query v5 · Tailwind CSS 3 · i18next + react-i18next
- **Backend:** Node.js 20 + Express 5 (ESM) · TypeScript 5.9 · Drizzle ORM · PostgreSQL (`pg`) · Helmet · Compression
- **Integraciones:** Google APIs (Gmail send + Calendar/Meet + Search Console + Indexing API) · Discord Bot REST API (notificaciones + slash commands + interactions Ed25519) · Redis (opcional, rate limiting/locks)
- **Validación:** Zod + drizzle-zod
- **Build:** tsx (dev) · esbuild + Vite (prod)

---

## Estructura del proyecto

```
exentax-web/
├── client/src/
│   ├── App.tsx                  # Router wouter + lazy + ScrollToTop + ErrorBoundary
│   ├── pages/                   # home, services (+ subpáginas LLC NM/WY/DE/FL + ITIN),
│   │                            # how-we-work, about-llc, faq-page, book, booking,
│   │                            # start, go, blog/{index,post}, legal/*
│   ├── components/              # layout, sections, blog, SEO, Tracking, icons, …
│   ├── i18n/                    # 6 locales + LanguageService + tipos generados
│   ├── data/                    # blog-posts, blog-content/<lang>/*, blog-i18n,
│   │                            # blog-related, blog-posts-slugs, blog-sources
│   ├── lib/                     # calculator, queryClient, sanitize, clientLogger, lang-utils
│   ├── hooks/
│   └── index.css                # design tokens + glass system + blog typography
├── server/
│   ├── index.ts                 # bootstrap Express, fail-fast de env vars,
│   │                            # helmet/CSP, compression, redirects 301
│   │                            # (legacy ES + slash hygiene), JSON parsing,
│   │                            # rate-limit global, schedulers
│   ├── routes.ts                # canonical + X-Robots middleware + delegación
│   ├── routes/
│   │   ├── public.ts            # booking público, calculator-leads, consent,
│   │   │                        # newsletter, visitor, sitemaps, robots
│   │   ├── observability.ts     # /api/health/ready, /api/metrics, /api/client-errors
│   │   ├── api-response.ts      # apiOk / apiFail / apiNotFound / apiValidationFail
│   │   └── shared.ts            # tipos compartidos + i18n de mensajes backend
│   ├── storage/                 # core, scheduling, marketing, legal (Drizzle DAL)
│   ├── db.ts                    # pg Pool + Drizzle + migraciones de columnas
│   ├── field-encryption.ts      # AES-256-GCM (FIELD_ENCRYPTION_KEY)
│   ├── google-credentials.ts    # service account loader
│   ├── google-meet.ts           # Calendar + Meet (crear/borrar eventos)
│   ├── google-search-console.ts # GSC reads (opt-out con GOOGLE_SC_DISABLE)
│   ├── google-indexing.ts       # Indexing API (opt-in con GOOGLE_INDEXING_API_ENABLE)
│   ├── indexnow.ts              # Ping IndexNow + ruta de verificación
│   ├── sitemap-ping.ts          # Ping a buscadores hash-based
│   ├── discord.ts               # Bot REST API: POST /channels/:id/messages + dedupe
│   ├── discord-bot.ts           # Slash commands + /api/discord/interactions (Ed25519)
│   ├── discord-bot-commands.ts  # /agenda /cita /ayuda + role gate (ADMIN_DISCORD_ROLE_ID)
│   ├── email.ts, email-i18n.ts, email-layout.ts, email-retry-queue.ts
│   ├── circuit-breaker.ts       # CB con estado expuesto en métricas
│   ├── correlation.ts           # AsyncLocalStorage para X-Correlation-Id
│   ├── logger.ts                # logger estructurado (JSON en prod) + redacción PII
│   ├── metrics.ts               # Prometheus + JSON
│   ├── rate-limit-store.ts      # Redis opcional (REDIS_URL) o in-memory
│   ├── lock-store.ts            # idem (slot/booking locks)
│   ├── sanitize-middleware.ts   # XSS prevention (dompurify server-side)
│   ├── route-helpers.ts         # CSRF check, schedulers, helpers
│   ├── seo-content.ts           # SSR HTML por ruta + JSON-LD + breadcrumbs
│   ├── server-constants.ts
│   ├── static.ts                # serve dist + 404 + noindex de paths desconocidos
│   └── vite.ts                  # middleware Vite en dev
├── shared/
│   ├── routes.ts                # ROUTE_SLUGS por idioma + resolveRoute (fuente única)
│   ├── schema.ts                # Schema Drizzle (10 tablas) + insert schemas + tipos
│   └── madrid-time.ts           # helpers de zona horaria
├── docs/                        # mapa, auditorías, changelogs
├── scripts/                     # build.ts + validadores i18n/SEO/blog + e2e
└── tests/                       # Playwright E2E

(en la raíz del repo)
├── package.json                 # Scripts de ejecución (dev, build, start, db:*)
├── drizzle.config.ts            # Configuración de Drizzle Kit
├── migrations/                  # Migraciones SQL versionadas
├── .replit                      # Config Replit (workflows + ports + deployment)
└── replit.md                    # Memoria del proyecto (preferencias, arquitectura, auditorías)
```

---

## Páginas y rutas

Páginas localizadas bajo prefijo de idioma `/:lang/...` con `lang ∈ {es, en, fr, de, pt, ca}`. La raíz `/` redirige al idioma detectado/preferido. Slugs traducidos en `shared/routes.ts → ROUTE_SLUGS` (fuente única consumida por cliente y servidor).

| Clave de ruta | es | en | fr | de | pt | ca |
|---------------|----|----|----|----|----|----|
| `home` | `/es` | `/en` | `/fr` | `/de` | `/pt` | `/ca` |
| `how_we_work` | `/es/como-trabajamos` | `/en/how-we-work` | `/fr/comment-nous-travaillons` | `/de/wie-wir-arbeiten` | `/pt/como-trabalhamos` | `/ca/com-treballem` |
| `our_services` | `/es/servicios` | `/en/services` | `/fr/services` | `/de/leistungen` | `/pt/servicos` | `/ca/serveis` |
| `service_llc_nm` | `/es/servicios/llc-nuevo-mexico` | `/en/services/llc-new-mexico` | `/fr/services/llc-nouveau-mexique` | `/de/leistungen/llc-new-mexico` | `/pt/servicos/llc-novo-mexico` | `/ca/serveis/llc-nou-mexic` |
| `service_llc_wy` | `/es/servicios/llc-wyoming` | `/en/services/llc-wyoming` | `/fr/services/llc-wyoming` | `/de/leistungen/llc-wyoming` | `/pt/servicos/llc-wyoming` | `/ca/serveis/llc-wyoming` |
| `service_llc_de` | `/es/servicios/llc-delaware` | `/en/services/llc-delaware` | `/fr/services/llc-delaware` | `/de/leistungen/llc-delaware` | `/pt/servicos/llc-delaware` | `/ca/serveis/llc-delaware` |
| `service_llc_fl` | `/es/servicios/llc-florida` | `/en/services/llc-florida` | `/fr/services/llc-floride` | `/de/leistungen/llc-florida` | `/pt/servicos/llc-florida` | `/ca/serveis/llc-florida` |
| `service_itin` | `/es/servicios/obten-tu-itin` | `/en/services/get-your-itin` | `/fr/services/obtiens-ton-itin` | `/de/leistungen/hol-deine-itin` | `/pt/servicos/obtenha-seu-itin` | `/ca/serveis/obte-el-teu-itin` |
| `about_llc` | `/es/sobre-las-llc` | `/en/about-llc` | `/fr/a-propos-des-llc` | `/de/uber-llc` | `/pt/sobre-llc` | `/ca/sobre-les-llc` |
| `faq` | `/es/preguntas-frecuentes` | `/en/faq` | `/fr/questions-frequentes` | `/de/haufige-fragen` | `/pt/perguntas-frequentes` | `/ca/preguntes-frequents` |
| `book` | `/es/agendar` | `/en/book` | `/fr/reserver` | `/de/buchen` | `/pt/agendar` | `/ca/agendar` |
| `legal_terms` | `/es/legal/terminos` | `/en/legal/terms` | `/fr/legal/conditions` | `/de/legal/agb` | `/pt/legal/termos` | `/ca/legal/termes` |
| `legal_privacy` | `/es/legal/privacidad` | `/en/legal/privacy` | `/fr/legal/confidentialite` | `/de/legal/datenschutz` | `/pt/legal/privacidade` | `/ca/legal/privacitat` |
| `legal_cookies` | `/es/legal/cookies` | `/en/legal/cookies` | `/fr/legal/cookies` | `/de/legal/cookies` | `/pt/legal/cookies` | `/ca/legal/cookies` |
| `legal_refunds` | `/es/legal/reembolsos` | `/en/legal/refunds` | `/fr/legal/remboursements` | `/de/legal/erstattungen` | `/pt/legal/reembolsos` | `/ca/legal/reemborsaments` |
| `legal_disclaimer` | `/es/legal/disclaimer` | `/en/legal/disclaimer` | `/fr/legal/avertissement` | `/de/legal/haftungsausschluss` | `/pt/legal/aviso-legal` | `/ca/legal/avis-legal` |

Rutas adicionales:

| Ruta | Descripción |
|------|-------------|
| `/:lang/blog` | Listado de artículos por idioma |
| `/:lang/blog/:slug` | Artículo (slug traducido por idioma; 301 a slug canónico si llega uno deprecado/cross-locale) |
| `/booking/:bookingId?token=...` | Gestión de una reserva existente (reagendar/cancelar). `noindex` |
| `/start` | Captura rápida de lead — `noindex` |
| `/links` | Redirector de enlaces — `noindex` |

Redirecciones 301 servidas en `server/index.ts`:

- Slash hygiene: trailing slash, dobles slash y prefijos de idioma duplicados → forma canónica.
- 36 redirecciones legacy de URLs ES sin prefijo y de los slugs antiguos de `our_services` (`LEGACY_ES_REDIRECTS`).
- `blog.exentax.com/*` → `exentax.com/blog/*`.

---

## API pública

Base: `/api`. Todas las mutaciones requieren `Origin`/`Referer` válido (CSRF). Rate limiting global por IP (200 req/min) + límites específicos por endpoint. Body limit: 100 kB. Respuestas normalizadas vía `apiOk` / `apiFail` (`{ ok: true, ...data }` o `{ ok: false, error, code, details? }`).

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/bookings/blocked-days` | Fechas bloqueadas |
| GET | `/api/bookings/available-slots?date=YYYY-MM-DD` | Slots libres (Europe/Madrid, días laborables, sin solapes ni pasados) |
| POST | `/api/bookings/book` | Crear reserva (Calendar+Meet, email, recordatorio, lock por slot, transacción atómica) |
| GET | `/api/booking/:bookingId?token=...` | Datos de la reserva para gestión |
| POST | `/api/booking/:bookingId/reschedule?token=...` | Reagendar |
| POST | `/api/booking/:bookingId/cancel?token=...` | Cancelar |

### Marketing, leads y consentimiento

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/calculator-leads` | Lead desde la calculadora + email |
| POST | `/api/consent` | Registro independiente de consentimiento |
| POST | `/api/newsletter/subscribe` | Alta en newsletter |
| GET | `/api/newsletter/unsubscribe/:token` | Baja por token |
| POST | `/api/visitor` | Registro de visita (gated por consent) |
| GET | `/api/legal/versions` | Versiones activas de los documentos legales |

### Observabilidad y SEO

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Liveness puro (no toca DB) |
| GET | `/api/health/ready` | Readiness: DB + circuit breakers + heartbeat email worker |
| GET | `/api/metrics` | Prometheus por defecto, JSON con `Accept: application/json` (token por `METRICS_TOKEN` en prod) |
| POST | `/api/client-errors` | Ingesta de errores `window.onerror` / `unhandledrejection` |
| GET | `/sitemap.xml`, `/sitemap-pages.xml`, `/sitemap-faq.xml`, `/sitemap-blog.xml` | Sitemaps multiidioma (cache 1 h) |
| GET | `/robots.txt` | Robots dinámico |
| GET | `/<INDEXNOW_KEY>.txt` | Verificación IndexNow |

### Operaciones admin (Discord)

No hay panel web admin. La operación se hace desde el bot Discord (`server/discord-bot*.ts`), gated por `ADMIN_DISCORD_ROLE_ID`. Endpoint que recibe las interactions:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/discord/interactions` | Webhook entrante de Discord (firma Ed25519 verificada) |

| Slash command | Acción |
|---|---|
| `/agenda` | Lista reservas próximas (paginado, filtrado por estado) |
| `/cita ver id:<bookingId>` | Detalle completo de la reserva |
| `/cita reagendar id:<bookingId> fecha:<…> hora:<…>` | Reagendar |
| `/cita cancelar id:<bookingId> [motivo:<…>]` | Cancelar |
| `/cita noshow id:<bookingId>` | Marcar no-show + email |
| `/cita reenviar id:<bookingId>` | Reenviar email de confirmación |
| `/cita nueva …` | Crear reserva desde Discord |
| `/ayuda` | Ayuda operativa (ephemeral) |

Cada acción se replica en `#sistema-auditoria` vía `notifyAdminAction` y se persiste en `agenda_admin_actions`.

---

## Sistema de reservas

1. **Disponibilidad** — `available-slots` filtra por días laborables, no bloqueados, sin solapes y sin franjas pasadas en `Europe/Madrid`.
2. **Reserva** — `POST /api/bookings/book` adquiere lock por slot (`withSlotLock`), comprueba que el slot no esté tomado, rechaza emails con reserva activa, crea evento Google Calendar + Meet, persiste filas en `agenda` y `leads` dentro de una transacción y encola el email de confirmación en `email_retry_queue` también dentro de la misma transacción (atomicidad: si la tx aborta, no hay email huérfano; si el proceso muere tras commit, el worker lo enviará en el siguiente ciclo).
3. **Confirmación** — se genera `manageToken` (guardado en `agenda` y enviado por email). Se programa un recordatorio 3 horas antes del inicio.
4. **Gestión cliente** — `/booking/:bookingId?token=...` permite reagendar (borra el evento Meet anterior, crea uno nuevo, reprograma recordatorio) o cancelar (marca `cancelled`, borra Meet, envía email).
5. **Recuperación** — al arrancar, el servidor reprograma los recordatorios pendientes (sobrevive a reinicios).

Estados de `agenda`: `pending`, `contacted`, `in_progress`, `closed`, `cancelled`, `rescheduled`, `no_show`. Un índice parcial único en `(meetingDate, startTime)` previene double-booking a nivel BD para los estados activos.

---

## Integración Discord (bot REST API)

Toda notificación operativa se entrega como mensaje del bot (`POST /channels/{channel_id}/messages` con `Authorization: Bot $DISCORD_BOT_TOKEN`). **Las URLs `DISCORD_WEBHOOK_*` legacy fueron retiradas**: sólo se usan IDs de canal `DISCORD_CHANNEL_*`. Las acciones del bot pueden además editar el embed original con `PATCH`.

| Canal (variable) | Eventos |
|------------------|---------|
| `DISCORD_CHANNEL_REGISTROS` | Nuevos leads, alta de newsletter (también fallback de errores) |
| `DISCORD_CHANNEL_AGENDA` | Reserva creada, reagendada, cancelada, no-show + controles interactivos |
| `DISCORD_CHANNEL_CONSENTIMIENTOS` | Consentimientos GDPR (con ID `con_*` que cruza con `consent_log`) |
| `DISCORD_CHANNEL_CALCULADORA` | Leads desde la calculadora |
| `DISCORD_CHANNEL_ACTIVIDAD` | Visitas web (con UTM y referrer) |
| `DISCORD_CHANNEL_ERRORES` | Errores críticos (fallback a registros si falta) |
| `DISCORD_CHANNEL_AUDITORIA` | Espejo de toda acción admin del bot |

Características: dedupe por contenido, cola en memoria con drenaje, reintentos exponenciales (máx. 3) ante 429/5xx, timeout 8 s, hora local Europe/Madrid en cada notificación. Si una variable de canal no está definida, ese tipo de evento se omite silenciosamente.

---

## Internacionalización

- **Idiomas:** `es` (referencia) · `en` · `fr` · `de` · `pt` · `ca`
- **Framework:** i18next + react-i18next con carga diferida por idioma
- **Tipos:** `client/src/i18n/keys.generated.ts` (auto-generados por `npm run i18n:generate-types`)
- **Blog:** posts canónicos en español + traducciones por idioma con slug traducido (`BLOG_SLUG_I18N` + `getTranslatedSlug`)
- **Emails:** plantillas en los 6 idiomas en `server/email-i18n.ts` (booking, recordatorio, calculadora, reagendar, cancelación, no-show)
- **SEO:** meta tags, canonical, hreflang (bidireccional + reciproco + `x-default = /es/...`) y JSON-LD inyectados server-side por idioma y ruta

---

## SEO

- Meta `<title>`, `<meta description>`, Open Graph y Twitter Card por página (`server/seo-content.ts`).
- `<link rel="canonical">` y `<link rel="alternate" hreflang="...">` para los 6 idiomas + `x-default`.
- JSON-LD: `ProfessionalService` / `Organization` / `WebSite` en home, `FAQPage` en FAQ, `BreadcrumbList` + `BlogPosting` en posts del blog, `Service` en subpáginas LLC/ITIN.
- Pre-render server-side de contenido textual para artículos del blog y páginas con contenido SEO definido.
- Sitemaps multiidioma generados dinámicamente y cacheados 1 h. `<lastmod>` calculado a partir del mtime real del archivo de la página.
- `X-Robots-Tag` por ruta: `index, follow` para conocidas; `noindex, nofollow` para `/booking/*`, `/start`, `/links`, `/admin/*` y rutas no reconocidas.
- `robots.txt` desautoriza `/api/`, `/admin/`, `/links`, `/start`, `/booking/` + parámetros UTM/ref/gclid/fbclid/mc_*.
- Tras cada deploy: `pingSitemapIfChanged` (5 s) → `pingIndexNowForNewArticles` (7 s) → `pingGoogleIndexingForNewArticles` (9 s, opt-in).

---

## Base de datos

PostgreSQL con Drizzle ORM. Schema en `exentax-web/shared/schema.ts` (10 tablas).

| Tabla | Propósito |
|-------|-----------|
| `leads` | Leads capturados (calculadora, formulario rápido, reserva). `phone` cifrado |
| `agenda` | Reservas — índice parcial único anti-double-book + check de estados |
| `calculations` | Submisiones de la calculadora fiscal con replay completo. `phone` cifrado |
| `visits` | Visitas web (UTM, referrer, dispositivo) consent-gated |
| `newsletter_subscribers` | Suscriptores con token de baja firmado |
| `blocked_days` | Días bloqueados para booking (gestionados desde el bot) |
| `legal_document_versions` | Versionado de docs legales (`tos`/`privacy`/`cookies`/`refund`/`disclaimer`) |
| `consent_log` | Registro de consentimientos (versión, idioma, fuente, IP, ID `con_*`) |
| `seo_rankings` | Snapshots de posicionamiento desde Search Console |
| `email_retry_queue` | Cola persistente de emails (worker drena cada 60 s, claim/release con backoff exp.) |
| `agenda_admin_actions` | Audit trail de cada acción del bot Discord sobre la agenda |

Migraciones SQL en `migrations/` (drizzle-kit). En arranque, `runColumnMigrations` aplica añadidos de columna idempotentes.

---

## Seguridad

- **Helmet** con CSP estricta, HSTS (prod, 2 años + preload), `Permissions-Policy`, `Referrer-Policy`, `X-Frame-Options=SAMEORIGIN`, `X-Content-Type-Options`.
- **CSRF**: validación de `Origin`/`Referer` en todas las mutaciones bajo `/api/*`.
- **Discord interactions**: cuerpo crudo + verificación Ed25519 con `DISCORD_PUBLIC_KEY` antes de procesar.
- **Rate limiting**: global por IP (200 req/min) + específico por endpoint (booking, calculadora, newsletter, datos públicos, visitas, consentimientos). Backend: Redis si `REDIS_URL` está definido; si no, store en memoria acotado.
- **Sanitización automática** de inputs (`autoSanitizeMiddleware` + DOMPurify server-side).
- **Cifrado de campos PII** (`phone`) con AES-256-GCM (`FIELD_ENCRYPTION_KEY`); fail-fast en prod si falta.
- **Stripping de `body.id`** en POST/PATCH/PUT.
- **Body size limit** 100 kB y `entity.too.large` → 413 normalizado.
- **Trust proxy** habilitado para extraer IP real desde `X-Forwarded-For`.
- **Logging estructurado** con `LOG_LEVEL` y `LOG_FORMAT` (`json` por defecto en prod).
- **Trazabilidad** mediante `X-Correlation-Id` (acepta `X-Request-Id`) propagado por `AsyncLocalStorage`.

---

## Observabilidad y resiliencia

Detalle completo en [`exentax-web/docs/observability-audit.md`](exentax-web/docs/observability-audit.md).

- **Logs**: JSON estructurado en producción con `correlationId`, `source`, `level`, `ts`, `method`, `path`, `status`, `durationMs`, `body` (redactado/excluido en endpoints sensibles). Helper `logger.alert()` para señales críticas siempre emitidas aunque falten todos los canales.
- **Health checks**: `/api/health` (liveness, no toca DB) + `/api/health/ready` (DB + breakers + worker email). Ambos disponibles durante el arranque para distinguir "vivo pero no listo" de "muerto".
- **Métricas Prometheus**: HTTP totals/latencia (histograma), event-loop lag p99, memoria, cola Discord, cola email-retry, fallback alerts, errores cliente, estado de circuit breakers.
- **Captura de errores**: backend (`unhandledRejection`/`uncaughtException` con filtrado de errores recoverable de red) y frontend (`window.onerror` + `unhandledrejection` → `POST /api/client-errors`).
- **Reintentos & timeouts**: Discord 8 s + 3 retries (exp backoff), IndexNow 8 s + 3 retries, Gmail vía `email_retry_queue` durable (1 m..12 h, 6 intentos, claim/release contra workers múltiples), pool PG con `connection/statement/query_timeout`.
- **Circuit breakers**: `googleCalendarBreaker` (3/60 s) y `emailBreaker` (5/60 s); estado expuesto en `/api/metrics` y consultado por readiness.
- **Backups**: snapshots PITR del proveedor managed Postgres + `tsx scripts/verify-backup.ts` para verificar conectividad, tablas críticas, índice único de slots y actividad reciente. Con `--dump=<path>` restaura el dump (`pg_restore` o `psql`) en una base temporal y la elimina al terminar.

---

## Variables de entorno

### Requeridas (todos los entornos)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL (en prod se fuerza `sslmode=require`) |

### Requeridas en producción (fail-fast en `server/index.ts`)

En dev, si faltan, sólo se loguea un warning; en prod, el proceso aborta.

| Variable | Descripción |
|----------|-------------|
| `FIELD_ENCRYPTION_KEY` | 64 hex chars (32 bytes) para AES-256-GCM de PII en reposo |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON service-account (Calendar/Meet + Gmail send) |
| `DISCORD_BOT_TOKEN` | Token del bot — entrega TODA notificación + sirve interactions |
| `DISCORD_PUBLIC_KEY` | Ed25519 pública para verificar `/api/discord/interactions` |
| `DISCORD_APP_ID` | Application ID — registro de slash commands al arranque |
| `DISCORD_GUILD_ID` | Guild cuyas roles se consultan para el role gate |
| `ADMIN_DISCORD_ROLE_ID` | Rol que gateaa cada `/agenda` y `/cita` (única superficie admin) |
| `DISCORD_CHANNEL_REGISTROS` | Channel ID `#exentax-registros` (registros + fallback errores) |
| `DISCORD_CHANNEL_AGENDA` | Channel ID `#exentax-agenda` (lifecycle de reservas + controles) |
| `DISCORD_CHANNEL_CONSENTIMIENTOS` | Channel ID `#exentax-consentimientos` (espejo GDPR con `con_*`) |

### Opcionales (defaults sensatos)

`PORT` · `NODE_ENV` · `LOG_LEVEL` · `LOG_FORMAT` · `SITE_URL` · `DOMAIN` · `BASE_URL` · `EXTRA_ALLOWED_ORIGINS` · `METRICS_TOKEN` · `DB_POOL_MAX` · `REDIS_URL` · `GOOGLE_CALENDAR_ID` · `GOOGLE_SC_SITE_URL` · `GOOGLE_SC_DISABLE` · `GOOGLE_INDEXING_API_ENABLE` · `GOOGLE_INDEXING_MAX_PER_RUN` · `GOOGLE_INDEXING_DAILY_QUOTA` · `INDEXNOW_KEY` · `INDEXNOW_KEY_LOCATION` · `INDEXING_AUDIT_DISABLE` · `INDEXING_REPORTS_DIR` · `DISCORD_CHANNEL_CALCULADORA` · `DISCORD_CHANNEL_ACTIVIDAD` · `DISCORD_CHANNEL_ERRORES` · `DISCORD_CHANNEL_AUDITORIA` · `CONTACT_EMAIL` · `LEGAL_EMAIL` · `ADMIN_EMAIL` · `WHATSAPP_NUMBER` · `COMPANY_ADDRESS_SHORT` · `INSTAGRAM_URL` · `TIKTOK_URL` · `LINKEDIN_URL` · `FACEBOOK_URL` · `YOUTUBE_URL` · `SKIP_BUILD_E2E` (omite los guards e2e en hostings sin DB durante el build).

> Las variables `DISCORD_WEBHOOK_*` y `ADMIN_TOKEN` que pudieran existir en entornos antiguos están **retiradas** y no las consume el código.

---

## Scripts

Hay dos `package.json`:

### `/package.json` (raíz — el que usa el deploy)

```bash
npm run dev          # NODE_ENV=development tsx exentax-web/server/index.ts
npm run build        # tsx exentax-web/scripts/build.ts
npm run start        # NODE_ENV=production node exentax-web/dist/index.mjs
npm run db:push      # drizzle-kit push
npm run db:generate  # drizzle-kit generate
npm run db:migrate   # drizzle-kit migrate
```

### `/exentax-web/package.json` (utilidades del subproyecto)

```bash
npm run check                # tsc + lint:typography + lint:stray-reports + lint:blog
                             # + seo:check + seo:slash + seo:meta + seo:masterpiece-strict
                             # + blog:validate-all + i18n:check + test:* (calculator,
                             # discord-neon, newsletter, booking, indexnow)
npm run i18n:check           # generate-types + validate
npm run lint:blog            # guard de precios/direcciones en el blog
npm run blog:validate-all    # 10 puertas obligatorias del blog
npm run seo:check            # enlaces internos + cross-refs
npm run seo:slash            # slash hygiene contra dev server
npm run seo:meta             # verificación SSR de metadatos por idioma
npm run test:calculator      # test unitario de la calculadora
npm run test:newsletter      # E2E newsletter (alta + RGPD + baja en 6 idiomas)
npm run test:booking         # E2E booking (book → manage → reschedule → cancel)
npm run test:discord-neon    # smoke test de la integración Discord+DB
npm run discord:register     # registra slash commands (admite --dry-run / --diff)
```

### Build (qué corre `tsx exentax-web/scripts/build.ts`)

Antes de compilar cliente y servidor, el build ejecuta una batería de guards:

1. `blog-content-lint.mjs` (precios/direcciones prohibidas) + sus tests.
2. Auditorías editoriales 2026-04: `seo-meta-audit`, `seo-related-validate`, `cta-conversion-audit`, `inline-review-markers`, `cta-changelog`, `ctas-rewrite-md`, `related-articles-non-404`.
3. `server/routes/public.test.ts` (test de integración 301 + related-slugs).
4. **E2E reales contra `DATABASE_URL`** (si no se pasa `SKIP_BUILD_E2E=1`): newsletter (`PORT=5051`), booking (`PORT=5052`). Sin DB durante el build, usar `SKIP_BUILD_E2E=1`.
5. Vite (cliente) → `exentax-web/dist/public/`.
6. esbuild (servidor) → `exentax-web/dist/index.mjs` + dos shims `index.cjs` (en `exentax-web/dist/` y en la raíz `dist/`, este último es el entrypoint del deploy de Replit).

---

## Despliegue

### Replit (autoscale)

Configurado en `.replit`:

- Workflow `Start application` ejecuta `npm run dev` esperando puerto `5000`.
- `[deployment]`: build `npm run build`, run `node ./dist/index.cjs`, target `autoscale`.
- Variables compartidas no sensibles en `.replit` `[userenv.shared]`; secretos vía panel de Secrets.

Pasos: rellenar Secrets requeridos en producción (ver tabla anterior), ejecutar `npm run db:push` la primera vez y publicar desde Replit.

### Hostinger / VPS / cualquier Node 20+

```bash
# 1. Instalar Node 20.x (Hostinger Node Apps: elegir 20 LTS)
# 2. Crear .env con al menos:
#    DATABASE_URL, FIELD_ENCRYPTION_KEY (32 bytes hex),
#    GOOGLE_SERVICE_ACCOUNT_KEY, DISCORD_BOT_TOKEN, DISCORD_PUBLIC_KEY,
#    DISCORD_APP_ID, DISCORD_GUILD_ID, ADMIN_DISCORD_ROLE_ID,
#    DISCORD_CHANNEL_REGISTROS, DISCORD_CHANNEL_AGENDA, DISCORD_CHANNEL_CONSENTIMIENTOS,
#    NODE_ENV=production, PORT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # generar FIELD_ENCRYPTION_KEY
npm ci
SKIP_BUILD_E2E=1 npm run build   # quitar la flag si la build tiene DB accesible
npm run db:push                  # primera vez o tras cambios de schema
npm start                        # → NODE_ENV=production node exentax-web/dist/index.mjs
```

En Hostinger Node Apps:

- **Application root:** raíz del repo
- **Application startup file:** `exentax-web/dist/index.mjs` (o usar `npm start`)

El servidor escucha en `0.0.0.0:$PORT`, sirve el frontend estático de `exentax-web/dist/public/` y todas las APIs `/api/*`. Detrás de Nginx/Caddy con TLS terminado, `trust proxy: 1` ya extrae la IP correcta. HSTS y `upgrade-insecure-requests` se activan automáticamente en prod.

> `replit.md` y `.replit` solo se usan en Replit; en Hostinger se ignoran.

**Guía detallada end-to-end para Hostinger VPS** (KVM 2, Ubuntu 22.04, Node 22, PostgreSQL 16, Nginx + Certbot, PM2, backups, UptimeRobot, troubleshooting y costes): ver `exentax-web/docs/deploy/HOSTINGER-VPS.md`.

**Setup profesional de Discord** (7 canales, rol admin, mapping `EVENT_TYPES → TYPE_TO_CHANNEL`, slash commands `/agenda` `/cita`, rate limits y back-pressure): ver `exentax-web/docs/deploy/DISCORD-SETUP.md`.

---

## Arquitectura

```
                       Cliente (navegador)
                              │
                              ▼
                     ┌──────────────────┐
                     │   Express 5      │  un único proceso Node
                     │                  │
   Middleware ──▶    │  Helmet · CSP    │
                     │  Compression     │
                     │  Rate limit IP   │
                     │  CSRF (Origin)   │
                     │  Sanitización    │
                     │  Correlation ID  │
                     │                  │
   Estáticos ──▶     │  Vite build SPA  │  + inyección SSR de
                     │  (assets, JS)    │     meta · canonical · hreflang · JSON-LD
                     │                  │
   API ──────▶       │  /api/*          │ ─── storage (Drizzle) ──▶ PostgreSQL
                     │                  │
                     │                  │ ─── Gmail API + email_retry_queue (durable)
                     │                  │ ─── Google Calendar / Meet (CB)
                     │                  │ ─── Discord Bot REST API + dedupe + reintentos
                     │                  │ ─── Discord Interactions (Ed25519) ◀── slash cmds
                     │                  │ ─── Google Search Console / Indexing API / IndexNow
                     │                  │ ─── Redis (rate limit + locks, opcional)
                     └──────────────────┘
```

El SEO crítico se resuelve server-side en cada request HTML (sin dependencia de JavaScript). El frontend hidrata sobre el HTML servido y toma el control de la navegación.

---

## Índice de docs

| Documento | Propósito |
|-----------|-----------|
| `replit.md` | Memoria del proyecto: preferencias, arquitectura, audit closures |
| `exentax-web/README.md` | README operativo del subproyecto |
| `exentax-web/docs/architecture-map.md` | Mapa autoritativo de carpetas, rutas, tablas, integraciones |
| `exentax-web/docs/data-flow.md` | Flujos principales (lead, booking, newsletter, consent) |
| `exentax-web/docs/security-audit.md` | Auditoría de seguridad |
| `exentax-web/docs/observability-audit.md` | Auditoría de observabilidad y resiliencia |
| `exentax-web/docs/consolidation-2026-04.md` | Hardening end-to-end (Task #5) |
| `exentax-web/docs/seo/audit-2026.md` | Auditoría SEO global |
| `exentax-web/docs/seo/url-slash-policy.md` | Política de slash y redirecciones |
| `exentax-web/docs/seo/internal-linking.md` | Estrategia de enlazado interno |
| `exentax-web/docs/seo/blog-overhaul-2026.md` | Overhaul editorial del blog (Task #27) |
| `exentax-web/docs/blog/audit-2026.md` | Auditoría editorial blog |
| `exentax-web/docs/i18n-check.md` | Validación i18n y CI |
| `exentax-web/docs/audit-design-system.md` | Sistema de diseño y Regla 0 |
