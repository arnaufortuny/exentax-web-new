# Exentax Web

## Overview
Exentax Web is a public-facing TaxTech platform offering international LLC formation and tax consulting services. Its primary purpose is to provide a comprehensive online presence for Exentax, including landing pages, a consultation booking system with integrated video conferencing, a tax savings calculator, newsletter management, visitor analytics, and a multilingual, SEO-optimized blog. The platform aims to capture market share in international tax consulting by offering a seamless, secure, and user-friendly experience across six languages (Spanish, English, French, German, Portuguese, Catalan).

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
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Zod
- **Internationalization**: i18next (es, en, fr, de, pt, ca)

### Core Architectural Patterns
- **Multi-language Support**: Full i18n implementation for six languages across all content, routes, and emails.
- **Admin Panel**: Token-based access for managing bookings, no dedicated login.
- **Booking System**: Consultation scheduling with Google Meet integration, email notifications (confirmations, reminders, reschedules, cancellations), and robust state management (pending, rescheduled, cancelled, no_show, contacted, in_progress, closed). All date/time operations are anchored to `Europe/Madrid` timezone.
- **API Contract**: Standardized JSON responses (`{ ok: true, data }` or `{ ok: false, error, code }`) with Zod validation.
- **Concurrency Control**: In-memory slot and booking locking (`withSlotLock`, `withBookingLock`) to prevent race conditions during booking modifications.
- **Data Security**: AES-256-GCM field encryption for sensitive data (e.g., phone numbers) and CSRF protection.
- **Resilience**: Circuit breaker pattern implemented for external API calls (Email, Google Calendar) to enhance system stability.
- **SEO**: Comprehensive server-side rendering of SEO metadata (title, description, canonical, hreflang), dynamic sitemap generation, and localized JSON-LD schemas. Client-side `useLangPath` hook and `getLocalizedPath` function for consistent route management.
- **Discord Integration**: Multi-channel webhook notifications for various platform events (leads, calculator submissions, visits, bookings, errors) with strict formatting guidelines.
- **Email System**: Centralized Gmail API integration for all transactional emails, with 6 types of emails fully translated into 6 languages using a consistent Exentax brand layout.
- **Input Sanitization**: Global middleware to sanitize all incoming request data, preventing common injection attacks.
- **Rate Limiting**: Endpoint-specific rate limiting to protect against abuse.
- **Error Handling**: Consistent server-side error handling with masked user messages and detailed logging.
- **Blog Content Guard**: `exentax-web/scripts/blog-content-lint.mjs` (`npm run lint:blog` from `exentax-web/`) blocks reintroduction of forbidden price/fee/address mentions in the blog. It runs automatically in two places: (1) `scripts/post-merge.sh`, so every push/merge fails fast, and (2) `exentax-web/scripts/build.ts`, so every deploy is blocked if the guard fails. Script output is streamed to the author so offending lines are visible.
- **Newsletter E2E Guard**: `exentax-web/scripts/test-newsletter-e2e.ts` exercises the full newsletter flow (subscribe + RGPD consent log + multi-language unsubscribe + invalid token handling) against a real Postgres database. The wrapper `exentax-web/scripts/run-newsletter-e2e.ts` (`npm run test:newsletter` from `exentax-web/`) boots the server on PORT 5051, polls `/api/health` until ready, runs the test, and tears the server down. It runs automatically in two places, mirroring the blog content guard: (1) `scripts/post-merge.sh`, so every push/merge fails fast, and (2) `exentax-web/scripts/build.ts`, so every deploy is blocked with a non-zero exit code if a regression is detected. The test seeds and cleans its own subscribers (`*@e2e.exentax.test`). There is no bypass: if `DATABASE_URL` is missing during the build, the build fails so the omission cannot be ignored.

## External Dependencies
- **Google APIs**: Gmail API v1 (email sending), Google Calendar API (Google Meet event management), Google Sheets API v4 (data logging).
- **Deployment**: Standard Node.js environment with Express for the backend and Vite for the frontend.