/**
 * find-hardcoded-strings.ts
 *
 * Scans every .tsx file under client/src and flags user-visible strings
 * that are NOT routed through `t()`. This complements
 * scripts/i18n/validate-i18n.ts which only validates strings that already
 * live in the locale bundles.
 *
 * Two classes of finding are produced:
 *
 *   1. JSX text nodes — literal text between tags.
 *      Example: <p>Empieza ahora</p>
 *
 *   2. Localised string-prop attributes — the same set already audited
 *      by validate-i18n.ts (title, alt, placeholder, aria-label) but
 *      with full file:line:col output and an explicit allowlist so the
 *      script can also be used as a triage tool, not just a CI gate.
 *
 * Brand strings, numbers/symbols only, single characters, and known
 * technical tokens are skipped via an allowlist. Anything inside a
 * `t(...)` call is also skipped because the parser strips JSX
 * expression containers (`{ ... }`) before scanning text nodes.
 *
 * Usage:
 *   npx tsx scripts/i18n/find-hardcoded-strings.ts            # full report
 *   npx tsx scripts/i18n/find-hardcoded-strings.ts --jsx      # text nodes only
 *   npx tsx scripts/i18n/find-hardcoded-strings.ts --attrs    # attributes only
 *   npx tsx scripts/i18n/find-hardcoded-strings.ts --json     # machine readable
 *   npx tsx scripts/i18n/find-hardcoded-strings.ts --strict   # exit 1 on any
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { dirname, resolve, relative } from "path";
import { fileURLToPath } from "url";

type Finding = {
  file: string;
  line: number;
  col: number;
  kind: "jsx-text" | "attr";
  attr?: string;
  value: string;
  snippet: string;
};

const args = new Set(process.argv.slice(2));
const wantJsx = args.has("--jsx") || (!args.has("--attrs") && !args.has("--jsx"));
const wantAttrs = args.has("--attrs") || (!args.has("--attrs") && !args.has("--jsx"));
const asJson = args.has("--json");
const strict = args.has("--strict");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const SRC = resolve(ROOT, "client/src");

// ─── Allowlists ─────────────────────────────────────────────────────
//
// Brand / proper-noun strings that are intentionally identical across
// every locale and therefore do NOT need to be wrapped in t(). Keep
// this list tight: when in doubt, route through t() instead.
const BRAND_ALLOWLIST = new Set<string>([
  "Exentax",
  "Trustpilot",
  "WhatsApp",
  "Calendly",
  "Stripe",
  "LinkedIn",
  "YouTube",
  "Instagram",
  "X",
  "Wyoming",
  "Delaware",
  "Florida",
  "New Mexico",
  "GmbH",
  "S.A.",
  "S.L.",
  "BOI",
  "ITIN",
  "EIN",
  "LLC",
  "USA",
  "EE.UU.",
  "EE. UU.",
  "IRS",
  "FinCEN",
  "PDF",
  "JSON",
  "API",
  "SaaS",
  "URL",
  "URLs",
  "FAQ",
  "FAQs",
  "OK",
  "ID",
  "EUR",
  "USD",
  "GBP",
  "CAD",
  "MXN",
  "COP",
  "ARS",
  "CLP",
  "info@exentax.com",
  "support@exentax.com",
  "hola@exentax.com",
  "Exentax LLC",
]);

// File-/line-level escape hatch. Add a comment containing this token to
// any line you want the scanner to skip. Useful for legitimately
// untranslatable inline strings (debug helpers, e2e harnesses, etc).
const ESCAPE_TOKEN = "i18n-ignore";

// Files ignored entirely (test harnesses, generated files, locale data).
const IGNORED_PATTERNS: RegExp[] = [
  /\.test\.tsx?$/,
  /\.spec\.tsx?$/,
  /\/i18n\/locales\//,
  /\/i18n\/keys\.generated\.ts$/,
  /\/__tests__\//,
];

// JSX attributes we care about (mirrors validate-i18n.ts plus a few
// commonly-missed ones). Anything that ends up rendered to a real user
// belongs here.
const LOCALISED_ATTRS = new Set([
  "title",
  "alt",
  "placeholder",
  "aria-label",
  "aria-description",
  "label",
]);

// Tags whose textual children are not user copy and should be ignored
// (script blocks, style blocks, raw HTML containers, etc).
const NON_TEXT_TAGS = new Set([
  "script",
  "style",
  "code",
  "pre",
  "noscript",
  "svg",
  "path",
  "rect",
  "circle",
  "polyline",
  "polygon",
  "g",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "filter",
]);

// ─── Walk client/src ────────────────────────────────────────────────

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = resolve(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (/\.tsx?$/.test(full)) {
      const rel = relative(ROOT, full);
      if (IGNORED_PATTERNS.some((re) => re.test(rel))) continue;
      out.push(full);
    }
  }
  return out;
}

// ─── Heuristics ─────────────────────────────────────────────────────

// Reject text that contains sequences only seen in JS/TS source code,
// never in real user copy. Single parentheses, dashes etc. are *fine*
// (real text such as "(LLC)" or "Empresa — guía" must pass), but
// operators like `=>`, `&&`, `===` and JS keywords are dead giveaways
// that the captured text is leaked source code rather than prose.
const CODE_NOISE_RE =
  /[{}\[\];=]|=>|&&|\|\||===|!==|\?\?|\.\.\.|\bconst\b|\blet\b|\bvar\b|\bfunction\b|\breturn\b|\bif\b|\belse\b|\bnull\b|\bundefined\b|\bimport\b|\bexport\b|\btypeof\b/;

function isLikelyUserVisible(value: string, kind: "jsx-text" | "attr"): boolean {
  const v = value.trim();
  if (!v) return false;
  if (v.length < 2) return false;
  if (BRAND_ALLOWLIST.has(v)) return false;
  // Numbers, money, percentages, punctuation/separators only
  if (/^[\d\s.,$€£%+\-/:•·–—]+$/.test(v)) return false;
  // CSS class names, snake_case identifiers — these contain `_` or `-`
  // and are clearly code tokens. Note we do NOT blanket-skip every
  // single-token string: legitimate one-word UI labels like "Blog",
  // "Menú", "Enviar", "Next" must still be reported when hardcoded.
  if (/^[a-z0-9]+([_-][a-z0-9]+)+$/i.test(v)) return false;
  // camelCase / PascalCase pure identifiers (no whitespace, no accents,
  // contain mixed case). A real word like "Empieza" or "Reservar" is
  // capitalised but otherwise all-lowercase letters and is allowed.
  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(v) && /[a-z][A-Z]|[A-Z]{2,}/.test(v)) {
    return false;
  }
  // URL/path-like
  if (/^(https?:|mailto:|tel:|#|\/[a-z0-9_/-]*)/i.test(v)) return false;
  // Single emoji / non-letter symbol
  if (!/[\p{L}]/u.test(v)) return false;
  // Pure HTML entities like "&nbsp;"
  if (/^&\w+;$/.test(v)) return false;
  // Backslash escapes are only ever code (regex literals, file paths,
  // escape sequences) — never real user copy.
  if (v.startsWith("\\") || v.startsWith("\\\\")) return false;
  // For JSX-text candidates, reject anything that smells like raw code.
  // (Attribute values are extracted by a precise regex and don't need
  // this filter — they can legitimately contain "()" etc.)
  if (kind === "jsx-text" && CODE_NOISE_RE.test(v)) return false;
  return true;
}

// ─── JSX text-node extraction ───────────────────────────────────────
//
// We strip everything that is NOT a JSX text node — comments, string
// literals, template literals, JSX expression containers (`{ ... }`),
// and the contents of NON_TEXT_TAGS — and then walk what is left
// looking for text segments that sit between JSX tags. This is a
// pragmatic, regex-style scanner; it intentionally errs on the side of
// false positives (which the BRAND_ALLOWLIST and isLikelyUserVisible
// filter out) rather than missing real violations.

function stripNonText(src: string): string {
  // Linear-time character walker. Replaces the contents of comments
  // (`/* … */`, `// …`), string literals (`"…"`, `'…'`) and template
  // literals (`` `…` ``) with whitespace while preserving file length
  // and line numbers. Implemented imperatively rather than via regex to
  // avoid catastrophic backtracking on long lines (Tailwind class
  // soup, inline `style={{ ... }}` blocks, etc).
  const out: string[] = new Array(src.length);
  let i = 0;
  const blank = (j: number) => {
    out[j] = src[j] === "\n" ? "\n" : " ";
  };
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (c === "/" && next === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end < 0 ? src.length : end + 2;
      for (let j = i; j < stop; j++) blank(j);
      i = stop;
      continue;
    }
    if (c === "/" && next === "/") {
      let j = i;
      while (j < src.length && src[j] !== "\n") {
        out[j] = " ";
        j++;
      }
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      out[i] = c;
      let j = i + 1;
      while (j < src.length && src[j] !== c && src[j] !== "\n") {
        if (src[j] === "\\" && j + 1 < src.length) {
          blank(j);
          blank(j + 1);
          j += 2;
        } else {
          blank(j);
          j++;
        }
      }
      if (j < src.length && src[j] === c) {
        out[j] = c;
        j++;
      }
      i = j;
      continue;
    }
    if (c === "`") {
      out[i] = "`";
      let j = i + 1;
      while (j < src.length && src[j] !== "`") {
        if (src[j] === "\\" && j + 1 < src.length) {
          blank(j);
          blank(j + 1);
          j += 2;
        } else {
          blank(j);
          j++;
        }
      }
      if (j < src.length) {
        out[j] = "`";
        j++;
      }
      i = j;
      continue;
    }
    out[i] = c;
    i++;
  }
  return out.join("");
}

// Strip the bodies of NON_TEXT_TAGS (e.g., <script>, <style>, <svg>).
// We only need to suppress their text children, not the surrounding
// markup, so we replace inner content with whitespace.
function stripNonTextTagBodies(src: string): string {
  let out = src;
  for (const tag of NON_TEXT_TAGS) {
    const re = new RegExp(
      `<${tag}([^>]*)>([\\s\\S]*?)</${tag}>`,
      "gi",
    );
    out = out.replace(re, (_m, attrs, body) => {
      const blanked = body.replace(/[^\n]/g, " ");
      return `<${tag}${attrs}>${blanked}</${tag}>`;
    });
  }
  return out;
}

function lineColFromIndex(src: string, idx: number): { line: number; col: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < idx; i++) {
    if (src[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, col };
}

function lineHasEscape(src: string, idx: number): boolean {
  // Look at the line containing idx — and the line immediately above —
  // for the escape token comment.
  let start = idx;
  while (start > 0 && src[start - 1] !== "\n") start--;
  let end = idx;
  while (end < src.length && src[end] !== "\n") end++;
  const line = src.slice(start, end);
  if (line.includes(ESCAPE_TOKEN)) return true;
  // Previous line
  const prevEnd = start - 1;
  if (prevEnd <= 0) return false;
  let prevStart = prevEnd;
  while (prevStart > 0 && src[prevStart - 1] !== "\n") prevStart--;
  const prevLine = src.slice(prevStart, prevEnd);
  return prevLine.includes(ESCAPE_TOKEN);
}

function findJsxTextNodes(file: string, original: string): Finding[] {
  const findings: Finding[] = [];
  // We deliberately do NOT brace-strip: JSX expression containers and
  // JS function bodies share the same `{...}` syntax, and a balanced
  // counter cannot distinguish them. Instead, captured text fragments
  // that contain `{` / `}` (or other JS-only operators) are rejected
  // downstream by CODE_NOISE_RE in isLikelyUserVisible. This treats
  // anything inside a JSX expression container like `{t("…")}` or
  // `{count}` as ineligible, which is exactly what we want — those
  // are runtime-rendered values, not literal text.
  const stripped = stripNonText(stripNonTextTagBodies(original));

  // Walk the stripped source character by character. When we encounter
  // a `>` that closes an opening tag (not `/>` and not within `</...>`),
  // capture text up to the next `<`.
  let i = 0;
  let inTag = false;
  let tagStart = -1;
  while (i < stripped.length) {
    const c = stripped[i];
    if (c === "<") {
      inTag = true;
      tagStart = i;
      i++;
      continue;
    }
    if (c === ">" && inTag) {
      inTag = false;
      // Was this a closing or self-closing tag? If so, no text node yet.
      const tagSrc = stripped.slice(tagStart, i + 1);
      const isClosing = /^<\s*\//.test(tagSrc);
      const isSelfClosing = /\/\s*>$/.test(tagSrc);
      i++;
      if (isClosing || isSelfClosing) continue;
      // Reject things that opened with `<` but aren't actually JSX:
      // TS generics (`<string | null>`, `<T extends Foo>`), comparisons
      // (`a < b`), arrow types (`<R>(x) => R`), etc. A real JSX
      // opening tag is `<Name` followed by zero or more attributes and
      // an optional trailing `/`. Attributes have one of three shapes
      // after stripping has blanked their values:
      //   - bare:        attr
      //   - assigned:    attr="…"   (quoted, contents now spaces)
      //   - assigned:    attr='…'
      //   - assigned:    attr={…}   (expression, contents now spaces)
      // Anything else (operators, type unions, JS expressions) means we
      // were not actually inside a JSX tag.
      const inner = tagSrc.slice(1, -1).trim();
      const ATTR_PART = `[\\w-]+(?::[\\w-]+)?(?:\\s*=\\s*(?:"[^"<>]*"|'[^'<>]*'|\\{[^{}<>]*\\}|[\\w.-]+))?`;
      const TAG_RE = new RegExp(
        `^[A-Za-z][\\w.\\-:]*(\\s+${ATTR_PART})*\\s*/?$`,
      );
      if (!TAG_RE.test(inner)) continue;
      // Capture text up to next `<`
      const textStart = i;
      while (i < stripped.length && stripped[i] !== "<") i++;
      const textEnd = i;
      const raw = original.slice(textStart, textEnd);
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (!isLikelyUserVisible(trimmed, "jsx-text")) continue;
      // Honour the per-line escape token
      if (lineHasEscape(original, textStart)) continue;
      // Determine offset of trimmed text within raw for accurate col
      const offset = raw.indexOf(trimmed);
      const absoluteIdx = textStart + (offset >= 0 ? offset : 0);
      const { line, col } = lineColFromIndex(original, absoluteIdx);
      findings.push({
        file,
        line,
        col,
        kind: "jsx-text",
        value: trimmed.length > 120 ? trimmed.slice(0, 117) + "..." : trimmed,
        snippet: raw.replace(/\s+/g, " ").trim().slice(0, 160),
      });
      continue;
    }
    i++;
  }

  return findings;
}

// ─── String-prop attribute scan ─────────────────────────────────────

const ATTR_RE = /\s([a-zA-Z][a-zA-Z0-9-]*)=("([^"\\{}]+)"|'([^'\\{}]+)')/g;

function findHardcodedAttrs(file: string, src: string): Finding[] {
  const findings: Finding[] = [];
  let m: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(src))) {
    const attr = m[1];
    if (!LOCALISED_ATTRS.has(attr)) continue;
    const value = (m[3] ?? m[4] ?? "").trim();
    if (!isLikelyUserVisible(value, "attr")) continue;
    if (lineHasEscape(src, m.index)) continue;
    const { line, col } = lineColFromIndex(src, m.index + 1);
    findings.push({
      file,
      line,
      col,
      kind: "attr",
      attr,
      value,
      snippet: m[0].trim().slice(0, 160),
    });
  }
  return findings;
}

// ─── Run ────────────────────────────────────────────────────────────

const files = walk(SRC);
const findings: Finding[] = [];
for (const file of files) {
  const src = readFileSync(file, "utf-8");
  if (process.env.HARDCODED_DEBUG) process.stderr.write(`. ${relative(ROOT, file)}\n`);
  // JSX text nodes only exist inside .tsx files; pure .ts modules
  // (data tables, helpers, types) routinely use TypeScript generics
  // that would be misread as JSX tags.
  if (wantJsx && file.endsWith(".tsx")) findings.push(...findJsxTextNodes(file, src));
  if (wantAttrs) findings.push(...findHardcodedAttrs(file, src));
}

// Sort: by file then line
findings.sort((a, b) =>
  a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file),
);

if (asJson) {
  process.stdout.write(
    JSON.stringify(
      findings.map((f) => ({ ...f, file: relative(ROOT, f.file) })),
      null,
      2,
    ),
  );
  process.stdout.write("\n");
  process.exit(strict && findings.length > 0 ? 1 : 0);
}

const byFile = new Map<string, Finding[]>();
for (const f of findings) {
  const list = byFile.get(f.file) ?? [];
  list.push(f);
  byFile.set(f.file, list);
}

console.log("═══════════════════════════════════════════════");
console.log(" Hardcoded user-visible strings");
console.log("═══════════════════════════════════════════════");
console.log(`Files scanned: ${files.length}`);
console.log(`Findings:      ${findings.length}`);
if (wantJsx) {
  const n = findings.filter((f) => f.kind === "jsx-text").length;
  console.log(`  JSX text:    ${n}`);
}
if (wantAttrs) {
  const n = findings.filter((f) => f.kind === "attr").length;
  console.log(`  Attributes:  ${n}`);
}
console.log();

for (const [file, list] of byFile) {
  console.log(`── ${relative(ROOT, file)} (${list.length})`);
  for (const f of list) {
    const tag = f.kind === "attr" ? `${f.attr}=` : "text:";
    console.log(`  L${f.line}:${f.col}  ${tag} "${f.value}"`);
  }
  console.log();
}

if (findings.length === 0) {
  console.log("✓ No hardcoded user-visible strings detected.");
}

process.exit(strict && findings.length > 0 ? 1 : 0);
