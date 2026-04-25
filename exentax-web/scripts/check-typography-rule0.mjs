#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");
const SRC_ROOT = resolve(PROJECT_ROOT, "client/src");

const TS_RULES = [
  {
    id: "uppercase-tracking",
    label: "uppercase + tracking decorativo en className",
    pattern: /uppercase\s+tracking-(wider|widest|\[0\.[1-9]\d*em\]|\[0\.\d{2,}em\])|tracking-(wider|widest|\[0\.[1-9]\d*em\]|\[0\.\d{2,}em\])\s+[^"`]*\buppercase\b/,
    // Allowlist: design-system "eyebrow / tag / badge" primitives. The rule
    // forbids decorative uppercase in editorial copy (blog body, prose) but
    // intentionally permits these small-cap labels used as section chips,
    // category tags, card eyebrows and the post atomic-answer label.
    // See docs/consolidation-2026-04.md §4 and
    // docs/REVISION-INTEGRAL-2026-04.md §typography.
    allow: [
      "client/src/components/sections/ExistingLlcCallout.tsx",
      "client/src/pages/services.tsx",
      "client/src/pages/services/ServiceSubpage.tsx",
      // Pillar landing kickers — section eyebrows above each h2.
      "client/src/pages/abrir-llc.tsx",
      // Atomic-answer "Quick answer" label inside the blog post body callout.
      "client/src/pages/blog/post.tsx",
    ],
  },
  {
    id: "tabular-nums-decorative",
    label: "tabular-nums decorativo (solo permitido en tablas funcionales)",
    pattern: /\btabular-nums\b/,
    allow: ["client/src/components/BookingCalendar.tsx"],
  },
  {
    id: "font-mono-decorative",
    label: "font-mono decorativo (prohibido fuera de bloques de código real)",
    pattern: /\bfont-mono\b/,
    // Skip: blog content data files contain template-literal HTML where
    // <span class="font-mono"> marks legal-reference tokens (IRC §, Form NNNN)
    // inline. This is a documented data corpus, not editorial JSX className.
    // A separate content-style sweep tracks any future visual changes.
    skipPathPrefix: ["client/src/data/blog-content/"],
  },
];

const CSS_RULES = [
  {
    id: "css-uppercase-tracking",
    label: "text-transform: uppercase + letter-spacing >= 0.1em (decorativo)",
    test: (block) => /text-transform\s*:\s*uppercase/i.test(block) && /letter-spacing\s*:\s*0?\.(?:[1-9]\d*)?em/i.test(block),
    // Allowlist: design-system primitives — the section chip and card eyebrow
    // are deliberate uppercase labels at the design-token level. They are
    // never used inside editorial body content. See docs/consolidation-2026-04.md §4.
    allowSelectors: ["\\.section-chip", "\\.exentax-card-eyebrow", "\\.article-sources__heading"],
  },
  {
    id: "css-blog-h2-counter",
    label: "counter decorativo en .blog-content h2 (prefijo numérico prohibido)",
    test: (block, selector) => /^\.blog-content\s+h2\b/.test(selector) && (/counter-(?:reset|increment)\s*:\s*blog-h2/i.test(block) || /content\s*:\s*counter\(blog-h2/i.test(block)),
  },
  {
    id: "css-tabular-nums-decorative",
    label: "font-variant-numeric: tabular-nums decorativo en CSS",
    test: (block, selector) => /font-variant-numeric\s*:\s*[^;]*\btabular-nums\b/i.test(block) && !/\.booking-(slots|grid)|thead\s+th\b|tbody\s+td\b/i.test(selector),
  },
  {
    id: "css-decimal-leading-zero",
    label: "decimal-leading-zero en counter (prefijo decorativo 01/02 prohibido)",
    test: (block) => /\bdecimal-leading-zero\b/i.test(block),
  },
];

function listFiles(exts) {
  const expr = exts.map(e => `-name '*.${e}'`).join(" -o ");
  const out = execSync(`find ${SRC_ROOT} -type f \\( ${expr} \\)`, { encoding: "utf8" });
  return out.split("\n").filter(Boolean);
}

function rel(p) { return relative(PROJECT_ROOT, p); }

let violations = 0;

// ── TS/TSX scan (línea a línea) ──────────────────────────────
for (const file of listFiles(["ts", "tsx"])) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  for (const rule of TS_RULES) {
    if (rule.allow?.some(a => rel(file) === a || file.endsWith(a))) continue;
    if (rule.skipPathPrefix?.some((p) => rel(file).startsWith(p))) continue;
    lines.forEach((line, i) => {
      if (rule.pattern.test(line)) {
        console.log(`[${rule.id}] ${rel(file)}:${i + 1}  ${line.trim().slice(0, 140)}`);
        violations++;
      }
    });
  }
}

// ── CSS scan (por bloque selector { … }) ─────────────────────
function* iterCssBlocks(content) {
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(content))) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    const block = m[2];
    yield { selector, block };
  }
}

for (const file of listFiles(["css"])) {
  const content = readFileSync(file, "utf8");
  for (const { selector, block } of iterCssBlocks(content)) {
    for (const rule of CSS_RULES) {
      if (rule.allowSelectors?.some((re) => new RegExp(re).test(selector))) continue;
      if (rule.test(block, selector)) {
        const lineNo = content.slice(0, content.indexOf(block)).split("\n").length;
        console.log(`[${rule.id}] ${rel(file)}:~${lineNo}  ${selector.slice(0, 80)} { … }`);
        violations++;
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} violación(es) de Regla 0 tipográfica`);
  process.exit(1);
}
console.log("Regla 0 OK · 0 violaciones decorativas (TS/TSX + CSS)");
