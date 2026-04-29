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
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import * as path from "node:path";
import { buildSlashCommandManifest } from "../../server/discord-bot-manifest";
import {
  HANDLED_SLASH_TUPLES, canHandleSlashTuple, flattenManifestTuples,
  SUBCOMMAND_HANDLER_SOURCES, extractSubcommandsFromHandlerSource,
} from "../../server/discord/handlers/handled-slash-tuples";
import {
  HANDLED_COMPONENT_ACTIONS, HANDLED_MODAL_ACTIONS,
  COMPONENT_DISPATCHER_SOURCE, MODAL_DISPATCHER_SOURCE,
  COMPONENT_EMITTER_SOURCES, EMITTER_HELPER_REGEXES,
  extractEmittedCustomIdActions,
  extractDispatcherActionsFromComponentSource,
  extractDispatcherActionsFromModalSource,
} from "../../server/discord/handlers/handled-component-customids";

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

/**
 * Cross-check the local slash-command manifest against the dispatcher's
 * `(command, subcommand)` handler catalog. Catches both directions of
 * drift before they reach production:
 *
 *   - "manifest tuple is unhandled" — `buildSlashCommandManifest()`
 *     advertises `/foo bar` to Discord but the dispatcher in
 *     `server/discord/handlers/slash.ts` (or one of its per-command
 *     modules) has no branch for `bar`, so the live interaction would
 *     fall through to "Comando no reconocido".
 *   - "handler tuple is missing from manifest" — the dispatcher catalog
 *     in `handled-slash-tuples.ts` claims to service `/foo bar`, but
 *     the manifest never registers it with Discord, so the slash
 *     command is unreachable. Usually means somebody removed an entry
 *     from `buildSlashCommandManifest()` and forgot to clean up the
 *     handler list.
 *
 * Pure function — only reads the in-memory manifest plus the static
 * `HANDLED_SLASH_TUPLES` catalog — so it is safe to call from the
 * dry-run path that runs in CI without Discord secrets or a database.
 */
export function validateManifestAgainstDispatcher(
  manifest: readonly CommandLike[],
): string[] {
  const errors: string[] = [];

  // Direction 1: manifest → dispatcher. Every (top, sub) tuple Discord
  // would receive must have a branch.
  const manifestTuples = flattenManifestTuples(manifest);
  for (const t of manifestTuples) {
    if (!canHandleSlashTuple(t.top, t.sub)) {
      const label = t.sub == null ? `/${t.top}` : `/${t.top} ${t.sub}`;
      errors.push(
        `Manifest registers \`${label}\` but the slash dispatcher has no ` +
        `handler for it. Add the tuple to HANDLED_SLASH_TUPLES in ` +
        `server/discord/handlers/handled-slash-tuples.ts AND wire the ` +
        `case in the appropriate per-command module under ` +
        `server/discord/handlers/commands/.`,
      );
    }
  }

  // Direction 2: dispatcher → manifest. Every catalog tuple must be
  // reachable via a manifest entry, otherwise we ship a dead handler.
  const manifestKey = (top: string, sub: string | null): string =>
    sub == null ? top : `${top}\u0000${sub}`;
  const manifestSet = new Set(manifestTuples.map((t) => manifestKey(t.top, t.sub)));
  for (const t of HANDLED_SLASH_TUPLES) {
    if (!manifestSet.has(manifestKey(t.top, t.sub))) {
      const label = t.sub == null ? `/${t.top}` : `/${t.top} ${t.sub}`;
      errors.push(
        `Dispatcher claims to handle \`${label}\` but the manifest does ` +
        `not register it with Discord. Either add the option to ` +
        `buildSlashCommandManifest() in server/discord-bot-manifest.ts ` +
        `or remove the dead entry from HANDLED_SLASH_TUPLES in ` +
        `server/discord/handlers/handled-slash-tuples.ts.`,
      );
    }
  }

  return errors;
}

/**
 * Cross-check the dispatcher's declared catalog (`HANDLED_SLASH_TUPLES`)
 * against the *executable* surface of the per-command handler files —
 * the actual `case "name":` and `if (sub === "name")` branches. Catches
 * the drift class the manifest-vs-catalog gate cannot see:
 *
 *   - "case in handler not in catalog" — handler implements `/foo bar`
 *     but the catalog forgot to declare it. The manifest gate would
 *     pass (because the manifest doesn't register `/foo bar` either),
 *     yet the moment somebody adds the manifest entry the runtime
 *     interaction would still go through `canHandleSlashTuple()` →
 *     "Comando no reconocido". This finds it ahead of time.
 *   - "tuple in catalog not in handler" — somebody bumped the catalog
 *     thinking they were enabling a subcommand, but no executable
 *     branch exists. Live interactions would fall through to the
 *     per-command default ("Subcomando no implementado").
 *
 * Implementation note: we deliberately read the handler files as text
 * rather than importing them. The handlers transitively pull in
 * `server/storage` etc. which require `DATABASE_URL` at module-load
 * time — fatal in the dryrun CI shell. Static text scanning is
 * coarser, but it gives us the executable-branch view without breaking
 * the dryrun's dependency-free contract.
 */
export function validateHandlerSourcesAgainstCatalog(
  readSource: (relPath: string) => string = (rel) =>
    fs.readFileSync(path.resolve(REPO_ROOT, rel), "utf8"),
): string[] {
  const errors: string[] = [];
  // Group catalog tuples by top-level command, dropping the ayuda-style
  // `(top, null)` rows: those have no per-command handler file and no
  // subcommand surface to scan.
  const catalogByTop = new Map<string, Set<string>>();
  for (const t of HANDLED_SLASH_TUPLES) {
    if (t.sub == null) continue;
    let s = catalogByTop.get(t.top);
    if (!s) { s = new Set(); catalogByTop.set(t.top, s); }
    s.add(t.sub);
  }

  for (const [top, relPath] of Object.entries(SUBCOMMAND_HANDLER_SOURCES)) {
    const declared = catalogByTop.get(top) ?? new Set<string>();
    let src: string;
    try {
      src = readSource(relPath);
    } catch (err) {
      errors.push(
        `Cannot read handler source for /${top} at ${relPath}: ` +
        `${err instanceof Error ? err.message : String(err)}.`,
      );
      continue;
    }
    const inHandler = extractSubcommandsFromHandlerSource(src);

    for (const sub of inHandler) {
      if (!declared.has(sub)) {
        errors.push(
          `Handler ${relPath} has a branch for \`/${top} ${sub}\` but ` +
          `HANDLED_SLASH_TUPLES does not list it. Either add the tuple ` +
          `to server/discord/handlers/handled-slash-tuples.ts or remove ` +
          `the dead branch from the handler.`,
        );
      }
    }
    for (const sub of declared) {
      if (!inHandler.has(sub)) {
        errors.push(
          `HANDLED_SLASH_TUPLES claims \`/${top} ${sub}\` is handled but ` +
          `${relPath} has no \`case "${sub}":\` or \`sub === "${sub}"\` ` +
          `branch. Wire the case or remove the catalog entry.`,
        );
      }
    }
  }
  return errors;
}

/**
 * Cross-check the message-component (button + select) and modal-submit
 * dispatchers against (a) their declared `HANDLED_COMPONENT_ACTIONS` /
 * `HANDLED_MODAL_ACTIONS` catalogs and (b) every card / notification
 * builder that emits an `agenda:<action>:…` `custom_id` in the
 * codebase. Catches three drift classes before they reach production:
 *
 *   - "card emits a custom_id no dispatcher handles" — a developer
 *     ships a notification card whose button `custom_id` is missing
 *     from the `switch (action)` in
 *     `server/discord/handlers/components.ts` (or whose modal
 *     `custom_id` is missing from `…/handlers/modals.ts`); clicking
 *     it in production fails with "interaction failed" because the
 *     dispatcher falls through to its "Componente no reconocido" /
 *     "Modal no reconocido" branch. This is the parallel of the
 *     slash-command "Comando no reconocido" drift caught above.
 *   - "dispatcher branch is dead" — a `case "foo":` lingers in the
 *     dispatcher after the card that produced `agenda:foo:<id>` was
 *     removed. Live interactions can never reach it. The validator
 *     refuses to ship dead branches so the dispatcher stays a
 *     reliable index of the live interaction surface.
 *   - "catalog drifted from dispatcher" — `HANDLED_COMPONENT_ACTIONS`
 *     declares `foo` but no `case "foo":` exists yet (or vice versa),
 *     same as the catalog-vs-handler check above does for slash
 *     subcommands. We ALSO require every emitter `custom_id` to
 *     appear in the catalog, so adding an action means updating both
 *     the catalog AND the dispatcher in the same change.
 *
 * Implementation note: we deliberately read the dispatcher /
 * emitter files as text rather than importing them, for the same
 * reason `validateHandlerSourcesAgainstCatalog()` does — they
 * transitively pull in `server/storage` etc. which require
 * `DATABASE_URL` at module-load time, fatal in the dryrun CI shell.
 */
export function validateComponentCustomIdsAgainstDispatcher(
  readSource: (relPath: string) => string = (rel) =>
    fs.readFileSync(path.resolve(REPO_ROOT, rel), "utf8"),
): string[] {
  const errors: string[] = [];

  // Read the two dispatcher source files. A missing file is a hard
  // failure — the gate cannot guarantee anything if it cannot see
  // the dispatcher.
  let componentSrc = "";
  let modalSrc = "";
  try {
    componentSrc = readSource(COMPONENT_DISPATCHER_SOURCE);
  } catch (err) {
    errors.push(
      `Cannot read component dispatcher source at ${COMPONENT_DISPATCHER_SOURCE}: ` +
      `${err instanceof Error ? err.message : String(err)}.`,
    );
  }
  try {
    modalSrc = readSource(MODAL_DISPATCHER_SOURCE);
  } catch (err) {
    errors.push(
      `Cannot read modal dispatcher source at ${MODAL_DISPATCHER_SOURCE}: ` +
      `${err instanceof Error ? err.message : String(err)}.`,
    );
  }

  const componentInDispatcher = componentSrc
    ? extractDispatcherActionsFromComponentSource(componentSrc)
    : new Set<string>();
  const modalInDispatcher = modalSrc
    ? extractDispatcherActionsFromModalSource(modalSrc)
    : new Set<string>();

  const componentCatalog = new Set(HANDLED_COMPONENT_ACTIONS);
  const modalCatalog = new Set(HANDLED_MODAL_ACTIONS);

  // Direction A: catalog ↔ dispatcher (component).
  for (const action of componentInDispatcher) {
    if (!componentCatalog.has(action)) {
      errors.push(
        `Component dispatcher ${COMPONENT_DISPATCHER_SOURCE} has a branch ` +
        `for \`agenda:${action}:…\` but HANDLED_COMPONENT_ACTIONS does not ` +
        `list it. Either add \`${action}\` to HANDLED_COMPONENT_ACTIONS in ` +
        `server/discord/handlers/handled-component-customids.ts or remove ` +
        `the dead branch from the dispatcher.`,
      );
    }
  }
  for (const action of componentCatalog) {
    if (!componentInDispatcher.has(action)) {
      errors.push(
        `HANDLED_COMPONENT_ACTIONS claims \`agenda:${action}:…\` is handled ` +
        `but ${COMPONENT_DISPATCHER_SOURCE} has no \`case "${action}":\` ` +
        `branch. Wire the case or remove the catalog entry.`,
      );
    }
  }

  // Direction B: catalog ↔ dispatcher (modal).
  for (const action of modalInDispatcher) {
    if (!modalCatalog.has(action)) {
      errors.push(
        `Modal dispatcher ${MODAL_DISPATCHER_SOURCE} has a branch for ` +
        `\`agenda:${action}:…\` but HANDLED_MODAL_ACTIONS does not list ` +
        `it. Either add \`${action}\` to HANDLED_MODAL_ACTIONS in ` +
        `server/discord/handlers/handled-component-customids.ts or remove ` +
        `the dead branch from the dispatcher.`,
      );
    }
  }
  for (const action of modalCatalog) {
    if (!modalInDispatcher.has(action)) {
      errors.push(
        `HANDLED_MODAL_ACTIONS claims \`agenda:${action}:…\` is handled but ` +
        `${MODAL_DISPATCHER_SOURCE} has no matching guard branch (looked for ` +
        `\`case "${action}":\` or \`parts[1] === "${action}"\` / ` +
        `\`parts[1] !== "${action}"\`). Wire the guard or remove the ` +
        `catalog entry.`,
      );
    }
  }

  // Direction C: emitter custom_ids ↔ catalogs. Every action emitted
  // by a card / notification builder must be claimed by EITHER the
  // component dispatcher OR the modal dispatcher (modal `custom_id`s
  // are also emitted by the components dispatcher when it opens the
  // modal in response to a button click — so a single emitter file
  // can legitimately produce both kinds).
  const emittedAll = new Set<string>();
  for (const relPath of COMPONENT_EMITTER_SOURCES) {
    let src: string;
    try {
      src = readSource(relPath);
    } catch (err) {
      errors.push(
        `Cannot read component emitter source at ${relPath}: ` +
        `${err instanceof Error ? err.message : String(err)}.`,
      );
      continue;
    }
    const helperRegexes = EMITTER_HELPER_REGEXES[relPath] ?? [];
    const emitted = extractEmittedCustomIdActions(src, helperRegexes);
    for (const action of emitted) {
      emittedAll.add(action);
      if (!componentCatalog.has(action) && !modalCatalog.has(action)) {
        errors.push(
          `${relPath} emits \`agenda:${action}:…\` as a Discord custom_id ` +
          `but neither HANDLED_COMPONENT_ACTIONS nor HANDLED_MODAL_ACTIONS ` +
          `lists it. The dispatchers in server/discord/handlers/components.ts ` +
          `and server/discord/handlers/modals.ts will reject the click with ` +
          `"interaction failed" in production. Add \`${action}\` to the ` +
          `appropriate catalog in ` +
          `server/discord/handlers/handled-component-customids.ts AND wire ` +
          `the matching dispatcher branch.`,
        );
      }
    }
  }

  // Direction D: catalogs ↔ emitters. Every catalog entry must be
  // reachable from at least one emitter file, otherwise we ship a
  // dispatcher branch nobody can ever invoke (dead code that hides
  // future drift).
  for (const action of componentCatalog) {
    if (!emittedAll.has(action)) {
      errors.push(
        `HANDLED_COMPONENT_ACTIONS lists \`${action}\` but no emitter in ` +
        `${COMPONENT_EMITTER_SOURCES.join(", ")} produces an ` +
        `\`agenda:${action}:…\` custom_id. Either remove the entry from ` +
        `the catalog (and the dispatcher branch) or add the missing card ` +
        `/ button row that emits it.`,
      );
    }
  }
  for (const action of modalCatalog) {
    if (!emittedAll.has(action)) {
      errors.push(
        `HANDLED_MODAL_ACTIONS lists \`${action}\` but no emitter in ` +
        `${COMPONENT_EMITTER_SOURCES.join(", ")} produces an ` +
        `\`agenda:${action}:…\` custom_id. Either remove the entry from ` +
        `the catalog (and the dispatcher branch) or add the missing modal ` +
        `trigger that emits it.`,
      );
    }
  }

  return errors;
}

// Repo root, computed once. The script file lives at
// `<repo>/exentax-web/scripts/discord/register-discord-commands.ts`, so
// climbing three levels gets us back to the repo root that
// `SUBCOMMAND_HANDLER_SOURCES` paths are anchored to.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

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

  // Cross-check the manifest against the dispatcher's handled-tuples
  // catalog. This is what catches "developer added /foo bar to the manifest
  // but forgot to update the dispatcher" (and the reverse) before the
  // command ships to production. Same fail-the-build pattern as the
  // structural validator above.
  const dispatcherErrors = validateManifestAgainstDispatcher(manifest);
  if (dispatcherErrors.length > 0) {
    console.error(
      `\n❌ Slash-command manifest does not match the dispatcher ` +
      `(${dispatcherErrors.length} problem(s)):`,
    );
    for (const err of dispatcherErrors) console.error(`  - ${err}`);
    console.error(
      "\nKeep buildSlashCommandManifest() (server/discord-bot-manifest.ts) " +
      "and HANDLED_SLASH_TUPLES (server/discord/handlers/handled-slash-tuples.ts) " +
      "in lockstep. Both must agree on every (command, subcommand) tuple.",
    );
    process.exit(1);
  }

  // Final check: the catalog (declared dispatcher surface) must also match
  // the actual switch / `if (sub === ...)` branches in the per-command
  // handler files. This catches the drift the catalog-vs-manifest gate
  // alone cannot see — namely, somebody bumping HANDLED_SLASH_TUPLES
  // without wiring the corresponding executable branch (or vice versa).
  const handlerErrors = validateHandlerSourcesAgainstCatalog();
  if (handlerErrors.length > 0) {
    console.error(
      `\n❌ Slash dispatcher catalog does not match the per-command ` +
      `handler sources (${handlerErrors.length} problem(s)):`,
    );
    for (const err of handlerErrors) console.error(`  - ${err}`);
    console.error(
      "\nKeep HANDLED_SLASH_TUPLES (server/discord/handlers/handled-slash-tuples.ts) " +
      "and the per-command switches (server/discord/handlers/commands/*.ts) in " +
      "lockstep. Every catalog entry needs a matching `case`/`if` branch.",
    );
    process.exit(1);
  }

  // And finally, the same lockstep check for message-component
  // (button + select) and modal-submit dispatchers vs every emitter
  // of an `agenda:<action>:…` custom_id in the codebase. Catches the
  // class of bug where a developer ships a notification card whose
  // button custom_id no dispatcher handles (production click silently
  // fails with "interaction failed") OR leaves a dead `case "foo":`
  // branch behind after the card that produced it was removed.
  const componentErrors = validateComponentCustomIdsAgainstDispatcher();
  if (componentErrors.length > 0) {
    console.error(
      `\n❌ Discord component / modal dispatchers do not match their ` +
      `catalogs and emitters (${componentErrors.length} problem(s)):`,
    );
    for (const err of componentErrors) console.error(`  - ${err}`);
    console.error(
      "\nKeep HANDLED_COMPONENT_ACTIONS / HANDLED_MODAL_ACTIONS " +
      "(server/discord/handlers/handled-component-customids.ts), the " +
      "dispatcher branches in server/discord/handlers/components.ts and " +
      "server/discord/handlers/modals.ts, and the card / button-row " +
      "builders that emit `agenda:<action>:…` custom_ids in lockstep.",
    );
    process.exit(1);
  }

  if (dryRun && !diff) {
    console.log(
      "\n--dry-run: manifest is structurally valid, every (command, subcommand) " +
      "tuple has a dispatcher handler, every catalog entry maps to an " +
      "executable per-command branch, AND every Discord component / modal " +
      "custom_id emitted in the codebase is recognised by the matching " +
      "dispatcher (and vice versa); skipping network call.",
    );
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

// Only run `main()` when this file is invoked directly (e.g.
// `tsx scripts/discord/register-discord-commands.ts --dry-run`).
// The test file
// `scripts/discord/test-discord-manifest-validator.ts` imports
// `validateSlashCommandManifest` from this module to feed it
// hand-crafted manifests; without this guard that import would
// trigger a real publish/dry-run on every test execution and
// (worse) read live Discord secrets out of the environment.
//
// `tsx` sets `process.argv[1]` to the resolved path of the entry
// file, which is exactly what `fileURLToPath(import.meta.url)`
// returns for this module — no extension or symlink rewriting is
// needed.
const isDirectInvocation = (() => {
  try {
    return process.argv[1] === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();
if (isDirectInvocation) {
  main().catch(err => {
    console.error("\nregister-discord-commands failed:", err?.message || err);
    process.exit(1);
  });
}
