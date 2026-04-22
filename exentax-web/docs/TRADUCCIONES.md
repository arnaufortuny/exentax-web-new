# TRADUCCIONES

## Idiomas soportados

ES (referencia) · EN · FR · DE · PT · CA — siempre los seis, sin excepciones.

## Dónde viven las cadenas

| Tipo | Ubicación |
| --- | --- |
| UI estática | `client/src/i18n/locales/{lang}.ts` (objeto plano por idioma) |
| Slugs por idioma del blog | `client/src/data/blog-posts-slugs.ts` (`BLOG_SLUG_I18N`) |
| Slugs legacy → canónico | `client/src/data/blog-posts-slugs.ts` (`BLOG_SLUG_LEGACY_I18N`, sólo para redirects 301) |
| Meta del blog por idioma | `client/src/data/blog-i18n/{lang}.ts` (title, excerpt, metaTitle, metaDescription, ogTitle, ogDescription, keywords) |
| Cuerpo del artículo por idioma | `client/src/data/blog-content/{lang}/{es-base-slug}.ts` (template literal `export default \`...\`;`) |
| Meta de páginas estáticas | `client/src/data/page-meta.ts` |

> **Convención crítica**: el nombre del fichero en `blog-content/{lang}/` siempre es el slug ES base. El slug por idioma se resuelve en runtime vía `getTranslatedSlug()`. Renombrar un fichero a su slug nativo rompería `BLOG_AVAILABILITY` en el servidor.

## Garantía de cobertura

`npm run i18n:check` valida en cada `npm run check`:

- 0 missing keys
- 0 extra keys
- 0 empty values
- 0 placeholder mismatches
- 0 structure mismatches
- 0 phantom keys (referencias en código sin clave en ningún idioma)
- 0 concatenaciones con `t()`
- 0 atributos hardcodeados que deberían ir en i18n

## Workflow para añadir un artículo

1. Crear `client/src/data/blog-content/{lang}/{es-base-slug}.ts` en los 6 idiomas (mismo nombre de fichero).
2. Añadir la entrada en `client/src/data/blog-posts.ts` (slug ES + fecha + estructura).
3. Registrar el slug por idioma en `BLOG_SLUG_I18N` (`blog-posts-slugs.ts`).
4. Añadir meta por idioma en `blog-i18n/{lang}.ts` (title/excerpt/metaTitle/metaDescription mínimos).
5. Lanzar `npm run check` y resolver hasta verde.

## Calidad

- Terminología fiscal coherente entre idiomas (glossary en `docs/i18n-glossary.md`).
- Auditorías recientes: `docs/i18n-deep-audit-2026-04.md`, `docs/i18n-quality-audit-2026-04.md`.
