export default `Quand vous passez de l'IBAN français à l'écosystème bancaire américain, il vous manque soudain la moitié du vocabulaire: votre LLC ne donne pas un IBAN, elle donne un routing number plus un account number, et le SWIFT apparaît seulement pour l'international. Tant que vous ne saisissez pas la différence, les virements ne partent pas ou arrivent avec frais cachés.

Nous allons expliquer chacun d'entre eux de manière claire pour que vous ne vous demandiez plus jamais « lequel dois-je donner à ce client? »

## Routing Number (ABA Number)

C'est le code qui identifie une banque aux États-Unis. Il comporte **9 chiffres** et est utilisé exclusivement pour les virements domestiques au sein des États-Unis.

**Exemple:** 084106768

### Quand en avez-vous besoin?

- Pour recevoir des paiements **ACH** de clients américains
- Pour recevoir des **virements domestiques** au sein des États-Unis
- Pour configurer des paiements automatiques (salaires, abonnements)
- Pour connecter votre compte avec Stripe, PayPal, Amazon

### Où le trouver?

Sur Mercury: Dashboard → Account Details → "Routing Number"

**Note importante:** Mercury possède **deux routing numbers**: un pour ACH et un autre pour Wire. Assurez-vous de donner le bon selon le type de virement.
### SWIFT / BIC Code

Le **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) ou **BIC** (Bank Identifier Code) est le code qui identifie une banque au niveau international. Il comporte entre **8 et 11 caractères** (lettres et chiffres).

**Exemple:** CHASUS33 (JPMorgan Chase)

### Quand en avez-vous besoin?

- Pour recevoir des **virements internationaux** depuis l'extérieur des États-Unis
- Pour qu'un client en Europe, en Amérique latine ou en Asie vous envoie de l'argent

### Pourquoi est-il différent du Routing Number?

Le Routing Number est pour le système domestique américain (ACH/Fedwire). Le SWIFT est pour le système international. Ce sont deux réseaux de paiement différents.
## IBAN (International Bank Account Number)

L'**IBAN** est un format standardisé de numéro de compte utilisé en Europe, au Moyen-Orient et dans certaines parties de l'Amérique latine. Il comporte entre **15 et 34 caractères** (variable selon le pays) et contient le code du pays, de la banque et du compte.

**Exemple:** FR76 3000 6000 0112 3456 7890 189 (France)

### Les comptes américains ont-ils un IBAN?

**Non.** Les États-Unis n'utilisent pas le système IBAN. Les comptes américains utilisent le Routing Number + Account Number.

Si un client européen vous demande votre IBAN pour vous payer, la réponse est: « Je n'ai pas d'IBAN. voici mon Routing Number, Account Number et SWIFT Code pour un virement international. »

### Et si vous devez recevoir des paiements d'Europe?

C'est là que **Wise Business** brille. Wise vous donne un IBAN européen (avec le préfixe BE ou DE) lié à votre compte. Les clients européens peuvent vous payer par SEPA comme s'il s'agissait d'un virement local, sans frais de virement international.
### Résumé rapide

| Code | Qu'est-ce que c'est | Chiffres | Utilisé dans | Pour quoi |
|---|---|---|---|---|
| Routing Number | ID de la banque aux États-Unis | 9 | États-Unis | ACH et virements domestiques |
| SWIFT/BIC | ID de la banque internationale | 8-11 | Mondial | Virements internationaux |
| IBAN | N° de compte international | 15-34 | Europe, MENA, LatAm | Virements SEPA |
| Account Number | N° de votre compte | 10-17 | États-Unis | Identifier votre compte |
### Quelles informations donner à chaque type de client?

### Client américain
- **Routing Number** (ACH ou Wire selon le type de paiement)
- **Account Number**
- **Nom de la LLC** (comme bénéficiaire)

### Client européen
- **SWIFT Code** + **Account Number** + **Routing Number** pour un virement international
- Ou mieux: **IBAN européen de Wise** pour qu'il paie par SEPA (moins cher et plus rapide)

### Client latino-américain
- **SWIFT Code** + **Account Number** + **Routing Number** pour un virement international
- Ou: **coordonnées locales de Wise** si le pays dispose d'un compte local disponible
## L'astuce pour encaisser moins cher: les comptes locaux

Voici un conseil qui vaut de l'or: si vous avez des clients en Europe qui vous paient régulièrement, **NE leur donnez PAS vos coordonnées de virement international**. Donnez-leur votre **IBAN européen de Wise Business**.

Pourquoi? Un virement international États-Unis→Europe peut coûter au payeur 20-50€ et prendre 2 à 5 jours. Un SEPA depuis le compte Wise de votre LLC coûte 0-1€ et arrive en 1 jour.

Wise (qui est un EMI, pas une banque) vous génère des comptes locaux dans plusieurs pays:
- **IBAN européen** (préfixe BE ou DE) pour les encaissements SEPA
- **Coordonnées USD** pour les clients américains (routing + account number)
- **Sort code** britannique pour les clients UK
- **BSB** australien pour les clients en Australie

Vos clients paient comme s'il s'agissait d'un virement local, vous recevez sur votre solde multidevise Wise puis transférez vers Mercury quand cela vous convient.

Si certains aspects de cette structure méritent d'être creusés, <a href="/fr/blog/ach-vs-virement-delais-de-paiement-et-impact-sur-la">ACH vs virement: délais de paiement et impact sur la trésorerie de votre LLC</a> et <a href="/fr/blog/comment-developper-votre-activite-numerique-avec-une-llc">Comment développer votre activité numérique avec une LLC américaine</a> détaillent des points adjacents que nous réservons d'habitude à des articles dédiés.
## Mercury: coordonnées bancaires dont vous avez besoin

Pour Mercury, les informations que vous donnerez à vos clients sont:

- **Routing Number ACH:** Pour les encaissements ACH domestiques (paiements de clients US, dépôts de Stripe/PayPal)
- **Routing Number Wire:** Pour les virements domestiques (attention: il est différent de celui de l'ACH)
- **Account Number:** Votre numéro de compte
- **SWIFT Code:** Pour les virements internationaux entrants
- **Adresse de la banque:** la partner bank de Mercury indiquée dans votre tableau de bord (généralement Choice Financial Group, Fargo, ND ou Evolve Bank & Trust, West Memphis, AR)

Mercury facture $0 de frais de virement. aussi bien nationaux qu'internationaux. Vos fonds sont conservés chez les partner banks de Mercury (Choice Financial Group / Evolve Bank & Trust) avec une assurance FDIC.

Chez Exentax on paramètre Mercury, Wise et Revolut Business pour que les virements entre vos clients français et votre LLC partent correctement. Réservez votre consultation gratuite: on vous donne le bon mode d'emploi pour votre activité.
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

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

### Notes par fournisseur

- **Mercury** opère avec plusieurs banques partenaires sous charte fédérale et couverture **FDIC** via sweep network: principalement **Choice Financial Group** et **Evolve Bank & Trust**, et encore **Column N.A.** sur certains comptes hérités. Mercury n'est pas une banque; c'est une plateforme fintech adossée à ces partner banks. Si Mercury ferme un compte, le solde est généralement renvoyé **par chèque papier à l'adresse enregistrée du titulaire**, ce qui peut être un vrai problème opérationnel pour un non-résident; gardez un compte secondaire (Relay, Wise Business, etc.) comme contingence.
- **Wise** propose deux produits distincts: **Wise Personal** et **Wise Business**. Pour une LLC, on doit ouvrir **Wise Business**, pas le compte personnel. Nuance CRS importante: un **Wise Business détenu par une LLC américaine reste hors CRS** car le titulaire est une entité US et les États-Unis ne sont pas dans le CRS; le volet USD passe par Wise US Inc. (périmètre FATCA, pas CRS). En revanche, un **Wise Personal ouvert par une personne physique résidente fiscale en Espagne** ou autre juridiction CRS **déclenche bien une déclaration CRS** via Wise Europe SA (Belgique) sur cette personne. Ouvrir Wise pour votre LLC ne vous fait pas entrer dans le CRS via la LLC; un Wise Personal séparé à votre nom de résident CRS, oui.
- **Wallester** (Estonie) est une entité financière européenne avec licence EMI/banque émettrice de cartes. Ses comptes IBAN européens **entrent dans le Standard Commun de Déclaration (CRS)** et déclenchent un échange automatique vers l'administration fiscale du pays de résidence.
- **Payoneer** opère via des entités européennes (Payoneer Europe Ltd, Irlande) elles aussi **dans le périmètre CRS** pour les clients résidant dans une juridiction participante.
- **Revolut Business**: quand il est associé à une **LLC américaine**, le montage habituel passe par Revolut Payments USA; les IBAN européens (lituaniens, BE) **ne sont pas émis par défaut** à une LLC; ils le sont à des clients européens de la banque européenne du groupe. Si on vous propose un IBAN européen, vérifiez à quelle entité juridique il est rattaché et sous quel régime elle déclare.
- **Fiscalité zéro**: aucune structure LLC ne donne « zéro impôt » si vous vivez dans un pays avec règles CFC, transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **éviter la double imposition** et **déclarer correctement en résidence**, pas l'éliminer.<!-- exentax:execution-v2 -->
## IBAN, SWIFT et Routing Number: à quoi sert chacun et pourquoi votre LLC en a besoin correctement

Confondre IBAN, SWIFT/BIC et ABA Routing Number coûte des paiements rejetés, des virements retournés et trois jours au téléphone avec le support. Chaque format répond à un système distinct, et votre LLC américaine utilise les trois selon le type d'encaissement.

- **Routing Number (ABA, 9 chiffres).** Identifiant de la banque dans le système domestique US. Utilisé par ACH (virements internes US, rapides et bon marché) et wires domestiques. Mercury, Bluevine et toute compte US-only vous en donnent un. Client US qui paie: toujours Routing + numéro de compte.
- **SWIFT/BIC (8-11 caractères).** Identifiant international de la banque pour virements transfrontières. Nécessaire quand un client européen, LATAM ou asiatique vous envoie de l'argent depuis sa banque locale. Mercury, Wise Business le fournissent - mais le wire international coûte 15-30 USD et prend 1-3 jours.
- **IBAN (jusqu'à 34 caractères).** Standard européen + 80 juridictions. Les comptes US traditionnels n'ont pas d'IBAN - uniquement SWIFT. Wise Business émet des IBAN européens (Belgique, UK, Hongrie) pour votre LLC, réduisant la friction côté facturation UE: votre client français paie l'IBAN Wise comme un SEPA local, sans frais de wire.
- **Bonnes pratiques opérationnelles.** Client US: partagez Routing + compte (ACH). Client UE B2B: partagez l'IBAN Wise Business. Client hors UE/US: partagez SWIFT + compte. Mélanger les formats confond le payeur et fait rebondir le virement.

### Ce qu'on nous demande le plus

**Ma LLC peut-elle avoir un IBAN français?** Pas directement: la LLC est entité US sans établissement stable UE. Mais Wise Business lui attribue un IBAN européen (Belgique), fonctionnellement suffisant pour SEPA et conversions EUR.

**Pourquoi mon client européen n'arrive pas à payer par carte quand je lui donne SWIFT?** Parce que SWIFT est un virement bancaire, pas un paiement carte. Pour la carte utilisez Stripe ou équivalent. Pour le virement, le client a besoin de SWIFT + compte + adresse du bénéficiaire et de la banque.

Chez Exentax nous configurons le stack bancaire complet de votre LLC (Mercury principal, Wise Business secondaire avec IBAN européen, passerelle de paiement si pertinent) pour que vous encaissiez proprement dans chaque devise et pays.
<!-- /exentax:execution-v2 -->

## Références: sources sur les structures et juridictions

Les comparaisons et données quantitatives sur les juridictions citées s'appuient sur des sources officielles mises à jour actuellement:

- **États-Unis.** Delaware General Corporation Law et Limited Liability Company Act, Wyoming Limited Liability Company Act (Title 17, Chapter 29), instructions <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> du Form 5472 et IRC §7701 (classification des entités).
- **Andorre.** Llei 95/2010 de l'Impost sobre Societats (IS à 10%), Llei 5/2014 del IRPF et régime de résidence active/passive du Govern d'Andorra.
- **Estonie.** Income Tax Act estonien (impôt différé sur les bénéfices distribués à 20/22%) et documentation officielle du programme e-Residency.
- **Espagne.** Ley 27/2014 (IS), Ley 35/2006 (IRPF, arts. 8-9 sur la résidence et art. 100 sur la TFI) et régime spécial des impatriés (art. 93 LIRPF, "Loi Beckham").
- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Pilier Deux (GloBE) et Modèle de Convention OCDE avec Commentaires.

Le choix de la juridiction dépend toujours de la résidence fiscale réelle du titulaire et de la substance économique de l'activité; étudiez votre cas spécifique avant toute décision structurelle.

<!-- exentax:cross-refs-v1 -->
### Lectures complémentaires

- [LLC aux États-Unis: guide complet pour non-résidents](/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026)
<!-- /exentax:cross-refs-v1 -->
### Rappel pratique

Chaque situation fiscale dépend de votre résidence, de l'activité exercée et des contrats en vigueur. Les informations présentées ici sont générales et ne remplacent pas un conseil personnalisé; analysez votre cas particulier avant toute décision structurelle.

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
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Quand%20vous%20passez%20de%20l'IBAN%20fran%C3%A7ais%20%C3%A0%20l'%C3%A9cosyst%C3%A8me%20bancaire%20am%C3%A9ricain%2C%20il%20vo%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
