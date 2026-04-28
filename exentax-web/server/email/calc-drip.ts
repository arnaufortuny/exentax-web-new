import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang, UNSUB_LINK_I18N } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, heading, bodyText, ctaButton, brandSignature, unsubFooterWithLink,
  SITE_URL,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import { getLocalizedPath } from "../../shared/routes";
import {
  SENDER_EMAIL,
  REPLY_TO_EMAIL,
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
 * Calculator nurture sequence — 3 follow-up emails fired by the same
 * `drip-worker` after the IMMEDIATE personalised result email
 * (`sendCalculatorEmail`) on day 0. Cadence: day 2 / 4 / 6 from
 * enrollment, identical retry / backoff semantics to `sendDripEmail`.
 *
 * The worker dispatches by enrollment `source`: rows with
 * `source='calculator'` route here (`step 1..3`); rows with
 * `source='guide'` route to `sendDripEmail` (`step 1..6`). Booking
 * confirmations no longer enroll into any drip — they only fire the
 * single transactional confirmation + the day-before reminder.
 *
 * Every step closes with the same single CTA (book a free
 * consultation) — the calculator funnel is binary: either the lead
 * books or they unsub. The hard fail / placeholder check that guards
 * the guide drip step 1 does not apply here because no calc-drip
 * email links to the guide PDF.
 */
export interface CalcDripEmailData {
  email: string;
  name?: string | null;
  language: string | null;
  step: 1 | 2 | 3;
  unsubToken?: string | null;
}

export async function sendCalcDripEmailOnce(data: CalcDripEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const d = t.calcDrip;
  const stepIdx = data.step - 1;
  const stepCopy = d.steps[stepIdx];
  if (!stepCopy) throw new Error(`calc_drip: invalid step ${data.step}`);

  const safeName = data.name ? escapeHtml(data.name.trim().split(/\s+/)[0]) : null;
  const greeting = d.greeting(safeName);

  const campaign = `calc_drip_step_${data.step}`;
  const content = `${lang}_step${data.step}`;
  // utm_medium = "drip" (calculator nurture is bulk drip, same family
  // as the guide drip for downstream attribution); the campaign label
  // disambiguates: `calc_drip_step_${n}` vs `drip_step_${n}`. Note that
  // the `withUtm(...)` call MUST be inlined inside the `ctaButton(...)`
  // first arg — the deliverability lint Rule 7 sweeps for that exact
  // syntactic shape and will fail if we pass a pre-computed `ctaUrl`
  // variable instead.
  const cta = ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "drip", campaign, content), d.ctaBook);
  const psHtml = stepCopy.ps ? bodyText(stepCopy.ps) : "";

  const oneClickUrl = buildDripUnsubUrl(data.unsubToken);
  const dripUnsub = oneClickUrl ?? `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20calc_drip`;

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
  const logType = `calc_drip_step_${data.step}`;
  const gmail = getGmailClient();

  if (!gmail) {
    logger.debug(`CALC_DRIP ${logType} (no Gmail): ${JSON.stringify({ email: maskEmail(data.email), lang })}`, "email");
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: "Gmail not configured" });
    throw new Error("Gmail not configured");
  }

  try {
    const ok = await sendEmail(data.email, subject, html, REPLY_TO_EMAIL, senderNameFor("drip"), undefined, undefined, { ...headerPolicyFor("marketing-bulk"), listUnsubscribe: dripUnsub, entityRefId: data.unsubToken ? `calc_drip-${data.unsubToken}-step${data.step}` : undefined });
    if (!ok) {
      logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: "sendEmail returned false" });
      throw new Error("circuit_breaker_or_transient_failure");
    }
    logger.info(`Calc drip ${logType} sent → ${maskEmail(data.email)}`, "email");
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "enviado", clientLanguage: lang });
  } catch (err) {
    logger.error(`Calc drip ${logType} send failed:`, "email", err);
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: String(err) });
    throw err;
  }
}

export async function sendCalcDripEmail(data: CalcDripEmailData): Promise<void> {
  await withRetryQueue("calc_drip_step", data, sendCalcDripEmailOnce);
}
registerEmailRetryHandler("calc_drip_step", async (payload) => {
  await sendCalcDripEmailOnce(payload as CalcDripEmailData);
});
