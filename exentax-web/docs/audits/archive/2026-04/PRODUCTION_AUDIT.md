# Exentax — Production Audit

**Date:** 2026-04-18
**Scope:** Full audit and cleanup of the Exentax marketing + advisory web platform (`exentax-web/`), 6 locales (`es`, `en`, `fr`, `de`, `pt`, `ca`), Express + React + Drizzle (Postgres) stack, Liquid Glass visual system.
**Goal:** Identify Critical / High issues, fix them at the root (no patches, no silent fallbacks), validate via lints + typecheck + production build, and document residual Medium / Low issues with explicit remediation paths.

---

## 1. Executive summary

| Severity | Found | Fixed in this audit | Deferred (documented) |
| --- | --- | --- | --- |
| Critical | 3 | 3 | 0 |
| High | 4 | 4 | 0 |
| Medium | 4 | 1 | 3 |
| Low | 3 | 1 | 2 |

All Critical and High findings have been fixed at the root. Medium / Low items are listed in §6 with concrete remediation steps; none of them block production.

Final state of automated checks:

```
tsc --noEmit                              ✓ no errors
seo-check-links                            ✓ 0 broken links · all 79 articles ≥ 3 incoming links
blog-link-locale-lint                      ✓ 395 article files, all internal links match locale
blog-content-lint                          ✓ 478 files, no banned phrases
check-typography-rule0                     ✓ 0 decorative violations
validate-i18n                              ✓ ES is reference (1234 keys) · EN/FR/DE/PT differ by 2 keys
                                            (errors.* present everywhere, ES has them too)
                                          · CA missing 196 keys → graceful fallback to ES configured
npm run build                              ✓ Vite client + esbuild server, no warnings beyond bundle size
```

---

## 2. Architecture snapshot

```
exentax-web/
├── client/                React 18 + Vite + Wouter + TanStack Query + i18next + Tailwind (Liquid Glass)
│   ├── src/
│   │   ├── pages/         Routes (one folder per page; blog/ for the article system)
│   │   ├── components/    Reusable UI; ui/ for shadcn primitives
│   │   ├── data/          Static content
│   │   │   └── blog-content/{es,en,fr,de,pt,ca}/<slug>.ts   (79 articles × 6 locales)
│   │   ├── i18n/locales/  One file per locale; ES is the reference
│   │   ├── lib/           Cross-cutting helpers (queryClient, constants, …)
│   │   └── hooks/
│   └── public/
├── server/                Express + Drizzle (Postgres) — thin API layer
│   ├── routes/            Per-resource route modules wired in routes.ts
│   ├── storage/           IStorage abstraction + Drizzle-backed implementation
│   ├── email-i18n.ts      i18n email templates with retry queue
│   └── google-meet.ts     Optional Google integration (lazily loaded; off in dev when no creds)
├── shared/schema.ts       Drizzle tables + drizzle-zod insert schemas + inferred types
├── scripts/               Lint / audit / SEO / i18n CLIs (Node ESM, no extra deps)
└── docs/                  Auditing reports (this folder)
```

Dev: a single `npm run dev` starts Express on port 5000; Vite middleware serves the SPA on the same port (no separate proxy). The preview iframe hits the Express port directly.

---

## 3. Critical findings (all fixed at root)

### C1 · Cross-locale broken blog links (38 occurrences)
**Symptom:** ES articles linked to EN/FR/DE/PT/CA slugs (and vice versa), producing 404 in the SPA after navigation.
**Root cause:** Articles were copy-translated without rewriting internal anchors. The site has per-locale slugs (`blog-posts-slugs.ts`), but bodies kept the source-locale slug.
**Fix:** Authored `/tmp/fix-broken-links.mjs` that walks every `client/src/data/blog-content/<locale>/*.ts`, parses Markdown links of the form `/<otherLocale>/blog/<slug>`, and rewrites each one to the matching slug in the file's own locale via the slug map. 36 links auto-fixed; 2 edge cases (`en/us-spain-tax-treaty-applied-to-llcs.ts`, `ca/w8-ben-i-w8-ben-e-la-guia-completa.ts`) fixed by hand.
**Verification:** `node scripts/seo-check-links.mjs` and `node scripts/blog-link-locale-lint.mjs` both report zero issues.

### C2 · Empty UI labels for ES users on blog, links, agenda and start pages
**Symptom:** ES locale rendered empty strings where labels like "Compartir", "Por Exentax", "Reservar nueva cita", "Hablemos por WhatsApp" should appear (visible in the screenshot before the fix as "13" alone, no "min de lectura").
**Root cause:** ES is the reference locale and the file lacked the `blogPost.*`, `links.*`, `agenda.*`, `start.*` and `errors.*` namespaces (134 keys missing). The i18n config used `fallbackLng: false` and `parseMissingKeyHandler` returned `""`, so a missing ES key rendered as nothing.
**Fix:**
1. Added the missing namespaces to `client/src/i18n/locales/es.ts` (132 keys translated to native Spanish; `links`, `agenda`, `start`, `blogPost`, `errors`).
2. Replaced `fallbackLng: false` with a per-locale fallback chain in `client/src/i18n/index.ts`:
   - `ca → es → en` and `pt → es → en` (Iberian content stays in Spanish if a key is missing)
   - `fr/de/es → en` (so a missing key yields English instead of a blank)
3. Changed the missing-key handler to return the key itself in DEV (loud failure mode — no silent blanks).
**Verification:** ES blog post page now renders all labels (`Compliance · 13 min de lectura · Por Exentax · Compartir · Artículos relacionados · …`). Browser console: zero `[i18n] Missing key` warnings on ES routes.

### C3 · Typography Rule 0 violations on the blog index
**Symptom:** Decorative `uppercase tracking-[0.09em]` "BLOG" pretitle and `tabular-nums` on counters violated the design system rule.
**Root cause:** Legacy class names left in `client/src/pages/blog/index.tsx`.
**Fix:** Removed `uppercase tracking-[…]` from the pretitle and `tabular-nums` from the counter; replaced by the system's standard text styles.
**Verification:** `node scripts/check-typography-rule0.mjs` → `Regla 0 OK · 0 violaciones decorativas`.

---

## 4. High findings (all fixed at root)

### H1 · 4 ES articles below the 3-incoming-links SEO floor
**Affected slugs:** `como-disolver-cerrar-llc-paso-a-paso`, `convenio-doble-imposicion-usa-espana-llc`, `como-obtener-itin-numero-fiscal-irs`, `w8-ben-y-w8-ben-e-guia-completa`.
**Fix:** Added contextually relevant inline links across 7 ES articles that already touch on dissolution, tax treaties, ITIN and W-8 — no shoehorning, every link follows the surrounding sentence naturally.
**Verification:** `seo-check-links` → "All 79 articles have ≥ 3 incoming links."

### H2 · Factually wrong claim about W-8BEN requirements on Mercury / Relay / Wise
**Symptom:** Multiple articles asserted that Mercury, Relay and Wise Business request a W-8 at LLC onboarding. They do not — those platforms only request it if a specific compliance review fires. Brokers like Interactive Brokers do require it from day one.
**Fix:** Rewrote the relevant sections in all six locales (`es`, `en`, `fr`, `de`, `pt`, `ca`) of `w8-ben-y-w8-ben-e-guia-completa.ts`, plus the ES `pasarelas-pago-llc-stripe-paypal-dodo.ts`. Distinguishes business banking (W-8 only on demand) from brokers (W-8 mandatory at signup) and updates the "How Exentax helps" closing paragraph accordingly so we don't over-promise.
**Verification:** `blog-content-lint` (which enforces banned phrases) still passes; manual read-through confirms the new wording is factually consistent across locales.

### H3 · i18n missing keys silently swallowed
**Root cause:** `parseMissingKeyHandler` returned `""`, hiding bugs in dev and production.
**Fix:** Returns the key in DEV, falls back to the configured chain at runtime (see C2). Production users now always see *something*; developers see the offending key in the UI immediately.

### H4 · Build / typecheck never re-validated after the recent translation churn
**Fix:** Ran `npx tsc --noEmit` and `npm run build` at the end of the audit; both pass with no errors and no new warnings.

---

## 5. Routes / lints / i18n / email / build matrix

| Check | Tool | Result |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | ✓ |
| Cross-locale blog links | `scripts/blog-link-locale-lint.mjs` | ✓ 395 files |
| Broken links + incoming-link floor | `scripts/seo-check-links.mjs` | ✓ 0 broken · all ≥ 3 incoming |
| Banned phrases | `scripts/blog-content-lint.mjs` | ✓ 478 files |
| Typography Rule 0 | `scripts/check-typography-rule0.mjs` | ✓ 0 violations |
| i18n key parity | `scripts/validate-i18n.ts` | ✓ ES reference (1234 keys); CA gap covered by fallback chain |
| Email templates (i18n + retry) | `server/email-i18n.ts`, `server/email-retry-queue.ts` | ✓ load OK; retry queue active; Gmail credentials optional in dev |
| Production build | `npm run build` | ✓ Vite + esbuild, ~2.2 MB server bundle (expected) |
| App boot | `npm run dev` workflow | ✓ port 5000, ES blog page renders fully translated |

---

## 6. Medium / Low residuals (non-blocking, documented for follow-up)

### M1 · Catalan locale is missing 196 keys
The `links`, `agenda`, `start`, `blogPost` and `errors` namespaces were never authored in CA. Mitigated at runtime by `fallbackLng: ['es', 'en']` so CA users see Spanish (an acceptable fallback for a Catalan audience) instead of blanks. Proper translation should be tracked as its own task.

### M2 · 56 ES strings appear identical to EN
The validator's "Possibly untranslated" heuristic flags 56 strings that are the same in ES and EN. Spot-checking shows almost all are deliberate (proper nouns, brand names, "Stripe", "LLC", "FAQ", numeric units, etc.). Worth a manual review if a content reviewer ever sweeps the file, but no functional impact.

### M3 · Server bundle size warning (2.2 MB)
`esbuild` flags `dist/index.mjs` at 2.2 MB. This is mostly the bundled Drizzle + Postgres driver + Google libs. Acceptable for a long-lived Express process; can be revisited if cold-start times become an issue.

### L1 · `errors.*` namespace lives at the root rather than inside a logical group
Cosmetic; doesn't affect behavior.

### L2 · `links.*` and `start.*` ES copy was authored fresh in this audit
Should be reviewed by the content owner before the next major release to make sure tone matches the rest of the Spanish site.

### L3 · Some article files are large monoliths (template literals)
The blog content ships as TS template strings. Splitting per-section would help maintainability but requires a renderer change; out of scope for this audit.

---

## 7. Files touched

```
exentax-web/client/src/i18n/index.ts                                      (fallback chain + handler)
exentax-web/client/src/i18n/locales/es.ts                                 (+134 keys)
exentax-web/client/src/pages/blog/index.tsx                               (typography Rule 0)
exentax-web/client/src/data/blog-posts-slugs.ts                           (referenced by fixer)
exentax-web/client/src/data/blog-content/**/*.ts                          (38 broken links + W-8 rewording)
exentax-web/client/src/data/blog-content/{es,en,fr,de,pt,ca}/w8-ben-y-w8-ben-e-guia-completa.ts
exentax-web/client/src/data/blog-content/es/pasarelas-pago-llc-stripe-paypal-dodo.ts
docs/PRODUCTION_AUDIT.md                                                  (this file)
README.md, exentax-web/README.md                                          (architecture refresh)
```

No `package.json`, `vite.config.ts`, `server/vite.ts` or `drizzle.config.ts` were modified. No new dependencies were introduced. Database schema is unchanged.

---

## 8. How to re-run the audit

From `exentax-web/`:

```bash
npx tsc --noEmit
node scripts/seo-check-links.mjs
node scripts/blog-link-locale-lint.mjs
node scripts/blog-content-lint.mjs
node scripts/check-typography-rule0.mjs
npx tsx scripts/validate-i18n.ts
npm run build
```

All seven commands should exit with status 0 and the messages shown in §1.
