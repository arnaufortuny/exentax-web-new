export default `Cet article d'origine a été écrit pour un public hispanophone couvrant l'Espagne et l'Amérique latine, mais il touche un nerf qui vaut pour tout résident fiscal français ou belge: dès que vous détenez une LLC avec compte bancaire en USD, votre déclaration locale doit intégrer des obligations d'information (Formulaire 3916 côté France, DAC 7, etc.) que beaucoup ignorent jusqu'au premier contrôle.

## Ce qu'est le CRS

Approuvé par le Conseil de l'<a href="https://www.oecd.org" target="_blank" rel="noopener">OCDE</a> en juillet 2014, le CRS impose aux administrations fiscales des plus de 100 juridictions adhérentes l'échange automatique annuel d'informations sur les comptes financiers de non-résidents. Au sein de l'UE il est intégré par la **Directive 2014/107/UE (DAC2)**. L'Espagne l'a transposé via le **Décret royal 1021/2015** et la **Ordonnance HAP/1695/2016** (Modelo 289). En Amérique latine il est appliqué par le Mexique (depuis 2017), l'Argentine, la Colombie, le Chili, le Brésil, l'Uruguay, le Panama, le Pérou et d'autres. **Les États-Unis n'adhèrent pas au CRS**: ils utilisent FATCA, unilatéral et seulement sortant. Voir <a href="/fr/blog/les-comptes-bancaires-americains-rapportent-ils-a-votre">les comptes US déclarent-ils à votre fisc</a>.
### Ce qui est déclaré

Chaque institution financière déclarante (banque, broker, fintech bancaire, fonds, assurance d'investissement) déclare annuellement: identification du titulaire (nom, adresse, résidence fiscale, NIF/TIN, date et lieu de naissance), de l'entité (avec **bénéficiaires effectifs** si NFE passive), numéro de compte, **solde au 31 décembre** et revenus bruts (intérêts, dividendes, autres produits, produits de cession pour comptes de conservation). Les flux annuels sont croisés avec votre déclaration nationale (en Espagne: IRPF + Modelo 720 + Modelo 721 pour les crypto-actifs).
### Le cas de votre LLC américaine

Trois points clés:

1. **Les États-Unis n'envoient pas de données via CRS.** Ni Mercury ni Relay ne transmettent à AEAT, SAT, DIAN ou AFIP par cette voie.
2. **Vos comptes en fintechs européennes (Wise BE, Revolut LT, N26 DE, Wallester EE) au nom de la LLC SONT déclarés.** Voir <a href="/fr/blog/revolut-business-et-crs-ce-qui-est-declare-a-votre-fisc">Revolut et CRS</a> et <a href="/fr/blog/wise-business-et-crs-ce-qui-est-declare-a-votre-fisc">Wise et CRS</a>.
3. **Votre LLC est probablement classée NFE passive**: la fintech identifie alors les **controlling persons** (vous) et les déclare à votre pays de résidence.
### Comment est déterminée la résidence fiscale

L'institution applique une procédure de due diligence (auto-certification + indices objectifs: adresse, IP, NIF, virements récurrents). Mentir dans l'auto-certification est une infraction fiscale et peut être pénalement répréhensible.
### Implications réelles en Espagne

Si vous résidez fiscalement en Espagne avec des comptes à l'étranger > 50 000 € à fin d'année: **Modelo 720**; crypto-actifs étrangers > 50 000 €: **Modelo 721**. L'arrêt CJUE C-788/19 a annulé le régime sanctionnateur disproportionné mais l'obligation de déclarer reste pleinement en vigueur (LGT art. 198 + revenus non déclarés régularisés comme gains patrimoniaux non justifiés, art. 39 LIRPF).
### Implications en LATAM

Mexique (art. 32-A CFF), Colombie (DIAN), Argentine (AFIP), Chili (SII) reçoivent les données CRS et les croisent avec leurs déclarations annuelles.
### Comment planifier correctement

Une LLC bien structurée avec banque exclusivement Mercury/Relay (US) a une **empreinte CRS minimale**. Dès que vous ajoutez une couche européenne, vous acceptez que l'information arrive à votre fisc. La stratégie professionnelle: déclarer correctement, concevoir la structure pour que ce qui est déclaré soit fiscalement efficient (voir <a href="/fr/blog/conception-dune-structure-fiscale-internationale-solide">cadre de conception d'une structure internationale</a>), maintenir la documentation, et connaître les risques (voir <a href="/fr/blog/risques-fiscaux-dune-mauvaise-structuration-internationale">risques fiscaux d'une mauvaise structuration</a>).
### Erreurs typiques

- "Mercury est aux US, personne ne sait": faux pour vos Wise/Revolut/N26 au nom de la même LLC.
- "Résidence fiscale en Andorre/Paraguay" mais vous vivez en Espagne: la résidence se détermine par les faits (art. 9 LIRPF).
- "Si la LLC facture, je suis tranquille": la **transparence fiscale internationale** (TFI, art. 100 LIS via art. 91 LIRPF) peut s'activer si la LLC génère des revenus passifs et qu'elle est sous votre contrôle.
## Conclusion et prochaines étapes

### En résumé

Le CRS ne s'évite pas depuis une juridiction européenne, il se planifie. Une LLC américaine reste un outil extraordinairement utile, mais la conception de votre stack bancaire et de votre résidence détermine la cohérence entre l'empreinte informationnelle et ce que vous déclarez.

Chez Exentax on cadre ces obligations dès la constitution, pour des clients en France, Belgique et Suisse. Réservez votre consultation gratuite: on identifie les déclarations annexes qui vous concernent vraiment et on vous les met en ordre.

Si un aspect de cette structure mérite d'être creusé, <a href="/fr/blog/pourquoi-les-freelancers-espagnols-quittent-le-statut-dauto">Pourquoi les freelancers espagnols quittent le statut d'auto-entrepreneur pour une LLC</a> détaille un point adjacent que nous réservons d'habitude à un article dédié.
### Prochaines étapes

Si vous voulez valider si cette stratégie convient à votre situation concrète, chez Exentax nous étudions votre cas personnellement et vous proposons la structure légale et efficiente qui vous convient vraiment. Réservez une session initiale sans engagement depuis notre page de contact.

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
## Comment planifier correctement

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.
## En résumé

Nous traitons ce bloc comme l'une des décisions structurantes de la stratégie LLC: un faux pas ici et le reste de la structure perd en fiscalité, en accès bancaire ou en conformité. Les notes qui suivent reflètent ce que nous faisons réellement avec des clients dans ce cas précis, en priorisant les variables qui changent vraiment le résultat.

## Références: cadre juridique et réglementation

## Parlons de votre structure

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

<!-- exentax:calc-cta-v1 -->
> <a href="/fr/reserver">Consultation gratuite sans engagement</a>
<!-- /exentax:calc-cta-v1 -->

Notre position ici est délibérément prudente: nous optimisons pour ce qui résiste à un contrôle, pas pour le chiffre le plus agressif. Les points ci-dessous sont ceux que nous sommes prêts à défendre par écrit.

## Quelles informations sont exactement déclarées

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

## Ce qui arrive à votre LLC américaine: la nuance que presque personne n'explique

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.<!-- exentax:execution-v2 -->
## Ce que le CRS signifie aujourd'hui pour les résidents en Espagne et en Amérique latine

Le CRS tourne en pilote automatique: 110+ juridictions échangent chaque septembre des données sur les soldes au 31 décembre de l'année précédente. Si vous êtes résident fiscal en Espagne, Mexique, Colombie, Chili, Pérou, Argentine ou Uruguay, les banques où vous avez des comptes à l'étranger reportent déjà ou le feront bientôt. Voici ce qui compte, sans paranoïa.

- **Ce qui est reporté.** Soldes au 31 décembre, revenus bruts annuels (intérêts, dividendes), nom du titulaire, résidence fiscale déclarée à la banque et, pour entités transparentes, données de la controlling person. L'info arrive au pays de résidence et est croisée avec la déclaration du contribuable.
- **Ce qui n'est pas reporté.** Mouvements détaillés du compte, contreparties spécifiques, info transactionnelle. CRS = soldes + revenus bruts + identification; pas traçabilité de chaque opération. Le "ils savent tout" est exagéré littéralement mais juste en conséquence: avec soldes et revenus bruts on construit la présomption suffisante pour ouvrir une demande.
- **Espagne, Modelo 720 et Modelo 721.** Le résident fiscal espagnol a une obligation propre de déclarer comptes étrangers (>50 000 € combiné, Modelo 720) et cryptoactifs étrangers (>50 000 €, Modelo 721). Indépendant du CRS, dépendant de votre obligation. Le CRS aide seulement l'AEAT à croiser et détecter les omissions.
- **Amérique latine - rythmes différents.** Mexique (SAT) échange depuis 2018, couverture étendue; Colombie (DIAN) depuis 2017, épuration progressive; Chili (SII) depuis 2018; Argentine (AFIP) depuis 2018, usage opérationnel en construction; Uruguay actif mais régime de paradis fiscal nuançant le flux bidirectionnel. L'intensité d'usage varie, la disponibilité de la donnée est généralisée.

### Ce qu'on nous demande le plus

**Si j'ai Mercury dans ma LLC, mon pays le sait via CRS?** Pas directement: les États-Unis ne participent pas au CRS. Ce qui entre est Wise (via la Belgique) et, si la LLC opérait depuis une banque européenne ou asiatique, oui. Mercury reste hors du flux automatique, pas hors de toute obligation déclarative.

**Comment régulariser si j'ai des années non déclarées?** Par déclaration complémentaire 720/721 avant l'arrivée d'une demande. L'arrêt CJUE C-788/19 a plafonné les amendes espagnoles; on régularise bien moins cher qu'il y a 5 ans. Évalué cas par cas.

Chez Exentax nous mappons quels comptes entrent dans le CRS, quelles obligations déclaratives chacun déclenche et concevons l'entrée propre ou la régularisation ordonnée quand applicable.
<!-- /exentax:execution-v2 -->

## Ce qu'est le CRS et pourquoi il existe

Lisez cette section comme une checklist exigeante: chaque point signale un mode de défaillance que nous avons constaté sur des dossiers LLC transfrontaliers. N'en sautez aucun - la plupart des redressements et clôtures de comptes que nous récupérons remontent à l'un de ces éléments.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20lis%20l'article%20%22Cet%20article%20d'origine%20a%20%C3%A9t%C3%A9%20%C3%A9crit%20pour%20un%20public%20hispanophone%20couvrant%20l'Espa%E2%80%A6%22%20et%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>

Si vous préférez en discuter de vive voix, <a href="/fr/reserver">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.
<!-- /exentax:cta-conv-v1 -->

Réservez une consultation gratuite de 30 minutes : nous analysons votre cas réel et vous disons ce qui a du sens. <a href="/fr/reserver">Réserver une consultation gratuite</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Révision éditoriale en attente</strong> — Les références suivantes nécessitent une vérification manuelle auprès de la source officielle en vigueur. Si vous identifiez un écart, écrivez à l'équipe et nous corrigeons sous 24 heures.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">50%</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…E)**, salvo que demuestre actividad operativa real (más del 50% de sus ingresos son operat…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…uentas en el extranjero** con saldo individual o conjunto &gt; 50.000 € a 31 de diciembre o s…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">20.000</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…zo del año siguiente; sucesivas, solo si hay variación de + 20.000 € en cualquier rúbrica.…»</span> <strong>[NON VÉRIFIÉ]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…nvenio OCDE con sus Comentarios. - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación chec…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(chiffre)</span> <span class="text-xs italic">— «…-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §77…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…U.** Treas. Reg. §301.7701-3 (clasificación check-the-box), IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y normativa F…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…cación check-the-box), IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) y…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1021/2015</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…os CRS La entidad financiera aplica una **due diligence** (RD 1021/2015 y Anexo I del CRS)…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…reformó el Modelo 720 tras la STJUE C-788/19 de 27/01/2022, RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…6/UE de cooperación administrativa (DAC), modificada por la DAC2 (Directiva 2014/107/UE) q…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…13 en vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…vigor desde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Conve…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(référence légale)</span> <span class="text-xs italic">— «…esde 2019, Directiva 2011/16/UE modificada por DAC6, DAC7 y DAC8, y Modelo de Convenio OCD…»</span> <strong>[REVISIÓN MANUAL — source suggérée: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
