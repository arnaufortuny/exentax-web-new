import { test, expect, type Page } from "@playwright/test";

/**
 * Calculator E2E.
 *
 * The calculator widget (<Calculator>) is mounted on `/start` (a
 * calculator-only landing) and on the home `/es` Hero in `compact` mode.
 * The repo has no `/es/calculadora` route — task spec told us to "check
 * client/src/pages/" — so we use `/start` because it renders the full
 * calculator (non-compact) and exposes every test-id we need
 * (`select-ccaa-profile` only renders when country = "espana").
 *
 * We stub `POST /api/calculator-leads` so the test never hits Postgres.
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1" || process.env.DB_REQUIRED === "1";

async function stubCalculatorLead(page: Page) {
  await page.route("**/api/calculator-leads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, id: "stub-lead-id" }),
    });
  });
}

test.describe("calculator flow", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test("España + autónomo + digitalServices + CCAA=high renders results", async ({ page }) => {
    await stubCalculatorLead(page);
    await page.goto("/start");

    // Calculator is lazy-mounted on view (IntersectionObserver). Scroll
    // down so it intersects.
    await page.locator('[data-testid="calculator"]').scrollIntoViewIfNeeded();

    await expect(page.getByTestId("calculator")).toBeVisible({ timeout: 15_000 });

    // Country: España.
    await page.getByTestId("button-country-espana").click();

    // Regime: autónomo.
    await page.getByTestId("select-regime").selectOption("autonomo");

    // Activity: digitalServices.
    await page.getByTestId("select-activity").selectOption("digitalServices");

    // CCAA: high (Cataluña/Valencia/Asturias).
    await expect(page.getByTestId("select-ccaa-profile")).toBeVisible();
    await page.getByTestId("select-ccaa-profile").selectOption("high");

    // Income input — switch to monthly (default already monthly), then
    // type 5000. Use the visible numeric text input.
    const incomeInput = page.getByTestId("text-income-value");
    await incomeInput.click();
    await incomeInput.fill("5000");
    await incomeInput.blur();

    // Email gate: fill email, accept privacy, submit.
    await expect(page.getByTestId("form-email-gate")).toBeVisible({ timeout: 10_000 });
    await page.getByTestId("input-email-gate").fill("user+e2e@example.com");
    await page.getByTestId("checkbox-privacy").check({ force: true });
    await page.getByTestId("button-submit-email").click();

    // Results panel must appear.
    await expect(page.getByTestId("calculator-results")).toBeVisible({ timeout: 15_000 });

    // Currency formatting sanity: text-ahorro should contain a number
    // followed by a currency symbol or code (€, EUR, US$, etc).
    const ahorro = await page.getByTestId("text-ahorro").textContent();
    expect(ahorro, "savings number rendered").toBeTruthy();
    expect(ahorro!).toMatch(/[€$£]|EUR|USD|GBP/);
  });

  test("country=reino-unido hides the CCAA selector", async ({ page }) => {
    await stubCalculatorLead(page);
    await page.goto("/start");

    await page.locator('[data-testid="calculator"]').scrollIntoViewIfNeeded();
    await expect(page.getByTestId("calculator")).toBeVisible({ timeout: 15_000 });

    await page.getByTestId("button-country-reino-unido").click();

    // CCAA only renders when country === "espana".
    await expect(page.getByTestId("select-ccaa-profile")).toHaveCount(0);
  });
});
