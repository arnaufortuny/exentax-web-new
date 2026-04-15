# Exentax Web

## Overview
Exentax Web is a public-facing TaxTech platform for international LLC formation and tax consulting. It provides landing pages, a consultation booking system integrated with Google Meet, a tax savings calculator, newsletter management, visitor analytics, and SEO-optimized blog content. The platform supports six languages (es, en, fr, de, pt, ca).

## User Preferences
- Iterative development with clear communication on major changes
- Language: Spanish (communication with user)
- NO UX changes without explicit user approval
- All implementations must use i18n
- Exentax design system is mandatory (`borderRadius: 9999`, neon green `#00E510`, dark mode solid black `#000000`, fonts: Space Grotesk (headings), Inter (body/UI)). NO external icon libraries — only custom SVGs from `components/icons.tsx`. NO emojis.
- Color theme: Red (`#DC2626`) for error/delete/negative states. Amber (`#D49A00`) for pending/in-progress states. Neon green (`#00E510`) for positive/active/success states. Neutral gray (`#6B7280`) for inactive/cancelled.
- Email templates: Neon green (`#00E510` / `#00C80E`) is the ONLY accent color. All email text uses Inter font (`F_STACK`).
- Verify structure before and after changes, all code must have error handling, debug automatically, never cause regressions
- ASSET PROTECTION: Do NOT regenerate, recompress, or modify image assets without explicit user consent

## System Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Wouter, TanStack Query v5
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: PostgreSQL via Drizzle ORM (uses `db:push`, not migrations)
- **Validation**: Zod
- **Internationalization**: i18next (es, en, fr, de, pt, ca — 6 languages)
- **Security**: Helmet CSP/HSTS, CSRF origin check, rate limiting, AES-256-GCM field encryption

### Core Architectural Patterns
- **Admin Panel**: Token-based URL access (no login page). `ADMIN_TOKEN` env var required. Access via `/admin/agenda/:bookingId?adminToken=TOKEN`. Discord admin links do NOT include the token (security hardening).
- **Booking System**: Consultation booking with Google Meet integration, email confirmations, reminders. States: pending → rescheduled/cancelled/no_show/contacted/in_progress/closed. All date comparisons use `todayMadridISO()`. Both admin and public reschedule check blocked days.
- **API Contract**: Uniform JSON `{ ok: true, data }` or `{ ok: false, error, code }` with Zod validation.
- **Timezone**: All booking date logic uses `Europe/Madrid` timezone via `todayMadridISO()` and `nowMadrid()`. Never use UTC `new Date()` for date comparisons.
- **Slot Locking**: In-memory promise chains (`withSlotLock()`) for preventing concurrent booking modifications. Single-instance; distributed lock (Redis) needed for multi-instance scaling.
- **Storage Error Handling**: Centralized `wrapStorageError` for consistent error reporting.
- **Field Encryption**: AES-256-GCM encryption for sensitive fields (phone). Requires `FIELD_ENCRYPTION_KEY` (64 hex chars / 32 bytes) in production.
- **Circuit Breaker**: Email and Google Calendar calls protected by circuit breaker pattern.

### Database Tables (schema.ts)
- `leads` — Booking leads
- `agenda` — Booking meetings
- `calculadora` — Tax calculator submissions
- `visitas` — Visitor tracking/analytics
- `newsletterSuscriptores` — Newsletter subscribers
- `diasBloqueados` — Blocked booking days
- `legalDocumentVersions` — Legal document version tracking

### Key Server Files
- `server/index.ts` — Express server, startup, reminder recovery
- `server/routes.ts` — Route registration, middleware
- `server/routes/public.ts` — All public API endpoints (booking, newsletter, calculator, SEO, sitemap)
- `server/routes/admin.ts` — Admin booking management (token auth, reschedule, cancel, no-show, emails)
- `server/routes/shared.ts` — App settings, i18n labels, helpers
- `server/email.ts` — 6 email types (booking confirmation, reminder, calculator, reschedule, cancellation, no-show) via Gmail API
- `server/email-i18n.ts` — Email translations for all 6 types × 6 languages (ES/EN/FR/DE/PT/CA)
- `server/email-layout.ts` — Email HTML components: emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote, infoCard, greenPanel, meetBlock, bulletList
- `server/google-meet.ts` — Google Meet event creation/deletion
- `server/storage/` — Database CRUD (scheduling.ts, marketing.ts, legal.ts, core.ts)
- `server/field-encryption.ts` — AES-256-GCM field-level encryption for phone fields (encrypt/decrypt/encryptSensitiveFields/decryptSensitiveFields)
- `server/circuit-breaker.ts` — Circuit breaker for external service calls (Google Calendar, Email)
- `server/server-constants.ts` — Single source of truth for all brand/URL constants (BRAND_NAME, SITE_URL, DOMAIN, social URLs, emails, langs, agenda statuses, timezone)
- `server/route-helpers.ts` — Rate limiters (booking, calc, newsletter, public, visitor), slot locking, CSRF, utilities

### Routing & SEO Architecture
- **Centralized route definitions**: `client/src/lib/routes.ts` (client) and `server/route-slugs.ts` (server) define localized slugs per route key per language (es/en/fr/de/pt/ca).
- **Route keys**: `home`, `our_services`, `how_we_work`, `faq`, `book`, `about_llc`, `legal_terms`, `legal_privacy`, `legal_cookies`, `legal_refunds`, `legal_disclaimer`.
- **`useLangPath` hook**: Accepts route keys or `/blog` paths, returns localized `/:lang/slug` paths for navigation.
- **`getLocalizedPath(key, lang)`**: Pure function for building localized paths (used in JSON-LD, sitemap, etc.).
- **SEO meta**: `PAGE_META` (root `/` + `/blog` + individual blog posts) + `PAGE_META_I18N` (all page routes × all 6 languages, built via `buildI18nMeta()`). Server injects title/desc/canonical/hreflang into HTML shell at serve time.
- **SEO pre-render content**: `PAGE_SEO_CONTENT` keyed by route key — hidden HTML for crawlers. Blog prerender uses localized content per language.
- **JSON-LD schemas**: `PAGE_SCHEMAS` keyed by route key — Organization, BreadcrumbList, Article, FAQPage schemas. Blog Article schemas use localized headlines/descriptions.
- **Sitemap**: Generated dynamically by `server/routes/public.ts` — 492 URLs total (all routes × 6 langs + all blog posts × 6 langs), full `hreflang` alternates + x-default.
- **robots.txt**: Generated dynamically by server — Disallows /api/, /links, /start, /booking/.
- **Hreflang**: Server replaces template hreflang tags per page using dynamic `HREFLANG_STRIP_RE` regex (no hardcoded domain). Client-side SEO.tsx also injects hreflang for SPA navigation.
- **Noindex**: Enforced for /start, /links, /booking/:token, /admin/ via both X-Robots-Tag header and meta robots content.
- **Skip-to-content**: Accessibility link in Layout.tsx (`#main-content`).
- **No legacy redirects**: All old Spanish-only paths removed. Every route exists exactly once under `/:lang/:slug`.

### Key Frontend Files
- `client/src/App.tsx` — Routes with lazy loading (public + admin), no legacy redirects
- `client/src/pages/` — Landing pages, booking, legal, blog
- `client/src/pages/admin/agenda.tsx` — Admin booking management page (no layout wrapper)
- `client/src/components/layout/Navbar.tsx` — Public navbar (no client area). Link arrays memoized with useMemo.
- `client/src/components/layout/Footer.tsx` — Public footer. Link/social arrays memoized with useMemo.
- `client/src/components/icons.tsx` — Custom SVG icons (no external icon libs)
- `client/src/i18n/` — Internationalization (6 languages, 1068 keys per locale)
- `client/src/lib/routes.ts` — Centralized route key → localized slug mapping

### Integrations
- **Discord**: Multi-channel webhook notifications (6 channels, rate-limited queue). Uses webhook native identity (name/avatar configured in Discord, no code overrides).
  - `DISCORD_WEBHOOK_REGISTROS` → Newsletter subscriptions, new leads
  - `DISCORD_WEBHOOK_CALCULADORA` → Calculator results with full financial data
  - `DISCORD_WEBHOOK_ACTIVIDAD` → Web visits (page, device, UTM, referrer, IP)
  - `DISCORD_WEBHOOK_AGENDA` → Booking created/rescheduled/cancelled/no-show with full details + admin/client links
  - `DISCORD_WEBHOOK_CONSENTIMIENTOS` → Cookie/privacy consent logs
  - `DISCORD_WEBHOOK_ERRORES` → Critical server errors (fallback to registros if not set)
  - Embed design: NO footer, NO author block, NO dividers — clean fields + timestamp only
  - Every embed includes "Registrado" field with full Madrid timestamp (dd/MM/yyyy HH:mm:ss Europe/Madrid)
  - Field helpers: `push()` for optional fields (hidden when empty), `pushAlways()` for operational fields (always visible with "—" fallback)
  - Colors: GREEN=#00E510 (new booking, calculator), TEAL=#1ABC9C (reschedule, newsletter), RED=#DC2626 (cancel), ORANGE=#F39C12 (no-show), PURPLE=#9B59B6 (leads), RED_INTENSE=#C0392B (errors), GREY=#95A5A6 (recurring visits)
  - CRITICAL: NO emojis, NO icons anywhere in Discord messages — plain text field names only
  - Admin links do NOT include admin token (security hardening)
  - Safety: field count capped at 25, field name/value truncated to Discord limits (256/1024 chars), stack traces excluded in production
- **Google Sheets**: Append-only logging to Agenda, Calculadora, Consents sheets
- **Google Meet**: Calendar event creation/deletion for bookings
- **Email**: Gmail API v1 — 6 email types × 6 languages:
  - Booking confirmation ("Tu asesoría está confirmada | {{date}} {{time}}")
  - Reminder ("Mañana vemos tu caso | {{time}}")
  - Calculator results ("Tu estimación fiscal | {{savings}}")
  - Reschedule ("Tu asesoría ha sido actualizada")
  - Cancellation ("Asesoría cancelada")
  - No-show reschedule ("No hemos podido coincidir hoy") — with rebook CTA + WhatsApp
  - Brand signature: "Exentax / Estructuración fiscal internacional / Banca, inversión y operativa global."

## Security
- **Input sanitization**: Global `autoSanitizeMiddleware` on all routes — escapes HTML, limits depth/keys, removes `__proto__`/`constructor`
- **CSRF**: Origin/Referer check on all non-GET requests to `/api/`
- **Rate limiting**: Per-endpoint (booking: 5/hr, calc: 10/hr, newsletter: 3/hr, global: 200/min)
- **Admin auth**: `ADMIN_TOKEN` via header or query param, timing-safe comparison
- **Booking tokens**: 24 random bytes (hex), timing-safe comparison for manage links
- **Field encryption**: AES-256-GCM with unique IV per encryption, auth tag for integrity
- **Headers**: Helmet with CSP, HSTS (production), X-Content-Type-Options, X-Frame-Options
- **API responses**: 500 errors masked for users, full details logged server-side
- **ID injection prevention**: Global middleware deletes `id` from request body on POST/PATCH/PUT

## External Dependencies
- **Google APIs**: Gmail API v1 (emails), Google Calendar API (Meet events), Google Sheets API v4 (logging)
- **Deployment**: `npm run dev` starts Express + Vite on port 5000

## Production Audit (April 2026)
- **i18n**: 1068 keys × 6 locales — 0 missing, 0 extra, 0 empty, 0 unused. PASS.
- **TypeScript**: 0 errors across entire project.
- **Dead CSS**: 14 unused CRM/portal classes removed from index.css.
- **Dead code**: No dead files, functions, imports, or exports found across client and server.
- **Security hardening**: Admin token removed from Discord webhook links.
- **All server modules active**: discord, field-encryption, google-meet, google-sheets, google-credentials, google-utils, circuit-breaker, route-helpers, sanitize-middleware, rate-limit-store, all storage modules, all route modules, email system, static, seo-content.
- **All client modules active**: All components, hooks, pages, libs verified in use.
