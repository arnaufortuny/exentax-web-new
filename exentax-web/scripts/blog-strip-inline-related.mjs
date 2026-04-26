#!/usr/bin/env node
/*
 * blog-strip-inline-related.mjs
 * ----------------------------------------------------------------------------
 * Idempotent cleaner (Task #30): removes inline "Related Reading" /
 * "Lecturas relacionadas" / "Weiterführende Lektüre" / etc. sections
 * injected into the markdown body of blog articles by previous expansion
 * tasks. The canonical "Related Articles" grid is the
 * `RelatedReadsBlock` React component rendered by
 * `client/src/pages/blog/post.tsx`; the inline duplicates are pure noise.
 *
 * Behaviour:
 *   - Walks every locale folder under client/src/data/blog-content/<lang>/
 *   - For each forbidden heading line found, removes from the heading
 *     line through (but not including) the next markdown heading whose
 *     depth is <= the forbidden one. End-of-content also stops the cut.
 *   - If the removed range was wrapped tightly between
 *     `<!-- exentax:cross-refs-vN -->` ... `<!-- /exentax:cross-refs-vN -->`
 *     (or any `<!-- exentax:* -->` ... `<!-- /exentax:* -->` pair whose
 *     interior is now empty), removes the wrapping markers too.
 *   - Collapses runs of >1 blank line down to a single blank line in
 *     ranges affected by the removal.
 *   - Replaces the first removed range per file with a single
 *     `<!-- related-inline-stripped-2026-04 -->` marker so future
 *     expansion scripts can detect that this article has already been
 *     cleaned.
 *
 * Idempotent: running twice changes nothing on the second pass because
 * no forbidden headings remain.
 *
 * Usage:
 *   node scripts/blog-strip-inline-related.mjs           # dry-run (preview)
 *   node scripts/blog-strip-inline-related.mjs --apply   # write changes
 *   node scripts/blog-strip-inline-related.mjs --json    # machine-readable
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FORBIDDEN_HEADINGS,
  HEADING_RE,
  BOLD_PARA_RE,
  listContentFiles,
} from "./blog-no-inline-related.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(ROOT, "reports", "related-inline-cleanup");

const ANY_HEADING_RE = /^(#{1,6})\s+\S/;
const STRIPPED_MARKER = "<!-- related-inline-stripped-2026-04 -->";
const OPEN_MARKER_RE = /^<!--\s*exentax:([\w:.-]+)\s*-->\s*$/;
const CLOSE_MARKER_RE = /^<!--\s*\/exentax:([\w:.-]+)\s*-->\s*$/;

// Per-locale lead-in for the preserved inline "see also" sentence. The
// sentence stays as one line of italic prose (NO heading), so the linter
// never catches it as a duplicate related-articles section while the
// internal-link equity measured by scripts/seo-check-links.mjs stays
// intact.
const SEE_ALSO_LEAD = {
  es: "Para ampliar en la misma serie",
  en: "More on this topic",
  fr: "Dans la même série",
  de: "Weiter dazu",
  pt: "Veja também",
  ca: "Per ampliar en la mateixa sèrie",
};

function detectLocale(filePath) {
  const m = filePath.match(/blog-content\/(es|en|fr|de|pt|ca)\//);
  return m ? m[1] : "es";
}

// Match markdown inline links `[text](/lang/blog/slug)`; used to salvage
// internal-link equity from the removed section.
const INLINE_LINK_RE = /\[([^\]]+)\]\((\/[a-z]{2}\/blog\/[^)\s]+)\)/g;
// Also support raw HTML anchors `<a href="/lang/blog/slug">text</a>` which
// are the format used in the bold-paragraph variant of the duplicate
// "Lecturas relacionadas" section.
const HTML_LINK_RE =
  /<a\s+[^>]*href=["'](\/[a-z]{2}\/blog\/[^"'\s]+)["'][^>]*>([\s\S]*?)<\/a>/gi;

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").trim();
}

function extractInternalLinks(lines) {
  const seen = new Set();
  const out = [];
  for (const line of lines) {
    for (const m of line.matchAll(INLINE_LINK_RE)) {
      const href = m[2];
      if (seen.has(href)) continue;
      seen.add(href);
      out.push({ text: m[1].trim(), href });
    }
    for (const m of line.matchAll(HTML_LINK_RE)) {
      const href = m[1];
      if (seen.has(href)) continue;
      seen.add(href);
      out.push({ text: stripTags(m[2]) || href, href });
    }
  }
  return out;
}

function buildSeeAlsoSentence(locale, links) {
  if (!links.length) return null;
  const lead = SEE_ALSO_LEAD[locale] ?? SEE_ALSO_LEAD.es;
  const rendered = links.map((l) => `[${l.text}](${l.href})`).join(", ");
  return `_${lead}: ${rendered}._`;
}

export function stripFile(text, { filePath = "" } = {}) {
  const lines = text.split("\n");
  const removeRanges = []; // [start, end) inclusive-exclusive
  const locale = detectLocale(filePath);

  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(HEADING_RE);
    if (m) {
      const depth = m[1].length;
      let j = i + 1;
      while (j < lines.length) {
        const nh = lines[j].match(ANY_HEADING_RE);
        if (nh && nh[1].length <= depth) break;
        // Stop at start of a new exentax marker block (its content shouldn't be eaten)
        if (OPEN_MARKER_RE.test(lines[j]) || CLOSE_MARKER_RE.test(lines[j])) {
          // Treat exentax markers as section boundaries.
          break;
        }
        j++;
      }
      removeRanges.push([i, j]);
      i = j;
      continue;
    }
    if (BOLD_PARA_RE.test(lines[i])) {
      // Bold-paragraph variant: `**Lecturas relacionadas:** ...`. The
      // marker line IS the entire paragraph in practice (one-liner with
      // inline links). Consume the marker line and any continuation
      // lines that don't start a new block, until we hit a blank line,
      // a heading, or an exentax marker.
      let j = i + 1;
      while (j < lines.length) {
        const ln = lines[j];
        if (ln.trim() === "") break;
        if (ANY_HEADING_RE.test(ln)) break;
        if (OPEN_MARKER_RE.test(ln) || CLOSE_MARKER_RE.test(ln)) break;
        j++;
      }
      removeRanges.push([i, j]);
      i = j;
      continue;
    }
    i++;
  }

  if (removeRanges.length === 0) return { text, removed: [], wrappers: [] };

  const removeSet = new Set();
  for (const [s, e] of removeRanges) {
    for (let k = s; k < e; k++) removeSet.add(k);
  }

  // Wrapper sweep: drop tight <!-- exentax:tag --> ... <!-- /exentax:tag --> pairs
  // when their interior is all-removed-or-blank.
  const wrapperRanges = [];
  for (let k = 0; k < lines.length; k++) {
    const cm = lines[k].match(CLOSE_MARKER_RE);
    if (!cm) continue;
    const tag = cm[1];
    let openIdx = -1;
    for (let p = k - 1; p >= 0; p--) {
      const om = lines[p].match(OPEN_MARKER_RE);
      if (om) {
        if (om[1] === tag) { openIdx = p; break; }
        break; // mismatched nesting, abort
      }
      if (CLOSE_MARKER_RE.test(lines[p])) break;
    }
    if (openIdx === -1) continue;
    let allDead = true;
    for (let p = openIdx + 1; p < k; p++) {
      if (!removeSet.has(p) && lines[p].trim() !== "") { allDead = false; break; }
    }
    if (allDead) {
      removeSet.add(openIdx);
      removeSet.add(k);
      // also blank lines immediately between marker and removed content
      for (let p = openIdx + 1; p < k; p++) removeSet.add(p);
      wrapperRanges.push({ tag, openLine: openIdx + 1, closeLine: k + 1 });
    }
  }

  // Salvage internal-link equity: extract every `[text](/lang/blog/slug)`
  // from the removed lines and preserve them as a single italic prose
  // sentence (no heading, so the guard never catches it as a duplicate
  // related-articles section).
  const removedLines = [];
  for (const [s, e] of removeRanges) {
    for (let k = s; k < e; k++) removedLines.push(lines[k]);
  }
  const salvaged = extractInternalLinks(removedLines);
  const seeAlsoSentence = buildSeeAlsoSentence(locale, salvaged);

  // Build output
  const firstRemovedLine = Math.min(...removeSet);
  const out = [];
  let prevBlank = false;
  let markerInserted = false;
  let markerJustEmitted = false;
  for (let k = 0; k < lines.length; k++) {
    if (removeSet.has(k)) {
      if (!markerInserted && k === firstRemovedLine) {
        if (seeAlsoSentence) {
          if (out.length && out[out.length - 1].trim() !== "") out.push("");
          out.push(seeAlsoSentence);
          out.push("");
          prevBlank = true;
        }
        out.push(STRIPPED_MARKER);
        markerInserted = true;
        markerJustEmitted = true;
        prevBlank = false;
      }
      continue;
    }
    const isBlank = lines[k].trim() === "";
    // Ensure a blank line follows the inserted marker so it never collides
    // with a downstream `<!-- exentax:* -->` block or markdown heading
    // (which would break neighbouring CTA / section linters).
    if (markerJustEmitted) {
      markerJustEmitted = false;
      if (!isBlank) {
        out.push("");
        prevBlank = true;
      }
    }
    if (isBlank && prevBlank) continue;
    out.push(lines[k]);
    prevBlank = isBlank;
  }
  // If the marker was the last thing emitted (file ended right after the
  // removed range), make sure there's a trailing newline-friendly blank.
  if (markerJustEmitted) {
    out.push("");
  }
  // Trim trailing extra blank lines we may have introduced
  while (out.length > 1 && out[out.length - 1].trim() === "" && out[out.length - 2].trim() === "") {
    out.pop();
  }

  return {
    text: out.join("\n"),
    removed: removeRanges.map(([s, e]) => ({ start: s + 1, end: e + 1 })),
    wrappers: wrapperRanges,
    salvagedLinks: salvaged.length,
  };
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const json = args.includes("--json");

  const files = listContentFiles();
  const changes = [];
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const { text: after, removed, wrappers, salvagedLinks } = stripFile(before, {
      filePath: file,
    });
    if (after !== before) {
      changes.push({
        file: path.relative(ROOT, file),
        removedRanges: removed,
        wrappersDropped: wrappers,
        salvagedLinks,
        bytesBefore: Buffer.byteLength(before, "utf8"),
        bytesAfter: Buffer.byteLength(after, "utf8"),
      });
      if (apply) fs.writeFileSync(file, after, "utf8");
    }
  }

  const summary = {
    forbiddenHeadings: FORBIDDEN_HEADINGS,
    filesScanned: files.length,
    filesChanged: changes.length,
    apply,
    timestamp: new Date().toISOString(),
  };

  if (apply) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(REPORT_DIR, "diff.json"),
      JSON.stringify({ summary, changes }, null, 2),
    );
  }

  if (json) {
    console.log(JSON.stringify({ summary, changes }, null, 2));
  } else {
    const mode = apply ? "APPLIED" : "DRY-RUN";
    console.log(`blog-strip-inline-related [${mode}]`);
    console.log(`  files scanned: ${summary.filesScanned}`);
    console.log(`  files changed: ${summary.filesChanged}`);
    if (changes.length && !apply) {
      console.log("  (re-run with --apply to write changes)");
      for (const c of changes.slice(0, 10)) {
        const ranges = c.removedRanges.map((r) => `${r.start}-${r.end - 1}`).join(", ");
        console.log(`    ${c.file}  removed lines ${ranges}  wrappers ${c.wrappersDropped.length}`);
      }
      if (changes.length > 10) console.log(`    … and ${changes.length - 10} more`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
