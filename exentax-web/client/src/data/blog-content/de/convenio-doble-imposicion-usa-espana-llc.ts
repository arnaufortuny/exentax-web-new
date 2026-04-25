export default `Wenn jemand zum ersten Mal die Kombination "US-LLC" und "spanischer Steuerresident" sieht, ist die unmittelbare Frage immer dieselbe: **"und wo zahle ich Steuern?"**. Die Antwort ist klar: **in Spanien**, auf den Nettogewinn, dank des **Doppelbesteuerungsabkommens zwischen den USA und Spanien**. Die LLC wird nicht verwendet, um "nicht zu zahlen", sondern um **nicht zweimal zu zahlen** und um innerhalb des Legalen zu optimieren.

Dieser Leitfaden erklärt das Abkommen Schritt für Schritt, in klarer Sprache, angewandt auf den konkreten Fall einer LLC eines Nichtansässigen mit spanisch-ansässigem Eigentümer.

## Was es ist und warum es existiert

Ein **Doppelbesteuerungsabkommen (DBA)** ist eine bilaterale Vereinbarung zwischen zwei Ländern, um das Recht auf Besteuerung grenzüberschreitender Einkünfte aufzuteilen und zu vermeiden, dass dasselbe Einkommen zweimal besteuert wird. Ohne Abkommen würdest du in den USA zahlen (weil die LLC dort ist) **und** erneut in Spanien (weil du dort wohnst).

Um dies zu vermeiden, haben die USA und Spanien **1990** ein Abkommen zur Vermeidung der Doppelbesteuerung unterzeichnet, modernisiert durch ein **2013 unterzeichnetes Protokoll**, das am **27. November 2019** in Kraft trat (<a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> vom 23. Oktober 2019). Dieses Protokoll aktualisierte Quellensteuersätze, Informationsaustausch und Anti-Missbrauchs-Klauseln.

Schlüsselartikel zum Verständnis einer LLC mit spanischem Eigentümer:

- **Art. 4, Steuerlicher Wohnsitz.**
- **Art. 5, Betriebsstätte.**
- **Art. 7, Unternehmensgewinne.**
- **Art. 10, Dividenden.**
- **Art. 11, Zinsen.**
- **Art. 12, Lizenzgebühren (Royalties).**
- **Art. 17, Limitation of Benefits.**
- **Art. 24, Methoden zur Vermeidung der Doppelbesteuerung.**
### Wie es für Disregarded-Entity-LLCs funktioniert

Eine **Single-Member LLC** eines Nichtansässigen ist standardmäßig **Disregarded Entity**: für das <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> existiert sie nicht als separater Steuerzahler. Ihre Einnahmen und Ausgaben werden direkt dem einzigen Mitglied zugerechnet. **Pass-through Taxation**.

Für das Abkommen:

- Die LLC **ist kein US-Steuerresident**.
- Wer analysiert wird, ist **das Mitglied**: wenn es in Spanien wohnt, gilt das Abkommen für das spanisch-ansässige Mitglied.
- Die Nettogewinne der LLC werden **in Spanien** nach IRPF des Mitglieds besteuert.
- In den USA erfüllt die LLC nur Informationspflichten (Form 5472 + 1120 pro forma, BOI Report) sofern kein **ECI** vorliegt.

Die **<a href="https://petete.tributos.hacienda.gob.es" target="_blank" rel="noopener">DGT</a>** hat diesen Ansatz in verbindlichen Auskünften wie der **V0290-20** bestätigt und die US-LLC für spanische Zwecke als transparente Einheit oder im Pass-through-Regime qualifiziert.
### Wo man tatsächlich Steuern zahlt

Für den typischen Fall einer Dienstleistungs-LLC ohne Betriebsstätte in den USA und spanisch-ansässigem Eigentümer:

- **In den USA: 0 % Bundes-, 0 % Staatssteuer** (in NM/WY/DE für LLCs ohne lokale Tätigkeit). Nur Wartungskosten.
- **In Spanien: IRPF auf den Nettogewinn** der LLC, in die Jahressteuererklärung als Einkünfte aus wirtschaftlicher Tätigkeit im Pass-through-Regime integriert, nach persönlichem Grenzsatz (19 % bis 47 %).

Du **zahlst in Spanien, aber besser**: auf den Nettogewinn nach breiten Abzügen, ohne monatlichen autónomo-Beitrag, ohne autónomo-spezifische Vorauszahlungen.
### Vom Abkommen abgedeckte Einkommensarten

| Einkommensart | Ohne Abkommen (USA) | Mit Abkommen USA-Spanien |
|---------------|---------------------|---------------------------|
| Dienstleistungen außerhalb der USA | 30 % Quellensteuer | 0 % (Art. 7, ohne BS) |
| Royalties | 30 % | 0-10 % je nach Art (Art. 12) |
| Dividenden von US-Unternehmen | 30 % | 15 % / 10 % qualifiziert (Art. 10) |
| Bankzinsen | 30 % | 0 % in der Regel (Art. 11) |
| Veräußerungsgewinne auf US-Aktien | 30 % / variabel | Hauptsächliche Besteuerung in Spanien (Art. 13) |
| Renten | 30 % | Spezifische Regeln (Art. 20) |
### Spanisches Steuerresidenz-Zertifikat

Um das Abkommen vor dem US-Zahler zu aktivieren, musst du nachweisen, dass du **spanischer Steuerresident** bist. Die AEAT stellt ein **Steuerresidenz-Zertifikat für Abkommens-Zwecke** über das elektronische Portal aus. Gültigkeit **ein Jahr**. Stets aktuell halten, vor allem bei Brokern oder Zahlern mit komplexen Quellensteuern.

Bei den meisten Einnahmen über Stripe, PayPal, AdSense fragen sie nicht aktiv danach, weil das W-8BEN-E die Arbeit macht. Aber vor einem Audit oder Broker wie Interactive Brokers ist es der harte Beweis.
### Erforderliche Formulare

- **W-8BEN-E:** von deiner LLC vor jedem US-Zahler eingereicht. Siehe unseren <a href="/de/blog/w8-ben-und-w8-ben-e-der-vollstandige-leitfaden">vollständigen W-8BEN- und W-8BEN-E-Leitfaden</a>.
- **W-8BEN:** für nicht-residente natürliche Personen.
- **Form 1042-S:** vom US-Zahler ausgestellt, wenn Quellensteuer angewandt wurde.
- **Form 5472 + Form 1120 pro forma:** jährliche Informationserklärung der LLC beim IRS.
- **BOI Report:** beim <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>.
- **Modelo 100 (IRPF):** Jahressteuererklärung in Spanien.
- **Modelo 720/721:** falls Überschreitung von 50.000 € auf ausländischen Konten/Wertpapieren/Krypto.
- **Steuerresidenz-Zertifikat.**
## Praktische Fälle mit Zahlen

### Fall A, Software-Berater mit US- und EU-Kunden

- LLC fakturiert **120.000 USD/Jahr** für Dienstleistungen aus Spanien.
- LLC-Ausgaben: 30.000 USD.
- Nettogewinn: 90.000 USD ≈ 82.000 €.
- USA: **0 %** Quellensteuer. Wartung ≈ 2.000 €.
- Spanien: effektive IRPF ca. 35-40 % auf 82.000 € → ≈ 25.000-28.000 €.
- **Steuerlast insgesamt:** 27.000-30.000 € gegenüber 38.000-45.000 € für einen vergleichbaren autónomo.

### Fall B, Trader/Investor mit US-Dividenden via LLC

- LLC Inhaber eines Interactive-Brokers-Kontos.
- US-Dividenden: 10.000 USD/Jahr.
- Ohne Abkommen: 30 % → 3.000 USD an IRS.
- Mit W-8BEN-E + Abkommen: 15 % → 1.500 USD an IRS.
- In Spanien: in die Sparbasis aufnehmen und **Abzug für internationale Doppelbesteuerung** (Art. 80 LIRPF) anwenden.

### Fall C, Royalty für in den USA verkaufte Software

- LLC verkauft Lizenzen an US-Unternehmen: 50.000 USD/Jahr.
- Falls als Royalty qualifiziert (Art. 12): Quellensteuer kann **5 %** betragen.
- Falls als Dienstleistung/Verkauf einer Kopie qualifiziert: Art. 7 → **0 %**.
### Quellensteuern und wie man sie zurückbekommt

Wenn du in den USA Quellensteuern erleidest:

1. **Direkte Reklamation beim Zahler** wenn Fehler im Steuerjahr.
2. **Rückerstattungsantrag beim IRS:** über **Form 1040-NR** oder Verfahren im Zusammenhang mit dem **1042-S**. Langsam (12-18 Monate).

In Spanien werden tatsächlich in den USA gezahlte Quellensteuern innerhalb der Abkommensgrenze über den **Abzug für internationale Doppelbesteuerung (DDII)** in der IRPF angerechnet.
### Erklärung in Spanien: Modelo 100

In der **Jahreserklärung (Modelo 100)** integrierst du die Nettogewinne der LLC als **Einkünfte aus wirtschaftlicher Tätigkeit** im Pass-through-Regime:

1. USD in EUR umrechnen mit dem jährlichen Durchschnittskurs oder dem des Zahlungszeitpunkts, konsistentes Kriterium.
2. Gesamteinnahmen und abzugsfähige Ausgaben berechnen.
3. Nettogewinn zuweisen.
4. **Abzug für internationale Doppelbesteuerung** anwenden.
5. **Modelo 720/721** einreichen falls Schwellen überschritten.
6. Gesamte Dokumentation aufbewahren.
### Warum du einen spanischen Steuerberater brauchst

Eine in den USA gut konstituierte LLC ist nur die Hälfte der Arbeit. Die andere Hälfte ist die **korrekte Integration in deine spanische IRPF**:

- Korrekte Qualifikation des Einkommens.
- Anwendung des Abkommens und des Abzugs.
- Wahl der Zurechnungsmethode.
- Einhaltung von Modelo 720/721.
- Dokumentation der abzugsfähigen Ausgaben.

Ein spanischer Steuerberater, der internationale Strukturen mit LLCs versteht, ist **Teil des kompletten Setups**. Bei Exentax decken wir die US-Seite ab und koordinieren mit deinem spanischen Berater oder empfehlen einen.

> Jeder Fall ist individuell. Die DGT-Positionen können sich entwickeln und die Abkommensprotokolle werden periodisch aktualisiert. Dieser Leitfaden ist informativ, er ersetzt nicht die individuelle Analyse durch einen qualifizierten Fachmann.
### Zusammenfassend

- USA und Spanien haben ein 1990 unterzeichnetes und 2019 modernisiertes Abkommen.
- Für eine Disregarded-Entity-LLC mit spanisch-ansässigem Eigentümer werden Unternehmensgewinne **in Spanien** besteuert, ohne US-Quellensteuer wenn keine Betriebsstätte vorliegt.
- Dividenden, Zinsen und Royalties haben reduzierte Sätze.
- Das **W-8BEN-E** ist das operative Werkzeug.
- US-Quellensteuern werden in Spanien über den Abzug ausgeglichen.
- Komplettes Setup: **Exentax + spanischer Steuerberater**.

Wenn du deinen Fall mit konkreten Zahlen prüfen möchtest, **buche eine kostenlose 30-Minuten-Beratung** mit Exentax.

Zur Vertiefung lies auch <a href="/de/blog/llc-als-alternative-zum-autonomo-status-in-spanien">LLC als Alternative zum autónomo-Status in Spanien</a> und <a href="/de/blog/w8-ben-und-w8-ben-e-der-vollstandige-leitfaden">Vollständiger Leitfaden zu den Formularen W8-BEN und W8-BEN-E</a>.
## Steuer-Compliance in deinem Land: CFC, Hinzurechnungsbesteuerung und Einkünftezurechnung

Eine US-LLC ist ein legales und international anerkanntes Instrument. Compliance endet aber nicht mit der Gründung: Als Eigentümer mit Steuerwohnsitz in einem anderen Land hat deine örtliche Finanzverwaltung weiterhin das Recht, die Erträge der LLC zu besteuern. Entscheidend ist, **unter welchem Regime**.

### Nach Rechtsordnung

- **Spanien (LIRPF/LIS).** Eine operative *Single-Member Disregarded* LLC (echte Dienstleistungen, ohne erhebliche Passivität) wird in der Regel nach **Einkünftezurechnung (Art. 87 LIRPF)** behandelt: die Nettogewinne werden dem Gesellschafter im Erzielungsjahr zugerechnet und in die allgemeine IRPF-Bemessungsgrundlage integriert. Optiert die LLC dagegen zur Besteuerung als *Corporation* (Form 8832) und steht sie unter Kontrolle eines spanischen Residenten mit überwiegend passiven Einkünften, kann die **internationale Hinzurechnungsbesteuerung (Art. 91 LIRPF für natürliche Personen, Art. 100 LIS für Gesellschaften)** greifen. Die Wahl ist nicht optional: sie hängt von der wirtschaftlichen Substanz ab, nicht vom Namen.
- **Meldepflichten.** US-Bankkonten mit Durchschnitts- oder Endbestand >50.000 € im Geschäftsjahr: **Modelo 720** (Gesetz 5/2022 nach EuGH-Urteil C-788/19 vom 27.01.2022, Sanktionen jetzt im allgemeinen LGT-Regime). Verbundene Geschäfte mit der LLC und repatriierte Dividenden: **Modelo 232**. In den USA verwahrte Kryptowerte: **Modelo 721**.
- **DBA Spanien–USA.** Das Abkommen (BOE 22.12.1990, Protokoll in Kraft seit 27.11.2019) regelt die Doppelbesteuerung von Dividenden, Zinsen und Lizenzgebühren. Eine LLC ohne Betriebsstätte in Spanien begründet für sich genommen keine Betriebsstätte des Gesellschafters, aber die effektive Geschäftsleitung kann eine entstehen lassen, wenn die gesamte Verwaltung von spanischem Gebiet aus erfolgt.
- **Mexiko, Kolumbien, Argentinien und weitere LATAM-Länder.** Jede Jurisdiktion hat ein eigenes CFC-Regime (Mexiko: Refipres; Argentinien: passive Auslandseinkünfte; Chile: Art. 41 G LIR). Gemeinsamer Grundsatz: Die in der LLC einbehaltenen Gewinne gelten als dem Gesellschafter zugeflossen, wenn die Gesellschaft als transparent oder kontrolliert eingestuft wird.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Kostenlose Beratung, unverbindlich</a>
<!-- /exentax:calc-cta-v1 -->

Praktische Regel: eine operative LLC mit Substanz, korrekt im Wohnsitzstaat erklärt, ist **legitime Steuerplanung**. Eine LLC, die zur Verschleierung von Einkünften, zur Vortäuschung der Nichtansässigkeit oder zur unbegründeten Verlagerung passiver Einkünfte dient, fällt unter **Art. 15 LGT (Missbrauch)** oder im schlimmsten Fall unter **Art. 16 LGT (Simulation)**. Den Unterschied machen die Tatsachen, nicht das Papier.
Bei Exentax richten wir die Struktur so ein, dass sie ins erste Szenario passt, und dokumentieren jeden Schritt, damit deine örtliche Erklärung im Falle einer Prüfung verteidigt werden kann.

<!-- exentax:legal-facts-v1 -->
## Rechts- und Verfahrensfakten

Die Meldepflichten gegenüber FinCEN und IRS haben sich recent years bewegt; aktueller Stand:

### Kernpunkte

- **BOI / Corporate Transparency Act: Ihre LLC ist NICHT verpflichtet (ein Wettbewerbsvorteil).** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC reicht KEINEN BOI Report ein**: eine Meldung weniger im Kalender, weniger Bürokratie und eine sauberere Struktur als je zuvor. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren. Der Regelstatus kann erneut wechseln: **wir überwachen FinCEN.gov bei jeder Einreichung** und, falls die Pflicht zurückkehrt, übernehmen wir sie ohne Aufpreis. Aktueller Stand auf [fincen.gov/boi](https://www.fincen.gov/boi) prüfbar.
- **Form 5472 + Pro-forma-1120.** Für eine **Single-Member LLC im Eigentum eines Nicht-Residenten** behandeln die Schlussregelungen Treas. Reg. §1.6038A-1 (seit 2017 in Kraft) die LLC für 5472-Zwecke als Corporation. Verfahren: **Pro-forma Form 1120** (nur Kopf: Name, Adresse, EIN, Steuerjahr) mit **Form 5472 als Anlage**. Einreichung **per Einschreiben oder Fax an das IRS Service Center Ogden, Utah**, **keine E-Einreichung über das Standard-MeF**. Frist: **15. April**; Verlängerung über **Form 7004** bis **15. Oktober**. **Sanktion: 25.000 USD pro Formular und Jahr, plus 25.000 USD je weitere 30 Tage** Nichteinreichung nach IRS-Mitteilung.
- **Substantielles Form 1120.** Nur wenn die LLC per Check-the-Box-Wahl zur C-Corp optiert hat (Form 8832): dann 21 % Bundessteuer und ein substantielles 1120. Eine Standard-disregarded LLC **reicht kein substantielles 1120 ein und zahlt keine bundesstaatliche Körperschaftsteuer**.
- **EIN und Benachrichtigung.** Ohne EIN ist weder 5472 noch BOI einreichbar. Der IRS warnt nicht vor Sanktionen; man bemerkt es, wenn die EIN gesperrt oder eine spätere Einreichung abgelehnt wird.
## Zusammenfassung

Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben - und in dieser Reihenfolge gehen wir vor.

## Steuerliche Compliance in Ihrem Land: CFC, TFI und Einkünftezurechnung

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

## Bank- und Steuerfakten, die es zu präzisieren gilt

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

## Rechtliche und verfahrenstechnische Fakten

## Referenzen: Rechtsrahmen und Regulierung

## Sprechen wir über Ihre Struktur

Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben - und in dieser Reihenfolge gehen wir vor.
## Wie es bei Disregarded-Entity-LLCs funktioniert

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

<!-- exentax:execution-v2 -->
## Wie das DBA USA-Spanien auf Ihre LLC angewendet wird, Klausel für Klausel

Das 1990 unterzeichnete und durch das seit 2019 geltende Protokoll geänderte DBA Spanien-USA (BOE 23. Oktober 2019) teilt das Besteuerungsrecht zwischen beiden Ländern. Für eine SMLLC in Einkünftezurechnung zählen vier Artikel wirklich. Wir erklären sie nach Wirkung geordnet.

- **Artikel 7 - Unternehmensgewinne.** Ist die LLC transparent und begründet keine US-Betriebsstätte, werden die Gewinne ausschließlich in Spanien besteuert, in Ihrer IRPF als gewerbliche Einkünfte. Diese Logik führt dazu, dass eine SMLLC typischerweise null Bundessteuer zahlt und das gesamte Gewicht auf der Residenz liegt.
- **Artikel 14 (Protokoll 2019) - Selbständige persönliche Dienste.** Nach dem Protokoll verstärkt: Für selbständige Profis mit Wohnsitz Spanien ohne US-Festbasis werden Honorare ausschließlich in Spanien besteuert. Kombiniert mit Art. 7 schirmt es den üblichen Berater- oder Entwickler-Betrieb ab.
- **Artikel 23 - Beseitigung der Doppelbesteuerung.** Erlaubt Anrechnung der in den USA gezahlten Steuer (Bund und Staat) in Spanien, gedeckelt auf die spanische Steuerschuld auf dieselbe Einkunft. Bei null Bundessteuer ist die Anrechnung null, die reale Doppelbesteuerung auch.
- **Artikel 25 (Protokoll 2019) - Verständigungsverfahren (MAP).** Wenn AEAT und IRS dieselbe Einkunft abweichend einordnen, ermöglicht MAP eine Lösung per Behördenabkommen in ca. 24 Monaten. Nützlich bei abweichendem Bescheid; die meisten Fälle erreichen ihn nicht, da DGT-Doktrin klar ist.

### Was wir am häufigsten gefragt werden

**Brauche ich Form W-8BEN-E für meine LLC?** Ja, wenn ein US-Klient Nichtresidenten-Zertifizierung verlangt. Die SMLLC mit nichtresidentem Gesellschafter zertifiziert als Pass-Through und der Gesellschafter legt eine persönliche W-8BEN bei. Ohne diese Unterlagen behalten US-Zahler standardmäßig 30 % ein.

**Deckt das DBA Dividenden und Veräußerungsgewinne?** Ja, mit unterschiedlichen Höchstsätzen (15 % Dividenden, 0-21 % Zinsen je nach Fall, Veräußerungsgewinne i. d. R. nur in Residenz besteuert). Bei einer SMLLC, die an den Gesellschafter ausschüttet, wird die "Dividende" wegen Transparenz ignoriert und alles als Unternehmensgewinn nach Art. 7 zugerechnet.

Bei Exentax mappen wir jeden Fluss Ihrer LLC gegen den anwendbaren DBA-Artikel, bereiten die W-8-Dokumentation vor und konzipieren die IRPF-Erklärung so, dass die spanische Erklärung mit der bundesseitigen Behandlung konsistent ist.
<!-- /exentax:execution-v2 -->

## Erforderliche Formulare

Unsere Haltung hier ist bewusst konservativ: wir optimieren für das, was eine Prüfung übersteht, nicht für die aggressivste Schlagzahl. Die folgenden Punkte sind diejenigen, die wir schriftlich verteidigen.

## Der spezifische Fall des in Deutschland und Österreich Steuerpflichtigen mit Bezug zum DBA Spanien-USA

  Auch wenn das **DBA Spanien-USA** vom 22. Februar 1990 (modifizierendes Protokoll vom 14. Januar 2013, in Kraft seit 27. November 2019) im Zentrum des Artikels steht, ist das **DBA Deutschland-USA** vom 29. August 1989 (Änderungsprotokoll vom 1. Juni 2006) in seiner Struktur und in der Auslegung der LLC-Behandlung eng verwandt.

  Beide Abkommen folgen dem OECD-Musterabkommen und enthalten in Artikel 28 (Spanien) bzw. Artikel 28 (Deutschland) **Limitation-on-Benefits-Klauseln (LoB)**. Für deutsche Steuerpflichtige mit US-LLC-Beteiligung ist die spanische Doktrin (insbesondere die Resolution **TEAC 6555/2017** vom 19. Februar 2020) ein wichtiger Vergleichsmaßstab, weil Deutschland und Spanien ähnliche Probleme mit der Hybrid-Qualifizierung von Disregarded-Entity-LLCs haben. Das deutsche BMF-Schreiben vom 26. September 2014 (BStBl. I 2014, 1258) zur LLC-Klassifizierung folgt der gleichen Linie.

  Für Österreich gilt das **DBA Österreich-USA** vom 31. Mai 1996 (BGBl. III Nr. 6/1998), dessen Artikel 16 ebenfalls eine LoB-Klausel enthält.

  ### Praktische Hinweise für die parallele Anwendung des DBA Deutschland-USA

  Die deutsche Verwaltungspraxis behandelt eine US-LLC, die in den USA als *disregarded entity* steuerlich transparent ist, im Rahmen der "Subject-to-Tax-Klausel" des Artikels 1 Absatz 7 DBA D-USA als nicht abkommensberechtigt im eigenen Namen. Stattdessen wird der Schutz des Abkommens dem Alleingesellschafter persönlich gewährt (BFH-Urteil **I R 15/02 vom 20. August 2008**, BStBl. II 2009, 26). Dies hat Folgen für die Quellensteuerermäßigung auf Dividenden, Zinsen und Lizenzen aus US-Quellen: Der deutsche Gesellschafter muss persönlich das Formular W-8BEN einreichen, nicht die LLC.

<!-- exentax:cta-v1 -->
<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Wenn%20jemand%20zum%20ersten%20Mal%20die%20Kombination%20US-LLC%20und%20spanischer%20Steuerreside%E2%80%A6%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie es lieber persönlich besprechen möchten, <a href="/de/buchen">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.
<!-- /exentax:cta-conv-v1 -->

Buchen Sie eine kostenlose 30-minütige Beratung. Wir prüfen Ihren konkreten Fall und sagen Ihnen, was wirklich sinnvoll ist. <a href="/de/buchen">Kostenlose Beratung buchen</a>.
<!-- /exentax:cta-v1 -->
`;
