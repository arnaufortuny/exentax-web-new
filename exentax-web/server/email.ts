import { google } from "googleapis";
import crypto from "crypto";
import { logger } from "./logger";
import { getGoogleServiceAccountKey } from "./google-credentials.js";
import { isTransient, isAuthError } from "./google-utils";
import { getEmailTranslations, resolveEmailLang, resolveLocalLabel } from "./email-i18n";
import { emailBreaker } from "./circuit-breaker";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  infoCard, greenPanel, meetBlock, bulletList,
  SITE_URL, WHATSAPP_URL,
  C_BG, C_NEON, C_NEON_DK, C_TEXT_1, C_TEXT_2, C_TEXT_3, C_BORDER,
  C_ACCENT, C_ACCENT_BG, C_ACCENT_BD, F_STACK,
} from "./email-layout";
import { escapeHtml } from "./routes/shared";
import { BRAND_NAME, CONTACT_EMAIL } from "./server-constants";
import { getLocalizedPath } from "../shared/routes";

const SENDER_EMAIL = CONTACT_EMAIL;
const REPLY_TO_EMAIL = CONTACT_EMAIL;
const FROM_NAME = BRAND_NAME;

interface LogEmailOpts {
  to: string;
  subject: string;
  type: string;
  channel: string;
  status: "enviado" | "fallido";
  error?: string;
  clientName?: string;
  clientLanguage?: string;
  relatedId?: string;
  relatedType?: string;
}

function logEmail(opts: LogEmailOpts): void {
  const parts = [`email ${opts.status}: ${opts.type} → ${opts.to}`];
  if (opts.clientName) parts.push(`client=${opts.clientName}`);
  if (opts.relatedId) parts.push(`ref=${opts.relatedType || "unknown"}:${opts.relatedId}`);
  if (opts.error) parts.push(`err=${opts.error.slice(0, 120)}`);
  logger.debug(parts.join(" | "), "email");
}

let gmailClient: ReturnType<typeof google.gmail> | null = null;

function resetGmailClient(): void {
  gmailClient = null;
  logger.warn("Client reset | will reconnect on next call.", "email");
}

function getGmailClient() {
  if (gmailClient) return gmailClient;
  const key = getGoogleServiceAccountKey();
  if (!key.private_key || !key.client_email) {
    return null;
  }
  try {
    const auth = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
      subject: SENDER_EMAIL,
    });
    gmailClient = google.gmail({ version: "v1", auth });
    return gmailClient;
  } catch (err) {
    logger.error("Failed to initialize Gmail client:", "email", err);
    return null;
  }
}

interface EmailAttachment {
  filename: string;
  mimeType: string;
  content: Buffer;
}

interface BuildRawOpts {
  listUnsubscribe?: string;
}

function buildRaw(to: string, subject: string, html: string, replyTo?: string, fromName = FROM_NAME, attachments?: EmailAttachment[], bcc?: string, opts?: BuildRawOpts): string {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageId = `<${crypto.randomBytes(12).toString("hex")}@${SENDER_EMAIL.split("@")[1] || "exentax.com"}>`;

  if (!attachments || attachments.length === 0) {
    const htmlBase64 = Buffer.from(html).toString("base64");
    const lines = [
      `From: "${fromName}" <${SENDER_EMAIL}>`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      `Message-ID: ${messageId}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
    ];
    if (bcc) lines.push(`Bcc: ${bcc}`);
    if (replyTo) lines.push(`Reply-To: ${replyTo}`);
    if (opts?.listUnsubscribe) {
      lines.push(`List-Unsubscribe: <${opts.listUnsubscribe}>`);
      lines.push(`List-Unsubscribe-Post: List-Unsubscribe=One-Click`);
    }
    lines.push("", htmlBase64);
    return Buffer.from(lines.join("\r\n")).toString("base64url");
  }

  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const headers = [
    `From: "${fromName}" <${SENDER_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ];
  if (bcc) headers.push(`Bcc: ${bcc}`);
  if (replyTo) headers.push(`Reply-To: ${replyTo}`);
  if (opts?.listUnsubscribe) {
    headers.push(`List-Unsubscribe: <${opts.listUnsubscribe}>`);
    headers.push(`List-Unsubscribe-Post: List-Unsubscribe=One-Click`);
  }

  const parts: string[] = [];
  parts.push(`--${boundary}`);
  parts.push(`Content-Type: text/html; charset=UTF-8`);
  parts.push(`Content-Transfer-Encoding: base64`);
  parts.push("");
  parts.push(Buffer.from(html).toString("base64"));

  for (const att of attachments) {
    const encodedName = `=?UTF-8?B?${Buffer.from(att.filename).toString("base64")}?=`;
    parts.push(`--${boundary}`);
    parts.push(`Content-Type: ${att.mimeType}; name="${encodedName}"`);
    parts.push(`Content-Disposition: attachment; filename="${encodedName}"`);
    parts.push(`Content-Transfer-Encoding: base64`);
    parts.push("");
    parts.push(att.content.toString("base64"));
  }
  parts.push(`--${boundary}--`);

  const raw = headers.join("\r\n") + "\r\n\r\n" + parts.join("\r\n");
  return Buffer.from(raw).toString("base64url");
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string, fromName = FROM_NAME, attachments?: EmailAttachment[], bcc?: string, rawOpts?: BuildRawOpts): Promise<boolean> {
  return emailBreaker.execute(
    () => _sendEmailInternal(to, subject, html, replyTo, fromName, attachments, bcc, rawOpts),
    () => {
      logger.warn(`Circuit breaker open | email to ${to} not sent`, "email");
      return false;
    },
  );
}

const EMAIL_MAX_RETRIES = 3;

async function _sendEmailInternal(to: string, subject: string, html: string, replyTo?: string, fromName = FROM_NAME, attachments?: EmailAttachment[], bcc?: string, rawOpts?: BuildRawOpts): Promise<boolean> {
  for (let attempt = 0; attempt < EMAIL_MAX_RETRIES; attempt++) {
    const gmail = getGmailClient();
    if (!gmail) return false;
    try {
      await gmail.users.messages.send({ userId: "me", requestBody: { raw: buildRaw(to, subject, html, replyTo, fromName, attachments, bcc, rawOpts) } });
      return true;
    } catch (err) {
      const isRetryable = isTransient(err) || isAuthError(err);
      if (isRetryable && attempt < EMAIL_MAX_RETRIES - 1) {
        const delay = 1_000 * 2 ** attempt;
        logger.warn(`Transient email error (attempt ${attempt + 1}/${EMAIL_MAX_RETRIES}), retrying in ${delay}ms...`, "email");
        if (isAuthError(err)) resetGmailClient();
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      logger.error(`Failed to send email to ${to} after ${attempt + 1} attempt(s):`, "email", err);
      throw err;
    }
  }
  return false;
}

export type { EmailAttachment };


interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  phone?: string | null;
  notes?: string | null;
  context?: string | null;
  language?: string | null;
  clientIp?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
  beneficioMensual?: string;
  clientesMundiales?: boolean;
  operaDigital?: boolean;
  notaCompartir?: string;
  manageUrl?: string | null;
  agendaId?: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const dateFormatted = t.dateFormatter(data.date);
  const gmail = getGmailClient();
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

    ${meetBlock(data.meetLink, lang)}

    ${divider()}

    ${greenPanel(bt.prepareTitle, bulletList(bt.prepareItems))}

    ${divider()}

    ${greenPanel(bt.coverTitle, bulletList(bt.coverItems))}

    ${divider()}

    ${bodyText(`<strong>${bt.weDoNote1}</strong>`)}

    ${bodyText(bt.weDoNote2)}

    ${divider()}

    ${data.manageUrl
      ? `${bodyText(`${bt.ctaManage}:`)}${ctaButton(data.manageUrl, bt.ctaManage)}`
      : ""}

    ${bodyText(`${bt.orWrite} <a href="${WHATSAPP_URL}" style="color:${C_NEON_DK};font-weight:600;text-decoration:none;">WhatsApp</a>`)}

    ${bodyText(bt.closing)}

    ${brandSignature(lang)}
    ${unsubNote(bt.unsubNote)}
    ${unsubNote(`${bt.refLabel}: <strong>${agendaRef}</strong>`)}
  `;

  const clientSubj = `${bt.subjectPrefix} | ${dateFormatted} ${data.startTime}`;
  const clientHtml = emailHtml(clientBody, `${bt.subjectPrefix} | ${dateFormatted} ${data.startTime}`, lang);

  if (gmail) {
    try {
      const ok = await sendEmail(data.clientEmail, clientSubj, clientHtml, REPLY_TO_EMAIL);
      logger.info(`Booking sent → ${data.clientEmail}`, "email");
      logEmail({ to: data.clientEmail, subject: clientSubj, type: "booking_confirmation", channel: "transactional", status: ok ? "enviado" : "fallido", clientName: data.clientName, clientLanguage: lang, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
    } catch (err) {
      logger.error(`Booking email failed for ${data.clientEmail}:`, "email", err);
      logEmail({ to: data.clientEmail, subject: clientSubj, type: "booking_confirmation", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName, clientLanguage: lang, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
    }
  } else {
    logger.error("BOOKING (no Gmail config): emails NOT sent for booking", "email");
    logEmail({ to: data.clientEmail, subject: clientSubj, type: "booking_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
  }
}

interface CalculatorEmailData {
  email: string;
  phone: string;
  country: string;
  regime: string;
  activity: string;
  income: number;
  incomeMode?: string;
  annualIncome?: number;
  effectiveRate?: number;
  ahorro: number;
  sinLLC: number;
  conLLC: number;
  localLabel: string;
  breakdown: Array<{ label: string; amount: number }>;
  calcSpainIrpf?: boolean;
  clientIp?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
  language?: string | null;
  leadId?: string;
}


export async function sendCalculatorEmail(data: CalculatorEmailData) {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ct = t.calculator;
  const gmail = getGmailClient();
  const ahorroF = t.currencyFormatter(data.ahorro);
  const sinLLCF = t.currencyFormatter(data.sinLLC);
  const conLLCF = t.currencyFormatter(data.conLLC);
  const annualF = t.currencyFormatter(data.annualIncome ?? data.income * 12);
  const leadRef = data.leadId || "—";
  const countryLabel = resolveLocalLabel(data.localLabel, lang);

  const clientBody = `
    ${heading(ct.heading(data.email.split("@")[0]))}

    ${bodyText(ct.intro)}

    ${divider()}

    ${label(ct.situationTitle)}

    ${infoCard([
      { icon: "pin", label: ct.residenceLabel, value: countryLabel },
      { icon: "calendar", label: ct.incomeLabel, value: annualF },
    ])}

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td style="padding:18px 20px;background-color:${C_ACCENT_BG};border:1px solid ${C_ACCENT_BD};border-radius:16px;text-align:center;" bgcolor="${C_ACCENT_BG}">
          <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 6px;font-weight:600;">${ct.currentTitle}</p>
          <p class="txt-2" style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 4px;">${ct.currentPrefix}</p>
          <p class="txt-accent" style="font-family:${F_STACK};font-size:28px;font-weight:700;color:${C_ACCENT};margin:0;">${sinLLCF}</p>
        </td>
      </tr>
    </table>

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td class="bg-dark" style="padding:18px 20px;background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:16px;text-align:center;" bgcolor="${C_BG}">
          <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 6px;font-weight:600;">${ct.optimizedTitle}</p>
          <p class="txt-2" style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 4px;">${ct.optimizedPrefix}</p>
          <p class="txt-neon" style="font-family:${F_STACK};font-size:28px;font-weight:700;color:${C_NEON_DK};margin:0;">${conLLCF}</p>
        </td>
      </tr>
    </table>

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;">
      <tr><td class="bg-dark" style="background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:20px;padding:28px 24px;text-align:center;" bgcolor="${C_BG}">
        <p class="txt-neon" style="font-family:${F_STACK};font-size:10px;font-weight:700;color:${C_NEON_DK};text-transform:uppercase;margin:0 0 10px;">${ct.differenceTitle}</p>
        <p class="txt-neon-bright" style="font-family:${F_STACK};font-size:44px;font-weight:700;color:${C_NEON};margin:0;line-height:1;">${ahorroF}</p>
        <p class="txt-3" style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_3};margin:10px 0 0;">${ct.perYear}</p>
      </td></tr>
    </table>

    ${divider()}

    ${bodyText(ct.disclaimer)}

    ${bodyText(ct.keyIntro)}

    ${bulletList(ct.keyItems)}

    ${divider()}

    ${bodyText(`<strong>${ct.failNote}</strong>`)}

    ${divider()}

    ${label(ct.whatWeDoTitle)}

    ${bodyText(ct.whatWeDoIntro1)}

    ${bodyText(ct.whatWeDoIntro2)}

    ${bulletList(ct.whatWeDoItems)}

    ${bodyText(ct.whatWeDoDisclaimer, "8px")}

    ${divider()}

    ${bodyText(ct.ctaIntro)}

    ${ctaButton(`${SITE_URL}${getLocalizedPath("book", lang)}`, ct.ctaButton)}

    ${bodyText(ct.ctaDesc)}

    ${brandSignature(lang)}
    ${unsubNote(ct.unsubNote)}
  `;

  const clientHtml = emailHtml(clientBody, `${ct.subjectPrefix} | ${ahorroF}`, lang);

  if (gmail) {
    try {
      const sent = await sendEmail(data.email, `${ct.subjectPrefix} | ${ahorroF}`, clientHtml, REPLY_TO_EMAIL);
      logger.info(`Calculator lead sent → ${data.email}`, "email");
      logEmail({ to: data.email, subject: `${ct.subjectPrefix} | ${ahorroF}`, type: "calculator_result", channel: "transactional", status: sent ? "enviado" : "fallido", clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    } catch (err) {
      logger.error(`Calculator email failed for ${data.email}:`, "email", err);
      logEmail({ to: data.email, subject: `${ct.subjectPrefix} | ${ahorroF}`, type: "calculator_result", channel: "transactional", status: "fallido", error: String(err), clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    }
  } else {
    logger.debug("CALCULATOR LEAD (no Gmail): " + JSON.stringify({ email: data.email, phone: data.phone, income: annualF, ahorro: ahorroF, leadId: leadRef }), "email");
    logEmail({ to: data.email, subject: `${ct.subjectPrefix}`, type: "calculator_result", channel: "transactional", status: "fallido", error: "Gmail not configured", relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
  }
}

interface ReminderEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  manageUrl?: string | null;
  language?: string | null;
}

export async function sendReminderEmail(data: ReminderEmailData) {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const rt = t.reminder;
  const gmail = getGmailClient();
  const firstName = escapeHtml(data.clientName.split(" ")[0]);

  const clientBody = `
    ${heading(rt.heading(firstName))}

    ${bodyText(rt.intro)}

    ${infoCard([
      { icon: "clock", label: rt.timeLabel, value: data.startTime },
    ])}

    ${meetBlock(data.meetLink, lang)}

    ${divider()}

    ${bodyText(`<strong>${rt.directTitle}</strong>`)}

    ${bodyText(rt.directDesc)}

    ${divider()}

    ${bodyText(rt.prepareTitle)}

    ${bulletList(rt.prepareItems)}

    ${bodyText(rt.prepareNote)}

    ${divider()}

    ${data.manageUrl
      ? `${bodyText(`${rt.imprevisto} <a href="${data.manageUrl}" style="color:${C_NEON_DK};font-weight:600;text-decoration:none;">${data.manageUrl}</a>`)}`
      : ""}

    ${brandSignature(lang, rt.closing)}
    ${unsubNote(rt.unsubNote)}
  `;

  const reminderSubj = `${rt.subjectPrefix} | ${data.startTime}`;
  const html = emailHtml(clientBody, `${rt.subjectPrefix} | ${data.startTime}`, lang);

  if (gmail) {
    try {
      await sendEmail(data.clientEmail, reminderSubj, html, REPLY_TO_EMAIL);
      logger.info(`Reminder sent → ${data.clientEmail}`, "email");
      logEmail({ to: data.clientEmail, subject: reminderSubj, type: "reminder", channel: "transactional", status: "enviado", clientName: data.clientName, clientLanguage: lang });
    } catch (err) {
      logger.error("Reminder send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject: reminderSubj, type: "reminder", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("REMINDER (no Gmail): " + JSON.stringify({ client: `${data.clientName} <${data.clientEmail}>`, date: `${data.date} ${data.startTime}–${data.endTime}` }), "email");
    logEmail({ to: data.clientEmail, subject: reminderSubj, type: "reminder", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
  }
}

interface RescheduleEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  manageUrl: string;
  language?: string | null;
}

export async function sendRescheduleConfirmation(data: RescheduleEmailData) {
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

    ${meetBlock(data.meetLink, lang)}

    ${divider()}

    ${bodyText(rt.focusNote)}

    ${divider()}

    ${bodyText(rt.manageNote)}

    ${ctaButton(data.manageUrl, rt.ctaManage)}

    ${brandSignature(lang, rt.closing)}
    ${unsubNote(rt.unsubNote)}
  `;

  const subject = rt.subject;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL);
      logger.info(`Reschedule confirmation sent → ${data.clientEmail}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "reschedule_confirmation", channel: "transactional", status: "enviado", clientName: data.clientName, clientLanguage: lang });
    } catch (err) {
      logger.error("Reschedule confirmation send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "reschedule_confirmation", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("RESCHEDULE (no Gmail): " + JSON.stringify({ client: `${data.clientName} <${data.clientEmail}>`, date: `${data.date} ${data.startTime}–${data.endTime}` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "reschedule_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
  }
}

interface CancellationEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  language?: string | null;
}

export async function sendCancellationEmail(data: CancellationEmailData) {
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

    ${ctaButton(`${SITE_URL}${getLocalizedPath("book", lang)}`, ct.ctaRebook)}

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
      await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL);
      logger.info(`Cancellation confirmation sent → ${data.clientEmail}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "cancellation_confirmation", channel: "transactional", status: "enviado", clientName: data.clientName, clientLanguage: lang });
    } catch (err) {
      logger.error("Cancellation confirmation send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "cancellation_confirmation", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("CANCELLATION (no Gmail): " + JSON.stringify({ client: `${data.clientName} <${data.clientEmail}>`, date: `${data.date} ${data.startTime}–${data.endTime}` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "cancellation_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
  }
}

interface NoShowEmailData {
  clientName: string;
  clientEmail: string;
  language?: string | null;
}

export async function sendNoShowRescheduleEmail(data: NoShowEmailData) {
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

    ${ctaButton(`${SITE_URL}${getLocalizedPath("book", lang)}`, ns.ctaRebook)}

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
      await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL);
      logger.info(`No-show reschedule sent → ${data.clientEmail}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "noshow_reschedule", channel: "transactional", status: "enviado", clientName: data.clientName, clientLanguage: lang });
    } catch (err) {
      logger.error("No-show reschedule send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "noshow_reschedule", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("NO-SHOW (no Gmail): " + JSON.stringify({ client: `${data.clientName} <${data.clientEmail}>` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "noshow_reschedule", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
  }
}

