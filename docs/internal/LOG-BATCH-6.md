# LOG-BATCH-6 — Cluster IRS / setup legal LLC (10 slugs)

**Fecha:** 2026-04-25 (Sesión 23)
**Objetivo:** procesar 10 slugs nuevos del cluster temático IRS / setup legal LLC con limpieza completa de bloque `exentax:review-anchor-v1` y refuerzo de paridad lingüística cuando sea necesario.

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 402 | **342** (−60) |
| Anchor pendiente (slugs únicos) | 67 | **57** (−10) |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |

---

## Slugs procesados

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `ein-numero-fiscal-llc-como-obtenerlo` | 6 idiomas | — (todos ratios ≥ 0.91) |
| 2 | `itin-ssn-que-son-como-obtenerlos` | 6 idiomas | DE +155 / PT +121 / CA +118 |
| 3 | `como-obtener-itin-numero-fiscal-irs` | 6 idiomas | DE +70 |
| 4 | `form-5472-que-es-como-presentarlo` | 6 idiomas | — (todos ratios ≥ 0.91) |
| 5 | `que-pasa-si-no-presentas-5472-multas-irs` | 6 idiomas | DE +144 |
| 6 | `irs-1120-5472-que-son-cuando-aplican` | 6 idiomas | EN +80 / FR +82 / DE +259 / PT +143 / CA +87 |
| 7 | `extension-irs-form-1120-como-solicitarla` | 6 idiomas | — (todos ratios ≥ 0.90) |
| 8 | `operating-agreement-llc-que-es` | 6 idiomas | DE +82 |
| 9 | `registered-agent-que-es-por-que-necesitas` | 6 idiomas | — (todos ratios ≥ 0.85) |
| 10 | `nuevo-mexico-vs-wyoming-vs-delaware` | 6 idiomas | — (todos ratios ≥ 0.92) |

Total bloques completos eliminados: 60. Total bloques locales insertados: 11.

---

## Bloques locales insertados (verificación oficial)

### `itin-ssn-que-son-como-obtenerlos`
- **DE +155**: §139b AO Steuer-ID 11 dígitos BZSt; W-7 + IRS Pub 1915 rev. 11/2023; PATH Act 2015 §203 Pub. L. 114-113 renovación 3 años; CAAs en Berlin/München/Frankfurt; IR-2024-25 plazo 7-11 semanas; FATCA-IGA Modell 1 BGBl. II 2013 S. 1362; CRS BGBl. II 2015 S. 1630
- **PT +121**: NIF art. 2.º DL 463/79 + art. 9.º Portaria 386/98; Modelo 3 IRS Anexo J; conv. PT-EUA DR 152/95 1 de julho; intercâmbio CRS DAC2 desde 2017
- **CA +118**: NIE art. 206 RD 557/2011; NRT andorrà art. 106 Llei 21/2014; Modelo 720 RD 1065/2007; Modelo 232; conv. ESP-EUA BOE 22/12/1990 + Protocol 27/11/2019

### `como-obtener-itin-numero-fiscal-irs`
- **DE +70**: CAAs en DACH (Berlin/München/Frankfurt); plazo IR-2024-25 7-11 semanas; certified copy by issuing agency Bundesdruckerei; IRS Pub 1915 rev. 11/2023

### `que-pasa-si-no-presentas-5472-multas-irs`
- **DE +144**: §6038A(d)(1) IRC USD 25.000 inicial; Sec. 13301 TCJA Pub. L. 115-97 22/12/2017 incremento; USD 25.000 / 30 días; §370 AO Steuerhinterziehung; §90 Abs. 2 + §138 Abs. 2 AO Mitwirkungspflicht ≥10 %; AT §109 BAO + WiEReG BGBl. I Nr. 136/2017; CH AIA-Gesetz SR 653.1

### `irs-1120-5472-que-son-cuando-aplican`
- **EN +80**: HMRC SA106 Foreign Pages; Companies House CS01; INTM180030 check-the-box; CFC charges Part 9A TIOPA 2010
- **FR +82**: Treas. Reg. §1.6038A-1(c)(1) modifiée par TD 9796 12/12/2016 (LLCs disregarded como reporting corporations); art. 209 B CGI BOI-INT-DG-50-20 (CFC tributación efectiva <50 %)
- **DE +259**: IRC §6038A(b) + Treas. Reg. §1.6038A-2; TD 9796 12.12.2016 (single-member LLCs ≥25 % non-US-Person); plazo 15 abril + Form 7004 prórroga 6 meses → 15 octubre; §6038A(d)(1) USD 25.000 + Sec. 13301 TCJA Pub. L. 115-97 22.12.2017; USD 25.000 / 30 días; §138 Abs. 2 AO ≥10 % + §90 Abs. 2 AO + §§7-14 AStG ATAD BGBl. I 2021 4147 (Niedrigbesteuerung <15 %); AT §§109, 124-126 BAO + WiEReG €200.000; CH AIA-Gesetz SR 653.1 + FATCA Modell 2 SR 0.672.933.63 14.02.2013
- **PT +143**: Modelo 22 IRC + Anexo G entidades estrangeiras; art. 121.º CIRC obrigações declarativas; art. 66.º CIRC CFC; ficha doutrinária 2018003278 AT (transparência LLCs ≥2 sócios); DAC2 desde 2017
- **CA +87**: art. 100 LIRPF TFI; Modelo 232 OM HFP/816/2017; conveni Andorra-EUA en vigor 01/01/2024

### `operating-agreement-llc-que-es`
- **DE +82**: §3 + §15 Abs. 4 GmbHG notarielle Beurkundungspflicht DE; §4 öGmbHG AT; Wyo. Stat. §17-29-110 RULLCA; 6 Del. C. §18-101(9); Wyoming Chancery / Delaware Court of Chancery jurisprudencia

---

## Reglas operativas aplicadas

- **Limpieza de bloque completo:** regex DOTALL `<!-- exentax:review-anchor-v1 -->[\s\S]*?<!-- /exentax:review-anchor-v1 -->` — elimina apertura + contenido `<aside>` + cierre.
- **Inserción correcta:** bloques locales insertados ANTES de `<!-- exentax:cta-v1 -->`.
- **Independencia por idioma:** cada bloque cubre la jurisdicción del idioma con normativa local.
- **Verificación previa a la escritura:** cada cifra/ley/resolución contra fuente oficial (IRS, BZSt, BOFIP, AT, BdP, CGI, BOE, BAO, ESTV).

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0 / low ratio: 0 / untranslated: 0

npm run blog:validate-all → OK 11/11
npm run i18n:check → PASS (0 missing/extra/empty)
```

---

## Backlog restante

- **57 slugs únicos × 6 idiomas = 342 archivos** con `exentax:review-anchor-v1` aún sin barrido formal.
- A ritmo de 10 slugs por lote: ~6 lotes adicionales para cierre completo.
