#!/usr/bin/env node
/**
 * Validates that every shipped favicon / app icon has the exact pixel size
 * its filename and PWA manifest declare. Companion to
 * `validate-social-previews.mjs` (task #23, og:image geometry guard) — same
 * idea, different asset family.
 *
 * Why this exists (task #27): the favicons and PWA icons under
 * `client/public/` (`favicon-16x16.png`, `favicon-32x32.png`,
 * `favicon-48x48.png`, `apple-touch-icon.png`, `icon-192.png`,
 * `icon-512.png`) are easy to swap by mistake — a designer drops a 256x256
 * PNG over `icon-192.png` and nothing visibly fails until users see a
 * blurry browser tab or a stretched home-screen icon. CI never noticed
 * because no validator was reading the PNG headers.
 *
 * Two checks run, both fatal (exit 1):
 *
 *   1. Filename geometry: every file in EXPECTED_ICONS must exist and its
 *      intrinsic PNG width/height must match the size encoded in the name
 *      (or the explicit override below). 16x16, 32x32, 48x48, 180x180,
 *      192x192, 512x512.
 *
 *   2. Manifest cross-check: each entry under `icons[]` in
 *      `client/public/site.webmanifest` must (a) point at a file that
 *      exists in `client/public/` (after stripping any `?v=…` cache
 *      buster), (b) declare a single WxH `sizes` attribute, and (c) have
 *      that declared size match the file's intrinsic dimensions.
 *
 * Zero-dependency on purpose: this script runs in CI on every push, so it
 * shares the PNG/JPEG header parser with `validate-social-previews.mjs`
 * via `./lib/image-header.mjs` instead of pulling in an image library.
 *
 * Run with: node scripts/seo/validate-icon-assets.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readImageInfo } from "./lib/image-header.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");
const PUBLIC_DIR = join(REPO, "client", "public");
const MANIFEST_FILE = join(PUBLIC_DIR, "site.webmanifest");

// Filename → expected intrinsic dimensions. The numeric pair in each
// filename is the contract; the explicit table below makes the contract
// machine-checkable and lets us cover `apple-touch-icon.png` (which has no
// numbers in its name but is fixed at 180x180 by the iOS spec).
const EXPECTED_ICONS = [
  { file: "favicon-16x16.png", width: 16, height: 16 },
  { file: "favicon-32x32.png", width: 32, height: 32 },
  { file: "favicon-48x48.png", width: 48, height: 48 },
  { file: "apple-touch-icon.png", width: 180, height: 180 },
  { file: "icon-192.png", width: 192, height: 192 },
  { file: "icon-512.png", width: 512, height: 512 },
];

const errors = [];

// --- 1. Filename-declared geometry ---------------------------------------
for (const { file, width, height } of EXPECTED_ICONS) {
  const full = join(PUBLIC_DIR, file);
  if (!existsSync(full)) {
    errors.push(`Icon asset missing at client/public/${file}`);
    continue;
  }
  const info = readImageInfo(full);
  if (info.error) {
    errors.push(`client/public/${file}: ${info.error}`);
    continue;
  }
  if (info.format !== "png") {
    errors.push(`client/public/${file}: expected PNG, got ${info.format}`);
    continue;
  }
  if (info.width !== width || info.height !== height) {
    errors.push(
      `client/public/${file}: ${info.width}x${info.height} != declared ${width}x${height} ` +
        "(filename / spec lies about intrinsic size — browsers and PWAs will render blurry)",
    );
  }
}

// --- 2. site.webmanifest cross-check -------------------------------------
let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_FILE, "utf8"));
} catch (err) {
  errors.push(`Cannot read or parse ${MANIFEST_FILE}: ${err.message}`);
  manifest = null;
}

if (manifest) {
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  if (icons.length === 0) {
    errors.push("site.webmanifest has no icons[] entries");
  }
  // Track which on-disk icons are referenced so a future commit can't
  // silently drop the manifest entry for a shipped icon.
  const referenced = new Set();
  for (const entry of icons) {
    const src = typeof entry.src === "string" ? entry.src : "";
    const sizes = typeof entry.sizes === "string" ? entry.sizes : "";
    if (!src) {
      errors.push(`site.webmanifest icon entry missing "src" (entry: ${JSON.stringify(entry)})`);
      continue;
    }
    if (!sizes) {
      errors.push(`site.webmanifest icon ${src} missing "sizes" attribute`);
      continue;
    }
    // Manifest icons declare a single WxH (e.g. "192x192"). The spec
    // allows space-separated multi-size entries, but the project ships
    // one PNG per size so we lock that down — a multi-size attribute
    // here would mask a swapped asset.
    const m = sizes.trim().match(/^(\d+)x(\d+)$/);
    if (!m) {
      errors.push(
        `site.webmanifest icon ${src}: sizes="${sizes}" must be a single WxH pair (e.g. "192x192")`,
      );
      continue;
    }
    const declaredW = Number(m[1]);
    const declaredH = Number(m[2]);
    // Strip leading slash and the `?v=…` cache buster before resolving.
    const relPath = src.replace(/^\//, "").split("?")[0];
    const localFile = join(PUBLIC_DIR, relPath);
    if (!existsSync(localFile)) {
      errors.push(`site.webmanifest icon ${src} -> client/public/${relPath} does not exist`);
      continue;
    }
    referenced.add(relPath);
    const info = readImageInfo(localFile);
    if (info.error) {
      errors.push(`site.webmanifest icon ${src}: ${info.error}`);
      continue;
    }
    if (info.format !== "png" || entry.type !== "image/png") {
      errors.push(
        `site.webmanifest icon ${src}: expected PNG with type="image/png" ` +
          `(file format=${info.format}, manifest type=${entry.type ?? "<missing>"})`,
      );
    }
    if (info.width !== declaredW || info.height !== declaredH) {
      errors.push(
        `site.webmanifest icon ${src}: file is ${info.width}x${info.height} ` +
          `but manifest declares sizes="${sizes}" (PWA installs will render the wrong size)`,
      );
    }
  }
  // Every icon we expect on disk must also be referenced by the manifest.
  // Otherwise a designer who renamed `icon-192.png` to `icon-192-v2.png`
  // and forgot to update the manifest would only notice when a user tried
  // to install the PWA.
  for (const { file } of EXPECTED_ICONS) {
    if (!referenced.has(file)) {
      // apple-touch-icon is referenced via <link> in index.html as well,
      // but we still expect it in the manifest to keep one source of
      // truth for icon geometry.
      errors.push(`site.webmanifest is missing an icons[] entry for client/public/${file}`);
    }
  }
}

// --- 3. Report -----------------------------------------------------------
console.log(
  `Icon asset checks: ${EXPECTED_ICONS.length} declared, ` +
    `${manifest?.icons?.length ?? 0} manifest entries.`,
);
console.log(`Result: ${errors.length === 0 ? "PASS" : "FAIL"} (${errors.length} error(s))`);
if (errors.length) {
  for (const e of errors) console.error("ERR:", e);
  process.exit(1);
}
process.exit(0);
