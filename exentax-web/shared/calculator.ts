export interface TaxBreakdown {
  label: string;
  amount: number;
  note?: string;
  noteParams?: Record<string, string | number>;
}

export interface IrpfBracketDetail {
  from: number;
  to: number;
  rate: number;
  taxInBracket: number;
}

export type ExpenseDeductPct = 100 | 80 | 50 | 30 | 20 | 0;

export interface ExpenseItem {
  id: string;
  label: string;
  monthly: number;
  deductPct: ExpenseDeductPct;
}

export type ExpenseGroup =
  | "tech"
  | "professional"
  | "marketing"
  | "office"
  | "comms"
  | "banking"
  | "insurance"
  | "training"
  | "contractors"
  | "travel"
  | "proportional"
  | "nondeductible"
  | "other";

export type ExpenseCategoryDef = {
  id: string;
  label: string;
  deductPct: ExpenseDeductPct;
  placeholder: string;
  group: ExpenseGroup;
};

export interface CalcOptions {
  tarifaPlana?: boolean;
  franceMicro?: boolean;
  // Perfil autonómico para IRPF España 2026:
  //   "low"    → Madrid / Andalucía / La Rioja
  //   "medium" → escala media (default)
  //   "high"   → Cataluña / Valencia / Asturias tramo alto
  ccaaProfile?: "low" | "medium" | "high";
}

export interface CalcResult {
  sinLLC: number;
  conLLC: number;
  ahorro: number;
  localLabel: string;
  breakdown: TaxBreakdown[];
  llcBreakdown: TaxBreakdown[];
  ivaNote: number;
  effectiveRate: number;
  llcEffectiveRate: number;
  irpfBrackets?: IrpfBracketDetail[];
  spainIrpfWithLLC?: {
    irpf: number;
    brackets: IrpfBracketDetail[];
    baseImponible: number;
  };
  gastosDeducibles: number;
}

export interface StructureResult {
  id: "autonomo" | "sociedad" | "llc";
  label: string;
  setupCost: number;
  fixedAnnualCost: number;
  taxes: number;
  totalAnnualCost: number;
  effectiveRate: number;
  breakdown: TaxBreakdown[];
}

export interface AllStructuresResult {
  autonomo: StructureResult;
  sociedad: StructureResult;
  llc: StructureResult;
  bestId: "autonomo" | "sociedad" | "llc";
  llcSavingsVsAutonomo: number;
  llcSavingsVsSociedad: number;
  annualIncome: number;
  gastosDeducibles: number;
}

export type RegimeDef = { id: string; label: string };
