#!/usr/bin/env tsx
/*
 * calculator.test.ts
 * ----------------------------------------------------------------------------
 * Unit tests for `computeAllStructures()` — the 3-structure comparator
 * (autónomo · sociedad local · LLC USA).
 *
 * Covers:
 *   - Four canonical internationally-oriented profiles (test-only fixtures
 *     defined inline below) → bestId === "llc".
 *   - Four "LLC not best" scenarios (analogous to L1–L4 in
 *     `docs/calculator-cases.md`) → bestId !== "llc".
 *
 * NOTE: The "use-case preset" buttons that previously surfaced these profiles
 * to end users in the calculator UI have been removed. The fixtures below
 * are kept *only* as a regression harness so refactors of `computeAllStructures`
 * cannot silently flip the "LLC wins" answer for the canonical international
 * profiles. They are not exported and never reach the bundle.
 *
 * Run via `npm run test:calculator` (added in package.json) or directly with
 * `npx tsx client/src/lib/calculator.test.ts`. Exits with code 0 on success
 * and 1 on any mismatch so CI / post-merge / pre-deploy can fail fast.
 * ----------------------------------------------------------------------------
 */

import {
  computeAllStructures,
  calculateSavings,
  countries,
  type CalcOptions,
  type ExpenseItem,
  type AllStructuresResult,
} from "./calculator";

// Test-only fixtures (not bundled, not shown to users).
type _PresetFixture = {
  id: string;
  monthlyIncome: number;
  expenses: Record<string, number>;
};
const _PRESET_FIXTURES: _PresetFixture[] = [
  {
    id: "freelancer-digital",
    monthlyIncome: 4000,
    expenses: { software: 80, hosting: 30, asesoria: 80, telefono: 50, marketing: 50, homeOffice: 100 },
  },
  {
    id: "consultor",
    monthlyIncome: 7000,
    expenses: { asesoria: 120, software: 80, marketing: 80, viajesTransporte: 100, viajesComidas: 60, homeOffice: 150, formacion: 80 },
  },
  {
    id: "ecommerce",
    monthlyIncome: 10000,
    expenses: { marketing: 800, software: 150, hosting: 80, asesoria: 100, contratistas: 300, bancos: 120 },
  },
  {
    id: "b2b",
    monthlyIncome: 12000,
    expenses: { asesoria: 150, software: 120, contratistas: 400, marketing: 100, viajesTransporte: 100, seguros: 80, legal: 80 },
  },
];

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

function record(name: string, cond: boolean, detail?: string): void {
  results.push({ name, ok: cond, detail });
}

function presetItems(expenses: Record<string, number>): ExpenseItem[] {
  return Object.entries(expenses).map(([id, monthly]) => ({
    id,
    label: id,
    monthly,
    deductPct: 100,
  }));
}

function fmt(r: AllStructuresResult): string {
  return `auto=${r.autonomo.totalAnnualCost} · soc=${r.sociedad.totalAnnualCost} · llc=${r.llc.totalAnnualCost} · best=${r.bestId}`;
}

// ---------------------------------------------------------------------------
// Presets — LLC must win for the four documented international profiles when
// computed against España (the project's primary market). The presets target
// digital activities with international clients, the canonical LLC fit.
// ---------------------------------------------------------------------------
const PRESET_COUNTRY = "espana";
const PRESET_ACTIVITY = "digitalServices";

for (const preset of _PRESET_FIXTURES) {
  const items = presetItems(preset.expenses);
  const r = computeAllStructures(
    preset.monthlyIncome,
    PRESET_COUNTRY,
    PRESET_ACTIVITY,
    0,
    items,
  );
  record(
    `preset[${preset.id}] bestId === "llc" (España, digitalServices)`,
    r.bestId === "llc",
    fmt(r),
  );
  // Sanity: LLC must beat both autonomo and sociedad on totalAnnualCost.
  record(
    `preset[${preset.id}] llc.totalAnnualCost < autonomo.totalAnnualCost`,
    r.llc.totalAnnualCost < r.autonomo.totalAnnualCost,
    fmt(r),
  );
  record(
    `preset[${preset.id}] llc.totalAnnualCost < sociedad.totalAnnualCost`,
    r.llc.totalAnnualCost < r.sociedad.totalAnnualCost,
    fmt(r),
  );
  // Savings deltas reported are positive when LLC wins.
  record(
    `preset[${preset.id}] llcSavingsVsAutonomo > 0`,
    r.llcSavingsVsAutonomo > 0,
    `Δauto=${r.llcSavingsVsAutonomo}`,
  );
  record(
    `preset[${preset.id}] llcSavingsVsSociedad > 0`,
    r.llcSavingsVsSociedad > 0,
    `Δsoc=${r.llcSavingsVsSociedad}`,
  );
}

// ---------------------------------------------------------------------------
// LLC-not-best — four scenarios from L1–L4 in `docs/calculator-cases.md`.
// L1 (Spanish autónomo "tarifa plana" 80€/mes) and L4 (French micro
// auto-entrepreneur with abattement 50% + URSSAF ~22%) are now modelled
// explicitly via `CalcOptions` (Task #20), so we no longer need UK proxies.
// L2/L3 still use the local-volume proxies because the calculator does not
// model "client geography" or "pre-existing SL" semantics.
// ---------------------------------------------------------------------------
const llcNotBestCases: Array<{
  id: string;
  monthly: number;
  country: string;
  activity: string;
  items: ExpenseItem[];
  options?: CalcOptions;
  expectedBest?: "autonomo" | "sociedad";
}> = [
  {
    // L1 documented: España, autónomo en su primer año con tarifa plana
    // 80€/mes. 18.000 €/año brutos → cuota SS reducida convierte al
    // autónomo en la opción más barata frente a la LLC.
    id: "L1 — freelance principiante (España, 1.500€/mes, tarifa plana)",
    monthly: 1500,
    country: "espana",
    activity: "digitalServices",
    items: [],
    options: { tarifaPlana: true },
    expectedBest: "autonomo",
  },
  {
    // L2 proxy: low-volume local clients. Mexico at 1.000€/mes triggers
    // ISR's lowest brackets and minimal IMSS.
    id: "L2 — clientes locales bajo volumen (México, 1.000€/mes)",
    monthly: 1000,
    country: "mexico",
    activity: "digitalServices",
    items: [],
    expectedBest: "autonomo",
  },
  {
    // L3 proxy: small-volume Chilean PN. Chile at 1.500€/mes is below the
    // 13,5 UTA exempt slice → Global Complementario near zero.
    id: "L3 — PN consolidada bajo volumen (Chile, 1.500€/mes)",
    monthly: 1500,
    country: "chile",
    activity: "digitalServices",
    items: [],
    expectedBest: "autonomo",
  },
  {
    // L4 documented: Francia, régimen micro auto-entrepreneur (BNC services)
    // a 4.000€/mes (= 48.000 €/año, < techo 77.700€). Abattement 50% + URSSAF
    // ~22% deja al micro por debajo del coste LLC (que para residentes
    // franceses incluye prélèvements sociaux ~17,2% sobre los beneficios).
    id: "L4 — régimen favorable (Francia, 4.000€/mes, micro)",
    monthly: 4000,
    country: "francia",
    activity: "digitalServices",
    items: [],
    options: { franceMicro: true },
    expectedBest: "autonomo",
  },
];

for (const c of llcNotBestCases) {
  const r = computeAllStructures(c.monthly, c.country, c.activity, 0, c.items, c.options);
  record(`${c.id} → bestId !== "llc"`, r.bestId !== "llc", fmt(r));
  if (c.expectedBest) {
    record(
      `${c.id} → bestId === "${c.expectedBest}"`,
      r.bestId === c.expectedBest,
      fmt(r),
    );
  }
  // The calculator must report a NEGATIVE llcSavingsVsAutonomo so the UI
  // can render the "LLC not best" honest disclosure (no clamping to 0).
  record(
    `${c.id} → llcSavingsVsAutonomo < 0 (honest disclosure)`,
    r.llcSavingsVsAutonomo < 0,
    `Δauto=${r.llcSavingsVsAutonomo}`,
  );
}

// ---------------------------------------------------------------------------
// Edge cases — `docs/calculator-cases.md` rows 9–11. These are the cases
// where the calculator is most likely to silently regress (NaN, negative
// IRPF, division by zero, throws on missing country).
// ---------------------------------------------------------------------------

// Row 9 — monthlyIncome = 0 across all structures (España autónomo + LLC + SL).
// Acceptance: every structure returns totalAnnualCost ≥ 0 (no NaN, no
// negatives) and bestId is a defined union member.
{
  const r = computeAllStructures(0, "espana", "digitalServices", 0, []);
  const finiteAuto = Number.isFinite(r.autonomo.totalAnnualCost);
  const finiteSoc = Number.isFinite(r.sociedad.totalAnnualCost);
  const finiteLlc = Number.isFinite(r.llc.totalAnnualCost);
  record(
    "edge[zero-income] all totalAnnualCost are finite (no NaN/Infinity)",
    finiteAuto && finiteSoc && finiteLlc,
    fmt(r),
  );
  record(
    "edge[zero-income] autonomo.totalAnnualCost >= 0",
    r.autonomo.totalAnnualCost >= 0,
    `auto=${r.autonomo.totalAnnualCost}`,
  );
  record(
    "edge[zero-income] sociedad.totalAnnualCost >= 0",
    r.sociedad.totalAnnualCost >= 0,
    `soc=${r.sociedad.totalAnnualCost}`,
  );
  record(
    "edge[zero-income] llc.totalAnnualCost >= 0",
    r.llc.totalAnnualCost >= 0,
    `llc=${r.llc.totalAnnualCost}`,
  );
  record(
    'edge[zero-income] bestId in {"autonomo","sociedad","llc"}',
    r.bestId === "autonomo" || r.bestId === "sociedad" || r.bestId === "llc",
    `best=${r.bestId}`,
  );
  // Per docs/calculator-cases.md row 9: "Sin NaN, sin negativos, ahorro = 0".
  // With the 3-structure model the LLC's amortized fixed cost is still > 0,
  // so we additionally check there are no negative tax components.
  record(
    "edge[zero-income] autonomo.taxes >= 0 (no negative IRPF/SS)",
    r.autonomo.taxes >= 0,
    `taxes=${r.autonomo.taxes}`,
  );
  record(
    "edge[zero-income] llc.taxes >= 0 (no negative residence tax)",
    r.llc.taxes >= 0,
    `taxes=${r.llc.taxes}`,
  );
}

// Row 10 — gastos > ingresos (España autónomo). Acceptance: base
// imponible se trata como 0, no se produce IRPF negativo, y la cuota de
// SS respeta el tramo mínimo (`SS_AUTONOMO_BRACKETS_2026[0]` → 200 €/mes
// → 2.400 €/año).
{
  const huge: ExpenseItem[] = [
    { id: "ops", label: "ops", monthly: 5000, deductPct: 100 },
  ];
  const r = calculateSavings(1000, "espana", "autonomo", "digitalServices", 0, false, huge);
  // Spanish autónomo breakdown order is: [IRPF, Cuota Seg. Social].
  const irpfEntry = r.breakdown.find((b) => b.label === "calculator.bd.espana.irpf");
  const ssEntry = r.breakdown.find((b) => b.label === "calculator.bd.espana.cuotaSS");
  record(
    "edge[gastos>ingresos] IRPF >= 0 (no negative tax)",
    !!irpfEntry && irpfEntry.amount >= 0,
    `irpf=${irpfEntry?.amount}`,
  );
  record(
    "edge[gastos>ingresos] IRPF === 0 (base liquidable colapsada a 0)",
    !!irpfEntry && irpfEntry.amount === 0,
    `irpf=${irpfEntry?.amount}`,
  );
  record(
    "edge[gastos>ingresos] SS >= 0 (no negative cotización)",
    !!ssEntry && ssEntry.amount >= 0,
    `ss=${ssEntry?.amount}`,
  );
  // SS minimum bracket per SS_AUTONOMO_BRACKETS_2026: 200 €/mes → 2.400 €/año.
  record(
    "edge[gastos>ingresos] SS === minimum bracket (200€/mes · 2.400€/año)",
    !!ssEntry && ssEntry.amount === 2400,
    `ss=${ssEntry?.amount}`,
  );
  record(
    "edge[gastos>ingresos] sinLLC === IRPF + SS (sin componentes ocultos)",
    r.sinLLC === (irpfEntry?.amount ?? 0) + (ssEntry?.amount ?? 0),
    `sinLLC=${r.sinLLC}`,
  );
  record(
    "edge[gastos>ingresos] sinLLC > 0 (cuota mínima SS aplicada)",
    r.sinLLC > 0,
    `sinLLC=${r.sinLLC}`,
  );
}

// Row 11 — país no seleccionado / desconocido. Acceptance: la calculadora
// no lanza, calculateSavings devuelve sinLLC === 0 y computeAllStructures
// devuelve resultados finitos para las tres estructuras.
{
  let threw = false;
  let single: ReturnType<typeof calculateSavings> | undefined;
  let all: AllStructuresResult | undefined;
  try {
    single = calculateSavings(5000, "atlantis", "autonomo", "digitalServices", 0, false, []);
    all = computeAllStructures(5000, "atlantis", "digitalServices", 0, []);
  } catch (e) {
    threw = true;
  }
  record(
    "edge[unknown-country] no throw (calculateSavings + computeAllStructures)",
    !threw,
  );
  record(
    "edge[unknown-country] calculateSavings.sinLLC === 0 (no se calcula sin país)",
    !!single && single.sinLLC === 0,
    `sinLLC=${single?.sinLLC}`,
  );
  record(
    "edge[unknown-country] calculateSavings.breakdown is empty",
    !!single && single.breakdown.length === 0,
    `breakdown.length=${single?.breakdown.length}`,
  );
  record(
    "edge[unknown-country] computeAllStructures returns finite totals",
    !!all
      && Number.isFinite(all.autonomo.totalAnnualCost)
      && Number.isFinite(all.sociedad.totalAnnualCost)
      && Number.isFinite(all.llc.totalAnnualCost),
    all ? fmt(all) : "no-result",
  );
  record(
    "edge[unknown-country] computeAllStructures.bestId is defined",
    !!all && (all.bestId === "autonomo" || all.bestId === "sociedad" || all.bestId === "llc"),
    `best=${all?.bestId}`,
  );
}

// ---------------------------------------------------------------------------
// Regression: French micro ceiling guard. The 2025 BNC services ceiling is
// 77.700 €/year. Above it the `franceMicro` flag must be silently ignored
// (régime réel applies), so the result must equal the no-flag standard
// France calculation, not a legally invalid micro extrapolation.
// ---------------------------------------------------------------------------
{
  const aboveCeilingMonthly = 7000; // 84.000 €/yr > 77.700 €
  const withFlag = computeAllStructures(
    aboveCeilingMonthly, "francia", "digitalServices", 0, [], { franceMicro: true },
  );
  const withoutFlag = computeAllStructures(
    aboveCeilingMonthly, "francia", "digitalServices", 0, [],
  );
  record(
    "France micro ceiling guard → flag ignored above 77.700€ (autonomo cost identical to standard)",
    withFlag.autonomo.totalAnnualCost === withoutFlag.autonomo.totalAnnualCost,
    `withFlag=${withFlag.autonomo.totalAnnualCost} · withoutFlag=${withoutFlag.autonomo.totalAnnualCost}`,
  );
}

// ---------------------------------------------------------------------------
// Per-country smoke tests (Task #29). One case per supported country in
// both autonomo and sociedad regimes. We don't pin exact euro amounts —
// official brackets evolve — but we assert the invariants every result
// must satisfy:
//   1. computeAllStructures returns finite, non-negative totals.
//   2. The breakdown is non-empty (so the UI can render a desglose).
//   3. The LLC structure produces a finite, non-negative total too.
// If a future bracket update accidentally produces NaN / negative tax /
// empty breakdown for any country, this test will fail loudly.
// ---------------------------------------------------------------------------
const COUNTRIES_TO_SMOKE = [
  "espana",
  "mexico",
  "chile",
  "reino-unido",
  "francia",
  "belgica",
  "alemania",
  "portugal",
] as const;

for (const country of COUNTRIES_TO_SMOKE) {
  const monthly = 6000;
  const all = computeAllStructures(monthly, country, "digitalServices", 0, []);
  const single = calculateSavings(monthly, country, "autonomo", "digitalServices", 0, false, []);

  record(
    `country[${country}] computeAllStructures totals are finite & non-negative`,
    Number.isFinite(all.autonomo.totalAnnualCost)
      && Number.isFinite(all.sociedad.totalAnnualCost)
      && Number.isFinite(all.llc.totalAnnualCost)
      && all.autonomo.totalAnnualCost >= 0
      && all.sociedad.totalAnnualCost >= 0
      && all.llc.totalAnnualCost >= 0,
    fmt(all),
  );
  record(
    `country[${country}] autonomo.breakdown is non-empty`,
    all.autonomo.breakdown.length > 0,
    `len=${all.autonomo.breakdown.length}`,
  );
  record(
    `country[${country}] sociedad.breakdown is non-empty`,
    all.sociedad.breakdown.length > 0,
    `len=${all.sociedad.breakdown.length}`,
  );
  record(
    `country[${country}] llc.breakdown is non-empty`,
    all.llc.breakdown.length > 0,
    `len=${all.llc.breakdown.length}`,
  );
  record(
    `country[${country}] calculateSavings(autonomo).sinLLC > 0 & finite`,
    Number.isFinite(single.sinLLC) && single.sinLLC > 0,
    `sinLLC=${single.sinLLC}`,
  );
  record(
    `country[${country}] calculateSavings(autonomo).conLLC >= 0 & finite`,
    Number.isFinite(single.conLLC) && single.conLLC >= 0,
    `conLLC=${single.conLLC}`,
  );

  const sociedadSingle = calculateSavings(monthly, country, "sociedad", "digitalServices", 0, false, []);
  record(
    `country[${country}] calculateSavings(sociedad).sinLLC > 0 & finite`,
    Number.isFinite(sociedadSingle.sinLLC) && sociedadSingle.sinLLC > 0,
    `sinLLC=${sociedadSingle.sinLLC}`,
  );
}

// ---------------------------------------------------------------------------
// Persistence schema (POST /api/calculator-leads) + email render parity.
// Imports the *actual* route schema and the *actual* email renderer so the
// test exercises the production code paths, not local mirrors.
// ---------------------------------------------------------------------------
import { calculatorLeadSchema } from "../../../server/routes/calculator-lead-schema";
import { renderCalculatorEmailHtml } from "../../../server/email";
import { FX_RATES_PER_EUR, convertFromEUR } from "../../../shared/calculator-fx";

const samplePayload = {
  email: "audit@exentax.test",
  phone: "+34600000000",
  country: "españa",
  regime: "autonomo",
  activity: "digitalServices",
  income: 8000,
  incomeMode: "monthly" as const,
  annualIncome: 96000,
  effectiveRate: 25,
  ahorro: 14000,
  sinLLC: 38000,
  conLLC: 24000,
  localLabel: "España",
  breakdown: [
    { label: "IRPF", amount: 22000 },
    { label: "Cuota autónomo", amount: 4000 },
  ],
  deductibleExpenses: 500,
  calcSpainIrpf: true,
  privacyAccepted: true as const,
  marketingAccepted: false,
  language: "es",
  displayCurrency: "USD" as const,
  bestStructureId: "llc" as const,
  llcVsAutonomo: 14000,
  llcVsSociedad: 9000,
  options: { tarifaPlana: true },
  expenseItems: [{ id: "office", monthly: 200 }, { id: "software", monthly: 80 }],
  customExpenses: [{ label: "Asesor", monthly: 120 }],
};

const parsed = calculatorLeadSchema.safeParse(samplePayload);
record(
  "POST /api/calculator-leads schema accepts full fidelity payload",
  parsed.success,
  parsed.success ? "" : JSON.stringify(parsed.error.format()),
);

const minimalParsed = calculatorLeadSchema.safeParse({
  email: "min@exentax.test",
  phone: "+34600000001",
  country: "españa",
  regime: "autonomo",
  activity: "digitalServices",
  income: 4000,
  ahorro: 6000,
  sinLLC: 18000,
  conLLC: 12000,
  localLabel: "España",
  breakdown: [{ label: "IRPF", amount: 12000 }],
  privacyAccepted: true as const,
});
record(
  "POST /api/calculator-leads schema is back-compatible (fidelity fields optional)",
  minimalParsed.success,
  minimalParsed.success ? "" : JSON.stringify(minimalParsed.error.format()),
);

// Strict mode rejects unknown fields → guards against silent contract drift.
const drifted = calculatorLeadSchema.safeParse({ ...samplePayload, surprise: "yes" });
record(
  "POST /api/calculator-leads schema is strict (rejects unknown keys)",
  !drifted.success,
);

// `customExpenses` shape uses `label`, not `name`.
const wrongShape = calculatorLeadSchema.safeParse({
  ...samplePayload,
  customExpenses: [{ name: "Asesor", monthly: 120 } as any],
});
record(
  "POST /api/calculator-leads enforces customExpenses[].label",
  !wrongShape.success,
);

// Email render parity: HTML reflects what the UI showed.
const rendered = renderCalculatorEmailHtml({
  email: samplePayload.email,
  phone: samplePayload.phone,
  country: samplePayload.country,
  regime: samplePayload.regime,
  activity: samplePayload.activity,
  income: samplePayload.income,
  annualIncome: samplePayload.annualIncome,
  localLabel: "España|Spain|Espagne|Spanien|Espanha|Espanya",
  sinLLC: samplePayload.sinLLC,
  conLLC: samplePayload.conLLC,
  ahorro: samplePayload.ahorro,
  effectiveRate: String(samplePayload.effectiveRate),
  deductibleExpenses: samplePayload.deductibleExpenses,
  privacyAccepted: true,
  marketingAccepted: false,
  language: samplePayload.language,
  displayCurrency: samplePayload.displayCurrency,
  bestStructureId: samplePayload.bestStructureId,
  llcVsAutonomo: samplePayload.llcVsAutonomo,
  llcVsSociedad: samplePayload.llcVsSociedad,
  options: samplePayload.options,
});

const expectedAhorroUsd = Math.round(convertFromEUR(samplePayload.ahorro, "USD"));
const expectedFormatted = new Intl.NumberFormat("es-ES").format(expectedAhorroUsd);
record(
  "renderCalculatorEmailHtml applies shared FX (USD)",
  rendered.html.includes(expectedFormatted) && rendered.html.includes("USD"),
  `expected formatted "${expectedFormatted}" plus "USD" in HTML`,
);
record(
  "renderCalculatorEmailHtml prints winning structure",
  rendered.html.includes("Estructura ganadora") && rendered.html.includes("LLC US"),
);
record(
  "renderCalculatorEmailHtml prints signed deltas vs LLC",
  rendered.html.includes("+") && rendered.html.includes("Frente a autónomo") && rendered.html.includes("Frente a sociedad local"),
);
record(
  "renderCalculatorEmailHtml prints special regime when set",
  rendered.html.includes("Tarifa plana"),
);
record(
  "shared FX rates are sourced from the same module",
  FX_RATES_PER_EUR.USD === 1.08 && FX_RATES_PER_EUR.GBP === 0.86,
);

// ---------------------------------------------------------------------------
// Edge cases — defensive input handling.
// These assertions lock in the documented behavior of `calculateSavings()`
// against malformed inputs (regla nº 1: si funciona, que siga funcionando).
// Verified manually 2026-04 before writing the test.
// ---------------------------------------------------------------------------
{
  const zeroIncome = calculateSavings(0, "espana", "autonomo", "general");
  record(
    "monthlyIncome=0 returns finite values (no NaN, no Infinity)",
    Number.isFinite(zeroIncome.sinLLC) && Number.isFinite(zeroIncome.conLLC) && Number.isFinite(zeroIncome.ahorro),
    `sinLLC=${zeroIncome.sinLLC} conLLC=${zeroIncome.conLLC} ahorro=${zeroIncome.ahorro}`,
  );
  record(
    "monthlyIncome=0 · España autónomo · sinLLC = SS mínima 2400€/año",
    zeroIncome.sinLLC === 2400,
    `expected 2400, got ${zeroIncome.sinLLC}`,
  );

  const nanIncome = calculateSavings(NaN, "espana", "autonomo", "general");
  record(
    "monthlyIncome=NaN clamped to 0 (no NaN propagation)",
    Number.isFinite(nanIncome.sinLLC) && nanIncome.sinLLC === 2400,
  );

  const infIncome = calculateSavings(Infinity, "espana", "autonomo", "general");
  record(
    "monthlyIncome=Infinity clamped to sanity max (no Infinity in output)",
    Number.isFinite(infIncome.sinLLC) && infIncome.sinLLC > 0,
  );

  const negIncome = calculateSavings(-1000, "espana", "autonomo", "general");
  record(
    "monthlyIncome=-1000 clamped to 0",
    negIncome.sinLLC === 2400,
  );

  const unknownCountry = calculateSavings(5000, "atlantida", "autonomo", "general");
  record(
    "country unknown · sinLLC=0 graceful fallback (no throw)",
    unknownCountry.sinLLC === 0 && unknownCountry.conLLC === 1500,
  );

  const huge = calculateSavings(1_000_000_000, "espana", "autonomo", "general");
  record(
    "monthlyIncome=1e9 saturates without NaN/Infinity",
    Number.isFinite(huge.sinLLC) && Number.isFinite(huge.effectiveRate),
  );
}

// ---------------------------------------------------------------------------
// Realistic scenarios — Task #17 audit (abr-2026).
// Twelve+ representative profiles covering all 8 supported countries, both
// regimes (autónomo / sociedad), special regimes (tarifa plana, France
// micro), CCAA profiles (low / medium / high) and itemized expense mixes.
// Each scenario asserts the invariants every result must satisfy:
//   • totalAnnualCost finite & non-negative
//   • breakdown non-empty (UI can render desglose)
//   • effectiveRate ∈ [0, 100]
//   • bestId ∈ {autonomo, sociedad, llc}
//   • when an expectedBest is declared, bestId must match it
// Exact euro amounts are intentionally NOT pinned: brackets evolve every
// year and a unit test that locks them would break on every legal update.
// What we lock are the *shapes* of the outputs that the UI/email/persistence
// layers depend on.
// ---------------------------------------------------------------------------
const REALISTIC_SCENARIOS: Array<{
  id: string;
  monthly: number;
  country: string;
  activity: string;
  items?: ExpenseItem[];
  customExpenses?: number;
  options?: CalcOptions;
  expectedBest?: "autonomo" | "sociedad" | "llc";
}> = [
  {
    id: "01 — España freelance digital BAJA facturación (1.500€/mes, sin gastos)",
    monthly: 1500, country: "espana", activity: "digitalServices",
    items: [],
  },
  {
    id: "02 — España freelance digital MEDIA facturación (5.000€/mes, gastos típicos)",
    monthly: 5000, country: "espana", activity: "digitalServices",
    items: presetItems({ software: 80, asesoria: 80, hosting: 30, marketing: 80, telefono: 50 }),
    expectedBest: "llc",
  },
  {
    id: "03 — España freelance digital ALTA facturación (12.000€/mes, gastos altos)",
    monthly: 12000, country: "espana", activity: "digitalServices",
    items: presetItems({ asesoria: 200, software: 250, contratistas: 800, marketing: 400, viajesTransporte: 200 }),
    expectedBest: "llc",
  },
  {
    id: "04 — España consultor con tarifa plana, primer año (2.200€/mes)",
    monthly: 2200, country: "espana", activity: "consultingAdvisory",
    items: presetItems({ asesoria: 80, software: 60, telefono: 40 }),
    options: { tarifaPlana: true },
    expectedBest: "autonomo",
  },
  {
    id: "05 — España agencia con vehículo + home office + asesoría (6.500€/mes)",
    monthly: 6500, country: "espana", activity: "marketingAdvertising",
    items: presetItems({ asesoria: 150, software: 120, marketing: 200, vehiculo: 350, homeOffice: 200, contratistas: 600 }),
  },
  {
    id: "06 — España CCAA HIGH IRPF Cataluña (8.000€/mes, perfil profesional)",
    monthly: 8000, country: "espana", activity: "consultingAdvisory",
    items: presetItems({ asesoria: 150, software: 120, viajesTransporte: 200, formacion: 100 }),
    options: { ccaaProfile: "high" },
  },
  {
    id: "07 — España CCAA LOW IRPF Madrid mismo perfil (8.000€/mes)",
    monthly: 8000, country: "espana", activity: "consultingAdvisory",
    items: presetItems({ asesoria: 150, software: 120, viajesTransporte: 200, formacion: 100 }),
    options: { ccaaProfile: "low" },
  },
  {
    id: "08 — México consultor digital RESICO (4.000€/mes equivalente)",
    monthly: 4000, country: "mexico", activity: "consultingAdvisory",
    items: presetItems({ software: 80, asesoria: 100, telefono: 50 }),
  },
  {
    id: "09 — Chile servicios profesionales (3.500€/mes)",
    monthly: 3500, country: "chile", activity: "digitalServices",
    items: presetItems({ software: 80, asesoria: 90, hosting: 30 }),
  },
  {
    id: "10 — UK Limited Company alta facturación (8.000€/mes, dividendos)",
    monthly: 8000, country: "reino-unido", activity: "digitalServices",
    items: presetItems({ asesoria: 120, software: 150, hosting: 50 }),
  },
  {
    id: "11 — UK self-employed NIC clase 4 (4.500€/mes)",
    monthly: 4500, country: "reino-unido", activity: "consultingAdvisory",
    items: presetItems({ software: 80, asesoria: 100, telefono: 40 }),
  },
  {
    id: "12 — Francia micro auto-entrepreneur BNC (3.000€/mes, bajo techo)",
    monthly: 3000, country: "francia", activity: "digitalServices",
    items: [],
    options: { franceMicro: true },
    // Nota: a 3.000 €/mes la LLC gana por márgenes muy pequeños frente al
    // micro francés (≈ 30 € anuales). No fijamos expectedBest porque el
    // empate técnico no es el comportamiento que queremos blindar; lo que
    // sí blindamos (en otro test arriba) es el GUARD de techo 77.700 €.
  },
  {
    id: "13 — Alemania Freiberufler ESt+Soli+SV (5.000€/mes)",
    monthly: 5000, country: "alemania", activity: "digitalServices",
    items: presetItems({ asesoria: 100, software: 80, marketing: 60 }),
  },
  {
    id: "14 — Bélgica autónomo IPP federal+comunal (5.500€/mes)",
    monthly: 5500, country: "belgica", activity: "consultingAdvisory",
    items: presetItems({ asesoria: 120, software: 80, viajesTransporte: 100 }),
  },
  {
    id: "15 — Alemania GmbH KSt+Soli+Gewerbesteuer (8.000€/mes)",
    monthly: 8000, country: "alemania", activity: "digitalServices",
    items: presetItems({ asesoria: 150, software: 120, contratistas: 400 }),
  },
  {
    id: "15b — Portugal Trabalhador Independente IRS+SS (4.500€/mes)",
    monthly: 4500, country: "portugal", activity: "consultingAdvisory",
    items: presetItems({ asesoria: 100, software: 60, viajesTransporte: 80 }),
  },
  {
    id: "15c — Portugal Sociedade IRC+derrama (7.500€/mes)",
    monthly: 7500, country: "portugal", activity: "digitalServices",
    items: presetItems({ asesoria: 140, software: 100, contratistas: 350 }),
  },
  {
    id: "16 — España sociedad limitada con admin único + amortización (7.000€/mes)",
    monthly: 7000, country: "espana", activity: "digitalServices",
    items: presetItems({ asesoria: 200, software: 150, marketing: 200 }),
  },
];

for (const sc of REALISTIC_SCENARIOS) {
  const items = sc.items ?? [];
  const all = computeAllStructures(
    sc.monthly, sc.country, sc.activity, sc.customExpenses ?? 0, items, sc.options,
  );
  const auto = calculateSavings(
    sc.monthly, sc.country, "autonomo", sc.activity,
    sc.customExpenses ?? 0, false, items, sc.options,
  );
  const soc = calculateSavings(
    sc.monthly, sc.country, "sociedad", sc.activity,
    sc.customExpenses ?? 0, false, items, sc.options,
  );

  // Invariant 1: totals finite & non-negative for the three structures.
  record(
    `scenario[${sc.id}] computeAllStructures totals finite & ≥ 0`,
    Number.isFinite(all.autonomo.totalAnnualCost)
      && Number.isFinite(all.sociedad.totalAnnualCost)
      && Number.isFinite(all.llc.totalAnnualCost)
      && all.autonomo.totalAnnualCost >= 0
      && all.sociedad.totalAnnualCost >= 0
      && all.llc.totalAnnualCost >= 0,
    fmt(all),
  );

  // Invariant 2: breakdown non-empty for every structure.
  record(
    `scenario[${sc.id}] all 3 breakdowns non-empty`,
    all.autonomo.breakdown.length > 0
      && all.sociedad.breakdown.length > 0
      && all.llc.breakdown.length > 0,
    `auto=${all.autonomo.breakdown.length} soc=${all.sociedad.breakdown.length} llc=${all.llc.breakdown.length}`,
  );

  // Invariant 3: bestId is one of the three valid IDs.
  record(
    `scenario[${sc.id}] bestId ∈ {autonomo, sociedad, llc}`,
    all.bestId === "autonomo" || all.bestId === "sociedad" || all.bestId === "llc",
    `best=${all.bestId}`,
  );

  // Invariant 4: effectiveRate within sane range for both regimes.
  record(
    `scenario[${sc.id}] effectiveRate ∈ [0, 100] (autonomo & sociedad)`,
    auto.effectiveRate >= 0 && auto.effectiveRate <= 100
      && soc.effectiveRate >= 0 && soc.effectiveRate <= 100,
    `auto=${auto.effectiveRate} soc=${soc.effectiveRate}`,
  );

  // Invariant 5: deltas (signed) are consistent — bestId really is min.
  const totals = [
    { id: "autonomo" as const, v: all.autonomo.totalAnnualCost },
    { id: "sociedad" as const, v: all.sociedad.totalAnnualCost },
    { id: "llc" as const, v: all.llc.totalAnnualCost },
  ];
  const minTotal = Math.min(...totals.map((t) => t.v));
  const winner = totals.find((t) => t.v === minTotal)!;
  record(
    `scenario[${sc.id}] bestId matches argmin(totalAnnualCost)`,
    all.bestId === winner.id,
    `best=${all.bestId} argmin=${winner.id} totals=${fmt(all)}`,
  );

  // Invariant 6: signed deltas in llcSavingsVs* point in the right direction.
  // llcSavingsVsAutonomo > 0 when LLC < autonomo, < 0 when LLC > autonomo.
  record(
    `scenario[${sc.id}] sign(llcSavingsVsAutonomo) === sign(autonomo - llc)`,
    Math.sign(all.llcSavingsVsAutonomo) === Math.sign(all.autonomo.totalAnnualCost - all.llc.totalAnnualCost),
    `Δauto=${all.llcSavingsVsAutonomo} diff=${all.autonomo.totalAnnualCost - all.llc.totalAnnualCost}`,
  );
  record(
    `scenario[${sc.id}] sign(llcSavingsVsSociedad) === sign(sociedad - llc)`,
    Math.sign(all.llcSavingsVsSociedad) === Math.sign(all.sociedad.totalAnnualCost - all.llc.totalAnnualCost),
    `Δsoc=${all.llcSavingsVsSociedad} diff=${all.sociedad.totalAnnualCost - all.llc.totalAnnualCost}`,
  );

  // Optional: declared expectedBest must match.
  if (sc.expectedBest) {
    record(
      `scenario[${sc.id}] bestId === "${sc.expectedBest}" (expected)`,
      all.bestId === sc.expectedBest,
      `best=${all.bestId} totals=${fmt(all)}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Veracidad — Task #17. Cross-check that the consolidated Spain
// "administrador único" SS constants (SPAIN_SOCIEDAD_ADMIN_BASE_MIN/RATE,
// formerly duplicated as SOCIEDAD_ADMIN_SS_*) still produce the documented
// monthly cuota of 313 € (1.000 € base × 31,30 % combinada).
// ---------------------------------------------------------------------------
{
  // Invocation path: España regime "sociedad" routes through calcSociedadAdminSS
  // when the implicit admin-único salary is at the minimum base.
  // Lowest income makes the admin salary collapse to BASE_MIN (1000 €/mes),
  // so the expected SS contribution is 1000 × 0.3130 = 313 €/mes.
  const lowSoc = calculateSavings(1500, "espana", "sociedad", "digitalServices", 0, false, []);
  const ssAdmin = lowSoc.breakdown.find((b) => /admin|seg\.\s*social/i.test(b.label));
  record(
    "veracidad[ES sociedad] admin único SS = 313€/mes × 12 = 3756€/año (1000€ base × 31.30%)",
    !!ssAdmin && ssAdmin.amount === 3756,
    `ssAdmin=${ssAdmin?.amount} label=${ssAdmin?.label}`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — IRPF precision invariant (Bloque 5 audit Q2-2026). The total
// IRPF returned MUST equal the sum of `taxInBracket` values in the bracket
// detail breakdown. Pre-Q2-2026 we summed unrounded values and rounded
// only the total, which produced ±1€ drift between the headline IRPF and
// the per-bracket table the UI shows. The current implementation rounds
// each bracket and sums the rounded values; this test locks that invariant.
// ---------------------------------------------------------------------------
{
  // Profile that hits the upper IRPF brackets so several rounding events
  // accumulate. Spain autónomo, no items, default activity rate.
  const r = calculateSavings(8000, "espana", "autonomo", "digitalServices", 0, false, []);
  const sumOfBrackets = (r.irpfBrackets ?? []).reduce((s, b) => s + b.taxInBracket, 0);
  const irpfEntry = r.breakdown.find((b) => b.label === "calculator.bd.espana.irpf");
  record(
    "veracidad[ES autónomo IRPF] total === sum(brackets[].taxInBracket) (precisión Bloque 5)",
    !!irpfEntry && irpfEntry.amount === sumOfBrackets,
    `irpf=${irpfEntry?.amount} sumBrackets=${sumOfBrackets} brackets=${(r.irpfBrackets ?? []).length}`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — Modelo de deducibles (audit Task #17 abr-2026). Documenta y
// blinda la asimetría intencional del modelo:
//
//   • España: `totalGastosDeducibles = annual × ACTIVITY_EXPENSE_RATE[a] +
//     itemized` — el % por actividad es BASELINE adicional a los items.
//   • Resto de países: el cálculo del autónomo usa SOLO `itemized` y aplica
//     internamente `AUTONOMO_NET_FACTORS` (0.78–0.80) como proxy implícita
//     de gastos no itemizados, evitando el doble conteo.
//
// El campo público `gastosDeducibles` (usado por la rama LLC y el desglose
// del UI) sí incluye la baseline en TODOS los países por consistencia con
// la rama LLC. Esta asimetría está documentada en `docs/calculator.md` § 8
// y `docs/audits/produccion-2026-04/02-calculadora.md`. Cualquier refactor
// que altere alguna de las tres relaciones rompe este test a propósito.
// ---------------------------------------------------------------------------
{
  // ACTIVITY_EXPENSE_RATE.digitalServices = 0.20 (verificado en config).
  const monthly = 5000;
  const annual = monthly * 12;
  const itemsAnnual = 80 * 12 + 100 * 12; // software + asesoria, 100% deducibles
  const items = presetItems({ software: 80, asesoria: 100 });

  const esp = calculateSavings(monthly, "espana", "autonomo", "digitalServices", 0, false, items);
  const expectedSpainDeductibles = Math.round(annual * 0.20) + itemsAnnual;
  record(
    "veracidad[deducibles] España = annual × 0.20 + itemized (modelo aditivo)",
    esp.gastosDeducibles === expectedSpainDeductibles,
    `expected=${expectedSpainDeductibles} got=${esp.gastosDeducibles}`,
  );

  // En los países no-España, el campo `gastosDeducibles` PÚBLICO sigue
  // mostrando el modelo aditivo (consistencia con la rama LLC), aunque el
  // cálculo interno del autónomo solo use `itemized` + AUTONOMO_NET_FACTORS.
  const ale = calculateSavings(monthly, "alemania", "autonomo", "digitalServices", 0, false, items);
  record(
    "veracidad[deducibles] Alemania gastosDeducibles aplica modelo aditivo (= España)",
    ale.gastosDeducibles === expectedSpainDeductibles,
    `expected=${expectedSpainDeductibles} got=${ale.gastosDeducibles}`,
  );

  // Verificación de la consecuencia documentada: la rama LLC en países
  // no-España descuenta gastos > los que descuenta la rama autónomo
  // interna, lo que hace la LLC artificialmente más atractiva. La rama
  // autónoma de Alemania solo descuenta `itemized`, no la baseline.
  // (No fijamos el delta exacto — sólo verificamos que ambas son finitas
  // y que el campo público respeta la simetría con España).
  record(
    "veracidad[deducibles] Alemania autonomo.sinLLC > 0 sin baseline (asimetría documentada)",
    Number.isFinite(ale.sinLLC) && ale.sinLLC > 0,
    `sinLLC=${ale.sinLLC}`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — Sociedad ES admin profit-share constant (audit Task #17).
// Verifica que `SPAIN_SOCIEDAD_ADMIN_PROFIT_SHARE` (0.25) se aplica
// consistentemente: a 12.000€/mes de facturación, el salario admin debe
// ser ~25% del netAnnual / 12, suficientemente alto para superar la base
// mínima de 1000€/mes y dispararla a tramos de cotización superiores.
// ---------------------------------------------------------------------------
{
  // monthlyIncome alta (~12k) → netAnnual alto → adminSalary > BASE_MIN.
  // El resultado debe contener una línea de cuota SS admin > 3756 €/año
  // (la cuota mínima de 313 €/mes × 12). Si la 0.25 desaparece o se
  // reemplaza por otro literal, la cuota colapsa a la base mínima.
  const r = calculateSavings(12000, "espana", "sociedad", "digitalServices", 0, false, []);
  const ssAdmin = r.breakdown.find((b) => b.label === "calculator.bd.espana.cuotaSSAdmin");
  record(
    "veracidad[ES sociedad] admin SS escala con SPAIN_SOCIEDAD_ADMIN_PROFIT_SHARE (0.25)",
    !!ssAdmin && ssAdmin.amount > 3756,
    `cuota=${ssAdmin?.amount} (mínima 3756 si la share desaparece)`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — Tarifa plana lock. The reduced 80€/mo cuota in year 1 must
// always produce 960€/year exactly — no rounding drift, no SS bracket
// scaling. Failing this assertion means the special regime regressed.
// ---------------------------------------------------------------------------
{
  const tp = calculateSavings(2200, "espana", "autonomo", "consultingAdvisory", 0, false, [], { tarifaPlana: true });
  const ss = tp.breakdown.find((b) => /seg\.\s*social|social|cuota|autónomo|autonomo/i.test(b.label));
  record(
    "veracidad[ES autónomo tarifa plana] cuota anual = 960€ (80€/mes × 12)",
    !!ss && ss.amount === 960,
    `ss=${ss?.amount} label=${ss?.label}`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — Alemania (DE) cobertura de casos límite y cross-checks
// numéricos exactos. Blinda los nuevos cálculos GERMANY_* contra drifts.
// ---------------------------------------------------------------------------
{
  // 1) DE autónomo sin ingresos: ESt y SV deben ser 0 (no fixed floor).
  const zero = calculateSavings(0, "alemania", "autonomo", "digitalServices", 0, false, []);
  const estZero = zero.breakdown.find((b) => b.label === "calculator.bd.alemania.est");
  const svZero = zero.breakdown.find((b) => b.label === "calculator.bd.alemania.sv");
  record(
    "veracidad[DE autónomo] sin ingresos → ESt y SV son 0 (sin coste fijo)",
    !!estZero && !!svZero && estZero.amount === 0 && svZero.amount === 0 && zero.sinLLC === 0,
    `est=${estZero?.amount} sv=${svZero?.amount} sinLLC=${zero.sinLLC}`,
  );

  // 2) DE autónomo 5000€/mes: SV exacta = anual × 0.80 × 0.197 = 9456 €.
  const deMid = calculateSavings(5000, "alemania", "autonomo", "digitalServices", 0, false, []);
  const svMid = deMid.breakdown.find((b) => b.label === "calculator.bd.alemania.sv");
  record(
    "veracidad[DE autónomo] SV = anual × 0.80 × 0.197 (cross-check exacto)",
    !!svMid && svMid.amount === 9456,
    `sv=${svMid?.amount} expected=9456`,
  );

  // 3) DE GmbH siempre incluye la línea fija de Steuerberater (3500 €).
  const deSoc = calculateSavings(0, "alemania", "sociedad", "digitalServices", 0, false, []);
  const stb = deSoc.breakdown.find((b) => b.label === "calculator.bd.alemania.steuerberater");
  record(
    "veracidad[DE sociedad] Steuerberater siempre presente con coste fijo 3500 €",
    !!stb && stb.amount === 3500,
    `stb=${stb?.amount}`,
  );

  // 4) DE GmbH efectiva ≥ 30 % a niveles medios: el combo KSt+Soli+GewSt+
  //    KapErtSt es estructuralmente caro y compite peor que la LLC.
  const deSocMid = calculateSavings(8000, "alemania", "sociedad", "digitalServices", 0, false, []);
  record(
    "veracidad[DE sociedad] effective rate ≥ 30 % a 8.000€/mes (combo KSt+GewSt+KapErtSt)",
    deSocMid.sinLLC > 0 && (deSocMid.sinLLC / (8000 * 12)) >= 0.30,
    `total=${deSocMid.sinLLC} eff=${(deSocMid.sinLLC / (8000 * 12) * 100).toFixed(1)}%`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — Portugal (PT) cobertura de casos límite y cross-checks.
// Blinda los nuevos cálculos PORTUGAL_* (IRS+derrama, SS TSU, IRC+derrama
// municipal, dividendos, contabilista) contra regresiones.
// ---------------------------------------------------------------------------
{
  // 1) PT autónomo: SS = anual × 0.70 × 0.214, cross-check exacto a 2.500€/mes.
  const pt = calculateSavings(2500, "portugal", "autonomo", "consultingAdvisory", 0, false, []);
  const ss = pt.breakdown.find((b) => b.label === "calculator.bd.portugal.ss");
  record(
    "veracidad[PT autónomo] SS = anual × 0.70 × 0.214 (cross-check exacto)",
    !!ss && ss.amount === 4494,
    `ss=${ss?.amount} expected=4494`,
  );

  // 2) PT autónomo derrama estatal: a 5.000€/mes (anual 60k, netBase 46.8k)
  //    netBase < 80k → derrama = 0, IRS solo por tramos.
  const ptMid = calculateSavings(5000, "portugal", "autonomo", "digitalServices", 0, false, []);
  const irsMid = ptMid.breakdown.find((b) => b.label === "calculator.bd.portugal.irs");
  // 3) A 10.000€/mes (anual 120k, netBase 93.6k) → derrama activada
  //    derrama ≈ (93600 - 80000) × 0.025 = 340 €.
  const ptHigh = calculateSavings(10000, "portugal", "autonomo", "digitalServices", 0, false, []);
  const irsHigh = ptHigh.breakdown.find((b) => b.label === "calculator.bd.portugal.irs");
  record(
    "veracidad[PT autónomo] derrama estatal se activa solo cuando netBase > 80.000 €",
    !!irsMid && !!irsHigh && irsHigh.amount > irsMid.amount,
    `irsMid=${irsMid?.amount} irsHigh=${irsHigh?.amount}`,
  );

  // 4) PT sociedad sin ingresos: solo el coste fijo del contabilista (2800 €).
  const ptSocZero = calculateSavings(0, "portugal", "sociedad", "digitalServices", 0, false, []);
  const cont = ptSocZero.breakdown.find((b) => b.label === "calculator.bd.portugal.contabilista");
  record(
    "veracidad[PT sociedad] sin ingresos → solo coste fijo contabilista 2800 €",
    !!cont && cont.amount === 2800 && ptSocZero.sinLLC === 2800,
    `cont=${cont?.amount} sinLLC=${ptSocZero.sinLLC}`,
  );

  // 5) PT sociedad: el desglose completo siempre tiene 4 líneas
  //    (IRC, derrama municipal, dividendos, contabilista).
  const ptSoc = calculateSavings(7500, "portugal", "sociedad", "digitalServices", 0, false, []);
  const labels = new Set(ptSoc.breakdown.map((b) => b.label));
  const hasAll = ["calculator.bd.portugal.irc", "calculator.bd.portugal.derrama",
    "calculator.bd.portugal.dividendos", "calculator.bd.portugal.contabilista"]
    .every((k) => labels.has(k));
  record(
    "veracidad[PT sociedad] desglose siempre incluye IRC + derrama + dividendos + contabilista",
    hasAll && ptSoc.breakdown.length === 4,
    `lines=${ptSoc.breakdown.length} labels=${[...labels].join(",")}`,
  );
}

// ---------------------------------------------------------------------------
// Veracidad — IVA correcta para los nuevos países: DE 19 %, PT 23 %.
// Si alguien cambia COUNTRY_VAT_RATES sin querer, este test rompe.
// ---------------------------------------------------------------------------
{
  const de = calculateSavings(5000, "alemania", "autonomo", "digitalServices", 0, false, []);
  const pt = calculateSavings(5000, "portugal", "autonomo", "digitalServices", 0, false, []);
  record(
    "veracidad[VAT] Alemania = 19 % anual (60.000 × 0.19 = 11.400)",
    de.ivaNote === 11400,
    `iva=${de.ivaNote} expected=11400`,
  );
  record(
    "veracidad[VAT] Portugal = 23 % anual (60.000 × 0.23 = 13.800)",
    pt.ivaNote === 13800,
    `iva=${pt.ivaNote} expected=13800`,
  );
}

// ---------------------------------------------------------------------------
// Smoke — Selector de países: la lista expuesta NO contiene italia/austria,
// SÍ contiene alemania/portugal. Blinda contra reintroducciones accidentales.
// ---------------------------------------------------------------------------
{
  const ids = countries.map((c) => c.id);
  record(
    "smoke[selector] countries incluye alemania y portugal y excluye italia/austria",
    ids.includes("alemania") && ids.includes("portugal")
      && !ids.includes("italia") && !ids.includes("austria"),
    `ids=[${ids.join(", ")}]`,
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);

for (const r of results) {
  const tag = r.ok ? "PASS" : "FAIL";
  const detail = r.detail ? `   ${r.detail}` : "";
  console.log(`[${tag}] ${r.name}${detail ? "\n" + detail : ""}`);
}

console.log(`\n${passed}/${results.length} assertions passed.`);

if (failed.length > 0) {
  console.error(`\n${failed.length} assertion(s) failed:`);
  for (const f of failed) {
    console.error(`  - ${f.name}${f.detail ? `   (${f.detail})` : ""}`);
  }
  process.exit(1);
}
