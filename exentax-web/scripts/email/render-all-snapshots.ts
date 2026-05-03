/**
 * Render every email template in every supported language to a static
 * HTML file under `reports/email-snapshots/` so reviewers can spot-check
 * typography, line-breaks, CTA contrast and chrome layout without
 * sending a real email or booting the dev server.
 *
 * Wired as `npm run email:snapshots` (manual review tool — intentionally
 * not in `check:serial`). Re-run any time email copy or layout helpers
 * change. Snapshots are not committed to git; the directory carries a
 * README explaining how to regenerate.
 *
 * Coverage (matches Task #35 — 12 logical templates × 6 languages = 72
 * HTML files plus 72 plain-text counterparts plus an index.html manifest):
 *
 *     1.  booking-confirmation
 *     2.  booking-reminder             (HTML body only — .ics is omitted)
 *     3.  reschedule-confirmation
 *     4.  cancellation
 *     5.  no-show-reschedule
 *     6.  post-meeting-followup
 *     7.  incomplete-booking
 *     8.  calculator-result
 *     9.  drip                         (step 1 — lead-magnet delivery)
 *    10.  calc-drip                    (step 1 — calculator nurture day 1)
 *    11.  newsletter                   (representative campaign body)
 *    12.  drip-final                   (step 6 — final nurture touch)
 *
 * Each rendered file has a sibling `.txt` that strips HTML to plain
 * text — what a non-HTML mail client would surface. This is generated
 * locally (`htmlToText` below) so the snapshot tool has zero npm deps.
 *
 * Fixture data + per-template renderer wiring lives in
 * `scripts/email/fixtures.ts` and is shared with the regression test
 * `tests/email-snapshot-regression.test.ts` (Task #77) so the manual
 * snapshots and the CI baselines stay in lock-step.
 */

import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { LANGS, renderAllSnapshots, type Snapshot } from "./fixtures";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT_DIR = path.resolve(ROOT, "reports", "email-snapshots");

/**
 * Lightweight HTML → plain-text converter. The emails are simple
 * table-based layouts; we do not need a full DOM parser. This mirrors
 * what a text-only mail client (or a screen reader stripping CSS)
 * would surface, so reviewers can sanity-check the reading order and
 * spot any copy that only makes sense visually.
 */
function htmlToText(html: string): string {
  // Replace block-level tags + <br> with newlines BEFORE stripping all
  // tags so paragraph rhythm survives. Order matters: do </tr>/</p>
  // before the generic tag strip.
  let txt = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<\/(p|div|tr|h[1-6]|li|td)>/gi, "\n")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<a\s+[^>]*href=("|')([^"']+)\1[^>]*>([\s\S]*?)<\/a>/gi, "$3 ($2)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return txt;
}

async function writeSnapshot(snap: Snapshot): Promise<void> {
  const baseName = `${snap.slug}.${snap.lang}`;
  const htmlPath = path.join(OUT_DIR, `${baseName}.html`);
  const txtPath = path.join(OUT_DIR, `${baseName}.txt`);
  await writeFile(htmlPath, snap.html, "utf8");
  const text = `Subject: ${snap.subject}\n\n${htmlToText(snap.html)}\n`;
  await writeFile(txtPath, text, "utf8");
}

function templateLabel(slug: string): string {
  // Pretty-print the kebab-cased slug for the index page.
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function writeIndex(snaps: Snapshot[]): Promise<void> {
  const byTemplate = new Map<string, Snapshot[]>();
  for (const s of snaps) {
    const arr = byTemplate.get(s.template) ?? [];
    arr.push(s);
    byTemplate.set(s.template, arr);
  }
  const rows = Array.from(byTemplate.entries())
    .map(([template, list]) => {
      const cells = LANGS.map((lang) => {
        const match = list.find((s) => s.lang === lang && s.template === template);
        if (!match) return `<td>—</td>`;
        return `<td><a href="${match.slug}.${lang}.html">html</a> · <a href="${match.slug}.${lang}.txt">txt</a></td>`;
      }).join("");
      return `<tr><th align="left">${templateLabel(template)}</th>${cells}</tr>`;
    })
    .join("\n      ");
  const head = `<th align="left">Template</th>` + LANGS.map((l) => `<th>${l.toUpperCase()}</th>`).join("");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Exentax email snapshots</title>
  <style>
    body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; color:#111; }
    h1 { margin: 0 0 4px; }
    p.sub { color:#555; margin:0 0 24px; }
    table { border-collapse: collapse; width: 100%; max-width: 1100px; }
    th, td { border-bottom: 1px solid #eee; padding: 8px 10px; font-size: 14px; text-align: left; }
    th { background: #f7f7f7; }
    a { color: #00C80E; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Email snapshots</h1>
  <p class="sub">Generated by <code>npm run email:snapshots</code> — ${snaps.length} HTML files (${byTemplate.size} templates × ${LANGS.length} languages). Each row links to the HTML render and its plain-text strip.</p>
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>
`;
  await writeFile(path.join(OUT_DIR, "index.html"), html, "utf8");
}

/**
 * Wipe only the generated artifacts (`*.html` + `*.txt` + `index.html`)
 * so committed siblings like `README.md` survive a regeneration. The
 * directory itself is preserved.
 */
async function cleanGeneratedFiles(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = await readdir(OUT_DIR);
  await Promise.all(
    entries
      .filter((name) => name === "index.html" || name.endsWith(".html") || name.endsWith(".txt"))
      .map((name) => unlink(path.join(OUT_DIR, name))),
  );
}

async function main(): Promise<void> {
  await cleanGeneratedFiles();

  const snapshots = renderAllSnapshots();

  for (const snap of snapshots) {
    await writeSnapshot(snap);
  }
  await writeIndex(snapshots);

  // Pair count = HTML + TXT siblings; index.html is informational only.
  console.log(
    `[email:snapshots] wrote ${snapshots.length} HTML files and ${snapshots.length} plain-text counterparts ` +
      `(${snapshots.length * 2} files total) to ${path.relative(ROOT, OUT_DIR)}/`,
  );
  console.log(`[email:snapshots] open ${path.relative(ROOT, OUT_DIR)}/index.html for the per-language manifest.`);
}

main().catch((err) => {
  console.error("[email:snapshots] failed:", err);
  process.exit(1);
});
