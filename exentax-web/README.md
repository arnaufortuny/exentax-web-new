# Exentax

Exentax is a bilingual (ES/EN + 5 more languages) SaaS platform that helps digital entrepreneurs—primarily Spanish-speaking freelancers and business owners—form and maintain U.S. LLCs, manage fiscal compliance, and optimise their tax position.

> **Documentation ownership**: This file owns the API reference, database schema, business flows, and endpoint inventory. For architecture, pending items, and change control, see the root `README.md`. For design system and dev preferences, see `replit.md`. See root `README.md` > "Documentation Ownership" for the full ownership table.

The application serves three audiences:

1. **Public visitors** — marketing site with tax calculator, booking system, blog, and service pages.
2. **Clients** — authenticated portal where they view their LLC(s), fiscal calendar, invoices, documents, and notifications.
3. **Admin team** — full back-office CRM covering leads, bookings, clients, LLCs, invoicing, fiscal alerts, analytics, newsletters, and user management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 7, Wouter (routing), TanStack Query v5, Tailwind CSS 3, i18next |
| Backend | Express 5 (ESM), TypeScript 5.6, tsx (dev runner) |
| Database | PostgreSQL via Drizzle ORM |
| Email | Gmail API (service account JWT delegation via `googleapis`) with branded HTML layout |
| Meetings | Google Calendar + Google Meet API |
| Build | esbuild (server bundle → `dist/index.cjs`), Vite (client → `dist/public/`) |
| Runtime | Node.js 20+ |

---

## File & Folder Structure

```
exentax-web/
├── client/                    # React SPA
│   └── src/
│       ├── components/        # Shared UI (BookingCalendar, CookieBanner, SEO, Layout, LanguageSwitcher, etc.)
│       ├── pages/
│       │   ├── home.tsx       # Landing page
│       │   ├── servicios.tsx  # Pricing / services
│       │   ├── como-funciona.tsx
│       │   ├── faq-page.tsx
│       │   ├── reservar.tsx   # Public booking page
│       │   ├── llc-estados-unidos.tsx
│       │   ├── booking.tsx    # Booking management (reschedule / cancel)
│       │   ├── links.tsx      # Link-in-bio page
│       │   ├── start.tsx      # Onboarding start page
│       │   ├── blog/          # Blog index + individual post pages
│       │   ├── legal/         # Terms, privacy, cookies, refunds, disclaimer
│       │   ├── admin/         # Admin dashboard (tabs, analytics, client management)
│       │   └── clientes/      # Client login + portal (tabs for LLC, calendar, invoices, docs)
│       ├── i18n/              # i18next config + locale TypeScript modules (es, en, fr, de, it, pt, ca)
│       ├── lib/               # queryClient, constants, utilities
│       └── App.tsx            # Root router
├── server/
│   ├── index.ts               # Express bootstrap, middleware stack, cron schedulers
│   ├── routes.ts              # Route registration hub, admin auth, CSRF, session logic
│   ├── routes/
│   │   ├── public.ts          # Booking, calculator, newsletter, visitor tracking, sitemap
│   │   ├── admin-core.ts      # Admin: blocked days, email, calculator, visitor data
│   │   ├── admin-core-auth.ts # Admin login/logout, user CRUD, audit logs
│   │   ├── admin-core-crm.ts  # Leads, agenda/booking management, Google Meet
│   │   ├── admin-core-analytics.ts  # Analytics, settings, business expenses
│   │   ├── admin-core-comisiones.ts # Commissions, ficha (lead/client profile lookup)
│   │   ├── admin-core-extracts.ts   # PDF/CSV export endpoints
│   │   ├── admin-core-stats.ts      # Dashboard statistics
│   │   ├── admin-clients.ts         # Registers all admin-clients-* sub-routers
│   │   ├── admin-clients-crud.ts    # Client CRUD, documents, timeline, password
│   │   ├── admin-clients-invoices.ts# Invoice CRUD, PDF generation, reminders, company entities
│   │   ├── admin-clients-llc.ts     # LLC CRUD, members, tax calendar, fiscal calendar generation
│   │   ├── admin-clients-alerts.ts  # Manual fiscal alert trigger, pending alerts
│   │   ├── admin-clients-comms.ts   # Client export, security logs, newsletter management
│   │   ├── client-auth.ts          # Client login (OTP + password), password reset
│   │   ├── client-portal.ts        # Client portal: profile, LLCs, invoices, calendar, documents, data export
│   │   ├── api-response.ts         # Standardised JSON response helpers
│   │   └── shared.ts               # Shared types (RouteContext, AdminRole, AdminUser, app settings)
│   ├── storage/               # Drizzle-based data access layer (split by domain)
│   │   ├── core.ts            # Generic helpers (generateId, upsert patterns)
│   │   ├── clients.ts         # Client queries
│   │   ├── llcs.ts            # LLC + member queries
│   │   ├── billing.ts         # Invoices + payments
│   │   ├── scheduling.ts      # Agenda / bookings
│   │   ├── marketing.ts       # Leads, calculator, visitors, newsletter, commissions
│   │   ├── documents.ts       # Document + file queries
│   │   ├── auth.ts            # Tokens, login attempts, revoked sessions, admin users
│   │   ├── accounting.ts      # Business expenses, fiscal calendar, fiscal alerts
│   │   └── index.ts           # Re-exports all storage functions
│   ├── fiscal-alert-engine.ts # Scheduled fiscal deadline & LLC renewal alert engine
│   ├── server-constants.ts    # Fiscal calendar definitions, alert schedules, helper functions
│   ├── email.ts               # Gmail API send wrapper
│   ├── email-layout.ts        # Branded HTML email template builder
│   ├── email-i18n.ts          # Email language resolution
│   ├── google-credentials.ts  # Google OAuth credential loader
│   ├── google-meet.ts         # Google Calendar event + Meet link creation
│   ├── google-utils.ts        # Google API shared utilities
│   ├── sanitize-middleware.ts # Auto-sanitise request body (XSS prevention)
│   ├── route-helpers.ts       # Rate limiters, CSRF check, file upload (multer), reminder scheduling
│   ├── file-encryption.ts     # AES-256-GCM encryption for uploaded documents
│   ├── circuit-breaker.ts     # Circuit breaker for external service calls
│   ├── logger.ts              # Structured logger
│   ├── db.ts                  # Drizzle + pg pool initialisation
│   ├── static.ts              # Production static file serving
│   ├── seo-content.ts         # SEO meta content per page
│   ├── pdf-fonts.ts           # Font loader for server-side PDF generation
│   └── vite.ts                # Vite dev server middleware
├── shared/
│   └── schema.ts              # Drizzle table definitions, Zod insert schemas, TypeScript types
├── script/
│   └── build.ts               # Production build script (esbuild + Vite)
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

### Core Business Tables

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `clientes` | Client profiles (contact, LLC status, consent, billing prefs) | PK `id`; linked by `leads.clientId` |
| `llcs` | U.S. LLC entities | FK `clientId` → `clientes.id` (SET NULL) |
| `llc_miembros` | LLC members / owners | FK `llcId` → `llcs.id` (CASCADE), FK `clientId` → `clientes.id` (SET NULL) |
| `facturas` | Invoices | FK `clientId` → `clientes.id` (SET NULL), FK `llcId` → `llcs.id` (SET NULL) |
| `pagos` | Payments against invoices | FK `clientId` → `clientes.id` (SET NULL), FK `invoiceId` → `facturas.id` (SET NULL) |
| `leads` | Sales leads / prospects | FK `clientId` → `clientes.id` (SET NULL) |
| `agenda` | Booking / consultation appointments | Standalone; matched to leads/clients by email |
| `comisiones` | Referral commissions | Unique on `leadId` |

### Fiscal Compliance

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `calendario_fiscal` | Tax obligations calendar per LLC | FK `llcId` → `llcs.id` (CASCADE), FK `clientId` → `clientes.id` (CASCADE) |
| `alertas_fiscales` | Sent fiscal alert records | FK `llcId`, `clientId`, `taxCalendarId` (all CASCADE) |

### Documents & Communication

| Table | Purpose |
|-------|---------|
| `documentos` | Client/LLC document metadata (files encrypted on disk) |
| `emails` | Email send log |
| `notificaciones` | In-app client notifications |
| `newsletter_suscriptores` | Newsletter subscriber list |
| `newsletter_campanas` | Newsletter campaign history |

### Analytics & Tracking

| Table | Purpose |
|-------|---------|
| `calculadora` | Tax calculator submissions |
| `visitas` | Page visit / analytics tracking |
| `consentimientos` | GDPR consent records |

### Auth & Security

| Table | Purpose |
|-------|---------|
| `tokens` | Session tokens, OTP codes, password reset tokens |
| `login_attempts` | Login attempt audit trail |
| `revoked_admin_sessions` | Revoked admin session IDs |
| `admin_users` | Admin user accounts (username, role, password hash) |
| `audit_logs` | Admin action audit log |

### Other

| Table | Purpose |
|-------|---------|
| `timeline` | Per-client event timeline |
| `dias_bloqueados` | Blocked booking dates |
| `gastos_negocio` | Business expenses for internal accounting |

---

## API Endpoint Reference

API endpoints are prefixed with `/api/`. A few server-rendered routes (`/sitemap.xml`, `/robots.txt`) are served directly.

### Public Endpoints (no auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check (DB connectivity) |
| GET | `/api/bookings/blocked-days` | Blocked dates for booking calendar |
| GET | `/api/bookings/config` | Booking configuration (available hours, etc.) |
| GET | `/api/bookings/available-slots` | Available time slots for a given date |
| POST | `/api/bookings/book` | Create a new booking |
| GET | `/api/booking/:bookingId` | Retrieve booking details by manage token |
| POST | `/api/booking/:bookingId/reschedule` | Reschedule an existing booking |
| POST | `/api/booking/:bookingId/cancel` | Cancel a booking |
| POST | `/api/calculator-leads` | Submit tax calculator results (creates lead) |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| GET | `/api/newsletter/unsubscribe/:token` | Unsubscribe from newsletter |
| POST | `/api/visitor` | Track page visit |
| POST | `/api/consent` | Record GDPR consent |
| GET | `/api/seo/page-meta` | SEO metadata for a page |
| GET | `/sitemap.xml` | Dynamic sitemap |
| GET | `/robots.txt` | Robots file |

### Client Portal Endpoints (`/api/clientes/*`)

**Auth (no session required):**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/clientes/request-access` | Request OTP login code |
| POST | `/api/clientes/verify-access` | Verify OTP code and create session |
| POST | `/api/clientes/login-password` | Password-based login |
| POST | `/api/clientes/resend-code` | Resend OTP code |
| POST | `/api/clientes/reset-password` | Request password reset |

**Authenticated (session cookie `exentax_client`):**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clientes/me` | Current client profile + LLCs + calendar + invoices |
| PATCH | `/api/clientes/profile` | Update client profile |
| POST | `/api/clientes/change-password` | Change password |
| POST | `/api/clientes/logout` | Logout |
| GET | `/api/clientes/llcs` | Client's LLCs |
| GET | `/api/clientes/llcs/:llcId/members` | LLC members |
| GET | `/api/clientes/calendar` | Fiscal calendar entries |
| GET | `/api/clientes/invoices` | Client invoices |
| GET | `/api/clientes/invoices/csv` | Export invoices as CSV |
| GET | `/api/clientes/invoices/:id/pdf` | Download invoice PDF |
| POST | `/api/clientes/invoices/:id/send-email` | Email invoice to a recipient |
| POST | `/api/clientes/invoices/:id/send-receipt` | Send payment receipt |
| POST | `/api/clientes/invoices/:id/send-reminder` | Send payment reminder |
| GET | `/api/clientes/payments` | Payment history |
| GET | `/api/clientes/documents/download/:docId` | Download encrypted document |
| GET | `/api/clientes/export-data` | GDPR data export |
| GET | `/api/clientes/security` | Security info (login history) |

### Admin Endpoints (`/api/admin/*`)

All admin endpoints require the `exentax_admin` session cookie. Access levels vary by role.

**Auth & Users (superadmin only for user management):**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/me` | Current admin user info |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/users` | List admin users |
| POST | `/api/admin/users` | Create admin user |
| PATCH | `/api/admin/users/:username` | Update admin user |
| DELETE | `/api/admin/users/:username` | Delete admin user |
| GET | `/api/admin/audit-logs` | Audit log history |

**CRM — Leads & Bookings:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/leads` | List leads |
| POST | `/api/admin/leads` | Create lead manually |
| PATCH | `/api/admin/leads/:id` | Update lead |
| DELETE | `/api/admin/leads/:id` | Delete lead |
| GET | `/api/admin/agenda` | List bookings |
| PATCH | `/api/admin/agenda/:id` | Update booking |
| DELETE | `/api/admin/agenda/:id` | Delete booking |
| POST | `/api/admin/agenda/:id/reschedule-email` | Send reschedule email |
| POST | `/api/admin/agenda-manual` | Create manual booking |
| POST | `/api/admin/meet` | Create Google Meet link |
| DELETE | `/api/admin/meet/:eventId` | Delete Google Calendar event |

**Clients:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/clients` | List all clients |
| POST | `/api/admin/clients` | Create client (optionally from lead) |
| PATCH | `/api/admin/clients/:id` | Update client |
| DELETE | `/api/admin/clients/:id` | Delete client (cascades) |
| PATCH | `/api/admin/clients/:id/block` | Block/unblock client |
| POST | `/api/admin/clients/:id/set-password` | Set client password |
| POST | `/api/admin/clients/:id/timeline` | Add timeline event |
| POST | `/api/admin/clients/:id/documents` | Add document metadata |
| POST | `/api/admin/clients/:id/documents/upload` | Upload encrypted document file |
| GET | `/api/admin/clients/:id/documents` | List client documents |
| DELETE | `/api/admin/documents/:docId` | Delete document |
| GET | `/api/admin/clients/:id/consent` | View consent records |

**LLCs & Fiscal Calendar:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/llcs` | List all LLCs |
| GET | `/api/admin/clients/:id/llcs` | LLCs for a client |
| POST | `/api/admin/llcs` | Create LLC |
| PATCH | `/api/admin/llcs/:id` | Update LLC |
| DELETE | `/api/admin/llcs/:id` | Delete LLC |
| GET | `/api/admin/llcs/:id/members` | List LLC members |
| POST | `/api/admin/llcs/:id/members` | Add LLC member |
| PATCH | `/api/admin/llcs/:llcId/members/:memberId` | Update member |
| DELETE | `/api/admin/llcs/:llcId/members/:memberId` | Remove member |
| GET | `/api/admin/tax-calendar` | Tax calendar entries |
| POST | `/api/admin/tax-calendar` | Create calendar entry |
| PATCH | `/api/admin/tax-calendar/:id` | Update calendar entry |
| DELETE | `/api/admin/tax-calendar/:id` | Delete calendar entry |
| POST | `/api/admin/llcs/:id/generate-calendar` | Auto-generate fiscal calendar for LLC |
| GET | `/api/admin/llcs/:id/documents` | LLC documents |
| POST | `/api/admin/llcs/:id/documents` | Add LLC document |

**Invoicing & Billing:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/invoices` | Create invoice |
| PATCH | `/api/admin/invoices/:id` | Update invoice |
| DELETE | `/api/admin/invoices/:id` | Delete invoice |
| GET | `/api/admin/invoices/csv` | Export invoices CSV |
| GET | `/api/admin/invoices/:id/pdf` | Generate invoice PDF |
| POST | `/api/admin/invoices/batch-pdf` | Batch PDF generation |
| POST | `/api/admin/invoices/:id/send-reminder` | Send payment reminder email |
**Analytics, Settings & Exports:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/analytics` | Revenue, commission, and lead analytics |
| GET | `/api/admin/settings` | App settings |
| PATCH | `/api/admin/settings` | Update app settings |
| GET | `/api/admin/calculadora` | Calculator submissions |
| GET | `/api/admin/visitas` | Page visit data |
| GET/POST/PATCH/DELETE | `/api/admin/gastos-negocio/*` | Business expenses CRUD |
| GET | `/api/admin/comisiones` | Commissions list |
| PATCH | `/api/admin/comisiones/:id/toggle-status` | Toggle commission status |
| GET | `/api/admin/ficha/:email` | Lead/client profile lookup by email |
| Various | `/api/admin/*/extract/pdf`, `/api/admin/*/extract/csv` | PDF/CSV export for leads, bookings, invoices, expenses, etc. |

**Communication & Security:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/email` | Send ad-hoc email |
| GET | `/api/admin/newsletter/subscribers` | Newsletter subscribers |
| DELETE | `/api/admin/newsletter/subscribers/:email` | Remove subscriber |
| GET | `/api/admin/newsletter/campaigns` | Campaign history |
| POST | `/api/admin/newsletter/send` | Send newsletter campaign |
| GET | `/api/admin/clients/export/csv` | Export clients CSV |
| GET | `/api/admin/clients/export/pdf` | Export clients PDF |
| GET | `/api/admin/clients-stats` | Client aggregate stats |
| GET | `/api/admin/security/logs` | Security / login attempt logs |
| DELETE | `/api/admin/security/logs` | Purge security logs |
| GET | `/api/admin/security/logs/export` | Export security logs |
| GET | `/api/admin/audit-logs/export` | Export audit logs |

**Fiscal Alerts:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/fiscal-alerts/pending` | Pending fiscal alerts |
| POST | `/api/admin/fiscal-alerts/run` | Manually trigger fiscal alert scan |

---

## Authentication & Authorization

### Client Sessions

1. Client requests access via email → receives a 6-digit OTP code (or logs in with password if set).
2. OTP verified → server creates a signed session token stored in the `tokens` table and set as an `exentax_client` HttpOnly cookie.
3. Token is HMAC-signed with `SESSION_SECRET`; expiration is checked on every request.
4. Blocked clients are rejected with a 403 and their cookie is cleared.

### Admin Sessions

1. Admin logs in with username + password (bcrypt-hashed).
2. Server creates an HMAC-signed session token: `sessionId:expires:username:role:signature` set as `exentax_admin` HttpOnly cookie.
3. Sessions last 7 days; revocation is tracked both in-memory and in the `revoked_admin_sessions` table.
4. Per-user session invalidation is supported (all sessions for a user can be revoked at once).

### Admin RBAC Roles

| Role | Access Level |
|------|-------------|
| `superadmin` | Full access including user management, audit logs, security logs |
| `admin` | Full CRM and client management, invoicing, LLCs, analytics |
| `soporte` | Client list (read), document access |
| `marketing` | Leads, bookings, calculator data, commissions |

Middleware helpers: `requireAdmin` (any role), `requireFullAdmin` (admin/superadmin), `requireSuperAdmin`, `requireRole(...roles)`.

### Security Measures

- CSRF origin checking on all mutating API requests
- Auto-sanitisation of request bodies (XSS prevention)
- Rate limiting: 200 requests/minute per IP on `/api/` routes; additional per-IP rate limit on client data endpoints
- ID override stripping on PATCH/PUT/POST bodies
- HMAC token signing with timing-safe comparison
- AES-256-GCM encryption for uploaded document files
- Helmet.js CSP, HSTS, and security headers
- Login attempt logging with IP and user-agent tracking

---

## Business Flows

### Lead → Client → LLC Conversion

1. **Lead capture**: Visitor submits the tax calculator or books a consultation → a `leads` record is created with source tracking.
2. **Booking lifecycle**: Lead books a call → `agenda` record created → Google Calendar event + Meet link auto-generated → reminder email 3h before → no-show detection after meeting time → follow-up/reschedule email sent automatically.
3. **Lead closure**: Admin marks lead as closed, optionally setting a close date and product.
4. **Client creation**: Admin creates a client from a lead (POST `/api/admin/clients` with `leadId`) → lead data is copied, `leads.clientId` is linked, timeline event logged, welcome email sent.
5. **LLC registration**: Admin creates an LLC linked to the client → fiscal calendar auto-generated based on state (Wyoming/Delaware/Florida/Texas), member count (single vs. multi-member), and incorporation date.

### Booking Lifecycle

```
Visitor books slot → Agenda created (pending)
  → Google Meet event created
  → Confirmation email sent
  → Lead auto-created or linked
  → Reminder email scheduled (3h before)
  → Meeting time passes:
      ├─ Admin marks contacted / in_progress / closed
      └─ No-show detected → status set to "no_show" → reschedule email sent
  → Admin can reschedule → new Meet link → status "rescheduled"
  → Visitor can self-reschedule or cancel via manage token URL
```

### Fiscal Calendar Generation

When an LLC is created or at the start of each year (auto-renewal cron):

1. Determine LLC characteristics: state, single vs. multi-member, incorporation date.
2. Generate applicable obligations:
   - **IRS forms**: 5472 + 1120 (single-member) or 1065 (multi-member) — skipped in incorporation year.
   - **State reports**: Annual Report (WY: anniversary month, DE: June 1, FL: May 1), Franchise Tax (TX: May 15).
   - **Standing obligations**: Registered Agent renewal (Feb 20), Exentax renewal (Feb 20), BOI Report (Jan 1).
3. Obligations whose deadlines fall before the incorporation date are excluded.
4. The auto-renewal cron runs daily and creates entries for the current year if none exist.

### Email Alert Engine

The fiscal alert engine runs twice daily (and once on startup after 30s delay):

**Client alerts** at 30, 14 (IRS only), 10, 3, and 1 day(s) before deadline:
- Personalised emails sent to the client and all LLC members.
- Urgency prefix (🔴/🟠/⚠️) based on days remaining.
- Multilingual (7 languages) based on client preference.

**Internal alerts** at 45 and 15 days before deadline:
- Sent to admin email and configured notify recipients.
- Include action recommendations.

**LLC renewal alerts** at 30, 14, 7, 3, and 1 day(s) before annual report or registered agent renewal due dates.

All sent alerts are recorded in `alertas_fiscales` to prevent duplicates (matched by `daysBefore` threshold with ±1 day tolerance).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Always | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Always | Password for the owner admin account |
| `SESSION_SECRET` | Production | Random 64+ character string for HMAC session signing |
| `DOCUMENT_ENCRYPTION_KEY` | Production | 64 hex characters (32 bytes) for AES-256-GCM document encryption |
| `FIELD_ENCRYPTION_KEY` | Production | 64 hex characters (32 bytes) for AES-256-GCM field encryption (EIN, IBAN, phone) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | For email/calendar | Google service account JSON key (must include `client_email` and `private_key`) — used for Gmail API (JWT delegation) and Google Calendar/Meet |
| `GOOGLE_CALENDAR_ID` | For calendar/Meet | Google Calendar ID for meeting events (default: `hola@exentax.com`) |
| `NODE_ENV` | — | `development` or `production` |
| `PORT` | — | Server port (default: 5000) |
| `SITE_URL` | — | Public site URL (default: `https://exentax.com`) |
| `DOMAIN` | — | Domain name (default: `exentax.com`) |
| `CONTACT_EMAIL` | — | Contact email (default: `hola@exentax.com`) |
| `LEGAL_EMAIL` | — | Legal contact email (default: `legal@exentax.com`) |
| `ADMIN_EMAIL` | — | Admin notification email (default: `arnau@exentax.com`) |
| `OWNER_USERNAME` | — | Owner admin username (default: `arnau`) |
| `WHATSAPP_NUMBER` | — | WhatsApp number for CTA links |
| `COMMISSION_RATE` | — | Referral commission rate (default: 0.15) |
| `COMPANY_ADDRESS_SHORT` | — | Company address shown in emails |

---

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Running Locally

```bash
cd exentax-web
npm install
npm run dev
```

This starts the Express server (with Vite dev middleware for HMR) on port 5000. The Vite dev server proxies through Express—there is no separate frontend port.

### Database

The project uses Drizzle ORM with `drizzle-kit` for schema management. Tables are defined in `shared/schema.ts`. On startup, the server auto-creates the `facturas_numero_seq` sequence for auto-incrementing invoice numbers.

### Build for Production

```bash
npm run build    # Bundles server (esbuild → dist/index.cjs) + client (Vite → dist/public/)
npm run start    # Runs the production bundle
```

### Type Checking

```bash
npm run check    # tsc --noEmit
```

---

## Deployment Notes

- The production build outputs a single CJS bundle (`dist/index.cjs`) that serves both the API and the static frontend from `dist/public/`.
- `SESSION_SECRET` and `DOCUMENT_ENCRYPTION_KEY` are **required** in production; the server will exit if they are missing.
- Sitemap pings (Google + Bing) are sent automatically on production startup.
- The server sets `trust proxy: 1` for correct IP detection behind a reverse proxy.
- HSTS is enabled in production with a 2-year max-age and preload.
- Rate limiting uses in-memory maps (capped at 10,000 entries with automatic cleanup).

---

## Key Architectural Decisions

1. **Monorepo-lite structure**: Client, server, and shared code live in one `exentax-web/` directory with path aliases (`@/` for client, `@shared/` for shared). No workspace tooling—just TypeScript path mappings.

2. **Shared schema as single source of truth**: `shared/schema.ts` defines all Drizzle tables, Zod insert schemas, and TypeScript types used by both frontend and backend.

3. **Cookie-based sessions over JWTs**: Both admin and client sessions use HMAC-signed cookies rather than JWTs. This simplifies revocation (session IDs tracked in DB + in-memory map) and avoids token refresh complexity.

4. **Spanish-first bilingual DB columns**: Database column names use Spanish (`nombre`, `fecha_creacion`, etc.) while the TypeScript/Drizzle property names use English. This reflects the product's Spanish-market origin.

5. **Server-side PDF generation**: Invoices and data exports are rendered as PDFs on the server using a custom builder with embedded fonts, avoiding client-side PDF libraries.

6. **Fiscal calendar auto-generation**: Instead of manually creating tax obligations, the system generates them based on LLC attributes (state, member count, incorporation date) and auto-renews yearly via a cron job.

7. **Multi-tier alert scheduling**: Fiscal alerts use a tiered day-threshold system (30/10/3/1 for clients, 45/15 for internal) with deduplication to avoid alert fatigue while ensuring compliance deadlines are never missed.

8. **Document encryption at rest**: Uploaded documents are encrypted with AES-256-GCM before writing to disk, with the encryption key stored as an environment variable.

9. **Route modularisation**: Admin routes are split across ~12 files by domain (CRM, clients, LLCs, invoicing, analytics, etc.) to keep individual files manageable while sharing auth context.

10. **In-memory rate limiting and revocation**: Rate limits and session revocation use `Map` objects for performance, with periodic cleanup intervals and DB persistence for durability across restarts.
