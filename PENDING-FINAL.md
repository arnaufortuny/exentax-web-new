# PENDING-FINAL — Exentax Web

> **Lista priorizada única.** Reemplaza la dispersión histórica de PENDING/AUDIT/REPORT files.
> Generado 2026-04-27, **refrescado contra estado real de `origin/main`** tras descubrir 70+ commits paralelos (Tasks #1, #5, #34, #60, #62, etc).

---

## Cambio de contexto importante

`origin/main` avanzó masivamente entre la creación de la rama Claude y este cierre. Una sesión paralela cerró:

- ✅ **Task #1** — `cuanto-cuesta-constituir-llc.ts` reescrito en 6 idiomas (~266 líneas por idioma) con SEO meta + register strict CA `vostè`. Cita `IRS / FinCEN`. **NO** es la "estructura conversión 3000 palabras + hook LegalZoom→AEAT" del scope original; es expansión + refinement, no rewrite radical.
- ✅ **Task #5** — Conversion test ES `74 → 0 FALLA` + propagación 5 idiomas.
- ✅ **Task #6** — Auditoría SEO + `CONVERSION-MASTERPLAN-REPORT.md`.
- ✅ **Task #34** — Repo a npm workspaces. Single `npm install` en root instala todo. Resuelve el bug "tsx not found" sin necesidad del `resolveTsxBin` helper.
- ✅ **Task #60** — `audit:conversion` cableado en CI como gate bloqueante real.
- ✅ **Task #62** — Bloqueo en CI de CTAs débiles/genéricas en los 672 artículos.
- ✅ **Task #36 / #41** — Citaciones official-source añadidas en cada artículo (gate `blog-official-source-coverage` activo en `blog:validate-all`).
- ✅ **Task #15 / #20 / #21 / #22 / #28 / #45 / #54** — Lighthouse CI con gates Core Web Vitals + bypass-perf-gate label override.
- ✅ **Task #29 / #39 / #46** — Playwright E2E ampliado (5 browsers, tablet matrix).
- ✅ **Task #14 / #23 / #24** — Performance gate + bypass notify Discord.
- ✅ **Task #62 / #41 / #56 / #58** — Regression tests blog audit rules.
- ✅ **Task #52** — Wise typography unified.
- ✅ **Task #48** — Stop duplicating dependencies between root and exentax-web.

Ver `git log --oneline origin/main -100` para inventario completo.

---

## En esta sesión (último commit en main, ver `git log -1`)

- ✅ **Strip review-anchor blocks** — 60 ficheros del blog (5 idiomas × ~10-12 slugs) con `<!-- exentax:review-anchor-v1 -->` blocks visibles en producción → 0. 504 marcadores `[NICHT VERIFIZIERT]/[NOT VERIFIED]` etc purgados. Restaurada 1 citación oficial perdida (`es/llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais.ts`).
- ✅ **4 stray reports root → docs/audits/historical/** (REWRITE-COMPLETE-REPORT, SECURITY-FIELDS-AUDIT, EMAIL-TEMPLATES-AUDIT, TRANSLATION-QUALITY-REPORT) + refs inline actualizadas.
- ✅ **5 docs consolidados raíz** (este + 4 hermanos: PRODUCTION-STATUS, WHAT-NOT-TO-TOUCH, PRODUCTION-CHECKLIST, CIERRE-PROYECTO-FINAL).
- ✅ **`docs/internal/BASELINE-CIERRE.md`** con outputs reales de las puertas técnicas.

---

## 🔴 Alta prioridad — pendiente real

### #1 — Reescritura *radical* `cuanto-cuesta-constituir-llc.ts` con estructura conversión

**Estado**: Task #1 en main hizo expansión + register strict, **NO** la estructura conversión radical pedida en scope original (hook LegalZoom $97→AEAT, §1 NO incluye low-cost, §2 errores reales 5472=25K USD / 720=10K€ pre-2022 anulado por Ley 5/2022, §3 método Exentax, §4 ROI 8 meses, §5 conclusión, ≥3000 palabras).

- **Bloquea producción**: NO — el artículo actual existe y está validado.
- **Esfuerzo**: 6-12 h ES master + 4-6 h por idioma × 5 = ~30-40 h.
- **Pre-requisitos**: decisión owner sobre si la versión actual (Task #1) es suficiente o si quiere el rewrite radical scope-original.
- **Datos verificables**: `docs/internal/SOURCES-VERIFIED.md` (35+ datapoints IRS/AEAT/BOE/Cornell/FinCEN).

### #2 — Slugs blog low-ratio palabras < 0.85 vs ES

**Estado**: histórico contaba 17 slugs (47 críticos < 0.70). Re-medir contra main actual con detector language-aware (DE 0.65, PT/FR 0.70, CA 0.75).

- **Bloquea producción**: NO.
- **Reproducir**:
  ```bash
  cd /home/user/exentax-web-new/exentax-web
  node scripts/blog-translation-quality-extended.mjs --check
  ```
- **Última métrica reportada (CHANGELOG 2026-04-26)**: leakage 0 · DE register 0 · MT tells 0 · low-ratio 0 · untranslated 0. Si esto se mantiene en main actual, **el item está cerrado**.

---

## 🟡 Media prioridad — calidad humana

### #3 — Native review profesional EN/FR/DE/PT/CA

- **Impacto**: alto (calidad nativa = conversión + SEO).
- **Bloquea producción**: NO (`i18n:check` PASS hoy con 1554 keys × 6).
- **Esfuerzo**: ~25 días-FTE × 5 idiomas.
- **Brief**: [`docs/internal/translator-brief.md`](docs/internal/translator-brief.md).
- **Pendiente**: **contratar 5 reviewers humanos nativos.** Acción del owner.

### #4 — npm audit 4 moderate vulnerabilities (drizzle-kit chain)

- **Impacto**: bajo (devDep, no runtime).
- **Bloquea producción**: NO.
- **Reproducir**:
  ```bash
  cd exentax-web && npm audit
  # → drizzle-kit → @esbuild-kit/esm-loader → @esbuild-kit/core-utils
  ```
- **Fix**: `npm audit fix --force` (breaking upgrade drizzle-kit). Validar migraciones en staging primero.

---

## 🟢 Baja prioridad — verify on Replit/Hostinger

### #5 — Live verification stack

- **Impacto**: alto (red de seguridad pre-deploy).
- **Bloquea producción**: NO en sandbox; **SÍ** debe pasar en Replit/Hostinger antes de go-live.
- **Comandos** documentados en [`PRODUCTION-CHECKLIST.md §F-P`](PRODUCTION-CHECKLIST.md). Resumen: build E2E completo, health/ready, 12 verifications pre-deploy.

### #6 — Lighthouse CI gating real

- **Estado**: `.github/workflows/lighthouse.yml` activo con CWV gates (Tasks #15/22/28/45/54). Verificar PR test post-deploy.

### #7 — Decidir consolidación de ~290 ficheros docs/

- ~291 ficheros .md en `docs/` con histórico de auditorías que se solapa con [`PENDING-FINAL.md`](PENDING-FINAL.md) actual.
- **Sin riesgo eliminar inmediato** (anclajes vivos, refs inline, build tooling). Decisión owner: review por área, archivar lo finalizado, eliminar redundante.
- **Bloquea producción**: NO.

---

## 📌 Notas de gobernanza

- `docs/internal/PENDING.md` mantiene el detalle histórico de items cerrados (post-mortem trazabilidad).
- ESTE FICHERO (`PENDING-FINAL.md`) es la **fuente única operativa** para sprints siguientes.
- Cualquier item cerrado: marcar aquí con `**CERRADO YYYY-MM-DD**` + commit hash.
- Cualquier item nuevo: añadir aquí con prioridad explícita + comando reproducir + criterio de cierre.

---

## Verificación de cierre (al pasar a producción)

```bash
cd /home/user/exentax-web-new/exentax-web
npx tsc --noEmit --strict           # → EXIT 0
npm run blog:validate-all           # → "OK (15 steps)" en main actual
npm run seo:meta                    # → PASS, 6 langs, 0 errors
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash  # → clean
npm run test:redirects && npm run test:geo  # → 9/9 + 12/12

cd /home/user/exentax-web-new
ls *.md | sort
# expected: CHANGELOG · CIERRE-PROYECTO-FINAL · CONVERSION-MASTERPLAN-REPORT
#  · PENDING-FINAL · PRODUCTION-CHECKLIST · PRODUCTION-STATUS · README · WHAT-NOT-TO-TOUCH · replit
```
