import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { SUPPORTED_LANGS, LANG_LABELS, LanguageService, type SupportedLang } from "@/i18n";
import { getEquivalentPath } from "@shared/routes";
import FlagImg from "@/components/FlagImg";
import { LANG_SHORT } from "@/lib/lang-utils";
import { trackLanguageSwitch } from "@/components/Tracking";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();
  const current = LanguageService.getCurrent();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const changeLang = useCallback((lang: SupportedLang) => {
    const previous = LanguageService.getCurrent();
    if (previous !== lang) {
      try { trackLanguageSwitch(previous, lang); } catch { /* tracking is best-effort */ }
    }
    LanguageService.change(lang);
    setOpen(false);
    const newPath = getEquivalentPath(location, lang);
    setLocation(newPath, { replace: true });
  }, [location, setLocation]);

  return (
    <div ref={ref} className="relative z-[100]">
      <button
        data-testid="button-lang-switcher"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("common.changeLanguage")}
        className="flex items-center gap-1.5 px-3 xl:px-3.5 py-3 xl:py-2.5 min-h-[44px] xl:min-h-0 bg-white border border-black/10 hover:border-black/20 rounded-full cursor-pointer transition-colors duration-150 font-body text-[12px] xl:text-[13px] 2xl:text-[14px] font-semibold text-[var(--text-2)] leading-none"
      >
        <FlagImg lang={current} size={17} />
        <span className="flex-shrink-0">{LANG_SHORT[current]}</span>
        <svg width={9} height={9} viewBox="0 0 10 10" fill="none" className={`opacity-35 transition-transform duration-150 flex-shrink-0 ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("common.selectLanguage")}
          className="absolute top-[calc(100%+8px)] right-0 bg-white border border-black/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-[9999] w-[170px]"
        >
          {SUPPORTED_LANGS.map((lang) => (
            <button
              key={lang}
              role="option"
              aria-selected={lang === current}
              data-testid={`button-lang-${lang}`}
              onClick={() => changeLang(lang)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 border-none cursor-pointer font-body text-[13px] text-left transition-colors duration-100 ${
                lang === current
                  ? "bg-[rgba(0,229,16,0.06)] font-bold text-[var(--green)]"
                  : "bg-white font-medium text-[#1A1A1A] hover:bg-black/[0.03]"
              }`}
            >
              <FlagImg lang={lang} size={18} />
              <span className="truncate">{LANG_LABELS[lang]}</span>
              {lang === current && (
                <svg width={10} height={10} viewBox="0 0 12 12" fill="none" className="ml-auto flex-shrink-0 text-[var(--green)]">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
