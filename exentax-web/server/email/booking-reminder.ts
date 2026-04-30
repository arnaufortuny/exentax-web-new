import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  infoCard, greenPanel, meetingBlock, bulletList,
  C_TEXT_3,
} from "../email-layout";
import { buildIcsAttachment, buildGoogleCalendarUrl } from "../calendar-invite";
import { escapeHtml } from "../routes/shared";
import type { ReminderEmailData } from "../../shared/email";
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
 * Pure renderer: builds the reminder email HTML + subject + the .ics
 * attachment for a given payload. Extracted so the snapshot tool can
 * preview the rendered HTML for every language without going through
 * Gmail. Called by `sendReminderEmailOnce` below.
 */
export function renderReminderEmailHtml(data: ReminderEmailData): {
  html: string;
  subject: string;
  lang: string;
  icsAttachment: ReturnType<typeof buildIcsAttachment>;
} {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const rt = t.reminder;
  const firstName = escapeHtml(data.clientName.split(" ")[0]);
  const dateFormatted = t.dateFormatter(data.date);

  // Build the calendar invite (.ics) and the one-click "Add to Google
  // Calendar" link from the same canonical Madrid wall-time. The .ics covers
  // Apple Calendar / Outlook / Fastmail and the link covers Gmail users that
  // would rather not download an attachment. Both are derived from the same
  // booking row so they cannot drift.
  const calendarSummary = rt.calendarSummary;
  const calendarDescription = rt.calendarDescription(data.manageUrl ?? null);
  const calendarPayload = {
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    summary: calendarSummary,
    description: calendarDescription,
    meetingType: data.meetingType,
    meetLink: data.meetLink,
    phone: data.phone,
    manageUrl: data.manageUrl,
    agendaId: data.agendaId ?? null,
    clientEmail: data.clientEmail,
    phoneCallLabel: rt.phoneCallLocation,
  };
  const icsAttachment = buildIcsAttachment(calendarPayload);
  const googleCalUrl = buildGoogleCalendarUrl(calendarPayload);

  const timeValue = `${data.startTime} – ${data.endTime} <span style="color:${C_TEXT_3};font-weight:500;">· ${escapeHtml(rt.timezoneNote)}</span>`;

  const clientBody = `
    ${heading(rt.heading(firstName))}

    ${bodyText(rt.intro)}

    ${label(rt.detailsTitle)}

    ${infoCard([
      { icon: "calendar", label: rt.dateLabel, value: dateFormatted },
      { icon: "clock", label: rt.timeLabel, value: timeValue },
    ])}

    ${meetingBlock({ meetingType: data.meetingType, meetLink: data.meetLink, phone: data.phone, lang })}

    ${divider()}

    ${bodyText(`<strong>${rt.briefTitle}</strong>`)}

    ${bodyText(rt.briefDesc)}

    ${divider()}

    ${greenPanel(rt.prepareTitle, bulletList(rt.prepareItems))}

    ${bodyText(rt.prepareNote)}

    ${divider()}

    ${label(rt.addCalendarTitle)}

    ${bodyText(rt.addCalendarDesc)}

    ${ctaButton(withUtm(googleCalUrl, "transactional", "reminder", lang), rt.addCalendarCta)}

    ${bodyText(rt.icsAttachedNote)}

    ${data.manageUrl
      ? `${divider()}

    ${label(rt.manageTitle)}

    ${bodyText(rt.manageDesc)}

    ${ctaButton(withUtm(data.manageUrl, "transactional", "reminder", lang), rt.ctaManage)}`
      : ""}

    ${brandSignature(lang, rt.closing)}
    ${unsubNote(rt.unsubNote)}
  `;

  const subject = rt.subject(data.startTime);
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang, icsAttachment };
}

async function sendReminderEmailOnce(data: ReminderEmailData): Promise<void> {
  const { html, subject: reminderSubj, lang, icsAttachment } = renderReminderEmailHtml(data);
  const gmail = getGmailClient();

  if (gmail) {
    try {
      const sent = await sendEmail(data.clientEmail, reminderSubj, html, REPLY_TO_EMAIL, senderNameFor("transactional"), [icsAttachment], undefined, headerPolicyFor("transactional"));
      logger.info(`Reminder sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject: reminderSubj, type: "reminder", channel: "transactional", status: sent ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang });
      if (!sent) throw new Error("circuit_breaker_or_transient_failure");
    } catch (err) {
      logger.error("Reminder send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject: reminderSubj, type: "reminder", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("REMINDER (no Gmail): " + JSON.stringify({ client: `${maskName(data.clientName)} <${maskEmail(data.clientEmail)}>`, date: `${data.date} ${data.startTime}–${data.endTime}` }), "email");
    logEmail({ to: data.clientEmail, subject: reminderSubj, type: "reminder", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
    throw new Error("gmail_not_configured");
  }
}

export async function sendReminderEmail(data: ReminderEmailData): Promise<void> {
  await withRetryQueue("booking_reminder", data, sendReminderEmailOnce);
}
registerEmailRetryHandler("booking_reminder", async (payload) => {
  await sendReminderEmailOnce(payload as ReminderEmailData);
});
