// `isUniqueViolation` is intentionally not re-exported — callers should use
// the more specific `isSlotUniqueViolation` for slot-race detection.
export { generateId, normalizeEmail, StorageError, NotFoundError, ValidationError, SlotConflictError } from "./core";
export * from "./scheduling";
export * from "./marketing";
export * from "./legal";
