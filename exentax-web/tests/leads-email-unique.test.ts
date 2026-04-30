/**
 * Task #28 (2026-04-30) regression: the partial UNIQUE on `leads(email)`
 * (`leads_email_uniq_idx`) plus the `withRetryOnLeadEmailUnique` retry
 * wrapper together guarantee that no duplicate lead row can ever
 * persist for the same address — even when the in-process / Redis
 * `withLeadEmailLock` is bypassed.
 *
 * Scenarios verified:
 *   1. The partial UNIQUE index physically rejects a second INSERT for
 *      the same email — the second statement fails with Postgres
 *      SQLSTATE 23505 and the constraint name `leads_email_uniq_idx`.
 *      The classifier `isLeadEmailUniqueViolation` recognises it; the
 *      generic `isUniqueViolation` agrees.
 *   2. `withRetryOnLeadEmailUnique` re-runs the wrapped operation
 *      exactly once on a unique violation and lets the second pass
 *      walk the SELECT-then-UPDATE branch successfully — the final
 *      lead-rows count for that email is 1, not 2.
 *   3. Errors that are NOT `leads_email_uniq_idx` violations (e.g.
 *      a synthetic non-DB throw) propagate immediately without any
 *      retry — the wrapper must never paper over real bugs.
 *
 * Run: `tsx exentax-web/tests/leads-email-unique.test.ts`
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
    process.stdout.write("  SKIP no DATABASE_URL — leads-email-unique test needs Postgres\n");
    return;
  }

  const dbMod = await import("../server/db");
  await dbMod.runColumnMigrations();

  const schema = await import("../shared/schema");
  const { eq } = await import("drizzle-orm");
  const { generateId } = await import("../server/storage/core");
  const { isLeadEmailUniqueViolation, LEAD_EMAIL_UNIQUE_INDEX_NAME, isUniqueViolation } = await import("../server/storage/core");
  const { withRetryOnLeadEmailUnique } = await import("../server/route-helpers");

  async function cleanup(email: string) {
    await dbMod.db.delete(schema.leads).where(eq(schema.leads.email, email));
  }

  async function countLeads(email: string): Promise<number> {
    const rows = await dbMod.db.select({ id: schema.leads.id }).from(schema.leads).where(eq(schema.leads.email, email));
    return rows.length;
  }

  function baseLead(email: string, idPrefix = "LEAD") {
    return {
      id: generateId(idPrefix),
      firstName: "race-test",
      email,
      phone: "",
      source: "test:leads-email-unique",
      usedCalculator: false,
      scheduledCall: false,
      privacyAccepted: true,
      termsAccepted: true,
      marketingAccepted: false,
    };
  }

  // ─── 1. Direct UNIQUE rejection ─────────────────────────────────────────────
  const email1 = `leads-uniq-direct-${Date.now()}@test.local`;
  await cleanup(email1);

  await dbMod.db.insert(schema.leads).values(baseLead(email1)).execute();

  let raised: unknown = null;
  try {
    await dbMod.db.insert(schema.leads).values(baseLead(email1)).execute();
  } catch (err) {
    raised = err;
  }
  assert(raised !== null, "second INSERT for the same email is rejected by the DB");
  assert(isUniqueViolation(raised), "rejection is a generic unique-constraint violation");
  assert(isLeadEmailUniqueViolation(raised), `rejection's constraint matches ${LEAD_EMAIL_UNIQUE_INDEX_NAME}`);
  const finalCount1 = await countLeads(email1);
  assert(finalCount1 === 1, `exactly 1 lead row remains for ${email1} (got ${finalCount1})`);
  await cleanup(email1);

  // ─── 2. withRetryOnLeadEmailUnique recovers via SELECT-then-UPDATE ────────
  const email2 = `leads-uniq-retry-${Date.now()}@test.local`;
  await cleanup(email2);

  // Pre-seed the row that will "win" the simulated race so the FIRST attempt
  // hits the unique constraint and the SECOND attempt walks the UPDATE branch.
  // This mirrors what would happen if a parallel writer beat us to the INSERT
  // between our SELECT and our INSERT.
  await dbMod.db.insert(schema.leads).values(baseLead(email2, "LEADWIN")).execute();

  let attempts = 0;
  const result = await withRetryOnLeadEmailUnique(async () => {
    attempts++;
    return await dbMod.withTransaction(async (tx) => {
      // Simulate a torn race: the FIRST attempt skips the SELECT and
      // unconditionally INSERTs (as if our SELECT missed the row a parallel
      // writer just committed). The UNIQUE constraint rejects the INSERT
      // and aborts the tx; `withRetryOnLeadEmailUnique` re-runs the body,
      // and on attempt 2 we honour the SELECT and walk the UPDATE branch
      // — exactly what the booking/calculator handlers do in production.
      if (attempts === 1) {
        const fresh = baseLead(email2, "LEADRETRY");
        await tx.insert(schema.leads).values(fresh).execute();
        return { id: fresh.id, branch: "insert" as const };
      }
      const [existing] = await tx.select().from(schema.leads).where(eq(schema.leads.email, email2)).limit(1);
      if (!existing) throw new Error("attempt 2 expected to see the pre-seeded row but found none");
      await tx.update(schema.leads).set({ scheduledCall: true }).where(eq(schema.leads.id, existing.id));
      return { id: existing.id, branch: "update" as const };
    });
  });

  assert(attempts === 2, `withRetryOnLeadEmailUnique ran the body twice (got ${attempts})`);
  assert(result.branch === "update", `second attempt walked the UPDATE branch (got ${result.branch})`);
  const finalCount2 = await countLeads(email2);
  assert(finalCount2 === 1, `exactly 1 lead row remains for ${email2} after retry (got ${finalCount2})`);
  await cleanup(email2);

  // ─── 3. Non-unique errors are NOT swallowed ───────────────────────────────
  let attempts3 = 0;
  let propagated: Error | null = null;
  try {
    await withRetryOnLeadEmailUnique(async () => {
      attempts3++;
      throw new Error("unrelated synthetic failure");
    });
  } catch (err) {
    propagated = err as Error;
  }
  assert(attempts3 === 1, `non-unique error did NOT trigger a retry (got ${attempts3} attempt(s))`);
  assert(propagated !== null && propagated.message === "unrelated synthetic failure", "non-unique error propagated unchanged");

  if (failures.length === 0) {
    process.stdout.write("\nAll leads-email-unique tests passed.\n");
  } else {
    process.stdout.write(`\n${failures.length} leads-email-unique test(s) FAILED.\n`);
    process.exitCode = 1;
  }

  await dbMod.closePool();
}

main().catch((err) => {
  process.stdout.write(`\nleads-email-unique test crashed: ${err instanceof Error ? err.stack || err.message : String(err)}\n`);
  process.exitCode = 1;
});
