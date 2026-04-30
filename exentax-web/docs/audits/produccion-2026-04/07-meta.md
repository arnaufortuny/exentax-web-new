# 07 — Polish de cierres de marca repetidos en cards sociales (Tarea #27)

Fecha: 2026-04-30
Alcance: Open Graph descriptions de los 112 artículos de blog en las
locales **PT, CA y DE** (336 entradas analizadas).

## Contexto

El generador `scripts/seo/inject-blog-og.mjs` rellena cada
`ogDescription` cuyo cuerpo no llega a 120 caracteres con un *tail*
sacado de un pool corto por idioma (`TAILS[lang]`). Funciona muy bien
para la longitud y la distinctness vs `metaDescription`, pero como el
pool es chico (~10 frases) acaba reciclando los mismos cierres una y
otra vez cuando varios artículos del mismo idioma quedan justo por
debajo del mínimo. La tarea original lo describía como "cards sociales
ligeramente repetitivas" cuando varios artículos de la misma locale
aparecen juntos (página de categoría, timeline de Twitter, etc.).

Estado previo (snapshot pre-fix):

| Locale | Tails repetidos | Artículos afectados |
|--------|-----------------|---------------------|
| ca     | 5 frases boilerplate (`Parla 30 min …`, `30 min gratis amb Exentax.`, `Exentax: constitució …`, `Assessors fiscals …`, `Exentax acompanya …`) | 31 / 112 |
| de     | 4 frases (`Sprechen Sie mit Exentax.`, `Exentax: Ihre US-LLC einsatzbereit …`, `Exentax begleitet …`, `Sprechen Sie 30 Minuten …`) | 24 / 112 |
| pt     | 5 frases (`Exentax: LLC chave-na-mão.`, `Exentax acompanha …`, `Assessores fiscais Exentax …`, `Fale 30 min …`, `Exentax: constituição …`) | 31 / 112 |

Total: **86 ogDescriptions** terminaban con uno de 14 cierres
boilerplate compartidos. El cuerpo de cada artículo seguía siendo
único y rico en cifras (por eso `seo:meta` y
`seo:masterpiece-strict` no lo marcaban como duplicado), pero la
*última frase* — la única visible en la mayoría de timelines —
era la misma para varios artículos vecinos.

## Cambio aplicado

`.local/scratch/fix-og-tails-v2.mjs` reemplazó cada cierre boilerplate
por una frase específica del artículo, manteniendo el cuerpo intacto
y respetando la ventana 120-160 caracteres. La estrategia, en orden de
preferencia, fue:

1. **Cuerpo solo** — si el cuerpo del artículo (sin el tail) ya cae
   en `[120, 160]` y termina con puntuación + palabra no-stopword, se
   usa tal cual y se descarta el tail.
2. **Recorte por frase** — si el cuerpo se pasa de 160, se recorta al
   final de frase más cercano que siga dentro de la ventana
   (algoritmo `trimToCompleteSentence`, mismo que `inject-blog-og.mjs`).
3. **Cuerpo + closer específico** — si ni el cuerpo ni un recorte
   limpio caben, se usa un closer escrito a mano para ese slug en esa
   locale (mapa `CLOSERS` en el script de migración) que aporta una
   afirmación factual del propio artículo (p. ej. para
   `due-diligence-bancario-llc-americana` en CA: *"Documents i prova
   real al dossier."*; en DE: *"Mit echtem Geschäftsnachweis im
   Dossier."*; en PT: *"Documentos completos e prova real de
   negócio."*).

Closers nuevos creados a mano: 19 slugs × 1-3 idiomas según procediera
(ver `CLOSERS` en `.local/scratch/fix-og-tails-v2.mjs`). Cada closer
es ≤ 80 caracteres, termina en puntuación, no usa anglicismos
(verificado por `seo:meta` en modo `og`) y mantiene la ventana
120-160 al combinarse con el cuerpo o un recorte de frase.

## Verificación

| Check | Antes | Después |
|-------|-------|---------|
| Tails repetidos en CA / DE / PT | 14 (86 entradas) | **0** (0 entradas) |
| `ogDescription` totalmente duplicada en CA / DE / PT | 0 | 0 |
| `npm run seo:meta` | PASS 0 errors / 0 warnings | PASS 0 errors / 0 warnings |
| `npm run seo:masterpiece-strict` | mean 100/100 | mean 100/100 |
| `npm run seo:serp-previews` | 0 errors / 18 warnings | 0 errors / 18 warnings |
| `validate-social-previews` errores en CA/DE/PT | 0 | 0 |

(Los 408 errores que `validate-social-previews` reporta están todos en
`es` y son pre-existentes; no entran en el alcance de esta tarea.)

## Cómo reproducir

```sh
node .local/scratch/extract.mjs           # snapshot de tails repetidos
node .local/scratch/fix-og-tails-v2.mjs   # aplica el reemplazo
node .local/scratch/verify-unique.mjs     # verifica unicidad por locale
cd exentax-web
npm run seo:meta
npm run seo:masterpiece-strict
npm run seo:serp-previews
```

## Pendiente / follow-ups

- `inject-blog-og.mjs` sigue con el mismo pool corto, así que cualquier
  artículo nuevo que vuelva a pasar por el inject-or volverá a recibir
  un tail boilerplate. Considerar:
  - Ampliar `TAILS[lang]` a 25-30 frases por idioma, o
  - Hacer que el picker prefiera tails que aún no se hayan usado en la
    misma locale (selección con tracking de uso por locale), o
  - Marcar los cierres específicos por slug como "no tocar" para que
    el inject-or no los sobreescriba (campo `ogDescriptionLocked: true`).
- FR todavía usa boilerplate (`Exentax : LLC clé en main.` ×9 y
  `Cabinet fiscal Exentax …` ×2). No estaba en el alcance de esta tarea
  (PT/CA/DE) pero conviene aplicarle el mismo tratamiento si surge una
  follow-up.
