# Auditoría multiidioma Exentax — RESUMEN

**Fecha:** 2026-04-22
**Idiomas auditados:** ES (origen), EN, FR, DE, PT, CA
**Alcance:** UI (locales i18n), páginas, blog (111 artículos × 6 lenguas), datos fiscales, fuentes, SEO multiidioma e implementación técnica de i18n.
**Reportes JSON:** `docs/auditoria-multiidioma/*.json` (10 archivos).

---

## 1. Conteos por fase

| Fase | Reporte | Hallazgos |
|------|---------|-----------|
| 1 — Inventario | inventario-contenido-multiidioma.json | 169 items catalogados (111 slugs de blog, 111 completos en 6 lenguas) |
| 2 — Traducciones faltantes | traducciones-faltantes.json | 0 items (paridad de claves UI: 0 faltantes según validador previo) |
| 3 — Calidad de traducciones | calidad-traducciones.json | 9 items (alta: 0; media: 5; resto informativo/ok). Defecto verificado: `cuota-autonomo-2026` omite base máxima en 5 lenguas. |
| 4 — Datos fiscales | datos-fiscales-verificacion.json | 8 issues (alta: 1; media: 2; baja: 2; informativo: 3). Cada issue lleva `evidence_level`. |
| 5 — Fuentes y referencias | fuentes-y-referencias.json | 9 findings (artículos sin SOURCES_BY_SLUG declarado y críticos con cifras 2026) |
| 6 — Glosario | glosario-terminologico.json | 14 términos canonizados, 1 violaciones literales en locales |
| 7 — Coherencia de tono | coherencia-tono.json | 6 findings (DE y FR usan registro formal Sie/vous frente al tuteo del original ES) |
| 8 — SEO multiidioma | seo-multiidioma-audit.json | 15 findings (hreflang, JSON-LD, longitudes meta — ver §4) |
| 9 — Auditoría del blog | blog-audit-completo.json | 111 artículos, 111 completos, 0 sin bloque de fuentes |
| 10 — Verificación técnica i18n | i18n-tecnico.json | 8 findings (fallback chain, parseMissingKeyHandler, lazy-loading, BCP-47 tags) |

---

## 2. Top 10 problemas críticos (priorizados)

1. **`cuota-autonomo-2026` (EN/FR/DE/PT/CA)** — omiten la base máxima del tramo 15 (1.607 €/mes) y el rango 1.275 €/mes para tramos altos. Pérdida de precisión numérica respecto a ES. → Reescribir el primer párrafo y la sección «Tabla de cuotas» replicando los rangos del original.
2. **Datos fiscales 2026 sin auditoría trimestral** — Artículos críticos con cifras vivas (BOI 606 USD/día, Form 5472 25.000 USD, RETA 31,5%, Modelo 720 31 marzo, IRPF abril–junio) requieren un calendario de revisión sincronizado con AEAT/IRS/FinCEN/TGSS.
3. **Política de precios pública vs página** — Si el precio público es 2.000 € constitución / 1.400 € mantenimiento (mencionado en RESUMEN del proyecto), la página actual usa «precio bajo consulta» en las 6 lenguas. Decisión comercial pendiente.
4. **`SOURCES_BY_SLUG`** — los 111 artículos declaran fuentes; el bloque «Sources / Fuentes» se renderiza correctamente con respaldo documental.
5. **hreflang multiidioma** — Verificar que `<SEO>` emita las 6 alternates + x-default por ruta y que el sitemap multilingüe incluya los 6 slugs por artículo.
6. **Tono formal en DE y FR** — Decisión editorial pendiente: mantener «Sie/vous» (B2B) o migrar a tuteo para conservar el registro cercano del original ES. Documentar como excepción si se mantiene.
7. **Longitudes meta del blog** — Verificado programáticamente: 0 metaTitle/metaDescription superan los límites de Google en EN/FR/DE/PT/CA (max title=60 car., max desc=150 car.; recomendado ≤60/≤160). En cambio, 186 metaDescription quedan < 120 car. y desperdician espacio útil en el SERP — recomendable extenderlas hacia 140-155 car.
8. **Fugas de español en PT/CA (informativo)** — Detector reporta 119 PT y 184 CA hits, pero ≥95% son cognados latinos válidos. Refinar heurística (follow-up técnico).
9. **`pt-BR` vs `pt-PT`** — `LanguageService.getLocaleTag` mapea `pt → pt-BR`. Si la audiencia objetivo es PT-PT (España/Portugal), corregir el mapeo BCP-47.
10. **Verificación HTTP de fuentes externas** — No se ejecutó en esta auditoría (sin red garantizada). Lanzar `node exentax-web/scripts/blog-verify-source-urls.mjs` y `seo-check-links.mjs` antes de la próxima publicación.

---

## 3. Idiomas / áreas más débiles

- **Alemán (DE) y Francés (FR):** registro formal (Sie/vous) frente al tuteo del original ES — desviación de tono consistente pero documentada como pendiente.
- **Catalán (CA) y Portugués (PT):** mayor número de cognados latinos detectados como «posibles fugas» de español; en su mayoría son falsos positivos pero requieren refinamiento del detector.
- **Inglés (EN), Francés (FR), Alemán (DE), Portugués (PT) y Catalán (CA) en `cuota-autonomo-2026`:** divergencia numérica con ES (caso identificado y único caso «alta» de calidad de traducción detectado en este pase).
- **Bloque de fuentes (SOURCES_BY_SLUG):** 0/111 artículos sin entrada — la cobertura es total.

---

## 4. Áreas con mayor riesgo

1. **Datos fiscales 2026** — cualquier desfase numérico entre lenguas se traduce en pérdida de credibilidad y riesgo regulatorio. Prioridad MÁXIMA.
2. **Fuentes oficiales** — afirmaciones sin respaldo en artículos de alta visibilidad (BOI, Form 5472, CDI EE.UU.–España, RETA) son el riesgo SEO/E-E-A-T más relevante.
3. **SEO multiidioma (hreflang + sitemap)** — un hreflang mal configurado puede colapsar el ranking de las versiones EN/FR/DE/PT/CA.

---

## 5. Recomendación de orden de corrección

1. **Sprint 1 (alta urgencia, fáctica):**
   - Reescribir `cuota-autonomo-2026` en EN/FR/DE/PT/CA con los rangos correctos.
   - Auditar manualmente cifras 2026 en los 5 artículos fiscales críticos (BOI, 5472, DAC7/8, RETA, IRPF) en las 6 lenguas.
   - Decidir y aplicar política de precios (2.000/1.400 € o «bajo consulta») de forma uniforme.

2. **Sprint 2 (E-E-A-T):**
   - Mantener al día las entradas de `SOURCES_BY_SLUG` (regenerar el informe con `node scripts/audit-blog-sources.mjs` cuando se añadan artículos nuevos).
   - Ejecutar `blog-verify-source-urls.mjs` y arreglar enlaces externos rotos.

3. **Sprint 3 (SEO técnico):**
   - Validar emisión de hreflang en `<SEO>` para las 6 lenguas + x-default y completitud del sitemap multilingüe (6 variantes × 111 artículos).
   - Si tras la verificación HTTP aparecen `metaTitle` > 60 car. o `metaDescription` > 160 car., acortarlos. En esta auditoría no se detectó ninguno, pero sí 186 `metaDescription` cortas (< 120 car.) en EN/FR/DE/PT/CA susceptibles de ampliarse para mejorar CTR.
   - Confirmar mapeo `pt → pt-BR` o migrar a `pt-PT` según audiencia.

4. **Sprint 4 (tono y estilo):**
   - Decidir Sie/vous vs du/tu en DE/FR. Documentar style guide.
   - Refinar detector de «Spanish leaks» con allowlist romance para PT/CA.

5. **Mantenimiento continuo:**
   - Lint de glosario (`scripts/i18n-glossary-lint.ts`) en CI.
   - Revisión trimestral de cifras fiscales 2026.
   - Validador estructural `npm run i18n:check` como gate de merge.

---

*Este RESUMEN consolida los 10 reportes JSON de `docs/auditoria-multiidioma/`. La tarea es de diagnóstico — no se modificó contenido del sitio.*
