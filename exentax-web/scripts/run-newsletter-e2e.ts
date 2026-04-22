/**
 * Wrapper that boots the dev server on an ephemeral port, waits until
 * /api/health responds, runs the newsletter end-to-end test against it,
 * and exits with the test's exit code (after tearing down the server).
 *
 * This is what `npm run test:newsletter` and the post-merge guard call,
 * so a regression in the subscribe / unsubscribe flow blocks the merge
 * (and therefore the deploy) automatically.
 *
 * Requires DATABASE_URL to be set in the environment, exactly like
 * `npm run dev`. Uses PORT=5051 by default to avoid clashing with a
 * locally running dev server on 5000.
 */
import { spawn } from "child_process";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const PORT = process.env.NEWSLETTER_E2E_PORT || "5051";
const BASE_URL = `http://localhost:${PORT}`;
const HEALTH_TIMEOUT_MS = 60_000;
const HEALTH_POLL_MS = 500;

function log(msg: string) {
  console.log(`[run-newsletter-e2e] ${msg}`);
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
  const child = spawn(
    process.execPath,
    [
      path.resolve(WORKSPACE, "node_modules/.bin/tsx"),
      path.resolve(ROOT, "server/index.ts"),
    ],
    {
      cwd: WORKSPACE,
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT,
        // Keep the server quiet enough that the test output stays readable.
        LOG_LEVEL: process.env.LOG_LEVEL || "warn",
      },
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
      path.resolve(ROOT, "scripts/test-newsletter-e2e.ts"),
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
      "[run-newsletter-e2e] DATABASE_URL is not set. The newsletter E2E " +
        "needs a Postgres connection to seed and clean its own subscribers.",
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
    console.error("[run-newsletter-e2e] failed:", err);
    exitCode = 1;
  } finally {
    await shutdown();
  }
  log(`done (exit=${exitCode})`);
  process.exit(exitCode);
}

main();
