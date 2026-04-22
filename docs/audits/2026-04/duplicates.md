# 06 — Clusters de duplicación / canibalización — decisiones

Pares de artículos con título ES suficientemente similar (Jaccard ≥ 0.5 sobre tokens significativos). Cada par tiene una **decisión editorial explícita** (consolidar o diferenciar). Las consolidaciones se materializan como 301 server-side en `exentax-web/server/routes/public.ts` (`BLOG_CONSOLIDATION_REDIRECTS`).

| Slug A | Slug B | Jaccard | Decisión | Canónico | Justificación |
| --- | --- | --- | --- | --- | --- |
| cuota-autonomo-2026 | tramos-irpf-2026 | 0.56 | differentiate | — | Distinct fiscal topics (RETA quota vs IRPF brackets); pair is complementary, not cannibalizing. Cross-link via relatedSlugs already in place. |

## Cobertura de redirects 301

Los slugs marcados como `consolidate` arriba se mapean en el handler `BLOG_CONSOLIDATION_REDIRECTS` de `exentax-web/server/routes/public.ts`, que emite 301 en los 6 idiomas (resuelve el slug deprecado al canónico vía `getTranslatedSlug`) y se valida con `exentax-web/server/routes/public.test.ts` (test `consolidation 301`). Los slugs marcados como `differentiate` no requieren redirect — se mantienen como artículos independientes con cross-links curados en `relatedSlugs`.