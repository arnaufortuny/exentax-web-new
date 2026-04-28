# Mapa de arquitectura · exentax-web

Última actualización: 17 abr 2026 (Task #49). Documento vivo: actualizar al añadir/quitar páginas, endpoints, esquemas o integraciones.

---

## 1. Resumen

Monolito fullstack TS sobre Vite + Express servido en el mismo puerto (`server/vite.ts` en dev, `server/static.ts` en prod). Front en React 18 + wouter, i18n con i18next (6 idiomas: es/en/fr/de/pt/ca). Backend Express + Drizzle ORM sobre Postgres. Integraciones externas: Google Calendar/Meet (service account), Discord (bot REST API a 7 canales), IndexNow, Trustpilot (frontend). Booking propio con anti-double-book a nivel BD (índice parcial único). Encriptación de campos PII a nivel app (`field-encryption.ts`).

---

## 2. Árbol de carpetas (comentado)

```
exentax-web/
├── client/
│   ├── public/                    # assets estáticos servidos en raíz
│   │   ├── *.pdf                  # 5 PDFs legales (referenciados por lib/constants.ts)
│   │   ├── img/flags/*.png        # 8 banderas país, usadas por lib/calculator.ts
│   │   ├── img/partner-*.{webp,png}  # logos de partners para BanksCarousel
│   │   ├── og-image.png, favicons, site.webmanifest
│   └── src/
│       ├── App.tsx                # Router wouter, lazy imports, ScrollToTop, ThemeProvider
│       ├── main.tsx               # bootstrap React + i18n
│       ├── index.css              # tokens de diseño, glass system, blog-content typography
│       ├── components/
│       │   ├── layout/            # Layout, Navbar, NavbarFunnel, Footer, FloatingMobileCTA, FloatingWhatsApp, LegalLayout
│       │   ├── sections/          # Hero, HeroStats, Problem, ForWho, Origin, Services, HowItWorks, WhyUs, FAQ, HomeFAQ, BanksCarousel, AccordionItem, faq-data
│       │   ├── calculator/        # CalculatorResults, IrpfBracketsTable + companion bits
│       │   ├── BookingCalendar.tsx
│       │   ├── SEO.tsx            # title, meta, OG, hreflang, JSON-LD
│       │   ├── Tracking.tsx       # GA4 + consent gating
│       │   ├── CookieBanner.tsx   # CMP propio (ConsentMode v2)
│       │   ├── LanguageSwitcher.tsx, ThemeProvider.tsx, PhoneInput.tsx, blogFlagImg.tsx, icons.tsx, calculatorInlineMessage.tsx, DebugEventsOverlay.tsx
│       ├── pages/                 # ver §3
│       ├── hooks/                 # useCountUp, useInlineMessage, useLangPath, useReveal, useScrolled
│       ├── lib/                   # calculator, constants (URLs, PDFs, partners), clientLogger, lang-utils, queryClient, sanitize
│       ├── i18n/                  # index.ts, language-service.ts, keys.generated.ts, locales/{es,en,fr,de,pt,ca}.ts
│       └── data/
│           ├── blog-content/<lang>/*.ts   # contenido por slug, por idioma
│           ├── blog-posts.ts, blog-posts-content.ts, blog-posts-slugs.ts, blog-posts-i18n.ts
│           ├── blog-i18n/, blog-i18n-all.ts, blog-related.ts
│           └── _cluster-audit.md  # nota interna sobre clustering
├── server/
│   ├── index.ts                   # Express bootstrap, helmet, compression, CORS/CSRF, rate limit, registerRoutes
│   ├── routes.ts                  # canonical/X-Robots middleware + delegación a routes/public
│   ├── routes/
│   │   ├── public.ts              # booking público, calculator-leads, consent, newsletter, visitor, sitemap, robots
│   │   ├── shared.ts, api-response.ts (helpers)
│   ├── storage/
│   │   ├── core.ts                # generateId, normalizeEmail, wrapStorageError, SlotConflictError
│   │   ├── scheduling.ts          # agenda + blockedDays
│   │   ├── marketing.ts           # leads + calculations + newsletter + visits
│   │   ├── legal.ts               # legalDocumentVersions + consentLog
│   │   └── index.ts               # re-exports
│   ├── db.ts                      # pg Pool + Drizzle
│   ├── google-credentials.ts, google-meet.ts, google-utils.ts   # Calendar + Meet vía service account
│   ├── discord.ts                 # Bot REST API por canal, dedupe in-memory
│   ├── discord-bot.ts             # Endpoint /api/discord/interactions (Ed25519) + slash sync
│   ├── discord-bot-commands.ts    # Re-export thin: dispatchSlashCommand / dispatchComponent / dispatchModalSubmit
│   ├── discord/handlers/          # Una superficie por archivo — slash, components, modals, booking-actions, commands/{help,agenda,cita,newsletter}
│   ├── indexnow.ts                # ping a buscadores + ruta de verificación
│   ├── email.ts, email-i18n.ts, email-layout.ts                # Gmail API (service account)
│   ├── field-encryption.ts        # AES-GCM de campos PII (FIELD_ENCRYPTION_KEY)
│   ├── lock-store.ts, rate-limit-store.ts                      # Redis opcional (REDIS_URL) o in-memory
│   ├── circuit-breaker.ts, sanitize-middleware.ts, route-helpers.ts, logger.ts
│   ├── server-constants.ts        # tokens de config + tiempo Madrid
│   ├── seo-content.ts             # SSR HTML por ruta + JSON-LD + breadcrumbs
│   ├── static.ts                  # serve dist/ + 404 + noindex de paths desconocidos
│   └── vite.ts                    # middleware de Vite en dev
├── shared/
│   ├── routes.ts                  # ROUTE_SLUGS por idioma + resolveRoute + getEquivalentPath
│   ├── schema.ts                  # 9 tablas Drizzle + insert schemas + tipos
│   └── madrid-time.ts             # helpers de zona horaria
├── docs/                          # auditorías, mapas, changelogs
├── scripts/                       # validadores i18n, link-graph, seo-blog-audit, e2e booking/newsletter, regla 0
└── tests/                         # Vitest + Playwright E2E (configurado en playwright.config.ts)
```

---

## 3. Rutas frontend

Generadas dinámicamente en `App.tsx` desde `ROUTE_SLUGS`. Cada par (clave, idioma) produce `/{lang}/{slug}` o `/{lang}` (home). La raíz absoluta `/` no es una página: es `RootRedirect`, que detecta idioma del navegador / preferencia almacenada y reenvía a `/{lang}`. Listado canónico:

| Clave            | Página (`pages/`)        | ES                          | EN                | FR                            | DE                          | PT                       | CA                       |
|------------------|--------------------------|-----------------------------|-------------------|-------------------------------|-----------------------------|--------------------------|--------------------------|
| home             | `home.tsx`               | `/es`                       | `/en`             | `/fr`                         | `/de`                       | `/pt`                    | `/ca`                    |
| how_we_work      | `how-we-work.tsx`        | `como-trabajamos`           | `how-we-work`     | `comment-nous-travaillons`    | `wie-wir-arbeiten`          | `como-trabalhamos`       | `com-treballem`          |
| our_services     | `services.tsx` (+ lazy `services-sections.tsx`) | `nuestros-servicios` | `our-services` | `nos-services` | `unsere-leistungen` | `nossos-servicos` | `els-nostres-serveis` |
| about_llc        | `about-llc.tsx`          | `sobre-las-llc`             | `about-llc`       | `a-propos-des-llc`            | `uber-llc`                  | `sobre-llc`              | `sobre-les-llc`          |
| faq              | `faq-page.tsx`           | `preguntas-frecuentes`      | `faq`             | `questions-frequentes`        | `haufige-fragen`            | `perguntas-frequentes`   | `preguntes-frequents`    |
| book             | `book.tsx`               | `agendar`                   | `book`            | `reserver`                    | `buchen`                    | `agendar`                | `agendar`                |
| legal_terms      | `legal/terms.tsx`        | `legal/terminos`            | `legal/terms`     | `legal/conditions`            | `legal/agb`                 | `legal/termos`           | `legal/termes`           |
| legal_privacy    | `legal/privacy.tsx`      | `legal/privacidad`          | `legal/privacy`   | `legal/confidentialite`       | `legal/datenschutz`         | `legal/privacidade`      | `legal/privacitat`       |
| legal_cookies    | `legal/cookies.tsx`      | `legal/cookies`             | `legal/cookies`   | `legal/cookies`               | `legal/cookies`             | `legal/cookies`          | `legal/cookies`          |
| legal_refunds    | `legal/refunds.tsx`      | `legal/reembolsos`          | `legal/refunds`   | `legal/remboursements`        | `legal/erstattungen`        | `legal/reembolsos`       | `legal/reemborsaments`   |
| legal_disclaimer | `legal/disclaimer.tsx`   | `legal/disclaimer`          | `legal/disclaimer`| `legal/avertissement`         | `legal/haftungsausschluss`  | `legal/aviso-legal`      | `legal/avis-legal`       |

Otras rutas:
- **Blog (indexable)**: `/blog`, `/blog/:slug` y variantes `/{lang}/blog`, `/{lang}/blog/:slug` → `pages/blog/{index,post}.tsx`. Incluidas en `KNOWN_PATHS` del middleware con `X-Robots-Tag: index, follow` y en `sitemap-blog.xml`.
- **Forzadas a noindex** por el middleware (`server/routes.ts` → `NOINDEX_PATHS` + prefijos):
  - `/links` → `pages/go.tsx` (linktree).
  - `/start` → `pages/start.tsx` (landing UTM/funnel).
  - `/booking/:bookingId` → `pages/booking.tsx` (gestión propia del cliente; ver §9).
  - cualquier path desconocido (catch-all).
- Fallback → `pages/not-found.tsx`.

Helpers en `shared/routes.ts`: `resolveRoute`, `getLocalizedPath`, `getEquivalentPath` (para `LanguageSwitcher`), `getAllLocalizedPaths`, `getLangFromPath`.

---

## 4. Endpoints API y rutas server

Registro en `server/routes.ts` → delega a `routes/public.ts` e `indexnow.ts`. No existe ninguna superficie REST admin: toda operación interna se canaliza por el bot de Discord (`discord-bot-commands.ts`); cualquier `/api/admin/*` cae en el catch-all `apiNotFound` con 404. Middleware global aplica `X-Robots-Tag` y `Link: rel=canonical` por path resuelto, CSRF por origin/referer en métodos no seguros, y strip de `body.id` en POST/PATCH/PUT.

### Públicos (`server/routes/public.ts`)

| Método | Path                                      | Función                                                               |
|--------|-------------------------------------------|-----------------------------------------------------------------------|
| GET    | `/api/bookings/blocked-days`              | días bloqueados visibles para el calendario                           |
| GET    | `/api/bookings/available-slots`           | slots disponibles para una fecha                                      |
| POST   | `/api/bookings/book`                      | crear booking + Google Calendar event + Meet + email + Discord        |
| GET    | `/api/booking/:bookingId?token=…`         | leer booking propio (autenticado por query `token` = manageToken)     |
| POST   | `/api/booking/:bookingId/reschedule`      | reagendar (autenticado por `token`; anti-doble-book + Calendar update)|
| POST   | `/api/booking/:bookingId/cancel`          | cancelar (autenticado por `token`; Calendar delete + email + Discord) |
| POST   | `/api/calculator-leads`                   | guardar resultado calculadora + email + Discord                       |
| POST   | `/api/consent`                            | log GDPR (privacidad/marketing)                                       |
| POST   | `/api/newsletter/subscribe`               | alta + double opt-in token                                            |
| GET    | `/api/newsletter/unsubscribe/:token`      | baja                                                                  |
| POST   | `/api/visitor`                            | tracking ligero de visita server-side                                 |
| GET    | `/api/legal/versions`                     | versiones vigentes de TOS/Privacy/Cookies/Disclaimer/Refund           |
| GET    | `/sitemap.xml`                            | sitemap principal (todas las rutas localizadas con `<xhtml:link>`)    |
| GET    | `/sitemap-blog.xml`                       | sitemap del blog                                                      |
| GET    | `/robots.txt`                             | reglas + Sitemap                                                      |

### Admin (bot Discord — `server/discord-bot-commands.ts`)

No existe ninguna REST API admin. Toda operación pasa por slash commands (`/agenda`, `/cita ver|reagendar|cancelar|noshow|reenviar|nueva`, `/ayuda`) gated por `ADMIN_DISCORD_ROLE_ID`. Cada acción se replica en `#sistema-auditoria` (`notifyAdminAction`).

### IndexNow (`server/indexnow.ts`)

- `GET /<INDEXNOW_KEY>.txt` → archivo de verificación.
- Llamada `submitIndexNow(urls)` se invoca desde flujos de blog publish (no expuesto vía HTTP saliente desde el cliente).

### Otros

- `GET /api/health` (en `index.ts`).
- `GET /assets/*`, `GET *.{ext}` y catch-all 404 noindex en `static.ts`.
- Vite middleware en dev (`server/vite.ts`).

---

## 5. Esquemas Drizzle activos (`shared/schema.ts`)

| Tabla                       | Propósito                              | Notas clave                                                                 |
|-----------------------------|----------------------------------------|------------------------------------------------------------------------------|
| `leads`                     | leads del funnel                       | índices por email/fecha/teléfono/fuente                                      |
| `agenda`                    | bookings                                | índice parcial único `(meetingDate, startTime)` excluyendo `cancelled/no_show`; check de `status` |
| `calculations`              | resultados de calculadora              | índice por país/email/createdAt                                              |
| `visits`                    | tracking de visitas server-side        | índice por ip/createdAt                                                      |
| `newsletter_subscribers`    | suscriptores                            | unique email + índice token unsub                                            |
| `blocked_days`              | días bloqueados manual                 | índice por fecha                                                             |
| `legal_document_versions`   | versionado legal                        | índices por type/effective_date/createdAt                                    |
| `consent_log`               | log GDPR                                | índices por email/form_type/createdAt                                        |
| `seo_rankings`              | snapshot diario rankings (GSC)         | unique `(snapshotDate, slug, lang)`                                          |

Tipos exportados: `Lead/InsertLead`, `Agenda/InsertAgenda`, `Calculation/InsertCalculation`, `Visit/InsertVisit`, `NewsletterSubscriber/InsertNewsletterSubscriber`, `BlockedDay/InsertBlockedDay`, `LegalDocVersion/InsertLegalDocVersion`, `SeoRanking/InsertSeoRanking`, `LegalDocType`. **Regla**: cualquier tipo de Booking/Lead/etc. se importa SIEMPRE desde `@shared/schema` — no redefinir en `client/`.

---

## 6. Hooks y utilidades cliente

- `hooks/useCountUp` — animación numérica Hero/HomeFAQ.
- `hooks/useInlineMessage` — mensajes inline de formularios.
- `hooks/useLangPath` — resolver path localizado (`lp("about_llc")`).
- `hooks/useReveal` — IntersectionObserver para fade-in.
- `hooks/useScrolled` — boolean según scrollY (Navbar pinned).
- `lib/calculator` — datos países/regímenes IRPF + scenario engine.
- `lib/constants` — URLs externas, PDFs legales, partners, tier pricing.
- `lib/clientLogger`, `lib/sanitize`, `lib/lang-utils`, `lib/queryClient`.

## 7. Dependencias y propósito

Producción (de `package.json`): `react`, `react-dom`, `wouter`, `@tanstack/react-query`, `i18next`, `react-i18next`, `dompurify` (sanitización HTML blog), `nanoid` (IDs), `pg` + `drizzle-orm` + `drizzle-zod` + `drizzle-kit` (BD), `zod` (validación), `express`, `compression`, `helmet`, `googleapis` (Calendar/Meet/Gmail), `ioredis` (lock + rate-limit opcional), `tailwindcss`, `autoprefixer`, `postcss`, `vite`, `@vitejs/plugin-react`, `esbuild`, `tsx`, `typescript`. Tipos `@types/*`.

Dev: `@playwright/test`.

**Candidatas a desinstalar tras este pase**: ninguna confirmada al 100%. `lucide-react` no aparece en el manifest del proyecto (0 imports verificados). Nota: si en algún momento se añadió, queda como candidato a depuración futura cuando se haga la pasada de `package.json` (hoy bloqueado por la regla de no editar `package.json` sin permiso).

---

## 8. Integraciones externas

| Servicio              | Cómo se usa                                                                 | Vars de entorno                             |
|-----------------------|------------------------------------------------------------------------------|----------------------------------------------|
| Google Calendar/Meet  | Service account; crea/edita/borra eventos con `conferenceData` (Meet auto). | `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_CALENDAR_ID` |
| Gmail API             | Service account `subject` para emails transaccionales (`email.ts`).         | `GOOGLE_SERVICE_ACCOUNT_KEY`                 |
| Discord (7 canales)   | Bot REST API por categoría: `registros`, `calculadora`, `actividad`, `agenda`, `consentimientos`, `errores`, `auditoria`. | `DISCORD_BOT_TOKEN`, `DISCORD_APP_ID`, `DISCORD_PUBLIC_KEY`, `DISCORD_GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`, `DISCORD_CHANNEL_REGISTROS`, `DISCORD_CHANNEL_CALCULADORA`, `DISCORD_CHANNEL_ACTIVIDAD`, `DISCORD_CHANNEL_AGENDA`, `DISCORD_CHANNEL_CONSENTIMIENTOS`, `DISCORD_CHANNEL_ERRORES`, `DISCORD_CHANNEL_AUDITORIA` |
| IndexNow              | Ping a Bing/Yandex y archivo de verificación servido desde la propia web.   | `INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION`     |
| Trustpilot            | Solo frontend (widget público y links).                                     | —                                            |
| Postgres              | Único almacén persistente (Replit DB).                                      | `DATABASE_URL`, `DB_POOL_MAX`               |
| Redis (opcional)      | Lock distribuido + rate-limit; si falta, fallback in-memory.                | `REDIS_URL`                                 |

### Variables de entorno completas

`DATABASE_URL`, `DB_POOL_MAX`, `NODE_ENV`, `PORT`, `LOG_LEVEL`, `SITE_URL`, `DOMAIN`, `COMPANY_ADDRESS_SHORT`, `CONTACT_EMAIL`, `LEGAL_EMAIL`, `ADMIN_EMAIL`, `WHATSAPP_NUMBER`, `INSTAGRAM_URL`, `TIKTOK_URL`, `YOUTUBE_URL`, `FACEBOOK_URL`, `LINKEDIN_URL`, `EXTRA_ALLOWED_ORIGINS`, `FIELD_ENCRYPTION_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_CALENDAR_ID`, `INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION`, `REDIS_URL`, `DISCORD_BOT_TOKEN`, `DISCORD_APP_ID`, `DISCORD_PUBLIC_KEY`, `DISCORD_GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`, `DISCORD_CHANNEL_*` (×7).

---

## 9. Diagrama textual: flujo de booking

```
User /:lang/agendar (book.tsx)
  → BookingCalendar
      GET /api/bookings/blocked-days
      GET /api/bookings/available-slots?date=YYYY-MM-DD
  → submit
      POST /api/bookings/book {nombre, email, fecha, hora, ...}
          ├─ Zod validate (insertAgendaSchema)
          ├─ rate-limit (Redis o memory)
          ├─ lock distribuido por slot (lock-store)
          ├─ storage/scheduling.createBooking (Drizzle insert)
          │     └─ índice parcial único → SlotConflictError si carrera perdida
          ├─ google-meet.createEvent (Calendar + Meet)
          │     └─ persist googleMeet + googleMeetEventId
          ├─ field-encryption.encryptSensitiveFields (PII en BD)
          ├─ generar manageToken (32 hex bytes) → manageUrl = `${SITE_URL}/booking/${bookingId}?token=${manageToken}`
          ├─ email.send (Gmail API → cliente + admin) con manageUrl embebido
          └─ discord.send(canal=agenda) con manageToken (no expuesto en HTTP response)
  → response al cliente: { date, startTime, endTime, meetLink, status }
     (manageToken NO viaja por la API; el cliente recibe la URL solo por email)
  → cliente gestiona en /booking/:bookingId?token=<manageToken> (booking.tsx)
      GET  /api/booking/:bookingId?token=…           (valida token === manageToken)
      POST /api/booking/:bookingId/reschedule        (re-locks, Calendar update)
      POST /api/booking/:bookingId/cancel            (Calendar delete + email + Discord)

Admin (Discord bot — sin UI web)
  → role gate Discord (ADMIN_DISCORD_ROLE_ID)
  → slash commands /agenda, /cita ver|reagendar|cancelar|noshow|reenviar|nueva, /ayuda
  → toda acción se replica en #sistema-auditoria via notifyAdminAction
```

## 10. Diagrama textual: SEO/SSR

```
GET /<path>
  ├─ middleware (server/routes.ts)
  │     ├─ X-Robots-Tag: noindex en /links, /start, /booking/* y paths desconocidos
  │     ├─ X-Robots-Tag: index + Link rel=canonical en rutas conocidas
  ├─ /sitemap.xml, /sitemap-blog.xml, /robots.txt → routes/public.ts
  ├─ /api/* → routes/public.ts | /api/discord/interactions → discord-bot.ts
  ├─ assets estáticos → server/static.ts (cache largo, immutable)
  └─ HTML
        ├─ DEV: server/vite.ts inyecta el bundle de Vite
        └─ PROD: server/static.ts sirve dist/index.html
              y server/seo-content.ts inyecta:
                · <title>, meta description, canonical, hreflang completo
                · OG/Twitter
                · JSON-LD (Organization, BreadcrumbList, Article para blog)
                · contenido pre-renderizado por ruta (mejora LCP/SEO sin SSR completo)
```

---

## 11. Verificación de candidatos huérfanos (Task #49 — paso 1)

| Candidato                                  | Veredicto   | Justificación                                                                 |
|--------------------------------------------|-------------|-------------------------------------------------------------------------------|
| `client/src/pages/services-sections.tsx`   | EN USO      | `lazy(() => import("./services-sections"))` en `services.tsx`.                |
| `client/src/pages/about-llc.tsx`           | EN USO      | Está en `ROUTE_SLUGS.about_llc`, importado por `App.tsx`, sitemap y `seo-content.ts`. Enlazado desde i18n y blog. |
| `client/src/pages/start.tsx`               | EN USO      | Ruta `/start` en `App.tsx` y `seo-content.ts`. Excluida del sitemap (noindex). |
| `client/src/pages/go.tsx`                  | EN USO      | Ruta `/links` en `App.tsx`. Linktree público. Noindex.                         |
| `client/public/img/flags/*.png` (8)        | EN USO      | Referenciados por `lib/calculator.ts` para los selectores de país.             |
| `.calc-results-enter`, `.calc-savings-enter` (CSS) | EN USO  | Aplicadas en `components/calculator/CalculatorResults.tsx`.                    |
| `*.pdf` legales en `client/public/`        | EN USO      | Referenciados por `client/src/lib/constants.ts`.                              |
| `client/public/img/partner-lili.webp`      | **HUÉRFANO** → eliminado | 0 referencias en TS/TSX/CSS.                                                  |
| `AUDIT-BLOG.md`                            | **HUÉRFANO** → eliminado | 0 referencias.                                                                 |
| `manual-test.ts`                           | **HUÉRFANO** → eliminado | 0 referencias; no estaba enganchado a npm scripts ni a Playwright.            |

---

## 12. CSS muerto

Tras este pase, no se confirmaron selectores CSS muertos en `index.css`. `.calc-results-enter`/`.calc-savings-enter` están en uso. La limpieza tipográfica (Task #48) ya retiró el counter `blog-h2`, el chip `::before` decorativo de H2, los markers `decimal-leading-zero` con `font-variant-numeric: tabular-nums` en `.blog-content ol > li::before`, y el `text-transform: uppercase` + `letter-spacing` en `.blog-table thead th`.

## 13. Imports y tipos duplicados

- **Schema Drizzle / dominio**: sin duplicados. Todo se consume desde `@shared/schema` y `server/storage/*` importa `* as s from "../../shared/schema"` (patrón consistente).
- **DTOs de respuesta de API**: hay tipos locales en cliente que duplican parcialmente la forma del payload (ej. `BookingData` en `client/src/pages/booking.tsx`). No es duplicación de schema, pero conviene en una pasada futura extraer un contrato compartido (`shared/api-types.ts`) para los responses de `/api/booking/:bookingId` y similares, para evitar drift cliente↔servidor.

---

## 14. Notas para futuras pasadas

- Cuando se desbloquee el editar `package.json`: confirmar que `lucide-react` no entró por algún cambio reciente y, si no, retirarlo del manifest. Revisar que `@types/dompurify` siga necesario (DOMPurify trae sus tipos en versiones recientes).
- `client/src/data/_cluster-audit.md` parece nota interna de redacción; revisar si conviene moverlo a `docs/blog/`.
- `tests/` y `test-results/` contienen artefactos de Playwright; añadir `test-results/` al `.gitignore` si no estuviera (revisar fuera de scope de este task).
