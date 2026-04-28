# SEO

## Cobertura

- 6 idiomas: ES (referencia) · EN · FR · DE · PT · CA.
- 14 páginas estáticas + 5 sub-páginas de servicios + 111 artículos de blog × 6 = **666 URLs de blog** + 6 índices de blog + 96 URLs de páginas/FAQ.
- Sitemap-index en `/sitemap.xml`, hijos `/sitemap-pages.xml`, `/sitemap-blog.xml`, `/sitemap-faq.xml`.

## Hreflang

- Formato BCP-47 emitido por el servidor: `es-ES`, `en-US`, `fr-FR`, `de-DE`, `pt-PT`, `ca-ES`, más `x-default` apuntando a la URL ES.
- `scripts/seo/seo-sitemap-check.mjs` normaliza el `hreflang` declarado a su sub-tag primario antes de comparar contra `LANGS`, así cualquier región alterna (`es-419`) seguiría pasando sin tocar la lista.
- Cuando no haya traducción real, el alterno cae a la URL ES (recomendación interna de Google). Hoy la cobertura es 100%.

## JSON-LD

Renderizado por los componentes de `client/src/components/seo/`:

- `Organization` y `WebSite` en el shell global.
- `BreadcrumbList` en cada página interna.
- `Article` en cada post de blog (autor, fechas, headline, image).
- `FAQPage` en `/faq` y verificado por `blog:faq-jsonld`.

## Meta

- `<title>` y `<meta description>` únicos por idioma (auditados por `scripts/seo/verify-meta.ts`).
- Open Graph + Twitter Cards completos.
- Canonical absoluto por URL en cada idioma.

## Open Graph image

- **Estrategia aprobada (Tarea #20):** un único `og:image` global de marca,
  el "Exentax OG card" en `client/public/og-image.png` (1200×630 PNG, 91 KB).
  No se generan variantes por idioma porque la tarjeta es bilingüe-neutra
  (logo + claim "0% Federal Tax") y mantiene CTR uniforme entre ES/EN/FR/DE/PT/CA.
- Cableado en `client/src/components/SEO.tsx` como default de `og:image` y
  `twitter:image`; el prerender HTML (`server/static.ts`) inyecta el mismo
  asset para los bots, y `index.html` lo declara para fetchers que no
  ejecutan JS.
- **Override por página soportado:** los posts de blog pueden declarar
  `ogImage` en `client/src/data/blog-posts.ts` (default ES) o por idioma en
  `client/src/data/blog-i18n/<lang>.ts`. Cuando está presente, se propaga a
  `<SEO image>` y al `BlogPosting` JSON-LD. Sin override, cae al brand card.
- **Garantía CI:** `scripts/seo/audit-social-previews.ts` verifica que cada
  ruta pública declarada exista en `client/public/` y emite
  `missing-og-image-asset(<path>)`; `scripts/seo/validate-social-previews.mjs`
  convierte ese señal en error duro.
- **Favicons / iconos PWA:** `scripts/seo/validate-icon-assets.mjs`
  (expuesto como `npm run seo:icons` y encadenado dentro de
  `npm run seo:check`) lee la cabecera PNG de `favicon-16x16.png`,
  `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png`,
  `icon-192.png` y `icon-512.png`, y falla si las dimensiones
  intrínsecas no coinciden con el nombre de archivo. Cruza además cada
  entrada de `site.webmanifest > icons[]` para garantizar que el
  atributo `sizes` declarado coincide con los píxeles reales del
  archivo apuntado.

## Auditorías automáticas

| Gate | Qué garantiza |
| --- | --- |
| `seo:check` | 0 enlaces internos rotos en blog · cada artículo con ≥3 incoming |
| `seo:slash` | Trailing-slash y casing limpios · sin loops 301 |
| `seo:meta` | Títulos/descripciones únicos por idioma; sin duplicados |
| `seo:masterpiece-strict` | Score editorial ≥ 80 por artículo (mean actual 99.7/100) |
| `blog:validate-all` | Bundle de 10 sub-pasos: consistency, content-lint, internal-links, locale-link-leak, cta, data, sources, faq-jsonld, sitemap, masterpiece |

## Reglas editoriales clave

- Años en prosa: el auditor exige 0 menciones editoriales sueltas. Las excepciones legítimas (citas legales mes+año, RD/Ley X/YYYY, año declarado por el slug, snippets dentro del review-anchor) se descuentan automáticamente.
- Año declarado por slug: si el slug contiene `-2026`, las menciones de `2026` no penalizan; cualquier otro año sí.
