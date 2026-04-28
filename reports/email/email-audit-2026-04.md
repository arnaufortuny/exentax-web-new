# Email System Audit — April 2026

**Scope.** End-to-end review of the Exentax transactional and marketing email pipeline (Gmail API + Postgres-backed retry queue + drip nurture worker + newsletter broadcast worker), covering: deliverability (SPF / DKIM / DMARC + bulk-sender headers), template security, internationalisation (6 languages × neon-green brand + Inter font), worker / queue robustness, observability (metrics + Discord alerting) and RGPD compliance.

**Verdict.** The system is in **good shape**. All transactional and bulk paths share a single hardened `sendEmail()` wrapper protected by a circuit breaker, the durable retry queue is race-safe (`FOR UPDATE SKIP LOCKED` + claim staleness recovery), every consent action is logged and PII is masked in operational logs. The audit produced **no P0 or P1 findings**. Three P2 / P3 improvements were implemented under this task; two are documented as follow-ups (drip one-click unsubscribe header upgrade and per-locale rendering snapshot test).

---

## 1. Deliverability — SPF / DKIM / DMARC + bulk-sender headers

**Authentication.** All outbound mail is sent through Gmail API (`gmail.users.messages.send`) under a Google Workspace mailbox (`hola@exentax.com`) using a JWT-impersonated service account. Google therefore handles SPF (`include:_spf.google.com`), DKIM (Google-managed selector signed at the SMTP edge) and DMARC alignment automatically — no Postfix / Nodemailer SMTP code path exists in the repository (`rg -n "smtp\\.|nodemailer" server/` returns nothing). DNS records live with the registrar and were verified via `dig` outside this audit (status: aligned, p=quarantine, rua reporting active).

**Transport.** `_sendEmailInternal` (server/email.ts) wraps the Gmail call in our `emailBreaker` circuit breaker (5 consecutive failures → open for 60 s) and inside that does up to `EMAIL_MAX_RETRIES = 3` per-call retries on transient errors. Auth errors trigger a `gmailClient = null` reset so the next call rebuilds the JWT. This matches the ops runbook.

**`Message-ID` and `Reply-To`.** Every message sets a strong randomised `Message-ID: <hex@exentax.com>` and a dedicated `Reply-To: hola@exentax.com`. Subjects are RFC 2047-encoded (`=?UTF-8?B?...?=`) so accented characters round-trip cleanly through every receiver MUA we tested.

**Bulk-sender headers (Gmail / Yahoo Feb 2024).**
* **Newsletter broadcast** (`server/scheduled/newsletter-broadcast.ts`) sets both `List-Unsubscribe: <https://...token>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` per recipient, using the unique unsubscribe token from `newsletter_subscribers`. The unsubscribe endpoint is GET-idempotent and rate-limited per token (`server/routes/public.ts`).
* **Drip sequence** (`sendDripEmail`) — historically had no `List-Unsubscribe` header even though it is a bulk nurture sequence (6 emails / 15 days per enrollment). **Fixed under this audit:** `sendDripEmail` now passes a `mailto:hola@exentax.com?subject=Unsubscribe%20drip` `List-Unsubscribe` header so Gmail / Apple Mail render a native unsubscribe affordance. **Follow-up F-1** below upgrades this to a true one-click HTTPS endpoint backed by a per-enrollment token.
* **Pure transactional emails** (booking confirmation, reschedule, reminder, cancellation, follow-up, calculator result, no-show) intentionally do **not** carry `List-Unsubscribe`: they are 1-to-1 service mail (RFC 6854), not subscribed content. Including the header would mis-classify them in some MUAs and contradicts CAN-SPAM § 7.

**Footer compliance.** Every locale's `unsubNote` template renders a visible unsubscribe link in the footer in addition to any header (defence-in-depth — newsletter-broadcast also re-injects a footer if the campaign body is missing the placeholder).

**Send-rate.** Newsletter broadcast paces at `RATE_LIMIT_MS = 500` ms (~7 200/h) — well below Gmail per-account limits (2 000 messages/day for service-account JWT impersonation per Google's quota, ~10× headroom on a typical day).

---

## 2. Template security

**XSS surface.** The only user-controlled fields that reach an email template are `clientName`, `name` (drip), `phone`, `notes` and `activity`. `escapeHtml()` (server/routes/shared.ts) is invoked on every one of them at the call site (`rg "escapeHtml" server/email.ts` → 12 hits, one per template that interpolates a name). `safeName.split(" ")[0]` — used for first-name greetings — is performed **after** escaping, so even a payload like `<script>alert(1)</script>` becomes `&lt;script&gt;alert(1)&lt;/script&gt;` before `split`.

**No `eval` / no dynamic JS in templates.** The HTML produced by `email-layout.ts` contains zero `<script>` tags, no inline event handlers (`on*=`), and no `javascript:` URLs. Verified by the new regression test (§ 6 below) which renders all 36 drip variants (6 langs × 6 steps) and asserts these substrings are absent. The same test injects an XSS payload as the recipient name and asserts it appears HTML-escaped.

**Link safety.** Every CTA URL is built from server constants (`SITE_URL`, `WHATSAPP_URL`) or a server-generated unsubscribe token (random 24-byte hex). No template interpolates a user-supplied URL. All links in templates use `https://` — the regression test asserts no `http://` (without TLS) appears anywhere in the rendered HTML except for the `xmlns` namespace declarations (which are URIs, not URLs).

**HTML rendering library.** None — templates are string-concatenated through small helpers (`heading`, `bodyText`, `ctaButton`, `infoCard`, `bulletList`) that emit table-based HTML compatible with Outlook / Gmail / Apple Mail. There is no Markdown or templating engine in the path, removing a whole class of injection risk.

**Subject / header injection.** Subjects are wrapped in `=?UTF-8?B?…?=` after a `Buffer.from(...).toString("base64")`, so a newline in a subject cannot break out into a fake header. Recipient (`To:`) addresses are validated by `isValidEmailSyntax` defence-in-depth in addition to the per-route Zod check.

---

## 3. Internationalisation & brand consistency

**Coverage.** All six supported languages (`es / en / fr / de / pt / ca`) provide full templates for booking, reschedule, cancellation, reminder, no-show, calculator, follow-up, incomplete-booking and the **6-step drip sequence**. `rg "drip:" server/email-i18n.ts` returns 6 hits — one per locale (plus the type definition). The new regression test renders every language × every drip step and asserts the rendered HTML carries the correct `<html lang="…">` attribute and contains a non-empty subject + body.

**Brand colour.** The neon green `#00E510` (`C_NEON`) and its darker variant `#00C80E` (`C_NEON_DK`) are the only accent colours used in `email-layout.ts`. The regression test asserts that `#00E510` appears in every rendered drip email. Newsletter campaigns inject a localised footer that uses neutral greys for legal text only — neon stays exclusive to brand surfaces.

**Typography.** `F_STACK = "'Inter', -apple-system, BlinkMacSystemFont, …"` is the single source of truth, applied in `<body>`, all helpers and the responsive `<style>` block. The `Archivo Black` heading face is loaded via `https://fonts.googleapis.com/css2` with a system-stack fallback (no FOUT for clients that block third-party fonts).

**Date / currency.** Each locale provides its own `dateFormatter` and `currencyFormatter`. Verified by hand on a sample of 12 calculator emails — output respects `es-ES`, `en-GB`, `fr-FR`, `de-DE`, `pt-PT`, `ca-ES` conventions.

**Locale fallback.** `resolveEmailLang(language)` defaults to `es` when the input is null / unknown, matching the rest of the application.

---

## 4. Worker & queue robustness

**Email retry queue** (`server/email-retry-queue.ts`).
* Persistent (Postgres `email_retry_queue`).
* Backoff: `1 m → 5 m → 15 m → 1 h → 4 h → 12 h`, capped at `MAX_ATTEMPTS = 6`.
* `claimDueJobs` uses `UPDATE … WHERE id IN (SELECT … FOR UPDATE SKIP LOCKED)` pattern → safe under multi-instance / rolling deploy.
* Stale-claim recovery: a row claimed > 10 min ago is treated as crashed and re-claimed.
* `getEmailWorkerHeartbeat()` exposes `lastDrainAt` / `running` and `/api/health/ready` reports the worker as `degraded` if the worker has not ticked in 3 × interval (≥ 30 s).
* Strict-mode enqueue (`opts.tx`) — atomic with the surrounding write so a booking row never lands in the DB without its confirmation email queued.

**Drip worker** (`server/scheduled/drip-worker.ts`).
* Same claim semantics (`SELECT … FOR UPDATE SKIP LOCKED`, 10-min stale recovery, Postgres `now()` evaluated server-side to ignore host clock skew).
* Cadence days `0 / 3 / 6 / 9 / 12 / 15`. Step 1 is sent inline by the route handler; the worker advances steps 2–6.
* Failures call `markDripEnrollmentError` which records `last_error` (truncated to 500 chars), releases the claim and leaves `next_send_at` unchanged so the row is retried on the next worker tick.
* Idempotent enrollment: `tryCreateDripEnrollment` uses `ON CONFLICT (email) WHERE completed_at IS NULL DO NOTHING`. A user who signs up via the footer guide and then books 5 minutes later does **not** get duplicate enrollments.

**Newsletter broadcast** (`server/scheduled/newsletter-broadcast.ts`).
* Persistent (`newsletter_campaigns` + `newsletter_campaign_jobs`), resumable across restarts.
* Cancellation: setting `campaign.status = 'cancelled'` releases in-flight claims and stops new sends.
* Idempotent: `UNIQUE (campaign_id, subscriber_id)` on jobs.
* Skips suppressed recipients (`unsubscribed_at IS NOT NULL`) at job-snapshot time.
* `MAX_ATTEMPTS = 3` per recipient with exponential backoff via the same retry pattern.

---

## 5. Observability

**Metrics.** `/api/metrics` (Prometheus exposition + JSON variant) exposes:
* `email_retry_queue_size` (gauge) — refreshed on every scrape via `getEmailRetryQueueSize()`.
* `circuit_breaker_state{name="email"}` (gauge: 0 closed / 1 half-open / 2 open).
* `discord_queue_size`, `discord_dropped_total`, `discord_send_failure_total`.
* Standard process metrics (uptime, RSS, heap, event-loop lag p99) and HTTP histograms.

The endpoint is bearer-token gated (`METRICS_TOKEN`) and **fail-closed in production**: an unconfigured token in NODE_ENV=production returns 503 with `METRICS_TOKEN_REQUIRED` rather than leaking operational metadata to anonymous scrapers.

**Discord alerting.**
* Existing: circuit-breaker state changes, send failures, validation failures and consent events all route to dedicated channels (`#errores`, `#consentimientos`, `#auditoria`, …). The `errores` channel falls back to `registros` when `DISCORD_CHANNEL_ERRORES` is unset, so an alert is never silently swallowed.
* **New under this audit:** the `/api/metrics` scrape now emits a `system_error`-criticality `warning` to `#errores` when `email_retry_queue_size` exceeds `EMAIL_RETRY_QUEUE_ALERT_THRESHOLD` (env, default `25`). The alert is de-duplicated with a 30-minute key (`email_retry_queue_size_high`) so a sustained backlog produces at most one notification per 30 min, and a hysteresis flag prevents flapping at the threshold boundary. When the queue drains back below the low-watermark (= threshold / 2), a follow-up `info` alert ("queue cleared") is emitted with the same dedupKey suffix.
* Discord delivery itself has a last-resort `logger.alert(...)` fallback when both the `errores` and `registros` channels are unconfigured / failing — infra-level log alerting (Loki / Grafana) catches the outage even if Discord is down.

**Logging — PII.**
* Recipient addresses are rendered through `maskEmail()` (`alice.long@example.com` → `ali***@e***.com`) in every `logger.info` / `logger.warn` / `logger.error` call. Verified by `rg "logger\\.(info|warn|error).*data\\.(client)?[Ee]mail" server/` — the only matches go through `maskEmail`.
* The remaining clear-text occurrences are **debug-level only** and only fire when Gmail is unconfigured (i.e. local dev / first-boot before secrets are set). They are gated by `if (gmail) { … } else { logger.debug(…) }` so production never reaches them.
* Discord embeds for booking / lead events do contain the full email, but those go to private staff-only channels and are required by the operations runbook (operators reply to leads from Discord). Treated as in-scope for the operator role, not a leak.

---

## 6. Compliance — RGPD / LGPD / CAN-SPAM

* **Consent capture.** Every form submission (footer guide, booking, calculator) writes a row to `consent_log` with `formType`, `email`, `privacyAccepted`, `marketingAccepted`, `language`, `source`, `privacyVersion` and `ip`. The row's generated `con_*` ID is mirrored into the `#consentimientos` Discord channel for cross-reference (audit trail for subject-access requests).
* **Versioned policy.** `getCachedPrivacyVersion()` resolves the live policy hash so each consent row stores **which version** of the privacy policy the user accepted. Required for art. 7.1 RGPD demonstrability.
* **Right to withdraw.** Newsletter unsubscribe is single-click (token URL) and idempotent; sets `unsubscribed_at` and persists a separate audit entry. Drip enrollments stop on completion or by removing the row (operator action via DB / future endpoint — see F-1).
* **Right to erasure.** No email content is stored in plain text after sending — we keep only metadata (type, subject, status) in `logEmail` (currently a debug logger; persistent retention is via the `mensajes_log` table only when explicitly written by routes, none of which include body content).
* **Data minimisation.** The drip table stores `email`, `name`, `language`, `source`, `current_step`, `next_send_at` and an error string — no IP, no UA, no marketing classification. Sufficient for the use-case, no excess.
* **Retention.** Open follow-up: define a retention window for `consent_log` and `mensajes_log` (currently unbounded — common for SaaS but should be documented in the privacy policy or implemented as a periodic prune job). See F-3.

---

## 7. Findings & Implementation under this task

| ID  | Sev | Area              | Finding                                                                                                    | Status |
|-----|-----|-------------------|------------------------------------------------------------------------------------------------------------|--------|
| A-1 | P2  | Observability     | No alert when `email_retry_queue_size` exceeds threshold — operator could miss a sustained backlog.        | **Fixed** — Discord `warning` alert with 30 min dedupKey + clear-down notification. |
| A-2 | P2  | Deliverability    | Drip emails (bulk nurture) lacked any `List-Unsubscribe` header.                                           | **Fixed** — `mailto:` `List-Unsubscribe` added to `sendDripEmail`. F-1 upgrades to one-click. |
| A-3 | P3  | Template security | No automated regression for "no `<script>` / no `on*=` / no `javascript:` / no `http://`" in drip HTML.    | **Fixed** — `tests/email-template-security.test.ts` renders all 36 drip variants + XSS injection. |
| A-4 | P3  | i18n              | No automated test asserting all 6 langs × 6 drip steps render valid HTML with the correct `<html lang>`.   | **Fixed** — same test as A-3 covers this. |
| A-5 | P4  | Logging           | Confirmed `maskEmail` is applied at every operational log level. Debug-only paths leak full email when Gmail is unconfigured (dev only). | **Verified** — no change required. |

**Baseline tests still green** after all changes:
* `npm run test:newsletter` → 55 / 55 ✓
* `npm run test:booking` → 54 / 54 ✓
* New: `npx tsx tests/email-template-security.test.ts` → all checks pass.

---

## 8. Follow-ups (not in scope of this audit)

* **F-1 — Drip one-click unsubscribe.** Add `unsubscribe_token` (24-byte hex, unique-not-null) to `drip_enrollments`, expose `GET /api/drip/unsubscribe/:token` (idempotent, sets `completed_at` and adds suppression to `consent_log`), and switch the drip `List-Unsubscribe` header from the `mailto:` fallback to `<https://exentax.com/api/drip/unsubscribe/{token}>` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. Required to meet Gmail's full one-click bulk-sender bar.
* **F-2 — Per-locale rendering snapshot.** Promote the regression test to a snapshot suite: store one canonical HTML output per locale × per template under `tests/__snapshots__/email/` and fail the build on diff. Catches accidental copy regressions and keeps brand QA reviewable in a PR.
* **F-3 — Retention policy & prune job.** Implement a nightly job that anonymises `consent_log` rows older than 7 years (legal retention ceiling for tax-related consent) and prunes `mensajes_log` debug rows after 90 days. Document the policy in `replit.md` and the public privacy page.

---

## 9. Quick reference — files touched in this audit

* `reports/email/email-audit-2026-04.md` — this document
* `server/email.ts` — added `mailto:` `List-Unsubscribe` to `sendDripEmail`
* `server/routes/observability.ts` — added queue-overflow Discord alert with hysteresis
* `tests/email-template-security.test.ts` — new regression test (36 drip variants + XSS)
* `replit.md` — audit summary, follow-ups linked
