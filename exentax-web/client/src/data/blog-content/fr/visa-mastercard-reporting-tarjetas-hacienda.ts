export default `Quand on demande "le fisc voit-il ce que je paie avec ma carte?", la réponse courte est: ça dépend de qui a émis la carte, où se trouve le commerçant et où vous êtes résident fiscal. La réponse longue oblige à comprendre comment fonctionne réellement l'écosystème des cartes et quelles déclarations informatives existent vraiment. Beaucoup de mythes circulent autour de Visa et Mastercard, et il vaut la peine de les séparer de ce qui se passe réellement avec votre <a href="/fr/blog/wise-iban-et-llc-ce-qui-est-vraiment-declare-au-fisc">carte Wise associée à une LLC</a>, votre carte de banque française ou votre <a href="/fr/blog/revolut-business-et-crs-ce-qui-est-declare-a-votre-fisc">carte Revolut</a>.

Cet article passe en revue qui fait quoi dans une transaction par carte, ce que chaque acteur déclare aux autorités fiscales et quelles déclarations informatives existent pays par pays (Modelo 196 et 171 en Espagne, DAS2 en France, Modelo 38 au Portugal, entre autres).

## Le modèle à quatre parties: émetteur, réseau, acquéreur, commerçant

Chaque fois que vous passez une carte, quatre acteurs très différents interviennent:

- **Émetteur (issuer)**: l'entité qui vous a délivré la carte et qui détient le compte d'où sort l'argent. Ce peut être une banque traditionnelle (BNP, Crédit Agricole), une EMI (Wise Europe SA, Revolut Bank UAB) ou un émetteur prépayé.
- **Réseau (network ou scheme)**: Visa, Mastercard, American Express, JCB, UnionPay. Ils ne tiennent ni votre compte ni celui du commerçant: ils acheminent le message d'autorisation entre l'émetteur et l'acquéreur et orchestrent le règlement.
- **Acquéreur (acquirer)**: l'entité financière qui a contracté avec le commerçant et lui crédite l'encaissement. En Europe ce sont des noms comme Adyen, Stripe, Worldline, ainsi que les grands acquéreurs bancaires nationaux.
- **Commerçant (merchant)**: l'entreprise qui encaisse. Elle est identifiée par un Merchant Category Code (MCC) et un identifiant unique dans le réseau.

Comprendre cette chaîne est essentiel: aucun acteur ne "voit" tout le film. Chacun ne voit que son propre segment.
### Ce que voit et ce que ne voit pas chaque acteur

| Acteur | Ce qu'il connaît en détail |
| --- | --- |
| Émetteur | Votre identité, votre compte, chaque débit avec montant, devise, date, MCC et nom du commerçant |
| Réseau (Visa/Mastercard) | Messages d'autorisation entre émetteur et acquéreur, données agrégées pour le règlement, la fraude et les litiges |
| Acquéreur | Identité du commerçant, chaque encaissement, montant, devise, marque de carte et BIN de l'émetteur |
| Commerçant | Son encaissement, les 4 derniers chiffres, marque, pays émetteur et, si vous demandez une facture, vos coordonnées |

Ce qu'aucun d'eux ne fait par défaut, c'est envoyer en direct chaque transaction au fisc du pays de chaque client. Ce n'est tout simplement pas leur rôle.
## L'idée la plus répandue (et fausse) sur Visa et Mastercard

L'idée circule que "comme Visa et Mastercard sont américaines et que tout passe par elles, elles déclarent déjà tout aux fiscs du monde entier". C'est faux:

- **Visa Inc.** et **Mastercard Inc.** sont des **réseaux de traitement de paiement**, pas des entités dépositaires. Elles ne tiennent pas de comptes de clients finaux et ne sont donc pas des "institutions financières déclarantes" au sens du CRS ou de FATCA.
- Elles **ne déclarent pas** les achats individuels de chaque porteur à la DGFiP, à l'AEAT espagnole, au SPF Finances belge ni à aucune autre administration fiscale comme un flux automatique.
- Elles coopèrent avec les autorités fiscales et judiciaires dans des enquêtes ponctuelles, via des réquisitions formelles, comme toute société qui détient des données.

Qui est soumis à des obligations d'information, c'est l'**émetteur de la carte** (dans ses déclarations nationales) et, côté commerçant, l'**acquéreur** dans sa propre comptabilité et les déclarations qui lui sont applicables dans son pays.
## Ce que déclare réellement l'émetteur en Espagne

En Espagne, les émetteurs nationaux présentent à l'AEAT plusieurs déclarations informatives pertinentes pour les cartes et les comptes:

- **Modelo 196**: déclaration annuelle des comptes auprès des établissements de crédit. Elle identifie les titulaires et les autorisés, les soldes au 31 décembre et, dans bien des cas, les soldes moyens du quatrième trimestre. Elle couvre le compte derrière la carte, pas chaque mouvement.
- **Modelo 171**: déclaration annuelle des dépôts, retraits et paiements par carte au-dessus de certains seuils (classiquement, opérations supérieures à 3 000 € en espèces et, pour les commerçants, encaissements par carte agrégés).
- **Modelo 170**: déclaration des opérations réalisées par des professionnels adhérents à un système d'encaissement par carte. Ici, les **acquéreurs** déclarent les encaissements crédités aux commerçants, pas les paiements que vous faites comme consommateur.
- **Modelo 199**: identification des comptes ayant une portée fiscale.

Quiconque utilise une carte comme consommateur en Espagne et a son compte dans une banque espagnole se trouve, en pratique, dans le périmètre que l'AEAT peut consulter périodiquement. Et surtout, son solde et sa titularité figurent dans le Modelo 196 année après année.
## L'équivalent dans d'autres pays européens

Le schéma change dans chaque juridiction. Quelques exemples représentatifs:

- **France – DAS2**: déclaration annuelle des honoraires, commissions et autres revenus versés à des tiers. Pour les cartes, le travail de fond est fait par la **DGFiP** en combinant cette déclaration avec les données fournies par chaque banque. La France oblige en outre à déclarer les **comptes à l'étranger** (formulaire 3916) et les actifs numériques associés, ce qui inclut typiquement les IBAN Wise ou Revolut.
- **Portugal – Modelo 38**: déclaration annuelle des virements et envois de fonds à l'étranger. Le **Modelo 40** complète avec les opérations sur valeurs mobilières. Avec l'obligation de déclarer les comptes étrangers dans l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>, cela dessine un périmètre de contrôle similaire à l'espagnol.
- **Allemagne**: pas d'équivalent strict du Modelo 196, mais les banques allemandes opèrent le Kontenabrufverfahren, qui permet au Bundeszentralamt für Steuern de consulter la titularité des comptes et dépôts de tout résident sur demande d'une autorité compétente.
- **Italie**: l'Anagrafe dei Rapporti Finanziari (Archivio dei Rapporti) collecte chaque année soldes, mouvements agrégés et données de cartes que les intermédiaires financiers italiens envoient à l'Agenzia delle Entrate. L'un des schémas les plus denses d'Europe.
- **Royaume-Uni**: HMRC reçoit des données agrégées des banques via des schémas comme le Bulk Data Gathering, en plus du CRS pour les non-résidents.

La règle générale est que **le compte et la titularité sont bien couverts**, tandis que le **détail transaction par transaction** n'est pas envoyé d'office: il n'est reconstruit qu'à l'occasion d'un contrôle ciblé.
## Le cas de l'émetteur étranger: Wise, Revolut et autres

Quand votre carte est émise par une EMI européenne autre qu'une banque française (typiquement Wise Europe SA en Belgique ou Revolut Bank UAB en Lituanie), la situation change:

- Ces émetteurs **ne présentent pas les déclarations nationales françaises ou espagnoles** (196, 171, 170, 199, ni la déclaration sociale équivalente). Ce sont des obligations des entités financières domestiques.
- Ils sont soumis au **CRS** depuis leur juridiction d'origine. Wise Europe SA déclare au fisc belge et Revolut Bank UAB au fisc lituanien, qui transmettent au pays de résidence du titulaire le solde au 31 décembre et les revenus, comme nous l'expliquons dans <a href="/fr/blog/crs-et-vos-comptes-bancaires-llc-ce-qui-est-partage-avec">CRS pour les comptes bancaires d'une LLC</a>.
- Le **détail de chaque achat avec la carte ne circule pas via CRS**. Ce qui circule, c'est le solde de clôture, l'identité du titulaire et, si le compte appartient à une entité classée Passive NFE, les controlling persons.

Cela explique une observation fréquente: un paiement par carte d'une banque française apparaît, agrégé avec le reste, dans les données que la DGFiP peut consulter; le même paiement avec une carte Wise ou Revolut n'est pas déclaré directement à la DGFiP, mais le solde du compte sera bien remonté via CRS depuis la Belgique ou la Lituanie.

La conclusion raisonnable n'est pas "la carte étrangère me rend invisible" mais que **la trace existe dans une autre couche**: le compte est identifié, les soldes sont déclarés et, en cas de contrôle, les mouvements peuvent être demandés.
### Et l'acquéreur côté commerçant: l'autre bout du fil

On oublie souvent l'acquéreur. Quand un commerçant espagnol encaisse par carte, son acquéreur en Espagne dépose un **Modelo 170** avec l'agrégat annuel de ses encaissements. Si ce commerçant est une personne physique qui sous-déclare ses revenus, l'AEAT croise ce Modelo 170 avec sa déclaration et l'incohérence apparaît. Cela n'affecte pas le consommateur, mais cela explique pourquoi l'administration détecte si vite les commerçants qui sous-déclarent leurs encaissements par carte.

Pour un entrepreneur avec une LLC qui encaisse via Stripe US ou un Merchant of Record comme DoDo Payments, le flux est différent: l'acquéreur est hors d'Europe, aucun Modelo 170 n'est déposé, et les revenus arrivent sur Mercury ou Wise. La traçabilité passe alors par le solde et les revenus via CRS, pas par l'acquéreur.
## Ce que le fisc peut réellement voir de vos paiements par carte

Pour un résident fiscal qui combine banque locale, fintech étrangère et, éventuellement, une <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a>:

Ce que le fisc peut consulter de manière récurrente:

- Comptes bancaires nationaux dont vous êtes titulaire ou autorisé.
- Encaissements par carte agrégés d'un commerçant national (équivalent du Modelo 170).
- Soldes au 31 décembre et revenus des comptes étrangers reçus via CRS depuis le pays de l'émetteur.
- Comptes étrangers que vous déclarez vous-même (formulaire 3916 en France, Modelo 720 en Espagne) au-dessus du seuil.

Ce qu'il ne reçoit pas automatiquement:

- Le détail de chaque achat fait avec n'importe quelle carte.
- La liste des commerçants où vous achetez en tant que consommateur.
- Les montants individuels en dessous des seuils nationaux.

Ce qu'il peut demander en cas de contrôle:

- Le relevé complet du compte directement à l'émetteur en France et, à l'étranger, via échange ponctuel.
- Des informations ciblées au réseau de cartes ou au commerçant dans des enquêtes avancées.
## Erreurs fréquentes que nous voyons chaque semaine

1. **"Visa et Mastercard envoient tout en direct au fisc."** Faux. Ce sont des réseaux de traitement, pas des entités déclarantes ou émettrices finales.
2. **"Si je paie avec une carte étrangère, mes achats sont invisibles."** Le détail n'est pas déclaré automatiquement, mais le compte est visible via CRS et la trace est parfaitement reconstituable.
3. **"Le Modelo 171 fait que le fisc voit chacun de mes achats."** Non: il couvre les opérations au-dessus de seuils et les agrégats d'encaissements, pas chaque achat personnel sous ces seuils.
4. **"Si ma LLC encaisse via Stripe, c'est déjà déclaré en Europe."** Pas directement: Stripe US ne dépose pas de Modelo 170, et l'information sur votre LLC arrive au fisc par d'autres voies (Mercury via FATCA est asymétrique, Wise via CRS, votre propre déclaration de comptes à l'étranger si applicable).
5. **"Mieux vaut payer avec la carte de la banque étrangère pour ne laisser aucune trace."** La trace existe et, surtout, opérer pour ne laisser aucune trace est exactement le motif qui déclenche le plus vite des alertes en contrôle.
6. **"L'acquéreur du commerçant européen où j'achète déclare ma consommation."** Non: l'acquéreur déclare les encaissements de son client commerçant, pas les données du consommateur.
## Pourquoi cela compte pour votre structure

Si vous combinez une LLC américaine, un compte Mercury, un Wise Business avec carte, une Revolut Business et une carte de votre banque française pour le quotidien, vous n'avez pas un problème de "dissimulation": vous avez une carte de traces distinctes, chacune avec sa propre visibilité fiscale. La bonne question n'est pas "quelle carte utiliser pour que le fisc ne voie rien?" mais "comment ces pièces s'imbriquent-elles avec ma résidence fiscale, mes déclarations et la doctrine administrative qui s'applique à ma LLC?". Nous le développons dans <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">Concevoir une structure fiscale internationale solide</a> et, pour le croisement précis avec la <a href="/fr/blog/wise-iban-et-llc-ce-qui-est-vraiment-declare-au-fisc">carte Wise sur LLC</a>, dans son article dédié.

Si vous opérez déjà avec des cartes dans plusieurs juridictions et n'êtes pas sûr de ce qui est déclaré où, nous revoyons cela avec vous et vous disons quoi corriger avant que ce soit le fisc qui donne le tempo.
### En résumé

Les réseaux Visa et Mastercard ne sont pas ceux qui signalent vos achats au fisc: leur rôle est de traiter les paiements. Ce qui parvient aux administrations fiscales, c'est l'information de l'**émetteur** (via des déclarations nationales type Modelo 196 ou 171, DAS2, Modelo 38) et de l'**acquéreur** (encaissements agrégés du commerçant). Quand l'émetteur est hors de votre pays, les déclarations nationales ne s'appliquent pas, mais le solde et la titularité circulent bien via CRS depuis la juridiction de l'émetteur.

Vos paiements par carte ne sont pas retransmis en direct au fisc, mais ils laissent une trace parfaitement visible quand quelqu'un décide de regarder. La différence entre avoir des problèmes ou pas ne tient pas à la carte choisie, mais à la cohérence entre votre structure, votre résidence fiscale et vos déclarations.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Règle pratique: une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.
Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et documentons chaque étape pour que votre déclaration locale soit défendable en cas de contrôle.

<!-- exentax:legal-refs-v1 -->
## Références légales et réglementaires

Cet article s'appuie sur la réglementation en vigueur à la date de actuellement. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto).
- **Convention Espagne–USA.** BOE du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
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

<!-- exentax:legal-facts-v1 --><!-- exentax:execution-v2 -->
## Visa, Mastercard et reporting au fisc: ce qu'on sait de l'usage de votre carte d'entreprise

Le fisc ne reçoit pas la liste détaillée de vos transactions de carte business US - mais reçoit des agrégats croisés avec déclarations.

- **Ce que le fisc NE reçoit PAS directement.** Liste de transactions individuelles, catégories Visa/Mastercard, lieux POS. Les réseaux de cartes ne sont pas interface de reporting fiscal.
- **Ce qu'il REÇOIT via CRS et FATCA.** Solde fin d'année + total mouvements bruts + UBO. Si solde moyen ou flux total élevé sans cohérence avec déclaration, croisement.
- **Ce qui laisse trace via commerçants.** Payer en France avec carte Mercury US: commerçant déclare sa vente normalement.
- **Ce que votre banque résidente voit.** Recharger la carte depuis votre compte français est visible.

### Le croisement typique

Via CRS: Mercury a 80k€ solde moyen et 300k€ mouvements bruts annuels. En IR vous déclarez 25k€. Incohérence évidente.

### Ce qu'on nous demande le plus

**Si je paie tout perso avec la carte LLC, j'évite la visibilité?** Non. Mélanger casse la séparation patrimoniale.

**Y a-t-il une carte US « non reportable »?** Non.

Chez Exentax nous structurons l'usage avec comptabilité et déclaration correcte.
<!-- /exentax:execution-v2 -->

## Faits légaux & de procédure

Les obligations FinCEN et IRS ont bougé en recent years; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act.** Après la **interim final rule de FinCEN de mars 2025**, l'obligation de déposer le BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées hors des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US par un non-résident est, à ce jour, hors de cette obligation**. Le statut peut encore évoluer: **re-vérifier sur FinCEN.gov au moment du dépôt**. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé et surveillez les mises à jour.
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
### Rappel pratique

Chaque situation fiscale dépend de votre résidence, de l'activité exercée et des contrats en vigueur. Les informations présentées ici sont générales et ne remplacent pas un conseil personnalisé; analysez votre cas particulier avant toute décision structurelle.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Quand%20on%20demande%20le%20fisc%20voit-il%20ce%20que%20je%20paie%20avec%20ma%20carte%3F%2C%20la%20r%C3%A9ponse%20co%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Révision éditoriale en attente</strong> — Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">3.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…terminados umbrales (clásicamente, operaciones superiores a 3.000 € en efectivo y, para co…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
