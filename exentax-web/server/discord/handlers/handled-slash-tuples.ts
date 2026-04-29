/**
 * Canonical catalog of every `(command, subcommand)` tuple the slash-command
 * dispatcher in `./slash.ts` actually knows how to handle.
 *
 * Why this lives in its own module (and is intentionally dependency-free):
 *   - The CI manifest-dryrun gate imports it to verify that every tuple the
 *     `buildSlashCommandManifest()` payload publishes to Discord has a
 *     matching dispatcher branch — and, the other way around, that the
 *     dispatcher does not advertise dead handlers that the manifest never
 *     registers. Without this guard a developer can ship a new `/foo bar`
 *     subcommand, push it to Discord, and have production interactions
 *     fall through to the dispatcher's "Comando no reconocido" branch
 *     because the per-command switch was never updated.
 *   - That dryrun runs in a fresh CI shell with no `DATABASE_URL`, no
 *     Discord secrets, no storage setup. The dispatcher itself transitively
 *     pulls in `server/storage`, `server/discord-bot`, etc. which all read
 *     env at module-load time. Keeping this catalog in a leaf module with
 *     zero project imports is what lets the validator import it from the
 *     dryrun path safely.
 *
 * Maintenance contract:
 *   - Adding a new subcommand requires: (a) appending the tuple here AND
 *     (b) wiring the actual handler in `./slash.ts` (or one of the
 *     per-command modules under `./commands/`). The validator in
 *     `scripts/discord/register-discord-commands.ts` will fail the build
 *     if the catalog and the manifest disagree in either direction.
 *   - For top-level commands that have no subcommands at all (e.g.
 *     `/ayuda`) use `sub: null`.
 */

export interface HandledSlashTuple {
  readonly top: string;
  /** `null` when the command has no subcommand layer at all (Discord sends
   *  just `data.name` with no `type:1` option underneath). */
  readonly sub: string | null;
}

/**
 * Source of truth. Keep these in lockstep with the switch statements in
 * `./slash.ts` and the per-command handlers under `./commands/`.
 */
export const HANDLED_SLASH_TUPLES: ReadonlyArray<HandledSlashTuple> = [
  // /ayuda (no subcommand)
  { top: "ayuda", sub: null },

  // /agenda * — see ./commands/agenda.ts
  { top: "agenda", sub: "hoy" },
  { top: "agenda", sub: "semana" },
  { top: "agenda", sub: "buscar" },
  { top: "agenda", sub: "libre" },
  { top: "agenda", sub: "bloquear" },
  { top: "agenda", sub: "desbloquear" },

  // /cita * — see ./commands/cita.ts
  { top: "cita", sub: "ver" },
  { top: "cita", sub: "confirmar" },
  { top: "cita", sub: "cancelar" },
  { top: "cita", sub: "noshow" },
  { top: "cita", sub: "reprogramar" },
  { top: "cita", sub: "email" },
  { top: "cita", sub: "nueva" },

  // /newsletter * — see ./commands/newsletter.ts
  { top: "newsletter", sub: "enviar" },
  { top: "newsletter", sub: "status" },
  { top: "newsletter", sub: "cancelar" },
];

const HANDLED_KEYS: ReadonlySet<string> = new Set(
  HANDLED_SLASH_TUPLES.map((t) => tupleKey(t.top, t.sub)),
);

function tupleKey(top: string, sub: string | null): string {
  return sub == null ? `${top}` : `${top}\u0000${sub}`;
}

/**
 * Returns true iff the dispatcher has a branch that will service this
 * `(top, sub)` pair without falling through to "Comando no reconocido".
 *
 * `sub` should be `null` when the incoming Discord interaction has no
 * `type:1` (SUB_COMMAND) option underneath — i.e. the command is invoked
 * as `/ayuda` rather than `/agenda hoy`.
 */
export function canHandleSlashTuple(top: string, sub: string | null): boolean {
  return HANDLED_KEYS.has(tupleKey(top, sub));
}

/** Stable, sorted human-readable list useful for diagnostics. */
export function listHandledSlashTuples(): string[] {
  return HANDLED_SLASH_TUPLES
    .map((t) => (t.sub == null ? `/${t.top}` : `/${t.top} ${t.sub}`))
    .sort();
}

// ─── Manifest helpers (kept here so the dryrun path needs only one import) ──

interface ManifestOption {
  type: number;
  name: string;
  options?: ManifestOption[];
}
interface ManifestCommand {
  name: string;
  options?: ManifestOption[];
}

/**
 * Walk a slash-command manifest (the structure returned by
 * `buildSlashCommandManifest()`) and return every invocable
 * `(top, sub)` tuple it advertises to Discord. Top-level commands with
 * no SUB_COMMAND options yield `{ top, sub: null }`.
 *
 * Subcommand groups (option type 2) are flattened to their leaf
 * subcommand names so the comparison against `HANDLED_SLASH_TUPLES`
 * matches Discord's invocation surface (`/cmd group sub` is delivered
 * with `data.options[0].type=2 → options[0].type=1` and the dispatcher
 * sees the leaf name).
 */
export function flattenManifestTuples(
  manifest: readonly ManifestCommand[],
): HandledSlashTuple[] {
  const out: HandledSlashTuple[] = [];
  for (const cmd of manifest) {
    if (!cmd || typeof cmd.name !== "string") continue;
    const opts = Array.isArray(cmd.options) ? cmd.options : [];
    const subs = collectLeafSubcommands(opts);
    if (subs.length === 0) {
      out.push({ top: cmd.name, sub: null });
    } else {
      for (const s of subs) out.push({ top: cmd.name, sub: s });
    }
  }
  return out;
}

/**
 * Extract the set of subcommand identifiers a per-command handler file
 * actually services, by static text scanning of its source. Used by the
 * CI gate to catch the case where a developer updates `HANDLED_SLASH_TUPLES`
 * (or the manifest) but forgets to wire the corresponding switch / `if`
 * branch in the handler file — a class of drift the catalog-vs-manifest
 * check alone cannot see, because `HANDLED_SLASH_TUPLES` is the
 * dispatcher's *declared* surface, not its *executable* surface.
 *
 * Recognises both styles in use across `server/discord/handlers/commands/`:
 *   - `case "name":`            (agenda.ts, the bulk of cita.ts)
 *   - `if (sub === "name")`     (newsletter.ts, cita.ts "nueva" branch)
 *
 * Pure text in / set out — no `fs`, no imports — so callers (CI dryrun,
 * focused tests) can feed it source they read however they prefer
 * without dragging in `node:fs` here and breaking the leaf-module
 * contract documented at the top of this file.
 */
export function extractSubcommandsFromHandlerSource(source: string): Set<string> {
  const found = new Set<string>();
  // case "name":  →  also tolerates surrounding whitespace and the value
  // immediately followed by ':' / `'`. Discord subcommand names follow the
  // same charset rules as command names (lowercase letters, digits, '-',
  // '_'), so we restrict to that to avoid picking up unrelated string
  // literals that happen to sit after a `case` keyword (none currently,
  // but it keeps the heuristic robust as the handlers grow).
  const caseRe = /\bcase\s+"([a-z0-9_-]+)"\s*:/g;
  for (const m of source.matchAll(caseRe)) found.add(m[1]);
  // if (sub === "name")  /  sub === "name"  — covers both the wrapping
  // `if` form and any future inline guard. Tolerates spaces around `===`.
  const eqRe = /\bsub\s*===\s*"([a-z0-9_-]+)"/g;
  for (const m of source.matchAll(eqRe)) found.add(m[1]);
  return found;
}

/**
 * Static map from top-level command name to the per-command handler
 * source file (relative to the repo root, posix style). Top-level
 * commands that have no subcommand layer at all (e.g. `/ayuda`) are
 * intentionally absent — their handler is a single function with
 * nothing to scan, and the catalog records them as `sub: null`.
 *
 * Kept here next to the catalog so the two stay together; the CI gate
 * resolves these paths against its own location at scan time.
 */
export const SUBCOMMAND_HANDLER_SOURCES: Readonly<Record<string, string>> = {
  agenda:     "exentax-web/server/discord/handlers/commands/agenda.ts",
  cita:       "exentax-web/server/discord/handlers/commands/cita.ts",
  newsletter: "exentax-web/server/discord/handlers/commands/newsletter.ts",
};

function collectLeafSubcommands(options: ManifestOption[]): string[] {
  const out: string[] = [];
  for (const o of options) {
    if (!o || typeof o.type !== "number") continue;
    if (o.type === 1) {
      if (typeof o.name === "string") out.push(o.name);
    } else if (o.type === 2 && Array.isArray(o.options)) {
      // Subcommand group: descend one more level. The dispatcher sees the
      // leaf subcommand name via getSubcommand(), so that is what must
      // appear in the catalog.
      for (const child of o.options) {
        if (child && child.type === 1 && typeof child.name === "string") {
          out.push(child.name);
        }
      }
    }
  }
  return out;
}
