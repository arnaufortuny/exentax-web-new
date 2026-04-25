export default `Wenn jemand fragt "sieht das Finanzamt, was ich mit der Karte bezahle?", lautet die kurze Antwort: Es kommt darauf an, wer die Karte ausgegeben hat, wo der Händler sitzt und in welchem Land Sie steuerlich ansässig sind. Die lange Antwort verlangt zu verstehen, wie das Karten-Ökosystem unter der Haube tatsächlich funktioniert und welche Meldepflichten wirklich existieren. Rund um Visa und Mastercard kursiert viel Mythos, und es lohnt, diesen von dem zu trennen, was wirklich passiert mit Ihrer <a href="/de/blog/wise-iban-und-llc-was-wirklich-an-die-steuerbehoerde">Wise-Karte zu einer US-LLC</a>, mit Ihrer deutschen Bankkarte oder mit Ihrer <a href="/de/blog/revolut-business-und-crs-was-ihrer-steuerbehorde-gemeldet">Revolut-Karte</a>.

Dieser Artikel beleuchtet, wer wer ist in einer Kartentransaktion, was jeder Akteur an die Steuerbehörden meldet und welche Karten-bezogenen Meldungen es Land für Land gibt (Modelo 196 und 171 in Spanien, DAS2 in Frankreich, Modelo 38 in Portugal, unter anderem).

## Das Vier-Parteien-Modell: Issuer, Netzwerk, Acquirer, Händler

Bei jeder Kartenzahlung wirken vier sehr unterschiedliche Akteure mit:

- **Issuer (Kartenherausgeber)**: die Einheit, die Ihre Karte ausgegeben hat und das Konto führt, von dem das Geld abfließt. Das kann eine traditionelle Bank sein (Deutsche Bank, Erste Bank), eine EMI (Wise Europe SA, Revolut Bank UAB) oder ein Prepaid-Issuer.
- **Netzwerk oder Scheme**: Visa, Mastercard, American Express, JCB, UnionPay. Sie führen weder Ihr Konto noch das des Händlers: Sie routen die Autorisierungsnachricht zwischen Issuer und Acquirer und orchestrieren die Settlement-Prozesse.
- **Acquirer**: die Finanzeinheit, die den Händler unter Vertrag hat und ihm den Betrag gutschreibt. In Europa sind das Namen wie Adyen, Stripe, Worldline, Concardis sowie die großen nationalen Bankacquirer.
- **Händler (Merchant)**: das Unternehmen, das einnimmt. Identifiziert über einen Merchant Category Code (MCC) und eine eindeutige ID im Netzwerk.

Diese Kette zu verstehen ist entscheidend: Kein Akteur "sieht" den ganzen Film. Jeder sieht nur sein Segment.
### Was jeder Akteur sieht und was nicht

| Akteur | Was er im Detail kennt |
| --- | --- |
| Issuer | Ihre Identität, Ihr Konto, jede Belastung mit Betrag, Währung, Datum, MCC und Händlernamen |
| Netzwerk (Visa/Mastercard) | Autorisierungsnachrichten zwischen Issuer und Acquirer, aggregierte Daten für Settlement, Fraud und Disputes |
| Acquirer | Identität des Händlers, jede Einnahme, Betrag, Währung, Kartenmarke und Issuer-BIN |
| Händler | Eigene Einnahme, letzte 4 Stellen, Marke, Ausstellungsland und, wenn Sie eine Rechnung verlangen, Ihre Daten |

Was **keiner** von ihnen systematisch tut: jede Transaktion live an das Finanzamt jedes Landes jedes Karteninhabers melden. Das ist schlicht nicht ihre Rolle.
### Der häufigste (und falsche) Mythos über Visa und Mastercard

Es kursiert die Vorstellung "weil Visa und Mastercard amerikanisch sind und alles über sie läuft, melden sie schon alles an alle Finanzämter der Welt". Stimmt nicht:

- **Visa Inc.** und **Mastercard Inc.** sind **Zahlungsverarbeitungs-Netzwerke**, keine Verwahrstellen. Sie führen keine Endkundenkonten und sind daher keine "meldepflichtigen Finanzinstitute" im Sinne von CRS oder FATCA.
- Sie **melden nicht** die Einzelumsätze jedes Karteninhabers an das deutsche Bundeszentralamt für Steuern, an die spanische AEAT, an die französische DGFiP oder an irgendeine andere nationale Steuerbehörde als automatischen Strom.
- Sie kooperieren bei konkreten Ermittlungen mit Steuer- und Justizbehörden über formale Anfragen, wie jedes andere datenführende Unternehmen.

Wer Meldepflichten unterliegt, ist der **Karten-Issuer** (in seinen nationalen Meldungen) und auf Händlerseite der **Acquirer** in seiner eigenen Buchhaltung und in den jeweils geltenden landesspezifischen Meldungen.
### Was der Issuer in Spanien tatsächlich meldet

In Spanien reichen nationale Issuer mehrere informationspflichtige Meldungen ein, die für Karten und Konten relevant sind:

- **Modelo 196**: jährliche Meldung über Konten bei Kreditinstituten. Sie identifiziert Inhaber und Bevollmächtigte, die Stände zum 31. Dezember und in vielen Fällen die Durchschnittsstände des vierten Quartals. Erfasst das Konto hinter der Karte, nicht jede Bewegung.
- **Modelo 171**: jährliche Meldung über Einzahlungen, Auszahlungen und Kartenzahlungen oberhalb bestimmter Schwellen.
- **Modelo 170**: Meldung über Vorgänge von Unternehmern oder Freiberuflern, die einem Karteneinzugssystem angeschlossen sind. Hier melden die **Acquirer** die an Händler ausgezahlten Beträge, nicht die Zahlungen, die Sie als Konsument leisten.
- **Modelo 199**: Identifizierung von Konten mit steuerlicher Relevanz.

Wer als Konsument in Spanien eine Karte nutzt und sein Konto bei einer spanischen Bank hat, befindet sich praktisch innerhalb des Perimeters, den die AEAT regelmäßig konsultieren kann.
## Das Pendant in anderen europäischen Ländern

Das Schema ändert sich von Jurisdiktion zu Jurisdiktion. Einige repräsentative Beispiele:

- **Frankreich – DAS2**: jährliche Meldung über Honorare, Provisionen und sonstige an Dritte gezahlte Erträge. Für Karten leistet die **DGFiP** die Hauptarbeit, indem sie diese Meldung mit den Daten der jeweiligen Bank kombiniert. Frankreich verlangt zusätzlich die Erklärung von **Auslandskonten** (Formular 3916), was in der Regel auch Wise- oder Revolut-IBANs einschließt.
- **Portugal – Modelo 38**: jährliche Meldung über Überweisungen und Mittel ins Ausland. **Modelo 40** ergänzt um Wertpapiergeschäfte. Zusammen mit der Pflicht zur Erklärung ausländischer Konten in der <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> entsteht ein dem spanischen ähnliches Kontrollperimeter.
- **Deutschland**: kein direktes Pendant zum Modelo 196, aber deutsche Banken betreiben das Kontenabrufverfahren, das es dem Bundeszentralamt für Steuern erlaubt, Inhaberschaft an Konten und Einlagen jedes Residenten auf Antrag einer zuständigen Behörde abzurufen. Kartenausgaben werden nicht automatisch gemeldet, aber das Konto ist voll zugänglich. In Österreich greift das Kontenregister beim BMF analog.
- **Italien**: das Anagrafe dei Rapporti Finanziari (Archivio dei Rapporti) sammelt jährlich Salden, aggregierte Bewegungen und Kartendaten, die italienische Finanzintermediäre an die Agenzia delle Entrate liefern. Eines der dichtesten Schemata in Europa.
- **Vereinigtes Königreich**: HMRC erhält aggregierte Daten von Banken über Schemata wie Bulk Data Gathering, zusätzlich zum CRS-Reporting für Nicht-Residenten.

Die allgemeine Regel: **Konto und Inhaberschaft sind gut erfasst**, während das **Detail auf Transaktionsebene** nicht standardmäßig fließt; es wird nur in einer konkreten Prüfung rekonstruiert.
## Der Fall des ausländischen Issuers: Wise, Revolut & Co.

Wenn Ihre Karte von einer europäischen EMI ausgegeben wird, die keine deutsche oder österreichische Bank ist (typischerweise Wise Europe SA in Belgien oder Revolut Bank UAB in Litauen), ändert sich die Lage:

- Diese Issuer **reichen die spanischen Meldungen (196, 171, 170, 199) nicht ein** und auch keine deutschen Bankenmeldungen. Diese Pflichten gelten für Finanzeinheiten mit Sitz oder Niederlassung im jeweiligen Land.
- Sie unterliegen aber dem **CRS** aus ihrer Heimatjurisdiktion. Wise Europe SA meldet an die belgische, Revolut Bank UAB an die litauische Steuerbehörde, die die Daten an das Wohnsitzland des Inhabers weiterleiten, mit Saldo zum 31. Dezember und Erträgen, wie wir es in <a href="/de/blog/crs-und-ihre-us-llc-bankkonten-was-mit-ihrem-heimatland">CRS für LLC-Bankkonten</a> beschreiben.
- Das **Detail jedes Karteneinkaufs läuft nicht über CRS**. Übermittelt werden Endsaldo, Identität des Inhabers und, falls das Konto einer als Passive NFE klassifizierten Einheit gehört, die Controlling Persons.

Konsequenz: Eine Kartenzahlung von einer deutschen Bank taucht aggregiert in den dem Finanzamt zugänglichen Datenbeständen auf; dieselbe Zahlung mit einer Wise- oder Revolut-Karte wird nicht direkt an das deutsche Finanzamt gemeldet, aber der Kontosaldo wandert über CRS aus Belgien oder Litauen.

Die vernünftige Schlussfolgerung ist nicht "die ausländische Karte macht mich unsichtbar", sondern dass **die Spur in einer anderen Schicht existiert**: Das Konto ist identifiziert, Salden werden gemeldet und Bewegungen können in einem Verfahren angefordert werden.
### Und der Acquirer beim Händler: das andere Ende der Leitung

Den Acquirer vergisst man oft. Wenn ein spanischer Händler Karten akzeptiert, reicht sein spanischer Acquirer das **Modelo 170** mit dem Jahresaggregat seiner Karteneinnahmen ein. Ist dieser Händler eine Einzelperson, die Einnahmen unterdeklariert, kreuzt die AEAT das Modelo 170 mit der Erklärung und die Diskrepanz wird sichtbar. Das betrifft den Konsumenten nicht, erklärt aber, warum unterdeklarierte Karteneinnahmen so schnell auffallen.

Für einen Unternehmer mit US-LLC, der Endkunden über Stripe US oder einen Merchant of Record wie DoDo Payments abrechnet, sieht der Fluss anders aus: Der Acquirer sitzt außerhalb Europas, kein Modelo 170 wird eingereicht, die Einnahmen landen auf Mercury oder Wise. Die Nachvollziehbarkeit für das Finanzamt läuft dann über Saldo und Erträge via CRS, nicht über den Acquirer.
### Was das Finanzamt von Ihren Kartenzahlungen wirklich sehen kann

Übersetzt für eine in Deutschland, Österreich oder Spanien ansässige Person mit einer Mischung aus lokaler Bank, ausländischer Fintech und gegebenenfalls einer <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a>:

Was das Finanzamt regelmäßig konsultieren kann:

- Inländische Bankkonten, deren Inhaber oder Bevollmächtigter Sie sind.
- Aggregierte Karteneinnahmen eines inländischen Händlers (in Spanien Modelo 170).
- Salden zum 31. Dezember und Erträge ausländischer Konten via CRS aus dem Land des Issuers.
- Auslandskonten, die Sie selbst melden (Modelo 720 in Spanien, Anlage AUS bzw. Hinweispflichten in DACH).

Was nicht automatisch ankommt:

- Das Detail jeder einzelnen Kartenzahlung, weder im Inland noch im Ausland.
- Die Liste der Händler, bei denen Sie als Konsument einkaufen.
- Einzelbeträge unterhalb der nationalen Schwellen.

Was im Verfahren angefordert werden kann:

- Der vollständige Kontoauszug direkt beim Issuer im Inland und im Ausland über punktuellen Austausch.
- Gezielte Informationen vom Kartennetzwerk oder vom Händler in fortgeschrittenen Ermittlungen.
## Häufige Fehler, die wir jede Woche sehen

1. **"Visa und Mastercard melden alles live ans Finanzamt."** Falsch. Das sind Verarbeitungsnetzwerke, keine meldepflichtigen Einheiten oder Endausgeber.
2. **"Mit einer ausländischen Karte sind meine Einkäufe unsichtbar."** Das Detail wird nicht automatisch gemeldet, aber das Konto ist über CRS sichtbar und die Spur ist perfekt rekonstruierbar.
3. **"Modelo 171 sorgt dafür, dass das Finanzamt jeden meiner Einkäufe sieht."** Nein: 171 erfasst Vorgänge oberhalb von Schwellen und Aggregate, nicht jeden privaten Kauf darunter.
4. **"Wenn meine LLC über Stripe einnimmt, ist das schon im Inland gemeldet."** Nicht direkt: Stripe US reicht kein Modelo 170 ein und Informationen über Ihre LLC erreichen das Finanzamt über andere Kanäle (Mercury via FATCA asymmetrisch, Wise via CRS, Ihr eigenes 720 falls einschlägig).
5. **"Besser immer mit der ausländischen Karte zahlen, um keine Spur zu hinterlassen."** Die Spur existiert, und ein Vorgehen, das offensichtlich darauf zielt, keine Spur zu hinterlassen, ist genau das Muster, das in einer Prüfung am schnellsten Alarm auslöst.
6. **"Der Acquirer des europäischen Händlers, bei dem ich einkaufe, meldet meinen Konsum ans Finanzamt."** Nein: Der Acquirer meldet die Einnahmen seines eigenen Händlers, nicht die Daten des Konsumenten.
### Warum das für Ihre Struktur zählt

Wenn Sie eine US-LLC, ein Mercury-Konto, ein Wise Business mit Karte, ein Revolut Business und eine Karte Ihrer deutschen Bank für den Alltag kombinieren, haben Sie kein "Verschleierungsproblem": Sie haben eine Landkarte unterschiedlicher Spuren, jede mit eigener steuerlicher Sichtbarkeit. Die richtige Frage ist nicht "welche Karte verwende ich, damit das Finanzamt nichts merkt?", sondern "wie passen diese Bausteine zu meinem Wohnsitz, meinen Erklärungen und der Verwaltungsdoktrin, die auf meine LLC anwendbar ist?". Wir behandeln das in <a href="/de/blog/gestaltung-einer-soliden-internationalen-steuerstruktur">Gestaltung einer soliden internationalen Steuerstruktur</a> und für die konkrete Schnittstelle mit der <a href="/de/blog/wise-iban-und-llc-was-wirklich-an-die-steuerbehoerde">Wise-Karte auf LLC</a> in dessen eigenem Artikel.

Wenn Sie schon mit Karten in mehreren Jurisdiktionen operieren und nicht klar ist, was wo gemeldet wird, schauen wir uns das gemeinsam an und sagen Ihnen, was zu korrigieren ist, bevor das Finanzamt das Tempo vorgibt.
### Zusammenfassung

Die Netzwerke Visa und Mastercard sind nicht diejenigen, die Ihre Ausgaben ans Finanzamt melden: Ihre Aufgabe ist die Zahlungsverarbeitung. Was bei den Steuerbehörden ankommt, ist Information vom **Issuer** (über nationale Meldungen wie Modelo 196 oder 171, DAS2, Modelo 38) und vom **Acquirer** (aggregierte Händlereinnahmen). Sitzt der Issuer außerhalb Ihres Landes, greifen die nationalen Meldungen nicht, aber Saldo und Inhaberschaft fließen über CRS aus der Jurisdiktion des Issuers.

Ihre Kartenausgaben werden nicht in Echtzeit ans Finanzamt übertragen, hinterlassen aber eine perfekt sichtbare Spur, sobald jemand hinschaut. Der Unterschied zwischen Problemen oder keinen Problemen liegt nicht in der Wahl der Karte, sondern in der Kohärenz Ihrer Struktur mit Ihrer Steueransässigkeit und Ihren Erklärungen.
## Steuer-Compliance in deinem Land: CFC, Hinzurechnungsbesteuerung und Einkünftezurechnung

Eine US-LLC ist ein legales und international anerkanntes Instrument. Compliance endet aber nicht mit der Gründung: Als Eigentümer mit Steuerwohnsitz in einem anderen Land hat deine örtliche Finanzverwaltung weiterhin das Recht, die Erträge der LLC zu besteuern. Entscheidend ist, **unter welchem Regime**.

### Nach Rechtsordnung

- **Spanien (LIRPF/LIS).** Eine operative *Single-Member Disregarded* LLC (echte Dienstleistungen, ohne erhebliche Passivität) wird in der Regel nach **Einkünftezurechnung (Art. 87 LIRPF)** behandelt: die Nettogewinne werden dem Gesellschafter im Erzielungsjahr zugerechnet und in die allgemeine IRPF-Bemessungsgrundlage integriert. Optiert die LLC dagegen zur Besteuerung als *Corporation* (Form 8832) und steht sie unter Kontrolle eines spanischen Residenten mit überwiegend passiven Einkünften, kann die **internationale Hinzurechnungsbesteuerung (Art. 91 LIRPF für natürliche Personen, Art. 100 LIS für Gesellschaften)** greifen. Die Wahl ist nicht optional: sie hängt von der wirtschaftlichen Substanz ab, nicht vom Namen.
- **Meldepflichten.** US-Bankkonten mit Durchschnitts- oder Endbestand >50.000 € im Geschäftsjahr: **Modelo 720** (Gesetz 5/2022 nach EuGH-Urteil C-788/19 vom 27.01.2022, Sanktionen jetzt im allgemeinen LGT-Regime). Verbundene Geschäfte mit der LLC und repatriierte Dividenden: **Modelo 232**. In den USA verwahrte Kryptowerte: **Modelo 721**.
- **DBA Spanien–USA.** Das Abkommen (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22.12.1990, Protokoll in Kraft seit 27.11.2019) regelt die Doppelbesteuerung von Dividenden, Zinsen und Lizenzgebühren. Eine LLC ohne Betriebsstätte in Spanien begründet für sich genommen keine Betriebsstätte des Gesellschafters, aber die effektive Geschäftsleitung kann eine entstehen lassen, wenn die gesamte Verwaltung von spanischem Gebiet aus erfolgt.
- **Mexiko, Kolumbien, Argentinien und weitere LATAM-Länder.** Jede Jurisdiktion hat ein eigenes CFC-Regime (Mexiko: Refipres; Argentinien: passive Auslandseinkünfte; Chile: Art. 41 G LIR). Gemeinsamer Grundsatz: Die in der LLC einbehaltenen Gewinne gelten als dem Gesellschafter zugeflossen, wenn die Gesellschaft als transparent oder kontrolliert eingestuft wird.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

Praktische Regel: eine operative LLC mit Substanz, korrekt im Wohnsitzstaat erklärt, ist **legitime Steuerplanung**. Eine LLC, die zur Verschleierung von Einkünften, zur Vortäuschung der Nichtansässigkeit oder zur unbegründeten Verlagerung passiver Einkünfte dient, fällt unter **Art. 15 LGT (Missbrauch)** oder im schlimmsten Fall unter **Art. 16 LGT (Simulation)**. Den Unterschied machen die Tatsachen, nicht das Papier.
Bei Exentax richten wir die Struktur so ein, dass sie ins erste Szenario passt, und dokumentieren jeden Schritt, damit deine örtliche Erklärung im Falle einer Prüfung verteidigt werden kann.

<!-- exentax:legal-refs-v1 -->
## Rechtliche und regulatorische Quellen

Dieser Artikel stützt sich auf Vorschriften, die zum Stichtag aktuell in Kraft sind. Hauptquellen zur Verifikation:

- **USA.** Treas. Reg. §301.7701-3 (Entity Classification / *check-the-box*); IRC §882 (Steuer auf mit US-Geschäft effektiv verbundene Einkünfte Ausländer); IRC §871 (FDAP und Quellensteuer bei Nicht-Residenten); IRC §6038A und Treas. Reg. §1.6038A-2 (Form 5472 für *25% foreign-owned* und *foreign-owned disregarded entities*); IRC §7701(b) (Steuerwohnsitz, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report bei <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spanien.** Gesetz 35/2006 (LIRPF), Artt. 8, 9 (Wohnsitz), 87 (Einkünftezurechnung), 91 (Hinzurechnungsbesteuerung natürliche Personen); Gesetz 27/2014 (LIS), Art. 100 (Hinzurechnungsbesteuerung Gesellschaften); Gesetz 58/2003 (LGT), Artt. 15 und 16; Gesetz 5/2022 (Sanktionsregime Modelo 720 nach EuGH C-788/19 vom 27.01.2022); RD 1065/2007 (Modelos 232 und 720); Anordnung HFP/887/2023 (Modelo 721 Krypto).
- **DBA Spanien–USA.** BOE vom 22.12.1990 (DBA); Protokoll in Kraft seit 27.11.2019 (passive Einkünfte, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Richtlinie (EU) 2011/16, geändert durch DAC6 (grenzüberschreitende Gestaltungen), DAC7 (Richtlinie (EU) 2021/514, digitale Plattformen) und DAC8 (Richtlinie (EU) 2023/2226, Kryptowerte); Richtlinie (EU) 2016/1164 (ATAD: CFC, Exit Tax, hybride Gestaltungen); OECD Common Reporting Standard (CRS).
- **Internationaler Rahmen.** OECD-Musterabkommen, Art. 5 (Betriebsstätte) und Kommentare; BEPS-Aktion 5 (wirtschaftliche Substanz); FATF-Empfehlung 24 (wirtschaftlicher Eigentümer).

Die konkrete Anwendung dieser Regeln auf deinen Fall hängt von deinem Steuerwohnsitz, der Tätigkeit der LLC und der von dir geführten Dokumentation ab. Dieser Inhalt ist informativ und ersetzt keine personalisierte professionelle Beratung.

<!-- exentax:bank-balance-v1 -->
## Ausgewogener Banking-Stack: Mercury, Relay, Slash und Wise

Es gibt nicht das perfekte Konto für eine LLC. Es gibt den richtigen **Stack**, in dem jedes Tool eine Rolle übernimmt:

- **Mercury** (als Fintech mit Partnerbanken (hauptsächlich Choice Financial Group und Evolve Bank & Trust; Column N.A. in Altkonten) betrieben, FDIC über Sweep-Netzwerk bis zur geltenden Grenze). Operatives Hauptkonto für Nicht-Residenten mit guter UX, ACH und Wire. Weiterhin eine der bewährtesten Optionen, um aus dem Ausland zu eröffnen.
- **Relay** (gehalten bei Thread Bank, FDIC). Hervorragendes **Backup-Konto** und für Envelope-Budgeting: bis zu 20 Unterkonten und 50 Debitkarten, tiefe QuickBooks- und Xero-Integration. Wenn Mercury sperrt oder eine KYC-Überprüfung verlangt, hält Relay deinen Betrieb am Laufen.
- **Slash** (gehalten bei Column N.A. (bundesweit konzessionierte Bank, FDIC)). Banking für Online-Operatoren: sofortige Ausgabe virtueller Karten je Anbieter, granulare Ausgabenkontrollen, Cashback auf digitale Werbung. Natürliche Ergänzung, wenn du Meta Ads, Google Ads oder SaaS-Abos verwaltest.
- **Wise Business** (Multi-Währungs-EMI, keine Bank). Zum Empfangen und Zahlen in EUR, GBP, USD und weiteren Währungen mit lokalen Bankdaten und Mid-Market-FX. Ersetzt kein echtes US-Konto, ist aber für internationale Treasury unschlagbar.
- **Wallester / Revolut Business.** Wallester liefert Firmenkarten mit eigenem BIN für hohe Volumen. Revolut Business funktioniert als europäische Ergänzung, nicht als Hauptkonto der LLC.

Die realistische Empfehlung: **Mercury + Relay als Backup + Slash für Werbe-Operationen + Wise für FX-Treasury**. Diese Konfiguration minimiert das Sperr-Risiko und senkt die realen Kosten. Bei Exentax eröffnen und konfigurieren wir diesen Stack im Rahmen der Gründung.

<!-- exentax:banking-facts-v1 -->
## Bank- und Steuerfakten zur Präzisierung

Fintech- und CRS-Informationen entwickeln sich weiter; hier der aktuelle Stand:

### Hinweise nach Anbieter

- **Mercury** arbeitet mit mehreren bundesweit lizenzierten Partnerbanken mit **FDIC**-Deckung über Sweep-Netzwerk: hauptsächlich **Choice Financial Group** und **Evolve Bank & Trust**, sowie **Column N.A.** in einigen Altkonten. Mercury ist selbst keine Bank; es ist eine Fintech-Plattform, die durch diese Partnerbanken getragen wird. Wenn Mercury ein Konto schließt, wird der Saldo in der Regel **per Papierscheck an die hinterlegte Adresse des Kontoinhabers** zurückgesandt, was für Nicht-Residenten ein ernsthaftes operatives Problem darstellen kann; ein sekundäres Konto (Relay, Wise Business etc.) sollte als Reserve aktiv sein.
- **Wise** bietet zwei klar getrennte Produkte: **Wise Personal** und **Wise Business**. Für eine LLC ist **Wise Business** zu eröffnen, nicht das persönliche Konto. Wichtige CRS-Nuance: Ein **Wise Business im Namen einer US-LLC liegt außerhalb des CRS**, weil Kontoinhaberin eine US-Entität ist und die USA kein CRS-Teilnehmer sind; die USD-Seite läuft über Wise US Inc. (FATCA-Perimeter, nicht CRS). Dagegen löst ein **Wise Personal, eröffnet von einer in Spanien** oder einem anderen CRS-Land steuerlich ansässigen Person, sehr wohl eine **CRS-Meldung über Wise Europe SA (Belgien)** zu dieser Person aus. Wise für die LLC zu öffnen bringt Sie nicht über die LLC ins CRS; ein separates Wise Personal auf Ihren Namen als in einem CRS-Land Ansässiger schon.
- **Wallester** (Estland) ist ein europäisches Finanzinstitut mit EMI-/Karten-Emittentenlizenz. Seine europäischen IBAN-Konten **fallen unter den Gemeinsamen Meldestandard (CRS)** und lösen daher den automatischen Informationsaustausch an die Steuerverwaltung des Wohnsitzlands aus.
- **Payoneer** operiert über europäische Einheiten (Payoneer Europe Ltd, Irland), die ebenfalls **unter CRS fallen**, wenn der Kunde in einer teilnehmenden Jurisdiktion ansässig ist.
- **Revolut Business**: in Verbindung mit einer **US-LLC** läuft die übliche Konfiguration über Revolut Payments USA; europäische IBANs (litauisch, BE) **werden einer LLC nicht standardmäßig ausgegeben**, sie werden europäischen Kunden der europäischen Bank des Konzerns ausgegeben. Wird Ihnen ein europäischer IBAN angeboten, prüfen Sie, an welche Rechtsperson er gebunden ist und unter welchem Regime diese meldet.
- **Null-Steuer**: keine LLC-Struktur erreicht „null Steuern", wenn Sie in einem Land mit CFC-/Steuertransparenz- oder Einkünftezurechnungsregeln leben. Was Sie erreichen, ist **keine Doppelbesteuerung** und **korrekte Meldung am Wohnsitz**, keine Beseitigung.

<!-- exentax:legal-facts-v1 -->
## Rechts- und Verfahrensfakten

Die Meldepflichten gegenüber FinCEN und IRS haben sich recent years bewegt; aktueller Stand:

### Kernpunkte

- **BOI / Corporate Transparency Act.** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC fällt heute außerhalb dieser Pflicht**. Der Regelstatus kann erneut wechseln: **Bei Einreichung auf FinCEN.gov prüfen**. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren und Updates beobachten.
- **Form 5472 + Pro-forma-1120.** Für eine **Single-Member LLC im Eigentum eines Nicht-Residenten** behandeln die Schlussregelungen Treas. Reg. §1.6038A-1 (seit 2017 in Kraft) die LLC für 5472-Zwecke als Corporation. Verfahren: **Pro-forma Form 1120** (nur Kopf: Name, Adresse, EIN, Steuerjahr) mit **Form 5472 als Anlage**. Einreichung **per Einschreiben oder Fax an das IRS Service Center Ogden, Utah**, **keine E-Einreichung über das Standard-MeF**. Frist: **15. April**; Verlängerung über **Form 7004** bis **15. Oktober**. **Sanktion: 25.000 USD pro Formular und Jahr, plus 25.000 USD je weitere 30 Tage** Nichteinreichung nach IRS-Mitteilung.
- **Substantielles Form 1120.** Nur wenn die LLC per Check-the-Box-Wahl zur C-Corp optiert hat (Form 8832): dann 21 % Bundessteuer und ein substantielles 1120. Eine Standard-disregarded LLC **reicht kein substantielles 1120 ein und zahlt keine bundesstaatliche Körperschaftsteuer**.
- **EIN und Benachrichtigung.** Ohne EIN ist weder 5472 noch BOI einreichbar. Der IRS warnt nicht vor Sanktionen; man bemerkt es, wenn die EIN gesperrt oder eine spätere Einreichung abgelehnt wird.
## Steuerliche Compliance in Ihrem Land: CFC, TFI und Einkünftezurechnung

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

## Rechtliche und regulatorische Referenzen

Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben - und in dieser Reihenfolge gehen wir vor.

## Bank- und Steuerfakten, die es zu präzisieren gilt

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

<!-- exentax:execution-v2 -->
## Visa, Mastercard und Steuermeldung: was über die Nutzung Ihrer Firmenkarte bekannt ist

Das Finanzamt erhält keine detaillierte Transaktionsliste Ihrer US-Business-Karte - aber Aggregate, die mit Deklarationen abgeglichen werden.

- **Was das Finanzamt NICHT direkt erhält.** Einzeltransaktionslisten, Visa/Mastercard-Kategorien, POS-Standorte. Kartennetzwerke sind keine Steuermelde-Schnittstelle.
- **Was es via CRS und FATCA ERHÄLT.** Jahresend-Saldo + jährliche Bruttobewegungen + UBO. Bei hohem Saldo oder Fluss ohne Kohärenz: Abgleich.
- **Was Spuren über Händler hinterlässt.** Zahlung in DE mit US-Karte: Händler meldet Verkauf normal.
- **Was Ihre Heimatbank sieht.** Aufladen vom DE-Konto ist sichtbar.

### Der typische Abgleich

Via CRS: Mercury 80k€ Durchschnittssaldo, 300k€ jährliche Bruttobewegungen. In ESt erklären Sie 25k€. Offensichtliche Inkohärenz.

### Was am häufigsten gefragt wird

**Wenn ich alles privat mit LLC-Karte zahle, vermeide ich Sichtbarkeit?** Nein. Vermischung bricht Trennung.

**Gibt es eine „nicht meldepflichtige" US-Karte?** Nein.

Bei Exentax strukturieren wir die Nutzung mit Buchhaltung und korrekter Wohnsitzdeklaration.
<!-- /exentax:execution-v2 -->

## Rechtliche und verfahrenstechnische Fakten

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Rufen Sie uns unter <a href="tel:+34614916910">+34 614 916 910</a> an oder schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Wenn%20jemand%20fragt%20sieht%20das%20Finanzamt%2C%20was%20ich%20mit%20der%20Karte%20bezahle%3F%2C%20lautet%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Redaktionelle Überprüfung ausstehend</strong> — Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">3.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…terminados umbrales (clásicamente, operaciones superiores a 3.000 € en efectivo y, para co…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…os.** Cuentas bancarias en EE. UU. con saldo medio o final &gt;50.000 € en el ejercicio: **Mo…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
