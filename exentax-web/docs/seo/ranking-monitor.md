# SEO ranking monitor

Closes the loop on the keyword strategy in [`keyword-map.md`](./keyword-map.md): every article × language pair has a resolvable primary keyword, and we record its Google position week over week so a regression surfaces as an alert instead of a surprise.

## What the script does

`scripts/seo/check-rankings.ts` builds one `(slug, lang, keyword, pageUrl)` row per article × language by:

1. Reading `BLOG_POSTS` (Spanish source of truth) and `BLOG_I18N` (translations).
2. Using the translated slug from `BLOG_SLUG_I18N` for the page URL.
3. Choosing the primary keyword in this order:
   - explicit entry in `scripts/seo/keyword-overrides.json` (pulled from `keyword-map.md`);
   - otherwise the title phrase before the first colon, lowercased, with the `| Exentax` suffix stripped.

Then it queries Google Search Console for the last N days (`--days=7` by default), filters to that exact query + the article URL, and writes a CSV snapshot.

## Running it

```bash
# Mock mode — no credentials needed. Produces a deterministic baseline, useful in CI.
tsx scripts/seo/check-rankings.ts --source=mock

# Real data from Google Search Console.
export GSC_SITE_URL="sc-domain:exentax.com"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
# or: export GSC_SERVICE_ACCOUNT_JSON='{...}'
tsx scripts/seo/check-rankings.ts --source=gsc --days=7 --alert-drop=5
```

Flags:

| Flag | Default | Meaning |
|------|---------|---------|
| `--source` | `gsc` | `gsc` (real) or `mock` (deterministic fixture) |
| `--days` | `7` | Search Analytics window, ending yesterday |
| `--alert-drop` | `5` | Emit alert when position worsens by at least this many slots vs the previous snapshot |
| `--limit` | _none_ | Cap the number of keywords for a fast smoke run |

The `googleapis` package is already a dependency (see `server/google-meet.ts`), so no install is needed.

## Google Search Console setup

1. Create a service account in Google Cloud. Add the JSON key to the repo environment as `GSC_SERVICE_ACCOUNT_JSON`, or mount a file and point `GOOGLE_APPLICATION_CREDENTIALS` at it.
2. In Search Console → Settings → Users and permissions, add the service account email with **Restricted** access.
3. `GSC_SITE_URL` should match exactly how the property is registered. For a Domain property use `sc-domain:exentax.com`; for a URL-prefix property use the full URL including the trailing slash.

## Output

```
seo-rankings/
  2026-04-16.csv        snapshot written today
  2026-04-09.csv        previous week's snapshot
  latest.csv            copy of the most recent snapshot
  alerts-2026-04-16.txt only present when at least one article dropped ≥ threshold
```

CSV columns: `date, slug, lang, keyword, page_url, impressions, clicks, ctr, position, has_data`.

Weekly diff logic: for every `(slug, lang)` pair with data in both snapshots, alert when `position_today − position_previous >= --alert-drop`. Higher position numbers are worse, so a drop from 8 → 14 is a 6-slot loss.

## Scheduling

Any weekly scheduler works. A minimal cron entry on a box with the credentials mounted:

```
# Mondays 07:00 UTC
0 7 * * 1 cd /opt/exentax-web && tsx scripts/seo/check-rankings.ts --source=gsc >> logs/seo-rankings.log 2>&1
```

For Replit Deployments, add a Scheduled Deployment that runs the same command; pipe the alerts file into Slack or email as a follow-up.

## Adjusting which keyword an article targets

Edit `scripts/seo/keyword-overrides.json`:

```json
{
  "form-5472-que-es-como-presentarlo": {
    "en": "form 5472 filing requirements",
    "de": "form 5472 deutsch"
  }
}
```

Keep these aligned with `keyword-map.md` so both docs tell the same story.
