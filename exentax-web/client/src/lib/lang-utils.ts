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

  pt: "pt-BR",
  ca: "ca-ES",
  es: "es-ES",
};

export function resolveLocale(lang: string): string {
  const base = lang.split("-")[0].split("_")[0].toLowerCase();
  return LOCALE_MAP[base] || "es-ES";
}

const currencyFormatters = new Map<string, Intl.NumberFormat>();
export function fmtCurrency(value: number, currency = "EUR", locale?: string): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const safeCurrency = (currency || "EUR").toUpperCase().trim() || "EUR";
  const resolved = resolveLocale(locale || "es");
  const key = `${resolved}:${safeCurrency}`;
  let f = currencyFormatters.get(key);
  if (!f) {
    try {
      f = new Intl.NumberFormat(resolved, { style: "currency", currency: safeCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
      currencyFormatters.set(key, f);
    } catch {
      return `${safeValue.toFixed(2)} ${safeCurrency}`;
    }
  }
  return f.format(safeValue);
}
