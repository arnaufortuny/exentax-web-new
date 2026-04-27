# Auditoría de slugs y páginas — 2026-04-27

Auditoría exhaustiva de las URLs canónicas, blog, redirecciones legacy, páginas `noindex`, sitemap, `canonical` y `hreflang` en los 6 idiomas (Task #25).

Server: `http://localhost:5000`

## Veredicto

- **Bloqueantes**: 0
- **Warnings**: 0

| Eje | Status |
| --- | --- |
| Páginas canónicas (102/102 = 200) | OK |
| Blog index (6/6 = 200) | OK |
| Blog posts (672/672 = 200) | OK |
| Redirecciones legacy (50/50 = 301 a destino correcto) | OK |
| `noindex` en páginas internas (4/4) | OK |
| Sitemap pages cobertura (declaradas=102, en sitemap=102, faltan=0, huérfanas=0) | OK |
| Sitemap blog cobertura (declaradas=672, en sitemap=672, faltan=0, huérfanas=0) | OK |
| Sitemap FAQ cobertura (declaradas=6, en sitemap=6, faltan=0, huérfanas=0) | OK |
| Higiene de slug (route keys: 0 issues, colisiones: 0) | OK |
| Higiene de slug blog (issues: 0, colisiones: 0) | OK |
| `canonical` + `hreflang` exhaustivo (102/102 páginas con set completo y x-default correcto) | OK |
| Navegación global → inventario canónico (180/180 resoluciones `lp(...)` × idioma) | OK |

## 1. Páginas canónicas (102 = 17 route keys × 6 idiomas)

Crawl HTTP en runtime contra el server local. Cada celda indica el HTTP status; "-" si no se pudo medir.

| route key | es | en | fr | de | pt | ca |
| --- | --- | --- | --- | --- | --- | --- |
| `home` | 200 `/es` | 200 `/en` | 200 `/fr` | 200 `/de` | 200 `/pt` | 200 `/ca` |
| `how_we_work` | 200 `/es/como-trabajamos` | 200 `/en/how-we-work` | 200 `/fr/comment-nous-travaillons` | 200 `/de/wie-wir-arbeiten` | 200 `/pt/como-trabalhamos` | 200 `/ca/com-treballem` |
| `our_services` | 200 `/es/servicios` | 200 `/en/services` | 200 `/fr/services` | 200 `/de/leistungen` | 200 `/pt/servicos` | 200 `/ca/serveis` |
| `about_llc` | 200 `/es/sobre-las-llc` | 200 `/en/about-llc` | 200 `/fr/a-propos-des-llc` | 200 `/de/uber-llc` | 200 `/pt/sobre-llc` | 200 `/ca/sobre-les-llc` |
| `faq` | 200 `/es/preguntas-frecuentes` | 200 `/en/faq` | 200 `/fr/questions-frequentes` | 200 `/de/haufige-fragen` | 200 `/pt/perguntas-frequentes` | 200 `/ca/preguntes-frequents` |
| `book` | 200 `/es/agendar` | 200 `/en/book` | 200 `/fr/reserver` | 200 `/de/buchen` | 200 `/pt/agendar` | 200 `/ca/agendar` |
| `pillar_open_llc` | 200 `/es/abrir-llc-estados-unidos` | 200 `/en/open-llc-usa` | 200 `/fr/ouvrir-llc-etats-unis` | 200 `/de/llc-usa-eroeffnen` | 200 `/pt/abrir-llc-eua` | 200 `/ca/obrir-llc-eua` |
| `service_llc_nm` | 200 `/es/servicios/llc-nuevo-mexico` | 200 `/en/services/llc-new-mexico` | 200 `/fr/services/llc-nouveau-mexique` | 200 `/de/leistungen/llc-new-mexico` | 200 `/pt/servicos/llc-novo-mexico` | 200 `/ca/serveis/llc-nou-mexic` |
| `service_llc_wy` | 200 `/es/servicios/llc-wyoming` | 200 `/en/services/llc-wyoming` | 200 `/fr/services/llc-wyoming` | 200 `/de/leistungen/llc-wyoming` | 200 `/pt/servicos/llc-wyoming` | 200 `/ca/serveis/llc-wyoming` |
| `service_llc_de` | 200 `/es/servicios/llc-delaware` | 200 `/en/services/llc-delaware` | 200 `/fr/services/llc-delaware` | 200 `/de/leistungen/llc-delaware` | 200 `/pt/servicos/llc-delaware` | 200 `/ca/serveis/llc-delaware` |
| `service_llc_fl` | 200 `/es/servicios/llc-florida` | 200 `/en/services/llc-florida` | 200 `/fr/services/llc-floride` | 200 `/de/leistungen/llc-florida` | 200 `/pt/servicos/llc-florida` | 200 `/ca/serveis/llc-florida` |
| `service_itin` | 200 `/es/servicios/obten-tu-itin` | 200 `/en/services/get-your-itin` | 200 `/fr/services/obtiens-ton-itin` | 200 `/de/leistungen/hol-deine-itin` | 200 `/pt/servicos/obtenha-seu-itin` | 200 `/ca/serveis/obte-el-teu-itin` |
| `legal_terms` | 200 `/es/legal/terminos` | 200 `/en/legal/terms` | 200 `/fr/legal/conditions` | 200 `/de/legal/agb` | 200 `/pt/legal/termos` | 200 `/ca/legal/termes` |
| `legal_privacy` | 200 `/es/legal/privacidad` | 200 `/en/legal/privacy` | 200 `/fr/legal/confidentialite` | 200 `/de/legal/datenschutz` | 200 `/pt/legal/privacidade` | 200 `/ca/legal/privacitat` |
| `legal_cookies` | 200 `/es/legal/cookies` | 200 `/en/legal/cookies` | 200 `/fr/legal/cookies` | 200 `/de/legal/cookies` | 200 `/pt/legal/cookies` | 200 `/ca/legal/cookies` |
| `legal_refunds` | 200 `/es/legal/reembolsos` | 200 `/en/legal/refunds` | 200 `/fr/legal/remboursements` | 200 `/de/legal/erstattungen` | 200 `/pt/legal/reembolsos` | 200 `/ca/legal/reemborsaments` |
| `legal_disclaimer` | 200 `/es/legal/disclaimer` | 200 `/en/legal/disclaimer` | 200 `/fr/legal/avertissement` | 200 `/de/legal/haftungsausschluss` | 200 `/pt/legal/aviso-legal` | 200 `/ca/legal/avis-legal` |

### 1b. Detalle por página y idioma (con título)

| route key | lang | path | status | título (primeros 80 chars) |
| --- | --- | --- | --- | --- |
| `home` | es | `/es` | 200 | Paga menos impuestos legalmente con LLC en EE.UU. \| Exentax |
| `home` | en | `/en` | 200 | Pay less taxes legally with your US LLC \| Exentax |
| `home` | fr | `/fr` | 200 | Payez moins d'impôts avec votre LLC aux USA \| Exentax |
| `home` | de | `/de` | 200 | Zahlen Sie legal weniger Steuern mit Ihrer US-LLC \| Exentax |
| `home` | pt | `/pt` | 200 | Pague menos impostos com sua LLC nos EUA \| Exentax |
| `home` | ca | `/ca` | 200 | Paga menys impostos amb la teva LLC als EUA \| Exentax |
| `how_we_work` | es | `/es/como-trabajamos` | 200 | Cómo funciona: tu LLC lista en 4 pasos \| Exentax |
| `how_we_work` | en | `/en/how-we-work` | 200 | How it works: your LLC ready in 4 steps \| Exentax |
| `how_we_work` | fr | `/fr/comment-nous-travaillons` | 200 | Comment ça marche : votre LLC prête en 4 étapes \| Exentax |
| `how_we_work` | de | `/de/wie-wir-arbeiten` | 200 | So funktioniert's: Ihre LLC in 4 Schritten \| Exentax |
| `how_we_work` | pt | `/pt/como-trabalhamos` | 200 | Como funciona: sua LLC pronta em 4 passos \| Exentax |
| `how_we_work` | ca | `/ca/com-treballem` | 200 | Com funciona: la teva LLC llesta en 4 passos \| Exentax |
| `our_services` | es | `/es/servicios` | 200 | Servicios de constitución LLC en EE.UU. \| Exentax |
| `our_services` | en | `/en/services` | 200 | US LLC formation services \| Exentax |
| `our_services` | fr | `/fr/services` | 200 | Services de constitution de LLC aux États-Unis \| Exentax |
| `our_services` | de | `/de/leistungen` | 200 | LLC-Gründungsservices in den USA \| Exentax |
| `our_services` | pt | `/pt/servicos` | 200 | Serviços de constituição de LLC nos EUA \| Exentax |
| `our_services` | ca | `/ca/serveis` | 200 | Serveis de constitució de LLC als EUA \| Exentax |
| `about_llc` | es | `/es/sobre-las-llc` | 200 | LLC en EE.UU. para no residentes: Guía 2026 \| Exentax |
| `about_llc` | en | `/en/about-llc` | 200 | US LLC for non-residents: Complete guide 2026 \| Exentax |
| `about_llc` | fr | `/fr/a-propos-des-llc` | 200 | LLC aux USA pour non-résidents: Guide 2026 \| Exentax |
| `about_llc` | de | `/de/uber-llc` | 200 | US-LLC für Nicht-Residenten: Leitfaden 2026 \| Exentax |
| `about_llc` | pt | `/pt/sobre-llc` | 200 | LLC nos EUA para não residentes: Guia 2026 \| Exentax |
| `about_llc` | ca | `/ca/sobre-les-llc` | 200 | LLC als EUA per a no residents: Guia 2026 \| Exentax |
| `faq` | es | `/es/preguntas-frecuentes` | 200 | Preguntas frecuentes sobre LLC en EE.UU. \| Exentax |
| `faq` | en | `/en/faq` | 200 | Frequently asked questions about US LLCs \| Exentax |
| `faq` | fr | `/fr/questions-frequentes` | 200 | Questions fréquentes sur les LLC aux USA \| Exentax |
| `faq` | de | `/de/haufige-fragen` | 200 | Häufige Fragen zu US-LLCs \| Exentax |
| `faq` | pt | `/pt/perguntas-frequentes` | 200 | Perguntas frequentes sobre LLC nos EUA \| Exentax |
| `faq` | ca | `/ca/preguntes-frequents` | 200 | Preguntes freqüents sobre LLC als EUA \| Exentax |
| `book` | es | `/es/agendar` | 200 | Asesoría fiscal estratégica 30 min \| Exentax |
| `book` | en | `/en/book` | 200 | 30-min strategic tax consultation \| Exentax |
| `book` | fr | `/fr/reserver` | 200 | Consultation fiscale stratégique 30 min \| Exentax |
| `book` | de | `/de/buchen` | 200 | 30-min strategische Steuerberatung \| Exentax |
| `book` | pt | `/pt/agendar` | 200 | Consultoria fiscal estratégica 30 min \| Exentax |
| `book` | ca | `/ca/agendar` | 200 | Assessoria fiscal estratègica 30 min \| Exentax |
| `pillar_open_llc` | es | `/es/abrir-llc-estados-unidos` | 200 | Abrir LLC en Estados Unidos: guía paso a paso 2026 \| Exentax |
| `pillar_open_llc` | en | `/en/open-llc-usa` | 200 | Open a US LLC in 2026: step-by-step guide for non-residents \| Exentax |
| `pillar_open_llc` | fr | `/fr/ouvrir-llc-etats-unis` | 200 | Ouvrir une LLC aux États-Unis en 2026 : le guide pas à pas \| Exentax |
| `pillar_open_llc` | de | `/de/llc-usa-eroeffnen` | 200 | US-LLC eröffnen 2026: Schritt-für-Schritt-Anleitung für Nicht-Residenten \| Exent |
| `pillar_open_llc` | pt | `/pt/abrir-llc-eua` | 200 | Abrir uma LLC nos EUA: guia passo a passo 2026 \| Exentax |
| `pillar_open_llc` | ca | `/ca/obrir-llc-eua` | 200 | Obrir una LLC als Estats Units: guia pas a pas 2026 \| Exentax |
| `service_llc_nm` | es | `/es/servicios/llc-nuevo-mexico` | 200 | Nuevo México: 0% impuesto estatal para tu LLC \| Exentax |
| `service_llc_nm` | en | `/en/services/llc-new-mexico` | 200 | New Mexico LLC: low-cost privacy for solo founders \| Exentax |
| `service_llc_nm` | fr | `/fr/services/llc-nouveau-mexique` | 200 | LLC au Nouveau-Mexique : zéro paperasse annuelle \| Exentax |
| `service_llc_nm` | de | `/de/leistungen/llc-new-mexico` | 200 | New Mexico LLC: steueroptimiert für Selbstständige \| Exentax |
| `service_llc_nm` | pt | `/pt/servicos/llc-novo-mexico` | 200 | LLC no Novo México: estrutura enxuta e barata \| Exentax |
| `service_llc_nm` | ca | `/ca/serveis/llc-nou-mexic` | 200 | LLC a Nou Mèxic: cost mínim i sense paperasses \| Exentax |
| `service_llc_wy` | es | `/es/servicios/llc-wyoming` | 200 | Wyoming: blindaje patrimonial líder en EE. UU. \| Exentax |
| `service_llc_wy` | en | `/en/services/llc-wyoming` | 200 | Wyoming LLC: gold-standard U.S. asset protection \| Exentax |
| `service_llc_wy` | fr | `/fr/services/llc-wyoming` | 200 | LLC au Wyoming : bouclier patrimonial américain \| Exentax |
| `service_llc_wy` | de | `/de/leistungen/llc-wyoming` | 200 | Wyoming LLC: Vermögensschutz nach US-Standard \| Exentax |
| `service_llc_wy` | pt | `/pt/servicos/llc-wyoming` | 200 | LLC no Wyoming: blindagem patrimonial premium \| Exentax |
| `service_llc_wy` | ca | `/ca/serveis/llc-wyoming` | 200 | LLC a Wyoming: el blindatge patrimonial dels EUA \| Exentax |
| `service_llc_de` | es | `/es/servicios/llc-delaware` | 200 | Delaware: la LLC favorita de los inversores \| Exentax |
| `service_llc_de` | en | `/en/services/llc-delaware` | 200 | Delaware LLC: the choice of VCs and B2B buyers \| Exentax |
| `service_llc_de` | fr | `/fr/services/llc-delaware` | 200 | LLC au Delaware : prête pour la levée de fonds \| Exentax |
| `service_llc_de` | de | `/de/leistungen/llc-delaware` | 200 | Delaware LLC: Rechtssicherheit für Investoren \| Exentax |
| `service_llc_de` | pt | `/pt/servicos/llc-delaware` | 200 | LLC em Delaware: pronta para investidores e M&A \| Exentax |
| `service_llc_de` | ca | `/ca/serveis/llc-delaware` | 200 | LLC a Delaware: pensada per aixecar capital VC \| Exentax |
| `service_llc_fl` | es | `/es/servicios/llc-florida` | 200 | Florida LLC: tu puerta al mercado hispano de Miami \| Exentax |
| `service_llc_fl` | en | `/en/services/llc-florida` | 200 | Florida LLC: your gateway to Miami's Latin market \| Exentax |
| `service_llc_fl` | fr | `/fr/services/llc-floride` | 200 | LLC en Floride : accès direct au marché latino \| Exentax |
| `service_llc_fl` | de | `/de/leistungen/llc-florida` | 200 | Florida LLC: Tor zum lateinamerikanischen Markt \| Exentax |
| `service_llc_fl` | pt | `/pt/servicos/llc-florida` | 200 | LLC na Flórida: ponte para o mercado de Miami \| Exentax |
| `service_llc_fl` | ca | `/ca/serveis/llc-florida` | 200 | LLC a Florida: pont català cap al mercat llatí \| Exentax |
| `service_itin` | es | `/es/servicios/obten-tu-itin` | 200 | ITIN sin viajar a EE. UU.: lo gestionamos por ti \| Exentax |
| `service_itin` | en | `/en/services/get-your-itin` | 200 | ITIN without leaving home: skip the IRS in person \| Exentax |
| `service_itin` | fr | `/fr/services/obtiens-ton-itin` | 200 | ITIN sans ambassade : nous le gérons en ligne \| Exentax |
| `service_itin` | de | `/de/leistungen/hol-deine-itin` | 200 | ITIN ohne Botschaft: alles aus einer Hand erledigt \| Exentax |
| `service_itin` | pt | `/pt/servicos/obtenha-seu-itin` | 200 | ITIN sem viajar aos EUA: tudo gerenciado por nós \| Exentax |
| `service_itin` | ca | `/ca/serveis/obte-el-teu-itin` | 200 | ITIN sense viatjar als EUA: ho gestionem nosaltres \| Exentax |
| `legal_terms` | es | `/es/legal/terminos` | 200 | Términos y condiciones \| Exentax |
| `legal_terms` | en | `/en/legal/terms` | 200 | Terms and Conditions \| Exentax |
| `legal_terms` | fr | `/fr/legal/conditions` | 200 | Conditions générales \| Exentax |
| `legal_terms` | de | `/de/legal/agb` | 200 | Allgemeine Geschäftsbedingungen \| Exentax |
| `legal_terms` | pt | `/pt/legal/termos` | 200 | Termos e condições \| Exentax |
| `legal_terms` | ca | `/ca/legal/termes` | 200 | Termes i condicions \| Exentax |
| `legal_privacy` | es | `/es/legal/privacidad` | 200 | Política de privacidad \| Exentax |
| `legal_privacy` | en | `/en/legal/privacy` | 200 | Privacy Policy \| Exentax |
| `legal_privacy` | fr | `/fr/legal/confidentialite` | 200 | Politique de confidentialité \| Exentax |
| `legal_privacy` | de | `/de/legal/datenschutz` | 200 | Datenschutzrichtlinie \| Exentax |
| `legal_privacy` | pt | `/pt/legal/privacidade` | 200 | Política de privacidade \| Exentax |
| `legal_privacy` | ca | `/ca/legal/privacitat` | 200 | Política de privacitat \| Exentax |
| `legal_cookies` | es | `/es/legal/cookies` | 200 | Política de cookies \| Exentax |
| `legal_cookies` | en | `/en/legal/cookies` | 200 | Cookie Policy \| Exentax |
| `legal_cookies` | fr | `/fr/legal/cookies` | 200 | Politique de cookies \| Exentax |
| `legal_cookies` | de | `/de/legal/cookies` | 200 | Cookie-Richtlinie \| Exentax |
| `legal_cookies` | pt | `/pt/legal/cookies` | 200 | Política de cookies \| Exentax |
| `legal_cookies` | ca | `/ca/legal/cookies` | 200 | Política de galetes \| Exentax |
| `legal_refunds` | es | `/es/legal/reembolsos` | 200 | Política de reembolsos \| Exentax |
| `legal_refunds` | en | `/en/legal/refunds` | 200 | Refund Policy \| Exentax |
| `legal_refunds` | fr | `/fr/legal/remboursements` | 200 | Politique de remboursement \| Exentax |
| `legal_refunds` | de | `/de/legal/erstattungen` | 200 | Erstattungsrichtlinie \| Exentax |
| `legal_refunds` | pt | `/pt/legal/reembolsos` | 200 | Política de reembolso \| Exentax |
| `legal_refunds` | ca | `/ca/legal/reemborsaments` | 200 | Política de reemborsament \| Exentax |
| `legal_disclaimer` | es | `/es/legal/disclaimer` | 200 | Disclaimer legal y fiscal \| Exentax |
| `legal_disclaimer` | en | `/en/legal/disclaimer` | 200 | Legal and Tax Disclaimer \| Exentax |
| `legal_disclaimer` | fr | `/fr/legal/avertissement` | 200 | Avertissement juridique et fiscal \| Exentax |
| `legal_disclaimer` | de | `/de/legal/haftungsausschluss` | 200 | Rechts- und Steuerhaftungsausschluss \| Exentax |
| `legal_disclaimer` | pt | `/pt/legal/aviso-legal` | 200 | Aviso legal e fiscal \| Exentax |
| `legal_disclaimer` | ca | `/ca/legal/avis-legal` | 200 | Avís legal i fiscal \| Exentax |

## 2. Blog: índices y 672 URLs de posts

### 2a. Blog index por idioma

| lang | path | status | título |
| --- | --- | --- | --- |
| es | `/es/blog` | 200 | Blog sobre LLC, impuestos y fiscalidad internacional \| Exentax |
| en | `/en/blog` | 200 | Blog: US LLCs, international taxation & digital business \| Exentax |
| fr | `/fr/blog` | 200 | Blog : LLC aux USA, fiscalité internationale et business digital \| Exentax |
| de | `/de/blog` | 200 | Blog: US-LLC, internationale Besteuerung & digitales Business \| Exentax |
| pt | `/pt/blog` | 200 | Blog: LLC nos EUA, tributação internacional e negócios digitais \| Exentax |
| ca | `/ca/blog` | 200 | Blog: LLC als EUA, fiscalitat internacional i negoci digital \| Exentax |

### 2b. Posts publicados (672 URLs canónicas, una por traducción real)

Total ES: 112 posts. Cobertura por idioma:

| lang | posts disponibles |
| --- | --- |
| es | 112 |
| en | 112 |
| fr | 112 |
| de | 112 |
| pt | 112 |
| ca | 112 |

Un post se considera "disponible" si existe el archivo `.ts` correspondiente en `client/src/data/blog-content/<lang>/`.

Distribución de status HTTP en los posts auditados:

- `200`: 672

Todos los 672 posts auditados respondieron `200 OK`.

## 3. Redirecciones legacy (50 entradas en `LEGACY_ES_REDIRECTS`)

Cada origen debe responder `301` con `Location` igual al destino esperado.

| origen | esperado | status | location | OK |
| --- | --- | --- | --- | --- |
| `/sobre-las-llc` | `/es/sobre-las-llc` | 301 | `/es/sobre-las-llc` | ✓ |
| `/como-trabajamos` | `/es/como-trabajamos` | 301 | `/es/como-trabajamos` | ✓ |
| `/nuestros-servicios` | `/es/servicios` | 301 | `/es/servicios` | ✓ |
| `/servicios` | `/es/servicios` | 301 | `/es/servicios` | ✓ |
| `/preguntas-frecuentes` | `/es/preguntas-frecuentes` | 301 | `/es/preguntas-frecuentes` | ✓ |
| `/agendar` | `/es/agendar` | 301 | `/es/agendar` | ✓ |
| `/blog` | `/es/blog` | 301 | `/es/blog` | ✓ |
| `/legal/terminos` | `/es/legal/terminos` | 301 | `/es/legal/terminos` | ✓ |
| `/legal/privacidad` | `/es/legal/privacidad` | 301 | `/es/legal/privacidad` | ✓ |
| `/legal/cookies` | `/es/legal/cookies` | 301 | `/es/legal/cookies` | ✓ |
| `/legal/reembolsos` | `/es/legal/reembolsos` | 301 | `/es/legal/reembolsos` | ✓ |
| `/legal/disclaimer` | `/es/legal/disclaimer` | 301 | `/es/legal/disclaimer` | ✓ |
| `/es/nuestros-servicios` | `/es/servicios` | 301 | `/es/servicios` | ✓ |
| `/es/nuestros-servicios/llc-nuevo-mexico` | `/es/servicios/llc-nuevo-mexico` | 301 | `/es/servicios/llc-nuevo-mexico` | ✓ |
| `/es/nuestros-servicios/llc-wyoming` | `/es/servicios/llc-wyoming` | 301 | `/es/servicios/llc-wyoming` | ✓ |
| `/es/nuestros-servicios/llc-delaware` | `/es/servicios/llc-delaware` | 301 | `/es/servicios/llc-delaware` | ✓ |
| `/es/nuestros-servicios/llc-florida` | `/es/servicios/llc-florida` | 301 | `/es/servicios/llc-florida` | ✓ |
| `/es/nuestros-servicios/obten-tu-itin` | `/es/servicios/obten-tu-itin` | 301 | `/es/servicios/obten-tu-itin` | ✓ |
| `/en/our-services` | `/en/services` | 301 | `/en/services` | ✓ |
| `/en/our-services/llc-new-mexico` | `/en/services/llc-new-mexico` | 301 | `/en/services/llc-new-mexico` | ✓ |
| `/en/our-services/llc-wyoming` | `/en/services/llc-wyoming` | 301 | `/en/services/llc-wyoming` | ✓ |
| `/en/our-services/llc-delaware` | `/en/services/llc-delaware` | 301 | `/en/services/llc-delaware` | ✓ |
| `/en/our-services/llc-florida` | `/en/services/llc-florida` | 301 | `/en/services/llc-florida` | ✓ |
| `/en/our-services/get-your-itin` | `/en/services/get-your-itin` | 301 | `/en/services/get-your-itin` | ✓ |
| `/fr/nos-services` | `/fr/services` | 301 | `/fr/services` | ✓ |
| `/fr/nos-services/llc-nouveau-mexique` | `/fr/services/llc-nouveau-mexique` | 301 | `/fr/services/llc-nouveau-mexique` | ✓ |
| `/fr/nos-services/llc-wyoming` | `/fr/services/llc-wyoming` | 301 | `/fr/services/llc-wyoming` | ✓ |
| `/fr/nos-services/llc-delaware` | `/fr/services/llc-delaware` | 301 | `/fr/services/llc-delaware` | ✓ |
| `/fr/nos-services/llc-floride` | `/fr/services/llc-floride` | 301 | `/fr/services/llc-floride` | ✓ |
| `/fr/nos-services/obtenir-votre-itin` | `/fr/services/obtiens-ton-itin` | 301 | `/fr/services/obtiens-ton-itin` | ✓ |
| `/fr/services/obtenir-votre-itin` | `/fr/services/obtiens-ton-itin` | 301 | `/fr/services/obtiens-ton-itin` | ✓ |
| `/de/unsere-leistungen` | `/de/leistungen` | 301 | `/de/leistungen` | ✓ |
| `/de/unsere-leistungen/llc-new-mexico` | `/de/leistungen/llc-new-mexico` | 301 | `/de/leistungen/llc-new-mexico` | ✓ |
| `/de/unsere-leistungen/llc-wyoming` | `/de/leistungen/llc-wyoming` | 301 | `/de/leistungen/llc-wyoming` | ✓ |
| `/de/unsere-leistungen/llc-delaware` | `/de/leistungen/llc-delaware` | 301 | `/de/leistungen/llc-delaware` | ✓ |
| `/de/unsere-leistungen/llc-florida` | `/de/leistungen/llc-florida` | 301 | `/de/leistungen/llc-florida` | ✓ |
| `/de/unsere-leistungen/itin-beantragen` | `/de/leistungen/hol-deine-itin` | 301 | `/de/leistungen/hol-deine-itin` | ✓ |
| `/de/leistungen/itin-beantragen` | `/de/leistungen/hol-deine-itin` | 301 | `/de/leistungen/hol-deine-itin` | ✓ |
| `/pt/nossos-servicos` | `/pt/servicos` | 301 | `/pt/servicos` | ✓ |
| `/pt/nossos-servicos/llc-novo-mexico` | `/pt/servicos/llc-novo-mexico` | 301 | `/pt/servicos/llc-novo-mexico` | ✓ |
| `/pt/nossos-servicos/llc-wyoming` | `/pt/servicos/llc-wyoming` | 301 | `/pt/servicos/llc-wyoming` | ✓ |
| `/pt/nossos-servicos/llc-delaware` | `/pt/servicos/llc-delaware` | 301 | `/pt/servicos/llc-delaware` | ✓ |
| `/pt/nossos-servicos/llc-florida` | `/pt/servicos/llc-florida` | 301 | `/pt/servicos/llc-florida` | ✓ |
| `/pt/nossos-servicos/obtenha-seu-itin` | `/pt/servicos/obtenha-seu-itin` | 301 | `/pt/servicos/obtenha-seu-itin` | ✓ |
| `/ca/els-nostres-serveis` | `/ca/serveis` | 301 | `/ca/serveis` | ✓ |
| `/ca/els-nostres-serveis/llc-nou-mexic` | `/ca/serveis/llc-nou-mexic` | 301 | `/ca/serveis/llc-nou-mexic` | ✓ |
| `/ca/els-nostres-serveis/llc-wyoming` | `/ca/serveis/llc-wyoming` | 301 | `/ca/serveis/llc-wyoming` | ✓ |
| `/ca/els-nostres-serveis/llc-delaware` | `/ca/serveis/llc-delaware` | 301 | `/ca/serveis/llc-delaware` | ✓ |
| `/ca/els-nostres-serveis/llc-florida` | `/ca/serveis/llc-florida` | 301 | `/ca/serveis/llc-florida` | ✓ |
| `/ca/els-nostres-serveis/obte-el-teu-itin` | `/ca/serveis/obte-el-teu-itin` | 301 | `/ca/serveis/obte-el-teu-itin` | ✓ |

## 4. Páginas con `noindex` (no indexables)

`/links` y `/start` son land-page anti-fuga; `/booking/:token` y `/admin/agenda/:bookingId` son páginas operativas privadas. Todas deben incluir `noindex` en `X-Robots-Tag` o en `<meta name="robots">`.

| path | status | X-Robots-Tag | meta robots |
| --- | --- | --- | --- |
| `/links` | 200 | `noindex, nofollow` | `noindex, nofollow` |
| `/start` | 200 | `noindex, nofollow` | `noindex, nofollow` |
| `/booking/abc-123-fake-token` | 200 | `noindex, nofollow` | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| `/admin/agenda/non-existent` | 200 | `noindex, nofollow` | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |

## 5. Cobertura del sitemap

- `/sitemap.xml` (índice): status 200, entradas: 3
- `/sitemap-pages.xml`: status 200, URLs: 102 — esperadas: 102
- `/sitemap-faq.xml`: status 200, URLs: 6 — esperadas: 6
- `/sitemap-blog.xml`: status 200, URLs: 672 — esperadas: 672

### URLs declaradas que no aparecen en sitemap-pages.xml: 0
- (ninguna)

### URLs en sitemap-pages.xml que no son canónicas declaradas: 0
- (ninguna)

### Posts esperados que no aparecen en sitemap-blog.xml: 0
- (ninguno)

### URLs en sitemap-blog.xml que no aparecen en el inventario de posts: 0
- (ninguna)

### Cobertura FAQ: faltan 0, huérfanas 0
- (cobertura completa: 1 entrada por idioma)

## 6. `canonical` + `hreflang` por página (verificación exhaustiva 102/102)

Cada una de las 102 páginas canónicas (17 route keys × 6 idiomas) se verifica individualmente: se compara el set `(hreflang, href)` esperado (derivado de `ROUTE_SLUGS` + `HREFLANG_BCP47`) con el set realmente devuelto por el servidor en el `<head>` del HTML (`<link rel="canonical">` + `<link rel="alternate">`). Cualquier desviación se reporta como `BLOCKER` en la sección 9.

> Nota técnica: `server/static.ts::injectMeta` se ejecuta tanto en producción (sobre el `index.html` build) como en desarrollo (`server/vite.ts` lo aplica tras `vite.transformIndexHtml`), por lo que el HTML servido en ambos entornos contiene el `canonical` y los 6 alternates + `x-default`. El header `Link` en `server/routes.ts` se mantiene como señal redundante. El cliente (`client/src/components/SEO.tsx`) re-emite los mismos `<link rel="alternate">` tras montar. Las columnas reflejan los valores **observados** en la respuesta.

### 6a. Resumen agregado (102 páginas)

| chequeo | OK | total |
| --- | --- | --- |
| canonical bit-a-bit | 102 | 102 |
| 6 hreflangs (sin x-default) | 102 | 102 |
| x-default presente y con href correcto | 102 | 102 |
| set (hreflang, href) coincide exactamente con el esperado | 102 | 102 |

### 6b. Resultado por route key (`ok / total`)

| route key | resultado | si <total: idiomas con desviación |
| --- | --- | --- |
| `about_llc` | 6/6 | — |
| `book` | 6/6 | — |
| `faq` | 6/6 | — |
| `home` | 6/6 | — |
| `how_we_work` | 6/6 | — |
| `legal_cookies` | 6/6 | — |
| `legal_disclaimer` | 6/6 | — |
| `legal_privacy` | 6/6 | — |
| `legal_refunds` | 6/6 | — |
| `legal_terms` | 6/6 | — |
| `our_services` | 6/6 | — |
| `pillar_open_llc` | 6/6 | — |
| `service_itin` | 6/6 | — |
| `service_llc_de` | 6/6 | — |
| `service_llc_fl` | 6/6 | — |
| `service_llc_nm` | 6/6 | — |
| `service_llc_wy` | 6/6 | — |

### 6c. Muestra detallada (home, hub servicios, subpágina NM, legal/privacy, FAQ, pillar open_llc)

Códigos de columna: `hreflang count` = nº de hreflangs (sin contar `x-default`); `x-default OK` = href del `x-default` coincide bit-a-bit con la URL ES canónica; `set OK` = el set `(hreflang, href)` coincide con el esperado sin huecos ni códigos sobrantes.

| route key | lang | path | status | canonical OK | canonical | hreflang count | x-default | x-default OK | set OK |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `home` | es | `/es` | 200 | ✓ | `https://exentax.com/es` | 6 | ✓ | ✓ | ✓ |
| `home` | en | `/en` | 200 | ✓ | `https://exentax.com/en` | 6 | ✓ | ✓ | ✓ |
| `home` | fr | `/fr` | 200 | ✓ | `https://exentax.com/fr` | 6 | ✓ | ✓ | ✓ |
| `home` | de | `/de` | 200 | ✓ | `https://exentax.com/de` | 6 | ✓ | ✓ | ✓ |
| `home` | pt | `/pt` | 200 | ✓ | `https://exentax.com/pt` | 6 | ✓ | ✓ | ✓ |
| `home` | ca | `/ca` | 200 | ✓ | `https://exentax.com/ca` | 6 | ✓ | ✓ | ✓ |
| `our_services` | es | `/es/servicios` | 200 | ✓ | `https://exentax.com/es/servicios` | 6 | ✓ | ✓ | ✓ |
| `our_services` | en | `/en/services` | 200 | ✓ | `https://exentax.com/en/services` | 6 | ✓ | ✓ | ✓ |
| `our_services` | fr | `/fr/services` | 200 | ✓ | `https://exentax.com/fr/services` | 6 | ✓ | ✓ | ✓ |
| `our_services` | de | `/de/leistungen` | 200 | ✓ | `https://exentax.com/de/leistungen` | 6 | ✓ | ✓ | ✓ |
| `our_services` | pt | `/pt/servicos` | 200 | ✓ | `https://exentax.com/pt/servicos` | 6 | ✓ | ✓ | ✓ |
| `our_services` | ca | `/ca/serveis` | 200 | ✓ | `https://exentax.com/ca/serveis` | 6 | ✓ | ✓ | ✓ |
| `faq` | es | `/es/preguntas-frecuentes` | 200 | ✓ | `https://exentax.com/es/preguntas-frecuentes` | 6 | ✓ | ✓ | ✓ |
| `faq` | en | `/en/faq` | 200 | ✓ | `https://exentax.com/en/faq` | 6 | ✓ | ✓ | ✓ |
| `faq` | fr | `/fr/questions-frequentes` | 200 | ✓ | `https://exentax.com/fr/questions-frequentes` | 6 | ✓ | ✓ | ✓ |
| `faq` | de | `/de/haufige-fragen` | 200 | ✓ | `https://exentax.com/de/haufige-fragen` | 6 | ✓ | ✓ | ✓ |
| `faq` | pt | `/pt/perguntas-frequentes` | 200 | ✓ | `https://exentax.com/pt/perguntas-frequentes` | 6 | ✓ | ✓ | ✓ |
| `faq` | ca | `/ca/preguntes-frequents` | 200 | ✓ | `https://exentax.com/ca/preguntes-frequents` | 6 | ✓ | ✓ | ✓ |
| `pillar_open_llc` | es | `/es/abrir-llc-estados-unidos` | 200 | ✓ | `https://exentax.com/es/abrir-llc-estados-unidos` | 6 | ✓ | ✓ | ✓ |
| `pillar_open_llc` | en | `/en/open-llc-usa` | 200 | ✓ | `https://exentax.com/en/open-llc-usa` | 6 | ✓ | ✓ | ✓ |
| `pillar_open_llc` | fr | `/fr/ouvrir-llc-etats-unis` | 200 | ✓ | `https://exentax.com/fr/ouvrir-llc-etats-unis` | 6 | ✓ | ✓ | ✓ |
| `pillar_open_llc` | de | `/de/llc-usa-eroeffnen` | 200 | ✓ | `https://exentax.com/de/llc-usa-eroeffnen` | 6 | ✓ | ✓ | ✓ |
| `pillar_open_llc` | pt | `/pt/abrir-llc-eua` | 200 | ✓ | `https://exentax.com/pt/abrir-llc-eua` | 6 | ✓ | ✓ | ✓ |
| `pillar_open_llc` | ca | `/ca/obrir-llc-eua` | 200 | ✓ | `https://exentax.com/ca/obrir-llc-eua` | 6 | ✓ | ✓ | ✓ |
| `service_llc_nm` | es | `/es/servicios/llc-nuevo-mexico` | 200 | ✓ | `https://exentax.com/es/servicios/llc-nuevo-mexico` | 6 | ✓ | ✓ | ✓ |
| `service_llc_nm` | en | `/en/services/llc-new-mexico` | 200 | ✓ | `https://exentax.com/en/services/llc-new-mexico` | 6 | ✓ | ✓ | ✓ |
| `service_llc_nm` | fr | `/fr/services/llc-nouveau-mexique` | 200 | ✓ | `https://exentax.com/fr/services/llc-nouveau-mexique` | 6 | ✓ | ✓ | ✓ |
| `service_llc_nm` | de | `/de/leistungen/llc-new-mexico` | 200 | ✓ | `https://exentax.com/de/leistungen/llc-new-mexico` | 6 | ✓ | ✓ | ✓ |
| `service_llc_nm` | pt | `/pt/servicos/llc-novo-mexico` | 200 | ✓ | `https://exentax.com/pt/servicos/llc-novo-mexico` | 6 | ✓ | ✓ | ✓ |
| `service_llc_nm` | ca | `/ca/serveis/llc-nou-mexic` | 200 | ✓ | `https://exentax.com/ca/serveis/llc-nou-mexic` | 6 | ✓ | ✓ | ✓ |
| `legal_privacy` | es | `/es/legal/privacidad` | 200 | ✓ | `https://exentax.com/es/legal/privacidad` | 6 | ✓ | ✓ | ✓ |
| `legal_privacy` | en | `/en/legal/privacy` | 200 | ✓ | `https://exentax.com/en/legal/privacy` | 6 | ✓ | ✓ | ✓ |
| `legal_privacy` | fr | `/fr/legal/confidentialite` | 200 | ✓ | `https://exentax.com/fr/legal/confidentialite` | 6 | ✓ | ✓ | ✓ |
| `legal_privacy` | de | `/de/legal/datenschutz` | 200 | ✓ | `https://exentax.com/de/legal/datenschutz` | 6 | ✓ | ✓ | ✓ |
| `legal_privacy` | pt | `/pt/legal/privacidade` | 200 | ✓ | `https://exentax.com/pt/legal/privacidade` | 6 | ✓ | ✓ | ✓ |
| `legal_privacy` | ca | `/ca/legal/privacitat` | 200 | ✓ | `https://exentax.com/ca/legal/privacitat` | 6 | ✓ | ✓ | ✓ |

### 6d. Reciprocidad de hreflang (0 desviaciones)

Cada URL emitida como `hreflang` por una página canónica debe pertenecer al inventario canónico (las 102 URLs de la sección 1). Si no, alguien añadió un alternate a un slug retirado.

- (sin desviaciones: las 612 URLs alternates emitidas por las 102 páginas son todas canónicas)

### 6e. Spot-check blog post (`amazon-ecommerce-llc-vender-online`)

Para los posts de blog el set de hreflangs depende de `BLOG_SLUG_I18N` y de la disponibilidad por idioma; el `Link` header solo trae el `canonical`, pero `injectMeta` inyecta canonical + alternates dentro del `<head>` tanto en dev (`server/vite.ts`) como en prod (`server/static.ts`). La columna `expected count` es el set esperado según el data layer; `observed count` es lo que realmente se vio en el HTML.

| lang | path | status | canonical OK | expected count | observed count | x-default observado | x-default OK |
| --- | --- | --- | --- | --- | --- | --- | --- |
| es | `/es/blog/amazon-ecommerce-llc-vender-online` | 200 | ✓ | 6 | 6 | ✓ | ✓ |
| en | `/en/blog/selling-on-amazon-with-your-us-llc-complete-guide-for` | 200 | ✓ | 6 | 6 | ✓ | ✓ |
| fr | `/fr/blog/vendre-sur-amazon-avec-votre-llc-guide-complet-pour-vendeurs` | 200 | ✓ | 6 | 6 | ✓ | ✓ |
| de | `/de/blog/auf-amazon-verkaufen-mit-ihrer-us-llc-vollstandiger` | 200 | ✓ | 6 | 6 | ✓ | ✓ |
| pt | `/pt/blog/vender-na-amazon-com-sua-llc-americana-guia-completo` | 200 | ✓ | 6 | 6 | ✓ | ✓ |
| ca | `/ca/blog/vendre-a-amazon-amb-la-teva-llc-americana-guia-completa` | 200 | ✓ | 6 | 6 | ✓ | ✓ |

## 7. Higiene de slug por idioma

- Route keys con issues de hygiene (lowercase, sin diacríticos, sin guiones bajos, sin %, sin dobles barras): 0

- Colisiones intra-idioma entre route keys: 0

- Blog slugs con issues de hygiene: 0

- Colisiones intra-idioma entre blog slugs: 0

## 8. Consistencia `ROUTE_SLUGS` ↔ `ALL_ROUTE_KEYS` ↔ `LEGACY_ES_REDIRECTS` ↔ `HREFLANG_BCP47` ↔ `BLOG_SLUG_I18N`

Esta sección está **forzada** por el propio script: las 4 constantes inventariadas se parsean directamente desde el código fuente al inicio (`loadRouteSlugs`, `loadAllRouteKeys`, `loadLegacyRedirects`, `loadHreflangBcp47`). Si una sola clave o entrada no cuadra con `LANGS = [es,en,fr,de,pt,ca]` o entre sí, el script lanza una excepción y la auditoría falla en setup, antes incluso de hacer el primer GET.

Inventario observado en el código fuente (no en este documento):

- `shared/routes.ts::ROUTE_SLUGS`: 17 route keys (`home`, `how_we_work`, `our_services`, `about_llc`, `faq`, `book`, `pillar_open_llc`, `service_llc_nm`, `service_llc_wy`, `service_llc_de`, `service_llc_fl`, `service_itin`, `legal_terms`, `legal_privacy`, `legal_cookies`, `legal_refunds`, `legal_disclaimer`).
- `shared/routes.ts::ALL_ROUTE_KEYS`: 17 entradas (= `Object.keys(ROUTE_SLUGS)`).
- `server/index.ts::LEGACY_ES_REDIRECTS`: 50 pares 301.
- `server/server-constants.ts::HREFLANG_BCP47`: {"es":"es-ES","en":"en-US","fr":"fr-FR","de":"de-DE","pt":"pt-PT","ca":"ca-ES"} — fuente única importada por `server/static.ts::injectMeta`, `server/routes/public.ts` (sitemaps), `server/routes.ts` (header `Link` en runtime) y referenciada por `client/src/components/SEO.tsx`.
- `client/src/data/blog-posts-slugs.ts::BLOG_SLUG_I18N`: 112 entradas (1 por post ES). El server (`server/routes/public.ts`) usa `getTranslatedSlug`/`resolveToSpanishSlug` para resolver y 301 entre slugs por idioma.

- `client/src/App.tsx::generateLocalizedRoutes()` itera sobre `ALL_ROUTE_KEYS` × `SUPPORTED_LANGS`, así que cualquier alta o baja de route key se refleja automáticamente en el router. La sección 1 confirma que las 102 URLs resultantes responden 200.
- `client/src/i18n/data/subpages.ts::NAV_SUBPAGES_BY_LANG` declara los labels del menú; los `href` se generan vía `getLocalizedPath()` a partir de `ROUTE_SLUGS`. La sección 8b lo verifica empíricamente extrayendo las llamadas `lp("…")` de las superficies de navegación y comprobando que los URLs resueltos están en el inventario canónico.

## 8b. Navegación global → inventario canónico (Navbar, NavbarFunnel, Footer)

Cada llamada `lp("ROUTE_KEY")` (alias de `useLangPath` → `getLocalizedPath`) en los componentes de navegación se extrae con regex desde el código fuente, se expande a los 6 idiomas y se valida contra `ALL_ROUTE_KEYS` y contra el inventario canónico de la sección 1. Caso especial: `lp("/blog")` se valida contra el inventario de blog index (sección 2).

| archivo | route keys distintas extraídas | total chequeos | OK | desviaciones |
| --- | --- | --- | --- | --- |
| `client/src/components/layout/Navbar.tsx` | 12 (`our_services`, `service_llc_nm`, `service_llc_wy`, `service_llc_de`, `service_llc_fl`, `service_itin`, `home`, `how_we_work`, `about_llc`, `faq`, `/blog`, `book`) | 72 | 72 | — |
| `client/src/components/layout/NavbarFunnel.tsx` | 2 (`home`, `book`) | 12 | 12 | — |
| `client/src/components/layout/Footer.tsx` | 16 (`legal_privacy`, `home`, `our_services`, `service_llc_nm`, `service_llc_wy`, `service_llc_de`, `service_llc_fl`, `service_itin`, `how_we_work`, `faq`, `/blog`, `book`, `legal_terms`, `legal_cookies`, `legal_refunds`, `legal_disclaimer`) | 96 | 96 | — |

- (sin desviaciones: las 180 resoluciones de `lp(...)` × idioma desde Navbar/NavbarFunnel/Footer apuntan a URLs presentes en el inventario canónico o de blog index)

## 9. Issues

**0 issues. Auditoría limpia.**

## Método

- **Source of truth**: las constantes inventariadas (`ROUTE_SLUGS`, `ALL_ROUTE_KEYS`, `LEGACY_ES_REDIRECTS`, `HREFLANG_BCP47`, `BLOG_SLUG_I18N`) se parsean directamente desde los archivos `.ts` correspondientes al iniciar el script. Si la forma de cualquiera de ellas cambia (rename, key extra, idioma faltante…), el script aborta con un error claro antes del primer GET. No hay copia hardcodeada en el script.
- **Crawl HTTP local**: GET en runtime contra `http://localhost:5000` con `redirect: "manual"` para capturar 301 y `Location`. Concurrencia 16, sin caché.
- **Parser de header `Link`**: separa entradas por `,` (con guard `(?=<)` para no romper URLs con coma encoded), extrae `rel="canonical"` y todas las `rel="alternate"; hreflang="…"`. El audit usa la **unión** de hreflangs del header HTTP y de los `<link rel="alternate">` inyectados en el HTML, deduplicada por `(hreflang, href)`.
- **Sitemap parsing**: regex sobre `<loc>` en `/sitemap-pages.xml`, `/sitemap-blog.xml`, `/sitemap-faq.xml` y `/sitemap.xml`.
- **Hreflang exhaustivo (102/102)**: para **cada** página canónica (no muestra), compara el set `(hreflang, href)` **observado** en la respuesta contra el set **esperado** derivado de `ROUTE_SLUGS` + `HREFLANG_BCP47`. Reporta `BLOCKER` si hay diferencia (count, x-default href, set match, códigos sobrantes) o si la reciprocidad falla (alguna URL alternate no pertenece al inventario canónico). La sección 6c muestra una muestra detallada para inspección humana.
- **Navegación**: parsea por regex las llamadas `lp("…")` (alias de `useLangPath` → `getLocalizedPath`) en `Navbar.tsx`, `NavbarFunnel.tsx` y `Footer.tsx`. Cada route key se valida contra `ALL_ROUTE_KEYS`; cada `(routeKey, lang)` se resuelve a su URL canónica vía `ROUTE_SLUGS` y se verifica que esté en el inventario canónico (sección 1) o, en el caso especial de `lp("/blog")`, en el inventario de blog index (sección 2).
- **Higiene de slug**: validación de lowercase, sin diacríticos (`[\u00C0-\u024F\u1E00-\u1EFF]`), sin guiones bajos, sin dobles barras, sin codificación porcentual, sin colisiones intra-idioma.

Reporte generado por `scripts/audit-slugs-paginas-2026-04.mjs` el 2026-04-27.
