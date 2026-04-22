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

> Si votre stack actuel est Wise Business + Relay + Slash avec Mercury en secours, c'est exactement l'ordre inverse de fermeture: passerelles d'abord, fintechs secondaires ensuite, et enfin le compte principal qui voit passer le dernier cash. Wallester avec IBAN européen est généralement parmi les derniers et doit s'analyser à la lumière de vos obligations CRS en Espagne.
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

Pour fermer votre LLC en toute sécurité, réservez une consultation gratuite: nous étudions votre situation, disons honnêtement s'il vaut mieux fermer ou pauser, et fournissons un plan de fermeture daté à prix fermé. Si au contraire la LLC reste pertinente mais que vous voulez baisser coûts et obligations, essayez d'abord notre <strong>calculatrice fiscale</strong> et comparez votre situation actuelle avec celle d'une LLC active avec le bon stack: <a href="/fr/blog/wise-banques-et-llc-la-stack-bancaire-complete-que-personne">Wise Business, Relay et Slash en comptes opératifs, Mercury en secours, et Wallester uniquement quand un IBAN européen est requis</a>, avec l'analyse CRS qui s'impose.

Bien fermer une LLC est un acte d'hygiène fiscale: ranger le passé pour libérer l'avenir. Cela vaut la peine, dans le bon ordre, avec qui l'a fait des centaines de fois.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

<!-- exentax:calc-cta-v1 -->
> **Mettez des chiffres sur votre cas.** Le <a href="/fr#calculadora">simulateur fiscal Exentax</a> compare votre charge fiscale actuelle à celle que vous paieriez en exploitant une LLC américaine correctement déclarée dans votre pays de résidence.
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
- **Revolut Business**: quand il est associé à une **LLC américaine**, le montage habituel passe par Revolut Payments USA; les IBAN européens (lituaniens, BE) **ne sont pas émis par défaut** à une LLC; ils le sont à des clients européens de la banque européenne du groupe. Si on vous propose un IBAN européen, vérifiez à quelle entité juridique il est rattaché et sous quel régime elle déclare.
- **Fiscalité zéro**: aucune structure LLC ne donne « zéro impôt » si vous vivez dans un pays avec règles CFC, transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **éviter la double imposition** et **déclarer correctement en résidence**, pas l'éliminer.

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

Les obligations FinCEN et IRS ont bougé en recent years; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act.** Après la **interim final rule de FinCEN de mars 2025**, l'obligation de déposer le BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées hors des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US par un non-résident est, à ce jour, hors de cette obligation**. Le statut peut encore évoluer: **re-vérifier sur FinCEN.gov au moment du dépôt**. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé et surveillez les mises à jour.
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22como%20disolver%20cerrar%20llc%20paso%20a%20paso%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Révision éditoriale en attente</strong> — Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…si la LLC tiene dueño extranjero único, con la **sanción de 25.000 USD por formulario no p…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…. - **Registered Agent fees** anuales (50-150 USD/año). - **Form 5472 + 1120 pro forma** a…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…pago. 4. Presentación de declaraciones finales ante el IRS (Form 1120 + 5472 marcados *Fin…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1065</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…incluir la **distribución final** del cash al miembro. - **Form 1065 (Final)** si tu LLC e…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 966</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…-S (Final)** si elegiste tributar como C-corp o S-corp. - **Form 966 (Corporate Dissolutio…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 941</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…ón de disolución, si la LLC tributaba como corporación. - **Form 941 / 940 final** si tení…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 568</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…anchise tax mínimo del año del cierre** además de presentar Form 568 final. - **Otros esta…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
