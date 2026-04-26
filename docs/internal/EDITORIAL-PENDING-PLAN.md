# EDITORIAL-PENDING-PLAN — Plan trabajo 87 artículos DE + 11 MT tells + 5 low-ratio

**Fecha**: 2026-04-26
**Comando que lo medió**: `node scripts/blog-translation-quality-extended.mjs`
**Output report**: `docs/auditoria-multiidioma/blog-translation-quality-ext.{json,md}`

---

## 1. Estado actual medido

| Categoría | Cantidad | Linter / origen |
|---|---|---|
| ✅ relatedSlugs coherentes | 348 refs en 112 ES articles, **0 broken** | ad-hoc grep |
| ✅ FAQ multi-idioma | **13/13 checks PASS** | `seo-faq-jsonld-check.mjs` |
| ✅ Internal links | **0 broken** + 112 articles ≥3 inbound | `seo-check-links.mjs` |
| ✅ Translation parity | 1554 keys × 6 langs · 0 missing/extra/empty | `i18n-check` |
| ✅ Hardcoded strings | **0 hits** en 778 ficheros | `find-hardcoded-strings.ts` |
| ✅ PT-PT brasileñismos | **0 hits** en 114 ficheros | `audit-pt-pt.mjs` |
| ✅ Untranslated paragraphs | **0** (paridad ES↔EN/FR/DE/PT) | `blog-translation-quality-extended` |
| 🟡 **DE register informal** | **87 artículos** con du/dein/dir/dich | `blog-translation-quality-extended` |
| 🟡 FR register informal | 1 artículo (intencional cita ad) | `blog-translation-quality-extended` |
| 🟡 MT tells (overuse) | 11 artículos | `blog-translation-quality-extended` |
| 🟡 Low ratio < 0.70 vs ES | 5 artículos | `blog-translation-quality-extended` |

---

## 2. ¿Por qué NO mass-replacement automático?

DE pronominal switch (du→Sie) requiere ALSO conjugación verbal:
- "wenn **du** Meta Ads **verwaltest**" → "wenn **Sie** Meta Ads **verwalten**"
- "**du** **hast**" → "**Sie** **haben**"
- "**du** **kannst**" → "**Sie** **können**"
- "**du** **musst**" → "**Sie** **müssen**"

Mass-replace de pronombres SIN ajustar verbos crearía alemán gramaticalmente
incorrecto (peor que el estado actual). El detector de register no captura
verbos, así que un fix solo-pronombres pasaría el linter pero degradaría la
calidad real.

**Conclusión técnica**: este trabajo requiere edición editorial con
contexto (humana o LLM con prompt específico por artículo). NO mass-replace
ciego.

---

## 3. Top 20 artículos prioritarios (por hit count)

Ordenados por número de pronombres informales detectados (más hits = más
trabajo + más visibilidad):

| # | Slug | Hits | Tipo |
|---:|---|---:|---|
| 1 | `llc-alternativa-autonomo-espana` | 8 | Conversion-critical (autónomo→LLC) |
| 2 | `w8-ben-y-w8-ben-e-guia-completa` | 6 | Compliance technical |
| 3 | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | 5 | Compliance ES |
| 4 | `nuevo-mexico-vs-wyoming-vs-delaware` | 5 | Comparison core |
| 5 | `bookkeeping-llc-paso-a-paso` | 4 | Operational |
| 6 | `como-operar-llc-dia-a-dia` | 4 | Operational |
| 7 | `constituir-llc-proceso-paso-a-paso` | 4 | Funnel-critical |
| 8 | `convenio-doble-imposicion-usa-espana-llc` | 4 | Compliance |
| 9 | `cuenta-bancaria-mercury-llc-extranjero` | 4 | Banking |
| 10 | `cuentas-bancarias-usa-reportan-hacienda-verdad` | 4 | CRS/FATCA hub |
| 11-20 | (resto top, 3 hits cada uno) | 3 | Mixto |

Los 67 restantes tienen 1-2 hits cada uno.

---

## 4. Workflow recomendado por artículo

Para cada artículo del listado:

```bash
# 1. Localizar
ARTICLE=de/llc-alternativa-autonomo-espana.ts
cat client/src/data/blog-content/$ARTICLE | head -50

# 2. Identificar TODOS los hits con contexto
grep -nE '\b(du|dein|deine|deinen|deinem|deiner|deines|dir|dich)\b' \
  client/src/data/blog-content/$ARTICLE

# 3. Editorial pass: por cada hit, reescribir frase completa con:
#    - Pronombre du → Sie (capital S, salvo inicio frase)
#    - Possesivos dein/deine/deinen/... → Ihr/Ihre/Ihren/...
#    - Dativ dir → Ihnen
#    - Akkusativ dich → Sie
#    - Verbos en 2.persona singular → 3.persona plural formal
#      du hast → Sie haben
#      du bist → Sie sind
#      du kannst → Sie können
#      du musst → Sie müssen
#      du willst → Sie wollen
#      du machst → Sie machen
#      du wirst → Sie werden
#      du weißt → Sie wissen
#      du siehst → Sie sehen
#      du gehst → Sie gehen
#      [verbo]-st → [verbo]-en

# 4. Verificar
node scripts/blog-translation-quality-extended.mjs
# El conteo de DE register debe bajar en N hits del artículo procesado
```

**Estimación tiempo por artículo**:
- 1-3 hits: 5 min editorial
- 4-6 hits: 10-15 min
- 7+ hits: 20-30 min

**Tiempo total estimado**: ~12-15 horas trabajo editorial concentrado para
los 87 artículos DE.

---

## 5. MT tells (11 artículos) — patrones detectados

Overuse de palabras "actuellement" / "aktuell" / "atualmente" / "in Bezug auf":

```
fr/auditoria-rapida-llc-12-puntos-30-minutos
fr/autonomo-espana-vs-llc-estados-unidos
fr/boi-report-fincen-guia-completa-2026
fr/ein-numero-fiscal-llc-como-obtenerlo
fr/form-5472-que-es-como-presentarlo
... (5 más)
```

**Workflow**: leer artículo, identificar repeticiones, sustituir 2-3 con
sinónimos contextuales (`désormais`, `aujourd'hui`, `de nos jours`, `à
l'heure actuelle` para FR; equivalente en cada lang). 5-10 min por
artículo.

---

## 6. Low-ratio articles (< 0.70 word count vs ES)

5 artículos donde la traducción es sustancialmente más corta que el ES
origen. Posibles causas:
- Resumen excesivo en target (perdió detalle)
- Compactación legítima por morfología del idioma (DE compactness)

**Workflow**: comparar paragraph-by-paragraph ES vs target. Identificar
secciones perdidas y restaurar contenido equivalente. 30-60 min por
artículo.

Lista (extraída de `blog-translation-quality-ext.json`):
- (ver `findings.lowRatio` en JSON output)

---

## 7. Priorización por impacto negocio

### P0 — bloqueadores conversión
- `llc-alternativa-autonomo-espana` DE (8 hits) — CTA principal del funnel
  autónomo→LLC para mercado germanohablante
- `constituir-llc-proceso-paso-a-paso` DE (4 hits) — proceso core
- `cuanto-cuesta-constituir-llc` DE (si tiene hits, verificar)

### P1 — high-traffic compliance
- `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` DE (5)
- `convenio-doble-imposicion-usa-espana-llc` DE (4)
- `cuentas-bancarias-usa-reportan-hacienda-verdad` DE (4)
- `cuotas-autonomos-2026-guia-completa` DE (verificar)

### P2 — operational
- `bookkeeping-llc-paso-a-paso` DE (4)
- `como-operar-llc-dia-a-dia` DE (4)
- `cuenta-bancaria-mercury-llc-extranjero` DE (4)

### P3 — long tail (resto 77 artículos con ≤3 hits cada uno)

Posible bash batch processing por chunks de 10-20 artículos en sesiones
editoriales separadas.

---

## 8. Tooling de soporte (ya en repo)

| Comando | Propósito |
|---|---|
| `node scripts/blog-translation-quality-extended.mjs` | Re-medir después de cada batch |
| `node scripts/audit-pt-pt.mjs` | Verificar PT-PT register |
| `npx tsx scripts/i18n-glossary-lint.ts` | Glossary terminológico |
| `node scripts/seo-check-links.mjs` | Verificar links siguen verde tras edits |
| `npm run blog:validate-all` | Suite completa 13 checks blog |

---

## 9. Output esperado al finalizar el plan

Cuando se complete el trabajo editorial:
- DE register: **0 hits** (de los 87 actuales)
- MT tells: **0 hits** (de los 11 actuales)
- Low ratio: **0 hits < 0.70** (de los 5 actuales)
- Otros checks: mantener verde (regla cero "lo que pasa verde no se toca")

---

## 10. Para el agente que ejecute

**Inputs**:
1. Este documento
2. `docs/auditoria-multiidioma/blog-translation-quality-ext.json` (lista
   completa con samples por artículo)
3. `docs/internal/AGENT-RULES.md` §A (reglas traducir blogs)
4. `docs/internal/TRANSLATION-GUIDE.md` (glosario terminológico)

**Outputs requeridos**:
1. Edits en `client/src/data/blog-content/de/<slug>.ts` (87 ficheros)
2. Edits en `client/src/data/blog-content/{fr,de,pt,ca}/<slug>.ts` para
   los 11 MT tells
3. Edits en 5 ficheros low-ratio expandiendo contenido
4. Commit por cada batch de 10-20 artículos con mensaje descriptivo
5. Re-correr `blog-translation-quality-extended.mjs` después de cada
   batch y verificar que el conteo baja

**Constraint**: tras cada batch, `npm run blog:validate-all` debe seguir
13/13 OK (regla cero).
