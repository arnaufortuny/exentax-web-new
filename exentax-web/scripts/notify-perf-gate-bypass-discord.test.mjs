#!/usr/bin/env node
/**
 * Smoke tests para `notify-perf-gate-bypass-discord.mjs` (Task #23).
 *
 * Cubre las ramas críticas del notifier:
 *   1. Sin token / channel              → no envía nada.
 *   2. Sin GITHUB_TOKEN                 → no envía nada (warning).
 *   3. Ambos gates bypassados           → embed RED con Lighthouse + bundle-diff.
 *   4. Solo Lighthouse                  → embed RED con Lighthouse, sin bundle.
 *   5. Solo bundle                      → embed RED con bundle-diff, sin LH.
 *   6. Ningún marcador (label preventivo) → embed NEON, indica preventivo.
 *   7. Sin evento `labeled`             → autor "@desconocido".
 *   8. Token Discord no aparece en URL ni body.
 *
 * El script se importa con `fetch` mockeado para capturar el payload
 * sin tocar ni la API de GitHub ni la de Discord.
 *
 * Uso:   node scripts/notify-perf-gate-bypass-discord.test.mjs
 * Exit:  0 si todos los assertions pasan; 1 en caso contrario.
 */
import assert from "node:assert/strict";

const EXENTAX_RED = 0xe53935;
const EXENTAX_NEON = 0x00e510;
// Política Exentax: sin emojis en mensajes Discord.
const EMOJI_RE =
  /[\u2600-\u27BF\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u;

const LH_BYPASS_MARKER = "<!-- lighthouse-bypass-comment:task-20 -->";
const BUNDLE_BYPASS_MARKER = "<!-- bundle-bypass-comment:task-20 -->";

const { main: runNotifier } = await import(
  "./notify-perf-gate-bypass-discord.mjs"
);

function makeEvents({ author = "carles" } = {}) {
  return [
    { event: "assigned", actor: { login: "bot" } },
    {
      event: "labeled",
      label: { name: "needs-review" },
      actor: { login: "bot" },
    },
    {
      event: "labeled",
      label: { name: "bypass-perf-gate" },
      actor: { login: author },
    },
    { event: "head_ref_force_pushed", actor: { login: author } },
  ];
}

function makeComments({ lh = false, bundle = false, extra = false } = {}) {
  const out = [];
  if (extra) out.push({ body: "Looks good to me!" });
  if (lh)
    out.push({
      body: `${LH_BYPASS_MARKER}\nLighthouse bypassed for desktop+mobile.`,
    });
  if (bundle)
    out.push({ body: `${BUNDLE_BYPASS_MARKER}\nBundle bypass.` });
  return out;
}

async function runScript({ env, ghEvents = [], ghComments = [] }) {
  const calls = { discord: [], gh: [] };
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    if (typeof url === "string" && url.startsWith("https://discord.com/")) {
      calls.discord.push({ url, opts });
      return new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    if (typeof url === "string" && url.startsWith("https://api.github.com/")) {
      calls.gh.push({ url, opts });
      let body = [];
      if (url.includes("/events")) body = ghEvents;
      else if (url.includes("/comments")) body = ghComments;
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    throw new Error(`Unexpected fetch in test: ${url}`);
  };
  const origEnv = { ...process.env };
  for (const k of [
    "DISCORD_BOT_TOKEN",
    "DISCORD_CHANNEL_ERRORES",
    "GITHUB_TOKEN",
    "GITHUB_REPOSITORY",
    "GITHUB_RUN_URL",
    "PR_NUMBER",
    "PR_URL",
    "PR_TITLE",
    "PR_AUTHOR",
    "PR_HEAD_SHA",
    "PR_MERGE_SHA",
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
  return calls;
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

const baseEnv = {
  DISCORD_BOT_TOKEN: "fake",
  DISCORD_CHANNEL_ERRORES: "ch1",
  GITHUB_TOKEN: "ghtoken",
  GITHUB_REPOSITORY: "carles/exentax",
  GITHUB_RUN_URL: "https://github.com/carles/exentax/actions/runs/1",
  PR_NUMBER: "42",
  PR_URL: "https://github.com/carles/exentax/pull/42",
  PR_TITLE: "Add big editor",
  PR_AUTHOR: "alice",
  PR_MERGE_SHA: "abcdef1234567890",
};

console.log("notify-perf-gate-bypass-discord smoke tests");

await test("sin token Discord: no envía nada y no llama a GH", async () => {
  const { discord, gh } = await runScript({
    env: { ...baseEnv, DISCORD_BOT_TOKEN: "" },
    ghEvents: makeEvents(),
    ghComments: makeComments({ lh: true }),
  });
  assert.equal(discord.length, 0);
  assert.equal(gh.length, 0);
});

await test("sin GITHUB_TOKEN: no envía nada", async () => {
  const { discord, gh } = await runScript({
    env: { ...baseEnv, GITHUB_TOKEN: "" },
    ghEvents: makeEvents(),
    ghComments: makeComments({ lh: true }),
  });
  assert.equal(discord.length, 0);
  assert.equal(gh.length, 0);
});

await test("ambos gates bypassados: envía embed RED válido", async () => {
  const { discord, gh } = await runScript({
    env: baseEnv,
    ghEvents: makeEvents({ author: "carles" }),
    ghComments: makeComments({ lh: true, bundle: true, extra: true }),
  });
  assert.equal(discord.length, 1, "esperaba 1 mensaje a Discord");
  assert.ok(
    gh.length >= 2,
    "esperaba al menos 2 llamadas a GitHub (events + comments)",
  );
  const payload = JSON.parse(discord[0].opts.body);
  const embed = payload.embeds[0];
  assert.equal(embed.color, EXENTAX_RED);
  assert.equal(embed.footer.text, "Exentax · CI · perf-gate-bypass");
  assert.ok(embed.title.includes("Performance gate"));
  assert.ok(embed.description.includes("Lighthouse"));
  assert.ok(embed.description.includes("bundle-diff"));
  assert.ok(embed.description.includes("@carles"));
  assert.ok(embed.description.includes("@alice"));
  assert.ok(embed.description.includes("#42"));
  assert.ok(payload.content.includes("#42"));
  // Brand policy: sin emojis.
  assertNoEmoji(payload.content, "content");
  assertNoEmoji(embed.title, "embed.title");
  assertNoEmoji(embed.description, "embed.description");
  for (const f of embed.fields) {
    assertNoEmoji(f.name, `field.name=${f.name}`);
    assertNoEmoji(f.value, `field.value=${f.value}`);
  }
  // Límites de Discord.
  assert.ok(embed.description.length <= 4096, "description > 4096");
  assert.ok(payload.content.length <= 2000, "content > 2000");
  assert.ok(embed.fields.length <= 25, "fields > 25");
  // El merge SHA aparece truncado a 7 chars.
  const mergeField = embed.fields.find((f) => f.name === "Merge");
  assert.ok(mergeField, "falta field Merge");
  assert.equal(mergeField.value, "`abcdef1`");
  // URL del embed apunta al PR.
  assert.equal(embed.url, baseEnv.PR_URL);
  // Field "Gates" lista ambos gates.
  const gatesField = embed.fields.find((f) => f.name === "Gates");
  assert.ok(gatesField);
  assert.ok(gatesField.value.includes("Lighthouse"));
  assert.ok(gatesField.value.includes("bundle-diff"));
});

await test("solo Lighthouse bypassado: enumera solo Lighthouse", async () => {
  const { discord } = await runScript({
    env: baseEnv,
    ghEvents: makeEvents(),
    ghComments: makeComments({ lh: true }),
  });
  assert.equal(discord.length, 1);
  const embed = JSON.parse(discord[0].opts.body).embeds[0];
  assert.equal(embed.color, EXENTAX_RED);
  const gatesField = embed.fields.find((f) => f.name === "Gates");
  assert.equal(gatesField.value, "Lighthouse");
});

await test("solo bundle bypassado: enumera solo bundle-diff", async () => {
  const { discord } = await runScript({
    env: baseEnv,
    ghEvents: makeEvents(),
    ghComments: makeComments({ bundle: true }),
  });
  assert.equal(discord.length, 1);
  const embed = JSON.parse(discord[0].opts.body).embeds[0];
  assert.equal(embed.color, EXENTAX_RED);
  const gatesField = embed.fields.find((f) => f.name === "Gates");
  assert.equal(gatesField.value, "bundle-diff");
});

await test("sin marcadores: indica label preventivo y usa color NEON", async () => {
  const { discord } = await runScript({
    env: baseEnv,
    ghEvents: makeEvents(),
    ghComments: makeComments({ extra: true }),
  });
  assert.equal(discord.length, 1);
  const embed = JSON.parse(discord[0].opts.body).embeds[0];
  assert.equal(embed.color, EXENTAX_NEON);
  assert.ok(embed.description.includes("preventivo"));
  assert.ok(embed.title.includes("sin fallo"));
});

await test("autor del label desconocido si no hay evento `labeled`", async () => {
  const { discord } = await runScript({
    env: baseEnv,
    ghEvents: [{ event: "assigned", actor: { login: "bot" } }],
    ghComments: makeComments({ lh: true }),
  });
  assert.equal(discord.length, 1);
  const embed = JSON.parse(discord[0].opts.body).embeds[0];
  assert.ok(embed.description.includes("@desconocido"));
});

await test("token Discord no aparece en URL ni body", async () => {
  const { discord } = await runScript({
    env: { ...baseEnv, DISCORD_BOT_TOKEN: "supersecret" },
    ghEvents: makeEvents(),
    ghComments: makeComments({ lh: true }),
  });
  assert.equal(discord.length, 1);
  assert.ok(
    !discord[0].url.includes("supersecret"),
    "el token no debe aparecer en la URL",
  );
  assert.ok(
    !discord[0].opts.body.includes("supersecret"),
    "el token no debe aparecer en el body",
  );
});

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`);
  process.exitCode = 1;
} else {
  console.log("\nall tests passed");
}
