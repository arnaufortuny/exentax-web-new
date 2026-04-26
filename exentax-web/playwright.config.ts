import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 5000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// In CI we let Playwright spin up the dev server itself (no human
// already has a workflow open). Locally we assume `npm run dev` is
// already running on PORT (the Replit "Start application" workflow),
// so we skip `webServer` to avoid port collisions.
const useWebServer = !!process.env.CI;

// `npm run test:e2e` (and CI) only runs the three blocking specs in
// `tests/e2e/`: booking, calculator, language switch. Other Playwright
// specs (`tests/ga4-events.spec.ts`, `blog-test.spec.ts`) live in the
// repo for ad-hoc / future use and are NOT executed here so a regression
// in them never blocks merges. Run them manually if needed.
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
          },
        },
      }
    : {}),
});
