export default `Wenn Sie anfangen, Geld mit Ihrer LLC zu bewegen, werden Sie auf drei Abkürzungen stoßen, die immer wieder auftauchen: **IBAN**, **SWIFT** (oder BIC) und **Routing Number**. Sie sind wie die Postadresse Ihres Bankkontos, aber für Geld.

Wir erklären jeden einzelnen klar und verständlich, damit Sie nie wieder denken müssen: „Welchen Code soll ich diesem Kunden geben?"

## Routing Number (ABA Number)

Das ist der Code, der eine Bank innerhalb der Vereinigten Staaten identifiziert. Er hat **9 Ziffern** und wird ausschließlich für Inlandsüberweisungen innerhalb der USA verwendet.

**Beispiel:** 084106768

### Wann brauchen Sie ihn?

- Um **ACH**-Zahlungen von amerikanischen Kunden zu empfangen
- Um **inländische Wire-Überweisungen** innerhalb der USA zu empfangen
- Um automatische Zahlungen einzurichten (Gehälter, Abonnements)
- Um Ihr Konto mit Stripe, PayPal, Amazon zu verbinden

### Wo finden Sie ihn?

In Mercury: Dashboard → Account Details → "Routing Number"

**Wichtiger Hinweis:** Mercury hat **zwei Routing Numbers**: eine für ACH und eine für Wire. Stellen Sie sicher, dass Sie je nach Überweisungsart die richtige angeben.

## SWIFT / BIC Code

Der **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) oder **BIC** (Bank Identifier Code) ist der Code, der eine Bank auf internationaler Ebene identifiziert. Er hat zwischen **8 und 11 Zeichen** (Buchstaben und Zahlen).

**Beispiel:** CHASUS33 (JPMorgan Chase)

### Wann brauchen Sie ihn?

- Um **internationale Wire-Überweisungen** von außerhalb der USA zu empfangen
- Damit ein Kunde in Europa, Lateinamerika oder Asien Ihnen Geld senden kann

### Warum unterscheidet er sich von der Routing Number?

Die Routing Number ist für das amerikanische Inlandssystem (ACH/Fedwire). Der SWIFT ist für das internationale System. Es sind zwei verschiedene Zahlungsnetzwerke.

## IBAN (International Bank Account Number)

Die **IBAN** ist ein standardisiertes Kontonummernformat, das in Europa, dem Nahen Osten und Teilen Lateinamerikas verwendet wird. Sie hat zwischen **15 und 34 Zeichen** (variiert je nach Land) und enthält den Ländercode, die Bank und die Kontonummer.

**Beispiel:** DE89 3704 0044 0532 0130 00 (Deutschland)

### Haben amerikanische Konten eine IBAN?

**Nein.** Die Vereinigten Staaten verwenden das IBAN-System nicht. Amerikanische Konten verwenden Routing Number + Account Number.

Wenn ein europäischer Kunde Sie nach Ihrer IBAN fragt, um Sie zu bezahlen, lautet die Antwort: „Ich habe keine IBAN. hier sind meine Routing Number, Account Number und mein SWIFT Code für internationale Wire-Überweisungen."

### Und wenn Sie Zahlungen aus Europa empfangen müssen?

Hier glänzt **Wise Business**. Wise gibt Ihnen eine europäische IBAN (mit Präfix BE oder DE), die mit Ihrem Konto verknüpft ist. Europäische Kunden können Sie per SEPA bezahlen, als wäre es eine lokale Überweisung, ohne Gebühren für internationale Wire-Überweisungen.

## Kurze Zusammenfassung

| Code | Was ist das | Stellen | Verwendet in | Wofür |
|---|---|---|---|---|
| Routing Number | Bank-ID in den USA | 9 | USA | ACH und inländische Wires |
| SWIFT/BIC | Internationale Bank-ID | 8-11 | Weltweit | Internationale Wires |
| IBAN | Internationale Kontonr. | 15-34 | Europa, MENA, LatAm | SEPA-Überweisungen |
| Account Number | Ihre Kontonummer | 10-17 | USA | Identifikation Ihres Kontos |

## Welche Daten geben Sie welchem Kundentyp?

### Amerikanischer Kunde
- **Routing Number** (ACH oder Wire je nach Zahlungsart)
- **Account Number**
- **Name der LLC** (als Begünstigter)

### Europäischer Kunde
- **SWIFT Code** + **Account Number** + **Routing Number** für internationale Wire-Überweisung
- Oder besser: **Europäische IBAN von Wise** damit er per SEPA zahlt (günstiger und schneller)

### Lateinamerikanischer Kunde
- **SWIFT Code** + **Account Number** + **Routing Number** für internationale Wire-Überweisung
- Oder: **Lokale Wise-Daten** wenn das Land ein lokales Konto verfügbar hat

## Der Trick, um günstiger zu kassieren: lokale Konten

Hier kommt ein Tipp, der Gold wert ist: Wenn Sie Kunden in Europa haben, die Sie regelmäßig bezahlen, **geben Sie ihnen NICHT Ihre internationalen Wire-Daten**. Geben Sie ihnen Ihre **europäische IBAN von Wise Business**.

Warum? Eine internationale Wire-Überweisung USA→Europa kann den Zahler 20-50€ kosten und 2-5 Tage dauern. Eine SEPA-Überweisung über das Wise-Konto Ihrer LLC kostet 0-1€ und kommt in 1 Tag an.

Wise (das eine EMI ist, keine Bank) generiert lokale Konten in mehreren Ländern:
- **Europäische IBAN** (Präfix BE oder DE) für SEPA-Einzüge
- **USD-Daten** für amerikanische Kunden (Routing + Account Number)
- **Sort Code** für britische Kunden
- **BSB** für Kunden in Australien

Ihre Kunden zahlen wie bei einer lokalen Überweisung. Sie empfangen in Ihrem Multi-Währungs-Guthaben bei Wise und überweisen dann zu Mercury, wenn es Ihnen passt.

## Mercury: Bankdaten, die Sie brauchen

Für Mercury geben Sie Ihren Kunden folgende Daten:

- **Routing Number ACH:** Für inländische ACH-Einzüge (Zahlungen von US-Kunden, Einzahlungen von Stripe/PayPal)
- **Routing Number Wire:** Für inländische Wire-Überweisungen (Achtung: unterscheidet sich von der ACH-Nummer)
- **Account Number:** Ihre Kontonummer
- **SWIFT Code:** Für eingehende internationale Wire-Überweisungen
- **Bankadresse:** Column NA, San Francisco, CA

Mercury hat $0 Wire-Gebühren. sowohl national als auch international, Ihre Gelder werden bei Column NA mit FDIC-Versicherung verwahrt.

Bei Exentax richten wir alle Zahlungskanäle vom ersten Tag an für Sie ein. Wir sagen Ihnen genau, welche Daten Sie welchem Kundentyp geben müssen, damit das Geld schnell und ohne Überraschungen ankommt. Vereinbaren Sie Ihre kostenlose Beratung.`;
