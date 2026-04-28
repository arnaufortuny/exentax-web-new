# CTA, button & link audit — exentax-web

_Task #19 — audit and harden the entire interactive layer (CTAs,
buttons, WhatsApp pre-filled messages, internal navigation) across
the six supported locales: **es, en, fr, de, pt, ca**._

## TL;DR

| Area | Before | After |
|---|---|---|
| WhatsApp pre-filled messages with grammar bugs (Spanish) | **5** keys | **0** |
| Internal `<Link>` pointing at an unregistered route key | **1** (`lp("booking")` in `FAQ.tsx`) | **0** |
| Primary CTAs missing `cta_click` analytics | **5** surfaces | **0** |
| Live HTTP smoke check on registered + discovered routes | not automated | **126/126 OK** |
| Rendered anchors extracted from real DOM (36 seed pages — home, services, FAQ, booking, blog index, blog post × 6 locales) | n/a | **~2,300 anchors / ~145 unique internal — 0 broken** |
| Cross-language CTAs rendered outside the language switcher | not measured | **0** |
| Discovered route keys outside `ROUTE_SLUGS` | **1** (`booking`) | **0** |
| `wa.me/<num>` references off the canonical `CONTACT.WHATSAPP_NUMBER` | n/a | **0 / 721** |
| Playwright coverage of CTA → destination across 6 locales | none | **36 specs (6 surfaces × 6 langs)** |

Four new audit scripts live in `exentax-web/scripts/`:

- `cta-inventory.mjs` — static `<Link>`/`<a>`/WhatsApp inventory,
  plus a per-locale expansion (one row per [code-site × language])
  that resolves each `lp("KEY")` to the real localized URL and each
  `t("KEY")` to the real localized copy.
- `cta-whatsapp-audit.mjs` — i18n + blog-CTA library WhatsApp linter
  (encoding, length, greeting leak, Spanish punctuation) **and** a
  codebase-wide `wa.me/<digits>` consistency check.
- `cta-link-crawler.mjs` — three-pass static crawler: ROUTE_SLUGS
  consistency, discovered-link consistency (reads the inventory),
  live HTTP smoke check.
- `cta-rendered-crawler.mjs` — **real-DOM, runtime crawler — the
  authoritative inventory**. Uses Playwright to load 36 seed pages
  (6 surfaces × 6 locales: home, services, FAQ, booking, blog index,
  blog post — together exercising the navbar, hero, every home/
  services/FAQ section, the floating WhatsApp button, the footer,
  the blog list and the blog `ArticleCTA`), waits for the language
  to settle (`<html lang>` + a localized nav anchor must both match
  the URL locale, which is non-trivial because i18n is initialized
  from `navigator.language` and only switched to the URL locale via
  `useEffect` after mount), then extracts **every** rendered
  `<a href>` post-hydration (~2,300 anchors / ~145 unique internal
  hrefs at last run). Anchors are written to
  `cta-rendered-inventory.{csv,json}` with one row per page × lang
  × href × text — this is the comprehensive inventory that does
  *not* depend on regex matching of source code and therefore
  captures CTAs defined via variables or component props (which the
  static inventory in §1.1 cannot see).

All four write into `exentax-web/reports/` and exit non-zero on
findings, so they can be wired into CI.

A new Playwright spec at `tests/e2e/cta-navigation.spec.ts` runs
**36 cases (6 surfaces × 6 locales)** — hero primary booking + hero
WhatsApp, navbar booking, floating WhatsApp bubble, home final CTA
(book + WhatsApp), footer booking link + footer WhatsApp contact,
and the blog `ArticleCTA` (primary + WhatsApp) on a real localized
post — and is registered automatically by
`testMatch: ["tests/e2e/*.spec.ts"]` in `playwright.config.ts`.

---

## 1. Inventory

### 1.1 Static interactive surface map (companion view)

> **Note.** This is a regex-based static view that ties each CTA back
> to its source file/line — useful for code review and as a lower
> bound on the interactive surface, but **not** the authoritative
> inventory. The authoritative, runtime-DOM inventory lives in
> §1.4 (`cta-rendered-inventory.{csv,json}`); it captures CTAs
> defined via variables/props that this regex view cannot see.

`scripts/cta-inventory.mjs` walks `client/src/**/*.{ts,tsx}` (skipping
`blog-content/`) and extracts every directly-spelled `<Link>`,
`<a>`, WhatsApp anchor and `mailto:` it can see, recording the
file, line, label, target route key, `data-testid` and the tracking
call (if any) detected on or near the element. The full tables live in:

- `reports/cta-inventory.md` (human-readable)
- `reports/cta-inventory.csv` (spreadsheet)
- `reports/cta-inventory.json` (machine-readable)
- `reports/cta-inventory-by-locale.{csv,json}` — **per-locale
  expansion**: each code-site row is multiplied by 6 (one per
  language). Each expanded row carries the *resolved* localized URL
  (looked up against `ROUTE_SLUGS` so e.g. `lp("book")` becomes
  `/es/agendar`, `/en/book`, `/fr/reserver`, …) and the *resolved*
  localized copy (looked up against `client/src/i18n/locales/{lang}.ts`).
  73 definition rows expand to **438 per-locale rows**. Pair this
  artifact with `cta-rendered-inventory.csv` (§1.4) to see both
  *what the source declares* and *what visitors actually get*.

Counts captured by category (run on commit):

| Category | Count |
|---|---:|
| Total interactive elements (definition rows) | 73 |
| Per-locale rows (definition × 6 langs) | 438 |
| `<Link>` / `<a>` (internal) | 51 |
| WhatsApp anchors | 20 |
| `mailto:` | 2 |

### 1.2 WhatsApp message inventory

`scripts/cta-whatsapp-audit.mjs` extracts WhatsApp pre-filled message
strings from two sources of truth:

1. **i18n locales** — every key that matches `/wa(text)?|whatsapp/i`
   in the six `client/src/i18n/locales/{lang}.ts` bundles
   (120 entries across 6 languages).
2. **Blog CTA library** — `client/src/data/blog-cta-library.ts`
   (6 patterns × 6 languages = 36 messages).

Outputs:

- `reports/whatsapp-inventory.json` — per-language array of
  `{ scope, key, value, length }`.
- `reports/whatsapp-inventory.csv` — same data, flat.
- `reports/whatsapp-audit.md` — issues list (high / warn / info).

The audit applies five checks:

- **Encoding sanity** — message survives `encodeURIComponent`
  round-trip without character corruption.
- **Length sanity** — flags messages > 280 chars (UX review note,
  not a hard fail).
- **Greeting leak** — flags Spanish `Hola` greetings inside
  non-Spanish locale values (a common copy-paste leak).
- **Spanish punctuation** — flags `Hola <Verb>` (Acabo, Facturo, He,
  Quiero, Necesito, …) where the missing comma reads the verb as a
  proper noun. The regex was tightened during the task to avoid
  false positives on legitimate vocatives like `Hola Exentax,` and
  `Hola equipo,`.
- **Number consistency** — walks every `.ts` / `.tsx` / `.md` file
  under `client/src` and `shared`, captures every literal
  `wa.me/<digits>` reference and asserts the digits match
  `CONTACT.WHATSAPP_NUMBER` from `client/src/lib/constants.ts`. Any
  mismatch fails the run with exit 1, because a divergent number
  silently routes some users to the wrong phone. Latest run:
  `721 / 721` references match the canonical `34614916910`.

### 1.3 Live link smoke check

`scripts/cta-link-crawler.mjs` is a runtime crawler against the dev
server. Three checks per run:

- **(A) Registered slug consistency** — every key in `ROUTE_SLUGS`
  (`shared/routes.ts`) defines a slug for all six locales. A missing
  slug means the language switcher would emit an undefined URL.
- **(B) Discovered-link consistency** — reads
  `reports/cta-inventory.json` (regenerating it on demand), pulls
  every internal `<Link href={lp("KEY")}>` actually rendered by the
  codebase, and asserts each `KEY` is present in `ROUTE_SLUGS` for
  *all* six locales. This is what would have caught the FAQ
  `lp("booking")` ↔ `lp("book")` bug — the registry was fine, only
  the consumer was wrong, so check (A) alone could not see it.
  Plain absolute paths (`/blog`, `/legal/...`) discovered by the
  inventory are also added to the live HTTP set.
- **(C) Live HTTP** — for every (registered route ∪ discovered route
  ∪ literal `/blog/*` destination) × locale plus a sample of three
  blog posts per language, fetch `${BASE_URL}${path}` and assert
  status < 400. Catches server-side regressions
  (404 / 5xx / middleware rejections).

Default base URL is `http://localhost:5000` (the existing dev workflow
port); override with `BASE_URL=…`.

Latest run on this commit:

```
[cta-crawler] httpChecked=126 broken=0
```

17 registered route keys + 4 discovered route keys (de-duplicated
to the same set) × 6 locales = 126 HTTP checks (including 18 sampled
blog posts), all < 400.

### 1.4 Rendered link crawler (real DOM — authoritative inventory)

`scripts/cta-rendered-crawler.mjs` is the **authoritative** CTA
inventory for this audit. The static inventory in §1.1 only sees
CTAs whose `href` is written inline as `<Link href={lp("KEY")}>`,
which means it can't capture CTAs defined via variables or component
props (e.g. `<a href={link.href}>` inside a mapped nav/footer
structure). The rendered crawler eliminates that blind spot by
loading each seed page in Chromium, waiting for full hydration,
and extracting **every** anchor that actually reaches the visitor's
DOM.

**Seed coverage — 36 pages = 6 surfaces × 6 locales:**

| Surface | Why this seed |
|---|---|
| `/<lang>` (home) | navbar, hero, home sections, floating WhatsApp, footer |
| `/<lang>/<services-slug>` | services hub, mega-menu cards, services CTAs |
| `/<lang>/<faq-slug>` | FAQ inline CTAs + final FAQ booking/WhatsApp links |
| `/<lang>/<book-slug>` | booking funnel entry, calculator CTA, contact links |
| `/<lang>/blog` | blog index, post cards, category CTAs |
| `/<lang>/blog/cuanto-cuesta-constituir-llc` | a real post that exists in all six locales — exercises the blog `ArticleCTA` |

**Hydration / language settle.** SPA hydration here is two-stage:
React first mounts using the language detected from
`navigator.language` (in headless Chromium that defaults to English
regardless of the URL locale, so e.g. on `/fr` the navbar links are
briefly rendered as `/en/...`), then `LangSyncEffect` /
`BlogLangEffect` in `client/src/App.tsx` flip i18n to the URL's
locale via `useEffect`, triggering a re-render. The crawler
therefore blocks until **both** signals are true:

  1. `<html lang>` matches the URL's locale (App.tsx mirrors
     `i18n.language` to `document.documentElement.lang` on
     `languageChanged`).
  2. At least one rendered nav/header/footer `<a href>` has the
     URL's locale prefix.

Without that gating the crawler would extract the brief initial
English render and flag thousands of false positives — we observed
exactly that during development before adding the gate (351 false
positives on the French home page alone).

**Three checks run on the extracted links:**

- **Cross-language drift.** Any `<a>` rendered on a page under
  `/<lang>/...` whose `href` starts with `/<otherlang>/...` is
  flagged. The language switcher is the only legitimate emitter of
  cross-language URLs, and in this codebase it uses `<button>`
  (`client/src/components/LanguageSwitcher.tsx`), not `<a>` — so
  any matching `<a>` is automatically a real bug.
- **Live HTTP** on every unique extracted internal href; status ≥ 400
  fails the run.
- **Canonical wa.me number.** Every rendered `https://wa.me/<digits>`
  must use the same digits as `CONTACT.WHATSAPP_NUMBER`.

**Outputs:**

- `reports/cta-rendered-inventory.json` — array of every rendered
  anchor with `{page, lang, surface, category, href, text}`.
- `reports/cta-rendered-inventory.csv` — same data, flat. This is
  the spreadsheet reviewers can open to verify per-locale
  destinations end-to-end.
- `reports/cta-rendered-crawler.json` — per-surface stats +
  findings.
- `reports/cta-rendered-crawler.md` — human-readable summary
  including a per-surface coverage table.

`SKIP_RENDERED_CRAWL=1` makes the script write empty stub artifacts
and exit 0, so this check can be opted out of in CI environments
that can't host a browser. Otherwise it exits 1 on any finding.

**Latest run on this commit:**

```
[cta-rendered] seeds=36 anchors=2519 unique=168 broken=0
```

≈ 2,500 rendered anchors collected across all 36 seed pages, 168
distinct internal hrefs, zero cross-language drift, zero broken
HTTP, every rendered wa.me URL on the canonical number. Each
inventory row carries `page,lang,surface,category,href,text,testid`,
so the rendered CSV is the canonical per-locale record of *what
visitors see (text)*, *where they go (href)* and *what tracking
event fires (testid → tracker registration)*. No JOIN against
the static inventory is required for CTA attribution.

---

## 2. Issues found and fixed

### 2.1 Spanish WhatsApp greeting bugs (HIGH × 4)

Four Spanish-only WhatsApp messages started with `Hola <Verb>` instead
of `Hola, <verb>`. Without the comma the conjugated verb reads as a
proper noun (e.g. _"Hola Acabo"_ parses as a greeting to a person
called "Acabo"). Fixed in `client/src/i18n/locales/es.ts`:

| Key | Before | After |
|---|---|---|
| `whatsappDefault` | `Hola Facturo online y busco…` | `Hola, facturo online y busco…` |
| `whatsappNav` | `Hola Acabo de ver Exentax…` | `Hola, acabo de ver Exentax…` |
| `whatsappConfirmMsg` | `Hola Acabo de reservar una asesoría…` | `Hola, acabo de reservar una asesoría…` |
| `whatsappMessage` (calculator) | `Hola He usado vuestra calculadora…` | `Hola, he usado vuestra calculadora…` |

Re-running `cta-whatsapp-audit.mjs` after the fix:

```
[whatsapp-audit] high=0 warn=0 info=0
```

### 2.2 FAQ → booking link pointed at undefined route (HIGH × 1)

`client/src/components/sections/FAQ.tsx:257` used
`href={lp("booking")}`. The route key in `shared/routes.ts` is `book`,
not `booking`. The `useLangPath` hook treats unknown keys as
literal paths, so the link rendered as the bare string `"booking"` —
broken navigation in every language.

Fix: changed to `href={lp("book")}`. Now resolves to
`/es/agendar`, `/en/book`, `/fr/reserver`, `/de/buchen`, `/pt/agendar`,
`/ca/agendar` as expected.

### 2.3 Tracking gaps on five primary CTAs (MEDIUM × 5)

The following primary CTAs already had `data-testid`s but never
emitted `cta_click` to GA4 / Meta Pixel, so funnel reports could not
attribute conversions to them. Added `trackCTA(...)` / `trackWhatsAppClick(...)`
calls (consistent with the existing tagging convention used by
the navbar WhatsApp button, the floating WhatsApp button and the
final FAQ WhatsApp link):

| Surface | File | New `cta_name` |
|---|---|---|
| Home final CTA — book | `components/sections/HomeFinalCTA.tsx` | `home_final_book` |
| Home final CTA — WhatsApp | `components/sections/HomeFinalCTA.tsx` | (loc) `home_final_cta` |
| Floating mobile sticky CTA | `components/layout/FloatingMobileCTA.tsx` | `floating_mobile_book` |
| Navbar — desktop "Reservar" | `components/layout/Navbar.tsx` | `navbar_book` |
| Navbar — mobile "Reservar" | `components/layout/Navbar.tsx` | `navbar_mobile_book` |
| NavbarFunnel — "Free consultation" | `components/layout/NavbarFunnel.tsx` | `navbar_funnel_book` |
| FAQ final CTA — book | `components/sections/FAQ.tsx` | `faq_final_book` |

All names follow the existing `<surface>_<action>` convention
(`navbar`, `navbar_mobile`, `footer_contact`, `floating`, `hero`,
`faq_final_cta` already in use). The downstream `cta_location` /
`cta_name` filters in GA4 segments now have full coverage of the
booking funnel entry points.

---

## 3. Validation

### 3.1 Static — scripts

```
$ node scripts/cta-inventory.mjs
[cta-inventory] scanned 89 files, captured 73 CTAs
  link: 51
  whatsapp: 20
  mailto: 2

$ node scripts/cta-whatsapp-audit.mjs
[whatsapp-audit] high=0 warn=0 info=0
[whatsapp-audit] wa.me number consistency: 721/721 match canonical 34614916910

$ node scripts/cta-link-crawler.mjs
[cta-crawler] httpChecked=126 broken=0

$ node scripts/cta-rendered-crawler.mjs
[cta-rendered] seeds=36 anchors=2519 unique=168 broken=0
```

All four scripts exit 0. The rendered-crawler counts above
(`seeds=36 anchors=2519 unique=168`) are the same numbers the
crawler writes into `reports/cta-rendered-crawler.{md,json}`,
so report prose and machine-readable artifacts cannot drift.

### 3.2 Playwright — `tests/e2e/cta-navigation.spec.ts`

Runs **36 specs (6 surfaces × 6 locales)** on chromium:

- `[lang] hero CTAs — primary booking + WhatsApp are well-formed`
  — `button-hero-agendar` resolves to `/lang/{book-slug}` and
  `button-hero-whatsapp` emits a canonical `wa.me/34614916910?text=…`
  URL.
- `[lang] navbar booking CTA navigates to /lang/{book-slug}` — both
  desktop and mobile booking buttons resolve to the localized
  booking slug.
- `[lang] floating WhatsApp bubble points at canonical wa.me` —
  `button-floating-whatsapp` (the persistent corner bubble) uses the
  canonical number and a non-empty pre-fill.
- `[lang] home final CTA — book + WhatsApp links are well-formed`
  — `cta-final-agendar` uses the localized `book` route and
  `cta-final-whatsapp` emits a `wa.me/...?text=…` URL.
- `[lang] footer booking link points at /lang/{book-slug}` — the
  in-footer booking anchor resolves to the localized booking slug
  and `link-footer-whatsapp-contact` is canonical.
- `[lang] blog ArticleCTA — localized primary + WhatsApp on a real
  post` — visits `/lang/blog/cuanto-cuesta-constituir-llc` (a post
  that exists in every locale), asserts `button-post-agendar`
  resolves to a real locale-prefixed internal URL (the actual route
  varies by article CTA pattern — `book`, `services`, `itin`,
  `florida`, `banking`, `hold`), and `button-post-whatsapp` emits a
  canonical `wa.me` URL.

The Spanish variant of every WhatsApp assertion additionally guards
against the `Hola <Verb>` regression (Acabo, Facturo, He, Quiero,
…) fixed in §2.1.

```
36 passed (1.4m)
```

The spec is auto-discovered by the existing `testMatch`
(`tests/e2e/*.spec.ts`) in `playwright.config.ts`; no config change
needed. CTA-event tracking remains covered separately by
`tests/e2e/analytics-events.spec.ts` (which depends on the
`E2E_TEST_HOOKS=1` server flag).

---

## 4. Files touched

### Source code

- `client/src/i18n/locales/es.ts` — 4 Spanish WhatsApp message
  punctuation fixes.
- `client/src/components/sections/HomeFinalCTA.tsx` — added
  `trackCTA` (book) and `trackWhatsAppClick` (whatsapp).
- `client/src/components/layout/FloatingMobileCTA.tsx` — added
  `trackCTA`.
- `client/src/components/layout/Navbar.tsx` — added `trackCTA` to
  desktop and mobile booking links.
- `client/src/components/layout/NavbarFunnel.tsx` — added `trackCTA`.
- `client/src/components/sections/FAQ.tsx` — fixed `lp("booking")`
  → `lp("book")` and added `trackCTA`.

### Tooling & tests

- `exentax-web/scripts/cta-inventory.mjs` (new — also emits the
  per-locale expansion described in §1.1)
- `exentax-web/scripts/cta-whatsapp-audit.mjs` (new)
- `exentax-web/scripts/cta-link-crawler.mjs` (new)
- `exentax-web/scripts/cta-rendered-crawler.mjs` (new — Playwright
  rendered-DOM crawler described in §1.4; **the authoritative
  inventory** for this audit)
- `exentax-web/scripts/cta-canonical.mjs` (new — joins the
  rendered DOM inventory with the static source inventory on
  `data-testid` to produce one fully-resolved
  `reports/cta-canonical.{csv,json}` artifact)
- `exentax-web/tests/e2e/cta-navigation.spec.ts` (new)

### Generated reports (kept under `exentax-web/reports/`)

- `cta-inventory.{md,csv,json}` and `cta-inventory-by-locale.{csv,json}`
- `whatsapp-inventory.{csv,json}` + `whatsapp-audit.md`
- `cta-crawler.{md,json}`
- `cta-rendered-crawler.{md,json}` and
  `cta-rendered-inventory.{csv,json}` (authoritative per-locale
  rendered CTA inventory)
- `cta-canonical.{csv,json}` — rendered ⨝ static merged on
  **(a) `data-testid`** and **(b) resolved URL** (the static row's
  `lp("KEY")` destination is expanded through `ROUTE_SLUGS` to
  per-locale URLs and matched against `rendered.href`). The
  result is a single artifact with
  `page,lang,surface,category,href,text,testid,matched_by,
  file_lines,source_labels,tracking`. Generated by
  `scripts/cta-canonical.mjs`. The JSON `_meta` block records
  the join rate per generation (currently 906/2519 ≈ 36% of
  rendered rows: 175 by testid + 731 by resolved URL). Rows
  that fail to join are mostly anchors emitted by component
  iterators (footer link arrays, nav menu maps) where the
  static regex parser cannot see the individual `<a>`; they are
  still present in the rendered inventory with full
  `{href,text,testid}` data — only the `file_lines / tracking`
  columns are blank for those rows. `_meta.column_completeness`
  spells out which columns are guaranteed-complete vs
  best-effort to prevent over-claiming.
- `cta-audit-report.md` (this document)
- `README.md` — orientation guide that names the authoritative
  dataset (rendered inventory), the canonical merged dataset,
  and the companion static inventory, with re-run instructions.

---

## 5. How to re-run

From `exentax-web/`, with the dev server running on port 5000:

```bash
node scripts/cta-inventory.mjs
node scripts/cta-whatsapp-audit.mjs
node scripts/cta-link-crawler.mjs

# Real DOM crawler (Playwright Chromium must be installed):
node scripts/cta-rendered-crawler.mjs
# Or skip if browsers aren't available in CI:
SKIP_RENDERED_CRAWL=1 node scripts/cta-rendered-crawler.mjs

# Canonical merged inventory (rendered DOM ⨝ static source on
# data-testid). Pure derivation — no server / no browser needed —
# so always safe to run last.
node scripts/cta-canonical.mjs

# Playwright (browsers must be installed):
npx playwright test tests/e2e/cta-navigation.spec.ts --project=chromium
```

All four audit scripts exit non-zero on findings, so they are safe
to wire into a `npm run audit:cta` task or a GitHub Actions step in
`.github/workflows/`.
