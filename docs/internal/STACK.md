# STACK.md — Stack técnico Exentax Web (estado actual)

**Última revisión**: 2026-04-25 · post-eliminación phone-CTA + sitemap-check graceful-degrade

Este documento es el **inventario consolidado** del stack tecnológico. Generado
desde `package.json` + auditoría de código real.

---

## 1. Frontend

| Categoría | Tech | Versión | Uso |
|---|---|---|---|
| Framework | **React** | 19.2.4 | UI components + concurrent mode |
| Build | **Vite** | 7.3.1 | Dev server + prod build |
| Lenguaje | **TypeScript** | 5.x strict | Tipos completos, 0 errores en `tsc --noEmit` |
| Routing | **wouter** | 3.9.0 | Client routing ligero (~1 kB) |
| Estado servidor | **@tanstack/react-query** | 5.90.21 | Query/mutation cache, invalidation |
| Estilos | **Tailwind CSS** | 3.4.19 | Utility-first, theme crema/light único |
| i18n | **i18next + react-i18next** | 25.8.18 + 16.5.8 | 6 locales, 1552 keys |
| Validación | **zod** | 3.24.2 | Schemas API + form |
| Animaciones | Framer Motion | (peer) | Microinteracciones (hero stats, scroll) |

## 2. Backend

| Categoría | Tech | Versión | Uso |
|---|---|---|---|
| Runtime | Node.js | 22.22 | ESM modules |
| Framework | **Express** | 5.2.1 | API routing + middleware |
| ORM | **Drizzle ORM** | 0.45.1 | Schema-first PostgreSQL |
| DB | **PostgreSQL** | 16 (Hostinger / Neon) | Storage primario |
| Validación | **drizzle-zod** | 0.6.1 | Type-safe schemas → zod |
| Seguridad | **helmet** | 8.1.0 | CSP, HSTS, X-Frame, X-Content-Type |
| Cifrado | **AES-256-GCM** (crypto built-in) | — | Field-level (`phone` por defecto) |
| Logger | **pino-style** custom (`server/logger.ts`) | — | Levels + structured JSON |
| Process | **tsx** | 4.21.0 | Direct TS execution sin compile step |

## 3. Integraciones externas

| Servicio | Cliente | Propósito |
|---|---|---|
| **Google Calendar** | googleapis 171.4.0 | Crear eventos booking + invitee |
| **Google Meet** | googleapis | Generar enlace meet automático |
| **Gmail API** | googleapis | Envío emails (welcome, confirmation, reminder, etc.) |
| **Discord Bot REST** | fetch + Ed25519 verify | 13 event types → 7 canales |
| **IndexNow** | fetch | Ping URLs nuevas (Bing, Yandex) |
| **Google Search Console** | (manual) | Indexing requests |
| **Google Analytics 4** | gtag.js | 16 events trackeados |

## 4. Tests + Linters (canonical)

`npm run check` ejecuta secuencia completa:

```
tsc → lint:typography → lint:stray-reports → lint:brand-casing → lint:pt-pt
   → lint:blog → seo:check → seo:slash → seo:meta → seo:masterpiece-strict
   → blog:validate-all → i18n:check → test:* → audit:bundle
```

### Linters específicos

| Comando | Script | Cobertura | Estado actual |
|---|---|---|---|
| `lint:typography` | `check-typography-rule0.mjs` | Decorative typography rules | ✅ 0 violations |
| `lint:brand-casing` | `brand-casing-check.mjs` | "Exentax" no "ExenTax" | ✅ 0 occurrences |
| `lint:pt-pt` | `audit-pt-pt.mjs` | PT-PT no brasileñismos | ✅ 0 hits, 114 ficheros |
| `lint:blog` | `blog-content-lint.mjs` | Forbidden mentions | ✅ 676 ficheros OK |
| `lint:stray-reports` | `check-stray-reports.mjs` | No artifacts en raíz | ✅ |
| `seo:check` | `seo-check-links.mjs` | Internal links + inbound ≥3 | ✅ 112 articles |
| `seo:slash` | `seo-slash-hygiene.mjs` | URL slash policy | ✅ clean |
| `seo:meta` | `seo/verify-meta.ts` | Meta titles/descriptions × 6 langs | ✅ 0 errors / 0 warnings |
| `seo:masterpiece-strict` | `blog-masterpiece-audit.mjs` | Heading hierarchy + word count | ✅ |
| `blog:validate-all` | `blog-validate-all.mjs` | 13 sub-checks | ✅ 13/13 OK |
| `i18n:check` | `validate-i18n.ts + find-hardcoded-strings.ts` | Keys + JSX text + attrs | ✅ PASS |
| `blog-cta-channel-lint` | `blog-cta-channel-lint.mjs` | WhatsApp number drift detection | ✅ canonical sync |
| `test:calculator` | `calculator.test.ts` | IRPF/SS brackets + edge cases | ✅ 123/123 |
| `test:discord-neon` | `test-discord-neon.ts` | Brand color enforcement | ✅ 23 embeds OK |
| `test:newsletter` | `test-newsletter-e2e.ts` | E2E newsletter flow | ✅ |
| `test:booking` | `test-booking-e2e.ts` | E2E booking flow | ✅ |
| `test:indexnow` | (script) | IndexNow ping verification | ✅ |
| `test:bundle-diff-notify` | `audit-bundle-diff-notify-discord.test.mjs` | Discord webhook auth | ✅ |
| `audit:bundle` | `audit-bundle.mjs` | Bundle size baseline | ✅ |
| `test:field-encryption` | `test-field-encryption.ts` | AES-256-GCM E2E | ✅ 45/45 |
| `test:sitemap-e2e` | `test-sitemap-e2e.ts` | Live sitemap with server | ✅ 62/62 |

## 4.5. Contact channels (single source of truth)

**Source of truth**: `client/src/lib/constants.ts` exporta `CONTACT.WHATSAPP_NUMBER`,
`CONTACT.WHATSAPP_DISPLAY`, `CONTACT.WHATSAPP_URL`, `CONTACT.EMAIL`.

**Embedded in static HTML** (pre-rendered para SEO/SSR):
- `client/src/data/blog-content/<lang>/*.ts` × 666 (1 CTA conv-v1 por artículo × 6 idiomas)
- `client/src/data/blog-cta-library.ts` (CTAs centralizados)
- `client/src/data/blog-mid-cta-copy.ts` (CTAs mid-article)
- `client/src/i18n/locales/<lang>.ts` (FAQs banking_*, etc.)

**Drift detection**: `node scripts/blog-cta-channel-lint.mjs` lee canonical de
`constants.ts` y verifica que TODAS las URLs `wa.me/<digits>` coincidan. Exit
1 si detecta drift.

**Mass update** si cambia el número:
1. Editar `WHATSAPP_NUMBER` en `client/src/lib/constants.ts`
2. `node scripts/blog-cta-channel-update.mjs` (dry-run)
3. `node scripts/blog-cta-channel-update.mjs --apply`
4. `node scripts/blog-cta-channel-lint.mjs` para confirmar 0 drift
5. Run full `npm run blog:validate-all` para verificar 0 regresiones

**Razón de la arquitectura**: las URLs WhatsApp están embebidas en HTML estático
(no inyectadas en runtime) porque son críticas para SEO — el crawler debe poder
seguir el href. Centralizar via runtime injection requeriría SSR override que
complicaría arquitectura sin beneficio. La estrategia de constants + lint + update
script da maintainability sin riesgo.

---

## 5. Inventario de cifras

- **Páginas**: 25 (16 rutas × 6 locales = 96 URLs públicas)
- **Componentes**: 44 reutilizables + secciones
- **API routes**: 29 endpoints (públicos + observability + admin)
- **Scripts**: 76 ejecutables (linters + audits + E2E)
- **Blog articles**: 112 × 6 idiomas = 672 ficheros
- **i18n keys**: 1552 × 6 locales
- **Currencies/países calculadora**: 8 (ES, MX, CL, UK, FR, BE, IT, AT)
- **Discord events**: 13 tipos → 7 canales
- **GA4 events**: 16 (`cta_click`, `form_submit`, `whatsapp_click`,
  `newsletter_subscribe`, `booking_initiated`, `booking_completed`,
  `calculator_used`, `outbound_link`, `language_switch`, `scroll_depth`,
  `time_on_page`, `contact_form_submitted`, etc.)

## 6. Env vars (producción)

### Requeridas (fail-fast en `server/index.ts:22-33`)

```
DATABASE_URL                    # PostgreSQL connection string
SESSION_SECRET                  # 64-byte hex
FIELD_ENCRYPTION_KEY            # 32-byte hex (cifrado phone)
DISCORD_BOT_TOKEN
DISCORD_PUBLIC_KEY
ADMIN_DISCORD_ROLE_ID
DISCORD_CHANNEL_REGISTROS
DISCORD_CHANNEL_CALCULADORA
DISCORD_CHANNEL_ACTIVIDAD
DISCORD_CHANNEL_AGENDA
DISCORD_CHANNEL_CONSENTIMIENTOS
DISCORD_CHANNEL_ERRORES
DISCORD_CHANNEL_AUDITORIA
GOOGLE_SERVICE_ACCOUNT_JSON_B64 # Calendar + Meet + Gmail
INDEXNOW_KEY
NEWSLETTER_LIST_ID
```

### Opcionales

```
PORT                            # default 5000
NODE_ENV                        # development | production
GOOGLE_INDEXING_API_ENABLE      # 1 para Indexing API (JobPosting/BroadcastEvent)
SEO_SLASH_SKIP_LIVE             # 1 para skip live scan en seo:slash
```

## 7. Build artifacts

- `dist/index.mjs` ~5.4 MB (server bundle)
- `dist/index.cjs` shim (Hostinger compatibility)
- `dist/public/` ~24 MB (client + assets + locale chunks)
- 6 locale chunks (`es-*.js`, `en-*.js`, ...) lazy-loaded vía `META_LOADERS`

---

**Mantenimiento**: actualizar este STACK.md cuando cambien dependencias mayores
o se añadan integraciones externas. Validar con `npm ls` ante dudas.
