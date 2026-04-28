# Reglas editoriales del blog Exentax — v2 (canónico)

> Documento autoritativo para cualquier overhaul, traducción, refuerzo o nuevo artículo del blog Exentax.
> Aplica a los 6 idiomas oficiales (ES, EN, FR, DE, PT, CA) y a las ~100 piezas tier-A/B/C.
> Última revisión: 2026-04-20 (v2, derivada de feedback "QUIERO QUE DOCUMENTES ESTAS REGLAS PARA FUTUROS TRABAJOS").
> Owner: equipo Exentax. Cualquier excepción debe registrarse aquí o quedará bloqueada por `npm run lint:blog`.

## 0. Posicionamiento — quién somos en el blog

Exentax es la consultora boutique top-1 en LLC para no residentes, **compliance bancario, banca/fintech, cripto, brokers, ITINs y reducción legal de impuestos en operativa internacional**. Cada artículo del blog debe reforzar ese posicionamiento, sin excepciones. Si una pieza no posiciona a Exentax como referencia clara y operativa para alguno de esos verticales, se reescribe.

Pilares editoriales que debemos dominar (y donde cada artículo debe encajar):

1. **LLC US para no residentes.** Constitución, mantenimiento, disolución, errores críticos.
2. **Compliance.** BOI report, CTA, Form 5472/1120, EIN, ITIN, FATCA, CRS, DAC-7.
3. **Banca y fintech para LLC.** Mercury, Relay, Wise, Brex, Airwallex, Payoneer, neobancos.
4. **Inversión y brokers.** IBKR, Charles Schwab, Tastytrade, brokers para no residentes.
5. **Cripto.** Coinbase, Kraken, custodia, fiscalidad de cripto en LLC y residencia personal.
6. **Pagos.** Stripe, PayPal, ACH, wire, SEPA, payouts internacionales.
7. **ITIN y residencia fiscal.** Cómo obtenerlo, cuándo aplica, alternativas (W-8BEN-E).
8. **Reducción legal de impuestos.** Optimización vía estructura, residencia, treaty shopping legítimo.
9. **Operativa internacional.** Nómadas digitales, servicios B2B cross-border, real estate.

## 1. Voz y tono — "humano, cercano, extenso, cómodo"

- **Humano.** Habla en segunda persona ("tu LLC", "tu Hacienda"). Cero jerga gratuita. Si usas un término técnico (UBO, BOI, EIN), explícalo en la primera mención.
- **Cercano sin ser blando.** No suplicas, no felicitas en exceso. Hablas como un fiscalista senior que ya ha visto el caso del lector mil veces.
- **Extenso pero al grano.** Cada frase aporta. "Extenso" no significa relleno: significa cubrir el caso real con contexto, números, plazos y consecuencias. Objetivo de longitud por bloque insertado: **~370 palabras** en cada idioma para piezas tier-C; **800–3.500 palabras** totales para tier A/B.
- **Cómodo de leer.** Frases cortas. Listas de 4 bullets máximo por bloque. Bullets con **negrita** al inicio que actúan como sub-titulares escaneables.
- **Sólido y verídico.** Cada cifra, plazo o sanción debe ser comprobable contra la fuente oficial (IRS, FinCEN, FDIC, OCDE, Banco de España, AEAT, Registry of Companies del estado correspondiente). Si no está en una fuente primaria, no se publica.

## 2. Estructura obligatoria del bloque insertado v2 (`exentax:execution-v2`)

Cada artículo tier-C lleva, **antes del CTA de cierre y después del bloque de Referencias**, un H2 nuevo con:

1. **H2 conversion-oriented** (no "Actualización", no año). Ejemplos válidos:
   - "Del análisis a la ejecución con Exentax"
   - "Cómo lo resolvemos en Exentax"
   - "El método Exentax aplicado a tu caso"
2. **Párrafo de apertura (60–90 palabras)** que enmarca el problema desde la experiencia operativa de Exentax y promete un resultado concreto.
3. **4 bullets de "specifics-rich"**, cada uno con:
   - Sub-titular en **negrita** que es la objeción/decisión real del lector.
   - 2–4 frases con cifras concretas (montos USD, plazos en días, formularios IRS, artículos de ley).
   - Cierre operativo: qué hace Exentax al respecto.
4. **Sub-H3 "Lo que más nos preguntan" / "What we are asked the most"** con **2–3 FAQ** (pregunta en negrita + respuesta de 30–60 palabras). Estas FAQ deben ser extraíbles a FAQ schema en `client/src/components/SEO.tsx`.
5. **Cierre Exentax (40–80 palabras)** que conecta el problema con un servicio Exentax concreto (constitución, compliance, banking setup, ITIN, broker setup, cripto reporting…). NUNCA cierre genérico tipo "contáctanos".

Marcador HTML idempotente obligatorio: `<!-- exentax:execution-v2 -->` … `<!-- /exentax:execution-v2 -->`. El script `apply-v2.mjs` reemplaza in-place; nunca duplicar bloques.

## 3. Reglas de longitud y unicidad

- **Cada artículo es único.** Nada de copia-pega entre piezas. Si dos artículos tocan el mismo tema, cada uno enfoca un ángulo distinto y se enlazan vía `blog-related.ts`.
- **Cada idioma es una traducción premium, no literal.** ES suele ser la versión origen, pero EN/FR/DE/PT/CA se trabajan con localización real (terminología fiscal local: AEAT vs HMRC vs DGFiP vs Finanzamt vs AT vs ATC).
- **Sin años en el cuerpo del artículo.** Nada de "en 2026", "actualizado 2026", "para este año". Los slugs históricos (`llc-estados-unidos-guia-completa-2026`) se respetan en URL pero no se mencionan en prosa. El sweep `node .local/blog-overhaul/sweep-2026.mjs` valida esta regla.
- **~370 palabras por bloque insertado** (tier-C). Si te quedas corto, falta concreción. Si te pasas, falta foco.

## 4. Reglas de miedo, presión y CTAs

> Esta es la regla más sensible del blog. Léela completa antes de escribir.

### 4.1. NO generar miedo sobre la LLC en sí

La LLC US es nuestro producto. La narrativa por defecto es: la LLC bien estructurada es **la herramienta legal más eficiente** para operar internacionalmente, abrir cuentas globales y reducir carga fiscal sin riesgo. Prohibido:

- Insinuar que tener una LLC es arriesgado per se.
- Dramatizar el mantenimiento ("es un infierno", "te van a pillar").
- Usar tono de pánico sobre auditorías rutinarias del IRS a LLCs cumplidoras.

### 4.2. SÍ generar urgencia sobre lo que favorece a Exentax

Está permitido (y recomendado) tono firme y consecuencias reales sobre:

- **Compliance fallido**: BOI no presentado ($591/día FinCEN), Form 5472 no presentado ($25.000 IRS §6038A).
- **Testaferros, prestanombres y estructuras opacas**: delito penal real (CTA US, art. 301 CP España, §261 StGB Alemania, art. 368-A CP Portugal, art. 324-1 CP Francia).
- **Operar sin EIN/ITIN cuando aplica**: cierre de cuentas, denegación de SSN-related.
- **Mezclar fondos personales y de la LLC**: pérdida del corporate veil.
- **Banca informal o cripto sin reporting**: SAR del banco, congelación de cuenta, denuncia cruzada CRS.
- **DIY mal hecho** (formularios LegalZoom genéricos, BOI con UBO equivocado): coste de regularización siempre > coste de hacerlo bien desde el día uno.

### 4.3. Vocabulario prohibido por el linter

`scripts/blog/blog-content-lint.mjs` bloquea automáticamente:

- **Emocional, siempre prohibido**: `te van a pillar`, `sustos`, `pánico` (en cualquier idioma — `panic`, `panique`, `Panik`).
- **Prison/cárcel/jail/Gefängnis/prisão/presó/prisión**, salvo que la misma línea cite un marcador legal (penalty/multa/Strafe/amende + IRC/FinCEN/BOI/Form/§ + duración en años + art.). Para describir consecuencias penales sin tropezar con el linter, usar fórmulas como:
  - ES: "responsabilidad penal", "procedimiento penal firme con privación de libertad", "condena con privación de libertad".
  - EN: "criminal liability", "firm criminal proceeding with custodial sentence", "actual custodial sentence".
  - FR: "responsabilité pénale", "peine privative de liberté".
  - DE: "strafrechtliche Verantwortung", "Freiheitsstrafe" (acompañada de marcador legal).
  - PT: "responsabilidade penal", "pena privativa de liberdade".
  - CA: "responsabilitat penal", "pena privativa de llibertat".

### 4.4. CTAs sólidos, humanos, conversion-first

- **Dos CTAs obligatorios por artículo**: (a) calculadora fiscal, (b) sesión inicial con Exentax. Ambos linkados al dominio del idioma de la página.
- **Cierre Exentax humano**: nunca "haz click aquí". Sí: "Si quieres que diseñemos la estructura LLC + banca + compliance que tu caso necesita, agenda 30 minutos con el equipo Exentax — te decimos en directo qué hacer y qué evitar."
- **Banner CTA mid-article** (cuando el artículo > 1.500 palabras): un solo banner discreto antes del bloque v2.

## 5. Reglas de cifras permitidas

El linter solo deja pasar estas cifras en USD dentro de contextos de servicio LLC:

| Cifra | Concepto | Fuente primaria |
|---|---|---|
| `$25,000` / `$25K` | Penalty IRS Form 5472 / 1120 (§6038A) | IRS.gov |
| `$591/día` | FinCEN BOI civil penalty | FinCEN.gov |
| `$250,000` / `$250K` | FDIC insurance limit | FDIC.gov |
| `2.9%` | Stripe base processing rate | Stripe.com pricing |
| `$0` | "La LLC pass-through debe $0 federal" (uso editorial) | IRS guidance |

**Cualquier otro precio en USD asociado a "filing fee", "franchise tax", "registered agent", "annual report", "EIN fee" está bloqueado.** Estamos saliendo del posicionamiento "barato" hacia "premium boutique": no publicamos tarifas estatales en el blog porque cambian y porque diluyen el mensaje de servicio.

## 6. Multilingüe e indexación

- 6 idiomas activos: **ES, EN, FR, DE, PT, CA**, todos con el mismo número de slugs (101 a fecha de v2).
- `hreflang` configurado en `SEO.tsx` para cada slug.
- `blog-related.ts` debe mantener cross-linking dentro del idioma (no enlazar artículo ES desde artículo EN).
- Sitemap por idioma generado dinámicamente; verificar tras cada batch que `npm run build` no rompe rutas.
- Slugs históricos con año (`-2026`) **se respetan tal cual** — cambiarlos rompería canónicos. Solo se limpia el año del **cuerpo** del artículo.

## 7. Verificación obligatoria antes de cerrar trabajo

```bash
# 1. Limpieza de años en prosa (URL slugs quedan intactos)
node .local/blog-overhaul/sweep-2026.mjs

# 2. Lint editorial (cifras, direcciones, miedo)
cd exentax-web && node scripts/blog/blog-content-lint.mjs

# 3. Build (verifica que ningún .ts roto rompe el bundle)
cd exentax-web && npm run build

# 4. (Opcional) Lighthouse audit sobre 5 slugs representativos
```

Si cualquier paso falla, **no se cierra el trabajo**. Se vuelve al source mjs en `.local/blog-overhaul/batchN/`, se corrige, se re-aplica con `apply-v2.mjs`, se re-lintea.

## 8. Workflow de overhaul (cómo se ejecuta una nueva ronda)

1. **Batch source** en `.local/blog-overhaul/batchN/blocks-X-Y.mjs` con N slugs × 6 idiomas, marcador `exentax:execution-v2`.
2. **`node .local/blog-overhaul/apply-v2.mjs .local/blog-overhaul/batchN`** — idempotente, sustituye bloques v1/v2 in-place.
3. **`node .local/blog-overhaul/sweep-2026.mjs`** — limpia años residuales en prosa.
4. **`cd exentax-web && node scripts/blog/blog-content-lint.mjs`** — debe terminar `OK`.
5. **`cd exentax-web && npm run build`** — debe pasar.
6. **Actualizar `docs/seo/blog-overhaul-2026.md`** con los slugs tocados y la fecha.

## 9. Reglas anti-drift (qué NO hacer nunca)

- ❌ No editar `.ts` directamente para cambios de copy. Siempre vía `batchN/blocks.mjs` + `apply-v2.mjs`. Razón: idempotencia, trazabilidad, re-aplicabilidad multi-idioma.
- ❌ No añadir `createdAt`/`updatedAt`/`year` al data model del blog.
- ❌ No mencionar competidores por nombre. Comparativa cualitativa solo en `docs/seo/`.
- ❌ No prometer resultados fiscales específicos ("ahorrarás 40%"). Sí: "clientes Exentax con perfil X reducen carga fiscal de forma significativa, caso por caso".
- ❌ No publicar direcciones físicas ni "virtual address service" en el copy del blog (bloqueado por linter).
- ❌ No usar el blog como brochure de precios. Los precios viven en la página de servicios.

---

**Esta es la fuente única de verdad para el editorial del blog Exentax v2.** Cualquier futura agente, redactor o revisor debe leer este documento antes de tocar una sola línea de `client/src/data/blog-content/`.
