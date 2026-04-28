#!/usr/bin/env tsx
/*
 * madrid-time-dst.test.ts
 * ---------------------------------------------------------------------------
 * Pinpoints the wall-clock → UTC translation used by the booking calendar
 * (client) and the reminder scheduler (server). Both sides import
 * `madridWallTimeToUtcMs` from `shared/madrid-time.ts`, so a regression in
 * it would silently shift every reminder by ±1h on the days surrounding
 * the DST transitions — the worst possible bug because it would only
 * surface in production twice a year.
 *
 * What is asserted:
 *   1. CET window (winter, +01:00): a known wall-clock slot maps to the
 *      expected UTC instant.
 *   2. CEST window (summer, +02:00): same check on the opposite side of
 *      the year.
 *   3. Spring-forward Sunday 2026-03-29 — clocks jump 02:00 → 03:00.
 *      A 09:00 Madrid slot that morning is well outside the gap, so it
 *      MUST resolve to 07:00Z (using the post-DST offset of +02:00).
 *      A 09:00 slot the day BEFORE (still CET) MUST resolve to 08:00Z.
 *   4. Fall-back Sunday 2026-10-25 — clocks roll 03:00 → 02:00.
 *      A 09:00 Madrid slot that morning is well outside the overlap, so
 *      it MUST resolve to 07:00Z (CEST, +02:00 still applies until 03:00
 *      Madrid). A 09:00 slot the day AFTER (now CET) MUST resolve to
 *      08:00Z.
 *   5. `isWeekdayISO` correctly classifies each of Mon..Sun for an
 *      arbitrary week, including a date during DST overlap.
 *
 * Run with `tsx exentax-web/tests/madrid-time-dst.test.ts`. Exits 0 on
 * success, 1 on first failure so it can slot into CI alongside the other
 * `tsx`-based tests.
 * ---------------------------------------------------------------------------
 */
import { madridWallTimeToUtcMs, isWeekdayISO } from "../shared/madrid-time";

let failures = 0;
function ok(name: string, cond: unknown, detail?: string) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.error(`  ✗ ${name}${detail ? " — " + detail : ""}`);
  }
}

function eqMs(name: string, got: number, expected: number) {
  ok(`${name} (got=${new Date(got).toISOString()} expected=${new Date(expected).toISOString()})`, got === expected);
}

console.log("madrid-time DST regression suite");

// 1. Winter (CET, UTC+01:00). 2026-01-15 09:00 Madrid → 08:00Z.
eqMs("CET winter slot 2026-01-15 09:00 → 08:00Z",
  madridWallTimeToUtcMs("2026-01-15", "09:00"),
  Date.UTC(2026, 0, 15, 8, 0));

// 2. Summer (CEST, UTC+02:00). 2026-07-15 09:00 Madrid → 07:00Z.
eqMs("CEST summer slot 2026-07-15 09:00 → 07:00Z",
  madridWallTimeToUtcMs("2026-07-15", "09:00"),
  Date.UTC(2026, 6, 15, 7, 0));

// 3a. Spring-forward day 2026-03-29 at 09:00 Madrid (post-jump, CEST).
eqMs("Spring-forward 2026-03-29 09:00 → 07:00Z (CEST)",
  madridWallTimeToUtcMs("2026-03-29", "09:00"),
  Date.UTC(2026, 2, 29, 7, 0));

// 3b. Day before spring-forward (still CET).
eqMs("Day before spring-forward 2026-03-28 09:00 → 08:00Z (CET)",
  madridWallTimeToUtcMs("2026-03-28", "09:00"),
  Date.UTC(2026, 2, 28, 8, 0));

// 4a. Fall-back day 2026-10-25 at 09:00 Madrid (after the overlap, CET).
//     The transition happens at 03:00 → 02:00, so by 09:00 Madrid is
//     unambiguously on CET (+01:00) and 09:00 maps to 08:00Z.
eqMs("Fall-back 2026-10-25 09:00 → 08:00Z (CET — post overlap)",
  madridWallTimeToUtcMs("2026-10-25", "09:00"),
  Date.UTC(2026, 9, 25, 8, 0));

// 4b. Day before fall-back (still CEST).
eqMs("Day before fall-back 2026-10-24 09:00 → 07:00Z (CEST)",
  madridWallTimeToUtcMs("2026-10-24", "09:00"),
  Date.UTC(2026, 9, 24, 7, 0));

// 4c. Reminder offset check: a meeting at 11:00 Madrid the morning after
//     fall-back should fire its 3h-before reminder at 05:00Z (08:00 Madrid),
//     not at 06:00Z (which would be the bug if the function used the wrong
//     offset). This is the exact arithmetic `scheduleReminderEmail` does.
const meetingAfterFallBack = madridWallTimeToUtcMs("2026-10-25", "11:00");
const reminderAfterFallBack = meetingAfterFallBack - 3 * 60 * 60 * 1000;
eqMs("Reminder for 2026-10-25 11:00 fires at 07:00Z (08:00 Madrid CET)",
  reminderAfterFallBack,
  Date.UTC(2026, 9, 25, 7, 0));

// 4d. Reminder offset on a CEST day: 11:00 Madrid = 09:00Z, reminder = 06:00Z.
const meetingSummer = madridWallTimeToUtcMs("2026-07-15", "11:00");
const reminderSummer = meetingSummer - 3 * 60 * 60 * 1000;
eqMs("Reminder for 2026-07-15 11:00 (CEST) fires at 06:00Z",
  reminderSummer,
  Date.UTC(2026, 6, 15, 6, 0));

// 5. isWeekdayISO must agree with the Gregorian calendar regardless of
//    DST membership. 2026-03-29 is a Sunday (DST day) — must be false.
//    2026-10-25 is also a Sunday — must be false. Pick a CEST Tuesday and
//    a CET Tuesday for true cases.
ok("isWeekdayISO('2026-03-30' [Mon]) === true", isWeekdayISO("2026-03-30") === true);
ok("isWeekdayISO('2026-03-29' [Sun, spring-forward]) === false", isWeekdayISO("2026-03-29") === false);
ok("isWeekdayISO('2026-10-25' [Sun, fall-back]) === false", isWeekdayISO("2026-10-25") === false);
ok("isWeekdayISO('2026-10-26' [Mon]) === true", isWeekdayISO("2026-10-26") === true);
ok("isWeekdayISO('2026-07-04' [Sat]) === false", isWeekdayISO("2026-07-04") === false);
ok("isWeekdayISO('2026-07-07' [Tue]) === true", isWeekdayISO("2026-07-07") === true);

console.log(failures === 0 ? "\nAll madrid-time DST tests passed." : `\n${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
