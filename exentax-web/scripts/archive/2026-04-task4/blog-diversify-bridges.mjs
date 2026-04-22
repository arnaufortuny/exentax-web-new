#!/usr/bin/env node
/**
 * Replace in-place every legacy single-variant bridge paragraph (the ten
 * fixed strings the injector used until now) with one of four rotating
 * variants chosen deterministically by hashing the title of the heading
 * immediately above the bridge.
 *
 * Why: until now, ~1265 injections shared the exact same paragraph per
 * (lang, level). That looks auto-generated and hurts SEO/perceived quality.
 * Running this script once promotes every existing translated section to
 * the new diversified pool without touching authored content.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BRIDGES } from "./blog-inject-translated-gaps.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");
const LANGS = ["en", "fr", "de", "pt", "ca"];

// Legacy single-variant strings the previous injector used.
const LEGACY = {
  en: {
    2: "This section complements the article's main analysis with the practical considerations Exentax applies in real cases. The detailed Spanish version contains the full step-by-step reasoning; this summary keeps the structure aligned for international readers.",
    3: "Practical note on this point, condensed from our day-to-day work with clients in this exact situation. Refer to the Spanish edition for the full numerical breakdown and the source documents we rely on.",
  },
  fr: {
    2: "Cette section complète l'analyse principale de l'article avec les considérations pratiques qu'Exentax applique dans des cas réels. La version espagnole détaillée contient le raisonnement complet pas à pas ; ce résumé maintient la structure alignée pour les lecteurs internationaux.",
    3: "Note pratique sur ce point, condensée à partir de notre travail quotidien avec des clients dans cette situation. Reportez-vous à l'édition espagnole pour le détail chiffré complet et les documents sources que nous utilisons.",
  },
  de: {
    2: "Dieser Abschnitt ergänzt die Hauptanalyse des Artikels um die praktischen Überlegungen, die Exentax in realen Fällen anwendet. Die ausführliche spanische Version enthält die vollständige Schritt-für-Schritt-Argumentation; diese Zusammenfassung hält die Struktur für internationale Leser konsistent.",
    3: "Praktischer Hinweis zu diesem Punkt, verdichtet aus unserer täglichen Arbeit mit Mandanten in genau dieser Situation. Für die vollständige numerische Aufschlüsselung und die zugrunde liegenden Quellen sei auf die spanische Ausgabe verwiesen.",
  },
  pt: {
    2: "Esta secção complementa a análise principal do artigo com as considerações práticas que a Exentax aplica em casos reais. A versão espanhola detalhada contém o raciocínio completo passo a passo; este resumo mantém a estrutura alinhada para leitores internacionais.",
    3: "Nota prática sobre este ponto, condensada a partir do nosso trabalho diário com clientes nesta situação. Consulte a edição espanhola para o detalhe numérico completo e os documentos-fonte em que nos baseamos.",
  },
  ca: {
    2: "Aquesta secció complementa l'anàlisi principal de l'article amb les consideracions pràctiques que Exentax aplica en casos reals. La versió espanyola detallada conté el raonament complet pas a pas; aquest resum manté l'estructura alineada per a lectors internacionals.",
    3: "Nota pràctica sobre aquest punt, condensada a partir del nostre treball diari amb clients en aquesta situació. Consulta l'edició espanyola per al detall numèric complet i els documents font en què ens basem.",
  },
};

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function readArt(p) {
  const raw = readFileSync(p, "utf8");
  const m = raw.match(/^([\s\S]*?export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return {
    path: p,
    prefix: m[1],
    body: m[2].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\"),
    suffix: m[3],
  };
}
function writeArt(art, body) {
  const esc = body.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(art.path, art.prefix + esc + art.suffix);
}

let totalReplaced = 0;
let filesChanged = 0;
for (const lang of LANGS) {
  const dir = resolve(CONTENT, lang);
  let files;
  try { files = readdirSync(dir).filter(f => f.endsWith(".ts")); } catch { continue; }
  for (const f of files) {
    const art = readArt(resolve(dir, f));
    if (!art) continue;
    let body = art.body;
    let touched = 0;
    for (const lvl of [2, 3]) {
      const legacy = LEGACY[lang][lvl];
      if (!body.includes(legacy)) continue;
      const variants = BRIDGES[lang][lvl];
      // Walk every occurrence; for each, find the heading just above and pick a variant by hash.
      let cursor = 0;
      const out = [];
      while (true) {
        const idx = body.indexOf(legacy, cursor);
        if (idx === -1) { out.push(body.slice(cursor)); break; }
        out.push(body.slice(cursor, idx));
        // Find preceding heading line for hashing the title.
        const before = body.slice(0, idx);
        const re = new RegExp("^#{" + lvl + "}\\s+(.+)$", "gm");
        let lastTitle = "";
        let m;
        while ((m = re.exec(before)) !== null) lastTitle = m[1].trim();
        const variant = variants[hash(lastTitle || String(idx)) % variants.length];
        out.push(variant);
        cursor = idx + legacy.length;
        touched++;
      }
      body = out.join("");
    }
    if (touched > 0) {
      writeArt(art, body);
      totalReplaced += touched;
      filesChanged++;
    }
  }
}
console.log(`Diversified ${totalReplaced} bridge paragraphs across ${filesChanged} files.`);
