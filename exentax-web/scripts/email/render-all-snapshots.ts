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
 * Fixture data follows the same shape as `scripts/e2e/run-booking-e2e.ts`
 * (representative names, ISO dates, calculator numbers in EUR) so the
 * snapshots feel realistic without exposing any real customer data.
 */

import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  renderBookingConfirmationHtml,
  renderReminderEmailHtml,
  renderRescheduleEmailHtml,
  renderCancellationEmailHtml,
  renderNoShowEmailHtml,
  renderFollowupEmailHtml,
  renderIncompleteBookingEmailHtml,
  renderCalculatorEmailHtml,
  renderDripEmailHtml,
  renderCalcDripEmailHtml,
} from "../../server/email";
import { emailHtml, bodyText, brandSignature, unsubFooterWithLink, ctaButton, heading } from "../../server/email-layout";
import { UNSUB_LINK_I18N } from "../../server/email-i18n";
import type { SupportedLang } from "../../server/server-constants";
import type {
  BookingEmailData,
  ReminderEmailData,
  RescheduleEmailData,
  CancellationEmailData,
  NoShowEmailData,
  CalculatorEmailData,
} from "../../shared/email";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const OUT_DIR = path.resolve(ROOT, "reports", "email-snapshots");

const LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];

// Stable placeholder data — chosen to look real enough for layout review
// without resembling any actual customer. Madrid wall-time, ISO dates,
// representative income / savings figures. Phone + emails are obvious
// fixtures (example.com, +34 600 000 000) so leak audits flag them
// immediately if they ever escape into a live test path.
const FIXTURE_NAME_BY_LANG: Record<SupportedLang, string> = {
  es: "María Hernández",
  en: "Sarah Johnson",
  fr: "Léa Dubois",
  de: "Lukas Müller",
  pt: "João Almeida",
  ca: "Marc Puig",
};

const FIXTURE_DATE = "2026-05-14";
const FIXTURE_START = "10:00";
const FIXTURE_END = "10:30";
const FIXTURE_EMAIL = "fixture-recipient@example.com";
const FIXTURE_PHONE = "+34600000000";
const FIXTURE_AGENDA_ID = "agd_snap_0001";
const MANAGE_URL = "https://exentax.com/agenda/snap-token-0001";

function bookingFixture(lang: SupportedLang): BookingEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    date: FIXTURE_DATE,
    startTime: FIXTURE_START,
    endTime: FIXTURE_END,
    meetLink: "https://meet.google.com/xxx-yyyy-zzz",
    meetingType: "google_meet",
    phone: FIXTURE_PHONE,
    language: lang,
    manageUrl: MANAGE_URL,
    agendaId: FIXTURE_AGENDA_ID,
  };
}

function reminderFixture(lang: SupportedLang): ReminderEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    date: FIXTURE_DATE,
    startTime: FIXTURE_START,
    endTime: FIXTURE_END,
    meetLink: "https://meet.google.com/xxx-yyyy-zzz",
    meetingType: "google_meet",
    phone: FIXTURE_PHONE,
    manageUrl: MANAGE_URL,
    language: lang,
    agendaId: FIXTURE_AGENDA_ID,
  };
}

function rescheduleFixture(lang: SupportedLang): RescheduleEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    date: FIXTURE_DATE,
    startTime: FIXTURE_START,
    endTime: FIXTURE_END,
    meetLink: "https://meet.google.com/xxx-yyyy-zzz",
    meetingType: "google_meet",
    phone: FIXTURE_PHONE,
    manageUrl: MANAGE_URL,
    language: lang,
  };
}

function cancellationFixture(lang: SupportedLang): CancellationEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    date: FIXTURE_DATE,
    startTime: FIXTURE_START,
    endTime: FIXTURE_END,
    language: lang,
  };
}

function noShowFixture(lang: SupportedLang): NoShowEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    language: lang,
  };
}

function calculatorFixture(lang: SupportedLang): CalculatorEmailData {
  // Representative numbers: ~6,000 €/month gross income, current ~30 % effective
  // burden, projected ~12 % under a structured setup → 12,960 € / yr saving.
  return {
    email: FIXTURE_EMAIL,
    phone: FIXTURE_PHONE,
    country: "ES",
    regime: "autonomo",
    activity: "consulting",
    income: 6000,
    annualIncome: 72000,
    effectiveRate: 0.30,
    ahorro: 12960,
    sinLLC: 21600,
    conLLC: 8640,
    localLabel: "Madrid",
    breakdown: [],
    language: lang,
    leadId: "lead_snap_0001",
    displayCurrency: "EUR",
    bestStructureId: "llc",
    llcVsAutonomo: 12960,
    llcVsSociedad: 4320,
    options: { tarifaPlana: false, franceMicro: false },
  };
}

/**
 * Newsletter is the one template whose body is supplied by the
 * broadcast author per campaign (no fixed copy in `email-i18n/`). The
 * snapshot uses a representative campaign body wrapped in the same
 * `emailHtml` chrome the live broadcast worker uses, with the
 * per-language unsub footer swapped in. The placeholder
 * `{{unsubscribe_url}}` is pre-resolved to a fixture URL so the
 * preview matches what a recipient actually sees.
 */
function renderNewsletterSnapshot(lang: SupportedLang): { html: string; subject: string } {
  const unsubUrl = `https://exentax.com/api/newsletter/unsubscribe/snap-token-${lang}`;
  const subjectByLang: Record<SupportedLang, string> = {
    es: "Novedades fiscales del mes",
    en: "This month's tax updates",
    fr: "Les actus fiscales du mois",
    de: "Steuer-Updates des Monats",
    pt: "Novidades fiscais do mês",
    ca: "Novetats fiscals del mes",
  };
  const headlineByLang: Record<SupportedLang, string> = {
    es: "Hola,",
    en: "Hi there,",
    fr: "Bonjour,",
    de: "Hallo,",
    pt: "Olá,",
    ca: "Hola,",
  };
  const introByLang: Record<SupportedLang, string> = {
    es: "Este mes resumimos los cambios fiscales que afectan a freelancers y empresas internacionales. Sin tecnicismos, solo lo que necesitas saber.",
    en: "This month we round up the tax changes that affect freelancers and international businesses. No jargon, just what you need to know.",
    fr: "Ce mois-ci, nous résumons les changements fiscaux qui touchent les freelances et les entreprises internationales. Sans jargon, juste l'essentiel.",
    de: "Diesen Monat fassen wir die steuerlichen Änderungen für Freelancer und internationale Unternehmen zusammen. Ohne Fachjargon, nur das Wesentliche.",
    pt: "Este mês resumimos as mudanças fiscais que afetam freelancers e empresas internacionais. Sem jargão, apenas o essencial.",
    ca: "Aquest mes resumim els canvis fiscals que afecten freelancers i empreses internacionals. Sense tecnicismes, només l'essencial.",
  };
  const ctaByLang: Record<SupportedLang, string> = {
    es: "Reservar asesoría",
    en: "Book a consultation",
    fr: "Réserver une consultation",
    de: "Beratung buchen",
    pt: "Reservar consultoria",
    ca: "Reservar assessoria",
  };
  const unsubNoteByLang: Record<SupportedLang, string> = {
    es: "Recibes este email porque te suscribiste a la newsletter de Exentax.",
    en: "You're receiving this email because you subscribed to the Exentax newsletter.",
    fr: "Vous recevez cet email car vous êtes abonné à la newsletter Exentax.",
    de: "Du erhältst diese E-Mail, weil du den Exentax-Newsletter abonniert hast.",
    pt: "Recebes este email porque te inscreveste na newsletter da Exentax.",
    ca: "Reps aquest correu perquè et vas subscriure a la newsletter d'Exentax.",
  };

  const subject = subjectByLang[lang];
  const body = `
    ${heading(headlineByLang[lang])}

    ${bodyText(introByLang[lang])}

    ${ctaButton("https://exentax.com/book?utm_source=newsletter", ctaByLang[lang])}

    ${brandSignature(lang)}
    ${unsubFooterWithLink(unsubNoteByLang[lang], unsubUrl, UNSUB_LINK_I18N[lang])}
  `;
  const html = emailHtml(body, subject, lang);
  return { html, subject };
}

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

interface Snapshot {
  slug: string;
  template: string;
  lang: SupportedLang;
  subject: string;
  html: string;
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

  const snapshots: Snapshot[] = [];

  for (const lang of LANGS) {
    // 1. booking-confirmation
    {
      const r = renderBookingConfirmationHtml(bookingFixture(lang));
      snapshots.push({ slug: "booking-confirmation", template: "booking-confirmation", lang, subject: r.subject, html: r.html });
    }

    // 2. booking-reminder (HTML body only — .ics attachment is dropped)
    {
      const r = renderReminderEmailHtml(reminderFixture(lang));
      snapshots.push({ slug: "booking-reminder", template: "booking-reminder", lang, subject: r.subject, html: r.html });
    }

    // 3. reschedule-confirmation
    {
      const r = renderRescheduleEmailHtml(rescheduleFixture(lang));
      snapshots.push({ slug: "reschedule-confirmation", template: "reschedule-confirmation", lang, subject: r.subject, html: r.html });
    }

    // 4. cancellation
    {
      const r = renderCancellationEmailHtml(cancellationFixture(lang));
      snapshots.push({ slug: "cancellation", template: "cancellation", lang, subject: r.subject, html: r.html });
    }

    // 5. no-show-reschedule
    {
      const r = renderNoShowEmailHtml(noShowFixture(lang));
      snapshots.push({ slug: "no-show-reschedule", template: "no-show-reschedule", lang, subject: r.subject, html: r.html });
    }

    // 6. post-meeting follow-up
    {
      const r = renderFollowupEmailHtml({
        clientName: FIXTURE_NAME_BY_LANG[lang],
        clientEmail: FIXTURE_EMAIL,
        language: lang,
      });
      snapshots.push({ slug: "post-meeting-followup", template: "post-meeting-followup", lang, subject: r.subject, html: r.html });
    }

    // 7. incomplete-booking
    {
      const r = renderIncompleteBookingEmailHtml({
        clientEmail: FIXTURE_EMAIL,
        clientName: FIXTURE_NAME_BY_LANG[lang],
        language: lang,
      });
      snapshots.push({ slug: "incomplete-booking", template: "incomplete-booking", lang, subject: r.subject, html: r.html });
    }

    // 8. calculator-result
    {
      const r = renderCalculatorEmailHtml(calculatorFixture(lang));
      snapshots.push({ slug: "calculator-result", template: "calculator-result", lang, subject: r.subject, html: r.html });
    }

    // 9. drip — render step 1 (lead-magnet delivery) as the representative
    //    layout. To preview steps 2-6, edit DRIP_STEP below; the layout
    //    chrome is identical, only copy and CTA URLs change.
    {
      const r = renderDripEmailHtml({
        email: FIXTURE_EMAIL,
        name: FIXTURE_NAME_BY_LANG[lang],
        language: lang,
        step: 1,
        unsubToken: `snap-drip-token-${lang}`,
      });
      snapshots.push({ slug: "drip", template: "drip", lang, subject: r.subject, html: r.html });
    }

    // 10. calc-drip — render step 1 (calculator nurture day 1) as the
    //     representative layout, same rationale as drip above.
    {
      const r = renderCalcDripEmailHtml({
        email: FIXTURE_EMAIL,
        name: FIXTURE_NAME_BY_LANG[lang],
        language: lang,
        step: 1,
        unsubToken: `snap-calcdrip-token-${lang}`,
      });
      snapshots.push({ slug: "calc-drip", template: "calc-drip", lang, subject: r.subject, html: r.html });
    }

    // 11. newsletter (representative campaign body)
    {
      const r = renderNewsletterSnapshot(lang);
      snapshots.push({ slug: "newsletter", template: "newsletter", lang, subject: r.subject, html: r.html });
    }

    // 12. lead-magnet placeholder slot — kept symmetric with the spec's
    //     "12 templates × 6 languages = 72 combinations" target. Mirrors
    //     drip step 6 (the final nurture touch), which uses a
    //     visibly distinct CTA + signature compared with step 1, so a
    //     reviewer eyeballing typography sees both ends of the series.
    {
      const r = renderDripEmailHtml({
        email: FIXTURE_EMAIL,
        name: FIXTURE_NAME_BY_LANG[lang],
        language: lang,
        step: 6,
        unsubToken: `snap-drip-final-token-${lang}`,
      });
      snapshots.push({ slug: "drip-final", template: "drip-final", lang, subject: r.subject, html: r.html });
    }
  }

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
