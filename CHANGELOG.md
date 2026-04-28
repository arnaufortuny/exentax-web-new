# Changelog

Todos los cambios notables de este repositorio se documentan aquí.
Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased] — 2026-04-27

### SEO meta verifier — 0 warnings (CTA normalization + title trim)
- **`npm run seo:meta` → 0 errors / 0 warnings** across the 6 locales
  (es/en/ca/fr/de/pt). Resolved the 32 cosmetic warnings flagged after the
  Task #2 premium SEO rollout.
- **Service-subpage descriptions (5 × 6 = 30 entries)** in
  `client/src/i18n/data/subpages.ts` rewritten so each one closes with one of
  the locale's allowed soft CTAs (e.g. *Reserva tu llamada*, *Empieza hoy*,
  *Book a free call*, *Get started*, *Démarrez ici*, *Jetzt starten*,
  *Comece hoje*, *Comença avui*). All descriptions stay within the 140-165
  char SERP budget and preserve the approved premium tone (no Mercury, no
  boutique).
- **`serviciosPage.seoTitle`** trimmed under the 58-char soft warn limit in
  `client/src/i18n/locales/es.ts` (53c) and `en.ts` (58c).

## [Unreleased] — 2026-04-26

### Quality audit + DE register cleanup + indexing verified
- **DE register informal → formal Sie**: 87 artículos editorializados (488+65
  substituciones aplicadas vía `scripts/de-register-apply-safe.mjs`). Audit
  detector con thresholds language-aware (DE 0.65, PT/FR 0.70, CA 0.75) y
  section-count exemption para artículos restructurados con más secciones que ES.
- **MT tells (overuse) → 0**: 11 artículos FR limpiados (`actuellement`
  redundante) via 14 patrones específicos.
- **Low-ratio false positive → 0**: los 5 artículos low-ratio (DE/PT/CA/FR)
  tenían MÁS secciones que ES (restructuración audiencia-local), no contenido
  faltante. Audit ahora exime artículos restructurados.
- **CTA refactor seguro**: `scripts/blog/blog-cta-channel-lint.mjs` +
  `blog-cta-channel-update.mjs` para drift detection del número WhatsApp
  canonical en 666 artículos.
- **Phone CTA eliminado**: 657 artículos blog (6 idiomas) ahora solo tienen
  WhatsApp + agendar como CTAs principales (no phone).
- **Brand casing fix**: `STACK.md` añadido al ALLOWLIST de
  `brand-casing-check.mjs` (mismo patrón que AGENT-RULES.md).
- **CRS 2.0 article**: `crs-2-0-carf-por-que-usa-no-firmara-llc` integrado
  completo en 6 idiomas (verified by audit).
- **Florida service**: integrado completo (page + 6 lang slugs + sitemap +
  footer + i18n subpages content).
- **`.blog-content code` fontStack**: eliminado fallback a monospace (Inter
  only) — alineado con brand "no monospace anywhere".

### Quality audit results (2026-04-26 baseline)
- `npm run check`: EXIT 0 con 23 gates verde
- `npm run blog:validate-all`: **13/13 OK**
- `npm run i18n:check`: PASS (1554 keys × 6 idiomas)
- `npm run seo:meta`: 0 errors / 0 warnings × 6 langs
- `npm run seo:check`: 0 broken links · 112 articles ≥3 inbound
- `npm run seo:llm-readiness`: PASSED 0 warnings
- `blog-translation-quality-extended`: leakage 0 · DE register 0 · MT tells 0
  · FR register 1 (false positive intencional) · low-ratio 0 · untranslated 0
- `test:calculator`: 123/123 asserts
- `test-field-encryption`: 45/45 asserts AES-256-GCM E2E

### Documentación actualizada
- `docs/internal/REVISION-TOTAL-REPORT.md` — baseline + análisis bloque-por-bloque
- `docs/internal/PROJECT-CONTENT-REPORT.md` — newsletter + 25 pages + design system
- `docs/internal/EDITORIAL-PENDING-PLAN.md` — workflow editorial actualizado
- `docs/internal/STACK.md` + `INDEX.md` actualizados a 2026-04-26
- `docs/auditoria-multiidioma/de-register-action-list.md` — herramienta editorial line-by-line

## [Unreleased] — 2026-04-22

### Limpieza estructural del repositorio
- Historial consolidado en un único commit `Exentax web — snapshot production-ready`
  tras rebase/squash completo (rewrite de autor a `Arnau Fortuny`).
- Ramas remotas obsoletas eliminadas: 21 × `subrepl-*`, `replit-agent`, `main-repl/main`.
- Tag `exentax-3.0` re-apuntado al commit activo (el histórico `ad602a1` quedó huérfano).
- `screenshots/` eliminado (capturas sueltas no referenciadas).
- `.gitignore` extendido para ignorar `exentax-web/audits/` (outputs regenerables
  de `scripts/audit-markdown-quality.mjs`).
- `exentax-web/audits/markdown-quality.json` y `traducciones-mejoradas.json`
  dejan de estar versionados (el segundo era dead file, eliminado del disco).

### Datos fiscales 2026 actualizados
- `shared/lib/calculator-config.ts`:
  - `SS_AUTONOMO_BRACKETS_2025` → `SS_AUTONOMO_BRACKETS_2026` con los 15 tramos
    oficiales 2026: **200,00 € (tramo 1) → 604,80 € (tramo 15)**. Los 12 valores
    intermedios estaban desactualizados vs la tabla RETA 2026 (venían de 2025).
  - Comentarios de `IRPF_BRACKETS` y `SPAIN_DIVIDEND_BRACKETS` actualizados a 2026
    + referencia cruzada al artículo `tramos-irpf-2026.ts`.
  - Comentario de `TARIFA_PLANA_MONTHLY_ES` (80 €/mes) actualizado (RD-Ley 13/2022
    prorrogado 2026).
- `client/src/lib/calculator.ts` + `calculator.test.ts`: imports renombrados.
  116/116 aserciones siguen pasando.

### Precios Exentax unificados (2.000 € setup / 1.400 €/año mantenimiento)
Todas las apariciones con `~1.500 €/año` o aproximaciones (`~`) sustituidas por
los valores canónicos exactos:

| Archivo | Antes | Después |
|---|---|---|
| `client/src/i18n/locales/es.ts:2384` | `~2.000 € de setup y ~1.500 €/año` | `2.000 € de setup y 1.400 €/año` |
| `client/src/i18n/locales/ca.ts:1963` | `~2.000 € de setup i ~1.500 €/any` | `2.000 € de setup i 1.400 €/any` |
| `client/src/i18n/locales/de.ts:2190` | `~2.000 € Setup und ~1.500 €/Jahr` | `2.000 € Setup und 1.400 €/Jahr` |
| `client/src/i18n/locales/en.ts:2188` | `~€2,000 setup and ~€1,500/year` | `€2,000 setup and €1,400/year` |
| `client/src/i18n/locales/fr.ts:2191` | `~2 000 € de setup et ~1 500 €/an` | `2 000 € de setup et 1 400 €/an` |
| `client/src/i18n/locales/pt.ts:2194` | `~€2.000 de setup e ~€1.500/ano` | `€2.000 de setup e €1.400/ano` |
| `client/src/components/calculator/CalculatorResults.tsx:210` | `~2.000 € … ~1.400 €` (fallback) | `2.000 € … 1.400 €` (fallback) |

### SEO
- `client/src/components/SEO.tsx`: añadido `og:locale:alternate` para las otras
  5 locales en cada render. Completa la cobertura Open Graph multilingüe.

### Identidad Git
- `user.name = Arnau Fortuny`
- `user.email = 240033972+arnaufortuny@users.noreply.github.com`

### Verificaciones que pasan tras los cambios
- `tsc --noEmit` → exit 0, 0 errores.
- `validate-i18n.ts` → 6 idiomas con 1552 claves cada uno, sin placeholders rotos,
  sin phantom keys, 360 allowlisted entries válidas.
- `calculator.test.ts` → 116/116 aserciones.
- `check-typography-rule0.mjs` → 0 violaciones.
- `brand-casing-check.mjs` → sin `ExenTax`.
- `audit-pt-pt.mjs` → sin brasileñismos.
- `blog-content-lint.mjs` → 670 ficheros, sin menciones prohibidas.
- `seo-check-links.mjs` → sin enlaces internos rotos.

### Sin cambios funcionales
- API, rutas, esquema DB, webhooks Discord (retirados ya), plantillas de email,
  slash commands, integraciones Google (Calendar/Meet/Search Console), IndexNow
  y sitemap dinámico no se han tocado — la auditoría confirmó estado operativo.
