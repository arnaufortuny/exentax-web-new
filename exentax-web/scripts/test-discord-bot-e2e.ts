/**
 * In-process end-to-end test for the Discord agenda bot.
 *
 * Why this exists:
 *   The bot module compiles and gracefully no-ops when env vars are unset,
 *   but Task #21 asked for an end-to-end exercise of every slash command,
 *   button and modal. A genuine staging-Discord run requires a human to
 *   click buttons in the Discord client, so this script provides the
 *   automated equivalent: it boots the bot in-process with a fake Discord
 *   keypair, generates valid Ed25519 signatures for every interaction,
 *   intercepts every outbound `discord.com/api/v10/*` HTTP call and
 *   asserts that the right `agenda_admin_actions` rows + audit-channel
 *   echoes are produced for every command/button/modal documented in
 *   `docs/discord-bot-agenda.md` §§ 3-4.
 *
 * What it does NOT cover (out of scope, needs a real Discord server):
 *   - Discord's own signature checks against the live URL
 *   - Real Slash command registration round-trip
 *   - Real button rendering / clicks in a Discord client
 *   - Real Gmail / Google Meet side-effects (those are stubbed by
 *     leaving GOOGLE_SERVICE_ACCOUNT_KEY unset; the production code
 *     short-circuits when the client is null).
 *
 * Usage:
 *   tsx exentax-web/scripts/test-discord-bot-e2e.ts
 *
 * Requires DATABASE_URL to be set (same as the dev server). All test
 * rows in `agenda` and `agenda_admin_actions` are tagged with the
 * `e2e-discord-bot-<timestamp>` marker and removed in the cleanup step,
 * even on failure.
 */
import crypto from "crypto";

// ─── 1. Env vars must be set before any module that captures them ────────────

const TEST_TAG = `e2e-discord-bot-${Date.now()}`;
const APP_ID = "111111111111111111";
const ROLE_ID = "222222222222222222";
const CHANNEL_AGENDA = "333333333333333333";
const CHANNEL_AUDITORIA = "444444444444444444";

const { publicKey: ed25519Pub, privateKey: ed25519Priv } =
  crypto.generateKeyPairSync("ed25519");
// Discord delivers the application public key as 32 raw bytes hex-encoded.
// crypto.createPublicKey ingests SPKI: `302a300506032b6570032100` || raw32.
// So we strip the 12-byte SPKI prefix from our generated SPKI to recover
// the raw 32 bytes the bot expects in DISCORD_PUBLIC_KEY.
const spkiDer = ed25519Pub.export({ format: "der", type: "spki" }) as Buffer;
const PUBLIC_KEY_HEX = spkiDer.subarray(12).toString("hex");
if (PUBLIC_KEY_HEX.length !== 64) {
  throw new Error(`Unexpected Ed25519 public key length: ${PUBLIC_KEY_HEX.length}`);
}

process.env.DISCORD_APP_ID         = APP_ID;
process.env.DISCORD_BOT_TOKEN      = "fake-bot-token-" + TEST_TAG;
process.env.DISCORD_PUBLIC_KEY     = PUBLIC_KEY_HEX;
process.env.ADMIN_DISCORD_ROLE_ID  = ROLE_ID;
process.env.DISCORD_CHANNEL_AGENDA     = CHANNEL_AGENDA;
process.env.DISCORD_CHANNEL_AUDITORIA  = CHANNEL_AUDITORIA;
// Strip Google credentials so Gmail/Calendar paths short-circuit.
delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
delete process.env.GOOGLE_CALENDAR_ID;
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "warn";

// ─── 2. Intercept fetch BEFORE imports (so cached fetch refs catch us too) ──

interface CapturedCall {
  url: string;
  method: string;
  body: unknown;
}
const capturedCalls: CapturedCall[] = [];
const originalFetch: typeof fetch = globalThis.fetch.bind(globalThis);
const interceptingFetch: typeof fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith("https://discord.com/api/")) {
    let body: unknown = null;
    if (init?.body) {
      const raw = typeof init.body === "string" ? init.body : String(init.body);
      try { body = JSON.parse(raw); } catch { body = raw; }
    }
    capturedCalls.push({ url, method: (init?.method ?? "GET").toUpperCase(), body });
    return new Response(JSON.stringify({ id: "999999999999999999" }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  }
  return originalFetch(input, init);
};
globalThis.fetch = interceptingFetch;

// ─── 3. Now safe to import the bot ──────────────────────────────────────────

const {
  handleInteractionRequest, INTERACTION_TYPE,
  buildSlashCommandManifest,
} = await import("../server/discord-bot");
const { db } = await import("../server/db");
const s = await import("../shared/schema");
const { eq, and, like } = await import("drizzle-orm");
const {
  insertAgenda, getAgendaById, deleteBlockedDay, generateId,
} = await import("../server/storage");
const { todayMadridISO, AGENDA_STATUSES } = await import("../server/server-constants");
const { generateTimeSlots, getEndTime, isWeekday } = await import("../server/route-helpers");

// ─── 4. Test plumbing ───────────────────────────────────────────────────────

interface Result { name: string; ok: boolean; detail?: string }
const results: Result[] = [];
function record(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail });
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${name}${detail ? ` — ${detail}` : ""}`);
}
function assert(name: string, cond: unknown, detail?: string): boolean {
  const ok = Boolean(cond);
  record(name, ok, ok ? undefined : (detail || "assertion failed"));
  return ok;
}

const createdBookingIds: string[] = [];
const blockedDates: string[] = [];
const ACTOR_ID = "550000000000000000";
const ACTOR_NAME = "e2e-tester";

function authorisedMember() {
  return { user: { id: ACTOR_ID, username: ACTOR_NAME, global_name: ACTOR_NAME }, roles: [ROLE_ID] };
}
function unauthorisedMember() {
  return { user: { id: "550000000000000001", username: "intruder", global_name: "intruder" }, roles: [] };
}

let interactionCounter = 0;
type InteractionPayload = Record<string, unknown>;
function freshInteraction(partial: InteractionPayload): InteractionPayload {
  interactionCounter++;
  return {
    id: `int-${TEST_TAG}-${interactionCounter}`,
    application_id: APP_ID,
    token: `tok-${TEST_TAG}-${interactionCounter}`,
    member: authorisedMember(),
    guild_id: "999999999999999999",
    channel_id: CHANNEL_AGENDA,
    ...partial,
  };
}

function signBody(body: Buffer, timestamp: string): string {
  const message = Buffer.concat([Buffer.from(timestamp, "utf8"), body]);
  return crypto.sign(null, message, ed25519Priv).toString("hex");
}

interface MockResponse {
  statusCode: number;
  body: { type?: number; data?: { content?: string; embeds?: unknown[]; components?: unknown[]; flags?: number }; [k: string]: unknown } | undefined;
  headersSent: boolean;
  status(code: number): MockResponse;
  json(payload: unknown): MockResponse;
  _done: Promise<void>;
}
function makeRes(): MockResponse {
  let resolveDone!: () => void;
  const done = new Promise<void>(r => { resolveDone = r; });
  const res: MockResponse = {
    statusCode: 0,
    body: undefined,
    headersSent: false,
    status(code) { res.statusCode = code; return res; },
    json(payload) {
      res.body = payload as MockResponse["body"];
      res.headersSent = true;
      resolveDone();
      return res;
    },
    _done: done,
  };
  return res;
}

async function invoke(
  partial: InteractionPayload, opts: { signOverride?: string; tamperBody?: boolean } = {},
): Promise<MockResponse> {
  // Wrap so every interaction has id/token/application_id/member by default;
  // callers that need to test the unauthorised path pass member explicitly.
  const interactionPayload = freshInteraction(partial);
  const rawBody = Buffer.from(JSON.stringify(interactionPayload), "utf8");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = opts.signOverride ?? signBody(rawBody, timestamp);
  const sentBody = opts.tamperBody ? Buffer.concat([rawBody, Buffer.from(" ")]) : rawBody;

  const req = {
    headers: {
      "x-signature-ed25519": signature,
      "x-signature-timestamp": timestamp,
    },
    rawBody: sentBody,
    body: interactionPayload,
  } as unknown as Parameters<typeof handleInteractionRequest>[0];
  const res = makeRes();
  await handleInteractionRequest(req, res as unknown as Parameters<typeof handleInteractionRequest>[1]);
  // handleInteractionRequest is async — once it returns, res.json was called
  // (or not, if the handler deferred and is doing async work). Wait briefly
  // for any pending follow-up writes.
  if (!res.headersSent) await Promise.race([res._done, sleep(50)]);
  return res;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── 5. Booking seeding helpers ─────────────────────────────────────────────

function pad(n: number): string { return n.toString().padStart(2, "0"); }
function isoOf(d: Date): string { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

/**
 * Find a future weekday with at least one slot free to seed test bookings.
 * Walks forward starting from `start + offsetDays` and returns the first
 * (date, slot) that is not blocked, not booked and is a weekday.
 */
async function findFreeSlot(offsetDays: number): Promise<{ date: string; slot: string }> {
  const start = new Date();
  start.setDate(start.getDate() + offsetDays);
  for (let i = 0; i < 60; i++) {
    const d = new Date(start.getTime());
    d.setDate(d.getDate() + i);
    const date = isoOf(d);
    if (!isWeekday(date)) continue;
    const slots = generateTimeSlots();
    for (const slot of slots) {
      const existing = await db
        .select({ id: s.agenda.id })
        .from(s.agenda)
        .where(and(
          eq(s.agenda.meetingDate, date),
          eq(s.agenda.startTime, slot),
        ));
      if (existing.length === 0) return { date, slot };
    }
  }
  throw new Error("No free slot found in the next 60 days");
}

async function seedBooking(label: string): Promise<{ id: string; date: string; slot: string }> {
  const { date, slot } = await findFreeSlot(7 + createdBookingIds.length * 2);
  const id = generateId();
  const insertPayload: s.InsertAgenda = {
    id,
    name: `e2e ${label}`,
    email: `${TEST_TAG}-${label}@e2e.exentax.test`,
    phone: null,
    meetingDate: date,
    startTime: slot,
    endTime: getEndTime(slot),
    status: AGENDA_STATUSES.PENDING,
    notes: TEST_TAG,
    googleMeet: null,
    googleMeetEventId: null,
    manageToken: crypto.randomBytes(24).toString("hex"),
    language: "es",
    meetingType: "google_meet",
    privacy: true,
  };
  await insertAgenda(insertPayload);
  createdBookingIds.push(id);
  return { id, date, slot };
}

async function countAdminActions(filter: { action?: string; bookingId?: string } = {}): Promise<number> {
  const where = and(
    eq(s.agendaAdminActions.actorDiscordId, ACTOR_ID),
    filter.action ? eq(s.agendaAdminActions.action, filter.action) : undefined,
    filter.bookingId ? eq(s.agendaAdminActions.bookingId, filter.bookingId) : undefined,
  );
  const rows = await db.select({ id: s.agendaAdminActions.id }).from(s.agendaAdminActions).where(where);
  return rows.length;
}

function auditCallsAfter(idx: number) {
  return capturedCalls.slice(idx).filter(c =>
    c.url.startsWith(`https://discord.com/api/v10/channels/${CHANNEL_AUDITORIA}/messages`) ||
    c.url.startsWith(`https://discord.com/api/v10/channels/${CHANNEL_AGENDA}/messages`)
  );
}

async function waitForQueueDrain(timeoutMs = 25_000): Promise<void> {
  const { getDiscordQueueSize } = await import("../server/discord");
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (getDiscordQueueSize() === 0) return;
    await sleep(250);
  }
  console.log(`  [WARN] queue did not drain (size=${getDiscordQueueSize()})`);
}

// ─── 6. The test cases ──────────────────────────────────────────────────────

async function run() {
  console.log(`\n=== Discord bot E2E (${TEST_TAG}) ===\n`);

  // Sanity: manifest snapshot.
  const manifest = buildSlashCommandManifest();
  assert("Slash command manifest exposes /ayuda /agenda /cita",
    manifest.length === 3 &&
    manifest.find(c => c.name === "ayuda") &&
    manifest.find(c => c.name === "agenda") &&
    manifest.find(c => c.name === "cita"),
    `got ${manifest.map(c => c.name).join(",")}`);

  // ── Signature verification ──
  {
    const res = await invoke({ type: INTERACTION_TYPE.PING });
    assert("PING valid signature → 200 PONG (type:1)",
      res.statusCode === 200 && res.body?.type === 1, JSON.stringify(res.body));
  }
  {
    const res = await invoke({ type: INTERACTION_TYPE.PING }, { signOverride: "00".repeat(64) });
    assert("PING invalid signature → 401", res.statusCode === 401);
  }
  {
    const res = await invoke({ type: INTERACTION_TYPE.PING }, { tamperBody: true });
    assert("PING tampered body → 401", res.statusCode === 401);
  }

  // ── Authorisation ──
  {
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "ayuda" },
      member: unauthorisedMember(),
    });
    const txt = res.body?.data?.content || "";
    assert("Member without ADMIN role → ephemeral 'no autorizado'",
      res.statusCode === 200 && /No tienes permisos/.test(txt), txt);
    const ayudaCount = await countAdminActions({ action: "ayuda" });
    // Unauthorised should NOT have logged an action under our actor.
    assert("Unauthorised invocation does NOT write an admin action",
      ayudaCount === 0, `ayudaCount=${ayudaCount}`);
  }

  // ── /ayuda ──
  {
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "ayuda" },
    });
    assert("/ayuda → 200 with help embed",
      res.statusCode === 200 &&
      res.body?.data?.embeds?.[0]?.title?.includes("Ayuda"),
      JSON.stringify(res.body?.data?.embeds?.[0]?.title));
    assert("/ayuda persists agenda_admin_actions row",
      (await countAdminActions({ action: "ayuda" })) === 1);
  }

  // ── /agenda hoy / semana / buscar / libre ──
  for (const sub of ["hoy", "semana"]) {
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "agenda", options: [{ type: 1, name: sub, options: [] }] },
    });
    assert(`/agenda ${sub} → 200`, res.statusCode === 200);
    assert(`/agenda ${sub} logs admin action`,
      (await countAdminActions({ action: `agenda.${sub}` })) === 1);
  }
  {
    const q = TEST_TAG;
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "agenda", options: [{ type: 1, name: "buscar", options: [{ name: "q", value: q }] }] },
    });
    assert(`/agenda buscar → 200`, res.statusCode === 200);
    assert(`/agenda buscar logs admin action`,
      (await countAdminActions({ action: "agenda.buscar" })) === 1);
  }
  {
    const { date } = await findFreeSlot(14);
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "agenda", options: [{ type: 1, name: "libre", options: [{ name: "fecha", value: date }] }] },
    });
    assert(`/agenda libre → 200`, res.statusCode === 200);
    assert(`/agenda libre logs admin action`,
      (await countAdminActions({ action: "agenda.libre" })) === 1);
  }

  // ── /agenda bloquear / desbloquear ──
  {
    const blockDate = isoOf(new Date(Date.now() + 90 * 86_400_000));
    blockedDates.push(blockDate);
    const before = capturedCalls.length;
    const r1 = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "agenda", options: [{
        type: 1, name: "bloquear",
        options: [{ name: "fecha", value: blockDate }, { name: "motivo", value: TEST_TAG }],
      }]},
    });
    assert(`/agenda bloquear → 200`, r1.statusCode === 200);
    assert(`/agenda bloquear logs admin action`,
      (await countAdminActions({ action: "agenda.bloquear" })) === 1);

    const r2 = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "agenda", options: [{
        type: 1, name: "desbloquear",
        options: [{ name: "fecha", value: blockDate }],
      }]},
    });
    assert(`/agenda desbloquear → 200`, r2.statusCode === 200);
    assert(`/agenda desbloquear logs admin action`,
      (await countAdminActions({ action: "agenda.desbloquear" })) === 1);

    await waitForQueueDrain(8_000);
    const auditCalls = auditCallsAfter(before).filter(c =>
      c.url.includes(`/channels/${CHANNEL_AUDITORIA}/`));
    assert(`bloquear/desbloquear echoed to #sistema-auditoria (>=2 audit POSTs)`,
      auditCalls.length >= 2, `auditCalls=${auditCalls.length}`);
  }

  // ── /cita ver / confirmar (slash) ──
  {
    const b = await seedBooking("cita-ver");
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{ type: 1, name: "ver", options: [{ name: "id", value: b.id }] }] },
    });
    assert(`/cita ver → 200 with action rows`,
      res.statusCode === 200 && Array.isArray(res.body?.data?.components) &&
      res.body!.data!.components!.length === 2);
    assert(`/cita ver logs admin action with bookingId`,
      (await countAdminActions({ action: "cita.ver", bookingId: b.id })) === 1);
  }
  {
    const b = await seedBooking("cita-confirmar");
    const before = capturedCalls.length;
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{ type: 1, name: "confirmar", options: [{ name: "id", value: b.id }] }] },
    });
    assert(`/cita confirmar → 200`, res.statusCode === 200);
    const fresh = await getAgendaById(b.id);
    assert(`/cita confirmar updates status=contacted`, fresh?.status === AGENDA_STATUSES.CONTACTED, fresh?.status);
    assert(`/cita confirmar logs admin action`,
      (await countAdminActions({ action: "cita.confirmar", bookingId: b.id })) === 1);
    await waitForQueueDrain(5_000);
    const audits = auditCallsAfter(before);
    assert(`/cita confirmar emits at least one Discord REST POST (audit)`,
      audits.length >= 1, `audits=${audits.length}`);
  }

  // ── /cita cancelar (slash) ──
  {
    const b = await seedBooking("slash-cancelar");
    const before = capturedCalls.length;
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{ type: 1, name: "cancelar", options: [{ name: "id", value: b.id }] }] },
    });
    assert(`/cita cancelar → 200`, res.statusCode === 200);
    const fresh = await getAgendaById(b.id);
    assert(`/cita cancelar sets status=cancelled`,
      fresh?.status === AGENDA_STATUSES.CANCELLED, fresh?.status);
    assert(`/cita cancelar logs admin action`,
      (await countAdminActions({ action: "cita.cancelar", bookingId: b.id })) === 1);
    await waitForQueueDrain(5_000);
    const audits = auditCallsAfter(before);
    assert(`/cita cancelar emits Discord REST POST(s) (audit + #agenda)`,
      audits.length >= 2, `audits=${audits.length}`);
  }

  // ── /cita noshow (slash) ──
  {
    const b = await seedBooking("slash-noshow");
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{ type: 1, name: "noshow", options: [{ name: "id", value: b.id }] }] },
    });
    assert(`/cita noshow → 200`, res.statusCode === 200);
    const fresh = await getAgendaById(b.id);
    assert(`/cita noshow sets status=no_show`,
      fresh?.status === AGENDA_STATUSES.NO_SHOW, fresh?.status);
    assert(`/cita noshow logs admin action`,
      (await countAdminActions({ action: "cita.noshow", bookingId: b.id })) === 1);
  }

  // ── /cita reprogramar (slash) ──
  {
    const b = await seedBooking("slash-reprogramar");
    const target = await findFreeSlot(35);
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{
        type: 1, name: "reprogramar",
        options: [
          { name: "id",    value: b.id },
          { name: "fecha", value: target.date },
          { name: "hora",  value: target.slot },
        ],
      }]},
    });
    assert(`/cita reprogramar → defers (type 5)`,
      res.statusCode === 200 && res.body?.type === 5, JSON.stringify(res.body));
    await sleep(1_000);
    const fresh = await getAgendaById(b.id);
    assert(`/cita reprogramar moves booking to (${target.date} ${target.slot})`,
      fresh?.meetingDate === target.date && fresh?.startTime === target.slot,
      `${fresh?.meetingDate} ${fresh?.startTime}`);
    assert(`/cita reprogramar logs admin action`,
      (await countAdminActions({ action: "cita.reprogramar", bookingId: b.id })) === 1);
  }

  // ── /cita email tipo:confirmation + tipo:noshow (slash, all 4 templates covered) ──
  {
    const b = await seedBooking("cmd-email-confirmation");
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{
        type: 1, name: "email",
        options: [{ name: "id", value: b.id }, { name: "tipo", value: "confirmation" }],
      }]},
    });
    assert(`/cita email confirmation → defers (type 5)`,
      res.statusCode === 200 && res.body?.type === 5);
    await sleep(800);
    assert(`/cita email confirmation logs admin action`,
      (await countAdminActions({ action: "cita.email.confirmation", bookingId: b.id })) === 1);
  }
  {
    const b = await seedBooking("cmd-email-recordatorio");
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{
        type: 1, name: "email",
        options: [{ name: "id", value: b.id }, { name: "tipo", value: "recordatorio" }],
      }]},
    });
    assert(`/cita email recordatorio (slash) → defers (type 5)`,
      res.statusCode === 200 && res.body?.type === 5);
    await sleep(800);
    assert(`/cita email recordatorio (slash) logs admin action`,
      (await countAdminActions({ action: "cita.email.recordatorio", bookingId: b.id })) === 1);
  }
  {
    const b = await seedBooking("cmd-email-noshow");
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{
        type: 1, name: "email",
        options: [{ name: "id", value: b.id }, { name: "tipo", value: "noshow" }],
      }]},
    });
    assert(`/cita email noshow → defers (type 5)`,
      res.statusCode === 200 && res.body?.type === 5);
    await sleep(800);
    assert(`/cita email noshow logs admin action`,
      (await countAdminActions({ action: "cita.email.noshow", bookingId: b.id })) === 1);
  }

  // ── Button: agenda:confirm ──
  {
    const b = await seedBooking("btn-confirm");
    const res = await invoke({
      type: INTERACTION_TYPE.MESSAGE_COMPONENT,
      data: { component_type: 2, custom_id: `agenda:confirm:${b.id}` },
      message: { id: "msg-1", embeds: [{ title: "Reserva", fields: [] }], components: [] },
    });
    assert(`button confirm → 200`, res.statusCode === 200);
    const fresh = await getAgendaById(b.id);
    assert(`button confirm sets status=contacted`, fresh?.status === AGENDA_STATUSES.CONTACTED);
    assert(`button confirm logs admin action`,
      (await countAdminActions({ action: "cita.confirmar", bookingId: b.id })) === 1);
  }

  // ── Button: agenda:reschedule (returns modal) ──
  {
    const b = await seedBooking("btn-resched-modal");
    const res = await invoke({
      type: INTERACTION_TYPE.MESSAGE_COMPONENT,
      data: { component_type: 2, custom_id: `agenda:reschedule:${b.id}` },
      message: { id: "msg-2", embeds: [], components: [] },
    });
    assert(`button reschedule → returns MODAL (response type 9)`,
      res.statusCode === 200 && res.body?.type === 9 &&
      res.body?.data?.custom_id === `agenda:reschedule_modal:${b.id}`,
      JSON.stringify(res.body));
  }

  // ── Modal submit: agenda:reschedule_modal ──
  {
    const b = await seedBooking("modal-resched");
    const target = await findFreeSlot(28);
    const before = capturedCalls.length;
    const res = await invoke({
      type: INTERACTION_TYPE.MODAL_SUBMIT,
      data: {
        custom_id: `agenda:reschedule_modal:${b.id}`,
        components: [
          { type: 1, components: [{ type: 4, custom_id: "fecha", value: target.date }] },
          { type: 1, components: [{ type: 4, custom_id: "hora",  value: target.slot }] },
        ],
      },
      message: { id: "msg-3", embeds: [], components: [] },
    });
    assert(`modal submit → defers (response type 5)`,
      res.statusCode === 200 && res.body?.type === 5, JSON.stringify(res.body));
    // Reschedule continues async after the deferred response.
    await sleep(1_000);
    const fresh = await getAgendaById(b.id);
    assert(`modal reschedule moves booking to (${target.date} ${target.slot})`,
      fresh?.meetingDate === target.date && fresh?.startTime === target.slot,
      `${fresh?.meetingDate} ${fresh?.startTime}`);
    assert(`modal reschedule increments rescheduleCount to 1`,
      fresh?.rescheduleCount === 1, String(fresh?.rescheduleCount));
    assert(`modal reschedule logs admin action`,
      (await countAdminActions({ action: "cita.reprogramar", bookingId: b.id })) === 1);
    await waitForQueueDrain(5_000);
    const audits = auditCallsAfter(before);
    assert(`modal reschedule emits Discord REST POST(s) for audit + #agenda + followup`,
      audits.length >= 2, `audits=${audits.length}`);
  }

  // ── Button: agenda:noshow ──
  {
    const b = await seedBooking("btn-noshow");
    const res = await invoke({
      type: INTERACTION_TYPE.MESSAGE_COMPONENT,
      data: { component_type: 2, custom_id: `agenda:noshow:${b.id}` },
      message: { id: "msg-4", embeds: [], components: [] },
    });
    assert(`button noshow → 200`, res.statusCode === 200);
    const fresh = await getAgendaById(b.id);
    assert(`button noshow sets status=no_show`, fresh?.status === AGENDA_STATUSES.NO_SHOW, fresh?.status);
    assert(`button noshow logs admin action`,
      (await countAdminActions({ action: "cita.noshow", bookingId: b.id })) === 1);
  }

  // ── Button: agenda:email_select (recordatorio) ──
  {
    const b = await seedBooking("btn-email-recordatorio");
    const res = await invoke({
      type: INTERACTION_TYPE.MESSAGE_COMPONENT,
      data: {
        component_type: 3, custom_id: `agenda:email_select:${b.id}`,
        values: ["recordatorio"],
      },
      message: { id: "msg-5", embeds: [], components: [] },
    });
    assert(`select email recordatorio → defers (type 5)`,
      res.statusCode === 200 && res.body?.type === 5);
    // Async continuation
    await sleep(800);
    assert(`email recordatorio logs admin action`,
      (await countAdminActions({ action: "cita.email.recordatorio", bookingId: b.id })) === 1);
  }

  // ── Button: agenda:cancel ──
  {
    const b = await seedBooking("btn-cancel");
    const before = capturedCalls.length;
    const res = await invoke({
      type: INTERACTION_TYPE.MESSAGE_COMPONENT,
      data: { component_type: 2, custom_id: `agenda:cancel:${b.id}` },
      message: { id: "msg-6", embeds: [], components: [] },
    });
    assert(`button cancel → 200`, res.statusCode === 200);
    const fresh = await getAgendaById(b.id);
    assert(`button cancel sets status=cancelled`, fresh?.status === AGENDA_STATUSES.CANCELLED, fresh?.status);
    assert(`button cancel logs admin action`,
      (await countAdminActions({ action: "cita.cancelar", bookingId: b.id })) === 1);
    await waitForQueueDrain(5_000);
    const audits = auditCallsAfter(before);
    // cancellation queues both notifyBookingCancelled (#agenda) and
    // notifyAdminAction (#sistema-auditoria) plus a PATCH to the
    // originating message.
    assert(`button cancel emits at least 2 Discord REST POST/PATCH`,
      audits.length >= 2, `audits=${audits.length}`);
    const patches = capturedCalls.slice(before).filter(c =>
      c.method === "PATCH" && c.url.includes(`/channels/${CHANNEL_AGENDA}/messages/`));
    assert(`button cancel PATCHes the originating #agenda message`,
      patches.length >= 1, `patches=${patches.length}`);
  }

  // ── /cita nueva ──
  {
    const target = await findFreeSlot(40);
    const newEmail = `${TEST_TAG}-nueva@e2e.exentax.test`;
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{
        type: 1, name: "nueva",
        options: [
          { name: "nombre", value: `e2e nueva` },
          { name: "email",  value: newEmail },
          { name: "fecha",  value: target.date },
          { name: "hora",   value: target.slot },
          { name: "idioma", value: "es" },
        ],
      }]},
    });
    assert(`/cita nueva → defers (type 5)`, res.statusCode === 200 && res.body?.type === 5);
    await sleep(1_500);
    const created = await db.select({ id: s.agenda.id, status: s.agenda.status })
      .from(s.agenda)
      .where(eq(s.agenda.email, newEmail));
    assert(`/cita nueva inserts an agenda row`, created.length === 1, `len=${created.length}`);
    if (created.length) createdBookingIds.push(created[0].id);
    assert(`/cita nueva logs admin action`,
      (await countAdminActions({ action: "cita.nueva" })) === 1);
  }

  // ── /cita email tipo:seguimiento ──
  {
    const b = await seedBooking("cmd-email-seguimiento");
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{
        type: 1, name: "email",
        options: [{ name: "id", value: b.id }, { name: "tipo", value: "seguimiento" }],
      }]},
    });
    assert(`/cita email seguimiento → defers (type 5)`,
      res.statusCode === 200 && res.body?.type === 5);
    await sleep(800);
    assert(`/cita email seguimiento logs admin action`,
      (await countAdminActions({ action: "cita.email.seguimiento", bookingId: b.id })) === 1);
  }

  // ── Validation: invalid booking id is rejected ──
  {
    const res = await invoke({
      type: INTERACTION_TYPE.APPLICATION_COMMAND,
      data: { name: "cita", options: [{ type: 1, name: "ver", options: [{ name: "id", value: "bad id with spaces!" }] }] },
    });
    const txt = res.body?.data?.content || "";
    assert(`/cita ver with invalid id → ephemeral error`,
      res.statusCode === 200 && /Booking ID inv/.test(txt), txt);
  }
}

// ─── 7. Cleanup + summary ───────────────────────────────────────────────────

async function cleanup() {
  console.log("\n--- cleanup ---");
  try {
    if (createdBookingIds.length) {
      const { inArray } = await import("drizzle-orm");
      await db.delete(s.agenda).where(inArray(s.agenda.id, createdBookingIds));
      await db.delete(s.agendaAdminActions).where(inArray(s.agendaAdminActions.bookingId, createdBookingIds));
    }
    await db.delete(s.agendaAdminActions).where(eq(s.agendaAdminActions.actorDiscordId, ACTOR_ID));
    for (const d of blockedDates) {
      try { await deleteBlockedDay(d); } catch { /* noop */ }
    }
    // Drain pg-stored emails enqueued by /cita nueva / email recordatorio
    // so they don't sit in the retry queue forever.
    await db.delete(s.emailRetryQueue).where(like(s.emailRetryQueue.payload, `%${TEST_TAG}%`));
    console.log(`  cleaned ${createdBookingIds.length} bookings, audit rows for actor ${ACTOR_ID}`);
  } catch (err) {
    console.log(`  cleanup error: ${String(err)}`);
  }
}

(async () => {
  let exitCode = 0;
  try {
    await run();
  } catch (err) {
    console.error("\n[FATAL]", err);
    exitCode = 1;
  }
  await cleanup();

  const failed = results.filter(r => !r.ok);
  console.log(`\n=== Discord bot E2E summary: ${results.length - failed.length}/${results.length} passed ===`);
  for (const f of failed) console.log(`  FAIL: ${f.name} — ${f.detail || ""}`);

  // Restore fetch so the process can exit cleanly.
  globalThis.fetch = originalFetch;
  // Stop pg pool so the event loop drains.
  try {
    const dbModule = await import("../server/db");
    const candidate = dbModule.db as unknown as { $client?: { end?: () => Promise<void> }; pool?: { end?: () => Promise<void> } };
    const pool = candidate.$client ?? candidate.pool;
    if (pool?.end) await pool.end();
  } catch { /* noop */ }

  process.exit(exitCode || (failed.length > 0 ? 1 : 0));
})();

