# LOG-BATCH-9 — Cluster fiscalidad LLC + verticales (10 slugs)

**Fecha:** 2026-04-25 (Sesión 26)
**Objetivo:** procesar 10 slugs del cluster fiscalidad LLC (tributación por actividad, pass-through, fiscalidad por país, cambio de residencia mid-year, ventajas no residentes, gastos deducibles) y verticales sectoriales (creadores YouTube/Twitch, desarrolladores SaaS, agencias marketing, Interactive Brokers).

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 222 | **162** (−60) |
| Anchor pendiente (slugs únicos) | 37 | **27** (−10) |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |

---

## Slugs procesados

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `tributacion-llc-segun-actividad-economica` | 6 idiomas | EN +144 |
| 2 | `tributacion-pass-through-llc-como-funciona` | 6 idiomas | — |
| 3 | `fiscalidad-llc-por-pais-residencia` | 6 idiomas | — |
| 4 | `fiscalidad-socios-llc-cambio-residencia-mid-year` | 6 idiomas | FR +224 / DE +353 / PT +420 / CA +442 |
| 5 | `ventajas-desventajas-llc-no-residentes` | 6 idiomas | DE +92 |
| 6 | `gastos-deducibles-llc-que-puedes-deducir` | 6 idiomas | — |
| 7 | `llc-creadores-contenido-youtube-twitch` | 6 idiomas | — |
| 8 | `llc-desarrolladores-software-saas` | 6 idiomas | — |
| 9 | `llc-agencias-marketing-digital` | 6 idiomas | — |
| 10 | `llc-interactive-brokers-invertir-bolsa-usa` | 6 idiomas | — |

Total bloques completos eliminados: 60. Total bloques locales insertados: 6.

---

## Bloques locales insertados (verificación oficial)

### `tributacion-llc-segun-actividad-economica` — EN +144
- HMRC SP 1/09; *Anson v HMRC* [2015] UKSC 44 (LLC fiscally opaque por defecto en UK); SA106 Foreign pages; UK/US DTA 2001 SI 2002/2848 art. 24; *South Dakota v. Wayfair* 138 S.Ct. 2080 (2018); IRC §864(b) trade or business; IRC §864(c) ECI; Form 1040-NR.

### `fiscalidad-socios-llc-cambio-residencia-mid-year`
- **FR +224**: art. 4 B CGI; BOI-IR-CHAMP-10-30; formularios 2042 + 2042-NR split-year; art. 167 bis CGI exit tax (umbral €800.000 / ≥50%); CDI Francia-USA 31/08/1994 art. 25 (BOI-INT-CVB-USA); BOFiP BOI-INT-DG-20-20-100 §50; formulario 2074-ETD seguimiento 15 años; art. L. 102 B LPF 6 años.
- **DE +353**: §1 EStG / §2 AStG / §6 AStG ATAD-Umsetzungsgesetz 25.06.2021 (BGBl. I 2021 S. 2035) en vigor 01.01.2022; BMF 19.03.2004 BStBl. I 2004 S. 411 Typenvergleich; participaciones ≥ 1 %; stundung 7 años + Sicherheitsleistung; §17 EStG / §3 Nr. 40 EStG Teileinkünfteverfahren; §2 Abs. 7 Satz 3 EStG splitting; §49 EStG; DBA D-USA BGBl. II 1991 S. 354 + Protokoll 2006 art. 4 Tie-Breaker / art. 23 Anrechnung / art. 1 Abs. 4 Saving Clause; §50d Abs. 8 EStG; Anlage AUS; §147 AO 10 años; AT §27 Abs. 6 Z 1 lit. b EStG; CH Art. 18 DBG SR 642.11.
- **PT +420**: Lei 82-E/2014 introduce split-year; art. 16.º n.º 3 CIRS; art. 16.º n.º 1 CIRS criterios residencia; Lei 56/2023 Mais Habitação extingue RNH para nuevas inscripciones desde 01/01/2024; nuevo art. 58.º-A EBF IFICI 20% / 10 años; Portaria 12/2010 actividades alto valor añadido; art. 10.º-A CIRS exit tax + diferimento UE/EEE / EUA garantia; CDI PT-EUA Decreto 73/95 26/10 art. 4.º + 23.º + Saving Clause art. 1.º n.º 3; art. 130.º CIRS 10 años; Brasil Lei 9.718/98 + IN RFB 208/2002 CSDP/DSDP.
- **CA +442**: art. 9 LIRPF Llei 35/2006 (no split-year en Espanya); CDI Espanya-EUA Instrument 22/12/1990 + Protocol 14/01/2013 BOE 23/10/2019 art. 24; Modelo 030 OM HAC/277/2018 30 días; Modelos 247/248; art. 95 bis LIRPF Llei 26/2014 exit tax (10 de 15 ejercicios + valor mercado >€4M o ≥25% + €1M); diferimento UE/EEE automático / EUA con garantia (art. 95 bis.5 LIRPF); DGT V0290-20; Andorra Llei 5/2014 IRPF + Llei 6/2018; CDI Andorra-Espanya BOE 07/12/2015 Quartiat Convengut; nuevo régimen Llei 12/2024 5% / 5 años para residentes alto valor añadido; art. 32 Codi Comerç andorrà 6 años; art. 35 LGT andorrana.

### `ventajas-desventajas-llc-no-residentes` — DE +92
- §49 Abs. 1 Nr. 2 EStG ECI; DBA D-USA art. 7 (beneficios empresariales sin Betriebsstätte); LOB Art. 28 DBA tests (Aktiengesellschaft, Eigentums + Basiserosionstest, Active Trade or Business); W-8BEN-E Chapter 3 + 4 FATCA.

---

## Reglas operativas aplicadas

- **Limpieza de bloque completo:** regex DOTALL.
- **Inserción correcta:** bloques locales insertados ANTES de `<!-- exentax:cta-v1 -->`.
- **Independencia por idioma:** cada bloque cubre la jurisdicción del idioma con normativa local.
- **Verificación previa a la escritura:** cada cifra/ley/resolución contra fuente oficial.
- **Nota validación sitemap:** el step `sitemap` requiere el servidor `npm run dev` en marcha (puerto 5000). Tras reinicio del workflow, validación 11/11 OK.

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0 / low ratio: 0 / untranslated: 0

npm run blog:validate-all → OK 11/11
npm run i18n:check → PASS
```

---

## Backlog restante

- **27 slugs únicos × 6 idiomas = 162 archivos** con `exentax:review-anchor-v1` aún sin barrido formal.
- A ritmo de 10 slugs por lote: ~3 lotes adicionales para cierre completo.
