import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 5000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: ".",
  testMatch: ["tests/**/*.spec.ts", "blog-test.spec.ts"],
  testIgnore: ["**/node_modules/**", "**/dist/**"],
  timeout: 60_000,
  reporter: [["list"]],
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
});
