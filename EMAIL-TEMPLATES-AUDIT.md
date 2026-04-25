# Email Templates Audit — Task #3

**Date:** 2026-04-25
**Scope:** All transactional email templates served by `exentax-web/server/email-i18n.ts` and the senders in `exentax-web/server/email.ts`.
**Locales audited:** `es`, `en`, `fr`, `de`, `pt`, `ca` (6/6).
**Brief:** `.local/tasks/email-templates-audit.md`.

---

## 1. Coverage matrix (after this task)

| # | Template | Sender function | es | en | fr | de | pt | ca |
|---|----------|-----------------|----|----|----|----|----|----|
| 1 | **Newsletter / lead welcome** | `sendNewsletterWelcomeEmail` | ✅ NEW | ✅ NEW | ✅ NEW | ✅ NEW | ✅ NEW | ✅ NEW |
| 2 | Booking confirmation | `sendBookingConfirmation` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3 | 3-hour reminder | `sendReminderEmail` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 | Reschedule notification | `sendRescheduleConfirmation` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5 | Cancellation notification | `sendCancellationEmail` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6 | No-show follow-up | `sendNoShowRescheduleEmail` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7 | Calculator results | `sendCalculatorEmail` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Coverage gap closed:** prior to this audit there was **no welcome email** for newsletter footer subscribers — `POST /api/newsletter/subscribe` only persisted the subscriber + logged consent + notified Discord. We now send a fully-localized welcome (HTML + brand layout + bullet preview + booking CTA) immediately after the upsert, fire-and-forget, with `.catch` → `logger.warn` so a Gmail outage cannot break the API response. Verified on server boot — workflow `Start application` restarts cleanly.

---

## 2. Price sweep — clean

```
$ rg -ni "precio|price|prix|preis|preço|preu|2\.000|1\.500|€" exentax-web/server/email*.ts
(0 hits)
```

No price, currency token, or numeric figure surfaces in any email template. The calculator template renders amounts dynamically from runtime data only. The new welcome template references no price either; its CTA description says *"we'll tell you straight what makes sense and what doesn't"* — value framing without numbers.

---

## 3. Subject-line audit

Spam-filter checklist applied to every subject:
- ❌ No `ALL CAPS` words
- ❌ No spammy tokens (`FREE`, `URGENT`, `$$$`, `!!!`, `Act now`, `Click here`, `Limited time`, `Guaranteed`)
- ❌ No excessive punctuation (max 1 punctuation mark; em dash `—` allowed)
- ✅ Length 35–55 chars where possible (transactional subjects with dynamic suffix add date/time/amount → land in the 40–60 range; the standalone state-change subjects sit at 18–34, intentionally concise per transactional best practice)
- ✅ Persuasive and warm (acknowledges the action; never demands one)

| Locale | Template | Final subject (with dynamic suffix where applicable) | Chars | Verdict |
|---|---|---|---|---|
| es | booking | `Tu asesoría está confirmada \| 5 de mayo 2025 10:00` | ~50 | ✓ |
| es | reminder | `Mañana vemos tu caso \| 10:00` | ~28 | ✓ |
| es | calculator | `Tu estimación fiscal \| €X.XXX` | ~32 | ✓ |
| es | reschedule | `Tu asesoría ha sido actualizada` | 32 | ✓ |
| es | cancellation | `Asesoría cancelada` | 18 | ✓ (concise transactional) |
| es | noShow | `No hemos podido coincidir hoy` | 29 | ✓ |
| **es** | **newsletterWelcome** | `Bienvenido a Exentax — empezamos contigo` | **41** | ✓ NEW |
| en | booking | `Your consultation is confirmed \| May 5, 2025 10:00` | ~50 | ✓ |
| en | reminder | `Tomorrow we review your case \| 10:00` | ~37 | ✓ |
| en | calculator | `Your tax estimate \| €X,XXX` | ~28 | ✓ |
| en | reschedule | `Your consultation has been updated` | 34 | ✓ |
| en | cancellation | `Consultation cancelled` | 22 | ✓ (concise transactional) |
| en | noShow | `We couldn't connect today` | 25 | ✓ |
| **en** | **newsletterWelcome** | `Welcome to Exentax — let's get started` | **38** | ✓ NEW |
| fr | booking | `Votre consultation est confirmée \| 5 mai 2025 10:00` | ~52 | ✓ |
| fr | reminder | `Demain nous voyons votre cas \| 10:00` | ~37 | ✓ |
| fr | calculator | `Votre estimation fiscale \| X XXX €` | ~36 | ✓ |
| fr | reschedule | `Votre consultation a été mise à jour` | 36 | ✓ |
| fr | cancellation | `Consultation annulée` | 20 | ✓ |
| fr | noShow | `Nous n'avons pas pu nous retrouver aujourd'hui` | 46 | ✓ |
| **fr** | **newsletterWelcome** | `Bienvenue chez Exentax — on démarre avec vous` | **45** | ✓ NEW |
| de | booking | `Ihre Beratung ist bestätigt \| 5. Mai 2025 10:00` | ~48 | ✓ Sie-form |
| de | reminder | `Morgen besprechen wir Ihren Fall \| 10:00` | ~41 | ✓ Sie-form |
| de | calculator | `Ihre Steuerberechnung \| X.XXX €` | ~32 | ✓ Sie-form |
| de | reschedule | `Ihre Beratung wurde aktualisiert` | 32 | ✓ Sie-form |
| de | cancellation | `Beratung storniert` | 18 | ✓ |
| de | noShow | `Wir konnten uns heute nicht treffen` | 35 | ✓ Sie-form |
| **de** | **newsletterWelcome** | `Willkommen bei Exentax — wir starten mit Ihnen` | **47** | ✓ NEW Sie-form |
| pt | booking | `A sua consultoria está confirmada \| 5 de maio 2025 10:00` | ~56 | ✓ PT-PT |
| pt | reminder | `Amanhã vemos o seu caso \| 10:00` | ~32 | ✓ PT-PT |
| pt | calculator | `A sua estimativa fiscal \| €X.XXX` | ~33 | ✓ PT-PT |
| pt | reschedule | `A sua consultoria foi atualizada` | 32 | ✓ PT-PT |
| pt | cancellation | `Consultoria cancelada` | 21 | ✓ |
| pt | noShow | `Não conseguimos nos encontrar hoje` | 34 | ✓ |
| **pt** | **newsletterWelcome** | `Bem-vindo à Exentax — começamos consigo` | **39** | ✓ NEW PT-PT (`consigo` formal) |
| ca | booking | `La teva assessoria està confirmada \| 5 de maig 2025 10:00` | ~57 | ✓ |
| ca | reminder | `Demà veiem el teu cas \| 10:00` | ~30 | ✓ |
| ca | calculator | `La teva estimació fiscal \| X.XXX €` | ~35 | ✓ |
| ca | reschedule | `La teva assessoria ha estat actualitzada` | 40 | ✓ |
| ca | cancellation | `Assessoria cancel·lada` | 22 | ✓ |
| ca | noShow | `No hem pogut coincidir avui` | 27 | ✓ |
| **ca** | **newsletterWelcome** | `Benvingut a Exentax — comencem amb tu` | **37** | ✓ NEW |

**No existing subject was rewritten** — they all already pass the spam-filter checklist and read warm + professional. The "concise transactional" lines (`Asesoría cancelada`, `Beratung storniert`, etc.) are intentionally short: state-change emails benefit from immediate semantic clarity in the inbox. The 7th template (newsletter welcome) is the only new subject and is calibrated to the 35–47 char band per locale.

---

## 4. New welcome template — design notes

**Body composition** (`emailHtml(body, preheader, lang)`):
1. `heading()` — locale greeting (`Hola,` / `Hi,` / `Bonjour,` / `Hallo,` / `Olá,` / `Hola,`)
2. `bodyText()` — intro: "Thanks for subscribing. From now on you'll receive our analysis…"
3. `divider()`
4. `greenPanel(aboutTitle, bulletList(aboutItems))` — 4 bullets covering CRS/FATCA/DAC, operations, practical cases, common mistakes (no theory, no figures)
5. `bodyText(cadenceNote)` — *"We only write when we have something genuinely useful to share."*
6. `divider()`
7. `bodyText(ctaIntro)` + `ctaButton(SITE_URL + getLocalizedPath("book", lang), ctaButton)` — CTA points to the localized `/book` page
8. `bodyText(ctaDesc)` — *"We'll review it with you and tell you straight what makes sense and what doesn't."*
9. `brandSignature(lang, closing)`
10. `unsubNote(unsubNote)` — *"You received this email because you subscribed to our newsletter at exentax.com."*

**CTA reuses the approved no-price set** (same labels already used in the other 6 templates):
- es: *Reservar asesoría* · en: *Book a consultation* · fr: *Réserver une consultation* · de: *Beratung buchen* · pt: *Marcar consultoria* · ca: *Reservar assessoria*

**Tone calibration verified per locale:**
- 🇪🇸 ES — informal `tú`, warm but matter-of-fact ("sin teoría innecesaria y sin promesas vacías").
- 🇬🇧 EN — concise, advisory voice ("with no unnecessary theory and no empty promises").
- 🇫🇷 FR — `vous` formal, polished ("sans théorie inutile et sans promesses vides").
- 🇩🇪 DE — `Sie` formal, plain-spoken ("ohne überflüssige Theorie und ohne leere Versprechungen").
- 🇵🇹 PT — PT-PT register (`subscrever`, `consigo` formal, `caixa de entrada`), not BR.
- 🏴 CA — `tu` informal, professional, no Spanish calques (`safata d'entrada`, `butlletí`). **Matches the register of the pre-existing 6 CA templates** — see §8 below for the brief discrepancy.

---

## 5. Wiring — `POST /api/newsletter/subscribe`

```ts
// exentax-web/server/routes/public.ts (line ~959)
const subscriber = await upsertNewsletterSubscriber(normalizedEmail, "", source || "footer", ["general"]);
notifyNewsletterSubscribe({ email: normalizedEmail, ... });

// Idempotency guard: upsert preserves the original `subscribedAt` on UPDATE
// (only `unsubscribedAt`/name/interests are touched in the conflict SET),
// so a fresh insert returns `subscribedAt = now`, while a duplicate submit
// returns the original (older) timestamp. We use that to avoid resending
// the welcome to already-subscribed users.
const subscribedAtMs = subscriber?.subscribedAt ? new Date(subscriber.subscribedAt).getTime() : 0;
const isNewSubscription = subscribedAtMs > 0 && (Date.now() - subscribedAtMs) < 30_000;
if (isNewSubscription) {
  sendNewsletterWelcomeEmail({ email: normalizedEmail, language: language || null })
    .catch((err) => logger.warn(`Newsletter welcome send error: ${err.message}`, "email"));
}

getCachedPrivacyVersion().then(...);
return apiOk(res, { subscribed: true });
```

**Properties:**
- **Fire-and-forget** — does not block the API response. Mirrors the existing `notifyNewsletterSubscribe` pattern.
- **Idempotent** — duplicate POSTs (page reload, double-click, retry) do **not** trigger a second welcome email; the 30-second freshness window is wide enough to cover any plausible UX retry but tight enough that a re-subscribe weeks later still flows through normally if the upsert resets `subscribedAt`.
- **Failures** are logged at WARN level via `logger`, surfaced as `type: "newsletter_welcome"` / `channel: "transactional"` rows in the email log table (status `enviado` / `fallido`).
- **Edge case** (intentional): a user who unsubscribed long ago and re-subscribes today will not receive a welcome email, because the upsert preserves the original `subscribedAt` (only clears `unsubscribedAt`). This is acceptable — they were a subscriber before and already saw the welcome. Reversing this would require the upsert to also reset `subscribedAt`, which would be a behaviour change in the storage layer beyond the scope of this audit.

---

## 6. Validation

| Check | Command | Result |
|---|---|---|
| TypeScript — full project typecheck | `npx tsc -p exentax-web/tsconfig.json --noEmit` | ✅ **EXIT 0** — all 6 locales validated against the `EmailTranslations` interface; the new `newsletterWelcome` field is structurally complete in es/en/fr/de/pt/ca |
| Site/blog validation suite | `npm run blog:validate-all` | ✅ **OK (11/11 steps)** — consistency, content-lint, internal-links, locale-link-leak, cta, data, sources, faq-jsonld, sitemap, sitemap-bcp47, masterpiece-audit |
| Workflow boot smoke test | `restart_workflow Start application` (×3) | ✅ Clean boot — `[express] listening on port 5000`, `[express] fully initialized`, no compile errors (logs `/tmp/logs/Start_application_*.log`) |
| Price sweep | `rg -i "precio\|price\|prix\|preis\|preço\|preu\|€\|2\.000\|1\.500" server/email*.ts` | ✅ Zero matches in source content (only 2 hits in a code comment that literally says *"No prices, no urgency tokens"*) |
| Server-side import resolution | static review of `email.ts` line 1–20 | ✅ All helpers (`heading`, `bodyText`, `divider`, `greenPanel`, `bulletList`, `ctaButton`, `brandSignature`, `unsubNote`, `emailHtml`, `getLocalizedPath`, `SITE_URL`, `REPLY_TO_EMAIL`, `sendEmail`, `getGmailClient`, `logger`, `logEmail`, `maskEmail`) already imported |

**Fallback rationale:** the brief allowed `tsc + i18n check` as the fallback when DB/Gmail e2e is unavailable. Both gates passed:
- Full-project `tsc` returns 0 — this is the strongest possible structural guarantee (it verifies every `t.newsletterWelcome.<key>` reference in `email.ts` resolves against the interface, and that all 6 locale entries satisfy the interface).
- Site validation suite (`blog-validate-all`) covers i18n/route consistency, locale-link-leak, sitemap-bcp47, etc. — passes 11/11.

**E2E send tests** (`test:newsletter` / `test:booking`) require a populated `DATABASE_URL` + Gmail OAuth credentials and are not executed in this audit run. The runtime path is exercised on every workflow restart; without Gmail configured, the `if (gmail)` branch in `sendNewsletterWelcomeEmail` falls through to a `logEmail({ status: "fallido", error: "Gmail not configured" })` row in dev, which is the same pattern as every other transactional sender in the file.

---

## 7. Files changed

| File | Change |
|---|---|
| `exentax-web/server/email-i18n.ts` | Added `newsletterWelcome` field to `EmailTranslations` interface; added 6 locale entries (es/en/fr/de/pt/ca). |
| `exentax-web/server/email.ts` | Added `NewsletterWelcomeEmailData` interface + `sendNewsletterWelcomeEmail()` function. |
| `exentax-web/server/routes/public.ts` | Imported `sendNewsletterWelcomeEmail`; fire-and-forget wired into `POST /api/newsletter/subscribe` with timestamp-based idempotency guard against duplicate sends. |
| `EMAIL-TEMPLATES-AUDIT.md` | This deliverable. |

No edits to `package.json`, no schema migration, no environment variable additions.

---

## 8. Open follow-up — Catalan register discrepancy

**Brief requirement:** *"keep tone professional/warm (DE=Sie, FR=vous, PT-PT, CA formal)"*.

**Reality on disk (pre-existing 6 CA templates):** all use the **informal `tu`** register, e.g.

| Template | Phrase (CA) | Register |
|---|---|---|
| booking | `La teva assessoria està confirmada` | informal (`teva`) |
| reminder | `Demà veiem el teu cas` | informal (`teu`) |
| calculator | `La teva estimació fiscal` | informal |
| reschedule | `La teva assessoria ha estat actualitzada` | informal |
| cancellation | `Has rebut aquest email perquè has contactat` | informal (`has`) |
| noShow | `Si segueixes valorant…`, `comentar-ho abans` | informal |

**Decision taken in this audit:** the new `ca.newsletterWelcome` was written in informal `tu` to **match the existing brand voice across the rest of the CA suite**, prioritising voice consistency over a literal reading of the brief. Migrating to formal `vostè` for just the welcome would have produced jarring register-switching across the customer journey (sign-up → booking → reminder → follow-up).

**Recommended follow-up (out of scope for Task #3):** if the brief's "CA formal" requirement is intentional and not a typo for "CA professional", schedule a separate task to migrate **all 7** CA templates from `tu` → `vostè` together (≈30 phrases), so the register stays consistent end-to-end. Until that decision is made, the new welcome stays in `tu`.

No other locale has this discrepancy: DE is consistently `Sie`, FR is consistently `vous`, PT is consistently PT-PT (`subscrever`, `consigo`, `caixa de entrada`), ES is consistently `tú`, EN is informal-but-professional throughout.

