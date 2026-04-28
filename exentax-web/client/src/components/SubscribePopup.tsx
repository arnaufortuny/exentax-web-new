import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import { apiRequest } from "@/lib/queryClient";
import { LanguageService } from "@/i18n";
import { clientLogger } from "@/lib/clientLogger";

const STORAGE_KEY = "exentax_subscribe_popup_dismissed_v1";
const SCROLL_TRIGGER_PCT = 0.5;
const TIME_TRIGGER_MS = 50_000;

function isDismissed(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function SubscribePopup() {
  const { t } = useTranslation();
  const lp = useLangPath();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; privacy?: string }>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sendError, setSendError] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    markDismissed();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDismissed()) return;

    let triggered = false;
    const trigger = () => {
      if (triggered || isDismissed()) return;
      triggered = true;
      setOpen(true);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = window.scrollY / scrollable;
      if (pct >= SCROLL_TRIGGER_PCT) trigger();
    };

    const timer = window.setTimeout(trigger, TIME_TRIGGER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { email?: string; privacy?: string } = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t("popup.errorEmail", { defaultValue: t("calculator.emailError") });
    }
    if (!accepted) {
      next.privacy = t("popup.errorPrivacy", { defaultValue: t("calculator.privacyError") });
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setSendError(false);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", {
        email: email.trim(),
        source: "guide_popup",
        privacyAccepted: true,
        marketingAccepted: true,
        language: LanguageService.getCurrent(),
      });
      setSuccess(true);
      markDismissed();
    } catch (err) {
      clientLogger.warn("[SubscribePopup] subscribe error", err);
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-popup-title"
      data-testid="subscribe-popup"
    >
      <button
        type="button"
        aria-label={t("popup.close", { defaultValue: "Cerrar" })}
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        data-testid="button-popup-backdrop"
      />
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.4)] overflow-hidden"
        style={{ animation: "fadeSlideIn 0.35s ease-out" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("popup.close", { defaultValue: "Cerrar" })}
          className="absolute top-3 right-3 z-10 w-9 h-9 inline-flex items-center justify-center rounded-full text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-black/[0.05] transition-colors"
          data-testid="button-popup-close"
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7 sm:p-8">
          {success ? (
            <div className="text-center" data-testid="popup-success">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[rgba(0,229,16,0.12)] flex items-center justify-center">
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#00B67A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-xl mb-2 text-[var(--text-1)]">
                {t("popup.successTitle", { defaultValue: "¡Listo!" })}
              </h2>
              <p className="text-sm text-[var(--text-2)] mb-5">
                {t("popup.successBody", { defaultValue: "Revisa tu email en los próximos minutos." })}
              </p>
              <button
                type="button"
                onClick={close}
                className="btn-primary px-6 py-2.5 text-sm rounded-full"
                data-testid="button-popup-success-close"
              >
                {t("popup.successCta", { defaultValue: "Cerrar" })}
              </button>
            </div>
          ) : (
            <>
              <h2
                id="subscribe-popup-title"
                className="font-heading text-[22px] sm:text-[24px] leading-tight text-[var(--text-1)] mb-2"
                data-testid="text-popup-title"
              >
                {t("popup.title")}
              </h2>
              <p className="text-sm text-[var(--text-2)] mb-5">
                {t("popup.subtitle")}
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" data-testid="form-popup">
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="popup-email" className="sr-only">
                    {t("popup.emailPlaceholder")}
                  </label>
                  <input
                    id="popup-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={!!errors.email}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                    placeholder={t("popup.emailPlaceholder")}
                    className="w-full px-4 py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 transition-colors placeholder:text-[var(--text-3)] text-[var(--text-1)]"
                    data-testid="input-popup-email"
                  />
                  {errors.email && (
                    <p role="alert" className="text-[10px] text-[var(--error)] pl-3" data-testid="text-popup-email-error">{errors.email}</p>
                  )}
                </div>

                <label
                  className={`flex items-start gap-2 cursor-pointer rounded-xl border transition-colors px-3 py-2.5 ${
                    accepted
                      ? "border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                      : errors.privacy
                      ? "border-[var(--error)]/50 bg-[rgba(220,38,38,0.06)]"
                      : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[rgba(var(--green-rgb),0.25)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => { setAccepted(e.target.checked); setErrors(prev => ({ ...prev, privacy: undefined })); }}
                    className="sr-only"
                    data-testid="checkbox-popup-privacy"
                  />
                  <span className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                    accepted ? "bg-[var(--green)] border-[var(--green)]" : errors.privacy ? "border-[var(--error)]" : "border-[var(--border)] bg-transparent"
                  }`}>
                    {accepted && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#0B0D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[var(--text-3)] leading-relaxed">
                    {t("popup.consent1")}{" "}
                    <a
                      href={lp("legal_terms")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[var(--green)] underline hover:text-[rgba(var(--green-rgb),0.8)]"
                    >
                      {t("popup.termsConditions")}
                    </a>
                    {" "}{t("popup.consent2")}
                  </span>
                </label>
                {errors.privacy && (
                  <p className="text-xs text-[var(--error)] pl-1" data-testid="text-popup-privacy-error">{errors.privacy}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full btn-primary px-6 py-3 text-sm rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
                  data-testid="button-popup-submit"
                >
                  {sending ? t("popup.sending", { defaultValue: "..." }) : t("popup.cta")}
                </button>

                {sendError && (
                  <p className="text-xs text-[var(--error)] text-center" data-testid="text-popup-send-error">
                    {t("popup.errorMessage", { defaultValue: t("calculator.sendError") })}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
