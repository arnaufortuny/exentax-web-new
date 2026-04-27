/**
 * Google Meet / Calendar — domain-wide delegation
 *
 * HOW IT WORKS:
 *   The service account impersonates hola@exentax.com so every event appears
 *   as if it was created by that account. The client and arnau@exentax.com are
 *   added as attendees and receive Google Calendar invites automatically.
 *
 * REQUIRED ENV VARS:
 *   GOOGLE_SERVICE_ACCOUNT_KEY  → entire JSON contents of the service account key file
 *   GOOGLE_CALENDAR_ID          → hola@exentax.com  (the calendar that will own the events)
 *
 * ONE-TIME SETUP (domain-wide delegation):
 *   1. Google Cloud Console → IAM → Service Accounts → your account
 *      → "Enable domain-wide delegation" → copy the Client ID (numeric)
 *   2. Google Workspace Admin (admin.google.com)
 *      → Security → Access and data control → API controls → Domain-wide delegation
 *      → Add new → paste Client ID → OAuth scope: https://www.googleapis.com/auth/calendar
 *   3. Set GOOGLE_CALENDAR_ID = hola@exentax.com
 *
 * RESULT:
 *   - Organizer: hola@exentax.com
 *   - Attendees: [client, arnau@exentax.com]
 *   - Both receive Google Calendar invite + Meet link by email
 */

import { google } from "googleapis";
import crypto from "crypto";
import { logger } from "./logger";
import { getGoogleServiceAccountKey, GOOGLE_CALENDAR_ID as EMBEDDED_CALENDAR_ID } from "./google-credentials.js";
import { isTransient, isAuthError } from "./google-utils";
import { CONTACT_EMAIL, ADMIN_EMAIL, DEFAULT_TIMEZONE } from "./server-constants";
import { googleCalendarBreaker } from "./circuit-breaker";

const ORGANIZER_EMAIL = CONTACT_EMAIL;

let calendarClient: ReturnType<typeof google.calendar> | null = null;

function resetCalendarClient(): void {
  calendarClient = null;
  logger.warn("Client reset — will reconnect on next call.", "meet");
}

function getCalendarClient() {
  if (calendarClient) return calendarClient;

  const key = getGoogleServiceAccountKey();
  if (!key.private_key || !key.client_email) {
    return null;
  }

  try {
    const auth = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar"],
      subject: ORGANIZER_EMAIL,
    });

    calendarClient = google.calendar({ version: "v3", auth });
    logger.info(`Calendar client ready — acting as ${ORGANIZER_EMAIL}`, "meet");
    return calendarClient;
  } catch (err) {
    logger.error("Failed to initialize Calendar client:", "meet", err);
    calendarClient = null;
    return null;
  }
}

const MEET_EVENT_I18N: Record<string, { summary: (name: string) => string; description: (name: string) => string; notesLabel: string }> = {
  es: { summary: (n) => `Asesoría Exentax: ${n}`, description: (n) => `Asesoría fiscal estratégica de 30 minutos con ${n}.`, notesLabel: "Notas del cliente" },
  en: { summary: (n) => `Exentax Advisory: ${n}`, description: (n) => `30-minute strategic tax consultation with ${n}.`, notesLabel: "Client notes" },
  fr: { summary: (n) => `Consultation Exentax: ${n}`, description: (n) => `Consultation fiscale stratégique de 30 minutes avec ${n}.`, notesLabel: "Notes du client" },
  de: { summary: (n) => `Exentax Beratung: ${n}`, description: (n) => `30-minütige strategische Steuerberatung mit ${n}.`, notesLabel: "Notizen des Kunden" },
  pt: { summary: (n) => `Consultoria Exentax: ${n}`, description: (n) => `Consultoria fiscal estratégica de 30 minutos com ${n}.`, notesLabel: "Notas do cliente" },
  ca: { summary: (n) => `Assessoria Exentax: ${n}`, description: (n) => `Assessoria fiscal estratègica de 30 minuts amb ${n}.`, notesLabel: "Notes del client" },
};

interface MeetEventParams {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  language?: string;
  additionalGuests?: string[];
}

export interface MeetEventResult {
  meetLink: string;
  eventId: string;
}

export async function createGoogleMeetEvent(params: MeetEventParams): Promise<MeetEventResult | null> {
  return googleCalendarBreaker.execute(
    () => _createGoogleMeetEventInternal(params),
    () => null,
  );
}

async function _createGoogleMeetEventInternal(params: MeetEventParams): Promise<MeetEventResult | null> {
  if (!params.clientEmail || !params.date || !params.startTime || !params.endTime) {
    logger.warn("Missing required params for Meet event creation", "meet");
    return null;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || EMBEDDED_CALENDAR_ID;

  const stableRequestId = `exentax-${crypto.createHash("sha256").update(`${params.clientEmail}|${params.date}|${params.startTime}`).digest("hex").slice(0, 16)}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const calendar = getCalendarClient();

    if (!calendar) {
      logger.info("Skipping Meet link generation — not configured.", "meet");
      return null;
    }

    try {
      const startDateTime = `${params.date}T${params.startTime}:00`;
      const endDateTime   = `${params.date}T${params.endTime}:00`;

      const lang = (params.language || "es").split("-")[0].toLowerCase();
      const i18n = MEET_EVENT_I18N[lang] || MEET_EVENT_I18N.es;
      const event = {
        summary: i18n.summary(params.clientName),
        description: [
          i18n.description(params.clientName),
          `Email: ${params.clientEmail}`,
          params.notes ? `\n${i18n.notesLabel}: ${params.notes}` : "",
        ].filter(Boolean).join("\n"),
        start: { dateTime: startDateTime, timeZone: DEFAULT_TIMEZONE },
        end:   { dateTime: endDateTime,   timeZone: DEFAULT_TIMEZONE },
        organizer: { email: ORGANIZER_EMAIL, self: true },
        attendees: [
          { email: params.clientEmail,  displayName: params.clientName },
          { email: ADMIN_EMAIL,         displayName: "Exentax: Advisory Team" },
          ...(params.additionalGuests || []).map(g => ({ email: g })),
        ],
        conferenceData: {
          createRequest: {
            requestId: stableRequestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 15 },
          ],
        },
        guestsCanSeeOtherGuests: false,
      };

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
      });

      const meetLink = response.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri;
      const calendarEventId = response.data.id;

      logger.info(`Event created → ${meetLink} (eventId: ${calendarEventId})`, "meet");
      if (!meetLink || !calendarEventId) {
        logger.warn(
          `Meet link or eventId missing — cleaning up orphan event (eventId=${calendarEventId || "none"}, meetLink=${meetLink || "none"})`,
          "meet",
        );
        if (calendarEventId) {
          try {
            await calendar.events.delete({
              calendarId,
              eventId: calendarEventId,
              sendUpdates: "none",
            });
            logger.info("Orphan Meet event deleted successfully", "meet");
          } catch (cleanupErr) {
            logger.error("Failed to delete orphan Meet event:", "meet", cleanupErr);
          }
        }
        return null;
      }
      return { meetLink, eventId: calendarEventId };
    } catch (err) {
      if (attempt === 0 && (isTransient(err) || isAuthError(err))) {
        logger.warn("Transient error creating event, retrying in 1s...", "meet");
        if (isAuthError(err)) resetCalendarClient();
        await new Promise(r => setTimeout(r, 1_000));
        continue;
      }
      throw err;
    }
  }
  return null;
}

export async function deleteGoogleMeetEvent(eventId: string): Promise<boolean> {
  return googleCalendarBreaker.execute(
    () => _deleteGoogleMeetEventInternal(eventId),
    () => false,
  );
}

async function _deleteGoogleMeetEventInternal(eventId: string): Promise<boolean> {
  if (!eventId) {
    logger.warn("Missing eventId for Meet event deletion", "meet");
    return false;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || EMBEDDED_CALENDAR_ID;

  for (let attempt = 0; attempt < 2; attempt++) {
    const calendar = getCalendarClient();
    if (!calendar) {
      logger.info("Skipping Meet deletion — not configured.", "meet");
      return false;
    }

    try {
      await calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: "all",
      });
      logger.info(`Event deleted: ${eventId}`, "meet");
      return true;
    } catch (err) {
      if (attempt === 0 && (isTransient(err) || isAuthError(err))) {
        logger.warn("Transient error deleting event, retrying in 1s...", "meet");
        if (isAuthError(err)) resetCalendarClient();
        await new Promise(r => setTimeout(r, 1_000));
        continue;
      }
      throw err;
    }
  }
  return false;
}
