import {
  sendBookingConfirmation,
  sendCalculatorEmail,
  sendReminderEmail,
  sendRescheduleConfirmation,
  sendCancellationEmail,
  sendFollowupEmail,
  sendDripEmail,
  sendIncompleteBookingEmail,
  sendNoShowRescheduleEmail,
  getGmailClient,
} from "../server/email.js";

const TO = "arnau@exentax.com";
const LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;

function tagSubject(_lang: string) {
  return ` [test ${_lang}]`;
}

async function safe(label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    console.log(`✓ ${label}`);
  } catch (err) {
    console.error(`✗ ${label}: ${(err as Error).message}`);
  }
  await new Promise((r) => setTimeout(r, 350));
}

async function main() {
  if (!getGmailClient()) {
    console.error("Gmail not configured — abort.");
    process.exit(1);
  }

  for (const lang of LANGS) {
    const tag = tagSubject(lang);
    console.log(`\n=== ${lang.toUpperCase()} ===`);

    await safe(`booking_confirmation ${lang}`, () =>
      sendBookingConfirmation({
        clientName: `Arnau Test${tag}`,
        clientEmail: TO,
        date: "2026-05-15",
        startTime: "10:00",
        endTime: "10:45",
        meetLink: "https://meet.google.com/abc-defg-hij",
        meetingType: "google_meet",
        phone: "+34600000000",
        notes: "Notas de prueba",
        context: "LLC + autonomo",
        language: lang,
        beneficioMensual: "5000",
        clientesMundiales: true,
        operaDigital: true,
      }),
    );

    await safe(`calculator ${lang}`, () =>
      sendCalculatorEmail({
        email: TO,
        phone: "+34600000000",
        country: "ES",
        regime: "autonomo",
        activity: "consultoria",
        income: 60000,
        annualIncome: 60000,
        effectiveRate: 0.25,
        ahorro: 12000,
        sinLLC: 25000,
        conLLC: 13000,
        localLabel: "Autónomo España",
        breakdown: [
          { label: "IRPF", amount: 9000 },
          { label: "Cuota autónomos", amount: 4000 },
        ],
        language: lang,
        displayCurrency: "EUR",
        bestStructureId: "llc",
        llcVsAutonomo: 12000,
        llcVsSociedad: 7000,
      }),
    );

    await safe(`reminder ${lang}`, () =>
      sendReminderEmail({
        clientName: `Arnau Test${tag}`,
        clientEmail: TO,
        date: "2026-05-16",
        startTime: "11:00",
        endTime: "11:45",
        meetLink: "https://meet.google.com/abc-defg-hij",
        meetingType: "google_meet",
        phone: "+34600000000",
        language: lang,
      }),
    );

    await safe(`reschedule ${lang}`, () =>
      sendRescheduleConfirmation({
        clientName: `Arnau Test${tag}`,
        clientEmail: TO,
        date: "2026-05-20",
        startTime: "12:00",
        endTime: "12:45",
        meetLink: "https://meet.google.com/abc-defg-hij",
        meetingType: "google_meet",
        phone: "+34600000000",
        manageUrl: "https://exentax.com/manage/test-token",
        language: lang,
      }),
    );

    await safe(`cancellation ${lang}`, () =>
      sendCancellationEmail({
        clientName: `Arnau Test${tag}`,
        clientEmail: TO,
        date: "2026-05-15",
        startTime: "10:00",
        endTime: "10:45",
        language: lang,
      }),
    );

    await safe(`followup ${lang}`, () =>
      sendFollowupEmail({
        clientName: `Arnau Test${tag}`,
        clientEmail: TO,
        language: lang,
      }),
    );

    await safe(`incomplete_booking ${lang}`, () =>
      sendIncompleteBookingEmail({
        clientEmail: TO,
        clientName: `Arnau Test${tag}`,
        language: lang,
      }),
    );

    await safe(`noshow ${lang}`, () =>
      sendNoShowRescheduleEmail({
        clientName: `Arnau Test${tag}`,
        clientEmail: TO,
        language: lang,
      }),
    );

    for (const step of [1, 2, 3, 4, 5, 6] as const) {
      await safe(`drip_step_${step} ${lang}`, () =>
        sendDripEmail({
          email: TO,
          name: "Arnau",
          language: lang,
          step,
        }),
      );
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
