import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 5000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// In CI we let Playwright spin up the dev server itself (no human
// already has a workflow open). Locally we assume `npm run dev` is
// already running on PORT (the Replit "Start application" workflow),
// so we skip `webServer` to avoid port collisions.
const useWebServer = !!process.env.CI;

// `npm run test:e2e` (and CI) runs the three blocking specs in
// `tests/e2e/`: booking, calculator, language switch. Any new
// Playwright spec must live under `tests/e2e/` to be picked up by
// the `testMatch` below.
//
// Browser projects: the suite runs on the seven surfaces our real users
// reach (PENDING.md §14, tasks 29 + 39). Locally `npm run test:e2e`
// defaults to `--project=chromium` for fast iteration; in CI the
// `.github/workflows/e2e.yml` matrix runs each project in parallel and
// uploads a per-browser HTML report.
//
//   - chromium       — desktop Chrome / Edge / Brave
//   - firefox        — desktop Firefox
//   - webkit         — desktop Safari (macOS)
//   - mobile-chrome  — Pixel 7 emulation (Android Chrome)
//   - mobile-safari  — iPhone 14 emulation (iOS Safari)
//   - tablet-ipad    — iPad (gen 11) emulation (iPadOS Safari, WebKit)
//   - tablet-android — Galaxy Tab S4 emulation (Android Chrome, Chromium)
//
// The two tablet projects (task 39) cover the intermediate viewports
// where we have shipped layout regressions before (e.g. CTA stacking on
// /agendar). Both start with `quarantined: false` in the CI matrix; flip
// to `true` if they prove flaky rather than deleting them.
//
// To quarantine a chronically flaky project (per task 29 brief), keep
// it in the `projects` array here so it still runs, and flip its
// matrix entry in `.github/workflows/e2e.yml` to `quarantined: true`
// so the job becomes non-blocking. Do NOT silently delete it.
export default defineConfig({
  testDir: ".",
  testMatch: ["tests/e2e/*.spec.ts"],
  testIgnore: ["**/node_modules/**", "**/dist/**"],
  timeout: 60_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "tablet-ipad",
      use: { ...devices["iPad (gen 11)"] },
    },
    {
      name: "tablet-android",
      use: { ...devices["Galaxy Tab S4"] },
    },
  ],
  ...(useWebServer
    ? {
        webServer: {
          command: "npm run dev",
          port: PORT,
          reuseExistingServer: false,
          timeout: 120_000,
          env: {
            NODE_ENV: "development",
            // Task #38 — opt the dev server into the analytics test
            // hook so `tests/e2e/analytics-events.spec.ts` can verify
            // that `whatsapp_click`, `calculator_used`,
            // `booking_completed`, `newsletter_subscribe`,
            // `language_switch`, etc. land in `window.dataLayer`.
            // Without this, `Tracking.tsx::hasAnalyticsConsent()`
            // short-circuits to false on the dev server. The flag is
            // OFF by default in real production (real deploys do not
            // set `E2E_TEST_HOOKS`).
            E2E_TEST_HOOKS: "1",
          },
        },
      }
    : {}),
});
