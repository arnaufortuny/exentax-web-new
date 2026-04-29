/**
 * Shared bootstrap for `scripts/discord/*` regression tests.
 *
 * Importing this module pins the Discord outbound queue to its in-memory
 * FIFO backend so the tests do not depend on a Postgres connection or on
 * dedup state persisted from a previous run. It MUST be the first import
 * in any Discord test file: `loadBackend()` in `server/discord.ts` reads
 * `DISCORD_QUEUE_BACKEND` lazily on first send, so the env var only needs
 * to be set before the first `notify*` call — but importing the helper
 * before `server/discord.ts` is the simplest way to guarantee that
 * ordering under any future code path that might trigger an earlier
 * load (e.g. a test that imports a server module that itself imports
 * `discord.ts`).
 *
 * The helper also exposes:
 *   - `EXENTAX_NEON` — the only colour every embed is allowed to use.
 *   - `DISCORD_MODULE_PATH` — absolute path to the module under test,
 *     computed relative to this file so a copy/paste of the import path
 *     into a new test cannot regress to the off-by-one bug fixed in
 *     task #68.
 *   - `importDiscordModule(extra)` — dynamic import of `server/discord.ts`
 *     plus a regression assertion that every notify* / queue symbol the
 *     tests rely on is actually exported. If the import path ever drifts
 *     again the assertion fails immediately with a clear message instead
 *     of producing confusing "function is undefined" errors deep in the
 *     test body.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type * as DiscordModule from "../../server/discord";

// ─── Pin the queue backend BEFORE any caller imports server/discord.ts ─────
process.env.DISCORD_QUEUE_BACKEND = "memory";

/** Brand-policy neon green. Every Discord embed must use this colour. */
export const EXENTAX_NEON = 0x00e510;

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Absolute path to the `server/discord.ts` module the tests target.
 * Computed from this file's location so it stays correct even if the
 * test scripts are moved around inside `scripts/discord/`.
 */
export const DISCORD_MODULE_PATH = resolve(HERE, "..", "..", "server", "discord.ts");

/**
 * Typed view of the Discord module surface the regression suite uses.
 * The `import type` above gives us the full export types statically,
 * so call sites get autocomplete + parameter checking without the
 * weak `Function` casts that this helper used to require.
 */
export type DiscordTestModule = typeof DiscordModule;

/** Public symbols the regression suite expects on the discord module. */
const REQUIRED_DISCORD_EXPORTS = [
  "notifyBookingCreated",
  "notifyBookingRescheduled",
  "notifyBookingCancelled",
  "notifyNoShow",
  "notifyCalculatorLead",
  "notifyNewsletterSubscribe",
  "notifyNewLead",
  "notifyWebVisit",
  "notifyConsent",
  "notifyValidationFailed",
  "notifyCriticalError",
  "notifySeoIndexing",
  "getDiscordQueueSize",
] as const;

/**
 * Dynamic-import `server/discord.ts` from its absolute path and verify
 * the public surface. Throws with a clear, actionable message if a
 * symbol is missing — that's almost always a sign the import path
 * resolved into the wrong directory (the bug task #68 was filed to fix).
 *
 * Returns the module typed as `DiscordTestModule` so call sites can
 * invoke wrappers directly (e.g. `d.notifyBookingCreated({ ... })`)
 * with full parameter checking instead of casting through `Function`.
 */
export async function importDiscordModule(
  extra: readonly string[] = [],
): Promise<DiscordTestModule> {
  const mod = (await import(DISCORD_MODULE_PATH)) as DiscordTestModule;
  const surface = mod as unknown as Record<string, unknown>;
  const required = [...REQUIRED_DISCORD_EXPORTS, ...extra];
  const missing = required.filter((s) => typeof surface[s] !== "function");
  if (missing.length > 0) {
    throw new Error(
      `Discord module loaded from ${DISCORD_MODULE_PATH} is missing expected ` +
      `symbol(s): ${missing.join(", ")}. This usually means the import path ` +
      `is wrong (off-by-one directory) or the module surface changed.`,
    );
  }
  return mod;
}
