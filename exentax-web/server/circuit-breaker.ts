import { logger } from "./logger";

type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
  name: string;
}

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly opts: CircuitBreakerOptions;

  constructor(opts: CircuitBreakerOptions) {
    this.opts = opts;
  }

  get currentState(): CircuitState {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime >= this.opts.resetTimeoutMs) {
        this.state = "half-open";
      }
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    const state = this.currentState;

    if (state === "open") {
      logger.warn(`${this.opts.name} is OPEN — skipping call`, "circuit-breaker");
      if (fallback) return fallback();
      throw new Error(`Circuit breaker ${this.opts.name} is open`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error(`${this.opts.name} call failed (state: ${this.state}, failures: ${this.failureCount}/${this.opts.failureThreshold}): ${errMsg}`, "circuit-breaker");
      if (this.state === "open" && fallback) {
        return fallback();
      }
      throw err;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === "half-open") {
      this.state = "closed";
      logger.info(`${this.opts.name} recovered → CLOSED`, "circuit-breaker");
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.opts.failureThreshold) {
      this.state = "open";
      logger.error(`${this.opts.name} → OPEN after ${this.failureCount} failures (cooldown ${this.opts.resetTimeoutMs / 1000}s)`, "circuit-breaker");
    }
  }

}

export const googleCalendarBreaker = new CircuitBreaker({
  name: "google-calendar",
  failureThreshold: 3,
  resetTimeoutMs: 60_000,
});

export const emailBreaker = new CircuitBreaker({
  name: "email",
  failureThreshold: 5,
  resetTimeoutMs: 60_000,
});
