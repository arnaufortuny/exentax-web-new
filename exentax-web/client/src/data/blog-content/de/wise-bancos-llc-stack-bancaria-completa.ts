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

Mercury ist wahrscheinlich das beste Produkt am Markt für eine Nicht-Resident-LLC: Online-Onboarding, keine Monatsgebühr, brauchbare Buchhaltungs-Integration, vernünftiges Support-Team. Aber Mercury **ist keine Bank**: es ist eine Software-Schicht über Partnerbanken (Choice Financial, Column N.A., Evolve). Schneidet ein Partner Sie ab, kann Mercury **das Konto nicht wieder öffnen** noch die Gelder ohne Ihr Zutun zu einem anderen Partner schieben.

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

Die konkrete Anwendung dieser Regeln auf Ihren Fall hängt von Ihrem Steuerwohnsitz, der Tätigkeit der LLC und der von Ihnen geführten Dokumentation ab. Dieser Inhalt ist informativ und ersetzt keine personalisierte professionelle Beratung.

<!-- exentax:bank-balance-v1 -->
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

### Hinweise nach Anbieter

- **Mercury** arbeitet mit mehreren bundesweit lizenzierten Partnerbanken mit **FDIC**-Deckung über Sweep-Netzwerk: hauptsächlich **Choice Financial Group** und **Evolve Bank & Trust**, sowie **Column N.A.** in einigen Altkonten. Mercury ist selbst keine Bank; es ist eine Fintech-Plattform, die durch diese Partnerbanken getragen wird. Wenn Mercury ein Konto schließt, wird der Saldo in der Regel **per Papierscheck an die hinterlegte Adresse des Kontoinhabers** zurückgesandt, was für Nicht-Residenten ein ernsthaftes operatives Problem darstellen kann; ein sekundäres Konto (Relay, Wise Business etc.) sollte als Reserve aktiv sein.
- **Wise** bietet zwei klar getrennte Produkte: **Wise Personal** und **Wise Business**. Für eine LLC ist **Wise Business** zu eröffnen, nicht das persönliche Konto. Wichtige CRS-Nuance: Ein **Wise Business im Namen einer US-LLC liegt außerhalb des CRS**, weil Kontoinhaberin eine US-Entität ist und die USA kein CRS-Teilnehmer sind; die USD-Seite läuft über Wise US Inc. (FATCA-Perimeter, nicht CRS). Dagegen löst ein **Wise Personal, eröffnet von einer in Spanien** oder einem anderen CRS-Land steuerlich ansässigen Person, sehr wohl eine **CRS-Meldung über Wise Europe SA (Belgien)** zu dieser Person aus. Wise für die LLC zu öffnen bringt Sie nicht über die LLC ins CRS; ein separates Wise Personal auf Ihren Namen als in einem CRS-Land Ansässiger schon.
- **Wallester** (Estland) ist ein europäisches Finanzinstitut mit EMI-/Karten-Emittentenlizenz. Seine europäischen IBAN-Konten **fallen unter den Gemeinsamen Meldestandard (CRS)** und lösen daher den automatischen Informationsaustausch an die Steuerverwaltung des Wohnsitzlands aus.
- **Payoneer** operiert über europäische Einheiten (Payoneer Europe Ltd, Irland), die ebenfalls **unter CRS fallen**, wenn der Kunde in einer teilnehmenden Jurisdiktion ansässig ist.
- **Revolut Business**: in Verbindung mit einer **US-LLC** läuft es über **Revolut Technologies Inc.** mit **Lead Bank** als US-Bankpartner. Das ausgegebene Konto ist ein US-Konto (Routing + Account Number); **es wird kein europäischer IBAN** an eine LLC ausgegeben. Die europäischen IBANs (litauisch, BE) gehören zu **Revolut Bank UAB** und werden an europäische Kunden der Gruppe ausgegeben. Wird Ihnen ein europäischer IBAN für Ihre LLC angeboten, prüfen Sie, an welche Rechtsperson er gebunden ist und unter welchem Regime diese meldet.
- **Null-Steuer**: keine LLC-Struktur erreicht „null Steuern", wenn Sie in einem Land mit CFC-/Steuertransparenz- oder Einkünftezurechnungsregeln leben. Was Sie erreichen, ist **keine Doppelbesteuerung** und **korrekte Meldung am Wohnsitz**, keine Beseitigung.

<!-- exentax:legal-facts-v1 -->
## Rechts- und Verfahrensfakten

Die Meldepflichten gegenüber FinCEN und IRS haben sich recent years bewegt; aktueller Stand:

### Kernpunkte

- **BOI / Corporate Transparency Act: Ihre LLC ist NICHT verpflichtet (ein Wettbewerbsvorteil).** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC reicht KEINEN BOI Report ein**: eine Meldung weniger im Kalender, weniger Bürokratie und eine sauberere Struktur als je zuvor. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren. Der Regelstatus kann erneut wechseln: **wir überwachen FinCEN.gov bei jeder Einreichung** und, falls die Pflicht zurückkehrt, übernehmen wir sie ohne Aufpreis. Aktueller Stand auf [fincen.gov/boi](https://www.fincen.gov/boi) prüfbar.
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

Wyoming LLC + EIN + Mercury + Wise Business + Stripe + Lemon Squeezy + PayPal. Monatlich ~50-100$ bei Volumen &lt;100k$/Jahr.

### Was am häufigsten gefragt wird

**Mercury oder Wise für Stripe-Payout?** Mercury etwas schneller.

**Brex/Ramp für kleine LLC?** Typisch nicht unter 500k$/Jahr.

Bei Exentax bauen wir den kompletten Stack als Paket auf.
<!-- /exentax:execution-v2 -->

## Ihr nächster Schritt mit Exentax

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

## Der spezifische Fall des in Deutschland und Österreich Steuerpflichtigen

  Eine vollständige Banking-Stack-Lösung für eine US-LLC mit deutschem oder österreichischem wirtschaftlich Berechtigten muss vier funktionale Schichten parallel abdecken.

  **Erstens**: ein primäres US-Geschäftskonto bei Mercury oder Relay für die Verwahrung der Hauptliquidität, FDIC-Versicherung über die Sweep-Network-Programme und ACH-Empfänge von US-Kunden.

  **Zweitens**: ein Wise-Business-Konto in mehreren Währungen (USD, EUR, GBP) für günstige internationale Überweisungen mit Echtzeit-Mid-Market-Wechselkursen, ergänzt durch die Wise Card für operative Ausgaben.

  **Drittens**: eine Stripe-, PayPal- oder Adyen-Akquiringschnittstelle für Online-Zahlungseingänge mit anschließender Auszahlung an das Mercury- oder Relay-Konto.

  **Viertens**: eine FX- und Treasury-Komponente (Wise oder OFX) für die periodische Konvertierung von USD in EUR zur Distribution an den deutschen oder österreichischen Gesellschafter, mit Dokumentation des EZB-Referenzkurses zum Buchungstag (für die § 6 EStG-Bewertung).

  Für die deutsche Einkommensteuererklärung sind alle vier Schichten in der Anlage AUS und in der Buchhaltung der LLC abzubilden. Eine fortlaufende Aufzeichnung in DATEV erleichtert spätere Außenprüfungen erheblich. In Österreich gelten parallel die Vorschriften des § 124 BAO über die Buchführungspflicht und die Aufbewahrungsfrist von sieben Jahren nach § 132 BAO.

  ### Banking-Stack einer US-LLC: Konfiguration aus DACH-Sicht

  Für einen DACH-Resident, der eine US-LLC betreibt, ergibt sich in der Praxis ein **dreistufiger Banking-Stack**: (1) **Wise Business Europe SA** (registriert in Belgien unter BCE 0708.022.075, überwacht durch die **Nationalbank von Belgien** als E-Geld-Institut nach der PSD2-Richtlinie 2015/2366, in Belgien umgesetzt durch das Gesetz vom 11.03.2018), (2) **Mercury** als US-Operativkonto (über die Partnerbanken **Column N.A.** und **Choice Financial Group**, FDIC #14583), und (3) ein nationales DACH-Konto bei einer Hausbank für laufende Privatverbrauchsausgaben des Gesellschafters.

  **Deutsche Compliance-Pflichten für den Gesellschafter:**

  Jedes ausländische Konto mit Verfügungsberechtigung des deutschen Steuerpflichtigen unterliegt der **Mitteilungspflicht nach §138 Abs. 2 Nr. 4 AO** beim zuständigen Finanzamt — Frist: einen Monat nach Eröffnung. Die Höhe der Salden ist zudem im Rahmen der jährlichen Einkommensteuererklärung in der **Anlage AUS** offenzulegen, sofern Erträge daraus erzielt werden. Verstöße gegen §138 AO können nach §379 AO mit Geldbuße bis €25.000 sanktioniert werden, bei vorsätzlicher Verschleierung greift §370 AO Steuerhinterziehung (Freiheitsstrafe bis 5 Jahre, in besonders schweren Fällen nach §370 Abs. 3 AO bis 10 Jahre).

  **Geldwäscherechtliche Sorgfaltspflichten** der LLC und des Gesellschafters folgen aus dem **Geldwäschegesetz (GwG, Bekanntmachung vom 23.06.2017, BGBl. I S. 1822)**, insbesondere §10 GwG (allgemeine Sorgfaltspflichten) bei Transaktionen ab €15.000 und §15 GwG (verstärkte Sorgfaltspflichten) bei Hochrisikoländern oder PEP. Source-of-Funds-Nachweise sind ab dieser Schwelle zwingend; Mercury und Wise Business verlangen sie systematisch bei DACH-Antragstellern bereits ab USD 10.000 monatlichem Volumen.

  **Österreich:** Das **Kontenregister- und Konteneinschaugesetz (KontRegG, BGBl. I Nr. 116/2015)** verpflichtet alle inländischen Kreditinstitute zur Meldung der Kontoinhaber an das BMF; ausländische Konten sind über das **Meldungspflichtgesetz nach §109 BAO** offenzulegen. Das ZaDiG 2018 (Zahlungsdienstegesetz) und die FMA überwachen die heimische Seite des Stacks.

  **Schweiz:** Das **Bankengesetz (BankG, SR 952.0)** und das **Geldwäschereigesetz (GwG, SR 955.0)** regeln die schweizerische Compliance. Schweizerische Steuerresidenten unterliegen dem **automatischen Informationsaustausch (AIA-Gesetz, SR 653.1)** mit über 100 Partnerstaaten — die Eidgenössische Steuerverwaltung (ESTV) erhält jährlich Daten von Wise Europe SA und Mercury via Standard CRS. Der Steuerpflichtige muss alle ausländischen Konten in der jährlichen Steuererklärung im **Wertschriften- und Guthabenverzeichnis** auflisten (Art. 125 Abs. 1 lit. b DBG, SR 642.11).

  **Datenfluss FATCA und CRS für die LLC:**

  Mercury meldet als US-Bank im Rahmen des **FATCA-Abkommens IGA Modell 1 mit Deutschland (BGBl. II 2013 S. 1362)** Daten der LLC an die IRS, die diese an das **Bundeszentralamt für Steuern (BZSt)** übermittelt. Wise Business Europe SA als belgisches Institut meldet im Rahmen des **CRS via DAC2 (Richtlinie 2014/107/EU, in Belgien umgesetzt durch das Gesetz vom 16.12.2015)** an das BZSt. Beide Datenflüsse landen ab Steuerjahr 2024 in der **Risikomanagement-Datenbank des BZSt** und werden mit den Steuererklärungen des deutschen Gesellschafters automatisch abgeglichen.

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
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Wenn%20jemand%20eine%20LLC%20aus%20dem%20Ausland%20er%C3%B6ffnet%2C%20l%C3%A4uft%20das%20Bankgespr%C3%A4ch%20fast%20im%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

`;