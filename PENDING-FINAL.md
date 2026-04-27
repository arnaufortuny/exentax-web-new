# PENDING-FINAL — Exentax Web

> **Lista priorizada única.** Generado 2026-04-27 post-cleanup masivo (297→19 docs) y verificación 15/15 gates verde.

---

## 🔴 Alta prioridad — pendiente real

> **Vacío.** El blog está cerrado (`audit:conversion --strict` reporta 672/672 fully conversion-grade · 0 gaps de cualquier tipo). Las 15 puertas técnicas en VERDE. No queda ningún ítem ALTA real abierto.

---

## 🟡 Media prioridad

### #1 — npm audit 4 moderate vulnerabilities (drizzle-kit chain)

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

### #2 — Live verification stack

- **Impacto**: alto (red de seguridad pre-deploy).
- **Bloquea producción**: NO en sandbox; **SÍ** debe pasar en Replit/Hostinger antes de go-live.
- **Comandos** documentados en [`PRODUCTION-CHECKLIST.md §F-P`](PRODUCTION-CHECKLIST.md). 12 verificaciones: build E2E completo, /api/health/ready, headers de seguridad, CSRF, rate-limit, Discord bot, booking flow, sitemap.xml live, robots.txt live, IndexNow, Lighthouse PR, Playwright E2E.

### #3 — Lighthouse CI gating real

- **Estado**: `.github/workflows/lighthouse.yml` activo con CWV gates (Tasks #15/22/28/45/54). Verificar PR test post-deploy.

---

## 📌 Notas de gobernanza

- **Calidad de traducciones**: brief premium-pro en [`docs/internal/translator-brief.md`](docs/internal/translator-brief.md). **No se contrata reviewer humano nativo masivo.** Calidad sostenible vía audits automáticos (validate-i18n, blog-translation-quality-extended, audit-pt-pt, lint-banned-banking-entities, brand-casing, audit-conversion).
- **Docs históricos**: cleanup masivo 2026-04-27 (297 → 19 docs vivos, -93%). Histórico exacto en `git log`.
- **Source of truth para pendientes**: ESTE FICHERO. Cualquier ítem cerrado: marcar aquí con `**CERRADO YYYY-MM-DD**` + commit hash. Cualquier ítem nuevo: añadir aquí con prioridad explícita + comando reproducir + criterio de cierre.

---

## Verificación de cierre (al pasar a producción)

```bash
cd /home/user/exentax-web-new/exentax-web
npx tsc --noEmit --strict           # → EXIT 0
npm run blog:validate-all           # → "OK (15 steps)"
npm run seo:meta                    # → PASS, 6 langs, 0 errors
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash  # → clean
npm run test:redirects && npm run test:geo  # → 9/9 + 12/12
node scripts/audit-conversion-112x6.mjs --strict  # → 672/672

cd /home/user/exentax-web-new
ls *.md | sort
# expected: AUDIT-FINAL-REPORT · CHANGELOG · CIERRE-PROYECTO-FINAL · CONVERSION-MASTERPLAN-REPORT
#  · PENDING-FINAL · PRODUCTION-CHECKLIST · PRODUCTION-STATUS · README · WHAT-NOT-TO-TOUCH · replit
```
