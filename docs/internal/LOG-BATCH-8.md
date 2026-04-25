# LOG-BATCH-8 — Cluster gestión operativa LLC + costes/disolución (10 slugs)

**Fecha:** 2026-04-25 (Sesión 25)
**Objetivo:** procesar 10 slugs nuevos del cluster temático gestión operativa LLC + costes + disolución + documentación con limpieza completa de bloque `exentax:review-anchor-v1` y refuerzo de paridad lingüística cuando sea necesario. Incluye también la **corrección retrospectiva** de los 4 bloques de LOG-BATCH-7 que mencionaban Mercury vía Choice + Evolve, ahora actualizados a la realidad operativa actual: **Mercury vía Column N.A. + Choice Financial Group**.

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| Anchor pendiente (archivos) | 282 | **222** (−60) |
| Anchor pendiente (slugs únicos) | 47 | **37** (−10) |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |

---

## Slugs procesados

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `como-operar-llc-dia-a-dia` | 6 idiomas | — (todos ratios ≥ 0.86) |
| 2 | `primer-mes-llc-que-esperar` | 6 idiomas | DE +111 |
| 3 | `tengo-llc-checklist-gestion-correcta` | 6 idiomas | DE +78 |
| 4 | `documentos-llc-cuales-necesitas` | 6 idiomas | — (todos ratios ≥ 0.88) |
| 5 | `cuanto-cuesta-constituir-llc` | 6 idiomas | — (todos ratios ≥ 0.87) |
| 6 | `como-disolver-cerrar-llc-paso-a-paso` | 6 idiomas | — (todos ratios ≥ 0.88) |
| 7 | `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` | 6 idiomas | DE +131 |
| 8 | `separar-dinero-personal-llc-por-que-importa` | 6 idiomas | DE +116 / PT +116 |
| 9 | `documentar-separacion-fondos-llc-historial` | 6 idiomas | FR +165 / DE +257 / PT +285 / CA +287 |
| 10 | `problemas-comunes-llc-como-evitarlos` | 6 idiomas | DE +70 |

Total bloques completos eliminados: 60. Total bloques locales insertados: 10.

---

## Corrección retrospectiva LOG-BATCH-7 — Mercury partner banks

Tras señalamiento del usuario, se han actualizado los **4 bloques wise-bancos-llc-stack-bancaria-completa (FR, DE, PT, CA)** del LOG-BATCH-7 sustituyendo la mención obsoleta a **Choice Financial Group + Evolve Bank & Trust** por la realidad operativa actual: **Mercury opera a través de Column N.A. y Choice Financial Group (FDIC #14583)**. Mercury rescindió su relación con Evolve Bank & Trust en 2024 tras los problemas de Synapse y desde entonces opera con Column N.A. (banco con licencia bancaria propia adquirido por Coinbase fundadores) como entidad principal y mantiene Choice Financial Group como secundaria. La cobertura FDIC sigue garantizada en USD 250.000 por depositante y categoría según 12 CFR §330.

---

## Bloques locales insertados (verificación oficial)

### `primer-mes-llc-que-esperar` — DE +111
- §138 Abs. 2 Nr. 2 AO Mitteilung 1 mes; §379 AO €25.000; §§19-20 GwG Transparenzregister BGBl. I 2017 S. 1822; BZSt DAC6; AT WiEReG BGBl. I Nr. 136/2017; CH Art. 4 GwG SR 955.0

### `tengo-llc-checklist-gestion-correcta` — DE +78
- Anlage AUS; §138 Abs. 2 AO; §§19-20 GwG; AT WiEReG (4 semanas); CH AIA-ESTV; §147 AO 10 años buchführung; §132 BAO AT 7 años

### `cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad` — DE +131
- Continuidad fecha de constitución + Good Standing; §138 Abs. 2 AO no se reactiva; Transparenzregister no requiere reentrada; CTA §6403 FinCEN BOI sanción USD 591/día desde 01.01.2024; AT §109 BAO; CH AIA continuidad

### `separar-dinero-personal-llc-por-que-importa`
- **DE +116**: piercing the corporate veil (*Kinney Shoe Corp. v. Polan*, 939 F.2d 209, 4th Cir. 1991); BGH II ZR 178/99 13.12.2004 Bremer Vulkan + II ZR 256/02 25.07.2005 KBV; §13 Abs. 2 GmbHG Durchgriffshaftung; §39 Abs. 2 Nr. 1 AO; AT §22 BAO
- **PT +116**: *Kinney Shoe v. Polan*; art. 84.º CSC desconsideração da personalidade jurídica; art. 6.º CIRC transparência; ficha doutrinária 2018003278 AT; STJ 03/02/2009 processo 08A3991

### `documentar-separacion-fondos-llc-historial`
- **FR +165**: *Kinney Shoe v. Polan*; art. L. 123-12 Code de commerce; art. 54 + 95 CGI; formulaires 2065/2035 + 2042-C-PRO; abus de droit fiscal art. L. 64 LPF + majoration 80 % + art. 1727 CGI; conservación 6 años art. L. 102 B LPF
- **DE +257**: BMF 19.03.2004 Typenvergleich; §238 HGB + §140 AO + GoB; §264 HGB / §5 EStG vs §4 Abs. 1/3 EStG; §147 AO 10/6 años; §379 AO + §370 AO; §39 Abs. 2 Nr. 1 AO Zurechnung; AT §§124-126 BAO 7 años + §22 BAO; CH Art. 957a + 958f OR 10 años + Art. 18 DBG SR 642.11
- **PT +285**: *Kinney Shoe v. Polan*; art. 6.º CIRC + ficha 2018003278 AT; art. 28.º CIRS contabilidade organizada €200.000 + DL 158/2009 SNC; art. 130.º CIRS / art. 123.º CIRC 10 años; art. 38.º CIRC cláusula geral antiabuso; tasas IRS 48 % + derrama estadual 9 % + municipal 1,5 %; art. 104.º RGIT 1-5 años; Brasil art. 51 Lei 9.430/96 + IN RFB 1.520/2014 + DIRPF código 31 + COSIT 14/2018
- **CA +287**: *Kinney Shoe v. Polan*; art. 100 LIRPF TFI; DGT V0290-20; art. 66 LGT Llei 58/2003 4 años; art. 30 Codi Comerç 6 años; art. 15 LGT conflicte + art. 16 LGT simulació + arts. 191-194 LGT 50-150 %; art. 305 CP delicte fiscal €120.000; Andorra Llei 95/2010 IS + art. 32 Codi Comerç andorrà 6 años; Llei 14/2017 CDD €15.000

### `problemas-comunes-llc-como-evitarlos` — DE +70
- §138 Abs. 2 AO ≥10 %; §§7-14 AStG CFC; Anlage AUS; AT §109 BAO + WiEReG; CH Art. 125 DBG + AIA SR 653.1

---

## Reglas operativas aplicadas

- **Limpieza de bloque completo:** regex DOTALL.
- **Inserción correcta:** bloques locales insertados ANTES de `<!-- exentax:cta-v1 -->`.
- **Corrección de hechos verificables:** Mercury partner banks actualizado a Column N.A. + Choice tras señalamiento del usuario.
- **Independencia por idioma:** cada bloque cubre la jurisdicción del idioma con normativa local.
- **Verificación previa a la escritura:** cada cifra/ley/resolución contra fuente oficial.

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

- **37 slugs únicos × 6 idiomas = 222 archivos** con `exentax:review-anchor-v1` aún sin barrido formal.
- A ritmo de 10 slugs por lote: ~4 lotes adicionales para cierre completo.
