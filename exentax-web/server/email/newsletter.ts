import {
  SENDER_EMAIL,
  sendEmail,
  senderNameFor,
  headerPolicyFor,
} from "./transport";

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
      entityRefId: opts.entityRefId,
      listUnsubscribe: opts.unsubUrl,
    },
  );
}
