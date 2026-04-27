# PRODUCTION-STATUS — Exentax Web

> **Verificado 2026-04-27.** Estado real por área basado en outputs de comandos ejecutados HOY (no en reportes anteriores). Output literal en [`docs/internal/BASELINE-CIERRE.md`](docs/internal/BASELINE-CIERRE.md).

## TL;DR

**Production-ready en código.** Todas las puertas técnicas que se pueden ejecutar en sandbox están en VERDE. Las puertas que requieren DB/server vivo (build E2E, Discord, booking, security curl) deben verificarse en Replit/Hostinger con el comando documentado en [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md). Trabajo editorial multi-semanal pendiente listado en [`PENDING-FINAL.md`](PENDING-FINAL.md).

---

## Por área — verificado hoy

| Área | Estado | Comando | Output literal |
|---|---|---|---|
| **TypeScript strict** | ✅ EXIT 0 | `cd exentax-web && npx tsc --noEmit --strict` | 0 errores |
| **i18n consistency** | ✅ PASS | `cd exentax-web && npm run i18n:check` | 0 missing · 0 extra · 0 empty · 0 placeholder · 0 structure · 1 possibly-untranslated (no-bloqueante) |
| **Blog validation (13 puertas)** | ✅ 13/13 OK | `cd exentax-web && npm run blog:validate-all` | content-lint · internal-links · locale-link-leak · cta · data · sources · faq-jsonld · sitemap · sitemap-bcp47 · masterpiece-audit · seo-llm-readiness · blog-cluster-audit |
| **SEO internal links** | ✅ OK | `cd exentax-web && npm run seo:check` | 0 broken links · 112 articles ≥ 3 inbound links |
| **SEO meta SSR** | ✅ PASS | `cd exentax-web && npm run seo:meta` | 6 langs · 0 errors · 0 warnings · 0 dups · pages=14 subpages=5 blog=112 por idioma |
| **SEO slash hygiene** | ✅ Clean | `SEO_SLASH_SKIP_LIVE=1 npm run seo:slash` | 0 violaciones (live scan in production verifica sitemap real) |
| **Typography Regla 0** | ✅ 0 violaciones | `node scripts/check-typography-rule0.mjs` | TS/TSX + CSS clean |
| **Brand casing** | ✅ Clean | `node scripts/brand-casing-check.mjs` | 0 "ExenTax" en client/server/shared/scripts/docs |
| **PT-PT (no brasileñismos)** | ✅ Clean | `node scripts/audit-pt-pt.mjs` | 114 ficheros pt + bloques pt-de-1-multilocale |
| **Redirects 301 legacy** | ✅ 9/9 | `cd exentax-web && npm run test:redirects` | duration ~33ms · 0 fail |
| **Geo middleware (IP→country)** | ✅ 12/12 | `cd exentax-web && npm run test:geo` | duration ~8s · 0 fail |
| **Audit conversion 112×6** | ⚠ 0/672 baseline | `cd exentax-web && npm run audit:conversion` | 175 agenda gaps · 669 tel-WA gaps · 654 LLC-subpage gaps · 37 ITIN-subpage gaps · 4 weak-copy hits → ver [`PENDING-FINAL.md`](PENDING-FINAL.md) |
| **npm audit (vulnerabilities)** | ⚠ 4 moderate (devOnly) | `cd exentax-web && npm audit` | drizzle-kit → @esbuild-kit/esm-loader chain. No high/critical. `npm audit fix` requires `--force` (breaking). |

---

## Sandbox-blocked (verificar en Replit/Hostinger)

| Área | Comando | Por qué bloqueado en sandbox |
|---|---|---|
| **Build production E2E** | `cd exentax-web && npm run build` | `public.test.ts` importa `server/db.ts` que requiere `DATABASE_URL` |
| **Health endpoint** | `curl -s http://localhost:5000/api/health/ready` | Sin server vivo en sandbox |
| **Discord bot live** | Slash commands `/agenda` `/cita` `/ayuda` | Requiere `DISCORD_BOT_TOKEN` + interactions endpoint |
| **Booking flow** | `POST /api/bookings/book` | Requiere DB + Calendar/Meet APIs |
| **Calculator API** | `POST /api/calculator-leads` | Requiere DB |
| **Security headers** | `curl -I http://localhost:5000/` | Requiere server |
| **Rate limiting** | 200+ rapid requests | Requiere server |
| **Sitemap.xml live** | `curl /sitemap.xml` | Requiere server |
| **Robots.txt live** | `curl /robots.txt` | Requiere server |
| **IndexNow ping** | `cd exentax-web && npm run test:indexnow` | Requiere server externo accesible |
| **Lighthouse CI** | `npx lhci autorun` | Requiere server vivo |
| **Playwright E2E** | `cd exentax-web && npm run test:e2e` | Requiere browsers + server |
| **Test:newsletter / test:booking / test:discord-neon** | `cd exentax-web && npm run test:newsletter` | Requiere Postgres real |

Estado conocido: **estos pasaron en Replit con DB real** según `docs/internal/PENDING.md §G5`. Para producción, confirmar uno-a-uno post-deploy según [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md).

---

## Métricas del proyecto

| Métrica | Valor |
|---|---|
| Artículos blog | 112 slugs × 6 idiomas = **672 ficheros TS** |
| Páginas servicio | 4 LLC (NM/WY/DE/FL) + 1 ITIN, 6 idiomas = 30 rutas |
| Claves i18n | ~1552 keys × 6 idiomas (`client/src/i18n/locales/{lang}.ts`) |
| Tablas BD | 10 (Drizzle ORM, schema en `shared/schema.ts`) |
| Scripts npm | 84 (`exentax-web/package.json`) — 1 archivada, 83 vivas |
| Tests automáticos en `check` | 13 puertas (TS + 12 tests) |
| Tests E2E Playwright | 3 specs (booking · calculator · lang-switch) |
| Workflows CI | 1 (Lighthouse, `.github/workflows/lighthouse.yml`) |
| Docs internas | 291 ficheros .md (gobernanza + auditorías históricas) |

---

## Cambios aplicados en sesión 2026-04-27 (cierre)

| Cambio | Verificación |
|---|---|
| **Strip review-anchor blocks** filtrados a producción (60 ficheros DE/EN/FR/PT/CA × 10 slugs) | `grep -rln "exentax:review-anchor" exentax-web/client/src/data/blog-content` → 0 |
| **Fix tsx binary resolution** en `scripts/build.ts` (3 callsites) — fallback `resolveTsxBin()` ROOT/WORKSPACE | Build pasa el step "tsx-not-found"; el siguiente bloqueo es DATABASE_URL (esperado en sandbox) |
| **Move 4 stray reports** root → `docs/audits/historical/` con refs actualizadas | `ls *.md` solo deja README/CHANGELOG/replit + 5 docs consolidados |
| **5 docs consolidados** raíz: PRODUCTION-STATUS · PENDING-FINAL · WHAT-NOT-TO-TOUCH · PRODUCTION-CHECKLIST · CIERRE-PROYECTO-FINAL | Este fichero es uno de ellos |
| **BASELINE-CIERRE.md** materializado en `docs/internal/` con outputs reales de las 12 puertas | `ls docs/internal/BASELINE-CIERRE.md` |

---

## Verificación reproducible end-to-end

```bash
cd /home/user/exentax-web-new/exentax-web

# 1. TypeScript strict
npx tsc --noEmit --strict
# expected: EXIT 0

# 2. Blog validation (13 puertas)
npm run blog:validate-all
# expected: "blog-validate-all: OK (13 steps)"

# 3. SEO (3 puertas)
npm run seo:check
# expected: "0 broken internal blog links · 112 articles ≥ 3 inbound links"
npm run seo:meta
# expected: "PASS: 0 error(s), 0 warning(s) across 6 languages"
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash
# expected: "slash-hygiene: clean"

# 4. Lints (3 puertas)
node scripts/check-typography-rule0.mjs
node scripts/brand-casing-check.mjs
node scripts/audit-pt-pt.mjs
# expected: cada uno EXIT 0 + mensaje OK

# 5. Tests Node
npm run test:redirects
# expected: "9/9 pass"
npm run test:geo
# expected: "12/12 pass"

# 6. i18n
npm run i18n:check
# expected: "Result: PASS ✓"

# 7. Audit conversion (informational)
npm run audit:conversion
# expected: "audit-conversion-112x6: 0/672 fully conversion-grade · ..."
```

Cualquier desviación → ver [`PENDING-FINAL.md`](PENDING-FINAL.md) §"Diagnóstico" o re-ejecutar contra commit `git log --oneline -1` en estado conocido verde.
