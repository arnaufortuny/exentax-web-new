import crypto from "crypto";
import { logger } from "../logger";
import { nowMadrid } from "../server-constants";

export function generateId(prefix = "EX"): string {
  const now = nowMadrid();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hex = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `${prefix}-${y}${m}${d}-${hex}`;
}

export class StorageError extends Error {
  public readonly operation: string;
  public readonly cause: unknown;
  constructor(operation: string, cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    super(`Storage error [${operation}]: ${message}`);
    this.name = "StorageError";
    this.operation = operation;
    this.cause = cause;
  }
}

export class NotFoundError extends StorageError {
  constructor(operation: string, entity: string) {
    super(operation, new Error(`${entity} not found`));
    this.name = "NotFoundError";
  }
}

export class ValidationError extends StorageError {
  constructor(operation: string, detail: string) {
    super(operation, new Error(detail));
    this.name = "ValidationError";
  }
}

export class SlotConflictError extends StorageError {
  constructor(operation: string, cause: unknown) {
    super(operation, cause);
    this.name = "SlotConflictError";
  }
}

export const SLOT_UNIQUE_INDEX_NAME = "agenda_active_slot_uniq_idx";

type PgErrorShape = { code?: string; constraint?: string; cause?: PgErrorShape };

function extractPgError(err: unknown): PgErrorShape | null {
  if (!err || typeof err !== "object") return null;
  const e = err as PgErrorShape;
  if (e.code === "23505") return e;
  if (e.cause && typeof e.cause === "object") {
    const inner = extractPgError(e.cause);
    if (inner) return inner;
  }
  return null;
}

export function isUniqueViolation(err: unknown): boolean {
  return extractPgError(err) !== null;
}

/**
 * Returns true only for the slot uniqueness conflict, not any other unique
 * constraint (e.g. PK collisions). Lets callers map ONLY genuine slot races
 * to SLOT_TAKEN and surface other 23505s as generic storage errors.
 */
export function isSlotUniqueViolation(err: unknown): boolean {
  const pg = extractPgError(err);
  if (!pg) return false;
  // If constraint name is missing for any reason, fall back to true so we
  // don't silently lose the slot-race signal.
  if (!pg.constraint) return true;
  return pg.constraint === SLOT_UNIQUE_INDEX_NAME;
}

export function normalizeEmail(email: string): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

export function wrapStorageError(operation: string, err: unknown): never {
  if (err instanceof StorageError) throw err;
  const message = err instanceof Error ? err.message : String(err);
  logger.error(`Storage error [${operation}]: ${message}`, "storage", err);
  throw new StorageError(operation, err);
}

