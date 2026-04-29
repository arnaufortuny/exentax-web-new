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
 * Yearly refresh (Task #39): when figures in the JSON are bumped to the new
 * tax year (IRPF brackets, RETA quotas, IRS penalty inflation adjustments,
 * state filing fees, etc.), `--replace-existing` swaps the previously-injected
 * opening sentence for the new one in a single pass.
 *
 * The flag detects "the previously-injected opener" by looking at the first
 * \n\n-delimited paragraph of the article body. To avoid clobbering legitimate
 * native leads that happen to be short and start with a digit, --replace-existing
 * requires either:
 *   - --slug <slug>          per-slug surgical swap (recommended; only the
 *                            named slug × all languages, or × the language
 *                            given by --lang)
 *   - --all                  bulk swap across the whole corpus (only run this
 *                            after a major-year refresh of the JSON, e.g.
 *                            January after IRPF/RETA tables published)
 *
 * In both cases the swap is gated on the first paragraph being short
 * (≤ 600 chars) and containing a digit — i.e., recognisably a prior hook.
 * Long native leads are skipped with a counter so you can tell what was
 * untouched.
 *
 * Usage:
 *   node scripts/blog/blog-add-numeric-hook.mjs                                # default insert
 *   node scripts/blog/blog-add-numeric-hook.mjs --dry-run                      # preview only
 *   node scripts/blog/blog-add-numeric-hook.mjs --lang es                      # restrict to one lang
 *   node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --slug cuota-autonomo-2026
 *   node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --all --dry-run
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
const replaceExisting = args.has("--replace-existing");
const allFlag = args.has("--all");
const langFilter = (() => {
  const idx = process.argv.indexOf("--lang");
  if (idx > 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();
const slugFilter = (() => {
  const idx = process.argv.indexOf("--slug");
  if (idx > 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();
const REPLACE_MAX_CHARS = 600;

if (replaceExisting && !slugFilter && !allFlag) {
  console.error(
    "ERROR: --replace-existing requires either --slug <slug> (recommended) or --all (bulk).",
  );
  console.error(
    "Bulk usage example: node scripts/blog/blog-add-numeric-hook.mjs --replace-existing --all --dry-run",
  );
  process.exit(2);
}

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

const summary = {
  patched: 0,
  replaced: 0,
  skipped: 0,
  skippedNoChange: 0,
  skippedLongLead: 0,
  missingHook: [],
  byLang: {},
};

for (const lang of LANGS) {
  if (langFilter && lang !== langFilter) continue;
  const dir = path.join(CONTENT_ROOT, lang);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.ts$/, "");
    if (slugFilter && slug !== slugFilter) continue;
    const fp = path.join(dir, file);
    const raw = fs.readFileSync(fp, "utf8");
    const m = raw.match(/^(.*export default `)([\s\S]*?)(`;?\s*)$/);
    if (!m) {
      console.warn(`[skip] could not parse template literal in ${lang}/${file}`);
      summary.skipped += 1;
      continue;
    }
    const [, prefix, body, suffix] = m;

    const langHooks = HOOKS[slug];
    if (!langHooks || !langHooks[lang]) {
      // Article exists on disk but no hook is defined for this lang — report
      // it as missing only if the article has no digit lead either (otherwise
      // it has its own native numeric opener and does not need one from us).
      const lead = extractLead(body);
      if (!/\d/.test(lead)) summary.missingHook.push(`${lang}/${file}`);
      else summary.skipped += 1;
      continue;
    }
    const hook = langHooks[lang].trim();
    const leadingWhitespace = body.match(/^\s*/)[0];
    const remainder = body.slice(leadingWhitespace.length);

    if (replaceExisting) {
      // The injector always inserts as `${hook}\n\n${rest}`, so the first
      // \n\n-delimited paragraph IS the prior hook (when one exists).
      const splitIdx = remainder.indexOf("\n\n");
      const firstPara = splitIdx >= 0 ? remainder.slice(0, splitIdx) : remainder;
      const restOfBody = splitIdx >= 0 ? remainder.slice(splitIdx + 2) : "";
      const firstParaTrim = firstPara.trim();

      // Already on the new value — nothing to do.
      if (firstParaTrim === hook) {
        summary.skippedNoChange += 1;
        continue;
      }

      // Heuristic: a previously-injected opener is short and contains a
      // digit. A long, no-digit paragraph is the article's real lead and we
      // refuse to clobber it under --replace-existing — fall through to the
      // default "insert if missing" path below instead.
      const looksLikeInjectedOpener =
        firstPara.length <= REPLACE_MAX_CHARS && /\d/.test(firstPara);

      if (looksLikeInjectedOpener) {
        const newBody = `${leadingWhitespace}${hook}\n\n${restOfBody}`;
        if (!dryRun) fs.writeFileSync(fp, `${prefix}${newBody}${suffix}`, "utf8");
        summary.replaced += 1;
        summary.byLang[lang] = (summary.byLang[lang] || 0) + 1;
        continue;
      }

      // First paragraph is a long native lead — only inject if there is no
      // digit anywhere in the first 100 tokens (i.e., behave like default).
      const lead = extractLead(body);
      if (/\d/.test(lead)) {
        summary.skippedLongLead += 1;
        continue;
      }
      const newBody = `${leadingWhitespace}${hook}\n\n${remainder}`;
      if (!dryRun) fs.writeFileSync(fp, `${prefix}${newBody}${suffix}`, "utf8");
      summary.patched += 1;
      summary.byLang[lang] = (summary.byLang[lang] || 0) + 1;
      continue;
    }

    // Default mode: insert only when the lead has no digit.
    const lead = extractLead(body);
    if (/\d/.test(lead)) {
      summary.skipped += 1;
      continue;
    }
    const newBody = `${leadingWhitespace}${hook}\n\n${remainder}`;
    if (!dryRun) fs.writeFileSync(fp, `${prefix}${newBody}${suffix}`, "utf8");
    summary.patched += 1;
    summary.byLang[lang] = (summary.byLang[lang] || 0) + 1;
  }
}

console.log("=== LOTE 6 — Numeric hook injection ===");
console.log(`Mode: ${dryRun ? "dry-run" : "apply"}${replaceExisting ? " (replace-existing)" : ""}`);
console.log(`Patched (fresh insert): ${summary.patched}`);
if (replaceExisting) {
  console.log(`Replaced (swapped obsolete opener): ${summary.replaced}`);
  console.log(`Skipped — already on latest hook: ${summary.skippedNoChange}`);
  console.log(`Skipped — long native lead, won't clobber: ${summary.skippedLongLead}`);
}
console.log(`Skipped (already had a digit / unparseable / no hook needed): ${summary.skipped}`);
console.log("By language:", JSON.stringify(summary.byLang));
if (summary.missingHook.length > 0) {
  console.error("Missing hooks for:");
  for (const f of summary.missingHook) console.error(` - ${f}`);
  process.exit(2);
}
