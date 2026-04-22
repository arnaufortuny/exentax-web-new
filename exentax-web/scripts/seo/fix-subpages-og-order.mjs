#!/usr/bin/env node
/**
 * Move every subpages `ogTitle:` line that sits immediately after `seo: {`
 * to the position right before the existing `ogDescription:` line, so that
 * `title:` and `description:` remain at their expected positions for
 * scripts/seo/verify-meta.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../../client/src/i18n/data/subpages.ts");

const src = readFileSync(FILE, "utf8");
const lines = src.split("\n");
const out = [];
const pendingTitles = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Detect the case where line i is `seo: {` followed immediately by an `ogTitle:` line.
  if (/^\s*seo:\s*\{\s*$/.test(line) && /^\s*ogTitle:/.test(lines[i + 1] || "")) {
    out.push(line); // keep "seo: {"
    pendingTitles.push(lines[i + 1]); // remember the ogTitle line
    i++; // skip the ogTitle line in the source
    continue;
  }
  // Insert pending ogTitle right before the `ogDescription:` line of the same block.
  if (pendingTitles.length && /^\s*ogDescription:/.test(line)) {
    out.push(pendingTitles.shift());
    out.push(line);
    continue;
  }
  out.push(line);
}
writeFileSync(FILE, out.join("\n"), "utf8");
console.log("Reordered ogTitle lines in subpages.ts");
