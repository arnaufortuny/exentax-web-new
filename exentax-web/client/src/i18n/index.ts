import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es";
import { STORAGE_KEYS } from "@/lib/constants";

export const SUPPORTED_LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_LABELS: Record<SupportedLang, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",

  pt: "Português",
  ca: "Català",
};

function detectLanguage(): SupportedLang {
  const saved = localStorage.getItem(STORAGE_KEYS.LANG) as SupportedLang | null;
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

  const browserLang = navigator.language.split("-")[0] as SupportedLang;
  if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

  return "es";
}

const langLoaders: Record<string, () => Promise<{ default: Record<string, any> }>> = {
  en: () => import("./locales/en"),
  fr: () => import("./locales/fr"),
  de: () => import("./locales/de"),

  pt: () => import("./locales/pt"),
  ca: () => import("./locales/ca"),
};

const detectedLang = detectLanguage();

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
  },
  lng: detectedLang,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

async function loadLanguage(lang: SupportedLang) {
  if (lang === "es" || i18n.hasResourceBundle(lang, "translation")) return;
  const loader = langLoaders[lang];
  if (!loader) return;
  try {
    const mod = await loader();
    i18n.addResourceBundle(lang, "translation", mod.default, true, true);
  } catch (err) {
    console.warn(`[i18n] Failed to load language bundle "${lang}", falling back to es`);
  }
}

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);

if (detectedLang !== "es") {
  loadLanguage(detectedLang).then(() => {
    if (i18n.hasResourceBundle(detectedLang, "translation")) {
      originalChangeLanguage(detectedLang);
    }
  });
}
i18n.changeLanguage = async (lng?: string, callback?: any) => {
  if (lng && SUPPORTED_LANGS.includes(lng as SupportedLang)) {
    await loadLanguage(lng as SupportedLang);
  }
  return originalChangeLanguage(lng, callback);
};

export { LanguageService } from "./language-service";
export type { TranslationKey } from "./keys.generated";

export default i18n;
