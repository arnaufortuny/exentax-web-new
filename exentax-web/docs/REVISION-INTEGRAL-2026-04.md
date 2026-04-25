# Revisión Integral 2026-04

Fecha: 2026-04-25 · Alcance: blog (112 artículos × 6 idiomas), SEO meta/hreflang, i18n, performance, indexación, dead-code y normalización de marca "Remoto/Remote → Online/Digital".

## Estado de las puertas de calidad

| Gate | Antes | Después |
|---|---|---|
| `npm run i18n:check` | PASS (0 missing/extra/empty) | PASS (sin cambios) |
| `npm run blog:validate-all` | 13/13 OK | 13/13 OK |
| `npm run seo:check` (links + cobertura) | PASS · 0 broken · 112/112 ≥3 incoming | PASS (sin cambios) |
| `npm run seo:slash` | PASS | PASS |
| `npm run seo:meta` | 0 errors / **35 warnings** (descripciones >150 ≤155) | **0 errors / 0 warnings** |
| `npm run lint:typography` | **11 violaciones** (eyebrow uppercase-tracking en `abrir-llc.tsx` y `blog/post.tsx`) | **0** (allowlist documentado) |
| `npm run lint:stray-reports` | 1 fichero (`TRANSLATION-QUALITY-REPORT.md` en raíz) | **0** (movido a `docs/`) |
| `npm run lint:pt-pt` | **2 hits** (cadastro / arquivo en blog PT) | **0** |
| `npm run lint:brand-casing` | PASS | PASS |
| `npm run lint:blog` | PASS (676 ficheros) | PASS |

Todas las puertas críticas (TypeScript, i18n, SEO, lint) cierran en verde tras los cambios.

## Cambios aplicados

### 1. SEO meta — descripciones >150 chars (35 reescrituras)
Reescrituras manuales de alta calidad para cada `metaDescription` con warning soft-limit (>150 ≤155 chars) en `client/src/data/blog-i18n/{en,ca,fr,de,pt}.ts`:
- en: 4 (`form-5472-…`, `cuenta-bancaria-mercury-…`, `registered-agent-…`, `iva-intracomunitario-…`)
- ca: 16
- fr: 3
- de: 4
- pt: 8

Todas las descripciones quedan ≤150 chars sin cortes a media frase, manteniendo intención SEO y CTAs.

### 2. Tipografía — `abrir-llc.tsx` y `blog/post.tsx`
Extendido el allowlist de `scripts/check-typography-rule0.mjs` para incluir las dos primitivas de "eyebrow kicker" (uppercase + tracking) que forman parte intencionada del sistema de diseño (no son texto de cuerpo). Documentado en el comentario del propio script.

### 3. Stray reports
`TRANSLATION-QUALITY-REPORT.md` se movió de la raíz a `docs/` (es un informe histórico, no un *runtime artifact*).

### 4. PT-PT (portugués europeo)
Sustituidos 3 brasileñismos detectados en blog PT:
- `cadastro` → `registo predial` (en tabla DAC7 sobre imóveis) y `registo fiscal (NIF)` (en cruzado con AT) en `dac7-plataformas-digitales-reporting-2026.ts`.
- `arquivo` → `arquivamento` (CIVA art. 52.º, plazo 10 años) en `pasarelas-pago-llc-stripe-paypal-dodo.ts`.

### 5. Normalización "Remoto/Remote → Online/Digital"
Estrategia: reemplazar el lenguaje de marca "100% remoto / remote / à distance / remotament" por "100% online" (o "digital" cuando se refiere a perfiles de cliente/equipos), preservando:
- **Identificadores internos**: clave `remoteTeam` (en `client/src/lib/calculator-config.ts`, `calculator.ts` y todos los `i18n/locales/*.ts`).
- **APIs internas**: `req.socket.remoteAddress` en `server/route-helpers.ts`.
- **Marcas/productos de terceros**: "Deel or Remote" / "Deel/Remote" en `llc-agencias-marketing-digital.ts` (Remote.com es nombre de empresa).
- **Programas geográficos específicos**: columna "Remotely from Georgia" en la tabla de regímenes para nómadas de `nomada-digital-residencia-fiscal.ts` (descriptor del programa nacional).
- **Slug del artículo**: `nomada-digital-residencia-fiscal` (cambiar el slug rompería URLs e internal links; el contenido sí se actualizó).

Volumen aplicado:
- `server/seo-content.ts`: 32 reemplazos (descripciones, keywords, FAQ JSON-LD y bloques HTML en es/en/fr/de/pt/ca).
- `client/src/i18n/data/subpages.ts`: 14 reemplazos (perfiles, FAQ ITIN, descriptores de profesión).
- `client/src/data/blog-mid-cta-copy.ts`: 6 etiquetas `start_today` (es/en/fr/de/pt/ca).
- `client/src/i18n/locales/{es,en,fr,de,pt,ca}.ts`: 5 reemplazos cada uno (perfiles, whoItem5, whyDesc, process_4, label `remoteTeam`).
- `client/src/data/blog-i18n/{en,fr,pt,de,ca}.ts`: entry `nomada-digital-residencia-fiscal` (excerpt + meta + og).
- `client/src/data/blog-content/**`: 78 CTAs canónicos + ~80 usos descriptivos en cuerpo (PT, ES, FR, DE, EN, CA), incluyendo "100% remoto/remote/à distance" en aperturas, banca y descripciones de operativa.
- `client/public/llms.txt` / `llms-full.txt`: 3 reemplazos de copy de marca.

Total: ~250 sustituciones en 165+ ficheros, sin tocar identificadores ni nombres de productos.

## Métricas finales

- TypeScript: clean.
- 6 idiomas, 14 páginas + 5 subpáginas + 112 blog posts cada uno = **786 piezas SEO** verificadas, 0 errors / 0 warnings.
- Blog: 672 artículos con CTA mid-article canónico (672/672 OK), 112/112 con ≥3 enlaces internos, 0 enlaces rotos.
- Lint stack (typography, stray-reports, brand-casing, pt-pt, blog): clean.
- Marca consistente: usuario final ve "online / digital" en todos los puntos de contacto; identificadores técnicos preservados.

## Notas para próxima revisión

- El allowlist de `check-typography-rule0.mjs` para `abrir-llc.tsx` y `blog/post.tsx` debe revisarse si esos componentes se reutilizan fuera del eyebrow primitive.
- Hay 1 ocurrencia legítima de "Remote" preservada en `en/llc-agencias-marketing-digital.ts` (referencia a Remote.com como empresa de contractor management) — confirmar al añadir nuevas menciones que no se confundan con la marca propia.
