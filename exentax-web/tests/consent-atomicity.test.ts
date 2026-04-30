/**
 * A4 regression: GDPR `consent_log` and `newsletter_subscribers` writes
 * must be atomic with the surrounding business write (booking /
 * calculator / newsletter footer). When the enclosing transaction rolls
 * back, NEITHER table may contain orphan rows for the affected email.
 *
 * Scenarios verified:
 *   1. Rollback after both inserts: the caller throws after
 *      `insertConsentLog` and `upsertNewsletterSubscriber` have run
 *      with the same `tx` handle. Both tables MUST be empty for the
 *      test email after the throw.
 *   2. Commit success: same calls without the throw → both tables
 *      have exactly one row for the test email.
 *   3. Cascade rollback: the consent insert succeeds but a SUBSEQUENT
 *      operation in the tx throws → the consent row that "succeeded"
 *      mid-tx must NOT be visible after rollback.
 *   4. Backwards compatibility: calling `insertConsentLog` and
 *      `upsertNewsletterSubscriber` WITHOUT the `txDb` argument still
 *      works (legacy cookie endpoint path) and commits autonomously.
 *
 * Run: `tsx exentax-web/tests/consent-atomicity.test.ts`
 */

process.env.NODE_ENV = "test";

const failures: string[] = [];
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failures.push(msg);
    process.stdout.write(`  FAIL ${msg}\n`);
  } else {
    process.stdout.write(`  ok   ${msg}\n`);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    process.stdout.write("  SKIP no DATABASE_URL — consent atomicity test needs Postgres\n");
    return;
  }

  const dbMod = await import("../server/db");
  await dbMod.runColumnMigrations();

  const schema = await import("../shared/schema");
  const { eq } = await import("drizzle-orm");
  const marketing = await import("../server/storage/marketing");

  async function countRows(email: string) {
    const consents = await dbMod.db
      .select({ id: schema.consentLog.id })
      .from(schema.consentLog)
      .where(eq(schema.consentLog.email, email));
    const subs = await dbMod.db
      .select({ id: schema.newsletterSubscribers.id })
      .from(schema.newsletterSubscribers)
      .where(eq(schema.newsletterSubscribers.email, email));
    return { consents: consents.length, subs: subs.length };
  }

  async function cleanup(email: string) {
    await dbMod.db.delete(schema.consentLog).where(eq(schema.consentLog.email, email));
    await dbMod.db.delete(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.email, email));
  }

  // ─── 1. Rollback after both inserts ──────────────────────────────────────
  const email1 = `consent-atomic-rollback-${Date.now()}@test.local`;
  await cleanup(email1);

  let threw1 = false;
  try {
    await dbMod.withTransaction(async (tx) => {
      await marketing.insertConsentLog({
        formType: "booking",
        email: email1,
        privacyAccepted: true,
        marketingAccepted: true,
        language: "es",
        source: "booking",
        privacyVersion: "1.0",
        ip: "127.0.0.0",
        userAgent: "test",
      }, tx);
      await marketing.upsertNewsletterSubscriber(email1, "Atomic Test", "booking", ["fiscalidad"], tx);
      throw new Error("simulated post-insert failure");
    });
  } catch (err) {
    threw1 = err instanceof Error && err.message === "simulated post-insert failure";
  }
  assert(threw1, "withTransaction propagated the simulated failure");
  const counts1 = await countRows(email1);
  assert(counts1.consents === 0, `rollback: NO consent_log row exists for ${email1} (got ${counts1.consents})`);
  assert(counts1.subs === 0, `rollback: NO newsletter_subscribers row exists for ${email1} (got ${counts1.subs})`);
  await cleanup(email1);

  // ─── 2. Commit success ───────────────────────────────────────────────────
  const email2 = `consent-atomic-commit-${Date.now()}@test.local`;
  await cleanup(email2);

  let consentId2: string | null = null;
  await dbMod.withTransaction(async (tx) => {
    consentId2 = await marketing.insertConsentLog({
      formType: "calculator",
      email: email2,
      privacyAccepted: true,
      marketingAccepted: true,
      language: "es",
      source: "calculator",
      privacyVersion: "1.0",
      ip: "127.0.0.0",
      userAgent: "test",
    }, tx);
    await marketing.upsertNewsletterSubscriber(email2, "", "calculadora", ["llc"], tx);
  });
  assert(consentId2 !== null && /^CON-/.test(consentId2 ?? ""), `commit: insertConsentLog returned a CON-* id (got ${consentId2})`);
  const counts2 = await countRows(email2);
  assert(counts2.consents === 1, `commit: exactly 1 consent_log row exists for ${email2} (got ${counts2.consents})`);
  assert(counts2.subs === 1, `commit: exactly 1 newsletter_subscribers row exists for ${email2} (got ${counts2.subs})`);
  await cleanup(email2);

  // ─── 3. Cascade rollback when a later op throws ──────────────────────────
  // Reproduces the booking handler shape: insertAgenda would normally come
  // first, then consent, then newsletter, then enqueueEmail. We simulate a
  // late-stage failure to assert the consent that "already inserted"
  // mid-tx does NOT survive the rollback.
  const email3 = `consent-atomic-cascade-${Date.now()}@test.local`;
  await cleanup(email3);

  let threw3 = false;
  try {
    await dbMod.withTransaction(async (tx) => {
      await marketing.insertConsentLog({
        formType: "newsletter_footer",
        email: email3,
        privacyAccepted: true,
        marketingAccepted: false,
        language: "es",
        source: "footer",
        privacyVersion: "1.0",
        ip: "127.0.0.0",
        userAgent: "test",
      }, tx);
      await marketing.upsertNewsletterSubscriber(email3, "", "footer", ["general"], tx);
      // Simulate enqueueEmail failure (or any post-consent op) that aborts the tx.
      throw new Error("simulated late-stage failure (post-consent)");
    });
  } catch (err) {
    threw3 = err instanceof Error && err.message === "simulated late-stage failure (post-consent)";
  }
  assert(threw3, "cascade: late-stage failure propagated out of withTransaction");
  const counts3 = await countRows(email3);
  assert(counts3.consents === 0, `cascade: consent_log row inserted mid-tx is rolled back (got ${counts3.consents})`);
  assert(counts3.subs === 0, `cascade: newsletter row inserted mid-tx is rolled back (got ${counts3.subs})`);
  await cleanup(email3);

  // ─── 4. Backwards compatibility: legacy callers without tx still work ────
  // The cookie banner endpoint uses `insertConsentLog` without a tx
  // (no surrounding business write to attach to). It must still commit
  // autonomously. Same for legacy newsletter subscribe paths.
  const email4 = `consent-atomic-legacy-${Date.now()}@test.local`;
  await cleanup(email4);

  const legacyConsentId = await marketing.insertConsentLog({
    formType: "cookies:cookies_analiticas",
    email: email4,
    privacyAccepted: true,
    marketingAccepted: false,
    language: "es",
    source: "/",
    privacyVersion: "1.0",
    ip: "127.0.0.0",
    userAgent: "test",
  });
  await marketing.upsertNewsletterSubscriber(email4, "", "footer", ["general"]);
  const counts4 = await countRows(email4);
  assert(legacyConsentId !== null, "legacy: insertConsentLog without tx returns an id");
  assert(counts4.consents === 1, `legacy: consent_log row was committed (got ${counts4.consents})`);
  assert(counts4.subs === 1, `legacy: newsletter row was committed (got ${counts4.subs})`);
  await cleanup(email4);
}

main()
  .catch((err) => {
    process.stdout.write(`\nFATAL ${err instanceof Error ? err.stack : String(err)}\n`);
    process.exit(1);
  })
  .then(() => {
    if (failures.length > 0) {
      process.stdout.write(`\n${failures.length} failure(s):\n${failures.map((f) => "  - " + f).join("\n")}\n`);
      process.exit(1);
    } else {
      process.stdout.write("\nAll consent atomicity tests passed.\n");
      process.exit(0);
    }
  });
