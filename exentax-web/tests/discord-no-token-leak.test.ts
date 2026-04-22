/**
 * Regression test — Discord payloads must NEVER carry a booking `manage_token`.
 *
 * The token authorises the CLIENT to self-manage their booking via the
 * public `/booking/:id?token=…` URL. Posting it to Discord widens the blast
 * radius if a member, screenshot or log is leaked. Admin actions are
 * addressed exclusively by the public-safe `bookingId` and routed through
 * in-channel buttons / slash commands.
 *
 * Run: `tsx exentax-web/tests/discord-no-token-leak.test.ts`
 *
 * Exits non-zero on any leak. Stubs `global.fetch` to capture every outbound
 * Discord REST payload and asserts the JSON contains neither `token=` nor
 * `manage_token` / `manageToken`. Also asserts `notifyConsent` surfaces the
 * `con_*` ID as a first-class field.
 */
process.env.NODE_ENV = "test";
process.env.DISCORD_BOT_TOKEN = "test-token";
process.env.DISCORD_CHANNEL_AGENDA = "1234567890";
process.env.DISCORD_CHANNEL_REGISTROS = "1234567891";
process.env.DISCORD_CHANNEL_CONSENTIMIENTOS = "1234567892";
process.env.DISCORD_CHANNEL_AUDITORIA = "1234567893";

const SENT: string[] = [];
const originalFetch = global.fetch;
global.fetch = (async (_input: any, init?: any) => {
  if (typeof init?.body === "string") SENT.push(init.body);
  return new Response(JSON.stringify({ id: "fake_msg" }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}) as any;

const failures: string[] = [];
function assert(cond: unknown, msg: string) {
  if (!cond) failures.push(msg);
  else process.stdout.write(`  ok  ${msg}\n`);
}

async function flush() { await new Promise(r => setTimeout(r, 1500)); }

async function main() {
  const d: typeof import("../server/discord") = await import("../server/discord");

  // 1. Booking created — pre-bot signature (no manageToken arg) must produce
  //    a payload with NO secret material.
  SENT.length = 0;
  d.notifyBookingCreated({
    bookingId: "bk_test_001",
    name: "Ada", email: "ada@test.local", phone: null,
    date: "2026-12-31", startTime: "10:00", endTime: "10:30",
    meetLink: null, meetingType: "google_meet", language: "es",
  });
  await flush();
  let blob = SENT.join("\n");
  assert(SENT.length > 0, "notifyBookingCreated produced at least one outbound payload");
  assert(!/manage[_]?token/i.test(blob), "notifyBookingCreated payload contains no manage_token / manageToken");
  assert(!/[?&]token=/.test(blob), "notifyBookingCreated payload contains no `?token=` URL");
  assert(blob.includes("bk_test_001"), "notifyBookingCreated payload exposes the public bookingId");

  // 2. Booking cancelled — same guard.
  SENT.length = 0;
  d.notifyBookingCancelled({
    bookingId: "bk_test_002",
    name: "Bob", email: "bob@test.local",
    date: "2026-12-31", startTime: "11:00", endTime: "11:30",
    reason: "operator action", source: "admin",
  });
  await flush();
  blob = SENT.join("\n");
  assert(!/manage[_]?token/i.test(blob), "notifyBookingCancelled payload contains no manage_token");
  assert(!/[?&]token=/.test(blob), "notifyBookingCancelled payload contains no `?token=` URL");

  // 3. Booking rescheduled — same guard.
  SENT.length = 0;
  d.notifyBookingRescheduled({
    bookingId: "bk_test_003",
    name: "Cleo", email: "cleo@test.local",
    oldDate: "2026-12-30", oldStartTime: "09:00",
    newDate: "2026-12-31", newStartTime: "10:00", newEndTime: "10:30",
    meetLink: null, meetingType: "google_meet", source: "client",
  });
  await flush();
  blob = SENT.join("\n");
  assert(!/manage[_]?token/i.test(blob), "notifyBookingRescheduled payload contains no manage_token");
  assert(!/[?&]token=/.test(blob), "notifyBookingRescheduled payload contains no `?token=` URL");

  // 4. Booking no-show — same guard.
  SENT.length = 0;
  d.notifyNoShow({
    bookingId: "bk_test_004",
    name: "Diana", email: "diana@test.local",
    date: "2026-12-31", startTime: "12:00", endTime: "12:30",
  });
  await flush();
  blob = SENT.join("\n");
  assert(!/manage[_]?token/i.test(blob), "notifyNoShow payload contains no manage_token");
  assert(!/[?&]token=/.test(blob), "notifyNoShow payload contains no `?token=` URL");

  // 5. Consent notification — must surface the con_* ID and contain no token.
  SENT.length = 0;
  d.notifyConsent({
    consentId: "con_audit_xyz",
    formType: "booking",
    email: "audit@test.local",
    privacyAccepted: true, marketingAccepted: false,
    language: "es", privacyVersion: "1.0",
  });
  await flush();
  blob = SENT.join("\n");
  assert(blob.includes("con_audit_xyz"), "notifyConsent surfaces the con_* ID in the payload");
  assert(!/manage[_]?token/i.test(blob), "notifyConsent payload contains no manage_token");
}

main().then(() => {
  global.fetch = originalFetch;
  if (failures.length > 0) {
    console.error("\nFAILED ASSERTIONS:");
    for (const f of failures) console.error("  - " + f);
    process.exit(1);
  }
  console.log("\nAll Discord secret-leak guards passed.");
  process.exit(0);
}).catch((err) => {
  console.error("Test crashed:", err);
  process.exit(1);
});
