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

(añade aquí las entradas reales conforme se completen los sprints)
