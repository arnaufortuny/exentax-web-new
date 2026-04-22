#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");

const BRIDGE_MARKERS = {
  en: "This section complements the article",
  fr: "Cette section complète l'analyse",
  de: "Dieser Abschnitt ergänzt die Hauptanalyse",
  pt: "Esta secção complementa a análise",
  ca: "Aquesta secció complementa l'anàlisi",
};
const BRIDGE_MARKERS_H3 = {
  en: "Practical note on this point",
  fr: "Note pratique sur ce point",
  de: "Praktischer Hinweis zu diesem Punkt",
  pt: "Nota prática sobre este ponto",
  ca: "Nota pràctica sobre aquest punt",
};

function readArticle(lang, slug) {
  const p = resolve(CONTENT, lang, `${slug}.ts`);
  const raw = readFileSync(p, "utf8");
  const m = raw.match(/^([\s\S]*?export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return { path: p, prefix: m[1],
    body: m[2].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\"),
    suffix: m[3] };
}
function writeArticle(art, body) {
  const e = body.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(art.path, art.prefix + e + art.suffix);
}
function countLvl(body, lvl) {
  return (body.match(new RegExp("^" + "#".repeat(lvl) + " ", "gm")) || []).length;
}
function listSlugs(lang) {
  return readdirSync(resolve(CONTENT, lang)).filter(f => f.endsWith(".ts")).map(f => f.replace(/\.ts$/, ""));
}

// Find injected blocks: heading + blank + bridge paragraph. Returns {lvl, start, end} array.
function findInjected(body, lang) {
  const lines = body.split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const lvl = m[1].length;
    // peek next non-empty line
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    if (j >= lines.length) continue;
    const next = lines[j];
    const marker = lvl === 2 ? BRIDGE_MARKERS[lang] : BRIDGE_MARKERS_H3[lang];
    if (marker && next.startsWith(marker)) {
      // block spans i..j (paragraph runs to next blank line)
      let k = j;
      while (k < lines.length && lines[k].trim() !== "") k++;
      blocks.push({ lvl, startLine: i, endLine: k - 1 });
    }
  }
  return blocks;
}

let totalRemoved = 0, pairsTouched = 0;
for (const lang of ["en", "fr", "de", "pt", "ca"]) {
  for (const slug of listSlugs(lang)) {
    const tg = readArticle(lang, slug);
    const es = readArticle("es", slug);
    if (!tg || !es) continue;
    const esH2 = countLvl(es.body, 2), esH3 = countLvl(es.body, 3);
    let tgH2 = countLvl(tg.body, 2), tgH3 = countLvl(tg.body, 3);
    let needRemoveH2 = Math.max(0, tgH2 - esH2);
    let needRemoveH3 = Math.max(0, tgH3 - esH3);
    if (!needRemoveH2 && !needRemoveH3) continue;
    const blocks = findInjected(tg.body, lang);
    // remove from the end (most recent first)
    const toRemove = [];
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      if (b.lvl === 2 && needRemoveH2 > 0) { toRemove.push(b); needRemoveH2--; }
      else if (b.lvl === 3 && needRemoveH3 > 0) { toRemove.push(b); needRemoveH3--; }
      if (!needRemoveH2 && !needRemoveH3) break;
    }
    if (!toRemove.length) continue;
    const lines = tg.body.split("\n");
    const drop = new Set();
    for (const b of toRemove) {
      for (let i = b.startLine; i <= b.endLine; i++) drop.add(i);
      // also drop a trailing blank line if present
      if (lines[b.endLine + 1] === "") drop.add(b.endLine + 1);
    }
    const newBody = lines.filter((_, i) => !drop.has(i)).join("\n");
    writeArticle(tg, newBody);
    totalRemoved += toRemove.length;
    pairsTouched++;
  }
}
console.log(`Trimmed ${totalRemoved} injected blocks across ${pairsTouched} pairs.`);
