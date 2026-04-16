# Exentax Web

Web pública de Exentax: landing, blog, sistema de reservas de asesoría, páginas legales e integración operativa con Discord. Aplicación full-stack en un único proceso Node que sirve frontend (SPA React) y backend (API Express) con SEO multiidioma server-side.

---

## Stack

- **Frontend:** React 19 · Vite 7 · Wouter (routing) · TanStack Query · Tailwind CSS · i18next + react-i18next
- **Backend:** Node.js + Express 5 · Drizzle ORM · PostgreSQL (`pg`) · Helmet · Compression
- **Integraciones:** Google APIs (Gmail send + Calendar/Meet) · Discord webhooks · Redis (opcional, rate limiting)
- **Lenguaje:** TypeScript en cliente y servidor
- **Validación:** Zod + drizzle-zod

---

## Estructura del proyecto

```
exentax-web/
├── client/src/
│   ├── pages/              # Páginas públicas (lazy-loaded)
│   │   ├── home.tsx · services.tsx · how-we-work.tsx
│   │   ├── faq-page.tsx · about-llc.tsx
│   │   ├── book.tsx · booking.tsx · start.tsx · go.tsx
│   │   ├── blog/           # Listado y artículo
│   │   └── legal/          # Términos, privacidad, cookies, reembolsos, disclaimer
│   ├── components/         # UI y layout
│   ├── i18n/               # i18next + locales (es, en, fr, de, pt, ca)
│   ├── data/               # Posts del blog y traducciones
│   ├── lib/                # Utilidades cliente (queryClient, routes)
│   └── hooks/
├── server/
│   ├── index.ts            # Bootstrap Express (helmet, CSP, compression, rate-limit global)
│   ├── routes.ts           # Registro de rutas + middleware (CSRF, canonical, X-Robots-Tag)
│   ├── routes/public.ts    # API pública
│   ├── static.ts           # Servidor estático + inyección SSR de meta/JSON-LD/hreflang
│   ├── storage/            # Capa de acceso a datos (Drizzle)
│   ├── db.ts               # Pool PostgreSQL + migraciones de columnas
│   ├── discord.ts          # Webhooks Discord (eventos operativos)
│   ├── email.ts            # Envío vía Gmail API (service account)
│   ├── email-i18n.ts       # Plantillas de email en 6 idiomas
│   ├── google-meet.ts      # Creación/borrado de eventos con Meet
│   ├── field-encryption.ts # Cifrado AES-256-GCM
│   ├── rate-limit-store.ts # Rate limiting (memoria o Redis)
│   ├── route-slugs.ts      # Slugs localizados por ruta
│   ├── seo-content.ts      # Meta y schema.org por página
│   └── server-constants.ts
├── shared/
│   └── schema.ts           # Schema Drizzle (fuente única de verdad)
└── scripts/                # build.ts, validate-i18n.ts, generate-i18n-types.ts

(en la raíz del repo)
├── package.json            # Scripts de ejecución (dev, build, start, db:*)
├── drizzle.config.ts       # Configuración de Drizzle Kit
└── migrations/             # Migraciones SQL versionadas
```

---

## Páginas y rutas

Las páginas localizadas se sirven siempre bajo prefijo de idioma `/:lang/...` con `lang ∈ {es, en, fr, de, pt, ca}`. La raíz `/` redirige al idioma detectado/preferido del usuario. Los slugs están traducidos por idioma en `server/route-slugs.ts` (la misma tabla se replica en `client/src/lib/routes.ts`).

| Clave de ruta | es | en | fr | de | pt | ca |
|---------------|----|----|----|----|----|----|
| `home` | `/es` | `/en` | `/fr` | `/de` | `/pt` | `/ca` |
| `how_we_work` | `/es/como-trabajamos` | `/en/how-we-work` | `/fr/comment-nous-travaillons` | `/de/wie-wir-arbeiten` | `/pt/como-trabalhamos` | `/ca/com-treballem` |
| `our_services` | `/es/nuestros-servicios` | `/en/our-services` | `/fr/nos-services` | `/de/unsere-leistungen` | `/pt/nossos-servicos` | `/ca/els-nostres-serveis` |
| `about_llc` | `/es/sobre-las-llc` | `/en/about-llc` | `/fr/a-propos-des-llc` | `/de/uber-llc` | `/pt/sobre-llc` | `/ca/sobre-les-llc` |
| `faq` | `/es/preguntas-frecuentes` | `/en/faq` | `/fr/questions-frequentes` | `/de/haufige-fragen` | `/pt/perguntas-frequentes` | `/ca/preguntes-frequents` |
| `book` | `/es/agendar` | `/en/book` | `/fr/reserver` | `/de/buchen` | `/pt/agendar` | `/ca/agendar` |
| `legal_terms` | `/es/legal/terminos` | `/en/legal/terms` | `/fr/legal/conditions` | `/de/legal/agb` | `/pt/legal/termos` | `/ca/legal/termes` |
| `legal_privacy` | `/es/legal/privacidad` | `/en/legal/privacy` | `/fr/legal/confidentialite` | `/de/legal/datenschutz` | `/pt/legal/privacidade` | `/ca/legal/privacitat` |
| `legal_cookies` | `/es/legal/cookies` | `/en/legal/cookies` | `/fr/legal/cookies` | `/de/legal/cookies` | `/pt/legal/cookies` | `/ca/legal/cookies` |
| `legal_refunds` | `/es/legal/reembolsos` | `/en/legal/refunds` | `/fr/legal/remboursements` | `/de/legal/erstattungen` | `/pt/legal/reembolsos` | `/ca/legal/reemborsaments` |
| `legal_disclaimer` | `/es/legal/disclaimer` | `/en/legal/disclaimer` | `/fr/legal/avertissement` | `/de/legal/haftungsausschluss` | `/pt/legal/aviso-legal` | `/ca/legal/avis-legal` |

Rutas adicionales (no localizadas):

| Ruta | Descripción |
|------|-------------|
| `/blog` y `/:lang/blog` | Listado de artículos |
| `/blog/:slug` y `/:lang/blog/:slug` | Artículo (slug traducido por idioma) |
| `/booking/:token` (con `?token=...`) | Gestión de una reserva existente (reagendar/cancelar). El segmento `:token` es el **nombre histórico** del parámetro de ruta y contiene el **ID de la reserva**; el token real de gestión viaja en el query string `?token=...`. `noindex` |
| `/start` | Captura rápida de lead — `noindex` |
| `/links` | Redirector de enlaces — `noindex` |

---

## API pública

Base: `/api`. Todas las mutaciones requieren `Origin`/`Referer` válido (CSRF). Rate limiting global por IP + límites específicos por endpoint.

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/bookings/blocked-days` | Lista de fechas bloqueadas |
| GET | `/api/bookings/available-slots?date=YYYY-MM-DD` | Horas disponibles |
| POST | `/api/bookings/book` | Crear reserva (genera evento Meet, envía email, programa recordatorio) |
| GET | `/api/booking/:bookingId?token=...` | Datos de la reserva para gestión |
| POST | `/api/booking/:bookingId/reschedule?token=...` | Reagendar |
| POST | `/api/booking/:bookingId/cancel?token=...` | Cancelar |

### Otros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/calculator-leads` | Guarda lead procedente de la calculadora y envía email |
| POST | `/api/consent` | Registro independiente de consentimiento |
| POST | `/api/newsletter/subscribe` | Alta en newsletter |
| GET | `/api/newsletter/unsubscribe/:token` | Baja por token |
| POST | `/api/visitor` | Registro de visita (analítica + UTM) |
| GET | `/api/legal/versions` | Versiones activas de documentos legales |
| GET | `/api/health` | Health check (incluye comprobación de DB) |
| GET | `/sitemap.xml` | Sitemap multiidioma (cacheado 1h) |
| GET | `/robots.txt` | Robots dinámico |

Respuestas normalizadas (helpers `apiOk`/`apiFail` en `server/routes/api-response.ts`):

- Éxito: `{ ok: true, ...data }` (los campos de `data` se aplanan en la raíz).
- Error: `{ ok: false, error: <mensaje>, code: <CÓDIGO>, ...extra }` (errores de validación incluyen `details`).

---

## Sistema de reservas

Flujo end-to-end:

1. **Disponibilidad** — el cliente consulta `available-slots` para una fecha (días laborables, no bloqueados, sin solapes con reservas existentes y sin franjas pasadas en horario Europe/Madrid).
2. **Reserva** — `POST /api/bookings/book` adquiere un lock por slot, comprueba que el slot no esté ya tomado, rechaza emails con reserva activa existente, crea el evento en Google Calendar con enlace Meet, persiste filas en `agenda` y `leads` dentro de una transacción, y responde con `{ date, startTime, endTime, meetLink, status }`.
3. **Confirmación** — se genera internamente un `manageToken` (guardado en `agenda` y enviado por email) que da acceso a la URL de gestión. Se envía email de confirmación traducido al idioma del cliente (Gmail API) y se programa un recordatorio 3 horas antes del inicio.
4. **Gestión cliente** — el cliente accede a `/booking/:token?token=...` (el segmento de ruta es el ID de la reserva, el `?token` autentica la operación) para reagendar o cancelar:
   - Reagendar: borra el evento Meet anterior, crea uno nuevo, actualiza `agenda`, reenvía confirmación y reprograma recordatorio.
   - Cancelar: marca como `cancelled`, borra el evento Meet y envía email de cancelación.
5. **Recuperación** — al arrancar el servidor se reprograman los recordatorios pendientes de reservas aún no celebradas (sobrevive a reinicios).

Concurrencia protegida por locks en proceso (`withSlotLock`, `withBookingLock`) y validaciones de estado en cada operación.

---

## Integración Discord

`server/discord.ts` envía eventos operativos mediante webhooks. Cada evento se enruta a un canal según su tipo:

| Canal (variable) | Eventos |
|------------------|---------|
| `DISCORD_WEBHOOK_AGENDA` | Reserva creada, reagendada, cancelada, no-show |
| `DISCORD_WEBHOOK_REGISTROS` | Nuevo lead, alta de newsletter |
| `DISCORD_WEBHOOK_CALCULADORA` | Lead desde calculadora |
| `DISCORD_WEBHOOK_ACTIVIDAD` | Visitas web (con UTM y referrer) |
| `DISCORD_WEBHOOK_CONSENTIMIENTOS` | Consentimientos de privacidad/cookies |
| `DISCORD_WEBHOOK_ERRORES` | Errores críticos y validaciones (fallback al de registros) |

Características:

- Embed normalizado con tipo, criticidad, origen, ruta, idioma, IP y datos del evento.
- Cola en memoria con drenaje cada 1.5 s, reintentos exponenciales (máx. 3) ante 429/5xx, timeout de 8 s.
- Si una variable de webhook no está definida, ese tipo de evento se omite silenciosamente.
- Hora local Europe/Madrid en cada notificación.

---

## Internacionalización

- **Idiomas:** `es` · `en` · `fr` · `de` · `pt` · `ca`
- **Framework:** i18next + react-i18next con carga diferida por idioma
- **Carga:** español embebido en el bundle inicial; el resto se importa dinámicamente al cambiar idioma
- **Tipos:** `client/src/i18n/keys.generated.ts` (tipos TypeScript de claves)
- **Blog:** posts canónicos en español + traducciones por idioma con slug traducido (`getTranslatedSlug`)
- **Emails:** plantillas en los 6 idiomas en `server/email-i18n.ts` (booking, recordatorio, calculadora, reagendar, cancelación, no-show)
- **SEO:** meta tags, canonical, hreflang y JSON-LD inyectados server-side por idioma y ruta

---

## SEO

- Meta `<title>`, `<meta description>`, Open Graph y Twitter Card por página (`server/seo-content.ts`).
- `<link rel="canonical">` y `<link rel="alternate" hreflang="...">` para los 6 idiomas + `x-default`.
- JSON-LD: `ProfessionalService` en home, `FAQPage` en FAQ, `BreadcrumbList` + `Article` en posts del blog.
- Pre-render server-side de contenido textual (oculto visualmente) para artículos del blog y páginas con contenido SEO definido.
- Sitemap multiidioma generado dinámicamente y cacheado 1 hora.
- Cabecera `X-Robots-Tag` por ruta: `index, follow` para páginas conocidas; `noindex, nofollow` para `/booking/*`, `/start`, `/links` y rutas no reconocidas.
- Redirección 301 de `blog.exentax.com` → `exentax.com/blog`.

---

## Base de datos

PostgreSQL con Drizzle ORM. Schema en `shared/schema.ts`.

| Tabla | Propósito |
|-------|-----------|
| `leads` | Leads capturados (calculadora, formulario rápido, reserva) |
| `agenda` | Reservas de asesoría (estado, slot, Meet, token de gestión) |
| `calculations` | Resultados de la calculadora fiscal |
| `visits` | Visitas web con UTM y device |
| `newsletter_subscribers` | Suscriptores y token de baja |
| `blocked_days` | Fechas bloqueadas para reservas |
| `legal_document_versions` | Versionado de documentos legales |
| `consent_log` | Registro de consentimientos (versión, idioma, fuente, IP) |

Migraciones SQL en `migrations/` (gestionadas con drizzle-kit).

---

## Seguridad

- **Helmet** con CSP estricta, HSTS en producción, `Permissions-Policy` y demás cabeceras endurecidas.
- **CSRF**: validación de `Origin`/`Referer` en todas las mutaciones bajo `/api/*`.
- **Rate limiting**:
  - Global por IP (200 req/min) en `/api/*`.
  - Específico por endpoint (booking, calculadora, newsletter, datos públicos, visitas, consentimientos).
  - Backend: Redis si `REDIS_URL` está definido; si no, store en memoria con limpieza periódica.
- **Sanitización automática** de inputs (`autoSanitizeMiddleware` + DOMPurify).
- **Cifrado de campos** sensibles con AES-256-GCM (`field-encryption.ts`, clave en `FIELD_ENCRYPTION_KEY`).
- **Stripping de `id`** en bodies de POST/PATCH/PUT para evitar overrides.
- **Body size limit**: 100 kB.
- **Trust proxy** habilitado para extraer IP real desde `X-Forwarded-For`.
- **Logging estructurado** (`logger.ts`) con niveles configurables vía `LOG_LEVEL`.

---

## Variables de entorno

### Requeridas

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |

### Producción / operación

| Variable | Descripción |
|----------|-------------|
| `SITE_URL` | URL pública canónica (p. ej. `https://exentax.com`) |
| `DOMAIN` | Dominio público base (usado para construir URLs canónicas, enlaces y branding) |
| `EXTRA_ALLOWED_ORIGINS` | Lista CSV de orígenes adicionales permitidos para CSRF |
| `NODE_ENV` | `production` o `development` |
| `PORT` | Puerto HTTP (por defecto `5000`) |
| `LOG_LEVEL` | Nivel de logging |
| `DB_POOL_MAX` | Tamaño máximo del pool de PostgreSQL |
| `FIELD_ENCRYPTION_KEY` | Clave para AES-256-GCM (campo cifrado) |
| `REDIS_URL` | Backend de rate limiting (opcional; fallback en memoria) |
| `EXTRA_ALLOWED_ORIGINS` | Orígenes adicionales permitidos para CSRF |

### Google (Gmail send + Calendar/Meet)

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON de la cuenta de servicio |
| `GOOGLE_CALENDAR_ID` | Calendario donde crear los eventos |

### Discord (webhooks; cada uno opcional)

`DISCORD_WEBHOOK_AGENDA` · `DISCORD_WEBHOOK_REGISTROS` · `DISCORD_WEBHOOK_CALCULADORA` · `DISCORD_WEBHOOK_ACTIVIDAD` · `DISCORD_WEBHOOK_CONSENTIMIENTOS` · `DISCORD_WEBHOOK_ERRORES`

### Contacto y enlaces sociales (renderizados en UI/SEO)

`CONTACT_EMAIL` · `LEGAL_EMAIL` · `WHATSAPP_NUMBER` · `COMPANY_ADDRESS_SHORT` · `INSTAGRAM_URL` · `TIKTOK_URL` · `LINKEDIN_URL` · `FACEBOOK_URL` · `YOUTUBE_URL`

---

## Scripts

Hay dos `package.json`:

- **`/package.json` (raíz)** — scripts que se ejecutan en la raíz del repo (los que se usan en deploy):

  ```bash
  npm run dev          # NODE_ENV=development node_modules/.bin/tsx exentax-web/server/index.ts
  npm run build        # npx tsx exentax-web/scripts/build.ts
  npm run start        # NODE_ENV=production node exentax-web/dist/index.mjs
  npm run db:push      # drizzle-kit push
  npm run db:generate  # drizzle-kit generate
  npm run db:migrate   # drizzle-kit migrate
  ```

- **`/exentax-web/package.json`** — scripts del subproyecto (utilidades adicionales):

  ```bash
  npm run check                # tsc (type-check)
  npm run i18n:generate-types  # tsx scripts/generate-i18n-types.ts
  npm run i18n:validate        # tsx scripts/validate-i18n.ts
  npm run i18n:check           # generate-types + validate
  npm run lint:blog            # guard de precios/direcciones en el blog
  npm run test:newsletter      # E2E newsletter (alta + RGPD + baja en 6 idiomas)
  ```

  > `npm run test:newsletter` arranca el servidor en `PORT=5051`, espera a `/api/health` y ejecuta `scripts/test-newsletter-e2e.ts` contra esa instancia. Crea y limpia sus propios suscriptores (`*@e2e.exentax.test`) y devuelve exit code distinto de 0 si cualquier verificación falla. Está enganchado en dos puntos para que ningún despliegue lo pueda saltar: `scripts/post-merge.sh` (bloquea el merge) y `exentax-web/scripts/build.ts` (bloquea el build/deploy).

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
                     │                  │
   Estáticos ──▶     │  Vite build SPA  │  + inyección SSR de
                     │  (assets, JS)    │     meta · canonical · hreflang · JSON-LD
                     │                  │
   API ──────▶       │  /api/*          │ ─── storage (Drizzle) ──▶ PostgreSQL
                     │                  │
                     │                  │ ─── Gmail API (envío de emails)
                     │                  │ ─── Google Calendar / Meet
                     │                  │ ─── Discord webhooks (cola con reintentos)
                     │                  │ ─── Redis (rate limit, opcional)
                     └──────────────────┘
```

El SEO crítico se resuelve server-side en cada request HTML (sin dependencia de JavaScript). El frontend hidrata sobre el HTML servido y toma el control de la navegación.
