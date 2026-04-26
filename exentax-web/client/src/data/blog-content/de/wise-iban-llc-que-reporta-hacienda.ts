export default `Sobald das Gespräch auf Wise, ausländische IBANs und US-LLCs kommt, tauchen zwei gleichermaßen falsche Erzählungen wieder auf: einerseits "Wise meldet nichts und das Finanzamt erfährt nie etwas", andererseits die Sorge, jede einzelne Kartenzahlung werde live an das deutsche oder österreichische Finanzamt übertragen. Die Realität ist deutlich nuancierter, und es lohnt sich, sie zu verstehen, bevor Sie Ihre Struktur aufsetzen, vor allem wenn Sie eine <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a> mit einem Wise-Konto und den dazugehörigen Karten kombinieren.

Dieser Artikel konzentriert sich auf das, was tatsächlich passiert: welche Art von Information von Wise an Ihre Steuerbehörde geht, was nicht, und wo die Grenze zwischen legitimer Nutzung und steuerlichem Risiko liegt. Die ausführliche technische Analyse des CRS-Flusses von Wise Business aus Belgien finden Sie in <a href="/de/blog/wise-business-und-crs-was-ihrer-steuerbehoerde-gemeldet-wird">Wise Business und CRS: was Ihrer Steuerbehörde gemeldet wird</a>.

## Wie Wise tatsächlich funktioniert

Wise ist keine traditionelle Bank, kein undurchsichtiges Zahlungs-Gateway und kein Offshore-Konto. Es handelt sich um eine Gruppe regulierter Einheiten in unterschiedlichen Jurisdiktionen:

- **Wise Europe SA**, mit Sitz in Belgien, lizenziert als Electronic Money Institution durch die National Bank of Belgium. Das ist die Einheit, die den Großteil der europäischen Kunden und die meisten LLCs mit europäischer Vertretung bedient.
- **Wise Payments Limited**, im Vereinigten Königreich, reguliert durch die FCA. Bedient weiterhin UK-Kunden und einige Legacy-Konten.
- **Wise US Inc.**, in den USA als Money Services Business reguliert. Die Einheit für Kunden mit US-Wohnsitz und US-Entitäten.
- Tochtergesellschaften in Singapur, Australien, Indien und weiteren Jurisdiktionen mit eigenen lokalen Aufsichtsbehörden.

Wenn Sie ein Wise-Konto eröffnen (privat oder Business), erhalten Sie "lokale Bankdaten" in mehreren Währungen: eine **belgische (BE) IBAN von Wise Europe SA** für EUR (langjährige europäische Privatkunden können noch eine Alt-IBAN aus Litauen besitzen; für eine **heute über Wise Business eröffnete US-LLC** stammt die EUR-IBAN immer von der belgischen Einheit, niemals aus Litauen), eine **Sort Code und Account Number in GBP**, eine **Routing Number und Account Number in USD** sowie Entsprechungen in AUD, NZD, SGD usw. Diese IBANs machen Wise nicht zu einer normalen belgischen oder litauischen Bank: Es sind segregierte Kundenkonten innerhalb des europäischen EMI-Schemas.

Steuerlich entscheidend: Auch wenn Sie eine belgische oder litauische IBAN sehen, ist **die Einheit, die Ihre Mittel hält und über Ihr Konto meldet, in den allermeisten europäischen Fällen Wise Europe SA (Belgien)**. Das ist die Einheit, die die CRS-Meldungen auslöst.
## Was CRS ist und wann es greift

Der **Common Reporting Standard (CRS)** ist der <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>-Rahmen, der Finanzinstitute in über 100 Jurisdiktionen verpflichtet, ihre nicht ansässigen Kunden zu identifizieren und deren Salden und Erträge jährlich an die lokale Steuerbehörde zu melden, die diese Daten anschließend mit der Steuerbehörde des Wohnsitzlands des Inhabers austauscht. In der EU wurde der Standard über die **Richtlinie 2011/16/EU (DAC2)** umgesetzt, in Belgien durch das Gesetz vom 16. Dezember 2015 über den automatischen Austausch von Finanzinformationen. In Deutschland und Österreich greift das Finanzkonten-Informationsaustauschgesetz (FKAustG bzw. GMSG).

Für Wise relevant:

- **Wise Europe SA (Belgien)** unterliegt vollständig dem CRS. Sie meldet an den Service Public Fédéral Finances in Belgien, der die Daten an die Steuerbehörde des Wohnsitzlands des Inhabers weiterleitet.
- **Wise Payments Limited (UK)** unterliegt ebenfalls dem CRS, der formelle Kanal läuft über HMRC.
- **Wise US Inc.** unterliegt nicht dem CRS, weil die USA dem Standard nicht beigetreten sind (sie nutzen ihren eigenen, asymmetrischen Rahmen FATCA, der hauptsächlich US persons trifft).

Konkret: Liegt Ihr Wise-Konto unter Wise Europe SA, ist davon auszugehen, dass der Saldo zum 31. Dezember und die Inhaberdaten bei Ihrer nationalen Steuerbehörde landen. Wenn Sie unter Wise US Inc. geführt werden, greift CRS nicht, aber dieses Konto steht nur echten US-Residenten und US-Entitäten offen, nicht einem Nicht-Residenten, der eine LLC aus Europa heraus betreibt.
## Was Wise tatsächlich meldet

Der über CRS übermittelte Informationsblock ist sehr konkret und enthält entgegen verbreiteten Befürchtungen nicht "alle Bewegungen in Echtzeit":

| Block | Inhalt |
| --- | --- |
| Inhaber natürliche Person | Name, Adresse, erklärte steuerliche Ansässigkeit, Steueridentifikationsnummer (TIN), Geburtsdatum und -ort |
| Inhaber Entität | Firmenname, Adresse, EIN bzw. Steuer-ID der LLC, CRS-Klassifikation (Active NFE, Passive NFE, Investment Entity) |
| Wirtschaftlich Berechtigte | Wenn die Entität als Passive NFE eingestuft ist: Daten der Controlling Persons (Schwelle 25% direkt oder indirekt, oder tatsächliche Kontrolle) |
| Konto | IBAN je Währung, interne Wise-Kontonummer |
| Saldo | Aggregierter Saldo zum 31. Dezember, in der Regel in EUR zum Jahresende umgerechnet |
| Erträge | Zinsen sofern vorhanden (Wise Interest), Bruttodividenden und Bruttoeinlösungserlöse bei Wise Assets |

Was über CRS **nicht** gemeldet wird:

- Das Detail jeder einzelnen Bewegung des Jahres.
- Namen und Daten Ihrer Kunden.
- Ihre Rechnungen, Verträge oder Margen.
- Konkrete Kartenkäufe.

Das bedeutet nicht, dass diese Informationen unsichtbar sind: Eröffnet Ihre Steuerbehörde ein Verfahren, kann sie diese Daten direkt von Ihnen verlangen, und in fortgeschrittenen Untersuchungen auch konkrete Informationen bei Wise über die Kanäle der steuerlichen Zusammenarbeit anfordern. Es heißt nur, dass der jährliche automatische Datenstrom kein vollständiger Datenexport ist: Es geht um Saldo, Erträge und Identität.
## Visa- und Mastercard-Karten: die wichtige Nuance

Es kursiert die Vorstellung, dass "Visa und Mastercard sowieso alles ans Finanzamt melden". Dazu einige Klarstellungen:

- Visa und Mastercard sind **Zahlungsverarbeitungsnetze**, keine Finanzinstitute, die Ihr Konto halten. Ihre Aufgabe ist es, Transaktionen zwischen ausgebender Bank und akzeptierender Bank des Händlers zu verrechnen.
- **Visa und Mastercard melden Ihre Kartenausgaben nicht direkt an eine Steuerbehörde** als periodischen automatischen Datenstrom. Das ist nicht ihre Aufgabe.
- Die Meldepflicht trifft den **Kartenherausgeber** (hier Wise Europe SA) und den **akquirierenden Händler** in dessen eigener Buchhaltung.
- Innerhalb nationaler Systeme bestehen für inländische Finanzinstitute besondere Pflichten (etwa in Deutschland Mitteilungspflichten an das Bundeszentralamt für Steuern in bestimmten Konstellationen), aber dieser Rahmen greift nicht mit derselben Intensität bei einem ausländischen EMI, der die Karte ausgibt.

Wenn Sie die vollständige Landkarte wollen, wer was von Ihren Kartenzahlungen Land für Land meldet (Modelo 196, 171, DAS2, Modelo 38), behandeln wir das in <a href="/de/blog/visa-mastercard-reporting-was-die-finanzamter-von">Visa und Mastercard: was die Finanzämter von Ihren Kartenzahlungen wirklich sehen</a>.

Vernünftiger Schluss: Bezahlen Sie persönliche Ausgaben mit der Wise-Karte als steuerlich Ansässiger in Deutschland, Österreich oder Spanien, wird nicht jede einzelne Transaktion in Echtzeit automatisch an Ihr Finanzamt gemeldet. Was zusammen mit dem Rest des Kontos gemeldet wird, ist der jährliche CRS-Bericht zu Saldo und Erträgen. Und vor allem hinterlässt es eine perfekt nachvollziehbare Spur, wenn die Steuerbehörde später die Mittelherkunft prüft.
## Der typische Fall: nicht ansässige LLC mit Wise Business

Hier zirkulieren die meisten Mythen. Ein Unternehmer mit Wohnsitz in Deutschland, Österreich, Spanien oder LATAM gründet eine <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a>, eröffnet Mercury als Hauptkonto und Wise Business als sekundäres Multi-Währungs-Konto. Beim Ausfüllen der CRS-Selbstauskunft von Wise für die LLC muss er angeben:

- Steuerliche Ansässigkeit der LLC: USA.
- CRS-Klassifikation: Die meisten Single-Member-Service-LLCs erfüllen die Anforderungen einer **Active NFE** (mehr als 50% der Erträge sind operativ), aber Wise wendet konservative Kriterien an und stuft die Entität bei schwacher Dokumentation häufig als **Passive NFE** ein.
- Controlling Persons: Daten des wirtschaftlich Berechtigten, einschließlich seiner steuerlichen Ansässigkeit (also Ihrer in Deutschland, Österreich, Spanien o. ä.).

Praktische Folge: Auch wenn die LLC US-amerikanisch ist und die USA nicht am CRS teilnehmen, **gelangt die Information, dass Sie Controlling Person sind, mit Ihrer realen steuerlichen Ansässigkeit aus Belgien zu Ihrer Steuerbehörde**. Diesen Punkt übersehen viele.

Die LLC wird damit nicht "illegal": Eine sauber strukturierte und sauber erklärte LLC ist ein vollkommen legitimes Werkzeug. Was wegfällt, ist die Vorstellung, dass die Eröffnung von Wise Business im Namen der LLC den Informationsfluss in Ihr Wohnsitzland blockiert.
## Was Ihre Steuerbehörde tatsächlich sieht (und was nicht)

Übersetzt in die Praxis eines steuerlich Ansässigen in Deutschland, Österreich oder Spanien mit LLC + Wise:

Was die Behörde automatisch und jährlich sieht:

- Dass ein Wise-Konto existiert, mit der LLC und mit Ihnen als Controlling Person verknüpft.
- Den Saldo zum 31. Dezember.
- Die generierten Bruttoerträge (Wise Interest, Wise Assets etc.).
- Ihren Namen, Ihre Steuer-ID und Ihre Adresse als wirtschaftlich Berechtigter.

Was sie nicht automatisch erhält:

- Jede einzelne Bewegung des Jahres.
- Daten Ihrer Kunden und Rechnungen.
- Konkrete Kartentransaktionen.
- Die interne GuV der LLC.

Was beim Abgleich mit Ihren nationalen Erklärungen passiert:

- Wird das Wise-Konto in Ihrer nationalen Auslandsvermögens- oder Auslandskontenmeldung nicht erfasst (in Spanien Modelo 720; in Deutschland und Österreich gelten je nach Konstellation andere Mitwirkungs- und Anzeigepflichten), entsteht ein offensichtlicher Bruch.
- Wird in der Einkommensteuererklärung der Ertrag der LLC nicht erfasst, dort, wo Ihr Wohnsitzland sie als transparent behandelt, wie wir in <a href="/de/blog/crs-fur-ansassige-in-spanien-und-lateinamerika-reale">CRS für Ansässige in Spanien und Lateinamerika</a> analysieren, entsteht eine weitere Lücke.
- Passen die Salden nicht zu den erklärten Erträgen, hat die Behörde einen natürlichen Hebel, eine Prüfung zu eröffnen.

Das Problem ist selten die Meldung selbst, sondern die **dokumentarische Inkohärenz** zwischen dem, was Sie zu Hause erklären, dem, was über CRS aus Belgien herausgeht, und dem, was Ihr operatives Geschäft zeigt.
## Häufige Fehler, die wir jede Woche sehen

1. **"Wise meldet nichts."** Falsch. Wise Europe SA meldet über CRS aus Belgien.
2. **"Wenn das Konto auf die LLC läuft, melden sie nicht mich."** Falsch bei Passive NFE: Die Controlling Persons werden gemeldet, und die meisten Single-Member-LLCs werden so eingestuft.
3. **"Mein Durchschnittssaldo ist niedrig, also bin ich aus dem CRS raus."** Gemeldet wird der Saldo zum Jahresende, unabhängig von Schwankungen während des Jahres, und es gibt keine Mindestschwelle für neue Konten.
4. **"Ich habe ein Wise-USD-Konto unter Wise US Inc., das wird nicht gemeldet."** Für CRS richtig, aber dieses Setup ist nur für echte US-Residenten und US-Entitäten konsistent; aus Europa heraus mit einer von einem Nicht-Residenten geführten LLC genutzt, exponiert es Sie an einer anderen Front (Ansässigkeit, Ort der Geschäftsführung, interne Wise-Due-Diligence).
5. **"Ich zahle alles mit der Wise-Karte, also keine Spur."** Doch: bei Wise, beim Händler und im gemeldeten Jahresendsaldo. Und sie ist im Streitfall perfekt rekonstruierbar.
6. **"Die LLC schützt mich automatisch vor der Auslandskontenmeldung."** Nein: Wenn Sie steuerlich ansässig sind und wirtschaftlich Berechtigter ausländischer Konten, greifen die jeweiligen Pflichten ab den geltenden Schwellen.
## Warum das für Ihre Struktur zählt

Die vernünftige Schlussfolgerung lautet weder "Wise ist schlecht" noch "die LLC ist gefährlich". Sie lautet, dass **Ihre Struktur nur funktioniert, wenn die Bausteine zueinander passen**: Ihre steuerliche Ansässigkeit, die Einheit, die Ihr Konto hält, die CRS-Klassifikation der LLC, Ihre nationalen Anzeigepflichten, Ihre Einkommensteuererklärung und Ihre Kundenverträge. Wenn ein Baustein nicht passt, entstehen die Probleme nicht am Tag der Geldbewegung. Sie tauchen drei oder vier Jahre später als Steuerbescheid oder Auskunftsersuchen auf.

Bei Exentax arbeiten wir genau an dieser Schnittstelle: <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a> aufsetzen, entscheiden, <a href="/de/blog/traditionelle-banken-vs-fintech-fur-ihre-llc-wo-ihr-konto">welche Bank oder Fintech</a> als Haupt- und welche als Sekundärkonto sinnvoll ist, antizipieren, was über <a href="/de/blog/crs-fur-ansassige-in-spanien-und-lateinamerika-reale">CRS</a> an Ihre nationale Behörde gemeldet wird, und das Ganze so konstruieren, dass der Baustein Wise (oder <a href="/de/blog/revolut-business-und-crs-was-ihrer-steuerbehorde-gemeldet">Revolut Business</a> oder ein anderer) ohne Überraschungen passt. Wir vertiefen das in <a href="/de/blog/gestaltung-einer-soliden-internationalen-steuerstruktur">Gestaltung einer soliden internationalen Steuerstruktur</a>.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

Bei Exentax arbeiten wir genau an dieser Schnittstelle: <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a> aufsetzen, entscheiden, <a href="/de/blog/traditionelle-banken-vs-fintech-fur-ihre-llc-wo-ihr-konto">welche Bank oder Fintech</a> als Haupt- und welche als Sekundärkonto sinnvoll ist, antizipieren, was über <a href="/de/blog/crs-fur-ansassige-in-spanien-und-lateinamerika-reale">CRS</a> an Ihre nationale Behörde gemeldet wird, und das Ganze so konstruieren, dass der Baustein Wise (oder <a href="/de/blog/revolut-business-und-crs-was-ihrer-steuerbehorde-gemeldet">Revolut Business</a> oder ein anderer) ohne Überraschungen passt. Wir vertiefen das in <a href="/de/blog/gestaltung-einer-soliden-internationalen-steuerstruktur">Gestaltung einer soliden internationalen Steuerstruktur</a>.
Wenn Sie nicht sicher sind, wie Wise in Ihre Struktur passt, oder ob Sie einer Datenkreuzung ausgesetzt sind, die Sie nicht kontrollieren, prüfen wir das mit Ihnen und sagen Ihnen, was zu korrigieren ist, bevor die Behörde das Tempo vorgibt.
### Zusammenfassung

Wise ist eine ausgezeichnete Multi-Währungs-Fintech, vollständig reguliert und vollständig in den automatischen Informationsaustausch eingebunden, sobald sie unter Wise Europe SA operiert. Es ist keine Abkürzung, um Geld zu verstecken, aber auch keine Kamera, die jede Bewegung live an die Steuerbehörde überträgt. Über CRS reisen Saldo, Erträge sowie die Identität von Inhaber und wirtschaftlich Berechtigtem. Was standardmäßig nicht reist, ist das operative Detail, es ist aber jederzeit verfügbar, wenn die Behörde es anfordert.

Der Unterschied zwischen Problemen oder keinen Problemen liegt nicht in der Nutzung von Wise, sondern darin, wie Wise in eine Struktur passt, die mit Ihrer LLC, Ihrer Ansässigkeit und Ihren Erklärungen kohärent ist. Genau das ist das Gespräch, das man besser vorher führt als nachher.
## Steuer-Compliance in Ihrem Land: CFC, Hinzurechnungsbesteuerung und Einkünftezurechnung

Eine US-LLC ist ein legales und international anerkanntes Instrument. Compliance endet aber nicht mit der Gründung: Als Eigentümer mit Steuerwohnsitz in einem anderen Land hat Ihre örtliche Finanzverwaltung weiterhin das Recht, die Erträge der LLC zu besteuern. Entscheidend ist, **unter welchem Regime**.

### Nach Rechtsordnung

- **Spanien (LIRPF/LIS).** Eine operative *Single-Member Disregarded* LLC (echte Dienstleistungen, ohne erhebliche Passivität) wird in der Regel nach **Einkünftezurechnung (Art. 87 LIRPF)** behandelt: die Nettogewinne werden dem Gesellschafter im Erzielungsjahr zugerechnet und in die allgemeine IRPF-Bemessungsgrundlage integriert. Optiert die LLC dagegen zur Besteuerung als *Corporation* (Form 8832) und steht sie unter Kontrolle eines spanischen Residenten mit überwiegend passiven Einkünften, kann die **internationale Hinzurechnungsbesteuerung (Art. 91 LIRPF für natürliche Personen, Art. 100 LIS für Gesellschaften)** greifen. Die Wahl ist nicht optional: sie hängt von der wirtschaftlichen Substanz ab, nicht vom Namen.
- **Meldepflichten.** US-Bankkonten mit Durchschnitts- oder Endbestand >50.000 € im Geschäftsjahr: **Modelo 720** (Gesetz 5/2022 nach EuGH-Urteil C-788/19 vom 27.01.2022, Sanktionen jetzt im allgemeinen LGT-Regime). Verbundene Geschäfte mit der LLC und repatriierte Dividenden: **Modelo 232**. In den USA verwahrte Kryptowerte: **Modelo 721**.
- **DBA Spanien–USA.** Das Abkommen (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22.12.1990, Protokoll in Kraft seit 27.11.2019) regelt die Doppelbesteuerung von Dividenden, Zinsen und Lizenzgebühren. Eine LLC ohne Betriebsstätte in Spanien begründet für sich genommen keine Betriebsstätte des Gesellschafters, aber die effektive Geschäftsleitung kann eine entstehen lassen, wenn die gesamte Verwaltung von spanischem Gebiet aus erfolgt.
- **Mexiko, Kolumbien, Argentinien und weitere LATAM-Länder.** Jede Jurisdiktion hat ein eigenes CFC-Regime (Mexiko: Refipres; Argentinien: passive Auslandseinkünfte; Chile: Art. 41 G LIR). Gemeinsamer Grundsatz: Die in der LLC einbehaltenen Gewinne gelten als dem Gesellschafter zugeflossen, wenn die Gesellschaft als transparent oder kontrolliert eingestuft wird.

Praktische Regel: eine operative LLC mit Substanz, korrekt im Wohnsitzstaat erklärt, ist **legitime Steuerplanung**. Eine LLC, die zur Verschleierung von Einkünften, zur Vortäuschung der Nichtansässigkeit oder zur unbegründeten Verlagerung passiver Einkünfte dient, fällt unter **Art. 15 LGT (Missbrauch)** oder im schlimmsten Fall unter **Art. 16 LGT (Simulation)**. Den Unterschied machen die Tatsachen, nicht das Papier.

Bei Exentax richten wir die Struktur so ein, dass sie ins erste Szenario passt, und dokumentieren jeden Schritt, damit Ihre örtliche Erklärung im Falle einer Prüfung verteidigt werden kann.

<!-- exentax:legal-refs-v1 -->
## Rechtliche und regulatorische Quellen

Dieser Artikel stützt sich auf Vorschriften, die zum Stichtag aktuell in Kraft sind. Hauptquellen zur Verifikation:

- **USA.** Treas. Reg. §301.7701-3 (Entity Classification / *check-the-box*); IRC §882 (Steuer auf mit US-Geschäft effektiv verbundene Einkünfte Ausländer); IRC §871 (FDAP und Quellensteuer bei Nicht-Residenten); IRC §6038A und Treas. Reg. §1.6038A-2 (Form 5472 für *25% foreign-owned* und *foreign-owned disregarded entities*); IRC §7701(b) (Steuerwohnsitz, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report bei <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spanien.** Gesetz 35/2006 (LIRPF), Artt. 8, 9 (Wohnsitz), 87 (Einkünftezurechnung), 91 (Hinzurechnungsbesteuerung natürliche Personen); Gesetz 27/2014 (LIS), Art. 100 (Hinzurechnungsbesteuerung Gesellschaften); Gesetz 58/2003 (LGT), Artt. 15 und 16; Gesetz 5/2022 (Sanktionsregime Modelo 720 nach EuGH C-788/19 vom 27.01.2022); RD 1065/2007 (Modelos 232 und 720); Anordnung HFP/887/2023 (Modelo 721 Krypto).
- **DBA Spanien–USA.** BOE vom 22.12.1990 (DBA); Protokoll in Kraft seit 27.11.2019 (passive Einkünfte, *limitation on benefits*).
- **EU / OECD.** Richtlinie (EU) 2011/16, geändert durch DAC6 (grenzüberschreitende Gestaltungen), DAC7 (Richtlinie (EU) 2021/514, digitale Plattformen) und DAC8 (Richtlinie (EU) 2023/2226, Kryptowerte); Richtlinie (EU) 2016/1164 (ATAD: CFC, Exit Tax, hybride Gestaltungen); OECD Common Reporting Standard (CRS).
- **Internationaler Rahmen.** OECD-Musterabkommen, Art. 5 (Betriebsstätte) und Kommentare; BEPS-Aktion 5 (wirtschaftliche Substanz); FATF-Empfehlung 24 (wirtschaftlicher Eigentümer).

Die konkrete Anwendung dieser Regeln auf Ihren Fall hängt von Ihrem Steuerwohnsitz, der Tätigkeit der LLC und der von Ihnen geführten Dokumentation ab. Dieser Inhalt ist informativ und ersetzt keine personalisierte professionelle Beratung.<!-- exentax:execution-v2 -->
## Das belgische Wise-IBAN für Ihre LLC: was es ist, was es meldet und warum das Finanzamt es sieht

Wenn Sie das EUR-Subkonto von Wise Business aktivieren, erhalten Sie ein belgisches BE-IBAN. Operativ exzellent; fiskalisch unter belgischem CRS-Regime.

- **Natur des BE-IBAN.** Wise Europe SA ist von der belgischen Zentralbank autorisiertes Kreditinstitut. Das BE-IBAN ist rechtlich belgisches Konto, auch wenn Inhaber Ihre US-LLC.
- **Jährlich übertragene Daten.** Identifikation der LLC, UBO, Saldo 31. Dezember, gesamte jährliche Bruttobewegungen, Konto-ID. Keine Einzeltransaktionen.
- **Abgleich mit Wohnsitzdeklaration.** DE: Auslandskonten in Anlage AUS deklarieren. Wenn Finanzamt via CRS Saldo erhält und Sie nicht deklariert haben, Imputationsverfahren.
- **Unterschied vs USD-Subkonto.** USD von Wise USD Inc. betrieben, meldet via FATCA-IGA. Anderer Kanal, gleiches fiskalisches Ergebnis.

### Wie korrekt in DE deklarieren

ESt-Erklärung mit Anlage AUS für Auslandskonten und LLC-Zurechnung.

### Was am häufigsten gefragt wird

**Wenn UBO im KYC anders, geht es an dessen Finanzamt?** Ja, CRS meldet an reale UBO-Wohnsitz.

**Kann ich Wise ohne EUR-Aktivierung haben?** Ja, aber verliere Hauptvorteil.

Bei Exentax strukturieren wir Wise nach Bedarf und deklarieren korrekt.
<!-- /exentax:execution-v2 -->

## Wir richten es ein, ohne dass Sie ein Wochenende verlieren

Tausende von Freelancern und Unternehmern betreiben ihre US-LLC bereits vollständig legal und dokumentiert. Bei Exentax kümmern wir uns um den gesamten Prozess: Gründung, Banking, Zahlungsabwicklung, Buchhaltung, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>-Erklärungen und Compliance in Ihrem Wohnsitzland. Buchen Sie eine kostenlose Beratung, und wir sagen Ihnen ehrlich, ob die LLC für Ihren Fall sinnvoll ist, ohne absolute Versprechen.

  ### Was der belgische Wise-IBAN für deutsche Steuerpflichtige konkret bedeutet

  Wise Business stellt allen Geschäftskunden in der Eurozone seit 2024 einen **belgischen IBAN (BE)** aus, weil die Wise Europe SA in Brüssel als belgische E-Geld-Institution unter NBB-Aufsicht (Nationale Bank von Belgien) firmiert. Für deutsche LLC-Inhaber heißt das: das Wise-Konto unterliegt dem **belgischen CRS-Reporting** nach DAC2 (Ihnen. 2014/107/EU), das automatisch jährlich an das **deutsche Bundeszentralamt für Steuern (BZSt)** und damit an das zuständige Wohnsitzfinanzamt weitergeleitet wird. Zusätzlich besteht die nationale Meldepflicht nach **§138 Abs. 2 AO** ans Finanzamt innerhalb von 5 Monaten nach Jahresende, wenn der Saldo durchschnittlich €100.000 übersteigt.

<!-- exentax:defensa-fiscal-v1 -->
## Was, wenn das Finanzamt nach meiner LLC fragt?

  Das ist die Frage, die in der ersten Beratung am häufigsten gestellt wird, und die kurze Antwort lautet: Ihre LLC ist nicht intransparent, und bei korrekter Deklaration schließt eine Prüfung mit Standardformularen ab. Das deutsche Finanzamt, das österreichische Finanzamt oder die kantonale Steuerverwaltung können das Certificate of Formation des Bundesstaats (Wyoming, Delaware oder New Mexico), die vom <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> ausgestellte EIN, das unterzeichnete Operating Agreement, die Mercury- oder Wise-Auszüge des Geschäftsjahres, den eingereichten Form 5472 mit 1120 pro-forma sowie die Buchhaltung anfordern, die Einnahmen, Ausgaben und Bewegungen abstimmt. Liegt all das geordnet vor, eskaliert die Prüfung nicht.

  Was die Steuerbehörden zu Recht verfolgen, sind Strohmannstrukturen, Papier-Steueransässigkeit und nicht erklärte Auslandskonten. Eine sauber aufgesetzte LLC ist genau das Gegenteil: Sie erscheinen als **wirtschaftlich Berechtigter** im BOI Report, wenn er anwendbar ist (überprüfbar unter <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), Sie unterschreiben die Bankkonten und Sie erklären das Einkommen dort, wo Sie leben. Die Struktur ist beim Secretary of State des Bundesstaats registriert, in den IRS-Akten und, sobald eine europäische Bank im Spiel ist, innerhalb des CRS-Perimeters der <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.

  Der Fehler, der eine Prüfung wirklich entgleisen lässt, ist nicht die LLC selbst, sondern die fehlerhafte Zuordnung des Einkommens in der persönlichen Einkommensteuererklärung, das fehlende KAP/AUS bei deutschen Residenten oder die unterlassene Anlage A1 und Beilagen E25/E26 bei österreichischen Residenten. Diese drei Fronten schließen wir vor der Anfrage, nicht danach.

  ## Was eine LLC NICHT tut

  - **Sie befreit Sie nicht von der Steuerpflicht zu Hause.** Wer in Deutschland, Österreich oder der Schweiz steuerlich ansässig ist, versteuert das Welteinkommen vor Ort. Die LLC ordnet den US-Teil (null Bundesteuer für die SMLLC pass-through ohne ECI), sie schaltet die heimische Besteuerung nicht ab. Die Einkommensteuer wird auf den zugewiesenen Gewinn berechnet, nicht auf die tatsächlich ausgeschütteten Beträge.
  - **Sie ist kein Offshore-Konstrukt und keine BEPS-Struktur.** Sie ist eine vom IRS anerkannte US-Gesellschaft, in einem konkreten Bundesstaat mit physischer Adresse, registriertem Agenten und jährlichen Informationspflichten registriert. Klassische Offshore-Standorte (BVI, Belize, Seychellen) hinterlassen keine öffentliche Spur; eine LLC hinterlässt fünf.
  - **Sie schützt Sie nicht bei vermischten Vermögen.** Das *pierce the corporate veil* greift, sobald ein Gericht erkennt, dass LLC und Gesellschafter dieselbe Geldbörse sind: vermischte Konten, private Ausgaben aus der LLC, kein Operating Agreement, keine Buchhaltung. Drei verdächtige Bewegungen genügen.
  - **Sie spart keine Sozialbeiträge im Inland.** Freiberufler in Deutschland, Selbständige in Österreich, AHV-Pflichtige in der Schweiz: der monatliche Beitrag bleibt identisch. Die LLC bedient die internationale Kundschaft; der persönliche Sozialbeitrag bleibt unabhängig. Siehe Bekanntmachungen im Bundesgesetzblatt sowie spanische Vergleichsregelungen im <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a>.
  - **Sie befreit Sie nicht von der Auslandskonto-Meldepflicht.** Deutschland: KAP/AUS, ggf. § 138 AO Anzeige bei Beteiligungen über 10 %. Österreich: Beilagen E25/E26 zur Einkommensteuererklärung. Schweiz: kantonale Vermögensdeklaration. Diese Pflichten liegen bei der Person, nicht bei der LLC.

  Bei Exentax schließen wir diese fünf Fronten jedes Jahr parallel zum US-Bundeskalender (Form 5472, 1120 pro-forma, FBAR, staatlicher Annual Report, BOI Report bei Anwendbarkeit). Ziel ist, dass keine Prüfung ein loses Ende findet und die Struktur einer rückwirkenden Prüfung über 5 bis 7 Jahre standhält.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Sobald%20das%20Gespr%C3%A4ch%20auf%20Wise%2C%20ausl%C3%A4ndische%20IBANs%20und%20US-LLCs%20kommt%2C%20tauchen%20z%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Redaktionelle Überprüfung ausstehend</strong> — Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">25%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ssive NFE, los datos de los controlling persons (umbral del 25% directo o indirecto, o con…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…servicios cumplen los requisitos de **Active NFE** (más del 50% de los ingresos son operat…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…(declaración de bienes en el extranjero, umbral agregado de 50.000 €) y, en su caso, Model…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">100%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ers y emprendedores ya operan con su LLC americana de forma 100% legal y documentada. En E…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…Si en cambio la LLC se opta a tributar como *corporation* (Form 8832) y queda controlada p…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC2</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…n la UE se transpuso a través de la **Directiva 2011/16/UE (DAC2)** y, en Bélgica, mediant…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…*). - **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
