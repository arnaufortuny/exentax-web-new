#!/usr/bin/env node
/**
 * Tests para `scripts/notify-monitoring-offline-issue.mjs` (Task #64).
 *
 * Cubre la interacción real de `manageStickyIssue` con la API de
 * Issues de GitHub usando un fake `fetch` en memoria. Los helpers
 * puros (`decideStickyIssueAction`, `secretsMissing`, …) ya están
 * cubiertos por `notify-live-verification-discord.test.mjs`; aquí
 * lockeamos el flujo open / update / close + tolerancia a errores
 * HTTP que sólo se podía smoke-testear contra GitHub real.
 *
 * Casos:
 *   1. Crea un issue cuando no existe ninguno y faltan secrets.
 *   2. Actualiza body + comenta cuando ya existe el sticky abierto.
 *   3. Cierra (comment + PATCH state=closed) cuando los secrets
 *      vuelven y hay un issue abierto.
 *   4. No-op cuando los secrets vuelven y no hay issue abierto.
 *   5. Filtra por título exacto y por `pull_request` ausente —
 *      la `Issues API` mete PRs en /issues; un PR con el mismo
 *      título no debe contarse como sticky.
 *   6. Trigger no privilegiado (PR de fork) → no llama a la API.
 *   7. Sin `GITHUB_TOKEN` o sin `GITHUB_REPOSITORY` → no llama a
 *      la API y devuelve `no-credentials`.
 *   8. Un fallo HTTP propaga desde `manageStickyIssue` (defensa
 *      "future-proof": el wrapper `main()` es quien lo swallowea
 *      y el caso 9 lo demuestra de punta a punta).
 *   9. `main()` con un trigger privilegiado y la API GitHub
 *      devolviendo 500 NO rompe el job (loggea y resuelve).
 *
 * Uso:   node scripts/notify-monitoring-offline-issue.test.mjs
 * Exit:  0 si todos los assertions pasan; 1 en caso contrario.
 */
import assert from "node:assert/strict";

const { manageStickyIssue, main } = await import(
  "./notify-monitoring-offline-issue.mjs"
);
const { decideStickyIssueAction } = await import(
  "./notify-live-verification-discord.mjs"
);

const API_BASE = "https://api.github.test";
const REPO = "exentax/web";
const TOKEN = "ghs_fake_token_for_tests";
const TITLE = "Live-verification monitoring is offline";
const LABEL = "monitoring";
const RUN_URL = "https://github.com/exentax/web/actions/runs/999";

/**
 * Construye un fake `fetch` con respuestas pre-canned por (METHOD, PATH).
 * Devuelve { fetch, calls } donde `calls` es un array ordenado de las
 * peticiones recibidas para asertar sobre orden y body.
 *
 * `routes` es un objeto cuya clave es "METHOD /path-suffix" y cuyo valor
 * puede ser:
 *   - una función `(req) => { status, body }` para respuestas dinámicas
 *   - un objeto `{ status, body }` para respuestas estáticas
 *   - un Error para forzar un rechazo de red (lo lanza el fetch)
 */
function makeFakeFetch(routes) {
  const calls = [];
  async function fakeFetch(url, init) {
    const method = (init && init.method) || "GET";
    const u = new URL(url);
    const pathSuffix = u.pathname + (u.search || "");
    const key = `${method} ${pathSuffix}`;
    const bodyText = init && init.body ? String(init.body) : null;
    const parsedBody = bodyText ? JSON.parse(bodyText) : undefined;
    calls.push({ method, url, pathSuffix, headers: init?.headers, body: parsedBody });

    let handler = routes[key];
    if (!handler) {
      // Permitimos coincidir sólo por path (sin query) para listar issues.
      handler = routes[`${method} ${u.pathname}`];
    }
    if (!handler) {
      throw new Error(`fake fetch: no route for ${key}`);
    }
    if (handler instanceof Error) throw handler;
    const resolved =
      typeof handler === "function"
        ? await handler({ method, url, pathSuffix, body: parsedBody })
        : handler;
    const { status = 200, body } = resolved;
    const isOk = status >= 200 && status < 300;
    return {
      ok: isOk,
      status,
      statusText: isOk ? "OK" : "Error",
      json: async () => body,
      text: async () => (typeof body === "string" ? body : JSON.stringify(body ?? "")),
    };
  }
  return { fetch: fakeFetch, calls };
}

/**
 * Wrap a test in fetch-stubbing scaffolding so each case is hermetic.
 * Restaura `globalThis.fetch` y silencia logs ruidosos.
 */
async function withFakeFetch(routes, fn) {
  const { fetch, calls } = makeFakeFetch(routes);
  const origFetch = globalThis.fetch;
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;
  const captured = { log: [], warn: [], error: [] };
  globalThis.fetch = fetch;
  console.log = (...a) => captured.log.push(a.join(" "));
  console.warn = (...a) => captured.warn.push(a.join(" "));
  console.error = (...a) => captured.error.push(a.join(" "));
  try {
    const result = await fn({ calls, captured });
    return { result, calls, captured };
  } finally {
    globalThis.fetch = origFetch;
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  }
}

let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`  ok   ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL ${name}`);
    console.error(err);
    failed++;
  }
}

console.log("notify-monitoring-offline-issue.test.mjs");

const SECRETS_MISSING = decideStickyIssueAction({
  eventName: "schedule",
  env: { DISCORD_BOT_TOKEN: "", DISCORD_CHANNEL_ERRORES: "" },
});
const SECRETS_OK = decideStickyIssueAction({
  eventName: "schedule",
  env: {
    DISCORD_BOT_TOKEN: "tok",
    DISCORD_CHANNEL_ERRORES: "1234567890",
  },
});
const SKIP_DECISION = decideStickyIssueAction({
  eventName: "pull_request",
  env: {},
});

// ─────────────────────── Caso 1 ───────────────────────
await test("crea un issue cuando no existe y faltan secrets", async () => {
  const { result, calls } = await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: { status: 200, body: [] },
      [`POST /repos/${REPO}/issues`]: ({ body }) => {
        // Validamos que el POST trae title + body + label correctos.
        assert.equal(body.title, TITLE);
        assert.deepEqual(body.labels, [LABEL]);
        assert.match(body.body, /Secrets ausentes/);
        assert.match(body.body, /DISCORD_BOT_TOKEN/);
        return { status: 201, body: { number: 42 } };
      },
    },
    () =>
      manageStickyIssue({
        decision: SECRETS_MISSING,
        apiBase: API_BASE,
        token: TOKEN,
        repo: REPO,
        title: TITLE,
        label: LABEL,
        runUrl: RUN_URL,
      }),
  );
  assert.equal(result.result, "created");
  assert.equal(result.issueNumber, 42);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].method, "GET");
  assert.match(calls[0].pathSuffix, /^\/repos\/exentax\/web\/issues\?state=open/);
  assert.equal(calls[1].method, "POST");
  // Auth header se pasa correctamente.
  assert.equal(calls[1].headers.Authorization, `Bearer ${TOKEN}`);
});

// ─────────────────────── Caso 2 ───────────────────────
await test("actualiza body + comenta cuando ya existe el sticky abierto", async () => {
  const existing = { number: 7, title: TITLE, pull_request: undefined };
  const { result, calls } = await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: { status: 200, body: [existing] },
      [`PATCH /repos/${REPO}/issues/7`]: ({ body }) => {
        // El PATCH al issue actualiza body, no estado.
        assert.ok(typeof body.body === "string" && body.body.length > 0);
        assert.equal(body.state, undefined);
        return { status: 200, body: { number: 7 } };
      },
      [`POST /repos/${REPO}/issues/7/comments`]: ({ body }) => {
        assert.match(body.body, /Sigue offline/);
        assert.match(body.body, /DISCORD_BOT_TOKEN/);
        // El comment menciona la run URL si se pasa.
        assert.match(body.body, /actions\/runs\/999/);
        return { status: 201, body: { id: 1 } };
      },
    },
    () =>
      manageStickyIssue({
        decision: SECRETS_MISSING,
        apiBase: API_BASE,
        token: TOKEN,
        repo: REPO,
        title: TITLE,
        label: LABEL,
        runUrl: RUN_URL,
      }),
  );
  assert.equal(result.result, "updated");
  assert.equal(result.issueNumber, 7);
  // Orden importa: PATCH del body, luego POST del comment.
  assert.equal(calls.length, 3);
  assert.equal(calls[1].method, "PATCH");
  assert.equal(calls[2].method, "POST");
  assert.match(calls[2].pathSuffix, /\/comments$/);
});

// ─────────────────────── Caso 3 ───────────────────────
await test("cierra el issue (comment + PATCH state=closed) cuando los secrets vuelven", async () => {
  const existing = { number: 11, title: TITLE };
  const { result, calls } = await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: { status: 200, body: [existing] },
      [`POST /repos/${REPO}/issues/11/comments`]: ({ body }) => {
        assert.match(body.body, /Auto-resolución/);
        return { status: 201, body: { id: 1 } };
      },
      [`PATCH /repos/${REPO}/issues/11`]: ({ body }) => {
        // El PATCH cierra explícitamente con state_reason=completed.
        assert.equal(body.state, "closed");
        assert.equal(body.state_reason, "completed");
        return { status: 200, body: { number: 11, state: "closed" } };
      },
    },
    () =>
      manageStickyIssue({
        decision: SECRETS_OK,
        apiBase: API_BASE,
        token: TOKEN,
        repo: REPO,
        title: TITLE,
        label: LABEL,
        runUrl: RUN_URL,
      }),
  );
  assert.equal(result.result, "closed");
  assert.equal(result.issueNumber, 11);
  // Orden: GET, POST comment, PATCH close.
  assert.equal(calls.length, 3);
  assert.equal(calls[1].method, "POST");
  assert.match(calls[1].pathSuffix, /\/comments$/);
  assert.equal(calls[2].method, "PATCH");
});

// ─────────────────────── Caso 4 ───────────────────────
await test("no-op cuando los secrets vuelven y no hay sticky abierto", async () => {
  const { result, calls } = await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: { status: 200, body: [] },
    },
    () =>
      manageStickyIssue({
        decision: SECRETS_OK,
        apiBase: API_BASE,
        token: TOKEN,
        repo: REPO,
        title: TITLE,
        label: LABEL,
      }),
  );
  assert.equal(result.result, "noop-already-closed");
  assert.equal(calls.length, 1, "sólo debe consultar /issues, no escribir");
});

// ─────────────────────── Caso 5 ───────────────────────
await test("filtra por título exacto y descarta PRs devueltos por /issues", async () => {
  // La Issues API mete PRs en la lista; el helper debe ignorarlos
  // aunque coincidan por título y aceptar SOLO el issue cuyo título
  // sea exacto.
  const { result, calls } = await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: {
        status: 200,
        body: [
          { number: 1, title: "Otro título", pull_request: undefined },
          { number: 2, title: TITLE, pull_request: { url: "x" } }, // PR ignorado
          { number: 3, title: `${TITLE} (variante)`, pull_request: undefined },
          { number: 4, title: TITLE, pull_request: undefined }, // este sí
        ],
      },
      [`PATCH /repos/${REPO}/issues/4`]: { status: 200, body: { number: 4 } },
      [`POST /repos/${REPO}/issues/4/comments`]: { status: 201, body: { id: 1 } },
    },
    () =>
      manageStickyIssue({
        decision: SECRETS_MISSING,
        apiBase: API_BASE,
        token: TOKEN,
        repo: REPO,
        title: TITLE,
        label: LABEL,
      }),
  );
  assert.equal(result.result, "updated");
  assert.equal(result.issueNumber, 4);
  // Sanidad: nunca se tocó el #2 (PR) ni el #3 (título distinto).
  for (const c of calls) {
    assert.equal(/\/issues\/(2|3)(\/|$)/.test(c.pathSuffix), false);
  }
});

// ─────────────────────── Caso 6 ───────────────────────
await test("trigger no privilegiado → no llama a la API", async () => {
  const { result, calls } = await withFakeFetch({}, () =>
    manageStickyIssue({
      decision: SKIP_DECISION,
      apiBase: API_BASE,
      token: TOKEN,
      repo: REPO,
      title: TITLE,
      label: LABEL,
    }),
  );
  assert.equal(result.result, "skipped");
  assert.equal(calls.length, 0);
});

// ─────────────────────── Caso 7 ───────────────────────
await test("sin GITHUB_TOKEN → devuelve no-credentials sin tocar la API", async () => {
  const { result, calls } = await withFakeFetch({}, () =>
    manageStickyIssue({
      decision: SECRETS_MISSING,
      apiBase: API_BASE,
      token: "",
      repo: REPO,
      title: TITLE,
      label: LABEL,
    }),
  );
  assert.equal(result.result, "no-credentials");
  assert.equal(calls.length, 0);
});

await test("sin GITHUB_REPOSITORY → devuelve no-credentials sin tocar la API", async () => {
  const { result, calls } = await withFakeFetch({}, () =>
    manageStickyIssue({
      decision: SECRETS_MISSING,
      apiBase: API_BASE,
      token: TOKEN,
      repo: "",
      title: TITLE,
      label: LABEL,
    }),
  );
  assert.equal(result.result, "no-credentials");
  assert.equal(calls.length, 0);
});

// ─────────────────────── Caso 8 ───────────────────────
await test("manageStickyIssue propaga el error HTTP al caller (lo swallowea main())", async () => {
  // Documenta el contrato actual: `manageStickyIssue` NO swallowea
  // errores HTTP — quien lo hace es `main()`. Si un futuro refactor
  // mueve el try/catch dentro del helper, este test fallará y
  // obligará a actualizar la convención de "main es quien tolera".
  let caught = null;
  await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: { status: 500, body: "boom" },
    },
    async () => {
      try {
        await manageStickyIssue({
          decision: SECRETS_MISSING,
          apiBase: API_BASE,
          token: TOKEN,
          repo: REPO,
          title: TITLE,
          label: LABEL,
        });
      } catch (err) {
        caught = err;
      }
    },
  );
  assert.ok(caught instanceof Error, "debe lanzar un Error");
  assert.match(caught.message, /500/);
});

// ─────────────────────── Caso 9 ───────────────────────
await test("main(): un 500 de GitHub NO propaga (loggea y resuelve)", async () => {
  // Este es el contrato end-to-end que el task pide proteger: un
  // fallo de la API de Issues nunca debe romper el job de cron.
  const prevEnv = { ...process.env };
  process.env.GITHUB_EVENT_NAME = "schedule";
  process.env.GITHUB_TOKEN = TOKEN;
  process.env.GITHUB_REPOSITORY = REPO;
  process.env.GITHUB_API_URL = API_BASE;
  process.env.GITHUB_RUN_URL = RUN_URL;
  process.env.MONITORING_ISSUE_TITLE = TITLE;
  process.env.MONITORING_ISSUE_LABEL = LABEL;
  delete process.env.DISCORD_BOT_TOKEN;
  delete process.env.DISCORD_CHANNEL_ERRORES;

  try {
    const { captured } = await withFakeFetch(
      {
        [`GET /repos/${REPO}/issues`]: { status: 500, body: "boom" },
      },
      async () => {
        // No try/catch: si propaga, este test falla.
        await main();
      },
    );
    // Debe haber loggeado el fallo defensivamente.
    const allErr = captured.error.join("\n");
    assert.match(
      allErr,
      /No pude gestionar el issue sticky/,
      "main() debe loggear el fallo defensivo",
    );
    assert.match(allErr, /500/);
  } finally {
    process.env = prevEnv;
  }
});

// ─────────────────────── Caso extra: token jamás se loggea ───────────────────────
await test("ningún log emitido por manageStickyIssue contiene el token (sanity)", async () => {
  const { captured } = await withFakeFetch(
    {
      [`GET /repos/${REPO}/issues`]: { status: 200, body: [] },
      [`POST /repos/${REPO}/issues`]: { status: 201, body: { number: 1 } },
    },
    () =>
      manageStickyIssue({
        decision: SECRETS_MISSING,
        apiBase: API_BASE,
        token: TOKEN,
        repo: REPO,
        title: TITLE,
        label: LABEL,
      }),
  );
  const all = [...captured.log, ...captured.warn, ...captured.error].join("\n");
  assert.equal(
    all.includes(TOKEN),
    false,
    "el token no debe aparecer en ningún log",
  );
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
