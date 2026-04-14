/**
 * Google Sheets — lightweight append-only logging
 *
 * Appends rows to named sheets in a single spreadsheet for:
 *   - Bookings (sheet: "Agenda")
 *   - Calculator leads (sheet: "Calculadora")
 *   - Consent log (sheet: "Consents")
 *
 * ENV:
 *   GOOGLE_SERVICE_ACCOUNT_KEY     — same key used for Calendar/Meet
 *   GOOGLE_SHEETS_SPREADSHEET_ID   — ID of the target spreadsheet
 *
 * SETUP:
 *   1. Create a Google Spreadsheet with sheets named "Agenda", "Calculadora", "Consents"
 *   2. Share the spreadsheet with the service account email (Editor role)
 *   3. Set GOOGLE_SHEETS_SPREADSHEET_ID to the spreadsheet's ID (from its URL)
 *
 * DESIGN:
 *   - Fire-and-forget: never blocks the main request flow
 *   - Silent degradation when env vars are absent or auth fails
 *   - No domain-wide delegation required (share sheet directly with SA)
 */

import { google } from "googleapis";
import { logger } from "./logger";
import { getGoogleServiceAccountKey } from "./google-credentials";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

type SheetsClient = ReturnType<typeof google.sheets>;

let _client: SheetsClient | null = null;

function getSheetsClient(): SheetsClient | null {
  if (_client) return _client;
  if (!SPREADSHEET_ID) return null;

  const key = getGoogleServiceAccountKey();
  if (!key.private_key || !key.client_email) return null;

  try {
    const auth = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    _client = google.sheets({ version: "v4", auth });
    return _client;
  } catch (err) {
    logger.warn(`Sheets client init failed: ${err instanceof Error ? err.message : String(err)}`, "sheets");
    return null;
  }
}

async function appendRow(sheet: string, values: (string | number | null)[]): Promise<void> {
  const client = getSheetsClient();
  if (!client || !SPREADSHEET_ID) return;

  try {
    await client.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheet}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values.map(v => v === null ? "" : String(v))] },
    });
  } catch (err) {
    logger.warn(`Sheets append failed [${sheet}]: ${err instanceof Error ? err.message : String(err)}`, "sheets");
    _client = null; // reset so next call retries auth
  }
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function sheetsLogBooking(opts: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  language?: string | null;
  status: string;
  meetLink?: string | null;
}): void {
  const ts = new Date().toISOString();
  appendRow("Agenda", [
    ts,
    opts.bookingId,
    opts.date,
    `${opts.startTime}–${opts.endTime}`,
    opts.name,
    opts.email,
    opts.phone || "",
    opts.language || "es",
    opts.status,
    opts.meetLink || "",
  ]).catch(() => {});
}

export function sheetsLogCalculatorLead(opts: {
  leadId: string;
  email: string;
  country?: string | null;
  regime?: string | null;
  ahorro: number;
  annualIncome?: number | null;
  language?: string | null;
  marketingAccepted: boolean;
}): void {
  const ts = new Date().toISOString();
  appendRow("Calculadora", [
    ts,
    opts.leadId,
    opts.email,
    opts.country || "",
    opts.regime || "",
    opts.annualIncome ?? "",
    opts.ahorro,
    opts.language || "es",
    opts.marketingAccepted ? "Sí" : "No",
  ]).catch(() => {});
}

export function sheetsLogConsent(opts: {
  formType: string;
  email?: string | null;
  privacyAccepted: boolean;
  marketingAccepted?: boolean | null;
  language?: string | null;
  source?: string | null;
  privacyVersion?: string | null;
}): void {
  const ts = new Date().toISOString();
  appendRow("Consents", [
    ts,
    opts.formType,
    opts.email || "",
    opts.privacyAccepted ? "Sí" : "No",
    opts.marketingAccepted != null ? (opts.marketingAccepted ? "Sí" : "No") : "",
    opts.language || "",
    opts.source || "",
    opts.privacyVersion || "",
  ]).catch(() => {});
}
