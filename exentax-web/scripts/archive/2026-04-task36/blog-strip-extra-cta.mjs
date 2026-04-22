#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = JSON.parse(readFileSync(resolve(ROOT, "reports/seo/blog-final-qa.json"), "utf8"));
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const MARKER_OPEN = "<!-- exentax:calc-cta-v1 -->";
const MARKER_CLOSE = "<!-- /exentax:calc-cta-v1 -->";

const CALC_LINK_RE = /<a\s+href="\/[a-z]{2}\/calc[a-z]*"[^>]*>([^<]+)<\/a>/gi;
const AGENDAR_LINK_RE = /<a\s+href="\/[a-z]{2}\/(?:agendar|book|reserver|reservar)"[^>]*>([^<]+)<\/a>/gi;

let stripped = 0;
const report = [];

for (const lang of LANGS) {
  const entries = Object.entries(REPORT.results[lang] || {}).filter(
    ([, v]) => v && v.ctaTotal !== 2,
  );
  for (const [slug, v] of entries) {
    const file = resolve(ROOT, `client/src/data/blog-content/${lang}/${slug}.ts`);
    let src;
    try {
      src = readFileSync(file, "utf8");
    } catch {
      report.push({ lang, slug, action: "SKIP (file not found)" });
      continue;
    }
    const before = src;
    const openIdx = src.indexOf(MARKER_OPEN);
    const closeIdx = src.indexOf(MARKER_CLOSE);
    if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
      const start = src.lastIndexOf("\n", openIdx) + 1;
      const end = closeIdx + MARKER_CLOSE.length;
      let endWithNl = end;
      while (src[endWithNl] === "\n") endWithNl++;
      const removed = src.slice(start, endWithNl);
      src = src.slice(0, start) + src.slice(endWithNl);
      report.push({ lang, slug, action: `REMOVED marker block (${removed.length} chars)` });
    } else {
      const matches = [];
      let m;
      CALC_LINK_RE.lastIndex = 0;
      while ((m = CALC_LINK_RE.exec(src)) !== null) {
        matches.push({ index: m.index, length: m[0].length, text: m[1], full: m[0] });
      }
      if (matches.length >= 2) {
        const second = matches[matches.length - 1];
        src =
          src.slice(0, second.index) +
          second.text +
          src.slice(second.index + second.length);
        report.push({
          lang,
          slug,
          action: `DELINKED 2nd calc occurrence "${second.text}"`,
        });
      } else if (v.ctaAgendar >= 2) {
        const aMatches = [];
        let am;
        AGENDAR_LINK_RE.lastIndex = 0;
        while ((am = AGENDAR_LINK_RE.exec(src)) !== null) {
          aMatches.push({ index: am.index, length: am[0].length, text: am[1], full: am[0] });
        }
        if (aMatches.length >= 2) {
          const first = aMatches[0];
          src =
            src.slice(0, first.index) +
            first.text +
            src.slice(first.index + first.length);
          report.push({
            lang,
            slug,
            action: `DELINKED 1st agendar occurrence "${first.text}"`,
          });
        } else {
          report.push({ lang, slug, action: `SKIP (agendar detection mismatch)` });
          continue;
        }
      } else {
        report.push({
          lang,
          slug,
          action: `SKIP (no marker, only ${matches.length} calc link)`,
        });
        continue;
      }
    }
    if (src !== before) {
      writeFileSync(file, src);
      stripped++;
    }
  }
}

console.log(`Files stripped: ${stripped}`);
for (const r of report) console.log(`  [${r.lang}] ${r.slug} — ${r.action}`);
