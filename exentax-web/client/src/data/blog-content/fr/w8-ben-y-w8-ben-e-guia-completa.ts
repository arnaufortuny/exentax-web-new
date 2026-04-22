export default `Si vous ou votre LLC recevez de l'argent depuis les États-Unis (Stripe, PayPal, plateformes d'affiliation, AdSense, dividendes, royalties, brokers...), on peut vous demander un **W-8BEN** ou un **W-8BEN-E**. Toutes les plateformes ne l'exigent pas: la banque d'entreprise comme Mercury, Relay ou Wise ne le demande que si une vérification compliance précise l'exige, alors que les brokers comme Interactive Brokers l'imposent dès l'ouverture du compte. Là où il est exigé et que vous ne le remplissez pas (ou mal), le résultat est toujours le même: le payeur américain applique une **retenue de 30 %** sur ce qu'il vous doit, "au cas où". 30 % qu'il est ensuite très difficile de récupérer.

Ce guide est la version complète, en français, sans jargon inutile mais rigoureuse.

## Que sont les W-8 et pourquoi ils existent

Les formulaires de la série **W-8** sont des documents de l'**<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>** (l'administration fiscale américaine) par lesquels une personne ou entité **non américaine** déclare au payeur qu'elle **n'est pas contribuable fiscal aux USA** et, le cas échéant, qu'elle **invoque une convention fiscale** pour réduire ou éliminer la retenue par défaut.

La règle générale aux USA est que tout paiement de source américaine à une personne ou entité étrangère est soumis à une retenue de **30 %** sauf preuve contraire. Cette preuve se fait avec un W-8.

Les plus utilisés:

- **W-8BEN:** pour les **personnes physiques non américaines**.
- **W-8BEN-E:** pour les **entités non américaines** (votre LLC, SL, GmbH…).

Il existe d'autres (W-8ECI, W-8IMY, W-8EXP) pour des cas plus spécifiques.
### Différence clé entre W-8BEN et W-8BEN-E

| | W-8BEN | W-8BEN-E |
|--|--------|----------|
| Qui signe | Personne physique non résidente USA | Entité non américaine |
| Données clés | Nom, pays, adresse, date de naissance, ID fiscal | Raison sociale, pays de constitution, EIN/GIIN, type d'entité, statut FATCA |
| Pages | 1 | 8 (vous n'en remplissez que 2-3) |
| Convention | Oui, Partie II | Oui, Partie III |
| Validité | 3 ans | 3 ans |

Une **Single-Member LLC de non-résident** est un cas intéressant: bien que l'IRS la traite comme Disregarded Entity, **le formulaire présenté est normalement le W-8BEN-E** au nom de la LLC.
## À quoi ils servent en pratique

À **éviter la retenue de 30 %** sur les paiements de source US. La convention entre **les USA et l'Espagne** réduit cette retenue à:

- **0 %** sur la plupart des **bénéfices d'entreprise** (services rendus depuis hors USA sans établissement stable).
- **15 %** sur les **dividendes** d'entreprises américaines (10 % sur participations qualifiées).
- **0 %** sur les **intérêts** en général.
- **0-10 %** sur les **royalties** selon le type.

Sans W-8 signé, le payeur retient 30 %. Avec un W-8 bien fait, vous recevez vos paiements en intégralité (cas le plus courant pour les services).
### Qui doit les présenter

C'est **celui qui reçoit l'argent** qui présente le formulaire:

- Vous comme **personne physique** si vous recevez directement: **W-8BEN**.
- Votre **LLC** ou autre entité si les paiements vont au compte de l'entité: **W-8BEN-E**.
### Quand les présenter

- À l'**ouverture de tout compte** chez une banque, fintech ou broker américain.
- Lors de l'**inscription de votre business** sur une passerelle de paiement.
- Quand un **client US** le demande avant le premier paiement.
- À chaque **renouvellement** tous les 3 ans.
### Où ils sont remis

Contrairement à d'autres formulaires IRS, **le W-8 n'est pas envoyé à l'IRS**. Il est remis au **payeur** qui le conserve. Les plateformes qui l'exigent par défaut: **Interactive Brokers et autres brokers, Stripe, PayPal Business, AdSense, YouTube, Twitch, Amazon KDP, App Store Connect**. À l'inverse, **Mercury, Relay, Slash et Wise Business** ne l'exigent pas pour opérer; ils ne le demandent que si une vérification compliance ponctuelle l'impose.
### Comment remplir un W-8BEN pas à pas (personne physique)

Une page, trois parties.

**Partie I, Identification du bénéficiaire:**

1. **Name of individual:** votre nom complet du passeport.
2. **Country of citizenship:** votre nationalité.
3. **Permanent residence address:** adresse de votre résidence fiscale réelle, pas un PO Box ni adresse aux USA.
4. **Mailing address:** seulement si différente.
5. **US TIN (SSN/ITIN):** seulement si vous en avez. La majorité laisse vide.
6. **Foreign tax identifying number:** votre NIF/NIE.
7. **Reference number:** rare.
8. **Date of birth:** format MM-DD-YYYY.

**Partie II, Convention:**

9. Pays avec lequel vous avez convention: "Spain" si résident espagnol.
10. Détail spécial: seulement pour réclamer un taux réduit spécifique.

**Partie III, Certification:** signez, datez, nom.
## Comment remplir un W-8BEN-E pas à pas (votre LLC)

Plus long (8 pages) mais vous ne remplissez que ce qui s'applique. Pour une **Single-Member LLC de non-résident**:

**Partie I, Identification de l'entité:**

1. **Name of organization:** raison sociale exacte de la LLC.
2. **Country of incorporation:** "United States".
3. **Disregarded entity name:** laissez vide.
4. **Chapter 3 status:** marquez **"Corporation"** si la LLC a fait election; dans la plupart des cas non-résidents avec Single-Member, identifier l'entité et remplir la **Partie III** de la convention. En cas de doute, "Corporation".
5. **Chapter 4 status (FATCA):** marquez **"Active NFFE"** si la LLC facture des services ou vend des produits.
6. **Permanent residence address:** adresse enregistrée de la LLC aux USA.
7. **Mailing address:** facultatif.
8. **US TIN (EIN):** EIN de la LLC.
9. **GIIN:** laissez vide.
10. **Foreign TIN:** ID fiscal du bénéficiaire effectif final.

**Partie III, Convention:** marquez résidence fiscale en **Spain**, indiquez le respect de la **limitation des avantages** (Art. 17), précisez l'article applicable et le taux réduit.

**Partie XXV, Active NFFE:** déclarer que plus de 50 % des revenus sont actifs.

**Partie XXX, Certification:** signature, nom, fonction, date.
### Erreurs courantes qui coûtent cher

1. **Adresse US comme résidence permanente.**
2. **Utiliser W-8BEN au lieu de W-8BEN-E** ou vice versa.
3. **Ne pas signer.**
4. **Oublier le Foreign TIN** quand requis.
5. **Ne pas marquer Chapter 4 status.**
6. **Réclamer un taux de convention non applicable.**
7. **Ne pas renouveler après 3 ans.**
### Validité et renouvellement

Le W-8 signé est valable **3 années calendaires complètes** depuis la signature. En cas de changement de données substantielles, présentez-en un nouveau. Notez le renouvellement.
### Lien avec la convention USA-Espagne

La **Convention entre le Royaume d'Espagne et les USA pour éviter la double imposition**, signée en 1990 et modernisée par le Protocole de 2013 en vigueur depuis 2019, est la base légale:

- **Bénéfices d'entreprise (Art. 7):** sans EP, imposition uniquement en Espagne. **0 % de retenue** pour services rendus hors USA.
- **Dividendes (Art. 10):** 15 % (10 % participations qualifiées).
- **Intérêts (Art. 11):** généralement 0 %.
- **Royalties (Art. 12):** entre 0 % et 10 %.

Pour comprendre comment cela s'applique à votre LLC, lisez aussi notre <a href="/fr/blog/convention-fiscale-usa-espagne-appliquee-aux-llc">guide sur la convention USA-Espagne appliquée aux LLC</a>.
### Cas pratiques par plateforme

- **Stripe:** W-8BEN-E intégré. Résultat: 0 % retenue sur services.
- **PayPal Business:** lors de la vérification du compte business.
- **Mercury / Relay / Slash:** **pas exigé** lors de l'onboarding standard de votre LLC. Uniquement demandé si une vérification compliance ponctuelle l'impose; sinon, vous n'avez pas besoin d'en signer un pour opérer.
- **Wise Business:** même critère que Mercury / Relay: uniquement si on vous le demande expressément.
- **Interactive Brokers:** applique 15 % sur dividendes US au lieu de 30 %.
- **AdSense / YouTube / Amazon KDP / App Store / Twitch:** assistant propre.
## Comment Exentax vous aide

Chez Exentax nous préparons les W-8BEN-E de votre LLC là où ils sont réellement requis: Stripe, IBKR et autres brokers, plateformes d'affiliation, AdSense / YouTube / Amazon KDP et tout payeur US qui en demande un. Pour Mercury, Relay, Slash ou Wise nous ne signons un W-8 que si la plateforme le demande expressément. Si une retenue de 30 % a déjà été appliquée, nous évaluons s'il est viable de demander le remboursement via 1042-S, mais il est toujours beaucoup moins cher de bien faire dès le départ.

> Chaque cas est individuel et la législation fiscale peut changer; ces formulaires et critères FATCA sont mis à jour périodiquement.

Si vous voulez que nous examinions votre situation, réservez votre consultation gratuite avec Exentax.

Pour aller plus loin, lisez aussi <a href="/fr/blog/les-comptes-bancaires-americains-rapportent-ils-a-votre">Les comptes bancaires aux USA reportent-ils au fisc espagnol?</a> et <a href="/fr/blog/llc-comme-alternative-au-statut-dautonomo-en-espagne">LLC comme alternative au statut d'autónomo en Espagne</a>.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

Règle pratique: une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.

<!-- exentax:calc-cta-v1 -->
> **Mettez des chiffres sur votre cas.** Le <a href="/fr#calculadora">simulateur fiscal Exentax</a> compare votre charge fiscale actuelle à celle que vous paieriez en exploitant une LLC américaine correctement déclarée dans votre pays de résidence.
<!-- /exentax:calc-cta-v1 -->

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

Les obligations FinCEN et IRS ont bougé en recent years; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act.** Après la **interim final rule de FinCEN de mars 2025**, l'obligation de déposer le BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées hors des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US par un non-résident est, à ce jour, hors de cette obligation**. Le statut peut encore évoluer: **re-vérifier sur FinCEN.gov au moment du dépôt**. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé et surveillez les mises à jour.
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## Conformité fiscale dans votre pays: SEC, TFI et attribution de revenus

Ce qui suit est la vision opérationnelle, pas celle des manuels. Nous avons exécuté ce schéma assez souvent pour savoir quelles variables cèdent en premier sous l'examen d'une administration fiscale ou d'une compliance bancaire, et c'est dans cet ordre que nous les traitons.

## Faits juridiques et de procédure

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

<!-- exentax:execution-v2 -->
## W-8BEN et W-8BEN-E: guide complet pour ne pas les confondre et ne pas payer 30% par erreur

Le W-8 est le document le plus important pour un non-résident avec tout payer US. Sans lui, retenue 30% par défaut.

- **W-8BEN: pour personnes physiques.** Vous signez en tant que personne. Utile pour royalties, intérêts, dividendes US-source. 3 ans de validité.
- **W-8BEN-E: pour entités, votre LLC.** Signé par signataire autorisé. Identifie LLC, classification FATCA (single-member disregarded = point critique), beneficial owner, treaty claim. 3 ans.
- **Erreur la plus commune: marquer Corporation au lieu de disregarded.** Single-member LLC sans élection C/S-Corp est « disregarded entity ». Si vous marquez Corporation par erreur, retenue 30% au lieu de 15% (France-US dividendes) ou 0%.
- **Treaty benefits.** Part III: pays de résidence avec certificat, citer article du traité (Article 10 dividendes, Article 11 intérêts).

### Ce qu'on nous demande le plus

**Dois-je envoyer W-8BEN-E à l'IRS?** Non. Au payer, pas à l'IRS.

**LLC disregarded: qui réclame le traité?** Le beneficial owner selon son pays.

Chez Exentax nous préparons les W-8BEN-E corrects.
<!-- /exentax:execution-v2 -->

## Parlons de votre structure

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Si%20vous%20ou%20votre%20LLC%20recevez%20de%20l'argent%20depuis%20les%20%C3%89tats-Unis%20(Stripe%2C%20PayPa%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Révision éditoriale en attente</strong> — Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">30%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…mo: el pagador estadounidense te aplica una **retención del 30%** sobre lo que te debe, &quot;p…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">0%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…entes con muchos otros países) reduce esa retención a: - **0%** sobre la mayoría de **rent…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">15%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…desde fuera de EE.UU. sin establecimiento permanente). - **15%** sobre **dividendos** de e…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">10%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…- **15%** sobre **dividendos** de empresas estadounidenses (10% en algunos casos). - **0%*…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…arte XXV, Active NFFE:** una casilla declarando que más del 50% de tus ingresos son activo…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
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
