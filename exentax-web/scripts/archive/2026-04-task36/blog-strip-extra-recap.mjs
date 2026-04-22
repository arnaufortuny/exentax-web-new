#!/usr/bin/env node
/*
 * blog-strip-extra-recap.mjs — Task #20 (no external AI)
 *
 * Many non-ES articles inherited a trailing recap section ("Next steps",
 * "Conclusion", "Próximos pasos", "Nächste Schritte", …) that was never in
 * the ES master. That extra heading is the single root cause of structural
 * delta in 128 (slug × lang) pairs.
 *
 * This script:
 *   1. Iterates every (slug, lang) where the lang body has a recap-style
 *      heading and the ES body does NOT have any equivalent recap heading.
 *   2. Deletes the recap heading + its body up to the next heading or
 *      structural marker (whichever comes first).
 *   3. Writes the file back. Idempotent: re-runs are no-ops.
 *
 * Validation: re-run `npm run blog:final-qa` and expect Structural deltas
 * to drop by ~128.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "client/src/data/blog-content");
const LANGS = ["en", "fr", "de", "pt", "ca"];

const RECAP_RE =
  /^(?:next steps|conclusion|conclusión|conclusió|conclusió final|fazit|conclusão|próximos pasos|prochaines étapes|n[äa]chste schritte|próximos passos|propers passos)$/i;

function readArticle(lang, slug) {
  const p = resolve(CONTENT_DIR, lang, `${slug}.ts`);
  const raw = readFileSync(p, "utf8");
  const m = raw.match(/^([\s\S]*?export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return {
    path: p,
    prefix: m[1],
    body: m[2].replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\\/g, "\\"),
    suffix: m[3],
  };
}
function writeArticle(art, newBody) {
  const escaped = newBody.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(art.path, art.prefix + escaped + art.suffix);
}
function headingLines(body) {
  const lines = body.split(/\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m2 = lines[i].match(/^##\s+(.+)$/);
    const m3 = lines[i].match(/^###\s+(.+)$/);
    if (m3) out.push({ idx: i, level: 3, text: m3[1].trim() });
    else if (m2) out.push({ idx: i, level: 2, text: m2[1].trim() });
  }
  return out;
}
function esHasRecap(esBody) {
  return headingLines(esBody).some((h) => RECAP_RE.test(h.text));
}
function findExtraRecap(targetBody) {
  const heads = headingLines(targetBody);
  for (const h of heads) {
    if (RECAP_RE.test(h.text)) return h;
  }
  return null;
}
function nextBoundary(lines, fromIdx) {
  for (let i = fromIdx; i < lines.length; i++) {
    const t = lines[i];
    if (/^##\s+/.test(t)) return i;
    if (/^###\s+/.test(t)) return i;
    if (/^<!--\s*exentax:[a-z0-9-]+\s*-->/.test(t)) return i;
  }
  return lines.length;
}
function stripSection(body, headIdx) {
  const lines = body.split(/\n/);
  const end = nextBoundary(lines, headIdx + 1);
  // Remove [headIdx, end). Also trim a trailing blank line before head.
  let start = headIdx;
  while (start > 0 && lines[start - 1].trim() === "") start--;
  lines.splice(start, end - start);
  return lines.join("\n");
}

const ES_SLUGS = readdirSync(resolve(CONTENT_DIR, "es"))
  .filter((f) => f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

let scanned = 0, stripped = 0, skipped = 0;
const log = [];
for (const slug of ES_SLUGS) {
  const es = readArticle("es", slug);
  if (!es) continue;
  const esRecap = esHasRecap(es.body);
  for (const lang of LANGS) {
    const art = readArticle(lang, slug);
    if (!art) continue;
    scanned++;
    if (esRecap) { skipped++; continue; }
    const extra = findExtraRecap(art.body);
    if (!extra) { skipped++; continue; }
    // Gate: only strip if removing this heading actually reduces the
    // structural delta (i.e. target currently has more H{level} than ES).
    const esHeads = headingLines(es.body);
    const tgtHeads = headingLines(art.body);
    const esCount = esHeads.filter((h) => h.level === extra.level).length;
    const tgtCount = tgtHeads.filter((h) => h.level === extra.level).length;
    if (tgtCount <= esCount) { skipped++; continue; }
    const newBody = stripSection(art.body, extra.idx);
    writeArticle(art, newBody);
    stripped++;
    log.push(`${lang}/${slug}: removed H${extra.level} "${extra.text}"`);
  }
}

console.log(`Scanned: ${scanned} pairs`);
console.log(`Stripped: ${stripped}`);
console.log(`Skipped:  ${skipped}`);
if (log.length) {
  console.log(`\nFirst 20 strips:`);
  for (const l of log.slice(0, 20)) console.log("  " + l);
  if (log.length > 20) console.log(`  …+${log.length - 20}`);
}
console.log(`\nNext: npm run blog:final-qa`);
