import i18n from "i18next";
import { SUPPORTED_LANGS, type SupportedLang, loadLocale } from "./index";
import { STORAGE_KEYS } from "@/lib/constants";
import { writeLangCookie, readLangCookie } from "@/lib/lang-cookie";

function normalizeLang(raw: string): SupportedLang {
  const code = raw.split("-")[0].toLowerCase();
  return SUPPORTED_LANGS.includes(code as SupportedLang) ? (code as SupportedLang) : "es";
}

export const LanguageService = {
  getCurrent(): SupportedLang {
    return normalizeLang(i18n.language || "es");
  },

  async change(lang: SupportedLang): Promise<void> {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    writeLangCookie(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {
      /* storage may be blocked; preference is best-effort */
    }
    await loadLocale(lang);
    await i18n.changeLanguage(lang);
  },

  async changeTransient(lang: SupportedLang): Promise<void> {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    await loadLocale(lang);
    await i18n.changeLanguage(lang);
  },

  getLocaleTag(): string {
    const lang = this.getCurrent();
    const map: Record<SupportedLang, string> = {
      es: "es-ES", en: "en-US", fr: "fr-FR",
      de: "de-DE", pt: "pt-PT", ca: "ca-ES",
    };
    return map[lang];
  },

  resolveForEntity(entityLang?: string | null): SupportedLang {
    if (entityLang) {
      const normalized = normalizeLang(entityLang);
      if (SUPPORTED_LANGS.includes(normalized)) return normalized;
    }
    return this.getCurrent();
  },

  getStoredPreference(): SupportedLang | null {
    const cookieLang = readLangCookie() as SupportedLang | null;
    if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as SupportedLang | null;
      return saved && SUPPORTED_LANGS.includes(saved) ? saved : null;
    } catch {
      return null;
    }
  },
} as const;
