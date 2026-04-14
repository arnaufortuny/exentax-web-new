import { google } from "googleapis";
import crypto from "crypto";
import { logger } from "./logger";
import { getGoogleServiceAccountKey } from "./google-credentials.js";
import { isTransient, isAuthError } from "./google-utils";
import { getEmailTranslations, resolveEmailLang, resolveLocalLabel } from "./email-i18n";
import { emailBreaker } from "./circuit-breaker";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, signOff, unsubNote,
  infoCard, greenPanel, meetBlock,
  SITE_URL, WHATSAPP_URL,
  C_BG, C_NEON, C_NEON_DK, C_TEXT_1, C_TEXT_2, C_TEXT_3, C_BORDER,
  C_ACCENT, C_ACCENT_BG, C_ACCENT_BD, F_STACK,
} from "./email-layout";
import { escapeHtml } from "./routes/shared";
import { BRAND_NAME, CONTACT_EMAIL } from "./server-constants";

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
  logger.debug(`email ${opts.status}: ${opts.type} → ${opts.to}`, "email");
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
        const delay = 1_000 * 2 ** attempt; // 1s, 2s, 4s
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
    ${label(bt.label)}
    ${heading(bt.heading(firstName))}

    ${bodyText(bt.body1)}

    ${bodyText(bt.body2)}

    ${bodyText(bt.body2b || "")}

    ${divider()}

    ${infoCard([
      { icon: "calendar", label: bt.dateLabel, value: dateFormatted },
      { icon: "clock", label: bt.timeLabel, value: `${data.startTime} – ${data.endTime}` },
      { icon: "pin", label: bt.formatLabel, value: bt.formatValue },
    ])}

    ${meetBlock(data.meetLink, lang)}

    ${greenPanel(bt.prepareTitle, `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${bt.prepareItems.map(item => `<tr><td style="padding:8px 0;font-family:${F_STACK};font-size:14px;color:${C_TEXT_2};line-height:1.7;"><span class="txt-neon" style="color:${C_NEON_DK};font-weight:700;margin-right:8px;">&#8594;</span>${item}</td></tr>`).join("")}
      </table>
    `)}

    ${divider()}

    ${bodyText(bt.changeTime)}

    ${data.manageUrl ? `${ctaButton(data.manageUrl, bt.ctaManage)}` : `${ctaButton(WHATSAPP_URL, bt.ctaWhatsapp)}`}

    ${bodyText(bt.honest, "8px")}

    ${bodyText(bt.trackingNote || "", "8px")}

    ${signOff(bt.signOff, lang)}
    ${unsubNote(`${bt.unsubNote} &middot; <a href="${SITE_URL}/legal/privacidad" style="color:${C_TEXT_3};text-decoration:none;">${bt.privacyLabel}</a>`)}
    ${unsubNote(`ID: <strong>${agendaRef}</strong>`)}
  `;

  const clientHtml = emailHtml(clientBody, `${bt.label} | ${dateFormatted} ${data.startTime}`, lang);

  if (gmail) {
    const clientSubj = `${bt.label} | ${dateFormatted} ${data.startTime}`;
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
    logEmail({ to: data.clientEmail, subject: `${bt.label}`, type: "booking_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
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
  gastosDeducibles?: number;
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
  const monthlyF = t.currencyFormatter(data.income);
  const annualF = t.currencyFormatter(data.annualIncome ?? data.income * 12);
  const leadRef = data.leadId || "—";
  const localLabel = resolveLocalLabel(data.localLabel, lang);

  const clientBody = `
    ${label(ct.label)}
    ${heading(ct.heading)}

    ${bodyText(ct.body1(localLabel, monthlyF, annualF))}

    ${bodyText(ct.body1b || "")}

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td style="padding:14px 20px;background-color:${C_ACCENT_BG};border:1px solid ${C_ACCENT_BD};border-radius:16px;text-align:center;" bgcolor="${C_ACCENT_BG}">
          <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 4px;font-weight:600;">${ct.payingLabel}</p>
          <p class="txt-accent" style="font-family:${F_STACK};font-size:28px;font-weight:700;color:${C_ACCENT};margin:0;">${sinLLCF}<span class="txt-3" style="font-family:${F_STACK};font-size:13px;font-weight:500;color:${C_TEXT_3};"> /${ct.perYear}</span></p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td class="bg-dark" style="padding:14px 20px;background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:16px;text-align:center;" bgcolor="${C_BG}">
          <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 4px;font-weight:600;">${ct.withLLCLabel}</p>
          <p class="txt-neon" style="font-family:${F_STACK};font-size:28px;font-weight:700;color:${C_NEON_DK};margin:0;">${conLLCF}<span class="txt-3" style="font-family:${F_STACK};font-size:13px;font-weight:500;color:${C_TEXT_3};"> /${ct.perYear}</span></p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;">
      <tr><td class="bg-dark" style="background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:20px;padding:28px 24px;text-align:center;" bgcolor="${C_BG}">
        <p class="txt-neon" style="font-family:${F_STACK};font-size:10px;font-weight:700;color:${C_NEON_DK};text-transform:uppercase;margin:0 0 10px;">${ct.savingsLabel}</p>
        <p class="txt-neon-bright" style="font-family:${F_STACK};font-size:44px;font-weight:700;color:${C_NEON};margin:0;line-height:1;">${ahorroF}</p>
        <p class="txt-3" style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_3};margin:10px 0 0;">${ct.perYear}</p>
      </td></tr>
    </table>

    ${bodyText(ct.body2)}

    ${bodyText(ct.body3)}

    ${bodyText(ct.body3b || "")}

    ${divider()}

    ${bodyText(ct.body4)}

    ${ctaButton(`${SITE_URL}/agendar-asesoria`, ct.ctaButton)}

    ${bodyText(ct.body5)}

    ${bodyText(ct.honest, "8px")}

    ${signOff(ct.signOff, lang)}
    ${unsubNote(`${ct.unsubNote} &middot; <a href="${SITE_URL}/legal/privacidad" style="color:${C_TEXT_3};text-decoration:none;">${ct.privacyLabel}</a>`)}
  `;

  const clientHtml = emailHtml(clientBody, `${ct.label} | ${ahorroF}`, lang);

  if (gmail) {
    try {
      const sent = await sendEmail(data.email, `${ct.label} | ${ahorroF}`, clientHtml, REPLY_TO_EMAIL);
      logger.info(`Calculator lead sent → ${data.email}`, "email");
      logEmail({ to: data.email, subject: `${ct.label} | ${ahorroF}`, type: "calculator_result", channel: "transactional", status: sent ? "enviado" : "fallido", clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    } catch (err) {
      logger.error(`Calculator email failed for ${data.email}:`, "email", err);
      logEmail({ to: data.email, subject: `${ct.label} | ${ahorroF}`, type: "calculator_result", channel: "transactional", status: "fallido", error: String(err), clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    }
  } else {
    logger.debug("CALCULATOR LEAD (no Gmail): " + JSON.stringify({ email: data.email, phone: data.phone, income: monthlyF, ahorro: ahorroF, leadId: leadRef }), "email");
    logEmail({ to: data.email, subject: `${ct.label}`, type: "calculator_result", channel: "transactional", status: "fallido", error: "Gmail not configured", relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
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
    ${label(rt.label)}
    ${heading(rt.heading(firstName))}

    ${bodyText(rt.body1(data.startTime))}

    ${bodyText(rt.body2)}

    ${meetBlock(data.meetLink, lang)}

    ${bodyText(rt.body3)}

    ${bodyText(rt.body4)}

    ${bodyText(rt.body4b || "")}

    ${signOff(rt.signOff, lang)}
    ${unsubNote(rt.unsubNote)}
  `;

  const html = emailHtml(clientBody, `${rt.label} | ${data.startTime}`, lang);

  const reminderSubj = `${rt.label} | ${data.startTime}`;
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
    ${label(rt.label)}
    ${heading(rt.heading(firstName))}

    ${bodyText(rt.body1)}

    ${divider()}

    ${infoCard([
      { icon: "calendar", label: rt.dateLabel, value: dateFormatted },
      { icon: "clock", label: rt.timeLabel, value: `${data.startTime} – ${data.endTime}` },
      { icon: "pin", label: rt.formatLabel, value: rt.formatValue },
    ])}

    ${meetBlock(data.meetLink, lang)}

    ${bodyText(rt.body2)}

    ${ctaButton(data.manageUrl, rt.ctaManage)}

    ${signOff(rt.signOff, lang)}
    ${unsubNote(rt.unsubNote)}
  `;

  const subject = rt.label;
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
    ${label(ct.label)}
    ${heading(ct.heading(firstName))}

    ${bodyText(ct.body1)}

    ${divider()}

    ${bodyText(ct.body2)}

    ${infoCard([
      { icon: "calendar", label: ct.dateLabel, value: dateFormatted },
      { icon: "clock", label: ct.timeLabel, value: `${data.startTime} – ${data.endTime}` },
    ])}

    ${ctaButton(SITE_URL + "/booking", ct.ctaRebook)}

    ${signOff(ct.signOff, lang)}
    ${unsubNote(ct.unsubNote)}
  `;

  const subject = ct.label;
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


