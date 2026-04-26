import { test, expect, type Page, type Request } from "@playwright/test";
import { suppressCookieBanner } from "./_setup";

/**
 * Calculator E2E (PENDING.md §14).
 *
 * The calculator widget (`<Calculator>`) is mounted on `/start` (a
 * calculator-only landing) and on the home `/es` Hero in `compact`
 * mode. We use `/start` because it renders the full (non-compact)
 * widget and exposes every test-id we need (`select-ccaa-profile`
 * only renders when country = "espana").
 *
 * Coverage:
 *   1. `España + autónomo + digitalServices` flow that finishes on
 *      `<calculator-results>` with a non-empty `text-ahorro`.
 *   2. Country=reino-unido hides the CCAA selector.
 *   3. `POST /api/calculator-leads` is intercepted and asserted: it
 *      must carry the email + the `LLC vs autónomo` payload that the
 *      branded HTML email needs (transport itself is stubbed because
 *      Gmail is not available in CI).
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1" || process.env.DB_REQUIRED === "1";

interface LeadCapture {
  payload: Record<string, unknown> | null;
}

async function stubCalculatorLead(page: Page, capture?: LeadCapture) {
  await page.route("**/api/calculator-leads", async (route) => {
    if (capture) {
      try {
        capture.payload = route.request().postDataJSON();
      } catch {
        capture.payload = null;
      }
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, id: "stub-lead-id" }),
    });
  });
}

/**
 * The calculator on `/start` is lazy-mounted via an IntersectionObserver
 * watching `[data-testid="calculator-mount"]`. We scroll the mount
 * point into view explicitly (instead of scrolling to the page bottom)
 * because the bottom-of-page approach is racy in headless Chromium —
 * the mount node may not exist yet when scroll fires.
 */
async function ensureCalculatorMounted(page: Page) {
  await page.locator('[data-testid="calculator-mount"]').waitFor({ state: "attached", timeout: 15_000 });
  await page.locator('[data-testid="calculator-mount"]').scrollIntoViewIfNeeded();
  await expect(page.getByTestId("calculator")).toBeVisible({ timeout: 15_000 });
}

test.describe("calculator flow", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  test("España + autónomo + digitalServices + CCAA=high renders results and posts lead", async ({ page }) => {
    const capture: LeadCapture = { payload: null };
    await stubCalculatorLead(page, capture);

    await page.goto("/start");
    await ensureCalculatorMounted(page);

    // Country: España.
    await page.getByTestId("button-country-espana").click();

    // Regime: autónomo.
    await page.getByTestId("select-regime").selectOption("autonomo");

    // Activity: digitalServices.
    await page.getByTestId("select-activity").selectOption("digitalServices");

    // CCAA: high (Cataluña/Valencia/Asturias).
    await expect(page.getByTestId("select-ccaa-profile")).toBeVisible();
    await page.getByTestId("select-ccaa-profile").selectOption("high");

    // Income: 5000 monthly (default mode is monthly).
    const incomeInput = page.getByTestId("text-income-value");
    await incomeInput.click();
    await incomeInput.fill("5000");
    await incomeInput.blur();

    // Email gate: fill email + phone, accept privacy, wait for the
    // POST (so we can assert its payload), then submit. The phone is
    // mandatory — `validate()` requires 7-15 digits before firing
    // `/api/calculator-leads`.
    await expect(page.getByTestId("form-email-gate")).toBeVisible({ timeout: 10_000 });
    await page.getByTestId("input-email-gate").fill("user+e2e@example.com");
    await page.getByTestId("input-phone-gate").fill("612345678");
    // The privacy checkbox is `sr-only` and controlled via React state.
    // Use `.click({ force: true })` (rather than `.check()`) and then
    // explicitly wait for the next render to reflect the new state, so
    // the state-update race that occasionally surfaces with `.check()`
    // (Playwright asserting the checked attribute before React commits)
    // cannot flake the run.
    const privacyCheckbox = page.getByTestId("checkbox-privacy");
    await privacyCheckbox.click({ force: true });
    await expect(privacyCheckbox).toBeChecked({ timeout: 5_000 });

    const leadRequestPromise: Promise<Request> = page.waitForRequest(
      (req) => req.url().includes("/api/calculator-leads") && req.method() === "POST",
      { timeout: 15_000 },
    );

    await page.getByTestId("button-submit-email").click();

    const leadRequest = await leadRequestPromise;
    expect(leadRequest, "POST /api/calculator-leads fired").toBeTruthy();

    // Results panel must appear.
    await expect(page.getByTestId("calculator-results")).toBeVisible({ timeout: 15_000 });

    // Currency formatting sanity: text-ahorro should contain a number
    // followed by a currency symbol or code (€, EUR, US$, etc).
    const ahorro = await page.getByTestId("text-ahorro").textContent();
    expect(ahorro, "savings number rendered").toBeTruthy();
    expect(ahorro!).toMatch(/[€$£]|EUR|USD|GBP/);

    // The branded HTML email pipeline reads these fields off the lead
    // payload (see server/email.ts → sendCalculatorEmail). Assert they
    // are present and well-formed; we are NOT asserting on Gmail
    // delivery (that is gated on GOOGLE_SERVICE_ACCOUNT_KEY which is
    // intentionally absent in CI).
    expect(capture.payload, "lead payload captured").not.toBeNull();
    const payload = capture.payload as Record<string, unknown>;
    expect(payload.email).toBe("user+e2e@example.com");
    expect(payload.country).toBe("espana");
    expect(payload.regime).toBe("autonomo");
    expect(payload.activity).toBe("digitalServices");
    expect(payload.privacyAccepted).toBe(true);
    expect(typeof payload.ahorro).toBe("number");
    expect(typeof payload.effectiveRate).toBe("number");
    expect(typeof payload.language).toBe("string");

    // Branded HTML assertion: feed the captured payload into the
    // server-side render endpoint and assert key brand markers are
    // present. This proves the payload contract is sufficient to
    // produce the actual customer-facing email — not just persisted.
    const renderResp = await page.request.post("/api/__test/render-calculator-email", {
      headers: { "x-e2e-test": "1" },
      data: payload,
    });
    expect(renderResp.status(), "render endpoint reachable").toBe(200);
    const rendered = (await renderResp.json()) as { html: string; subject: string; lang: string };
    // The render endpoint must echo a supported lang. We do not pin the
    // value to "es" because /start (no locale prefix) falls back to the
    // browser's preferred language, which in CI defaults to "en".
    expect(["es", "en", "fr", "de", "pt", "ca"]).toContain(rendered.lang);
    // Subject should be a non-empty branded line.
    expect(rendered.subject.length).toBeGreaterThan(5);
    // The branded HTML must include the savings figure, the CTA-style
    // brand neon color (#00E510 / its dark variant), an email-client
    // safe DOCTYPE wrapper, and the lead's email or first-name token.
    expect(rendered.html).toContain("<!DOCTYPE");
    expect(rendered.html).toMatch(/00E510|#0(D|E|d|e)5/);
    // savings number — the currency formatter inserts thousands
    // separators (",", "." or non-breaking spaces depending on locale),
    // so we assert each digit group appears with optional separators
    // between them rather than the raw integer string.
    const ahorroInt = Math.round(payload.ahorro as number);
    const digits = String(ahorroInt).split("");
    const sep = "[\\s,\\.\u00a0\u202f]?";
    const ahorroRe = new RegExp(digits.join(sep));
    expect(rendered.html).toMatch(ahorroRe);
    // greeting is built from the local-part of the email address.
    expect(rendered.html.toLowerCase()).toContain("user+e2e");
  });

  test("country=reino-unido hides the CCAA selector", async ({ page }) => {
    await stubCalculatorLead(page);
    await page.goto("/start");
    await ensureCalculatorMounted(page);

    await page.getByTestId("button-country-reino-unido").click();

    // CCAA only renders when country === "espana".
    await expect(page.getByTestId("select-ccaa-profile")).toHaveCount(0);
  });
});
