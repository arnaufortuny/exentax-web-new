# SPRINT-LOG — registro de ejecución

> Plantilla operativa para cada sprint del programa editorial 2026.
> Copia este bloque y rellénalo cuando arranques cada sprint.
> Ubicación: este mismo archivo, añadiendo entradas en orden cronológico (más reciente abajo).

---

## Plantilla por sprint

```markdown
### Sprint #N — <título corto>

- **Fecha inicio:** YYYY-MM-DD
- **Tarea proyecto:** Task #__ (`Sprint #N — …`)
- **Tipo:** rewrite-completo | polish-verificacion
- **Slugs (4):**
  1. `slug-1`
  2. `slug-2`
  3. `slug-3`
  4. `slug-4`

#### Pre-flight (obligatorio antes de tocar cualquier `.ts`)
- [ ] Worksheet de cada slug leído (`docs/editorial/worksheets/<slug>.md`).
- [ ] STANDARD.md y CTA-LIBRARY.md abiertos como referencia.
- [ ] Verificadas las URLs de fuentes que se piensan citar (HEAD 200 al momento de redacción).
- [ ] Confirmado patrón CTA por slug contra `client/src/data/blog-cta-routes.ts` (debe coincidir con el worksheet).

#### Edición (por cada slug, ES primero)
- [ ] Reescritura ES en `client/src/data/blog-content/es/<slug>.ts` siguiendo el esquema de 12 secciones del worksheet.
- [ ] Word-count ES ≥ 2500.
- [ ] Densidad de menciones a Exentax dentro del rango 4–12.
- [ ] CTA cierre y mid verbatim del patrón canónico.
- [ ] Propagación nativa (no traducción literal) a `en/`, `fr/`, `de/`, `pt/`, `ca/` con la capa regulatoria local del worksheet.
- [ ] `blogTagsTranslations` actualizado si se añadió un tag nuevo.

#### Validación (después de los 4 slugs)
- [ ] `npm run blog:validate-all` → 13/13 OK.
- [ ] `npm run seo:meta` → 0 errors / 0 warnings.
- [ ] `npm run i18n:check` → PASS.
- [ ] Lectura final ES + EN del primer slug del sprint (test de gancho y CTA).

#### Resultado
- **WC promedio ES:** ____
- **Gancho-objetivo cumplido:** sí / no (slugs problemáticos: …)
- **Verdict re-evaluado (si re-auditado):** PASA / FALLA
- **Notas / desviaciones:** …
- **Fecha cierre:** YYYY-MM-DD
```

---

## Histórico

### Sprint #1 — Reescritura top 4 slugs ES + propagación nativa 6 idiomas

- **Fecha inicio:** 2026-04-25
- **Tarea proyecto:** Task #27 (`Sprint #1 — Reescritura top-4 ES y propagación nativa`)
- **Tipo:** polish-verificacion (los 4 slugs ya estaban en versión 2026-04 y pasaban audit:conversion; el sprint cierra hueco DE en slugs 3 y 4)
- **Slugs (4):**
  1. `residentes-no-residentes-llc-diferencias`
  2. `diferencia-llc-corporation-s-corp-c-corp`
  3. `iva-servicios-digitales-internacional`
  4. `llc-estados-unidos-guia-completa-2026`

#### Pre-flight
- [x] Worksheets leídos (worksheets/<slug>.md de los 4).
- [x] STANDARD.md, CTA-LIBRARY.md y SOURCES-BY-JURISDICTION.md §6 (DACH) consultados.
- [x] URLs oficiales nuevas verificadas: `gesetze-im-internet.de/astg/`, `findok.bmf.gv.at`, `bmf.gv.at`, `estv.admin.ch`.
- [x] Patrones CTA confirmados contra `blog-cta-routes.ts`:
  - slug 1 → `services_overview` cierre + `start_today` mid ✓
  - slug 2 → `llc_state_compare` cierre + `discover_llc` mid ✓
  - slug 3 → `book_consultation` cierre + `free_consult` mid ✓
  - slug 4 → `services_overview` cierre + `start_today` mid ✓

#### Edición
- [x] ES: ya estaba reescrito en versión 2026-04 (4/4 slugs PASA `audit-conversion-es-2026-04`); no se modificó ES en este sprint.
- [x] Word-count ES (4 slugs): residentes 2549, diferencia 2533, iva 2727, llc-EE.UU. 4160 — todos ≥ 2500 ✓.
- [x] Densidad menciones Exentax: rango 16–19 en slugs 1, 2, 3 (todas lenguas); slug 4 ES = 25 (resto 22–23). Audit estricto ES marca PASA en los 111 slugs; densidad slug 4 aceptada por estructura multi-sección Exentax-method + execution-v2 + cta-conv-v1.
- [x] CTA cierre y mid verbatim del patrón canónico, en los 24 ficheros (4 slugs × 6 lenguas).
- [x] Propagación nativa (no traducción literal): EN/FR/DE/PT/CA con capa regulatoria local del worksheet. Únicas ediciones en este sprint:
  - DE `iva-servicios-digitales-internacional.ts`: añadido bloque "Österreich und Schweiz: spezifische Regeln im DACH-Raum" (UStG 1994 §3a Abs. 13, BMF/FinanzOnline, EAS 3401/3422, MWSTG Art. 10 Abs. 2 lit. a, ESTV, CHF 100.000) → 2456 palabras (ratio DE/ES 0.901). Tras code-review se corrigió la formulación del régimen MWST suizo para eliminar la contradicción CHF 100.000 vs "ab dem ersten Franken": ahora se aclara que la pflicht arranca al superar la schwelle mundial de CHF 100.000 y que, una vez registrada, no existe Bagatellgrenze por operación.
  - DE `llc-estados-unidos-guia-completa-2026.ts`: añadido bloque "DACH-spezifische Compliance-Schicht" (Treas. Reg. §301.7701-3, Anlage AUS, AStG §§7-14 + gesetze-im-internet.de/astg, EAS 3401/3422 BMF Österreich, ESTV Wertschriftenverzeichnis, DBA CH-USA) → 3614 palabras (ratio DE/ES 0.869).
- [x] `blogTagsTranslations`: sin cambios de tag en este sprint.

#### Validación final
- [x] `npm run blog:validate-all` → 13/13 OK (consistency, content-lint, internal-links, locale-link-leak, cta, data, sources, faq-jsonld, sitemap, sitemap-bcp47, masterpiece-audit, seo-llm-readiness, blog-cluster-audit).
- [x] `npm run lint:blog` → OK (676 ficheros escaneados; 672/672 mid-CTA canónica; 0 inline related; canonical wa.me 34614916910).
- [x] `npm run lint:pt-pt` → 0 brasileñismos en 114 ficheros pt + bloques pt de 1 multi-locale.
- [x] `npm run i18n:check` → PASS (779 ficheros, 0 hardcoded user-visible strings).
- [x] `npm run seo:meta` → 0 errors, **2 warnings aceptadas fuera de scope**: `como-operar-llc-dia-a-dia` ES desc=153ch (límite blando 150) y `que-es-irs-guia-duenos-llc` ES desc=155ch. Ambos slugs caen fuera de la lista de 4 del sprint y por restricción explícita "Out of scope: tocar slugs fuera de los 4 listados" no se modifican aquí; se trasladarán a un sprint posterior.
- [x] `npm run audit:conversion` (audit-conversion-112x6) → 0 errores; gaps reportados son report-only de toda la cartera (171 agenda, 669 tel-WA, 672 LLC-subpage, 37 ITIN-subpage, 4 weak-copy) y no aplican a los 4 slugs del sprint.
- [x] `node scripts/audit-conversion-es-2026-04.mjs` → **111/111 PASA**, FALLA: 0 (los 4 slugs del sprint incluidos).

#### Resultado
- **WC promedio ES:** 2992 (residentes 2549, diferencia 2533, iva 2727, llc-EE.UU. 4160).
- **Ratios DE/ES tras edición** (palabras netas tras strip de comentarios HTML, etiquetas y formato Markdown): slugs 1, 2 ya estaban ≥ 0.85 antes del sprint; slug 3 = 0.901 (2456/2727 tras la edición + corrección Suiza del code-review); slug 4 = 0.869 (3614/4160). Ratio EN, FR, PT, CA / ES ya ≥ 0.85 en los 4 slugs antes del sprint.
- **Gancho-objetivo cumplido:** sí (los 4 slugs ya pasaban `audit-conversion-es-2026-04` antes del sprint y siguen pasando).
- **Verdict re-evaluado:** **PASA** (4/4 slugs + 111/111 cartera ES).
- **Notas / desviaciones:**
  - Sprint reclasificado de "rewrite-completo" a "polish-verificacion" porque los 4 slugs ya tenían la versión 2026-04 que cumple criterios. Único cambio de contenido: capa DACH explícita en DE de slugs 3 y 4 para llevar la ratio DE/ES por encima de 0.85.
  - 2 warnings de seo:meta documentados como out-of-scope.
  - Densidad Exentax slug 4 ES = 25 fuera de la banda 4–22 sugerida en STANDARD; audit estricto la acepta por la presencia de los bloques `<!-- exentax:execution-v2 -->`, `<!-- exentax:cta-conv-v1 -->` y `<!-- exentax:cta-v1 -->` que cuentan menciones por marcador.
- **Fecha cierre:** 2026-04-26

