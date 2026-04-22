# PENDING — Exentax Web

Lista priorizada de trabajo que quedó fuera de esta sesión de auditoría.
Fecha: 2026-04-22. Actualiza este documento al cerrar cada ítem.

---

## 🔴 Alta prioridad

### 1. Revisión de traducciones profesional por nativos (EN/FR/DE/PT/CA)
**Esfuerzo estimado:** 20-40 h por idioma · **Bloqueante producción:** no · **Impacto conversión:** alto.

La cobertura i18n es del 100 % (1552 claves × 6 idiomas, sin placeholders rotos),
pero la **calidad nativa** de cada cadena no se puede garantizar sin revisor
humano nativo de cada mercado. Qué pedir al revisor por idioma:

- **EN-US**: registro americano directo (freelancers + entrepreneurs). Evitar
  calcos del español en estructuras condicionales y subordinadas. CTAs idiomáticos
  (no "Book now" literal: "Get your LLC started today").
- **FR-FR**: registro profesional parisino para auto-entrepreneurs. Sustituir
  terminología "autónomo" por "indépendant / auto-entrepreneur" según contexto.
- **DE-DE**: registro directo y técnico para Selbstständige. Evitar pasivas
  excesivas y subordinadas kilométricas.
- **PT-PT**: portugués europeo (el lint `audit-pt-pt.mjs` ya bloquea brasileñismos).
  Revisar construcciones con pronombres enclíticos.
- **CA**: catalán formal correcto. Verificar usos de "vostè" vs "tu".

**Herramientas que ya ayudan:**
- `scripts/validate-i18n.ts` marca entradas idénticas a ES ("posiblemente no traducidas").
- `scripts/blog-translation-quality-audit.mjs` detecta párrafos duplicados y
  hits PT-BR. Últimos resultados: 4 hits PT-BR en 3 ficheros + 93 párrafos
  duplicados en 52 ficheros (report-only, no bloqueante).

### 2. Tramos IRPF autonómicos por CCAA en la calculadora
**Esfuerzo:** 4-8 h. La calculadora usa una escala agregada "estatal + autonómica
media". Algunas CCAA (Cataluña, Valencia) suben 2-3 pts el tramo alto; Madrid,
La Rioja, Andalucía bajan 1-2 pts. Valorar exponer el selector CCAA en la UI
o al menos un desplegable "autonomía más cara / media / más barata".

### 3. Verificación live de pipeline CI
**Esfuerzo:** 1-2 h. En este entorno sandbox falló `seo:slash` (timeout de 60 s
al arrancar servidor temporal). Confirmar en CI real (GitHub Actions / deploy)
que `npm run check` cierra en verde con todos los scripts.

### 4. Push manual de tag e imagen OG
**Esfuerzo:** 15 min. Tag `exentax-3.0` ya re-apuntado. Pendiente verificar que
`og-image.png` existe en `client/public/` y que el dominio productivo
(`https://exentax.com`) sirve imágenes OG 1200×630 válidas vía
[OpenGraph.xyz](https://www.opengraph.xyz/).

---

## 🟡 Media prioridad

### 5. Imagen OG por artículo de blog (alt + per-article `og:image`)
**Esfuerzo:** 8-16 h. Hoy todos los artículos comparten `/og-image.png` con
`og:image:alt` traducido vía `seo.twitterAlt`. Una imagen por artículo mejora
CTR en LinkedIn/Twitter.

### 6. Redirects 301 legacy
**Esfuerzo:** 2-4 h. No hay tabla explícita `/oldSlug → /newSlug`. Si el sitio
ya estuvo en producción con slugs distintos, mapearlos en `server/index.ts` o
vía middleware en `server/routes/` para evitar 404 indexados por Google.

### 7. Tipos estrictos en handlers de Discord
**Esfuerzo:** 3-5 h. 13 usos de `any` en `server/discord-bot-commands.ts` y
`server/discord.ts` (tipos de respuesta de la API). Alternativa: instalar
`discord-api-types` y tipar los embeds/components.

### 8. PR históricos cerrados con historia muerta
**Esfuerzo:** 10 min. PRs #1-#9 están closed y apuntan a commits que ya no
existen en `main` tras el squash. Opcionalmente añadir comentario aclaratorio
o dejarlos tal cual (historial de GitHub).

### 9. Tabla RETA 2026: cross-check oficial
**Esfuerzo:** 30 min. La tabla `SS_AUTONOMO_BRACKETS_2026` la tomamos del blog
de Exentax (`cuotas-autonomos-2026-guia-completa.ts`) que cita a la TGSS.
Antes del cierre del ejercicio contrastar directamente con el BOE / resolución
oficial de 2026 y marcar verificación en el comentario del código.

---

## 🟢 Baja prioridad / nice-to-have

### 10. Warnings no-bloqueantes del audit de traducción blog
- `blog-translation-quality-audit --check`: 4 hits PT-BR en 3 ficheros, 93
  párrafos duplicados en 52 ficheros. Triage + fix dirigido (no bloqueante).

### 11. CCAA / moneda por defecto en la calculadora según IP geolocalizada
**Esfuerzo:** 4-6 h. Mejora de UX. Hoy todo arranca en ES / EUR.

### 12. Lighthouse CI auditando PR
**Esfuerzo:** 2-3 h. Añadir workflow que bloquee merges si algún Core Web Vital
retrocede por debajo del umbral (LCP<2.5s, CLS<0.1, FID<100ms).

### 13. Performance budgets
**Esfuerzo:** 2 h. `audit-bundle.mjs` ya notifica crecimientos al Discord.
Añadir umbral duro (ej. bloquear si el bundle crece > 5 % vs último baseline).

### 14. Tests E2E de flujos críticos
**Esfuerzo:** 8-12 h. Playwright ya instalado. Añadir flujos:
- Reserva completa (book → calendar → email confirmación → reagendar → cancelar).
- Calculadora: autónomo ES → LLC con email con HTML branded.
- Cambio de idioma + persistencia + hreflang navegable.

---

## Criterios de cierre

- Cada ítem marcar `DONE` con link al commit que lo resuelve.
- Los items "alta prioridad" que requieran revisor humano externo (nativos)
  pueden cerrarse con el nombre del revisor + fecha + hash de commit revisado.
- No abrir items nuevos en este fichero: documentarlos primero en un issue
  o TODO del código y traerlos aquí cuando se prioricen.
