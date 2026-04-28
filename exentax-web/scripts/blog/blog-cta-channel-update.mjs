#!/usr/bin/env node
/**
 * blog-cta-channel-update.mjs — mass-update contact channels across blog + i18n
 *
 * Use case: WhatsApp number changes in `client/src/lib/constants.ts`. Run this
 * to update all references in blog-content/* + i18n/locales/* + helper files
 * to the new canonical number. Idempotent: re-running with the canonical
 * already in place is a no-op.
 *
 * Procedure:
 *  1. Reads canonical from `constants.ts`
 *  2. Scans target files for `wa.me/<digits>` and `tel:+<digits>` URLs
 *  3. Replaces ALL occurrences with the canonical number
 *  4. Reports counts per file
 *
 * Safety:
 *  - Dry-run by default (no writes). Pass `--apply` to actually write.
 *  - Operates only on a strict allowlist of file types (.ts) under known paths.
 *
 * Exit codes:
 *  0 — done (or no changes needed in dry-run)
 *  1 — error reading canonical
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const APPLY = process.argv.includes("--apply");

// 1. Canonical
const constantsPath = join(ROOT, "client/src/lib/constants.ts");
const constants = readFileSync(constantsPath, "utf8");
const numMatch = constants.match(/WHATSAPP_NUMBER:\s*"([0-9]+)"/);
if (!numMatch) {
  console.error("[blog-cta-channel-update] ERROR — could not extract WHATSAPP_NUMBER");
  process.exit(1);
}
const CANONICAL = numMatch[1];
console.log(`[blog-cta-channel-update] canonical: ${CANONICAL} ${APPLY ? "[APPLY mode]" : "[DRY-RUN]"}`);

// 2. Targets
const TARGETS = [];
const blogRoot = join(ROOT, "client/src/data/blog-content");
for (const lang of ["es", "en", "fr", "de", "pt", "ca"]) {
  const dir = join(blogRoot, lang);
  try {
    for (const f of readdirSync(dir)) {
      if (f.endsWith(".ts")) TARGETS.push(join(dir, f));
    }
  } catch {}
}
const localesRoot = join(ROOT, "client/src/i18n/locales");
for (const lang of ["es", "en", "fr", "de", "pt", "ca"]) {
  TARGETS.push(join(localesRoot, `${lang}.ts`));
}
TARGETS.push(join(ROOT, "client/src/data/blog-cta-library.ts"));
TARGETS.push(join(ROOT, "client/src/data/blog-mid-cta-copy.ts"));

// 3. Scan & replace
const WA_RE = /wa\.me\/([0-9]+)/g;
const TEL_RE = /tel:\+?([0-9]+)/g;

let totalChanges = 0;
const filesChanged = [];

for (const path of TARGETS) {
  let content;
  try { content = readFileSync(path, "utf8"); } catch { continue; }

  let changes = 0;
  // wa.me/<digits>
  const newContent = content
    .replace(WA_RE, (full, digits) => {
      if (digits === CANONICAL) return full;
      changes++;
      return `wa.me/${CANONICAL}`;
    })
    .replace(TEL_RE, (full, digits) => {
      if (digits === CANONICAL) return full;
      changes++;
      return `tel:+${CANONICAL}`;
    });

  if (changes > 0) {
    filesChanged.push({ path: path.replace(ROOT + "/", ""), changes });
    totalChanges += changes;
    if (APPLY) writeFileSync(path, newContent, "utf8");
  }
}

console.log(`\n${APPLY ? "Applied" : "Would apply"}: ${totalChanges} changes in ${filesChanged.length} files`);
for (const f of filesChanged.slice(0, 30)) {
  console.log(`  - ${f.path}: ${f.changes} change(s)`);
}
if (filesChanged.length > 30) console.log(`  ... and ${filesChanged.length - 30} more`);

if (!APPLY && totalChanges > 0) {
  console.log(`\nRe-run with --apply to actually write the changes.`);
}
process.exit(0);
