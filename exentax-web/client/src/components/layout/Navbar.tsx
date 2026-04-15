import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FlagImg from "@/components/FlagImg";
import { LANG_SHORT } from "@/lib/lang-utils";
import { SUPPORTED_LANGS, LANG_LABELS, LanguageService, type SupportedLang } from "@/i18n";
import { BRAND, CONTACT } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { getLangFromPath, getEquivalentPath, resolveRoute } from "@/lib/routes";

function MobileInlineLangSwitcher({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();
  const current = LanguageService.getCurrent();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
    LanguageService.change(lang);
    setOpen(false);
    onClose();
    const newPath = getEquivalentPath(location, lang);
    setLocation(newPath, { replace: true });
  }, [location, setLocation, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        data-testid="mobile-lang-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("common.selectLanguage")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-transparent border-[1.5px] border-black/8 rounded-full cursor-pointer leading-none font-body text-[11px] font-semibold text-[var(--text-2)]"
      >
        <FlagImg lang={current} size={16} />
        <span>{LANG_SHORT[current]}</span>
        <svg width={8} height={8} viewBox="0 0 10 10" fill="none" className={`opacity-35 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("common.selectLanguage")}
          className="absolute bottom-[calc(100%+8px)] right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] shadow-[0_-8px_32px_rgba(0,0,0,0.10)] overflow-hidden z-[300] w-[160px]"
        >
          {SUPPORTED_LANGS.map((lang) => (
            <button
              key={lang}
              role="option"
              aria-selected={lang === current}
              data-testid={`mobile-lang-${lang}`}
              onClick={() => changeLang(lang)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 border-none cursor-pointer font-body text-[13px] text-left transition-colors duration-100 ${
                lang === current
                  ? "bg-[rgba(0,229,16,0.06)] font-bold text-[#00E510]"
                  : "bg-transparent font-medium text-[var(--text-1)] hover:bg-black/[0.03]"
              }`}
            >
              <FlagImg lang={lang} size={18} />
              <span className="truncate">{LANG_LABELS[lang]}</span>
              {lang === current && (
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" className="ml-auto flex-shrink-0">
                  <path d="M2 6l3 3 5-5" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const prefetchMap: Record<string, () => Promise<unknown>> = {
  home: () => import("@/pages/home"),
  how_we_work: () => import("@/pages/como-funciona"),
  our_services: () => import("@/pages/servicios"),
  faq: () => import("@/pages/faq-page"),
  book: () => import("@/pages/reservar"),
  about_llc: () => import("@/pages/llc-estados-unidos"),
  blog: () => import("@/pages/blog/index"),
};

const prefetched = new Set<string>();
const langPrefixRe = new RegExp(`^\\/(${SUPPORTED_LANGS.join("|")})`);

function prefetchPage(key: string) {
  if (prefetched.has(key)) return;
  prefetched.add(key);
  const loader = prefetchMap[key];
  if (loader) loader();
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Navbar({ hideBooking = false }: { hideBooking?: boolean } = {}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lp = useLangPath();
  const resolved = resolveRoute(location);
  const currentRouteKey = resolved?.key || null;
  const isBlogActive = location.includes("/blog");

  const navLinks = [
    { label: t("nav.home"), labelXl: t("nav.homeXl"), href: lp("home"), routeKey: "home" as const, prefetchKey: "home" },
    { label: t("nav.howWeWork"), labelXl: t("nav.howWeWorkXl"), href: lp("how_we_work"), routeKey: "how_we_work" as const, prefetchKey: "how_we_work" },
    { label: t("nav.services"), href: lp("our_services"), routeKey: "our_services" as const, prefetchKey: "our_services" },
    { label: t("nav.aboutLlc"), href: lp("about_llc"), routeKey: "about_llc" as const, prefetchKey: "about_llc" },
    { label: t("nav.faq"), labelXl: t("nav.faqXl"), href: lp("faq"), routeKey: "faq" as const, prefetchKey: "faq" },
    { label: t("nav.blog"), labelXl: t("nav.blogXl"), href: lp("/blog"), routeKey: null, prefetchKey: "blog" },
  ];

  const mobileNavLinks = [
    { label: t("nav.mobileHome"), href: lp("home"), routeKey: "home" as const, prefetchKey: "home" },
    { label: t("nav.howWeWorkXl"), href: lp("how_we_work"), routeKey: "how_we_work" as const, prefetchKey: "how_we_work" },
    { label: t("nav.services"), href: lp("our_services"), routeKey: "our_services" as const, prefetchKey: "our_services" },
    { label: t("nav.aboutLlc"), href: lp("about_llc"), routeKey: "about_llc" as const, prefetchKey: "about_llc" },
    { label: t("nav.faqXl"), href: lp("faq"), routeKey: "faq" as const, prefetchKey: "faq" },
    { label: t("nav.blogXl"), href: lp("/blog"), routeKey: null, prefetchKey: "blog" },
  ];

  const handleMenuToggle = useCallback(() => {
    setMenuOpen(prev => {
      const next = !prev;
      setTimeout(() => window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: next })), 0);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setTimeout(() => window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: false })), 0);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(prev => {
      if (prev) {
        setTimeout(() => window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: false })), 0);
      }
      return false;
    });
  }, [location]);

  return (
    <header className="fixed left-0 right-0 z-50 px-3 sm:px-5 lg:px-4 xl:px-5 2xl:px-6" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
      <div ref={dropdownRef} className="max-w-[1340px] mx-auto relative">
        <div className="navbar-glass h-[76px] xl:h-[88px] 2xl:h-[92px] bg-[var(--glass-bg)] backdrop-blur-[16px] border border-[var(--glass-border)] rounded-[22px] px-4 xl:px-5 2xl:px-10 flex items-center gap-2 xl:gap-2 2xl:gap-5 shadow-[var(--shadow)]">

          <Link href={lp("home")} data-testid="link-home" className="flex items-center justify-center flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00E510] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md mr-1 lg:mr-2 xl:mr-2 2xl:mr-4">
            <img src="/logo-tight.png" alt={BRAND.NAME} fetchPriority="high" decoding="async" className="navbar-logo w-[120px] lg:w-[132px] xl:w-[130px] 2xl:w-[164px] h-auto object-contain block" data-testid="img-logo-navbar" />
          </Link>

          <nav className="hidden xl:flex items-center justify-center gap-0 xl:gap-0.5 2xl:gap-2 flex-1 min-w-0 overflow-hidden" aria-label={t("common.mainNavigation")} data-testid="nav-desktop">
            {navLinks.map((link) => {
              const isActive = link.routeKey ? currentRouteKey === link.routeKey : isBlogActive;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => prefetchPage(link.prefetchKey)}
                  className={`font-body font-semibold text-[13px] xl:text-[13px] 2xl:text-[15.5px] px-1.5 xl:px-2 2xl:px-3 py-2.5 relative transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? "text-[#00E510] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[rgba(0,229,16,0.35)]"
                      : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                  }`}
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-").replace(/ó/g, "o")}`}
                >
                  {link.labelXl ? (
                    <>
                      <span className="2xl:hidden">{link.label}</span>
                      <span className="hidden 2xl:inline">{link.labelXl}</span>
                    </>
                  ) : link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 xl:hidden" />

          <div className="hidden xl:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whatsappNav"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[var(--border)] hover:border-[var(--text-3)] bg-[var(--bg-0)] text-[var(--text-1)] font-body font-semibold px-3 xl:px-3.5 2xl:px-6 py-2 xl:py-2.5 2xl:py-3 text-[12px] xl:text-[13px] 2xl:text-[15px] rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200"
              data-testid="button-whatsapp-nav"
            >
              <WhatsAppIcon size={15} />
              <span className="hidden 2xl:inline">{t("nav.whatsapp")}</span>
            </a>
            {!hideBooking && (
              <Link
                href={lp("book")}
                onMouseEnter={() => prefetchPage("book")}
                className="inline-flex items-center gap-1.5 bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-black px-4 xl:px-5 2xl:px-7 py-2 xl:py-2.5 2xl:py-3 text-[12px] xl:text-[13px] 2xl:text-[15px] rounded-full shadow-[0_10px_30px_rgba(0,229,16,0.18)] transition-[color,background-color,border-color,opacity,transform] duration-200 active:scale-95 whitespace-nowrap focus:ring-4 focus:ring-[rgba(0,229,16,0.22)]"
                data-testid="button-agendar-nav"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.2"/>
                  <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
                  <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  <circle cx="8" cy="14.5" r="1.2" fill="currentColor"/>
                  <circle cx="12" cy="14.5" r="1.2" fill="currentColor"/>
                  <circle cx="16" cy="14.5" r="1.2" fill="currentColor" opacity="0.5"/>
                  <circle cx="8" cy="18.5" r="1.2" fill="currentColor" opacity="0.5"/>
                </svg>
                <span className="2xl:hidden">{t("nav.freeConsultation")}</span>
                <span className="hidden 2xl:inline">{t("nav.freeConsultationXl")}</span>
              </Link>
            )}
          </div>

          <button
            className="xl:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] cursor-pointer transition-colors rounded-full hover:bg-black/5 flex-shrink-0"
            onClick={handleMenuToggle}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            data-testid="button-mobile-menu"
          >
            <span className={`w-5 h-[1.5px] bg-[var(--text-1)] rounded-full transition-[color,background-color,border-color,opacity,transform] duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-[var(--text-1)] rounded-full transition-[color,background-color,border-color,opacity,transform] duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-[var(--text-1)] rounded-full transition-[color,background-color,border-color,opacity,transform] duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>

        <div
          id="mobile-menu"
          role="menu"
          aria-label={t("nav.menuLabel")}
          style={{ zIndex: 300 }}
          className={`xl:hidden absolute left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300 origin-top ${
            menuOpen
              ? "visible opacity-100 scale-y-100 pointer-events-auto"
              : "invisible opacity-0 scale-y-95 pointer-events-none"
          }`}
          data-testid="mobile-menu"
        >
          <nav className="p-3">
            {mobileNavLinks.map((link) => {
              const active = link.routeKey ? currentRouteKey === link.routeKey : isBlogActive;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between w-full text-left font-body font-semibold text-[16px] px-4 py-3.5 rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200 ${
                    active
                      ? "text-[#00E510] bg-[rgba(0,229,16,0.06)]"
                      : "text-[var(--text-1)] hover:bg-[var(--bg-1)]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                  data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s/g, "-").replace(/ó/g, "o")}`}
                >
                  <span>{link.label}</span>
                  <svg width={14} height={14} viewBox="0 0 20 20" fill="none" className="text-[var(--muted)] flex-shrink-0">
                    <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              );
            })}
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whatsappNav"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full text-left font-body font-semibold text-[16px] px-4 py-3.5 rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200 text-[var(--text-1)] hover:bg-[var(--bg-1)]"
              onClick={() => setMenuOpen(false)}
              data-testid="mobile-nav-hablemos"
            >
              <span className="flex items-center gap-2.5">
                <WhatsAppIcon size={16} />
                {t("nav.talkWhatsapp")}
              </span>
              <svg width={14} height={14} viewBox="0 0 20 20" fill="none" className="text-[var(--muted)] flex-shrink-0">
                <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>
          <div className="px-3 pb-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 px-4 py-2">
              <span className="font-body text-[13px] text-[var(--text-2)] font-medium flex-shrink-0">{t("nav.language")}</span>
              <MobileInlineLangSwitcher onClose={() => setMenuOpen(false)} />
            </div>
            {!hideBooking && (
              <Link
                href={lp("book")}
                onMouseEnter={() => prefetchPage("book")}
                className="flex items-center justify-center gap-2 w-full bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-black px-7 py-3.5 text-[15px] rounded-full shadow-[0_10px_30px_rgba(0,229,16,0.18)] transition-[color,background-color,border-color,opacity,transform] duration-200 active:scale-[0.98]"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-nav-agendar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.2"/>
                  <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
                  <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  <circle cx="8" cy="14.5" r="1.2" fill="currentColor"/>
                  <circle cx="12" cy="14.5" r="1.2" fill="currentColor"/>
                  <circle cx="16" cy="14.5" r="1.2" fill="currentColor" opacity="0.5"/>
                  <circle cx="8" cy="18.5" r="1.2" fill="currentColor" opacity="0.5"/>
                </svg>
                {t("nav.bookConsultation")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
