#!/usr/bin/env node
/**
 * Email-deliverability lint — static-source guarantee that every transport
 * exit (`sendEmail` / `sendNewsletterEmail`) carries the correct header
 * policy and that template HTML satisfies the unsubscribe-footer contract
 * the user signed off on:
 *
 *   - Booking templates  (booking_confirmation, booking_reminder,
 *     reschedule, cancellation, no_show, post_meeting,
 *     incomplete_booking) MUST NOT include `List-Unsubscribe`
 *     (operational notifications — recipient cannot opt out of their own
 *     appointment) but MUST carry `Auto-Submitted: auto-generated` via
 *     `headerPolicyFor("transactional")`.
 *
 *   - Marketing-1to1 (calculator) MUST carry `headerPolicyFor("marketing-1to1")`
 *     plus a visible unsub link rendered through `unsubFooterWithLink`.
 *
 *   - Marketing-bulk (drip + newsletter) MUST carry
 *     `headerPolicyFor("marketing-bulk")` (Auto-Submitted + Precedence:bulk),
 *     a `listUnsubscribe` URL, and a visible unsub link in the body.
 *
 * The lint operates on raw source — no test rig, no DB, no env — so it
 * runs in <100 ms inside `npm run check` and gates every PR.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..", "..");

const failures = [];
function fail(msg) { failures.push(msg); }

const emailSrc = readFileSync(join(REPO_ROOT, "server", "email.ts"), "utf8");
const newsletterSrc = readFileSync(
  join(REPO_ROOT, "server", "scheduled", "newsletter-broadcast.ts"),
  "utf8",
);

// ─── Rule 1: every sendEmail() call in email.ts passes a header policy ──
//
// Either as bare `headerPolicyFor("...")` or spread inside the rawOpts
// object literal. We tolerate the calculator/drip variants which spread
// the policy alongside a `listUnsubscribe` override.
/**
 * Find every `await sendEmail(...)` invocation, balancing parens so we
 * capture the entire argument list including nested object/spread
 * literals like `{ ...headerPolicyFor("..."), entityRefId: ... }`.
 */
function findBalancedCalls(src, fnName) {
  const out = [];
  const needle = `await ${fnName}(`;
  let i = 0;
  while ((i = src.indexOf(needle, i)) !== -1) {
    let depth = 1;
    let j = i + needle.length;
    while (j < src.length && depth > 0) {
      const ch = src[j];
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      else if (ch === '"' || ch === "'" || ch === "`") {
        // Skip over string literal content
        const quote = ch; j++;
        while (j < src.length && src[j] !== quote) {
          if (src[j] === "\\") j++;
          j++;
        }
      }
      j++;
    }
    out.push({ index: i, end: j, text: src.slice(i, j) });
    i = j;
  }
  return out;
}
const sendEmailCalls = findBalancedCalls(emailSrc, "sendEmail");
if (sendEmailCalls.length === 0) fail("Rule 1: no sendEmail() calls found — parser broken?");
for (const m of sendEmailCalls) {
  const callText = m.text;
  if (!/headerPolicyFor\(/.test(callText)) {
    const lineNo = emailSrc.slice(0, m.index).split("\n").length;
    fail(`Rule 1: sendEmail() at line ${lineNo} is missing headerPolicyFor(...) — every sender must pick a deliverability policy.`);
  }
}

// ─── Rule 2: booking-related senders MUST NOT carry List-Unsubscribe ──
//
// Locate each booking sender by its `function send*Once(` signature, then
// assert the function body does not include `listUnsubscribe:` (would
// indicate a regression of the agenda exclusion the user explicitly
// asked for).
const bookingSenders = [
  "sendBookingConfirmationOnce",
  "sendReminderEmailOnce",
  "sendRescheduleConfirmationOnce",
  "sendCancellationEmailOnce",
  "sendFollowupEmailOnce",
  "sendIncompleteBookingEmailOnce",
  "sendNoShowRescheduleEmailOnce",
];
/**
 * Slice the source between `async function <name>(` and the next
 * top-level `^async function ` / `^export ` / EOF. This is more robust
 * than a regex bounded by `\n}\n` because email.ts contains nested
 * template literals where `}` is not column-zero.
 */
function sliceFunctionBody(src, fnName) {
  const startRe = new RegExp(`^(async\\s+)?function\\s+${fnName}\\b`, "m");
  const startMatch = startRe.exec(src);
  if (!startMatch) return null;
  const start = startMatch.index;
  const tail = src.slice(start + startMatch[0].length);
  const endRe = /\n(?:async\s+function|export\s+(?:async\s+)?function|function\s+\w)\b/;
  const endMatch = endRe.exec(tail);
  return endMatch ? tail.slice(0, endMatch.index) : tail;
}
for (const fn of bookingSenders) {
  const body = sliceFunctionBody(emailSrc, fn);
  if (body == null) {
    fail(`Rule 2: booking sender ${fn} not found — rename or removed?`);
    continue;
  }
  if (/listUnsubscribe\s*:/.test(body)) {
    fail(`Rule 2: booking sender ${fn} includes listUnsubscribe — booking emails are operational and must not carry the unsubscribe header.`);
  }
  if (!/headerPolicyFor\("transactional"\)/.test(body)) {
    fail(`Rule 2: booking sender ${fn} must use headerPolicyFor("transactional").`);
  }
}

// ─── Rule 3: marketing senders carry visible unsub footer ─────────────
//
// `renderCalculatorEmailHtml` and the drip body must call
// `unsubFooterWithLink(...)` so a clickable Unsubscribe shows in the body.
if (!/renderCalculatorEmailHtml[\s\S]*?unsubFooterWithLink\(/.test(emailSrc)) {
  fail("Rule 3: renderCalculatorEmailHtml does not call unsubFooterWithLink — calculator email must carry a visible unsub link.");
}
const dripBody = sliceFunctionBody(emailSrc, "sendDripEmailOnce");
if (dripBody == null) {
  fail("Rule 3: sendDripEmailOnce not found.");
} else if (!/unsubFooterWithLink\(/.test(dripBody)) {
  fail("Rule 3: sendDripEmailOnce body does not call unsubFooterWithLink.");
} else if (!/headerPolicyFor\("marketing-bulk"\)/.test(dripBody)) {
  fail("Rule 3: sendDripEmailOnce must use headerPolicyFor(\"marketing-bulk\").");
} else if (!/listUnsubscribe\s*:/.test(dripBody)) {
  fail("Rule 3: sendDripEmailOnce must pass listUnsubscribe in rawOpts (RFC 8058 one-click).");
}

// Calculator: marketing-1to1 policy + visible unsub footer (already
// asserted above). Verify the policy explicitly so a future copy-paste
// regression is caught.
const calcRender = /renderCalculatorEmailHtml[\s\S]*?\n\}\n/.exec(emailSrc);
const calcSender = sliceFunctionBody(emailSrc, "sendCalculatorEmailOnce");
if (calcSender && !/headerPolicyFor\("marketing-1to1"\)/.test(calcSender)) {
  fail("Rule 3: sendCalculatorEmailOnce must use headerPolicyFor(\"marketing-1to1\").");
}

// ─── Rule 4: newsletter broadcast uses unified sendNewsletterEmail ────
//
// The worker must NOT roll its own raw MIME (regression of the unified
// transport refactor). Detect by absence of `gmail.users.messages.send`
// and presence of `sendNewsletterEmail(`.
if (/gmail\.users\.messages\.send\s*\(/.test(newsletterSrc)) {
  fail("Rule 4: newsletter-broadcast.ts is calling gmail.users.messages.send directly — must use sendNewsletterEmail() so circuit breaker / suppression / header guards apply.");
}
if (!/sendNewsletterEmail\(/.test(newsletterSrc)) {
  fail("Rule 4: newsletter-broadcast.ts does not call sendNewsletterEmail — refactor regressed.");
}

// ─── Rule 5: unsubFooterWithLink helper exists and is exported ────────
const layoutSrc = readFileSync(join(REPO_ROOT, "server", "email-layout.ts"), "utf8");
if (!/export function unsubFooterWithLink\b/.test(layoutSrc)) {
  fail("Rule 5: server/email-layout.ts must export unsubFooterWithLink(text, url, label).");
}

// ─── Rule 6: UNSUB_LINK_I18N covers all 6 supported langs ─────────────
const i18nBarrelSrc = readFileSync(join(REPO_ROOT, "server", "email-i18n.ts"), "utf8");
// After the modularization (T001 of #13) the per-language data lives
// under `server/email-i18n/{lang}.ts`. Subject literals are scanned
// across all six bundles below.
const i18nLangSources = ["es", "en", "fr", "de", "pt", "ca"].map(lang => ({
  lang,
  src: readFileSync(join(REPO_ROOT, "server", "email-i18n", `${lang}.ts`), "utf8"),
}));
const i18nSrc = i18nBarrelSrc + "\n" + i18nLangSources.map(s => s.src).join("\n");
const unsubBlock = /UNSUB_LINK_I18N[\s\S]*?\}\s*;/.exec(i18nSrc);
if (!unsubBlock) {
  fail("Rule 6: UNSUB_LINK_I18N not found in email-i18n.ts.");
} else {
  for (const lang of ["es", "en", "fr", "de", "pt", "ca"]) {
    if (!new RegExp(`\\b${lang}\\s*:\\s*"`).test(unsubBlock[0])) {
      fail(`Rule 6: UNSUB_LINK_I18N missing translation for "${lang}".`);
    }
  }
}

// ─── Rule 7: every CTA URL is wrapped in withUtm() ────────────────────
//
// Mechanical sweep across email.ts: every `ctaButton(<url>, …)` call
// must wrap its first argument in `withUtm(...)` so analytics can
// attribute clicks per template × language. The only exception is
// purely-internal stub URLs (mailto:, anchors) — none of which currently
// reach a ctaButton callsite. Catches accidental copy-paste of new CTAs
// that bypass the helper.
const ctaCalls = [];
{
  // Strip JSDoc / line comments first so references in documentation do
  // not register as live CTAs.
  const stripped = emailSrc
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n").map(l => l.replace(/\/\/.*$/, "")).join("\n");
  for (const m of stripped.matchAll(/ctaButton\(([^,]+),/g)) {
    const arg = m[1].trim();
    if (!arg.startsWith("withUtm(")) {
      const lineNo = stripped.slice(0, m.index).split("\n").length;
      fail(`Rule 7: ctaButton() at line ${lineNo} is not wrapped in withUtm(...) — every CTA must carry UTM tagging.`);
    }
    ctaCalls.push(m);
  }
}

// ─── Rule 8: per-purpose From identity (FROM_NAME_BY_FAMILY) ──────────
//
// Every sendEmail() callsite must pass either senderNameFor("transactional"),
// senderNameFor("drip"), or senderNameFor("newsletter") (or omit the
// fromName arg only when the helper doesn't need a personal identity —
// currently no such case). Catches a regression where someone hardcodes
// "Claudia Hinojosa" or "Exentax Newsletter" again.
if (!/export const FROM_NAME_BY_FAMILY\b/.test(emailSrc)) {
  fail("Rule 8: FROM_NAME_BY_FAMILY identity table missing in email.ts.");
}
for (const m of sendEmailCalls) {
  const callText = m.text;
  // Skip the helper signature itself
  if (/function\s+sendEmail\s*\(/.test(callText)) continue;
  const hasIdentity = /senderNameFor\(/.test(callText);
  if (!hasIdentity) {
    const lineNo = emailSrc.slice(0, m.index).split("\n").length;
    fail(`Rule 8: sendEmail() at line ${lineNo} is missing senderNameFor("transactional"|"drip"|"newsletter") — From-identity must come from the policy table.`);
  }
}
// Catch hardcoded literals
const literalIdentity = /sendEmail\([^)]*?,\s*"(Claudia Hinojosa|Exentax Newsletter|Exentax)"/g;
let lm;
while ((lm = literalIdentity.exec(emailSrc))) {
  const lineNo = emailSrc.slice(0, lm.index).split("\n").length;
  fail(`Rule 8: sendEmail() at line ${lineNo} hardcodes the From name "${lm[1]}" — use senderNameFor(...) instead.`);
}

// ─── Rule 9: lead-magnet hard-fail in production ──────────────────────
//
// `sendDripEmailOnce` must refuse to send step 1 when GUIDE_PDF_URL is
// still the placeholder in production. This is the functional guarantee
// (not just a boot warning) that no recipient ever receives a broken
// `/guide.pdf` link.
const dripBodyForGuide = sliceFunctionBody(emailSrc, "sendDripEmailOnce");
if (dripBodyForGuide && !/GUIDE_PDF_DEFAULT_PLACEHOLDER/.test(dripBodyForGuide)) {
  fail("Rule 9: sendDripEmailOnce must refuse step 1 in production when GUIDE_PDF_URL is the default placeholder (functional lead-magnet guarantee).");
}

// ─── Rule 10: spam-score / structural template lint ───────────────────
//
// Lightweight static heuristics applied to every visible subject /
// heading literal in email-i18n.ts. Catches the classes of regressions
// that hurt deliverability and inbox placement:
//   (a) subject longer than 78 chars (gets truncated in Gmail web,
//       penalised as spam-bait by some filters);
//   (b) ALL-CAPS subject (top spam classifier signal);
//   (c) excess of `!` or `$` in subject;
//   (d) subject starting with "Re:" or "Fwd:" outside an actual reply
//       context (deceptive-subject heuristic).
const subjectLiterals = [...i18nSrc.matchAll(/subject\s*:\s*"([^"\n]+)"/g)];
let subjectChecks = 0;
for (const m of subjectLiterals) {
  subjectChecks++;
  const subj = m[1];
  const lineNo = i18nSrc.slice(0, m.index).split("\n").length;
  // Strip placeholders like {name} for length / caps measurement
  const visible = subj.replace(/\{[^}]+\}/g, "x");
  if (visible.length > 78) {
    fail(`Rule 10a: i18n subject at line ${lineNo} is ${visible.length} chars (>78) — will be truncated in Gmail web. Subject: "${subj}"`);
  }
  const letters = visible.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñÀ-ÿ]/g, "");
  if (letters.length >= 8) {
    const upper = letters.replace(/[^A-ZÁÉÍÓÚÜÑÀ-Þ]/g, "");
    if (upper.length / letters.length > 0.6) {
      fail(`Rule 10b: i18n subject at line ${lineNo} is mostly UPPERCASE (${Math.round(100*upper.length/letters.length)}%) — strong spam signal. Subject: "${subj}"`);
    }
  }
  if ((subj.match(/!/g) || []).length > 1) {
    fail(`Rule 10c: i18n subject at line ${lineNo} has multiple "!" — spam-bait. Subject: "${subj}"`);
  }
  if (/^\s*(Re:|Fwd:|RE:|FWD:)/.test(subj)) {
    fail(`Rule 10d: i18n subject at line ${lineNo} starts with "Re:"/"Fwd:" — deceptive-subject signal. Subject: "${subj}"`);
  }
}
if (subjectChecks === 0) {
  fail("Rule 10: no subject literals found in email-i18n.ts — parser broken or schema drift?");
}

// ─── Rule 11: List-Unsubscribe-Post requires a real POST handler ──────
//
// `buildRaw()` always emits the `List-Unsubscribe-Post: List-Unsubscribe=
// One-Click` header alongside `List-Unsubscribe:` (RFC 8058). Mailbox
// providers (Gmail, Yahoo, Apple Mail) call POST — not GET — when the
// user clicks the native "Unsubscribe" affordance in their inbox.
// Both the newsletter and the drip routes must therefore expose POST
// handlers; emitting the header without a POST handler returns 404/405
// to the provider and silently breaks one-click unsubscribe (a hard
// deliverability and legal-trust issue).
const publicRoutesSrc = readFileSync(
  join(REPO_ROOT, "server", "routes", "public.ts"),
  "utf8",
);
for (const route of [
  "/api/newsletter/unsubscribe/:token",
  "/api/drip/unsubscribe/:token",
]) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const getRe = new RegExp(`app\\.(?:get|all)\\(\\s*["']${escaped}["']`);
  const postRe = new RegExp(`app\\.(?:post|all)\\(\\s*["']${escaped}["']`);
  if (!getRe.test(publicRoutesSrc)) {
    fail(`Rule 11: public route GET ${route} is missing — unsub footer link will 404.`);
  }
  if (!postRe.test(publicRoutesSrc)) {
    fail(`Rule 11: public route POST ${route} is missing — emitting List-Unsubscribe-Post without it breaks RFC 8058 one-click unsub.`);
  }
}

// ─── Report ───────────────────────────────────────────────────────────
if (failures.length === 0) {
  console.log(`✅ lint-email-deliverability: OK (${sendEmailCalls.length} sendEmail callsites · ${bookingSenders.length} booking senders · ${ctaCalls.length} CTAs UTM-tagged · ${subjectChecks} subjects spam-checked)`);
  process.exit(0);
}
console.error("❌ lint-email-deliverability: failures:");
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);
