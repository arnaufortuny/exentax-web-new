import crypto from "crypto";
import { logger } from "./logger";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const PREFIX = "ef:";

let _cachedKey: Buffer | null = null;
let _keyWarned = false;

function getFieldKey(): Buffer {
  if (_cachedKey !== null) return _cachedKey;

  const key = process.env.FIELD_ENCRYPTION_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FIELD_ENCRYPTION_KEY is required in production — refusing to start without encryption key");
    }
    if (!_keyWarned) {
      logger.warn("FIELD_ENCRYPTION_KEY not set — sensitive fields will be stored unencrypted in dev", "field-encryption");
      _keyWarned = true;
    }
    _cachedKey = Buffer.alloc(0);
    return _cachedKey;
  }

  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FIELD_ENCRYPTION_KEY must be 64 hex chars (32 bytes) — refusing to start with invalid key");
    }
    if (!_keyWarned) {
      logger.warn("FIELD_ENCRYPTION_KEY must be 64 hex chars (32 bytes) — fields will be stored unencrypted", "field-encryption");
      _keyWarned = true;
    }
    _cachedKey = Buffer.alloc(0);
    return _cachedKey;
  }

  _cachedKey = keyBuffer;
  return _cachedKey;
}

export function isFieldEncryptionEnabled(): boolean {
  return getFieldKey().length === 32;
}

export function encryptField(plaintext: string | null | undefined): string | null {
  if (!plaintext) return plaintext as string | null;

  const key = getFieldKey();
  if (key.length === 0) return plaintext;

  if (isEncryptedField(plaintext)) return plaintext;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return PREFIX + iv.toString("hex") + ":" + tag.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptField(stored: string | null | undefined): string | null {
  if (!stored) return stored as string | null;
  if (!stored.startsWith(PREFIX)) return stored;

  const key = getFieldKey();
  if (key.length === 0) {
    logger.warn("Cannot decrypt field — FIELD_ENCRYPTION_KEY not set", "field-encryption");
    return stored;
  }

  try {
    const parts = stored.slice(PREFIX.length).split(":");
    if (parts.length !== 3) return stored;

    const iv = Buffer.from(parts[0], "hex");
    const tag = Buffer.from(parts[1], "hex");
    const ciphertext = Buffer.from(parts[2], "hex");

    if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) return stored;

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (err) {
    logger.error("Field decryption failed — data may be corrupted", "field-encryption", err);
    return stored;
  }
}

function isEncryptedField(value: string | null | undefined): boolean {
  if (!value || !value.startsWith(PREFIX)) return false;
  const parts = value.slice(PREFIX.length).split(":");
  if (parts.length !== 3) return false;
  return parts[0].length === IV_LENGTH * 2 && parts[1].length === TAG_LENGTH * 2 && parts[2].length > 0
    && /^[0-9a-f]+$/.test(parts[0]) && /^[0-9a-f]+$/.test(parts[1]) && /^[0-9a-f]+$/.test(parts[2]);
}

export function maskSensitiveField(value: string | null | undefined, visibleChars = 4): string {
  if (!value) return "";
  const decrypted = decryptField(value);
  if (!decrypted) return "";
  const clean = decrypted.replace(/[\s\-\.]/g, "");
  if (clean.length <= visibleChars) return "****";
  return "*".repeat(clean.length - visibleChars) + clean.slice(-visibleChars);
}

export type SensitiveFieldName =
  | "dni" | "taxId"
  | "phone" | "address" | "city" | "postalCode";

const ALL_SENSITIVE: readonly SensitiveFieldName[] = [
  "dni", "taxId",
  "phone", "address", "city", "postalCode",
];

export function encryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fields: readonly SensitiveFieldName[] = ALL_SENSITIVE
): T {
  if (!isFieldEncryptionEnabled()) return data;
  const result = { ...data };
  for (const field of fields) {
    if (field in result && typeof result[field] === "string" && result[field]) {
      (result as any)[field] = encryptField(result[field] as string);
    }
  }
  return result;
}

export function decryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fields: readonly SensitiveFieldName[] = ALL_SENSITIVE
): T {
  const result = { ...data };
  for (const field of fields) {
    if (field in result && typeof result[field] === "string") {
      (result as any)[field] = decryptField(result[field] as string);
    }
  }
  return result;
}
