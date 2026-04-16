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
