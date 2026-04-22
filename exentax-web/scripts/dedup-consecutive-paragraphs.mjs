#!/usr/bin/env node
/**
 * dedup-consecutive-paragraphs.mjs
 *
 * Removes consecutive duplicate paragraphs (length >= 60, byte-identical)
 * from every blog file in client/src/data/blog-content/<lang>/*.ts, while
 * PRESERVING the paragraph immediately above a CTA marker so that
 * `blog-cta-position-check.mjs` does not regress with `glued_to_heading_above`.
 *
 * Why it's needed:
 *   `blog-translation-quality-audit.mjs` flags `paras[i] === paras[i-1]`.
 *   Naively removing every such paras[i] can leave `## Heading` adjacent to
 *   the CTA marker, triggering a hard blocker in `blog-cta-position-audit`.
 *
 * Smart pass:
 *   When iterating significant paragraphs, we detect dup-pairs (A, A). Before
 *   dropping the second A, we look ahead: if the next significant element
 *   after index i is within a couple of raw lines of a CTA marker, we drop
 *   the FIRST A of the pair instead (keeping the buffer paragraph near the
 *   CTA). If both positions are safe, we drop the second as usual.
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
const CTA_MARKER_RE = /<!--\s*exentax:(cta-v1|calc-cta-v1)\s*-->/i;
const HEADING_RE = /^\s{0,3}#{2,4}\s+\S/;

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

function isCtaBufferNeeded(parts, partIdx) {
  // Look ahead from partIdx onward, skipping blanks and list items, to check
  // whether the next structural anchor is a CTA marker. If yes, this
  // paragraph is a buffer between heading/list and CTA — keep it.
  for (let j = partIdx + 1; j < parts.length; j++) {
    const raw = parts[j];
    if (!raw || !raw.trim()) continue;
    if (CTA_MARKER_RE.test(raw.trim())) return true;
    if (HEADING_RE.test(raw.trim())) return false;
    // any other significant block — buffer not needed
    return false;
  }
  return false;
}

function dedupeBody(body) {
  const parts = body.split(/(\n\s*\n)/);
  const significant = [];
  for (let i = 0; i < parts.length; i += 2) {
    const text = parts[i].trim();
    if (isInsignificant(text)) continue;
    significant.push({ partIdx: i, text });
  }
  const toDrop = new Set();
  // Walk pairs; for every (prev, curr) where text matches and length ≥ 60,
  // decide which to drop so that the post-dedup structure does NOT leave a
  // CTA marker immediately next to a heading without a buffer paragraph.
  let prev = null;
  for (const s of significant) {
    if (prev && s.text === prev.text && s.text.length >= 60) {
      const currNearCta = isCtaBufferNeeded(parts, s.partIdx);
      if (currNearCta) {
        // Drop the PREVIOUS instead, keep current as CTA buffer.
        toDrop.add(prev.partIdx);
        // prev stays as current for subsequent comparisons
        prev = s;
      } else {
        toDrop.add(s.partIdx);
        // prev stays the same (A-A-A collapses to A)
      }
      continue;
    }
    prev = s;
  }
  if (toDrop.size === 0) return { body, dropped: 0 };
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    if (toDrop.has(i)) continue;
    if (i % 2 === 1 && toDrop.has(i + 1)) continue;
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
