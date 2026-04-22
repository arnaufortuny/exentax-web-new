import { test, expect, type Page } from "@playwright/test";

const STORAGE_KEY = "exentax_cookie_consent";

type DLEvent = { name: string; params: Record<string, unknown> };

async function readDataLayerEvents(page: Page): Promise<DLEvent[]> {
  return page.evaluate(() => {
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
    const events: DLEvent[] = [];
    for (const item of dl) {
      if (!item) continue;
      const arr = Array.from(item as ArrayLike<unknown>);
      if (arr[0] === "event" && typeof arr[1] === "string") {
        events.push({
          name: arr[1] as string,
          params: (arr[2] as Record<string, unknown>) || {},
        });
      }
    }
    return events;
  });
}

async function findEvent(page: Page, name: string, attempts = 30): Promise<DLEvent | null> {
  for (let i = 0; i < attempts; i++) {
    const events = await readDataLayerEvents(page);
    const found = events.find((e) => e.name === name);
    if (found) return found;
    await page.waitForTimeout(150);
  }
  return null;
}

async function grantConsent(page: Page) {
  await page.addInitScript((key) => {
    try {
      localStorage.setItem(key, "all");
    } catch {
      /* noop */
    }
    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    if (!w.gtag) {
      w.gtag = function gtagStub() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
    }
  }, STORAGE_KEY);
}

async function mockBookingApis(page: Page) {
  await page.route("**/api/bookings/blocked-days", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });
  await page.route("**/api/bookings/available-slots*", async (route) => {
    const url = new URL(route.request().url());
    const date = url.searchParams.get("date") || "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date,
        slots: ["10:00", "11:00", "12:00"],
        blocked: false,
      }),
    });
  });
  await page.route("**/api/bookings/book", async (route) => {
    const req = route.request().postDataJSON() as { date?: string; startTime?: string };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: req?.date || "2099-01-01",
        startTime: req?.startTime || "10:00",
        endTime: "10:30",
        meetLink: null,
        status: "confirmed",
      }),
    });
  });
  await page.route("**/api/visitor", (route) => route.fulfill({ status: 204, body: "" }));
  await page.route("**/api/calculator-leads", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
  );
}

test.describe("GA4 standardized events", () => {
  test.beforeEach(async ({ page }) => {
    await grantConsent(page);
    await mockBookingApis(page);
  });

  test("whatsapp_click fires when clicking the floating WhatsApp button", async ({ page }) => {
    await page.goto("/es");
    const wa = page.getByTestId("button-floating-whatsapp");
    await wa.waitFor({ state: "visible" });
    await wa.evaluate((el) =>
      el.addEventListener("click", (e) => e.preventDefault(), { capture: true })
    );
    await wa.click({ force: true });
    const ev = await findEvent(page, "whatsapp_click");
    expect(ev, "whatsapp_click should be pushed to dataLayer").not.toBeNull();
    expect(ev!.params.cta_location).toBe("floating");
  });

  test("calculator_used fires after submitting the calculator", async ({ page }) => {
    await page.goto("/start");

    const country = page.getByTestId("button-country-espana");
    await country.scrollIntoViewIfNeeded();
    await country.click();

    await page.getByTestId("select-regime").selectOption("autonomo");

    const incomeInput = page.getByTestId("text-income-value");
    await incomeInput.click();
    await incomeInput.fill("3000");
    await incomeInput.blur();

    await page.getByTestId("input-email-gate").fill("test@example.com");
    await page.getByTestId("input-phone-gate").fill("612345678");
    await page.getByTestId("checkbox-privacy").check({ force: true });

    await page.getByTestId("button-submit-email").click();

    const ev = await findEvent(page, "calculator_used");
    expect(ev, "calculator_used should be pushed to dataLayer").not.toBeNull();
    expect(ev!.params.country).toBe("espana");
    expect(ev!.params.regime).toBe("autonomo");
  });

  test("booking_completed fires after a successful booking", async ({ page }) => {
    await page.goto("/es/agendar");

    await page.getByTestId("select-beneficio").waitFor({ state: "visible" });
    await page.getByTestId("select-beneficio").selectOption({ index: 2 });
    await page.getByTestId("button-clientes-mundiales-si").click();
    await page.getByTestId("button-opera-digital-si").click();
    await page.getByTestId("button-compromiso-si").click();
    await page.getByTestId("button-qualify-next").click();

    const dayBtn = page
      .locator('[data-testid^="day-"]:not([disabled])')
      .first();
    let attempts = 0;
    while ((await dayBtn.count()) === 0 && attempts < 6) {
      await page.getByTestId("button-next-month").click();
      attempts++;
    }
    await dayBtn.waitFor({ state: "visible", timeout: 10_000 });
    await dayBtn.click();

    const slotBtn = page.locator('[data-testid^="slot-"]').first();
    await slotBtn.waitFor({ state: "visible", timeout: 10_000 });
    await slotBtn.click();

    await page.getByTestId("input-name").fill("Test");
    await page.getByTestId("input-lastName").fill("User");
    await page.getByTestId("input-email").fill("test@example.com");
    await page.getByTestId("input-phone").fill("612345678");
    await page.getByTestId("checkbox-privacy").check({ force: true });

    await page.getByTestId("button-confirm-booking").click();

    const ev = await findEvent(page, "booking_completed", 60);
    expect(ev, "booking_completed should be pushed to dataLayer").not.toBeNull();
    expect(ev!.params.form_name).toBe("booking");
  });
});
