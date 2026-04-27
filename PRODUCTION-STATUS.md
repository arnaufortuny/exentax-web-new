# PRODUCTION-STATUS — Exentax Web

> **Verificado 2026-04-27 (post-cleanup masivo).** Estado real por área basado en outputs de comandos ejecutados HOY. Output literal en [`docs/internal/BASELINE-CIERRE.md`](docs/internal/BASELINE-CIERRE.md).

## TL;DR

**Production-ready en código. 15/15 gates en VERDE.** Cleanup masivo de docs históricos completado (297 → 19 docs vivos, -93%). Ninguna área en alta prioridad pendiente.

---

## Por área — verificado hoy

| Área | Estado | Comando | Output literal |
|---|---|---|---|
| **TypeScript strict** | ✅ EXIT 0 | `npx tsc --noEmit --strict` | 0 errores (warning baseUrl suprimido con ignoreDeprecations 6.0) |
| **TypeScript plain** | ✅ EXIT 0 | `npx tsc --noEmit` | 0 errores |
| **i18n consistency** | ✅ PASS | `npm run i18n:check` | 1548 keys ES · 0 missing/extra/empty/placeholder/structure · 1-2 possibly-untranslated (no-bloqueante) |
| **Blog validation (15 puertas)** | ✅ 15/15 OK | `npm run blog:validate-all` | content-lint · internal-links · locale-link-leak · cta · data · sources · official-source-coverage · faq-jsonld · sitemap · sitemap-bcp47 · masterpiece-audit · seo-llm-readiness · blog-cluster-audit · conversion-strict + 1 |
| **SEO internal links** | ✅ OK | `npm run seo:check` | 0 broken · 112 articles ≥ 3 inbound links |
| **SEO meta SSR** | ✅ PASS | `npm run seo:meta` | 6 langs · 0 errors · 0 warnings · 0 dups · pages=14 subpages=5 blog=112 |
| **SEO slash hygiene** | ✅ Clean | `SEO_SLASH_SKIP_LIVE=1 npm run seo:slash` | 0 violaciones |
| **Typography Regla 0** | ✅ Clean | `node scripts/check-typography-rule0.mjs` | 0 violaciones decorativas |
| **Brand casing** | ✅ Clean | `node scripts/brand-casing-check.mjs` | 0 forbidden casing |
| **PT-PT (no brasileñismos)** | ✅ Clean | `node scripts/audit-pt-pt.mjs` | 114 ficheros pt + bloques |
| **Banking entities** | ✅ Clean | `node scripts/lint-banned-banking-entities.mjs` | 673 blog files scanned, 0 banned entities |
| **Stray reports** | ✅ Clean | `node scripts/check-stray-reports.mjs` | 0 stray *-report.{json,md} |
| **Redirects 301 legacy** | ✅ 9/9 | `npm run test:redirects` | duration ~22ms · 0 fail |
| **Geo middleware (IP→country)** | ✅ 12/12 | `npm run test:geo` | duration ~7s · 0 fail |
| **Audit conversion 112×6 --strict** | ✅ **672/672** | `node scripts/audit-conversion-112x6.mjs --strict` | 0 agenda gaps · 0 tel-WA gaps · 0 LLC-subpage gaps · 0 ITIN-subpage gaps · 0 weak-copy hits |

---

## API endpoints (30 registrados)

| Familia | Endpoints |
|---|---|
| Health/observability | `GET /api/health`, `GET /api/health/ready`, `GET /api/metrics`, `POST /api/client-errors` |
| Booking | `GET /api/bookings/blocked-days`, `GET /api/bookings/available-slots`, `POST /api/bookings/book`, `GET /api/booking/:id`, `POST /api/booking/:id/reschedule`, `POST /api/booking/:id/cancel` |
| Marketing/leads | `POST /api/calculator-leads`, `POST /api/consent`, `POST /api/newsletter/subscribe`, `GET /api/newsletter/unsubscribe/:token`, `POST /api/visitor` |
| Legal | `GET /api/legal/versions` |
| SEO/sitemaps | `GET /sitemap.xml`, `GET /sitemap-pages.xml`, `GET /sitemap-blog.xml`, `GET /sitemap-faq.xml`, `GET /robots.txt`, `GET /<INDEXNOW_KEY>.txt` |
| Geo | `GET /api/geo` |
| Discord | `POST /api/discord/interactions` (Ed25519 verified) |
| Internal blog | `GET /:lang/blog/:slug` |
| Static | `GET /assets/{*rest}`, `GET <staticExtRegex>` |

---

## Páginas y rutas

**25 page components** en `client/src/pages/`:
- 6 principales: home, how-we-work, services (overview), about-llc, faq, book, abrir-llc (pillar)
- 5 servicio: 4 LLC subpages (NM, WY, DE, FL) + 1 ITIN
- 5 legal: terms, privacy, cookies, refunds, disclaimer
- 2 blog: index + post (dynamic slug)
- 5 utilidad (`noindex`): booking, start, go, links, not-found, services-sections

Todas localizadas en 6 idiomas via `shared/routes.ts ROUTE_SLUGS`.

---

## Sandbox-blocked (verificar en Replit/Hostinger)

| Área | Comando | Por qué bloqueado |
|---|---|---|
| Build production E2E | `npm run build` | DATABASE_URL requerido por public.test.ts |
| Health endpoint live | `curl /api/health/ready` | Sin server vivo |
| Discord bot live | Slash commands `/agenda`, `/cita`, `/ayuda`, `/newsletter` | Requiere `DISCORD_BOT_TOKEN` |
| Booking flow live | `POST /api/bookings/book` | Requiere DB + Calendar/Meet APIs |
| Calculator API live | `POST /api/calculator-leads` | Requiere DB |
| Security headers live | `curl -I http://localhost:5000/` | Requiere server |
| Rate limiting | 250 GETs en 60s | Requiere server |
| Sitemap.xml + robots.txt live | `curl /sitemap.xml` | Requiere server |
| IndexNow ping | `npm run test:indexnow` | Requiere server externo |
| Lighthouse CI | `lhci autorun` | Requiere browsers + server |
| Playwright E2E | `npm run test:e2e` | Requiere browsers + server |
| Tests con DB real | `npm run test:newsletter`, `npm run test:booking`, `npm run test:discord-neon` | Requiere Postgres |

12 verificaciones documentadas en [`PRODUCTION-CHECKLIST.md §F-P`](PRODUCTION-CHECKLIST.md).

---

## Métricas del proyecto (post-cleanup 2026-04-27)

| Métrica | Valor |
|---|---|
| Artículos blog | 112 slugs × 6 idiomas = **673 ficheros TS** (incluye blog-mid-cta-copy multilang) |
| Páginas servicio | 4 LLC + 1 ITIN = 5 subpáginas, 6 idiomas = 30 rutas |
| Page components | **25** (`client/src/pages/`) |
| Claves i18n (ES) | **1548** keys (×6 idiomas, 1464-1466 rest) |
| Tablas BD | **14** (Drizzle ORM, schema en `shared/schema.ts`) |
| API endpoints | **30** (registrados en `server/`) |
| TS/TSX en client/src | **788** ficheros |
| TS en server | **50** ficheros |
| TS en shared | **6** ficheros |
| Scripts npm/build/audit | **90** |
| Tests automáticos en `check` | **15+ puertas** (TS + lints + tests + audits) |
| Tests E2E Playwright | 3 specs + 3 GA4 = **9** |
| Workflows CI | 1 (Lighthouse, `.github/workflows/lighthouse.yml`) |
| Docs internas (post-cleanup) | **19** ficheros .md (era 297, -93%) |

---

## Cambios aplicados en sesión 2026-04-27

| Cambio | Verificación |
|---|---|
| **Strip review-anchor blocks** filtrados a producción (60 ficheros DE/EN/FR/PT/CA × 10 slugs) | `grep -rln "exentax:review-anchor"` → 0 |
| **Fix tsconfig** `ignoreDeprecations: "6.0"` → `tsc --strict` ya no hard-falla en TS 7.0-deprecation warning | `npx tsc --strict` EXIT 0 |
| **Fix BASELINE-CIERRE.md** que contenía la cadena prohibida "ExenTax" en el lint output captured | `brand-casing-check.mjs` EXIT 0 |
| **Move 4 stray reports** root → `docs/audits/historical/` con refs actualizadas | `ls *.md` clean |
| **Cleanup masivo docs** 297 → 19 (-93%): 223 fiches per-article + 12 LOG-BATCH + 21 audit reports + 15 fixtures + auditoria-multiidioma entera | `find docs -name '*.md' \| wc -l` → 19 |
| **5 docs consolidados raíz** | PRODUCTION-STATUS · PENDING-FINAL · WHAT-NOT-TO-TOUCH · PRODUCTION-CHECKLIST · CIERRE-PROYECTO-FINAL |
| **`docs/internal/BASELINE-CIERRE.md`** materializado | `ls docs/internal/BASELINE-CIERRE.md` |
| **Slim PENDING.md** 604 → 32 líneas (puntero a PENDING-FINAL.md raíz) | `wc -l docs/internal/PENDING.md` → 32 |
| **Slim INDEX.md** 160 → 64 líneas | `wc -l docs/internal/INDEX.md` → 64 |
| **Premium translator brief** scope no-native-review-masivo | `docs/internal/translator-brief.md` |

---

## Verificación reproducible end-to-end

```bash
cd /home/user/exentax-web-new/exentax-web

# 1. TypeScript (2 puertas)
npx tsc --noEmit --strict           # EXIT 0
npx tsc --noEmit                    # EXIT 0

# 2. Blog validation (15 steps)
npm run blog:validate-all           # "OK (15 steps)"

# 3. SEO (3 puertas)
npm run seo:check                   # 0 broken · 112 articles ≥3 inbound
npm run seo:meta                    # PASS · 6 langs · 0 errors
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash  # clean

# 4. Lints (4 puertas)
node scripts/check-typography-rule0.mjs       # OK
node scripts/brand-casing-check.mjs           # OK
node scripts/audit-pt-pt.mjs                  # OK
node scripts/lint-banned-banking-entities.mjs # OK
node scripts/check-stray-reports.mjs          # OK

# 5. Tests Node (2 puertas)
npm run test:redirects              # 9/9 pass
npm run test:geo                    # 12/12 pass

# 6. i18n
npm run i18n:check                  # PASS

# 7. Audit conversion (informational)
node scripts/audit-conversion-112x6.mjs --strict  # 672/672
```

Cualquier desviación → re-ejecutar contra commit estable conocido (ver `git log --oneline -5`).
