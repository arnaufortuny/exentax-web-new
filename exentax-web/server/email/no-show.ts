import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  SITE_URL, WHATSAPP_URL, C_NEON_DK,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import { getLocalizedPath } from "../../shared/routes";
import type { NoShowEmailData } from "../../shared/email";
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

async function sendNoShowRescheduleEmailOnce(data: NoShowEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ns = t.noShow;
  const gmail = getGmailClient();
  const firstName = escapeHtml(data.clientName.split(" ")[0]);

  const clientBody = `
    ${heading(ns.heading(firstName))}

    ${bodyText(ns.intro)}

    ${bodyText(ns.understandNote)}

    ${divider()}

    ${bodyText(ns.rebookIntro)}

    ${ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "transactional", "noshow_reschedule", lang), ns.ctaRebook)}

    ${bodyText(ns.sessionDesc)}

    ${divider()}

    ${bodyText(`${ns.whatsappIntro} <a href="${WHATSAPP_URL}" style="color:${C_NEON_DK};font-weight:600;text-decoration:none;">WhatsApp</a>`)}

    ${brandSignature(lang, ns.closing)}
    ${unsubNote(ns.unsubNote)}
  `;

  const subject = ns.subject;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      const sent = await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, headerPolicyFor("transactional"));
      logger.info(`No-show reschedule sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "noshow_reschedule", channel: "transactional", status: sent ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang });
      if (!sent) throw new Error("circuit_breaker_or_transient_failure");
    } catch (err) {
      logger.error("No-show reschedule send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "noshow_reschedule", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("NO-SHOW (no Gmail): " + JSON.stringify({ client: `${maskName(data.clientName)} <${maskEmail(data.clientEmail)}>` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "noshow_reschedule", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
    throw new Error("gmail_not_configured");
  }
}

export async function sendNoShowRescheduleEmail(data: NoShowEmailData): Promise<void> {
  await withRetryQueue("no_show_followup", data, sendNoShowRescheduleEmailOnce);
}
registerEmailRetryHandler("no_show_followup", async (payload) => {
  await sendNoShowRescheduleEmailOnce(payload as NoShowEmailData);
});
