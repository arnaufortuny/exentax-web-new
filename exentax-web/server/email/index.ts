/**
 * Public email surface — barrel that re-exports the same public API the
 * pre-refactor monolithic `server/email.ts` exposed. Every existing
 * `import { ... } from "./email"` callsite resolves through this file
 * (TypeScript directory resolution prefers `email/index.ts` once the
 * old `email.ts` file is removed). See per-template files for the
 * implementation; see `transport.ts` for the shared infrastructure
 * (sendEmail, buildRaw, headerPolicyFor, withRetryQueue, helpers).
 *
 * Files in this directory:
 *   - transport.ts          — shared infra (Gmail client, sendEmail,
 *                              buildRaw, headerPolicyFor, withRetryQueue,
 *                              helpers: maskEmail, maskName, withUtm,
 *                              senderNameFor, isValidEmailSyntax,
 *                              buildDripUnsubUrl, GUIDE_PDF_URL guard).
 *   - booking-confirmation  — sendBookingConfirmation
 *   - booking-reminder      — sendReminderEmail
 *   - reschedule            — sendRescheduleConfirmation
 *   - cancellation          — sendCancellationEmail
 *   - no-show               — sendNoShowRescheduleEmail
 *   - post-meeting          — sendFollowupEmail (+ FollowupEmailData)
 *   - incomplete-booking    — sendIncompleteBookingEmail (+ data type)
 *   - calculator            — renderCalculatorEmailHtml + sendCalculatorEmail
 *   - drip                  — sendDripEmail (+ DripEmailData) for the
 *                              guide drip (6 steps / 15 days)
 *   - calc-drip             — sendCalcDripEmail (+ CalcDripEmailData)
 *                              for the calculator nurture (3 steps / 6 days)
 *   - newsletter            — sendNewsletterEmail (+ NewsletterEmailOpts)
 */

// Transport infrastructure + helpers used by callers (route handlers,
// scheduled workers, Discord ops scripts) and by the per-template files.
export {
  // Constants & runtime guards
  SENDER_EMAIL,
  EMAIL_LOGO_URL,
  GUIDE_PDF_URL,
  GUIDE_PDF_DEFAULT_PLACEHOLDER,
  TRANSACTIONAL_UNSUB_MAILTO,
  REPLY_TO_EMAIL,
  FROM_NAME,
  FROM_NAME_BY_FAMILY,
  assertGuidePdfUrlReady,
  // Helpers
  buildDripUnsubUrl,
  isValidEmailSyntax,
  maskEmail,
  maskName,
  senderNameFor,
  withUtm,
  headerPolicyFor,
  // Low-level transport (rarely used by callers; kept exported for tests)
  getGmailClient,
  sendEmail,
} from "./transport";

export type {
  EmailIdentity,
  EmailFamily,
  BuildRawOpts,
  EmailAttachment,
  LogEmailOpts,
} from "./transport";

// Per-template public senders. Each module also calls
// `registerEmailRetryHandler(...)` at import time so the email-retry
// worker can resume failed sends; that side effect is preserved by
// importing every template here.
export { sendBookingConfirmation } from "./booking-confirmation";
export { sendReminderEmail } from "./booking-reminder";
export { sendRescheduleConfirmation } from "./reschedule";
export { sendCancellationEmail } from "./cancellation";
export { sendNoShowRescheduleEmail } from "./no-show";
export { sendFollowupEmail } from "./post-meeting";
export type { FollowupEmailData } from "./post-meeting";
export { sendIncompleteBookingEmail } from "./incomplete-booking";
export type { IncompleteBookingEmailData } from "./incomplete-booking";
export { renderCalculatorEmailHtml, sendCalculatorEmail } from "./calculator";
export { sendDripEmail, sendDripEmailOnce } from "./drip";
export type { DripEmailData } from "./drip";
export { sendCalcDripEmail, sendCalcDripEmailOnce } from "./calc-drip";
export type { CalcDripEmailData } from "./calc-drip";
export { sendNewsletterEmail } from "./newsletter";
export type { NewsletterEmailOpts } from "./newsletter";
