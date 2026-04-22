#!/usr/bin/env node
/*
 * orphan-detect.test.mjs
 * ----------------------------------------------------------------------------
 * Unit tests for scripts/lib/orphan-detect.mjs (Task #39).
 *
 * Each fixture feeds a synthetic source string to isComponentReferenced and
 * verifies whether the heuristic correctly recognises the file as imported.
 * The "MUST match" cases enumerate every import pattern the audit needs to
 * understand to avoid false positives in the dead-code report; the
 * "MUST NOT match" cases protect against substring/word-boundary regressions.
 *
 * Exits 0 on success and 1 on any mismatch so CI can fail fast.
 * ----------------------------------------------------------------------------
 */

import { isComponentReferenced } from "./lib/orphan-detect.mjs";

const FIXTURES = [
  // ---------------- MUST match ---------------------------------------------
  { name: "static relative import",
    component: "Foo",
    source: `import Foo from "./Foo";`,
    expect: true },
  { name: "static relative import with .tsx ext",
    component: "Foo",
    source: `import Foo from "./Foo.tsx";`,
    expect: true },
  { name: "dynamic import (React.lazy)",
    component: "CalculatorResults",
    source: `const X = lazy(() => import("./CalculatorResults"));`,
    expect: true },
  { name: "dynamic import with @/ alias",
    component: "EmailGateForm",
    source: `const Y = lazy(() => import("@/components/calculator/EmailGateForm"));`,
    expect: true },
  { name: "static import with @/ alias",
    component: "Calculator",
    source: `import Calculator from "@/components/calculator";\nimport Helper from "@/components/calculator/Calculator";`,
    expect: true },
  { name: "static import with @shared alias",
    component: "schema",
    source: `import { x } from "@shared/schema";`,
    expect: true },
  { name: "re-export default from",
    component: "Bar",
    source: `export { default } from "./Bar";`,
    expect: true },
  { name: "re-export star from with extension",
    component: "Bar",
    source: `export * from "./Bar.ts";`,
    expect: true },
  { name: "re-export named from with alias",
    component: "Widget",
    source: `export { Widget } from "@/components/widgets/Widget";`,
    expect: true },
  { name: "CommonJS require relative",
    component: "Legacy",
    source: `const Legacy = require("./Legacy");`,
    expect: true },
  { name: "CommonJS require with alias and extension",
    component: "Legacy",
    source: `const L = require("@/components/Legacy.jsx");`,
    expect: true },
  { name: "side-effect import",
    component: "register",
    source: `import "./register";`,
    expect: true },
  { name: "import with .jsx extension",
    component: "Foo",
    source: `import Foo from "./Foo.jsx";`,
    expect: true },
  { name: "multi-line static import",
    component: "Foo",
    source: `import {\n  a,\n  b,\n} from "./Foo";`,
    expect: true },

  // ---------------- MUST NOT match (substring / word-boundary guards) ------
  { name: "different component sharing suffix",
    component: "Foo",
    source: `import BarFoo from "./BarFoo";`,
    expect: false },
  { name: "name appears only in identifier, not module path",
    component: "Foo",
    source: `const Foo = 1; export { Foo };`,
    expect: false },
  { name: "name appears in a non-import string literal",
    component: "Foo",
    source: `const label = "Foo component";`,
    expect: false },
  { name: "no reference at all",
    component: "Orphan",
    source: `import X from "./Y";\nexport const z = 1;`,
    expect: false },
];

let failures = 0;
for (const f of FIXTURES) {
  const got = isComponentReferenced(f.component, f.source);
  const ok = got === f.expect;
  const tag = ok ? "PASS" : "FAIL";
  console.log(`${tag}  ${f.name}  (expected=${f.expect}, got=${got})`);
  if (!ok) failures++;
}

console.log(`\n${FIXTURES.length - failures}/${FIXTURES.length} tests passed`);
if (failures > 0) {
  console.error(`✗ ${failures} orphan-detect test(s) failed`);
  process.exit(1);
}
console.log("✓ all orphan-detect tests passed");
