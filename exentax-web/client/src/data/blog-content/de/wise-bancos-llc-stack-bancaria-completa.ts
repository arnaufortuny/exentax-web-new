export default `Wenn jemand eine LLC aus dem Ausland eröffnet, läuft das Bankgespräch fast immer auf eine Frage hinaus: "Mercury oder Wise?". Diese Frage ist **das Symptom des Problems, nicht die Lösung**. Eine operative LLC trägt sich nicht über ein einziges Konto, nicht einmal über zwei. Sie braucht einen **Banking-Stack**, gedacht als System. In diesem Artikel erklären wir, wie ein Stack zu entwerfen ist, der den Alltag aushält, was passiert, wenn ein Stück ausfällt, und warum 80 % der Sperrungen, die wir bei Exentax sehen, genau aus dem Fehlen all dessen entstehen.

Dies ist kein Wise-vs-Mercury-Artikel (dafür haben Sie unseren <a href="/de/blog/wise-business-mit-ihrer-llc-der-vollstandige-leitfaden-fur">vollständigen Wise-Business-Leitfaden</a>, den <a href="/de/blog/mercury-konto-fur-ihre-llc-eroffnen-aus-jedem-land">Mercury-Leitfaden</a> und den <a href="/de/blog/traditionelle-banken-vs-fintech-fur-ihre-llc-wo-ihr-konto">Vergleich Banken vs Fintech</a>). Es ist der Artikel, der die vorhergehenden Stücke in eine kohärente Architektur ordnet.

## Der mentale Fehler: das Konto als "das Konto" denken

Wer aus Europa oder Lateinamerika kommt, bringt ein konkretes Bankmodell mit: **ein Konto pro Person, ein Konto pro Gesellschaft**. Punkt. Wenn das Konto gesperrt wird, gehen Sie in die Filiale, sprechen mit Ihrem Berater, lösen es. Das System unterstellt, die Bank habe Anreize, Sie nicht zu verlieren.

Im **US-Fintech-Ökosystem** existiert dieses Modell nicht. Mercury, Wise, Brex, Relay, Revolut Business & Co. sind **Tech-Plattformen**, keine Banken. Konten werden per API eröffnet und geschlossen, Entscheidungen treffen ein Scoring-System + ein Compliance-Team, das Sie nicht kennen und nicht anrufen können. Entscheidet das System eine Prüfung, ist Ihr Zugang **30, 60 oder 90 Tage eingefroren**, ohne kurzfristige Garantie für die Mittelrückgewinnung.

Erste mentale Verschiebung: **Ein Konto ist nicht "das Konto". Es ist ein Lieferant unter anderen, austauschbar wie ein Hosting oder eine Domain**. Und wie jeder kritische Lieferant braucht es Redundanz.
## Der minimal überlebensfähige Stack einer operativen LLC

Ab dem zweiten Jahr realer Aktivität (regelmäßiges Fakturieren und Vereinnahmen) sieht der minimale Stack einer gut geführten LLC etwa so aus:

1. **Operatives Hauptkonto in USD** (Mercury, Brex oder traditionelle Bank wie Bank of America/Chase, falls Sie persönlich eröffnen konnten).
2. **Sekundäres USD-Konto** desselben Profils (typisch Relay als Backup zu Mercury oder umgekehrt). Nicht für den Alltag, sondern als **echtes Failover** bei Sperrung.
3. **Multi-Währungskonto mit europäischer IBAN** (typisch Wise Business). Um europäische Kunden in EUR ohne SWIFT zu vereinnahmen und einen Eingang ins europäische Bankensystem zu haben.
4. **Payment-Gateway** an eines der beiden USD-Konten gekoppelt (Stripe, PayPal Business, Dodo Payments). Siehe den <a href="/de/blog/zahlungs-gateways-fur-ihre-llc-stripe-paypal-und-dodo">Gateway-Vergleich</a>.
5. **Physische Firmenkarte + virtuelle Karten** für SaaS-Abos und Einzelkäufe.
6. **Getrennte Reserven** für Steuern, FX und Betrieb (siehe unten).

Wirkt es übertrieben? Im ersten Monat ja. Es ist **strikt das Minimum**, um operativ zu bleiben, wenn etwas ausfällt. Und etwas fällt immer aus.
### Warum Mercury allein nicht reicht

Mercury ist wahrscheinlich das beste Produkt am Markt für eine Nicht-Resident-LLC: Remote-Onboarding, keine Monatsgebühr, brauchbare Buchhaltungs-Integration, vernünftiges Support-Team. Aber Mercury **ist keine Bank**: es ist eine Software-Schicht über Partnerbanken (Choice Financial, Column N.A., Evolve). Schneidet ein Partner Sie ab, kann Mercury **das Konto nicht wieder öffnen** noch die Gelder ohne Ihr Zutun zu einem anderen Partner schieben.

Was wir bei Exentax fast wöchentlich sehen:

- Mercury-Konto gesperrt wegen einer "atypischen" Eingangsüberweisung.
- Automatischer Mercury-Mail mit Dokumentanforderung (Rechnung, Vertrag, Flussnachweis).
- 7 bis 14 Tage ohne Operativität während Compliance prüft.
- In 70 % der Fälle: Wiederherstellung. In 30 %: **Schließung mit Mittelrückgabe in 30-60 Tagen**.

Hängt Ihre gesamte Operation an diesem Konto, können Sie wochenlang Team nicht zahlen, ACH-Kunden nicht fakturieren, kritische SaaS nicht aufrechterhalten. Ein vorab autorisiertes, operatives Sekundärkonto verwandelt eine **Geschäftskrise** in eine **48-Stunden-Belästigung**.
## Warum Wise allein nicht reicht

Wise Business ist exzellent für Multi-Währung, EU-IBAN und FX-Konvertierung. Aber Wise **ist kein operatives US-Konto**. Routing und Kontonummer in USD sind technisch "details", kein US-bankisses Konto auf den Namen Ihrer LLC. Drei praktische Folgen:

1. **Stripe US, Amazon US, gewisse Marketplaces und große Unternehmen** akzeptieren Wises USD-Details problemlos, andere (öffentliche Stellen, regulierte Broker, Partner mit ACH-Pflicht) lehnen ab, sobald sie erkennen, dass der Empfänger ein EMI ist.
2. **Stripe → Wise → lokales IBAN** funktioniert, fügt aber einen Akteur in die Compliance-Kette. Bei Sperrung müssen Sie die Rückverfolgung gegenüber mehr als einer Entität nachweisen.
3. **Wise meldet via CRS aus Belgien** und in andere Jurisdiktionen je nach Saldo. Wenn Sie Wise mit Privatsphäre verwechseln, lesen Sie zuerst <a href="/de/blog/wise-iban-und-llc-was-wirklich-an-die-steuerbehoerde">was Wise wirklich meldet</a> und <a href="/de/blog/wise-business-und-crs-was-ihrer-steuerbehoerde-gemeldet-wird">wie Wise in CRS einpasst</a>.

Fazit: Wise ist **ein unverzichtbares Stück** des europäischen Puzzles, ersetzt aber kein operatives USD-Konto auf den Namen Ihrer LLC.
### Die Falle der belgischen IBAN (und nicht-lokalen IBAN)

Bei Wise Business als US-LLC bekommen Sie eine **belgische IBAN** (BE...). Das überrascht viele, die ein IBAN ihres Wohnsitzlands erwarteten. Doppelte Konsequenz:

- Operativ funktioniert die IBAN problemlos für SEPA innerhalb der Eurozone.
- Steuerlich und für die **Auslandsvermögensmeldung** (Modelo 720 Spanien, IES Portugal, 3916 Frankreich, Anlage AUS Deutschland u. a.) ist diese belgische IBAN **ein Auslandskonto auf den Namen einer ausländischen Entität**. Bei Schwellenüberschreitung und Steueransässigkeit zu Hause **müssen Sie es melden**.

Der typische Fehler: "BE-IBAN, gehört der LLC, melde ich nicht". Falsch. Die Meldepflicht blickt auf den wirtschaftlich Berechtigten (Sie). Mehr in <a href="/de/blog/melden-us-bankkonten-an-ihre-heimische-steuerbehorde-die">US-Konten und Finanzamt</a> und im <a href="/de/blog/crs-und-ihre-us-llc-bankkonten-was-mit-ihrem-heimatland">CRS-Leitfaden für LLC-Konten</a>.
## Interne Regeln, die Ihnen 5 Stellen sparen

Der Stack ist nur die Hardware. Reale Probleme verhindern die Betriebsregeln:

### 1. Niemals Privates und LLC mischen

Banal, aber teuerster und häufigster Fehler. Wer privates Netflix mit der LLC-Karte zahlt, **durchbricht den Corporate Veil** und liefert dem <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> + heimischen Finanzamt die LLC als Erweiterung des Privatvermögens. Null Ausnahmen.

### 2. Nach Risiko segmentieren

Große B2B-Kunden vs. Krypto-Marktplatz-Auszahlungen → **Trennen Sie Flüsse auf Konten**. Hauptkonto: saubere, dokumentierte Flüsse. Sekundär: volatilere Flüsse.

### 3. Steuerpuffer 25-35 %

Jede Eingangszahlung: **automatisch 25-35 %** in eine "Tax Reserve" abtrennen. Deckt die Steuer im Wohnsitzland (ja, fällt an, siehe <a href="/de/blog/ihre-llc-zahlt-keine-us-steuer-was-passiert-dann-in-ihrem">warum Ihre LLC keine US-Steuer zahlt aber Sie zu Hause schon</a>).

### 4. FX-Puffer separat

Geschäft in USD, Ausgaben/Erklärung in EUR: ein FX-Puffer vermeidet Konvertierungen im schlechtesten Moment.

### 5. Verträge vor der ersten Zahlung dokumentieren

Eingangstransfer >5 000 USD eines neuen Kunden → früher oder später kommt eine Compliance-Mail mit "purpose of payment, contract, invoice". Vertrag signiert und Rechnung gestellt **vor** Vereinnahmung reduziert Prüfzeit von 14 Tagen auf 24 Stunden.

### 6. Absolutes Backup: "Wenn das morgen kippt"

Quartalsfrage: "Fällt Mercury morgen endgültig aus, was tue ich in 72 Stunden?". Antwort "weiß ich nicht" → Stack falsch gebaut.
### Was passiert, wenn gesperrt wird (nicht "ob", sondern "wann")

Operative Wahrheit: **jede LLC mit 18+ Aktivitätsmonaten hatte mindestens ein Sperr- oder Prüfungsereignis**. Schadenausmaß hängt vom Stack ab.

Typische Sperrung:
- **Tag 0**: automatischer "under review"-Mail.
- **Tage 1-3**: Dokumente einreichen.
- **Tage 4-14**: Schweigen, Zugang nur eingehend.
- **Tag 14-30**: vollständige Wiedereröffnung oder Schließung mit Mittelrückgabe in 30-60 Tagen.

Schadensminderung: Sekundärkonto ab Tag 1 aktivieren, beide leicht in Bewegung halten, monatliche Auszüge als PDF lokal sichern, jeden Kunden mit Mini-Dossier dokumentieren.
### Gateway-Gespräch: Stripe & Co.

Stripe ist Default für jede LLC, hat aber eigenes Sperrregime: **Rolling Reserves 5-10 %** über 90-120 Tage für neue oder Hochrisiko-Konten, plus Möglichkeit, Mittel bei Betrugsverdacht einzufrieren.

- **Stripe nicht an ein einziges Konto koppeln**.
- **Stripe-Descriptor** auf realen Handelsnamen setzen.
- **Churn-Alerts** + Puffer von 30 Auszahlungstagen zur Absorption eines Freezes.

PayPal Business: nützlich als Ergänzung, nicht als Hauptkanal.
### Karten: physisch, virtuell und "eine pro Kategorie"

- **Eine physische Karte**: physische Ausgaben (Coworking, Reisen, Kunden-Mahlzeiten).
- **Virtuelle "SaaS"-Karte**: alle Abos.
- **Virtuelle "Ads"-Karte**: bezahlte Kampagnen.
- **Virtuelle "Single-Use"-Karte**: einmalige Käufe bei wenig vertrauenswürdigen Anbietern.
### Was Sie mitnehmen sollten

- Richtige Frage: nicht "Mercury oder Wise", sondern "**welchen Stack baue ich**".
- Minimum: **2 USD-Konten + 1 Multi-Währungskonto + Gateway + segmentierte Karten + Reserven**.
- Wise-IBAN ist belgisch, nicht lokal. Bleibt meldepflichtig.
- Sperrungen sind kein Ausnahmefall, sondern vorhersagbare Routine. Stack entscheidet zwischen Belästigung und Krise.
- **Niemals Privates und LLC mischen**, nach Risiko segmentieren, 25-35 % Steuerpuffer, FX-Puffer und Vorab-Dokumentation: die fünf Regeln, die fünfstellig sparen.

Wenn Sie eine LLC haben und mit uns den richtigen Banking-Stack für Ihr Volumen und Risikoprofil entwerfen wollen, **wir prüfen es mit Ihnen** in einer kostenlosen 30-Minuten-Beratung. Gut gebaut: günstig. Halbgar gebaut und am Tag der ersten "under review"-Mail entdeckt: teuer.
## Rechtliche und regulatorische Quellen

Dieser Artikel stützt sich auf Vorschriften, die zum Stichtag aktuell in Kraft sind. Hauptquellen zur Verifikation:

- **USA.** Treas. Reg. §301.7701-3 (Entity Classification / *check-the-box*); IRC §882 (Steuer auf mit US-Geschäft effektiv verbundene Einkünfte Ausländer); IRC §871 (FDAP und Quellensteuer bei Nicht-Residenten); IRC §6038A und Treas. Reg. §1.6038A-2 (Form 5472 für *25% foreign-owned* und *foreign-owned disregarded entities*); IRC §7701(b) (Steuerwohnsitz, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report bei <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spanien.** Gesetz 35/2006 (LIRPF), Artt. 8, 9 (Wohnsitz), 87 (Einkünftezurechnung), 91 (Hinzurechnungsbesteuerung natürliche Personen); Gesetz 27/2014 (LIS), Art. 100 (Hinzurechnungsbesteuerung Gesellschaften); Gesetz 58/2003 (LGT), Artt. 15 und 16; Gesetz 5/2022 (Sanktionsregime Modelo 720 nach EuGH C-788/19 vom 27.01.2022); RD 1065/2007 (Modelos 232 und 720); Anordnung HFP/887/2023 (Modelo 721 Krypto).
- **DBA Spanien–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> vom 22.12.1990 (DBA); Protokoll in Kraft seit 27.11.2019 (passive Einkünfte, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Richtlinie (EU) 2011/16, geändert durch DAC6 (grenzüberschreitende Gestaltungen), DAC7 (Richtlinie (EU) 2021/514, digitale Plattformen) und DAC8 (Richtlinie (EU) 2023/2226, Kryptowerte); Richtlinie (EU) 2016/1164 (ATAD: CFC, Exit Tax, hybride Gestaltungen); OECD Common Reporting Standard (CRS).
- **Internationaler Rahmen.** OECD-Musterabkommen, Art. 5 (Betriebsstätte) und Kommentare; BEPS-Aktion 5 (wirtschaftliche Substanz); FATF-Empfehlung 24 (wirtschaftlicher Eigentümer).

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

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
## Was Sie mitnehmen sollten

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

## Rechtliche und regulatorische Referenzen

Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben - und in dieser Reihenfolge gehen wir vor.

## Bank- und Steuerfakten, die es zu präzisieren gilt

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

## Rechtliche und verfahrenstechnische Fakten

<!-- exentax:execution-v2 -->
## Wise + Banken für LLC: der komplette Banken-Stack für jeden Nichtansässigen

Die Frage „Mercury oder Wise?" ist falsch gestellt. Richtige Antwort: „beide plus Stripe plus Alternative".

- **Schicht 1: operatives Hauptkonto (Mercury).** Empfängt Stripe-Payouts, zahlt Vendoren via gratis ACH, USD-Debit, QuickBooks-Integration.
- **Schicht 2: Backup und Multi-Währung (Wise Business).** USD/EUR/GBP. Empfängt EU-Kunden direkt in EUR (lokales SEPA, nicht SWIFT). Schließt Mercury, läuft Wise weiter.
- **Schicht 3: Payment-Gateway (Stripe + Alternative).** Stripe US verbunden mit Mercury. Lemon Squeezy/Dodo als MoR für EU-Digital.
- **Schicht 4: Treasury und optimiertes FX.** Wise-EUR-Konto für Reserven.

### Kompletter Stack typischer Fall

Wyoming LLC + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Monatlich ~50-100$ bei Volumen <100k$/Jahr.

### Was am häufigsten gefragt wird

**Mercury oder Wise für Stripe-Payout?** Mercury etwas schneller.

**Brex/Ramp für kleine LLC?** Typisch nicht unter 500k$/Jahr.

Bei Exentax bauen wir den kompletten Stack als Paket auf.
<!-- /exentax:execution-v2 -->

## Ihr nächster Schritt mit Exentax

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Rufen Sie uns unter <a href="tel:+34614916910">+34 614 916 910</a> an oder schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Wenn%20jemand%20eine%20LLC%20aus%20dem%20Ausland%20er%C3%B6ffnet%2C%20l%C3%A4uft%20das%20Bankgespr%C3%A4ch%20fast%20im%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Redaktionelle Überprüfung ausstehend</strong> — Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">80 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…el día a día, qué pasa cuando una pieza falla, y por qué el 80 % de los bloqueos que vemos…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">70 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…a 14 días sin operativa mientras compliance revisa. - En el 70 % de los casos, cuenta rest…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">30 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…visa. - En el 70 % de los casos, cuenta restablecida. En el 30 %, **cierre con devolución …»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">35 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ípico, la primera sigue operando. ### 3. Tax buffer del 25-35 % Cada vez que entra dinero …»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">25 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…o en la cuenta operativa, **separa automáticamente entre un 25 % y un 35 %** a una cuenta …»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">10 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…aras en EUR/GBP/MXN, las fluctuaciones FX te pueden comer 5-10 % de margen en un mal trime…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">5.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…legue el primer pago Cada vez que entra una transferencia &gt;5.000 USD de un cliente nuevo, …»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">301.770</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…es para que puedas verificarlo: - **EE. UU.** Treas. Reg. §301.7701-3 (clasificación de en…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">1.603</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…P y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25%…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ntes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-owned* y *foreign-…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">25.000</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…ga con **Form 7004** hasta el **15 de octubre**. **Sanción: 25.000 USD por formulario y añ…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">21 %</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…the-box election* a C-Corp (Form 8832): entonces tributa al 21 % federal y presenta un 112…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">4%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…Mercury cierra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradici…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">1%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…cierra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradicionales).…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">3%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…erra mañana, Wise sigue operando 24h. FX típico 0.4% (vs 1%-3% de bancos tradicionales). T…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">5%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…tú vives en EUR, optimizar el momento de conversión vale 0.5%-1% anual sobre el flujo tota…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">95%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…recurrente ~$50-$100 si volumen &lt;100k$/año. Con esto cubres 95% de escenarios sin tener qu…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">IRC §882</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…§301.7701-3 (clasificación de entidades / *check-the-box*); IRC §882 (impuesto sobre renta…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §871</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…rentas de extranjeros conectadas con US trade or business); IRC §871 (FDAP y retenciones a…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §6038</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…r business); IRC §871 (FDAP y retenciones a no residentes); IRC §6038A y Treas. Reg. §1.60…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">IRC §7701</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…25% foreign-owned* y *foreign-owned disregarded entities*); IRC §7701(b) (residencia fisca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 5472</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…ones a no residentes); IRC §6038A y Treas. Reg. §1.6038A-2 (Form 5472 para *25% foreign-ow…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 1120</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…C como una corporación a efectos del 5472. Procedimiento: **Form 1120 pro-forma** (solo ca…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 7004</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…le** estándar. Vencimiento: **15 de abril**; prórroga con **Form 7004** hasta el **15 de o…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">Form 8832</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…a si la LLC ha realizado *check-the-box election* a C-Corp (Form 8832): entonces tributa a…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.irs.gov" rel="nofollow noopener" target="_blank">www.irs.gov</a>]</strong></li>
<li><span class="font-mono">RD 1065/2007</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…cionador del Modelo 720 tras STJUE C-788/19 de 27/01/2022); RD 1065/2007 (Modelos 232 y 72…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>]</strong></li>
<li><span class="font-mono">DAC6</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…oopener&quot;&gt;OCDE&lt;/a&gt;.** Directiva (UE) 2011/16, modificada por DAC6 (mecanismos transfronteri…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC7</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…2011/16, modificada por DAC6 (mecanismos transfronterizos), DAC7 (Directive (EU) 2021/514,…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
<li><span class="font-mono">DAC8</span> <span class="opacity-70">(Rechtsverweis)</span> <span class="text-xs italic">— «…s), DAC7 (Directive (EU) 2021/514, plataformas digitales) y DAC8 (criptoactivos); Directiv…»</span> <strong>[REVISIÓN MANUAL — vorgeschlagene Quelle: <a href="https://eur-lex.europa.eu" rel="nofollow noopener" target="_blank">eur-lex.europa.eu</a>]</strong></li>
</ul>
</aside>
<!-- /exentax:review-anchor-v1 -->
`;
