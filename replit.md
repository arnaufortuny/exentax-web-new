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
- `server/routes/shared.ts` — App settings, i18n labels, helpers
- `server/email.ts` — Booking confirmation, reminder, reschedule, cancellation, calculator emails (Gmail API)
- `server/google-meet.ts` — Google Meet event creation/deletion
- `server/storage/` — Database CRUD (scheduling.ts, marketing.ts, legal.ts, core.ts)
- `server/field-encryption.ts` — AES-256-GCM field-level encryption
- `server/circuit-breaker.ts` — Circuit breaker for external service calls
- `server/server-constants.ts` — Shared constants (langs, agenda statuses, brand info, timezone)
- `server/route-helpers.ts` — Rate limiters (booking, calc, newsletter, public, visitor), slot locking, CSRF, utilities

### Key Frontend Files
- `client/src/App.tsx` — Public-only routes
- `client/src/pages/` — Landing pages, booking, legal, blog
- `client/src/components/layout/Navbar.tsx` — Public navbar (no client area)
- `client/src/components/icons.tsx` — Custom SVG icons (no external icon libs)
- `client/src/i18n/` — Internationalization (6 languages)

## External Dependencies
- **Google APIs**: Gmail API v1 (emails), Google Calendar API (Meet events)
- **Deployment**: `npm run dev` starts Express + Vite on port 5000
