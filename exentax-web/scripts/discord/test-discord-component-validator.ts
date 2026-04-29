/**
 * Regression test for `validateComponentCustomIdsAgainstDispatcher()`
 * in `register-discord-commands.ts` (added in task #81).
 *
 * The live codebase happens to be in lockstep, so the CI dryrun
 * (`scripts/discord/register-discord-commands.ts --dry-run`) only
 * proves that the validator returns *zero* errors on the real
 * source files. It does not prove that the validator still catches
 * the four drift classes a developer can introduce by editing the
 * dispatcher, the catalog, or a notification builder out of sync:
 *
 *   1. Card emits a custom_id no dispatcher handles
 *      (production click → "interaction failed").
 *   2. Dispatcher branch is dead — no card produces that custom_id.
 *   3. Catalog declares an action with no dispatcher branch.
 *   4. Catalog declares an action with no emitter (dead surface).
 *
 * This file feeds the validator an in-memory `readSource()` map of
 * hand-crafted "good" and broken sources and asserts the
 * human-readable error strings it returns. If a future change
 * accidentally weakens the validator (e.g. broadening the action
 * regex, swallowing one of the four directions) the corresponding
 * case below stops triggering and the test fails — long before the
 * relaxed rule lets a broken Discord button reach production.
 *
 * Run: `npx tsx scripts/discord/test-discord-component-validator.ts`
 *      (also wired into `scripts/discord/run-regression.mjs` and
 *      therefore `npm run test:discord-regression`).
 */

import { validateComponentCustomIdsAgainstDispatcher } from "./register-discord-commands";
import {
  HANDLED_COMPONENT_ACTIONS, HANDLED_MODAL_ACTIONS,
  COMPONENT_DISPATCHER_SOURCE, MODAL_DISPATCHER_SOURCE,
  COMPONENT_EMITTER_SOURCES,
} from "../../server/discord/handlers/handled-component-customids";

interface Case {
  label: string;
  // Override per-file source the validator will see. Any path NOT
  // listed falls back to the default valid stub below so each case
  // exercises ONE drift in isolation. Keeping defaults sane mirrors
  // how `test-discord-manifest-validator.ts` keeps a single
  // template per shape.
  sources: Record<string, string>;
  // Each entry must be a substring of *some* error in the returned
  // list. Substring matching (rather than equality) means tightening
  // an error message later does not force a brittle multi-line edit
  // here — the test still asserts the *intent* of the check is
  // unchanged.
  expectErrorSubstrings: string[];
  // When set, also assert the validator returned exactly this many
  // errors (used for the "good sources" case to make sure we don't
  // accidentally start over-reporting).
  expectExactErrorCount?: number;
}

// ─── Default sources ────────────────────────────────────────────────────────
// Stubs that match the live catalog: every catalog action has a
// dispatcher branch AND an emitter. Cases below override one file at
// a time to exercise a single drift class.

function defaultComponentDispatcherSrc(): string {
  // Mirror the real `switch (action) { case "name": ... }` shape so
  // `extractDispatcherActionsFromComponentSource` picks it up
  // exactly the way it picks up the live source.
  const cases = HANDLED_COMPONENT_ACTIONS.map((a) => `    case "${a}": return;`).join("\n");
  return `
    function dispatch(action: string) {
      switch (action) {
${cases}
        default: return;
      }
    }
  `;
}

function defaultModalDispatcherSrc(): string {
  // Mirror the real guard-style check (`parts[1] !== "name"`) so
  // `extractDispatcherActionsFromModalSource` picks it up.
  const guards = HANDLED_MODAL_ACTIONS.map(
    (a) => `      if (parts[1] !== "${a}") { /* reject */ }`,
  ).join("\n");
  return `
    function dispatchModal(parts: string[]) {
${guards}
    }
  `;
}

function defaultDiscordTsSrc(): string {
  // Two emission shapes the live `server/discord.ts` uses:
  //   - `mkBtn("verb", ...)` for the four booking buttons
  //   - `custom_id: \`agenda:email_select:${id}\`` for the select menu
  // The catalog covers all five actions; this stub emits all five so
  // direction D ("catalog entry has no emitter") does not fire by
  // accident.
  const buttonVerbs = ["confirm", "reschedule", "cancel", "noshow"];
  const mkBtns = buttonVerbs.map((v) => `      mkBtn("${v}", "L", 1),`).join("\n");
  return `
    function bookingActionRows(id: string) {
      return [
        { type: 1, components: [
${mkBtns}
        ] },
        { type: 1, components: [
          { type: 3, custom_id: \`agenda:email_select:\${id}\` },
        ] },
      ];
    }
  `;
}

function defaultComponentsTsEmitterSrc(): string {
  // `components.ts` is itself an emitter — it opens the reschedule
  // modal in response to the "reschedule" button click — AND a
  // dispatcher (the same case branches as defaultComponentDispatcherSrc).
  // Combine both shapes so neither direction fires by accident.
  const cases = HANDLED_COMPONENT_ACTIONS.map((a) => `    case "${a}": return;`).join("\n");
  return `
    function dispatch(action: string, id: string) {
      switch (action) {
${cases}
      }
      // Modal opener:
      const _modal = { custom_id: \`agenda:reschedule_modal:\${id}\` };
    }
  `;
}

function defaults(): Record<string, string> {
  return {
    [COMPONENT_DISPATCHER_SOURCE]: defaultComponentsTsEmitterSrc(),
    [MODAL_DISPATCHER_SOURCE]: defaultModalDispatcherSrc(),
    "exentax-web/server/discord.ts": defaultDiscordTsSrc(),
  };
}

// Sanity assertion: the defaults must cover every emitter source
// listed by the catalog, so a typo in `COMPONENT_EMITTER_SOURCES`
// would not silently turn a real emission into a missing-file error
// the wrong way around.
for (const p of COMPONENT_EMITTER_SOURCES) {
  if (!(p in defaults())) {
    console.error(
      `❌ Test bug: COMPONENT_EMITTER_SOURCES lists ${p} but ` +
      `defaults() has no stub for it. Add a stub or update this test.`,
    );
    process.exit(2);
  }
}

function runCase(c: Case): boolean {
  const merged = { ...defaults(), ...c.sources };
  const errors = validateComponentCustomIdsAgainstDispatcher((rel) => {
    if (rel in merged) return merged[rel];
    throw new Error(`unexpected readSource(${rel}) in test`);
  });
  const missing = c.expectErrorSubstrings.filter(
    (needle) => !errors.some((e) => e.includes(needle)),
  );
  const exactMismatch =
    typeof c.expectExactErrorCount === "number" &&
    errors.length !== c.expectExactErrorCount;

  if (missing.length === 0 && !exactMismatch) {
    console.log(`  PASS  ${c.label}`);
    return true;
  }
  console.error(`  FAIL  ${c.label}`);
  if (missing.length > 0) {
    console.error(`    expected error substrings not found:`);
    for (const m of missing) console.error(`      • ${JSON.stringify(m)}`);
  }
  if (exactMismatch) {
    console.error(
      `    expected exactly ${c.expectExactErrorCount} error(s), got ${errors.length}`,
    );
  }
  console.error(`    actual errors (${errors.length}):`);
  for (const e of errors) console.error(`      • ${e}`);
  return false;
}

const CASES: Case[] = [
  {
    label: "good sources match catalog and emit every action",
    sources: {},
    expectErrorSubstrings: [],
    expectExactErrorCount: 0,
  },

  // Direction A: card emits a custom_id no dispatcher handles.
  {
    label: "emitter ships custom_id with no matching dispatcher branch",
    sources: {
      "exentax-web/server/discord.ts":
        defaultDiscordTsSrc() +
        `\n      const _orphan = { custom_id: \`agenda:bogus:\${id}\` };\n`,
    },
    expectErrorSubstrings: [
      "emits `agenda:bogus:…` as a Discord custom_id but neither HANDLED_COMPONENT_ACTIONS nor HANDLED_MODAL_ACTIONS lists it",
      "interaction failed",
    ],
  },

  // Direction B: dispatcher branch is dead (catalog still in sync,
  // but no emitter produces it). We add a fake catalog action by
  // putting an extra `case` AND extra emission for it — except the
  // extra `case` is for an action the real catalog does NOT list, so
  // the validator should catch it as "branch but not in catalog".
  {
    label: "component dispatcher has a case branch the catalog does not list",
    sources: {
      [COMPONENT_DISPATCHER_SOURCE]:
        defaultComponentsTsEmitterSrc() +
        `\n    function _extra(action: string) { switch (action) { case "ghost": return; } }\n`,
    },
    expectErrorSubstrings: [
      "Component dispatcher exentax-web/server/discord/handlers/components.ts has a branch for `agenda:ghost:…`",
      "HANDLED_COMPONENT_ACTIONS does not list it",
    ],
  },

  // Direction C-1: catalog declares an action with no dispatcher branch.
  // We drop the "noshow" case from the dispatcher source to simulate
  // the developer who removed the switch arm but forgot the catalog.
  {
    label: "catalog claims an action the component dispatcher has no branch for",
    sources: {
      [COMPONENT_DISPATCHER_SOURCE]:
        defaultComponentsTsEmitterSrc().replace(
          `    case "noshow": return;`,
          "",
        ),
    },
    expectErrorSubstrings: [
      "HANDLED_COMPONENT_ACTIONS claims `agenda:noshow:…` is handled but exentax-web/server/discord/handlers/components.ts has no `case \"noshow\":` branch",
    ],
  },

  // Direction C-2: same drift, modal side. The modal dispatcher uses
  // guard-style `parts[1] !== "name"` checks, so we strip the
  // `reschedule_modal` guard out and assert the validator notices
  // either case-style OR guard-style is missing.
  {
    label: "catalog claims a modal action the modal dispatcher has no guard for",
    sources: {
      [MODAL_DISPATCHER_SOURCE]: `
        function dispatchModal(_parts: string[]) {
          // intentionally empty — no guard for the catalog action
        }
      `,
    },
    expectErrorSubstrings: [
      "HANDLED_MODAL_ACTIONS claims `agenda:reschedule_modal:…` is handled but exentax-web/server/discord/handlers/modals.ts has no matching guard branch",
    ],
  },

  // Direction D-1: catalog action no emitter produces. We strip the
  // `mkBtn("cancel", ...)` line out of the discord.ts stub. Catalog
  // and dispatcher still list "cancel", but no card emits it, so the
  // dispatcher branch is dead — exactly the "card removed but
  // handler lingered" drift the task calls out.
  {
    label: "component catalog action is no longer emitted by any card",
    sources: {
      "exentax-web/server/discord.ts":
        defaultDiscordTsSrc().replace(
          `      mkBtn("cancel", "L", 1),`,
          "",
        ),
    },
    expectErrorSubstrings: [
      "HANDLED_COMPONENT_ACTIONS lists `cancel` but no emitter",
      "produces an `agenda:cancel:…` custom_id",
    ],
  },

  // Direction D-2: same drift, modal side. The reschedule modal is
  // opened by `components.ts` itself, so we drop that emission.
  {
    label: "modal catalog action is no longer emitted by any opener",
    sources: {
      [COMPONENT_DISPATCHER_SOURCE]: defaultComponentsTsEmitterSrc().replace(
        "const _modal = { custom_id: `agenda:reschedule_modal:${id}` };",
        "",
      ),
    },
    expectErrorSubstrings: [
      "HANDLED_MODAL_ACTIONS lists `reschedule_modal` but no emitter",
      "produces an `agenda:reschedule_modal:…` custom_id",
    ],
  },

  // Edge case: the dispatcher source file is missing entirely. The
  // validator must surface that as a hard error rather than
  // silently letting drift slip past.
  {
    label: "missing component dispatcher source is reported as a hard error",
    sources: {
      [COMPONENT_DISPATCHER_SOURCE]: "__THROW__",
    },
    expectErrorSubstrings: [
      "Cannot read component dispatcher source",
    ],
  },
];

// Special-case the __THROW__ sentinel so we can exercise the
// readSource()-failure branch without coupling the test harness to
// a real fs error message.
const realRunCase = runCase;
function patchedRunCase(c: Case): boolean {
  const merged = { ...defaults(), ...c.sources };
  const sentinelPaths = Object.entries(merged)
    .filter(([, v]) => v === "__THROW__")
    .map(([k]) => k);
  if (sentinelPaths.length === 0) return realRunCase(c);

  const errors = validateComponentCustomIdsAgainstDispatcher((rel) => {
    if (sentinelPaths.includes(rel)) {
      throw new Error(`ENOENT: no such file or directory, open '${rel}'`);
    }
    if (rel in merged) return merged[rel];
    throw new Error(`unexpected readSource(${rel}) in test`);
  });
  const missing = c.expectErrorSubstrings.filter(
    (needle) => !errors.some((e) => e.includes(needle)),
  );
  if (missing.length === 0) {
    console.log(`  PASS  ${c.label}`);
    return true;
  }
  console.error(`  FAIL  ${c.label}`);
  console.error(`    expected error substrings not found:`);
  for (const m of missing) console.error(`      • ${JSON.stringify(m)}`);
  console.error(`    actual errors (${errors.length}):`);
  for (const e of errors) console.error(`      • ${e}`);
  return false;
}

let failed = 0;
for (const c of CASES) {
  if (!patchedRunCase(c)) failed += 1;
}

if (failed > 0) {
  console.error(
    `\n❌ Discord component validator regression: ${failed}/${CASES.length} case(s) failed.`,
  );
  process.exit(1);
}

console.log(
  `\n✅ Discord component validator regression OK — ${CASES.length}/${CASES.length} case(s) passed.`,
);
process.exit(0);
