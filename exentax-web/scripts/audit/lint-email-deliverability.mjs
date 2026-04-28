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
const sendEmailCalls = [...emailSrc.matchAll(/await sendEmail\([^)]+?\)/gs)];
if (sendEmailCalls.length === 0) fail("Rule 1: no sendEmail() calls found — parser broken?");
for (const m of sendEmailCalls) {
  const callText = m[0];
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
const i18nSrc = readFileSync(join(REPO_ROOT, "server", "email-i18n.ts"), "utf8");
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

// ─── Report ───────────────────────────────────────────────────────────
if (failures.length === 0) {
  console.log(`✅ lint-email-deliverability: OK (${sendEmailCalls.length} sendEmail callsites checked, ${bookingSenders.length} booking senders verified)`);
  process.exit(0);
}
console.error("❌ lint-email-deliverability: failures:");
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);
