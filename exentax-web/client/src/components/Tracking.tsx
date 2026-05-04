import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { getCookieConsent } from "./CookieBanner";
import { clientLogger } from "@/lib/clientLogger";
import { randomUUID } from "@/lib/random-uuid";
import i18n from "@/i18n";

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq: typeof window.fbq;
    /**
     * E2E test hook (task #38). When the server is started with
     * `E2E_TEST_HOOKS=1`, `server/static.ts` / `server/vite.ts` inject
     * a tiny inline `<script>` that sets this flag to `true` BEFORE
     * the app bundle parses. When set, the analytics layer:
     *   - bypasses the dev / localhost short-circuit in
     *     `hasAnalyticsConsent()` so events actually fire,
     *   - bypasses the cookie-consent gate (the spec sets the
     *     localStorage key as a belt-and-brace anyway),
     *   - initializes `window.gtag` (so `trackEvent(...)` lands in
     *     `window.dataLayer`) but does NOT load the external GA4 /
     *     Meta Pixel scripts, so the suite stays hermetic and never
     *     pings googletagmanager.com / connect.facebook.net.
     * The flag is OFF by default in production: real production
     * deployments do not set `E2E_TEST_HOOKS`, so the inline script
     * is never injected and this property stays `undefined`.
     */
    __EXENTAX_E2E_TRACKING__?: boolean;
  }
}

function isE2eTrackingMode(): boolean {
  return typeof window !== "undefined" && window.__EXENTAX_E2E_TRACKING__ === true;
}

function initGtagBase() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

function initGA4(id: string) {
  if (document.getElementById("ga4-script")) return;
  initGtagBase();
  const s = document.createElement("script");
  s.id = "ga4-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.gtag!("js", new Date());
  window.gtag!("config", id, {
    send_page_view: false,
    cookie_flags: "SameSite=Lax;Secure",
    // Privacy hardening: discard the last octet of the visitor IP before
    // GA4 ingests it. GDPR best practice (Spain AEPD also recommends).
    anonymize_ip: true,
  });
}

function initMetaPixel(id: string) {
  if (document.getElementById("meta-pixel-script")) return;
  const f = window as typeof window;
  if (!f.fbq) {
    const n = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : (n.queue = n.queue || [], n.queue.push(args));
    } as typeof window.fbq;
    f.fbq = n;
    f._fbq = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
  }
  const s = document.createElement("script");
  s.id = "meta-pixel-script";
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", id);
}

function isDevEnvironment(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local");
}

function hasAnalyticsConsent(): boolean {
  // Task #38 — when the E2E test hook is enabled (server injects the
  // inline flag only on `E2E_TEST_HOOKS=1`), bypass both the dev
  // short-circuit AND the cookie-consent gate so the spec can assert
  // that `whatsapp_click`, `calculator_used`, `booking_completed`,
  // `newsletter_subscribe`, `language_switch`, etc. actually land in
  // `window.dataLayer`. The hook never auto-enables; without the
  // server-side injection the flag is `undefined` and behavior is
  // unchanged.
  if (isE2eTrackingMode()) return true;
  if (isDevEnvironment()) return false;
  return getCookieConsent() === "all";
}

function getLanguage(): string {
  return (i18n.language || "es").split("-")[0];
}

function updateGtagConsent(granted: boolean) {
  if (!window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
}

/**
 * Clear analytics cookies / scripts when the visitor revokes consent.
 *
 * The cookie banner already prevents the GA4 / Meta scripts from loading
 * until consent is granted (see `initTrackingIfConsented`). However, if a
 * visitor first accepts ("all"), browses for a while, and then opens the
 * banner again to switch to "essential" or revoke entirely, the analytics
 * cookies set during the accepted session would otherwise linger in the
 * browser. GDPR requires that a withdrawal of consent be as easy and as
 * effective as the original grant.
 *
 * Implementation:
 *  1. Update Google's Consent Mode v2 to "denied" (already done by
 *     `updateGtagConsent`, called separately).
 *  2. Disable the GA4 measurement ID via the `ga-disable-<ID>` window flag
 *     so any in-flight `gtag()` calls become no-ops.
 *  3. Wipe the well-known GA4 (`_ga*`, `_gid`, `_gat*`) and Meta Pixel
 *     (`_fbp`, `_fbc`) cookies for the current host AND its parent
 *     `.exentax.com` (GA4 sets cookies on the eTLD+1 by default).
 *  4. Detach Pixel by clearing the `fbq` queue so further calls are
 *     silently dropped.
 *
 * Idempotent — safe to call on every consent-change event.
 */
function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  if (GA4_ID) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_ID}`] = true;
  }
  const cookieNamePrefixes = ["_ga", "_gid", "_gat", "_fbp", "_fbc", "_gcl_au"];
  const host = window.location.hostname;
  const parentDomain = host.split(".").slice(-2).join(".");
  const domains = [host, `.${host}`, parentDomain, `.${parentDomain}`];
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const raw of cookies) {
    const name = raw.split("=")[0]?.trim();
    if (!name) continue;
    if (!cookieNamePrefixes.some((p) => name === p || name.startsWith(p))) continue;
    for (const d of domains) {
      // Best-effort wipe across domain variants — browser silently ignores
      // mismatched domain attributes, and the matching one effectively
      // expires the cookie.
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
  }
  if (window.fbq) {
    try {
      window.fbq.queue = [];
    } catch {
      // No-op: fbq stub may not be writable in every browser sandbox.
    }
  }
}

function initTrackingIfConsented() {
  const consented = hasAnalyticsConsent();
  if (consented) {
    if (isE2eTrackingMode()) {
      // Task #38 — initialize the gtag stub so `trackEvent(...)` lands
      // in `window.dataLayer`, but DO NOT load the external GA4 / Meta
      // Pixel scripts. This keeps the E2E suite hermetic (no network
      // hops to googletagmanager.com / connect.facebook.net) while
      // still exercising the full call-site → dataLayer pipeline.
      initGtagBase();
      return;
    }
    if (GA4_ID) {
      initGA4(GA4_ID);
      updateGtagConsent(true);
    }
    if (META_PIXEL_ID) initMetaPixel(META_PIXEL_ID);
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (!hasAnalyticsConsent()) return;
  const merged = {
    location: window.location.pathname,
    language: getLanguage(),
    ...(params || {}),
  };
  if (window.gtag) {
    window.gtag("event", event, merged);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", event, merged]);
  }
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("trackCustom", event, merged);
  }
}

export function trackCTA(
  ctaName: string,
  destination?: string,
  ctaText?: string,
  extra?: Record<string, unknown>,
) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_text: ctaText || ctaName,
    link_url: destination || window.location.pathname,
    page_location: typeof window !== "undefined" ? window.location.href : "",
    ...(extra || {}),
  });
}

export function trackFormSubmit(formName: string, params?: Record<string, unknown>) {
  trackEvent("form_submit", { form_name: formName, ...(params || {}) });
}

export function trackContactFormSubmitted(formName: string, params?: Record<string, unknown>) {
  trackEvent("contact_form_submitted", { form_name: formName, ...(params || {}) });
  trackEvent("form_submit", { form_name: formName, ...(params || {}) });
}

// Newsletter subscribe — emits both the generic `form_submit` for
// funnel-level dashboards AND a dedicated `newsletter_subscribe` event
// so GA4 can mark it as a conversion and segment by source/language
// without relying on a param filter on `form_submit`.
export function trackNewsletterSubscribe(source: string, params?: Record<string, unknown>) {
  trackEvent("newsletter_subscribe", { source, ...(params || {}) });
  trackEvent("form_submit", { form_name: `newsletter_${source}`, ...(params || {}) });
}

export function trackWhatsAppClick(location: string, params?: Record<string, unknown>) {
  trackEvent("whatsapp_click", { cta_location: location, ...(params || {}) });
}

export function trackBookingInitiated(params?: Record<string, unknown>) {
  trackEvent("booking_initiated", params);
}

// Booking confirm — emits the dedicated `booking_completed` conversion
// event AND a generic `form_submit` companion (mirroring newsletter)
// so GA4 funnels keyed off `form_submit` capture booking too. Task #69.
export function trackBookingCompleted(params?: Record<string, unknown>) {
  trackEvent("booking_completed", params);
  const p = params || {};
  const formName = (p.form_name as string | undefined) || "booking";
  trackEvent("form_submit", { ...p, form_name: formName });
}

// Lead qualified — fired when the visitor finishes the qualification
// questionnaire on `/agendar` and proceeds to the calendar step.
// Task #69.
export function trackLeadQualified(params?: Record<string, unknown>) {
  trackEvent("lead_qualified", params);
}

// Blog read — fired once per visit to a blog post when the visitor
// crosses the engaged-read threshold (≥ 50% scroll). Task #69.
export function trackBlogRead(params?: Record<string, unknown>) {
  trackEvent("blog_read", params);
}

export function trackCalculatorUsed(params?: Record<string, unknown>) {
  const p = params || {};
  const monthly = (p.monthly_income as number | undefined) ?? (p.income as number | undefined);
  trackEvent("calculator_used", {
    ...p,
    income: monthly,
  });
}

// Calculator completed — fired ONCE per session the first time the
// visitor has filled in everything required to compute a result
// (country + regime + a touched income value). This is the upper-funnel
// counterpart to `calculator_used`: it measures intent BEFORE the email
// gate so we can quantify the drop-off between "ready to see results"
// and "submitted email to see them". Deduped via sessionStorage so a
// visitor who tweaks inputs many times only emits the event once per
// session. Independent of `calculator_used`, which keeps measuring
// actual lead conversion.
const CALC_COMPLETED_KEY = "exentax_calc_completed";
export function trackCalculatorCompleted(params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // Consent FIRST — if analytics isn't allowed, do nothing AND don't
  // burn the dedupe key. That way a visitor who completes the inputs
  // before accepting cookies still emits the event when they accept
  // (since cookie-consent-change re-runs trackPageView and any future
  // dep-driven re-fire of this effect will pass through here cleanly).
  if (!hasAnalyticsConsent()) return;
  // Read dedupe — if already fired this session, exit quietly.
  try {
    if (sessionStorage.getItem(CALC_COMPLETED_KEY) === "1") return;
  } catch {
    // sessionStorage may be unavailable (private mode, sandboxed iframe).
    // In that case we still emit the event — losing dedupe is preferable
    // to losing the signal entirely.
  }
  const p = params || {};
  const monthly = (p.monthly_income as number | undefined) ?? (p.income as number | undefined);
  trackEvent("calculator_completed", {
    ...p,
    income: monthly,
  });
  // Write dedupe AFTER emit — guarantees the key is only consumed when
  // the event actually went out, never when it was suppressed by consent.
  try {
    sessionStorage.setItem(CALC_COMPLETED_KEY, "1");
  } catch {
    // No dedupe possible — accept that next re-fire may re-emit.
  }
}

export function trackOutboundLink(url: string) {
  trackEvent("outbound_link", { link_url: url });
}

export function trackLanguageSwitch(previousLang: string, newLang: string) {
  trackEvent("language_switch", {
    previous_language: previousLang,
    new_language: newLang,
  });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100, params?: Record<string, unknown>) {
  trackEvent("scroll_depth", { percent, ...(params || {}) });
}

export function trackTimeOnPage(seconds: number, params?: Record<string, unknown>) {
  trackEvent("time_on_page", { seconds: Math.round(seconds), ...(params || {}) });
}

// `page_view` fires whenever wouter changes `location` (see the
// component below). Originally gated on `GA4_ID` being defined, which
// meant the E2E suite (which does NOT set `VITE_GA4_ID`) could not
// assert it. Task #69 relaxes the gate so the event also lands in
// `window.dataLayer` when the test hook is on — production behavior
// is unchanged because `isE2eTrackingMode()` is always `false` there.
export function trackPageView(path: string) {
  if (!hasAnalyticsConsent()) return;
  if ((GA4_ID || isE2eTrackingMode()) && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title,
      language: getLanguage(),
    });
  }
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "PageView");
  }
}

function getSessionId(): string {
  const key = "exentax_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = randomUUID();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

function getUtmParams(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
  };
}

function reportVisit(path: string) {
  const consent = getCookieConsent();
  if (consent !== "all") return;
  const utm = getUtmParams();
  const payload: Record<string, unknown> = {
    consent,
    page: path,
    referrer: document.referrer || null,
    language: navigator.language || null,
    screen: `${window.screen.width}x${window.screen.height}`,
    sessionId: getSessionId(),
  };
  if (utm.utm_source) payload.utm_source = utm.utm_source;
  if (utm.utm_medium) payload.utm_medium = utm.utm_medium;
  if (utm.utm_campaign) payload.utm_campaign = utm.utm_campaign;
  if (utm.utm_content) payload.utm_content = utm.utm_content;
  fetch("/api/visitor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((e) => clientLogger.warn("[tracking] visitor report failed", e));
}

export default function Tracking() {
  const [location] = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  const onConsentChange = useCallback(() => {
    const now = hasAnalyticsConsent();
    updateGtagConsent(now);
    if (now) {
      initTrackingIfConsented();
    } else {
      // Visitor revoked / downgraded consent — wipe any GA4 / Meta cookies
      // left over from a previous accepted session and disable further
      // measurement calls. Required by GDPR Art. 7(3): withdrawal of consent
      // must be as easy as the original grant.
      clearAnalyticsCookies();
    }
  }, []);

  useEffect(() => {
    initTrackingIfConsented();

    window.addEventListener("cookie-consent-change", onConsentChange);
    return () => window.removeEventListener("cookie-consent-change", onConsentChange);
  }, [onConsentChange]);

  useEffect(() => {
    if (lastTrackedPath.current === location) return;
    lastTrackedPath.current = location;
    trackPageView(location);
    reportVisit(location);
  }, [location]);

  return null;
}
