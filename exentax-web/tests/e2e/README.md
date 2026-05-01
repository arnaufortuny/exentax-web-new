# Playwright E2E suite

This folder holds the **three blocking** end-to-end specs that gate
merges to `main` (PENDING.md §14):

| Spec | What it covers |
| --- | --- |
| `booking-flow.spec.ts` | `/agendar` → qualification → calendar → date → slot → meeting type → form → success (ES + EN), plus `/booking/:token` reschedule + cancel happy paths. The success-path test captures the `POST /api/bookings/book` payload and asserts every field the server-side `sendBookingConfirmation` template needs (`name`, `lastName`, `email`, `phone` E.164, `meetingType`, `date`, `startTime`, `privacyAccepted`) — a CI-safe equivalent of "the confirmation email was dispatched with the right data" without bringing up Gmail. |
| `calculator-flow.spec.ts` | `/start` calculator (lazy-mounted) emits a branded `/api/calculator-leads` POST whose payload is asserted (email, phone, country, regime, activity, privacy, savings, effective rate, language, …). The captured payload is then forwarded to the test-only endpoint `POST /api/__test/render-calculator-email` (gated on `NODE_ENV !== "production" \|\| E2E_TEST_HOOKS=1` + `x-e2e-test: 1` header), which invokes the real `renderCalculatorEmailHtml` and returns the actual customer-facing HTML. The spec asserts `<!DOCTYPE`, brand color (`00E510`), the savings figure (with locale-tolerant thousands separators), the email's local-part, and `lang ∈ {es,en,fr,de,pt,ca}`. Also verifies `country=reino-unido` hides the CCAA selector. |
| `language-switch.spec.ts` | The 5 non-Spanish locales (en/fr/de/pt/ca) each receive a switch from `/es/blog/cuanto-cuesta-constituir-llc`, persist via `localStorage["exentax_lang"]`, expose a matching `<link rel="alternate" hreflang>` (BCP-47), and survive a full reload. |
| `analytics-events.spec.ts` | Asserts that the six tracked GA4/Meta events (`whatsapp_click`, `language_switch`, `cta_click`, `newsletter_subscribe`, `calculator_used`, `booking_completed`) actually push into `window.dataLayer` from the real `Tracking.tsx` helpers. The dev/localhost short-circuit in `hasAnalyticsConsent()` is bypassed by a server-injected `<script>window.__EXENTAX_E2E_TRACKING__=true;</script>` (see `server/e2e-hook.ts`) that is **only** emitted when the server was started with `E2E_TEST_HOOKS=1`. The hook is OFF by default in production and OFF in the standard "Start application" workflow. CI works because the Playwright config (`playwright.config.ts`) injects `E2E_TEST_HOOKS=1` into the `webServer.env` it spawns when `CI=1`. External GA4 and Meta `<script>` loads — and outbound `wa.me` / `whatsapp.com` navigations — are blocked via `context.route` so the suite stays hermetic. |

Only specs inside `tests/e2e/` are picked up by `npm run test:e2e`
(via the `testMatch` in `playwright.config.ts`). New Playwright specs
that should gate merges must be added here. The non-Playwright files
in `exentax-web/tests/` (`*.test.ts`, `*.test.mjs`) are run by
`npm run test` (Vitest / node) and are unrelated to this suite.

## Browser projects

Per tasks 29 + 39, the suite runs across the seven surfaces our real
users reach. Each is declared in `playwright.config.ts` and runs as its
own parallel job in CI.

| Project | Engine | Device profile | Catches |
| --- | --- | --- | --- |
| `chromium` | Chromium | `Desktop Chrome` | Chrome / Edge / Brave on desktop |
| `firefox` | Firefox | `Desktop Firefox` | Gecko-only layout / form quirks |
| `webkit` | WebKit | `Desktop Safari` | macOS Safari date inputs, JIT diffs |
| `mobile-chrome` | Chromium | `Pixel 7` | Android viewport + touch interactions |
| `mobile-safari` | WebKit | `iPhone 14` | iOS Safari keyboard / viewport / touch |
| `tablet-ipad` | WebKit | `iPad (gen 11)` | iPadOS Safari intermediate viewport (e.g. /agendar CTA stacking) |
| `tablet-android` | Chromium | `Galaxy Tab S4` | Android tablet intermediate viewport + touch |

`npm run test:e2e` defaults to `--project=chromium` so local iteration
stays fast. To run a different surface locally, pass the project flag
directly:

```bash
cd exentax-web
PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
  npx playwright test --project=firefox
# or webkit / mobile-chrome / mobile-safari / tablet-ipad / tablet-android
```

Run every project at once (slow — same as the CI matrix in one shell):

```bash
PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
  npx playwright test
```

If a browser engine is missing locally, install only what you need:

```bash
PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
  npx playwright install chromium firefox webkit
```

(Mobile projects re-use the chromium and webkit engines, so you do not
need to install anything extra for `mobile-chrome` / `mobile-safari`.)

To open the HTML report after a run:

```bash
npx playwright show-report
```

## Running locally

The Replit "Start application" workflow already serves the app on
`http://localhost:5000`. The default Playwright config detects that and
does **not** spin up a second server, so just run:

```bash
cd exentax-web
PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
  npx playwright test --project=chromium
```

(Or equivalently `npm run test:e2e`.)

### `analytics-events.spec.ts` requires the E2E tracking hook

`analytics-events.spec.ts` asserts that the real `Tracking.tsx`
helpers push into `window.dataLayer`. Those helpers gate on
`hasAnalyticsConsent()`, which short-circuits to `false` on
`localhost` / `*.replit.dev` so devs do not inadvertently fire GA4
beacons. The spec relies on the server-injected
`<script>window.__EXENTAX_E2E_TRACKING__=true;</script>` (see
`server/e2e-hook.ts`) that is emitted **only** when the server was
started with `E2E_TEST_HOOKS=1`.

The default "Start application" workflow does not set that flag (so
the dataLayer stays inert during normal dev), so to run this spec
locally either:

1. Let Playwright spawn its own server by setting `CI=1`:

   ```bash
   cd exentax-web
   CI=1 PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
     npx playwright test --project=chromium tests/e2e/analytics-events.spec.ts
   ```

   The `webServer.env` block in `playwright.config.ts` injects
   `E2E_TEST_HOOKS=1` for the spawned server.

2. **Or** start a second dev server in another shell with the flag set
   and point the suite at it:

   ```bash
   cd exentax-web
   PORT=5050 E2E_TEST_HOOKS=1 npm run dev
   # in another shell
   BASE_URL=http://localhost:5050 \
     PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
     npx playwright test --project=chromium tests/e2e/analytics-events.spec.ts
   ```

If neither is true, the spec's `ensureHookEnabled` helper throws a
clear error pointing back here rather than silently passing on an
empty `dataLayer`.

## Running as part of `npm run check` (Task #83)

The Playwright suite is wired into the local quality gate via
`npm run test:e2e:gate` (added to `check:serial` and registered in
`scripts/check.mjs`'s `STEPS` table). This closes the historical
window where a broken `data-testid` (e.g. `select-ccaa-profile` →
`select-ccaa`) could pass `npm run check` and `quality-pipeline.yml`
on the same commit and only turn red hours later via `e2e.yml`.

What runs in the gate vs. what runs in `e2e.yml`:

| Surface | `npm run check` (local + `quality-pipeline.yml`) | `e2e.yml` (separate workflow) |
| --- | --- | --- |
| `chromium` | ✅ via `test:e2e:gate` | ✅ |
| `firefox` / `webkit` | — | ✅ |
| `mobile-chrome` / `mobile-safari` | — | ✅ |
| `tablet-ipad` / `tablet-android` | — | ✅ |
| `analytics-events.spec.ts` | — (skipped, needs `E2E_TEST_HOOKS=1` on the dev server) | ✅ (Playwright spawns its own server with the flag set) |
| Other 5 specs | ✅ | ✅ |

The two are complementary, not redundant. The gate is the fast
feedback loop ("did THIS commit break a flow?"); the matrix
workflow is the regression net for cross-browser drift.

### `scripts/test-e2e-gate.mjs`

The wrapper exists so the gate fails *informatively* instead of
crashing when prerequisites are absent. It:

1. Honours `SKIP_E2E=1` (exit 0 with a clear "skipped" line).
2. Pre-flights the chromium binary under
   `$PLAYWRIGHT_BROWSERS_PATH` (or `~/.cache/ms-playwright`). If
   missing, exits 1 with the exact `npx playwright install
   chromium` command to run.
3. Strips `CI` from the spawned env so
   `playwright.config.ts::useWebServer` stays `false` and we don't
   collide with the dev server `scripts/check.mjs::prewarmDevServer`
   already booted on :5000.
4. Runs `playwright test --project=chromium --grep-invert
   "analytics events"`. The grep-invert can be disabled by setting
   `E2E_GATE_INCLUDE_ANALYTICS=1` (only useful when you started the
   dev server with `E2E_TEST_HOOKS=1` yourself).
5. Forwards any extra CLI args, so `npm run test:e2e:gate --
   tests/e2e/calculator-flow.spec.ts` works for triage.

Local one-liner to install the browser the gate needs (≈170 MB,
one-time):

```bash
cd exentax-web && \
  PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright \
  npx playwright install chromium
```

To opt out for a single `npm run check` run (e.g. while triaging an
unrelated failure):

```bash
SKIP_E2E=1 npm run check
```

## Running in CI

The GitHub Actions workflow `.github/workflows/e2e.yml` runs **two
job kinds** on every push and on every PR to `main`.

### `playwright` — runs the specs (one job per browser)

A `strategy.matrix` fans out the job across the seven browser projects
listed above. Each leg:

1. Installs deps via `npm ci`.
2. Installs the chromium / firefox / webkit engines with
   `npx playwright install --with-deps chromium firefox webkit` (one
   call covers the desktop projects + the mobile and tablet ones,
   which re-use the same three engines).
3. Runs `npx playwright test --project=${{ matrix.project }}`. Because
   `CI=1` is set, the Playwright config spins up `npm run dev` itself
   on port 5000 — no external service is required (every `/api/*` is
   stubbed with `page.route`).
4. Uploads the `playwright-report` HTML report as
   `playwright-report-<project>` (one artifact per browser, **14-day
   retention**) plus per-failure traces as
   `playwright-traces-<project>`.

`fail-fast: false` is set so all seven browsers always report — a
Safari regression should not hide a Firefox one.

#### Quarantining a flaky browser

When a project proves chronically flaky (per task 29 brief), flip its
`quarantined` flag in the matrix from `false` to `true`:

```yaml
- project: mobile-safari
  quarantined: true   # non-blocking until flake is fixed
```

`continue-on-error: ${{ matrix.quarantined }}` makes that leg
non-blocking so it stops gating merges. The spec still runs and still
uploads its HTML report, so the regression stays visible — it just
does not block the merge queue. Do **not** silently delete the project
from `playwright.config.ts`; quarantine is the visible alternative to
"disabled and forgotten".

### `prod-build-smoke` — validates the production bundle

Runs `SKIP_BUILD_E2E=1 npm run build` to verify the production server
bundle (esbuild) and client bundle (Vite) both compile cleanly against
the current source tree. The booking + newsletter E2E guards inside
the build script are skipped here because they are already exercised
end-to-end by `quality-pipeline.yml` (which provisions its own
Postgres). After the build, the job asserts that `dist/index.mjs`,
`dist/index.cjs` and `dist/public/assets/` all exist and are non-empty.

Mark every non-quarantined matrix leg
(`Playwright E2E (chromium|firefox|webkit|mobile-chrome|mobile-safari|tablet-ipad|tablet-android)`)
**and** `Production bundle smoke build` as required checks in branch
protection so merges block when any spec fails or the prod bundle
stops compiling.

## Conventions

- **No external services.** Every `/api/*` call is stubbed via
  `page.route` so the suite is hermetic. Do not introduce a spec that
  reaches the live database, Calendar, Gmail, OpenAI, etc. — those
  flows belong in the integration suite, not here.
- **Cookie banner suppression.** Each describe block calls
  `suppressCookieBanner(page)` (see `_setup.ts`) to pre-populate
  `localStorage["exentax_cookie_consent"]` so the banner does not
  intercept clicks on interactive elements.
- **Lazy mounts.** The `/start` calculator is mounted via
  `IntersectionObserver` on `[data-testid="calculator-mount"]`. Use
  `ensureCalculatorMounted(page)` from `calculator-flow.spec.ts`
  rather than re-implementing the scroll logic.
- **Skip flags.** `SKIP_E2E=1` and (for booking) `DB_REQUIRED=1` skip
  every test in this folder. CI never sets either; they exist so
  downstream `npm run test` callers can opt out.

## Troubleshooting

- *"Element intercepts pointer events"* — the cookie banner
  re-appeared. Make sure your describe has the
  `suppressCookieBanner` `beforeEach` hook.
- *"waiting for getByTestId('calculator')"* — the
  `IntersectionObserver` did not fire. Verify your test calls
  `ensureCalculatorMounted` before interacting with calculator inputs.
- *"port 5000 already in use" in CI* — should not happen because
  Playwright owns the lifecycle when `CI=1`. Locally the inverse
  applies: do not unset `CI=1` or it will try to start a second
  server on top of the running workflow.
- *Browser-specific failure (Firefox / WebKit / mobile only)* —
  download the per-browser artifact (`playwright-report-firefox`,
  `playwright-traces-mobile-safari`, …) from the failed run, then
  reproduce locally with `npx playwright test --project=<name>`. If
  the failure is environmental (e.g. flaky on CI mobile-safari
  emulation only), quarantine the project as documented above
  rather than disabling it silently.
