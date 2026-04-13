export const SUPPORTED_LANGS: readonly string[] = ["es", "en", "fr", "de", "pt", "ca"];
export type SupportedLang = "es" | "en" | "fr" | "de" | "pt" | "ca";

export const AGENDA_STATUSES = {
  PENDIENTE: "Pendiente",
  CONTACTADO: "Contactado",
  EN_PROCESO: "En proceso",
  CERRADO: "Cerrado",
  CANCELADA: "Cancelada",
  REAGENDADA: "Reagendada",
  NO_PRESENTADO: "No presentado",
} as const;

export const AGENDA_STATUS_VALUES = Object.values(AGENDA_STATUSES) as unknown as readonly [string, ...string[]];

export function isCancelledStatus(status: string | null | undefined): boolean {
  return status === AGENDA_STATUSES.CANCELADA || status === "Cancelado";
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
export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "34614916910";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const TRUSTPILOT_URL = process.env.TRUSTPILOT_URL || "https://es.trustpilot.com/review/exentax.com";
export const INSTAGRAM_URL = process.env.INSTAGRAM_URL || "https://www.instagram.com/exentax.global/";
export const TIKTOK_URL = process.env.TIKTOK_URL || "https://www.tiktok.com/@exentax";
export const YOUTUBE_URL = process.env.YOUTUBE_URL || "https://youtube.com/@exentax";
export const FACEBOOK_URL = process.env.FACEBOOK_URL || "https://www.facebook.com/share/1Auhteo8Ad/?mibextid=wwXIfr";
export const DEFAULT_TIMEZONE = "Europe/Madrid";
export const DATE_LOCALE_ISO = "en-CA";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "arnau@exentax.com";

export function nowMadrid(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: DEFAULT_TIMEZONE }));
}

export function todayMadridISO(): string {
  return new Date().toLocaleDateString(DATE_LOCALE_ISO, { timeZone: DEFAULT_TIMEZONE });
}
