# PENDING-FINAL — Exentax Web V3

> **Lista priorizada única.** Refrescada **2026-04-29** tras cierre LOTES 1-10 (Task #11). Estado real verificado por área en [`PRODUCTION-STATUS.md`](PRODUCTION-STATUS.md). Checklist accionable deploy en [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md). Áreas inmovilizadas en [`WHAT-NOT-TO-TOUCH.md`](WHAT-NOT-TO-TOUCH.md).

---

## 🔴 P0 — Bloquea producción

> **Vacío** desde el punto de vista de bloqueo de integración a `main`. En el branch documental LOTE 10 hay un drift de calidad nativa pt-PT (`lint:pt-pt` ~25 hits "arquivo" del catálogo bridge v2 LOTE 6b) escalado a P1 #1.5 — su responsable es LOTE 7 (i18n calidad nativa) en su pasada de pulido pt-PT, NO LOTE 10 (esta tarea sólo edita `.md` raíz; cero cambios de código). El resto de áreas (9/10) están en verde en sandbox; los pasos que faltan para deploy real son operativos en VPS, no de código.

---

## 🟡 P1 — Bloquea go-live (operativo, no de código)

### #1 — Live verification stack F-1 a F-9 en Hostinger VPS

- **Impacto**: deploy / despliegue (no se puede declarar `producción VIVO` sin esto).
- **Bloquea**: sólo el último kilómetro · NO bloquea integración a `main`.
- **Comandos exactos**: ver [`PRODUCTION-CHECKLIST.md §F`](PRODUCTION-CHECKLIST.md#f-smoke-tests-post-deploy-en-orden) — F-1 health, F-2 SEO, F-3 seguridad (CSRF + rate-limit + field encryption), F-4 E2E con DB real (booking + newsletter + calculator + indexnow), F-5 Discord (bot online, `/agenda`, `/cita`, embeds en `#exentax-agenda` y `#exentax-auditoria`), F-6 Calendar/Meet/Email, F-7 métricas Prometheus + UptimeRobot, F-8 frontend smoke 6 idiomas + responsive, F-9 Lighthouse Performance ≥ 0.85 / LCP < 2.5s / CLS < 0.1.
- **Secrets requeridos antes del primer arranque**: `DATABASE_URL`, `FIELD_ENCRYPTION_KEY` (`openssl rand -hex 32`), `GOOGLE_SERVICE_ACCOUNT_KEY`, los 5 IDs Discord (`BOT_TOKEN`, `PUBLIC_KEY`, `APP_ID`, `GUILD_ID`, `ADMIN_DISCORD_ROLE_ID`) y los 5 channel IDs (`REGISTROS`, `AGENDA`, `CONSENTIMIENTOS`, `AUDITORIA`, `ERRORES`). Lista canónica en [`PRODUCTION-CHECKLIST.md §B`](PRODUCTION-CHECKLIST.md#b-variables-de-entorno-resumen).

### #1.5 — Drift `lint:pt-pt`: brasileñismo "arquivo" en catálogo bridge v2 (LOTE 7)

- **Impacto**: gate `npm run check` no llega a EXIT 0 hasta resolverlo.
- **Diagnóstico**: el catálogo de risk-bridge v2 introducido por LOTE 6b incluye en pt-PT la frase canónica `"…submissão feita, arquivo pronto, o risco fica no papel."` que dispara `audit-pt-pt.mjs` en ~25 ficheros `client/src/data/blog-content/pt/*.ts` (brasileñismo "arquivo" — pt-PT canónico es "ficheiro"). NO es regresión del LOTE 10 (esta tarea sólo edita docs `.md`).
- **Quién lo arregla**: LOTE 7 (i18n calidad nativa) en su pasada de pulido pt-PT cuando se consolide.
- **Opciones de fix** (no ejecutar desde este branch documental):
  - (a) **Preferida**: reescribir la frase del bridge v2 en pt-PT cambiando "arquivo" → "ficheiro" en `exentax-web/scripts/blog/risk-bridge-catalog.ts` (o donde resida la fuente del catálogo) + re-ejecutar `risk-bridge-rewrite.mjs` para propagar a los ~25 ficheros.
  - (b) **Alternativa**: añadir la cadena al allowlist controlado de `exentax-web/scripts/audit/audit-pt-pt.mjs` documentando el motivo en el commit (sólo si lingüísticamente "arquivo" se justifica en este contexto narrativo concreto, decisión del owner pt-PT nativo).
- **Reproductor en sandbox** (este branch):
  ```bash
  cd exentax-web && node scripts/audit/audit-pt-pt.mjs
  # → EXIT 1, ~25 hits "arquivo" en client/src/data/blog-content/pt/*.ts
  ```
- **Verificación de cierre** (cuando LOTE 7 lo resuelva):
  ```bash
  cd exentax-web && npm run check
  # → EXIT 0 (todas las gates verdes incluido lint:pt-pt)
  ```

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

# 5. npm run check (en exentax-web/) — drift conocido §1.5
cd exentax-web && npm run check
# → EXIT 1 ⚠
#   Falla en step `lint:pt-pt`: ~25 ficheros client/src/data/blog-content/pt/*.ts
#   contienen "arquivo" (brasileñismo) proveniente del catálogo bridge v2 LOTE 6b.
#   NO es regresión de LOTE 10. Lo resuelve LOTE 7 cuando se consolide. Detalle §1.5.
#   Resto de gates en este branch: tsc EXIT 0 · lint:typography clean ·
#   lint:stray-reports clean · lint:brand-casing clean.
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
