/**
 * Wrapper that boots the dev server on an ephemeral port, waits until
 * /api/health responds, runs the booking end-to-end test against it,
 * and exits with the test's exit code (after tearing down the server).
 *
 * This is what `npm run test:booking` and the post-merge guard call,
 * so a regression in the book / reschedule / cancel flow blocks the
 * merge (and therefore the deploy) automatically.
 *
 * External calls (Gmail send, Google Calendar) are stubbed by clearing
 * GOOGLE_SERVICE_ACCOUNT_KEY for the spawned server process. With that
 * variable empty, getGmailClient() and getCalendarClient() both return
 * null and the production code paths short-circuit gracefully — the test
 * stays self-contained and idempotent.
 *
 * Requires DATABASE_URL to be set in the environment, exactly like
 * `npm run dev`. Uses PORT=5052 by default to avoid clashing with the
 * dev server on 5000 and the newsletter E2E wrapper on 5051.
 */
import { spawn } from "child_process";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const WORKSPACE = path.resolve(ROOT, "..");
const PORT = process.env.BOOKING_E2E_PORT || "5052";
const BASE_URL = `http://localhost:${PORT}`;
const HEALTH_TIMEOUT_MS = 60_000;
const HEALTH_POLL_MS = 500;

function log(msg: string) {
  console.log(`[run-booking-e2e] ${msg}`);
}

async function waitForHealth(isServerDead: () => { dead: boolean; code: number | null }): Promise<void> {
  const deadline = Date.now() + HEALTH_TIMEOUT_MS;
  let lastErr: unknown = null;
  while (Date.now() < deadline) {
    const status = isServerDead();
    if (status.dead) {
      throw new Error(`server exited before becoming healthy (exit=${status.code})`);
    }
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.status === 200) return;
      lastErr = `status=${res.status}`;
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, HEALTH_POLL_MS));
  }
  throw new Error(
    `Server on ${BASE_URL} did not become healthy within ${HEALTH_TIMEOUT_MS}ms. Last error: ${String(lastErr)}`,
  );
}

function spawnServer() {
  log(`starting server on PORT=${PORT}...`);
  // Strip Google + Discord credentials from the spawned env so the booking
  // flow goes through its "not configured" branches instead of hitting the
  // real Gmail / Calendar / Discord APIs.
  const childEnv: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: "development",
    PORT,
    LOG_LEVEL: process.env.LOG_LEVEL || "warn",
  };
  for (const key of [
    "GOOGLE_SERVICE_ACCOUNT_KEY",
    "GOOGLE_CALENDAR_ID",
    "DISCORD_BOT_TOKEN",
    "DISCORD_CHANNEL_REGISTROS",
    "DISCORD_CHANNEL_CALCULADORA",
    "DISCORD_CHANNEL_ACTIVIDAD",
    "DISCORD_CHANNEL_AGENDA",
    "DISCORD_CHANNEL_CONSENTIMIENTOS",
    "DISCORD_CHANNEL_ERRORES",
    "DISCORD_CHANNEL_AUDITORIA",
  ]) {
    delete childEnv[key];
  }
  const child = spawn(
    process.execPath,
    [
      path.resolve(WORKSPACE, "node_modules/.bin/tsx"),
      path.resolve(ROOT, "server/index.ts"),
    ],
    {
      cwd: WORKSPACE,
      env: childEnv,
      stdio: ["ignore", "inherit", "inherit"],
    },
  );
  return child;
}

function spawnTest() {
  log(`running test against ${BASE_URL}...`);
  return spawn(
    process.execPath,
    [
      path.resolve(WORKSPACE, "node_modules/.bin/tsx"),
      path.resolve(ROOT, "scripts/e2e/test-booking-e2e.ts"),
    ],
    {
      cwd: WORKSPACE,
      env: { ...process.env, BASE_URL },
      stdio: "inherit",
    },
  );
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "[run-booking-e2e] DATABASE_URL is not set. The booking E2E " +
        "needs a Postgres connection to seed and clean its own bookings.",
    );
    process.exit(1);
  }

  const server = spawnServer();
  let serverExited = false;
  let serverExitCode: number | null = null;
  server.on("exit", (code) => {
    serverExited = true;
    serverExitCode = code;
    if (code !== null && code !== 0) {
      log(`server exited early with code ${code}`);
    }
  });

  const shutdown = async () => {
    if (serverExited) return;
    server.kill("SIGTERM");
    await new Promise<void>((resolve) => {
      const t = setTimeout(() => {
        if (!serverExited) server.kill("SIGKILL");
        resolve();
      }, 5_000);
      server.once("exit", () => {
        clearTimeout(t);
        resolve();
      });
    });
  };

  let exitCode = 1;
  try {
    await waitForHealth(() => ({ dead: serverExited, code: serverExitCode }));
    log("server is healthy, launching test...");
    const test = spawnTest();
    exitCode = await new Promise<number>((resolve) => {
      test.on("exit", (code) => resolve(code ?? 1));
    });
  } catch (err) {
    console.error("[run-booking-e2e] failed:", err);
    exitCode = 1;
  } finally {
    await shutdown();
  }
  log(`done (exit=${exitCode})`);
  process.exit(exitCode);
}

main();
