#!/usr/bin/env node
/**
 * Smoke tests para `audit-bundle-diff-notify-discord.mjs` (Task #50).
 *
 * Cubre las cuatro ramas críticas del notifier:
 *   1. Sin token / channel → no envía nada, exit 0.
 *   2. JSON con `status: "single-entry"` → no envía nada, exit 0.
 *   3. JSON sin regresiones → no envía nada, exit 0.
 *   4. JSON con regresiones → envía un embed válido (color EXENTAX_RED,
 *      sin emojis en title/description/fields, footer correcto, longitud
 *      de description dentro de los límites de Discord).
 *
 * El script se importa con `fetch` mockeado para capturar el payload
 * sin tocar la API real de Discord.
 *
 * Uso:
 *   node scripts/audit/audit-bundle-diff-notify-discord.test.mjs
 *
 * Exit:
 *   0 — todos los assertions pasaron.
 *   1 — algún assertion falló (mensaje en stderr).
 */
import assert from "node:assert/strict";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { main: runNotifier } = await import("./audit-bundle-diff-notify-discord.mjs");

const EXENTAX_RED = 0xe53935;
const EXENTAX_NEON = 0x00e510;
// Política Exentax: sin emojis en mensajes Discord. Detectamos cualquier
// codepoint en los rangos de emoji más comunes (Misc Symbols, Dingbats,
// Emoticons, Symbols & Pictographs, Transport, Flags, Supplemental).
const EMOJI_RE = /[\u2600-\u27BF\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u;

function makeTempDir() {
  return mkdtempSync(path.join(tmpdir(), "bundle-diff-notify-"));
}

function makeRegressionDiff() {
  return {
    thresholdPct: 5,
    previous: {
      generatedAt: "2026-04-21T10:00:00Z",
      commit: "abc1234",
      totalKb: 1000.0,
      entryIndexKb: 480.0,
    },
    current: {
      generatedAt: "2026-04-22T10:00:00Z",
      commit: "def5678",
      totalKb: 1100.0,
      entryIndexKb: 520.0,
    },
    deltas: { totalKb: 100.0, totalPct: 10.0, gzipPct: 8.5, entryIndexPct: 8.3 },
    top: [],
    regressions: [
      { kind: "total", pct: 10.0, prevKb: 1000.0, currKb: 1100.0 },
      { kind: "entry-index", pct: 8.3, prevKb: 480.0, currKb: 520.0 },
      {
        kind: "chunk",
        base: "vendor-react.js",
        category: "vendor-react",
        pct: 7.1,
        prevKb: 193.0,
        currKb: 206.7,
      },
    ],
    pass: false,
  };
}

function makeCleanDiff() {
  return {
    thresholdPct: 5,
    previous: { generatedAt: "x", commit: "a", totalKb: 1000, entryIndexKb: 400 },
    current: { generatedAt: "y", commit: "b", totalKb: 1000, entryIndexKb: 400 },
    deltas: { totalKb: 0, totalPct: 0, gzipPct: 0, entryIndexPct: 0 },
    top: [],
    regressions: [],
    pass: true,
  };
}

async function runScript({ env }) {
  const calls = [];
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, body: opts?.body });
    return new Response("{}", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  const origEnv = { ...process.env };
  // Limpiar variables relevantes del entorno padre y aplicar las del test.
  for (const k of [
    "DISCORD_BOT_TOKEN",
    "DISCORD_CHANNEL_ERRORES",
    "BUNDLE_DIFF_JSON",
    "BUNDLE_DIFF_FORCE",
    "GITHUB_RUN_URL",
    "GITHUB_SHA",
    "GITHUB_REPOSITORY",
    "GITHUB_REF",
  ]) {
    delete process.env[k];
  }
  for (const [k, v] of Object.entries(env)) {
    if (v != null) process.env[k] = v;
  }
  try {
    await runNotifier();
  } finally {
    process.env = origEnv;
    globalThis.fetch = origFetch;
  }
  return { calls };
}

function assertNoEmoji(str, where) {
  assert.ok(
    !EMOJI_RE.test(str),
    `Política de brand: '${where}' contiene un emoji prohibido: ${JSON.stringify(str)}`,
  );
}

let failures = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`  ok  ${name}`);
  } catch (err) {
    failures += 1;
    console.error(`  FAIL ${name}\n      ${err.message}`);
  }
}

async function main() {
  const tmp = makeTempDir();
  try {
    const regressionPath = path.join(tmp, "regression.json");
    const cleanPath = path.join(tmp, "clean.json");
    const singlePath = path.join(tmp, "single.json");
    const malformedPath = path.join(tmp, "malformed.json");
    writeFileSync(regressionPath, JSON.stringify(makeRegressionDiff()));
    writeFileSync(cleanPath, JSON.stringify(makeCleanDiff()));
    writeFileSync(
      singlePath,
      JSON.stringify({ thresholdPct: 5, status: "single-entry", entries: 1, pass: true }),
    );
    writeFileSync(malformedPath, "{ this is not json");

    console.log("audit-bundle-diff-notify-discord smoke tests");

    await test("sin token: no envía nada", async () => {
      const { calls } = await runScript({
        env: { BUNDLE_DIFF_JSON: regressionPath },
      });
      assert.equal(calls.length, 0);
    });

    await test("status=single-entry: no envía nada", async () => {
      const { calls } = await runScript({
        env: {
          BUNDLE_DIFF_JSON: singlePath,
          DISCORD_BOT_TOKEN: "fake",
          DISCORD_CHANNEL_ERRORES: "ch1",
        },
      });
      assert.equal(calls.length, 0);
    });

    await test("JSON malformado: no envía nada y no crashea", async () => {
      const { calls } = await runScript({
        env: {
          BUNDLE_DIFF_JSON: malformedPath,
          DISCORD_BOT_TOKEN: "fake",
          DISCORD_CHANNEL_ERRORES: "ch1",
        },
      });
      assert.equal(calls.length, 0);
    });

    await test("sin regresiones (pass=true): no envía nada", async () => {
      const { calls } = await runScript({
        env: {
          BUNDLE_DIFF_JSON: cleanPath,
          DISCORD_BOT_TOKEN: "fake",
          DISCORD_CHANNEL_ERRORES: "ch1",
        },
      });
      assert.equal(calls.length, 0);
    });

    await test("sin regresiones + BUNDLE_DIFF_FORCE=1: envía embed neon", async () => {
      const { calls } = await runScript({
        env: {
          BUNDLE_DIFF_JSON: cleanPath,
          DISCORD_BOT_TOKEN: "fake",
          DISCORD_CHANNEL_ERRORES: "ch1",
          BUNDLE_DIFF_FORCE: "1",
        },
      });
      assert.equal(calls.length, 1, "esperaba 1 llamada a Discord");
      const payload = JSON.parse(calls[0].body);
      assert.equal(payload.embeds[0].color, EXENTAX_NEON);
      assert.equal(payload.embeds[0].title, "Bundle estable");
    });

    await test("regresión: envía embed válido (forma + brand policy)", async () => {
      const { calls } = await runScript({
        env: {
          BUNDLE_DIFF_JSON: regressionPath,
          DISCORD_BOT_TOKEN: "fake",
          DISCORD_CHANNEL_ERRORES: "channel123",
          GITHUB_REPOSITORY: "carles/exentax",
          GITHUB_REF: "refs/heads/main",
          GITHUB_SHA: "abcdef1234567890",
          GITHUB_RUN_URL: "https://github.com/foo/bar/actions/runs/1",
        },
      });
      assert.equal(calls.length, 1);
      assert.equal(
        calls[0].url,
        "https://discord.com/api/v10/channels/channel123/messages",
      );
      const payload = JSON.parse(calls[0].body);
      // Estructura básica.
      assert.ok(typeof payload.content === "string");
      assert.equal(payload.embeds.length, 1);
      const embed = payload.embeds[0];
      // Brand policy: solo dos colores admitidos.
      assert.ok(
        [EXENTAX_RED, EXENTAX_NEON].includes(embed.color),
        `Color fuera de paleta: ${embed.color}`,
      );
      // Regresión → EXENTAX_RED.
      assert.equal(embed.color, EXENTAX_RED);
      // Brand policy: sin emojis.
      assertNoEmoji(payload.content, "content");
      assertNoEmoji(embed.title, "embed.title");
      assertNoEmoji(embed.description, "embed.description");
      for (const f of embed.fields) {
        assertNoEmoji(f.name, `field.name=${f.name}`);
        assertNoEmoji(f.value, `field.value=${f.value}`);
      }
      // Footer canónico.
      assert.equal(embed.footer.text, "Exentax · CI · bundle-audit");
      // Límites de Discord.
      assert.ok(embed.description.length <= 4096, "description > 4096");
      assert.ok(payload.content.length <= 2000, "content > 2000");
      assert.ok(embed.fields.length <= 25, "fields > 25");
      // El sha aparece truncado a 7 chars.
      const commitField = embed.fields.find((f) => f.name === "Commit");
      assert.ok(commitField, "falta field Commit");
      assert.equal(commitField.value, "`abcdef1`");
      // Cada regresión está listada en la description.
      for (const r of makeRegressionDiff().regressions) {
        const label = r.kind === "chunk" ? `${r.category}/${r.base}` : r.kind;
        assert.ok(
          embed.description.includes(label),
          `description no menciona ${label}`,
        );
      }
      // Url al run set.
      assert.equal(embed.url, "https://github.com/foo/bar/actions/runs/1");
    });

    await test("regresión: el header 'Bot <token>' va en la cabecera (no en URL)", async () => {
      const { calls } = await runScript({
        env: {
          BUNDLE_DIFF_JSON: regressionPath,
          DISCORD_BOT_TOKEN: "supersecret",
          DISCORD_CHANNEL_ERRORES: "ch1",
        },
      });
      assert.equal(calls.length, 1);
      assert.ok(
        !calls[0].url.includes("supersecret"),
        "el token no debe aparecer en la URL",
      );
      assert.ok(
        !calls[0].body.includes("supersecret"),
        "el token no debe aparecer en el body",
      );
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  console.log("");
  if (failures > 0) {
    console.error(`${failures} test(s) failed`);
    process.exitCode = 1;
  } else {
    console.log("all tests passed");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
