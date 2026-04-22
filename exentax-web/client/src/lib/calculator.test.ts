#!/usr/bin/env tsx
/*
 * calculator.test.ts
 * ----------------------------------------------------------------------------
 * Unit tests for `computeAllStructures()` — the 3-structure comparator
 * (autónomo · sociedad local · LLC USA).
 *
 * Covers (per Task #14):
 *   - The four canonical use-case presets (`USE_CASE_PRESETS`) for
 *     internationally-oriented profiles → bestId === "llc".
 *   - Four "LLC not best" scenarios (analogous to L1–L4 in
 *     `docs/calculator-cases.md`) → bestId !== "llc".
 *
 * Run via `npm run test:calculator` (added in package.json) or directly with
 * `npx tsx client/src/lib/calculator.test.ts`. Exits with code 0 on success
 * and 1 on any mismatch so CI / post-merge / pre-deploy can fail fast.
 * ----------------------------------------------------------------------------
 */

import {
  USE_CASE_PRESETS,
  computeAllStructures,
  calculateSavings,
  type CalcOptions,
  type ExpenseItem,
  type AllStructuresResult,
} from "./calculator";

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

for (const preset of USE_CASE_PRESETS) {
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
  "italia",
  "austria",
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
