# Worksheet — `bancos-vs-fintech-llc-donde-abrir-cuenta`

> Sprint #6 · Tipo: **rewrite-completo** · Score: 10 · WC actual: 2307  
> Categoría: Herramientas · Verdict: FALLA (datos-sin-fuente, longitud-insuficiente)  
> Tags temáticos: `LLC/IRS` · `Banca/Fintech`

## Título y meta SEO actuales

- **Title:** Bancos vs Fintech: dónde abrir la cuenta de tu LLC
- **Meta sugerida (60ch / 140ch):** `Bancos vs Fintech: dónde abrir la cuenta de tu LLC` · `Análisis práctico de bancos vs fintech: dónde abrir la cuenta de tu llc con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equipo Exentax.`

## Primer párrafo actual (auditoría)

> Cuando abres tu LLC, una de las primeras decisiones es dónde abrir la cuenta bancaria. Y aquí es donde empieza la confusión: Mercury no es un banco. Wise tampoco. Relay tampoco. Pero todos te ofrecen una cuenta, una tarj…

## Gancho objetivo (rewrite-completo)

> **Mercury, Relay y Brex no son bancos: son fintech respaldadas por Choice Financial / Evolve / Column. La diferencia importa el día que necesitas wire internacional > $50K, prueba de fondos para visa O-1 o evitar el cierre repentino de cuenta — y entonces JPMorgan, BofA o Chase siguen ganando.**

### Dato concreto a usar en los primeros 100 palabras

Mercury (Choice Financial), Relay (Thread Bank) y Brex (Column N.A.) son fintech con FDIC pass-through hasta $250K por banco partner; sólo bancos de balance directo (Chase, BofA, Wells Fargo) emiten cartas de referencia bancaria aceptadas por consulados y permiten cuentas de margen / líneas de crédito sin score US.

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

1. "¿Mercury cierra cuentas sin previo aviso?" → Documentado: 2022-2024 ola de cierres a LLCs single-member no residentes por revisión KYC; mantener segundo banco como backup operativo.
2. "¿Para qué necesito un banco real si Mercury me da ACH y wires?" → Para línea de crédito, depósito de garantía de oficina/contrato, tarjetas corporativas con APR razonable y aceptación universal de checks.
3. "¿Puedo abrir Chase/BofA siendo no residente sin viajar?" → No: Chase Business y BofA Business exigen presencia física en sucursal con pasaporte y EIN documents; algunos branches en Miami y NYC tienen procesos para no residentes.
4. "¿La FDIC me cubre igual en Mercury que en Chase?" → Hasta $250K sí, vía pass-through al banco partner; pero si Mercury (la fintech intermediaria) quiebra antes de que liquide al banco, hay riesgo operativo demostrado por el caso Synapse 2024.


## Plan de corrección del audit

- Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos (actualmente 2). Sugeridos según el tema: irs.gov, fincen.gov, fdic.gov.
- Expandir de 2307 a ≥2.500 palabras (faltan ~193). Añadir secciones específicas según el tema: estado óptimo + costes 24m + escenarios reales, comparativa multi-proveedor + KYC + casos de bloqueo.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`
- [FDIC — deposit insurance](https://www.fdic.gov) — `<a href="https://www.fdic.gov" target="_blank" rel="noopener">FDIC — deposit insurance</a>`
- [FinCEN — KYC / AML](https://www.fincen.gov) — `<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN — KYC / AML</a>`

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
