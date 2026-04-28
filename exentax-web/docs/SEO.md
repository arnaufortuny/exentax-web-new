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
