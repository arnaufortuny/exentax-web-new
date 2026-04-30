import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang, UNSUB_LINK_I18N } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, heading, bodyText, ctaButton, brandSignature, unsubFooterWithLink,
  SITE_URL,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import { type SupportedLang } from "../server-constants";
import { getLocalizedPath } from "../../shared/routes";
import {
  SENDER_EMAIL,
  REPLY_TO_EMAIL,
  GUIDE_PDF_URL,
  GUIDE_PDF_DEFAULT_PLACEHOLDER,
  buildDripUnsubUrl,
  getGmailClient,
  sendEmail,
  senderNameFor,
  withUtm,
  headerPolicyFor,
  logEmail,
  maskEmail,
  withRetryQueue,
} from "./transport";

/**
 * Drip sequence email — one of 6 nurture steps (days 0/3/6/9/12/15).
 *
 * Step is 1-indexed (1..6). The CTA placement varies per step:
 *   - step 1: "Open my guide"          → GUIDE_PDF_URL
 *   - step 4: "Calculate my savings"   → home page #calculadora anchor
 *   - step 6: "Book my free advisory session" → /book localized
 *   - steps 2, 3, 5: no CTA button (text-only nurture)
 *
 * Throws on send failure so the worker can mark the row with
 * `last_error` and retry on its next tick — there is no fire-and-forget
 * here. `name` is optional; when present we render a personalised
 * greeting like "Hola Juan,", otherwise we fall back to "Hola,".
 */
export interface DripEmailData {
  email: string;
  name?: string | null;
  language: string | null;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Per-enrollment unsubscribe token persisted on the
   * `drip_enrollments.unsubscribe_token` column. When present we render
   * an RFC 8058 HTTPS one-click `List-Unsubscribe-Post: One-Click`
   * header so Gmail / Yahoo MUAs can unsubscribe the recipient with a
   * single click. Legacy rows that pre-date the token migration
   * gracefully fall back to the mailto form.
   */
  unsubToken?: string | null;
}

function dripCtaFor(step: 1 | 2 | 3 | 4 | 5 | 6, lang: SupportedLang, dripT: ReturnType<typeof getEmailTranslations>["drip"]): string {
  const campaign = `drip_step_${step}`;
  const content = `${lang}_step${step}`;
  if (step === 1) return ctaButton(withUtm(GUIDE_PDF_URL, "drip", campaign, content), dripT.ctaOpenGuide);
  if (step === 4) return ctaButton(withUtm(`${SITE_URL}/${lang}#calculadora`, "drip", campaign, content), dripT.ctaCalculate);
  if (step === 6) return ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "drip", campaign, content), dripT.ctaBook);
  return ""; // steps 2, 3, 5 are text-only nurture
}

/**
 * Pure renderer extracted for the snapshot tool — see
 * `scripts/email/render-all-snapshots.ts`. Returns the same HTML +
 * subject + List-Unsubscribe URL the live `sendDripEmailOnce` uses.
 * Does NOT enforce the production guide-PDF placeholder check (that
 * lives in the send path so snapshots can render step 1 even before
 * `GUIDE_PDF_URL` is set).
 */
export function renderDripEmailHtml(data: DripEmailData): { html: string; subject: string; lang: string; dripUnsub: string } {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const d = t.drip;
  const stepIdx = data.step - 1;
  const stepCopy = d.steps[stepIdx];
  if (!stepCopy) throw new Error(`drip: invalid step ${data.step}`);

  // Use only the first token of the name to avoid awkward greetings
  // like "Hola Juan García López,". Trim+collapse whitespace first.
  const safeName = data.name ? escapeHtml(data.name.trim().split(/\s+/)[0]) : null;
  const greeting = d.greeting(safeName);
  const cta = dripCtaFor(data.step, lang, d);
  const psHtml = stepCopy.ps ? bodyText(stepCopy.ps) : "";

  // Drip is bulk nurture content (6 emails / 15 days per enrollment), so a
  // `List-Unsubscribe` header is required to satisfy modern bulk-sender
  // expectations (Gmail / Yahoo Feb 2024) and to surface a native unsub
  // affordance in the recipient's MUA. When the row carries an
  // `unsubscribe_token` (post-migration), we render the RFC 8058 HTTPS
  // form with `List-Unsubscribe-Post: One-Click` so MUAs unsubscribe with
  // a single click. Legacy rows (token=null) gracefully fall back to the
  // mailto form so we never lose the unsub affordance entirely.
  // The same URL is also embedded as a visible footer link via
  // `unsubFooterWithLink` — drip is one of the templates the user
  // explicitly asked to surface a clickable Unsubscribe in the body
  // (along with newsletter and the calculator report). Booking emails
  // do not get this footer or the header.
  const oneClickUrl = buildDripUnsubUrl(data.unsubToken);
  const dripUnsub = oneClickUrl ?? `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20drip`;

  const clientBody = `
    ${heading(greeting)}

    ${stepCopy.paragraphs.map(p => bodyText(p)).join("\n")}

    ${cta}

    ${psHtml}

    ${brandSignature(lang, d.sigClosing)}
    ${unsubFooterWithLink(d.unsubNote, dripUnsub, UNSUB_LINK_I18N[lang])}
  `;

  const subject = stepCopy.subject;
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang, dripUnsub };
}

export async function sendDripEmailOnce(data: DripEmailData): Promise<void> {
  // Lead-magnet hard fail: drip step 1 advertises the guide PDF. If the
  // hosting URL is still the default placeholder in production we refuse
  // to send (throwing here propagates to the drip-worker, which calls
  // `markDripEnrollmentError()` — the row keeps `current_step = 0` and
  // is re-attempted on the next worker tick because `next_send_at` is
  // not advanced on failure) so a broken `/guide.pdf` link never reaches
  // a recipient. The boot-time `assertGuidePdfUrlReady()` already pages
  // on-call so the URL is fixed same-day; until it is, the row parks in
  // the drip table at step 0 rather than burning a first impression.
  if (data.step === 1 && process.env.NODE_ENV === "production" && GUIDE_PDF_URL === GUIDE_PDF_DEFAULT_PLACEHOLDER) {
    throw new Error("guide_pdf_url_not_configured");
  }

  const { html, subject, lang, dripUnsub } = renderDripEmailHtml(data);
  const logType = `drip_step_${data.step}`;
  const gmail = getGmailClient();

  if (!gmail) {
    logger.debug(`DRIP ${logType} (no Gmail): ${JSON.stringify({ email: maskEmail(data.email), lang })}`, "email");
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: "Gmail not configured" });
    throw new Error("Gmail not configured");
  }

  try {
    const ok = await sendEmail(data.email, subject, html, REPLY_TO_EMAIL, senderNameFor("drip"), undefined, undefined, { ...headerPolicyFor("marketing-bulk"), listUnsubscribe: dripUnsub, entityRefId: data.unsubToken ? `drip-${data.unsubToken}-step${data.step}` : undefined });
    if (!ok) {
      logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: "sendEmail returned false" });
      throw new Error("circuit_breaker_or_transient_failure");
    }
    logger.info(`Drip ${logType} sent → ${maskEmail(data.email)}`, "email");
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "enviado", clientLanguage: lang });
  } catch (err) {
    logger.error(`Drip ${logType} send failed:`, "email", err);
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: String(err) });
    throw err;
  }
}

/**
 * Public drip-step sender. Wrapped in the persistent retry queue so a
 * Gmail outage during a 6-email/15-day nurture sequence never silently
 * loses a step — the worker re-attempts with backoff (1m → 12h cap)
 * until success or `MAX_ATTEMPTS`. The drip-worker's own backoff
 * (`drip_enrollments.next_send_at`) governs WHEN to send each step;
 * this queue governs WHAT to do when a send-time attempt fails.
 */
export async function sendDripEmail(data: DripEmailData): Promise<void> {
  await withRetryQueue("drip_step", data, sendDripEmailOnce);
}
registerEmailRetryHandler("drip_step", async (payload) => {
  await sendDripEmailOnce(payload as DripEmailData);
});
