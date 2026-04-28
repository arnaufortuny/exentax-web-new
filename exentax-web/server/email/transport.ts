import { google } from "googleapis";
import crypto from "crypto";
import { logger } from "../logger";
import { getGoogleServiceAccountKey } from "../google-credentials.js";
import { isTransient, isAuthError } from "../google-utils";
import { emailBreaker } from "../circuit-breaker";
import { enqueueEmail } from "../email-retry-queue";
import { SITE_URL } from "../email-layout";
import { CONTACT_EMAIL } from "../server-constants";
import type { EmailAttachment } from "../../shared/email";

export const SENDER_EMAIL = CONTACT_EMAIL;

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
export const GUIDE_PDF_DEFAULT_PLACEHOLDER = `${SITE_URL}/guide.pdf`;
export function assertGuidePdfUrlReady(): void {
  if (process.env.NODE_ENV === "production" && GUIDE_PDF_URL === GUIDE_PDF_DEFAULT_PLACEHOLDER) {
    logger.error(
      `GUIDE_PDF_URL not configured: drip step 1 is advertising the default placeholder ${GUIDE_PDF_DEFAULT_PLACEHOLDER}. Set GUIDE_PDF_URL env var to the real CDN URL.`,
      "email",
    );
  }
}

/**
 * Mailto-form `List-Unsubscribe` value used by the calculator result
 * email (the only `marketing-1to1` family member that carries a
 * `List-Unsubscribe` header). All other 1:1 transactional emails —
 * booking confirmation, reminder, reschedule, cancellation, no-show,
 * follow-up, incomplete-booking nudge — are operational notifications
 * about the recipient's own booking and intentionally omit any
 * unsubscribe header (there is no list to leave: receiving them is
 * inherent to having an active reservation). The mailto form is used
 * here (not an HTTPS one-click URL) because the calculator's report
 * is a one-shot send with no token to revoke; the address simply
 * surfaces the native "Unsubscribe" affordance in Gmail / Apple Mail
 * and gives Claudia a manual signal she can act on. The companion
 * `List-Unsubscribe-Post: One-Click` header is gated in `buildRaw()`
 * to HTTPS URLs only (see comment there) so this mailto value does
 * NOT trigger a one-click POST that no endpoint could service.
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

export const REPLY_TO_EMAIL = CONTACT_EMAIL;
export const FROM_NAME = "Claudia Hinojosa";

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

export interface LogEmailOpts {
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

export function logEmail(opts: LogEmailOpts): void {
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
export interface BuildRawOpts {
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
      // RFC 8058 one-click is HTTPS-POST oriented. Only emit the
      // companion `List-Unsubscribe-Post` header when the unsub value
      // is an HTTPS URL the public route layer can answer with a POST.
      // Mailto-only unsub addresses (e.g. the calculator's transactional
      // mailto) get the visible `List-Unsubscribe` header alone — there
      // is no endpoint that could service a one-click POST in that case
      // and emitting the header would break Gmail / Yahoo bulk-sender
      // compliance signals.
      if (/^https:\/\//i.test(safeListUnsub)) {
        lines.push(`List-Unsubscribe-Post: List-Unsubscribe=One-Click`);
      }
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
    // See `single-part` branch above: only emit the one-click POST
    // companion when the unsub value is HTTPS — mailto-only addresses
    // have no POST endpoint to service the request.
    if (/^https:\/\//i.test(safeListUnsub)) {
      headers.push(`List-Unsubscribe-Post: List-Unsubscribe=One-Click`);
    }
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

export async function sendEmail(to: string, subject: string, html: string, replyTo?: string, fromName = FROM_NAME, attachments?: EmailAttachment[], bcc?: string, rawOpts?: BuildRawOpts): Promise<boolean> {
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
export async function withRetryQueue<T>(
  type: import("../email-retry-queue").EmailRetryType,
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
export type EmailFamily = "transactional" | "marketing-1to1" | "marketing-bulk";
export function headerPolicyFor(family: EmailFamily): BuildRawOpts {
  switch (family) {
    case "transactional":
      return { autoSubmitted: "auto-generated" };
    case "marketing-1to1":
      return { autoSubmitted: "auto-generated" };
    case "marketing-bulk":
      return { autoSubmitted: "auto-generated", precedence: "bulk" };
  }
}

export type { EmailAttachment };
