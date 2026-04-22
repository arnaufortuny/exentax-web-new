#!/usr/bin/env tsx
/*
 * indexnow.test.ts
 * ----------------------------------------------------------------------------
 * Unit tests for the IndexNow / Bing key-verification endpoint.
 *
 * Covers (per Task #34):
 *   1. `discoverStaticKeyFiles()` finds `client/public/<key>.txt` even when
 *      `INDEXNOW_KEY` is unset, so Bing can verify host ownership without
 *      depending on runtime env vars.
 *   2. `registerIndexNowRoutes()` serves `/<key>.txt` as `text/plain` with the
 *      key as the body (the only response Bing accepts) — verified through an
 *      in-process Express app.
 *   3. `computeIndexNowConfigWarnings()` flags the two divergence patterns
 *      that silently break submissions (env key != static file; env
 *      `KEY_LOCATION` pointing to an unknown key).
 *
 * Run with `npx tsx exentax-web/server/indexnow.test.ts`. Exits 0 on success,
 * 1 on any failure so it can be wired into CI / pre-deploy later.
 * ----------------------------------------------------------------------------
 */

import express from "express";
import { createServer } from "http";
import { AddressInfo } from "net";

import {
  discoverStaticKeyFiles,
  registerIndexNowRoutes,
  computeIndexNowConfigWarnings,
} from "./indexnow";

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

function record(name: string, ok: boolean, detail?: string): void {
  results.push({ name, ok, detail });
}

async function main(): Promise<void> {
  // 1) Static discovery picks up the shipped key file.
  const discovered = discoverStaticKeyFiles();
  record(
    "discoverStaticKeyFiles finds at least one key in client/public",
    discovered.length >= 1,
    `found=${discovered.map((d) => d.key).join(",") || "(none)"}`,
  );
  for (const { key } of discovered) {
    record(
      `discovered key '${key}' matches IndexNow format`,
      /^[a-zA-Z0-9-]{8,128}$/.test(key),
    );
  }

  // 2) End-to-end: register routes against a real Express app and hit the
  //    endpoint over HTTP. Crucially, we do NOT set INDEXNOW_KEY in env to
  //    prove the static-file path works on its own.
  const previousEnv = process.env.INDEXNOW_KEY;
  delete process.env.INDEXNOW_KEY;
  try {
    const app = express();
    registerIndexNowRoutes(app);
    const server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as AddressInfo).port;

    for (const { key } of discovered) {
      const res = await fetch(`http://127.0.0.1:${port}/${key}.txt`);
      const body = (await res.text()).trim();
      const ct = res.headers.get("content-type") || "";
      record(
        `GET /${key}.txt returns 200`,
        res.status === 200,
        `status=${res.status}`,
      );
      record(
        `GET /${key}.txt body equals key`,
        body === key,
        `body='${body.slice(0, 40)}'`,
      );
      record(
        `GET /${key}.txt is text/plain`,
        ct.startsWith("text/plain"),
        `content-type='${ct}'`,
      );
    }

    await new Promise<void>((resolve) => server.close(() => resolve()));
  } finally {
    if (previousEnv !== undefined) process.env.INDEXNOW_KEY = previousEnv;
  }

  // 3) Divergence warnings.
  const noWarn = computeIndexNowConfigWarnings({
    envKey: "abcd1234abcd1234",
    envKeyLocation: "https://exentax.com/abcd1234abcd1234.txt",
    staticKeys: ["abcd1234abcd1234"],
  });
  record("aligned config produces zero warnings", noWarn.length === 0, noWarn.join(" | "));

  const envMismatch = computeIndexNowConfigWarnings({
    envKey: "envkey0000000000",
    envKeyLocation: null,
    staticKeys: ["staticfile00000000"],
  });
  record(
    "env key != static file produces a warning",
    envMismatch.length === 1 && envMismatch[0].includes("envkey0000000000"),
    envMismatch.join(" | "),
  );

  const locMismatch = computeIndexNowConfigWarnings({
    envKey: "envkey0000000000",
    envKeyLocation: "https://exentax.com/otherkey00000000.txt",
    staticKeys: ["envkey0000000000"],
  });
  record(
    "KEY_LOCATION pointing to unknown key produces a warning",
    locMismatch.some((w) => w.includes("otherkey00000000")),
    locMismatch.join(" | "),
  );

  const malformedLoc = computeIndexNowConfigWarnings({
    envKey: "envkey0000000000",
    envKeyLocation: "https://exentax.com/not-a-key-file",
    staticKeys: ["envkey0000000000"],
  });
  record(
    "malformed KEY_LOCATION URL produces a warning",
    malformedLoc.some((w) => w.includes("does not look like")),
    malformedLoc.join(" | "),
  );

  const onlyStatic = computeIndexNowConfigWarnings({
    envKey: null,
    envKeyLocation: null,
    staticKeys: ["onlystatickey0000"],
  });
  record(
    "no env vars + static-only key is silent",
    onlyStatic.length === 0,
    onlyStatic.join(" | "),
  );

  // ---- summary ----
  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    const tag = r.ok ? "OK  " : "FAIL";
    const detail = r.detail ? ` — ${r.detail}` : "";
    // eslint-disable-next-line no-console
    console.log(`[${tag}] ${r.name}${detail}`);
  }
  // eslint-disable-next-line no-console
  console.log(
    `\n${results.length - failed.length}/${results.length} passed, ${failed.length} failed.`,
  );
  if (failed.length > 0) process.exit(1);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("indexnow.test.ts crashed:", err);
  process.exit(1);
});
