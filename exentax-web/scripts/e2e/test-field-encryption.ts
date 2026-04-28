// Field encryption E2E test (Bloque 6)
// Verifies AES-256-GCM round-trip, IV uniqueness, tag tampering rejection,
// idempotency, and sensitive-fields integration.
//
// Run with: FIELD_ENCRYPTION_KEY=<64 hex chars> npx tsx scripts/e2e/test-field-encryption.ts

import crypto from "crypto";

// Generate test key if not provided (sandbox mode)
if (!process.env.FIELD_ENCRYPTION_KEY) {
  process.env.FIELD_ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
  console.log("[setup] FIELD_ENCRYPTION_KEY generated for test:", process.env.FIELD_ENCRYPTION_KEY.slice(0, 16) + "…");
}

import {
  encryptField,
  decryptField,
  isFieldEncryptionEnabled,
  encryptSensitiveFields,
  decryptSensitiveFields,
} from "../../server/field-encryption.js";

let asserts = 0;
let passed = 0;
const fails: string[] = [];

function assert(cond: boolean, msg: string) {
  asserts++;
  if (cond) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    fails.push(msg);
    console.log(`  ✗ FAIL: ${msg}`);
  }
}

console.log("\n=== Field Encryption E2E Test ===\n");

// 1. Setup verification
console.log("[1] Setup");
assert(isFieldEncryptionEnabled(), "isFieldEncryptionEnabled() returns true with valid 32-byte key");

// 2. Round-trip
console.log("\n[2] Round-trip");
const plaintexts = [
  "+34 600 123 456",
  "test@exentax.com",
  "Madrid, España",
  "🇪🇸 unicode test",
  "x".repeat(1000),
  "single",
];
for (const pt of plaintexts) {
  const ct = encryptField(pt);
  assert(ct !== null && ct !== pt, `encrypt produces ciphertext for "${pt.slice(0, 30)}…"`);
  assert(ct?.startsWith("ef:") === true, `ciphertext has "ef:" prefix`);
  const dt = decryptField(ct);
  assert(dt === pt, `decrypt restores original "${pt.slice(0, 30)}…"`);
}

// 3. IV uniqueness — same plaintext, different ciphertexts
console.log("\n[3] IV uniqueness (probabilistic encryption)");
const pt = "+34 600 000 000";
const cts = new Set<string>();
for (let i = 0; i < 50; i++) {
  cts.add(encryptField(pt) as string);
}
assert(cts.size === 50, `50 encryptions of same plaintext produce 50 distinct ciphertexts (got ${cts.size})`);

// All decrypt back to same plaintext
let allDecryptOk = true;
for (const ct of cts) {
  if (decryptField(ct) !== pt) allDecryptOk = false;
}
assert(allDecryptOk, "All 50 distinct ciphertexts decrypt back to original");

// 4. Auth tag tampering rejection
console.log("\n[4] Auth tag tampering rejection");
const goodCt = encryptField("sensitive data");
if (goodCt) {
  const parts = goodCt.slice(3).split(":");
  // Flip a bit in the tag
  const tagBytes = Buffer.from(parts[1], "hex");
  tagBytes[0] ^= 0x01;
  const tamperedCt = "ef:" + parts[0] + ":" + tagBytes.toString("hex") + ":" + parts[2];
  const decryptedTampered = decryptField(tamperedCt);
  assert(decryptedTampered !== "sensitive data", "Tampered tag does NOT decrypt to original");
  // Should return the stored (tampered) value as fallback per implementation
  assert(decryptedTampered === tamperedCt, "Tampered ciphertext returns stored value (graceful fallback)");

  // Flip a bit in ciphertext
  const ctBytes = Buffer.from(parts[2], "hex");
  ctBytes[0] ^= 0x01;
  const tamperedCt2 = "ef:" + parts[0] + ":" + parts[1] + ":" + ctBytes.toString("hex");
  const decryptedTampered2 = decryptField(tamperedCt2);
  assert(decryptedTampered2 !== "sensitive data", "Tampered ciphertext bytes does NOT decrypt to original");
}

// 5. Idempotency — encrypting already-encrypted returns as-is
console.log("\n[5] Idempotency");
const ct1 = encryptField("test value");
const ct2 = encryptField(ct1 as string);
assert(ct1 === ct2, "encryptField on already-encrypted value is idempotent (no double encryption)");

// 6. Null/empty/undefined handling
console.log("\n[6] Null/empty/undefined handling");
assert(encryptField(null) === null, "encryptField(null) returns null");
assert(encryptField(undefined) === null, "encryptField(undefined) returns null");
assert(encryptField("") === null, "encryptField('') returns null");
assert(decryptField(null) === null, "decryptField(null) returns null");
assert(decryptField("not-encrypted-plaintext") === "not-encrypted-plaintext",
  "decryptField passes through non-encrypted plaintext");

// 7. Format validation
console.log("\n[7] Format validation");
const ctSample = encryptField("format test") as string;
const partsCheck = ctSample.slice(3).split(":");
assert(partsCheck.length === 3, "ciphertext has exactly 3 colon-separated parts");
assert(partsCheck[0].length === 32, `IV is 16 bytes = 32 hex chars (got ${partsCheck[0].length})`);
assert(partsCheck[1].length === 32, `Tag is 16 bytes = 32 hex chars (got ${partsCheck[1].length})`);
assert(/^[0-9a-f]+$/.test(partsCheck[0]), "IV is valid hex");
assert(/^[0-9a-f]+$/.test(partsCheck[1]), "Tag is valid hex");
assert(/^[0-9a-f]+$/.test(partsCheck[2]), "Ciphertext is valid hex");

// 8. encryptSensitiveFields / decryptSensitiveFields integration
console.log("\n[8] Sensitive fields integration");
const record = {
  id: 1,
  email: "user@example.com",
  phone: "+34 600 111 222",
  notes: "non-sensitive text",
};
const encrypted = encryptSensitiveFields(record);
assert(encrypted.id === 1, "encryptSensitiveFields preserves non-string fields");
assert(encrypted.email === "user@example.com", "encryptSensitiveFields does NOT touch email by default");
assert((encrypted.phone as string).startsWith("ef:"),
  "encryptSensitiveFields encrypts phone by default");
assert(encrypted.notes === "non-sensitive text", "encryptSensitiveFields does NOT touch notes");

const decrypted = decryptSensitiveFields(encrypted);
assert(decrypted.phone === "+34 600 111 222", "decryptSensitiveFields restores phone");
assert(decrypted.email === "user@example.com", "decryptSensitiveFields preserves untouched email");

// 9. Round-trip on records with no sensitive fields
console.log("\n[9] Records without sensitive fields");
const noSensitive = { id: 2, title: "Public data" };
const encNoSens = encryptSensitiveFields(noSensitive);
assert(JSON.stringify(encNoSens) === JSON.stringify(noSensitive),
  "encryptSensitiveFields no-op on record without sensitive fields");

// 10. Algorithm verification
console.log("\n[10] Algorithm verification");
const algoTest = encryptField("algo check");
const algoParts = (algoTest as string).slice(3).split(":");
assert(algoParts[0].length === 32, "Uses 16-byte IV (AES-GCM standard)");
assert(algoParts[1].length === 32, "Uses 16-byte auth tag (AES-GCM-256 standard)");

// === Summary ===
console.log("\n=== Summary ===");
console.log(`${passed}/${asserts} assertions passed.`);
if (fails.length > 0) {
  console.log("\nFailures:");
  for (const f of fails) console.log("  -", f);
  process.exit(1);
}
console.log("\n✓ AES-256-GCM E2E: PASS");
process.exit(0);
