# LOG-BATCH-4 — Limpieza anchor + paridad reforzada (10 slugs)

**Fecha:** 2026-04-25 (Sesión 21)
**Objetivo:** continuar el barrido sistemático 672 .ts: limpiar `exentax:review-anchor-v1` en 10 slugs nuevos × 6 idiomas (60 archivos) y reforzar paridad en idiomas con ratio <0.85 mediante bloques locales verificados.

---

## Resultado audit

| Métrica | Antes (LOG-BATCH-3) | Después (LOG-BATCH-4) |
|---|---|---|
| Anchor pendiente (archivos) | 522 | **462** (−60) |
| Anchor pendiente (slugs únicos) | 87 | **77** (−10) |
| `low ratio` (script extended, threshold 0.70) | 0 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |

---

## Slugs trabajados (10)

Limpieza bulk del marker `<!-- exentax:review-anchor-v1 -->` en los 6 idiomas (los marcadores `[REVISIÓN MANUAL]` inline ya estaban en 0 antes de este lote). En los slugs con DE/PT/CA <0.85 se añadieron además bloques locales para reforzar paridad.

| # | Slug | Limpieza | Bloque local adicional |
|---|------|---|---|
| 1 | `errores-fiscales-freelancers-espanoles` | 6 idiomas | — (todos ratio ≥ 0.91) |
| 2 | `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` | 6 idiomas | DE +300 palabras |
| 3 | `mantenimiento-anual-llc-obligaciones` | 6 idiomas | — (todos ratio ≥ 0.90) |
| 4 | `tiempos-pagos-ach-wire-transfer` | 6 idiomas | DE +275 / PT +121 / CA +105 |
| 5 | `wise-iban-llc-que-reporta-hacienda` | 6 idiomas | DE +99 |
| 6 | `nomada-digital-residencia-fiscal` | 6 idiomas | — (todos ratio ≥ 0.89) |
| 7 | `modulos-vs-estimacion-directa-2026` | 6 idiomas | — (todos ratio ≥ 0.90) |
| 8 | `errores-criticos-llc-ya-constituida` | 6 idiomas | — (DE 0.85 borderline, sin acción) |
| 9 | `llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais` | 6 idiomas | — (todos ratio ≥ 0.94) |
| 10 | `llc-seguridad-juridica-proteccion-patrimonial` | 6 idiomas | — (todos ratio ≥ 0.88) |

---

## Bloques locales insertados (verificación oficial)

### `modelo-720-721-residentes-espana-cuentas-cripto-extranjero` — DE
Cobertura DACH residentes en España con obligaciones Modelo 720/721:
- Art. 9 LIRPF (Ley 35/2006) residencia fiscal 183 días / centro vital
- Modelo 720 (>€50.000 cuentas/valores/inmuebles) + Modelo 721 (>€50.000 cripto), plazo **31 marzo**
- **STJUE C-788/19 27/01/2022** + **Ley 5/2022 9 marzo** régimen sancionador renovado (art. 198–199 LGT)
- DGT V0497-22, V1066-22 doctrina recuperación sanciones pre-2022
- DAC2 / CRS Dir. 2014/107/UE (Sparkasse, Erste Bank, UBS, PostFinance)
- BaFin (Coinbase Germany GmbH, Bitvavo) y FINMA (Bitcoin Suisse) plataformas reguladas
- **CARF + DAC8 (Dir. UE 2023/2226)** intercambio sistemático cripto desde 2026

### `tiempos-pagos-ach-wire-transfer` — DE / PT / CA
- **EU-Verordnung 2024/886 Instant Payments Regulation:** recepción obligatoria 9/10/2025, envío obligatorio 9/4/2026, sin recargo
- SEPA Credit Transfer D+1, SCT Inst <10 segundos 24/7
- DE: Wise Europe SA Bélgica → CRS reporting BZSt; Mercury Wire SWIFT MT103; Hausbank Devisenkonto + Anlage AUS; **§138 Abs. 2 AO** plazo 5 meses (31 mayo) saldo >€100.000; §379 AO sanción hasta €25.000
- DE Schweiz: FINMA Wise CH limitada; Stempelsteuer 1,5/3 ‰; MWStG art. 21 Abs. 2 Ziff. 19
- PT: Aviso 1/2022 BdP + Sistema CBE >USD 1.000.000
- CA: Andorra AFA, MoraBanc/Crèdit Andorrà/Andbank IBAN AD desde 2018

### `wise-iban-llc-que-reporta-hacienda` — DE
- Wise Europe SA Bélgica + NBB-Aufsicht (Nationale Bank von Belgien)
- **CRS DAC2** reporting belga → BZSt → Wohnsitzfinanzamt
- **§138 Abs. 2 AO** plazo 5 meses, umbral €100.000

---

## Reglas operativas aplicadas

- **Limpieza solo del marker comentario** (`<!-- exentax:review-anchor-v1 -->`); el contenido inline `[REVISIÓN MANUAL]` ya estaba purgado en sesiones previas.
- **Inserción correcta:** los 5 bloques locales se insertaron ANTES de `<!-- exentax:cta-v1 -->`, no antes del CTA anidado `cta-conv-v1`.
- **Independencia por idioma:** cada bloque local cubre la problemática del país/jurisdicción de la lengua, no es traducción del ES.
- **Verificación previa a la escritura:** cada cifra, sección de ley o resolución se verificó contra fuente oficial (BOE, BMF, BdP, NBB, EU OJ, AFA Andorra).
- **CTAs canónicas mantenidas:** ES/PT/CA `/agendar`, EN `/book`, FR `/fr/reserver`, DE `/de/buchen`.

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0
  - low ratio: 0
  - untranslated paragraphs: 0

npm run blog:validate-all → OK 11/11
  ✓ consistency  ✓ content-lint  ✓ internal-links  ✓ locale-link-leak
  ✓ cta  ✓ data  ✓ sources  ✓ faq-jsonld  ✓ sitemap
  ✓ sitemap-bcp47  ✓ masterpiece-audit

npm run i18n:check → PASS
  - 0 missing / 0 extra / 0 empty / 0 placeholder mismatches
```
