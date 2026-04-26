# Playwright E2E suite

This folder holds the **three blocking** end-to-end specs that gate
merges to `main` (PENDING.md §14):

| Spec | What it covers |
| --- | --- |
| `booking-flow.spec.ts` | `/agendar` → qualification → calendar → date → slot → meeting type → form → success (ES + EN), plus `/booking/:token` reschedule + cancel happy paths. The success-path test captures the `POST /api/bookings/book` payload and asserts every field the server-side `sendBookingConfirmation` template needs (`name`, `lastName`, `email`, `phone` E.164, `meetingType`, `date`, `startTime`, `privacyAccepted`) — a CI-safe equivalent of "the confirmation email was dispatched with the right data" without bringing up Gmail. |
| `calculator-flow.spec.ts` | `/start` calculator (lazy-mounted) emits a branded `/api/calculator-leads` POST whose payload is asserted (email, phone, country, regime, activity, privacy, savings, effective rate, language, …). The captured payload is then forwarded to the test-only endpoint `POST /api/__test/render-calculator-email` (gated on `NODE_ENV !== "production" \|\| E2E_TEST_HOOKS=1` + `x-e2e-test: 1` header), which invokes the real `renderCalculatorEmailHtml` and returns the actual customer-facing HTML. The spec asserts `<!DOCTYPE`, brand color (`00E510`), the savings figure (with locale-tolerant thousands separators), the email's local-part, and `lang ∈ {es,en,fr,de,pt,ca}`. Also verifies `country=reino-unido` hides the CCAA selector. |
| `language-switch.spec.ts` | The 5 non-Spanish locales (en/fr/de/pt/ca) each receive a switch from `/es/blog/cuanto-cuesta-constituir-llc`, persist via `localStorage["exentax_lang"]`, expose a matching `<link rel="alternate" hreflang>` (BCP-47), and survive a full reload. |

Other Playwright specs in `exentax-web/tests/` (`ga4-events.spec.ts`,
`blog-test.spec.ts`, …) live alongside this folder for ad-hoc / future
use. They are excluded from `npm run test:e2e` via the `testMatch` in
`playwright.config.ts` so a regression in them never blocks merges.

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

If chromium is missing:

```bash
PLAYWRIGHT_BROWSERS_PATH=/home/runner/workspace/.cache/ms-playwright \
  npx playwright install chromium
```

To open the HTML report after a run:

```bash
npx playwright show-report
```

## Running in CI

The GitHub Actions workflow `.github/workflows/e2e.yml` runs **two
required jobs** on every push and on every PR to `main`.

### `playwright` — runs the specs

1. Installs deps via `npm ci`.
2. Installs chromium with `npx playwright install --with-deps chromium`.
3. Runs `npm run test:e2e`. Because `CI=1` is set, the Playwright
   config spins up `npm run dev` itself on port 5000 — no external
   service is required (every `/api/*` is stubbed with `page.route`).
4. Uploads the `playwright-report` HTML report as an artifact with
   **14-day retention**, plus per-failure traces.

### `prod-build-smoke` — validates the production bundle

Runs `SKIP_BUILD_E2E=1 npm run build` to verify the production server
bundle (esbuild) and client bundle (Vite) both compile cleanly against
the current source tree. The booking + newsletter E2E guards inside
the build script are skipped here because they are already exercised
end-to-end by `quality-pipeline.yml` (which provisions its own
Postgres). After the build, the job asserts that `dist/index.mjs`,
`dist/index.cjs` and `dist/public/assets/` all exist and are non-empty.

Mark **both** `Playwright E2E (chromium)` and `Production bundle smoke
build` as required checks in branch protection to enforce that merges
block when any spec fails or the prod bundle stops compiling.

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
