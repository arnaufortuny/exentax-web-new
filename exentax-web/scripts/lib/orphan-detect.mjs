/*
 * orphan-detect.mjs
 * ----------------------------------------------------------------------------
 * Heuristic used by the system audit (audit-system-seo-faqs.mjs) to decide
 * whether a component file under client/src/components is referenced from
 * anywhere else in client/src. Returning `true` from `isComponentReferenced`
 * means we found at least one importer and the file should NOT be flagged as
 * dead code.
 *
 * Patterns recognised (per Task #39):
 *   - Static imports:       `import X from "./Foo"`, `import X from "@/components/calculator/Foo"`
 *   - Dynamic imports:      `import("./Foo")`, `import("@/components/calculator/Foo")`
 *   - Re-exports:           `export { default } from "./Foo"`, `export * from "@/components/Foo"`
 *   - CommonJS requires:    `require("./Foo")`, `require("@/components/Foo")`
 *   - With or without file extension (.tsx / .ts / .jsx / .js / .mjs / .cjs)
 *   - Aliased paths:        `@/...`, `@shared/...`, `@assets/...`, etc.
 *
 * The detector intentionally errs on the side of caution: any quoted module
 * specifier whose final path segment matches the component basename is
 * treated as a reference. False positives here only mean we keep a file
 * around; false negatives would let us delete code in active use, which is
 * what Task #39 exists to prevent.
 * ----------------------------------------------------------------------------
 */

const EXT_GROUP = "(?:\\.(?:tsx?|jsx?|mjs|cjs))?";

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a regex that matches any import-like reference to a module whose
 * final path segment equals `name` (with or without a JS/TS extension).
 *
 * The path can be relative (`./`, `../`), bare (`Foo`), or aliased
 * (`@/components/...`, `@shared/...`). The leading char before `name` must
 * be a `/` or the start of the string literal so `Foo` does not match
 * `BarFoo`.
 */
export function buildImportRegex(name) {
  const n = escapeRegex(name);
  // Module specifier: optional path segments + (start | "/") + name + optional ext.
  const spec = `["'](?:[^"'\\n]*\\/)?${n}${EXT_GROUP}["']`;
  const patterns = [
    // `import ... from "..."` and `export ... from "..."` (any whitespace
    // between the keyword and `from`, including multi-line named-import
    // blocks). We anchor on `from` + module specifier because that pair is
    // effectively unique to ES module syntax.
    `\\bfrom\\s+${spec}`,
    // Side-effect import:  import "..."
    `\\bimport\\s+${spec}`,
    // Dynamic import:  import("...")
    `\\bimport\\s*\\(\\s*${spec}\\s*[,)]`,
    // CommonJS:  require("...")
    `\\brequire\\s*\\(\\s*${spec}\\s*\\)`,
  ];
  return new RegExp(patterns.join("|"));
}

/**
 * Return true if `source` contains any import-like reference to `name`.
 */
export function isComponentReferenced(name, source) {
  return buildImportRegex(name).test(source);
}
