export default `Wenn du oder deine LLC Geld aus den USA erhalten (Stripe, PayPal, Affiliate-Plattformen, AdSense, Dividenden, Royalties, Broker...), kannst du nach einem **W-8BEN** oder **W-8BEN-E** gefragt werden. Nicht jede Plattform verlangt ihn: Business-Banking wie Mercury, Relay oder Wise fordert ihn nur an, wenn eine konkrete Compliance-Prüfung das verlangt, während Broker wie Interactive Brokers ihn von Tag eins zwingend verlangen. Wo er verlangt wird und du ihn nicht (oder falsch) ausfüllst, ist das Ergebnis immer dasselbe: der US-Zahler wendet eine **Quellensteuer von 30 %** auf das, was er dir schuldet, "vorsichtshalber" an. 30 %, die später sehr schwer zurückzuholen sind.

Dieser Leitfaden ist die vollständige Version, auf Deutsch, ohne unnötigen Fachjargon aber rigoros.

## Was die W-8 sind und warum sie existieren

Die Formulare der **W-8-Serie** sind <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>-Dokumente, mit denen eine **nicht-US-amerikanische** Person oder Entität dem Zahler erklärt, dass sie **kein US-Steuerzahler ist** und gegebenenfalls **ein Doppelbesteuerungsabkommen geltend macht**, um die Standard-Quellensteuer zu reduzieren oder zu eliminieren.

Die allgemeine Regel in den USA ist, dass jede US-Quellzahlung an eine ausländische Person oder Entität einer **30 %-Quellensteuer** unterliegt, sofern der Empfänger nicht das Gegenteil nachweist. Dieser Nachweis erfolgt mit einem W-8.

Die meistgenutzten:

- **W-8BEN:** für **nicht-US-amerikanische natürliche Personen**.
- **W-8BEN-E:** für **nicht-US-amerikanische Entitäten** (deine LLC, SL, GmbH…).

Es gibt weitere (W-8ECI, W-8IMY, W-8EXP) für spezifischere Fälle.
### Hauptunterschied zwischen W-8BEN und W-8BEN-E

| | W-8BEN | W-8BEN-E |
|--|--------|----------|
| Wer unterzeichnet | Nicht-US-Steuerresident (natürliche Person) | Nicht-US-Entität |
| Schlüsseldaten | Name, Land, Adresse, Geburtsdatum, Steuer-ID | Firmenname, Gründungsland, EIN/GIIN, Entitätstyp, FATCA-Status |
| Seiten | 1 | 8 (du füllst nur 2-3 aus) |
| Abkommen | Ja, Teil II | Ja, Teil III |
| Gültigkeit | 3 Jahre | 3 Jahre |

Eine **Single-Member LLC eines Nichtansässigen** ist ein interessanter Fall: obwohl das IRS sie als Disregarded Entity behandelt, **wird normalerweise das W-8BEN-E** im Namen der LLC eingereicht.
## Wofür sie in der Praxis dienen

Um die **30 %-Quellensteuer** auf US-Quellzahlungen zu vermeiden. Das Abkommen zwischen den **USA und Spanien** reduziert diese Quellensteuer auf:

- **0 %** auf die meisten **Unternehmensgewinne** (Dienstleistungen außerhalb der USA ohne Betriebsstätte).
- **15 %** auf **Dividenden** US-amerikanischer Unternehmen (10 % bei qualifizierten Beteiligungen).
- **0 %** auf **Zinsen** im Allgemeinen.
- **0-10 %** auf **Royalties** je nach Art.

Ohne unterzeichnetes W-8 hält der Zahler 30 % zurück. Mit einem korrekt ausgefüllten W-8 erhältst du Zahlungen vollständig (häufigster Fall für Dienstleistungen).
### Wer sie einreichen muss

Das Formular wird von **dem, der das Geld erhält**, eingereicht:

- Du als **natürliche Person** wenn du direkt empfängst: **W-8BEN**.
- Deine **LLC** oder andere Entität wenn Zahlungen auf das Konto der Entität gehen: **W-8BEN-E**.
### Wann einreichen

- Bei **Eröffnung jedes Kontos** bei einer US-Bank, Fintech oder Broker.
- Bei **Anmeldung deines Geschäfts** auf einer Zahlungsplattform.
- Wenn ein **US-Kunde** vor der ersten Zahlung danach fragt.
- Bei der **Erneuerung** alle 3 Jahre.
### Wo sie abgegeben werden

Im Gegensatz zu anderen IRS-Formularen wird **das W-8 nicht an das IRS gesendet**. Es wird dem **Zahler** übergeben, der es archiviert. Plattformen, die das W-8 standardmäßig verlangen: **Interactive Brokers und andere Broker, Stripe, PayPal Business, AdSense, YouTube, Twitch, Amazon KDP, App Store Connect**. Dagegen verlangen **Mercury, Relay, Slash und Wise Business** das W-8 nicht für den normalen Betrieb; sie fordern es nur an, wenn eine punktuelle Compliance-Prüfung das verlangt.
### Wie man ein W-8BEN Schritt für Schritt ausfüllt (natürliche Person)

Eine Seite, drei Teile.

**Teil I, Identifikation des Begünstigten:**

1. **Name of individual:** dein voller Name laut Reisepass.
2. **Country of citizenship:** deine Staatsangehörigkeit.
3. **Permanent residence address:** Adresse deines tatsächlichen steuerlichen Wohnsitzes, kein PO Box, keine US-Adresse.
4. **Mailing address:** nur falls abweichend.
5. **US TIN (SSN/ITIN):** nur falls vorhanden. Die meisten lassen leer.
6. **Foreign tax identifying number:** deine NIF/NIE.
7. **Reference number:** selten genutzt.
8. **Date of birth:** Format MM-DD-YYYY.

**Teil II, Abkommen:**

9. Land mit Abkommen: "Spain" wenn spanischer Steuerresident.
10. Spezielles Detail: nur wenn ein bestimmter reduzierter Satz beansprucht wird.

**Teil III, Zertifizierung:** unterschreiben, Datum, Name.
## Wie man ein W-8BEN-E Schritt für Schritt ausfüllt (deine LLC)

Länger (8 Seiten), aber du füllst nur das aus, was zutrifft. Für eine **Single-Member LLC eines Nichtansässigen**:

**Teil I, Identifikation der Entität:**

1. **Name of organization:** exakter Firmenname der LLC.
2. **Country of incorporation:** "United States".
3. **Disregarded entity name:** leer lassen.
4. **Chapter 3 status:** markiere **"Corporation"** wenn die LLC eine Election gemacht hat; in den meisten Fällen von Nichtansässigen mit Single-Member ist die praktische Option, die Entität zu identifizieren und **Teil III** des Abkommens auszufüllen. Im Zweifel "Corporation".
5. **Chapter 4 status (FATCA):** markiere **"Active NFFE"** wenn die LLC Dienstleistungen oder Produkte verkauft.
6. **Permanent residence address:** registrierte US-Adresse der LLC.
7. **Mailing address:** optional.
8. **US TIN (EIN):** EIN deiner LLC.
9. **GIIN:** leer lassen.
10. **Foreign TIN:** Steuer-ID des wirtschaftlichen Endbegünstigten.

**Teil III, Abkommen:** markiere, dass der wirtschaftliche Eigentümer Steuerresident in **Spain** ist, gib an, dass die **Limitation of Benefits** (Art. 17) erfüllt ist und nenne den anwendbaren Artikel und reduzierten Satz.

**Teil XXV, Active NFFE:** Erklärung, dass mehr als 50 % der Einkünfte aktiv sind.

**Teil XXX, Zertifizierung:** Unterschrift, Name, Funktion, Datum.
### Häufige Fehler, die Geld kosten

1. **US-Adresse als ständigen Wohnsitz angeben.**
2. **W-8BEN statt W-8BEN-E verwenden** oder umgekehrt.
3. **Nicht unterschreiben.**
4. **Foreign TIN vergessen** wenn erforderlich.
5. **Chapter 4 Status nicht markieren.**
6. **Einen nicht zustehenden Abkommenssatz beanspruchen.**
7. **Nicht nach 3 Jahren erneuern.**
### Gültigkeit und Erneuerung

Das unterzeichnete W-8 ist **3 vollständige Kalenderjahre** ab Unterschriftsdatum gültig. Bei wesentlichen Datenänderungen reiche ein neues ein. Erneuerung im Kalender vermerken.
### Verbindung zum US-Spanien-Abkommen

Das **Doppelbesteuerungsabkommen zwischen dem Königreich Spanien und den USA**, 1990 unterzeichnet und durch das Protokoll von 2013 modernisiert (in Kraft seit 2019), ist die Rechtsgrundlage:

- **Unternehmensgewinne (Art. 7):** ohne Betriebsstätte, Besteuerung nur in Spanien. **0 % Quellensteuer** für Dienstleistungen außerhalb der USA.
- **Dividenden (Art. 10):** 15 % (10 % qualifizierte Beteiligungen).
- **Zinsen (Art. 11):** in der Regel 0 %.
- **Royalties (Art. 12):** zwischen 0 % und 10 %.

Um zu verstehen, wie das mit deiner LLC zusammenpasst, lies auch unseren <a href="/de/blog/doppelbesteuerungsabkommen-usa-spanien-fur-llcs">Leitfaden zum US-Spanien-Abkommen für LLCs</a>.
### Praktische Fälle nach Plattform

- **Stripe:** integriertes W-8BEN-E. Ergebnis: 0 % Quellensteuer auf Dienstleistungen.
- **PayPal Business:** bei Verifizierung des Business-Kontos.
- **Mercury / Relay / Slash:** beim Standard-Onboarding deiner LLC **nicht erforderlich**. Nur wenn eine punktuelle Compliance-Prüfung es verlangt; ohne entsprechende Anfrage musst du keines unterschreiben.
- **Wise Business:** dasselbe Kriterium wie Mercury / Relay: nur wenn ausdrücklich angefordert. Kein Standardschritt bei der Anmeldung deiner LLC.
- **Interactive Brokers:** wendet 15 % auf US-Dividenden statt 30 % an.
- **AdSense / YouTube / Amazon KDP / App Store / Twitch:** eigener Assistent.
### Wie Exentax hilft

Bei Exentax bereiten wir die W-8BEN-E deiner LLC dort vor, wo sie wirklich verlangt werden: Stripe, IBKR und andere Broker, Affiliate-Plattformen, AdSense / YouTube / Amazon KDP und jeder US-Zahler, der eines anfordert. Bei Mercury, Relay, Slash oder Wise unterschreiben wir nur, wenn die Plattform ausdrücklich danach fragt. Wenn bereits eine 30%-Quellensteuer wegen eines fehlerhaften W-8 angewendet wurde, prüfen wir, ob eine Erstattung über 1042-S möglich ist, obwohl es immer viel günstiger ist, von Anfang an alles richtig zu machen.

> Jeder Fall ist individuell und die Steuergesetzgebung kann sich ändern; diese Formulare und FATCA-Kriterien werden periodisch aktualisiert.

Wenn du möchtest, dass wir deine Situation überprüfen, buche deine kostenlose Beratung mit Exentax.

Zur Vertiefung lies auch <a href="/de/blog/melden-us-bankkonten-an-ihre-heimische-steuerbehorde-die">Melden US-Bankkonten an das spanische Finanzamt?</a> und <a href="/de/blog/llc-als-alternative-zum-autonomo-status-in-spanien">LLC als Alternative zum autónomo-Status in Spanien</a>.
## Steuer-Compliance in deinem Land: CFC, Hinzurechnungsbesteuerung und Einkünftezurechnung

Eine US-LLC ist ein legales und international anerkanntes Instrument. Compliance endet aber nicht mit der Gründung: Als Eigentümer mit Steuerwohnsitz in einem anderen Land hat deine örtliche Finanzverwaltung weiterhin das Recht, die Erträge der LLC zu besteuern. Entscheidend ist, **unter welchem Regime**.

### Nach Rechtsordnung

- **Spanien (LIRPF/LIS).** Eine operative *Single-Member Disregarded* LLC (echte Dienstleistungen, ohne erhebliche Passivität) wird in der Regel nach **Einkünftezurechnung (Art. 87 LIRPF)** behandelt: die Nettogewinne werden dem Gesellschafter im Erzielungsjahr zugerechnet und in die allgemeine IRPF-Bemessungsgrundlage integriert. Optiert die LLC dagegen zur Besteuerung als *Corporation* (Form 8832) und steht sie unter Kontrolle eines spanischen Residenten mit überwiegend passiven Einkünften, kann die **internationale Hinzurechnungsbesteuerung (Art. 91 LIRPF für natürliche Personen, Art. 100 LIS für Gesellschaften)** greifen. Die Wahl ist nicht optional: sie hängt von der wirtschaftlichen Substanz ab, nicht vom Namen.
- **Meldepflichten.** US-Bankkonten mit Durchschnitts- oder Endbestand >50.000 € im Geschäftsjahr: **Modelo 720** (Gesetz 5/2022 nach EuGH-Urteil C-788/19 vom 27.01.2022, Sanktionen jetzt im allgemeinen LGT-Regime). Verbundene Geschäfte mit der LLC und repatriierte Dividenden: **Modelo 232**. In den USA verwahrte Kryptowerte: **Modelo 721**.
- **DBA Spanien–USA.** Das Abkommen (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> 22.12.1990, Protokoll in Kraft seit 27.11.2019) regelt die Doppelbesteuerung von Dividenden, Zinsen und Lizenzgebühren. Eine LLC ohne Betriebsstätte in Spanien begründet für sich genommen keine Betriebsstätte des Gesellschafters, aber die effektive Geschäftsleitung kann eine entstehen lassen, wenn die gesamte Verwaltung von spanischem Gebiet aus erfolgt.
- **Mexiko, Kolumbien, Argentinien und weitere LATAM-Länder.** Jede Jurisdiktion hat ein eigenes CFC-Regime (Mexiko: Refipres; Argentinien: passive Auslandseinkünfte; Chile: Art. 41 G LIR). Gemeinsamer Grundsatz: Die in der LLC einbehaltenen Gewinne gelten als dem Gesellschafter zugeflossen, wenn die Gesellschaft als transparent oder kontrolliert eingestuft wird.

Praktische Regel: eine operative LLC mit Substanz, korrekt im Wohnsitzstaat erklärt, ist **legitime Steuerplanung**. Eine LLC, die zur Verschleierung von Einkünften, zur Vortäuschung der Nichtansässigkeit oder zur unbegründeten Verlagerung passiver Einkünfte dient, fällt unter **Art. 15 LGT (Missbrauch)** oder im schlimmsten Fall unter **Art. 16 LGT (Simulation)**. Den Unterschied machen die Tatsachen, nicht das Papier.

<!-- exentax:calc-cta-v1 -->
> **Rechnen Sie Ihren Fall durch.** Der <a href="/de#calculadora">Exentax-Steuerrechner</a> vergleicht Ihre aktuelle Steuerlast mit dem, was Sie zahlen würden, wenn Sie eine US-LLC korrekt in Ihrem Wohnsitzland deklarieren.
<!-- /exentax:calc-cta-v1 -->

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
## W-8BEN und W-8BEN-E: kompletter Leitfaden zur Unterscheidung und Vermeidung 30% Strafe

Das W-8 ist das wichtigste Dokument für Nichtansässige bei jedem US-Payer. Ohne: 30% Standardeinbehalt.

- **W-8BEN: für Einzelpersonen.** SIE unterschreiben als Person. Nützlich für Royalties, Zinsen, US-source-Dividenden. 3 Jahre Gültigkeit.
- **W-8BEN-E: für Entitäten, Ihre LLC.** Vom autorisierten Unterzeichner. Identifiziert LLC, FATCA-Klassifizierung (single-member disregarded = kritisch), Beneficial Owner, Treaty-Claim. 3 Jahre.
- **Häufigster Fehler: LLC als Corporation markieren statt disregarded.** Single-member LLC ohne C/S-Corp-Wahl ist „disregarded entity". Bei Corporation-Markierung: 30% statt 15% (DE-US Dividenden) oder 0%.
- **Treaty Benefits.** Teil III: Wohnsitzland mit Bescheinigung, Vertragsartikel zitieren (Artikel 10 Dividenden, Artikel 11 Zinsen).

### Was am häufigsten gefragt wird

**Sende ich W-8BEN-E an IRS?** Nein. An Payer, nicht IRS.

**Disregarded LLC: wer reklamiert das Abkommen?** Beneficial Owner nach seinem Land.

Bei Exentax bereiten wir korrekte W-8BEN-E vor.
<!-- /exentax:execution-v2 -->

## Rechtliche und verfahrenstechnische Fakten

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Rufen Sie uns unter <a href="tel:+34614916910">+34 614 916 910</a> an oder schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Wenn%20du%20oder%20deine%20LLC%20Geld%20aus%20den%20USA%20erhalten%20(Stripe%2C%20PayPal%2C%20Affiliate-P%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->

<!-- exentax:review-anchor-v1 -->
<aside data-testid="review-anchor" class="text-xs text-muted-foreground border-t pt-4 mt-8">
<p><strong>Redaktionelle Überprüfung ausstehend</strong> — Die folgenden Verweise erfordern eine manuelle Prüfung anhand der offiziellen aktuellen Quelle. Wenn Sie eine Abweichung feststellen, schreiben Sie der Redaktion — wir korrigieren innerhalb von 24 Stunden.</p>
<ul class="list-disc pl-5 space-y-1">
<li><span class="font-mono">30%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…mo: el pagador estadounidense te aplica una **retención del 30%** sobre lo que te debe, &quot;p…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">0%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…entes con muchos otros países) reduce esa retención a: - **0%** sobre la mayoría de **rent…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">15%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…desde fuera de EE.UU. sin establecimiento permanente). - **15%** sobre **dividendos** de e…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">10%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…- **15%** sobre **dividendos** de empresas estadounidenses (10% en algunos casos). - **0%*…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
<li><span class="font-mono">50%</span> <span class="opacity-70">(Kennzahl)</span> <span class="text-xs italic">— «…arte XXV, Active NFFE:** una casilla declarando que más del 50% de tus ingresos son activo…»</span> <strong>[NICHT VERIFIZIERT]</strong></li>
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
