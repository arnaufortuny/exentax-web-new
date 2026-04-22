#!/usr/bin/env node
/**
 * blog-structure-fix-h3.mjs
 *
 * Injects an H3 sub-heading inside long boilerplate appendix sections that are
 * over 400 words. These sections are uniformly appended to most blog posts and
 * cause Task #37's "no section over 400 words without subheading" rule to fail
 * across the corpus.
 *
 * Affected sections (per locale):
 *   - Banking facts 2026     (~418w, marker `<!-- exentax:banking-facts-v1 -->`)
 *   - Legal/procedural facts (~varies, marker `<!-- exentax:legal-facts-v1 -->` if present)
 *   - CFC / TFI compliance   (~406w, no marker — matched by translated H2 text)
 *
 * For each, we inject an H3 sub-heading immediately before the first bullet/
 * table block, so the long enumerated content sits under a sub-heading.
 *
 * Idempotent: skips a section if the H3 has already been inserted.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// H2 detection patterns + corresponding H3 text per locale.
const SECTIONS = [
  {
    key: "banking-facts",
    h2: {
      es: "## Hechos bancarios y fiscales que conviene precisar (actualización 2026)",
      en: "## Banking and tax facts worth clarifying (2026 update)",
      fr: "## Faits bancaires et fiscaux à préciser (mise à jour 2026)",
      de: "## Bank- und Steuerfakten zur Präzisierung (Update 2026)",
      pt: "## Factos bancários e fiscais a precisar (atualização 2026)",
      ca: "## Fets bancaris i fiscals a precisar (actualització 2026)",
    },
    h3: {
      es: "### Notas por proveedor",
      en: "### Notes by provider",
      fr: "### Notes par fournisseur",
      de: "### Hinweise nach Anbieter",
      pt: "### Notas por provedor",
      ca: "### Notes per proveïdor",
    },
  },
  {
    key: "cfc-tfi",
    h2: {
      es: "## Compliance fiscal en tu país: CFC, TFI y atribución de rentas",
      en: "## Tax compliance in your country: CFC, controlled-foreign rules and income attribution",
      fr: "## Conformité fiscale dans votre pays : CFC, transparence fiscale et attribution des revenus",
      de: "## Steuer-Compliance in deinem Land: CFC, Hinzurechnungsbesteuerung und Einkünftezurechnung",
      pt: "## Compliance fiscal no seu país: CFC, transparência fiscal e atribuição de rendimentos",
      ca: "## Compliance fiscal al teu país: CFC, TFI i atribució de rendes",
    },
    h3: {
      es: "### Por jurisdicción",
      en: "### By jurisdiction",
      fr: "### Par juridiction",
      de: "### Nach Rechtsordnung",
      pt: "### Por jurisdição",
      ca: "### Per jurisdicció",
    },
  },
  {
    key: "legal-facts",
    h2: {
      es: "## Hechos legales y de procedimiento (actualización 2026)",
      en: "## Legal and procedural facts (2026 update)",
      fr: "## Faits légaux & de procédure (mise à jour 2026)",
      de: "## Rechts- und Verfahrensfakten (Update 2026)",
      pt: "## Factos legais e de procedimento (atualização 2026)",
      ca: "## Fets legals i de procediment (actualització 2026)",
    },
    h3: {
      es: "### Puntos clave",
      en: "### Key points",
      fr: "### Points clés",
      de: "### Kernpunkte",
      pt: "### Pontos-chave",
      ca: "### Punts clau",
    },
  },
];

let totalInjected = 0;

for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  let langInjected = 0;
  for (const f of files) {
    const path = join(dir, f);
    let src = readFileSync(path, "utf8");
    let changed = false;
    for (const sec of SECTIONS) {
      const h2Line = sec.h2[lang];
      const h3Line = sec.h3[lang];
      const h2Idx = src.indexOf(h2Line);
      if (h2Idx === -1) continue;
      // Identify section bounds: from end of H2 line to next H2 or end of body.
      const afterH2 = h2Idx + h2Line.length;
      // Find next H2 (with leading newline + ##) or end-of-template backtick.
      const nextH2Re = /\n\s*##\s+/g;
      nextH2Re.lastIndex = afterH2;
      const nextH2 = nextH2Re.exec(src);
      const endTemplate = src.indexOf("`;", afterH2);
      let sectionEnd =
        nextH2 && (endTemplate === -1 || nextH2.index < endTemplate)
          ? nextH2.index
          : endTemplate === -1
            ? src.length
            : endTemplate;
      const sectionBody = src.slice(afterH2, sectionEnd);
      // Skip if H3 already present anywhere in this section.
      if (/\n\s*###\s+\S/.test(sectionBody)) continue;
      // Find first bullet line ("- ") or table row ("|") in this section.
      const firstBulletIdx = sectionBody.search(/\n\s*-\s+\*\*|\n\s*\|\s/);
      if (firstBulletIdx === -1) continue;
      // Compute insertion position in absolute src.
      const insertAt = afterH2 + firstBulletIdx;
      // Insert "\n\n  ### …\n" preserving the file's 2-space indent style for body lines.
      const insert = `\n\n  ${h3Line}\n`;
      src = src.slice(0, insertAt) + insert + src.slice(insertAt);
      changed = true;
      langInjected++;
      totalInjected++;
    }
    if (changed) writeFileSync(path, src);
  }
  console.log(`[${lang}] H3 injections: ${langInjected}`);
}
console.log(`\nTOTAL H3 INJECTIONS: ${totalInjected}`);
