/**
 * Regression test for `validateSlashCommandManifest()` in
 * `register-discord-commands.ts` (added in task #76).
 *
 * The live manifest happens to be valid, so the CI dry-run case
 * (`scripts/discord/register-discord-commands.ts --dry-run`) only
 * proves that the validator returns *zero* errors on the current
 * payload. It does not prove that the validator still catches the
 * mistakes Discord would reject at publish time.
 *
 * This file feeds the validator hand-crafted "good" and broken
 * manifests and asserts the human-readable error strings it
 * returns. If a future change accidentally weakens the validator
 * (e.g. swallowing an option-type check, broadening the name
 * regex, dropping the "subcommand vs value option" mix check),
 * the corresponding case below stops triggering and the test
 * fails — long before the relaxed rule lets a malformed manifest
 * reach Discord.
 *
 * Run: `npx tsx scripts/discord/test-discord-manifest-validator.ts`
 *      (also wired into `scripts/discord/run-regression.mjs` and
 *      therefore `npm run test:discord-regression`).
 */

import { validateSlashCommandManifest } from "./register-discord-commands";

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

interface Case {
  label: string;
  manifest: unknown;
  // Each entry must be a substring of *some* error in the returned list.
  // Keeping these as substrings (rather than equality checks) means
  // tightening an error message in the future doesn't force a brittle
  // multi-line edit here — the test still asserts the *intent* of the
  // check is unchanged.
  expectErrorSubstrings: string[];
  // When true, also assert the validator returned no errors beyond the
  // expected ones (used for the "good manifest" case to make sure we
  // don't accidentally start over-reporting).
  expectExactErrorCount?: number;
}

// A minimally-valid command we can mutate per case. Keeping a single
// template per shape avoids accidentally introducing a *second* defect
// in a case meant to exercise only one rule.
function goodSimpleCommand(): CommandLike {
  return {
    name: "ping",
    description: "Health check",
    options: [
      { type: 3, name: "note", description: "Optional note" },
    ],
  };
}

function goodParentWithSubcommands(): CommandLike {
  return {
    name: "cita",
    description: "Manage bookings",
    options: [
      {
        type: 1,
        name: "ver",
        description: "Show a booking",
        options: [
          { type: 3, name: "id", description: "Booking id", required: true },
        ],
      },
      {
        type: 1,
        name: "cancelar",
        description: "Cancel a booking",
        options: [
          { type: 3, name: "id", description: "Booking id", required: true },
        ],
      },
    ],
  };
}

function makeChoices(n: number): Array<{ name: string; value: string }> {
  const out: Array<{ name: string; value: string }> = [];
  for (let i = 0; i < n; i += 1) out.push({ name: `c${i}`, value: `v${i}` });
  return out;
}

const CASES: Case[] = [
  {
    label: "good manifest passes with zero errors",
    manifest: [goodSimpleCommand(), goodParentWithSubcommands()],
    expectErrorSubstrings: [],
    expectExactErrorCount: 0,
  },
  {
    label: "manifest is not an array",
    manifest: { not: "an array" },
    expectErrorSubstrings: ["Manifest is not an array"],
    expectExactErrorCount: 1,
  },
  {
    label: "duplicate top-level command name",
    manifest: [goodSimpleCommand(), goodSimpleCommand()],
    expectErrorSubstrings: [`Duplicate top-level command name "ping"`],
  },
  {
    label: "duplicate subcommand name within a parent",
    manifest: [
      {
        name: "cita",
        description: "Manage bookings",
        options: [
          { type: 1, name: "ver", description: "Show",   options: [] },
          { type: 1, name: "ver", description: "Show 2", options: [] },
        ],
      },
    ],
    expectErrorSubstrings: [`duplicate option name "ver"`],
  },
  {
    label: "command name longer than 32 chars",
    manifest: [
      {
        name: "a".repeat(33),
        description: "too long",
      },
    ],
    expectErrorSubstrings: ["is 33 chars (max 32)"],
  },
  {
    label: "command name with uppercase letters",
    manifest: [
      {
        name: "Ping",
        description: "uppercase",
      },
    ],
    expectErrorSubstrings: [`name "Ping" must be lowercase`],
  },
  {
    label: "command name with disallowed characters",
    manifest: [
      {
        name: "ping!",
        description: "bad charset",
      },
    ],
    // Charset failure also triggers the regex check; we just need to see
    // *some* charset complaint about this name.
    expectErrorSubstrings: [`name "ping!" does not match`],
  },
  {
    label: "invalid option type",
    manifest: [
      {
        name: "ping",
        description: "Health check",
        options: [
          { type: 99, name: "note", description: "Optional note" },
        ],
      },
    ],
    expectErrorSubstrings: ["invalid type 99"],
  },
  {
    label: "mixing subcommand options with regular value options at the same level",
    manifest: [
      {
        name: "mixed",
        description: "Bad mix",
        options: [
          { type: 1, name: "sub", description: "subcommand", options: [] },
          { type: 3, name: "stringopt", description: "value option" },
        ],
      },
    ],
    expectErrorSubstrings: [
      "cannot mix subcommand/group options with regular value options",
    ],
  },
  {
    label: "more than 25 choices on an option",
    manifest: [
      {
        name: "ping",
        description: "Health check",
        options: [
          {
            type: 3,
            name: "note",
            description: "Optional note",
            choices: makeChoices(26),
          },
        ],
      },
    ],
    expectErrorSubstrings: ["26 choices (max 25)"],
  },
  {
    label: "description longer than 100 chars",
    manifest: [
      {
        name: "ping",
        description: "x".repeat(101),
      },
    ],
    expectErrorSubstrings: ["description is 101 chars (max 100)"],
  },
  {
    label: "missing description on a command",
    manifest: [
      {
        name: "ping",
      },
    ],
    expectErrorSubstrings: ["description is missing or empty"],
  },
  {
    label: "duplicate choice value on an option",
    manifest: [
      {
        name: "ping",
        description: "Health check",
        options: [
          {
            type: 3,
            name: "mode",
            description: "Mode",
            choices: [
              { name: "alpha", value: "x" },
              { name: "beta",  value: "x" },
            ],
          },
        ],
      },
    ],
    expectErrorSubstrings: [`duplicate choice value "x"`],
  },
  {
    label: "more than 25 options on a (sub)command",
    manifest: [
      {
        name: "ping",
        description: "Health check",
        options: Array.from({ length: 26 }, (_, i) => ({
          type: 3,
          name: `opt${i}`,
          description: "x",
        })),
      },
    ],
    expectErrorSubstrings: ["26 options (max 25)"],
  },
];

let failed = 0;
for (const c of CASES) {
  const errors = validateSlashCommandManifest(c.manifest as readonly CommandLike[]);
  const missing = c.expectErrorSubstrings.filter(
    (needle) => !errors.some((e) => e.includes(needle)),
  );
  const exactMismatch =
    typeof c.expectExactErrorCount === "number" &&
    errors.length !== c.expectExactErrorCount;

  if (missing.length === 0 && !exactMismatch) {
    console.log(`  PASS  ${c.label}`);
    continue;
  }

  failed += 1;
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
}

if (failed > 0) {
  console.error(`\n❌ Slash-command validator regression: ${failed}/${CASES.length} case(s) failed.`);
  process.exit(1);
}

console.log(
  `\n✅ Slash-command validator regression OK — ${CASES.length}/${CASES.length} case(s) passed.`,
);
process.exit(0);
