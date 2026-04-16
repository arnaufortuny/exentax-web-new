#!/bin/bash
set -e
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
