/**
 * Shared email-snapshot fixtures + render helpers.
 *
 * Single source of truth consumed by both:
 *   - `scripts/email/render-all-snapshots.ts` (manual review tool —
 *     `npm run email:snapshots`)
 *   - `tests/email-snapshot-regression.test.ts` (CI gate — fails when
 *     rendered HTML drifts from the committed baselines)
 *
 * Keeping the fixtures + per-template renderer wiring in one place is
 * the whole point of Task #77: it guarantees the manual snapshots and
 * the regression baselines stay in lock-step. If a reviewer regenerates
 * `reports/email-snapshots/` and the CI baselines under
 * `tests/__snapshots__/email/`, both come from the exact same render
 * pipeline driven from `renderAllSnapshots()` below.
 */

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

export const LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];

// Stable placeholder data — chosen to look real enough for layout review
// without resembling any actual customer. Madrid wall-time, ISO dates,
// representative income / savings figures. Phone + emails are obvious
// fixtures (example.com, +34 600 000 000) so leak audits flag them
// immediately if they ever escape into a live test path.
export const FIXTURE_NAME_BY_LANG: Record<SupportedLang, string> = {
  es: "María Hernández",
  en: "Sarah Johnson",
  fr: "Léa Dubois",
  de: "Lukas Müller",
  pt: "João Almeida",
  ca: "Marc Puig",
};

export const FIXTURE_DATE = "2026-05-14";
export const FIXTURE_START = "10:00";
export const FIXTURE_END = "10:30";
export const FIXTURE_EMAIL = "fixture-recipient@example.com";
export const FIXTURE_PHONE = "+34600000000";
export const FIXTURE_AGENDA_ID = "agd_snap_0001";
export const MANAGE_URL = "https://exentax.com/agenda/snap-token-0001";

export function bookingFixture(lang: SupportedLang): BookingEmailData {
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

export function reminderFixture(lang: SupportedLang): ReminderEmailData {
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

export function rescheduleFixture(lang: SupportedLang): RescheduleEmailData {
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

export function cancellationFixture(lang: SupportedLang): CancellationEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    date: FIXTURE_DATE,
    startTime: FIXTURE_START,
    endTime: FIXTURE_END,
    language: lang,
  };
}

export function noShowFixture(lang: SupportedLang): NoShowEmailData {
  return {
    clientName: FIXTURE_NAME_BY_LANG[lang],
    clientEmail: FIXTURE_EMAIL,
    language: lang,
  };
}

export function calculatorFixture(lang: SupportedLang): CalculatorEmailData {
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
export function renderNewsletterSnapshot(lang: SupportedLang): { html: string; subject: string } {
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

export interface Snapshot {
  slug: string;
  template: string;
  lang: SupportedLang;
  subject: string;
  html: string;
}

/**
 * Render every template × language combination. Returns the list in a
 * deterministic order so the regression test produces stable iteration
 * and the manual snapshot tool writes files in a predictable sequence.
 *
 * 12 templates × 6 languages = 72 snapshots. Adding a new template?
 * Add it here and re-run `UPDATE_SNAPSHOTS=1 npm run test:email-snapshot-regression`
 * to commit its baselines, plus `npm run email:snapshots` to refresh
 * the manual review HTML.
 */
export function renderAllSnapshots(): Snapshot[] {
  const snapshots: Snapshot[] = [];
  for (const lang of LANGS) {
    {
      const r = renderBookingConfirmationHtml(bookingFixture(lang));
      snapshots.push({ slug: "booking-confirmation", template: "booking-confirmation", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderReminderEmailHtml(reminderFixture(lang));
      snapshots.push({ slug: "booking-reminder", template: "booking-reminder", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderRescheduleEmailHtml(rescheduleFixture(lang));
      snapshots.push({ slug: "reschedule-confirmation", template: "reschedule-confirmation", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderCancellationEmailHtml(cancellationFixture(lang));
      snapshots.push({ slug: "cancellation", template: "cancellation", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderNoShowEmailHtml(noShowFixture(lang));
      snapshots.push({ slug: "no-show-reschedule", template: "no-show-reschedule", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderFollowupEmailHtml({
        clientName: FIXTURE_NAME_BY_LANG[lang],
        clientEmail: FIXTURE_EMAIL,
        language: lang,
      });
      snapshots.push({ slug: "post-meeting-followup", template: "post-meeting-followup", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderIncompleteBookingEmailHtml({
        clientEmail: FIXTURE_EMAIL,
        clientName: FIXTURE_NAME_BY_LANG[lang],
        language: lang,
      });
      snapshots.push({ slug: "incomplete-booking", template: "incomplete-booking", lang, subject: r.subject, html: r.html });
    }
    {
      const r = renderCalculatorEmailHtml(calculatorFixture(lang));
      snapshots.push({ slug: "calculator-result", template: "calculator-result", lang, subject: r.subject, html: r.html });
    }
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
    {
      const r = renderNewsletterSnapshot(lang);
      snapshots.push({ slug: "newsletter", template: "newsletter", lang, subject: r.subject, html: r.html });
    }
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
  return snapshots;
}
