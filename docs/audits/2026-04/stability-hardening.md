# Stability & Performance Hardening — April 2026 (Task #13)

Scope: defensive hardening of error handling, observability, pagination,
N+1 risks, bundle/CLS, caching, DB timeouts, and Lighthouse-relevant
client perf. Out of scope (handled in their own tasks): SSR migration,
ORM swap, SEO refactor (#3), security headers (#7), and any new
features.

This document records what was already in place before this task, what
was added in this round, the alerting thresholds operators should wire
into Grafana / Discord, and a triage list of items deliberately left
for future tasks.

---

## 1. Already in place (verified, no changes)

| Concern | Location | Notes |
| --- | --- | --- |
| Global `uncaughtException` / `unhandledRejection` handlers | `server/index.ts` | Notify via `notifyCriticalError`, then `gracefulShutdown` |
| `errorId` propagated on every 5xx | `server/routes.ts:153-176` | UUID written to log line + JSON body so support can correlate; no `err.message` ever leaks to client |
| Liveness `GET /api/health` | `server/index.ts` | Never touches DB |
| Readiness `GET /api/health/ready` | `server/routes/observability.ts` | DB ping (2 s timeout), breaker state, email worker heartbeat |
| Postgres `statement_timeout` & `query_timeout` | `server/db.ts` | 30 s; pool capped at `DB_POOL_MAX` (default 10 dev / 25 prod) |
| Static asset cache headers | `server/static.ts` | `immutable, max-age=31536000` for hashed assets |
| Code-split routes + idle prefetch | `client/src/App.tsx` | `React.lazy` + `requestIdleCallback` warm-up |
| Lighthouse CI configs | `.lighthouserc.json`, `.lighthouserc.mobile.json` | Desktop + mobile presets with assertions |

---

## 2. Added in this round

### 2.1 Defensive caps on potentially unbounded reads

Three storage methods previously returned every matching row with no
cap. Today's row counts are tiny, so this was not yet a real
performance problem — but a single bad date-range bug (or a malicious
import) could pull megabytes through the pool and pin a connection
past `statement_timeout`. We now clamp at the storage boundary:

| Method | Cap | Behaviour at cap |
| --- | --- | --- |
| `getFutureAgenda()` | 5 000 | `WARN` log, returns truncated set; reminder sweep continues |
| `getAllBlockedDays()` | 2 000 | `WARN` log, returns truncated set |
| `listAgendasFiltered()` | default 200 / max 1 000 | already clamped pre-task; documented now |

The warn lines (`db` channel) are designed to be the first signal that
real pagination is needed before correctness suffers.

### 2.2 Server-side pagination contract on the public list endpoint

The only public HTTP endpoint that returns an array
(`GET /api/bookings/blocked-days`) now accepts an optional
`?limit=&offset=` pair, validated with Zod. `limit` is clamped between
1 and `BLOCKED_DAYS_MAX_LIMIT = 1000`; anything outside that range
returns **HTTP 400** through the standard `apiValidationFail` helper
rather than silent truncation. Response shape is now
`{ data: string[], total: number }` so callers can paginate
deterministically.

All other admin list operations (newsletters, leads, agenda admin,
SEO rankings) are exposed only through Discord slash commands
(`server/discord-bot-commands.ts`), which already pass explicit
`limit`s of 50–200 to `listAgendasFiltered` etc. — there is no public
HTTP surface to harden for them.

### 2.3 Slow-query observability

`server/db.ts` now wraps `pool.query` (in the isolated
`wrapPoolQuery()` helper, so the casting surface lives in one place
and is easy to audit) to time every statement. When a query crosses
`DB_SLOW_QUERY_MS` (default **1 000 ms**) we increment a counter and
emit a single-line `WARN` containing the elapsed time and the first
160 chars of the SQL (whitespace collapsed). The wrapper:

* Never alters the result, never swallows errors, never throws.
* Costs one `Date.now()` and one `.then` per query (~ microseconds).
* Logs are structured through the existing `logger.warn(..., "db")`
  channel so they flow through the same Discord pipeline as other
  warnings.

### 2.4 DB pool exposed as Prometheus metrics

`getPoolStats()` is exported from `server/db.ts` and sampled lazily
inside `/api/metrics` exposition. New series:

| Metric | Type | Meaning |
| --- | --- | --- |
| `db_pool_connections_total` | gauge | `pool.totalCount` |
| `db_pool_connections_idle` | gauge | `pool.idleCount` |
| `db_pool_clients_waiting` | gauge | `pool.waitingCount` (queue depth) |
| `db_pool_max` | gauge | configured cap |
| `db_queries_total` | counter | every wrapped query |
| `db_slow_queries_total` | counter | queries ≥ `DB_SLOW_QUERY_MS` |

### 2.5 Per-route HTTP metrics + percentile gauges

`recordHttpRequest()` now accepts an optional `route` argument fed
from `req.route?.path` (template — *not* the resolved URL — so
cardinality is bounded by the route table, not by callers). When the
table grows beyond `PER_ROUTE_LIMIT = 200`, additional unseen routes
are aggregated into an `__other` bucket so a misbehaving caller can
never explode the metric.

New series:

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `http_route_requests_total` | counter | `method,route,status` (status class) | Per-route request volume |
| `http_route_request_duration_ms_count` | counter | `method,route` | Sample count for the per-route histogram |
| `http_route_request_duration_ms_sum` | counter | `method,route` | Sample sum (ms) |
| `http_route_request_duration_ms_quantile` | gauge | `method,route,quantile` | Linear-interpolated p50/p95/p99 from the bucketed histogram |
| `http_request_duration_ms_quantile` | gauge | `quantile` | Aggregate p50/p95/p99 |

Percentiles are computed at exposition time via
`percentileFromBuckets()`, which uses linear interpolation between
adjacent cumulative buckets. Above the top bucket (10 s) the value
saturates at 10 000 ms rather than reporting `+Inf`, so dashboards
stay numeric. Empty histograms emit no quantile series at all,
preventing misleading `0`s during cold-start.

### 2.6 Default `Cache-Control` policy by response class

Added in `server/index.ts` (mounted before `/api/health` so even the
liveness probe inherits it):

* **`/api/*`** — default `Cache-Control: no-store`. Routes that need
  a different policy (`/api/geo` → `private, max-age=600`; sitemaps
  → `public, max-age=3600`) call `res.setHeader("Cache-Control", …)`
  before sending and the wrapper detects the override via a
  `setHeader` shim, leaving them untouched.
* **HTML** — `no-cache, no-store, must-revalidate` in both production
  (`server/static.ts`) and development (`server/vite.ts`). Previously
  dev served HTML with no cache directive at all, which let some
  proxies cache stale responses during local debugging.
* **Hashed assets** — already `immutable, max-age=31536000`
  (unchanged).
* **Public images / manifest** — already `max-age=86400, must-revalidate`
  (unchanged).

### 2.7 React Query freshness presets

`client/src/lib/queryClient.ts` now exports three preset objects so
callers don't sprinkle magic `staleTime` values around the codebase:

| Preset | `staleTime` | `refetchOnWindowFocus` | Use for |
| --- | --- | --- | --- |
| `STATIC_QUERY_OPTS` | `Infinity` | `false` | Build-time content (legals, footer, blog metadata) |
| `REFERENCE_QUERY_OPTS` | `10 min` | `false` | Slow-moving server data (legal versions, country lists) |
| `LIVE_QUERY_OPTS` | `5 s` | `true` | Booking availability, agenda counts |

The default policy (30 s, refetch on focus) stays calibrated for
*changing* data so any new query gets safe defaults.

### 2.8 Eliminate Cumulative Layout Shift on `<img>` tags

Found four `<img>` elements in user-visible layout (calculator country
flags, footer logo, /go Trustpilot badge, blog post author avatar)
that had no intrinsic dimensions. Even when CSS pinned the rendered
size, the browser still reserved zero space until the byte payload
arrived, then pushed surrounding text down. Each got explicit
`width`/`height` (intrinsic, not display) and `decoding="async"`.

The flag PNGs themselves are already < 1.5 KB each; converting to
WebP or SVG would shave bytes that no user perceives, so we
deliberately left the source format alone — the CLS fix was the only
meaningful win here.

---

## 3. Recommended alerting thresholds

The metrics above are useful only if scrape rules fire on them.
Suggested rules when the dashboard is wired up:

| Rule | Trigger | Severity |
| --- | --- | --- |
| API latency drift | `http_route_request_duration_ms_quantile{route="/api/bookings/available-slots",quantile="0.95"} > 750` for 5 min | warn |
| API latency drift (booking) | `http_route_request_duration_ms_quantile{route="/api/bookings/book",quantile="0.95"} > 1500` for 5 min | high |
| Error spike per route | `increase(http_route_requests_total{status="5xx"}[5m]) > 5` | high |
| DB saturation | `db_pool_connections_total / db_pool_max > 0.8` for 5 min | warn |
| DB saturation | `db_pool_clients_waiting > 0` for 1 min | high |
| Slow-query rate | `rate(db_slow_queries_total[5m]) > 0.05/s` (i.e. > 15 / 5 min) | warn |
| Health regression | `/api/health/ready` returns 503 for 2 consecutive scrapes | high |
| Event loop | `nodejs_event_loop_lag_ms > 250` for 3 min | warn |
| Client errors | `rate(client_errors_total[10m]) > 1/min` | warn |
| Breaker | `circuit_breaker_state{name=...} == 1` (open) | high |

`alert_fallback_total` rising means the primary Discord webhook
failed and we delivered through the secondary path; surface it in the
weekly summary, no page.

---

## 4. N+1 review (no fixes needed)

Walked the highest-traffic public endpoints and checked for per-row
follow-up queries. None of the hot paths trigger N+1:

* `GET /api/bookings/available-slots` — single date-range select
  against `agenda` + single select against `blocked_days`; results
  merged in memory.
* `GET /api/bookings/blocked-days` — one select, paginated in memory.
* `POST /api/bookings/draft` — single upsert into `booking_drafts`,
  optional one-shot insert into `audit_log`.
* `POST /api/calculator-leads` — single insert plus a single dedup
  select.
* Blog reader (`client/src/pages/blog/post.tsx`) — content loaded via
  `import.meta.glob` (build-time bundle), not the DB.

The few worker paths that *do* loop over rows
(`runIncompleteBookingsSweep`, newsletter broadcast batches) already
batch with explicit `LIMIT` / `FOR UPDATE SKIP LOCKED`, so each
iteration is bounded and the surrounding rate (5 min sweep, 25-row
batch) keeps total query rate trivial.

---

## 5. Lighthouse status

Lighthouse CI configs (`.lighthouserc.json` desktop and
`.lighthouserc.mobile.json`) live at the repo root. The desktop run
asserts performance ≥ 0.9; the mobile run asserts performance ≥ 0.8
plus LCP ≤ 3.5 s, CLS ≤ 0.1, INP ≤ 200 ms. Run them after merge from a
deploy with consistent network conditions:

```
npx lhci autorun --config=.lighthouserc.json
npx lhci autorun --config=.lighthouserc.mobile.json
```

Expected scores after this round (based on changes shipped here):

* Performance: unchanged in raw bytes; CLS should drop to ~0 on the
  calculator and blog post pages because the previously-shifting
  `<img>` elements now reserve their box.
* Best Practices: unchanged.
* Accessibility: unchanged.
* SEO: out of scope for this task; tracked under #3.

---

## 6. Out of scope — explicitly deferred

| Item | Why deferred | Suggested home |
| --- | --- | --- |
| SSR / streaming | Requires routing rework; large blast radius | Future task |
| Replace flag PNGs with SVG sprite | Negligible byte savings (< 6 KB total) | Skip unless redesign |
| Real cursor pagination on `agenda` | Today's volume doesn't justify it; hard caps + warn cover the failure mode | Re-evaluate when warn fires |
| Admin HTTP list endpoints | Not exposed today (Discord slash only) | Add when admin UI is built |
| Bundle splitting beyond route-level | Already idle-prefetched; no measured win | Re-evaluate after Lighthouse |
