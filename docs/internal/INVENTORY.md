# INVENTORY — Mapa consolidado de Exentax Web

**Última revisión: 2026-04-22 · Sesión 11**
**Propósito**: referencia rápida para agentes automatizados y
desarrolladores nuevos. Toda adición/eliminación mayor debe actualizar
este doc.

---

## 1. Rutas (16 × 6 idiomas = 96 páginas canónicas)

Source of truth: `exentax-web/shared/routes.ts:ROUTE_SLUGS`.

| RouteKey | ES | EN | FR | DE | PT | CA |
|---|---|---|---|---|---|---|
| `home` | `/` | `/en` | `/fr` | `/de` | `/pt` | `/ca` |
| `how_we_work` | `/es/como-trabajamos` | `/en/how-we-work` | `/fr/comment-nous-travaillons` | `/de/wie-wir-arbeiten` | `/pt/como-trabalhamos` | `/ca/com-treballem` |
| `our_services` | `/es/servicios` | `/en/services` | `/fr/services` | `/de/leistungen` | `/pt/servicos` | `/ca/serveis` |
| `about_llc` | `/es/sobre-las-llc` | `/en/about-llc` | `/fr/a-propos-des-llc` | `/de/uber-llc` | `/pt/sobre-llc` | `/ca/sobre-les-llc` |
| `faq` | `/es/preguntas-frecuentes` | `/en/faq` | `/fr/questions-frequentes` | `/de/haufige-fragen` | `/pt/perguntas-frequentes` | `/ca/preguntes-frequents` |
| `book` | `/es/agendar` | `/en/book` | `/fr/reserver` | `/de/buchen` | `/pt/agendar` | `/ca/agendar` |
| `service_llc_nm` | `/es/servicios/llc-nuevo-mexico` | `/en/services/llc-new-mexico` | `/fr/services/llc-nouveau-mexique` | `/de/leistungen/llc-new-mexico` | `/pt/servicos/llc-novo-mexico` | `/ca/serveis/llc-nou-mexic` |
| `service_llc_wy` | `/es/servicios/llc-wyoming` | `/en/services/llc-wyoming` | `/fr/services/llc-wyoming` | `/de/leistungen/llc-wyoming` | `/pt/servicos/llc-wyoming` | `/ca/serveis/llc-wyoming` |
| `service_llc_de` | `/es/servicios/llc-delaware` | `/en/services/llc-delaware` | `/fr/services/llc-delaware` | `/de/leistungen/llc-delaware` | `/pt/servicos/llc-delaware` | `/ca/serveis/llc-delaware` |
| `service_llc_fl` | `/es/servicios/llc-florida` | `/en/services/llc-florida` | `/fr/services/llc-floride` | `/de/leistungen/llc-florida` | `/pt/servicos/llc-florida` | `/ca/serveis/llc-florida` |
| `service_itin` | `/es/servicios/obten-tu-itin` | `/en/services/get-your-itin` | `/fr/services/obtiens-ton-itin` | `/de/leistungen/hol-deine-itin` | `/pt/servicos/obtenha-seu-itin` | `/ca/serveis/obte-el-teu-itin` |
| `legal_terms` | `/es/legal/terminos` | `/en/legal/terms` | `/fr/legal/conditions` | `/de/legal/agb` | `/pt/legal/termos` | `/ca/legal/termes` |
| `legal_privacy` | `/es/legal/privacidad` | `/en/legal/privacy` | `/fr/legal/confidentialite` | `/de/legal/datenschutz` | `/pt/legal/privacidade` | `/ca/legal/privacitat` |
| `legal_cookies` | `/es/legal/cookies` | `/en/legal/cookies` | `/fr/legal/cookies` | `/de/legal/cookies` | `/pt/legal/cookies` | `/ca/legal/cookies` |
| `legal_refunds` | `/es/legal/reembolsos` | `/en/legal/refunds` | `/fr/legal/remboursements` | `/de/legal/erstattungen` | `/pt/legal/reembolsos` | `/ca/legal/reemborsaments` |
| `legal_disclaimer` | `/es/legal/disclaimer` | `/en/legal/disclaimer` | `/fr/legal/avertissement` | `/de/legal/haftungsausschluss` | `/pt/legal/aviso-legal` | `/ca/legal/avis-legal` |

Rutas dinámicas adicionales:
- `/:lang/blog` · 6 locales índice blog
- `/:lang/blog/:slug` · 111 artículos × 6 idiomas = 666 páginas
- `/booking/:bookingId?token=...` · gestión de cita (noindex)
- `/start`, `/go/*`, `/links` · CTAs privados (noindex)

**Total URLs indexables**: 96 canónicas + 666 blog + 6 FAQ = **768**.

---

## 2. Páginas (24 archivos `.tsx`)

Source: `exentax-web/client/src/pages/`.

| Archivo | Lazy-loaded | Propósito |
|---|---|---|
| `home.tsx` | sí | Landing principal |
| `services.tsx` | sí | Hub servicios + lazy-import `services-sections.tsx` |
| `services-sections.tsx` | sí (desde services) | Secciones expandidas — NO dead code |
| `how-we-work.tsx` | sí | Proceso 4 fases |
| `faq-page.tsx` | sí | FAQ página, lazy-importa `<FAQ>` |
| `book.tsx` | sí | Formulario reserva + calendario |
| `about-llc.tsx` | sí | Explicación LLC |
| `booking.tsx` | sí | Gestión cita existente (manage token) |
| `start.tsx` | sí | Flujo CTA privado |
| `go.tsx` | sí | Redirect CTA privado |
| `not-found.tsx` | sí | 404 |
| `legal/terms.tsx` | sí | Términos y condiciones |
| `legal/privacy.tsx` | sí | Política privacidad |
| `legal/cookies.tsx` | sí | Política cookies |
| `legal/refunds.tsx` | sí | Política reembolsos |
| `legal/disclaimer.tsx` | sí | Aviso legal |
| `services/llc-new-mexico.tsx` | sí | Stub (delega a `ServiceSubpage`) |
| `services/llc-wyoming.tsx` | sí | Stub |
| `services/llc-delaware.tsx` | sí | Stub |
| `services/llc-florida.tsx` | sí | Stub |
| `services/itin.tsx` | sí | Stub |
| `services/ServiceSubpage.tsx` | sí | Layout compartido 5 servicios |
| `blog/index.tsx` | sí | Índice blog por idioma |
| `blog/post.tsx` | sí | Renderer individual artículo |

---

## 3. Componentes (44 archivos `.tsx`)

Source: `exentax-web/client/src/components/`.

**Layout** (estructura):
- `layout/Navbar.tsx` · nav principal (499 LoC)
- `layout/Footer.tsx` · footer + newsletter
- `layout/NavbarFunnel.tsx` · nav reducida para funnels
- `layout/LegalLayout.tsx` · wrapper Liquid Glass legal pages

**Sections** (bloques página):
- `sections/Hero.tsx` · hero landing
- `sections/FAQ.tsx` · FAQ con filtros
- `sections/HomeFAQ.tsx` · teaser home
- `sections/FaqAccordionList.tsx` · accordion reutilizable
- `sections/AccordionItem.tsx` · ítem atómico
- `sections/faq-data.tsx` · lógica FAQ
- `sections/Testimonials.tsx` · carousel testimonios
- `sections/BanksCarousel.tsx` · carousel partners banca
- `sections/ExistingLlcCallout.tsx` · CTA llc existente

**Forms / Inputs**:
- `PhoneInput.tsx` · selector código país + tel
- `BookingCalendar.tsx` · calendario reserva (942 LoC, lazy)
- `EmailGateForm.tsx` · gate email calculator
- `calculator/index.tsx` · calculator fiscal (678 LoC, lazy)

**Utilities / UX**:
- `SEO.tsx` · meta tags + hreflang BCP-47
- `LanguageSwitcher.tsx` · selector idioma
- `FlagImg.tsx`, `CountryFlagImg.tsx` · banderas
- `CookieBanner.tsx` · consent banner RGPD
- `Tracking.tsx` · GA4 + Meta Pixel
- `InlineMessage.tsx` · success/error/info inline
- `icons.tsx` · SVG custom centralizados (WhatsAppIcon, CalendarIcon, etc.)
- `blog/CountryDropdown.tsx` · selector país blog
- `blog/CategoryBadge.tsx` · badge categoría

---

## 4. Endpoints API (20+ activos)

Source: `exentax-web/server/routes/public.ts`.

| Método | Path | Rate limit | Auth |
|---|---|---|---|
| GET | `/api/health` | none (probe) | none |
| GET | `/api/health/ready` | none | none |
| GET | `/api/metrics` | none | none (internal) |
| GET | `/api/client-errors` | none | none |
| POST | `/api/discord/interactions` | none (Ed25519 verify) | signature |
| GET | `/api/bookings/slots` | `bookingManage` | token |
| POST | `/api/bookings/book` | `booking` 5/h/IP | none (public) |
| GET | `/api/booking/:bookingId` | `bookingManage` 30/h/IP | token |
| POST | `/api/booking/:bookingId/reschedule` | `bookingManage` | token |
| POST | `/api/booking/:bookingId/cancel` | `bookingManage` | token |
| POST | `/api/calculator-leads` | `calc` 10/h/IP | none (public) |
| POST | `/api/newsletter/subscribe` | `newsletter` 3/h/IP | none (public) |
| GET | `/api/newsletter/unsubscribe/:token` | `publicData` 60/min/IP | token |
| POST | `/api/consent` | `consent` 20/min (silent) | none |
| POST | `/api/visitor` | `visitor` 30/min/IP | none |
| GET | `/api/legal/versions` | `publicData` 60/min/IP | none |
| GET | `/sitemap.xml` | cache 5 min | none |
| GET | `/sitemap-pages.xml` | cache 5 min | none |
| GET | `/sitemap-blog.xml` | cache 5 min | none |
| GET | `/sitemap-faq.xml` | cache 5 min | none |
| GET | `/robots.txt` | cache 24h | none |

---

## 5. Scripts npm (36)

Source: `exentax-web/package.json:scripts`.

**Build/Run** (4):
- `dev`, `build`, `start`, `check`

**Tests E2E + unit** (11):
- `test:bundle-diff-notify`
- `test:seo-check`, `test:seo-slash`
- `test:lint-blog`, `test:orphan-detect`, `test:audit-faqs`
- `test:calculator` (sin DB)
- `test:newsletter`, `test:booking` (Postgres real requerido)
- `test:discord-neon`, `test:indexnow`

**Audit / SEO** (7):
- `audit:bundle`, `audit:bundle:fast`, `audit:bundle:diff`
- `seo:masterpiece-strict`, `seo:check`, `seo:slash`, `seo:meta`

**Lint** (5):
- `lint:typography` · Regla 0 tipografía
- `lint:stray-reports` · no reports sueltos en raíz
- `lint:brand-casing` · "Exentax" correcto
- `lint:pt-pt` · sin brasileñismos
- `lint:blog` · precios/address + CTA position + translation quality

**Blog** (3):
- `blog:validate-all`, `blog:final-qa`, `blog:restructure`

**i18n** (3):
- `i18n:validate`, `i18n:generate-types`, `i18n:check`

**DB** (2):
- `db:push`, `db:generate`

---

## 6. Scripts físicos (64 activos + 63 archivados)

Source: `exentax-web/scripts/` y `exentax-web/scripts/archive/`.

**Convención**: scripts archivados viven en `scripts/archive/<date-task>/`.
Nunca referenciar scripts archivados desde package.json o runtime
(verified en `AGENT-RULES.md §8`).

**Activos top-level**: 64 ficheros (.mjs + .ts). Propósitos:
- `blog-*` · validación blog content (20+ scripts)
- `seo-*` · validación SEO links/slash/meta/sitemap
- `audit-*` · auditorías CI (audit-pt-pt, audit-system-seo-faqs,
  audit-bundle, audit-markdown-quality)
- `check-*` · linters (typography, stray-reports, brand-casing)
- `build.ts` · build orchestrator
- `test-*` · E2E guards (booking, newsletter, discord, indexnow,
  calculator)
- `seo/` · subfolder con `verify-meta.ts` y `lighthouse-sample-30.mjs`

**Archivados** (63 ficheros en `scripts/archive/`):
- `2026-04-task4/` · Task 4 one-shots (ctas, inline-markers, related-validate)
- `2026-04-task36/` · Task 36 one-shots (CTA injection, dedup)
- etc. Nunca tocar ni referenciar.

---

## 7. Tests disponibles

**Unit** (sin DB):
- `client/src/lib/calculator.test.ts` · 123/123 asserts ·
  `DATABASE_URL=postgresql://test:test@localhost/test npx tsx ...`

**E2E** (requieren Postgres + envs):
- `scripts/test-booking-e2e.ts` · booking flow (Postgres + booking
  token)
- `scripts/test-newsletter-e2e.ts` · newsletter + unsubscribe
- `scripts/test-discord-e2e-neon.mjs` · no-token-leak en Discord
- `scripts/test-indexnow-e2e.mjs` · IndexNow ping flow

**Playwright specs** (`tests/`):
- `discord-no-token-leak.test.ts`
- `discord-event-notifications.test.ts`
- `admin-api-removed.test.ts`
- `blog-no-inline-related.test.ts`
- `ga4-events.spec.ts`

---

## 8. Integraciones externas

| Integración | Env vars | Archivos | Criticalidad |
|---|---|---|---|
| **PostgreSQL** | `DATABASE_URL` | `server/db.ts` · `shared/schema.ts` | P0 (requerido prod) |
| **Discord bot** | `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, `DISCORD_APP_ID`, `DISCORD_GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`, 7 × `DISCORD_CHANNEL_*` | `server/discord*.ts` | P0 (requerido prod) |
| **Google Calendar** | `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_CALENDAR_ID` | `server/google-meet.ts` · `google-calendar.ts` · `google-credentials.ts` | P1 (booking flow) |
| **Gmail** | `GOOGLE_SERVICE_ACCOUNT_KEY` | `server/email.ts` · `email-retry-queue.ts` | P1 (booking + newsletter) |
| **Google Indexing API** | `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_INDEXING_API_ENABLE=1` | `server/google-indexing.ts` | P3 (opt-in post-deploy) |
| **IndexNow** | none (self-hosted key) | `server/indexnow.ts` | P3 (post-deploy) |
| **GA4** | `VITE_GA4_MEASUREMENT_ID` en client | `client/src/components/Tracking.tsx` | P2 (analytics) |
| **Meta Pixel** | `VITE_META_PIXEL_ID` | idem | P2 (analytics) |
| **Redis** (opcional) | `REDIS_URL` | `server/lock-store.ts` | P3 (default in-memory) |
| **Field encryption** | `FIELD_ENCRYPTION_KEY` (32-byte hex) | `server/field-encryption.ts` | P0 (AES-256-GCM) |

---

## 9. Env vars (required vs optional)

**Requeridas en producción** (`server/index.ts:22-33`, fail-fast):
- `DATABASE_URL`
- `FIELD_ENCRYPTION_KEY` (64 hex chars)
- `GOOGLE_SERVICE_ACCOUNT_KEY` (JSON string)
- `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, `DISCORD_APP_ID`,
  `DISCORD_GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`
- `DISCORD_CHANNEL_REGISTROS`, `DISCORD_CHANNEL_AGENDA`,
  `DISCORD_CHANNEL_CONSENTIMIENTOS`

**Opcionales** (defaults sensatos):
- `DISCORD_CHANNEL_CALCULADORA`, `DISCORD_CHANNEL_ACTIVIDAD`,
  `DISCORD_CHANNEL_ERRORES`, `DISCORD_CHANNEL_AUDITORIA` (fallback a
  REGISTROS si faltan)
- `NODE_ENV`, `PORT` (default 5000)
- `LOG_LEVEL` (default info/debug)
- `DB_POOL_MAX` (default 10 dev / 25 prod)
- `REDIS_URL` (default in-memory)
- `EXTRA_ALLOWED_ORIGINS`
- `GOOGLE_CALENDAR_ID` (default primary)
- `SITE_URL`, `DOMAIN` (default https://exentax.com)
- `CONTACT_EMAIL`, `LEGAL_EMAIL`, `ADMIN_EMAIL`, `WHATSAPP_NUMBER`
- `INSTAGRAM_URL`, `TIKTOK_URL`, `LINKEDIN_URL`, `FACEBOOK_URL`,
  `YOUTUBE_URL`
- `GOOGLE_INDEXING_API_ENABLE=1` (opt-in)
- `INDEXING_AUDIT_DISABLE=1` (opt-out)

---

## 10. Documentos clave

Raíz repo:
- `AGENT-RULES.md` · **reglas irrompibles para agentes** (lectura obligatoria)
- `INVENTORY.md` · **este doc** (mapa consolidado)
- `WHAT-NOT-TO-TOUCH.md` · whitelist verde medida
- `DEFINITIVE-STATUS.md` · estado verde/rojo/gris
- `PENDING.md` · trabajo pendiente priorizado
- `CHANGELOG-SESSION.md` · cambios session-by-session
- `README.md` · visión general + deploy
- `ARCHITECTURE.md`, `CHANGELOG.md`, `AUDIT-REPORT.md`
- `PRODUCTION-READY-REPORT.md` · cierre Task #8
- `SEO-STRATEGY.md`, `TRANSLATION-GUIDE.md`
- `replit.md` · config Replit + memoria proyecto

`exentax-web/docs/`:
- `deploy/HOSTINGER-VPS.md` · guía deploy Hostinger
- `deploy/DISCORD-SETUP.md` · setup 7 canales Discord
- `blog/CONTENT-IMPROVEMENT-PLAN.md` · plan traducción 44 artículos
- `architecture-map.md` · mapa carpetas
- `data-flow.md` · flujos (lead, booking, newsletter)
- `security-audit.md`, `observability-audit.md`
- `i18n-check.md`, `audit-design-system.md`
- `seo/audit-2026.md`, `seo/url-slash-policy.md`, `seo/internal-linking.md`
- `seo/performance-audit.md`, `seo/blog-overhaul-2026.md`
- `blog/audit-2026.md`
- `EDITORIAL_GUIDE.md`

---

## Mantener este documento

Al añadir/eliminar:
- Ruta → actualizar sección 1
- Página → sección 2
- Componente → sección 3
- Endpoint API → sección 4
- npm script → sección 5
- Script físico → sección 6
- Test → sección 7
- Integración externa → sección 8
- Env var → sección 9
- Doc mayor → sección 10

Modificación requiere commit con métrica antes/después. Nunca commits
que cambien inventario sin actualizar este doc.
