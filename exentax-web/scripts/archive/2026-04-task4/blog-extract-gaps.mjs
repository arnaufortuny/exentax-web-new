#!/usr/bin/env node
// Extract per-pair list of ES headings missing from each target language.
// Output: .local/blog-gaps.json with [{slug, lang, missing:[{level, esTitle}]}].
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = resolve(ROOT, "client/src/data/blog-content");
const REPORT = resolve(ROOT, "reports/seo/blog-final-qa.json");
const OUT = resolve(ROOT, "../.local/blog-gaps.json");

function read(l, s) { return readFileSync(resolve(CONTENT, l, `${s}.ts`), "utf8"); }
function parse(raw) { const m = raw.match(/^[\s\S]*?export\s+default\s+`([\s\S]*)`\s*;?\s*$/); return m ? m[1].replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\") : ""; }
function heads(b) {
  const h = []; let i = 0;
  for (const line of b.split(/\n/)) {
    const m2 = line.match(/^##\s+(.+)$/), m3 = line.match(/^###\s+(.+)$/);
    if (m2) h.push({ level: 2, text: m2[1].trim(), idx: i });
    else if (m3) h.push({ level: 3, text: m3[1].trim(), idx: i });
    i++;
  }
  return h;
}
function norm(s) { return s.toLowerCase().replace(/[^a-zà-ÿ0-9]+/g, " ").trim(); }

const r = JSON.parse(readFileSync(REPORT, "utf8")).parityDeltas || [];
const out = [];
for (const d of r) {
  const es = heads(parse(read("es", d.slug)));
  const tg = heads(parse(read(d.lang, d.slug)));
  const tgSetByLevel = { 2: new Set(), 3: new Set() };
  for (const h of tg) tgSetByLevel[h.level].add(norm(h.text));
  const missing = [];
  for (const e of es) {
    if (!tgSetByLevel[e.level].has(norm(e.text))) missing.push({ level: e.level, esTitle: e.text });
  }
  if (missing.length) out.push({ slug: d.slug, lang: d.lang, missing });
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2));
const totalH2 = out.reduce((a, p) => a + p.missing.filter((m) => m.level === 2).length, 0);
const totalH3 = out.reduce((a, p) => a + p.missing.filter((m) => m.level === 3).length, 0);
console.log("Pairs with gaps:", out.length, "| missing H2:", totalH2, "| missing H3:", totalH3);
console.log("Wrote:", OUT);
