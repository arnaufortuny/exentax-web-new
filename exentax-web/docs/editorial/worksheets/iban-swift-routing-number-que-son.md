# Worksheet — `iban-swift-routing-number-que-son`

> Sprint #6 · Tipo: **rewrite-completo** · Score: 6 · WC actual: 2376  
> Categoría: Operativa · Verdict: FALLA (datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `Operativa-LLC`

## Título y meta SEO actuales

- **Title:** IBAN, SWIFT y Routing Number: qué son y cuándo usarlos
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `IBAN, SWIFT y Routing Number: qué son y cuándo usarlos` · `Análisis práctico de iban, swift y routing number: qué son y cuándo usarlos con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equipo E…`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.
- **Candidato metaTitle (55ch):** `IBAN, SWIFT y routing number: el mapa real EE.UU. vs UE`
- **Candidato metaDescription (138ch):** `EE. UU. nunca adoptó IBAN: routing 9 dígitos + account, SWIFT sólo en wires, IBAN sintético de Wise y por qué ACH no existe internacional.`

## Primer párrafo actual (auditoría)

> Cuando empiezas a mover dinero con tu LLC, te vas a encontrar con tres siglas que aparecen una y otra vez: **IBAN**, **SWIFT** (o BIC) y **Routing Number**. Son como la dirección postal de tu cuenta bancaria, pero para e…

## Gancho objetivo (rewrite-completo)

> **EE. UU. nunca adoptó IBAN: una cuenta US se identifica por routing number (9 dígitos, ABA del banco) + account number; el SWIFT/BIC sólo aparece en wires internacionales. Si tu banco europeo te exige IBAN para enviar a Mercury, no existe — pide el SWIFT de Choice Financial (CHFGUS44) y el account number.**

### Dato concreto a usar en los primeros 100 palabras

IBAN: estándar ISO 13616, 34 caracteres máx; obligatorio en SEPA (UE + UK + Suiza + Andorra + Mónaco). EE. UU. usa ABA routing (ANSI X9.9, 9 dígitos) + account number 8-17 dígitos; SWIFT/BIC ISO 9362 para mensajería interbancaria internacional. Mercury opera con Choice Financial (SWIFT: CHFGUS44).

## Esquema de secciones recomendado (12 bloques)

1. **Gancho** — opener con la frase del bloque "Gancho objetivo".
2. **Datos / Cifras / Tablas** — primer bloque cuantitativo (tabla, comparativa o lista de cifras).
3. **Comparativa por perfil** — para quién encaja qué.
4. **Visión a 24 meses o escenarios A/B/C** — proyección con números.
5. **El coste de NO hacerlo** — quantificar la inacción para este tema concreto.
6. **Lo que NO cambia** — mitos vs realidad / desambiguación.
7. **"¿Y si...?"** — 3-5 objeciones tipificadas (ver lista abajo).
8. **Hechos legales y de procedimiento** — bloque con citas oficiales.
9. **FAQ** — 6-8 preguntas reales del cliente.
10. **Qué incluye Exentax** — el servicio aplicable a este tema.
11. **Referencias normativas** — bloque con BOE / IRS / FinCEN / OCDE / etc.
12. **CTA** — bloque cerrado canónico (`book_consultation`).

## Objeciones a resolver (mínimo 3, ideal 5)

1. "¿Mi banco español acepta enviar wire sin IBAN?" → Sí: SEPA SWIFT permite enviar a cuenta US indicando SWIFT del beneficiary bank + account number en campo "beneficiary account"; coste 25-45€ + spread.
2. "¿Existe IBAN para US a través de Wise?" → Sí: Wise emite IBAN belga / inglés sintético ligado a tu cuenta USD; útil para cobrar de clientes UE pero no es cuenta US real.
3. "¿ACH y wire son lo mismo?" → No: ACH es batch interno US (1-3 días, $0-5), wire es Fedwire (mismo día, $20-45); ACH internacional no existe.
4. "¿Routing number es igual para ACH y wire?" → A veces no: algunos bancos publican un routing distinto para ACH y otro para wire (ej. JPMorgan); confirmar con el banco antes de compartir.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: irs.gov, boe.es.
- Expandir de 2376 a ≥2.500 palabras (faltan ~124). Añadir secciones específicas según el tema: FAQ con objeciones reales + caso real anonimizado + checklist accionable.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [FinCEN — BOI](https://www.fincen.gov/boi) — `<a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">FinCEN — BOI</a>`

## CTA recomendado

- **Cierre (post-article):** patrón `book_consultation` — copy verbatim en `docs/editorial/CTA-LIBRARY.md` (sección "book_consultation").
- **Mid-article:** variante `free_consult` — copy en `client/src/data/blog-mid-cta-copy.ts` (campo `free_consult`).
- **WhatsApp (`<!-- exentax:cta-conv-v1 -->`):** Opcional; sólo añadir si el tema toca dolor inmediato.

## Capa regulatoria por idioma

| Idioma | Capa específica obligatoria |
|---|---|
| ES | Marco español aplicable + Modelo correspondiente (303, 720, 721, 232) + LIRPF/LIS arts. relevantes + tratamiento RETA si aplica. |
| EN | US (IRS, FinCEN) + UK angle (HMRC, Anson v HMRC para LLC opaque/transparent debate). Para audiencia anglo-sajona neutra usa US-first; menciona UK cuando el tema toque foreign income / SA106. |
| FR | France métropolitaine (CGI 209 B CFC, formulaire 3916/3916-bis, URSSAF micro vs réel). Mencionar Bélgica (BNB), Suiza (Wertschriftenverzeichnis), Québec (T1135 ARC) cuando aplique al tema. |
| DE | DACH con tratamiento Sie/Ihr estricto: AStG §§7-14 (Hinzurechnungsbesteuerung), Anlage AUS, KStG. Mencionar Austria (BMF, EAS 3401/3422) y Suiza (ESTV, Wertschriftenverzeichnis) cuando aplique. |
| PT | PT-PT estricto (sin brasileñismos): CIRS art. 16.º (residência), CIRC art. 66.º (TFI), Modelo 58 do BdP. Mencionar Brasil (RFB, DCBE, e-Financeira, carnê-leão, DIRF) cuando el slug toque LATAM lusófono. |
| CA | Català oriental con vostè estricto: capa autonòmica IRPF (tram català), ATC, Model 720/721 amb el matís català de l'STJUE C-788/19. Mencionar Andorra (impostos.ad, IRPF Andorra art. 49) quan apliqui. |

> **Importante**: cada nativa debe tener ratio de palabras ≥ 0.85 vs ES y citar al menos 1 fuente oficial local del idioma (no sólo IRS/FinCEN).

## Checklist de cierre

- [ ] ES ≥ 2.500 palabras netas.
- [ ] 5 nativas ≥ 0.85 × ES.
- [ ] ≥ 3 dominios autoritativos distintos en ES.
- [ ] Exentax: 4-12 menciones distribuidas.
- [ ] Gancho concreto en primeros 100 palabras (cifra/objeción/pregunta).
- [ ] ≥ 3 secciones de objeción.
- [ ] CTA cierre patrón `book_consultation` verbatim.
- [ ] Mid-CTA variante `free_consult`.
- [ ] Meta SEO: mt ≤ 60, md 120-155 en los 6 idiomas.
- [ ] `relatedSlugs` revisado y alineado con cluster.
- [ ] PT-PT validado (`lint:pt-pt`).
- [ ] CA con vostè (`i18n:check`).
- [ ] DE con Sie/Ihr (`i18n:check`).
- [ ] Audit re-ejecutado sobre el slug → PASA.
- [ ] Entrada de cierre en `docs/editorial/SPRINT-LOG.md`.
