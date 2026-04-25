# LOG-BATCH-3 — Cierre de slugs <0.70 paridad (10 + 3 slugs)

**Fecha:** 2026-04-25 (Sesión 20)
**Objetivo:** subir todos los slugs con ratio paridad <0.70 vs ES por encima del umbral, manteniendo independencia por idioma con problemática local verificada contra fuentes oficiales.

---

## Resultado audit

| Métrica | Antes | Después |
|---|---|---|
| `low ratio` (script extended, threshold 0.70 con esW>200) | 34 | **0** |
| `validate-all` (11 steps) | OK | **OK** |
| `i18n:check` (6 idiomas, 1552 claves) | PASS | **PASS** |
| `leakage` | 0 | 0 |
| `untranslated paragraphs` | 0 | 0 |

---

## Slugs trabajados (13)

### Bloque principal (10 slugs del lote pedido)

1. **`revolut-business-crs-reporting-fiscal`**
   - **Limpieza:** 6 idiomas (ES/EN/FR/DE/PT/CA) — eliminados `exentax:review-anchor-v1` + marcadores inline `[REVISIÓN MANUAL]`
   - **Verificación oficial:** CRS Sect. VIII.D.6/9, RD 1021/2015 art. 16, Lituania VMI, DAC2 Dir. 2014/107/UE, FATCA IRC §1471-1474, Form 5472/8832, RD 1558/2012, Modelo 720
   - **Bloques locales insertados:** FR (art. 1649 A bis CGI, formulario 3916-bis, art. 209 B / 123 bis CGI), DE (§138 AO, §§7-14 AStG ATAD 2021, §19/20 GwG Transparenzregister, FKAustG, EAS 3401/3422 Austria, §10a KStG), PT (Modelo 3 Anexo J, art. 119 RGIT, art. 66.º CIRC, Aviso 1/2022 BdP, BCB Resolução 281/2022, Lei 14.754/2023 IN RFB 2.180/2024), CA (Modelo 720 post-Llei 5/2022, STJUE C-788/19 27/01/2022, art. 100 LIRPF, Llei 5/2014 art. 49 IRPF andorrà, DTAA Andorra-EUA 01/01/2024)

2. **`exit-tax-espana-llc-cripto-interactive-brokers`**
   - **Verificación oficial:** art. 95 bis LIRPF (Ley 26/2014), TJUE C-503/14 (Comissão v Portugal exit tax), IRC §6038A, Treas. Reg. §301.7701-3
   - **Bloques locales:** EN (art. 95 bis Spain, DTAA Andorra-EUA), FR (art. 167 bis CGI Loi 2011, art. 244 bis B, art. 150 VH bis cripto), DE (§6 AStG ATAD 2021, EuGH Wächtler C-581/17, §17 EStG, BMF 19.03.2004 + 26.09.2014, KryptoStG §23 EStG Spekulationsfrist, Austria §27/6 EStG + §27a Z 2 cripto 27,5 %), PT (Lei 82-B/2014, arts. 10.º-A / 83.º-A CIRS, TJUE C-503/14, Lei 24-D/2022 cripto 28 %, IN RFB 208/2002 Brasil, Lei 14.754/2023), CA (art. 95 bis LIRPF, Model 721 RD 249/2023, conveni Andorra-Espanya BOE 7/12/2015, conveni Andorra-EUA 01/01/2024)

3. **`dac8-criptomonedas-reporting-fiscal-2026`**
   - **Verificación oficial:** Dir. UE 2023/2226 DAC8, Reg. UE 2023/1114 MiCA
   - **Bloques locales:** FR (AMF MiCA 30/12/2024, art. 1649 ter A CGI Loi 2024 art. 116, art. 1740 D CGI sanciones), DE (KStTG ref. 2024, BZSt, §23 EStG Spekulationsfrist 1 año + Freigrenze €1.000 desde 2024, BMF 10.05.2022 BStBl. I 2022 668, Austria §27a 27,5 %, §147 AO conservación 10 años), PT (DL transposição em curso DL 64/2016 + Lei 28/2020, Aviso 3/2021 BdP, Lei 24-D/2022 28 %, IN RFB 1.888/2019 Brasil, Lei 14.754/2023 IN 2.180/2024), CA (modificació LGT 58/2003 + RD 1065/2007, registre Banco España RD 7/2021, Model 721 RD 249/2023, Model 172/173, Llei 19/2010 patrimoni Catalunya, CARF Andorra signat 10/11/2023 aplicació 2027)

4. **`single-member-multi-member-llc-implicaciones-fiscales`**
   - **Verificación oficial:** Treas. Reg. §301.7701-3 check-the-box, Form 8832, Form 1065 partnership return
   - **Bloques locales:** FR (BOI-INT-DG-20-20-100, BOI-INT-CVB-USA-10-20, CE 391396 27/06/2018, art. 8 CGI sociétés de personnes, conv. 31/08/1994 FR-USA), DE (BMF 19.03.2004 + 26.09.2014 Typenvergleich, §15/§17 EStG, §6 AStG ATAD 2021, §§7-14 AStG, §20 EStG, Anlagen S/G/AUS, Austria §10a KStG + Mitunternehmerschaft §23 Z 2 EStG), PT (fichas doutrinárias AT 2018003278 / 2019002491, art. 6.º CIRC transparência fiscal, conv. PT-EUA DR 152/95, art. 71 CIRS 28 %, art. 66.º CIRC CFC, Lei 14.754/2023 Brasil), CA (DGT V1631-19, TEAC 6555/2017 19.02.2020, art. 87 LIRPF, conv. ES-EUA 1990 + protocol 2019, art. 100 LIRPF, art. 49 Llei 5/2014 IRPF andorrà, conv. Andorra-EUA 01/01/2024)

5. **`vender-o-cerrar-llc-comparativa-practica`**
   - **Bloques locales:** DE (§16/§17/§34 EStG ermäßigter Steuersatz, §8b KStG Schachtelprivileg, §11 KStG Liquidation, Austria §24 + §27a 27,5 %), PT (art. 72 CIRS 28 %, art. 10 CIRS mais-valias, Lei 8.981/1995 Brasil + Lei 14.754/2023), CA (conveni ES-EUA 1990 + 2019, art. 33 LIRPF, art. 24 Llei 5/2014 IRPF andorrà)

6. **`reorganizar-banca-llc-mercury-relay-wise`**
   - **Bloques locales:** FR (art. 1649 A bis CGI, formulario 3916-bis, L.561-15 CMF TRACFIN €12.500 umbral declaración), DE (§138 Abs. 2 Nr. 2 AO, §§19-20 GwG Transparenzregister, §147 AO conservación 10 años, §10a KStG Austria, §124 BAO + §6 FM-GwG, GoBD), PT (Anexo J Modelo 3, art. 119 RGIT, Aviso 1/2022 BdP, Resolução BCB 281/2022, art. 123 CIRC + 126 CIVA), CA (Model 720 post-Llei 5/2022, arts. 198-199 LGT, doctrina TEAC infracciones)

7. **`diseno-estructura-fiscal-internacional-solida`**
   - **Bloques locales:** DE (BMF 22.12.2023 BStBl. I 2023 2179, GAufzV, OECD-VPL 2022, DBA D-USA 1989/2006 LoB art. 28, BEPS Aktion 6 PPT, AStG §§7-14 ATAD 2021), PT (art. 63 CIRC + Portaria 268/2021 preços de transferência, Lei 14.596/2023 Brasil), CA (art. 16 LIS, RD 634/2015 Master/Local File, doctrina TS PPT)

8. **`justificar-origen-fondos-kyc-bancario-segunda-ronda`**
   - **Bloques locales:** DE (§19 GwG Transparenzregister, JVEG übersetzte Belege, Apostille Den Haag 5/10/1961, §15 GwG verstärkte Sorgfalt, WiEReG Austria, BMF KESt-Reporting), PT (art. 64.º CPPT certificado situação tributária)

9. **`convenio-doble-imposicion-usa-espana-llc`**
   - **Bloque local:** DE (DBA D-USA 29.08.1989, protocolo 01.06.2006, LoB art. 28, TEAC 6555/2017 19.02.2020, BMF 26.09.2014, BFH I R 15/02 20.08.2008 BStBl. II 2009 26, DBA Österreich-USA 31.05.1996)

10. **`w8-ben-y-w8-ben-e-guia-completa`**
    - **Bloque local:** DE (DBA D-USA 1989, art. 10 dividendos 15/5 %, art. 11 0 %, art. 12 0 % qualifying royalties, FATCA-Umsetzungsgesetz BGBl. I 2013 1810, IRS Instructions W-8BEN-E rev. October 2021, Active/Passive NFFE, Reporting Model 1 FFI, DBA Österreich-USA 1996)

### Adicionales DE (3 slugs para llevar audit a 0)

11. **`documentar-separacion-fondos-llc-historial`** (DE)
    - §4 Abs. 4 EStG Betriebsausgaben, §158/§162 AO Beweiskraft + Schätzung, §10 GwG, BFH X R 14/12 04.02.2015 BStBl. II 2015 504, GoBD BMF 28.11.2019, Austria §124/§184 BAO + §6 FM-GwG. Recomendaciones DATEV Belegtransfer + § 162 AO Hinzuschätzung.

12. **`fiscalidad-socios-llc-cambio-residencia-mid-year`** (DE)
    - §1/§25/§49 EStG (limitada vs ilimitada Steuerpflicht), Treas. Reg. §1.706-4 interim closing/proration, DBA D-USA art. 7/14, BMF 26.09.2014, §1 Abs. 3 EStG opción residentes UE/EEE, EAS 3401/3422 Austria, §42 AO Gestaltungsmissbrauch. Distribución preventiva + memorandum de aufteilung.

13. **`wise-bancos-llc-stack-bancaria-completa`** (DE)
    - Stack 4 capas (Mercury/Relay FDIC, Wise multi-divisa, Stripe/Adyen/PayPal, Wise/OFX FX), §6 EStG Bewertung EZB-Referenzkurs, Anlage AUS, DATEV, Austria §124 BAO + §132 BAO.

---

## Reglas operativas aplicadas

- **Inserción correcta:** todos los bloques locales se insertaron ANTES de `<!-- exentax:cta-v1 -->` (apertura), no antes de `<!-- exentax:cta-conv-v1 -->` (que está anidado dentro y rompería la validación CTA).
- **Independencia por idioma:** cada bloque local cubre la problemática del país/jurisdicción de la lengua, no es traducción del ES.
- **Verificación previa a la escritura:** cada cifra, sección de ley o resolución administrativa fue verificada en fuente oficial antes de su inclusión (BOE, CGI/BOFIP, BMF/BFH, AT/BdP, BOPA Andorra, CARF OECD).
- **Phantom key i18n:** `blogPost.atomicAnswerLabel` añadida en los 6 locales en LOG-BATCH-2 ("Respuesta rápida"/"Quick answer"/"Réponse rapide"/"Kurzantwort"/"Resposta rápida"/"Resposta ràpida"). PASS sin pendientes.
- **CTAs canónicas:** ES/PT/CA `/agendar`, EN `/book`, FR `/fr/reserver`, DE `/de/buchen` (no se modificaron).

---

## Validación final

```
node scripts/blog-translation-quality-extended.mjs
  - leakage: 0
  - low ratio: 0      ← era 34
  - untranslated paragraphs: 0

npm run blog:validate-all → OK 11/11
  ✓ consistency  ✓ content-lint  ✓ internal-links  ✓ locale-link-leak
  ✓ cta  ✓ data  ✓ sources  ✓ faq-jsonld  ✓ sitemap
  ✓ sitemap-bcp47  ✓ masterpiece-audit

npm run i18n:check → PASS
  - 0 missing / 0 extra / 0 empty / 0 placeholder mismatches
```
