# Google SERP previews — 18 indexable pages × 6 locales

_Generated 2026-05-03T15:48:33.248Z_

This report follows up on Task #3 by re-checking how the refreshed copy renders in Google's desktop and mobile SERP cards. The character budgets used here are aligned with `scripts/seo/verify-meta.ts`, so a passing meta-check translates directly into clean SERP previews.

## Gates

- **Desktop title cap**: 60 chars (Google truncates with an ellipsis past this).
- **Mobile title comfort**: 78 chars before titles wrap to a 3rd line on small phones.
- **Desktop description cap**: 165 chars (matches verify-meta DESC_MAX).
- **Mobile CTA window**: first 130 chars (≈ 3 lines on phones); a soft CTA placed past this point may not show on mobile.

Open [`serp-previews.html`](./serp-previews.html) in a browser for the **visual gallery** (108 cards, desktop + mobile per page, with the real CSS truncation Google would apply at 580/990 px desktop and 506/700 px mobile).

## Summary

- Total cards: **108** (6 locales × 18 indexable pages).
- 🔴 Hard truncation errors: **0**.
- 🟡 Mobile / CTA warnings: **0**.
- 🔵 Informational notes: **0**.

> ✅ **No hard SERP truncations expected** on any of the 18 indexable pages across any of the 6 locales. The refreshed copy from Task #3 renders cleanly in Google's desktop card; remaining notes are mobile-only and documented per page below.

### Per-locale breakdown

| Locale | Pages | 🔴 errors | 🟡 warnings | 🔵 info |
| --- | ---: | ---: | ---: | ---: |
| Español (es-ES) | 18 | 0 | 0 | 0 |
| English (en-US) | 18 | 0 | 0 | 0 |
| Français (fr-FR) | 18 | 0 | 0 | 0 |
| Deutsch (de-DE) | 18 | 0 | 0 | 0 |
| Português (pt-PT) | 18 | 0 | 0 | 0 |
| Català (ca-ES) | 18 | 0 | 0 | 0 |

## Flagged cards

> All 108 cards are within budget. No truncations or CTA wraps expected on either desktop or mobile.

## Recommendation

All 18 × 6 = 108 SERP cards render cleanly on both desktop and mobile. No copy tweaks required; the verify-meta budgets installed in Task #2/#3 are sufficient.

## Full inventory

### Español (es-ES)

| Scope | Route | Title chars | Desc chars | Flags |
| --- | --- | ---: | ---: | --- |
| pillar | `/es/abrir-llc-estados-unidos` | 52 | 158 | ✅ |
| static | `/es/sobre-las-llc` | 55 | 155 | ✅ |
| static | `/es/blog` | 49 | 149 | ✅ |
| static | `/es/agendar` | 54 | 151 | ✅ |
| static | `/es/preguntas-frecuentes` | 47 | 157 | ✅ |
| static | `/es` | 54 | 156 | ✅ |
| static | `/es/como-trabajamos` | 52 | 153 | ✅ |
| static | `/es/legal/cookies` | 29 | 143 | ✅ |
| static | `/es/legal/disclaimer` | 34 | 150 | ✅ |
| static | `/es/legal/privacidad` | 32 | 136 | ✅ |
| static | `/es/legal/reembolsos` | 32 | 131 | ✅ |
| static | `/es/legal/terminos` | 32 | 149 | ✅ |
| static | `/es/servicios` | 53 | 150 | ✅ |
| subpage | `/es/servicios/obten-tu-itin` | 59 | 146 | ✅ |
| subpage | `/es/servicios/llc-delaware` | 52 | 141 | ✅ |
| subpage | `/es/servicios/llc-florida` | 55 | 140 | ✅ |
| subpage | `/es/servicios/llc-nuevo-mexico` | 53 | 148 | ✅ |
| subpage | `/es/servicios/llc-wyoming` | 51 | 145 | ✅ |

### English (en-US)

| Scope | Route | Title chars | Desc chars | Flags |
| --- | --- | ---: | ---: | --- |
| pillar | `/en/open-llc-usa` | 44 | 157 | ✅ |
| static | `/en/about-llc` | 49 | 159 | ✅ |
| static | `/en/blog` | 49 | 156 | ✅ |
| static | `/en/book` | 54 | 146 | ✅ |
| static | `/en/faq` | 39 | 153 | ✅ |
| static | `/en` | 46 | 158 | ✅ |
| static | `/en/how-we-work` | 51 | 159 | ✅ |
| static | `/en/legal/cookies` | 23 | 134 | ✅ |
| static | `/en/legal/disclaimer` | 37 | 148 | ✅ |
| static | `/en/legal/privacy` | 24 | 123 | ✅ |
| static | `/en/legal/refunds` | 23 | 113 | ✅ |
| static | `/en/legal/terms` | 30 | 137 | ✅ |
| static | `/en/services` | 58 | 157 | ✅ |
| subpage | `/en/services/get-your-itin` | 53 | 141 | ✅ |
| subpage | `/en/services/llc-delaware` | 50 | 146 | ✅ |
| subpage | `/en/services/llc-florida` | 46 | 147 | ✅ |
| subpage | `/en/services/llc-new-mexico` | 45 | 142 | ✅ |
| subpage | `/en/services/llc-wyoming` | 53 | 147 | ✅ |

### Français (fr-FR)

| Scope | Route | Title chars | Desc chars | Flags |
| --- | --- | ---: | ---: | --- |
| pillar | `/fr/ouvrir-llc-etats-unis` | 46 | 159 | ✅ |
| static | `/fr/a-propos-des-llc` | 49 | 155 | ✅ |
| static | `/fr/blog` | 54 | 153 | ✅ |
| static | `/fr/reserver` | 56 | 159 | ✅ |
| static | `/fr/questions-frequentes` | 38 | 146 | ✅ |
| static | `/fr` | 54 | 156 | ✅ |
| static | `/fr/comment-nous-travaillons` | 52 | 154 | ✅ |
| static | `/fr/legal/cookies` | 30 | 152 | ✅ |
| static | `/fr/legal/avertissement` | 40 | 147 | ✅ |
| static | `/fr/legal/confidentialite` | 38 | 148 | ✅ |
| static | `/fr/legal/remboursements` | 36 | 129 | ✅ |
| static | `/fr/legal/conditions` | 30 | 154 | ✅ |
| static | `/fr/services` | 55 | 156 | ✅ |
| subpage | `/fr/services/obtiens-ton-itin` | 49 | 141 | ✅ |
| subpage | `/fr/services/llc-delaware` | 50 | 140 | ✅ |
| subpage | `/fr/services/llc-floride` | 53 | 142 | ✅ |
| subpage | `/fr/services/llc-nouveau-mexique` | 58 | 142 | ✅ |
| subpage | `/fr/services/llc-wyoming` | 57 | 143 | ✅ |

### Deutsch (de-DE)

| Scope | Route | Title chars | Desc chars | Flags |
| --- | --- | ---: | ---: | --- |
| pillar | `/de/llc-usa-eroeffnen` | 46 | 153 | ✅ |
| static | `/de/uber-llc` | 48 | 153 | ✅ |
| static | `/de/blog` | 48 | 153 | ✅ |
| static | `/de/buchen` | 48 | 151 | ✅ |
| static | `/de/haufige-fragen` | 45 | 138 | ✅ |
| static | `/de` | 49 | 152 | ✅ |
| static | `/de/wie-wir-arbeiten` | 53 | 159 | ✅ |
| static | `/de/legal/cookies` | 27 | 142 | ✅ |
| static | `/de/legal/haftungsausschluss` | 44 | 146 | ✅ |
| static | `/de/legal/datenschutz` | 30 | 140 | ✅ |
| static | `/de/legal/erstattungen` | 35 | 146 | ✅ |
| static | `/de/legal/agb` | 41 | 150 | ✅ |
| static | `/de/leistungen` | 52 | 156 | ✅ |
| subpage | `/de/leistungen/hol-deine-itin` | 55 | 145 | ✅ |
| subpage | `/de/leistungen/llc-delaware` | 47 | 143 | ✅ |
| subpage | `/de/leistungen/llc-florida` | 42 | 143 | ✅ |
| subpage | `/de/leistungen/llc-new-mexico` | 57 | 140 | ✅ |
| subpage | `/de/leistungen/llc-wyoming` | 46 | 144 | ✅ |

### Português (pt-PT)

| Scope | Route | Title chars | Desc chars | Flags |
| --- | --- | ---: | ---: | --- |
| pillar | `/pt/abrir-llc-eua` | 48 | 158 | ✅ |
| static | `/pt/sobre-llc` | 51 | 152 | ✅ |
| static | `/pt/blog` | 55 | 157 | ✅ |
| static | `/pt/agendar` | 50 | 145 | ✅ |
| static | `/pt/perguntas-frequentes` | 45 | 154 | ✅ |
| static | `/pt` | 55 | 155 | ✅ |
| static | `/pt/como-trabalhamos` | 52 | 154 | ✅ |
| static | `/pt/legal/cookies` | 29 | 136 | ✅ |
| static | `/pt/legal/aviso-legal` | 34 | 146 | ✅ |
| static | `/pt/legal/privacidade` | 33 | 140 | ✅ |
| static | `/pt/legal/reembolsos` | 32 | 124 | ✅ |
| static | `/pt/legal/termos` | 28 | 148 | ✅ |
| static | `/pt/servicos` | 55 | 158 | ✅ |
| subpage | `/pt/servicos/obtenha-seu-itin` | 50 | 149 | ✅ |
| subpage | `/pt/servicos/llc-delaware` | 50 | 141 | ✅ |
| subpage | `/pt/servicos/llc-florida` | 48 | 140 | ✅ |
| subpage | `/pt/servicos/llc-novo-mexico` | 53 | 149 | ✅ |
| subpage | `/pt/servicos/llc-wyoming` | 49 | 144 | ✅ |

### Català (ca-ES)

| Scope | Route | Title chars | Desc chars | Flags |
| --- | --- | ---: | ---: | --- |
| pillar | `/ca/obrir-llc-eua` | 47 | 158 | ✅ |
| static | `/ca/sobre-les-llc` | 46 | 151 | ✅ |
| static | `/ca/blog` | 55 | 154 | ✅ |
| static | `/ca/agendar` | 48 | 143 | ✅ |
| static | `/ca/preguntes-frequents` | 45 | 154 | ✅ |
| static | `/ca` | 52 | 160 | ✅ |
| static | `/ca/com-treballem` | 53 | 149 | ✅ |
| static | `/ca/legal/cookies` | 29 | 153 | ✅ |
| static | `/ca/legal/avis-legal` | 33 | 146 | ✅ |
| static | `/ca/legal/privacitat` | 32 | 139 | ✅ |
| static | `/ca/legal/reemborsaments` | 36 | 127 | ✅ |
| static | `/ca/legal/termes` | 29 | 148 | ✅ |
| static | `/ca/serveis` | 53 | 157 | ✅ |
| subpage | `/ca/serveis/obte-el-teu-itin` | 51 | 149 | ✅ |
| subpage | `/ca/serveis/llc-delaware` | 48 | 145 | ✅ |
| subpage | `/ca/serveis/llc-florida` | 45 | 143 | ✅ |
| subpage | `/ca/serveis/llc-nou-mexic` | 47 | 148 | ✅ |
| subpage | `/ca/serveis/llc-wyoming` | 47 | 140 | ✅ |
