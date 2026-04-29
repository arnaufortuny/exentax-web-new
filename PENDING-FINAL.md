# PENDING-FINAL — Exentax Web V3

> **Lista priorizada única.** Refrescada **2026-04-29** tras cierre LOTES 1-10 (Task #11). Estado real verificado por área en [`PRODUCTION-STATUS.md`](PRODUCTION-STATUS.md). Checklist accionable deploy en [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md). Áreas inmovilizadas en [`WHAT-NOT-TO-TOUCH.md`](WHAT-NOT-TO-TOUCH.md).

---

## 🔴 P0 — Bloquea producción

> **Vacío.** El último drift de integración (P1 #1.5 — brasileñismo "arquivo" del catálogo bridge v2 LOTE 6b en pt-PT) se cerró el 2026-04-29 (Task #46). `npm run check` ejecuta de extremo a extremo en EXIT 0. Los pasos que faltan para deploy real son operativos en VPS, no de código.

---

## 🟡 P1 — Bloquea go-live (operativo, no de código)

### #1 — Live verification stack F-1 a F-9 en Hostinger VPS

- **Impacto**: deploy / despliegue (no se puede declarar `producción VIVO` sin esto).
- **Bloquea**: sólo el último kilómetro · NO bloquea integración a `main`.
- **Estado snapshot 2026-04-29 (Task #48)**: probado contra `https://exentax.com` → **PASS=1 · FAIL=9 · SKIP=16**. Confirma que el dominio sirve hoy un mirror estático antiguo en Google Frontend (no la app Express): `/api/*` 404, `/sitemap.xml` es `urlset` suelto sin `<loc>`, headers sin CSP/XFO/Referrer-Policy. La sandbox `localhost:5000` valida que el código está 100% listo (health/ready 200, CSRF 403, sitemap-index con 672 posts, 6 idiomas 200). **No queda nada por hacer a nivel código**; queda el trabajo operativo descrito en [`docs/internal/LIVE-VERIFICATION-2026-04-29.md §5`](docs/internal/LIVE-VERIFICATION-2026-04-29.md).
- **Runner que automatiza F-1..F-9**: [`scripts/live-verification.sh`](scripts/live-verification.sh) (Task #48). Una vez la VPS está viva con secrets cargados:
  ```bash
  bash scripts/live-verification.sh https://exentax.com \
    --metrics-token "$METRICS_TOKEN" --indexnow-key "$INDEXNOW_KEY" \
    --report docs/internal/live-verification-$(date +%F).md
  ```
  Sale `0` cuando no hay FAIL, imprime tabla por sección F-1..F-9 y un reporte markdown con detalle por check. Cubre todo lo automatizable vía HTTP; los SKIP llevan el comando manual exacto (psql para field encryption, slash-commands Discord, `lhci autorun`, etc.).
- **Comandos exactos completos**: ver [`PRODUCTION-CHECKLIST.md §F`](PRODUCTION-CHECKLIST.md#f-smoke-tests-post-deploy-en-orden) — F-1 health, F-2 SEO, F-3 seguridad (CSRF + rate-limit + field encryption), F-4 E2E con DB real (booking + newsletter + calculator + indexnow), F-5 Discord (bot online, `/agenda`, `/cita`, embeds en `#exentax-agenda` y `#exentax-auditoria`), F-6 Calendar/Meet/Email, F-7 métricas Prometheus + UptimeRobot, F-8 frontend smoke 6 idiomas + responsive, F-9 Lighthouse Performance ≥ 0.85 / LCP < 2.5s / CLS < 0.1.
- **Secrets requeridos antes del primer arranque**: `DATABASE_URL`, `FIELD_ENCRYPTION_KEY` (`openssl rand -hex 32`), `GOOGLE_SERVICE_ACCOUNT_KEY`, los 5 IDs Discord (`BOT_TOKEN`, `PUBLIC_KEY`, `APP_ID`, `GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`) y los 5 channel IDs (`REGISTROS`, `AGENDA`, `CONSENTIMIENTOS`, `AUDITORIA`, `ERRORES`). Lista canónica en [`PRODUCTION-CHECKLIST.md §B`](PRODUCTION-CHECKLIST.md#b-variables-de-entorno-resumen).
- **Bloqueadores operativos (no de código)** que deben completarse para que F-1..F-9 pase: 1) provisionar VPS Hostinger, 2) DNS `exentax.com`/`www` → IP del VPS (retirar mirror estático actual), 3) crear Discord app + Google Cloud SA + UptimeRobot, 4) cargar `.env` en VPS, 5) `npm ci` + `db:push` + `build` + `pm2 start`, 6) Nginx + Certbot, 7) ejecutar el runner, 8) cumplir los SKIP manuales (E2E, Discord, Calendar/Meet, UptimeRobot, Lighthouse). Detalle paso a paso en [`docs/internal/LIVE-VERIFICATION-2026-04-29.md`](docs/internal/LIVE-VERIFICATION-2026-04-29.md).

### #1.5 — Drift `lint:pt-pt`: brasileñismo "arquivo" en catálogo bridge v2 (LOTE 7) — **CERRADO 2026-04-29 (Task #46)**

- **Resolución**: la fuente del catálogo (`exentax-web/scripts/blog/blog-risk-bridge-inject.mjs`) ya usa la forma pt-PT canónica `"ficheiro pronto"` y los 36 ficheros de `client/src/data/blog-content/pt/*.ts` están limpios (`grep "arquivo" → 0`). `lint:pt-pt` pasa: «Sin brasileñismos en pt: 115 ficheros».
- **Saneo adicional incluido en Task #46** (mismo objetivo «`npm run check` EXIT 0»):
  - `seo:masterpiece-strict`: 18 critical findings de la regla `year-in-prose` en 4 artículos × 5 idiomas (en/fr/de/pt/ca) procedían de los títulos de "On the same topic / Zum Weiterlesen / Sur le même sujet / …" — links markdown internos a otros posts cuyo título contiene un año (`[… in 2026](/en/blog/…)`). Eran *facts* sobre el post enlazado, no decisión editorial del artículo actual. Fix: `findYearsInProse` (en `exentax-web/scripts/blog/blog-masterpiece-audit.mjs`) ahora descarta el bloque completo `[texto](/<lang>/blog/…)` antes del cleanup genérico de markdown links. Mean score subió de 97.5 → 99.8 / 100.
  - `test:discord-neon`: dos paths relativos rotos (`scripts/discord/test-discord-neon.ts` resolvía `..` + `server` desde `scripts/discord/` → `scripts/server/discord.ts`, inexistente). Corregido a `..` + `..` + `server` en líneas 60 y 175. Además, el test ahora fuerza `DISCORD_QUEUE_BACKEND=memory` para no depender de Postgres ni del estado de dedup persistido entre runs (las aserciones son del color de los embeds, no de persistencia). Captura las 23 embeds esperadas, todas `0x00E510`.
- **Verificación de cierre** (Task #66 — runner paralelo `scripts/check.mjs`, wall ≈ 60 s sobre el VPS Replit con dev server pre-warmed):
  ```bash
  cd exentax-web && npm run check
  ```
  El runner paraleliza los 33 gates con concurrency = `os.availableParallelism()` (override `CHECK_CONCURRENCY=N`), prioriza por peso descendente (los pesados — `blog:validate-all`, `audit:bundle`, `tsc`, `test:discord-neon`, `seo:slash` — arrancan primero), y pre-warma un dev server en `:5000` cuando `DATABASE_URL` está disponible para que los gates con escaneo HTTP en vivo (`seo:slash` + `seo-orphan-audit-ci` interno de `blog:validate-all`) lo reusen en vez de bootear cada uno el suyo bajo contención de CPU. Salida: tabla por step ordenada por duración + dump del output capturado por cada FAIL al final. La cadena serial original sigue disponible como `npm run check:serial` para depurar regressions del propio runner.

---

## 🟢 P2 — Mejoras y gobernanza no-bloqueantes

### #2 — Revisión profesional por nativos EN / FR / DE / PT / CA

- **Impacto**: SEO (calidad nativa) + UX (registro premium).
- **Estado**: brief premium-pro listo en [`docs/internal/translator-brief.md`](docs/internal/translator-brief.md). Calidad sostenible vía 6 audits automáticos (LOTE 7 cierra heurística extendida en 0 hits — un nativo humano puede aún detectar matices que el script no codifica).
- **Política**: NO se contrata reviewer humano nativo masivo. Si se decide contratar, hacerlo por idioma con el brief existente.
- **Reproductor**: `npm run lint:i18n-extended` (0 violations) + lectura cualitativa de muestra de 30 keys por idioma sobre `client/src/i18n/locales/{lang}.ts`.

### #3 — Reescritura `cuanto-cuesta-constituir-llc.ts` ES + 5 traducciones nativas

- **Impacto**: conversión (artículo de búsqueda alta intención).
- **Estado**: pendiente editorial, fuera del alcance de LOTES 1-10. El artículo cumple el contrato técnico (cobertura conversión + bridge Exentax) pero el owner ha solicitado una reescritura premium ~3000 palabras con hook LegalZoom $97 → AEAT, errores 25K USD por 5472, ROI 8 meses.
- **Reproductor**: `node scripts/blog/blog-validate-all.mjs` (debe seguir verde tras la reescritura).

### #4 — Lighthouse CI rodaje sostenido

- **Impacto**: performance regression detection en PRs.
- **Estado**: workflow `.github/workflows/lighthouse.yml` activo con gating real (override sólo via label `bypass-perf-gate` — Task #20).
- **Reproductor**: cualquier PR a `main` ejecuta el workflow; los thresholds de [`PRODUCTION-CHECKLIST.md §F-9`](PRODUCTION-CHECKLIST.md#f-9-lighthouse-final) deben pasar sin label de bypass.

### #5 — Tests E2E Playwright sostenidos en CI

- **Impacto**: regression detection cross-browser.
- **Estado**: specs añadidas (booking + calculator + lang-switch). Requieren `npm run test:e2e` con browsers + DB; no incluido en `npm run check` por velocidad.
- **Reproductor**: `cd exentax-web && npm run test:e2e` (en entorno con Playwright + DB).

### #6 — `og:image` por artículo (decisión owner: descartado)

- **Impacto**: presentación social media.
- **Estado**: **DESCARTADO** por el owner (2026-04-26). Todos los posts comparten `/og-image.png` con `og:image:alt` traducido por idioma. Si se revisita, requisitos en `docs/internal/og-image-requirements.md` (raster no SVG, 1200×630, 6 idiomas, overlay título).

---

## 📌 Notas de gobernanza

- **Cambios cerrados en este ciclo (commits LOTE 1-10)**:
  - LOTE 1: `seo:meta` 0 / 0.
  - LOTE 2: 780 URLs 200, hreflang bidireccional, IndexNow live.
  - LOTE 5: 672 / 672 veracidad ✓ · 0 contradicciones.
  - LOTE 6 / 6b: 0 warnings `no-conversion-entry` · 99,5% bridge Exentax adyacente.
  - LOTE 7: heurística extendida calidad nativa 0 hits × 6 idiomas.
  - LOTE 8: JSON-LD válido + OG completo + Twitter Cards completas en 100% de páginas.
  - LOTE 9: health ready 200 + calculadora 116/116 + field encryption AES-256-GCM 45/45.
  - LOTE 10: docs raíz consolidados + `PRODUCTION-STATUS.md` + `PRODUCTION-CHECKLIST.md` raíz.
- **Calidad de traducciones**: brief premium-pro en [`docs/internal/translator-brief.md`](docs/internal/translator-brief.md). Calidad sostenible vía 6 audits automáticos.
- **Docs históricos**: cleanup masivo 2026-04-27 (297 → 19 docs vivos, -93%) + Task #3 cleanup estructural 2026-04-28 (~40 MB liberados, 212 ficheros eliminados). Histórico exacto en `git log`.
- **Source of truth para pendientes**: ESTE FICHERO. Cualquier ítem cerrado: marcar aquí con `**CERRADO YYYY-MM-DD**` + commit hash.
- **Source of truth para estado por área**: [`PRODUCTION-STATUS.md`](PRODUCTION-STATUS.md). Cualquier área que cambia de estado: actualizar allí.
- **Source of truth para deploy**: [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md) (raíz, accionable) + `exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md` (técnico extenso) + `exentax-web/docs/deploy/HOSTINGER-VPS.md` (guía narrativa).

---

## Verificación de cierre del ciclo

### En sandbox · branch LOTE 10 docs · ejecutado 2026-04-29

```bash
# 1. TypeScript strict (en exentax-web/)
cd exentax-web && npx tsc --noEmit --strict
# → EXIT 0 ✓

# 2. Build sin E2E (en raíz del repo)
cd .. && SKIP_BUILD_E2E=1 npm run build
# → EXIT 0 ✓ (dist/index.mjs 5.8 MB)

# 3. Health endpoints (workflow `Start application` activo en port 5000)
curl -s http://localhost:5000/api/health
# → 200 {"status":"ok","uptime":N}
curl -s http://localhost:5000/api/health/ready
# → 200 {"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,"message":"last drain Ns ago"}}}

# 4. npm run dev → workflow `Start application` RUNNING — verde
#    logs limpios: [express] listening on port 5000 · fully initialized · email-retry started ·
#                  discord queue persistence enabled · 10 schedulers iniciados sin error.

# 5. npm run check (en exentax-web/) — VERDE tras Task #46 (2026-04-29)
cd exentax-web && npm run check
# → EXIT 0 ✓
#   Las 33 gates pasan: tsc · lint:typography · lint:stray-reports ·
#   lint:brand-casing · lint:pt-pt · lint:blog · lint:banking-entities ·
#   lint:email-deliverability · seo:check · seo:slash · seo:meta ·
#   seo:masterpiece-strict · test:masterpiece-audit{,-rules} ·
#   blog:validate-all · i18n:check · test:seo-{check,slash} ·
#   test:lint-{blog,banking-entities} · test:no-inline-related ·
#   test:risk-bridge-inject · test:audit-faqs · test:calculator ·
#   test:discord-neon · test:bundle-diff-notify · test:perf-gate-bypass-notify ·
#   test:newsletter · test:booking · test:indexnow · test:redirects ·
#   test:geo · audit:bundle. Detalle del cierre y verificación por bloques en §1.5.
```

### En el branch consolidado tras LOTES 1-9 (verificación integral)

```bash
cd exentax-web

npm run check                                          # → EXIT 0 (esperado tras LOTE 7 fix de §1.5)
npm run blog:validate-all                              # → "OK (15 steps)"
npm run seo:meta                                       # → 0 errors / 0 warnings × 6 langs
npm run seo:check                                      # → 0 broken links · 112 articles ≥3 inbound
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash                # → clean
npm run i18n:check && npm run lint:i18n-extended       # → PASS / PASS
npm run test:redirects && npm run test:geo             # → 9/9 + 12/12
node scripts/audit/audit-conversion-112x6.mjs --strict # → 672/672
npm audit                                              # → 0 vulnerabilities
```

### En Hostinger VPS tras deploy (live verification)

Ver [`PRODUCTION-CHECKLIST.md §F-1 a §F-9`](PRODUCTION-CHECKLIST.md#f-smoke-tests-post-deploy-en-orden).
