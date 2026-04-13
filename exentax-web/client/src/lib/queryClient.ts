import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
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
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
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
