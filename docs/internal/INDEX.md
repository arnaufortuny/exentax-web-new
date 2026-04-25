# docs/internal · Índice maestro de documentación operativa

**Última revisión: 2026-04-25**

Esta carpeta contiene la documentación interna del proyecto Exentax Web
para agentes automatizados, desarrolladores y operaciones. Los `.md` que
viven aquí son **referencia operativa**, no documentación de usuario.

Documentación pública vive en:
- `/README.md` (raíz · home GitHub)
- `/CHANGELOG.md` (raíz · semver)
- `/exentax-web/docs/` (docs técnicas + guías de deploy)

---

## Lectura recomendada por rol

### Agente automatizado (Claude Code, Cursor, etc.)

Antes de empezar cualquier sesión:

1. **`AGENT-RULES.md`** · reglas irrompibles + invariables del proyecto
   (precios, banca canon, términos no traducibles, hreflang BCP-47, no
   dark mode, etc.). **Lectura obligatoria**.
2. **`WHAT-NOT-TO-TOUCH.md`** · whitelist de archivos en verde medido
   con comando que lo confirma.
3. **`DEFINITIVE-STATUS.md`** · estado actual verde / rojo / gris del
   proyecto.
4. **`PENDING.md`** · trabajo pendiente priorizado con comandos para
   reproducir.

### Desarrollador nuevo

1. `/README.md` (raíz) · visión general + cómo correr el proyecto.
2. **`ARCHITECTURE.md`** · arquitectura completa.
3. **`INVENTORY.md`** · mapa consolidado (16 rutas × 6 idiomas, 24
   páginas, 44 componentes, 20+ endpoints, 36 npm scripts, 64 scripts
   físicos, 10 integraciones externas).
4. `/exentax-web/docs/deploy/HOSTINGER-VPS.md` · cómo desplegar.
5. `/exentax-web/docs/deploy/DISCORD-SETUP.md` · cómo configurar
   Discord bot.

### Editor de contenidos (blog, traducciones)

1. **`TRANSLATION-GUIDE.md`** · glosario terminológico + reglas de
   estilo por idioma.
2. **`AGENT-RULES.md §A`** · reglas para traducir blogs faltantes.
3. **`SEO-STRATEGY.md`** · estrategia SEO global.
4. `/exentax-web/docs/blog/CONTENT-IMPROVEMENT-PLAN.md` · plan
   expansión 44 artículos con ratio < 70 % vs ES.

### Auditor / compliance

1. **`AUDIT-REPORT.md`** · histórico de auditorías sesión-por-sesión.
2. **`PRODUCTION-READY-REPORT.md`** · cierre Task #8 production-ready.
3. **`CHANGELOG-SESSION.md`** · cambios session-by-session con
   evidencia.

---

## Inventario de documentos

### `AGENT-RULES.md` (501 líneas)
Reglas irrompibles para agentes. Regla nº 1: lo que funciona no se
toca. Tasa de falsos positivos agents: ~40 %. 15 reglas de código +
4 secciones específicas para trabajos futuros (traducir blogs,
rediseño páginas, veracidad fuentes, no nuevas funciones).

### `INVENTORY.md` (323 líneas)
Mapa consolidado en 10 secciones: rutas, páginas, componentes,
endpoints API, npm scripts, scripts físicos, tests, integraciones
externas, env vars, docs.

### `WHAT-NOT-TO-TOUCH.md` (158 líneas)
Whitelist de archivos verdes con comando de verificación. 11
secciones cubriendo TS strict, i18n locales, blog content, SEO meta,
calculator, Discord, booking, hreflang, docs.

### `DEFINITIVE-STATUS.md` (311 líneas)
Clasificación inamovible VERDE FIJO / ROJO A ARREGLAR / GRIS A
DOCUMENTAR basada en outputs literales de baseline.

### `PENDING.md` (316 líneas)
Trabajo pendiente priorizado. 4 categorías: pre-deploy Hostinger,
gris ambiental (necesita dev server), media prioridad SEO long-tail,
expansión blog 44 artículos.

### `CHANGELOG-SESSION.md` (233 líneas)
Cambios session-by-session con evidencia del problema (comando +
output) y verificación post-fix. Ningún cambio sin justificación.

### `AUDIT-REPORT.md` (491 líneas)
Histórico de auditorías. Sesiones 1-11 documentadas con métricas
antes/después.

### `PRODUCTION-READY-REPORT.md` (71 líneas)
Cierre Task #8 production-ready. `npm run check` EXIT 0 (todas las
puertas verde, incluidas e2e calendar/calculadora/Discord/newsletter/
IndexNow).

### `SEO-STRATEGY.md` (201 líneas)
Estrategia SEO global del proyecto.

### `TRANSLATION-GUIDE.md` (183 líneas)
Glosario terminológico ES/EN/FR/DE/PT/CA. Reglas por idioma
(formal Sie DE, vous FR, tu CA, PT-PT estricto). Términos
invariables (LLC, EIN, ITIN, etc.).

### `STACK.md` (sesión 2026-04-25 post phone-CTA)
Inventario consolidado del stack tecnológico actual: frontend
(React 19 + Vite 7 + Tailwind + i18next), backend (Express 5 +
Drizzle 0.45 + PostgreSQL), integraciones (Google Calendar/Meet/Gmail,
Discord, IndexNow, GA4), 7 linters específicos verde, 9 tests E2E
verde, 25 páginas/44 componentes/29 API routes/76 scripts/112 blog ×
6 langs. Env vars requeridas/opcionales y build artifacts.

### `ARCHITECTURE.md` (248 líneas)
Arquitectura completa (frontend, backend, DB, integraciones,
deploy).

### `AUDIT-FINAL-REPORT.md` (sesión 2026-04-25)
Reporte final de la sesión de consolidación: pricing definitivo
(eliminación 1.400 → desde 2000 / desde 1500 en 6 idiomas, 3 formatos
numéricos), legal pages Liquid Glass tema crema, todos los linters
verde, build exit 0. Lista pendientes ambientales (Bloques 6/7) y
tareas para agente Replit (env vars, E2E cifrado, GA4 real-time).

### `CALCULATOR-AUDIT.md`
Auditoría calculadora 11 secciones: tests 123/123, IRPF brackets
2026, SS Autónomos 15 tramos, dividendos LIRPF art. 66, 8 países, edge
cases blindados.

### `DISCORD-AUDIT.md`
Auditoría bot Discord 11 secciones: 14 subcomandos slash, Ed25519
signature verification, role gate `ADMIN_DISCORD_ROLE_ID`, retry
exponencial 429/5xx cap 30s, dedupe SHA-256, 13 events → 7 canales,
brand color `#00E510` enforced.

---

## Convenciones

- **Cada cambio relevante en código** → actualizar `CHANGELOG-SESSION.md`
  con evidencia (comando + output) y `INVENTORY.md` si toca rutas/
  componentes/endpoints.
- **Cada nueva regla del proyecto** → añadir a `AGENT-RULES.md`.
- **Cada archivo nuevo en verde medido** → añadir a `WHAT-NOT-TO-TOUCH.md`.
- **Cada bug pendiente o trabajo futuro** → registrar en `PENDING.md`
  con comando para reproducir.
- **Nunca commitear** audit JSONs regenerados
  (`exentax-web/docs/auditoria-sistema-seo-faqs/*.json`).

---

## Mantenimiento

Este `INDEX.md` debe actualizarse cuando:
- Se añade/elimina un `.md` en `docs/internal/`.
- Cambia significativamente el propósito de un doc existente.
- Se actualizan las convenciones de mantenimiento.
