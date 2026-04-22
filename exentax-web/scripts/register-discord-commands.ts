/**
 * Standalone, idempotent registration of the Exentax Discord bot's
 * global slash commands.
 *
 * Why this script exists separately from the boot path:
 *   `registerSlashCommands()` also runs at server startup, but doing
 *   command sync only on cold-start is awkward when:
 *     - you want to refresh the manifest without bouncing production,
 *     - you want to dry-run the manifest (no network call) in CI,
 *     - you want to inspect what Discord currently has registered
 *       *before* overwriting it.
 *
 * Discord's `PUT /applications/{id}/commands` is itself idempotent —
 * the manifest fully replaces what was registered, and if the manifest
 * is byte-equal to the previous publish Discord just no-ops. So this
 * script is safe to re-run as often as needed.
 *
 * Usage:
 *   tsx exentax-web/scripts/register-discord-commands.ts             # publish
 *   tsx exentax-web/scripts/register-discord-commands.ts --dry-run   # print only
 *   tsx exentax-web/scripts/register-discord-commands.ts --diff      # diff vs live
 *
 * Required env (same as the bot):
 *   DISCORD_APP_ID, DISCORD_BOT_TOKEN
 *   (DISCORD_PUBLIC_KEY and ADMIN_DISCORD_ROLE_ID are NOT needed for
 *    publishing — they only matter at request time.)
 */
import { buildSlashCommandManifest } from "../server/discord-bot";

const DISCORD_API = "https://discord.com/api/v10";

// Minimal structural view of a Discord command / option that's enough
// to enumerate "(top-level, subcommand)" tuples without dragging in the
// full `discord-api-types` package. Both the local manifest and the
// payload returned by GET /applications/{id}/commands conform to this
// shape — the SUB_COMMAND option type is `1`.
interface CommandOption {
  type: number;
  name: string;
  options?: CommandOption[];
}
interface CommandLike {
  name: string;
  options?: CommandOption[];
}

function flag(name: string): boolean {
  return process.argv.slice(2).includes(name);
}

function flatNames(manifest: readonly CommandLike[]): string[] {
  const out: string[] = [];
  for (const cmd of manifest) {
    const subs = (cmd.options || []).filter(o => o.type === 1);
    if (subs.length === 0) out.push(`/${cmd.name}`);
    else for (const s of subs) out.push(`/${cmd.name} ${s.name}`);
  }
  return out.sort();
}

async function fetchLive(appId: string, token: string): Promise<CommandLike[]> {
  const res = await fetch(`${DISCORD_API}/applications/${appId}/commands`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET commands HTTP ${res.status}: ${txt.slice(0, 300)}`);
  }
  const body = await res.json();
  if (!Array.isArray(body)) {
    throw new Error(`GET commands: expected array, got ${typeof body}`);
  }
  return body as CommandLike[];
}

async function publish(appId: string, token: string, manifest: unknown): Promise<void> {
  const res = await fetch(`${DISCORD_API}/applications/${appId}/commands`, {
    method: "PUT",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(manifest),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`PUT commands HTTP ${res.status}: ${txt.slice(0, 500)}`);
  }
}

async function main(): Promise<void> {
  const dryRun = flag("--dry-run");
  const diff   = flag("--diff");
  const manifest = buildSlashCommandManifest();
  const local = flatNames(manifest);

  console.log(`Local manifest: ${manifest.length} top-level command(s), ${local.length} invocable form(s).`);
  for (const n of local) console.log(`  ${n}`);

  if (dryRun && !diff) {
    console.log("\n--dry-run: skipping network call.");
    return;
  }

  const appId = (process.env.DISCORD_APP_ID || "").trim();
  const token = (process.env.DISCORD_BOT_TOKEN || "").trim();
  if (!appId || !token) {
    console.error("\nMissing DISCORD_APP_ID or DISCORD_BOT_TOKEN — cannot talk to Discord.");
    process.exit(2);
  }

  if (diff || !dryRun) {
    const live = await fetchLive(appId, token);
    const liveNames = flatNames(live).sort();
    console.log(`\nLive on Discord: ${live.length} top-level command(s), ${liveNames.length} invocable form(s).`);
    for (const n of liveNames) console.log(`  ${n}`);

    const onlyLocal = local.filter(n => !liveNames.includes(n));
    const onlyLive  = liveNames.filter(n => !local.includes(n));
    if (onlyLocal.length || onlyLive.length) {
      console.log("\nDifference:");
      for (const n of onlyLocal) console.log(`  + ${n}  (will be added)`);
      for (const n of onlyLive)  console.log(`  - ${n}  (will be removed)`);
    } else {
      console.log("\nLocal and live manifests are equivalent at the (command, subcommand) level.");
    }
  }

  if (dryRun) {
    console.log("\n--dry-run: skipping PUT.");
    return;
  }

  console.log("\nPublishing manifest (PUT /applications/<id>/commands)…");
  await publish(appId, token, manifest);
  console.log("OK — Discord accepted the manifest. Global propagation may take up to 1h.");
}

main().catch(err => {
  console.error("\nregister-discord-commands failed:", err?.message || err);
  process.exit(1);
});
