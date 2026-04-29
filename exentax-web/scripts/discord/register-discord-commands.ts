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
// Import directly from the dedicated manifest module — NOT from
// `server/discord-bot` — so the dry-run path (used by the CI regression
// gate) does not pull in DB/storage code that requires `DATABASE_URL`
// at module-load time. The manifest module is intentionally
// dependency-free.
import { buildSlashCommandManifest } from "../../server/discord-bot-manifest";

const DISCORD_API = "https://discord.com/api/v10";

// Minimal structural view of a Discord command / option that's enough
// to enumerate "(top-level, subcommand)" tuples without dragging in the
// full `discord-api-types` package. Both the local manifest and the
// payload returned by GET /applications/{id}/commands conform to this
// shape — the SUB_COMMAND option type is `1`.
interface CommandOption {
  type: number;
  name: string;
  description?: string;
  required?: boolean;
  choices?: Array<{ name: string; value: string | number }>;
  options?: CommandOption[];
}
interface CommandLike {
  name: string;
  description?: string;
  options?: CommandOption[];
}

function flag(name: string): boolean {
  return process.argv.slice(2).includes(name);
}

// Discord CHAT_INPUT name regex: 1–32 chars from a small set of unicode
// letter/number ranges plus `-` and `_`. The `u` flag is required so the
// `\p{...}` Unicode property escapes resolve.
const NAME_RE = /^[-_\p{L}\p{N}\p{sc=Devanagari}\p{sc=Thai}]{1,32}$/u;

// Discord option types we expect inside a CHAT_INPUT command. SUB_COMMAND=1,
// SUB_COMMAND_GROUP=2, and the value-bearing types 3–11. Anything outside
// this range would be rejected by Discord at publish time.
const VALID_OPTION_TYPES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

/**
 * Validate the local slash-command manifest against the structural rules
 * Discord enforces at publish time. Returns a list of human-readable
 * problems; an empty list means the manifest is well-formed enough to
 * publish (Discord may still reject for reasons we cannot know locally,
 * such as application-level command count limits).
 *
 * Caught here:
 *   - duplicate top-level command names
 *   - duplicate subcommand names within a parent
 *   - duplicate option names within a (sub)command
 *   - name length / charset / lowercase violations (1–32 chars)
 *   - description length 1–100
 *   - invalid option `type` values
 *   - mixing subcommand options with regular options at the same level
 *     (Discord forbids this)
 *   - more than 25 options on a (sub)command, more than 25 choices on
 *     an option
 *
 * Pure function — no I/O, no env reads — so it is safe to call from the
 * dry-run path that runs in CI without Discord secrets.
 */
export function validateSlashCommandManifest(
  manifest: readonly CommandLike[],
): string[] {
  const errors: string[] = [];

  function checkName(label: string, name: unknown): void {
    if (typeof name !== "string" || name.length === 0) {
      errors.push(`${label}: name is missing or empty`);
      return;
    }
    if (name.length > 32) {
      errors.push(`${label}: name "${name}" is ${name.length} chars (max 32)`);
    }
    if (name !== name.toLowerCase()) {
      errors.push(`${label}: name "${name}" must be lowercase`);
    }
    if (!NAME_RE.test(name)) {
      errors.push(
        `${label}: name "${name}" does not match Discord's allowed charset ` +
        `(letters, numbers, '-', '_'; 1–32 chars).`,
      );
    }
  }

  function checkDescription(label: string, desc: unknown): void {
    if (typeof desc !== "string" || desc.length === 0) {
      errors.push(`${label}: description is missing or empty`);
      return;
    }
    if (desc.length > 100) {
      errors.push(`${label}: description is ${desc.length} chars (max 100)`);
    }
  }

  function checkOptions(parentLabel: string, options: CommandOption[] | undefined): void {
    if (!options) return;
    if (options.length > 25) {
      errors.push(`${parentLabel}: ${options.length} options (max 25)`);
    }

    const seenNames = new Set<string>();
    let sawSub = false;
    let sawValue = false;
    for (const opt of options) {
      const optLabel = `${parentLabel} option "${opt?.name ?? "<missing>"}"`;
      checkName(optLabel, opt?.name);
      checkDescription(optLabel, opt?.description);

      if (typeof opt?.type !== "number" || !VALID_OPTION_TYPES.has(opt.type)) {
        errors.push(
          `${optLabel}: invalid type ${JSON.stringify(opt?.type)} ` +
          `(expected one of ${[...VALID_OPTION_TYPES].join(", ")})`,
        );
      } else {
        if (opt.type === 1 || opt.type === 2) sawSub = true;
        else sawValue = true;
      }

      if (typeof opt?.name === "string") {
        if (seenNames.has(opt.name)) {
          errors.push(`${parentLabel}: duplicate option name "${opt.name}"`);
        } else {
          seenNames.add(opt.name);
        }
      }

      if (Array.isArray(opt?.choices)) {
        if (opt.choices.length > 25) {
          errors.push(`${optLabel}: ${opt.choices.length} choices (max 25)`);
        }
        const seenChoiceNames = new Set<string>();
        const seenChoiceValues = new Set<string>();
        for (const c of opt.choices) {
          if (typeof c?.name !== "string" || c.name.length === 0 || c.name.length > 100) {
            errors.push(`${optLabel}: choice has invalid name ${JSON.stringify(c?.name)}`);
          } else if (seenChoiceNames.has(c.name)) {
            errors.push(`${optLabel}: duplicate choice name "${c.name}"`);
          } else {
            seenChoiceNames.add(c.name);
          }
          if (c?.value === undefined || c.value === null) {
            errors.push(`${optLabel}: choice "${c?.name}" missing value`);
          } else {
            const key = `${typeof c.value}:${String(c.value)}`;
            if (seenChoiceValues.has(key)) {
              errors.push(`${optLabel}: duplicate choice value ${JSON.stringify(c.value)}`);
            } else {
              seenChoiceValues.add(key);
            }
            if (typeof c.value === "string" && c.value.length > 100) {
              errors.push(`${optLabel}: choice value "${c.value}" is ${c.value.length} chars (max 100)`);
            }
          }
        }
      }

      // Recurse into subcommand / subcommand-group children.
      if ((opt?.type === 1 || opt?.type === 2) && Array.isArray(opt.options)) {
        checkOptions(optLabel, opt.options);
      }
    }

    if (sawSub && sawValue) {
      errors.push(
        `${parentLabel}: cannot mix subcommand/group options with regular ` +
        `value options at the same level (Discord rejects this).`,
      );
    }
  }

  if (!Array.isArray(manifest)) {
    return [`Manifest is not an array (got ${typeof manifest})`];
  }
  if (manifest.length > 100) {
    errors.push(`Manifest has ${manifest.length} top-level commands (max 100)`);
  }

  const seenTopLevel = new Set<string>();
  for (const cmd of manifest) {
    const label = `Command "${cmd?.name ?? "<missing>"}"`;
    checkName(label, cmd?.name);
    checkDescription(label, cmd?.description);
    if (typeof cmd?.name === "string") {
      if (seenTopLevel.has(cmd.name)) {
        errors.push(`Duplicate top-level command name "${cmd.name}"`);
      } else {
        seenTopLevel.add(cmd.name);
      }
    }
    checkOptions(label, cmd?.options);
  }

  return errors;
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

  // Run the structural validator BEFORE any other branching so a malformed
  // manifest fails the same way under --dry-run, --diff, and full publish.
  // This is what the Discord regression gate relies on to catch breakage
  // (duplicate subcommand, oversized name, invalid option type, …) in CI
  // — long before `registerSlashCommands()` would talk to the live API at
  // boot time and fail the deploy.
  const manifestErrors = validateSlashCommandManifest(manifest);
  if (manifestErrors.length > 0) {
    console.error(
      `\n❌ Slash-command manifest is invalid (${manifestErrors.length} problem(s)):`,
    );
    for (const err of manifestErrors) console.error(`  - ${err}`);
    console.error(
      "\nFix `buildSlashCommandManifest()` in server/discord-bot-manifest.ts " +
      "before publishing — Discord would reject this payload.",
    );
    process.exit(1);
  }

  if (dryRun && !diff) {
    console.log("\n--dry-run: manifest is structurally valid; skipping network call.");
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
