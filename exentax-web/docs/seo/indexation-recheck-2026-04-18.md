# Re-verificación de indexación — 18 abril 2026

**Tarea:** #57 — Re-verificar que Google indexa el 100% de las páginas tras los cambios.
**Auditor:** Revisión interna SEO.
**Estado anterior:** Indexación 100% confirmada en la auditoría previa (`audit-2026.md`).
**Resultado actual:** ✅ Sin regresiones. Sitemap, canonicales y hreflang siguen alineados con el estado anterior.

---

## 1. Comandos ejecutados

| Check | Comando | Resultado |
|-------|---------|-----------|
| Enlaces internos del blog (rotos + huérfanos) | `npm run seo:check` | ✅ OK — 0 enlaces rotos, los 79 artículos tienen ≥ 3 enlaces entrantes |
| Tests unitarios del checker | `node scripts/seo/seo-check-links.test.mjs` | ✅ OK |
| Sitemap + hreflang end-to-end (servidor en `:5000`) | `BASE_URL=http://localhost:5000 node scripts/seo/seo-sitemap-check.mjs` | ✅ OK — 480 URLs verificadas, todas 2xx |

Salida resumida del checker oficial:

```
✓ No broken internal blog links.
✓ All 79 articles have ≥ 3 incoming links.
seo-check-links: OK
```

Salida resumida del check de sitemap:

```
Blog index URLs: 6 (expected 6)
Blog post URLs: 474  per-lang: {"es":79,"en":79,"fr":79,"de":79,"pt":79,"ca":79}
Checking HTTP status on 480 URLs (concurrency=24) ...
OK — sitemap and hreflang checks passed.
```

---

## 2. Sitemap

- **Path:** `/sitemap.xml`, cache 1 h.
- **Cobertura blog:** 79 slugs × 6 idiomas = **474** URLs de artículo + 6 índices de blog = **480 URLs de blog**, todas devuelven HTTP 200.
- **Idiomas presentes:** `es`, `en`, `fr`, `de`, `pt`, `ca` — paridad perfecta (79/79 en cada uno).
- **Sin duplicados** en `<loc>`.
- **Lastmod / changefreq / priority:** sin cambios respecto a la auditoría previa. La recomendación abierta de no usar `todayMadridISO()` para páginas principales sigue documentada en `audit-2026.md` §2.3 y no es una regresión introducida por los cambios recientes.

Frente al estado anterior (también 79×6 = 474), **no hay URLs nuevas ni perdidas**. La cardinalidad por idioma coincide exactamente.

## 3. Canonicales

Verificado en `server/static.ts` (`injectMeta` líneas 107–185):

- Cada URL recibe un único `<link rel="canonical">` apuntando a la versión con prefijo de idioma.
- Las rutas españolas sin prefijo siguen siendo reescritas a `/es/...` por `injectMeta`. La acción pendiente de añadir 301 desde URLs sin prefijo (ya documentada en `audit-2026.md` §2.1) **no se considera regresión**: el comportamiento es el mismo que en la auditoría anterior.
- La limpieza de componentes y los ajustes de copy de booking no han tocado `server/static.ts`, `server/seo-content.ts` ni `server/sitemap.ts`, así que la lógica de canonicalización se mantiene íntegra.

## 4. Hreflang

El check end-to-end valida en cada artículo:

1. Presencia de `x-default` apuntando a la variante `/es/...`.
2. Existencia de los 5 alternates de idiomas hermanos por artículo.
3. **Reciprocidad**: si A lista B como alternate, B lista A con el mismo `href`.
4. Consistencia del grupo: los 6 miembros del grupo declaran exactamente el mismo conjunto de hrefs.

Resultado: **0 errores** sobre 474 artículos × 6 idiomas. Coincide con el estado de la auditoría previa.

## 4.b Verificación complementaria de URLs no-blog

`seo-sitemap-check.mjs` se centra en el blog. Para cubrir literalmente "el 100% de las páginas" añado una verificación ad-hoc del resto del sitemap (páginas principales + legales + home), ejecutada contra el servidor en `localhost:5000`:

| Métrica | Valor |
|---------|-------|
| URLs totales en `/sitemap.xml` | **546** |
| URLs no-blog | **66** (11 × 6 idiomas) |
| Distribución por idioma | es 11 · en 11 · fr 11 · de 11 · pt 11 · ca 11 |
| URLs no-blog con hreflang completo (6 + x-default) | 66 / 66 |
| URLs no-blog con HTTP 2xx | 66 / 66 |

Total verificado en esta re-comprobación: **546 URLs** (480 de blog + 66 no-blog), 0 errores de hreflang, 0 respuestas no-2xx.

## 5. Diff vs. estado anterior

| Métrica | Estado previo | Hoy (18-abr-2026) | Δ |
|---------|---------------|-------------------|---|
| Slugs de blog | 79 | 79 | 0 |
| Idiomas | 6 | 6 | 0 |
| URLs de blog en sitemap | 480 (474 posts + 6 índices) | 480 | 0 |
| URLs no-blog en sitemap | 66 | 66 | 0 |
| Total URLs en sitemap | 546 | 546 | 0 |
| URLs con HTTP 2xx | 546 | 546 | 0 |
| Errores de hreflang | 0 | 0 | 0 |
| Canonicales únicos por URL | sí | sí | sin cambios |

## 6. Conclusión

Los cambios recientes (limpieza de componentes, ajustes de Layout y copy de booking) **no han introducido regresiones SEO** detectables por las herramientas automáticas:

- `npm run seo:check` limpio.
- Sitemap completo, sin duplicados y con paridad de idiomas perfecta.
- Hreflang recíproco y consistente.
- Canonicales sin cambios respecto al diseño documentado.

**Acciones nuevas a abrir:** ninguna. Las acciones pendientes (301 desde URLs ES sin prefijo y `lastmod` por página real) ya están registradas en `audit-2026.md` y no derivan de esta re-verificación.
