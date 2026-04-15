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
- **Internationalization**: i18next (es, en, fr, de, pt, ca — 6 languages, Italian removed)
- **Security**: Helmet CSP/HSTS, CSRF origin check, rate limiting, AES-256-GCM field encryption

### Core Architectural Patterns
- **Public-Only Architecture**: No admin panel, no client portal, no login pages. Backend serves only public routes.
- **Booking System**: Consultation booking with Google Meet integration, email confirmations, reminders.
- **API Contract**: Uniform JSON `{ ok: true, data }` or `{ ok: false, error, code }` with Zod validation.
- **Timezone**: Booking calendar uses `Europe/Madrid` timezone.
- **Slot Locking**: In-memory promise chains (`withSlotLock()`) for preventing concurrent booking modifications.
- **Storage Error Handling**: Centralized `wrapStorageError` for consistent error reporting.
- **Field Encryption**: AES-256-GCM encryption for sensitive fields (phone, address, etc.).
- **Circuit Breaker**: Email and Google Calendar calls protected by circuit breaker pattern.

### Database Tables (schema.ts)
- `leads` — Booking leads (note: `closed` column removed — was always false, never queried)
- `agenda` — Booking meetings
- `calculadora` — Tax calculator submissions
- `visitas` — Visitor tracking/analytics (note: `country` column removed — was always null)
- `newsletterSuscriptores` — Newsletter subscribers
- `diasBloqueados` — Blocked booking days
- `legalDocumentVersions` — Legal document version tracking

### Key Server Files
- `server/index.ts` — Express server, startup, reminder recovery
- `server/routes.ts` — Route registration, middleware
- `server/routes/public.ts` — All public API endpoints (booking, newsletter, calculator, SEO, sitemap)
- `server/routes/shared.ts` — App settings, i18n labels, helpers
- `server/email.ts` — Booking confirmation, reminder, reschedule, cancellation, calculator emails (Gmail API)
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
- **SEO meta**: `PAGE_META` (root `/` + `/blog` + individual blog posts) + `PAGE_META_I18N` (all page routes × all 6 languages, built via `buildI18nMeta()`). Server injects title/desc/canonical into HTML shell at serve time (production only).
- **SEO pre-render content**: `PAGE_SEO_CONTENT` keyed by route key (e.g., `"home"`, `"our_services"`) — hidden HTML for crawlers.
- **JSON-LD schemas**: `PAGE_SCHEMAS` keyed by route key — Organization, BreadcrumbList, Product, HowTo, Service, FAQPage schemas.
- **Sitemap**: Generated dynamically by `server/routes/public.ts` with full `hreflang` alternates for all 6 languages + x-default, including blog posts.
- **robots.txt**: Generated dynamically by server (no static file in `client/public/`).
- **No legacy redirects**: All old Spanish-only paths removed. Every route exists exactly once under `/:lang/:slug`.

### Key Frontend Files
- `client/src/App.tsx` — Public-only routes with lazy loading, no legacy redirects
- `client/src/pages/` — Landing pages, booking, legal, blog
- `client/src/components/layout/Navbar.tsx` — Public navbar (no client area)
- `client/src/components/icons.tsx` — Custom SVG icons (no external icon libs)
- `client/src/i18n/` — Internationalization (6 languages)
- `client/src/lib/routes.ts` — Centralized route key → localized slug mapping

### Integrations
- **Discord**: Webhook notifications for bookings, calculator leads, newsletter, critical errors (privacy-masked, rate-limited queue)
- **Google Sheets**: Append-only logging to Agenda, Calculadora, Consents sheets
- **Google Meet**: Calendar event creation/deletion for bookings
- **Email**: Gmail API v1 — booking confirmation, reminder (3h before), reschedule, cancellation, calculator results

## External Dependencies
- **Google APIs**: Gmail API v1 (emails), Google Calendar API (Meet events), Google Sheets API v4 (logging)
- **Deployment**: `npm run dev` starts Express + Vite on port 5000
