# Compliance & legal — Exentax Web

Authoritative reference for the GDPR / cookie / consent / legal-versioning
layer that ships with this app. Every section maps to the code that
implements it so an auditor can walk straight from policy to the line of
TypeScript that enforces it.

Last reviewed: 2026-04-28 (task #14 — Compliance & legal review).

---

## 1. Data controller

Identified throughout the site footer, legal pages, and SEO entity blocks.
Single source of truth: `client/src/lib/constants.ts → SITE_CONSTANTS`.

| Field                | Value                                 |
| -------------------- | ------------------------------------- |
| Legal name           | Exentax LLC                           |
| Jurisdiction         | New Mexico, USA                       |
| Filing number        | NM File #3162927                      |
| EIN                  | 98-1919471                            |
| Privacy / GDPR email | `legal@exentax.com` (`SITE_CONSTANTS.LEGAL_EMAIL`) |
| General contact      | `hola@exentax.com` (`SITE_CONSTANTS.EMAIL`)        |

Visitors in the EU/UK exercise GDPR rights by writing to `LEGAL_EMAIL`. The
address appears in the privacy policy, the cookie banner help text, and on
the unsubscribe / consent-revocation flow.

---

## 2. Cookie & consent layer

### 2.1 Banner — `client/src/components/CookieBanner.tsx`

* Three actions: **Accept all**, **Reject** (essential only), **Customise**.
* Granular toggles: essential (always on), analytics (GA4), marketing
  (Meta Pixel).
* On submit it `POST`s to `/api/consent` and writes the choice to
  `localStorage.exentax_consent` so subsequent loads don't re-prompt.
* Pulls the current legal-doc version from `/api/legal/versions` and
  stamps it into both the localStorage record and the `consent_log` row.

### 2.2 Tracking — `client/src/components/Tracking.tsx`

* Google Consent Mode v2 defaults to **denied** before any script loads.
* GA4 + Meta Pixel scripts are inserted into the DOM **only** after
  `hasAnalyticsConsent()` returns true.
* On consent withdrawal (`onConsentChange`) we:
  1. Update Consent Mode v2 to `denied`.
  2. Set `window["ga-disable-<MEASUREMENT_ID>"] = true`.
  3. Wipe `_ga*`, `_gid`, `_gat*`, `_fbp`, `_fbc`, `_gcl_au` cookies on the
     current host AND on `.exentax.com`.
  4. Drain the `fbq` queue.

### 2.3 Server gate — `server/routes/public.ts`

* `POST /api/visitor` short-circuits with HTTP 200 when the request body
  reports `consent !== "all"` or when the request is detected as a bot.
* `POST /api/consent` is the audit-log sink for the banner. The handler
  records: `formType`, `marketingAccepted`, `language`, `referrer`,
  `privacyVersion`, **truncated IP** and **User-Agent**.

---

## 3. `consent_log` audit trail

Schema: `shared/schema.ts → consentLog` (table `consent_log`).

| Column              | Notes                                              |
| ------------------- | -------------------------------------------------- |
| `id`                | `con_*` ULID-like, exposed in Discord audit ping.  |
| `form_type`         | `cookies:*`, `booking`, `calculator`, `newsletter_footer`. |
| `email`             | Nullable — the cookie-banner row has no email.     |
| `privacy_accepted`  | Mandatory, always true at write-time.              |
| `marketing_accepted`| Tri-state (true / false / null).                   |
| `timestamp`         | ISO string in Europe/Madrid for human reading.     |
| `language`          | BCP-47 short code (`es`, `en`, …).                 |
| `source`            | Form/origin or HTTP referrer.                      |
| `privacy_version`   | Doc version active when the user consented.        |
| `ip`                | Truncated (see §4).                                |
| `user_agent`        | Capped at 300 chars (`MAX_USER_AGENT_LEN`).        |
| `created_at`        | DB-side `defaultNow()`.                            |

Insertion: `server/storage/marketing.ts → insertConsentLog`. Wrapped by
`logConsent()` in `server/routes/public.ts` so callers can never forget
the truncation step — the helper passes only what the route handler has
already prepared.

---

## 4. IP-truncation policy

Implemented in `server/route-helpers.ts → truncateIp(ip)`.

* IPv4 → /24 (`203.0.113.42` → `203.0.113.0`).
* IPv6 → /48 (first three groups, padded to `::`).
* Sentinels (`localhost`, `::1`, `127.0.0.1`, `unknown`) are returned as-is.
* IPv4-mapped IPv6 addresses (`::ffff:1.2.3.4`) are unwrapped before /24
  truncation.

Truncation is applied at the **storage write site**, not at request entry,
because the full IP is still needed by the rate-limiter and the
new-visitor dedupe set (in-memory, never persisted beyond the
deduplication window).

| Persistence target           | IP form        |
| ---------------------------- | -------------- |
| `visits.ip`                  | Truncated      |
| `consent_log.ip`             | Truncated      |
| `leads.ip`, `agenda.ip`      | Full (AML/KYC) |
| Rate-limit / bot-detect maps | Full (RAM only)|

---

## 5. Legal-document versioning

Schema: `shared/schema.ts → legalDocumentVersions` (table
`legal_document_versions`).

| Column           | Notes                                                       |
| ---------------- | ----------------------------------------------------------- |
| `doc_type`       | `privacy`, `terms`, `cookies`, `legal_notice`, etc.         |
| `version`        | Free text — convention `YYYY-MM-DD` or semantic.            |
| `effective_date` | ISO date, used to pick "the version active right now".      |
| `content_hash`   | SHA-256 of the rendered HTML for tamper detection.          |
| `changelog`      | Operator-written summary of what changed.                   |
| `created_at`     | DB-side timestamp.                                          |

The frontend banner and every consent write resolve the active version
through:

* `GET /api/legal/versions` — returns the current effective version per
  doc type, rate-limited via `publicDataLimiter`.
* `getCachedPrivacyVersion()` (server) — 5-minute in-memory cache used by
  `logConsent` callers so each form-submission carries the version that
  was live at submit time.

The table is **append-only**; `purgeOld*` helpers explicitly do not touch
it. Publishing a new version is purely an `INSERT` plus a forced cache
refresh on the server.

### 5.1 Publishing a new legal document

1. Update the localized copy in `client/src/data/legalContent.ts` (all 6
   locales must move together).
2. Run the SHA-256 hash of the rendered HTML (any `shasum -a 256` against
   the built `legal/<doc>` page output works).
3. `INSERT` a row into `legal_document_versions` with the new version,
   today's `effective_date`, the hash and a short `changelog`.
4. Force the cache refresh by restarting the workflow (the 5-minute TTL
   would do it eventually but a deploy is the cleanest moment).
5. Re-render PDFs of the new version into `public/legal/<lang>/<doc>.pdf`
   for archival download.

---

## 6. Retention matrix

Code: `server/scheduled/retention-purge.ts`. Runs every 6 h after a
5-minute startup grace; each table has its own try/catch so a transient
failure on one does not block the others. All `DELETE` statements hit a
`created_at` index.

| Table                 | Retention               | Why                                       |
| --------------------- | ----------------------- | ----------------------------------------- |
| `visits`              | 180 days                | Web analytics, no contractual need.       |
| `consent_log`         | 36 months               | Proof-of-consent window (AEPD guidance).  |
| `calculations`        | 24 months               | Anonymous calculator usage.               |
| `newsletter_subscribers` (unsubscribed only) | 12 months after unsubscribe | Suppression-list courtesy + soft-bounce diagnostics. |
| `leads`               | **7 years** (no purge)  | AML/KYC obligation.                       |
| `agenda`              | **7 years** (no purge)  | Booking record tied to the lead.          |
| `legal_document_versions` | **Indefinite** (no purge) | Immutable consent-version archive. |

To trigger a manual sweep (e.g. before a maintenance window):

```ts
import { runRetentionPurge } from "./server/scheduled/retention-purge";
await runRetentionPurge(); // returns counts per table
```

---

## 7. GDPR data-subject rights

All requests go to `legal@exentax.com` and are answered within 30 days.
The site never exposes a self-service portal for these — the operator
fulfils them by hand against the storage layer.

| Right                       | Where the data lives                          |
| --------------------------- | --------------------------------------------- |
| Access (Art. 15)            | `leads`, `agenda`, `consent_log`, `newsletter_subscribers`, `calculations` |
| Rectification (Art. 16)     | `leads`, `newsletter_subscribers`             |
| Erasure (Art. 17)           | All of the above **except** `consent_log` and `legal_document_versions` (legal hold). |
| Restriction (Art. 18)       | Set the relevant flag on the storage row; no automated UI. |
| Portability (Art. 20)       | Export the user's rows as JSON via `psql` and email back. |
| Objection (Art. 21)         | Toggle `marketing_accepted=false`, unsubscribe from newsletter. |
| Withdrawal of consent (Art. 7(3)) | Cookie banner → "Reject" or "Customise"; `Tracking.tsx → clearAnalyticsCookies`. |

For an erasure request, the operator must:

1. `UPDATE leads SET email = NULL, name = NULL, phone = NULL, notes = NULL WHERE email = $1;`
   (encrypted columns are nullified — the row is kept for the AML 7-year
   audit trail, but the personal data is gone).
2. `UPDATE agenda SET ... WHERE email = $1;` for any associated bookings.
3. `DELETE FROM newsletter_subscribers WHERE email = $1;`.
4. Leave `consent_log` rows untouched — they are the proof that the user
   gave (and now withdraws) consent and would be the operator's defence
   in a supervisory-authority audit.

---

## 8. i18n consistency

Six locales ship: `es` (canonical), `en`, `fr`, `de`, `pt`, `ca`. The
legal copy lives in `client/src/data/legalContent.ts`. Each doc type has
exactly five `body:` sections per locale. Word-count drift between
locales is monitored by `docs/i18n-deep-audit-2026-04.md`; rewriting
copy is out of scope here (covered by task #4 — native quality).

Every `consent_log.language` write captures the BCP-47 short code
returned by `i18n.language` so the operator can answer "what wording was
shown to this visitor when they consented?" by joining `consent_log`
against `legal_document_versions` and the localized source file at the
captured `version`.

---

## 9. Server-side tracking respect

* `POST /api/visitor` ignores requests with `consent !== "all"` — silent
  HTTP 200, no DB write.
* The Discord "new visit" notification fires only after the gate passes.
* The Google Tag / Pixel scripts never load until the consent flag flips
  to granted.
* Rate-limit and bot-detect happen **before** any persistence so the
  rejected-consent path is also rate-limited; rejected-consent rows
  never accumulate.

---

## 10. Where to look when something feels wrong

| Symptom                                            | First file to read                              |
| -------------------------------------------------- | ----------------------------------------------- |
| Banner re-appears every reload                     | `client/src/components/CookieBanner.tsx`        |
| GA cookies survive a "Reject"                      | `client/src/components/Tracking.tsx → clearAnalyticsCookies` |
| `consent_log` row has full IP                      | `server/route-helpers.ts → truncateIp`          |
| Wrong privacy version captured                     | `server/storage/legal.ts → getCachedPrivacyVersion` |
| Visit row appears for a "Reject" visitor           | `server/routes/public.ts → /api/visitor` consent gate |
| `visits` table grows unboundedly                   | `server/scheduled/retention-purge.ts` not started |
| Rights request can't find a user                   | Search across `leads`, `newsletter_subscribers`, `consent_log` by email |
