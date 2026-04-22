# WHAT-NOT-TO-TOUCH — Exentax Web

**Fecha de última verificación medida: 2026-04-22.**
**Rama: `main` · HEAD post-sesión 6.**

Esta lista documenta los archivos, carpetas, componentes y funciones
que pasan todas las puertas de calidad **con evidencia medida**. Modificar
cualquiera de ellos **sin demostrar previamente con un comando que tiene
un problema real** es una violación de la regla nº 1 del proyecto y
debe considerarse bug introducido.

Cada fila lista el **comando exacto** que confirma el estado verde. Para
retomar en una sesión futura: ejecutar los comandos y sólo tocar los
archivos cuyo comando pase a rojo.

---

## 1. TypeScript y base de código (client + server + shared)

| Archivo / directorio | Comando que lo confirma verde | Output en verde |
|---|---|---|
| `exentax-web/client/src/**/*.{ts,tsx}` (779 ficheros) | `cd exentax-web && npx tsc --noEmit` | exit 0, sin output |
| `exentax-web/server/**/*.ts` (44 ficheros) | `cd exentax-web && npx tsc --noEmit` | exit 0, sin output |
| `exentax-web/shared/**/*.ts` (6 ficheros) | `cd exentax-web && npx tsc --noEmit` | exit 0, sin output |
| `tsconfig.json` | `cd exentax-web && npx tsc --noEmit` | exit 0 |

## 2. i18n locales (6 idiomas × 1552 keys)

| Archivo | Comando | Output |
|---|---|---|
| `exentax-web/client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts` | `cd exentax-web && npm run i18n:check` | `Total missing keys: 0 · Total extra keys: 0 · Total empty values: 0 · Placeholder mismatches: 0 · Structure mismatches: 0 · Result: PASS ✓` |
| `exentax-web/client/src/i18n/index.ts` | idem | PASS |

**Importante**: no cambiar el valor de keys que ya están traducidas
correctamente. El audit tiene allowlist de 360 entries intencionalmente
idénticas al ES (tecnicismos, marca, etc.) — están documentadas en
`docs/i18n-check.md`.

## 3. Blog content (111 artículos × 6 idiomas = 666 ficheros)

| Directorio | Comando | Output |
|---|---|---|
| `exentax-web/client/src/data/blog-content/**/*.ts` | `cd exentax-web && node scripts/blog-content-lint.mjs` | `[blog-content-lint] OK — scanned 670 files, no forbidden mentions.` |
| idem | `cd exentax-web && node scripts/audit-pt-pt.mjs` | `✓ Sin brasileñismos en pt: 113 ficheros + bloques pt de 1 fichero(s) multi-locale.` |
| idem | `cd exentax-web && node scripts/blog-cta-position-check.mjs` | `blog-cta-position-audit --check: OK (0 allowlisted positional warnings)` |
| idem | `cd exentax-web && node scripts/blog-translation-quality-audit.mjs --check` | `PT-BR hits: 0 in 0 files; duplicate paragraphs: 0 in 0 files` |
| idem | `cd exentax-web && npm run seo:check` | `✓ No broken internal blog links. ✓ All 111 articles have ≥ 3 incoming links.` |

**Importante**: artículos marcados como <70% ratio vs ES (44 casos,
listados en `PENDING.md §1`) requieren expansión. Ese trabajo es
aditivo, no reescribe lo que ya pasa los linters. Fuera de esa lista,
**ningún otro artículo se toca**.

## 4. SEO meta + schema

| Archivo | Comando | Output |
|---|---|---|
| `exentax-web/server/seo-content.ts` → `PAGE_META`, `PAGE_META_I18N`, `PAGE_SCHEMAS`, `PAGE_KEYWORDS`, `buildI18nMeta()` | `cd exentax-web && npm run seo:meta` | `[verify-meta] PASS: 0 error(s), 0 warning(s) across 6 languages` |
| `exentax-web/server/faq-schema-i18n.ts` (79 Q/A × 6 idiomas) | `cd exentax-web && node scripts/audit-system-seo-faqs.mjs` → `faqs-audit.json` | `0 issues across 79 FAQs × 6 idiomas` |
| `exentax-web/client/src/components/SEO.tsx` | incluido en seo:meta | PASS |
| `exentax-web/client/src/pages/faq-page.tsx` + `exentax-web/client/src/components/sections/FAQ.tsx` | tsc + audit | OK |
| `exentax-web/client/src/pages/services/*.tsx` (5 subpáginas + ServiceSubpage) | tsc + audit | OK |

## 5. Routing y rutas

| Archivo | Comando | Output |
|---|---|---|
| `exentax-web/shared/routes.ts` (16 rutas × 6 idiomas) | `cd exentax-web && npm run seo:check` | OK |
| `exentax-web/client/src/App.tsx` | tsc + seo-meta-audit | OK |
| `exentax-web/client/src/hooks/useLangPath.ts` | tsc | OK |

## 6. Scripts de build, lint, audits

| Script | Comando de verificación | Output |
|---|---|---|
| `exentax-web/scripts/build.ts` | `cd /home/user/exentax-web-new && SKIP_BUILD_E2E=1 DATABASE_URL=postgresql://dummy:dummy@localhost/dummy npm run build` | exit 0, `dist/index.mjs` 5.9 MB + `dist/public/` 24 MB |
| `exentax-web/scripts/seo-meta-audit.mjs` | `cd exentax-web && node scripts/seo-meta-audit.mjs` | `SEO META AUDIT — OK (111 posts × 6 langs, 22 public pages).` |
| `exentax-web/scripts/seo-slash-hygiene.mjs` | `cd exentax-web && npm run seo:slash` | `✓ slash-hygiene: clean` (graceful-degrade si no hay DB/server) |
| `exentax-web/scripts/audit-system-seo-faqs.mjs` | `cd exentax-web && node scripts/audit-system-seo-faqs.mjs` | exit 0, JSONs escritos a `docs/auditoria-sistema-seo-faqs/` |
| `exentax-web/scripts/blog-content-lint.mjs` | idem sección 3 | OK |
| `exentax-web/scripts/audit-pt-pt.mjs` | idem sección 3 | 113 OK |
| `exentax-web/scripts/check-typography-rule0.mjs` | `cd exentax-web && npm run lint:typography` | `Regla 0 OK · 0 violaciones decorativas` |
| `exentax-web/scripts/brand-casing-check.mjs` | `cd exentax-web && npm run lint:brand-casing` | `✓ No "ExenTax" occurrences` |

## 7. Calculadora fiscal (golden path del negocio)

| Archivo | Comando | Output |
|---|---|---|
| `exentax-web/client/src/lib/calculator.ts` (921 LoC) | `DATABASE_URL=postgresql://test:test@localhost/test npx tsx exentax-web/client/src/lib/calculator.test.ts` | `123/123 assertions passed.` |
| `exentax-web/client/src/lib/calculator-config.ts` | idem | OK |
| `exentax-web/client/src/lib/calculator.test.ts` | idem | 123/123 (incluye edge cases NaN/Infinity/negativo/país desconocido) |
| `exentax-web/client/src/components/calculator/*` | tsc + test | OK |

**Verificado 2026-04-22 (sesión 10)**:
- IRPF brackets 2026 alineados con BOE + blog `tramos-irpf-2026.ts`.
- SS autónomo 15 tramos oficiales + tarifa plana 80 €/mes 2026.
- LLC costs: `LLC_FORMATION_COST = 2000 €`, `LLC_ANNUAL_COST = 1400 €` (alineado con branding "desde 2.000 € / desde 1.400 €/año").
- 8 países cubiertos: España, México, Chile, Reino Unido, Francia, Bélgica, Italia, Austria. Países no cubiertos → fallback elegante (`sinLLC = 0`, no throw).
- Edge cases testeados: monthlyIncome = 0 / NaN / -1000 / Infinity / 1e9 → todos clampeados sin NaN propagation.
- Opt-in `calcSpainIrpfWithLLC`: calcula escenario conservador con IRPF imputado si Hacienda marca la LLC como transparente (honesto, defendible).

## 8. Discord integración

| Archivo | Verificación |
|---|---|
| `exentax-web/server/discord.ts` (routing `TYPE_TO_CHANNEL`) | tsc + `test:discord-neon` (requiere env reales; documentado en `PRODUCTION-READY-REPORT.md`) |
| `exentax-web/server/discord-bot.ts` | tsc OK |
| `exentax-web/server/discord-bot-commands.ts` | tsc OK |
| `tests/discord-no-token-leak.test.ts` | pass (Task #8) |

**Mapping canal → evento documentado en `exentax-web/docs/deploy/DISCORD-SETUP.md`** (no tocar sin actualizar ambos).

## 9. Booking + calendar + email (e2e guard)

| Archivo | Verificación |
|---|---|
| `exentax-web/server/routes/public.ts` | tsc + `test:newsletter` + `test:booking` (requieren Postgres real) |
| `exentax-web/server/email.ts`, `email-layout.ts`, `email-i18n.ts`, `email-retry-queue.ts` | tsc |
| `exentax-web/server/google-meet.ts`, `google-calendar.ts`, `google-credentials.ts` | tsc |

## 10. Hreflang + sitemap structure

| Archivo | Comando | Output |
|---|---|---|
| `exentax-web/server/static.ts` (markdown → HTML + sitemap chunks) | `cd exentax-web && npm run blog:validate-all` (step `sitemap-bcp47`) | `All BCP-47 hreflang assertions passed.` |
| `exentax-web/client/index.html` | idem | `has hreflang="es-ES"/"en-US"/"fr-FR"/"de-DE"/"pt-PT"/"ca-ES"` |

## 11. Documentación consolidada (verde + no tocar)

| Archivo | Razón |
|---|---|
| `README.md` (raíz) | Task #8 consolidado. Actualizar solo si cambia la realidad. |
| `exentax-web/README.md` | idem |
| `ARCHITECTURE.md`, `COMPONENTS.md`, `EDITORIAL_GUIDE.md`, `SETUP.md`, `SEO.md`, `TRADUCCIONES.md` (raíz y `exentax-web/docs/`) | Base de conocimiento estable |
| `PRODUCTION-READY-REPORT.md` | Cierre de Task #8, congelado |
| `replit.md` | Config Replit, tocar solo si cambia stack |
| `exentax-web/docs/deploy/HOSTINGER-VPS.md` | Nuevo (Sesión 5), completo |
| `exentax-web/docs/deploy/DISCORD-SETUP.md` | Nuevo (Sesión 6), completo |
| `exentax-web/docs/blog/CONTENT-IMPROVEMENT-PLAN.md` | Nuevo (Sesión 6), completo |
| `exentax-web/docs/TRANSLATION-GUIDE.md` (y raíz) | Referencia lingüística, estable |
| `AUDIT-REPORT.md` (raíz) | Historia de auditorías; apender nuevas sesiones con datos medidos, no reescribir las anteriores |

---

## Regla de uso de este documento

Antes de modificar un archivo listado aquí en cualquier sesión futura:

1. Ejecutar el comando de verificación de la fila correspondiente.
2. Si sale **verde**, no tocar. Cambio injustificado = bug introducido.
3. Si sale **rojo**, entonces sí: investigar el output exacto del comando,
   corregir **solo** lo que el comando reporta como roto, re-ejecutar, y
   actualizar esta tabla con el nuevo output verde si el estado vuelve a
   ser bueno.

Esta lista es **viva pero conservadora**: se expande al añadirse nuevas
áreas que demuestren ser estables (con al menos 2 sesiones sin
regresión); se contrae si un archivo se demuestra inestable.
