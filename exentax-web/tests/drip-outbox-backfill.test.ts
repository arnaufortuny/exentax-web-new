/**
 * Drip outbox backfill regression — Task #38 boot-time migration (Task #70).
 *
 * Coverage of `backfillOutboxFromEnrollments()` in
 * `server/scheduled/drip-worker.ts`. The function runs once at worker
 * startup and inserts a pending `email_outbox` row for every active
 * `drip_enrollments` row that doesn't already have one. The unique
 * `(enrollment_id, step)` constraint on `email_outbox` makes re-runs
 * a no-op, but that idempotency PLUS the per-enrollment edge cases
 * below were never covered by an automated regression — manual
 * verification at boot was the only assurance, which is fragile across
 * deploys.
 *
 * Edge cases asserted:
 *   1. Active enrollment with `current_step = 0` and no outbox row →
 *      enqueue step 1 with `next_attempt_at = next_send_at`.
 *   2. Active enrollment with `last_sent_step > current_step` (legacy
 *      advance-fail-recovery state) → reconcile by treating
 *      `max(current_step, last_sent_step)` as the just-sent step;
 *      enqueue the NEXT step.
 *   3. Active enrollment with `current_step = total_steps` (already
 *      exhausted) → seal `completed_at`, do NOT enqueue any outbox row.
 *   4. Active enrollment that already has a pending outbox row →
 *      idempotent skip (no second row inserted).
 *   5. `source = "calculator"` produces payload `kind = "calculator"`,
 *      `source = "guide"` produces payload `kind = "guide"`.
 *   6. Re-running the backfill on the same DB state produces zero
 *      additional rows (full idempotency).
 *
 * Run: `npx tsx exentax-web/tests/drip-outbox-backfill.test.ts`
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

interface OutboxRow {
  id: string;
  enrollmentId: string;
  step: number;
  payload: string;
  sentAt: string | null;
  nextAttemptAt: string;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    process.stdout.write("  SKIP no DATABASE_URL — drip outbox backfill test needs Postgres\n");
    return;
  }

  const dbMod = await import("../server/db");
  await dbMod.runColumnMigrations();

  const schema = await import("../shared/schema");
  const { eq, sql, inArray } = await import("drizzle-orm");
  const drip = await import("../server/scheduled/drip-worker");

  const ts = Date.now();
  const { randomUUID } = await import("crypto");

  const createdEnrollmentIds: string[] = [];

  function newEnrollmentId(): string {
    const id = `DRIP_${randomUUID().replace(/-/g, "").slice(0, 28)}`;
    createdEnrollmentIds.push(id);
    return id;
  }

  async function insertEnrollment(opts: {
    label: string;
    source: "guide" | "calculator";
    currentStep: number;
    lastSentStep: number;
    nextSendAt: string | null;
    completedAt?: string | null;
  }): Promise<{ id: string; email: string; unsubToken: string }> {
    const email = `drip-backfill-${opts.label}-${ts}@test.local`;
    // Defensive cleanup on rerun (CASCADE removes outbox rows).
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.email, email));

    const id = newEnrollmentId();
    const unsubToken = randomUUID().replace(/-/g, "");
    await dbMod.db.insert(schema.dripEnrollments).values({
      id,
      email,
      name: "BackfillTest",
      language: "es",
      source: opts.source,
      currentStep: opts.currentStep,
      lastSentStep: opts.lastSentStep,
      nextSendAt: opts.nextSendAt,
      completedAt: opts.completedAt ?? null,
      unsubscribeToken: unsubToken,
    });
    return { id, email, unsubToken };
  }

  async function getOutboxRowsFor(enrollmentId: string): Promise<OutboxRow[]> {
    const r = await dbMod.db.execute(sql`
      SELECT id, enrollment_id AS "enrollmentId", step, payload,
             sent_at AS "sentAt", next_attempt_at AS "nextAttemptAt"
        FROM email_outbox
       WHERE enrollment_id = ${enrollmentId}
       ORDER BY step ASC
    `);
    return (r as unknown as { rows: OutboxRow[] }).rows ?? [];
  }

  async function getEnrollment(id: string) {
    const rows = await dbMod.db
      .select()
      .from(schema.dripEnrollments)
      .where(eq(schema.dripEnrollments.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  // ──────────────────────────────────────────────────────────────────
  // Setup: build one enrollment per edge case, then run backfill once.
  // ──────────────────────────────────────────────────────────────────
  const futureSendAt = new Date(Date.now() + 3 * 24 * 60 * 60_000).toISOString();
  const pastSendAt = new Date(Date.now() - 60_000).toISOString();

  // Case 1 — fresh enrollment, no outbox row, current_step = 0.
  const fresh = await insertEnrollment({
    label: "fresh",
    source: "guide",
    currentStep: 0,
    lastSentStep: 0,
    nextSendAt: futureSendAt,
  });

  // Case 2 — legacy advance-fail-recovery: last_sent_step > current_step.
  // Worker should treat max(current=2, last_sent=3) = 3 as the just-sent
  // step and enqueue step 4.
  const recovery = await insertEnrollment({
    label: "recovery",
    source: "guide",
    currentStep: 2,
    lastSentStep: 3,
    nextSendAt: pastSendAt,
  });

  // Case 3 — already exhausted (current_step = 6 for guide). Should be
  // safety-sealed (completed_at populated) and NOT enqueued.
  const exhausted = await insertEnrollment({
    label: "exhausted",
    source: "guide",
    currentStep: 6,
    lastSentStep: 6,
    nextSendAt: null,
  });

  // Case 4 — already has a pending outbox row. Backfill must skip it.
  const alreadyQueued = await insertEnrollment({
    label: "already-queued",
    source: "guide",
    currentStep: 1,
    lastSentStep: 1,
    nextSendAt: futureSendAt,
  });
  // Pre-seed an outbox row at step 2 so the WHERE NOT EXISTS clause
  // excludes this enrollment.
  const preexistingOutboxId = `OBX_${randomUUID().replace(/-/g, "").slice(0, 28)}`;
  await dbMod.db.execute(sql`
    INSERT INTO email_outbox (id, enrollment_id, step, payload, next_attempt_at)
    VALUES (
      ${preexistingOutboxId},
      ${alreadyQueued.id},
      2,
      ${JSON.stringify({
        kind: "guide",
        email: alreadyQueued.email,
        name: "BackfillTest",
        language: "es",
        step: 2,
        unsubToken: alreadyQueued.unsubToken,
      })},
      ${futureSendAt}
    )
  `);

  // Case 5a — calculator source, current_step = 0 → kind = "calculator".
  const calc = await insertEnrollment({
    label: "calc",
    source: "calculator",
    currentStep: 0,
    lastSentStep: 0,
    nextSendAt: pastSendAt,
  });

  // Case 5b — calculator already exhausted (3 steps for calculator).
  // Should be safety-sealed, NOT enqueued.
  const calcExhausted = await insertEnrollment({
    label: "calc-exhausted",
    source: "calculator",
    currentStep: 3,
    lastSentStep: 3,
    nextSendAt: null,
  });

  // ──────────────────────────────────────────────────────────────────
  // Pass 1: backfill from clean state.
  // ──────────────────────────────────────────────────────────────────
  process.stdout.write("\n--- Pass 1: backfill from legacy state ---\n");
  const pass1Enqueued = await drip.backfillOutboxFromEnrollments();
  // Expected enqueues across our test enrollments: fresh, recovery,
  // calc → 3 inserts. (exhausted/calc-exhausted seal completed_at;
  // already-queued is skipped.) The function may also process
  // unrelated legacy rows already in the DB, so assert >= 3 not == 3.
  assert(
    pass1Enqueued >= 3,
    `pass 1 enqueued at least our 3 test rows (fresh/recovery/calc); got ${pass1Enqueued}`,
  );

  // Case 1 — fresh: step 1 with next_attempt_at = futureSendAt, kind=guide.
  {
    const rows = await getOutboxRowsFor(fresh.id);
    assert(rows.length === 1, `(1) fresh enrollment got exactly one outbox row (got ${rows.length})`);
    assert(rows[0]?.step === 1, `(1) fresh enrollment enqueued step 1 (got ${rows[0]?.step})`);
    assert(
      rows[0]?.nextAttemptAt === futureSendAt,
      `(1) fresh enrollment honours next_send_at as next_attempt_at (got ${rows[0]?.nextAttemptAt})`,
    );
    const payload = rows[0] ? JSON.parse(rows[0].payload) : null;
    assert(payload?.kind === "guide", `(1) fresh payload kind = "guide" (got ${payload?.kind})`);
    assert(payload?.step === 1, `(1) fresh payload.step = 1 (got ${payload?.step})`);
    assert(payload?.email === fresh.email, `(1) fresh payload.email matches enrollment`);
    assert(payload?.unsubToken === fresh.unsubToken, `(1) fresh payload.unsubToken matches enrollment`);
  }

  // Case 2 — recovery: max(current=2, last_sent=3) = 3 → enqueue step 4.
  {
    const rows = await getOutboxRowsFor(recovery.id);
    assert(rows.length === 1, `(2) recovery enrollment got exactly one outbox row (got ${rows.length})`);
    assert(
      rows[0]?.step === 4,
      `(2) recovery reconciles last_sent_step > current_step → enqueues step 4 (got ${rows[0]?.step})`,
    );
    assert(
      rows[0]?.nextAttemptAt === pastSendAt,
      `(2) recovery honours next_send_at (got ${rows[0]?.nextAttemptAt})`,
    );
    const payload = rows[0] ? JSON.parse(rows[0].payload) : null;
    assert(payload?.step === 4, `(2) recovery payload.step = 4 (got ${payload?.step})`);
  }

  // Case 3 — exhausted: no outbox row, completed_at sealed.
  {
    const rows = await getOutboxRowsFor(exhausted.id);
    assert(rows.length === 0, `(3) exhausted enrollment got NO outbox row (got ${rows.length})`);
    const enrollment = await getEnrollment(exhausted.id);
    assert(
      enrollment?.completedAt !== null && enrollment?.completedAt !== undefined,
      `(3) exhausted enrollment has completed_at sealed (got ${enrollment?.completedAt})`,
    );
  }

  // Case 4 — already queued: still exactly one outbox row (the one we
  // pre-seeded), and it's the one we inserted.
  {
    const rows = await getOutboxRowsFor(alreadyQueued.id);
    assert(rows.length === 1, `(4) already-queued enrollment still has exactly one outbox row (got ${rows.length})`);
    assert(
      rows[0]?.id === preexistingOutboxId,
      `(4) already-queued row is the pre-seeded one (no duplicate insert; got ${rows[0]?.id})`,
    );
    assert(rows[0]?.step === 2, `(4) already-queued row's step is unchanged (got ${rows[0]?.step})`);
  }

  // Case 5a — calculator: kind=calculator, step 1.
  {
    const rows = await getOutboxRowsFor(calc.id);
    assert(rows.length === 1, `(5a) calculator enrollment got exactly one outbox row (got ${rows.length})`);
    assert(rows[0]?.step === 1, `(5a) calculator enqueued step 1 (got ${rows[0]?.step})`);
    const payload = rows[0] ? JSON.parse(rows[0].payload) : null;
    assert(payload?.kind === "calculator", `(5a) calculator payload kind = "calculator" (got ${payload?.kind})`);
  }

  // Case 5b — calculator exhausted (3 steps): no outbox, completed_at sealed.
  {
    const rows = await getOutboxRowsFor(calcExhausted.id);
    assert(rows.length === 0, `(5b) calculator-exhausted got NO outbox row (got ${rows.length})`);
    const enrollment = await getEnrollment(calcExhausted.id);
    assert(
      enrollment?.completedAt !== null && enrollment?.completedAt !== undefined,
      `(5b) calculator-exhausted has completed_at sealed (got ${enrollment?.completedAt})`,
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // Pass 2: re-run on the same state — must be a no-op (idempotent).
  // ──────────────────────────────────────────────────────────────────
  process.stdout.write("\n--- Pass 2: re-run for idempotency ---\n");

  // Snapshot current outbox row counts for our test enrollments.
  async function countTestOutboxRows(): Promise<number> {
    const r = await dbMod.db
      .select({ id: schema.emailOutbox.id })
      .from(schema.emailOutbox)
      .where(inArray(schema.emailOutbox.enrollmentId, createdEnrollmentIds));
    return r.length;
  }
  const beforeCount = await countTestOutboxRows();

  const pass2Enqueued = await drip.backfillOutboxFromEnrollments();

  const afterCount = await countTestOutboxRows();

  assert(
    afterCount === beforeCount,
    `(idempotent) row count for our test enrollments unchanged across pass 2 (before=${beforeCount}, after=${afterCount})`,
  );
  // Pass 2 may still touch unrelated legacy rows on a populated DB, but
  // for OUR test enrollments specifically the count must not grow.
  // The function's return value is the global enqueue count — we can't
  // assert == 0 unconditionally, but we can assert it's not > pass1.
  assert(
    pass2Enqueued <= pass1Enqueued,
    `(idempotent) pass 2 enqueued ≤ pass 1 (got pass1=${pass1Enqueued}, pass2=${pass2Enqueued})`,
  );

  // Per-enrollment double-check: each test enrollment still has the
  // exact same outbox shape it had after pass 1.
  {
    const rows = await getOutboxRowsFor(fresh.id);
    assert(rows.length === 1, `(idempotent.1) fresh still has 1 row (got ${rows.length})`);
  }
  {
    const rows = await getOutboxRowsFor(recovery.id);
    assert(rows.length === 1 && rows[0]?.step === 4, `(idempotent.2) recovery still has step 4 only`);
  }
  {
    const rows = await getOutboxRowsFor(exhausted.id);
    assert(rows.length === 0, `(idempotent.3) exhausted still has 0 rows`);
  }
  {
    const rows = await getOutboxRowsFor(alreadyQueued.id);
    assert(rows.length === 1 && rows[0]?.id === preexistingOutboxId, `(idempotent.4) already-queued row unchanged`);
  }
  {
    const rows = await getOutboxRowsFor(calc.id);
    assert(rows.length === 1 && rows[0]?.step === 1, `(idempotent.5a) calculator still has 1 row at step 1`);
  }
  {
    const rows = await getOutboxRowsFor(calcExhausted.id);
    assert(rows.length === 0, `(idempotent.5b) calculator-exhausted still has 0 rows`);
  }

  // ──────────────────────────────────────────────────────────────────
  // Cleanup: delete every test enrollment (CASCADE removes outbox rows).
  // ──────────────────────────────────────────────────────────────────
  if (createdEnrollmentIds.length > 0) {
    await dbMod.db
      .delete(schema.dripEnrollments)
      .where(inArray(schema.dripEnrollments.id, createdEnrollmentIds));
  }

  process.stdout.write("\n");
  if (failures.length > 0) {
    process.stdout.write(`drip outbox backfill test FAILED (${failures.length} assertions)\n`);
    process.exit(1);
  }
  process.stdout.write("drip outbox backfill test PASSED\n");
}

main().catch((err) => {
  process.stdout.write(`\nFATAL ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
