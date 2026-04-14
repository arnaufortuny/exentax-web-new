import { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { resolveLocale } from "@/lib/lang-utils";
import { calculateSavings, formatCurrency, countries, activities, getExpenseCategories, calcDeductibleTotal, COUNTRY_CURRENCY, COUNTRY_REGIMES } from "@/lib/calculator";
import type { ExpenseItem } from "@/lib/calculator";
import { apiRequest } from "@/lib/queryClient";
import { useLangPath } from "@/hooks/useLangPath";
import { trackFormSubmit } from "@/components/Tracking";
import CalculatorResults from "./CalculatorResults";
import EmailGateForm from "./EmailGateForm";

interface CalculatorProps {
  compact?: boolean;
}

const LG = 1024;
const subscribe = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); };
const getIsLg = () => window.innerWidth >= LG;
const getIsLgServer = () => true;

const MONTHLY_MIN = 1000;
const MONTHLY_MAX = 100000;

export default function Calculator({ compact: compactProp = false }: CalculatorProps) {
  const { t, i18n } = useTranslation();
  const calcLocale = resolveLocale(i18n.language);
  const lp = useLangPath();
  const isLg = useSyncExternalStore(subscribe, getIsLg, getIsLgServer);
  const compact = compactProp && isLg;
  const [income, setIncome] = useState(2000);
  const [incomeMode, setIncomeMode] = useState<"monthly" | "annual">("monthly");
  const [inputFocused, setInputFocused] = useState(false);
  const [inputStr, setInputStr] = useState("2000");
  const [country, setCountry] = useState("");
  const [regime, setRegime] = useState("");

  const handleCountryChange = useCallback((newCountry: string) => {
    setCountry(newCountry);
    setRegime("");
    setExpenseItems(prev => {
      if (prev.length === 0) return prev;
      const cats = getExpenseCategories(newCountry);
      return prev.map(item => {
        const cat = cats.find(c => c.id === item.id);
        return cat ? { ...item, deductPct: cat.deductPct, label: cat.label } : item;
      });
    });
  }, []);
  const [activity, setActivity] = useState("digitalServices");
  const [expenses, setExpenses] = useState(0);
  const [expensesStr, setExpensesStr] = useState("0");
  const [expensesFocused, setExpensesFocused] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [calcSpainIrpf, setCalcSpainIrpf] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; privacy?: string }>({});
  const [sending, setSending] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [incomeTouched, setIncomeTouched] = useState(false);

  const expenseCategories = useMemo(() => getExpenseCategories(country), [country]);
  const hasCountry = country !== "";
  const hasRegime = regime !== "" && regime !== "sin-regimen";
  const countryRegimes = hasCountry ? (COUNTRY_REGIMES[country] || []) : [];
  const cc = COUNTRY_CURRENCY[country] || COUNTRY_CURRENCY.espana;
  const currSymbol = cc.symbol;

  const displayValue = incomeMode === "annual" ? income * 12 : income;
  const sliderMin = incomeMode === "annual" ? MONTHLY_MIN * 12 : MONTHLY_MIN;
  const sliderMax = incomeMode === "annual" ? MONTHLY_MAX * 12 : MONTHLY_MAX;
  const pct = Math.min(100, Math.max(0, ((displayValue - sliderMin) / (sliderMax - sliderMin)) * 100));

  const calcRegime = regime === "sin-regimen" ? "autonomo" : regime;
  const result = useMemo(() => (hasCountry && hasRegime)
    ? calculateSavings(income, country, calcRegime, activity, expenses, calcSpainIrpf, expenseItems)
    : { sinLLC: 0, conLLC: 0, ahorro: 0, localLabel: "", breakdown: [], llcBreakdown: [], ivaNote: 0, effectiveRate: 0, llcEffectiveRate: 0, gastosDeducibles: 0 } as ReturnType<typeof calculateSavings>,
    [income, country, calcRegime, activity, expenses, calcSpainIrpf, expenseItems, hasCountry, hasRegime]);

  useEffect(() => {
    if (!inputFocused) {
      setInputStr(String(displayValue));
    }
  }, [income, incomeMode, inputFocused]);

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    const monthly = incomeMode === "annual" ? Math.round(val / 12) : val;
    setIncome(Math.min(Math.max(monthly, MONTHLY_MIN), MONTHLY_MAX));
    setIncomeTouched(true);
  }

  function handleIncomeTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setInputStr(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const monthly = incomeMode === "annual" ? Math.round(parsed / 12) : parsed;
      setIncome(Math.min(Math.max(monthly, MONTHLY_MIN), MONTHLY_MAX));
      setIncomeTouched(true);
    }
  }

  function handleExpensesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setExpensesStr(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      setExpenses(Math.max(0, parsed));
    } else {
      setExpenses(0);
    }
  }

  function handlePhoneSet(v: string) {
    setPhone(v);
    setErrors(prev => ({ ...prev, phone: undefined }));
  }

  function validate(): boolean {
    const newErrors: { email?: string; phone?: string; privacy?: string } = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("calculator.emailError");
    }
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      newErrors.phone = t("booking.phoneError");
    }
    if (!privacyAccepted) {
      newErrors.privacy = t("calculator.privacyError");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setShowResults(true);
    trackFormSubmit("calculator");

    apiRequest("POST", "/api/calculator-leads", {
      email,
      phone,
      country,
      regime,
      activity,
      income,
      incomeMode,
      annualIncome: income * 12,
      effectiveRate: result.effectiveRate,
      ahorro: result.ahorro,
      sinLLC: result.sinLLC,
      conLLC: result.conLLC,
      localLabel: result.localLabel,
      breakdown: result.breakdown,
      deductibleExpenses: expenseItems.length > 0 ? Math.round(calcDeductibleTotal(expenseItems) / 12) : expenses,
      calcSpainIrpf,
      privacyAccepted: privacyAccepted,
      marketingAccepted: marketingAccepted,
      language: i18n.language,
    }).catch((e) => console.error("[calculator] submission failed", e)).finally(() => setSending(false));
  }

  function getInsight(): string {
    const annualIncome = income * 12;
    if (country === "espana" && regime === "autonomo") {
      if (annualIncome > 60000) return t("calculator.insights.espana_autonomo_high");
      if (annualIncome > 30000) return t("calculator.insights.espana_autonomo_mid");
      return t("calculator.insights.espana_autonomo_low");
    }
    if (country === "espana" && regime === "sociedad") {
      return t("calculator.insights.espana_sociedad");
    }
    if (country === "mexico") {
      if (regime === "autonomo") return t("calculator.insights.mexico_autonomo");
      return t("calculator.insights.mexico_sociedad");
    }
    if (country === "chile") return t("calculator.insights.chile");
    if (country === "reino-unido") return t("calculator.insights.reino_unido");
    if (country === "belgica") return t("calculator.insights.belgica");
    if (country === "francia") return t("calculator.insights.francia");
    if (country === "italia") return t("calculator.insights.italia");
    if (country === "austria") return t("calculator.insights.austria");
    if (activity === "trading") return t("calculator.insights.trading");
    if (activity === "ecommerceOwn" || activity === "dropshipping") return t("calculator.insights.ecommerce");
    return t("calculator.insights.generic");
  }

  const pad = compact ? "p-4 sm:p-5" : "p-7 sm:p-9 md:p-10 lg:p-12";

  return (
    <div
      className={`glass-strong rounded-2xl !border-[rgba(0,229,16,0.25)] shadow-[0_0_40px_rgba(0,229,16,0.12),0_0_80px_rgba(0,229,16,0.06)] ${pad}`}
      id="calculadora"
      data-testid="calculator"
    >
      <h3 className={`font-heading font-bold text-[var(--text-1)] text-center leading-tight ${compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"}`}>
        {t("calculator.title")}
      </h3>
      <p className={`text-[var(--text-2)] mt-0.5 text-center ${compact ? "text-[11px]" : "text-sm"}`}>
        {t("calculator.subtitle")}
      </p>

      <div className={`h-px bg-gradient-to-r from-transparent via-[#00E510]/20 to-transparent border-0 ${compact ? "my-2.5" : "my-4"}`} />

      <div className={`flex flex-col ${compact ? "gap-2.5 mb-2.5" : "gap-4 mb-4"}`}>
        <div>
          <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>{t("calculator.selectCountry")}</p>
          <div className={`grid grid-cols-2 sm:grid-cols-4 ${compact ? "gap-1" : "gap-1.5"}`}>
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCountryChange(c.id)}
                className={`inline-flex items-center justify-center gap-1 font-medium rounded-full border transition-colors duration-150 w-full min-w-0 leading-tight ${compact ? "text-[10px] py-1.5 px-1.5" : "text-[11px] sm:text-[13px] py-2 px-1.5"} ${
                  country === c.id
                    ? "bg-[#00E510] text-[#0B0D0C] border-[#00E510] shadow-[var(--shadow-green)]"
                    : "bg-[var(--bg-1)] border-[rgba(0,229,16,0.18)] hover:border-[#00E510]/40 text-[var(--text-2)]"
                }`}
                data-testid={`button-country-${c.id}`}
                aria-pressed={country === c.id}
              >
                <img src={c.flag} alt="" className={`rounded-full flex-shrink-0 ${compact ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5"}`} loading="lazy" aria-hidden="true" />
                <span className="truncate">{t(`calculator.countryLabels.${c.id}`, { defaultValue: c.label })}</span>
              </button>
            ))}
          </div>
        </div>

        {hasCountry && (
          <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
            <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
              <div>
                <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>{t("calculator.currentRegime")}</p>
                <select
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  className={`w-full rounded-full px-4 font-medium text-[var(--text-1)] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat cursor-pointer bg-[var(--bg-1)] border border-[rgba(0,229,16,0.25)] focus:border-[#00E510] focus:outline-none transition-colors focus:shadow-[0_0_0_2px_rgba(0,229,16,0.12)] ${compact ? "py-2.5 text-xs" : "py-3 text-xs sm:text-sm"}`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%2300E510' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")` }}
                  data-testid="select-regime"
                >
                  <option value="" disabled>{t("calculator.selectRegime")}</option>
                  {countryRegimes.map((r) => (
                    <option key={r.id} value={r.id} data-testid={`option-regime-${r.id}`}>
                      {r.id === "sin-regimen" ? t("calculator.regimeSinRegimen", { defaultValue: r.label }) : r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>{t("calculator.activityType")}</p>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={`w-full rounded-full px-4 font-medium text-[var(--text-1)] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat cursor-pointer bg-[var(--bg-1)] border border-[rgba(0,229,16,0.25)] focus:border-[#00E510] focus:outline-none transition-colors focus:shadow-[0_0_0_2px_rgba(0,229,16,0.12)] ${compact ? "py-2.5 text-xs" : "py-3 text-xs sm:text-sm"}`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%2300E510' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")` }}
                  data-testid="select-activity"
                >
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>{t(`calculator.activityLabels.${a.id}`, { defaultValue: a.label })}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {hasCountry && hasRegime && (
          <div style={{ animation: "fadeSlideIn 0.4s ease-out 0.1s both" }}>
            <div className={`flex items-center ${compact ? "mb-1" : "mb-2"}`}>
              <span className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`}>
                {incomeMode === "monthly" ? t("calculator.grossIncomeMonthly") : t("calculator.grossIncomeAnnual")}
                <span className="text-[var(--text-3)] font-normal ml-1">({cc.code})</span>
              </span>
              <div className="ml-auto flex gap-0.5 rounded-full border border-[var(--border)] p-0.5 bg-[var(--bg-2)]">
                {(["monthly", "annual"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setIncomeMode(m); setIncomeTouched(true); }}
                    className={`text-[11px] sm:text-xs font-semibold rounded-full px-3 py-1 transition-colors duration-150 ${
                      incomeMode === m
                        ? "bg-[#00E510] text-[#0B0D0C]"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                    }`}
                    data-testid={`button-income-mode-${m}`}
                  >
                    {m === "monthly" ? t("calculator.monthly") : t("calculator.annual")}
                  </button>
                ))}
              </div>
            </div>
            <div className={`relative ${compact ? "mb-1" : "mb-2"}`}>
              <input
                type="text"
                inputMode="numeric"
                value={inputFocused ? inputStr : new Intl.NumberFormat(calcLocale).format(displayValue)}
                onFocus={() => { setInputFocused(true); setInputStr(String(displayValue)); }}
                onBlur={() => setInputFocused(false)}
                onChange={handleIncomeTextChange}
                className={`w-full rounded-full px-4 pr-10 font-body font-bold bg-[var(--bg-1)] border border-[var(--border)] focus:border-[#00E510] focus:outline-none transition-colors text-[var(--text-1)] ${compact ? "py-2 text-sm" : "py-2.5 text-sm"}`}
                aria-label={incomeMode === "monthly" ? t("calculator.grossIncomeMonthly") : t("calculator.grossIncomeAnnual")}
                data-testid="text-income-value"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00E510] font-bold text-sm pointer-events-none">{currSymbol}</span>
            </div>
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={incomeMode === "annual" ? 6000 : 500}
              value={displayValue}
              onChange={handleSlider}
              className="w-full"
              style={{
                background: `linear-gradient(to right, #00E510 ${pct}%, rgba(0,0,0,0.06) ${pct}%)`,
              }}
              aria-label={incomeMode === "monthly" ? t("calculator.grossIncomeMonthly") : t("calculator.grossIncomeAnnual")}
              data-testid="input-slider-income"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[11px] text-[var(--text-3)]">{new Intl.NumberFormat(calcLocale).format(sliderMin)}{currSymbol}</span>
              <span className="text-[11px] text-[var(--text-3)]">{new Intl.NumberFormat(calcLocale).format(sliderMax)}{currSymbol}</span>
            </div>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5">
              {incomeMode === "monthly"
                ? `= ${formatCurrency(income * 12, cc.code)}/${t("calculator.yearGross")}`
                : `≈ ${formatCurrency(income, cc.code)}/${t("calculator.monthGross")}`}
              {country !== "espana" && ` (${cc.code})`}
            </p>
          </div>
        )}

        {hasCountry && incomeTouched && (
          <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`}>
                {t("calculator.deductibleExpenses")}
                <span className="text-[var(--text-3)] font-normal ml-1">({cc.code})</span>
              </p>
              <button
                type="button"
                data-testid="button-toggle-expense-details"
                onClick={() => setShowExpenseDetails(!showExpenseDetails)}
                className="text-[10px] font-semibold text-[#00E510] hover:text-[#00E510] transition-colors"
              >
                {showExpenseDetails ? t("calculator.useTotal") : t("calculator.breakdownByCategory")}
              </button>
            </div>
            {!showExpenseDetails ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={expensesFocused ? expensesStr : new Intl.NumberFormat(calcLocale).format(expenses)}
                    onFocus={() => { setExpensesFocused(true); setExpensesStr(String(expenses)); }}
                    onBlur={() => setExpensesFocused(false)}
                    onChange={handleExpensesChange}
                    className={`w-full rounded-full px-4 pr-10 font-body font-bold bg-[var(--bg-1)] border border-[var(--border)] focus:border-[#00E510] focus:outline-none transition-colors text-[var(--text-1)] ${compact ? "py-2 text-sm" : "py-2.5 text-sm"}`}
                    placeholder="0"
                    aria-label={t("calculator.deductibleExpenses")}
                    data-testid="input-expenses"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00E510] font-bold text-sm pointer-events-none">{currSymbol}</span>
                </div>
                <p className="text-[10px] text-[var(--text-3)] mt-1">
                  = {formatCurrency(expenses * 12, cc.code)}{t("calculator.perYear")} · {t("calculator.totalDeductible")}: {formatCurrency(result.gastosDeducibles, cc.code)}{t("calculator.perYear")}
                </p>
              </>
            ) : (
              <div className="space-y-1.5">
                {expenseCategories.map(cat => {
                  const item = expenseItems.find(i => i.id === cat.id);
                  const val = item?.monthly || 0;
                  return (
                    <div key={cat.id} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[var(--text-2)] truncate">{t(`calculator.expenseLabels.${cat.id}`, { defaultValue: cat.label })}</span>
                          <span className={`text-[9px] font-bold px-1 py-px rounded ${cat.deductPct === 100 ? "bg-[#00E510]/10 text-[#00E510]" : cat.deductPct >= 80 ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : "bg-[var(--bg-2)] text-[var(--text-3)]"}`}>
                            {cat.deductPct}%
                          </span>
                        </div>
                      </div>
                      <div className="relative w-20 flex-shrink-0">
                        <input
                          type="text"
                          inputMode="numeric"
                          data-testid={`input-expense-${cat.id}`}
                          value={val || ""}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d]/g, "");
                            const parsed = parseInt(raw, 10);
                            const amount = isNaN(parsed) ? 0 : parsed;
                            setExpenseItems(prev => {
                              const existing = prev.filter(i => i.id !== cat.id);
                              if (amount > 0) {
                                existing.push({ id: cat.id, label: cat.label, monthly: amount, deductPct: cat.deductPct });
                              }
                              return existing;
                            });
                          }}
                          placeholder={cat.placeholder}
                          className="w-full rounded-full px-2 pr-6 py-1 text-xs font-body bg-[var(--bg-1)] border border-[var(--border)] focus:border-[#00E510] focus:outline-none text-[var(--text-1)] text-right"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-3)] pointer-events-none">{currSymbol}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-1 border-t border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-3)]">{t("calculator.totalDeductible")}</span>
                  <span className="text-[11px] font-bold font-body text-[#00E510]">{formatCurrency(calcDeductibleTotal(expenseItems), cc.code)}{t("calculator.perYear")}</span>
                </div>
                <p className="text-[10px] text-[var(--text-3)]">
                  {t("calculator.annualActivity")} {formatCurrency(result.gastosDeducibles, cc.code)}{t("calculator.perYear")}
                </p>
              </div>
            )}
          </div>
        )}

        {hasCountry && hasRegime && incomeTouched && country === "espana" && (
          <label
            className={`flex items-center gap-3 cursor-pointer rounded-full border transition-all duration-200 ${compact ? "px-3 py-2" : "px-4 py-3"} ${
              calcSpainIrpf
                ? "border-[#00E510]/40 bg-[#00E510]/5"
                : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[#00E510]/25"
            }`}
            style={{ animation: "fadeSlideIn 0.4s ease-out" }}
            data-testid="toggle-spain-irpf"
          >
            <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${calcSpainIrpf ? "bg-[#00E510]" : "bg-[var(--border)]"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[var(--bg-0)] shadow-sm transition-transform duration-200 ${calcSpainIrpf ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <input
              type="checkbox"
              checked={calcSpainIrpf}
              onChange={(e) => setCalcSpainIrpf(e.target.checked)}
              className="sr-only"
            />
            <div>
              <span className={`font-medium text-[var(--text-1)] block ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`}>
                {t("calculator.simulateIrpf")}
              </span>
              <span className={`text-[var(--text-3)] ${compact ? "text-[9px]" : "text-[10px] sm:text-xs"}`}>
                {t("calculator.simulateIrpfDesc")}
              </span>
            </div>
          </label>
        )}
      </div>

      {!hasCountry && !showResults && (
        <div className={`h-px bg-gradient-to-r from-transparent via-[#00E510]/20 to-transparent border-0 ${compact ? "my-2.5" : "my-4"}`} />
      )}

      {!showResults && !hasCountry && (
        <p className={`text-center text-[var(--text-3)] ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`} data-testid="text-calculator-hint">
          {t("calculator.selectHint")}
        </p>
      )}

      {regime === "sin-regimen" && hasCountry && !showResults && (
        <div className={`rounded-xl border border-[rgba(0,229,16,0.15)] bg-[rgba(0,229,16,0.03)] ${compact ? "p-3 mt-2" : "p-5 mt-3"}`} style={{ animation: "fadeSlideIn 0.4s ease-out" }} data-testid="sin-regimen-cta">
          <p className={`font-medium text-[var(--text-1)] text-center ${compact ? "text-xs mb-1" : "text-sm mb-2"}`}>
            {t("calculator.noRegimeTitle")}
          </p>
          <p className={`text-[var(--text-3)] text-center ${compact ? "text-[10px] mb-2" : "text-xs mb-3"}`}>
            {t("calculator.noRegimeDesc")}
          </p>
          <div className="flex justify-center">
            <a
              href={lp("/agendar-asesoria")}
              className={`inline-flex items-center justify-center font-semibold rounded-full bg-[#00E510] text-[#0B0D0C] border border-[#00E510] shadow-[var(--shadow-green)] transition-colors ${compact ? "text-[11px] py-1.5 px-4" : "text-sm py-2.5 px-6"}`}
              data-testid="link-sin-regimen-asesoria"
            >
              {t("calculator.noRegimeCta")}
            </a>
          </div>
        </div>
      )}

      {hasCountry && hasRegime && (
        <div className={`h-px bg-gradient-to-r from-transparent via-[#00E510]/20 to-transparent border-0 ${compact ? "mb-2.5" : "mb-4"}`} />
      )}

      {!showResults && hasCountry && hasRegime && incomeTouched ? (
        <EmailGateForm
          compact={compact}
          email={email}
          phone={phone}
          privacyAccepted={privacyAccepted}
          marketingAccepted={marketingAccepted}
          errors={errors}
          sending={sending}
          setEmail={setEmail}
          setPrivacyAccepted={setPrivacyAccepted}
          setMarketingAccepted={setMarketingAccepted}
          setErrors={setErrors}
          setPhone={handlePhoneSet}
          handleSubmit={handleSubmit}
        />
      ) : null}

      {showResults && (
        <CalculatorResults
          result={result}
          income={income}
          country={country}
          regime={regime}
          getInsight={getInsight}
        />
      )}
    </div>
  );
}
