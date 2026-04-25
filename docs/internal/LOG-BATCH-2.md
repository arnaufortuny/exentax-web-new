# LOG-BATCH-2 (Sesión 19, 2026-04-25)

Lote 2 ronda 1 del barrido sistemático 672 .ts. 5 slugs × 6 idiomas = 30 .ts trabajados.

Reglas aplicadas:
- 5 artículos/ronda, 1 artículo completo en 6 idiomas antes del siguiente
- Mínimo 2.000 palabras netas por idioma (HTML excluido)
- Verificación de cada dato contra fuente oficial ANTES de tocar el .ts
- Eliminación del bloque `<!-- exentax:review-anchor-v1 -->...<!-- /exentax:review-anchor-v1 -->` solo tras verificar
- Eliminación de marcadores `[REVISIÓN MANUAL]` / `[MANUAL REVIEW]` / `[RÉVISION MANUELLE]` / `[REDAKTIONELLE PRÜFUNG]` / `[REVISÃO MANUAL]` inline
- Independencia por idioma (no traducciones literales): cada localización tiene su propia problemática local
- Validación final con `npm run blog:validate-all` 11/11 OK

## Slug 1 — `amazon-ecommerce-llc-vender-online`

Limpieza anchor + inline en los 6 idiomas. Sin reescritura sustantiva (todos los idiomas ya superaban 2.000 palabras antes de la limpieza).

**Verificaciones contra fuente oficial:**
- Amazon Seller Central US Pro plan $39.99/mes (Amazon Seller Central pricing)
- Stripe US tarifa estándar 2.9 % + $0.30 por tarjeta (stripe.com/pricing)
- Treas. Reg. §301.7701-3 (check-the-box)
- IRC §864 (effectively connected income / ECI)
- IRC §882 (tax on income of foreign corporations connected with US business)
- Form 5472 + Form 1120 pro-forma; IRC §6038A (sanción 25.000 USD)
- South Dakota v. Wayfair, Inc. 138 S. Ct. 2080 (2018) — economic nexus
- Threshold inicial Wayfair: $100K en ventas o 200 transacciones/año (umbral del estatuto de Dakota del Sur; varía por estado)
- 24 estados Marketplace Facilitator Laws (compilado state.gov tax administrators)
- Directiva 2006/112/CE IVA — art. 14 bis (deemed supplier marketplaces)
- Reglamento de Ejecución (UE) 282/2011
- OSS / IOSS Modelo 369 AEAT
- Real Decreto 117/2024 (transposición DAC7 — Directiva UE 2021/514) BOE 07/02/2024
- Ley 35/2006 LIRPF — art. 100 (transparencia fiscal internacional)
- Ley 27/2014 LIS
- Ley 37/1992 IVA
- FDIC sweep network Mercury (Choice Financial Group / Evolve Bank & Trust / Column N.A. en cuentas legacy)
- Wise Europe SA (Bélgica, EMI con licencia NBB) — sujeta a CRS
- Wallester Estonia EMI

**Word count final (palabras netas, excluyendo HTML/comentarios):**
- ES: 2291
- EN: 2554
- FR: 2258
- DE: 2052 (post-fix: añadido párrafo DAC7 / Dir. UE 2021/514 para superar umbral 2.000 desde 1998)
- PT: 2141
- CA: 2166

## Slug 2 — `auditoria-rapida-llc-12-puntos-30-minutos`

Limpieza anchor + inline en los 6 idiomas. Sin reescritura: todos > 2.150 palabras antes de la limpieza.

**Word count final:**
- ES: 2606 · EN: 2353 · FR: 2481 · DE: 2152 · PT: 2630 · CA: 2679

## Slug 3 — `bancos-vs-fintech-llc-donde-abrir-cuenta`

Limpieza anchor + inline en los 6 idiomas. Sin reescritura: todos > 2.080 palabras post-limpieza.

**Word count final:**
- ES: 2382 · EN: 2081 · FR: 2425 · DE: 2159 · PT: 2366 · CA: 2368

## Slug 4 — `boi-report-fincen-guia-completa-2026`

Limpieza anchor + inline en los 6 idiomas + expansión local en 5 idiomas (todos menos ES) con bloque "BOI y obligaciones declarativas locales" + FAQ específica por jurisdicción para superar el umbral de 2.000 palabras.

**Verificaciones contra fuente oficial — núcleo BOI:**
- FinCEN Interim Final Rule 21/03/2025 (Federal Register) — restringe BOI a "foreign reporting companies" (entidades formadas bajo ley extranjera y registradas en un estado para hacer negocios)
- Excluye explícitamente: entidades formadas en US (incluidas LLC Wyoming/Delaware) y US persons como beneficial owners
- 31 U.S.C. §5336 (Corporate Transparency Act, Public Law 116-283 §6403)
- Sanciones civiles: 591 USD/día (ajustado por inflación 2026)
- Sanciones penales: hasta 10.000 USD y/o 2 años de prisión por incumplimiento doloso
- Portal oficial: boiefiling.fincen.gov
- Treas. Reg. §1.6038A-1 (Form 5472)
- IRC §6038A (sanción 25.000 USD)

**Expansión local EN — perspectiva análisis Federal Register:**
- 3 categorías post-IFR 21/03/2025: (a) Wyoming/Delaware LLC con socio no residente → fuera; (b) UK Limited / Swiss GmbH registrada como foreign LLC en California → dentro; (c) US person como beneficial owner de foreign reporting company → su data ya no se recoge
- Indicación de seguimiento: rule "interim", FinCEN abriendo period de public comments

**Expansión local FR — Francia:**
- art. 209 B CGI (sociétés étrangères contrôlées; > 50 % de participación + jurisdicción a fiscalité privilégiée)
- art. 1649 A bis CGI + formulario 3916 / 3916 bis (déclaration des comptes à l'étranger)
- art. 123 bis CGI (estructuras > 10 % en État à régime fiscal privilégié)
- Impacto sobre cuentas Mercury / Wise USD / Relay como activos del residente francés
- CRS via fintech europeas (Wise Europe SA Bélgica, Revolut Bank UAB Lituania)

**Expansión local DE — Alemania + Austria:**
- §§7-14 AStG (Außensteuergesetz, Hinzurechnungsbesteuerung CFC; umbral de tributación efectiva < 15 %)
- §138 Abs. 2 AO (Mitwirkungspflicht / Anzeigepflicht 5 meses; participación ≥ 10 %; portal BZSt)
- §5 GwG (Geldwäschegesetz — Transparenzregister, Bundesanzeiger Verlag)
- Austria: §10a KStG + WiEReG (Wirtschaftliche Eigentümer Registergesetz)
- Art. 44 MwSt-RL (OSS para servicios B2C UE) + §13b UStG (Reverse-Charge B2B)

**Expansión local PT — Portugal + Brasil:**
- art. 66.º CIRC (imputação de lucros sociedades não residentes em regime fiscal claramente mais favorável; participación ≥ 25 %, 10 % en casos específicos)
- art. 63.º-A LGT (comunicação de contas em instituições financeiras estrangeiras)
- Portaria 365/2007 — Modelo 38 (transferências para fora da UE)
- Brasil: Lei 14.754/2023 (tributação automática anual offshore controladas, IRPF 15 %)
- Sistema CBE (Capitais Brasileiros no Exterior) — declaração anual > USD 1 M, trimestral > USD 100 M
- Régime NHR / IFICI: Modelo 3 + Anexo J + comunicação de contas mantidos

**Expansión local CA — Catalunya + Andorra:**
- art. 100 LIRPF (Ley 35/2006) — transparencia fiscal internacional (> 50 % + tributación efectiva < 75 % de la española)
- RD 117/2024 (DAC7 transpuesta) BOE 07/02/2024 — plataformas reportan ventas
- Ley 7/2012 + DA 18a LGT — Modelo 720 (umbral 50.000 € por categoría)
- Andorra: Llei 5/2014 IRPF art. 49 (transparencia fiscal; > 50 % + fiscalidad efectiva < 50 % de la andorrana)
- Llei 95/2010 (intercambio de información Andorra)
- CDI Andorra-EUA en vigor 01/01/2024
- STJUE C-788/19 27/01/2022 (sanciones desproporcionadas Modelo 720; obligación formal subsiste)

**Word count final (post-expansión):**
- ES: 2144 · EN: 2183 · FR: 2217 · DE: 2009 · PT: 2160 · CA: 2260 — todos > 2.000

## Slug 5 — `bookkeeping-llc-paso-a-paso`

Limpieza anchor + inline en los 6 idiomas. Sin reescritura: todos > 3.300 palabras post-limpieza.

**Word count final:**
- ES: 3833 · EN: 3553 · FR: 3826 · DE: 3379 · PT: 3656 · CA: 3751

## Validación final

```
npm run blog:validate-all
✓ OK    consistency
✓ OK    content-lint
✓ OK    internal-links
✓ OK    locale-link-leak
✓ OK    cta
✓ OK    data
✓ OK    sources
✓ OK    faq-jsonld
✓ OK    sitemap
✓ OK    sitemap-bcp47
✓ OK    masterpiece-audit
blog-validate-all: OK (11 steps)
```

Masterpiece audit: 672 artículos · score medio 99,4/100.

## Resumen del lote

| # | Slug | Tipo | WC ES | WC EN | WC FR | WC DE | WC PT | WC CA |
|---|---|---|---|---|---|---|---|---|
| 1 | amazon-ecommerce-llc-vender-online | Limpieza + 1 párrafo DE | 2291 | 2554 | 2258 | 2052 | 2141 | 2166 |
| 2 | auditoria-rapida-llc-12-puntos-30-minutos | Limpieza | 2606 | 2353 | 2481 | 2152 | 2630 | 2679 |
| 3 | bancos-vs-fintech-llc-donde-abrir-cuenta | Limpieza | 2382 | 2081 | 2425 | 2159 | 2366 | 2368 |
| 4 | boi-report-fincen-guia-completa-2026 | Limpieza + expansión 5 idiomas | 2144 | 2183 | 2217 | 2009 | 2160 | 2260 |
| 5 | bookkeeping-llc-paso-a-paso | Limpieza | 3833 | 3553 | 3826 | 3379 | 3656 | 3751 |

Lote cerrado.
