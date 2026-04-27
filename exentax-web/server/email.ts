import { google } from "googleapis";
import crypto from "crypto";
import { logger } from "./logger";
import { getGoogleServiceAccountKey } from "./google-credentials.js";
import { isTransient, isAuthError } from "./google-utils";
import { getEmailTranslations, resolveEmailLang, resolveLocalLabel } from "./email-i18n";
import { emailBreaker } from "./circuit-breaker";
import { enqueueEmail, registerEmailRetryHandler } from "./email-retry-queue";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote,
  infoCard, greenPanel, meetBlock, meetingBlock, bulletList,
  SITE_URL, WHATSAPP_URL,
  C_BG, C_NEON, C_NEON_DK, C_TEXT_1, C_TEXT_2, C_TEXT_3, C_BORDER,
  C_ACCENT, C_ACCENT_BG, C_ACCENT_BD, F_STACK,
} from "./email-layout";
import { escapeHtml } from "./routes/shared";
import { FX_RATES_PER_EUR, convertFromEUR as fxConvertFromEUR } from "../shared/calculator-fx";
import { BRAND_NAME, CONTACT_EMAIL } from "./server-constants";
import { getLocalizedPath } from "../shared/routes";
import type {
  EmailAttachment,
  BookingEmailData,
  CalculatorEmailData,
  ReminderEmailData,
  RescheduleEmailData,
  CancellationEmailData,
  NoShowEmailData,
} from "../shared/email";

const SENDER_EMAIL = CONTACT_EMAIL;

/**
 * Mask an email for log output: keep first 3 chars of local part + first
 * char of domain TLD, redact the rest. Avoids exposing PII in logs while
 * keeping enough signal to debug ("did THIS user receive the email?").
 *
 *   maskEmail("alice.long@example.com") → "ali***@e***.com"
 *   maskEmail("a@b.co")                 → "a***@b***.co"
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return "(no-email)";
  const at = email.indexOf("@");
  if (at < 0) return "(invalid-email)";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  const tld = dot >= 0 ? domain.slice(dot) : "";
  const localMasked = local.length <= 3 ? local[0] + "***" : local.slice(0, 3) + "***";
  const domainMasked = domain.length <= 1 ? "***" : domain[0] + "***";
  return `${localMasked}@${domainMasked}${tld}`;
}
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

export function getGmailClient() {
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
      logger.warn(`Circuit breaker open | email to ${maskEmail(to)} not sent`, "email");
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
      logger.error(`Failed to send email to ${maskEmail(to)} after ${attempt + 1} attempt(s):`, "email", err);
      throw err;
    }
  }
  return false;
}

export type { EmailAttachment };


/**
 * Low-level send: actually attempts the booking-confirmation email and
 * THROWS on any failure (no enqueue, no swallowing). This is what the
 * persistent retry worker invokes so it can correctly track attempts and
 * apply exponential backoff. Public callers should use
 * `sendBookingConfirmation` which wraps this with enqueue-on-failure.
 */
async function sendBookingConfirmationOnce(data: BookingEmailData): Promise<void> {
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

  if (!gmail) {
    logEmail({ to: data.clientEmail, subject: clientSubj, type: "booking_confirmation", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName, relatedId: agendaRef !== "—" ? agendaRef : undefined, relatedType: "agenda" });
    throw new Error("gmail_not_configured");
  }
  const ok = await sendEmail(data.clientEmail, clientSubj, clientHtml, REPLY_TO_EMAIL);
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

export function renderCalculatorEmailHtml(data: CalculatorEmailData): { html: string; subject: string; lang: string } {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ct = t.calculator;
  // FX parity: same rates the UI uses (shared/calculator-fx.ts).
  const dc = (data.displayCurrency && (FX_RATES_PER_EUR as Record<string, number>)[data.displayCurrency]) ? data.displayCurrency : "EUR";
  const fmtMoney = (eurAmount: number): string => {
    const localized = t.currencyFormatter(Math.round(fxConvertFromEUR(eurAmount, dc)));
    return dc === "EUR" ? localized : `${localized} ${dc}`;
  };
  const ahorroF = fmtMoney(data.ahorro);
  const sinLLCF = fmtMoney(data.sinLLC);
  const conLLCF = fmtMoney(data.conLLC);
  const annualF = fmtMoney(data.annualIncome ?? data.income * 12);
  const leadRef = data.leadId || "—";
  const countryLabel = resolveLocalLabel(data.localLabel, lang);

  // Localized labels for the calculator fidelity block.
  // Audit Task #8 — Bloque 7 (fidelity). Render the extra calculator
  // signals the UI showed (best of three structures, signed deltas vs
  // LLC, display currency, special regimes) when present. Inline i18n
  // keeps email-i18n.ts unchanged while still localizing.
  const FIDELITY_I18N: Record<string, { best: string; vsAuto: string; vsSoc: string; currency: string; opts: string; tarifa: string; micro: string; structure: Record<string, string> }> = {
    es: { best: "Estructura ganadora", vsAuto: "Frente a autónomo", vsSoc: "Frente a sociedad local", currency: "Divisa de visualización", opts: "Régimen especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autónomo", sociedad: "Sociedad local", llc: "LLC US" } },
    en: { best: "Winning structure", vsAuto: "Vs sole-trader", vsSoc: "Vs local company", currency: "Display currency", opts: "Special regime", tarifa: "Flat rate", micro: "Micro-entrepreneur", structure: { autonomo: "Sole trader", sociedad: "Local company", llc: "US LLC" } },
    fr: { best: "Structure gagnante", vsAuto: "Vs indépendant", vsSoc: "Vs société locale", currency: "Devise d'affichage", opts: "Régime spécial", tarifa: "Tarif plat", micro: "Micro-entrepreneur", structure: { autonomo: "Indépendant", sociedad: "Société locale", llc: "LLC US" } },
    de: { best: "Beste Struktur", vsAuto: "Vs Selbstständig", vsSoc: "Vs lokale GmbH", currency: "Anzeigewährung", opts: "Sonderregelung", tarifa: "Pauschaltarif", micro: "Micro-entrepreneur", structure: { autonomo: "Selbstständig", sociedad: "Lokale GmbH", llc: "US-LLC" } },
    pt: { best: "Estrutura vencedora", vsAuto: "Vs autônomo", vsSoc: "Vs sociedade local", currency: "Moeda de exibição", opts: "Regime especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autônomo", sociedad: "Sociedade local", llc: "LLC US" } },
    ca: { best: "Estructura guanyadora", vsAuto: "Davant d'autònom", vsSoc: "Davant de societat local", currency: "Divisa de visualització", opts: "Règim especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autònom", sociedad: "Societat local", llc: "LLC US" } },
  };
  const fi = FIDELITY_I18N[lang] || FIDELITY_I18N.en;
  const fidelityRows: Array<{ label: string; value: string }> = [];
  if (data.bestStructureId) {
    const name = fi.structure[data.bestStructureId] || data.bestStructureId;
    fidelityRows.push({ label: fi.best, value: name });
  }
  if (typeof data.llcVsAutonomo === "number" && Number.isFinite(data.llcVsAutonomo)) {
    const sign = data.llcVsAutonomo >= 0 ? "+" : "−";
    fidelityRows.push({ label: fi.vsAuto, value: `${sign}${fmtMoney(Math.abs(data.llcVsAutonomo))}` });
  }
  if (typeof data.llcVsSociedad === "number" && Number.isFinite(data.llcVsSociedad)) {
    const sign = data.llcVsSociedad >= 0 ? "+" : "−";
    fidelityRows.push({ label: fi.vsSoc, value: `${sign}${fmtMoney(Math.abs(data.llcVsSociedad))}` });
  }
  if (dc !== "EUR") {
    fidelityRows.push({ label: fi.currency, value: escapeHtml(dc) });
  }
  const optList: string[] = [];
  if (data.options?.tarifaPlana) optList.push(fi.tarifa);
  if (data.options?.franceMicro) optList.push(fi.micro);
  if (optList.length > 0) fidelityRows.push({ label: fi.opts, value: optList.join(", ") });

  const fidelityBlock = fidelityRows.length === 0 ? "" : `
    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr><td class="bg-dark" style="padding:18px 20px;background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:16px;" bgcolor="${C_BG}">
        ${fidelityRows.map(r => `<p style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 6px;"><span style="color:${C_TEXT_3};">${escapeHtml(r.label)}:</span> <strong style="color:${C_TEXT_1};">${r.value}</strong></p>`).join("")}
      </td></tr>
    </table>
  `;

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

    ${fidelityBlock}

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

  const subject = `${ct.subjectPrefix} | ${ahorroF}`;
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang };
}

export async function sendCalculatorEmail(data: CalculatorEmailData) {
  const { html: clientHtml, subject: clientSubject, lang } = renderCalculatorEmailHtml(data);
  const gmail = getGmailClient();
  const leadRef = data.leadId || "—";
  if (gmail) {
    try {
      const sent = await sendEmail(data.email, clientSubject, clientHtml, REPLY_TO_EMAIL);
      logger.info(`Calculator lead sent → ${maskEmail(data.email)}`, "email");
      logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: sent ? "enviado" : "fallido", clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    } catch (err) {
      logger.error(`Calculator email failed for ${maskEmail(data.email)}:`, "email", err);
      logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: "fallido", error: String(err), clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    }
  } else {
    logger.debug("CALCULATOR LEAD (no Gmail): " + JSON.stringify({ email: data.email, leadId: leadRef }), "email");
    logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: "fallido", error: "Gmail not configured", relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
  }
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

    ${meetingBlock({ meetingType: data.meetingType, meetLink: data.meetLink, phone: data.phone, lang })}

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
      logger.info(`Reminder sent → ${maskEmail(data.clientEmail)}`, "email");
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

    ${meetingBlock({ meetingType: data.meetingType, meetLink: data.meetLink, phone: data.phone, lang })}

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
      logger.info(`Reschedule confirmation sent → ${maskEmail(data.clientEmail)}`, "email");
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
      logger.info(`Cancellation confirmation sent → ${maskEmail(data.clientEmail)}`, "email");
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
export async function sendFollowupEmail(data: FollowupEmailData) {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ns = t.noShow; // re-use the friendly noShow tone for closing + unsubNote
  const fu = t.followup;
  const gmail = getGmailClient();
  const firstName = escapeHtml(data.clientName.split(" ")[0]);

  const subject = fu.subject;
  const intro = fu.intro(firstName);
  const ctaLabel = fu.ctaLabel;

  const clientBody = `
    ${heading(fu.heading(firstName))}

    ${bodyText(intro)}

    ${ctaButton(`${SITE_URL}${getLocalizedPath("book", lang)}`, ctaLabel)}

    ${brandSignature(lang, ns.closing)}
    ${unsubNote(ns.unsubNote)}
  `;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      await sendEmail(data.clientEmail, subject, html, REPLY_TO_EMAIL);
      logger.info(`Follow-up sent → ${maskEmail(data.clientEmail)}`, "email");
      logEmail({ to: data.clientEmail, subject, type: "followup", channel: "transactional", status: "enviado", clientName: data.clientName, clientLanguage: lang });
    } catch (err) {
      logger.error("Follow-up send failed:", "email", err);
      logEmail({ to: data.clientEmail, subject, type: "followup", channel: "transactional", status: "fallido", error: String(err), clientName: data.clientName });
      throw err;
    }
  } else {
    logger.debug("FOLLOWUP (no Gmail): " + JSON.stringify({ client: `${data.clientName} <${data.clientEmail}>` }), "email");
    logEmail({ to: data.clientEmail, subject, type: "followup", channel: "transactional", status: "fallido", error: "Gmail not configured", clientName: data.clientName });
  }
}

/**
 * Newsletter welcome email — sent after a successful POST /api/newsletter/subscribe.
 * No prices, no urgency tokens; CTA points to the localized booking page (the
 * approved no-price CTA shared across the rest of the transactional set).
 *
 * The fire-and-forget caller is responsible for deciding whether to await
 * the result (we typically do not, to keep the subscribe response fast).
 */
export interface NewsletterWelcomeEmailData {
  email: string;
  language: string | null;
}
export async function sendNewsletterWelcomeEmail(data: NewsletterWelcomeEmailData) {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const nw = t.newsletterWelcome;
  const gmail = getGmailClient();

  const clientBody = `
    ${heading(nw.heading)}

    ${bodyText(nw.intro)}

    ${divider()}

    ${greenPanel(nw.aboutTitle, bulletList(nw.aboutItems))}

    ${bodyText(nw.cadenceNote)}

    ${divider()}

    ${bodyText(nw.ctaIntro)}

    ${ctaButton(`${SITE_URL}${getLocalizedPath("book", lang)}`, nw.ctaButton)}

    ${bodyText(nw.ctaDesc)}

    ${brandSignature(lang, nw.closing)}
    ${unsubNote(nw.unsubNote)}
  `;

  const subject = nw.subject;
  const html = emailHtml(clientBody, subject, lang);

  if (gmail) {
    try {
      await sendEmail(data.email, subject, html, REPLY_TO_EMAIL);
      logger.info(`Newsletter welcome sent → ${maskEmail(data.email)}`, "email");
      logEmail({ to: data.email, subject, type: "newsletter_welcome", channel: "transactional", status: "enviado", clientLanguage: lang });
    } catch (err) {
      logger.error("Newsletter welcome send failed:", "email", err);
      logEmail({ to: data.email, subject, type: "newsletter_welcome", channel: "transactional", status: "fallido", error: String(err) });
    }
  } else {
    logger.debug("NEWSLETTER WELCOME (no Gmail): " + JSON.stringify({ email: data.email, lang }), "email");
    logEmail({ to: data.email, subject, type: "newsletter_welcome", channel: "transactional", status: "fallido", error: "Gmail not configured", clientLanguage: lang });
  }
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
      logger.info(`No-show reschedule sent → ${maskEmail(data.clientEmail)}`, "email");
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

