#!/usr/bin/env node
/**
 * dedup-consecutive-paragraphs.mjs
 *
 * Mirrors the detection logic of scripts/blog-translation-quality-audit.mjs
 * and removes (in-place) every duplicate paragraph so the audit reports 0.
 *
 * The audit filters blocks (headings, lists, exentax markers, <40 char blocks)
 * and then compares consecutive entries in the filtered list. Two "body"
 * paragraphs that are byte-identical and length ≥ 60 are flagged even when
 * separated by intervening headings/lists in the source.
 *
 * Strategy:
 *   1. Split the file body into blocks the same way the audit does.
 *   2. Iterate blocks, keeping only the "significant" ones in a secondary
 *      filtered list, and tracking each significant block's original index.
 *   3. For every duplicate consecutive significant block, drop the later one
 *      from the ORIGINAL block list.
 *   4. Rebuild the file body preserving separators.
 *
 * Safe: re-running is a no-op on clean files.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_ROOT = join(ROOT, "client/src/data/blog-content");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

function splitBody(content) {
  const m = content.match(/^(export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return { pre: m[1], body: m[2], post: m[3] };
}

function isInsignificant(trimmed) {
  if (!trimmed) return true;
  if (/^<!--\s*\/?exentax:[a-z0-9-]+\s*-->$/i.test(trimmed)) return true;
  if (trimmed.startsWith("#")) return true;
  if (/^[-*]\s/.test(trimmed)) return true;
  if (trimmed.length < 40) return true;
  return false;
}

function dedupeBody(body) {
  // parts = [block, sep, block, sep, ..., block]
  const parts = body.split(/(\n\s*\n)/);
  const significant = []; // { partIdx, text }
  for (let i = 0; i < parts.length; i += 2) {
    const text = parts[i].trim();
    if (isInsignificant(text)) continue;
    significant.push({ partIdx: i, text });
  }
  const toDrop = new Set();
  // Walk significant list — skip any already-dropped items when comparing.
  let prevText = null;
  for (const s of significant) {
    if (prevText !== null && s.text === prevText && s.text.length >= 60) {
      toDrop.add(s.partIdx);
      // prev stays the same (so A-A-A collapses to A, not A-A).
      continue;
    }
    prevText = s.text;
  }
  if (toDrop.size === 0) return { body, dropped: 0 };
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    if (toDrop.has(i)) continue;
    if (i % 2 === 1 && toDrop.has(i + 1)) continue; // drop separator before dropped block
    out.push(parts[i]);
  }
  return { body: out.join(""), dropped: toDrop.size };
}

function run() {
  let totalDropped = 0;
  let filesChanged = 0;
  for (const lang of LANGS) {
    const dir = join(BLOG_ROOT, lang);
    for (const f of readdirSync(dir).filter(x => x.endsWith(".ts"))) {
      const path = join(dir, f);
      const content = readFileSync(path, "utf8");
      const split = splitBody(content);
      if (!split) continue;
      const { body: newBody, dropped } = dedupeBody(split.body);
      if (dropped === 0) continue;
      writeFileSync(path, split.pre + newBody + split.post, "utf8");
      console.log(`  ${lang}/${f}: dropped ${dropped}`);
      totalDropped += dropped;
      filesChanged++;
    }
  }
  console.log(`\nTotal: ${totalDropped} paragraphs removed across ${filesChanged} files.`);
}

run();
