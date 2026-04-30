/**
 * Drip exactly-once regression — outbox edition (Task #38, 2026-04-30).
 *
 * Replaces the legacy "sentinel + immediate path" scenario suite with one
 * scenario per audit residual (audit doc row A2 in
 * `docs/audits/produccion-2026-04/01-funcional.md`):
 *
 *   (a) SMTP-ACK → sentinel write window
 *       Reproduction: stub `dispatchOutbox` to record + succeed, stub
 *       `markOutboxRowSent` to throw on every call. After the worker
 *       exhausts its in-tx retry budget, `poisonOutboxRow` parks the
 *       row at `next_attempt_at = 9999-12-31` so the next claim
 *       cannot re-pick it. Assertion: SMTP fires exactly once across
 *       multiple drain passes (no duplicate marketing email).
 *
 *   (b) Lease overlap (stale claim re-acquired by another worker)
 *       Reproduction: claim a row directly via `claimDueOutboxRows`
 *       (worker A). Force the row's `claimed_at` to a stale value
 *       (>10 min in the past). A second `claimDueOutboxRows` call
 *       (worker B) re-claims it — `claim_version` increments. Worker
 *       A's belated `markOutboxRowSent({claimVersion: oldToken})`
 *       returns `false` (CAS mismatch). Worker B successfully marks
 *       the row sent with its own token. Assertion: exactly one
 *       `sent_at` write persists, no spurious mark from worker A.
 *
 *   (c) Sentinel + poison double-fail
 *       Reproduction: stub `markOutboxRowSent` AND `poisonOutboxRow`
 *       to throw. The row is left with `claim_version` bumped and
 *       `claimed_at` non-null. Repeatedly re-stale the row and run
 *       `_drainOnceForTests()` until `attempts >= max_attempts`.
 *       After the cap the row is invisible to the claim selector
 *       even though `next_attempt_at` is still in the past.
 *       Assertion: total dispatches across all drain passes equals
 *       `max_attempts` (bounded — not unbounded).
 *
 * Run: `npx tsx exentax-web/tests/drip-exactly-once.test.ts`
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
    process.stdout.write("  SKIP no DATABASE_URL — drip outbox test needs Postgres\n");
    return;
  }

  // Apply migrations (idempotent) so `email_outbox` exists.
  const dbMod = await import("../server/db");
  await dbMod.runColumnMigrations();

  const schema = await import("../shared/schema");
  const { eq, sql } = await import("drizzle-orm");
  const drip = await import("../server/scheduled/drip-worker");
  const marketing = await import("../server/storage/marketing");

  const ts = Date.now();

  // Helper: insert a fresh enrollment + outbox row, both immediately due.
  async function setupRow(label: string, opts?: { maxAttempts?: number }) {
    const email = `drip-${label}-${ts}@test.local`;
    const { randomUUID } = await import("crypto");
    // Defensive cleanup so reruns don't accumulate stale rows.
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.email, email));

    const enrollmentId = `DRIP_${randomUUID().replace(/-/g, "").slice(0, 28)}`;
    const unsubToken = randomUUID().replace(/-/g, "");
    await dbMod.db.insert(schema.dripEnrollments).values({
      id: enrollmentId,
      email,
      name: "TestDrip",
      language: "es",
      source: "guide",
      currentStep: 0,
      lastSentStep: 0,
      nextSendAt: new Date(Date.now() - 60_000).toISOString(),
      unsubscribeToken: unsubToken,
    });

    const outboxId = `OBX_${randomUUID().replace(/-/g, "").slice(0, 28)}`;
    const payload: marketing.OutboxPayload = {
      kind: "guide",
      email,
      name: "TestDrip",
      language: "es",
      step: 1,
      unsubToken,
    };
    await dbMod.db.execute(sql`
      INSERT INTO email_outbox (id, enrollment_id, step, payload, next_attempt_at, max_attempts)
      VALUES (
        ${outboxId},
        ${enrollmentId},
        1,
        ${JSON.stringify(payload)},
        ${new Date(Date.now() - 60_000).toISOString()},
        ${opts?.maxAttempts ?? 8}
      )
    `);
    return { email, enrollmentId, outboxId };
  }

  // Helper: rewind a row's `claimed_at` so the next claim treats it as
  // a stale (crashed-worker) lease.
  async function makeClaimStale(outboxId: string) {
    const stale = new Date(Date.now() - 30 * 60_000).toISOString(); // 30 min ago
    await dbMod.db.execute(sql`
      UPDATE email_outbox
         SET claimed_at = ${stale},
             next_attempt_at = ${new Date(Date.now() - 60_000).toISOString()}
       WHERE id = ${outboxId}
    `);
  }

  // Helper: read the current outbox row for assertions.
  async function readRow(outboxId: string) {
    const r = await dbMod.db.execute(sql`
      SELECT id, claim_version AS "claimVersion", attempts,
             max_attempts AS "maxAttempts",
             sent_at AS "sentAt", claimed_at AS "claimedAt",
             next_attempt_at AS "nextAttemptAt", last_error AS "lastError"
        FROM email_outbox
       WHERE id = ${outboxId}
       LIMIT 1
    `);
    const rows = (r as unknown as { rows: Array<{
      id: string; claimVersion: number; attempts: number; maxAttempts: number;
      sentAt: string | null; claimedAt: string | null;
      nextAttemptAt: string; lastError: string | null;
    }> }).rows ?? [];
    return rows[0] ?? null;
  }

  // ════════════════════════════════════════════════════════════════════
  // Scenario (a): SMTP-ACK → sentinel write window
  // ════════════════════════════════════════════════════════════════════
  process.stdout.write("\n--- Scenario (a): SMTP OK + markOutboxRowSent fails forever → poisoned, no duplicate ---\n");
  {
    const { outboxId } = await setupRow("a");
    const sendCalls: Array<{ email: string; step: number }> = [];
    drip._setSendOverridesForTests({
      guide: (async (data) => {
        sendCalls.push({ email: data.email, step: data.step });
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
      // markSent throws every time — simulates the SMTP-ACK→sentinel
      // window where the DB UPDATE persistently fails (network blip,
      // pgbouncer churn, replica failover). After MARK_SENT_RETRIES
      // the worker poisons the row.
      markSent: (async () => {
        throw new Error("simulated DB blip — markOutboxRowSent failed");
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    });

    // Pass 1: SMTP fires, sentinel fails 3x → poison.
    await drip._drainOnceForTests();
    let row = await readRow(outboxId);
    assert(row !== null, "(a) row still exists after pass 1");
    assert(sendCalls.length === 1, `(a) SMTP fired exactly once on pass 1 (got ${sendCalls.length})`);
    assert(row?.sentAt === null, "(a) sent_at NOT set (sentinel write failed)");
    assert(
      row?.lastError?.startsWith("POISONED:") === true,
      `(a) row was poisoned (lastError prefix; got ${row?.lastError?.slice(0, 60)})`,
    );
    assert(
      row?.nextAttemptAt?.startsWith("9999-") === true,
      `(a) next_attempt_at parked at far future (got ${row?.nextAttemptAt})`,
    );

    // Pass 2: even with stale claim, the far-future next_attempt_at
    // makes the row ineligible. Restore the markSent stub to a no-op
    // success so we can prove eligibility, not stub behaviour, is what
    // blocks re-dispatch.
    drip._setSendOverridesForTests({
      markSent: (async () => true) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    });
    await makeClaimStale(outboxId);
    // makeClaimStale also rewinds next_attempt_at — undo that for this
    // scenario (we want to prove the poison far-future timestamp wins).
    await dbMod.db.execute(sql`
      UPDATE email_outbox SET next_attempt_at = '9999-12-31T00:00:00.000Z' WHERE id = ${outboxId}
    `);
    await drip._drainOnceForTests();
    assert(
      sendCalls.length === 1,
      `(a) SMTP STILL fired exactly once after pass 2 — poison blocks re-claim (got ${sendCalls.length})`,
    );

    // Reset hooks for next scenario.
    drip._setSendOverridesForTests({ guide: null, markSent: null });
  }

  // ════════════════════════════════════════════════════════════════════
  // Scenario (b): Lease overlap — stale claim re-acquired
  // ════════════════════════════════════════════════════════════════════
  process.stdout.write("\n--- Scenario (b): stale-lease reclaim → fencing CAS rejects worker A's belated mark ---\n");
  {
    const { outboxId } = await setupRow("b");

    // Worker A: claim the row, capture its claim_version (the fencing
    // token). We mimic worker A by calling `claimDueOutboxRows`
    // directly so we own the token without going through the worker
    // loop.
    const workerA = await marketing.claimDueOutboxRows({ limit: 5, staleSeconds: 600 });
    const aRow = workerA.find((r) => r.id === outboxId);
    assert(aRow !== undefined, "(b) worker A claimed the row");
    const aClaimVersion = aRow!.claimVersion;
    assert(aClaimVersion === 1, `(b) worker A's claim_version = 1 (got ${aClaimVersion})`);

    // Now make the lease look stale (worker A "crashed" mid-flight).
    await makeClaimStale(outboxId);

    // Worker B: re-claim — claim_version bumps to 2.
    const workerB = await marketing.claimDueOutboxRows({ limit: 5, staleSeconds: 600 });
    const bRow = workerB.find((r) => r.id === outboxId);
    assert(bRow !== undefined, "(b) worker B re-claimed the stale row");
    const bClaimVersion = bRow!.claimVersion;
    assert(bClaimVersion === 2, `(b) worker B's claim_version = 2 (fencing token bumped; got ${bClaimVersion})`);

    // Worker A returns from its (hypothetical) SMTP send and tries to
    // mark sent with its STALE token. The fencing CAS must reject.
    const aMarked = await marketing.markOutboxRowSent({ id: outboxId, claimVersion: aClaimVersion });
    assert(aMarked === false, "(b) worker A's belated markOutboxRowSent CAS-rejected (no spurious sent_at write)");

    // Worker B's mark with its current token must succeed.
    const bMarked = await marketing.markOutboxRowSent({ id: outboxId, claimVersion: bClaimVersion });
    assert(bMarked === true, "(b) worker B's markOutboxRowSent succeeded (current token)");

    const row = await readRow(outboxId);
    assert(row?.sentAt !== null, "(b) sent_at persisted exactly once (by worker B)");
    assert(row?.claimedAt === null, "(b) claimed_at cleared after successful mark");

    // Worker A trying again post-mark must still be rejected (sent_at
    // is non-null, so the WHERE clause excludes it).
    const aRetry = await marketing.markOutboxRowSent({ id: outboxId, claimVersion: aClaimVersion });
    assert(aRetry === false, "(b) worker A's post-mark retry also rejected (sent_at filter)");
  }

  // ════════════════════════════════════════════════════════════════════
  // Scenario (b'): Lease overlap — SMTP-LEVEL no-duplicate
  //   The CAS in `markOutboxRowSent` only blocks stale DB writes. Per
  //   the second code review, we also need to prove that the stale
  //   claimant doesn't even DISPATCH SMTP after another worker
  //   reclaims the row. This scenario calls `sendOutboxRow` for both
  //   worker A and worker B with their respective claim snapshots and
  //   asserts SMTP fires exactly once (worker B's). Worker A's call
  //   must abandon at the pre-send fence check.
  // ════════════════════════════════════════════════════════════════════
  process.stdout.write("\n--- Scenario (b'): stale-lease reclaim → pre-send fence prevents duplicate SMTP ---\n");
  {
    const { outboxId } = await setupRow("b2");

    // Record SMTP dispatches across both worker calls.
    const sendCalls: Array<{ step: number }> = [];
    drip._setSendOverridesForTests({
      guide: (async (data) => {
        sendCalls.push({ step: data.step });
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
    });

    // Worker A claims, then "stalls" before its SMTP dispatch.
    const workerAClaim = await marketing.claimDueOutboxRows({ limit: 5, staleSeconds: 600 });
    const aRowSnap = workerAClaim.find((r) => r.id === outboxId);
    assert(aRowSnap !== undefined, "(b') worker A claimed the row (snapshot held)");

    // Make the row's claim look stale so worker B can reclaim.
    await makeClaimStale(outboxId);

    // Worker B reclaims (claim_version bumps to 2).
    const workerBClaim = await marketing.claimDueOutboxRows({ limit: 5, staleSeconds: 600 });
    const bRowSnap = workerBClaim.find((r) => r.id === outboxId);
    assert(bRowSnap !== undefined, "(b') worker B reclaimed the stale row");
    assert(
      bRowSnap!.claimVersion > aRowSnap!.claimVersion,
      `(b') worker B's claim_version > A's (got A=${aRowSnap!.claimVersion}, B=${bRowSnap!.claimVersion})`,
    );

    // Worker A finally resumes and tries to dispatch with its STALE
    // snapshot. The pre-send fence MUST abandon it without SMTP.
    const aResult = await drip.sendOutboxRow(aRowSnap!);
    assert(aResult === false, "(b') worker A.sendOutboxRow() returned false (abandoned at pre-send fence)");
    assert(sendCalls.length === 0, `(b') worker A did NOT dispatch SMTP after reclaim (got ${sendCalls.length})`);

    // Worker B's send proceeds normally — pre-send fence sees its
    // current claim_version, dispatches, and persists sent_at.
    const bResult = await drip.sendOutboxRow(bRowSnap!);
    assert(bResult === true, "(b') worker B.sendOutboxRow() succeeded");
    assert(sendCalls.length === 1, `(b') exactly ONE SMTP dispatched across both workers (got ${sendCalls.length})`);

    const finalRow = await readRow(outboxId);
    assert(finalRow?.sentAt !== null, "(b') sent_at persisted exactly once");

    drip._setSendOverridesForTests({ guide: null });
  }

  // ════════════════════════════════════════════════════════════════════
  // Scenario (c): Sentinel + poison double-fail → bounded by attempts cap
  // ════════════════════════════════════════════════════════════════════
  process.stdout.write("\n--- Scenario (c): markSent + poison both fail → attempts cap bounds duplicates ---\n");
  {
    const MAX_ATTEMPTS = 3;
    const { outboxId } = await setupRow("c", { maxAttempts: MAX_ATTEMPTS });
    const sendCalls: Array<{ step: number }> = [];

    drip._setSendOverridesForTests({
      guide: (async (data) => {
        sendCalls.push({ step: data.step });
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
      // markSent throws — exercises poison branch.
      markSent: (async () => {
        throw new Error("simulated DB blip — markOutboxRowSent failed");
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    });

    // Drain repeatedly. Each pass:
    //   - claims (attempts++)
    //   - SMTP succeeds (sendCalls++)
    //   - markSent fails 3x (each pass exhausts in-tx retries)
    //   - poisonOutboxRow itself can run (we do NOT stub it failing
    //     here because the schema-level CAS already restricts it).
    //
    // The first successful poison call sets next_attempt_at to
    // 9999-12-31, after which the row is ineligible. So under perfect
    // conditions the cap isn't even hit. To exercise residual (c)
    // strictly we need to ALSO defeat poison — accomplished by
    // re-staling and re-arming the row's next_attempt_at after each
    // pass, simulating the operator (or a runaway recovery script)
    // who undoes the poison parking. This proves the attempts cap is
    // a SECOND line of defense even if the poison parking is bypassed.
    let passes = 0;
    const MAX_PASSES = MAX_ATTEMPTS + 2; // give it room beyond the cap
    while (passes < MAX_PASSES) {
      passes++;
      await drip._drainOnceForTests();
      // Undo poison parking + clear stale lease so the row would be
      // eligible IF attempts cap weren't enforced.
      await dbMod.db.execute(sql`
        UPDATE email_outbox
           SET claimed_at = NULL,
               next_attempt_at = ${new Date(Date.now() - 60_000).toISOString()}
         WHERE id = ${outboxId}
      `);
      const row = await readRow(outboxId);
      if (row && row.attempts >= MAX_ATTEMPTS) break;
    }

    const final = await readRow(outboxId);
    assert(
      final?.attempts === MAX_ATTEMPTS,
      `(c) attempts climbed to MAX_ATTEMPTS=${MAX_ATTEMPTS} (got ${final?.attempts})`,
    );
    assert(
      sendCalls.length === MAX_ATTEMPTS,
      `(c) SMTP fired exactly MAX_ATTEMPTS=${MAX_ATTEMPTS} times — bounded duplicates (got ${sendCalls.length})`,
    );

    // One more drain pass with row re-eligibilised: should NOT fire again.
    const beforeFinalDrain = sendCalls.length;
    await dbMod.db.execute(sql`
      UPDATE email_outbox
         SET claimed_at = NULL,
             next_attempt_at = ${new Date(Date.now() - 60_000).toISOString()}
       WHERE id = ${outboxId}
    `);
    await drip._drainOnceForTests();
    assert(
      sendCalls.length === beforeFinalDrain,
      `(c) post-cap drain pass did NOT dispatch — attempts < max_attempts gate honoured (got ${sendCalls.length})`,
    );

    drip._setSendOverridesForTests({ guide: null, markSent: null });
  }

  // ════════════════════════════════════════════════════════════════════
  // Scenario (d): Post-SMTP transaction atomicity
  //   Reproduces the partial-commit failure mode the reviewer flagged
  //   when `advanceDripEnrollment` was called outside `tx`. Forces a
  //   throw INSIDE the post-send tx (after `markOutboxRowSent`
  //   succeeds) and asserts that NEITHER the sentinel write
  //   (`email_outbox.sent_at`) NOR the enrollment advance
  //   (`drip_enrollments.current_step`) commits. The row stays
  //   reclaimable in a clean state on the next worker tick.
  // ════════════════════════════════════════════════════════════════════
  process.stdout.write("\n--- Scenario (d): post-SMTP tx atomicity (markSent OK, advance throws → all rolled back) ---\n");
  {
    const { outboxId, enrollmentId } = await setupRow("d");
    const sendCalls: Array<{ step: number }> = [];

    drip._setSendOverridesForTests({
      guide: (async (data) => {
        sendCalls.push({ step: data.step });
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
      // markSent succeeds — exercise the path where the tx fails
      // LATER (during advance / next-step enqueue) so we can prove
      // the markSent write also rolls back when the tx aborts.
      markSent: (async (opts: { id: string; claimVersion: number }, txDb?: unknown) => {
        // Delegate to real implementation but use the tx (txDb) so
        // the write participates in the post-send transaction. If the
        // wrapping tx aborts, this UPDATE must roll back too.
        return marketing.markOutboxRowSent(opts, txDb as Parameters<typeof marketing.markOutboxRowSent>[1]);
      }) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    });

    // Force the post-send tx to throw AFTER markOutboxRowSent
    // succeeds: install a temporary BEFORE-UPDATE trigger on
    // drip_enrollments that raises an exception for this specific
    // enrollment_id. The worker's `advanceDripEnrollment(..., tx)`
    // call (the first UPDATE of drip_enrollments inside the tx)
    // will throw, aborting the whole post-send tx and proving that
    // markOutboxRowSent's write rolls back atomically with the
    // advance.
    // PL/pgSQL function bodies can't be parameterized — inline the
    // enrollment id as a literal. `enrollmentId` is generated above
    // as `DRIP_<32-hex>`, fully alphanumeric/underscore, so no
    // injection risk.
    if (!/^[A-Za-z0-9_]+$/.test(enrollmentId)) {
      throw new Error(`unexpected enrollmentId shape (refusing to inline): ${enrollmentId}`);
    }
    await dbMod.db.execute(sql.raw(`
      CREATE OR REPLACE FUNCTION drip_test_d_throw() RETURNS trigger AS $$
      BEGIN
        IF NEW.id = '${enrollmentId}' THEN
          RAISE EXCEPTION 'simulated post-send advance failure (test scenario d)';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `));
    await dbMod.db.execute(sql`
      DROP TRIGGER IF EXISTS drip_test_d_trigger ON drip_enrollments
    `);
    await dbMod.db.execute(sql`
      CREATE TRIGGER drip_test_d_trigger
      BEFORE UPDATE ON drip_enrollments
      FOR EACH ROW EXECUTE FUNCTION drip_test_d_throw()
    `);

    try {
      await drip._drainOnceForTests();
    } finally {
      // Always tear down the trigger so subsequent test scenarios /
      // reruns don't inherit it.
      await dbMod.db.execute(sql`DROP TRIGGER IF EXISTS drip_test_d_trigger ON drip_enrollments`);
      await dbMod.db.execute(sql`DROP FUNCTION IF EXISTS drip_test_d_throw()`);
    }

    assert(sendCalls.length === 1, `(d) SMTP fired exactly once (got ${sendCalls.length})`);

    // Atomicity: NEITHER sent_at NOR enrollment.current_step should
    // have advanced — the entire post-send tx rolled back.
    const row = await readRow(outboxId);
    assert(row?.sentAt === null, `(d) sent_at NOT persisted (tx rolled back; got ${row?.sentAt})`);

    const er = await dbMod.db
      .select()
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId))
      .limit(1);
    const enrollment = er[0];
    assert(enrollment?.currentStep === 0, `(d) enrollment.currentStep NOT advanced (tx rolled back; got ${enrollment?.currentStep})`);
    assert(enrollment?.lastSentStep === 0, `(d) enrollment.lastSentStep NOT bumped (tx rolled back; got ${enrollment?.lastSentStep})`);

    // Worker poisoned the row (advance failed every retry). Verify
    // the poison branch ran and parked the row, AND that no
    // duplicate SMTP fires on a subsequent drain.
    assert(
      row?.lastError?.startsWith("POISONED:") === true,
      `(d) row was poisoned after exhausted retries (got lastError prefix; ${row?.lastError?.slice(0, 60)})`,
    );

    // Final eligibility check: a follow-up drain must NOT re-dispatch.
    drip._setSendOverridesForTests({ markSent: null });
    await drip._drainOnceForTests();
    assert(sendCalls.length === 1, `(d) follow-up drain did NOT re-dispatch (poison parking honoured; got ${sendCalls.length})`);

    drip._setSendOverridesForTests({ guide: null });
  }

  // ════════════════════════════════════════════════════════════════════
  // Cleanup test rows so reruns start clean.
  // ════════════════════════════════════════════════════════════════════
  await dbMod.db.execute(sql`
    DELETE FROM drip_enrollments WHERE email LIKE ${`drip-%-${ts}@test.local`}
  `);

  process.stdout.write("\n");
  if (failures.length > 0) {
    process.stdout.write(`drip outbox exactly-once test FAILED (${failures.length} assertions)\n`);
    process.exit(1);
  }
  process.stdout.write("drip outbox exactly-once test PASSED\n");
}

main().catch((err) => {
  process.stdout.write(`\nFATAL ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
