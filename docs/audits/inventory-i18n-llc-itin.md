# Inventario i18n — Subpáginas LLC + ITIN, artículos y FAQ

> **Fecha:** 2026-04-21 · **Tarea:** #26 (BLOQUE 1)
> **Idiomas:** es (canónico), en, fr, de, pt, ca

## 1. Subpáginas (5 servicios × 6 idiomas = 30 variantes)

Fuente: `exentax-web/client/src/i18n/data/subpages.ts`
(rutas declaradas en `exentax-web/shared/routes.ts`).

| Subpágina       | Clave i18n        | Slug es                     | es | en | fr | de | pt | ca |
|-----------------|-------------------|-----------------------------|----|----|----|----|----|----|
| LLC New Mexico  | `subpages.llcNm`  | `servicios/llc-nuevo-mexico`| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LLC Wyoming     | `subpages.llcWy`  | `servicios/llc-wyoming`     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LLC Delaware    | `subpages.llcDe`  | `servicios/llc-delaware`    | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LLC Florida     | `subpages.llcFl`  | `servicios/llc-florida`     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Obtén tu ITIN   | `subpages.itin`   | `servicios/obten-tu-itin`   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Completitud:** 30/30 (100 %).

Cada idioma incluye: `cardKicker`, `cardTitle`, `cardDesc`, `breadcrumb`,
`hero` (kicker, h1, h1green, subtitle, ctaPrimary, ctaWhatsapp, waText),
`intro` (kicker + h2 + paragraphs), `features` (h2 + items), `bestFor`,
`whatsIncluded`, `comparison` (con `youLabel` / `compareLabel` para LLC,
3 columnas para ITIN), `faq` (h2 + items), `cta` y `seo` (title, description,
keywords, jsonLd.name, jsonLd.serviceType).

### 1.1 SEO meta (subpáginas) — longitudes

Auditado por script ad-hoc sobre `subpages.ts`.

- Títulos: 30/30 dentro de 30–60 caracteres ✅
- Descripciones: 30/30 dentro de 150–160 caracteres ✅ tras los dos
  ajustes aplicados en BLOQUE 6:
  - `en/llcDe`: 147 → 158 (reescrita).
  - `de/llcFl`: 162 → 158 (reescrita).

Detalle por (idioma, subpágina) disponible vía
`scripts/check-subpage-seo.ts` o reproducible con la consulta documentada
en `auditoria-i18n-seo-llc-itin.md` §6.

### 1.2 Navegación y subgrid de servicios

Fuente: `subpages.ts → NAV_SUBPAGES_BY_LANG` y `SUBPAGES_GRID_BY_LANG`.

| Bloque                          | es | en | fr | de | pt | ca |
|---------------------------------|----|----|----|----|----|----|
| Mega-menú servicios (5 entradas) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Grid “Explora por estado”        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Footer (quick-links a 4 LLC + ITIN) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

ITIN se añadió al footer en esta tarea (antes solo había 4 LLC).

## 2. UI / namespaces (`i18n/locales/<lang>.ts`)

| Locale | LoC    | Estado |
|--------|--------|--------|
| es     | 2 731  | ✅ canon |
| en     | 2 304  | ✅ |
| fr     | 2 306  | ✅ |
| de     | 2 306  | ✅ |
| pt     | 2 310  | ✅ |
| ca     | 2 310  | ✅ |

ES tiene más líneas porque incluye documentos legales sin equivalente
estructural en otros idiomas (los legales se renderizan con `dangerouslySetInnerHTML`
y han sido localizados bloque a bloque). Falta paridad estricta de claves
técnicas no es un gap, es por diseño (bloques HTML embebidos).

Auditorías previas conservadas como evidencia:
- `exentax-web/docs/audits/2026-04/translation-quality-audit.md`
- `exentax-web/docs/audits/2026-04/i18n-snapshots/`
- `exentax-web/docs/audits/2026-04/evidence/i18n-leaks.json`
- `exentax-web/docs/audits/2026-04/evidence/refined-same-as-es.json`

## 3. Artículos del blog

Fuente: `exentax-web/client/src/data/blog-content/<lang>/*.ts`
+ catálogo `exentax-web/client/src/data/blog-posts.ts` (111 slugs canónicos).

| Locale | Archivos `.ts` por idioma | Cobertura |
|--------|---------------------------|-----------|
| es     | 111                       | 100 % (canon) |
| en     | 111                       | 100 % |
| fr     | 111                       | 100 % |
| de     | 111                       | 100 % |
| pt     | 111                       | 100 % |
| ca     | 111                       | 100 % |

**Total:** 666 archivos de contenido + 1 catálogo `blog-posts.ts` + 5
archivos `blog-i18n/<lang>.ts` (mapeo de slugs y metadatos por idioma).

Auditorías de calidad textual previas:
- `exentax-web/docs/i18n-quality-audit-2026-04.md`
- `exentax-web/docs/i18n-deep-audit-2026-04.md`
- `exentax-web/docs/audits/2026-04/translation-quality-audit.md`

> **Nota de alcance:** los gaps de calidad textual residuales detectados
> tras esas auditorías (≈19 textos catalanes/portugueses idénticos al ES por
> cognados verdaderos) son tratados en tareas dedicadas activas. Esta tarea
> no reabre el reescaneo línea a línea de los 666 archivos.

## 4. FAQ

Fuente: namespaces `faq.*` dentro de `i18n/locales/<lang>.ts` y
`exentax-web/server/seo-content.ts` para el JSON-LD `FAQPage`.

| Locale | Estado FAQ general | Estado FAQ por subpágina (en `subpages.<sub>.faq.items`) |
|--------|--------------------|------------------------------------------------------------|
| es     | ✅                 | ✅ (5 subpáginas con 4 items cada una)                     |
| en     | ✅                 | ✅                                                         |
| fr     | ✅                 | ✅                                                         |
| de     | ✅                 | ✅                                                         |
| pt     | ✅                 | ✅                                                         |
| ca     | ✅                 | ✅                                                         |

JSON-LD `FAQPage` se emite condicionalmente en `ServiceSubpage.tsx` cuando
`faqItems.length > 0` — verificado activo para las 5 subpáginas en los 6
idiomas.

## 5. Sitemaps y `robots.txt`

Fuente: `exentax-web/server/routes/public.ts` (líneas 998–1300).

| Recurso                | Cobertura LLC + ITIN | hreflang |
|------------------------|----------------------|----------|
| `/sitemap.xml` (índice)| Apunta a 3 sitemaps  | n/a      |
| `/sitemap-pages.xml`   | 5 subpáginas × 6 idiomas = 30 URLs | ✅ + `x-default` → es |
| `/sitemap-blog.xml`    | 111 posts × disponibilidad por idioma | ✅ |
| `/sitemap-faq.xml`     | FAQ × 6 idiomas      | ✅ + `x-default` → es |
| `/robots.txt`          | `Allow: /` + 4 sitemaps | n/a |

Sin `noindex` indebidos detectados en las 5 subpáginas (BLOQUE 8 ✅).

## 6. Componentes y arquitectura técnica

| Pieza                              | Estado |
|------------------------------------|--------|
| `pages/services/{llc-*,itin}.tsx` (5 wrappers) | ✅ delegan en componente único `ServiceSubpage` |
| `pages/services/ServiceSubpage.tsx` (compartido) | ✅ Hero, Intro, Features, BestFor, Includes, Comparison, FAQ, CTA |
| `components/SEO.tsx` (extendido)   | ✅ hreflang × 6, x-default → es, OG, Twitter, Service+FAQPage JSON-LD, Breadcrumbs |
| `shared/routes.ts`                 | ✅ slugs localizados para las 5 subpáginas en los 6 idiomas |
| `components/layout/Navbar.tsx`     | ✅ mega-menú con las 5 subpáginas |
| `components/layout/Footer.tsx`     | ✅ 4 LLC + ITIN (ITIN añadido en esta tarea) |
| `pages/services.tsx`               | ✅ grid “Explora por estado” enlazando a las 5 |

Integración 100 % alineada con el resto del proyecto (BLOQUE 10 ✅).

---

**Cierre BLOQUE 1.** Inventario al día. Gaps residuales conocidos
(consolidación final): ver `auditoria-i18n-seo-llc-itin.md` §11.
