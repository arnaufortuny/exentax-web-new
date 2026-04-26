#!/usr/bin/env node
/*
 * blog-no-inline-related.mjs
 * ----------------------------------------------------------------------------
 * Guard linter (Task #30): blog post bodies must NEVER contain an inline
 * "Related Reading" / "Lecturas relacionadas" / "Weiterführende Lektüre"
 * heading. The single canonical block is the React `RelatedReadsBlock`
 * grid rendered at the bottom of every article by
 * `client/src/pages/blog/post.tsx`. If a heading like the ones below shows
 * up inside the markdown body, the reader sees TWO related-articles
 * sections back-to-back. This script fails the build to prevent that
 * regression from ever shipping again.
 *
 * Usage:
 *   node scripts/blog-no-inline-related.mjs           # exit 0 / 1
 *   node scripts/blog-no-inline-related.mjs --json    # machine-readable
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "client", "src", "data", "blog-content");
const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];

export const FORBIDDEN_HEADINGS = [
  // es
  "Lecturas relacionadas",
  "Otros artículos",
  "Lectura relacionada",
  "Para profundizar",
  // en
  "Related Reading",
  "Related Articles",
  "Related Guides",
  "Further Reading",
  "Further Related Reading",
  "For Further Reading",
  // fr
  "Lectures connexes",
  "Articles connexes",
  "Articles liés",
  "Pour aller plus loin",
  // de
  "Weiterführende Lektüre",
  "Verwandte Artikel",
  "Verwandte Lektüre",
  "Mehr zum Thema",
  // pt
  "Leituras relacionadas",
  "Artigos relacionados",
  "Para aprofundar",
  // ca
  "Lectures relacionades",
  "Lectures relacionades addicionals",
  "Articles relacionats",
  "Per aprofundir",
];

const escaped = FORBIDDEN_HEADINGS.map((h) =>
  h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");
// Match a markdown heading line whose text starts with one of the
// forbidden phrases (with optional trailing words/punctuation).
export const HEADING_RE = new RegExp(
  `^(#{1,6})\\s+(?:${escaped})\\b[^\\n]*$`,
  "i",
);
// Match a "bold paragraph marker" variant at the start of a line, e.g.
// `**Lecturas relacionadas:** ...`. The italic legitimate sentence the
// cleaner inserts (`_Para ampliar en la misma serie: ..._`) is NOT
// caught because it starts with `_`, not `**`.
export const BOLD_PARA_RE = new RegExp(
  `^\\*\\*\\s*(?:${escaped})\\s*:?\\s*\\*\\*`,
  "i",
);

export function listContentFiles() {
  const files = [];
  for (const loc of LOCALES) {
    const dir = path.join(CONTENT_DIR, loc);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".ts")) files.push(path.join(dir, name));
    }
  }
  return files;
}

export function findOffenders() {
  const offenders = [];
  for (const file of listContentFiles()) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (HEADING_RE.test(lines[i])) {
        offenders.push({
          file: path.relative(ROOT, file),
          line: i + 1,
          heading: lines[i].trim(),
          kind: "heading",
        });
      } else if (BOLD_PARA_RE.test(lines[i])) {
        offenders.push({
          file: path.relative(ROOT, file),
          line: i + 1,
          heading: lines[i].trim().slice(0, 200),
          kind: "bold-paragraph",
        });
      }
    }
  }
  return offenders;
}

function main() {
  const json = process.argv.includes("--json");
  const offenders = findOffenders();
  if (json) {
    console.log(JSON.stringify({ ok: offenders.length === 0, offenders }, null, 2));
  } else {
    if (offenders.length === 0) {
      console.log("✓ blog-no-inline-related: 0 inline related-reading headings in blog body content.");
      process.exit(0);
    }
    console.error(`✖ blog-no-inline-related: ${offenders.length} forbidden inline heading(s) found.`);
    console.error("  The canonical Related Articles grid is rendered by client/src/pages/blog/post.tsx (RelatedReadsBlock).");
    console.error("  Do NOT add inline 'related reading' / 'lecturas relacionadas' / 'weiterführende lektüre' sections in markdown body.");
    for (const o of offenders.slice(0, 50)) {
      console.error(`    ${o.file}:${o.line}  ${o.heading}`);
    }
    if (offenders.length > 50) console.error(`    … and ${offenders.length - 50} more`);
  }
  process.exit(offenders.length === 0 ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
