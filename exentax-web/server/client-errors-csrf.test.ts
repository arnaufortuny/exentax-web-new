#!/usr/bin/env tsx
/*
 * client-errors-csrf.test.ts
 * ----------------------------------------------------------------------------
 * Regression test for SECURITY-FIELDS-AUDIT.md F1.
 *
 * `registerObservabilityRoutes()` is mounted in `server/index.ts` BEFORE
 * `registerRoutes()`, where the global CSRF middleware lives. So the global
 * middleware never fires for `/api/client-errors`, and the handler must
 * apply `checkCsrfOrigin()` itself.
 *
 * This test re-creates that mount order in isolation and asserts:
 *   1. POST /api/client-errors with NO Origin -> 403 FORBIDDEN
 *   2. POST /api/client-errors with a SPOOFED Origin -> 403 FORBIDDEN
 *   3. POST /api/client-errors with a same-origin host header -> 200 OK
 *
 * If a future refactor removes the in-handler CSRF check OR the mount
 * order changes such that the global middleware would also fire, this
 * test still asserts the same external contract: error sink rejects
 * cross-origin POSTs.
 *
 * Run: `npx tsx exentax-web/server/client-errors-csrf.test.ts`
 * Exits 0 on success, 1 on any failure.
 * ----------------------------------------------------------------------------
 */

import express from "express";
import { createServer } from "http";
import type { AddressInfo } from "net";

import { registerObservabilityRoutes } from "./routes/observability";

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

function record(name: string, ok: boolean, detail?: string): void {
  results.push({ name, ok, detail });
}

async function main(): Promise<void> {
  const app = express();
  app.use(express.json());
  registerObservabilityRoutes(app, () => true);

  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address() as AddressInfo;
  const port = addr.port;
  const base = `http://127.0.0.1:${port}`;

  const previousAllowed = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = `http://127.0.0.1:${port}`;

  try {
    // 1. No Origin header
    {
      const res = await fetch(`${base}/api/client-errors`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "regression-no-origin" }),
      });
      const body = await res.json().catch(() => ({}));
      record(
        "POST /api/client-errors with no Origin -> 403",
        res.status === 403 && body?.code === "FORBIDDEN",
        `status=${res.status} body=${JSON.stringify(body)}`,
      );
    }

    // 2. Spoofed Origin
    {
      const res = await fetch(`${base}/api/client-errors`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://evil.example.com",
        },
        body: JSON.stringify({ message: "regression-spoofed-origin" }),
      });
      const body = await res.json().catch(() => ({}));
      record(
        "POST /api/client-errors with spoofed Origin -> 403",
        res.status === 403 && body?.code === "FORBIDDEN",
        `status=${res.status} body=${JSON.stringify(body)}`,
      );
    }

    // 3. Same-origin (allowed) Origin
    {
      const res = await fetch(`${base}/api/client-errors`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: `http://127.0.0.1:${port}`,
        },
        body: JSON.stringify({ message: "regression-same-origin" }),
      });
      const body = await res.json().catch(() => ({}));
      record(
        "POST /api/client-errors with allowed Origin -> 200 ok",
        res.status === 200 && body?.ok === true,
        `status=${res.status} body=${JSON.stringify(body)}`,
      );
    }
  } finally {
    if (previousAllowed === undefined) {
      delete process.env.ALLOWED_ORIGINS;
    } else {
      process.env.ALLOWED_ORIGINS = previousAllowed;
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  let pass = 0;
  let fail = 0;
  for (const r of results) {
    if (r.ok) {
      pass++;
      console.log(`[OK  ] ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
    } else {
      fail++;
      console.log(`[FAIL] ${r.name} — ${r.detail || "(no detail)"}`);
    }
  }
  console.log(`\n${pass}/${results.length} passed, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("test crashed:", err);
  process.exit(1);
});
