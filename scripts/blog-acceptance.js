#!/usr/bin/env node
/**
 * Blog acceptance script: validates that all 101 ES articles meet
 * the Phase 1 editorial criteria documented in docs/seo/blog-audit-2026.md.
 *
 * Run from project root:
 *   node scripts/blog-acceptance.js
 *
 * Exit code 0 = pass, 1 = fail.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const ES_DIR = path.join(ROOT, "exentax-web/client/src/data/blog-content/es");
const POSTS_FILE = path.join(ROOT, "exentax-web/client/src/data/blog-posts.ts");

const MIN_CHARS = 3000;
const META_DESC_MIN = 140;
const META_DESC_MAX = 160;
const EXCERPT_MIN = 140;
const EXCERPT_MAX = 180;
const KEYWORDS_MIN = 3;
const KEYWORDS_MAX = 6;
const META_TITLE_MAX = 60;
const REQUIRED_UPDATED_AT = "2026-04-20";

const failures = [];
const stats = { articlesChecked: 0, postsChecked: 0 };

function fail(slug, msg) {
  failures.push({ slug, msg });
}

// 1) Validate ES article files
const files = fs.readdirSync(ES_DIR).filter((f) => f.endsWith(".ts")).sort();
for (const f of files) {
  const slug = f.replace(/\.ts$/, "");
  const txt = fs.readFileSync(path.join(ES_DIR, f), "utf8");
  stats.articlesChecked++;

  if (txt.length < MIN_CHARS) fail(slug, `chars=${txt.length} < ${MIN_CHARS}`);
  if (txt.includes("—")) fail(slug, "contains em-dash (—)");
  if (txt.includes(" -- ")) fail(slug, "contains double-hyphen (--)");
  if (!txt.includes('href="/es/calculadora"')) fail(slug, "missing /es/calculadora CTA");
  if (!txt.includes('href="/es/agendar"')) fail(slug, "missing /es/agendar CTA");
  if (!/##\s+Referencias/i.test(txt)) fail(slug, "missing ## Referencias block");
}

// 2) Validate blog-posts.ts metadata
const postsTxt = fs.readFileSync(POSTS_FILE, "utf8");
let depth = 0;
let start = -1;
for (let i = 0; i < postsTxt.length; i++) {
  const c = postsTxt[i];
  if (c === "{") {
    if (depth === 0) start = i;
    depth++;
  } else if (c === "}") {
    depth--;
    if (depth === 0 && start !== -1) {
      const block = postsTxt.slice(start, i + 1);
      const slugM = block.match(/slug:\s*"([^"]+)"/);
      if (slugM) {
        const slug = slugM[1];
        stats.postsChecked++;
        const titleM = block.match(/metaTitle:\s*"((?:[^"\\]|\\.)*)"/);
        const descM = block.match(/metaDescription:\s*"((?:[^"\\]|\\.)*)"/);
        const excM = block.match(/excerpt:\s*"((?:[^"\\]|\\.)*)"/);
        const kwM = block.match(/keywords:\s*\[([^\]]*)\]/);
        const updM = block.match(/updatedAt:\s*"([^"]+)"/);

        if (!titleM) fail(slug, "missing metaTitle");
        else if (titleM[1].length > META_TITLE_MAX) fail(slug, `metaTitle ${titleM[1].length}>${META_TITLE_MAX}`);

        if (!descM) fail(slug, "missing metaDescription");
        else {
          const len = descM[1].length;
          if (len < META_DESC_MIN || len > META_DESC_MAX) fail(slug, `metaDescription ${len} not in [${META_DESC_MIN},${META_DESC_MAX}]`);
        }

        if (!excM) fail(slug, "missing excerpt");
        else {
          const len = excM[1].length;
          if (len < EXCERPT_MIN || len > EXCERPT_MAX) fail(slug, `excerpt ${len} not in [${EXCERPT_MIN},${EXCERPT_MAX}]`);
        }

        if (!kwM) fail(slug, "missing keywords");
        else {
          const items = (kwM[1].match(/"[^"]+"/g) || []).length;
          if (items < KEYWORDS_MIN || items > KEYWORDS_MAX) fail(slug, `keywords ${items} not in [${KEYWORDS_MIN},${KEYWORDS_MAX}]`);
        }

        if (!updM) fail(slug, "missing updatedAt");
        else if (updM[1] !== REQUIRED_UPDATED_AT) fail(slug, `updatedAt=${updM[1]} != ${REQUIRED_UPDATED_AT}`);
      }
      start = -1;
    }
  }
}

// 3) Compile-check the modified TS files (catches unescaped backticks etc.)
try {
  execSync("npx tsc --noEmit", {
    cwd: path.join(ROOT, "exentax-web"),
    stdio: "pipe",
  });
  console.log("TypeScript compile-check: PASS");
} catch (e) {
  const out = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
  fail("__build__", "tsc --noEmit failed:\n" + out.split("\n").slice(0, 10).join("\n"));
}

console.log(`Checked: ${stats.articlesChecked} article files, ${stats.postsChecked} post entries.`);
if (failures.length === 0) {
  console.log("PASS: all blog acceptance checks succeeded.");
  process.exit(0);
} else {
  console.log(`FAIL: ${failures.length} issues found:`);
  for (const { slug, msg } of failures) console.log(`  - [${slug}] ${msg}`);
  process.exit(1);
}
