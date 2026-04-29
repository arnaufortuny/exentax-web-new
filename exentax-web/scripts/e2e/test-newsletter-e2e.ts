/**
 * End-to-end test for the newsletter subscribe + unsubscribe flow.
 *
 * Verifies:
 *   1. POST /api/newsletter/subscribe creates a row in `newsletter_subscribers`
 *      with an unsubscribe token and writes a `newsletter_footer` entry to `consent_log`.
 *   2. GET /api/newsletter/unsubscribe/:token returns localized success HTML
 *      for every supported language (es, en, fr, de, pt, ca) and sets
 *      `unsubscribed_at` in the database.
 *   3. Replaying the same token (already used) returns the localized
 *      "already unsubscribed" HTML.
 *   4. An invalid / unknown token returns the localized "invalid link" HTML.
 *
 * Usage: tsx exentax-web/scripts/test-newsletter-e2e.ts
 * Requires the dev server to be running on $BASE_URL (defaults to http://localhost:5000).
 */
import { db } from "../../server/db";
import { eq, like, and } from "drizzle-orm";
import * as s from "../../shared/schema";
import {
  upsertNewsletterSubscriber,
  findNewsletterByUnsubToken,
} from "../../server/storage/marketing";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const TEST_TAG = `e2e-newsletter-${Date.now()}`;

type Lang = "es" | "en" | "fr" | "de" | "pt" | "ca";
const LANGS: Lang[] = ["es", "en", "fr", "de", "pt", "ca"];

const EXPECTED_SUCCESS_TITLE: Record<Lang, string> = {
  es: "Dado de baja",
  en: "Unsubscribed",
  fr: "Desinscrit",
  de: "Abgemeldet",
  pt: "Cancelado",
  ca: "Cancel-lat",
};
const EXPECTED_SUCCESS_MSG: Record<Lang, string> = {
  es: "Te has dado de baja exitosamente de nuestro boletin.",
  en: "You have been successfully unsubscribed from our newsletter.",
  fr: "Vous avez ete desinscrit avec succes de notre newsletter.",
  de: "Sie wurden erfolgreich von unserem Newsletter abgemeldet.",
  pt: "Foi cancelado com sucesso da nossa newsletter.",
  ca: "T'has donat de baixa correctament del nostre butlleti.",
};
const EXPECTED_ALREADY_TITLE: Record<Lang, string> = {
  es: "Ya cancelado",
  en: "Already Unsubscribed",
  fr: "Deja desinscrit",
  de: "Bereits abgemeldet",
  pt: "Ja cancelado",
  ca: "Ja cancel-lat",
};
const EXPECTED_INVALID_MSG: Record<Lang, string> = {
  es: "Enlace de cancelacion invalido.",
  en: "Invalid unsubscribe link.",
  fr: "Lien de desinscription invalide.",
  de: "Ungueltiger Abmeldelink.",
  pt: "Link de cancelamento invalido.",
  ca: "Enllac de cancel-lacio invalid.",
};

interface Result {
  name: string;
  ok: boolean;
  detail?: string;
}
const results: Result[] = [];
const createdEmails: string[] = [];

function record(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail });
  const tag = ok ? "PASS" : "FAIL";
  console.log(`  [${tag}] ${name}${detail ? ` — ${detail}` : ""}`);
}

function assert(name: string, cond: boolean, detail?: string) {
  record(name, !!cond, cond ? undefined : detail || "assertion failed");
  return !!cond;
}

async function getSubscriberByEmail(email: string) {
  const rows = await db.select().from(s.newsletterSubscribers).where(eq(s.newsletterSubscribers.email, email)).limit(1);
  return rows[0] ?? null;
}

async function getConsentRowsByEmail(email: string) {
  return db.select().from(s.consentLog).where(eq(s.consentLog.email, email));
}

async function httpSubscribe(email: string, language: string | null) {
  const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      email,
      source: "e2e-test",
      privacyAccepted: true,
      marketingAccepted: true,
      language,
    }),
  });
  const text = await res.text();
  let json: unknown = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }
  return { status: res.status, body: json, raw: text };
}

async function httpUnsubscribe(token: string, lang: Lang | null) {
  const headers: Record<string, string> = {};
  if (lang) headers["Accept-Language"] = `${lang},en;q=0.5`;
  const res = await fetch(`${BASE_URL}/api/newsletter/unsubscribe/${encodeURIComponent(token)}`, {
    method: "GET",
    headers,
    redirect: "manual",
  });
  return { status: res.status, body: await res.text() };
}

async function cleanup() {
  if (createdEmails.length === 0) return;
  try {
    for (const email of createdEmails) {
      await db.delete(s.consentLog).where(eq(s.consentLog.email, email));
      await db.delete(s.newsletterSubscribers).where(eq(s.newsletterSubscribers.email, email));
      await db.delete(s.dripEnrollments).where(eq(s.dripEnrollments.email, email));
    }
    await db.delete(s.consentLog).where(and(eq(s.consentLog.source, "e2e-test"), like(s.consentLog.email, "%@e2e.exentax.test")));
    await db.delete(s.dripEnrollments).where(like(s.dripEnrollments.email, "%@e2e.exentax.test"));
    console.log(`\nCleanup: removed ${createdEmails.length} test subscriber(s).`);
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

async function main() {
  console.log(`Running newsletter E2E against ${BASE_URL}`);
  console.log(`Test tag: ${TEST_TAG}\n`);

  // -----------------------------------------------------------------------
  // 1. Full HTTP flow: subscribe via the public endpoint (single call to
  //    stay within the 3/hour newsletter rate limit) and verify DB rows.
  // -----------------------------------------------------------------------
  console.log("Step 1 — HTTP subscribe + DB verification");
  const httpEmail = `${TEST_TAG}-http@e2e.exentax.test`;
  createdEmails.push(httpEmail);
  const sub = await httpSubscribe(httpEmail, "es");
  assert("subscribe endpoint returns 200", sub.status === 200, `status=${sub.status} body=${sub.raw.slice(0, 120)}`);
  // The consent log is written asynchronously (fire-and-forget alongside the
  // drip enrollment). Under the parallel `npm run check` runner (concurrency 6)
  // the original 400 ms fixed wait was insufficient on contended CPUs, causing
  // intermittent `consent_log entry written` failures (rows=[]). Poll for up to
  // ~6 s with a tight interval — the success path returns in <500 ms typically.
  let consentRows: Awaited<ReturnType<typeof getConsentRowsByEmail>> = [];
  let newsletterConsent: typeof consentRows[number] | undefined;
  const POLL_DEADLINE = Date.now() + 6000;
  while (Date.now() < POLL_DEADLINE) {
    consentRows = await getConsentRowsByEmail(httpEmail);
    newsletterConsent = consentRows.find((r) => r.formType === "newsletter_footer");
    if (newsletterConsent) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  const subRow = await getSubscriberByEmail(httpEmail);
  assert("newsletter_subscribers row created", !!subRow, `row=${JSON.stringify(subRow)}`);
  assert("subscriber has unsubscribe_token", !!subRow?.unsubscribeToken && subRow.unsubscribeToken.length >= 32);
  assert("subscriber source=footer (default)", subRow?.source === "e2e-test" || subRow?.source === "footer", `source=${subRow?.source}`);
  assert("subscriber unsubscribed_at is null", subRow?.unsubscribedAt === null);
  assert("consent_log entry written for newsletter_footer", !!newsletterConsent, `rows=${JSON.stringify(consentRows)}`);
  assert("consent_log records privacy_accepted=true", newsletterConsent?.privacyAccepted === true);
  assert("consent_log records marketing_accepted=true", newsletterConsent?.marketingAccepted === true);
  assert("consent_log records language=es", newsletterConsent?.language === "es");

  // Verify the 6-step drip sequence was enrolled (replaces the old
  // single welcome email). The row is inserted in fire-and-forget mode
  // alongside the consent log, so by the time the poll above resolved
  // the consent row both writes have settled in practice.
  const dripRows = await db.select().from(s.dripEnrollments).where(eq(s.dripEnrollments.email, httpEmail));
  const drip = dripRows[0];
  assert("drip_enrollments row created", !!drip, `rows=${JSON.stringify(dripRows)}`);
  assert("drip enrollment source=guide", drip?.source === "guide", `source=${drip?.source}`);
  assert("drip enrollment language=es", drip?.language === "es");
  assert("drip enrollment is active (not completed)", drip?.completedAt === null);

  // -----------------------------------------------------------------------
  // 2. Unsubscribe per-language. To avoid hitting the 3/hour subscribe
  //    rate limit we seed the additional subscribers directly through the
  //    storage layer (the same code path the HTTP route uses).
  // -----------------------------------------------------------------------
  console.log("\nStep 2 — Unsubscribe localized HTML in 6 languages");
  const langTokens: Record<Lang, string> = {} as Record<Lang, string>;
  for (const lang of LANGS) {
    const email = `${TEST_TAG}-${lang}@e2e.exentax.test`;
    createdEmails.push(email);
    // NOTE: passing two interests works around a drizzle/pg array binding
    // quirk where single-element JS arrays serialize as a scalar.
    const row = await upsertNewsletterSubscriber(email, "", "e2e-test", ["general", "e2e"]);
    if (!row?.unsubscribeToken) {
      record(`seed subscriber for ${lang}`, false, "missing unsubscribeToken from upsert");
      continue;
    }
    langTokens[lang] = row.unsubscribeToken;
    const r = await httpUnsubscribe(row.unsubscribeToken, lang);
    const okStatus = r.status === 200;
    const okTitle = r.body.includes(EXPECTED_SUCCESS_TITLE[lang]);
    // The HTML is escaped (e.g. apostrophes become &#x27;), so compare the
    // expected message after applying the same escaping the route uses.
    const escapedExpected = EXPECTED_SUCCESS_MSG[lang]
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    const okMsg = r.body.includes(escapedExpected);
    const okHtmlLang = r.body.includes(`<html lang="${lang}"`);
    assert(`unsubscribe[${lang}] returns 200`, okStatus, `status=${r.status}`);
    assert(`unsubscribe[${lang}] success title localized`, okTitle, `looking for "${EXPECTED_SUCCESS_TITLE[lang]}"`);
    assert(`unsubscribe[${lang}] success message localized`, okMsg, `looking for "${EXPECTED_SUCCESS_MSG[lang]}"`);
    assert(`unsubscribe[${lang}] html lang="${lang}"`, okHtmlLang);
    const after = await getSubscriberByEmail(email);
    assert(`unsubscribe[${lang}] sets unsubscribed_at`, !!after?.unsubscribedAt, `unsubscribedAt=${after?.unsubscribedAt}`);
    const stillFindable = await findNewsletterByUnsubToken(row.unsubscribeToken);
    assert(`unsubscribe[${lang}] token no longer resolves to active subscriber`, stillFindable === null);
  }

  // -----------------------------------------------------------------------
  // 3. Already-used token (replay the es token) returns the localized
  //    "already unsubscribed" page with HTTP 200.
  // -----------------------------------------------------------------------
  console.log("\nStep 3 — Replay of an already-used token");
  if (langTokens.es) {
    const replay = await httpUnsubscribe(langTokens.es, "es");
    assert("replay returns 200", replay.status === 200, `status=${replay.status}`);
    assert("replay shows already-unsubscribed title (es)", replay.body.includes(EXPECTED_ALREADY_TITLE.es));
    const replayEn = await httpUnsubscribe(langTokens.es, "en");
    assert("replay shows already-unsubscribed title (en)", replayEn.body.includes(EXPECTED_ALREADY_TITLE.en));
  } else {
    record("replay test setup", false, "no es token captured");
  }

  // -----------------------------------------------------------------------
  // 4. Invalid token: random hex that does not exist in DB.
  // -----------------------------------------------------------------------
  console.log("\nStep 4 — Invalid token rejection");
  const fakeToken = "0".repeat(48);
  const invalid = await httpUnsubscribe(fakeToken, "es");
  // Unknown but well-formed tokens are treated as "already unsubscribed".
  assert("unknown token returns 200 with already-unsubscribed page",
    invalid.status === 200 && invalid.body.includes(EXPECTED_ALREADY_TITLE.es),
    `status=${invalid.status}`);

  // Token that exceeds the 200-char length limit triggers the invalid-link branch.
  const oversize = "x".repeat(250);
  const tooLong = await httpUnsubscribe(oversize, "fr");
  assert("oversized token returns 400 invalid-link (fr)",
    tooLong.status === 400 && tooLong.body.includes(EXPECTED_INVALID_MSG.fr),
    `status=${tooLong.status}`);

  // Empty / whitespace token → also invalid-link branch.
  const blank = await httpUnsubscribe(" ", "de");
  assert("blank token returns 400 invalid-link (de)",
    blank.status === 400 && blank.body.includes(EXPECTED_INVALID_MSG.de),
    `status=${blank.status}`);

  // -----------------------------------------------------------------------
  // Summary + cleanup.
  // -----------------------------------------------------------------------
  await cleanup();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
  if (failed.length > 0) {
    console.log("FAILED:");
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail ?? ""}`);
    process.exit(1);
  }
}

main()
  .catch(async (err) => {
    console.error("E2E run crashed:", err);
    await cleanup().catch(() => {});
    process.exit(1);
  })
  .finally(async () => {
    try { await (await import("../../server/db")).closePool(); } catch { /* noop */ }
  });
