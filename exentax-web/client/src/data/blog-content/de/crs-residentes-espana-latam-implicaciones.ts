export default `
Der Common Reporting Standard (CRS) ist das wichtigste Stück internationaler Steuerregulierung des letzten Jahrzehnts, und sehr wenige Menschen verstehen, was er für jemanden bedeutet, der eine <a href="/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten">US-LLC</a> oder Konten außerhalb seines Wohnsitzlandes besitzt. Bauen wir das Thema mit technischer Präzision und ohne Alarmismus auseinander.

Dieser Beitrag wurde ursprünglich für ein spanischsprachiges Publikum aus Spanien und Lateinamerika verfasst, trifft aber einen Nerv, der deutschsprachige LLC-Inhaber direkt betrifft. Sobald Sie ein USD-Konto auf Ihre LLC halten oder ein Konto außerhalb Ihres Wohnsitzlandes führen, entstehen für in **Deutschland** ansässige Selbstständige Meldepflichten, die viele erst beim ersten Schreiben des Finanzamts entdecken: automatischer Informationsaustausch (AIA/CRS), **Anlage AUS** zur Einkommensteuererklärung für ausländische Einkünfte, gegebenenfalls **§138 AO** zur Mitteilung von Auslandsbeziehungen, plus die Erklärung der Beteiligung an einer ausländischen Personengesellschaft (für Single-Member-LLCs typischerweise einheitliche und gesonderte Feststellung). Für **Österreicher** kommen die Anlage E1kv und die KZ-Felder zu ausländischen Kapitalerträgen hinzu, für **Schweizer Steuerpflichtige** die kantonale Vermögensdeklaration sowie das Wertschriftenverzeichnis. Die CRS-Logik, die wir hier beschreiben, ist überall dieselbe: Was sich ändert, ist das lokale Formular, das Sie ausfüllen müssen, um konform zu sein.

## Was der CRS ist und warum er existiert

Der **Common Reporting Standard** wurde im Juli 2014 vom OECD-Rat als Antwort auf das G20-Mandat nach der Finanzkrise und den großen Steuerhinterziehungsskandalen (LuxLeaks, Panama Papers) verabschiedet. Das Ziel ist klar: Die Steuerbehörden der teilnehmenden Länder tauschen automatisch Informationen über Finanzkonten von Nichtansässigen aus.

Technisch verallgemeinert der CRS das vorherige Modell (FATCA) auf mehr als hundert Jurisdiktionen, jedoch auf multilateraler statt bilateraler Basis. Spanien hat ihn durch das Real Decreto 1021/2015 und die Orden HAP/1695/2016 umgesetzt, die das **Modelo 289** regeln (jährliche Informationsmeldung über Finanzkonten von Nichtansässigen, die spanische Finanzinstitute an die AEAT übermitteln und die Spanien umgekehrt aus anderen teilnehmenden Ländern erhält).

In Lateinamerika wurde der CRS unter anderem in folgenden Ländern eingeführt: Mexiko (seit 2017), Argentinien, Kolumbien, Chile, Brasilien, Uruguay, Panama, Peru, Costa Rica, Ecuador und der Dominikanischen Republik. Wichtig: Die Vereinigten Staaten **sind dem CRS nicht beigetreten**. Sie betreiben ihr eigenes System (FATCA), das bilateral und nur ausgehend ist, nicht eingehend. Wir vertiefen das in unserem Artikel darüber, <a href="/de/blog/melden-us-bankkonten-an-ihre-heimische-steuerbehorde-die">ob US-Bankkonten an Ihre Steuerbehörde melden</a>, und um zu verstehen, warum die USA auch die neue Version nicht unterzeichnen werden, in <a href="/de/blog/crs-2-0-carf-warum-die-usa-niemals-unterzeichnen-llc">CRS 2.0 und CARF: Warum die USA niemals unterzeichnen werden</a>.

### Rechtsrahmen

- **OECD**: Common Reporting Standard, Juli 2014. Konsolidierter Text und offizielle Kommentare.
- **EU**: Richtlinie 2011/16/EU über die Zusammenarbeit der Verwaltungsbehörden (DAC), geändert durch die DAC2 (Richtlinie 2014/107/EU), die den CRS in Unionsrecht überführt.
- **Spanien**: Real Decreto 1021/2015, Orden HAP/1695/2016, Orden HAC/3625/2003 (Modelo 720), Orden HFP/886/2023 (Modelo 721 für im Ausland gehaltene Krypto-Werte).
- **Multilateral Competent Authority Agreement (MCAA)**: das OECD-Instrument, mit dem jedes Land den bilateralen Austausch mit jedem anderen aktiviert. Spanien hat den Austausch mit praktisch der gesamten EU und mit den meisten teilnehmenden Jurisdiktionen aktiviert.

## Welche Information genau gemeldet wird

Jedes **Reporting Financial Institution** (Bank, Broker, Fintech mit Banklizenz, Investmentfonds, Versicherungsgesellschaft mit Anlageprodukten), das einen Kontoinhaber feststellt, dessen Steueransässigkeit von dem Land abweicht, in dem das Konto geführt wird, muss melden:

| Kategorie | Detail |
| --- | --- |
| Daten des Inhabers | Name, Adresse, Land der Steueransässigkeit, NIF/TIN, Geburtsdatum und -ort (natürliche Personen) |
| Daten der Einheit | Name, NIF, Land. Bei Konten von **passiven NFEs** auch die Daten der **wirtschaftlich Berechtigten** (Controlling Persons) |
| Daten des Kontos | Kontonummer, Name und Identifikationsnummer des Finanzinstituts |
| Salden | Saldo oder Wert zum Ende des Kalenderjahres (oder bei Auflösung im Laufe des Jahres) |
| Erträge | Bruttozinsen, Bruttodividenden, sonstige erzielte Einkünfte, Bruttoerlöse aus Verkauf oder Rückzahlung von Finanzaktiva (Verwahrkonten) |

Dieser Datenfluss wird jährlich übermittelt, in der Regel zwischen Mai und September des dem Berichtsjahr folgenden Jahres, und wird mit den Erklärungen des Steuerpflichtigen abgeglichen (in Spanien: IRPF, Modelo 720 und nach der jüngsten Reform Modelo 721 für Krypto-Werte).

## Was mit Ihrer US-LLC passiert: Die Nuance, die fast niemand erklärt

Hier entstehen die Missverständnisse. Halten wir die Konzepte fest:

1. **Die USA senden keine Daten via CRS.** Weder Mercury noch Relay noch eine US-Regionalbank werden über CRS direkt Daten an die AEAT, das SAT, die DIAN oder die AFIP übermitteln. Was die USA betreiben, ist FATCA, das **unilateral und ausgehend** ist: Es fordert Daten von ausländischen Instituten über US-Person-Konten, sendet aber nicht automatisch entsprechende Daten in umgekehrter Richtung (in einigen Fällen über Modell-1-IGAs, jedoch in viel kleinerem Umfang als CRS).
2. **Ihre Konten bei europäischen Fintechs auf den Namen Ihrer LLC WERDEN gemeldet.** Wise (Belgien), Revolut (Litauen, Vereinigtes Königreich nach dem Brexit mit eigenem Regime), N26 (Deutschland) und Wallester (Estland) sind in ihren Jurisdiktionen CRS-pflichtige Finanzinstitute. Wenn die Inhaberin Ihre LLC ist und Sie der **wirtschaftlich Berechtigte** mit Steueransässigkeit in Deutschland, Spanien oder Lateinamerika sind, gelangen diese Daten zu Ihrer Steuerbehörde. Wir entwickeln das ausführlich in unseren Artikeln zu <a href="/de/blog/revolut-business-und-crs-was-ihrer-steuerbehorde-gemeldet">Revolut und CRS</a> sowie <a href="/de/blog/wise-business-und-crs-was-ihrer-steuerbehoerde-gemeldet-wird">Wise und CRS</a>.
3. **Ihre LLC ist wahrscheinlich eine Passive NFE**, sofern sie keine reale operative Tätigkeit nachweist (mehr als 50 % ihrer Erträge sind operativ und keine passiven Einkünfte wie Dividenden, Zinsen, Mieten oder Royalties ohne Zusammenhang mit einer Geschäftstätigkeit). Im typischen Fall eines Selbstständigen mit einer Single-Member-LLC, die Dienstleistungen abrechnet, gibt es Lehrstreit: Eine wörtliche CRS-Auslegung würde sie als Active NFE (operatives Geschäft) behandeln, doch die typische europäische Fintech klassifiziert sie aus Vorsicht als Passive NFE, was **die Meldung der Controlling Persons auslöst**. Diese Nuance entgeht fast jedem.

### Wie die Steueransässigkeit für CRS-Zwecke bestimmt wird

Das Finanzinstitut wendet eine **Due Diligence** (RD 1021/2015 und Anhang I des CRS) an, die auf der Selbstauskunft des Inhabers und auf objektiven Indizien basiert: Postanschrift, Telefonnummer, wiederkehrende IP, deklariertes NIF, wiederholte Überweisungsanweisungen auf Konten in einem anderen Land, Vollmachten zugunsten von Personen mit Wohnsitz in einem anderen Land.

Wenn Ihre Selbstauskunft „Steueransässigkeit in Andorra" angibt, Ihre IP, Lieferadresse der Karte und wiederkehrende Überweisungen jedoch nach Madrid weisen, kann das Institut **zusätzliche Unterlagen** anfordern (Steueransässigkeitsbescheinigung der zuständigen Behörde, Mietvertrag usw.) oder im Zweifel an beide Jurisdiktionen melden. Eine falsche CRS-Selbstauskunft ist in den meisten Jurisdiktionen eine Steuerordnungswidrigkeit und kann strafrechtliche Folgen haben, wenn relevante hinterzogene Beträge zusammentreffen.

## Reale Auswirkungen in Deutschland (Anlage AUS, §138 AO und Anlage KAP)

Wenn Sie steuerlich in Deutschland ansässig sind (§ 1 Abs. 1 EStG, Wohnsitz oder gewöhnlicher Aufenthalt im Inland) und Folgendes vorliegt:

- **Auslandskonten oder ausländische Kapitalanlagen** auf Ihren Namen, einschließlich der IBAN-Konten europäischer Fintechs (Wise, Revolut, N26, Wallester) sowie der USD-Konten Ihrer LLC bei Mercury, Relay oder Choice Financial Group, sofern Sie wirtschaftlich Berechtigter sind: Erklärung in der **Anlage KAP** (Kapitaleinkünfte) und in der **Anlage AUS** (ausländische Einkünfte) zur Einkommensteuererklärung. Es gibt keine Bagatellgrenze; Pflicht ab dem ersten Euro.
- **Beteiligung an einer ausländischen Personengesellschaft** (Single-Member-LLC ist nach deutscher Sicht in der Regel als Personengesellschaft zu qualifizieren, vgl. BMF-Schreiben vom 19.03.2004 und Rechtsprechung des BFH): **einheitliche und gesonderte Feststellung** der Einkünfte (§ 180 AO) und Anlage AUS, mit Anrechnung etwaiger US-Quellensteuer nach DBA Deutschland–USA.
- **Mitteilung von Auslandsbeziehungen nach §138 AO**: Pflicht zur Mitteilung der Gründung oder des Erwerbs einer Beteiligung an einer ausländischen Gesellschaft (auch transparente LLC) an das zuständige Finanzamt **innerhalb von 5 Monaten nach Ablauf des Kalenderjahres**, in dem das mitteilungspflichtige Ereignis eingetreten ist. Verstöße werden mit Bußgeld bis 25.000 € geahndet.
- **Anwendung der Hinzurechnungsbesteuerung (§§7–14 AStG)**: bei passiven Einkünften der LLC in einer Niedrigsteuerjurisdiktion zwingend anwendbar. Bei einer reinen Dienstleistungs-LLC mit operativer Substanz greift die Klausel typischerweise nicht; bei reinem Investment-Holding ja.

Das Bundeszentralamt für Steuern (BZSt) erhält die CRS-Datensätze und leitet sie an das jeweils zuständige Finanzamt weiter, das den Abgleich mit der Einkommensteuererklärung praktisch automatisch vornimmt. Eine **Selbstanzeige (§371 AO)** vor jeder Anfrage des Finanzamts schließt die strafrechtliche Verantwortung für Steuerhinterziehung aus, wenn die Voraussetzungen vollständig erfüllt sind und der hinterzogene Betrag nachträglich entrichtet wird.

### Auswirkungen in Österreich und in der Schweiz

- **Österreich**: Wenn Sie in Österreich ansässig sind, sind die Einkünfte der LLC in der **Beilage E1kv** (Kapitaleinkünfte) sowie in der entsprechenden Beilage zur Einkommensteuererklärung (Formular E1) zu erklären, mit den KZ-Codes für ausländische Einkünfte (KZ 754 für ausländische Kapitaleinkünfte mit Anrechnung). Das **Bundesministerium für Finanzen (BMF)** erhält die CRS-Daten über die OECD-Plattform und gleicht sie mit der ESt-Erklärung ab.
- **Schweiz**: Die kantonale Steuerverwaltung verlangt das **Wertschriftenverzeichnis** mit allen Bankkonten im In- und Ausland zum 31.12., bewertet zum Verkehrswert. Die Beteiligung an einer LLC ist im Wertschriftenverzeichnis als „Beteiligung an ausländischer Personengesellschaft" einzutragen. Die **Eidgenössische Steuerverwaltung (ESTV)** ist für den AIA mit über 100 Partnerstaaten zuständig; der Datenfluss läuft über das SIS-System der ESTV.

## Wie man richtig plant

Die technische Schlussfolgerung ist das Gegenteil dessen, was viele Influencer sagen: **Eine ordnungsgemäß strukturierte US-LLC mit ausschließlichem Banking bei Mercury oder Relay (USA) hat einen minimalen CRS-Fußabdruck**, weil die USA keine Daten via CRS exportieren. Sobald Sie aber eine europäische Schicht hinzufügen (Wise, Revolut, Wallester, N26), akzeptieren Sie, dass diese Information bei Ihrer Steuerbehörde ankommt. Es ist weder gut noch schlecht: Es ist einfach so, und planen erfordert, das zu wissen.

Der professionelle Ansatz besteht aus:

1. **Korrekt erklären.** Der Abgleich existiert bereits; verstecken zu wollen ist Zeitverschwendung und setzt Sie Sanktionen aus.
2. **Die Struktur so gestalten, dass das Erklärte steuerlich effizient ist.** Das bedeutet, das Wohnsitzland, die Anlageinstrumente, den Zeitplan der Überweisungen, die anwendbaren Abzüge und das anwendbare Doppelbesteuerungsabkommen zu entscheiden. Siehe unseren <a href="/de/blog/gestaltung-einer-soliden-internationalen-steuerstruktur">Rahmen zur Gestaltung einer soliden internationalen Struktur</a>.
3. **Dokumentation pflegen**: Verträge, Rechnungen, Belege, Buchhaltung der LLC, kohärente CRS-Selbstauskünfte. Ohne Dokumentation kehrt eine Prüfung de facto die Beweislast auf den Steuerpflichtigen um.
4. **Die Risiken einer schlechten Umsetzung kennen.** Wir behandeln sie in <a href="/de/blog/steuerrisiken-bei-mangelhafter-internationaler">steuerliche Risiken einer mangelhaften internationalen Strukturierung</a>.
5. **Die wirtschaftliche Tätigkeit verstehen.** Eine Dienstleistungs-LLC wird nicht wie eine E-Commerce- oder Royalty-LLC besteuert. Wir entwickeln das in <a href="/de/blog/llc-besteuerung-nach-wirtschaftlicher-aktivitat">LLC-Besteuerung nach wirtschaftlicher Aktivität</a>.

## Typische Fehler, die wir jede Woche in Deutschland und Österreich sehen

- „Da Mercury in den USA ist, erfährt das Finanzamt nichts." Stimmt für Mercury gegenüber CRS — die USA exportieren keine Daten via CRS — aber falsch für Ihre Wise-(Belgien), Revolut-(Litauen), Wallester-(Estland) oder N26-(Deutschland) Konten auf den Namen derselben LLC, die über das BZSt an Ihr Finanzamt fließen.
- „Ich habe meinen steuerlichen Wohnsitz in Dubai, Andorra oder auf Zypern angemeldet, lebe aber weiter in München oder Wien." Die Steueransässigkeit wird nicht gewählt; sie wird durch objektive Tatsachen nach **§ 8 und § 9 AO** bestimmt (Wohnsitz, gewöhnlicher Aufenthalt, Mittelpunkt der Lebensinteressen). In Österreich gilt entsprechend § 26 BAO. Wir entwickeln das in unserem Artikel zur <a href="/de/blog/digitaler-nomade-wo-steuern-zahlen-und-steuerlichen-wohnsitz">steuerlichen Ansässigkeit des digitalen Nomaden</a>.
- „Wenn meine LLC Rechnungen stellt, passiert mir nichts." Das Finanzamt kann die **Hinzurechnungsbesteuerung nach §§ 7–14 AStG** anwenden, wenn Ihre LLC passive Einkünfte (Zinsen, Dividenden, Lizenzen, bestimmte Veräußerungsgewinne) in einer Niedrigsteuerjurisdiktion erzielt und Sie sie kontrollieren. Obwohl die USA dafür keine Niedrigsteuerjurisdiktion sind, kann eine pass-through LLC durch die Disregarded-Entity-Mechanik die Klausel aktivieren. Die Planung muss diesen Fall vermeiden, nicht ignorieren.
- „Ich werde das Konto auf den Namen eines Verwandten setzen." Das ist der klassische verdeckte Strohmann, der in Deutschland als **Steuerhinterziehung (§ 370 AO)** gewertet wird, mit Freiheitsstrafe bis 5 Jahre (bis 10 Jahre in besonders schweren Fällen, § 370 Abs. 3 AO). Die straf- und steuerrechtlichen Folgen analysieren wir in <a href="/de/blog/strohmanneigentumer-fur-llcs-warum-es-illegal-ist-und-die">Strohmänner und Treuhänder in LLCs</a>.

## Zusammenfassung

CRS „umgeht" man nicht aus einer europäischen Jurisdiktion. Man plant ihn ein, mit Sachkenntnis. Eine US-LLC bleibt ein außerordentlich nützliches Werkzeug, aber die Gestaltung Ihres Banking-Stacks und Ihres steuerlichen Wohnsitzes sind entscheidend dafür, dass die informative Spur, die Sie erzeugen, mit dem übereinstimmt, was Sie erklären.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

Möchten Sie, dass wir prüfen, wie sich CRS in Ihrem konkreten Fall auswirkt, und den passenden Stack entwerfen? Reservieren Sie Ihre kostenlose Beratung und wir analysieren es gemeinsam mit Ihnen.
Wenn Ihnen zu den Nuancen dieser Struktur noch etwas unklar ist, erklärt <a href="/de/blog/warum-spanische-freelancer-die-selbststandigkeit-fur-eine-us">warum man die Selbstständigkeit in Spanien aufgibt (und welche Alternativen es gibt)</a> ausführlich einen angrenzenden Aspekt, den wir uns sonst für einen anderen Artikel aufheben.

### Verwandte Lektüren

- [Unternehmen in Panama: Besteuerung und Wohnsitz](/de/blog/panama-gesellschaft-steuern-und-residenz-2026)

### Nächste Schritte

Wenn Sie überprüfen möchten, ob diese Strategie zu Ihrer konkreten Situation passt, prüfen wir bei Exentax Ihren Fall persönlich und schlagen Ihnen die rechtlich saubere und effiziente Struktur vor, die wirklich zu Ihnen passt. Reservieren Sie eine erste Sitzung ohne Verpflichtung über unsere Kontaktseite.

<!-- exentax:banking-facts-v1 -->
## Banking- und Steuerfakten zur Klärung

Die Information zu Fintechs und CRS entwickelt sich weiter; hier der aktuelle Stand, so wie er heute ist:

### Notizen pro Anbieter

- **Mercury** arbeitet mit mehreren bundesweit lizenzierten Partnerbanken und **FDIC**-Abdeckung über Sweep Network: vor allem **Choice Financial Group** und **Evolve Bank & Trust**, ergänzt um **Column N.A.** in einigen Altfällen. Mercury ist selbst keine Bank; es ist eine Fintech-Plattform, die durch diese Partnerbanken gestützt wird. Wenn Mercury ein Konto schließt, wird der Saldo in der Regel **per Papier-Scheck an die hinterlegte Adresse des Inhabers** zurückgegeben, was für Nichtansässige ein ernsthaftes operatives Problem sein kann; halten Sie ein zweites Konto aktiv (Relay, Wise Business etc.) als Notfalloption.
- **Wise** vertreibt zwei klar unterschiedliche Produkte: **Wise Personal** (privates Konto) und **Wise Business** (Unternehmenskonto, einschließlich für Ihre LLC). Für eine LLC müssen Sie **Wise Business** eröffnen, nicht das private Konto. Wichtige CRS-Nuance: Eine **von einer US-LLC gehaltene Wise Business bleibt außerhalb des CRS**, weil die Inhaberin eine US-Einheit ist und die USA keine CRS-Jurisdiktion sind; die USD-Seite läuft über Wise US Inc. (FATCA-Perimeter, nicht CRS). Im Gegensatz dazu **löst eine Wise Personal, die eine in Spanien** oder einer anderen CRS-Jurisdiktion steueransässige Person eröffnet, **CRS-Reporting aus**, und zwar über Wise Europe SA (Belgien) auf diese Person. Wise für Ihre LLC zu eröffnen, bringt Sie nicht über die LLC ins CRS; wenn Sie zusätzlich eine Wise Personal auf Ihren Namen als CRS-ansässige Person halten, meldet dieses zweite Konto.
- **Wallester** (Estland) ist ein europäisches Finanzinstitut mit EMI-/Karten-Emissionsbanklizenz. Seine europäischen IBAN-Konten **fallen unter den Common Reporting Standard (CRS)** und lösen daher automatisches Reporting an die Steuerbehörde des Wohnsitzlandes des Inhabers aus.
- **Payoneer** operiert über europäische Einheiten (Payoneer Europe Ltd, Irland), die ebenfalls **im CRS-Perimeter** für Kunden mit Wohnsitz in teilnehmenden Jurisdiktionen liegen.
- **Revolut Business**: in Verbindung mit einer **US-LLC** läuft das übliche Setup über Revolut Payments USA; europäische IBANs (litauisch, BE) **werden einer LLC nicht standardmäßig ausgegeben**: Sie werden europäischen Kunden der europäischen Bank der Gruppe ausgegeben. Wenn Ihnen ein europäischer IBAN angeboten wird, prüfen Sie, mit welcher juristischen Einheit dieses Konto verknüpft ist und unter welchem Regime es meldet.
- **Null Steuern**: Keine LLC-Struktur erreicht „null Steuern", wenn Sie in einem Land mit Hinzurechnungsbesteuerung, steuerlicher Transparenz oder Einkünftezurechnung leben. Was Sie erreichen, ist **keine Doppelbesteuerung** und **korrekte Erklärung am Wohnsitz**, nicht die Abschaffung.

<!-- exentax:legal-refs-v1 -->
## Referenzen: Rechtsrahmen und Regulierung

Die Argumentation dieses Artikels stützt sich auf die folgende Regulierung und Doktrin, die derzeit in Kraft ist:

- **Spanien.** Gesetz 35/2006 über die Einkommensteuer (Art. 8, 9 und 91 zur Steueransässigkeit und Hinzurechnungsbesteuerung), Gesetz 27/2014 über die Körperschaftsteuer (Art. 100 zur CFC), Allgemeines Steuergesetz 58/2003, Gesetz 5/2022 zur Reform des Modelo 720 nach EuGH C-788/19 vom 27.01.2022, RD 1065/2007 (Modelos 232 und 720) und Orden HFP/887/2023 (Modelo 721 zu im Ausland gehaltenen Krypto-Werten).
- **Verwaltungsrechtliche Doktrin.** Entscheidungen des TEAC und verbindliche Konsultationen der DGT zu Single-Member-LLCs (unter anderem V0443-08, V1631-17, V1147-22), ausgelegt im Lichte der BOE-Mitteilung von Februar 2020 zur Klassifizierung ausländischer transparenter Einheiten.
- **Abkommen und internationale Regeln.** Doppelbesteuerungsabkommen Spanien–USA aus dem Jahr 1990 mit dem Protokoll von 2013, in Kraft seit 2019, Richtlinie 2011/16/EU geändert durch DAC6, DAC7 und DAC8, sowie OECD-Musterabkommen mit seinen Kommentaren.
- **USA.** Treas. Reg. §301.7701-3 (Check-the-Box-Klassifizierung), IRC §6038A und Treas. Reg. §1.6038A-2 (Form 5472), IRC §7701(a)(31) und FBAR-Regeln (31 CFR 1010.350).

Dieser Inhalt ist informierend und ersetzt keine personalisierte Beratung für Ihre konkrete steuerliche Situation.

<!-- exentax:execution-v2 -->
## Was CRS heute für in Deutschland, Österreich und der Schweiz Ansässige bedeutet

Der CRS läuft im Autopiloten: Mehr als 110 Jurisdiktionen tauschen jeden September Daten über die Salden zum 31. Dezember des Vorjahres aus. Wenn Sie steuerlich in Deutschland, Österreich oder der Schweiz ansässig sind, melden die Banken, bei denen Sie Auslandskonten halten, bereits an das BZSt, das BMF oder die ESTV. Das ist es, was wirklich wichtig ist, ohne Paranoia.

- **Was gemeldet wird.** Kontosalden zum 31. Dezember, jährliche Bruttoerträge (Zinsen, Dividenden), Name des Inhabers, gegenüber der Bank erklärte steuerliche Ansässigkeit und, bei transparenten Einheiten, Daten der Controlling Person. Die Information landet im Wohnsitzland und wird mit der Steuererklärung des Steuerpflichtigen abgeglichen.
- **Was nicht gemeldet wird.** Detaillierte Kontobewegungen, spezifische Gegenparteien, transaktionale Information. CRS sind Salden + Bruttoerträge + Identifikation; keine Nachverfolgung jeder einzelnen Operation. Die Wahrnehmung „die wissen alles" ist im Wortsinn übertrieben, in der Konsequenz aber zutreffend: Mit Salden und Bruttoerträgen wird die Vermutung gebildet, die ausreicht, um eine Aufforderung zu eröffnen.
- **Spanien, Modelo 720 und Modelo 721.** Der in Spanien Ansässige hat eine eigene Pflicht zur Meldung von Auslandskonten (über 50.000 € kombiniert, Modelo 720) und Krypto-Werten im Ausland (über 50.000 €, Modelo 721). Sie hängt nicht vom CRS ab, sondern von Ihrer Pflicht. Der CRS hilft der AEAT lediglich beim Abgleich und bei der Aufdeckung von Auslassungen.
- **Lateinamerika — unterschiedliche Rhythmen.** Mexiko (SAT) tauscht seit 2018 mit umfassender Abdeckung; Kolumbien (DIAN) seit 2017 mit fortschreitender Bereinigung; Chile (SII) seit 2018; Argentinien (AFIP) seit 2018, mit operativer Nutzung noch im Aufbau; Uruguay aktiv, aber mit Tax-Haven-Regime, das den Fluss in beide Richtungen nuanciert. Die Nutzungsintensität variiert, doch die Datenverfügbarkeit ist heute generalisiert.

### Was uns am häufigsten gefragt wird

**Wenn ich Mercury in meiner LLC habe, weiß es mein Land über CRS?** Nicht direkt: Die USA nehmen am CRS nicht teil. Was in den Fluss gelangt, sind die Wise-Konten (über Belgien) und, falls die LLC von einer europäischen oder asiatischen Bank aus operierte, auch diese. Mercury bleibt außerhalb des automatischen Flusses, nicht außerhalb jeder Meldepflicht.

**Wie regularisiere ich, wenn ich jahrelang nicht erklärt habe?** Mit einer ergänzenden 720- oder 721-Erklärung, bevor eine Aufforderung kommt. Das EuGH-Urteil C-788/19 hat die spanischen Geldbußen begrenzt; man kann heute deutlich günstiger regularisieren als vor 5 Jahren. Wir bewerten jeden Fall einzeln.

Bei Exentax kartieren wir, welche Ihrer Konten in den CRS fallen, welche Meldepflichten jedes davon auslöst, und gestalten den sauberen Einstieg oder die geordnete Regularisierung, wenn anwendbar.
<!-- /exentax:execution-v2 -->

## Sprechen wir über Ihre Struktur

Jeder Fall hat Nuancen: Ihr Wohnsitzland, die Art der Tätigkeit, wo Ihre Kunden sind, ob Sie investieren oder traden, ob Sie an Privatpersonen oder an Unternehmen verkaufen. Bei Exentax prüfen wir Ihre Situation, gestalten die LLC-Struktur, die zu Ihnen passt, und begleiten Sie jedes Jahr bei der Wartung. Reservieren Sie eine Beratung mit unserem Team und wir beginnen damit, Ihre realen Zahlen zu verstehen.

<!-- exentax:cross-refs-v1 -->
### Weitere verwandte Lektüren

- [Offshore-Strukturen: reale Vorteile und ehrliche Risiken](/de/blog/offshore-strukturen-vorteile-und-echte-risiken)
- [Von Single-Member zu Multi-Member-LLC: reale steuerliche Implikationen vor dem Schritt](/de/blog/von-single-member-zu-multi-member-llc-echte-steuerliche)
- [Exit Tax in Spanien: Wegzugsteuer für Krypto-, LLC- und Interactive-Brokers-Investoren](/de/blog/exit-tax-spanien-llc-krypto-interactive-brokers)
<!-- /exentax:cross-refs-v1 -->

Möchten Sie dieses Protokoll auf Ihren Fall anwenden? <a href="/de/buchen">Reservieren Sie eine Sitzung mit dem Exentax-Team</a> und wir prüfen Ihre LLC mit echten Zahlen in dreißig Minuten, unverbindlich.


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

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Brauchen Sie sofortige Beratung? Schreiben Sie uns über <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22crs%20fur%20ansassige%20in%20spanien%20und%20lateinamerika%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a> und wir antworten Ihnen heute noch.</p>

Wenn Sie es lieber direkt besprechen möchten, <a href="/de/buchen">reservieren Sie eine kostenlose Sitzung</a> und wir prüfen Ihren echten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

`;
