import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useScrolled } from "@/hooks/useScrolled";
import { useLocation } from "wouter";
import { useLangPath } from "@/hooks/useLangPath";

export default function FloatingMobileCTA() {
  const { t } = useTranslation();
  const scrolled = useScrolled(300);
  const [nearBottom, setNearBottom] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const pageHeightRef = useRef(0);
  const lp = useLangPath();
  const rafRef = useRef(0);

  useEffect(() => {
    const handler = (e: Event) => setMobileMenuOpen((e as CustomEvent).detail);
    window.addEventListener("mobile-menu-toggle", handler);
    return () => window.removeEventListener("mobile-menu-toggle", handler);
  }, []);

  useEffect(() => {
    pageHeightRef.current = document.documentElement.scrollHeight;

    const vv = window.visualViewport;
    function check() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const vh = vv ? vv.height : window.innerHeight;
        const scrollBottom = window.scrollY + vh;
        setNearBottom(scrollBottom >= pageHeightRef.current - 160);
      });
    }
    function onResize() {
      pageHeightRef.current = document.documentElement.scrollHeight;
      check();
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    if (vv) vv.addEventListener("resize", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", onResize);
      if (vv) vv.removeEventListener("resize", check);
      cancelAnimationFrame(rafRef.current);
    };
  }, [location]);

  const bookPath = lp("book");
  if (location === bookPath) return null;

  const visible = scrolled && !nearBottom && !mobileMenuOpen;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-[opacity,transform] duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-[var(--bg-0)] border-t border-[var(--border)] px-4 pt-3" style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom, 6px))" }}>
        <Link
          href={lp("book")}
          className="flex items-center justify-center gap-2 w-full bg-[#00E510] hover:bg-[#00E510] active:scale-[0.97] text-[#0F1A14] font-heading font-bold text-base rounded-full py-3.5 shadow-[var(--shadow-green)] transition-[color,background-color,border-color,opacity,transform] duration-200"
          data-testid="button-floating-cta"
        >
          {t("floatingCta.text")}
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
