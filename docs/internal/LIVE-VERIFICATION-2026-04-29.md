> **Type**: live snapshot · F-1 → F-9 of [`PRODUCTION-CHECKLIST.md §F`](../../PRODUCTION-CHECKLIST.md#f-smoke-tests-post-deploy-en-orden)
> **Captured (UTC)**: 2026-04-29T11:03Z
> **Targets probed**: `https://exentax.com` (intended prod) · `http://localhost:5000` (sandbox build)
> **Runner**: [`scripts/live-verification.sh`](../../scripts/live-verification.sh)
> **Task**: #48 — *Validar que la versión publicada funciona en el servidor real con los 9 chequeos finales*

# LIVE-VERIFICATION 2026-04-29 — Snapshot pre-go-live

## TL;DR

| Target | Result | Interpretation |
|---|---|---|
| `https://exentax.com` (intended prod domain) | **PASS=1 · FAIL=9 · SKIP=16** | Backend **NO desplegado** todavía. El dominio sirve un mirror estático en Google Frontend (no la app Express). |
| `http://localhost:5000` (sandbox build, this repo) | **PASS=10 · FAIL=0** (subset automatable sin polución de rate-limit) | Código **listo**: health/ready, CSRF, sitemap-index con 672 posts, 6 idiomas, robots.txt completo. |

> **Veredicto**: el go-live está bloqueado por **trabajo operativo** (provisión Hostinger VPS + carga de secrets + deploy + Nginx/Certbot), **no por código**. El runner que se entrega en este snapshot deja la verificación F-1→F-9 reducida a un único comando una vez ese trabajo operativo se complete.

---

## 1. Por qué `https://exentax.com` da 9 FAILs hoy

Evidencia capturada:

```text
$ getent hosts exentax.com         → 34.111.179.208     # Google Cloud range, no Hostinger
$ curl -I https://exentax.com/     → server: Google Frontend
                                     strict-transport-security: max-age=63072000; includeSubDomains
                                     (sin CSP, sin X-Frame-Options, sin Referrer-Policy)
$ curl -s -o /dev/null -w '%{http_code}' https://exentax.com/api/health
                                   → 404
$ curl -s https://exentax.com/sitemap.xml | head -3
                                   → <urlset ...>     # urlset suelto, no sitemapindex
$ curl -s https://exentax.com/sitemap-blog.xml | grep -c '<loc>'
                                   → 0                # sitemap-blog ni siquiera existe
```

Esto significa que **el dominio está sirviendo un snapshot estático antiguo** (probablemente un export Vite estático en GCS), **no el backend Express + Postgres + Discord + Calendar** que la revisión integral 10-LOTES preparó. La batería F-1 a F-9 está diseñada para validar la app Express en producción, así que falla por la razón estructural correcta.

### F-1..F-3 · qué falla y por qué

| Check | Resultado live | Causa raíz |
|---|---|---|
| `GET /api/health` | 404 | No hay backend Express escuchando |
| `GET /api/health/ready` | 404 | Idem |
| Security headers (`/`) | HSTS=✓ · CSP=✗ · X-Frame-Options=✗ · Referrer-Policy=✗ | Static mirror servido por Google Frontend; los middlewares Helmet de `server/security.ts` no aplican |
| `GET /sitemap.xml` | `urlset` (no `sitemapindex`) | Stub estático antiguo; el handler `server/routes/public.ts` no se está ejecutando |
| `GET /sitemap-blog.xml` | 200 con 0 entries | Idem |
| `GET /robots.txt` | falta `sitemap-pages`, `sitemap-blog`, `Disallow: /api`, `GPTBot` | Robots viejo, no el generado por SSR |
| Hreflang en `/` | Sólo 2 alternates encontrados | El head SSR sólo se renderiza con backend vivo |
| `POST /api/calculator-leads` sin Origin | 404 (esperado 403) | Endpoint inexistente en el static mirror |
| Rate-limit `/api/health` | nunca 429 | Idem |

### F-8 · qué pasa (parcial)

`GET /es /en /fr /de /pt /ca` → todos `200`. Esto es lo único que el static mirror sí cubre, y por accidente resulta en un PASS engañoso para F-8: el HTML servido **no proviene** del SSR de la app, así que no hay garantía de paridad con el contenido editorial actualizado por LOTES 1-9.

---

## 2. Sandbox `http://localhost:5000` — el código está listo

Probe directo contra el workflow `Start application` (build actual de la rama):

```text
/api/health                   → 200  body: {"status":"ok","uptime":29}
/api/health/ready             → 200  body: {"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,"message":"last drain 20s ago"}}}
POST /api/calculator-leads    → 403  (CSRF activo, sin Origin válido)
/sitemap.xml                  → 200  <sitemapindex> con 3 sub-sitemaps (pages/blog/faq)
/sitemap-blog.xml             → 200  672 <loc> (= 112 slugs × 6 idiomas, exacto)
robots.txt                    → declara Allow: /sitemap-pages|blog|faq.xml + Disallow: /api/ /internal/ /private/ /booking/ /start /go/
/es /en /fr /de /pt /ca       → 200 / 200 / 200 / 200 / 200 / 200
```

Todos los chequeos automatables que dependen del backend pasan. **No hay nada que arreglar a nivel código** para que F-1, F-2, F-3 (CSRF) y F-8 estén verdes en cuanto se haga el deploy real al VPS con los secrets.

---

## 3. Runner entregado: `scripts/live-verification.sh`

Reduce los ~30 curls + comandos manuales del checklist F a un solo invocación:

```bash
# Una vez la VPS está viva y los secrets cargados:
bash scripts/live-verification.sh https://exentax.com \
  --metrics-token "$METRICS_TOKEN" \
  --indexnow-key "$INDEXNOW_KEY" \
  --report docs/internal/live-verification-$(date +%F).md
```

Salida: tabla por sección F-1..F-9 con `PASS`/`FAIL`/`SKIP` + reporte markdown opcional. Exit `0` si no hay FAIL, `1` en caso contrario, `2` si hay error de uso. Diseñado para ejecutarse desde cualquier sitio (laptop, CI, la propia VPS).

Cobertura del runner:

| Sección | Cobertura automatizable | Cobertura SKIP (require fuera-de-curl) |
|---|---|---|
| F-1 Health | health, health/ready, security headers | — |
| F-2 SEO | sitemap-index, sitemap-blog count, robots, hreflang | IndexNow key file (necesita el key) |
| F-3 Seguridad | CSRF (POST sin Origin → 403), rate-limit (220 reqs → 429) | Field encryption (necesita psql al DB del VPS) |
| F-4 E2E | — | Cuatro `npm run test:*` (necesita DB + service accounts) |
| F-5 Discord | — | Bot online + slash-commands + 5 canales (todo Discord runtime) |
| F-6 Calendar/Meet/Email | — | Reserva real → evento Calendar + email DKIM |
| F-7 Métricas | `/api/metrics?token=` Prometheus format | UptimeRobot dashboard manual |
| F-8 Frontend smoke | 6 rutas idioma → 200 | Responsive 375/768/1280, calculadora submit |
| F-9 Lighthouse | — | `lhci autorun` × 6 idiomas (interactivo, ~10 min) |

Cada SKIP imprime el comando exacto o paso manual que la persona que opera el deploy tiene que ejecutar — no quedan dudas.

---

## 4. Reporte máquina-legible (auto-generado)

[`docs/internal/live-verification-exentax-2026-04-29.md`](./live-verification-exentax-2026-04-29.md) — generado por el runner con la tabla completa de resultados live.

---

## 5. Bloqueadores operativos para que F-1..F-9 estén verdes

Estos pasos **no son cambios de código**; los hace el owner / ops, no el agente:

1. **Provisionar Hostinger VPS KVM 2** (Ubuntu 22.04, ≥ 4 GB RAM) — [`PRODUCTION-CHECKLIST.md §C`](../../PRODUCTION-CHECKLIST.md#c-provisión-del-vps-one-time).
2. **Apuntar DNS** `exentax.com` + `www.exentax.com` (registros A/AAAA) a la IP del VPS, retirando el actual mirror Google Frontend.
3. **Crear los recursos externos** (todo en [`PRODUCTION-CHECKLIST.md §A`](../../PRODUCTION-CHECKLIST.md#a-recursos-externos-a-tener-listos-antes-de-tocar-el-vps)):
   - Discord application + bot + 7 canales + rol admin.
   - Google Cloud project + Service Account (Calendar + Gmail + Indexing API).
   - UptimeRobot monitor `https://exentax.com/api/health`.
4. **Cargar `.env` en el VPS** con todas las variables [`§B.1`/`§B.2`/`§B.3`](../../PRODUCTION-CHECKLIST.md#b-variables-de-entorno-resumen) — incluyendo `FIELD_ENCRYPTION_KEY` (`openssl rand -hex 32`), `METRICS_TOKEN`, `INDEXNOW_KEY`, los 5 IDs Discord y los 5 channel IDs.
5. **Deploy inicial** [`§D`](../../PRODUCTION-CHECKLIST.md#d-deploy-inicial-primera-vez): `git clone` + `npm ci` + `npm run db:push` + `SKIP_BUILD_E2E=1 npm run build` + `pm2 start dist/index.cjs --name exentax`.
6. **Nginx reverse proxy** + **Certbot SSL** ([detalle en `exentax-web/docs/deploy/HOSTINGER-VPS.md`](../../exentax-web/docs/deploy/HOSTINGER-VPS.md)).
7. **Ejecutar el runner contra el dominio público**:
   ```bash
   bash scripts/live-verification.sh https://exentax.com \
     --metrics-token "$METRICS_TOKEN" --indexnow-key "$INDEXNOW_KEY" \
     --report docs/internal/live-verification-$(date +%F).md
   ```
8. **Completar los SKIP manuales** (F-4 E2E, F-5 Discord, F-6 Calendar/Meet, F-7 UptimeRobot, F-8 responsive, F-9 Lighthouse) y anotar resultados en el mismo reporte.

Cuando el runner imprima `PASS=N · FAIL=0` y los SKIP manuales estén verdes → marcar Task #48 como cerrado y crear tag `exentax-3.x.0` per [`PRODUCTION-CHECKLIST.md §K`](../../PRODUCTION-CHECKLIST.md#k-tras-pasar-todos-los-checks).

---

## 6. Por qué este snapshot no podía cerrar Task #48

Task #48 pide ejecutar F-1..F-9 contra el VPS real. La sandbox del agente:

- No tiene SSH al VPS de Hostinger (no provisionado todavía).
- No tiene credenciales de producción (Discord bot token, Service Account JSON, etc.).
- No puede modificar DNS para apuntar `exentax.com` a un nuevo IP.
- No puede crear cuentas externas (Discord Application, Google Cloud project, UptimeRobot).

Esto se reconoce explícitamente en [`PENDING-FINAL.md #1`](../../PENDING-FINAL.md): *"los pasos que faltan para deploy real son operativos en VPS, no de código"*. Lo único que se podía hacer dentro de la sandbox para mover Task #48 hacia adelante era:

- **(hecho)** Construir el runner que automatiza F-1..F-9 → `scripts/live-verification.sh`.
- **(hecho)** Capturar el snapshot live de `https://exentax.com` para documentar el punto de partida exacto → reporte adjunto.
- **(hecho)** Probar el código contra `localhost:5000` para confirmar que el código está listo → §2 arriba.
- **(hecho)** Listar los 8 pasos operativos que destrabarán los 9 checks → §5 arriba.

Task #48 queda **a la espera** del trabajo operativo (§5) — no a la espera de cambios de código.
