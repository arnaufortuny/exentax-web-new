#!/usr/bin/env bash
# Combined social-previews CI gate.
# Runs the audit (regenerates docs/audits/previews-audit.json) and then
# the strict validator. Exits non-zero on any error so CI pipelines can
# wire it as `bash exentax-web/scripts/seo/check-social-previews.sh`.
#
# Use this script from any CI step in lieu of editing package.json
# (the project rule forbids package.json edits during this audit task).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$DIR"

echo "[social-previews] running audit…"
npx tsx scripts/seo/audit-social-previews.ts > /dev/null

echo "[social-previews] running validator…"
node scripts/seo/validate-social-previews.mjs

echo "[social-previews] OK"
