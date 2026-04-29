/**
 * Canonical catalog of every message-component (button / select menu) and
 * modal-submit `custom_id` action the Discord interaction dispatchers in
 * `./components.ts` and `./modals.ts` actually know how to handle.
 *
 * Why this lives in its own module (and is intentionally dependency-free):
 *   - The CI manifest-dryrun gate imports it to verify that every
 *     `agenda:<action>:…` `custom_id` advertised by the notification
 *     builders / button rows in the codebase has a matching dispatcher
 *     branch — and, the other way around, that a dispatcher branch does
 *     not linger after the card that produced its `custom_id` is
 *     removed. Without this guard a developer can ship a notification
 *     card whose button `custom_id` is unknown to
 *     `server/discord/handlers/components.ts` and clicking it in
 *     production silently fails with "interaction failed". The
 *     parallel slash-command catalog (`./handled-slash-tuples.ts`)
 *     covers the same drift class for `/foo bar` invocations.
 *   - That dryrun runs in a fresh CI shell with no `DATABASE_URL`, no
 *     Discord secrets, no storage setup. The dispatchers themselves
 *     transitively pull in `server/storage`, `server/discord-bot`,
 *     etc., which all read env at module-load time. Keeping this
 *     catalog in a leaf module with zero project imports is what lets
 *     the validator import it from the dryrun path safely.
 *
 * Maintenance contract:
 *   - Adding a new component action requires: (a) appending the action
 *     to `HANDLED_COMPONENT_ACTIONS` here AND (b) wiring the actual
 *     `case` in `./components.ts`. The validator in
 *     `scripts/discord/register-discord-commands.ts` will fail the
 *     build if the catalog and the dispatcher disagree in either
 *     direction, OR if no card / notification builder ever emits the
 *     corresponding `custom_id`.
 *   - Same contract for modal-submit actions in `./modals.ts` against
 *     `HANDLED_MODAL_ACTIONS`.
 */

/**
 * Component (button / select menu) action names the dispatcher in
 * `./components.ts` recognises. The full custom_id that arrives from
 * Discord has the shape `agenda:<action>:<bookingId>` — this catalog
 * lists the `<action>` slot.
 *
 * Keep in lockstep with the `switch (action)` in `./components.ts` and
 * the `mkBtn(...)` calls / select menus in
 * `server/discord.ts > bookingActionRows`.
 */
export const HANDLED_COMPONENT_ACTIONS: ReadonlyArray<string> = [
  // Booking state mutations (buttons row):
  "cancel",
  "confirm",
  "noshow",
  "reschedule",
  // String select menu (manual email dispatch):
  "email_select",
];

/**
 * Modal-submit action names the dispatcher in `./modals.ts`
 * recognises. The full custom_id that arrives from Discord has the
 * shape `agenda:<action>:<bookingId>` — this catalog lists the
 * `<action>` slot.
 *
 * Keep in lockstep with the `parts[1] !== "..."` guard in
 * `./modals.ts` and the `custom_id: \`agenda:<action>:...\`` literal
 * inside the MODAL response in `./components.ts`.
 */
export const HANDLED_MODAL_ACTIONS: ReadonlyArray<string> = [
  "reschedule_modal",
];

const HANDLED_COMPONENT_SET: ReadonlySet<string> = new Set(HANDLED_COMPONENT_ACTIONS);
const HANDLED_MODAL_SET: ReadonlySet<string> = new Set(HANDLED_MODAL_ACTIONS);

/** Returns true iff the component dispatcher has a branch for this action. */
export function canHandleComponentAction(action: string): boolean {
  return HANDLED_COMPONENT_SET.has(action);
}

/** Returns true iff the modal dispatcher has a branch for this action. */
export function canHandleModalAction(action: string): boolean {
  return HANDLED_MODAL_SET.has(action);
}

// ─── Source-file map (for the CI gate) ──────────────────────────────────────

/**
 * Repo-relative paths to the dispatcher source files whose case /
 * guard branches the validator scans. We deliberately read these as
 * text rather than importing them — the dispatchers transitively pull
 * in `server/storage`, `server/discord-bot`, etc., which require
 * `DATABASE_URL` at module-load time and would crash the dryrun CI
 * shell. Static text scanning is coarser, but it gives us the
 * executable-branch view without breaking the dryrun's
 * dependency-free contract documented at the top of this file.
 */
export const COMPONENT_DISPATCHER_SOURCE =
  "exentax-web/server/discord/handlers/components.ts";
export const MODAL_DISPATCHER_SOURCE =
  "exentax-web/server/discord/handlers/modals.ts";

/**
 * Repo-relative paths to every source file that BUILDS Discord
 * components (buttons / select menus / modal triggers) whose
 * `custom_id`s the dispatchers above must recognise. The validator
 * scans each file for `agenda:<literal>` template-literal emissions
 * AND for any helper-call regex listed under `EMITTER_HELPER_REGEXES`.
 *
 * The two emitters today are:
 *   - `server/discord.ts` — `bookingActionRows()` builds the standard
 *     button row (via the local `mkBtn(...)` helper) and the email
 *     select menu attached to every booking notification.
 *   - `server/discord/handlers/components.ts` — opens the reschedule
 *     modal in response to the "reschedule" button click; the modal's
 *     own `custom_id` is `agenda:reschedule_modal:<id>`.
 *
 * If a future change adds a new card builder, list its source path
 * here so the gate sees its `custom_id`s.
 */
export const COMPONENT_EMITTER_SOURCES: ReadonlyArray<string> = [
  "exentax-web/server/discord.ts",
  "exentax-web/server/discord/handlers/components.ts",
];

/**
 * Per-file extra regexes for source files that emit `custom_id`s via a
 * local helper that template-literalises the action verb (so the
 * verb itself never appears as a literal string adjacent to the
 * `agenda:` prefix). The first capture group of each regex must be
 * the action name.
 *
 * Keyed by repo-relative source path so a new helper in a different
 * file does not accidentally match unrelated function calls
 * elsewhere.
 *
 * Today only `bookingActionRows()` in `server/discord.ts` uses such a
 * helper (`mkBtn(verb, label, style)` → `custom_id:
 * \`agenda:${verb}:${id}\``). Adding any new helper requires
 * registering its call shape here.
 */
export const EMITTER_HELPER_REGEXES: Readonly<Record<string, ReadonlyArray<RegExp>>> = {
  "exentax-web/server/discord.ts": [
    // mkBtn("verb", ...) — first arg of the local button factory.
    /\bmkBtn\(\s*"([a-z0-9_-]+)"/g,
  ],
};

// ─── Static extractors ──────────────────────────────────────────────────────

/**
 * Extract the set of `custom_id` action names emitted by a source
 * file. Looks for two shapes:
 *
 *   1. Literal template-literal emissions: `agenda:<action>:` or
 *      `agenda:<action>` at end of string. This catches direct
 *      `custom_id: \`agenda:email_select:${id}\`` style code.
 *   2. Per-file helper calls listed in `EMITTER_HELPER_REGEXES`,
 *      whose first capture group is the action name.
 *
 * Pure text in / set out — no `fs`, no imports — so callers (CI
 * dryrun, focused tests) can feed it source they read however they
 * prefer without dragging in `node:fs` here and breaking the
 * leaf-module contract documented at the top of this file.
 */
export function extractEmittedCustomIdActions(
  source: string,
  helperRegexes: ReadonlyArray<RegExp> = [],
): Set<string> {
  const found = new Set<string>();
  // `agenda:<action>:` (followed by another segment) OR `agenda:<action>`
  // at a clean word boundary. The action charset matches Discord's own
  // custom_id charset constraints (lowercase letters, digits, '-', '_')
  // so we do not accidentally pick up nearby identifiers.
  const literalRe = /\bagenda:([a-z0-9_-]+)(?=[:`'"\s)\\])/g;
  for (const m of source.matchAll(literalRe)) found.add(m[1]);
  // RegExp.matchAll requires the /g flag — caller-supplied regexes
  // should already have it, but reset .lastIndex defensively.
  for (const re of helperRegexes) {
    re.lastIndex = 0;
    for (const m of source.matchAll(re)) {
      if (m[1]) found.add(m[1]);
    }
  }
  return found;
}

/**
 * Extract the set of `custom_id` action names the component
 * dispatcher (`./components.ts`) recognises by static text scanning
 * of its source. Recognises `case "name":` branches — the only style
 * in use today.
 *
 * Same pure-text contract as `extractEmittedCustomIdActions` above:
 * no `fs`, no imports.
 */
export function extractDispatcherActionsFromComponentSource(source: string): Set<string> {
  const found = new Set<string>();
  const caseRe = /\bcase\s+"([a-z0-9_-]+)"\s*:/g;
  for (const m of source.matchAll(caseRe)) found.add(m[1]);
  return found;
}

/**
 * Extract the set of modal-submit action names the modal dispatcher
 * (`./modals.ts`) recognises by static text scanning of its source.
 *
 * Today the dispatcher uses guard-style checks (`parts[1] !== "name"`
 * → reject; `parts[1] === "name"` → accept). The extractor matches
 * both forms so a future refactor to a `switch` statement or to
 * additional modals would also be picked up — the latter is also
 * caught by the existing `case "name":` regex.
 *
 * Same pure-text contract as the other extractors above.
 */
export function extractDispatcherActionsFromModalSource(source: string): Set<string> {
  const found = new Set<string>();
  const caseRe = /\bcase\s+"([a-z0-9_-]+)"\s*:/g;
  for (const m of source.matchAll(caseRe)) found.add(m[1]);
  // parts[1] === "name"  /  parts[1] !== "name". Tolerates spaces and
  // either single or double quotes around the literal.
  const guardRe = /\bparts\s*\[\s*1\s*\]\s*(?:===|!==)\s*["']([a-z0-9_-]+)["']/g;
  for (const m of source.matchAll(guardRe)) found.add(m[1]);
  return found;
}
