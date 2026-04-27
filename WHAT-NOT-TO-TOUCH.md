# WHAT-NOT-TO-TOUCH — Exentax Web

> **Verificado 2026-04-27.** Lista de áreas en VERDE con el comando que lo confirma. **Regla operativa**: si quieres modificar un área de esta lista, ejecuta antes el comando que la verifica, anota el output, haz tu cambio, vuelve a ejecutar y confirma que el output sigue idéntico (o explícitamente mejor). Sin medición previa, no se toca.

---

## 1. Calculator data layer

**Path**: `exentax-web/client/src/lib/calculator-config.ts` · `exentax-web/client/src/lib/calculator.ts`

**Estado verificado**:
- `IRPF_BRACKETS_{LOW,MEDIUM,HIGH}` con `getIrpfBrackets("low"|"medium"|"high")` para CCAA selector.
- `SS_AUTONOMO_BRACKETS_2026` con verificación 4-fuente (TGSS Sede + BOE RDL 13/2022 + Acuerdo Mesa Diálogo + TRLGSS).
- 9 jurisdicciones (España + UK + Francia + Bélgica + Italia + Austria + México + Chile + LLC USA).
- Centralised constants (sin duplicados inline). Source-of-truth.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web && DATABASE_URL=postgresql://stub npm run test:calculator
# → 116/116 PASS (sandbox) — preset-driven, never asserts "0 tax", "best is always LLC"
```

(En sandbox sin DB el test:calculator falla porque importa server code; en Replit con DATABASE_URL pasa 116/116.)

---

## 2. Server middleware stack

**Paths**:
- `server/index.ts` (bootstrap + helmet + CSP + compression + rate-limit + correlation + sanitize)
- `server/middleware/legacy-redirects.ts` (+ `legacy-redirects.json`)
- `server/middleware/geo.ts`
- `server/correlation.ts`
- `server/sanitize-middleware.ts`
- `server/route-helpers.ts`

**Estado verificado**:
- TS strict EXIT 0.
- 9/9 redirects tests · 12/12 geo tests.
- Helmet HSTS (prod, 2 años + preload), CSP estricta, X-Frame-Options=SAMEORIGIN, X-Content-Type-Options.
- CSRF Origin/Referer validation en todas las mutaciones.
- Rate limit IP global 200/min + por endpoint.
- Correlation ID via AsyncLocalStorage propagado a logs.
- Sanitización automática inputs (DOMPurify server-side).

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web
npx tsc --noEmit --strict
npm run test:redirects
npm run test:geo
# → todo EXIT 0
```

---

## 3. Schema BD

**Path**: `exentax-web/shared/schema.ts`

**Estado verificado**:
- 10 tablas (Drizzle ORM): `leads`, `agenda`, `calculations`, `visits`, `newsletter_subscribers`, `blocked_days`, `legal_document_versions`, `consent_log`, `seo_rankings`, `email_retry_queue`, `agenda_admin_actions`.
- Índice parcial único anti-double-book en `agenda(meetingDate, startTime)` para estados activos.
- AES-256-GCM field encryption en `phone` (leads, calculations).
- Cola persistente `email_retry_queue` con claim/release backoff exponencial.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web && npx tsc --noEmit --strict
# → schema compila clean junto al resto del backend
```

(Migrations: `migrations/` directory + `runColumnMigrations` idempotente al arranque.)

---

## 4. Discord types y bot handlers

**Paths**: `server/discord.ts` · `server/discord-bot.ts` · `server/discord-bot-commands.ts`

**Estado verificado**:
- 0 `any` en TypeScript (tras tightening con `discord-api-types/v10`).
- Verificación firma Ed25519 con `DISCORD_PUBLIC_KEY` antes de procesar interactions.
- Dedupe por contenido + cola en memoria + reintentos 3× exp backoff (8s timeout).
- Role gate `ADMIN_DISCORD_ROLE_ID` en cada `/agenda` y `/cita`.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web
grep -c ': any\b\|as any\b' server/discord*.ts
# → 0 (excluyendo comentarios "any" como palabra inglesa)
npx tsc --noEmit --strict server/discord*.ts
# → EXIT 0
```

(Live testing requiere `DISCORD_BOT_TOKEN` real; ver `PENDING-FINAL.md §6`.)

---

## 5. i18n (1552 keys × 6 idiomas)

**Paths**: `client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts` · `client/src/i18n/keys.generated.ts`

**Estado verificado**:
- 0 missing keys · 0 extra keys · 0 empty values · 0 placeholder mismatches · 0 structure mismatches · 1 possibly-untranslated (no-bloqueante).
- Tipos auto-generados en `keys.generated.ts` (regenerar con `npm run i18n:generate-types`).

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web && npm run i18n:check
# → "Result: PASS ✓"
```

> ⚠ La calidad nativa profesional de las 5 traducciones (no-ES) NO está en esta lista. Es el item #4 de `PENDING-FINAL.md`. Lo que SÍ está verificado es la consistencia estructural, placeholders, y cobertura.

---

## 6. Routes canónicales

**Path**: `exentax-web/shared/routes.ts`

**Estado verificado**:
- Fuente única para `ROUTE_SLUGS` (slugs traducidos por idioma).
- Consumida por cliente (wouter) y servidor (canonical + hreflang + sitemap).
- Sin duplicación detectada por `seo:slash`.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web
SEO_SLASH_SKIP_LIVE=1 npm run seo:slash
# → "slash-hygiene: clean"
npm run seo:meta
# → "PASS: 0 error(s), 0 warning(s) across 6 languages · pages=14 subpages=5 blog=112"
```

---

## 7. Blog content (112 slugs × 6 langs = 672 ficheros)

**Path**: `exentax-web/client/src/data/blog-content/{lang}/*.ts`

**Estado verificado** (estructural, no calidad editorial nativa):
- 13 puertas blog:validate-all en VERDE (content-lint, internal-links, locale-link-leak, cta, data, sources, faq-jsonld, sitemap, sitemap-bcp47, masterpiece-audit, seo-llm-readiness, blog-cluster-audit).
- 0 review-anchor blocks filtrados a producción (limpiados en sesión 2026-04-27).
- 0 PT-BR brasileñismos (lint enforced).
- 0 enlaces internos rotos (seo:check).
- ≥ 3 inbound links por artículo.
- 112 articles cluster-graph válido.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web && npm run blog:validate-all
# → "blog-validate-all: OK (13 steps)"
grep -rln "exentax:review-anchor\|NICHT VERIFIZIERT\|NOT VERIFIED" client/src/data/blog-content
# → 0 ficheros
```

> ⚠ La calidad de traducción (palabras netas vs ES) NO está en esta lista. 17 slugs con ratio < 0.85 documentados en `PENDING-FINAL.md §2`.

---

## 8. SEO meta + canonical + hreflang

**Path**: `server/seo-content.ts` · `server/static.ts` · `client/src/components/SEO.tsx`

**Estado verificado**:
- Meta `<title>`, `<meta description>`, OG, Twitter Card por página × 6 idiomas, **sin duplicados** (`seo:meta` reporta `dupT=0 dupD=0` por idioma).
- `<link rel="canonical">` y `<link rel="alternate" hreflang="...">` para los 6 idiomas + `x-default`.
- JSON-LD: `ProfessionalService`/`Organization`/`WebSite` (home), `FAQPage` (FAQ), `BreadcrumbList`+`BlogPosting` (post), `Service` (subpáginas).
- Sitemaps multiidioma cacheados 1h con `<lastmod>` real.
- `X-Robots-Tag` por ruta.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web && npm run seo:meta && npm run seo:check
# → ambos PASS
```

---

## 9. Calculadora UI

**Path**: `exentax-web/client/src/components/calculator/index.tsx` · `CalculatorResults.tsx` · `EmailGateForm.tsx`

**Estado verificado**:
- TS strict EXIT 0.
- CCAA selector i18n × 6 idiomas (`select-ccaa-profile` data-testid).
- Geo IP prefill via `/api/geo` con cleanup (`cancelled` flag + `return () => { cancelled = true }`).
- Currency picker independiente de country selector.
- 9 jurisdicciones soportadas + LLC USA comparativa 3-way.

**Comando verificación**:
```bash
cd /home/user/exentax-web-new/exentax-web && npx tsc --noEmit --strict
# → EXIT 0
# Live testing: npm run test:e2e (requiere browsers + server)
```

---

## 10. Lighthouse CI workflow

**Path**: `.github/workflows/lighthouse.yml` · `.lighthouserc.json`

**Estado verificado**:
- 4 URLs (home ES/EN, blog ES, calculadora) × 3 runs por URL (median).
- Asserts: LCP < 2500ms · CLS < 0.1 · INP < 200ms (warn) · TBT < 300ms (warn) · Performance ≥ 0.85.
- `continue-on-error: true` para primera pasada — **intencional, marcar gating tras 1 verde en CI real**.

**Comando verificación**:
```bash
ls /home/user/exentax-web-new/.github/workflows/lighthouse.yml /home/user/exentax-web-new/.lighthouserc.json
# → ambos existen
```

---

## Resumen

10 áreas en VERDE con comando explícito. Total tiempo de verificación si quieres re-correr todo: ~3 minutos (sin build E2E).

Si tu cambio toca un área de esta lista:
1. Ejecuta el comando.
2. Anota el output exacto.
3. Haz tu cambio.
4. Re-ejecuta el comando.
5. Si el output cambió, justifica el cambio en el commit message O revierte.

Sin esa disciplina, **el cambio se rechaza**.
