export default `Revolut Business est opéré depuis Lituanie pour l'UE, et à ce titre appliquera automatiquement le CRS: vos soldes et mouvements remontent à la DGFiP chaque année. Beaucoup de clients francophones ouvrent un Revolut Business pour leur LLC sans réaliser que ce choix annule une partie de ce qu'ils croyaient gagner en tenue de dossier côté USA.

## Quelles entités Revolut et où elles déclarent

Revolut opère via plusieurs entités régulées: **Revolut Bank UAB** (Lituanie, banque agréée par la Lietuvos Bankas, entité principale pour l'EEE depuis 2021, déclare CRS au **VMI** lituanien); **Revolut Ltd** (Royaume-Uni, EMI FCA); **Revolut Payments UAB** (EMI lituanienne EEE); **Revolut Technologies Inc.** (entité américaine du groupe sous laquelle **Revolut Business est offert aux clients avec une LLC américaine**, avec **Lead Bank** comme partenaire bancaire US — Lead Bank est une banque US à charte fédérale, donc **hors CRS**, périmètre FATCA); filiales à Singapour, Australie.

Pour un client espagnol, mexicain, colombien ou argentin, le compte est normalement sous Revolut Bank UAB et l'information remonte de Lituanie à votre fisc national.
### Cadre normatif

<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> Common Reporting Standard; UE Directive 2011/16/UE modifiée par DAC2; Lituanie loi nationale CRS; Espagne réceptrice RD 1021/2015, Modelo 720, Modelo 721. Détails dans <a href="/fr/blog/crs-pour-residents-en-espagne-et-latam-implications-reelles">CRS pour résidents Espagne et LATAM</a>.
### Information envoyée

Annuellement: nom, adresse, résidence fiscale, TIN du titulaire; raison sociale, adresse, EIN/NIF, classification CRS (Active NFE, Passive NFE, Investment Entity) de l'entité; **controlling persons** si Passive NFE; IBAN; **solde au 31 décembre**; intérêts/dividendes/produits bruts.
## Le cas de la LLC avec compte Revolut Business

Revolut applique la due diligence CRS sur la LLC et, faute de pouvoir la classer Active NFE avec documentation robuste, la traite comme **Passive NFE**. Conséquence: Revolut **doit identifier les controlling persons** (vous) et **les déclarer à leur pays de résidence**. Ainsi, même si la LLC est américaine et que les US ne participent pas au CRS, vos données et celles de la LLC arrivent à votre fisc national depuis la Lituanie.
### Auto-certification CRS

Lors de l'ouverture vous remplissez un formulaire CRS: résidence fiscale de l'entité, classification, controlling persons. Une LLC de services unipersonnelle peut être Active NFE (>50% revenus opérationnels), mais Revolut tend à appliquer un critère conservateur et à classer Passive NFE par défaut.
### Si vous mal déclarez votre résidence

Revolut applique le procédure de **change in circumstances**: si l'IP, l'adresse de carte, le téléphone et les transferts pointent vers l'Espagne malgré une déclaration de résidence en Andorre, Revolut demande un certificat de résidence ou déclare aux deux juridictions. Fausse auto-certification = infraction et possible délit.
### Comment planifier correctement

1. N'utilisez pas Revolut comme **compte principal** de la LLC si vous voulez minimiser l'empreinte CRS, Mercury reste optimal.
2. Si vous utilisez Revolut, déclarez correctement et préparez l'arrivée de la donnée. Voir <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">conception d'une structure solide</a>.
3. Maintenez la **cohérence documentaire** entre auto-certification CRS, Modelo 720 et IRPF.
4. Connaissez les risques: <a href="/fr/blog/risques-fiscaux-dune-mauvaise-structuration-internationale">risques fiscaux d'une mauvaise structuration</a>.
### Comparatif rapide

| Plateforme | Juridiction | CRS | Déclare à |
| --- | --- | --- | --- |
| Mercury | États-Unis | Non (FATCA seul) | Personne via CRS |
| Revolut Business | Lituanie | Oui | AEAT via VMI |
| Wise Business | Belgique | Oui | AEAT via SPF Finances BE |
| Wallester | Estonie | Oui | AEAT via autorité estonienne |

Voir <a href="/fr/blog/wise-business-et-crs-ce-qui-est-declare-a-votre-fisc">Wise et CRS</a>.
### DAC7 et DAC8 en complément

Si votre LLC vend via plateformes (<a href="/fr/blog/dac7-le-nouveau-reporting-des-plateformes-numeriques-en-2026">DAC7</a>) ou opère en crypto via exchanges UE (<a href="/fr/blog/dac8-et-cryptomonnaies-le-nouveau-reporting-fiscal">DAC8</a>), des canaux supplémentaires alimentent votre fisc.
### En résumé

Revolut Business est excellent; comprendre son profil CRS est essentiel. La clé n'est pas d'éviter Revolut, mais de déclarer correctement et de concevoir un stack cohérent.

Chez Exentax on évalue cas par cas si Revolut Business a sa place dans la structure, pour des clients en France et en Belgique. Réservez votre consultation gratuite: on regarde la carte bancaire totale et on vous dit quoi garder, quoi déplacer.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

Règle pratique: une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.
Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et documentons chaque étape pour que votre déclaration locale soit défendable en cas de contrôle.

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
- **Revolut Business** : lorsqu'il est associé à une **LLC américaine**, il passe par **Revolut Technologies Inc.** avec **Lead Bank** comme partenaire bancaire US. Le compte fourni est un compte américain (routing + account number) ; **aucun IBAN européen n'est émis** à une LLC. Les IBAN européens (lituaniens, BE) appartiennent à **Revolut Bank UAB** et sont émis aux clients européens du groupe. Si on vous propose un IBAN européen rattaché à votre LLC, vérifiez à quelle entité juridique il est rattaché et sous quel régime elle déclare.
- **Fiscalité zéro**: aucune structure LLC ne donne « zéro impôt » si vous vivez dans un pays avec règles CFC, transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **éviter la double imposition** et **déclarer correctement en résidence**, pas l'éliminer.
## Conformité fiscale dans votre pays: SEC, TFI et attribution de revenus

Ce qui suit est la vision opérationnelle, pas celle des manuels. Nous avons exécuté ce schéma assez souvent pour savoir quelles variables cèdent en premier sous l'examen d'une administration fiscale ou d'une compliance bancaire, et c'est dans cet ordre que nous les traitons.

## Références: sources et réglementation bancaire

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

## Votre prochaine étape avec Exentax

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.

## Quelles informations concrètes Revolut envoie

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.<!-- exentax:execution-v2 -->
## Revolut Business et CRS: ce qu'il reporte à votre fisc et comment ça se voit de l'autre côté

Revolut Business est pratique, multi-devise et bon marché - et reporte systématiquement sous le Common Reporting Standard.

- **Régime CRS de Revolut Business.** Revolut Bank UAB est entité financière reportante CRS depuis sa licence bancaire lituanienne. Reporte annuellement à la Banque de Lituanie, qui partage avec les autres juridictions CRS - y compris la résidence fiscale du UBO déclaré.
- **Donnée exacte transmise.** Identification du titulaire, solde au 31 décembre, total des mouvements bruts, identifiant de compte (IBAN LT). Pas les transactions individuelles, les agrégats.
- **Pourquoi votre fisc le croise.** Si solde supérieur au seuil et pas de déclaration de comptes étrangers, le fisc reçoit la donnée via CRS et compare. Différence = dossier automatique.
- **Ce qui change vs banque US traditionnelle.** Revolut UE reporte CRS rapidement (Q1 année suivante). Mercury/Wise USD reportent FATCA à l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> et arrivent aussi mais avec plus de latence.

### Ce qu'on nous demande le plus

**Si j'ouvre Revolut Business comme LLC US, ça reporte à US ou à mon pays?** Reporte à la résidence fiscale du UBO déclarée.

**Puis-je déclarer résidence « US » au KYC?** Déclaration fausse à la banque - délit. Revolut demande documentation à l'appui.

Chez Exentax nous structurons le stack bancaire en tenant compte de ce que CRS/FATCA reportent.
<!-- /exentax:execution-v2 -->

## Quelles entités Revolut existent et où elles déclarent

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.

## Le cas spécifique du résident fiscal français

  Si vous êtes domicilié en France et que vous détenez une LLC américaine avec compte Revolut Business UAB, vous cumulez deux obligations déclaratives à part. La première relève de l'**article 1649 A bis du CGI**: tout résident doit déclarer chaque compte ouvert, détenu ou clos à l'étranger via le **formulaire 3916-bis** annexé à la déclaration de revenus 2042. Une omission est sanctionnée à hauteur de **1 500 € par compte non déclaré** (4 % du solde si supérieur à 50 000 € au 31 décembre, en application du II de l'article 1736 du CGI), portée à **10 000 € par compte** lorsque celui-ci se trouve dans un État ou territoire non coopératif. La seconde obligation découle de l'**article 209 B du CGI** (régime CFC pour les sociétés soumises à l'IS) ou de l'**article 123 bis du CGI** (régime CFC pour les particuliers détenant >10 % d'une entité étrangère bénéficiant d'un régime fiscal privilégié): les bénéfices de la LLC peuvent être réintégrés dans le résultat imposable français même en l'absence de distribution effective, sauf preuve d'une activité économique réelle.

  Concrètement, lorsque Revolut Bank UAB transmet vos données via le **VMI lituanien** à la **DGFiP**, l'administration française recoupe trois flux: votre 3916-bis, votre éventuelle déclaration article 123 bis sur l'imprimé 2074 et les soldes reçus par CRS. Toute incohérence déclenche un contrôle sur pièces avec demande de justification sous trente jours. La preuve de l'activité économique réelle de la LLC (contrats signés, factures, présence en ligne) devient alors décisive pour échapper à la taxation présomptive.

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
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Revolut%20Business%20est%20op%C3%A9r%C3%A9%20depuis%20Lituanie%20pour%20l'UE%2C%20et%20%C3%A0%20ce%20titre%20appliquer%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->
`;
