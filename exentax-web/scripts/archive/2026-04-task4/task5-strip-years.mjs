import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SLUGS = [
  "cuota-autonomo-2026",
  "modulos-vs-estimacion-directa-2026",
  "retenciones-irpf-factura",
  "sociedad-limitada-espana-costes-ventajas",
  "tramos-irpf-2026",
];

// Per-language pattern replacements applied in order.
// IMPORTANT: never use `\s+` (matches newlines) — use `[ \t]+` so headings and
// paragraphs do not get fused.
const RULES = {
  es: [
    // Heading-only sweep: drop trailing year token (with optional preposition).
    [/^(##[^\n]*?)[ \t]+(?:de|en|del|para|al)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+vigentes?[ \t]+en[ \t]+2026[ \t]*$/gm, "$1 vigente"],
    // Prose patterns (single-line only).
    [/,[ \t]*en[ \t]+2026,/g, ", actualmente,"],
    [/\bEn[ \t]+2026,[ \t]*/g, "Actualmente, "],
    [/\bEn[ \t]+2026[ \t]+/g, "Actualmente "],
    [/\bvigentes?[ \t]+en[ \t]+2026\b/g, "vigentes"],
    [/\ben[ \t]+2026\b/g, "actualmente"],
    [/\bdesde[ \t]+2023\b/g, "desde su entrada en vigor"],
    [/\bdel[ \t]+2026\b/g, "vigente"],
  ],
  en: [
    [/^(##[^\n]*?)[ \t]+(?:in|for|by|of)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^##[ \t]+2026[ \t]+([A-Za-z])/gm, (m, c) => "## " + c.toUpperCase()],
    [/^(##[ \t]+)([a-z])/gm, (m, p, c) => p + c.toUpperCase()],
    [/,[ \t]*by[ \t]+2026,/g, ", currently,"],
    [/\bIn[ \t]+2026,[ \t]*/g, "Currently, "],
    [/\bIn[ \t]+2026[ \t]+/g, "Currently "],
    [/\bin[ \t]+2026,[ \t]*/g, "currently, "],
    [/\bin[ \t]+force[ \t]+for[ \t]+2026\b/g, "currently in force"],
    [/\bfor[ \t]+2026\b/g, "currently"],
    [/\bin[ \t]+2026\b/g, "currently"],
    [/\bsince[ \t]+2023\b/g, "since it came into force"],
  ],
  fr: [
    [/^(##[^\n]*?)[ \t]+(?:en|de|du|pour|à)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+2026[ \t]*$/gm, "$1"],
    [/,[ \t]*en[ \t]+2026,/g, ", actuellement,"],
    [/\bEn[ \t]+2026,[ \t]*/g, "Actuellement, "],
    [/\ben[ \t]+vigueur[ \t]+en[ \t]+2026\b/g, "actuellement en vigueur"],
    [/\ben[ \t]+2026\b/g, "actuellement"],
    [/\bdepuis[ \t]+2023\b/g, "depuis son entrée en vigueur"],
  ],
  de: [
    [/^(##[^\n]*?)[ \t]+(?:in|für|von|im)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+2026[ \t]*$/gm, "$1"],
    [/,?[ \t]*und[ \t]+2026[ \t]+sind\b/g, " und sind"],
    [/\b2026[ \t]+sind[ \t]+die\b/g, "Aktuell sind die"],
    [/\bbleibt[ \t]+2026[ \t]+/g, "bleibt aktuell "],
    [/\bf[üu]r[ \t]+2026[ \t]+geltende?\b/g, "geltende"],
    [/\bin[ \t]+2026\b/g, "aktuell"],
    [/\b2026[ \t]+zahlen\b/g, "Aktuell zahlen"],
    [/\bseit[ \t]+2023\b/g, "seit Inkrafttreten"],
  ],
  pt: [
    [/^(##[^\n]*?)[ \t]+(?:em|de|do|para)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+2026[ \t]*$/gm, "$1"],
    [/,[ \t]*em[ \t]+2026,/g, ", atualmente,"],
    [/\bEm[ \t]+2026,[ \t]*/g, "Atualmente, "],
    [/\bem[ \t]+vigor[ \t]+em[ \t]+2026\b/g, "atualmente em vigor"],
    [/\bem[ \t]+2026\b/g, "atualmente"],
    [/\bdesde[ \t]+2023\b/g, "desde a sua entrada em vigor"],
  ],
  ca: [
    [/^(##[^\n]*?)[ \t]+(?:el|de|del|per a|al)[ \t]+2026[ \t]*$/gm, "$1"],
    [/^(##[^\n]*?)[ \t]+2026[ \t]*$/gm, "$1"],
    [/,[ \t]*el[ \t]+2026,/g, ", actualment,"],
    [/\bEl[ \t]+2026,[ \t]*/g, "Actualment, "],
    [/\bvigent[ \t]+el[ \t]+2026\b/g, "vigent actualment"],
    [/\bel[ \t]+2026\b/g, "actualment"],
    [/\bdes[ \t]+del[ \t]+2023\b/g, "des de la seva entrada en vigor"],
  ],
};

// Universal final-pass: clean lingering " 2026" tokens inside any "## " heading
// across all languages (run AFTER per-language rules).
function stripYearInHeadings(body) {
  return body.replace(/^(##[^\n]*)$/gm, (line) => {
    return line
      .replace(/[ \t]+2026[ \t]*:/g, ":")
      .replace(/[ \t]+2026[ \t]+/g, " ")
      .replace(/[ \t]+2026$/g, "")
      .replace(/[ \t]{2,}/g, " ");
  });
}

let totalChanged = 0;
for (const lang of Object.keys(RULES)) {
  for (const slug of SLUGS) {
    const path = resolve(ROOT, `client/src/data/blog-content/${lang}/${slug}.ts`);
    let raw = readFileSync(path, "utf8");
    const m = raw.match(/^(.*?`)([\s\S]*)(`\s*;\s*)$/);
    if (!m) {
      console.error(`! ${lang}/${slug}: cannot split body`);
      continue;
    }
    let body = m[2];
    const before = body;
    for (const [rx, rep] of RULES[lang]) body = body.replace(rx, rep);
    body = stripYearInHeadings(body);
    body = body.replace(/[ \t]{2,}/g, " ").replace(/[ \t]+\n/g, "\n");
    if (body !== before) {
      writeFileSync(path, m[1] + body + m[3]);
      totalChanged++;
      console.log(`+ ${lang}/${slug}: rewritten`);
    } else {
      console.log(`= ${lang}/${slug}: no change`);
    }
  }
}
console.log(`\nDone. Updated ${totalChanged} files.`);
