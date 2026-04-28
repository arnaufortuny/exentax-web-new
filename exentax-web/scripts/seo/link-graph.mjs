#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(ROOT, "client/src/data");
const CONTENT = path.join(DATA, "blog-content");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function parseSlugMap() {
  const src = readFile(path.join(DATA, "blog-posts-slugs.ts"));
  const map = {};
  const objStart = src.indexOf("{", src.indexOf("BLOG_SLUG_I18N"));
  const objEnd = src.indexOf("};", objStart);
  const body = src.slice(objStart, objEnd);
  const rx = /"([^"]+)":\s*\{([^}]+)\}/g;
  let m;
  while ((m = rx.exec(body))) {
    const es = m[1];
    const entries = {};
    const inner = /([a-z]{2}):\s*"([^"]+)"/g;
    let im;
    while ((im = inner.exec(m[2]))) entries[im[1]] = im[2];
    map[es] = entries;
  }
  return map;
}

export function parseLegacyMap() {
  const src = readFile(path.join(DATA, "blog-posts-slugs.ts"));
  const map = {};
  const declStart = src.indexOf("BLOG_SLUG_LEGACY_I18N");
  if (declStart < 0) return map;
  const objStart = src.indexOf("{", declStart);
  const objEnd = src.indexOf("};", objStart);
  const body = src.slice(objStart, objEnd);
  const rx = /"([^"]+)":\s*\{\s*es:\s*"([^"]+)",\s*lang:\s*"([a-z]{2})"\s*\}/g;
  let m;
  while ((m = rx.exec(body))) {
    map[m[1]] = { es: m[2], lang: m[3] };
  }
  return map;
}

function buildReverseMap(slugMap) {
  const rev = {};
  for (const lang of LANGS) rev[lang] = {};
  for (const es of Object.keys(slugMap)) {
    rev.es[es] = es;
    for (const l of ["en", "fr", "de", "pt", "ca"]) {
      const t = slugMap[es][l];
      if (t) rev[l][t] = es;
    }
  }
  return rev;
}

// Parse a per-article file. Each file is `export default \`...\`;`
// Returns { bodyStart, bodyEnd, body, src } relative to the file.
export function parseArticleFile(p) {
  const src = readFile(p);
  const tickStart = src.indexOf("`");
  if (tickStart < 0) throw new Error("No backtick in " + p);
  let i = tickStart + 1;
  while (i < src.length) {
    if (src[i] === "\\") { i += 2; continue; }
    if (src[i] === "`") break;
    i++;
  }
  return { src, bodyStart: tickStart + 1, bodyEnd: i, body: src.slice(tickStart + 1, i) };
}

export function articleFiles(lang) {
  const dir = path.join(CONTENT, lang);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts")).sort();
  return files.map((f) => ({ slug: f.replace(/\.ts$/, ""), file: path.join(dir, f) }));
}

function parseContent(lang) {
  const contents = {};
  for (const { slug, file } of articleFiles(lang)) {
    const { body } = parseArticleFile(file);
    contents[slug] = body;
  }
  return contents;
}

function extractLinks(body) {
  const links = [];
  const rxHref = /<a[^>]*href="\/([a-z]{2})\/blog\/([^"#?]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = rxHref.exec(body))) {
    links.push({ linkLang: m[1], slug: m[2].replace(/\/$/, ""), anchor: m[3].replace(/<[^>]+>/g, "").trim() });
  }
  const rxMd = /\[([^\]]+)\]\(\/([a-z]{2})\/blog\/([^)#?]+)\)/g;
  while ((m = rxMd.exec(body))) {
    links.push({ linkLang: m[2], slug: m[3].replace(/\/$/, ""), anchor: m[1] });
  }
  return links;
}

export function computeGraph() {
  const slugMap = parseSlugMap();
  const reverse = buildReverseMap(slugMap);
  const allEsSlugs = Object.keys(slugMap);

  const incomingPerLang = {};
  const incomingTotal = {};
  const outgoingPerLang = {};
  const bySourcePerLang = {};

  for (const es of allEsSlugs) incomingTotal[es] = 0;

  for (const lang of LANGS) {
    incomingPerLang[lang] = {};
    outgoingPerLang[lang] = {};
    bySourcePerLang[lang] = {};
    for (const es of allEsSlugs) incomingPerLang[lang][es] = 0;

    const contents = parseContent(lang);
    for (const [slugInLang, body] of Object.entries(contents)) {
      const srcEs = reverse[lang][slugInLang] || slugInLang;
      outgoingPerLang[lang][srcEs] = {};
      bySourcePerLang[lang][srcEs] = [];

      const links = extractLinks(body);
      for (const lk of links) {
        const tgtEs = reverse[lk.linkLang]?.[lk.slug] || lk.slug;
        if (!allEsSlugs.includes(tgtEs)) continue;
        if (tgtEs === srcEs) continue;
        outgoingPerLang[lang][srcEs][tgtEs] = (outgoingPerLang[lang][srcEs][tgtEs] || 0) + 1;
        bySourcePerLang[lang][srcEs].push({ target: tgtEs, anchor: lk.anchor });
      }
    }

    for (const src of Object.keys(outgoingPerLang[lang])) {
      for (const tgt of Object.keys(outgoingPerLang[lang][src])) {
        incomingPerLang[lang][tgt] = (incomingPerLang[lang][tgt] || 0) + 1;
      }
    }
  }

  for (const es of allEsSlugs) incomingTotal[es] = incomingPerLang.es[es] || 0;

  return { slugMap, reverse, allEsSlugs, incomingPerLang, incomingTotal, outgoingPerLang, bySourcePerLang };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const g = computeGraph();
  const sorted = [...g.allEsSlugs].sort((a, b) => g.incomingTotal[a] - g.incomingTotal[b]);
  console.log("# Link graph (Spanish content)\n");
  console.log("Incoming links per article (from distinct source articles, ES content only):\n");
  for (const s of sorted) console.log(`${g.incomingTotal[s].toString().padStart(3)}  ${s}`);
  const orphans = sorted.filter((s) => g.incomingTotal[s] < 3);
  const hot = sorted.filter((s) => g.incomingTotal[s] > 10);
  console.log(`\nUnder-linked (<3): ${orphans.length}`);
  console.log(`Over-concentrated (>10): ${hot.length}`);
}
