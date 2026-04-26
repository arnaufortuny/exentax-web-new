# Git history notes — closed PRs #1-#9

Date: 2026-04-26 · Maintainer: Exentax web team

## 1. Context

Branch `main` was **squash-merged** from a long-running working
branch during the early development of this repository. The squash
collapsed the commit graph that the original PRs #1 through #9
referenced, so the commit pointers in those PRs are now **dead**:
clicking the SHA on the PR page returns "this commit does not
belong to any branch on this repository". The PRs themselves remain
visible on GitHub as `closed`, with their original titles and
descriptions; only the underlying commit objects are gone.

This is expected behaviour after a squash merge — git's
reachability rules garbage-collect orphaned commits — and not a
sign of repository corruption or lost work. The actual changes
delivered by PRs #1-#9 are present in the repository tree as part
of the single squash commit on `main` that opened the current
linear history.

## 2. Action taken

**No GitHub comments will be posted on PRs #1-#9.** This follows
the project's frugal-policy on metadata churn: we do not write
explanatory comments on dozens of historical artefacts when a
single in-repo note (this file) covers the same ground. The
**repo is the source of truth via the squash commit on `main`**;
PR #1-#9 metadata stays as a historical log of intent and review
discussion, with the understanding that the SHAs they reference
are no longer resolvable.

If a future contributor asks "where did the work from PR #N go?",
the answer is: it landed in the squash commit that opened `main`,
together with the work from every other PR in the #1-#9 range.

## 3. For future contributors

When in doubt about a referenced commit hash that no longer
resolves, **search the squashed history by keyword instead of
clicking the PR link**:

```
git log --all --grep='<keyword>'
git log --all --oneline -S '<exact code snippet>'   # pickaxe
git log --all --follow -- path/to/file              # file history across renames
```

For the specific case of PRs #1-#9, the `--grep` and pickaxe
approaches will surface the squash commit that contains the
relevant change. Do not attempt to `git show <dead-sha>` from a
PR page — it will return `fatal: bad object` and is expected.

If you need the original review discussion for PR #N, GitHub
preserves the full thread on the PR page itself (comments, review
remarks, CI logs) — only the commit objects are gone.
