import es from "../../client/src/i18n/locales/es";
import en from "../../client/src/i18n/locales/en";
import fr from "../../client/src/i18n/locales/fr";
import de from "../../client/src/i18n/locales/de";
import pt from "../../client/src/i18n/locales/pt";
import ca from "../../client/src/i18n/locales/ca";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

type Bundle = Record<string, unknown>;

function getLeafKeys(obj: Bundle, prefix = ""): string[] {
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      keys.push(...getLeafKeys(val as Bundle, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function getValueAtPath(obj: Bundle, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Bundle)[p];
  }
  return current;
}

function extractPlaceholders(str: string): string[] {
  const matches = str.match(/\{\{(\w+)\}\}/g);
  return matches ? matches.map((m) => m.replace(/[{}]/g, "")).sort() : [];
}

function getStructurePaths(value: unknown, prefix = ""): string[] {
  const paths: string[] = [];
  if (Array.isArray(value)) {
    paths.push(`${prefix}=ARRAY(${value.length})`);
    value.forEach((v, i) => {
      paths.push(...getStructurePaths(v, `${prefix}[${i}]`));
    });
  } else if (value && typeof value === "object") {
    for (const k of Object.keys(value as Bundle).sort()) {
      const full = prefix ? `${prefix}.${k}` : k;
      paths.push(...getStructurePaths((value as Bundle)[k], full));
    }
  } else {
    paths.push(`${prefix}=${typeof value}`);
  }
  return paths;
}

// ─── Intentional identical translations ──────────────────────────────
// Some strings are legitimately identical to ES across non-ES locales:
//   • Brand/platform names (WhatsApp, Wyoming, Delaware, GmbH)
//   • Official US tax forms (Form 1120, Form 5472, BOI Report)
//   • Country/regime official names (Sole Trader, Auto-entrepreneur,
//     Einkommensteuer, INPS Gestione Separata, Personal Allowance £…)
//   • Modern English-borrowed marketing/tech terms (SaaS, E-commerce,
//     Dropshipping, Print on demand, Coworking, Setup, Marketing)
//   • True ES↔PT/CA cognates (Anual, Mensual, Estructura, Cancelada,
//     Configurar, Operativa, Confirmada)
//   • Proper nouns (Argentina, Portugal, México, Chile, Colombia)
// These are tracked explicitly in i18n-intentional-identical.json and
// suppressed from the "Possibly untranslated" report.
const __dirnameForAllow = dirname(fileURLToPath(import.meta.url));
const ALLOWLIST_PATH = resolve(
  __dirnameForAllow,
  "i18n-intentional-identical.json",
);
let allowlistLoadFailed = false;
const INTENTIONAL_IDENTICAL: Record<string, Set<string>> = (() => {
  try {
    const raw = readFileSync(ALLOWLIST_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    const out: Record<string, Set<string>> = {};
    for (const [k, v] of Object.entries(parsed)) out[k] = new Set(v);
    return out;
  } catch (err) {
    allowlistLoadFailed = true;
    console.error(
      `✗ Failed to load intentional-identical allowlist at ${ALLOWLIST_PATH}: ${(err as Error).message}`,
    );
    return {};
  }
})();

const reference = es;
const refKeys = new Set(getLeafKeys(reference));
const refStructure = getStructurePaths(reference);
const refStructureSet = new Set(refStructure);
const langs: Record<string, Bundle> = { en, fr, de, pt, ca };

let exitCode = 0;
let totalMissing = 0;
let totalExtra = 0;
let totalEmpty = 0;
let totalDuplicate = 0;
let totalPlaceholderMismatch = 0;
let totalStructureMismatch = 0;

console.log("═══════════════════════════════════════════════");
console.log(" Exentax i18n Validation Report");
console.log("═══════════════════════════════════════════════");
console.log(`Reference locale: ES (${refKeys.size} keys)\n`);

const esEmpty: string[] = [];
for (const k of refKeys) {
  const val = getValueAtPath(reference, k);
  if (typeof val === "string" && val.trim() === "") {
    esEmpty.push(k);
  }
}
if (esEmpty.length > 0) {
  exitCode = 1;
  console.log(`✗ ES — ${refKeys.size} keys (reference)`);
  console.log(`  Empty values (${esEmpty.length}):`);
  esEmpty.forEach((k) => console.log(`    - ${k}`));
  totalEmpty += esEmpty.length;
} else {
  console.log(`✓ ES — ${refKeys.size} keys (reference)`);
}
console.log();

for (const [lang, bundle] of Object.entries(langs)) {
  const langKeys = new Set(getLeafKeys(bundle));
  const missing = [...refKeys].filter((k) => !langKeys.has(k));
  const extra = [...langKeys].filter((k) => !refKeys.has(k));

  const empty: string[] = [];
  for (const k of langKeys) {
    const val = getValueAtPath(bundle, k);
    if (typeof val === "string" && val.trim() === "") {
      empty.push(k);
    }
  }

  const placeholderMismatches: string[] = [];
  for (const k of langKeys) {
    if (!refKeys.has(k)) continue;
    const esVal = getValueAtPath(reference, k);
    const langVal = getValueAtPath(bundle, k);
    if (typeof esVal === "string" && typeof langVal === "string") {
      const esParams = extractPlaceholders(esVal);
      const langParams = extractPlaceholders(langVal);
      if (esParams.join(",") !== langParams.join(",")) {
        placeholderMismatches.push(
          `${k}: ES={{${esParams.join(",")}}} ${lang.toUpperCase()}={{${langParams.join(",")}}}`,
        );
      }
    }
  }

  const untranslated: string[] = [];
  const intentional = INTENTIONAL_IDENTICAL[lang] ?? new Set<string>();
  for (const k of langKeys) {
    if (!refKeys.has(k)) continue;
    const esVal = getValueAtPath(reference, k);
    const langVal = getValueAtPath(bundle, k);
    if (typeof esVal === "string" && esVal === langVal && esVal.length > 3) {
      if (intentional.has(k)) continue;
      untranslated.push(k);
    }
  }

  const langStructure = getStructurePaths(bundle);
  const langStructureSet = new Set(langStructure);
  const structureMissing = refStructure.filter(
    (k) => !langStructureSet.has(k),
  );
  const structureExtra = langStructure.filter(
    (k) => !refStructureSet.has(k),
  );

  totalMissing += missing.length;
  totalExtra += extra.length;
  totalEmpty += empty.length;
  totalDuplicate += untranslated.length;
  totalPlaceholderMismatch += placeholderMismatches.length;
  totalStructureMismatch += structureMissing.length + structureExtra.length;

  const hasIssues =
    missing.length > 0 ||
    extra.length > 0 ||
    empty.length > 0 ||
    placeholderMismatches.length > 0 ||
    structureMissing.length > 0 ||
    structureExtra.length > 0;
  const status = hasIssues ? "✗" : "✓";

  console.log(`${status} ${lang.toUpperCase()} — ${langKeys.size} keys`);

  if (missing.length > 0) {
    exitCode = 1;
    console.log(`  Missing (${missing.length}):`);
    missing.forEach((k) => console.log(`    - ${k}`));
  }
  if (extra.length > 0) {
    exitCode = 1;
    console.log(`  Extra (${extra.length}):`);
    extra.forEach((k) => console.log(`    - ${k}`));
  }
  if (empty.length > 0) {
    exitCode = 1;
    console.log(`  Empty values (${empty.length}):`);
    empty.forEach((k) => console.log(`    - ${k}`));
  }
  if (placeholderMismatches.length > 0) {
    exitCode = 1;
    console.log(
      `  Placeholder mismatches (${placeholderMismatches.length}):`,
    );
    placeholderMismatches.forEach((m) => console.log(`    ⚠ ${m}`));
  }
  if (structureMissing.length > 0 || structureExtra.length > 0) {
    exitCode = 1;
    console.log(
      `  Structure mismatch (missing: ${structureMissing.length}, extra: ${structureExtra.length}):`,
    );
    structureMissing.slice(0, 10).forEach((k) => console.log(`    - ${k}`));
    if (structureMissing.length > 10)
      console.log(`    ... and ${structureMissing.length - 10} more missing`);
    structureExtra.slice(0, 10).forEach((k) => console.log(`    + ${k}`));
    if (structureExtra.length > 10)
      console.log(`    ... and ${structureExtra.length - 10} more extra`);
  }
  if (untranslated.length > 0) {
    console.log(
      `  Possibly untranslated (same as ES, ${untranslated.length}):`,
    );
    untranslated.slice(0, 5).forEach((k) => console.log(`    ~ ${k}`));
    if (untranslated.length > 5)
      console.log(`    ... and ${untranslated.length - 5} more`);
  }
  console.log();
}

// ─── Allowlist hygiene audit ────────────────────────────────────────
// Every entry in INTENTIONAL_IDENTICAL must (a) reference a known
// non-ES locale, (b) point to a key that exists in both ES and that
// locale, and (c) actually still be identical to ES. Otherwise the
// allowlist has gone stale and is silently masking real misses.
console.log("═══════════════════════════════════════════════");
console.log(" Allowlist Hygiene (intentional identical entries)");
console.log("═══════════════════════════════════════════════");
const KNOWN_LOCALES = new Set(Object.keys(langs));
const allowlistIssues: string[] = [];
let allowlistTotal = 0;
for (const [lang, keys] of Object.entries(INTENTIONAL_IDENTICAL)) {
  if (!KNOWN_LOCALES.has(lang)) {
    allowlistIssues.push(`unknown locale "${lang}" in allowlist`);
    continue;
  }
  const bundle = langs[lang];
  for (const k of keys) {
    allowlistTotal++;
    if (!refKeys.has(k)) {
      allowlistIssues.push(`${lang}:${k} → key missing from ES reference`);
      continue;
    }
    const esVal = getValueAtPath(reference, k);
    const langVal = getValueAtPath(bundle, k);
    if (langVal === undefined) {
      allowlistIssues.push(`${lang}:${k} → key missing from ${lang} bundle`);
    } else if (esVal !== langVal) {
      allowlistIssues.push(
        `${lang}:${k} → no longer identical to ES (was allowlisted as intentional)`,
      );
    }
  }
}
if (allowlistLoadFailed) {
  exitCode = 1;
  console.log(
    `✗ Allowlist file could not be loaded — failing CI (see error above)\n`,
  );
} else if (allowlistIssues.length === 0) {
  console.log(
    `✓ All ${allowlistTotal} allowlisted entries valid and still identical to ES\n`,
  );
} else {
  exitCode = 1;
  console.log(`✗ ${allowlistIssues.length} stale allowlist entries:`);
  allowlistIssues.slice(0, 20).forEach((m) => console.log(`  - ${m}`));
  if (allowlistIssues.length > 20)
    console.log(`  ... and ${allowlistIssues.length - 20} more`);
  console.log();
}

console.log("═══════════════════════════════════════════════");
console.log(" Placeholder Consistency Check");
console.log("═══════════════════════════════════════════════");
if (totalPlaceholderMismatch === 0) {
  console.log("✓ All placeholders consistent across locales\n");
} else {
  console.log(
    `✗ ${totalPlaceholderMismatch} placeholder mismatches found\n`,
  );
}

console.log("═══════════════════════════════════════════════");
console.log(" Unused Key Detection (code scan)");
console.log("═══════════════════════════════════════════════");

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "../../client/src");

let codeContent = "";
try {
  codeContent = execSync(
    `grep -roh 't("[a-zA-Z0-9._]*"' "${srcDir}" --include='*.tsx' --include='*.ts' 2>/dev/null || true`,
    { encoding: "utf-8", maxBuffer: 10_000_000 },
  );
} catch {
  console.log("⚠ Could not scan source files for key usage\n");
}

if (codeContent) {
  const usedKeys = new Set<string>();
  for (const match of codeContent.matchAll(/t\("([a-zA-Z0-9._]+)"/g)) {
    usedKeys.add(match[1]);
  }

  const unusedKeys = [...refKeys].filter((k) => !usedKeys.has(k));
  // Dynamic prefix whitelist — keys under these prefixes are referenced via
  // template-literal patterns like t(`prefix.${variable}`) and therefore
  // cannot be detected by static grep of t("literal.key") calls.
  // Each prefix corresponds to a page/section namespace consumed dynamically.
  //
  // The 5 `subpages.{llcNm,llcWy,llcDe,llcFl,itin}.` entries cover the
  // service detail pages. They all render through the shared
  // client/src/pages/services/ServiceSubpage.tsx component, which receives
  // the namespace as an `i18nKey` prop ("subpages.llcNm" etc.) and looks
  // up every leaf via `t(`${i18nKey}.${suffix}`)`. The grep-based scanner
  // cannot resolve these template literals, so without these entries the
  // ~200 live keys that power these subpages would be reported as unused.
  // Each subpage file is wired into client/src/App.tsx and reachable from
  // the localized `service_llc_*` / `service_itin` routes in
  // shared/routes.ts — so the keys really are in use, the scanner just
  // can't see them statically. We list each subpage explicitly (rather
  // than whitelisting the whole `subpages.` prefix) so that genuinely
  // dead keys under any future or unused subpage namespace would still
  // be flagged.
  const dynamicPrefixes = [
    "seo.",
    "legal.",
    "homePage.",
    "hero.",
    "heroStats.",
    "problem.",
    "forWho.",
    "howItWorks.",
    "services.",
    "whyUs.",
    "origin.",
    "homeFaq.",
    "faqData.",
    "faqUI.",
    "serviciosPage.",
    "precios.",
    "reservarPage.",
    "reservar.",
    "comoFuncionaPage.",
    "comoFunciona.",
    "llcUsPage.",
    "faqPage.",
    "blogPost.",
    "booking.",
    "calculator.",
    "links.",
    "start.",
    "agenda.",
    "cookie.",
    "footer.",
    "nav.",
    "floatingCta.",
    "notFound.",
    "common.",
    "errors.",
    "subpages.llcNm.",
    "subpages.llcWy.",
    "subpages.llcDe.",
    "subpages.llcFl.",
    "subpages.itin.",
  ];

  const genuinelyUnused = unusedKeys.filter(
    (k) => !dynamicPrefixes.some((p) => k.startsWith(p)),
  );

  console.log(`Keys in code: ${usedKeys.size} unique references`);
  console.log(`Potentially unused: ${genuinelyUnused.length}`);
  if (genuinelyUnused.length > 0 && genuinelyUnused.length <= 30) {
    genuinelyUnused.forEach((k) => console.log(`  ? ${k}`));
  } else if (genuinelyUnused.length > 30) {
    genuinelyUnused.slice(0, 15).forEach((k) => console.log(`  ? ${k}`));
    console.log(`  ... and ${genuinelyUnused.length - 15} more`);
  }
  console.log();

  // ─── Phantom keys: referenced in code but missing from EVERY locale ──
  // These slip past the structural-parity check (which compares locales
  // against each other) and the "unused" check (which goes the other
  // way). They surface at runtime as missing-key warnings and would
  // hit our humanised-key fallback in production. Block them in CI.
  //
  // Allowance: many keys are accessed via array-element pathing such as
  // t(`comoFunciona.days.${i}.title`) — these resolve through an array
  // node in the locale bundle and are NOT phantom even though `refKeys`
  // (which stops at array nodes) doesn't contain the indexed leaf. We
  // detect that by walking the ES bundle for each suspect key and
  // accepting any path that traverses an Array.
  const resolvesThroughArray = (key: string): boolean => {
    const parts = key.split(".");
    let cur: unknown = reference;
    for (const p of parts) {
      if (Array.isArray(cur)) return true;
      if (!cur || typeof cur !== "object") return false;
      cur = (cur as Bundle)[p];
    }
    // After consuming all parts, if we landed on something defined, the
    // key resolves; otherwise consider whether the final node is an
    // array of strings/objects (e.g. t("foo.bar.items") → array leaf).
    return cur !== undefined;
  };

  // The `t("…")` regex inevitably catches non-i18n call sites (analytics
  // events, single-letter type-cast helpers, fetch-mock argument lists,
  // etc). Real i18n keys are either dotted or one of the 4 known
  // top-level keys. Anything else is a false positive from the regex,
  // not a missing translation.
  const TOP_LEVEL_I18N = new Set([
    "whatsappDefault",
    "whatsappNav",
    "whatsappFooter",
    "talkWhatsapp",
  ]);
  const looksLikeI18nKey = (k: string) =>
    k.length > 1 && (k.includes(".") || TOP_LEVEL_I18N.has(k)) && !k.startsWith(".") && !k.endsWith(".");

  const phantomKeys = [...usedKeys].filter(
    (k) =>
      looksLikeI18nKey(k) &&
      !refKeys.has(k) &&
      !resolvesThroughArray(k),
  );
  if (phantomKeys.length > 0) {
    console.log("═══════════════════════════════════════════════");
    console.log(" Phantom Keys (referenced in code, missing from ALL locales)");
    console.log("═══════════════════════════════════════════════");
    phantomKeys.forEach((k) => console.log(`  ✗ ${k}`));
    console.log(`Total phantom keys: ${phantomKeys.length}`);
    console.log();
    exitCode = 1;
  } else {
    console.log("✓ No phantom keys (every t() reference resolves in ES)\n");
  }
}

console.log("═══════════════════════════════════════════════");
console.log(" String Concatenation Audit");
console.log("═══════════════════════════════════════════════");

let concatContent = "";
try {
  concatContent = execSync(
    `grep -rn 't(".*") + "\\|t(".*") +' "${srcDir}" --include='*.tsx' 2>/dev/null || true`,
    { encoding: "utf-8", maxBuffer: 5_000_000 },
  );
} catch {
  /* skip */
}

const concatLines = concatContent
  .split("\n")
  .filter((l) => l.trim().length > 0);
if (concatLines.length === 0) {
  console.log("✓ No string concatenation with t() found\n");
} else {
  console.log(`⚠ ${concatLines.length} potential concatenation patterns:`);
  concatLines.slice(0, 10).forEach((l) => console.log(`  ${l.trim()}`));
  if (concatLines.length > 10)
    console.log(`  ... and ${concatLines.length - 10} more`);
  console.log();
}

console.log("═══════════════════════════════════════════════");
console.log(" Hardcoded Attribute Audit (CI-blocking)");
console.log("═══════════════════════════════════════════════");

const ALLOWED_BRAND_VALUES = new Set([
  "Exentax",
  "Trustpilot",
  "WhatsApp",
  "Calendly",
  "Stripe",
  "LinkedIn",
  "YouTube",
  "Instagram",
  "X",
]);
const HARDCODED_ATTR_RE =
  /\s(aria-label|alt|title|placeholder)=(["'])([^"'{}]+)\2/g;

let hardcodedContent = "";
try {
  hardcodedContent = execSync(
    `grep -rEn '(aria-label|alt|title|placeholder)=\"[^\"{]+\"' "${srcDir}" --include='*.tsx' 2>/dev/null || true`,
    { encoding: "utf-8", maxBuffer: 5_000_000 },
  );
} catch {
  /* skip */
}

const hardcodedViolations: string[] = [];
for (const line of hardcodedContent.split("\n")) {
  if (!line.trim()) continue;
  let m: RegExpExecArray | null;
  HARDCODED_ATTR_RE.lastIndex = 0;
  while ((m = HARDCODED_ATTR_RE.exec(line))) {
    const value = m[3].trim();
    if (!value) continue;
    if (ALLOWED_BRAND_VALUES.has(value)) continue;
    if (/^[\d\s.,$€%+-]+$/.test(value)) continue;
    hardcodedViolations.push(`${line.split(":").slice(0, 2).join(":")} → ${m[1]}="${value}"`);
  }
}

if (hardcodedViolations.length === 0) {
  console.log("✓ No hardcoded i18n-attribute violations\n");
} else {
  console.log(`✗ ${hardcodedViolations.length} hardcoded attribute(s):`);
  hardcodedViolations.slice(0, 30).forEach((v) => console.log(`  ${v}`));
  if (hardcodedViolations.length > 30)
    console.log(`  ... and ${hardcodedViolations.length - 30} more`);
  console.log();
  exitCode = 1;
}

console.log("═══════════════════════════════════════════════");
console.log(" Summary");
console.log("═══════════════════════════════════════════════");
console.log(`Total missing keys:        ${totalMissing}`);
console.log(`Total extra keys:          ${totalExtra}`);
console.log(`Total empty values:        ${totalEmpty}`);
console.log(`Placeholder mismatches:    ${totalPlaceholderMismatch}`);
console.log(`Structure mismatches:      ${totalStructureMismatch}`);
console.log(`Possibly untranslated:     ${totalDuplicate}`);
console.log(
  `\nResult: ${exitCode === 0 ? "PASS ✓" : "ISSUES FOUND ✗"}`,
);

process.exit(exitCode);
