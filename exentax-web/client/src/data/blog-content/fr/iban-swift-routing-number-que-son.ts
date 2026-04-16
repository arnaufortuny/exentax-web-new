export default `Quand vous commencez à gérer l'argent de votre LLC, vous allez rencontrer trois acronymes qui reviennent sans cesse : **IBAN**, **SWIFT** (ou BIC) et **Routing Number**. Ce sont comme l'adresse postale de votre compte bancaire, mais pour l'argent.

Nous allons expliquer chacun d'entre eux de manière claire pour que vous ne vous demandiez plus jamais « lequel dois-je donner à ce client ? »

## Routing Number (ABA Number)

C'est le code qui identifie une banque aux États-Unis. Il comporte **9 chiffres** et est utilisé exclusivement pour les virements domestiques au sein des États-Unis.

**Exemple :** 084106768

### Quand en avez-vous besoin ?

- Pour recevoir des paiements **ACH** de clients américains
- Pour recevoir des **virements domestiques** au sein des États-Unis
- Pour configurer des paiements automatiques (salaires, abonnements)
- Pour connecter votre compte avec Stripe, PayPal, Amazon

### Où le trouver ?

Sur Mercury : Dashboard → Account Details → "Routing Number"

**Note importante :** Mercury possède **deux routing numbers**: un pour ACH et un autre pour Wire. Assurez-vous de donner le bon selon le type de virement.

## SWIFT / BIC Code

Le **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) ou **BIC** (Bank Identifier Code) est le code qui identifie une banque au niveau international. Il comporte entre **8 et 11 caractères** (lettres et chiffres).

**Exemple :** CHASUS33 (JPMorgan Chase)

### Quand en avez-vous besoin ?

- Pour recevoir des **virements internationaux** depuis l'extérieur des États-Unis
- Pour qu'un client en Europe, en Amérique latine ou en Asie vous envoie de l'argent

### Pourquoi est-il différent du Routing Number ?

Le Routing Number est pour le système domestique américain (ACH/Fedwire). Le SWIFT est pour le système international. Ce sont deux réseaux de paiement différents.

## IBAN (International Bank Account Number)

L'**IBAN** est un format standardisé de numéro de compte utilisé en Europe, au Moyen-Orient et dans certaines parties de l'Amérique latine. Il comporte entre **15 et 34 caractères** (variable selon le pays) et contient le code du pays, de la banque et du compte.

**Exemple :** FR76 3000 6000 0112 3456 7890 189 (France)

### Les comptes américains ont-ils un IBAN ?

**Non.** Les États-Unis n'utilisent pas le système IBAN. Les comptes américains utilisent le Routing Number + Account Number.

Si un client européen vous demande votre IBAN pour vous payer, la réponse est : « Je n'ai pas d'IBAN. voici mon Routing Number, Account Number et SWIFT Code pour un virement international. »

### Et si vous devez recevoir des paiements d'Europe ?

C'est là que **Wise Business** brille. Wise vous donne un IBAN européen (avec le préfixe BE ou DE) lié à votre compte. Les clients européens peuvent vous payer par SEPA comme s'il s'agissait d'un virement local, sans frais de virement international.

## Résumé rapide

| Code | Qu'est-ce que c'est | Chiffres | Utilisé dans | Pour quoi |
|---|---|---|---|---|
| Routing Number | ID de la banque aux États-Unis | 9 | États-Unis | ACH et virements domestiques |
| SWIFT/BIC | ID de la banque internationale | 8-11 | Mondial | Virements internationaux |
| IBAN | N° de compte international | 15-34 | Europe, MENA, LatAm | Virements SEPA |
| Account Number | N° de votre compte | 10-17 | États-Unis | Identifier votre compte |

## Quelles informations donner à chaque type de client ?

### Client américain
- **Routing Number** (ACH ou Wire selon le type de paiement)
- **Account Number**
- **Nom de la LLC** (comme bénéficiaire)

### Client européen
- **SWIFT Code** + **Account Number** + **Routing Number** pour un virement international
- Ou mieux : **IBAN européen de Wise** pour qu'il paie par SEPA (moins cher et plus rapide)

### Client latino-américain
- **SWIFT Code** + **Account Number** + **Routing Number** pour un virement international
- Ou : **coordonnées locales de Wise** si le pays dispose d'un compte local disponible

## L'astuce pour encaisser moins cher : les comptes locaux

Voici un conseil qui vaut de l'or : si vous avez des clients en Europe qui vous paient régulièrement, **NE leur donnez PAS vos coordonnées de virement international**. Donnez-leur votre **IBAN européen de Wise Business**.

Pourquoi ? Un virement international États-Unis→Europe peut coûter au payeur 20-50€ et prendre 2 à 5 jours. Un SEPA depuis le compte Wise de votre LLC coûte 0-1€ et arrive en 1 jour.

Wise (qui est un EMI, pas une banque) vous génère des comptes locaux dans plusieurs pays :
- **IBAN européen** (préfixe BE ou DE) pour les encaissements SEPA
- **Coordonnées USD** pour les clients américains (routing + account number)
- **Sort code** britannique pour les clients UK
- **BSB** australien pour les clients en Australie

Vos clients paient comme s'il s'agissait d'un virement local, vous recevez sur votre solde multidevise Wise puis transférez vers Mercury quand cela vous convient.

## Mercury : coordonnées bancaires dont vous avez besoin

Pour Mercury, les informations que vous donnerez à vos clients sont :

- **Routing Number ACH :** Pour les encaissements ACH domestiques (paiements de clients US, dépôts de Stripe/PayPal)
- **Routing Number Wire :** Pour les virements domestiques (attention : il est différent de celui de l'ACH)
- **Account Number :** Votre numéro de compte
- **SWIFT Code :** Pour les virements internationaux entrants
- **Adresse de la banque :** Column NA, San Francisco, CA

Mercury facture $0 de frais de virement. aussi bien nationaux qu'internationaux. Vos fonds sont conservés chez Column NA avec une assurance FDIC.

Chez Exentax, nous configurons tous vos canaux d'encaissement dès le premier jour. Nous vous indiquons exactement quelles informations donner à chaque type de client pour que l'argent arrive rapidement et sans surprises. Réservez votre consultation gratuite.`;
