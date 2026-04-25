export default `
La Common Reporting Standard (CRS) est la pièce la plus importante de la fiscalité internationale de la dernière décennie, et très peu de gens comprennent ce qu'elle signifie pour quelqu'un qui possède une <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a> ou des comptes hors de son pays de résidence. Démontons le sujet avec précision technique et sans alarmisme.

Cet article a été pensé pour un public hispanophone couvrant l'Espagne et l'Amérique latine, mais il touche un nerf qui vaut pour tout résident fiscal français, belge ou suisse : dès que vous détenez une LLC avec compte bancaire en USD ou un compte ouvert hors de votre pays de résidence, votre déclaration locale doit intégrer des obligations d'information que beaucoup ignorent jusqu'au premier contrôle. Côté France, c'est le **Formulaire 3916 / 3916-bis** (déclaration des comptes bancaires, comptes d'actifs numériques et contrats de capitalisation détenus à l'étranger), à joindre chaque année à la déclaration de revenus, plus la déclaration des revenus eux-mêmes (intérêts, dividendes, plus-values) sur les annexes 2042 correspondantes ; côté Belgique, c'est la déclaration au Point de contact central de la BNB et la rubrique « comptes à l'étranger » de l'IPP ; côté Suisse, c'est la déclaration cantonale au titre de l'impôt sur la fortune. La logique CRS décrite ici est la même : ce qui change, c'est le formulaire local que vous devrez remplir pour être en règle.

## Qu'est-ce que la CRS et pourquoi elle existe

La **Common Reporting Standard** a été approuvée par le Conseil de l'OCDE en juillet 2014 en réponse au G20, après la crise financière et les scandales d'évasion fiscale (LuxLeaks, Panama Papers). L'objectif est clair : les administrations fiscales des pays adhérents échangent automatiquement les informations sur les comptes financiers de non-résidents.

Sur le plan technique, la CRS généralise à plus de cent juridictions le modèle antérieur (FATCA), mais sur une base multilatérale plutôt que bilatérale. L'Espagne l'a transposée par le Real Decreto 1021/2015 et l'Orden HAP/1695/2016, qui régulent le **Modelo 289** (déclaration informative annuelle de comptes financiers de non-résidents que les entités financières espagnoles transmettent à l'AEAT, et que l'Espagne reçoit en sens inverse depuis les autres pays adhérents).

En Amérique latine, la CRS a été mise en œuvre, entre autres, par : Mexique (depuis 2017), Argentine, Colombie, Chili, Brésil, Uruguay, Panama, Pérou, Costa Rica, Équateur et République dominicaine. Les États-Unis, point essentiel : **ne sont pas adhérents à la CRS**. Ils disposent de leur propre système (FATCA), bilatéral et uniquement sortant, pas entrant. Nous approfondissons cela dans notre article sur <a href="/fr/blog/les-comptes-bancaires-americains-rapportent-ils-a-votre">si les comptes bancaires américains rapportent à votre fisc</a> et, pour comprendre pourquoi ils ne signeront pas non plus la nouvelle version, dans <a href="/fr/blog/crs-2-0-carf-pourquoi-les-usa-ne-signeront-jamais-llc">CRS 2.0 et CARF : pourquoi les USA ne signeront jamais</a>.

### Cadre normatif

- **OCDE** : Common Reporting Standard, juillet 2014. Texte consolidé et commentaires officiels.
- **UE** : Directive 2011/16/UE sur la coopération administrative (DAC), modifiée par la DAC2 (Directive 2014/107/UE) qui incorpore la CRS dans le droit de l'Union.
- **Espagne** : Real Decreto 1021/2015, Orden HAP/1695/2016, Orden HAC/3625/2003 (Modelo 720), Orden HFP/886/2023 (Modelo 721 sur les crypto-actifs détenus à l'étranger).
- **Multilateral Competent Authority Agreement (MCAA)** : l'instrument de l'OCDE par lequel chaque pays active l'échange bilatéral avec chacun des autres. L'Espagne a activé l'échange avec pratiquement toute l'UE et avec la plupart des juridictions adhérentes.

## Quelle information est exactement déclarée

Chaque **Reporting Financial Institution** (banque, courtier, fintech avec licence bancaire, fonds d'investissement, compagnie d'assurance avec produits d'investissement) qui détecte un titulaire dont la résidence fiscale diffère du pays où le compte est tenu doit déclarer :

| Catégorie | Détail |
| --- | --- |
| Données du titulaire | Nom, adresse, pays de résidence fiscale, NIF/TIN, date et lieu de naissance (personnes physiques) |
| Données de l'entité | Nom, NIF, pays. Pour les comptes détenus par des **NFE passives**, également les données des **bénéficiaires effectifs** contrôlants |
| Données du compte | Numéro de compte, nom et identifiant de l'institution financière |
| Soldes | Solde ou valeur à la clôture de l'année civile (ou à la clôture du compte s'il a été annulé en cours d'année) |
| Revenus | Intérêts bruts, dividendes bruts, autres revenus générés, produits bruts de cession ou de remboursement d'actifs financiers (comptes de dépôt) |

Ce flux est annuel, généralement entre mai et septembre de l'année suivant l'exercice déclaré, et il est croisé avec les déclarations du contribuable (en Espagne : IRPF, Modelo 720 et, après la dernière réforme, Modelo 721 pour les crypto-actifs).

## Ce qui se passe avec votre LLC américaine : la nuance que presque personne n'explique

C'est là que naissent les malentendus. Fixons les concepts :

1. **Les États-Unis n'envoient pas de données via la CRS.** Ni Mercury, ni Relay, ni une banque régionale américaine ne transmettront directement de données à l'AEAT, au SAT, à la DIAN ou à l'AFIP via la CRS. Ce que font les États-Unis, c'est FATCA, qui est **unilatéral et sortant** : ils demandent des données aux institutions étrangères sur les comptes des US persons, mais n'envoient pas automatiquement de données équivalentes en sens inverse (ils le font dans certains cas via les IGAs Modèle 1, mais à un niveau bien inférieur à la CRS).
2. **Vos comptes dans les fintechs européennes au nom de votre LLC SONT déclarés.** Wise (Belgique), Revolut (Lituanie, et Royaume-Uni avec son régime propre post-Brexit), N26 (Allemagne) et Wallester (Estonie) sont des entités financières soumises à la CRS dans leurs juridictions. Si la titulaire est votre LLC et que vous êtes le **bénéficiaire effectif** résident fiscal en France, en Espagne ou en Amérique latine, ces données arrivent à votre administration fiscale. Nous le détaillons dans nos articles dédiés à <a href="/fr/blog/revolut-business-et-crs-ce-qui-est-declare-a-votre-fisc">Revolut et la CRS</a> et à <a href="/fr/blog/wise-business-et-crs-ce-qui-est-declare-a-votre-fisc">Wise et la CRS</a>.
3. **Votre LLC est probablement une NFE passive (Passive NFE)**, sauf si elle peut démontrer une activité opérationnelle réelle (plus de 50 % de ses revenus sont opérationnels et non des revenus passifs comme dividendes, intérêts, loyers ou redevances non rattachées à une exploitation). Dans le cas typique d'un auto-entrepreneur avec une Single-Member LLC qui facture des services, il y a débat doctrinal : une lecture littérale de la CRS la traiterait comme Active NFE (entreprise opérationnelle), mais la fintech européenne typique la classe comme Passive NFE par prudence, ce qui **oblige à déclarer les controlling persons**. Cette nuance échappe à presque tout le monde.

### Comment la résidence fiscale est déterminée pour la CRS

L'institution financière applique une **due diligence** (RD 1021/2015 et annexe I de la CRS) basée sur l'auto-déclaration du titulaire ainsi que sur des indices objectifs : adresse postale, numéro de téléphone, IP récurrente, NIF déclaré, instructions de virement répétées vers des comptes dans un autre pays, procurations accordées à des résidents d'un autre pays.

Si votre auto-déclaration indique « résidence fiscale en Andorre » mais que votre IP, votre adresse de réception de carte et vos virements récurrents pointent vers Madrid, l'institution peut demander une **documentation supplémentaire** (certificat de résidence fiscale délivré par l'autorité compétente, contrat de bail, etc.) ou, en cas de doute, déclarer aux deux juridictions. Mentir dans l'auto-déclaration CRS constitue une infraction fiscale dans la plupart des juridictions et peut entraîner des conséquences pénales si elle s'accompagne de droits éludés significatifs.

## Implications réelles en France (Formulaire 3916, déclaration 2042)

Si vous êtes résident fiscal en France au sens de l'article 4 B du CGI et que vous détenez ou utilisez :

- **Comptes bancaires à l'étranger** ouverts, détenus, utilisés ou clos au cours de l'année (y compris les comptes IBAN européens d'une fintech comme Wise, Revolut, N26 ou Wallester ouverts à votre nom personnel, et tous les comptes USD ou EUR à votre nom ou pour lesquels vous disposez d'une procuration) : **Formulaire 3916** à joindre chaque année à la déclaration 2042, sans seuil de minimis. Une omission est une infraction sanctionnée par 1 500 € par compte non déclaré (10 000 € si le compte est dans un État ou territoire non coopératif), portée à 80 % de la base éludée si l'administration découvre des avoirs occultes (art. 1729-0 A et 1736 IV du CGI).
- **Comptes d'actifs numériques** (cryptos) ouverts auprès d'entreprises établies à l'étranger : **Formulaire 3916-bis**, mêmes obligations. Cela inclut Coinbase US, Kraken US, Binance.com, Bitstamp Luxembourg, Bitpanda Autriche, et toute LLC qui détient des cryptos sur exchange étranger.
- **Contrats de capitalisation et placements assimilés** souscrits à l'étranger : **Formulaire 3916-bis** également, avec mention sur la 2042 IFU.
- **Revenus de votre LLC américaine** : intérêts perçus sur les comptes Mercury, Relay ou Wise (déclarés dans la rubrique RICM), dividendes (catégorie 2042), plus-values de cession de parts (annexe 2074), revenus d'activité non commerciale si l'activité est qualifiée de BNC en France (annexe 2035), ou bénéfices industriels et commerciaux si la LLC fait de la revente (BIC 2031). En tant qu'auto-entrepreneur, gardez à l'esprit que **votre LLC américaine est considérée par l'administration française comme une entité fiscalement transparente** (équivalent société de personnes), ce qui impose la qualification correcte du revenu chez vous.

Le croisement CRS permet à la **Direction Générale des Finances Publiques (DGFiP)** et au service Bercy infos de détecter les omissions presque en temps réel grâce aux flux reçus de Belgique (Wise Europe SA), du Luxembourg, d'Allemagne (N26) et de Lituanie (Revolut). Pour la régularisation volontaire avant tout contrôle, le **dispositif Bercy** propose des modalités de mise en conformité avec une réduction des pénalités selon l'origine des fonds et l'ancienneté de l'omission ; les conditions exactes sont à valider avec l'avis de votre conseil au cas par cas.

### Implications en Belgique, au Luxembourg et en Suisse

- **Belgique** : si vous êtes résident belge, l'IPP exige la mention des comptes à l'étranger dans la déclaration annuelle (rubrique XIII de la déclaration 1) et la déclaration au **Point de contact central (PCC) de la Banque nationale de Belgique** des comptes ouverts hors UE (et désormais aussi de certains intra-UE depuis l'arrêté royal de 2014). Les revenus de la LLC américaine relèvent du précompte mobilier de 30 % sur les intérêts et dividendes, sans QPFIE applicable aux entités transparentes.
- **Luxembourg** : la déclaration 100 luxembourgeoise comporte une section spécifique pour les comptes à l'étranger ; l'**ACD** (Administration des contributions directes) reçoit le flux CRS depuis la Belgique et la France et croise avec la résidence luxembourgeoise. Les revenus de la LLC sont imposables comme revenus de capitaux mobiliers ou comme bénéfices commerciaux selon la qualification.
- **Suisse** : la déclaration cantonale au titre de l'**impôt sur la fortune** exige la liste exhaustive des comptes bancaires hors Suisse au 31 décembre, avec valeur de marché. La **directive 2014 de l'AFC** sur l'EAR (échange automatique de renseignements) s'applique avec plus de 100 partenaires. Les revenus de la LLC sont à inscrire dans le **Registre des titres** (Wertschriftenverzeichnis) avec classification selon la source.

## Comment planifier correctement

La conclusion technique est l'opposé de ce que disent beaucoup d'influenceurs : **une LLC américaine bien structurée avec une banque exclusivement chez Mercury ou Relay (États-Unis) a une empreinte CRS minimale**, parce que les États-Unis n'exportent pas de données via la CRS. Mais dès que vous ajoutez une couche européenne (Wise, Revolut, Wallester, N26), vous acceptez que cette information arrive à votre administration fiscale. Ce n'est ni bon ni mauvais : c'est ainsi, et planifier exige de le savoir.

L'approche professionnelle passe par :

1. **Déclarer correctement.** Le croisement existe déjà ; tenter de cacher est une perte de temps et vous expose à des sanctions.
2. **Concevoir la structure pour que ce qui est déclaré soit fiscalement efficient.** Cela implique de décider du pays de résidence, des instruments d'investissement, du calendrier des transferts, des déductions applicables et de la convention fiscale applicable. Voir notre <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">cadre de conception d'une structure internationale</a>.
3. **Maintenir la documentation** : contrats, factures, justificatifs de dépenses, livres comptables de la LLC, auto-déclarations CRS cohérentes. Sans documentation, une inspection inverse de fait la charge de la preuve sur le contribuable.
4. **Connaître les risques de mal s'y prendre.** Nous les couvrons dans <a href="/fr/blog/risques-fiscaux-dune-mauvaise-structuration-internationale">risques fiscaux d'une mauvaise structuration internationale</a>.
5. **Comprendre votre activité économique.** Une LLC de services n'est pas imposée comme une LLC d'e-commerce ou de royalties. Nous le développons dans <a href="/fr/blog/imposition-de-la-llc-selon-lactivite-economique-services">imposition de la LLC selon l'activité économique</a>.

## Erreurs typiques que nous voyons chaque semaine en France

- « Comme Mercury est aux États-Unis, personne n'est au courant. » Vrai pour Mercury face à la CRS — les États-Unis n'exportent pas de données via CRS — mais faux pour vos comptes Wise (Belgique), Revolut (Lituanie), Wallester (Estonie) ou N26 (Allemagne) au nom de la même LLC, qui remontent à la DGFiP via les flux européens.
- « J'ai mis ma résidence fiscale en Andorre, à Dubaï ou au Portugal sous le RNH mais je continue à vivre en France. » La résidence fiscale ne se choisit pas ; elle se détermine par les faits objectifs de l'**article 4 B du CGI** (foyer ou lieu de séjour principal en France, exercice d'une activité professionnelle non accessoire en France, centre des intérêts économiques en France). Nous le développons dans notre article sur la <a href="/fr/blog/nomade-numerique-ou-payer-ses-impots-et-comment-choisir-sa">résidence fiscale du nomade numérique</a>.
- « Si ma LLC facture, il ne m'arrive rien. » La DGFiP peut appliquer le **dispositif anti-abus de l'article 209 B du CGI** (CFC à la française) ou la qualification d'**établissement stable de fait** si la LLC est gérée depuis votre domicile français sans substance opérationnelle aux États-Unis. Bien que les États-Unis ne soient pas un État ou territoire non coopératif, une LLC pass-through peut activer la requalification via la mécanique de la Disregarded Entity. La planification doit éviter ce cas, pas l'ignorer.
- « Je vais mettre le compte au nom d'un proche. » C'est le classique prête-nom déguisé, qui constitue en France un **abus de droit** sanctionnable au sens de l'article L 64 du LPF avec majoration de 80 %, en plus des sanctions pénales pour fraude fiscale (art. 1741 CGI). Nous en analysons les implications dans <a href="/fr/blog/proprietaires-fictifs-pour-llc-pourquoi-cest-illegal-et-les">prête-noms et propriétaires fictifs dans les LLC</a>.

## En résumé

La CRS ne s'« évite » pas depuis une juridiction européenne. Elle se planifie en connaissance de cause. Une LLC américaine reste un outil extraordinairement utile, mais la conception de votre stack bancaire et de votre résidence fiscale sont déterminantes pour que l'empreinte informative que vous générez soit cohérente avec ce que vous déclarez.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Vous voulez que nous regardions comment la CRS vous affecte dans votre cas concret et que nous concevions le stack adéquat ? Réservez votre consultation gratuite et nous l'analysons avec vous.
S'il reste des doutes sur les nuances de cette structure, <a href="/fr/blog/pourquoi-les-freelancers-espagnols-quittent-le-statut-dauto">pourquoi quitter le statut d'auto-entrepreneur en Espagne (et quelles alternatives vous avez)</a> explique en détail un aspect connexe que nous laissons habituellement pour un autre article.

### Lectures associées

- [Société au Panama : fiscalité et résidence](/fr/blog/panama-societe-fiscalite-et-residence-2026)

### Prochaines étapes

Si vous voulez vérifier si cette stratégie correspond à votre situation concrète, chez Exentax nous examinons votre cas de manière personnalisée et vous proposons la structure légale et efficiente qui vous convient vraiment. Réservez une session initiale sans engagement depuis notre page de contact.

<!-- exentax:banking-facts-v1 -->
## Faits bancaires et fiscaux à préciser

L'information sur les fintechs et la CRS évolue ; voici l'état actuel, tel qu'il est aujourd'hui :

### Notes par fournisseur

- **Mercury** opère avec plusieurs banques partenaires à licence fédérale et couverture **FDIC** via sweep network : principalement **Choice Financial Group** et **Evolve Bank & Trust**, ainsi que **Column N.A.** dans certains comptes hérités. Mercury n'est pas une banque ; c'est une plateforme fintech adossée à ces partner banks. Si Mercury ferme un compte, le solde est généralement restitué **par chèque papier envoyé à l'adresse enregistrée du titulaire**, ce qui peut être un problème opérationnel sérieux pour les non-résidents ; conservez un compte secondaire actif (Relay, Wise Business, etc.) en contingence.
- **Wise** distribue deux produits clairement différents : **Wise Personal** (compte personnel) et **Wise Business** (compte entreprise, y compris pour votre LLC). Pour une LLC, vous devez ouvrir **Wise Business**, pas le compte personnel. Nuance CRS importante : une **Wise Business détenue par une LLC américaine reste hors CRS** parce que la titulaire est une entité des États-Unis et que les États-Unis ne sont pas une juridiction CRS ; le côté USD opère via Wise US Inc. (périmètre FATCA, pas CRS). En revanche, une **Wise Personal ouverte par une personne résidente fiscale en Espagne** ou dans une autre juridiction CRS **génère bien un reporting CRS** via Wise Europe SA (Belgique) sur cette personne. Ouvrir Wise pour votre LLC ne vous inclut pas dans la CRS via la LLC ; si vous maintenez en plus une Wise Personal à votre nom en tant que résident CRS, ce second compte rapporte.
- **Wallester** (Estonie) est une entité financière européenne avec une licence EMI/banque émettrice de cartes. Ses comptes IBAN européens **sont à l'intérieur du Common Reporting Standard (CRS)** et génèrent donc un reporting automatique vers l'administration fiscale du pays de résidence du titulaire.
- **Payoneer** opère via des entités européennes (Payoneer Europe Ltd, Irlande) qui sont également **dans le périmètre CRS** pour les clients résidents dans des juridictions participantes.
- **Revolut Business** : associé à une **LLC américaine**, le montage habituel passe par Revolut Payments USA ; les IBAN européens (lituaniens, BE) **ne sont pas émis par défaut** à une LLC : ils sont émis aux clients européens de la banque européenne du groupe. Si on vous propose un IBAN européen, vérifiez à quelle entité juridique ce compte est associé et sous quel régime il rapporte.
- **Imposition zéro** : aucune structure LLC n'obtient « zéro impôt » si vous vivez dans un pays avec CFC, transparence fiscale ou attribution de revenus. Ce que vous obtenez est **pas de double imposition** et **déclaration correcte au lieu de résidence**, pas l'élimination.

<!-- exentax:legal-refs-v1 -->
## Références : cadre légal et réglementation

L'argumentation de cet article repose sur la réglementation et la doctrine suivantes, actuellement en vigueur :

- **Espagne.** Loi 35/2006 de l'IRPF (arts. 8, 9 et 91 sur la résidence fiscale et la transparence fiscale internationale), Loi 27/2014 de l'Impôt sur les Sociétés (art. 100 sur TFI), Loi 58/2003 Générale Tributaire, Loi 5/2022 qui a réformé le Modelo 720 après l'arrêt CJUE C-788/19 du 27/01/2022, RD 1065/2007 (Modelos 232 et 720) et Orden HFP/887/2023 (Modelo 721 sur les crypto-actifs détenus à l'étranger).
- **Doctrine administrative.** Résolutions du TEAC et consultations contraignantes de la DGT relatives aux LLC unipersonnelles (entre autres V0443-08, V1631-17, V1147-22), interprétées à la lumière de l'avis du BOE de février 2020 sur la classification des entités étrangères transparentes.
- **Conventions et règles internationales.** Convention de double imposition entre l'Espagne et les États-Unis signée en 1990 avec le protocole de 2013 en vigueur depuis 2019, Directive 2011/16/UE modifiée par DAC6, DAC7 et DAC8, et Modèle de Convention OCDE avec ses Commentaires.
- **États-Unis.** Treas. Reg. §301.7701-3 (classification check-the-box), IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) et règles FBAR (31 CFR 1010.350).

Ce contenu est divulgatif et ne remplace pas un conseil personnalisé pour votre situation fiscale concrète.

<!-- exentax:execution-v2 -->
## Ce que la CRS signifie aujourd'hui pour les résidents en France, en Belgique, au Luxembourg et en Suisse

La CRS fonctionne en pilote automatique : plus de 110 juridictions échangent des données chaque septembre sur les soldes au 31 décembre de l'année précédente. Si vous êtes résident fiscal en France, en Belgique, au Luxembourg ou en Suisse, les banques où vous détenez des comptes à l'étranger rapportent déjà à la DGFiP, au SPF Finances, à l'ACD ou à l'AFC respectivement. Voilà ce qu'il faut comprendre, sans paranoïa.

- **Ce qui est déclaré.** Soldes de compte au 31 décembre, revenus bruts annuels (intérêts, dividendes), nom du titulaire, résidence fiscale déclarée à la banque et, pour les entités transparentes, données du controlling person. L'information arrive au pays de résidence et est croisée avec la déclaration fiscale du contribuable.
- **Ce qui n'est pas déclaré.** Mouvements détaillés du compte, contreparties spécifiques, information transactionnelle. La CRS, ce sont des soldes + revenus bruts + identification ; ce n'est pas la traçabilité de chaque opération. Cette perception du « ils savent tout » est exagérée à la lettre mais juste dans les conséquences : avec soldes et revenus bruts, on construit la présomption suffisante pour ouvrir une demande d'information.
- **Espagne, Modelo 720 et Modelo 721.** Le résident fiscal espagnol a une obligation propre de déclarer les comptes à l'étranger (au-delà de 50 000 € combinés, Modelo 720) et les crypto-actifs à l'étranger (au-delà de 50 000 €, Modelo 721). Cela ne dépend pas de la CRS, cela dépend de votre obligation. La CRS aide seulement l'AEAT à croiser et à détecter les omissions.
- **Amérique latine — rythmes différents.** Le Mexique (SAT) échange depuis 2018 avec une couverture étendue ; la Colombie (DIAN) depuis 2017 avec un nettoyage progressif ; le Chili (SII) depuis 2018 ; l'Argentine (AFIP) depuis 2018 mais avec un usage opérationnel encore en construction ; l'Uruguay actif mais avec un régime tax-haven qui nuance le flux dans les deux sens. L'intensité d'usage du donné varie mais la disponibilité est désormais généralisée.

### Ce qu'on nous demande le plus

**Si j'ai Mercury dans ma LLC, mon pays le sait-il via la CRS ?** Pas directement : les États-Unis ne participent pas à la CRS. Ce qui entre dans le flux, ce sont les comptes Wise (via la Belgique) et, si la LLC opérait depuis une banque européenne ou asiatique, ceux-là aussi. Mercury reste hors du flux automatique, pas hors de toute obligation déclarative.

**Comment régulariser si je n'ai pas déclaré pendant des années ?** Avec une déclaration complémentaire 720 ou 721 avant qu'arrive un avis. L'arrêt CJUE C-788/19 a limité les amendes espagnoles ; on peut régulariser à un coût bien moindre qu'il y a 5 ans. Nous l'évaluons cas par cas.

Chez Exentax, nous cartographions quels de vos comptes entrent dans la CRS, quelles obligations déclaratives chacun déclenche et nous concevons l'entrée propre ou la régularisation ordonnée quand cela s'applique.
<!-- /exentax:execution-v2 -->

## Parlons de votre structure

Chaque cas a ses nuances : votre pays de résidence, le type d'activité, où sont vos clients, si vous faites de l'investissement ou du trading, si vous vendez aux particuliers ou aux entreprises. Chez Exentax, nous examinons votre situation, nous concevons la structure LLC qui vous convient et nous vous accompagnons chaque année sur la maintenance. Réservez une consultation avec notre équipe et nous commençons par comprendre vos chiffres réels.

<!-- exentax:cross-refs-v1 -->
### Lectures complémentaires

- [Structures offshore : bénéfices réels et risques honnêtes](/fr/blog/structures-offshore-benefices-et-risques-reels)
- [De single-member à multi-member LLC : implications fiscales réelles avant de franchir le pas](/fr/blog/de-single-member-a-multi-member-llc-implications-fiscales)
- [Exit Tax en Espagne : impôt de sortie pour investisseurs en crypto, LLC et Interactive Brokers](/fr/blog/exit-tax-espagne-llc-crypto-interactive-brokers)
<!-- /exentax:cross-refs-v1 -->

Vous voulez appliquer ce protocole à votre cas ? <a href="/fr/reserver">Réservez une session avec l'équipe Exentax</a> et nous examinons votre LLC avec des chiffres réels en trente minutes, sans engagement.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20viens%20de%20l'article%20%22crs%20pour%20residents%20en%20espagne%20et%20latam%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui même.</p>

Si vous préférez en parler en direct, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
