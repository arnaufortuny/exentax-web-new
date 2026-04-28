import type { SupportedLang } from "../server-constants";

/**
 * Shape of the localized bundle every language file under
 * `server/email-i18n/{lang}.ts` must export. The interface is
 * shared so the per-language bundles stay in lock-step (adding a
 * new field forces all 6 languages to translate it before the
 * project compiles).
 */
export interface EmailTranslations {
  booking: {
    subjectPrefix: string;
    heading: (name: string) => string;
    intro: string;
    introDesc: string;
    honestNote: string;
    detailsTitle: string;
    dateLabel: string;
    timeLabel: string;
    prepareTitle: string;
    prepareItems: string[];
    coverTitle: string;
    coverItems: string[];
    weDoNote1: string;
    weDoNote2: string;
    ctaManage: string;
    orWrite: string;
    closing: string;
    refLabel: string;
    unsubNote: string;
  };
  reminder: {
    subject: (startTime: string) => string;
    heading: (name: string) => string;
    intro: string;
    detailsTitle: string;
    dateLabel: string;
    timeLabel: string;
    timezoneNote: string;
    briefTitle: string;
    briefDesc: string;
    prepareTitle: string;
    prepareItems: string[];
    prepareNote: string;
    addCalendarTitle: string;
    addCalendarDesc: string;
    addCalendarCta: string;
    icsAttachedNote: string;
    manageTitle: string;
    manageDesc: string;
    ctaManage: string;
    closing: string;
    unsubNote: string;
    calendarSummary: string;
    calendarDescription: (manageUrl: string | null) => string;
    phoneCallLocation: string;
  };
  calculator: {
    subjectPrefix: string;
    heading: (name: string) => string;
    intro: string;
    situationTitle: string;
    residenceLabel: string;
    incomeLabel: string;
    currentTitle: string;
    currentPrefix: string;
    optimizedTitle: string;
    optimizedPrefix: string;
    differenceTitle: string;
    perYear: string;
    disclaimer: string;
    keyIntro: string;
    keyItems: string[];
    failNote: string;
    whatWeDoTitle: string;
    whatWeDoIntro1: string;
    whatWeDoIntro2: string;
    whatWeDoItems: string[];
    whatWeDoDisclaimer: string;
    ctaIntro: string;
    ctaButton: string;
    ctaDesc: string;
    unsubNote: string;
  };
  reschedule: {
    subject: string;
    heading: (name: string) => string;
    intro: string;
    dateLabel: string;
    timeLabel: string;
    focusNote: string;
    manageNote: string;
    ctaManage: string;
    closing: string;
    unsubNote: string;
  };
  cancellation: {
    subject: string;
    heading: (name: string) => string;
    intro: string;
    dateLabel: string;
    timeLabel: string;
    rebookNote: string;
    ctaRebook: string;
    rebookDesc: string;
    whatsappNote: string;
    unsubNote: string;
  };
  noShow: {
    subject: string;
    heading: (name: string) => string;
    intro: string;
    understandNote: string;
    rebookIntro: string;
    ctaRebook: string;
    sessionDesc: string;
    whatsappIntro: string;
    closing: string;
    unsubNote: string;
  };
  followup: {
    subject: string;
    heading: (firstName: string) => string;
    intro: (firstName: string) => string;
    ctaLabel: string;
    closing: string;
    unsubNote: string;
  };
  incompleteBooking: {
    subject: string;
    heading: (firstName?: string | null) => string;
    intro1: string;
    intro2: string;
    intro3: string;
    ctaLabel: string;
    replyNote: string;
    closing: string;
    unsubNote: string;
  };
  drip: {
    // CTA labels (rendered as buttons; CTAs are placeholders in the
    // attached copy, e.g. "[Open my guide →]" — we strip the brackets and
    // arrow and render a real button instead).
    ctaOpenGuide: string;
    ctaCalculate: string;
    ctaBook: string;
    // Personalised salutation reused across all 6 steps. When `name`
    // is present we render "Hola {name}," / "Hi {name},"; when not we
    // fall back to the bare cultural greeting. Each locale implements
    // its own grammar (German keeps informal "Hallo {name}," to match
    // the rest of the brand voice).
    greeting: (name?: string | null) => string;
    // Closing line shown above the brand signature in every step.
    sigClosing: string;
    unsubNote: string;
    steps: Array<{
      subject: string;
      // Each paragraph is rendered through `bodyText()`; line break in
      // the attached copy → separate paragraph here.
      paragraphs: string[];
      // Optional postscript shown after the CTA / closing block.
      // Only used on the final step (day 15) to maximise reply-rate
      // without breaking the no-pressure voice.
      ps?: string;
    }>;
  };
  dateFormatter: (dateStr: string) => string;
  currencyFormatter: (amount: number) => string;
}


/**
 * Re-export `SupportedLang` so the per-language files do not have
 * to know about the absolute path to `server-constants`.
 */
export type { SupportedLang };
