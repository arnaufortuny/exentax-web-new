# Changelog

Todos los cambios notables de este repositorio se documentan aquí.
Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased] — 2026-04-29 — Revisión integral masiva (Task #77)

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
