import { google } from "googleapis";
import crypto from "crypto";
import { logger } from "./logger";
import { getGoogleServiceAccountKey } from "./google-credentials.js";
import { isTransient, isAuthError } from "./google-utils";
import { getEmailTranslations, resolveEmailLang, resolveLocalLabel, getCalculatorFidelityLabels, UNSUB_LINK_I18N } from "./email-i18n";
import { emailBreaker } from "./circuit-breaker";
import { enqueueEmail, registerEmailRetryHandler } from "./email-retry-queue";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote, unsubFooterWithLink,
  infoCard, greenPanel, meetBlock, meetingBlock, bulletList,
  SITE_URL, WHATSAPP_URL,
  C_BG, C_NEON, C_NEON_DK, C_TEXT_1, C_TEXT_2, C_TEXT_3, C_BORDER,
  C_ACCENT, C_ACCENT_BG, C_ACCENT_BD, F_STACK,
} from "./email-layout";
import { buildIcsAttachment, buildGoogleCalendarUrl } from "./calendar-invite";
import { escapeHtml } from "./routes/shared";
import { FX_RATES_PER_EUR, convertFromEUR as fxConvertFromEUR } from "../shared/calculator-fx";
import { BRAND_NAME, CONTACT_EMAIL, type SupportedLang } from "./server-constants";
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
 * Public URL of the brand mark used as the email banner. Defaults to the
 * static asset shipped with the app (`/ex-icon-green.png` served by Vite
 * out of `client/public/`). Operators can override via env to swap in a
 * CDN/cache-busted variant without redeploying.
 */
export const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL || `${SITE_URL}/ex-icon-green.png`;

/**
 * Lead-magnet PDF advertised in drip step #1 ("Open my guide"). The
 * canonical asset lives at `${SITE_URL}/guide.pdf` (served by the static
 * client/public/ directory) and `GUIDE_PDF_URL` env var lets ops point
 * at a CDN replacement without a code change. To avoid silently shipping
 * a broken link, `assertGuidePdfUrlReady()` is invoked at boot and emits
 * a CRITICAL alert (logger.error → Discord-notified) if the URL still
 * resolves to the default placeholder in production. Drip step 1 will
 * still be sent (the body has more value than the link) but the on-call
 * channel is paged so the asset can be uploaded same-day.
 */
export const GUIDE_PDF_URL = process.env.GUIDE_PDF_URL || `${SITE_URL}/guide.pdf`;
const GUIDE_PDF_DEFAULT_PLACEHOLDER = `${SITE_URL}/guide.pdf`;
export function assertGuidePdfUrlReady(): void {
  if (process.env.NODE_ENV === "production" && GUIDE_PDF_URL === GUIDE_PDF_DEFAULT_PLACEHOLDER) {
    logger.error(
      `GUIDE_PDF_URL not configured: drip step 1 is advertising the default placeholder ${GUIDE_PDF_DEFAULT_PLACEHOLDER}. Set GUIDE_PDF_URL env var to the real CDN URL.`,
      "email",
    );
  }
}

/**
 * Mailto-form `List-Unsubscribe` value used on every 1:1 transactional
 * email (booking confirmation, reminder, reschedule, cancellation,
 * no-show, follow-up, calculator result, incomplete-booking nudge). It
 * intentionally does NOT carry a `List-Unsubscribe-Post: One-Click`
 * companion — RFC 8058 one-click is reserved for genuine bulk content
 * (drip + newsletter), where the user's MUA can act without a click
 * round-trip. For 1:1 mail, the mailto form is enough to surface a
 * native "Unsubscribe" affordance in Gmail / Apple Mail and gives
 * Claudia a manual signal she can act on.
 */
export const TRANSACTIONAL_UNSUB_MAILTO = `mailto:${SENDER_EMAIL}?subject=Unsubscribe`;

/**
 * Build the RFC 8058 one-click unsubscribe URL for a drip enrollment.
 * The token is generated when the row is inserted (`storage/marketing
 * .ts:tryCreateDripEnrollment`) and resolved by the public route at
 * `/api/drip/unsubscribe/:token` (POST → 200, GET → confirmation page).
 * Returns null when the row predates the token migration, in which
 * case the caller falls back to the mailto form.
 */
export function buildDripUnsubUrl(token: string | null | undefined): string | null {
  if (!token || typeof token !== "string") return null;
  return `${SITE_URL}/api/drip/unsubscribe/${encodeURIComponent(token)}`;
}

/**
 * Mask an email for log output: keep first 3 chars of local part + first
 * char of domain TLD, redact the rest. Avoids exposing PII in logs while
 * keeping enough signal to debug ("did THIS user receive the email?").
 *
 *   maskEmail("alice.long@example.com") → "ali***@e***.com"
 *   maskEmail("a@b.co")                 → "a***@b***.co"
 */
/**
 * Defense-in-depth email syntax validator. Each route already validates with
 * Zod's `.email()`; this is a last-line check inside the EmailService itself
 * so that any future caller (cron, retry queue, internal tooling) cannot
 * trigger a Gmail API call with a malformed recipient. Conservative regex
 * (RFC-5322 simplified) — accepts user+tag@example.co.uk, rejects spaces,
 * missing @ or missing TLD, and addresses over 254 chars.
 */
const EMAIL_SYNTAX_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmailSyntax(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  return EMAIL_SYNTAX_RE.test(trimmed);
}

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

/**
 * Mask a personal name for log output: keep first letter + last initial.
 *   maskName("Alice Wonderland") → "A*** W."
 *   maskName("Bob")              → "B***"
 * Used in dev-only fallback logs ("no Gmail") and any other diagnostic line
 * that needs to identify a person without exposing their full name.
 */
export function maskName(name: string | null | undefined): string {
  if (!name) return "(no-name)";
  const trimmed = name.trim();
  if (!trimmed) return "(no-name)";
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  const firstMasked = first.length <= 1 ? first + "***" : first[0] + "***";
  if (parts.length === 1) return firstMasked;
  const last = parts[parts.length - 1];
  return `${firstMasked} ${last[0]}.`;
}
const REPLY_TO_EMAIL = CONTACT_EMAIL;
const FROM_NAME = "Claudia Hinojosa";

/**
 * Per-purpose `From` display-name policy. Resolved via `senderNameFor()`
 * so every callsite picks the right identity for the email family:
 *   - "transactional" (1:1 booking + calculator + reminder etc.) is
 *     signed by Claudia personally so the recipient sees a human reply.
 *   - "drip" (6-step nurture) is signed in a softer, first-name form so
 *     it reads like a personal-coach sequence rather than a notification.
 *   - "newsletter" (broadcast) drops the personal name so the recipient
 *     doesn't expect a 1:1 reply on a mass-send.
 * Reply-To stays `CONTACT_EMAIL` for all three so any reply still lands
 * in the shared inbox.
 */
export const FROM_NAME_BY_FAMILY = {
  transactional: "Claudia Hinojosa · Exentax",
  drip: "Claudia · Exentax",
  newsletter: "Exentax",
} as const;
export type EmailIdentity = keyof typeof FROM_NAME_BY_FAMILY;
export function senderNameFor(identity: EmailIdentity): string {
  return FROM_NAME_BY_FAMILY[identity];
}

/**
 * Append a consistent UTM tuple to any CTA URL embedded in an email.
 * Used by every `ctaButton(...)` callsite (booking, calculator, drip,
 * newsletter) so downstream analytics can attribute clicks per template
 * × language × step. Idempotent: if the URL already carries a `utm_*`
 * key, that value is preserved (we never overwrite an explicit override
 * the caller passed in).
 *   - utm_source = "email" (always)
 *   - utm_medium = "transactional" | "drip" | "newsletter"
 *   - utm_campaign = template id (e.g. "booking_confirmation", "drip_step_3")
 *   - utm_content = `${lang}` or `${lang}_step${n}` for stepped flows
 * Skips `mailto:` and relative anchor URLs (they cannot carry params).
 */
export function withUtm(
  url: string,
  medium: "transactional" | "drip" | "newsletter",
  campaign: string,
  content: string,
): string {
  if (!url || url.startsWith("mailto:") || url.startsWith("#")) return url;
  try {
    const u = new URL(url, SITE_URL);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "email");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", medium);
    if (!u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", campaign);
    if (!u.searchParams.has("utm_content")) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}

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
  // RGPD / "0 PII in logs" policy: never persist raw recipient address or
  // full client name in any log line, even at debug level. Operators
  // diagnosing a delivery failure get enough signal from the masked email
  // (preserves domain + first character) and the masked name (initials)
  // plus the related ID to grep production data for the full record.
  const parts = [`email ${opts.status}: ${opts.type} → ${maskEmail(opts.to)}`];
  if (opts.clientName) parts.push(`client=${maskName(opts.clientName)}`);
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

/**
 * Per-call MIME header overrides. Centralised here so every transport
 * exit (transactional senders, drip worker, newsletter broadcast)
 * exposes the SAME deliverability surface and the SAME audit trail.
 *
 * - `listUnsubscribe`: RFC 2369 / RFC 8058 unsub URL (mailto: or HTTPS).
 *   When present, `List-Unsubscribe-Post: List-Unsubscribe=One-Click` is
 *   appended automatically (Gmail / Yahoo Feb 2024 bulk-sender contract).
 * - `autoSubmitted`: RFC 3834 hint. ALL programmatically-sent mail
 *   should set `auto-generated`. Keeps replies out of out-of-office
 *   loops and signals to spam filters that a human did not type this.
 * - `precedence`: RFC 2076 — set to `bulk` for newsletter / drip
 *   broadcasts only. Booking confirmations / reminders are 1:1
 *   transactional and MUST NOT carry it (would lower priority in
 *   Gmail's tab classification).
 * - `entityRefId`: Gmail-only `X-Entity-Ref-ID` thread-dedup hint.
 *   When two messages share the same value Gmail merges them into the
 *   same thread / suppresses duplicates — useful for retried sends so
 *   the recipient does not see the same calendar invite twice.
 */
interface BuildRawOpts {
  listUnsubscribe?: string;
  autoSubmitted?: "auto-generated" | "auto-replied" | "auto-notified";
  precedence?: "bulk" | "list";
  entityRefId?: string;
}

/**
 * Strip CR/LF from any value that will be inlined into a MIME header.
 *
 * Defense-in-depth: every caller of `buildRaw` already validates `to` /
 * `replyTo` via `isValidEmailSyntax` (which rejects whitespace) and the
 * Subject is base64-encoded so it cannot break out, but we never want a
 * future caller — or a string that came from data we don't fully control
 * (e.g. an admin-supplied display name) — to be able to inject a header by
 * smuggling `\r\n`. Newlines here are ALWAYS unsafe in MIME headers, so
 * stripping them silently is the right fail-closed behaviour.
 */
function stripCrlf(value: string): string {
  // Includes CR (0x0D), LF (0x0A) and the lesser-known NUL byte that some
  // mail libraries also treat as a header terminator.
  return value.replace(/[\r\n\u0000]+/g, "");
}

function buildRaw(to: string, subject: string, html: string, replyTo?: string, fromName = FROM_NAME, attachments?: EmailAttachment[], bcc?: string, opts?: BuildRawOpts): string {
  const safeTo = stripCrlf(to);
  const safeReplyTo = replyTo ? stripCrlf(replyTo) : undefined;
  const safeBcc = bcc ? stripCrlf(bcc) : undefined;
  const safeFromName = stripCrlf(fromName);
  const safeListUnsub = opts?.listUnsubscribe ? stripCrlf(opts.listUnsubscribe) : undefined;
  const safeAutoSubmitted = opts?.autoSubmitted ? stripCrlf(opts.autoSubmitted) : undefined;
  const safePrecedence = opts?.precedence ? stripCrlf(opts.precedence) : undefined;
  const safeEntityRefId = opts?.entityRefId ? stripCrlf(opts.entityRefId) : undefined;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageId = `<${crypto.randomBytes(12).toString("hex")}@${SENDER_EMAIL.split("@")[1] || "exentax.com"}>`;

  if (!attachments || attachments.length === 0) {
    const htmlBase64 = Buffer.from(html).toString("base64");
    const lines = [
      `From: "${safeFromName}" <${SENDER_EMAIL}>`,
      `To: ${safeTo}`,
      `Subject: ${encodedSubject}`,
      `Message-ID: ${messageId}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
    ];
    if (safeBcc) lines.push(`Bcc: ${safeBcc}`);
    if (safeReplyTo) lines.push(`Reply-To: ${safeReplyTo}`);
    if (safeListUnsub) {
      lines.push(`List-Unsubscribe: <${safeListUnsub}>`);
      lines.push(`List-Unsubscribe-Post: List-Unsubscribe=One-Click`);
    }
    if (safeAutoSubmitted) lines.push(`Auto-Submitted: ${safeAutoSubmitted}`);
    if (safePrecedence) lines.push(`Precedence: ${safePrecedence}`);
    if (safeEntityRefId) lines.push(`X-Entity-Ref-ID: ${safeEntityRefId}`);
    lines.push("", htmlBase64);
    return Buffer.from(lines.join("\r\n")).toString("base64url");
  }

  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const headers = [
    `From: "${safeFromName}" <${SENDER_EMAIL}>`,
    `To: ${safeTo}`,
    `Subject: ${encodedSubject}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ];
  if (safeBcc) headers.push(`Bcc: ${safeBcc}`);
  if (safeReplyTo) headers.push(`Reply-To: ${safeReplyTo}`);
  if (safeListUnsub) {
    headers.push(`List-Unsubscribe: <${safeListUnsub}>`);
    headers.push(`List-Unsubscribe-Post: List-Unsubscribe=One-Click`);
  }
  if (safeAutoSubmitted) headers.push(`Auto-Submitted: ${safeAutoSubmitted}`);
  if (safePrecedence) headers.push(`Precedence: ${safePrecedence}`);
  if (safeEntityRefId) headers.push(`X-Entity-Ref-ID: ${safeEntityRefId}`);

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
  if (!isValidEmailSyntax(to)) {
    logger.warn(`Refusing to send email — invalid recipient syntax: ${maskEmail(to)}`, "email");
    return false;
  }
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
      ? `${bodyText(`${bt.ctaManage}:`)}${ctaButton(withUtm(data.manageUrl, "transactional", "booking_confirmation", lang), bt.ctaManage)}`
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

/**
 * Wrap a transactional email sender so that ANY failure (Gmail not
 * configured, transport error, circuit-breaker open, send returned
 * false) is captured and enqueued in the persistent retry queue. The
 * worker will then re-invoke the underlying `oncefn` with full backoff
 * tracking. The wrapper never throws — calling code can fire-and-forget.
 *
 * Used for the "soft" senders (reminder, reschedule, cancellation,
 * no-show, follow-up, calculator, incomplete-booking, drip) where the
 * caller does not want a UI/HTTP path to be blocked by an email outage.
 * The booking-confirmation flow uses a hand-rolled equivalent above so
 * that we can preserve its specific "throws on tx-strict" semantics.
 */
async function withRetryQueue<T>(
  type: import("./email-retry-queue").EmailRetryType,
  data: T,
  oncefn: (d: T) => Promise<void>,
): Promise<void> {
  try {
    await oncefn(data);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.warn(`Email ${type} deferred to retry queue: ${reason.slice(0, 200)}`, "email");
    await enqueueEmail(type, data, { reason });
  }
}

/**
 * Centralised header policy keyed by email family. Every transport exit
 * (`sendBookingConfirmationOnce`, `sendDripEmailOnce`, the newsletter
 * worker, …) reads from this single table so the deliverability surface
 * is reviewable at a glance and impossible to drift between templates.
 *
 * - "transactional" — 1:1 booking-related mail. No `Precedence`, no
 *   `List-Unsubscribe` (operational notification — the user cannot
 *   unsubscribe from their own appointment). Carries `Auto-Submitted:
 *   auto-generated` so OoO replies don't loop back.
 * - "marketing-1to1" — calculator report (one-shot, no recurring list).
 *   Mailto unsub for visibility; `Auto-Submitted` only.
 * - "marketing-bulk" — drip nurture + newsletter broadcasts. Full unsub
 *   contract (`List-Unsubscribe` HTTPS one-click + visible footer link),
 *   `Precedence: bulk` for proper Gmail tab routing, and
 *   `Auto-Submitted: auto-generated`.
 *
 * Per-call overrides (`listUnsubscribe`, `entityRefId`) are layered on
 * top of the policy so a sender can still pin a per-recipient unsub
 * URL without forking the table.
 */
type EmailFamily = "transactional" | "marketing-1to1" | "marketing-bulk";
function headerPolicyFor(family: EmailFamily): BuildRawOpts {
  switch (family) {
    case "transactional":
      return { autoSubmitted: "auto-generated" };
    case "marketing-1to1":
      return { autoSubmitted: "auto-generated" };
    case "marketing-bulk":
      return { autoSubmitted: "auto-generated", precedence: "bulk" };
  }
}

/**
 * Public newsletter sender — drives the broadcast worker through the
 * same `sendEmail` transport every other template uses, so
 * `email-suppression`, the circuit breaker, the masked-PII logger and
 * the header-injection guards are all enforced uniformly. The worker
 * keeps its own job table for resumability + 2/sec rate-limit, so we
 * intentionally DO NOT enqueue into `email_retry_queue` here (would
 * double-handle retries). The `From: "Exentax Newsletter"` display
 * name is preserved so spam filters keep classifying broadcasts in the
 * Promotions tab and away from booking confirmations.
 */
export interface NewsletterEmailOpts {
  to: string;
  subject: string;
  html: string;
  unsubUrl: string;
  /** Stable id used as `X-Entity-Ref-ID` for Gmail thread dedup on retried jobs. */
  entityRefId?: string;
}
export async function sendNewsletterEmail(opts: NewsletterEmailOpts): Promise<boolean> {
  const replyToAddr = process.env.GMAIL_SENDER ?? SENDER_EMAIL;
  return sendEmail(
    opts.to,
    opts.subject,
    opts.html,
    replyToAddr,
    senderNameFor("newsletter"),
    undefined,
    undefined,
    {
      ...headerPolicyFor("marketing-bulk"),
      listUnsubscribe: opts.unsubUrl,
      entityRefId: opts.entityRefId,
    },
  );
}

// Register the persistent retry handler so the queue worker can re-attempt
// booking confirmations later (e.g. after Gmail credentials are configured
// or after a transient SMTP outage clears). IMPORTANT: register the
// throwing low-level function — NOT the enqueue-wrapping public API —
// so the worker observes real failures and applies its backoff/cap logic.
registerEmailRetryHandler("booking_confirmation", async (payload) => {
  await sendBookingConfirmationOnce(payload as BookingEmailData);
});

export function renderCalculatorEmailHtml(data: CalculatorEmailData, opts?: { unsubUrl?: string }): { html: string; subject: string; lang: string } {
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

  // Localized labels for the calculator fidelity block — centralized in email-i18n.ts.
  const fi = getCalculatorFidelityLabels(lang);
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
    ${heading(ct.heading(escapeHtml(data.email.split("@")[0])))}

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

    ${ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "transactional", "calculator_result", lang), ct.ctaButton)}

    ${bodyText(ct.ctaDesc)}

    ${brandSignature(lang)}
    ${opts?.unsubUrl
      ? unsubFooterWithLink(ct.unsubNote, opts.unsubUrl, UNSUB_LINK_I18N[lang])
      : unsubNote(ct.unsubNote)}
  `;

  const subject = `${ct.subjectPrefix} | ${ahorroF}`;
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang };
}

async function sendCalculatorEmailOnce(data: CalculatorEmailData): Promise<void> {
  // Calculator is a one-shot automated marketing email (single send per
  // lead, no recurring list). Per the email-system policy we still
  // surface a visible unsubscribe affordance — but since there is no
  // per-recipient enrollment row, the only honest opt-out is the mailto
  // form (auto-handled by `email-suppression`). Booking emails do not
  // get this footer at all (operational notifications about the user's
  // own appointment cannot be opted out).
  const { html: clientHtml, subject: clientSubject, lang } = renderCalculatorEmailHtml(data, { unsubUrl: TRANSACTIONAL_UNSUB_MAILTO });
  const gmail = getGmailClient();
  const leadRef = data.leadId || "—";
  if (!gmail) {
    logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: "fallido", error: "Gmail not configured", relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    throw new Error("gmail_not_configured");
  }
  const sent = await sendEmail(data.email, clientSubject, clientHtml, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, { ...headerPolicyFor("marketing-1to1"), listUnsubscribe: TRANSACTIONAL_UNSUB_MAILTO, entityRefId: leadRef !== "—" ? `calculator-${leadRef}` : undefined });
  logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: sent ? "enviado" : "fallido", clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
  if (!sent) throw new Error("circuit_breaker_or_transient_failure");
  logger.info(`Calculator lead sent → ${maskEmail(data.email)}`, "email");
}

export async function sendCalculatorEmail(data: CalculatorEmailData): Promise<void> {
  await withRetryQueue("calculator_report", data, sendCalculatorEmailOnce);
}
registerEmailRetryHandler("calculator_report", async (payload) => {
  await sendCalculatorEmailOnce(payload as CalculatorEmailData);
});

async function sendReminderEmailOnce(data: ReminderEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const rt = t.reminder;
  const gmail = getGmailClient();
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

  const reminderSubj = rt.subject(data.startTime);
  const html = emailHtml(clientBody, reminderSubj, lang);

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

/**
 * Drip sequence email — one of 6 nurture steps (days 0/3/6/9/12/15).
 *
 * Step is 1-indexed (1..6). The CTA placement varies per step:
 *   - step 1: "Open my guide"          → GUIDE_PDF_URL
 *   - step 4: "Calculate my savings"   → home page #calculadora anchor
 *   - step 6: "Book my free consultation" → /book localized
 *   - steps 2, 3, 5: no CTA button (text-only nurture)
 *
 * Throws on send failure so the worker can mark the row with
 * `last_error` and retry on its next tick — there is no fire-and-forget
 * here. `name` is optional; when present we render a personalised
 * greeting like "Hola Juan,", otherwise we fall back to "Hola,".
 */
export interface DripEmailData {
  email: string;
  name?: string | null;
  language: string | null;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Per-enrollment unsubscribe token persisted on the
   * `drip_enrollments.unsubscribe_token` column. When present we render
   * an RFC 8058 HTTPS one-click `List-Unsubscribe-Post: One-Click`
   * header so Gmail / Yahoo MUAs can unsubscribe the recipient with a
   * single click. Legacy rows that pre-date the token migration
   * gracefully fall back to the mailto form.
   */
  unsubToken?: string | null;
}

function dripCtaFor(step: 1 | 2 | 3 | 4 | 5 | 6, lang: SupportedLang, dripT: ReturnType<typeof getEmailTranslations>["drip"]): string {
  const campaign = `drip_step_${step}`;
  const content = `${lang}_step${step}`;
  if (step === 1) return ctaButton(withUtm(GUIDE_PDF_URL, "drip", campaign, content), dripT.ctaOpenGuide);
  if (step === 4) return ctaButton(withUtm(`${SITE_URL}/${lang}#calculadora`, "drip", campaign, content), dripT.ctaCalculate);
  if (step === 6) return ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "drip", campaign, content), dripT.ctaBook);
  return ""; // steps 2, 3, 5 are text-only nurture
}

export async function sendDripEmailOnce(data: DripEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const d = t.drip;
  const stepIdx = data.step - 1;
  const stepCopy = d.steps[stepIdx];
  if (!stepCopy) throw new Error(`drip: invalid step ${data.step}`);

  // Lead-magnet hard fail: drip step 1 advertises the guide PDF. If the
  // hosting URL is still the default placeholder in production we refuse
  // to send (throwing here propagates to the drip-worker, which calls
  // `markDripEnrollmentError()` — the row keeps `current_step = 0` and
  // is re-attempted on the next worker tick because `next_send_at` is
  // not advanced on failure) so a broken `/guide.pdf` link never reaches
  // a recipient. The boot-time `assertGuidePdfUrlReady()` already pages
  // on-call so the URL is fixed same-day; until it is, the row parks in
  // the drip table at step 0 rather than burning a first impression.
  if (data.step === 1 && process.env.NODE_ENV === "production" && GUIDE_PDF_URL === GUIDE_PDF_DEFAULT_PLACEHOLDER) {
    throw new Error("guide_pdf_url_not_configured");
  }

  // Use only the first token of the name to avoid awkward greetings
  // like "Hola Juan García López,". Trim+collapse whitespace first.
  const safeName = data.name ? escapeHtml(data.name.trim().split(/\s+/)[0]) : null;
  const greeting = d.greeting(safeName);
  const cta = dripCtaFor(data.step, lang, d);
  const psHtml = stepCopy.ps ? bodyText(stepCopy.ps) : "";

  // Drip is bulk nurture content (6 emails / 15 days per enrollment), so a
  // `List-Unsubscribe` header is required to satisfy modern bulk-sender
  // expectations (Gmail / Yahoo Feb 2024) and to surface a native unsub
  // affordance in the recipient's MUA. When the row carries an
  // `unsubscribe_token` (post-migration), we render the RFC 8058 HTTPS
  // form with `List-Unsubscribe-Post: One-Click` so MUAs unsubscribe with
  // a single click. Legacy rows (token=null) gracefully fall back to the
  // mailto form so we never lose the unsub affordance entirely.
  // The same URL is also embedded as a visible footer link via
  // `unsubFooterWithLink` — drip is one of the templates the user
  // explicitly asked to surface a clickable Unsubscribe in the body
  // (along with newsletter and the calculator report). Booking emails
  // do not get this footer or the header.
  const oneClickUrl = buildDripUnsubUrl(data.unsubToken);
  const dripUnsub = oneClickUrl ?? `mailto:${SENDER_EMAIL}?subject=Unsubscribe%20drip`;

  const clientBody = `
    ${heading(greeting)}

    ${stepCopy.paragraphs.map(p => bodyText(p)).join("\n")}

    ${cta}

    ${psHtml}

    ${brandSignature(lang, d.sigClosing)}
    ${unsubFooterWithLink(d.unsubNote, dripUnsub, UNSUB_LINK_I18N[lang])}
  `;

  const subject = stepCopy.subject;
  const html = emailHtml(clientBody, subject, lang);
  const logType = `drip_step_${data.step}`;
  const gmail = getGmailClient();

  if (!gmail) {
    logger.debug(`DRIP ${logType} (no Gmail): ${JSON.stringify({ email: maskEmail(data.email), lang })}`, "email");
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: "Gmail not configured" });
    throw new Error("Gmail not configured");
  }

  try {
    const ok = await sendEmail(data.email, subject, html, REPLY_TO_EMAIL, senderNameFor("drip"), undefined, undefined, { ...headerPolicyFor("marketing-bulk"), listUnsubscribe: dripUnsub, entityRefId: data.unsubToken ? `drip-${data.unsubToken}-step${data.step}` : undefined });
    if (!ok) {
      logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: "sendEmail returned false" });
      throw new Error("circuit_breaker_or_transient_failure");
    }
    logger.info(`Drip ${logType} sent → ${maskEmail(data.email)}`, "email");
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "enviado", clientLanguage: lang });
  } catch (err) {
    logger.error(`Drip ${logType} send failed:`, "email", err);
    logEmail({ to: data.email, subject, type: logType, channel: "transactional", status: "fallido", clientLanguage: lang, error: String(err) });
    throw err;
  }
}

/**
 * Public drip-step sender. Wrapped in the persistent retry queue so a
 * Gmail outage during a 6-email/15-day nurture sequence never silently
 * loses a step — the worker re-attempts with backoff (1m → 12h cap)
 * until success or `MAX_ATTEMPTS`. The drip-worker's own backoff
 * (`drip_enrollments.next_send_at`) governs WHEN to send each step;
 * this queue governs WHAT to do when a send-time attempt fails.
 */
export async function sendDripEmail(data: DripEmailData): Promise<void> {
  await withRetryQueue("drip_step", data, sendDripEmailOnce);
}
registerEmailRetryHandler("drip_step", async (payload) => {
  await sendDripEmailOnce(payload as DripEmailData);
});

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
async function sendIncompleteBookingEmailOnce(data: IncompleteBookingEmailData): Promise<void> {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ib = t.incompleteBooking;
  const gmail = getGmailClient();

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

