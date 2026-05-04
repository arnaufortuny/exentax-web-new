const COOKIE_NAME = "exentax_lang";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function writeLangCookie(lang: string): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(lang)}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export function readLangCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)exentax_lang=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
