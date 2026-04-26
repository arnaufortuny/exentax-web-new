export default `

DAC 7 est l'une des réglementations européennes les plus structurantes des dernières années pour toute personne ou entreprise qui vend via une plateforme numérique européenne, et c'est probablement celle que l'on continue d'ignorer le plus aujourd'hui. Si vous vendez sur Amazon, Etsy, eBay, Vinted, Leboncoin, Airbnb, Booking, Uber, Bolt, Wallapop ou tout autre marketplace européen, vous êtes concerné. Et si vous opérez via une <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a> en tant que vendeur sur ces plateformes, vous l'êtes aussi.

## Ce qu'est DAC7

La **DAC7** est la sixième modification de la Directive 2011/16/UE relative à la coopération administrative dans le domaine fiscal (DAC). Formellement: **Directive (UE) 2021/514** du Conseil, du 22 mars 2021. Elle impose aux **plateformes numériques** (opérateurs de plateforme) d'identifier leurs vendeurs actifs, de collecter les informations sur leurs revenus et de transmettre annuellement ces données à l'administration fiscale de l'État membre où la plateforme est enregistrée ou a sa direction effective.

Cette administration fiscale partage ensuite automatiquement l'information avec les autorités fiscales des autres États membres où résident les vendeurs. Et, par accords bilatéraux ou multilatéraux parallèles, également avec les autorités de pays tiers.

L'Espagne a transposé la DAC7 par la **Loi 13/2023 du 24 mai** (modification de la Loi générale tributaire) et le **Real Decreto 117/2024 du 30 janvier**, qui régulent la nouvelle obligation déclarative des opérateurs de plateformes numériques et créent le **Modelo 238**, déclaration informative annuelle. La France l'a transposée dans le Code général des impôts à l'article 242 bis et 1649 ter A et suivants, avec une obligation déclarative équivalente à la DGFiP.

### Qui est concerné

DAC7 concerne:

- Les **plateformes numériques** qui facilitent une "activité pertinente": vente de biens, prestation de services personnels, location de biens immobiliers, location de moyens de transport. Cela inclut les plateformes résidentes dans l'UE et les plateformes étrangères qui opèrent en UE.
- Les **vendeurs** qui utilisent ces plateformes, qu'ils soient personnes physiques ou entités, résidents partout dans le monde dès lors qu'ils vendent à des utilisateurs UE ou que la plateforme est en UE.

Ce n'est pas une norme "pour grands vendeurs" : le seuil de minimis est très bas (les vendeurs qui réalisent moins de 30 transactions de vente de biens et moins de 2 000 € de contrepartie par an peuvent être exclus du reporting de la plateforme, mais pas de l'obligation fiscale personnelle).

### Ce qui est déclaré exactement

Pour chaque vendeur, la plateforme déclare annuellement:

| Catégorie | Détail |
| --- | --- |
| Identification vendeur (personne physique) | Nom, adresse principale, NIF, date de naissance |
| Identification vendeur (entité) | Raison sociale, adresse, EIN/NIF, numéro RCS, numéro de TVA si applicable |
| Identification financière | IBAN(s) ou équivalents sur lesquels la plateforme verse les paiements |
| Données d'activité | États membres UE de résidence du vendeur, contrepartie totale trimestrielle par activité pertinente, nombre d'opérations par trimestre, commissions/frais retenus par la plateforme |
| Immobilier (location) | Adresse du bien, numéro de cadastre ou équivalent, nombre de jours loués par bien, type de bien |

Le détail est **trimestriel**, pas annuel agrégé, ce qui permet aux administrations de croiser avec les déclarations de TVA et d'IRPF/IS avec une précision élevée.

### Calendrier et application temporelle

- **1er janvier 2023** : application effective dans toute l'UE.
- **31 janvier 2024** : premier reporting annuel relatif à l'exercice 2023.
- À partir de là : reporting annuel récurrent. Espagne : Modelo 238, première présentation effectuée en janvier 2024 sur les données de l'exercice fiscal 2023. France : déclaration analogue déposée par les plateformes auprès de la DGFiP.
- **aujourd'hui (maintenant)** : quatrième exercice de pleine application. Les administrations disposent d'un historique de trois ans de données croisables. Les inspections qui en dérivent commencent à se matérialiser.

## Comment cela affecte un propriétaire de LLC

Si votre LLC vend sur Amazon Europe (Amazon EU SARL, Luxembourg) ou Etsy (Etsy Ireland UC, Irlande) ou toute plateforme européenne :

1. La plateforme identifie votre LLC comme vendeur.
2. Elle collecte les données de la LLC (EIN, adresse enregistrée aux États-Unis, adresse opérationnelle) et celles des **bénéficiaires effectifs** si la plateforme suit des critères stricts de KYC.
3. Elle déclare les revenus bruts trimestriels générés via la plateforme à l'autorité fiscale du pays de la plateforme.
4. Cette autorité retransmet à l'autorité fiscale du pays de résidence du vendeur : si la LLC est enregistrée aux États-Unis, la donnée n'est pas retransmise automatiquement parce que les États-Unis ne sont pas État membre UE ; mais **si les bénéficiaires effectifs sont résidents en UE**, la donnée les concernant est bien retransmise à leur État membre de résidence.

Cela se complète avec le reporting CRS des banques qui reçoivent les paiements de la plateforme. La combinaison DAC7 + CRS laisse très peu d'opacité.

### Combinaison avec CRS, DAC8 et FATCA

DAC7 n'opère pas isolément. Elle fait partie d'un écosystème réglementaire :

- **CRS / DAC2** : reporting bancaire des soldes et rendements. Voir <a href="/fr/blog/crs-pour-residents-en-espagne-et-latam-implications-reelles">CRS pour résidents UE et LATAM</a>.
- **DAC6** : reporting obligatoire de mécanismes transfrontaliers potentiellement agressifs par les intermédiaires fiscaux.
- **DAC7** : reporting des plateformes numériques (ce qu'on vient d'expliquer).
- **DAC8** : reporting des crypto-actifs, pleinement applicable récemment. Voir <a href="/fr/blog/dac8-et-cryptomonnaies-le-nouveau-reporting-fiscal">DAC8 et cryptomonnaies</a>.
- **FATCA** (États-Unis) : reporting des comptes de US persons dans les entités étrangères.

Si votre LLC vend sur Amazon Europe, encaisse via Wise Belgique, paie des fournisseurs européens et que vous résidez en France ou en Espagne : DAC7 + CRS + DAC8 (s'il y a de la crypto) génèrent un profil fiscal croisé tridimensionnel difficile à éluder.

## Implications pratiques en France

1. **Votre déclaration 2042 (IR) et votre TVA doivent coïncider avec le rapport DAC7.** Si Amazon déclare 60 000 € de revenus bruts sur l'exercice fiscal 2025 liés à votre bénéficiaire effectif et que vous déclarez 0 €, la **DGFiP** ouvrira un contrôle sur pièces avec une probabilité très élevée. Le rapport est transmis chaque janvier pour l'exercice clos et croisé automatiquement avec votre dossier fiscal personnel.
2. **Régime de TVA.** Vendre sur Amazon Europe depuis une LLC américaine vous oblige à évaluer votre obligation d'enregistrement à la TVA dans l'UE, OSS/IOSS, Marketplace Facilitator (Amazon retient la TVA dans de nombreux cas comme deemed supplier). En tant qu'auto-entrepreneur, gardez à l'esprit la franchise en base de TVA (seuils 91 900 € / 36 800 €) et l'option pour la TVA sur encaissements. On le développe dans notre article sur la <a href="/fr/blog/tva-sur-les-services-numeriques-internationaux-quand-elle">TVA sur les services numériques internationaux</a>.
3. **Fiscalité de la LLC en France.** Le rapport DAC7 met en évidence des revenus : votre LLC, en tant que Disregarded Entity selon le droit américain, est généralement traitée par l'administration française comme une **société de personnes étrangère fiscalement transparente**. Les revenus vous sont attribués comme bénéfice industriel et commercial (BIC, annexe 2031) ou bénéfice non commercial (BNC, annexe 2035) selon la nature de votre activité, ou comme revenus de capitaux mobiliers (RCM, 2042 IFU) pour la partie passive. La <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener">DGFiP</a> applique le BOI-INT-CVB-USA pour les conventions et le BOI-IS-BASE pour la qualification des entités étrangères transparentes.
4. **Risque de requalification (article 209 B et abus de droit, L 64 LPF).** Si vous interposez une LLC sans substance pour vendre sur Amazon Europe alors que vous êtes résident fiscal français au sens de l'article 4 B du CGI, la DGFiP peut activer le **dispositif anti-abus de l'article 209 B du CGI** (CFC à la française) ou la qualification d'**abus de droit (art. L 64 du LPF)** avec majoration de 80 %, voire engager une procédure pour fraude fiscale (art. 1741 CGI). On le développe dans <a href="/fr/blog/risques-fiscaux-dune-mauvaise-structuration-internationale">risques fiscaux d'une mauvaise structuration internationale</a>.

### Plateformes affectées (liste non exhaustive)

- **E-commerce de biens** : Amazon, eBay, Etsy, AliExpress UE, Vinted, Leboncoin, Wallapop, ManoMano.
- **Services personnels** : Fiverr (entité UE), Upwork (entité UE), TaskRabbit, Glovo, Just Eat, Deliveroo.
- **Location immobilière** : Airbnb, Booking, Vrbo, Spotahome, Idealista (lorsqu'elle intermédie les paiements).
- **Mobilité** : Uber, Cabify, Bolt, Free Now.

### Comment planifier correctement

1. **Déclarez les revenus de manière cohérente.** Si vous vendez sur Amazon Europe, ces revenus se croisent avec votre IRPF français, espagnol, mexicain ou argentin via la donnée DAC7 + CRS. La seule stratégie valable est de bien déclarer.
2. **Optimisez dans le cadre légal.** Il y a déductibilité des charges dans la LLC (voir <a href="/fr/blog/gerer-votre-llc-au-quotidien-guide-pratique-pour-non">charges déductibles dans votre LLC</a>) et planification des distributions à l'associé.
3. **Considérez la substance.** Si vous comptez opérer à grande échelle depuis une LLC, dotez-la de substance (bureau, contrats, gestionnaires, présence opérationnelle réelle) ou acceptez que l'AEAT puisse la regarder sous l'angle de la transparence/simulation. Cadre complet dans <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">conception d'une structure internationale solide</a>.
4. **Ne laissez pas passer le premier avis.** Les administrations envoient généralement des communications de "discordance" avant d'ouvrir une inspection formelle ; bien répondre évite la procédure.

### En résumé

DAC7 est le complément naturel du CRS pour l'économie de plateforme. Ce n'est pas optionnel, ça ne s'évite pas et, combiné au CRS et à DAC8, cela conforme le système d'information fiscale le plus dense de l'histoire européenne. La façon professionnelle d'opérer est de bien déclarer et de concevoir la structure pour que ce qui est déclaré soit fiscalement efficient.

Vous vendez sur Amazon, Etsy, Airbnb ou toute plateforme européenne via une LLC et vous voulez voir comment optimiser légalement votre charge fiscale sans risque ? Réservez votre consultation gratuite.

## Conformité fiscale en France : CFC, transparence et attribution de revenus

Une LLC américaine est un outil légal et reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution : en tant que propriétaire résident fiscal français au sens de l'article 4 B du CGI, l'administration française conserve le droit d'imposer ce que la LLC génère. L'important est de savoir **sous quel régime** s'applique cette imposition.

### En France et dans la zone francophone

- **France (CGI et BOFIP).** Si votre LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), la DGFiP la traite généralement comme une **société de personnes étrangère fiscalement transparente** : les bénéfices nets vous sont attribués au titre du BIC (annexe 2031) ou du BNC (annexe 2035) l'année de leur réalisation, intégrés dans le revenu imposable et soumis au barème progressif de l'IR plus prélèvements sociaux (CSG/CRDS) au taux de 17,2 % sur les revenus du patrimoine. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et que vous êtes son contrôleur unique avec des revenus majoritairement passifs, l'**article 209 B du CGI** (anti-CFC pour entreprises) et l'**article 123 bis du CGI** (anti-CFC pour particuliers, avec seuil de détention 10 % et régime fiscal privilégié) peuvent s'activer. La différence n'est pas optionnelle : elle dépend de la substance économique, pas du nom de l'entité.
- **Déclarations informatives.** Comptes bancaires aux États-Unis et tous les comptes IBAN européens à votre nom personnel (Wise, Revolut, N26, Wallester) : **Formulaire 3916** chaque année avec la 2042, sans seuil. Comptes d'actifs numériques à l'étranger : **Formulaire 3916-bis**. Pour la LLC elle-même en tant qu'établissement étranger contrôlé : déclaration 2065 le cas échéant et annexe 2257 si l'art. 209 B s'applique.
- **Convention France–États-Unis.** La convention de 1994 (avec ses avenants successifs, dernier protocole en vigueur depuis 2009) règle la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement stable en France ne constitue pas, en soi, un ES de l'associé, mais la **direction effective** peut en créer un si toute la gestion se fait depuis votre domicile français (BOI-INT-CVB-USA-10-20).
- **Belgique, Luxembourg, Suisse, Québec.** Chaque juridiction francophone a son propre régime de transparence et anti-abus : Belgique avec la **Cayman Tax** (taxe de transparence sur les constructions juridiques étrangères, art. 5/1 CIR 92), Luxembourg avec la directive ATAD transposée et le test de substance, Suisse avec la **circulaire AFC n°5** sur la transparence des sociétés étrangères, Québec avec les **règles SECI** fédérales canadiennes (sociétés étrangères contrôlées par des intérêts canadiens). Le principe commun : ce que la LLC retient comme bénéfice est considéré comme perçu par le résident si l'entité est jugée transparente ou contrôlée.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

La règle pratique : une LLC opérationnelle, avec substance, déclarée correctement en résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.

Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et nous documentons chaque étape pour que votre déclaration locale soit défendable en cas de contrôle.

<!-- exentax:banking-facts-v1 -->
## Faits bancaires et fiscaux à préciser

L'information sur les fintechs et le CRS évolue et nous voulons que vous l'ayez telle qu'elle est aujourd'hui :

### Notes par fournisseur

- **Mercury** opère avec plusieurs banques partenaires titulaires d'une licence fédérale et d'une couverture **FDIC** via sweep network : principalement **Choice Financial Group** et **Evolve Bank & Trust**, ainsi que **Column N.A.** dans certains cas hérités. Mercury n'est pas une banque ; c'est une plateforme fintech adossée à ces partner banks. Si Mercury ferme un compte, le solde est généralement restitué **par chèque à l'adresse enregistrée du titulaire** et cela peut être un problème opérationnel sérieux pour les non-résidents ; il convient d'avoir un compte secondaire actif (Relay, Wise Business, etc.) en contingence.
- **Wise** distribue deux produits distincts : **Wise Personal** (compte personnel) et **Wise Business** (compte pour entreprises, y compris votre LLC). Pour une LLC il faut ouvrir **Wise Business**, pas le personnel. Nuance CRS importante : un **Wise Business détenu par une LLC américaine reste hors CRS** parce que le titulaire est une entité des États-Unis et que les États-Unis ne sont pas une juridiction CRS ; le côté USD opère via Wise US Inc. (périmètre FATCA, pas CRS). En revanche, un **Wise Personal ouvert par un particulier résident fiscal en France, en Espagne** ou dans toute autre juridiction CRS **génère bien un reporting CRS** via Wise Europe SA (Belgique) sur ce particulier. Si vous ouvrez Wise pour votre LLC, ce compte ne vous inclut pas dans le CRS via la LLC ; si en plus vous gardez un Wise Personal à votre nom comme résident d'une juridiction CRS, ce second compte est bien déclaré.
- **Wallester** (Estonie) est une entité financière européenne avec licence EMI/banque émettrice de cartes. Ses comptes IBAN européens **sont dans le périmètre du Standard commun de déclaration (CRS)** et génèrent donc un reporting automatique vers l'administration fiscale du pays de résidence du titulaire.
- **Payoneer** opère via des entités européennes (Payoneer Europe Ltd, Irlande) qui sont également **dans le CRS** pour les clients résidant dans des juridictions appliquant le standard.
- **Revolut Business** : quand il est associé à une **LLC américaine**, l'usage habituel est d'opérer sous Revolut Payments USA ; les IBAN européens (lituaniens, BE) **ne sont pas émis par défaut** à une LLC : ils sont émis aux clients européens de la banque européenne du groupe. Si on vous propose un IBAN européen, vérifiez à quelle entité juridique ce compte est associé et sous quel régime il déclare.
- **Imposition zéro** : aucune structure LLC ne permet "zéro impôt" si vous vivez dans un pays avec CFC/transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **ne pas dupliquer l'imposition** et **bien déclarer en résidence**, pas l'éliminer.

<!-- exentax:legal-refs-v1 -->
## Références : cadre juridique et réglementation

L'argumentaire de cet article repose sur la réglementation et la doctrine suivantes, en vigueur actuellement :

- **Espagne.** Loi 35/2006 de l'IRPF (art. 8, 9 et 91 sur la résidence fiscale et la transparence fiscale internationale), Loi 27/2014 de l'Impôt sur les sociétés (art. 100 sur la TFI), Loi 58/2003 Générale Tributaire, Loi 5/2022 qui a réformé le Modelo 720 après l'arrêt CJUE C-788/19 du 27/01/2022, RD 1065/2007 (Modelos 232 et 720) et Orden HFP/887/2023 (Modelo 721 sur les crypto-actifs à l'étranger).
- **Doctrine administrative.** Résolutions du <a href="https://serviciostelematicosext.hacienda.gob.es/TEAC/DYCTEA" target="_blank" rel="noopener">TEAC</a> et consultations contraignantes de la DGT relatives aux LLC unipersonnelles (entre autres V0443-08, V1631-17, V1147-22), interprétées à la lumière du BOE de février 2020 sur la classification des entités étrangères transparentes.
- **Conventions et réglementation internationale.** Convention de double imposition entre l'Espagne et les États-Unis signée en 1990 avec Protocole de 2013 en vigueur depuis 2019, Directive 2011/16/UE modifiée par DAC6, DAC7 et DAC8, et Modèle de Convention <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> avec ses Commentaires.
- **États-Unis.** Treas. Reg. §301.7701-3 (classification check-the-box), IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) et réglementation FBAR (31 CFR 1010.350).

Ce contenu est divulgatif et ne remplace pas le conseil personnalisé pour votre situation fiscale concrète.

<!-- exentax:execution-v2 -->
## Comment DAC7 s'intègre à la réalité opérationnelle d'un vendeur digital

DAC7 oblige les plateformes numériques européennes à déclarer aux autorités fiscales de chaque État membre l'information de leurs vendeurs actifs : identité, contreparties encaissées, commissions retenues et pays de résidence fiscale. L'information est transmise en janvier de chaque année, relative à l'exercice clos. Voici ce qui change en pratique pour quiconque vend en ligne, avec ou sans LLC.

- **Qui entre et qui n'entre pas.** Tout vendeur avec plus de 30 transactions par an ou plus de 2 000 € de contrepartie annuelle sur une plateforme couverte. En dessous des deux seuils, le vendeur reste "occasionnel" et n'est pas déclaré. Au-dessus de l'un ou de l'autre, vous entrez dans le flux automatique.
- **Plateformes couvertes.** Amazon, eBay, Etsy, Vinted, Leboncoin, Wallapop, Airbnb, Booking, Uber, Cabify, Bolt, Glovo, Just Eat et similaires. Aussi les plateformes SaaS de marketplace (creator platforms, p2p, location de voitures privées). Hors champ : les plateformes de services professionnels purs qui ne traitent pas les paiements (Upwork est dedans ; LinkedIn dehors).
- **LLC américaine comme vendeur.** Si vous vendez via LLC américaine sur Amazon UK ou Etsy DE, la plateforme déclare votre LLC à l'autorité de l'État membre où la plateforme est établie (typiquement Luxembourg ou Irlande). La déclaration voyage ensuite vers le pays de résidence fiscale du vendeur déclaré à la plateforme. Si l'adresse déclarée est celle du prestataire au Wyoming, la déclaration part aux États-Unis (sans usage fiscal réel) ; si c'est votre adresse personnelle de résidence, elle va au pays de résidence.
- **Implication pour le fisc en Espagne ou en France.** L'AEAT et la DGFiP reçoivent les données en février de chaque année et les croisent automatiquement avec la déclaration d'IRPF/IR et, le cas échéant, de TVA. L'omission de revenus issus de plateformes DAC7 est déjà le motif le plus fréquent de redressements parallèles sur les profils digitaux ces dernières années.

### Ce qu'on nous demande le plus

**Comment éviter que la plateforme déclare mal ma LLC ?** En veillant à ce que l'adresse commerciale déclarée et le TIN correspondent à la juridiction correcte. Une LLC avec adresse du prestataire au Wyoming mais propriétaire résident en Espagne génère une déclaration vers les États-Unis, pas vers l'Espagne ; cela vous met "hors" du croisement automatique mais vous oblige toujours à déclarer le revenu en résidence.

**Si je dépasse les seuils, quelle obligation ai-je ?** Celles que vous aviez déjà : déclarer le revenu à l'IRPF/IR comme rendement d'activité ou plus-value selon le cas, et si pertinent, inscription au RETA (Espagne) ou au régime auto-entrepreneur (France) ou structure alternative. DAC7 ne crée pas d'obligations nouvelles, elle rend visibles celles qui existaient déjà.

Chez Exentax nous ajustons la configuration de votre LLC sur chaque plateforme DAC7 pour que la déclaration soit cohérente, encaissons les revenus dans votre IRPF/IR/TVA et vous laissons sans risque de redressement parallèle pour discordance.
<!-- /exentax:execution-v2 -->

## Nous vous l'installons sans que vous perdiez un week-end

Des milliers d'auto-entrepreneurs et d'entrepreneurs opèrent déjà avec leur LLC américaine de façon 100% légale et documentée. Chez Exentax nous prenons en charge tout le processus : constitution, banque, passerelles de paiement, comptabilité, déclarations <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons en toute franchise si la LLC a du sens pour votre cas, sans promesses absolues.

Vous voulez appliquer ce protocole à votre cas ? <a href="/fr/reserver">Réservez une session avec l'équipe Exentax</a> et nous passons en revue votre LLC avec des chiffres réels en trente minutes, sans engagement.


<!-- exentax:defensa-fiscal-v1 -->
## Et si l'administration fiscale me pose des questions sur ma LLC?

  C'est la question récurrente en première consultation, et la réponse courte est: votre LLC n'est pas opaque et, correctement déclarée, un contrôle se clôt avec des formulaires standard. La DGFiP, le SPF Finances belge ou l'administration cantonale suisse peuvent demander le Certificate of Formation de l'État (Wyoming, Delaware ou Nouveau-Mexique), l'EIN émis par l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, l'Operating Agreement signé, les relevés Mercury ou Wise de l'exercice, le Form 5472 avec 1120 pro-forma déposé et la comptabilité qui réconcilie revenus, charges et flux. Si tout cela existe et est remis dans l'ordre, le contrôle ne s'envenime pas.

  Ce que les administrations poursuivent légitimement, ce sont les prête-noms, la résidence fiscale de papier et la non-déclaration des comptes étrangers. Une LLC bien montée fait exactement l'inverse: vous apparaissez comme **beneficial owner** au BOI Report lorsque cela s'applique (vérifiable sur <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), vous signez les comptes bancaires et vous déclarez le revenu là où vous vivez. La structure existe au Secretary of State de l'État, dans les archives de l'IRS et, dès qu'une banque européenne intervient, dans le périmètre CRS de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.

  L'erreur qui fait vraiment dérailler un contrôle, ce n'est pas d'avoir une LLC; c'est de ne pas avoir attribué le revenu correctement dans la déclaration personnelle (formulaire 2042, Cerfa 2047 pour les revenus étrangers), de ne pas avoir déposé le 3916 / 3916-bis pour les comptes à l'étranger ou de ne pas avoir documenté les opérations liées entre l'associé et la LLC. Ces trois fronts se ferment avant la demande, pas après.

  ## Ce qu'une LLC NE fait PAS

  - **Elle ne vous exonère pas de l'impôt en France, en Belgique ou en Suisse.** Si vous y résidez fiscalement, vous y êtes imposé sur le revenu mondial. La LLC organise le côté américain (zéro impôt fédéral pour la SMLLC pass-through hors ECI), elle n'éteint pas l'imposition domestique. L'IR se calcule sur le bénéfice attribué, pas sur les distributions effectivement perçues.
  - **Ce n'est pas un montage offshore ni un schéma BEPS.** C'est une entité américaine reconnue par l'IRS, enregistrée dans un État précis avec adresse physique, agent enregistré et obligations informatives annuelles. Les juridictions offshore classiques (BVI, Belize, Seychelles) ne laissent aucune trace publique; une LLC en laisse cinq.
  - **Elle ne vous protège pas en cas de confusion patrimoniale.** Le *pierce the corporate veil* tombe dès qu'un juge voit la LLC et l'associé fonctionner comme un seul portefeuille: comptes mélangés, dépenses personnelles payées par la LLC, pas d'Operating Agreement signé, pas de comptabilité. Trois mouvements suffisent. Voir aussi <a href="https://www.boe.es" target="_blank" rel="noopener">jurisprudence comparée</a> en Espagne sur l'abus de droit.
  - **Elle n'allège pas vos cotisations sociales à domicile.** Si vous êtes en micro-entreprise française, en statut indépendant belge ou inscrit à l'AVS suisse, votre cotisation reste identique. La LLC opère votre activité face aux clients internationaux; votre cotisation personnelle est indépendante.
  - **Elle ne vous dispense pas de déclarer les comptes étrangers.** France: 3916/3916-bis. Belgique: SPF Finances + Point de contact central de la BNB. Suisse: déclaration cantonale de fortune. Ces obligations appartiennent à l'individu, pas à la LLC.

  Chez Exentax, nous fermons ces cinq fronts chaque année en parallèle du calendrier fédéral américain (Form 5472, 1120 pro-forma, FBAR, Annual Report étatique, BOI Report quand il s'applique). L'objectif: qu'aucun contrôle ne trouve de bout libre et que la structure tienne une révision rétroactive sur 5 à 7 ans.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22DAC%207%20est%20la%20directive%20europ%C3%A9enne%20qui%20oblige%20Airbnb%2C%20Vinted%2C%20Leboncoin%2C%20Etsy%20%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
