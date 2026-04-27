export default `Quand on parle de Wise, d'IBAN étrangers et de LLC américaines, deux récits aussi faux l'un que l'autre reviennent en boucle: d'un côté, "Wise ne déclare rien et le fisc ne saura jamais", de l'autre, la peur que chaque paiement par carte soit envoyé en direct à la DGFiP ou à votre administration fiscale nationale. La réalité est nettement plus nuancée et il est utile de la comprendre avant de monter votre structure, surtout si vous combinez une <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a> avec un compte Wise et les cartes qui vont avec.

Cet article se concentre sur ce qui se passe vraiment: quel type d'information sort de Wise vers votre administration fiscale, ce qui n'en sort pas, et où se situe la frontière entre usage légitime et exposition fiscale. Pour l'analyse technique détaillée du flux CRS de Wise Business depuis la Belgique, nous l'approfondissons dans <a href="/fr/blog/wise-business-et-crs-ce-qui-est-declare-a-votre-fisc">Wise Business et CRS: ce qui est déclaré à votre fisc</a>.

## Comment Wise fonctionne réellement

Wise n'est pas une banque traditionnelle, ni une passerelle opaque, ni un compte offshore. C'est un groupe d'entités régulées qui opère dans plusieurs juridictions:

- **Wise Europe SA**, basée en Belgique, agréée comme Electronic Money Institution par la National Bank of Belgium. C'est l'entité qui sert la majorité des clients européens et la plupart des LLC ayant une représentation européenne.
- **Wise Payments Limited**, au Royaume-Uni, régulée par la FCA. Continue de servir les clients UK et certains comptes legacy.
- **Wise US Inc.**, régulée aux États-Unis comme Money Services Business. C'est l'entité pour les clients résidents et entités américaines.
- Filiales à Singapour, en Australie, en Inde et dans d'autres juridictions, chacune avec son régulateur local.

Quand vous ouvrez un compte Wise (personnel ou Business), vous recevez des "coordonnées bancaires locales" en plusieurs devises: un **IBAN belge (BE) émis par Wise Europe SA** pour l'EUR (certains anciens clients européens peuvent encore avoir des IBAN lituaniens hérités; pour une **LLC américaine ouverte aujourd'hui via Wise Business**, l'IBAN EUR provient toujours de l'entité belge, jamais de Lituanie), un **sort code et un account number en GBP**, un **routing number et un account number en USD**, et leurs équivalents en AUD, NZD, SGD, etc. Ces IBAN ne font pas de Wise une banque belge ou lituanienne classique: ce sont des comptes clients ségrégués au sein du schéma EMI européen.

Ce qui compte sur le plan fiscal: même si vous voyez un IBAN belge ou lituanien, **l'entité qui détient vos fonds et déclare sur votre compte est Wise Europe SA (Belgique)** dans la grande majorité des cas européens. C'est cette entité qui déclenche les flux CRS.
## Ce qu'est le CRS et quand il s'applique

Le **Common Reporting Standard (CRS)** est le cadre de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> qui oblige les institutions financières de plus de 100 juridictions à identifier leurs clients non résidents et à déclarer chaque année leurs soldes et revenus à l'administration fiscale locale, qui échange ensuite les données avec celle du pays de résidence du titulaire. Dans l'UE, il a été transposé via la **Directive 2011/16/UE (DAC2)** et, en Belgique, par la loi du 16 décembre 2015 relative à l'échange automatique d'informations financières.

Pour Wise:

- **Wise Europe SA (Belgique)** est pleinement soumise au CRS. Elle déclare au Service Public Fédéral Finances belge, qui retransmet à l'administration fiscale du pays de résidence du titulaire.
- **Wise Payments Limited (UK)** est également soumise au CRS, le canal formel passant par HMRC.
- **Wise US Inc.** n'est pas soumise au CRS, car les États-Unis n'y ont pas adhéré (ils utilisent leur propre cadre asymétrique, FATCA, qui vise principalement les US persons).

Concrètement: si votre compte Wise relève de Wise Europe SA, partez du principe que le solde au 31 décembre et l'identité du titulaire arrivent à votre administration fiscale nationale. Si vous relevez de Wise US Inc., le CRS ne s'applique pas, mais ce compte n'est accessible qu'à de véritables résidents et entités américaines, pas à un non-résident qui pilote une LLC depuis l'Europe.
## Ce que Wise déclare réellement

Le bloc d'information transmis via CRS est très précis et n'inclut pas, contrairement aux craintes courantes, "tous les mouvements en temps réel":

| Bloc | Contenu |
| --- | --- |
| Titulaire personne physique | Nom, adresse, résidence fiscale déclarée, numéro d'identification fiscale (TIN), date et lieu de naissance |
| Titulaire entité | Dénomination, adresse, EIN/identifiant fiscal de la LLC, classification CRS (Active NFE, Passive NFE, Investment Entity) |
| Bénéficiaires effectifs | Si l'entité est classée Passive NFE, les données des controlling persons (seuil de 25% direct ou indirect, ou contrôle effectif) |
| Compte | IBAN par devise, numéro de compte interne Wise |
| Solde | Solde agrégé au 31 décembre, normalement en EUR converti à la clôture |
| Revenus | Intérêts s'il y en a (Wise Interest), dividendes bruts et produits bruts de remboursement pour Wise Assets |

Ce qui n'est **pas** déclaré via le CRS:

- Le détail de chaque mouvement opérationnel de l'année.
- Le nom et les coordonnées de vos clients.
- Vos factures, vos contrats ou vos marges.
- Les achats précis effectués avec la carte Wise.

Cela ne signifie pas que ces informations sont invisibles: si votre administration fiscale ouvre une procédure, elle peut vous les demander directement et, dans des enquêtes plus poussées, solliciter Wise via les canaux de coopération fiscale. Cela signifie simplement que le flux automatique annuel n'est pas un export complet: c'est solde + revenus + identité.
## Cartes Visa et Mastercard: la nuance importante

Une idée très répandue veut que "comme les cartes sont Visa ou Mastercard, les réseaux envoient déjà tout au fisc". Quelques précisions:

- Visa et Mastercard sont des **réseaux de traitement des paiements**, pas des institutions financières qui détiennent votre compte. Leur rôle est de régler les transactions entre la banque émettrice et la banque acquéreur du commerçant.
- **Visa et Mastercard ne déclarent pas vos dépenses par carte directement à votre administration fiscale** sous forme de flux automatique périodique. Ce n'est pas leur rôle.
- L'obligation déclarative pèse sur **l'émetteur de la carte** (ici Wise Europe SA) et sur le **commerçant acquéreur** dans sa propre comptabilité.
- Au sein des systèmes nationaux, certaines obligations existent pour les institutions financières domestiques (par exemple en France via les déclarations DAS2 et autres canaux fiscaux pour les comptes domestiques), mais ce cadre ne s'applique pas avec la même intensité à un EMI étranger qui émet la carte.

Si vous voulez la carte complète de qui déclare quoi de vos paiements par carte pays par pays (Modelo 196, 171, DAS2, Modelo 38), nous le développons dans <a href="/fr/blog/visa-mastercard-reporting-ce-que-le-fisc-voit-de-vos">Visa et Mastercard: ce que le fisc voit vraiment de vos paiements par carte</a>.

Conclusion raisonnable: utiliser la carte Wise pour des dépenses personnelles en tant que résident fiscal en France ou en Espagne ne déclenche pas un signalement automatique en temps réel de chaque transaction au fisc. Ce qui est déclenché, avec le reste du compte, c'est le rapport CRS annuel du solde et des revenus. Et surtout, cela laisse une trace parfaitement traçable si l'administration vous demande plus tard l'origine des fonds.
## Le cas typique: LLC non résidente avec Wise Business

C'est ici que circulent le plus de mythes. Un entrepreneur résident fiscal en France, en Espagne ou en LATAM constitue une <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a>, ouvre Mercury comme compte principal et Wise Business comme compte secondaire multi-devises. Au moment de remplir l'auto-certification CRS de Wise pour la LLC, il doit indiquer:

- Résidence fiscale de la LLC: USA.
- Classification CRS: la plupart des Single-Member LLC de services remplissent les conditions d'**Active NFE** (plus de 50% des revenus sont opérationnels), mais Wise applique souvent des critères conservateurs et, face à une documentation faible, classe l'entité comme **Passive NFE**.
- Controlling persons: les données du bénéficiaire effectif, y compris sa résidence fiscale (la vôtre, en France, en Espagne ou ailleurs).

Conséquence pratique: même si la LLC est américaine et que les États-Unis ne sont pas dans le CRS, **le fait que vous soyez controlling person, avec votre résidence fiscale réelle, arrive chez votre administration fiscale depuis la Belgique**. C'est la pièce que beaucoup oublient.

Cela ne rend pas la LLC "illégale": une LLC bien structurée et bien déclarée est un outil parfaitement légitime. Cela invalide simplement l'idée que mettre Wise Business au nom de la LLC bloque le flux d'information vers votre pays de résidence.
## Ce que votre administration fiscale peut voir (et ce qu'elle ne voit pas)

Traduit dans la pratique d'un résident fiscal en France ou en Espagne avec LLC + Wise:

Ce que l'administration peut voir automatiquement et chaque année:

- L'existence d'un compte Wise lié à la LLC et à vous comme controlling person.
- Le solde de clôture au 31 décembre.
- Les revenus bruts générés (Wise Interest, Wise Assets, etc.).
- Vos nom, identifiant fiscal et adresse comme bénéficiaire effectif.

Ce qu'elle ne reçoit pas automatiquement:

- Le détail de chaque mouvement de l'année.
- Les coordonnées de vos clients et de vos factures.
- Les transactions précises de la carte.
- Le P&L interne de la LLC.

Ce qui se passe quand ces données sont croisées avec vos déclarations nationales:

- Si votre déclaration de comptes à l'étranger (formulaire 3916 en France, Modelo 720 en Espagne, équivalents ailleurs) ne mentionne pas Wise alors qu'elle le devrait, le décalage est évident.
- Si votre déclaration de revenus ignore les revenus attribuables à la LLC dans les pays qui la traitent comme transparente, comme nous l'analysons dans <a href="/fr/blog/crs-pour-residents-en-espagne-et-latam-implications-reelles">CRS pour résidents en Espagne et LATAM</a>, un autre écart apparaît.
- Si les soldes ne correspondent pas aux revenus déclarés, l'administration dispose d'un levier naturel pour ouvrir un contrôle.

Le problème n'est presque jamais la déclaration en soi, mais l'**incohérence documentaire** entre ce que vous déclarez chez vous, ce qui sort de Belgique via CRS et ce que montre votre opérationnel réel.
## Erreurs fréquentes que nous voyons chaque semaine

1. **"Wise ne déclare rien."** Faux. Wise Europe SA déclare via CRS depuis la Belgique.
2. **"Si le compte est au nom de la LLC, ils ne me déclarent pas."** Faux pour une Passive NFE: les controlling persons sont déclarés, et la majorité des Single-Member LLC finissent ainsi classées.
3. **"Mon solde moyen est faible, je ne suis pas dans le CRS."** Le solde déclaré est celui de clôture, peu importent les fluctuations de l'année, et il n'y a pas de seuil minimal sur les nouveaux comptes.
4. **"J'ai un compte Wise USD sous Wise US Inc., il n'est pas déclaré."** Vrai pour le CRS, mais cette configuration n'est cohérente que pour de véritables résidents et entités américaines; l'utiliser depuis l'Europe avec une LLC pilotée par un non-résident expose sur un autre front (résidence, lieu de gestion, due diligence interne de Wise).
5. **"Je paie tout avec la carte Wise, donc pas de trace."** La trace existe: chez Wise, chez le commerçant et dans le solde de clôture qui, lui, est bien déclaré. Et elle est parfaitement reconstituable en cas de procédure.
6. **"La LLC me protège automatiquement de la déclaration de comptes à l'étranger."** Non: si vous êtes résident fiscal en France, en Espagne ou ailleurs et bénéficiaire effectif de comptes étrangers, l'obligation s'applique dès que les seuils agrégés sont franchis.
## Pourquoi cela compte pour votre structure

La conclusion raisonnable n'est pas "Wise est mauvais" ni "la LLC est dangereuse". C'est que **votre structure ne tient que si les pièces sont cohérentes entre elles**: votre résidence fiscale, l'entité qui détient votre compte, la classification CRS de la LLC, vos déclarations nationales, votre impôt sur le revenu et vos contrats clients. Quand l'une de ces pièces ne s'emboîte pas, les problèmes n'apparaissent pas le jour où vous bougez l'argent. Ils apparaissent trois ou quatre ans plus tard sous forme d'un avis de contrôle.

Chez Exentax, nous travaillons précisément sur cette frontière: structurer la <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a>, choisir <a href="/fr/blog/banques-traditionnelles-vs-fintech-pour-votre-llc-ou-ouvrir">quelle banque ou fintech</a> a du sens en compte principal et laquelle en compte secondaire, anticiper ce qui sera déclaré via <a href="/fr/blog/crs-pour-residents-en-espagne-et-latam-implications-reelles">CRS</a> vers votre administration nationale, et concevoir l'ensemble pour que la pièce Wise (ou <a href="/fr/blog/revolut-business-et-crs-ce-qui-est-declare-a-votre-fisc">Revolut Business</a>, ou toute autre) s'intègre sans surprise. Nous le détaillons dans <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">Conception d'une structure fiscale internationale solide</a>.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Chez Exentax, nous travaillons précisément sur cette frontière: structurer la <a href="/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026">LLC américaine</a>, choisir <a href="/fr/blog/banques-traditionnelles-vs-fintech-pour-votre-llc-ou-ouvrir">quelle banque ou fintech</a> a du sens en compte principal et laquelle en compte secondaire, anticiper ce qui sera déclaré via <a href="/fr/blog/crs-pour-residents-en-espagne-et-latam-implications-reelles">CRS</a> vers votre administration nationale, et concevoir l'ensemble pour que la pièce Wise (ou <a href="/fr/blog/revolut-business-et-crs-ce-qui-est-declare-a-votre-fisc">Revolut Business</a>, ou toute autre) s'intègre sans surprise. Nous le détaillons dans <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">Conception d'une structure fiscale internationale solide</a>.
Si vous n'êtes pas certain de la place de Wise dans votre structure ou si vous craignez un croisement de données que vous ne contrôlez pas, nous le passons en revue avec vous et vous indiquons quoi corriger avant que ce soit l'administration qui impose le tempo.
### En résumé

Wise est une excellente fintech multi-devises, pleinement régulée et pleinement connectée à l'échange automatique d'informations dès lors qu'elle opère sous Wise Europe SA. Ce n'est pas un raccourci pour cacher de l'argent, mais ce n'est pas non plus une caméra qui retransmet chaque mouvement en direct au fisc. Ce qui voyage par CRS, c'est le solde, les revenus et l'identité du titulaire et du bénéficiaire effectif. Ce qui ne voyage pas par défaut, c'est le détail opérationnel, mais il reste parfaitement disponible si l'administration le demande.

La différence entre avoir des problèmes ou ne pas en avoir ne réside pas dans le fait d'utiliser Wise, mais dans la façon dont Wise s'intègre à une structure cohérente avec votre LLC, votre résidence et vos déclarations. C'est cette conversation qui mérite d'être tenue avant, pas après.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

Règle pratique: une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.

Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et documentons chaque étape pour que votre déclaration locale soit défendable en cas de contrôle.

<!-- exentax:legal-refs-v1 -->
## Références légales et réglementaires

Cet article s'appuie sur la réglementation en vigueur à la date de actuellement. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto).
- **Convention Espagne–USA.** BOE du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
- **UE / OCDE.** Directive (UE) 2011/16, modifiée par DAC6 (dispositifs transfrontaliers), DAC7 (Directive (UE) 2021/514, plateformes numériques) et DAC8 (Directive (UE) 2023/2226, crypto-actifs); Directive (UE) 2016/1164 (ATAD: CFC, *exit tax*, dispositifs hybrides); Norme commune de déclaration de l'OCDE (CRS).
- **Cadre international.** Modèle de Convention OCDE, art. 5 (établissement permanent) et Commentaires; Action 5 BEPS (substance économique); Recommandation 24 du GAFI (bénéficiaire effectif).

L'application concrète de ces règles à votre cas dépend de votre résidence fiscale, de l'activité de la LLC et de la documentation conservée. Ce contenu est informatif et ne remplace pas un conseil professionnel personnalisé.<!-- exentax:execution-v2 -->
## L'IBAN belge de Wise pour votre LLC: ce que c'est, ce qu'il reporte et pourquoi le fisc le voit

Quand vous activez la sous-compte EUR de Wise Business, vous recevez un IBAN belge BE. Opérationnellement excellent; fiscalement sous régime CRS belge.

- **Nature de l'IBAN BE.** Wise Europe SA est établissement de crédit autorisé par la BNB. L'IBAN BE est juridiquement compte belge, même si le titulaire est votre LLC US.
- **Données transmises annuellement.** Identification LLC titulaire, UBO, solde 31 décembre, total mouvements bruts annuels, identifiant compte. Pas les transactions individuelles.
- **Croisement avec déclaration en résidence.** France: déclaration de comptes étrangers (3916). Si le fisc reçoit via CRS le solde et vous n'avez pas déclaré, procédure d'imputation.
- **Différence vs sous-compte USD.** USD opéré par Wise USD Inc., reporte via FATCA-IGA. Canal différent, résultat fiscal équivalent.

### Comment déclarer correctement en France

3916 annuel: IBAN BE, banque émettrice (Wise Europe SA Bruxelles), solde. IR: si LLC disregarded, attribution.

### Ce qu'on nous demande le plus

**Si UBO déclaré au KYC est autre, ça va à son fisc?** Oui, CRS reporte à la résidence du UBO réel.

**Puis-je avoir Wise sans activer EUR?** Oui, mais perdez l'avantage principal.

Chez Exentax nous structurons Wise selon besoin et déclarons correctement.
<!-- /exentax:execution-v2 -->

## Nous l'installons sans que vous perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous nous occupons de l'ensemble du processus: constitution, banque, passerelles de paiement, comptabilité, déclarations <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.

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
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Quand%20on%20parle%20de%20Wise%2C%20d'IBAN%20%C3%A9trangers%20et%20de%20LLC%20am%C3%A9ricaines%2C%20deux%20r%C3%A9cits%20a%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Révision éditoriale en attente</strong> — Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…ssive NFE, los datos de los controlling persons (umbral del 25% directo o indirecto, o con…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…servicios cumplen los requisitos de **Active NFE** (más del 50% de los ingresos son operat…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…(declaración de bienes en el extranjero, umbral agregado de 50.000 €) y, en su caso, Model…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…ers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En E…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…n la UE se transpuso a través de la **Directiva 2011/16/UE (DAC2)** y, en Bélgica, mediant…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…*). - **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
