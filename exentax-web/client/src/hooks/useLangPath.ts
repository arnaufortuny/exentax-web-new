import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";

function useCurrentLang(): SupportedLang {
  const { i18n } = useTranslation();
  const raw = (i18n.language || "es").split("-")[0] as SupportedLang;
  return SUPPORTED_LANGS.includes(raw) ? raw : "es";
}

export function useLangPath() {
  const lang = useCurrentLang();
  return useCallback(
    (path: string) => {
      if (path === "/blog" || path.startsWith("/blog/")) {
        return `/${lang}${path}`;
      }
      return path;
    },
    [lang],
  );
}

export function getLangFromPath(pathname: string): SupportedLang | null {
  const seg = pathname.split("/")[1] as SupportedLang;
  return seg && SUPPORTED_LANGS.includes(seg) ? seg : null;
}
