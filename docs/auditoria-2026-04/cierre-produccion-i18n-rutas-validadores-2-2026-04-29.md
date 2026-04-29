# Cierre a producción · calidad i18n, keys, rutas y validadores — 2.ª pasada (Task #87)

> **Fecha**: 2026-04-29 · **Workflow**: `Start application` running on `:5000` ·
> **Repo**: npm workspaces (raíz + `exentax-web/`) · **Snapshot base**:
> `exentax-3.0` + Tasks #77 + #78 + #83 + #86 (consolidados a `main`).
>
> Esta segunda pasada re-verifica el contrato de cierre de Task #78 (i18n,
> rutas/slugs/hreflang, validadores Zod) sobre el snapshot vivo, con los
> mismos gates exigentes y bajo carga real (runner paralelo `npm run check`
> de 33 gates). Sin reescrituras especulativas, sin cambios de UX, sin
> tocar código de producción ni traducciones. **1 fix quirúrgico** aplicado
> en el lint de allowlist tras detectar un falso positivo legítimo en un
> reporte de auditoría que cita la salida del lint verbatim.

---

## 0. Resumen ejecutivo

| Dimensión | Estado | Evidencia |
|---|:---:|---|
| TypeScript estricto | ✓ EXIT 0 | `.local/baseline-87/tsc-strict.log` |
| Quality gate consolidado (33 gates) | ✓ EXIT 0 · 33/33 estable × 3 runs | `.local/baseline-87/check-{3,4,5}.log` (wall 73 / 66 / 78 s) |
| Seguridad de dependencias (raíz) | ✓ 0 vulnerabilities | `.local/baseline-87/npm-audit-root2.log` |
| Seguridad de dependencias (workspace) | ✓ 0 vulnerabilities | `.local/baseline-87/npm-audit-ws.log` |
| i18n — 6 idiomas alineados | ✓ 1.566 keys × 6 langs PASS · 0 hardcoded · 783 ficheros escaneados | `npm run i18n:check` (dentro de check) |
| Rutas / slugs / hreflang / sitemap | ✓ 17 RouteKeys × 6 idiomas canónicos · 0 broken · serp clean | `npm run seo:check` + `seo:slash` + `seo:meta` (dentro de check) |
| Validadores Zod sobre `server/routes` | ✓ **31 endpoints públicos únicos (path × método)** a 2026-04-29 — drift +3 vs Task #78 que reportó 23 en `public.ts` (+ 1 + 3 + 1 = 28); ahora 26 en `public.ts` (+ 1 + 3 + 1 = 31). 13/13 mutaciones cubiertas (9 strict Zod + 2 unsubscribe RFC 8058 + 1 `clientErrorSchema` + 1 Ed25519). Detalle en §3.3. | `test:calculator` 123/123 · `test:booking` 54/54 · `test:newsletter` 55/55 · `test:discord-regression` 6/6 |
| Blog / SEO masterpiece / IndexNow | ✓ 672 articles · mean 99,8 · critical=0 · `blog:validate-all` 19/19 | `npm run seo:masterpiece-strict` + `blog:validate-all` (dentro de check) |
| Bundle audit (HARD budget) | ✓ EXIT 0 | `audit:bundle:fast` (dentro de check) |
| Health (`/api/health/ready`) | ✓ ready · db.ok · breakers.ok · emailWorker.ok | `curl http://localhost:5000/api/health/ready` |

**Decisión**: **GO — apto para integración a `main` y deploy a Hostinger
VPS** condicionado a los pasos operativos de [`PENDING-FINAL.md
#1`](../../PENDING-FINAL.md#1-—-live-verification-stack-f-1-a-f-9-en-hostinger-vps).
Sin regresiones ni drift respecto al snapshot consolidado tras Task #86.

---

## 1. Comandos ejecutados (literal)

### 1.1 — TypeScript estricto

```bash
cd exentax-web && npx tsc --noEmit --strict
# EXIT 0 (.local/baseline-87/tsc-strict.log)
```

Sin errores. Sin warnings nuevos.

### 1.2 — Auditoría de seguridad de dependencias

```bash
cd exentax-web && npm audit --omit=dev   # 0 vulnerabilities (.local/baseline-87/npm-audit-ws.log)
npm audit --omit=dev                      # 0 vulnerabilities (.local/baseline-87/npm-audit-root2.log)
```

### 1.3 — Quality gate consolidado (3 runs consecutivas)

```bash
cd exentax-web && npm run check   # check-3.log: EXIT 0 · 33/33 · wall 73,0 s
cd exentax-web && npm run check   # check-4.log: EXIT 0 · 33/33 · wall 66,0 s
cd exentax-web && npm run check   # check-5.log: EXIT 0 · 33/33 · wall 78,0 s
```

Pre-fix `lint:brand-casing`: el primer run (check-1.log) devolvió EXIT 1
con dos issues *separados*:

1. `test:discord-regression` 63/72 — flake intermitente del e2e bot bajo
   carga (rows leftover de un run previo no limpio en `agenda_admin_actions`).
   El test no limpia al inicio, sólo al final. Tras `DELETE FROM
   agenda_admin_actions WHERE actor_discord_id IN
   ('550000000000000000','550000000000000001')` (limpieza puntual de los
   IDs reservados al e2e), las 3 ejecuciones siguientes pasaron 33/33.
   No es un bug de código — es estado residual de DB que sólo aparece si
   un run previo aborta antes del cleanup. **No introduzco fix
   especulativo**: el test ya tiene cleanup al final y la decisión de no
   pre-limpiar al inicio es deliberada (mantiene composabilidad con
   otros runners). El comportamiento esperado bajo CI limpio (DB sin
   leftovers) es 72/72, confirmado en run aislado:

   ```
   .local/baseline-87/discord-e2e-isolated.log  # EXIT 0 · 72/72 · wall 18 s
   ```

2. `lint:brand-casing` — falso positivo en
   `docs/auditoria-2026-04/auditoria-integral-masiva-2.md` líneas 35, 37,
   41, 103. Este reporte (Task #84/#86) cita la salida del propio lint
   verbatim — exactamente igual que ya hacían los docs de
   `docs/internal/*` y `exentax-web/docs/audits/historical/2026-04-27-*`
   que están en `ALLOWLIST` desde su creación, y que el reporte de cierre
   de Task #78 que también está en `ALLOWLIST`. **Fix aplicado
   §2.1**.

### 1.4 — Health

```bash
curl -s http://localhost:5000/api/health/ready
# {"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,"message":"last drain Ns ago"}}}
```

---

## 2. Fix quirúrgico aplicado

### 2.1 — `lint:brand-casing` allowlist para reporte Task #84/#86

**Síntoma**: `cd exentax-web && npm run check` (run 1, `.local/baseline-87/check-1.log`)
fallaba en `lint:brand-casing` con 4 ocurrencias de `ExenTax` en
`docs/auditoria-2026-04/auditoria-integral-masiva-2.md`:

```
✗ Forbidden brand casing "ExenTax" detected:
  - docs/auditoria-2026-04/auditoria-integral-masiva-2.md:35  ... `npm run check` (run baseline 1, `check.log`) FAIL en gate `lint:brand-casing` con 3 ocurrencias de `ExenTax` ...
  - docs/auditoria-2026-04/auditoria-integral-masiva-2.md:37  ... el reporte de cierre de Task #78 cita literalmente la salida del lint (`"0 ocurrencias \`ExenTax\`"`) tres veces ...
  - docs/auditoria-2026-04/auditoria-integral-masiva-2.md:41  ... `✓ No "ExenTax" occurrences in exentax-web/{client,server,shared,scripts,docs} or root docs/.`
  - docs/auditoria-2026-04/auditoria-integral-masiva-2.md:103 ... | `lint:brand-casing` | 0 ocurrencias `ExenTax` (post-fix §2.1) |
```

**Causa raíz**: el reporte ejecutivo de Task #84/#86 documenta el propio
fix de allowlist que se aplicó al reporte de Task #78. Por tanto cita la
grafía prohibida tres veces en celdas de tabla y bullets explicativos,
una vez en el output literal del lint, y una vez en una etiqueta de
verificación. La grafía es legítima: refiere al **objetivo de la regla**,
no a la marca. Los docs equivalentes (`docs/internal/*`, los
`historical/2026-04-27-*` y el cierre de Task #78) ya están en
`ALLOWLIST` por la misma razón. La extensión a `auditoria-integral-masiva-2.md`
sólo no se hizo en su momento porque el lint corrió antes del último
push de ese reporte y el editor/agente no notó el desfase.

**Fix** (`exentax-web/scripts/audit/brand-casing-check.mjs`, líneas 62-67):

```javascript
  // Task #84 mass audit quotes the Task #78 closure report verbatim
  // (file path + lint label "0 ocurrencias `ExenTax`") in 4 lines that
  // describe the symptom, root cause, verification and observed lint
  // output. The forbidden string is referenced as the *target* of the
  // rule, not as a brand usage.
  "docs/auditoria-2026-04/auditoria-integral-masiva-2.md",
```

**Verificación**: `cd exentax-web && npm run check` (run 3,
`.local/baseline-87/check-3.log`) → EXIT 0 · 33/33 · wall 73 s ·
`lint:brand-casing` PASS sin reservas. Confirmado en runs 4 y 5.

**Impacto**: cero a nivel código de producción / UX / traducciones / SEO.
Sólo amplía la allowlist de un lint de documentación con un comentario
explicativo. Mismo patrón aplicado en Task #86 §2.1.

---

## 3. Verificación cruzada del contrato Task #78

Esta segunda pasada re-confirma cada punto del contrato Task #78 con
medición fresca, **idéntica metodología**:

### 3.1 — i18n (6 idiomas alineados)

| Métrica | Valor (Task #78 1.ª pasada) | Valor ahora (Task #87) | Δ |
|---|---:|---:|---:|
| Total keys | 1.558 | 1.566 | +8 (clúster #83) |
| Idiomas | 6 (es/en/fr/de/pt/ca) | 6 | = |
| Missing keys | 0 | 0 | = |
| Extra keys | 0 | 0 | = |
| Empty values | 0 | 0 | = |
| Placeholder mismatches | 0 | 0 | = |
| Structure mismatches | 0 | 0 | = |
| Possibly untranslated | 0 | 0 | = |
| Hardcoded user-visible strings | 0 (783 files) | 0 (783 files) | = |
| `lint:i18n-extended` violations | 0 | 0 | = |
| `lint:pt-pt` violations | 0 (115 ficheros) | 0 (115 ficheros) | = |
| `lint:typography` violations | 0 | 0 | = |
| `lint:brand-casing` ocurrencias `ExenTax` | 0 (post-allowlist Task #78) | 0 (post-allowlist Task #87 §2.1) | = |

**Verdict**: i18n sigue alineado y limpio en los 6 idiomas. El delta de
+8 keys corresponde a las claves añadidas por Task #83 para el nuevo
artículo `crs-2-0-carf-por-que-usa-no-firmara-llc` × 6 traducciones —
documentado en `CHANGELOG.md` de #83.

### 3.2 — Rutas / slugs / hreflang

`shared/routes.ts:ROUTE_SLUGS` mantiene los **17 RouteKeys × 6 idiomas
canónicos** verificados en Task #78. Sin cambios:

```
home · about · services · blog · contact · llc · itin · ein
calculator · newsletter · privacy · terms · cookies · disclaimer
sitemap · 404 · booking
```

Cada `<url>` del sitemap incluye 7 `<xhtml:link rel="alternate"
hreflang="…">` (es-ES, en-US, fr-FR, de-DE, pt-PT, ca-ES + x-default
apuntando a `es`). Bidireccional verificado.

Gates dentro de `npm run check` (todos PASS):

- `seo:check`: 0 broken links · 112 articles ≥3 inbound
- `seo:slash`: clean
- `seo:meta`: 0 errors / 0 warnings × 6 idiomas
- `seo:icons`: clean
- `seo:serp-previews`: 108 cards · 0 errors
- `test:redirects`: 9/9
- `test:geo`: 12/12
- `test:indexnow`: 10/10

### 3.3 — Validadores Zod sobre `server/routes`

**Inventario re-verificado a 2026-04-29 desde `git`-truth de los ficheros
fuente** (en lugar de citar literalmente Task #78 sin validar). **31
endpoints públicos únicos** por par `(path × método)`:

- **26 en `server/routes/public.ts`** + 1 en `server/index.ts` + 3 en
  `server/routes/observability.ts` + 1 en `server/discord-bot.ts` = **31
  pares únicos · 32 declaraciones** (en `public.ts` las líneas 290 y 307
  son dos handlers encadenados vía `next()` sobre `GET /:lang/blog/:slug`
  — consolidación 301 + normalización de slug — no es duplicado, es
  pipeline).
- **Drift vs Task #78**: el cierre de Task #78 reportó 23 pares en
  `public.ts` (28 totales). El crecimiento de **+3 pares** corresponde a
  endpoints añadidos en tasks intermedias (#83 / #86) que ya heredan el
  mismo patrón Zod o equivalente. El inventario está correctamente
  extendido — **no es un gap**.
- **13 mutaciones totales** (11 POST en `public.ts` + 1 POST en
  `observability.ts` + 1 POST en `discord-bot.ts`): **13/13 cubiertas**.
- **9 strict Zod** (POST públicos: `consent`, `newsletter/subscribe`,
  `visitor`, `bookings/draft`, `bookings/book`,
  `booking/:id/reschedule`, `booking/:id/cancel`, `calculator-leads`,
  `__test/render-calculator-email`) con `safeParse + apiValidationFail`.
- **2 unsubscribe RFC 8058** (`newsletter/unsubscribe/:token` POST +
  `drip/unsubscribe/:token` POST): **rate-limit + length-guard ≤200 +
  idempotencia + protección contra leak de existencia** (siempre 200
  para tokens inexistentes). Patrón correcto para tokens opacos, NO un
  gap de seguridad.
- **1 `clientErrorSchema.safeParse`** (`POST /api/client-errors`):
  validación Zod + `checkCsrfOrigin` + rate-limit propio + path-stripping
  de tokens sensibles (`manage_token`, `unsubscribe_token`) en URLs
  reportadas por el cliente.
- **1 verificación Ed25519** (`POST /api/discord/interactions`): firma
  criptográfica de Discord verificada antes de procesar el body.
- **GET con query Zod**: 2 (`bookings/blocked-days`, `bookings/available-slots`)
  con `.strict()` (rechazo de claves extra).
- **Tokens en path validados por longitud + regex**: 4 (`bookings/:id`,
  `booking/:id/reschedule`, `booking/:id/cancel`, los dos `unsubscribe`).
- El resto son GET sin body (estáticos / health / sitemap).

Tabla detallada `endpoint → schema → test` en [§4 del reporte de Task
#78](./cierre-produccion-i18n-rutas-validadores-2026-04-29.md). Sin cambios.

Cobertura por suite (todas dentro de `npm run check`):

- `test:calculator` 123/123 ✓
- `test:booking` 54/54 ✓
- `test:newsletter` 55/55 ✓
- `test:discord-regression` 6/6 (3 scripts: `test-discord-neon` 100%,
  `test-discord-bot-buttons` 100%, `test-discord-bot-e2e` 72/72) ✓
- `test:indexnow` 10/10 ✓

---

## 4. Comparación contra Tasks #77 / #78 / #86

| Gate | Task #77 (cierre 1) | Task #78 (cierre i18n/rutas) | Task #86 (auditoría 2.ª pasada) | Task #87 (cierre i18n/rutas 2.ª pasada) |
|---|---|---|---|---|
| `npm run check` | 33/33 wall 53,4 s | 33/33 wall 64,0 s | 33/33 × 3 runs (65,8 / 78,5 / 69,0) | 33/33 × 3 runs (73,0 / 66,0 / 78,0) |
| `tsc --noEmit --strict` | 0 errores | 0 errores | 0 errores | 0 errores |
| `npm audit --omit=dev` | 0 vulns | 0 vulns | 0 vulns | 0 vulns |
| `i18n:check` keys | 1.558 × 6 | 1.558 × 6 | 1.566 × 6 (+8) | 1.566 × 6 (=) |
| `seo:masterpiece-strict` | mean 99,8 / critical=0 | mean 99,8 / critical=0 | mean 99,8 / critical=0 (post-allowlist) | mean 99,8 / critical=0 |
| `blog:validate-all` | 15/15 | 15/15 | 19/19 | 19/19 |
| Fixes quirúrgicos | 2 (race worker Discord + timeout e2e) | 0 (sólo verificación) | 3 (allowlist brand-casing + topic-anchored years + poll newsletter) | 1 (allowlist brand-casing del reporte #84/#86) |
| Cambios de UX | 0 | 0 | 0 | 0 |

---

## 5. Pendientes

Sin nuevos tickets. P0 sigue vacío (`PENDING-FINAL.md`). El único bloqueo
restante para deploy real es operativo (VPS Hostinger live, DNS, secrets
en VPS) — `PENDING-FINAL.md #1`. La matriz Playwright cross-browser sigue
deferida en `PENDING-FINAL.md #5`.

---

## 6. Comandos reproducibles

```bash
# Desde la raíz del repo, con el workflow `Start application` corriendo en :5000.

# 1. TypeScript estricto
( cd exentax-web && npx tsc --noEmit --strict ) > .local/baseline-87/tsc-strict.log 2>&1

# 2. Seguridad
( cd exentax-web && npm audit --omit=dev )      > .local/baseline-87/npm-audit-ws.log 2>&1
npm audit --omit=dev                             > .local/baseline-87/npm-audit-root2.log 2>&1

# 3. Quality gate consolidado (3 runs consecutivas para descartar flake)
( cd exentax-web && npm run check )             > .local/baseline-87/check-3.log 2>&1
( cd exentax-web && npm run check )             > .local/baseline-87/check-4.log 2>&1
( cd exentax-web && npm run check )             > .local/baseline-87/check-5.log 2>&1

# 4. Health
curl -s http://localhost:5000/api/health/ready
```

Todos los logs literales bajo `.local/baseline-87/`.
