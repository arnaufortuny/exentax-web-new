/**
 * Type declaration for the auditor ESM script. Lives next to the .mjs so
 * TypeScript resolves it through `*.d.mts`. Keeping the script as plain
 * JS (run by node directly from CI / cron) is intentional; this file is
 * the only contract the server side reads from it.
 *
 * Shape mirrors the object returned by `runAudit()` at the bottom of the
 * .mjs (search for `return { summary, exitCode, reportPath }`). Keep in
 * sync if the .mjs is ever changed; the periodic-reports scheduler also
 * has a local copy of this interface and will fail tsc if drift appears.
 */
export interface RunAuditOptions {
  referenceYear?: number;
  write?: boolean;
  json?: boolean;
  log?: boolean;
}

export interface RunAuditSummary {
  slugs: number;
  hooks: number;
  injectedAndCurrent: number;
  dormantNativeLead: number;
  needsInjection: number;
  driftReal: number;
  heuristicCandidate: number;
  staleYearAnchors: number;
  snapshotEntries: number;
  snapshotConfirmed: number;
}

export interface RunAuditResult {
  summary: RunAuditSummary;
  exitCode: number;
  reportPath: string | null;
}

export function runAudit(opts?: RunAuditOptions): RunAuditResult;
