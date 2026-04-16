#!/bin/bash
set -e
npm install
npm run db:push

# Blog price-and-address guard (Task #21).
# Blocks reintroduction of forbidden price/fee/address mentions in the blog.
# Documented in replit.md. Runs automatically on every push/merge.
echo "--- Running blog price-and-address guard (npm run lint:blog) ---"
(cd exentax-web && npm run lint:blog)
