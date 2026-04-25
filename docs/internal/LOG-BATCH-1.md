# LOG-BATCH-1 — Reescritura blog Exentax (lote 1, ronda 1)

**Fecha:** 2026-04-25
**Alcance:** 5 slugs × 6 idiomas = 30 archivos `.ts` (cuerpo y metadata SEO).
**Reglas aplicadas:**
- Mín. 2.000 palabras netas por idioma (excluyendo HTML, comentarios y marcado).
- Cada dato verificado contra fuentes oficiales (AEAT, BOE, HMRC, URSSAF, BMF, IRS, FinCEN, OECD) **antes** de escribir.
- Bloque `<!-- exentax:review-anchor-v1 -->` eliminado **solo tras verificación** explícita.
- Independencia por idioma: cada lengua incorpora la problemática local del lector tipo (no es traducción literal del ES).
- Marcadores `<!-- exentax:* -->` preservados byte-a-byte; bloques OPEN-ONLY (`banking-facts-v1`, `legal-facts-v1`, `legal-refs-v1`) sin cierre.
- CTAs canónicos: ES/PT/CA `/agendar`, EN `/book`, FR `/fr/reserver`, DE `/de/buchen`. Trailing `cta-v1` alineado verbatim con `client/src/data/blog-cta-library.ts`.
- Validación final: `npm run blog:validate-all` → **11/11 OK**.

---

## Slug 1 — `llc-estados-unidos-guia-completa-2026`

**Acción:** limpieza (anchor + marcadores `[REVISIÓN MANUAL]` inline) en los 6 idiomas.
**Verificaciones documentales:**
- FDIC depósito asegurado **250.000 USD** por depositante/banco.
- IRC §6038A(d) → multa **25.000 USD** por Form 5472 fuera de plazo.
- Treas. Reg. §301.7701-3 (*check-the-box*).
- C-Corp federal **21 %** (TCJA 2017).
- Modelo 720: RD 1065/2007 art. 42 bis + Ley 5/2022 (post-STJUE C-788/19, sanciones reconducidas a régimen general LGT).
- BOI Report: **FinCEN IFR 21/03/2025** (excluye LLCs formadas por no-residentes).
- Wyoming annual report **60 USD**, Delaware franchise tax **300 USD/año** vencimiento 1 jun, Nuevo México sin annual report.
- DAC6 (Dir. UE 2018/822), DAC7 (Dir. UE 2021/514), DAC8 (Dir. UE 2023/2226), Pillar Two (Dir. UE 2022/2523).

**Word counts (cuerpo neto):** ES 3688 · EN 3208 · FR 3733 · DE 3267 · PT 3225 · CA 3390.

---

## Slug 2 — `llc-alternativa-autonomo-espana`

**Acción:** limpieza (anchor + inline `[REVISIÓN MANUAL]`) en los 6 idiomas.
**Verificaciones documentales:** Ley 26/2014 IRPF (tramos 19/24/30/37/45/47 %), RDL 13/2022 cuotas RETA por ingresos reales, IVA 21 % Ley 37/1992 art. 90, Modelo 720 + Ley 5/2022, Form 5472 + IRC §6038A, Treas. Reg. §301.7701-3, IRC §7701(a)(30) residencia fiscal estadounidense.

**Word counts:** todos > 2.700 palabras por idioma.

---

## Slug 3 — `constituir-llc-proceso-paso-a-paso`

**Acción:** limpieza (anchor + inline) en los 6 idiomas.
**Verificaciones documentales:** EIN — Form SS-4 IRS (procedimiento extranjeros sin SSN/ITIN); Registered Agent obligatorio en los 50 estados; Wyoming LLC Act 1977 (primera jurisdicción US); BOI Report FinCEN IFR 21/03/2025; cuentas Mercury / Relay / Wise Business (no son bancos: BaaS over Choice Financial / Evolve / Bancorp), FDIC 250 k USD; pricing oficial Wyoming/NM/DE/FL/TX (filing fees + annual fees verificados directamente en SOS de cada estado).

**Word counts:** todos > 2.700 palabras por idioma.

---

## Slug 4 — `diferencia-llc-corporation-s-corp-c-corp`

**Acción:** REWRITE completo en los 6 idiomas. Eliminado claim "90 %" no verificable.
**Verificaciones documentales:**
- IRC **§1361** (S Corporation requirements; sólo accionistas U.S. citizens / resident aliens; máx. 100 accionistas; una sola clase de acciones).
- IRC **§1202** (QSBS — Qualified Small Business Stock; exclusión hasta 10 M USD o 10× base ajustada; mínimo 5 años de tenencia; sólo C-Corps).
- IRC **§11(b)** (C-Corp federal flat **21 %** TCJA 2017).
- IRC **§351** (transferencia libre de impuestos a una corporation a cambio de acciones).
- IRC **§6038A** + Treas. Reg. **§1.6038A-2** (Form 5472 para *25 % foreign-owned* y *foreign-owned disregarded entities*; sanción **25.000 USD** por formulario).
- Wyoming LLC Act 1977 (primera jurisdicción en reconocer la LLC).
- Treas. Reg. **§301.7701-3** (clasificación por defecto y *check-the-box* via Form 8832).
- CDI por país y sus protocolos.

**Localización por idioma — alternativas locales:**
- **ES**: SLU/SL bajo Ley 18/2022 (capital social 1 €), tramos IRPF Ley 26/2014, cuotas RETA RDL 13/2022.
- **EN (UK híbrido)**: Ltd vs sole trader; Personal Allowance **£12.570**; Class 4 NIC; Anson v HMRC [2015] UKSC 44; INTM180020.
- **FR**: micro-entrepreneur seuils **77.700 € / 188.700 €** (2024); SASU vs EURL; cotisations URSSAF.
- **DE**: GmbH (Stammkapital **25.000 €**), UG haftungsbeschränkt (capital **1 €**), Kleinunternehmer Schwellen **25.000 € / 100.000 €** (Reform 2025); Typenvergleich BMF 19.03.2004; AStG §§ 7-14.
- **PT**: recibos verdes (Segurança Social trabalhador independente **21,4 %**); Lda capital social **1 €**; **Brasil**: MEI plafond **81.000 BRL** (LC 123/2006 + LC 167/2019); Solução de Consulta COSIT 14/2018.
- **CA**: SLU + escala autonòmica catalana (Llei 5/2020, marginal màx. **25,5 %** a partir de 175 k €); Modelo 720/721; CDI Espanya-EUA.

**Word counts (cuerpo neto):** ES 2079 · EN 2136 · FR 2268 · DE 2059 · PT 2099 · CA 2159 — todos > 2.000 (rango 0,99-1,09 vs ES, alta independencia local).

**Post-fix CTA:** trailing `cta-v1` reajustado al patrón canónico `llc_state_compare` de `blog-cta-library.ts` en EN/FR/DE/PT (em-dash + URL `/en/services/`, `/fr/services/`, `/de/leistungen/`, `/pt/servicos/` según localización).

---

## Slug 5 — `residentes-no-residentes-llc-diferencias`

**Acción:** limpieza inicial (anchor + inline) en los 6 idiomas + expansión local FR/DE/PT/CA para llegar a ≥ 2.000 palabras netas.

**Verificaciones documentales (compartidas):** IRC §§871, 882 (FDAP, ECI), Treas. Reg. §1.6038A-1 + Form 5472 + Form 1120 pro-forma, FinCEN IFR 21/03/2025 (BOI exempción), CDI bilaterales por país.

**Bloques locales añadidos:**
- **FR — "Cas pratique pour un résident fiscal en France":** transparencia fiscal SMLLC (BOI-INT-DG-20-10), formulaire 2042-C-PRO, tramos IR 0/11/30/41/45 %, URSSAF 22-45 %, formulaire 3916 (sanción 1.500 €), CDI France-US 31/08/1994 (avenants 2004 y 2009).
- **DE — "Praxisfall für einen in Deutschland Steuerpflichtigen" + "Sonderfall Österreich und Schweiz":** Typenvergleich (BMF 19.03.2004), § 15 / § 18 EStG, Soli 5,5 %, Gewerbesteuer (hebesatz medio 400 %), AStG §§ 7-14 (umbral baja imposición < 25 %, post-reforma 2024 < 15 %), Anlage AUS, FATCA/BZSt, DBA D-USA 1989 + Protokoll 01/06/2006, EAS 3401/3413 Austria, Kreisschreiben Nr. 5 ESTV Suiza, DBA AT-USA (BGBl. III 6/1998), DBA CH-USA (SR 0.672.933.61, Protokoll 23/09/2009).
- **PT — "Caso prático para um residente fiscal em Portugal ou no Brasil":** IRS Categoria B, coeficiente 0,75 servicios, tipo IRS hasta 48 %, sobretasa solidariedade 5 %, Segurança Social 21,4 % sobre 70 % rendimento relevante, Anexo J Modelo 3 IRS (sanción 3.750 €), Solução de Consulta COSIT 14/2018, IN RFB 1.520/2014, Lei 12.973/2014, DCBE/CBE Banco Central do Brasil > 1 M USD.
- **CA — "Cas pràctic per a un resident fiscal a Catalunya":** DGT V0290-20 (febrer 2020) règim d'atribució de rendes art. 87 LIRPF, Modelo 100, escala autonòmica Llei 5/2020 (marginal màx. 25,5 % a 175 k €), Modelo 720 (Ley 5/2022 post-STJUE C-788/19), Modelo 721 (Ordre HFP/887/2023), Modelo 232, RETA RDL 13/2022 (230-590 €/mes), CDI Espanya-EUA (BOE 22/12/1990, Protocol 27/11/2019).

**Word counts finales (cuerpo neto):** ES 2145 · EN 2236 · FR 2261 · DE 2255 · PT 2019 · CA 2144 — todos > 2.000.

---

## Validación

```bash
cd exentax-web && npm run blog:validate-all
```

Resultado:

```
══ summary ════════════════════════════════════════════════════
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

Audit masterpiece: 672 artículos, score medio **99,4/100**.

---

## Notas operativas

- Counter local de palabras debe usar regex `/<[a-zA-Z\/!][^>]*>/g` (no `/<[^>]+>/g`) para no consumir desde `< 25 %` literal hasta el siguiente `>` real, lo que da subconteos de hasta 500 palabras menos.
- Todas las inserciones de bloques locales se hicieron con anchor explícito en el ## de cada idioma para mantener idempotencia.
- Nadie de los 5 slugs estaba en la lista priorizada de "ratio < 0,85" de `PENDING.md §0` ni en la sub-lista de `REWRITE-COMPLETE-REPORT.md §6.1`; este lote forma parte del barrido sistemático de los 112 slugs (672 .ts) descrito en el goal del proyecto, no de la lista de fallos puntuales heredados.
