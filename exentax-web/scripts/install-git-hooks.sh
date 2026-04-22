#!/usr/bin/env bash
set -euo pipefail

# Installs opt-in git hooks for the Exentax repo. Run from the repo root or
# from `exentax-web/`:
#
#   bash exentax-web/scripts/install-git-hooks.sh
#
# Two hooks are installed:
#   * pre-commit  — runs `npm run i18n:check` whenever a translation bundle
#                   changes (fast, scoped to i18n locale files).
#   * pre-push    — runs the full `npm run check` quality pipeline (tsc,
#                   lints, SEO, i18n, unit tests, Discord neon, newsletter
#                   and booking E2E). `npm run check` already invokes the
#                   blog-validate-all suite (10 blog-quality steps:
#                   consistency, content lint, internal links, locale leak,
#                   CTA contract, data integrity, sources structural +
#                   external-ping freshness, FAQ JSON-LD, sitemap shape,
#                   masterpiece audit — see docs/seo/blog-validation.md).
#                   A failing step blocks the push and prints the failing
#                   script name. Same gate that runs in CI on every push /
#                   pull request.
#
# Skip the pre-push gate for a single push with:
#   SKIP_QUALITY_CHECK=1 git push
#
# Uninstall by deleting `.git/hooks/pre-commit` and `.git/hooks/pre-push`.

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
PRE_COMMIT="$HOOKS_DIR/pre-commit"
PRE_PUSH="$HOOKS_DIR/pre-push"

cat > "$PRE_COMMIT" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail

CHANGED=$(git diff --cached --name-only --diff-filter=ACMR | \
  grep -E '^exentax-web/client/src/i18n/locales/' || true)

if [ -z "$CHANGED" ]; then
  exit 0
fi

echo "[pre-commit] Detected changes in i18n locales; running npm run i18n:check..."
(cd exentax-web && npm run i18n:check)
HOOK

chmod +x "$PRE_COMMIT"
echo "Installed pre-commit hook at $PRE_COMMIT"

cat > "$PRE_PUSH" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail

if [ "${SKIP_QUALITY_CHECK:-0}" = "1" ]; then
  echo "[pre-push] SKIP_QUALITY_CHECK=1 set; skipping npm run check."
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[pre-push] WARNING: DATABASE_URL is not set; the newsletter and booking E2E steps will fail."
  echo "[pre-push]          Export DATABASE_URL or rerun with SKIP_QUALITY_CHECK=1 to bypass."
fi

echo "[pre-push] Running full quality pipeline (npm run check)..."
echo "[pre-push] (this includes blog-validate-all — 10 blog-quality steps)"
(cd exentax-web && npm run check)
HOOK

chmod +x "$PRE_PUSH"
echo "Installed pre-push hook at $PRE_PUSH"
