import { test, expect, type Page, type Locator } from "@playwright/test";
import { suppressCookieBanner } from "./_setup";

/**
 * Tablet-only layout regressions (task 46).
 *
 * Task 39 added `tablet-ipad` and `tablet-android` to the Playwright
 * matrix, so the booking, calculator and language-switch specs now
 * exercise intermediate viewports. But those specs only assert
 * behavior (clicks land, navigation works, slots are pickable). The
 * regression that motivated tablet coverage was *visual*: the primary
 * CTAs on `/agendar` (Anterior + Siguiente, and on the calendar
 * meeting-type pickers) were stacking onto a second row at iPad-class
 * widths. Behaviorally everything still worked, so the existing specs
 * stayed green.
 *
 * This spec closes that gap: it navigates to a few CTA-dense pages
 * and asserts the pair(s) of primary CTAs share the same `offsetTop`.
 * If a CSS / copy / breakpoint change ever pushes one of them to a
 * second row, this spec turns the regression from "user reports it
 * looks broken" into a CI failure.
 *
 * The spec is gated to projects whose name starts with `tablet-`. On
 * the desktop and mobile projects (chromium, firefox, webkit,
 * mobile-chrome, mobile-safari) the buttons either always sit on one
 * row by design (desktop) or always stack by design (mobile), so the
 * assertions would either be redundant or wrong. New tablet projects
 * only have to follow the `tablet-*` naming convention to pick up
 * this coverage automatically — no edit to this file required.
 *
 * Skip with:
 *   - SKIP_E2E=1     (caller wants `npm run test` to be fast / no browsers)
 *   - DB_REQUIRED=1  (caller is running an integration suite, not e2e)
 */

const SHOULD_SKIP = process.env.SKIP_E2E === "1" || process.env.DB_REQUIRED === "1";

/**
 * Assert that every locator in `cta` is visible AND shares the same
 * `offsetTop` as the first one (within a 2px tolerance to absorb
 * sub-pixel rounding on Hi-DPI emulation). Failing this means the
 * elements have wrapped onto multiple visual rows — the exact CTA
 * stacking regression task 46 was written to catch.
 */
async function expectOnSingleRow(label: string, cta: Locator[]) {
  expect(cta.length, `${label}: need at least 2 CTAs to compare`).toBeGreaterThanOrEqual(2);

  const tops: number[] = [];
  for (const el of cta) {
    await expect(el, `${label}: CTA must be visible before measuring`).toBeVisible();
    const top = await el.evaluate((node) => (node as HTMLElement).offsetTop);
    tops.push(top);
  }

  const [first, ...rest] = tops;
  for (let i = 0; i < rest.length; i++) {
    expect(
      Math.abs(rest[i] - first),
      `${label}: CTA #${i + 2} offsetTop=${rest[i]} should match CTA #1 offsetTop=${first} (delta <=2px)`,
    ).toBeLessThanOrEqual(2);
  }
}

test.describe("tablet layout: primary CTAs stay on one row", () => {
  test.skip(SHOULD_SKIP, "SKIP_E2E or DB_REQUIRED set; skipping browser-dependent test.");

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("tablet-"),
      "tablet-only spec; runs on tablet-ipad / tablet-android projects",
    );
    await suppressCookieBanner(page);
  });

  /**
   * `/es/agendar` step 0 only renders a single "Siguiente" button
   * (no "Anterior"), so we have to advance one step before the back+
   * next pair is on screen together. This is the exact pair that
   * stacked in the original regression: they live in a single
   * `flex justify-between` row that has no `flex-wrap`, so if the
   * combined width ever exceeds the container they spill over.
   */
  test("/agendar: back + next CTAs stay on one row after advancing", async ({ page }) => {
    await page.goto("/es/agendar");

    await expect(page.getByTestId("step-negocio")).toBeVisible();
    await page.getByTestId("select-actividad").selectOption({ index: 1 });
    await page.getByTestId("select-facturacion").selectOption({ index: 1 });
    await page.getByTestId("button-next").click();

    // Step 1 (situacion) is the first step with both back and next visible.
    await expect(page.getByTestId("step-situacion")).toBeVisible();

    await expectOnSingleRow("/agendar step 1 nav row", [
      page.getByTestId("button-back"),
      page.getByTestId("button-next"),
    ]);
  });

  /**
   * `/start` hero. Two prominent CTAs ("calcula tu ahorro" + WhatsApp)
   * share a `flex flex-col sm:flex-row` row. Tablet viewports are
   * above the `sm` breakpoint (640px) on both projects in the matrix,
   * so they MUST be on one row. If a copy change makes one button
   * wider than half the container, this catches it.
   */
  test("/start hero: calc + WhatsApp CTAs stay on one row", async ({ page }) => {
    await page.goto("/start");

    await expectOnSingleRow("/start hero CTA row", [
      page.getByTestId("button-scroll-calc"),
      page.getByTestId("button-wa-hero"),
    ]);
  });

  /**
   * `/es/servicios` (the services index / precios page) hero. Same
   * pattern as `/start`: agendar + WhatsApp inside `flex flex-col
   * sm:flex-row`. The Spanish copy is the longest of the six locales
   * for these two CTAs, so if it fits here the other locales fit too.
   */
  test("/servicios hero: agendar + WhatsApp CTAs stay on one row", async ({ page }) => {
    await page.goto("/es/servicios");

    await expectOnSingleRow("/servicios hero CTA row", [
      page.getByTestId("button-precios-hero-agendar"),
      page.getByTestId("button-precios-hero-whatsapp"),
    ]);
  });
});
