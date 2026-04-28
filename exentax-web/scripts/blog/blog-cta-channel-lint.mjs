#!/usr/bin/env node
/**
 * blog-cta-channel-lint.mjs — drift detection for contact channels in blog content
 *
 * Single source of truth: `client/src/lib/constants.ts` exports `CONTACT.WHATSAPP_NUMBER`.
 * Blog content (`client/src/data/blog-content/<lang>/*.ts`) and i18n locales
 * (`client/src/i18n/locales/<lang>.ts`) embed `wa.me/<NUMBER>` URLs as static HTML
 * for SEO/SSR (pre-rendered into the article body).
 *
 * Risk: if `WHATSAPP_NUMBER` changes in `constants.ts`, the 666 inline CTAs and
 * 6 i18n locales must be updated in lockstep. This script detects drift:
 *  - reads canonical number from `constants.ts`
 *  - scans blog-content/* + i18n/locales/* for `wa.me/<digits>` patterns
 *  - reports any URL whose digits don't match canonical
 *
 * Companion: `scripts/blog/blog-cta-channel-update.mjs` does mass-replace if the
 * canonical number ever changes.
 *
 * Exit codes:
 *  0 — no drift
 *  1 — drift detected (report listed)
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// 1. Read canonical number from constants.ts
const constantsPath = join(ROOT, "client/src/lib/constants.ts");
const constants = readFileSync(constantsPath, "utf8");
const numMatch = constants.match(/WHATSAPP_NUMBER:\s*"([0-9]+)"/);
if (!numMatch) {
  console.error("[blog-cta-channel-lint] ERROR — could not extract WHATSAPP_NUMBER from constants.ts");
  process.exit(2);
}
const CANONICAL = numMatch[1];
console.log(`[blog-cta-channel-lint] canonical: wa.me/${CANONICAL}`);

// 2. Scan files for wa.me/<digits> patterns
const WA_RE = /wa\.me\/([0-9]+)/g;
const drift = [];

function scanFile(path) {
  const content = readFileSync(path, "utf8");
  let m;
  WA_RE.lastIndex = 0;
  while ((m = WA_RE.exec(content))) {
    if (m[1] !== CANONICAL) {
      const lineno = content.slice(0, m.index).split("\n").length;
      drift.push({ path: path.replace(ROOT + "/", ""), lineno, found: m[1] });
    }
  }
}

// blog-content/<lang>/*.ts
const blogRoot = join(ROOT, "client/src/data/blog-content");
for (const lang of ["es", "en", "fr", "de", "pt", "ca"]) {
  const dir = join(blogRoot, lang);
  let files;
  try { files = readdirSync(dir); } catch { continue; }
  for (const f of files) {
    if (f.endsWith(".ts")) scanFile(join(dir, f));
  }
}

// i18n/locales/<lang>.ts
const localesRoot = join(ROOT, "client/src/i18n/locales");
for (const lang of ["es", "en", "fr", "de", "pt", "ca"]) {
  scanFile(join(localesRoot, `${lang}.ts`));
}

// blog-cta-library.ts
try { scanFile(join(ROOT, "client/src/data/blog-cta-library.ts")); } catch {}

// blog-mid-cta-copy.ts
try { scanFile(join(ROOT, "client/src/data/blog-mid-cta-copy.ts")); } catch {}

// 3. Report
if (drift.length === 0) {
  console.log(`[blog-cta-channel-lint] ✓ all wa.me URLs match canonical (${CANONICAL})`);
  process.exit(0);
}

console.log(`[blog-cta-channel-lint] ✗ DRIFT detected: ${drift.length} non-canonical wa.me URLs`);
for (const d of drift.slice(0, 30)) {
  console.log(`  - ${d.path}:${d.lineno} → wa.me/${d.found} (expected ${CANONICAL})`);
}
if (drift.length > 30) console.log(`  ... and ${drift.length - 30} more`);
console.log(`\nFix with: node scripts/blog/blog-cta-channel-update.mjs`);
process.exit(1);
