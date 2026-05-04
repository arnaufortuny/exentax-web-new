// Shared field-length and format constants used by both the React forms
// (client/) and the Zod schemas (server/) so the limits can never silently
// drift between client-side validation and server-side rejection.
//
// If you need to widen any of these (e.g. allow 35-digit phone numbers),
// update this file ONLY and let TypeScript propagate.

export const EMAIL_MAX_LENGTH = 254;             // RFC 5321 + practical SMTP cap.
export const NAME_MAX_LENGTH = 100;              // First or last name.
export const PHONE_MAX_LENGTH = 30;              // Includes spaces, +, -, parens.
export const PHONE_MIN_DIGITS = 7;               // Shortest international subscriber number.
export const PHONE_MAX_DIGITS = 15;              // E.164 absolute max digits.
