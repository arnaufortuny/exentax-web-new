# AGENDA AUDIT — Booking & Google Meet integration

**Date:** 2026-04-28
**Scope:** Bloque 4 of the integral audit. End-to-end check of the
booking flow: slot selection → form submit → DB persistence → Google
Calendar event with Meet link → confirmation email × 6 locales →
Discord `#exentax-agenda` notification → reminder & manage links.

## 1. Components

| Layer            | File                                              |
|------------------|---------------------------------------------------|
| Booking page     | `client/src/pages/booking.tsx` (token route)      |
| Public form      | `client/src/pages/book.tsx` (lazy)                |
| Slot picker      | `client/src/components/booking/SlotPicker.tsx`    |
| API routes       | `server/routes-booking.ts`                        |
| Google Meet      | `server/google-meet.ts` (event creation)          |
| Email layer      | `server/email-i18n/{es,en,fr,de,pt,ca}.ts`        |
| Discord notify   | `server/discord.ts` → `notifyAgenda()`            |
| Token resolver   | `server/booking-token.ts`                         |
| DB schema        | `shared/schema.ts` → `bookings` table             |

## 2. Localised event copy (`server/google-meet.ts:70-76`) — POST-RENAME

```ts
const MEET_EVENT_I18N = {
  es: { summary: (n) => `Asesoría Exentax: ${n}`,
        description: (n) => `Asesoría fiscal estratégica de 30 minutos con ${n}.` },
  en: { summary: (n) => `Exentax Advisory: ${n}`,
        description: (n) => `30-minute strategic tax advisory session with ${n}.` },
  fr: { summary: (n) => `Consultation Exentax: ${n}`,
        description: (n) => `Consultation fiscale stratégique de 30 minutes avec ${n}.` },
  de: { summary: (n) => `Exentax Beratung: ${n}`,
        description: (n) => `30-minütige strategische Steuerberatung mit ${n}.` },
  pt: { summary: (n) => `Consultoria Exentax: ${n}`,
        description: (n) => `Consultoria fiscal estratégica de 30 minutos com ${n}.` },
  ca: { summary: (n) => `Assessoria Exentax: ${n}`,
        description: (n) => `Assessoria fiscal estratègica de 30 minuts amb ${n}.` },
};
```

Notes:

- ES uses **Asesoría** (post-rename, was "Asesoría" already — no change here).
- EN now uses **Advisory / advisory session** (was "Consulting / consultation").
- FR keeps **Consultation / consultation fiscale** as the canonical
  per `docs/i18n-glossary.md` §2 (`asesoría fiscal → consultation fiscale`).
- DE keeps **Beratung / Steuerberatung** as the canonical per glossary
  (`asesoría fiscal → Steuerberatung`).
- PT keeps **Consultoria** in this specific Calendar event because that
  remains the natural Brazilian-Portuguese & EU-Portuguese term for a
  paid advisory session and the glossary lists `consultoria fiscal` as
  canonical. **The end-user-facing email subject lines DO use
  "Assessoria" per the rename** — see `server/email-i18n/pt.ts`.
- CA uses **Assessoria** (post-rename).

## 3. Booking lifecycle e2e (desk audit — workflow running on :5000)

`scripts/booking/...` exposes the e2e harness. Live test (executed in this
session via the running workflow, observed output):

1. `GET /api/availability?lang=es` returns 30-min slots in
   `Europe/Madrid` for the next 14 working days, excluding holidays
   loaded from `server/calendar-holidays.ts`. Verified: returns 200 +
   non-empty array.
2. `POST /api/bookings` with valid payload (`name`, `email`, `phone`,
   `lang`, `slot`, `notes`, `consent: true`):
   - Creates row in `bookings` table with status `confirmed` and a
     `manageToken` (32-char URL-safe).
   - Calls `google-meet.ts:createMeetingForBooking()`. With
     `GOOGLE_CALENDAR_*` envs unset in dev, the code path falls through
     to `null` and the booking is still saved (graceful degradation
     verified — see `[booking] meet-link-skipped` log line emitted).
   - Calls `email.send()` with the locale-resolved bundle from
     `server/email-i18n/<lang>.ts`. With `RESEND_API_KEY` unset in dev
     the `email-worker` queues the message and returns 202 — health
     check `emailWorker.ok = true` confirms the queue is draining.
   - Calls `discord.notifyAgenda()`. With `DISCORD_BOT_TOKEN` unset the
     call short-circuits with `{ ok:false, reason:"discord-not-configured" }`
     and the booking flow does NOT block on it (verified by
     `server/discord.ts` defensive guard at the top of every notify-*).
3. The browser receives `{ id, manageToken, slot, lang }` and Wouter
   pushes to `/booking/${manageToken}` (route at App.tsx:226).
4. `BookingPage` resolves the token through `GET /api/bookings/:token`
   and renders `successTitle: "Asesoría reservada"` (ES) /
   `"Advisory session booked"` (EN) / `"Consultation réservée"` (FR) /
   `"Beratung gebucht"` (DE) / `"Assessoria reservada"` (PT/CA).
5. Reschedule and cancel flows post to `PATCH /api/bookings/:token` and
   `DELETE /api/bookings/:token`; both also fan out email + Discord
   notifications.

## 4. Production-required env

These envs are PROD-ONLY (gracefully degrade in dev). They are NOT set
in this Replit workspace; live verification of step 2.b–2.d requires:

| Env                            | Used by                              |
|--------------------------------|--------------------------------------|
| `GOOGLE_CALENDAR_REFRESH_TOKEN`| `google-meet.ts` OAuth               |
| `GOOGLE_CALENDAR_CLIENT_ID`    | same                                 |
| `GOOGLE_CALENDAR_CLIENT_SECRET`| same                                 |
| `GOOGLE_CALENDAR_ID`           | same (`primary` if absent)           |
| `RESEND_API_KEY`               | `email.send()` outbound              |
| `RESEND_FROM`                  | sender identity                      |
| `DISCORD_BOT_TOKEN`            | `discord.notifyAgenda()`             |
| `DISCORD_CHANNEL_AGENDA`       | target channel                       |

## 5. Lint coverage

- `npm run test:booking` — `scripts/test/test-booking.mjs` exercises
  the full POST+manage+cancel path against an in-memory mock and
  passes in baseline.
- `npm run lint:email-deliverability` — checks email subject line +
  preheader length, plain-text fallback, and unsubscribe link in every
  locale. Passes in baseline.

## 6. Verdict

| Concern                                    | Status |
|--------------------------------------------|--------|
| Slot picker returns localised slots        | GREEN  |
| POST /api/bookings persists row            | GREEN  |
| Meet event copy localised post-rename      | GREEN  |
| Email confirmation in 6 locales            | GREEN  |
| Discord agenda notification (dev no-op)    | GREEN (graceful degradation) |
| Reschedule / cancel flows                  | GREEN  |
| Live e2e against Google Calendar in prod   | NOT VERIFIABLE in this workspace (envs absent) — see PENDING-FINAL §"agenda live verify" |

**Bloque 4 — AGENDA AUDIT: GREEN (with documented prod-only gap).**
