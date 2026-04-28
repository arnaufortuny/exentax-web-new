export default `Deux formulaires de l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> génèrent plus de confusion que tous les autres chez les propriétaires de LLC: le **Form 1120** et le **Form 5472**. La plupart les entend nommés ensemble, ne saisit pas vraiment ce qu'est chacun et, surtout, **ne sait pas quand ils s'appliquent réellement à son cas**.

Cet article n'est pas un énième guide pas-à-pas. Pour la procédure de dépôt, vous avez déjà notre <a href="/fr/blog/form-5472-quest-ce-que-cest-qui-doit-le-deposer-et-comment">guide opérationnel du Form 5472</a>. Ici, nous expliquons ce que sont **vraiment** ces deux formulaires, comment ils s'articulent, quand ils s'appliquent selon le profil, et quelles erreurs coûtent de l'argent.

## Ce qu'est réellement le Form 1120

Le **Form 1120, U.S. Corporation Income Tax Return** est la déclaration fédérale d'impôt sur les sociétés des corporations américaines. En usage "normal", il est déposé par une **C-Corporation** pour liquider son impôt sur les bénéfices (21 % fédéral actuellement, plus impôts d'État).

Première nuance que presque personne n'explique: le Form 1120 est aussi utilisé **vide, comme enveloppe**, pour permettre à certaines LLC de remplir des obligations d'information. C'est le **1120 pro-forma**, que nous voyons plus bas.

Carte rapide:
- **C-Corporation opérationnelle** → Form 1120 avec chiffres réels.
- **Single-Member LLC de non-résident** → **Form 1120 pro-forma** (la plupart des cases vides) avec Form 5472 annexé.
- **Single-Member LLC de résident américain** → en général, pas de 1120; revenus reportés en Schedule C du 1040 personnel.
- **Multi-Member LLC** → pas de 1120 par défaut; dépose Form 1065 (partnership), sauf option pour l'imposition corporate.
## Ce qu'est réellement le Form 5472

Le **Form 5472, Information Return of a 25% Foreign-Owned U.S. Corporation or a Foreign Corporation Engaged in a U.S. Trade or Business** est une **déclaration d'information, pas de recouvrement**. Il ne paie aucun impôt. Sa mission est d'informer l'IRS des **transactions entre l'entité américaine et les parties liées étrangères**.

Pour la plupart de nos clients chez Exentax, cette "entité américaine" est une **Single-Member LLC** détenue par un non-résident, et la "partie liée étrangère" est **le propriétaire lui-même**. Les "transactions" sont tout mouvement d'argent entre vous et la LLC: apports initiaux, virements de la LLC vers votre compte personnel, paiements ponctuels, prêts.

Pourquoi est-ce important? Parce que depuis 2017 les **disregarded entities détenues par des étrangers** sont traitées comme des corporations pour les besoins du 5472. Cela veut dire que même si votre LLC ne paie pas d'impôt fédéral, **elle est obligée de reporter qui la possède et comment l'argent a circulé entre vous deux**. Sans dépôt, la sanction de base est de **25 000 USD par formulaire et par an**.
### Le piège du "1120 pro-forma"

C'est là où l'on se perd. Votre Single-Member LLC de non-résident:

1. **Ne paie pas d'impôt fédéral sur les sociétés** sur les revenus sans connexion effective avec les US.
2. Mais **doit déposer un Form 1120 par an, vide**, pour qu'il serve d'enveloppe au Form 5472.

C'est le **Form 1120 pro-forma**. Seuls les champs d'identification en haut sont remplis ("Foreign-owned U.S. DE"), on inscrit à la main "Form 1120, Foreign-owned U.S. DE" en tête, et on annexe le Form 5472. Le reste du 1120 reste vide (pas de Schedule M, pas de bilan, pas de calcul d'impôt).

Si votre prestataire vous a dit "vous n'avez rien à déposer parce que vous ne payez pas d'impôt", **il confond "ne pas payer" et "ne pas informer"**. Ce sont deux choses différentes.
### Quand s'appliquent-ils exactement? Tableau par profil

| Profil | Form 1120? | Form 5472? | Commentaire |
|---|---|---|---|
| Single-Member LLC, non-résident, sans mouvements | Oui, pro-forma | Non | Très rare: ouvrir la banque génère déjà du mouvement |
| Single-Member LLC, non-résident, avec mouvements | **Oui, pro-forma** | **Oui** | Cas typique Exentax |
| Single-Member LLC, résident US | Non | Non | Schedule C du 1040 |
| Multi-Member LLC, tous non-résidents | Non (Form 1065) | Oui, annexé au 1065 | Partnership par défaut |
| LLC avec option C-Corp (Form 8832) | **Oui, réel** | Oui si partie liée étrangère | Imposée à 21 % fédéral |
| C-Corp américaine de non-résident | Oui, réel | Oui si partie liée étrangère | Structure différente |

Presque tous les clients Exentax avec LLC tombent dans la ligne 2: **1120 pro-forma + 5472 annuels**.
### "Reportable transactions": ce qui compte et ce qui ne compte pas

Le Form 5472 demande de reporter les **reportable transactions** entre la LLC et la partie liée étrangère:

- Apports de capital initiaux ou ultérieurs → reportés.
- Distributions ou "draws" de la LLC vers votre compte personnel → reportés.
- Paiements de la LLC à des entités/personnes liées à l'étranger → reportés.
- Prêts entre vous et la LLC → reportés.
- Paiements pour services rendus par vous (si vous facturez en personne physique depuis un autre pays vers la LLC) → reportés.

Ne sont pas reportés les paiements à des fournisseurs **non liés** (un freelance externe, un SaaS, une banque). Le critère est le **lien**, pas la nationalité.

Dans la plupart des démarrages, un seul apport initial (le virement de fondation de la LLC) déclenche déjà l'obligation. À partir de là, vous êtes dans le régime.
### Délais, prorogations et où l'envoyer

- **Échéance standard:** 15 avril de chaque année, pour l'exercice clôturé au 31 décembre précédent.
- **Prorogation:** six mois avec Form 7004, repoussant l'échéance au 15 octobre.
- **Mode de dépôt:** une LLC de non-résident sans obligation d'e-file l'envoie habituellement par **courrier certifié à l'IRS Service Center d'Ogden, Utah** ou par **fax** au numéro spécifique publié par l'IRS pour les foreign-owned DEs. Toujours confirmer adresse/fax en vigueur l'année concernée.
- **EIN obligatoire:** sans EIN, pas de dépôt possible. À obtenir au préalable (Form SS-4).

Les retards coûtent cher. La sanction de 25 000 USD pour 5472 non déposé **s'applique aussi pour information incomplète ou inexacte**, pas seulement pour absence de dépôt.
### Erreurs typiques en préparant 1120 + 5472

1. **Remplir le 1120 pro-forma comme un 1120 réel.** Vous mettez chiffres, bilans, dépenses. L'IRS le traite comme une C-Corp et le chaos s'installe.
2. **Oublier que le 5472 est annexé au 1120**, pas envoyé seul. Envoyé séparément, il n'est pas considéré déposé.
3. **Pas d'Operating Agreement clair** et reporting de transactions sans pièces justificatives. Quand l'IRS demande, rien à montrer.
4. **Mélanger compte personnel et LLC** puis tenter de reconstruire les "reportable transactions" en fin d'année. Cher et mal fait.
5. **Se fier à "rien reçu de l'IRS, tout va bien".** L'IRS ne prévient pas avant de sanctionner.
6. **Déposer le 5472 sans TIN/EIN du propriétaire étranger.** Même non-résident, le formulaire exige identification.
### Qui n'est PAS obligé (les rares cas)

- Votre LLC a plusieurs membres, classée **partnership**, sans parties liées étrangères avec reportable transactions (rare si vous êtes étranger).
- Vous êtes résident fiscal US et votre Single-Member LLC déclare directement en Schedule C du 1040. Pas de "foreign-owned DE".
- Votre LLC a opté pour **C-Corp** et dépose un 1120 réel, sans transactions avec parties liées étrangères (rare si votre activité passe par la LLC).

Hors de ces cas, présumer l'exemption est un pari qui ne paie pas: le coût d'une bonne préparation est **bien inférieur** à la sanction minimale.
### Comment cela s'inscrit dans votre quotidien

Si vous tenez correctement l'opérationnel de la LLC pendant l'année (compte séparé, registre des apports et retraits, Operating Agreement signé, comptabilité minimale), préparer le 1120 pro-forma + 5472 en fin d'année est tranquille. Si vous arrivez au 31 décembre avec compte LLC mélangé au personnel, sans documentation et sans savoir quels mouvements sont reportables, le coût et le risque explosent.

Chez Exentax nous traitons ces formulaires comme un **sous-produit naturel** d'une bonne gestion annuelle, pas comme un drame de mars. La différence entre les deux: suivre le <a href="/fr/blog/maintenance-annuelle-llc-obligations-que-vous-ne-pouvez-pas">calendrier annuel des obligations</a> et maintenir une séparation effective entre votre patrimoine et celui de la LLC.
### Ce que vous devez retenir

- **Form 1120** = déclaration d'impôt sur les sociétés. Dans votre LLC de non-résident, utilisé **vide, comme enveloppe** du Form 5472.
- **Form 5472** = déclaration informative des transactions entre la LLC et vous (ou toute partie liée étrangère).
- **S'appliquent presque toujours** si vous êtes non-résident avec Single-Member LLC et avez bougé de l'argent entre vous et la LLC.
- **Aucun impôt n'est payé** avec ces formulaires, mais **ne pas les déposer coûte 25 000 USD par an**.
- L'erreur la plus chère est de mal les remplir ou d'arriver à la clôture sans la documentation qui appuie ce qui est reporté.

Pour vérifier que votre cas est bien posé, sur les exercices passés ou pour régulariser des dépôts en retard, **nous le revoyons avec vous** lors d'une consultation gratuite de 30 minutes. Mieux vaut bien comprendre une fois que payer des sanctions évitables chaque année.
## Références légales et réglementaires

Cet article s'appuie sur la réglementation en vigueur à la date de actuellement. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto).
- **Convention Espagne–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
- **UE / <a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>.** Directive (UE) 2011/16, modifiée par DAC6 (dispositifs transfrontaliers), DAC7 (Directive (UE) 2021/514, plateformes numériques) et DAC8 (Directive (UE) 2023/2226, crypto-actifs); Directive (UE) 2016/1164 (ATAD: CFC, *exit tax*, dispositifs hybrides); Norme commune de déclaration de l'OCDE (CRS).
- **Cadre international.** Modèle de Convention OCDE, art. 5 (établissement permanent) et Commentaires; Action 5 BEPS (substance économique); Recommandation 24 du GAFI (bénéficiaire effectif).
L'application concrète de ces règles à votre cas dépend de votre résidence fiscale, de l'activité de la LLC et de la documentation conservée. Ce contenu est informatif et ne remplace pas un conseil professionnel personnalisé.

<!-- exentax:legal-facts-v1 -->
## Faits légaux & de procédure

Les obligations FinCEN et IRS ont bougé en recent years; voici la version en vigueur:

Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href="/fr#calculadora">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Parlez à notre équipe</a>
<!-- /exentax:calc-cta-v1 -->

### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## Faits bancaires et fiscaux à préciser

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

## Faits juridiques et de procédure

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

## Votre prochaine étape avec Exentax

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.
## Ce qu'est vraiment le Form 1120

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

<!-- exentax:execution-v2 -->
## Form 1120 et Form 5472: ce qu'ils sont et quand une LLC de non-résident les dépose

La combinaison 1120 + 5472 est l'obligation déclarative centrale de toute single-member LLC détenue par non-résident avec "reportable transactions" avec son associé étranger. Pas d'impôt généré, mais l'omission déclenche une amende de 25 000 USD par année et entité.

- **Form 1120 (pro-forma).** Pas la 1120 corporative classique: une version simplifiée utilisée par la LLC disregarded comme "véhicule" pour accompagner le 5472. Seules les données identifiantes (EIN, adresse, exercice). Pas de calcul d'impôt. Délai: 15 avril (ou 15 octobre avec extension 7004).
- **Form 5472.** Le formulaire informatif réel. Rapporte toute "reportable transaction" entre la LLC et son associé étranger (25%+ ownership): apports de capital, distributions, prêts intercompagnies, paiements pour services rendus ou reçus, ventes de biens. Le montant ne génère pas d'impôt mais permet à l'IRS de tracer les flux transfrontaliers.
- **Quand ça s'applique.** Single-member LLC détenue par un non-résident (personne ou entité étrangère) avec au moins une transaction reportable dans l'exercice. Pas de mouvement = techniquement pas de 5472 - mais il vaut mieux déposer à "0" pour garder un historique propre.
- **Amende pour omission.** 25 000 USD par exercice et entité omise. 25 000 USD supplémentaires si après avis IRS pas corrigé sous 90 jours. L'amende informative la plus chère pour LLC de non-résident et la plus facile à prévenir.

### Ce qu'on nous demande le plus

**Dois-je payer un impôt fédéral avec ça?** Non, sauf si la LLC a des revenus effectivement connectés à un trade or business US (ETBUS). Sans ETBUS et sans US-source income, le résultat fédéral est 0 et le 1120/5472 est purement informatif.

**Puis-je les déposer moi-même?** Techniquement oui, mais une mauvaise catégorisation ou un jour de retard déclenche l'amende. La plupart des clients préfèrent déléguer.

Chez Exentax nous préparons et déposons le 1120 + 5472 de votre LLC dans les délais, gardons le justificatif et maintenons un historique propre pour audits ou due diligence futurs.
<!-- /exentax:execution-v2 -->

## Ce qu'est vraiment le Form 5472

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.


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

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Deux%20formulaires%20de%20l'a%20href%3Dhttps%3A%2F%2Fwww%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous souhaitez voir le processus complet en détail, consultez notre <a href="/fr/services">page des services</a> avec tout ce que nous couvrons.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

  ### Formulaires 1120 + 5472 : enjeux pour résidents fiscaux français

  Pour un résident fiscal français, la **Treas. Reg. §1.6038A-1(c)(1) modifiée par TD 9796 du 12/12/2016** impose le dépôt conjoint de la Form 1120 + 5472 même pour une LLC unipersonnelle "disregarded entity". En parallèle, l'**art. 209 B du CGI** (BOI-INT-DG-50-20) peut requalifier la LLC en entité contrôlée si la fiscalité effective y est inférieure à 50 % de la fiscalité française, déclenchant l'imposition immédiate des bénéfices au niveau du résident français.

<!-- exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->
## Ce que 1120 + Form 5472 déclarent réellement (et ne déclarent pas)

Pour une single-member LLC détenue par une personne non-US et
traitée comme transparente fiscalement aux US, l'IRS exige une
enveloppe pro-forma 1120 utilisée uniquement comme support du Form
5472. Ce duo n'établit pas d'impôt US sur une LLC transparente
détenue par un étranger ; il documente que certaines transactions
déclarables entre la LLC et son propriétaire étranger (ou des
parties liées) ont effectivement eu lieu. L'IRS veut de la
visibilité sur ces flux, pas nécessairement des recettes.

| Élément          | Ce qu'il déclare                                        |
|------------------|---------------------------------------------------------|
| Pro-forma 1120   | Enveloppe d'identification : nom de la LLC, EIN,        |
|                  | adresse, année                                          |
| Form 5472        | Chaque transaction déclarable avec la partie liée       |
|                  | étrangère (apports en capital, distributions, prêts,    |
|                  | services, etc.)                                          |

Si l'année n'a comporté aucune transaction déclarable, le duo se
dépose en général tout de même avec des montants à zéro afin que
l'IRS voie le statut d'activité explicitement. Ne pas déposer est ce
qui déclenche l'exposition aux pénalités bien connues prévues par la
réglementation.

## Trois schémas réels de dépôt que nous suivons

Une single-member LLC avec un apport en capital à la constitution,
un petit retrait mensuel au propriétaire étranger et aucun autre
flux lié. Le 5472 déclare l'apport et les retraits ; le pro-forma
1120 sert d'enveloppe. La période de dépôt prend quelques heures de
travail structuré, réconciliation comptable comprise.

Une single-member LLC qui a prêté de l'argent à une société liée
étrangère, plus tard remboursé, avec un taux d'intérêt normal. Le
5472 déclare l'octroi du prêt et le remboursement ; l'accumulation
des intérêts fait partie des livres de la LLC et se reflète dans la
déclaration du propriétaire dans son pays. La documentation est
votre amie ici : le contrat de prêt et le tableau d'amortissement
sont dans le dossier conformité de la LLC.

Une LLC pluriannuelle sans activité l'année en cours. Nous déposons
quand même le pro-forma 1120 + 5472 à zéro, joignons un court mémo
interne expliquant l'année dormante, et tenons le dossier prêt pour
le moment où la LLC se réactivera.

## Erreurs qui mènent à des lettres de pénalité

- Traiter le duo comme une déclaration fiscale qui "ne doit rien" et
  la sauter. C'est un dépôt déclaratif ; l'absence d'impôt n'efface
  pas l'obligation.
- Mélanger les dépenses personnelles du propriétaire dans les
  livres de la LLC, puis tenter de réconcilier au moment du dépôt.
  Garder la frontière propre mensuellement.
- Oublier qu'un retrait au propriétaire étranger est une transaction
  déclarable. Il l'est souvent, selon sa nature (retour de capital,
  distribution, etc.).
- Déposer tard. La pénalité pour un Form 5472 manqué est
  substantielle et s'applique même sans impôt US dû.

## Checklist de pré-dépôt

- L'EIN de la LLC correspond à la lettre IRS (CP575).
- Année d'exercice confirmée (année civile par défaut pour une
  single-member disregarded LLC).
- Comptabilité clôturée et réconciliée avec les banques.
- Flux entre parties liées mappés aux catégories de lignes 5472.
- Document d'identité du propriétaire en dossier conforme à la
  déclaration BOI.
- Canal de dépôt prêt (papier ou e-file via un fournisseur
  autorisé).

Nous traitons 1120 + 5472 comme la poignée de main annuelle de la
LLC avec l'IRS : calme, prévisible, structurée. Un dépôt propre
cette année rend l'année suivante encore plus calme.

<!-- /exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->

<!-- exentax:cross-refs-v1 -->
## Sur le même sujet

- [Que se passe-t-il si vous ne déposez pas le Form 5472 : sanctions IRS et correction](/fr/blog/que-se-passe-t-il-si-vous-ne-deposez-pas-le-form-5472)
- [W-8BEN et W-8BEN-E : un guide complet et posé](/fr/blog/w8-ben-et-w8-ben-e-le-guide-complet)
- [Qu'est-ce que l'IRS et comment affecte-t-il vraiment votre LLC américaine](/fr/blog/quest-ce-que-lirs-et-comment-affecte-t-il-votre-llc)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Nous vérifions BOI, EIN, agent enregistré et obligations fédérales pour qu'aucune amende ne vous surprenne. <a href="/fr/services">Demander une revue de conformité</a>.
<!-- /exentax:cta-v1 -->

`;
