# PENDING-FINAL — Exentax Web

> **Lista priorizada única.** Reemplaza la dispersión histórica de PENDING/AUDIT/REPORT files.
> Generado 2026-04-27, **refrescado contra estado real de `origin/main`** tras descubrir 70+ commits paralelos (Tasks #1, #5, #34, #60, #62, etc).

---

## Cambio de contexto importante

`origin/main` avanzó masivamente entre la creación de la rama Claude y este cierre. Una sesión paralela cerró:

- ✅ **Task #1 (`fd1d626`)** — `cuanto-cuesta-constituir-llc.ts` reescrito en 6 idiomas. ES canonical 4033 palabras con: 3 tablas costes (NM/WY/DE), 7-profile state-fit comparative, "real cost over 24 months" 3 escenarios (A/B/C), 6 nuevas FAQ (BOI post-March-2025 IFR, Pillar Two, formation timeline, state migration via domestication, ITIN scope, missed 5472 deadline), ROI explicado (amortización mes 1). 5 traducciones nativas con local-regulator framing: EN-HMRC/Anson v HMRC, FR-DGFiP/CGI 209 B, DE-Finanzamt/AStG/LLC-Erlass, PT-AT/Receita Federal Lei 14.754/2023, CA-AEAT/ATC/DGT Andorra/STJUE M720. Word ratios EN 0.97 · FR 1.01 · DE 0.89 · PT 1.00 · CA 1.00 (todos ≥ 0.85). **El scope original está cerrado.**
- ✅ **Task #5 (`4f9ee69`)** — Conversion test ES `74 → 0 FALLA` + propagación 5 idiomas (~400 ficheros editados). Bloques `defensa-fiscal-v1` (objection_score ≥ 3 + 4 anchors oficiales irs.gov/fincen.gov/boe.es/oecd.org) + `calendario-2026-v1` + `recursos-2026-v1` inyectados con framing local por idioma.
- ✅ **Task #6** — Auditoría SEO + `CONVERSION-MASTERPLAN-REPORT.md`.
- ✅ **Task #34 (`cc91fe2`)** — Repo a npm workspaces. `"workspaces": ["exentax-web"]` en root. Single `npm install` instala root+exentax-web y hoistea `tsx`/`tsc`/`drizzle-kit`/`vite`/`esbuild`/`playwright` en `node_modules/.bin/`. Resuelve silent failure de tsc no resolviendo `discord-api-types`.
- ✅ **Task #53 (`8206152`)** — **Estructural fix audit:conversion 0/672 → 672/672**. SERVICES_ROOT del auditor alineado con `our_services` canónicos de `shared/routes.ts` (era `nuestros-servicios` en vez de `servicios`, etc., por eso ningún link satisfacía el contrato). AGENDA_SLUG.ca corregido a `agendar` (era `reservar`). FR/DE ITIN slugs alineados a `obtiens-ton-itin` / `hol-deine-itin`.
- ✅ **Task #60 (`ae38862`)** — `audit:conversion --strict` cableado en `blog-validate-all.mjs` como step `conversion-strict` (gate bloqueante real).
- ✅ **Task #62 (`b7e84a8`)** — `conversion-strict` también gatea weak/generic CTAs (`haz clic aquí`, `más información`, `learn more`, etc.) en los 672 artículos.
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

> **Vacío.** Tras la verificación de los 5 commits clave en main (`fd1d626` cuanto-cuesta 4033 palabras + 5 traducciones, `4f9ee69` conversion test ES 74→0, `8206152` audit 0/672→672/672, `cc91fe2` npm workspaces, `b7e84a8` weak-CTA gate, `ae38862` conversion-strict gate), no queda ningún item con prioridad ALTA real abierto.
>
> El audit `audit:conversion --strict` reporta hoy **672/672 fully conversion-grade · 0 agenda gaps · 0 tel-WA gaps · 0 LLC-subpage gaps · 0 ITIN-subpage gaps · 0 weak-copy hits**. El blog está cerrado.

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
