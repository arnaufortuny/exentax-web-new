import es from "../../client/src/i18n/locales/es";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

type Obj = Record<string, unknown>;

function getLeafPaths(obj: Obj, prefix = ""): string[] {
  const paths: string[] = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      paths.push(...getLeafPaths(val as Obj, full));
    } else {
      paths.push(full);
    }
  }
  return paths;
}

function getNamespacePaths(obj: Obj, prefix = ""): string[] {
  const paths: string[] = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      paths.push(full);
      paths.push(...getNamespacePaths(val as Obj, full));
    }
  }
  return paths;
}

const leafKeys = getLeafPaths(es);
const nsKeys = getNamespacePaths(es);

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../../client/src/i18n/keys.generated.ts");

const lines: string[] = [
  "/* eslint-disable */",
  "/* AUTO-GENERATED — DO NOT EDIT MANUALLY */",
  "/* Run: npm run i18n:generate-types */",
  "",
  "export type TranslationKey =",
];

for (let i = 0; i < leafKeys.length; i++) {
  const sep = i < leafKeys.length - 1 ? "" : ";";
  lines.push(`  | "${leafKeys[i]}"${sep}`);
}

lines.push("");
lines.push("export type TranslationNamespace =");
for (let i = 0; i < nsKeys.length; i++) {
  const sep = i < nsKeys.length - 1 ? "" : ";";
  lines.push(`  | "${nsKeys[i]}"${sep}`);
}

lines.push("");

writeFileSync(outPath, lines.join("\n") + "\n", "utf-8");
console.log(`Generated ${leafKeys.length} keys, ${nsKeys.length} namespaces → ${outPath}`);
