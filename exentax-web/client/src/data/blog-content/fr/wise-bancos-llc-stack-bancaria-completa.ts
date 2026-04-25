export default `Quand quelqu'un ouvre une LLC depuis l'étranger, la conversation bancaire se réduit presque toujours à une seule question: "Mercury ou Wise?". Cette question est **le symptôme du problème, pas la solution**. Une LLC opérationnelle ne tient pas sur un seul compte, ni même sur deux. Elle a besoin d'une **stack bancaire** pensée comme un système. Dans cet article, nous expliquons comment concevoir une stack qui tient le quotidien, ce qui arrive quand une pièce lâche, et pourquoi 80 % des blocages que nous voyons chez Exentax viennent justement de l'absence de tout cela.

Ce n'est pas un article Wise vs Mercury (pour cela vous avez déjà notre <a href="/fr/blog/wise-business-avec-votre-llc-guide-complet-de-gestion-multi">guide Wise Business pour LLC</a>, le <a href="/fr/blog/comment-ouvrir-un-compte-mercury-pour-votre-llc-depuis">guide Mercury</a> et la <a href="/fr/blog/banques-traditionnelles-vs-fintech-pour-votre-llc-ou-ouvrir">comparaison banque vs fintech</a>). C'est l'article qui assemble les pièces précédentes en une architecture cohérente.

## L'erreur mentale: penser le compte comme "le compte"

Les personnes venues d'Europe ou d'Amérique latine apportent un modèle bancaire très précis: **un compte par personne, un compte par société**. Point. Si ce compte est bloqué, vous allez à l'agence, parlez à votre conseiller, c'est réglé. Le système suppose que la banque a intérêt à ne pas vous perdre comme client.

Dans l'**écosystème fintech américain**, ce modèle n'existe pas. Mercury, Wise, Brex, Relay, Revolut Business et compagnie sont des **plateformes technologiques**, pas des banques. Le compte s'ouvre par API, se ferme par API, et les décisions sont prises par un système de scoring + une équipe compliance que vous ne connaissez pas et que vous ne pouvez pas appeler. Si le système décide que votre compte passe en revue, votre accès est **gelé pendant 30, 60 ou 90 jours**, et personne ne vous garantit la récupération des fonds à court terme.

Premier changement mental: **un compte n'est pas le compte. C'est un fournisseur parmi d'autres, remplaçable comme un hébergeur ou un nom de domaine**. Et comme tout fournisseur critique, il faut de la redondance.
## La stack minimale viable d'une LLC opérationnelle

À partir de la deuxième année d'activité réelle (facturation et encaissement réguliers), la stack minimale d'une LLC bien gérée ressemble à ceci:

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
2. **Le flux Stripe → Wise → votre IBAN local** marche, mais ajoute un acteur à la chaîne compliance. En cas de blocage, vous devez prouver la traçabilité à plus d'une entité.
3. **Wise reporte à votre fisc local via CRS** depuis la Belgique et à d'autres juridictions selon le solde. Si vous croyez que Wise vous donne de la confidentialité, lisez d'abord <a href="/fr/blog/wise-iban-et-llc-ce-qui-est-vraiment-declare-au-fisc">ce que Wise reporte vraiment au fisc</a> et <a href="/fr/blog/wise-business-et-crs-ce-qui-est-declare-a-votre-fisc">comment Wise s'inscrit dans CRS</a>.

Conclusion: Wise est **une pièce indispensable** du puzzle européen, mais ne remplace pas un compte opérationnel USD nominatif à votre LLC.
## Le piège de l'IBAN belge (et de l'IBAN non-local)

Quand vous ouvrez Wise Business comme LLC américaine, on vous attribue un **IBAN belge** (BE...). Cela surprend ceux qui pensaient recevoir un IBAN du pays où ils résident. La conséquence est double:

- Opérationnellement, l'IBAN fonctionne parfaitement pour SEPA dans la zone euro. Vous encaissez et payez comme avec un compte belge.
- Fiscalement et pour la **déclaration de comptes à l'étranger** (Modelo 720 en Espagne, IES au Portugal, **3916 en France**, équivalents ailleurs), cet IBAN belge est **un compte à l'étranger au nom d'une entité étrangère**. Si vous dépassez les seuils et êtes résident fiscal dans l'un de ces pays, **vous devez le déclarer**.

L'erreur typique: "comme l'IBAN commence par BE, ce n'est pas 'mon compte', c'est celui de la LLC, je ne le déclare pas". Faux. La règle de déclaration des comptes à l'étranger regarde le bénéficiaire effectif (vous, personne physique), pas le titulaire formel. Idem pour le compte Mercury. Plus de détails dans <a href="/fr/blog/les-comptes-bancaires-americains-rapportent-ils-a-votre">comptes US et fisc</a> et le <a href="/fr/blog/crs-et-vos-comptes-bancaires-llc-ce-qui-est-partage-avec">guide CRS pour comptes bancaires LLC</a>.
## Règles internes qui vous épargnent 5 chiffres

La stack n'est que le hardware. Ce qui évite les vrais problèmes, ce sont les règles d'opération:

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

"Si Mercury tombe demain définitivement, qu'est-ce que je fais dans 72 heures?". Si la réponse est "je ne sais pas", la stack est mauvaise.
### Ce qui se passe quand on bloque (pas "si", "quand")

Vérité opérationnelle: **toute LLC avec 18+ mois d'activité a connu au moins un événement de blocage**. Ce qui change, c'est l'ampleur du dégât.

Blocage type:
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

- La bonne question n'est pas "Mercury ou Wise", c'est "**quelle stack je monte**".
- Minimum: **2 comptes USD + 1 compte multi-devises + passerelle + cartes segmentées + réserves**.
- L'IBAN Wise est belge, pas local. Reste un compte à l'étranger pour la déclaration.
- Les blocages sont une routine prévisible. La différence entre "désagrément" et "crisis" est la stack.
- **Jamais mélanger personnel et LLC**, segmenter par risque, tax buffer 25-35 %, FX buffer et documentation pré-paiement: les cinq règles qui vous épargnent cinq chiffres.

Si vous avez une LLC et voulez qu'on conçoive ensemble la bonne stack bancaire pour votre volume et profil de risque, **on le voit ensemble** lors d'une consultation gratuite de 30 minutes. La monter bien dès le départ coûte peu. La monter à moitié et le découvrir le jour où Mercury envoie le premier email "your account is under review" coûte cher.
## Références légales et réglementaires

Cet article s'appuie sur la réglementation en vigueur à la date de actuellement. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto).
- **Convention Espagne–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directive (UE) 2011/16, modifiée par DAC6 (dispositifs transfrontaliers), DAC7 (Directive (UE) 2021/514, plateformes numériques) et DAC8 (Directive (UE) 2023/2226, crypto-actifs); Directive (UE) 2016/1164 (ATAD: CFC, *exit tax*, dispositifs hybrides); Norme commune de déclaration de l'OCDE (CRS).
- **Cadre international.** Modèle de Convention OCDE, art. 5 (établissement permanent) et Commentaires; Action 5 BEPS (substance économique); Recommandation 24 du GAFI (bénéficiaire effectif).
L'application concrète de ces règles à votre cas dépend de votre résidence fiscale, de l'activité de la LLC et de la documentation conservée. Ce contenu est informatif et ne remplace pas un conseil professionnel personnalisé.

<!-- exentax:bank-balance-v1 -->
## Stack bancaire équilibré: Mercury, Relay, Slash et Wise

Il n'existe pas de compte parfait pour une LLC. Il existe le **stack** approprié, où chaque outil joue un rôle:

- **Mercury** (opéré comme fintech avec des banques partenaires (Choice Financial Group et Evolve Bank & Trust principalement; Column N.A. sur des comptes hérités), FDIC via sweep network jusqu'à la limite en vigueur). Compte principal opérationnel pour non-résidents avec une bonne UX, ACH et virements. Reste l'une des options les plus éprouvées à ouvrir depuis l'étranger.
- **Relay** (adossé à Thread Bank, FDIC). Excellent **compte de secours** et pour le budgeting "envelope": jusqu'à 20 sous-comptes et 50 cartes de débit, intégration profonde avec QuickBooks et Xero. Si Mercury bloque ou demande une revue KYC, Relay évite l'arrêt de votre activité.
- **Slash** (adossé à Column N.A. (établissement à charte fédérale, FDIC)). Banque pensée pour les opérateurs en ligne: émission instantanée de cartes virtuelles par fournisseur, contrôles de dépenses granulaires, cashback sur la publicité numérique. Le complément naturel quand vous gérez Meta Ads, Google Ads ou des abonnements SaaS.
- **Wise Business** (EMI multi-devises, ce n'est pas une banque). Pour encaisser et payer en EUR, GBP, USD et autres devises avec coordonnées bancaires locales et conversion au taux interbancaire. Ne remplace pas un vrai compte américain, mais imbattable pour la trésorerie internationale.
- **Wallester / Revolut Business.** Wallester apporte des cartes corporate avec BIN propre pour gros volume. Revolut Business fonctionne en complément européen, pas comme compte principal de la LLC.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

La recommandation réaliste: **Mercury + Relay en secours + Slash pour les opérations publicitaires + Wise pour la trésorerie FX**. C'est la configuration qui minimise le risque de blocage et réduit le coût réel. Chez Exentax, nous ouvrons et configurons ce stack dans le cadre de la constitution.

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

<!-- exentax:legal-facts-v1 -->
## Faits légaux & de procédure

Les obligations FinCEN et IRS ont bougé en recent years; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## Nous l'installons sans que vous perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous nous occupons de l'ensemble du processus: constitution, banque, passerelles de paiement, comptabilité, déclarations IRS et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.<!-- exentax:execution-v2 -->
## Wise + banques pour LLC: le stack bancaire complet pour tout non-résident

La question « Mercury ou Wise? » est mal posée. La bonne réponse est « les deux, plus Stripe, plus une alternative ».

- **Couche 1: compte opérationnel principal (Mercury).** Reçoit Stripe payouts, paie vendors via ACH gratuit, carte USD, intègre QuickBooks.
- **Couche 2: backup et multi-devises (Wise Business).** USD/EUR/GBP. Reçoit clients UE directement en EUR (SEPA local, pas SWIFT). Si Mercury ferme, Wise continue.
- **Couche 3: gateway de paiement (Stripe + alternative).** Stripe US connecté à Mercury. Lemon Squeezy/Dodo comme MoR pour ventes digitales UE.
- **Couche 4: trésorerie et FX optimisé.** Compte Wise EUR pour réserves. Conversion timing-optimisée.

### Stack complet typique

LLC Wyoming + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Coût mensuel ~50-100$ pour volume <100k$/an.

### Ce qu'on nous demande le plus

**Mercury ou Wise pour Stripe payout?** Mercury légèrement plus rapide.

**Brex/Ramp pour petite LLC?** Pas en dessous de 500k$/an typiquement.

Chez Exentax nous montons le stack complet en setup packagé.
<!-- /exentax:execution-v2 -->

## Comment nous travaillons chez Exentax

Notre équipe est spécialisée dans les structures fiscales internationales pour les résidents de pays hispanophones qui exploitent des activités en ligne. Nous combinons une connaissance locale de l'Espagne, de l'Andorre et de l'Amérique latine avec une expérience opérationnelle de constitution d'entités au Delaware, dans le Wyoming, en Estonie et dans d'autres juridictions. Chaque dossier commence par une consultation gratuite au cours de laquelle nous évaluons la résidence, l'activité et les objectifs, et nous vous disons honnêtement si la structure proposée a du sens ou si une alternative plus simple suffit.

  ### Stack bancaire LLC : configuration pratique pour résidents fiscaux français

  Pour un résident fiscal français exploitant une LLC américaine, la structure bancaire optimale combine **Wise Business Europe SA** (immatriculée en Belgique sous BCE 0708.022.075, supervisée par la **Banque Nationale de Belgique** comme établissement de monnaie électronique en vertu de la directive PSD2 transposée par la loi belge du 11 mars 2018) avec **Mercury** ou **Relay** côté américain (Mercury opère via **Column N.A.** et **Choice Financial Group**, FDIC certificate #14583, garantissant USD 250 000 par déposant et par catégorie au sens du **12 CFR §330**).

  Côté déclaratif français, chaque compte étranger doit être déclaré sur le **formulaire 3916** annexé à la déclaration 2042 (article 1649 A du CGI), avec sanction de 1 500 € par compte non déclaré (10 000 € si le compte est domicilié dans un État ou territoire non coopératif au sens de l'article 238-0 A du CGI). Les revenus de la LLC remontent au formulaire **2042-C-PRO** (BIC ou BNC selon l'activité) avec crédit d'impôt USA selon la **convention franco-américaine du 31/08/1994** (BOI-INT-CVB-USA-10-20).

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Quand%20quelqu'un%20ouvre%20une%20LLC%20depuis%20l'%C3%A9tranger%2C%20la%20conversation%20bancaire%20se%20%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
