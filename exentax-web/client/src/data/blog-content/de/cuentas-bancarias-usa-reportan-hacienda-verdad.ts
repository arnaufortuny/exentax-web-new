export default `Es ist die Frage, die uns am häufigsten gestellt wird, sobald ein Kunde seine LLC bei uns abschließt: „Erfahren Mercury, Wise oder Slash, was ich auf meinen Konten habe, und melden sie das an meine heimische Steuerbehörde?". Die kurze, klare Antwort gibt selten jemand. Hier ist sie: **Ein Finanzkonto, das in den USA von einer LLC eines Nicht-Residenten geführt wird, wird nicht automatisch mit Ihrer heimischen Steuerbehörde ausgetauscht**. Und genau dieser Punkt, richtig verstanden, ist eine der Säulen, die eine sauber konzipierte LLC-Struktur mit der operativen Diskretion arbeiten lassen, die man von ihr erwartet.

Das heißt nicht „verstecken". Es heißt, dass Ihre Struktur in einer Jurisdiktion aufgesetzt ist, die nach ihren eigenen Regeln funktioniert, und dass Ihre Compliance die ist, die Sie in Ihrem Wohnsitzland bewusst erfüllen, ohne externe Überraschungen.

## Was die Leute glauben, was passiert (und tatsächlich nicht passiert)

> „Wenn Mercury amerikanisch ist und ich europäisch, landen meine Salden über irgendein automatisches Abkommen beim heimischen Finanzamt."

Falsch. Wir erklären Ihnen den realen Rahmen, nicht den der Angst.
## Wie der internationale Informationsaustausch tatsächlich funktioniert (die Fakten)

Es gibt zwei globale Systeme, die ständig verwechselt werden. Es lohnt sich, sie sauber zu trennen.

### CRS (Common Reporting Standard)

Das ist der <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>-Standard. Mehr als 100 Länder wenden ihn an. Ihre Banken identifizieren Konten von Nicht-Residenten und melden Salden und Erträge an die Steuerbehörden des Wohnsitzlandes des Kontoinhabers.

**Die USA nehmen am CRS nicht teil. Sie sind nicht Unterzeichner. Sie melden nichts via CRS. Sie empfangen nichts via CRS.**

Jedes zu 100 % US-amerikanische Finanzinstitut, das ein Konto für eine US-LLC eröffnet, bleibt außerhalb des CRS-Kreislaufs. Es gibt keinen automatischen Datenfluss in Ihr Heimatland.

### FATCA

Das ist das US-Gesetz. Es funktioniert nur in eine Richtung: Es verpflichtet ausländische Banken (in Europa, Asien, Lateinamerika), dem <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> Konten von **US persons** (US-Bürger und US-steuerlich Ansässige) zu melden.

FATCA **exportiert keine US-Kontodaten automatisch an die heimische Steuerbehörde eines europäischen oder lateinamerikanischen Residenten**. Es ist ein Meldesystem in Richtung USA, nicht von den USA aus. Einige Länder haben theoretisch reziproke IGAs unterzeichnet, doch in der Praxis ist der Datenfluss vom IRS an ausländische Steuerbehörden auf Konto-für-Konto-Basis natürlicher Personen, die keine US persons sind, für das typische Profil eines LLC-Inhabers schlicht nicht existent.
### Mercury, Slash und Relay: US-Institutionen, außerhalb des CRS

Alle drei sind Fintechs mit Sitz in den USA und US-Banken als Custodian:

- **Mercury** arbeitet mit Choice Financial Group, Column NA und Evolve Bank & Trust als Partnerbanken.
- **Slash** funktioniert als US-Geschäftskonto mit einem Treasury-Produkt auf Basis von US-Staatsanleihen und attraktiver Verzinsung.
- **Relay** arbeitet mit Thread Bank als Custodian.

Alle drei sind US-amerikanische Finanzinstitute. **Alle drei stehen außerhalb des CRS**, weil die USA nicht teilnehmen. Sie erfüllen ihre Meldepflichten gegenüber dem IRS (Formulare 1099, wo anwendbar, etc.), übermitteln aber keine automatischen Informationen an das Bundeszentralamt für Steuern, an die AEAT, an den SAT, an den chilenischen SII oder an die argentinische DGI.

Was das in der Praxis bedeutet: **Der Saldo Ihrer LLC bei Mercury wird nicht automatisch mit Ihrer Einkommensteuererklärung abgeglichen**. Die Nachvollziehbarkeit existiert, aber sie bleibt innerhalb des US-Systems.
### Wise: der wichtige Unterschied

Wise arbeitet mit verschiedenen Gesellschaften in unterschiedlichen Jurisdiktionen. Das ist es, was das Reporting verändert:

- **Wise US Inc.** (US-Konto für US-LLCs, IBAN/ACH/Wire in USD): ist eine US-Gesellschaft. **Außerhalb des CRS.** Genau wie Mercury.
- **Wise Europe SA** (europäisches Multi-Währungs-Konto mit belgischer IBAN): ist eine EU-Gesellschaft. Diese fällt in den CRS-Kreislauf und meldet Salden an das Wohnsitzland des Kontoinhabers.

Für eine heute eröffnete LLC mit Wise Business und operativer Anbindung an die USA läuft das Hauptkonto über Wise US Inc. Das stellt dieses Konto außerhalb des CRS. Wenn Sie zusätzlich das europäische Multi-Währungs-Modul nutzen, gibt es dort tatsächlich CRS-Reporting auf diesen Teil.

**Klare Schlussfolgerung: Wise US Inc. meldet nicht via CRS. Wise Europe SA schon.** Wer das weiß, kann seine Operativa mit Augenmaß strukturieren.
### Wallester: ein anderer Fall, sagen wir es klar

Wallester ist ein europäischer Kartenherausgeber (Estland/EU). Es liegt im europäischen CRS-Rahmen. Wenn Sie Wallester-Karten ausstellen, die mit einem Betriebskonto verknüpft sind, hängt das Reporting des zugrundeliegenden Kontos davon ab, wo dieses Konto liegt. Wenn Sie Wallester an ein US-Konto (Mercury, Wise US, Relay) anbinden, bleibt das Konto außerhalb des CRS; binden Sie es an ein europäisches EMI-Konto an, kommt es in den CRS-Kreislauf.

Ein starkes operatives Werkzeug, aber man muss es so designen, dass man weiß, welche Gesellschaft welches Stück ausstellt.
### Zahlungsanbieter: Stripe, PayPal, Whop, Hotmart, Adyen

Zahlungsanbieter sind keine Bankkonten. Es sind Transaktionsabwickler, die auf das Bankkonto auszahlen, das Sie ihnen angeben. **Sie fallen nicht unter den CRS** und melden keine Salden. Sie melden Geldflüsse an die Finanzverwaltung ihrer Jurisdiktion, wo die Vorschrift es verlangt (z. B. 1099-K in den USA für Stripe US), aber die Mittel liegen auf Ihrem Bankkonto, nicht beim Zahlungsanbieter.

Eine LLC, die über Stripe US einnimmt und auf Mercury auszahlt, durchläuft ihren gesamten Zyklus innerhalb des US-Finanzsystems. Sauber, effizient, ohne automatisches CRS-Reporting in Ihr Heimatland.
### Zugang zu Informationen über eine US-LLC: wie es wirklich aussieht

Eine sauber gegründete LLC in Wyoming, New Mexico oder Delaware genießt **registerliche Anonymität**:

- Der Eigentümer erscheint nicht in öffentlichen Registern.
- Der **Registered Agent** ist als rechtlicher Kontaktpunkt eingetragen.
- Der **BOI Report** (<a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>) identifiziert den Beneficial Owner gegenüber der Bundesbehörde, **nicht gegenüber der Öffentlichkeit** und nicht automatisch gegenüber ausländischen Steuerbehörden.

Damit eine ausländische Behörde erfährt, wer hinter einer LLC steht, braucht es einen formellen Antrag über bilaterale Kanäle (Amtshilfe, gerichtliches Ersuchen). Das ist nicht automatisch, nicht trivial und passiert nicht aus Neugier. Genau das schützt in der Praxis die Operativa eines Exentax-Kunden, dessen LLC sauber strukturiert ist.
### DAC7 und DAC8: EU-Richtlinien, gelten nicht für die USA

DAC7 (digitale Plattformen) und DAC8 (Krypto) sind Richtlinien der Europäischen Union. Sie verpflichten Plattformen und Exchanges mit europäischer Präsenz, nicht eine US-LLC oder ihre US-Konten. Ihre LLC fällt nicht unter DAC7 oder DAC8, nur weil sie existiert oder mit internationalen Kunden arbeitet.

Als europäisch Steueransässiger haben Sie Ihre eigenen Meldepflichten (in Spanien Modelo 720/721, in Portugal, Frankreich, Deutschland gibt es jeweils Äquivalente), und das verwalten Sie in Ihrem Tempo mit Ihrem lokalen Berater. Die LLC fügt hier nichts hinzu und nimmt nichts weg: Sie listen den Vermögenswert, wenn er die Schwelle übersteigt, melden ihn und arbeiten weiter.
## Was wir jede Woche bei Exentax sehen

Drei reale Muster:

**1. Der Kunde, der mit Angst kommt**: Er hat jahrelang auf YouTube gehört, „die kriegen dich", und beginnt das Gespräch mit vorauseilender Entschuldigung. Wir zeigen ihm, wie das System wirklich aussieht: US-Konto außerhalb des CRS, FATCA bilateral aber ohne Konto-für-Konto-Datenfluss in sein Heimatland, echte registerliche Anonymität. Er geht mit dem Verständnis nach Hause, dass die Struktur völlig solide ist.

**2. Der Kunde, der bereits jeden Monat auf sein persönliches Konto in Spanien auszahlt**: Hier gibt es einen operativen Punkt zu korrigieren. Nicht, weil die LLC meldet (sie tut es nicht), sondern weil eingehende Überweisungen auf seinem spanischen Konto sehr wohl in das spanische CRS-System fallen. Was wir konzipieren, ist ein saubererer Fluss: Firmenkarte für Ausgaben, geplante und dokumentierte Ausschüttungen, kein wahlloses Tröpfeln auf das Lokalkonto.

**3. Der Kunde, der ein europäisches Wise Multi-Währungs-Konto + Mercury hat**: Wir erklären ihm, welche Gesellschaft was meldet. In der Regel reorganisieren wir, sodass die Hauptoperativa auf Wise US oder Mercury liegt und das europäische Modul nur für punktuelle Fälle benutzt wird.
### So macht man es richtig

Eine Exentax-Finanzstruktur sieht typischerweise so aus:

- **Hauptkonto der LLC** bei Mercury oder Wise US Inc. → außerhalb des CRS, ACH und Wire in USD, Buchhaltungsintegrationen.
- **Treasury mit Verzinsung** bei Slash → US-Staatsanleihen, ungenutztes Kapital produktiv anlegen, alles innerhalb des US-Perimeters.
- **Firmenkarten** Wallester → granulare Kontrolle der operativen Ausgaben.
- **Zahlungsanbieter** Stripe US, PayPal Business, Whop, Hotmart je nach Produkt → Auszahlung auf Mercury, geschlossener Zyklus in den USA.
- **Broker** je nach Ziel: Interactive Brokers (Aktien/ETFs/Optionen, eröffnet Konten für LLCs von Nicht-Residenten mit W-8BEN-E), Tradovate (Futures), Kraken (Krypto, arbeitet mit LLCs).
- **Lokales persönliches Konto separat** ausschließlich für den finalen privaten Konsum, gespeist durch geplante Ausschüttungen, nicht durch einen ständigen Strom.

Mit diesem Design ist die steuerliche Operativa kohärent: Die LLC lebt in den USA, bewegt sich innerhalb der USA, und Sie entscheiden mit der richtigen Dokumentation, wann und wie Sie in Ihr Privatleben ausschütten.
### Warum Exentax

Weil wir das vom ersten Tag an als System konzipieren und nicht als Flickenteppich. Das US-Konto, die Treasury, die Karte, der Zahlungsanbieter, der Broker und der Geldfluss zu Ihrem Privatkonto sind als zusammenhängendes System gedacht, nicht als lose Bausteine, die später nicht zueinander passen. Wenn alles sauber strukturiert ist:

- Es gibt keine Reporting-Überraschungen, weil Sie genau wissen, welche Gesellschaft was meldet.
- Die Nachvollziehbarkeit ist sauber, das schützt Sie bei jeder behördlichen Anfrage.
- Ihre echte Vermögenstrennung funktioniert: Die LLC ist die LLC, Ihr Privatleben ist Ihr Privatleben.
- Die US-Compliance (Form 5472, BOI, Pflege des Agents) übernehmen wir.

---
## Rechtliche und regulatorische Quellen

Dieser Artikel stützt sich auf Vorschriften, die zum Stichtag aktuell in Kraft sind. Hauptquellen zur Verifikation:

- **USA.** Treas. Reg. §301.7701-3 (Entity Classification / *check-the-box*); IRC §882 (Steuer auf mit US-Geschäft effektiv verbundene Einkünfte Ausländer); IRC §871 (FDAP und Quellensteuer bei Nicht-Residenten); IRC §6038A und Treas. Reg. §1.6038A-2 (Form 5472 für *25% foreign-owned* und *foreign-owned disregarded entities*); IRC §7701(b) (Steuerwohnsitz, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report bei FinCEN).
- **Spanien.** Gesetz 35/2006 (LIRPF), Artt. 8, 9 (Wohnsitz), 87 (Einkünftezurechnung), 91 (Hinzurechnungsbesteuerung natürliche Personen); Gesetz 27/2014 (LIS), Art. 100 (Hinzurechnungsbesteuerung Gesellschaften); Gesetz 58/2003 (LGT), Artt. 15 und 16; Gesetz 5/2022 (Sanktionsregime Modelo 720 nach EuGH C-788/19 vom 27.01.2022); RD 1065/2007 (Modelos 232 und 720); Anordnung HFP/887/2023 (Modelo 721 Krypto).
- **DBA Spanien–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> vom 22.12.1990 (DBA); Protokoll in Kraft seit 27.11.2019 (passive Einkünfte, *limitation on benefits*).
- **EU / OECD.** Richtlinie (EU) 2011/16, geändert durch DAC6 (grenzüberschreitende Gestaltungen), DAC7 (Richtlinie (EU) 2021/514, digitale Plattformen) und DAC8 (Richtlinie (EU) 2023/2226, Kryptowerte); Richtlinie (EU) 2016/1164 (ATAD: CFC, Exit Tax, hybride Gestaltungen); OECD Common Reporting Standard (CRS).
- **Internationaler Rahmen.** OECD-Musterabkommen, Art. 5 (Betriebsstätte) und Kommentare; BEPS-Aktion 5 (wirtschaftliche Substanz); FATF-Empfehlung 24 (wirtschaftlicher Eigentümer).

<!-- exentax:calc-cta-v1 -->
> **Rechnen Sie Ihren Fall durch.** Der <a href="/de#calculadora">Exentax-Steuerrechner</a> vergleicht Ihre aktuelle Steuerlast mit dem, was Sie zahlen würden, wenn Sie eine US-LLC korrekt in Ihrem Wohnsitzland deklarieren.
<!-- /exentax:calc-cta-v1 -->

Die konkrete Anwendung dieser Regeln auf deinen Fall hängt von deinem Steuerwohnsitz, der Tätigkeit der LLC und der von dir geführten Dokumentation ab. Dieser Inhalt ist informativ und ersetzt keine personalisierte professionelle Beratung.

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
## Wir richten es ein, ohne dass Sie ein Wochenende verlieren

Tausende von Freelancern und Unternehmern betreiben ihre US-LLC bereits vollständig legal und dokumentiert. Bei Exentax kümmern wir uns um den gesamten Prozess: Gründung, Banking, Zahlungsabwicklung, Buchhaltung, IRS-Erklärungen und Compliance in Ihrem Wohnsitzland. Buchen Sie eine kostenlose Beratung, und wir sagen Ihnen ehrlich, ob die LLC für Ihren Fall sinnvoll ist, ohne absolute Versprechen.<!-- exentax:execution-v2 -->
## Was die US-Konten Ihrer LLC melden und nicht melden

Die reale Diskretion US-amerikanischer Konten ist weder Mythos noch absolutes Versprechen: Sie ist eine dokumentierte Asymmetrie des internationalen Finanzsystems, mit konkreten Grenzen und einem Bedienungsanleitung, wenn Sie sie richtig nutzen wollen. Das sind die Fakten, ohne Theorien.

- **Die USA nehmen nicht am CRS teil.** Einziges G20-Land, das den Common Reporting Standard nicht unterzeichnete. Praktische Folge: Mercury, Relay, Choice Financial, Evolve und Column N.A. haben keine Pflicht, Salden automatisch an das Wohnsitzland des Inhabers zu senden. Kein Trick, die Systemarchitektur seit 2014.
- **Reverse-FATCA ist partiell.** Das Model-1-IGA mit Spanien (seit 2013 in Kraft) verlangt, dass die USA der AEAT Infos zu Konten spanischer Residenten in US-Banken senden, aber realer Umfang: Konten direkter Inhaberschaft von ansässigen Privatpersonen mit zinserzeugenden Einlagen. Entity-Konten (LLC) bei Banken wie Mercury fallen nicht mit gleicher Intensität in diesen automatischen Fluss.
- **Was die AEAT anfordern kann.** Über MAP des DBA USA-Spanien kann die AEAT spezifische Infos zu einem konkreten Konto bei berechtigtem Anlass anfordern. Prozess 12-24 Monate, begründet, für relevante Beträge eingesetzt. Nicht automatisch, nicht massiv.
- **Der Fehler, der die Asymmetrie bricht.** Überweisungen vom US-LLC-Konto direkt auf Ihr privates spanisches Konto hinterlassen eine Herkunftsspur, die Ihre spanische Bank sieht und die AEAT meldet. Die Diskretion des US-Kontos bleibt erhalten, wenn der Fluss über Wise Multi-Currency mit kohärenter Motivation (Member Draw, Gehalt, Dividende nach Qualifikation) eingeht, nicht als Bruttoüberweisung ohne Kontext.

### Was wir am häufigsten gefragt werden

**Kann ich also mein US-Konto nicht erklären?** Nein: Sie haben eigene Erklärungspflicht (Modelo 720 bei kombiniertem Saldo >50.000 €). Die CRS-Asymmetrie befreit nicht; sie beseitigt den automatischen Abgleich, der Versäumnisse in CRS-Jurisdiktionen aufdeckt. Ihre Erklärungspflicht bleibt unverändert.

**Wie lange hält diese Asymmetrie?** Kein Signal für kurzfristige US-Unterzeichnung (5 Jahre). Es gibt Signale für progressive Verstärkung des Reverse-FATCA. Die Struktur funktioniert heute und voraussichtlich die ganze Dekade, aber korrekt erklären, um nicht von ihrer Beständigkeit abzuhängen.

Bei Exentax gestalten wir den Mercury+Wise-Betrieb mit kohärenten Flüssen, sauberer Modelo-720-Erklärung und Dokumentation für jede künftige Anfrage, nutzen die Asymmetrie, ohne sie in eine Meldelücke zu verwandeln.
<!-- /exentax:execution-v2 -->

## Wie wir bei Exentax arbeiten

Unser Team ist auf internationale Steuerstrukturen für Residenten spanischsprachiger Länder spezialisiert, die Online-Geschäfte betreiben. Wir verbinden lokales Wissen über Spanien, Andorra und Lateinamerika mit operativer Erfahrung bei der Gründung von Gesellschaften in Delaware, Wyoming, Estland und anderen Jurisdiktionen. Jeder Fall beginnt mit einer kostenlosen Beratung, in der wir Wohnsitz, Tätigkeit und Ziele bewerten, und wir sagen Ihnen ehrlich, ob die vorgeschlagene Struktur sinnvoll ist oder eine einfachere Alternative ausreicht.

<!-- task9-2026-expansion -->
## Regulatorischer Fluss: von der US-Bank zum IRS und weiter zur AEAT über FATCA IGA Modell 1

Dieser Abschnitt zerlegt den Mythos "US-Banken melden nichts" und zeichnet den realen Datenfluss zwischen den Vereinigten Staaten und Spanien unter dem FATCA-Regierungsabkommen Modell 1 nach, das am 14. Mai 2013 unterzeichnet, am 9. Dezember 2013 in Kraft trat und durch spätere Verwaltungsabkommen verfeinert wurde.

### Textuelles Flussdiagramm

1. **US-Bank oder EMI (Mercury, Choice, Column N.A., Wise US Inc., Relay Bank, Slash) → IRS**: jede als reziproke FFI klassifizierte Finanzinstitution meldet dem IRS jährlich Endsalden und Einkünfte aus Konten, deren Inhaber eine in Spanien ansässige Person oder Einheit gemäß FATCA ist. Gehört das Konto Ihrer LLC, läuft die Meldung über die GIIN der Gesellschaft und die TIN des wirtschaftlich Berechtigten laut W-9 oder W-8BEN/W-8BEN-E.
2. **IRS → AEAT**: der IRS bündelt die Kalenderjahresdaten und übermittelt sie zwischen **September und Oktober des Folgejahres** im seit Juli 2024 gültigen FATCA-XML-2.0-Schema an die AEAT.
3. **AEAT → interner Abgleich**: die AEAT gleicht diese Datensätze mit Ihren Erklärungen ab (Modelo 100, Modelo 720, Modelo 721). Abweichungen landen im "Plan Anual de Control Tributario" des Jahres.

### Was übertragen wird und was nicht

**Übertragen** (FATCA-XML-Felder): Name des Inhabers oder der LLC, Adresse, spanische TIN oder NIF, Kontonummer, Saldo zum 31. Dezember, im Jahr gezahlte Bruttozinsen, Dividenden und sonstige Bruttoeinkünfte, Bruttoerlöse aus Verkäufen von Finanzanlagen sowie die GIIN der Institution.

**Nicht automatisch übertragen**: Tagesumsätze, indirekte Begünstigte unter 25 % Kontrolle, die Gegenpartei jeder Operation und die interne Klassifikation der wirtschaftlichen Tätigkeit. Ausgenommen sind ferner Konten unter **50.000 USD** natürlicher US-Personen ohne US-Indizien gemäß FATCA-Due-Diligence, auch wenn Mercury und Wise US Inc. in jüngerer Zeit in der Praxis sämtliche Konten mit spanischer TIN über null melden.

### Kritische Termine

- 31. März: FFIs müssen die FATCA-Meldung anual an den IRS übermitteln.
- 30. September: übliches Austauschfenster IRS-AEAT del último ejercicio cerrado.
- Oktober bis Dezember: die Daten erscheinen in Renta Web der AEAT und lösen mögliche Auskunftsersuchen aus.

### Wie Sie sich ohne Überraschungen vorbereiten

Halten Sie Ihre W-8BEN-E in Einklang mit der realen Struktur, fakturieren und kassieren Sie immer über das LLC-Konto, archivieren Sie Monatsauszüge als PDF, und falls ein 720-Auskunftsersuchen eintrifft, haben Sie fünf Werktage Antwortfrist. Lassen Sie Ihren Fall durch den <strong>Exentax-Steuerrechner</strong> laufen, um die Netto-Kosten einer sauberen Deklaration gegenüber einer Grauzone zu sehen.

Um zu sehen, wie diese Daten mit der 720-Einreichung verschnitten werden, lesen Sie weiter mit <a href="/de/blog/modelo-720-und-modelo-721-leitfaden-fur-in-spanien-ansassige">der Schritt-für-Schritt-Anleitung zum Modelo 720 und 721</a>, und für ein vollständiges Setup-Audit <strong>vereinbaren Sie ein Gespräch mit dem Exentax-Team</strong>.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Rufen Sie uns unter <a href="tel:+34614916910">+34 614 916 910</a> an oder schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Es%20ist%20die%20Frage%2C%20die%20uns%20am%20h%C3%A4ufigsten%20gestellt%20wird%2C%20sobald%20ein%20Kunde%20seine%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Redaktionelle Überprüfung ausstehend</strong> — Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">100 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…rta CRS. No recibe CRS.** Cualquier institución financiera 100 % estadounidense, abriendo …»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">50.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ligación declarativa propia (Modelo 720 si saldo combinado &gt;50.000 €). La asimetría CRS no…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">25 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ovimientos diarios, beneficiarios indirectos por debajo del 25 % de control, contraparte d…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…, tu vida personal es tu vida personal. - El compliance US (Form 5472, BOI, mantenimiento …»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…un cliente Exentax que tiene su LLC bien estructurada. ### DAC7 y DAC8: directivas europea…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…ente Exentax que tiene su LLC bien estructurada. ### DAC7 y DAC8: directivas europeas, no …»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…*). - **UE / OCDE.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
