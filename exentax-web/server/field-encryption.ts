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
  // null, undefined, and empty string all return null (nothing to encrypt)
  if (!plaintext) return null;

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

/**
 * Public predicate used by the key-rotation script to identify which rows
 * carry the `ef:` envelope (and therefore need to be re-encrypted) vs.
 * legacy plaintext rows that should be left alone.
 */
export function isFieldEncryptionEnvelope(value: string | null | undefined): boolean {
  return isEncryptedField(value);
}

/**
 * Encryption / decryption primitives that take an explicit key buffer
 * instead of consulting `process.env.FIELD_ENCRYPTION_KEY`. Exists so the
 * key-rotation script (`scripts/rotate-encryption-key.ts`) can decrypt with
 * the OLD key and re-encrypt with the NEW key inside the same process
 * without having to swap module-level state. The runtime application path
 * still uses the cached-key `encryptField` / `decryptField` above — never
 * change a request handler to call these directly.
 *
 * `key` must be exactly 32 bytes (AES-256) or these functions throw. They
 * never silently degrade to "store as plaintext" the way the runtime path
 * does in dev — the rotation tool is operator-invoked and should fail loud.
 */
export function encryptFieldWithKey(key: Buffer, plaintext: string): string {
  if (key.length !== 32) throw new Error("encryptFieldWithKey: key must be 32 bytes");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + iv.toString("hex") + ":" + tag.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Returns the decrypted plaintext, or null if the value cannot be decrypted
 * with the supplied key. Distinguishing "not encrypted" from "encrypted with
 * a different key" matters for the rotation script: legacy plaintext rows
 * are skipped, but rows encrypted under an unknown key are surfaced as
 * errors so the operator notices a missing key generation.
 */
export function tryDecryptFieldWithKey(key: Buffer, stored: string): string | null {
  if (!isEncryptedField(stored)) return null;
  if (key.length !== 32) throw new Error("tryDecryptFieldWithKey: key must be 32 bytes");
  try {
    const parts = stored.slice(PREFIX.length).split(":");
    const iv = Buffer.from(parts[0], "hex");
    const tag = Buffer.from(parts[1], "hex");
    const ciphertext = Buffer.from(parts[2], "hex");
    if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) return null;
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    // Auth-tag mismatch (wrong key) or malformed envelope. Caller decides.
    return null;
  }
}

export type SensitiveFieldName = "phone";

const ALL_SENSITIVE: readonly SensitiveFieldName[] = ["phone"];

export function encryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fields: readonly SensitiveFieldName[] = ALL_SENSITIVE
): T {
  if (!isFieldEncryptionEnabled()) return data;
  const result = { ...data };
  for (const field of fields) {
    if (field in result && typeof result[field] === "string" && result[field]) {
      (result as Record<string, unknown>)[field] = encryptField(result[field] as string);
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
      (result as Record<string, unknown>)[field] = decryptField(result[field] as string);
    }
  }
  return result;
}
