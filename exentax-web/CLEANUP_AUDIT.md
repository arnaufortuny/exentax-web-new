# Exentax Cleanup Audit Report

## Scope
Comprehensive audit of dead code, routes, i18n, Discord webhooks, booking/Google Sheets, security, performance, and documentation.

## Fixes Applied

### 1. Stale Italian (`it`) in language regexes — `server/static.ts`
- **Issue**: 5 regex patterns included `it` (Italian) which is NOT a supported language
- **Fix**: Removed `it|` from all regex patterns, now correctly matching `es|en|fr|de|pt|ca`
- **Lines**: 98, 208, 223, 240, 241

### 2. Stale Italian references — `client/index.html`
- **Issue**: Three Italian references in HTML template despite Italian not being a supported language:
  - `<link rel="alternate" hreflang="it" href="https://exentax.com" />`
  - `<meta property="og:locale:alternate" content="it_IT" />`
  - `"knowsLanguage": ["es", "en", "fr", "de", "pt", "it", "ca"]` (x2 in JSON-LD)
- **Fix**: Removed all 4 Italian references
- **Verification**: `curl / | grep -o 'hreflang="[^"]*"'` and `og:locale` both show no Italian

### 3. Duplicate `escapeHtml` function — `server/routes/public.ts`
- **Issue**: Local `escapeHtml` duplicated the one in `routes/shared.ts`
- **Fix**: Removed local definition, imported from `./shared`

### 4. Hardcoded Spanish string — `server/routes/public.ts`
- **Issue**: Newsletter privacy error used hardcoded Spanish: `"Debes aceptar la politica de privacidad para continuar."`
- **Fix**: Replaced with `backendLabel("zodMustAcceptPrivacy", resolveRequestLang(req))`
- **Verification**: Tested EN/FR/ES/PT/CA/DE — all return localized error messages

### 5. Unused `maskSensitiveField` export — `server/field-encryption.ts`
- **Issue**: Function exported but never imported anywhere
- **Fix**: Removed entirely

### 6. Unused `fmt` function — `server/email-layout.ts`
- **Issue**: Currency formatter exported but never imported (discord.ts uses its own local `fmt`)
- **Fix**: Removed

### 7. Unused `fmtCurrency` function — `client/src/lib/lang-utils.ts`
- **Issue**: Currency formatter with caching, exported but never imported
- **Fix**: Removed

### 8. Unused `ConsentLogEntry` re-export — `server/storage/index.ts`
- **Issue**: Type re-exported from index barrel but never imported via that path
- **Fix**: Removed re-export (type remains available in `marketing.ts` where it's defined and used)

## Verification Evidence

### TypeScript Compilation
```
npx tsc --noEmit --skipLibCheck
PASS: Zero type errors
```

### i18n Validation
```
node_modules/.bin/tsx exentax-web/scripts/validate-i18n.ts
Total missing keys:        0
Total extra keys:          0
Total empty values:        0
Placeholder mismatches:    0
Possibly untranslated:     230 (correctly identical cognates PT/CA/ES)
Result: PASS
```

### Endpoint Smoke Tests
```
GET  /api/legal/versions              -> 200 OK (5 document versions)
GET  /api/bookings/blocked-days       -> 200 OK
GET  /api/bookings/available-slots    -> 200 OK (14 slots returned)
POST /api/bookings/book (empty)       -> 400 VALIDATION_ERROR (all required fields listed)
POST /api/calculator-leads (empty)    -> 400 VALIDATION_ERROR (all required fields listed)
POST /api/newsletter/subscribe (EN)   -> 400 "You must accept the privacy policy"
POST /api/newsletter/subscribe (FR)   -> 400 "Vous devez accepter la politique de confidentialite"
POST /api/newsletter/subscribe (ES)   -> 400 "Debe aceptar la politica de privacidad"
POST /api/newsletter/subscribe (no origin) -> 403 CSRF blocked (security working)
```

### SEO Verification
```
Blog hreflang tags: ca, de, en, es, es-AR, es-CL, es-CO, es-ES, es-MX, es-PE, fr, pt, x-default
PASS: No Italian hreflang
Sitemap entries: 82
```

### Security Headers
```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
```

### Legacy Redirects
```
/start     -> 301 redirect to /empezar
/links     -> 301 redirect to /go
/mi-agenda -> 200 (SPA route)
```

## Validated Clean (No Changes Needed)

### Routes & Navigation
- 12 API endpoints verified functional
- Legacy redirects working correctly
- Blog routing with 6 language prefixes correct
- Sitemap generates 82 entries

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
- CSRF origin checking on state-changing requests (verified: blocks requests without Origin header)
- AES-256-GCM field encryption (phone field)
- Auto-sanitize middleware (HTML entity escaping + prototype pollution protection)
- Helmet with CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- Rate limiting per endpoint category (verified: rate limits newsletter after rapid requests)
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
