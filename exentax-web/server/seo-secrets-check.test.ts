#!/usr/bin/env tsx
/*
 * seo-secrets-check.test.ts
 * ----------------------------------------------------------------------------
 * Unit tests for the boot-time SEO indexing-secrets audit.
 *
 *   1. Pure detection: `findMissingSeoSecrets` flags every absent /
 *      blank / "wrong-value" secret (notably GOOGLE_INDEXING_API_ENABLE
 *      which only counts as present when set to literal "1").
 *   2. Production + missing secret → exactly one warning + one Discord
 *      notification, with a stable dedupKey and the missing names listed.
 *   3. Production + all secrets present → no warning, no notification,
 *      and a debug line confirming the all-clear.
 *   4. Development + missing secret → debug only, never warns, never
 *      touches Discord. Mirrors the existing branding env audit policy.
 *
 * Run with `npx tsx exentax-web/server/seo-secrets-check.test.ts`.
 * Exits 0 on success, 1 on any failure so it can be wired into CI later.
 * ----------------------------------------------------------------------------
 */

import {
  SEO_SECRET_SPECS,
  checkSeoSecretsAtBoot,
  findMissingSeoSecrets,
  type SeoSecretsCheckLogger,
  type SeoSecretsCheckNotifier,
} from "./seo-secrets-check";

type LogLine = { level: "warn" | "debug"; message: string; source?: string };
type NotifyCall = Parameters<SeoSecretsCheckNotifier>[0];

interface Result { name: string; ok: boolean; detail?: string }
const results: Result[] = [];

function record(name: string, ok: boolean, detail?: string): void {
  results.push({ name, ok, detail });
}

function makeRecorder(): {
  logger: SeoSecretsCheckLogger;
  notify: SeoSecretsCheckNotifier;
  logs: LogLine[];
  notifications: NotifyCall[];
} {
  const logs: LogLine[] = [];
  const notifications: NotifyCall[] = [];
  return {
    logger: {
      warn: (message, source) => logs.push({ level: "warn", message, source }),
      debug: (message, source) => logs.push({ level: "debug", message, source }),
    },
    notify: (opts) => notifications.push(opts),
    logs,
    notifications,
  };
}

function main(): void {
  // Sanity: spec list is the four secrets named in the task definition.
  {
    const names = SEO_SECRET_SPECS.map((s) => s.name).sort();
    const expected = [
      "GOOGLE_INDEXING_API_ENABLE",
      "GOOGLE_SC_SITE_URL",
      "GOOGLE_SERVICE_ACCOUNT_KEY",
      "INDEXNOW_KEY",
    ];
    record(
      "spec list covers exactly the four SEO indexing secrets",
      JSON.stringify(names) === JSON.stringify(expected),
      `names=${names.join(",")}`,
    );
  }

  // ── Test 1: pure detection ──────────────────────────────────────────────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "",                     // blank → missing
      GOOGLE_SERVICE_ACCOUNT_KEY: undefined, // unset → missing
      GOOGLE_SC_SITE_URL: "  ",              // whitespace → missing
      GOOGLE_INDEXING_API_ENABLE: "0",       // "0" is a deliberate disable but
                                             // still counts as "missing" so the
                                             // operator gets a clear signal
    };
    const missing = findMissingSeoSecrets(env).map((s) => s.name);
    record(
      "blank / undefined / whitespace / '0' all detected as missing",
      JSON.stringify(missing) === JSON.stringify([
        "INDEXNOW_KEY",
        "GOOGLE_SERVICE_ACCOUNT_KEY",
        "GOOGLE_SC_SITE_URL",
        "GOOGLE_INDEXING_API_ENABLE",
      ]),
      `missing=${missing.join(",")}`,
    );
  }

  // ── Test 2: GOOGLE_INDEXING_API_ENABLE only counts as present at "1" ───
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "abcdef1234567890",
      GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"x@y"}',
      GOOGLE_SC_SITE_URL: "https://exentax.com/",
      GOOGLE_INDEXING_API_ENABLE: "true",   // not "1" → missing
    };
    const missing = findMissingSeoSecrets(env).map((s) => s.name);
    record(
      "GOOGLE_INDEXING_API_ENABLE='true' counted as missing (must be exact '1')",
      missing.length === 1 && missing[0] === "GOOGLE_INDEXING_API_ENABLE",
      `missing=${missing.join(",")}`,
    );
  }

  // ── Test 3: production + missing secret → exactly one notification ─────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "valid-key-123",
      GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"x@y"}',
      // GOOGLE_SC_SITE_URL absent
      GOOGLE_INDEXING_API_ENABLE: "1",
    };
    const r = makeRecorder();
    const out = checkSeoSecretsAtBoot({
      env,
      isProd: true,
      logger: r.logger,
      notify: r.notify,
    });

    const warnLines = r.logs.filter((l) => l.level === "warn");
    const debugLines = r.logs.filter((l) => l.level === "debug");

    record(
      "prod + missing: exactly one warn line emitted",
      warnLines.length === 1,
      `warns=${warnLines.length}`,
    );
    record(
      "prod + missing: warn line follows '[seo] missing secret(s): ...' format",
      warnLines.length === 1 &&
        warnLines[0].message === "[seo] missing secret(s): GOOGLE_SC_SITE_URL" &&
        warnLines[0].source === "seo",
      `msg=${warnLines[0]?.message}`,
    );
    record(
      "prod + missing: no debug noise alongside the warn",
      debugLines.length === 0,
      `debug=${debugLines.length}`,
    );
    record(
      "prod + missing: exactly one Discord notification fired",
      r.notifications.length === 1,
      `notifications=${r.notifications.length}`,
    );
    record(
      "prod + missing: notification carries source/status/dedupKey/fields",
      r.notifications.length === 1 &&
        r.notifications[0].source === "seo-secrets-check" &&
        r.notifications[0].status === "skipped" &&
        r.notifications[0].dedupKey === "seo-secrets-check:missing:GOOGLE_SC_SITE_URL" &&
        Array.isArray(r.notifications[0].fields) &&
        r.notifications[0].fields!.length === 1 &&
        r.notifications[0].fields![0].name === "GOOGLE_SC_SITE_URL",
      `notif=${JSON.stringify(r.notifications[0])}`,
    );
    record(
      "prod + missing: returned result mirrors the side effects",
      out.missing.length === 1 &&
        out.missing[0] === "GOOGLE_SC_SITE_URL" &&
        out.notified === true,
      `out=${JSON.stringify(out)}`,
    );
  }

  // ── Test 4: production + all present → silence + 1 debug confirmation ──
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "valid-key-123",
      GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"x@y"}',
      GOOGLE_SC_SITE_URL: "https://exentax.com/",
      GOOGLE_INDEXING_API_ENABLE: "1",
    };
    const r = makeRecorder();
    const out = checkSeoSecretsAtBoot({
      env,
      isProd: true,
      logger: r.logger,
      notify: r.notify,
    });
    record(
      "prod + all present: no warn, no notification, only a debug line",
      r.logs.filter((l) => l.level === "warn").length === 0 &&
        r.notifications.length === 0 &&
        r.logs.filter((l) => l.level === "debug").length === 1 &&
        out.missing.length === 0 &&
        out.notified === false,
      `logs=${JSON.stringify(r.logs)} notifs=${r.notifications.length}`,
    );
  }

  // ── Test 5: development + missing → debug only, no warn, no Discord ────
  {
    const env: Record<string, string | undefined> = {}; // everything missing
    const r = makeRecorder();
    const out = checkSeoSecretsAtBoot({
      env,
      isProd: false,
      logger: r.logger,
      notify: r.notify,
    });
    const warnLines = r.logs.filter((l) => l.level === "warn");
    const debugLines = r.logs.filter((l) => l.level === "debug");
    record(
      "dev + missing: zero warn lines, zero notifications",
      warnLines.length === 0 && r.notifications.length === 0,
      `warns=${warnLines.length} notifs=${r.notifications.length}`,
    );
    record(
      "dev + missing: a single debug line records the gap",
      debugLines.length === 1 &&
        debugLines[0].message.startsWith("[seo] missing secret(s):") &&
        debugLines[0].message.includes("dev — not notifying Discord"),
      `debug=${debugLines[0]?.message}`,
    );
    record(
      "dev + missing: returned result still lists the four secrets",
      out.missing.length === 4 && out.notified === false,
      `out=${JSON.stringify(out)}`,
    );
  }

  // ── Test 6: dedupKey is stable across re-invocations with same gap ─────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "valid",
      GOOGLE_SERVICE_ACCOUNT_KEY: undefined,
      GOOGLE_SC_SITE_URL: undefined,
      GOOGLE_INDEXING_API_ENABLE: "1",
    };
    const r = makeRecorder();
    checkSeoSecretsAtBoot({ env, isProd: true, logger: r.logger, notify: r.notify });
    checkSeoSecretsAtBoot({ env, isProd: true, logger: r.logger, notify: r.notify });
    record(
      "stable dedupKey across re-invocations with the same missing set",
      r.notifications.length === 2 &&
        r.notifications[0].dedupKey === r.notifications[1].dedupKey &&
        r.notifications[0].dedupKey ===
          "seo-secrets-check:missing:GOOGLE_SERVICE_ACCOUNT_KEY,GOOGLE_SC_SITE_URL",
      `keys=${r.notifications.map((n) => n.dedupKey).join(" | ")}`,
    );
  }

  // ── Report ─────────────────────────────────────────────────────────────
  let failed = 0;
  for (const r of results) {
    const tag = r.ok ? "PASS" : "FAIL";
    const detail = r.detail ? `  [${r.detail}]` : "";
    console.log(`${tag} ${r.name}${detail}`);
    if (!r.ok) failed++;
  }
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
