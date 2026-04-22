/**
 * Correlation ID propagation.
 *
 * Every inbound request gets an `x-correlation-id` (echoed back on the
 * response). The id is also stashed in an `AsyncLocalStorage` context so
 * any log line emitted while handling the request — even from deeply nested
 * helpers, queue workers, or `await`-suspended code — can be tagged with it
 * without manual propagation.
 *
 * The id is taken from the inbound `X-Correlation-Id` / `X-Request-Id`
 * header when present (so an upstream proxy can stitch traces together)
 * and otherwise generated locally.
 */
import type { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

export interface RequestContext {
  correlationId: string;
  method?: string;
  path?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

const ID_RE = /^[a-zA-Z0-9_-]{6,128}$/;

function pickInboundId(req: Request): string | null {
  const headers = ["x-correlation-id", "x-request-id"];
  for (const h of headers) {
    const v = req.headers[h];
    if (typeof v === "string" && ID_RE.test(v)) return v;
    if (Array.isArray(v) && v[0] && ID_RE.test(v[0])) return v[0];
  }
  return null;
}

export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = pickInboundId(req) ?? randomUUID();
  res.setHeader("X-Correlation-Id", correlationId);
  // Expose on the request object as well so handlers can read it directly
  // without relying on AsyncLocalStorage (useful for sync inspection).
  (req as Request & { correlationId?: string }).correlationId = correlationId;
  storage.run({ correlationId, method: req.method, path: req.path }, () => next());
}

export function getCurrentContext(): RequestContext | undefined {
  return storage.getStore();
}

export function getCurrentCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

export function runWithContext<T>(ctx: RequestContext, fn: () => T): T {
  return storage.run(ctx, fn);
}
