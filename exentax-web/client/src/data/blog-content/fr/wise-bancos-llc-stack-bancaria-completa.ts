export default `Quand quelqu'un ouvre une LLC depuis l'étranger, la conversation bancaire se réduit presque toujours à une seule question: "Mercury ou Wise?". Cette question est **le symptôme du problème, pas la solution**. Une LLC opérationnelle ne tient pas sur un seul compte, ni même sur deux. Elle a besoin d'une **configuration bancaire** pensée comme un système. Dans cet article, nous expliquons comment concevoir une configuration qui tient le quotidien, ce qui arrive quand une pièce lâche, et pourquoi 80 % des blocages que nous voyons chez Exentax viennent justement de l'absence de tout cela.

Ce n'est pas un article Wise vs Mercury (pour cela vous avez déjà notre <a href="/fr/blog/wise-business-avec-votre-llc-guide-complet-de-gestion-multi">guide Wise Business pour LLC</a>, le <a href="/fr/blog/comment-ouvrir-un-compte-mercury-pour-votre-llc-depuis">guide Mercury</a> et la <a href="/fr/blog/banques-traditionnelles-vs-fintech-pour-votre-llc-ou-ouvrir">comparaison banque vs fintech</a>). C'est l'article qui assemble les pièces précédentes en une architecture cohérente.

## L'erreur mentale: penser le compte comme "le compte"

Les personnes venues d'Europe ou d'Amérique latine apportent un modèle bancaire très précis: **un compte par personne, un compte par société**. Point. Si ce compte est bloqué, vous allez à l'agence, parlez à votre conseiller, c'est réglé. Le système suppose que la banque a intérêt à ne pas vous perdre comme client.

Dans l'**écosystème fintech américain**, ce modèle n'existe pas. Mercury, Wise, Brex, Relay, Revolut Business et compagnie sont des **plateformes technologiques**, pas des banques. Le compte s'ouvre par API, se ferme par API, et les décisions sont prises par un système de scoring + une équipe compliance que vous ne connaissez pas et que vous ne pouvez pas appeler. Si le système décide que votre compte passe en revue, votre accès est **gelé pendant 30, 60 ou 90 jours**, et personne ne vous garantit la récupération des fonds à court terme.

Premier changement mental: **un compte n'est pas le compte. C'est un fournisseur parmi d'autres, remplaçable comme un hébergeur ou un nom de domaine**. Et comme tout fournisseur critique, il faut de la redondance.
## La configuration minimale viable d'une LLC opérationnelle

À partir de la deuxième année d'activité réelle (facturation et encaissement réguliers), la configuration minimale d'une LLC bien gérée ressemble à ceci:

1. **Compte opérationnel principal en USD** (Mercury, Brex ou banque traditionnelle type Bank of America/Chase si vous avez pu l'ouvrir en personne).
2. **Compte secondaire en USD** du même profil (typiquement Relay si le principal est Mercury, ou inverse). Pas pour l'usage quotidien, mais comme **failover réel** si le principal est bloqué.
3. **Compte multi-devises avec IBAN européen** (Wise Business typiquement). Pour encaisser des clients européens en EUR sans SWIFT et pour avoir un point d'entrée dans le système bancaire européen.
4. **Passerelle de paiement** connectée à l'un des deux comptes USD (Stripe, PayPal Business, Dodo Payments). Voir la <a href="/fr/blog/passerelles-de-paiement-pour-votre-llc-stripe-paypal-et-dodo">comparaison des passerelles</a>.
5. **Carte corporate physique + cartes virtuelles** pour abonnements SaaS et achats ponctuels.
6. **Réserves séparées** pour impôts, FX et opérations (détaillé plus bas).

Si cela paraît excessif: ça l'est pour le premier mois. C'est **strictement le minimum** pour ne pas perdre l'opérationnel quand quelque chose lâche. Et quelque chose lâche toujours.
## Pourquoi Mercury seul ne suffit pas

Mercury est sans doute le meilleur produit du marché pour une LLC de non-résident: onboarding online, sans frais mensuel, intégration correcte avec la compta et un support raisonnable. Mais Mercury **n'est pas une banque**: c'est une couche logicielle au-dessus de banques partenaires (Choice Financial, Column N.A., Evolve). Si l'une coupe le cordon avec vous, Mercury **ne peut pas vous rouvrir le compte** ni déplacer les fonds vers un autre partenaire sans votre intervention.

Ce que nous voyons à Exentax presque chaque semaine:

- Compte Mercury bloqué pour un virement entrant "atypique" (client aux Philippines, paiement d'un exchange crypto, retour Stripe sans description claire).
- Email automatique Mercury demandant des justificatifs (facture, contrat, justification du flux).
- 7 à 14 jours sans opérationnel le temps de la revue compliance.
- Dans 70 % des cas, compte rétabli. Dans 30 %, **fermeture avec restitution des fonds en 30-60 jours**.

Si toute votre opération dépend de ce compte, vous ne payez pas l'équipe, ne facturez pas les clients qui exigent l'ACH, et ne tenez pas vos abonnements SaaS critiques. Avoir un compte secondaire pré-autorisé et opérationnel transforme une **crise d'entreprise** en **désagrément de 48 heures**.
## Pourquoi Wise seul ne suffit pas

Wise Business est excellent pour le multi-devises, l'IBAN européen et la conversion FX. Mais Wise **n'est pas un compte opérationnel américain**. Ses routing et account number USD sont techniquement des "details", pas un compte bancaire nominatif à votre LLC dans une banque US. Trois implications pratiques:

1. **Stripe US, Amazon US, certains marketplaces et grandes entreprises** acceptent les details USD de Wise sans problème, mais d'autres (entités publiques, brokers régulés, partenaires exigeant l'ACH direct) les refusent dès qu'ils détectent que le receveur est un EMI et pas une banque.
2. **Le flux Stripe → Wise → votre IBAN local** marche, mais ajoute un acteur à la chaîne compliance. En cas de blocage, vous devez prouver la traçabilité à plus d'une entité. On reste calme : chez Exentax, c'est notre routine de la semaine, on boucle ça avant que la lettre n'arrive dans ta boîte.
3. **Wise reporte à votre fisc local via CRS** depuis la Belgique et à d'autres juridictions selon le solde. Si vous croyez que Wise vous donne de la confidentialité, lisez d'abord <a href="/fr/blog/wise-iban-et-llc-ce-qui-est-vraiment-declare-au-fisc">ce que Wise reporte vraiment au fisc</a> et <a href="/fr/blog/wise-business-et-crs-ce-qui-est-declare-a-votre-fisc">comment Wise s'inscrit dans CRS</a>.

Conclusion: Wise est **une pièce indispensable** du puzzle européen, mais ne remplace pas un compte opérationnel USD nominatif à votre LLC.
## Le piège de l'IBAN belge (et de l'IBAN non-local)

Quand vous ouvrez Wise Business comme LLC américaine, on vous attribue un **IBAN belge** (BE...). Cela surprend ceux qui pensaient recevoir un IBAN du pays où ils résident. La conséquence est double:

- Opérationnellement, l'IBAN fonctionne parfaitement pour SEPA dans la zone euro. Vous encaissez et payez comme avec un compte belge.
- Fiscalement et pour la **déclaration de comptes à l'étranger** (Modelo 720 en Espagne, IES au Portugal, **3916 en France**, équivalents ailleurs), cet IBAN belge est **un compte à l'étranger au nom d'une entité étrangère**. Si vous dépassez les seuils et êtes résident fiscal dans l'un de ces pays, **vous devez le déclarer**.

L'erreur typique: "comme l'IBAN commence par BE, ce n'est pas 'mon compte', c'est celui de la LLC, je ne le déclare pas". Faux. La règle de déclaration des comptes à l'étranger regarde le bénéficiaire effectif (vous, personne physique), pas le titulaire formel. Idem pour le compte Mercury. Plus de détails dans <a href="/fr/blog/les-comptes-bancaires-americains-rapportent-ils-a-votre">comptes US et fisc</a> et le <a href="/fr/blog/crs-et-vos-comptes-bancaires-llc-ce-qui-est-partage-avec">guide CRS pour comptes bancaires LLC</a>.
## Règles internes qui vous épargnent 5 chiffres

La configuration n'est que le hardware. Ce qui évite les vrais problèmes, ce sont les règles d'opération:

### 1. Jamais, jamais mélanger personnel et LLC

Évident, mais erreur la plus chère et la plus fréquente. Si vous payez votre Netflix perso avec la carte de la LLC, vous **percez le voile corporatif** et offrez au fisc + <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> un boulevard pour traiter la LLC comme une extension de votre patrimoine personnel. Zéro exception.

### 2. Segmenter par risque

Si la LLC a de gros clients B2B et reçoit aussi des paiements de marketplaces crypto ou de gateways "tier 2", **séparez les flux sur des comptes distincts**. Le principal reçoit les flux propres et bien documentés. Le secondaire absorbe les flux volatils.

### 3. Tax buffer de 25-35 %

Chaque entrée d'argent: **séparez automatiquement 25-35 %** vers un compte ou sous-compte de "tax reserve". Couvre l'impôt que vous paierez chez vous (oui, vous le paierez, voir <a href="/fr/blog/votre-llc-ne-paie-pas-dimpot-aux-usa-alors-que-se-passe-t-il">pourquoi votre LLC ne paie pas aux US mais vous payez chez vous</a>). Mercury et Relay permettent des sous-comptes; Wise a "Jars".

### 4. Buffer FX séparé

Activité en USD mais dépenses/déclaration en EUR: un buffer FX évite de convertir au pire moment.

### 5. Documenter les contrats avant le premier paiement

Tout virement entrant >5 000 USD d'un nouveau client génère tôt ou tard un email compliance demandant "purpose of payment, contract, invoice". Avoir contrat signé et facture émise **avant** réduit la revue de 14 jours à 24 heures.

### 6. Backup absolu: la règle "si ça tombe demain"

"Si Mercury tombe demain définitivement, qu'est-ce que je fais dans 72 heures?". Si la réponse est "je ne sais pas", la configuration est mauvaise.
### Ce qui se passe quand on bloque (pas "si", "quand")

Vérité opérationnelle: **toute LLC avec 18+ mois d'activité a connu au moins un événement de blocage**. Ce qui change, c'est l'ampleur du dégât. Respire : chez Exentax c'est de la routine, on te remet à jour et le prochain contrôle se clôt en un tour, sans drame.

Blocage type. C'est le moment de demander de l'aide. Chez Exentax on ouvre le dossier, on dépose ce qui manque et on répond à l'administration pour toi.
- **Jour 0**: email automatique "your account is under review".
- **Jours 1-3**: vous fournissez les documents.
- **Jours 4-14**: silence, accès limité aux entrées.
- **Jour 14-30**: réouverture complète ou fermeture avec restitution sous 30-60 jours.

Pour minimiser:
- Activer le compte secondaire dès le jour 1.
- Garder les deux comptes en usage léger continu.
- Sauvegarder mensuellement les relevés en PDF.
- Documenter chaque client avec un mini-dossier.
### La conversation des passerelles: Stripe et compagnie

Stripe est l'option par défaut, mais a son propre régime de blocages: **rolling reserves de 5-10 %** sur 90-120 jours pour les comptes nouveaux ou à risque, et possibilité de geler les fonds.

- **Ne connectez pas Stripe à un seul compte**.
- Mettez votre **descripteur Stripe** au nom commercial réel.
- Configurez **alertes de churn** + buffer équivalent à 30 jours de payout.

PayPal Business: utile en complément, pas en canal unique.
### Cartes: physiques, virtuelles et la règle "une par catégorie"

- **Une carte physique**: dépenses physiques (coworking, voyage, repas client).
- **Carte virtuelle "SaaS"**: tous les abonnements récurrents.
- **Carte virtuelle "Ads"**: campagnes payées (Google Ads, Meta, LinkedIn).
- **Carte virtuelle "single-use"**: achats ponctuels chez fournisseurs douteux.
## Ce que vous devez retenir

- La bonne question n'est pas "Mercury ou Wise", c'est "**quelle configuration je monte**".
- Minimum: **2 comptes USD + 1 compte multi-devises + passerelle + cartes segmentées + réserves**.
- L'IBAN Wise est belge, pas local. Reste un compte à l'étranger pour la déclaration.
- Les blocages sont une routine prévisible. La différence entre "désagrément" et "crisis" est la configuration.
- **Jamais mélanger personnel et LLC**, segmenter par risque, tax buffer 25-35 %, FX buffer et documentation pré-paiement: les cinq règles qui vous épargnent cinq chiffres.

Si vous avez une LLC et voulez qu'on conçoive ensemble la bonne configuration bancaire pour votre volume et profil de risque, **on le voit ensemble** lors d'une consultation gratuite de 30 minutes. La monter bien dès le départ coûte peu. La monter à moitié et le découvrir le jour où Mercury envoie le premier email "your account is under review" coûte cher.
## Références légales et réglementaires

Cet article s'appuie sur la réglementation actuellement en vigueur. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto). C'est là qu'Exentax intervient : on dépose le formulaire, on archive l'accusé et, si l'administration demande, ta réponse est déjà sur le bureau.
- **Convention Espagne–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directive (UE) 2011/16, modifiée par DAC6 (dispositifs transfrontaliers), DAC7 (Directive (UE) 2021/514, plateformes numériques) et DAC8 (Directive (UE) 2023/2226, crypto-actifs); Directive (UE) 2016/1164 (ATAD: CFC, *exit tax*, dispositifs hybrides); Norme commune de déclaration de l'OCDE (CRS).
- **Cadre international.** Modèle de Convention OCDE, art. 5 (établissement permanent) et Commentaires; Action 5 BEPS (substance économique); Recommandation 24 du GAFI (bénéficiaire effectif).
L'application concrète de ces règles à votre cas dépend de votre résidence fiscale, de l'activité de la LLC et de la documentation conservée. Ce contenu est informatif et ne remplace pas un conseil professionnel personnalisé.

<!-- exentax:bank-balance-v1 -->
## Configuration bancaire équilibrée: Mercury, Relay, Slash et Wise

Il n'existe pas de compte parfait pour une LLC. Il existe la **configuration** appropriée, où chaque outil joue un rôle:

- **Mercury** (opéré comme fintech avec des banques partenaires (Choice Financial Group et Evolve Bank & Trust principalement; Column N.A. sur des comptes hérités), FDIC via sweep network jusqu'à la limite en vigueur). Compte principal opérationnel pour non-résidents avec une bonne UX, ACH et virements. Reste l'une des options les plus éprouvées à ouvrir depuis l'étranger.
- **Relay** (adossé à Thread Bank, FDIC). Excellent **compte de secours** et pour le budgeting "envelope": jusqu'à 20 sous-comptes et 50 cartes de débit, intégration profonde avec QuickBooks et Xero. Si Mercury bloque ou demande une revue KYC, Relay évite l'arrêt de votre activité.
- **Slash** (adossé à Column N.A. (établissement à charte fédérale, FDIC)). Banque pensée pour les opérateurs en ligne: émission instantanée de cartes virtuelles par fournisseur, contrôles de dépenses granulaires, cashback sur la publicité numérique. Le complément naturel quand vous gérez Meta Ads, Google Ads ou des abonnements SaaS.
- **Wise Business** (EMI multi-devises, ce n'est pas une banque). Pour encaisser et payer en EUR, GBP, USD et autres devises avec coordonnées bancaires locales et conversion au taux interbancaire. Ne remplace pas un vrai compte américain, mais imbattable pour la trésorerie internationale.
- **Wallester / Revolut Business.** Wallester apporte des cartes corporate avec BIN propre pour gros volume. Revolut Business fonctionne en complément européen, pas comme compte principal de la LLC.

<!-- exentax:lote26-native-v1:wise-bancos-llc-stack-bancaria-completa-fr -->
## Comment lire la configuration bancaire de la LLC comme un mapping stable plutôt que comme une comparaison ouverte de produits

La configuration bancaire de la LLC se lit plus utilement comme un mapping stable entre rôle opérationnel, titulaire du compte et pays de l'IBAN, que comme une comparaison ouverte de produits. Parmi les fournisseurs opérationnellement compatibles avec un profil LLC américaine — Mercury, Wise, Stripe et Relay — chacun occupe un rôle discret : Mercury et Relay comme compte d'exploitation US, Wise comme couche multidevises et Stripe comme ingest marchand le cas échéant.

Une courte note dans le dossier LLC qui consigne quel prestataire joue quel rôle dans la configuration actuelle, avec la date où la configuration a été fixée, rend l'architecture relisible en quelques minutes dès qu'une contrepartie demande des coordonnées bancaires ou qu'un conseiller fiscal demande une réconciliation.
<!-- /exentax:lote26-native-v1:wise-bancos-llc-stack-bancaria-completa-fr -->

Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href="/fr#calculadora">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

La recommandation réaliste: **Mercury + Relay en secours + Slash pour les opérations publicitaires + Wise pour la trésorerie FX**. C'est la configuration qui minimise le risque de blocage et réduit le coût réel. Chez Exentax, nous mettons en place cette configuration dans le cadre de la constitution.

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

<!-- exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-fr -->
## Pourquoi une configuration bancaire à plusieurs rails apporte de la stabilité opérationnelle

Construire une configuration bancaire à plusieurs rails pour une LLC n'est pas une question de redondance théorique ; c'est une question de continuité opérationnelle. Lorsqu'un seul fournisseur centralise tous les flux, n'importe quelle revue interne ou simple maintenance technique peut interrompre l'activité pendant plusieurs jours. À l'inverse, une configuration qui sépare les rails de réception, les rails de paiement vers les fournisseurs et les rails de change réduit l'exposition à un point unique de défaillance et lisse la planification de trésorerie.

Un schéma simple et durable consiste à attribuer à chaque rail une fonction claire et à éviter les chevauchements : un rail principal pour les flux opérationnels, un rail secondaire de change pour les paiements internationaux, et un compte dédié exclusivement aux distributions au membre. Cette répartition rend les rapprochements plus rapides, facilite les conversations avec les comptables et limite les surprises lorsque l'un des fournisseurs introduit un changement de tarification ou de politique d'acceptation.
<!-- /exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-fr -->

<!-- exentax:legal-facts-v1 -->
## Faits légaux & de procédure

Les obligations FinCEN et IRS ont évolué ces dernières années; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## Nous l'installons sans que vous perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous nous occupons de l'ensemble du processus: constitution, banque, passerelles de paiement, comptabilité, déclarations IRS et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.<!-- exentax:execution-v2 -->
## Wise + banques pour LLC: la configuration bancaire complète pour tout non-résident

La question « Mercury ou Wise? » est mal posée. La bonne réponse est « les deux, plus Stripe, plus une alternative ».

- **Couche 1: compte opérationnel principal (Mercury).** Reçoit Stripe payouts, paie vendors via ACH gratuit, carte USD, intègre QuickBooks.
- **Couche 2: backup et multi-devises (Wise Business).** USD/EUR/GBP. Reçoit clients UE directement en EUR (SEPA local, pas SWIFT). Si Mercury ferme, Wise continue.
- **Couche 3: gateway de paiement (Stripe + alternative).** Stripe US connecté à Mercury. Lemon Squeezy/Dodo comme MoR pour ventes digitales UE.
- **Couche 4: trésorerie et FX optimisé.** Compte Wise EUR pour réserves. Conversion timing-optimisée.

### Configuration complète typique

LLC Wyoming + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Coût mensuel ~50-100$ pour volume &lt;100k$/an.

### Ce qu'on nous demande le plus

**Mercury ou Wise pour Stripe payout?** Mercury légèrement plus rapide.

**Brex/Ramp pour petite LLC?** Pas en dessous de 500k$/an typiquement.

Chez Exentax, nous mettons en place la configuration complète sous forme de pack clé en main.
<!-- /exentax:execution-v2 -->

## Comment nous travaillons chez Exentax

Notre équipe est spécialisée dans les structures fiscales internationales pour les résidents de pays hispanophones qui exploitent des activités en ligne. Nous combinons une connaissance locale de l'Espagne, de l'Andorre et de l'Amérique latine avec une expérience opérationnelle de constitution d'entités au Delaware, dans le Wyoming, en Estonie et dans d'autres juridictions. Chaque dossier commence par une consultation gratuite au cours de laquelle nous évaluons la résidence, l'activité et les objectifs, et nous vous disons honnêtement si la structure proposée a du sens ou si une alternative plus simple suffit.

  ### Configuration bancaire LLC : configuration pratique pour résidents fiscaux français

  Pour un résident fiscal français exploitant une LLC américaine, la structure bancaire optimale combine **Wise Business Europe SA** (immatriculée en Belgique sous BCE 0708.022.075, supervisée par la **Banque Nationale de Belgique** comme établissement de monnaie électronique en vertu de la directive PSD2 transposée par la loi belge du 11 mars 2018) avec **Mercury** ou **Relay** côté américain (Mercury opère via **Column N.A.** et **Choice Financial Group**, FDIC certificate #14583, garantissant USD 250 000 par déposant et par catégorie au sens du **12 CFR §330**).

  Côté déclaratif français, chaque compte étranger doit être déclaré sur le **formulaire 3916** annexé à la déclaration 2042 (article 1649 A du CGI), avec sanction de 1 500 € par compte non déclaré (10 000 € si le compte est domicilié dans un État ou territoire non coopératif au sens de l'article 238-0 A du CGI). Les revenus de la LLC remontent au formulaire **2042-C-PRO** (BIC ou BNC selon l'activité) avec crédit d'impôt USA selon la **convention franco-américaine du 31/08/1994** (BOI-INT-CVB-USA-10-20). Respire : chez Exentax c'est de la routine, on te remet à jour et le prochain contrôle se clôt en un tour, sans drame.

<!-- exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa -->
## La configuration bancaire vu de l'intérieur de la LLC

Quand on regarde la configuration bancaire d'une LLC sur douze mois plutôt
qu'au moment de l'ouverture, trois schémas reviennent. Le premier
est la complémentarité entre Mercury et Wise Business : Mercury sert
de compte d'opérations USD avec routing américain, Wise sert de
réceptacle multi-devises pour les clients hors USD. Le deuxième est
la place de Stripe quand l'activité prend du volume : la passerelle
de paiement vit sur le compte américain et alimente Mercury, qui
nourrit Wise pour la part EUR/GBP/MXN. Le troisième est l'usage de
Relay comme alternative à Mercury pour les LLC dont la combinaison
État de constitution et profil du membre passe mieux côté Relay.

Aucun de ces choix n'est gravé dans le marbre. Le bon réflexe pour
le membre non résident est d'écrire en une page la cartographie des
flux entrants et sortants prévus sur l'année à venir, puis de lire
cette page à voix haute. Si la phrase qui en sort est claire — par
exemple "Stripe US encaisse, Mercury garde le float opérationnel,
Wise distribue en EUR" — la configuration est correcte. Si elle hésite, c'est
souvent qu'une couche est en trop ou qu'une couche manque. La
documentation honnête de cette décision protège la LLC mieux que
n'importe quelle architecture sophistiquée.

<!-- /exentax:lote8-native-v1:wise-bancos-llc-stack-bancaria-completa -->

<!-- exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-fr-bis -->
## Comment positionner Mercury et Wise dans la configuration sans les mettre en concurrence

Mercury et Wise occupent dans la configuration des fonctions distinctes plutôt que concurrentes : Mercury sert habituellement de rail de réception et de paiements en USD, tandis que Wise sert de rail de change multi-devises pour les paiements internationaux. Cette répartition fonctionnelle évite de demander à un seul fournisseur de couvrir des cas d'usage qui ne sont pas son cœur de métier et facilite la conversation avec chaque équipe de conformité, qui voit alors un profil cohérent.
<!-- /exentax:lote16-native-v1:wise-bancos-llc-stack-bancaria-completa-fr-bis -->

<!-- exentax:cross-refs-v1 -->
## Sur le même sujet

- [Wise Business avec votre LLC : le guide multi-devises complet](/fr/blog/wise-business-avec-votre-llc-guide-complet-de-gestion-multi)
- [Wise IBAN et LLC : ce qui est vraiment déclaré au fisc](/fr/blog/wise-iban-et-llc-ce-qui-est-vraiment-declare-au-fisc)
- [Changer de devises pour votre LLC : meilleures options et éviter les frais cachés](/fr/blog/changer-de-devises-pour-votre-llc-meilleures-options-et)
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
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Quand%20quelqu'un%20ouvre%20une%20LLC%20depuis%20l'%C3%A9tranger%2C%20la%20conversation%20bancaire%20se%20%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;