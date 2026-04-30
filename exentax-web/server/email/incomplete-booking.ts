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
  withRetryQueue,
} from "./transport";

/**
 * Recordatorio "Reserva incompleta": se envía a quien empezó el flujo de
 * booking (introdujo email + opcionalmente nombre) pero no llegó a
 * confirmar la cita. Disparado por el cron `incomplete-bookings.ts` a partir
 * de los drafts almacenados en la tabla `booking_drafts`.
 *
 * Tono: amistoso, sin urgencia, firmado por Claudia personalmente.
 * CTA: vuelve a la página localizada de reserva.
 */
export interface IncompleteBookingEmailData {
  clientEmail: string;
  clientName?: string | null;
  language: string | null;
}
/**
 * Pure renderer extracted for the snapshot tool — see
 * `scripts/email/render-all-snapshots.ts`. Returns the same HTML +
 * subject the live `sendIncompleteBookingEmailOnce` would push to Gmail.
 */
export function renderIncompleteBookingEmailHtml(data: IncompleteBookingEmailData): { html: string; subject: string; lang: string } {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ib = t.incompleteBooking;

  const rawFirstName = (data.clientName || "").trim().split(/\s+/)[0] || "";
  const firstName = rawFirstName ? escapeHtml(rawFirstName) : "";

  const subject = ib.subject;

  const clientBody = `
    ${heading(ib.heading(firstName || null))}

    ${bodyText(ib.intro1)}

    ${bodyText(ib.intro2)}

    ${bodyText(ib.intro3)}

    ${ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "transactional", "incomplete_booking", lang), ib.ctaLabel)}

    ${bodyText(ib.replyNote)}

    ${brandSignature(lang, ib.closing)}
    ${unsubNote(ib.unsubNote)}
  `;
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang };
}

async function sendIncompleteBookingEmailOnce(data: IncompleteBookingEmailData): Promise<void> {
  const { html, subject, lang } = renderIncompleteBookingEmailHtml(data);
  const gmail = getGmailClient();

  if (gmail) {
    try {
      const sent = await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, headerPolicyFor("transactional"));
      logger.info(`Incomplete-booking sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "incomplete_booking", channel: "transactional", status: sent ? "enviado" : "fallido", clientName: data.clientName || undefined, clientLanguage: lang });
      if (!sent) throw new Error("circuit_breaker_or_transient_failure");
    } catch (err) {
      logger.error("Incomplete-booking send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "incomplete_booking", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName || undefined });
      throw err;
    }
  } else {
    logger.debug("INCOMPLETE BOOKING (no Gmail): " + JSON.stringify({ email: maskEmail(data.clientEmail), lang }), "email");
    logEmail({ to: data.clientEmail, subject, type: "incomplete_booking", channel: "transactional", status: "fallido", error: "Gmail not configured", clientLanguage: lang });
    throw new Error("gmail_not_configured");
  }
}

export async function sendIncompleteBookingEmail(data: IncompleteBookingEmailData): Promise<void> {
  await withRetryQueue("incomplete_booking_reminder", data, sendIncompleteBookingEmailOnce);
}
registerEmailRetryHandler("incomplete_booking_reminder", async (payload) => {
  await sendIncompleteBookingEmailOnce(payload as IncompleteBookingEmailData);
});
