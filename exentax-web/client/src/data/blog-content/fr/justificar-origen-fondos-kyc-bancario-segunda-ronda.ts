export default `Si vous avez votre LLC depuis un moment et que Mercury, Wise ou votre passerelle vous demandent soudainement des documents complémentaires sur l'origine des fonds, vous n'êtes pas seul. C'est une demande qui génère beaucoup d'anxiété et, presque toujours, l'une des plus simples à régler bien si on l'aborde avec ordre.

L'essentiel: ce n'est pas un soupçon. C'est un processus réglementé de revue périodique. Ce qui décide de l'issue n'est pas ce que vous avez, c'est **comment vous le présentez**.

## Qu'est-ce qu'une seconde ronde KYC

Une revue périodique re-vérifie: qui est le bénéficiaire effectif, la nature du business, l'origine des fonds, la cohérence avec ce qui a été déclaré à l'ouverture.

Déclencheurs: volume cumulé, changement de pattern, renouvellement périodique standard (12-36 mois), info ponctuelle à actualiser.
### Ce qui sera typiquement demandé

- **Identification mise à jour** du bénéficiaire.
- **Articles of Organization** actualisés.
- **EIN Confirmation Letter** ou 147C.
- **BOI Report confirmation**.
- **Operating Agreement signé**.
- **Description du business**.
- **Justificatifs de revenus**: factures représentatives, contrats, états des passerelles.
- **Origine des fonds initiaux** si la question pointe l'apport en capital.
- **Déclarations fiscales** dans certains cas.
### Principe directeur: narratif cohérent

Les institutions cherchent la **cohérence** entre ce que vous avez dit à l'ouverture, le BOI, les relevés et ce que vous dites maintenant.
## Procédure

### Étape 1. Lire le courriel attentivement
La plupart des demandes sont spécifiques (4-7 docs, délai 7-14 jours).

### Étape 2. Recueillir le package actuel
Articles, EIN letter, OA, BOI confirmation, passeport et justificatif de domicile à jour, 5-10 factures représentatives.

### Étape 3. Préparer une description du business sur une page
Ce que fait la LLC, à qui elle vend, comment elle facture, combien, origine des fonds initiaux.

### Étape 4. Justifier l'origine des fonds
- Services professionnels: factures + contrats + relevés.
- SaaS: dashboard Stripe/Paddle + payouts conciliés.
- E-commerce: dashboard Shopify/Amazon + payouts + factures fournisseurs.
- Apports initiaux: relevé du compte source.
- Crypto: historique exchange + on-chain.

### Étape 5. Envoyer le package complet en un seul envoi
Avec courriel d'introduction qui énumère, dans l'ordre, ce qui est joint.

### Étape 6. Rester disponible
Répondre sous 24-48h aux clarifications.
### À ne pas faire

- Répondre à la hâte sans cohérence.
- Bouger de l'argent "pour soulager".
- Mentir ou exagérer.
- Changer adresse ou données profil pendant la revue.
- Ignorer le courriel.
### Quand un appui pro paie

- Volumes élevés.
- Opération multi-pays/multi-devise complexe.
- Historique d'incidents.
### Comment nous l'abordons chez Exentax

Chez Exentax, nous accompagnons régulièrement des rondes KYC. Réservez une session initiale gratuite via notre page contact.
## Stack bancaire équilibré: Mercury, Relay, Slash et Wise

Il n'existe pas de compte parfait pour une LLC. Il existe le **stack** approprié, où chaque outil joue un rôle:

- **Mercury** (opéré comme fintech avec des banques partenaires (Choice Financial Group et Evolve Bank & Trust principalement; Column N.A. sur des comptes hérités), FDIC via sweep network jusqu'à la limite en vigueur). Compte principal opérationnel pour non-résidents avec une bonne UX, ACH et virements. Reste l'une des options les plus éprouvées à ouvrir depuis l'étranger.
- **Relay** (adossé à Thread Bank, FDIC). Excellent **compte de secours** et pour le budgeting "envelope": jusqu'à 20 sous-comptes et 50 cartes de débit, intégration profonde avec QuickBooks et Xero. Si Mercury bloque ou demande une revue KYC, Relay évite l'arrêt de votre activité.
- **Slash** (adossé à Column N.A. (établissement à charte fédérale, FDIC)). Banque pensée pour les opérateurs en ligne: émission instantanée de cartes virtuelles par fournisseur, contrôles de dépenses granulaires, cashback sur la publicité numérique. Le complément naturel quand vous gérez Meta Ads, Google Ads ou des abonnements SaaS.
- **Wise Business** (EMI multi-devises, ce n'est pas une banque). Pour encaisser et payer en EUR, GBP, USD et autres devises avec coordonnées bancaires locales et conversion au taux interbancaire. Ne remplace pas un vrai compte américain, mais imbattable pour la trésorerie internationale.
- **Wallester / Revolut Business.** Wallester apporte des cartes corporate avec BIN propre pour gros volume. Revolut Business fonctionne en complément européen, pas comme compte principal de la LLC.

La recommandation réaliste: **Mercury + Relay en secours + Slash pour les opérations publicitaires + Wise pour la trésorerie FX**. C'est la configuration qui minimise le risque de blocage et réduit le coût réel. Chez Exentax, nous ouvrons et configurons ce stack dans le cadre de la constitution.

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

<!-- exentax:legal-facts-v1 -->
## Faits légaux & de procédure

Les obligations <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a> et <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> ont bougé en recent years; voici la version en vigueur:
### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## Faits juridiques et de procédure

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

<!-- exentax:execution-v2 -->
## Justifier l'origine des fonds en KYC bancaire: le "second tour" que presque personne ne prépare

Le premier tour KYC passe avec passeport et adresse. Le second tour - qui arrive à 3-9 mois avec la première entrée significative - est où 30% des comptes tombent. C'est la phase "nous voulons comprendre d'où vient cet argent".

- **Ce qu'on vous demandera.** Source of Wealth (comment vous avez bâti votre patrimoine global) et Source of Funds (origine spécifique de l'argent qui entre aujourd'hui). Documents typiques: déclarations des 2-3 dernières années, contrats de cession d'actifs antérieurs, relevés bancaires montrant l'accumulation, contrats clients générant les revenus actuels.
- **Ce qui passe sans discussion.** Traçabilité linéaire: déclaration année X montre revenu, banque origine montre accumulation, virement entrant de client identifié avec contrat de services et facture émise par votre LLC. Chaque euro a du papier derrière.
- **Ce qui déclenche une alerte.** Dépôts en espèces récents, virements de comptes tiers sans justification, crypto convertie sans traçabilité on-chain, "prêts familiaux" sans contrat notarié et déclaration du prêteur. Chacun peut geler le compte.
- **Quand préparer.** Avant la première entrée >25 000 EUR/USD, pas après la demande de la banque. Dossier numérique prêt = réponse en 24 h; sans, 3-6 semaines et fermeture possible.

### Ce qu'on nous demande le plus

**La crypto convertie en fiat est-elle problématique?** Oui, sauf traçabilité on-chain complète: wallets propres, transactions identifiables, déclaration de l'année de la plus-value et de la conversion. Sans, presque toute banque la classe en risque.

**Et si les fonds viennent d'une cession d'entreprise il y a des années?** Passe le filtre si vous avez: contrat de cession, acte d'annulation de parts, relevés banque originale, déclaration de l'année (avec plus-value déclarée) et traçabilité jusqu'au compte actuel.

Chez Exentax nous préparons le dossier Source of Wealth/Funds avant la première opération significative: documents, narrative cohérente et traduction assermentée si nécessaire - pour que le second tour ne gèle pas votre opérationnel.
<!-- /exentax:execution-v2 -->

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

## Références: sources et réglementation bancaire

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

### Lectures complémentaires

Détail pratique à verrouiller avant d'agir. La majorité des dégâts évitables sur ce point précis viennent de l'oubli de la documentation, pas de la logique fiscale sous-jacente.
### Ce qu'on va typiquement vous demander

Note de terrain après avoir piloté cela mois après mois pour des clients: la règle est simple, c'est l'exécution qui casse. Planifiez l'opérationnel avant le juridique.

### Principe directeur: narration cohérente

C'est l'un des points que nous auditons en premier lorsque nous reprenons un dossier. S'il n'est pas propre ici, toute hypothèse en aval devient négociable face à l'administration.

### Étape 1. Lire le courriel avec calme et en détail

### Étape 2. Rassembler votre dossier actuel

Constat tiré de nos dossiers: voilà comment cela se passe vraiment, pas comme une page commerciale le présente. Les chiffres et le calendrier comptent - se tromper sur l'un ou l'autre fait s'effondrer le reste.

### Étape 3. Préparer la description du business en une page

Note de terrain après avoir piloté cela mois après mois pour des clients: la règle est simple, c'est l'exécution qui casse. Planifiez l'opérationnel avant le juridique.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Si%20vous%20avez%20votre%20LLC%20depuis%20un%20moment%20et%20que%20Mercury%2C%20Wise%20ou%20votre%20passere%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->
`;
