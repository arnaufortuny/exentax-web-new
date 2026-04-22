# URL slash policy

Canonical rule for every public URL on exentax.com:

- **No trailing slash**, except the bare host root `https://exentax.com/`.
  - `/es`, `/es/blog`, `/es/blog/<slug>` are canonical.
  - `/es/`, `/es/blog/`, `/es/blog/<slug>/` are non-canonical and must not appear
    in any internal link, sitemap entry, canonical tag, hreflang alternate, or
    JSON-LD payload.
- **No double slashes** in the path. `//` is only legal as part of the
  scheme separator in absolute URLs (`https://`). Inside a path it is always
  a bug (typically a stray concatenation like `${base}/${path}` where one of
  the two already had a slash).
- **No duplicated language prefix.** Each path carries exactly one
  `/<lang>/` segment at the start, where `<lang> ∈ {es, en, fr, de, pt, ca}`.
  Patterns such as `/es//blog`, `/es/es/blog`, or `/en/es/blog/<slug>` are
  invalid and indicate a broken localised-link helper call.

## Enforcement

The rule is enforced at two layers:

- **Runtime (server middleware).** `server/index.ts` exports
  `canonicalizeStraySlashPath` and wires it as an Express middleware that
  301-redirects any inbound request whose path matches one of the three bug
  families above to its canonical form. This protects against external links
  and stale bookmarks that the source-code/sitemap scans cannot cover.
- **CI gate (`scripts/seo-slash-hygiene.mjs`,** wired as `npm run seo:slash`,
  also part of `npm run check`**).** The script:

1. Walks `client/src` for hard-coded hrefs / route literals that target a
   localised path and flags any of the three patterns above.
2. **Mandatory sitemap pass**: parses every `<loc>` and every `xhtml:link`
   `href` in any static `sitemap*.xml` it finds under `public/`,
   `client/public/`, or `dist/public/`, and in the live sitemap-index served
   by the app. The live pass is mandatory: when `BASE_URL` is provided it is
   used as-is; otherwise the script first probes `http://localhost:5000` and,
   if no dev server is running there, spawns a short-lived `tsx server/index.ts`
   on a free port, waits for `/sitemap.xml` to respond, runs the scan and
   tears the server down. Set `SEO_SLASH_SKIP_LIVE=1` only as a documented
   escape hatch (e.g. when the DB is unavailable in a smoke environment).
3. **Host scoping**: only first-party URLs are inspected — the production
   hosts (`exentax.com`, `www.exentax.com`) plus the host of `BASE_URL` when
   set. Third-party links (Google, social profiles, etc.) are ignored to
   avoid false positives.
4. **Live redirect probe** (runs alongside the live sitemap pass): hits a few
   representative dirty URLs (`/es/`, `/es//`, `/es/es`) against `BASE_URL`
   and asserts each one returns a 301 to its canonical form, catching a
   future regression where the runtime middleware is removed or weakened.
5. Emits a markdown report at `reports/seo/slash-hygiene.md` listing every
   problematic URL together with the file/line (or live sitemap URL) that
   produced it.
6. Exits non-zero if any problem is found, so the CI gate (`npm run check`)
   blocks the deploy.

The classifier and sitemap extractor are covered by
`scripts/seo-slash-hygiene.test.mjs` (`npm run test:seo-slash`) — synthetic
malformed sitemap input must produce findings; clean input must not.

The report is referenced from the indexing audit
(`docs/indexing-audit-2026-04.md`) so operators have a single page to land on
when investigating slash-related regressions.
