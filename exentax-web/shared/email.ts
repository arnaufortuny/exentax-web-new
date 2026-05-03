export interface EmailAttachment {
  filename: string;
  mimeType: string;
  content: Buffer;
}

export type MeetingType = "google_meet" | "phone_call";

export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  meetingType?: MeetingType;
  phone?: string | null;
  notes?: string | null;
  context?: string | null;
  language?: string | null;
  clientIp?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
  beneficioMensual?: string;
  clientesMundiales?: boolean;
  operaDigital?: boolean;
  notaCompartir?: string;
  manageUrl?: string | null;
  agendaId?: string;
}

export interface CalculatorEmailData {
  email: string;
  phone: string;
  country: string;
  regime: string;
  activity: string;
  income: number;
  incomeMode?: string;
  annualIncome?: number;
  effectiveRate?: number;
  ahorro: number;
  sinLLC: number;
  conLLC: number;
  localLabel: string;
  breakdown: Array<{ label: string; amount: number }>;
  calcSpainIrpf?: boolean;
  clientIp?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
  language?: string | null;
  leadId?: string;
  /**
   * Optional fidelity fields that mirror the UI result on the email.
   *
   * Audit Task #8 — extended fidelity fields. The calculator UI carries
   * these in its result; the email payload mirrors them so the message
   * reflects exactly what the user saw on screen (display currency, the
   * winning structure of the 3-way comparator, and the signed deltas).
   * All five are optional for backward compatibility.
   */
  displayCurrency?: string;
  bestStructureId?: "autonomo" | "sociedad" | "llc";
  llcVsAutonomo?: number;
  llcVsSociedad?: number;
  options?: { tarifaPlana?: boolean; franceMicro?: boolean; vatMode?: "general" | "exportB2B"; germanyHebesatz?: "low" | "medium" | "high"; germanyHebesatzCustom?: number };
  /**
   * Comunidad Autónoma (España) explicitly chosen by the visitor — one of
   * the 19 keys in `CCAA_PROFILE_MAP` (17 CCAA + Ceuta + Melilla + the two
   * forales: País Vasco and Navarra). When present, the calculator email
   * appends the localised CCAA name to the residence row ("España ·
   * Madrid") and adds a foral-regime note for País Vasco / Navarra.
   * Optional so older clients and non-Spain leads keep working.
   */
  ccaa?: string;
}

export interface ReminderEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  meetingType?: MeetingType;
  phone?: string | null;
  manageUrl?: string | null;
  language?: string | null;
  agendaId?: string | null;
}

export interface RescheduleEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  meetingType?: MeetingType;
  phone?: string | null;
  manageUrl: string;
  language?: string | null;
}

export interface CancellationEmailData {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  language?: string | null;
}

export interface NoShowEmailData {
  clientName: string;
  clientEmail: string;
  language?: string | null;
}
