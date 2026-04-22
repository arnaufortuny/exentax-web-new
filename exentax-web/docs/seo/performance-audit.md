# Performance audit — Exentax 2026

Scope: the SEO overhaul includes a measurable Core Web Vitals (CWV)
pass for the most commercially important URLs. This document
records the **baseline**, the **changes shipped in this task**, and
the **measurement procedure** the team should re-run against the
production deployment once the overhaul is live.

Authority for the targets: Google's 2024/2026 CWV thresholds
(LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1).

---

## 1. Audit targets

We measure four URLs that together cover every template type on
exentax.com:

| # | URL                                       | Template              |
|---|-------------------------------------------|-----------------------|
| 1 | `/es`                                     | `home`                |
| 2 | `/es/sobre-las-llc`                       | `about_llc` (long-form)|
| 3 | `/es/blog`                                | blog index            |
| 4 | `/es/blog/llc-vs-autonomo-espana-2026`    | blog article          |

The same URLs should be re-measured on `/en` to confirm the
multilingual copy does not regress performance (same JS bundle, so
LCP/INP should be parity; content length changes only affect
document transfer size and TBT marginally).

---

## 2. Baseline (pre-overhaul)

Baseline captured from the production build running in the Replit
preview with Chrome DevTools Lighthouse 12, emulated Moto G Power,
Slow 4G. One cold run per URL, DevTools in incognito to eliminate
extension noise.

| URL                   | Perf | LCP   | INP*  | CLS  | TBT    |
|-----------------------|------|-------|-------|------|--------|
| `/es`                 | 72   | 3.2 s | 190 ms| 0.07 | 410 ms |
| `/es/sobre-las-llc`   | 78   | 2.9 s | 160 ms| 0.05 | 320 ms |
| `/es/blog`            | 81   | 2.7 s | 140 ms| 0.04 | 280 ms |
| `/es/blog/<post>`     | 80   | 2.8 s | 150 ms| 0.04 | 290 ms |

\* INP is proxied by Total Blocking Time during Lighthouse lab
runs; production INP should be read from CrUX / Search Console
(Chrome User Experience Report).

Findings:

- **LCP on `/es` at 3.2 s is amber** — the main blocker. Two root
  causes identified from the request waterfall:
  1. `client/index.html` was preloading six below-the-fold partner
     logos (`partner-mercury.webp`, `partner-relay.webp`,
     `partner-visa.webp`, `partner-stripe.webp`,
     `partner-wallester.webp`, `partner-wise.png`) as
     `rel="preload" as="image"`. That added ~65 KB of contended
     bandwidth on the critical path and pushed the LCP image
     (hero logo) behind them.
  2. `BanksCarousel.tsx` additionally marked the first 10 carousel
     images with `loading="eager"` and `fetchpriority="high"`.
     Because the carousel is below the fold on every viewport
     we verified, those images had no business being high-priority.
- **CLS** is within green on every URL — the static layout in the
  hero and the fixed `width`/`height` attributes on carousel
  images give the browser enough information to reserve space.
- **INP/TBT** is dominated by the React hydration of the wouter
  router + the shadcn Radix primitives on first interaction. Not
  blocking for this overhaul.

---

## 3. Changes shipped in this task

### 3.1 Removed below-the-fold preloads (`client/index.html`)

Dropped six `<link rel="preload" as="image">` entries pointing at
`/img/partner-*.webp|png`. Replaced with a dated comment block
explaining why (so nobody adds them back). The partner logos are
still fetched when the carousel enters the viewport — they just no
longer compete with the LCP candidate on the critical path.

Expected impact: LCP −400 to −700 ms on mobile 4G, because the
hero image now owns the first-byte bandwidth window. On cable /
desktop the effect is smaller but non-zero (less contention on the
preload scanner).

### 3.2 Fixed `BanksCarousel` priority hints

`client/src/components/sections/BanksCarousel.tsx` used to hint
`loading="eager"` and `fetchpriority="high"` for the first
`BANKS.length` entries of the duplicated carousel track. That was
indiscriminate — every visitor paid for 10 eager image fetches
even though the carousel is never the LCP element.

Change: all carousel images are now
`loading="lazy" fetchpriority="low" decoding="async"`. Dimensions
(`width={140} height={56}`) are preserved, so there is no CLS
regression.

Expected impact: −50 to −120 ms LCP, −80 to −200 ms TBT on mobile,
depending on the device’s image-decoding throughput.

### 3.3 Schema injection coverage for `/` (`server/static.ts`)

The previous `injectMeta` gated the `ProfessionalService` and
`WebSite` JSON-LD on `resolvedRoute?.key === "home"`. But
`resolveServerRoute("/")` returns `null` in this routing model —
only `/es`, `/en`, … resolve. So the root `/` was silently missing
both schemas despite the changelog claiming coverage. Fixed by
switching the condition to the `routeKey` local variable, which
already falls back to `"home"` when the path is `/`. Verified by
`curl` — both `/` and `/es` now emit the `WebSite` +
`ProfessionalService` JSON-LD blocks.

This is not a CWV optimization per se, but it was called out in
the code review as a blocking inconsistency and belongs in this
same deployment window.

### 3.4 Side effects that also help performance

The 301 redirect middleware added in an earlier step
(`server/index.ts`) consolidates every legacy unprefixed Spanish
URL onto `/es/...`. That eliminates the duplicate-crawl tax on
Googlebot and, via reduced crawl budget waste, improves
`crawl-stats` utilization in Search Console — not a direct LCP win
but it strengthens the indexation side of the overhaul.

---

## 4. Expected post-change Lighthouse scores

Projected from the same Moto G Power / Slow 4G profile. These are
projections, not measurements — the team must run the real
Lighthouse audit against the production deployment and update
this table before marking the overhaul as "CWV green".

| URL                   | Perf (proj.) | LCP (proj.) | Notes                           |
|-----------------------|--------------|-------------|---------------------------------|
| `/es`                 | 88–92        | 2.2–2.4 s   | was the biggest regression source|
| `/es/sobre-las-llc`   | 88–92        | 2.3–2.5 s   | long-form but same critical path |
| `/es/blog`            | 90–94        | 2.3–2.5 s   | no hero image                    |
| `/es/blog/<post>`     | 88–92        | 2.4–2.6 s   | cover image drives LCP           |

The numeric projections are intentionally conservative. The team
should treat the "before/after" evidence as valid only after a
real production run.

---

## 5. Measurement procedure (repeatable)

Run this exact sequence after every SEO-affecting deployment.

1. Pull fresh production: `https://exentax.com/es`, etc.
2. Chrome DevTools → Lighthouse → **Mobile**, **Performance only**,
   "Simulated throttling".
3. Use incognito with no extensions.
4. Three runs per URL; record the **median** (not best, not mean —
   median is the robust Lighthouse convention).
5. Also pull field data from Search Console → **Core Web Vitals**
   report for each URL group. Field data is what Google actually
   ranks on; lab scores are a proxy.
6. Record the run in a new section of this file with the date, the
   git SHA of the deployment, and the median numbers.

Commands to reproduce locally (once the build server is running on
port 5000):

```bash
# Full Lighthouse JSON per URL (requires node's `lighthouse` CLI):
npx lighthouse http://localhost:5000/es \
  --preset=perf --form-factor=mobile \
  --output=json --output-path=./lighthouse-es.json --quiet
```

---

## 6. What is intentionally **not** in this task

The audit identified, but **did not ship**, the following
optimizations. They are larger work items tracked in
`docs/seo/audit-2026.md`:

- Self-hosting `Space Grotesk` instead of fetching from Google
  Fonts (eliminates two DNS + two TLS handshakes; expected
  −150 ms LCP on cold mobile).
- Route-level code splitting for the blog article page — it pulls
  the full Radix primitive set today.
- Adopting `<link rel="modulepreload">` for the one-deep dynamic
  import of the blog index.
- WebP/AVIF conversion for the remaining `.png` partner logos
  (`partner-interactive-brokers.png`, `partner-trustpilot.png`,
  `partner-wise.png`).

Each of those is a separate PR because each changes the build
pipeline or asset pipeline, which is out of scope for this SEO
overhaul.

---

## 7. Code-splitting pass (Task #12)

Following the audit recommendation in §2.5, the heaviest below-the-fold
modules on the home page (`/es`) and the services page
(`/es/nuestros-servicios`) are now loaded with `React.lazy()` +
`Suspense`. The goal is a ~30 % faster initial JS payload on mobile,
measured from the home route.

### 7.1 Bundle visualizer report

`rollup-plugin-visualizer` is wired into `vite.config.ts` and only
runs when the build is invoked with `BUILD_ANALYZE=1`:

```bash
cd exentax-web && BUILD_ANALYZE=1 npx vite build
```

The resulting treemap is written to
`docs/seo/bundle-visualizer.html` (gzip + brotli sizes). Open it in
a browser to inspect what each chunk contains. Re-generate it before
re-measuring Lighthouse so the chunk graph matches the deployed
bundle.

### 7.2 What was split

- **`client/src/components/sections/Hero.tsx`** no longer imports
  `Calculator` statically. The calculator widget is rendered inside
  a `<Suspense>` boundary and downloaded on demand. The calculator
  sits below the H1, the two CTA buttons, and `HeroStats`, so on
  mobile (where it is below the fold) it no longer blocks the home
  LCP candidate.
- **`client/src/components/calculator/index.tsx`** lazy-loads
  `CalculatorResults` and `EmailGateForm`. Neither view is needed
  until the visitor actually fills in the form — splitting them
  removes their JS (and their downstream imports such as
  `IrpfBracketsTable`, `AnimatedNumber`, `BrandIcons`,
  `PhoneInput`) from the initial calculator chunk.
- **`client/src/pages/services.tsx`** now ships only `PreciosHero`
  in the route's main chunk. `ComparativaSection`, `LLCPlansSection`,
  `MaintenanceSection`, `PricingFAQSection` and `PreciosCTAFinal`
  were extracted into `client/src/pages/services-sections.tsx`,
  loaded via `React.lazy()` behind a Suspense boundary that reserves
  vertical space (no CLS).

### 7.3 Verified bundle output

After `BUILD_ANALYZE=1 npx vite build`, the relevant chunks land
as their own files (gzip sizes shown in the build log):

```
calculator-*.js              ~15 kB   (was inlined into home.js)
CalculatorResults-*.js       ~15 kB   (was inlined into calculator)
EmailGateForm-*.js           split out via the same mechanism
services-sections-*.js       ~22 kB   (was inlined into services.js)
```

The home route entry shrinks from 53 kB (pre-split, calculator
inlined) to a slimmer payload that loads the calculator chunk only
after the hero is interactive. The services route entry now ships
only the hero block until the user scrolls.

### 7.4 Re-measurement procedure

The numerical "30 % faster" claim must be re-validated against the
production deployment using §5 above. Capture the median of three
mobile Lighthouse runs for `/es` and `/es/nuestros-servicios`, and
record the new LCP / TBT next to the §2 baseline. The
`bundle-visualizer.html` report should be re-generated and
committed as part of the same PR so the chunk graph and the metrics
move together.

---

## 8. Re-measurement after release tasks #27/#28/#29 (Task #37)

**Date**: 2026-04-19
**Build**: `npm run build` against commit `6f6a71e`
**Procedure**: §5, three runs per URL, median reported. Lighthouse
12.8.2, simulated throttling (Slow 4G + 4× CPU), screen 412×823
DPR 1.75, performance category only.
**Tooling caveat**: the audit ran inside the Replit CI container,
not on a Moto G Power. The `dist/index.mjs` server enforces HSTS +
`upgrade-insecure-requests` over plain HTTP, which Chrome treats as
an interstitial when the origin is `http://localhost`. To unblock
the run we routed Lighthouse through a same-host Node passthrough
on `127.0.0.1:5002` that strips `Strict-Transport-Security` and
`Content-Security-Policy` from the upstream response. The proxy
adds <2 ms over the loopback and does not affect simulated
throttling math, so the LCP / TBT figures are still meaningful as a
lab signal — only the absolute Performance score should be read as
"CI-pessimistic, not a Moto G number".

### 8.1 Median results

| URL                                       | Perf (median of 3) | LCP   | TBT    | CLS  | FCP   | SI    |
|-------------------------------------------|-------------------:|------:|-------:|-----:|------:|------:|
| `/es`                                     | 53 (49 / 53 / 54)  | 7.2 s | 409 ms | 0.00 | 5.3 s | 5.3 s |
| `/es/sobre-las-llc`                       | 54 (54 / 57 / 54)  | 6.5 s | 402 ms | 0.00 | 5.3 s | 5.3 s |
| `/es/blog`                                | 59 (58 / 59 / 60)  | 6.2 s | 261 ms | 0.00 | 5.3 s | 5.3 s |
| `/es/blog/llc-vs-autonomo-espana-2026`    | 56 (56 / 56 / 54)  | 6.5 s | 384 ms | 0.05 | 4.8 s | 4.8 s |

Note on URL set: the release checklist named "calculadora" as the
second target, but the calculator widget renders inline on the home
route — there is no standalone `/es/calculadora` URL in the SPA or
the sitemap (the path SPA-falls-back to home). `/es/sobre-las-llc`
is kept as the long-form template stand-in, matching §2.

### 8.2 Verdict against the ≥ 90 gate

**All four URLs are below the ≥ 90 mobile-performance gate.** CLS
is green everywhere (≤ 0.05), so the language-switch / JSON-LD
work in #27/#28/#29 has not introduced layout-shift regressions —
that part of the gate is met. The miss is concentrated in LCP /
FCP / TBT, with two clear contributors:

1. **The CI-container Lighthouse run is pessimistic by design.**
   Slow 4G + 4× CPU on a shared NixOS container will not match the
   Moto G Power numbers in §2 even on identical code. Production
   field data (CrUX) should be the tiebreaker before declaring a
   real regression.
2. **The `index-*.js` chunk is 1.49 MB uncompressed (≈ 470 KB
   gzip).** That is the dominant blocker for FCP/LCP on simulated
   Slow 4G — the document parses fast, but the SPA bootstrap
   blocks the LCP candidate until the bundle parses and the React
   tree mounts. This is consistent across all four URLs (FCP is
   essentially flat at 5.3 s) and matches the §6 "intentionally
   not in this task" backlog item about route-level splitting and
   modulepreload.

The CLS portion of the release checklist is **passed**. The
Performance ≥ 90 portion is **not re-confirmed in lab** and is
opened as the follow-up below.

### 8.3 Follow-up

Two concrete follow-ups are opened to chase the LCP/TBT gap, both
linked to this task:

- **#38 — "Confirmar el ≥ 90 de Lighthouse mobile con datos reales
  (Search Console / Chrome real)"**: re-validate the gate against
  (a) the deployed production origin with a real headed Lighthouse
  run, and (b) the CrUX / Core Web Vitals report from Search
  Console for the four URL groups. Field data is the tiebreaker
  before declaring a true regression vs. CI-environment noise.
- **#39 — "Bajar el peso del bundle inicial para que la home
  cargue antes en móvil"**: split the 1.49 MB `index-*.js` chunk
  per route (blog index, blog article, services) and add
  `<link rel="modulepreload">` for the blog index dynamic import
  (§6 backlog items, now scheduled). Expected delta: −1.5 to
  −2.0 s on `/es` LCP.

If #38 confirms the gap in production field data, #39 becomes the
unblocker for the release-checklist "≥ 90" item.
