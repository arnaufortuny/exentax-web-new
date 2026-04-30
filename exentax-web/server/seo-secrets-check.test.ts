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
 *   5. Pure detection of INVALID FORMAT: each per-secret format failure
 *      (whitespace, regex break, JSON corruption, wrong URL prefix) is
 *      detected by `findInvalidSeoSecrets` with a concrete reason.
 *   6. Production + invalid format → a `[seo] invalid secret(s): X, Y`
 *      warning AND one Discord notification with one field per invalid
 *      secret carrying its specific reason.
 *   7. Development + invalid format → debug only, no Discord.
 *   8. Production + missing AND invalid simultaneously → both events fire
 *      independently, each with its own mode-specific dedupKey.
 *
 * Run with `npx tsx exentax-web/server/seo-secrets-check.test.ts`.
 * Exits 0 on success, 1 on any failure so it can be wired into CI later.
 * ----------------------------------------------------------------------------
 */

import {
  SEO_SECRET_SPECS,
  checkSeoSecretsAtBoot,
  findInvalidSeoSecrets,
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
        out.invalid.length === 0 &&
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
        out.invalid.length === 0 &&
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
      out.missing.length === 4 && out.invalid.length === 0 && out.notified === false,
      `out=${JSON.stringify(out)}`,
    );
  }

  // ── Test 6: dedupKey is stable across re-invocations with same gap ─────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "valid-key-123",
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

  // ── Test 7: pure detection of INVALID FORMATS (one per secret) ─────────
  // Each entry covers a distinct foot-gun the task description called out:
  //   - INDEXNOW_KEY: surrounding whitespace + too-short / wrong charset
  //   - GOOGLE_SC_SITE_URL: missing trailing slash, wrong scheme, malformed
  //                         sc-domain, bare hostname
  //   - GOOGLE_SERVICE_ACCOUNT_KEY: corrupt JSON + JSON without client_email
  {
    const cases: Array<{
      label: string;
      env: Record<string, string | undefined>;
      expectName: string;
      reasonContains: string;
    }> = [
      {
        label: "INDEXNOW_KEY with surrounding whitespace",
        env: { INDEXNOW_KEY: "  valid-key-123  " },
        expectName: "INDEXNOW_KEY",
        reasonContains: "whitespace",
      },
      {
        label: "INDEXNOW_KEY too short (< 8 chars)",
        env: { INDEXNOW_KEY: "abc" },
        expectName: "INDEXNOW_KEY",
        reasonContains: "8–128 characters",
      },
      {
        label: "INDEXNOW_KEY contains forbidden characters",
        env: { INDEXNOW_KEY: "valid_key_with_underscores!!" },
        expectName: "INDEXNOW_KEY",
        reasonContains: "[a-zA-Z0-9-]",
      },
      {
        label: "GOOGLE_SC_SITE_URL https without trailing slash",
        env: { GOOGLE_SC_SITE_URL: "https://exentax.com" },
        expectName: "GOOGLE_SC_SITE_URL",
        reasonContains: "trailing slash",
      },
      {
        label: "GOOGLE_SC_SITE_URL plain hostname (no scheme, no sc-domain:)",
        env: { GOOGLE_SC_SITE_URL: "exentax.com" },
        expectName: "GOOGLE_SC_SITE_URL",
        reasonContains: "sc-domain",
      },
      {
        label: "GOOGLE_SC_SITE_URL http (wrong scheme)",
        env: { GOOGLE_SC_SITE_URL: "http://exentax.com/" },
        expectName: "GOOGLE_SC_SITE_URL",
        reasonContains: "https://",
      },
      {
        label: "GOOGLE_SC_SITE_URL sc-domain: with no domain",
        env: { GOOGLE_SC_SITE_URL: "sc-domain:" },
        expectName: "GOOGLE_SC_SITE_URL",
        reasonContains: "no domain",
      },
      {
        label: "GOOGLE_SC_SITE_URL with surrounding whitespace",
        env: { GOOGLE_SC_SITE_URL: " https://exentax.com/ " },
        expectName: "GOOGLE_SC_SITE_URL",
        reasonContains: "whitespace",
      },
      {
        label: "GOOGLE_SERVICE_ACCOUNT_KEY corrupt JSON",
        env: { GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"x@y"' /* truncated */ },
        expectName: "GOOGLE_SERVICE_ACCOUNT_KEY",
        reasonContains: "not valid JSON",
      },
      {
        label: "GOOGLE_SERVICE_ACCOUNT_KEY JSON missing client_email",
        env: { GOOGLE_SERVICE_ACCOUNT_KEY: '{"private_key":"x"}' },
        expectName: "GOOGLE_SERVICE_ACCOUNT_KEY",
        reasonContains: "client_email",
      },
      {
        label: "GOOGLE_SERVICE_ACCOUNT_KEY JSON with empty client_email",
        env: { GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"   "}' },
        expectName: "GOOGLE_SERVICE_ACCOUNT_KEY",
        reasonContains: "client_email",
      },
      {
        label: "GOOGLE_SERVICE_ACCOUNT_KEY JSON array (not an object)",
        env: { GOOGLE_SERVICE_ACCOUNT_KEY: '["client_email","x@y"]' },
        expectName: "GOOGLE_SERVICE_ACCOUNT_KEY",
        reasonContains: "object",
      },
    ];
    for (const c of cases) {
      const invalid = findInvalidSeoSecrets(c.env);
      const hit = invalid.find((i) => i.spec.name === c.expectName);
      record(
        `invalid format detected: ${c.label}`,
        invalid.length === 1 &&
          !!hit &&
          hit.reason.toLowerCase().includes(c.reasonContains.toLowerCase()),
        `invalid=${JSON.stringify(invalid.map((i) => ({ n: i.spec.name, r: i.reason })))}`,
      );
    }
  }

  // ── Test 8: well-formed values pass cleanly (no false positives) ───────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "abcdef1234567890ABCDEF-zzz",
      GOOGLE_SERVICE_ACCOUNT_KEY:
        '{"client_email":"svc@project.iam.gserviceaccount.com","private_key":"-----BEGIN..."}',
      GOOGLE_SC_SITE_URL: "https://exentax.com/",
      GOOGLE_INDEXING_API_ENABLE: "1",
    };
    const invalid = findInvalidSeoSecrets(env);
    record(
      "well-formed URL property values produce no invalid entries",
      invalid.length === 0,
      `invalid=${JSON.stringify(invalid)}`,
    );
  }
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "abcdef1234567890",
      GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"x@y"}',
      GOOGLE_SC_SITE_URL: "sc-domain:exentax.com",
      GOOGLE_INDEXING_API_ENABLE: "1",
    };
    const invalid = findInvalidSeoSecrets(env);
    record(
      "well-formed sc-domain: property value produces no invalid entries",
      invalid.length === 0,
      `invalid=${JSON.stringify(invalid)}`,
    );
  }

  // ── Test 9: missing values are NEVER reported as invalid ───────────────
  {
    const env: Record<string, string | undefined> = {}; // all absent
    const invalid = findInvalidSeoSecrets(env);
    record(
      "absent secrets do not surface in the invalid list (missing branch owns them)",
      invalid.length === 0,
      `invalid=${JSON.stringify(invalid.map((i) => i.spec.name))}`,
    );
  }

  // ── Test 10: prod + invalid format → warning + Discord notification ────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "  valid-key-123  ",          // whitespace
      GOOGLE_SERVICE_ACCOUNT_KEY: '{"private_key":"x"}', // missing client_email
      GOOGLE_SC_SITE_URL: "https://exentax.com",  // no trailing slash
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
      "prod + invalid: exactly one warn line, '[seo] invalid secret(s): ...' format",
      warnLines.length === 1 &&
        warnLines[0].message ===
          "[seo] invalid secret(s): INDEXNOW_KEY, GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_SC_SITE_URL" &&
        warnLines[0].source === "seo",
      `msg=${warnLines[0]?.message}`,
    );
    record(
      "prod + invalid: no missing-warn, no debug noise",
      debugLines.length === 0 &&
        !warnLines.some((l) => l.message.includes("missing secret")),
      `warns=${warnLines.length} debug=${debugLines.length}`,
    );
    record(
      "prod + invalid: exactly one Discord notification fired",
      r.notifications.length === 1,
      `notifications=${r.notifications.length}`,
    );
    const n = r.notifications[0];
    record(
      "prod + invalid: notification has invalid-mode dedupKey + per-secret reasons",
      !!n &&
        n.source === "seo-secrets-check" &&
        n.status === "skipped" &&
        n.dedupKey ===
          "seo-secrets-check:invalid:INDEXNOW_KEY,GOOGLE_SERVICE_ACCOUNT_KEY,GOOGLE_SC_SITE_URL" &&
        Array.isArray(n.fields) &&
        n.fields!.length === 3 &&
        n.fields![0].name === "INDEXNOW_KEY" &&
        n.fields![0].value.toLowerCase().includes("whitespace") &&
        n.fields![1].name === "GOOGLE_SERVICE_ACCOUNT_KEY" &&
        n.fields![1].value.toLowerCase().includes("client_email") &&
        n.fields![2].name === "GOOGLE_SC_SITE_URL" &&
        n.fields![2].value.toLowerCase().includes("trailing slash"),
      `notif=${JSON.stringify(n)}`,
    );
    record(
      "prod + invalid: returned result lists the three invalid secrets with reasons",
      out.missing.length === 0 &&
        out.invalid.length === 3 &&
        out.invalid.map((i) => i.name).join(",") ===
          "INDEXNOW_KEY,GOOGLE_SERVICE_ACCOUNT_KEY,GOOGLE_SC_SITE_URL" &&
        out.invalid.every((i) => i.reason.length > 0) &&
        out.notified === true,
      `out=${JSON.stringify(out)}`,
    );
  }

  // ── Test 11: dev + invalid → debug only, no warn, no Discord ───────────
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "abc", // too short
      GOOGLE_SERVICE_ACCOUNT_KEY: '{"client_email":"x@y"}',
      GOOGLE_SC_SITE_URL: "https://exentax.com/",
      GOOGLE_INDEXING_API_ENABLE: "1",
    };
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
      "dev + invalid: zero warn lines, zero notifications",
      warnLines.length === 0 && r.notifications.length === 0,
      `warns=${warnLines.length} notifs=${r.notifications.length}`,
    );
    record(
      "dev + invalid: a single debug line records the bad format",
      debugLines.length === 1 &&
        debugLines[0].message.startsWith("[seo] invalid secret(s):") &&
        debugLines[0].message.includes("INDEXNOW_KEY") &&
        debugLines[0].message.includes("dev — not notifying Discord"),
      `debug=${debugLines[0]?.message}`,
    );
    record(
      "dev + invalid: returned result reports invalid but not notified",
      out.invalid.length === 1 &&
        out.invalid[0].name === "INDEXNOW_KEY" &&
        out.notified === false,
      `out=${JSON.stringify(out)}`,
    );
  }

  // ── Test 12: prod + missing AND invalid simultaneously ─────────────────
  // Both events fire independently with their own warn line + Discord
  // notification + mode-specific dedupKey (so they do not coalesce).
  {
    const env: Record<string, string | undefined> = {
      INDEXNOW_KEY: "abc", // present-but-invalid (too short)
      // GOOGLE_SERVICE_ACCOUNT_KEY absent → missing
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
    const warnLines = r.logs.filter((l) => l.level === "warn");
    record(
      "prod + missing+invalid: two warn lines (one per failure mode)",
      warnLines.length === 2 &&
        warnLines[0].message === "[seo] missing secret(s): GOOGLE_SERVICE_ACCOUNT_KEY" &&
        warnLines[1].message === "[seo] invalid secret(s): INDEXNOW_KEY",
      `msgs=${warnLines.map((l) => l.message).join(" | ")}`,
    );
    record(
      "prod + missing+invalid: two notifications with distinct mode-specific dedupKeys",
      r.notifications.length === 2 &&
        r.notifications[0].dedupKey ===
          "seo-secrets-check:missing:GOOGLE_SERVICE_ACCOUNT_KEY" &&
        r.notifications[1].dedupKey ===
          "seo-secrets-check:invalid:INDEXNOW_KEY",
      `keys=${r.notifications.map((n) => n.dedupKey).join(" | ")}`,
    );
    record(
      "prod + missing+invalid: result reports both arrays + notified=true",
      out.missing.length === 1 &&
        out.missing[0] === "GOOGLE_SERVICE_ACCOUNT_KEY" &&
        out.invalid.length === 1 &&
        out.invalid[0].name === "INDEXNOW_KEY" &&
        out.notified === true,
      `out=${JSON.stringify(out)}`,
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
