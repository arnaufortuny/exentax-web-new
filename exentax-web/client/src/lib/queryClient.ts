import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Default request timeout. Without this, a flaky network / hanged server
// could keep React Query pending forever and the user sees a spinner that
// never resolves. 15s is well above p99 real latency for our endpoints
// (typical p99 is ~500ms for booking and ~200ms for consent/visitor).
const DEFAULT_FETCH_TIMEOUT_MS = 15_000;

function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const signal = init.signal ? combineSignals(init.signal, controller.signal) : controller.signal;
  return fetch(input, { ...init, signal }).finally(() => clearTimeout(timer));
}

// Combine an external AbortSignal (e.g. React Query's own cancellation) with
// our timeout signal so either can abort the request.
function combineSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (a.aborted) return a;
  if (b.aborted) return b;
  const ctrl = new AbortController();
  const onAbort = (reason: unknown) => ctrl.abort(reason);
  a.addEventListener("abort", () => onAbort(a.reason), { once: true });
  b.addEventListener("abort", () => onAbort(b.reason), { once: true });
  return ctrl.signal;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetchWithTimeout(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === "Failed to fetch") return true;
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.startsWith("503:") || msg.startsWith("502:") || msg.startsWith("504:")) return true;
    if (msg.startsWith("429:")) return true;
    if (msg.includes("NetworkError") || msg.includes("network")) return true;
  }
  return false;
}

function retryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 8000);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    const res = await fetchWithTimeout(queryKey.join("/") as string, {
      credentials: "include",
      signal,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      // Default policy targets *changing* data (booking availability,
      // visitor metadata, etc). Truly static data should opt in to a
      // longer staleTime via the helpers below — never edit this default
      // upward to "fix" one query, or every other query inherits stale
      // reads silently.
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false;
        return isRetryableError(error);
      },
      retryDelay,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        return isRetryableError(error);
      },
      retryDelay,
    },
  },
});

// --- Per-query freshness presets ------------------------------------------------
//
// React Query's `staleTime` should match the data's actual mutation rate.
// These presets centralise the policy so callers don't sprinkle magic
// numbers across the app. Use them in `useQuery({ ...QUERY_OPTS_X, ... })`.
//
//   STATIC_QUERY_OPTS    — content that only changes on deploy (legals,
//                          footer config, blog metadata bundled at build
//                          time). Never re-fetched on focus; manual
//                          invalidation only.
//   REFERENCE_QUERY_OPTS — slow-moving server data (legal versions, country
//                          lists). 10-minute freshness window.
//   LIVE_QUERY_OPTS      — booking availability, agenda counts, anything
//                          that must reflect another user's action quickly.
//                          5-second freshness so a fresh booking shows up
//                          almost immediately.
export const STATIC_QUERY_OPTS = {
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false as const,
  refetchOnReconnect: false as const,
};
export const REFERENCE_QUERY_OPTS = {
  staleTime: 10 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false as const,
};
export const LIVE_QUERY_OPTS = {
  staleTime: 5_000,
  gcTime: 60_000,
  refetchOnWindowFocus: true as const,
};
