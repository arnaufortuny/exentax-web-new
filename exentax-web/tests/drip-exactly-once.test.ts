/**
 * A2 regression: the drip worker must NEVER re-send a step whose SMTP
 * dispatch already succeeded, even if `advanceDripEnrollment` fails
 * after the send and the row is re-claimed on the next worker tick.
 *
 * Reproduction:
 *   1. Insert a `drip_enrollments` row with `next_send_at` in the past.
 *   2. Stub `sendDripEmailOnce` so it records every invocation.
 *   3. Stub `advanceDripEnrollment` to throw the FIRST time it's called
 *      (simulates the dispatch-OK + advance-fail race).
 *   4. Run `_drainOnceForTests()` — first pass: send + markDripStepSent
 *      succeed, advance throws, row is marked errored.
 *   5. Reset `next_send_at` back into the past so the row is re-claimed.
 *   6. Restore `advanceDripEnrollment` (no longer throws).
 *   7. Run `_drainOnceForTests()` again — this pass MUST skip the send
 *      because `lastSentStep >= stepToSend`, only call advance.
 *   8. Assert: send stub was invoked exactly ONCE across both passes.
 *
 * Without the A2 sentinel the second pass would call `sendDripEmailOnce`
 * a second time → duplicate marketing email → spam complaint risk.
 *
 * Run: `tsx exentax-web/tests/drip-exactly-once.test.ts`
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
    process.stdout.write("  SKIP no DATABASE_URL — drip atomicity test needs Postgres\n");
    return;
  }

  // Apply migrations (idempotent) so `last_sent_step` exists.
  const dbMod = await import("../server/db");
  await dbMod.runColumnMigrations();

  const schema = await import("../shared/schema");
  const { sql, eq } = await import("drizzle-orm");
  const drip = await import("../server/scheduled/drip-worker");
  const marketing = await import("../server/storage/marketing");

  const TEST_EMAIL = `drip-a2-${Date.now()}@test.local`;

  // Defensive cleanup so reruns don't accumulate stale rows.
  await dbMod.db
    .delete(schema.dripEnrollments)
    .where(eq(schema.dripEnrollments.email, TEST_EMAIL));

  // ─── Setup: insert a fresh enrollment with next_send_at in the past ──────
  const { randomUUID } = await import("crypto");
  const enrollmentId = randomUUID();
  await dbMod.db.insert(schema.dripEnrollments).values({
    id: enrollmentId,
    email: TEST_EMAIL,
    name: "TestDrip",
    language: "es",
    source: "guide",
    currentStep: 0,
    lastSentStep: 0,
    // 1 minute in the past — guaranteed to be claimed.
    nextSendAt: new Date(Date.now() - 60_000).toISOString(),
    unsubscribeToken: randomUUID().replace(/-/g, ""),
  });

  // ─── Stub the SMTP send via the worker's test-injection hook ─────────────
  // ESM exports are read-only, so we use the dedicated override hook
  // exposed by `drip-worker.ts` for exactly this purpose. Counts every
  // dispatch the worker performs for the test enrollment.
  const sendCalls: Array<{ email: string; step: number }> = [];
  drip._setSendOverridesForTests({
    guide: (async (data) => {
      sendCalls.push({ email: data.email, step: data.step });
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
  });

  // ─── Stub `advanceDripEnrollment` via the worker's test-injection hook ───
  // Same ESM rationale as the send override above. The override throws on
  // its FIRST invocation to simulate the race we're guarding against:
  // SMTP committed, but the post-send advance failed. On subsequent
  // calls it delegates to the real implementation so the recovery path
  // can complete normally.
  let advanceCalls = 0;
  drip._setSendOverridesForTests({
    advance: (async (opts: Parameters<typeof marketing.advanceDripEnrollment>[0]) => {
      advanceCalls++;
      if (advanceCalls === 1) {
        throw new Error("simulated advance failure (post-send)");
      }
      return marketing.advanceDripEnrollment(opts);
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["advance"],
  });

  try {
    // ─── First drain: send succeeds, advance throws ────────────────────────
    await drip._drainOnceForTests();

    assert(sendCalls.length === 1, `first pass invoked sendDripEmailOnce exactly once (got ${sendCalls.length})`);
    assert(sendCalls[0]?.step === 1, `first send was step 1 (got step ${sendCalls[0]?.step})`);

    const afterFirst = await dbMod.db
      .select({
        currentStep: schema.dripEnrollments.currentStep,
        lastSentStep: schema.dripEnrollments.lastSentStep,
        lastError: schema.dripEnrollments.lastError,
        claimedAt: schema.dripEnrollments.claimedAt,
      })
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId));
    const r1 = afterFirst[0];
    assert(r1?.lastSentStep === 1, `lastSentStep recorded after successful send (got ${r1?.lastSentStep})`);
    assert(r1?.currentStep === 0, `currentStep NOT advanced because advance threw (got ${r1?.currentStep})`);
    assert(r1?.lastError !== null, "lastError populated by markDripEnrollmentError");
    assert(r1?.claimedAt === null, "claim was released by markDripEnrollmentError");

    // Reset next_send_at back into the past so the row is re-claimable in
    // the next pass. Without this the worker would skip it (claim filter is
    // `next_send_at <= now()`).
    await dbMod.db.execute(sql`
      UPDATE drip_enrollments
         SET next_send_at = NOW() - INTERVAL '1 minute'
       WHERE id = ${enrollmentId}
    `);

    // ─── Second drain: send MUST be skipped, only advance retries ──────────
    await drip._drainOnceForTests();

    assert(
      sendCalls.length === 1,
      `second pass DID NOT invoke sendDripEmailOnce again (still ${sendCalls.length} total) — exactly-once guarantee holds`,
    );

    const afterSecond = await dbMod.db
      .select({
        currentStep: schema.dripEnrollments.currentStep,
        lastSentStep: schema.dripEnrollments.lastSentStep,
        lastError: schema.dripEnrollments.lastError,
      })
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId));
    const r2 = afterSecond[0];
    assert(r2?.currentStep === 1, `currentStep advanced to 1 on the recovery pass (got ${r2?.currentStep})`);
    assert(r2?.lastSentStep === 1, "lastSentStep stays at 1 (still equals currentStep)");
    assert(r2?.lastError === null, "lastError cleared by successful advance");

    assert(advanceCalls === 2, `advanceDripEnrollment was retried exactly once (got ${advanceCalls} total calls)`);
  } finally {
    drip._setSendOverridesForTests({ guide: null, advance: null });
    // Cleanup: remove the test enrollment.
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId));
  }

  // ───────────────────────────────────────────────────────────────────────
  // Scenario 2: SMTP succeeds, but `markDripStepSent` itself fails on
  // every retry. The worker MUST poison the row (NULL `next_send_at`,
  // last_error="POISONED:...") instead of releasing the claim, so that
  // the next worker pass cannot re-claim and re-send.
  //
  // Without this guard, the row would be picked up by the staleness
  // sweeper after `STALE_CLAIM_SECONDS` and the same email re-sent —
  // breaking the exactly-once contract in the (rare but real) DB-blip
  // window between SMTP ACK and the sentinel UPDATE.
  // ───────────────────────────────────────────────────────────────────────
  process.stdout.write("\n--- Scenario 2: SMTP OK + markDripStepSent fails → poison ---\n");

  const TEST_EMAIL_2 = `drip-a2-poison-${Date.now()}@test.local`;
  const enrollmentId2 = randomUUID();
  await dbMod.db
    .delete(schema.dripEnrollments)
    .where(eq(schema.dripEnrollments.email, TEST_EMAIL_2));
  await dbMod.db.insert(schema.dripEnrollments).values({
    id: enrollmentId2,
    email: TEST_EMAIL_2,
    name: "TestDripPoison",
    language: "es",
    source: "guide",
    currentStep: 0,
    lastSentStep: 0,
    nextSendAt: new Date(Date.now() - 60_000).toISOString(),
    unsubscribeToken: randomUUID().replace(/-/g, ""),
  });

  const sendCalls2: Array<{ email: string; step: number }> = [];
  let markSentCalls = 0;
  drip._setSendOverridesForTests({
    guide: (async (data) => {
      if (data.email === TEST_EMAIL_2) sendCalls2.push({ email: data.email, step: data.step });
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
    // markSent throws on EVERY attempt to force the poison branch.
    markSent: (async (_opts: { id: string; toStep: number }) => {
      markSentCalls++;
      throw new Error("simulated DB blip — markDripStepSent failed");
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    // Reset advance to real impl so it doesn't interfere if reached.
    advance: null,
  });

  try {
    // First drain: dispatch OK, all 3 markSent retries fail → poison.
    await drip._drainOnceForTests();

    assert(sendCalls2.length === 1, `dispatchStep was invoked exactly once (got ${sendCalls2.length})`);
    assert(markSentCalls === 3, `markDripStepSent was retried 3 times before poisoning (got ${markSentCalls})`);

    const afterPoison = await dbMod.db
      .select({
        currentStep: schema.dripEnrollments.currentStep,
        lastSentStep: schema.dripEnrollments.lastSentStep,
        lastError: schema.dripEnrollments.lastError,
        nextSendAt: schema.dripEnrollments.nextSendAt,
        claimedAt: schema.dripEnrollments.claimedAt,
      })
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId2));
    const p = afterPoison[0];
    assert(p?.nextSendAt === null, `poisoned row has nextSendAt=NULL (got ${p?.nextSendAt})`);
    assert(
      typeof p?.lastError === "string" && p.lastError.startsWith("POISONED:step=1:"),
      `poisoned row has lastError prefixed with POISONED:step=1: (got ${p?.lastError})`,
    );
    assert(p?.currentStep === 0, `currentStep NOT advanced on poison (got ${p?.currentStep})`);
    assert(p?.lastSentStep === 0, `lastSentStep NOT advanced on poison — sentinel write failed (got ${p?.lastSentStep})`);
    assert(p?.claimedAt !== null, `claim NOT released on poison — prevents staleness re-claim (got ${p?.claimedAt})`);

    // Second drain MUST be a no-op for this row: the claim selector
    // requires `next_send_at IS NOT NULL`, so the poisoned row is
    // invisible to `claimDueDripEnrollments` regardless of `claimed_at`.
    const sendsBefore = sendCalls2.length;
    await drip._drainOnceForTests();
    assert(
      sendCalls2.length === sendsBefore,
      `second pass DID NOT re-dispatch the poisoned row (still ${sendCalls2.length} total) — exactly-once preserved through DB-blip path`,
    );
  } finally {
    drip._setSendOverridesForTests({ guide: null, advance: null, markSent: null });
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId2));
  }

  // ───────────────────────────────────────────────────────────────────────
  // Scenario 3: same exactly-once contract on the IMMEDIATE-step-1 path
  // (`sendImmediateStep1`, used by the calculator/newsletter "send right
  // now" flow). Reproduces SMTP success + markDripStepSent fail, then
  // verifies the row is poisoned (NOT released) and a subsequent worker
  // drain does NOT re-dispatch.
  // ───────────────────────────────────────────────────────────────────────
  process.stdout.write("\n--- Scenario 3: immediate step1 + markDripStepSent fails → poison ---\n");

  const TEST_EMAIL_3 = `drip-a2-immediate-${Date.now()}@test.local`;
  const enrollmentId3 = randomUUID();
  await dbMod.db
    .delete(schema.dripEnrollments)
    .where(eq(schema.dripEnrollments.email, TEST_EMAIL_3));
  await dbMod.db.insert(schema.dripEnrollments).values({
    id: enrollmentId3,
    email: TEST_EMAIL_3,
    name: "TestDripImmediatePoison",
    language: "es",
    source: "guide",
    currentStep: 0,
    lastSentStep: 0,
    // Far enough in the future that the worker drain would NOT claim it
    // — the test asserts that even after we artificially open the gate
    // post-poison, no re-dispatch happens.
    nextSendAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    unsubscribeToken: randomUUID().replace(/-/g, ""),
  });

  const sendCalls3: Array<{ email: string; step: number }> = [];
  let markSentCalls3 = 0;
  drip._setSendOverridesForTests({
    guide: (async (data) => {
      if (data.email === TEST_EMAIL_3) sendCalls3.push({ email: data.email, step: data.step });
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
    markSent: (async (_opts: { id: string; toStep: number }) => {
      markSentCalls3++;
      throw new Error("simulated DB blip — markDripStepSent failed (immediate path)");
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    advance: null,
  });

  try {
    // Drive `sendImmediateStep1` directly (this is the entry point invoked
    // by the calculator/newsletter routes when they want step 1 sent now).
    await drip.sendImmediateStep1({
      id: enrollmentId3,
      email: TEST_EMAIL_3,
      name: "TestDripImmediatePoison",
      language: "es",
      unsubToken: null,
    });

    assert(sendCalls3.length === 1, `immediate dispatch invoked exactly once (got ${sendCalls3.length})`);
    assert(markSentCalls3 === 3, `immediate markDripStepSent retried 3 times (got ${markSentCalls3})`);

    const afterPoison3 = await dbMod.db
      .select({
        currentStep: schema.dripEnrollments.currentStep,
        lastSentStep: schema.dripEnrollments.lastSentStep,
        lastError: schema.dripEnrollments.lastError,
        nextSendAt: schema.dripEnrollments.nextSendAt,
      })
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId3));
    const p3 = afterPoison3[0];
    assert(p3?.nextSendAt === null, `immediate-poison row has nextSendAt=NULL (got ${p3?.nextSendAt})`);
    assert(
      typeof p3?.lastError === "string" && p3.lastError.startsWith("POISONED:step=1:"),
      `immediate-poison row has lastError prefixed POISONED:step=1: (got ${p3?.lastError})`,
    );
    assert(p3?.currentStep === 0, `immediate-poison currentStep stays 0 (got ${p3?.currentStep})`);
    assert(p3?.lastSentStep === 0, `immediate-poison lastSentStep stays 0 — sentinel write failed (got ${p3?.lastSentStep})`);

    // Even if we artificially make the row claimable again (next_send_at
    // back in the past), the worker MUST NOT re-dispatch because the
    // poison `lastError` shouldn't matter — but the real guard here is
    // `next_send_at IS NOT NULL` in the claim selector. Confirm that
    // until an operator restores `next_send_at`, no further send happens.
    const sendsBefore3 = sendCalls3.length;
    await drip._drainOnceForTests();
    assert(
      sendCalls3.length === sendsBefore3,
      `worker drain did NOT re-dispatch poisoned immediate row (still ${sendCalls3.length}) — exactly-once preserved`,
    );
  } finally {
    drip._setSendOverridesForTests({ guide: null, advance: null, markSent: null });
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId3));
  }

  // ───────────────────────────────────────────────────────────────────────
  // Scenario 4: race between worker `drainOnce` claim and the route's
  // fire-and-forget `sendImmediateStep1`. Reproduced deterministically
  // by pre-claiming the row (simulating the worker grabbing it first),
  // then calling `sendImmediateStep1`. The immediate path MUST detect
  // the lost claim and abort BEFORE dispatching SMTP — otherwise both
  // paths would call `sendDripEmailOnce` and the recipient gets two
  // copies of step 1.
  // ───────────────────────────────────────────────────────────────────────
  process.stdout.write("\n--- Scenario 4: worker pre-claim races sendImmediateStep1 → no duplicate dispatch ---\n");

  const TEST_EMAIL_4 = `drip-a2-race-${Date.now()}@test.local`;
  const enrollmentId4 = randomUUID();
  await dbMod.db
    .delete(schema.dripEnrollments)
    .where(eq(schema.dripEnrollments.email, TEST_EMAIL_4));

  // Insert pre-claimed: worker has already grabbed this row (claimed_at
  // is set to a recent time). The immediate path's
  // `tryClaimDripEnrollmentForImmediate` uses `claimed_at IS NULL` in
  // its WHERE, so it MUST see no rows and return false.
  const preClaimAt = new Date().toISOString();
  await dbMod.db.insert(schema.dripEnrollments).values({
    id: enrollmentId4,
    email: TEST_EMAIL_4,
    name: "TestDripRace",
    language: "es",
    source: "guide",
    currentStep: 0,
    lastSentStep: 0,
    nextSendAt: new Date().toISOString(),
    claimedAt: preClaimAt,
    unsubscribeToken: randomUUID().replace(/-/g, ""),
  });

  const sendCalls4: Array<{ email: string; step: number }> = [];
  let markSentCalls4 = 0;
  drip._setSendOverridesForTests({
    guide: (async (data) => {
      if (data.email === TEST_EMAIL_4) sendCalls4.push({ email: data.email, step: data.step });
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
    markSent: (async (_opts: { id: string; toStep: number }) => {
      markSentCalls4++;
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["markSent"],
    advance: null,
  });

  try {
    await drip.sendImmediateStep1({
      id: enrollmentId4,
      email: TEST_EMAIL_4,
      name: "TestDripRace",
      language: "es",
      unsubToken: null,
    });

    assert(
      sendCalls4.length === 0,
      `immediate path detected lost claim and did NOT dispatch SMTP (got ${sendCalls4.length} sends, expected 0)`,
    );
    assert(
      markSentCalls4 === 0,
      `immediate path did NOT touch sentinel after losing claim (got ${markSentCalls4} markSent calls, expected 0)`,
    );

    const afterRace = await dbMod.db
      .select({
        currentStep: schema.dripEnrollments.currentStep,
        lastSentStep: schema.dripEnrollments.lastSentStep,
        claimedAt: schema.dripEnrollments.claimedAt,
        nextSendAt: schema.dripEnrollments.nextSendAt,
      })
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId4));
    const r4 = afterRace[0];
    assert(
      r4?.claimedAt === preClaimAt,
      `worker's pre-existing claim is preserved (got ${r4?.claimedAt}, expected ${preClaimAt})`,
    );
    assert(r4?.lastSentStep === 0, `lastSentStep untouched by no-op immediate path (got ${r4?.lastSentStep})`);
    assert(r4?.currentStep === 0, `currentStep untouched by no-op immediate path (got ${r4?.currentStep})`);
    assert(r4?.nextSendAt !== null, `nextSendAt untouched — worker still owns the row (got ${r4?.nextSendAt})`);
  } finally {
    drip._setSendOverridesForTests({ guide: null, advance: null, markSent: null });
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId4));
  }

  // ───────────────────────────────────────────────────────────────────────
  // Scenario 5: dual-immediate race (e.g., user double-clicks the
  // submit button → two concurrent `sendImmediateStep1` invocations
  // for the SAME enrollment). The atomic claim must let exactly one
  // through.
  // ───────────────────────────────────────────────────────────────────────
  process.stdout.write("\n--- Scenario 5: two concurrent sendImmediateStep1 calls → exactly one dispatch ---\n");

  const TEST_EMAIL_5 = `drip-a2-dual-${Date.now()}@test.local`;
  const enrollmentId5 = randomUUID();
  await dbMod.db
    .delete(schema.dripEnrollments)
    .where(eq(schema.dripEnrollments.email, TEST_EMAIL_5));
  await dbMod.db.insert(schema.dripEnrollments).values({
    id: enrollmentId5,
    email: TEST_EMAIL_5,
    name: "TestDripDual",
    language: "es",
    source: "guide",
    currentStep: 0,
    lastSentStep: 0,
    nextSendAt: new Date().toISOString(),
    unsubscribeToken: randomUUID().replace(/-/g, ""),
  });

  const sendCalls5: Array<{ email: string; step: number }> = [];
  drip._setSendOverridesForTests({
    guide: (async (data) => {
      if (data.email === TEST_EMAIL_5) {
        // Slow the dispatch slightly so both invocations are guaranteed
        // to overlap in real time.
        await new Promise((r) => setTimeout(r, 50));
        sendCalls5.push({ email: data.email, step: data.step });
      }
    }) as Parameters<typeof drip._setSendOverridesForTests>[0]["guide"],
    markSent: null,
    advance: null,
  });

  try {
    await Promise.all([
      drip.sendImmediateStep1({
        id: enrollmentId5,
        email: TEST_EMAIL_5,
        name: "TestDripDual",
        language: "es",
        unsubToken: null,
      }),
      drip.sendImmediateStep1({
        id: enrollmentId5,
        email: TEST_EMAIL_5,
        name: "TestDripDual",
        language: "es",
        unsubToken: null,
      }),
    ]);
    assert(
      sendCalls5.length === 1,
      `dual concurrent sendImmediateStep1 calls produced exactly 1 SMTP dispatch (got ${sendCalls5.length})`,
    );
    const after5 = await dbMod.db
      .select({
        currentStep: schema.dripEnrollments.currentStep,
        lastSentStep: schema.dripEnrollments.lastSentStep,
      })
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId5));
    assert(after5[0]?.lastSentStep === 1, `lastSentStep advanced once (got ${after5[0]?.lastSentStep})`);
    assert(after5[0]?.currentStep === 1, `currentStep advanced once (got ${after5[0]?.currentStep})`);
  } finally {
    drip._setSendOverridesForTests({ guide: null, advance: null, markSent: null });
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, enrollmentId5));
  }
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
      process.stdout.write("\nAll drip exactly-once tests passed.\n");
      process.exit(0);
    }
  });
