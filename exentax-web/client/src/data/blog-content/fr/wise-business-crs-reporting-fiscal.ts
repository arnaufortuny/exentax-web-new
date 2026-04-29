export default `

Wise Business reporte les soldes de comptes à plus de 120 juridictions sous CRS et, pour un résident fiscal espagnol, transmet l'information à l'AEAT avant le 30 septembre de chaque exercice.

Wise Business (anciennement TransferWise) est la fintech multi-devises que la plupart des propriétaires de <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaines</a> ouvrent en premier, aux côtés de tout entrepreneur international qui doit faire circuler de l'argent entre pays. La promesse est claire : taux de change mid-market, IBAN locaux en EUR, GBP, USD et une dizaine d'autres devises, et des frais si bas qu'on les remarque à peine. Ce que beaucoup oublient, c'est que Wise est aussi une institution financière européenne pleinement régulée, soumise au **Common Reporting Standard (CRS)**. Et cette pièce du puzzle a des conséquences très concrètes qu'il vaut mieux connaître avant d'intégrer Wise dans la structure de votre LLC.

<!-- exentax:crs2-update-v1 -->
## Mise à jour CRS 2.0, CARF et DAC8 (paquet OCDE)

Wise Europe SA est une EMI belge, et avec le CRS 2.0 les EMI et les produits spécifiés de monnaie électronique sont pleinement classés comme Reporting Financial Institutions ; la due diligence sur les controlling persons des Passive NFEs se durcit et l'ouverture de Wise Business pour votre LLC sera documentée selon des critères plus exigeants.

L'OCDE a adopté le paquet intégré formé par **CRS 2.0** (la révision du Common Reporting Standard, qui fait entrer les EMI et les produits de monnaie électronique spécifiés dans le périmètre et renforce la due diligence sur les controlling persons) et **CARF** (Crypto-Asset Reporting Framework, qui étend l'échange automatique aux exchanges, dépositaires et plateformes de dérivés crypto). L'Union européenne l'a transposé par la **Directive (UE) 2023/2226 (DAC8)**, adoptée le 17 octobre 2023, qui modifie la directive 2011/16/UE pour intégrer les deux pièces. La date d'application matérielle est le **1er janvier 2026** et le **premier échange effectif** arrive en **janvier 2027 sur les données de l'exercice 2026**.

Sources officielles : <a href="https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/" target="_blank" rel="noopener nofollow">OCDE — CRS</a>, <a href="https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm" target="_blank" rel="noopener nofollow">OCDE — CARF</a>, <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226" target="_blank" rel="noopener nofollow">EUR-Lex — Directive (UE) 2023/2226 (DAC8)</a>.

Le message à retenir reste inchangé : **les États-Unis restent hors du périmètre CRS par architecture, pas par opacité**. Washington dispose de son propre régime (FATCA), n'a pas signé le CRS 1.0 et ne signera pas non plus le CRS 2.0, et c'est précisément pour cela que votre LLC américaine demeure une structure parfaitement déclarable dans votre pays de résidence. Nous le détaillons dans <a href="/fr/blog/crs-2-0-carf-pourquoi-les-usa-ne-signeront-jamais-llc">CRS 2.0 et CARF : pourquoi les USA ne signeront jamais et ce que cela change pour votre LLC</a>.
<!-- /exentax:crs2-update-v1 -->

## Quelle entité Wise gère réellement votre compte et où elle déclare

Wise n'opère pas comme une seule société mondiale. Elle opère via plusieurs entités régulées, et celle qui détient votre compte décide quelle administration fiscale verra vos données :

- **Wise Europe SA** (Belgique) : Établissement de Monnaie Électronique (EMI) régulé par la **Banque nationale de Belgique (BNB)**. C'est l'entité qui sert les clients européens depuis que le Royaume-Uni a perdu le passeport européen après le Brexit. Elle déclare le CRS au **Service Public Fédéral Finances** belge, qui active ensuite l'échange bilatéral d'informations avec l'administration fiscale du pays de résidence du titulaire.
- **Wise Payments Limited** (Royaume-Uni) : EMI régulé par la FCA. Sert toujours les clients UK et certains comptes historiques.
- **Wise US Inc.** : régulé aux États-Unis comme Money Services Business (MSB). Le CRS ne s'applique pas ici car les États-Unis n'y ont jamais adhéré.
- Filiales à Singapour, en Australie, en Inde et sur d'autres marchés, chacune avec son propre régulateur local et ses propres règles de déclaration.

Pour les clients européens et pour toute LLC ouverte avec une représentation européenne dans le KYC, la configuration par défaut est que le compte est tenu par **Wise Europe SA (Belgique)**. Conséquence directe : le rapport CRS part de Belgique et arrive chaque année à l'administration fiscale de votre pays de résidence, peu importe où la LLC a été constituée.

### Cadre normatif

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a>** : Common Reporting Standard.
- **UE** : Directive 2011/16/UE modifiée par DAC2.
- **Belgique** : loi du 16 décembre 2015 régissant l'échange automatique d'informations financières (LIAFI) et les arrêtés royaux d'application.
- **Espagne du côté receveur** : Real Decreto 1021/2015, **Modelo 720** (la déclaration espagnole des avoirs détenus à l'étranger : comptes, valeurs, immobilier) et **Modelo 721** (l'équivalent pour les actifs crypto détenus hors d'Espagne). Nous détaillons le côté receveur dans notre article sur <a href="/fr/blog/crs-pour-residents-en-espagne-et-latam-implications-reelles">le CRS pour les résidents en Espagne et en LATAM</a>.

### Quelles informations Wise envoie au titre du CRS

Les mêmes informations que toute Reporting Financial Institution sous CRS, ni plus ni moins :

| Bloc | Détail |
| --- | --- |
| Titulaire personne physique | Nom, adresse, résidence fiscale déclarée, TIN, date et lieu de naissance |
| Titulaire entité | Raison sociale, adresse, EIN/NIF, classification CRS (Active NFE, Passive NFE, Investment Entity) |
| Controlling persons | Si l'entité est Passive NFE : données des bénéficiaires effectifs (seuil de 25% en propriété directe ou indirecte, ou toute autre forme de contrôle effectif) |
| Compte | Chaque IBAN détenu par devise, plus la référence interne Wise |
| Solde | Solde agrégé au 31 décembre (Wise gère des pools par devise ; le rapport agrège l'ensemble) |
| Revenus | Intérêts éventuels (Wise Interest, Wise Assets), dividendes bruts, produits bruts de remboursement (traités comme revenus de comptes de conservation, avec le programme Assets en tête) |

Le produit **Wise Interest** et les produits d'investissement Wise adossés à des fonds monétaires relèvent clairement du reporting de comptes de conservation. Le détail des revenus bruts s'ajoute donc au solde de clôture, sans s'y substituer.

### Comment Wise classe votre LLC sous CRS

Quand vous ouvrez un compte Wise Business pour votre LLC, Wise applique sa due diligence CRS sur l'entité. On vous demande de remplir le formulaire **CRS Self-Certification** et de confirmer :

- La résidence fiscale de la LLC : États-Unis.
- Sa classification : Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution, etc.
- Les controlling persons (jeu de données complet : nom, adresse, résidence fiscale, TIN, date et lieu de naissance).

En pratique, une LLC unipersonnelle de services satisfait normalement au critère **Active NFE** (plus de 50% de ses revenus sont des revenus opérationnels, pas passifs). Mais Wise joue prudent : si votre documentation est mince ou si l'activité ne peut pas être démontrée proprement, elle classe la LLC comme **Passive NFE** et déclare directement la controlling person.

La conclusion qu'on ne peut pas contourner : même si la LLC est américaine et que les États-Unis n'ont jamais adhéré au CRS, **les données sur qui la possède et combien y dort en compte arriveront chez votre administration fiscale** via la Belgique.

### Quand et comment la déclaration arrive vraiment

- Photo de fin d'exercice : 31 décembre.
- Wise transmet le rapport CRS à l'autorité belge généralement entre mars et juin de l'année suivante.
- La Belgique le réexpédie aux administrations fiscales du pays de résidence de chaque titulaire et de chaque controlling person, normalement avant le 30 septembre.
- Votre fisc dispose alors de la donnée et la croise avec vos déclarations (en France, l'IR plus le formulaire 3916 pour les comptes étrangers ; en Espagne, l'IRPF plus le Modelo 720, plus le Modelo 721 si vous détenez aussi des cryptos à l'étranger).

Le solde Wise que vous portiez au 31/12/2025 est donc rapproché de votre déclaration de revenus annuelle et du Modelo 720 que vous déposez en mars de l'année suivante. Deux formulaires différents, une seule réconciliation.

## Les erreurs les plus fréquentes avec Wise et la fiscalité

1. **« Wise n'est qu'un rail de paiement, personne ne voit rien. »** Faux. Wise est une institution financière régulée et pleinement soumise au CRS, exactement comme une banque traditionnelle.
2. **« Si je mets la LLC sur le formulaire, mon nom n'apparaît pas. »** Faux pour toute Passive NFE : les controlling persons sont déclarés nominativement. Et la plupart des LLC unipersonnelles finissent classées Passive NFE simplement par prudence bancaire.
3. **« Mon solde moyen était minuscule, je ne serai donc pas déclaré. »** Wise déclare le solde de clôture au 31 décembre, peu importe les fluctuations de l'année. Le CRS n'a aucun seuil minimum pour les comptes préexistants depuis 2017, ni pour les nouveaux comptes.
4. **« Je n'ai pas mis Wise sur mon Modelo 720 parce que c'était petit. »** Le seuil du Modelo 720 est l'agrégat de tous vos comptes étrangers, pas une limite par compte. Si Wise + Mercury + Revolut + N26 dépassent ensemble 50 000 €, chacun doit être déclaré.
5. **« Je n'utiliserai Wise que pour le change, pas pour la conservation. »** Même si vous n'utilisez Wise que comme compte de dépôt opérationnel, il reste un compte financier déclarable. La distinction dépôt/conservation modifie le bloc « détail des revenus », pas le rapport du solde lui-même.

### Comment Wise se compare à Revolut et Mercury

| Aspect | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| Soumis au CRS | Oui | Oui | Non |
| Déclare le bénéficiaire effectif de la LLC | Oui (Passive NFE typique) | Oui (Passive NFE typique) | Non |
| Produit d'investissement natif | Wise Assets, Wise Interest | Stocks, Vault | Treasury, FDIC sweep |
| Multi-devises natif | Excellent | Excellent | Principalement USD |
| Pertinence comme compte principal de la LLC | Secondaire | Secondaire | Principal |

Comparatif détaillé dans <a href="/fr/blog/wise-business-avec-votre-llc-guide-complet-de-gestion-multi">le guide complet de Wise Business pour votre LLC</a>, dans <a href="/fr/blog/revolut-business-et-crs-ce-qui-est-declare-a-votre-fisc">l'analyse dédiée Revolut et CRS</a> et, spécifiquement pour l'IBAN belge, dans <a href="/fr/blog/wise-iban-et-llc-ce-qui-est-vraiment-declare-au-fisc">ce que l'IBAN Wei associé à votre LLC déclare au fisc</a>.

### Comment planifier correctement

1. **Soignez votre auto-certification dès le premier jour.** Soyez précis sur la classification CRS de la LLC et sur l'identité des controlling persons. Mentir ou omettre est une infraction et, dans certaines juridictions, un délit.
2. **Utilisez Wise comme compte opérationnel secondaire**, pas comme compte principal de la LLC, si vous voulez réduire au minimum l'empreinte CRS vers votre pays. Mercury reste le compte principal naturel d'une LLC américaine.
3. **Maintenez une cohérence documentaire complète.** Votre auto-certification CRS chez Wise, votre Modelo 720 (Espagne) ou son équivalent LATAM, et votre déclaration de revenus doivent toutes raconter la même histoire.
4. **Anticipez le solde de clôture.** Si vous savez que vous allez clôturer le 31/12 avec un solde élevé, prévoyez qu'il soit correctement déclaré et correctement justifié (origine des fonds, finalité opérationnelle, impôts déjà payés).
5. **Prenez de la hauteur sur le reste du cadre** : <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">la conception globale de votre structure</a> est ce qui décide si Wise + LLC + votre résidence tient debout ou s'effondre.

### En résumé

Wise Business n'est pas un raccourci pour éviter le reporting fiscal. C'est une excellente fintech régulée qui déclare au CRS depuis la Belgique vers votre administration fiscale. Bien intégrée dans une structure cohérente avec votre LLC américaine, elle est très utile. Mal intégrée, ou utilisée avec des auto-certifications qui ne collent pas à la réalité, elle devient la source la plus fréquente des problèmes fiscaux que nous voyons arriver sur notre bureau.

## Conformité fiscale en France : CFC, transparence et attribution de revenus

Une LLC américaine est un outil légal et reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution : en tant que propriétaire résident fiscal français au sens de l'article 4 B du CGI, l'administration française conserve le droit d'imposer ce que la LLC génère. L'important est de savoir **sous quel régime** s'applique cette imposition.

### En France et dans la zone francophone

- **France (CGI et BOFIP).** Si votre LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), la DGFiP la traite généralement comme une **société de personnes étrangère fiscalement transparente** : les bénéfices nets vous sont attribués au titre du BIC (annexe 2031) ou du BNC (annexe 2035) l'année de leur réalisation, intégrés dans le revenu imposable et soumis au barème progressif de l'IR plus prélèvements sociaux (CSG/CRDS) au taux de 17,2 % sur les revenus du patrimoine. Si la LLC opte pour la fiscalité de *corporation* via Form 5472 couplé à **Form 8832** (le formulaire IRS d'élection) et que vous êtes son contrôleur unique avec des revenus majoritairement passifs, l'**article 209 B du CGI** (anti-CFC pour entreprises) et l'**article 123 bis du CGI** (anti-CFC pour particuliers, avec seuil de détention 10 % et régime fiscal privilégié) peuvent s'activer. La différence n'est pas optionnelle : elle dépend de la substance économique, pas du nom de l'entité.
- **Déclarations informatives.** Comptes bancaires aux États-Unis et tous les comptes IBAN européens à votre nom personnel (Wise, Revolut, N26, Wallester) : **Formulaire 3916** chaque année avec la 2042, sans seuil. Comptes d'actifs numériques à l'étranger : **Formulaire 3916-bis**. Pour la LLC elle-même en tant qu'établissement étranger contrôlé : déclaration 2065 le cas échéant et annexe 2257 si l'art. 209 B s'applique.
- **Convention France–États-Unis.** La convention de 1994 (avec ses avenants successifs, dernier protocole en vigueur depuis 2009) règle la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement stable en France ne constitue pas, en soi, un ES de l'associé, mais la **direction effective** peut en créer un si toute la gestion se fait depuis votre domicile français (BOI-INT-CVB-USA-10-20).
- **Belgique, Luxembourg, Suisse, Québec.** Chaque juridiction francophone a son propre régime de transparence et anti-abus : Belgique avec la **Cayman Tax** (taxe de transparence sur les constructions juridiques étrangères, art. 5/1 CIR 92), Luxembourg avec la directive ATAD transposée et le test de substance, Suisse avec la **circulaire AFC n°5** sur la transparence des sociétés étrangères, Québec avec les **règles SECI** fédérales canadiennes (sociétés étrangères contrôlées par des intérêts canadiens). Le principe commun : ce que la LLC retient comme bénéfice est considéré comme perçu par le résident si l'entité est jugée transparente ou contrôlée.

La règle pratique : une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.

Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href="/fr#calculadora">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et nous documentons chaque étape pour que votre déclaration locale tienne sans broncher devant un éventuel contrôle.

<!-- exentax:cta-mid -->
**Ça vous semble lourd ?** <a href="/fr/services">Nos services</a> couvrent déjà « Wise Business et CRS : ce qui est déclaré à votre fisc et comment l'intégrer dans votre structure », déposé dans les délais, sans rien à toucher de votre côté.

<!-- exentax:cta-final -->
**Décrivez-nous votre cas et nous vous dirons par où commencer.** Réservez un appel de 30 minutes sur « Wise Business et CRS : ce qui est déclaré à votre fisc et comment l'intégrer dans votre structure » et nous le passons en revue ensemble.

<!-- exentax:legal-refs-v1 --><!-- exentax:execution-v2 -->
## Wise Business et CRS : comment il déclare à votre fisc et pourquoi toujours déclarer

Wise Business est opérationnellement excellent pour votre LLC — multi-devises, FX bon marché, IBAN locaux dans plusieurs juridictions — et, du point de vue du reporting fiscal, c'est une institution financière pleinement soumise au CRS. Si vous êtes résident fiscal en France, en Espagne, en Italie, en Allemagne, au Portugal ou dans tout autre pays CRS, votre administration fiscale reçoit la donnée chaque année. Il vaut mieux savoir exactement ce qui arrive et comment c'est croisé.

- **Statut réglementaire de Wise Business.** Wise opère sous plusieurs licences : Wise Payments Limited (UK FCA), Wise Europe SA (Belgique NBB), Wise USD Inc. (US <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), entre autres. Chaque entité régionale déclare selon le régime de sa juridiction. Pour les utilisateurs européens de Wise Business, le reporting CRS est fait par Wise Europe SA à la Banque nationale de Belgique, qui partage avec le reste des juridictions CRS — y compris le pays de résidence de l'UBO.
- **Données exactes transmises.** Identification du bénéficiaire effectif selon le KYC (nom complet, pièce d'identité, adresse, résidence fiscale déclarée à l'onboarding), solde au 31 décembre par devise (Wise multi-devises déclare chaque solde USD/EUR/GBP), total des mouvements bruts annuels, et identifiants de compte (IBAN belge BE pour l'EUR, routing number USD pour l'USD, etc.). Les transactions individuelles ne sont PAS transmises ; les agrégats, oui.
- **Croisement automatique avec votre IR ou IS.** La France relie la donnée CRS à votre numéro fiscal pour la croiser avec : (1) le formulaire 3916 si vous déteniez le compte à l'étranger ; (2) l'IR sur l'attribution de revenus de la LLC ; (3) éventuellement la déclaration crypto si vous détenez aussi des actifs numériques. Discordance = alerte automatique. Suite typique : demande d'information puis procédure de vérification si vous ne répondez pas avec documentation.
- **Ce qui change quand votre LLC ajoute Wise Business.** Wise Business EUR (compte belge) déclare plus vite et plus complètement que Wise USD (compte sous-licence US). Si vous avez les deux (Wise multi-devises), les deux déclarent, mais via des canaux différents (Belgique → CRS, US → FATCA-IGA). Conséquence pratique : la visibilité fiscale est identique, seule la latence change.

### Ce qu'on nous demande le plus

**Si j'ouvre Wise Business comme LLC, ça déclare aux US ou à mon pays ?** Ça déclare à la résidence fiscale de l'UBO — la personne physique derrière l'entité. Si vous avez dit « France » au KYC, la donnée part en France via CRS. La LLC est traitée comme transparente pour identifier l'UBO ; le CRS regarde l'humain derrière.

**Puis-je déclarer la LLC en résidence sans déclarer Wise spécifiquement ?** Non. La LLC est une obligation (attribution de revenus ou traitement dividende selon le pays). Wise est le compte bancaire de la LLC et vous devez le déclarer sur le formulaire correspondant (Modelo 720 Espagne, formulaire 3916 France, RW Italie). Deux obligations distinctes, deux croisements automatiques.

Chez Exentax nous structurons les comptes Wise + Mercury + Stripe en tenant compte dès le premier jour de ce que CRS et FATCA déclarent, et nous planifions les déclarations locales (720, 721, 3916, RW) — pour que le croisement automatique ne génère ni demande d'information ni sanction d'imputation.
<!-- /exentax:execution-v2 -->

## Références : sources et cadre bancaire

L'opérationnel bancaire décrit ci-dessus s'appuie sur de la documentation publique et sur les politiques en vigueur de chaque plateforme :

- **Bank Secrecy Act et FinCEN.** 31 U.S.C. §5318 (programmes KYC/AML obligatoires pour les institutions financières), 31 CFR Part 1010 (CIP, identification du client) et 31 U.S.C. §5336 avec la Reporting Rule de FinCEN du 1er janvier 2024 (Beneficial Ownership Information Report).
- **FATCA et CRS.** IRC §1471–1474 (FATCA et formulaires W-8/W-9), Accords Intergouvernementaux Modèle 1 signés par les États-Unis avec l'Espagne et plusieurs pays LATAM, et la Norme Commune de Déclaration (CRS) de l'OCDE à laquelle les États-Unis ne participent pas mais qui s'applique bel et bien aux fintechs avec licence européenne (Wise Europe SA en Belgique, Revolut Bank UAB en Lituanie).
- **Plateformes spécifiques.** Conditions de service publiées, politique de confidentialité et FAQ réglementaire de Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB aux États-Unis ; Wise Europe SA en UE ; Wise Payments Ltd. au UK), Revolut Business et Payoneer.

Information à des fins divulgatives ; chaque cas bancaire requiert une analyse spécifique de KYC, juridiction de résidence et volume opéré.

<!-- exentax:cross-refs-v1 -->
### Lectures complémentaires

- [Visa et Mastercard : ce que les fiscs voient vraiment de vos dépenses par carte](/fr/blog/visa-mastercard-reporting-ce-que-le-fisc-voit-de-vos)
<!-- /exentax:cross-refs-v1 -->

Vous voulez appliquer ce protocole à votre cas ? <a href="/fr/reserver">Réservez une session avec l'équipe Exentax</a> et nous revoyons votre LLC avec des chiffres réels en trente minutes, sans engagement.

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
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22wise%20business%20crs%20reporting%20fiscal%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

`;
