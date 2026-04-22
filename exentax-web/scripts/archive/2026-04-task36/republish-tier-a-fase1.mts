#!/usr/bin/env tsx
/**
 * republish-tier-a-fase1.mts
 * --------------------------------------------------------------------------
 * Republicar las 36 URLs de la fase 1 del overhaul (6 slugs tier-A x 6
 * idiomas) reutilizando los modulos existentes del servidor:
 *
 *   - server/indexnow.ts       -> submitIndexNowForUrls(urls)
 *   - server/google-indexing.ts -> pingGoogleIndexingForNewArticles()
 *
 * No re-implementa la logica de submission, solo orquesta + audita por URL
 * y anexa el bloque "Republicacion fase 1" al final de
 * docs/seo/blog-overhaul-2026.md (sustituyendo el bloque anterior si existe).
 *
 * Uso:
 *   SITE_URL=https://exentax.com npx tsx scripts/republish-tier-a-fase1.mts
 *   SITE_URL=https://<dev-domain> npx tsx scripts/republish-tier-a-fase1.mts
 *
 * El INDEXNOW_KEY ya esta configurado como secret en el entorno; el endpoint
 * /<KEY>.txt lo registra `registerIndexNowRoutes`. Para que IndexNow acepte
 * las URLs, el host debe servir el fichero (probado por la propia API antes
 * de aceptar la submission).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { FEATURED_OWNER_SLUGS, BLOG_POSTS } from "../client/src/data/blog-posts";
import { getTranslatedSlug } from "../client/src/data/blog-posts-slugs";
import {
  submitIndexNowForUrls,
  type IndexNowPerUrlResult,
} from "../server/indexnow";
import {
  submitGoogleIndexingForUrls,
  type GoogleIndexingPerUrlResult,
} from "../server/google-indexing";

type Lang = "es" | "en" | "fr" | "de" | "pt" | "ca";
const LANGS: Lang[] = ["es", "en", "fr", "de", "pt", "ca"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = (process.env.SITE_URL || "https://exentax.com").replace(/\/$/, "");
const LOG_PATH = resolve(ROOT, "docs/seo/blog-overhaul-2026.md");
const NOW = new Date().toISOString();

// ---------- 1. Construir las 36 URLs (FEATURED_OWNER_SLUGS x 6 idiomas) ----------
type RowMeta = { base: string; lang: Lang; url: string };
const slugIsKnown = new Set(BLOG_POSTS.map((p) => p.slug));
const rows: RowMeta[] = [];
for (const base of FEATURED_OWNER_SLUGS) {
  if (!slugIsKnown.has(base)) {
    console.warn(`Aviso: ${base} no aparece en BLOG_POSTS — se omite`);
    continue;
  }
  for (const lang of LANGS) {
    const langSlug = getTranslatedSlug(base, lang) || base;
    rows.push({ base, lang, url: `${SITE_URL}/${lang}/blog/${langSlug}` });
  }
}
console.log(
  `Republicando ${rows.length} URLs tier-A (${FEATURED_OWNER_SLUGS.length} slugs x ${LANGS.length} idiomas) contra ${SITE_URL}`,
);

// ---------- 2. IndexNow (via server/indexnow.ts) ----------
console.log("\n[1/2] IndexNow (server/indexnow.ts → submitIndexNowForUrls)");

// 2a. Pre-flight: IndexNow valida la propiedad del host descargando keyLocation
// y comparando el cuerpo con la key. Si SITE_URL apunta a un host que devuelve
// HTML (SPA fallback) o un valor distinto, las 36 submissions devuelven 403
// silenciosamente. Lo detectamos antes y abortamos con un error accionable.
const NOW_PRE = new Date().toISOString();
const envKey = (process.env.INDEXNOW_KEY || "").trim();
const keyLocation =
  (process.env.INDEXNOW_KEY_LOCATION || "").trim() ||
  (envKey ? `${SITE_URL}/${envKey}.txt` : "");

type PreflightOutcome =
  | { ok: true }
  | { ok: false; reason: string };

async function preflightKeyLocation(): Promise<PreflightOutcome> {
  if (!envKey) {
    return { ok: false, reason: "INDEXNOW_KEY no configurada en este entorno" };
  }
  if (!keyLocation) {
    return { ok: false, reason: "No se pudo construir keyLocation" };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(keyLocation, { signal: controller.signal }).finally(
      () => clearTimeout(timer),
    );
    if (res.status !== 200) {
      return {
        ok: false,
        reason: `keyLocation ${keyLocation} devolvio HTTP ${res.status} (IndexNow exige 200 con cuerpo == key)`,
      };
    }
    const ctype = (res.headers.get("content-type") || "").toLowerCase();
    const body = (await res.text()).trim();
    if (body !== envKey) {
      const preview = body.slice(0, 80).replace(/\s+/g, " ");
      return {
        ok: false,
        reason:
          `keyLocation ${keyLocation} devolvio HTTP 200 pero el cuerpo no coincide con INDEXNOW_KEY ` +
          `(content-type=${ctype || "?"}, primeros 80 bytes: "${preview}"). ` +
          `Causa tipica: el deploy de produccion no sirve aun el fichero ` +
          `client/public/${envKey}.txt y el SPA catch-all responde con HTML; o ` +
          `INDEXNOW_KEY del entorno no coincide con la key publicada en el host.`,
      };
    }
    console.log(`  Pre-flight OK: ${keyLocation} sirve la key correcta.`);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `No se pudo descargar keyLocation ${keyLocation}: ${msg}` };
  }
}

const preflight = await preflightKeyLocation();

let indexnowOut: { key: string | null; results: IndexNowPerUrlResult[] };
if (!preflight.ok) {
  console.log(
    `  Pre-flight FALLO — saltamos las ${rows.length} submissions a IndexNow.\n` +
      `  Motivo: ${preflight.reason}`,
  );
  indexnowOut = {
    key: envKey || null,
    results: rows.map((r) => ({
      url: r.url,
      ok: false,
      status: null,
      at: NOW_PRE,
      error: `preflight: ${preflight.reason}`,
    })),
  };
} else {
  indexnowOut = await submitIndexNowForUrls(rows.map((r) => r.url));
}

const byUrl = new Map<string, IndexNowPerUrlResult>(
  indexnowOut.results.map((r) => [r.url, r]),
);
const inOk = indexnowOut.results.filter((r) => r.ok).length;
const inFail = indexnowOut.results.filter((r) => !r.ok && r.status !== null).length;
const inSkip = indexnowOut.results.filter((r) => r.status === null).length;
console.log(`  Resultado IndexNow: ${inOk} OK, ${inFail} fallos HTTP, ${inSkip} omitidas`);
if (!indexnowOut.key) {
  console.log("  (INDEXNOW_KEY no configurada en este entorno)");
}

// ---------- 3. Google Indexing API (via server/google-indexing.ts) ----------
console.log("\n[2/2] Google Indexing API (server/google-indexing.ts → submitGoogleIndexingForUrls)");
let googleOut: {
  enabled: boolean;
  hasKey: boolean;
  results: GoogleIndexingPerUrlResult[];
};
try {
  googleOut = await submitGoogleIndexingForUrls(rows.map((r) => r.url));
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.log(`  Google Indexing fallo inesperado: ${msg}`);
  googleOut = {
    enabled: false,
    hasKey: false,
    results: rows.map((r) => ({
      url: r.url,
      ok: false,
      status: null,
      at: NOW,
      error: msg.slice(0, 300),
    })),
  };
}
const googleByUrl = new Map<string, GoogleIndexingPerUrlResult>(
  googleOut.results.map((r) => [r.url, r]),
);
const goOk = googleOut.results.filter((r) => r.ok).length;
const goFail = googleOut.results.filter((r) => !r.ok && r.status !== null).length;
const goSkip = googleOut.results.filter((r) => r.status === null).length;
console.log(
  `  Resultado Google: ${goOk} OK, ${goFail} fallos HTTP, ${goSkip} omitidas` +
    (!googleOut.enabled
      ? " (GOOGLE_INDEXING_API_ENABLE!=1)"
      : !googleOut.hasKey
        ? " (GOOGLE_SERVICE_ACCOUNT_KEY ausente o invalida)"
        : ""),
);

// ---------- 4. Construir bloque markdown ----------
const lines: string[] = [];
lines.push("");
lines.push("## 9. Republicacion fase 1 (IndexNow + Google Indexing API)");
lines.push("");
lines.push(`- **Ejecutado**: ${NOW}`);
lines.push(`- **Universo**: ${rows.length} URLs (${FEATURED_OWNER_SLUGS.length} slugs tier-A x ${LANGS.length} idiomas)`);
lines.push(`- **Origen submitido**: ${SITE_URL}`);
lines.push(
  `- **Pre-flight keyLocation** (${keyLocation || "n/d"}): ` +
    (preflight.ok ? "**OK** — el host sirve la key esperada." : `**FALLO** — ${preflight.reason}`),
);
lines.push(
  `- **IndexNow** (server/indexnow.ts → submitIndexNowForUrls): ${inOk} OK, ${inFail} fallos HTTP, ${inSkip} omitidas` +
    (indexnowOut.key ? "" : " — INDEXNOW_KEY ausente en este entorno") +
    (preflight.ok ? "" : " — submissions saltadas por pre-flight"),
);
const googleStatusLabel = !googleOut.enabled
  ? "skipped (GOOGLE_INDEXING_API_ENABLE!=1)"
  : !googleOut.hasKey
    ? "skipped (GOOGLE_SERVICE_ACCOUNT_KEY ausente o invalida)"
    : goFail === 0
      ? "ok"
      : goOk === 0
        ? "failed"
        : "partial";
lines.push(
  `- **Google Indexing API** (server/google-indexing.ts → submitGoogleIndexingForUrls): ${goOk} OK, ${goFail} fallos HTTP, ${goSkip} omitidas — status=${googleStatusLabel}`,
);
lines.push("");
lines.push("### Resultado por URL (IndexNow + Google Indexing)");
lines.push("");
lines.push("| # | Idioma | Slug base | URL | IndexNow | Google Indexing | Timestamp | Detalle |");
lines.push("|---|---|---|---|---|---|---|---|");
function fmtHttp(ok: boolean | undefined, status: number | null | undefined): string {
  if (ok) return `**${status}** OK`;
  if (status != null) return `${status}`;
  return "—";
}
rows.forEach((r, i) => {
  const x = byUrl.get(r.url);
  const g = googleByUrl.get(r.url);
  const inHttp = fmtHttp(x?.ok, x?.status);
  const goHttp = fmtHttp(g?.ok, g?.status);
  const ts = x?.at ?? g?.at ?? NOW;
  const inErr = x?.error ? `IN: ${x.error}` : "";
  const goErr = g?.error ? `GO: ${g.error}` : "";
  const detailRaw = [inErr, goErr].filter(Boolean).join(" / ") || "—";
  const detail = detailRaw.replace(/\|/g, "/").replace(/\s+/g, " ");
  lines.push(`| ${i + 1} | ${r.lang} | ${r.base} | ${r.url} | ${inHttp} | ${goHttp} | ${ts} | ${detail} |`);
});
lines.push("");
lines.push("### Notas operativas");
lines.push("");
lines.push(
  "- IndexNow valida la propiedad del host descargando " +
    "`https://<host>/<INDEXNOW_KEY>.txt` antes de aceptar las URLs. Si el host " +
    "todavia no sirve ese fichero (deploy pendiente), responde HTTP 403 a cada " +
    "submission. `registerIndexNowRoutes` en `server/indexnow.ts` ahora autodescubre " +
    "cualquier `client/public/<key>.txt` y registra la ruta sin depender de " +
    "`INDEXNOW_KEY`, asi que tras el primer deploy `https://exentax.com/<KEY>.txt` " +
    "servira la key en text/plain. **Importante**: la *submission* (POST a " +
    "`api.indexnow.org`) sigue requiriendo `INDEXNOW_KEY` en el entorno desde el " +
    "que se ejecuta el script, aunque el servidor pueda servir la key sin esa " +
    "variable. Si no esta definida en el entorno del runner, el script omitira " +
    "el envio (`INDEXNOW_KEY ausente en este entorno`).",
);
lines.push(
  "- Google Indexing API es opt-in: requiere `GOOGLE_INDEXING_API_ENABLE=1` y " +
    "`GOOGLE_SERVICE_ACCOUNT_KEY` (ver cabecera de `server/google-indexing.ts`). " +
    "El script usa el helper `submitGoogleIndexingForUrls`, que envia las 36 URLs " +
    "explicitamente (sin pasar por el seeding de estado del ping post-deploy) y " +
    "devuelve un resultado HTTP por URL. Si las dos variables estan, las 36 filas " +
    "de la columna `Google Indexing` mostraran HTTP 200 reales; si falta el flag o " +
    "la clave, todas las filas saldran como `—` con el motivo en `Detalle`.",
);
lines.push(
  `- Reproducir tras el primer deploy: \`SITE_URL=https://exentax.com npx tsx scripts/republish-tier-a-fase1.mts\`.`,
);
lines.push("");

// ---------- 5. Anexar / sustituir el bloque ----------
if (!existsSync(LOG_PATH)) {
  console.error(`Log file not found: ${LOG_PATH}`);
  process.exit(1);
}
const original = readFileSync(LOG_PATH, "utf8");
const headerRx = /\n## 9\. Republicacion fase 1[\s\S]*$/;
const trimmed = original.replace(headerRx, "");
writeFileSync(LOG_PATH, trimmed.replace(/\s+$/, "") + "\n" + lines.join("\n"), "utf8");
console.log(`\nBloque anexado a ${LOG_PATH}`);
console.log(
  `Resumen: IndexNow ${inOk}/${rows.length} OK, Google Indexing ${goOk}/${rows.length} OK.`,
);
