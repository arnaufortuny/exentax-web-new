/**
 * SEO ranking monitor.
 *
 * Usage:
 *   tsx scripts/seo/check-rankings.ts [--source=gsc|mock] [--days=7] [--alert-drop=5]
 *
 * Env vars:
 *   GSC_SITE_URL                  e.g. "sc-domain:exentax.com" or "https://exentax.com/"
 *   GOOGLE_APPLICATION_CREDENTIALS  path to a service-account JSON with Search Console access.
 *     (Alternative) GSC_SERVICE_ACCOUNT_JSON  the JSON payload as a string.
 *   DATABASE_URL                  when set, snapshots are persisted to the `seo_rankings` table
 *                                 (recommended for scheduled deployments where local disk is wiped).
 *
 * Outputs:
 *   seo-rankings/<YYYY-MM-DD>.csv       fresh snapshot (local disk)
 *   seo-rankings/latest.csv             copy of the newest snapshot (local disk)
 *   seo-rankings/alerts-<YYYY-MM-DD>.txt  (only when drops exceed threshold)
 *   seo_rankings table                  durable per-row history when DATABASE_URL is set
 *
 * Alert delivery:
 *   When `SEO_ALERTS_CHANNEL` is set to `slack` or `email`, the same digest is
 *   pushed to the configured destination so the alerts file isn't the only
 *   place drops show up. See `alert-channels.ts` and `docs/seo/ranking-monitor.md`
 *   for the full env-var reference.
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { buildArticleKeywords, summarizeCoverage, type ArticleKeyword } from "./keywords";
import {
  type RankingDrop,
  sendRankingDropDigest,
  sortDropsBySeverity,
} from "./alert-channels";

interface CliArgs {
  source: "gsc" | "mock";
  days: number;
  alertDrop: number;
  limit?: number;
}

interface RankingRow extends ArticleKeyword {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  hasData: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = { source: "gsc", days: 7, alertDrop: 5 };
  for (const raw of argv.slice(2)) {
    const [k, v] = raw.replace(/^--/, "").split("=");
    if (k === "source" && (v === "gsc" || v === "mock")) out.source = v;
    else if (k === "days") out.days = Math.max(1, Number(v) || 7);
    else if (k === "alert-drop") out.alertDrop = Math.max(1, Number(v) || 5);
    else if (k === "limit") out.limit = Math.max(1, Number(v) || 0);
  }
  return out;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function today(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function toCsv(rows: RankingRow[]): string {
  const header = [
    "date",
    "slug",
    "lang",
    "keyword",
    "page_url",
    "impressions",
    "clicks",
    "ctr",
    "position",
    "has_data",
  ];
  const date = today();
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        date,
        r.slug,
        r.lang,
        csvEscape(r.keyword),
        csvEscape(r.pageUrl),
        r.impressions.toFixed(0),
        r.clicks.toFixed(0),
        r.ctr.toFixed(4),
        r.position.toFixed(2),
        r.hasData ? "1" : "0",
      ].join(","),
    );
  }
  return lines.join("\n") + "\n";
}

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function parseCsv(text: string): Map<string, { position: number; impressions: number; clicks: number }> {
  const out = new Map<string, { position: number; impressions: number; clicks: number }>();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return out;
  const header = splitCsvLine(lines[0]);
  const idx = {
    slug: header.indexOf("slug"),
    lang: header.indexOf("lang"),
    impressions: header.indexOf("impressions"),
    clicks: header.indexOf("clicks"),
    position: header.indexOf("position"),
  };
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const key = `${cols[idx.slug]}::${cols[idx.lang]}`;
    out.set(key, {
      impressions: Number(cols[idx.impressions] ?? 0),
      clicks: Number(cols[idx.clicks] ?? 0),
      position: Number(cols[idx.position] ?? 0),
    });
  }
  return out;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
  }
  out.push(cur);
  return out;
}

async function fetchFromGsc(rows: ArticleKeyword[], days: number): Promise<RankingRow[]> {
  const { google } = await import("googleapis");

  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) {
    throw new Error("GSC_SITE_URL is required (e.g. 'sc-domain:exentax.com').");
  }

  let credentials: Record<string, unknown> | undefined;
  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const webmasters = google.webmasters({ version: "v3", auth });
  // Search Console has ~1-2 day lag; end at yesterday, span `days` inclusive.
  const endDate = daysAgo(1);
  const startDate = daysAgo(days);

  const out: RankingRow[] = [];
  for (const r of rows) {
    try {
      const resp = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 1,
          dimensionFilterGroups: [
            {
              filters: [
                { dimension: "query", operator: "equals", expression: r.keyword },
                { dimension: "page", operator: "contains", expression: r.localizedSlug },
              ],
            },
          ],
        },
      });
      const row = resp.data.rows?.[0];
      if (row) {
        out.push({
          ...r,
          impressions: Math.round(row.impressions ?? 0),
          clicks: Math.round(row.clicks ?? 0),
          ctr: Number(row.ctr ?? 0),
          position: Number(row.position ?? 0),
          hasData: true,
        });
      } else {
        out.push({ ...r, impressions: 0, clicks: 0, ctr: 0, position: 0, hasData: false });
      }
    } catch (err) {
      console.warn(`[gsc] query failed for ${r.lang}/${r.slug}:`, (err as Error).message);
      out.push({ ...r, impressions: 0, clicks: 0, ctr: 0, position: 0, hasData: false });
    }
  }
  return out;
}

function fetchMock(rows: ArticleKeyword[]): RankingRow[] {
  // Deterministic pseudo-random numbers per (slug, lang) so drift testing is stable.
  return rows.map((r) => {
    const seed = hash(`${r.slug}-${r.lang}`);
    const position = 5 + (seed % 4000) / 100;
    const impressions = 10 + (seed % 400);
    const clicks = Math.floor(impressions * 0.04);
    const ctr = impressions > 0 ? clicks / impressions : 0;
    return { ...r, position, impressions, clicks, ctr, hasData: true };
  });
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function findPreviousSnapshot(dir: string, todayFile: string): string | undefined {
  if (!fs.existsSync(dir)) return undefined;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.csv$/.test(f))
    .filter((f) => f !== todayFile)
    .sort();
  return files.at(-1);
}

interface DiffResult {
  /** Human-readable lines for the alerts-<date>.txt file. */
  lines: string[];
  /** Structured drops used to build the Slack/email digest. */
  drops: RankingDrop[];
}

function diffAlerts(
  current: RankingRow[],
  prev: Map<string, { position: number; impressions: number; clicks: number }>,
  threshold: number,
): DiffResult {
  const lines: string[] = [];
  const drops: RankingDrop[] = [];
  for (const r of current) {
    if (!r.hasData) continue;
    const p = prev.get(`${r.slug}::${r.lang}`);
    if (!p || !p.position) continue;
    const drop = r.position - p.position; // higher number = worse ranking
    if (drop >= threshold) {
      lines.push(
        `[DROP ${drop.toFixed(1)}] ${r.lang}/${r.slug} — "${r.keyword}": ${p.position.toFixed(1)} → ${r.position.toFixed(1)}`,
      );
      drops.push({
        title: `${r.lang}/${r.slug}`,
        url: r.pageUrl,
        keyword: r.keyword,
        previousPosition: Math.round(p.position),
        currentPosition: Math.round(r.position),
      });
    }
  }
  return { lines, drops: sortDropsBySeverity(drops) };
}

interface DbPrevSnapshot {
  snapshotDate: string;
  prev: Map<string, { position: number; impressions: number; clicks: number }>;
}

async function withPgClient<T>(fn: (client: import("pg").PoolClient) => Promise<T>): Promise<T> {
  const { Pool } = await import("pg");
  const isProduction = process.env.NODE_ENV === "production";
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
    connectionTimeoutMillis: 5000,
    ...(isProduction && { ssl: { rejectUnauthorized: false } }),
  });
  try {
    const client = await pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

async function ensureSeoRankingsTable(client: import("pg").PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS seo_rankings (
      id serial PRIMARY KEY,
      snapshot_date text NOT NULL,
      slug text NOT NULL,
      lang text NOT NULL,
      keyword text NOT NULL,
      page_url text NOT NULL,
      impressions integer NOT NULL DEFAULT 0,
      clicks integer NOT NULL DEFAULT 0,
      ctr text NOT NULL DEFAULT '0',
      position text NOT NULL DEFAULT '0',
      has_data boolean NOT NULL DEFAULT false,
      created_at timestamp DEFAULT now()
    )
  `);
  await client.query(`CREATE INDEX IF NOT EXISTS seo_rankings_snapshot_idx ON seo_rankings(snapshot_date)`);
  await client.query(`CREATE INDEX IF NOT EXISTS seo_rankings_slug_lang_idx ON seo_rankings(slug, lang)`);
  await client.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS seo_rankings_snapshot_slug_lang_idx ON seo_rankings(snapshot_date, slug, lang)`,
  );
}

async function loadPrevFromDb(
  client: import("pg").PoolClient,
  todaySnapshot: string,
): Promise<DbPrevSnapshot | undefined> {
  const { rows } = await client.query<{ snapshot_date: string }>(
    `SELECT DISTINCT snapshot_date FROM seo_rankings WHERE snapshot_date <> $1 ORDER BY snapshot_date DESC LIMIT 1`,
    [todaySnapshot],
  );
  if (rows.length === 0) return undefined;
  const snapshotDate = rows[0].snapshot_date;
  const { rows: data } = await client.query<{
    slug: string;
    lang: string;
    impressions: number;
    clicks: number;
    position: string;
  }>(
    `SELECT slug, lang, impressions, clicks, position FROM seo_rankings WHERE snapshot_date = $1`,
    [snapshotDate],
  );
  const prev = new Map<string, { position: number; impressions: number; clicks: number }>();
  for (const r of data) {
    prev.set(`${r.slug}::${r.lang}`, {
      position: Number(r.position) || 0,
      impressions: Number(r.impressions) || 0,
      clicks: Number(r.clicks) || 0,
    });
  }
  return { snapshotDate, prev };
}

async function writeSnapshotToDb(
  client: import("pg").PoolClient,
  snapshotDate: string,
  results: RankingRow[],
): Promise<void> {
  await client.query("BEGIN");
  try {
    await client.query(`DELETE FROM seo_rankings WHERE snapshot_date = $1`, [snapshotDate]);
    const chunkSize = 100;
    for (let i = 0; i < results.length; i += chunkSize) {
      const chunk = results.slice(i, i + chunkSize);
      const values: unknown[] = [];
      const placeholders: string[] = [];
      chunk.forEach((r, idx) => {
        const base = idx * 10;
        placeholders.push(
          `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10})`,
        );
        values.push(
          snapshotDate,
          r.slug,
          r.lang,
          r.keyword,
          r.pageUrl,
          r.impressions,
          r.clicks,
          r.ctr.toFixed(4),
          r.position.toFixed(2),
          r.hasData,
        );
      });
      await client.query(
        `INSERT INTO seo_rankings
          (snapshot_date, slug, lang, keyword, page_url, impressions, clicks, ctr, position, has_data)
         VALUES ${placeholders.join(",")}`,
        values,
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  let rows = buildArticleKeywords();
  if (args.limit) rows = rows.slice(0, args.limit);

  const coverage = summarizeCoverage(rows);
  console.log(
    `[seo] keyword coverage: ${coverage.totalRows} rows · ${coverage.uniqueArticles} articles · ${coverage.uniqueKeywords} unique (lang::keyword)`,
  );
  console.log(`[seo] by language: ${JSON.stringify(coverage.byLang)}`);

  let results: RankingRow[];
  if (args.source === "gsc") {
    if (!process.env.GSC_SITE_URL) {
      console.error(
        "[seo] GSC_SITE_URL is not set. Set GSC_SITE_URL (e.g. 'sc-domain:exentax.com') and service-account credentials, or pass --source=mock to run without Search Console.",
      );
      process.exit(2);
    }
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GSC_SERVICE_ACCOUNT_JSON) {
      console.error(
        "[seo] No Google service-account credentials found. Set GOOGLE_APPLICATION_CREDENTIALS (path) or GSC_SERVICE_ACCOUNT_JSON (inline JSON), or pass --source=mock.",
      );
      process.exit(2);
    }
    results = await fetchFromGsc(rows, args.days);
  } else {
    results = fetchMock(rows);
  }

  const HERE = path.dirname(url.fileURLToPath(import.meta.url));
  const outDir = path.resolve(HERE, "..", "..", "seo-rankings");
  ensureDir(outDir);

  const todayFile = `${today()}.csv`;
  const todayPath = path.join(outDir, todayFile);
  fs.writeFileSync(todayPath, toCsv(results), "utf8");
  fs.writeFileSync(path.join(outDir, "latest.csv"), toCsv(results), "utf8");
  console.log(`[seo] wrote ${results.length} rows → ${path.relative(process.cwd(), todayPath)}`);

  const snapshotDate = today();
  let dbPrev: DbPrevSnapshot | undefined;
  if (process.env.DATABASE_URL) {
    try {
      await withPgClient(async (client) => {
        await ensureSeoRankingsTable(client);
        dbPrev = await loadPrevFromDb(client, snapshotDate);
        await writeSnapshotToDb(client, snapshotDate, results);
      });
      console.log(
        `[seo] persisted ${results.length} rows to seo_rankings table (snapshot_date=${snapshotDate})`,
      );
    } catch (err) {
      console.error(
        `[seo] DB persistence failed: ${(err as Error).message}. Snapshot remains on local disk only.`,
      );
    }
  } else {
    console.log("[seo] DATABASE_URL not set — skipping durable DB persistence.");
  }

  let prev: Map<string, { position: number; impressions: number; clicks: number }> | undefined;
  let prevLabel: string | undefined;
  if (dbPrev) {
    prev = dbPrev.prev;
    prevLabel = `seo_rankings@${dbPrev.snapshotDate}`;
  } else {
    const prevFile = findPreviousSnapshot(outDir, todayFile);
    if (prevFile) {
      prev = parseCsv(fs.readFileSync(path.join(outDir, prevFile), "utf8"));
      prevLabel = prevFile;
    }
  }

  if (prev && prevLabel) {
    const { lines, drops } = diffAlerts(results, prev, args.alertDrop);
    console.log(`[seo] compared against ${prevLabel} — ${lines.length} alert(s) over threshold ${args.alertDrop}`);
    if (lines.length > 0) {
      const alertsPath = path.join(outDir, `alerts-${snapshotDate}.txt`);
      fs.writeFileSync(alertsPath, lines.join("\n") + "\n", "utf8");
      for (const line of lines) console.log(`  ⚠  ${line}`);
      console.log(`[seo] wrote alerts → ${path.relative(process.cwd(), alertsPath)}`);

      const delivery = await sendRankingDropDigest({
        generatedAt: new Date(),
        drops,
      });
      if (delivery.delivered) {
        console.log(`[seo] digest delivered via ${delivery.channel}.`);
      } else {
        console.log(
          `[seo] digest not delivered (${delivery.channel}): ${delivery.reason ?? "unknown"}`,
        );
      }
    }
  } else {
    console.log("[seo] no previous snapshot — baseline written.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
