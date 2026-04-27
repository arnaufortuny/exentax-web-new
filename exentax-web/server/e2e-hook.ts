/**
 * E2E test-hook injector (task #38).
 *
 * The Playwright spec `tests/e2e/analytics-events.spec.ts` needs the
 * client-side analytics layer (`client/src/components/Tracking.tsx`)
 * to actually push events into `window.dataLayer` so it can assert
 * that `whatsapp_click`, `calculator_used`, `booking_completed`,
 * `newsletter_subscribe`, `language_switch`, etc. fire with the
 * documented params. By default `hasAnalyticsConsent()` short-circuits
 * to `false` whenever `import.meta.env.DEV` is true or the hostname is
 * `localhost` / `127.0.0.1`, so on the dev server (and on a CI dev
 * server) no events would ever land.
 *
 * Mirroring the pattern used by `/api/__test/render-calculator-email`,
 * this hook is opt-in via the `E2E_TEST_HOOKS=1` env var. When set,
 * the SSR HTML pipeline injects a single inline `<script>` BEFORE the
 * app bundle parses, setting `window.__EXENTAX_E2E_TRACKING__ = true`.
 * `Tracking.tsx::hasAnalyticsConsent()` then returns true, and the
 * external GA4 / Meta Pixel scripts are explicitly skipped — the
 * suite stays hermetic.
 *
 * Production safety: real production deploys do NOT set
 * `E2E_TEST_HOOKS`, so this function is a no-op there. Even if the
 * env var were set by mistake, the consequences are bounded: events
 * land in `window.dataLayer` but no external GA4 / Meta Pixel script
 * loads, so no telemetry leaks.
 */
const E2E_TRACKING_INLINE_SCRIPT =
  '<script>window.__EXENTAX_E2E_TRACKING__=true;</script>';

export function isE2eHooksEnabled(): boolean {
  return process.env.E2E_TEST_HOOKS === "1";
}

export function maybeInjectE2eTrackingHook(html: string): string {
  if (!isE2eHooksEnabled()) return html;
  // Inject right before the closing `</head>` so it parses before
  // the React bundle (which lives at the end of `<body>`). If the
  // template lacks `</head>` (defensive — `client/index.html` always
  // has one), fall back to prepending so the flag is still set
  // before any app code runs.
  if (html.includes("</head>")) {
    return html.replace("</head>", `    ${E2E_TRACKING_INLINE_SCRIPT}\n  </head>`);
  }
  return E2E_TRACKING_INLINE_SCRIPT + html;
}
