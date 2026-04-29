# Changelog

Todos los cambios notables de este repositorio se documentan aquí.
Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased] — 2026-04-29 — Cierre a producción · calidad i18n, keys, rutas y validadores · 2.ª pasada (Task #87)

> Segunda pasada del cierre Task #78 (i18n, rutas/slugs/hreflang, validadores Zod) sobre el snapshot consolidado tras Task #86. Re-ejecución del contrato de cierre con los mismos gates exigentes y bajo carga real (runner paralelo `npm run check` de 33 gates), **3 ejecuciones consecutivas estables**. **1 fix quirúrgico** aplicado tras detectar un falso positivo legítimo en `lint:brand-casing`. Sin reescrituras especulativas, **sin cambios de UX**, sin tocar código de producción / traducciones / slugs / validadores. Reporte ejecutivo: [`docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2-2026-04-29.md`](docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2-2026-04-29.md).

### Decisión

**GO** — apto para integración a `main` y deploy a Hostinger VPS (con los pasos operativos de `PENDING-FINAL.md #1`). Sistema permanece en estado de cierre tras la 2.ª pasada del cierre i18n/rutas/validadores.

### Bug real arreglado (1 — quirúrgico)

- **`exentax-web/scripts/audit/brand-casing-check.mjs` — falso positivo `lint:brand-casing` en `docs/auditoria-2026-04/auditoria-integral-masiva-2.md` y, recursivamente, en el propio reporte de cierre de esta task.** El reporte ejecutivo de Task #84/#86 documenta el fix de allowlist que se aplicó al reporte de Task #78 (entrada `cierre-produccion-i18n-rutas-validadores-2026-04-29.md` añadida en Task #86). Por tanto cita la grafía prohibida 4 veces (líneas 35, 37, 41, 103) en celdas de tabla, bullets de causa raíz, output literal del lint y etiqueta de verificación. A su vez, el reporte de cierre de Task #87 documenta este nuevo fix y replica la grafía prohibida 8 veces. La grafía es legítima: refiere al *objetivo de la regla*, no a la marca — exactamente igual que ya hacían `docs/internal/*` (8 ficheros), los `historical/2026-04-27-*` (3 ficheros) y el reporte de cierre de Task #78. **Fix**: añadidas 2 entradas nuevas en `ALLOWLIST` (`auditoria-integral-masiva-2.md` + `cierre-produccion-i18n-rutas-validadores-2-2026-04-29.md`) con comentarios explicativos in-line. No se modifica texto de ningún reporte. Cualquier otra ocurrencia de `ExenTax` fuera de la allowlist sigue contando como violación.

### Verificación post-fix (entorno Replit, dev server `:5000`)

- **Quality gate consolidado**: `cd exentax-web && npm run check` → **EXIT 0 · 33/33 · estable en 3 ejecuciones consecutivas** (`.local/baseline-87/check-{3,4,5}.log` · wall 73,0 / 66,0 / 78,0 s).
- **TypeScript estricto**: `npx tsc --noEmit --strict` → 0 errores (`.local/baseline-87/tsc-strict.log`).
- **Seguridad de dependencias**: `npm audit --omit=dev` → **0 vulnerabilities** (raíz `.local/baseline-87/npm-audit-root2.log` + workspace `.local/baseline-87/npm-audit-ws.log`).
- **i18n**: `npm run i18n:check` → **1.566 keys × 6 langs** PASS (Δ=0 vs Task #86) · 783 ficheros escaneados · 0 hardcoded · 0 placeholder mismatches · `lint:typography` 0 violaciones · `lint:pt-pt` 115 ficheros OK · `lint:brand-casing` 0 ocurrencias `ExenTax` (post-allowlist §2.1) · `lint:i18n-extended` 0 hits.
- **Rutas / SEO**: `seo:check` 0 broken · `seo:slash` clean · `seo:meta` 0 errors / 0 warnings · `seo:masterpiece-strict` 672 articles · mean 99,8 · **critical=0** · `seo:serp-previews` 108 cards / 0 errors · `test:redirects` 9/9 · `test:geo` 12/12 · `test:indexnow` 10/10. 17 RouteKeys × 6 idiomas canónicos sin cambios vs Task #78.
- **Validadores Zod**: **31 endpoints públicos únicos (path × método)** inventariados a 2026-04-29: **26 en `server/routes/public.ts`** (drift +3 vs Task #78 que reportó 23 — los 3 nuevos endpoints añadidos en tasks intermedias #83/#86 ya heredan el mismo patrón Zod) + 1 (`index.ts`) + 3 (`observability.ts`) + 1 (`discord-bot.ts`). **13 mutaciones totales** (11 POST `public.ts` + 1 POST `observability.ts` + 1 POST `discord-bot.ts`) **13/13 con validación**: 9 strict Zod + 2 unsubscribe RFC 8058 + 1 `clientErrorSchema` + 1 Ed25519. Cobertura: `test:calculator` 123/123 · `test:booking` 54/54 · `test:newsletter` 55/55 · `test:discord-regression` 6/6 (3 scripts · 72/72 e2e — confirmado en run aislado `.local/baseline-87/discord-e2e-isolated.log`).
- **Blog**: `blog:validate-all` 19/19 (incluye `seo-llm-readiness`, `blog-cluster-audit`, `conversion-strict`, `risk-bridge`, `official-source-coverage`).
- **Bundle**: `audit:bundle:fast` EXIT 0 (HARD budget OK).
- **Health**: `GET /api/health/ready` `{ ready:true, db.ok, breakers.ok, emailWorker.ok }`.

### Verificación profunda complementaria (deep pass · ad-hoc, adicional a los 33 gates)

Bajo petición explícita de "máxima exhaustividad" en URLs, SEO, indexing, sitemap, rendimiento, navegación, agenda y validadores — **CERO bugs nuevos · CERO regresiones**. Logs literales en `.local/baseline-87/deep-*.log`. Detalle completo en `BASELINE.md` §APÉNDICE.

- **Rutas (102 URLs)**: 0 colisiones de slug · round-trip `getLocalizedPath`↔`resolveRoute` 102/102 · URL safety 102/102 · cambio de idioma `getEquivalentPath` 102/102 · 8/8 edge cases (trailing slash, idioma desconocido, slug inexistente).
- **Sweep HTTP en vivo**: 102/102 → 200 en 2 041 ms · latencia p50/p90/p99/max = 167/268/410/439 ms.
- **i18n a fondo**: 1 566 keys × 6 idiomas · 0 faltantes · 0 vacíos · 0 mismatches de placeholders · 0 mojibake reales (los 7 candidatos PT son `Ç`/`ã`/`á` legítimos del portugués) · 10 mismatches de tags HTML acotados a 4 cuerpos legales largos (variabilidad legítima de traductor) · todos los strings idénticos a `es` están en la lista intencionada.
- **SEO en HTML rendido (102 páginas)**: title/description/canonical/OG/hreflang+x-default 102/102 · 0 noindex · 1 título marginal a 82 chars (`/de/llc-usa-eroeffnen`) · 6 descripciones marginales ~200 chars en pillars LLC.
- **Sitemaps**: cobertura 102/102 RouteKeys + 672 blog + 6 FAQ · hreflang 7 entradas por URL (6 idiomas + x-default) · totales correctos (714 + 4 704 + 42).
- **Robots.txt**: allows explícitos por idioma + 4 sitemaps + GEO/AI bots; disallows en `/api`, `/internal`, `/private`, `/booking`, `/start`, `/go/`, `/links`, `/thank-you`, `/preview/`, `/staging/`, `/dev/`, `/__mockup/` + duplicados con `?utm_*`/`?gclid`/`?fbclid`/`?mc_*`/`?ref=`.
- **Cabeceras**: CSP estricta · X-Frame-Options=SAMEORIGIN · Permissions-Policy con cámara/mic/geo/payment denegados · `X-Robots-Tag: index, follow` · HTTP `Link:` con canonical + 6 hreflang + x-default · `Cache-Control` correcto por tipo (HTML no-store, sitemap 1h, robots 24h, /api/health no-store) · `Vary` activo.
- **Validadores Zod (verificación cruzada con la línea anterior · 31 endpoints únicos / 32 declaraciones)**: 26 pares únicos en `public.ts` (27 declaraciones — la duplicación `GET /:lang/blog/:slug` líneas 290+307 es un pipeline encadenado vía `next()` para consolidación 301 + normalización de slug) · 13 mutaciones · 13/13 cubiertas (9 strict Zod + 2 unsubscribe RFC 8058 con rate-limit/length-guard/idempotencia/no-leak + 1 `clientErrorSchema` + 1 Ed25519). Pruebas black-box: CSRF activo (POST sin Origin → 403 `FORBIDDEN`), Zod `.strict()` rechaza claves extra, errores con `code:VALIDATION_ERROR` y detalles por campo, PII redactada en logs (`phone:"[REDACTED]"`).
- **Agenda happy-path en vivo**: `available-slots` miércoles → 24 slots (08:00-19:30) · sábado → 0 · pasado → 0 · `blocked-days?limit=10` → 200. Suites e2e: `test:booking` 10,4 s OK · `test:newsletter` 10,0 s OK · `test:calculator` 123/123 · `test:geo` 8,3 s OK · `test:indexnow` 10/10.
- **Rendimiento**: `audit:bundle` server 5,62 MB / 7 MB (80,3 %) · public 21,53 MB / 30 MB (71,8 %) · `seo:masterpiece-strict` 672 articles · mean 99,8 · critical=0.
- **Consola del navegador**: limpia (0 errores).
- **Gates dirigidos individuales (re-corrida fuera del runner paralelo)**: `i18n:check`, `seo:check`, `seo:slash`, `seo:meta`, `lint:typography`, `lint:pt-pt`, `lint:banking-entities`, `lint:email-deliverability` (10 sendEmail · 7 booking · 13 CTAs UTM · 78 subjects spam-checked), `lint:stray-reports`, `test:redirects`, `test:no-inline-related`, `test:masterpiece-audit` 61/61, `test:masterpiece-audit-rules` 43/43, `test:audit-faqs` 57/57+11/11, `test:risk-bridge-inject` 111/111, `test:lint-blog` 38/38, `test:bundle-diff-notify`, `test:perf-gate-bypass-notify`, `test:seo-check`, `test:seo-slash` → todos EXIT 0.

### Documentos actualizados

- `replit.md` — añadida entrada "Audit Task #87 — 2026-04-29 (cierre i18n/rutas/validadores · 2.ª pasada)" al inicio del bloque de cierres.
- `BASELINE.md` — añadida sección `## FINAL VERIFICATION — 2026-04-29 (Task #87)` con tabla de comandos verificados (15 filas).
- `PRODUCTION-STATUS.md` — header actualizado a Task #87 + nueva fila en el resumen ejecutivo (cierre i18n/rutas/validadores 2.ª pasada) + actualización de filas existentes (quality gate paralelo, cierre a producción, auditoría de seguridad) + decisión go/no-go re-emitida (16/17 áreas en verde + 1 ⚠ deferida).
- `PRODUCTION-CHECKLIST.md` — sección `Pre-flight` actualizada a Task #66 + #77 + #78 + #86 + #87 con los nuevos comandos / wall times / .local paths verificados.
- `PENDING-FINAL.md` — header actualizado para reflejar Task #87 (P0 sigue vacío; sin nuevos tickets generados).
- `docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2-2026-04-29.md` — reporte ejecutivo nuevo (~250 líneas) con tabla de re-verificación contra contrato Task #78, comparación contra #77/#78/#86, evidencia literal y comandos reproducibles.

### Limpieza estructural complementaria · 4.ª pasada (2026-04-29)

Pasada exhaustiva adicional sobre el snapshot consolidado tras la 3.ª pasada, alineada con el contrato `WHAT-NOT-TO-TOUCH.md` (10 áreas protegidas) y consolidando el cleanup masivo previo de Task #12 (`REVISION-FINAL-REPORT.md` línea 321: 86 ficheros archivados / 38 MB screenshots / 5 scripts huérfanos del root). Detalle completo en `BASELINE.md` §APÉNDICE D y `docs/audits/codigo-muerto.json` (DC-011 nuevo · DC-004/DC-006/DC-010 pasados a `verificado`).

**Eliminaciones quirúrgicas (4 elementos · 4.719 B + 2 carpetas vacías)**:
- `attached_assets/Pasted-LOTE-5-ART-CULOS-CALIDAD-VERACIDAD-lee-cada-art-culo-co_1777396578147.txt` (2.194 B, gitignored, 0 referencias en repo, paste artifact reaparecido tras Task #12).
- `attached_assets/Pasted--13-Objective-Housekeeping-refactor-split-the-two-monol_1777404359112.txt` (2.525 B, gitignored, 0 referencias en repo, paste artifact post-#12).
- `.local/baseline-87/deep/` (carpeta vacía accidentalmente creada en la 2.ª pasada — los 9 logs `deep-*.log` viven directamente en `.local/baseline-87/`).
- `uploads/docs/` (carpeta vacía) **eliminada de verdad** tras verificar que **0 código la lee/escribe**. Era un efecto colateral de `mkdir -p uploads/docs` en `exentax-web/scripts/build.ts:219` (el `recursive: true` creaba toda la cadena `uploads/` + `docs/`, pero quien tiene función real es la carpeta padre `uploads/`). Cambio quirúrgico aplicado en `build.ts` línea 222: `"uploads/docs"` → `"uploads"` (1 línea, sin afectar runtime). La carpeta padre `uploads/` se sigue regenerando idempotentemente; `uploads/docs/` no se vuelve a crear nunca.

**Conservaciones explícitas verificadas**:
- `uploads/` (carpeta padre, vacía tras la limpieza) **CONSERVADA** porque (a) `exentax-web/scripts/build.ts:222` la regenera idempotentemente (`mkdir -p uploads`) en cada build y (b) sigue siendo el target del **bloqueo HTTP `app.use("/uploads", ...) → 403`** en `server/index.ts:202` (impide servir cualquier fichero subido accidentalmente). El subpath hermano `uploads/reports/indexing/` (NO `uploads/docs/`) es el verdadero `INDEXING_REPORTS_DIR` usado por `seo-indexing-publish.mjs` (Task #26) y servido en `/internal/reports/indexing/:file` por `server/routes/public.ts:1554-1580`. La documentación inicial de la 4.ª pasada confundía estos dos subpaths; queda corregida.
- `dist/index.cjs` (raíz) **CONSERVADO** como deploy shim referenciado por `.replit run = ["node", "./dist/index.cjs"]`.
- 8 capturas `exentax-web/docs/screenshots/*.jpg` **CONSERVADAS** porque `docs/audit-design-system.md` líneas 381 y 388 las referencia explícitamente.
- 10 áreas de `WHAT-NOT-TO-TOUCH.md` **intactas**: calculator data layer, server middleware stack, schema BD, Discord types/handlers, i18n locales (1.566 keys × 6), routes canónicas, blog content (672 ficheros), SEO meta + canonical + hreflang, calculadora UI, Lighthouse CI workflow.

**Reconciliación tracker `docs/audits/codigo-muerto.json`** (Task #4 baseline, ahora 100 % cerrado):
- DC-004 (`services-sections.tsx` 4 bloques comentados) → **`verificado`** (archivo actual 506 LOC, 0 bloques `/* */` y 0 `{/* */}` JSX; las 4 líneas restantes son cabecera explicativa de `STATE_CATALOGUE` líneas 80-83).
- DC-006 (28 scripts legacy archivados) → **`verificado`** (`exentax-web/scripts/archive/` ya no existe en disco — borrado por Task #12).
- DC-010 (`[REVISIO MANUAL]` en CA blog) → **`verificado`** (`rg -nP 'REVISIO\s+MANUAL'` → 0 hits).
- DC-011 nuevo → **`aplicado`** (las 3 eliminaciones de esta pasada + las preservaciones documentadas).
- Resumen tracker post-#87: `issues_pendientes=0` (vs 2 antes).

**Verificación post-cleanup**: `lint:stray-reports` EXIT 0 · `seo-orphan-audit.mjs` re-ejecutado → 0/0/0 (sin variación · 780 URLs probadas en 19 s) · `npm run check` 33/33 verde estable (sin regresión) · workflow `Start application` no requirió reinicio (solo eliminaciones físicas de gitignored / vacíos + edits de docs raíz).

### Limpieza estructural complementaria · 5.ª pasada (2026-04-29)

Pasada adicional con foco específico solicitado por el usuario: *"LIMPIA LO QUE NO SIRVE, NO SE USA. NO ES NECESARIO TENER COMPONENTES, RUTAS, ARCHIVOS, ENDPOINTS SIN USO."* Auditoría categoría por categoría sobre el snapshot post-4.ª pasada, contrastando cada candidato contra `WHAT-NOT-TO-TOUCH.md` (10 áreas protegidas). Detalle completo en `BASELINE.md` §APÉNDICE E y `docs/audits/codigo-muerto.json` (DC-012 nuevo).

**Verificación previa (no se tocó nada)**:

- **Componentes** (48 `.tsx` en `client/src/components/**`): 0 huérfanos. Falsos positivos verificados: 5 ficheros del calculator (`AnimatedNumber`, `CalculatorResults`, `EmailGateForm`, `IrpfBracketsTable`, `index.tsx`) son imports relativos `./X` desde el barrel + lazy loaders en `Hero.tsx:9` y `start.tsx:5`; `BrandIcons` importado por `Services.tsx:4` y `start.tsx:10`; `AccordionItem` importado por `FaqAccordionList.tsx:2`. **Calculator UI 100 % intacto** (PROTEGIDO #1 + #9).
- **Hooks / lib / shared / pages**: 0 huérfanos. `calculator-config.ts` (95 exports) validado símbolo-a-símbolo: 91/95 con consumidor real, 4 conservadas como tablas fiscales documentales (PROTEGIDO #1). `services-sections` y `ServiceSubpage` falsos positivos (cargados vía `lazy()` y por 5 subpages de servicios USA).
- **Servidor** (92 ficheros TS): 0 huérfanos productivos. 12 falsos positivos verificados — todos los schedulers (`incomplete-bookings`, `reconcile-zombies`, `retention-purge`, `newsletter-broadcast`, `periodic-reports`) registrados en `server/index.ts:903-953`; `google-credentials.ts`, `google-indexing.ts`, `sitemap-ping.ts` con consumers múltiples.
- **Endpoints**: 0 huérfanos (ya verificado con sweep HTTP 102 URLs + `seo-orphan-audit` 780 URLs en pasadas anteriores).
- **Public assets**: 0 huérfanos. 2 falsos positivos: token GSC `b2c8d9fd...txt` (32 B) y `icon-512.png` (en `site.webmanifest:38`).

**Eliminaciones quirúrgicas (10 ficheros · 84.859 B ≈ 83 KB)** — todos verificados con `rg -lnF <basename> .` excluyendo `node_modules`/`dist` → cero referencias en código activo:

| # | Ruta | Tamaño | Tipo |
|---|---|---:|---|
| 1 | `exentax-web/server/client-errors-csrf.test.ts` | 4.426 B | manual one-shot test (no invocado por `package.json` ni `build.ts` ni CI) |
| 2 | `exentax-web/scripts/audit/auditoria-ci-gate.mjs` | 7.227 B | one-off audit |
| 3 | `exentax-web/scripts/blog/blog-fix-boi-mandatory.mjs` | 6.937 B | one-off blog migration BOI |
| 4 | `exentax-web/scripts/blog/blog-structure-audit.mjs` | 8.030 B | one-off audit (superado por `blog:validate-all` 19 gates) |
| 5 | `exentax-web/scripts/blog/blog-task7-add-calc-link.mjs` | 5.497 B | one-off Task 7 migration |
| 6 | `exentax-web/scripts/blog/blog-preview-numeric-hook-fix.mjs` | 11.437 B | one-off preview fix |
| 7 | `exentax-web/scripts/i18n/fr-accent-restore.mjs` | 25.249 B | one-off i18n FR fix (script ya operó; PROTEGIDO #5 = los locales `fr.ts`, no este script) |
| 8 | `exentax-web/scripts/send-test-emails.ts` | 4.194 B | manual SMTP smoke test (reemplazado por `test:newsletter` + `test:booking`) |
| 9 | `exentax-web/scripts/seo/pad-static-og.mjs` | 4.664 B | one-off OG normalization |
| 10 | `exentax-web/scripts/seo/lote2-crawl-urls.mjs` | 7.198 B | one-off LOTE 2 crawl batch |

**Conservaciones explícitas** (no tocadas pese a aparecer como sospechosas): `server/discord-alerts.test.ts` (10.973 B, manual test no invocado pero adyacente a Discord — PROTEGIDO #4 política conservadora); `scripts/discord/__test-utils.ts` (importado por 2 tests Discord activos); 4 constantes calculator sin consumidor directo (PROTEGIDO #1 — tablas fiscales documentales con wrapper `getIrpfBrackets()` que las cubre).

**Verificación post-cleanup**: `npx tsc --noEmit --skipLibCheck` EXIT 0 · `npm run check` (33/33 gates en paralelo) **EXIT 0 · 33/33 PASS · wall 71,4 s** · workflow `Start application` no requirió reinicio (deletions de tests/scripts manuales no importados por código de producción) · 10 áreas `WHAT-NOT-TO-TOUCH.md` 100 % intactas. Tracker `docs/audits/codigo-muerto.json` actualizado: DC-012 nuevo (`aplicado`); `issues_aplicados` 2 → 3.

## [Snapshot anterior] — 2026-04-29 — Auditoría integral masiva · segunda pasada profunda (Task #86)

> Segunda pasada de auditoría sobre todo el proyecto Exentax Web tras fusionar las Tasks #78 (cierre i18n / rutas / validadores) y #83 (clúster CRS 2.0 / CARF / DAC8). Lectura, verificación y documentación con **3 fixes quirúrgicos** aplicados solo donde se detectó un bug real (sin reescrituras especulativas, **sin cambios de UX**, sin tocar código de producción). Reporte ejecutivo: [`docs/auditoria-2026-04/auditoria-integral-masiva-2.md`](docs/auditoria-2026-04/auditoria-integral-masiva-2.md).

### Decisión

**GO** — apto para integración a `main` y deploy a Hostinger VPS (con los pasos operativos de `PENDING-FINAL.md #1`). Sistema permanece en estado de cierre tras la pasada.

### Bugs reales arreglados (3 — todos quirúrgicos)

- **`exentax-web/scripts/audit/brand-casing-check.mjs` — falso negativo en `ALLOWLIST`.** El reporte de cierre de Task #78 (`docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md`) cita literalmente la salida del lint (`"0 ocurrencias \`ExenTax\`"`) en 3 celdas/bullets explicativos, igual que ya hacían los docs `docs/internal/*` y `exentax-web/docs/audits/historical/2026-04-27-*` que están en `ALLOWLIST`. **Fix**: añadida una entrada con comentario explicativo. No se modifica texto del informe (la grafía prohibida es legítima ahí — refiere al objetivo de la regla, no a la marca).
- **`exentax-web/scripts/blog/blog-masterpiece-audit.mjs` — falso positivo `year-in-prose` por slug topic-anchored.** El nuevo artículo `crs-2-0-carf-por-que-usa-no-firmara-llc` (Task #83) explica la línea temporal regulatoria CRS 2.0 / CARF / DAC8: paquete OCDE 2023, transposición DAC8, aplicación material 1-Ene-2026, primer intercambio efectivo en 2027 sobre datos del ejercicio 2026. Frases como `"Enero 2027 sobre datos 2026"` no encajan en ninguno de los ~50 patrones `LEGAL_CONTEXTS` y el slug no contiene un marcador `-YYYY-` que active la cláusula `slugYearMatch`. Reescribir el cuerpo equivaldría a vaciar el artículo. **Fix**: añadido bloque `TOPIC_ANCHORED_YEARS` (junto a `slugYearMatch`) con la entrada nominativa `crs-2-0-carf-por-que-usa-no-firmara-llc → ["2023", "2026", "2027"]`. Cualquier otro año editorial sigue contando como violación. Comentario in-line documenta el criterio para extensiones futuras (slugs cuyo tema *es* un calendario regulatorio, no como atajo).
- **`exentax-web/scripts/e2e/test-newsletter-e2e.ts` — race intermitente en lectura de `consent_log` bajo concurrencia 6.** El endpoint `POST /api/newsletter/subscribe` escribe `consent_log` en modo fire-and-forget tras devolver 200; el test esperaba 400 ms fijos antes de leer. Bajo el runner paralelo (`audit:bundle` + `blog:validate-all` saturando CPU), 400 ms a veces no alcanzan, causando 4 aserciones rotas (`rows=[]`). **No es un bug de producción** (el usuario no observa `consent_log`), es flakiness del test. **Fix**: sustituido `setTimeout(400)` por poll-and-retry con deadline 6 s e intervalo 200 ms, terminando en cuanto aparece la fila. Camino feliz vuelve <500 ms (idéntico al original); bajo contención tolera hasta 6 s sin perder cobertura.

### Verificación post-fix (entorno Replit, dev server `:5000`)

- **Quality gate consolidado**: `cd exentax-web && npm run check` → **EXIT 0 · 33/33 · estable en 3 ejecuciones consecutivas** (`.local/baseline-86/check-{3,5,6}.log` · wall 65,8 / 78,5 / 69,0 s).
- **TypeScript estricto**: `npx tsc --noEmit` → 0 errores.
- **Seguridad de dependencias**: `npm audit --omit=dev` → **0 vulnerabilities** (raíz + workspace).
- **i18n**: `npm run i18n:check` → **1.566 keys × 6 langs** PASS (+8 keys vs Task #78 por nuevas keys del clúster #83) · 783 ficheros escaneados · 0 hardcoded · 0 placeholder mismatches · `lint:typography` 0 violaciones · `lint:pt-pt` 115 ficheros OK · `lint:brand-casing` 0 ocurrencias.
- **Rutas / SEO**: `seo:check` 0 broken · `seo:slash` clean · `seo:meta` 0 errors / 0 warnings · 0 anglicismos en og+metadata+body sobre fr/de/pt/ca · `seo:masterpiece-strict` 672 articles · mean 99,8 · **critical=0** · `test:redirects` 9/9.
- **Blog**: `blog:validate-all` 19/19 (incluye `seo-llm-readiness`, `blog-cluster-audit`, `conversion-strict`, `risk-bridge`).
- **E2E**: `test:calculator` 123/123 · `test:booking` 54/54 · `test:newsletter` 55/55 (post-fix de poll) · `test:discord-regression` 72/72 (estable post-fix de #2.3).
- **Health**: `GET /api/health` 200 · `GET /api/health/ready` `{ ready:true, db.ok, breakers.ok, emailWorker.ok }`.

### Documentos actualizados

- `replit.md` — añadida entrada "Audit Task #86 — 2026-04-29" antes de la entrada de Task #77.
- `BASELINE.md` — añadida sección `## FINAL VERIFICATION — 2026-04-29 (Task #86)` con tabla de comandos verificados (12 filas).
- `PRODUCTION-STATUS.md` — header actualizado a Task #86 + 3 nuevas filas en el resumen ejecutivo (clúster CRS 2.0/CARF/DAC8 verificado en #86, segunda pasada profunda completada, recuento i18n actualizado a 1.566 keys × 6, decisión go/no-go re-emitida).
- `PENDING-FINAL.md` — sin nuevos tickets generados (P0 sigue vacío); las tareas en cola previas no se duplican (#22, #26, #29, #37, #40, #53, #55, #57, #58, #62, #69, #70, #71, #75, #82, #84, #85).
- `docs/auditoria-2026-04/auditoria-integral-masiva-2.md` — reporte ejecutivo nuevo (~280 líneas) con tabla por área, evidencia literal, comparación contra Tasks #77/#78, y lista reproducible de comandos.

## [Snapshot anterior] — 2026-04-29 — Cierre a producción · idiomas, rutas y validadores (Task #78)

> Auditoría de cierre senior-engineer enfocada en las **tres dimensiones críticas para deploy seguro**: (1) catálogos i18n alineados en los 6 idiomas soportados (es/en/fr/de/pt/ca), (2) sistema de rutas y slugs canónico con `hreflang` bidireccional y `x-default`, y (3) cobertura completa de validadores Zod sobre `server/routes` con tests verdes. **Sin cambios de código** — todo el trabajo es verificación cruzada documentada y propagación a documentos raíz. Reporte ejecutivo: [`docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md`](docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md).

### Decisión

**GO** — apto para integración a `main` y deploy a Hostinger VPS (con los pasos operativos de `PENDING-FINAL.md #1`).

### Verificación (entorno Replit, dev server `:5000`)

- **i18n**: `npm run i18n:check` → **1.558 keys × 6 langs · 0 missing · 0 extra · 0 empty · 0 placeholder mismatches · 0 hardcoded strings** (783 ficheros escaneados). `lint:i18n-extended` 0 hits · `lint:pt-pt` 115 ficheros OK · `lint:brand-casing` 0 ocurrencias `ExenTax`.
- **Rutas / slugs / hreflang**: 17 RouteKeys × 6 idiomas canónicos en `shared/routes.ts:ROUTE_SLUGS` con `hreflang` BCP-47 (es-ES, en-US, fr-FR, de-DE, pt-PT, ca-ES) + `x-default` apuntando a `es`. `seo:check` 0 broken links · `seo:slash` clean · `seo:serp-previews` 108 cards / 0 errors · `test:redirects` 9/9 PASS · `test:geo` 12/12 PASS.
- **Validadores Zod**: inventario completo de **28 endpoints públicos** por par único (path × método): 23 en `server/routes/public.ts` + 1 en `server/index.ts` + 3 en `server/routes/observability.ts` + 1 en `server/discord-bot.ts` — **8 POST con body validado por Zod**, **2 GET con query Zod**, **4 con tokens en path validados por longitud + regex**, **1 con verificación Ed25519** (Discord). Patrón uniforme `safeParse + apiValidationFail`. Cobertura por suite: `test:calculator` 123/123 · `test:booking` 54/54 · `test:newsletter` 55/55 · `test:discord-regression` 6/6 · `test:indexnow` 10/10. Criterio de conteo y tabla detallada en §4 del reporte.
- **Quality gate consolidado**: `cd exentax-web && npm run check` → **EXIT 0 · 33/33 gates verde · wall 64,0 s**.
- **Seguridad de dependencias**: `npm audit --omit=dev` → **0 vulnerabilities**.
- **TypeScript estricto**: `npx tsc --noEmit` → 0 errores.

### Documentos actualizados

- `PRODUCTION-STATUS.md` — añadida fila "Cierre a producción · idiomas + rutas + validadores" en el resumen ejecutivo y bloque go/no-go actualizado a Task #78 (13/14 áreas en verde + 1 ⚠ deferida operativa).
- `PRODUCTION-CHECKLIST.md` — añadida sección "Pre-flight (gate consolidado · Task #66 + #77 + #78)" con los comandos canónicos y umbrales verificados a ejecutar antes de cualquier deploy.
- `docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md` — reporte ejecutivo (nuevo, 250+ líneas) con tabla 17 × 6 de slugs canónicos, inventario completo `endpoint → schema → test`, decisiones documentadas y comandos verificados.

## [Snapshot anterior] — 2026-04-29 — Revisión integral masiva (Task #77)

> Pasada de auditoría completa sobre todo el sistema (estructura, código, web, SEO, performance, funciones, idiomas, URLs, indexing, Discord, agenda, gestión, diseño, UX, tipografías, emails, copy, seguridad, encriptación, cross-browser y cross-device) sin drift respecto al snapshot `exentax-3.0`. Sin cambios en `package.json`, `vite.config.ts`, `server/vite.ts` ni `drizzle.config.ts`. Áreas en verde inmovilizadas según `WHAT-NOT-TO-TOUCH.md`. Reporte ejecutivo: [`docs/auditoria-2026-04/revision-integral-masiva-2026-04-29.md`](docs/auditoria-2026-04/revision-integral-masiva-2026-04-29.md).

### Correcciones aplicadas
- **`server/discord.ts` — race del worker de cola sin token de bot**. `drainTick()` reclamaba filas de `discord_outbound_queue` y, al no tener `DISCORD_BOT_TOKEN`, las eliminaba en silencio (camino "fallback alert" de `attemptSendOnce`). Eso hacía que el dev-server pre-warmed por `scripts/check.mjs` (sin token) le robara los mensajes a `scripts/discord/test-discord-bot-e2e.ts` (con token falso e intercept de `fetch`), que comparten la misma tabla en Postgres. Resultado: 1-5 fallos intermitentes en `test:discord-regression` bajo el runner paralelo. **Fix**: `drainTick()` no hace nada si `getBotToken()` es vacío; las filas quedan disponibles para quien sí pueda enviarlas. Producción siempre tiene token, así que su comportamiento no cambia. Comentario in-line documenta el motivo.
- **`exentax-web/scripts/discord/test-discord-bot-e2e.ts` — timeout de espera del drain bajo carga paralela**. La aserción `bloquear/desbloquear echoed to #sistema-auditoria (>=2 audit POSTs)` usaba `waitForQueueDrain(8_000)`. Bajo `scripts/check.mjs` (32 procesos node concurrentes saturan los workers) el tick de 1.5 s se retrasa y el queue puede quedar `size=14`. **Fix**: usar el default 25 s (igual al resto de aserciones de la suite). Sólo retrasa los fallos, nunca los enmascara.

### Verificación post-fix (entorno Replit, dev server sirviendo `:5000`)
- `cd exentax-web && npm run check` → **EXIT 0 · 33 / 33 gates verde · wall 53,4 s** (log íntegro: `.local/baseline-77/check-after-fix2.log`).
- `npm audit --omit=dev` → **0 vulnerabilities** (`.local/baseline-77/npm-audit.log`).
- `npx depcheck --json` → 0 dependencias muertas reales (postcss aparece como falso positivo, lo consume `postcss.config.mjs` vía `tailwindcss` + `autoprefixer`; ver `.local/baseline-77/depcheck.json`).
- `node scripts/audit/orphan-detect.test.mjs` → EXIT 0 (`.local/baseline-77/orphans.log`).
- Smoke 102 rutas canónicas (17 RouteKeys × 6 langs) → **102 / 102 = 200**, 0 redirects, 0 fallos.
- Headers HTTP de seguridad → CSP + X-Frame-Options SAMEORIGIN + Referrer-Policy + Permissions-Policy + X-Content-Type-Options + X-Correlation-Id presentes.
- `seo:masterpiece-strict` (mean 99.8/100) · `seo:llm-readiness` · `seo:serp-previews` (108 cards, 0 errors) · `blog:validate-all` 15/15 · `audit:bundle:fast` HARD budget OK · `lint:pt-pt` 115 ficheros OK · `lint:typography` / `lint:brand-casing` / `lint:stray-reports` clean · `i18n:check` 1.558 keys × 6 langs PASS · `lint:i18n-extended` 0 hits.
- `test:discord-regression` aislado: 3/3 scripts PASS, 72/72 e2e (`test-discord-neon` 24.5 s · `test-discord-bot-buttons` 7.2 s · `test-discord-bot-e2e` 23.7 s).
- `discord:register:diff` → EXIT 2 esperado en sandbox sin `DISCORD_APP_ID` / `DISCORD_BOT_TOKEN` (secrets prod-only). Documentado.
- Health: `/api/health` 200, `/api/health/ready` 200 (`db.ok`, `breakers.ok`, `emailWorker.ok`).

### Hallazgos sin cambio (decisiones documentadas)
- `postcss` reportado como "unused" por `depcheck` → lo cargan `tailwindcss` + `autoprefixer` desde `postcss.config.mjs`; eliminarlo rompe el build. Permanece.
- `@shared/*` reportados como "missing" por `depcheck` → son alias de `tsconfig`/`vite.config.ts`, no paquetes npm. Falsos positivos.
- 18 warnings en `seo:serp-previews` → títulos con espacio horizontal escaso en Google (no errors). Cobertura editorial diferida.
- `seo:check` no cubre la URL `https://exentax.com` desde sandbox (egress restringido); cubierto en F-1..F-9 post-deploy.

## [Snapshot anterior] — 2026-04-29 — Revisión integral 10 lotes

> Cierre del ciclo de revisión LOTES 1-10 sobre el snapshot consolidado tras Tasks #2/#3. Cero cambios en `package.json`, `vite.config.ts`, `drizzle.config.ts`. Áreas en verde inmovilizadas según `WHAT-NOT-TO-TOUCH.md`. Estado real verificado por área en [`PRODUCTION-STATUS.md`](PRODUCTION-STATUS.md). Checklist accionable de deploy en [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md).

### LOTE 1 — SEO meta titles & descriptions
- Antes: 6 errors (`homePage.seoDesc` >165 c × 6 locales) + 112 warnings near-limit (15-24 por idioma).
- Después: `npm run seo:meta` → **0 errors / 0 warnings × 6 idiomas**.
- 6 `seoDesc` del homePage reescritas a 150-155 c, persuasivas, con beneficio + CTA implícito y mención Exentax. Adaptación nativa por idioma (no traducción literal).
- Cobertura: home + 14 páginas + 5 subpáginas LLC/ITIN + 112 blog posts × 6 idiomas. Cada meta title 50-60 c · cada meta description 145-152 c · únicas dentro del idioma (`dupT=0` / `dupD=0`).

### LOTE 2 — URLs · slugs · hreflang · sitemap · robots · IndexNow
- 780 URLs probadas (102 páginas + 6 blog index + 672 blog posts) → **780 / 780 = 200**.
- Cada URL servida con 7 `<link rel="alternate" hreflang>` bidireccionales (es-ES, en-US, fr-FR, de-DE, pt-PT, ca-ES + x-default) en HTML y en sitemap.
- `<link rel="canonical">` único por página, sin trailing slash inconsistente, sin query params.
- Sitemap-index referencia 3 sitemaps hijos (`sitemap-pages.xml` / `sitemap-blog.xml` / `sitemap-faq.xml`) con `<lastmod>` real desde mtime del fuente y `<priority>` realista por tipo (home 1.0 / pillares LLC 0.9 / blog 0.6-0.7).
- `robots.txt` permite Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, PerplexityBot, ClaudeBot, anthropic-ai, CCBot · enlaza `/llms.txt` y `/sitemap.xml` · bloquea `/api/*`, `/admin/*`, `/booking/*`, `/links`, `/start`.
- IndexNow ping live → 200/202 · `npm run test:indexnow` PASS · state file `data/indexnow-pinged.json` actualizado.

### LOTE 5 — Veracidad fiscal de los 672 artículos
- 672 artículos × 18 hechos canónicos auditados contra fuente oficial (BOE, AEAT, TGSS, IRS, FinCEN, EUR-Lex, OCDE, Secretary of State).
- Capa A (sustantiva — hecho × pillar × idioma): **162 / 162 ✓**, 0 ✏ FIX, 0 MISSING.
- Capa B (per-artículo, barrido activo de 11 patrones `contradicts` sobre los 672 archivos): **672 / 672 ✓**, **0 hits**.
- Per-datum: **9.638 evaluaciones** · 4.318 menciones secundarias con regla canónica completa · 5.160 referencias pasivas · **0 contradicciones**.
- Marcas de revisión editorial pendiente: **0 hits**.
- Correcciones aplicadas: **0** (corpus ya alineado tras Tasks #34 / #35).
- Datos críticos confirmados 2026 vigentes: cuotas autónomos RETA · tramos IRPF estatales · Form 5472 multas · Modelo 720/721 post-TJUE · BOI Report FinCEN · cuotas LLC NM/WY/DE/FL · DAC7 · DAC8 · CRS/CARF.
- Discrepancia documentada: el cap de $250.000 del Form 5472 mencionado en la spec del lote no figura como tope estatutario en la versión vigente IRC §6038A(d) post-TCJA 2017 — el corpus respeta la fuente oficial ("sin tope explícito") sobre la spec.
- Reporte: `exentax-web/reports/seo/lote5-veracidad.md` (1107 líneas) + `lote5-veracidad.json`.

### LOTE 6 / 6b — Conversión + risk-bridge sweep
- Antes: **666 warnings `[no-conversion-entry]`** + 5 warnings posicionales CTA + artículos bajo umbral de palabras (ES <2.000 / otros <1.700).
- Después: **0 warnings** `no-conversion-entry` · 0 warnings posicionales · 672 artículos con ≥1 link a `/calculadora` y ≥1 a `/contacto` · `audit:conversion --strict` 672 / 672 conversion-grade.
- Risk-bridge sweep: 3.428 párrafos de riesgo escaneados → **3.410 con bridge Exentax adyacente (99,5%)** · 18 huérfanos en catálogos no-narrativos aceptables (`cross-refs-v1`, `legal-refs-v1`).
- 783 bridges v1 reescritos a tono cercano (catálogo v2: **8 variantes por idioma**, 12-22 palabras, segunda persona, deterministic por hash `(archivo, índice de bloque)`).
- 204 archivos tocados.
- Cobertura por idioma: **ES 100,0% · EN 99,4% · FR 99,1% · DE 99,6% · PT 99,2% · CA 99,3%**.
- Cero precios en cuerpo de artículo (excepto cuando el contexto sea explícitamente la calculadora) — verificado con grep.
- Reporte: `exentax-web/reports/seo/lote6b-risk-bridge.md`.

### LOTE 7 — i18n calidad nativa
- 1.558 keys × 6 idiomas mantienen `npm run i18n:check` PASS (0 missing · 0 leaks · 0 same-as-ES no-allowlistadas · 0 placeholder mismatches).
- Heurística extendida `scripts/i18n/i18n-native-quality-audit.ts` con: calcos del español, anglicismos no necesarios en FR, false friends EN/FR, registro `Sie` (DE) / `vous` (FR), brasileñismos PT — **0 hits** en cada idioma.
- Glosario respetado: "LLC" literal en EN/FR/DE/PT/CA · "Autónomo" adaptado por idioma (self-employed / travailleur indépendant / Selbstständiger / trabalhador independente / autònom) · "IRPF" mantenido o explicado entre paréntesis.
- Mensajes de error de formularios (Zod resolvers, useToast errors, react-hook-form) revisados nativamente en 6 idiomas.
- Plantillas de email (`server/email-i18n.ts`, `email-layout.ts`, drips, reminders, follow-ups) revisadas: tono, saludo, despedida y fórmulas de cortesía nativas.

### LOTE 8 — Schema markup · Open Graph · Twitter Cards
- 100% de páginas HTML servidas (home + 14 páginas + 5 subpáginas + 112 blog posts + FAQ × 6 idiomas) con JSON-LD válido.
- Home: `Organization` con `@id` + `aggregateRating` + `sameAs` + `contactPoint` · `WebSite` con `potentialAction` SearchAction · `BreadcrumbList`.
- Páginas LLC: `Service` con `provider` referenciando `@id` de Organization · `BreadcrumbList` · `HowTo` en pillar `abrir-llc`.
- Blog post: `BlogPosting` con `author`, `publisher` (referencia `@id`), `datePublished`, `dateModified`, `mainEntityOfPage`, `image` · `BreadcrumbList` · `HowTo` cuando aplique.
- FAQPage: `FAQPage` con todos los Q/A renderizados (79 FAQs × 6 idiomas).
- Cada bloque `<script type="application/ld+json">` parsea como JSON estricto (0 errores de sintaxis).
- Open Graph: `og:title`, `og:description`, `og:image` (URL absoluta + dimensiones + alt), `og:url`, `og:type`, `og:locale`, `og:locale:alternate` (5 idiomas restantes), `og:site_name="Exentax"`.
- Twitter Cards: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (sin `twitter:site` vacío).

### LOTE 9 — Integraciones restantes (calculadora · leads · seguridad)
- `curl /api/health/ready` → 200 con DB / breakers / emailWorker `healthy`.
- Calculadora: 4 estados USA disponibles (Wyoming, Nuevo México, Delaware, **Florida**) verificados contra Secretary of State. Florida con $138.75 annual report fee + $0 state income tax + $0 franchise tax sobre LLC pass-through. `npm run test:calculator` 116 / 116.
- Lead pipeline E2E: contact + calculator-lead + newsletter + booking → Zod valida → DB persiste con `phone` cifrado `ef:…hex…` → embed Discord publicado en canal correcto (`DISCORD_CHANNEL_REGISTROS` / `_CALCULADORA` / `_AGENDA`).
- Helmet CSP estricta (`connect-src` permite endpoints propios + Google APIs + Discord + IndexNow · `img-src` permite OG + favicons · `script-src` self + nonce, sin `unsafe-eval` · `frame-ancestors 'none'`).
- CSRF activo: POST sin `Origin/Referer` válido → **403** · `client-errors-csrf.test.ts` PASS.
- Rate limiting: global **200/min IP** + específico por endpoint (booking 5/min, calculator-leads 5/min, newsletter 3/min). Test: 6 envíos en 60s a `/api/contact` → 429 al sexto.
- Field encryption: `field-encryption.ts` cifra `phone` con AES-256-GCM antes de `INSERT`. Query directa a `leads`/`agenda`/`calculations` muestra `phone` con prefijo `ef:`. `FIELD_ENCRYPTION_KEY` requerido en prod (fail-fast en `server/index.ts:23-41`).
- `test-field-encryption` 45 / 45 PASS AES-256-GCM E2E.

### LOTE 10 — Documentación de producción (Task #11)
- **Nuevo** [`PRODUCTION-STATUS.md`](PRODUCTION-STATUS.md) raíz: matriz por área con estado real verificado, cifras antes/después, comandos de verificación, referencias a reportes.
- **Nuevo** [`PRODUCTION-CHECKLIST.md`](PRODUCTION-CHECKLIST.md) raíz: checklist accionable A-K para deploy a Hostinger VPS (recursos externos · env vars · provisión VPS · deploy inicial · re-deploys · smoke tests F1-F9 · cron · IndexNow · rollback · backups · cierre release). Delega detalle largo a `exentax-web/docs/deploy/PRODUCTION-CHECKLIST.md` (340 líneas) y `HOSTINGER-VPS.md` (485 líneas).
- `CHANGELOG.md` (este fichero): nueva entrada por LOTE.
- `PENDING-FINAL.md`: refresco — items cerrados por LOTES 1-9 marcados, items residuales con prioridad + impacto + comando reproductor.
- `README.md`: actualización mínima de cabecera con fecha + referencia a artefactos nuevos.
- Reporte resumen: `exentax-web/reports/lote10-docs-summary.md`.

#### Verificación final (ejecutada 2026-04-29 en branch LOTE 10 docs)

| Comando | Resultado | Notas |
|---|---|---|
| `npx tsc --noEmit --strict` (en `exentax-web/`) | **EXIT 0** | TS strict limpio. No hay cambios de código. |
| `SKIP_BUILD_E2E=1 npm run build` (raíz) | **EXIT 0** | `dist/index.mjs` 5.8 MB · cliente built en 21,36 s · esbuild server 475 ms · `dist/index.cjs` shim regenerado. |
| `curl http://localhost:5000/api/health` | **200** | `{"status":"ok","uptime":N}` (liveness, no toca DB) |
| `curl http://localhost:5000/api/health/ready` | **200** | `{"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true,"message":"last drain Ns ago"}}}` |
| `npm run dev` (workflow `Start application`) | **RUNNING — verde** | Logs sin errores: `[express] listening on port 5000` · `[express] fully initialized` · `[email-retry] worker started` · `[discord] queue: persistence enabled (0 pending)` · 10 schedulers iniciados sin error. |
| `npm run check` (en `exentax-web/`) | **EXIT 1 — drift conocido en `lint:pt-pt`** | El step `lint:pt-pt` (`scripts/audit/audit-pt-pt.mjs`) reporta ~25 archivos `client/src/data/blog-content/pt/*.ts` con "arquivo" (brasileñismo, recomendado "ficheiro") proveniente de la frase canónica del catálogo bridge v2 introducido por LOTE 6b ("…submissão feita, arquivo pronto, o risco fica no papel."). **No es regresión de LOTE 10** (esta tarea solo modifica `.md` raíz). Es drift de la calidad nativa pt-PT que **LOTE 7 (i18n calidad nativa)** debe pulir cuando se consolide en `main`: o (a) reescribir la línea del bridge v2 en pt-PT cambiando "arquivo" → "ficheiro", o (b) añadir un allowlist controlado en `audit-pt-pt.mjs` documentando el motivo. Hasta esa pasada del LOTE 7 sobre el catálogo bridge, `npm run check` no llega a EXIT 0. Resto de gates en este branch: `tsc` EXIT 0 · `lint:typography` clean · `lint:stray-reports` clean · `lint:brand-casing` clean. Documentado también en [`PENDING-FINAL.md #1.5`](PENDING-FINAL.md). |

> Las gates avanzadas que dependen de pasadas previas del LOTE (`seo:meta`, `blog:validate-all`, `i18n:check`, `lint:i18n-extended`, `audit:conversion --strict`) siguen verdes en sus branches respectivos (LOTES 1, 5, 6/6b, 7) y los reportes correspondientes están bajo `exentax-web/reports/`. La consolidación final de los outputs literales se hará en el downstream task `lote-final-revision-report` (`REVISION-FINAL-REPORT.md`).

### Tooling — Monitorización continua live-verification (Task #56)

- **Nuevo workflow GitHub Actions** [`.github/workflows/live-verification.yml`](.github/workflows/live-verification.yml): cron `*/20 * * * *` ejecuta `bash scripts/live-verification.sh https://exentax.com` (subset HTTP-only) y publica un embed en `#exentax-errores` cuando el estado de la web pública cambia. También expone `workflow_dispatch` con input `base_url` para probarlo a mano contra cualquier dominio.
- **Nuevo notifier** [`scripts/notify-live-verification-discord.mjs`](scripts/notify-live-verification-discord.mjs): parsea el reporte markdown del runner, clasifica el incidente en `ok` / `down` / `vps-not-deployed` y decide la acción Discord en función del estado anterior persistido vía `actions/cache`. Cumple los AC del task: alerta inicial al detectarse FAIL, embed RECUPERADO con duración del incidente al volver a verde, y agrupación de la situación "VPS aún no desplegado" en una única alerta (no spammea cada 20 min con los 9 FAILs idénticos cuando `/api/health` y `/api/health/ready` devuelven 404). Reutiliza la paleta y política de brand Discord (`EXENTAX_NEON` / `EXENTAX_RED`, sin emojis, footer `Exentax · CI · live-verification`) ya canónica en `exentax-web/scripts/audit/auditoria-ci-notify-discord.mjs`.
- **Tests** [`scripts/notify-live-verification-discord.test.mjs`](scripts/notify-live-verification-discord.test.mjs): 22 assertions sobre `parseReport`, `classifyIncident`, `decideAction`, `formatDuration` y `buildEmbed` (matriz completa de transiciones de estado + sanity de paleta y ausencia de emojis). `node scripts/notify-live-verification-discord.test.mjs` → **22 passed, 0 failed**.
- **Documentación** en [`PRODUCTION-CHECKLIST.md §F-monitor`](PRODUCTION-CHECKLIST.md#f-monitor-monitorización-continua-discord--task-56) — tabla de transiciones + secrets requeridos (`DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ERRORES`).

## [Unreleased] — 2026-04-28

### Cleanup Task #3 — Limpieza estructural del repo (legacy, huérfanos, docs duplicados)
- **Working-tree shrink: ~40 MB liberados, 212 ficheros eliminados.** El repo
  queda con una sola fuente de verdad por tipo de doc y cero ficheros
  legacy/huérfanos/sin referencia. Detalle:
- **`exentax-web/scripts/archive/` borrada en su totalidad** (5 subcarpetas
  `2026-04`, `2026-04-orphans`, `2026-04-task36`, `2026-04-task4`,
  `2026-04-task5` · 86 ficheros · ~1.5 MB). Cero referencias runtime; las
  menciones en `check-stray-reports.mjs`, `audit-conversion-112x6.mjs` y
  `lint-banned-banking-entities.mjs` son comentarios docstring históricos.
- **5 scripts huérfanos del root borrados**: `scripts/audit-blog-sources.mjs`,
  `scripts/audit-slugs-paginas-2026-04.mjs`, `scripts/auditoria-multiidioma.mjs`,
  `scripts/blog-acceptance.js`, `scripts/verify-backup.ts`. Cero referencias
  desde `package.json` ni `scripts/post-merge.sh`. Se conserva
  `scripts/post-merge.sh` (cableado en `[postMerge]` de `.replit`).
- **`screenshots/` borrada** (38 MB · 31 jpgs raíz + `desktop-*`/`mobile-*`
  PNGs + `crops/` + `qa/report.json`). El propio `report.json` se
  autorreferenciaba; cero refs runtime; menciones en README/CHANGELOG ya
  apuntaban a su eliminación previa como histórico.
- **`attached_assets/Pasted-LOTE-5-...txt` borrado** (carpeta vacía también).
  Cero referencias.
- **`uploads/docs/` (vacía) borrada.** `uploads/` raíz queda fuera de tracking
  hasta que `exentax-web/scripts/build.ts` la regenera idempotentemente
  (`mkdir -p uploads/docs`) en cada build. Server (`/uploads` 403,
  `INDEXING_REPORTS_DIR=process.cwd()/uploads/reports/indexing`) sigue
  resilient via `existsSync`.
- **`docs/internal/PENDING.md` borrado** (consolidación: era un puntero de 32
  líneas a `PENDING-FINAL.md` raíz). El raíz `PENDING-FINAL.md` queda como
  fuente única.
- **`.git/index.lock` saneado** (no estaba presente; verificado).
- **CONSERVADO intacto** (todo lo listado en `WHAT-NOT-TO-TOUCH.md`):
  `dist/index.cjs` raíz (es deploy shim usado por `.replit`
  `run = ["node", "./dist/index.cjs"]`); `migrations/` raíz (única copia,
  apunta `drizzle.config.ts`); `reports/email/email-audit-2026-04.md` y
  `reports/seo/orphan-urls-2026-04.md` (ambos referenciados por `replit.md`
  + `seo-orphan-audit.mjs`); `exentax-web/README.md` (app-level docs,
  diferente de root README de workspace); `WHAT-NOT-TO-TOUCH.md` raíz +
  `docs/internal/WHAT-NOT-TO-TOUCH.md` (ambas reglas de diseño,
  intactas); `replit.md`, `BASELINE.md`, `CHANGELOG.md`, `README.md`,
  `PENDING-FINAL.md` raíz (las 5 únicas .md raíz por convención
  documentada en `replit.md` line 100).
- **No se tocó `package.json`** ni dependencias: ningún script apuntaba a
  los ficheros borrados.
- **Verificación post-cleanup (mismo verde que baseline):**
  - `npx tsc --noEmit --strict` (desde `exentax-web/`): EXIT 0.
  - `SKIP_BUILD_E2E=1 npm --workspace exentax-web run build`: EXIT 0,
    bundle shape idéntico.
  - `npm run dev` arranca; `GET /api/health/ready` → `{"status":"ready",
    "ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},
    "emailWorker":{"ok":true}}}` (200).
  - `npm --workspace exentax-web run check`: EXIT 1 — mismos 6 errores
    que baseline (homePage SEO desc >165c × 6 locales). NO regresión;
    diferido a LOTE 1 (Task #4 SEO meta).

### Audit Task #2 — 9-block integral audit + consultoría → asesoría rename
- **Cross-locale rename pass** in 6 languages aligned with
  `docs/i18n-glossary.md`:
  - **ES**: `consultoría/consultor*` → `asesoría/asesor*` (full).
  - **CA**: `consultoria/consultor*` → `assessoria/assessor*` (full).
  - **PT**: `consultoria/consultor*` → `assessoria/assessor*` (full)
    in UI, email subjects, server SEO. PT `Calendar event copy` keeps
    `Consultoria` per glossary §2 (`asesoría fiscal → consultoria fiscal`).
  - **EN**: `Consulting/consultation/consultant` → `Advisory/advisory
    session/advisor` in UI, server SEO and email templates. **Brand
    mid-CTA** `Free consultation, no strings attached` retained per
    canonical brand voice (locked by `blog-mid-cta-check.mjs`); see
    PENDING-FINAL §6.
  - **FR**: keeps `conseil/consultation` per glossary canonical (no
    blanket rename).
  - **DE**: keeps `Beratung/Steuerberatung` per glossary canonical (no
    blanket rename).
  - **Calendar event titles** (`server/google-meet.ts`) updated for ES
    (`Asesoría Exentax`), EN (`Exentax Advisory`), CA (`Assessoria
    Exentax`); FR/DE/PT unchanged per glossary.
- **Audit reports written** under `docs/audits/`:
  - `BASELINE.md` (root): 5 baseline commands captured literally.
  - `docs/audits/NAVIGATION-AUDIT.md` (Bloque 2): all 18 routes × 6
    locales, hreflang & internal-link health.
  - `docs/audits/AGENDA-AUDIT.md` (Bloque 4): booking lifecycle,
    Google Meet i18n, dev/prod gap.
  - `docs/audits/DISCORD-AUDIT.md` (Bloque 5): 7 channel inventory,
    bot gating, notifier surface.
  - `docs/audits/PERFORMANCE-AUDIT.md` (Bloque 6): bundle shape,
    server health, no regressions vs baseline.
  - `docs/audits/PENDING-FINAL.md`: 6 explicitly deferred items
    with rationale.
- **Verification (post-audit, post-rename):**
  - `tsc --noEmit --strict`: EXIT 0.
  - `npm --workspace exentax-web run i18n:check`: EXIT 0 (1558 keys ×
    6 lang clean — no missing/extra/empty/placeholder mismatch).
  - `SKIP_BUILD_E2E=1 npm --workspace exentax-web run build`: EXIT 0,
    bundle shape byte-equivalent to baseline.
  - `GET /api/health/ready`: ready, db OK, breakers OK, emailWorker OK.
  - `npm --workspace exentax-web run check`: EXIT 1 — same baseline
    failure (`seo:meta`: home description >165 c × 6 locales). NOT a
    regression; explicitly deferred to LOTE 1 SEO meta task per
    PENDING-FINAL §2.
- **Untouched per WHAT-NOT-TO-TOUCH.md:** `package.json`,
  `vite.config.ts`, `drizzle.config.ts`, all URL slugs, the home
  description copy.

## [Unreleased] — 2026-04-27

### SEO meta verifier — 0 warnings (CTA normalization + title trim)
- **`npm run seo:meta` → 0 errors / 0 warnings** across the 6 locales
  (es/en/ca/fr/de/pt). Resolved the 32 cosmetic warnings flagged after the
  Task #2 premium SEO rollout.
- **Service-subpage descriptions (5 × 6 = 30 entries)** in
  `client/src/i18n/data/subpages.ts` rewritten so each one closes with one of
  the locale's allowed soft CTAs (e.g. *Reserva tu llamada*, *Empieza hoy*,
  *Book a free call*, *Get started*, *Démarrez ici*, *Jetzt starten*,
  *Comece hoje*, *Comença avui*). All descriptions stay within the 140-165
  char SERP budget and preserve the approved premium tone (no Mercury, no
  boutique).
- **`serviciosPage.seoTitle`** trimmed under the 58-char soft warn limit in
  `client/src/i18n/locales/es.ts` (53c) and `en.ts` (58c).

## [Unreleased] — 2026-04-26

### Quality audit + DE register cleanup + indexing verified
- **DE register informal → formal Sie**: 87 artículos editorializados (488+65
  substituciones aplicadas vía `scripts/de-register-apply-safe.mjs`). Audit
  detector con thresholds language-aware (DE 0.65, PT/FR 0.70, CA 0.75) y
  section-count exemption para artículos restructurados con más secciones que ES.
- **MT tells (overuse) → 0**: 11 artículos FR limpiados (`actuellement`
  redundante) via 14 patrones específicos.
- **Low-ratio false positive → 0**: los 5 artículos low-ratio (DE/PT/CA/FR)
  tenían MÁS secciones que ES (restructuración audiencia-local), no contenido
  faltante. Audit ahora exime artículos restructurados.
- **CTA refactor seguro**: `scripts/blog/blog-cta-channel-lint.mjs` +
  `blog-cta-channel-update.mjs` para drift detection del número WhatsApp
  canonical en 666 artículos.
- **Phone CTA eliminado**: 657 artículos blog (6 idiomas) ahora solo tienen
  WhatsApp + agendar como CTAs principales (no phone).
- **Brand casing fix**: `STACK.md` añadido al ALLOWLIST de
  `brand-casing-check.mjs` (mismo patrón que AGENT-RULES.md).
- **CRS 2.0 article**: `crs-2-0-carf-por-que-usa-no-firmara-llc` integrado
  completo en 6 idiomas (verified by audit).
- **Florida service**: integrado completo (page + 6 lang slugs + sitemap +
  footer + i18n subpages content).
- **`.blog-content code` fontStack**: eliminado fallback a monospace (Inter
  only) — alineado con brand "no monospace anywhere".

### Quality audit results (2026-04-26 baseline)
- `npm run check`: EXIT 0 con 23 gates verde
- `npm run blog:validate-all`: **13/13 OK**
- `npm run i18n:check`: PASS (1554 keys × 6 idiomas)
- `npm run seo:meta`: 0 errors / 0 warnings × 6 langs
- `npm run seo:check`: 0 broken links · 112 articles ≥3 inbound
- `npm run seo:llm-readiness`: PASSED 0 warnings
- `blog-translation-quality-extended`: leakage 0 · DE register 0 · MT tells 0
  · FR register 1 (false positive intencional) · low-ratio 0 · untranslated 0
- `test:calculator`: 123/123 asserts
- `test-field-encryption`: 45/45 asserts AES-256-GCM E2E

### Documentación actualizada
- `docs/internal/REVISION-TOTAL-REPORT.md` — baseline + análisis bloque-por-bloque
- `docs/internal/PROJECT-CONTENT-REPORT.md` — newsletter + 25 pages + design system
- `docs/internal/EDITORIAL-PENDING-PLAN.md` — workflow editorial actualizado
- `docs/internal/STACK.md` + `INDEX.md` actualizados a 2026-04-26
- `docs/auditoria-multiidioma/de-register-action-list.md` — herramienta editorial line-by-line

## [Unreleased] — 2026-04-22

### Limpieza estructural del repositorio
- Historial consolidado en un único commit `Exentax web — snapshot production-ready`
  tras rebase/squash completo (rewrite de autor a `Arnau Fortuny`).
- Ramas remotas obsoletas eliminadas: 21 × `subrepl-*`, `replit-agent`, `main-repl/main`.
- Tag `exentax-3.0` re-apuntado al commit activo (el histórico `ad602a1` quedó huérfano).
- `screenshots/` eliminado (capturas sueltas no referenciadas).
- `.gitignore` extendido para ignorar `exentax-web/audits/` (outputs regenerables
  de `scripts/audit-markdown-quality.mjs`).
- `exentax-web/audits/markdown-quality.json` y `traducciones-mejoradas.json`
  dejan de estar versionados (el segundo era dead file, eliminado del disco).

### Datos fiscales 2026 actualizados
- `shared/lib/calculator-config.ts`:
  - `SS_AUTONOMO_BRACKETS_2025` → `SS_AUTONOMO_BRACKETS_2026` con los 15 tramos
    oficiales 2026: **200,00 € (tramo 1) → 604,80 € (tramo 15)**. Los 12 valores
    intermedios estaban desactualizados vs la tabla RETA 2026 (venían de 2025).
  - Comentarios de `IRPF_BRACKETS` y `SPAIN_DIVIDEND_BRACKETS` actualizados a 2026
    + referencia cruzada al artículo `tramos-irpf-2026.ts`.
  - Comentario de `TARIFA_PLANA_MONTHLY_ES` (80 €/mes) actualizado (RD-Ley 13/2022
    prorrogado 2026).
- `client/src/lib/calculator.ts` + `calculator.test.ts`: imports renombrados.
  116/116 aserciones siguen pasando.

### Precios Exentax unificados (2.000 € setup / 1.400 €/año mantenimiento)
Todas las apariciones con `~1.500 €/año` o aproximaciones (`~`) sustituidas por
los valores canónicos exactos:

| Archivo | Antes | Después |
|---|---|---|
| `client/src/i18n/locales/es.ts:2384` | `~2.000 € de setup y ~1.500 €/año` | `2.000 € de setup y 1.400 €/año` |
| `client/src/i18n/locales/ca.ts:1963` | `~2.000 € de setup i ~1.500 €/any` | `2.000 € de setup i 1.400 €/any` |
| `client/src/i18n/locales/de.ts:2190` | `~2.000 € Setup und ~1.500 €/Jahr` | `2.000 € Setup und 1.400 €/Jahr` |
| `client/src/i18n/locales/en.ts:2188` | `~€2,000 setup and ~€1,500/year` | `€2,000 setup and €1,400/year` |
| `client/src/i18n/locales/fr.ts:2191` | `~2 000 € de setup et ~1 500 €/an` | `2 000 € de setup et 1 400 €/an` |
| `client/src/i18n/locales/pt.ts:2194` | `~€2.000 de setup e ~€1.500/ano` | `€2.000 de setup e €1.400/ano` |
| `client/src/components/calculator/CalculatorResults.tsx:210` | `~2.000 € … ~1.400 €` (fallback) | `2.000 € … 1.400 €` (fallback) |

### SEO
- `client/src/components/SEO.tsx`: añadido `og:locale:alternate` para las otras
  5 locales en cada render. Completa la cobertura Open Graph multilingüe.

### Identidad Git
- `user.name = Arnau Fortuny`
- `user.email = 240033972+arnaufortuny@users.noreply.github.com`

### Verificaciones que pasan tras los cambios
- `tsc --noEmit` → exit 0, 0 errores.
- `validate-i18n.ts` → 6 idiomas con 1552 claves cada uno, sin placeholders rotos,
  sin phantom keys, 360 allowlisted entries válidas.
- `calculator.test.ts` → 116/116 aserciones.
- `check-typography-rule0.mjs` → 0 violaciones.
- `brand-casing-check.mjs` → sin `ExenTax`.
- `audit-pt-pt.mjs` → sin brasileñismos.
- `blog-content-lint.mjs` → 670 ficheros, sin menciones prohibidas.
- `seo-check-links.mjs` → sin enlaces internos rotos.

### Sin cambios funcionales
- API, rutas, esquema DB, webhooks Discord (retirados ya), plantillas de email,
  slash commands, integraciones Google (Calendar/Meet/Search Console), IndexNow
  y sitemap dinámico no se han tocado — la auditoría confirmó estado operativo.
