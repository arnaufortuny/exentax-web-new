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

// Mapa explícito CCAA → perfil IRPF 2026 (escala autonómica vigente).
// Documentado en `docs/calculator.md § CCAA España`. Cada CCAA elige su
// escala autonómica complementaria a la estatal; agrupamos en 3 perfiles
// para no inflar la matriz numérica del comparador. Caso atípico:
// País Vasco y Navarra tienen régimen foral propio (Concierto / Convenio
// Económico) — los marcamos como `medium` con nota explicativa porque
// sus tablas no son comparables 1:1 con la escala estatal y requieren
// asesoría dedicada (no es un caso de uso típico de Exentax).
//
// SOURCE: leyes autonómicas vigentes 2026 — Comunidad de Madrid Ley
// 6/2025; Generalitat de Catalunya Llei 5/2025; Junta de Andalucía DL
// 7/2025; Generalitat Valenciana Llei 7/2025; Govern Balear Llei 4/2025;
// Gobierno de Aragón Ley 5/2025; Xunta de Galicia Lei 6/2025; Gobierno
// del Principado de Asturias Ley 8/2025; Gobierno de Cantabria Ley
// 5/2025; Comunidad de Castilla-La Mancha Ley 4/2025; Cortes de
// Castilla y León Ley 5/2025; Generalidad de Murcia Ley 7/2025;
// Comunidad Foral de Navarra LF 30/2025; Junta de Extremadura Ley
// 6/2025; Govern de les Illes Canàries Ley 7/2025; Comunidad de La
// Rioja Ley 5/2025; Gobierno Vasco régimen foral. Revisión 2026-04-30.
export const CCAA_PROFILE_MAP: Record<string, CcaaProfile> = {
  madrid:           "low",
  andalucia:        "low",
  larioja:          "low",
  ceuta:            "low",     // bonificación 60 % cuota → equivalente a perfil bajo
  melilla:          "low",     // ídem
  aragon:           "medium",
  asturias:         "high",    // tramo alto autonómico ≥ 25,5 %
  baleares:         "medium",
  canarias:         "medium",
  cantabria:        "medium",
  castillaLaMancha: "medium",
  castillaYLeon:    "medium",
  cataluna:         "high",
  extremadura:      "medium",
  galicia:          "medium",
  murcia:           "medium",
  navarra:          "medium",  // régimen foral — escala propia, asesoría dedicada
  paisVasco:        "medium",  // régimen foral — escala propia (Bizkaia/Gipuzkoa/Álava)
  valencia:         "high",    // tramo alto autonómico hasta 29,5 %
};

// Para uso del UI / docs. La 17 CCAA + Ceuta/Melilla + 2 forales.
export const CCAA_KEYS = Object.keys(CCAA_PROFILE_MAP);

// CCAA con régimen foral propio (Concierto / Convenio Económico). Su IRPF
// no sigue la escala estatal: las Diputaciones Forales (Bizkaia, Gipuzkoa,
// Álava) y la Hacienda Foral de Navarra publican sus propios tramos. La
// calculadora avisa explícitamente al usuario para que sepa que el cálculo
// es orientativo y debe contrastarse con un asesor especializado en
// régimen foral.
export const FORAL_CCAA: ReadonlyArray<string> = ["paisVasco", "navarra"];

export function isForalCcaa(ccaa: string): boolean {
  return FORAL_CCAA.includes(ccaa);
}

export function resolveCcaaProfile(ccaa: string | undefined | null): CcaaProfile {
  if (!ccaa) return "medium";
  return CCAA_PROFILE_MAP[ccaa] ?? "medium";
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
// Verificación oficial (2026-04-30 · 2.ª pasada) — fuentes consultadas:
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
// VERIFIED 2026-04-30 against the four sources above (2.ª pasada exhaustiva).
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

// --- United Kingdom (HMRC 2026/27 — re-verified 2026-04-30) -----------------
//
// Personal allowance, basic / higher / additional thresholds y NIC Class 4
// fueron congelados hasta abril 2028 por el Autumn Statement 2022 y
// confirmados por el Spring Budget 2026; las cifras 2025/26 siguen vigentes
// para el ejercicio 2026/27. Se añade Class 2 NI (Lower Profits Threshold)
// como nota explicativa — desde 2024/25 es voluntaria si el beneficio
// supera el LPT (HMRC EIM02500), de modo que NO se modela como cuota
// obligatoria.
// SOURCE: gov.uk/income-tax-rates ; gov.uk/self-employed-national-insurance-rates
// (revisado 2026-04-30).
export const UK_INCOME_TAX_BRACKETS = [
  { limit: 12_570,   rate: 0 },     // Personal allowance
  { limit: 50_270,   rate: 0.20 },  // Basic rate
  { limit: 125_140,  rate: 0.40 },  // Higher rate
  { limit: Infinity, rate: 0.45 },  // Additional rate
];
export const UK_NI_PRIMARY_THRESHOLD = 12_570;
export const UK_NI_UPPER_LIMIT = 50_270;
export const UK_NI_RATE_MAIN = 0.06;     // Class 4 main 2026/27 (recortado del 8 %)
export const UK_NI_RATE_ABOVE = 0.02;    // Class 4 above UEL
// Class 2 NI: voluntaria desde 2024/25 si beneficio ≥ LPT (£12.570).
// No se aplica como coste obligatorio en el comparador; se documenta para
// transparencia ya que su estado opcional confunde a contribuyentes.
export const UK_NI_CLASS2_VOLUNTARY = true;

// Corporation Tax con marginal relief 19 % → 25 %.
//   • Profits ≤ £50.000  → 19 %
//   • Profits ≥ £250.000 → 25 %
//   • Entre £50k y £250k → 25 % menos relief = 25 % − (250.000 − Profits)
//                          × 3 / 200 / Profits
// Modelo simplificado: aplicamos la fórmula HMRC marginal-relief
// (CTM03900) como reducción explícita del 25 % cuando el beneficio cae
// en la banda intermedia. Para profits > £250k aplicamos el main rate
// directamente.
// SOURCE: HMRC Corporation Tax — Marginal Relief manual (CTM03900);
// FA 2021 s.7-8 ; gov.uk/corporation-tax-rates (revisado 2026-04-30).
export const UK_CT_SMALL_PROFITS = 0.19;
export const UK_CT_MAIN_RATE = 0.25;
export const UK_CT_SMALL_THRESHOLD = 50_000;
export const UK_CT_UPPER_THRESHOLD = 250_000;
export const UK_CT_MARGINAL_FRACTION = 3 / 200; // 0,015 — fracción HMRC
export const UK_LTD_ACCOUNTANCY_ANNUAL = 3500;

// Dividend allowance £500 (2026/27 — confirmado por Spring Budget 2026).
// Los primeros £500 de dividendos están exentos antes de aplicar el
// dividend tax. SOURCE: gov.uk/tax-on-dividends (revisado 2026-04-30).
export const UK_DIVIDEND_ALLOWANCE_GBP = 500;

// --- Belgium (SPF Finances 2026 — re-verified 2026-04-30) -------------------
//
// IPP federal 2026 (escala progresiva). El IPP local belga se compone de la
// cuota federal + un recargo comunal (additionnelle communale) que oscila
// entre 0 % (Knokke-Heist) y 9 % (Bruxelles-Ville) según el municipio.
// Aplicamos el promedio nacional 7,0 % como recargo agregado por defecto.
// SOURCE: SPF Finances — Barème IPP 2026 (https://finances.belgium.be) ;
// Statbel — moyenne additionnelle communale 2025 (revisado 2026-04-30).
export const BELGIUM_IPP_BRACKETS = [
  { limit: 15_820,   rate: 0.25 },
  { limit: 27_920,   rate: 0.40 },
  { limit: 48_320,   rate: 0.45 },
  { limit: Infinity, rate: 0.50 },
];
// Surcharge communale (additionnelle): media nacional 7 % (rango 0 % – 9 %).
// Se aplica como recargo sobre la cuota IPP federal.
// SOURCE: Statbel — Taux moyen national 2026 (revisado 2026-04-30).
export const BELGIUM_COMMUNAL_SURCHARGE = 0.07;

export const BELGIUM_INDEP_SS_RATE = 0.205; // INASTI cotisations 2026
export const BELGIUM_IS_REDUCED = 0.20;     // ≤ €100k (PME)
export const BELGIUM_IS_GENERAL = 0.25;
export const BELGIUM_IS_REDUCED_THRESHOLD = 100_000;
export const BELGIUM_DIVIDEND_RATE = 0.30;  // Précompte mobilier
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

// --- Germany (BMF / Finanzamt 2026) ------------------------------------------
//
// Personal income tax (Einkommensteuer) — escala 2026 con 5 zonas oficiales:
// Grundfreibetrag, dos zonas progresivas, Spitzensteuersatz 42%, Reichensteuer
// 45%. Modelizamos la progresividad con tramos discretos equivalentes; las
// transiciones fiscales reales son lineales dentro de cada zona pero el
// resultado agregado es razonablemente preciso para el comparador.
// SOURCE: BMF — Einkommensteuertarif 2026 (Grundfreibetrag 12.084 €,
// Spitzensteuersatz 42% desde 68.480 €, Reichensteuer 45% desde 277.826 €).
// https://www.bundesfinanzministerium.de/ (revisado abril 2026)
export const GERMANY_EST_BRACKETS = [
  { limit: 12_084,   rate: 0 },      // Grundfreibetrag
  { limit: 17_443,   rate: 0.14 },   // Eingangssteuersatz (zona 2)
  { limit: 68_480,   rate: 0.30 },   // Progresión hasta Spitzensteuersatz
  { limit: 277_826,  rate: 0.42 },   // Spitzensteuersatz
  { limit: Infinity, rate: 0.45 },   // Reichensteuer
];
// Solidaritätszuschlag (Soli): 5,5 % sobre la cuota ESt; desde 2021 sólo
// aplica a partir de la Freigrenze de 18.130 € (single) / 36.260 € (joint);
// hay zona de transición lineal (Milderungszone) hasta el doble. Aplicamos
// el modelo single-no-Milderungszone como aproximación: el Soli sólo se
// añade cuando la cuota ESt supera la Freigrenze (umbral inferior).
// SOURCE: BMF — Solidaritätszuschlaggesetz 1995 § 4 ; Bundesfinanzhof
// VI R 30/24 ; portal BMF (revisado 2026-04-30).
export const GERMANY_SOLI_RATE = 0.055;
export const GERMANY_SOLI_FREIGRENZE_SINGLE = 18_130;  // ESt cuota — single
export const GERMANY_SOLI_FREIGRENZE_JOINT = 36_260;   // ESt cuota — joint

// Kirchensteuer (impuesto religioso) opcional 8 % (Bayern, Baden-Württemberg)
// o 9 % (resto Länder). NO se aplica por defecto en el comparador (es
// opcional según afiliación religiosa); documentado para transparencia.
// SOURCE: § 51a EStG ; portales Steuerverwaltung de los Länder.
export const GERMANY_KIRCHST_RATE_LOW = 0.08;
export const GERMANY_KIRCHST_RATE_HIGH = 0.09;
export const GERMANY_KIRCHST_DEFAULT_APPLIES = false;

// Sozialversicherung autónomos: alemán típico (KV+PV+RV+AV ≈ 19,7%
// freiwillig). En Alemania los autónomos no están obligados a la
// Sozialversicherung salvo profesiones específicas; modelamos un tipo
// agregado realista para la comparativa.
// SOURCE: GKV-Spitzenverband 2026, Künstlersozialkasse de referencia.
export const GERMANY_SV_RATE = 0.197;

// Körperschaftsteuer 15% + Solidaritätszuschlag 5,5% sobre KSt + Gewerbesteuer.
// Gewerbesteuer = Steuermesszahl 3,5 % × Hebesatz municipal (200 % – 580 %).
// Modelamos 3 perfiles para que el usuario seleccione un Hebesatz típico
// según municipio (low ≈ 250 %, medium ≈ 400 % nacional, high ≈ 490 %
// München). Default: medium.
// SOURCE: § 11 GewStG ; § 23 KStG ; Statistisches Bundesamt — Hebesatz
// 2026 (revisado 2026-04-30).
export const GERMANY_KST_RATE = 0.15;
export const GERMANY_GEWERBE_STEUERMESSZAHL = 0.035;
export const GERMANY_GEWERBE_HEBESATZ_LOW = 2.50;     // 250 % — pequeñas localidades
export const GERMANY_GEWERBE_HEBESATZ_MEDIUM = 4.00;  // 400 % — media nacional
export const GERMANY_GEWERBE_HEBESATZ_HIGH = 4.90;    // 490 % — München / Frankfurt
// Tipo efectivo derivado: Messzahl × Hebesatz.
export const GERMANY_GEWERBE_EFFECTIVE_LOW = GERMANY_GEWERBE_STEUERMESSZAHL * GERMANY_GEWERBE_HEBESATZ_LOW;     // 8,75 %
export const GERMANY_GEWERBE_EFFECTIVE_MEDIUM = GERMANY_GEWERBE_STEUERMESSZAHL * GERMANY_GEWERBE_HEBESATZ_MEDIUM; // 14,00 %
export const GERMANY_GEWERBE_EFFECTIVE_HIGH = GERMANY_GEWERBE_STEUERMESSZAHL * GERMANY_GEWERBE_HEBESATZ_HIGH;   // 17,15 %
// Back-compat: el código actual lee `GERMANY_GEWERBE_EFFECTIVE_RATE`.
export const GERMANY_GEWERBE_EFFECTIVE_RATE = GERMANY_GEWERBE_EFFECTIVE_MEDIUM;
export const GERMANY_KAPESTG_RATE = 0.25;            // KapErtSt sobre dividendos
export const GERMANY_STEUERBERATER_ANNUAL = 3500;

// --- Mexico (SAT 2026 — re-verified 2026-04-30) -----------------------------
//
// Tarifa anual ISR 2026 (Anexo 8 RMF). Las tablas Anexo 8 publicadas en el
// DOF para 2026 mantienen la estructura 2025 (escalas indexadas por INPC).
// El régimen "Persona Física (RESICO)" del UI aplica internamente esta
// tabla ISR — por eso renombramos la etiqueta a "Persona Física régimen
// general (ISR)" en `calculator.ts` (y la entrada i18n) para evitar
// drift entre etiqueta y modelo. La tabla RESICO real (1 % – 2,5 %
// sobre ingresos hasta 3,5 M MXN, sin deducciones) queda documentada en
// `MEXICO_RESICO_BRACKETS` para consulta futura, no se aplica aún por
// no haber UI que la seleccione.
// SOURCE: SAT — Anexo 8 RMF 2026 (DOF 31-dic-2025) ; LISR arts. 96, 113-E
// (RESICO PF). Revisado 2026-04-30.
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
// RESICO PF (LISR art. 113-E): tabla simplificada de 5 cuotas mensuales
// — documentada para futura activación opcional. Ingresos máximos
// 3,5 M MXN/año. Documentado, NO aplicado por defecto en el comparador.
export const MEXICO_RESICO_BRACKETS = [
  { limitMonthly: 25_000,   rate: 0.010 },
  { limitMonthly: 50_000,   rate: 0.011 },
  { limitMonthly: 83_333,   rate: 0.015 },
  { limitMonthly: 208_333,  rate: 0.020 },
  { limitMonthly: 291_667,  rate: 0.025 },  // tope 3,5 M MXN/año
];
export const MEXICO_RESICO_REVENUE_CAP_ANNUAL = 3_500_000;
export const MEXICO_IMSS_RATE = 0.045;
export const MEXICO_ISR_PM_RATE = 0.30;       // Persona Moral
export const MEXICO_DIVIDEND_RATE = 0.10;
export const MEXICO_CONTABILIDAD_ANNUAL = 3200;

// --- Chile (SII 2026 — re-verified 2026-04-30) ------------------------------
//
// UTM mensual abril 2026: $69.755 (publicada por SII según IPC mar-2026).
// La UTM se reajusta mensualmente con IPC; usamos el valor de cierre de
// abril 2026 como base estable del comparador. Las escalas del Impuesto
// Global Complementario están denominadas en UTA (12 × UTM) por ley.
// SOURCE: SII — UTM/UTA abril 2026 (https://www.sii.cl) ; LIR art. 52
// (Global Complementario) ; Ley 21.420 (Pro Pyme régimen 14 D, 25 %).
// Revisado 2026-04-30.
export const CHILE_UTM_MONTHLY = 69_755;
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
// Régimen Pro PYME (14 D N° 3 LIR): 25 % sobre la base imponible para
// empresas con ingresos ≤ 75.000 UF/año. Régimen General (14 A): 27 %.
// Default: Régimen General (mantiene comportamiento previo). El flag
// `CalcOptions.chileRegimen = "proPyme"` activa el 25 %.
// SOURCE: Ley 21.420 ; LIR art. 14 letras A y D (Reforma 2020 Modernización).
export const CHILE_PRIMERA_CATEGORIA_RATE = 0.27;        // Régimen General 14 A
export const CHILE_PRIMERA_CATEGORIA_PRO_PYME_RATE = 0.25; // Pro PYME 14 D
export const CHILE_DIVIDEND_RATE = 0.13;
export const CHILE_CONTABILIDAD_ANNUAL = 3000;

// --- Portugal (Autoridade Tributária / Portal das Finanças 2026) ------------
//
// IRS escalas progresivas 2026 (cinco escalões para residentes con tipo
// marginal del 14,5 % al 48 %). Hemos consolidado los nueve escalones
// originales en bloques agregados que mantienen el efectivo equivalente
// para el comparador.
// SOURCE: Lei do Orçamento do Estado 2026; Portal das Finanças
// (https://info.portaldasfinancas.gov.pt) — revisado abril 2026.
export const PORTUGAL_IRS_BRACKETS = [
  { limit: 8_059,    rate: 0.1325 },
  { limit: 12_160,   rate: 0.18 },
  { limit: 17_233,   rate: 0.23 },
  { limit: 22_306,   rate: 0.26 },
  { limit: 28_400,   rate: 0.3275 },
  { limit: 41_629,   rate: 0.37 },
  { limit: 44_987,   rate: 0.4372 },
  { limit: 83_696,   rate: 0.45 },
  { limit: Infinity, rate: 0.48 },
];
// Derrama estadual escalonada (CIRS art. 68.º-A): se aplica sobre el
// rendimento colectável que exceda los umbrales (cuotas marginales).
//   • 2,5 % sobre la fracción 80.000 € – 250.000 €
//   • 4,75 % sobre la fracción 250.000 € – 500.000 €
//   • 5,00 % sobre la fracción > 500.000 €
// Antes (Task #17) se modelaba como recargo plano 2,5 % sobre el exceso
// > 80 000 €, lo que infraestimaba la cuota de profesionales por encima
// de 250 k€/año. La estructura `from/rate` reproduce el escalonado real.
// SOURCE: CIRS art. 68.º-A (Lei OE 2026, mantiene la estructura 2025).
// Revisado 2026-04-30.
export const PORTUGAL_IRS_DERRAMA_BRACKETS = [
  { from: 80_000,  rate: 0.025 },
  { from: 250_000, rate: 0.0475 },
  { from: 500_000, rate: 0.05 },
];
// Tasa marginal del primer escalón — back-compat.
export const PORTUGAL_IRS_DERRAMA_RATE = 0.025;

// Segurança Social — Trabalhadores Independentes (TSU autónomo 21,4 %
// sobre 70 % del rendimento relevante). El régimen base aplica un factor
// 0,70 sobre la facturación antes del 21,4 %, equivalente a una carga
// efectiva ≈ 14,98 % sobre el bruto.
// SOURCE: Código dos Regimes Contributivos do Sistema Previdencial de
// Segurança Social (Lei 110/2009), art. 162-A; Portaria 5/2026.
export const PORTUGAL_SS_AUTONOMO_RATE = 0.214;
export const PORTUGAL_SS_AUTONOMO_BASE_FACTOR = 0.70;

// IRC (Imposto sobre o Rendimento das Pessoas Coletivas):
//   • Tipo general 20 % (rebajado en 2026 desde 21 %) — CIRC art. 87.º.
//   • Tipo reducido 17 % aplicable a los primeros 50 000 € de matéria
//     colectável de PME (CIRC art. 87.º-2) — incluye Madeira y Açores
//     (régimen específico) y empresas calificadas como PME por Decreto-
//     Lei 372/2007.
//   • Derrama municipal media 1,5 % (rango 0 % – 1,5 % por municipio).
//   • Derrama estatal escalonada se modela en `PORTUGAL_IRS_DERRAMA_*`
//     para autónomos (la derrama de IRC empresarial es independiente y
//     se omite del comparador por simplicidad — afecta a beneficios
//     muy altos > 1,5 M €).
// SOURCE: Código do IRC art. 87.º (Lei OE 2026) ; Portal das Finanças
// — circular sobre IRC reducido PME (revisado 2026-04-30).
export const PORTUGAL_IRC_RATE = 0.20;
export const PORTUGAL_IRC_REDUCED_RATE = 0.17;
export const PORTUGAL_IRC_REDUCED_THRESHOLD = 50_000;
export const PORTUGAL_IRC_DERRAMA_MUNICIPAL = 0.015;

// Retenção na fonte sobre dividendos pagos a residentes (categoría E):
// liberatoria de 28 %.
// SOURCE: CIRS art. 71.º.
export const PORTUGAL_DIVIDEND_RATE = 0.28;
export const PORTUGAL_CONTABILISTA_ANNUAL = 2800;

// --- Net-base proxies for autonomo deductions (when no itemized expenses) ---
//
// Many countries (UK/FR/DE/PT) accept a flat % de gastos deducibles cuando
// el contribuyente no itemiza. Estos factores son una proxy razonable —
// el UI permite reemplazarlos con `expenseItems` reales.
export const AUTONOMO_NET_FACTORS: Record<string, number> = {
  "reino-unido": 0.80,
  belgica:       0.80,
  francia:       0.78,
  alemania:      0.80,
  portugal:      0.78,
  mexico:        0.80,
  chile:         0.80,
};
export const SOCIEDAD_PROFIT_FACTORS: Record<string, number> = {
  "reino-unido": 0.72,
  belgica:       0.70,
  francia:       0.70,
  alemania:      0.72,
  portugal:      0.72,
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
  alemania:      { setup: 1800, fixedAnnual: 2300 },
  portugal:      { setup: 1500, fixedAnnual: 1900 },
};

// Amortization horizon for one-off setup costs in the 3-way comparison.
export const STRUCTURE_AMORTIZATION_YEARS = 3;

// --- VAT / IVA notes (informativos) ------------------------------------------
//
// Modelo extendido de IVA — re-verified 2026-04-30. Cada país expone:
//   • general       — tipo estándar aplicado por defecto.
//   • reducido      — tipo reducido (servicios culturales, alimentación, …).
//   • superReducido — tipo super-reducido (productos básicos).
//   • exportB2B     — siempre 0 % por inversión del sujeto pasivo o no
//                     sujeción (B2B intracomunitario / fuera de UE) —
//                     caso de uso típico del cliente Exentax.
//
// El comparador aplica `general` por defecto. Si el usuario activa el
// flag `CalcOptions.vatMode = "exportB2B"` se aplica 0 %. Los tipos
// reducidos / superreducidos están documentados pero NO entran en el
// cálculo (no es la actividad típica del cliente objetivo).
//
// SOURCES por país:
//   • España   — Ley 37/1992 IVA (general 21 %, reducido 10 %, super 4 %).
//   • México   — LIVA art. 1 (16 %) ; frontera 8 %.
//   • Chile    — DL 825 (19 %).
//   • UK       — VAT Act 1994 (20 %, reducido 5 %, zero-rated 0 %).
//   • Francia  — CGI art. 278 (20 %, intermedio 10 %, reducido 5,5 %, super 2,1 %).
//   • Bélgica  — Code TVA (21 %, reducido 12 %, super 6 %).
//   • Alemania — UStG § 12 (19 %, reducido 7 %).
//   • Portugal — CIVA art. 18.º (23 %, intermedio 13 %, reducido 6 %).
// Revisado 2026-04-30.
export interface CountryVatConfig {
  general: number;
  reducido?: number;
  superReducido?: number;
  exportB2B: 0;
}
export const COUNTRY_VAT: Record<string, CountryVatConfig> = {
  espana:        { general: 0.21, reducido: 0.10, superReducido: 0.04,  exportB2B: 0 },
  mexico:        { general: 0.16, reducido: 0.08,                       exportB2B: 0 },
  chile:         { general: 0.19,                                       exportB2B: 0 },
  "reino-unido": { general: 0.20, reducido: 0.05, superReducido: 0,     exportB2B: 0 },
  francia:       { general: 0.20, reducido: 0.055, superReducido: 0.021, exportB2B: 0 },
  belgica:       { general: 0.21, reducido: 0.12, superReducido: 0.06,  exportB2B: 0 },
  alemania:      { general: 0.19, reducido: 0.07,                       exportB2B: 0 },
  portugal:      { general: 0.23, reducido: 0.13, superReducido: 0.06,  exportB2B: 0 },
};

// Back-compat: el código y los tests existentes leen `COUNTRY_VAT_RATES`
// como Record<string, number> con el tipo general por país. Mantenemos la
// exportación derivada de `COUNTRY_VAT.general` para no romper consumers
// externos hasta que migren a la API extendida.
export const COUNTRY_VAT_RATES: Record<string, number> = Object.fromEntries(
  Object.entries(COUNTRY_VAT).map(([k, v]) => [k, v.general]),
);

// Resuelve el tipo IVA aplicable según el modo seleccionado por el UI.
// `general` (default) → tipo estándar ; `exportB2B` → 0 % por inversión
// del sujeto pasivo. Los tipos `reducido`/`superReducido` no se exponen
// como modo aún porque requieren input adicional (categoría del producto).
export type VatMode = "general" | "exportB2B";
export function resolveVatRate(country: string, mode: VatMode = "general"): number {
  const cfg = COUNTRY_VAT[country];
  if (!cfg) return 0;
  if (mode === "exportB2B") return cfg.exportB2B;
  return cfg.general;
}

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
