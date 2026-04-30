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
  //   "low"    → Madrid / Andalucía / La Rioja / Ceuta / Melilla
  //   "medium" → escala media (default — la mayor parte de CCAA)
  //   "high"   → Cataluña / Valencia / Asturias tramo alto
  // El mapa CCAA → perfil vive en `client/src/lib/calculator-config.ts`
  // (constante `CCAA_PROFILE_MAP`).
  ccaaProfile?: "low" | "medium" | "high";
  // Régimen Chile sociedad — Pro PYME 14 D N° 3 (25 %) vs Régimen General
  // 14 A (27 %). Default: general.
  chileRegimen?: "general" | "proPyme";
  // Hebesatz municipal Alemania — afecta a Gewerbesteuer.
  //   "low"    → 250 % (pequeñas localidades, ≈ 8,75 % efectivo)
  //   "medium" → 400 % (media nacional, ≈ 14,00 % efectivo) — default
  //   "high"   → 490 % (München / Frankfurt, ≈ 17,15 % efectivo)
  germanyHebesatz?: "low" | "medium" | "high";
  // Modo IVA — `general` (default, tipo estándar) o `exportB2B` (0 % por
  // inversión del sujeto pasivo / no sujeción intracomunitaria).
  vatMode?: "general" | "exportB2B";
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
