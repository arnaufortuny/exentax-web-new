import { test, expect, type Page } from "@playwright/test";

/**
 * Booking happy-path E2E.
 *
 * The real booking flow on `/es/agendar` walks the user through three
 * qualification steps (`step-negocio`, `step-situacion`, `step-compromiso`)
 * and then mounts `<BookingCalendar>` which loads blocked days and
 * available slots from `/api/bookings/*`. Hitting those endpoints in CI
 * requires a populated DB and live calendar data, so this test stubs
 * them with `page.route` and asserts the success UI is shown.
 *
 * Skip this spec when:
 *   - SKIP_E2E=1 (caller wants `npm run test` to be fast / no browsers)
 *   - DB_REQUIRED=1 (caller is running an integration suite, not e2e)
 *
 * Run with:
 *   PLAYWRIGHT_BASE_URL=http://localhost:5000 \
 *     npx playwright test tests/e2e/booking-flow.spec.ts --project=chromium
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1" || process.env.DB_REQUIRED === "1";

// Pick a date 14 days out, in Europe/Madrid local time, and avoid weekends.
function futureWeekdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  // Bump forward off Saturday/Sunday.
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function stubBookingApis(page: Page, futureDate: string) {
  await page.route("**/api/bookings/blocked-days", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route("**/api/bookings/available-slots**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: futureDate,
        slots: ["10:00", "11:00", "12:00", "16:00"],
        blocked: false,
      }),
    });
  });

  await page.route("**/api/bookings/book", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: futureDate,
        startTime: "10:00",
        endTime: "10:30",
        meetLink: "https://meet.google.com/abc-defg-hij",
        meetingType: "google_meet",
        status: "confirmed",
      }),
    });
  });
}

test.describe("booking flow (happy path)", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test("ES /agendar reaches success state after stubbed POST", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    await stubBookingApis(page, futureDate);

    await page.goto("/es/agendar");

    // Step 1 (qualification): activity + invoicing.
    await expect(page.getByTestId("step-negocio")).toBeVisible();
    await page.getByTestId("select-actividad").selectOption({ index: 1 });
    await page.getByTestId("select-facturacion").selectOption({ index: 1 });
    await page.getByTestId("button-next").click();

    // Step 2: situation, beneficio, intl/digital/compromiso.
    await expect(page.getByTestId("step-situacion")).toBeVisible();
    await page.getByTestId("card-situacion-0").click();
    await page.getByTestId("input-beneficio-neto").fill("4000");
    await page.getByTestId("card-intl-yes").click();
    await page.getByTestId("card-digital-yes").click();
    await page.getByTestId("card-compromiso-yes").click();
    await page.getByTestId("button-next").click();

    // Step 3: investment + start.
    await expect(page.getByTestId("step-compromiso")).toBeVisible();
    await page.getByTestId("card-inversion-0").click();
    await page.getByTestId("card-inicio-0").click();
    await page.getByTestId("button-next").click();

    // Calendar appears.
    await expect(page.getByTestId("booking-calendar")).toBeVisible({ timeout: 15_000 });

    // BookingCalendar internally re-asks for qualification (beneficio mensual,
    // clientes mundiales, opera digital, compromiso) before showing the
    // calendar grid. Fill it.
    await page.getByTestId("select-beneficio").selectOption({ index: 1 });
    await page.getByTestId("button-clientes-mundiales-si").click();
    await page.getByTestId("button-opera-digital-si").click();
    await page.getByTestId("button-compromiso-si").click();
    await page.getByTestId("button-qualify-next").click();

    // Pick a future weekday. Days are rendered with `data-testid="day-N"`.
    // We just click the first non-disabled day available; this is robust
    // even if the visible month differs from `futureDate`.
    const dayBtn = page.locator('[data-testid^="day-"]:not([disabled])').first();
    await dayBtn.click();

    // Pick a slot (the stub returns "10:00" → testid `slot-1000`).
    await page.getByTestId("slot-1000").click();

    // Pick meeting type.
    await page.getByTestId("button-meeting-type-meet").click();

    // Fill personal info.
    await page.getByTestId("input-name").fill("Ana");
    await page.getByTestId("input-lastName").fill("García");
    await page.getByTestId("input-email").fill("ana.garcia+e2e@example.com");
    await page.getByTestId("input-phone").fill("612345678");

    // Privacy is a hidden checkbox styled as a label; click the label.
    await page.getByTestId("checkbox-privacy").check({ force: true });

    await page.getByTestId("button-confirm-booking").click();

    // Assert success state.
    await expect(page.getByTestId("booking-success")).toBeVisible({ timeout: 15_000 });
  });

  test("EN /book renders the same booking flow with i18n", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    await stubBookingApis(page, futureDate);

    await page.goto("/en/book");

    // Same first step is mounted; just verify the qualification UI is
    // present and that the page is in English (the next button label
    // changes per locale).
    await expect(page.getByTestId("step-negocio")).toBeVisible();
    await expect(page.getByTestId("button-next")).toBeVisible();

    // i18n consistency: <html lang> must match the URL locale.
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBe("en");
  });
});
