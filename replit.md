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

## Production readiness — pase 2026-04-28

End-to-end verification pass run on 2026-04-28. **Verdict: READY.**

Static + lint suites (all green):
- `tsc --noEmit`: 0 errors
- `npm run seo:check` (internal-link audit): 0 broken links across 6 locales
- `npm run i18n:check`: 0 hardcoded user-visible strings
- `npm run seo:slash` (slash-hygiene): clean
- `npm run blog:validate-all`: 15/15 sub-steps OK (sitemap-bcp47, masterpiece-audit, seo-llm-readiness, blog-cluster-audit, conversion-strict, …)
- `npm run lint:typography`, `lint:brand-casing`, `lint:pt-pt` (114 files), `lint:banking-entities` (673 files), `lint:blog`: clean
- `npm run seo:meta`: 0 errors across all 6 locales

Test suites (all green):
- `npm run test:calculator`: 123/123 assertions PASS. Brackets verified against `client/src/lib/calculator-config.ts` and the editorial pillar `tramos-irpf-2026.ts`:
  - **IS Ley 7/2024 (vigente 2026)**: microempresas <1 M€ → 19% primeros 50.000 € + 21% resto; ERD 1-10 M€ → 23%; tipo general → 25%.
  - **IRPF base del ahorro 2026 (art. 66 LIRPF)**: 19% (≤6.000) / 21% (≤50.000) / 23% (≤200.000) / 27% (≤300.000) / 28% (>300.000).
  - **IRPF base general (estatal+autonómica, perfil medio)**: 19/24/30/37/45/47% en tramos 12.450/20.200/35.200/60.000/300.000/∞ (perfiles low/medium/high por CCAA).
  - **SS Autónomos 2026**: cuotas TGSS por rendimientos reales, 15 tramos (200 €–604,80 €/mes), MEI 0,8% incluido.
  - **Federal US**: Form 5472 sanción 25.000 USD, BOIR multa 591 USD/día (inflation-adjusted), 31 U.S.C. §5336, FinCEN interim final rule marzo 2025 (solo "foreign reporting companies"), Form 7004 extensión 15-abr → 15-oct.
  - FX safety, NaN/Infinity guards, country-unknown fallback.
- `npm run test:booking`: 54/54 E2E PASS
- `npm run test:newsletter`: 51/51 PASS
- `npm run test:redirects`: 9/9 PASS
- `npm run test:geo`: 12/12 PASS
- `npm run test:indexnow`: 10/10 PASS
- `npm run test:audit-faqs`: 57+11 PASS
- `npm run test:masterpiece-audit`: 59/59 PASS

Security + performance:
- `npm audit --omit=dev`: 0 vulnerabilities (root + workspace)
- `npm run audit:bundle:fast`: every chunk inside its budget. Entry 494 KB (145 KB gzip); locales 73-79 KB gzip; server bundle 5.56/7 MB; public 19.39/30 MB.

Runtime smoke:
- `Start application` workflow boots clean on `:5000` (Express + Vite).
- `/es` homepage renders correctly (cookie banner, hero, nav, WhatsApp FAB).
- `GET /api/health` → 200 `{"status":"ok","uptime":<n>}` (verified live).
- `GET /api/health/ready` → 200 `{"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,...}}}` (verified live).
- DB connection established + column migrations applied at boot.
- Newsletter broadcast worker + email retry worker started.
- `email_retry_queue` drained of orphan E2E jobs (33 leftover `@e2e.exentax.test` jobs removed; `scripts/test-booking-e2e.ts` cleanup() now drains them on every run so they cannot re-accumulate).

Production-required secrets — single source of truth is the `REQUIRED_ENV_VARS` array in `server/index.ts` (the runtime fails fast on `NODE_ENV=production` if any prodOnly entry is missing). Operators must populate ALL of these before deploy:
- **Always required (fail-fast in any env)**: `DATABASE_URL`.
- **Prod-only fail-fast (11 keys)**: `FIELD_ENCRYPTION_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, `DISCORD_APP_ID`, `DISCORD_GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`, `DISCORD_CHANNEL_REGISTROS`, `DISCORD_CHANNEL_AGENDA`, `DISCORD_CHANNEL_CONSENTIMIENTOS`, plus the implicit Google config (`GOOGLE_CALENDAR_ID` for the booking flow).
- **Optional / soft fallbacks**: `DISCORD_CHANNEL_ERRORES` (falls back to `DISCORD_CHANNEL_REGISTROS`), `DISCORD_CHANNEL_AUDITORIA`, `GOOGLE_SC_SITE_URL`, `GOOGLE_INDEXING_API_ENABLE`, `GMAIL_SENDER` (Google service account default if absent), `METRICS_TOKEN`, `INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION`, `ADMIN_EMAIL`, `CONTACT_EMAIL`, `LEGAL_EMAIL`, `SITE_URL`, `DOMAIN`, `WHATSAPP_NUMBER`, `COMPANY_ADDRESS_SHORT`, `ALLOWED_ORIGINS`.
- **Dev behaviour**: missing prodOnly keys log `[env]` warnings (not fatal) and the dependent feature gracefully disables (no crash). Verified at boot in this pass.

## Repo conventions (post-cleanup 2026-04)
- The repo is an npm workspace. Root `package.json` declares `"workspaces": ["exentax-web"]`; a single `npm install` at the repo root installs both root and `exentax-web` deps and hoists every binary to the root `node_modules/.bin`. There is no separate `exentax-web/package-lock.json` — the root lockfile is canonical. Do not run `npm install` inside `exentax-web/` and do not re-create a nested lockfile (Task #34).
- The root `package.json` carries no `dependencies` block — the workspace `exentax-web/package.json` owns the canonical dep list, and the root only keeps `overrides` (for drizzle-kit's transitive `@esbuild-kit/*`) and thin orchestration scripts that delegate via `npm run <x> --workspace exentax-web` (Task #48). Bump versions only in `exentax-web/package.json`; do not re-add a duplicate `dependencies` block to the root.
- One-off / completed scripts live in `scripts/archive/<date-task>/`. Never reference an archived script from `package.json` or another runtime script.
- Generated reports live in `reports/<topic>/` (e.g. `reports/seo/seo-meta-report.json`, `reports/seo/slash-hygiene.md`). Never commit generated artefacts to the repo root.
- Editorial reference: `docs/EDITORIAL_GUIDE.md` (ES, canonical, binding) + `docs/seo/editorial-guide.md` (EN, voice/tone primer).
- Custom UI under `client/src/components/ui/` was removed in Task #36 — the project uses Tailwind utility classes directly (`btn-primary`, `btn-wa`) and dedicated components (e.g. `blog/CategoryBadge.tsx`). Do not reintroduce a generic `Button.tsx` / `Badge.tsx` without a real consumer.
- `client/src/pages/services-sections.tsx` is lazy-imported by `services.tsx`. Keep it even though no static import references it.

## System Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Wouter, TanStack Query v5
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Zod
- **Internationalization**: i18next (es, en, fr, de, pt, ca)

### Core Architectural Patterns
- **Multi-language Support**: Full i18n implementation for six languages across all content, routes, and emails.
- **Admin surface**: There is no web admin panel. Every admin operation (agenda list/view/reschedule/cancel/no-show/resend) lives inside the Discord bot (`/agenda`, `/cita` slash commands and the buttons attached to each booking notification in `#exentax-agenda`), gated by `ADMIN_DISCORD_ROLE_ID`.
- **Booking System**: Consultation scheduling with Google Meet integration, email notifications (confirmations, reminders, reschedules, cancellations), and robust state management (pending, rescheduled, cancelled, no_show, contacted, in_progress, closed). All date/time operations are anchored to `Europe/Madrid` timezone. The reschedule date picker (`client/src/components/Calendar.tsx`) wraps `react-day-picker` with branded styling, i18n labels (es/en/fr/de/pt/ca via date-fns locales), Madrid TZ "today" anchoring, weekend/min/max/disabled-date filtering, accessible ARIA labels, and per-day `data-testid` hooks. Reschedule errors map server codes (`SLOT_TAKEN`, `PAST_DATE`, `BLOCKED`, `SAME_SLOT`, `CANCELLED`, `INVALID_DATE`, `INVALID_TIME`) to specific i18n keys; SLOT_TAKEN auto-invalidates the slot list. Toasts (`client/src/components/Toast.tsx`) provide non-blocking accessible feedback for success/error/info states.
- **API Contract**: Standardized JSON responses (`{ ok: true, data }` or `{ ok: false, error, code }`) with Zod validation.
- **Concurrency Control**: In-memory slot and booking locking (`withSlotLock`, `withBookingLock`) to prevent race conditions during booking modifications.
- **Data Security**: AES-256-GCM field encryption for sensitive data (e.g., phone numbers) and CSRF protection.
- **Resilience**: Circuit breaker pattern implemented for external API calls (Email, Google Calendar) to enhance system stability.
- **SEO**: Comprehensive server-side rendering of SEO metadata (title, description, canonical, hreflang), dynamic sitemap generation, and localized JSON-LD schemas. Client-side `useLangPath` hook and `getLocalizedPath` function for consistent route management.
- **Discord Integration**: Every operational notification (leads, calculator submissions, visits, bookings, errors, consents, audit) is delivered as a bot message via `POST /channels/{channel_id}/messages` with the bot token. The legacy outbound Discord webhook URLs (`DISCORD_WEBHOOK_*`) have been retired — only channel IDs (`DISCORD_CHANNEL_*`) are used.
- **Email System**: Centralized Gmail API integration for all transactional emails, with 7 types of emails fully translated into 6 languages using a consistent Exentax brand layout. Includes a "Reserva incompleta / Booking incomplete" rescue email: a 5-min sweep over the `booking_drafts` table (drafts captured on email/name blur from the booking form via `POST /api/bookings/draft`) sends a friendly Arnau-signed reminder to anyone who started but did not finish booking, with atomic claim-based dedup, completion guard via `markBookingDraftCompleted` on successful booking, and a defense-in-depth `NOT EXISTS` check against the `agenda` table. Worker: `server/scheduled/incomplete-bookings.ts`.
- **Input Sanitization**: Global middleware to sanitize all incoming request data, preventing common injection attacks.
- **Rate Limiting**: Endpoint-specific rate limiting to protect against abuse.
- **Error Handling**: Consistent server-side error handling with masked user messages and detailed logging.
- **Blog Content Guard**: `exentax-web/scripts/blog-content-lint.mjs` (`npm run lint:blog` from `exentax-web/`) blocks reintroduction of forbidden price/fee/address mentions in the blog. It runs automatically in two places: (1) `scripts/post-merge.sh`, so every push/merge fails fast, and (2) `exentax-web/scripts/build.ts`, so every deploy is blocked if the guard fails. Script output is streamed to the author so offending lines are visible.
- **Newsletter E2E Guard**: `exentax-web/scripts/test-newsletter-e2e.ts` exercises the full newsletter flow (subscribe + RGPD consent log + multi-language unsubscribe + invalid token handling) against a real Postgres database. The wrapper `exentax-web/scripts/run-newsletter-e2e.ts` (`npm run test:newsletter` from `exentax-web/`) boots the server on PORT 5051, polls `/api/health` until ready, runs the test, and tears the server down. It runs automatically in two places, mirroring the blog content guard: (1) `scripts/post-merge.sh`, so every push/merge fails fast, and (2) `exentax-web/scripts/build.ts`, so every deploy is blocked with a non-zero exit code if a regression is detected. The test seeds and cleans its own subscribers (`*@e2e.exentax.test`). There is no bypass: if `DATABASE_URL` is missing during the build, the build fails so the omission cannot be ignored.
- **Booking E2E Guard**: `exentax-web/scripts/test-booking-e2e.ts` exercises the full booking flow (book → manage → reschedule → cancel) against a real Postgres database, asserting `agenda` row creation with manage token, matching `leads` row (source=`booking_web`), `consent_log` entry (formType=`booking`), reschedule status/counter transitions, and cancel status/timestamp. The wrapper `exentax-web/scripts/run-booking-e2e.ts` (`npm run test:booking` from `exentax-web/`) boots the server on PORT 5052, clears `GOOGLE_SERVICE_ACCOUNT_KEY`/`GOOGLE_CALENDAR_ID`/`DISCORD_BOT_TOKEN` from the spawned env so Gmail, Google Calendar and Discord short-circuit through their "not configured" branches (the test stays self-contained and idempotent), polls `/api/health` until ready, runs the test, and tears the server down. It runs automatically in the same two places as the newsletter guard: `scripts/post-merge.sh` (every push/merge) and `exentax-web/scripts/build.ts` (every deploy). The test seeds and cleans its own bookings (`e2e-booking-*@e2e.exentax.test`). There is no bypass.

## External Dependencies
- **Google APIs**: Gmail API v1 (email sending), Google Calendar API (Google Meet event management), Google Sheets API v4 (data logging).
- **Deployment**: Standard Node.js environment with Express for the backend and Vite for the frontend.

## Required environment variables (production)
Production startup is fail-fast: `exentax-web/server/index.ts` refuses to boot in production if any of the following are missing. Dev mode warns instead of crashing.
- `DATABASE_URL` — PostgreSQL connection string (required in every environment).
- `FIELD_ENCRYPTION_KEY` — 64 hex chars / 32 bytes for AES-256-GCM PII encryption at rest.
- `GOOGLE_SERVICE_ACCOUNT_KEY` — JSON service-account credentials for Calendar/Meet; the booking flow depends on it.
- `DISCORD_BOT_TOKEN` / `DISCORD_PUBLIC_KEY` / `DISCORD_APP_ID` / `DISCORD_GUILD_ID` — Discord bot identity, Ed25519 verification key, application id, and guild id for slash command registration and role checks.
- `ADMIN_DISCORD_ROLE_ID` — Discord role id that gates every `/agenda` and `/cita` slash command (the only admin gate; there is no web admin token any more).
- `DISCORD_CHANNEL_REGISTROS`, `DISCORD_CHANNEL_AGENDA`, `DISCORD_CHANNEL_CONSENTIMIENTOS` — Channel ids for lead/newsletter notifications, booking lifecycle, and GDPR consent log mirror.

Optional (sensible defaults):
- `DISCORD_CHANNEL_CALCULADORA`, `DISCORD_CHANNEL_ACTIVIDAD`, `DISCORD_CHANNEL_ERRORES`, `DISCORD_CHANNEL_AUDITORIA`, `REDIS_URL`, `EXTRA_ALLOWED_ORIGINS`, `LOG_LEVEL`, `DB_POOL_MAX`, `GOOGLE_CALENDAR_ID`, `COMPANY_ADDRESS_SHORT`, `DOMAIN`, `CONTACT_EMAIL`, `LEGAL_EMAIL`, `WHATSAPP_NUMBER`, `ADMIN_EMAIL`.

## SEO & indexation invariants
- **GEO/AEO closure (2026-04-27)**: `client/public/llms.txt` (10 KB) and `client/public/llms-full.txt` (27 KB) are the canonical "menu" for ChatGPT / Claude / Perplexity / Gemini. They include identity, services, atomic Q&A (15+), country-by-country guidance (ES/MX/AR/CO/CL/FR/DE/PT), state comparison matrix, glossary, citation snippets, vs-competitor positioning (Stripe Atlas / doola / Firstbase / Globalfy) and a long-form reference. `server/seo-content.ts` Organization graph emits `founder`, `slogan`, `numberOfEmployees`, `knowsLanguage`, `award`, plus `aggregateRating` 5.0/127. Blog `BlogPosting` JSON-LD adds `speakable` (cssSelector h1/h2/.article-lead) for voice + AI Overviews. `seo-llm-readiness` (in `blog:validate-all`) is the regression gate.
- **Indexable surfaces**: home (`/`, `/{lang}`), 7 main pages × 6 languages, blog index × 6, 74 blog posts × 6 (count comes from `npm run seo:check`).
- **Hreflang**: bidirectional, reciprocal, includes `x-default = /es/...` on every URL. Verified: all 74 published blog posts have `title` + `metaDescription` translations in en/fr/de/pt/ca, so cross-language alternates are real, not stubs.
- **Blog locale lint**: `npm run lint:blog-links` (script `scripts/blog-link-locale-lint.mjs`) enforces every `<a href="/blog/...">` inside `client/src/data/blog-content/<lang>/*.ts` matches its folder locale (e.g. EN posts must use `/en/blog/<en-slug>`). EN slugs must exist in the `BLOG_SLUG_I18N` map (`client/src/data/blog-posts-slugs.ts`).
- **Sitemap (`/sitemap.xml`)**: 1h cache. Main-page `<lastmod>` uses a content-based constant (`MAIN_PAGES_LASTMOD` / `BLOG_INDEX_LASTMOD` in `server/routes/public.ts`) — bump it manually when copy actually changes. Avoids "freshness spam" from stamping today on every URL each crawl.
- **Robots.txt**: disallows `/api/`, `/admin/`, `/links`, `/start`, `/booking/` plus UTM/ref/gclid/fbclid/mc_* attribution noise.
- **Noindex but 200**: `/booking/:token` and `/admin/agenda/:bookingId` (real SPA pages) — see `NOINDEX_KNOWN_RE` in `server/static.ts`.
- **Legacy redirects**: `/sobre-las-llc`, `/blog`, `/blog/*`, `/legal/*` and other unprefixed Spanish paths 301 to `/es/...` via middleware in `server/index.ts`.
- **Internal linking guard**: `npm run seo:check` (wired into `npm run check`) fails if any blog post has fewer than 3 incoming contextual links. See `exentax-web/docs/seo/internal-linking.md`.

## Design system — forbidden patterns (Exentax visual rules)
Hard project constraints. Never reintroduce without explicit user request:
- **NO dark mode**: cream/light background only. The user has rejected dark-mode plans multiple times.
- **NO 01/02/03 step numbers**, badges, SVG underlines.
- **NO icons inside FAQ**.
- **NO green dot markers / glowing bullet dots inside cards** (Services approach pillars, etc.). Title alone carries hierarchy.
- **NO monospace / mechanical eyebrow styling** for step intros (`uppercase` + `tracking-[0.08em]` + small green text reads as monospace/code). Step intros must be normal-case body text in green, regular tracking. Applies to HowItWorks step intros and any similar narrative lead-in.
- **NO modifying brand colors or button base classes**. Pill (`rounded-full`) buttons only.
- **Display font**: titles are `h1`–`h4` so the global rule auto-applies Archivo Black 900 UPPERCASE. `font-heading` = Space Grotesk (body/semantic), not display.
- **Liquid-glass card recipe**: `rounded-[28-32px]`, `backdrop-blur(24-28px) saturate(1.6-1.7)`, `border 1px rgba(0,229,16,0.20)`, `borderTop 2px #00E510`, inner radial green glow overlay. No hard left/right colored stripes.

## Service subpages — slug & nav structure (Task #23, 2026-04-21)
- **Hub URL segment per language** (in `shared/routes.ts → ROUTE_SLUGS.our_services`): `es:servicios | en:services | fr:services | de:leistungen | pt:servicos | ca:serveis`. The 5 subpage slugs (`service_llc_nm/wy/de/fl/itin`) inherit the new prefix automatically.
- **Subpage leaf naming criterion**: each language uses the toponym/verb form that is most natural in that language's business writing. Exceptions worth knowing: DE LLC New Mexico keeps `llc-new-mexico` because German business copy uses "New Mexico" verbatim (no "Neu-Mexiko"); FR & DE ITIN slugs follow the imperative-informal pattern (`obtiens-ton-itin`, `hol-deine-itin`) for parity with ES (`obten-tu-itin`) and CA (`obte-el-teu-itin`).
- **Legacy 301 map**: `server/index.ts → LEGACY_ES_REDIRECTS` carries 36 explicit redirects covering every old hub + subpage URL across the 6 languages. Add new entries here whenever a slug changes; never silently break an indexed URL.
- **Nav dropdown labels**: `NAV_SUBPAGES_BY_LANG` (end of `client/src/i18n/data/subpages.ts`) holds the 6-language dropdown copy. Item-1 reuses the hub label (`Nuestros servicios` / `Our services` / …) so it reads consistently with the trigger; the 5 subpage items mirror each page's H1 (e.g. ES: "Tu LLC en Nuevo México", EN: "Your New Mexico LLC", FR: "Obtiens ton ITIN").
- **ITIN comparison table** (`ITIN_COMPARISON_BY_LANG`, same file): the support row is unified to the universal honest claim across the 6 languages — Exentax = "Spanish + English, end-to-end"; mail-to-IRS = "IRS forms in English only"; other agents = "varies by agent". Avoids overpromising native support in FR/PT/CA/DE.
- **JSON-LD localization**: `ServiceSubpage.tsx` now emits `provider.url = ${SITE_URL}${lp("home")}`, so each language's Service schema points at its localized homepage rather than the bare root.

## Editorial program 2026 (Task #26, 2026-04-26)

> Control plane del programa de reescritura de los 111 artículos del blog (excluido `cuanto-cuesta-constituir-llc`, cerrado en Task #1). Toda la documentación es read-only sobre `client/src/data/blog-content/**`; sólo añade planificación y rúbrica.

- **`exentax-web/docs/editorial/STANDARD.md`** — rúbrica formal con los 7 criterios del test de conversión, política de fuentes oficiales (formato `<a target="_blank" rel="noopener">`), política de CTA (verbatim de `blog-cta-library.ts`), densidad Exentax 4-12, registro por idioma (Sie/Ihr DE, vostè CA, PT-PT), 12 secciones recomendadas y 4 ejemplos verbatim del modelo Task #1.
- **`exentax-web/docs/editorial/SOURCES-BY-JURISDICTION.md`** — biblioteca de URLs oficiales por familia temática (US Federal IRS+FinCEN, ES AEAT/BOE/SegSocial, PT, BR, FR/BE/CH/QC, DE/AT/CH, UK, UE/OCDE, LATAM, Andorra) con plantilla copy-paste y lista de URLs prohibidas.
- **`exentax-web/docs/editorial/CTA-LIBRARY.md`** — exporta verbatim los 6 patrones canónicos (`book_consultation`, `llc_florida_specific`, `llc_state_compare`, `itin_help`, `services_overview`, `compliance_checkup`) en los 6 idiomas + las 4 variantes mid-article (`free_consult`, `start_today`, `talk_to_team`, `discover_llc`) + bloque WhatsApp de alta intención.
- **`exentax-web/docs/editorial/PRIORITY-QUEUE.md`** — cola de los 111 slugs ordenados por score (FAILS por `(traffic+1)×failures`, PASA por `traffic×0.5`); cada fila: word-count, verdict, tipo (rewrite-completo / polish-verificacion), sprint asignado.
- **`exentax-web/docs/editorial/sprints/SPRINT-PLAN.md`** — divide los 111 slugs en **29 sprints de 4 slugs**: sprints 1-19 rewrite-completo (74 FAIL), sprints 20-29 polish-verificacion (37 PASA). Cada sprint depende del cierre del anterior; worksheets pre-generados para sprints 1-8 (32 slugs); sprints 9+ generan worksheet on-demand al proponerse como tarea.
- **`exentax-web/docs/editorial/worksheets/<slug>.md`** — 32 worksheets para los slugs de sprints 1-8: gancho objetivo, dato concreto de los primeros 100 palabras, 3-5 objeciones, esquema de 12 secciones, fuentes aplicables (subset jerarquizado de SOURCES-BY-JURISDICTION), CTA pattern recomendado, variante mid, capa regulatoria por idioma y checklist de cierre.
- **Sprint #1** (top-4 slugs por score: `residentes-no-residentes-llc-diferencias` · `diferencia-llc-corporation-s-corp-c-corp` · `iva-servicios-digitales-internacional` · `llc-estados-unidos-guia-completa-2026`) ya está propuesto como Task #27 (PENDING, blocked by parent Task #26). Sprints 2-29 se proponen tras el cierre del anterior, consumiendo el worksheet correspondiente.
- **Generador**: el script `/tmp/editorial-gen/generate*.mjs` reconstruye PRIORITY-QUEUE / SPRINT-PLAN / 32 worksheets desde `docs/audits/2026-04/conversion/audit-es.json`. No vive en `scripts/` porque sólo se usa al refrescar la cola tras cada nueva auditoría completa.

## Audit closure
- **2026-04-28 — Security audit (Task #7) cerrado**: revisión end-to-end de seguridad de `exentax-web`. Reporte completo en `exentax-web/reports/security/security-audit-2026-04.md`. Veredicto: **0 critical / 0 high pendientes**, 4 medium corregidos en este pase, resto low/info aceptados con justificación. Cambios aplicados en código: (1) `server/route-helpers.ts` valida `EXTRA_ALLOWED_ORIGINS` al boot (esquema + host[:port], sin path/query) y **fail-fast en producción** si algún origen viene malformado; (2) `server/email.ts` añade helpers `maskName` y `stripCrlf` y los aplica en `buildRaw` a `to`/`replyTo`/`bcc`/`fromName`/`listUnsubscribe` (defense-in-depth contra header injection — Zod ya rechaza CRLF, pero blindamos la frontera MIME); (3) `server/email.ts:436` escapa `data.email.split("@")[0]` con `escapeHtml` antes de inyectarlo en el `heading()` del email del calculadora (XSS hardening, autosanitizer cubre req.body pero un caller futuro podría saltárselo); (4) **PII purge en logs**: 7 debug-logs "no Gmail" del pipeline de email (calculator, reminder, reschedule, cancellation, follow-up, newsletter welcome, incomplete-booking, no-show) ahora pasan emails por `maskEmail` y nombres por `maskName` (eran dev-only pero por consistencia); (5) nuevo helper `maskIp` en `server/logger.ts` (drop último octeto IPv4, conserva /48 IPv6) aplicado al `logger.info("New visitor: ...")` de `routes/public.ts:1175` para no persistir IPs RGPD-sensibles; (6) `routes/observability.ts` (`/api/client-errors`) añade helper `stripUrlSecrets` que elimina `?…` y `#…` del URL reportado por el cliente antes de loguearlo — los flujos de unsubscribe/manage llevan tokens bearer en query y un crash en esas páginas filtraría credenciales al log aggregator. Auditoría documenta también: helmet/CSP estricto en prod (sin `unsafe-inline`/`unsafe-eval` en script-src), HSTS prod 2y + preload + includeSubDomains, frameguard SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin.
- **2026-04-28 — Native-quality content + translations 6 locales (Task #4) cerrado**: auditoría editorial cross-locale sobre las 112 entradas × 6 idiomas (672 artículos) + 1.553 strings UI × 6 (9.318 strings). **Veredicto: 672/672 PASS, 0 NEEDS_REWRITE, 0 reescrituras masivas necesarias** — la base entró ya en calidad nativa gracias a los 8 lotes de 2026-04-27. Dos correcciones quirúrgicas aplicadas: (a) `client/src/data/blog-content/fr/llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais.ts` cambió un único "ouvre ta LLC en 5 minutes" (registro tu) → "ouvrez votre LLC en 5 minutes" (registro vous) para coherencia de tono; (b) `scripts/i18n-intentional-identical.json` depuró 8 entradas obsoletas y añadió 2PT válidas (mismo lexema que ES). El script `i18n-glossary-lint.ts` ahora escanea blogs y UI (0 violaciones tras el pase). Reporte final en `exentax-web/reports/i18n/native-quality-2026-04.md`.
