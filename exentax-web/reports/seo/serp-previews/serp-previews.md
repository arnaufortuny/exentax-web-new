# Google SERP previews — 18 indexable pages × 6 locales

_Generated 2026-04-28T20:05:16.950Z_

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
- 🟡 Mobile / CTA warnings: **18**.
- 🔵 Informational notes: **0**.

> ✅ **No hard SERP truncations expected** on any of the 18 indexable pages across any of the 6 locales. The refreshed copy from Task #3 renders cleanly in Google's desktop card; remaining notes are mobile-only and documented per page below.

### Per-locale breakdown

| Locale | Pages | 🔴 errors | 🟡 warnings | 🔵 info |
| --- | ---: | ---: | ---: | ---: |
| Español (es-ES) | 18 | 0 | 2 | 0 |
| English (en-US) | 18 | 0 | 4 | 0 |
| Français (fr-FR) | 18 | 0 | 5 | 0 |
| Deutsch (de-DE) | 18 | 0 | 3 | 0 |
| Português (pt-PT) | 18 | 0 | 2 | 0 |
| Català (ca-ES) | 18 | 0 | 2 | 0 |

## Flagged cards

Cards with at least one note. _Mobile-title wraps are normal Google rendering_ — only worth fixing if the wrap looks awkward in the visual gallery. _CTA-mobile flags_ mean the soft call-to-action sits past the mobile 3-line window and may not render on phones; this is acceptable when the desktop card still shows the full CTA.

### `/es/servicios/llc-delaware` · subpage · service_llcDe (es)

- **Title** (52 chars · 403 px est. desktop)
  > LLC en Delaware · El estado de los inversores serios
- **Description** (144 chars · 743 px est. desktop)
  > El estado preferido por VCs y founders: marco jurídico sólido y prestigio global. LLC con EIN, banca americana y agente registrado. Empieza hoy.
- Notes:
  - 🟡 Soft CTA "empieza hoy" sits at char 133; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/es/servicios/llc-wyoming` · subpage · service_llcWy (es)

- **Title** (51 chars · 409 px est. desktop)
  > LLC en Wyoming · Privacidad y protección de activos
- **Description** (150 chars · 778 px est. desktop)
  > Wyoming, el estándar de oro en privacidad y protección de activos. LLC con EIN, banca americana y agente registrado, sin viajar a EE. UU. Empieza hoy.
- Notes:
  - 🟡 Soft CTA "empieza hoy" sits at char 139; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/en/services/get-your-itin` · subpage · service_itin (en)

- **Title** (53 chars · 415 px est. desktop)
  > ITIN for non-residents · Keep your passport | Exentax
- **Description** (155 chars · 774 px est. desktop)
  > Get your IRS ITIN without sending your original passport. We file as an official Certifying Acceptance Agent, deadlines we actually meet. Book a free call.
- Notes:
  - 🟡 Soft CTA "book a free call" sits at char 139; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/en/services/llc-delaware` · subpage · service_llcDe (en)

- **Title** (50 chars · 400 px est. desktop)
  > Delaware LLC · Where serious investors set up shop
- **Description** (153 chars · 780 px est. desktop)
  > The state of choice for VCs and founders: solid legal framework and global prestige. Delaware LLC with EIN, US banking and registered agent. Get started.
- Notes:
  - 🟡 Soft CTA "get started" sits at char 142; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/en/services/llc-new-mexico` · subpage · service_llcNm (en)

- **Title** (45 chars · 381 px est. desktop)
  > New Mexico LLC · Lowest cost, maximum privacy
- **Description** (150 chars · 751 px est. desktop)
  > The most cost-efficient US LLC: no annual report, owner off the public record, 0% federal tax. EIN, US banking and registered agent. Book a free call.
- Notes:
  - 🟡 Soft CTA "book a free call" sits at char 134; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/en/services/llc-wyoming` · subpage · service_llcWy (en)

- **Title** (53 chars · 421 px est. desktop)
  > Wyoming LLC · Privacy and asset protection done right
- **Description** (153 chars · 776 px est. desktop)
  > Wyoming is the gold standard in privacy and asset protection. We set up your LLC with EIN, US banking and registered agent, no US trip. Book a free call.
- Notes:
  - 🟡 Soft CTA "book a free call" sits at char 137; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/fr/services/obtiens-ton-itin` · subpage · service_itin (fr)

- **Title** (49 chars · 391 px est. desktop)
  > ITIN non-résidents · Sans envoyer votre passeport
- **Description** (154 chars · 779 px est. desktop)
  > Votre ITIN IRS sans envoyer votre passeport original. Nous déposons en tant que Certifying Acceptance Agent officiel, suivi et délais tenus. Démarrez ici.
- Notes:
  - 🟡 Soft CTA "démarrez ici" sits at char 142; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/fr/services/llc-delaware` · subpage · service_llcDe (fr)

- **Title** (50 chars · 390 px est. desktop)
  > LLC au Delaware · L'état des investisseurs sérieux
- **Description** (149 chars · 754 px est. desktop)
  > L'état préféré des VC et fondateurs : cadre juridique solide et prestige mondial. LLC Delaware avec EIN, banque US et agent enregistré. Démarrez ici.
- Notes:
  - 🟡 Soft CTA "démarrez ici" sits at char 137; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/fr/services/llc-floride` · subpage · service_llcFl (fr)

- **Title** (53 chars · 406 px est. desktop)
  > LLC en Floride · Votre porte d'entrée aux US et LATAM
- **Description** (151 chars · 791 px est. desktop)
  > Si vous vendez aux États-Unis ou en LATAM, la Floride est votre base. LLC avec EIN, banque US, agent enregistré et accompagnement fiscal. Démarrez ici.
- Notes:
  - 🟡 Soft CTA "démarrez ici" sits at char 139; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/fr/services/llc-nouveau-mexique` · subpage · service_llcNm (fr)

- **Title** (58 chars · 467 px est. desktop)
  > LLC au Nouveau-Mexique · Coût minimal, confidentialité max
- **Description** (155 chars · 776 px est. desktop)
  > La LLC US la plus rentable : pas de renouvellement annuel, propriétaire non public et 0 % fédéral. EIN, banque US et agent enregistré inclus. Démarrez ici.
- Notes:
  - 🟡 Soft CTA "démarrez ici" sits at char 143; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/fr/services/llc-wyoming` · subpage · service_llcWy (fr)

- **Title** (57 chars · 433 px est. desktop)
  > LLC au Wyoming · Confidentialité et protection des actifs
- **Description** (155 chars · 797 px est. desktop)
  > Wyoming, la référence en confidentialité et protection des actifs. LLC avec EIN, banque américaine et agent enregistré, sans voyager aux USA. Démarrez ici.
- Notes:
  - 🟡 Soft CTA "démarrez ici" sits at char 143; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/de/leistungen/llc-delaware` · subpage · service_llcDe (de)

- **Title** (47 chars · 384 px est. desktop)
  > Delaware-LLC · Wo ernsthafte Investoren gründen
- **Description** (153 chars · 811 px est. desktop)
  > Der Lieblingsstaat von VCs und Foundern: solider Rechtsrahmen und globales Ansehen. Delaware-LLC mit EIN, US-Banking und Registered Agent. Jetzt starten.
- Notes:
  - 🟡 Soft CTA "jetzt starten" sits at char 140; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/de/leistungen/llc-florida` · subpage · service_llcFl (de)

- **Title** (42 chars · 333 px est. desktop)
  > Florida-LLC · Ihr Tor zu den USA und LATAM
- **Description** (153 chars · 788 px est. desktop)
  > Wenn Sie in den USA oder LATAM verkaufen, ist Florida Ihre Basis. LLC mit EIN, US-Banking, Registered Agent und Steuerberatung inklusive. Jetzt anfragen.
- Notes:
  - 🟡 Soft CTA "jetzt anfragen" sits at char 139; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/de/leistungen/llc-new-mexico` · subpage · service_llcNm (de)

- **Title** (57 chars · 469 px est. desktop)
  > New-Mexico-LLC · Niedrigste Kosten, maximale Privatsphäre
- **Description** (150 chars · 767 px est. desktop)
  > Die kosteneffizienteste US-LLC: kein Jahresbericht, Inhaber nicht öffentlich, 0 % Bundessteuer. EIN, US-Bankkonto und Registered Agent. Jetzt starten.
- Notes:
  - 🟡 Soft CTA "jetzt starten" sits at char 137; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/pt/servicos/llc-delaware` · subpage · service_llcDe (pt)

- **Title** (50 chars · 394 px est. desktop)
  > LLC no Delaware · O estado dos investidores sérios
- **Description** (150 chars · 789 px est. desktop)
  > O estado favorito de VCs e founders: enquadramento jurídico sólido e prestígio global. LLC no Delaware com EIN, banca e agente registado. Comece hoje.
- Notes:
  - 🟡 Soft CTA "comece hoje" sits at char 139; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/pt/servicos/llc-wyoming` · subpage · service_llcWy (pt)

- **Title** (49 chars · 395 px est. desktop)
  > LLC no Wyoming · Privacidade e proteção de ativos
- **Description** (145 chars · 780 px est. desktop)
  > Wyoming é o padrão de ouro em privacidade e proteção de ativos. LLC com EIN, banca americana e agente registado, sem viajar aos EUA. Comece hoje.
- Notes:
  - 🟡 Soft CTA "comece hoje" sits at char 134; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/ca/serveis/llc-florida` · subpage · service_llcFl (ca)

- **Title** (45 chars · 340 px est. desktop)
  > LLC a Florida · La teva porta als EUA i LATAM
- **Description** (144 chars · 751 px est. desktop)
  > Si vens als EUA o a LATAM, Florida és la teva base. LLC amb EIN, banca americana, agent registrat i assessoria contínua en català. Comença avui.
- Notes:
  - 🟡 Soft CTA "comença avui" sits at char 132; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

### `/ca/serveis/llc-wyoming` · subpage · service_llcWy (ca)

- **Title** (47 chars · 355 px est. desktop)
  > LLC a Wyoming · Privacitat i protecció d'actius
- **Description** (148 chars · 757 px est. desktop)
  > Wyoming és l'estàndard d'or en privacitat i protecció d'actius. LLC amb EIN, banca americana i agent registrat, sense viatjar als EUA. Comença avui.
- Notes:
  - 🟡 Soft CTA "comença avui" sits at char 136; mobile SERP usually truncates around char 130, so the CTA may not render on phones.

## Recommendation

No hard desktop truncations. Remaining flags are mobile-only and **acceptable as-is**: the existing copy was deliberately tuned to fit the desktop 165-char budget and Google's mobile card already truncates at ~130 chars on most phones, so the soft CTA may not appear on mobile for some descriptions. This trade-off was accepted in Task #2 in exchange for richer copy on the desktop card (where the CTA does render).

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
| subpage | `/es/servicios/llc-delaware` | 52 | 144 | 🟡mobile-cta |
| subpage | `/es/servicios/llc-florida` | 55 | 140 | ✅ |
| subpage | `/es/servicios/llc-nuevo-mexico` | 53 | 148 | ✅ |
| subpage | `/es/servicios/llc-wyoming` | 51 | 150 | 🟡mobile-cta |

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
| subpage | `/en/services/get-your-itin` | 53 | 155 | 🟡mobile-cta |
| subpage | `/en/services/llc-delaware` | 50 | 153 | 🟡mobile-cta |
| subpage | `/en/services/llc-florida` | 46 | 147 | ✅ |
| subpage | `/en/services/llc-new-mexico` | 45 | 150 | 🟡mobile-cta |
| subpage | `/en/services/llc-wyoming` | 53 | 153 | 🟡mobile-cta |

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
| subpage | `/fr/services/obtiens-ton-itin` | 49 | 154 | 🟡mobile-cta |
| subpage | `/fr/services/llc-delaware` | 50 | 149 | 🟡mobile-cta |
| subpage | `/fr/services/llc-floride` | 53 | 151 | 🟡mobile-cta |
| subpage | `/fr/services/llc-nouveau-mexique` | 58 | 155 | 🟡mobile-cta |
| subpage | `/fr/services/llc-wyoming` | 57 | 155 | 🟡mobile-cta |

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
| subpage | `/de/leistungen/llc-delaware` | 47 | 153 | 🟡mobile-cta |
| subpage | `/de/leistungen/llc-florida` | 42 | 153 | 🟡mobile-cta |
| subpage | `/de/leistungen/llc-new-mexico` | 57 | 150 | 🟡mobile-cta |
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
| subpage | `/pt/servicos/llc-delaware` | 50 | 150 | 🟡mobile-cta |
| subpage | `/pt/servicos/llc-florida` | 48 | 140 | ✅ |
| subpage | `/pt/servicos/llc-novo-mexico` | 53 | 149 | ✅ |
| subpage | `/pt/servicos/llc-wyoming` | 49 | 145 | 🟡mobile-cta |

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
| subpage | `/ca/serveis/llc-florida` | 45 | 144 | 🟡mobile-cta |
| subpage | `/ca/serveis/llc-nou-mexic` | 47 | 148 | ✅ |
| subpage | `/ca/serveis/llc-wyoming` | 47 | 148 | 🟡mobile-cta |
