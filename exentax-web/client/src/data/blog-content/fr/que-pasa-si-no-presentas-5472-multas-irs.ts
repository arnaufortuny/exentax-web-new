export default `Il existe une déclaration dans la vie fiscale d'une LLC unipersonnelle à associé étranger qui sépare nettement ceux qui la gèrent bien de ceux qui marchent vers un problème à cinq chiffres: le **Form 5472**. Ce n'est pas un impôt. C'est une déclaration informative. Et précisément parce qu'elle est "seulement informative", beaucoup l'ignorent, la déposent en retard, la déposent avec des données cassées ou ne savent même pas qu'elle existe. L'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> pardonne rarement cet oubli: la sanction de base est de **25 000 USD par formulaire non déposé, par année**, et elle se cumule.

Cet article n'est pas le guide pas-à-pas du dépôt (vous avez déjà notre <a href="/fr/blog/form-5472-quest-ce-que-cest-qui-doit-le-deposer-et-comment">guide complet du Form 5472</a> et l'analyse sur <a href="/fr/blog/irs-1120-et-5472-ce-que-cest-vraiment-et-quand-ca-sapplique">quand le 1120 et le 5472 s'appliquent réellement</a>). C'est ce qui se passe **quand vous ne l'avez pas déposé**, et comment en sortir sans détruire la LLC ni votre situation personnelle.

## Ce que l'IRS sanctionne exactement

La règle vit dans la **section 6038A(d) de l'Internal Revenue Code**, renforcée en 2017 par le Tax Cuts and Jobs Act. La base actuelle est de **25 000 USD par formulaire non déposé, déposé en retard ou substantiellement incomplet**. Jusqu'en 2018 la sanction était de 10 000 USD; depuis, elle est fixée à 25 000 USD et, sauf changement législatif, c'est le chiffre auquel vous vous heurterez.

À cette base s'ajoutent trois éléments que la plupart ne voient pas venir:

1. **Sanction de persistance.** Si l'IRS vous notifie formellement le défaut et que vous ne régularisez pas dans les **90 jours**, **25 000 USD supplémentaires** s'appliquent **tous les 30 jours** (ou fraction) supplémentaires. Pas de plafond publié: on a vu des dossiers réels à six chiffres.
2. **Une sanction par année, pas une seule.** Trois années non déposées = trois formulaires. Trois × 25 000 = **75 000 USD** avant intérêts.
3. **Cascade avec le Form 1120.** Votre LLC unipersonnelle à associé étranger doit déposer **Form 1120 pro forma + Form 5472 ensemble**. Si vous avez raté le 5472, vous avez presque toujours raté le 1120, ce qui ajoute une exposition additionnelle pour late filing du 1120 sous §6651, bien que la sanction monétaire du §6651 se calcule sur l'impôt dû, donc sur une LLC pro forma sans tax due le montant est généralement nul ou résiduel; le risque principal reste le 5472.

Ajoutez les **intérêts sur les sanctions** depuis la date d'exigibilité, calculés par l'IRS au federal short-term rate + 3 points, mis à jour chaque trimestre.
## Comment l'IRS le sait

La question presque universelle en premier rendez-vous: *"comment l'IRS peut-il savoir que j'existe si je n'ai jamais rien déposé?"*. Réponse courte: **il le sait, et c'est plus facile chaque année**. Les cinq canaux concrets actuellement:

- **EIN sous contrôle.** Si vous avez demandé un EIN, vous êtes dans leurs systèmes. L'IRS croise périodiquement les EIN actifs avec les déclarations reçues. Une LLC unipersonnelle avec EIN actif et sans 1120/5472 année après année apparaît comme **non-filer** dans leurs listes.
- **Banques américaines et reporting de tiers.** Mercury, Brex, Wise USD, Relay et similaires appliquent KYC sur la LLC, conservent des informations client accessibles à l'IRS et, selon le flux et le type de client, peuvent générer du reporting de tiers (Form 1099, retenues, FATCA quand applicable). Une LLC opérationnelle qui bouge des fonds sans rien déposer est le profil qui déclenche les révisions.
- **BOI Report (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).** Sous le régime <a href="/fr/blog/boi-report-2026-guide-complet-pour-le-depot-fincen">BOI Report</a> en vigueur, FinCEN a la propriété effective cartographiée pour les LLC concernées, et le cadre prévoit le partage de données avec l'IRS sous réserve des règles d'accès applicables (régime sujet à évolution réglementaire).
- **CRS et DAC à l'envers.** Quand votre pays de résidence reçoit l'information sur les comptes liés à la LLC et que l'IRS demande à auditer, le croisement se fait tout seul. Certaines juridictions le font déjà d'office.
- **Vos propres contreparties.** Quand un fournisseur US émet un Form 1099 à votre LLC, ou qu'une contrepartie déclare une reportable transaction, votre LLC apparaît dans le système IRS sans rien faire de votre côté.

L'idée "comme je n'ai rien déposé, ils ne me voient pas" a été affaiblie par les renforcements de 2017 et, sous le régime BOI en vigueur, devient pratiquement intenable. La bonne baseline est de supposer que l'IRS peut ouvrir un examen à tout moment et de concevoir votre plan en conséquence.
## Les trois profils typiques du retardataire

En pratique, les situations qu'on voit chez Exentax sont trois, et chacune se gère différemment:

### Profil A: jamais déposé le 5472

Vous avez la LLC depuis deux, trois, cinq ans. Vous avez un EIN, un compte bancaire, vous avez facturé. Mais vous n'avez jamais touché le 1120 ni le 5472 parce que "quelqu'un vous a dit que la LLC ne paie pas d'impôt". Exposition potentielle: **25 000 USD × nombre d'années non déposées**, plus possible late filing du 1120, plus intérêts.

### Profil B: déposé en retard

Vous vous êtes rendu compte, vous avez déposé en retard, mais **avant que l'IRS ne vous notifie formellement**. Ici s'ouvre le débat sur la late-filing penalty du 5472: officiellement toujours 25 000 USD, mais la pratique consolidée est que **le dépôt tardif spontané avec reasonable cause** ouvre la porte à un **abatement**. C'est là qu'on clôt le plus de dossiers à zéro.

### Profil C: déposé mais mal

Vous avez déposé le 1120 et le 5472 mais avec des données substantiellement incomplètes: une **reportable transaction** manquante, un mauvais TIN sur le foreign related party, un prêt associé-LLC non déclaré, un capital contribution oublié. La règle 6038A(d) est stricte: une **déclaration substantiellement incomplète équivaut à pas de déclaration**, même sanction. Bonne nouvelle: la correction amiable avec explication écrite se résout en général mieux que les deux précédentes.
### Ce qu'est vraiment une "reportable transaction"

C'est la cause numéro un de 5472 techniquement mal déposés. Une **reportable transaction** est tout mouvement monétaire ou non monétaire entre la LLC et son foreign related party (vous, dans la plupart des cas), y compris des choses qu'on n'associe pas à "transaction":

- Apports de capital de l'associé à la LLC.
- Prêts de l'associé à la LLC et de la LLC à l'associé (oui, les deux sens).
- Distributions de la LLC à l'associé.
- Paiements pour services, royalties, intérêts.
- Mise à disposition d'actifs (y compris logiciel, marques, domaines).
- Remboursements de frais quand l'associé paie personnellement et se fait rembourser.
- Toute écriture comptable représentant un droit ou une obligation entre LLC et associé.

Quand quelqu'un me dit "je n'ai pas eu de transactions avec ma LLC", il y a en général **cinq ou six reportable transactions non documentées**. C'est exactement le Profil C.
## Le cycle réel d'une notification IRS

Il faut cartographier ce qui se passe quand la machine s'active, parce que chaque étape a ses propres délais et options:

1. **CP15 / CP215 (notice of penalty).** Notification de la sanction initiale de 25 000 USD par formulaire.
2. **Délai de réponse (~30 jours).** Vous décidez de payer, demander un abatement pour reasonable cause, contester le calcul ou escalader à l'Office of Appeals.
3. **Examen élargi.** Si la réponse ne convainc pas, l'IRS ouvre généralement un examen sur années additionnelles. D'une sanction on passe à trois.
4. **90 jours après notification formelle.** Si le formulaire n'est pas déposé et la situation non résolue, l'horloge des **25 000 USD par 30 jours additionnels** démarre.
5. **Liquidation finale + intérêts.** Une fois fixée, intérêts jusqu'au paiement.

Qui est passé par là sait que le moment décisif est **le délai de l'étape 2**. Une réponse bien construite à ce moment fait la différence entre clore à zéro et traîner six chiffres pendant des années.
## Reasonable cause: ce qui marche vraiment

L'IRS prévoit une **reasonable cause exception** sous 6038A. Pas de magie: une doctrine avec critères. Ce qui **marche** typiquement:

- Démontrer que vous avez agi avec **diligence ordinaire** et que l'erreur vient d'une cause raisonnable, pas de la négligence.
- Produire la correspondance avec des conseillers antérieurs qui vous ont assuré qu'il n'y avait pas d'obligation.
- Démontrer que dès que vous avez su l'obligation, **vous avez régularisé immédiatement**.
- Montrer que l'information était disponible et que vous avez déposé des déclarations correctes et complètes en régularisant.

Ce qui **ne marche pas** (et beaucoup essaient):

- "Je ne savais pas que le 5472 existait." Insuffisant.
- "Ma banque / Stripe / mon expert-comptable ne me l'a pas dit." Insuffisant.
- "La LLC n'a pas eu d'activité notable." S'il y a eu la moindre reportable transaction, peu importe.
- Demander l'abatement **après** une régularisation incomplète ou erronée.

C'est ici qu'un écrit professionnel, structuré formellement, avec références à l'IRM 20.1.9 et au regulation §1.6038A-4, fait la différence.
### Streamlined non, mais il y a des voies

Beaucoup confondent les **Streamlined Filing Compliance Procedures** (programme pour **US persons avec comptes étrangers non déclarés**) avec un Form 5472 raté. **Ce n'est pas la même chose et ça ne s'applique pas.** Ce qui s'applique au 5472, ce sont trois voies réelles:

- **Delinquent international information return submission.** Procédure standard pour déposer en retard avec reasonable cause. Voie habituelle des Profils A et B.
- **Voluntary Disclosure Practice.** Seulement en cas de **conduite délibérée** ou risque pénal. Pas la norme pour une LLC unipersonnelle.
- **Quiet disclosure.** Déposer en retard sans explication. Techniquement possible, pratiquement déconseillé: l'IRS le traite comme du late filing pur et applique la sanction.

La différence entre la bonne route et l'aveuglement: littéralement des dizaines de milliers de dollars.
## Le plan de régularisation pas à pas

Quand un client arrive avec un 5472 raté, l'ordre de travail est toujours le même:

1. **Inventaire réel**: combien d'années, quelles reportable transactions par année, quelle documentation bancaire et comptable existe, BOI déposé, 1120 déposé, déclarations dans le pays de résidence.
2. **Reconstruction des reportable transactions** année par année, y compris apports, prêts et distributions.
3. **Préparation du paquet**: 1120 pro forma de chaque année en attente + 5472 de chaque année en attente + reasonable cause statement détaillé.
4. **Envoi par courrier recommandé** (ces paquets ne se font pas en e-file; adresse opérationnelle: Service Center d'Ogden).
5. **Plan de réponse anticipé** pour la sanction initiale: brouillon de réponse et délais préparés avant même que l'avis n'arrive.
6. **Nettoyage des adjacents**: <a href="/fr/blog/boi-report-2026-guide-complet-pour-le-depot-fincen">BOI</a>, situation bancaire, déclarations dans votre pays et surtout <a href="/fr/blog/jai-une-llc-est-ce-que-je-la-gere-correctement-checklist">la checklist annuelle</a> pour que ça ne recommence pas.

Fait dans cet ordre, dans de nombreux cas le résultat réaliste est **sanction nulle ou résiduelle**, mais cela dépend des faits, de la documentation et de la réponse de l'agent IRS. Mal fait: cinq chiffres et examen élargi.
### Erreurs qui multiplient la facture

Pour finir sur le concret, ce sont les erreurs que chez Exentax on voit se répéter mois après mois et qui **multiplient le coût**:

- Déposer le 5472 sans le 1120 pro forma associé. Invalide.
- E-filer le 5472: sauf cas étroits, il part par courrier signé.
- Reasonable cause générique copié d'internet. L'IRS les classe en rejet.
- Déposer seulement les dernières années "pour rester discret". Si l'obligation existait avant, la sanction est vivante.
- Fermer la LLC en pensant effacer l'obligation. **Elle ne s'efface pas**: la sanction survit à la dissolution jusqu'à prescription.
- Changer de Registered Agent ou d'adresse sans actualiser l'IRS. Les avis se perdent et les délais courent.
- Croire que votre pays de résidence vous protège. La sanction est de l'IRS contre la LLC; aucune convention bilatérale ne l'efface.

---
### Conclusion et étape suivante

Le Form 5472 est un des rares cas où le coût de **ne rien faire** est géométriquement supérieur au coût de bien faire. La base de 25 000 USD par année ne se discute pas; ce qui se discute, c'est **comment vous régularisez, dans quel ordre, avec quelle argumentation et quels risques collatéraux vous fermez en même temps**.

<!-- exentax:calc-cta-v1 -->
> **Mettez des chiffres sur votre cas.** Le <a href="/fr#calculadora">simulateur fiscal Exentax</a> compare votre charge fiscale actuelle à celle que vous paieriez en exploitant une LLC américaine correctement déclarée dans votre pays de résidence.
<!-- /exentax:calc-cta-v1 -->

Si vous avez une LLC et pensez être dans un des trois profils, jamais déposé, déposé tard, déposé mal, la chose raisonnable est de **cartographier la situation avec des chiffres réels avant que l'IRS ne le fasse**. En consultation gratuite de 30 minutes, on revoit ça avec vous, on vous dit dans quel profil vous êtes, quelle est l'exposition et quelle voie de régularisation est réaliste. C'est le geste le moins cher que vous pouvez faire aujourd'hui sur ce sujet.
## Références légales et réglementaires

Cet article s'appuie sur la réglementation en vigueur à la date de actuellement. Sources principales pour vérification:

- **États-Unis.** Treas. Reg. §301.7701-3 (classification d'entité / *check-the-box*); IRC §882 (impôt sur les revenus d'étrangers effectivement liés à un US trade or business); IRC §871 (FDAP et retenues pour non-résidents); IRC §6038A et Treas. Reg. §1.6038A-2 (Form 5472 pour *25% foreign-owned* et *foreign-owned disregarded entities*); IRC §7701(b) (résidence fiscale, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report auprès de FinCEN).
- **Espagne.** Loi 35/2006 (LIRPF), arts. 8, 9 (résidence), 87 (attribution de revenus), 91 (CFC personnes physiques); Loi 27/2014 (LIS), art. 100 (CFC sociétés); Loi 58/2003 (LGT), arts. 15 et 16; Loi 5/2022 (régime de sanction Modelo 720 après CJUE C-788/19 du 27/01/2022); RD 1065/2007 (Modelos 232 et 720); Ordre HFP/887/2023 (Modelo 721 crypto).
- **Convention Espagne–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> du 22/12/1990 (CDI original); Protocole en vigueur depuis le 27/11/2019 (revenu passif, *limitation on benefits*).
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
- **EIN et notification.** Sans EIN, ni 5472 ni BOI ne peut être déposé. L'IRS ne prévient pas avant de sanctionner; on s'en aperçoit quand l'EIN est bloqué ou qu'un dépôt ultérieur est rejeté.<!-- exentax:execution-v2 -->
## Que se passe-t-il si vous NE déposez PAS le 5472: comment fonctionne la pénalité IRS et comment régulariser

Le 5472 est l'obligation la plus chère qu'un propriétaire de LLC non-résident peut manquer. Sanction civile, automatique, démarre à 25 000$ par formulaire par an.

- **Sanction exacte et application.** 25 000$ par 5472 non déposé, incomplet ou tardif (IRC §6038A(d)). Si 90 jours après avis IRS vous ne déposez toujours pas, 25 000$ supplémentaires par période de 30 jours, sans plafond explicite. La pénalité NE dépend PAS du revenu de la LLC.
- **Comment l'IRS s'en aperçoit.** Trois voies: échange CRS/FATCA avec votre pays de résidence, croisement avec banque US, audit aléatoire. Probabilité non nulle et croissante.
- **Comment régulariser avant ouverture de dossier.** Dépôt tardif volontaire du 5472 + 1120 + lettre de « reasonable cause ». Programme First-Time Penalty Abatement peut éliminer totalement la pénalité.
- **Comment régulariser après avis IRS.** 30 jours pour répondre: dépôt immédiat, paiement sous protêt, demande formelle d'abatement. Délai 4-6 mois. Succès first-time + reasonable cause: 60-80%.

### Ce qu'on nous demande le plus

**Si 3 ans en retard, c'est 75 000$?** Oui, dans le pire cas. Régularisation volontaire avec reasonable cause peut réduire ou éliminer.

**Puis-je fermer la LLC et qu'on m'oublie?** Non. L'obligation des années actives persiste après dissolution. Fermer sans régulariser empire.

Chez Exentax nous faisons les régularisations 5472 tardives.
<!-- /exentax:execution-v2 -->

## Nous l'installons sans que vous perdiez un week-end

Des milliers de freelances et d'entrepreneurs opèrent déjà leur LLC américaine de manière 100 % légale et documentée. Chez Exentax, nous nous occupons de l'ensemble du processus: constitution, banque, passerelles de paiement, comptabilité, déclarations IRS et conformité dans votre pays de résidence. Réservez une consultation gratuite et nous vous dirons honnêtement si la LLC a du sens pour votre cas, sans promesses absolues.
### Rappel pratique

Chaque situation fiscale dépend de votre résidence, de l'activité exercée et des contrats en vigueur. Les informations présentées ici sont générales et ne remplacent pas un conseil personnalisé; analysez votre cas particulier avant toute décision structurelle.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Il%20existe%20une%20d%C3%A9claration%20dans%20la%20vie%20fiscale%20d'une%20LLC%20unipersonnelle%20%C3%A0%20asso%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous souhaitez voir le processus complet en détail, consultez notre <a href="/fr/services">page des services</a> avec tout ce que nous couvrons.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Nous vérifions BOI, EIN, agent enregistré et obligations fédérales pour qu'aucune amende ne vous surprenne. <a href="/fr/services">Demander une revue de conformité</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Révision éditoriale en attente</strong> — Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…&gt;IRS&lt;/a&gt; rara vez perdona ese olvido: la sanción base son **25.000 USD** por formulario no…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">10.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…sustancialmente incompleta**. Hasta 2018 la sanción era de 10.000 USD; desde entonces la c…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">75.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…resentar el 5472, son tres formularios. Tres por 25.000 = **75.000 USD** antes incluso de …»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…tructura formal y referencias a IRM 20.1.9 y al regulation §1.6038A-4, marca la diferencia…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">500.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…a LLC: una LLC con $0 de revenue paga lo mismo que una con $500.000. - **Cómo se entera el…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">80%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…Probabilidad de éxito en first-time + reasonable cause: 60-80%. ### Lo que más nos pregunt…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…uien está caminando hacia un problema de cinco cifras: el **Form 5472**. No es un impuesto…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…* antes incluso de entrar en intereses. 3. **Cascada con el Form 1120.** Recuerda que tu L…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1099</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…y el tipo de cliente, pueden generar reporting de terceros (Form 1099, retenciones, FATCA …»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->

`;
