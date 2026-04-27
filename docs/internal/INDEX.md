# docs/internal · Índice maestro

**Última revisión: 2026-04-27** (post-cleanup, 297 → 19 docs).

Documentación interna del proyecto Exentax Web para agentes automatizados,
desarrolladores y operaciones. Documentación pública en `/README.md` raíz.

---

## Lectura recomendada

### Agente automatizado (Claude Code, Cursor, etc.)

1. **`AGENT-RULES.md`** — reglas irrompibles + invariables del proyecto.
2. **`WHAT-NOT-TO-TOUCH.md`** (raíz repo) — áreas verde con comando confirmador.
3. **`PRODUCTION-STATUS.md`** (raíz repo) — estado real verificado por área.
4. **`PENDING-FINAL.md`** (raíz repo) — pendientes operativos priorizados.

### Desarrollador nuevo

1. `/README.md` (raíz) — visión general + comandos.
2. **`ARCHITECTURE.md`** — arquitectura del sistema.
3. **`STACK.md`** — inventario de stack y versiones.
4. `/exentax-web/docs/deploy/HOSTINGER-VPS.md` — deploy guide.

### Editor / traductor

1. **`TRANSLATION-GUIDE.md`** — guía operativa de traducción.
2. **`translator-brief.md`** — criterio premium-pro (no native review masivo).
3. **`SOURCES-VERIFIED.md`** — fuentes oficiales para datos del blog.

---

## Inventario actual de docs/internal/

| Archivo | Propósito |
|---|---|
| `AGENT-RULES.md` | Reglas irrompibles para agentes automatizados |
| `ARCHITECTURE.md` | Arquitectura completa del sistema |
| `BASELINE-CIERRE.md` | Outputs reales de las 12 puertas técnicas |
| `INDEX.md` | Este índice |
| `PENDING.md` | Puntero histórico → `PENDING-FINAL.md` raíz |
| `SOURCES-VERIFIED.md` | Fuentes oficiales verificadas para datos del blog |
| `STACK.md` | Inventario stack y versiones |
| `TRANSLATION-GUIDE.md` | Guía operativa traducción |
| `WHAT-NOT-TO-TOUCH.md` | Espejo del raíz — áreas verde |
| `blog-translation-triage.md` | Triage PT-BR + duplicados (0/0 vivos) |
| `git-history-notes.md` | Contexto squash main + PRs #1-9 cerrados |
| `translator-brief.md` | Brief premium-pro (no native review masivo) |

---

## Histórico (2026-04-27 cleanup)

Eliminados en limpieza 2026-04-27:
- 12 LOG-BATCH-{1..12}.md (logs de batches editoriales del blog)
- 21 audit/report internos cerrados (BOOKING-AUDIT, DISCORD-AUDIT, CALCULATOR-AUDIT, etc.)
- 223 fiches per-article en `docs/audits/2026-04/{articles,cta-conversion}/`
- 15 audit fixtures `docs/audits/2026-04/*.md` no auto-generados
- `docs/auditoria-multiidioma/` entera (snapshot histórico no regenerado)
- 3 `docs/audits/auditoria-i18n*` y `glossary-i18n.md`

El histórico exacto vive en `git log`. Ver `PENDING.md` § Histórico para los
commits clave de los closes.
