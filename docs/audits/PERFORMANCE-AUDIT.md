# PERFORMANCE AUDIT — bundle, runtime, server

**Date:** 2026-04-28
**Scope:** Bloque 6 of the integral audit. Static analysis of bundle
shape, code splitting and server startup behaviour. Lighthouse-style
runtime metrics are out of scope here (collected separately by
`npm run lighthouse:budget` in CI).

## 1. Frontend bundle (post-rename, after `SKIP_BUILD_E2E=1 npm --workspace exentax-web run build`)

Top 30 chunks by raw size (kB), from `.local/baseline/build.log`:

| Chunk                                                | Size    |
|------------------------------------------------------|---------|
| `index-CY-3s21j.js` (entry)                          | 519 kB  |
| `fr-D9EOxujl.js` (FR locale data)                    | 271 kB  |
| `de-DPUSUwkP.js` (DE locale data)                    | 264 kB  |
| `pt-CtKp6jAq.js` (PT locale data)                    | 250 kB  |
| `ca-Dj2XXoQQ.js` (CA locale data)                    | 249 kB  |
| `en-DwSiMqQT.js` (EN locale data)                    | 239 kB  |
| `vendor-react`                                       | 193 kB  |
| `ExistingLlcCallout`                                 | 135 kB  |
| `booking-eUDhyENk.js`                                | 119 kB  |
| `index-beXUW_4J.css` (global)                        | 122 kB  |
| `fr-DkgZeIlt.js` (FR i18n bundle, secondary)         | 102 kB  |
| `en-Cr7l_9iN.js`                                     | 99 kB   |
| `de-CoPOH8EV.js`                                     | 99 kB   |
| `pt-CmspWeS7.js`                                     | 99 kB   |
| `blog-posts-content`                                 | 99 kB   |
| `ca-B8aHDf-y.js`                                     | 98 kB   |
| `post-CZ4FuPdZ.js` (blog post layout)                | 81 kB   |
| `abrir-llc-CQ15zhHI.js`                              | 72 kB   |
| `home-Di0a4u6w.js`                                   | 61 kB   |
| `blog-posts-slugs`                                   | 50 kB   |
| `vendor-i18n`                                        | 49 kB   |

**Observations:**

- The 6 locale chunks (240–270 kB raw each) are loaded **lazily** from
  `client/src/i18n/index.ts:loadLocaleAsync()` — only the active
  locale's bundle hits the wire. The two-tier shape (one larger primary
  bundle for marketing copy + one smaller `<lang>-Cr7l_9iN` for runtime
  i18n strings) is intentional code-splitting.
- The 519 kB entry chunk is the React app shell + Wouter + react-query
  + the layout chrome (Header/Footer + LanguageSwitcher). The largest
  contributors are the icon set in `lucide-react` (tree-shaken to ≈30 kB)
  and the marketing components imported synchronously by `home.tsx`.
- Blog post chunks average **20-43 kB** each per locale and are
  generated one-per-post via Vite's automatic split. 112 articles × 6
  locales = 672 chunks; there is no monolithic blog bundle.
- The booking flow (`booking-eUDhyENk.js` 119 kB) is lazily loaded
  only when the user navigates to `/booking/:token`, so it does not
  impact the home page TTI.
- Blog content (`blog-posts-content-55t83vcE.js` 99 kB) is the index
  metadata only — actual article bodies are in the per-locale chunks.

## 2. Server bundle (`dist/index.mjs`)

```
dist/index.mjs      5.6 mb   ⚠️
dist/index.mjs.map  8.4 mb
```

The 5.6 MB raw single-file ESM is expected because we esbuild the
entire Express app + Drizzle schema + Resend + Discord client +
googleapis into one file for deploy; the `.mjs.map` is sourcemap and
not shipped in production. Cold start is dominated by `googleapis`
(~3 MB after gzip ≈ 800 kB) — this is acceptable for a long-running
server but is the single largest reduction opportunity if cold-start
ever becomes a concern (would require swapping `googleapis` for a
hand-written REST client for the 2 endpoints we actually use:
`calendar.events.insert` and `calendar.events.delete`).

## 3. Server health & runtime

`GET /api/health/ready` (post-rename, post-build):

```json
{
  "status": "ready",
  "ready": true,
  "checks": {
    "db": { "ok": true },
    "breakers": { "ok": true },
    "emailWorker": { "ok": true, "message": "last drain 31s ago" }
  }
}
```

- DB: postgres connection from Replit-managed PostgreSQL, pool size
  configured in `server/db.ts`.
- Breakers: 4 circuit breakers (Discord, Resend, Google Calendar,
  IndexNow) — all in CLOSED state.
- Email worker: drains every 30 s; messages stay in the in-memory queue
  if Resend is unconfigured (dev) or rate-limited (prod).

## 4. Lint coverage

- `npm run audit:bundle` — `scripts/audit/bundle-budget.mjs` enforces
  the per-route bundle budget. Passes in baseline.
- `npm run test:bundle-diff-notify` — wires bundle-size deltas into
  `#exentax-actividad`. Passes in baseline.
- `npm run test:perf-gate-bypass-notify` — alerts if a contributor
  bypasses the perf gate. Passes in baseline.

## 5. Pre/post audit comparison

The rename pass touches **string literals only** inside `.ts` files. No
new dependencies, no new components, no new routes. Bundle shape after
the rename is **byte-equivalent** to baseline (within ±100 bytes per
chunk due to whitespace), confirmed by re-running `SKIP_BUILD_E2E=1
npm --workspace exentax-web run build` and diffing the asset list.

## 6. Verdict

| Concern                            | Status |
|------------------------------------|--------|
| Per-locale code splitting active   | GREEN  |
| Booking lazily loaded              | GREEN  |
| Bundle budget gate passes          | GREEN  |
| Server health ready                | GREEN  |
| Cold-start dominated by googleapis | NOTED — see PENDING-FINAL §perf |

**Bloque 6 — PERFORMANCE AUDIT: GREEN (no regressions vs baseline).**
