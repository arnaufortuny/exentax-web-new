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
 * silently submits zero URLs to search engines. This module fails loudly:
 *
 *   - In production: emit a single `[seo] missing secret(s): X, Y` warning
 *     line per boot AND fire one `notifySeoIndexing` event so operators see
 *     the gap in #exentax-errores immediately, without spam (dedupKey is
 *     stable per process so retries are coalesced by the Discord layer).
 *   - In development: emit a `debug` line only — no Discord, no warning,
 *     no noise during local development where these secrets are normally
 *     intentionally absent.
 *
 * Pure-function design (`findMissingSeoSecrets`, `checkSeoSecretsAtBoot`)
 * with explicit env / logger / notifier injection so it is unit-testable
 * without monkey-patching `process.env` or `discord.ts`. See
 * `seo-secrets-check.test.ts` for the prod + missing-secret test coverage.
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
}

const defaultPresent = (v: string | undefined): boolean =>
  typeof v === "string" && v.trim().length > 0;

/**
 * Authoritative list of SEO-indexing secrets. Order is preserved in the
 * warning line and Discord field so operators always read them the same way.
 */
export const SEO_SECRET_SPECS: readonly SeoSecretSpec[] = [
  {
    name: "INDEXNOW_KEY",
    hint: "IndexNow key (8-128 chars, [a-zA-Z0-9-]) shared with /<key>.txt; without it IndexNow pings are skipped",
  },
  {
    name: "GOOGLE_SERVICE_ACCOUNT_KEY",
    hint: "JSON service-account credentials; required for Search Console sitemap submission and Google Indexing API",
  },
  {
    name: "GOOGLE_SC_SITE_URL",
    hint: "Search Console property identifier (e.g. https://exentax.com/ or sc-domain:exentax.com)",
  },
  {
    name: "GOOGLE_INDEXING_API_ENABLE",
    hint: "Opt-in switch; must be exactly '1' for per-article submissions to fire",
    // The Google Indexing submitter treats anything other than the literal
    // string "1" as "disabled", so mirror that exact contract here.
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
   * Discord notifier. In production a single notification is emitted when at
   * least one secret is missing; in development this is never invoked.
   */
  notify?: SeoSecretsCheckNotifier;
}

export interface SeoSecretsCheckResult {
  missing: string[];
  notified: boolean;
}

/**
 * Boot hook. Run exactly once during startup, after the Discord queue worker
 * is initialized so the notification can be enqueued cleanly.
 *
 *   - dev / test: silent unless secrets are missing, then a single `debug`
 *     line. Never touches Discord.
 *   - prod: emits a single `[seo] missing secret(s): X, Y` warning AND a
 *     single `notifySeoIndexing` event with status="skipped" carrying the
 *     full list. The dedupKey is stable per process so a re-invocation
 *     (e.g. by the test harness) is coalesced by the existing Discord
 *     dedup window.
 */
export function checkSeoSecretsAtBoot(
  opts: SeoSecretsCheckOptions,
): SeoSecretsCheckResult {
  const env = opts.env ?? process.env;
  const log = opts.logger;
  const missingSpecs = findMissingSeoSecrets(env);
  const missing = missingSpecs.map((s) => s.name);

  if (missing.length === 0) {
    log?.debug?.("[seo] all indexing secrets present", "seo");
    return { missing: [], notified: false };
  }

  if (!opts.isProd) {
    // Local/dev: keep the line at debug so it never adds noise to the boot
    // banner unless LOG_LEVEL=debug is explicitly set.
    log?.debug?.(
      `[seo] missing secret(s): ${missing.join(", ")} (dev — not notifying Discord)`,
      "seo",
    );
    return { missing, notified: false };
  }

  // Production path — loud log AND a single Discord notification.
  log?.warn?.(`[seo] missing secret(s): ${missing.join(", ")}`, "seo");

  let notified = false;
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
      // Stable dedup key so accidental double-invocation in the same process
      // (or process restart inside the 5-minute Discord dedup window) does
      // not spam the channel. The list of missing secrets is part of the
      // key so a partial fix that leaves a different set still notifies.
      dedupKey: `seo-secrets-check:missing:${missing.join(",")}`,
    });
    notified = true;
  }

  return { missing, notified };
}
