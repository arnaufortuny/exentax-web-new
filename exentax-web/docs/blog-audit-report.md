# Blog audit report — Task #7

Date: 2026-04-20
Scope: every article under `client/src/data/blog-content/{es,en,fr,de,pt,ca}/`
(101 base Spanish slugs × 6 languages, ≈ 606 files).

## 1. Method

A new TypeScript guard, `scripts/check-blog-links.ts`, was written to
classify and count problems instead of relying on manual reading. The script
exits non-zero on any finding and is safe to wire into CI. It enforces the
six rules documented in `docs/blog-structure.md` §4–6
(broken-blog-slug, broken-route, cross-lang-link, hardcoded-cta,
undefined-token, missing-calc-cta).

A companion idempotent fixer, `scripts/blog-fix-broken-links.mjs`, applies
the rewrites needed to satisfy those rules. Both scripts can be re-run
safely. A third script, `scripts/blog-audit-table.mjs`, regenerates the
per-slug table in §8 from the current state of the corpus.

## 2. Findings inventory (before fixes)

| Rule                        | Count   | Notes                                                                 |
|-----------------------------|---------|-----------------------------------------------------------------------|
| `broken-route` (calculator) | ~580    | Links to `/<lang>/calculator` and `/<lang>/calculadora`               |
|                             |         | (and `/de/rechner`, `/fr/calculatrice`) — no such route exists        |
| `broken-route` (contact)    | ~55     | Links to `/<lang>/contacto`, `/<lang>/contact`, `/de/kontakt` —       |
|                             |         | no contact route exists                                               |
| `broken-route` (booking)    | ~303    | EN/FR/DE files used `/en/agendar` etc. — wrong slug per `ROUTE_SLUGS` |
| `hardcoded-cta`             | ~223    | Inline booking links living **outside** the two sanctioned CTA marker |
|                             |         | blocks; effectively a duplicate CTA                                   |
| `undefined-token` (literal) | 0       | After tightening the rule (see §5)                                    |
| `cross-lang-link`           | 0       | Already covered by the existing `blog-link-locale-lint`               |
| `missing-calc-cta`          | 36      | Non-Spanish translations missing the canonical mid-article CTA marker |
|                             |         | (16 base slugs × 1–4 languages); fixed in §3                          |

## 3. Fixes applied

`scripts/blog-fix-broken-links.mjs` performed the following batch rewrites
across **390 files** (after a second pass that picked up the universal
English `calculator` slug used inside non-ES files):

* **390** calculator links → `/<lang>#calculadora` (localized home anchor).
* **55** contact links delinked (the inline "página de contacto" wording is
  preserved as plain text; the marker-wrapped final CTA is the sole
  booking link).
* **303** wrong-slug booking links rewritten to the canonical slug per
  language (`/en/book`, `/fr/reserver`, `/de/buchen`).
* **223** hardcoded booking-CTA links delinked (they lived outside the
  marker blocks and duplicated the final CTA).

## 4. Component & template fixes

* `client/src/pages/blog/post.tsx` rendered both `SidebarRelated` and
  `RelatedReadsBlock` simultaneously, producing two "related" sections per
  article. The sidebar duplicate was removed; the bottom grid is now the
  **single** related-articles block.
* The bottom grid heading used the wrong i18n key (`blogPost.heading`,
  which is the blog **index** title). It now uses
  `blogPost.relatedTitle` so the localized phrase reads "Related Articles"
  in every language.
* The previously inline final CTA (markup duplicated across `post.tsx`
  with hardcoded booking copy and analytics calls) has been extracted to
  the new reusable component `client/src/components/blog/ArticleCTA.tsx`,
  rendered once by `post.tsx` after every article and using
  `useLangPath("book")` for the locale-aware booking URL. The component
  forwards the analytics surface via a `surface` prop so per-article
  tracking is preserved without repeating the markup. The mid-article CTA
  remains a Markdown contract (the `<!-- exentax:calc-cta-v1 -->` marker
  block injected by `scripts/blog-fix-missing-calc-cta.mjs` and enforced
  by `scripts/check-blog-links.ts`), so it is editable per article without
  touching React code.

## 5. Validator-rule tightening

The first pass of `check-blog-links.ts` flagged 94 occurrences of the
literal token `null`, all of them legitimate German prose (`Null-Steuer`,
`null Steuern`). The rule was narrowed to only flag the literal English
word `undefined`, which has no editorial use in any of the six supported
languages and therefore reliably indicates a leaked unbound variable. After
the change there are **0** undefined-token findings.

## 6. Final state

```bash
$ npx tsx scripts/check-blog-links.ts
check-blog-links: clean ✓
```

All five rules pass on every article, in every language. Re-running either
the guard or the fixer is a no-op.

## 7. Factual / editorial verification

This task covers **structural integrity** (links, CTA unification,
related-articles block, undefined tokens). Editorial fact-checking — tax
percentages, IRS form numbers, fee tables, BOI/CRS/FATCA scope statements,
banking provider behaviour — lives in the dedicated audit
`docs/fact-check-2026.md`, which contains a per-article ficha for all
**100** Spanish base slugs and is the canonical source of truth for
factual claims. The "Fact-check" column of the table in §8 deep-links
each row to its ficha in that document, so the two reports together give
a full structural-plus-factual picture per article. The factual SOT
itself is `docs/banking-facts-2026.md`, referenced from every ficha.

## 8. Per-slug audit table

Legend: `Langs` is the six-letter availability mask
(`e n f d p c` for `es en fr de pt ca`; dash where the file is missing).
`Links`, `CTA`, `Undef`, `Related` are pass/fail signals derived from the
final-state corpus (✓ = clean, ✗ = needs editorial follow-up). `CTA`
requires the canonical calculator CTA pattern: an inline blockquote linking
to `/es#calculadora` for Spanish, and the `<!-- exentax:calc-cta-v1 -->`
marker pair for the other five languages.

This table is regenerated by `node scripts/blog-audit-table.mjs`.

| # | Slug | Langs | Links | CTA | Undef | Related | Fact-check |
|---|------|-------|-------|-----|-------|---------|------------|
| 1 | `amazon-ecommerce-llc-vender-online` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#amazon-ecommerce-llc-vender-online) |
| 2 | `auditoria-rapida-llc-12-puntos-30-minutos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#auditoria-rapida-llc-12-puntos-30-minutos) |
| 3 | `autonomo-espana-vs-llc-estados-unidos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#autonomo-espana-vs-llc-estados-unidos) |
| 4 | `autonomos-espana-por-que-dejar-de-serlo` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#autonomos-espana-por-que-dejar-de-serlo) |
| 5 | `bancos-vs-fintech-llc-donde-abrir-cuenta` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#bancos-vs-fintech-llc-donde-abrir-cuenta) |
| 6 | `boe-febrero-2020-llc-doctrina-administrativa` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#boe-febrero-2020-llc-doctrina-administrativa) |
| 7 | `boi-report-fincen-guia-completa-2026` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#boi-report-fincen-guia-completa-2026) |
| 8 | `bookkeeping-llc-paso-a-paso` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#bookkeeping-llc-paso-a-paso) |
| 9 | `cambiar-divisas-llc-mejores-opciones` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#cambiar-divisas-llc-mejores-opciones) |
| 10 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad) |
| 11 | `caminos-legales-minimos-impuestos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#caminos-legales-minimos-impuestos) |
| 12 | `como-disolver-cerrar-llc-paso-a-paso` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#como-disolver-cerrar-llc-paso-a-paso) |
| 13 | `como-obtener-itin-numero-fiscal-irs` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#como-obtener-itin-numero-fiscal-irs) |
| 14 | `como-operar-llc-dia-a-dia` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#como-operar-llc-dia-a-dia) |
| 15 | `constituir-llc-proceso-paso-a-paso` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#constituir-llc-proceso-paso-a-paso) |
| 16 | `convenio-doble-imposicion-usa-espana-llc` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#convenio-doble-imposicion-usa-espana-llc) |
| 17 | `crear-empresa-andorra-ventajas` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#crear-empresa-andorra-ventajas) |
| 18 | `criptomonedas-trading-llc-impuestos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#criptomonedas-trading-llc-impuestos) |
| 19 | `crs-cuentas-bancarias-llc-intercambio-informacion` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#crs-cuentas-bancarias-llc-intercambio-informacion) |
| 20 | `crs-residentes-espana-latam-implicaciones` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#crs-residentes-espana-latam-implicaciones) |
| 21 | `cuanto-cuesta-constituir-llc` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#cuanto-cuesta-constituir-llc) |
| 22 | `cuenta-bancaria-mercury-llc-extranjero` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#cuenta-bancaria-mercury-llc-extranjero) |
| 23 | `cuentas-bancarias-usa-reportan-hacienda-verdad` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#cuentas-bancarias-usa-reportan-hacienda-verdad) |
| 24 | `dac7-plataformas-digitales-reporting-2026` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#dac7-plataformas-digitales-reporting-2026) |
| 25 | `dac8-criptomonedas-reporting-fiscal-2026` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#dac8-criptomonedas-reporting-fiscal-2026) |
| 26 | `diseno-estructura-fiscal-internacional-solida` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#diseno-estructura-fiscal-internacional-solida) |
| 27 | `documentar-separacion-fondos-llc-historial` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#documentar-separacion-fondos-llc-historial) |
| 28 | `documentos-llc-cuales-necesitas` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#documentos-llc-cuales-necesitas) |
| 29 | `dubai-uae-mito-no-impuestos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#dubai-uae-mito-no-impuestos) |
| 30 | `due-diligence-bancario-llc-americana` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#due-diligence-bancario-llc-americana) |
| 31 | `ein-numero-fiscal-llc-como-obtenerlo` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#ein-numero-fiscal-llc-como-obtenerlo) |
| 32 | `empresa-bulgaria-10-tributacion` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#empresa-bulgaria-10-tributacion) |
| 33 | `empresa-panama-fiscalidad-residencia` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#empresa-panama-fiscalidad-residencia) |
| 34 | `empresa-reino-unido-uk-ltd` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#empresa-reino-unido-uk-ltd) |
| 35 | `errores-criticos-llc-ya-constituida` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#errores-criticos-llc-ya-constituida) |
| 36 | `errores-fiscales-freelancers-espanoles` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#errores-fiscales-freelancers-espanoles) |
| 37 | `escalar-negocio-digital-llc-americana` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#escalar-negocio-digital-llc-americana) |
| 38 | `estructura-fiscal-optima-freelancer-internacional` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#estructura-fiscal-optima-freelancer-internacional) |
| 39 | `estructura-offshore-beneficios-riesgos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#estructura-offshore-beneficios-riesgos) |
| 40 | `evitar-bloqueos-mercury-wise-revolut` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#evitar-bloqueos-mercury-wise-revolut) |
| 41 | `exit-tax-espana-llc-cripto-interactive-brokers` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#exit-tax-espana-llc-cripto-interactive-brokers) |
| 42 | `extension-irs-form-1120-como-solicitarla` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#extension-irs-form-1120-como-solicitarla) |
| 43 | `fiscalidad-estonia-como-funciona` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#fiscalidad-estonia-como-funciona) |
| 44 | `fiscalidad-internacional-emprendedores-digitales` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#fiscalidad-internacional-emprendedores-digitales) |
| 45 | `fiscalidad-llc-por-pais-residencia` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#fiscalidad-llc-por-pais-residencia) |
| 46 | `fiscalidad-socios-llc-cambio-residencia-mid-year` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#fiscalidad-socios-llc-cambio-residencia-mid-year) |
| 47 | `form-5472-que-es-como-presentarlo` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#form-5472-que-es-como-presentarlo) |
| 48 | `gastos-deducibles-llc-que-puedes-deducir` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#gastos-deducibles-llc-que-puedes-deducir) |
| 49 | `holding-empresarial-como-funciona` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#holding-empresarial-como-funciona) |
| 50 | `hong-kong-offshore-realidad` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#hong-kong-offshore-realidad) |
| 51 | `iban-swift-routing-number-que-son` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#iban-swift-routing-number-que-son) |
| 52 | `impuestos-clientes-internacionales-espana` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#impuestos-clientes-internacionales-espana) |
| 53 | `irs-1120-5472-que-son-cuando-aplican` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#irs-1120-5472-que-son-cuando-aplican) |
| 54 | `itin-ssn-que-son-como-obtenerlos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#itin-ssn-que-son-como-obtenerlos) |
| 55 | `iva-servicios-digitales-internacional` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#iva-servicios-digitales-internacional) |
| 56 | `justificar-origen-fondos-kyc-bancario-segunda-ronda` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#justificar-origen-fondos-kyc-bancario-segunda-ronda) |
| 57 | `llc-agencias-marketing-digital` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-agencias-marketing-digital) |
| 58 | `llc-alternativa-autonomo-espana` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-alternativa-autonomo-espana) |
| 59 | `llc-creadores-contenido-youtube-twitch` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-creadores-contenido-youtube-twitch) |
| 60 | `llc-desarrolladores-software-saas` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-desarrolladores-software-saas) |
| 61 | `llc-estados-unidos-guia-completa-2026` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-estados-unidos-guia-completa-2026) |
| 62 | `llc-interactive-brokers-invertir-bolsa-usa` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-interactive-brokers-invertir-bolsa-usa) |
| 63 | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais) |
| 64 | `llc-seguridad-juridica-proteccion-patrimonial` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-seguridad-juridica-proteccion-patrimonial) |
| 65 | `llc-unica-estructura-holding-cuando-como-cuesta` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#llc-unica-estructura-holding-cuando-como-cuesta) |
| 66 | `mantenimiento-anual-llc-obligaciones` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#mantenimiento-anual-llc-obligaciones) |
| 67 | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#modelo-720-721-residentes-espana-cuentas-cripto-extranjero) |
| 68 | `nomada-digital-residencia-fiscal` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#nomada-digital-residencia-fiscal) |
| 69 | `nuevo-mexico-vs-wyoming-vs-delaware` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#nuevo-mexico-vs-wyoming-vs-delaware) |
| 70 | `operating-agreement-llc-que-es` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#operating-agreement-llc-que-es) |
| 71 | `pagar-cero-impuestos-legalmente-llc` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#pagar-cero-impuestos-legalmente-llc) |
| 72 | `pasarelas-pago-llc-stripe-paypal-dodo` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#pasarelas-pago-llc-stripe-paypal-dodo) |
| 73 | `por-que-abrir-llc-estados-unidos-ventajas` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#por-que-abrir-llc-estados-unidos-ventajas) |
| 74 | `por-que-no-abrir-empresa-estonia` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#por-que-no-abrir-empresa-estonia) |
| 75 | `prevencion-blanqueo-capitales-llc` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#prevencion-blanqueo-capitales-llc) |
| 76 | `primer-mes-llc-que-esperar` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#primer-mes-llc-que-esperar) |
| 77 | `privacidad-llc-americana-secreto-ventaja` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#privacidad-llc-americana-secreto-ventaja) |
| 78 | `problemas-comunes-llc-como-evitarlos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#problemas-comunes-llc-como-evitarlos) |
| 79 | `que-es-irs-guia-duenos-llc` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#que-es-irs-guia-duenos-llc) |
| 80 | `que-pasa-si-no-presentas-5472-multas-irs` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#que-pasa-si-no-presentas-5472-multas-irs) |
| 81 | `recuperar-llc-boi-5472-atrasados-procedimiento` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#recuperar-llc-boi-5472-atrasados-procedimiento) |
| 82 | `registered-agent-que-es-por-que-necesitas` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#registered-agent-que-es-por-que-necesitas) |
| 83 | `reorganizar-banca-llc-mercury-relay-wise` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#reorganizar-banca-llc-mercury-relay-wise) |
| 84 | `residentes-no-residentes-llc-diferencias` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#residentes-no-residentes-llc-diferencias) |
| 85 | `revolut-business-crs-reporting-fiscal` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#revolut-business-crs-reporting-fiscal) |
| 86 | `riesgos-fiscales-mala-estructuracion-internacional` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#riesgos-fiscales-mala-estructuracion-internacional) |
| 87 | `separar-dinero-personal-llc-por-que-importa` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#separar-dinero-personal-llc-por-que-importa) |
| 88 | `single-member-multi-member-llc-implicaciones-fiscales` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#single-member-multi-member-llc-implicaciones-fiscales) |
| 89 | `tengo-llc-checklist-gestion-correcta` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#tengo-llc-checklist-gestion-correcta) |
| 90 | `testaferros-prestanombres-llc-ilegal-riesgos` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#testaferros-prestanombres-llc-ilegal-riesgos) |
| 91 | `tiempos-pagos-ach-wire-transfer` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#tiempos-pagos-ach-wire-transfer) |
| 92 | `tributacion-llc-segun-actividad-economica` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#tributacion-llc-segun-actividad-economica) |
| 93 | `tributacion-pass-through-llc-como-funciona` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#tributacion-pass-through-llc-como-funciona) |
| 94 | `vender-o-cerrar-llc-comparativa-practica` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#vender-o-cerrar-llc-comparativa-practica) |
| 95 | `ventajas-desventajas-llc-no-residentes` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#ventajas-desventajas-llc-no-residentes) |
| 96 | `visa-mastercard-reporting-tarjetas-hacienda` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#visa-mastercard-reporting-tarjetas-hacienda) |
| 97 | `w8-ben-y-w8-ben-e-guia-completa` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#w8-ben-y-w8-ben-e-guia-completa) |
| 98 | `wise-bancos-llc-stack-bancaria-completa` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#wise-bancos-llc-stack-bancaria-completa) |
| 99 | `wise-business-crs-reporting-fiscal` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#wise-business-crs-reporting-fiscal) |
| 100 | `wise-business-llc-guia` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#wise-business-llc-guia) |
| 101 | `wise-iban-llc-que-reporta-hacienda` | eefdpc | ✓ | ✓ | ✓ | ✓ | [ficha](./fact-check-2026.md#wise-iban-llc-que-reporta-hacienda) |

### CTA-column closure

The first run of this table reported 16 rows with `CTA = ✗` — non-Spanish
translations that were missing the `<!-- exentax:calc-cta-v1 -->`
mid-article block. The new `scripts/blog-fix-missing-calc-cta.mjs` injects
the localized blockquote (per-language copy) into the 36 affected files
(some base slugs were missing the marker in more than one language). After
that pass, every row in the table reports ✓ on every column, and
`scripts/check-blog-links.ts` enforces the marker contract going forward
(see §2 rule `missing-calc-cta`), so any regression breaks CI.

## 9. Out of scope (deliberate)

* Sources / "Fuentes" block consolidation is queued as a separate task and
  is not addressed here.
