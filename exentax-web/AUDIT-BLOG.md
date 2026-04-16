# Auditoría del Blog Exentax

**Fecha:** 2026-04-16
**Alcance:** 55 artículos existentes + 9 nuevos artículos estratégicos × 6 idiomas (ES, EN, FR, DE, PT, CA).

---

## 1. Resumen ejecutivo

| Métrica | Valor |
| --- | --- |
| Artículos auditados | 55 |
| KEEP (mantener) | 55 |
| MERGE (consolidar y retirar) | 0 |
| DELETE (eliminar) | 0 |
| Nuevos artículos creados | 9 |
| Total post-auditoría | 64 |
| Idiomas | 6 (ES fuente + EN/FR/DE/PT/CA) |
| Total entradas de blog | 64 × 6 = 384 |

**Estado SEO por artículo (homogéneo en los 64):** todos disponen de `slug` único, `title`, `excerpt`, `metaTitle`, `metaDescription`, `category`, `readTime` y `publishedAt` en `blog-posts.ts`; H1 tomado del `title`; H2/H3 derivados del cuerpo Markdown en `blog-posts-content-{lang}.ts`. Slugs traducidos en `blog-posts-slugs.ts` y meta localizada en `blog-posts-i18n.ts` para los 6 idiomas. Sitemap dinámico (`server/routes/public.ts`) con `hreflang` y `x-default → /es`.

El blog presenta una calidad editorial alta y coherente: hilo narrativo claro, voz consistente, vocabulario técnico correcto y tablas comparativas útiles. La mayoría de artículos están bien posicionados temáticamente y mantienen un buen equilibrio entre profundidad técnica y CTA comercial.

Los puntos débiles detectados son:
1. **Cobertura incompleta de CRS, DAC7 y DAC8.** El artículo `crs-cuentas-bancarias-llc-intercambio-informacion` introduce CRS pero no aborda los detalles de plataformas concretas (Revolut, Wise) ni la nueva normativa europea (DAC7 sobre plataformas digitales, DAC8 sobre criptoactivos).
2. **Falta doctrina administrativa española relevante.** No existe artículo dedicado a la Resolución del TEAC y consultas vinculantes de la DGT sobre LLC americanas (especialmente la doctrina derivada de la consulta V0443-19 y la línea reforzada en febrero 2020).
3. **Poca granularidad en tributación por actividad.** El artículo de fiscalidad por país de residencia es genérico; falta análisis por tipo de actividad económica (servicios, e-commerce, SaaS, royalties).
4. **No hay marco de riesgos fiscales.** Falta un artículo que sistematice los riesgos de una mala estructuración (simulación, transparencia fiscal internacional, residencia fiscal, EP).
5. **No hay guía de diseño de estructura.** Falta artículo de "framework" que enseñe a diseñar una estructura internacional sólida desde cero.

Los 9 nuevos artículos cubren íntegramente estos huecos.

---

## 2. Decisión por artículo

Leyenda:
- **KEEP**: contenido sólido, mantener tal cual o con mejoras menores.
- **MERGE**: solapa con otro artículo, consolidar.
- **DELETE**: obsoleto o redundante.
- **Mejora sugerida**: anotación opcional para refresh futuro.

| # | Slug | Categoría | Decisión | Notas / Mejora sugerida |
|---|------|-----------|----------|-------------------------|
| 1 | llc-estados-unidos-guia-completa-2026 | Guías | KEEP | Pilar SEO. Excelente. Ya enlaza a 5+ artículos. |
| 2 | form-5472-que-es-como-presentarlo | Compliance | KEEP | Cubre Form 1120 pro-forma, sanciones, calendario. |
| 3 | nuevo-mexico-vs-wyoming-vs-delaware | Comparativas | KEEP | Tabla comparativa sólida. |
| 4 | separar-dinero-personal-llc-por-que-importa | Operativa | KEEP | 17 min de lectura, muy completo. |
| 5 | ein-numero-fiscal-llc-como-obtenerlo | Guías | KEEP | Explicación clara del proceso SS-4. |
| 6 | cuenta-bancaria-mercury-llc-extranjero | Herramientas | KEEP | Mejora futura: añadir Column NA y FDIC sweep ($5M). |
| 7 | autonomo-espana-vs-llc-estados-unidos | Comparativas | KEEP | Buena comparativa fiscal. |
| 8 | impuestos-clientes-internacionales-espana | Fiscalidad | KEEP | Cubre IVA intracomunitario y reverse charge. |
| 9 | pagar-cero-impuestos-legalmente-llc | Fiscalidad | KEEP | Tono honesto, sin promesas absolutistas. |
| 10 | nomada-digital-residencia-fiscal | Fiscalidad | KEEP | Excelente para SEO; cubre 183 días, centro intereses. |
| 11 | criptomonedas-trading-llc-impuestos | Fiscalidad | KEEP | Mejora futura: añadir referencia DAC8 (cubierto en artículo nuevo #5). |
| 12 | iva-servicios-digitales-internacional | Fiscalidad | KEEP | Cubre OSS/IOSS, B2B vs B2C. |
| 13 | registered-agent-que-es-por-que-necesitas | Guías | KEEP | Explicación clara. |
| 14 | errores-fiscales-freelancers-espanoles | Fiscalidad | KEEP | Top 10 listicle eficaz. |
| 15 | como-operar-llc-dia-a-dia | Operativa | KEEP | Guía práctica robusta. |
| 16 | operating-agreement-llc-que-es | Guías | KEEP | Documento clave bien explicado. |
| 17 | documentos-llc-cuales-necesitas | Guías | KEEP | Checklist útil. |
| 18 | mantenimiento-anual-llc-obligaciones | Compliance | KEEP | Calendario fiscal completo. |
| 19 | wise-business-llc-guia | Herramientas | KEEP | Mejora: enlazar al nuevo artículo `wise-business-crs-reporting-fiscal`. |
| 20 | pasarelas-pago-llc-stripe-paypal-dodo | Herramientas | KEEP | Comparativa correcta. |
| 21 | amazon-ecommerce-llc-vender-online | Operativa | KEEP | Cubre nexus y sales tax. |
| 22 | gastos-deducibles-llc-que-puedes-deducir | Fiscalidad | KEEP | Lista sólida con ejemplos. |
| 23 | residentes-no-residentes-llc-diferencias | Fiscalidad | KEEP | Diferencias bien marcadas. |
| 24 | cambiar-divisas-llc-mejores-opciones | Operativa | KEEP | Wise vs OFX vs Mercury. |
| 25 | constituir-llc-proceso-paso-a-paso | Guías | KEEP | Paso a paso operativo. |
| 26 | autonomos-espana-por-que-dejar-de-serlo | Fiscalidad | KEEP | Aborda el ángulo "decisión / por qué dejarlo" mientras `autonomo-espana-vs-llc-estados-unidos` cubre la comparativa fiscal. SEO independiente en intent (decisional vs comparativo). No se retira ni redirige. |
| 27 | bancos-vs-fintech-llc-donde-abrir-cuenta | Herramientas | KEEP | Comparativa útil. |
| 28 | tiempos-pagos-ach-wire-transfer | Operativa | KEEP | Tema operativo concreto. |
| 29 | iban-swift-routing-number-que-son | Operativa | KEEP | Glosario práctico. |
| 30 | cuanto-cuesta-constituir-llc | Guías | KEEP | Desglose de costes. |
| 31 | ventajas-desventajas-llc-no-residentes | Comparativas | KEEP | Análisis honesto. |
| 32 | evitar-bloqueos-mercury-wise-revolut | Operativa | KEEP | Operativo y útil. |
| 33 | que-es-irs-guia-duenos-llc | Guías | KEEP | Buena introducción. |
| 34 | llc-seguridad-juridica-proteccion-patrimonial | Guías | KEEP | Veil-piercing explicado. |
| 35 | llc-creadores-contenido-youtube-twitch | Guías | KEEP | Vertical específico bien tratado. |
| 36 | llc-agencias-marketing-digital | Guías | KEEP | Vertical específico bien tratado. |
| 37 | primer-mes-llc-que-esperar | Operativa | KEEP | Onboarding claro. |
| 38 | llc-desarrolladores-software-saas | Guías | KEEP | Vertical específico. |
| 39 | escalar-negocio-digital-llc-americana | Operativa | KEEP | Tema de crecimiento. |
| 40 | due-diligence-bancario-llc-americana | Compliance | KEEP | KYC/AML bancario. |
| 41 | estructura-fiscal-optima-freelancer-internacional | Fiscalidad | KEEP | Foco en perfil "freelancer internacional"; complementa al nuevo `diseno-estructura-fiscal-internacional-solida` (framework de 6 pasos), no lo duplica. Ambos enlazados entre sí. No se retira ni redirige. |
| 42 | prevencion-blanqueo-capitales-llc | Compliance | KEEP | AML/CTF compliance. |
| 43 | fiscalidad-internacional-emprendedores-digitales | Fiscalidad | KEEP | Marco general. |
| 44 | extension-irs-form-1120-como-solicitarla | Fiscalidad | KEEP | Form 7004 bien explicado. |
| 45 | itin-ssn-que-son-como-obtenerlos | Guías | KEEP | Diferenciación clara EIN/ITIN/SSN. |
| 46 | tributacion-pass-through-llc-como-funciona | Fiscalidad | KEEP | Concepto core bien tratado. |
| 47 | por-que-abrir-llc-estados-unidos-ventajas | Guías | KEEP | Pilar de captación. |
| 48 | problemas-comunes-llc-como-evitarlos | Guías | KEEP | Casos reales. |
| 49 | fiscalidad-llc-por-pais-residencia | Fiscalidad | KEEP | España/MX/CO/AR cubiertos. |
| 50 | crs-cuentas-bancarias-llc-intercambio-informacion | Fiscalidad | KEEP | Buena base CRS; complementado por los 3 nuevos artículos CRS-específicos. |
| 51 | cuentas-bancarias-usa-reportan-hacienda-verdad | Fiscalidad | KEEP | EE.UU. fuera de CRS pero con FATCA, bien explicado. |
| 52 | privacidad-llc-americana-secreto-ventaja | Legal | KEEP | Distingue privacidad real vs opacidad ilegal. |
| 53 | boi-report-fincen-guia-completa-2026 | Compliance | KEEP | Actualizado a 2026. |
| 54 | testaferros-prestanombres-llc-ilegal-riesgos | Legal | KEEP | Tono claro contra prácticas ilegales. |
| 55 | por-que-no-abrir-empresa-estonia | Comparativas | KEEP | Comparativa LLC vs OÜ honesta. |

### Justificación de "no DELETE / no MERGE retirado"

Tras análisis individual, ningún artículo está obsoleto, duplicado funcionalmente ni contiene información incorrecta. Los dos casos inicialmente sospechosos de solapamiento (`autonomos-espana-por-que-dejar-de-serlo` vs `autonomo-espana-vs-llc-estados-unidos`; `estructura-fiscal-optima-freelancer-internacional` vs el nuevo `diseno-estructura-fiscal-internacional-solida`) se reclasifican definitivamente como **KEEP**: cubren *intents de búsqueda distintos* (decisional vs comparativo; perfil-específico vs framework genérico) y aportan valor SEO independiente. **No se retira ningún slug**, **no se ejecuta ninguna operación de merge** y **no se generan redirecciones 301**.

---

## 3. Nuevos artículos creados

| # | Slug | Tema | Idiomas |
|---|------|------|---------|
| 1 | `crs-residentes-espana-latam-implicaciones` | CRS para residentes ES y LATAM: implicaciones reales | 6 |
| 2 | `revolut-business-crs-reporting-fiscal` | Revolut Business: reporting CRS y obligaciones | 6 |
| 3 | `wise-business-crs-reporting-fiscal` | Wise Business: reporting CRS y dónde se reporta | 6 |
| 4 | `dac7-plataformas-digitales-reporting-2026` | DAC7: reporting de plataformas digitales en la UE | 6 |
| 5 | `dac8-criptomonedas-reporting-fiscal-2026` | DAC8: el nuevo CRS para criptoactivos | 6 |
| 6 | `boe-febrero-2020-llc-doctrina-administrativa` | BOE febrero 2020 y doctrina DGT/TEAC sobre LLC | 6 |
| 7 | `tributacion-llc-segun-actividad-economica` | Tributación de la LLC según tu actividad económica | 6 |
| 8 | `riesgos-fiscales-mala-estructuracion-internacional` | Riesgos fiscales de una mala estructuración internacional | 6 |
| 9 | `diseno-estructura-fiscal-internacional-solida` | Diseño de una estructura fiscal internacional sólida | 6 |

Cada artículo:
- Tiene 2.000+ palabras en ES (fuente).
- Cita normativa concreta: CDI España-EE.UU. (BOE 22-12-1990, Protocolo 27-7-2019), LIRPF, LIS, Modelo de Convenio OCDE, Common Reporting Standard (OCDE), Directiva 2011/16/UE (DAC) y sus modificaciones DAC7 (2021/514) y DAC8 (2023/2226), Resolución DGT V0443-19, BOE de febrero 2020 sobre LLC.
- Incluye 3-6 enlaces internos cruzados con artículos existentes y entre los nuevos.
- Termina con CTA natural a `/es/agendar` (o equivalente localizado vía `useLangPath("book")`).
- Adaptaciones profesionales (no traducciones literales) a EN, FR, DE, PT, CA.

---

## 4. Mejoras transversales aplicadas en alta

Para cada nuevo artículo se han registrado:
- Entrada en `blog-posts.ts` (ES) con `metaTitle`, `metaDescription`, `excerpt`, `category`, `readTime`, `publishedAt`.
- Contenido en `blog-posts-content-{en,fr,de,pt,ca}.ts`.
- Slugs traducidos en `blog-posts-slugs.ts` para los 6 idiomas.
- Metadata localizada en `blog-posts-i18n.ts` (title, excerpt, metaTitle, metaDescription).

El sitemap dinámico (`server/routes/public.ts`) recoge automáticamente los nuevos artículos vía `BLOG_POSTS` con hreflang correcto para los 6 idiomas y `x-default` apuntando a `/es`.

---

## 5. Checklist de calidad para los 9 nuevos artículos

- [x] 2.000+ palabras en ES.
- [x] Tono profesional, sin absolutismos ("garantizado", "sin riesgo").
- [x] Citan normativa verificable.
- [x] 3-6 enlaces internos por artículo.
- [x] CTA final a `/es/agendar` (no hardcoded en el resto de idiomas: el componente `post.tsx` traduce el path automáticamente).
- [x] Adaptación profesional, no traducción literal.
- [x] SEO: metaTitle ≤ 60 caracteres, metaDescription 140-160 caracteres.
- [x] Categorías coherentes con las existentes (Fiscalidad, Compliance, Guías, Operativa).

---

## 6. Estado final

- **64 artículos vivos × 6 idiomas = 384 entradas de blog** (55 originales KEEP + 9 nuevos; 0 retirados).
- 0 redirecciones nuevas necesarias.
- 0 enlaces rotos esperados.
- Cobertura completa de los temas regulatorios solicitados (CRS, DAC7, DAC8, BOE Feb-2020, doctrina administrativa, tributación por actividad, riesgos y diseño de estructura).

## 7. Verificación ejecutada

- **TypeScript** (`npx tsc --noEmit -p .` desde `exentax-web/`): **PASS**, sin errores.
- **Servidor de desarrollo** (`npm run dev`): arranca correctamente en puerto 5000, sin errores de runtime ni de Vite. Confirmado vía logs (`/api/legal/versions 200`).
- **Conteo de artículos en `blog-posts.ts`**: 64 entradas (`grep -c "slug:"` ajustado por entradas de cabecera) — alineado con `55 + 9`.
- **Slugs traducidos**: `BLOG_SLUG_I18N` contiene 64 claves, una por slug ES, con 5 traducciones cada una (en/fr/de/pt/ca).
- **Meta i18n**: `BLOG_I18N` contiene meta localizada para los 5 idiomas no-ES de los 9 nuevos artículos; los 55 originales mantienen su meta previa.
- **Enlaces internos**: cada nuevo artículo enlaza únicamente a slugs ES existentes en `blog-posts.ts`; el componente `post.tsx` traduce el path al render según el idioma activo, evitando enlaces rotos por idioma.
- **Sitemap / hreflang**: el sitemap dinámico se regenera automáticamente desde `BLOG_POSTS`, por lo que los 9 nuevos slugs y sus 5 traducciones aparecen sin acción adicional.
