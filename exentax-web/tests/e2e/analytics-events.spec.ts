import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { suppressCookieBanner } from "./_setup";

/**
 * Analytics events E2E (task #38).
 *
 * Task #31 retired `tests/ga4-events.spec.ts` because it could never
 * pass against the dev server: `Tracking.tsx::hasAnalyticsConsent()`
 * short-circuits to `false` whenever `import.meta.env.DEV` is true or
 * the hostname is `localhost` / `127.0.0.1`. As a result, the GA4 /
 * Meta events (`whatsapp_click`, `calculator_used`,
 * `booking_completed`, `newsletter_subscribe`, `language_switch`, …)
 * had **no automated coverage** end-to-end — a regression that
 * silently stops pushing them to `window.dataLayer` would not be
 * caught by CI.
 *
 * This spec re-enables that coverage by relying on the
 * `E2E_TEST_HOOKS=1` server hook (see `server/e2e-hook.ts`). When the
 * dev server is started with that env var, the SSR pipeline injects a
 * tiny inline `<script>` setting `window.__EXENTAX_E2E_TRACKING__ =
 * true` BEFORE the React bundle parses; `Tracking.tsx` then bypasses
 * the dev short-circuit AND the cookie-consent gate, initializes
 * `window.gtag` (so `trackEvent(...)` lands in `window.dataLayer`),
 * but explicitly skips loading the external GA4 / Meta Pixel scripts
 * — the suite stays hermetic and never pings googletagmanager.com or
 * connect.facebook.net.
 *
 * The hook is OFF by default in production: real deploys do not set
 * `E2E_TEST_HOOKS`, so `window.__EXENTAX_E2E_TRACKING__` stays
 * `undefined` and the existing consent flow is unchanged.
 *
 * Coverage:
 *   - hook is enabled (fails loudly with a fix-it message if not, so
 *     a regression in the injection pipeline cannot silently skip the
 *     analytics suite),
 *   - `whatsapp_click` from the floating WhatsApp CTA fires with
 *     `cta_location = "floating"`,
 *   - `language_switch` fires with `previous_language` and
 *     `new_language` when changing locale,
 *   - `cta_click` fires from the home Hero with the documented
 *     `cta_name` / `link_url` params,
 *   - `newsletter_subscribe` fires with `source = "footer"` after a
 *     successful (stubbed) `/api/newsletter/subscribe` POST,
 *   - `calculator_used` fires after the `/start` calculator email
 *     gate with `country` / `regime` / `activity` / `income` params,
 *   - `booking_completed` fires after a successful (stubbed) booking
 *     with `form_name = "booking"` plus `date` / `start_time`.
 *
 * All `/api/*` and external links are stubbed so the spec is fully
 * hermetic — same convention as the rest of `tests/e2e/`.
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1" || process.env.DB_REQUIRED === "1";

type DataLayerEvent = { event: string; params: Record<string, unknown> };

/**
 * Read `window.dataLayer` and normalize each entry to a plain
 * `{ event, params }` shape. Entries pushed via `gtag(...)` are
 * `Arguments` objects (array-like); entries pushed via the direct
 * fallback in `Tracking.tsx::trackEvent` are real arrays. Both are
 * coerced to `Array` inside the page context (where `Arguments` is
 * still array-like) so Playwright's serializer can ferry them across
 * cleanly.
 */
async function readDataLayerEvents(page: Page): Promise<DataLayerEvent[]> {
  const raw = await page.evaluate(() => {
    const dl = (window.dataLayer || []) as ArrayLike<unknown>[];
    return Array.from(dl).map((entry: unknown) => {
      if (Array.isArray(entry)) return entry.slice();
      return Array.prototype.slice.call(entry as ArrayLike<unknown>);
    });
  });
  const out: DataLayerEvent[] = [];
  for (const entry of raw) {
    if (entry[0] === "event" && typeof entry[1] === "string") {
      out.push({
        event: entry[1] as string,
        params: (entry[2] || {}) as Record<string, unknown>,
      });
    }
  }
  return out;
}

/**
 * Defense-in-depth: even though `Tracking.tsx` skips the external
 * GA4 / Meta scripts when the test hook is on, we abort any request
 * to those domains so a regression in the skip path cannot leak
 * outside the test environment or flake the suite on a slow network.
 */
async function blockExternalAnalytics(context: BrowserContext) {
  await context.route(
    /(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|connect\.facebook\.net|facebook\.com\/tr)/,
    (route) => route.abort(),
  );
}

/**
 * Prevent navigation to `wa.me` / `whatsapp.com` when the floating
 * WhatsApp CTA is clicked (it has `target="_blank"`, so Chromium
 * opens a popup tab). We block at the context level so popups are
 * covered too. The `onClick` analytics call still fires before the
 * navigation is attempted.
 */
async function blockExternalNavigation(context: BrowserContext) {
  await context.route(
    /(wa\.me|whatsapp\.com)/,
    (route) => route.abort(),
  );
}

async function ensureHookEnabled(page: Page) {
  await page.goto("/es");
  const enabled = await page.evaluate(
    () => (window as unknown as { __EXENTAX_E2E_TRACKING__?: boolean }).__EXENTAX_E2E_TRACKING__ === true,
  );
  if (!enabled) {
    throw new Error(
      "E2E analytics test hook is not enabled on the running server. " +
      "The spec needs `window.__EXENTAX_E2E_TRACKING__ = true`, which " +
      "`server/e2e-hook.ts` only injects when `E2E_TEST_HOOKS=1`. " +
      "Restart the dev server with `E2E_TEST_HOOKS=1 npm run dev` " +
      "(or rely on `playwright.config.ts` `webServer.env`, which sets " +
      "this automatically when `CI=1`).",
    );
  }
}

test.describe("analytics events", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test.beforeEach(async ({ page, context }) => {
    await suppressCookieBanner(page);
    await blockExternalAnalytics(context);
    await blockExternalNavigation(context);
  });

  test("E2E tracking hook is wired and language is captured on every event", async ({ page }) => {
    await ensureHookEnabled(page);
    // Every `trackEvent(...)` call merges in `language` and
    // `location` (see `Tracking.tsx::trackEvent`). Trigger one event
    // (the WhatsApp click is the cheapest) and assert the merged
    // metadata is present so a regression that drops these fields is
    // caught here, not by every individual event test.
    await page.getByTestId("button-floating-whatsapp").click();
    const events = await readDataLayerEvents(page);
    const first = events.find((e) => e.event === "whatsapp_click");
    expect(first, "an event landed in dataLayer").toBeDefined();
    expect(first!.params.language).toBe("es");
    expect(typeof first!.params.location).toBe("string");
  });

  test("whatsapp_click fires from the floating WhatsApp CTA", async ({ page }) => {
    await ensureHookEnabled(page);
    await page.getByTestId("button-floating-whatsapp").click();
    const events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "whatsapp_click");
    expect(ev, "whatsapp_click event fired").toBeDefined();
    expect(ev!.params.cta_location).toBe("floating");
  });

  test("language_switch fires when changing locale", async ({ page }) => {
    await ensureHookEnabled(page);
    await page.getByTestId("button-lang-switcher").click();
    await page.getByTestId("button-lang-en").click();
    await page.waitForURL(/\/en(\/|$)/, { timeout: 10_000 });
    const events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "language_switch");
    expect(ev, "language_switch event fired").toBeDefined();
    expect(ev!.params.previous_language).toBe("es");
    expect(ev!.params.new_language).toBe("en");
  });

  test("cta_click fires from the Hero `Reservar consulta` button", async ({ page }) => {
    await ensureHookEnabled(page);
    // Hero CTA — `trackCTA("hero_book_consultation", lp("book"))`.
    // The button is a `<Link>` (wouter, client-side router) so the
    // click does NOT trigger a full document navigation — the
    // dataLayer survives and we can read it directly. The Hero
    // button uses `data-testid="button-hero-agendar"` (see
    // `client/src/components/sections/Hero.tsx`).
    const heroBookBtn = page.getByTestId("button-hero-agendar").first();
    await heroBookBtn.scrollIntoViewIfNeeded();
    await heroBookBtn.click();
    const events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "cta_click" && e.params.cta_name === "hero_book_consultation");
    expect(ev, "cta_click(hero_book_consultation) fired").toBeDefined();
    expect(typeof ev!.params.link_url).toBe("string");
  });

  test("newsletter_subscribe fires after a successful footer subscribe", async ({ page }) => {
    await page.route("**/api/newsletter/subscribe", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );
    await ensureHookEnabled(page);
    const emailInput = page.getByTestId("input-newsletter-email");
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill("nl+e2e@example.com");
    await page.getByTestId("button-newsletter-subscribe").click();
    await expect(page.getByTestId("text-newsletter-success")).toBeVisible({ timeout: 10_000 });
    const events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "newsletter_subscribe");
    expect(ev, "newsletter_subscribe event fired").toBeDefined();
    expect(ev!.params.source).toBe("footer");
    // Footer also fires the generic `form_submit` companion event so
    // GA4 funnels can keep using it (see `Tracking.tsx`).
    const formSubmit = events.find(
      (e) => e.event === "form_submit" && e.params.form_name === "newsletter_footer",
    );
    expect(formSubmit, "companion form_submit(newsletter_footer) fired").toBeDefined();
  });

  test("calculator_used fires after the `/start` calculator email gate", async ({ page }) => {
    await page.route("**/api/calculator-leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "stub-lead-id" }),
      }),
    );
    await ensureHookEnabled(page);
    await page.goto("/start");

    // Lazy-mounted via IntersectionObserver — same setup as
    // `calculator-flow.spec.ts::ensureCalculatorMounted`.
    await page.locator('[data-testid="calculator-mount"]').waitFor({
      state: "attached",
      timeout: 15_000,
    });
    await page.locator('[data-testid="calculator-mount"]').scrollIntoViewIfNeeded();
    await expect(page.getByTestId("calculator")).toBeVisible({ timeout: 15_000 });

    await page.getByTestId("button-country-espana").click();
    await page.getByTestId("select-regime").selectOption("autonomo");
    await page.getByTestId("select-activity").selectOption("digitalServices");
    await expect(page.getByTestId("select-ccaa")).toBeVisible();
    await page.getByTestId("select-ccaa").selectOption("cataluna");

    const incomeInput = page.getByTestId("text-income-value");
    await incomeInput.click();
    await incomeInput.fill("5000");
    await incomeInput.blur();

    await expect(page.getByTestId("form-email-gate")).toBeVisible({ timeout: 10_000 });
    await page.getByTestId("input-email-gate").fill("user+e2e@example.com");
    await page.getByTestId("input-phone-gate").fill("612345678");
    const privacyCheckbox = page.getByTestId("checkbox-privacy");
    await privacyCheckbox.click({ force: true });
    await expect(privacyCheckbox).toBeChecked({ timeout: 5_000 });
    await page.getByTestId("button-submit-email").click();
    await expect(page.getByTestId("calculator-results")).toBeVisible({ timeout: 15_000 });

    const events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "calculator_used");
    expect(ev, "calculator_used event fired").toBeDefined();
    expect(ev!.params.country).toBe("espana");
    expect(ev!.params.regime).toBe("autonomo");
    expect(ev!.params.activity).toBe("digitalServices");
    // `trackCalculatorUsed` normalizes `monthly_income` → `income`.
    expect(typeof ev!.params.income).toBe("number");
    expect(ev!.params.income).toBe(5000);
  });

  test("booking_completed fires after a successful booking on /es/agendar", async ({ page }) => {
    // Pick a future weekday so the calendar renders a clickable day.
    const futureDate = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
        d.setDate(d.getDate() + 1);
      }
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    })();

    await page.route("**/api/bookings/blocked-days", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      }),
    );
    await page.route("**/api/bookings/available-slots**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          date: futureDate,
          slots: ["10:00", "11:00", "12:00", "16:00"],
          blocked: false,
        }),
      }),
    );
    await page.route("**/api/bookings/book", (route) =>
      route.fulfill({
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
      }),
    );

    await ensureHookEnabled(page);
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
    await page.getByTestId("button-confirm-booking").click();

    await expect(page.getByTestId("booking-success")).toBeVisible({ timeout: 15_000 });

    const events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "booking_completed");
    expect(ev, "booking_completed event fired").toBeDefined();
    expect(ev!.params.form_name).toBe("booking");
    expect(ev!.params.date).toBe(futureDate);
    expect(ev!.params.start_time).toBe("10:00");
    // `trackBookingInitiated` should have fired earlier when the day
    // was clicked — verifying both gives us coverage of the full
    // funnel, not just the terminal event.
    const initiated = events.find((e) => e.event === "booking_initiated");
    expect(initiated, "booking_initiated event fired").toBeDefined();
    // Task #69 — `trackBookingCompleted` also emits a generic
    // `form_submit` companion (mirroring newsletter) so GA4 funnels
    // keyed off `form_submit` capture booking conversions too.
    const formSubmit = events.find(
      (e) => e.event === "form_submit" && e.params.form_name === "booking",
    );
    expect(formSubmit, "companion form_submit(booking) fired").toBeDefined();
    expect(formSubmit!.params.date).toBe(futureDate);
    expect(formSubmit!.params.start_time).toBe("10:00");
  });

  // ---------------------------------------------------------------------------
  // Task #69 — coverage for the remaining tracked GA4 events
  // (`page_view`, `lead_qualified`, `blog_read`). The booking
  // companion `form_submit` is asserted alongside `booking_completed`
  // above; the newsletter companion is asserted in the existing
  // `newsletter_subscribe` test.
  // ---------------------------------------------------------------------------

  test("page_view fires on initial load and on wouter navigation", async ({ page }) => {
    await ensureHookEnabled(page);
    // Initial mount: `Tracking.tsx` calls `trackPageView(location)`
    // from a `useEffect` keyed on `location`. The hook relaxes the
    // GA4_ID gate (task #69) so the event lands in `dataLayer`.
    await expect.poll(async () => {
      const events = await readDataLayerEvents(page);
      return events.some((e) => e.event === "page_view" && e.params.page_path === "/es");
    }, { timeout: 10_000 }).toBe(true);

    // Client-side navigation via wouter — the language switcher uses
    // `setLocation(...)`, which updates the `useLocation` value that
    // `Tracking.tsx` watches. After the nav we expect a SECOND
    // `page_view` for the new path (`/en` or any `/en/...` route).
    await page.getByTestId("button-lang-switcher").click();
    await page.getByTestId("button-lang-en").click();
    await page.waitForURL(/\/en(\/|$)/, { timeout: 10_000 });

    await expect.poll(async () => {
      const events = await readDataLayerEvents(page);
      return events.filter((e) => e.event === "page_view").length;
    }, { timeout: 10_000 }).toBeGreaterThanOrEqual(2);

    const events = await readDataLayerEvents(page);
    const pageViews = events.filter((e) => e.event === "page_view");
    expect(pageViews[0].params.page_path).toBe("/es");
    // The post-switch view should land on an `/en…` path. Wouter may
    // emit an intermediate path during the redirect chain, so assert
    // that AT LEAST ONE later `page_view` is for the English locale.
    const hasEnView = pageViews.slice(1).some(
      (e) => typeof e.params.page_path === "string" && /^\/en(\/|$)/.test(e.params.page_path as string),
    );
    expect(hasEnView, "a post-navigation page_view targeted /en").toBe(true);
    // Every `page_view` should carry the doc title + language.
    for (const pv of pageViews) {
      expect(typeof pv.params.page_title).toBe("string");
      expect(typeof pv.params.language).toBe("string");
    }
  });

  test("lead_qualified fires after the qualification questionnaire on /es/agendar", async ({ page }) => {
    // No backend stubs needed — the qualification step is fully
    // client-side; we only need to walk the 3-step form and click
    // the final "Ver horarios" button which calls `next()` →
    // `trackLeadQualified(...)` → `setShowCalendar(true)`.
    await ensureHookEnabled(page);
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

    // No event yet — `lead_qualified` only fires on the FINAL `next()`
    // that flips `showCalendar` to true. Asserting the negative here
    // catches a regression that would emit it eagerly on every step.
    let events = await readDataLayerEvents(page);
    expect(
      events.find((e) => e.event === "lead_qualified"),
      "lead_qualified should NOT fire before the final step",
    ).toBeUndefined();

    await page.getByTestId("button-next").click();

    events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "lead_qualified");
    expect(ev, "lead_qualified event fired").toBeDefined();
    // The qualification answers we entered above should round-trip
    // through `trackLeadQualified(...)` so GA4 can segment the funnel.
    expect(ev!.params.monthly_profit).toBe("4000");
    expect(ev!.params.international_clients).toBe("yes");
    expect(ev!.params.digital).toBe("yes");
    expect(typeof ev!.params.activity).toBe("string");
    expect(typeof ev!.params.invoicing).toBe("string");
  });

  test("blog_read fires after the engaged-read threshold on a blog post", async ({ page }) => {
    await ensureHookEnabled(page);
    // Pick a real, long-enough article so the rendered DOM has room
    // to scroll past 50% in a desktop viewport. `llc-estados-unidos-
    // guia-completa-2026` is the canonical pillar post (always
    // present in `BLOG_POSTS`) and ships in every locale.
    const slug = "llc-estados-unidos-guia-completa-2026";
    await page.goto(`/es/blog/${slug}`);

    // Wait for the article shell to render — `post.tsx` mounts the
    // scroll listener inside a `useEffect` keyed on `post?.slug`,
    // so we need the page to actually find the post first.
    await page.waitForSelector("article, main, [data-testid^='blog-']", { timeout: 15_000 });

    // No event yet at the top of the page — the threshold is 50%
    // scroll depth.
    let events = await readDataLayerEvents(page);
    expect(
      events.find((e) => e.event === "blog_read"),
      "blog_read should NOT fire before the scroll threshold",
    ).toBeUndefined();

    // Scroll all the way to the bottom in a single jump — this
    // guarantees the >= 50% threshold trips. The handler is wired as
    // a passive scroll listener, so we wait for a microtask after.
    await page.evaluate(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" as ScrollBehavior });
    });
    // The scroll listener is `passive` and `Tracking.tsx::trackEvent`
    // pushes synchronously, but Chromium can defer the dispatch to
    // the next frame on programmatic scrolls. Poll for up to 5s.
    await expect.poll(async () => {
      const evs = await readDataLayerEvents(page);
      return evs.some((e) => e.event === "blog_read");
    }, { timeout: 5_000 }).toBe(true);

    events = await readDataLayerEvents(page);
    const ev = events.find((e) => e.event === "blog_read");
    expect(ev, "blog_read event fired").toBeDefined();
    expect(ev!.params.slug).toBe(slug);
    expect(ev!.params.language).toBe("es");
    expect(typeof ev!.params.read_time).toBe("number");
    expect(ev!.params.read_time as number).toBeGreaterThan(0);

    // Fires at most once per mount — scrolling around again should
    // not duplicate it. Catches a regression where the once-only
    // guard inside the scroll handler is removed.
    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight }));
    const after = await readDataLayerEvents(page);
    const blogReads = after.filter((e) => e.event === "blog_read");
    expect(blogReads.length, "blog_read fired exactly once").toBe(1);
  });
});
