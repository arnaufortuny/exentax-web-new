export default `

Wise Business meldet Kontosalden an über 120 Jurisdiktionen unter CRS und übermittelt die Daten für einen spanischen Steueransässigen jährlich bis zum 30. September an die AEAT.

Wise Business (früher TransferWise) ist die Multi-Währungs-Fintech, die die meisten Inhaberinnen und Inhaber einer <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-amerikanischen LLC</a> als erste eröffnen, neben jeder international tätigen Unternehmerin oder jedem Unternehmer, die oder der Geld über Grenzen hinweg bewegen muss. Das Versprechen ist eindeutig: Mid-Market-Wechselkurse, lokale IBANs in EUR, GBP, USD und einem Dutzend weiteren Währungen, und so niedrige Gebühren, dass man sie kaum bemerkt. Was viele übersehen: Wise ist auch ein voll regulierter europäischer Finanzakteur und unterliegt damit dem **Common Reporting Standard (CRS)**. Genau dieses Detail hat sehr konkrete Auswirkungen, die Sie kennen sollten, bevor Sie Wise in die Struktur Ihrer LLC einbauen.

## Welche Wise-Einheit Ihr Konto tatsächlich führt und wo sie meldet

Wise ist nicht ein einziges globales Unternehmen. Es operiert über mehrere regulierte Einheiten, und diejenige, die Ihr Konto führt, entscheidet, welche Steuerbehörde Ihre Daten zu sehen bekommt:

- **Wise Europe SA** (Belgien): E-Geld-Institut (EMI), reguliert durch die **Belgische Nationalbank (NBB)**. Diese Einheit bedient europäische Kunden, seit das Vereinigte Königreich nach dem Brexit das EU-Passporting verloren hat. Sie meldet CRS an den belgischen **Service Public Fédéral Finances**, der dann den bilateralen Informationsaustausch mit der Steuerbehörde des Wohnsitzlandes des Kontoinhabers auslöst.
- **Wise Payments Limited** (Vereinigtes Königreich): EMI, reguliert durch die FCA. Bedient weiterhin britische Kunden und einige Bestandskonten.
- **Wise US Inc.**: in den USA als Money Services Business (MSB) reguliert. CRS gilt hier nicht, weil die USA dem Standard nie beigetreten sind.
- Tochtergesellschaften in Singapur, Australien, Indien und weiteren Märkten, jeweils mit eigenem lokalen Regulator und eigenen Meldepflichten.

Für europäische Kundinnen und Kunden und für jede LLC, die mit europäischer Vertretung im KYC eröffnet wird, ist die Standardkonstellation, dass das Konto bei **Wise Europe SA (Belgien)** geführt wird. Direkte Folge: Der CRS-Bericht verlässt jedes Jahr Belgien und landet bei der Steuerbehörde Ihres Wohnsitzstaates, unabhängig davon, wo die LLC gegründet wurde.

### Rechtsrahmen

- **<a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>**: Common Reporting Standard.
- **EU**: Richtlinie 2011/16/EU in der durch DAC2 geänderten Fassung.
- **Belgien**: Gesetz vom 16. Dezember 2015 über den automatischen Austausch von Finanzinformationen (LIAFI) sowie die zugehörigen Königlichen Verordnungen.
- **Spanien als Empfängerstaat**: Real Decreto 1021/2015, **Modelo 720** (die spanische Erklärung über im Ausland gehaltene Vermögenswerte: Konten, Wertpapiere, Immobilien) und **Modelo 721** (das Pendant für im Ausland gehaltene Krypto-Werte). Wir vertiefen die Empfängerseite in unserem Artikel zu <a href="/de/blog/crs-fur-ansassige-in-spanien-und-lateinamerika-reale">CRS für Ansässige in Spanien und Lateinamerika</a>.

### Welche Informationen Wise im Rahmen des CRS sendet

Genau die Informationen, die jede meldepflichtige Finanzinstitution unter CRS sendet, nicht mehr und nicht weniger:

| Block | Detail |
| --- | --- |
| Natürliche Person als Kontoinhaber | Name, Anschrift, erklärter steuerlicher Wohnsitz, TIN, Geburtsdatum und Geburtsort |
| Entität als Kontoinhaber | Firma, Anschrift, EIN/TIN, CRS-Klassifikation (Active NFE, Passive NFE, Investment Entity) |
| Beherrschende Personen | Wenn die Entität Passive NFE ist: Daten der wirtschaftlich Berechtigten (Schwelle 25% direkt oder indirekt, oder jede andere Form effektiver Kontrolle) |
| Konto | Jede IBAN je Währung sowie die interne Wise-Referenz |
| Saldo | Aggregierter Saldo zum 31. Dezember (Wise verwaltet Pools je Währung; der Bericht aggregiert über alle Pools hinweg) |
| Erträge | Zinsen, sofern vorhanden (Wise Interest, Wise Assets), Bruttodividenden, Brutto-Rückgabeerlöse (mit Blick auf das Assets-Programm als Verwahrkonto behandelt) |

Sowohl das Produkt **Wise Interest** als auch die auf Geldmarktfonds basierenden Wise-Anlageprodukte fallen klar unter das Verwahrkonto-Reporting. Die Bruttoertragsdetails kommen also zum Endsaldo hinzu, sie ersetzen ihn nicht.

### Wie Wise Ihre LLC unter CRS einstuft

Wenn Sie ein Wise-Business-Konto für Ihre LLC eröffnen, führt Wise die CRS-Sorgfaltsprüfung an der Entität selbst durch. Sie werden gebeten, das Formular **CRS Self-Certification** auszufüllen und Folgendes zu bestätigen:

- Steuerlicher Wohnsitz der LLC: USA.
- Klassifikation: Active NFE, Passive NFE, Investment Entity, Reporting Financial Institution usw.
- Beherrschende Personen (vollständiger Datensatz: Name, Anschrift, steuerlicher Wohnsitz, TIN, Geburtsdatum und Geburtsort).

In der Praxis erfüllt eine Single-Member-Service-LLC normalerweise das Kriterium **Active NFE** (mehr als 50% der Einkünfte sind operative, keine passiven Einkünfte). Wise spielt allerdings konservativ: Wenn Ihre Dokumentation dünn ist oder die Tätigkeit nicht sauber belegt werden kann, stuft Wise die LLC als **Passive NFE** ein und meldet die beherrschende Person direkt.

Die Schlussfolgerung, die sich nicht umgehen lässt: Auch wenn die LLC US-amerikanisch ist und die USA dem CRS nie beigetreten sind, **erreichen die Daten zur Eigentümerschaft und zu den Salden Ihre Steuerbehörde** über Belgien.

### Wann und wie die Meldung tatsächlich erfolgt

- Stichtag zum Jahresende: 31. Dezember.
- Wise sendet den CRS-Bericht typischerweise zwischen März und Juni des Folgejahres an die belgische Behörde.
- Belgien leitet die Daten an die Steuerbehörden des Wohnsitzlandes jeder Person weiter, in der Regel vor dem 30. September.
- Ihre Steuerbehörde verfügt damit über die Daten und gleicht sie mit Ihren Erklärungen ab (in Spanien IRPF plus Modelo 720, plus Modelo 721, falls Sie auch im Ausland gehaltene Krypto-Werte besitzen; in Deutschland Einkommensteuer, ggf. Anlage AUS und § 16 AStG).

Der Wise-Saldo, den Sie am 31.12.2025 hielten, wird also mit der ESt-Erklärung abgeglichen, die Sie für 2025 abgeben, sowie mit dem Modelo 720, das spanische Residenten im März des Folgejahres einreichen. Zwei verschiedene Formulare, ein einziger Abgleich.

## Die häufigsten Fehler, die wir bei Wise und Steuern sehen

1. **„Wise ist nur ein Zahlungsdienstleister, da sieht keiner etwas."** Falsch. Wise ist ein regulierter Finanzakteur und unterliegt vollständig dem CRS, genau wie eine Filialbank.
2. **„Wenn ich die LLC eintrage, taucht mein Name nicht auf."** Bei jeder Passive NFE falsch: Die beherrschenden Personen werden namentlich gemeldet. Und die meisten Single-Member-LLCs werden als Passive NFE eingestuft, einfach weil die Bank vorsichtig agiert.
3. **„Mein Durchschnittssaldo war winzig, also werde ich nicht gemeldet."** Wise meldet den Saldo zum 31. Dezember, unabhängig davon, wie er sich im Jahr bewegt hat. Der CRS kennt seit 2017 keine Mindestschwelle für Bestandskonten und auch keine für Neukonten.
4. **„Wise habe ich nicht ins Modelo 720 aufgenommen, weil es klein war."** Die Schwelle für das Modelo 720 ist die Summe über alle Ihre ausländischen Konten, kein Limit pro Konto. Wenn Wise plus Mercury plus Revolut plus N26 zusammen 50.000 € überschreiten, sind alle anzugeben.
5. **„Ich nutze Wise nur für FX, nicht zur Verwahrung."** Selbst wenn Sie Wise nur als operatives Einlagenkonto nutzen, bleibt es ein meldepflichtiges Finanzkonto. Die Unterscheidung Einlage versus Verwahrung verändert den Block „Ertragsdetail", nicht den Bericht über den Saldo.

### Wie sich Wise gegenüber Revolut und Mercury schlägt

| Aspekt | Wise Europe (BE) | Revolut Bank UAB (LT) | Mercury (US) |
| --- | --- | --- | --- |
| CRS-pflichtig | Ja | Ja | Nein |
| Meldet wirtschaftlich Berechtigten der LLC | Ja (typisch Passive NFE) | Ja (typisch Passive NFE) | Nein |
| Natives Anlageprodukt | Wise Assets, Wise Interest | Stocks, Vault | Treasury, FDIC sweep |
| Native Multi-Währung | Exzellent | Exzellent | Hauptsächlich USD |
| Eignung als Hauptkonto der LLC | Sekundär | Sekundär | Primär |

Vertiefter Vergleich in <a href="/de/blog/wise-business-mit-ihrer-llc-der-vollstandige-leitfaden-fur">dem vollständigen Leitfaden zu Wise Business für Ihre LLC</a>, in <a href="/de/blog/revolut-business-und-crs-was-ihrer-steuerbehorde-gemeldet">unserem dedizierten Beitrag zu Revolut und CRS</a> und, speziell zur belgischen IBAN, in <a href="/de/blog/wise-iban-und-llc-was-wirklich-an-die-steuerbehoerde">was die Wise-IBAN Ihrer LLC an die Steuerbehörde meldet</a>.

### Wie Sie das richtig planen

1. **Bringen Sie die Selbstauskunft vom ersten Tag an in Ordnung.** Seien Sie präzise bei der CRS-Klassifikation der LLC und bei den beherrschenden Personen. Lügen oder Auslassen ist ein Verstoß und in einigen Jurisdiktionen eine Straftat.
2. **Nutzen Sie Wise als sekundäres Operativkonto**, nicht als Hauptkonto Ihrer LLC, wenn Sie den CRS-Fußabdruck in Ihrem Wohnsitzland minimieren möchten. Mercury bleibt das natürliche Hauptkonto einer US-LLC.
3. **Halten Sie Ihre Dokumentation konsistent.** Ihre CRS-Selbstauskunft bei Wise, Ihr Modelo 720 (Spanien) oder dessen LATAM-Pendant und Ihre IRPF-Erklärung müssen dieselbe Geschichte erzählen.
4. **Planen Sie den Endsaldo.** Wenn Sie wissen, dass Sie zum 31.12. einen hohen Saldo halten, planen Sie ein, dass dieser sauber deklariert und sauber begründet ist (Mittelherkunft, betrieblicher Zweck, bereits gezahlte Steuern).
5. **Heben Sie den Blick auf den Gesamtrahmen**: <a href="/de/blog/gestaltung-einer-soliden-internationalen-steuerstruktur">die Gestaltung Ihrer Gesamtstruktur</a> entscheidet, ob Wise plus LLC plus Ihr Wohnsitz zusammenpassen oder zerbrechen.

### Zusammenfassung

Wise Business ist keine Abkürzung, um steuerliches Reporting zu umgehen. Es ist eine exzellente regulierte Fintech, die über CRS aus Belgien an Ihre Steuerbehörde meldet. In eine kohärente Struktur mit Ihrer US-LLC eingebettet, ist sie ausgesprochen nützlich. Schlecht eingebettet oder mit Selbstauskünften benutzt, die nicht zur Realität passen, wird sie zur häufigsten Quelle der typischen Steuerprobleme, die wir auf den Tisch bekommen.

## Steuer-Compliance in Deutschland, Österreich und der Schweiz: CFC, Hinzurechnungsbesteuerung und Einkünftezurechnung

Eine US-LLC ist ein legales und international anerkanntes Instrument. Compliance endet aber nicht mit der Gründung: als Eigentümer mit Steuerwohnsitz in Deutschland (§§ 8, 9 AO), Österreich (§ 26 BAO) oder der Schweiz (Art. 3 DBG) hat Ihre Finanzverwaltung weiterhin das Recht, die Erträge der LLC zu besteuern. Entscheidend ist zu wissen, **unter welchem Regime** diese Besteuerung greift.

### Im deutschsprachigen Raum

- **Deutschland (EStG, AStG, AO).** Eine operative *Single-Member Disregarded* LLC (echte Dienstleistungen, ohne erhebliche Passivität) wird in der Regel als **ausländische Personengesellschaft** qualifiziert (BMF-Schreiben vom 19.03.2004): Die Einkünfte werden dem Gesellschafter über die **einheitliche und gesonderte Feststellung (§ 180 AO)** zugerechnet, je nach Tätigkeit als Einkünfte aus Gewerbebetrieb (§ 15 EStG), aus selbständiger Arbeit (§ 18 EStG) oder aus Kapitalvermögen (§ 20 EStG). Optiert die LLC zur Besteuerung als *Corporation* via Form 5472 in Verbindung mit **Form 8832** (dem IRS-Wahlformular) und steht sie unter Kontrolle eines in Deutschland Ansässigen mit überwiegend passiven Einkünften und Niedrigbesteuerung, greift die **Hinzurechnungsbesteuerung nach §§ 7–14 AStG**. Die Qualifizierung ist nicht optional: sie hängt von der wirtschaftlichen Substanz und der Ähnlichkeitstypisierung mit deutschen Gesellschaftsformen ab.
- **Meldepflichten in Deutschland.** US-Bankkonten und alle europäischen IBAN-Konten auf Ihren Namen (Wise, Revolut, N26, Wallester): **Anlage AUS** und **Anlage KAP** zur ESt-Erklärung, ohne Bagatellgrenze. Mitteilung der Beteiligung an einer ausländischen Gesellschaft nach **§ 138 AO** innerhalb von 5 Monaten nach Ablauf des Kalenderjahres, in dem die Beteiligung erworben wurde; bei Verstoß Bußgeld bis 25.000 €. Bei Anwendung der Hinzurechnungsbesteuerung zusätzlich **Anlage AStG** mit dem Hinzurechnungsbetrag. Und falls doch eine Aufforderung kommt: bei Exentax liegt das Dossier bereit, Sie antworten in Stunden, nicht in Wochen.
- **DBA Deutschland–USA (1989, Protokoll 2008).** Das Abkommen (BGBl. 1991 II 354 mit Änderungsprotokoll 2008) regelt die Doppelbesteuerung von Dividenden, Zinsen und Lizenzgebühren. Eine LLC ohne Betriebsstätte in Deutschland begründet für sich genommen keine Betriebsstätte des Gesellschafters, aber die **Geschäftsleitung (§ 10 AO)** kann eine entstehen lassen, wenn die gesamte Verwaltung von deutschem Gebiet aus erfolgt — mit Folge der Steuerpflicht der LLC selbst nach KStG.
- **Österreich (EStG, KStG).** Vergleichbare Logik: ausländische Personengesellschaft wird transparent behandelt (§ 23 EStG), Beilage E1kv für Kapitaleinkünfte, KZ 754 für ausländische Erträge mit Anrechnung. Die **Methode der Befreiung mit Progressionsvorbehalt** kommt bei aktiven Einkünften zur Anwendung; passive Einkünfte unterliegen der **Anrechnungsmethode** nach DBA Österreich–USA.
- **Schweiz (DBG, StHG).** Die LLC wird je nach Kanton entweder als ausländische Personengesellschaft (Transparenz im Wertschriftenverzeichnis) oder als Kapitalgesellschaft qualifiziert. Die **Eidgenössische Steuerverwaltung (ESTV)** koordiniert die Behandlung mit den kantonalen Steuerverwaltungen. Bei wirtschaftlicher Doppelansässigkeit greift Art. 4 DBA Schweiz–USA mit Tie-Breaker-Tests.

Praktische Regel: Eine operative LLC mit Substanz, korrekt im Wohnsitzstaat erklärt, ist **legitime Steuerplanung**. Eine LLC, die zur Verschleierung von Einkünften, zur Vortäuschung der Nichtansässigkeit oder zur unbegründeten Verlagerung passiver Einkünfte dient, fällt unter **Art. 15 LGT (Missbrauch)** oder im schlimmsten Fall unter **Art. 16 LGT (Simulation)**. Den Unterschied machen die Tatsachen, nicht das Papier.

Bevor Sie weiterlesen, bringen Sie Zahlen in Ihren Fall: Der <a href="/de#calculadora">Exentax-Rechner</a> vergleicht in unter 2 Minuten Ihre aktuelle Steuerlast mit der, die Sie mit einer im Wohnsitzland korrekt deklarierten US-LLC tragen würden.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

Bei Exentax richten wir die Struktur so ein, dass sie ins erste Szenario passt, und wir dokumentieren jeden Schritt, damit Ihre lokale Erklärung im Falle einer Prüfung sauber verteidigt werden kann.

<!-- exentax:cta-mid -->
**Klingt aufwendig?** <a href="/de/leistungen">Unsere Leistungen</a> decken „Wise Business und CRS: was Ihrer Steuerbehörde gemeldet wird und wie Sie es in Ihre Struktur einbauen" bereits ab, fristgerecht eingereicht, ohne dass Sie etwas tun müssen.

<!-- exentax:cta-final -->
**Schildern Sie uns Ihren Fall, wir sagen Ihnen, wo Sie anfangen.** Buchen Sie ein 30-minütiges Gespräch zu „Wise Business und CRS: was Ihrer Steuerbehörde gemeldet wird und wie Sie es in Ihre Struktur einbauen" und wir gehen es gemeinsam durch.

<!-- exentax:legal-refs-v1 --><!-- exentax:execution-v2 -->
## Wise Business und CRS: wie es an Ihre Steuerbehörde meldet und warum Sie immer deklarieren sollten

Wise Business ist für Ihre LLC operativ exzellent — Multi-Währung, günstige FX, lokale IBANs in mehreren Jurisdiktionen — und aus Sicht des steuerlichen Reportings ist es eine Finanzinstitution, die voll dem CRS unterliegt. Wenn Sie steuerlich in Deutschland, Spanien, Frankreich, Italien, Portugal oder einem anderen CRS-Land ansässig sind, erhält Ihre Steuerbehörde die Daten jedes Jahr. Es lohnt sich zu wissen, was genau ankommt und wie es abgeglichen wird.

- **Regulatorischer Status von Wise Business.** Wise operiert mit mehreren Lizenzen: Wise Payments Limited (UK FCA), Wise Europe SA (Belgien NBB), Wise USD Inc. (US <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>), unter anderem. Jede regionale Einheit meldet nach dem Regime ihrer Jurisdiktion. Für europäische Wise-Business-Nutzer wird das CRS-Reporting von Wise Europe SA an die Belgische Nationalbank vorgenommen, die mit dem Rest der CRS-Jurisdiktionen teilt — einschließlich des Wohnsitzes des wirtschaftlich Berechtigten.
- **Genau übermittelte Daten.** Identifikation des wirtschaftlich Berechtigten gemäß KYC (vollständiger Name, Ausweis oder Reisepass, Anschrift, beim Onboarding erklärter steuerlicher Wohnsitz), Saldo zum 31. Dezember je Währung (Wise Multi-Währung meldet jeden USD-, EUR- und GBP-Saldo), gesamte jährliche Bruttobewegung sowie Konto-Identifikatoren (belgische BE-IBAN für EUR, US-Routing-Nummer für USD usw.). Einzeltransaktionen werden NICHT übertragen, Aggregate schon.
- **Automatischer Abgleich mit Ihrer ESt oder KSt.** Die deutsche Finanzverwaltung verknüpft die CRS-Daten mit Ihrer Steuer-ID, um sie mit Folgendem abzugleichen: (1) Anlage AUS und Mitteilungspflichten nach § 138 AO bei wesentlichen Auslandsbeteiligungen; (2) Hinzurechnungsbesteuerung nach §§ 7 ff. AStG bei kontrollierter LLC mit passiven Einkünften; (3) ESt durch Einkünftezurechnung. Diskrepanz = automatischer Alarm. Typische Folge: Auskunftsersuchen, anschließend Verifikationsverfahren, falls Sie nicht mit Dokumentation antworten.
- **Was sich ändert, wenn Ihre LLC Wise Business hinzunimmt.** Wise Business EUR (belgisches Konto) meldet schneller und vollständiger als Wise USD (US-Sublizenzkonto). Wenn Sie beides haben (Wise Multi-Währung), melden beide, aber über unterschiedliche Kanäle (Belgien → CRS, US → FATCA-IGA). Praktische Folge: Die fiskalische Sichtbarkeit ist identisch, nur die Latenz unterscheidet sich.

### Was uns am häufigsten gefragt wird

**Wenn ich Wise Business als LLC eröffne, meldet das an die USA oder an mein Land?** Es meldet an den steuerlichen Wohnsitz des wirtschaftlich Berechtigten — der natürlichen Person hinter der Entität. Wenn Sie beim KYC „Deutschland" angegeben haben, geht die Information über CRS nach Deutschland. Die LLC wird zur Identifikation des UBO als transparent behandelt; CRS schaut auf den Menschen dahinter.

**Kann ich die LLC am Wohnsitz erklären, ohne Wise spezifisch anzugeben?** Nein. Die LLC ist eine Pflicht (Einkünftezurechnung oder Dividendenbehandlung je nach Land). Wise ist das Bankkonto der LLC, und Sie müssen es im entsprechenden Formular angeben (Modelo 720 in Spanien, Anlage AUS und ggf. § 138 AO in Deutschland, 3916 in Frankreich, RW in Italien). Zwei verschiedene Pflichten, zwei automatische Abgleiche.

Bei Exentax strukturieren wir die Konten Wise + Mercury + Stripe von Anfang an unter Berücksichtigung dessen, was CRS und FATCA melden, und planen die lokalen Erklärungen (720, 721, AUS, 3916, RW) — damit der automatische Abgleich weder Auskunftsersuchen noch Zurechnungs-Strafen auslöst.
<!-- /exentax:execution-v2 -->

## Referenzen: Quellen und Bankenrahmen

Die oben beschriebenen Bankoperationen stützen sich auf öffentliche Dokumentation und auf die aktuell geltenden Richtlinien jeder Plattform:

- **Bank Secrecy Act und FinCEN.** 31 U.S.C. §5318 (verpflichtende KYC/AML-Programme für Finanzinstitute), 31 CFR Part 1010 (CIP, Kundenidentifikation) und 31 U.S.C. §5336 mit der FinCEN Reporting Rule, in Kraft seit 1. Januar 2024 (Beneficial Ownership Information Report).
- **FATCA und CRS.** IRC §1471–1474 (FATCA und Formulare W-8/W-9), Modell-1-Regierungsabkommen, die die USA mit Spanien und mehreren LATAM-Ländern unterzeichnet haben, sowie der Common Reporting Standard (CRS) der OECD, an dem die USA nicht teilnehmen, der aber sehr wohl für Fintechs mit europäischer Lizenz gilt (Wise Europe SA in Belgien, Revolut Bank UAB in Litauen).
- **Spezifische Plattformen.** Veröffentlichte Nutzungsbedingungen, Datenschutzerklärungen und regulatorische FAQs von Mercury (Choice Financial Group / Evolve Bank, FDIC), Relay (Thread Bank, FDIC), Wise Business (FinCEN MSB in den USA; Wise Europe SA in der EU; Wise Payments Ltd. im UK), Revolut Business und Payoneer.

Zu Informationszwecken; jeder Bankenfall erfordert eine eigene Analyse von KYC, Wohnsitzjurisdiktion und Volumen.

_Weiter dazu: [Visa und Mastercard: was die Steuerbehörden tatsächlich von Ihren Kartenausgaben sehen](/de/blog/visa-mastercard-reporting-was-die-finanzamter-von)._

<!-- related-inline-stripped-2026-04 -->

Möchten Sie dieses Vorgehen auf Ihren Fall anwenden? <a href="/de/buchen">Buchen Sie ein Gespräch mit dem Exentax-Team</a> und wir gehen Ihre LLC mit echten Zahlen in dreißig Minuten durch, ohne Verpflichtung.

<!-- exentax:defensa-fiscal-v1 -->
## Was, wenn das Finanzamt nach meiner LLC fragt?

  Das ist die Frage, die in der ersten Beratung am häufigsten gestellt wird, und die kurze Antwort lautet: Ihre LLC ist nicht intransparent, und bei korrekter Deklaration schließt eine Prüfung mit Standardformularen ab. Das deutsche Finanzamt, das österreichische Finanzamt oder die kantonale Steuerverwaltung können das Certificate of Formation des Bundesstaats (Wyoming, Delaware oder New Mexico), die vom <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> ausgestellte EIN, das unterzeichnete Operating Agreement, die Mercury- oder Wise-Auszüge des Geschäftsjahres, den eingereichten Form 5472 mit 1120 pro-forma sowie die Buchhaltung anfordern, die Einnahmen, Ausgaben und Bewegungen abstimmt. Liegt all das geordnet vor, eskaliert die Prüfung nicht. Genau deshalb halten wir bei Exentax Ihren Kalender bündig — Sie müssen nicht mehr an Fristen denken, wir schließen sie ab, bevor sie zubeißen.

  Was die Steuerbehörden zu Recht verfolgen, sind Strohmannstrukturen, Papier-Steueransässigkeit und nicht erklärte Auslandskonten. Eine sauber aufgesetzte LLC ist genau das Gegenteil: Sie erscheinen als **wirtschaftlich Berechtigter** im BOI Report, wenn er anwendbar ist (überprüfbar unter <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), Sie unterschreiben die Bankkonten und Sie erklären das Einkommen dort, wo Sie leben. Die Struktur ist beim Secretary of State des Bundesstaats registriert, in den IRS-Akten und, sobald eine europäische Bank im Spiel ist, innerhalb des CRS-Perimeters der <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.

  Der Fehler, der eine Prüfung wirklich entgleisen lässt, ist nicht die LLC selbst, sondern die fehlerhafte Zuordnung des Einkommens in der persönlichen Einkommensteuererklärung, das fehlende KAP/AUS bei deutschen Residenten oder die unterlassene Anlage A1 und Beilagen E25/E26 bei österreichischen Residenten. Diese drei Fronten schließen wir vor der Anfrage, nicht danach. Atmen Sie durch: bei Exentax ist das Routine, wir bringen Sie auf den Stand und die nächste Prüfung schließt in einer Runde, ohne Drama.

  ## Was eine LLC NICHT tut

  - **Sie befreit Sie nicht von der Steuerpflicht zu Hause.** Wer in Deutschland, Österreich oder der Schweiz steuerlich ansässig ist, versteuert das Welteinkommen vor Ort. Die LLC ordnet den US-Teil (null Bundesteuer für die SMLLC pass-through ohne ECI), sie schaltet die heimische Besteuerung nicht ab. Die Einkommensteuer wird auf den zugewiesenen Gewinn berechnet, nicht auf die tatsächlich ausgeschütteten Beträge.
  - **Sie ist kein Offshore-Konstrukt und keine BEPS-Struktur.** Sie ist eine vom IRS anerkannte US-Gesellschaft, in einem konkreten Bundesstaat mit physischer Adresse, registriertem Agenten und jährlichen Informationspflichten registriert. Klassische Offshore-Standorte (BVI, Belize, Seychellen) hinterlassen keine öffentliche Spur; eine LLC hinterlässt fünf.
  - **Sie schützt Sie nicht bei vermischten Vermögen.** Das *pierce the corporate veil* greift, sobald ein Gericht erkennt, dass LLC und Gesellschafter dieselbe Geldbörse sind: vermischte Konten, private Ausgaben aus der LLC, kein Operating Agreement, keine Buchhaltung. Drei verdächtige Bewegungen genügen.
  - **Sie spart keine Sozialbeiträge im Inland.** Freiberufler in Deutschland, Selbständige in Österreich, AHV-Pflichtige in der Schweiz: der monatliche Beitrag bleibt identisch. Die LLC bedient die internationale Kundschaft; der persönliche Sozialbeitrag bleibt unabhängig. Siehe Bekanntmachungen im Bundesgesetzblatt sowie spanische Vergleichsregelungen im <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a>.
  - **Sie befreit Sie nicht von der Auslandskonto-Meldepflicht.** Deutschland: KAP/AUS, ggf. § 138 AO Anzeige bei Beteiligungen über 10 %. Österreich: Beilagen E25/E26 zur Einkommensteuererklärung. Schweiz: kantonale Vermögensdeklaration. Diese Pflichten liegen bei der Person, nicht bei der LLC.

  Bei Exentax schließen wir diese fünf Fronten jedes Jahr parallel zum US-Bundeskalender (Form 5472, 1120 pro-forma, FBAR, staatlicher Annual Report, BOI Report bei Anwendbarkeit). Ziel ist, dass keine Prüfung ein loses Ende findet und die Struktur einer rückwirkenden Prüfung über 5 bis 7 Jahre standhält.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22wise%20business%20crs%20reporting%20fiscal%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.

<!-- exentax:conv-fill-v1 -->
Oder rufen Sie uns direkt an: <a href="tel:+34614916910">+34 614 916 910</a>, wenn Sie lieber sprechen möchten.

Für staatsspezifische Details siehe unsere <a href="/de/leistungen/llc-wyoming">Wyoming-LLC-Leistungsseite</a> mit festen Kosten und Fristen.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

`;
