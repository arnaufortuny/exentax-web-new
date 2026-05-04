import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es";
import { STORAGE_KEYS } from "@/lib/constants";
import { readLangCookie, writeLangCookie } from "@/lib/lang-cookie";

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
  // 1. Cookie (1-year TTL, survives localStorage clears, readable server-side)
  const cookieLang = readLangCookie() as SupportedLang | null;
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) {
    // Refresh cookie expiry on every visit so the year resets while the user keeps returning.
    writeLangCookie(cookieLang);
    return cookieLang;
  }

  // 2. localStorage (legacy, kept for backward compatibility with users who set
  //    a preference before the cookie was introduced).
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG) as SupportedLang | null;
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      // Migrate to cookie so future visits use the canonical mechanism.
      writeLangCookie(saved);
      return saved;
    }
  } catch {
    /* localStorage may be blocked; fall through to browser detection */
  }

  // 3. Browser language fallback.
  const browserLang = (typeof navigator !== "undefined" ? navigator.language : "en")
    .split("-")[0] as SupportedLang;
  if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

  return "en";
}

const detectedLang = detectLanguage();

// Best-effort report of a missing key to the server. Throttled to one
// report per (lang,key) per page load so a missing key in a tight render
// loop does not flood `/api/client-errors`.
const reportedMissing = new Set<string>();
function reportMissingKey(lang: string, key: string) {
  const sig = `${lang}:${key}`;
  if (reportedMissing.has(sig)) return;
  reportedMissing.add(sig);
  try {
    void fetch("/api/client-errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "i18n-miss",
        message: `i18n missing key: ${key} (lang=${lang})`,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "",
      }),
      // Fire-and-forget; the rate-limiter on the server side returns 429
      // gracefully and we deliberately do not retry.
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* noop — never let a missing-key report break rendering */
  }
}

// Direct ES-bundle lookup used as emergency fallback when i18next's
// own chain misses (defended-in-depth). Returns undefined for non-string leaves.
export function lookupEsEmergency(key: string): string | undefined {
  const parts = key.split(".");
  let cur: unknown = es;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

// Last-resort cosmetic rendering of the final dotted segment. Guarantees
// the raw developer key never reaches the user.
export function humaniseKey(key: string): string {
  const last = key.split(".").pop() ?? key;
  const spaced = last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!spaced) return "";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// ---------------------------------------------------------------------------
// Lazy locale loading
// ---------------------------------------------------------------------------
// Only Spanish is bundled into the main entry (it is required by the emergency
// fallback `lookupEsEmergency` and is the canonical source of truth for keys).
// All other locales are split into their own chunks and loaded on demand —
// either at boot for the detected language, or when the user switches via
// LanguageService. This keeps the initial JS payload ~250 KB lighter for
// non-Spanish visitors and ~300 KB lighter for Spanish visitors.
type NonEsLang = Exclude<SupportedLang, "es">;

const localeLoaders: Record<NonEsLang, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("./locales/en"),
  fr: () => import("./locales/fr"),
  de: () => import("./locales/de"),
  pt: () => import("./locales/pt"),
  ca: () => import("./locales/ca"),
};

const loadedLocales = new Set<SupportedLang>(["es"]);
const inflightLoads = new Map<SupportedLang, Promise<void>>();

export function isLocaleLoaded(lang: SupportedLang): boolean {
  return loadedLocales.has(lang);
}

export async function loadLocale(lang: SupportedLang): Promise<void> {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  if (loadedLocales.has(lang)) return;
  const existing = inflightLoads.get(lang);
  if (existing) return existing;
  const loader = localeLoaders[lang as NonEsLang];
  if (!loader) return;
  // Failures propagate to the caller so LanguageService.change() can react
  // (e.g. show a toast or revert the UI). The boot-time consumer
  // `i18nReady` catches and degrades to ES explicitly below.
  const p = loader()
    .then((mod) => {
      i18n.addResourceBundle(lang, "translation", mod.default, true, true);
      loadedLocales.add(lang);
    })
    .finally(() => {
      inflightLoads.delete(lang);
    });
  inflightLoads.set(lang, p);
  return p;
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
  },
  // Boot in Spanish so the synchronous render has something to translate
  // against. `i18nReady` (below) immediately switches to the detected
  // language once its chunk has loaded.
  lng: "es",
  fallbackLng: {
    ca: ["es", "en"],
    pt: ["es", "en"],
    fr: ["en", "es"],
    de: ["en", "es"],
    es: ["en"],
    default: ["en"],
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  // Fired only when the requested key is missing from the active locale
  // AND from every fallback locale. We log it so it shows up in dev
  // tools and in production logs, then degrade gracefully in this
  // priority order:
  //   1. ES emergency value (defended-in-depth lookup of the ES bundle
  //      directly — covers cases where i18next's own fallback chain
  //      misses, e.g. dynamic keys constructed from stale source).
  //   2. Humanised last segment (e.g. `cookie.policyLink` → `Policy
  //      link`) — guarantees the user never sees the raw dotted path.
  parseMissingKeyHandler: (key) => {
    const lang = i18n.language || "unknown";
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing key for "${lang}": ${key}`);
    } else {
      reportMissingKey(lang, key);
    }
    return lookupEsEmergency(key) ?? humaniseKey(key);
  },
});

// Resolves once the detected language is loaded and active. `main.tsx`
// awaits this before mounting React so the first paint renders in the
// correct language (no ES → detected flash for non-Spanish visitors).
// If the chunk fails to load (network / 404 after a deploy with stale
// hashes) we degrade to Spanish so the app still mounts.
// Sync `<html lang>` once at boot so screen readers see the correct locale
// before LanguageService.change() is ever called (WCAG 3.1.1).
const LOCALE_TAG_AT_BOOT: Record<SupportedLang, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR",
  de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("lang", LOCALE_TAG_AT_BOOT[detectedLang]);
}

export const i18nReady: Promise<void> =
  detectedLang === "es"
    ? Promise.resolve()
    : loadLocale(detectedLang)
        .then(() => i18n.changeLanguage(detectedLang).then(() => undefined))
        .catch((err) => {
          console.error(
            `[i18n] Failed to load detected locale "${detectedLang}", falling back to ES`,
            err,
          );
        });

export { LanguageService } from "./language-service";
export type { TranslationKey } from "./keys.generated";

export default i18n;
