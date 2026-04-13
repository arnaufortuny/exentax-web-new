import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/calculator";
import type { IrpfBracketDetail } from "@/lib/calculator";

export default function IrpfBracketsTable({ brackets }: { brackets: IrpfBracketDetail[] }) {
  const { t } = useTranslation();
  return (
    <div className="mt-2 rounded-lg border border-[rgba(0,229,16,0.12)] bg-[rgba(0,229,16,0.02)] overflow-hidden" data-testid="irpf-brackets-table">
      <div className="px-3 py-1.5 bg-[rgba(0,229,16,0.06)] border-b border-[rgba(0,229,16,0.1)]">
        <span className="font-body text-[10px] font-semibold text-[#00E510] uppercase tracking-wider">{t("calculator.irpfBracketsLabel")}</span>
      </div>
      <div className="divide-y divide-[rgba(0,229,16,0.06)]">
        {brackets.map((b, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-1.5 text-[11px]">
            <span className="font-body text-[var(--text-3)]">
              {formatCurrency(b.from)} → {b.to >= 300000 ? "+" : formatCurrency(b.to)}
            </span>
            <span className="font-body font-semibold text-[var(--text-2)]">{Math.round(b.rate * 100)}%</span>
            <span className="font-body font-semibold text-red-500">{formatCurrency(b.taxInBracket)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
