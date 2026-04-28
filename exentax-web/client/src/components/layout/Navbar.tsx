import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FlagImg from "@/components/FlagImg";
import { LANG_SHORT } from "@/lib/lang-utils";
import { SUPPORTED_LANGS, LANG_LABELS, LanguageService, type SupportedLang } from "@/i18n";
import { BRAND, CONTACT } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { getLangFromPath, getEquivalentPath, resolveRoute } from "@shared/routes";
import { trackWhatsAppClick } from "@/components/Tracking";
import { WhatsAppIcon } from "@/components/icons";

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
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border-[1.5px] border-black/8 rounded-full cursor-pointer leading-none font-body text-[11px] font-semibold text-[var(--text-2)]"
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
          className="absolute bottom-[calc(100%+8px)] right-0 bg-white border border-[var(--border)] rounded-[14px] shadow-[0_-8px_32px_rgba(0,0,0,0.10)] overflow-hidden z-[300] w-[160px]"
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
  how_we_work: () => import("@/pages/how-we-work"),
  our_services: () => import("@/pages/services"),
  faq: () => import("@/pages/faq-page"),
  book: () => import("@/pages/book"),
  about_llc: () => import("@/pages/about-llc"),
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

// WhatsAppIcon moved to @/components/icons. Navbar imports the shared
// component (see top of file) so there is a single SVG path of truth.

type ServicesSubKey = "our_services" | "service_llc_nm" | "service_llc_wy" | "service_llc_de" | "service_llc_fl" | "service_itin";

const SERVICES_SUB_KEYS: readonly ServicesSubKey[] = [
  "our_services",
  "service_llc_nm",
  "service_llc_wy",
  "service_llc_de",
  "service_llc_fl",
  "service_itin",
];

export default function Navbar({ hideBooking = false }: { hideBooking?: boolean } = {}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const lp = useLangPath();
  const resolved = resolveRoute(location);
  const currentRouteKey = resolved?.key || null;
  const isBlogActive = location.includes("/blog");
  const isServicesActive = currentRouteKey ? (SERVICES_SUB_KEYS as readonly string[]).includes(currentRouteKey) : false;

  const servicesSubItems = useMemo(() => [
    { key: "our_services" as const, label: t("nav.servicesOverview"), description: t("nav.servicesOverviewDesc"), href: lp("our_services") },
    { key: "service_llc_nm" as const, label: t("nav.servicesLlcNm"), description: t("nav.servicesLlcNmDesc"), href: lp("service_llc_nm") },
    { key: "service_llc_wy" as const, label: t("nav.servicesLlcWy"), description: t("nav.servicesLlcWyDesc"), href: lp("service_llc_wy") },
    { key: "service_llc_de" as const, label: t("nav.servicesLlcDe"), description: t("nav.servicesLlcDeDesc"), href: lp("service_llc_de") },
    { key: "service_llc_fl" as const, label: t("nav.servicesLlcFl"), description: t("nav.servicesLlcFlDesc"), href: lp("service_llc_fl") },
    { key: "service_itin" as const, label: t("nav.servicesItin"), description: t("nav.servicesItinDesc"), href: lp("service_itin") },
  ], [t, lp]);

  const navLinks = useMemo(() => [
    { label: t("nav.home"), labelXl: t("nav.homeXl"), href: lp("home"), routeKey: "home" as const, prefetchKey: "home" },
    { label: t("nav.howWeWork"), labelXl: t("nav.howWeWorkXl"), href: lp("how_we_work"), routeKey: "how_we_work" as const, prefetchKey: "how_we_work" },
    { label: t("nav.aboutLlc"), href: lp("about_llc"), routeKey: "about_llc" as const, prefetchKey: "about_llc" },
    { label: t("nav.faq"), labelXl: t("nav.faqXl"), href: lp("faq"), routeKey: "faq" as const, prefetchKey: "faq" },
    { label: t("nav.blog"), labelXl: t("nav.blogXl"), href: lp("/blog"), routeKey: null, prefetchKey: "blog" },
  ], [t, lp]);

  const mobileNavLinks = useMemo(() => [
    { label: t("nav.mobileHome"), href: lp("home"), routeKey: "home" as const, prefetchKey: "home" },
    { label: t("nav.howWeWorkXl"), href: lp("how_we_work"), routeKey: "how_we_work" as const, prefetchKey: "how_we_work" },
    { label: t("nav.aboutLlc"), href: lp("about_llc"), routeKey: "about_llc" as const, prefetchKey: "about_llc" },
    { label: t("nav.faqXl"), href: lp("faq"), routeKey: "faq" as const, prefetchKey: "faq" },
    { label: t("nav.blogXl"), href: lp("/blog"), routeKey: null, prefetchKey: "blog" },
  ], [t, lp]);

  useEffect(() => {
    if (!servicesOpen) return;
    function handleClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [servicesOpen]);

  useEffect(() => { setServicesOpen(false); setMobileServicesOpen(false); }, [location]);

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
            <img src="/logo-tight.png" alt={BRAND.NAME} width={600} height={110} fetchPriority="high" decoding="async" className="navbar-logo w-[120px] lg:w-[132px] xl:w-[130px] 2xl:w-[164px] h-auto object-contain block" data-testid="img-logo-navbar" />
          </Link>

          <nav className="hidden xl:flex items-center justify-center gap-0 xl:gap-0.5 2xl:gap-2 flex-1 min-w-0" aria-label={t("common.mainNavigation")} data-testid="nav-desktop">
            {navLinks.map((link, idx) => {
              const isActive = link.routeKey ? currentRouteKey === link.routeKey : isBlogActive;
              const linkEl = (
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
              if (link.routeKey === "how_we_work") {
                return (
                  <span key={link.href} className="contents">
                    {linkEl}
                    <div
                      ref={servicesRef}
                      className="relative"
                      onMouseEnter={() => { setServicesOpen(true); prefetchPage("our_services"); }}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={servicesOpen}
                        onClick={() => setServicesOpen((v) => !v)}
                        className={`inline-flex items-center gap-1 font-body font-semibold text-[13px] xl:text-[13px] 2xl:text-[15.5px] px-1.5 xl:px-2 2xl:px-3 py-2.5 relative transition-colors duration-200 whitespace-nowrap ${
                          isServicesActive
                            ? "text-[#00E510] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[rgba(0,229,16,0.35)]"
                            : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                        }`}
                        data-testid="nav-services-dropdown"
                      >
                        {t("nav.services")}
                        <svg width={11} height={11} viewBox="0 0 20 20" fill="none" className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true">
                          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[400px] transition-all duration-300 origin-top ${
                          servicesOpen ? "visible opacity-100 scale-100 translate-y-0 pointer-events-auto" : "invisible opacity-0 scale-95 -translate-y-1 pointer-events-none"
                        }`}
                      >
                        <div
                          role="menu"
                          aria-label={t("nav.services")}
                          className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.6)] ring-1 ring-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[28px] backdrop-saturate-[1.6] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18),_0_8px_24px_-4px_rgba(0,0,0,0.10),_inset_0_1px_0_rgba(255,255,255,0.8)]"
                          data-testid="dropdown-services"
                        >
                          {/* Specular sheen — top highlight */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-20"
                            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.0) 100%)" }}
                          />
                          {/* Subtle green tint at bottom */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                            style={{ background: "linear-gradient(0deg, rgba(0,229,16,0.04) 0%, rgba(0,229,16,0.0) 100%)" }}
                          />

                          {/* Items list */}
                          <ul className="relative py-2">
                            {servicesSubItems.map((s) => {
                              const itemActive = currentRouteKey === s.key;
                              return (
                                <li key={s.key}>
                                  <Link
                                    href={s.href}
                                    onMouseEnter={() => prefetchPage(s.key)}
                                    onClick={() => setServicesOpen(false)}
                                    className={`group relative flex items-start gap-3 px-5 py-3 transition-colors duration-200 ${
                                      itemActive
                                        ? "bg-[rgba(0,229,16,0.08)]"
                                        : "hover:bg-[rgba(0,229,16,0.05)]"
                                    }`}
                                    data-testid={`nav-services-${s.key}`}
                                    role="menuitem"
                                  >
                                    {/* Active left accent bar */}
                                    <span
                                      aria-hidden="true"
                                      className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-[#00E510] transition-opacity duration-200 ${
                                        itemActive ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {/* Bullet dot — green when active/hover */}
                                    <span
                                      aria-hidden="true"
                                      className={`mt-[7px] block h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${
                                        itemActive
                                          ? "bg-[#00C80E]"
                                          : "bg-[var(--text-3)] group-hover:bg-[#00C80E]"
                                      }`}
                                    />
                                    {/* Label + description */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <span
                                          className={`block font-body font-semibold text-[15px] leading-tight transition-colors duration-200 ${
                                            itemActive
                                              ? "text-[#00C80E]"
                                              : "text-[var(--text-1)] group-hover:text-[#00C80E]"
                                          }`}
                                        >
                                          {s.label}
                                        </span>
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          aria-hidden="true"
                                          className={`flex-shrink-0 text-[#00C80E] transition-all duration-200 ${
                                            itemActive
                                              ? "opacity-100 translate-x-0"
                                              : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                          }`}
                                        >
                                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                      <span className="block font-body text-[13px] text-[var(--text-2)] leading-snug mt-1">
                                        {s.description}
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </span>
                );
              }
              return linkEl;
            })}
          </nav>

          <div className="flex-1 xl:hidden" />

          <div className="hidden xl:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whatsappNav"))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("navbar")}
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
                className="inline-flex items-center gap-1.5 bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-black px-4 xl:px-5 2xl:px-7 py-2 xl:py-2.5 2xl:py-3 text-[12px] xl:text-[13px] 2xl:text-[15px] rounded-full shadow-[0_10px_30px_rgba(0,229,16,0.18)] transition-[color,background-color,border-color,opacity,transform] duration-200 active:scale-95 whitespace-nowrap"
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
                <span>{t("nav.bookConsultation")}</span>
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
          className={`xl:hidden absolute left-0 right-0 mt-2 bg-[rgba(255,255,255,0.55)] backdrop-blur-[18px] border border-[var(--glass-border)] rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300 origin-top ${
            menuOpen
              ? "visible opacity-100 scale-y-100 pointer-events-auto"
              : "invisible opacity-0 scale-y-95 pointer-events-none"
          }`}
          data-testid="mobile-menu"
        >
          <nav className="p-3">
            {mobileNavLinks.map((link) => {
              const active = link.routeKey ? currentRouteKey === link.routeKey : isBlogActive;
              const linkEl = (
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
              if (link.routeKey === "how_we_work") {
                return (
                  <span key={link.href} className="contents">
                    {linkEl}
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      aria-expanded={mobileServicesOpen}
                      aria-controls="mobile-services-submenu"
                      className={`flex items-center justify-between w-full text-left font-body font-semibold text-[16px] px-4 py-3.5 rounded-full transition-colors duration-200 ${
                        isServicesActive ? "text-[#00E510] bg-[rgba(0,229,16,0.06)]" : "text-[var(--text-1)] hover:bg-[var(--bg-1)]"
                      }`}
                      data-testid="mobile-nav-services-toggle"
                    >
                      <span>{t("nav.services")}</span>
                      <svg width={14} height={14} viewBox="0 0 20 20" fill="none" className={`text-[var(--muted)] flex-shrink-0 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}>
                        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {mobileServicesOpen && (
                      <ul id="mobile-services-submenu" className="pl-3 pb-1" data-testid="mobile-services-submenu">
                        {servicesSubItems.map((s) => {
                          const itemActive = currentRouteKey === s.key;
                          return (
                            <li key={s.key}>
                              <Link
                                href={s.href}
                                onClick={() => { setMobileServicesOpen(false); setMenuOpen(false); }}
                                className={`flex items-center justify-between w-full text-left font-body text-[15px] px-4 py-2.5 rounded-full transition-colors ${
                                  itemActive ? "text-[#00E510] bg-[rgba(0,229,16,0.06)] font-semibold" : "text-[var(--text-1)] hover:bg-[var(--bg-1)] font-medium"
                                }`}
                                data-testid={`mobile-nav-${s.key}`}
                              >
                                <span>{s.label}</span>
                                <svg width={12} height={12} viewBox="0 0 20 20" fill="none" className="text-[var(--muted)] flex-shrink-0">
                                  <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </span>
                );
              }
              return linkEl;
            })}
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whatsappNav"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full text-left font-body font-semibold text-[16px] px-4 py-3.5 rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200 text-[var(--text-1)] hover:bg-[var(--bg-1)]"
              onClick={() => { trackWhatsAppClick("navbar_mobile"); setMenuOpen(false); }}
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
              <span className="font-heading text-[13px] text-[var(--text-2)] flex-shrink-0" style={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em" }}>{t("nav.language")}</span>
              <MobileInlineLangSwitcher onClose={() => setMenuOpen(false)} />
            </div>
            {!hideBooking && (
              <Link
                href={lp("book")}
                onMouseEnter={() => prefetchPage("book")}
                className="flex items-center justify-center gap-2 w-full bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-medium px-7 py-3.5 text-[15px] rounded-full shadow-[0_10px_30px_rgba(0,229,16,0.18)] transition-[color,background-color,border-color,opacity,transform] duration-200 active:scale-[0.98]"
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
