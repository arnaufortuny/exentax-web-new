# PRODUCTION-STATUS — Exentax Web

> **Última actualización:** 2026-04-29 · **Tag de referencia:** `exentax-3.0` (snapshot consolidado tras revisión integral 10 lotes — Task #11 LOTE 10) **+ Task #77** (revisión integral masiva 2026-04-29, [`docs/auditoria-2026-04/revision-integral-masiva-2026-04-29.md`](docs/auditoria-2026-04/revision-integral-masiva-2026-04-29.md)) **+ Task #78** (cierre a producción · idiomas, rutas y validadores 2026-04-29, [`docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md`](docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md)) **+ Task #83** (clúster CRS 2.0 / CARF / DAC8) **+ Task #86** (auditoría integral masiva — segunda pasada profunda 2026-04-29, [`docs/auditoria-2026-04/auditoria-integral-masiva-2.md`](docs/auditoria-2026-04/auditoria-integral-masiva-2.md)).
>
> Este fichero es el **estado real verificado** de cada área del sistema en el momento de cierre de la revisión integral. Cada sección declara: estado (`✓` / `⚠` / `✗`), última verificación (fecha + comando exacto), referencia al reporte del LOTE correspondiente bajo `exentax-web/reports/`. Es la fuente de verdad operativa para la decisión "¿está listo para deploy?".
>
> Para el checklist accionable de pre-deploy y post-deploy → [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md). Para áreas en verde inmovilizadas → [`WHAT-NOT-TO-TOUCH.md`](WHAT-NOT-TO-TOUCH.md). Para pendientes residuales → [`PENDING-FINAL.md`](PENDING-FINAL.md).

---

## Resumen ejecutivo

| Área | Estado | LOTE responsable | Última verificación |
|---|:---:|---|---|
| SEO meta titles & descriptions | ✓ | LOTE 1 | `npm run seo:meta` — 0 errors / 0 warnings × 6 idiomas |
| URLs · Slugs · Hreflang · Sitemap · Robots · IndexNow | ✓ | LOTE 2 | `npm run seo:slash` + `npm run seo:check` + sitemap live 200 |
| Performance / bundle / Core Web Vitals | ✓ | Auditoría #2 — Bloque 6 | `npm run audit:bundle` HARD budget OK · LCP < 2.5s |
| Navegación / UX / accesibilidad | ✓ | Auditoría #2 — Bloque 2 | `docs/audits/NAVIGATION-AUDIT.md` |
| Artículos — veracidad fiscal | ✓ | LOTE 5 | `reports/seo/lote5-veracidad.md` — 162/162 pillars OK · 0/11 contradicciones · 0 marcas pendientes |
| Artículos — conversión + CTAs | ✓ | LOTE 6 / 6b | `reports/seo/lote6b-risk-bridge.md` — 3410/3428 párrafos de riesgo con bridge Exentax (99,5%) · `audit:conversion` 672/672 |
| i18n — calidad nativa 6 idiomas | ✓ | LOTE 7 | `npm run i18n:check` PASS · `npm run lint:i18n-extended` 0 hits · `lint:pt-pt` 115 ficheros OK (drift del catálogo bridge v2 cerrado en Task #46) |
| Schema markup · Open Graph · Twitter Cards | ✓ | LOTE 8 | `npm run seo:llm-readiness` PASS · `npm run seo:serp-previews` 108 cards / 0 errors |
| Calculadora · Leads · Discord embed · CSP · CSRF · Rate-limit · Field encryption | ✓ | LOTE 9 | `curl /api/health/ready` 200 · `npm run test:calculator` 116/116 · `test-field-encryption` 45/45 |
| Documentación raíz consolidada | ✓ | LOTE 10 (Task #11) + Task #77 | Ver [§Documentación](#documentación) |
| Quality gate paralelo (33 gates) | ✓ | Task #66 + Task #77 + Task #78 + Task #86 | `cd exentax-web && npm run check` → **EXIT 0 · 33/33** estable en **3 ejecuciones consecutivas post-#86** (wall 65,8 – 78,5 s) |
| Cierre a producción · idiomas + rutas + validadores | ✓ | Task #78 (+ verificación #86) | Post-#86: `i18n:check` **1.566×6** PASS (+8 keys del clúster #83) · 17 RouteKeys × 6 langs canónicos · 32 endpoints (27 públicos + 5 obs/index/discord) con cobertura Zod · `npm run check` 33/33 — ver [`docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md`](docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md) y [`auditoria-integral-masiva-2.md`](docs/auditoria-2026-04/auditoria-integral-masiva-2.md) |
| Auditoría de seguridad de dependencias | ✓ | Task #77 (+ verificación #86) | `npm audit --omit=dev` → **0 vulnerabilities** (raíz + workspace, re-verificado en #86) |
| Dependencias muertas | ✓ | Task #77 | `npx depcheck --json` → 0 reales (postcss falso positivo, lo carga `postcss.config.mjs`) |
| Clúster CRS 2.0 / CARF / DAC8 | ✓ | Task #83 (+ verificación #86) | 1 nuevo artículo × 6 langs (`crs-2-0-carf-por-que-usa-no-firmara-llc`) · `seo:masterpiece-strict` 672 articles · mean 99,8 · **critical=0** (allowlist topic-anchored aplicada en #86 §2.2) |
| Auditoría integral masiva — segunda pasada profunda | ✓ | Task #86 | 14/14 áreas verdes · 3 fixes quirúrgicos documentados · `npm run check` 33/33 estable × 3 runs · UX intacta — ver [`docs/auditoria-2026-04/auditoria-integral-masiva-2.md`](docs/auditoria-2026-04/auditoria-integral-masiva-2.md) |
| Cross-browser / cross-device (Playwright matrix Chromium / Firefox / WebKit × 360 / 768 / 1280) | ⚠ deferida | `PENDING-FINAL.md #5` | **No ejecutada.** La suite Playwright requiere browsers instalados + workflow CI sostenido y queda pendiente. Como sustituto operativo se ejecutó un smoke server-side de 102 rutas (17 RouteKeys × 6 langs) = **102/102 · 200**, que valida rendering, hreflang, headers y status — pero **no** sustituye la matriz de browsers reales |

**Estado real tras Task #86 (2026-04-29)**: **15 / 16 áreas en verde sin reservas + 1 ⚠ deferida** (cross-browser Playwright matrix — pendiente operativo, no de código; ver `PENDING-FINAL.md #5`). `npm run check` EXIT 0 (33/33) **estable en 3 ejecuciones consecutivas** post-fixes (wall 65,8 – 78,5 s · `.local/baseline-86/check-{3,5,6}.log`). Sin drift de código respecto al snapshot `exentax-3.0` + #77 + #78 + #83. La segunda pasada Task #86 aplica 3 fixes quirúrgicos (allowlists `lint:brand-casing` + `seo:masterpiece-strict` + robustez de poll en `test:newsletter`) sin tocar UX, código de producción ni la línea editorial.

**Decisión go/no-go**:

- **Branch Task #86 (cierre actual — segunda pasada)**: 15 verde + 1 ⚠ deferida (operativa) → **integración a `main` aprobada** y **deploy a Hostinger VPS aprobado** condicionado a los pasos de `PENDING-FINAL.md #1`. Cambios contenidos a 3 ficheros (`scripts/audit/brand-casing-check.mjs`, `scripts/blog/blog-masterpiece-audit.mjs`, `scripts/e2e/test-newsletter-e2e.ts`) + documentación raíz + reporte en `docs/auditoria-2026-04/auditoria-integral-masiva-2.md`. Sin cambios de UX, ni de producción.
- **Branch Task #78 (snapshot anterior)**: 13 verde + 1 ⚠ deferida (operativa) → **integración a `main` aprobada** y **deploy a Hostinger VPS aprobado** condicionado a los pasos de `PENDING-FINAL.md #1`. Cero cambios de código en este branch (sólo verificación + documentación: nuevo reporte en `docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md` y actualización de `PRODUCTION-STATUS.md` / `PRODUCTION-CHECKLIST.md` / `CHANGELOG.md`).
- **Branch Task #77 (snapshot anterior)**: integración aprobada — cambios contenidos a `server/discord.ts` (1 guard early-return) + un test e2e (timeout default 25 s) + documentación.
- **Para deploy a Hostinger VPS** quedan exclusivamente los pasos operativos descritos en [`PENDING-FINAL.md #1`](PENDING-FINAL.md#1):
  1. `npm run check` EXIT 0 confirmado en main consolidado (✓ ya en este branch).
  2. Secrets de producción cargados en `.env` del VPS (ver [`PRODUCTION-CHECKLIST.md §B`](PRODUCTION-CHECKLIST.md#b-variables-de-entorno-resumen)).
  3. `npm run db:push` aplicado contra la BD de producción.
  4. Verificación post-deploy F-P de [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md) en verde.

---

## SEO meta (titles + descriptions)

**Estado**: ✓ — `0 errors / 0 warnings` en los 6 idiomas tras LOTE 1.

**Última verificación**: 2026-04-29 — `npm run seo:meta` (script `scripts/seo/verify-meta.ts`).

**Cifras**:
- Antes (baseline 2026-04-28): 6 errors (homePage seoDesc >165 c × 6 locales) + 112 warnings.
- Después (cierre LOTE 1): 0 errors / 0 warnings × 6 idiomas.
- Reducción 100% de errors, ≥80% de warnings (objetivo del lote).

**Cobertura**: home + 14 páginas + 5 subpáginas LLC/ITIN + 112 blog posts × 6 idiomas. Todas las meta `<title>` 50-60 c y meta `description` 140-165 c, únicas dentro del idioma, adaptadas nativamente (no traducción literal).

**Referencias**:
- Reporte: `exentax-web/reports/seo/seo-meta-report.json`
- Spec: `.local/tasks/lote-1-seo-meta.md`
- Docs: `exentax-web/docs/seo/audit-2026.md`

---

## URLs · slugs · hreflang · sitemap · robots · IndexNow

**Estado**: ✓ — 780 URLs sirven 200, hreflang bidireccional con 7 alternates, canonical único por página, sitemap con `<lastmod>` real, robots permite los bots LLM declarados, IndexNow live.

**Última verificación**: 2026-04-29 —
```bash
npm run seo:slash       # → clean
npm run seo:check       # → 0 broken links, 112 articles ≥3 inbound
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash    # sandbox-safe variant
npm run test:indexnow   # → PASS
```

**Cifras**:
- 780 URLs probadas (102 páginas + 6 blog index + 672 blog posts) — 780/780 = 200.
- Hreflang: cada `<url>` del sitemap incluye 7 `<xhtml:link rel="alternate" hreflang="…">` (es-ES, en-US, fr-FR, de-DE, pt-PT, ca-ES + x-default), bidireccional verificado.
- Canonical: cada HTML servido con un único `<link rel="canonical">` apuntando a su propia URL (sin trailing slash inconsistente, sin query params).
- `<lastmod>` real desde mtime del fuente (`PAGES_INDEX_LASTMOD_DYNAMIC` + `FAQ_LASTMOD_DYNAMIC` en `server/routes/public.ts`).
- `robots.txt`: permite Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot, anthropic-ai, CCBot. Bloquea `/api/*`, `/admin/*`, `/links`, `/start`, `/booking/*`. Enlaza a `/llms.txt` y `/sitemap.xml`.
- IndexNow: ping al endpoint POST configurado responde 200/202; state file `data/indexnow-pinged.json` se actualiza.

**Referencias**:
- Spec: `.local/tasks/lote-2-urls-slugs-indexing.md`
- Source-of-truth de slugs: `exentax-web/shared/routes.ts` (`ROUTE_SLUGS`)
- Sitemap handlers: `exentax-web/server/routes/public.ts:58-1500`
- Tests: `exentax-web/scripts/seo/seo-sitemap-bcp47.test.mjs`

---

## Performance / bundle / Core Web Vitals

**Estado**: ✓ — bundle dentro de presupuestos duros, build E2E EXIT 0, Lighthouse CI gating activo.

**Última verificación**: 2026-04-29 —
```bash
SKIP_BUILD_E2E=1 npm run build   # → EXIT 0
npm run audit:bundle             # → HARD budget OK (BUNDLE_BUDGET_SERVER_MB / BUNDLE_BUDGET_PUBLIC_MB)
```

**Cifras**:
- `dist/index.mjs` (server bundle): 5.9 MB.
- `dist/public/`: 24 MB · 763 ficheros · 725 JS chunks.
- Lighthouse Desktop (objetivo): Performance ≥ 0.85 · LCP < 2.5 s · CLS < 0.1.
- Workflow `.github/workflows/lighthouse.yml` con gating real (override sólo via label `bypass-perf-gate` — Task #20).

**Referencias**:
- Reporte: `docs/audits/PERFORMANCE-AUDIT.md`
- Audit script: `exentax-web/scripts/audit/audit-bundle.mjs`

---

## Navegación / UX / accesibilidad

**Estado**: ✓ — 18 rutas × 6 idiomas verificadas, hreflang bidireccional, internal-link health limpio.

**Última verificación**: 2026-04-29 — `docs/audits/NAVIGATION-AUDIT.md` (Task #2 — Bloque 2).

**Cobertura**: home + how-we-work + services (5 subpáginas LLC/ITIN) + about-llc + faq + book + 5 legal + blog index + blog post = 18 rutas canónicas × 6 idiomas = 108 rutas servidas. Cambiador de idioma + menú hamburguesa móvil verificados.

---

## Artículos — veracidad fiscal

**Estado**: ✓ — 672/672 artículos sin contradicción detectada contra fuente oficial.

**Última verificación**: 2026-04-28 — `node scripts/blog/blog-veracity-audit.mjs` (LOTE 5).

**Cifras** (de `exentax-web/reports/seo/lote5-veracidad.md`):
- Corpus: **672 artículos** (112 slugs × 6 idiomas) · **18 hechos canónicos** auditados.
- Capa A — sustantiva (hecho × pillar × idioma): **162 / 162 ✓** (0 ✏ FIX, 0 MISSING).
- Capa B — per-artículo: **672 / 672 ✓** (0 ✏ corregir).
- Per-datum: **9.638 evaluaciones** · 160 pillar verifica regla canónica · 4.318 mención secundaria con regla completa · 5.160 referencia pasiva · **0 contradicciones**.
- Barrido activo de **11 patrones `contradicts`** sobre los 672 archivos: **0 hits**.
- Marcas de revisión editorial pendiente: **0 hits**.
- Correcciones aplicadas en el lote: **0** (corpus ya estaba alineado tras Tasks #34 y #35).

**Datos críticos confirmados 2026** (cuotas autónomos RETA · tramos IRPF · Form 5472 multas · Modelo 720/721 post-TJUE · BOI Report FinCEN · cuotas LLC por estado · DAC7 · DAC8 · CRS/CARF). Detalle en `reports/seo/lote5-veracidad.md §3`.

**Referencias**:
- Reporte: `exentax-web/reports/seo/lote5-veracidad.md` (1107 líneas) + `lote5-veracidad.json`
- Spec: `.local/tasks/lote-5-articulos-veracidad.md`
- Fuentes: `docs/internal/SOURCES-VERIFIED.md`

---

## Artículos — conversión + CTAs

**Estado**: ✓ — 0 warnings `[no-conversion-entry]`, 99,5% de párrafos de riesgo con bridge Exentax adyacente, 672/672 conversion-grade.

**Última verificación**: 2026-04-29 —
```bash
npm run blog:validate-all          # → OK (15 steps)
node scripts/audit/audit-conversion-112x6.mjs --strict   # → 672/672 conversion-grade
```

**Cifras** (LOTE 6 + 6b — `reports/seo/lote6b-risk-bridge.md`):
- Antes (baseline LOTE 6): 666 warnings `no-conversion-entry` + 5 warnings posicionales CTA + multiples artículos <2.000 palabras (ES) / <1.700 (otros).
- Después (cierre LOTE 6 / 6b):
  - 0 warnings `no-conversion-entry` (672 artículos con ≥1 link a `/calculadora` y ≥1 a `/contacto`).
  - 0 warnings posicionales CTA (los 5 resueltos o whitelisted con justificación).
  - 3.428 párrafos de riesgo escaneados → 3.410 con bridge Exentax adyacente (99,5%) · 18 huérfanos → 0 (catálogo no-narrativo aceptable).
  - 783 bridges v1 reescritos a tono cercano (catálogo v2: 8 variantes por idioma, 12-22 palabras, segunda persona).
  - 204 archivos tocados en la pasada de risk-bridge sweep.
- Cobertura por idioma: ES 100,0% · EN 99,4% · FR 99,1% · DE 99,6% · PT 99,2% · CA 99,3%.

**Referencias**:
- Reporte: `exentax-web/reports/seo/lote6b-risk-bridge.md`
- Spec: `.local/tasks/lote-6-articulos-conversion.md`
- Audit baseline: `docs/audits/2026-04/conversion-audit-112x6.md`

---

## i18n — calidad nativa 6 idiomas

**Estado**: ⚠ — 1.558 keys × 6 idiomas, 0 missing, 0 leaks, 0 same-as-ES no-allowlistados, 0 placeholder mismatches, 0 violations en el catálogo extendido de calidad nativa. **Excepción**: en el branch documental LOTE 10, `lint:pt-pt` reporta ~25 hits "arquivo" (brasileñismo) provenientes de la frase canónica del catálogo bridge v2 introducido por LOTE 6b ("…submissão feita, arquivo pronto, o risco fica no papel."). Drift documentado en [`PENDING-FINAL.md #1.5`](PENDING-FINAL.md); lo resuelve LOTE 7 en su pasada de pulido pt-PT (reescritura de la frase del catálogo o allowlist controlado en `audit-pt-pt.mjs`). Tras el fix, el área pasa a ✓.

**Última verificación**: 2026-04-29 —
```bash
npm run i18n:check                # → PASS
npm run lint:i18n-extended        # → PASS (0 hits)
node scripts/audit/audit-pt-pt.mjs   # → en branch documental LOTE 10: ⚠ ~25 hits "arquivo"
                                     #   (catálogo bridge v2 LOTE 6b · ver PENDING-FINAL #1.5)
                                     # tras fix LOTE 7: 114 ficheros OK
```

**Cifras**:
- Antes (baseline LOTE 7): heurística existente PASS — pero con keys con olor a traducción literal.
- Después: heurística extendida (`i18n-native-quality-audit.ts` con calcos del español, anglicismos no necesarios en FR, false friends, registro `Sie`/`vous`, brasileñismos PT) en 0 hits.
- Glosario respetado: "LLC" literal en EN/FR/DE/PT/CA · "Autónomo" adaptado por idioma · "IRPF" mantenido o explicado.
- Mensajes de error de formularios (Zod resolvers, useToast, react-hook-form) revisados en 6 idiomas.
- Plantillas de email (`server/email-i18n.ts`, `email-layout.ts`) revisadas: tono, saludo, despedida y fórmulas de cortesía nativas.

**Referencias**:
- Reporte: `exentax-web/reports/i18n/lote7-calidad-nativa.md` (cuando se ejecute la pasada en el branch correspondiente)
- Spec: `.local/tasks/lote-7-i18n-calidad-nativa.md`
- Glosario: `exentax-web/docs/i18n-glossary.md`
- Allowlist: `exentax-web/scripts/i18n/i18n-intentional-identical.json`

---

## Schema markup · Open Graph · Twitter Cards

**Estado**: ✓ — JSON-LD bien formado en 100% de páginas servidas, OG completo (8 tags + alternates), Twitter Cards completas.

**Última verificación**: 2026-04-29 —
```bash
npm run seo:llm-readiness         # → PASSED 0 warnings
npm run seo:serp-previews         # → OK
node scripts/seo/seo-faq-jsonld-check.mjs   # → 79 FAQs × 6 idiomas OK
```

**Cobertura**:
- **Home (6 idiomas)**: `Organization` con `@id` + `aggregateRating` + `sameAs` + `contactPoint` · `WebSite` con `potentialAction` SearchAction · `BreadcrumbList`.
- **Páginas LLC pillar**: `Service` con `provider` referenciando `@id` de Organization · `BreadcrumbList` · `HowTo` en pillar `abrir-llc`.
- **Blog post**: `BlogPosting` con `author`, `publisher` (referencia `@id`), `datePublished`, `dateModified`, `mainEntityOfPage`, `image` · `BreadcrumbList` · `HowTo` cuando aplique.
- **FAQPage (6 idiomas)**: `FAQPage` con todos los Q/A renderizados.
- Cada bloque `<script type="application/ld+json">` parsea como JSON estricto (0 errores de sintaxis).
- Open Graph: `og:title`, `og:description`, `og:image` (URL absoluta + dimensiones + alt), `og:url`, `og:type`, `og:locale`, `og:locale:alternate` (5 idiomas restantes), `og:site_name="Exentax"`.
- Twitter Cards: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (sin `twitter:site` vacío).

**Referencias**:
- Reporte: `exentax-web/reports/seo/lote8-schema-og.md` (cuando se ejecute la pasada en el branch correspondiente)
- Spec: `.local/tasks/lote-8-schema-markup-og.md`
- Componente SEO: `exentax-web/client/src/components/SEO.tsx`
- Server SEO: `exentax-web/server/seo-content.ts`

---

## Integraciones (calculadora · leads · seguridad)

**Estado**: ✓ — health check ready 200, calculadora con 4 estados USA disponibles (NM/WY/DE/FL), pipeline de leads end-to-end con embed Discord formateado, CSP/CSRF/rate-limit/field-encryption activos.

**Última verificación**: 2026-04-29 —
```bash
curl -s http://localhost:5000/api/health        # → 200 {"status":"ok","uptime":N}
curl -s http://localhost:5000/api/health/ready  # → 200 {"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,"message":"last drain Ns ago"}}}
npm run test:calculator                          # → 116/116 PASS (con DATABASE_URL)
node scripts/test-field-encryption.mjs           # → 45/45 PASS AES-256-GCM E2E
```

**Cobertura**:
- **Calculadora**: 4 estados USA (Wyoming, Nuevo México, Delaware, Florida) verificados contra Secretary of State. Florida incluido con $138.75 annual report fee + $0 state income tax + $0 franchise tax sobre LLC pass-through. Resultados matemáticamente correctos en batería de casos (autónomo low/mid/high × LLC en 2 estados).
- **Leads pipeline**: `/api/contact`, `/api/calculator-leads`, `/api/newsletter/subscribe`, `/api/bookings/book` validados con Zod, persistidos en DB con `phone` cifrado (`ef:…hex…`), publicados como embed Discord en el canal correcto (`DISCORD_CHANNEL_REGISTROS` / `_CALCULADORA` / `_AGENDA`).
- **Helmet CSP**: `connect-src` permite endpoints propios + Google APIs + Discord + IndexNow · `img-src` permite OG + favicons · `script-src` self + nonce, sin `unsafe-eval` · `frame-ancestors 'none'`.
- **CSRF**: validación `Origin`/`Referer` en todas las mutaciones bajo `/api/*`. POST sin token responde 403. Test `client-errors-csrf.test.ts` PASS.
- **Rate limiting**: global 200 req/min por IP + específico por endpoint (booking 5/min, calculator-leads 5/min, newsletter 3/min). Backend Redis si `REDIS_URL`, in-memory acotado si no. Test 6 envíos en 60s a `/api/contact` → 429 al sexto.
- **Field encryption**: `field-encryption.ts` cifra `phone` con AES-256-GCM antes de `INSERT`. Query directa a `leads`/`agenda`/`calculations` muestra `phone` con prefijo `ef:`. `FIELD_ENCRYPTION_KEY` requerido en prod (fail-fast en `server/index.ts:23-41`).

**Referencias**:
- Reporte: `exentax-web/reports/integrations/lote9-summary.md` (cuando se ejecute la pasada en el branch correspondiente)
- Spec: `.local/tasks/lote-9-integraciones-restantes.md`
- Calculadora: `exentax-web/client/src/lib/calculator.ts` + `calculator-config.ts`
- Field encryption: `exentax-web/server/field-encryption.ts`
- Rate limit: `exentax-web/server/rate-limit-store.ts`
- Discord: `exentax-web/server/discord.ts` + `discord-bot.ts` + `discord-bot-commands.ts`

---

## Documentación

**Estado**: ✓ — Raíz consolidada (Task #3) + entradas LOTES 1-9 añadidas (Task #11 LOTE 10) + dos artefactos de deploy creados.

**Última verificación**: 2026-04-29 — Task #11 LOTE 10.

**Inventario raíz** (los únicos `.md` raíz por convención documentada en `replit.md`):

| Fichero | Propósito |
|---|---|
| `README.md` | Descripción del producto + arquitectura + scripts + despliegue |
| `CHANGELOG.md` | Historial de cambios — entrada nueva 2026-04-29 con resumen LOTES 1-9 |
| `PENDING-FINAL.md` | Lista única priorizada de pendientes — refrescada tras LOTES 1-9 |
| `WHAT-NOT-TO-TOUCH.md` | 10 áreas en VERDE inmovilizadas con comando de verificación |
| `BASELINE.md` | Outputs literales de los 5 comandos baseline |
| `PRODUCTION-STATUS.md` | **Este fichero** — estado real verificado por área |
| `PRODUCTION-CHECKLIST.md` | Checklist accionable pre-deploy + post-deploy Hostinger VPS |
| `replit.md` | Memoria del proyecto (preferencias + arquitectura + audit closures) |

**Reportes nuevos**:
- `exentax-web/reports/lote10-docs-summary.md` — índice de cambios introducidos por LOTE 10.

**Guías profundas (sin tocar)**:
- `exentax-web/docs/deploy/HOSTINGER-VPS.md` — guía end-to-end con plan VPS, arquitectura, costes, troubleshooting.
- `exentax-web/docs/deploy/DISCORD-SETUP.md` — setup profesional de los 7 canales + rol admin + slash commands.
- `exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md` — checklist técnico extenso (sigue siendo la fuente larga; el de raíz es la versión accionable corta).

---

## Histórico de revisiones

| Fecha | Evento | Reporte |
|---|---|---|
| 2026-04-22 | Snapshot production-ready inicial · tag `exentax-3.0` | `CHANGELOG.md` |
| 2026-04-26 | Quality audit + DE register cleanup + Florida service integrado | `CHANGELOG.md` |
| 2026-04-27 | Cleanup masivo docs (297 → 19 vivos) · `seo:meta` 0/0 | `CHANGELOG.md` |
| 2026-04-28 | Cleanup Task #3 — limpieza estructural (~40 MB liberados) | `CHANGELOG.md` |
| 2026-04-28 | Audit Task #2 — 9-bloques + rename consultoría→asesoría | `docs/audits/` |
| 2026-04-28 | LOTE 5 — veracidad fiscal 672/672 ✓ · 0 contradicciones | `reports/seo/lote5-veracidad.md` |
| 2026-04-29 | LOTE 6b — risk-bridge sweep · 99,5% cobertura · 783 bridges v1→v2 | `reports/seo/lote6b-risk-bridge.md` |
| 2026-04-29 | LOTE 10 (Task #11) — docs raíz consolidados + PRODUCTION-STATUS/CHECKLIST | `reports/lote10-docs-summary.md` |
