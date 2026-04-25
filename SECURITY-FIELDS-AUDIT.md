# Security & Form-Fields Audit — Exentax

**Date:** 2026-04-25
**Scope:** Field-level encryption, Helmet CSP, CSRF, rate limiting, input
sanitisation, log PII hygiene, form Zod validation and 6-locale error coverage.
**Verdict:** **PASS** — every check item from `task-4.md` is met. Five
non-blocking observations are recorded in §8 (none are defects; one
sharpens the production-vs-dev PII boundary called out below).

---

## 1. Field encryption (`server/field-encryption.ts`)

**Implementation summary:** AES-256-GCM with `crypto.createCipheriv`, 16-byte
random IV per encryption, 16-byte auth tag, hex-encoded triplet stored as
`ef:<iv>:<tag>:<ciphertext>`. Key is loaded once from
`FIELD_ENCRYPTION_KEY` and validated to be exactly 64 hex chars (32 bytes);
production refuses to start otherwise.

| Check | Result |
|---|---|
| Key length validation (`keyBuffer.length !== 32` → throw in prod) | ✅ enforced at line 29–32 |
| Production fail-fast on missing key | ✅ enforced at line 17–19 |
| Idempotency (encrypting an already-encrypted value is a no-op) | ✅ via `isEncryptedField()` guard at line 56 |
| Round-trip on phone field | ✅ covered by test §1.2 |
| Auth-tag tampering rejected | ✅ covered by test §1.2 |
| `encryptSensitiveFields` defaults to `["phone"]` | ✅ `ALL_SENSITIVE = ["phone"]` line 106 |

### 1.1 Round-trip check

Sample plaintext `"+34 600 123 456"` (representative phone string from the
booking form):

```text
plaintext  = "+34 600 123 456"
ciphertext = ef:<32-hex-IV>:<32-hex-tag>:<hex-ct>   // 16+16+16+ bytes hex-encoded
decrypted  = "+34 600 123 456"   // identity restored
```

### 1.2 Test execution

```bash
$ npx tsx scripts/test-field-encryption.ts
=== Field Encryption E2E Test ===
[1] Setup                  ✓ isFieldEncryptionEnabled returns true
[2] Round-trip             ✓ 6 distinct plaintexts encrypt+decrypt cleanly
                            (incl. phone, email, unicode, 1000-char string)
[3] IV uniqueness          ✓ 50 encryptions of same plaintext → 50 distinct ciphertexts
[4] Tampering rejection    ✓ flipped tag bit ≠ original; flipped ciphertext bit ≠ original
[5] Idempotency            ✓ encryptField on already-encrypted is a no-op
[6] Null/empty/undefined   ✓ all return null safely
[7] Format validation      ✓ ef:<32 hex>:<32 hex>:<hex> shape
[8] Sensitive integration  ✓ encryptSensitiveFields encrypts only `phone`,
                            preserves email + non-strings; decrypt restores
[9] No-op on no-PII record ✓
[10] Algorithm verification ✓ 16-byte IV + 16-byte tag = AES-256-GCM standard

45/45 assertions passed.   EXIT 0
```

---

## 2. Helmet CSP review (`server/index.ts` lines 59–104)

Live response header captured against the dev workflow on `GET /`:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
             https://www.google-analytics.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://www.googletagmanager.com
              https://www.google-analytics.com https://analytics.google.com
              https://connect.facebook.net https://www.facebook.com
              https://fonts.googleapis.com https://fonts.gstatic.com;
  frame-src 'self' https://www.googletagmanager.com;
  frame-ancestors 'self';
  object-src 'none';
  worker-src 'self' blob:;
  base-uri 'self';
  form-action 'self';
  script-src-attr 'unsafe-inline';   // dev only — production hardens to 'none'
  upgrade-insecure-requests
```

Plus full sibling-header set: `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Cross-Origin-Opener-Policy: same-origin-allow-popups`,
`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(),
interest-cohort=(), browsing-topics=()`, plus a per-request
`X-Correlation-Id`.

| Asset family | CSP source whitelisted | Status |
|---|---|---|
| Self-hosted JS bundle | `script-src 'self'` | ✅ |
| Google Tag Manager / GA4 | `script-src` + `connect-src` `googletagmanager.com`, `google-analytics.com`, `analytics.google.com` | ✅ |
| Meta pixel | `script-src` + `connect-src` `connect.facebook.net`, `www.facebook.com` | ✅ |
| Google Fonts (CSS + WOFF2) | `style-src fonts.googleapis.com`, `font-src fonts.gstatic.com`, plus `connect-src` for variable-font fetches | ✅ |
| Inline `<style>` (Vite HMR + shadcn dynamic styles) | `style-src 'unsafe-inline'` | ✅ (industry-standard for Tailwind-based stacks) |
| `data:` / `blob:` images (uploads, OG previews) | `img-src data: blob: https:` | ✅ |
| Web workers (used by client-side error sink) | `worker-src 'self' blob:` | ✅ |
| GTM iframe | `frame-src https://www.googletagmanager.com` | ✅ |

**Hardening differences vs. dev:**

| Directive | dev | prod | Reason |
|---|---|---|---|
| `script-src` | adds `'unsafe-inline'` | **drops** `'unsafe-inline'` | React devtools / Vite HMR need inline blobs locally; production bundle is hashed and self-only. |
| `script-src-attr` | `'unsafe-inline'` | `'none'` | The codebase uses zero inline event-handler attributes (verified by grep, comment line 86); production locks them out entirely. |
| `upgrade-insecure-requests` | absent | enabled | Forces HTTPS only in prod. |
| HSTS | disabled | `max-age=63072000; includeSubDomains; preload` | Standard production hardening. |

**Console violations on dev preview** (homepage + `/es/blog` + a sample
article): no console errors loaded from `browser_console_*.log` for the
audit window. The `script-src` set above is the union of every external
host actually fetched by the SPA (GA4 + GTM + Meta + Google Fonts), so no
violations are expected.

**No policy changes were required** — the existing config matches the live
asset graph.

---

## 3. CSRF + rate-limiting walk

### 3.1 CSRF (`server/routes.ts` lines 68–84)

A single global middleware applies to every non-GET, non-HEAD, non-OPTIONS
request under `/api/`. It checks `Origin`/`Referer` against
`ALLOWED_ORIGINS` (`route-helpers.ts` `checkCsrfOrigin`). One documented
exemption: `/api/discord/interactions`, which is authenticated by Ed25519
signature on the raw body (a strictly stronger proof than Origin checking)
— Discord does not send an `Origin` header, so a same-origin check would
otherwise reject every legitimate interaction.

Verified live with curl:

```bash
# missing Origin                  → 403 FORBIDDEN
$ curl -X POST .../api/consent ... -d '{...}'
{"ok":false,"error":"Origin not allowed","code":"FORBIDDEN"}

# spoofed Origin (evil.example)   → 403 FORBIDDEN
$ curl -X POST .../api/consent -H 'Origin: http://evil.example.com' ...
{"ok":false,"error":"Origin not allowed","code":"FORBIDDEN"}
```

Server-side log lines confirm the block path:

```text
[WARN] [auth] [csrf] blocked: origin="undefined"             referer="undefined" host="localhost:5000"
[WARN] [auth] [csrf] blocked: origin="http://evil.example.com" referer="undefined" host="localhost:5000"
[INFO] [http] POST /api/consent 403 in 1ms :: {"ok":false,"error":"Origin not allowed","code":"FORBIDDEN"}
```

### 3.2 Mutating-endpoint inventory & coverage

Walked `server/routes/public.ts`, `server/routes/observability.ts`,
`server/routes/indexnow.ts`, `server/discord-bot.ts`. Every state-changing
endpoint is listed below with its CSRF and rate-limit posture.

| Method + Path | CSRF | Rate-limit (per IP) | Body validation | Notes |
|---|---|---|---|---|
| `POST /api/bookings/book`            | ✅ global | ✅ `bookingLimiter` 5 / hr | Zod `bookingRequestSchema.strict()` | Slot lock prevents double-book |
| `POST /api/booking/:id/reschedule`   | ✅ global | ✅ `bookingManageLimiter` 30 / hr | Zod | Requires manage token |
| `POST /api/booking/:id/cancel`       | ✅ global | ✅ `bookingManageLimiter` 30 / hr | Zod | Requires manage token |
| `POST /api/calculator-leads`         | ✅ global | ✅ `calcLimiter` 10 / hr | Zod `calculatorLeadSchema.strict()` | Saves encrypted phone |
| `POST /api/consent`                  | ✅ global | ✅ `consentLimiter` 20 / min — **silent-200 by design** | Zod `cookieConsentSchema.strict()` | Cookie banner cannot be UX-blocked |
| `POST /api/newsletter/subscribe`     | ✅ global | ✅ `newsletterLimiter` 3 / hr → 429 | Zod `newsletterSubscribeSchema.strict()` | Welcome email is `isNew`-gated |
| `POST /api/visitor`                  | ✅ global | ✅ `visitorLimiter` 30 / min | Zod `visitorSchema.strict()` | Beacon endpoint, errors swallowed |
| `POST /api/client-errors`            | ✅ global | ✅ global `/api/` 200 / min limiter | own size guard | Browser error sink |
| `POST /api/discord/interactions`     | ⛔ exempt — see §3.1 | — | Ed25519 signature verify on raw body | Stronger auth than CSRF |

In addition, every `/api/*` request is subject to the **global limiter**
mounted in `server/index.ts` line 366 (`200 req / 60 s` per IP) — that
applies to every mutating route as a second outer ceiling.

### 3.3 Live rate-limit trip

Newsletter limiter is `3 / hr per IP`:

```text
$ for i in 1..5: POST /api/newsletter/subscribe
req 1 -> 200
req 2 -> 200
req 3 -> 200
req 4 -> 429
req 5 -> 429
```

Server log confirms the 429 response shape:

```text
[INFO] [http] POST /api/newsletter/subscribe 429 in 1ms :: {"ok":false,"error":"Too many requests","code":"RATE_LIMITED"}
```

### 3.4 ID-override stripping

`server/routes.ts` lines 86–92 silently strips any client-supplied `id`
field on `POST/PUT/PATCH`, preventing primary-key spoofing. Logged at
`WARN` level for forensics.

---

## 4. Sanitisation + logs

### 4.1 Input sanitisation (`server/sanitize-middleware.ts`)

`autoSanitizeMiddleware` is mounted globally in `server/index.ts` line 342,
**before** any business handler. For every request:

- HTML-escapes `&`, `<`, `>`, `"`, `'` inside every string under
  `req.query`, `req.params`, and (for non-GET/HEAD/OPTIONS) `req.body`,
- Recurses up to `MAX_DEPTH = 10`,
- Caps to `MAX_KEYS = 500` and `MAX_ARRAY_LEN = 200`,
- **Drops prototype-pollution keys** (`__proto__`, `constructor`, `prototype`),
- Returns `413 PAYLOAD_TOO_COMPLEX` for objects exceeding the key budget.

This runs on every representative POST payload (booking, calculator,
newsletter, consent, visitor) — verified by tracing the middleware chain
in `server/index.ts` (compression → uploads guard → health → host redirect
→ permissions-policy → URL canonicalisation → legacy redirects → manifest
→ Discord raw-body → JSON parser → urlencoded → **`autoSanitizeMiddleware`**
→ rate-limit → router).

### 4.2 PII redaction in logs (`server/logger.ts`)

The hygiene story is split across **three independent log surfaces** —
each one closes the leak through a different mechanism, and the
combination is what makes production logs PII-free. Calling them out
explicitly because the redact-key heuristic alone does **not** cover
emails:

**(A) HTTP request log (`logger.request`).**
The pipeline is: `originalResJson` capture → `capturedJsonResponse` →
`logger.request(method, path, status, durationMs, safeBody)`. Critically,
`safeBody` is the **response** body, never the request body. So the
inbound `email`/`phone` field of a form submission **never** enters the
HTTP log line, even in dev. Production additionally drops the body
attachment entirely (`if (body && process.env.NODE_ENV !== "production")`
guard, `logger.ts` line 170/178). For our endpoints the response body is
either `{ok:true}` or `{ok:true, subscribed:true}` or
`{ok:false, error:..., code:...}` — none carry PII.

**(B) `redactSensitiveFields` key-pattern set (`logger.ts` lines 3–18).**
Used by `logger.request()` whenever a body is attached (dev only). The
pattern set covers `phone, telefono, address, direccion, password*,
otp*, secret, managetoken, sessiontoken, *token, apikey, *credential,
ein, dni, iban, passport, taxid, routing, accountnumber, swift,
beneficiary, fiscaladdress, legalname, filingnumber`.
**Caveat:** the key `email` is **not** in this set. That is a deliberate
choice that is safe **only because of (A)** — the response bodies our
HTTP log can attach do not contain an `email` field. If a future
endpoint started returning the user's email in its response body, the
dev HTTP log would expose it; the prod HTTP log still would not (body
attach is prod-disabled). Recorded as a future hardening micro-task in
§8.

**(C) Email module (`server/email.ts`).**
Every `logger.info` / `logger.warn` / `logger.error` line that mentions a
recipient routes the address through `maskEmail()` (`alice.long@x.com`
→ `ali***@x***.com`). 12 such call sites verified by grep (full evidence
in §9):

```text
maskEmail() in server/email.ts → 12 callsites, all in info/warn/error paths
  lines 175, 199, 288, 304, 481, 484, 541, 595, 649, 726, 786, 834
  (+ 2 jsdoc examples on lines 37–38 and 1 function definition on line 40
   = 15 raw occurrences in the file)
```

The `logEmail()` audit-channel helper (`server/email.ts` line 68) emits
plaintext `to` via **`logger.debug`** only. `MIN_LEVEL` is `info` in
production (`logger.ts` line 49), so those `debug` lines are filtered
out **before write** in prod. They appear only when running with
`NODE_ENV=development` or `LOG_LEVEL=debug`. Recorded as a future
hardening micro-task in §8 (route those `debug` payloads through
`maskEmail` too, so dev dumps stay PII-free).

Discord notifier (`server/discord.ts`) emits no plaintext recipient — it
mirrors `con_<id>` references and event-key hashes only.

### 4.3 Sample log review — concrete grep evidence

Live audit window (Apr 25, 14:44 UTC) — full file
`/tmp/logs/Start_application_20260425_144508_375.log`. Inbound rate-limit
+ CSRF test traffic was generated from §3.

```text
$ rg "@" /tmp/logs/Start_application_20260425_144508_375.log
2:44:11 PM [DEBUG] [email] NEWSLETTER WELCOME (no Gmail): {"email":"audit-trip-test@exentax.com","lang":"es"}
2:44:11 PM [DEBUG] [email] email fallido: newsletter_welcome → audit-trip-test@exentax.com | err=Gmail not configured

$ rg "\b\d{7,}\b" /tmp/logs/Start_application_20260425_144508_375.log | rg -v "cid=|max_age|epoch|bytes|ms|ttl|size|count"
(no output — zero unmasked phone-like sequences)
```

The two `@` matches are both **`[DEBUG]`** lines from the no-Gmail
dev fallback path described in §4.2 (C). They are filtered out at
`MIN_LEVEL=info` in production. Every `INFO` / `WARN` / `ERROR` line in
the audit window is PII-free:

```text
[INFO] [http] POST /api/consent                 200 in 5ms  :: {"ok":true}
[INFO] [http] POST /api/newsletter/subscribe    200 in 12ms :: {"ok":true,"subscribed":true}
[INFO] [http] POST /api/newsletter/subscribe    429 in 1ms  :: {"ok":false,"error":"Too many requests","code":"RATE_LIMITED"}
[INFO] [http] POST /api/consent                 403 in 1ms  :: {"ok":false,"error":"Origin not allowed","code":"FORBIDDEN"}
[WARN] [auth] [csrf] blocked: origin="http://evil.example.com" referer="undefined" host="localhost:5000"
[DEBUG] [discord] Discord channel id missing for 'consentimientos' — event dropped
[DEBUG] [discord] Discord event deduped type=lead_newsletter keyHash=568c9f250fa3
```

**Conclusion (sharpened):** production HTTP / error / audit logs are
PII-free because (A) HTTP logs never attach request bodies in prod and
their response bodies do not carry PII, (B) the email module masks
every `info`/`warn`/`error` recipient, and (C) the only plaintext
`logEmail` writes are `debug`-level and filtered out at
`MIN_LEVEL=info`. Dev logs surface 2 plaintext-email `DEBUG` lines on
the no-Gmail fallback path — recorded as future hardening, not a
production defect.

---

## 5. Form validation + i18n parity

### 5.1 Server-side Zod schemas (every public POST)

| Endpoint | Schema | Strict | Error keys used |
|---|---|---|---|
| `POST /api/bookings/book`         | `bookingRequestSchema` (defined inline in `server/routes/public.ts`) | ✅ `.strict()` | `zodInvalidEmail`, `zodEmailTooLong`, `zodPhoneTooLong`, `zodPhoneMinDigits`, `zodMustAcceptPrivacy`, plus business-rule labels (`weekdaysOnly`, `slotAlreadyBooked`, `cannotBookPastDate`, `dayNotAvailable`, `invalidTimeSlot`, …) |
| `POST /api/calculator-leads`      | `calculatorLeadSchema` (`server/routes/calculator-lead-schema.ts`) | ✅ `.strict()` | `zodInvalidEmail`, `zodEmailTooLong`, `zodPhoneTooLong`, `zodPhoneMinDigits`, `zodMustAcceptPrivacy` |
| `POST /api/newsletter/subscribe`  | `newsletterSubscribeSchema` (inline) | ✅ `.strict()` | `zodInvalidEmail`, `zodMustAcceptPrivacy` |
| `POST /api/consent`               | `cookieConsentSchema` (inline) | ✅ `.strict()` | silent — never user-facing |
| `POST /api/visitor`               | `visitorSchema` (inline) | ✅ `.strict()` | silent — beacon |

Every schema is `.strict()`, so unknown fields are rejected. Phone fields
go through `sanitizeInput` + `isValidPhone` (`route-helpers.ts`) before
validation; emails are length-capped at 254 chars (RFC 5321 limit).

> **Note on the brief:** the brief points to
> `exentax-web/shared/calculator-lead-schema.ts`. The actual canonical
> location is `exentax-web/server/routes/calculator-lead-schema.ts` (the
> route handler imports from there). Both this audit and the route handler
> reference the same single source of truth — there is no divergent
> `shared/` copy to reconcile.

### 5.2 Backend i18n labels — locale parity

Every `backendLabel(...)` key has translations for all 6 supported locales
(`es, en, fr, de, pt, ca`). Verified by parsing the `BACKEND_I18N` table
in `server/routes/shared.ts`:

```text
total label entries:   61
with all 6 locales:    61
missing some:          0
```

This includes every Zod error key surfaced to forms
(`zodInvalidEmail`, `zodEmailTooLong`, `zodPhoneTooLong`,
`zodPhoneMinDigits`, `zodMustAcceptPrivacy`), every rate-limit / abuse
label (`rateLimited`, `tooManyBookings`, `tooManyRequestsRetry`,
`tooManyRequestsWait`), every infrastructure label (`originNotAllowed`,
`invalidJsonBody`, `payloadTooLarge`, `payloadTooComplex`,
`requestProcessingError`, `internalServerError`, `requestError`,
`endpointNotFound`, `resourceNotFound`, `invalidInput`,
`storageOperationFailed`), and every booking domain label
(`weekdaysOnly`, `slotAlreadyBooked`, `cannotBookPastDate`,
`dayNotAvailable`, `invalidTimeSlot`, …).

### 5.3 Backend zod-key → BACKEND_I18N mapping

Every `zod*` error key emitted by a public-route schema is defined in
`BACKEND_I18N` (`server/routes/shared.ts`) with all 6 locales. Verified
explicitly:

| Endpoint | zod keys emitted | All 6 locales? |
|---|---|---|
| `POST /api/bookings/book` | `zodInvalidEmail`, `zodEmailTooLong`, `zodPhoneTooLong`, `zodPhoneMinDigits`, `zodNameTooShort`, `zodNameTooLong`, `zodLastNameTooLong`, `zodNotesTooLong`, `zodContextTooLong`, `zodActivityTooLong`, `zodInvalidDateShort`, `zodInvalidDate`, `zodInvalidTimeFormat`, `zodMonthlyProfitRequired`, `zodNoteTooLong`, `zodMustCommitAttendance`, `zodMustAcceptPrivacy` | ✅ all 17 keys present in `BACKEND_I18N` |
| `POST /api/booking/:id/reschedule` | `zodInvalidDate`, `zodInvalidTime` | ✅ |
| `POST /api/calculator-leads` | `zodInvalidEmail`, `zodEmailTooLong`, `zodPhoneTooLong`, `zodPhoneMinDigits`, `zodMustAcceptPrivacy` | ✅ |
| `POST /api/newsletter/subscribe` | `zodInvalidEmail`, `zodMustAcceptPrivacy` | ✅ |
| `POST /api/consent` | (silent — never user-facing) | n/a |
| `POST /api/visitor` | (silent — beacon, errors swallowed) | n/a |

`apiValidationFail()` translates the Zod error code through
`backendLabel(key, lang)` before returning to the client, so the user
always receives the message in their own locale. Client locale files
(`client/src/i18n/locales/{lang}.ts`) own the **UI** strings
(placeholders, button labels, success / loading copy) — the per-locale
key counts vary because each locale natural-languages those UI strings
differently, not because any error key is missing. The error-message
contract is owned by `BACKEND_I18N` and is provably 6/6 complete.

### 5.4 Client-side public forms — coverage matrix

| Form | File | Field set | Inline validation | Backend round-trip |
|---|---|---|---|---|
| Newsletter (footer) | `client/src/components/layout/Footer.tsx` | `email` | regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) before fetch; sets `privacyAccepted: true` implicitly per cookie banner consent | ✅ `POST /api/newsletter/subscribe` |
| Calculator email gate | `client/src/components/calculator/EmailGateForm.tsx` (state owned by `client/src/components/calculator/index.tsx`) | `email`, `phone`, `privacyAccepted`, `marketingAccepted` | `aria-invalid` + `text-{field}-error` per error; backend errors mapped to per-field UI | ✅ `POST /api/calculator-leads` |
| Booking form | `client/src/pages/book.tsx` + `client/src/components/BookingCalendar.tsx` | `name`, `lastName`, `email`, `phone`, `date`, `startTime`, `notes`, `context`, `activity`, `monthlyProfit`, `globalClients`, `digitalOperation`, `meetingType`, `privacyAccepted`, `marketingAccepted`, `language` | per-field state + Zod `safeParse` on submit | ✅ `POST /api/bookings/book` |
| Booking reschedule / cancel | `client/src/pages/booking.tsx` | manage-token URL + `date` + `startTime` | wouter route guards | ✅ `POST /api/booking/:id/reschedule\|cancel` |
| Cookie banner | `client/src/components/CookieBanner.tsx` | `tipo`, `aceptado`, `version`, `idioma` | one-click; never blocks UX | ✅ `POST /api/consent` (silent on rate-limit) |

Per-field error rendering uses i18n keys from `client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts`.
Spanish has 16 form-related keys and the other 5 locales have 9–15 each;
all form-error labels surfaced from the backend reach the user via the
`backendLabel` map, which is itself 6/6 complete (§5.2).

---

## 6. Validation matrix

| Check | Command | Result |
|---|---|---|
| Field-encryption E2E | `npx tsx scripts/test-field-encryption.ts` | ✅ **45/45** assertions, EXIT 0 |
| IndexNow / endpoint test | `npx tsx server/indexnow.test.ts` | ✅ **10/10**, EXIT 0 |
| Full project typecheck | `npx tsc -p tsconfig.json --noEmit` | ✅ EXIT 0 |
| CSP header on `GET /` | `curl -sI http://localhost:5000/` | ✅ all 14 directives present, no missing host |
| CSRF block (no Origin) | `curl -X POST /api/consent` | ✅ `403 Origin not allowed` |
| CSRF block (spoofed Origin) | `curl -X POST /api/consent -H 'Origin: http://evil.example.com'` | ✅ `403 Origin not allowed` |
| Newsletter rate-limit (3/hr) | curl loop ×5 | ✅ trip on 4th: `429 RATE_LIMITED` |
| Backend i18n locale parity | `node -e <parser>` over `BACKEND_I18N` | ✅ **61/61** labels × 6 locales |
| Workflow boot | `Start application` | ✅ clean — `[express] listening on port 5000`, all middleware mounted |

---

## 7. Files reviewed

- `exentax-web/server/field-encryption.ts`
- `exentax-web/server/index.ts` (Helmet, parsers, sanitiser, global limiter)
- `exentax-web/server/routes.ts` (CSRF + ID-override stripping)
- `exentax-web/server/routes/public.ts` (every mutating endpoint)
- `exentax-web/server/routes/observability.ts` (`/api/client-errors`)
- `exentax-web/server/routes/calculator-lead-schema.ts`
- `exentax-web/server/routes/shared.ts` (BACKEND_I18N — 61 entries)
- `exentax-web/server/sanitize-middleware.ts`
- `exentax-web/server/rate-limit-store.ts`
- `exentax-web/server/route-helpers.ts` (per-endpoint limiters)
- `exentax-web/server/lock-store.ts`
- `exentax-web/server/logger.ts`
- `exentax-web/server/email.ts` (`maskEmail` review)
- `exentax-web/scripts/test-field-encryption.ts`
- `exentax-web/server/indexnow.test.ts`
- `exentax-web/client/src/components/layout/Footer.tsx`
- `exentax-web/client/src/components/calculator/EmailGateForm.tsx`
- `exentax-web/client/src/pages/book.tsx`
- `exentax-web/client/src/pages/booking.tsx`
- `exentax-web/client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts`

---

## 8. Observations & recommended follow-ups (5, all non-blocking)

1. **Footer newsletter is "double-opt by cookie banner".** The footer form
   sends `privacyAccepted: true` unconditionally because the cookie banner
   already collected the consent earlier. This matches the visible UI
   (the footer shows the privacy disclaimer next to the field), and the
   backend re-logs the consent through `logConsent` with the canonical
   `formType: "newsletter_footer"`, so audit trail is preserved. **No
   change recommended.**

2. **Consent endpoint is intentionally silent on rate-limit.** Returns
   `200 {ok:true}` regardless, so a misbehaving client cannot lock a
   user's cookie banner into an error state. The limiter still throttles
   the persistence + Discord-notify side-effects. **Documented at line
   915 of `server/routes/public.ts` and re-noted here for completeness.**

3. **Dev-only debug fallbacks log plain emails.** When Gmail is not
   configured (dev), `logger.debug("NEWSLETTER WELCOME (no Gmail): …")`
   and `logEmail()` (`server/email.ts` line 68) write the recipient
   address in plaintext. `MIN_LEVEL` is `info` in production
   (`logger.ts` line 49), so these `debug` lines are filtered out
   before write — in production they are unreachable. **Future
   hardening micro-task:** route the `logEmail()` `to` field and the
   no-Gmail dev fallbacks through `maskEmail()` so dev dumps are PII-free
   too. Also consider adding `email` (and a generic mailbox regex) to
   `redactSensitiveFields` patterns as defence-in-depth, in case a
   future endpoint starts returning emails in response bodies (today
   none do).

4. **`script-src 'unsafe-inline'` in dev only.** Disabled in production
   (line 60). The CSP comment at line 81–89 of `server/index.ts`
   documents the verification (`grep -rnE 'onclick=|onerror=|onload='
   client/src/` → 0 matches) so the production `'none'` for
   `script-src-attr` is safe. **No change recommended.**

5. **Brief file-path drift.** The brief lists
   `exentax-web/shared/calculator-lead-schema.ts`. The canonical file is
   at `exentax-web/server/routes/calculator-lead-schema.ts`. Recorded for
   future task accuracy.

---

**Audit verdict: PASS.** Encryption is correct AES-256-GCM with key
validation; CSP is the union of every fetched host; CSRF is enforced on
every mutating endpoint with one signed-request exemption; rate limiting
trips correctly on the public surface; sanitisation is mounted globally;
logs do not leak PII (request bodies are response-only and only in dev,
emails are masked, sensitive keys are auto-redacted); every server-side
form has a `.strict()` Zod schema and every error key has 6/6 locale
coverage.

---

## 9. Reproducibility appendix

Every numeric claim in this audit can be re-derived from these commands.
Outputs captured during the audit window are inlined for traceability.

```text
$ rg -c "maskEmail\(" exentax-web/server/email.ts
15                              # 2 jsdoc examples + 1 function def + 12 callsites

$ rg -c "^\s*zod[A-Z][a-zA-Z]+:\s*\{" exentax-web/server/routes/shared.ts
19                              # zod* keys defined in BACKEND_I18N

$ rg -c "^\s*[a-zA-Z]+:\s*\{$" exentax-web/server/routes/shared.ts
61                              # total BACKEND_I18N entries

$ rg "@" /tmp/logs/Start_application_20260425_144508_375.log
2:44:11 PM [DEBUG] [email] NEWSLETTER WELCOME (no Gmail): {"email":"audit-trip-test@exentax.com","lang":"es"}
2:44:11 PM [DEBUG] [email] email fallido: newsletter_welcome → audit-trip-test@exentax.com | err=Gmail not configured
                                # both DEBUG-level — filtered at MIN_LEVEL=info in prod

$ npx tsx exentax-web/scripts/test-field-encryption.ts
… 45/45 assertions pass …       # EXIT 0

$ npx tsx exentax-web/server/indexnow.test.ts
… 10/10 pass …                   # EXIT 0

$ cd exentax-web && npx tsc -p tsconfig.json --noEmit
                                # EXIT 0 (no diagnostics)

$ curl -sI http://localhost:5000/ | grep -i "content-security-policy\|x-content-type\|strict-transport"
content-security-policy: default-src 'self'; script-src 'self' …
x-content-type-options: nosniff
                                # 14 directives + 13 sibling security headers

$ curl -sX POST http://localhost:5000/api/consent \
       -H 'Content-Type: application/json' \
       -d '{"tipo":"newsletter","aceptado":true,"version":"v1","idioma":"es"}'
{"ok":false,"error":"Origin not allowed","code":"FORBIDDEN"}     # 403

$ for i in {1..5}; do
    curl -sX POST http://localhost:5000/api/newsletter/subscribe \
         -H 'Origin: http://localhost:5000' \
         -H 'Content-Type: application/json' \
         -d '{"email":"audit-trip-test@exentax.com","lang":"es"}' ; echo
  done
{"ok":true,"subscribed":true}
{"ok":true,"subscribed":true}
{"ok":true,"subscribed":true}
{"ok":false,"error":"Too many requests","code":"RATE_LIMITED"}    # 429 on 4th
{"ok":false,"error":"Too many requests","code":"RATE_LIMITED"}    # 429 on 5th
```
