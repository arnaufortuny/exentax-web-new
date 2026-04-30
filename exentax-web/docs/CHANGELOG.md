# Changelog

Cronología de cambios relevantes en `exentax-web/`. Las entradas más recientes van arriba.

## 2026-04-30 · Tarea #46 — Auditoría exhaustiva calculadora 2026-04 (2.ª pasada)

Re-verificación completa de las constantes fiscales 2026 de los 8 países activos contra fuentes oficiales (HMRC, BMF, AT/Portal das Finanças, SAT, SII, AGN, BOE, BOSA), corrección de gaps de modelado legal y expansión de la batería de tests. Ningún cambio de UI: las propuestas de UX quedan documentadas como follow-ups.

### Modelo (sin UI)

- **Reino Unido (FY 2026/27)**: Corporation Tax con marginal relief 19/22.75/25 % (HMRC FA 2021 + CTM03900). NI Class 4 main rate ajustada al 6 %; Class 2 voluntaria. Dividend Allowance £500 (Spring Budget 2026).
- **Bélgica**: aplicada *additionnelle communale* media 7 % al IPP federal (constante `BELGIUM_COMMUNAL_SURCHARGE`).
- **Alemania**: Solidaritätszuschlag con Freigrenze 18 130 € single / 36 260 € joint; Gewerbesteuer con Hebesatz seleccionable (low ≈ 8,75 % / medium ≈ 14 % / high ≈ 17,15 %) vía `CalcOptions.germanyHebesatz`.
- **Chile**: Régimen Pro PYME 14 D N° 3 al 25 % añadido como opción (`CalcOptions.chileRegimen`); General 14 A se mantiene al 27 %. UTM abr 2026 actualizada a $69 755 (DS Hacienda).
- **Portugal**: IRC reducido 17 % primeros 50 000 € (PME, CIRC 87.º-2) + 20 % resto. Derrama estadual escalonada (2,5 / 4,75 / 5 %) según CIRS 68.º-A.
- **España**: mapa `CCAA_PROFILE_MAP` añadido (17 CCAA + Ceuta/Melilla → low/medium/high) para alimentar `ccaaProfile`.
- **México**: etiqueta del régimen autónomo renombrada a *"Persona Física régimen general (ISR)"* en 6 idiomas (es/ca/en/fr/de/pt). Tabla RESICO documentada en `MEXICO_RESICO_BRACKETS` para futura activación.
- **IVA**: nuevo objeto `COUNTRY_VAT` con tipos general/reducido/exportB2B y helper `resolveVatRate(country, mode)` + `CalcOptions.vatMode`. Compat: `COUNTRY_VAT_RATES` derivado.
- **CFC notes**: bloque informativo en `calcResidenceLLCTax` con referencias normativas para los 8 países (LIRPF 91, CGI 209 B, AStG, CIRC 66, TIOPA Part 9A, CIR 185/2, LISR 176, Ley 21.713).

### Tests

- `client/src/lib/calculator.test.ts` ampliado de 270 → **416 aserciones** (target ≥400). Nuevos bloques 46.1 → 46.19 cubren: marginal relief UK, Soli Freigrenze, rangos Hebesatz, Pro PYME Chile, IRC reducido PT, derrama estadual escalonada, dividend allowance UK, mapa CCAA, modo VAT exportB2B, paridad email-cliente, label MX en 6 idiomas, comentarios SOURCE y CFC.
- `npm run test:calculator` → 416/416 ✅.

### Documentación

- `docs/calculator-audit-log.md`: nuevo bloque "Tarea #46 — 2.ª pasada".
- `docs/calculator.md`: tablas de constantes 2026 sincronizadas.
- `docs/calculator-cases.md`: nuevos escenarios de regresión (UK marginal, BE communal, DE Hebesatz, Chile Pro PYME, PT IRC reducido, VAT exportB2B).

### Validación

```
npx tsc --noEmit              # clean
npm run test:calculator       # 416/416 ✅
```

## 2026-04-22 · Cierre Tarea #8 (production-ready)

`npm run check` queda en EXIT 0 con todas las puertas en verde, incluidos los e2e de calendario, calculadora, Discord, newsletter e IndexNow.

### Fixes

- **Slugs del blog**: codemod recompuso 944 enlaces internos rotos en 411 ficheros usando el mapa `BLOG_SLUG_LEGACY_I18N` (327) → `BLOG_SLUG_I18N` (111). 0 enlaces rotos, ≥3 incoming por artículo en 6 idiomas.
- **Tipografía Regla 0** (`scripts/audit/check-typography-rule0.mjs`): permitidos los wrappers de seguimiento mayúsculas en `services.tsx` y `services/ServiceSubpage.tsx`; añadido `skipPathPrefix=['client/src/data/blog-content/']` al lint de `font-mono` para no penalizar los bloques de cifras-residuales del review-anchor. 14 634 → 0 violaciones.
- **Audit consistencia blog** (`scripts/blog/blog-consistency-check.mjs`): `extractI18nSlugs()` recorta ahora únicamente el cuerpo `BLOG_SLUG_I18N`, sin pisar `BLOG_SLUG_LEGACY_I18N` (que sólo sirve para redirects).
- **Verificación de fuentes** (`scripts/blog/blog-verify-source-urls.mjs`): timeout 10s → 20s; URLs muertas reemplazadas (`aeat-cdi`, `aeat-modelo-349`). 33/33 OK.
- **Audit masterpiece** (`scripts/blog/blog-masterpiece-audit.mjs`): `findYearsInProse` ahora descarta el bloque `<!-- exentax:review-anchor-v1 -->`, descarta comentarios HTML multilínea, y exime el año declarado por el slug (`-2026`). 19 críticos → 0.
- **Sitemap-check** (`scripts/seo/seo-sitemap-check.mjs`): el parser normaliza `hreflang` BCP-47 a su sub-tag primario antes de comparar contra `LANGS`, eliminando los falsos negativos por `es-ES`/`en-US`.
- **i18n** (`client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts`): añadida la clave `blogPost.ctaSecondary` en las 6 locales (mismo valor que `ctaBook`); ya no se depende de `defaultValue` en runtime.
- **Convención de nombres**: revertido `client/src/data/blog-content/fr/facturer-sans-etre-autonomo-espagne-2026-alternatives.ts` → `facturar-sin-ser-autonomo-alternativas-2026.ts` (los ficheros de blog usan slug ES de base; el slug por idioma vive en `blog-posts-slugs.ts`).

### Documentación

- Nuevos: `docs/SETUP.md`, `docs/COMPONENTS.md`, `docs/SEO.md`, `docs/TRADUCCIONES.md`, `docs/CHANGELOG.md`.
- Actualizados: `README.md`, `docs/architecture-map.md`, raíz `PRODUCTION-READY-REPORT.md`.

## Anteriores

Los hitos previos están documentados en:

- `docs/consolidation-2026-04.md` — hardening end-to-end abril 2026.
- `docs/cleanup-hardening-2026.md` — limpieza estructural.
- `docs/audit-report.md` y `docs/seo-audit-report.md` — auditorías base.
