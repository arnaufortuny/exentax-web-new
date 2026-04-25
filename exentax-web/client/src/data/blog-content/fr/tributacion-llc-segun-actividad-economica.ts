export default `

Parler de la « fiscalité de la LLC » dans l'abstrait conduit à des erreurs lourdes : la fiscalité réelle dépend très étroitement du **type d'activité économique** que la LLC exerce, parce que chaque activité active des règles différentes de TVA, de qualification des revenus, de source du revenu, de convention fiscale applicable et, surtout, d'exposition à la transparence fiscale internationale et aux règles anti-abus. Voyons les cinq grandes familles que nous voyons chez Exentax.

## Points clés

### 1. Services professionnels (conseil, développement, design, marketing)

C'est le cas le plus fréquent et le plus simple. Votre LLC facture des services à des clients B2B internationaux (États-Unis, UE, Amérique latine). Caractéristiques :

- **Nature du revenu** : activité économique.
- **Qualification en France (résident)** : bénéfice non commercial ou commercial selon le caractère de la prestation, imputé à l'associé via le régime de transparence appliqué à la LLC mono-membre (à rapprocher de la <a href="/fr/blog/doctrine-administrative-espagnole-sur-la-llc-americaine">doctrine DGT/TEAC en Espagne</a> pour le voisin péninsulaire).
- **TVA** : facturation B2B avec client communautaire, **autoliquidation** par le client dans son pays ; avec client US ou autre tiers, **opération hors champ** de la TVA française (règle de localisation des services B2B). Détaillé dans <a href="/fr/blog/tva-sur-les-services-numeriques-internationaux-quand-elle">TVA des services numériques internationaux</a>.
- **Impôt sur le revenu en France** : intégration au revenu global aux tranches progressives (de 11 % à 45 % auxquelles s'ajoutent les prélèvements sociaux applicables).
- **Risque principal** : simulation si la substance opérationnelle est apportée exclusivement par l'associé résident en France sans aucune substance réelle aux États-Unis.

**Optimisation légitime** : maximiser les charges déductibles correctes au niveau de la LLC (logiciels, outils, sous-traitance, formation, marketing). Le résultat net imputé à l'associé baisse et le taux moyen effectif chute substantiellement par rapport à celui de l'auto-entrepreneur français pur.

### 2. E-commerce physique (Amazon, Shopify, dropshipping)

Vous vendez des biens physiques à des consommateurs finaux internationaux. Caractéristiques :

- **Nature du revenu** : activité économique de vente.
- **TVA et douanes** : complexe. Si vous vendez à des consommateurs européens, la LLC peut avoir l'obligation de **s'enregistrer à la TVA** dans des pays de l'UE individuellement ou d'utiliser le **régime OSS / IOSS**. Si vous dépassez certains seuils par pays, l'enregistrement local devient obligatoire. Les places de marché comme Amazon agissent comme **deemed supplier** dans de nombreux cas et collectent la TVA, mais pas dans tous.
- **DAC7** : en tant que vendeur sur Amazon, Etsy ou eBay européens, Amazon Europe transmet vos revenus à l'administration fiscale luxembourgeoise, qui les retransmet à celle du pays des bénéficiaires effectifs. Voir <a href="/fr/blog/dac7-le-nouveau-reporting-des-plateformes-numeriques-en-2026">DAC7</a>.
- **Douanes** : si la LLC importe du stock dans l'UE pour distribution (FBA), elle a besoin d'un **EORI européen**, d'un importateur officiel et éventuellement d'un IOR (Importer of Record).
- **Sales tax aux États-Unis** : si vous vendez à des consommateurs dans des États avec economic nexus, possible obligation d'enregistrement et de collecte de la sales tax. Plus dans <a href="/fr/blog/vendre-sur-amazon-avec-votre-llc-guide-complet-pour-vendeurs">Amazon et e-commerce avec LLC</a>.

**Risque principal** : ignorer la TVA UE ou la sales tax américaine peut générer une facture rétroactive très importante.

### 3. SaaS et abonnements numériques

Vous vendez l'accès à un logiciel ou à un contenu numérique, en B2C ou B2B, par abonnement ou paiement unique. Caractéristiques :

- **Nature du revenu** : activité économique + cession d'usage de logiciel (frontière avec les redevances).
- **Services prestés par voie électronique (TBE)** : si vous vendez à des consommateurs européens, ils sont soumis à la TVA dans le pays du consommateur. **OSS non-UE** (la LLC s'enregistre dans un État membre d'identification) ou recours à des plateformes Merchant of Record (Paddle, FastSpring, DoDo Payments, Lemon Squeezy) qui prennent en charge la TVA pour vous.
- **B2B** : règle générale d'autoliquidation par le client.
- **Qualification en France** : revenus d'activité économique s'il y a développement actif ; si vous cédez une licence passive sur du code préexistant sans activité opérationnelle significative, il peut y avoir débat sur la **transparence fiscale internationale** (art. 209 B et art. 123 bis CGI).
- **Risque CFC/TFI** : si la LLC génère principalement des revenus passifs (licences) et qu'elle manque de moyens matériels et humains aux États-Unis, l'administration peut appliquer la transparence fiscale internationale.

Détail dans <a href="/fr/blog/llc-americaine-pour-developpeurs-de-logiciels-et-fondateurs">LLC pour développeurs de logiciels et SaaS</a>.

### 4. Redevances et propriété intellectuelle

Votre LLC titularise des droits (marque, logiciel, contenu) et les concède à des tiers ou à une autre entité liée. Caractéristiques :

- **Nature du revenu** : revenus passifs (royalties).
- **Qualification CDI** : art. 12 CDI France-États-Unis (royalties). En règle générale, l'État de la source peut prélever (avec la limite du % conventionnel), et l'État de résidence impose en accordant un crédit d'impôt.
- **Risque CFC** : élevé. Les revenus passifs sont le cas typique de la transparence fiscale internationale. Si votre LLC dégage majoritairement des revenus passifs et que vous la contrôlez en résidant en France, l'art. 123 bis CGI peut s'enclencher.
- **Imposition effective** : si la TFI s'applique, vous êtes imposé en France comme si les revenus vous revenaient directement, avec déduction de tout impôt payé par la LLC (typiquement 0$ fédéral en Disregarded Entity).
- **Clause LOB CDI** : restreint l'accès aux bénéfices conventionnels pour les structures hybrides ou sans substance.

**Conclusion** : une LLC purement de redevances avec associé résident en France doit être conçue avec une substance réelle (moyens matériels, personnel, décisions prises aux États-Unis) ou assumer dès le départ qu'elle relèvera de la TFI.

### 5. Trading (actions, futures, crypto)

Votre LLC opère sur les marchés financiers avec un compte chez Interactive Brokers, Tradovate ou Kraken. Caractéristiques :

- **Nature du revenu** : dépend de l'actif et du régime. Trading FX et futures : plus-values et moins-values sur valeurs mobilières dans de nombreux pays ; en France, si l'activité est habituelle et professionnelle, elle peut être requalifiée en activité économique (BIC ou BNC selon le cas).
- **Actions** : dividendes (revenus de capitaux mobiliers, prélèvement forfaitaire unique de 30 % en France si entité opaque ; si transparente, imputation directe) et plus-values de cession (PFU 30 %).
- **Crypto** : plus-values relevant de l'art. 150 VH bis CGI pour les particuliers, ou activité économique (BIC professionnels) si trading fréquent et professionnel.
- **DAC8** : applicable depuis peu si vous opérez avec des plateformes européennes. Voir <a href="/fr/blog/dac8-et-cryptomonnaies-le-nouveau-reporting-fiscal">DAC8 et cryptomonnaies</a>.
- **Risque CFC** : très élevé. Les revenus de portefeuille sont l'exemple paradigmatique du revenu passif soumis à la TFI.
- **Convention** : art. 10 (dividendes), art. 11 (intérêts), art. 13 (plus-values). Les clauses LOB du Protocole 2019 sont particulièrement restrictives pour les structures d'investissement sans substance.

Détail dans <a href="/fr/blog/cryptomonnaies-et-trading-avec-llc-guide-fiscal-complet-pour">cryptomonnaies et trading avec LLC</a>.

### Tableau de synthèse par activité

| Activité | Qualification France (typique) | TVA | Risque CFC/TFI | Risque simulation | Pertinence LLC pure |
| --- | --- | --- | --- | --- | --- |
| Services professionnels B2B | Activité économique imputée | Autoliquidation client | Faible | Moyen | Élevée |
| E-commerce | Activité économique imputée | Complexe (OSS/IOSS, sales tax) | Faible | Moyen | Élevée avec prudence |
| SaaS B2B | Activité économique imputée | Autoliquidation client | Moyen | Moyen | Élevée |
| SaaS B2C TBE | Activité économique imputée | OSS non-UE / MoR | Moyen-élevé | Moyen | Moyenne-élevée |
| Redevances | Revenu passif | Généralement exonéré ou autoliquidation | Élevé | Élevé | Faible sans substance |
| Trading financier | Revenu passif / plus-values | n/a | Très élevé | Élevé | Faible sans substance |

### Comment décider de votre structure optimale

Choisir la LLC sans réflexion n'est pas toujours la bonne réponse. Pour les activités à faible risque CFC (services, e-commerce, SaaS B2B), une **Single-Member LLC** avec un associé résident en France, correctement déclarée et avec une substance raisonnable, est efficiente et défendable. Pour les activités à fort risque CFC (royalties, trading), soit la LLC se voit dotée de **substance réelle aux États-Unis**, soit on envisage une autre architecture (SAS française opérationnelle + LLC avec activité limitée, planification de résidence, etc.). Cadre complet dans <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">conception d'une structure internationale solide</a>.

### Erreurs typiques par activité

- **Services** : oublier la TVA intracommunautaire et l'inscription au VIES.
- **E-commerce** : ignorer OSS/IOSS et la sales tax américaine jusqu'à la régularisation.
- **SaaS** : ne pas utiliser de Merchant of Record et finir avec une obligation d'enregistrement à la TVA dans chaque pays de l'UE.
- **Redevances** : ne pas documenter la création, la titularité et la maintenance des actifs incorporels.
- **Trading** : confondre trading personnel et trading depuis la LLC en mélangeant les comptes.

Plus sur la manière d'éviter les erreurs typiques dans <a href="/fr/blog/risques-fiscaux-dune-mauvaise-structuration-internationale">risques fiscaux</a>.

### En résumé

Une LLC ne se taxe pas « d'une seule manière » : elle se taxe selon ce qu'elle fait, où elle le fait et d'où elle est contrôlée. La conversation sérieuse de planification fiscale commence par la compréhension de votre activité réelle, pas par le choix d'un pays sur une carte.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/services">Lancez-vous aujourd'hui, 100% en ligne</a>
<!-- /exentax:calc-cta-v1 -->

Vous voulez que nous analysions exactement comment se taxe votre activité et que nous vous concevions la structure la plus efficiente et défendable ? Réservez votre consultation gratuite.

Pour aller plus loin, <a href="/fr/blog/pourquoi-les-freelancers-espagnols-quittent-le-statut-dauto">Pourquoi arrêter le statut d'auto-entrepreneur en France (et quelles alternatives)</a> complète ce que nous venons de voir avec des points qui méritaient leur propre article.

<!-- exentax:cta-mid -->
**Avant de constituer une LLC pour votre activité, voyez comment nous travaillons.** <a href="/fr/comment-nous-travaillons">Notre méthode</a> détaille ce que nous examinons et dans quel ordre, du diagnostic d'activité jusqu'au routage TVA et CFC le plus adapté.

<!-- exentax:cta-final -->
**Parlons de votre cas, pas du manuel.** Réservez 30 minutes et nous adaptons « Imposition de la LLC selon l'activité économique » à votre activité concrète.

<!-- exentax:legal-refs-v1 -->
## Références : sources techniques et normativ applicable

Les chiffres, modèles et seuils mentionnés s'appuient sur les références suivantes, actuellement en vigueur :

- **Imposition de l'activité.** IRC §864 et §882 (effectivement connecté avec l'activité aux États-Unis, ECI), Treas. Reg. §301.7701-3 (classification de la LLC) et Form 5472 + 1120 pro-forma pour les LLC mono-membres non résidentes.
- **TVA et ventes internationales.** Directive 2006/112/CE relative à la TVA, Règlement d'exécution 282/2011, régime OSS/IOSS et Guichet Unique pour les services numériques B2C dans l'UE ; instructions du Modelo 369 de l'AEAT côté Espagne et déclaration française équivalente côté France (formulaire CA3 et IOSS via le guichet unique).
- **Plateformes marketplace.** Conditions publiées par Amazon Seller Central (y compris le VAT Calculation Service et la responsabilité TVA dans l'UE conformément à l'art. 14 bis Directive 2006/112), Stripe Tax, Paddle (Merchant of Record), DoDo Payments et PayPal Business.
- **DAC7.** Directive (UE) 2021/514 de coopération administrative dans les plateformes numériques, transposée en droit français par l'Ordonnance n° 2023-1142 du 6 décembre 2023 et son décret d'application, et en droit espagnol par RD 117/2024.
- **France résidents.** CGI art. 4 B (résidence), 123 bis et 209 B (TFI personnes physiques et sociétés), art. 12 et 13 CDI France-États-Unis, art. 1741 (fraude fiscale), Code de commerce art. R. 123-237 (mentions obligatoires).
- **Espagne résidents (référence comparative).** Ley 35/2006 LIRPF (art. 100 TFI), Ley 27/2014 LIS et Ley 37/1992 du IVA.

Information à caractère informatif ; le traitement concret dépend du pays de résidence du titulaire et du pays de vos clients.

<!-- exentax:execution-v2 -->
## Imposition de la LLC selon l'activité économique : pourquoi un SaaS, une agence et un e-commerce ne sont pas la même chose

La fiscalité fédérale américaine pour une LLC de non-résident ne dépend pas seulement de votre résidence, elle dépend aussi de ce que fait la LLC. La règle « non-effectively connected = 0 % » n'est pas uniforme : l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> applique des règles de sourcing différentes selon le type de revenu, ce qui classe votre LLC comme ETBUS (engaged in trade or business in US) ou comme passive foreign vehicle. Voici à quoi ressemble chaque activité typique.

- **SaaS et logiciel (abonnements numériques).** Revenu classé en business income, sourced selon le lieu où le logiciel est développé et opéré. Si le founder ne réside pas aux États-Unis et que les serveurs ne sont pas obligatoirement américains (cloud régional indistinct), default = foreign-source income → 0 % fédéral. Risque : si vous embauchez un dependent agent américain (VP of Sales salarié aux États-Unis, pas un contractor indépendant), la LLC bascule en ETBUS.
- **Agence numérique (services professionnels).** Revenu classé en personal services income, sourced là où les services sont matériellement rendus. Si vous êtes en France à travailler pour des clients américains, la source est la France (où le service est exécuté), PAS les États-Unis, même si le client est américain. Default : 0 % fédéral. Exception : si votre équipe est aux États-Unis ou si vous y avez un office, sourcing US et bascule en ETBUS.
- **E-commerce (produits physiques).** Triple analyse : (1) Stock aux États-Unis (Amazon FBA, 3PL US) : peut créer ETBUS selon la substance. (2) Stock hors États-Unis dropshipped vers les États-Unis : généralement foreign-source et 0 %. (3) Marketplaces (Amazon Seller US) : vous encaissez déjà net de sales tax retenue par Amazon, mais l'income fédéral suit votre sourcing. FBA + dependent agent = risque ETBUS très élevé.
- **Investissement et trading (capital gains, dividendes).** Plus-values de bourse américaine pour une LLC de non-résident : 0 % fédéral par exception spécifique (capital gains de portfolio investment exonérés pour les non-résidents sans trade or business). Dividendes US : 30 % de retenue par défaut, ramenée à 15 %/0 % sous traité avec W-8BEN-E. Crypto : traitée comme property, mêmes règles que les capital gains ; foreign-source et 0 % si pas ETBUS.

### Ce qu'on nous demande le plus

**Si je vends des cours numériques à des clients américains, est-ce que c'est US-source income ?** Non par défaut. Les cours numériques sont des personal services + intellectual property licence, sourced là où ils sont développés (votre résidence). Vendre à un client américain ne convertit pas le revenu en US-source. Cela reste 0 % fédéral en l'absence d'ETBUS.

**Est-ce que Amazon FBA me fait automatiquement basculer en ETBUS ?** Le débat technique existe. Position prudente : oui, parce que le stock dans le warehouse Amazon US peut être interprété comme dependent agent + fixed place of business. Position plus permissive : cela dépend du contrôle effectif. La pratique sérieuse consiste à présumer ETBUS et à planifier en conséquence ou à passer à un fulfillment hors États-Unis.

Chez Exentax nous modélisons chaque activité par les règles de sourcing et le test ETBUS avant de constituer, pour ne pas découvrir au bout de deux ans que vous payez 21 % fédéral alors que vous pensiez 0 %.
<!-- /exentax:execution-v2 -->

## On vous le monte sans que vous y perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà avec leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous prenons en charge le processus complet : constitution, banking, passerelles de paiement, comptabilité, déclarations IRS et compliance dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.

<!-- exentax:cross-refs-v1 -->
### Pour aller plus loin

- [Risques fiscaux d'une mauvaise structuration internationale](/fr/blog/risques-fiscaux-dune-mauvaise-structuration-internationale)
<!-- /exentax:cross-refs-v1 -->

Vous souhaitez appliquer ce protocole à votre cas ? <a href="/fr/reserver">Réservez une session avec l'équipe Exentax</a> et nous passons en revue votre LLC avec des chiffres réels en trente minutes, sans engagement.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22tributacion%20llc%20segun%20actividad%20economica%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous souhaitez voir le processus complet en détail, consultez notre <a href="/fr/services">page des services</a> avec tout ce que nous couvrons.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Création, EIN, BOI, banque et maintenance : une seule équipe qui comprend votre dossier de bout en bout. <a href="/fr/services">Voir tous les services</a>.
<!-- /exentax:cta-v1 -->

`;
