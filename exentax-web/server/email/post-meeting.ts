import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, heading, bodyText, ctaButton, brandSignature, unsubNote,
  SITE_URL,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import { getLocalizedPath } from "../../shared/routes";
import {
  REPLY_TO_EMAIL,
  getGmailClient,
  sendEmail,
  senderNameFor,
  withUtm,
  headerPolicyFor,
  logEmail,
  maskEmail,
  maskName,
  withRetryQueue,
} from "./transport";

/**
 * Manual follow-up email sent by an operator from Discord (`/cita email
 * tipo:seguimiento`). It is intentionally short and template-free — the
 * goal is a friendly check-in after a closed/contacted booking, not a
 * full transactional notification. Subject and CTA stay localized via
 * the shared booking translations so it speaks the client's language.
 */
export interface FollowupEmailData {
  clientName: string;
  clientEmail: string;
  language: string | null;
}
async function sendFollowupEmailOnce(data: FollowupEmailData): Promise<void> {
  // Self-contained i18n: all user-visible strings come from t.followup.
  // No cross-template dependency on t.noShow — each email template owns
  // its own subject, heading, intro, CTA, closing and unsubNote.
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const fu = t.followup;
  const gmail = getGmailClient();
  const firstName = escapeHtml(data.clientName.split(" ")[0]);

  const subject = fu.subject;
  const intro = fu.intro(firstName);
  const ctaLabel = fu.ctaLabel;

  const clientBody = `
    ${heading(fu.heading(firstName))}

    ${bodyText(intro)}

    ${ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "transactional", "followup", lang), ctaLabel)}

    ${brandSignature(lang, fu.closing)}
    ${unsubNote(fu.unsubNote)}
  `;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      const sent = await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, headerPolicyFor("transactional"));
      logger.info(`Follow-up sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "followup", channel: "transactional", status: sent ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang });
      if (!sent) throw new Error("circuit_breaker_or_transient_failure");
    } catch (err) {
      logger.error("Follow-up send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "followup", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("FOLLOWUP (no Gmail): " + JSON.stringify({ client: `${maskName(data.clientName)} <${maskEmail(data.clientEmail)}>` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "followup", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
    throw new Error("gmail_not_configured");
  }
}

export async function sendFollowupEmail(data: FollowupEmailData): Promise<void> {
  await withRetryQueue("post_meeting_followup", data, sendFollowupEmailOnce);
}
registerEmailRetryHandler("post_meeting_followup", async (payload) => {
  await sendFollowupEmailOnce(payload as FollowupEmailData);
});
