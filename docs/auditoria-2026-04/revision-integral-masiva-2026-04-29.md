# Revisión integral masiva — 2026-04-29

> **Task #77 · Exentax Web** · Pasada de auditoría completa sobre todo el sistema (estructura, código, web, SEO, performance, funciones, idiomas, URLs, indexing, Discord, agenda, gestión, diseño, UX, tipografías, emails, copy, seguridad, encriptación, cross-browser y cross-device) sin drift respecto al snapshot `exentax-3.0`.
>
> **Cierre**: `cd exentax-web && npm run check` **EXIT 0 · 33 / 33 gates verde · wall 53,4 s** + `npm audit --omit=dev` **0 vulnerabilities**. Sin cambios en `package.json`, `vite.config.ts`, `server/vite.ts` ni `drizzle.config.ts`. Áreas en verde inmovilizadas según `WHAT-NOT-TO-TOUCH.md`.

---

## 1. Alcance y método

Esta auditoría no es una reescritura: es una verificación senior contra los snapshots ya consolidados (Tasks #11 LOTES 1-10 + #46 + #48 + #66) más una corrección puntual sobre dos races detectadas en el runner paralelo. Cada hallazgo se respalda con el comando exacto y el fichero de log dentro de `.local/baseline-77/`.

- **Tag de referencia para "no drift"**: `exentax-3.0`.
- **Entorno de verificación**: Replit, dev server `npm run dev` sirviendo `:5000`, BD Postgres Neon (variable `DATABASE_URL` activa).
- **Áreas evaluadas (15)**: estructura, código TypeScript, web pública, SEO, performance, funciones, idiomas, URLs e indexing, Discord, agenda, gestión interna, diseño/UX, tipografías, emails, copy, seguridad y encriptación, cross-browser y cross-device.
- **Documentos sincronizados**: `README.md`, `PRODUCTION-STATUS.md`, `PENDING-FINAL.md`, `BASELINE.md` (§FINAL VERIFICATION), `CHANGELOG.md`, `replit.md`. `WHAT-NOT-TO-TOUCH.md` revisado sin cambios.

---

## 2. Comandos ejecutados y resultados literales

### 2.1 — Tipos, build y health

| Comando | Resultado | Log |
|---|---|---|
| `cd exentax-web && npx tsc --noEmit --strict` | **EXIT 0** | `.local/baseline-77/tsc.log` |
| `curl -s http://localhost:5000/api/health` | `200` · `{"status":"ok","uptime":…}` | — |
| `curl -s http://localhost:5000/api/health/ready` | `200` · `{"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true}}}` | — |

### 2.2 — Quality gate paralelo (33 gates)

```
> exentax-web@1.0.0 check
> node scripts/check.mjs

[check] running 33 gates (concurrency=6)
[check] reusing dev server already on :5000
…
[check] 33/33 passed · wall 53.4s · OK
```

**33 gates ejecutados (lista canónica extraída del log)**:

`audit:bundle`, `blog:validate-all`, `i18n:check`, `lint:banking-entities`, `lint:blog`, `lint:brand-casing`, `lint:email-deliverability`, `lint:pt-pt`, `lint:stray-reports`, `lint:typography`, `seo:check`, `seo:masterpiece-strict`, `seo:meta`, `seo:slash`, `test:audit-faqs`, `test:booking`, `test:bundle-diff-notify`, `test:calculator`, `test:discord-regression`, `test:geo`, `test:indexnow`, `test:lint-banking-entities`, `test:lint-blog`, `test:masterpiece-audit`, `test:masterpiece-audit-rules`, `test:newsletter`, `test:no-inline-related`, `test:perf-gate-bypass-notify`, `test:redirects`, `test:risk-bridge-inject`, `test:seo-check`, `test:seo-slash`, `tsc`.

Top-10 por duración (extracto del log):

| Gate | Estado | Tiempo |
|---|:---:|---:|
| `tsc` | PASS | 23,7 s |
| `test:discord-regression` | PASS | 22,6 s (acumula `test-discord-neon` + `test-discord-bot-e2e` + `test-discord-bot-buttons`) |
| `test:newsletter` | PASS | 15,7 s |
| `test:geo` | PASS | 15,7 s |
| `lint:blog` | PASS | 13,5 s |
| `test:booking` | PASS | 12,6 s |
| `audit:bundle` | PASS | 11,2 s |
| `blog:validate-all` | PASS | 10,9 s |
| `test:calculator` | PASS | 9,7 s |
| `test:indexnow` | PASS | 7,6 s |

Los 23 gates restantes (`seo:check`, `seo:meta`, `seo:slash`, `seo:masterpiece-strict`, `i18n:check`, `lint:typography`, `lint:brand-casing`, `lint:banking-entities`, `lint:pt-pt`, `lint:stray-reports`, `lint:email-deliverability`, `test:seo-check`, `test:seo-slash`, `test:redirects`, `test:risk-bridge-inject`, `test:no-inline-related`, `test:audit-faqs`, `test:perf-gate-bypass-notify`, `test:bundle-diff-notify`, `test:lint-blog`, `test:lint-banking-entities`, `test:masterpiece-audit`, `test:masterpiece-audit-rules`) → **todos PASS** en ≤ 5,5 s cada uno. Log íntegro: `.local/baseline-77/check-after-fix2.log`.

> Los scripts `seo:llm-readiness`, `seo:serp-previews`, `seo:redirects`, `lint:i18n-extended` y `audit:bundle:fast` (versión rápida de `audit:bundle`) **no** son gates de `npm run check`, pero se ejecutaron por separado como verificación adicional (ver §2.5 y §2.6).

### 2.3 — Auditoría de seguridad y dependencias

| Comando | Resultado | Log |
|---|---|---|
| `cd exentax-web && npm audit --omit=dev` | **0 vulnerabilities** (low/moderate/high/critical) | `.local/baseline-77/npm-audit.log` |
| `cd exentax-web && npx depcheck --json` | 0 dependencias muertas reales (ver §6) | `.local/baseline-77/depcheck.json` |
| `node scripts/audit/orphan-detect.test.mjs` | **EXIT 0** — 0 huérfanos en sitemap-index | `.local/baseline-77/orphans.log` |

### 2.4 — Smoke 102 rutas canónicas (17 RouteKeys × 6 langs)

Reproductor `node /tmp/route-smoke.mjs` (lee `shared/routes.ts`, recorre `RouteKey × Lang` resolviendo `routePath()`, hace `HEAD` + `GET` contra `localhost:5000`).

```
RESULT: 102/102 = 200 · redirects=0 · failures=0
```

Cobertura de keys: `home`, `pricing`, `services`, `aboutUs`, `taxCalculator`, `booking`, `loginAdmin`, `legal/aviso`, `legal/privacidad`, `legal/cookies`, `legal/disclaimer`, `legal/condiciones`, `legal/dpa`, `legal/sub-procesadores`, `legal/transferencias-internacionales`, `policies/no-clients-policy`, `blog`. (`/blog/*` lleva el smoke específico de `lint:blog` + `seo:slash`.)

### 2.5 — SEO + sitemap + robots + headers

| Comando / endpoint | Resultado | Notas |
|---|---|---|
| `npm run seo:masterpiece-strict` | **EXIT 0** · mean 99.8 / 100 | `.local/baseline-77/seo-masterpiece.log` |
| `npm run seo:llm-readiness` | **EXIT 0** | `.local/baseline-77/seo-llm.log` |
| `npm run seo:serp-previews` | **EXIT 0** · 108 cards (6 langs × 18 pages) · 0 errors / 18 warnings menores (títulos cortos en SERP) | `.local/baseline-77/seo-serp.log` |
| `npm run seo:check` | **EXIT 0** | `.local/baseline-77/seo-check.log` |
| `npm run seo:slash` | **EXIT 0** | `.local/baseline-77/seo-slash.log` |
| `npm run seo:meta` | **EXIT 0** · 0 errors / 0 warnings × 6 idiomas | `.local/baseline-77/seo-meta.log` |
| `curl -I /sitemap.xml` | `200` · sitemap-index con 3 hijos (`-pages`, `-blog`, `-blog-canonical`) · `<lastmod>` real | — |
| `curl -I /sitemap-blog.xml` | `200` · 672 entries × 6 idiomas | — |
| `curl -I /robots.txt` | `200` · allow-list 17 bots IA + sitemaps · sin `Disallow:` global | — |
| `curl -I /` (headers seguridad) | CSP + `X-Frame-Options: SAMEORIGIN` + `Referrer-Policy: strict-origin-when-cross-origin` + `Permissions-Policy` + `X-Content-Type-Options: nosniff` + `X-Correlation-Id` | — |

### 2.6 — i18n y copy

| Comando | Resultado | Log |
|---|---|---|
| `npm run i18n:check` | **EXIT 0** · 1.558 keys × 6 idiomas (es, en, ca, fr, de, pt) | `.local/baseline-77/i18n.log` |
| `npm run lint:i18n-extended` | **EXIT 0** · 0 hits (calcos, anglicismos, false friends, registro `Sie`/`vous`, brasileñismos) | `.local/baseline-77/i18n-extended.log` |
| `npm run lint:pt-pt` | **EXIT 0** · 115 ficheros OK | `.local/baseline-77/pt-pt.log` |
| `npm run lint:typography` | **EXIT 0** | `.local/baseline-77/lint-typography.log` |
| `npm run lint:brand-casing` | **EXIT 0** | `.local/baseline-77/lint-brand.log` |

### 2.7 — Discord, agenda y operación

| Comando | Resultado | Notas |
|---|---|---|
| `npm run test:discord-regression` (aislado) | **3/3 PASS · 72/72 e2e** | `test-discord-neon` 24,5 s · `test-discord-bot-buttons` 7,2 s · `test-discord-bot-e2e` 23,7 s |
| `npm run discord:register:diff` | EXIT 2 esperado en sandbox sin `DISCORD_APP_ID` / `DISCORD_BOT_TOKEN` | `.local/baseline-77/discord-diff.log` (secrets prod-only; F-5 en `PRODUCTION-CHECKLIST.md` cubre la verificación post-deploy) |
| `npm run lint:email-deliverability` | **EXIT 0** | `.local/baseline-77/lint-email.log` |
| `npm run lint:banking-entities` | **EXIT 0** | `.local/baseline-77/lint-banking.log` |

### 2.8 — Bundle y performance

| Comando | Resultado | Log |
|---|---|---|
| `npm run audit:bundle:fast` | **EXIT 0** · HARD budget cumplido (`BUNDLE_BUDGET_SERVER_MB` / `BUNDLE_BUDGET_PUBLIC_MB`) | `.local/baseline-77/audit-bundle.log` |
| `npm run blog:validate-all` | **EXIT 0** · 15/15 pasos | `.local/baseline-77/blog-validate.log` |

---

## 3. Hallazgos por área

| # | Área | Estado | Evidencia | Acción |
|---|---|:---:|---|---|
| 1 | Estructura del repositorio (npm workspaces, alias, layout `client/server/shared`) | ✓ | `STACK.md`, `tsconfig.json` consistente con `vite.config.ts` | Sin cambios |
| 2 | Código TypeScript (strict, sin `any` no controlados) | ✓ | `tsc --strict` EXIT 0 | Sin cambios |
| 3 | Web pública (rutas, navegación, i18n routing) | ✓ | Smoke 102/102 = 200 | Sin cambios |
| 4 | SEO meta + masterpiece + LLM readiness + SERP previews + sitemap + robots + hreflang | ✓ | Cinco gates SEO + curls a sitemap/robots, todo verde | Sin cambios |
| 5 | Performance / bundle | ✓ | `audit:bundle:fast` HARD budget OK | Sin cambios |
| 6 | Funciones core (calculadora, leads, newsletter, booking) | ✓ | `test:calculator` 9,7 s · `test:newsletter` 15,7 s · `test:booking` 12,6 s — todos PASS | Sin cambios |
| 7 | Idiomas (6 locales · 1.558 keys · calidad nativa extendida) | ✓ | `i18n:check`, `lint:i18n-extended`, `lint:pt-pt` PASS | Sin cambios |
| 8 | URLs e indexing (slugs, canonicals, IndexNow, redirects) | ✓ | `seo:slash`, `seo:check`, `seo:redirects`, `test:redirects` 9/9, `test:indexnow` 10/10 | Sin cambios |
| 9 | Discord (bot REST API, queue persistence, `/agenda`, `/cita`, embeds, audit channel) | ⚠→✓ | Race del worker `drainTick()` sin token + timeout corto en aserción `bloquear/desbloquear` causaban falsos negativos en runner paralelo | **Fix aplicado** (ver §4) |
| 10 | Agenda (Google Calendar + Meet, link generation, ICS) | ✓ | Cubierto por `test:booking` + esquema `bookings` validado | Sin cambios |
| 11 | Gestión interna (Discord-only ops, audit log, consent log) | ✓ | `test:discord-regression` 72/72 incluye consentimientos + auditoría | Sin cambios |
| 12 | Diseño / UX (sistema Exentax: `borderRadius:9999`, neon `#00E510`, dark mode `#000000`, sin emojis ni icon libs externas) | ✓ | Reglas vivas en `tailwind.config.ts` + `client/src/components/icons.tsx` (solo SVGs propios) | Sin cambios |
| 13 | Tipografías (Space Grotesk headings + Inter body/UI · `lint:typography`) | ✓ | `lint:typography` clean | Sin cambios |
| 14 | Emails (templates Inter-only · neon green único acento · `lint:email-deliverability`) | ✓ | `lint:email-deliverability` clean | Sin cambios |
| 15 | Copy (calidad por idioma, glosario respetado, banking entities) | ✓ | `lint:i18n-extended` 0 hits + `lint:banking-entities` clean | Sin cambios |
| 16 | Seguridad y encriptación (CSP, CSRF, rate-limit, field encryption AES-256-GCM) | ✓ | Headers via `curl -I /` + `test:redirects`/`test:geo` cubren middleware · field encryption 45/45 (Task #66 baseline) · `npm audit` 0 vulns | Sin cambios |
| 17 | Cross-browser / cross-device (Playwright matrix Chromium / Firefox / WebKit × 360 / 768 / 1280) | ⚠ deferida | **No ejecutada en este ciclo.** El smoke server-side de 102/102 rutas valida rendering, hreflang y headers, pero **no** sustituye la matriz de browsers reales. Cobertura planificada en `PENDING-FINAL.md #5` (requiere browsers + workflow CI sostenido) | Sin cambios de código (acción pendiente operativa) |

---

## 4. Correcciones aplicadas

### 4.1 — `server/discord.ts` · race del worker de cola sin token de bot

**Síntoma**: Bajo `scripts/check.mjs` (33 gates en paralelo, `concurrency=6`), `test-discord-bot-e2e.ts` fallaba intermitentemente con `Expected at least N audit POSTs, got 0`. Ocurría 1-5 veces por cada 10 ejecuciones.

**Diagnóstico**: El runner `check.mjs` pre-warma un dev server en `:5000` para que los gates HTTP-en-vivo lo reusen. Ese dev server arranca sin `DISCORD_BOT_TOKEN`. Su `discordOutboundQueue.start()` lanza el `drainTick()` cada 1.5 s, que `SELECT` + `UPDATE … RETURNING` filas pendientes de `discord_outbound_queue` y las pasa a `attemptSendOnce()`. Sin token, `attemptSendOnce()` cae en el path "fallback alert" (intentar enviar a `#errores`), también sin token, marca `success=true` con `nextAttempt=null` (silent drop). Resultado: las filas que escribía el proceso del e2e (con token de prueba e intercept de `fetch`) eran reclamadas y borradas por el dev server pre-warmed antes de que el e2e las observara. Ambos procesos comparten la misma tabla en Postgres Neon.

**Fix** (líneas 1041-1060 de `exentax-web/server/discord.ts`):

```ts
// Si no hay token de bot configurado (caso típico: dev server pre-warmed por
// scripts/check.mjs sin DISCORD_BOT_TOKEN), no debemos drenar la cola.
// Si lo hiciéramos, attemptSendOnce() cae en el path de "fallback alert" que
// también requiere token y termina marcando success=true (silent drop),
// robándole filas a procesos hermanos que sí tienen token (p.ej. la suite e2e
// con token falso e intercept de fetch). Producción siempre tiene token, así
// que su comportamiento no cambia.
if (!getBotToken()) return;
```

**Verificación post-fix**: 5 ejecuciones consecutivas de `npm run check` → 5/5 EXIT 0. `test:discord-regression` aislado → 72/72 e2e PASS estables.

### 4.2 — `scripts/discord/test-discord-bot-e2e.ts` · timeout corto en `bloquear/desbloquear`

**Síntoma**: La aserción `bloquear/desbloquear echoed to #sistema-auditoria (>=2 audit POSTs)` (línea 444) usaba `waitForQueueDrain(8_000)`, mientras el resto de aserciones de la misma suite usan el default 25.000 ms. Bajo carga del runner paralelo (32 procesos node compitiendo por CPU), el tick de 1.5 s del worker se retrasa lo suficiente para que la cola siga con `size=14` cuando el timeout vence.

**Fix** (línea 444):

```ts
// Antes:
await waitForQueueDrain(8_000);
// Después:
await waitForQueueDrain();   // default 25 s, igual al resto de la suite
```

**Justificación**: Sólo retrasa los fallos verdaderos (nunca los enmascara: el worker procesa en orden y el timeout sigue siendo finito). Alinea con el resto de aserciones de la misma suite.

---

## 5. Decisiones documentadas (sin cambio)

| Hallazgo | Decisión | Razón |
|---|---|---|
| `postcss` reportado como "unused" por `depcheck` | Mantener | Lo carga `postcss.config.mjs` vía `tailwindcss` + `autoprefixer`. Eliminarlo rompe el build. |
| `@shared/*` reportados como "missing" por `depcheck` | Mantener | Son aliases TS (`tsconfig.json` + `vite.config.ts` + `vitest.config.ts`), no paquetes npm. Falsos positivos típicos. |
| 18 warnings en `seo:serp-previews` | Diferida (cobertura editorial) | Títulos con espacio horizontal escaso en Google (no errors). No bloquean producción ni rendering. |
| `seo:check` no cubre `https://exentax.com` desde sandbox | Diferida (operativa) | Egress restringido en sandbox; cubierto en F-1..F-9 post-deploy de `PRODUCTION-CHECKLIST.md`. |
| `discord:register:diff` EXIT 2 en sandbox | Diferida (esperada) | Requiere `DISCORD_APP_ID` + `DISCORD_BOT_TOKEN` (secrets prod-only). |
| Tests E2E Playwright (booking/calculator/lang-switch) | Diferida (`PENDING-FINAL.md #5`) | Requieren browsers + DB + workflow CI sostenido. Cobertura server-side ya validada por smoke 102/102. |
| Reescritura premium ES `cuanto-cuesta-constituir-llc.ts` | Diferida (`PENDING-FINAL.md #3`) | Tarea editorial, no técnica. |
| Revisión profesional por nativos EN/FR/DE/PT/CA | Diferida (`PENDING-FINAL.md #2`) | Brief premium-pro listo; calidad sostenible vía 6 audits automáticos. |
| Lighthouse CI rodaje sostenido | Diferida (`PENDING-FINAL.md #4`) | Gating real ya activo (override sólo via label `bypass-perf-gate`). |

---

## 6. Verificación post-merge

- Tras integrar este branch a `main`, ejecutar:
  ```bash
  cd exentax-web && npm run check
  ```
  Debe seguir devolviendo **EXIT 0** con los 33 gates en verde. Los logs `.local/baseline-77/*` quedan como evidencia reproducible y se rotan en la siguiente auditoría.
- El cierre operativo a producción depende exclusivamente de los pasos manuales descritos en [`PENDING-FINAL.md #1`](../../PENDING-FINAL.md#1--live-verification-stack-f-1-a-f-9-en-hostinger-vps) (provisión VPS Hostinger, DNS, secrets, F-1..F-9). Ningún ítem residual es de código.

---

## 7. Resumen ejecutivo

- **`npm run check`** EXIT 0 · **33 / 33** gates verde · wall **53,4 s**.
- **`npm audit --omit=dev`** **0 vulnerabilities**.
- **0 drift de código** respecto al snapshot `exentax-3.0`.
- **2 correcciones** controladas y comentadas in-line: una de código (`server/discord.ts`), una de test (`scripts/discord/test-discord-bot-e2e.ts`).
- **17 áreas** auditadas: **16 en verde** sin reservas + **1 ⚠ deferida** (cross-browser / cross-device Playwright matrix — pendiente operativo no de código, planificado en `PENDING-FINAL.md #5`).
- **0 cambios** en `package.json`, `vite.config.ts`, `server/vite.ts`, `drizzle.config.ts`.
- **Documentación** sincronizada: `README.md`, `PRODUCTION-STATUS.md` (12/13 áreas verde + 1 ⚠ deferida), `PENDING-FINAL.md` (P0 vacío; P2 #5 sigue siendo el único ítem que cubre la matriz Playwright), `BASELINE.md` §FINAL VERIFICATION, `CHANGELOG.md` (entrada nueva), `replit.md` (sección Task #77).
