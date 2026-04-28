export default `

Bien fermer une LLC est aussi important que de l'ouvrir. La majorité des contenus sur les LLC parle de constitution, de choix d'État, d'ouverture chez Mercury ou Wise Business... mais presque personne n'explique comment on la **ferme** correctement. Or une LLC mal dissoute continue de générer des obligations, des sanctions, des frais et, au pire, une ombre fiscale aux États-Unis qui peut vous suivre des années.

Ce guide raconte le processus réel et complet pour **dissoudre et fermer votre LLC américaine**: quand cela a du sens, comment ordonner la fermeture État par État, quelles déclarations finales attend l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, ce qui se passe avec votre EIN, ce que l'on fait du BOI Report, comment annuler les comptes bancaires et pourquoi il existe un ordre strict à ne pas modifier. Si vous n'opérez plus avec votre LLC et voulez l'oublier sans surprises à trois ans, voici la voie.

## Pourquoi fermer formellement une LLC plutôt que la « laisser mourir »

Le fantasme classique du propriétaire fatigué de sa LLC: *« si je ne l'utilise pas, je la laisse, les obligations s'éteindront seules »*. Faux. Tant que la LLC est **active ou « delinquent »** au registre étatique, elle continue de générer:

- **Annual report fees** étatiques (50 à 800 USD selon l'État).
- **Franchise tax** au Delaware (300 USD/an) et en Californie (800 USD/an), entre autres.
- **Registered Agent fees** annuels (50-150 USD).
- **Form 5472 + 1120 pro forma** devant l'IRS si la LLC a un propriétaire étranger unique, avec la **sanction de 25 000 USD par formulaire non déposé** (Internal Revenue Code §6038A(d)).
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>)** si votre LLC reste dans le périmètre de la norme en vigueur.
- D'éventuels frais de comptes Mercury, Wise Business, Relay ou Slash.

Si la LLC bascule en *delinquent* ou *administratively dissolved* faute de paiement, cela **ne vous exonère pas** des obligations IRS ni des sanctions accumulées. Cela complique seulement la fermeture future ou, pire, la création d'une autre LLC plus tard, où vous apparaîtrez comme propriétaire d'une entité chargée de pénalités. La meilleure stratégie, et de loin, est une **fermeture formelle et propre** dans le bon ordre.
### Avant de commencer: on ferme seulement quand la décision est claire

Toutes les « envies de fermer » ne sont pas réelles. Vérifier d'abord que la fermeture l'emporte sur les alternatives:

- **Mettre les opérations en pause**, garder la LLC vivante mais à zéro activité, déposer 5472 + 1120 à zéros et BOI report si applicable. Pertinent si vous pourriez la reprendre sous deux ans.
- **Changer la structure** (single-member vers multi-member, ou créer une nouvelle entité et transférer les contrats) si seul le modèle économique change.
- **Migrer d'État** par *domestication* ou *conversion* si ce qui pèse, ce sont les taxes ou le reporting de votre État actuel.

Si vous voulez toujours fermer, voici la procédure. Chaque cas est individuel; revoir avec un conseiller avant exécution.
### Vue d'ensemble: l'ordre compte

La fermeture d'une LLC se compose de **sept blocs** dans cet ordre. Sauter un ou inverser génère des coûts inutiles ou des fenêtres où la LLC produit des obligations alors que vous ne la gérez plus:

1. Décision formelle de dissoudre (interne).
2. Liquidation opérationnelle (clients, contrats, dettes, actifs).
3. Fermeture des comptes bancaires et passerelles de paiement.
4. Dépôt des déclarations finales auprès de l'IRS (Form 1120 + 5472 marqués *Final return*).
5. Dissolution étatique (Articles of Dissolution ou Certificate of Cancellation).
6. Fermeture de l'EIN auprès de l'IRS et clôture du BOI Report auprès de FinCEN s'il y a lieu.
7. Résiliation du Registered Agent et archivage documentaire personnel.

En détail:
## Points clés

### 1. Décision interne et Operating Agreement

Même *single-member*, la décision formelle de dissoudre doit être documentée. Un bon operating agreement l'exige:

- **Resolution to dissolve**: document interne où le membre unique décide de dissoudre la LLC, avec date d'effet.
- En *multi-member*, vote selon le pourcentage requis (souvent unanimité ou majorité qualifiée).

Pas déposé auprès de l'IRS ni de l'État, mais preuve interne que la décision existe et que la fermeture est de bonne foi. Si on vous demande plus tard quand vous avez cessé d'opérer, c'est cette date qui compte.
### 2. Liquidation opérationnelle: clients, dettes et actifs

Avant de toucher à l'IRS ou à l'État, **vider la LLC**:

- **Clôture des contrats clients et fournisseurs.** Notifier la cessation. Émettre les dernières factures. Encaisser les en-cours.
- **Annuler les abonnements** (Stripe, PayPal, outils SaaS, domaines facturés à la LLC, hébergement).
- **Régler les dettes en cours** (taxes étatiques, Registered Agent, factures, royalties, commissions).
- **Distribuer les actifs restants au membre** (transfert du cash résiduel du compte LLC vers le compte personnel). En single-member taxée comme disregarded entity, ce n'est pas un évènement fiscal pour l'IRS, **mais cela doit être documenté** comme retrait du membre.
- **Conserver la comptabilité** (factures émises et reçues, relevés bancaires, justificatifs) au moins **sept ans**. Horizon raisonnable pour audits, intérêts et demandes éventuelles.

Une fois la LLC vide et sans contrats vivants, on passe à la fermeture bancaire.
### 3. Fermer comptes bancaires et passerelles de paiement

C'est le point le plus accidenté. Règle pratique:

- **Déplacer tout le cash vers un compte personnel du membre** avant de demander la fermeture.
- **Demander la fermeture par écrit** depuis le tableau de bord banque/fintech. Mercury, Wise Business, Relay et Slash ont des flux en ligne. Wallester gère via le support.
- **Attendre la fermeture confirmée** avant de déposer la dissolution étatique. Si la banque découvre une entité déjà juridiquement éteinte, elle bloque souvent les opérations en cours.
- **Télécharger tous les relevés** (au moins sept ans) avant fermeture. Ensuite, c'est impossible ou coûteux.
- **Annuler Stripe, PayPal et passerelles** liés à la LLC et exporter l'historique.

> Si votre configuration actuelle est Wise Business + Relay + Slash avec Mercury en secours, c'est exactement l'ordre inverse de fermeture: passerelles d'abord, fintechs secondaires ensuite, et enfin le compte principal qui voit passer le dernier cash. Wallester avec IBAN européen est généralement parmi les derniers et doit s'analyser à la lumière de vos obligations CRS en Espagne.
### 4. Déclarations finales auprès de l'IRS

C'est ici que beaucoup de fermetures dérapent. Avant de mourir, la LLC doit déposer sa **dernière saison IRS**, en cochant **Final return**:

- **Form 1120 + Form 5472 (Final)** si single-member à propriétaire étranger. La case *« Final return »* du Form 1120 doit être cochée et les informations reportable du Form 5472 doivent inclure la **distribution finale** au membre.
- **Form 1065 (Final)** si multi-member taxée en partnership.
- **Form 1120 ou 1120-S (Final)** en cas d'option C-corp ou S-corp.
- **Form 966 (Corporate Dissolution or Liquidation)** dans les **30 jours** suivant la résolution de dissolution, si la LLC était taxée en corporation.
- **Form 941 / 940 final** en cas d'employés.
- Toute déclaration informative en attente (1099, W-2, 8804/8805 le cas échéant).

Date clé: déposer les déclarations finales **avant** de demander la fermeture de l'EIN. Sinon, l'IRS ne ferme pas l'EIN et peut générer une notice de non-filer l'année suivante.

Si vous traînez des 5472 en retard, **régularisez avant de fermer**, sans utiliser la fermeture pour cacher. Détail dans le <a href="/fr/blog/que-se-passe-t-il-si-vous-ne-deposez-pas-le-form-5472">guide des sanctions du Form 5472</a>. Fermer une LLC avec 5472 en attente n'éteint pas les sanctions accumulées; cela les fige et l'IRS les retient contre vous personnellement, en lien avec l'EIN.
### 5. Dissolution étatique: Articles of Dissolution ou Certificate of Cancellation

Cash distribué, comptes fermés, déclarations finales déposées: direction la **fermeture étatique**. Le nom du document dépend de l'État:

- **Wyoming**: *Articles of Dissolution* auprès du Wyoming Secretary of State. Préalable: **annual report** et **license tax** à jour. Coût: 60 USD.
- **Nouveau-Mexique**: *Articles of Dissolution* auprès de la New Mexico Secretary of State. Coût: 25 USD.
- **Delaware**: *Certificate of Cancellation* auprès de la Delaware Division of Corporations. Payer la **franchise tax en attente et celle de l'année de fermeture** avant d'annuler. Annulation: 200 USD; franchise tax (300 USD/an) en sus.
- **Floride**: *Articles of Dissolution* auprès de la Florida Division of Corporations.
- **Californie**: nexus californien: payer la **franchise tax minimale de 800 USD de l'année de fermeture** plus dépôt final du Form 568.
- **Autres États**: chacun son formulaire et ses frais; logique identique.

Détail clé: si votre LLC est **enregistrée en foreign LLC dans d'autres États** (par *foreign qualification* pour vendre en CA, TX, NY, etc.), avant de fermer dans l'État *home* il faut **annuler chaque foreign registration**. Sinon, ces États continuent de facturer annual reports et franchise taxes.
### 6. Fermeture de l'EIN et clôture du BOI Report

Une fois la LLC juridiquement éteinte (État dissous + déclarations finales), dernière étape IRS: **fermer l'EIN**. Techniquement, l'IRS ne « supprime » pas un EIN: il le marque inactif. Pour cela, **lettre signée à l'Internal Revenue Service** identifiant l'entité par nom légal, EIN, adresse et motif, avec copie de la *Notice CP-575* originale ou, à défaut, les données d'attribution.

En parallèle, revoir le **BOI Report auprès de FinCEN**. La réglementation BOI (Beneficial Ownership Information) en vigueur exige des reports initiaux et de mise à jour; à la dissolution, mettre à jour le report dans les délais FinCEN. Le régime BOI a connu changements et suspensions récents: vérifier la règle exacte au moment de la fermeture.

Vos ITIN ou ceux d'éventuels associés ne se « ferment » pas avec la LLC: ils restent valides pour votre activité personnelle aux États-Unis tant que vous les utilisez périodiquement (voir <a href="/fr/blog/comment-obtenir-un-itin-numero-fiscal-irs">guide ITIN</a>).
### 7. Registered Agent, domaines et archive personnelle

Pour fermer la boucle:

- **Résilier le Registered Agent**: notifier par écrit, demander la confirmation. Évite la facture surprise l'année suivante.
- **Annuler domaines et services** facturés à la LLC.
- **Archiver la documentation finale** en lieu sûr: operating agreement original, articles of organization, articles of dissolution scellés, EIN confirmation, copies des déclarations finales (1120, 5472, 1065, 966), relevés bancaires, contrats clos. Minimum sept ans.

À ce stade, la LLC est cliniquement fermée.
### Erreurs typiques observées en fermeture

Chez Exentax, des dizaines de fermetures à l'envers. Les six erreurs les plus coûteuses:

1. **Fermer la banque avant de déposer le 5472 final.** Difficile ensuite de documenter la dernière distribution.
2. **Demander la dissolution étatique sans payer la franchise tax due** (Delaware et Californie sont les plus stricts).
3. **Oublier d'annuler les foreign qualifications** dans d'autres États.
4. **Ne pas cocher Final return sur 1120 / 1065.** L'IRS attend une déclaration l'année suivante.
5. **Ne pas mettre à jour le BOI Report** si la norme l'exige.
6. **Ne pas conserver les relevés bancaires** téléchargés avant fermeture.

Chacune se traduit en factures, sanctions ou demandes plusieurs mois ou années plus tard.
## Comment nous le faisons chez Exentax

Notre processus de **fermeture de LLC clé en main** suit exactement les sept étapes de ce guide. Vous nous donnez le contexte (État, année de constitution, situation bancaire, déclarations déposées, retards éventuels), nous concevons l'ordre, exécutons les déclarations finales, coordonnons avec le Registered Agent et vos banques, déposons la dissolution étatique, fermons l'EIN et, le cas échéant, mettons à jour le BOI Report. En cas de 5472 en retard, **phase préalable** de régularisation pour ne pas traîner d'exposition.

Pour fermer votre LLC en toute sécurité, réservez une consultation gratuite: nous étudions votre situation, disons honnêtement s'il vaut mieux fermer ou pauser, et fournissons un plan de fermeture daté à devis fermé. Si au contraire la LLC reste pertinente mais que vous voulez baisser coûts et obligations, essayez d'abord notre <strong>calculatrice fiscale</strong> et comparez votre situation actuelle avec celle d'une LLC active avec la bonne configuration: <a href="/fr/blog/wise-banques-et-llc-la-stack-bancaire-complete-que-personne">Wise Business, Relay et Slash en comptes opératifs, Mercury en secours, et Wallester uniquement quand un IBAN européen est requis</a>, avec l'analyse CRS qui s'impose.

Bien fermer une LLC est un acte d'hygiène fiscale: ranger le passé pour libérer l'avenir. Cela vaut la peine, dans le bon ordre, avec qui l'a fait des centaines de fois.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

<!-- exentax:lote30-native-v1:como-disolver-cerrar-llc-paso-a-paso-fr -->
## Comment lire la fermeture de la LLC comme une séquence documentée plutôt que comme une fin brutale

La fermeture de la LLC se lit plus utilement comme une séquence documentée — déclarations finales, dissolution auprès de l'État, archivage des dossiers — plutôt que comme une fin brutale. La séquence ne change pas avec la taille de la LLC, et une note courte et datée dans le dossier LLC qui consigne chaque étape avec sa référence de confirmation rend la fermeture défendable en quelques minutes lors d'une consultation ultérieure ou d'un échange avec une administration.
<!-- /exentax:lote30-native-v1:como-disolver-cerrar-llc-paso-a-paso-fr -->

<!-- exentax:lote30-native-v1-bis:como-disolver-cerrar-llc-paso-a-paso-fr -->
## Pourquoi la note s'organise par étape et non par date de fermeture

La note s'organise par étape de la séquence — déclarations finales, dissolution, archivage — et non par date de fermeture, parce que la séquence reste la même quel que soit le calendrier choisi, et cette vue rend chaque étape vérifiable de manière indépendante.
<!-- /exentax:lote30-native-v1-bis:como-disolver-cerrar-llc-paso-a-paso-fr -->

Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href="/fr#calculadora">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Règle pratique: une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.
Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et documentons chaque étape pour que votre déclaration locale soit défendable en cas de contrôle.

<!-- exentax:legal-refs-v1 -->
## Références légales et réglementaires

Cet article s'appuie sur la réglementation en vigueur à la date de actuellement. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de FinCEN).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto).
- **Convention Espagne–USA.** BOE du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directive (UE) 2011/16, modifiée par DAC6 (dispositifs transfrontaliers), DAC7 (Directive (UE) 2021/514, plateformes numériques) et DAC8 (Directive (UE) 2023/2226, crypto-actifs); Directive (UE) 2016/1164 (ATAD: CFC, *exit tax*, dispositifs hybrides); Norme commune de déclaration de l'OCDE (CRS).
- **Cadre international.** Modèle de Convention OCDE, art. 5 (établissement permanent) et Commentaires; Action 5 BEPS (substance économique); Recommandation 24 du GAFI (bénéficiaire effectif).

L'application concrète de ces règles à votre cas dépend de votre résidence fiscale, de l'activité de la LLC et de la documentation conservée. Ce contenu est informatif et ne remplace pas un conseil professionnel personnalisé.

<!-- exentax:banking-facts-v1 -->
## Faits bancaires et fiscaux à préciser

L'information sur les fintechs et le CRS évolue; voici l'état actuel:

### Notes par fournisseur

- **Mercury** opère avec plusieurs banques partenaires sous charte fédérale et couverture **FDIC** via sweep network: principalement **Choice Financial Group** et **Evolve Bank & Trust**, et encore **Column N.A.** sur certains comptes hérités. Mercury n'est pas une banque; c'est une plateforme fintech adossée à ces partner banks. Si Mercury ferme un compte, le solde est généralement renvoyé **par chèque papier à l'adresse enregistrée du titulaire**, ce qui peut être un vrai problème opérationnel pour un non-résident; gardez un compte secondaire (Relay, Wise Business, etc.) comme contingence.
- **Wise** propose deux produits distincts: **Wise Personal** et **Wise Business**. Pour une LLC, on doit ouvrir **Wise Business**, pas le compte personnel. Nuance CRS importante: un **Wise Business détenu par une LLC américaine reste hors CRS** car le titulaire est une entité US et les États-Unis ne sont pas dans le CRS; le volet USD passe par Wise US Inc. (périmètre FATCA, pas CRS). En revanche, un **Wise Personal ouvert par une personne physique résidente fiscale en Espagne** ou autre juridiction CRS **déclenche bien une déclaration CRS** via Wise Europe SA (Belgique) sur cette personne. Ouvrir Wise pour votre LLC ne vous fait pas entrer dans le CRS via la LLC; un Wise Personal séparé à votre nom de résident CRS, oui.
- **Wallester** (Estonie) est une entité financière européenne avec licence EMI/banque émettrice de cartes. Ses comptes IBAN européens **entrent dans le Standard Commun de Déclaration (CRS)** et déclenchent un échange automatique vers l'administration fiscale du pays de résidence.
- **Payoneer** opère via des entités européennes (Payoneer Europe Ltd, Irlande) elles aussi **dans le périmètre CRS** pour les clients résidant dans une juridiction participante.
- **Revolut Business** : lorsqu'il est associé à une **LLC américaine**, il passe par **Revolut Technologies Inc.** avec **Lead Bank** comme partenaire bancaire US. Le compte fourni est un compte américain (routing + account number) ; **aucun IBAN européen n'est émis** à une LLC. Les IBAN européens (lituaniens, BE) appartiennent à **Revolut Bank UAB** et sont émis aux clients européens du groupe. Si on vous propose un IBAN européen rattaché à votre LLC, vérifiez à quelle entité juridique il est rattaché et sous quel régime elle déclare.
- **Fiscalité zéro**: aucune structure LLC ne donne « zéro impôt » si vous vivez dans un pays avec règles CFC, transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **éviter la double imposition** et **déclarer correctement en résidence**, pas l'éliminer.

<!-- exentax:lote19-native-v1:como-disolver-cerrar-llc-paso-a-paso-fr -->
## Comment lire la séquence de dissolution comme un processus unique et ordonné plutôt que comme une liste de tâches isolées

La dissolution d'une LLC se lit plus clairement lorsqu'elle est traitée comme un processus unique et ordonné, et non comme une liste de tâches isolées. L'ordre compte, car chaque étape clôt un périmètre dont dépend l'étape suivante: l'arrêt des opérations précède le règlement des factures en cours, le règlement précède les distributions finales, les distributions précèdent la déclaration fédérale finale, et la déclaration fédérale finale précède les articles de dissolution déposés auprès de l'État.

Lorsque cet ordre est respecté, chaque étape génère le document dont la suivante a besoin, et le dossier de clôture se construit progressivement sans retour en arrière. Lorsque l'ordre est rompu, certaines étapes doivent être répétées parce que la documentation justificative n'est pas encore disponible.

Lire la séquence comme un processus unique aide aussi sur le plan du calendrier: le calendrier d'une clôture est rarement serré, mais les écarts entre étapes ne devraient pas non plus s'étirer indéfiniment, car chaque périmètre ouvert génère de petites obligations (frais, états, avis) qui s'accumulent pendant que la clôture est pendante.

## Comment documenter chaque étape pour qu'elle soutienne la suivante sans recommencer le travail

Chaque étape de la dissolution gagne à être documentée avec une note brève qui rassemble les pièces justificatives produites: la décision écrite des membres, les preuves de règlement des factures restantes, les relevés finaux des comptes, l'attestation de distribution finale, la confirmation de dépôt de la déclaration fédérale finale et l'accusé de réception des articles de dissolution. Ces notes courtes, classées par étape, constituent ensuite le dossier de clôture transmissible à toute partie intéressée et évitent qu'on doive reconstituer la séquence des années plus tard.
<!-- /exentax:lote19-native-v1:como-disolver-cerrar-llc-paso-a-paso-fr -->

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## La séquence exacte pour fermer une LLC sans laisser de loose ends

Mal dissoudre une LLC coûte plus cher que la constituer. Trois plans doivent se fermer simultanément - étatique, fédéral et bancaire - et l'ordre compte. Voici la séquence que nous appliquons chez Exentax lorsqu'un client décide de fermer.

- **Étape 1 - Décision documentée.** Résolution de dissolution signée par les membres, avec date claire et motif. Si la LLC a un Operating Agreement, suivre sa procédure; sinon, le droit de l'État s'applique. Sans résolution, rien ne se ferme correctement ensuite.
- **Étape 2 - Articles of Dissolution à l'État.** Wyoming: 50 $; New Mexico: 25 $; Delaware: 200 $ plus franchise tax en attente. La dissolution prend effet à la date approuvée par le Secretary of State, pas avant. Dès lors, la LLC entre en wind-up: peut liquider mais pas opérer de nouveau business.
- **Étape 3 - Liquidation opérationnelle.** Encaisser factures dues, payer fournisseurs, rendre dépôts, annuler abonnements SaaS, fermer cartes, vider Mercury/Wise dans la période de wind-up. Fermer les comptes bancaires après le dernier paiement, pas avant - sans compte, pas d'encaissement final.
- **Étape 4 - Final Form 5472 + 1120 pro forma.** Cocher "Final Return" sur les deux. Sans cela, l'IRS continue à attendre le 5472 chaque année avec amende de 25 000 USD pour omission. Erreur la plus coûteuse et la plus fréquente.
- **Étape 5 - BOI Final Report.** FinCEN exige un rapport final de BOI à la cessation de l'entité, dans les 30 jours suivant la dissolution étatique. Sans cela, sanctions civiles possibles.
- **Étape 6 - Annulation EIN (optionnel).** Courrier à l'IRS demandant la fermeture du compte EIN. Pas strictement obligatoire (EIN persiste mais devient dormant), mais recommandé pour propreté administrative.

### Ce qu'on nous demande le plus

**Combien de temps prend la fermeture d'une LLC?** Entre 6 et 14 semaines de la décision au dernier dépôt. La dissolution étatique se traite en 2-4 semaines; le 5472 final se dépose à la prochaine fenêtre fiscale (15 avril en année civile).

**Et si je n'ai pas déposé le 5472 depuis des années et veux fermer?** Régulariser d'abord les années manquantes par voluntary disclosure. La dissolution sans régularisation n'efface pas les pénalités - elles restent attachées au responsible party. Nous le gérons avec un protocole conjoint régularisation + fermeture.

Chez Exentax nous fermons des LLCs chaque mois et livrons le dossier complet (résolution, articles, 5472 final, BOI final, fermeture EIN) signé et archivé pour que le client puisse prouver la dissolution propre contre toute requête future.
<!-- /exentax:execution-v2 -->

## Faits légaux & de procédure

Les obligations FinCEN et IRS ont évolué ces dernières années; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.

<!-- exentax:cross-refs-v1 -->
## Sur le même sujet

- [Erreurs critiques sur une LLC déjà constituée : ce qu'on ne vous dit pas](/fr/blog/erreurs-critiques-si-vous-avez-deja-une-llc-et-personne-ne)
- [Maintenance annuelle LLC : obligations que vous ne pouvez pas ignorer](/fr/blog/maintenance-annuelle-llc-obligations-que-vous-ne-pouvez-pas)
- [Changer de prestataire de maintenance LLC sans perdre l'ancienneté](/fr/blog/changer-de-prestataire-de-maintenance-llc-sans-perdre)
<!-- /exentax:cross-refs-v1 -->

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

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22como%20disolver%20cerrar%20llc%20paso%20a%20paso%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

Si votre priorité est l'ITIN, consultez <a href="/fr/services/obtiens-ton-itin">Obtenez votre ITIN avec Exentax</a> et nous le gérons en parallèle.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
