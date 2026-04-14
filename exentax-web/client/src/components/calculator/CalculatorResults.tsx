import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import { formatCurrency, countries, regimes } from "@/lib/calculator";
import type { IrpfBracketDetail } from "@/lib/calculator";
import { useLangPath } from "@/hooks/useLangPath";
import AnimatedNumber from "./AnimatedNumber";
import { BrandTick, BrandCross } from "./BrandIcons";
import IrpfBracketsTable from "./IrpfBracketsTable";

interface CalculatorResult {
  sinLLC: number;
  conLLC: number;
  ahorro: number;
  localLabel: string;
  breakdown: Array<{ label: string; amount: number; note?: string }>;
  llcBreakdown: Array<{ label: string; amount: number; note?: string }>;
  ivaNote: number;
  effectiveRate: number;
  llcEffectiveRate: number;
  gastosDeducibles: number;
  irpfBrackets?: IrpfBracketDetail[];
  spainIrpfWithLLC?: {
    baseImponible: number;
    irpf: number;
    brackets: IrpfBracketDetail[];
  };
}

interface CalculatorResultsProps {
  result: CalculatorResult;
  income: number;
  country: string;
  regime: string;
  getInsight: () => string;
}

export default function CalculatorResults({ result, income, country, regime, getInsight }: CalculatorResultsProps) {
  const { t } = useTranslation();
  const lp = useLangPath();

  const resolvedLocalLabel = (() => {
    const parts = result.localLabel.split("|");
    if (parts.length === 2) {
      const [regLabel, countryKey] = parts;
      const countryName = t(`calculator.countryLabels.${countryKey}`, countryKey);
      return `${regLabel} ${t("calculator.inCountry", { defaultValue: "en" })} ${countryName}`;
    }
    return result.localLabel;
  })();

  return (
    <div className="calc-results-enter" data-testid="calculator-results">

      <div className="rounded-2xl p-5 sm:p-7 text-center mb-5 relative overflow-hidden calc-glow-enter border border-[rgba(0,229,16,0.2)]" style={{ background: "rgba(0,229,16,0.04)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 0 40px rgba(0,229,16,0.08), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #00E510 0%, transparent 50%)" }} />
        <p className="relative font-body text-[10px] sm:text-xs text-[#00E510]/70 uppercase tracking-[0.14em] font-semibold mb-1.5">
          {t("calculator.estimatedAnnualSavings")}
        </p>
        <p className="relative font-heading font-bold text-[#00E510] text-3xl sm:text-5xl leading-none mb-1 calc-savings-enter calc-savings-glow" data-testid="text-ahorro">
          <AnimatedNumber value={result.ahorro} />
        </p>
        <p className="relative font-body text-[10px] text-[var(--text-3)] mt-1">{t("calculator.perYearWithLLC")}</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-1)] p-4 sm:p-5 mb-5">
        {(() => {
          const maxRate = Math.max(result.effectiveRate, result.llcEffectiveRate, 1);
          const currentBarPct = Math.min(100, (result.effectiveRate / maxRate) * 100);
          const llcBarPct = Math.min(100, (result.llcEffectiveRate / maxRate) * 100);
          return <>
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <BrandCross />
                <span className="font-body text-[11px] sm:text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider truncate">{resolvedLocalLabel}</span>
              </div>
              <span className="font-body font-bold text-[#DC2626] text-sm sm:text-base shrink-0" data-testid="text-sin-llc">{formatCurrency(result.sinLLC)}<span className="text-[var(--text-3)] font-body text-[10px] font-normal">{t("calculator.perYear")}</span></span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--bg-2)] overflow-hidden mb-1">
              <div className="h-full rounded-full bg-gradient-to-r from-[#DC2626] to-[#EF4444] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(220,38,38,0.3)]" style={{ width: `${currentBarPct}%` }} />
            </div>
            <p className="font-body text-[10px] text-[#DC2626]/70 text-right font-semibold">~{result.effectiveRate}% {t("calculator.effectiveTaxBurden")}</p>

            <div className="h-px bg-[var(--border)] my-3" />

            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <BrandTick />
                <span className="font-body text-[11px] sm:text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider truncate">{t("calculator.withLLCInUSA")}</span>
              </div>
              <span className="font-body font-bold text-[#00E510] text-sm sm:text-base shrink-0" data-testid="text-con-llc">{formatCurrency(result.conLLC)}<span className="text-[var(--text-3)] font-body text-[10px] font-normal">{t("calculator.perYear")}</span></span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--bg-2)] overflow-hidden mb-1">
              <div className="h-full rounded-full bg-[#00E510] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,229,16,0.3)]" style={{ width: `${llcBarPct}%` }} />
            </div>
            <p className="font-body text-[10px] text-[#00E510]/70 text-right font-semibold">~{result.llcEffectiveRate}% {t("calculator.effectiveCost")}</p>
          </>;
        })()}
      </div>

      <details className="group rounded-xl border border-[var(--border)] bg-[var(--bg-1)] mb-5 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 hover:bg-[var(--bg-2)]/50 transition-colors select-none" data-testid="button-toggle-breakdown">
          <span className="font-body text-xs sm:text-[13px] font-semibold text-[var(--text-1)]">{t("calculator.seeFullBreakdown")}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--text-3)] transition-transform duration-200 group-open:rotate-180">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </summary>
        <div className="px-4 pb-4">
          <div className="pt-1 mb-4">
            <p className="font-body text-[10px] text-[#DC2626] uppercase tracking-wider font-semibold mb-2">{resolvedLocalLabel}</p>
            <div className="space-y-2">
              {result.breakdown.map((item) => (
                <div key={item.label} data-testid={`text-breakdown-${item.label}`}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-body text-[12px] sm:text-[13px] text-[var(--text-2)] leading-snug">{t(item.label, item.label)}</span>
                    <span className={`font-body font-semibold text-[12px] sm:text-[13px] shrink-0 ${item.amount < 0 ? "text-[#00E510]" : "text-[#DC2626]"}`}>{formatCurrency(item.amount)}</span>
                  </div>
                  {item.note && <p className="font-body text-[10px] text-[var(--text-3)] mt-0.5">{item.note}</p>}
                </div>
              ))}
            </div>
            {result.irpfBrackets && result.irpfBrackets.length > 0 && (
              <IrpfBracketsTable brackets={result.irpfBrackets} />
            )}
            <div className="mt-3 pt-2 border-t border-[#DC2626]/20 flex justify-between items-center">
              <span className="font-body text-xs font-semibold text-[#DC2626]">{t("calculator.total")}</span>
              <span className="font-body font-bold text-[#DC2626] text-xs">{formatCurrency(result.sinLLC)}{t("calculator.perYear")}</span>
            </div>
            {result.ivaNote > 0 && (
              <p className="font-body text-[10px] text-[var(--text-3)] mt-1.5" data-testid="text-iva-note">
                + {formatCurrency(result.ivaNote)}{t("calculator.perYear")} {t("calculator.ivaNote")} ({country === "espana" || country === "belgica" ? "21%" : country === "mexico" ? "16%" : country === "italia" ? "22%" : country === "reino-unido" || country === "francia" || country === "austria" ? "20%" : "19%"})
              </p>
            )}
            {result.gastosDeducibles > 0 && (
              <p className="font-body text-[10px] text-[var(--text-3)] mt-1">
                {t("calculator.deductibleApplied")} {formatCurrency(result.gastosDeducibles)}{t("calculator.perYear")}
              </p>
            )}
          </div>

          <div className="h-px bg-[var(--border)] mb-4" />

          <div>
            <p className="font-body text-[10px] text-[#00E510] uppercase tracking-wider font-semibold mb-2">{t("calculator.withLLCInUSA")}</p>
            <div className="space-y-2" data-testid="llc-breakdown">
              {result.llcBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-body text-[12px] sm:text-[13px] text-[var(--text-2)] leading-snug">{t(item.label, item.label)}</span>
                    <span className="font-body font-semibold text-[#00E510] text-[12px] sm:text-[13px] shrink-0">{formatCurrency(item.amount)}</span>
                  </div>
                  {item.note && <p className="font-body text-[10px] text-[var(--text-3)] mt-0.5">{t(item.note, item.note)}</p>}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-[#00E510]/20 flex justify-between items-center">
              <span className="font-body text-xs font-semibold text-[#00E510]">{t("calculator.annualTotal")}</span>
              <span className="font-body font-bold text-[#00E510] text-xs">{formatCurrency(result.conLLC)}{t("calculator.perYear")}</span>
            </div>
          </div>

          {result.spainIrpfWithLLC && (
            <>
              <div className="h-px bg-[var(--border)] my-4" />
              <div data-testid="spain-irpf-with-llc">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <circle cx="7" cy="7" r="6" stroke="#2563EB" strokeWidth="1.2" />
                    <path d="M7 4v3.5M7 9.5h.01" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <p className="font-body text-[10px] text-blue-500 uppercase tracking-wider font-semibold">
                    {t("calculator.irpfWithLLCTitle")}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200/50 bg-blue-50/30 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-[12px] text-[var(--text-2)]">{t("calculator.taxableBase")}</span>
                    <span className="font-body font-semibold text-[var(--text-1)] text-[12px]">{formatCurrency(result.spainIrpfWithLLC.baseImponible)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-[12px] text-[var(--text-2)]">{t("calculator.irpfToPay")}</span>
                    <span className="font-body font-bold text-blue-600 text-[13px]">{formatCurrency(result.spainIrpfWithLLC.irpf)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-blue-200/30">
                    <span className="font-body text-[11px] font-semibold text-blue-600">{t("calculator.totalCostLLCIrpf")}</span>
                    <span className="font-body font-bold text-blue-600 text-[12px]">{formatCurrency(result.conLLC + result.spainIrpfWithLLC.irpf)}{t("calculator.perYear")}</span>
                  </div>
                  <p className="font-body text-[10px] text-blue-500/70 mt-2">
                    {t("calculator.savingsVsNoLLC")}: {formatCurrency(Math.max(0, result.sinLLC - result.conLLC - result.spainIrpfWithLLC.irpf))}{t("calculator.perYear")}
                  </p>
                </div>
                {result.spainIrpfWithLLC.brackets.length > 0 && (
                  <IrpfBracketsTable brackets={result.spainIrpfWithLLC.brackets} />
                )}
              </div>
            </>
          )}
        </div>
      </details>

      <div className="rounded-xl border border-[rgba(0,229,16,0.15)] bg-[rgba(0,229,16,0.04)] p-4 mb-5">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#00E510]/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v4M6 7.5v.5M1 6a5 5 0 1010 0A5 5 0 001 6z" stroke="#00E510" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="font-body text-[10px] text-[#00E510] uppercase tracking-widest font-semibold mb-1">{t("calculator.profileAnalysis")}</p>
            <p className="font-body text-[13px] text-[var(--text-2)] leading-relaxed">{getInsight()}</p>
          </div>
        </div>
      </div>

      <p className="font-body text-[10px] text-[var(--text-3)] text-center mb-4 leading-relaxed">
        {t("calculator.disclaimer")}
      </p>

      <a
        href={lp("/agendar-asesoria")}
        className="flex items-center justify-center gap-2 w-full bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 py-3.5 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,opacity,transform] duration-200 mb-2.5"
        data-testid="button-agenda-orientativo"
      >
        {t("calculator.bookConsultation")}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

      <a
        href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("calculator.whatsappMessage", { savings: formatCurrency(result.ahorro), monthlyIncome: formatCurrency(income), yearlyIncome: formatCurrency(income * 12), regime: regimes.find(r => r.id === regime)?.label || "", country: countries.find(c => c.id === country)?.label || "" }))}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full text-center bg-transparent border border-[var(--border)] hover:border-[#00E510]/40 text-[#00E510] font-body font-semibold py-3 text-sm rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200"
        data-testid="button-analizar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#00E510"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        {t("calculator.consultWhatsapp")}
      </a>
    </div>
  );
}
