import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";
import { getLocalizedPath, type RouteKey, ROUTE_SLUGS } from "@/lib/routes";

export { getLangFromPath } from "@/lib/routes";

function useCurrentLang(): SupportedLang {
  const { i18n } = useTranslation();
  const raw = (i18n.language || "es").split("-")[0] as SupportedLang;
  return SUPPORTED_LANGS.includes(raw) ? raw : "es";
}

export function useLangPath() {
  const lang = useCurrentLang();
  return useCallback(
    (keyOrPath: RouteKey | string) => {
      if (keyOrPath in ROUTE_SLUGS) {
        return getLocalizedPath(keyOrPath as RouteKey, lang);
      }
      if (keyOrPath === "/blog" || keyOrPath.startsWith("/blog/")) {
        return `/${lang}${keyOrPath}`;
      }
      return keyOrPath;
    },
    [lang],
  );
}

export function useCurrentRouteLang(): SupportedLang {
  return useCurrentLang();
}
