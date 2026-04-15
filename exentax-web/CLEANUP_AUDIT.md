# Exentax Cleanup Audit Report

## Scope
Comprehensive audit of dead code, routes, i18n, Discord webhooks, booking/Google Sheets, security, performance, and documentation.

## Fixes Applied

### 1. Stale Italian (`it`) in language regexes — `server/static.ts`
- **Issue**: 5 regex patterns included `it` (Italian) which is NOT a supported language
- **Fix**: Removed `it|` from all regex patterns, now correctly matching `es|en|fr|de|pt|ca`
- **Lines**: 98, 208, 223, 240, 241

### 2. Duplicate `escapeHtml` function — `server/routes/public.ts`
- **Issue**: Local `escapeHtml` duplicated the one in `routes/shared.ts`
- **Fix**: Removed local definition, imported from `./shared`

### 3. Hardcoded Spanish string — `server/routes/public.ts`
- **Issue**: Newsletter privacy error used hardcoded Spanish: `"Debes aceptar la política de privacidad para continuar."`
- **Fix**: Replaced with `backendLabel("zodMustAcceptPrivacy", resolveRequestLang(req))`

### 4. Unused `maskSensitiveField` export — `server/field-encryption.ts`
- **Issue**: Function exported but never imported anywhere
- **Fix**: Removed entirely

### 5. Unused `fmt` function — `server/email-layout.ts`
- **Issue**: Currency formatter exported but never imported (discord.ts uses its own local `fmt`)
- **Fix**: Removed

### 6. Unused `fmtCurrency` function — `client/src/lib/lang-utils.ts`
- **Issue**: Currency formatter with caching, exported but never imported
- **Fix**: Removed

### 7. Unused `ConsentLogEntry` re-export — `server/storage/index.ts`
- **Issue**: Type re-exported from index barrel but never imported via that path
- **Fix**: Removed re-export (type remains available in `marketing.ts` where it's defined and used)

## Validated Clean (No Changes Needed)

### Routes & Navigation
- Legacy redirects (`/mi-agenda`, `/start`, `/links`) working correctly
- All menu items match registered routes
- Blog routing with language prefixes correct

### i18n — 6 Languages (es, en, fr, de, pt, ca)
- **Result**: PASS
- 1,082 keys across all languages
- 0 missing, 0 extra, 0 empty values
- 0 placeholder mismatches
- 230 correctly identical cognates (shared PT/CA/ES words)
- Validation command: `node_modules/.bin/tsx exentax-web/scripts/validate-i18n.ts`

### Discord Webhooks — `server/discord.ts`
- Rate-limited queue (1 message/second max)
- Retry logic with exponential backoff
- Privacy masking (email truncation, no phone/address)
- Spanish branding with Exentax colors
- All 6 event types active: booking created/rescheduled/cancelled, calculator lead, newsletter subscribe, critical error

### Google Sheets — `server/google-sheets.ts`
- Fire-and-forget pattern (non-blocking)
- Graceful degradation (fails silently if credentials missing)
- 4 sheet operations: Agenda, Calculadora, Consents, generic appendRow

### Security
- CSRF origin checking on state-changing requests
- AES-256-GCM field encryption (phone field)
- Auto-sanitize middleware (HTML entity escaping + prototype pollution protection)
- Helmet with Content Security Policy + HSTS
- Rate limiting per endpoint category (booking, calculator, newsletter, visitor, public data)
- Request body size limits
- ID override protection on inserts

### Performance
- React.lazy() for route-level code splitting
- Prefetch hints for critical routes
- Gzip compression middleware
- Immutable cache headers for hashed assets
- Sitemap/meta tag caching

## Schema Type Exports (Kept)
The following types are exported from `shared/schema.ts` but not yet consumed externally. These follow the standard Drizzle ORM pattern and are kept as the public API:
- `InsertCalculadora`, `Calculadora`, `Visita`, `NewsletterSuscriptor`
- `InsertDiaBloqueado`, `DiaBloqueado`, `LegalDocType`
- `InsertConsentLog`, `ConsentLog`
