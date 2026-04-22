# Arquitectura — Exentax Web

Documento de referencia del árbol del proyecto, responsabilidades por módulo
y flujos críticos. Mantén sincronizado con el código (si algo cambia, actualiza
este documento en el mismo PR).

## Visión general

Monorepo ligero: un workspace raíz delega al paquete real bajo `exentax-web/`.

```
exentax-web-new/
├── package.json          # workspace root (dev / build / start delegan a exentax-web/)
├── exentax-web/          # ← paquete aplicación
│   ├── client/           # Frontend React 19 + Vite 7 + Tailwind
│   ├── server/           # Backend Express 5 + Helmet + Drizzle + Discord bot
│   ├── shared/           # Tipos y helpers compartidos client ↔ server
│   ├── scripts/          # 68 scripts de audit / CI / migraciones
│   ├── tests/            # Playwright + spec tests
│   └── docs/             # Documentación específica del paquete
├── docs/                 # Auditorías históricas (task #4, #36, etc.)
├── CHANGELOG.md          # Historial de cambios de alto nivel
├── PENDING.md            # Backlog priorizado
├── TRANSLATION-GUIDE.md  # Glosario terminológico 6 idiomas
├── SEO-STRATEGY.md       # Estrategia SEO + keywords por mercado
└── AUDIT-REPORT.md       # Último informe de auditoría integral
```

El build real lo orquesta `exentax-web/scripts/build.ts` (invocado tanto desde
`workspace/package.json` como desde `exentax-web/package.json`).

---

## Frontend (`exentax-web/client/`)

```
client/
├── index.html
├── public/               # og-image.png, favicon, robots.txt estático (si aplica)
└── src/
    ├── App.tsx           # Router (wouter) + layouts
    ├── main.tsx          # Entry point + ErrorBoundary + i18n init
    ├── index.css         # Tailwind base + utilities
    ├── components/
    │   ├── BookingCalendar.tsx
    │   ├── CookieBanner.tsx
    │   ├── LanguageSwitcher.tsx
    │   ├── SEO.tsx        # ← meta/OG/Twitter/hreflang/JSON-LD per page
    │   ├── blog/
    │   ├── calculator/    # CalculatorResults.tsx, CalculatorForm.tsx, …
    │   ├── layout/
    │   └── sections/
    ├── pages/
    │   ├── home.tsx
    │   ├── services.tsx + services/{itin,llc-{nm,wy,de,fl}}.tsx + ServiceSubpage.tsx
    │   ├── blog/{index,post}.tsx
    │   ├── faq-page.tsx
    │   ├── how-we-work.tsx
    │   ├── book.tsx + booking.tsx
    │   ├── about-llc.tsx
    │   ├── start.tsx + go.tsx (páginas noindex de redirección)
    │   └── legal/
    ├── hooks/
    ├── lib/
    │   ├── calculator.ts            # Motor de cálculo
    │   ├── calculator-config.ts     # SOURCE OF TRUTH datos fiscales 2026
    │   ├── calculator.test.ts       # 116 aserciones unit
    │   └── clientLogger.ts
    ├── data/
    │   ├── blog-posts*.ts           # Catalogue de 111 posts × 6 idiomas
    │   ├── blog-i18n/               # metaTitle / metaDescription / slug por idioma
    │   ├── blog-content/{es,en,fr,de,pt,ca}/*.ts  # Contenido markdown por idioma
    │   ├── blog-cta-library.ts      # Catálogo CTAs + URLs
    │   ├── blog-sources.ts          # Fuentes oficiales con verificación periódica
    │   └── reviewsData.ts           # Trustpilot reviews (JSON-LD AggregateRating)
    └── i18n/
        ├── index.ts
        ├── keys.generated.ts         # Types generados (DO NOT EDIT)
        ├── language-service.ts       # Persistencia + detección idioma
        ├── fallback.test.ts
        ├── data/
        └── locales/{es,en,fr,de,pt,ca}.ts  # 1552 claves × 6 idiomas
```

---

## Backend (`exentax-web/server/`)

```
server/
├── index.ts               # Express app, middleware stack, routes wiring, start
├── db.ts                  # Drizzle + Postgres pool (falla si no hay DATABASE_URL)
├── logger.ts              # Structured JSON logger
├── metrics.ts             # Prometheus counters/gauges expuestos en /api/metrics
├── circuit-breaker.ts     # Breaker para integraciones externas
├── correlation.ts         # Correlation ID por request
├── rate-limit-store.ts    # Redis (ioredis) opcional + memory fallback
├── lock-store.ts          # SlotLock (Redis + fallback) para reservas concurrentes
├── route-helpers.ts       # enqueueReminder(), releaseSlotLock(), etc.
├── routes.ts + routes/    # Handlers REST
├── sanitize-middleware.ts # Sanitización input genérica
├── field-encryption.ts    # Encrypt PII at rest (AES-256-GCM)
├── static.ts              # Serve vite output / assets
├── seo-content.ts         # Blog slugs / sitemap generation helpers
├── indexnow.ts (+ .test.ts)        # IndexNow ping nuevos artículos
├── sitemap-ping.ts        # Ping con detección de cambios (SHA-256 del sitemap)
├── google-indexing.ts     # Google Indexing API (opt-in, cuota respetada)
├── google-search-console.ts
├── google-meet.ts
├── google-utils.ts + google-credentials.ts
├── email.ts               # Send layer (Gmail API + fallbacks)
├── email-i18n.ts          # Plantillas booking/reminder/cancellation/etc. en 6 idiomas
├── email-layout.ts        # Layout HTML branded
├── email-retry-queue.ts   # Worker + heartbeat, drena jobs fallidos
├── faq-schema-i18n.ts     # FAQPage JSON-LD por idioma
├── discord.ts             # Post a canales (embeds formateados)
├── discord-bot.ts         # Ed25519 verify + slash command router (/ayuda, /agenda, /cita)
├── discord-bot-commands.ts  # Implementación por comando + subcomandos
├── server-constants.ts    # SUPPORTED_LANGS, BRAND, CANALES DISCORD, etc.
├── store-cleanup.ts
└── storage/               # Adaptadores DB
```

### Canales Discord (sin webhooks legacy)

Todas las notificaciones van vía bot REST (no webhooks). Canales:

| Canal | Contenido |
|---|---|
| REGISTROS | Leads newsletter + fallback de errores críticos |
| AGENDA | Reservas lifecycle (created / rescheduled / cancelled / noshow) con botones interactivos |
| CONSENTIMIENTOS | GDPR opt-in / opt-out |
| CALCULADORA | Leads desde la calculadora con resumen de cálculo |
| ACTIVIDAD | Visitas + UTM (sampling) |
| ERRORES | Errores críticos del backend |
| AUDITORIA | Acciones admin (todas las invocaciones /agenda y /cita) |

Cada embed incluye timestamp `Europe/Madrid` (ver `shared/madrid-time.ts`).
Rate limiting Discord respetado: backoff exponencial ×3 ante 429/5xx, timeout 8 s.
Dedupe por correlation ID evita duplicados en reintentos upstream.

---

## Shared (`exentax-web/shared/`)

```
shared/
├── calculator.ts          # Tipos + helpers puros calculadora
├── calculator-fx.ts       # FX_RATES_PER_EUR + convertFromEUR (sin deps)
├── email.ts               # Tipos compartidos de plantillas
├── madrid-time.ts         # Conversión timezone segura (Europe/Madrid)
├── routes.ts              # resolveRoute, getLocalizedPath, tabla de rutas 6 idiomas
└── schema.ts              # Drizzle schema (leads, bookings, consents, metrics)
```

---

## Scripts (`exentax-web/scripts/`) — 68 ficheros

Categorías:

| Prefijo | Propósito |
|---|---|
| `audit-*` | Snapshots de calidad (markdown, bundle, faqs, pt-pt, etc.) |
| `blog-*` | Lint + validación de contenido, CTAs, sources, masterpiece audit |
| `seo-*` | Check de links, slash hygiene, meta, masterpiece strict |
| `check-*` | Typography rule0, stray reports, brand casing |
| `validate-i18n.ts` | 1552 claves × 6 idiomas, placeholders, phantom keys, allowlist |
| `generate-i18n-types.ts` | keys.generated.ts |
| `register-discord-commands.ts` | Sincronización de slash commands (guild scope) |
| `archive/` | Scripts de tareas cerradas (task-4, task-36, task-04) |

Todos los audits que terminan en `.test.mjs` son suites de self-test del propio
linter: se ejecutan en el pipeline `npm run check` para asegurar que el linter
detecta correctamente los patrones prohibidos.

---

## Pipeline `npm run check` (orden)

```
tsc                                 # Type check
→ lint:typography                   # Regla 0 tipográfica (0 violaciones ES/CA)
→ lint:stray-reports                # No .md/.json/.html sueltos en raíz
→ lint:brand-casing                 # Prohibido "ExenTax"
→ lint:pt-pt                        # Sin brasileñismos
→ lint:blog                         # content + CTA position + translation quality
→ seo:check                         # Enlaces internos de blog sin romper
→ seo:slash                         # Slash-hygiene (arranca servidor temporal)
→ seo:meta                          # Longitudes meta tags
→ seo:masterpiece-strict            # Calidad editorial blog
→ blog:validate-all                 # slugs / i18n / data consistency
→ i18n:check                        # generate-types + validate
→ test:seo-check / test:seo-slash   # Self-test linters
→ test:lint-blog
→ test:audit-faqs
→ test:calculator                   # 116 aserciones
→ test:discord-neon                 # Discord bot integration (mock)
→ test:bundle-diff-notify
→ test:newsletter / test:booking    # E2E dummy para validar plantillas
→ test:indexnow
→ audit:bundle                      # Size snapshot + Discord notify en diffs
```

---

## Datos fiscales — ubicación canónica

**TODO dato 2026 parte de `client/src/lib/calculator-config.ts`** (single source of truth).
Los artículos de blog y las cadenas en `i18n/locales/*` deben coincidir con este
fichero. Verificaciones:

- IRPF 2026 agregado: 6 tramos de 19 % a 47 %.
- Tarifa estatal pura (9,5 %, 12 %, 15 %, 18,5 %, 22,5 %, 24,5 %) se documenta
  en el artículo `blog-content/es/tramos-irpf-2026.ts`.
- Base del ahorro 2026: 5 tramos de 19 % a 28 %.
- RETA autónomos 2026: 15 tramos, 200 €/mes → 604,80 €/mes.
- Tarifa plana 2026: 80 €/mes los primeros 12 meses.
- Precios Exentax 2026: LLC setup **2.000 €**, mantenimiento anual **1.400 €**.

Cuando haya que actualizar a 2027:

1. Actualizar `calculator-config.ts` (constantes + comentarios con fuente oficial).
2. Regenerar los artículos de blog afectados (cuotas autónomos, tramos IRPF).
3. Ajustar la línea `noFixed` en `i18n/locales/*.ts` si cambian los precios
   Exentax.
4. Renombrar `SS_AUTONOMO_BRACKETS_2026` → `_2027` y actualizar imports.
5. Correr `npm run check` — el test calculator tiene una aserción de tramo
   mínimo que hay que ajustar si el valor cambia.

---

## Deploy (Replit / Hostinger / otros)

- `.replit` declara entrypoint en `exentax-web/dist/index.cjs` (generado por
  `scripts/build.ts` al compilar). Un shim raíz garantiza compat con `.replit`.
- Puerto: `process.env.PORT` o 5000 por defecto. Bind a `0.0.0.0`.
- `trust proxy = 1` (correcto tras proxy/load balancer).
- Variables críticas (obligatorias en producción): `DATABASE_URL`,
  `DISCORD_PUBLIC_KEY`, `DISCORD_BOT_TOKEN`, `DISCORD_APP_ID`,
  `ADMIN_DISCORD_ROLE_ID`, `DISCORD_GUILD_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`,
  `INDEXNOW_KEY`, `SESSION_SECRET`, `FIELD_ENCRYPTION_KEY`. Lista completa en
  `.env.example`.
- Health checks: `/api/health` (liveness, nunca toca DB) y `/api/health/ready`
  (readiness, puede fallar durante boot).
- Cold start: imports pesados (Google APIs, Discord embeds) cargados on-demand.
- SKIP_BUILD_E2E: flag documentado en `README.md` para despliegues donde
  Playwright no es viable (contenedor sin browsers).
