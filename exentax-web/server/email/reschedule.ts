import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  infoCard, meetingBlock,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import type { RescheduleEmailData } from "../../shared/email";
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

async function sendRescheduleConfirmationOnce(data: RescheduleEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const rt = t.reschedule;
  const gmail = getGmailClient();
  const safeName = escapeHtml(data.clientName);
  const firstName = safeName.split(" ")[0];
  const dateFormatted = t.dateFormatter(data.date);

  const clientBody = `
    ${heading(rt.heading(firstName))}

    ${bodyText(rt.intro)}

    ${infoCard([
      { icon: "calendar", label: rt.dateLabel, value: dateFormatted },
      { icon: "clock", label: rt.timeLabel, value: `${data.startTime} – ${data.endTime}` },
    ])}

    ${meetingBlock({ meetingType: data.meetingType, meetLink: data.meetLink, phone: data.phone, lang })}

    ${divider()}

    ${bodyText(rt.focusNote)}

    ${divider()}

    ${bodyText(rt.manageNote)}

    ${ctaButton(withUtm(data.manageUrl, "transactional", "reschedule_confirmation", lang), rt.ctaManage)}

    ${brandSignature(lang, rt.closing)}
    ${unsubNote(rt.unsubNote)}
  `;

  const subject = rt.subject;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      const sent = await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, headerPolicyFor("transactional"));
      logger.info(`Reschedule confirmation sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "reschedule_confirmation", channel: "transactional", status: sent ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang });
      if (!sent) throw new Error("circuit_breaker_or_transient_failure");
    } catch (err) {
      logger.error("Reschedule confirmation send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "reschedule_confirmation", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("RESCHEDULE (no Gmail): " + JSON.stringify({ client: `${maskName(data.clientName)} <${maskEmail(data.clientEmail)}>`, date: `${data.date} ${data.startTime}–${data.endTime}` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "reschedule_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
    throw new Error("gmail_not_configured");
  }
}

export async function sendRescheduleConfirmation(data: RescheduleEmailData): Promise<void> {
  await withRetryQueue("reschedule_notification", data, sendRescheduleConfirmationOnce);
}
registerEmailRetryHandler("reschedule_notification", async (payload) => {
  await sendRescheduleConfirmationOnce(payload as RescheduleEmailData);
});
