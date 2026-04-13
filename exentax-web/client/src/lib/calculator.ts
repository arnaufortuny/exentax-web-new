interface TaxBreakdown {
  label: string;
  amount: number;
  note?: string;
}

export interface IrpfBracketDetail {
  from: number;
  to: number;
  rate: number;
  taxInBracket: number;
}

export interface ExpenseItem {
  id: string;
  label: string;
  monthly: number;
  deductPct: 100 | 80 | 50 | 20;
}

type ExpenseCategoryDef = { id: string; label: string; deductPct: 100 | 80 | 50 | 20; placeholder: string };

const BASE_EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
  { id: "software", label: "Software y herramientas", deductPct: 100, placeholder: "Ej: 120" },
  { id: "hosting", label: "Hosting / servidores", deductPct: 100, placeholder: "Ej: 50" },
  { id: "marketing", label: "Marketing y publicidad", deductPct: 100, placeholder: "Ej: 200" },
  { id: "telefono", label: "Teléfono e internet", deductPct: 50, placeholder: "Ej: 60" },
  { id: "coworking", label: "Coworking / oficina", deductPct: 100, placeholder: "Ej: 250" },
  { id: "vehiculo", label: "Vehículo (combustible, seguro)", deductPct: 50, placeholder: "Ej: 150" },
  { id: "formacion", label: "Formación profesional", deductPct: 100, placeholder: "Ej: 80" },
  { id: "asesoria", label: "Asesoría y gestoría", deductPct: 100, placeholder: "Ej: 100" },
  { id: "otros", label: "Otros gastos profesionales", deductPct: 100, placeholder: "Ej: 50" },
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
  italia: {
    telefono: { deductPct: 80, label: "Teléfono e internet (80%)" },
    vehiculo: { deductPct: 20, label: "Vehículo (20% uso mixto)" },
  },
  austria: {
    telefono: { deductPct: 100 },
    vehiculo: { deductPct: 50, label: "Vehículo (Km-Pauschale)" },
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

interface CalcResult {
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

const PERSONAL_DEDUCTION_ES = 5550;

const IRPF_BRACKETS = [
  { limit: 12450, rate: 0.19 },
  { limit: 20200, rate: 0.24 },
  { limit: 35200, rate: 0.30 },
  { limit: 60000, rate: 0.37 },
  { limit: 300000, rate: 0.45 },
  { limit: Infinity, rate: 0.47 },
];

function calcSpanishIRPFDetailed(taxableBase: number): { tax: number; brackets: IrpfBracketDetail[] } {
  const base = Math.max(0, taxableBase - PERSONAL_DEDUCTION_ES);
  const details: IrpfBracketDetail[] = [];
  let tax = 0;
  let prev = 0;
  for (const b of IRPF_BRACKETS) {
    if (base <= prev) break;
    const taxable = Math.min(base, b.limit) - prev;
    const taxInBracket = Math.round(taxable * b.rate);
    details.push({
      from: prev,
      to: Math.min(base, b.limit),
      rate: b.rate,
      taxInBracket,
    });
    tax += taxable * b.rate;
    prev = b.limit;
  }
  return { tax: Math.round(tax), brackets: details };
}

function calcSpanishIRPF(taxableBase: number): number {
  return calcSpanishIRPFDetailed(taxableBase).tax;
}

const SS_AUTONOMO_BRACKETS_2025 = [
  { limit: 670,      monthly: 200 },
  { limit: 900,      monthly: 220 },
  { limit: 1166.70,  monthly: 260 },
  { limit: 1300,     monthly: 291 },
  { limit: 1500,     monthly: 294 },
  { limit: 1700,     monthly: 294 },
  { limit: 1850,     monthly: 350 },
  { limit: 2030,     monthly: 370 },
  { limit: 2330,     monthly: 390 },
  { limit: 2760,     monthly: 415 },
  { limit: 3190,     monthly: 465 },
  { limit: 3620,     monthly: 530 },
  { limit: 4050,     monthly: 530 },
  { limit: 6000,     monthly: 530 },
  { limit: Infinity, monthly: 590 },
];

function calcSpanishSS(monthlyNetIncome: number): { annual: number; monthly: number; bracket: { limit: number; monthly: number } } {
  const bracket = SS_AUTONOMO_BRACKETS_2025.find((b) => monthlyNetIncome <= b.limit) ?? SS_AUTONOMO_BRACKETS_2025[SS_AUTONOMO_BRACKETS_2025.length - 1];
  return { annual: bracket.monthly * 12, monthly: bracket.monthly, bracket };
}

function calcSociedadAdminSS(monthlySalary: number): { annual: number; monthly: number } {
  const BASE_MIN_ADMIN = 1000;
  const base = Math.max(BASE_MIN_ADMIN, monthlySalary);
  const rate = 0.3130;
  const monthly = Math.round(base * rate);
  return { annual: monthly * 12, monthly };
}

function calcSpanishDividendTax(amount: number): number {
  const brackets = [
    { limit: 6000,     rate: 0.19 },
    { limit: 50000,    rate: 0.21 },
    { limit: 200000,   rate: 0.23 },
    { limit: 300000,   rate: 0.27 },
    { limit: Infinity, rate: 0.28 },
  ];
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
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
  const GBP_PER_EUR = 0.86;
  const annualGBP = annualIncomeEUR * GBP_PER_EUR;

  if (regime === "autonomo") {
    const netBaseGBP = annualGBP * 0.80;
    const incomeTaxBrackets = [
      { limit: 12_570,   rate: 0 },
      { limit: 50_270,   rate: 0.20 },
      { limit: 125_140,  rate: 0.40 },
      { limit: Infinity, rate: 0.45 },
    ];
    const incomeTaxGBP = applyBrackets(netBaseGBP, incomeTaxBrackets);
    const incomeTax = Math.round(incomeTaxGBP / GBP_PER_EUR);
    const niBase = Math.max(0, netBaseGBP - 12_570);
    const upperLimit = 50_270 - 12_570;
    const niGBP = niBase <= upperLimit ? niBase * 0.08 : upperLimit * 0.08 + (niBase - upperLimit) * 0.02;
    const ni = Math.round(niGBP / GBP_PER_EUR);
    breakdown.push({ label: "Income Tax (tramos HMRC 2025)", amount: incomeTax, note: "Personal Allowance £12.570" });
    breakdown.push({ label: "National Insurance (Class 4)", amount: ni, note: "8% hasta £50.270, 2% resto" });
    return { tax: incomeTax + ni, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.72;
    const corpTaxRate = profit * GBP_PER_EUR <= 50_000 ? 0.19 : profit * GBP_PER_EUR <= 250_000 ? 0.25 : 0.25;
    const corpTax = Math.round(profit * corpTaxRate);
    const dividendos = Math.round((profit - corpTax) * 0.3375 * 0.30);
    const admin = 3500;
    breakdown.push({ label: "Corporation Tax (19-25%)", amount: corpTax });
    breakdown.push({ label: "Dividend Tax (higher rate est.)", amount: dividendos });
    breakdown.push({ label: "Accountancy & admin", amount: admin });
    return { tax: corpTax + dividendos + admin, breakdown };
  }
}

function calcBelgiumTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * 0.80;
    const brackets = [
      { limit: 15_820,   rate: 0.25 },
      { limit: 27_920,   rate: 0.40 },
      { limit: 48_320,   rate: 0.45 },
      { limit: Infinity, rate: 0.50 },
    ];
    const irpp = applyBrackets(netBase, brackets);
    const ss = Math.round(netBase * 0.205);
    breakdown.push({ label: "Impôt des personnes physiques (IPP)", amount: irpp, note: "Tramos SPF Finances 2025" });
    breakdown.push({ label: "Cotisations sociales indépendant", amount: ss, note: "~20,5% sobre ingresos netos" });
    return { tax: irpp + ss, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.70;
    const isRate = profit <= 100_000 ? 0.20 : 0.25;
    const is = Math.round(profit * isRate);
    const dividendos = Math.round((profit - is) * 0.30);
    const admin = 4000;
    breakdown.push({ label: `Impôt des sociétés (${isRate * 100}%)`, amount: is });
    breakdown.push({ label: "Précompte mobilier dividendes (30%)", amount: dividendos });
    breakdown.push({ label: "Comptabilité et administration", amount: admin });
    return { tax: is + dividendos + admin, breakdown };
  }
}

function calcFranceTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * 0.78;
    const brackets = [
      { limit: 11_294,   rate: 0 },
      { limit: 28_797,   rate: 0.11 },
      { limit: 82_341,   rate: 0.30 },
      { limit: 177_106,  rate: 0.41 },
      { limit: Infinity, rate: 0.45 },
    ];
    const ir = applyBrackets(netBase, brackets);
    const ss = Math.round(annualIncomeEUR * 0.22);
    breakdown.push({ label: "Impôt sur le revenu (IR)", amount: ir, note: "Barème progressif 2025 DGFiP" });
    breakdown.push({ label: "Cotisations sociales (URSSAF)", amount: ss, note: "~22% micro-entrepreneur / TNS" });
    return { tax: ir + ss, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.70;
    const isSmall = Math.min(profit, 42_500) * 0.15;
    const isRest = Math.max(0, profit - 42_500) * 0.25;
    const is = Math.round(isSmall + isRest);
    const dividendos = Math.round((profit - is) * 0.30);
    const admin = 3800;
    breakdown.push({ label: "Impôt sur les sociétés (IS 15/25%)", amount: is, note: "Taux réduit ≤42.500€" });
    breakdown.push({ label: "Flat tax dividendes (PFU 30%)", amount: dividendos });
    breakdown.push({ label: "Comptabilité et administration", amount: admin });
    return { tax: is + dividendos + admin, breakdown };
  }
}

function calcItalyTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * 0.78;
    const brackets = [
      { limit: 28_000,   rate: 0.23 },
      { limit: 50_000,   rate: 0.35 },
      { limit: Infinity, rate: 0.43 },
    ];
    const irpef = applyBrackets(netBase, brackets);
    const inps = Math.round(netBase * 0.2572);
    breakdown.push({ label: "IRPEF (tramos Agenzia Entrate 2025)", amount: irpef, note: "Alícuotas 23%, 35%, 43%" });
    breakdown.push({ label: "INPS Gestione Separata", amount: inps, note: "~25,72% sobre renta neta" });
    return { tax: irpef + inps, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.72;
    const ires = Math.round(profit * 0.24);
    const irap = Math.round(profit * 0.039);
    const dividendos = Math.round((profit - ires - irap) * 0.26);
    const admin = 3500;
    breakdown.push({ label: "IRES (Imposta societaria 24%)", amount: ires });
    breakdown.push({ label: "IRAP (3,9%)", amount: irap });
    breakdown.push({ label: "Ritenuta dividendi (26%)", amount: dividendos });
    breakdown.push({ label: "Commercialista e amministrazione", amount: admin });
    return { tax: ires + irap + dividendos + admin, breakdown };
  }
}

function calcMexicoTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];
  // Approximate exchange rate — for estimation only, not live market data.
  const MXN_PER_EUR = 22;
  const annualMXN = annualIncomeEUR * MXN_PER_EUR;

  if (regime === "autonomo") {
    const netBaseMXN = annualMXN * 0.80;
    const brackets = [
      { limit: 82_260,     rate: 0.0192 },
      { limit: 134_856,    rate: 0.0640 },
      { limit: 236_472,    rate: 0.1088 },
      { limit: 413_196,    rate: 0.1600 },
      { limit: 555_396,    rate: 0.2176 },
      { limit: 1_118_196,  rate: 0.2400 },
      { limit: 1_753_992,  rate: 0.2800 },
      { limit: Infinity,   rate: 0.3500 },
    ];
    const isrMXN = applyBrackets(netBaseMXN, brackets);
    const isr = Math.round(isrMXN / MXN_PER_EUR);
    const imss = Math.round(annualIncomeEUR * 0.045);
    breakdown.push({ label: "ISR (Pers. Física Act. Empresarial)", amount: isr, note: "Tramos SAT 2025" });
    breakdown.push({ label: "IMSS / IESS estimado", amount: imss });
    return { tax: isr + imss, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.72;
    const is = Math.round(profit * 0.30);
    const dividendos = Math.round((profit - is) * 0.10);
    const admin = 3200;
    breakdown.push({ label: "ISR (Persona Moral 30%)", amount: is });
    breakdown.push({ label: "ISR adicional dividendos (10%)", amount: dividendos });
    breakdown.push({ label: "Contabilidad y administración", amount: admin });
    return { tax: is + dividendos + admin, breakdown };
  }
}


function calcChileTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];
  // Approximate exchange rate — for estimation only, not live market data.
  const CLP_PER_EUR = 1000;
  const annualCLP = annualIncomeEUR * CLP_PER_EUR;
  const UTM_MONTHLY = 68_076;
  const UTM_ANNUAL = UTM_MONTHLY * 12;

  if (regime === "autonomo") {
    const netBaseCLP = annualCLP * 0.80;
    const brackets = [
      { limit: 13.5 * UTM_ANNUAL, rate: 0 },
      { limit: 30   * UTM_ANNUAL, rate: 0.04 },
      { limit: 50   * UTM_ANNUAL, rate: 0.08 },
      { limit: 70   * UTM_ANNUAL, rate: 0.135 },
      { limit: 90   * UTM_ANNUAL, rate: 0.23 },
      { limit: 120  * UTM_ANNUAL, rate: 0.304 },
      { limit: 150  * UTM_ANNUAL, rate: 0.354 },
      { limit: Infinity,          rate: 0.40 },
    ];
    const gcCLP = applyBrackets(netBaseCLP, brackets);
    const gc = Math.round(gcCLP / CLP_PER_EUR);
    const afp = Math.round(annualIncomeEUR * 0.10);
    breakdown.push({ label: "Global Complementario", amount: gc, note: "Tramos SII 2025" });
    breakdown.push({ label: "AFP + seguro salud (cotizaciones)", amount: afp });
    return { tax: gc + afp, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.72;
    const is = Math.round(profit * 0.27);
    const dividendos = Math.round((profit - is) * 0.13);
    const admin = 3000;
    breakdown.push({ label: "Impuesto Primera Categoría (27%)", amount: is });
    breakdown.push({ label: "Global Complementario (dividendos)", amount: dividendos });
    breakdown.push({ label: "Contabilidad y administración", amount: admin });
    return { tax: is + dividendos + admin, breakdown };
  }
}


function calcAustriaTax(annualIncomeEUR: number, regime: string): { tax: number; breakdown: TaxBreakdown[] } {
  const breakdown: TaxBreakdown[] = [];

  if (regime === "autonomo") {
    const netBase = annualIncomeEUR * 0.80;
    const brackets = [
      { limit: 12_816,   rate: 0 },
      { limit: 20_818,   rate: 0.20 },
      { limit: 34_513,   rate: 0.30 },
      { limit: 66_612,   rate: 0.40 },
      { limit: 99_266,   rate: 0.48 },
      { limit: 1_000_000, rate: 0.50 },
      { limit: Infinity,  rate: 0.55 },
    ];
    const est = applyBrackets(netBase, brackets);
    const sv = Math.round(netBase * 0.268);
    breakdown.push({ label: "Einkommensteuer (ESt)", amount: est, note: "Tramos BMF 2025" });
    breakdown.push({ label: "Sozialversicherung (SVS)", amount: sv, note: "~26,8% sobre base neta" });
    return { tax: est + sv, breakdown };
  } else {
    const profit = annualIncomeEUR * 0.72;
    const koest = Math.round(profit * 0.23);
    const kest = Math.round((profit - koest) * 0.275);
    const admin = 3800;
    breakdown.push({ label: "Koerperschaftsteuer (KoeSt 23%)", amount: koest });
    breakdown.push({ label: "Kapitalertragsteuer dividendos (KESt 27,5%)", amount: kest });
    breakdown.push({ label: "Steuerberater und Verwaltung", amount: admin });
    return { tax: koest + kest + admin, breakdown };
  }
}

const ACTIVITY_EXPENSE_RATE: Record<string, number> = {
  digitalServices:    0.20,
  consultingAdvisory: 0.15,
  marketingAdvertising: 0.22,
  socialMedia:        0.22,
  contentCreation:    0.25,
  influencer:         0.25,
  affiliateMarketing: 0.15,
  onlineCourses:      0.20,
  coachingMentoring:  0.15,
  freelanceServices:  0.20,
  copywriting:        0.12,
  graphicDesign:      0.18,
  videoEditing:       0.22,
  webDesign:          0.18,
  webDevelopment:     0.22,
  appDevelopment:     0.22,
  softwareSaas:       0.25,
  aiAutomation:       0.25,
  ecommerceOwn:       0.35,
  dropshipping:       0.40,
  printOnDemand:      0.35,
  digitalProducts:    0.15,
  subscriptionBusiness: 0.20,
  membershipPlatforms: 0.20,
  communityMonetization: 0.18,
  onlineEducation:    0.20,
  leadGeneration:     0.18,
  mediaBuying:        0.30,
  seoServices:        0.15,
  emailMarketing:     0.18,
  salesFunnels:       0.20,
  digitalAgency:      0.25,
  outsourcing:        0.22,
  virtualAssistant:   0.12,
  remoteTeam:         0.22,
  trading:            0.12,
  cryptoInvestments:  0.10,
  nftDigitalAssets:   0.12,
  onlineBetting:      0.10,
  domainFlipping:     0.15,
  appMonetization:    0.20,
  dataAnalytics:      0.18,
  cybersecurity:      0.18,
  cloudServices:      0.22,
  apiServices:        0.20,
  noCodeDev:          0.18,
  otherDigital:       0.20,
};

const LLC_FORMATION_COST = 799;
const LLC_ANNUAL_COST = 1099;

export function calculateSavings(
  monthlyIncome: number,
  country: string,
  regime: string,
  activity: string,
  customExpenses: number = 0,
  calcSpainIrpfWithLLC: boolean = false,
  expenseItems: ExpenseItem[] = [],
): CalcResult {
  const annual = monthlyIncome * 12;
  const expenseRate = ACTIVITY_EXPENSE_RATE[activity] ?? 0.20;
  const itemizedDeductible = expenseItems.length > 0
    ? calcDeductibleTotal(expenseItems)
    : customExpenses * 12;
  const totalGastosDeducibles = Math.round(annual * expenseRate) + itemizedDeductible;

  let sinLLC = 0;
  let breakdown: TaxBreakdown[] = [];
  let ivaNote = 0;
  let irpfBrackets: IrpfBracketDetail[] | undefined;

  if (country === "espana") {
    const netAnnual = Math.max(0, annual - totalGastosDeducibles);
    ivaNote = Math.round(annual * 0.21);

    if (regime === "autonomo") {
      const monthlyNetIncome = netAnnual / 12;
      const ssResult = calcSpanishSS(monthlyNetIncome);
      const irpfBase = Math.max(0, netAnnual - ssResult.annual);
      const irpfResult = calcSpanishIRPFDetailed(irpfBase);
      irpfBrackets = irpfResult.brackets;
      breakdown.push({ label: "IRPF (tramos 2025)", amount: irpfResult.tax, note: `Base liquidable ~${Math.round(irpfBase / 1000)}k€ · Mín. personal ${formatCurrency(PERSONAL_DEDUCTION_ES)}` });
      breakdown.push({ label: "Cuota Seg. Social autónomos", amount: ssResult.annual, note: `Tramo ≤${formatCurrency(ssResult.bracket.limit)}€/mes → ${formatCurrency(ssResult.monthly)}€/mes` });
      sinLLC = irpfResult.tax + ssResult.annual;
    } else {
      const adminSalary = Math.min(Math.max(1000, Math.round(netAnnual * 0.25 / 12)), Math.max(1000, Math.round(netAnnual / 12)));
      const adminSalaryAnnual = adminSalary * 12;
      const adminSS = calcSociedadAdminSS(adminSalary);
      const adminCosts = 3500;
      const profit = Math.max(0, netAnnual - adminSalaryAnnual - adminSS.annual - adminCosts);
      const isRate = annual <= 1_000_000 ? 0.23 : 0.25;
      const isLabel = annual <= 1_000_000 ? "Impuesto de Sociedades (IS 23%)" : "Impuesto de Sociedades (IS 25%)";
      const is = Math.round(profit * isRate);
      const afterIs = profit - is;
      const dividendTax = calcSpanishDividendTax(afterIs);
      const adminIrpf = calcSpanishIRPF(adminSalaryAnnual);
      breakdown.push({ label: isLabel, amount: is, note: `Base imponible ~${formatCurrency(profit)}` });
      breakdown.push({ label: "Cuota Seg. Social administrador", amount: adminSS.annual, note: `Base cotización ${formatCurrency(adminSalary)}€/mes · ${formatCurrency(adminSS.monthly)}€/mes (31,30%)` });
      breakdown.push({ label: "IRPF nómina administrador", amount: adminIrpf, note: `Salario bruto ${formatCurrency(adminSalaryAnnual)}/año` });
      breakdown.push({ label: "IRPF del ahorro (dividendos)", amount: dividendTax, note: `Sobre beneficio distribuido ~${formatCurrency(afterIs)}` });
      breakdown.push({ label: "Gestoría y administración SL", amount: adminCosts, note: "Estimado anual" });
      sinLLC = is + adminSS.annual + adminIrpf + dividendTax + adminCosts;
    }
  } else if (country === "mexico") {
    ivaNote = Math.round(annual * 0.16);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcMexicoTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "chile") {
    ivaNote = Math.round(annual * 0.19);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcChileTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "reino-unido") {
    ivaNote = Math.round(annual * 0.20);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcUKTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "belgica") {
    ivaNote = Math.round(annual * 0.21);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcBelgiumTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "francia") {
    ivaNote = Math.round(annual * 0.20);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcFranceTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "italia") {
    ivaNote = Math.round(annual * 0.22);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcItalyTax(netAnnual, regime);
    breakdown = result.breakdown;
    sinLLC = result.tax;
  } else if (country === "austria") {
    ivaNote = Math.round(annual * 0.20);
    const netAnnual = Math.max(0, annual - itemizedDeductible);
    const result = calcAustriaTax(netAnnual, regime);
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
    const irpfLLCResult = calcSpanishIRPFDetailed(llcProfit);
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

export function formatCurrency(value: number, currencyCode: string = "EUR", locale?: string): string {
  return new Intl.NumberFormat(locale || "es-ES", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const COUNTRY_CURRENCY: Record<string, { symbol: string; code: string; name: string; rate: number }> = {
  espana:        { symbol: "€",  code: "EUR", name: "euros",           rate: 1 },
  mexico:        { symbol: "$",  code: "MXN", name: "pesos mexicanos", rate: 22 },
  chile:         { symbol: "$",  code: "CLP", name: "pesos chilenos",  rate: 1000 },
  "reino-unido": { symbol: "£",  code: "GBP", name: "libras",         rate: 0.86 },
  belgica:       { symbol: "€",  code: "EUR", name: "euros",           rate: 1 },
  francia:       { symbol: "€",  code: "EUR", name: "euros",           rate: 1 },
  italia:        { symbol: "€",  code: "EUR", name: "euros",           rate: 1 },
  austria:       { symbol: "€",  code: "EUR", name: "euros",           rate: 1 },
};

export const countries = [
  { id: "espana",       label: "España",      flag: "/img/flags/espana.png" },
  { id: "mexico",       label: "México",      flag: "/img/flags/mexico.png" },
  { id: "chile",        label: "Chile",        flag: "/img/flags/chile.png" },
  { id: "reino-unido",  label: "Reino Unido",  flag: "/img/flags/reino-unido.png" },
  { id: "francia",      label: "Francia",      flag: "/img/flags/francia.png" },
  { id: "belgica",      label: "Bélgica",      flag: "/img/flags/belgica.png" },
  { id: "italia",       label: "Italia",       flag: "/img/flags/italia.png" },
  { id: "austria",      label: "Austria",      flag: "/img/flags/austria.png" },
];

export type RegimeDef = { id: string; label: string };

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
  italia:       [
    { id: "autonomo", label: "Lavoratore Autonomo" },
    { id: "sociedad", label: "Società (SRL)" },
    { id: "sin-regimen", label: "Sin régimen" },
  ],
  austria:      [
    { id: "autonomo", label: "Einzelunternehmer" },
    { id: "sociedad", label: "GmbH" },
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
