# Archived orphan scripts — April 2026

Date archived: **2026-04-26** (PENDING.md §15 cleanup).

These two scripts were detected as **orphans** during the manual scan in
session 2026-04-26: zero references from `package.json`, no callers from
other scripts, no GitHub workflow wiring, no docs referencing them. They
were one-off / diagnostic auditors that have already done their job and
are not part of any current pipeline.

They are **archived rather than deleted** so they can be re-used as
diagnostic tools if needed (project rule: only delete with high
confidence). Restore by `git mv` back to `scripts/` if a use case
re-emerges.

## Reproduce the zero-reference check

```bash
for s in blog-i18n-sync-check audit-markdown-quality; do
  refs=$(grep -rl --include="*.json" --include="*.mjs" --include="*.ts" --include="*.sh" "$s" exentax-web 2>/dev/null \
    | grep -v "^exentax-web/scripts/$s" \
    | grep -v node_modules \
    | wc -l)
  echo "$refs $s"
done
# Expected output (2026-04-26):
# 0 blog-i18n-sync-check
# 0 audit-markdown-quality
```

## Inventory

| Script                          | Why archived                                                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blog-i18n-sync-check.mjs`      | One-off auditor that compared blog i18n parity across 6 idiomas. Zero references in `package.json`, scripts, workflows o docs. Kept for ad-hoc diagnostic re-use.             |
| `audit-markdown-quality.mjs`    | One-off Markdown quality auditor. Only self-references found; no `package.json` script entry, no caller. Kept for ad-hoc diagnostic re-use.                                   |

## Note about the parent archive README

The parent `scripts/archive/2026-04/README.md` still mentions
`blog-i18n-sync-check.mjs` as a "reusable auditor" that lives under
`scripts/`. That note is now historical: the script proved unused at the
2026-04-26 audit and has been moved here. If the parent README is touched
again, update that mention accordingly.
