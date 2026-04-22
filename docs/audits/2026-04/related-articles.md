# Related articles — verificación de no-404 por locale

Generado por `exentax-web/scripts/audit-2026-04-related-validate.mjs`. Para cada artículo, recorre los `relatedSlugs` declarados en `client/src/data/blog-posts.ts`, los traduce a la slug localizada vía `BLOG_SLUG_I18N`, y verifica que el fichero de contenido `client/src/data/blog-content/{locale}/<slug>.ts` existe. Si falta cualquier idioma, el script falla con código de salida ≠ 0 y el build se bloquea.

## Resumen por locale

| Locale | Checks ejecutados | OK (no-404) | Fallos |
| --- | --- | --- | --- |
| es | 337 | 337 | 0 ✅ |
| en | 337 | 337 | 0 ✅ |
| fr | 337 | 337 | 0 ✅ |
| de | 337 | 337 | 0 ✅ |
| pt | 337 | 337 | 0 ✅ |
| ca | 337 | 337 | 0 ✅ |

**Total**: 2022 verificaciones, 0 fallos. ✅ Todos los enlaces de related-articles resuelven a un fichero de contenido publicado.

## Evidencia por artículo (primeras 10 filas — ver JSON sidecar para el detalle completo)

| Artículo | es | en | fr | de | pt | ca |
| --- | --- | --- | --- | --- | --- | --- |
| llc-estados-unidos-guia-completa-2026 | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| form-5472-que-es-como-presentarlo | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| nuevo-mexico-vs-wyoming-vs-delaware | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| separar-dinero-personal-llc-por-que-importa | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| ein-numero-fiscal-llc-como-obtenerlo | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| cuenta-bancaria-mercury-llc-extranjero | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| autonomo-espana-vs-llc-estados-unidos | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| impuestos-clientes-internacionales-espana | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| pagar-cero-impuestos-legalmente-llc | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |
| nomada-digital-residencia-fiscal | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ | 3/3 ✅ |

(El detalle completo por (artículo × locale × related) vive en `related-articles.json`.)

## Cómo se ancla en el build

- `scripts/build.ts` ejecuta este script como gate de despliegue (alongside seo-meta-audit, seo-related-validate, cta-conversion-audit, inline-review-markers, cta-changelog).
- `scripts/seo-related-validate.mjs` complementa este check verificando que cada `relatedSlugs` referencia slugs canónicos existentes en `BLOG_POSTS` (no huérfanos).
- `server/routes/public.test.ts` cubre el comportamiento HTTP del router (301 de slugs legacy, 200 en slugs canónicos).