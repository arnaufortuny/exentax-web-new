import { useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { getCookieConsent } from "./CookieBanner";

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq: typeof window.fbq;
  }
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

function initGTM(id: string) {
  if (document.getElementById("gtm-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(s);
  const ns = document.createElement("noscript");
  ns.id = "gtm-noscript";
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}`;
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.display = "none";
  iframe.style.visibility = "hidden";
  ns.appendChild(iframe);
  document.body.prepend(ns);
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
  window.fbq("track", "PageView");
}

function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "all";
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
    if (GA4_ID) {
      initGA4(GA4_ID);
      updateGtagConsent(true);
    }
    if (GTM_ID) initGTM(GTM_ID);
    if (META_PIXEL_ID) initMetaPixel(META_PIXEL_ID);
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (!hasAnalyticsConsent()) return;
  if (GA4_ID && window.gtag) {
    window.gtag("event", event, params);
  }
  if (GTM_ID && window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}

export function trackCTA(ctaName: string, destination?: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    link_url: destination || window.location.pathname,
  });
}

export function trackFormSubmit(formName: string) {
  trackEvent("form_submit", { form_name: formName });
}

export function trackOutboundLink(url: string) {
  trackEvent("outbound_link", { link_url: url });
}

function trackPageView(path: string) {
  if (!hasAnalyticsConsent()) return;
  if (GA4_ID && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title,
    });
  }
  if (GTM_ID && window.dataLayer) {
    window.dataLayer.push({ event: "page_view", page_path: path });
  }
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "PageView");
  }
}

function getSessionId(): string {
  const key = "exentax_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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
  }).catch((e) => console.error("[tracking] visitor report failed", e));
}

export default function Tracking() {
  const [location] = useLocation();

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
    trackPageView(location);
    reportVisit(location);
  }, [location]);

  return null;
}
