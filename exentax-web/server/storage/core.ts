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

