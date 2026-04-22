/**
 * Regression guard — the project intentionally has **no** REST admin
 * surface. Every operator action lives in the Discord bot
 * (`server/discord-bot-commands.ts`) gated by `ADMIN_DISCORD_ROLE_ID`.
 *
 * This test deliberately keeps the literal string `/api/admin/` so that
 * a future agent who tries to re-introduce the legacy surface (file,
 * import or Markdown row) gets a loud failure here. It is the single
 * documented exception to the "no `/api/admin/` strings in the repo"
 * policy enforced by the cleanup task.
 *
 * The test does NOT spin up the server (avoids env / db deps); it does
 * a static check on the source tree:
 *   1. `server/routes/admin.ts` does not exist.
 *   2. `server/routes.ts` does not import or register an admin router.
 *   3. The bot still defines the slash-command handlers that replace
 *      the removed REST surface.
 *   4. README and architecture-map do not advertise legacy admin REST
 *      routes inside Markdown endpoint tables.
 *
 * Run: `tsx exentax-web/tests/admin-api-removed.test.ts`
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const failures: string[] = [];
function assert(cond: unknown, msg: string) {
  if (!cond) failures.push(msg);
  else process.stdout.write(`  ok  ${msg}\n`);
}

// 1. Source file must be gone.
assert(
  !existsSync(join(root, "server/routes/admin.ts")),
  "server/routes/admin.ts has been deleted"
);

// 2. routes.ts must not import or call it.
const routes = readFileSync(join(root, "server/routes.ts"), "utf8");
assert(!/registerAdminRoutes/.test(routes), "server/routes.ts no longer references registerAdminRoutes");
assert(!/from\s+["']\.\/routes\/admin["']/.test(routes), "server/routes.ts no longer imports ./routes/admin");

// 3. The Discord bot must still expose the admin slash-command surface that
//    replaces the removed REST API. We assert presence of the no-show / cancel
//    / reschedule / nueva entrypoints so a future refactor can't silently
//    delete them and leave the project with no admin surface at all.
const botCommands = readFileSync(join(root, "server/discord-bot-commands.ts"), "utf8");
for (const sym of ["noShowBooking", "cancelBooking", "rescheduleBooking", "handleCreateBooking", "showBooking", "confirmBooking"]) {
  assert(
    new RegExp(`(?:async\\s+)?function\\s+${sym}\\b`).test(botCommands),
    `server/discord-bot-commands.ts still defines ${sym}() (admin operations route through the bot)`
  );
}

// 4. README + architecture-map must not list `/api/admin/agenda*` as a live row.
//    A removal-notice line that contains the path is OK ("has been removed");
//    we only fail if the path appears inside a Markdown table row (`| ... |`).
function hasLiveAdminTableRow(md: string): boolean {
  return md.split("\n").some((line) =>
    /^\s*\|/.test(line) && /\/api\/admin\/agenda/.test(line)
  );
}
const readme = readFileSync(join(root, "README.md"), "utf8");
const archMap = readFileSync(join(root, "docs/architecture-map.md"), "utf8");
assert(!hasLiveAdminTableRow(readme), "README.md no longer advertises /api/admin/agenda* in an endpoint table");
assert(!hasLiveAdminTableRow(archMap), "docs/architecture-map.md no longer advertises /api/admin/agenda* in an endpoint table");

if (failures.length > 0) {
  console.error("\nFAILED ASSERTIONS:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("\nAdmin REST surface remains deleted — bot is the sole admin entry point.");
process.exit(0);
