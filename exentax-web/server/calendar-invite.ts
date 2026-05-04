import type { EmailAttachment, MeetingType } from "../shared/email";
import { madridWallTimeToUtcMs } from "../shared/madrid-time";
import { BRAND_NAME, SITE_URL } from "./server-constants";

interface CalendarInput {
  date: string;
  startTime: string;
  endTime: string;
  summary: string;
  description: string;
  meetingType?: MeetingType;
  meetLink?: string | null;
  phone?: string | null;
  manageUrl?: string | null;
  agendaId?: string | null;
  clientEmail: string;
  /**
   * Localized label used as the calendar location for phone_call meetings
   * (e.g. "Phone call", "Llamada telefónica"). Falls back to a neutral
   * English label if not provided so the .ics still validates.
   */
  phoneCallLabel?: string;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function utcMsToIcsBasic(ms: number): string {
  const d = new Date(ms);
  return (
    d.getUTCFullYear().toString() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}

// Wall-clock formatter used when DTSTART/DTEND carry a `TZID=Europe/Madrid`
// parameter. Apple Calendar and Outlook display the local time the user
// expects (e.g. "09:00 Madrid"), not the UTC instant. RFC 5545 §3.3.5.
function madridWallTimeToIcsLocal(date: string, time: string): string {
  // date = "2026-03-29", time = "09:00" → "20260329T090000"
  const ymd = date.replace(/-/g, "");
  const hm = time.replace(":", "");
  return `${ymd}T${hm}00`;
}

// VTIMEZONE block for Europe/Madrid. Required by RFC 5545 §3.6.5 whenever
// any DTSTART/DTEND carries a TZID. The transition rules below model the
// EU permanent DST policy (last Sunday March +1h, last Sunday October -1h)
// and stay valid as long as that policy holds.
const VTIMEZONE_EUROPE_MADRID: ReadonlyArray<string> = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Madrid",
  "X-LIC-LOCATION:Europe/Madrid",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  chunks.push(line.slice(0, 75));
  i = 75;
  while (i < line.length) {
    chunks.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join("\r\n");
}

function buildLocation(input: CalendarInput): string {
  if (input.meetingType === "phone_call") {
    const label = input.phoneCallLabel || "Phone call";
    return input.phone ? `${label} · ${input.phone}` : label;
  }
  return input.meetLink || "Google Meet";
}

export function buildIcsContent(input: CalendarInput): string {
  // DTSTAMP is always UTC per RFC 5545 §3.3.5.
  const dtStamp = utcMsToIcsBasic(Date.now());
  // DTSTART/DTEND carry a TZID parameter so calendar apps display the time in
  // Madrid local (e.g. "09:00") rather than the UTC instant. Without this,
  // Apple Calendar/Outlook show the UTC time (07:00 in summer / 08:00 in
  // winter) which is wrong from the user's perspective. We still include
  // VTIMEZONE so clients that don't ship the IANA tz db can resolve the offset.
  const dtStart = madridWallTimeToIcsLocal(input.date, input.startTime);
  const dtEnd = madridWallTimeToIcsLocal(input.date, input.endTime);
  // Kept around for tests / debugging: the UTC instant we'd emit if a client
  // ignored TZID. Not currently used in the file body but documents intent.
  void madridWallTimeToUtcMs;

  const uidSeed = input.agendaId
    ? input.agendaId
    : `${input.date}-${input.startTime}-${input.clientEmail}`;
  const domain = SITE_URL.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "exentax.com";
  const uid = `${uidSeed}@${domain}`;

  const url = input.manageUrl || input.meetLink || SITE_URL;
  const location = buildLocation(input);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    `PRODID:-//${BRAND_NAME}//Booking Reminder//EN`,
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...VTIMEZONE_EUROPE_MADRID,
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Europe/Madrid:${dtStart}`,
    `DTEND;TZID=Europe/Madrid:${dtEnd}`,
    `SUMMARY:${escapeIcsText(input.summary)}`,
    `DESCRIPTION:${escapeIcsText(input.description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `URL:${escapeIcsText(url)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

export function buildIcsAttachment(input: CalendarInput, filename = "exentax.ics"): EmailAttachment {
  const content = buildIcsContent(input);
  // Filename is owned by the MIME header builder (`buildRaw` appends a
  // `name=` parameter from `filename`). Repeating it here would emit a
  // duplicate `name=` parameter in `Content-Type`, which most clients
  // tolerate but is technically malformed. We keep only the parameters
  // that describe the calendar payload itself.
  return {
    filename,
    mimeType: "text/calendar; charset=utf-8; method=PUBLISH",
    content: Buffer.from(content, "utf-8"),
  };
}

export function buildGoogleCalendarUrl(input: CalendarInput): string {
  const startMs = madridWallTimeToUtcMs(input.date, input.startTime);
  const endMs = madridWallTimeToUtcMs(input.date, input.endTime);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.summary,
    dates: `${utcMsToIcsBasic(startMs)}/${utcMsToIcsBasic(endMs)}`,
    details: input.description,
    location: buildLocation(input),
    ctz: "Europe/Madrid",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
