import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { getCookieConsent } from "./CookieBanner";
import { clientLogger } from "@/lib/clientLogger";
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

export function trackBookingCompleted(params?: Record<string, unknown>) {
  trackEvent("booking_completed", params);
}

export function trackCalculatorUsed(params?: Record<string, unknown>) {
  const p = params || {};
  const monthly = (p.monthly_income as number | undefined) ?? (p.income as number | undefined);
  trackEvent("calculator_used", {
    ...p,
    income: monthly,
  });
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

function trackPageView(path: string) {
  if (!hasAnalyticsConsent()) return;
  if (GA4_ID && window.gtag) {
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
    sid = crypto.randomUUID();
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
    if (now) initTrackingIfConsented();
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
