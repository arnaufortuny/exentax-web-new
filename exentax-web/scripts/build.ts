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
    [path.resolve(ROOT, "scripts/blog-content-lint.mjs")],
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
    [path.resolve(ROOT, "scripts/blog-content-lint.test.mjs")],
    { stdio: "inherit" },
  );
  if (lintTest.status !== 0) {
    throw new Error(
      `blog-content-lint.test failed with exit code ${lintTest.status}. ` +
        `The blog guard's own regexes regressed — fix them before deploying.`,
    );
  }

  console.log("building client...");
  await viteBuild({
    configFile: path.resolve(ROOT, "vite.config.ts"),
  });

  console.log("building server...");
  const pkg = JSON.parse(await readFile(path.resolve(WORKSPACE, "package.json"), "utf-8"));
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

  console.log("creating uploads directory...");
  await mkdir(path.resolve(WORKSPACE, "uploads/docs"), { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
