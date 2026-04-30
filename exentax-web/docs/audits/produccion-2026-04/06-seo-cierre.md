# 06 — Cierre SEO (Tarea #24)

Fecha: 2026-04-30
Alcance: indexación, sitemap, robots, hreflang, canonical, X-Robots-Tag,
IndexNow (Bing/Yandex), Google Search Console y Google Indexing API.
Resultado global: ✅ PASS — todas las verificaciones automáticas en
verde. La infraestructura SEO ya estaba en sitio (Tareas #7, #8, #9,
#14, #20, #22, #23); esta tarea **consolida la evidencia** y, además,
deja en el repo una verificación reproducible:

- `exentax-web/scripts/seo/lib/cierre-audit-lib.mjs` — librería pura
  (sin red, sin disk) con `parseUrls`, `validateUrlEntry`,
  `computeReciprocity`, `validateRobotsTxt`, `validateHeaderRoute`.
- `exentax-web/scripts/seo/seo-cierre-audit.mjs` — runner end-to-end
  contra el server vivo que usa esa librería: 4 sitemaps con
  cardinalidades duras (102 pages + 672 blog + 6 faq = 780 total,
  configurable via `EXPECT_PAGES`/`EXPECT_BLOG`/`EXPECT_FAQ`/
  `EXPECT_TOTAL`), hreflang reciproco bidireccional, canonical +
  X-Robots-Tag + status 200 en 8 superficies públicas (los 6 homes
  por idioma, un post de blog y un FAQ localizado), `noindex,
  nofollow` en 6 superficies privadas, y robots.txt completo
  (sitemaps + bots con `Allow: /` + Disallows). Devuelve exit-code
  0/1 y genera `reports/seo/seo-cierre-audit.{json,md}`.
- `exentax-web/tests/seo-cierre-audit.test.mjs` — **25 tests** que
  importan la librería real y cubren tanto el camino feliz como las
  regresiones que el auditor debe atrapar antes de producción
  (cardinalidad rota, hreflang faltante / duplicado / inesperado,
  x-default ausente o que apunta fuera de es-ES, self-hreflang
  ausente, mapeos asimétricos, grupos fragmentados, robots sin
  sitemap / sin User-agent de bot / con bot declarado pero sin
  `Allow: /` / sin Disallow, rutas públicas sin canonical, rutas
  públicas con noindex, etc.).
- `exentax-web/reports/seo/baseline-606.{json,md}` — baseline regenerada
  con timestamp 2026-04-30 (672 artículos · score 100/100).
- `exentax-web/reports/seo/seo-cierre-audit.{json,md}` — primera pasada
  PASS publicada como evidencia.

---

## 1. Sitemap

### 1.1 Estructura servida

| Endpoint              | Tipo            | URLs   | `lastmod`            | Cache-Control                |
| --------------------- | --------------- | -----: | -------------------- | ---------------------------- |
| `/sitemap.xml`        | sitemapindex    | —      | hijo más reciente    | `public, max-age=3600`       |
| `/sitemap-pages.xml`  | urlset (pages)  |    102 | mtime de cada ruta   | `public, max-age=3600`       |
| `/sitemap-blog.xml`   | urlset (blog)   |    672 | mtime de cada artículo | `public, max-age=3600`     |
| `/sitemap-faq.xml`    | urlset (faq)    |      6 | mtime FAQ            | `public, max-age=3600`       |
| `/robots.txt`         | text            | —      | —                    | `public, max-age=86400`      |

`102 + 672 + 6 = 780` URLs canonicas en total, distribuidas entre las
6 lenguas (`es`, `en`, `fr`, `de`, `pt`, `ca`):

- 17 rutas de páginas × 6 idiomas = **102** entradas en `sitemap-pages.xml`.
- 112 artículos × 6 idiomas = **672** entradas en `sitemap-blog.xml`.
- 1 FAQ × 6 idiomas = **6** entradas en `sitemap-faq.xml`.

Implementación en `server/routes/public.ts`. Cada `<url>` lleva su
bloque `xhtml:link rel="alternate"` con los **6 hreflang locales +
`x-default`** apuntando al equivalente español.

### 1.2 `lastmod` dinámico

Cada URL recibe su `lastmod` real:

- Páginas estáticas → `mtime` del archivo de traducciones por idioma
  (`shared/i18n/<lang>/...`).
- Artículos → `mtime` del MDX/JSON del artículo en el idioma servido.
- FAQ → `mtime` del corpus FAQ por idioma.

El sitemapindex hereda como `lastmod` el máximo de los hijos. No se
emiten timestamps fijos ni `updatedAt` artificiales.

### 1.3 Calidad

```
seo:slash         → ✓ slash-hygiene: clean (sin trailing-slash mixto)
seo:check         → ✓ 0 enlaces rotos, 0 slugs legacy, todos los artículos con ≥3 inbound
seo:meta          → ✓ 0 errores y 0 warnings en 6 idiomas (786 entradas)
seo:masterpiece-strict → ✓ 672 artículos · score medio 100/100 · 0 critical · 0 warning
seo-cierre-audit  → ✓ PASS · 780 URLs · 130 grupos · 0 errores · 0 warnings
                    (BASE_URL=http://localhost:5000 node scripts/seo/seo-cierre-audit.mjs)
```

---

## 2. Hreflang — reciprocidad 100 %

Auditoría programática versionada en
`scripts/seo/seo-cierre-audit.mjs` (no dependemos ya de scripts ad-hoc
en `/tmp`); el reporte vivo se publica como
`reports/seo/seo-cierre-audit.{json,md}`:

```
URLs total:        780
Groups (canonical sets): 130   (= 17 pages + 112 blog + 1 FAQ)
Reciprocity failures: 0
Other errors:      0
```

Reglas validadas para cada `<url>`:

1. Cuenta exactamente **6** hreflang `lang-REGION` (`es-ES`, `en-US`,
   `fr-FR`, `de-DE`, `pt-PT`, `ca-ES`).
2. Incluye el **self-hreflang** (`href === <loc>`).
3. Incluye `hreflang="x-default"` apuntando al canónico español del grupo.
4. Para todo el grupo de equivalentes, los seis idiomas están presentes
   en cada miembro y los `href` coinciden. No hay loops asimétricos.

Las traducciones de slugs por idioma se consumen de:

- Páginas: `shared/routes.ts` (auditado en cierre técnico Tarea #23,
  108 slugs sin acentos, sin colisiones).
- Blog: `shared/blog/blog-slug-i18n.ts` (`BLOG_SLUG_I18N`), única fuente
  para SSR (`server/static.ts::injectMeta`), Link-header y sitemap.

---

## 3. Canonical + X-Robots-Tag por ruta

El middleware en `server/routes.ts` aplica los headers HTTP y
`server/static.ts::injectMeta` los duplica en el `<head>` SSR.

### 3.1 Surface pública localizada (debe indexarse)

Comprobado en vivo:

```
GET /es
  X-Robots-Tag: index, follow, max-snippet:-1, max-image-preview:large
  Link: <https://exentax.com/es>; rel="canonical",
        <https://exentax.com/es>; rel="alternate"; hreflang="es-ES",
        <https://exentax.com/en>; rel="alternate"; hreflang="en-US",
        <https://exentax.com/fr>; rel="alternate"; hreflang="fr-FR",
        <https://exentax.com/de>; rel="alternate"; hreflang="de-DE",
        <https://exentax.com/pt>; rel="alternate"; hreflang="pt-PT",
        <https://exentax.com/ca>; rel="alternate"; hreflang="ca-ES",
        <https://exentax.com/es>; rel="alternate"; hreflang="x-default"

GET /es/blog/auditoria-rapida-llc-12-puntos-30-minutos
  X-Robots-Tag: index, follow, max-snippet:-1, max-image-preview:large
  Link: <https://exentax.com/es/blog/auditoria-rapida-llc-12-puntos-30-minutos>; rel="canonical"
  (los 6 hreflang + x-default se inyectan en el SSR vía BLOG_SLUG_I18N
   — verificado leyendo el HTML de respuesta)
```

### 3.2 Superficies privadas / no indexables

Comprobado en vivo:

```
GET /booking/cita    → X-Robots-Tag: noindex, nofollow
GET /start           → X-Robots-Tag: noindex, nofollow
GET /thank-you       → X-Robots-Tag: noindex, nofollow
GET /links           → X-Robots-Tag: noindex, nofollow
GET /preview/test    → X-Robots-Tag: noindex, nofollow
GET /__mockup/foo    → X-Robots-Tag: noindex, nofollow
```

Y bloqueadas en `robots.txt` (ver §4).

### 3.3 `/api/*`

Las rutas API no llegan al middleware HTML, así que no llevan
`X-Robots-Tag`. Quedan cubiertas por `Disallow: /api/` en `robots.txt`
(ningún crawler legítimo intenta indexar JSON).

---

## 4. `robots.txt`

Servido por `server/routes/public.ts` (líneas ~1716–1849), cacheado
24 h. Contenido relevante:

- `User-agent: *` con `Allow: /` y allow-list explícito de las 6 raíces
  localizadas, `llms.txt`, `llms-full.txt` y los 4 sitemaps.
- Bloqueo de superficies privadas: `/api/`, `/internal/`, `/private/`,
  `/booking/`, `/start`, `/go/`, `/links`, `/thank-you`, `/thanks`,
  `/preview/`, `/staging/`, `/dev/`, `/__mockup/`.
- Bloqueo de duplicados por query-string: `?ref=`, `?utm_*=`, `?gclid=`,
  `?fbclid=`, `?mc_cid=`, `?mc_eid=`.
- Sección **GEO / AI** (Tarea #14): bloque `Allow` explícito por bot
  (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`,
  `Claude-Web`, `Anthropic-AI`, `Google-Extended`, `PerplexityBot`,
  `YouBot`, `Bytespider`, `CCBot`, `Applebot-Extended`, `cohere-ai`,
  `MistralAI-User`, `DiffbotBot`, `Yeti`, `MetaExternalAgent`).
- Cuatro `Sitemap:` en cabecera (`/sitemap.xml`, `/sitemap-pages.xml`,
  `/sitemap-blog.xml`, `/sitemap-faq.xml`).

Coherencia con sitemap (regla: nada bloqueado en `robots.txt` aparece
listado): verificado por el lint-script `audit-system-seo-faqs.mjs`
(parte del `check:serial`).

---

## 5. IndexNow (Bing + Yandex + Seznam)

Implementación en `server/indexnow.ts`:

- Lee `INDEXNOW_KEY` (8–128 chars `[a-zA-Z0-9-]`) y opcional
  `INDEXNOW_KEY_LOCATION`.
- Emite y verifica el endpoint `/${key}.txt` con `text/plain` (test
  `npm run test:indexnow` → **10/10 passed**).
- Submisión con **3 reintentos** y backoff exponencial 1 s / 2 s / 4 s
  para 5xx y errores de transporte.
- Pings de **artículos** dispara desde el publish/edit pipeline; pings
  de **sitemap** los maneja `server/sitemap-ping.ts` (compara hash
  sha256 del índice + 3 hijos contra `data/sitemap-ping-state.json`,
  sólo notifica si cambia).
- Cada ejecución emite a Discord vía `notifySeoIndexing()` (canal
  `errores`) para auditoría operativa.

Estado runtime en este entorno: `INDEXNOW_KEY` no definido (correcto:
es un secreto de producción). En el deploy se debe definir junto al
fichero `client/public/<key>.txt` correspondiente; las warnings que
emite el módulo si la clave no coincide con el fichero estático están
testadas (10 casos).

---

## 6. Google Search Console — Sitemaps API

Implementación en `server/google-search-console.ts`:

- Reusa `GOOGLE_SERVICE_ACCOUNT_KEY` (la misma cuenta de servicio que
  Gmail/Calendar). El correo del service-account **debe estar añadido
  como Owner / Full user** en la propiedad de Search Console
  identificada por `GOOGLE_SC_SITE_URL` (default = derivado de
  `SITE_URL`, esto es `https://exentax.com/`).
- Submite `/sitemap.xml` con 3 reintentos + backoff exponencial.
- Se invoca desde `server/sitemap-ping.ts` cuando cambia el hash, en
  paralelo con IndexNow. El resultado se incluye en la notificación
  Discord.
- El antiguo endpoint `https://www.google.com/ping?sitemap=...`
  (deprecated jun-2023) **no se usa** — explicado en cabecera de
  `sitemap-ping.ts`.

---

## 7. Google Indexing API (opt-in para JobPosting / live-events)

Implementación en `server/google-indexing.ts`:

- **Opt-in** vía `GOOGLE_INDEXING_API_ENABLE=1`. Sin esa variable, el
  módulo no emite ninguna llamada — útil para evitar gastar quota en
  dev o si Google reduce el alcance del API.
- Reusa la misma `GOOGLE_SERVICE_ACCOUNT_KEY`.
- Quota local conservadora: `GOOGLE_INDEXING_DAILY_QUOTA=200`,
  `GOOGLE_INDEXING_MAX_PER_RUN=50` (overrideables por env).
- Persiste estado por URL en `data/google-indexing-state.json` y la
  ventana 24 h en `callTimestamps[]` para no exceder cuota.
- Reintentos + backoff equivalentes a IndexNow.
- Honra `INDEXNOW_KEY` ausente como degradación grácil (no propaga
  errores al deploy).

Estado runtime en este entorno: `GOOGLE_INDEXING_API_ENABLE=1` (heredado
del workspace), pero sin `GOOGLE_SERVICE_ACCOUNT_KEY` — el módulo
devuelve `error: "GOOGLE_SERVICE_ACCOUNT_KEY not set or missing access
token"` y no rompe el arranque. En producción ambos secretos deben
estar definidos.

---

## 8. Verificación final — `check:serial`

Ejecutadas en este cierre las piezas críticas que tocan SEO:

| Script                                              | Resultado |
| --------------------------------------------------- | --------- |
| `seo:check`                                         | ✅ PASS    |
| `seo:slash`                                         | ✅ PASS    |
| `seo:meta`                                          | ✅ PASS (0 errores, 0 warnings, 6 idiomas) |
| `seo:masterpiece-strict`                            | ✅ PASS (672 artículos · score 100/100) |
| `test:indexnow`                                     | ✅ 10/10 passed |
| `test:redirects`                                    | ✅ 5/5 passed |
| `node --test tests/seo-cierre-audit.test.mjs`       | ✅ 25/25 passed |
| `node scripts/seo/seo-cierre-audit.mjs` (en vivo)   | ✅ 780 URLs · 130 grupos · 0 errores |
| Robots.txt vivo (vía auditor)                       | ✅ 4 sitemaps + AI allow-list + 8 Disallow |

`check:serial` completo (≈25 pasos) sigue verde sobre la base recibida
de la Tarea #23, confirmado por la pasada parcial de los pasos SEO
arriba; los pasos no-SEO ya estaban verdes en cierres previos
(`08-cierre-tecnico.md`).

---

## 9. Checklist de cierre (deploy de producción)

Pre-deploy:

- [x] `sitemap-index` + 3 hijos sirven 200 con XML válido.
- [x] `robots.txt` sirve 200, lista los 4 sitemaps y los AI bots.
- [x] Hreflang reciproco 100 % sobre 780 URLs (130 grupos).
- [x] Canonical + `X-Robots-Tag: index, follow, …` en surfaces públicas.
- [x] `noindex, nofollow` en `/booking`, `/start`, `/links`,
      `/thank-you`, `/preview/`, `/__mockup/`.
- [x] Tests verdes: `seo:check`, `seo:slash`, `seo:meta`,
      `seo:masterpiece-strict`, `test:indexnow`, `test:redirects`.
- [x] Baseline regenerada: `reports/seo/baseline-606.{json,md}`
      (672 artículos · score medio 100 · 0 critical · 0 warning).

Post-deploy (operativo, sólo en producción):

- [ ] `INDEXNOW_KEY` definida + `client/public/<key>.txt` desplegado
      con el mismo valor (verificable con `GET https://exentax.com/<key>.txt`).
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` definido + service-account añadido
      como Owner/Full user en la propiedad GSC.
- [ ] `GOOGLE_INDEXING_API_ENABLE=1` + cuota inicial OK
      (`GOOGLE_INDEXING_DAILY_QUOTA`, `GOOGLE_INDEXING_MAX_PER_RUN`).
- [ ] Primer arranque tras deploy: revisar canal Discord `errores`
      para la notificación `notifySeoIndexing` (debería reportar
      4 sitemaps submitidos a IndexNow + GSC y `state` persistido).
- [ ] En GSC, verificar manualmente que el sitemap se procesa
      (Cobertura → Sitemaps) en las 48 h siguientes.

---

## 10. Métricas baseline para vigilancia post-launch

Capturadas el 2026-04-30 con `seo:masterpiece-strict`
(`reports/seo/baseline-606.json`):

| Idioma | Artículos | Score medio | Critical | Warning |
| ------ | --------: | ----------: | -------: | ------: |
| es     |       112 |         100 |        0 |       0 |
| en     |       112 |         100 |        0 |       0 |
| fr     |       112 |         100 |        0 |       0 |
| de     |       112 |         100 |        0 |       0 |
| pt     |       112 |         100 |        0 |       0 |
| ca     |       112 |         100 |        0 |       0 |
| **Total** | **672** |     **100** |    **0** |   **0** |

URLs totales en sitemap (`/sitemap*.xml` en vivo): **780**
(102 pages + 672 blog + 6 FAQ).

Reglas auditadas y pesos (`v2`):

- `v2-marker` (25), `min-length` (20), `calc-cta` (15),
  `year-in-prose` (15), `sources-block` (15), `authority-block` (10).

Esta tabla debe servir como umbral de regresión: cualquier deploy
futuro que mueva `meanScore` por debajo de **98** o introduzca
`critical > 0` debe bloquear el merge a través del `seo:masterpiece-strict`
ya integrado en `check:serial`.

---

## 11. No-regresiones / fuera de alcance

- No se han modificado títulos, descripciones ni slugs en esta tarea
  (Tareas #7 y #8, ya cerradas).
- No se han modificado CTAs ni FAQ (Tarea #9, ya cerrada).
- No se ha añadido nueva ruta indexable, ni se ha tocado código en
  `server/`, `client/` ni `shared/`.
- Cambios netos de esta tarea (todos no-funcionales, sólo añadir):
  1. Auditor reproducible:
     `exentax-web/scripts/seo/seo-cierre-audit.mjs`.
  2. Librería pura del auditor:
     `exentax-web/scripts/seo/lib/cierre-audit-lib.mjs`.
  3. Tests del auditor:
     `exentax-web/tests/seo-cierre-audit.test.mjs` (25 PASS, incluye
     casos de regresión asimétrica/fragmentada y headers rotos).
  4. Reporte de la auditoría en vivo:
     `exentax-web/reports/seo/seo-cierre-audit.{json,md}`.
  5. Baseline regenerada:
     `exentax-web/reports/seo/baseline-606.{json,md}` (timestamp
     2026-04-30, 672 artículos · score 100/100).
  6. `exentax-web/.gitignore`: re-incluir los 4 artefactos de evidencia
     anteriores (mismo patrón que serp-previews y lote5-veracidad).
  7. Este documento.
