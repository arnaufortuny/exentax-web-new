import type {
  TaxBreakdown,
  IrpfBracketDetail,
  ExpenseItem,
  ExpenseCategoryDef,
  CalcOptions,
  CalcResult,
  StructureResult,
  AllStructuresResult,
  RegimeDef,
} from "@shared/calculator";

export type {
  TaxBreakdown,
  IrpfBracketDetail,
  ExpenseItem,
  ExpenseCategoryDef,
  CalcOptions,
  CalcResult,
  StructureResult,
  AllStructuresResult,
  RegimeDef,
};

const BASE_EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
  // Tecnología
  { id: "software", label: "Software y herramientas", deductPct: 100, placeholder: "120", group: "tech" },
  { id: "hosting", label: "Hosting / servidores", deductPct: 100, placeholder: "50", group: "tech" },
  // Servicios profesionales
  { id: "asesoria", label: "Asesoría y gestoría", deductPct: 100, placeholder: "100", group: "professional" },
  { id: "legal", label: "Servicios legales", deductPct: 100, placeholder: "60", group: "professional" },
  // Marketing
  { id: "marketing", label: "Marketing y publicidad", deductPct: 100, placeholder: "200", group: "marketing" },
  // Oficina / coworking
  { id: "coworking", label: "Coworking / oficina", deductPct: 100, placeholder: "250", group: "office" },
  // Internet / comunicaciones
  { id: "telefono", label: "Internet y comunicaciones", deductPct: 100, placeholder: "60", group: "comms" },
  { id: "movil", label: "Móvil (uso proporcional)", deductPct: 50, placeholder: "30", group: "proportional" },
  // Servicios bancarios y pasarelas
  { id: "bancos", label: "Banca y pasarelas de pago", deductPct: 100, placeholder: "40", group: "banking" },
  // Seguros
  { id: "seguros", label: "Seguros profesionales", deductPct: 100, placeholder: "60", group: "insurance" },
  // Formación
  { id: "formacion", label: "Formación profesional", deductPct: 100, placeholder: "80", group: "training" },
  // Contratistas
  { id: "contratistas", label: "Contratistas / freelancers", deductPct: 100, placeholder: "300", group: "contractors" },
  // Viajes
  { id: "viajesTransporte", label: "Viajes (transporte)", deductPct: 100, placeholder: "120", group: "travel" },
  { id: "viajesComidas", label: "Viajes (comidas, 50%)", deductPct: 50, placeholder: "80", group: "travel" },
  // Home office / vehículo proporcionales
  { id: "homeOffice", label: "Home office (proporcional)", deductPct: 30, placeholder: "150", group: "proportional" },
  { id: "vehiculo", label: "Vehículo (uso proporcional)", deductPct: 50, placeholder: "150", group: "proportional" },
  // Otros
  { id: "otros", label: "Otros gastos profesionales", deductPct: 100, placeholder: "50", group: "other" },
];

export const NON_DEDUCTIBLE_INFO: { id: string; label: string }[] = [
  { id: "personal", label: "Gastos personales / familiares" },
  { id: "multas", label: "Multas y sanciones" },
  { id: "entretenimiento", label: "Entretenimiento puro (post-TCJA)" },
  { id: "distributions", label: "Distributions de la LLC al socio" },
];

const COUNTRY_EXPENSE_OVERRIDES: Record<string, Partial<Record<string, { deductPct: 100 | 80 | 50 | 20; label?: string }>>> = {
  espana: {
    telefono: { deductPct: 50 },
    vehiculo: { deductPct: 50 },
  },
  mexico: {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 100 },
  },
  chile: {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 100 },
  },
  "reino-unido": {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 50, label: "Vehículo (mileage allowance)" },
  },
  francia: {
    telefono: { deductPct: 50 },
    vehiculo: { deductPct: 50, label: "Vehículo (frais réels)" },
  },
  belgica: {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 50, label: "Vehículo (75% max según CO₂)" },
  },
  alemania: {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 50, label: "Vehículo (1%-Regelung / Fahrtenbuch)" },
  },
  portugal: {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 50, label: "Veículo (uso misto profissional)" },
  },
};

export function getExpenseCategories(country: string): ExpenseCategoryDef[] {
  const overrides = COUNTRY_EXPENSE_OVERRIDES[country] || {};
  return BASE_EXPENSE_CATEGORIES.map(cat => {
    const override = overrides[cat.id];
    if (!override) return cat;
    return {
      ...cat,
      deductPct: override.deductPct,
      label: override.label || cat.label,
    };
  });
}


export function calcDeductibleTotal(items: ExpenseItem[]): number {
  return items.reduce((sum, item) => sum + Math.round(item.monthly * 12 * item.deductPct / 100), 0);
}

import {
  PERSONAL_DEDUCTION_ES,
  IRPF_BRACKETS,
  getIrpfBrackets,
  SS_AUTONOMO_BRACKETS_2026,
  TARIFA_PLANA_MONTHLY_ES,
  SPAIN_DIVIDEND_BRACKETS,
  SPAIN_SOCIEDAD_ADMIN_BASE_MIN,
  SPAIN_SOCIEDAD_ADMIN_RATE,
  SPAIN_SOCIEDAD_ADMIN_ANNUAL_COSTS,
  SPAIN_SOCIEDAD_ADMIN_PROFIT_SHARE,
  SPAIN_IS_RATE_REDUCED,
  SPAIN_IS_RATE_GENERAL,
  SPAIN_IS_REDUCED_REVENUE_CAP,
  UK_INCOME_TAX_BRACKETS,
  UK_NI_PRIMARY_THRESHOLD,
  UK_NI_UPPER_LIMIT,
  UK_NI_RATE_MAIN,
  UK_NI_RATE_ABOVE,
  UK_CT_SMALL_PROFITS,
  UK_CT_MAIN_RATE,
  UK_CT_SMALL_THRESHOLD,
  UK_LTD_ACCOUNTANCY_ANNUAL,
  BELGIUM_IPP_BRACKETS,
  BELGIUM_INDEP_SS_RATE,
  BELGIUM_IS_REDUCED,
  BELGIUM_IS_GENERAL,
  BELGIUM_IS_REDUCED_THRESHOLD,
  BELGIUM_DIVIDEND_RATE,
  BELGIUM_COMPTABLE_ANNUAL,
  FRANCE_IR_BRACKETS,
  FRANCE_URSSAF_RATE,
  FR_MICRO_ABATTEMENT_BNC,
  FR_MICRO_URSSAF_RATE,
  FR_MICRO_CEILING_BNC as _FR_MICRO_CEILING_BNC,
  FR_PRELEVEMENTS_SOCIAUX_RATE,
  FR_REEL_NET_BASE_FACTOR,
  FR_IS_SMALL_RATE,
  FR_IS_GENERAL_RATE,
  FR_IS_SMALL_THRESHOLD,
  FR_DIVIDEND_FLAT_TAX,
  FR_COMPTABLE_ANNUAL,
  GERMANY_EST_BRACKETS,
  GERMANY_SOLI_RATE,
  GERMANY_SV_RATE,
  GERMANY_KST_RATE,
  GERMANY_GEWERBE_EFFECTIVE_RATE,
  GERMANY_KAPESTG_RATE,
  GERMANY_STEUERBERATER_ANNUAL,
  MEXICO_ISR_BRACKETS,
  MEXICO_IMSS_RATE,
  MEXICO_ISR_PM_RATE,
  MEXICO_DIVIDEND_RATE,
  MEXICO_CONTABILIDAD_ANNUAL,
  CHILE_GLOBAL_COMPLEMENTARIO_BRACKETS,
  CHILE_AFP_RATE,
  CHILE_PRIMERA_CATEGORIA_RATE,
  CHILE_DIVIDEND_RATE,
  CHILE_CONTABILIDAD_ANNUAL,
  PORTUGAL_IRS_BRACKETS,
  PORTUGAL_IRS_DERRAMA_RATE,
  PORTUGAL_SS_AUTONOMO_RATE,
  PORTUGAL_SS_AUTONOMO_BASE_FACTOR,
  PORTUGAL_IRC_RATE,
  PORTUGAL_IRC_DERRAMA_MUNICIPAL,
  PORTUGAL_DIVIDEND_RATE,
  PORTUGAL_CONTABILISTA_ANNUAL,
  AUTONOMO_NET_FACTORS,
  SOCIEDAD_PROFIT_FACTORS,
  DEFAULT_AUTONOMO_NET_FACTOR,
  DEFAULT_SOCIEDAD_PROFIT_FACTOR,
  UK_DIVIDEND_PAYOUT_RATIO,
  UK_DIVIDEND_EFFECTIVE_RATE,
  LLC_FORMATION_COST as _LLC_FORMATION_COST,
  LLC_ANNUAL_COST as _LLC_ANNUAL_COST,
  SOCIEDAD_COSTS,
  STRUCTURE_AMORTIZATION_YEARS,
  COUNTRY_VAT_RATES,
  ACTIVITY_EXPENSE_RATE,
  ACTIVITY_EXPENSE_RATE_DEFAULT,
  DISPLAY_CURRENCIES as _DISPLAY_CURRENCIES,
  GBP_PER_EUR,
  _MEXICO_PESO_PER_EUR_INTERNAL as MXN_PER_EUR,
  _CHILE_PESO_PER_EUR_INTERNAL as CLP_PER_EUR,
  MONTHLY_INCOME_MIN as _MONTHLY_INCOME_MIN,
  MONTHLY_INCOME_MAX as _MONTHLY_INCOME_MAX,
  MONTHLY_INCOME_SANITY_MAX,
} from "./calculator-config";

// Re-export public surface that other modules import from "@/lib/calculator".
export const LLC_FORMATION_COST = _LLC_FORMATION_COST;
export const LLC_ANNUAL_COST = _LLC_ANNUAL_COST;
export const FR_MICRO_CEILING_BNC = _FR_MICRO_CEILING_BNC;
export const DISPLAY_CURRENCIES = _DISPLAY_CURRENCIES;
export const MONTHLY_INCOME_MIN = _MONTHLY_INCOME_MIN;
export const MONTHLY_INCOME_MAX = _MONTHLY_INCOME_MAX;
export { MONTHLY_INCOME_SANITY_MAX };

/**
 * IRPF España con desglose por tramo. PRECISION INVARIANT (Bloque 5 audit
 * 2026-04): el `tax` total devuelto debe ser exactamente la suma de los
 * `taxInBracket` (ya redondeados) — antes de Q2-2026 sumábamos el valor
 * sin redondear y luego redondeábamos al final, lo que producía
 * discrepancias de ±1 € entre el total y la tabla mostrada en el UI.
 */
function calcSpanishIRPFDetailed(taxableBase: number, ccaaProfile?: "low" | "medium" | "high"): { tax: number; brackets: IrpfBracketDetail[] } {
  const base = Math.max(0, taxableBase - PERSONAL_DEDUCTION_ES);
  const details: IrpfBracketDetail[] = [];
  let tax = 0;
  let prev = 0;
  const brackets = ccaaProfile ? getIrpfBrackets(ccaaProfile) : IRPF_BRACKETS;
  for (const b of brackets) {
    if (base <= prev) break;
    const taxable = Math.min(base, b.limit) - prev;
    const taxInBracket = Math.round(taxable * b.rate);
    details.push({
      from: prev,
      to: Math.min(base, b.limit),
      rate: b.rate,
      taxInBracket,
    });
    tax += taxInBracket;
    prev = b.limit;
  }
  return { tax, brackets: details };
}

function calcSpanishIRPF(taxableBase: number, ccaaProfile?: "low" | "medium" | "high"): number {
  return calcSpanishIRPFDetailed(taxableBase, ccaaProfile).tax;
}

function calcSpanishSS(monthlyNetIncome: number, tarifaPlana: boolean = false): { annual: number; monthly: number; bracket: { limit: number; monthly: number } } {
  if (tarifaPlana) {
    return {
      annual: TARIFA_PLANA_MONTHLY_ES * 12,
      monthly: TARIFA_PLANA_MONTHLY_ES,
      bracket: { limit: Infinity, monthly: TARIFA_PLANA_MONTHLY_ES },
    };
  }
  const bracket = SS_AUTONOMO_BRACKETS_2026.find((b) => monthlyNetIncome <= b.limit) ?? SS_AUTONOMO_BRACKETS_2026[SS_AUTONOMO_BRACKETS_2026.length - 1];
  return { annual: bracket.monthly * 12, monthly: bracket.monthly, bracket };
}

function calcSociedadAdminSS(monthlySalary: number): { annual: number; monthly: number } {
  const base = Math.max(SPAIN_SOCIEDAD_ADMIN_BASE_MIN, monthlySalary);
  const monthly = Math.round(base * SPAIN_SOCIEDAD_ADMIN_RATE);
  return { annual: monthly * 12, monthly };
}

function calcSpanishDividendTax(amount: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of SPAIN_DIVIDEND_BRACKETS) {
    if (amount <= prev) break;
    tax += (Math.min(amount, b.limit) - prev) * b.rate;
    prev = b.limit;
  }
  return Math.round(tax);
}

function applyBrackets(base: number, brackets: { limit: number; rate: number }[]): number {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (base <= prev) break;
    tax += (Math.min(base, b.limit) - prev) * b.rate;
    prev = b.limit;
  }
  return Math.round(tax);
}

function calcUKTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];
  const annualGBP = annualIncomeEUR * GBP_PER_EUR;

  if (regime === "autonomo") {
    const netBaseGBP = annualGBP * (AUTONOMO_NET_FACTORS["reino-unido"] ?? DEFAULT_AUTONOMO_NET_FACTOR);
    const incomeTaxGBP = applyBrackets(netBaseGBP, UK_INCOME_TAX_BRACKETS);
    const incomeTax = Math.round(incomeTaxGBP / GBP_PER_EUR);
    const niBase = Math.max(0, netBaseGBP - UK_NI_PRIMARY_THRESHOLD);
    const upperLimit = UK_NI_UPPER_LIMIT - UK_NI_PRIMARY_THRESHOLD;
    const niGBP = niBase <= upperLimit
      ? niBase * UK_NI_RATE_MAIN
      : upperLimit * UK_NI_RATE_MAIN + (niBase - upperLimit) * UK_NI_RATE_ABOVE;
    const ni = Math.round(niGBP / GBP_PER_EUR);
    breakdown.push({ label: "calculator.bd.uk.incomeTax", amount: incomeTax, note: "calculator.bd.uk.incomeTax_note" });
    breakdown.push({ label: "calculator.bd.uk.ni", amount: ni, note: "calculator.bd.uk.ni_note" });
    return { tax: incomeTax + ni, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS["reino-unido"] ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const corpTaxRate = profit * GBP_PER_EUR <= UK_CT_SMALL_THRESHOLD ? UK_CT_SMALL_PROFITS : UK_CT_MAIN_RATE;
    const corpTax = Math.round(profit * corpTaxRate);
    const dividendos = Math.round((profit - corpTax) * UK_DIVIDEND_EFFECTIVE_RATE * UK_DIVIDEND_PAYOUT_RATIO);
    breakdown.push({ label: "calculator.bd.uk.corpTax", amount: corpTax });
    breakdown.push({ label: "calculator.bd.uk.dividendTax", amount: dividendos });
    breakdown.push({ label: "calculator.bd.uk.accountancy", amount: UK_LTD_ACCOUNTANCY_ANNUAL });
    return { tax: corpTax + dividendos + UK_LTD_ACCOUNTANCY_ANNUAL, breakdown };
  }
}

function calcBelgiumTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * (AUTONOMO_NET_FACTORS.belgica ?? DEFAULT_AUTONOMO_NET_FACTOR);
    const irpp = applyBrackets(netBase, BELGIUM_IPP_BRACKETS);
    const ss = Math.round(netBase * BELGIUM_INDEP_SS_RATE);
    breakdown.push({ label: "calculator.bd.belgica.ipp", amount: irpp, note: "calculator.bd.belgica.ipp_note" });
    breakdown.push({ label: "calculator.bd.belgica.ssIndep", amount: ss, note: "calculator.bd.belgica.ssIndep_note" });
    return { tax: irpp + ss, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS.belgica ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const isRate = profit <= BELGIUM_IS_REDUCED_THRESHOLD ? BELGIUM_IS_REDUCED : BELGIUM_IS_GENERAL;
    const is = Math.round(profit * isRate);
    const dividendos = Math.round((profit - is) * BELGIUM_DIVIDEND_RATE);
    breakdown.push({ label: "calculator.bd.belgica.isSoc", amount: is });
    breakdown.push({ label: "calculator.bd.belgica.dividendos", amount: dividendos });
    breakdown.push({ label: "calculator.bd.belgica.comptabilite", amount: BELGIUM_COMPTABLE_ANNUAL });
    return { tax: is + dividendos + BELGIUM_COMPTABLE_ANNUAL, breakdown };
  }
}

// Régime micro auto-entrepreneur (BNC services / professions libérales):
// abattement forfaitaire de 50% sobre el chiffre d'affaires antes del IR
// progresivo y cotisations URSSAF ~22% sobre el CA bruto. No hay deducción
// de gastos reales — el abattement los reemplaza. Es opcional — la activa
// el flag CalcOptions.franceMicro.
// Plafond 2025 du régime micro BNC (services / professions libérales):
// 77.700 € de chiffre d'affaires HT por año. Por encima de este umbral
// el contribuyente pierde el régimen y pasa al régime réel (BNC). El
// flag `CalcOptions.franceMicro` se ignora silenciosamente cuando el
// CA supera el plafond, para no devolver un cálculo legalmente inválido.

function calcFranceTax(annualIncomeEUR: number, regime: string, micro: boolean = false): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    if (micro) {
      // En micro, annualIncomeEUR representa el chiffre d'affaires bruto.
      const irBase = Math.max(0, annualIncomeEUR * (1 - FR_MICRO_ABATTEMENT_BNC));
      const ir = applyBrackets(irBase, FRANCE_IR_BRACKETS);
      const ss = Math.round(annualIncomeEUR * FR_MICRO_URSSAF_RATE);
      breakdown.push({ label: "Impôt sur le revenu (micro, abattement 50%)", amount: ir, note: "BNC services / professions libérales" });
      breakdown.push({ label: "Cotisations URSSAF (micro)", amount: ss, note: "~22% sur chiffre d'affaires (BNC services)" });
      return { tax: ir + ss, breakdown };
    }
    const netBase = annualIncomeEUR * FR_REEL_NET_BASE_FACTOR;
    const ir = applyBrackets(netBase, FRANCE_IR_BRACKETS);
    const ss = Math.round(annualIncomeEUR * FRANCE_URSSAF_RATE);
    breakdown.push({ label: "calculator.bd.francia.ir", amount: ir, note: "calculator.bd.francia.ir_note" });
    breakdown.push({ label: "calculator.bd.francia.urssaf", amount: ss, note: "calculator.bd.francia.urssaf_note" });
    return { tax: ir + ss, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS.francia ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const isSmall = Math.min(profit, FR_IS_SMALL_THRESHOLD) * FR_IS_SMALL_RATE;
    const isRest = Math.max(0, profit - FR_IS_SMALL_THRESHOLD) * FR_IS_GENERAL_RATE;
    const is = Math.round(isSmall + isRest);
    const dividendos = Math.round((profit - is) * FR_DIVIDEND_FLAT_TAX);
    breakdown.push({ label: "calculator.bd.francia.isSoc", amount: is, note: "calculator.bd.francia.isSoc_note" });
    breakdown.push({ label: "calculator.bd.francia.dividendos", amount: dividendos });
    breakdown.push({ label: "calculator.bd.francia.comptabilite", amount: FR_COMPTABLE_ANNUAL });
    return { tax: is + dividendos + FR_COMPTABLE_ANNUAL, breakdown };
  }
}

function calcGermanTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * (AUTONOMO_NET_FACTORS.alemania ?? DEFAULT_AUTONOMO_NET_FACTOR);
    const estBase = applyBrackets(netBase, GERMANY_EST_BRACKETS);
    const soli = Math.round(estBase * GERMANY_SOLI_RATE);
    const est = estBase + soli;
    const sv = Math.round(netBase * GERMANY_SV_RATE);
    breakdown.push({ label: "calculator.bd.alemania.est", amount: est, note: "calculator.bd.alemania.est_note" });
    breakdown.push({ label: "calculator.bd.alemania.sv", amount: sv, note: "calculator.bd.alemania.sv_note" });
    return { tax: est + sv, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS.alemania ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const kstBase = Math.round(profit * GERMANY_KST_RATE);
    const soli = Math.round(kstBase * GERMANY_SOLI_RATE);
    const kst = kstBase + soli;
    const gewerbe = Math.round(profit * GERMANY_GEWERBE_EFFECTIVE_RATE);
    const dividendos = Math.round((profit - kst - gewerbe) * GERMANY_KAPESTG_RATE);
    breakdown.push({ label: "calculator.bd.alemania.kst", amount: kst });
    breakdown.push({ label: "calculator.bd.alemania.gewerbe", amount: gewerbe });
    breakdown.push({ label: "calculator.bd.alemania.kapestg", amount: dividendos });
    breakdown.push({ label: "calculator.bd.alemania.steuerberater", amount: GERMANY_STEUERBERATER_ANNUAL });
    return { tax: kst + gewerbe + dividendos + GERMANY_STEUERBERATER_ANNUAL, breakdown };
  }
}

function calcMexicoTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];
  const annualMXN = annualIncomeEUR * MXN_PER_EUR;

  if (regime === "autonomo") {
    const netBaseMXN = annualMXN * (AUTONOMO_NET_FACTORS.mexico ?? DEFAULT_AUTONOMO_NET_FACTOR);
    const isrMXN = applyBrackets(netBaseMXN, MEXICO_ISR_BRACKETS);
    const isr = Math.round(isrMXN / MXN_PER_EUR);
    const imss = Math.round(annualIncomeEUR * MEXICO_IMSS_RATE);
    breakdown.push({ label: "calculator.bd.mexico.isr", amount: isr, note: "calculator.bd.mexico.isr_note" });
    breakdown.push({ label: "calculator.bd.mexico.imss", amount: imss });
    return { tax: isr + imss, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS.mexico ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const is = Math.round(profit * MEXICO_ISR_PM_RATE);
    const dividendos = Math.round((profit - is) * MEXICO_DIVIDEND_RATE);
    breakdown.push({ label: "calculator.bd.mexico.isrPM", amount: is });
    breakdown.push({ label: "calculator.bd.mexico.isrDiv", amount: dividendos });
    breakdown.push({ label: "calculator.bd.mexico.contabilidad", amount: MEXICO_CONTABILIDAD_ANNUAL });
    return { tax: is + dividendos + MEXICO_CONTABILIDAD_ANNUAL, breakdown };
  }
}


function calcChileTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];
  const annualCLP = annualIncomeEUR * CLP_PER_EUR;

  if (regime === "autonomo") {
    const netBaseCLP = annualCLP * (AUTONOMO_NET_FACTORS.chile ?? DEFAULT_AUTONOMO_NET_FACTOR);
    const gcCLP = applyBrackets(netBaseCLP, CHILE_GLOBAL_COMPLEMENTARIO_BRACKETS);
    const gc = Math.round(gcCLP / CLP_PER_EUR);
    const afp = Math.round(annualIncomeEUR * CHILE_AFP_RATE);
    breakdown.push({ label: "calculator.bd.chile.gc", amount: gc, note: "calculator.bd.chile.gc_note" });
    breakdown.push({ label: "calculator.bd.chile.afp", amount: afp });
    return { tax: gc + afp, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS.chile ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const is = Math.round(profit * CHILE_PRIMERA_CATEGORIA_RATE);
    const dividendos = Math.round((profit - is) * CHILE_DIVIDEND_RATE);
    breakdown.push({ label: "calculator.bd.chile.primeraCategoria", amount: is });
    breakdown.push({ label: "calculator.bd.chile.gcDividendos", amount: dividendos });
    breakdown.push({ label: "calculator.bd.chile.contabilidad", amount: CHILE_CONTABILIDAD_ANNUAL });
    return { tax: is + dividendos + CHILE_CONTABILIDAD_ANNUAL, breakdown };
  }
}


function calcPortugueseTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * (AUTONOMO_NET_FACTORS.portugal ?? DEFAULT_AUTONOMO_NET_FACTOR);
    const irsBase = applyBrackets(netBase, PORTUGAL_IRS_BRACKETS);
    const derrama = Math.round(Math.max(0, netBase - 80_000) * PORTUGAL_IRS_DERRAMA_RATE);
    const irs = irsBase + derrama;
    // SS: 21,4% sobre 70% del rendimento bruto (Trabalhador Independente).
    const ssBase = annualIncomeEUR * PORTUGAL_SS_AUTONOMO_BASE_FACTOR;
    const ss = Math.round(ssBase * PORTUGAL_SS_AUTONOMO_RATE);
    breakdown.push({ label: "calculator.bd.portugal.irs", amount: irs, note: "calculator.bd.portugal.irs_note" });
    breakdown.push({ label: "calculator.bd.portugal.ss", amount: ss, note: "calculator.bd.portugal.ss_note" });
    return { tax: irs + ss, breakdown };
  } else {
    const profit = annualIncomeEUR * (SOCIEDAD_PROFIT_FACTORS.portugal ?? DEFAULT_SOCIEDAD_PROFIT_FACTOR);
    const irc = Math.round(profit * PORTUGAL_IRC_RATE);
    const derramaMun = Math.round(profit * PORTUGAL_IRC_DERRAMA_MUNICIPAL);
    const dividendos = Math.round((profit - irc - derramaMun) * PORTUGAL_DIVIDEND_RATE);
    breakdown.push({ label: "calculator.bd.portugal.irc", amount: irc });
    breakdown.push({ label: "calculator.bd.portugal.derrama", amount: derramaMun });
    breakdown.push({ label: "calculator.bd.portugal.dividendos", amount: dividendos });
    breakdown.push({ label: "calculator.bd.portugal.contabilista", amount: PORTUGAL_CONTABILISTA_ANNUAL });
    return { tax: irc + derramaMun + dividendos + PORTUGAL_CONTABILISTA_ANNUAL, breakdown };
  }
}


// Local residence personal income tax on LLC profits. The LLC USA is a
// disregarded entity (0% federal US for non-US residents not effectively
// connected). Profits are taxed in the OWNER'S country of residence as
// personal income (no local social security on those profits is the
// typical optimization). This helper estimates ONLY the personal income
// tax portion using each country's progressive brackets (imported from
// `calculator-config.ts` so they stay in sync with the autonomo path) but
// stripped of social-security contributions. It is an estimation, not
// legal advice; the UI declares this clearly via calculator.disclaimer.
function calcResidenceLLCTax(annualProfitEUR: number, country: string): number {
  const base = Math.max(0, annualProfitEUR);
  if (base <= 0) return 0;
  switch (country) {
    case "espana":
      return calcSpanishIRPF(base);
    case "mexico": {
      const baseMXN = base * MXN_PER_EUR;
      return Math.round(applyBrackets(baseMXN, MEXICO_ISR_BRACKETS) / MXN_PER_EUR);
    }
    case "chile": {
      const baseCLP = base * CLP_PER_EUR;
      return Math.round(applyBrackets(baseCLP, CHILE_GLOBAL_COMPLEMENTARIO_BRACKETS) / CLP_PER_EUR);
    }
    case "reino-unido": {
      const baseGBP = base * GBP_PER_EUR;
      return Math.round(applyBrackets(baseGBP, UK_INCOME_TAX_BRACKETS) / GBP_PER_EUR);
    }
    case "francia": {
      // Residentes franceses: los beneficios distribuidos por una entidad
      // extranjera transparente (LLC US disregarded) tributan como renta
      // y siguen sujetos a prélèvements sociaux (CSG+CRDS+solidarité ~17,2%)
      // sobre los rendimientos del capital. Modelarlo evita el sesgo de
      // mostrar la LLC artificialmente barata frente al régimen micro.
      const ir = applyBrackets(base, FRANCE_IR_BRACKETS);
      const prelevementsSociaux = Math.round(base * FR_PRELEVEMENTS_SOCIAUX_RATE);
      return ir + prelevementsSociaux;
    }
    case "belgica":
      return applyBrackets(base, BELGIUM_IPP_BRACKETS);
    case "alemania": {
      const estBase = applyBrackets(base, GERMANY_EST_BRACKETS);
      return estBase + Math.round(estBase * GERMANY_SOLI_RATE);
    }
    case "portugal": {
      const irsBase = applyBrackets(base, PORTUGAL_IRS_BRACKETS);
      const derrama = Math.round(Math.max(0, base - 80_000) * PORTUGAL_IRS_DERRAMA_RATE);
      return irsBase + derrama;
    }
    default:
      return calcSpanishIRPF(base);
  }
}



// Flags opcionales para activar regímenes especiales de bajo coste.
//   - tarifaPlana: cuota reducida 80€/mes para autónomos españoles en su
//     primer año de alta (RD-Ley vigente 2023-2025).
//   - franceMicro: régimen micro auto-entrepreneur francés con abattement
//     forfaitaire 50% (BNC services) y URSSAF ~22% sobre el chiffre
//     d'affaires. Reemplaza la deducción de gastos reales.
export function calculateSavings(
  monthlyIncome: number,
  country: string,
  regime: string,
  activity: string,
  customExpenses: number = 0,
  calcSpainIrpfWithLLC: boolean = false,
  expenseItems: ExpenseItem[] = [],
  options: CalcOptions = {},
): CalcResult {
  // Defense-in-depth: clamp inputs even though the UI also clamps. Prevents
  // NaN/Infinity/negative values from corrupting downstream math if the
  // calculator is invoked from a different surface or in tests.
  const safeMonthly = Number.isFinite(monthlyIncome)
    ? Math.min(Math.max(monthlyIncome, 0), MONTHLY_INCOME_SANITY_MAX)
    : 0;
  const safeCustomExpenses = Number.isFinite(customExpenses)
    ? Math.min(Math.max(customExpenses, 0), MONTHLY_INCOME_SANITY_MAX)
    : 0;
  const annual = safeMonthly * 12;
  const expenseRate = ACTIVITY_EXPENSE_RATE[activity] ?? ACTIVITY_EXPENSE_RATE_DEFAULT;
  const itemizedDeductible = expenseItems.length > 0
    ? calcDeductibleTotal(expenseItems)
    : safeCustomExpenses * 12;
  const totalGastosDeducibles = Math.round(annual * expenseRate) + itemizedDeductible;

  let sinLLC = 0;
  let breakdown: TaxBreakdown[] = [];
  let ivaNote = 0;
  let irpfBrackets: IrpfBracketDetail[] | undefined;

  const vatRate = COUNTRY_VAT_RATES[country] ?? 0;

  if (country === "espana") {
    const netAnnual = Math.max(0, annual - totalGastosDeducibles);
    ivaNote = Math.round(annual * vatRate);

    if (regime === "autonomo") {
      const monthlyNetIncome = netAnnual / 12;
      const ssResult = calcSpanishSS(monthlyNetIncome, options.tarifaPlana === true);
      const irpfBase = Math.max(0, netAnnual - ssResult.annual);
      const irpfResult = calcSpanishIRPFDetailed(irpfBase, options.ccaaProfile);
      irpfBrackets = irpfResult.brackets;
      breakdown.push({ label: "calculator.bd.espana.irpf", amount: irpfResult.tax, note: "calculator.bd.espana.irpf_note", noteParams: { base: Math.round(irpfBase / 1000), personal: formatCurrency(PERSONAL_DEDUCTION_ES) } });
      breakdown.push({ label: "calculator.bd.espana.cuotaSS", amount: ssResult.annual, note: "calculator.bd.espana.cuotaSS_note", noteParams: { limit: formatCurrency(ssResult.bracket.limit), monthly: formatCurrency(ssResult.monthly) } });
      sinLLC = irpfResult.tax + ssResult.annual;
    } else {
      const adminSalary = Math.min(
        Math.max(SPAIN_SOCIEDAD_ADMIN_BASE_MIN, Math.round(netAnnual * SPAIN_SOCIEDAD_ADMIN_PROFIT_SHARE / 12)),
        Math.max(SPAIN_SOCIEDAD_ADMIN_BASE_MIN, Math.round(netAnnual / 12)),
      );
      const adminSalaryAnnual = adminSalary * 12;
      const adminSS = calcSociedadAdminSS(adminSalary);
      const adminCosts = SPAIN_SOCIEDAD_ADMIN_ANNUAL_COSTS;
      const profit = Math.max(0, netAnnual - adminSalaryAnnual - adminSS.annual - adminCosts);
      const isRate = annual <= SPAIN_IS_REDUCED_REVENUE_CAP ? SPAIN_IS_RATE_REDUCED : SPAIN_IS_RATE_GENERAL;
      const isLabel = annual <= SPAIN_IS_REDUCED_REVENUE_CAP ? "calculator.bd.espana.is23" : "calculator.bd.espana.is25";
      const is = Math.round(profit * isRate);
      const afterIs = profit - is;
      const dividendTax = calcSpanishDividendTax(afterIs);
      const adminIrpf = calcSpanishIRPF(adminSalaryAnnual, options.ccaaProfile);
      breakdown.push({ label: isLabel, amount: is, note: "calculator.bd.espana.is_note", noteParams: { profit: formatCurrency(profit) } });
      breakdown.push({ label: "calculator.bd.espana.cuotaSSAdmin", amount: adminSS.annual, note: "calculator.bd.espana.cuotaSSAdmin_note", noteParams: { salary: formatCurrency(adminSalary), monthly: formatCurrency(adminSS.monthly) } });
      breakdown.push({ label: "calculator.bd.espana.irpfAdmin", amount: adminIrpf, note: "calculator.bd.espana.irpfAdmin_note", noteParams: { salary: formatCurrency(adminSalaryAnnual) } });
      breakdown.push({ label: "calculator.bd.espana.dividendos", amount: dividendTax, note: "calculator.bd.espana.dividendos_note", noteParams: { amount: formatCurrency(afterIs) } });
      breakdown.push({ label: "calculator.bd.espana.gestoria", amount: adminCosts, note: "calculator.bd.espana.gestoria_note" });
      sinLLC = is + adminSS.annual + adminIrpf + dividendTax + adminCosts;
    }
  } else if (country === "mexico") {
    ivaNote = Math.round(annual * vatRate);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcMexicoTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "chile") {
    ivaNote = Math.round(annual * vatRate);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcChileTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "reino-unido") {
    ivaNote = Math.round(annual * vatRate);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcUKTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "belgica") {
    ivaNote = Math.round(annual * vatRate);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcBelgiumTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "francia") {
    ivaNote = Math.round(annual * vatRate);
    // En micro auto-entrepreneur el abattement forfaitaire reemplaza la
    // deducción de gastos reales, por eso pasamos `annual` (CA bruto) en
    // lugar del netAnnual ya restado. Si el CA bruto supera el plafond
    // micro BNC se ignora el flag (el contribuyente pasa obligatoriamente
    // a régime réel) y el cálculo cae al modelo estándar.
    const useMicro = options.franceMicro === true
      && regime === "autonomo"
      && annual <= FR_MICRO_CEILING_BNC;
    const baseForFrance = useMicro ? annual : Math.max(0, annual - itemizedDeductible);
    const result = calcFranceTax(baseForFrance, regime, useMicro);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "alemania") {
    ivaNote = Math.round(annual * vatRate);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcGermanTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "portugal") {
    ivaNote = Math.round(annual * vatRate);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcPortugueseTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  }

  const conLLC = LLC_ANNUAL_COST;

  const llcBreakdown: TaxBreakdown[] = [
    { label: "calculator.llcBreakdown.federalTax", amount: 0, note: "calculator.llcBreakdown.federalTaxNote" },
    { label: "calculator.llcBreakdown.stateTax", amount: 0, note: "calculator.llcBreakdown.stateTaxNote" },
    { label: "calculator.llcBreakdown.formation", amount: LLC_FORMATION_COST, note: "calculator.llcBreakdown.formationNote" },
    { label: "calculator.llcBreakdown.maintenance", amount: LLC_ANNUAL_COST, note: "calculator.llcBreakdown.maintenanceNote" },
  ];

  let spainIrpfWithLLC: CalcResult["spainIrpfWithLLC"] = undefined;
  if (calcSpainIrpfWithLLC && country === "espana") {
    const llcProfit = Math.max(0, annual - totalGastosDeducibles - conLLC);
    const irpfLLCResult = calcSpanishIRPFDetailed(llcProfit, options.ccaaProfile);
    spainIrpfWithLLC = {
      irpf: irpfLLCResult.tax,
      brackets: irpfLLCResult.brackets,
      baseImponible: llcProfit,
    };
  }

  const ahorro = Math.max(0, sinLLC - conLLC);
  const effectiveRate = annual > 0 ? Math.round((sinLLC / annual) * 1000) / 10 : 0;
  const llcEffectiveRate = annual > 0 ? Math.round((conLLC / annual) * 1000) / 10 : 0;

  const regimeLabel = getRegimeLabel(country, regime);

  return {
    sinLLC,
    conLLC,
    ahorro,
    localLabel: `${regimeLabel}|${country}`,
    breakdown,
    llcBreakdown,
    ivaNote,
    effectiveRate,
    llcEffectiveRate,
    irpfBrackets,
    spainIrpfWithLLC,
    gastosDeducibles: totalGastosDeducibles,
  };
}


export function convertFromEUR(amountEUR: number, currencyCode: string): number {
  const cur = DISPLAY_CURRENCIES[currencyCode];
  if (!cur) return amountEUR;
  return amountEUR * cur.rate;
}

export function convertToEUR(amount: number, currencyCode: string): number {
  const cur = DISPLAY_CURRENCIES[currencyCode];
  if (!cur || cur.rate === 0) return amount;
  return amount / cur.rate;
}

export function computeAllStructures(
  monthlyIncome: number,
  country: string,
  activity: string,
  customExpenses: number = 0,
  expenseItems: ExpenseItem[] = [],
  options: CalcOptions = {},
): AllStructuresResult {
  const auto = calculateSavings(monthlyIncome, country, "autonomo", activity, customExpenses, false, expenseItems, options);
  const soc = calculateSavings(monthlyIncome, country, "sociedad", activity, customExpenses, false, expenseItems, options);
  const annual = Math.max(0, (Number.isFinite(monthlyIncome) ? monthlyIncome : 0) * 12);

  const autonomoLabel = getRegimeLabel(country, "autonomo");
  const sociedadLabel = getRegimeLabel(country, "sociedad");

  // Amortize one-off setup costs over the configured horizon for an honest
  // total annual comparison (otherwise year-1 looks artificially worse).
  const amortizedSetup = (n: number) => Math.round(n / STRUCTURE_AMORTIZATION_YEARS);

  const autonomoTotal = auto.sinLLC; // taxes only (no setup, no fixed)
  const autonomoR: StructureResult = {
    id: "autonomo",
    label: autonomoLabel,
    setupCost: 0,
    fixedAnnualCost: 0,
    taxes: auto.sinLLC,
    totalAnnualCost: autonomoTotal,
    effectiveRate: auto.effectiveRate,
    breakdown: auto.breakdown,
  };

  const socCosts = SOCIEDAD_COSTS[country] ?? SOCIEDAD_COSTS.espana;
  const sociedadTotal = soc.sinLLC + socCosts.fixedAnnual + amortizedSetup(socCosts.setup);
  const sociedadR: StructureResult = {
    id: "sociedad",
    label: sociedadLabel,
    setupCost: socCosts.setup,
    fixedAnnualCost: socCosts.fixedAnnual,
    taxes: soc.sinLLC,
    totalAnnualCost: sociedadTotal,
    effectiveRate: annual > 0 ? Math.round((sociedadTotal / annual) * 1000) / 10 : 0,
    breakdown: soc.breakdown,
  };

  // LLC: 0% federal US (disregarded entity for non-US owners not ECI),
  // BUT profits are taxed in the OWNER'S residence country as personal
  // income. We exclude local social-security on those profits, which is
  // the typical optimization vector.
  const llcProfit = Math.max(0, annual - auto.gastosDeducibles - LLC_ANNUAL_COST);
  const llcResidenceTax = calcResidenceLLCTax(llcProfit, country);
  const llcTotal = llcResidenceTax + LLC_ANNUAL_COST + amortizedSetup(LLC_FORMATION_COST);
  const llcR: StructureResult = {
    id: "llc",
    label: "calculator.llcLabel",
    setupCost: LLC_FORMATION_COST,
    fixedAnnualCost: LLC_ANNUAL_COST,
    taxes: llcResidenceTax,
    totalAnnualCost: llcTotal,
    effectiveRate: annual > 0 ? Math.round((llcTotal / annual) * 1000) / 10 : 0,
    breakdown: [
      { label: "calculator.llcBreakdown.federalTax", amount: 0, note: "calculator.llcBreakdown.federalTaxNote" },
      { label: "calculator.llcBreakdown.residenceTax", amount: llcResidenceTax, note: "calculator.llcBreakdown.residenceTaxNote" },
      { label: "calculator.llcBreakdown.formation", amount: LLC_FORMATION_COST, note: "calculator.llcBreakdown.formationNote" },
      { label: "calculator.llcBreakdown.maintenance", amount: LLC_ANNUAL_COST, note: "calculator.llcBreakdown.maintenanceNote" },
    ],
  };

  const totals: Array<[StructureResult, number]> = [
    [autonomoR, autonomoR.totalAnnualCost],
    [sociedadR, sociedadR.totalAnnualCost],
    [llcR, llcR.totalAnnualCost],
  ];
  totals.sort((a, b) => a[1] - b[1]);
  const bestId = totals[0][0].id;

  // Negative deltas are intentional: when LLC is more expensive, we show
  // the negative number so the user sees the honest gap, not a clamped 0.
  return {
    autonomo: autonomoR,
    sociedad: sociedadR,
    llc: llcR,
    bestId,
    llcSavingsVsAutonomo: autonomoR.totalAnnualCost - llcR.totalAnnualCost,
    llcSavingsVsSociedad: sociedadR.totalAnnualCost - llcR.totalAnnualCost,
    annualIncome: annual,
    gastosDeducibles: auto.gastosDeducibles,
  };
}

export function formatCurrency(valueEUR: number, displayCurrencyCode: string = "EUR", locale?: string): string {
  const cur = DISPLAY_CURRENCIES[displayCurrencyCode] || DISPLAY_CURRENCIES.EUR;
  const converted = valueEUR * cur.rate;
  return new Intl.NumberFormat(locale || "es-ES", {
    style: "currency",
    currency: cur.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

// Default display currency by country (still useful as a default).
// Mexico/Chile fall back to EUR — local pesos are no longer offered as a
// display currency; tax math still applies the local-currency brackets
// internally via the helpers in calculator-config.ts.
export const COUNTRY_CURRENCY: Record<string, { symbol: string; code: string; name: string; rate: number }> = {
  espana:        DISPLAY_CURRENCIES.EUR,
  mexico:        DISPLAY_CURRENCIES.EUR,
  chile:         DISPLAY_CURRENCIES.EUR,
  "reino-unido": DISPLAY_CURRENCIES.GBP,
  belgica:       DISPLAY_CURRENCIES.EUR,
  francia:       DISPLAY_CURRENCIES.EUR,
  alemania:      DISPLAY_CURRENCIES.EUR,
  portugal:      DISPLAY_CURRENCIES.EUR,
};

export const countries = [
  { id: "espana",       label: "España",      flag: "/img/flags/espana.png" },
  { id: "mexico",       label: "México",      flag: "/img/flags/mexico.png" },
  { id: "chile",        label: "Chile",        flag: "/img/flags/chile.png" },
  { id: "reino-unido",  label: "UK",  flag: "/img/flags/reino-unido.png" },
  { id: "francia",      label: "Francia",      flag: "/img/flags/francia.png" },
  { id: "belgica",      label: "Bélgica",      flag: "/img/flags/belgica.png" },
  { id: "alemania",     label: "Alemania",     flag: "/img/flags/alemania.png" },
  { id: "portugal",     label: "Portugal",     flag: "/img/flags/portugal.png" },
];

export const COUNTRY_REGIMES: Record<string, RegimeDef[]> = {
  espana:       [
    { id: "autonomo", label: "Autonomo" },
    { id: "sociedad", label: "Sociedad Limitada (SL)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  mexico:       [
    { id: "autonomo", label: "Persona Física (RESICO)" },
    { id: "sociedad", label: "Persona Moral (SA / SAPI)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  chile:        [
    { id: "autonomo", label: "Persona Natural" },
    { id: "sociedad", label: "Sociedad por Acciones (SpA)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  "reino-unido": [
    { id: "autonomo", label: "Sole Trader" },
    { id: "sociedad", label: "Limited Company (Ltd)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  francia:      [
    { id: "autonomo", label: "Auto-entrepreneur" },
    { id: "sociedad", label: "Société (SAS / SARL)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  belgica:      [
    { id: "autonomo", label: "Indépendant (Zelfstandige)" },
    { id: "sociedad", label: "Société (SRL / BV)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  alemania:     [
    { id: "autonomo", label: "Freiberufler / Einzelunternehmer" },
    { id: "sociedad", label: "GmbH / UG" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  portugal:     [
    { id: "autonomo", label: "Trabalhador Independente" },
    { id: "sociedad", label: "Sociedade (Lda / SA)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
};

function getRegimeLabel(country: string, regime: string): string {
  const r = COUNTRY_REGIMES[country];
  if (!r) return regime;
  const found = r.find(x => x.id === regime);
  return found ? found.label : regime;
}

export const regimes = [
  { id: "autonomo", label: "Autonomo" },
  { id: "sociedad", label: "Sociedad" },
];

export const CALC_ACTIVITY_KEYS = [
  "digitalServices","consultingAdvisory","marketingAdvertising","socialMedia",
  "contentCreation","influencer","affiliateMarketing","onlineCourses",
  "coachingMentoring","freelanceServices","copywriting","graphicDesign",
  "videoEditing","webDesign","webDevelopment","appDevelopment",
  "softwareSaas","aiAutomation","ecommerceOwn","dropshipping",
  "printOnDemand","digitalProducts","subscriptionBusiness","membershipPlatforms",
  "communityMonetization","onlineEducation","leadGeneration","mediaBuying",
  "seoServices","emailMarketing","salesFunnels","digitalAgency",
  "outsourcing","virtualAssistant","remoteTeam","trading",
  "cryptoInvestments","nftDigitalAssets","onlineBetting","domainFlipping",
  "appMonetization","dataAnalytics","cybersecurity","cloudServices",
  "apiServices","noCodeDev","otherDigital",
] as const;
export const activities = CALC_ACTIVITY_KEYS.map(id => ({ id, label: id }));
