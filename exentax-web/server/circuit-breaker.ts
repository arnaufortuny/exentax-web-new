import { logger } from "./logger";
import { setBreakerState } from "./metrics";

type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
  name: string;
}

const _registry = new Map<string, CircuitBreaker>();

export function getRegisteredBreakers(): Array<{ name: string; state: CircuitState; failures: number }> {
  return Array.from(_registry.values()).map(b => ({
    name: b.name,
    state: b.currentState,
    failures: b.failures,
  }));
}

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly opts: CircuitBreakerOptions;

  constructor(opts: CircuitBreakerOptions) {
    this.opts = opts;
    _registry.set(opts.name, this);
    setBreakerState(opts.name, "closed");
  }

  get name(): string { return this.opts.name; }
  get failures(): number { return this.failureCount; }

  get currentState(): CircuitState {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime >= this.opts.resetTimeoutMs) {
        this.state = "half-open";
        setBreakerState(this.opts.name, this.state);
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
    setBreakerState(this.opts.name, this.state);
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.opts.failureThreshold) {
      this.state = "open";
      logger.error(`${this.opts.name} → OPEN after ${this.failureCount} failures (cooldown ${this.opts.resetTimeoutMs / 1000}s)`, "circuit-breaker");
    }
    setBreakerState(this.opts.name, this.state);
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
