export default `Aus deutschsprachiger Sicht kennt man SEPA-Überweisungen in 1 Bankarbeitstag und Instant Payments in Sekunden. In den USA ist das System anders getaktet: ACH braucht 1-3 Tage, Wire geht am selben Tag raus, kostet aber 15-35 $, und RTP/FedNow sickern gerade erst in die Fintech-Landschaft ein. Diese Taktung zu verstehen verhindert, dass eine Zahlung an Zulieferer allein wegen Unwissen verschoben wird.

Lassen Sie uns alle Bearbeitungszeiten auf den Tisch legen, damit es keine Überraschungen gibt.

## ACH (Automated Clearing House)

ACH ist das inländische Überweisungssystem der USA. Es ist die gängigste und günstigste Methode (in der Regel kostenlos).
## ACH-Bearbeitungszeiten

| Typ | Dauer |
|---|---|
| ACH Standard | **1-3 Werktage** |
| ACH Same-Day | **Am selben Tag** (wenn vor 14:45 Uhr ET initiiert) |
| ACH Next-Day | **Nächster Werktag** |

**Wichtig:** Werktage sind Montag bis Freitag (ohne US-Bundesfeiertage). Wenn Sie am Freitagnachmittag eine ACH-Überweisung senden, kommt sie erst am Montag oder Dienstag an.

### Faktoren, die die Bearbeitungszeit beeinflussen

- **Uhrzeit der Überweisung**: wenn Sie nach der Cut-off-Zeit senden, wird sie am nächsten Werktag verarbeitet
- **Empfängerbank**: einige Banken halten ACH-Gelder 1-2 zusätzliche Tage zur Überprüfung zurück
- **Erste Überweisung**: die erste Überweisung an ein neues Konto kann aufgrund von Sicherheitsüberprüfungen länger dauern
### Inlands-Wire-Transfer

Inlands-Wires (innerhalb der USA) sind schneller als ACH, haben aber Kosten.

### Bearbeitungszeiten Inlands-Wire

| Typ | Dauer |
|---|---|
| Standard-Inlands-Wire | **Am selben Tag** (2-6 Stunden) |
| Eiliger Inlands-Wire | **1-2 Stunden** |

Inlands-Wires kommen in der Regel in **Stunden** an, nicht in Tagen. Deshalb werden sie für dringende Zahlungen oder große Beträge verwendet.
## Internationaler Wire Transfer (SWIFT)

Internationale Wires nutzen das SWIFT-Netzwerk und passieren Korrespondenzbanken, was sie langsamer macht.

### Bearbeitungszeiten internationaler Wire

| Route | Dauer |
|---|---|
| USA → Europa | **1-3 Werktage** |
| USA → Lateinamerika | **2-5 Werktage** |
| USA → Asien | **2-4 Werktage** |

### Warum dauern sie länger?

- **Korrespondenzbanken**: das Geld kann über 1-3 Korrespondenzbanken laufen, bevor es am Ziel ankommt
- **Zeitzonen**: wenn die Empfängerbank bereits geschlossen hat, wird die Überweisung am nächsten Werktag verarbeitet
- **Compliance-Prüfungen**: internationale Überweisungen durchlaufen Betrugs- und Geldwäschekontrollen
### Wise Business

Wise nutzt für die meisten Überweisungen nicht das SWIFT-Netzwerk. Es verwendet lokale Konten in jedem Land, was Zeiten und Kosten reduziert.

### Bearbeitungszeiten bei Wise

| Route | Dauer |
|---|---|
| USD → EUR (SEPA) | **1-2 Werktage** |
| USD → GBP | **1 Werktag** |
| USD → MXN | **1-2 Werktage** |
| USD → COP | **1-3 Werktage** |
### Gesamtvergleich

| Methode | Dauer | Kosten (Mercury) | Am besten für |
|---|---|---|---|
| ACH | 1-3 Tage | Kostenlos | Nicht dringende Inlandszahlungen |
| Inlands-Wire | Am selben Tag | **$0 bei Mercury** | Dringende Zahlungen innerhalb der USA |
| Internationaler Wire | 1-5 Tage | **$0 bei Mercury** | Große internationale Zahlungen |
| Wise | 1-2 Tage | 0,4-1,5 % | Häufige internationale Zahlungen |
| Stripe/PayPal Auszahlung | 2-3 Tage | Inklusive | Zahlungseingang von Kunden |
### Tipps zur Beschleunigung Ihrer Zahlungen

- **Initiieren Sie Überweisungen früh**: vor 14:00 Uhr Eastern Time (US-Ostküste). Nach der Cut-off-Zeit wird die Überweisung am nächsten Werktag verarbeitet
- **Vermeiden Sie Freitage und Feiertage**: Überweisungen werden an Wochenenden nicht verarbeitet. Eine ACH-Überweisung, die am Freitag initiiert wird, kommt frühestens am Dienstag an
- **Nutzen Sie ACH Same-Day**, wenn Sie Geschwindigkeit ohne Wire-Kosten benötigen, bei Mercury ohne zusätzliche Kosten verfügbar
- **Bündeln Sie internationale Überweisungen**: ein großer Wire ist günstiger als mehrere kleine. Und bei Mercury sind Wires ohnehin $0
- **Nutzen Sie Wise für wiederkehrende Zahlungen**: schneller und günstiger als traditionelle Wires für mittlere Beträge, dank des Netzwerks lokaler Konten

Zum Abschluss einige verwandte Beiträge, die unmittelbar an diesen Text anschließen: <a href="/de/blog/ihr-erster-monat-mit-einer-us-llc-woche-fur-woche-was">Ihr erster Monat mit einer US LLC: Woche für Woche was erwartet Sie</a> und <a href="/de/blog/wahrungen-fur-ihre-llc-wechseln-beste-optionen-und">Währungen für Ihre LLC wechseln: beste Optionen und versteckte Gebühren vermeiden</a> runden den Kontext ab.
### Die Information, die alles verändert: Mercury $0 Wire-Gebühren

Die meisten Banken berechnen zwischen $15-50 pro Wire Transfer. Mercury berechnet nichts. Null. Weder national noch international. Das verändert komplett, wie Sie Ihre Zahlungen planen:

- Müssen Sie einen Lieferanten in Europa bezahlen? Internationaler Wire von Mercury: $0
- Ein amerikanischer Kunde möchte Ihnen per Wire zahlen? Sie empfangen es kostenlos
- Wise verlangt eine Wire-Überweisung zur Verifizierung? $0

Mercury nutzt Column NA als Verwahrbank, mit FDIC-Versicherung. Es ist keine experimentelle Fintech, es ist seriöse Finanzinfrastruktur für Ihre LLC.

Bei Exentax optimieren wir das Banking-Routing wöchentlich für DACH-Kunden. Buchen Sie Ihre kostenlose Beratung: wir analysieren Ihre wiederkehrenden Flüsse und empfehlen ACH vs. Wire im jeweiligen Fall.
## Ausgewogener Banking-Stack: Mercury, Relay, Slash und Wise

Es gibt nicht das perfekte Konto für eine LLC. Es gibt den richtigen **Stack**, in dem jedes Tool eine Rolle übernimmt:

- **Mercury** (als Fintech mit Partnerbanken (hauptsächlich Choice Financial Group und Evolve Bank & Trust; Column N.A. in Altkonten) betrieben, FDIC über Sweep-Netzwerk bis zur geltenden Grenze). Operatives Hauptkonto für Nicht-Residenten mit guter UX, ACH und Wire. Weiterhin eine der bewährtesten Optionen, um aus dem Ausland zu eröffnen.
- **Relay** (gehalten bei Thread Bank, FDIC). Hervorragendes **Backup-Konto** und für Envelope-Budgeting: bis zu 20 Unterkonten und 50 Debitkarten, tiefe QuickBooks- und Xero-Integration. Wenn Mercury sperrt oder eine KYC-Überprüfung verlangt, hält Relay Ihren Betrieb am Laufen.
- **Slash** (gehalten bei Column N.A. (bundesweit konzessionierte Bank, FDIC)). Banking für Online-Operatoren: sofortige Ausgabe virtueller Karten je Anbieter, granulare Ausgabenkontrollen, Cashback auf digitale Werbung. Natürliche Ergänzung, wenn Sie Meta Ads, Google Ads oder SaaS-Abos verwalten.
- **Wise Business** (Multi-Währungs-EMI, keine Bank). Zum Empfangen und Zahlen in EUR, GBP, USD und weiteren Währungen mit lokalen Bankdaten und Mid-Market-FX. Ersetzt kein echtes US-Konto, ist aber für internationale Treasury unschlagbar.
- **Wallester / Revolut Business.** Wallester liefert Firmenkarten mit eigenem BIN für hohe Volumen. Revolut Business funktioniert als europäische Ergänzung, nicht als Hauptkonto der LLC.
Die realistische Empfehlung: **Mercury + Relay als Backup + Slash für Werbe-Operationen + Wise für FX-Treasury**. Diese Konfiguration minimiert das Sperr-Risiko und senkt die realen Kosten. Bei Exentax eröffnen und konfigurieren wir diesen Stack im Rahmen der Gründung.

<!-- exentax:banking-facts-v1 -->
## Bank- und Steuerfakten zur Präzisierung

Fintech- und CRS-Informationen entwickeln sich weiter; hier der aktuelle Stand:

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

### Hinweise nach Anbieter

- **Mercury** arbeitet mit mehreren bundesweit lizenzierten Partnerbanken mit **FDIC**-Deckung über Sweep-Netzwerk: hauptsächlich **Choice Financial Group** und **Evolve Bank & Trust**, sowie **Column N.A.** in einigen Altkonten. Mercury ist selbst keine Bank; es ist eine Fintech-Plattform, die durch diese Partnerbanken getragen wird. Wenn Mercury ein Konto schließt, wird der Saldo in der Regel **per Papierscheck an die hinterlegte Adresse des Kontoinhabers** zurückgesandt, was für Nicht-Residenten ein ernsthaftes operatives Problem darstellen kann; ein sekundäres Konto (Relay, Wise Business etc.) sollte als Reserve aktiv sein.
- **Wise** bietet zwei klar getrennte Produkte: **Wise Personal** und **Wise Business**. Für eine LLC ist **Wise Business** zu eröffnen, nicht das persönliche Konto. Wichtige CRS-Nuance: Ein **Wise Business im Namen einer US-LLC liegt außerhalb des CRS**, weil Kontoinhaberin eine US-Entität ist und die USA kein CRS-Teilnehmer sind; die USD-Seite läuft über Wise US Inc. (FATCA-Perimeter, nicht CRS). Dagegen löst ein **Wise Personal, eröffnet von einer in Spanien** oder einem anderen CRS-Land steuerlich ansässigen Person, sehr wohl eine **CRS-Meldung über Wise Europe SA (Belgien)** zu dieser Person aus. Wise für die LLC zu öffnen bringt Sie nicht über die LLC ins CRS; ein separates Wise Personal auf Ihren Namen als in einem CRS-Land Ansässiger schon.
- **Wallester** (Estland) ist ein europäisches Finanzinstitut mit EMI-/Karten-Emittentenlizenz. Seine europäischen IBAN-Konten **fallen unter den Gemeinsamen Meldestandard (CRS)** und lösen daher den automatischen Informationsaustausch an die Steuerverwaltung des Wohnsitzlands aus.
- **Payoneer** operiert über europäische Einheiten (Payoneer Europe Ltd, Irland), die ebenfalls **unter CRS fallen**, wenn der Kunde in einer teilnehmenden Jurisdiktion ansässig ist.
- **Revolut Business**: in Verbindung mit einer **US-LLC** läuft die übliche Konfiguration über Revolut Payments USA; europäische IBANs (litauisch, BE) **werden einer LLC nicht standardmäßig ausgegeben**, sie werden europäischen Kunden der europäischen Bank des Konzerns ausgegeben. Wird Ihnen ein europäischer IBAN angeboten, prüfen Sie, an welche Rechtsperson er gebunden ist und unter welchem Regime diese meldet.
- **Null-Steuer**: keine LLC-Struktur erreicht „null Steuern", wenn Sie in einem Land mit CFC-/Steuertransparenz- oder Einkünftezurechnungsregeln leben. Was Sie erreichen, ist **keine Doppelbesteuerung** und **korrekte Meldung am Wohnsitz**, keine Beseitigung.
## Wir richten es ein, ohne dass Sie ein Wochenende verlieren

Tausende von Freelancern und Unternehmern betreiben ihre US-LLC bereits vollständig legal und dokumentiert. Bei Exentax kümmern wir uns um den gesamten Prozess: Gründung, Banking, Zahlungsabwicklung, Buchhaltung, <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>-Erklärungen und Compliance in Ihrem Wohnsitzland. Buchen Sie eine kostenlose Beratung, und wir sagen Ihnen ehrlich, ob die LLC für Ihren Fall sinnvoll ist, ohne absolute Versprechen.<!-- exentax:execution-v2 -->
## ACH- und Wire-Transfer-Zeiten in US: wie lange jede Methode dauert und wann was nutzen

Aus SEPA kommend wirkt das US-Zahlungssystem aus einem anderen Jahrhundert. Verständnis nötig, weil es beeinflusst, wann Sie kassieren und welche Gebühren anfallen.

- **ACH (Automated Clearing House).** Das amerikanische SEPA. Kosten nahe null (0$-1$), Abwicklung 1-3 Werktage. Standard für wiederkehrende B2B-Zahlungen.
- **Inland-Wire.** Wie Eilüberweisung: 5$-30$, kommt in Stunden (gleicher Tag vor Cutoff ~14:00 ET).
- **International Wire (SWIFT).** 15$-50$ + Zwischenbankgebühren + FX-Spread (~1%-3%). 1-5 Werktage.
- **Stripe-Payouts.** ACH 2 Werktage Standard oder sofort mit 1% Extra.

### Typische operative Strategie

Revenue: US-Kunden via ACH/Stripe → Mercury/Wise USD. Internationale via Wise. Outflow: US-Lieferanten via ACH gratis, internationale via Wise, Draw privat via Wise USD → IBAN EUR.

### Was am häufigsten gefragt wird

**Warum braucht Stripe 7 Tage?** Rolling Reserve gegen Chargebacks. Neue Konten 7-14 Tage, dann 2.

**Ist Wise USD wirklich ein „US-Konto"?** Wise-Inc.-Konto mit eigener ACH-Routingnummer. Operiert praktisch als US-Konto.

Bei Exentax bauen wir den Banken-Stack nach Use Case auf.
<!-- /exentax:execution-v2 -->

## Wie wir bei Exentax arbeiten

Unser Team ist auf internationale Steuerstrukturen für Residenten spanischsprachiger Länder spezialisiert, die Online-Geschäfte betreiben. Wir verbinden lokales Wissen über Spanien, Andorra und Lateinamerika mit operativer Erfahrung bei der Gründung von Gesellschaften in Delaware, Wyoming, Estland und anderen Jurisdiktionen. Jeder Fall beginnt mit einer kostenlosen Beratung, in der wir Wohnsitz, Tätigkeit und Ziele bewerten, und wir sagen Ihnen ehrlich, ob die vorgeschlagene Struktur sinnvoll ist oder eine einfachere Alternative ausreicht.

  ### SEPA, Target2 und Sonderfälle für DACH-LLC-Inhaber

  Wer von Deutschland, Österreich oder der Schweiz aus eine US-LLC betreibt, kombiniert in der Praxis ACH/Wire mit **SEPA-Überweisungen** (Single Euro Payments Area). Die wichtigsten Geschwindigkeitsunterschiede sind: **SEPA Credit Transfer (SCT)** dauert 1 Bankarbeitstag (D+1), **SEPA Instant Credit Transfer (SCT Inst)** unter 10 Sekunden 24/7 — seit dem **EU-Verordnungsentwurf 2024/886 (Instant Payments Regulation)** ist die Annahme von Sofortüberweisungen für alle Eurozonen-Banken **bis 9. Oktober 2025 obligatorisch** (Empfang) und **bis 9. April 2026** (Versand), ohne Aufpreis gegenüber Standard-SCT.

  Für **größere USD-Beträge** über USD 100.000 nutzen DACH-LLC-Inhaber typischerweise: (a) **Wise Business** (multi-divisa, ca. 0,4–0,7 % FX-Markup, IBAN belgisch BE bei Wise Europe SA — was zur **CRS-Meldepflicht nach Belgien** führt, das die Daten dann an Deutschland/Österreich automatisch weiterleitet); (b) **Mercury Wire International** (USD 5 fee outgoing, 1–3 Bankarbeitstage über SWIFT MT103); (c) deutsche **Hausbank-Devisenkonto** (Deutsche Bank, Commerzbank, Sparkasse) mit USD-Unterkonto, höhere Spreads (1,5–2,5 %) aber direkter Reporting-Komfort für die Anlage AUS und §138 AO.

  In der **Schweiz** ist die **FINMA-Lizenz** der Wise Schweiz AG begrenzt — viele Schweizer LLC-Inhaber führen ihre USD-Operationen über UBS/Raiffeisen-Devisenkonten oder direkt über das Mercury-Konto, wobei die Stempelsteuer bei Wertschriftengeschäften (1,5 ‰ inländisch / 3 ‰ ausländisch) zu beachten ist. Die schweizerische Mehrwertsteuer (8,1 % Normalsatz seit 1.1.2024) wird auf Wechselgebühren grundsätzlich nicht erhoben (Art. 21 Abs. 2 Ziff. 19 MWSTG).

  Praktischer Hinweis: deutsche Steuerpflichtige müssen bei **Konten im Drittland mit Saldo > €100.000** im Jahresdurchschnitt das **Formular „Anzeige nach §138 Abs. 2 AO"** beim zuständigen Finanzamt einreichen, **innerhalb von 5 Monaten** nach Ablauf des Kalenderjahres (Frist: 31. Mai). Das gilt auch für Mercury-, Relay- und Column-N.A.-Konten. Verstöße werden mit Verspätungszuschlag bis €25.000 nach §379 AO sanktioniert.

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
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Aus%20deutschsprachiger%20Sicht%20kennt%20man%20SEPA-%C3%9Cberweisungen%20in%201%20Bankarbeitstag%20%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Redaktionelle Überprüfung ausstehend</strong> — Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">5%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…| Pagos internacionales grandes | | Wise | 1-2 días | 0.4-1.5% | Pagos internacionales fre…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…envío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábi…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ío + comisión bancos intermediarios + spread de cambio (~1%-3%). Llega en 1-5 días hábiles…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…FX), draw a personal vía Wise USD → IBAN EUR (3-5 días, ~0.4% spread). Esto minimiza coste…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">IRC §1471</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…eneficial Ownership Information Report). - **FATCA y CRS.** IRC §1471-1474 (FATCA y formul…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
