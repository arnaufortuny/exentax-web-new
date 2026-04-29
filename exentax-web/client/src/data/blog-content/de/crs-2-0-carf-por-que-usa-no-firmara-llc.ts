export default `

Alle paar Jahre erscheint eine "endgültige" Version des automatischen Informationsaustauschs in Steuersachen, und mit ihr die Frage, die wir bei Exentax am häufigsten hören: Wenn die OECD mit CRS 2.0 und CARF nochmals nachzieht, was passiert dann genau mit einer <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a> im Eigentum eines europäischen oder lateinamerikanischen Nichtansässigen? Die kurze Antwort: Der Perimeter wird außerhalb der Vereinigten Staaten enger, nicht innerhalb. Die lange Antwort, auf die es ankommt, verlangt zu verstehen, warum Washington das ursprüngliche CRS nie unterzeichnet hat, warum es auch CRS 2.0 nicht unterzeichnen wird und wie sich das auf Ihre heutige Struktur und auf Ihre Planung der nächsten Jahre auswirkt.

> **Bringen Sie Zahlen in Ihren Fall.** Der <a href="/de#calculadora">Exentax-Rechner</a> vergleicht Ihre aktuelle Steuerlast mit derjenigen, die Sie mit einer korrekt strukturierten und im Wohnsitzland sauber deklarierten LLC tragen würden.

## Zusammenfassung für Eilige

CRS 2.0 (die überarbeitete Fassung des Common Reporting Standard der OECD) und CARF (Crypto-Asset Reporting Framework) erweitern, was Banken und Krypto-Börsen den Steuerbehörden der teilnehmenden Jurisdiktionen melden. Mehr Daten, mehr meldepflichtige Stellen und vor allem deutlich mehr Krypto im Perimeter. Die Vereinigten Staaten sind nicht in diesem Bild, und nichts in ihrer Steuerpolitik der letzten zehn Jahre deutet darauf hin, dass sie es sein werden: Sie haben mit FATCA ein eigenes, bilaterales und einseitig ausgerichtetes Regime und ziehen damit Billionen Dollar an ausländischem Kapital an, gerade weil sie die einzige große Jurisdiktion außerhalb des CRS bleiben. Für die nichtansässige Eigentümerin oder den nichtansässigen Eigentümer einer LLC ist das keine Abkürzung, um etwas zu "verstecken"; es ist ein technischer Befund, der die Wahl des Bundesstaats, die Banking-Architektur und die Kohärenz mit Ihrer Erklärung im Wohnsitzland prägt.

## Ursprüngliches CRS: was es lösen wollte und wo es zu kurz blieb

Der **Common Reporting Standard** wurde vom OECD-Rat als politische Antwort auf das G20-Mandat nach der Finanzkrise und den Steuerskandalen des vergangenen Jahrzehnts (LuxLeaks, SwissLeaks, Panama Papers) verabschiedet. Man importierte die Mechanik von FATCA, die für die USA bereits unilateral lief, und verallgemeinerte sie auf über 110 Jurisdiktionen unter einem Multilateral Competent Authority Agreement (MCAA), das die Flüsse zwischen jedem Paar teilnehmender Länder bilateral aktiviert.

Der Standard verpflichtet jede **Reporting Financial Institution** (Banken, Broker, Fintechs mit Bankerlaubnis, Investmentfonds, Versicherungen mit Investmentprodukten), den Inhaber zu identifizieren, dessen steuerliche Ansässigkeit nicht der Konto-Jurisdiktion entspricht, und Folgendes zu melden:

- Inhaberdaten: Name, Anschrift, Land der steuerlichen Ansässigkeit, TIN, Geburtsdatum und -ort.
- Entitätsdaten: Name, TIN, Land. Bei Konten von **passiven NFEs** zusätzlich die **beherrschenden Personen** (controlling persons).
- Kontodaten: Nummer, Name und Identifikator des Finanzinstituts.
- Salden und Erträge: Saldo zum Jahresende, Bruttozinsen, Bruttodividenden und auf Verwahrkonten Bruttoerlöse aus Veräußerungen oder Rückzahlungen.

Diese Meldung erfolgt jährlich, üblicherweise im September des dem Berichtszeitraum folgenden Jahres, und wird mit Ihren Erklärungen im Wohnsitzland abgeglichen. In Deutschland regelt das **Finanzkonten-Informationsaustauschgesetz (FKAustG)** die Umsetzung des CRS, in Österreich das GMSG, in der Schweiz das AIA-Gesetz. Die Sicht der Ansässigen behandeln wir in unserem Begleitartikel zu <a href="/de/blog/crs-fur-ansassige-in-spanien-und-lateinamerika-reale">CRS für Ansässige in Spanien und Lateinamerika</a>.

Die OECD selbst räumte ein, dass CRS 1.0 wesentliche Lücken ließ: **E-Geld-Institute** und **EMIs** lagen je nach Jurisdiktion in einer Grauzone; **Krypto-Wallets** und **Börsen** waren komplett außerhalb; manche **Investmentvehikel** ohne klassische Verwahrung entgingen der Klassifizierung; und die Sorgfalt bei den **controlling persons** passiver NFEs war uneinheitlich. Der politische Druck zum Schließen dieser Lücken kam vor allem aus der EU-Kommission und aus Deutschland.

## CRS 2.0 und CARF: das neue Paket der OECD

Die OECD hat zwei Bausteine im Block verabschiedet, die zusammen gelesen werden müssen. Erstens die umfassende Überarbeitung des Common Reporting Standard, informell **CRS 2.0**. Zweitens das **Crypto-Asset Reporting Framework (CARF)**, das die Logik des automatischen Austauschs auf das Krypto-Universum ausdehnt. Beide wurden als ein Paket veröffentlicht und werden in der EU über die **Richtlinie DAC8** umgesetzt (DAC8 ändert die 2011/16/EU, um CARF und die Neuerungen des CRS einzuschließen). Den europäischen Baustein vertiefen wir in <a href="/de/blog/dac8-und-kryptowahrungen-die-automatische-steuerliche">DAC8 und Krypto-Reporting</a>.

Die wichtigsten operativen Neuerungen:

1. **Erweiterung des Perimeters auf EMIs und auf elektronische Geldprodukte**, Neobanken ohne volle Banklizenz und digitale Wallets mit einlageähnlichen Diensten.
2. **Krypto-Assets und Stablecoins liegen im Meldebereich**, wenn der Krypto-Dienstleister Präsenz in einer teilnehmenden Jurisdiktion hat (CARF). Erfasst werden Börsen, Verwahrer, Krypto-Derivateplattformen und DeFi-Anbieter mit zentralisierter Komponente.
3. **Verschärfte Sorgfalt bei controlling persons** passiver NFEs: mehr Dokumentation, weniger Spielraum, granularere Selbstauskünfte.
4. **Strengere Behandlung von Gemeinschaftskonten**, Trusts und intransparenten Vehikeln: Bei begründeten Zweifeln an der Ansässigkeit der beherrschenden Person wird die Meldung standardmäßig an mehrere Jurisdiktionen dupliziert.
5. **Wellenförmige Einführung und periodische Überprüfung**: CARF startet wellenartig nach dem Umsetzungskalender jeder Jurisdiktion, EU-Länder voran und der Rest der G20 anschließend.

Für eine in Deutschland, Österreich, der Schweiz oder einem anderen teilnehmenden Land steuerlich ansässige Person ist die praktische Folge klar: Der Großteil des Geldes, das Sie über europäische Fintechs oder über Börsen mit Sitz in teilnehmenden Jurisdiktionen bewegen, fällt in den automatischen Informationsperimeter zu Ihrer Finanzverwaltung. Was vorher "nicht automatisch gemeldet" war, wird zur Ausnahme.

## Zeitplan CRS 2.0, CARF und DAC8: die Daten, auf die es ankommt

Es lohnt sich, die offiziellen Daten griffbereit zu haben, um Presseüberschriften nicht mit dem regulatorischen Kalender zu verwechseln. Die OECD hat **das Paket CRS 2.0 + CARF im Jahr 2023 verabschiedet** und das Referenzdokument *International Standards for Automatic Exchange of Information in Tax Matters — Crypto-Asset Reporting Framework and 2023 update to the Common Reporting Standard* veröffentlicht. Die Europäische Union setzt es durch die **Richtlinie (EU) 2023/2226 (DAC8)** um, die am 17. Oktober 2023 angenommen wurde und die Richtlinie 2011/16/EU ändert, um die CRS-Revision und den CARF-Anwendungsbereich aufzunehmen. Der materielle Anwendungsbeginn ist der **1. Januar 2026**, mit dem **ersten effektiven Austausch im Jahr 2027 über Daten des Geschäftsjahres 2026**. Ergänzt wird der Krypto-Strang durch ein **Multilateral Competent Authority Agreement on CARF**, das von Jurisdiktionen mit Umsetzungszusage unterzeichnet werden kann und bereits von über fünfzig Staaten signiert worden ist.

Die drei heute koexistierenden Schichten passen in eine einzige Tabelle:

| Baustein | Was er erfasst | Wer meldet | Erster Austausch |
| --- | --- | --- | --- |
| **CRS 1.0** (OECD 2014) | Klassische Finanzkonten: Einlagen, Verwahrung, bestimmte Versicherungsverträge, Investmentvehikel | Reporting Financial Institutions teilnehmender Jurisdiktionen | September 2017 |
| **CRS 2.0** (OECD 2023) | Wie oben + E-Geld (EMIs und *Specified Electronic Money Products*), verstärkte Sorgfaltspflichten gegenüber controlling persons, einlagenähnliche Digitalprodukte | Dieselben RFI sowie EMIs und gleichgestellte Anbieter | Ab 2027 über Daten 2026, je nach Umsetzung im Mitgliedstaat |
| **CARF** (OECD 2023) | Kryptoassets: Börsen, Verwahrer, Krypto-Derivate-Plattformen, bestimmte DeFi-Anbieter mit zentralisiertem Element | Reporting Crypto-Asset Service Providers (RCASP) | Januar 2027 über Daten 2026 in der EU, via DAC8 |

Ein praktischer Hinweis, um eine wiederkehrende Verwechslung zu vermeiden: **Die OECD veröffentlicht keinen Standard mit der offiziellen Bezeichnung "CRS 3.0"**. Das Etikett kursiert informell in Presse, Videos und Erklärinhalten als Kurzformel für das OECD-Paket 2023 (CRS 2.0 plus CARF). Wenn Sie "CRS 3.0" lesen oder hören, ist die korrekte regulatorische Lesart "CRS-Revision 2023 + CARF", in der EU über DAC8 angewandt. Es gibt keinen OECD-Text mit dem Titel "CRS 3.0", auf den verwiesen werden könnte: Es gibt das integrierte Dokument von 2023 und die Richtlinie (EU) 2023/2226, die es in Unionsrecht überführt.

## Warum die USA das CRS nicht unterzeichnen werden (die Version ohne Marketing)

Das ist der Teil, der die meiste Verwirrung erzeugt und den wir bei Exentax wöchentlich wiederholen. Die USA haben CRS 1.0 nicht unterzeichnet und werden CRS 2.0 nicht unterzeichnen — aus strukturellen Gründen, nicht aus Versehen. Drei kombinierte Faktoren erklären das:

- **Sie haben bereits FATCA und brauchen das CRS nicht.** Der **Foreign Account Tax Compliance Act**, beschlossen im Rahmen des HIRE Act, verpflichtet ausländische Finanzinstitute, dem IRS Konten von **US persons** (Bürger, US-steuerlich Ansässige und US-Entitäten) zu identifizieren und zu melden. Es ist ein **bilaterales** Regime, das über **Intergovernmental Agreements (IGAs)** Modell 1 (reziproker Austausch über die lokale Behörde) und Modell 2 (direkte Meldung des Finanzinstituts an den IRS) läuft. Die tatsächliche Reziprozität ist sehr begrenzt: Der IRS erhält in der Praxis weit mehr Informationen aus dem Ausland zurück, als er ausländischen Behörden zu Nichtansässigen-Konten in den USA gibt. CRS zu übernehmen würde volle multilaterale Reziprozität bedeuten — genau das, was der Kongress über die gesamte letzte Dekade hinweg, unabhängig von Mehrheitsverhältnissen, blockiert hat.
- **Es ist im US-Interesse, die "Nicht-CRS"-Jurisdiktion der Welt zu sein.** Durch eine Konvergenz von Anreizen sind die USA zur bevorzugten Destination für ausländisches Kapital geworden, das **den größten Finanzmarkt der Welt** mit einem deutlich engeren Austauschperimeter als dem europäischen verbindet. Schätzungen wie die des Tax Justice Network beziffern auf mehrere Billionen Dollar das ausländische Kapital im US-Finanzsystem, das nicht automatisch über CRS gemeldet wird. Ein erheblicher Teil fließt durch **Trusts**, transparente **LLCs** und Private-Banking-Konten in Delaware, Nevada, Wyoming, South Dakota oder Florida. Diese Position gegen einen marginalen Steuermehreingang einzutauschen ist für Washington ein schlechtes Geschäft.
- **Die innenpolitischen Kosten sind prohibitiv.** Eine CRS-Übernahme würde neue Bundesgesetzgebung erfordern, Änderungen am Internal Revenue Code, eine Erweiterung des **Form 1099** und des Konto-Identifikationsregimes sowie eine Doktrinänderung bei der Behandlung von Single-Member LLCs (Disregarded Entities mit ausländischen Eigentümern). Mächtige Interessengruppen (Bankenlobby, Bundesstaaten-Register, Trust-Services-Lobby) blockieren diese Agenda seit Jahren und werden es weiter tun.

Die nüchterne technische Schlussfolgerung: **Die FATCA-vs.-CRS-Asymmetrie ist die zentrale Konstruktion, kein historischer Zufall**. Jede professionelle Planung, die von "Die USA werden bald dem CRS beitreten" ausgeht, baut auf einer Prämisse auf, die Washington konsequent ablehnt.

## Wie die USA mit nichtansässigen LLCs verdienen

Auf den ersten Blick wirkt das Modell paradox. Wenn der IRS auf die Gewinne einer **pass-through LLC** im Eigentum eines Nichtansässigen ohne ECI im US-Territorium keine Bundessteuer erhebt, was haben die USA dann davon, hunderttausende ausländisch gehaltener LLCs in ihren Registern zu führen? Die Antwort hat drei Ebenen:

- **Bundesstaatliche Gründungs- und Erhaltungsgebühren**, wiederkehrend und höchst effizient. Delaware erhebt zum Beispiel jährlich eine **Annual Franchise Tax** von jeder dort gegründeten LLC; multipliziert mit hunderttausenden aktiven Entitäten ist das eine der ersten nicht-steuerlichen Einnahmequellen des Bundesstaats. Wyoming, New Mexico, Florida und Nevada konkurrieren über verschiedene Formate wiederkehrender Gebühren (annual report, registered agent, business license), die einen erheblichen Teil ihrer Haushalte finanzieren. Wir vertiefen das in <a href="/de/blog/new-mexico-vs-wyoming-vs-delaware-welchen-bundesstaat-fur">New Mexico vs Wyoming vs Delaware</a>.
- **Anziehung ausländischen Kapitals in das Finanzsystem**. US-Neobanken (Mercury, Relay), große Geschäftsbanken und Retail-Broker leben zum Teil von Einlagen und Operationen Nichtansässiger, die LLCs für digitale Geschäfte und Anlageportfolios vehikulieren. Dieses Kapital bleibt im US-System, generiert Marge für die Institute und multipliziert die Liquidität der Gesamtwirtschaft.
- **Indirekte Besteuerung über IRS-Formulare 5472 + 1120 — keine Steuer, aber volle Daten**. Auch wenn die nichtansässige pass-through LLC keine Bundessteuer zahlt, **muss sie** jährlich ein Form 5472 mit einem Pro-forma Form 1120 einreichen (Treas. Reg. §1.6038A-2). Der IRS erhält damit eine sehr vollständige Karte der **reportable transactions** zwischen LLC und ausländischem Eigentümer — Daten, die er für Steuer-Intelligence und für die Koordination mit ausländischen Behörden bei Bestehen eines bilateralen Instruments nutzt. Wir erklären die Mechanik in <a href="/de/blog/form-5472-was-es-ist-wer-es-einreichen-muss-und-wie-man-es">Form 5472, was es ist und wie man es einreicht</a>.

Aus den drei Ebenen ergibt sich für Washington eine sehr positive Rechnung: geringe direkte Steuermindereinnahmen, konstante Einnahmen für die Bundesstaaten, ausländisches Kapital im System und ein Aufklärungsperimeter, den der IRS Ende-zu-Ende kontrolliert. Es gibt keinen Anreiz, dieses Gleichgewicht durch CRS-Beitritt zu zerstören.

## Was das alles für Ihre LLC und Ihre Struktur bedeutet

Übersetzt in konkrete Entscheidungen, die wir mit Exentax-Klienten jede Woche treffen — das operative Bild nach Wichtigkeit:

- **Ihre LLC bleibt ein gültiges und deklarierbares Werkzeug.** Dass die USA außerhalb des CRS stehen, macht sie aus Sicht Ihrer heimischen Behörde nicht zu einer "intransparenten Struktur". Sie haben eigene Erklärungspflichten (Deutschland: Anlage AUS, Anlage SO, ggf. Außensteuergesetz; Österreich: AbgEG; Schweiz: Wertschriftenverzeichnis), die nicht vom CRS abhängen. Was sich ändert, ist der automatische Fluss, nicht Ihre Pflicht.
- **Die Banking-Architektur ist der entscheidende Faktor.** Wenn Sie ausschließlich mit US-Konten (Mercury, Relay, Regionalbank) auf den Namen der LLC arbeiten, ist Ihr CRS-Footprint zur heimischen Behörde praktisch null. Sobald Sie eine europäische Schicht hinzufügen (Wise Business, europäisches Revolut Business, N26, Wallester, Payoneer Europe), akzeptieren Sie, dass diese Information bei Ihrer Verwaltung ankommt. Weder gut noch schlecht: Es ist Information, die Ihre Planung absorbieren muss.
- **Krypto wechselt mit CARF das Regime.** Wenn Sie nennenswerte Salden auf Börsen mit Sitz in Europa oder in teilnehmenden Jurisdiktionen halten, gehen Sie davon aus, dass Ihre Behörde diese Daten zeitnah automatisch erhält.
- **Der Bundesstaat zählt aus operativen, nicht aus Steuergründen**. Wyoming und New Mexico bleiben gewinner für Freelancer- und Service-Profile; Delaware bleibt der Gewinner für SaaS mit Kapitalaufnahme oder für Holdings; Florida passt für Fälle mit physischer US-Präsenz. Keine Entscheidung hängt am CRS.
- **Steuerliche Ansässigkeit als Hauptvariable**. Ansässigkeit wird nicht gewählt, sondern festgestellt (Aufenthaltstage, Mittelpunkt der Lebensinteressen, Familie). Die reale Ansässigkeit hinter der FATCA-CRS-Asymmetrie zu verbergen ist neben einem technischen Fehler in den meisten europäischen und lateinamerikanischen Jurisdiktionen ein gesetzlicher Tatbestand mit harten Sanktionen. Genau deshalb halten wir bei Exentax Ihren Kalender bündig — Sie müssen nicht mehr an Fristen denken, wir schließen sie ab, bevor sie zubeißen.

<!-- exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-de -->
## Warum die US-Position zu CRS strukturell ist und nicht politisch

Der Grund, warum die Vereinigten Staaten dem CRS nicht beigetreten sind, ist strukturell und nicht eine Frage politischer Stimmung, die mit jeder Regierung wechseln könnte. Die USA verfügen bereits über ein eigenes Informationsregime via FATCA und über eine inländische Meldeinfrastruktur, die um dieselben Identifikatoren herum gebaut ist, die der IRS verwendet. Der Beitritt zu einem parallelen multilateralen Austausch würde die Arbeit verdoppeln, ohne der US-Seite zusätzliche Sichtbarkeit zu verschaffen, und genau diese Logik bleibt zwischen Regierungen stabil und macht die US-Haltung kalkulierbar.
<!-- /exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-de -->

<!-- exentax:lote34-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-de -->
## Wie sich die Reichweite von CRS 2.0 und CARF als stabile jurisdiktionelle Kartografie statt als bewegliches Ziel lesen lässt

Die Reichweite von CRS 2.0 und CARF liest sich nützlicher als stabile jurisdiktionelle Kartografie zwischen dem Land der Finanz­institution, dem Wohnsitz­land des wirtschaftlich Berechtigten und dem zwischen beiden anwendbaren Rahmen denn als bewegliches Ziel. Die Kartografie ändert sich nicht mit Marketing-Trends, und eine kurze, datierte Notiz im persönlichen Ordner mit den drei Achsen macht die Position überprüfbar.
<!-- /exentax:lote34-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-de -->

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

## Typische Fehler, die wir wöchentlich sehen

- "Meine LLC bankt nur bei Mercury, also weiß meine Behörde nichts." Richtig für den automatischen CRS-Kanal, falsch für die Pflicht. Ihre Erklärung ausländischer Vermögenswerte gilt weiter.
- "Ich nehme Revolut Business, weil es bequemer ist und als europäisches Produkt außerhalb des CRS liegt." Mehrfacher Irrtum. Europäisches Revolut liegt im CRS, und die Eröffnung für eine US-LLC erzeugt nicht automatisch eine europäische IBAN.
- "CARF betrifft mich nicht, ich nutze eine Offshore-Börse." Wenn diese Börse europäische Kunden hat und unter europäischer Lizenz oder mit kommerzieller Präsenz in einer teilnehmenden Jurisdiktion arbeitet, betrifft es Sie sehr wohl.
- "Ich setze die LLC auf den Namen eines Dritten, damit ich nicht identifiziert werde." Das ist eine Strohmannkonstruktion mit harten straf- und steuerrechtlichen Folgen.
- "Die USA werden bald dem CRS beitreten, ich schließe die LLC besser jetzt." Falsche Prämisse angesichts des beobachteten politischen Verlaufs.

<!-- exentax:execution-v2 -->
## Die Exentax-Methode: wie wir diese Planung angehen

CRS 2.0 und CARF sind keine Krise für eine korrekt strukturierte LLC; sie sind eine Perimeter-Verschiebung, die in die Anfangsdiagnose und in die jährliche Wartung einfließt. Die Exentax-Methode wendet drei Blöcke der Reihe nach an und hinterlässt zu jedem Schritt eine Aktenspur, damit die Entscheidung bei jeder Prüfung verteidigbar ist.

- **Diagnose CRS und CARF Ihrer aktuellen Situation.** Wir kartieren jedes Konto auf Ihren Namen und auf den Namen der LLC, identifizieren, welche Stellen an welche Jurisdiktion melden, und gleichen dieses Bild mit Ihren Erklärungen der letzten Steuerjahre ab.
- **Architektur-Design im Einklang mit Ihrer Ansässigkeit.** Hauptbank (Mercury oder Relay), Gateways, Multi-Währungskonten und gegebenenfalls Krypto-Börse passend zu Volumen und Land. Jede Komponente muss steuerlich und operativ Sinn ergeben.
- **Einheitlicher Pflichtenkalender.** Bundesstaatlicher Annual Report, Form 5472 + 1120, BOI Report, Erklärung im Wohnsitzland, Auslandsvermögensmeldung wo zutreffend, alles auf einer Seite mit Vorab-Erinnerungen.

Um diese Methode auf Ihren Fall anzuwenden, öffnen Sie den <a href="/de#calculadora">Exentax-Rechner</a> oder reservieren Sie dreißig Minuten mit dem Team: Sie verlassen das Gespräch mit klarer Diagnose und, falls nötig, einem geordneten Regularisierungskalender — unverbindlich.
<!-- /exentax:execution-v2 -->

## Häufige Fragen

**Verpflichtet CRS 2.0 die USA zu irgendetwas?** Nein. CRS 2.0 ist ein OECD-Standard, der von teilnehmenden Jurisdiktionen übernommen wird. Die USA sind keine CRS-Jurisdiktion und behalten FATCA als eigenes Regime.

**Wenn ich jetzt eine LLC eröffne, wird sie in mehreren Jahren noch außerhalb des CRS sein?** Die politische und ökonomische Linie spricht klar dafür. Es ist keine juristische Bindung Washingtons, aber die solideste Lesart der konsistenten Steuerpolitik der letzten Dekade.

**Muss meine LLC im Rahmen des CRS etwas an mein Land melden?** Ihre LLC als US-Entität ist keine Reporting Financial Institution im Sinne des CRS. Es melden die Banken und Fintechs, bei denen sie Konten hält, je nach Konto-Jurisdiktion.

**Teilt der IRS Informationen über meine LLC mit meiner Behörde?** Nur bei einem konkreten bilateralen Instrument und Erfüllung der formalen Voraussetzungen (DBA-Austausch, FATCA-IGA mit echter Reziprozität, spezifische Amtshilfe). Es gibt keinen automatischen Fluss wie beim CRS.

**Kann ich mit meiner LLC in Europa investieren, ohne dass meine Behörde davon erfährt?** Nein. Liegt das Anlagekonto bei einer europäischen Stelle, meldet diese unter CRS an das Wohnsitzland des wirtschaftlich Berechtigten.

**Ab wann macht sich CARF in der Praxis bemerkbar?** Die ersten Meldewellen kommen bereits nach dem Umsetzungstempo der einzelnen Länder an. Die Faustregel: Jede Börse mit Sitz oder Lizenz in einer CARF-Jurisdiktion meldet Ihre Salden an das Wohnsitzland Ihrer Selbstauskunft.

## Sprechen wir über Ihren Fall

Jede Struktur hat Nuancen: Wohnsitzland, Tätigkeitsart, Krypto oder nicht, Volumen, Alter der LLC, aufgelaufene Pflichten. Bei Exentax prüfen wir Ihre Situation, bemessen die reale Exposition gegenüber CRS 2.0 und CARF und gestalten LLC-Struktur und Banking-Architektur passgenau. Wir begleiten Sie jährlich in der Wartung, damit Kalender und Erklärungen mit der Realität Ihres Geschäfts kohärent bleiben.

<!-- exentax:lote7-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-bis -->
## CRS 2.0, CARF und die LLC: Was sich für US-gegründete Strukturen ändert

Die Erweiterung von CRS auf CRS 2.0 und die Einführung von CARF für
Krypto-Assets verändern die internationale Berichts-Topologie, in
die eine US-LLC eingebettet ist. Da die USA CRS nicht unterzeichnet
haben und in absehbarer Zeit nicht unterzeichnen werden, bleibt die
LLC selbst kein direkter CRS-Sender. Aber die Banken, Fintechs und
Krypto-Plattformen, die die LLC nutzt und die in CRS-/CARF-
Jurisdiktionen ansässig sind, melden weiterhin nach den Regeln, die
auf sie anwendbar sind.

Praktisch heisst das: die LLC ist nicht der meldende Akteur, aber
ihre Konten ausserhalb der USA und die Krypto-Posten ihres
Mitglieds in CRS-/CARF-Jurisdiktionen werden weiterhin gemeldet.
Die Folge ist, dass die heimische Steuerverwaltung des Mitglieds
über die meisten relevanten Flüsse Sichtbarkeit hat, auch wenn die
LLC US-gegründet ist. Wir gestalten die Berichts-Hygiene mit dem
Mitglied so, dass die Heimaterklärung mit dem übereinstimmt, was
diese Plattformen jährlich melden.

Eine zusätzliche Konsequenz von CRS 2.0 ist die Erweiterung der
gemeldeten Felder um neuere digitale Vermögensformen und um eine
robustere Wirtschaftlich-Berechtigte-Identifikation. Für eine LLC,
deren wirtschaftlich Berechtigter klar ist und deren BOI-Meldung
sauber gepflegt ist, ist diese Erweiterung neutral. Für Strukturen,
die undurchsichtig waren, schließt sie eine Lücke, die nicht mehr
verfügbar sein wird.

CARF wiederum betrifft Mandanten, die Krypto-Assets über Plattformen
in Unterzeichner-Jurisdiktionen halten. Die Berichterstattung läuft
durch die Plattform an die zuständige Behörde des Nutzers. Die
Disziplin ist hier dieselbe wie für DAC8 in der EU: Nutzerdaten
aktuell halten, Plattformberichte mit dem internen Hauptbuch
abgleichen, Belege für nicht-CARF-Posten geordnet aufbewahren.

<!-- /exentax:lote7-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-bis -->

<!-- exentax:lote7-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-ter -->
## Was Mandanten konkret tun, um in der CRS-2.0/CARF-Welt ruhig zu schlafen

Im Tagesgeschäft sind drei Disziplinen entscheidend: die
Aktualität der hinterlegten Wohnsitzdaten auf jeder Plattform, die
saubere Trennung zwischen LLC-gehaltenen und persönlich gehaltenen
Vermögenspositionen, und die jährliche Abstimmung zwischen
Plattformberichten und der heimischen Erklärung des Mitglieds.
Mandanten, die diese drei Linien stabil halten, erleben CRS 2.0 und
CARF als verwaltungstechnische Hintergrundgeräusche statt als
Quelle wiederkehrender Überraschungen.

<!-- /exentax:lote7-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-ter -->

<!-- exentax:lote7-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-quater -->
## Eine längere Sicht: Wie sich CRS 2.0 und CARF mit der LLC-Routine verbinden

In der Praxis bedeutet die parallele Existenz von US-Nicht-CRS-
Status, EU-CRS-2.0-Berichterstattung und CARF-Kryptoberichterstattung
nicht, dass die LLC drei verschiedene Compliance-Workflows
parallel laufen lassen muss. Im Gegenteil: Sie laufen alle durch
denselben Kanal — die Heimaterklärung des Mitglieds. Was sich für
das Mitglied ändert, ist die Spiegelqualität der Plattform-
Berichte, nicht der Erklärungsinhalt selbst.

Wir formulieren mit jedem Mandanten ein kurzes Memo, das festhält:
welche Konten und Plattformen unter welche Berichts-Topologie
fallen, welche Identifikatoren (Steuer-ID, Adresse, Aufenthaltstitel)
auf jedem Profil aktuell sind, und wann der jährliche Abgleich
stattfindet. Dieses Memo ist die einzige nötige Brücke zwischen den
verschiedenen Berichtswelten und der konkreten Erklärung des
Mitglieds.

Wenn ein Mitglied umzieht oder die Aktivität sich erweitert,
aktualisieren wir das Memo und die Profile gleichzeitig. So bleibt
die Spiegelqualität hoch und der Berichtszyklus ein Hintergrund-
ereignis, kein Ereignis, das die Aufmerksamkeit des Mitglieds
beansprucht.

<!-- /exentax:lote7-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-quater -->

<!-- exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-de-bis -->
## Wie sich diese Stabilität in der Praxis nutzen lässt

Für ein LLC-Mitglied, das aus einer CRS-Jurisdiktion heraus arbeitet, bedeutet diese strukturelle Stabilität, dass die Planung der Dokumentation langfristig angelegt werden kann, ohne jährlich auf Politikänderungen reagieren zu müssen. Dieselbe Arbeitsmappe trägt mehrere Jahre.
<!-- /exentax:lote16-native-v1:crs-2-0-carf-por-que-usa-no-firmara-llc-de-bis -->

<!-- exentax:cross-refs-v1 -->
### Zum Weiterlesen

- [DAC 8 und Kryptowährungen: die automatische steuerliche Meldung von Krypto-Assets ab 2026](/de/blog/dac8-und-kryptowahrungen-die-automatische-steuerliche)
- [Wise Business und CRS: was Ihrer Steuerbehörde gemeldet wird](/de/blog/wise-business-und-crs-was-ihrer-steuerbehoerde-gemeldet-wird)
- [Visa und Mastercard Reporting: was die Finanzämter von Kartenzahlungen sehen](/de/blog/visa-mastercard-reporting-was-die-finanzamter-von)
<!-- /exentax:cross-refs-v1 -->

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
<!-- exentax:conv-fill-v1 -->
Oder rufen Sie uns direkt an: <a href="tel:+34614916910">+34 614 916 910</a>, wenn Sie lieber sprechen möchten.

Für staatsspezifische Details siehe unsere <a href="/de/leistungen/llc-wyoming">Wyoming-LLC-Leistungsseite</a> mit festen Kosten und Fristen.

<!-- /exentax:conv-fill-v1 -->

<!-- exentax:conv-fill-v1 -->
Oder schreiben Sie uns auf <a href="https://wa.me/34614916910">WhatsApp unter +34 614 916 910</a> und wir antworten heute.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->
`;
