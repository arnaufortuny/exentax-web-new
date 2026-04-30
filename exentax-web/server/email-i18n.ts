import { SUPPORTED_LANGS, type SupportedLang, BRAND_NAME } from "./server-constants";
import { type EmailTranslations } from "./email-i18n/types";
import { esTranslations } from "./email-i18n/es";
import { enTranslations } from "./email-i18n/en";
import { frTranslations } from "./email-i18n/fr";
import { deTranslations } from "./email-i18n/de";
import { ptTranslations } from "./email-i18n/pt";
import { caTranslations } from "./email-i18n/ca";

export function resolveEmailLang(lang?: string | null): SupportedLang {
  if (!lang) return "es";
  const normalized = lang.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.includes(normalized)) return normalized as SupportedLang;
  return "es";
}

/**
 * Centralised i18n bundles for layout chrome that lives in
 * `email-layout.ts`: signature title, Google Meet block, phone-call
 * block. Keeping these next to the rest of the email copy guarantees
 * the translation team only ever has to look in ONE file (Task #1
 * Phase A — code structure: separate concerns from the layout file).
 *
 * The layout module re-exports these so existing call sites keep
 * working without churn; new code should import from here directly.
 */
export const SIGNATURE_TITLE_I18N: Record<SupportedLang, string> = {
  es: "Asesora Fiscal",
  en: "Tax Advisor",
  fr: "Conseillère Fiscale",
  de: "Steuerberaterin",
  pt: "Assessora Fiscal",
  ca: "Assessora Fiscal",
};

export const MEET_I18N: Record<SupportedLang, { title: string; joinBtn: string; joinSub: string; pending: string }> = {
  es: { title: "Videollamada Google Meet", joinBtn: "Unirme a la reunión", joinSub: "Únete desde cualquier dispositivo a la hora acordada.", pending: "Te enviaremos el enlace de Google Meet en las próximas horas, antes de la reunión." },
  en: { title: "Google Meet Video Call", joinBtn: "Join meeting", joinSub: "Join from any device at the scheduled time.", pending: "We'll send you the Google Meet link in the next few hours, before the meeting." },
  fr: { title: "Appel vidéo Google Meet", joinBtn: "Rejoindre la réunion", joinSub: "Rejoignez depuis n'importe quel appareil à l'heure prévue.", pending: "Nous vous enverrons le lien Google Meet dans les prochaines heures, avant la réunion." },
  de: { title: "Google Meet Videoanruf", joinBtn: "An Besprechung teilnehmen", joinSub: "Treten Sie zur geplanten Zeit von jedem Gerät bei.", pending: "Wir senden Ihnen den Google Meet Link in den nächsten Stunden vor dem Termin." },
  pt: { title: "Videochamada Google Meet", joinBtn: "Entrar na reunião", joinSub: "Entre de qualquer dispositivo no horário agendado.", pending: "Enviaremos o link do Google Meet nas próximas horas, antes da reunião." },
  ca: { title: "Videotrucada Google Meet", joinBtn: "Unir-me a la reunió", joinSub: "Uneix-te des de qualsevol dispositiu a l'hora acordada.", pending: "T'enviarem l'enllaç de Google Meet en les properes hores, abans de la reunió." },
};

export const PHONE_I18N: Record<SupportedLang, { title: string; intro: (phone: string) => string; sub: string; pendingTitle: string; pendingBody: string }> = {
  es: { title: "Llamada telefónica", intro: (p) => `Te llamaremos al <strong>${p}</strong> a la hora acordada.`, sub: "Asegúrate de tener cobertura y un sitio tranquilo para hablar.", pendingTitle: "Llamada telefónica", pendingBody: "Te llamaremos al teléfono que nos indicaste a la hora acordada." },
  en: { title: "Phone call", intro: (p) => `We'll call you at <strong>${p}</strong> at the scheduled time.`, sub: "Make sure you have coverage and a quiet place to talk.", pendingTitle: "Phone call", pendingBody: "We'll call you at the phone number you provided at the scheduled time." },
  fr: { title: "Appel téléphonique", intro: (p) => `Nous vous appellerons au <strong>${p}</strong> à l'heure prévue.`, sub: "Assurez-vous d'avoir du réseau et un endroit calme pour parler.", pendingTitle: "Appel téléphonique", pendingBody: "Nous vous appellerons au numéro que vous nous avez fourni à l'heure prévue." },
  de: { title: "Telefonanruf", intro: (p) => `Wir rufen Sie zum vereinbarten Zeitpunkt unter <strong>${p}</strong> an.`, sub: "Stellen Sie sicher, dass Sie Empfang und einen ruhigen Ort zum Sprechen haben.", pendingTitle: "Telefonanruf", pendingBody: "Wir rufen Sie zur vereinbarten Zeit unter der angegebenen Telefonnummer an." },
  pt: { title: "Chamada telefónica", intro: (p) => `Ligaremos para o <strong>${p}</strong> à hora agendada.`, sub: "Garanta que tem rede e um local tranquilo para falar.", pendingTitle: "Chamada telefónica", pendingBody: "Ligaremos para o número que nos indicou à hora agendada." },
  ca: { title: "Trucada telefònica", intro: (p) => `Et trucarem al <strong>${p}</strong> a l'hora acordada.`, sub: "Assegura't de tenir cobertura i un lloc tranquil per parlar.", pendingTitle: "Trucada telefònica", pendingBody: "Et trucarem al telèfon que ens vas indicar a l'hora acordada." },
};

/**
 * Localised "rights reserved" suffix shown in every email footer.
 * Centralised so future locale additions touch one place.
 */
export const FOOTER_RIGHTS_I18N: Record<SupportedLang, string> = {
  es: "Todos los derechos reservados",
  en: "All rights reserved",
  fr: "Tous droits réservés",
  de: "Alle Rechte vorbehalten",
  pt: "Todos os direitos reservados",
  ca: "Tots els drets reservats",
};

/**
 * Visible "Unsubscribe" link label rendered in the footer of MARKETING
 * emails only (drip nurture, calculator report, newsletter broadcast).
 * Booking/agenda emails — confirmation, reminder, reschedule,
 * cancellation, no-show, post-meeting follow-up, incomplete-booking
 * reminder — are operational/transactional and intentionally do NOT
 * surface this link, only a "you received this because…" disclaimer.
 */
export const UNSUB_LINK_I18N: Record<SupportedLang, string> = {
  es: "Darse de baja",
  en: "Unsubscribe",
  fr: "Se désinscrire",
  de: "Abmelden",
  pt: "Cancelar inscrição",
  ca: "Donar-se de baixa",
};

/**
 * Composed translations table. The actual per-language data lives in
 * `server/email-i18n/{es,en,fr,de,pt,ca}.ts` so that translators (and
 * the i18n quality audit) can iterate on one language at a time
 * without churning the whole 1700-line file. The TypeScript compiler
 * enforces shape parity across all six bundles via the shared
 * `EmailTranslations` interface from `./email-i18n/types`.
 */
const translations: Record<SupportedLang, EmailTranslations> = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
  pt: ptTranslations,
  ca: caTranslations,
};

export function getEmailTranslations(lang?: string | null): EmailTranslations {
  return translations[resolveEmailLang(lang)];
}

export const COUNTRY_LABELS_I18N: Record<string, Record<string, string>> = {
  es: { espana: "España", mexico: "México", chile: "Chile", "reino-unido": "Reino Unido", belgica: "Bélgica", francia: "Francia", alemania: "Alemania", portugal: "Portugal" },
  en: { espana: "Spain", mexico: "Mexico", chile: "Chile", "reino-unido": "United Kingdom", belgica: "Belgium", francia: "France", alemania: "Germany", portugal: "Portugal" },
  fr: { espana: "Espagne", mexico: "Mexique", chile: "Chili", "reino-unido": "Royaume-Uni", belgica: "Belgique", francia: "France", alemania: "Allemagne", portugal: "Portugal" },
  de: { espana: "Spanien", mexico: "Mexiko", chile: "Chile", "reino-unido": "Vereinigtes Königreich", belgica: "Belgien", francia: "Frankreich", alemania: "Deutschland", portugal: "Portugal" },
  pt: { espana: "Espanha", mexico: "México", chile: "Chile", "reino-unido": "Reino Unido", belgica: "Bélgica", francia: "França", alemania: "Alemanha", portugal: "Portugal" },
  ca: { espana: "Espanya", mexico: "Mèxic", chile: "Xile", "reino-unido": "Regne Unit", belgica: "Bèlgica", francia: "França", alemania: "Alemanya", portugal: "Portugal" },
};

export const IN_COUNTRY_I18N: Record<string, string> = { es: "en", en: "in", fr: "en", de: "in", pt: "em", ca: "a" };

export function resolveLocalLabel(raw: string, lang: string): string {
  if (!raw.includes("|")) return raw;
  const [regLabel, countryKey] = raw.split("|", 2);
  const countryName = COUNTRY_LABELS_I18N[lang]?.[countryKey] || COUNTRY_LABELS_I18N.es[countryKey] || countryKey;
  const prep = IN_COUNTRY_I18N[lang] || "en";
  return `${regLabel} ${prep} ${countryName}`;
}

export { type EmailTranslations };

// Calculator email "fidelity block": labels for the extra signals the
// calculator UI showed (best of three structures, signed deltas vs LLC,
// display currency, special regimes). Centralized here so all email
// localization lives in this file.
export interface CalculatorFidelityLabels {
  best: string;
  vsAuto: string;
  vsSoc: string;
  currency: string;
  opts: string;
  tarifa: string;
  micro: string;
  structure: Record<string, string>;
}

export const CALCULATOR_FIDELITY_I18N: Record<SupportedLang, CalculatorFidelityLabels> = {
  es: { best: "Estructura ganadora", vsAuto: "Frente a autónomo", vsSoc: "Frente a sociedad local", currency: "Divisa de visualización", opts: "Régimen especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autónomo", sociedad: "Sociedad local", llc: "LLC US" } },
  en: { best: "Winning structure", vsAuto: "Vs sole-trader", vsSoc: "Vs local company", currency: "Display currency", opts: "Special regime", tarifa: "Flat rate", micro: "Micro-entrepreneur", structure: { autonomo: "Sole trader", sociedad: "Local company", llc: "US LLC" } },
  fr: { best: "Structure gagnante", vsAuto: "Vs indépendant", vsSoc: "Vs société locale", currency: "Devise d'affichage", opts: "Régime spécial", tarifa: "Tarif plat", micro: "Micro-entrepreneur", structure: { autonomo: "Indépendant", sociedad: "Société locale", llc: "LLC US" } },
  de: { best: "Beste Struktur", vsAuto: "Vs Selbstständig", vsSoc: "Vs lokale GmbH", currency: "Anzeigewährung", opts: "Sonderregelung", tarifa: "Pauschaltarif", micro: "Micro-entrepreneur", structure: { autonomo: "Selbstständig", sociedad: "Lokale GmbH", llc: "US-LLC" } },
  pt: { best: "Estrutura vencedora", vsAuto: "Vs trabalhador independente", vsSoc: "Vs sociedade local", currency: "Moeda de visualização", opts: "Regime especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Trabalhador independente", sociedad: "Sociedade local", llc: "LLC US" } },
  ca: { best: "Estructura guanyadora", vsAuto: "Davant d'autònom", vsSoc: "Davant de societat local", currency: "Divisa de visualització", opts: "Règim especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autònom", sociedad: "Societat local", llc: "LLC US" } },
};

export function getCalculatorFidelityLabels(lang?: string | null): CalculatorFidelityLabels {
  return CALCULATOR_FIDELITY_I18N[resolveEmailLang(lang)];
}

// `BRAND_NAME` is re-exported for callers that imported it transitively
// from this barrel before the modularization. Keeps backward compat.
export { BRAND_NAME };
