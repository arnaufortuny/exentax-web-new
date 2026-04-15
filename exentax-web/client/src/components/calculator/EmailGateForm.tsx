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
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              placeholder={t("calculator.emailPlaceholder")}
              className={`w-full rounded-full px-4 bg-[var(--bg-1)] border focus:outline-none transition-colors placeholder:text-[var(--text-3)] text-[var(--text-1)] ${compact ? "py-2.5 text-xs" : "py-3 text-sm"} ${
                errors.email ? "border-red-500 focus:border-red-400" : "border-[var(--border)] focus:border-[#00E510]"
              }`}
              data-testid="input-email-gate"
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 pl-3" data-testid="text-email-error">{errors.email}</p>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <PhoneInput
              value={phone}
              onChange={(v) => { setPhone(v); setErrors(prev => ({ ...prev, phone: undefined })); }}
              placeholder={t("calculator.phonePlaceholder")}
              error={!!errors.phone}
              compact={compact}
              data-testid="input-phone-gate"
            />
            {errors.phone && (
              <p className="text-[10px] text-red-500 pl-3" data-testid="text-phone-error">{errors.phone}</p>
            )}
          </div>
        </div>
        <div className={`flex flex-col ${compact ? "gap-1" : "gap-2"}`}>
          <label
            className={`flex items-start gap-2 cursor-pointer rounded-xl border transition-[color,background-color,border-color,opacity,transform] duration-200 ${compact ? "px-2.5 py-1.5" : "px-4 py-3"} ${
              privacyAccepted
                ? "border-[#00E510]/40 bg-[#00E510]/5"
                : errors.privacy
                ? "border-red-500/50 bg-red-50"
                : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[#00E510]/25"
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
              privacyAccepted ? "bg-[#00E510] border-[#00E510]" : errors.privacy ? "border-red-500" : "border-[var(--border)] bg-transparent"
            }`}>
              {privacyAccepted && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="#0B0D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className={`text-[var(--text-3)] leading-relaxed ${compact ? "text-[10px]" : "text-xs"}`}>
              {t("calculator.privacyText1")}{" "}
              <a href={lp("legal_privacy")} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#00E510] underline hover:text-[#00E510]/80">{t("calculator.privacyPolicy")}</a>
              {" "}{t("calculator.privacyText2")} <a href={lp("legal_terms")} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#00E510] underline hover:text-[#00E510]/80">{t("calculator.termsConditions")}</a>.{" "}
              <span className="text-[#00E510]/70">*</span>
            </span>
          </label>
          {errors.privacy && (
            <p className="text-xs text-red-400 pl-1 flex items-center gap-1.5" data-testid="text-privacy-error">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M6 4v2.5M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              {errors.privacy}
            </p>
          )}
          <label
            className={`flex items-start gap-2 cursor-pointer rounded-xl border transition-[color,background-color,border-color,opacity,transform] duration-200 ${compact ? "px-2.5 py-1.5" : "px-4 py-3"} ${
              marketingAccepted
                ? "border-[#00E510]/40 bg-[#00E510]/5"
                : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[#00E510]/25"
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
              marketingAccepted ? "bg-[#00E510] border-[#00E510]" : "border-[var(--border)] bg-transparent"
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
          className={`w-full bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,opacity,transform] duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${compact ? "py-3 text-sm" : "py-3.5 text-sm"}`}
          data-testid="button-submit-email"
        >
          {sending ? t("calculator.calculating") : t("calculator.seeMyEstimate")}
        </button>
      </form>
    </div>
  );
}
