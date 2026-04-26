import type { Page } from "@playwright/test";

/**
 * Suppress the cookie banner so it does not intercept clicks on
 * interactive elements (intl-yes, calendar slots, etc.). The banner
 * lives in `client/src/components/CookieBanner.tsx` and only renders
 * when `localStorage["exentax_cookie_consent"]` is missing. We
 * pre-populate the key with "all" via `addInitScript` so it is set
 * before any page script runs — including on the very first paint.
 *
 * See `STORAGE_KEYS.COOKIE_CONSENT` in `client/src/lib/constants.ts`.
 */
export async function suppressCookieBanner(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("exentax_cookie_consent", "all");
    } catch {
      /* localStorage may be disabled — banner will still appear, that's OK. */
    }
  });
}
