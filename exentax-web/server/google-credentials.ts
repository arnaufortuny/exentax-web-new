import { logger } from "./logger";

export interface GoogleServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

const EMPTY_KEY: GoogleServiceAccountKey = {
  type: "",
  project_id: "",
  private_key_id: "",
  private_key: "",
  client_email: "",
  client_id: "",
  auth_uri: "",
  token_uri: "",
  auth_provider_x509_cert_url: "",
  client_x509_cert_url: "",
  universe_domain: "",
};

let _cached: GoogleServiceAccountKey | null = null;

export function getGoogleServiceAccountKey(): GoogleServiceAccountKey {
  if (_cached) return _cached;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    logger.warn("GOOGLE_SERVICE_ACCOUNT_KEY not set — Google integrations disabled.", "google");
    _cached = EMPTY_KEY;
    return _cached;
  }
  try {
    const parsed = JSON.parse(raw) as GoogleServiceAccountKey;
    if (!parsed.private_key || !parsed.client_email) {
      logger.error("GOOGLE_SERVICE_ACCOUNT_KEY is missing private_key or client_email.", "google");
      _cached = EMPTY_KEY;
      return _cached;
    }
    _cached = parsed;
    return _cached;
  } catch {
    logger.error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON.", "google");
    _cached = EMPTY_KEY;
    return _cached;
  }
}

export const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "hola@exentax.com";
