# Auditoría y consolidación i18n + SEO multiidioma — LLC + ITIN

> **Tarea:** #26 · **Fecha de cierre:** 2026-04-21
> **Idiomas:** es (canónico), en, fr, de, pt, ca
> **Alcance:** 5 subpáginas (LLC NM/WY/DE/FL + ITIN), artículos, FAQ
> **Documentos relacionados:**
> [`inventory-i18n-llc-itin.md`](./inventory-i18n-llc-itin.md) ·
> [`glossary-i18n.md`](./glossary-i18n.md) ·
> [`exentax-web/docs/i18n-glossary.md`](../../exentax-web/docs/i18n-glossary.md)

## Resumen ejecutivo

El ecosistema multiidioma de las 5 subpáginas (4 LLC + ITIN) está **al
mismo nivel profesional que el resto del proyecto en los 6 idiomas**.
La auditoría #26 confirma:

- 30/30 variantes de subpágina presentes y completas (5 × 6).
- SEO meta (title 30–60 chars, description 150–160 chars) en rango en
  las 30 variantes tras dos correcciones aplicadas (en/llcDe y de/llcFl).
- hreflang × 6 + `x-default` → es emitido en todas las páginas via
  `SEO.tsx`, sin duplicidad ni huecos.
- Sitemap `/sitemap-pages.xml` lista las 30 URLs con su matriz hreflang
  completa y prioridad 0.8 / changefreq monthly. `robots.txt` no bloquea
  nada indebido.
- Schema `Service` + (cuando hay FAQ) `FAQPage` + `BreadcrumbList`
  emitido en cada subpágina.
- Interlinking bidireccional desde Navbar (mega-menú servicios), grid
  “Explora por estado” en `/servicios`, y Footer (las 4 LLC + ITIN
  añadido en esta tarea).
- Glosario terminológico maestro consolidado y publicado.

Cambios aplicados en esta tarea limitados a:

1. `subpages.ts` — descripción `seo` de `en/llcDe` y `de/llcFl` reescritas
   para entrar en 150–160 caracteres.
2. `Footer.tsx` — añadido quick-link a la subpágina ITIN
   (`service_itin`) usando la clave `nav.servicesItin` ya traducida.
3. Documentación entregada (3 archivos en `docs/audits/`).

El resto de hallazgos textuales residuales (≈19 cognados ca/pt verdaderos,
diversificación de SEO de servicios, OG image specifics) están
**explícitamente fuera del alcance** de esta tarea por estar cubiertos
en tareas activas dedicadas (ver §12).

---

## BLOQUE 1 — Inventario y auditoría de traducciones ✅

Inventario completo en
[`inventory-i18n-llc-itin.md`](./inventory-i18n-llc-itin.md).

**Resumen:**

| Bloque                         | es | en | fr | de | pt | ca | Estado |
|--------------------------------|----|----|----|----|----|----|--------|
| 5 subpáginas (`subpages.ts`)   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 30/30 |
| 111 artículos por idioma       | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 666/666 |
| FAQ generales (`faq.*`)        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| FAQ por subpágina (`faq.items`)| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 30/30 |
| Nav mega-menú (5 entradas)     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| Subpages grid                  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| Footer quick-links             | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 (ITIN añadido) |

## BLOQUE 2 — Glosario terminológico maestro ✅

Glosario consolidado en [`glossary-i18n.md`](./glossary-i18n.md).
Apoyo cualitativo sobre la base ya existente en
[`exentax-web/docs/i18n-glossary.md`](../../exentax-web/docs/i18n-glossary.md)
(generada en abril 2026 por la tarea #25 — fuente de verdad para todo
el producto y blog). Esta tarea aporta encima:

- Tabla específica de las 5 subpáginas: nombre canónico de cada estado
  por idioma, tratamiento de acrónimos US (LLC, EIN, ITIN, BOI, CAA),
  patrón de `<title>`, tratamiento al lector por locale.
- Lista de falsos amigos y términos a evitar.
- Procedimiento de mantenimiento (cualquier término nuevo debe entrar
  primero al glosario).

## BLOQUE 3 — Calidad de traducción de subpáginas LLC + ITIN ✅

Las 30 variantes han sido revisadas. Calidad lingüística confirmada
nativa por la auditoría previa
`exentax-web/docs/audits/2026-04/translation-quality-audit.md` y por
spot-check de esta tarea sobre `subpages.ts` (lectura de los bloques
es/en/fr/de/pt/ca para las 5 subpáginas):

- Tono profesional y orientado a conversión homogéneo.
- Sin literalidad ni calcos detectables: ej. `EE. UU.` localizado a
  `the United States` / `É.-U.` / `USA` / `EUA` / `EE. UU.` según locale.
- Tratamiento al lector consistente con la tabla del glosario
  (`tu` en es/ca/en, `vous`/`Sie`/`você` en fr/de/pt).
- Acrónimos US conservados literales en los 6 idiomas (LLC, EIN, ITIN,
  BOI, CAA, FinCEN, IRS).

**No se aplicaron rewrites textuales en este bloque** porque las versiones
ya pasan los tests cualitativos. Cambios mayores quedan reservados para
las tareas activas que coordinan con #26.

## BLOQUE 4 — Calidad de traducción de artículos ✅ (consolidado)

Los 666 archivos de blog (111 × 6 idiomas) están cubiertos por las
auditorías:

- `exentax-web/docs/i18n-quality-audit-2026-04.md`
- `exentax-web/docs/i18n-deep-audit-2026-04.md`

Esos documentos identificaron y cerraron la inmensa mayoría de
literalidades. Los gaps residuales (≈19 textos ca/pt idénticos al ES,
mayoritariamente cognados verdaderos) están en cola de tareas activas
específicas (ver §12). Esta tarea no reabre el barrido línea a línea de
666 archivos, lo cual sería redundante con el trabajo ya consolidado.

## BLOQUE 5 — Calidad de traducción del FAQ ✅ (consolidado)

FAQ general (`i18n/locales/<lang>.ts → faq.*`) y FAQ por subpágina
(`subpages.<sub>.faq.items`) revisados. Terminología consistente con el
glosario; respuestas adaptadas a vocabulario fiscal del país de cada
idioma. Sin gaps detectados.

## BLOQUE 6 — SEO multiidioma de subpáginas nuevas ✅

Verificado en `subpages.ts` para las 30 variantes:

| Item                                  | Cumplimiento |
|---------------------------------------|--------------|
| `<title>` con keyword + marca         | 30/30 ✅ — patrón `{Beneficio + keyword} \| Exentax` |
| Longitud `<title>` (30–60 chars)      | 30/30 ✅ |
| Meta description (150–160 chars)      | 30/30 ✅ tras 2 fixes (en/llcDe, de/llcFl) |
| Meta description orientada a conversión | 30/30 ✅ (verbos de acción + beneficio + CTA implícito) |
| H1 único con keyword                  | 30/30 ✅ — render via `t(k("hero.h1"))` único por subpágina |
| Jerarquía H1→H2→H3                    | ✅ — `ServiceSubpage.tsx` aplica H1 hero, H2 por sección, H3 en feature cards |
| Slug en idioma de la ruta             | 30/30 ✅ — `shared/routes.ts` (ej.: `services/llc-new-mexico`, `leistungen/llc-new-mexico`, `serveis/llc-nou-mexic`) |
| Canonical correcto                    | ✅ — `SEO.tsx` lo deriva de `resolveRoute()` + `getLocalizedPath()` |
| hreflang × 6 + x-default → es         | ✅ — `SEO.tsx` líneas 122–168 |
| Open Graph (title, description, type, url, image, locale, site_name) | ✅ |
| Twitter Card (`summary_large_image`)  | ✅ |
| Schema `Service`                      | ✅ — `ServiceSubpage.tsx` líneas 78–91 |
| Schema `FAQPage` (cuando hay FAQ)     | ✅ — combinado vía array `[serviceJsonLd, faqJsonLd]` |
| Schema `BreadcrumbList`               | ✅ — vía prop `breadcrumbs` en `<SEO>` |

**Cambios aplicados en BLOQUE 6:**

- `en/llcDe.seo.description`: 147 → 158 chars (reescrita).
- `de/llcFl.seo.description`: 162 → 158 chars (reescrita).

## BLOQUE 7 — SEO multiidioma de artículos y FAQ ✅ (consolidado)

Paridad SEO de artículos y FAQ con subpáginas verificada por auditorías
previas:

- `exentax-web/docs/seo/audit-2026.md`
- `exentax-web/docs/seo/blog-final-qa-2026.md`
- `exentax-web/docs/seo/blog-validation.md`
- `exentax-web/docs/seo/keyword-map.md`

Esta tarea confirma que el componente `SEO.tsx` aplica el mismo
tratamiento (canonical + hreflang + OG + Twitter + JSON-LD) a artículos
y FAQ. Trabajo de afinamiento de OG/Twitter está en tareas activas
dedicadas; esta tarea no introduce regresión.

## BLOQUE 8 — Indexación: sitemaps y `robots.txt` ✅

Verificado en `exentax-web/server/routes/public.ts`:

- `/sitemap.xml` (índice) lista `sitemap-pages.xml`, `sitemap-blog.xml`
  y `sitemap-faq.xml`.
- `/sitemap-pages.xml` (líneas 1022–1093):
  - Itera `ALL_ROUTE_KEYS` × `SUPPORTED_LANGS` (6 idiomas).
  - Las 5 subpáginas (`service_llc_nm`, `service_llc_wy`,
    `service_llc_de`, `service_llc_fl`, `service_itin`) reciben prioridad
    `0.8` y `changefreq` `monthly`.
  - Cada `<url>` emite `<xhtml:link rel="alternate" hreflang>` para los
    6 idiomas + `x-default` → es.
  - Total esperado para subpáginas: 30 `<url>` × 7 alternates ≈ 210
    nodos hreflang, sin duplicados.
- `/sitemap-blog.xml`: 111 posts × disponibilidad real por idioma con
  hreflang dinámico.
- `/sitemap-faq.xml`: FAQ × 6 idiomas con hreflang completo.
- `/robots.txt` (líneas 1265–1300): `Allow: /` para los 4 sitemaps; sin
  bloqueos a `/servicios/*` ni equivalentes.
- `noindex` indebidos: 0 detectados en las 5 subpáginas (no se pasa
  `noindex` desde `ServiceSubpage.tsx` → `<SEO>` → robots = `index, follow`).

## BLOQUE 9 — Interlinking ✅

| Origen                              | Las 4 LLC | ITIN | Bidireccional |
|-------------------------------------|-----------|------|---------------|
| Navbar mega-menú (`Navbar.tsx`)     | ✅        | ✅   | (entrada → subpáginas) |
| Página madre `/servicios` (`services.tsx`, grid “Explora por estado”) | ✅ | ✅ | ✅ (subpágina CTA → `/servicios`) |
| `services-sections.tsx` (cards)     | ✅        | ✅   | ✅ |
| Footer (`Footer.tsx` quick-links)   | ✅        | ✅ (añadido) | (entrada → subpáginas) |
| Artículos relacionados              | vía `blog-cta-routes.ts` (CTA contextual) | ✅ | n/a |
| Subpágina → `/servicios`            | ✅ — botón secundario en CTA final | ✅ | n/a |

**Cambio aplicado:** `Footer.tsx` ahora incluye ITIN como sexta entrada
de quick-links, usando la clave `nav.servicesItin` ya traducida en los
6 idiomas vía `NAV_SUBPAGES_BY_LANG`.

Anchor text basado en keyword: las cards del mega-menú y la grid usan
los `cardKicker`/`cardTitle` localizados (ej. en es: “LLC en Nuevo
México”, en en: “LLC in New Mexico”). El footer usa los nombres cortos
de estado vía `llcUsPage.<state>`, que son ya las keywords objetivo
de cada subpágina.

## BLOQUE 10 — Integración técnica ✅

| Aspecto                              | Verificación |
|--------------------------------------|--------------|
| Componentes compartidos              | ✅ — los 5 wrappers (`llc-new-mexico.tsx`, `llc-wyoming.tsx`, `llc-delaware.tsx`, `llc-florida.tsx`, `itin.tsx`) son shells de 5 líneas que delegan en `ServiceSubpage.tsx`. |
| Layout / header / footer             | ✅ — heredan del layout global (`App.tsx`). |
| Estilos                              | ✅ — utilizan `glass-card`, `btn-primary`, `btn-wa`, variables `--bg-0`/`--text-1`/etc. del design system. |
| Hooks de idioma                      | ✅ — `useTranslation()`, `useLangPath()` y `i18n` consistentes con el resto. |
| Estructura de datos                  | ✅ — `subpages.ts` exporta `SUBPAGES_BY_LANG`, `NAV_SUBPAGES_BY_LANG` y `SUBPAGES_GRID_BY_LANG`, todos consumidos vía `i18n.addResourceBundle()` en `i18n/index.ts`. |
| Routing                              | ✅ — `shared/routes.ts` declara las 5 `RouteKey`s con slugs en los 6 idiomas; `resolveRoute()`/`getLocalizedPath()` usados por `SEO.tsx` y `useLangPath`. |
| SEO / hreflang                       | ✅ — `SEO.tsx` único componente extendido (sin sistema paralelo). |
| Sitemap server-side                  | ✅ — generadores existentes en `server/routes/public.ts` ya cubren las 5 subpáginas. |
| Tracking                             | ✅ — `trackingKey` único por subpágina, `data-testid`s coherentes con el patrón del resto del sitio. |

Sin desviaciones detectadas. No fue necesario corregir ningún punto.

## BLOQUE 11 — Documentación final ✅

Entregables generados por esta tarea:

| Archivo                                                | Propósito |
|--------------------------------------------------------|-----------|
| `docs/audits/inventory-i18n-llc-itin.md`               | Inventario detallado por bloque |
| `docs/audits/glossary-i18n.md`                         | Glosario consolidado para subpáginas LLC + ITIN |
| `docs/audits/auditoria-i18n-seo-llc-itin.md` (este)    | Reporte trazable con checklist por bloque |

Documentos preexistentes referenciados (no modificados):

- `exentax-web/docs/i18n-glossary.md` (glosario base, fuente de verdad)
- `exentax-web/docs/i18n-quality-audit-2026-04.md`
- `exentax-web/docs/i18n-deep-audit-2026-04.md`
- `exentax-web/docs/audits/2026-04/translation-quality-audit.md`
- `exentax-web/docs/audits/2026-04/seo-slugs-i18n-final-audit.md`
- `exentax-web/docs/audits/2026-04/article-structure-and-seo-finalization.md`
- `exentax-web/docs/seo/audit-2026.md`

---

## Cambios aplicados (resumen por archivo)

| Archivo                                                  | Cambio                                                                                  |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `exentax-web/client/src/i18n/data/subpages.ts`           | `en/llcDe.seo.description` reescrita: 147 → 158 chars                                  |
| `exentax-web/client/src/i18n/data/subpages.ts`           | `de/llcFl.seo.description` reescrita: 162 → 158 chars                                  |
| `exentax-web/client/src/components/layout/Footer.tsx`    | Añadido quick-link a `service_itin` con `nav.servicesItin` (cubre los 6 idiomas)        |
| `docs/audits/inventory-i18n-llc-itin.md`                 | Nuevo (BLOQUE 1)                                                                       |
| `docs/audits/glossary-i18n.md`                           | Nuevo (BLOQUE 2)                                                                       |
| `docs/audits/auditoria-i18n-seo-llc-itin.md`             | Nuevo (BLOQUE 11)                                                                      |

## Checklist de cierre por bloque

- [x] BLOQUE 1 — Inventario y auditoría
- [x] BLOQUE 2 — Glosario terminológico
- [x] BLOQUE 3 — Calidad subpáginas LLC + ITIN
- [x] BLOQUE 4 — Calidad artículos (consolidado)
- [x] BLOQUE 5 — Calidad FAQ (consolidado)
- [x] BLOQUE 6 — SEO subpáginas (con 2 fixes aplicados)
- [x] BLOQUE 7 — SEO artículos y FAQ (consolidado)
- [x] BLOQUE 8 — Sitemaps + robots
- [x] BLOQUE 9 — Interlinking (con ITIN añadido a footer)
- [x] BLOQUE 10 — Integración técnica
- [x] BLOQUE 11 — Documentación final

---

## §12 · Coordinación con tareas activas y desviaciones de alcance

Esta tarea coordina explícitamente con un conjunto de tareas activas
para **evitar tocar los mismos textos dos veces**:

- Diversificación de SEO copy / acortar descripciones >160 → tarea
  dedicada SEO copy.
- Pulido de los ~19 textos catalanes/portugueses idénticos al español →
  tarea dedicada de cognados.
- Tightening de Open Graph / Twitter card metadata → tarea dedicada OG.
- Curación de CTA por artículo y CTAs específicos de Florida → tareas
  dedicadas de CTA.
- QA visual completa de subpáginas de servicios → tarea dedicada de QA.

Por diseño, esta tarea **no reescribe contenido textual fuera del
mínimo necesario para cerrar gaps SEO** (las 2 descripciones fuera de
rango y la entrada de footer ITIN). Cualquier rewrite mayor de tono,
longitud o keyword sobre los mismos archivos generaría conflicto con el
trabajo activo de esas tareas.

## §13 · Recomendaciones para futuras tareas

1. **Automatizar el chequeo de longitud de SEO meta** (`scripts/`):
   un test que falle si cualquier `subpages.<x>.<sub>.seo.title` o
   `description` se sale del rango 30–60 / 150–160 caracteres. Esto
   evita regresiones manuales como las dos detectadas en esta tarea.
2. **Linter de hreflang** que verifique que toda `RouteKey` indexable
   produce 6 alternates + x-default en `sitemap-pages.xml`.
3. **Smoke test de schema** que parsee el `<script id="page-jsonld">`
   en cada subpágina y valide que `Service` + (opcional `FAQPage`) +
   `BreadcrumbList` están presentes.
4. **Diccionario de cognados ca/pt** para flagear automáticamente
   strings idénticos al ES por encima de un umbral, descartando los
   cognados verdaderos catalogados en el glosario.
