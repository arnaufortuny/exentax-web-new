/**
 * calculator-config.ts
 * ----------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every numeric constant the calculator uses:
 *   - Personal deductions, IRPF/IS/ISR brackets per country (2026).
 *   - Spanish autonomo Social Security bracket table (TGSS 2026).
 *   - Country-specific autonomo / sociedad parameters (rates, admin costs).
 *   - LLC USA setup + maintenance costs (Exentax 2026 pricing).
 *   - Per-activity default expense ratios.
 *   - Display currencies and approximate FX rates (EUR base).
 *   - Input safety bounds (min, UI max, sanity max).
 *
 * Why this file exists:
 *   Before Task #8 every constant lived inline inside `calculator.ts`.
 *   Several values were silently duplicated between `calc*Tax` (the
 *   local-regime branch) and `calcResidenceLLCTax` (the residence-tax-on-
 *   LLC-profits branch). Centralising avoids that drift.
 *
 * IMPORTANT — every change to a number in this file must:
 *   1. Update the year/source comment next to the constant.
 *   2. Be cross-verified against an official source (AEAT, HMRC, SAT, SII,
 *      DGFiP, BMF, FOD Financiën, Agenzia Entrate, TGSS).
 *   3. Pass `npm run test:calculator` (presets must still favour LLC for
 *      international digital profiles; "LLC not best" cases must remain).
 * ----------------------------------------------------------------------------
 */

// --- Spain - Personal income tax + Social Security ---------------------------

// Mínimo personal y familiar IRPF 2026 (LIRPF art. 57). 5.550 € base.
export const PERSONAL_DEDUCTION_ES = 5550;

// Tarifa progresiva IRPF 2026 – escala agregada (estatal + autonómica).
// Cada CCAA varía la parte autonómica ±1-3 pts; ofrecemos 3 perfiles para
// que el usuario elija el más cercano a su residencia fiscal.
//
// Perfiles:
//   - "media"  : escala media nacional, default (Aragón, Asturias, Castilla-León,
//                Castilla-La Mancha, Canarias, Cantabria, Murcia, Navarra,
//                Galicia, Extremadura, Baleares).
//   - "baja"   : Madrid, Andalucía, La Rioja → tramo alto reducido ~1-2 pts.
//   - "alta"   : Cataluña, Valencia, Asturias-tramo-alto → tramo alto +2-3 pts.
//
// Fuentes: leyes autonómicas vigentes 2026; cifras alineadas con los tramos
// publicados en `tramos-irpf-2026.ts` (artículo blog Exentax).
export const IRPF_BRACKETS_MEDIUM = [
  { limit: 12450,    rate: 0.19 },
  { limit: 20200,    rate: 0.24 },
  { limit: 35200,    rate: 0.30 },
  { limit: 60000,    rate: 0.37 },
  { limit: 300000,   rate: 0.45 },
  { limit: Infinity, rate: 0.47 },
];

// Madrid / Andalucía / La Rioja (CCAA con escalas autonómicas más bajas):
// tramos alto y muy-alto reducidos ~1-2 pts respecto a la media.
export const IRPF_BRACKETS_LOW = [
  { limit: 12450,    rate: 0.18 },
  { limit: 20200,    rate: 0.23 },
  { limit: 35200,    rate: 0.29 },
  { limit: 60000,    rate: 0.36 },
  { limit: 300000,   rate: 0.43 },
  { limit: Infinity, rate: 0.45 },
];

// Cataluña / Valencia / Asturias (tramo alto): escalas autonómicas más altas,
// +2-3 pts en tramo alto y muy-alto.
export const IRPF_BRACKETS_HIGH = [
  { limit: 12450,    rate: 0.20 },
  { limit: 20200,    rate: 0.25 },
  { limit: 35200,    rate: 0.31 },
  { limit: 60000,    rate: 0.39 },
  { limit: 300000,   rate: 0.47 },
  { limit: Infinity, rate: 0.50 },
];

// Default backwards-compatible export (escala media).
export const IRPF_BRACKETS = IRPF_BRACKETS_MEDIUM;

export type CcaaProfile = "low" | "medium" | "high";

export function getIrpfBrackets(profile: CcaaProfile = "medium") {
  if (profile === "low") return IRPF_BRACKETS_LOW;
  if (profile === "high") return IRPF_BRACKETS_HIGH;
  return IRPF_BRACKETS_MEDIUM;
}

// IRPF dividendos / rentas del ahorro 2026 (base del ahorro, art. 66 LIRPF).
export const SPAIN_DIVIDEND_BRACKETS = [
  { limit: 6000,     rate: 0.19 },
  { limit: 50000,    rate: 0.21 },
  { limit: 200000,   rate: 0.23 },
  { limit: 300000,   rate: 0.27 },
  { limit: Infinity, rate: 0.28 },
];

// Cuota mensual TGSS autónomos 2026 – sistema de cotización por rendimientos
// reales. 15 tramos oficiales desde 200 € (tramo 1) hasta 604,80 € (tramo 15)
// calculados sobre la base mínima de cada tramo, tipo conjunto 31,5 %
// (CC + CP + cese + FP + MEI 0,8 % en 2026).
//
// Marco normativo:
//   - RDL 13/2022 (BOE-A-2022-12482), Disposición Transitoria 1ª: trayectoria
//     2023-2032 del nuevo sistema de cotización por ingresos reales.
//   - Acuerdo de Mesa de Diálogo Social Autónomos (jul-2022): trayectoria
//     bianual de los 15 tramos hasta 2032.
//   - TRLGSS (BOE-A-1994-14960), arts. 305-308 sobre RETA.
//
// Cross-check (2026-04-26): valores idénticos a la tabla publicada en
// `client/src/data/blog-content/es/cuotas-autonomos-2026-guia-completa.ts`,
// que cita Sede Electrónica TGSS y los textos BOE arriba. Ante el cierre
// del ejercicio 2026, contrastar también con la resolución TGSS de
// presupuestos generales que confirme la tabla definitiva del año.
//
// Verificación oficial (2026-04-26) — fuentes consultadas:
//   1. TGSS Sede Electrónica — cuotas autónomos 2026:
//      https://sede.seg-social.gob.es/wps/portal/sede/sede/Inicio
//   2. BOE — RDL 13/2022, de 26 de julio (sistema de cotización por ingresos
//      reales del RETA), Disp. Trans. 1ª (trayectoria 2023-2032):
//      https://www.boe.es/diario_boe/txt.php?id=BOE-A-2022-12482
//   3. Acuerdo de la Mesa de Diálogo Social de Autónomos (jul-2022) —
//      trayectoria bianual de los 15 tramos hasta 2032:
//      https://prensa.mites.gob.es/WebPrensa/noticias/seguridadsocial/detalle/4283
//   4. TRLGSS arts. 305-308 (RETA, base de cotización, tipos):
//      https://www.boe.es/buscar/act.php?id=BOE-A-1994-14960
//
// Los valores `monthly` corresponden a la cuota calibrada para el ejercicio
// 2026 dentro de la trayectoria transitoria establecida en RDL 13/2022
// Disp. Trans. 1ª (segundo tramo del calendario 2023-2025 → 2026-2028).
// VERIFIED 2026-04-26 against the four sources above.
export const SS_AUTONOMO_BRACKETS_2026 = [
  { limit: 670,      monthly: 200.00 },  // Tramo 1
  { limit: 900,      monthly: 220.00 },  // Tramo 2
  { limit: 1166.70,  monthly: 260.00 },  // Tramo 3
  { limit: 1300,     monthly: 293.90 },  // Tramo 4
  { limit: 1500,     monthly: 296.60 },  // Tramo 5
  { limit: 1700,     monthly: 296.60 },  // Tramo 6
  { limit: 1850,     monthly: 355.30 },  // Tramo 7
  { limit: 2030,     monthly: 375.60 },  // Tramo 8
  { limit: 2330,     monthly: 395.90 },  // Tramo 9
  { limit: 2760,     monthly: 423.30 },  // Tramo 10
  { limit: 3190,     monthly: 448.80 },  // Tramo 11
  { limit: 3620,     monthly: 474.30 },  // Tramo 12
  { limit: 4050,     monthly: 502.30 },  // Tramo 13
  { limit: 6000,     monthly: 543.30 },  // Tramo 14
  { limit: Infinity, monthly: 604.80 },  // Tramo 15
];

// Tarifa plana 2026: cuota reducida 80 €/mes durante los primeros 12 meses
// de alta como autónomo (RD-Ley 13/2022, prorrogada para 2026).
export const TARIFA_PLANA_MONTHLY_ES = 80;

// Sociedad ES: base mínima cotización administrador y tipo agregado.
export const SPAIN_SOCIEDAD_ADMIN_BASE_MIN = 1000;
export const SPAIN_SOCIEDAD_ADMIN_RATE = 0.3130;
// Coste anual gestoría sociedad ES (estimación pragmática Exentax 2026).
export const SPAIN_SOCIEDAD_ADMIN_ANNUAL_COSTS = 3500;
// % de la base imponible neta de la SL que se asigna como salario al
// administrador único en el modelo del comparador. Es una proxy razonable:
// pagar el 25 % como salario y dejar el resto como beneficio para tributar
// por IS + dividendos refleja una práctica habitual de optimización.
// Antes (audit Task #17 abr-2026) era un literal `0.25` dentro de
// `calculator.ts`, violando la regla "ningún literal en el cuerpo del
// cálculo". Centralizado aquí para auditabilidad.
export const SPAIN_SOCIEDAD_ADMIN_PROFIT_SHARE = 0.25;
// IS reducido / general 2026 (Ley 27/2014 IS + Ley de Presupuestos 2026).
export const SPAIN_IS_RATE_REDUCED = 0.23;
export const SPAIN_IS_RATE_GENERAL = 0.25;
export const SPAIN_IS_REDUCED_REVENUE_CAP = 1_000_000;

// --- United Kingdom (HMRC 2025/26) -------------------------------------------

export const UK_INCOME_TAX_BRACKETS = [
  { limit: 12_570,   rate: 0 },     // Personal allowance
  { limit: 50_270,   rate: 0.20 },  // Basic rate
  { limit: 125_140,  rate: 0.40 },  // Higher rate
  { limit: Infinity, rate: 0.45 },  // Additional rate
];
export const UK_NI_PRIMARY_THRESHOLD = 12_570;
export const UK_NI_UPPER_LIMIT = 50_270;
export const UK_NI_RATE_MAIN = 0.08;     // Class 4 main 2025/26
export const UK_NI_RATE_ABOVE = 0.02;    // Class 4 above UEL
export const UK_CT_SMALL_PROFITS = 0.19; // ≤ £50k
export const UK_CT_MAIN_RATE = 0.25;     // ≥ £250k (no marginal relief modelled)
export const UK_CT_SMALL_THRESHOLD = 50_000;
export const UK_LTD_ACCOUNTANCY_ANNUAL = 3500;

// --- Belgium (FOD Financiën 2025) --------------------------------------------

export const BELGIUM_IPP_BRACKETS = [
  { limit: 15_820,   rate: 0.25 },
  { limit: 27_920,   rate: 0.40 },
  { limit: 48_320,   rate: 0.45 },
  { limit: Infinity, rate: 0.50 },
];
export const BELGIUM_INDEP_SS_RATE = 0.205; // INASTI cotisations
export const BELGIUM_IS_REDUCED = 0.20;     // ≤ €100k
export const BELGIUM_IS_GENERAL = 0.25;
export const BELGIUM_IS_REDUCED_THRESHOLD = 100_000;
export const BELGIUM_DIVIDEND_RATE = 0.30;
export const BELGIUM_COMPTABLE_ANNUAL = 4000;

// --- France (DGFiP 2025) -----------------------------------------------------

export const FRANCE_IR_BRACKETS = [
  { limit: 11_294,   rate: 0 },
  { limit: 28_797,   rate: 0.11 },
  { limit: 82_341,   rate: 0.30 },
  { limit: 177_106,  rate: 0.41 },
  { limit: Infinity, rate: 0.45 },
];
export const FRANCE_URSSAF_RATE = 0.22;
// Régime micro auto-entrepreneur (BNC services / professions libérales)
// abattement forfaitaire de 50% sobre el chiffre d'affaires.
export const FR_MICRO_ABATTEMENT_BNC = 0.50;
export const FR_MICRO_URSSAF_RATE = 0.22;
// Plafond 2025 micro BNC services: 77.700 €/año.
export const FR_MICRO_CEILING_BNC = 77_700;
// Prélèvements sociaux residentes franceses sobre rendimientos del capital
// (CSG + CRDS + solidarité = 17,2%).
export const FR_PRELEVEMENTS_SOCIAUX_RATE = 0.172;
// Régime réel: deduction forfaitaire 22% antes del IR.
export const FR_REEL_NET_BASE_FACTOR = 0.78;
// IS Francia: petit IS 15% hasta 42.500 €.
export const FR_IS_SMALL_RATE = 0.15;
export const FR_IS_GENERAL_RATE = 0.25;
export const FR_IS_SMALL_THRESHOLD = 42_500;
export const FR_DIVIDEND_FLAT_TAX = 0.30; // Prélèvement forfaitaire unique (PFU)
export const FR_COMPTABLE_ANNUAL = 3800;

// --- Italy (Agenzia Entrate 2025) --------------------------------------------

export const ITALY_IRPEF_BRACKETS = [
  { limit: 28_000,   rate: 0.23 },
  { limit: 50_000,   rate: 0.35 },
  { limit: Infinity, rate: 0.43 },
];
export const ITALY_INPS_RATE = 0.2572;       // Gestione Separata professionisti
export const ITALY_IRES_RATE = 0.24;
export const ITALY_IRAP_RATE = 0.039;
export const ITALY_DIVIDEND_RATE = 0.26;
export const ITALY_COMMERCIALISTA_ANNUAL = 3500;

// --- Mexico (SAT 2025) -------------------------------------------------------

export const MEXICO_ISR_BRACKETS = [
  { limit: 82_260,    rate: 0.0192 },
  { limit: 134_856,   rate: 0.0640 },
  { limit: 236_472,   rate: 0.1088 },
  { limit: 413_196,   rate: 0.1600 },
  { limit: 555_396,   rate: 0.2176 },
  { limit: 1_118_196, rate: 0.2400 },
  { limit: 1_753_992, rate: 0.2800 },
  { limit: Infinity,  rate: 0.3500 },
];
export const MEXICO_IMSS_RATE = 0.045;
export const MEXICO_ISR_PM_RATE = 0.30;       // Persona Moral
export const MEXICO_DIVIDEND_RATE = 0.10;
export const MEXICO_CONTABILIDAD_ANNUAL = 3200;

// --- Chile (SII 2025) --------------------------------------------------------

// UTM mensual de referencia (valor abril 2025; revisar anualmente).
export const CHILE_UTM_MONTHLY = 68_076;
export const CHILE_UTM_ANNUAL = CHILE_UTM_MONTHLY * 12;
export const CHILE_GLOBAL_COMPLEMENTARIO_BRACKETS = [
  { limit: 13.5 * CHILE_UTM_ANNUAL, rate: 0 },
  { limit: 30   * CHILE_UTM_ANNUAL, rate: 0.04 },
  { limit: 50   * CHILE_UTM_ANNUAL, rate: 0.08 },
  { limit: 70   * CHILE_UTM_ANNUAL, rate: 0.135 },
  { limit: 90   * CHILE_UTM_ANNUAL, rate: 0.23 },
  { limit: 120  * CHILE_UTM_ANNUAL, rate: 0.304 },
  { limit: 150  * CHILE_UTM_ANNUAL, rate: 0.354 },
  { limit: Infinity,                rate: 0.40 },
];
export const CHILE_AFP_RATE = 0.10;
export const CHILE_PRIMERA_CATEGORIA_RATE = 0.27;
export const CHILE_DIVIDEND_RATE = 0.13;
export const CHILE_CONTABILIDAD_ANNUAL = 3000;

// --- Austria (BMF 2025) ------------------------------------------------------

export const AUSTRIA_EST_BRACKETS = [
  { limit: 12_816,    rate: 0 },
  { limit: 20_818,    rate: 0.20 },
  { limit: 34_513,    rate: 0.30 },
  { limit: 66_612,    rate: 0.40 },
  { limit: 99_266,    rate: 0.48 },
  { limit: 1_000_000, rate: 0.50 },
  { limit: Infinity,  rate: 0.55 },
];
export const AUSTRIA_SVS_RATE = 0.268;
export const AUSTRIA_KOEST_RATE = 0.23;
export const AUSTRIA_KEST_RATE = 0.275;
export const AUSTRIA_STEUERBERATER_ANNUAL = 3800;

// --- Net-base proxies for autonomo deductions (when no itemized expenses) ---
//
// Many countries (UK/FR/IT/AT) accept a flat % de gastos deducibles cuando
// el contribuyente no itemiza. Estos factores son una proxy razonable —
// el UI permite reemplazarlos con `expenseItems` reales.
export const AUTONOMO_NET_FACTORS: Record<string, number> = {
  "reino-unido": 0.80,
  belgica:       0.80,
  francia:       0.78,
  italia:        0.78,
  austria:       0.80,
  mexico:        0.80,
  chile:         0.80,
};
export const SOCIEDAD_PROFIT_FACTORS: Record<string, number> = {
  "reino-unido": 0.72,
  belgica:       0.70,
  francia:       0.70,
  italia:        0.72,
  austria:       0.72,
  mexico:        0.72,
  chile:         0.72,
};

// Defensive fallbacks for the lookups above. Used only if a country key
// is missing (should never happen for the supported list). Kept here so
// `calculator.ts` contains zero numeric literals.
export const DEFAULT_AUTONOMO_NET_FACTOR = 0.80;
export const DEFAULT_SOCIEDAD_PROFIT_FACTOR = 0.72;

// NOTE (audit Task #17 abr-2026): los antiguos `SOCIEDAD_ADMIN_SS_BASE_MIN`
// y `SOCIEDAD_ADMIN_SS_RATE` eran duplicados literales de
// `SPAIN_SOCIEDAD_ADMIN_BASE_MIN` y `SPAIN_SOCIEDAD_ADMIN_RATE` (mismo valor,
// misma fuente). Consolidados en una sola pareja prefijada con el país. Si
// algún consumer externo importa los nombres viejos, fallará en compile —
// migrar al prefijo `SPAIN_*` para consistencia con el resto del archivo.

// UK dividend distribution model used when the local company opts to pay
// out as dividends instead of salary.
//   UK_DIVIDEND_PAYOUT_RATIO  = % of post-corp-tax profit distributed
//   UK_DIVIDEND_EFFECTIVE_RATE = effective dividend tax (HMRC higher bracket
//                                blend, FY 2025/26)
// SOURCE: https://www.gov.uk/tax-on-dividends (revisado abril 2026)
export const UK_DIVIDEND_PAYOUT_RATIO = 0.30;
export const UK_DIVIDEND_EFFECTIVE_RATE = 0.3375;

// --- LLC USA -----------------------------------------------------------------

// Exentax 2026 pricing benchmark.
export const LLC_FORMATION_COST = 2000;
export const LLC_ANNUAL_COST = 1500;

// --- Sociedad local fixed costs (3-way comparator) ---------------------------

export const SOCIEDAD_COSTS: Record<string, { setup: number; fixedAnnual: number }> = {
  espana:        { setup: 1500, fixedAnnual: 1800 },
  mexico:        { setup: 1200, fixedAnnual: 1500 },
  chile:         { setup: 1200, fixedAnnual: 1400 },
  "reino-unido": { setup:  500, fixedAnnual: 1200 },
  francia:       { setup: 1500, fixedAnnual: 2000 },
  belgica:       { setup: 1800, fixedAnnual: 2200 },
  italia:        { setup: 2000, fixedAnnual: 2500 },
  austria:       { setup: 1800, fixedAnnual: 2200 },
};

// Amortization horizon for one-off setup costs in the 3-way comparison.
export const STRUCTURE_AMORTIZATION_YEARS = 3;

// --- VAT / IVA notes (informativos) ------------------------------------------

export const COUNTRY_VAT_RATES: Record<string, number> = {
  espana:        0.21,
  mexico:        0.16,
  chile:         0.19,
  "reino-unido": 0.20,
  francia:       0.20,
  belgica:       0.21,
  italia:        0.22,
  austria:       0.20,
};

// --- Activity expense rates --------------------------------------------------
//
// Default % of gross revenue treated as activity-related deductible expense
// when the user does NOT provide itemized expenses. Calibrated to typical
// margins in each digital activity. Override via `expenseItems`.
export const ACTIVITY_EXPENSE_RATE: Record<string, number> = {
  digitalServices:       0.20,
  consultingAdvisory:    0.15,
  marketingAdvertising:  0.22,
  socialMedia:           0.22,
  contentCreation:       0.25,
  influencer:            0.25,
  affiliateMarketing:    0.15,
  onlineCourses:         0.20,
  coachingMentoring:     0.15,
  freelanceServices:     0.20,
  copywriting:           0.12,
  graphicDesign:         0.18,
  videoEditing:          0.22,
  webDesign:             0.18,
  webDevelopment:        0.22,
  appDevelopment:        0.22,
  softwareSaas:          0.25,
  aiAutomation:          0.25,
  ecommerceOwn:          0.35,
  dropshipping:          0.40,
  printOnDemand:         0.35,
  digitalProducts:       0.15,
  subscriptionBusiness:  0.20,
  membershipPlatforms:   0.20,
  communityMonetization: 0.18,
  onlineEducation:       0.20,
  leadGeneration:        0.18,
  mediaBuying:           0.30,
  seoServices:           0.15,
  emailMarketing:        0.18,
  salesFunnels:          0.20,
  digitalAgency:         0.25,
  outsourcing:           0.22,
  virtualAssistant:      0.12,
  remoteTeam:            0.22,
  trading:               0.12,
  cryptoInvestments:     0.10,
  nftDigitalAssets:      0.12,
  onlineBetting:         0.10,
  domainFlipping:        0.15,
  appMonetization:       0.20,
  dataAnalytics:         0.18,
  cybersecurity:         0.18,
  cloudServices:         0.22,
  apiServices:           0.20,
  noCodeDev:             0.18,
  otherDigital:          0.20,
};
export const ACTIVITY_EXPENSE_RATE_DEFAULT = 0.20;

// --- Display currencies + FX rates (EUR base) --------------------------------
//
// Internal math is always EUR. Conversion is applied only at presentation
// time. Rates are intentionally STABLE approximations, not live FX —
// the UI declares the estimation nature explicitly.
//
// Ordering of FX must stay in sync with the per-country bracket helpers
// (UK/MX/CL apply FX inside the tax math), so changing a rate here also
// requires re-running `npm run test:calculator`.
import { FX_RATES_PER_EUR } from "@shared/calculator-fx";

export const DISPLAY_CURRENCIES: Record<string, { symbol: string; code: string; name: string; rate: number; flag: string }> = {
  EUR: { symbol: "€", code: "EUR", name: "Euro",          rate: FX_RATES_PER_EUR.EUR, flag: "/img/flags/eu.png" },
  USD: { symbol: "$", code: "USD", name: "US Dollar",     rate: FX_RATES_PER_EUR.USD, flag: "/img/flags/us.png" },
  GBP: { symbol: "£", code: "GBP", name: "British Pound", rate: FX_RATES_PER_EUR.GBP, flag: "/img/flags/reino-unido.png" },
};

// Convenience accessors so tax helpers don't read the rate map twice.
export const GBP_PER_EUR = DISPLAY_CURRENCIES.GBP.rate;

// Internal-only conversion factors for autónomo bracket math in countries
// whose IRPF/ISR is denominated by law in the local currency. NOT exposed
// as user-selectable display currencies — Mexico/Chile users see results
// in EUR/USD/GBP. Stable approximations; update together with brackets.
export const _MEXICO_PESO_PER_EUR_INTERNAL = 22;
export const _CHILE_PESO_PER_EUR_INTERNAL = 1000;

// --- Input safety bounds -----------------------------------------------------

// UI enforces MONTHLY_INCOME_MIN..MAX. The library applies the wider
// MONTHLY_INCOME_SANITY_MAX as defense-in-depth against NaN/Infinity or
// out-of-band callers (tests, future surfaces).
export const MONTHLY_INCOME_MIN = 1000;
export const MONTHLY_INCOME_MAX = 100_000;
export const MONTHLY_INCOME_SANITY_MAX = 1_000_000;
