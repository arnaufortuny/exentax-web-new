export default `Quand quelqu'un voit pour la première fois la combinaison "LLC aux États-Unis" et "résident fiscal en Espagne", la question immédiate est toujours la même: **"alors où est-ce que je paie mes impôts?"**. La réponse est claire: **en Espagne**, sur le bénéfice net, grâce à la **convention fiscale entre les USA et l'Espagne**. La LLC n'est pas utilisée pour "ne pas payer", elle est utilisée pour **ne pas payer deux fois** et pour optimiser dans le cadre légal.

Ce guide explique la convention pas à pas, en langage clair, appliqué au cas concret d'une LLC de non-résident avec propriétaire résident en Espagne.

## Ce que c'est et pourquoi elle existe

Une **convention fiscale (CDI)** est un accord bilatéral entre deux pays pour répartir le droit d'imposer les revenus transfrontaliers et éviter qu'un même revenu soit imposé deux fois. Sans convention, vous paieriez aux USA (parce que la LLC y est) **et** à nouveau en Espagne (parce que vous y résidez).

Pour l'éviter, les USA et l'Espagne ont signé en **1990** une Convention pour éviter la double imposition, modernisée par un **Protocole signé en 2013** entré en vigueur le **27 novembre 2019** (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> du 23 octobre 2019). Ce protocole a actualisé les taux de retenue, l'échange d'informations et les clauses anti-abus.

Articles clés pour une LLC avec propriétaire espagnol:

- **Art. 4, Résidence fiscale.**
- **Art. 5, Établissement stable.**
- **Art. 7, Bénéfices d'entreprise.**
- **Art. 10, Dividendes.**
- **Art. 11, Intérêts.**
- **Art. 12, Redevances (royalties).**
- **Art. 17, Limitation des avantages.**
- **Art. 24, Méthodes pour éliminer la double imposition.**
### Comment ça fonctionne pour les LLC disregarded entity

Une **Single-Member LLC** de non-résident est par défaut **Disregarded Entity**: pour l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> elle n'existe pas comme contribuable séparé. Ses revenus et dépenses s'imputent directement à son unique membre. **Pass-through taxation**.

Pour la convention:

- La LLC **n'est pas résidente fiscale aux USA**.
- Celui qu'on analyse est **le membre**: s'il réside en Espagne, la convention s'applique au membre résident espagnol.
- Les bénéfices nets de la LLC sont imposés **en Espagne** selon l'IRPF du membre.
- Aux USA la LLC ne remplit que des obligations déclaratives (Form 5472 + 1120 pro forma, BOI Report) si elle n'a pas d'**ECI**.

La **<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>** a confirmé cette approche dans des consultations contraignantes comme la **V0290-20**, qualifiant la LLC américaine d'entité transparente ou en régime d'attribution de revenus pour l'Espagne.
### Où on paie réellement les impôts

Pour le cas typique d'une LLC de services sans établissement stable aux USA et propriétaire résident espagnol:

- **Aux USA: 0 % fédéral, 0 % d'État** (en NM/WY/DE pour LLC sans activité locale). Uniquement coûts de maintenance.
- **En Espagne: IRPF sur le bénéfice net** de la LLC, intégré à la déclaration annuelle comme revenus d'activité économique en régime d'attribution, selon le marginal personnel (19 % à 47 %).

Vous **payez en Espagne, mais mieux**: sur le bénéfice net après déductions larges, sans cotisation mensuelle des autónomos, sans acomptes trimestriels propres à l'autónomo.
### Types de revenus couverts par la convention

| Type de revenu | Sans convention (USA) | Avec convention USA-Espagne |
|----------------|----------------------|------------------------------|
| Services rendus hors USA | 30 % retenue | 0 % (Art. 7, sans EP) |
| Royalties | 30 % | 0-10 % selon type (Art. 12) |
| Dividendes d'entreprises USA | 30 % | 15 % / 10 % qualifiées (Art. 10) |
| Intérêts bancaires | 30 % | 0 % généralement (Art. 11) |
| Plus-values sur actions USA | 30 % / variable | Imposition principale en Espagne (Art. 13) |
| Pensions | 30 % | Règles spécifiques (Art. 20) |
### Certificat de résidence fiscale espagnole

Pour activer la convention devant le payeur américain, vous devez prouver que vous êtes **résident fiscal en Espagne**. L'AEAT émet un **certificat de résidence fiscale aux fins de la convention** par le siège électronique. Validité **un an**. À garder à jour, surtout avec brokers ou payeurs appliquant des retenues complexes.

Sur la plupart des encaissements via Stripe, PayPal, AdSense, ils ne le demandent pas activement car le W-8BEN-E fait le travail. Mais devant un contrôle ou un broker comme Interactive Brokers, c'est la preuve dure.
### Formulaires nécessaires

- **W-8BEN-E:** présenté par votre LLC à chaque payeur USA. Voir notre <a href="/fr/blog/w8-ben-et-w8-ben-e-le-guide-complet">guide complet W-8BEN et W-8BEN-E</a>.
- **W-8BEN:** pour personnes physiques non résidentes.
- **Form 1042-S:** émis par le payeur US si retenue appliquée.
- **Form 5472 + Form 1120 pro forma:** déclaration annuelle de la LLC à l'IRS.
- **BOI Report:** au <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.
- **Modelo 100 (IRPF):** déclaration annuelle en Espagne.
- **Modelo 720/721:** si dépassement de 50 000 € en comptes/valeurs/cryptos à l'étranger.
- **Certificat de résidence fiscale.**
## Cas pratiques avec chiffres

### Cas A, Consultant logiciel avec clients USA et UE

- LLC facture **120 000 USD/an** pour services depuis l'Espagne.
- Dépenses LLC: 30 000 USD.
- Bénéfice net: 90 000 USD ≈ 82 000 €.
- USA: **0 %** retenue. Maintenance ≈ 2 000 €.
- Espagne: IRPF effectif environ 35-40 % sur 82 000 € ≈ 25 000-28 000 €.
- **Total fiscal:** 27 000-30 000 € contre 38 000-45 000 € pour un autónomo équivalent.

### Cas B, Trader/investisseur avec dividendes USA via LLC

- LLC titulaire d'un compte Interactive Brokers.
- Dividendes US: 10 000 USD/an.
- Sans convention: 30 % → 3 000 USD à l'IRS.
- Avec W-8BEN-E + convention: 15 % → 1 500 USD à l'IRS.
- En Espagne: inclure dans la base d'épargne et appliquer la **déduction pour double imposition internationale** (Art. 80 LIRPF).

### Cas C, Royalty pour logiciel vendu aux USA

- LLC vend des licences à entreprises USA: 50 000 USD/an.
- Si qualifié comme royalty (Art. 12): retenue peut être **5 %**.
- Si qualifié comme service/vente de copie: Art. 7 → **0 %**.
### Retenues à la source et comment les récupérer

Si vous subissez des retenues aux USA:

1. **Réclamation directe au payeur** si erreur dans l'année fiscale.
2. **Demande de remboursement à l'IRS:** via **Form 1040-NR** ou procédures associées au **1042-S**. Lent (12-18 mois).

En Espagne, retenues effectivement payées aux USA dans la limite de la convention se compensent via la **déduction pour double imposition internationale (DDII)** de l'IRPF.
### Déclaration en Espagne: Modelo 100

Dans la **déclaration annuelle (Modelo 100)** vous intégrez les bénéfices nets de la LLC comme **revenus d'activité économique** en régime d'attribution:

1. Convertir USD en EUR avec taux moyen annuel ou du moment du paiement, critère cohérent.
2. Calculer revenus totaux et dépenses déductibles.
3. Imputer le bénéfice net.
4. Appliquer la **déduction pour double imposition internationale**.
5. Présenter **modelo 720/721** si dépassement.
6. Conserver toute la documentation.
### Pourquoi vous avez besoin d'un conseiller fiscal espagnol

Une LLC bien constituée aux USA n'est que la moitié du travail. L'autre moitié est de **l'intégrer correctement à votre IRPF espagnol**:

- Qualifier correctement le revenu.
- Appliquer la convention et la déduction.
- Choisir la méthode d'imputation.
- Respecter modelos 720/721.
- Documenter les dépenses déductibles.

Un conseiller fiscal espagnol qui comprend les structures internationales avec LLC est **partie du setup complet**. Chez Exentax nous couvrons le côté USA et coordonnons avec votre conseiller espagnol, ou nous en recommandons un.

> Chaque cas est individuel. Les positions de la DGT peuvent évoluer et les protocoles de la convention sont actualisés périodiquement. Ce guide est informatif, il ne remplace pas l'analyse personnalisée par un professionnel qualifié.
### En résumé

- USA et Espagne ont une convention signée en 1990 et modernisée en 2019.
- Pour une LLC disregarded entity avec propriétaire résident espagnol, les bénéfices d'entreprise sont imposés **en Espagne**, sans retenue aux USA s'il n'y a pas d'EP.
- Dividendes, intérêts et royalties ont des taux réduits.
- Le **W-8BEN-E** est l'outil opérationnel.
- Les retenues USA se compensent en Espagne via déduction.
- Setup complet: **Exentax + conseiller fiscal espagnol**.

Si vous voulez revoir votre cas avec des chiffres concrets, **réservez une consultation gratuite de 30 minutes** avec Exentax.

Pour aller plus loin, lisez aussi <a href="/fr/blog/llc-comme-alternative-au-statut-dautonomo-en-espagne">LLC comme alternative au statut d'autónomo en Espagne</a> et <a href="/fr/blog/w8-ben-et-w8-ben-e-le-guide-complet">Guide complet des formulaires W8-BEN et W8-BEN-E</a>.
## Conformité fiscale dans votre pays: CFC, transparence fiscale et attribution des revenus

Une LLC américaine est un outil légal reconnu internationalement. Mais la conformité ne s'arrête pas à la constitution: en tant que propriétaire résident fiscal d'un autre pays, votre administration locale conserve le droit d'imposer ce que la LLC génère. L'essentiel est de savoir **sous quel régime**.

### Par juridiction

- **Espagne (LIRPF/LIS).** Si la LLC est une *Single-Member Disregarded Entity* opérationnelle (services réels, sans passivité significative), le fisc la traite généralement par **attribution de revenus (art. 87 LIRPF)**: les bénéfices nets sont attribués à l'associé l'année où ils naissent et intégrés dans la base générale de l'IRPF. Si la LLC opte pour la fiscalité de *corporation* (Form 8832) et qu'elle est contrôlée par un résident espagnol avec des revenus majoritairement passifs, le **régime de transparence fiscale internationale (art. 91 LIRPF pour les personnes physiques, art. 100 LIS pour les sociétés)** peut s'appliquer. Le choix n'est pas optionnel: il dépend de la substance économique, pas du nom.
- **Déclarations informatives.** Comptes bancaires américains avec solde moyen ou final >50 000 €: **Modelo 720** (Loi 5/2022 après l'arrêt CJUE C-788/19 du 27/01/2022, sanctions désormais dans le régime général LGT). Opérations liées avec la LLC et dividendes rapatriés: **Modelo 232**. Crypto-actifs en garde aux États-Unis: **Modelo 721**.
- **Convention Espagne–États-Unis.** La convention (BOE 22/12/1990, Protocole en vigueur 27/11/2019) régit la double imposition sur dividendes, intérêts et redevances. Une LLC sans établissement permanent en Espagne ne crée pas en soi un EP de l'associé, mais la direction effective peut le faire si toute la gestion est conduite depuis le territoire espagnol.
- **Mexique, Colombie, Argentine et autres LATAM.** Chaque juridiction a son propre régime CFC (Mexique: Refipres; Argentine: revenus passifs étrangers; Chili: art. 41 G LIR). Principe commun: ce que la LLC retient comme bénéfice est considéré comme perçu par l'associé si l'entité est jugée transparente ou contrôlée.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Règle pratique: une LLC opérationnelle, avec substance, correctement déclarée dans la résidence, c'est de la **planification fiscale légitime**. Une LLC utilisée pour cacher des revenus, simuler une non-résidence ou déplacer des revenus passifs sans justification économique tombe dans le champ de l'**art. 15 LGT (abus de droit)** ou, au pire, de l'**art. 16 LGT (simulation)**. Ce sont les faits qui décident, pas le papier.
Chez Exentax, nous montons la structure pour qu'elle s'inscrive dans le premier scénario et documentons chaque étape pour que votre déclaration locale soit défendable en cas de contrôle.

<!-- exentax:legal-facts-v1 -->
## Faits légaux & de procédure

Les obligations FinCEN et IRS ont bougé en recent years; voici la version en vigueur:

### Points clés

- **BOI / Corporate Transparency Act : votre LLC n'est PAS soumise (un avantage concurrentiel).** Après l'**interim final rule de FinCEN de mars 2025**, l'obligation du BOI Report a été **restreinte aux « foreign reporting companies »** (entités constituées HORS des États-Unis et enregistrées pour exercer dans un État). Une **LLC formée aux US détenue par un non-résident NE dépose PAS le BOI Report** : une formalité en moins au calendrier, moins de paperasse et une structure plus propre que jamais. Si votre LLC a été constituée avant mars 2025 et que vous avez déjà déposé le BOI, conservez l'accusé. Le statut peut évoluer : **nous surveillons FinCEN.gov à chaque dépôt** et, si l'obligation revient, nous la gérons sans frais supplémentaires. Statut actuel vérifiable sur [fincen.gov/boi](https://www.fincen.gov/boi).
- **Form 5472 + 1120 pro-forma.** Pour une **Single-Member LLC détenue par un non-résident**, les règlements finals de Treas. Reg. §1.6038A-1 (en vigueur depuis 2017) traitent la LLC comme une corporation pour le 5472. Procédure: **Form 1120 pro-forma** (en-tête uniquement: nom, adresse, EIN, exercice) avec **Form 5472 annexé**. Dépôt **par courrier certifié ou fax à l'IRS Service Center d'Ogden, Utah**, **pas d'e-file via MeF standard**. Échéance: **15 avril**; prorogation via **Form 7004** jusqu'au **15 octobre**. **Sanction: 25 000 USD par formulaire et par an, plus 25 000 USD par tranche supplémentaire de 30 jours** de non-dépôt après notification IRS.
- **Form 1120 substantif.** Ne s'applique que si la LLC a effectué une *check-the-box election* vers C-Corp (Form 8832): elle est alors taxée à 21 % au niveau fédéral et dépose un 1120 chiffré. Une LLC disregarded standard **ne dépose pas de 1120 substantif et ne paye pas l'impôt fédéral sur les sociétés**.
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.
## En résumé

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.

## Conformité fiscale dans votre pays: SEC, TFI et attribution de revenus

Ce qui suit est la vision opérationnelle, pas celle des manuels. Nous avons exécuté ce schéma assez souvent pour savoir quelles variables cèdent en premier sous l'examen d'une administration fiscale ou d'une compliance bancaire, et c'est dans cet ordre que nous les traitons.

## Faits bancaires et fiscaux à préciser

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

## Faits juridiques et de procédure

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

## Références: cadre juridique et réglementation

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.

## Parlons de votre structure

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.
## Ce qu'il est et pourquoi il existe

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.

<!-- exentax:execution-v2 -->
## Comment la convention USA-Espagne s'applique à votre LLC, clause par clause

La convention entre l'Espagne et les États-Unis signée en 1990 et modifiée par le Protocole en vigueur depuis 2019 (BOE 23 octobre 2019) répartit le pouvoir d'imposition entre les deux pays. Pour une SMLLC en attribution de revenus, quatre articles importent vraiment. Nous les expliquons par ordre d'impact.

- **Article 7 - Bénéfices d'entreprise.** Si la LLC est transparente et ne constitue pas un établissement stable américain, les bénéfices sont imposés exclusivement en Espagne, à votre IRPF comme revenu d'activité économique. C'est la logique qui fait qu'une SMLLC paie typiquement zéro impôt fédéral et que tout le poids repose sur la résidence.
- **Article 14 (Protocole 2019) - Services personnels indépendants.** Renforcé après le Protocole: pour les professionnels indépendants résidents en Espagne sans base fixe aux États-Unis, les honoraires sont imposés exclusivement en Espagne. Combiné à l'art. 7, il blinde l'opérationnel habituel du consultant ou développeur.
- **Article 23 - Élimination de la double imposition.** Permet d'imputer en Espagne l'impôt payé aux États-Unis (fédéral et étatique), plafonné au montant espagnol sur le même revenu. Pour une SMLLC avec zéro impôt fédéral, le crédit est nul mais la double imposition réelle aussi.
- **Article 25 (Protocole 2019) - Procédure amiable (MAP).** Si AEAT et IRS qualifient le même revenu de manière divergente, le MAP permet une résolution par accord entre administrations en environ 24 mois. Utile en cas de redressement divergent; la plupart des cas n'y arrivent pas, la doctrine DGT étant claire.

### Ce qu'on nous demande le plus

**Ai-je besoin du Form W-8BEN-E pour ma LLC?** Oui, quand un client américain demande la certification de non-résidence. La SMLLC avec associé non-résident certifie comme pass-through et l'associé joint un W-8BEN personnel. Sans cette documentation, les payeurs US retiennent 30 % par défaut.

**La convention couvre-t-elle dividendes et plus-values?** Oui, avec des plafonds différents (15 % dividendes, 0-21 % intérêts selon les cas, plus-values généralement imposées uniquement en résidence). Pour une SMLLC distribuant à l'associé, le "dividende" est ignoré par transparence et tout est imputé comme bénéfice d'entreprise art. 7.

Chez Exentax nous mappons chaque flux de votre LLC contre l'article applicable de la convention, préparons la documentation W-8 et concevons l'imputation en IRPF pour que la déclaration espagnole soit cohérente avec le traitement fédéral.
<!-- /exentax:execution-v2 -->

## Comment cela fonctionne pour les LLC disregarded entity

Ce qui suit est la vision opérationnelle, pas celle des manuels. Nous avons exécuté ce schéma assez souvent pour savoir quelles variables cèdent en premier sous l'examen d'une administration fiscale ou d'une compliance bancaire, et c'est dans cet ordre que nous les traitons.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Quand%20quelqu'un%20voit%20pour%20la%20premi%C3%A8re%20fois%20la%20combinaison%20LLC%20aux%20%C3%89tats-Unis%20%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->
`;
