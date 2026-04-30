// Shared Zod schema for `POST /api/calculator-leads`.
// Exported so both the route handler and the test runner consume the
// exact same contract — no drift between production validation and
// audit assertions.
import { z } from "zod";
import { sanitizeInput, isValidPhone, PHONE_MAX_LENGTH } from "../route-helpers";

export const calculatorLeadSchema = z.object({
  email: z.string().email("zodInvalidEmail").max(254, "zodEmailTooLong"),
  phone: z.string().max(PHONE_MAX_LENGTH, "zodPhoneTooLong").transform(sanitizeInput).refine(isValidPhone, "zodPhoneMinDigits"),
  country: z.string().max(100).transform(sanitizeInput),
  regime: z.string().max(100).transform(sanitizeInput),
  activity: z.string().max(100).transform(sanitizeInput),
  income: z.number().min(0).max(10_000_000),
  incomeMode: z.enum(["monthly", "annual"]).optional().default("monthly"),
  annualIncome: z.number().min(0).max(120_000_000).optional(),
  effectiveRate: z.number().min(0).max(100).optional(),
  ahorro: z.number().min(0).max(120_000_000),
  sinLLC: z.number().min(0).max(120_000_000),
  conLLC: z.number().min(0).max(120_000_000),
  localLabel: z.string().max(100).transform(sanitizeInput),
  breakdown: z.array(z.object({
    label: z.string().max(200).transform(sanitizeInput),
    amount: z.number(),
  })).max(20),
  deductibleExpenses: z.number().min(0).max(1_000_000).optional().default(0),
  calcSpainIrpf: z.boolean().optional().default(false),
  // Comunidad Autónoma (España) explicitly chosen by the visitor.
  // Constrained to the 19 keys in `CCAA_PROFILE_MAP` (the 17 CCAA + the
  // two autonomous cities Ceuta and Melilla; País Vasco and Navarra are
  // already part of the 17 and additionally flagged as foral on the UI).
  // Replaces the older `low|medium|high` aggregate sent from the UI: the
  // server now receives the exact CCAA so the email can echo
  // "España · Madrid" and future analytics can split conversion by
  // region. Optional for back-compat with older clients (in that case
  // the email omits the CCAA row and the calculation defaults to the
  // "medium" profile, preserving the pre-Task-53 behaviour).
  // NOTE: keep this list in sync with `CCAA_PROFILE_MAP` /
  // `CCAA_KEYS` in `client/src/lib/calculator-config.ts`. We duplicate
  // the keys here (rather than importing from the client bundle) to
  // keep the server↔client dependency direction one-way.
  ccaa: z.enum([
    "madrid", "andalucia", "larioja", "ceuta", "melilla",
    "aragon", "asturias", "baleares", "canarias", "cantabria",
    "castillaLaMancha", "castillaYLeon", "cataluna", "extremadura",
    "galicia", "murcia", "navarra", "paisVasco", "valencia",
  ]).optional(),
  privacyAccepted: z.boolean().refine((val) => val === true, "zodMustAcceptPrivacy"),
  marketingAccepted: z.boolean().optional().default(false),
  language: z.string().max(10).optional().nullable(),
  // Optional fidelity fields (back-compat with older clients).
  displayCurrency: z.enum(["EUR", "USD", "GBP"]).optional(),
  bestStructureId: z.enum(["autonomo", "sociedad", "llc"]).optional(),
  llcVsAutonomo: z.number().min(-120_000_000).max(120_000_000).optional(),
  llcVsSociedad: z.number().min(-120_000_000).max(120_000_000).optional(),
  options: z.object({
    tarifaPlana: z.boolean().optional(),
    franceMicro: z.boolean().optional(),
  }).strict().optional(),
  // Replay-fidelity inputs.
  expenseItems: z.array(z.object({
    id: z.string().max(50),
    monthly: z.number().min(0).max(1_000_000),
  })).max(50).optional(),
  customExpenses: z.array(z.object({
    label: z.string().max(120).transform(sanitizeInput),
    monthly: z.number().min(0).max(1_000_000),
  })).max(50).optional(),
}).strict();

export type CalculatorLeadInput = z.infer<typeof calculatorLeadSchema>;
