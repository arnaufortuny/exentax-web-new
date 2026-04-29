# Cierre a producción — calidad de idiomas, keys, rutas y sistemas validadores

**Fecha**: 2026-04-29 · **Task**: #78 · **Snapshot base**: `exentax-3.0` + Task #77 (revisión integral masiva).

> Auditoría de cierre senior-engineer enfocada en las **tres dimensiones críticas para deploy seguro**: (1) catálogos i18n alineados en los 6 idiomas soportados (es/en/fr/de/pt/ca), (2) sistema de rutas y slugs canónico con `hreflang` bidireccional y `x-default`, y (3) cobertura completa de validadores Zod sobre `server/routes` con tests verdes. Sin cambios de código en el branch — todo el trabajo es **verificación cruzada y reporte**.

---

## 1. Decisión go/no-go

**GO — apto para integración a `main` y deploy a Hostinger VPS** (con los pasos operativos descritos en `PENDING-FINAL.md #1`).

| Dimensión | Estado | Evidencia primaria |
|---|:---:|---|
| Catálogos i18n × 6 idiomas (claves alineadas, no extras, no vacías, sin placeholders desincronizados) | ✓ | `npm run i18n:check` → **1.558 keys × 6 langs · 0 missing · 0 extra · 0 empty · 0 placeholder mismatches · 0 hardcoded strings (783 ficheros escaneados)** |
| Lints i18n estrictos (literales en JSX, brand casing, dialecto pt-PT) | ✓ | `lint:i18n-extended` 0 hits · `lint:pt-pt` 115 ficheros OK · `lint:brand-casing` 0 ocurrencias `ExenTax` |
| Rutas/slugs canónicos × 6 idiomas (17 RouteKeys + blog cluster) con hreflang BCP-47 + x-default | ✓ | `seo:check` 0 broken links · `seo:slash` clean · `test:redirects` 9/9 · `serp-previews` 108 cards / 0 errors |
| Validadores Zod en endpoints API (POST con body) + tests | ✓ | **8 POST con body Zod** + **2 GET con query Zod** (10 schemas Zod totales) sobre **28 endpoints públicos inventariados** (path × método: 23 en `server/routes/public.ts` + 1 en `server/index.ts` + 3 en `server/routes/observability.ts` + 1 en `server/discord-bot.ts`) · `test:calculator` 123/123 · `test:newsletter` 55/55 · `test:booking` 54/54 |
| Quality gate paralelo (33 gates) | ✓ | `cd exentax-web && npm run check` → **EXIT 0 · 33/33 · wall 64,0 s** |
| Auditoría de seguridad de dependencias | ✓ | `npm audit --omit=dev` → **0 vulnerabilities** |
| TypeScript estricto | ✓ | `npx tsc --noEmit` → 0 errores |

Sin cambios de código aplicados en este branch — el trabajo de Tasks #46 (drift catálogo bridge v2), #66 (gate paralelo), #77 (revisión integral masiva) ya había dejado el sistema en verde. El cierre se limita a **verificación documentada** y propagación a los documentos raíz (`PRODUCTION-STATUS.md`, `PRODUCTION-CHECKLIST.md`, `CHANGELOG.md`).

---

## 2. i18n — calidad de idiomas y keys

### 2.1 Catálogos por idioma

Los seis catálogos viven en `exentax-web/client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts` (TypeScript con tipo `Translations` derivado de `TranslationKey` en `keys.generated.ts`). El generador `scripts/i18n/generate-types.mjs` produce el tipo desde `es.ts` (idioma fuente) y el verificador `scripts/i18n/verify-translations.mjs` enforce paridad estructural y de placeholders contra los otros 5.

| Idioma | Fichero | Líneas | Keys (verificadas por `i18n:check`) | Diff vs base | Estado |
|---|---|---:|---:|---:|:---:|
| Español (es-ES) — fuente canónica | `locales/es.ts` | 2.785 | 1.558 | base | ✓ |
| Inglés (en-US) | `locales/en.ts` | 2.357 | 1.558 | 0 | ✓ |
| Francés (fr-FR) | `locales/fr.ts` | 2.360 | 1.558 | 0 | ✓ |
| Alemán (de-DE) | `locales/de.ts` | 2.359 | 1.558 | 0 | ✓ |
| Portugués (pt-PT) | `locales/pt.ts` | 2.363 | 1.558 | 0 | ✓ |
| Catalán (ca-ES) | `locales/ca.ts` | 2.364 | 1.558 | 0 | ✓ |

Las diferencias de líneas obedecen a comentarios in-line y formateo (no a contenido). Las **1.558 claves** están presentes con el mismo path en cada idioma, los placeholders `{var}` coinciden uno a uno, y no hay strings vacíos.

### 2.2 Verificación

```bash
cd exentax-web && npm run i18n:check
```

Resumen del run (2026-04-29):

```
═══════════════════════════════════════════════
 Summary
═══════════════════════════════════════════════
Total missing keys:        0
Total extra keys:          0
Total empty values:        0
Placeholder mismatches:    0
Structure mismatches:      0
Possibly untranslated:     0

Result: PASS ✓
═══════════════════════════════════════════════
 Hardcoded user-visible strings
═══════════════════════════════════════════════
Files scanned: 783
Findings:      0
  JSX text:    0
  Attributes:  0

✓ No hardcoded user-visible strings detected.
```

Adicional:

- `npm run lint:i18n-extended` — escáner extendido sobre `client/src/**`: **0 hits** (no hay literales en `placeholder=`, `aria-label=`, `title=`, `alt=` ni en `toast()`/`useToast()` payloads).
- `npm run lint:pt-pt` — verifica que el catálogo `pt.ts` no usa formas brasileñas (`você`, `vocês`, gerundio cont. continuo, `time` por `equipa`, etc.) sobre **115 ficheros**: **0 hits**.
- `npm run lint:brand-casing` — verifica que no aparece la grafía incorrecta `ExenTax` en lugar de `Exentax` en **catálogos i18n + componentes + posts blog**: **0 ocurrencias**.

### 2.3 Tipos generados

El fichero `client/src/i18n/keys.generated.ts` deriva el tipo `TranslationKey` desde `es.ts` y se regenera automáticamente al inicio de `npm run i18n:check`. El runner del 2026-04-29 no produjo cambio en disco (los tipos ya estaban sincronizados). El componente `<T>` y el hook `useT()` consumen este tipo, por lo que cualquier llamada con una clave inexistente falla en compilación (`tsc --noEmit` → 0 errores).

---

## 3. Rutas, slugs y hreflang

### 3.1 Source-of-truth

`exentax-web/shared/routes.ts` declara:

- `SUPPORTED_LANGS = ["es","en","fr","de","pt","ca"]` (6 idiomas).
- `ROUTE_SLUGS: Record<RouteKey, Record<SupportedLang,string>>` con **17 claves** (ver tabla abajo).
- `HREFLANG_BCP47: { es:"es-ES", en:"en-US", fr:"fr-FR", de:"de-DE", pt:"pt-PT", ca:"ca-ES" }` — los códigos BCP-47 que emite el sitemap y `<link rel="alternate" hreflang>`.
- `getLocalizedPath(routeKey, lang)` — único helper que produce la URL pública. Toda emisión de URL en el sistema (sitemap, canonical, hreflang, internal links, redirects) pasa por aquí.

El catálogo de slugs por blog post vive en `exentax-web/client/src/data/blog-posts-slugs.ts` (≥80 posts × 6 langs, validado por `seo:check`).

### 3.2 Tabla canónica de rutas (17 RouteKeys × 6 idiomas)

Snapshot del `ROUTE_SLUGS` en `shared/routes.ts` (cada fila es una ruta canónica que se sirve en los 6 idiomas con prefijo `/{lang}/{slug}`):

| RouteKey | es | en | fr | de | pt | ca |
|---|---|---|---|---|---|---|
| `home` | _(raíz)_ | _(raíz)_ | _(raíz)_ | _(raíz)_ | _(raíz)_ | _(raíz)_ |
| `how_we_work` | `como-trabajamos` | `how-we-work` | `comment-nous-travaillons` | `wie-wir-arbeiten` | `como-trabalhamos` | `com-treballem` |
| `our_services` | `servicios` | `services` | `services` | `leistungen` | `servicos` | `serveis` |
| `about_llc` | `sobre-las-llc` | `about-llc` | `a-propos-des-llc` | `uber-llc` | `sobre-llc` | `sobre-les-llc` |
| `faq` | `preguntas-frecuentes` | `faq` | `questions-frequentes` | `haufige-fragen` | `perguntas-frequentes` | `preguntes-frequents` |
| `book` | `agendar` | `book` | `reserver` | `buchen` | `agendar` | `agendar` |
| `pillar_open_llc` | `abrir-llc-estados-unidos` | `open-llc-usa` | `ouvrir-llc-etats-unis` | `llc-usa-eroeffnen` | `abrir-llc-eua` | `obrir-llc-eua` |
| `service_llc_nm` | `servicios/llc-nuevo-mexico` | `services/llc-new-mexico` | `services/llc-nouveau-mexique` | `leistungen/llc-new-mexico` | `servicos/llc-novo-mexico` | `serveis/llc-nou-mexic` |
| `service_llc_wy` | `servicios/llc-wyoming` | `services/llc-wyoming` | `services/llc-wyoming` | `leistungen/llc-wyoming` | `servicos/llc-wyoming` | `serveis/llc-wyoming` |
| `service_llc_de` | `servicios/llc-delaware` | `services/llc-delaware` | `services/llc-delaware` | `leistungen/llc-delaware` | `servicos/llc-delaware` | `serveis/llc-delaware` |
| `service_llc_fl` | `servicios/llc-florida` | `services/llc-florida` | `services/llc-floride` | `leistungen/llc-florida` | `servicos/llc-florida` | `serveis/llc-florida` |
| `service_itin` | `servicios/obten-tu-itin` | `services/get-your-itin` | `services/obtiens-ton-itin` | `leistungen/hol-deine-itin` | `servicos/obtenha-seu-itin` | `serveis/obte-el-teu-itin` |
| `legal_terms` | `legal/terminos` | `legal/terms` | `legal/conditions` | `legal/agb` | `legal/termos` | `legal/termes` |
| `legal_privacy` | `legal/privacidad` | `legal/privacy` | `legal/confidentialite` | `legal/datenschutz` | `legal/privacidade` | `legal/privacitat` |
| `legal_cookies` | `legal/cookies` | `legal/cookies` | `legal/cookies` | `legal/cookies` | `legal/cookies` | `legal/cookies` |
| `legal_refunds` | `legal/reembolsos` | `legal/refunds` | `legal/remboursements` | `legal/erstattungen` | `legal/reembolsos` | `legal/reemborsaments` |
| `legal_disclaimer` | `legal/disclaimer` | `legal/disclaimer` | `legal/avertissement` | `legal/haftungsausschluss` | `legal/aviso-legal` | `legal/avis-legal` |

**Total páginas canónicas**: 17 RouteKeys × 6 idiomas = **102 URLs públicas**, más el blog index (`/{lang}/blog`) y los posts individuales (gestionados por `blog-posts-slugs.ts`).

### 3.3 Hreflang y `x-default`

Cada `<url>` del sitemap (`sitemap-pages.xml` generado dinámicamente en `server/routes/public.ts:1351`) incluye:

- 6 `<xhtml:link rel="alternate" hreflang="{BCP47}" href="{absolute}">` con los códigos `es-ES`, `en-US`, `fr-FR`, `de-DE`, `pt-PT`, `ca-ES`.
- 1 `<xhtml:link rel="alternate" hreflang="x-default" href="{es-absolute}">` apuntando siempre a la versión en español (idioma fuente).

El HTML servido al browser incluye los mismos `<link rel="alternate">` en `<head>` vía el componente `<HreflangLinks>` (cliente) y la inyección server-side en `server/index.ts`. El `<link rel="canonical">` es único por página y autoreferente.

### 3.4 Verificación

```bash
cd exentax-web && npm run seo:check        # → 0 broken links
cd exentax-web && npm run seo:slash        # → clean (no trailing-slash leaks)
cd exentax-web && npm run seo:icons        # → todos los favicon/og-image presentes
cd exentax-web && npm run seo:serp-previews # → 108 cards · 0 errors · 18 warnings near-limit (no bloqueantes)
cd exentax-web && npm run test:redirects   # → 9/9 PASS (legacy → canonical)
cd exentax-web && npm run test:geo         # → 12/12 PASS (geo-targeting cookies + IP)
```

Smoke server-side ejecutado en Task #77 sigue válido: **102 / 102 URLs canónicas = 200**, 0 redirects inesperados, headers de seguridad presentes.

---

## 4. Validadores Zod en `server/routes/*`

### 4.1 Criterio de conteo

Los inventarios de esta sección cuentan **endpoints públicos por par único `(path, método HTTP)`**. Cuando una misma ruta admite GET y POST (caso de los unsubscribe RFC 8058), cuentan como **dos entradas**. Quedan **fuera del conteo**:

- Endpoints de test gateados por `NODE_ENV !== "production"` (1 en `public.ts:260`, `/api/__test/render-calculator-email`).
- Endpoints internos gateados por agente o ENV (2 en `public.ts:1560-1563`, `/internal/reports/indexing*`).
- Rutas administrativas (`server/routes/admin.ts`, gateadas por sesión + rol) — quedan fuera del alcance de esta auditoría y se cubren en su propia suite (`test:admin`). Ver follow-up #84.
- Catch-all duplicado de blog (`/:lang/blog/:slug` registrado dos veces en `public.ts:290+307` para `next()`-fallthrough): cuenta como **1 entrada** (mismo par path+método).

**Total inventariado**: **28 endpoints públicos** = 23 (`server/routes/public.ts`) + 1 (`server/index.ts`) + 3 (`server/routes/observability.ts`) + 1 (`server/discord-bot.ts`).

### 4.2 Tabla `endpoint → método → schema → handler → test`

| Endpoint | Método | Origen | Schema Zod (línea) | Manejo de error | Suite |
|---|---|---|---|---|---|
| `/api/bookings/blocked-days` | GET | `public.ts:379` | `blockedDaysQuerySchema` (`public.ts:375`) | `apiValidationFail` | `test:booking` |
| `/api/bookings/available-slots` | GET | `public.ts:398` | `slotsQuerySchema` (`public.ts:394`) | `apiValidationFail` | `test:booking` |
| `/api/bookings/draft` | POST | `public.ts:485` | `bookingDraftSchema` (`public.ts:479`) | `apiValidationFail` | `test:booking` |
| `/api/bookings/book` | POST | `public.ts:513` | `bookingRequestSchema` (`public.ts:448`) | `apiValidationFail` | `test:booking` |
| `/api/booking/:bookingId` | GET | `public.ts:735` | check manual de `bookingId` (longitud + regex) | `apiFail 400` | `test:booking` |
| `/api/booking/:bookingId/reschedule` | POST | `public.ts:759` | `rescheduleSchema` (`public.ts:779`) | `apiValidationFail` | `test:booking` |
| `/api/booking/:bookingId/cancel` | POST | `public.ts:908` | check manual de `bookingId` + token | `apiFail 400` | `test:booking` |
| `/api/calculator-leads` | POST | `public.ts:959` | `calculatorLeadSchema` (importado de `shared/schema.ts`) | `apiValidationFail` | `test:calculator` (123/123) |
| `/api/consent` | POST | `public.ts:1124` | `cookieConsentSchema` (`public.ts:1116`) | `apiOk` (silent — telemetría) | `test:audit-faqs` |
| `/api/newsletter/subscribe` | POST | `public.ts:1161` | `newsletterSubscribeSchema` (`public.ts:1153`) | `apiValidationFail` | `test:newsletter` (55/55) |
| `/api/newsletter/unsubscribe/:token` | GET | `public.ts:1754` | check manual `token.length 1-200` | HTML 400 | `test:newsletter` |
| `/api/newsletter/unsubscribe/:token` | POST | `public.ts:1755` | check manual `token.length 1-200` | HTML 400 | `test:newsletter` |
| `/api/drip/unsubscribe/:token` | GET | `public.ts:1782` | check manual `token.length 1-200` | HTML 400 | `test:newsletter` (drip subset) |
| `/api/drip/unsubscribe/:token` | POST | `public.ts:1783` | check manual `token.length 1-200` | HTML 400 | `test:newsletter` (drip subset) |
| `/api/visitor` | POST | `public.ts:1222` | `visitorSchema` (`public.ts:1209`) | `apiOk` (silent — telemetría) | `test:geo` |
| `/api/geo` | GET | `public.ts:334` | sin body (lookup por IP) | — | `test:geo` |
| `/api/legal/versions` | GET | `public.ts:1308` | sin body (rate-limited) | `apiRateLimited` | `test:audit-faqs` |
| `/:lang/blog/:slug` | GET | `public.ts:290+307` | check manual de slug+lang | `next()` fallthrough | `seo:check` |
| `/sitemap.xml` | GET | `public.ts:1328` | sin body | — | `seo:check` |
| `/sitemap-pages.xml` | GET | `public.ts:1351` | sin body | — | `seo:check` |
| `/sitemap-faq.xml` | GET | `public.ts:1428` | sin body | — | `seo:check` |
| `/sitemap-blog.xml` | GET | `public.ts:1458` | sin body | — | `seo:check` |
| `/robots.txt` | GET | `public.ts:1589` | sin body | — | `seo:check` |
| `/api/health` | GET | `index.ts:236` | sin body (liveness) | — | smoke 102 rutas |
| `/api/health/ready` | GET | `observability.ts:218` | sin body (readiness) | 503 si degraded | smoke 102 rutas |
| `/api/metrics` | GET | `observability.ts:232` | sin body (bearer `METRICS_TOKEN`) | 401 / 503 | `audit:bundle` |
| `/api/client-errors` | POST | `observability.ts:274` | `clientErrorSchema` (`observability.ts:152`) | 400 + log | `test:perf-gate-bypass-notify` |
| `/api/discord/interactions` | POST | `discord-bot.ts:569` | verificación de firma Ed25519 (no Zod, requisito Discord) | 401 | `test:discord-regression` (6/6) |

**Total**: 28 entradas.

### 4.3 Resumen agregado

- **8 POST con body validado por Zod** — `bookingDraftSchema`, `bookingRequestSchema`, `rescheduleSchema`, `calculatorLeadSchema`, `cookieConsentSchema`, `newsletterSubscribeSchema`, `visitorSchema`, `clientErrorSchema`.
- **2 GET con query validada por Zod** — `blockedDaysQuerySchema`, `slotsQuerySchema`.
- **10 schemas Zod totales** (declaraciones `z.object({…})`) verificadas en `public.ts` (9: 7 body + 2 query) + `observability.ts` (1: `clientErrorSchema`).
- **4 endpoints con tokens en path** validados por longitud + regex (1-200 chars) — los 2 unsubscribe (RFC 8058 GET+POST) + booking GET / cancel POST. Zod no aporta sobre identificadores opacos y se sigue la convención del módulo.
- **1 endpoint con verificación de firma Ed25519** (`/api/discord/interactions`) — requisito de la API de Discord.
- **0 endpoints con body sin validar** — verificado por inspección manual de los 1.797 líneas de `public.ts` + 316 líneas de `observability.ts` + el handler de Discord.

### 4.4 Patrón de validación

Todos los endpoints siguen el mismo contrato:

```ts
const parsed = <schema>.safeParse(req.body);            // o req.query
if (!parsed.success) return apiValidationFail(res, parsed.error);
// ... lógica con parsed.data tipado
```

`apiValidationFail` (`server/utils/api-response.ts`) emite `400 { error: { code: "VALIDATION_FAILED", message: <i18n>, fields: [...] } }` con los nombres de campo y el código i18n del primer error (`zodEmailTooLong`, `zodMustAcceptPrivacy`, etc.). Los códigos i18n están en los catálogos de los 6 idiomas y se resuelven server-side via `backendLabel(code, lang)` (`server/utils/backend-labels.ts`).

Los flujos silenciosos (`/api/consent`, `/api/visitor`) devuelven `apiOk(res)` aun en error de validación: son endpoints fire-and-forget de telemetría y no deben bloquear la UX si el cliente envía un payload malformado. Esto es **deliberado y comentado in-line** en cada handler.

### 4.5 Rate-limiting (capa previa al validador)

Todos los endpoints públicos pasan por un limiter dedicado **antes** del `safeParse`, devolviendo `apiRateLimited` (429) cuando se excede:

| Limiter | Endpoints afectados | Contrato |
|---|---|---|
| `bookingLimiter` (`checkBookingRateLimit`) | `/api/booking*` | 10 req/min/IP |
| `calcLimiter` (`checkCalcRateLimit`) | `/api/calculator-leads` | 5 req/min/IP |
| `newsletterLimiter` (`checkNewsletterRateLimit`) | `/api/newsletter/subscribe` | 5 req/min/IP |
| `consentLimiter` (`checkConsentRateLimit`) | `/api/consent` | 30 req/min/IP |
| `visitorLimiter` (`checkVisitorRateLimit`) | `/api/visitor` | 60 req/min/IP |
| `publicDataLimiter` (`checkPublicDataRateLimit`) | `/api/legal/versions`, unsubscribe | 60 req/min/IP |
| limiter global de `/api/*` | `/api/health/ready`, `/api/metrics`, `/api/client-errors` (más rate-limit interno por IP en `client-errors`) | 200 req/min/IP global |

En producción, si `REDIS_URL` está configurado, los limiters comparten estado vía Redis (locks distribuidos); en sandbox/dev se usa el store en memoria. El comportamiento es idéntico en términos de respuesta HTTP.

### 4.6 Cobertura de tests (suites verdes 2026-04-29)

| Suite | Resultado | Comando |
|---|---|---|
| `test:calculator` | **123/123 PASS** | `npm run test:calculator` |
| `test:booking` | **54/54 PASS** | `npm run test:booking` |
| `test:newsletter` | **55/55 PASS** | `npm run test:newsletter` |
| `test:indexnow` | **10/10 PASS** | `npm run test:indexnow` |
| `test:discord-regression` | **6/6 PASS** | `npm run test:discord-regression` |
| `test:geo` | **12/12 PASS** | `npm run test:geo` |
| `test:redirects` | **9/9 PASS** | `npm run test:redirects` |
| `test:audit-faqs` | PASS | `npm run test:audit-faqs` |
| `test:lint-blog` | **38/38 PASS** | `npm run test:lint-blog` |
| `test:lint-banking-entities` | PASS | `npm run test:lint-banking-entities` |
| `test:no-inline-related` | **82/82 PASS** | `npm run test:no-inline-related` |
| `test:risk-bridge-inject` | **111/111 PASS** | `npm run test:risk-bridge-inject` |
| `test:masterpiece-audit` | **61/61 PASS** | `npm run test:masterpiece-audit` |
| `test:masterpiece-audit-rules` | **43/43 PASS** | `npm run test:masterpiece-audit-rules` |
| `test:bundle-diff-notify` | PASS | `npm run test:bundle-diff-notify` |
| `test:perf-gate-bypass-notify` | PASS | `npm run test:perf-gate-bypass-notify` |

---

## 5. Quality gate consolidado

Run final 2026-04-29:

```bash
cd exentax-web && npm run check
```

Resultado: **EXIT 0 · 33 / 33 gates verde · wall 64,0 s**. Top-5 más lentos:

| Gate | Duración | Resultado |
|---|---:|:---:|
| `test:discord-regression` | 63,9 s | PASS |
| `audit:bundle` | 57,3 s | PASS |
| `blog:validate-all` | 45,2 s | PASS |
| `tsc` | 28,2 s | PASS |
| `test:newsletter` | 18,3 s | PASS |

Otros gates relevantes para esta auditoría:

- `i18n:check` — 5,1 s — PASS
- `lint:pt-pt` — 1,1 s — PASS
- `lint:brand-casing` — 3,0 s — PASS
- `seo:check` — 5,8 s — PASS
- `seo:slash` — 2,2 s — PASS
- `seo:masterpiece-strict` — 6,4 s — PASS

Adicional fuera del orquestador:

- `npx tsc --noEmit` — 0 errores.
- `npm audit --omit=dev` — **0 vulnerabilities**.

---

## 6. Hallazgos sin cambio (decisiones documentadas)

1. **18 warnings en `seo:serp-previews`** — títulos con espacio horizontal escaso en el preview de Google (no errors, no bloqueantes para el cierre). Tratamiento editorial diferido (ya documentado en Task #77).
2. **Endpoints administrativos (`server/routes/admin.ts`)** quedan fuera del alcance — todos sus POST tienen Zod, pero su suite (`test:admin`) requiere sesión autenticada y no se ejecuta por defecto en `npm run check`. El gate `tsc` cubre tipos.
3. **`/api/discord/interactions`** no usa Zod sino verificación de firma Ed25519 (requisito de la API de Discord). El payload se procesa por `verifyDiscordRequest()` antes de tocar la lógica. Cubierto por `test:discord-regression` (6/6).
4. **`/api/consent` y `/api/visitor`** devuelven `apiOk` aun en error de validación, por diseño (telemetría silenciosa). El payload inválido se descarta sin persistir y sin filtrar la causa al cliente.
5. **`keys.generated.ts`** se regenera automáticamente al inicio de `i18n:check`. El run del 2026-04-29 no produjo cambio en disco.

---

## 7. Comandos verificados (auditoría completa)

```bash
cd exentax-web

# Idiomas
npm run i18n:check              # 1.558 keys × 6 langs · 0 missing/extra/empty
npm run lint:i18n-extended      # 0 hits
npm run lint:pt-pt              # 115 ficheros OK
npm run lint:brand-casing       # 0 ExenTax

# Rutas y SEO
npm run seo:check               # 0 broken links
npm run seo:slash               # clean
npm run seo:icons               # OK
npm run seo:serp-previews       # 108 cards / 0 errors
npm run test:redirects          # 9/9 PASS
npm run test:geo                # 12/12 PASS

# Validadores y APIs
npm run test:calculator         # 123/123 PASS
npm run test:booking            # 54/54 PASS
npm run test:newsletter         # 55/55 PASS
npm run test:discord-regression # 6/6 PASS
npm run test:indexnow           # 10/10 PASS

# Calidad transversal
npx tsc --noEmit                # 0 errors
npm audit --omit=dev            # 0 vulnerabilities
npm run check                   # EXIT 0 · 33/33 · wall 64,0 s
```

---

## 8. Referencias

- Source-of-truth de slugs: `exentax-web/shared/routes.ts` (`ROUTE_SLUGS`, `getLocalizedPath`, `HREFLANG_BCP47`).
- Catálogos i18n: `exentax-web/client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts`.
- Tipo derivado: `exentax-web/client/src/i18n/keys.generated.ts` (auto).
- Verificadores i18n: `exentax-web/scripts/i18n/verify-translations.mjs`, `scripts/i18n/lint-extended.mjs`, `scripts/i18n/lint-pt-pt.mjs`, `scripts/i18n/lint-brand-casing.mjs`.
- Endpoints públicos: `exentax-web/server/routes/public.ts` (1797 líneas).
- Endpoints observabilidad: `exentax-web/server/routes/observability.ts`.
- Esquemas Zod compartidos: `exentax-web/shared/schema.ts` (`calculatorLeadSchema`, etc.).
- Helpers de respuesta: `exentax-web/server/utils/api-response.ts` (`apiOk`, `apiFail`, `apiValidationFail`, `apiRateLimited`).
- Sitemap handlers: `exentax-web/server/routes/public.ts:1326-1500`.
- Snapshot Task #77: `docs/auditoria-2026-04/revision-integral-masiva-2026-04-29.md`.
- Estado por área: `PRODUCTION-STATUS.md`.
- Checklist accionable de deploy: `PRODUCTION-CHECKLIST.md`.
- Pendientes residuales: `PENDING-FINAL.md`.
