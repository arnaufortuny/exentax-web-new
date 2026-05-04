// crypto.randomUUID() polyfill — ships ONE small helper instead of the full
// `core-js` payload (which the dependency audit recommended NOT to add).
//
// `crypto.randomUUID` is available natively in:
//   • Chrome ≥92, Firefox ≥95, Edge ≥92, Node ≥14.17
//   • Safari ≥15.4 (March 2022) and iOS Safari ≥15.4
//
// The browserslist target in package.json (Safari ≥15.4 floor) means the
// native path covers >99% of real traffic. The fallback below exists so a
// stragglers visitor on Safari 15.0–15.3 still gets a session id instead
// of a runtime crash that would silently drop their analytics.
//
// The fallback is RFC 4122 v4 best-effort using Math.random — it is NOT
// cryptographically strong, but session ids are not security-sensitive.
export function randomUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 fallback. Browser support: universal back to IE9.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
