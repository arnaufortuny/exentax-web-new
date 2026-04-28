#!/usr/bin/env node
/*
 * blog-cta-position-check
 * ----------------------------------------------------------------------------
 * Thin CI wrapper around `blog-cta-position-audit.mjs --check`. Lives as a
 * separate file so the npm script alias (`lint:blog`) and the architect
 * convention can address it directly. Exit code mirrors the audit:
 *   0 → clean
 *   1 → at least one violation (positional or structural)
 *
 * The reason the audit + check live in two files instead of being one
 * executable: the audit is the authoritative analysis (also writes the
 * JSON/MD report when run without `--check`), while the check is the
 * pure CI gate. Keeping them separate means CI never accidentally writes
 * to disk and the reports never depend on a flag.
 */
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIT = resolve(__dirname, "blog-cta-position-audit.mjs");

const result = spawnSync(process.execPath, [AUDIT, "--check"], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
