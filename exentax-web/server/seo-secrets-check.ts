/*
 * seo-secrets-check.ts
 * ----------------------------------------------------------------------------
 * Boot-time validation for the four secrets that drive every automatic SEO
 * indexing ping:
 *
 *   - INDEXNOW_KEY               → IndexNow (Bing/Yandex/Seznam) per-article
 *                                  + sitemap-level pings (server/indexnow.ts).
 *   - GOOGLE_SERVICE_ACCOUNT_KEY → Google Search Console sitemap submission
 *                                  (server/google-search-console.ts) AND the
 *                                  per-article Google Indexing API submission
 *                                  (server/google-indexing.ts).
 *   - GOOGLE_SC_SITE_URL         → Search Console property identifier; without
 *                                  it the GSC client cannot pick a property.
 *   - GOOGLE_INDEXING_API_ENABLE → Opt-in switch for the per-article Indexing
 *                                  API submission. The submitter is a strict
 *                                  no-op when this is not "1".
 *
 * Each of those modules already degrades gracefully ("ok: false, skipped"),
 * which means a misconfigured production deploy looks healthy in logs but
 * silently submits zero URLs to search engines. This module fails loudly on
 * two distinct failure modes:
 *
 *   1. MISSING — env var unset / blank / wrong toggle value.
 *   2. INVALID FORMAT — env var set but in a shape that IndexNow / Search
 *      Console / Google Indexing API will reject (the same foot-gun the
 *      Discord-side `FORMAT_CHECKS` in `server/index.ts` guards against:
 *      copy-paste whitespace, truncated JSON, wrong URL prefix, etc.).
 *
 * For each failure mode we emit:
 *   - In production: a single `[seo] missing secret(s): X, Y` (or
 *     `[seo] invalid secret(s): X, Y`) warning line per boot AND one
 *     `notifySeoIndexing` event so operators see the gap in
 *     #exentax-errores immediately, without spam (dedupKey is stable per
 *     process so retries are coalesced by the Discord layer).
 *   - In development: a `debug` line only — no Discord, no warning,
 *     no noise during local development where these secrets are normally
 *     intentionally absent or placeholder.
 *
 * Pure-function design (`findMissingSeoSecrets`, `findInvalidSeoSecrets`,
 * `checkSeoSecretsAtBoot`) with explicit env / logger / notifier injection
 * so it is unit-testable without monkey-patching `process.env` or
 * `discord.ts`. See `seo-secrets-check.test.ts` for the prod + missing +
 * invalid-format coverage.
 * ----------------------------------------------------------------------------
 */

export interface SeoSecretSpec {
  /** Environment-variable name as seen at runtime. */
  name: string;
  /** Human-readable explanation surfaced in the warning + Discord embed. */
  hint: string;
  /**
   * Predicate deciding whether the value is "present". By default a
   * non-empty trimmed string counts as present, which matches how each of
   * the four downstream modules already gates itself.
   */
  isPresent?: (value: string | undefined) => boolean;
  /**
   * Optional format validator invoked **only if `isPresent` returned true**.
   * Returns `null` when the value passes; returns a short reason string
   * (no secret name prefix — the caller adds it) when the value is
   * present but malformed. Each spec mirrors the exact contract of the
   * downstream module so a "valid here" value is also accepted there.
   */
  validateFormat?: (value: string) => string | null;
}

const defaultPresent = (v: string | undefined): boolean =>
  typeof v === "string" && v.trim().length > 0;

/**
 * INDEXNOW_KEY format: 8–128 chars of `[a-zA-Z0-9-]`, no surrounding
 * whitespace. Mirrors the regex enforced by `server/indexnow.ts::getKey`,
 * which silently rejects any other shape.
 */
function validateIndexNowKey(v: string): string | null {
  if (v !== v.trim()) {
    return "has surrounding whitespace — strip it from the secret value";
  }
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(v)) {
    return "must be 8–128 characters of [a-zA-Z0-9-] (IndexNow rejects anything else)";
  }
  return null;
}

/**
 * GOOGLE_SC_SITE_URL accepts the two property identifiers that Search
 * Console itself accepts:
 *   - URL property:    `https://exentax.com/` (must end with `/`)
 *   - Domain property: `sc-domain:exentax.com`
 * Anything else (http://, missing trailing slash, plain hostname, etc.)
 * is rejected by `webmasters.sitemaps.submit` with a 4xx and silently
 * degrades the sitemap submission.
 */
function validateGoogleScSiteUrl(v: string): string | null {
  if (v !== v.trim()) {
    return "has surrounding whitespace — strip it from the secret value";
  }
  if (v.startsWith("sc-domain:")) {
    const domain = v.slice("sc-domain:".length);
    if (domain.length === 0) {
      return "uses the sc-domain: prefix with no domain after it";
    }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      return "sc-domain: value must be a bare hostname (e.g. sc-domain:exentax.com)";
    }
    return null;
  }
  if (v.startsWith("https://")) {
    if (!v.endsWith("/")) {
      return "https:// URL must end with a trailing slash (e.g. https://exentax.com/)";
    }
    try {
      // Catches malformed URLs that still happen to start with "https://".
      // eslint-disable-next-line no-new
      new URL(v);
    } catch {
      return "is not a parseable URL";
    }
    return null;
  }
  return (
    "must be either an https:// URL with a trailing slash " +
    "(e.g. https://exentax.com/) or sc-domain:<domain> " +
    "(e.g. sc-domain:exentax.com)"
  );
}

/**
 * GOOGLE_SERVICE_ACCOUNT_KEY must parse as JSON and expose a `client_email`
 * field — that is the bare minimum that `google-credentials.ts` and the
 * downstream `google.auth.JWT` builders need. We deliberately do **not**
 * validate `private_key` so test/dev keys without it can still load.
 */
function validateGoogleServiceAccountKey(v: string): string | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(v);
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    return `is not valid JSON (${m})`;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return "JSON did not parse to an object";
  }
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.client_email !== "string" || obj.client_email.trim().length === 0) {
    return "JSON is missing a non-empty 'client_email' field";
  }
  return null;
}

/**
 * Authoritative list of SEO-indexing secrets. Order is preserved in the
 * warning line and Discord field so operators always read them the same way.
 */
export const SEO_SECRET_SPECS: readonly SeoSecretSpec[] = [
  {
    name: "INDEXNOW_KEY",
    hint: "IndexNow key (8-128 chars, [a-zA-Z0-9-]) shared with /<key>.txt; without it IndexNow pings are skipped",
    validateFormat: validateIndexNowKey,
  },
  {
    name: "GOOGLE_SERVICE_ACCOUNT_KEY",
    hint: "JSON service-account credentials; required for Search Console sitemap submission and Google Indexing API",
    validateFormat: validateGoogleServiceAccountKey,
  },
  {
    name: "GOOGLE_SC_SITE_URL",
    hint: "Search Console property identifier (e.g. https://exentax.com/ or sc-domain:exentax.com)",
    validateFormat: validateGoogleScSiteUrl,
  },
  {
    name: "GOOGLE_INDEXING_API_ENABLE",
    hint: "Opt-in switch; must be exactly '1' for per-article submissions to fire",
    // The Google Indexing submitter treats anything other than the literal
    // string "1" as "disabled", so mirror that exact contract here. The
    // presence check already enforces "1" exactly, so no further format
    // validation is needed.
    isPresent: (v) => v === "1",
  },
] as const;

/**
 * Returns the SEO secrets that are missing in the given environment, in the
 * declared order. Pure function — no side effects, no I/O.
 */
export function findMissingSeoSecrets(
  env: Record<string, string | undefined> = process.env,
  specs: readonly SeoSecretSpec[] = SEO_SECRET_SPECS,
): SeoSecretSpec[] {
  return specs.filter((s) => !(s.isPresent ?? defaultPresent)(env[s.name]));
}

export interface SeoSecretInvalidity {
  spec: SeoSecretSpec;
  reason: string;
}

/**
 * Returns the SEO secrets that ARE present (per their `isPresent`) but whose
 * value fails the spec's `validateFormat` check. Pure function — no side
 * effects, no I/O. Specs without a `validateFormat` are skipped.
 */
export function findInvalidSeoSecrets(
  env: Record<string, string | undefined> = process.env,
  specs: readonly SeoSecretSpec[] = SEO_SECRET_SPECS,
): SeoSecretInvalidity[] {
  const out: SeoSecretInvalidity[] = [];
  for (const s of specs) {
    if (!s.validateFormat) continue;
    const raw = env[s.name];
    const present = (s.isPresent ?? defaultPresent)(raw);
    if (!present) continue; // missing is reported separately
    const reason = s.validateFormat(raw as string);
    if (reason) out.push({ spec: s, reason });
  }
  return out;
}

export interface SeoSecretsCheckLogger {
  warn: (message: string, source?: string) => void;
  debug: (message: string, source?: string) => void;
}

export interface SeoSecretsCheckNotifier {
  (opts: {
    source: string;
    status: "ok" | "skipped" | "failed";
    title: string;
    summary?: string | null;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    dedupKey?: string | null;
  }): void;
}

export interface SeoSecretsCheckOptions {
  /** Snapshot of environment to inspect. Defaults to `process.env`. */
  env?: Record<string, string | undefined>;
  /** Whether the process is running in production. */
  isProd: boolean;
  /** Logger interface. Defaults pulled from `./logger` if omitted. */
  logger?: SeoSecretsCheckLogger;
  /**
   * Discord notifier. In production a single notification is emitted per
   * failure mode (missing and/or invalid) when at least one secret is
   * affected; in development this is never invoked.
   */
  notify?: SeoSecretsCheckNotifier;
}

export interface SeoSecretsCheckResult {
  /** Names of secrets that are absent / blank / wrong toggle value. */
  missing: string[];
  /** Names + per-secret reason for present-but-malformed secrets. */
  invalid: Array<{ name: string; reason: string }>;
  /**
   * True when at least one Discord notification was fired (either the
   * missing-secrets event or the invalid-secrets event).
   */
  notified: boolean;
}

/**
 * Boot hook. Run exactly once during startup, after the Discord queue worker
 * is initialized so the notification can be enqueued cleanly.
 *
 *   - dev / test: silent unless secrets are missing or malformed, then a
 *     single `debug` line per failure mode. Never touches Discord.
 *   - prod: emits a single `[seo] missing secret(s): X, Y` warning AND/OR a
 *     single `[seo] invalid secret(s): X, Y` warning, plus one
 *     `notifySeoIndexing` event per failure mode (so missing and invalid
 *     can fire independently). Each event has a stable, mode-specific
 *     dedupKey so a re-invocation in the same Discord dedup window is
 *     coalesced.
 */
export function checkSeoSecretsAtBoot(
  opts: SeoSecretsCheckOptions,
): SeoSecretsCheckResult {
  const env = opts.env ?? process.env;
  const log = opts.logger;
  const missingSpecs = findMissingSeoSecrets(env);
  const missing = missingSpecs.map((s) => s.name);
  const invalidEntries = findInvalidSeoSecrets(env);
  const invalid = invalidEntries.map((i) => ({
    name: i.spec.name,
    reason: i.reason,
  }));

  if (missing.length === 0 && invalid.length === 0) {
    log?.debug?.("[seo] all indexing secrets present", "seo");
    return { missing: [], invalid: [], notified: false };
  }

  let notified = false;

  // ── Missing secrets ────────────────────────────────────────────────────
  if (missing.length > 0) {
    if (!opts.isProd) {
      log?.debug?.(
        `[seo] missing secret(s): ${missing.join(", ")} (dev — not notifying Discord)`,
        "seo",
      );
    } else {
      log?.warn?.(`[seo] missing secret(s): ${missing.join(", ")}`, "seo");
      if (opts.notify) {
        const fields = missingSpecs.map((s) => ({
          name: s.name,
          value: s.hint,
          inline: false,
        }));
        opts.notify({
          source: "seo-secrets-check",
          status: "skipped",
          title: "[AVISO] Secretos de indexacion SEO ausentes",
          summary:
            "El proceso ha arrancado sin uno o mas secretos de indexacion SEO. " +
            "Los pings a IndexNow, Google Search Console y Google Indexing API " +
            "se degradaran silenciosamente (ok=false, skipped) hasta que se " +
            "configuren. Revisa la configuracion del deploy.",
          fields,
          // Stable dedup key so accidental double-invocation in the same
          // process (or process restart inside the 5-minute Discord dedup
          // window) does not spam the channel. The list of missing
          // secrets is part of the key so a partial fix that leaves a
          // different set still notifies.
          dedupKey: `seo-secrets-check:missing:${missing.join(",")}`,
        });
        notified = true;
      }
    }
  }

  // ── Invalid format ─────────────────────────────────────────────────────
  if (invalid.length > 0) {
    const names = invalid.map((i) => i.name);
    if (!opts.isProd) {
      log?.debug?.(
        `[seo] invalid secret(s): ${names.join(", ")} (dev — not notifying Discord)`,
        "seo",
      );
    } else {
      log?.warn?.(`[seo] invalid secret(s): ${names.join(", ")}`, "seo");
      if (opts.notify) {
        const fields = invalid.map((i) => ({
          name: i.name,
          value: i.reason,
          inline: false,
        }));
        opts.notify({
          source: "seo-secrets-check",
          status: "skipped",
          title: "[AVISO] Secretos de indexacion SEO con formato invalido",
          summary:
            "Uno o mas secretos de indexacion SEO estan configurados pero con " +
            "un formato que IndexNow / Search Console / Google Indexing API " +
            "rechazan. Los pings se degradaran silenciosamente hasta que se " +
            "corrija el valor. Revisa el motivo concreto por secreto.",
          fields,
          // Mode-specific stable dedup key so the missing-secrets event
          // and the invalid-secrets event can coexist in the channel
          // without being coalesced into one another.
          dedupKey: `seo-secrets-check:invalid:${names.join(",")}`,
        });
        notified = true;
      }
    }
  }

  return { missing, invalid, notified };
}
