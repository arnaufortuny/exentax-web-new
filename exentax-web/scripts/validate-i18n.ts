import es from "../client/src/i18n/locales/es";
import en from "../client/src/i18n/locales/en";
import fr from "../client/src/i18n/locales/fr";
import de from "../client/src/i18n/locales/de";
import pt from "../client/src/i18n/locales/pt";
import ca from "../client/src/i18n/locales/ca";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

const reference = es;
const refKeys = new Set(getLeafKeys(reference));
const langs: Record<string, Bundle> = { en, fr, de, pt, ca };

let exitCode = 0;
let totalMissing = 0;
let totalExtra = 0;
let totalEmpty = 0;
let totalDuplicate = 0;
let totalPlaceholderMismatch = 0;

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
  for (const k of langKeys) {
    if (!refKeys.has(k)) continue;
    const esVal = getValueAtPath(reference, k);
    const langVal = getValueAtPath(bundle, k);
    if (typeof esVal === "string" && esVal === langVal && esVal.length > 3) {
      untranslated.push(k);
    }
  }

  totalMissing += missing.length;
  totalExtra += extra.length;
  totalEmpty += empty.length;
  totalDuplicate += untranslated.length;
  totalPlaceholderMismatch += placeholderMismatches.length;

  const hasIssues =
    missing.length > 0 ||
    extra.length > 0 ||
    empty.length > 0 ||
    placeholderMismatches.length > 0;
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
const srcDir = resolve(__dirname, "../client/src");

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
    "preciosPage.",
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
console.log(" Summary");
console.log("═══════════════════════════════════════════════");
console.log(`Total missing keys:        ${totalMissing}`);
console.log(`Total extra keys:          ${totalExtra}`);
console.log(`Total empty values:        ${totalEmpty}`);
console.log(`Placeholder mismatches:    ${totalPlaceholderMismatch}`);
console.log(`Possibly untranslated:     ${totalDuplicate}`);
console.log(
  `\nResult: ${exitCode === 0 ? "PASS ✓" : "ISSUES FOUND ✗"}`,
);

process.exit(exitCode);
