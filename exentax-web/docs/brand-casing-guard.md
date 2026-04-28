# Brand-casing guard (Task #29)

The brand is spelled **Exentax** — capital `E`, everything else lowercase.
The earlier wrong-cased form (capital `E` plus capital `T` in the middle —
written here as `Exen` + `Tax` so this doc itself stays clean) was scrubbed
from the codebase in Task #27, but nothing prevented it from creeping back.
This guard does.

## What it checks

`scripts/audit/brand-casing-check.mjs` walks the following directories and fails
if any file contains the forbidden form (capital `E` + capital `T` in the
middle of the brand):

- `exentax-web/client/`
- `exentax-web/server/`
- `exentax-web/shared/`
- `exentax-web/scripts/`
- `exentax-web/docs/`
- `docs/` (repo root)

It skips `node_modules/`, `dist/`, `.git/`, `.cache/`, `.local/`, and the
`scripts/archive/` folder so historical snapshots do not block the build.

## How to run

```bash
npm run lint:brand-casing
```

It is also wired into `npm run check`, so CI fails on regressions.

## Allow-list

There are currently **zero** intentional occurrences. If a future case
genuinely needs the wrong casing (e.g. quoting an external article
verbatim), add the file's repo-relative path to the `ALLOWLIST` `Set`
near the top of `scripts/audit/brand-casing-check.mjs` and leave a comment
explaining why. Keep the list as short as possible — prefer rewording
over allow-listing whenever possible.
