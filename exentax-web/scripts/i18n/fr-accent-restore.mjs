#!/usr/bin/env node
/*
 * One-shot accent restoration for fr.ts legal/UI body strings.
 *
 * The FR locale was originally produced from accent-stripped sources
 * (typical of copy-pasted ALL-CAPS legal banners and some body text)
 * and is being normalised so the new native-quality audit passes
 * cleanly. Each entry below is an unambiguous accent-restoration: the
 * source form is NOT a valid French word in modern usage.
 *
 * The script:
 *   1) Reads exentax-web/client/src/i18n/locales/fr.ts as text
 *   2) Applies a curated map of word-level Unicode-aware substitutions
 *      (case-sensitive, longest-first to avoid partial overlaps)
 *   3) Writes the file back if anything changed
 *
 * Note: substitutions are unfiltered text replacements over the file.
 * URL/attribute safety is achieved by curation alone — every entry in
 * the dictionary is a French word that never appears in URLs, code
 * identifiers, or HTML attribute values used in this codebase. Adding
 * common English/identifier-like tokens would require reintroducing a
 * context-aware skip pass.
 *
 * Run with: node scripts/i18n/fr-accent-restore.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

const FILE = "client/src/i18n/locales/fr.ts";

// Accent-restoration dictionary. Keys are Unicode-aware regexes;
// values produce the canonical accented form preserving case.
// We iterate longest-first to avoid partial overlaps.
const PAIRS = [
  // composites — handle BEFORE individual words
  ["CONDITIONS GENERALES", "CONDITIONS GÉNÉRALES"],
  ["DEJA ETE DEMANDE OU EMIS", "DÉJÀ ÉTÉ DEMANDÉ OU ÉMIS"],
  ["DEJA ETE", "DÉJÀ ÉTÉ"],
  ["DEJA DEPOSE", "DÉJÀ DÉPOSÉ"],
  ["DEJA CONSTITUEE", "DÉJÀ CONSTITUÉE"],
  ["EN L'ETAT", "EN L'ÉTAT"],
  ["NATURE GENERALE", "NATURE GÉNÉRALE"],
  ["lancees", "lancées"],
  ["LANCEES", "LANCÉES"],
  ["ecoulees", "écoulées"],
  ["ECOULEES", "ÉCOULÉES"],
  // Title-Case singular variants (TitleCase entries cannot be derived
  // from lowercase entries because we keep replacement case-sensitive)
  ["Conformite", "Conformité"],
  ["Integralite", "Intégralité"],
  ["Integrite", "Intégrité"],
  ["Generales", "Générales"],
  ["Generale", "Générale"],
  ["Educative", "Éducative"],
  ["EDUCATIVE", "ÉDUCATIVE"],
  ["GENERALE", "GÉNÉRALE"],
  ["Fonctionnalite", "Fonctionnalité"],
  ["Fonctionnalites", "Fonctionnalités"],
  ["Numerique", "Numérique"],
  ["Numeriques", "Numériques"],
  ["Electronique", "Électronique"],
  ["Electroniques", "Électroniques"],
  ["Demarches", "Démarches"],
  ["Decrite", "Décrite"],
  ["Decrites", "Décrites"],
  ["decrite", "décrite"],
  ["Realisees", "Réalisées"],
  ["Annule", "Annulé"], // Title-Case past participle in legal context
  ["Reutilise", "Réutilisé"],
  ["Attribue", "Attribué"], // Title-Case past participle in legal context
  // single words — case-preserving via separate UPPER and lower entries
  ["INTEGRALITE", "INTÉGRALITÉ"],
  ["INTEGRITE", "INTÉGRITÉ"],
  ["GENERALES", "GÉNÉRALES"],
  ["LEGALEMENT", "LÉGALEMENT"],
  ["DEPOSES", "DÉPOSÉS"],
  ["DEPOSE", "DÉPOSÉ"],
  ["EXECUTES", "EXÉCUTÉS"],
  ["EXECUTE", "EXÉCUTÉ"],
  ["PRESUMEE", "PRÉSUMÉE"],
  ["INDEPENDAMMENT", "INDÉPENDAMMENT"],
  ["INDEPENDANTES", "INDÉPENDANTES"],
  ["INDEPENDANTE", "INDÉPENDANTE"],
  ["INDEPENDANT", "INDÉPENDANT"],
  ["ELECTRONIQUES", "ÉLECTRONIQUES"],
  ["ELECTRONIQUE", "ÉLECTRONIQUE"],
  ["NUMERIQUES", "NUMÉRIQUES"],
  ["NUMERIQUE", "NUMÉRIQUE"],
  ["RECUPERABLES", "RÉCUPÉRABLES"],
  ["DEMARCHES", "DÉMARCHES"],
  ["FONCTIONNALITES", "FONCTIONNALITÉS"],
  ["FONCTIONNALITE", "FONCTIONNALITÉ"],
  ["REALISEES", "RÉALISÉES"],
  ["DECLAREZ", "DÉCLAREZ"],
  ["ETABLIES", "ÉTABLIES"],
  ["ETABLIE", "ÉTABLIE"],
  ["ANNULES", "ANNULÉS"],
  ["ANNULE", "ANNULÉ"],
  ["REUTILISES", "RÉUTILISÉS"],
  ["REUTILISE", "RÉUTILISÉ"],
  ["DECRITES", "DÉCRITES"],
  ["ATTRIBUES", "ATTRIBUÉS"],
  ["CONFORMITE", "CONFORMITÉ"],
  ["IRREVERSIBLE", "IRRÉVERSIBLE"],
  ["IRREVOCABLE", "IRRÉVOCABLE"],
  // NOTE: Singular "DEMANDE" / "ATTRIBUE" deliberately excluded — they
  // collide with valid lemmas (noun "la demande", present-tense
  // "j'attribue"). Their composite forms are handled above for the
  // legal-banner past-participle context only.
  ["EMIS", "ÉMIS"],
  ["DECLARATION", "DÉCLARATION"],
  ["LIE", "LIÉ"], // ALL-CAPS only — lowercase "lie" excluded (verb "lier")
  ["ETES", "ÊTES"],
  ["ETE", "ÉTÉ"],
  ["DEJA", "DÉJÀ"],
  // lower-case
  ["integralite", "intégralité"],
  ["integrite", "intégrité"],
  ["generales", "générales"],
  ["legalement", "légalement"],
  ["deposes", "déposés"],
  ["depose", "déposé"],
  ["executes", "exécutés"],
  ["execute", "exécuté"],
  ["presumee", "présumée"],
  ["independamment", "indépendamment"],
  ["independantes", "indépendantes"],
  ["independante", "indépendante"],
  ["independant", "indépendant"],
  ["electroniques", "électroniques"],
  ["electronique", "électronique"],
  ["numeriques", "numériques"],
  ["numerique", "numérique"],
  ["recuperables", "récupérables"],
  ["demarches", "démarches"],
  ["fonctionnalites", "fonctionnalités"],
  ["fonctionnalite", "fonctionnalité"],
  ["realisees", "réalisées"],
  ["declarez", "déclarez"],
  ["etablies", "établies"],
  ["etablie", "établie"],
  ["annules", "annulés"],
  ["reutilises", "réutilisés"],
  ["reutilise", "réutilisé"],
  ["decrites", "décrites"],
  // Note: lowercase "attribue" / "annule" excluded — collide with
  // present-tense ("j'attribue", "j'annule"). Past-participle plural
  // forms above are kept.
  ["conformite", "conformité"],
  ["irreversible", "irréversible"],
  ["irrevocable", "irrévocable"],
  ["concue", "conçue"],
  ["equitable", "équitable"],
  ["autorites", "autorités"],
  ["etes", "êtes"],
  ["deja", "déjà"],

  // ── Pass 2: comprehensive coverage of legal/UI body strings ─────
  // Each addition below is a French token whose unaccented form is
  // NEVER a valid French word (no present/past-participle collision).
  // Forms that DO collide with present-tense verbs (e.g. `cache` →
  // `caché` / `il cache`, `informe` → `informé` / `il informe`,
  // `paye`, `eleve`, `personnalises`, `certifies`, `qualifies`,
  // `specialises`) are deliberately excluded and fixed contextually
  // by hand in the body strings.

  // -té / -ité abstract nouns (always accented)
  ["complexite", "complexité"],
  ["entite", "entité"],
  ["entites", "entités"],
  ["Entite", "Entité"],
  ["Entites", "Entités"],
  ["Veracite", "Véracité"],
  ["veracite", "véracité"],
  ["Confidentialite", "Confidentialité"],
  ["CONFIDENTIALITE", "CONFIDENTIALITÉ"],
  ["confidentialite", "confidentialité"],
  ["Validite", "Validité"],
  ["validite", "validité"],
  ["Variabilite", "Variabilité"],
  ["variabilite", "variabilité"],
  ["Responsabilite", "Responsabilité"],
  ["Responsabilites", "Responsabilités"],
  ["responsabilites", "responsabilités"],

  // -tion / -sion family (nouns, always accented)
  ["Preparation", "Préparation"],
  ["PREPARATION", "PRÉPARATION"],
  ["preparation", "préparation"],
  ["Preparons", "Préparons"], // 1pl present of "préparer"
  ["reception", "réception"],
  ["Reception", "Réception"],
  ["reclamation", "réclamation"],
  ["Reclamation", "Réclamation"],
  ["RECLAMATION", "RÉCLAMATION"],
  ["reclamations", "réclamations"],
  ["Interpretation", "Interprétation"],
  ["interpretation", "interprétation"],
  ["Interpretations", "Interprétations"],
  ["interpretations", "interprétations"],
  ["emission", "émission"],
  ["Emission", "Émission"],
  ["emissions", "émissions"],
  ["comprehension", "compréhension"],
  ["verification", "vérification"],
  ["Realisation", "Réalisation"],
  ["realisation", "réalisation"],
  ["Reductions", "Réductions"],
  ["reductions", "réductions"],

  // Acute/grave-accented nouns (always accented)
  ["delai", "délai"],
  ["Delai", "Délai"],
  ["delais", "délais"],
  ["Delais", "Délais"],
  ["systeme", "système"],
  ["Systeme", "Système"],
  ["systemes", "systèmes"],
  ["Systemes", "Systèmes"],
  ["probleme", "problème"],
  ["Probleme", "Problème"],
  ["problemes", "problèmes"],
  ["Problemes", "Problèmes"],
  ["PROBLEMES", "PROBLÈMES"],
  ["methode", "méthode"],
  ["Methode", "Méthode"],
  ["methodes", "méthodes"],
  ["Methodes", "Méthodes"],
  ["enquete", "enquête"],
  ["Enquete", "Enquête"],
  ["enquetes", "enquêtes"],
  ["Enquetes", "Enquêtes"],
  ["requisition", "réquisition"],
  ["requisitions", "réquisitions"],
  ["Requisition", "Réquisition"],
  ["Requisitions", "Réquisitions"],
  ["acces", "accès"],
  ["Acces", "Accès"],
  ["defense", "défense"],
  ["Defense", "Défense"],
  ["benefice", "bénéfice"],
  ["benefices", "bénéfices"],
  ["Benefice", "Bénéfice"],
  ["Benefices", "Bénéfices"],
  ["portee", "portée"],
  ["Portee", "Portée"],
  ["PORTEE", "PORTÉE"],
  ["caractere", "caractère"],
  ["Caractere", "Caractère"],
  ["caracteres", "caractères"],
  ["Caracteres", "Caractères"],
  ["releve", "relevé"], // noun "relevé" (verb 3sg is "relève" w/ grave; unaccented never valid)
  ["Releve", "Relevé"],
  ["releves", "relevés"],
  ["Releves", "Relevés"],
  ["depenses", "dépenses"],
  ["Depenses", "Dépenses"],
  ["incoherences", "incohérences"],
  ["Incoherences", "Incohérences"],
  ["resultats", "résultats"],
  ["Resultats", "Résultats"],
  ["Etablissement", "Établissement"],
  ["Etablissements", "Établissements"],
  ["etablissement", "établissement"],
  ["etablissements", "établissements"],
  ["Derniere", "Dernière"],
  ["derniere", "dernière"],
  ["Dernieres", "Dernières"],
  ["dernieres", "dernières"],
  ["Donnees", "Données"], // noun (verb forms `donne/donnes/donné/donnés/donnée` differ)
  ["donnees", "données"],
  ["Donnee", "Donnée"],
  ["donnee", "donnée"],
  ["cumulee", "cumulée"], // past part fem; present 3sg is `cumule`
  ["Cumulee", "Cumulée"],
  ["CUMULEE", "CUMULÉE"],
  ["cout", "coût"],
  ["couts", "coûts"],
  ["Cout", "Coût"],
  ["Couts", "Coûts"],

  // Adjectives/participles always accented (no present-tense form
  // matches the unaccented ASCII spelling)
  ["educatif", "éducatif"],
  ["educatifs", "éducatifs"],
  ["personnalisee", "personnalisée"], // past part fem; verb 3sg is `personnalise`
  ["Personnalisee", "Personnalisée"],
  ["consecutif", "consécutif"],
  ["consecutifs", "consécutifs"],
  ["consecutive", "consécutive"],
  ["consecutives", "consécutives"],
  ["etrangers", "étrangers"],
  ["etranger", "étranger"],
  ["Etrangers", "Étrangers"],
  ["Etranger", "Étranger"],
  ["etrangere", "étrangère"],
  ["etrangeres", "étrangères"],
  ["feries", "fériés"], // adj "férié" always accented
  ["liee", "liée"], // past part fem; verb 3sg is `lie`
  ["liees", "liées"],
  ["Liee", "Liée"],
  ["Liees", "Liées"],
  ["securisee", "sécurisée"], // past part fem; verb 3sg is `sécurise`
  ["securisees", "sécurisées"],
  ["agrees", "agréés"], // past part of agréer; 2sg present is `agrées` (accented)
  ["Agrees", "Agréés"],
  ["agreees", "agréées"],
  ["incomplete", "incomplète"],
  ["incompletes", "incomplètes"],
  ["Incomplete", "Incomplète"],
  ["Incompletes", "Incomplètes"],
  ["reel", "réel"],
  ["reels", "réels"],
  ["reelle", "réelle"],
  ["reelles", "réelles"],
  ["Reel", "Réel"],
  ["Reels", "Réels"],
  ["estimees", "estimées"], // past part fem plur; verb forms differ
  ["Estimees", "Estimées"],
  ["basees", "basées"],
  ["Basees", "Basées"],
  ["imposees", "imposées"],
  ["demandee", "demandée"], // past part fem; verb 3sg `demande`, 2sg `demandes`
  ["demandees", "demandées"],
  // Past participles of various -ir verbs (always accented)
  ["defini", "défini"], // past part of définir (3sg present is `définit`)
  ["Defini", "Défini"],
  ["recu", "reçu"], // past part of recevoir
  ["Recu", "Reçu"],
  ["recus", "reçus"],
  ["Recus", "Reçus"],
  ["recue", "reçue"],
  ["recues", "reçues"],
  ["Repondre", "Répondre"], // infinitive
  ["repondu", "répondu"], // past part
  ["repondue", "répondue"],

  // Verbs in 3sg present that are always accented in valid French
  ["recoit", "reçoit"], // recevoir 3sg present
  ["designe", "désigne"], // désigner 3sg present (the unaccented form is never valid)
  ["designent", "désignent"],
  ["Designe", "Désigne"],
  // Note: `designes` (2sg present `désignes`) excluded — collides
  // with present-tense informal address forms.

  // Infinitives that are always accented
  ["Cooperer", "Coopérer"],
  ["cooperer", "coopérer"],
  ["cooperera", "coopérera"],
  ["Cooperera", "Coopérera"],
  ["coopereront", "coopéreront"],
  ["Verifier", "Vérifier"],
  ["Evaluer", "Évaluer"],
  ["Considerer", "Considérer"],

  // Adverbs / gerunds (always accented)
  ["prealable", "préalable"],
  ["Prealable", "Préalable"],
  ["prealables", "préalables"],
  ["precedant", "précédant"], // gerund of précéder
  ["decoulant", "découlant"],
  ["Decoulant", "Découlant"],
  ["evoluant", "évoluant"],
  ["Evoluant", "Évoluant"],
  ["expressement", "expressément"],
  ["Expressement", "Expressément"],
  ["demontrable", "démontrable"],
  ["generes", "générés"], // past part plur; 2sg present is `génères` (accented)
  ["generees", "générées"],
  ["Generes", "Générés"],

  // "écrit/écrite" as past participle and noun (always accented;
  // verb 3sg present of `écrire` is also `écrit` always accented —
  // the unaccented `ecrit/ecrite` never exists in modern French)
  ["ecrit", "écrit"],
  ["ecrite", "écrite"],
  ["ecrits", "écrits"],
  ["ecrites", "écrites"],
  ["Ecrit", "Écrit"],
  ["Ecrite", "Écrite"],

  // "Même" — only handle Title-Case at sentence start (lowercase
  // `meme` is genuinely ambiguous with the English/loanword "meme")
  ["Meme", "Même"],

  // Past participles in masculine singular for -ir verbs that are
  // always accented (the present 3sg ends in -t, not -i)
  ["etabli", "établi"], // établir → 3sg `établit`
  ["Etabli", "Établi"],
  ["etablis", "établis"],
  ["Etablis", "Établis"],

  // ── Pass 3: more legal-block coverage ────────────────────────────
  // ALL-CAPS variants of past participles / nouns appearing inside
  // legal "highlight" banners (always accented in modern French)
  ["RESPONSABILITE", "RESPONSABILITÉ"],
  ["RESPONSABILITES", "RESPONSABILITÉS"],
  ["LIMITEE", "LIMITÉE"], // past part fem; verb 3sg is `limite`
  ["LIMITEES", "LIMITÉES"],
  ["SPECIFIQUE", "SPÉCIFIQUE"],
  ["SPECIFIQUES", "SPÉCIFIQUES"],
  ["DECISION", "DÉCISION"],
  ["DECISIONS", "DÉCISIONS"],
  ["EXPRESSEMENT", "EXPRESSÉMENT"],
  ["DISPONIBILITE", "DISPONIBILITÉ"],
  ["RECONNAIT", "RECONNAÎT"],

  // Always-accented nouns
  ["Denomination", "Dénomination"],
  ["denomination", "dénomination"],
  ["evasion", "évasion"],
  ["Evasion", "Évasion"],
  ["schemas", "schémas"],
  ["Schemas", "Schémas"],
  ["materiel", "matériel"],
  ["Materiel", "Matériel"],
  ["materiels", "matériels"],
  ["integration", "intégration"],
  ["Integration", "Intégration"],
  ["integrations", "intégrations"],
  ["impot", "impôt"],
  ["Impot", "Impôt"],
  ["impots", "impôts"],
  ["Impots", "Impôts"],
  ["possibilite", "possibilité"],
  ["Possibilite", "Possibilité"],
  ["possibilites", "possibilités"],
  ["Possibilites", "Possibilités"],
  ["Disponibilite", "Disponibilité"],
  ["disponibilite", "disponibilité"],
  ["disponibilites", "disponibilités"],
  ["opportunites", "opportunités"],
  ["Opportunites", "Opportunités"],
  ["opportunite", "opportunité"],
  ["Opportunite", "Opportunité"],
  ["reputation", "réputation"],
  ["Reputation", "Réputation"],
  ["adequation", "adéquation"],
  ["Adequation", "Adéquation"],
  ["scenarios", "scénarios"],
  ["Scenarios", "Scénarios"],
  ["scenario", "scénario"],
  ["Scenario", "Scénario"],
  ["modele", "modèle"],
  ["Modele", "Modèle"],
  ["modeles", "modèles"],
  ["Modeles", "Modèles"],
  ["resultat", "résultat"],
  ["Resultat", "Résultat"],
  ["Residence", "Résidence"],
  ["residence", "résidence"],
  ["residences", "résidences"],
  ["comptabilite", "comptabilité"],
  ["Comptabilite", "Comptabilité"],
  ["representant", "représentant"],
  ["Representant", "Représentant"],
  ["representants", "représentants"],
  ["Representants", "Représentants"],
  ["retractation", "rétractation"],
  ["Retractation", "Rétractation"],
  ["Applicabilite", "Applicabilité"],
  ["applicabilite", "applicabilité"],
  // NOTE: `categorie/categories` excluded — `categories` is used as
  // a JS object key (`categories: {`) in this file, so a global
  // text replacement would corrupt the i18n key tree. Title-cased
  // variants in user text are handled per-line below.
  ["periode", "période"],
  ["Periode", "Période"],
  ["periodes", "périodes"],
  ["Periodes", "Périodes"],
  ["interet", "intérêt"],
  ["Interet", "Intérêt"],
  ["interets", "intérêts"],
  ["Interets", "Intérêts"],

  // Adjectives always accented
  ["financiere", "financière"],
  ["Financiere", "Financière"],
  ["financieres", "financières"],
  ["Financieres", "Financières"],
  ["legaux", "légaux"], // never used in CSS class names
  ["Legaux", "Légaux"],
  ["hypothetique", "hypothétique"],
  ["Hypothetique", "Hypothétique"],
  ["hypothetiques", "hypothétiques"],
  ["Hypothetiques", "Hypothétiques"],
  ["entierement", "entièrement"],
  ["Entierement", "Entièrement"],
  ["europeenne", "européenne"],
  ["Europeenne", "Européenne"],
  ["europeennes", "européennes"],
  ["europeens", "européens"],
  ["europeen", "européen"],
  ["Europeen", "Européen"],
  ["anterieures", "antérieures"],
  ["anterieure", "antérieure"],
  ["anterieurs", "antérieurs"],
  ["anterieur", "antérieur"],
  ["preferee", "préférée"],
  ["Preferee", "Préférée"],
  ["preferees", "préférées"],

  // Past participles fem (-ee suffix is unambiguous; verb 2sg
  // present ends in -es without accent collision)
  ["constituee", "constituée"],
  ["Constituee", "Constituée"],
  ["constituees", "constituées"],
  ["Constituees", "Constituées"],
  ["enregistree", "enregistrée"],
  ["Enregistree", "Enregistrée"],
  ["enregistrees", "enregistrées"],
  ["Enregistrees", "Enregistrées"],
  ["recommandee", "recommandée"],
  ["Recommandee", "Recommandée"],
  ["recommandees", "recommandées"],
  ["Recommandees", "Recommandées"],
  ["autorisee", "autorisée"],
  ["Autorisee", "Autorisée"],
  ["autorisees", "autorisées"],
  ["Autorisees", "Autorisées"],
  ["integree", "intégrée"],
  ["integrees", "intégrées"],
  ["Integree", "Intégrée"],
  ["Integrees", "Intégrées"],
  ["protegee", "protégée"],
  ["Protegee", "Protégée"],
  ["protegees", "protégées"],
  ["reservee", "réservée"],
  ["Reservee", "Réservée"],
  ["reservees", "réservées"],
  ["Reservees", "Réservées"],

  // Verb 1pl present forms always accented (unambiguous)
  ["representons", "représentons"],
  ["Representons", "Représentons"],
  ["redigeons", "rédigeons"],
  ["Redigeons", "Rédigeons"],

  // Infinitives always accented
  ["Preparer", "Préparer"],
  ["preparer", "préparer"],
  ["Declarer", "Déclarer"],
  ["declarer", "déclarer"],
  ["Deposer", "Déposer"],
  ["deposer", "déposer"],
  ["transferer", "transférer"],
  ["Transferer", "Transférer"],
  ["presenter", "présenter"],
  ["Presenter", "Présenter"],

  // Verb 3sg present always accented (`reserver` 3sg `réserve`,
  // unaccented `reserve` never valid in French)
  ["reserve", "réserve"],
  ["Reserve", "Réserve"],
  ["reserves", "réserves"], // noun plural / 3sg verb (also accented)
  ["Reserves", "Réserves"],

  // 3pl present of `dépendre` always accented; in this French file,
  // `dependent` is exclusively the French verb (no English use)
  ["dependent", "dépendent"],
  ["Dependent", "Dépendent"],

  // ── Pass 4: final accent-restoration sweep ───────────────────────
  // Past participle / 3sg of -mettre verbs (always accented)
  ["emis", "émis"],
  ["Emis", "Émis"],
  ["EMIS", "ÉMIS"],
  ["emise", "émise"],
  ["emises", "émises"],
  // Past participle fem of -er verbs whose -ee ending makes them
  // unambiguous (verb 2sg present ends in -es no accent)
  ["simplifiee", "simplifiée"],
  ["simplifiees", "simplifiées"],
  ["Simplifiee", "Simplifiée"],
  ["Simplifiees", "Simplifiées"],
  ["renouvelee", "renouvelée"],
  ["Renouvelee", "Renouvelée"],
  ["renouvelees", "renouvelées"],
  ["privee", "privée"],
  ["Privee", "Privée"],
  ["privees", "privées"],
  ["Privees", "Privées"],
  // 2sg present of `déterminer` is `tu détermines` (always
  // accented), so unaccented `determines` is never valid French
  ["determines", "déterminés"],
  ["Determines", "Déterminés"],
  ["determinee", "déterminée"],
  ["determinees", "déterminées"],
  // Always-accented nouns / adjectives that surfaced in the audit
  ["Cooperation", "Coopération"],
  ["cooperation", "coopération"],
  ["educative", "éducative"],
  ["educatives", "éducatives"],
  ["identite", "identité"],
  ["Identite", "Identité"],
  ["identites", "identités"],
  ["Identites", "Identités"],
  ["perimetre", "périmètre"],
  ["Perimetre", "Périmètre"],
  ["perimetres", "périmètres"],
  // Always-accented past participles fem (verb 3sg differs)
  ["securise", "sécurisé"], // verb 3sg `sécurise` IS accented; `securise` (no accent) never valid
  ["Securise", "Sécurisé"],
  // `securises` (no -ee/-ée): excluded — collides with 2sg present `tu sécurises` (no accent)
  // Past participle fem of `commencer` (3sg present is `commence` — collision); excluded
  // Always-accented adjective
  ["operationnel", "opérationnel"],
  ["operationnelle", "opérationnelle"],
  ["operationnels", "opérationnels"],
  ["operationnelles", "opérationnelles"],

  // ── Pass 5: final SAFE always-accented & -ee past-part sweep ─────
  // -ees feminine past participles (verb 2sg/3sg present has no -ee ending)
  ["anonymisee", "anonymisée"],
  ["anonymisees", "anonymisées"],
  ["destinee", "destinée"],
  ["destinees", "destinées"],
  ["Destinee", "Destinée"],
  ["utilisee", "utilisée"],
  ["utilisees", "utilisées"],
  ["traitee", "traitée"],
  ["traitees", "traitées"],
  ["securisee", "sécurisée"],
  ["securisees", "sécurisées"],
  // -er verb 2sg present forms that are ALWAYS accented (`tu sécurises`,
  // `tu opères`, `tu agrées`), so unaccented variants are never valid French
  ["securises", "sécurisés"], // past-part plural; 2sg present `tu sécurises` is accented
  ["agree", "agréé"],
  ["agrees", "agréés"],
  ["agreee", "agréée"],
  ["agreees", "agréées"],
  ["opere", "opère"],
  ["operes", "opères"],
  // Always-accented infinitives / adverbs / nouns / adjectives
  ["acceder", "accéder"],
  ["Acceder", "Accéder"],
  ["legitime", "légitime"],
  ["Legitime", "Légitime"],
  ["legitimes", "légitimes"],
  ["resoudre", "résoudre"],
  ["Resoudre", "Résoudre"],
  ["reactiver", "réactiver"],
  ["Reactiver", "Réactiver"],
  ["indefiniment", "indéfiniment"],
  ["cloture", "clôture"],
  ["Cloture", "Clôture"],
  ["clotures", "clôtures"],
  ["Clotures", "Clôtures"],
  ["exercons", "exerçons"],
  ["intermediaire", "intermédiaire"],
  ["intermediaires", "intermédiaires"],
  ["pieces", "pièces"], // noun "pieces" plural; no common French verb collision
  ["Eviter", "Éviter"],
  ["eviter", "éviter"],
  ["penalite", "pénalité"],
  ["penalites", "pénalités"],
  ["Penalite", "Pénalité"],
  ["Penalites", "Pénalités"],
  ["deduction", "déduction"],
  ["deductions", "déductions"],
  ["Deduction", "Déduction"],
  ["Deductions", "Déductions"],
  ["regles", "règles"], // noun "règles" / 2sg present `tu règles` always accented
  ["Regles", "Règles"],
  ["entiere", "entière"],
  ["entieres", "entières"],
  ["Entiere", "Entière"],
  ["hypothese", "hypothèse"],
  ["hypotheses", "hypothèses"],
  ["Hypothese", "Hypothèse"],
  ["Hypotheses", "Hypothèses"],
  // Past participle of `être` — always accented
  ["ete", "été"],
];

// Letters/digits/underscore for Unicode-aware boundaries
const UB = "(?<![\\p{L}\\p{N}_])";
const UE = "(?![\\p{L}\\p{N}_])";

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Sort longest first
PAIRS.sort((a, b) => b[0].length - a[0].length);

const text = await readFile(FILE, "utf8");
let out = text;
let total = 0;
const counts = [];
for (const [src, dst] of PAIRS) {
  if (src === dst) continue;
  const re = new RegExp(`${UB}${escape(src)}${UE}`, "gu");
  let n = 0;
  out = out.replace(re, () => {
    n++;
    return dst;
  });
  if (n > 0) counts.push([src, dst, n]);
  total += n;
}

if (total > 0) {
  await writeFile(FILE, out, "utf8");
}

console.log(`fr-accent-restore: ${total} substitution(s) in ${FILE}`);
for (const [src, dst, n] of counts) {
  console.log(`  ${n.toString().padStart(3)}× ${src} → ${dst}`);
}
