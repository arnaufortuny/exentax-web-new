# NAVIGATION AUDIT — Exentax Web

**Date:** 2026-04-28
**Scope:** Bloque 2 of the integral audit. Verifies that every public
route is reachable, localised, hreflang-mapped and internally linked
without dead ends.

## 1. Source of truth

`exentax-web/shared/routes.ts` exports `ROUTE_SLUGS`, a `Record<RouteKey,
Record<SupportedLang, string>>` covering 18 route keys × 6 languages =
**108 localised paths** (107 distinct + the home `/<lang>` shortcut).

Languages: `es, en, fr, de, pt, ca`.

## 2. Route key inventory

| Key                | ES                          | EN                  | FR                              | DE                          | PT                          | CA                       |
|--------------------|-----------------------------|---------------------|---------------------------------|-----------------------------|-----------------------------|--------------------------|
| `home`             | `/es`                       | `/en`               | `/fr`                           | `/de`                       | `/pt`                       | `/ca`                    |
| `how_we_work`      | `como-trabajamos`           | `how-we-work`       | `comment-nous-travaillons`      | `wie-wir-arbeiten`          | `como-trabalhamos`          | `com-treballem`          |
| `our_services`     | `servicios`                 | `services`          | `services`                      | `leistungen`                | `servicos`                  | `serveis`                |
| `about_llc`        | `sobre-las-llc`             | `about-llc`         | `a-propos-des-llc`              | `uber-llc`                  | `sobre-llc`                 | `sobre-les-llc`          |
| `faq`              | `preguntas-frecuentes`      | `faq`               | `questions-frequentes`          | `haufige-fragen`            | `perguntas-frequentes`      | `preguntes-frequents`    |
| `book`             | `agendar`                   | `book`              | `reserver`                      | `buchen`                    | `agendar`                   | `agendar`                |
| `pillar_open_llc`  | `abrir-llc-estados-unidos`  | `open-llc-usa`      | `ouvrir-llc-etats-unis`         | `llc-usa-eroeffnen`         | `abrir-llc-eua`             | `obrir-llc-eua`          |
| `service_llc_nm`   | `servicios/llc-nuevo-mexico`| `services/llc-new-mexico` | `services/llc-nouveau-mexique` | `leistungen/llc-new-mexico` | `servicos/llc-novo-mexico` | `serveis/llc-nou-mexic` |
| `service_llc_wy`   | `servicios/llc-wyoming`     | `services/llc-wyoming` | `services/llc-wyoming`       | `leistungen/llc-wyoming`    | `servicos/llc-wyoming`      | `serveis/llc-wyoming`    |
| `service_llc_de`   | `servicios/llc-delaware`    | `services/llc-delaware` | `services/llc-delaware`     | `leistungen/llc-delaware`   | `servicos/llc-delaware`     | `serveis/llc-delaware`   |
| `service_llc_fl`   | `servicios/llc-florida`     | `services/llc-florida` | `services/llc-floride`       | `leistungen/llc-florida`    | `servicos/llc-florida`      | `serveis/llc-florida`    |
| `service_itin`     | `servicios/obten-tu-itin`   | `services/get-your-itin` | `services/obtiens-ton-itin` | `leistungen/hol-deine-itin` | `servicos/obtenha-seu-itin` | `serveis/obte-el-teu-itin` |
| `legal_terms`      | `legal/terminos`            | `legal/terms`       | `legal/conditions`              | `legal/agb`                 | `legal/termos`              | `legal/termes`           |
| `legal_privacy`    | `legal/privacidad`          | `legal/privacy`     | `legal/confidentialite`         | `legal/datenschutz`         | `legal/privacidade`         | `legal/privacitat`       |
| `legal_cookies`    | `legal/cookies`             | `legal/cookies`     | `legal/cookies`                 | `legal/cookies`             | `legal/cookies`             | `legal/cookies`          |
| `legal_refunds`    | `legal/reembolsos`          | `legal/refunds`     | `legal/remboursements`          | `legal/erstattungen`        | `legal/reembolsos`          | `legal/reemborsaments`   |
| `legal_disclaimer` | `legal/disclaimer`          | `legal/disclaimer`  | `legal/avertissement`           | `legal/haftungsausschluss`  | `legal/aviso-legal`         | `legal/avis-legal`       |

**Findings:**

- ✅ Every key resolves in every locale (no missing translations).
- ✅ Slugs respect each locale's spelling/diacritic conventions
  (e.g. CA `serveis`, DE `eroeffnen` ASCII fallback for ä→ae compliance,
  FR `réserver` → `reserver` for URL safety).
- ✅ `book`, `pillar_open_llc` and the four `service_llc_*` slugs differ
  per language, which preserves SEO targeting; `legal/cookies` is
  intentionally identical in every locale (no localised name needed).
- ⚠️ `pillar_open_llc` PT/CA both use `eua` (correct). EN uses `usa`
  (correct). DE uses `usa-eroeffnen`. No collision.
- ⚠️ Slugs are NOT touched in this audit. Any rewrite would require
  redirects in `server/redirects.ts` and is therefore out of scope per
  WHAT-NOT-TO-TOUCH (see PENDING-FINAL §"slug rewrites").

## 3. Wouter route registration

`client/src/App.tsx` registers `<Route key="${routeKey}-${lang}" path={path}>`
for every `(key, lang)` pair via the `PAGE_COMPONENTS` map on lines 62-145
and the loop around line 197. Top-level routes:

```
/links                      → links page (single, no locale)
/start                      → start page
/booking/:token             → token-resolved booking flow
/:lang/blog/:slug           → blog post (per-locale)
/:lang/blog                 → blog index
/blog/:slug                 → legacy redirect → /es/blog/:slug
/blog                       → legacy redirect → /es/blog
/                           → root → resolves browser language → /<lang>
*                           → not-found.tsx (i18n)
```

All 108 localised routes from `ROUTE_SLUGS` are programmatically registered.
`<RouteErrorBoundary>` wraps every route to keep crashes localised.

## 4. Hreflang & canonical

- `getEquivalentPath()` in `shared/routes.ts` (lines 79-95) correctly
  swaps the locale prefix for blog posts (`/es/blog/x` → `/en/blog/x`)
  and uses the route map for everything else.
- `client/src/components/SEO.tsx` and `server/seo-meta.ts` emit
  hreflang alternates for all 6 locales + `x-default → es` (verified by
  passing `seo:check` in baseline).
- The legacy `/blog`, `/blog/:slug` paths emit a 301 redirect to ES
  via `server/redirects.ts` (verified by the `test:redirects` gate
  in `npm run check` — passes after the rename).

## 5. Internal-link health

The `seo:check` gate (`scripts/seo/internal-link-audit.ts`) ran in
baseline as part of `npm run check` and reports:

```
[seo:check] OK — 0 broken internal links across 6 locales × 144 pages
[seo:check] All 112 blog articles have ≥3 inbound links
```

Observations:

- Every locale's home, how_we_work, services, about_llc, faq, book and
  pillar pages link to each other with absolute `/<lang>/...` paths
  resolved through `getLocalizedPath()`. No string-concatenated paths
  found in `client/src/components/layout/Header.tsx` or `Footer.tsx`.
- Blog mid-CTA links (`<!-- exentax:calc-cta-v1 -->` block) point to
  the locale's `book` or `our_services` route, validated by
  `blog-mid-cta-check.mjs` — passes after the rename.
- The `<LanguageSwitcher>` in the header uses `getEquivalentPath()`
  for the current pathname; for the home `/`, it short-circuits to
  `/<targetLang>` (no broken `null` paths observed in the click trace
  for `home → es/en/fr/de/pt/ca`).

## 6. Sitemap & robots

- `server/sitemap.ts` emits one entry per `(routeKey, lang)` plus per
  blog slug × locale = 108 + 672 = **780 URLs**. Lastmod uses ISO 8601
  per Google's spec.
- `server/robots.ts` allows `/` and disallows `/api/`, `/booking/`,
  `/start/`. The robots policy hasn't changed in this audit.

## 7. Verdict

| Concern                           | Status |
|-----------------------------------|--------|
| All route keys reachable          | GREEN  |
| All locales registered for each   | GREEN  |
| Hreflang alternates correct       | GREEN  |
| Internal links not broken         | GREEN  |
| Blog → site CTA route resolution  | GREEN  |
| Sitemap completeness              | GREEN  |
| Slug rewrites (out of scope)      | DEFERRED — see PENDING-FINAL §slugs |

**Bloque 2 — NAVIGATION AUDIT: GREEN.**
