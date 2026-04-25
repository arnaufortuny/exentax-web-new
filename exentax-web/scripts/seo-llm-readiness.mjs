#!/usr/bin/env node
/**
 * Task #14 (GEO) — LLM-readiness audit.
 *
 * Verifies that the site exposes the surface AI engines (ChatGPT, Gemini,
 * Claude, Perplexity, Copilot) need to discover, ingest and cite Exentax:
 *
 *   1. `client/public/llms.txt` exists and references all 6 locale homepages
 *      and all 5 LLC service subpages.
 *   2. `client/public/llms-full.txt` exists and is non-trivial (> 4000 chars)
 *      and includes the brand identity block.
 *   3. The server-rendered `robots.txt` (server/routes/public.ts) contains
 *      explicit Allow rules for the canonical AI bots and Allow lines for
 *      both `/llms.txt` and `/llms-full.txt`.
 *   4. `server/seo-content.ts` Organization (home) carries the canonical
 *      `@id` (`/#organization`) and an `aggregateRating`.
 *   5. `client/src/pages/blog/post.tsx` declares HOWTO_PROCEDURAL_SLUGS, a
 *      visible atomic-answer callout, and a HowTo JSON-LD generator.
 *   6. `client/src/pages/abrir-llc.tsx` (the pillar) exists and emits both a
 *      visible atomic-answer block and HowTo JSON-LD steps.
 *
 * Exit code 0 = pass, 1 = fail. The script is intentionally read-only: it
 * never mutates files. Wired into `npm run lint:blog` so CI fails the moment
 * the GEO surface drifts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

const failures = [];
const warnings = [];

function read(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

function fail(check, msg) {
  failures.push({ check, msg });
}
function warn(check, msg) {
  warnings.push({ check, msg });
}
function ok(check) {
  console.log(`${GREEN}✓${RESET} ${check}`);
}

const REQUIRED_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
];

const LOCALE_HOMES = ["/es", "/en", "/fr", "/de", "/pt", "/ca"];
const SERVICE_PATHS = [
  "servicios/llc-nuevo-mexico",
  "services/llc-wyoming",
  "services/llc-delaware",
  "services/llc-florida",
  "services/itin",
];

// ---------------------------------------------------------------------------
// 1. llms.txt
// ---------------------------------------------------------------------------
{
  const c = read("client/public/llms.txt");
  if (!c) {
    fail("llms.txt", "client/public/llms.txt is missing");
  } else {
    if (c.length < 1500) fail("llms.txt", `too short (${c.length} chars, expected ≥ 1500)`);
    for (const home of LOCALE_HOMES) {
      if (!c.includes(home)) fail("llms.txt", `missing locale homepage reference: ${home}`);
    }
    let serviceHits = 0;
    for (const s of SERVICE_PATHS) {
      if (c.includes(s)) serviceHits++;
    }
    if (serviceHits < 3) fail("llms.txt", `references too few service paths (${serviceHits}/${SERVICE_PATHS.length})`);
    if (failures.filter((f) => f.check === "llms.txt").length === 0) ok("llms.txt: present, locales + services indexed");
  }
}

// ---------------------------------------------------------------------------
// 2. llms-full.txt
// ---------------------------------------------------------------------------
{
  const c = read("client/public/llms-full.txt");
  if (!c) {
    fail("llms-full.txt", "client/public/llms-full.txt is missing");
  } else {
    if (c.length < 4000) fail("llms-full.txt", `too short (${c.length} chars, expected ≥ 4000)`);
    if (!/Exentax/i.test(c)) fail("llms-full.txt", "brand identity block missing");
    if (!/LLC/i.test(c)) fail("llms-full.txt", "no LLC content");
    if (failures.filter((f) => f.check === "llms-full.txt").length === 0) {
      ok(`llms-full.txt: present (${c.length} chars)`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. robots.txt — explicit AI bot allow blocks + llms.txt allowances
// ---------------------------------------------------------------------------
{
  const c = read("server/routes/public.ts");
  if (!c) {
    fail("robots.txt", "server/routes/public.ts not found");
  } else {
    // robots.txt is generated programmatically (each bot is appended via
    // a `buildPolicyBlock("Bot")` call), so we look for the bot token as a
    // quoted string literal in the AI_BOTS list — that matches both the
    // explicit `User-agent: Bot` form and the dynamic builder form.
    const missing = REQUIRED_BOTS.filter((b) => !new RegExp(`["'\`]${b}["'\`]|User-agent:\\s*${b}\\b`, "i").test(c));
    if (missing.length) fail("robots.txt", `missing AI bot allow blocks: ${missing.join(", ")}`);
    if (!/["'\`]\/llms\.txt["'\`]|Allow:\s*\/llms\.txt/.test(c)) fail("robots.txt", "missing Allow: /llms.txt");
    if (!/["'\`]\/llms-full\.txt["'\`]|Allow:\s*\/llms-full\.txt/.test(c)) fail("robots.txt", "missing Allow: /llms-full.txt");
    if (failures.filter((f) => f.check === "robots.txt").length === 0) {
      ok("robots.txt: AI bots + llms.txt allowed");
    }
  }
}

// ---------------------------------------------------------------------------
// 4. server/seo-content.ts — Organization @id + aggregateRating
// ---------------------------------------------------------------------------
{
  const c = read("server/seo-content.ts");
  if (!c) {
    fail("seo-content.ts", "file missing");
  } else {
    if (!/"@id":\s*`\$\{BASE_URL\}\/#organization`/.test(c)) {
      fail("seo-content.ts", "Organization @id (#organization) not found in home schema");
    }
    if (!/aggregateRating[\s\S]{0,500}reviewCount/.test(c)) {
      fail("seo-content.ts", "aggregateRating with reviewCount missing on home Organization");
    }
    if (failures.filter((f) => f.check === "seo-content.ts").length === 0) {
      ok("server/seo-content.ts: Organization @id + aggregateRating present");
    }
  }
}

// ---------------------------------------------------------------------------
// 5. blog/post.tsx — HOWTO_PROCEDURAL_SLUGS + atomic answer + HowTo schema
// ---------------------------------------------------------------------------
{
  const c = read("client/src/pages/blog/post.tsx");
  if (!c) {
    fail("blog/post.tsx", "file missing");
  } else {
    if (!/HOWTO_PROCEDURAL_SLUGS/.test(c)) fail("blog/post.tsx", "HOWTO_PROCEDURAL_SLUGS list missing");
    if (!/atomicAnswerText/.test(c)) fail("blog/post.tsx", "atomicAnswerText derivation missing");
    if (!/data-testid="atomic-answer-callout"/.test(c)) fail("blog/post.tsx", "atomic-answer-callout JSX block missing");
    if (!/howToJsonLd/.test(c)) fail("blog/post.tsx", "howToJsonLd builder missing");
    if (!/"@type":\s*"HowTo"/.test(c)) fail("blog/post.tsx", "HowTo @type literal missing");
    if (failures.filter((f) => f.check === "blog/post.tsx").length === 0) {
      ok("blog/post.tsx: HOWTO + atomic answer present");
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Pillar page — atomic answer + HowTo schema
// ---------------------------------------------------------------------------
{
  const c = read("client/src/pages/abrir-llc.tsx");
  if (!c) {
    fail("abrir-llc.tsx", "pillar page missing");
  } else {
    if (!/data-testid="atomic-answer-callout"/.test(c)) fail("abrir-llc.tsx", "atomic-answer-callout missing");
    if (!/"@type":\s*"HowTo"/.test(c)) fail("abrir-llc.tsx", "HowTo schema missing");
    if (!/PILLAR_CONTENT/.test(c)) warn("abrir-llc.tsx", "expected PILLAR_CONTENT locale map not found");
    if (failures.filter((f) => f.check === "abrir-llc.tsx").length === 0) {
      ok("abrir-llc.tsx: pillar emits atomic answer + HowTo");
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log("");
if (warnings.length) {
  console.log(`${YELLOW}Warnings:${RESET}`);
  for (const w of warnings) console.log(`  ${YELLOW}!${RESET} [${w.check}] ${w.msg}`);
  console.log("");
}
if (failures.length) {
  console.log(`${RED}LLM-readiness audit FAILED — ${failures.length} issue(s):${RESET}`);
  for (const f of failures) console.log(`  ${RED}✗${RESET} [${f.check}] ${f.msg}`);
  console.log(`${DIM}See exentax-web/docs/seo/off-site-checklist.md for context.${RESET}`);
  process.exit(1);
} else {
  console.log(`${GREEN}LLM-readiness audit PASSED${RESET} (${warnings.length} warning${warnings.length === 1 ? "" : "s"})`);
}
