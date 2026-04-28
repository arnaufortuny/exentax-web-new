/**
 * Tiny PNG / JPEG header parser shared by the SEO image validators.
 *
 * Lifted out of `scripts/seo/validate-social-previews.mjs` (introduced in
 * task #23 to lock the og:image geometry) so the icon / favicon validator
 * (task #27) can reuse the exact same intrinsic-dimension reader without
 * pulling an image library into CI. The validators run on every push, so
 * staying a zero-dependency pure-Node helper is a hard requirement.
 *
 * Returned shape:
 *   { format: "png" | "jpg", width: number, height: number, size: number }
 *   { format?: "jpg", error: string, size?: number }
 */
import { readFileSync } from "node:fs";

export function readImageInfo(file) {
  let buf;
  try {
    buf = readFileSync(file);
  } catch (err) {
    return { error: `cannot read file (${err.code || err.message})` };
  }
  const size = buf.length;
  // PNG: 8-byte signature, then IHDR chunk at offset 8 (4 bytes length, 4
  // bytes type "IHDR", 4 bytes width BE, 4 bytes height BE).
  if (
    size >= 24 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a &&
    buf.toString("ascii", 12, 16) === "IHDR"
  ) {
    return { format: "png", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), size };
  }
  // JPEG: SOI (FF D8), then a stream of markers. Walk until we hit any SOF
  // marker (FFC0–FFC3, FFC5–FFC7, FFC9–FFCB, FFCD–FFCF) and read the frame
  // header (precision byte, height BE, width BE).
  if (size >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < size) {
      if (buf[i] !== 0xff) return { format: "jpg", error: "malformed JPEG (expected marker)", size };
      while (i < size && buf[i] === 0xff) i++;
      if (i >= size) break;
      const marker = buf[i++];
      // Standalone markers carry no payload.
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) continue;
      if (marker >= 0xd0 && marker <= 0xd7) continue;
      if (i + 2 > size) break;
      const segLen = buf.readUInt16BE(i);
      const isSOF =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isSOF) {
        if (i + 7 > size) return { format: "jpg", error: "truncated SOF segment", size };
        return { format: "jpg", height: buf.readUInt16BE(i + 3), width: buf.readUInt16BE(i + 5), size };
      }
      i += segLen;
    }
    return { format: "jpg", error: "no SOF marker found", size };
  }
  return { error: "unrecognised image format (expected PNG or JPEG header)", size };
}
