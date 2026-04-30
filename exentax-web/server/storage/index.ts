// `isUniqueViolation` is intentionally not re-exported — callers should use
// the more specific `isSlotUniqueViolation` for slot-race detection or
// `isLeadEmailUniqueViolation` (Task #28) for the partial UNIQUE on
// `leads.email`. Both helpers walk the StorageError -> pg error cause
// chain so they work whether the throw originated in storage code (wrapped)
// or directly in a route handler doing inline tx writes.
export { generateId, normalizeEmail, StorageError, NotFoundError, ValidationError, SlotConflictError, isLeadEmailUniqueViolation } from "./core";
export * from "./scheduling";
export * from "./marketing";
export * from "./legal";
