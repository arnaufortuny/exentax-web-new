#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const FIXES = [
  {
    file: "client/src/data/blog-content/ca/diseno-estructura-fiscal-internacional-solida.ts",
    edits: [
      ["### Pas 5: Banking arquitectura", "### Pas 5: Arquitectura bancària"],
      ["| 5 | Com flueix el diner? | Banking arquitectura |", "| 5 | Com flueix el diner? | Arquitectura bancària |"],
    ],
  },
  {
    file: "client/src/data/blog-content/ca/reorganizar-banca-llc-mercury-relay-wise.ts",
    edits: [
      ["a l' nou arquitectura", "a la nova arquitectura"],
    ],
  },
  {
    file: "client/src/data/blog-content/ca/gastos-deducibles-autonomos-2026.ts",
    edits: [
      ["Tot l'arquitectura digital de l'autònom", "Tota l'arquitectura digital de l'autònom"],
    ],
  },
  {
    file: "client/src/data/blog-content/ca/por-que-abrir-llc-estados-unidos-ventajas.ts",
    edits: [
      ["amb tot l'arquitectura i modelem", "amb tota l'arquitectura i modelem"],
    ],
  },
  {
    file: "client/src/data/blog-content/ca/llc-alternativa-autonomo-espana.ts",
    edits: [
      ["(tot l'arquitectura professional facturat via LLC)", "(tota l'arquitectura professional facturada via LLC)"],
    ],
  },
  {
    file: "client/src/data/blog-content/ca/estructura-fiscal-optima-freelancer-internacional.ts",
    edits: [
      ["### L'arquitectura financera òptim per a freelancers internacionals", "### L'arquitectura financera òptima per a freelancers internacionals"],
    ],
  },
  {
    file: "client/src/data/blog-content/ca/revolut-business-crs-reporting-fiscal.ts",
    edits: [
      ["una arquitectura US primari (Mercury o Relay) i un node europeu secundari", "una arquitectura US primària (Mercury o Relay) i un node europeu secundari"],
    ],
  },
];

let totalFiles = 0;
for (const { file, edits } of FIXES) {
  const original = readFileSync(file, "utf8");
  let updated = original;
  for (const [oldStr, newStr] of edits) {
    if (!updated.includes(oldStr)) {
      console.error(`MISS in ${file}: ${oldStr}`);
      continue;
    }
    updated = updated.split(oldStr).join(newStr);
  }
  if (updated !== original) {
    writeFileSync(file, updated);
    totalFiles++;
    console.log(`fixed: ${file}`);
  }
}
console.log(`\nTotal files changed: ${totalFiles}`);
