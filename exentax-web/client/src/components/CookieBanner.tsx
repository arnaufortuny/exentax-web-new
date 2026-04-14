import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { STORAGE_KEYS } from "@/lib/constants";
import { CookieIcon } from "@/components/icons";
import { LanguageService } from "@/i18n";
const CONSENT_KEY = STORAGE_KEYS.COOKIE_CONSENT;

export type CookieConsent = "all" | "essential" | null;

export function getCookieConsent(): CookieConsent {
  const val = localStorage.getItem(CONSENT_KEY);
  if (val === "all" || val === "essential") return val;
  return null;
}

function setCookieConsent(value: "all" | "essential") {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}

export function clearCookieConsent() {
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: null }));
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${
        checked ? "bg-[#00E510]" : "bg-[var(--muted)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[var(--bg-0)] shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [cookieDocVersion, setCookieDocVersion] = useState("1.0");

  useEffect(() => {
    if (getCookieConsent() === null) {
      setVisible(true);
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setVisible(detail === null);
      if (detail === null) setShowDetails(false);
    };
    window.addEventListener("cookie-consent-change", handler);

    fetch("/api/legal/versions").then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }).then(data => {
      if (data?.versions?.cookies?.version) setCookieDocVersion(data.versions.cookies.version);
    }).catch((e) => console.error("[cookie-banner] legal versions fetch failed", e));

    return () => window.removeEventListener("cookie-consent-change", handler);
  }, []);

  if (!visible) return null;

  const logConsent = (tipo: string, accepted: boolean) => {
    const payload: Record<string, unknown> = {
      tipo,
      version: cookieDocVersion,
      aceptado: accepted,
      idioma: LanguageService.getCurrent(),
      referrer: window.location.pathname,
    };
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((e) => console.error("[cookie-banner] consent log failed", e));
  };

  const accept = (choice: "all" | "essential") => {
    setCookieConsent(choice);
    logConsent("cookies_esenciales", true);
    logConsent("cookies_analiticas", choice === "all");
    setVisible(false);
  };

  const handleSavePreferences = () => {
    const choice = analyticsEnabled ? "all" : "essential";
    setCookieConsent(choice);
    logConsent("cookies_esenciales", true);
    logConsent("cookies_analiticas", analyticsEnabled);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-5" style={{ pointerEvents: "none", zIndex: 70 }}>
      <div
        className="max-w-xl mx-auto rounded-3xl border border-[var(--border)] overflow-hidden"
        style={{ pointerEvents: "auto", background: "var(--glass-bg)", backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", animation: "cookieSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <CookieIcon className="w-[22px] h-[22px] flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-body font-semibold text-sm sm:text-base text-[var(--text-1)] mb-1.5">{t("cookie.title")}</h4>
              <p className="text-[var(--text-2)] text-sm leading-relaxed mb-2">{t("cookie.desc")}</p>
              <p className="text-[var(--text-2)] text-sm leading-relaxed">
                {t("cookie.desc2")}{" "}
                <Link href="/legal/cookies" className="text-[#00E510] hover:underline font-medium">
                  {t("cookie.policyLink")}
                </Link>
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--bg-1)] p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[var(--text-1)]">{t("cookie.essential")}</p>
                  <p className="text-[10px] text-[var(--text-3)]">{t("cookie.essentialDesc")}</p>
                </div>
                <span className="text-[10px] font-semibold text-[#00E510] bg-[#00E510]/10 px-2 py-0.5 rounded-full">{t("cookie.alwaysActive")}</span>
              </div>
              <div className="h-px bg-[var(--border)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[var(--text-1)]">{t("cookie.analytics")}</p>
                  <p className="text-[10px] text-[var(--text-3)]">{t("cookie.analyticsDesc")}</p>
                </div>
                <Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} label={t("cookie.analytics")} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-2">
            <button
              onClick={() => accept("all")}
              className="flex-1 bg-[#00E510] text-[#0F1A14] font-body font-semibold text-sm sm:text-xs rounded-full px-6 py-3 sm:py-2.5 hover:bg-[#00E510] active:scale-[0.97] transition-[color,background-color,border-color,opacity] duration-200 cursor-pointer"
              data-testid="cookie-accept-all"
            >
              {t("cookie.acceptAll")}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => accept("essential")}
                className="flex-1 border border-[var(--border)] hover:border-[#00E510]/40 text-[var(--text-2)] hover:text-[var(--text-1)] font-body font-medium text-sm sm:text-xs rounded-full px-6 py-3 sm:py-2.5 transition-[color,background-color,border-color,opacity] duration-200 cursor-pointer"
                data-testid="cookie-essential-only"
              >
                {t("cookie.essentialOnly")}
              </button>
              {!showDetails ? (
                <button
                  onClick={() => setShowDetails(true)}
                  className="text-[var(--text-3)] hover:text-[#00E510] font-body font-medium text-sm sm:text-xs rounded-full px-5 py-3 sm:py-2.5 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  data-testid="cookie-customize"
                >
                  {t("cookie.customize")}
                </button>
              ) : (
                <button
                  onClick={handleSavePreferences}
                  className="text-[#00E510] hover:text-[#2fc50f] font-body font-semibold text-sm sm:text-xs rounded-full px-5 py-3 sm:py-2.5 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  data-testid="cookie-save-preferences"
                >
                  {t("cookie.save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
