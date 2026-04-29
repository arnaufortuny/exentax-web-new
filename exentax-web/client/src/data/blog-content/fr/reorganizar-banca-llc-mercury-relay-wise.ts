export default `Une pile bancaire saine pour une LLC combine généralement 3 comptes : Mercury pour l'opérationnel USD, Wise pour la conversion EUR à 0,41 % de spread, et Relay en backup avec des cartes physiques.

Si vous avez une LLC et que votre banque est "Mercury pour tout parce qu'on me l'a dit", vous laissez de l'argent et de la fiabilité sur la table. Mercury est excellent pour beaucoup de cas, mais l'architecture bancaire optimale pour une LLC active est rarement un seul compte sur une seule plateforme.

## Quand réorganiser

Trois signaux:

1. **Plusieurs devises** (USD, EUR, GBP) et frais de conversion non négligeables.
2. **Plusieurs processeurs** (Stripe, PayPal, Wise, Amazon, Shopify) et réconciliation pénible.
3. **Blocage temporaire** sur le compte principal sans backup opérationnel.
### Trois acteurs de référence

### Mercury
Forces: meilleure UX US-domestic, comptabilité intégrée, cartes virtuelles, free tier généreux. Limites: USD uniquement, FX moins compétitif, KYC parfois stricts.

### Wise Business
Forces: multi-devise natif, FX interbancaire, IBAN EUR, compte USD avec wire details. Limites: pas une banque US (EMI), cartes plus limitées.

### Relay
Forces: banque US solide, jusqu'à 20 sous-comptes, permissions équipe. Limites: UX moins peaufinée.
### Architectures de référence par cas

### Cas 1: LLC de services, principalement USD, faible volume
**Mercury seul** suffit.

### Cas 2: SaaS ou e-commerce multi-devise
**Mercury (primaire USD) + Wise (multi-devise)**. Couvre 80-90 % des cas.

### Cas 3: agence ou opération avec plusieurs lignes
**Relay (sous-comptes par ligne) + Wise (multi-devise)**. Sous-comptes "operating", "taxes mises de côté", "owner draw", "buffer".

### Cas 4: gros volume avec rotation constante
**Mercury + Wise + backup** (Relay ou fintech). Le troisième acteur compte pour la continuité.
### Principes

1. **Comptes spécialisés**, pas comptes "à l'arrache".
2. **Flux KYC-friendly**: ce qui circule doit correspondre à ce qui a été déclaré à l'ouverture.
3. **Redondance opérationnelle**: au moins deux comptes opérationnels chez deux prestataires.
4. **Intégration comptable**: assurez-vous que la configuration s'intègre avec QuickBooks, Xero ou Wave.
### Procédure de migration sans casser l'opération

1. **Ouvrir les nouveaux comptes** en gardant l'existant actif. 4-8 semaines KYC.
2. **Migrer les flux progressivement**: un client à la fois, processeur par processeur.
3. **Mettre à jour les coordonnées bancaires** par écrit avec chaque contrepartie, date effective.
4. **Garder l'ancien compte en backup** au moins 90 jours.
5. **Fermer l'ancien compte proprement** avec lettre formelle, statements téléchargés.

Migration propre: 3-6 mois.
### Erreurs courantes

- **Fermer l'ancien compte avant que le nouveau ne soit pleinement opérationnel**.
- **Diviser les flux sans écrire la règle**.
- **Trop de comptes**: plus de quatre rarement justifié.
- **Oublier de mettre à jour les abonnements récurrents** sur l'ancienne carte.
### Comment nous l'abordons chez Exentax

Chez Exentax nous concevons les configurations bancaires en fonction des flux réels, pas de la mode. Réservez une session initiale gratuite via notre page contact.
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

### Notes par fournisseur

- **Mercury** opère avec plusieurs banques partenaires sous charte fédérale et couverture **FDIC** via sweep network: principalement **Choice Financial Group** et **Evolve Bank & Trust**, et encore **Column N.A.** sur certains comptes hérités. Mercury n'est pas une banque; c'est une plateforme fintech adossée à ces partner banks. Si Mercury ferme un compte, le solde est généralement renvoyé **par chèque papier à l'adresse enregistrée du titulaire**, ce qui peut être un vrai problème opérationnel pour un non-résident; gardez un compte secondaire (Relay, Wise Business, etc.) comme contingence.
- **Wise** propose deux produits distincts: **Wise Personal** et **Wise Business**. Pour une LLC, on doit ouvrir **Wise Business**, pas le compte personnel. Nuance CRS importante: un **Wise Business détenu par une LLC américaine reste hors CRS** car le titulaire est une entité US et les États-Unis ne sont pas dans le CRS; le volet USD passe par Wise US Inc. (périmètre FATCA, pas CRS). En revanche, un **Wise Personal ouvert par une personne physique résidente fiscale en Espagne** ou autre juridiction CRS **déclenche bien une déclaration CRS** via Wise Europe SA (Belgique) sur cette personne. Ouvrir Wise pour votre LLC ne vous fait pas entrer dans le CRS via la LLC; un Wise Personal séparé à votre nom de résident CRS, oui.
- **Wallester** (Estonie) est une entité financière européenne avec licence EMI/banque émettrice de cartes. Ses comptes IBAN européens **entrent dans le Standard Commun de Déclaration (CRS)** et déclenchent un échange automatique vers l'administration fiscale du pays de résidence.
- **Payoneer** opère via des entités européennes (Payoneer Europe Ltd, Irlande) elles aussi **dans le périmètre CRS** pour les clients résidant dans une juridiction participante.
- **Revolut Business** : lorsqu'il est associé à une **LLC américaine**, il passe par **Revolut Technologies Inc.** avec **Lead Bank** comme partenaire bancaire US. Le compte fourni est un compte américain (routing + account number) ; **aucun IBAN européen n'est émis** à une LLC. Les IBAN européens (lituaniens, BE) appartiennent à **Revolut Bank UAB** et sont émis aux clients européens du groupe. Si on vous propose un IBAN européen rattaché à votre LLC, vérifiez à quelle entité juridique il est rattaché et sous quel régime elle déclare.
- **Fiscalité zéro**: aucune structure LLC ne donne « zéro impôt » si vous vivez dans un pays avec règles CFC, transparence fiscale ou attribution de revenus. Ce que l'on obtient, c'est **éviter la double imposition** et **déclarer correctement en résidence**, pas l'éliminer.
## Faits juridiques et de procédure

## Références: sources et réglementation bancaire

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

<!-- exentax:lote18-native-v1:reorganizar-banca-llc-mercury-relay-wise-fr -->
## Pourquoi réorganiser la banque d'une LLC se prépare comme un transfert plutôt que comme une fermeture

Réorganiser la structure bancaire d'une LLC en intégrant Mercury, Relay et Wise se prépare comme un transfert d'opérations plutôt que comme une fermeture suivie d'une réouverture. La différence est concrète : un transfert maintient les flux opérationnels pendant la transition, alors qu'une fermeture les interrompt et oblige à reconstruire la chaîne de paiements et de réceptions à partir de zéro.
<!-- /exentax:lote18-native-v1:reorganizar-banca-llc-mercury-relay-wise-fr -->

<!-- exentax:lote27-native-v1:reorganizar-banca-llc-mercury-relay-wise-fr -->
## Comment lire la réorganisation bancaire de la LLC comme une mise à jour de mapping plutôt que comme un changement de fournisseur

La réorganisation bancaire de la LLC se lit plus utilement comme une mise à jour du mapping rôle-par-fournisseur entre Mercury, Relay et Wise, qu'à un changement de fournisseur isolé.
<!-- /exentax:lote27-native-v1:reorganizar-banca-llc-mercury-relay-wise-fr -->

Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href="/fr#calculadora">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

## Nous l'installons sans que vous perdiez un week-end

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.
### Lectures complémentaires

Détail pratique à verrouiller avant d'agir. La majorité des dégâts évitables sur ce point précis viennent de l'oubli de la documentation, pas de la logique fiscale sous-jacente.
## Pourquoi on réorganise la banque d'une LLC

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

### Principe directeur: ne jamais couper avant d'avoir le remplaçant opérationnel

Note de terrain après avoir piloté cela mois après mois pour des clients: la règle est simple, c'est l'exécution qui casse. Planifiez l'opérationnel avant le juridique.

### Étape 1. Ouvrir le nouveau compte sans toucher à l'actuel

### Étape 2. Effectuer un test fonctionnel avec un petit mouvement

C'est l'un des points que nous auditons en premier lorsque nous reprenons un dossier. S'il n'est pas propre ici, toute hypothèse en aval devient négociable face à l'administration.

## Mise à jour Exentax actuellement: configuration bancaire à jour

La configuration bancaire recommandée pour une LLC actuellement a consolidé trois pièces aux rôles complémentaires:

- **Mercury (opérations principales).** Compte via **Column NA**, **couverture FDIC jusqu'à 5 M USD** via sweep, **wires domestiques à 0 USD**, internationaux 0 entrants / 5 sortants (selon corridor), 20+ sous-comptes gratuits. Idéal comme compte opérationnel USD et base comptable.
- **Relay (multi-comptes et règles).** Jusqu'à 20 comptes opérationnels + règles d'auto-répartition (impôts, opex, épargne). Utile quand la LLC commence à séparer ses *cash buckets* sans passer à un ERP. Compatible Plaid pour Wave/Quickbooks.
- **Wise Business (multidevises).** EMI avec 50+ devises au taux interbancaire, FX typique **0,4-1,5 %**, coordonnées locales dans 10+ pays. Indispensable si réception en EUR/GBP ou paiement à des freelances LATAM/UE.

### Modèle actuellement par volume

| Volume annuel | Configuration recommandée |
|---|---|
| &lt; 50 k USD | Mercury seul |
| 50-300 k USD | Mercury + Wise (multidevises) |
| 300 k-1 M USD | Mercury + Relay (buckets) + Wise (FX) |
| > 1 M USD | Mercury + Relay + Wise + compte traditionnel US (Bank of America/Chase) pour les wires d'échelle |

### Réorganisation en 4 étapes

1. **Inventaire.** Lister tous les comptes actifs et leur usage réel.
2. **Décision.** Appliquer le modèle par volume et fermer les comptes redondants.
3. **Migration.** Réorienter les clients (nouvelles wire instructions signées), mettre à jour les factures en cours, rediriger les payouts Stripe.
4. **KYC préventif.** Avant le premier gros mouvement, charger Articles, EIN Letter (émis par l'<a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>), OA signé et justificatif d'adresse.

### FAQ actuellement

**Mercury reste-t-il l'option par défaut actuellement?** Oui. La couverture FDIC sweep et les wires domestiques à 0 USD restent sans concurrent clair pour les LLC non-résidentes.

**Quand un compte traditionnel?** Au-delà de ~1 M USD annuels ou avec des clients corporate US payant exclusivement par ACH bancaire.

**Wise déclare-t-il en CRS?** Wise Europe SA (Belgique) est soumise au CRS pour les résidents européens. Documentez bien votre résidence fiscale.

<!-- exentax:execution-v2 -->
## Comment nous réorganisons le banking d'une LLC chez Exentax quand il ne tient plus

Quand une LLC reçoit des paiements sérieux, la configuration initial (parfois juste Mercury) ne tient plus: limites, gels, une seule passerelle et zéro secours. La méthode Exentax le réorganise sans downtime ni fermetures.

- **Compte principal et compte miroir** en parallèle: Mercury ou Relay opérationnel, Wise en secours multi-devises, Stripe + Paddle/DoDo en passerelle.
- **Migration progressive** des prélèvements et abonnements pour qu'aucun client ne voie un encaissement échouer pendant la transition.
- **KYC étendu préparé** avec description d'activité, MCC et documentation cohérents entre tous les comptes pour passer les contrôles de second niveau.

Si votre configuration actuelle ne tient plus, lancez la <strong>calculatrice Exentax</strong> ou réservez trente minutes: nous remettons le plan de migration par écrit avant de toucher à quoi que ce soit.
<!-- /exentax:execution-v2 -->

## Le cas spécifique du résident fiscal français

  Pour un résident fiscal français qui réorganise la banque de sa LLC, l'élément clé est l'**obligation déclarative permanente** de l'**article 1649 A bis du CGI** combinée à l'article 1649 ter A pour les actifs numériques. Toute ouverture, modification ou clôture de compte (Mercury, Relay, Wise) doit être déclarée via le **formulaire 3916-bis** dans l'année où le compte est utilisé. Une réorganisation typique (clôture Wise → ouverture Mercury) génère donc deux écritures déclaratives distinctes pour la même année fiscale, sous peine d'amende de **1 500 € par compte** non déclaré.

  ### Considérations pratiques supplémentaires pour le résident français

  Tout transfert international supérieur à 12 500 € entre comptes appartenant à la même personne est notifié automatiquement à TRACFIN par la banque française émettrice ou réceptrice (article L.561-15 du Code monétaire et financier). Une trace contradictoire avec la déclaration 3916-bis déclenche un signalement et, le cas échéant, une demande de justification documentée dans un délai de trente jours.

<!-- exentax:lote7-native-v1:reorganizar-banca-llc-mercury-relay-wise -->
## Quand la configuration est le goulot, pas la banque

La plupart des appels reçus pour "je veux réorganiser la banque de
ma LLC" ne portent pas vraiment sur une mauvaise banque. Ils
portent sur une configuration qui a grandi par accident : un compte Mercury
ouvert la première année, un canal de payout Stripe ajouté quand les
paiements web sont arrivés, une carte Wise introduite pour les
dépenses publicitaires et, à un certain moment, Relay ou un autre
fintech testé pour les intégrations comptables. Après deux ou trois
ans, le résultat est une topologie que personne n'a dessinée
volontairement, et de petites frictions s'accumulent : la
réconciliation ralentit, les coûts de change deviennent invisibles,
et les questions KYC tombent sur la dernière entité onboardée.

La réorganisation ne signifie presque jamais fermer des comptes.
Elle signifie le plus souvent les recadrer pour que chacun ait un
seul travail clair et que les autres conservent des rôles
secondaires propres.

## Une attribution de rôle nette par compte

| Compte      | Rôle principal                                | Rôle secondaire             |
|-------------|-----------------------------------------------|-----------------------------|
| Mercury     | Banque US domiciliataire, opérations ACH/wire | Carte si faible volume      |
| Relay       | Intégrations comptables + sous-comptes        | ACH de secours              |
| Wise        | Réception multi-devises (EUR/GBP) + change    | Carte pour dépenses pub     |
| Stripe      | Encaissement web/marketplace + payouts        | Réserve retenue par Stripe  |

Une fois que chaque compte a un seul rôle principal, les règles
comptables s'écrivent toutes seules : Mercury se réconcilie avec la
trésorerie d'exploitation, Wise avec les soldes FX par devise,
Stripe avec le chiffre d'affaires et la réserve, Relay avec les
sous-comptes de dépenses. La question "où est passé ce mouvement?"
disparaît.

## Trois schémas réels que nous appliquons

- Sortie de la "fragilité mono-banque". Client n'avait que Mercury
  et une revue de routine a temporairement bloqué les virements
  sortants. Ajout de Relay en ACH de secours et d'une petite couche
  multi-devises Wise pour les factures EUR. Coût marginal. Bénéfice :
  plus de point unique de défaillance sur la paie ou les fournisseurs.
- Sortie du "Stripe devient la banque". Client laissait de grosses
  réserves chez Stripe et tirait des fonds personnels directement
  depuis Stripe. Réacheminement quotidien des payouts Stripe vers
  Mercury, conservation de Wise pour les factures clients UE, et
  Stripe traité purement comme rail d'encaissement.
- Sortie de "la carte Wise est la carte de l'entreprise". Client
  utilisait la carte Wise comme carte principale. Déplacement des
  SaaS récurrents et des dépenses proches de la paie sur Mercury (où
  la piste d'audit est de qualité bancaire) et conservation de la
  carte Wise étroitement pour les publicités payantes.

## Erreurs vues lors d'une réorganisation

- Fermer d'abord l'ancien compte. Toujours ouvrir et amorcer le
  nouveau rôle avant de fermer quoi que ce soit ; l'historique de
  compte fait partie du dossier bancaire de la LLC.
- Déplacer de gros soldes en un seul virement. Fractionner en
  tranches opérationnelles normales ; les mouvements de type
  trésorerie déclenchent souvent une mise à jour KYC.
- Laisser des cartes "personnelles" se mélanger. La liste des cartes
  de la LLC doit être courte, nommée et réconciliée mensuellement.
- Oublier de mettre à jour les données de bénéficiaire après le
  changement. Si la déclaration BOI a l'adresse de la LLC, tous les
  profils bancaires doivent y correspondre.

## Checklist de réorganisation

- Cartographier les comptes actuels selon le tableau de rôles.
- Identifier le ou les rôles manquants.
- Ouvrir les nouveaux comptes de rôle ; préfinancer avec de petits
  montants.
- Migrer les flux récurrents entrants/sortants sur 30 jours en
  parallèle.
- Ne fermer ce qui est vraiment redondant qu'après une clôture
  mensuelle propre.

Nous traitons la configuration bancaire comme le système circulatoire de la
LLC : chaque vaisseau a un rôle, et réorganiser signifie corriger
le tracé, pas arracher les vaisseaux.

<!-- /exentax:lote7-native-v1:reorganizar-banca-llc-mercury-relay-wise -->

<!-- exentax:cross-refs-v1 -->
## Sur le même sujet

- [Comment ouvrir un compte Mercury pour votre LLC depuis l'étranger](/fr/blog/comment-ouvrir-un-compte-mercury-pour-votre-llc-depuis)
- [Banques traditionnelles vs fintech pour votre LLC : où ouvrir votre compte](/fr/blog/banques-traditionnelles-vs-fintech-pour-votre-llc-ou-ouvrir)
- [Comment éviter les blocages de compte chez Mercury, Wise et Revolut](/fr/blog/comment-eviter-les-blocages-de-compte-chez-mercury-wise-et)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Si%20vous%20avez%20une%20LLC%20et%20que%20votre%20banque%20est%20Mercury%20pour%20tout%20parce%20qu'on%20me%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.

<!-- exentax:conv-fill-v1 -->
Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.

Pour les détails par État, consultez notre <a href="/fr/services/llc-wyoming">page service LLC Wyoming</a> avec coûts et délais fermés.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->
`;