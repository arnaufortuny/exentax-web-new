import { useState, useEffect, useMemo, useCallback, useRef, useSyncExternalStore, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { resolveLocale } from "@/lib/lang-utils";
import { calculateSavings, computeAllStructures, formatCurrency, countries, activities, getExpenseCategories, calcDeductibleTotal, COUNTRY_CURRENCY, COUNTRY_REGIMES, DISPLAY_CURRENCIES, convertFromEUR, convertToEUR, USE_CASE_PRESETS, NON_DEDUCTIBLE_INFO } from "@/lib/calculator";
import type { ExpenseItem, AllStructuresResult } from "@/lib/calculator";
import { apiRequest } from "@/lib/queryClient";
import { useLangPath } from "@/hooks/useLangPath";
import { trackCalculatorUsed, trackCalculatorCompleted } from "@/components/Tracking";
import { clientLogger } from "@/lib/clientLogger";

const CalculatorResults = lazy(() => import("./CalculatorResults"));
const EmailGateForm = lazy(() => import("./EmailGateForm"));

const ResultsFallback = () => <div style={{ minHeight: 240 }} aria-hidden="true" />;
const FormFallback = () => <div style={{ minHeight: 180 }} aria-hidden="true" />;

interface CalculatorProps {
  compact?: boolean;
}

const LG = 1024;
const subscribe = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); };
const getIsLg = () => window.innerWidth >= LG;
const getIsLgServer = () => true;

import { MONTHLY_INCOME_MIN as MONTHLY_MIN, MONTHLY_INCOME_MAX as MONTHLY_MAX } from "@/lib/calculator";

export default function Calculator({ compact: compactProp = false }: CalculatorProps) {
  const { t, i18n } = useTranslation();
  const calcLocale = resolveLocale(i18n.language);
  const lp = useLangPath();
  const isLg = useSyncExternalStore(subscribe, getIsLg, getIsLgServer);
  const compact = compactProp && isLg;
  // income is stored canonically in EUR (monthly). Display values are
  // converted on-the-fly to displayCurrency.
  const [income, setIncome] = useState(2000);
  const [incomeMode, setIncomeMode] = useState<"monthly" | "annual">("monthly");
  const [inputFocused, setInputFocused] = useState(false);
  const [inputStr, setInputStr] = useState("2000");
  const [country, setCountry] = useState("");
  const [regime, setRegime] = useState("");
  const [displayCurrency, setDisplayCurrencyState] = useState<string>("EUR");
  const [currencyUserPicked, setCurrencyUserPicked] = useState(false);
  const [geoPrefillApplied, setGeoPrefillApplied] = useState(false);

  const setDisplayCurrency = useCallback((code: string) => {
    setCurrencyUserPicked(true);
    setDisplayCurrencyState(code);
  }, []);

  const handleCountryChange = useCallback((newCountry: string) => {
    setCountry(newCountry);
    setRegime("");
    setShowExpensesSection(false);
    // Only auto-pick the country's default currency if the user has NOT
    // explicitly chosen one. Country and currency are independent, once
    // the user picks a currency we keep it across country changes.
    if (!currencyUserPicked) {
      const def = COUNTRY_CURRENCY[newCountry];
      if (def) setDisplayCurrencyState(def.code);
    }
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
  // expenses is stored canonically in EUR (monthly).
  const [expenses, setExpenses] = useState(0);
  const [expensesStr, setExpensesStr] = useState("0");
  const [expensesFocused, setExpensesFocused] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [showExpensesSection, setShowExpensesSection] = useState(false);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [calcSpainIrpf, setCalcSpainIrpf] = useState(false);
  const [ccaaProfile, setCcaaProfile] = useState<"low" | "medium" | "high">("medium");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; privacy?: string }>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [incomeTouched, setIncomeTouched] = useState(false);

  const expenseCategories = useMemo(() => getExpenseCategories(country), [country]);
  const hasCountry = country !== "";
  const hasRegime = regime !== "" && regime !== "sin-regimen";
  const countryRegimes = hasCountry ? (COUNTRY_REGIMES[country] || []) : [];
  const cc = DISPLAY_CURRENCIES[displayCurrency] || DISPLAY_CURRENCIES.EUR;
  const currSymbol = cc.symbol;

  // Income/expenses are stored in EUR. Convert for display.
  const incomeDisplay = Math.round(convertFromEUR(income, displayCurrency));
  const expensesDisplay = Math.round(convertFromEUR(expenses, displayCurrency));
  const displayValue = incomeMode === "annual" ? incomeDisplay * 12 : incomeDisplay;
  const sliderMinDisp = Math.round(convertFromEUR(MONTHLY_MIN, displayCurrency));
  const sliderMaxDisp = Math.round(convertFromEUR(MONTHLY_MAX, displayCurrency));
  const sliderMin = incomeMode === "annual" ? sliderMinDisp * 12 : sliderMinDisp;
  const sliderMax = incomeMode === "annual" ? sliderMaxDisp * 12 : sliderMaxDisp;
  const sliderStep = incomeMode === "annual"
    ? Math.max(1, Math.round(convertFromEUR(500, displayCurrency)) * 12)
    : Math.max(1, Math.round(convertFromEUR(500, displayCurrency)));
  const pct = Math.min(100, Math.max(0, ((displayValue - sliderMin) / Math.max(1, sliderMax - sliderMin)) * 100));

  const calcRegime = regime === "sin-regimen" ? "autonomo" : regime;
  const result = useMemo(() => (hasCountry && hasRegime)
    ? calculateSavings(income, country, calcRegime, activity, expenses, calcSpainIrpf, expenseItems, { ccaaProfile })
    : { sinLLC: 0, conLLC: 0, ahorro: 0, localLabel: "", breakdown: [], llcBreakdown: [], ivaNote: 0, effectiveRate: 0, llcEffectiveRate: 0, gastosDeducibles: 0 } as ReturnType<typeof calculateSavings>,
    [income, country, calcRegime, activity, expenses, calcSpainIrpf, expenseItems, hasCountry, hasRegime, ccaaProfile]);

  const allStructures = useMemo<AllStructuresResult | null>(() => hasCountry
    ? computeAllStructures(income, country, activity, expenses, expenseItems)
    : null,
    [income, country, activity, expenses, expenseItems, hasCountry]);

  function applyPreset(presetId: string) {
    const preset = USE_CASE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setIncome(preset.monthlyIncome);
    setIncomeTouched(true);
    setShowExpenseDetails(true);
    setShowExpensesSection(true);
    const items: ExpenseItem[] = Object.entries(preset.expenses).map(([id, monthly]) => {
      const cat = expenseCategories.find(c => c.id === id);
      if (!cat) return null;
      return { id, label: cat.label, monthly, deductPct: cat.deductPct };
    }).filter((x): x is ExpenseItem => x !== null);
    setExpenseItems(items);
    setExpenses(0);
  }

  // Geo-based prefill (Task #11): on mount, ask the server for the visitor's
  // country (resolved from cf-ipcountry / x-vercel-ip-country / fly-client-ip-
  // country / accept-language) and seed the calculator's country + display
  // currency. Never overrides a user choice, never blocks render, never logs
  // on network failure. The /api/geo response only ever returns "medium" for
  // CCAA so we don't touch ccaaProfile here.
  const countryRef = useRef(country);
  const currencyUserPickedRef = useRef(currencyUserPicked);
  useEffect(() => { countryRef.current = country; }, [country]);
  useEffect(() => { currencyUserPickedRef.current = currencyUserPicked; }, [currencyUserPicked]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/geo");
        if (!res.ok) return;
        const geo = await res.json() as {
          country?: string;
          calculatorCountry?: string;
          currency?: string;
          ccaaProfile?: string;
        };
        if (cancelled) return;
        if (!geo || !geo.country) return;
        if (geo.calculatorCountry && countryRef.current === "") {
          handleCountryChange(geo.calculatorCountry);
        }
        if (geo.currency && !currencyUserPickedRef.current) {
          setDisplayCurrencyState(geo.currency);
        }
        setGeoPrefillApplied(true);
      } catch (err) {
        clientLogger.warn("[calculator] geo prefill failed", err);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inputFocused) {
      setInputStr(String(displayValue));
    }
  }, [income, incomeMode, inputFocused]);

  // Funnel intent — fire `calculator_completed` once per session the first
  // time the visitor has filled in country + regime + a touched income.
  // Independent of the email gate / `calculator_used`, so we can measure
  // the drop-off between "ready to see results" and "submitted email".
  // Dedupe lives in trackCalculatorCompleted (sessionStorage), so the
  // effect can re-run safely as the dependencies change.
  useEffect(() => {
    if (!hasCountry || !hasRegime || !incomeTouched) return;
    trackCalculatorCompleted({
      country,
      regime,
      activity,
      monthly_income: income,
      annual_income: income * 12,
      effective_rate: result.effectiveRate,
      savings: result.ahorro,
      display_currency: displayCurrency,
    });
  }, [hasCountry, hasRegime, incomeTouched, country, regime, activity, income, result.effectiveRate, result.ahorro, displayCurrency]);

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const valDisp = Number(e.target.value);
    const monthlyDisp = incomeMode === "annual" ? Math.round(valDisp / 12) : valDisp;
    const monthlyEUR = Math.round(convertToEUR(monthlyDisp, displayCurrency));
    setIncome(Math.min(Math.max(monthlyEUR, MONTHLY_MIN), MONTHLY_MAX));
    setIncomeTouched(true);
  }

  function handleIncomeTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setInputStr(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const monthlyDisp = incomeMode === "annual" ? Math.round(parsed / 12) : parsed;
      const monthlyEUR = Math.round(convertToEUR(monthlyDisp, displayCurrency));
      setIncome(Math.min(Math.max(monthlyEUR, MONTHLY_MIN), MONTHLY_MAX));
      setIncomeTouched(true);
    }
  }

  function handleExpensesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setExpensesStr(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      setExpenses(Math.max(0, Math.round(convertToEUR(parsed, displayCurrency))));
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
    const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
    if (!phone || phoneDigits.length < 7 || phoneDigits.length > 15) {
      newErrors.phone = t("calculator.phoneError", { defaultValue: t("booking.phoneError") });
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
    setSendError(false);
    setShowResults(true);
    trackCalculatorUsed({
      country,
      regime,
      activity,
      monthly_income: income,
      annual_income: income * 12,
      effective_rate: result.effectiveRate,
      savings: result.ahorro,
    });

    // Audit Task #8 — extended fidelity payload. We mirror what the user
    // sees on screen (display currency, the 3-way comparator winner, and
    // the signed deltas vs LLC) so persistence and email reflect the exact
    // state of the calculation.
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
      displayCurrency,
      bestStructureId: allStructures?.bestId,
      llcVsAutonomo: allStructures?.llcSavingsVsAutonomo,
      llcVsSociedad: allStructures?.llcSavingsVsSociedad,
      ...(expenseItems.length > 0 ? { expenseItems: expenseItems.map(it => ({ id: it.id, monthly: it.monthly })) } : {}),
    }).catch((e) => {
      clientLogger.warn("[calculator] submission failed", e);
      setSendError(true);
    }).finally(() => setSending(false));
  }

  const getInsight = useCallback((): string => {
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
  }, [income, country, regime, activity, t]);

  const pad = compact ? "p-4 sm:p-5" : "p-7 sm:p-9 md:p-10 lg:p-12";

  return (
    <div
      className={`neon-card is-green rounded-3xl ${pad}`}
      id="calculadora"
      data-testid="calculator"
      style={{ background: 'var(--card-bg)' }}
    >
      <h3 className={`font-heading font-bold text-[var(--text-1)] text-center leading-[1.05] tracking-[-0.025em] ${compact ? "text-[22px] sm:text-[26px]" : "text-3xl sm:text-4xl lg:text-[42px]"}`}>
        {t("calculator.title")}
      </h3>
      <p className={`text-[var(--text-2)] mt-2 text-center mx-auto leading-relaxed ${compact ? "text-[13px] max-w-[440px]" : "text-[15px] lg:text-[17px] max-w-[520px]"}`}>
        {t("calculator.subtitle")}
      </p>

      <div className={`h-px bg-gradient-to-r from-transparent via-[rgba(var(--green-rgb),0.2)] to-transparent border-0 ${compact ? "my-2.5" : "my-5 lg:my-7"}`} />

      <div className={`flex flex-col ${compact ? "gap-2.5 mb-2.5" : "gap-4 lg:gap-6 mb-4"}`}>
        <div>
          <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm lg:text-[15px] mb-2 lg:mb-3"}`}>{t("calculator.selectCountry")}</p>
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 ${compact ? "gap-1" : "gap-2 lg:gap-3"}`}
            data-testid="geo-prefill-applied"
            data-geo-prefill-applied={geoPrefillApplied ? "true" : "false"}
          >
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCountryChange(c.id)}
                className={`group inline-flex items-center justify-center font-semibold rounded-full border-2 transition-all duration-200 w-full min-w-0 leading-tight backdrop-blur-2xl backdrop-saturate-150 ${compact ? "gap-1.5 text-[11px] py-2.5 px-3" : "gap-2 lg:gap-2.5 text-[13px] sm:text-sm lg:text-[15px] py-3.5 lg:py-4 px-4 lg:px-5"} ${
                  country === c.id
                    ? "bg-[rgba(0,229,16,0.18)] text-[var(--text-1)] border-[#00E510] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_0_0_1px_rgba(0,229,16,0.35),0_14px_36px_-12px_rgba(0,229,16,0.6),0_0_24px_-8px_rgba(0,229,16,0.55)]"
                    : "bg-[var(--glass-bg)] border-[rgba(0,229,16,0.35)] text-[var(--text-2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_20px_-12px_rgba(11,13,12,0.18)] hover:border-[#00E510] hover:bg-[rgba(0,229,16,0.08)] hover:text-[var(--text-1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_14px_30px_-12px_rgba(0,229,16,0.45)] hover:-translate-y-0.5"
                }`}
                data-testid={`button-country-${c.id}`}
                aria-pressed={country === c.id}
              >
                <img src={c.flag} alt="" className={`rounded-full flex-shrink-0 ring-1 ring-black/5 ${compact ? "w-3.5 h-3.5" : "w-5 h-5 lg:w-6 lg:h-6"}`} loading="lazy" aria-hidden="true" />
                <span className="truncate">{t(`calculator.countryLabels.${c.id}`, { defaultValue: c.label })}</span>
              </button>
            ))}
          </div>
        </div>

        {hasCountry && (
          <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
            <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
              <div>
                <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>
                  {t("calculator.displayCurrency", { defaultValue: "Divisa de visualización" })}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(DISPLAY_CURRENCIES).map(c => (
                    <button
                      key={c.code}
                      onClick={() => setDisplayCurrency(c.code)}
                      className={`group inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold leading-none rounded-full px-3 py-1.5 border-2 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 ${displayCurrency === c.code
                        ? "bg-[rgba(0,229,16,0.18)] text-[var(--text-1)] border-[#00E510] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_0_0_1px_rgba(0,229,16,0.35),0_10px_24px_-12px_rgba(0,229,16,0.55),0_0_18px_-8px_rgba(0,229,16,0.5)]"
                        : "bg-[var(--glass-bg)] text-[var(--text-2)] border-[rgba(0,229,16,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_14px_-10px_rgba(11,13,12,0.18)] hover:border-[#00E510] hover:bg-[rgba(0,229,16,0.08)] hover:text-[var(--text-1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_-12px_rgba(0,229,16,0.4)] hover:-translate-y-0.5"
                      }`}
                      data-testid={`button-currency-${c.code}`}
                      aria-pressed={displayCurrency === c.code}
                    >
                      <span className={displayCurrency === c.code ? "opacity-90" : "opacity-65"}>{c.symbol}</span>
                      <span>{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>
                  {t("calculator.useCasePreset", { defaultValue: "¿Quieres precargar un caso típico?" })}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {USE_CASE_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p.id)}
                      className="group inline-flex items-center text-[12px] sm:text-[13px] font-semibold leading-none rounded-full px-3 py-1.5 border-2 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 bg-[var(--glass-bg)] text-[var(--text-2)] border-[rgba(0,229,16,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_14px_-10px_rgba(11,13,12,0.18)] hover:border-[#00E510] hover:bg-[rgba(0,229,16,0.08)] hover:text-[var(--text-1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_-12px_rgba(0,229,16,0.4)] hover:-translate-y-0.5"
                      data-testid={`button-preset-${p.id}`}
                    >
                      {t(`calculator.presetLabels.${p.id}`, { defaultValue: p.label })}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>{t("calculator.currentRegime")}</p>
                <select
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                  className={`calc-select-chevron w-full rounded-full px-4 font-medium text-[var(--text-1)] appearance-none cursor-pointer bg-[var(--bg-1)] border border-[rgba(var(--green-rgb),0.25)] focus:border-[rgba(var(--green-rgb),0.55)] focus:outline-none transition-colors ${compact ? "py-2.5 text-xs" : "py-3 text-xs sm:text-sm"}`}
                  data-testid="select-regime"
                >
                  <option value="" disabled>{t("calculator.selectRegime")}</option>
                  {countryRegimes.map((r) => (
                    <option key={r.id} value={r.id} data-testid={`option-regime-${r.id}`}>
                      {r.id === "sin-regimen" ? t("calculator.regimeSinRegimen", { defaultValue: r.label }) : t(`calculator.regimeLabels.${country}.${r.id}`, { defaultValue: r.label })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>{t("calculator.activityType")}</p>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={`calc-select-chevron w-full rounded-full px-4 font-medium text-[var(--text-1)] appearance-none cursor-pointer bg-[var(--bg-1)] border border-[rgba(var(--green-rgb),0.25)] focus:border-[rgba(var(--green-rgb),0.55)] focus:outline-none transition-colors ${compact ? "py-2.5 text-xs" : "py-3 text-xs sm:text-sm"}`}
                  data-testid="select-activity"
                >
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>{t(`calculator.activityLabels.${a.id}`, { defaultValue: a.label })}</option>
                  ))}
                </select>
              </div>

              {country === "espana" && (
                <div>
                  <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px] mb-1" : "text-xs sm:text-sm mb-2"}`}>
                    {t("calculator.ccaaProfile", { defaultValue: "Comunidad autónoma" })}
                  </p>
                  <select
                    value={ccaaProfile}
                    onChange={(e) => setCcaaProfile(e.target.value as "low" | "medium" | "high")}
                    className={`calc-select-chevron w-full rounded-full px-4 font-medium text-[var(--text-1)] appearance-none cursor-pointer bg-[var(--bg-1)] border border-[rgba(var(--green-rgb),0.25)] focus:border-[rgba(var(--green-rgb),0.55)] focus:outline-none transition-colors ${compact ? "py-2.5 text-xs" : "py-3 text-xs sm:text-sm"}`}
                    data-testid="select-ccaa-profile"
                  >
                    <option value="medium">{t("calculator.ccaaMedium", { defaultValue: "Escala media (default)" })}</option>
                    <option value="low">{t("calculator.ccaaLow", { defaultValue: "Madrid · Andalucía · La Rioja" })}</option>
                    <option value="high">{t("calculator.ccaaHigh", { defaultValue: "Cataluña · Valencia · Asturias" })}</option>
                  </select>
                </div>
              )}
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
                        ? "bg-[var(--green)] text-[#0B0D0C]"
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
                className={`w-full rounded-full px-4 pr-10 font-body font-bold bg-[var(--bg-1)] border border-[var(--border)] focus:border-[var(--green)] focus:outline-none transition-colors text-[var(--text-1)] ${compact ? "py-2 text-sm" : "py-2.5 text-sm"}`}
                aria-label={incomeMode === "monthly" ? t("calculator.grossIncomeMonthly") : t("calculator.grossIncomeAnnual")}
                data-testid="text-income-value"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--green)] font-bold text-sm pointer-events-none">{currSymbol}</span>
            </div>
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={sliderStep}
              value={displayValue}
              onChange={handleSlider}
              className="w-full"
              style={{
                background: `linear-gradient(to right, var(--green) ${pct}%, rgba(0,0,0,0.06) ${pct}%)`,
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
                ? `= ${formatCurrency(income * 12, displayCurrency)}/${t("calculator.yearGross")}`
                : `≈ ${formatCurrency(income, displayCurrency)}/${t("calculator.monthGross")}`}
              {displayCurrency !== "EUR" && ` (${cc.code})`}
            </p>
          </div>
        )}

        {hasCountry && incomeTouched && !showExpensesSection && (
          <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
            <button
              type="button"
              onClick={() => setShowExpensesSection(true)}
              className={`inline-flex items-center gap-1.5 font-semibold text-[var(--green)] hover:text-[rgba(var(--green-rgb),0.8)] transition-colors bg-transparent border-0 p-0 ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`}
              data-testid="button-add-expenses"
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t("calculator.addExpensesCta", { defaultValue: t("calculator.deductibleExpenses") })}
            </button>
          </div>
        )}

        {hasCountry && incomeTouched && showExpensesSection && (
          <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-[var(--text-2)] font-medium ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`}>
                {t("calculator.deductibleExpenses")}
                <span className="text-[var(--text-3)] font-normal ml-1">({cc.code})</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="button-toggle-expense-details"
                  onClick={() => setShowExpenseDetails(!showExpenseDetails)}
                  className="text-[10px] font-semibold text-[var(--green)] hover:text-[var(--green)] transition-colors"
                >
                  {showExpenseDetails ? t("calculator.useTotal") : t("calculator.breakdownByCategory")}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowExpensesSection(false); setExpenses(0); setExpensesStr("0"); setExpenseItems([]); }}
                  className="text-[10px] font-semibold text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
                  aria-label={t("calculator.hideExpenses", { defaultValue: "Ocultar" })}
                  data-testid="button-hide-expenses"
                >
                  ×
                </button>
              </div>
            </div>
            {!showExpenseDetails ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={expensesFocused ? expensesStr : new Intl.NumberFormat(calcLocale).format(expensesDisplay)}
                    onFocus={() => { setExpensesFocused(true); setExpensesStr(String(expensesDisplay)); }}
                    onBlur={() => setExpensesFocused(false)}
                    onChange={handleExpensesChange}
                    className={`w-full rounded-full px-4 pr-10 font-body font-bold bg-[var(--bg-1)] border border-[var(--border)] focus:border-[var(--green)] focus:outline-none transition-colors text-[var(--text-1)] ${compact ? "py-2 text-sm" : "py-2.5 text-sm"}`}
                    placeholder={t("calculator.placeholderZero")}
                    aria-label={t("calculator.deductibleExpenses")}
                    data-testid="input-expenses"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--green)] font-bold text-sm pointer-events-none">{currSymbol}</span>
                </div>
                <p className="text-[10px] text-[var(--text-3)] mt-1">
                  = {formatCurrency(expenses * 12, displayCurrency)}{t("calculator.perYear")} · {t("calculator.totalDeductible")}: {formatCurrency(result.gastosDeducibles, displayCurrency)}{t("calculator.perYear")}
                </p>
              </>
            ) : (
              <div className="space-y-1.5">
                {(() => {
                  const groupOrder: string[] = ["tech","professional","marketing","office","comms","banking","insurance","training","contractors","travel","proportional","other"];
                  const groupLabels: Record<string, string> = {
                    tech: t("calculator.expenseGroups.tech", { defaultValue: "Tecnología" }),
                    professional: t("calculator.expenseGroups.professional", { defaultValue: "Servicios profesionales" }),
                    marketing: t("calculator.expenseGroups.marketing", { defaultValue: "Marketing" }),
                    office: t("calculator.expenseGroups.office", { defaultValue: "Oficina / coworking" }),
                    comms: t("calculator.expenseGroups.comms", { defaultValue: "Internet / comunicaciones" }),
                    banking: t("calculator.expenseGroups.banking", { defaultValue: "Banca y pasarelas" }),
                    insurance: t("calculator.expenseGroups.insurance", { defaultValue: "Seguros" }),
                    training: t("calculator.expenseGroups.training", { defaultValue: "Formación" }),
                    contractors: t("calculator.expenseGroups.contractors", { defaultValue: "Contratistas" }),
                    travel: t("calculator.expenseGroups.travel", { defaultValue: "Viajes" }),
                    proportional: t("calculator.expenseGroups.proportional", { defaultValue: "Uso proporcional" }),
                    other: t("calculator.expenseGroups.other", { defaultValue: "Otros" }),
                  };
                  const grouped = groupOrder.map(g => ({ g, items: expenseCategories.filter(c => c.group === g) })).filter(x => x.items.length > 0);
                  return grouped.map(({ g, items }) => (
                    <div key={g} className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wide text-[var(--text-3)] font-semibold mt-1">{groupLabels[g] || g}</p>
                      {items.map(cat => {
                        const item = expenseItems.find(i => i.id === cat.id);
                        const valDisp = item ? Math.round(convertFromEUR(item.monthly, displayCurrency)) : 0;
                        return (
                          <div key={cat.id} className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-[var(--text-2)] truncate">{t(`calculator.expenseLabels.${cat.id}`, { defaultValue: cat.label })}</span>
                                <span className={`text-[9px] font-bold px-1 py-px rounded ${cat.deductPct === 100 ? "bg-[rgba(var(--green-rgb),0.1)] text-[var(--green)]" : cat.deductPct >= 80 ? "bg-[var(--green-soft)] text-[var(--text-1)]" : cat.deductPct === 0 ? "bg-[var(--bg-2)] text-[var(--muted)]" : "bg-[var(--bg-2)] text-[var(--text-3)]"}`}>
                                  {cat.deductPct}%
                                </span>
                              </div>
                            </div>
                            <div className="relative w-20 flex-shrink-0">
                              <input
                                type="text"
                                inputMode="numeric"
                                data-testid={`input-expense-${cat.id}`}
                                value={valDisp || ""}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^\d]/g, "");
                                  const parsed = parseInt(raw, 10);
                                  const amountDisp = isNaN(parsed) ? 0 : parsed;
                                  const amountEUR = Math.round(convertToEUR(amountDisp, displayCurrency));
                                  setExpenseItems(prev => {
                                    const existing = prev.filter(i => i.id !== cat.id);
                                    if (amountEUR > 0) {
                                      existing.push({ id: cat.id, label: cat.label, monthly: amountEUR, deductPct: cat.deductPct });
                                    }
                                    return existing;
                                  });
                                }}
                                placeholder={t("calculator.expenseExample", { amount: cat.placeholder, defaultValue: cat.placeholder })}
                                className="w-full rounded-full px-2 pr-6 py-1 text-xs font-body bg-[var(--bg-1)] border border-[var(--border)] focus:border-[var(--green)] focus:outline-none text-[var(--text-1)] text-right"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-3)] pointer-events-none">{currSymbol}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
                <div className="flex justify-between items-center pt-1 border-t border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-3)]">{t("calculator.totalDeductible")}</span>
                  <span className="text-[11px] font-bold font-body text-[var(--green)]">{formatCurrency(calcDeductibleTotal(expenseItems), displayCurrency)}{t("calculator.perYear")}</span>
                </div>
                <p className="text-[10px] text-[var(--text-3)]">
                  {t("calculator.annualActivity")} {formatCurrency(result.gastosDeducibles, displayCurrency)}{t("calculator.perYear")}
                </p>
                <details className="mt-1.5">
                  <summary className="text-[10px] text-[var(--text-3)] cursor-pointer hover:text-[var(--text-2)]" data-testid="non-deductible-info-toggle">
                    {t("calculator.nonDeductibleInfoTitle", { defaultValue: "Gastos NO deducibles (informativo)" })}
                  </summary>
                  <ul className="text-[10px] text-[var(--text-3)] mt-1 list-disc list-inside space-y-0.5">
                    {NON_DEDUCTIBLE_INFO.map(n => (
                      <li key={n.id}>{t(`calculator.nonDeductibleLabels.${n.id}`, { defaultValue: n.label })}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </div>
        )}

        {hasCountry && hasRegime && incomeTouched && country === "espana" && (
          <label
            className={`flex items-center gap-3 cursor-pointer rounded-full border transition-all duration-200 ${compact ? "px-3 py-2" : "px-4 py-3"} ${
              calcSpainIrpf
                ? "border-[rgba(var(--green-rgb),0.4)] bg-[rgba(var(--green-rgb),0.05)]"
                : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[rgba(var(--green-rgb),0.25)]"
            }`}
            style={{ animation: "fadeSlideIn 0.4s ease-out" }}
            data-testid="toggle-spain-irpf"
          >
            <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${calcSpainIrpf ? "bg-[var(--green)]" : "bg-[var(--border)]"}`}>
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
        <div className={`h-px bg-gradient-to-r from-transparent via-[rgba(var(--green-rgb),0.2)] to-transparent border-0 ${compact ? "my-2.5" : "my-4"}`} />
      )}

      {!showResults && !hasCountry && (
        <p className={`text-center text-[var(--text-3)] ${compact ? "text-[11px]" : "text-xs sm:text-sm"}`} data-testid="text-calculator-hint">
          {t("calculator.selectHint")}
        </p>
      )}

      {regime === "sin-regimen" && hasCountry && !showResults && (
        <div className={`rounded-xl border border-[rgba(var(--green-rgb),0.15)] bg-[rgba(var(--green-rgb),0.03)] ${compact ? "p-3 mt-2" : "p-5 mt-3"}`} style={{ animation: "fadeSlideIn 0.4s ease-out" }} data-testid="sin-regimen-cta">
          <p className={`font-medium text-[var(--text-1)] text-center ${compact ? "text-xs mb-1" : "text-sm mb-2"}`}>
            {t("calculator.noRegimeTitle")}
          </p>
          <p className={`text-[var(--text-3)] text-center ${compact ? "text-[10px] mb-2" : "text-xs mb-3"}`}>
            {t("calculator.noRegimeDesc")}
          </p>
          <div className="flex justify-center">
            <a
              href={lp("book")}
              className={`inline-flex items-center justify-center font-semibold rounded-full bg-[var(--green)] text-[#0B0D0C] border border-[var(--green)] shadow-[var(--shadow-green)] transition-colors ${compact ? "text-[11px] py-1.5 px-4" : "text-sm py-2.5 px-6"}`}
              data-testid="link-sin-regimen-asesoria"
            >
              {t("calculator.noRegimeCta")}
            </a>
          </div>
        </div>
      )}

      {hasCountry && hasRegime && (
        <div className={`h-px bg-gradient-to-r from-transparent via-[rgba(var(--green-rgb),0.2)] to-transparent border-0 ${compact ? "mb-2.5" : "mb-4"}`} />
      )}

      {!showResults && hasCountry && hasRegime && incomeTouched ? (
        <Suspense fallback={<FormFallback />}>
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
        </Suspense>
      ) : null}

      {showResults && (
        <Suspense fallback={<ResultsFallback />}>
          <CalculatorResults
            result={result}
            income={income}
            country={country}
            regime={regime}
            getInsight={getInsight}
            displayCurrency={displayCurrency}
            allStructures={allStructures}
          />
          {sendError && (
            <p className="text-[var(--error)] text-xs text-center mt-2" data-testid="text-calculator-send-error">
              {t("calculator.sendError")}
            </p>
          )}
        </Suspense>
      )}
    </div>
  );
}
