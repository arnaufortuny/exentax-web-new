#!/usr/bin/env node
/**
 * Idempotent updater that:
 *  (1) Adds an "official sources" sentence at the end of the OECD/DAC8
 *      package paragraph inside the existing <!-- exentax:crs2-update-v1 -->
 *      block in every spoke article (10 slugs x 6 langs = 60 files).
 *  (2) Backfills SOURCES_BY_SLUG entries in client/src/data/blog-sources.ts
 *      so the bottom-of-article Sources block also surfaces oecd-crs,
 *      oecd-carf and eu-dac8 for those spokes.
 *
 * Re-runs are no-ops once both changes are present.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const SPOKES = [
  "crs-cuentas-bancarias-llc-intercambio-informacion",
  "crs-residentes-espana-latam-implicaciones",
  "cuentas-bancarias-usa-reportan-hacienda-verdad",
  "revolut-business-crs-reporting-fiscal",
  "wise-business-crs-reporting-fiscal",
  "wise-iban-llc-que-reporta-hacienda",
  "dac8-criptomonedas-reporting-fiscal-2026",
  "dac7-plataformas-digitales-reporting-2026",
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero",
  "visa-mastercard-reporting-tarjetas-hacienda",
];

const URLS = {
  "oecd-crs":
    "https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/",
  "oecd-carf":
    "https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm",
  "eu-dac8":
    "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226",
};

const ATTR = ' target="_blank" rel="noopener nofollow"';

/** Sources sentence per language — appended at the end of the OECD/DAC8 paragraph. */
const SOURCES_LINE = {
  es: `Fuentes oficiales: <a href="${URLS["oecd-crs"]}"${ATTR}>OCDE — CRS</a>, <a href="${URLS["oecd-carf"]}"${ATTR}>OCDE — CARF</a>, <a href="${URLS["eu-dac8"]}"${ATTR}>EUR-Lex — Directiva (UE) 2023/2226 (DAC8)</a>.`,
  en: `Official sources: <a href="${URLS["oecd-crs"]}"${ATTR}>OECD — CRS</a>, <a href="${URLS["oecd-carf"]}"${ATTR}>OECD — CARF</a>, <a href="${URLS["eu-dac8"]}"${ATTR}>EUR-Lex — Directive (EU) 2023/2226 (DAC8)</a>.`,
  fr: `Sources officielles : <a href="${URLS["oecd-crs"]}"${ATTR}>OCDE — CRS</a>, <a href="${URLS["oecd-carf"]}"${ATTR}>OCDE — CARF</a>, <a href="${URLS["eu-dac8"]}"${ATTR}>EUR-Lex — Directive (UE) 2023/2226 (DAC8)</a>.`,
  de: `Offizielle Quellen: <a href="${URLS["oecd-crs"]}"${ATTR}>OECD — CRS</a>, <a href="${URLS["oecd-carf"]}"${ATTR}>OECD — CARF</a>, <a href="${URLS["eu-dac8"]}"${ATTR}>EUR-Lex — Richtlinie (EU) 2023/2226 (DAC8)</a>.`,
  pt: `Fontes oficiais: <a href="${URLS["oecd-crs"]}"${ATTR}>OCDE — CRS</a>, <a href="${URLS["oecd-carf"]}"${ATTR}>OCDE — CARF</a>, <a href="${URLS["eu-dac8"]}"${ATTR}>EUR-Lex — Diretiva (UE) 2023/2226 (DAC8)</a>.`,
  ca: `Fonts oficials: <a href="${URLS["oecd-crs"]}"${ATTR}>OCDE — CRS</a>, <a href="${URLS["oecd-carf"]}"${ATTR}>OCDE — CARF</a>, <a href="${URLS["eu-dac8"]}"${ATTR}>EUR-Lex — Directiva (UE) 2023/2226 (DAC8)</a>.`,
};

const OPEN = "<!-- exentax:crs2-update-v1 -->";
const CLOSE = "<!-- /exentax:crs2-update-v1 -->";
const MARKER = URLS["oecd-crs"]; // presence = already updated

async function updateInjectionBlocks() {
  let changed = 0;
  let skipped = 0;
  let missing = 0;
  for (const slug of SPOKES) {
    for (const lang of LANGS) {
      const f = path.join(
        REPO,
        "client/src/data/blog-content",
        lang,
        `${slug}.ts`,
      );
      let src;
      try {
        src = await fs.readFile(f, "utf8");
      } catch {
        missing++;
        continue;
      }
      const o = src.indexOf(OPEN);
      const c = src.indexOf(CLOSE);
      if (o === -1 || c === -1 || c < o) {
        missing++;
        continue;
      }
      const block = src.slice(o, c + CLOSE.length);
      if (block.includes(MARKER)) {
        skipped++;
        continue;
      }
      // Append the sources sentence at the end of the second paragraph
      // (the OECD/DAC8 fact paragraph), which ends with "datos del ejercicio 2026.**"
      // (markdown bold). We locate the paragraph break (\n\n) AFTER the bold
      // close `2026.**` and insert the sentence before the third paragraph
      // (USA narrative). To stay editorial, we add it as a new paragraph after.
      const lines = block.split("\n");
      // Find the last paragraph (USA narrative) — starts with "La narrativa", "The takeaway",
      // "Le message", "Die Botschaft", "A narrativa" or "El missatge". Insert the
      // sources sentence as its own paragraph immediately before that one.
      const triggers = [
        /^La narrativa que conviene fijar/, // es
        /^The takeaway to remember/, // en
        /^Le message à retenir/, // fr
        /^Die Botschaft bleibt unverändert/, // de
        /^A narrativa a reter/, // pt
        /^El missatge a retenir/, // ca
      ];
      let insertAt = -1;
      for (let i = 0; i < lines.length; i++) {
        if (triggers.some((re) => re.test(lines[i]))) {
          insertAt = i;
          break;
        }
      }
      if (insertAt === -1) {
        missing++;
        console.warn(`  ! ${lang}/${slug}: USA-narrative paragraph not found`);
        continue;
      }
      const sourcesLine = SOURCES_LINE[lang];
      // Insert: empty line, sources line, empty line — but only if the previous
      // line is not already empty (avoid double blank lines in some files).
      const newLines = [
        ...lines.slice(0, insertAt),
        sourcesLine,
        "",
        ...lines.slice(insertAt),
      ];
      const newBlock = newLines.join("\n");
      const newSrc = src.slice(0, o) + newBlock + src.slice(c + CLOSE.length);
      await fs.writeFile(f, newSrc, "utf8");
      changed++;
    }
  }
  return { changed, skipped, missing };
}

async function updateBlogSources() {
  const f = path.join(REPO, "client/src/data/blog-sources.ts");
  let src = await fs.readFile(f, "utf8");
  const before = src;
  // For each spoke entry: find the entry, ensure it includes oecd-crs, oecd-carf, eu-dac8.
  // Two shapes are present: array literal "[ ... ]," or shorthand alias "CRS_FATCA,".
  const wanted = ["oecd-crs", "oecd-carf", "eu-dac8"];
  let edits = 0;
  for (const slug of SPOKES) {
    const keyRe = new RegExp(
      `(  \\"${slug}\\":\\s*)(\\[[\\s\\S]*?\\n  \\],|CRS_FATCA,)`,
      "m",
    );
    const m = src.match(keyRe);
    if (!m) {
      console.warn(`  ! source entry for ${slug} not found`);
      continue;
    }
    const [whole, prefix, body] = m;
    let arrayBody;
    if (body === "CRS_FATCA,") {
      // expand alias inline with spread + new externals
      arrayBody = `[\n    ...CRS_FATCA,\n  ],`;
    } else {
      arrayBody = body;
    }
    // Inject missing externals into the array body, just before the closing `\n  ],`
    let mutated = arrayBody;
    for (const ext of wanted) {
      if (mutated.includes(`{ external: "${ext}" }`)) continue;
      mutated = mutated.replace(
        /\n  \],$/,
        `\n    { external: "${ext}" },\n  ],`,
      );
      edits++;
    }
    if (mutated !== body) {
      src = src.replace(whole, prefix + mutated);
    }
  }
  if (src !== before) {
    await fs.writeFile(f, src, "utf8");
  }
  return { edits, fileChanged: src !== before };
}

(async () => {
  console.log("[crs2-citations] updating injection blocks…");
  const inj = await updateInjectionBlocks();
  console.log(
    `  blocks: changed=${inj.changed}  skipped(already)=${inj.skipped}  missing=${inj.missing}  expected=${SPOKES.length * LANGS.length}`,
  );
  console.log("[crs2-citations] updating blog-sources.ts entries…");
  const srcRes = await updateBlogSources();
  console.log(
    `  sources: edits=${srcRes.edits}  file-changed=${srcRes.fileChanged}`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
