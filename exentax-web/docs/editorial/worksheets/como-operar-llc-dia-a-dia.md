# Worksheet — `como-operar-llc-dia-a-dia`

> Sprint #4 · Tipo: **rewrite-completo** · Score: 34 · WC actual: 3744  
> Categoría: Operativa · Verdict: FALLA (gancho-generico, objeciones-no-resueltas)  
> Tags temáticos: `LLC/IRS`

## Título y meta SEO actuales

- **Title:** Cómo operar tu LLC en el día a día: guía práctica
- **Meta auto-stub (referencia bruta del audit, NO usar literal):** `Cómo operar tu LLC en el día a día: guía práctica` · `Análisis práctico de cómo operar tu llc en el día a día: guía práctica con cifras oficiales 2026, plazos IRS/AEAT y la lectura honesta del equipo Exentax.`
- **Objetivo de meta a redactar:** title único 50-60ch con verbo+diferencial · description 130-150ch con cifra/plazo/jurisdicción y CTA implícita. Sin truncado con `…`.

## Primer párrafo actual (auditoría)

> Has dado el paso y tu LLC ya está constituida. Tienes tu EIN, tu cuenta en Mercury abierta y tus documentos en orden. Ahora empieza la parte divertida: operar tu negocio como un profesional.…

## Gancho objetivo (rewrite-completo)

> **Una LLC operativa real necesita 6 acciones recurrentes que la mayoría de servicios "all-in-one" no te explican: registered agent renewal anual, BOI updates en 30 días desde cualquier cambio, annual report estatal, separación bancaria estricta, contabilidad mensual y la presentación 1120/5472 antes del 15 de abril.**

### Dato concreto a usar en los primeros 100 palabras

Calendario operativo mínimo LLC no residente Wyoming: annual report $60 + tax license $0 (Wyoming) o $300 NM, registered agent $50-150/año, BOI report en 30 días desde cualquier cambio (FinCEN, sanción $591/día tras Inflation Adjustment 2024), Form 5472 + 1120 pro-forma antes del 15 de abril (extensión vía 7004 hasta 15 oct), $25,000 USD si se omite (IRC §6038A).

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

1. "¿Si no facturé este año tengo que presentar igual?" → Sí: Form 5472 se exige si hubo cualquier transacción reportable, incluido aporte inicial de capital o préstamos del owner.
2. "¿Necesito contable US si soy disregarded entity?" → Recomendable. La pro-forma 1120 + 5472 no es trivial; un error tipográfico activa el penalty de $25K automático sin posibilidad de waiver simple.
3. "¿Puedo tener mi LLC sin actividad un año y reactivarla después?" → Sí, manteniendo registered agent, annual report y BOI; "shelf LLC" en standing es habitual.
4. "¿La mezcla puntual de cuentas (1 charge personal con tarjeta de la LLC) rompe la limited liability?" → Riesgo de "piercing the corporate veil"; documentar como préstamo del owner y devolverlo en el siguiente extracto reduce el riesgo.


## Plan de corrección del audit

- Reescribir el primer párrafo (motivo: primer párrafo sin cifra, año o pregunta-objeción). Abrir con la objeción, cifra o pregunta más punzante del tema "Cómo operar tu LLC en el día a día: guía práctica" — no con definición ni con "En este artículo".
- Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te cuentan") que resuelvan las dudas reales del lector antes de que las formule. Convertir al menos un H2/H3 en pregunta directa.

## Fuentes oficiales aplicables (subset de SOURCES-BY-JURISDICTION)

- [IRS — LLC overview](https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc) — `<a href="https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc" target="_blank" rel="noopener">IRS — LLC overview</a>`
- [IRS — Form SS-4 (EIN)](https://www.irs.gov/forms-pubs/about-form-ss-4) — `<a href="https://www.irs.gov/forms-pubs/about-form-ss-4" target="_blank" rel="noopener">IRS — Form SS-4 (EIN)</a>`
- [IRS — Substantial presence test](https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test) — `<a href="https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test" target="_blank" rel="noopener">IRS — Substantial presence test</a>`

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
