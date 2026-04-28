export default `Depuis la France, on est habitués aux virements SEPA en 1 jour ouvré et aux instantanés en quelques secondes. Aux États-Unis, le système marche différemment: ACH met 1-3 jours, Wire part le même jour mais coûte 15-35 $, et RTP/FedNow arrivent à peine dans l'écosystème fintech. Bien comprendre ces délais vous évite de décaler une paie fournisseur par pur manque d'information.

Mettons tous les délais sur la table pour qu'il n'y ait pas de surprises.

## ACH (Automated Clearing House)

ACH est le système de transferts domestiques des États-Unis. C'est la méthode la plus courante et la moins chère (généralement gratuite).
## Délais ACH

| Type | Délai |
|---|---|
| ACH Standard | **1-3 jours ouvrables** |
| ACH Same-Day | **Le jour même** (si initié avant 14h45 ET) |
| ACH Next-Day | **Le jour ouvrable suivant** |

**Important:** Les jours ouvrables vont du lundi au vendredi (hors jours fériés fédéraux américains). Si vous envoyez un ACH le vendredi après-midi, il n'arrivera pas avant lundi ou mardi.

### Facteurs qui affectent le délai

- **Heure d'envoi**: si vous l'envoyez après l'heure de clôture (cut-off time), il sera traité le jour ouvrable suivant
- **Banque réceptrice**: certaines banques retiennent les fonds ACH 1-2 jours supplémentaires pour vérification
- **Premier transfert**: la première fois que vous envoyez de l'argent vers un nouveau compte peut prendre plus de temps en raison des vérifications de sécurité
### Wire Transfer domestique

Les wires domestiques (à l'intérieur des États-Unis) sont plus rapides que l'ACH, mais ont un coût.

### Délais du Wire domestique

| Type | Délai |
|---|---|
| Wire domestique standard | **Le jour même** (2-6 heures) |
| Wire domestique urgent | **1-2 heures** |

Les wires domestiques arrivent généralement en **heures**, pas en jours. C'est pourquoi on les utilise pour les paiements urgents ou les gros montants.
### Wire Transfer international (SWIFT)

Les wires internationaux utilisent le réseau SWIFT et passent par des banques intermédiaires, ce qui les rend plus lents.

### Délais du Wire international

| Route | Délai |
|---|---|
| États-Unis → Europe | **1-3 jours ouvrables** |
| États-Unis → Amérique latine | **2-5 jours ouvrables** |
| États-Unis → Asie | **2-4 jours ouvrables** |

### Pourquoi prennent-ils plus de temps?

- **Banques intermédiaires**: l'argent peut passer par 1-3 banques intermédiaires avant d'atteindre sa destination
- **Fuseaux horaires**: si la banque réceptrice est déjà fermée, le transfert est traité le jour ouvrable suivant
- **Contrôles de conformité**: les transferts internationaux passent par des contrôles antifraude et anti-blanchiment
### Wise Business

Wise n'utilise pas le réseau SWIFT pour la plupart des transferts. Elle utilise des comptes locaux dans chaque pays, ce qui réduit les délais et les coûts.

### Délais chez Wise

| Route | Délai |
|---|---|
| USD → EUR (SEPA) | **1-2 jours ouvrables** |
| USD → GBP | **1 jour ouvrable** |
| USD → MXN | **1-2 jours ouvrables** |
| USD → COP | **1-3 jours ouvrables** |
### Comparatif général

| Méthode | Délai | Coût (Mercury) | Idéal pour |
|---|---|---|---|
| ACH | 1-3 jours | Gratuit | Paiements domestiques non urgents |
| Wire domestique | Le jour même | **$0 chez Mercury** | Paiements urgents aux États-Unis |
| Wire international | 1-5 jours | **$0 chez Mercury** | Paiements internationaux importants |
| Wise | 1-2 jours | 0,4-1,5% | Paiements internationaux fréquents |
| Stripe/PayPal payout | 2-3 jours | Inclus | Encaissements clients |
## Conseils pour accélérer vos paiements

- **Initiez les transferts tôt**: avant 14h heure de l'Est des États-Unis. Après l'heure de clôture, le traitement se fait le jour ouvrable suivant
- **Évitez les vendredis et jours fériés**: les transferts ne sont pas traités le week-end. Un ACH initié le vendredi arrive au mieux le mardi
- **Utilisez l'ACH Same-Day** quand vous avez besoin de rapidité sans le coût d'un wire. disponible chez Mercury sans frais supplémentaires
- **Consolidez les envois internationaux**: un gros wire revient moins cher que plusieurs petits. Et avec Mercury, les wires sont à $0 de toute façon
- **Utilisez Wise pour les paiements récurrents**: plus rapide et moins cher que les wires traditionnels pour les montants moyens, grâce à son réseau de comptes locaux

Pour refermer, quelques lectures connexes qui s'inscrivent dans le prolongement de ce papier: <a href="/fr/blog/votre-premier-mois-avec-une-llc-ce-a-quoi-vous-attendre">Votre premier mois avec une LLC: ce à quoi vous attendre semaine par semaine</a> et <a href="/fr/blog/changer-de-devises-pour-votre-llc-meilleures-options-et">Changer de devises pour votre LLC: meilleures options et éviter les frais cachés</a> aident à parachever le contexte.
### Le détail qui change tout: Mercury $0 de frais de wire

La plupart des banques facturent entre $15 et $50 par wire transfer. Mercury ne facture rien. Zéro. Ni nationaux ni internationaux. Cela change complètement la façon dont vous planifiez vos paiements:

- Besoin de payer un fournisseur en Europe? Wire international depuis Mercury: $0
- Un client américain veut vous payer par wire? Vous le recevez gratuitement
- Wise vous demande d'envoyer des fonds par wire pour vérification? $0

Mercury utilise Column NA comme banque dépositaire, avec assurance FDIC. Ce n'est pas une fintech expérimentale, c'est une infrastructure financière sérieuse pour votre LLC.

Chez Exentax on câble le routing bancaire optimal pour des clients francophones chaque semaine. Réservez votre consultation gratuite: on regarde vos flux récurrents et on vous dit lequel passer en ACH et lequel pousser en Wire.
## Configuration bancaire équilibrée: Mercury, Relay, Slash et Wise

Il n'existe pas de compte parfait pour une LLC. Il existe le **configuration** appropriée, où chaque outil joue un rôle:

- **Mercury** (opéré comme fintech avec des banques partenaires (Choice Financial Group et Evolve Bank & Trust principalement; Column N.A. sur des comptes hérités), FDIC via sweep network jusqu'à la limite en vigueur). Compte principal opérationnel pour non-résidents avec une bonne UX, ACH et virements. Reste l'une des options les plus éprouvées à ouvrir depuis l'étranger.
- **Relay** (adossé à Thread Bank, FDIC). Excellent **compte de secours** et pour le budgeting "envelope": jusqu'à 20 sous-comptes et 50 cartes de débit, intégration profonde avec QuickBooks et Xero. Si Mercury bloque ou demande une revue KYC, Relay évite l'arrêt de votre activité.
- **Slash** (adossé à Column N.A. (établissement à charte fédérale, FDIC)). Banque pensée pour les opérateurs en ligne: émission instantanée de cartes virtuelles par fournisseur, contrôles de dépenses granulaires, cashback sur la publicité numérique. Le complément naturel quand vous gérez Meta Ads, Google Ads ou des abonnements SaaS.
- **Wise Business** (EMI multi-devises, ce n'est pas une banque). Pour encaisser et payer en EUR, GBP, USD et autres devises avec coordonnées bancaires locales et conversion au taux interbancaire. Ne remplace pas un vrai compte américain, mais imbattable pour la trésorerie internationale.
- **Wallester / Revolut Business.** Wallester apporte des cartes corporate avec BIN propre pour gros volume. Revolut Business fonctionne en complément européen, pas comme compte principal de la LLC.
La recommandation réaliste: **Mercury + Relay en secours + Slash pour les opérations publicitaires + Wise pour la trésorerie FX**. C'est la configuration qui minimise le risque de blocage et réduit le coût réel. Chez Exentax, nous ouvrons et configurons cette configuration dans le cadre de la constitution.

<!-- exentax:banking-facts-v1 -->
## Faits bancaires et fiscaux à préciser

L'information sur les fintechs et le CRS évolue; voici l'état actuel:

<!-- exentax:lote16-native-v1:tiempos-pagos-ach-wire-transfer-fr -->
## Pourquoi la prévisibilité compte plus que la vitesse pour les ACH et les wires

La planification des paiements via ACH et wire ne devient pas plus simple en cherchant la vitesse maximale ; elle devient plus simple en cherchant la prévisibilité. La différence est concrète : un wire transmis le mardi matin selon une routine établie ne provoque aucune question, alors qu'un wire transmis vendredi soir hors de toute routine ouvre des conversations avec la conformité bancaire qui consomment du temps sans rien apporter à l'opération elle-même. La même logique vaut pour les ACH : un calendrier régulier, avec des montants alignés sur les flux opérationnels, fonctionne mieux qu'un envoi opportuniste.

Une habitude qui réduit la friction consiste à fixer deux fenêtres hebdomadaires pour les paiements sortants et à les annoncer en interne. Les contreparties s'y adaptent rapidement, les comptables alignent leurs rapprochements et la banque elle-même finit par lire le profil comme prévisible, ce qui réduit le nombre de revues internes.
<!-- /exentax:lote16-native-v1:tiempos-pagos-ach-wire-transfer-fr -->

<!-- exentax:lote28-native-v1:tiempos-pagos-ach-wire-transfer-fr -->
## Comment lire les délais des paiements ACH et wire transfer comme une cartographie stable plutôt que comme une attente incertaine

Les délais des paiements ACH et wire transfer se lisent plus utilement comme une cartographie stable entre le type d'instruction (ACH ou wire), le moment où l'instruction est lancée et le délai opérationnel attendu, plutôt que comme une attente incertaine. Ces délais ne changent pas d'un mois à l'autre.
<!-- /exentax:lote28-native-v1:tiempos-pagos-ach-wire-transfer-fr -->

Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href="/fr#calculadora">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

### Notes par fournisseur

- **Mercury** opère avec plusieurs banques partenaires sous charte fédérale et couverture **FDIC** via sweep network: principalement **Choice Financial Group** et **Evolve Bank & Trust**, et encore **Column N.A.** sur certains comptes hérités. Mercury n'est pas une banque; c'est une plateforme fintech adossée à ces partner banks. Si Mercury ferme un compte, le solde est généralement renvoyé **par chèque papier à l'adresse enregistrée du titulaire**, ce qui peut être un vrai problème opérationnel pour un non-résident; gardez un compte secondaire (Relay, Wise Business, etc.) comme contingence.
- **Wise** propose deux produits distincts: **Wise Personal** et **Wise Business**. Pour une LLC, on doit ouvrir **Wise Business**, pas le compte personnel. Nuance CRS importante: un **Wise Business détenu par une LLC américaine reste hors CRS** car le titulaire est une entité US et les États-Unis ne sont pas dans le CRS; le volet USD passe par Wise US Inc. (périmètre FATCA, pas CRS). En revanche, un **Wise Personal ouvert par une personne physique résidente fiscale en Espagne** ou autre juridiction CRS **déclenche bien une déclaration CRS** via Wise Europe SA (Belgique) sur cette personne. Ouvrir Wise pour votre LLC ne vous fait pas entrer dans le CRS via la LLC; un Wise Personal séparé à votre nom de résident CRS, oui.
- **Wallester** (Estonie) est une entité financière européenne avec licence EMI/banque émettrice de cartes. Ses comptes IBAN européens **entrent dans le Standard Commun de Déclaration (CRS)** et déclenchent un échange automatique vers l'administration fiscale du pays de résidence.
- **Payoneer** opère via des entités européennes (Payoneer Europe Ltd, Irlande) elles aussi **dans le périmètre CRS** pour les clients résidant dans une juridiction participante.
- **Revolut Business** : lorsqu'il est associé à une **LLC américaine**, il passe par **Revolut Technologies Inc.** avec **Lead Bank** comme partenaire bancaire US. Le compte fourni est un compte américain (routing + account number) ; **aucun IBAN européen n'est émis** à une LLC. Les IBAN européens (lituaniens, BE) appartiennent à **Revolut Bank UAB** et sont émis aux clients européens du groupe. Si on vous propose un IBAN européen rattaché à votre LLC, vérifiez à quelle entité juridique il est rattaché et sous quel régime elle déclare.
- **Fiscalité zéro**: aucune structure LLC ne donne « zéro impôt » si vous vivez dans un pays avec règles CFC, transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **éviter la double imposition** et **déclarer correctement en résidence**, pas l'éliminer.
## Nous l'installons sans que vous perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous nous occupons de l'ensemble du processus: constitution, banque, passerelles de paiement, comptabilité, déclarations <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.<!-- exentax:execution-v2 -->
## Délais de paiement ACH et wire transfer aux US: combien dure chaque méthode et quand utiliser laquelle

Venant de SEPA, le système de paiement US semble d'un autre siècle. À comprendre car ça affecte quand vous encaissez, combien en frais, et quelle méthode proposer aux corporates.

- **ACH (Automated Clearing House).** Le SEPA américain. Coût quasi nul (0$-1$), règlement en 1-3 jours ouvrés. Standard pour B2B domestique récurrent.
- **Wire transfer domestique.** Comme un virement urgent: 5$-30$, arrive en heures (même jour avant cutoff ~14h ET).
- **Wire transfer international (SWIFT).** 15$-50$ + commissions intermédiaires + spread FX (~1%-3%). Arrive 1-5 jours ouvrés.
- **Stripe payouts.** ACH 2 jours ouvrés (standard) ou instantané avec 1% supplémentaire.

### Stratégie opérationnelle typique

Revenue: clients US via ACH/Stripe → Mercury/Wise USD. Clients internationaux via Wise. Outflow: fournisseurs US via ACH gratuit, internationaux via Wise, draw personnel via Wise USD → IBAN EUR.

### Ce qu'on nous demande le plus

**Pourquoi Stripe met 7 jours?** Rolling reserve: hold préventif contre chargebacks. Comptes neufs 7-14 jours, puis 2 jours.

**Wise USD est-il vraiment un « compte US »?** Compte Wise Inc. avec routing ACH propre. Opère comme compte US pour ACH et wires domestiques.

Chez Exentax nous montons la configuration bancaire par cas d'usage.
<!-- /exentax:execution-v2 -->

## Comment nous travaillons chez Exentax

Notre équipe est spécialisée dans les structures fiscales internationales pour les résidents de pays hispanophones qui exploitent des activités en ligne. Nous combinons une connaissance locale de l'Espagne, de l'Andorre et de l'Amérique latine avec une expérience opérationnelle de constitution d'entités au Delaware, dans le Wyoming, en Estonie et dans d'autres juridictions. Chaque dossier commence par une consultation gratuite au cours de laquelle nous évaluons la résidence, l'activité et les objectifs, et nous vous disons honnêtement si la structure proposée a du sens ou si une alternative plus simple suffit.


<!-- exentax:lote9-native-v1:tiempos-pagos-ach-wire-transfer -->
## Une note pratique sur les temps de paiement

Les délais ACH et wire ne sont pas des chiffres figés sur le
papier: ils dépendent de l'heure de l'envoi, du jour de la
semaine et du couloir banque-à-banque concerné. Le membre qui
intègre ces variables à son cycle de facturation évite la
plupart des frictions de trésorerie qui touchent les LLC en
phase de croissance.

<!-- /exentax:lote9-native-v1:tiempos-pagos-ach-wire-transfer -->

<!-- exentax:cross-refs-v1 -->
## Sur le même sujet

- [IBAN, SWIFT et routing numbers : comprendre les codes bancaires](/fr/blog/iban-swift-et-routing-numbers-comprendre-les-codes-bancaires)
- [Comment ouvrir un compte Mercury pour votre LLC depuis l'étranger](/fr/blog/comment-ouvrir-un-compte-mercury-pour-votre-llc-depuis)
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
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Depuis%20la%20France%2C%20on%20est%20habitu%C3%A9s%20aux%20virements%20SEPA%20en%201%20jour%20ouvr%C3%A9%20et%20aux%20i%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->`;
