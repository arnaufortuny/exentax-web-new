import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, mkdir } from "fs/promises";
import { spawnSync } from "child_process";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");

const allowlist = [
  "compression",
  "express",
  "express-rate-limit",
  "nodemailer",
  "ws",
  "zod",
];

async function buildAll() {
  const distDir = path.resolve(ROOT, "dist");
  await rm(distDir, { recursive: true, force: true });

  // Blog price-and-address guard (Task #21).
  // Runs before the client build so a forbidden price/address mention
  // blocks the deploy with visible output from the script itself.
  console.log("running blog price-and-address guard (lint:blog)...");
  const lint = spawnSync(
    process.execPath,
    [path.resolve(ROOT, "scripts/blog/blog-content-lint.mjs")],
    { stdio: "inherit" },
  );
  if (lint.status !== 0) {
    throw new Error(
      `blog-content-lint failed with exit code ${lint.status}. ` +
        `Fix the forbidden price/address mentions reported above before deploying.`,
    );
  }

  // Unit tests for the guard itself (Task #25). Runs fixtures through
  // blog-content-lint.mjs so a regression in its own regexes (allowlist
  // drift, locale keyword gaps) blocks the deploy before the client build.
  console.log("running blog guard unit tests (test:lint-blog)...");
  const lintTest = spawnSync(
    process.execPath,
    [path.resolve(ROOT, "scripts/blog/blog-content-lint.test.mjs")],
    { stdio: "inherit" },
  );
  if (lintTest.status !== 0) {
    throw new Error(
      `blog-content-lint.test failed with exit code ${lintTest.status}. ` +
        `The blog guard's own regexes regressed — fix them before deploying.`,
    );
  }

  // Unit tests for the orphan-detection heuristic used by the system audit
  // (Task #39). A regression here would let the dead-code report flag
  // components that are actually imported via aliases / re-exports / require
  // / dynamic import, which previously caused real false positives.
  console.log("running orphan-detect unit tests (test:orphan-detect)...");
  const orphanTest = spawnSync(
    process.execPath,
    [path.resolve(ROOT, "scripts/audit/orphan-detect.test.mjs")],
    { stdio: "inherit" },
  );
  if (orphanTest.status !== 0) {
    throw new Error(
      `orphan-detect.test failed with exit code ${orphanTest.status}. ` +
        `The audit's import-pattern regex regressed — fix it before deploying.`,
    );
  }

  // Editorial audit 2026-04 build-failing guards. These run before the
  // client build so a regression in SEO meta coverage, related-slug
  // integrity, or public-route 301 behavior blocks the deploy with the
  // failing script's own output.
  // Runtime audits during build. Only active scripts — archived Task #4
  // one-shot audits were removed to comply with the repo convention
  // "never reference an archived script from a runtime script" (see
  // replit.md "Repo conventions"). The artefacts they produced
  // (ctas-changelog.md, ctas-rewrite.md) are frozen in docs/audits/2026-04/.
  for (const [label, file] of [
    ["seo-meta-audit", "scripts/seo/seo-meta-audit.mjs"],
    ["seo-related-validate", "scripts/seo/seo-related-validate.mjs"],
  ] as const) {
    console.log(`running ${label}...`);
    const r = spawnSync(process.execPath, [path.resolve(ROOT, file)], { stdio: "inherit" });
    if (r.status !== 0) throw new Error(`${label} failed (exit ${r.status}). Fix before deploying.`);
  }
  console.log("running public-routes integration test (audit 2026-04)...");
  const publicRoutes = spawnSync(
    process.execPath,
    [path.resolve(WORKSPACE, "node_modules/.bin/tsx"), path.resolve(ROOT, "server/routes/public.test.ts")],
    { stdio: "inherit", cwd: WORKSPACE },
  );
  if (publicRoutes.status !== 0) {
    throw new Error(`public-routes integration test failed (exit ${publicRoutes.status}). Fix the editorial 301 / related-slug regression before deploying.`);
  }

  // E2E guards: en hostings (p. ej. Hostinger) la build se ejecuta sin DB.
  // Permitir saltar los e2e con SKIP_BUILD_E2E=1; en Replit/CI con DB seguir
  // ejecutándolos como antes. Si SKIP_BUILD_E2E no está, mantener el fail-fast.
  const skipE2E = process.env.SKIP_BUILD_E2E === "1";
  if (skipE2E) {
    console.log(
      "SKIP_BUILD_E2E=1 → omitiendo guards e2e (newsletter, booking). " +
        "Asegúrate de validar estos flujos en un entorno con DATABASE_URL antes de publicar.",
    );
  }

  if (!skipE2E) {
  // Newsletter end-to-end guard (Task #19).
  // Boots the server and exercises the full subscribe + RGPD consent +
  // multi-language unsubscribe flow against the real Postgres database.
  // No bypass: every deploy must run this guard. If DATABASE_URL is
  // missing, the build fails so the omission is impossible to ignore.
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "newsletter E2E guard cannot run because DATABASE_URL is not set. " +
        "Every deploy must validate the newsletter flow — set DATABASE_URL " +
        "in the build environment before retrying (or set SKIP_BUILD_E2E=1).",
    );
  }
  console.log("running newsletter end-to-end guard (test:newsletter)...");
  const newsletter = spawnSync(
    process.execPath,
    [
      path.resolve(WORKSPACE, "node_modules/.bin/tsx"),
      path.resolve(ROOT, "scripts/e2e/run-newsletter-e2e.ts"),
    ],
    { stdio: "inherit", cwd: WORKSPACE },
  );
  if (newsletter.status !== 0) {
    throw new Error(
      `newsletter E2E guard failed with exit code ${newsletter.status}. ` +
        `Fix the subscribe/unsubscribe regression reported above before deploying.`,
    );
  }

  // Booking end-to-end guard (Task #35).
  // Boots the server and exercises the full booking flow (book ->
  // manage -> reschedule -> cancel) against the real Postgres database.
  // Gmail and Google Calendar are stubbed via env-var clearing in the
  // wrapper so the test stays self-contained. Like the newsletter guard,
  // there is no bypass: every deploy must run this. DATABASE_URL is
  // already enforced above so we don't re-check it here.
  console.log("running booking end-to-end guard (test:booking)...");
  const booking = spawnSync(
    process.execPath,
    [
      path.resolve(WORKSPACE, "node_modules/.bin/tsx"),
      path.resolve(ROOT, "scripts/e2e/run-booking-e2e.ts"),
    ],
    { stdio: "inherit", cwd: WORKSPACE },
  );
  if (booking.status !== 0) {
    throw new Error(
      `booking E2E guard failed with exit code ${booking.status}. ` +
        `Fix the booking/reschedule/cancel regression reported above before deploying.`,
    );
  }
  } // end if (!skipE2E)

  console.log("building client...");
  await viteBuild({
    configFile: path.resolve(ROOT, "vite.config.ts"),
  });

  console.log("building server...");
  // Read deps from the workspace's own package.json (Task #48 dedup): the
  // root package.json no longer carries a dependencies block, so the
  // externals list must come from `exentax-web/package.json` where the
  // real dep list now lives.
  const pkg = JSON.parse(await readFile(path.resolve(ROOT, "package.json"), "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: [path.resolve(ROOT, "server/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: path.resolve(distDir, "index.mjs"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    sourcemap: true,
    external: externals,
    logLevel: "info",
    logOverride: {
      "require-resolve-not-external": "silent",
    },
    banner: {
      js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
    },
  });

  console.log("writing dist/index.cjs deploy shim...");
  const { writeFile } = await import("fs/promises");
  await writeFile(
    path.resolve(distDir, "index.cjs"),
    `"use strict";\nimport("./index.mjs").catch((err) => { console.error(err); process.exit(1); });\n`,
    "utf-8",
  );

  console.log("writing workspace-root dist/index.cjs deploy shim...");
  const rootDistDir = path.resolve(WORKSPACE, "dist");
  await mkdir(rootDistDir, { recursive: true });
  await writeFile(
    path.resolve(rootDistDir, "index.cjs"),
    `"use strict";\nrequire("../exentax-web/dist/index.cjs");\n`,
    "utf-8",
  );

  console.log("creating uploads directory...");
  await mkdir(path.resolve(WORKSPACE, "uploads/docs"), { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
