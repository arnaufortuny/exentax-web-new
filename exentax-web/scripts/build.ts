import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, mkdir } from "fs/promises";
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
