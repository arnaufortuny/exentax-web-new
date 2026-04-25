export default `

Wenn jemand „amerikanisches Unternehmen" sagt, denken die meisten an eine LLC; andere an eine „Corporation". Tatsächlich gibt es in den USA vier Hauptvehikel für unternehmerische Tätigkeit: **LLC**, **Corporation**, **S-Corporation** und **C-Corporation**. Jede hat ihr eigenes föderales und bundesstaatliches Steuerregime, eigene Eigentumsbeschränkungen und Anwendungsfälle. Für einen deutschsprachigen Unternehmer (Deutschland, Österreich, Schweiz) sind nicht alle zugänglich oder zweckmäßig. Diese Anleitung legt den realen Unterschied zwischen den vier Figuren fest, was zu jedem Profil passt und warum die LLC heute weiterhin die Standardwahl für Freiberufler, Agenturen und digitale Projekte ist, die keine institutionellen Investoren suchen.

## LLC: die flexible Standardoption für Nichtansässige

Die **LLC (Limited Liability Company)** ist eine Hybridform, die durch die einzelstaatlichen Gesetze der USA geschaffen wurde (jeder Staat hat seinen eigenen LLC Act; **Wyoming war 1977 der erste** mit dem Wyoming LLC Act). Rechtlich ist sie eine Gesellschaft mit beschränkter Haftung, die das Privatvermögen ihrer Mitglieder vor Schulden und Verbindlichkeiten des Geschäfts schützt. Steuerlich ist sie **standardmäßig transparent**: Die **Treas. Reg. §301.7701-3 („check-the-box")** behandelt die single-member LLC als **„disregarded entity"** und die multi-member LLC als **partnership**, sofern nicht durch das **Form 8832** etwas anderes gewählt wird (election to be classified as an association taxable as a corporation).

Für einen Nichtansässigen ohne **ETBUS** (Effectively Connected Trade or Business in the United States) und ohne **US-source FDAP income** **erzeugt die disregarded LLC keine substanzielle Form-1040-NR-Verpflichtung** und zahlt keine US-Bundeseinkommensteuer: Die Grundregel des **IRC §§871 und 882** unterwirft Nichtansässige nur (a) US-source FDAP mit Quellensteuer von 30 % (oder DBA-Satz) und (b) Einkommen, das effektiv mit einem US-trade or business verbunden ist. Ohne diese beiden Elemente zahlt die LLC **0 % föderal**. Auf Bundesstaatsebene haben **Wyoming, New Mexico, Florida, Texas, South Dakota, Nevada und Washington** keine bundesstaatliche Körperschaftsteuer, was **0 % bundesstaatlich** hinzufügt, wenn kein Nexus besteht.

Die praktische Pflicht, die bleibt: jährlich **Form 5472 + Form 1120 pro-forma** (Treas. Reg. §1.6038A-1, in Kraft seit 2017) für eine SMLLC im Besitz eines Nichtansässigen mit jeglicher *reportable transaction* mit ihrem einzigen Mitglied. Grundstrafe: **25.000 USD pro Formular und Jahr** (IRC §6038A(d)) plus **25.000 USD alle 30 zusätzlichen Tage** nach IRS-Mitteilung.

## Corporation: standardmäßig C-Corporation

Wenn jemand eine „Inc." oder „Corp." nach der *General Corporation Law* eines Staates gründet (zum Beispiel **Delaware General Corporation Law** oder **Nevada Revised Statutes Chapter 78**), wird sie standardmäßig steuerlich als **C-Corporation** behandelt: Sie zahlt Bundeseinkommensteuer auf ihre Gewinne in Höhe von **21 % (IRC §11(b), Einheitssatz eingeführt durch den Tax Cuts and Jobs Act 2017)** zuzüglich der entsprechenden bundesstaatlichen Steuer (Delaware besteuert 8,7 % auf im Staat erzieltes Einkommen, Kalifornien 8,84 %, Texas 0 % income tax aber franchise tax). Bei Dividendenausschüttung werden die Aktionäre **erneut** auf ihre persönliche Einkommensteuer besteuert: Für US persons qualifizierte Dividenden zu 0 % / 15 % / 20 % föderal (IRC §1(h)(11)); für ausländische Aktionäre FDAP-Quellensteuer von **30 %**, sofern nicht durch ein DBA reduziert (das **DBA Deutschland-USA von 1989, geändert durch Protokoll vom 01.06.2006, in Kraft seit 28.12.2007** reduziert die Quellensteuer auf Dividenden je nach Beteiligung auf **15 % oder 5 %**, und auf **0 %** zwischen Mutter- und Tochtergesellschaften unter bestimmten Bedingungen — Art. 10). Das ist die klassische Doppelbesteuerung.

Die C-Corp ist die **de-facto-Pflicht** für jeden, der Venture-Capital aufbringen oder an die Börse gehen will: Institutionelle Investoren (VC-Fonds, Family Offices, Plattformen wie AngelList, Y Combinator) verlangen fast immer eine **Delaware C-Corp**, weil sie deren Rechtsprechung kennen (Court of Chancery), sie kann mehrere Aktienklassen ausgeben (Vorzugsaktien mit liquidation preferences, Series A/B/C), sie ermöglicht Stock Options für Mitarbeiter (409A-Pläne) und sie ermöglicht Börsengänge. Keine Begrenzung der Aktionärszahl, keine Nationalitätsbeschränkungen.

## S-Corporation: die Option, die ein Nichtansässiger nicht nutzen kann

Die **S-Corporation** ist keine eigene Rechtsform: Sie ist eine **Bundessteuerwahl**, definiert im **Subchapter S des Internal Revenue Code (IRC §§1361-1378)**, die eine Corporation oder LLC über **Form 2553** beantragen kann. Sobald die S-Wahl gewährt ist, **zahlt die Entität keine Bundeskörperschaftsteuer**; Gewinne fließen an die Aktionäre und werden in deren persönlichen Erklärungen (Schedule K-1) deklariert. Anders als bei der LLC können Aktionäre ein **angemessenes Gehalt** (W-2) beziehen und den Rest als **Ausschüttungen erhalten, die nicht der self-employment tax unterliegen** (15,3 %), was die FICA-Last für US-Ansässige reduziert. Das ist der Hauptgrund, warum Amerikaner die S-Corp wählen.

Das Problem für Nichtansässige: **IRC §1361(b)** legt strikte Anforderungen fest. Maximal **100 Aktionäre**, alle müssen **natürliche Personen sein, die in den USA ansässig sind oder die US-Staatsbürgerschaft besitzen** (keine Ausländer, keine Gesellschaften, keine LLCs als Aktionäre), eine einzige Aktienklasse (mit der einzigen Ausnahme von Unterschieden in Stimmrechten). Aufgrund dieser Anforderungen ist eine **S-Corp für einen nichtansässigen Unternehmer völlig ungeeignet**. Wir erwähnen sie, damit Sie verstehen, dass „S-Corp" in nordamerikanischen Foren oder in Steuerplanungsbüchern von Robert Kiyosaki oder Mark Kohler fast nie auf Ihren Fall anwendbar ist.

## Wann eine C-Corp für einen Nichtansässigen Sinn ergibt

Eine C-Corp kann sich für einen Nichtansässigen in konkreten Szenarien lohnen:

- **Sie werden Venture-Capital aufnehmen**: Fonds verlangen Delaware C-Corp mit sauberer Cap-Table.
- **Sie planen einen Börsengang** oder eine Übernahme durch ein börsennotiertes Unternehmen (M&A erfordert typischerweise C-Corp).
- **Sie werden Mitarbeiter mit Stock Options** in den USA haben (ISO/NSO-Pläne erfordern Corporation).
- **Ihr Geschäft hat ETBUS** (Büro, Mitarbeiter, eigene Server, Lager) und würde daher unter IRC §882 ohnehin Bundessteuer zahlen: Der steuerliche Vorteil gegenüber einer LLC verschwindet und die C-Corp bringt solidere Governance.
- **Sie wollen das QSBS (Qualified Small Business Stock)** definiert in **IRC §1202** nutzen: Wenn Sie Aktien einer qualifizierten C-Corp (Vermögen ≤ 50 Mio. USD bei Ausgabe, operatives Geschäft, keine professionellen Dienstleistungen) für **5 Jahre** halten, können Sie bis zum **größeren Wert von 10 Mio. USD oder 10x Basis** an Kapitalgewinnen beim Verkauf ausschließen. Es ist einer der stärksten steuerlichen Anreize im US-System für Startup-Gründer.

Die Doppelbesteuerung wird durch Planung gemildert: Gehälter an den Gründer (für die Corp absetzbar, für die Person als ordinary income besteuert), Gewinnzurückbehaltung zur Reinvestition statt Dividendenausschüttung, deferred-compensation-Pläne und gute Nutzung des QSBS, wo es passt.

## Vergleichstabelle effektiver Besteuerung

Für einen Gewinn von **100.000 USD**, erzielt durch einen Nichtansässigen ohne ETBUS, ohne US-source income, steuerlich ansässig in Deutschland:

| Vehikel | US Bund | US Bundesstaat | Dividendenquellensteuer | Total US | Besteuerung Deutschland |
|---|---|---|---|---|---|
| **LLC disregarded** (WY/NM) | 0 USD | 0 USD | N/A | **0 USD** | Einkünfte aus Gewerbebetrieb (§ 15 EStG) oder selbständiger Arbeit (§ 18 EStG), Einkommensteuer + Soli + ggf. Gewerbesteuer |
| **C-Corp Delaware** ohne Ausschüttung | 21.000 USD | 0 USD wenn kein DE-Nexus | 0 USD | **21.000 USD** | Keine sofortige Besteuerung wenn nicht ausgeschüttet (vorbehaltlich Hinzurechnungsbesteuerung §§ 7-14 AStG bei niedrig besteuerten Zwischengesellschaften mit passiven Einkünften) |
| **C-Corp Delaware** mit voller Ausschüttung | 21.000 USD | 0 USD | 11.850 USD (15 % DBA DE-USA) | **32.850 USD** | Abgeltungsteuer 25 % + Soli 5,5 % auf Bruttodividende, Anrechnung der US-Quellensteuer |
| **S-Corp** | Nicht verfügbar für Nichtansässige (IRC §1361(b)) |

Der Unterschied ist enorm: Für operative Profile ohne Ambitionen auf institutionelles Kapital ist **die LLC eindeutig effizienter**. Die C-Corp gewinnt nur, wenn der strategische Plan Venture-Capital, Börsengang oder QSBS-Nutzung erfordert.

## US-LLC vs deutsche Alternativen: Wann passt was?

Wenn Sie in Deutschland ansässig sind, sind Ihre lokalen Hauptoptionen:

- **Einzelunternehmen / Freiberuf**: Anmeldung beim Gewerbeamt (Gewerbe) oder Finanzamt (Freiberuf nach § 18 EStG), keine separate Rechtspersönlichkeit, unbeschränkte persönliche Haftung. Steuern: Einkommensteuer (Grundtarif 0-45 %, mit **Reichensteuer 45 % ab 277.826 € (2024)**), **Solidaritätszuschlag 5,5 %** (für Steuerpflichtige ab Schwelle), Gewerbesteuer (für Gewerbe; Hebesatz je Gemeinde 200-580 %, durchschnittlich ~400 %, nicht für Freiberufler). Umsatzsteuer Regelsatz 19 %, ermäßigt 7 %. **Kleinunternehmerregelung § 19 UStG**: Schwelle ab 2025 erhöht auf **25.000 € Vorjahr und 100.000 € laufendes Jahr** (zuvor 22.000 € / 50.000 €).
- **UG (haftungsbeschränkt)**: „Mini-GmbH" mit Mindeststammkapital ab **1 €** (§ 5a GmbHG), 25 % des Jahresgewinns müssen als gesetzliche Rücklage gebildet werden, bis 25.000 € erreicht sind und Umwandlung in GmbH möglich wird. Körperschaftsteuer 15 % + Soli + Gewerbesteuer (gesamt ca. 30-33 %).
- **GmbH (Gesellschaft mit beschränkter Haftung)**: Klassische deutsche Kapitalgesellschaft, Mindeststammkapital **25.000 €** (§ 5 GmbHG, mindestens die Hälfte zur Gründung einzuzahlen). Körperschaftsteuer 15 % + Soli 5,5 % + Gewerbesteuer (gesamt ca. **30-33 %** je nach Gemeinde). Bei Ausschüttung: Abgeltungsteuer 25 % + Soli auf Dividenden beim Gesellschafter.
- **AG (Aktiengesellschaft)**: Für größere Unternehmen, Mindestkapital 50.000 €.

Eine US-LLC, die von einem deutschen Steuerinländer gehalten wird, wird vom **deutschen Bundesfinanzministerium (BMF)** in der Regel nach dem **Typenvergleich (BMF-Schreiben vom 19.03.2004 und Folge-Schreiben)** klassifiziert. Eine SMLLC mit Disregarded-Entity-Status wird in den meisten Fällen als **transparent (Personengesellschaft oder Einzelunternehmen)** behandelt, sodass die Gewinne direkt beim Gesellschafter in Deutschland besteuert werden — typischerweise als Einkünfte aus Gewerbebetrieb. Das **DBA Deutschland-USA (1989, Protokoll 2006)** muss zur Vermeidung der Doppelbesteuerung herangezogen werden. **Eine US-LLC ist für einen deutschen Steuerinländer nur in spezifischen Konstellationen vorteilhaft**: hohes internationales Kundenvolumen, USD-/internationaler Banking-Bedarf, klare Trennung von Privatvermögen. Für die meisten Fälle bieten UG oder GmbH einen klareren und anerkannteren Rahmen.

## Was wählen je nach Profil

- **Freiberufler, Digitalagentur, Berater, Infoprodukt-Ersteller, kleines E-Commerce, bootstrapped SaaS**: **LLC** ohne Zweifel, wenn Sie überwiegend international fakturieren. Wyoming oder New Mexico für Kosten; Delaware bei großem Wachstumsplan.
- **Startup mit Seed- oder Series-A-Runde geplant**: **Delaware C-Corp** ab Tag eins, Doppelbesteuerung als Kosten des Kapitalzugangs akzeptierend. Direkte C-Corp-Gründung vermeidet die Konversion LLC→C-Corp, die ein steuerpflichtiges Ereignis ist.
- **Physisches Geschäft in den USA mit Mitarbeitern und lokalem Betrieb**: wahrscheinlich C-Corp bei großem Wachstum; LLC bei kleinem Geschäft.
- **Reglementierter Beruf (Anwalt, Arzt, Architekt mit Kammerzulassung)**: viele Staaten verlangen **Professional LLC (PLLC)** oder **Professional Corporation (PC)** mit staatlicher Lizenz.

Wenn Sie bereits eine LLC haben und sie in eine C-Corp konvertieren müssen, ist dies möglich über **statutory conversion** (DE, NV, WY) oder über **check-the-box election (Form 8832)**. Unter **IRC §351** kann die Inkorporation steuerfrei sein, wenn Bedingungen erfüllt sind (80 % Kontrolle nach Inkorporation, ausschließlich Vermögen gegen Aktien), aber jede Abweichung löst sofortige steuerpflichtige Ereignisse aus.

## Anwendbarer Rechtsrahmen

- **Internal Revenue Code (Title 26 USC)**: §11(b) C-Corp 21 %; §§1361-1378 S-Corp-Regime; §1202 QSBS; §§871, 881, 882, 1441 Besteuerung von Nichtansässigen; §6038A Form 5472; §351 steuerfreie Inkorporationen.
- **Treasury Regulations**: §301.7701-3 check-the-box; §1.6038A-1/2 Form 5472 disregarded entities.
- **IRS Publications**: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/business-structures">Business Structures</a>; Pub. 519 (US Tax Guide for Aliens); Pub. 542 (Corporations).
- **US-Bundesstaatsrahmen**: Delaware General Corporation Law; Wyoming Business Corporation Act; New Mexico Limited Liability Company Act.
- **Deutscher Rahmen**: Einkommensteuergesetz (EStG) §§ 15, 18; Körperschaftsteuergesetz (KStG); Außensteuergesetz (AStG) §§ 7-14 (Hinzurechnungsbesteuerung); GmbHG; AktG; <a href="https://www.bundesfinanzministerium.de">BMF-Schreiben</a> vom 19.03.2004 zur Klassifizierung ausländischer Gesellschaften (Typenvergleich); DBA Deutschland-USA (1989, Protokoll 2006).

Für Nichtansässige bleibt die LLC die häufigste Option, da sie Vermögensschutz, saubere Besteuerung (0 % föderal ohne ETBUS) und niedrige Verwaltungslast kombiniert. Die C-Corp ist denjenigen vorbehalten, die institutionelles Kapital oder einen Börsengang suchen.

## Häufige Fehler bei der Vehikelwahl

- **Glauben, die S-Corp sei „eine bessere LLC"**: Sie ist es nicht. Sie ist eine Bundessteuerwahl, die ausschließlich US persons vorbehalten ist. Wenn Sie nichtansässig sind, ziehen Sie sie nicht einmal in Betracht.
- **Eine C-Corp gründen „weil es seriöser klingt"** ohne realen Kapitalbedarf: Sie zahlen 21 % föderal unnötig.
- **LLC ohne Beratung in C-Corp umwandeln**: Wenn IRC §351 nicht erfüllt ist, sofortige Auslösung steuerpflichtiger Ereignisse.
- **Delaware wählen „weil es bekannt ist"**, wenn WY/NM fünfmal weniger an jährlichen Kosten verursachen und denselben Steuerschutz für einen nichtansässigen Freiberufler bieten.

Die richtige Wahl hängt von Ihrem 3-5-Jahres-Plan ab, nicht vom Forum-Trend des Tages.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/leistungen">Finden Sie heraus, ob eine LLC zu Ihnen passt</a>
<!-- /exentax:calc-cta-v1 -->

Bei Exentax prüfen wir Ihren Fall mit echten Zahlen und sagen Ihnen, ob LLC, C-Corp oder gar keine US-Struktur Sinn ergibt. <a href="/de/buchen">Buchen Sie eine kostenlose Beratung</a> von 30 Minuten und gehen Sie mit einem klaren Plan heraus.

<!-- exentax:execution-v2 -->
## Wie wir das mit der Exentax-Methode lösen

Was wir jede Woche sehen, ist dasselbe Muster: Der Zweifel bleibt als verstreute Ideen, die Entscheidung wird aufgeschoben und beim Geschäftsjahresabschluss zahlen Sie mehr Steuern als nötig oder gehen Risiken ein, die sich nicht lohnen. Das Problem ist fast nie die Norm; es ist das Fehlen eines schriftlichen Plans mit echten Zahlen, unterzeichnet von jemandem, der Ihren Fall von Anfang bis Ende versteht.

**Was die Leute falsch machen**
- Strukturen aus sozialen Medien kopieren, ohne den eigenen Fall mit Einnahmen, Wohnsitz und Kunden zu modellieren.
- Privates und geschäftliches Geld vermischen und die dokumentarische Spur verlieren, die jede Prüfung verlangt.
- Den Betrieb Buchhaltern anvertrauen, die nur Formulare ausfüllen, ohne Jahresstrategie oder Gesamtkostenblick.

**Was wirklich funktioniert**
- Ihre Situation im <strong>Exentax-Rechner</strong> modellieren, bevor Sie ein einziges Stück bewegen, um die jährlichen Gesamtkosten zu sehen, nicht nur die heutige Rechnung.
- Geldflüsse vom ersten Tag an trennen, mit getrennten Konten und einer lebenden Belegcheckliste.
- Mit einem Berater arbeiten, der die Teile zusammen betrachtet: Struktur, Banking, Compliance und Wohnsitz — nicht jedes für sich.

Wenn Sie vom Zweifel zum Plan kommen wollen, buchen Sie 30 Minuten mit Exentax und wir verlassen das Gespräch mit den Zahlen geschlossen und dem Betriebskalender festgelegt.
<!-- /exentax:execution-v2 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Müssen Sie es jetzt besprechen? Schreiben Sie uns über <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20komme%20aus%20dem%20Artikel%20%22Unterschied%20zwischen%20LLC%2C%20Corporation%2C%20S-Corp%20und%20C-Corp%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20sprechen.">WhatsApp</a> und wir antworten heute noch.</p>

Wenn Ihr Plan ist, die LLC in Delaware aufzubauen, sehen Sie sich unsere Servicebeschreibung <a href="/de/services/llc-delaware">LLC in Delaware</a> mit Kosten, Fristen und konkreten nächsten Schritten an.
<!-- /exentax:cta-conv-v1 -->

<!-- exentax:cta-v1 -->
Wir vergleichen New Mexico, Wyoming, Delaware und Florida anhand Ihres konkreten Falls — ohne den gerade angesagten Bundesstaat zu pushen. <a href="/de/leistungen/llc-delaware">Meinen Fall mit einem Berater vergleichen</a>.
<!-- /exentax:cta-v1 -->
`;
