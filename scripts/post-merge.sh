#!/bin/bash
set -e
# Single root-level install: this repo is an npm workspace
# (root package.json -> "workspaces": ["exentax-web"]). One install hoists
# every dep — root + exentax-web — into the root node_modules so that scripts
# like `cd exentax-web && npm run check` find tsx, tsc, drizzle-kit, etc.
# Do NOT add a second `npm install` inside exentax-web/. (Task #34)
npm install
npm run db:push

# Blog price-and-address guard (Task #21).
# Blocks reintroduction of forbidden price/fee/address mentions in the blog.
# Documented in replit.md. Runs automatically on every push/merge.
echo "--- Running blog price-and-address guard (npm run lint:blog) ---"
(cd exentax-web && npm run lint:blog)

# Unit tests for the guard itself (Task #25).
# Feeds synthetic fixtures to blog-content-lint.mjs to catch regressions in
# its own regexes (allowlist drift, locale keyword gaps, false negatives).
echo "--- Running blog guard unit tests (npm run test:lint-blog) ---"
(cd exentax-web && npm run test:lint-blog)

# Newsletter end-to-end guard (Task #19).
# Boots the server on an ephemeral port and exercises the full subscribe +
# RGPD consent + multi-language unsubscribe flow against the real Postgres
# database. Blocks the merge (and therefore the deploy) if any step fails.
# Documented in replit.md.
echo "--- Running newsletter end-to-end guard (npm run test:newsletter) ---"
(cd exentax-web && npm run test:newsletter)

# Booking end-to-end guard (Task #35).
# Boots the server on an ephemeral port and exercises the full booking
# flow (book -> manage -> reschedule -> cancel) against the real Postgres
# database, verifying agenda + lead + consent_log rows and status
# transitions. Gmail and Google Calendar are stubbed via env-var clearing
# in the wrapper so the test is self-contained and idempotent. Blocks the
# merge (and therefore the deploy) if any step fails. Documented in replit.md.
echo "--- Running booking end-to-end guard (npm run test:booking) ---"
(cd exentax-web && npm run test:booking)
