export default `

Quand on parle d'« entreprise américaine », la plupart des gens pensent à une LLC ; d'autres, à une « corporation ». La réalité est qu'aux États-Unis il existe quatre véhicules principaux pour faire des affaires : **LLC**, **Corporation**, **S-Corporation** et **C-Corporation**. Chacun a son propre régime fiscal fédéral et étatique, ses restrictions de propriété et ses cas d'usage. Pour un entrepreneur français résident fiscal en France (ou dans un autre pays francophone : Belgique, Suisse, Luxembourg, Québec, Maroc, Tunisie), tous ne sont ni accessibles ni opportuns. Ce guide pose la véritable différence entre les quatre figures, ce qui correspond à chaque profil et pourquoi la LLC reste, aujourd'hui, le choix par défaut pour les freelances, agences et projets numériques qui ne cherchent pas d'investisseurs institutionnels.

## LLC : l'option flexible et par défaut pour les non-résidents

La **LLC (Limited Liability Company)** est une figure hybride créée par les lois étatiques des États-Unis (chaque État a son propre LLC Act ; le **Wyoming a été le premier, en 1977**, avec le Wyoming LLC Act). Juridiquement, c'est une entité à responsabilité limitée qui protège le patrimoine personnel de ses membres face aux dettes et obligations de l'entreprise. Fiscalement, **par défaut elle est transparente** : la **Treas. Reg. §301.7701-3 (« check-the-box »)** traite la single-member LLC comme **« disregarded entity »** et la multi-member LLC comme **partnership** sauf option contraire via le **Form 8832** (election to be classified as an association taxable as a corporation).

Pour un non-résident sans **ETBUS** (Effectively Connected Trade or Business in the United States) et sans **US-source FDAP income**, la LLC disregarded **ne génère pas d'obligation de Form 1040-NR substantif** ni ne paie d'impôt fédéral sur le revenu : la règle de base du **IRC §§871 et 882** ne soumet les non-résidents qu'à (a) US-source FDAP avec retenue à la source de 30 % (ou taux conventionnel) et (b) revenus effectivement connectés à un trade or business aux États-Unis. Sans ces deux éléments, la LLC paie **0 % fédéral**. Au niveau étatique, **Wyoming, Nouveau-Mexique, Floride, Texas et Dakota du Sud** n'ont pas d'impôt sur le revenu corporatif étatique, ce qui ajoute **0 % étatique** quand il n'y a pas de nexus.

L'obligation pratique qui demeure : annuelle **Form 5472 + Form 1120 pro-forma** (Treas. Reg. §1.6038A-1, en vigueur depuis 2017) pour SMLLC propriété d'un non-résident avec toute *reportable transaction* avec son unique membre. Sanction de base : **25 000 USD par formulaire et par an** (IRC §6038A(d)) plus **25 000 USD par chaque 30 jours additionnels** après notification de l'IRS.

## Corporation : par défaut C-Corporation

Quand quelqu'un constitue une « Inc. » ou « Corp. » sous la *General Corporation Law* d'un État (par exemple, **Delaware General Corporation Law** ou **Nevada Revised Statutes Chapter 78**), elle est traitée fiscalement par défaut comme **C-Corporation** : elle paie l'impôt fédéral sur ses bénéfices au **21 % (IRC §11(b), taux unique introduit par la Tax Cuts and Jobs Act de 2017)**, plus l'impôt étatique correspondant (Delaware impose 8,7 % sur le revenu généré dans l'État, Californie 8,84 %, Texas 0 % d'income tax mais franchise tax). Quand elle distribue des dividendes, les actionnaires sont imposés **une seconde fois** sur leur revenu personnel : pour US persons, dividendes qualifiés à 0 % / 15 % / 20 % fédéral (IRC §1(h)(11)) ; pour actionnaires étrangers, retenue FDAP de **30 %** sauf convention applicable (la **convention France-États-Unis du 31/08/1994 modifiée par avenants 2004 et 2009** réduit la retenue sur dividendes à **15 % ou 5 %** selon participation, et à **0 %** entre sociétés mères et filiales sous certaines conditions). C'est la double imposition classique.

La C-Corp est la **forme de facto obligatoire** pour qui veut lever du capital de venture capital ou faire une introduction en bourse : les investisseurs institutionnels (fonds VC, family offices, plateformes comme AngelList, Y Combinator) exigent presque toujours une **Delaware C-Corp** parce qu'ils connaissent sa jurisprudence (Court of Chancery), elle peut émettre plusieurs classes d'actions (préférentielles avec liquidation preferences, Series A/B/C), elle permet des stock options pour employés (plans 409A) et permet des introductions en bourse. Pas de limite au nombre d'actionnaires ni de restrictions de nationalité.

## S-Corporation : l'option qu'un non-résident ne peut pas utiliser

La **S-Corporation** n'est pas une forme juridique distincte : c'est une **option fiscale fédérale** définie au **subchapter S de l'Internal Revenue Code (IRC §§1361-1378)** qu'une corporation ou LLC peut demander via **Form 2553**. Une fois la S-election accordée, l'entité **ne paie pas d'impôt fédéral corporatif** ; les bénéfices passent aux actionnaires et sont déclarés dans leurs déclarations personnelles (Schedule K-1). Contrairement à la LLC, les actionnaires peuvent percevoir un **salaire raisonnable** (W-2) et recevoir le reste comme **distributions non soumises au self-employment tax** (15,3 %), ce qui réduit la charge FICA pour résidents US. C'est la raison principale pour laquelle les Américains choisissent S-Corp.

Le problème pour les non-résidents : **IRC §1361(b)** établit des conditions strictes. Maximum **100 actionnaires**, tous doivent être **personnes physiques résidentes ou citoyens américains** (pas d'étrangers, pas de sociétés, pas de LLC comme actionnaires), une seule classe d'actions (avec la seule exception de différences en droits de vote). Pour ces conditions, une **S-Corp est complètement inviable pour un entrepreneur non-résident**. Nous la mentionnons pour que vous compreniez que lorsque vous lisez « S-Corp » dans des forums nord-américains ou dans des livres de tax planning de Robert Kiyosaki ou Mark Kohler, cela ne s'applique presque jamais à votre cas.

## Quand une C-Corp a du sens pour un non-résident

Une C-Corp peut compenser pour un non-résident dans des scénarios concrets :

- **Vous allez chercher de l'investissement venture capital** : les fonds exigent Delaware C-Corp avec cap table propre.
- **Vous prévoyez une introduction en bourse** ou être acquis par une société cotée (M&A typiquement exige C-Corp).
- **Vous allez avoir des employés avec stock options** aux États-Unis (plans ISO/NSO requièrent corporation).
- **Votre activité a ETBUS** (bureau, employés, serveurs propres, entrepôt) et donc paierait l'impôt fédéral de toute façon sous IRC §882 : le différentiel fiscal vs LLC disparaît et la C-Corp apporte une gouvernance plus solide.
- **Vous voulez profiter du QSBS (Qualified Small Business Stock)** défini en **IRC §1202** : si vous maintenez des actions d'une C-Corp qualifiée (actifs ≤ 50 M USD à l'émission, activité opérationnelle, pas services professionnels) pendant **5 ans**, vous pouvez exclure jusqu'au **plus grand de 10 M USD ou 10x base** en plus-value à la vente. C'est l'un des incitants fiscaux les plus puissants du système US pour fondateurs de startups.

La double imposition est atténuée par planification : salaires au fondateur (déductibles pour la corp, imposés comme ordinary income pour l'individu), rétention de bénéfices pour réinvestir au lieu de distribuer dividendes, plans de compensation différée et bon usage du QSBS si applicable.

## Tableau comparatif de fiscalité effective

Pour un bénéfice de **100 000 USD** généré par un non-résident sans ETBUS, sans US-source income, résident fiscal en France :

| Véhicule | Fédéral US | Étatique US | Retenue dividendes | Total US | Fiscalité France |
|---|---|---|---|---|---|
| **LLC disregarded** (WY/NM) | 0 USD | 0 USD | N/A | **0 USD** | BNC ou BIC selon activité, IR au barème progressif + cotisations sociales sur bénéfice net |
| **C-Corp Delaware** sans distribution | 21 000 USD | 0 USD si pas d'opération en DE | 0 USD | **21 000 USD** | Pas d'imposition immédiate si pas de distribution (sauf art. 209 B CGI sur sociétés étrangères en régime privilégié) |
| **C-Corp Delaware** avec distribution complète | 21 000 USD | 0 USD | 11 850 USD (15 % convention FR-US) | **32 850 USD** | PFU 30 % (12,8 % IR + 17,2 % prélèvements sociaux) sur dividende brut, crédit d'impôt sur retenue US |
| **S-Corp** | Non disponible aux non-résidents (IRC §1361(b)) |

La différence est énorme : pour profils opérationnels sans prétention d'investissement institutionnel, **la LLC est clairement plus efficace**. La C-Corp ne gagne que lorsque le plan stratégique requiert venture capital, introduction en bourse ou exploitation du QSBS.

## LLC US vs alternatives françaises : quand chaque structure correspond ?

Si vous êtes basé en France, vos options locales principales sont :

- **Micro-entrepreneur (régime micro)** : régime simplifié pour activités individuelles. Plafonds 2024-2025 : **77 700 €** pour prestations de services (BNC/BIC services), **188 700 €** pour vente de marchandises (BIC vente). Cotisations sociales URSSAF : **21,1 %** pour prestations BNC libérales, **21,2 %** pour prestations BIC services, **12,3 %** pour vente. Versement libératoire IR optionnel : **1 % vente / 1,7 % services BIC / 2,2 % BNC**. TVA : franchise jusqu'à **36 800 € (services) / 91 900 € (vente)** en 2024, avec seuils majorés de tolérance. Au-delà du plafond pendant deux années consécutives, sortie obligatoire vers régime réel.
- **EURL (Entreprise Unipersonnelle à Responsabilité Limitée)** : SARL à associé unique, capital libre dès **1 €**, IR par défaut (translucide), option IS possible. Gérant majoritaire affilié à la **Sécurité sociale des indépendants** (TNS, ~45 % de cotisations sur rémunération).
- **SASU (Société par Actions Simplifiée Unipersonnelle)** : capital libre dès 1 €, IS de droit (15 % jusqu'à 42 500 € de bénéfice puis 25 % au-delà — Loi de finances 2023), président assimilé salarié au **régime général de la Sécurité sociale** (~80 % de cotisations sur salaire mais ouverture aux droits salariés). PFU 30 % sur dividendes.
- **SAS / SARL pluripersonnelles** : pour projets à plusieurs associés.

Une LLC US détenue depuis la France est généralement traitée par l'**administration fiscale française comme transparente** quand elle est disregarded entity (single-member), suivant la doctrine BOI-INT-DG-20-10 et la jurisprudence du Conseil d'État. Cela signifie que les bénéfices sont imposés directement chez l'associé en France, au régime BNC ou BIC selon l'activité. La convention fiscale **France-États-Unis du 31/08/1994** (avec avenants) doit être analysée pour éviter double imposition. **Une LLC US n'est rentable pour un résident fiscal français que dans des cas très spécifiques** : forte activité avec clients hors France, volonté de bancarisation USD/internationale, besoin de séparer patrimoine. Pour la plupart des cas, micro-entrepreneur ou SASU avec bonne planification offrent un cadre plus simple et reconnu.

## Que choisir selon votre profil

- **Freelance, agence digitale, consultant, infopreneur, petit ecommerce, SaaS bootstrapped** : **LLC** sans aucun doute si vous facturez majoritairement à l'international. Wyoming ou Nouveau-Mexique pour le coût ; Delaware si vous prévoyez de croître beaucoup.
- **Startup avec levée seed ou série A planifiée** : **Delaware C-Corp** dès le premier jour, en assumant la double imposition comme coût d'accès au capital. Constituer la C-Corp directement évite la conversion LLC→C-Corp, qui est un événement imposable.
- **Activité physique aux États-Unis avec employés et opérations locales** : probablement C-Corp si vous prévoyez de bien grandir ; LLC si petit business sans capital institutionnel.
- **Profession réglementée (avocat, médecin, architecte ordinal)** : beaucoup d'États exigent **Professional LLC (PLLC)** ou **Professional Corporation (PC)** avec licence d'État.

Si vous avez déjà une LLC et devez la convertir en C-Corp, c'est possible via **statutory conversion** (DE, NV, WY) ou via **check-the-box election (Form 8832)**. Sous **IRC §351**, l'incorporation peut être tax-free si conditions remplies (contrôle 80 % post-incorporation, exclusivement actifs pour actions), mais toute déviation déclenche des événements imposables immédiats.

## Cadre réglementaire applicable

- **Internal Revenue Code (Title 26 USC)** : §11(b) C-Corp 21 % ; §§1361-1378 régime S-Corp ; §1202 QSBS ; §§871, 881, 882, 1441 fiscalité non-résidents ; §6038A Form 5472 ; §351 incorporations tax-free.
- **Treasury Regulations** : §301.7701-3 check-the-box ; §1.6038A-1/2 Form 5472 disregarded entities.
- **IRS Publications** : <a href="https://www.irs.gov/businesses/small-businesses-self-employed/business-structures">Business Structures</a> ; Pub. 519 (US Tax Guide for Aliens) ; Pub. 542 (Corporations).
- **Cadre étatique US** : Delaware General Corporation Law ; Wyoming Business Corporation Act ; New Mexico Limited Liability Company Act.
- **Cadre français** : Code général des impôts (art. 209 B CGI sur sociétés étrangères contrôlées, art. 123 bis CGI sur transparence fiscale, art. 8 et 8 ter sur sociétés de personnes) ; <a href="https://bofip.impots.gouv.fr">BOFiP-Impôts</a> BOI-INT-DG ; Convention fiscale France-États-Unis du 31/08/1994 ; Code de la sécurité sociale art. L. 311-3.

Pour les non-résidents, la LLC reste l'option la plus courante car elle combine protection patrimoniale, fiscalité propre (0 % fédéral sans ETBUS) et charge administrative basse. La C-Corp est réservée à qui cherche du capital institutionnel ou une introduction en bourse.

## Erreurs fréquentes au choix du véhicule

- **Penser que la S-Corp est « une LLC améliorée »** : elle ne l'est pas. C'est une option fiscale exclusive aux US persons. Si vous êtes non-résident, ne la considérez même pas.
- **Constituer une C-Corp « parce que ça fait plus sérieux »** sans besoin réel de capital : vous payez 21 % fédéral inutilement.
- **Convertir LLC en C-Corp sans conseil** : si IRC §351 n'est pas respecté, déclenchement immédiat d'événements imposables.
- **Choisir Delaware « parce que c'est connu »** quand WY/NM coûtent cinq fois moins en maintenance annuelle pour un freelance non-résident.

Le bon choix dépend de votre plan à 3-5 ans, pas de la mode du forum du moment.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/services">Découvrez si une LLC est faite pour vous</a>
<!-- /exentax:calc-cta-v1 -->

Chez Exentax nous examinons votre cas avec des chiffres réels et nous vous disons si une LLC, une C-Corp ou aucune structure US a du sens. <a href="/fr/reserver">Réservez une consultation gratuite</a> de 30 minutes et repartez avec un plan clair.

<!-- exentax:execution-v2 -->
## Comment nous le résolvons avec la méthode Exentax

Ce que nous voyons chaque semaine est le même schéma : le doute reste à l'état d'idées éparses, la décision se reporte et, à la clôture de l'exercice, vous payez plus d'impôts que nécessaire ou prenez des risques qui ne compensent pas. Le problème n'est presque jamais la norme ; c'est l'absence d'un plan écrit avec des chiffres réels, signé par quelqu'un qui comprend votre cas de bout en bout.

**Ce que les gens font mal**
- Copier des structures vues sur les réseaux sans modéliser leur propre cas avec revenus, résidence et clients en main.
- Mélanger argent personnel et professionnel et perdre la traçabilité documentaire que toute inspection exige.
- Confier l'opérationnel à des cabinets qui ne remplissent que des formulaires, sans stratégie annuelle ni vision du coût total.

**Ce qui fonctionne vraiment**
- Modéliser votre situation dans la <strong>calculatrice Exentax</strong> avant de bouger une seule pièce, pour voir le coût total annuel et pas seulement la facture du jour.
- Séparer dès le premier jour les flux d'argent, avec comptes distincts et checklist vivante de justificatifs.
- Travailler avec un conseil qui regarde les pièces ensemble : structure, banque, conformité et résidence — pas chacune de son côté.

Si vous voulez passer du doute au plan, réservez 30 minutes avec Exentax et nous sortons de l'appel avec les chiffres bouclés et le calendrier opérationnel.
<!-- /exentax:execution-v2 -->


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
<p data-testid="cta-action-row">Besoin d'en parler maintenant ? Écrivez-nous par <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20viens%20de%20l%27article%20%22Diff%C3%A9rence%20entre%20LLC%2C%20Corporation%2C%20S-Corp%20et%20C-Corp%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller.">WhatsApp</a> et nous vous répondons aujourd'hui même.</p>

Si votre plan est de monter la LLC au Delaware, consultez notre page de service <a href="/fr/services/llc-delaware">LLC au Delaware</a> avec coûts, délais et étapes concrètes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Nous comparons le Nouveau-Mexique, le Wyoming, le Delaware et la Floride sur votre cas réel — sans vous vendre l'État à la mode. <a href="/fr/services/llc-delaware">Comparer mon cas avec un conseiller</a>.
<!-- /exentax:cta-v1 -->
`;
