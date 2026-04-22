# Auditoría SEO técnica — páginas core

**Fecha:** 2026-04-17
**Alcance:** 11 rutas core × 6 idiomas (66 URLs canónicas) — `home`, `how_we_work`, `our_services`, `about_llc`, `faq`, `book`, `legal_terms`, `legal_privacy`, `legal_cookies`, `legal_refunds`, `legal_disclaimer`.
**Fuera de alcance:** blog (auditado en T043 / `docs/seo/audit-2026.md`).

---

## 1. Arquitectura SEO actual

### 1.1 Fuentes de metas (orden de resolución)

`server/static.ts:118-149` resuelve las metas para SSR en este orden:

1. `PAGE_META[cleanPath]` — diccionario hardcoded (líneas 16-514 de `seo-content.ts`).
2. `PAGE_META[localizedPathCheck]` — fallback con normalización ES.
3. `PAGE_META_I18N[cleanPath]` — diccionario generado por `buildI18nMeta()` para todas las combinaciones `routeKey × lang`.

**Implicación:** PAGE_META hardcoded **gana siempre** para las rutas core (todas están registradas). PAGE_META_I18N actúa como fallback para rutas que no se hayan añadido al hardcoded.

> **Decisión arquitectónica:** se mantienen las dos estructuras pero **PAGE_META hardcoded es la fuente de verdad**. `PAGE_META_I18N` se ha sincronizado para que coincida en titles para que, si en algún momento se elimina una entrada hardcoded, el fallback no degrade el SEO. Cualquier modificación futura debe actualizar **ambos** o, idealmente, refactorizar a una sola fuente.

### 1.2 Generación de canonical y hreflang

- **SSR (rutas core):** `static.ts:265-268` — usa `getLocalizedPath(resolved.key, lang)` para hreflang y `getLocalizedPath(resolved.key, "es")` para `x-default`. ✅ Correcto.
- **SSR (blog post):** `static.ts:248-253` — hreflang por idioma con slug traducido + `x-default` con slug ES. ✅ Correcto.
- **CSR (`SEO.tsx`):** tras el fix de esta auditoría, `x-default` ya apunta a la versión ES de la ruta resuelta (antes apuntaba siempre a `/es` literal). ✅ Corregido.
- **Sitemap (`routes/public.ts`):** tras el fix, `x-default` para cada URL del sitemap usa `getLocalizedPath(routeKey, "es")`, `/es/blog`, o `/es/blog/{slug-es}` según el caso (antes: `/es` literal en los tres). ✅ Corregido.

### 1.3 Sitemaps y robots

- `/sitemap.xml` — incluye 66 core URLs + 6 blog index + N posts traducidos. Cache 1 h. `lastmod` por bloque (`MAIN_PAGES_LASTMOD = 2026-04-01`, legales `2026-03-01`). Patrón anti-freshness-spam ya documentado.
- `/sitemap-blog.xml` — News sitemap por post.
- `/robots.txt` — bloquea `/api/`, `/links`, `/start`, `/booking/` y query strings de tracking (UTM, gclid, fbclid, mc_cid, mc_eid, ref).

---

## 2. Inventario de metas — 41 URLs core

Todas las longitudes en caracteres. Convención objetivo: title 30–60, description 70–160.

| Ruta                              | T   | D   | Estado |
| --------------------------------- | --- | --- | ------ |
| `/` (default ES, sin prefijo)     | 59  | 154 | ✅      |
| `/es`                             | 59  | 154 | ✅      |
| `/en`                             | 49  | 154 | ✅      |
| `/fr`                             | 53  | 141 | ✅      |
| `/de`                             | 59  | 136 | ✅      |
| `/pt`                             | 50  | 145 | ✅      |
| `/ca`                             | 53  | 141 | ✅      |
| `/es/como-trabajamos`             | 48  | 128 | ✅      |
| `/en/how-we-work`                 | 49  | 148 | ✅      |
| `/fr/comment-nous-travaillons`    | 57  | 135 | ✅      |
| `/de/wie-wir-arbeiten`            | 52  | 131 | ✅      |
| `/pt/como-trabalhamos`            | 51  | 131 | ✅      |
| `/ca/com-treballem`               | 54  | 130 | ✅      |
| `/es/nuestros-servicios`          | 49  | 147 | ✅      |
| `/en/our-services`                | 35  | 141 | ✅      |
| `/fr/nos-services`                | 56  | 124 | ✅      |
| `/de/unsere-leistungen`           | 42  | 126 | ✅      |
| `/pt/nossos-servicos`             | 49  | 119 | ✅      |
| `/ca/els-nostres-serveis`         | 47  | 115 | ✅      |
| `/es/preguntas-frecuentes`        | 50  | 133 | ✅      |
| `/en/faq`                         | 50  | 143 | ✅      |
| `/fr/questions-frequentes`        | 50  | 136 | ✅      |
| `/de/haufige-fragen`              | 35  | 121 | ✅      |
| `/pt/perguntas-frequentes`        | 48  | 131 | ✅      |
| `/ca/preguntes-frequents`         | 47  | 125 | ✅      |
| `/es/agendar`                     | 44  | 137 | ✅      |
| `/en/book`                        | 43  | 135 | ✅      |
| `/fr/reserver`                    | 49  | 142 | ✅      |
| `/de/buchen`                      | 44  | 139 | ✅      |
| `/pt/agendar`                     | 47  | 146 | ✅      |
| `/ca/agendar`                     | 46  | 143 | ✅      |
| `/es/sobre-las-llc`               | 54  | 146 | ✅      |
| `/en/about-llc`                   | 56  | 128 | ✅      |
| `/fr/a-propos-des-llc`            | 53  | 146 | ✅      |
| `/de/uber-llc`                    | 54  | 140 | ✅      |
| `/pt/sobre-llc`                   | 53  | 143 | ✅      |
| `/ca/sobre-les-llc`               | 52  | 140 | ✅      |
| `/es/legal/terminos`              | 32  | 146 | ✅      |
| `/es/legal/privacidad`            | 32  | 134 | ✅      |
| `/es/legal/cookies`               | 29  | 133 | ⚠️ T<30  |
| `/es/legal/reembolsos`            | 32  | 134 | ✅      |
| `/es/legal/disclaimer`            | 35  | 152 | ✅      |

**Estado tras esta auditoría:** 0 BAD (todos titles ≤60, todas descs ≤160). 1 WARNING menor: `/es/legal/cookies` con title de 29 caracteres.

> **Legales no-ES:** los slugs `/en/legal/terms`, `/fr/legal/conditions`, `/de/legal/agb`, `/pt/legal/termos`, `/ca/legal/termes` (× 5 documentos) hoy reciben sus metas desde `PAGE_META_I18N` (fallback). Ya están dentro de los rangos válidos.

---

## 3. Hallazgos críticos resueltos

### 3.1 Titles >60 caracteres (truncan en SERPs) — RESUELTO

| Ruta              | Antes (chars) | Después (chars) |
| ----------------- | ------------- | --------------- |
| `/` y `/es`       | 62            | 59              |
| `/fr`             | 64            | 53              |
| `/pt`             | 61            | 50              |
| `/ca`             | 63            | 53              |
| `/es/agendar`     | 71            | 44              |
| `/en/book`        | 70            | 43              |
| `/es/sobre-las-llc` | 63          | 54              |
| `/fr/a-propos-des-llc` | 61       | 53              |
| `/de/uber-llc`    | 67            | 54              |
| `/pt/sobre-llc`   | 62            | 53              |
| `/ca/sobre-les-llc` | 61          | 52              |

Adicionalmente:
- En `/de/uber-llc` se sustituyó "Nicht-Einwohner" por "Nicht-Residenten" (terminología fiscal estándar en alemán).
- Se sincronizó `PAGE_META_I18N` (titles `home`, `about_llc`, `book`).

### 3.2 Descriptions >160 caracteres — RESUELTO

| Ruta                  | Antes | Después |
| --------------------- | ----- | ------- |
| `/` y `/es`           | 174   | 154     |
| `/es/como-trabajamos` | 161   | 128     |

### 3.3 `x-default` apuntando a `/es` literal — RESUELTO

| Ubicación                                  | Antes              | Después                                       |
| ------------------------------------------ | ------------------ | --------------------------------------------- |
| `routes/public.ts:939` (sitemap.xml core)  | `${SITE_URL}/es`   | `${SITE_URL}${esLoc}`                         |
| `routes/public.ts:949` (sitemap.xml blog index) | `${SITE_URL}/es` | `${SITE_URL}/es/blog`                         |
| `routes/public.ts:970` (sitemap.xml blog posts) | `${SITE_URL}/es` | `${SITE_URL}/es/blog/{slug-es}`               |
| `client/src/components/SEO.tsx:129`        | `${BASE_URL}/es`   | versión ES de la ruta resuelta (core / blog) |

### 3.4 Duplicación PAGE_META vs PAGE_META_I18N — DOCUMENTADA + SINCRONIZADA

Tras el fix, los titles de `home`, `about_llc` y `book` están sincronizados entre las dos. Refactor pendiente (no bloqueante): unificar a una sola fuente.

### 3.5 `index.html` (SSR fallback inicial) — RESUELTO

Title (62) y description (270) en `client/index.html` excedían los límites; afectaba al primer render para crawlers con poco JS. Acortados a 59 / 154. OG y Twitter cards alineadas.

---

## 4. Hreflang y canonical — verificación cruzada

| Aspecto                                   | SSR | CSR | Sitemap |
| ----------------------------------------- | --- | --- | ------- |
| `<link rel="canonical">` por idioma       | ✅  | ✅  | n/a     |
| `<link rel="alternate" hreflang="{lang}">`| ✅  | ✅  | ✅      |
| `x-default` versión ES correcta           | ✅  | ✅  | ✅      |
| `<html lang>` por idioma                  | ✅  | ✅  | n/a     |
| Reciprocidad ES↔EN↔FR↔DE↔PT↔CA            | ✅  | ✅  | ✅      |

---

## 5. JSON-LD — auditoría de coherencia

`client/index.html` inyecta 6 bloques JSON-LD globales:

1. **`ProfessionalService`** (`@id` `#organization`) — completo: dirección US, geo, areaServed, serviceType, hasOfferCatalog, aggregateRating. ✅
2. **`Organization`** — dirección US, contactPoint dual, `knowsLanguage` 6 idiomas. ✅
3. **`WebSite`** (`@id` `#website`) con `inLanguage: "es"`. ✅
4. **`ItemList`** con 6 servicios principales — URLs correctas. ✅
5. **`WebApplication`** (calculadora). ✅
6. **`SiteNavigationElement`** — 6 entradas. ✅

`static.ts` además inyecta `BreadcrumbList`, `FAQPage`, `Service` per-página según `PAGE_SCHEMAS`. Coherente.

**Recomendaciones futuras (no bloqueante):**
- Unificar `Organization` y `ProfessionalService` (un solo `@id` con `@type: ["ProfessionalService", "Organization"]`).
- Servir `WebSite` JSON-LD con `inLanguage` dinámico según la URL servida.

Adicionalmente, las páginas core inyectan JSON-LD propio en runtime:

| Página       | JSON-LD propio                                                  |
| ------------ | --------------------------------------------------------------- |
| home         | `WebPage` + `ItemList` (en `useHomeJsonLd`, `home.tsx:17-58`)   |
| about-llc    | `BreadcrumbList` (vía SEO `breadcrumbs` prop)                   |
| how-we-work  | `BreadcrumbList`                                                |
| services     | `BreadcrumbList`                                                |
| faq-page     | `FAQPage` (todos los items) + `BreadcrumbList`                  |
| book         | `BreadcrumbList`                                                |

---

## 6. Robots.txt y sitemaps — verificación

✅ `robots.txt` correcto:
- Bloquea áreas no-públicas (`/api/`, `/start`, `/links`).
- Bloquea `/booking/` (área autenticada Cal.com con noindex aparte).
- Bloquea query strings de tracking (UTM, gclid, fbclid, mc_*).
- Declara los dos sitemaps absolutos.

✅ Sitemaps con caché 1 h, `lastmod` content-based, `<xhtml:link rel="alternate">` por idioma + `x-default` corregido.

---

## 7. Jerarquía de encabezados (H1/H2/H3) por página core

Validación realizada por inspección de `client/src/pages/*.tsx` y secciones importadas en `client/src/components/sections/*.tsx`. Regla aplicada: **un único H1 por página, H2 por sección principal, H3 por sub-sección**.

### 7.1 home (`/{lang}` y `/`)

`home.tsx` no renderiza headings directamente: compone 9 secciones. La jerarquía agregada es:

| Sección              | Heading principal           | Sub-headings |
| -------------------- | --------------------------- | ------------ |
| `Hero`               | **H1** ×1 (l.27)            | —            |
| `BanksCarousel`      | (sin heading, banner)       | —            |
| `Problem`            | H2                          | H3 por punto |
| `ForWho`             | H2                          | H3 por perfil |
| `HowItWorks`         | H2                          | H3 por paso  |
| `Services`           | H2                          | H3 por servicio |
| `WhyUs`              | H2                          | H3 por bloque |
| `Origin`             | H2                          | —            |
| `HomeFAQ`            | H2                          | H3 por pregunta |

✅ **Resultado:** 1 H1 (Hero) + 7 H2 + múltiples H3. Jerarquía consistente.

### 7.2 about-llc (`/{lang}/sobre-las-llc`)

Líneas: `about-llc.tsx:37` H1, l.94/192/238/285/337 H2, múltiples H3.

| Nivel | Cantidad | Líneas (ejemplos)        |
| ----- | -------- | ------------------------ |
| H1    | 1        | l.37                     |
| H2    | 5        | l.94, 192, 238, 285, 337 |
| H3    | 7+       | l.105, 116, 213, 259, 311, 365 |

✅ **Resultado:** estructura correcta. 1 H1 → 5 H2 → H3 anidados.

### 7.3 how-we-work (`/{lang}/como-trabajamos`)

| Nivel | Cantidad | Notas                                                  |
| ----- | -------- | ------------------------------------------------------ |
| H1    | 1        | l.87 (hero)                                            |
| H2    | 3        | l.129 (sub-hero), l.486 ("Es para ti"), l.563 ("Lo que NO hacemos") |
| H3    | 4        | l.188, 248, 291, 368 (una por cada fase) + l.512 (cards) |
| H4    | 4        | sub-bloques dentro de fases (l.318, 339, 383)          |

✅ **Resultado:** estructura coherente con la naturaleza por fases. El H4 dentro de PhaseBlock (`how-we-work.tsx:35`) está siempre anidado bajo un H3 fase.

### 7.4 services (`/{lang}/nuestros-servicios`)

`services.tsx` aporta el H1 hero (l.31). El resto viene de `services-sections.tsx` (lazy-loaded):

| Nivel | Cantidad | Líneas (services-sections.tsx) |
| ----- | -------- | ------------------------------ |
| H1    | 1        | services.tsx:31                |
| H2    | 5        | l.103, 185, 304, 369, 432      |
| H3    | 4+       | l.137 (planes), l.217 (estados), l.324 (mantenimiento) |
| H4    | 8+       | sub-labels comparativos        |

✅ **Resultado:** 1 H1 + jerarquía rica. Estructura correcta para página de catálogo/precios.

### 7.5 faq-page (`/{lang}/preguntas-frecuentes`)

`faq-page.tsx` no renderiza headings; usa `<FAQ asPage />`. En `FAQ.tsx`:

| Nivel | Cantidad | Notas                                       |
| ----- | -------- | ------------------------------------------- |
| H1    | 1        | l.74 (solo cuando `asPage=true`)            |
| H2    | 1        | l.83 (subtítulo)                            |
| H3    | N        | l.201 (una por pregunta cuando `asPage=true`) |

> Nota: en `FAQ.tsx` líneas 197 (H2) y 201 (H3) son alternativas condicionales según `asPage`. Cuando se renderiza como página completa usa H3 para preguntas (correcto, anidado bajo el H1 de la página). Cuando se renderiza embebida en home usa H2.

✅ **Resultado:** estructura correcta para FAQPage.

### 7.6 book (`/{lang}/agendar`)

| Nivel | Cantidad | Notas                                                   |
| ----- | -------- | ------------------------------------------------------- |
| H1    | 1        | uno de l.217 / 228 / 239 — son **mutuamente exclusivos** según estado (success / cancelled / default) |
| H2    | 3        | l.262, 306, 380 (secciones del formulario)              |

✅ **Resultado:** correcto. Solo se renderiza un H1 a la vez según el estado de la página.

### 7.7 Resumen jerarquía

| Página       | H1 | Estado                       |
| ------------ | -- | ---------------------------- |
| home         | 1  | ✅ Correcto                   |
| about-llc    | 1  | ✅ Correcto                   |
| how-we-work  | 1  | ✅ Correcto                   |
| services     | 1  | ✅ Correcto                   |
| faq-page     | 1  | ✅ Correcto (vía FAQ asPage)  |
| book         | 1  | ✅ Correcto (mutuamente excl.) |

**Cero errores de jerarquía.** Todas las páginas core tienen exactamente un H1 y descienden en orden lógico.

---

## 8. Mapa de enlazado interno entre páginas core

Análisis basado en `<Link href={lp("...")}>` y `<a href={lp("...")}>` reales en cada página y sus secciones importadas.

### 8.1 Enlaces salientes por página

#### home (`/`)
Vía secciones: `Hero`, `ForWho`, `HowItWorks`, `WhyUs`, `HomeFAQ`.

| Destino       | Veces | Origen                                                              |
| ------------- | ----- | ------------------------------------------------------------------- |
| `book`        | 9     | Hero (l.57), ForWho (×2), HowItWorks (×3), WhyUs (×1), HomeFAQ (×3) |
| `faq`         | 1     | HomeFAQ (l.88)                                                      |
| `our_services`| 0 (cuerpo) | (sí en JSON-LD significantLink)                                |
| `about_llc`   | 0 (cuerpo) | (sí en JSON-LD significantLink)                                |
| `how_we_work` | 0 (cuerpo) | (sí en JSON-LD significantLink)                                |

> **Hallazgo:** la home concentra todo el linking en `book` (CTA principal) y `faq`. **No enlaza en cuerpo** a `our_services`, `about_llc` ni `how_we_work`. Pasan solo por header/footer y JSON-LD `significantLink`. Mejorable a futuro sin ser bloqueante (header + footer ya cubren la navegación; el JSON-LD señala las relaciones).

#### about-llc (`/{lang}/sobre-las-llc`)

| Destino        | Origen                                  |
| -------------- | --------------------------------------- |
| `book`         | l.54 (hero CTA)                         |
| `our_services` | l.380 (sección final / pricing CTA)     |

✅ 2 enlaces a páginas core hermanas. Cumple "2-3 related links".

#### how-we-work (`/{lang}/como-trabajamos`)

| Destino        | Origen                                  |
| -------------- | --------------------------------------- |
| `book`         | l.102 (hero), l.225 (phase 1)           |

⚠️ Solo enlaza a `book`. **Mejora recomendada:** añadir enlace contextual a `our_services` ("ver planes y precios") y/o `about_llc` ("conocer la guía LLC 2026"). No bloqueante pero deseable.

#### services (`/{lang}/nuestros-servicios`)
Vía `services.tsx` y `services-sections.tsx`.

| Destino   | Veces | Origen                                                    |
| --------- | ----- | --------------------------------------------------------- |
| `book`    | 4     | services.tsx:61, services-sections.tsx:158, 272, 443       |
| `faq`     | 1     | services-sections.tsx:407                                  |

✅ 2 destinos distintos (book + faq). Cumple.

#### faq-page (`/{lang}/preguntas-frecuentes`)

Sin enlaces internos a otras core en cuerpo. El componente `FAQ asPage` muestra preguntas en accordion sin CTAs cruzados.

⚠️ **Mejora recomendada:** al final del listado FAQ, añadir CTA dual a `book` y `our_services` (común en FAQ pages que convierten). No bloqueante.

#### book (`/{lang}/agendar`)

| Destino | Origen                              |
| ------- | ----------------------------------- |
| `book`  | l.230 (botón "reintentar" tras cancel) |

✅ Es la página terminal del funnel; no necesita enlaces salientes a otras core (las distrae del CTA primario). Header y footer cubren navegación.

### 8.2 Reciprocidad y matriz

|              | home | about_llc | how_we_work | our_services | faq | book |
| ------------ | ---- | --------- | ----------- | ------------ | --- | ---- |
| **home**         | —    | header/footer | header/footer | sig.link  | ✅  | ✅✅✅ |
| **about_llc**    | header/footer | — | header/footer | ✅      | header | ✅ |
| **how_we_work**  | header/footer | header/footer | — | header/footer | header | ✅✅ |
| **our_services** | header/footer | header/footer | header/footer | — | ✅       | ✅✅✅✅ |
| **faq**          | header/footer | header/footer | header/footer | header/footer | — | header |
| **book**         | header/footer | header/footer | header/footer | header/footer | header | — (self) |

**Cobertura header/footer global:** 100% (todas las core ↔ todas las core vía nav y footer).

**Cobertura cuerpo↔cuerpo (más valiosa para SEO):** dispar pero suficiente. Páginas educativas (about-llc, services) enlazan correctamente. Páginas funcionales (book, faq) actúan como destinos finales.

### 8.3 Recomendaciones (no bloqueantes — diferidas a T052+)

1. **how-we-work:** añadir 1 enlace a `our_services` y 1 a `about_llc` en cuerpo.
2. **faq-page:** añadir bloque CTA final con enlaces a `book` + `our_services`.
3. **home:** considerar 1 enlace contextual en cuerpo (no solo header/footer/JSON-LD) a `about_llc` ("guía completa LLC 2026") y a `our_services` ("ver planes y precios").

Ninguna afecta indexación ni ranking de forma severa hoy: header y footer cubren la navegación primaria y el JSON-LD `significantLink` señala la jerarquía a Google.

---

## 9. Canibalización — análisis

| Par                              | Riesgo | Análisis |
| -------------------------------- | ------ | -------- |
| `/es` vs `/es/sobre-las-llc`     | Bajo   | Home enfatiza "ahorro fiscal / calculadora"; sobre-las-llc enfatiza "guía 2026". Intent diferente. |
| `/es/sobre-las-llc` vs `/es/nuestros-servicios` | Bajo | Sobre-las-llc = informativo/educativo; nuestros-servicios = transaccional con planes y precios. |
| `/es/agendar` vs `/es/nuestros-servicios` | Muy bajo | Agendar = lead capture; nuestros-servicios = catálogo. Sin solapamiento de keywords. |

✅ No hay canibalización relevante entre las páginas core.

---

## 10. Cambios aplicados — resumen

**Archivos modificados:**
- `server/seo-content.ts` — 11 titles acortados, 2 descriptions recortadas, sincronización `PAGE_META_I18N`.
- `server/routes/public.ts` — `x-default` correcto en 3 ubicaciones del sitemap.
- `client/src/components/SEO.tsx` — `x-default` correcto en cliente.
- `client/index.html` — title, description, OG y Twitter alineados.

**Archivos auditados sin cambios:**
- `client/index.html` JSON-LD (6 bloques) — coherente.
- `server/static.ts` — ya correcto.
- `server/routes/public.ts` `robots.txt` — ya correcto.
- `shared/routes.ts` — slugs i18n correctos.
- Componentes de páginas core — jerarquía H1/H2/H3 verificada y correcta.

---

## 11. Pendientes futuros (no bloqueantes T051)

1. Refactorizar `PAGE_META` + `PAGE_META_I18N` a una sola fuente.
2. Unificar `Organization` y `ProfessionalService` JSON-LD bajo un único `@id`.
3. Servir `WebSite` JSON-LD con `inLanguage` dinámico en SSR.
4. Mejorar enlazado interno en cuerpo (3 recomendaciones §8.3).
5. Considerar añadir entradas hardcoded para legales no-ES.

---

## 12. Validación

- TypeScript: `npx tsc --noEmit` ✅ sin errores.
- 41 URLs core: 0 BAD, 1 WARNING menor (`/es/legal/cookies` T=29).
- Reciprocidad hreflang: 6 idiomas × 6 páginas core × `x-default` ES — coherente en SSR, CSR y sitemap.
- Sitemap servido en runtime verificado: `x-default` correcto por ruta.
- Jerarquía H1/H2/H3: 6/6 páginas core con un único H1 y descenso lógico.
- Linking interno: matriz completa documentada (header/footer 100%, cuerpo↔cuerpo dispar pero adecuado al rol de cada página).

---

## 13. Verificación end-to-end del sitemap del blog

### 13.1 Script automatizado

`scripts/seo-sitemap-check.mjs` realiza una auditoría end-to-end del sitemap servido por el dev server y comprueba en una sola pasada:

1. **Cardinalidad.** Cuenta las URLs `/<lang>/blog/<slug>` por idioma y exige que cada idioma exponga el mismo número de posts (es decir, cada slug presente en los 6 idiomas).
2. **Hreflang completo.** Cada URL de post debe declarar `hreflang` para los 5 idiomas hermanos (la convención actual del sitemap incluye además el self-alternate, también verificado), más un `x-default` apuntando a la versión `/es/`.
3. **Reciprocidad.** Las hrefs declaradas por la versión ES se usan como referencia: cada miembro del grupo (uno por idioma) debe declarar exactamente las mismas hrefs para los demás idiomas.
4. **Sin duplicados.** Ningún `<loc>` puede aparecer dos veces en el sitemap.
5. **HTTP 200.** Cada URL del sitemap (índice de blog + posts) se solicita y debe responder con un código 2xx (concurrencia configurable, por defecto 24).

**Uso:**

```bash
# Con el dev server activo (puerto 5000 por defecto):
node scripts/seo-sitemap-check.mjs

# Apuntando a otra base:
BASE_URL=https://exentax.com node scripts/seo-sitemap-check.mjs
```

Sale con código 0 si todos los checks pasan, 1 en caso contrario. La salida imprime los conteos por idioma, las advertencias y los errores.

### 13.2 Resultado actual (run 2026-04-19)

```
Blog index URLs: 6 (expected 6)
Blog post URLs: 540  per-lang: {"es":90,"en":90,"fr":90,"de":90,"pt":90,"ca":90}
Checking HTTP status on 546 URLs (concurrency=24) ...
OK — sitemap and hreflang checks passed.
```

- 6/6 índices de blog correctos.
- 90 posts × 6 idiomas = **540 URLs de post** (100% paridad por idioma).
- 0 duplicados, 0 errores de hreflang, 0 respuestas no-2xx en las 546 URLs (6 índices + 540 posts).

> **Nota de inventario:** la especificación original del audit asumía 74 slugs × 6 idiomas = 444 URLs. Hoy hay 90 slugs (5 añadidos en sprints anteriores + 1 en cierre/disolución de LLC + 10 nuevos posts segment-B del audit 2026-04 §4.3). El script emite un *warning* para que cualquier nueva variación quede visible. Cuando el inventario cambie de nuevo, basta actualizar este número de referencia aquí y el warning desaparecerá tras igualar el target.
