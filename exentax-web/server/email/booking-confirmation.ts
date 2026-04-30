import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang } from "../email-i18n";
import { registerEmailRetryHandler, enqueueEmail } from "../email-retry-queue";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  infoCard, greenPanel, meetingBlock, bulletList,
  WHATSAPP_URL, C_NEON_DK,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import type { BookingEmailData } from "../../shared/email";
import {
  REPLY_TO_EMAIL,
  getGmailClient,
  sendEmail,
  senderNameFor,
  withUtm,
  headerPolicyFor,
  logEmail,
  maskEmail,
} from "./transport";

/**
 * Pure renderer: builds the booking-confirmation email HTML + subject
 * for a given payload. Extracted so the snapshot tool
 * (`scripts/email/render-all-snapshots.ts`) can produce an HTML preview
 * for every language without going through the Gmail transport.
 * Called by `sendBookingConfirmationOnce` below.
 */
export function renderBookingConfirmationHtml(data: BookingEmailData): { html: string; subject: string; lang: string } {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const dateFormatted = t.dateFormatter(data.date);
  const safeName = escapeHtml(data.clientName);
  const firstName = safeName.split(" ")[0];
  const bt = t.booking;
  const agendaRef = data.agendaId || "—";

  const clientBody = `
    ${heading(bt.heading(firstName))}

    ${bodyText(bt.intro)}

    ${bodyText(bt.introDesc)}

    ${bodyText(bt.honestNote)}

    ${divider()}

    ${label(bt.detailsTitle)}

    ${infoCard([
      { icon: "calendar", label: bt.dateLabel, value: dateFormatted },
      { icon: "clock", label: bt.timeLabel, value: `${data.startTime} – ${data.endTime}` },
    ])}

    ${meetingBlock({ meetingType: data.meetingType, meetLink: data.meetLink, phone: data.phone, lang })}

    ${divider()}

    ${greenPanel(bt.prepareTitle, bulletList(bt.prepareItems))}

    ${divider()}

    ${greenPanel(bt.coverTitle, bulletList(bt.coverItems))}

    ${divider()}

    ${bodyText(`<strong>${bt.weDoNote1}</strong>`)}

    ${bodyText(bt.weDoNote2)}

    ${divider()}

    ${data.manageUrl
      ? `${bodyText(`${bt.ctaManage}:`)}${ctaButton(withUtm(data.manageUrl, "transactional", "booking_confirmation", lang), bt.ctaManage)}`
      : ""}

    ${bodyText(`${bt.orWrite} <a href="${WHATSAPP_URL}" style="color:${C_NEON_DK};font-weight:600;text-decoration:none;">WhatsApp</a>`)}

    ${bodyText(bt.closing)}

    ${brandSignature(lang)}
    ${unsubNote(bt.unsubNote)}
    ${unsubNote(`${bt.refLabel}: <strong>${agendaRef}</strong>`)}
  `;

  const subject = `${bt.subjectPrefix} | ${dateFormatted} ${data.startTime}`;
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang };
}

/**
 * Low-level send: actually attempts the booking-confirmation email and
 * THROWS on any failure (no enqueue, no swallowing). This is what the
 * persistent retry worker invokes so it can correctly track attempts and
 * apply exponential backoff. Public callers should use
 * `sendBookingConfirmation` which wraps this with enqueue-on-failure.
 */
async function sendBookingConfirmationOnce(data: BookingEmailData): Promise<void> {
  const { html: clientHtml, subject: clientSubj, lang } = renderBookingConfirmationHtml(data);
  const agendaRef = data.agendaId || "—";
  const gmail = getGmailClient();

  if (!gmail) {
    logEmail({ to: data.clientEmail, subject: clientSubj, type: "booking_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
    throw new Error("gmail_not_configured");
  }
  const ok = await sendEmail(data.clientEmail, clientSubj, clientHtml, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, { ...headerPolicyFor("transactional"), entityRefId: agendaRef !== "—" ? `booking-confirmation-${agendaRef}` : undefined });
  logEmail({ to: data.clientEmail, subject: clientSubj, type: "booking_confirmation", channel: "transactional", status: ok ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
  if (!ok) {
    // Circuit breaker open or transient send failed even after in-process retries.
    throw new Error("circuit_breaker_or_transient_failure");
  }
  logger.info(`Booking sent → ${maskEmail(data.clientEmail)}`, "email");
}

/**
 * Public API: send a booking confirmation email. Failures are caught and
 * persisted to the email_retry_queue so the worker can retry with backoff.
 * The worker calls `sendBookingConfirmationOnce` directly (which throws),
 * so it does not pass through this enqueue-on-failure wrapper — that is
 * what allows the worker's attempt counter and backoff to work correctly.
 */
export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  try {
    await sendBookingConfirmationOnce(data);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    if (reason !== "gmail_not_configured") {
      logger.error(`Booking email failed for ${maskEmail(data.clientEmail)}: ${reason}`, "email");
    } else {
      logger.error("BOOKING (no Gmail config): enqueuing for retry queue", "email");
    }
    await enqueueEmail("booking_confirmation", data, { reason });
  }
}

// Register the persistent retry handler so the queue worker can re-attempt
// booking confirmations later (e.g. after Gmail credentials are configured
// or after a transient SMTP outage clears). IMPORTANT: register the
// throwing low-level function — NOT the enqueue-wrapping public API —
// so the worker observes real failures and applies its backoff/cap logic.
registerEmailRetryHandler("booking_confirmation", async (payload) => {
  await sendBookingConfirmationOnce(payload as BookingEmailData);
});
