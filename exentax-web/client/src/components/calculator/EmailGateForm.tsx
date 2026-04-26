import { useTranslation } from "react-i18next";
import PhoneInput from "@/components/PhoneInput";
import { useLangPath } from "@/hooks/useLangPath";

interface EmailGateFormProps {
  compact: boolean;
  email: string;
  phone: string;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  errors: { email?: string; phone?: string; privacy?: string };
  sending: boolean;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setPrivacyAccepted: (v: boolean) => void;
  setMarketingAccepted: (v: boolean) => void;
  setErrors: React.Dispatch<React.SetStateAction<{ email?: string; phone?: string; privacy?: string }>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function EmailGateForm({
  compact, email, phone, privacyAccepted, marketingAccepted,
  errors, sending, setEmail, setPhone, setPrivacyAccepted, setMarketingAccepted,
  setErrors, handleSubmit,
}: EmailGateFormProps) {
  const { t } = useTranslation();
  const lp = useLangPath();

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{ animation: "fadeSlideIn 0.5s ease-out" }}
    >
      <p className={`font-semibold text-[var(--text-1)] text-center ${compact ? "text-xs mb-1.5" : "text-sm sm:text-base mb-3"}`}>
        {t("calculator.enterData")}
      </p>
      <form onSubmit={handleSubmit} className={`flex flex-col ${compact ? "gap-1.5" : "gap-2.5"}`} data-testid="form-email-gate">
        <div className={`flex flex-col sm:flex-row ${compact ? "gap-1.5" : "gap-2.5"}`}>
          <div className="flex-1 flex flex-col gap-0.5">
            <label htmlFor="email-gate-input" className="sr-only">
              {t("calculator.emailPlaceholder")}
            </label>
            <input
              id="email-gate-input"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-gate-error" : undefined}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              placeholder={t("calculator.emailPlaceholder")}
              className={`w-full rounded-full px-4 bg-[var(--bg-1)] border focus:outline-none transition-colors placeholder:text-[var(--text-3)] text-[var(--text-1)] ${compact ? "py-2.5 text-xs" : "py-3 text-sm"} ${
                errors.email ? "border-[var(--error)] focus:border-[var(--error)]" : "border-[var(--border)] focus:border-[var(--green)]"
              }`}
              data-testid="input-email-gate"
            />
            {errors.email && (
              <p id="email-gate-error" role="alert" className="text-[10px] text-[var(--error)] pl-3" data-testid="text-email-error">{errors.email}</p>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <label htmlFor="phone-gate-input" className="sr-only">
              {t("calculator.phonePlaceholder")}
            </label>
            <PhoneInput
              id="phone-gate-input"
              aria-label={t("calculator.phonePlaceholder")}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-gate-error" : undefined}
              value={phone}
              onChange={(v) => { setPhone(v); setErrors(prev => ({ ...prev, phone: undefined })); }}
              placeholder={t("calculator.phonePlaceholder")}
              error={!!errors.phone}
              compact={compact}
              data-testid="input-phone-gate"
            />
            {errors.phone && (
              <p id="phone-gate-error" role="alert" className="text-[10px] text-[var(--error)] pl-3" data-testid="text-phone-error">{errors.phone}</p>
            )}
          </div>
        </div>
        <div className={`flex flex-col ${compact ? "gap-1" : "gap-2"}`}>
          <label
            className={`flex items-start gap-2 cursor-pointer rounded-xl border transition-[color,background-color,border-color,opacity,transform] duration-200 ${compact ? "px-2.5 py-1.5" : "px-4 py-3"} ${
              privacyAccepted
                ? "border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                : errors.privacy
                ? "border-[var(--error)]/50 bg-[rgba(220,38,38,0.06)]"
                : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[rgba(var(--green-rgb),0.25)]"
            }`}
          >
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => { setPrivacyAccepted(e.target.checked); setErrors(prev => ({ ...prev, privacy: undefined })); }}
              className="sr-only"
              data-testid="checkbox-privacy"
            />
            <span className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-[color,background-color,border-color,opacity,transform] duration-200 ${
              privacyAccepted ? "bg-[var(--green)] border-[var(--green)]" : errors.privacy ? "border-[var(--error)]" : "border-[var(--border)] bg-transparent"
            }`}>
              {privacyAccepted && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="#0B0D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className={`text-[var(--text-3)] leading-relaxed ${compact ? "text-[10px]" : "text-xs"}`}>
              {t("calculator.privacyText1")}{" "}
              <a href={lp("legal_privacy")} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[var(--green)] underline hover:text-[rgba(var(--green-rgb),0.8)]">{t("calculator.privacyPolicy")}</a>
              {" "}{t("calculator.privacyText2")} <a href={lp("legal_terms")} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[var(--green)] underline hover:text-[rgba(var(--green-rgb),0.8)]">{t("calculator.termsConditions")}</a>.{" "}
              <span className="text-[rgba(var(--green-rgb),0.7)]">*</span>
            </span>
          </label>
          {errors.privacy && (
            <p className="text-xs text-[var(--error)] pl-1 flex items-center gap-1.5" data-testid="text-privacy-error">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M6 4v2.5M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              {errors.privacy}
            </p>
          )}
          <label
            className={`flex items-start gap-2 cursor-pointer rounded-xl border transition-[color,background-color,border-color,opacity,transform] duration-200 ${compact ? "px-2.5 py-1.5" : "px-4 py-3"} ${
              marketingAccepted
                ? "border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[rgba(var(--green-rgb),0.25)]"
            }`}
          >
            <input
              type="checkbox"
              checked={marketingAccepted}
              onChange={(e) => setMarketingAccepted(e.target.checked)}
              className="sr-only"
              data-testid="checkbox-marketing"
            />
            <span className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-[color,background-color,border-color,opacity,transform] duration-200 ${
              marketingAccepted ? "bg-[var(--green)] border-[var(--green)]" : "border-[var(--border)] bg-transparent"
            }`}>
              {marketingAccepted && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="#0B0D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className={`text-[var(--text-3)] leading-relaxed ${compact ? "text-[10px]" : "text-xs"}`}>
              {t("calculator.marketingText")}{" "}
              <span className="text-[var(--text-3)]/60">{t("calculator.optional")}</span>
            </span>
          </label>
        </div>
        <button
          type="submit"
          disabled={sending}
          className={`w-full btn-primary px-6 rounded-full disabled:opacity-70 disabled:cursor-not-allowed ${compact ? "py-3 text-sm" : "py-3.5 text-sm"}`}
          data-testid="button-submit-email"
        >
          {sending ? t("calculator.calculating") : t("calculator.seeMyEstimate")}
        </button>
      </form>
    </div>
  );
}
