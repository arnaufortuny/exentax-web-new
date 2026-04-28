import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  infoCard,
  SITE_URL, WHATSAPP_URL, C_NEON_DK,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import { getLocalizedPath } from "../../shared/routes";
import type { CancellationEmailData } from "../../shared/email";
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

async function sendCancellationEmailOnce(data: CancellationEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ct = t.cancellation;
  const gmail = getGmailClient();
  const safeName = escapeHtml(data.clientName);
  const firstName = safeName.split(" ")[0];
  const dateFormatted = t.dateFormatter(data.date);

  const clientBody = `
    ${heading(ct.heading(firstName))}

    ${bodyText(ct.intro)}

    ${infoCard([
      { icon: "calendar", label: ct.dateLabel, value: dateFormatted },
      { icon: "clock", label: ct.timeLabel, value: `${data.startTime} – ${data.endTime}` },
    ])}

    ${divider()}

    ${bodyText(ct.rebookNote)}

    ${ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "transactional", "cancellation_confirmation", lang), ct.ctaRebook)}

    ${bodyText(ct.rebookDesc)}

    ${divider()}

    ${bodyText(`${ct.whatsappNote} <a href="${WHATSAPP_URL}" style="color:${C_NEON_DK};font-weight:600;text-decoration:none;">WhatsApp</a>`)}

    ${brandSignature(lang)}
    ${unsubNote(ct.unsubNote)}
  `;

  const subject = ct.subject;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      const sent = await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, headerPolicyFor("transactional"));
      logger.info(`Cancellation confirmation sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "cancellation_confirmation", channel: "transactional", status: sent ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang });
      if (!sent) throw new Error("circuit_breaker_or_transient_failure");
    } catch (err) {
      logger.error("Cancellation confirmation send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "cancellation_confirmation", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("CANCELLATION (no Gmail): " + JSON.stringify({ client: `${maskName(data.clientName)} <${maskEmail(data.clientEmail)}>`, date: `${data.date} ${data.startTime}–${data.endTime}` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "cancellation_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
    throw new Error("gmail_not_configured");
  }
}

export async function sendCancellationEmail(data: CancellationEmailData): Promise<void> {
  await withRetryQueue("cancellation_notification", data, sendCancellationEmailOnce);
}
registerEmailRetryHandler("cancellation_notification", async (payload) => {
  await sendCancellationEmailOnce(payload as CancellationEmailData);
});
