import type { SupportedLang } from "@/i18n";

export const FLAG_CODES: Record<SupportedLang, string> = {
  es: "es",
  en: "gb",
  fr: "fr",
  de: "de",

  pt: "pt",
  ca: "ad",
};

export const LANG_SHORT: Record<SupportedLang, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
  de: "DE",

  pt: "PT",
  ca: "CA",
};

const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",

  pt: "pt-PT",
  ca: "ca-ES",
  es: "es-ES",
};

export function resolveLocale(lang: string): string {
  const base = lang.split("-")[0].split("_")[0].toLowerCase();
  return LOCALE_MAP[base] || "es-ES";
}

