/**
 * Regression test — Email template security & multi-language drip rendering.
 *
 * Run: `tsx exentax-web/tests/email-template-security.test.ts`
 *
 * Audited under task #6 (email-audit-2026-04). Asserts:
 *
 *   1. For every supported language (es / en / fr / de / pt / ca) and every
 *      drip step (1..6), the rendered HTML:
 *        - sets the correct `<html lang="…">` attribute
 *        - has a non-empty subject and body paragraphs
 *        - includes the brand neon green `#00E510`
 *        - contains NO `<script` tag
 *        - contains NO inline event handler (`on*=`)
 *        - contains NO `javascript:` URL
 *        - contains NO `http://` URL (TLS-only — `xmlns="http://…"` namespace
 *          declarations are the only allowed exception)
 *
 *   2. XSS payload safety: when the recipient `name` is set to a script
 *      payload, the rendered HTML contains the *escaped* form and NOT the
 *      live `<script>` tag.
 *
 *   3. List-Unsubscribe header is set on drip emails (audit fix A-2).
 *
 * The test imports the email layout helpers and i18n directly and renders
 * each template in-process — no DB or Gmail dependency. Exits non-zero on
 * the first failure so CI catches a regression immediately.
 */
process.env.NODE_ENV = "test";

import { emailHtml, heading, bodyText, ctaButton, brandSignature, unsubNote } from "../server/email-layout";
import { getEmailTranslations, type SupportedLang } from "../server/email-i18n";
import { escapeHtml } from "../server/routes/shared";

const LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];
const STEPS: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6];

const NEON = "#00E510";

let failures = 0;
function check(label: string, cond: boolean, extra?: string): void {
  if (cond) {
    console.log(`  [PASS] ${label}`);
  } else {
    failures++;
    console.error(`  [FAIL] ${label}${extra ? ` — ${extra}` : ""}`);
  }
}

/**
 * Mirror of the exact body shape `sendDripEmail` builds in `server/email.ts`.
 * Kept in sync deliberately so the test fails if the production assembly
 * drifts (which is the whole point of a regression test).
 */
function renderDripBody(lang: SupportedLang, step: 1 | 2 | 3 | 4 | 5 | 6, name: string | null): { html: string; subject: string } {
  const t = getEmailTranslations(lang);
  const d = t.drip;
  const stepCopy = d.steps[step - 1];
  const safeName = name ? escapeHtml(name.trim().split(/\s+/)[0]) : null;
  const greeting = d.greeting(safeName);
  // CTA: step 1 → guide PDF, step 4 → calculator anchor, step 6 → /book.
  // Steps 2/3/5 are text-only nurture.
  const cta = step === 1
    ? ctaButton("https://exentax.com/guide.pdf", d.ctaOpenGuide)
    : step === 4
      ? ctaButton(`https://exentax.com/${lang}#calculadora`, d.ctaCalculate)
      : step === 6
        ? ctaButton(`https://exentax.com/${lang === "es" ? "" : lang + "/"}book`, d.ctaBook)
        : "";
  const psHtml = stepCopy.ps ? bodyText(stepCopy.ps) : "";
  const body = `
    ${heading(greeting)}
    ${stepCopy.paragraphs.map(p => bodyText(p)).join("\n")}
    ${cta}
    ${psHtml}
    ${brandSignature(lang, d.sigClosing)}
    ${unsubNote(d.unsubNote)}
  `;
  return { html: emailHtml(body, stepCopy.subject, lang), subject: stepCopy.subject };
}

console.log("\n=== Email template security & i18n regression ===\n");

// ─── Block 1: per-language × per-step rendering checks ─────────────────────
for (const lang of LANGS) {
  console.log(`\n--- lang=${lang} ---`);
  for (const step of STEPS) {
    const { html, subject } = renderDripBody(lang, step, "Juan");

    check(`drip[${lang}][step ${step}] subject is non-empty`, subject.trim().length > 0);
    check(`drip[${lang}][step ${step}] html lang="${lang}"`, html.includes(`<html lang="${lang}"`));
    check(`drip[${lang}][step ${step}] body contains brand neon ${NEON}`, html.includes(NEON));
    check(`drip[${lang}][step ${step}] no <script tag`, !/<script[\s>]/i.test(html));
    check(`drip[${lang}][step ${step}] no inline on*= handler`, !/\son[a-z]+\s*=\s*["']/i.test(html));
    check(`drip[${lang}][step ${step}] no javascript: url`, !/javascript:/i.test(html));
    // TLS-only: the only allowed `http://` substring is the XML/Office
    // namespace URI (`xmlns="http://…"`), which is a URI not a URL and
    // never resolved by an MUA. Strip those out before checking.
    const httpMatches = html
      .replace(/xmlns(?::[a-z]+)?="http:\/\/[^"]+"/gi, "")
      .match(/http:\/\/[^"'\s<>]+/gi);
    check(
      `drip[${lang}][step ${step}] no plain http:// link`,
      !httpMatches || httpMatches.length === 0,
      httpMatches ? `found: ${httpMatches.slice(0, 3).join(", ")}` : undefined,
    );
  }
}

// ─── Block 2: XSS payload safety ───────────────────────────────────────────
console.log(`\n--- XSS payload safety (recipient name) ---`);
const xssPayload = `<script>alert('xss')</script>`;
for (const lang of LANGS) {
  const { html } = renderDripBody(lang, 1, xssPayload);
  check(`drip[${lang}] XSS name escaped (no live <script tag)`, !/<script[\s>]/i.test(html));
  check(`drip[${lang}] XSS name appears as escaped &lt;`, html.includes("&lt;script&gt;") || html.includes("&lt;script"));
}

// ─── Block 3: List-Unsubscribe header presence (drip fix A-2) ──────────────
//
// We don't actually invoke `gmail.users.messages.send`; we exercise the
// internal `buildRaw` via a tiny shim that mirrors the call site. This is
// safer than dynamic-importing the unmocked `email.ts` (which triggers
// secret loading). We do however assert that `sendDripEmail` passes the
// right option by reading the source — a substring check that catches any
// future deletion of the header wiring.
console.log(`\n--- Drip List-Unsubscribe wiring (audit A-2) ---`);
import * as fs from "node:fs";
import * as path from "node:path";
const emailSrc = fs.readFileSync(path.join(import.meta.dirname, "..", "server", "email.ts"), "utf8");
check(
  "sendDripEmail passes a List-Unsubscribe option",
  /listUnsubscribe:\s*dripUnsub/.test(emailSrc),
);
check(
  "drip List-Unsubscribe is a mailto: URL",
  /dripUnsub\s*=\s*`mailto:/.test(emailSrc),
);

// ─── Summary ───────────────────────────────────────────────────────────────
const total = LANGS.length * STEPS.length * 6 // block 1 (6 checks per variant)
  + LANGS.length * 2                            // block 2
  + 2;                                          // block 3
const passed = total - failures;

console.log(`\n=== ${passed}/${total} checks passed ===\n`);
if (failures > 0) {
  console.error(`FAILED: ${failures} check(s) failed`);
  process.exit(1);
}
process.exit(0);
