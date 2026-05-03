/**
 * Regression test — Email snapshot visual diff (Task #77).
 *
 * Re-renders every email template × language combo (12 × 6 = 72) using
 * the shared fixtures from `scripts/email/fixtures.ts` and compares the
 * full rendered HTML against committed baselines under
 * `tests/__snapshots__/email/{slug}.{lang}.html`.
 *
 * Why full HTML instead of a hash: a hash would catch the regression
 * but the PR diff would be opaque (`hash: 0xabc → 0xdef`). Committing
 * the rendered body makes the visual diff legible — a reviewer can
 * literally read the colour, the signature line, the footer URL that
 * changed. Each baseline is ~3-15 KB; the full set is < 600 KB.
 *
 * Updating baselines (after an intentional layout / copy change):
 *
 *     UPDATE_SNAPSHOTS=1 npm run test:email-snapshot-regression
 *
 * The test will rewrite every baseline and exit 0. Inspect the resulting
 * git diff carefully — that's the whole point of this gate. Then commit
 * the new baselines alongside the source change.
 *
 * Wired into `check:serial` so a PR that changes email rendering can't
 * merge silently. Running this test in isolation:
 *
 *     npm run test:email-snapshot-regression
 */
process.env.NODE_ENV = "test";

import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { renderAllSnapshots } from "../scripts/email/fixtures";

const BASELINE_DIR = path.resolve(import.meta.dirname, "__snapshots__", "email");
const UPDATE = process.env.UPDATE_SNAPSHOTS === "1";

function baselinePath(slug: string, lang: string): string {
  return path.join(BASELINE_DIR, `${slug}.${lang}.html`);
}

/**
 * Normalize values that legitimately change between runs but aren't
 * "visual layout" regressions we want to gate on. Today this is just
 * the footer copyright year (`emailHtml()` calls `new Date().getFullYear()`).
 * Without this, the gate would spuriously fail on Jan 1 every year
 * even though no email source changed. We freeze the year to a
 * placeholder so the baseline is date-independent.
 */
function normalize(html: string): string {
  return html.replace(
    /(&copy;\s*)\d{4}(\s+[^<]+\sLLC)/g,
    "$1YYYY$2",
  );
}

function relPath(p: string): string {
  return path.relative(process.cwd(), p);
}

console.log("\n=== Email snapshot regression (Task #77) ===\n");
if (UPDATE) {
  console.log("UPDATE_SNAPSHOTS=1 → rewriting every baseline. Review the git diff before committing.\n");
}

mkdirSync(BASELINE_DIR, { recursive: true });

const snapshots = renderAllSnapshots();
const expectedFiles = new Set<string>();
let failures = 0;

for (const snap of snapshots) {
  const file = baselinePath(snap.slug, snap.lang);
  expectedFiles.add(path.basename(file));
  // Embed the subject as an HTML comment so the baseline diff also
  // surfaces subject-line drift (subject lines aren't rendered into
  // the body chrome, so they'd otherwise slip past a body-only diff).
  const payload = `<!-- subject: ${snap.subject} -->\n${normalize(snap.html)}`;

  if (UPDATE) {
    writeFileSync(file, payload, "utf8");
    console.log(`  [WRITE] ${relPath(file)}`);
    continue;
  }

  if (!existsSync(file)) {
    failures++;
    console.error(
      `  [FAIL] ${snap.slug}.${snap.lang} — missing baseline at ${relPath(file)}.\n` +
        `         Run: UPDATE_SNAPSHOTS=1 npm run test:email-snapshot-regression`,
    );
    continue;
  }

  const expected = readFileSync(file, "utf8");
  if (expected === payload) {
    console.log(`  [PASS] ${snap.slug}.${snap.lang}`);
    continue;
  }

  failures++;
  // Show a small unified-style hint: first differing line + a few
  // chars of context. Keeps the CI log readable; the full diff is
  // available locally via `git diff` once the engineer reruns with
  // UPDATE_SNAPSHOTS=1.
  const expLines = expected.split("\n");
  const actLines = payload.split("\n");
  let diffLine = -1;
  for (let i = 0; i < Math.max(expLines.length, actLines.length); i++) {
    if (expLines[i] !== actLines[i]) {
      diffLine = i;
      break;
    }
  }
  console.error(
    `  [FAIL] ${snap.slug}.${snap.lang} — rendered HTML drifted from baseline ${relPath(file)}.`,
  );
  if (diffLine >= 0) {
    const ctx = (s: string | undefined): string => (s ?? "").slice(0, 200);
    console.error(`         first diff at line ${diffLine + 1}:`);
    console.error(`           expected: ${JSON.stringify(ctx(expLines[diffLine]))}`);
    console.error(`           actual:   ${JSON.stringify(ctx(actLines[diffLine]))}`);
  }
  console.error(
    `         If this change is intentional, run:\n` +
      `           UPDATE_SNAPSHOTS=1 npm run test:email-snapshot-regression\n` +
      `         then review and commit the baseline diff.`,
  );
}

// Also flag stale baselines (file exists but no longer rendered) — a
// removed template would otherwise silently leave dead HTML in the
// repo. In UPDATE mode we delete them; in CI mode we fail.
const existing = existsSync(BASELINE_DIR)
  ? readdirSync(BASELINE_DIR).filter((f) => f.endsWith(".html"))
  : [];
for (const f of existing) {
  if (expectedFiles.has(f)) continue;
  if (UPDATE) {
    unlinkSync(path.join(BASELINE_DIR, f));
    console.log(`  [DELETE] stale ${relPath(path.join(BASELINE_DIR, f))}`);
  } else {
    failures++;
    console.error(
      `  [FAIL] stale baseline ${relPath(path.join(BASELINE_DIR, f))} — no matching template/lang.\n` +
        `         Run: UPDATE_SNAPSHOTS=1 npm run test:email-snapshot-regression`,
    );
  }
}

const total = snapshots.length;
const passed = total - failures;
console.log(
  `\n=== ${UPDATE ? `${total} baselines written` : `${passed}/${total} snapshots match`} ===\n`,
);

if (failures > 0) {
  console.error(`FAILED: ${failures} snapshot(s) drifted or missing`);
  process.exit(1);
}
process.exit(0);
