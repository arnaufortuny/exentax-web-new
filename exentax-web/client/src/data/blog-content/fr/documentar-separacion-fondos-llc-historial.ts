export default `Si votre LLC opère depuis un certain temps et que la séparation entre votre argent personnel et celui de la LLC n'est pas parfaitement documentée, vous avez un problème en attente. Il n'apparaît pas aujourd'hui; il apparaît le jour où une banque fait une revue approfondie, l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> demande des justificatifs, ou votre fisc demande une traçabilité des flux.

## Pourquoi la séparation des fonds compte

Trois raisons:

### 1. Corporate veil
Mélanger argent personnel et LLC est l'exemple classique permettant de percer le voile. En cas de réclamation, l'autre partie regardera les relevés bancaires en premier.

### 2. Form 5472
Pour SMLLC non-résident, le 5472 doit reporter toute transaction entre vous et la LLC. Sans flux séparés et documentés, le 5472 est incomplet ou fictif.

### 3. KYC et banque
Quand Mercury, Wise ou Relay font une revue approfondie, ils regardent d'abord si les flux correspondent à l'activité déclarée.
### Ce que séparer signifie vraiment

Trois règles concrètes:

- **Encaissements clients uniquement vers comptes LLC**.
- **Dépenses business payées uniquement avec cartes/comptes LLC**.
- **Mouvements entre vous et la LLC** documentés formellement (Capital Contribution, Owner Distribution, Loan), avec libellé clair.
## Reconstruire la documentation

### Étape 1. Cartographier 12-24 mois
Télécharger les relevés en CSV. Identifier chaque mouvement entre vous et la LLC, date et montant.

### Étape 2. Classifier chaque mouvement
Quatre catégories: Capital Contribution, Owner Distribution, Loan to/from member, Reimbursement of business expense paid personally.

### Étape 3. Générer la documentation rétroactive
- **Capital Contribution**: note écrite à la date avec montant et finalité, enregistrée au Member's Capital Account.
- **Distribution**: note écrite avec montant, profit source et bénéficiaire.
- **Loan**: Promissory Note simple avec date, montant, échéancier, taux (au moins AFR).
- **Reimbursement**: facture originale + entrée comptable.

Ce n'est pas mentir rétroactivement; c'est documenter la substance de ce qui a été fait.

### Étape 4. Ajuster la comptabilité
Chaque mouvement documenté enregistré avec la catégorie correspondante.

### Étape 5. Règles forward-looking
- **Aucune dépense business sur la carte personnelle**; si ça arrive, documenter le remboursement la même semaine.
- **Aucune dépense personnelle sur la carte LLC**.
- **Tout mouvement entre vous et la LLC** avec libellé clair.
### Et le passé sans justificatifs?

- **Documenter avec le raisonnable** sur la base du contexte.
- **Ne pas inventer de factures**.
- **Choisir la classification la plus conservatrice** en cas de doute (un mouvement d'origine incertaine est traité comme Distribution, pas comme Reimbursement).
### Comment nous l'abordons chez Exentax

Chez Exentax, nous faisons cet exercice tous les mois avec des clients arrivant avec dette technique accumulée. Réservez une session initiale gratuite via notre page contact.
### Lectures liées

- [percer le corporate veil: comment l'éviter](/fr/blog/separer-argent-personnel-et-llc-pourquoi-cest-essentiel)
- [comptabilité pour votre LLC: meilleures pratiques](/fr/blog/bookkeeping-pour-votre-llc-americaine-etape-par-etape)
- [Form 5472: quand le déposer et quelle pénalité](/fr/blog/que-se-passe-t-il-si-vous-ne-deposez-pas-le-form-5472)
### Prochaines étapes

Si vous voulez valider cette stratégie, chez Exentax nous examinons votre cas personnellement. Réservez une session initiale sans engagement via notre page contact.

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

Les obligations <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> et IRS ont bougé en recent years; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## Comment nous l'abordons chez Exentax

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.
### Lectures connexes

Constat tiré de nos dossiers: voilà comment cela se passe vraiment, pas comme une page commerciale le présente. Les chiffres et le calendrier comptent - se tromper sur l'un ou l'autre fait s'effondrer le reste.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

## Faits juridiques et de procédure

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

## Références: réglementation pour la gestion opérationnelle

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

<!-- exentax:execution-v2 -->
## Construire un historique de séparation qui résiste à un contrôle

La séparation des fonds n'est pas un confort comptable: c'est la ligne qui sépare "LLC opérationnelle" de "LLC requalifiée en compte personnel" par un inspecteur ou par la banque. Sans historique documenté, la doctrine du piercing the corporate veil devient viable et la protection saute.

- **Source unique des entrées.** Chaque crédit sur Mercury, Relay ou Wise Business doit porter une facture, un contrat ou un mémo. Les virements internes LLC-à-LLC reçoivent un libellé explicite ("loan repayment", "intercompany services"). Un virement sans traçabilité équivaut à une distribution non documentée et ouvre la porte à la requalification.
- **Sorties avec rationalité fiscale.** Paiements fournisseurs avec facture jointe dans l'ERP; salaires ou member draws avec écriture comptable et, le cas échéant, retenue prévue; remboursements de frais du membre avec note de frais préalable. Sans cette trace, l'IRS ou votre administration locale peut requalifier le flux en distribution cachée.
- **Cartes dédiées.** Une carte personnelle passée sur le compte LLC contamine tout l'exercice. Mercury émet des virtuelles par catégorie: une pour les SaaS, une pour la publicité, une pour les déplacements. Si le membre doit dépenser à titre personnel, il utilise son compte privé et se rembourse via note de frais - jamais l'inverse.
- **Documentation vivante, pas archive morte.** Dossier partagé avec Operating Agreement signé, procès-verbaux annuels, notes de frais, contrats de services intra-groupe. C'est la première chose qu'une banque demande en KYC renforcé et la première qu'une inspection réclame.

### Ce qu'on nous demande le plus

**Puis-je me payer moi-même depuis la LLC?** Oui, via un member draw consigné au PV et reflété en comptabilité. Ce qui ne va pas, c'est de retirer sans trace ni périodicité, ou de payer des dépenses personnelles directement depuis le compte LLC.

**Et si j'ai tout mélangé depuis deux ans?** Reconstruction possible: relevés, recatégorisation, PV correctifs et notes de frais rétroactives. Pas élégant, mais défendable. Mieux vaut commencer que continuer à aggraver.

Chez Exentax nous montons cette structure documentaire dès le jour un et révisons chaque clôture pour que l'historique reste défendable.
<!-- /exentax:execution-v2 -->

## Votre prochaine étape avec Exentax

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.
### Avant de commencer: le principe fondateur

Note de terrain après avoir piloté cela mois après mois pour des clients: la règle est simple, c'est l'exécution qui casse. Planifiez l'opérationnel avant le juridique.

### Étape 1. Délimiter la période de mélange

Constat tiré de nos dossiers: voilà comment cela se passe vraiment, pas comme une page commerciale le présente. Les chiffres et le calendrier comptent - se tromper sur l'un ou l'autre fait s'effondrer le reste.

### Étape 2. Rassembler les relevés complets

### Étape 3. Classer chaque transaction

C'est l'un des points que nous auditons en premier lorsque nous reprenons un dossier. S'il n'est pas propre ici, toute hypothèse en aval devient négociable face à l'administration.

  ### Documentation de la séparation des fonds : standard français pour LLC

  Pour un résident fiscal français, la documentation de la séparation entre patrimoine personnel et patrimoine de la LLC doit respecter à la fois la **doctrine américaine du piercing the corporate veil** (*Kinney Shoe Corp. v. Polan*, 939 F.2d 209, 4th Cir. 1991) et les exigences françaises de **traçabilité comptable**. L'**article L. 123-12 du Code de commerce** impose la tenue d'une comptabilité commerciale chronologique et fidèle, complétée par l'**article 54 du CGI** (obligations déclaratives BIC) et l'**article 95 du CGI** (BNC). Les flux entre la LLC et le sócio résident français doivent être documentés sur le **formulaire 2065** (BIC) ou **2035** (BNC) avec annexes 2042-C-PRO. Toute confusion entraîne le risque d'**abus de droit fiscal** (article L. 64 du LPF) avec majoration de 80 % et intérêts de retard de 0,20 % par mois (article 1727 du CGI). La conservation des justificatifs s'effectue sur **6 ans** au sens de l'**article L. 102 B du LPF**.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Si%20votre%20LLC%20op%C3%A8re%20depuis%20un%20certain%20temps%20et%20que%20la%20s%C3%A9paration%20entre%20votre%20a%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
