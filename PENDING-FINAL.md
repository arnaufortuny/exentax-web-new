# PENDING-FINAL — Exentax Web V3

> **Lista priorizada única.** Refrescado 2026-04-27 tras verificación directa: `npm audit` y `Lighthouse continue-on-error` ya están cerrados en main. Único pendiente real: live verification stack (sandbox-blocked).

---

## 🔴 Alta prioridad — pendiente real

> **Vacío.** El blog está cerrado (`audit:conversion --strict` → **672/672** fully conversion-grade). 15/15 puertas técnicas en VERDE. F-1 BUG newsletter-broadcast progress counter arreglado (commit más reciente).

---

## 🟡 Media prioridad

> **Vacío.** `npm audit` reporta **0 vulnerabilities** (verificado hoy en root y workspace tras Task #34 npm workspaces + drizzle-kit 0.31.10). El histórico "4 moderate drizzle-kit chain" está cerrado.

---

## 🟢 Baja prioridad — verify on Replit/Hostinger

### #1 — Live verification stack (12 checks)

- **Bloquea producción**: NO en sandbox; **SÍ** debe pasar en Replit/Hostinger antes de go-live.
- **Comandos** documentados en [`PRODUCTION-CHECKLIST.md §F-P`](PRODUCTION-CHECKLIST.md): build E2E, /api/health/ready, headers de seguridad, CSRF, rate-limit, Discord bot, booking flow, sitemap.xml live, robots.txt live, IndexNow, Lighthouse PR, Playwright E2E.

### #2 — Lighthouse CI

- **Estado**: workflow `.github/workflows/lighthouse.yml` activo. `continue-on-error` solo se evalúa contra label `bypass-perf-gate` (Task #20 override). Gating real ya activo.

---

## 📌 Notas de gobernanza

- **Calidad de traducciones**: brief premium-pro en [`docs/internal/translator-brief.md`](docs/internal/translator-brief.md). **No se contrata reviewer humano nativo masivo.** Calidad sostenible vía 6 audits automáticos.
- **Docs históricos**: cleanup masivo 2026-04-27 (297 → 19 docs vivos, -93%). Histórico exacto en `git log`.
- **Source of truth para pendientes**: ESTE FICHERO. Cualquier ítem cerrado: marcar aquí con `**CERRADO YYYY-MM-DD**` + commit hash.

---

## Verificación de cierre

```bash
cd /home/user/exentax-web-new/exentax-web
npx tsc --noEmit --strict                     # → EXIT 0
npm run blog:validate-all                     # → "OK (15 steps)"
npm run seo:meta                              # → PASS, 6 langs, 0 errors
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash       # → clean
npm run test:redirects && npm run test:geo    # → 9/9 + 12/12
node scripts/audit-conversion-112x6.mjs --strict  # → 672/672
npm audit                                     # → 0 vulnerabilities
```
