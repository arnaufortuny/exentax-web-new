#!/usr/bin/env node
/**
 * One-time cleanup that strips the legacy "Sources:" line, the
 * "verified facts file is kept at `docs/banking-facts-2026.md`" intro
 * line and the "Documentos internos Exentax. docs/...md" bullets from
 * every article under client/src/data/blog-content/.
 *
 * The styled per-article Sources block is rendered at runtime by
 * post.tsx via SOURCES_BY_SLUG (see client/src/data/blog-sources.ts);
 * therefore the raw doc paths must not survive in the source markdown.
 *
 * Usage:
 *   node exentax-web/scripts/cleanup-blog-sources.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT_DIR = path.join(ROOT, "client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const PATTERNS = [
  // Legacy hardcoded "Sources:" line (all 6 language variants), with or
  // without trailing template-literal terminator (`;).
  /^(?:Sources|Sources \u00a0?|Fuentes|Quellen|Fontes|Fonts)\s*:\s*\\?`docs\/banking-facts-2026\.md\\?`[^\n]*\n?/gm,
  // The standalone "verified facts file is kept at `docs/...md`." intro
  // sentence in 6 languages. We match by the raw doc path inside backticks.
  /^[^\n]*\\?`docs\/banking-facts-2026\.md\\?`[^\n]*\n?/gm,
  // "- **Documentos internos Exentax.**  docs/...md..." bullets in the
  // ES "Fuentes oficiales" sections.
  /^- \*\*Documentos internos Exentax\.\*\* docs\/[^\n]+\n?/gm,
];

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fp);
    else if (entry.isFile() && entry.name.endsWith(".ts")) yield fp;
  }
}

async function main() {
  let changed = 0;
  let scanned = 0;
  for (const lang of LANGS) {
    const dir = path.join(CONTENT_DIR, lang);
    let stat;
    try { stat = await fs.stat(dir); } catch { continue; }
    if (!stat.isDirectory()) continue;
    for await (const fp of walk(dir)) {
      scanned += 1;
      const before = await fs.readFile(fp, "utf8");
      let after = before;
      for (const re of PATTERNS) after = after.replace(re, "");
      // Collapse the run of blank lines we may have introduced (>=3 newlines
      // in a row → single blank line).
      after = after.replace(/\n{3,}/g, "\n\n");
      if (after !== before) {
        await fs.writeFile(fp, after);
        changed += 1;
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log(`scanned=${scanned} changed=${changed}`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
