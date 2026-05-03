# Email snapshots

Static HTML previews of every transactional + nurture email template
the app sends, rendered for every supported language. They are a
**manual review tool** — reviewers can eyeball typography, line-breaks,
CTA contrast, and chrome layout without sending real mail or booting
the dev server.

The CI gate companion (Task #77) lives at
`tests/email-snapshot-regression.test.ts` — it re-renders the same 12 ×
6 = 72 combinations and diffs the HTML against committed baselines
under `tests/__snapshots__/email/`. Both consumers share the same
fixtures + render pipeline (`scripts/email/fixtures.ts`) so the manual
snapshots and the CI baselines never drift apart.

## How to regenerate

From the `exentax-web/` package root:

```bash
npm run email:snapshots
```

The script (`scripts/email/render-all-snapshots.ts`) wipes only the
generated `*.html` and `*.txt` files (and `index.html`) inside this
directory, then rewrites them. **This `README.md` is preserved across
runs.** Open `index.html` afterwards for a per-language matrix of
links into each rendered combination.

## Updating the CI baselines

When you intentionally change email layout, copy, or chrome, the
regression test in `check:serial` will fail. Refresh the committed
baselines with:

```bash
UPDATE_SNAPSHOTS=1 npm run test:email-snapshot-regression
```

Inspect the resulting `git diff tests/__snapshots__/email/` carefully
— that diff **is** the visual change. Commit the baseline updates
alongside the source change in the same PR so reviewers see both.
Stale baselines (templates removed) are deleted automatically; new
templates added to `scripts/email/fixtures.ts` get fresh baselines on
the same command.

## When to re-run

- After editing copy in any `server/email-i18n/{lang}.ts` bundle.
- After touching the layout helpers in `server/email-layout.ts`
  (chrome, signature, footer, colours).
- After adding or removing a template under `server/email/`.
- Before merging a PR that the SEO/email reviewer needs to eyeball.

## What's in the box

Per regeneration: **12 templates × 6 languages = 72 HTML files** plus
72 plain-text counterparts plus an `index.html` manifest. Each
HTML file has a sibling `.txt` (same basename) so reviewers can also
spot-check what a non-HTML mail client (or a screen reader without
CSS) would surface.

The 12 templates:

| # | Slug | Source module |
|---|---|---|
| 1 | `booking-confirmation` | `server/email/booking-confirmation.ts` |
| 2 | `booking-reminder` | `server/email/booking-reminder.ts` (HTML body only — the .ics attachment is omitted from the snapshot since it is an opaque calendar payload) |
| 3 | `reschedule-confirmation` | `server/email/reschedule.ts` |
| 4 | `cancellation` | `server/email/cancellation.ts` |
| 5 | `no-show-reschedule` | `server/email/no-show.ts` |
| 6 | `post-meeting-followup` | `server/email/post-meeting.ts` |
| 7 | `incomplete-booking` | `server/email/incomplete-booking.ts` |
| 8 | `calculator-result` | `server/email/calculator.ts` |
| 9 | `drip` | `server/email/drip.ts` (step 1 — lead-magnet delivery) |
| 10 | `calc-drip` | `server/email/calc-drip.ts` (step 1 — calculator nurture day 1) |
| 11 | `newsletter` | `server/email/newsletter.ts` (representative campaign body) |
| 12 | `drip-final` | `server/email/drip.ts` (step 6 — final nurture touch) |

The drip series has 6 steps and the calc-drip series has 3, all
sharing the same chrome and footer; we render step 1 + the drip final
touch as the layout-distinct representatives. To preview the
intermediate steps locally, change the `step:` value in
`scripts/email/render-all-snapshots.ts` and re-run.

Languages: `es`, `en`, `fr`, `de`, `pt`, `ca` — the full
`SupportedLang` set from `server/server-constants.ts`.

## Why the rendered files are not committed

The HTML / TXT snapshots are derived artifacts — they regenerate
deterministically from the template + i18n source. Committing them
would cause noisy diffs on every copy tweak and tempt reviewers to
read the snapshot instead of the source. The directory is ignored
via the repo-wide `reports/*` ignore rule; only this README ships
(see `exentax-web/.gitignore` for the explicit re-include).

## Fixture data

All recipient names, dates, calculator numbers, agenda IDs, phone
numbers and emails in the snapshots are fixtures (e.g.
`fixture-recipient@example.com`, `+34 600 000 000`,
`agd_snap_0001`). They are obvious enough that any audit script
flagging real PII would catch a leak immediately if a snapshot ever
escaped into a live test path. See `scripts/email/fixtures.ts` for the
full fixture set (shared between this manual tool and the CI
regression test).
