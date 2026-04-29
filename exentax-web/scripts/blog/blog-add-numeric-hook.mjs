#!/usr/bin/env node
/**
 * LOTE 6 — Numeric hook injector.
 *
 * Reads the per-slug stat-lead database at
 * `scripts/blog/data/article-numeric-hooks.json` (112 slugs × 6 languages) and,
 * for every article whose first 100 tokens currently contain no digit, prepends
 * the topical stat sentence as a new opening paragraph in front of the existing
 * lead.
 *
 * Idempotent: articles whose first 100 tokens already contain a digit are left
 * untouched. Re-running the script is a no-op once every offender has been
 * patched.
 *
 * Usage:
 *   node scripts/blog/blog-add-numeric-hook.mjs           # apply
 *   node scripts/blog/blog-add-numeric-hook.mjs --dry-run # preview only
 *   node scripts/blog/blog-add-numeric-hook.mjs --lang es # restrict to one lang
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const CONTENT_ROOT = path.join(PROJECT_ROOT, "client", "src", "data", "blog-content");
const HOOKS_PATH = path.join(__dirname, "data", "article-numeric-hooks.json");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const langFilter = (() => {
  const idx = process.argv.indexOf("--lang");
  if (idx > 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();

const HOOKS = JSON.parse(fs.readFileSync(HOOKS_PATH, "utf8"));

function extractLead(body) {
  const beforeHeading = body.split(/^##\s/m)[0];
  const stripped = beforeHeading
    .replace(/<a [^>]*>/g, "")
    .replace(/<\/a>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.split(/\s+/).slice(0, 100).join(" ");
}

const summary = { patched: 0, skipped: 0, missingHook: [], byLang: {} };

for (const lang of LANGS) {
  if (langFilter && lang !== langFilter) continue;
  const dir = path.join(CONTENT_ROOT, lang);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.ts$/, "");
    const fp = path.join(dir, file);
    const raw = fs.readFileSync(fp, "utf8");
    const m = raw.match(/^(.*export default `)([\s\S]*?)(`;?\s*)$/);
    if (!m) {
      console.warn(`[skip] could not parse template literal in ${lang}/${file}`);
      summary.skipped += 1;
      continue;
    }
    const [, prefix, body, suffix] = m;
    const lead = extractLead(body);
    if (/\d/.test(lead)) {
      summary.skipped += 1;
      continue;
    }

    const langHooks = HOOKS[slug];
    if (!langHooks || !langHooks[lang]) {
      summary.missingHook.push(`${lang}/${file}`);
      continue;
    }
    const hook = langHooks[lang].trim();

    // Insert the hook as a brand-new opening paragraph. Preserve original
    // leading whitespace/newlines that follow `export default \``.
    const leadingWhitespace = body.match(/^\s*/)[0];
    const remainder = body.slice(leadingWhitespace.length);
    const newBody = `${leadingWhitespace}${hook}\n\n${remainder}`;
    const newRaw = `${prefix}${newBody}${suffix}`;

    if (!dryRun) {
      fs.writeFileSync(fp, newRaw, "utf8");
    }
    summary.patched += 1;
    summary.byLang[lang] = (summary.byLang[lang] || 0) + 1;
  }
}

console.log("=== LOTE 6 — Numeric hook injection ===");
console.log(`Mode: ${dryRun ? "dry-run" : "apply"}`);
console.log(`Patched: ${summary.patched}`);
console.log(`Skipped (already had a digit / unparseable): ${summary.skipped}`);
console.log("By language:", JSON.stringify(summary.byLang));
if (summary.missingHook.length > 0) {
  console.error("Missing hooks for:");
  for (const f of summary.missingHook) console.error(` - ${f}`);
  process.exit(2);
}
