export function isTransient(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  const code = (err as unknown as { code?: unknown }).code;
  const status = (err as unknown as { status?: unknown }).status;
  return code === 429 || code === 500 || code === 503 || code === 408 ||
    status === 429 || status === 500 || status === 503 || status === 408 ||
    code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ECONNREFUSED" || code === "EPIPE" ||
    msg.includes("econnreset") || msg.includes("socket hang up") ||
    msg.includes("etimedout") || msg.includes("econnrefused") || msg.includes("epipe") ||
    msg.includes("timeout") || msg.includes("getaddrinfo") ||
    msg.includes("network") || msg.includes("ehostunreach") ||
    msg.includes("enotfound") || msg.includes("fetch failed");
}

export function isAuthError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const code = (err as unknown as { code?: unknown }).code;
  return code === 401 || code === 403 ||
    err.message.includes("invalid_grant") ||
    err.message.includes("Token has been expired") ||
    err.message.includes("token has been revoked");
}

