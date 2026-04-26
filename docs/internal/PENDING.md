# PENDING — Exentax Web

Lista priorizada de trabajo que quedó fuera de esta sesión de auditoría.
Fecha: 2026-04-22 (actualizado Sesión 6: cierre y limpieza con regla
"lo que funciona no se toca"; ver `DEFINITIVE-STATUS.md` y
`CHANGELOG-SESSION.md` para el detalle medido).
Actualiza este documento al cerrar cada ítem.

Cada ítem lleva **comando exacto para reproducirlo**, archivo:línea si
aplica, e impacto (alto/medio/bajo). Sin items vagos.

---

## 🟡 Gris ambiental — no es bug de código, verificar en entorno real

### [G1] `blog:validate-all` sources → 33 URLs externas 403 desde sandbox — RESUELTO en Sesión 7

**Estado (2026-04-25):** ejecutado `node scripts/blog-verify-source-urls.mjs`
en este entorno → **33/33 OK, 0 sandbox-blocked**. El step `sources` de
`blog:validate-all` pasa. Mantener la entrada como aviso histórico:
si en el futuro vuelve a haber bloqueos por reputación de IP, se
reproduce el síntoma original.

**Reproducir** (regenerar cache cuando haga falta):
```
cd exentax-web && node scripts/blog-verify-source-urls.mjs
# → "sources OK=33 FAIL=0 (of 33); sandbox-blocked=0"
```
**Archivo:línea**: `reports/seo/source-url-verification.json`,
generado por `scripts/blog-verify-source-urls.mjs`.
**Impacto**: bajo (resuelto en este entorno; reaparece solo si la
reputación de IP cambia).

### [G2] `blog:validate-all` sitemap → ECONNREFUSED 127.0.0.1:5000

**Reproducir**:
```
cd exentax-web && npm run blog:validate-all 2>&1 | grep -A3 "Fetching http"
```
**Output**:
```
Fetching http://localhost:5000/sitemap.xml ...
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Archivo:línea**: `scripts/seo-sitemap-check.mjs:141`.
**Impacto**: bajo (el step necesita dev server; no afecta build ni
deploy).
**Fix**: iniciar dev server (`npm run dev`) en otra terminal antes de
correr `blog:validate-all` localmente. En Replit el workflow de "Start
application" ya lo levanta.

### [G3] `audit-system-seo-faqs` live-fetch artifacts sin dev server

**Reproducir**:
```
cd exentax-web && node scripts/audit-system-seo-faqs.mjs
```
**Output**: 384 issues (96×4) de `canonical-mismatch`,
`hreflang-incomplete`, `open-graph`, `twitter-card`.
**Archivo:línea**: `scripts/audit-system-seo-faqs.mjs:104` (el
`fetch(url, ...)` timeout).
**Impacto**: informativo. Todos los issues desaparecen cuando el audit
tiene un server respondiendo.
**Fix**: ejecutar con dev server corriendo, o añadir `BASE_URL` real.

### [G4] `seo-audit.json` → `robots-empty` (1 issue)

**Reproducir**:
```
cd exentax-web && node scripts/audit-system-seo-faqs.mjs
python3 -c "import json; d=json.load(open('docs/auditoria-sistema-seo-faqs/seo-audit.json')); print([i for i in d['issues'] if i.get('area')=='robots-empty'])"
```
**Archivo:línea**: `server/routes/public.ts` handler robots.txt (verificar).
**Impacto**: P0 según audit, pero probable artefacto live-fetch.
**Fix**:
```
# En Replit, con server corriendo:
curl http://localhost:5000/robots.txt
# Debe devolver al menos "User-agent: *" + "Sitemap: ..."
```
Si el handler devuelve vacío, es bug real; si devuelve correcto, es
artefacto de G3.

### [G5] E2E tests (5) requieren Postgres real

**Reproducir** (en Replit / Hostinger con DB):
```
cd exentax-web
npm run test:newsletter   # newsletter + RGPD consent log
npm run test:booking      # booking + reschedule + cancel
npm run test:discord-neon # Discord embed no leaks tokens
npm run test:indexnow     # IndexNow ping
npm run test:calculator   # (ya VERDE 116/116 con DB dummy, no requiere real)
```
**Impacto**: alto (son el contrato e2e del golden path). Task #8 los dejó
verdes en Replit con DB real; no reverificados en sandbox porque no hay
Postgres.
**Fix**: ejecutar en Replit tras cualquier cambio que toque booking,
newsletter, Discord o indexing.

---

## 🟠 Media prioridad — SEO long-tail

### [S1] keyword-positioning legales/booking — **CERRADO** (2026-04-26)

**Estado final**: 78 → 35 (Sesión 7) → 0 (sesión 2026-04-26 verificación).

`node scripts/audit-system-seo-faqs.mjs` + filtro `area=keyword-positioning`
devuelve **0 issues**. Los 35 que figuraban abiertos se cerraron en sesiones
posteriores con la actualización de descriptions de `seo-content.ts`. Verificado
hoy contra `docs/auditoria-sistema-seo-faqs/seo-audit.json`.

Los 384 issues restantes en el audit son `canonical-mismatch`,
`hreflang-incomplete`, `open-graph`, `twitter-card` × 96 — **todos artefactos
live-fetch sin dev server (G3 más arriba)**. No son issues de código.

---

## 🟢 Pre-deploy Hostinger VPS — checklist operativo

Ver guía completa en `exentax-web/docs/deploy/HOSTINGER-VPS.md`. Lo que debe
hacerse **fuera del repositorio** antes de encender el VPS:

| # | Acción | Dónde | Tiempo |
|---|---|---|---|
| 1 | Contratar Hostinger VPS KVM 2 (Ubuntu 22.04 LTS) | panel Hostinger | 10 min |
| 2 | Apuntar DNS `exentax.com` + `www.exentax.com` A/AAAA → IP VPS | panel DNS actual | 5 min + propagación |
| 3 | Generar `FIELD_ENCRYPTION_KEY` (`openssl rand -hex 32`) | local | 1 min |
| 4 | Crear Discord application, bot, canales y rol admin | Discord Developer Portal | 30 min |
| 5 | Crear Google Cloud project, Service Account con Calendar+Meet+Gmail APIs | Google Cloud Console | 30 min |
| 6 | Provisión inicial VPS (§4 de la guía: Node 22, PostgreSQL 16, PM2, Nginx, Certbot) | VPS ssh | 30 min |
| 7 | Rsync código + crear `.env` + `npm run db:push` + `pm2 start` | VPS ssh | 15 min |
| 8 | Configurar Nginx + Certbot SSL | VPS ssh | 10 min |
| 9 | UptimeRobot monitor → `https://exentax.com/api/health` | uptimerobot.com | 5 min |

Bugs de build **ya resueltos** en Sesión 5 (ver `AUDIT-REPORT.md §Sesión 5`):
- ✅ `seo-meta-audit.mjs` ahora detecta lazy imports (ya no falla `faq-page.tsx`).
- ✅ `build.ts` ya no referencia scripts archivados (`audit-2026-04-*`).
- ✅ `SKIP_BUILD_E2E=1 npm run build` exit 0 con `dist/index.mjs` 5.9 MB + `dist/public/` 24 MB.

---

## 🔴 Alta prioridad

### 0. Artículos de blog con traducción cortada (ratio palabras <0,85 vs ES) — ABIERTO

**Esfuerzo estimado:** 20-30 min editoriales por archivo × 47 casos
críticos (<0,70) o × 121 si se quiere llevar todos a ≥0,85.
**Bloqueante producción:** no · **Impacto SEO y conversión:** alto.

**Métrica actualizada en Sesión 7 (2026-04-25):**
- 121 casos con ratio < 0,85 — DE 43, EN 6, FR 20, PT 28, CA 24
- 47 críticos con ratio < 0,70 — DE 17, FR 9, PT 10, CA 11, EN 0
- Concentrados en **17 slugs únicos**

Lista completa, slug-por-slug, en
`docs/auditoria-multiidioma/cierre-pendientes-2026-04.md §3.2`.

**Histórico de intentos:** dos tandas previas con sub-agentes
paralelos (4 + 6 invocaciones) acabaron con
`Stream idle timeout - partial response received` **sin persistir
cambios**. La generación de 2000-3000 palabras técnicas por
invocación no es viable con los límites de idle timeout actuales.
La propuesta vigente es expansión manual o por sesiones dedicadas,
artículo por artículo, con el ES como guía estructural.

**Reproducir la medición:**
```bash
node /tmp/wc_blog.mjs   # snippet en cierre-pendientes-2026-04.md §6.5
```

**Slugs prioritarios** (4 idiomas afectados cada uno):
1. ~~`wise-business-crs-reporting-fiscal`~~ **HECHO Sesión 8 (2026-04-25)** — EN/FR/DE/PT/CA reescritos al 100 % con ES como referencia. Ratios wc post-rewrite: EN 1.12 · FR 1.16 · DE 1.04 · PT 1.13 · CA 1.12 (todos ≥ 0.85). Metas (mt ≤ 60, md ≤ 155) actualizados en los 5 `blog-i18n/{lang}.ts`. Enlaces internos remapeados a slugs canónicos por idioma vía `BLOG_SLUG_I18N`. CTA trailing alineado con `blog-cta-library.ts`. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md`.
2. ~~`riesgos-fiscales-mala-estructuracion-internacional`~~ **HECHO Sesión 9 (2026-04-25)** — EN/FR/DE/PT/CA reescritos al 100 % con ES como referencia. Ratios wc post-rewrite: EN 0.87 · FR 1.23 · DE 1.14 · PT 1.21 · CA 1.10 (todos ≥ 0.85). Metas vigentes (mt ≤ 60, md ≤ 155). Enlaces internos remapeados a slugs canónicos por idioma vía `BLOG_SLUG_I18N`. CTA trailing alineado con `blog-cta-library.ts`. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md`.
3. ~~`tributacion-llc-segun-actividad-economica`~~ **HECHO Sesión 10 (2026-04-25)** — EN/FR/DE/PT/CA reescritos al 100 % con ES como referencia. Ratios wc post-rewrite: EN 0.85 · FR 1.18 · DE 1.05 · PT 1.10 · CA 1.06 (todos ≥ 0.85). Metas vigentes (mt ≤ 60, md ≤ 155). Enlaces internos remapeados a slugs canónicos por idioma vía `BLOG_SLUG_I18N`. CTA trailing alineado con `blog-cta-library.ts` (pattern `services_overview` / URL `/lang/<our_services>`). `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md`.
4. ~~`dac7-plataformas-digitales-reporting-2026`~~ **HECHO Sesión 11 (2026-04-25)** — FR/DE/PT/CA reescritos al 100 % con ES como referencia (EN ya estaba en 0.87, intacto). Ratios wc post-rewrite: EN 0.87 · FR 1.08 · DE 0.95 · PT 1.02 · CA 0.99 (todos ≥ 0.85). Metas vigentes (mt ≤ 60, md ≤ 155). Enlaces internos remapeados a slugs canónicos por idioma vía `BLOG_SLUG_I18N`. Anidamiento `<a>` DE línea 25 (DGT/TEAC) eliminado. CTA pattern `book_consultation` con trailing alineado a `blog-cta-library.ts`. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md`.
5. ~~`crs-residentes-espana-latam-implicaciones`~~ **HECHO Sesión 12 (2026-04-25)** — EN/FR/DE/PT/CA reescritos al 100 % con ES como referencia. Ratios wc post-rewrite: EN 0.98 · FR 1.14 · DE 0.98 · PT 1.09 · CA 1.08 (todos ≥ 0.85). Encuadre local añadido tras la intro en FR (Formulaire 3916/3916-bis, Punto contacto BNB Bélgica, declaración cantonal Suiza), DE (AIA/CRS, Anlage AUS, §138 AO Alemania; Anlage E1kv Austria; Wertschriftenverzeichnis Suiza), PT (Anexo J IRS, Modelo 58 BdP Portugal; DCBE/e-Financeira/DIRF Brasil), CA (Model 720/721, declaració D-6 Catalunya/Estat espanyol). Metas vigentes (mt ≤ 60, md ≤ 155). Enlaces internos remapeados a slugs canónicos por idioma vía `BLOG_SLUG_I18N`. CTA trailing alineado verbatim con `blog-cta-library.ts` (pattern `book_consultation`). `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md`.
6. ~~`boe-febrero-2020-llc-doctrina-administrativa`~~ **HECHO Sesión 14 (2026-04-25)** — Bache 1 slug 1. ES limpiado de `exentax:review-anchor-v1` tras verificación oficial de cifras (28%/47%/21%/50%/50.000€), referencias IRC §6038A/§7701, Form 8832/5472, RD 1065/2007 y DAC6/7/8. EN expandido con cobertura híbrida UK+USA (Anson v HMRC [2015] UKSC 44, INTM180020, FATCA Form 8938) y jurisdicciones IE/CA/AU. FR/DE/PT/CA reescritos al 100 % con localización por idioma (FR→Francia/BE/LU/CH/Québec, DE→DACH, PT→Portugal/Brasil/Angola, CA→Catalunya/Estado/Andorra/UE). Cuerpo (palabras netas excluyendo HTML/comentarios): ES 3087 · EN 2905 (ratio 0.94) · FR 4918 (1.59) · DE 4739 (1.53) · PT 4759 (1.54) · CA 4829 (1.56). Subagentes paralelos por idioma (2 OK + 2 timeout-pero-archivos-OK). Post-fix manual: 22 enlaces internos `/lang/blog/<slug>` localizados con slugs truncados canónicos de `BLOG_SLUG_I18N` (no `-2026` largo del reverse map); FR `/fr/agendar` → `/fr/reserver` (4×); cierres incorrectos `<!-- /exentax:banking-facts-v1 -->` y `<!-- /exentax:legal-refs-v1 -->` eliminados (canónicamente open-only); trailing `cta-v1` reemplazado por copia canónica `book_consultation` en FR/DE/PT/CA. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md §6.1`.
9. ~~`autonomos-espana-por-que-dejar-de-serlo`~~ **HECHO Sesión 17 (2026-04-25)** — Bache 1 slug 4. Eliminado bloque `exentax:review-anchor-v1` en los 6 idiomas y purgados marcadores `[REVISIÓN MANUAL]` inline (ES 39, EN/FR/DE/PT/CA 33 cada uno) tras verificación contra fuentes oficiales: cuota autónomo ~300 €/mes base mínima nueva (RDL 13/2022 tramos 4-5), tramos IRPF 24/37/45 % (Ley 26/2014: 35.200-60.000 € → 37 %; 60.000-300.000 € → 45 %), IVA 21 % (Ley 37/1992 art. 90), pago fraccionado 20 % rendimiento neto (Modelo 130, art. 110 RIRPF), Modelo 349 operaciones intracomunitarias y OSS, Disregarded Entity propietario no residente sin US-source income → 0 % federal (IRC §7701(a)(30), §881, §1441; Treas. Reg. §301.7701-3 check-the-box), EIN + Registered Agent, Mercury wires fee USD 0. Sin reescritura por jurisdicción: el artículo es opinión-rant **ES-only por naturaleza** (compara explícitamente "autónomo en España" vs "LLC americana"; no requiere capas DACH/lusofonía/UK híbrido). Cuerpo (palabras netas, sin HTML/comentarios): ES 2912 · EN 2623 (0.90) · FR 3021 (1.04) · DE 2666 (0.92) · PT 2586 (0.89) · CA 2752 (0.95) — todos ≥ 0.85. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md §6.1`.
8. ~~`cuotas-autonomos-2026-guia-completa`~~ **HECHO Sesión 16 (2026-04-25)** — Bache 1 slug 3. Eliminado bloque `exentax:review-anchor-v1` en los 6 idiomas tras verificación contra fuentes oficiales: tabla de 15 tramos RETA por ingresos reales (RDL 13/2022 + Disp. Trans. 1ª, tipo conjunto 31,5 % = CC + CP + cese + FP + MEI 0,8 % en 2026), cuota tramo 1 = 200 €/mes y tramo 15 = 604,80 €/mes (Acuerdo Mesa Diálogo Social autónomos, calculadas sobre la base mínima de cada tramo), tarifa plana 80 €/mes 12 + 12 condicionada al SMI (RDL 13/2022 art. 38 ter LGSS), umbral SMI ~1.134 €/mes 2026, autónomo societario art. 305.2.b LGSS (≥ 25 % capital + funciones de dirección efectivas), Régimen General base mínima ~1.323 €/mes con tipos 30 % empresa + 6,8 % trabajador, bonificación discapacidad ≥ 33 % y víctimas de violencia de género (art. 31-37 Ley 20/2007 del Estatuto del Trabajo Autónomo), referencias oficiales BOE-A-1994-14960 (TRLGSS) y Sede Electrónica TGSS. Sin reescritura por jurisdicción: el artículo es **ES-only por naturaleza** (las cuotas RETA aplican exclusivamente a residentes en España); EN/FR/DE/PT/CA mantienen el contenido divulgativo localizado existente sin necesidad de capas DACH/lusofonía/etc. Cuerpo (palabras netas, sin HTML/comentarios): ES 1734 · EN 1623 (0.94) · FR 1718 (0.99) · DE 1489 (0.86) · PT 1474 (0.85) · CA 1624 (0.94) — todos ≥ 0.85. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md §6.1`.
7. ~~`autonomo-espana-vs-llc-estados-unidos`~~ **HECHO Sesión 15 (2026-04-25)** — Bache 1 slug 2. Eliminado bloque `exentax:review-anchor-v1` en los 6 idiomas tras verificación contra fuentes oficiales: tramos IRPF (Ley 26/2014, vigentes: 19/24/30/37/45/47 %), cuotas RETA (RDL 13/2022, ~205-1.607 €/mes), Modelo 720 umbral 50.000 € (Ley 5/2022 post-STJUE C-788/19), Form 5472 + Treas. Reg. §1.6038A-1 + sanción 25.000 USD por formulario (IRC §6038A(d)), C-Corp 21 % federal (TCJA 2017), Andorra IS 10 % (Llei 95/2010), Estonia 20/22 % (Income Tax Act, subida a 22 % en 2025), IRC §871/§882/§7701, Form 8832 (check-the-box), Form 7004 (extension). Eliminados 5 marcadores `<!-- [REVISIÓN MANUAL] -->` inline en ES. EN/DE/PT/CA expandidos con cobertura local específica añadida al final de la sección "Por jurisdicción" (sin tocar resto del cuerpo): EN→UK híbrido (Anson v HMRC, INTM180020, Part 9A TIOPA 2010, SA106) + USA residentes (Schedule C/E, IRC §951A GILTI, FATCA 8938) + IE/CA/AU + practical takeaway; DE→DACH (BMF 19.03.2004, AStG §§ 7-14, § 138 AO, § 10a KStG Austria, ESTV Kreisschreiben 38 Suiza); PT→Lusofonía (CIRC art. 66, Lei 14.754/2023 Brasil, DCBE/CBE BCB, CGT Angola); CA→Catalunya/Andorra/UE (Andorra art. 35 Llei 95/2010 IS, Catalunya tram autonòmic, Model 720/721, D-6, DAC2/6/7/8). Cuerpo (palabras netas, sin HTML/comentarios): ES 3395 · EN 2990 (0.88) · FR 2986 (0.88) · DE 2998 (0.88) · PT 3081 (0.91) · CA 3031 (0.89) — todos ≥ 0.85. `npm run blog:validate-all` → **OK 11/11**. Detalle en `REWRITE-COMPLETE-REPORT.md §6.1`.
6. ~~`revolut-business-crs-reporting-fiscal`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + inline en 6 idiomas tras verificación oficial (CRS Sect. VIII.D.6/9, RD 1021/2015 art. 16, Lituania VMI, DAC2 Dir. 2014/107/UE, FATCA IRC §1471-1474, Form 5472/8832, RD 1558/2012, Modelo 720). Bloque local FR (art. 1649 A bis CGI, formulario 3916-bis, art. 209 B/123 bis CGI), DE (§138 AO, §§7-14 AStG ATAD 2021, §19/20 GwG Transparenzregister, FKAustG, EAS 3401/3422 Austria, §10a KStG), PT (Modelo 3 Anexo J, art. 119 RGIT, art. 66.º CIRC, Aviso 1/2022 BdP, BCB Resolução 281/2022, Lei 14.754/2023 IN RFB 2.180/2024), CA (Modelo 720 post-Llei 5/2022, STJUE C-788/19, art. 100 LIRPF, Llei 5/2014 art. 49 IRPF andorrà, DTAA Andorra-EUA 01/01/2024). Ratio paridad: todos ≥ 0.71 vs ES.
7. ~~`exit-tax-espana-llc-cripto-interactive-brokers`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + inline en 6 idiomas tras verificación oficial (art. 95 bis LIRPF Llei 26/2014, TJUE C-503/14, IRC §6038A, Treas. Reg. §301.7701-3). Bloques locales: EN (art. 95 bis Spain, DTAA Andorra-EUA), FR (art. 167 bis CGI Loi 2011, art. 244 bis B, art. 150 VH bis cripto), DE (§6 AStG ATAD 2021, EuGH Wächtler C-581/17, §17 EStG, BMF 19.03.2004 + 26.09.2014, §23 EStG cripto Spekulationsfrist, Austria §27/6 EStG + §27a Z 2 cripto 27,5 %), PT (Lei 82-B/2014, arts. 10.º-A/83.º-A CIRS, TJUE C-503/14, Lei 24-D/2022 cripto 28 %, IN RFB 208/2002 Brasil, Lei 14.754/2023), CA (art. 95 bis LIRPF, Model 721 RD 249/2023, conveni Andorra-Espanya BOE 7/12/2015, conveni Andorra-EUA 01/01/2024). Ratio paridad: todos ≥ 0.71 vs ES.
8. ~~`reorganizar-banca-llc-mercury-relay-wise`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + inline en 6 idiomas tras verificación oficial. Bloques locales: FR (art. 1649 A bis CGI, formulario 3916-bis, L.561-15 CMF TRACFIN €12.500), DE (§138 Abs. 2 Nr. 2 AO, §§19-20 GwG Transparenzregister, §147 AO 10 años, §10a KStG Austria, §124 BAO + §6 FM-GwG, GoBD), PT (Anexo J Modelo 3, art. 119 RGIT, Aviso 1/2022 BdP, Resolução BCB 281/2022, art. 123 CIRC + 126 CIVA), CA (Model 720 post-Llei 5/2022, arts. 198-199 LGT). Ratio paridad: todos ≥ 0.71 vs ES.
9. ~~`single-member-multi-member-llc-implicaciones-fiscales`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + inline en 6 idiomas tras verificación oficial (Treas. Reg. §301.7701-3, Form 8832/1065). Bloques locales: FR (BOI-INT-DG-20-20-100, BOI-INT-CVB-USA-10-20, CE 391396 27/06/2018, art. 8 CGI, conv. 31/08/1994), DE (BMF 19.03.2004 + 26.09.2014, Typenvergleich, §15/§17 EStG, §6 AStG ATAD 2021, §§7-14 AStG, §20 EStG, Anlagen S/G/AUS, Austria §10a KStG + Mitunternehmerschaft §23 Z 2 EStG), PT (fichas doutrinárias AT 2018003278/2019002491, art. 6.º CIRC transparência fiscal, conv. PT-EUA DR 152/95, art. 71 CIRS 28 %, art. 66.º CIRC CFC, Lei 14.754/2023 Brasil), CA (DGT V1631-19, TEAC 6555/2017, art. 87 LIRPF, conv. ES-EUA 1990 + protocol 2019, art. 100 LIRPF, art. 49 Llei 5/2014 IRPF andorrà, conv. Andorra-EUA 01/01/2024). Ratio paridad: todos ≥ 0.71 vs ES.

**Slugs adicionales cerrados en LOG-BATCH-3 (no eran de los 4 críticos pero se incluyeron en el lote de 10 ampliado a 13 para resolver TODOS los low-ratio <0.70 reportados):**
10. ~~`dac8-criptomonedas-reporting-fiscal-2026`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + inline en 6 idiomas tras verificación oficial (Dir. UE 2023/2226 DAC8, Reg. UE 2023/1114 MiCA). Bloques locales: FR (AMF MiCA 30/12/2024, art. 1649 ter A CGI Loi 2024 art. 116, art. 1740 D CGI sanciones), DE (KStTG ref. 2024, BZSt, §23 EStG Spekulationsfrist 1 año + Freigrenze €1.000 desde 2024, BMF 10.05.2022 BStBl. I 2022 668, Austria §27a 27,5 %, §147 AO), PT (DL transposição em curso DL 64/2016 + Lei 28/2020, Aviso 3/2021 BdP, Lei 24-D/2022 28 %, IN RFB 1.888/2019 Brasil, Lei 14.754/2023 IN 2.180/2024), CA (modificació LGT 58/2003 + RD 1065/2007, registre Banco España RD 7/2021, Model 721 RD 249/2023, Model 172/173, Llei 19/2010 patrimoni Catalunya, CARF Andorra signat 10/11/2023 aplicació 2027). Ratio paridad: todos ≥ 0.71 vs ES.
11. ~~`vender-o-cerrar-llc-comparativa-practica`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + bloques locales (DE: §16/§17/§34 EStG, §8b KStG, §11 KStG, Austria §24/§27a 27,5 %; PT: art. 72 CIRS 28 %, art. 10 CIRS, Lei 8.981/1995 Brasil + Lei 14.754/2023; CA: conveni ES-EUA 1990 + 2019, art. 33 LIRPF, art. 24 Llei 5/2014 IRPF andorrà). Ratio paridad: todos ≥ 0.71 vs ES.
12. ~~`diseno-estructura-fiscal-internacional-solida`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + bloques locales DE/PT/CA tras verificación oficial (BMF 22.12.2023 BStBl. I 2023 2179, GAufzV, OECD-VPL 2022, DBA D-USA 1989/2006 LoB art. 28, BEPS Aktion 6 PPT, art. 63 CIRC + Portaria 268/2021, art. 16 LIS, RD 634/2015 Master/Local File, Lei 14.596/2023 Brasil). Ratio paridad: todos ≥ 0.71 vs ES.
13. ~~`justificar-origen-fondos-kyc-bancario-segunda-ronda`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + bloques locales DE/PT (§19 GwG Transparenzregister, JVEG übersetzte Belege, Apostille Den Haag 5/10/1961, §15 GwG verstärkte Sorgfalt, WiEReG Austria, BMF KESt-Reporting; art. 64.º CPPT certificado situação tributária). Ratio paridad: todos ≥ 0.71 vs ES.
14. ~~`convenio-doble-imposicion-usa-espana-llc`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + bloque local DE (DBA D-USA 29.08.1989, protocolo 01.06.2006, LoB art. 28, TEAC 6555/2017 19.02.2020, BMF 26.09.2014, BFH I R 15/02 20.08.2008 BStBl. II 2009 26, DBA Österreich-USA 31.05.1996). Ratio paridad: ≥ 0.71 vs ES.
15. ~~`w8-ben-y-w8-ben-e-guia-completa`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Limpieza anchor + bloque local DE (DBA D-USA 1989, art. 10 dividendos 15/5 %, art. 11 0 %, art. 12 0 % qualifying royalties, FATCA-Umsetzungsgesetz BGBl. I 2013 1810, IRS Instructions W-8BEN-E rev. October 2021, Active/Passive NFFE Reporting Model 1 FFI, DBA Österreich-USA 1996). Ratio paridad: ≥ 0.71 vs ES.
16. ~~`documentar-separacion-fondos-llc-historial`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Bloque local DE adicional (no estaba en lote inicial de 10 pero se cerró para llevar low-ratio audit a 0): §4 Abs. 4 EStG, §158/§162 AO, §10 GwG, BFH X R 14/12 04.02.2015 BStBl. II 2015 504, GoBD BMF 28.11.2019, Austria §124/§184 BAO + §6 FM-GwG. Ratio paridad: ≥ 0.71 vs ES.
17. ~~`fiscalidad-socios-llc-cambio-residencia-mid-year`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Bloque local DE adicional: §1/§25/§49 EStG (limitada vs ilimitada), Treas. Reg. §1.706-4 interim closing/proration, DBA D-USA art. 7/14, BMF 26.09.2014, §1 Abs. 3 EStG opción para residentes UE/EEE, EAS 3401/3422 Austria, §42 AO. Ratio paridad: ≥ 0.71 vs ES.
18. ~~`wise-bancos-llc-stack-bancaria-completa`~~ **HECHO LOG-BATCH-3 (2026-04-25)** — Bloque local DE adicional: stack 4 capas (Mercury/Relay FDIC, Wise multi-divisa, Stripe/Adyen/PayPal, Wise/OFX FX), §6 EStG Bewertung EZB-Referenzkurs, Anlage AUS, DATEV, Austria §124 BAO + §132 BAO. Ratio paridad: ≥ 0.71 vs ES.

**Resultado audit `blog-translation-quality-extended` post-LOG-BATCH-3: low ratio = 0 articles** (era 34 antes de este lote).

### 1. Párrafos consecutivos duplicados en blog ~~(93 en 52 ficheros)~~ **CERRADO**
**Resuelto en commit `8a63855` y continuación.** Script
`scripts/dedup-consecutive-paragraphs.mjs` con lógica CTA-buffer-aware
eliminó los 93 duplicados en 2 pasadas. Estado final: **0 dups en 0 ficheros**.
Re-ejecutable si reaparecen (idempotente, no-op sobre ficheros limpios).

### 2. Revisión de traducciones profesional por nativos (EN/FR/DE/PT/CA)
**Esfuerzo estimado:** 20-40 h por idioma · **Bloqueante producción:** no · **Impacto conversión:** alto.

La cobertura i18n es del 100 % (1552 claves × 6 idiomas, sin placeholders rotos),
pero la **calidad nativa** de cada cadena no se puede garantizar sin revisor
humano nativo de cada mercado. Qué pedir al revisor por idioma:

- **EN-US**: registro americano directo (freelancers + entrepreneurs). Evitar
  calcos del español en estructuras condicionales y subordinadas. CTAs idiomáticos
  (no "Book now" literal: "Get your LLC started today").
- **FR-FR**: registro profesional parisino para auto-entrepreneurs. Sustituir
  terminología "autónomo" por "indépendant / auto-entrepreneur" según contexto.
- **DE-DE**: registro directo y técnico para Selbstständige. Evitar pasivas
  excesivas y subordinadas kilométricas.
- **PT-PT**: portugués europeo (el lint `audit-pt-pt.mjs` ya bloquea brasileñismos).
  Revisar construcciones con pronombres enclíticos.
- **CA**: catalán formal correcto. Verificar usos de "vostè" vs "tu".

**Herramientas que ya ayudan:**
- `scripts/validate-i18n.ts` marca entradas idénticas a ES ("posiblemente no traducidas").
- `scripts/blog-translation-quality-audit.mjs` detecta párrafos duplicados y
  hits PT-BR. Últimos resultados: 4 hits PT-BR en 3 ficheros + 93 párrafos
  duplicados en 52 ficheros (report-only, no bloqueante).

### 2. Tramos IRPF autonómicos por CCAA en la calculadora
**Esfuerzo:** 4-8 h. La calculadora usa una escala agregada "estatal + autonómica
media". Algunas CCAA (Cataluña, Valencia) suben 2-3 pts el tramo alto; Madrid,
La Rioja, Andalucía bajan 1-2 pts. Valorar exponer el selector CCAA en la UI
o al menos un desplegable "autonomía más cara / media / más barata".

### 3. Verificación live de pipeline CI
**Esfuerzo:** 1-2 h. En este entorno sandbox falló `seo:slash` (timeout de 60 s
al arrancar servidor temporal). Confirmar en CI real (GitHub Actions / deploy)
que `npm run check` cierra en verde con todos los scripts.

### 4. Push manual de tag e imagen OG
**Esfuerzo:** 15 min. Tag `exentax-3.0` ya re-apuntado. Pendiente verificar que
`og-image.png` existe en `client/public/` y que el dominio productivo
(`https://exentax.com`) sirve imágenes OG 1200×630 válidas vía
[OpenGraph.xyz](https://www.opengraph.xyz/).

---

## 🟡 Media prioridad

### 5. Imagen OG por artículo de blog (alt + per-article `og:image`)
**Esfuerzo:** 8-16 h. Hoy todos los artículos comparten `/og-image.png` con
`og:image:alt` traducido vía `seo.twitterAlt`. Una imagen por artículo mejora
CTR en LinkedIn/Twitter.

### 6. Redirects 301 legacy
**Esfuerzo:** 2-4 h. No hay tabla explícita `/oldSlug → /newSlug`. Si el sitio
ya estuvo en producción con slugs distintos, mapearlos en `server/index.ts` o
vía middleware en `server/routes/` para evitar 404 indexados por Google.

### 7. Tipos estrictos en handlers de Discord
**Esfuerzo:** 3-5 h. 13 usos de `any` en `server/discord-bot-commands.ts` y
`server/discord.ts` (tipos de respuesta de la API). Alternativa: instalar
`discord-api-types` y tipar los embeds/components.

### 8. PR históricos cerrados con historia muerta
**Esfuerzo:** 10 min. PRs #1-#9 están closed y apuntan a commits que ya no
existen en `main` tras el squash. Opcionalmente añadir comentario aclaratorio
o dejarlos tal cual (historial de GitHub).

### 9. Tabla RETA 2026: cross-check oficial
**Esfuerzo:** 30 min. La tabla `SS_AUTONOMO_BRACKETS_2026` la tomamos del blog
de Exentax (`cuotas-autonomos-2026-guia-completa.ts`) que cita a la TGSS.
Antes del cierre del ejercicio contrastar directamente con el BOE / resolución
oficial de 2026 y marcar verificación en el comentario del código.

---

## 🟢 Baja prioridad / nice-to-have

### 10. Warnings no-bloqueantes del audit de traducción blog
- `blog-translation-quality-audit --check`: 4 hits PT-BR en 3 ficheros, 93
  párrafos duplicados en 52 ficheros. Triage + fix dirigido (no bloqueante).

### 11. CCAA / moneda por defecto en la calculadora según IP geolocalizada
**Esfuerzo:** 4-6 h. Mejora de UX. Hoy todo arranca en ES / EUR.

### 12. Lighthouse CI auditando PR
**Esfuerzo:** 2-3 h. Añadir workflow que bloquee merges si algún Core Web Vital
retrocede por debajo del umbral (LCP<2.5s, CLS<0.1, FID<100ms).

### 13. Performance budgets
**Esfuerzo:** 2 h. `audit-bundle.mjs` ya notifica crecimientos al Discord.
Añadir umbral duro (ej. bloquear si el bundle crece > 5 % vs último baseline).

### 14. Tests E2E de flujos críticos
**Esfuerzo:** 8-12 h. Playwright ya instalado. Añadir flujos:
- Reserva completa (book → calendar → email confirmación → reagendar → cancelar).
- Calculadora: autónomo ES → LLC con email con HTML branded.
- Cambio de idioma + persistencia + hreflang navegable.

### 15. Scripts huérfanos detectados — revisión manual antes de eliminar

**Hallazgo (sesión 2026-04-26)**: scan manual reveló 2 scripts en `scripts/`
sin referencia desde `package.json` ni desde otros scripts:

- `scripts/blog-i18n-sync-check.mjs` — 0 referencias en todo el repo.
- `scripts/audit-markdown-quality.mjs` — solo se referencia a sí mismo.

**Acción**: NO eliminar todavía (regla nº 1: solo borrar con confianza alta).
Ambos pueden ser auditorías one-off útiles para diagnóstico puntual. Verificar
manualmente con el autor / dueño si pueden archivarse en `scripts/archive/`.

**Reproducir**:
```
for s in blog-i18n-sync-check audit-markdown-quality; do
  refs=$(grep -rl --include="*.json" --include="*.mjs" --include="*.ts" --include="*.sh" "$s" exentax-web 2>/dev/null | grep -v "^exentax-web/scripts/$s" | grep -v node_modules | wc -l)
  echo "$refs $s"
done
```
**Esfuerzo**: 5 min de revisión + decisión (mantener / archivar / eliminar).

---

## Criterios de cierre

- Cada ítem marcar `DONE` con link al commit que lo resuelve.
- Los items "alta prioridad" que requieran revisor humano externo (nativos)
  pueden cerrarse con el nombre del revisor + fecha + hash de commit revisado.
- No abrir items nuevos en este fichero: documentarlos primero en un issue
  o TODO del código y traerlos aquí cuando se prioricen.
