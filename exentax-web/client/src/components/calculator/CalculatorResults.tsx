import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import { formatCurrency, countries, regimes, LLC_FORMATION_COST, LLC_ANNUAL_COST } from "@/lib/calculator";
import type { IrpfBracketDetail, AllStructuresResult } from "@/lib/calculator";
import { useLangPath } from "@/hooks/useLangPath";
import AnimatedNumber from "./AnimatedNumber";
import { BrandTick, BrandCross } from "./BrandIcons";
import IrpfBracketsTable from "./IrpfBracketsTable";
import { trackWhatsAppClick } from "@/components/Tracking";

interface CalculatorResult {
  sinLLC: number;
  conLLC: number;
  ahorro: number;
  localLabel: string;
  breakdown: Array<{ label: string; amount: number; note?: string; noteParams?: Record<string, string | number> }>;
  llcBreakdown: Array<{ label: string; amount: number; note?: string; noteParams?: Record<string, string | number> }>;
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
  displayCurrency?: string;
  allStructures?: AllStructuresResult | null;
}

export default function CalculatorResults({ result, income, country, regime, getInsight, displayCurrency = "EUR", allStructures }: CalculatorResultsProps) {
  const { t } = useTranslation();
  const lp = useLangPath();
  const cur = displayCurrency;

  const fmt = (v: number) => formatCurrency(v, cur);

  const resolvedLocalLabel = (() => {
    const parts = result.localLabel.split("|");
    if (parts.length === 2) {
      const [regLabel, countryKey] = parts;
      const countryName = t(`calculator.countryLabels.${countryKey}`, countryKey);
      return `${regLabel} ${t("calculator.inCountry", { defaultValue: "en" })} ${countryName}`;
    }
    return result.localLabel;
  })();

  const llcIsBest = allStructures ? allStructures.bestId === "llc" : true;

  return (
    <div className="calc-results-enter" data-testid="calculator-results">

      {/* Headline savings card */}
      <div className="rounded-2xl p-5 sm:p-7 text-center mb-5 relative overflow-hidden calc-glow-enter border border-[rgba(var(--green-rgb),0.2)]" style={{ background: "rgba(var(--green-rgb),0.04)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 0 40px rgba(var(--green-rgb),0.08), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, var(--green) 0%, transparent 50%)" }} />
        <p className="relative font-body text-[11px] sm:text-[12px] text-[rgba(var(--green-rgb),0.8)] font-semibold mb-1.5">
          {llcIsBest
            ? t("calculator.estimatedAnnualSavings")
            : t("calculator.llcNotBestTitle", { defaultValue: "Honesto: en tu caso, otra estructura puede ganar" })}
        </p>
        <p className="relative font-heading font-bold text-[var(--green)] text-3xl sm:text-5xl leading-none mb-1 calc-savings-enter calc-savings-glow" data-testid="text-ahorro">
          <AnimatedNumber value={result.ahorro} format={(n) => fmt(n)} />
        </p>
        <p className="relative font-body text-[10px] text-[var(--text-3)] mt-1">{t("calculator.perYearWithLLC")}</p>
      </div>

      {/* 3-way side-by-side comparison */}
      {allStructures && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-1)] p-4 sm:p-5 mb-5" data-testid="three-way-comparison">
          <p className="font-body text-[12px] sm:text-[13px] font-semibold text-[var(--text-1)] mb-3">
            {t("calculator.threeWayTitle", { defaultValue: "Comparativa de las tres estructuras" })}
          </p>
          {(() => {
            const rows = [allStructures.autonomo, allStructures.sociedad, allStructures.llc];
            const maxTotal = Math.max(1, ...rows.map(r => r.totalAnnualCost));
            return (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] sm:text-xs">
                  <thead>
                    <tr className="text-[var(--text-3)] border-b border-[var(--border)]">
                      <th className="text-left font-medium py-1.5 pr-2">{t("calculator.structure", { defaultValue: "Estructura" })}</th>
                      <th className="text-right font-medium py-1.5 px-2">{t("calculator.setupCost", { defaultValue: "Setup" })}</th>
                      <th className="text-right font-medium py-1.5 px-2">{t("calculator.fixedAnnualCost", { defaultValue: "Coste fijo/año" })}</th>
                      <th className="text-right font-medium py-1.5 px-2">{t("calculator.taxes", { defaultValue: "Impuestos" })}</th>
                      <th className="text-right font-medium py-1.5 pl-2">{t("calculator.totalAnnual", { defaultValue: "Total/año" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => {
                      const isBest = allStructures.bestId === r.id;
                      const isLLC = r.id === "llc";
                      const barPct = (r.totalAnnualCost / maxTotal) * 100;
                      const labelText = r.id === "llc"
                        ? t("calculator.llcLabel", { defaultValue: r.label })
                        : t(`calculator.regimeLabels.${country}.${r.id}`, { defaultValue: r.label });
                      return (
                        <tr key={r.id} data-testid={`row-structure-${r.id}`} className={`border-b border-[var(--border)] last:border-0 ${isBest ? "bg-[rgba(var(--green-rgb),0.04)]" : ""}`}>
                          <td className="py-2 pr-2 align-top">
                            <div className="flex items-center gap-1.5">
                              {isBest && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--green)]" />}
                              <span className={`font-semibold ${isBest ? "text-[var(--green)]" : "text-[var(--text-1)]"}`}>{labelText}</span>
                            </div>
                            <div className="mt-1 h-1.5 rounded-full bg-[var(--bg-2)] overflow-hidden">
                              <div className={`h-full rounded-full ${isLLC ? "bg-[var(--green)]" : "bg-[#DC2626]/70"}`} style={{ width: `${barPct}%` }} />
                            </div>
                            <p className="text-[10px] text-[var(--text-3)] mt-0.5">~{r.effectiveRate}% {t("calculator.effectiveCost")}</p>
                          </td>
                          <td className="text-right px-2 align-top">{r.setupCost > 0 ? fmt(r.setupCost) : "–"}</td>
                          <td className="text-right px-2 align-top">{r.fixedAnnualCost > 0 ? fmt(r.fixedAnnualCost) : "–"}</td>
                          <td className="text-right px-2 align-top">{fmt(r.taxes)}</td>
                          <td className={`text-right pl-2 align-top font-bold ${isBest ? "text-[var(--green)]" : "text-[var(--text-1)]"}`} data-testid={`text-total-${r.id}`}>{fmt(r.totalAnnualCost)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            {[
              { id: "autonomo", delta: allStructures.llcSavingsVsAutonomo, label: t("calculator.deltaVsAutonomo", { defaultValue: "LLC vs autónomo" }) },
              { id: "sociedad", delta: allStructures.llcSavingsVsSociedad, label: t("calculator.deltaVsSociedad", { defaultValue: "LLC vs sociedad local" }) },
            ].map(d => {
              const positive = d.delta > 0;
              const negative = d.delta < 0;
              const prefix = positive
                ? t("calculator.savesYou", { defaultValue: "Ahorras" })
                : negative
                  ? t("calculator.costsYouMore", { defaultValue: "Cuesta más" })
                  : t("calculator.equal", { defaultValue: "Igual" });
              return (
                <div key={d.id} className="rounded-lg bg-[var(--bg-2)] p-2">
                  <span className="text-[var(--text-3)]">{d.label}</span>
                  <div className={`font-bold ${positive ? "text-[var(--green)]" : negative ? "text-[#DC2626]" : "text-[var(--text-3)]"}`} data-testid={`text-llc-delta-${d.id}`}>
                    {prefix} {fmt(Math.abs(d.delta))}/año
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Honesty disclosure when LLC isn't the cheapest */}
      {allStructures && !llcIsBest && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 p-4 mb-5" data-testid="llc-not-best-warning">
          <p className="font-body text-[12px] font-semibold text-amber-700 dark:text-amber-400 mb-1">
            {t("calculator.llcNotBestHeader", { defaultValue: "En tu escenario, la LLC no es la opción más barata" })}
          </p>
          <p className="font-body text-[11px] text-[var(--text-2)] leading-relaxed">
            {t("calculator.llcNotBestBody", { defaultValue: "La LLC USA brilla con servicios digitales, consultoría internacional y clientes fuera de tu país de residencia. Con el perfil que has indicado puede no ser la opción óptima, y preferimos decírtelo a forzar el resultado." })}
          </p>
        </div>
      )}

      {/* Original two-bar comparison (preserved) */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-1)] p-4 sm:p-5 mb-5">
        {(() => {
          const maxRate = Math.max(result.effectiveRate, result.llcEffectiveRate, 1);
          const currentBarPct = Math.min(100, (result.effectiveRate / maxRate) * 100);
          const llcBarPct = Math.min(100, (result.llcEffectiveRate / maxRate) * 100);
          return <>
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <BrandCross />
                <span className="font-body text-[12px] sm:text-[13px] font-semibold text-[var(--text-2)] truncate">{resolvedLocalLabel}</span>
              </div>
              <span className="font-body font-bold text-[#DC2626] text-sm sm:text-base shrink-0" data-testid="text-sin-llc">{fmt(result.sinLLC)}<span className="text-[var(--text-3)] font-body text-[10px] font-normal">{t("calculator.perYear")}</span></span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--bg-2)] overflow-hidden mb-1">
              <div className="h-full rounded-full bg-gradient-to-r from-[#DC2626] to-[#EF4444] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(220,38,38,0.3)]" style={{ width: `${currentBarPct}%` }} />
            </div>
            <p className="font-body text-[10px] text-[#DC2626]/70 text-right font-semibold">~{result.effectiveRate}% {t("calculator.effectiveTaxBurden")}</p>

            <div className="h-px bg-[var(--border)] my-3" />

            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <BrandTick />
                <span className="font-body text-[12px] sm:text-[13px] font-semibold text-[var(--text-2)] truncate">{t("calculator.withLLCInUSA")}</span>
              </div>
              <span className="font-body font-bold text-[var(--green)] text-sm sm:text-base shrink-0" data-testid="text-con-llc">{fmt(result.conLLC)}<span className="text-[var(--text-3)] font-body text-[10px] font-normal">{t("calculator.perYear")}</span></span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--bg-2)] overflow-hidden mb-1">
              <div className="h-full rounded-full bg-[var(--green)] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--green-rgb),0.3)]" style={{ width: `${llcBarPct}%` }} />
            </div>
            <p className="font-body text-[10px] text-[rgba(var(--green-rgb),0.7)] text-right font-semibold">~{result.llcEffectiveRate}% {t("calculator.effectiveCost")}</p>
          </>;
        })()}
      </div>

      {/* Key persuasive messages */}
      <div className="rounded-xl border border-[rgba(var(--green-rgb),0.2)] bg-[rgba(var(--green-rgb),0.03)] p-4 mb-5" data-testid="key-messages">
        <p className="font-body text-[12px] font-semibold text-[var(--green)] mb-2">
          {t("calculator.keyMessagesTitle", { defaultValue: "Por qué Exentax + LLC USA" })}
        </p>
        <ul className="space-y-1.5">
          {[
            { id: "zeroUS", txt: t("calculator.keyMsg.zeroUS", { defaultValue: "0% federal USA si no operas en territorio estadounidense (disregarded entity)." }) },
            { id: "noFixed", txt: t("calculator.keyMsg.noFixed", { defaultValue: "Sin cuota fija mensual: ~2.000 € de setup el primer año y ~1.400 €/año de mantenimiento (Registered Agent + Forms 5472/1120)." }) },
            { id: "banking", txt: t("calculator.keyMsg.banking", { defaultValue: "Acceso a banca y pasarelas USA (Mercury, Wise, Stripe, etc.)." }) },
            { id: "liability", txt: t("calculator.keyMsg.liability", { defaultValue: "Responsabilidad limitada real para tu actividad digital internacional." }) },
            { id: "noTravel", txt: t("calculator.keyMsg.noTravel", { defaultValue: "No requiere viajar ni tener SSN/ITIN para empezar, Exentax obtiene también el ITIN." }) },
            { id: "amortizes", txt: t("calculator.keyMsg.amortizes", { defaultValue: "El setup se amortiza rápidamente cuando hay ahorro fiscal recurrente." }) },
          ].map(m => (
            <li key={m.id} className="flex items-start gap-2 text-[11px] text-[var(--text-2)] leading-snug">
              <BrandTick />
              <span>{m.txt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transparent warnings */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 p-4 mb-5" data-testid="warnings-block">
        <p className="font-body text-[12px] font-semibold text-amber-700 dark:text-amber-400 mb-2">
          {t("calculator.warningsTitle", { defaultValue: "Antes de decidir, ten esto en cuenta" })}
        </p>
        <ul className="space-y-1 text-[11px] text-[var(--text-2)] leading-snug list-disc list-inside">
          <li>{t("calculator.warn.notForAll", { defaultValue: "No es apta para todos los casos, funciona mejor con servicios digitales, consultoría y freelancers internacionales." })}</li>
          <li>{t("calculator.warn.notElim", { defaultValue: "No elimina impuestos: los optimiza legalmente. Tu país de residencia puede gravar los beneficios según sus reglas." })}</li>
          <li>{t("calculator.warn.localOnly", { defaultValue: "Si solo facturas a clientes locales, una LLC puede no ser la opción óptima." })}</li>
        </ul>
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
            <p className="font-body text-[11px] text-[#DC2626] font-semibold mb-2">{resolvedLocalLabel}</p>
            <div className="space-y-2">
              {result.breakdown.map((item) => (
                <div key={item.label} data-testid={`text-breakdown-${item.label}`}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-body text-[12px] sm:text-[13px] text-[var(--text-2)] leading-snug">{t(item.label, item.label)}</span>
                    <span className={`font-body font-semibold text-[12px] sm:text-[13px] shrink-0 ${item.amount < 0 ? "text-[var(--green)]" : "text-[#DC2626]"}`}>{fmt(item.amount)}</span>
                  </div>
                  {item.note && <p className="font-body text-[10px] text-[var(--text-3)] mt-0.5">{item.noteParams ? t(item.note, { ...item.noteParams, defaultValue: item.note }) : t(item.note, item.note)}</p>}
                </div>
              ))}
            </div>
            {result.irpfBrackets && result.irpfBrackets.length > 0 && (
              <IrpfBracketsTable brackets={result.irpfBrackets} />
            )}
            <div className="mt-3 pt-2 border-t border-[#DC2626]/20 flex justify-between items-center">
              <span className="font-body text-xs font-semibold text-[#DC2626]">{t("calculator.total")}</span>
              <span className="font-body font-bold text-[#DC2626] text-xs">{fmt(result.sinLLC)}{t("calculator.perYear")}</span>
            </div>
            {result.ivaNote > 0 && (
              <p className="font-body text-[10px] text-[var(--text-3)] mt-1.5" data-testid="text-iva-note">
                + {fmt(result.ivaNote)}{t("calculator.perYear")} {t("calculator.ivaNote")} ({country === "espana" || country === "belgica" ? "21%" : country === "mexico" ? "16%" : country === "italia" ? "22%" : country === "reino-unido" || country === "francia" || country === "austria" ? "20%" : "19%"})
              </p>
            )}
            {result.gastosDeducibles > 0 && (
              <p className="font-body text-[10px] text-[var(--text-3)] mt-1">
                {t("calculator.deductibleApplied")} {fmt(result.gastosDeducibles)}{t("calculator.perYear")}
              </p>
            )}
          </div>

          <div className="h-px bg-[var(--border)] mb-4" />

          <div>
            <p className="font-body text-[11px] text-[var(--green)] font-semibold mb-2">{t("calculator.withLLCInUSA")}</p>
            <div className="space-y-2" data-testid="llc-breakdown">
              {result.llcBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-body text-[12px] sm:text-[13px] text-[var(--text-2)] leading-snug">{t(item.label, item.label)}</span>
                    <span className="font-body font-semibold text-[var(--green)] text-[12px] sm:text-[13px] shrink-0">{fmt(item.amount)}</span>
                  </div>
                  {item.note && <p className="font-body text-[10px] text-[var(--text-3)] mt-0.5">{item.noteParams ? t(item.note, { ...item.noteParams, defaultValue: item.note }) : t(item.note, item.note)}</p>}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-[rgba(var(--green-rgb),0.2)] flex justify-between items-center">
              <span className="font-body text-xs font-semibold text-[var(--green)]">{t("calculator.annualTotal")}</span>
              <span className="font-body font-bold text-[var(--green)] text-xs">{fmt(result.conLLC)}{t("calculator.perYear")}</span>
            </div>
            <p className="font-body text-[10px] text-[var(--text-3)] mt-1">
              {t("calculator.setupMaintenanceLine", { setup: fmt(LLC_FORMATION_COST), maint: fmt(LLC_ANNUAL_COST), defaultValue: `Setup ~${fmt(LLC_FORMATION_COST)} (pago único) · Mantenimiento ~${fmt(LLC_ANNUAL_COST)}/año` })}
            </p>
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
                  <p className="font-body text-[11px] text-blue-500 font-semibold">
                    {t("calculator.irpfWithLLCTitle")}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200/50 bg-blue-50/30 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-[12px] text-[var(--text-2)]">{t("calculator.taxableBase")}</span>
                    <span className="font-body font-semibold text-[var(--text-1)] text-[12px]">{fmt(result.spainIrpfWithLLC.baseImponible)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-[12px] text-[var(--text-2)]">{t("calculator.irpfToPay")}</span>
                    <span className="font-body font-bold text-blue-600 text-[13px]">{fmt(result.spainIrpfWithLLC.irpf)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-blue-200/30">
                    <span className="font-body text-[11px] font-semibold text-blue-600">{t("calculator.totalCostLLCIrpf")}</span>
                    <span className="font-body font-bold text-blue-600 text-[12px]">{fmt(result.conLLC + result.spainIrpfWithLLC.irpf)}{t("calculator.perYear")}</span>
                  </div>
                  <p className="font-body text-[10px] text-blue-500/70 mt-2">
                    {t("calculator.savingsVsNoLLC")}: {fmt(Math.max(0, result.sinLLC - result.conLLC - result.spainIrpfWithLLC.irpf))}{t("calculator.perYear")}
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

      <div className="rounded-xl border border-[rgba(var(--green-rgb),0.15)] bg-[rgba(var(--green-rgb),0.04)] p-4 mb-5">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[rgba(var(--green-rgb),0.1)] flex items-center justify-center shrink-0 mt-0.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[var(--green)]"><path d="M6 1v4M6 7.5v.5M1 6a5 5 0 1010 0A5 5 0 001 6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="font-body text-[11px] text-[var(--green)] font-semibold mb-1">{t("calculator.profileAnalysis")}</p>
            <p className="font-body text-[13px] text-[var(--text-2)] leading-relaxed">{getInsight()}</p>
          </div>
        </div>
      </div>

      {result.ahorro > 0 && (() => {
        const monthlySavings = result.ahorro / 12;
        const setupPaybackMonths = Math.max(1, Math.ceil(LLC_FORMATION_COST / monthlySavings));
        const maintPaybackMonths = Math.max(1, Math.ceil(LLC_ANNUAL_COST / monthlySavings));
        return (
          <div className="rounded-xl border border-[rgba(var(--green-rgb),0.3)] bg-[rgba(var(--green-rgb),0.05)] p-4 mb-5" data-testid="roi-card">
            <p className="font-body text-[12px] font-semibold text-[var(--green)] mb-1.5">
              {t("calculator.roiTitle", { defaultValue: "ROI realista del setup" })}
            </p>
            <p className="font-body text-[12.5px] sm:text-[13px] text-[var(--text-2)] leading-relaxed">
              {t("calculator.roiBody", {
                defaultValue: "Con tu ahorro estimado, el setup de {{setup}} se amortiza en ~{{months}} meses. A partir de ahí, los {{maint}}/año de mantenimiento se devuelven solos en ~{{maintMonths}} meses cada año.",
                setup: fmt(LLC_FORMATION_COST),
                months: setupPaybackMonths,
                maint: fmt(LLC_ANNUAL_COST),
                maintMonths: maintPaybackMonths,
              })}
            </p>
            <p className="font-body text-[11px] text-[var(--text-3)] mt-2">
              {t("calculator.roiNudge", { defaultValue: "Cada mes que retrasas la decisión sigues pagando como autónomo. Una asesoría de 30 min te dice si en tu caso compensa." })}
            </p>
          </div>
        );
      })()}

      <p className="font-body text-[10px] text-[var(--text-3)] text-center mb-4 leading-relaxed">
        {t("calculator.disclaimer")}
      </p>

      <a
        href={lp("book")}
        className="flex items-center justify-center gap-2 w-full btn-primary px-6 py-3.5 text-sm rounded-full mb-2.5"
        data-testid="button-agenda-orientativo"
      >
        {t("calculator.bookConsultation")}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

      <a
        href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("calculator.whatsappMessage", { savings: fmt(result.ahorro), monthlyIncome: fmt(income), yearlyIncome: fmt(income * 12), regime: t(`calculator.regimeLabels.${country}.${regime}`, { defaultValue: regimes.find(r => r.id === regime)?.label || "" }), country: t(`calculator.countryLabels.${country}`, { defaultValue: countries.find(c => c.id === country)?.label || "" }) }))}`}
        onClick={() => trackWhatsAppClick("calculator_results")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full text-center bg-transparent border border-[var(--border)] hover:border-[rgba(var(--green-rgb),0.4)] text-[var(--green)] font-body font-semibold py-3 text-sm rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200"
        data-testid="button-analizar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        {t("calculator.consultWhatsapp")}
      </a>
    </div>
  );
}
