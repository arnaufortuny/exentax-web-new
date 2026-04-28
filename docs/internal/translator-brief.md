# Translator brief — Exentax Web (premium quality, no native review at scale)

> **Decisión 2026-04-27**: NO se contratará revisión nativa profesional masiva.
> El objetivo es **calidad premium pro**, no perfección 100% nativa.
> Este brief documenta el criterio de calidad aceptable + las herramientas
> automáticas que ya hacen el grueso del trabajo.

---

## Scope

- 5 idiomas no-canónicos: EN, FR, DE, PT, CA (ES es la fuente).
- Cobertura actual: 1548 keys × 6 idiomas + 112 artículos blog × 6.
- Ratio palabras vs ES: target ≥ 0.85 (relajado a 0.65 DE / 0.70 PT-FR / 0.75 CA por
  audit `blog-translation-quality-extended.mjs` que respeta restructuración local).

## Criterio de calidad: Premium Pro (no 100% nativo)

**Aceptable**:
- Texto fluido, sin literalismos del ES, registro adecuado al mercado.
- Terminología fiscal local correcta cuando aplica (HMRC para EN, URSSAF para FR,
  Finanzamt para DE, AT para PT, AEAT/ATC para CA).
- Sin brasileñismos en PT (lint enforced).
- Sin frases que delatan traducción automática (catched por audit MT-tells).
- Word ratio dentro de threshold language-aware (DE 0.65, PT/FR 0.70, CA 0.75, EN 0.85).
- Placeholders i18n y plurales conservados.
- LLC, Exentax, IRS, IRPF, BOI, EIN, ITIN, Modelo 720/721/5472/1120 → no traducir.
- Autónomo, cuota → adaptar contextualmente (EN: self-employed/sole proprietor;
  FR: indépendant/auto-entrepreneur; DE: Selbstständig/Freiberufler; PT: trabalhador
  independente; CA: autònom).

**No aceptable** (= bug, fix obligatorio):
- Strings idénticos a ES en idiomas no-ES (catched por `validate-i18n.ts`).
- Placeholder mismatches (catched por `validate-i18n.ts`).
- Calcos directos detectables (caught por audit MT-tells).
- Brasileñismos en PT (caught por `audit-pt-pt.mjs`).
- forbidden brand casing variant (caught por `brand-casing-check.mjs`).
- Banking entities prohibidas como "Revolut Payments USA" (caught por `lint-banned-banking-entities.mjs`).

## Herramientas que YA hacen el trabajo

| Tool | Qué detecta | Comando |
|---|---|---|
| `validate-i18n.ts` | strings idénticos a ES, missing/extra keys, placeholder mismatches | `npm run i18n:check` |
| `blog-translation-quality-extended.mjs` | low-ratio, MT-tells, register drift, leakage | `node scripts/blog/blog-translation-quality-extended.mjs --check` |
| `audit-pt-pt.mjs` | brasileñismos en PT | `npm run lint:pt-pt` |
| `lint-banned-banking-entities.mjs` | entidades bancarias prohibidas | `node scripts/audit/lint-banned-banking-entities.mjs` |
| `brand-casing-check.mjs` | forbidden brand casing variant | `node scripts/audit/brand-casing-check.mjs` |
| `find-hardcoded-strings.ts --strict` | hardcoded strings en JSX | step de `i18n:check` |
| `audit-conversion-112x6.mjs --strict` | weak/generic CTAs | `npm run audit:conversion -- --strict` |

## Workflow recomendado

1. **Quick wins (sin reviewer humano)**: si una herramienta arriba reporta un fail,
   arreglar inline. Cada fix es un cambio de 1-3 líneas con commit y push.
2. **Issue review puntual** (cuando una traducción concreta se siente "off"):
   abrir un issue GitHub con label `i18n-review-{lang}`, indicar key/slug,
   proponer mejora, mergear si pasa los gates.
3. **Sprint editorial trimestral** (opcional): leer 5-10 strings de alta visibilidad
   (CTAs, error messages, onboarding) y refinar manualmente. ~2-4 horas por sprint.

**No se contrata reviewer nativo a tiempo completo.** El stack automático actual
catched los bugs estructurales; los matices se refinan por sprint dedicado del owner
o de un freelancer puntual cuando se detecte un copy concreto que mover el needle de conversión.

## KPI de aceptación

- 0 fails en `npm run i18n:check`.
- 0 fails en `npm run lint:pt-pt`.
- 0 fails en `npm run audit:conversion -- --strict`.
- 0 fails en `node scripts/blog/blog-translation-quality-extended.mjs --check` (modo audit).
- Subjetivo: si el owner lee un párrafo random en cualquier idioma y no le hace
  sangrar los oídos, el target Premium Pro está cumplido.

---

> Brief generado tras decisión owner 2026-04-27: priorizar calidad sostenible
> automatizada sobre revisión humana exhaustiva. Cualquier mejora puntual cae en
> el flujo "Issue review puntual" arriba.
