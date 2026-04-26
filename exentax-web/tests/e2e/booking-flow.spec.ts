import { test, expect, type Page } from "@playwright/test";
import { suppressCookieBanner } from "./_setup";

/**
 * Booking E2E (PENDING.md §14).
 *
 * Covers:
 *   1. Happy path on `/es/agendar` — qualification (3 steps) → calendar
 *      → date → slot → meeting type → form → success.
 *   2. EN locale renders the same flow with `<html lang="en">`.
 *   3. Reschedule + cancel on the public manage screen
 *      `/booking/:token` (the page rendered by the link sent in the
 *      confirmation email — the same screen real customers use).
 *
 * All `/api/*` calls are stubbed with `page.route` so the spec is
 * self-contained: it does NOT need Postgres, Calendar, Gmail or any
 * external dep. That keeps it stable in CI even if a downstream
 * service flakes.
 *
 * Skip with:
 *   - SKIP_E2E=1     (caller wants `npm run test` to be fast / no browsers)
 *   - DB_REQUIRED=1  (caller is running an integration suite, not e2e)
 *
 * Run locally:
 *   PLAYWRIGHT_BASE_URL=http://localhost:5000 \
 *     npx playwright test tests/e2e/booking-flow.spec.ts --project=chromium
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1" || process.env.DB_REQUIRED === "1";

// Pick a date 14 days out, in UTC, and avoid weekends.
function futureWeekdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

interface BookCapture {
  payload: Record<string, unknown> | null;
}

async function stubBookingApis(page: Page, futureDate: string, capture?: BookCapture) {
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

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  test("ES /agendar reaches success state after stubbed POST", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    const capture: BookCapture = { payload: null };
    await stubBookingApis(page, futureDate, capture);

    await page.goto("/es/agendar");

    // Step 1 (qualification on /agendar): activity + invoicing.
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

    // BookingCalendar mounts. /agendar passes the qualification answers
    // as `prefilled*` props, so `hasPrefilledQualify` is true and the
    // calendar opens directly on `step="date"` (no in-calendar quiz).
    await expect(page.getByTestId("booking-calendar")).toBeVisible({ timeout: 15_000 });

    // Pick the first non-disabled day. Disabled days (weekends, past,
    // blocked) carry the [disabled] attribute on the <button>.
    await page.locator('[data-testid^="day-"]:not([disabled])').first().click();

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
    // The privacy checkbox is `sr-only` and React-controlled. Use
    // click+toBeChecked rather than `.check()` to avoid the React
    // state-update race that occasionally flakes Playwright's
    // built-in attribute assertion (see calculator-flow.spec.ts).
    const privacyCheckbox = page.getByTestId("checkbox-privacy");
    await privacyCheckbox.click({ force: true });
    await expect(privacyCheckbox).toBeChecked({ timeout: 5_000 });

    await page.getByTestId("button-confirm-booking").click();

    // Assert success state.
    await expect(page.getByTestId("booking-success")).toBeVisible({ timeout: 15_000 });

    // Email-confirmation behavior: the booking POST must carry every
    // field the server-side `sendBookingConfirmation` template needs
    // (see `server/email.ts`). Without these the confirmation email
    // would render with empty placeholders. Asserting the payload here
    // gives us a CI-safe equivalent of "the confirmation email was
    // dispatched with the right data" without requiring Gmail in CI.
    expect(capture.payload, "POST /api/bookings/book payload captured").not.toBeNull();
    const bookPayload = capture.payload as Record<string, unknown>;
    expect(bookPayload.name).toBe("Ana");
    expect(bookPayload.lastName).toBe("García");
    expect(bookPayload.email).toBe("ana.garcia+e2e@example.com");
    // The phone field is normalized to E.164 by the form before POST
    // (e.g. "612345678" → "+34 612345678"), so we assert the trailing
    // digits match instead of the raw input.
    expect(typeof bookPayload.phone).toBe("string");
    expect((bookPayload.phone as string).replace(/\D/g, "")).toContain("612345678");
    expect(bookPayload.privacyAccepted).toBe(true);
    expect(typeof bookPayload.date).toBe("string");
    expect(typeof bookPayload.startTime).toBe("string");
    expect(bookPayload.meetingType).toBe("google_meet");
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

/**
 * PENDING.md §14 sub-step: reschedule + cancel.
 *
 * The customer-facing manage screen is `/booking/:token` (rendered by
 * `client/src/pages/booking.tsx`). It is the page reached from the
 * "Reagendar" / "Cancelar" buttons in the confirmation email.
 *
 * We stub:
 *   - GET  /api/booking/:id              → returns a confirmed future booking
 *   - GET  /api/bookings/available-slots → returns 3 slots for any date
 *   - POST /api/booking/:id/reschedule   → success
 *   - POST /api/booking/:id/cancel       → success
 *
 * No DB / Calendar / Gmail involvement, so this stays self-contained
 * and is safe to wire as a required CI check.
 */
test.describe("booking manage (reschedule + cancel)", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  const BOOKING_ID = "bk-stub-e2e-1";

  // Pick a manage-screen date 21 days out so it is never `isPast`.
  function farFutureWeekday(): string {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().slice(0, 10);
  }

  async function stubManageApis(
    page: Page,
    overrides: { rescheduledOnce?: boolean } = {},
  ) {
    const bookingDate = farFutureWeekday();

    let cancelled = false;
    let rescheduled = false;

    await page.route(`**/api/booking/${BOOKING_ID}**`, async (route) => {
      const url = new URL(route.request().url());
      const path = url.pathname;

      // POST /reschedule
      if (path.endsWith("/reschedule") && route.request().method() === "POST") {
        rescheduled = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              date: bookingDate,
              startTime: "11:00",
              endTime: "11:30",
              status: "rescheduled",
            },
          }),
        });
        return;
      }

      // POST /cancel
      if (path.endsWith("/cancel") && route.request().method() === "POST") {
        cancelled = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { status: "cancelled" } }),
        });
        return;
      }

      // GET /api/booking/:id  — react-query refetches after mutate.
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: BOOKING_ID,
            name: "Ana García",
            date: bookingDate,
            startTime: rescheduled ? "11:00" : "10:00",
            endTime: rescheduled ? "11:30" : "10:30",
            googleMeet: "https://meet.google.com/stub-meet-link",
            meetingType: "google_meet",
            phone: null,
            status: cancelled ? "cancelled" : (overrides.rescheduledOnce && rescheduled ? "rescheduled" : "confirmed"),
            isPast: false,
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.route("**/api/bookings/available-slots**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          date: bookingDate,
          slots: ["10:00", "11:00", "12:00"],
          blocked: false,
        }),
      });
    });

    return { bookingDate };
  }

  test("reschedule confirms and lands on rescheduled-success", async ({ page }) => {
    const { bookingDate } = await stubManageApis(page, { rescheduledOnce: true });

    await page.goto(`/booking/${BOOKING_ID}?token=stub-token-xyz`);

    // Manage screen loaded with confirmed booking.
    await expect(page.getByTestId("text-client-name")).toHaveText("Ana García");
    await expect(page.getByTestId("button-reschedule")).toBeVisible();

    // Open reschedule view.
    await page.getByTestId("button-reschedule").click();

    // Pick a date (the form ships an HTML5 <input type="date">).
    await page.getByTestId("input-reschedule-date").fill(bookingDate);

    // Pick a slot. Stub returns 11:00 → testid `button-slot-11:00`.
    await page.getByTestId("button-slot-11:00").click();

    await page.getByTestId("button-confirm-reschedule").click();

    // Success state.
    await expect(page.getByText(/reagend|reschedul|reprogram/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("cancel confirms and lands on cancelled-success", async ({ page }) => {
    await stubManageApis(page);

    await page.goto(`/booking/${BOOKING_ID}?token=stub-token-xyz`);

    await expect(page.getByTestId("button-cancel-booking")).toBeVisible();
    await page.getByTestId("button-cancel-booking").click();

    // Confirm step.
    await expect(page.getByTestId("button-confirm-cancel")).toBeVisible();
    await page.getByTestId("button-confirm-cancel").click();

    // After cancel, the page shows the "book another" CTA.
    await expect(page.getByTestId("link-new-booking")).toBeVisible({ timeout: 10_000 });
  });
});
