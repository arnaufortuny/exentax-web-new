import { MADRID_TZ, DATE_LOCALE_ISO as SHARED_DATE_LOCALE_ISO, nowMadrid as sharedNowMadrid, todayMadridISO as sharedTodayMadridISO } from "../shared/madrid-time";

export const SUPPORTED_LANGS: readonly string[] = ["es", "en", "fr", "de", "pt", "ca"];
export type SupportedLang = "es" | "en" | "fr" | "de" | "pt" | "ca";

/**
 * BCP-47 region tags advertised on every page (HTTP `Link` headers,
 * prerendered `<link rel="alternate">` tags, sitemap `<xhtml:link>` and the
 * client-side `SEO.tsx` re-emission). Mirrors `LanguageService.getLocaleTag()`
 * on the client. Centralised here so the four server-side touchpoints stay in
 * lockstep; the client copy in `client/src/components/SEO.tsx` references this
 * file in its top-level comment so that drift is impossible to miss in review.
 */
export const HREFLANG_BCP47: Record<SupportedLang, string> = {
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  ca: "ca-ES",
};

export const AGENDA_STATUSES = {
  PENDING: "pending",
  CONTACTED: "contacted",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
  NO_SHOW: "no_show",
} as const;

export function isCancelledStatus(status: string | null | undefined): boolean {
  return status === AGENDA_STATUSES.CANCELLED;
}

export const LEAD_SOURCES = {
  CALCULATOR: "Calculadora web",
  BOOKING_WEB: "Agenda web",
} as const;

export const COMPANY_ADDRESS_SHORT = process.env.COMPANY_ADDRESS_SHORT || "1209 Mountain Road Pl NE, Ste R · Albuquerque, NM 87110";
export const BRAND_NAME = "Exentax";
export const SITE_URL = process.env.SITE_URL || "https://exentax.com";
export const DOMAIN = process.env.DOMAIN || "exentax.com";
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "hola@exentax.com";
export const LEGAL_EMAIL = process.env.LEGAL_EMAIL || "legal@exentax.com";
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "34614916910";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = process.env.INSTAGRAM_URL || "https://www.instagram.com/exentax.global/";
export const TIKTOK_URL = process.env.TIKTOK_URL || "https://www.tiktok.com/@exentax";
export const YOUTUBE_URL = process.env.YOUTUBE_URL || "https://youtube.com/@exentax";
export const FACEBOOK_URL = process.env.FACEBOOK_URL || "https://www.facebook.com/share/1Auhteo8Ad/?mibextid=wwXIfr";
export const LINKEDIN_URL = process.env.LINKEDIN_URL || "https://www.linkedin.com/company/exentax";
export const DEFAULT_TIMEZONE = MADRID_TZ;
export const DATE_LOCALE_ISO = SHARED_DATE_LOCALE_ISO;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "arnau@exentax.com";

export const nowMadrid = sharedNowMadrid;
export const todayMadridISO = sharedTodayMadridISO;
