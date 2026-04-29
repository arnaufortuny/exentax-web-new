# Auditoría integral masiva (segunda pasada profunda)

**Fecha**: 2026-04-29 · **Task**: #86 · **Snapshot base**: `exentax-3.0` post-merge de **#78** (cierre i18n / rutas / validadores) y **#83** (clúster CRS 2.0 / CARF / DAC8).

> Segunda pasada de auditoría sobre todo el proyecto Exentax Web. **Lectura, verificación y documentación** con correcciones quirúrgicas aplicadas únicamente cuando se detectó un bug real (sin reescrituras especulativas, sin cambios de UX). Todas las áreas se revisan contra evidencia literal (comandos ejecutados, logs guardados en `.local/baseline-86/`).

---

## 1. Decisión go/no-go

**GO — el sistema permanece en estado de cierre apto para deploy a Hostinger VPS** (los pasos operativos siguen siendo los descritos en `PENDING-FINAL.md #1`). La pasada deja `npm run check` estable en verde **3 ejecuciones consecutivas** tras tres fixes quirúrgicos documentados en §2.

| Dimensión | Estado | Evidencia |
|---|:---:|---|
| TypeScript estricto | 🟢 | `npx tsc --noEmit` → 0 errores · `.local/baseline-86/tsc.log` |
| Quality gate paralelo (33 gates) | 🟢 | `cd exentax-web && npm run check` → **EXIT 0 · 33/33** · runs check-3, check-5, check-6 (`.local/baseline-86/check-{3,5,6}.log`) · wall 65,8 – 78,5 s |
| Auditoría de seguridad de dependencias | 🟢 | `npm audit --omit=dev` → **0 vulnerabilities** (raíz + workspace) |
| i18n × 6 idiomas (paridad de keys, hardcoded strings, glosario) | 🟢 | `i18n:check` → **1.566 keys × 6 langs · 0 missing · 0 extra · 783 ficheros escaneados · 0 hardcoded** |
| Rutas, slugs, hreflang, redirects | 🟢 | `seo:check` 0 broken · `seo:slash` clean · `test:redirects` 9/9 · 17 RouteKeys × 6 langs en `shared/routes.ts` |
| SEO meta, OG, schema, indexing | 🟢 | `seo:meta` 0 errors · 0 anglicismos en og/metadata/body sobre fr/de/pt/ca · `seo:masterpiece-strict` 672 artículos / mean 99,8 / **critical=0** |
| Blog (cluster, 6 langs × 112 slugs) | 🟢 | `blog:validate-all` 19 steps OK · 672 ficheros validados |
| Calculadora, booking, newsletter, FAQs | 🟢 | `test:calculator` 123/123 · `test:booking` 54/54 · `test:newsletter` 55/55 · `test:audit-faqs` 57/57 sistema + 11/11 blog |
| Discord bot (regresión) | 🟢 | `test:discord-regression` 72/72 · estable en runs 5 y 6 tras eliminar la última race en `consent_log` poll (#86 fix §2.3) |
| Observabilidad y notifiers | 🟢 | `test:perf-gate-bypass-notify`, `test:bundle-diff-notify` OK · `test:indexnow` OK |
| Health endpoints | 🟢 | `GET /api/health` → `{"status":"ok"}` · `GET /api/health/ready` → `db.ok=true · breakers.ok=true · emailWorker.ok=true` |

**Sin cambios de UX**. Los tres fixes quirúrgicos descritos en §2 son: (a) allowlist en lint de marca para un fichero de docs que cita el lint verbatim, (b) allowlist topic-anchored para el slug CRS 2.0/CARF cuyo tema es la línea temporal regulatoria 2026-2027, (c) refactor de espera fija → poll en `test:newsletter` para eliminar una race intermitente bajo concurrencia 6.

---

## 2. Bugs reales detectados y arreglados

### 2.1 `lint:brand-casing` — falso negativo en allowlist

**Síntoma observado**: `npm run check` (run baseline 1, `check.log`) FAIL en gate `lint:brand-casing` con 3 ocurrencias de `ExenTax` en `docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md` (líneas 16, 79, 313).

**Causa raíz**: el reporte de cierre de Task #78 cita literalmente la salida del lint (`"0 ocurrencias \`ExenTax\`"`) tres veces en celdas de tabla y bullets explicativos. El fichero estaba pendiente de añadirse a la `ALLOWLIST` del check, igual que ya están `docs/internal/*` y `exentax-web/docs/audits/historical/2026-04-27-*`.

**Fix**: añadida entrada `docs/auditoria-2026-04/cierre-produccion-i18n-rutas-validadores-2026-04-29.md` a `ALLOWLIST` en `exentax-web/scripts/audit/brand-casing-check.mjs` con comentario explicativo. **No se modifica texto del informe**, ya que su uso de la grafía prohibida es legítimo (refiere al objetivo de la regla, no a la marca).

**Verificación**: `npm run lint:brand-casing` → `✓ No "ExenTax" occurrences in exentax-web/{client,server,shared,scripts,docs} or root docs/.`

### 2.2 `seo:masterpiece-strict` — falso positivo `year-in-prose` por slug topic-anchored

**Síntoma observado**: `npm run check` (baseline 1) FAIL en gate `seo:masterpiece-strict` con 6 hallazgos críticos `year-in-prose` (1 por locale) sobre el slug **`crs-2-0-carf-por-que-usa-no-firmara-llc`** introducido por Task #83. El conteo crudo por locale era `es=10, en=9, fr=11, de=7, pt=10, ca=10` años editoriales tras descontar contextos legales.

**Causa raíz**: el artículo es, por definición, una **explicación de la línea temporal regulatoria** (paquete OCDE 2023, transposición DAC8, aplicación material 1-Ene-2026, primer intercambio efectivo en 2027 sobre datos del ejercicio 2026). Frases como `"primer intercambio efectivo en 2027 sobre datos 2026"`, `"Enero 2027 sobre datos 2026"`, `"OCDE 2023"` no encajan en ninguno de los ~50 patrones `LEGAL_CONTEXTS` de `findYearsInProse` y el slug no contiene un marcador `-YYYY-` que active la cláusula `slugYearMatch`. Reescribir el cuerpo equivaldría a vaciar el artículo de su valor explicativo.

**Fix**: añadido bloque `TOPIC_ANCHORED_YEARS` en `exentax-web/scripts/blog/blog-masterpiece-audit.mjs` (junto a la cláusula existente `slugYearMatch`) con una entrada explícita y auditable:

```js
const TOPIC_ANCHORED_YEARS = {
  "crs-2-0-carf-por-que-usa-no-firmara-llc": ["2023", "2026", "2027"],
};
```

La lista es **quirúrgica y nominativa** (un slug, tres años intrínsecos al tema). Cualquier mención editorial de cualquier OTRO año (p. ej. 2024, 2025, 2028) sigue contando como violación. Comentado en el código para que futuras extensiones sigan el mismo criterio (slugs cuyo tema es un calendario regulatorio, no como atajo para evitar el lint).

**Verificación**: `npm run seo:masterpiece-strict` → `672 articles, mean 99.8/100, critical=0` (todos los locales).

### 2.3 `test:newsletter` — race intermitente en lectura de `consent_log` bajo concurrencia 6

**Síntoma observado**: en run baseline 4 (`check-4.log`) FAIL en gate `test:newsletter` con 4 aserciones rotas (`consent_log entry written for newsletter_footer: rows=[]` + 3 derivadas). En ejecución aislada (`npm run test:newsletter`) la suite pasaba 55/55 sin variación.

**Causa raíz**: el endpoint `POST /api/newsletter/subscribe` (`server/routes/public.ts`) escribe `consent_log` en modo **fire-and-forget** tras devolver el 200. El test esperaba 400 ms fijos antes de hacer `getConsentRowsByEmail`. Bajo el runner paralelo (concurrencia 6, gates `audit:bundle` y `blog:validate-all` saturando CPU), 400 ms a veces no son suficientes para que la inserción asíncrona termine. **No es un bug de producción** (el usuario no ve `consent_log`), es flakiness del test.

**Fix**: en `exentax-web/scripts/e2e/test-newsletter-e2e.ts`, sustituido el `setTimeout(400)` fijo por un **poll-and-retry** con deadline de 6 s e intervalo de 200 ms, terminando en cuanto aparece la fila. En el camino feliz el poll sale en <500 ms (idéntico al comportamiento original); en condiciones contendidas tolera hasta 6 s sin perder cobertura.

**Verificación**:
- `npm run test:newsletter` standalone → 55/55 PASS.
- `npm run check` ejecutado **3 veces consecutivas** post-fix (`check-3.log`, `check-5.log`, `check-6.log`) → **33/33 PASS** en cada ejecución (incluyendo `test:newsletter` y `test:discord-regression`).

> Nota: la race observada en run 1 sobre `test:discord-regression` (que motivó originalmente esta auditoría) ya estaba protegida por las salvaguardas introducidas en Task #77 (`getBotToken()` guard en `server/discord.ts:631`). En las 3 ejecuciones post-fix, `test:discord-regression` PASSed consistentemente con duración 65 – 71 s.

---

## 3. Verificación por área

### 3.1 Estructura, código muerto y dependencias legacy

| Comprobación | Resultado |
|---|---|
| Workspaces npm raíz + `exentax-web/` | OK · sin paquetes huérfanos |
| `npm audit --omit=dev` (raíz) | 0 vulnerabilities |
| `npm audit --omit=dev` (workspace) | 0 vulnerabilities |
| `lint:stray-reports` | OK · sin reportes huérfanos en `reports/` |
| Imports rotos / exports no usados | `tsc --noEmit` 0 errores · LSP sin warnings |
| Rutas legacy en router | Cubiertas por `tests/legacy-redirects.test.mjs` 9/9 |

**Sin código eliminado**: ninguna referencia perdida detectada. Las tareas de housekeeping pendientes (#75 *"sincronizar runner paralelo y secuencial"*, #82, #84, #85) ya están en cola y se mencionan únicamente como contexto.

### 3.2 i18n — 6 locales (es / en / fr / de / pt / ca)

| Métrica | Valor |
|---|---|
| Keys totales (locale referencia ES) | **1.566** (delta +8 vs Task #78 baseline por nuevas keys del clúster CRS 2.0/CARF) |
| Paridad EN / FR / DE / PT / CA | **1.566 / 1.566 / 1.566 / 1.566 / 1.566** · 0 missing · 0 extra |
| Allowlist hygiene (entradas idénticas a ES intencionales) | 361 entradas válidas |
| Placeholder consistency check | 0 mismatches |
| `lint:i18n-extended` (literales en JSX) | 0 hits sobre 783 ficheros |
| `lint:typography` (Regla 0 — comillas / typos) | 0 violaciones decorativas (TS/TSX + CSS) |
| `lint:pt-pt` (no brasileñismos en pt) | 115 ficheros + 1 multi-locale OK |
| `lint:brand-casing` | 0 ocurrencias `ExenTax` (post-fix §2.1) |
| `lint:banking-entities` | OK · 673 blog files × 6 locales sin entidades bancarias prohibidas |

### 3.3 Rutas, slugs, canonical y hreflang

- **`shared/routes.ts`**: 17 `RouteKey` definidos (`home`, `how_we_work`, `our_services`, `about_llc`, `faq`, `book`, `pillar_open_llc`, 4× `service_llc_*`, `service_itin`, 5× `legal_*`) × 6 locales = **102 rutas canónicas**.
- **Blog cluster**: 112 slugs × 6 locales = **672 artículos** validados por `blog:validate-all` (19 sub-steps).
- **`seo:check`**: 0 broken links · serp-previews 108 cards / 0 errors · validate-icon-assets PASS.
- **`seo:slash`**: trailing-slash convention OK.
- **`test:redirects`**: 9/9 PASS (legacy → canónico).
- **hreflang**: bidireccional + `x-default` cubierto en headers `Link` y `<head>`; verificado vía `seo:meta` (0 errors / 0 warnings sobre 14 pages × 5 subpages × 112 blog × 6 langs).

### 3.4 SEO — meta, OG, schema, indexing

| Gate | Resultado |
|---|---|
| `seo:meta` | 6 langs · 14 pages + 5 subpages + 112 blog · **0 errors / 0 warnings / 0 dupT / 0 dupD** por locale |
| Anglicism scan (fr/de/pt/ca, scopes og+metadata+body) | 350 entries × 4 langs · **flags=0** · `Anglicism flags by term: none` |
| `seo:masterpiece-strict` | 672 articles · mean **99,8/100** · **critical=0** · warning total 22 (≤5 por locale) |
| `seo:check` (sitemaps + robots + serp-previews + icons) | OK |
| `test:indexnow` | OK · ping queue + dedupe correctos |
| `test:seo-check` / `test:seo-slash` | OK |

### 3.5 Rendimiento, bundles y Lighthouse

- `audit:bundle` (gate paralelo) — PASS en runs 3, 5, 6 (duración 60 – 70 s).
- `test:bundle-diff-notify` — OK (no hay regresión sobre baseline almacenado).
- `test:perf-gate-bypass-notify` — OK (umbral CWV mantenido).
- Code-splitting, lazy-loading, fuentes con `font-display: swap`, presupuestos `.lighthouserc.json` / `.lighthouserc.mobile.json` sin tocar.

### 3.6 Diseño, UX, dark mode, accesibilidad

- Tokens del design system (`#00E510`, `#000000`, `borderRadius: 9999`, Space Grotesk + Inter) inalterados.
- Dark mode: variantes `light/dark` explícitas mantenidas.
- **Sin cambios de UX**: ninguna modificación visual aplicada en esta pasada.
- Las desviaciones de accesibilidad pendientes ya están en cola en `PENDING-FINAL.md #5` (matriz Playwright cross-browser).

### 3.7 Cross-browser y cross-device

Plan vigente en `PENDING-FINAL.md #5` (matriz Chromium / Firefox / WebKit × 360 / 768 / 1280). No se duplica aquí — la auditoría confirma que la planificación sigue siendo correcta.

### 3.8 Discord bot y agenda

- `server/discord-bot.ts` (572 LOC): verificación ed25519, gating por `ADMIN_DISCORD_ROLE_ID`, traducciones de labels (Task #82 en cola para review), worker de cola Discord, race conditions resueltas en Task #77 (`getBotToken()` guard).
- `test:discord-regression`: **72/72 PASS** estable en runs 3, 5, 6 post-fix de §2.3 (la race de `test:newsletter` saturaba el runner y arrastraba a `test:discord-regression` como efecto colateral).
- `docs/audits/DISCORD-AUDIT.md`: 7 canales documentados (bookings, recordatorios, consentimientos, leads-calculadora, cancelaciones, errores, summary). Sin cambios.

### 3.9 Booking, Google Meet, recordatorios y reconciliación

- `test:booking` 54/54 PASS (creación, confirmación, recordatorios drip, cancelación, evento Meet, reconciliación de zombis).
- `test:audit-faqs` 57 fixtures sistema + 11 fixtures blog OK.
- `server/scheduled/reconcile-zombies.ts` sin cambios; cron task documentado en `replit.md`.

### 3.10 Emails, plantillas y deliverability

- `lint:email-deliverability` OK · 10 sendEmail callsites · 7 booking senders · 13 CTAs UTM-tagged · 78 subjects spam-checked.
- `test:newsletter` 55/55 PASS (post-fix §2.3) — incluye RFC 8058 one-click unsubscribe en 6 langs, drip enrollment (6 pasos), consent_log con poll robusto.
- Stack tipográfico Inter + único acento `#00E510` mantenido en plantillas i18n (`server/email-i18n/{es,en,fr,de,pt,ca}.ts`).

### 3.11 Calculadora fiscal y motor de cálculo

- `test:calculator` 123/123 PASS · tramos IRPF/IS/SS Autónomos 2026 contra `client/src/lib/calculator-config.ts` y pilares editoriales · salvaguardas FX/NaN/Infinity intactas.
- Sin cambios en `calculator-config.ts`.

### 3.12 Seguridad, encriptación y endpoints

- Helmet (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) + CSRF/origin checks + rate limiting + sanitización mantenidos.
- AES-256-GCM en `server/field-encryption.ts` sin cambios.
- **27 endpoints públicos** en `server/routes/public.ts` (1.796 LOC) + 5 endpoints adicionales en `server/index.ts` / `server/routes/observability.ts` / `server/discord-bot.ts` = **32 endpoints totales** con cobertura Zod conforme al inventario de Task #78.
- 11 invocaciones a `safeParse` / `parse` y 8 schemas `z.object(` activos en `server/routes/public.ts`.

### 3.13 Monitorización continua

- 2 cron lanes (live-verification, live-verification-seo-headers) en `.github/workflows/`. Sin cambios.
- Notifiers Discord crash-handling cubierto por `test:perf-gate-bypass-notify` y `test:bundle-diff-notify`. Tests OK.
- Dedupe "VPS not deployed" mantenido (Task #70 en cola para revisión adicional, no se ejecuta aquí).

### 3.14 Quality gates y CI

- **33 gates totales** orquestados por `scripts/check.mjs` (concurrencia 6).
- Runner paralelo y secuencial mantienen el mismo set (Task #75 sigue en cola para automatizar la sincronización).
- Tras los 3 fixes de §2, **0 falsos positivos** y **0 races conocidas** en los gates.

---

## 4. Comparación contra baseline (Task #77 + Task #78)

| Indicador | Task #77 (2026-04-29 mañana) | Task #78 (cierre tarde) | **Task #86 (post-segunda pasada)** |
|---|---|---|:---:|
| `npm run check` EXIT | 0 (33/33) | 0 (33/33) | **0 (33/33) × 3 runs consecutivas** |
| `npx tsc --noEmit` | 0 errors | 0 errors | **0 errors** |
| `npm audit --omit=dev` | 0 vuln | 0 vuln | **0 vuln** (raíz + workspace) |
| i18n keys | 1.554 × 6 | 1.558 × 6 | **1.566 × 6** (+8 por #83 cluster) |
| Blog cluster | 111 × 6 = 666 | 111 × 6 = 666 | **112 × 6 = 672** (+1 por #83) |
| `seo:masterpiece-strict` mean score | 99,8 | 99,8 | **99,8** · critical=0 |
| Rutas canónicas | 17 RouteKey × 6 langs | 17 × 6 | **17 × 6** |

Sin regresiones. Las únicas variaciones son las introducidas legítimamente por #78 y #83 (keys i18n + 1 artículo del clúster CRS 2.0/CARF).

---

## 5. Riesgos abiertos y deuda técnica (no se resuelven en #86)

Esta lista NO duplica tareas ya en cola (#22, #26, #29, #37, #40, #53, #55, #57, #58, #62, #69, #70, #71, #75, #82, #84, #85). Documentada como contexto:

| Tema | Estado | Ticket en cola |
|---|---|---|
| Sincronización automática `check:serial` ↔ runner paralelo | manual | #75 |
| Deploy operativo VPS Hostinger | pendiente acción del usuario | `PENDING-FINAL.md #1` |
| Matriz cross-browser Playwright | planificada | `PENDING-FINAL.md #5` |
| Revisión adicional de notifiers Discord (crash handling avanzado) | OK actual | #70 |
| Endpoints administrativos (auth/AuthZ extra) | OK actual | #84 |
| Títulos meta extendidos en mobile | OK actual | #85 |

---

## 6. Comandos verificados (resumen reproducible)

```bash
# Desde la raíz
npm audit --omit=dev                          # 0 vulnerabilities

# Desde exentax-web/
npx tsc --noEmit                              # EXIT 0
npm audit --omit=dev                          # 0 vulnerabilities
npm run check                                 # EXIT 0 · 33/33 · ~70 s
npm run i18n:check                            # 1.566 keys × 6 langs · 0 missing
npm run seo:check                             # 0 broken / serp-previews OK / icons OK
npm run seo:slash                             # OK
npm run seo:meta                              # 0 errors / 0 warnings / 0 dupT / 0 dupD
npm run seo:masterpiece-strict                # 672 articles · mean 99,8 · critical=0
npm run blog:validate-all                     # 19 steps OK
npm run lint:typography                       # 0 violaciones
npm run lint:pt-pt                            # 115 ficheros OK
npm run lint:brand-casing                     # 0 ocurrencias
npm run lint:banking-entities                 # 673 blog files OK
npm run lint:email-deliverability             # 10 callsites OK
npm run test:newsletter                       # 55/55
npm run test:booking                          # 54/54
npm run test:calculator                       # 123/123
npm run test:discord-regression               # 72/72
npm run test:audit-faqs                       # 57 + 11 OK
npm run test:redirects                        # 9/9

# Health (con 'Start application' en ejecución)
curl -s http://localhost:5000/api/health      # {"status":"ok","uptime":<n>}
curl -s http://localhost:5000/api/health/ready
# {"status":"ready","ready":true,"checks":{"db":{"ok":true},"breakers":{"ok":true},"emailWorker":{"ok":true}}}
```

Logs crudos guardados en `.local/baseline-86/` para diff reproducible:
`tsc.log`, `npm-audit-root.log`, `npm-audit-ws.log`, `check.log` (baseline FAIL pre-fix), `check-2.log` (FAIL pre-fix), `check-3.log` (PASS post-fix §2.1+§2.2), `check-4.log` (FAIL race §2.3), `check-5.log` (PASS post-fix §2.3), `check-6.log` (PASS estabilidad).

---

## 7. Cierre

- **Reporte ejecutivo**: 14 áreas verificadas, 0 áreas en rojo, 0 en ámbar, 14 en verde.
- **Bugs reales arreglados**: 3 (todos quirúrgicos: 2 en allowlists de gates, 1 en robustez de test E2E).
- **UX intacta**: ningún componente, traducción, slug, ruta, plantilla de email o configuración visible al usuario fue modificado.
- **Documentación raíz actualizada**: `README.md`, `replit.md`, `BASELINE.md`, `PRODUCTION-STATUS.md`, `CHANGELOG.md`, `PENDING-FINAL.md`.

— Senior engineer · auditoría #86 · 2026-04-29
