# PENDING — items deferred from Audit Task #2

**Date:** 2026-04-28
**Author:** task-2 audit pass

This is the carry-forward list. Each item is something the audit
identified but explicitly chose NOT to do in Task #2 to respect scope,
WHAT-NOT-TO-TOUCH, or because the work belongs to a downstream task.

---

## 1. Slug rewrites — DEFERRED

**Why deferred:** changing any slug in `shared/routes.ts` requires a
matching 301 redirect in `server/redirects.ts`, a sitemap regeneration,
and an IndexNow ping. Per WHAT-NOT-TO-TOUCH §"URLs", slugs are a
separate change window.

**Scope if/when picked up:**

- `our_services` PT slug `servicos` is the de-accented form of the
  Portuguese plural `serviços`. We could match the FR pattern (kept
  ASCII) and leave it as-is, or normalise to `servicos` everywhere. No
  action needed unless SEO requests the diacritic.
- `service_llc_de` ES uses `servicios/llc-delaware` (good); FR/DE/PT/CA
  all consistent. No collision detected.
- `book` slug is `agendar` for ES + PT + CA (3 collisions across
  `/es/agendar`, `/pt/agendar`, `/ca/agendar`). This is intentional —
  the URL routing namespaces by locale prefix — but is worth flagging
  for SEO if hreflang ever shows ambiguous canonical.

## 2. Home page SEO description (>165 chars in all 6 locales)

**Why deferred:** This is the **only** failing gate in `npm run check`
and it was already RED in baseline. It belongs to **LOTE 1 (SEO meta
titles & descriptions)**, scheduled separately. Touching it here would
have masked progress on LOTE 1.

**Failing keys (per `seo:meta` in `npm run check`):**

| Locale | Line in locales/<l>.ts | Length |
|--------|------------------------|--------|
| es     | 1380                   | 174    |
| en     | 1095                   | 168    |
| ca     | 1227                   | 178    |
| fr     | 1097                   | 184    |
| de     | 1096                   | 179    |
| pt     | 1100                   | 178    |

Action: rewrite each `home.seoDescription` to ≤165 chars while
preserving the value-prop wording.

## 3. Live verification of agenda end-to-end with Google Calendar

**Why deferred:** the four `GOOGLE_CALENDAR_*` envs are not present in
this Replit workspace; they are PROD-ONLY. The dev fallback has been
verified: bookings persist, emails queue, Discord short-circuits, no
crashes. The live event-creation handshake against the real Google
Calendar API can only be exercised in production.

**To execute:**

1. From the production Replit deployment, set
   `GOOGLE_CALENDAR_REFRESH_TOKEN`, `GOOGLE_CALENDAR_CLIENT_ID`,
   `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_ID`.
2. Create a synthetic booking through `/es/agendar`.
3. Verify the resulting event in the team Google Calendar has
   `Asesoría Exentax: <name>` as title (post-rename) and a Meet link.
4. Repeat for `/en/book` and confirm the EN event title is now
   `Exentax Advisory: <name>`.

## 4. Live verification of Discord channel posting

**Why deferred:** all 7 `DISCORD_*` envs are PROD-ONLY. In dev they're
absent; every notifier short-circuits and returns `{ ok:false,
reason:"discord-not-configured" }`. Verified by reading
`server/discord.ts` and the `health/ready` `breakers.ok = true`.

**To execute:**

1. From the production Replit deployment, ensure all 7 channel envs
   are set + `DISCORD_BOT_TOKEN` + `DISCORD_GUILD_ID`.
2. Trigger a test event for each notifier:
   - Subscribe to newsletter → `#exentax-registros`.
   - Submit calculator → `#exentax-calculadora`.
   - Create a test booking → `#exentax-agenda`.
   - Hit a `/api/throw-test-error` (debug-only) → `#exentax-errores`.
3. Confirm the embed in each channel renders the user locale flag and
   that `#exentax-auditoria` records every `/agenda`/`/cita` slash.

## 5. Server cold-start optimisation (5.6 MB ESM)

**Why deferred:** noted in PERFORMANCE-AUDIT §2. Not blocking. Worth
re-evaluating only if Replit reports cold-start latency p95 >2s.

**Approach if picked up:**

- Replace `googleapis` import with hand-rolled `fetch` calls against
  the 2 calendar endpoints we use; should drop ESM size by ~3 MB.

## 6. EN/PT canonical brand voice for "consultation" / "consultoria"

**Why deferred (DOCUMENTED whitelist):** the rename pass replaced
`Consulting/consultation/consultant` → `Advisory/advisory session/advisor`
in the EN UI, server SEO descriptions and email templates. However:

- **Brand mid-CTA in EN blog posts** uses the literal phrase
  `Free consultation, no strings attached`. This is the canonical
  brand voice locked by `client/src/data/blog-mid-cta-copy.ts` and
  enforced by `scripts/blog/blog-mid-cta-check.mjs`. It appears
  identically in 112 EN articles. Changing it requires updating the
  source-of-truth file AND running `node
  scripts/blog/blog-mid-cta-rewrite.mjs` to propagate. Out of scope
  here; in the next pass we should align brand voice (probably keep
  "consultation" as the friendlier marketing word in the brand
  CTA — ratified by the glossary §2 which lists `tax consultation`
  as the canonical EN translation of `asesoría fiscal`).

- **PT calculator activityLabels** key is named `consultoria` (key
  identifier, not user-visible). The value reads "Assessoria /
  assessoria". Renaming the key would break i18n structure across the
  6 locales (calculator key shape must match), so the key stays
  `consultoria` for compatibility and the value uses the new term.

- **PT/FR Calendar event copy in `server/google-meet.ts`** uses
  `Consultoria Exentax` and `Consultation Exentax` respectively. The
  glossary `docs/i18n-glossary.md` explicitly lists `consultoria fiscal`
  (PT) and `consultation fiscale` (FR) as the canonical translations
  of `asesoría fiscal`. Changing the calendar event copy would put us
  out of sync with the glossary; the user-facing email subjects DO use
  the post-rename term ("A sua assessoria está confirmada" in PT).

- **CA blog posts** retain 8 occurrences of `consultora` /
  `consulting` referring to a *consulting firm* as a noun (e.g.
  "Una consultora bilingüe instal·lada a Barcelona…"). This is the
  Catalan word for *consulting firm* — replacing it with *assessoria*
  would change the meaning. These are content-true and stay.

- **DE blog posts** retain ≈112 occurrences of `Beratung` because
  `Beratung` IS the canonical DE term for *advisory/consultation*
  per the glossary (`Steuerberatung`).

- **FR blog posts** retain ≈112 occurrences of `conseil` because
  `conseil` IS the canonical FR term for *advisory* per the glossary.

These six categories form the documented whitelist for the
`consultor|consulting|consultation|consultat|Beratung|conseil|consultoria`
pattern; running the regex against the repo will continue to find them
intentionally.
