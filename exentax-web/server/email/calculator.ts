import { logger } from "../logger";
import { getEmailTranslations, resolveEmailLang, resolveLocalLabel, getCalculatorFidelityLabels, resolveCcaaLabel, UNSUB_LINK_I18N } from "../email-i18n";
import { registerEmailRetryHandler } from "../email-retry-queue";
import {
  emailHtml, label, heading, bodyText, divider, ctaButton, brandSignature, unsubNote, unsubFooterWithLink,
  infoCard, bulletList,
  SITE_URL,
  C_BG, C_NEON, C_NEON_DK, C_TEXT_1, C_TEXT_2, C_TEXT_3, C_BORDER,
  C_ACCENT, C_ACCENT_BG, C_ACCENT_BD, F_STACK,
} from "../email-layout";
import { escapeHtml } from "../routes/shared";
import { FX_RATES_PER_EUR, convertFromEUR as fxConvertFromEUR } from "../../shared/calculator-fx";
import { getLocalizedPath } from "../../shared/routes";
import type { CalculatorEmailData } from "../../shared/email";
import {
  REPLY_TO_EMAIL,
  TRANSACTIONAL_UNSUB_MAILTO,
  getGmailClient,
  sendEmail,
  senderNameFor,
  withUtm,
  headerPolicyFor,
  logEmail,
  maskEmail,
  withRetryQueue,
} from "./transport";

export function renderCalculatorEmailHtml(data: CalculatorEmailData, opts?: { unsubUrl?: string }): { html: string; subject: string; lang: string } {
  const lang = resolveEmailLang(data.language);
  const t = getEmailTranslations(lang);
  const ct = t.calculator;
  // FX parity: same rates the UI uses (shared/calculator-fx.ts).
  const dc = (data.displayCurrency && (FX_RATES_PER_EUR as Record<string, number>)[data.displayCurrency]) ? data.displayCurrency : "EUR";
  const fmtMoney = (eurAmount: number): string => {
    const localized = t.currencyFormatter(Math.round(fxConvertFromEUR(eurAmount, dc)));
    return dc === "EUR" ? localized : `${localized} ${dc}`;
  };
  const ahorroF = fmtMoney(data.ahorro);
  const sinLLCF = fmtMoney(data.sinLLC);
  const conLLCF = fmtMoney(data.conLLC);
  const annualF = fmtMoney(data.annualIncome ?? data.income * 12);
  // Country / residence row. When the visitor explicitly chose a CCAA (Task #53)
  // we append the localised CCAA name so the email mirrors what they see on
  // screen ("Autónomo en España · Madrid"). País Vasco / Navarra additionally
  // get a foral-regime caveat further down because their IRPF is not the
  // state scale that the calculator models.
  const baseLocalLabel = resolveLocalLabel(data.localLabel, lang);
  const ccaaLabel = data.country === "espana" ? resolveCcaaLabel(data.ccaa, lang) : null;
  const countryLabel = ccaaLabel ? `${baseLocalLabel} · ${escapeHtml(ccaaLabel)}` : baseLocalLabel;
  const isForalCcaa = data.country === "espana" && (data.ccaa === "paisVasco" || data.ccaa === "navarra");
  const foralNoticeByLang: Record<string, string> = {
    es: "País Vasco y Navarra tienen régimen foral propio (Concierto/Convenio Económico). El IRPF lo regulan las Diputaciones Forales o la Hacienda Foral de Navarra, no la escala estatal — esta estimación es orientativa.",
    en: "Basque Country and Navarra have their own foral tax system (Concierto/Convenio Económico). Income tax is set by the Foral Treasuries, not the state scale — this estimate is approximate.",
    fr: "Le Pays basque et la Navarre disposent d'un régime fiscal foral propre (Concierto/Convenio Económico). L'impôt sur le revenu y est fixé par les Trésoreries forales, pas par le barème étatique — estimation indicative.",
    de: "Das Baskenland und Navarra haben ein eigenes foral-Steuersystem (Concierto/Convenio Económico). Die Einkommensteuer wird von den foralen Finanzbehörden festgelegt, nicht nach der staatlichen Skala — diese Schätzung ist orientierend.",
    pt: "O País Basco e Navarra têm regime foral próprio (Concierto/Convenio Económico). O IRPF é regulado pelas Diputaciones Forales ou pela Hacienda Foral de Navarra, não pela tabela estatal — estimativa indicativa.",
    ca: "El País Basc i Navarra tenen règim foral propi (Concert/Conveni Econòmic). L'IRPF el regulen les Diputacions Forals o la Hisenda Foral de Navarra, no l'escala estatal — estimació orientativa.",
  };
  const foralNotice = isForalCcaa ? (foralNoticeByLang[lang] || foralNoticeByLang.es) : null;

  // Localized labels for the calculator fidelity block — centralized in email-i18n.ts.
  const fi = getCalculatorFidelityLabels(lang);
  const fidelityRows: Array<{ label: string; value: string }> = [];
  if (data.bestStructureId) {
    const name = fi.structure[data.bestStructureId] || data.bestStructureId;
    fidelityRows.push({ label: fi.best, value: name });
  }
  if (typeof data.llcVsAutonomo === "number" && Number.isFinite(data.llcVsAutonomo)) {
    const sign = data.llcVsAutonomo >= 0 ? "+" : "−";
    fidelityRows.push({ label: fi.vsAuto, value: `${sign}${fmtMoney(Math.abs(data.llcVsAutonomo))}` });
  }
  if (typeof data.llcVsSociedad === "number" && Number.isFinite(data.llcVsSociedad)) {
    const sign = data.llcVsSociedad >= 0 ? "+" : "−";
    fidelityRows.push({ label: fi.vsSoc, value: `${sign}${fmtMoney(Math.abs(data.llcVsSociedad))}` });
  }
  if (dc !== "EUR") {
    fidelityRows.push({ label: fi.currency, value: escapeHtml(dc) });
  }
  const optList: string[] = [];
  if (data.options?.tarifaPlana) optList.push(fi.tarifa);
  if (data.options?.franceMicro) optList.push(fi.micro);
  if (data.options?.vatMode === "exportB2B") optList.push(fi.exportB2B);
  if (optList.length > 0) fidelityRows.push({ label: fi.opts, value: optList.join(", ") });

  const fidelityBlock = fidelityRows.length === 0 ? "" : `
    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr><td class="bg-dark" style="padding:18px 20px;background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:16px;" bgcolor="${C_BG}">
        ${fidelityRows.map(r => `<p style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 6px;"><span style="color:${C_TEXT_3};">${escapeHtml(r.label)}:</span> <strong style="color:${C_TEXT_1};">${r.value}</strong></p>`).join("")}
      </td></tr>
    </table>
  `;

  const clientBody = `
    ${heading(ct.heading(escapeHtml(data.email.split("@")[0])))}

    ${bodyText(ct.intro)}

    ${divider()}

    ${label(ct.situationTitle)}

    ${infoCard([
      { icon: "pin", label: ct.residenceLabel, value: countryLabel },
      { icon: "calendar", label: ct.incomeLabel, value: annualF },
    ])}

    ${foralNotice ? `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr><td style="padding:14px 18px;background-color:${C_ACCENT_BG};border:1px solid ${C_ACCENT_BD};border-radius:14px;" bgcolor="${C_ACCENT_BG}">
        <p style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_2};margin:0;line-height:1.55;">${escapeHtml(foralNotice)}</p>
      </td></tr>
    </table>
    ` : ""}

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td style="padding:18px 20px;background-color:${C_ACCENT_BG};border:1px solid ${C_ACCENT_BD};border-radius:16px;text-align:center;" bgcolor="${C_ACCENT_BG}">
          <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 6px;font-weight:600;">${ct.currentTitle}</p>
          <p class="txt-2" style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 4px;">${ct.currentPrefix}</p>
          <p class="txt-accent" style="font-family:${F_STACK};font-size:28px;font-weight:700;color:${C_ACCENT};margin:0;">${sinLLCF}</p>
        </td>
      </tr>
    </table>

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td class="bg-dark" style="padding:18px 20px;background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:16px;text-align:center;" bgcolor="${C_BG}">
          <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 6px;font-weight:600;">${ct.optimizedTitle}</p>
          <p class="txt-2" style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 4px;">${ct.optimizedPrefix}</p>
          <p class="txt-neon" style="font-family:${F_STACK};font-size:28px;font-weight:700;color:${C_NEON_DK};margin:0;">${conLLCF}</p>
        </td>
      </tr>
    </table>

    ${divider()}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;">
      <tr><td class="bg-dark" style="background-color:${C_BG};border:1px solid ${C_BORDER};border-radius:20px;padding:28px 24px;text-align:center;" bgcolor="${C_BG}">
        <p class="txt-neon" style="font-family:${F_STACK};font-size:10px;font-weight:700;color:${C_NEON_DK};text-transform:uppercase;margin:0 0 10px;">${ct.differenceTitle}</p>
        <p class="txt-neon-bright" style="font-family:${F_STACK};font-size:44px;font-weight:700;color:${C_NEON};margin:0;line-height:1;">${ahorroF}</p>
        <p class="txt-3" style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_3};margin:10px 0 0;">${ct.perYear}</p>
      </td></tr>
    </table>

    ${fidelityBlock}

    ${divider()}

    ${bodyText(ct.disclaimer)}

    ${bodyText(ct.keyIntro)}

    ${bulletList(ct.keyItems)}

    ${divider()}

    ${bodyText(`<strong>${ct.failNote}</strong>`)}

    ${divider()}

    ${label(ct.whatWeDoTitle)}

    ${bodyText(ct.whatWeDoIntro1)}

    ${bodyText(ct.whatWeDoIntro2)}

    ${bulletList(ct.whatWeDoItems)}

    ${bodyText(ct.whatWeDoDisclaimer, "8px")}

    ${divider()}

    ${bodyText(ct.ctaIntro)}

    ${ctaButton(withUtm(`${SITE_URL}${getLocalizedPath("book", lang)}`, "transactional", "calculator_result", lang), ct.ctaButton)}

    ${bodyText(ct.ctaDesc)}

    ${brandSignature(lang)}
    ${opts?.unsubUrl
      ? unsubFooterWithLink(ct.unsubNote, opts.unsubUrl, UNSUB_LINK_I18N[lang])
      : unsubNote(ct.unsubNote)}
  `;

  const subject = `${ct.subjectPrefix} | ${ahorroF}`;
  const html = emailHtml(clientBody, subject, lang);
  return { html, subject, lang };
}

async function sendCalculatorEmailOnce(data: CalculatorEmailData): Promise<void> {
  // Calculator is a one-shot automated marketing email (single send per
  // lead, no recurring list). Per the email-system policy we still
  // surface a visible unsubscribe affordance — but since there is no
  // per-recipient enrollment row, the only honest opt-out is the mailto
  // form (auto-handled by `email-suppression`). Booking emails do not
  // get this footer at all (operational notifications about the user's
  // own appointment cannot be opted out).
  const { html: clientHtml, subject: clientSubject, lang } = renderCalculatorEmailHtml(data, { unsubUrl: TRANSACTIONAL_UNSUB_MAILTO });
  const gmail = getGmailClient();
  const leadRef = data.leadId || "—";
  if (!gmail) {
    logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: "fallido", error: "Gmail not configured", relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
    throw new Error("gmail_not_configured");
  }
  const sent = await sendEmail(data.email, clientSubject, clientHtml, REPLY_TO_EMAIL, senderNameFor("transactional"), undefined, undefined, { ...headerPolicyFor("marketing-1to1"), listUnsubscribe: TRANSACTIONAL_UNSUB_MAILTO, entityRefId: leadRef !== "—" ? `calculator-${leadRef}` : undefined });
  logEmail({ to: data.email, subject: clientSubject, type: "calculator_result", channel: "transactional", status: sent ? "enviado" : "fallido", clientLanguage: lang, relatedId: leadRef !== "—" ? leadRef : undefined, relatedType: "lead" });
  if (!sent) throw new Error("circuit_breaker_or_transient_failure");
  logger.info(`Calculator lead sent → ${maskEmail(data.email)}`, "email");
}

export async function sendCalculatorEmail(data: CalculatorEmailData): Promise<void> {
  await withRetryQueue("calculator_report", data, sendCalculatorEmailOnce);
}
registerEmailRetryHandler("calculator_report", async (payload) => {
  await sendCalculatorEmailOnce(payload as CalculatorEmailData);
});
