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

/**
 * The negative-path tests need to swap how `POST /api/bookings/book`
 * responds while keeping the calendar/slots stubs identical to the
 * happy path. We expose a mutable handler so each test can reassign
 * the response (409 / 422 / 500 / abort / 200) without re-routing.
 */
type BookHandler = (
  request: { postDataJSON: () => unknown },
  helpers: {
    fulfill: (init: { status: number; body?: string }) => Promise<void>;
    abort: () => Promise<void>;
    successBody: () => string;
  },
) => Promise<void>;

const SUCCESS_BOOK_BODY = (futureDate: string) =>
  JSON.stringify({
    date: futureDate,
    startTime: "10:00",
    endTime: "10:30",
    meetLink: "https://meet.google.com/abc-defg-hij",
    meetingType: "google_meet",
    status: "confirmed",
  });

async function stubBookingApis(
  page: Page,
  futureDate: string,
  capture?: BookCapture,
  bookHandlerRef?: { current: BookHandler },
) {
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

    if (bookHandlerRef) {
      await bookHandlerRef.current(
        { postDataJSON: () => route.request().postDataJSON() },
        {
          fulfill: async (init) =>
            route.fulfill({
              status: init.status,
              contentType: "application/json",
              body: init.body ?? "",
            }),
          abort: async () => route.abort("failed"),
          successBody: () => SUCCESS_BOOK_BODY(futureDate),
        },
      );
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: SUCCESS_BOOK_BODY(futureDate),
    });
  });
}

/**
 * Walk the qualification + calendar + form steps on `/es/agendar`,
 * stopping right before the user clicks `button-confirm-booking`.
 * Used by the negative-path tests so each one can stub a different
 * failure response and only the final click differs.
 */
async function fillBookingFormUpToSubmit(page: Page) {
  await page.goto("/es/agendar");

  await expect(page.getByTestId("step-negocio")).toBeVisible();
  await page.getByTestId("select-actividad").selectOption({ index: 1 });
  await page.getByTestId("select-facturacion").selectOption({ index: 1 });
  await page.getByTestId("button-next").click();

  await expect(page.getByTestId("step-situacion")).toBeVisible();
  await page.getByTestId("card-situacion-0").click();
  await page.getByTestId("input-beneficio-neto").fill("4000");
  await page.getByTestId("card-intl-yes").click();
  await page.getByTestId("card-digital-yes").click();
  await page.getByTestId("card-compromiso-yes").click();
  await page.getByTestId("button-next").click();

  await expect(page.getByTestId("step-compromiso")).toBeVisible();
  await page.getByTestId("card-inversion-0").click();
  await page.getByTestId("card-inicio-0").click();
  await page.getByTestId("button-next").click();

  await expect(page.getByTestId("booking-calendar")).toBeVisible({ timeout: 15_000 });

  await page.locator('[data-testid^="day-"]:not([disabled])').first().click();
  await page.getByTestId("slot-1000").click();

  await page.getByTestId("button-meeting-type-meet").click();
  await page.getByTestId("input-name").fill("Ana");
  await page.getByTestId("input-lastName").fill("García");
  await page.getByTestId("input-email").fill("ana.garcia+e2e@example.com");
  await page.getByTestId("input-phone").fill("612345678");

  const privacyCheckbox = page.getByTestId("checkbox-privacy");
  await privacyCheckbox.click({ force: true });
  await expect(privacyCheckbox).toBeChecked({ timeout: 5_000 });
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

/**
 * Negative paths on `POST /api/bookings/book` (PENDING.md §14 follow-up).
 *
 * The happy-path spec only proves the form works when the server agrees.
 * Real users routinely hit:
 *   - 409: the slot they picked got taken between page load and submit
 *     (typical race with another concurrent visitor or with a Discord
 *     manual booking).
 *   - 422: the server rejected validation (e.g. email shape, missing
 *     field after schema migration).
 *   - 500: an internal failure (DB hiccup, Calendar/Gmail outage).
 *   - Network abort: the request never reaches the server (offline,
 *     transient TLS drop, DNS blip).
 *
 * Each test asserts that:
 *   1. The form re-renders (step is reset back to "form" by `onError`).
 *   2. The user sees the failure surfaced in `booking-error`.
 *   3. After the user retries (with the stub now returning 200) the
 *      flow reaches `booking-success` — i.e. nothing about the error
 *      state poisons the form.
 *
 * These run with the same stubbed APIs as the happy path, so they need
 * no DB / Calendar / Gmail and stay deterministic in CI.
 */
test.describe("booking flow (negative paths)", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  // Common assertion: the user sees the booking-error surface and the
  // form is interactive again so they can retry. We assert visibility
  // on the dedicated `booking-error` testid the form already exposes.
  async function expectBookingErrorVisible(page: Page, expectedText?: RegExp | string) {
    const err = page.getByTestId("booking-error");
    await expect(err).toBeVisible({ timeout: 10_000 });
    if (expectedText) {
      await expect(err).toContainText(expectedText);
    }
    // Submit button must be re-enabled (no longer in `confirming` step).
    await expect(page.getByTestId("button-confirm-booking")).toBeEnabled();
  }

  // Common retry: flip the stubbed handler to success, click confirm
  // again, assert the success state.
  async function retryAndAssertSuccess(page: Page, bookHandlerRef: { current: BookHandler }) {
    bookHandlerRef.current = async (_req, h) =>
      h.fulfill({ status: 200, body: h.successBody() });

    await page.getByTestId("button-confirm-booking").click();
    await expect(page.getByTestId("booking-success")).toBeVisible({ timeout: 15_000 });
  }

  test("409 slot conflict surfaces the server message and allows retry", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    const bookHandlerRef: { current: BookHandler } = {
      current: async (_req, h) =>
        h.fulfill({
          status: 409,
          body: JSON.stringify({ error: "Ese horario ya no está disponible" }),
        }),
    };
    await stubBookingApis(page, futureDate, undefined, bookHandlerRef);

    await fillBookingFormUpToSubmit(page);
    await page.getByTestId("button-confirm-booking").click();

    // Server-supplied message is rendered verbatim by the form.
    await expectBookingErrorVisible(page, /no está disponible/i);

    await retryAndAssertSuccess(page, bookHandlerRef);
  });

  test("422 validation error surfaces the server message and allows retry", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    const bookHandlerRef: { current: BookHandler } = {
      current: async (_req, h) =>
        h.fulfill({
          status: 422,
          body: JSON.stringify({ error: "Email no válido" }),
        }),
    };
    await stubBookingApis(page, futureDate, undefined, bookHandlerRef);

    await fillBookingFormUpToSubmit(page);
    await page.getByTestId("button-confirm-booking").click();

    await expectBookingErrorVisible(page, /Email no válido/i);

    await retryAndAssertSuccess(page, bookHandlerRef);
  });

  test("500 server error falls back to the generic copy and allows retry", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    const bookHandlerRef: { current: BookHandler } = {
      // Empty body → mutationFn throws with `t("booking.bookingError")`.
      current: async (_req, h) => h.fulfill({ status: 500, body: "" }),
    };
    await stubBookingApis(page, futureDate, undefined, bookHandlerRef);

    await fillBookingFormUpToSubmit(page);
    await page.getByTestId("button-confirm-booking").click();

    // ES copy from booking.bookingError.
    await expectBookingErrorVisible(page, /Error al crear la reserva/i);

    await retryAndAssertSuccess(page, bookHandlerRef);
  });

  test("network failure surfaces an inline error and allows retry", async ({ page }) => {
    const futureDate = futureWeekdayISO();
    const bookHandlerRef: { current: BookHandler } = {
      current: async (_req, h) => h.abort(),
    };
    await stubBookingApis(page, futureDate, undefined, bookHandlerRef);

    await fillBookingFormUpToSubmit(page);
    await page.getByTestId("button-confirm-booking").click();

    // The exact thrown message depends on the browser ("Failed to
    // fetch", "net::ERR_FAILED", …) so we don't assert the text — we
    // just assert that the user-facing error surface appears and the
    // form is interactive for retry.
    await expectBookingErrorVisible(page);

    await retryAndAssertSuccess(page, bookHandlerRef);
  });
});

/**
 * Negative manage-screen states (PENDING.md §14 follow-up).
 *
 * Two states the customer-facing manage screen has to handle but the
 * happy-path specs never reach:
 *   - The booking is already cancelled (link clicked after the user
 *     already cancelled, or after admin cancel via Discord).
 *   - The booking is in the past (link clicked after the session ended).
 *
 * In both cases the manage actions (reschedule / cancel) must NOT be
 * shown, since they would either be no-ops or hit a server-side error.
 */
test.describe("booking manage (negative states)", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }) => {
    await suppressCookieBanner(page);
  });

  const BOOKING_ID = "bk-stub-e2e-neg";

  function farFutureWeekday(): string {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().slice(0, 10);
  }

  function pastWeekday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
      d.setDate(d.getDate() - 1);
    }
    return d.toISOString().slice(0, 10);
  }

  async function stubGetBooking(
    page: Page,
    payload: {
      status: string;
      isPast: boolean;
      date: string;
    },
  ) {
    await page.route(`**/api/booking/${BOOKING_ID}**`, async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: BOOKING_ID,
          name: "Ana García",
          date: payload.date,
          startTime: "10:00",
          endTime: "10:30",
          googleMeet: "https://meet.google.com/stub-meet-link",
          meetingType: "google_meet",
          phone: null,
          status: payload.status,
          isPast: payload.isPast,
        }),
      });
    });
  }

  test("already-cancelled booking shows the cancelled badge and hides manage actions", async ({ page }) => {
    await stubGetBooking(page, {
      status: "cancelled",
      isPast: false,
      date: farFutureWeekday(),
    });

    await page.goto(`/booking/${BOOKING_ID}?token=stub-token-xyz`);

    // Cancelled badge is the explicit signal to the user.
    await expect(page.getByTestId("badge-status-cancelled")).toBeVisible({ timeout: 10_000 });

    // Manage actions must NOT be reachable: clicking them would call
    // an endpoint that will fail on a cancelled booking.
    await expect(page.getByTestId("button-reschedule")).toHaveCount(0);
    await expect(page.getByTestId("button-cancel-booking")).toHaveCount(0);
  });

  test("past booking shows the completed badge and exposes 'book another'", async ({ page }) => {
    await stubGetBooking(page, {
      status: "confirmed",
      isPast: true,
      date: pastWeekday(),
    });

    await page.goto(`/booking/${BOOKING_ID}?token=stub-token-xyz`);

    await expect(page.getByTestId("badge-status-completed")).toBeVisible({ timeout: 10_000 });

    // Manage actions are hidden — the only forward path is "book another".
    await expect(page.getByTestId("button-reschedule")).toHaveCount(0);
    await expect(page.getByTestId("button-cancel-booking")).toHaveCount(0);
    await expect(page.getByTestId("link-book-again")).toBeVisible();
  });
});
