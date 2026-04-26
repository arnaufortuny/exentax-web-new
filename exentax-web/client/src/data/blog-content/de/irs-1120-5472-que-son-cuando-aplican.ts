export default `Zwei <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a>-Formulare sorgen für mehr Verwirrung als alle anderen unter LLC-Inhabern: **Form 1120** und **Form 5472**. Die meisten LLC-Inhaber hören die beiden zusammen genannt, verstehen nicht ganz, was jedes ist, und, vor allem, **wissen nicht, wann sie tatsächlich auf ihren Fall zutreffen**.

Dieser Artikel ist nicht der x-te Schritt-für-Schritt-Leitfaden. Wenn Sie die Einreichungsprozedur wollen, haben Sie bereits unseren <a href="/de/blog/form-5472-was-es-ist-wer-es-einreichen-muss-und-wie-man-es">operativen Form-5472-Leitfaden</a>. Hier erklären wir, was die beiden Formulare **wirklich** sind, wie sie zusammenhängen, wann sie nach Profil zutreffen und welche Fehler Geld kosten.

## Was Form 1120 wirklich ist

Das **Form 1120, U.S. Corporation Income Tax Return** ist die föderale Körperschaftsteuererklärung für US-Corporations. Im "normalen" Gebrauch reicht eine **C-Corporation** es ein, um ihre Gewinnsteuer zu liquidieren (21 % föderal aktuell, plus Bundesstaatensteuern).

Erste Nuance, die kaum jemand erklärt: Form 1120 wird auch **leer, als Umschlag** genutzt, damit bestimmte LLCs Informationspflichten erfüllen. Das ist das **pro-forma 1120**, dazu unten mehr.

Schnellkarte:
- **Operative C-Corporation** → Form 1120 mit echten Zahlen.
- **Single-Member LLC eines Nicht-Residenten** → **pro-forma Form 1120** (die meisten Felder leer) mit angehängtem Form 5472.
- **Single-Member LLC eines US-Residenten** → in der Regel kein 1120; Einkünfte in Schedule C des persönlichen 1040.
- **Multi-Member LLC** → standardmäßig kein 1120; reicht Form 1065 (Partnership) ein, sofern keine Wahl zur Körperschaftsbesteuerung.
## Was Form 5472 wirklich ist

Das **Form 5472, Information Return of a 25% Foreign-Owned U.S. Corporation or a Foreign Corporation Engaged in a U.S. Trade or Business** ist eine **Informationserklärung, keine Steuererklärung**. Es zahlt keine Steuer. Seine Aufgabe ist, dem IRS **Transaktionen zwischen der US-Einheit und ausländischen verbundenen Personen** zu melden.

Bei den meisten unserer Mandanten bei Exentax ist diese "US-Einheit" eine **Single-Member LLC** im Eigentum eines Nicht-Residenten, und die "ausländische verbundene Person" ist **der Eigentümer selbst**. Die "Transaktionen" sind jede Geldbewegung zwischen Ihnen und der LLC: Anfangseinlagen, Überweisungen von der LLC auf Ihr Privatkonto, einzelne Zahlungen, Darlehen.

Warum wichtig? Weil seit 2017 **disregarded entities im Eigentum von Ausländern** für Zwecke des 5472 wie Corporations behandelt werden. Das heißt: Auch wenn Ihre LLC keine Bundessteuer zahlt, **ist sie verpflichtet zu melden, wer sie besitzt und wie Geld zwischen Ihnen beiden geflossen ist**. Bei Nichtabgabe beträgt die Grundsanktion **25.000 USD pro Formular und Jahr**.
### Die Falle "pro-forma 1120"

Hier verlieren sich viele. Ihre Single-Member LLC eines Nicht-Residenten:

1. **Zahlt keine US-Bundeskörperschaftsteuer** auf Einkünfte ohne effektive Verbindung zu den USA.
2. Aber **muss jährlich ein leeres Form 1120 einreichen**, damit es als Umschlag für das Form 5472 dient.

Das ist das **pro-forma Form 1120**. Nur die Identifikationsfelder oben werden ausgefüllt ("Foreign-owned U.S. DE"), oben wird handschriftlich "Form 1120, Foreign-owned U.S. DE" vermerkt und das Form 5472 angehängt. Der Rest des 1120 bleibt leer (kein Schedule M, keine Bilanz, keine Steuerberechnung).

Wenn Ihr Anbieter sagte "Sie müssen nichts einreichen, weil Sie keine Steuer zahlen", **verwechselt er "nicht zahlen" mit "nicht melden"**. Das sind verschiedene Dinge.
### Wann gelten sie genau? Profiltabelle

| Profil | Form 1120? | Form 5472? | Kommentar |
|---|---|---|---|
| Single-Member LLC, Nicht-Resident, ohne Bewegungen | Ja, pro-forma | Nein | Sehr selten: schon Bankkonto eröffnen erzeugt Bewegung |
| Single-Member LLC, Nicht-Resident, mit Bewegungen | **Ja, pro-forma** | **Ja** | Typischer Exentax-Fall |
| Single-Member LLC, US-Resident | Nein | Nein | Schedule C des 1040 |
| Multi-Member LLC, alle Nicht-Residenten | Nein (Form 1065) | Ja, an 1065 angehängt | Partnership standardmäßig |
| LLC mit C-Corp-Wahl (Form 8832) | **Ja, real** | Ja, falls foreign related party | 21 % föderal |
| US-C-Corp eines Nicht-Residenten | Ja, real | Ja, falls foreign related party | Andere Struktur |

Fast alle Mandanten mit LLC fallen in Zeile 2: **jährlich pro-forma 1120 + 5472**.
### "Reportable transactions": was zählt und was nicht

Form 5472 verlangt die Meldung der **reportable transactions** zwischen LLC und ausländischer verbundener Person:

- Anfängliche oder spätere Kapitaleinlagen → gemeldet.
- Distributionen oder "Draws" von der LLC auf Ihr Privatkonto → gemeldet.
- Zahlungen der LLC an verbundene Unternehmen/Personen im Ausland → gemeldet.
- Darlehen zwischen Ihnen und der LLC → gemeldet.
- Zahlungen für Dienstleistungen, die Sie als Einzelperson aus einem anderen Land an die LLC fakturieren → gemeldet.

**Nicht** gemeldet werden Zahlungen an **nicht verbundene** Anbieter (externer Freelancer, SaaS, Bank). Das Kriterium ist **Verbundenheit**, nicht Nationalität.

In den meisten Anfängen löst eine einzige Anfangseinlage (die Überweisung zur Finanzierung der LLC) bereits die Pflicht aus. Ab dann sind Sie im Regime.
### Fristen, Verlängerungen und Versand

- **Standardfrist:** 15. April jedes Jahres, für das vorangegangene Geschäftsjahr (Ende 31. Dezember).
- **Verlängerung:** sechs Monate mit Form 7004, neue Frist 15. Oktober.
- **Einreichungsweise:** eine LLC eines Nicht-Residenten ohne E-File-Pflicht sendet üblicherweise per **Einschreiben an das IRS Service Center in Ogden, Utah** oder per **Fax** an die spezifische, vom IRS für foreign-owned DEs veröffentlichte Nummer. Adresse/Fax des jeweiligen Jahres immer prüfen.
- **EIN erforderlich:** ohne EIN keine Einreichung. Falls noch nicht vorhanden, vorab beschaffen (Form SS-4).

Verzögerungen sind nicht billig. Die 25.000-USD-Sanktion für nicht eingereichtes 5472 **gilt auch bei unvollständigen oder ungenauen Angaben**, nicht nur bei völliger Nichtabgabe.
### Typische Fehler bei 1120 + 5472

1. **Pro-forma 1120 wie ein echtes 1120 ausfüllen.** Sie tragen Zahlen, Bilanzen, Aufwendungen ein. Der IRS verarbeitet es als C-Corp-Erklärung, Chaos.
2. **Vergessen, dass das 5472 an das 1120 angehängt wird**, nicht allein versendet. Allein versandt gilt es nicht als eingereicht.
3. **Kein klares Operating Agreement** und Reporting von Transaktionen ohne Belege. Wenn der IRS nachfragt, gibt es nichts zu zeigen.
4. **Privat- und LLC-Konto vermischen** und am Jahresende "reportable transactions" rekonstruieren. Teuer und falsch.
5. **Sich auf "vom IRS kam nichts, alles gut" verlassen.** Der IRS warnt nicht vor Sanktionen.
6. **5472 ohne TIN/EIN des ausländischen Eigentümers einreichen.** Auch als Nicht-Resident verlangt das Formular Identifikation.
### Wer NICHT verpflichtet ist (die wenigen Fälle)

- Mehrgliedrige LLC, klassifiziert als **Partnership**, ohne foreign related parties mit reportable transactions (selten, wenn Sie ausländisch sind).
- Sie sind US-Steuerresident und Ihre Single-Member LLC meldet direkt in Schedule C des persönlichen 1040. Hier kein "foreign-owned DE".
- Ihre LLC hat zur **C-Corp** optiert und reicht ein echtes 1120 ein, ohne Transaktionen mit foreign related parties (selten).

Außerhalb dieser Fälle ist die Annahme, befreit zu sein, eine schlechte Wette: die Kosten guter Vorbereitung sind **deutlich niedriger** als die Mindeststrafe.
### Wie das in den Alltag passt

Wenn Sie die LLC-Operations während des Jahres korrekt führen (getrenntes Konto, Register über Einlagen und Entnahmen, unterzeichnetes Operating Agreement, Mindestbuchhaltung), ist die Vorbereitung des pro-forma 1120 + 5472 zum Jahresende ruhig. Wenn Sie am 31. Dezember ankommen mit vermischtem LLC-/Privatkonto, ohne Belege und ohne zu wissen, welche Bewegungen meldepflichtig sind, schießen Kosten und Risiko in die Höhe.

Bei Exentax behandeln wir diese Formulare als **natürliches Nebenprodukt** guter Jahresführung, nicht als März-Drama. Der Unterschied: dem <a href="/de/blog/jahrliche-llc-pflege-pflichten-die-sie-nicht-ignorieren">Jahreskalender der Pflichten</a> folgen und effektive Trennung zwischen Ihrem Vermögen und dem der LLC halten.
### Was Sie mitnehmen sollten

- **Form 1120** = Körperschaftsteuererklärung. In Ihrer LLC eines Nicht-Residenten **leer als Umschlag** für Form 5472 genutzt.
- **Form 5472** = Informationserklärung über Transaktionen zwischen LLC und Ihnen (oder jeder ausländischen verbundenen Person).
- **Gelten fast immer**, wenn Sie Nicht-Resident mit Single-Member LLC sind und Geld zwischen Ihnen und der LLC bewegt haben.
- **Mit diesen Formularen wird keine Steuer gezahlt**, aber **Nichtabgabe kostet 25.000 USD pro Jahr**.
- Teuerster Fehler: schlechte Ausfüllung oder Jahresende ohne Belege für das Reportierte.

Bei Zweifeln, ob Ihr Fall sauber aufgesetzt ist, zu Vorjahren oder zur Bereinigung verspäteter Einreichungen: **wir prüfen es mit Ihnen** in einer kostenlosen 30-minütigen Beratung. Besser einmal richtig verstehen, als jährlich vermeidbare Sanktionen zahlen.
## Rechtliche und regulatorische Quellen

Dieser Artikel stützt sich auf Vorschriften, die zum Stichtag aktuell in Kraft sind. Hauptquellen zur Verifikation:

- **USA.** Treas. Reg. §301.7701-3 (Entity Classification / *check-the-box*); IRC §882 (Steuer auf mit US-Geschäft effektiv verbundene Einkünfte Ausländer); IRC §871 (FDAP und Quellensteuer bei Nicht-Residenten); IRC §6038A und Treas. Reg. §1.6038A-2 (Form 5472 für *25% foreign-owned* und *foreign-owned disregarded entities*); IRC §7701(b) (Steuerwohnsitz, *substantial presence test*); 31 U.S.C. §5336 (Corporate Transparency Act, BOI Report bei <a href="https://www.fincen.gov" target="_blank" rel="noopener">FinCEN</a>).
- **Spanien.** Gesetz 35/2006 (LIRPF), Artt. 8, 9 (Wohnsitz), 87 (Einkünftezurechnung), 91 (Hinzurechnungsbesteuerung natürliche Personen); Gesetz 27/2014 (LIS), Art. 100 (Hinzurechnungsbesteuerung Gesellschaften); Gesetz 58/2003 (LGT), Artt. 15 und 16; Gesetz 5/2022 (Sanktionsregime Modelo 720 nach EuGH C-788/19 vom 27.01.2022); RD 1065/2007 (Modelos 232 und 720); Anordnung HFP/887/2023 (Modelo 721 Krypto).
- **DBA Spanien–USA.** <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a> vom 22.12.1990 (DBA); Protokoll in Kraft seit 27.11.2019 (passive Einkünfte, *limitation on benefits*).
- **EU / <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.** Richtlinie (EU) 2011/16, geändert durch DAC6 (grenzüberschreitende Gestaltungen), DAC7 (Richtlinie (EU) 2021/514, digitale Plattformen) und DAC8 (Richtlinie (EU) 2023/2226, Kryptowerte); Richtlinie (EU) 2016/1164 (ATAD: CFC, Exit Tax, hybride Gestaltungen); OECD Common Reporting Standard (CRS).
- **Internationaler Rahmen.** OECD-Musterabkommen, Art. 5 (Betriebsstätte) und Kommentare; BEPS-Aktion 5 (wirtschaftliche Substanz); FATF-Empfehlung 24 (wirtschaftlicher Eigentümer).
Die konkrete Anwendung dieser Regeln auf Ihren Fall hängt von Ihrem Steuerwohnsitz, der Tätigkeit der LLC und der von Ihnen geführten Dokumentation ab. Dieser Inhalt ist informativ und ersetzt keine personalisierte professionelle Beratung.

<!-- exentax:legal-facts-v1 -->
## Rechts- und Verfahrensfakten

Die Meldepflichten gegenüber FinCEN und IRS haben sich recent years bewegt; aktueller Stand:

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Sprechen Sie mit unserem Team</a>
<!-- /exentax:calc-cta-v1 -->

### Kernpunkte

- **BOI / Corporate Transparency Act: Ihre LLC ist NICHT verpflichtet (ein Wettbewerbsvorteil).** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC reicht KEINEN BOI Report ein**: eine Meldung weniger im Kalender, weniger Bürokratie und eine sauberere Struktur als je zuvor. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren. Der Regelstatus kann erneut wechseln: **wir überwachen FinCEN.gov bei jeder Einreichung** und, falls die Pflicht zurückkehrt, übernehmen wir sie ohne Aufpreis. Aktueller Stand auf [fincen.gov/boi](https://www.fincen.gov/boi) prüfbar.
- **Form 5472 + Pro-forma-1120.** Für eine **Single-Member LLC im Eigentum eines Nicht-Residenten** behandeln die Schlussregelungen Treas. Reg. §1.6038A-1 (seit 2017 in Kraft) die LLC für 5472-Zwecke als Corporation. Verfahren: **Pro-forma Form 1120** (nur Kopf: Name, Adresse, EIN, Steuerjahr) mit **Form 5472 als Anlage**. Einreichung **per Einschreiben oder Fax an das IRS Service Center Ogden, Utah**, **keine E-Einreichung über das Standard-MeF**. Frist: **15. April**; Verlängerung über **Form 7004** bis **15. Oktober**. **Sanktion: 25.000 USD pro Formular und Jahr, plus 25.000 USD je weitere 30 Tage** Nichteinreichung nach IRS-Mitteilung.
- **Substantielles Form 1120.** Nur wenn die LLC per Check-the-Box-Wahl zur C-Corp optiert hat (Form 8832): dann 21 % Bundessteuer und ein substantielles 1120. Eine Standard-disregarded LLC **reicht kein substantielles 1120 ein und zahlt keine bundesstaatliche Körperschaftsteuer**.
- **EIN und Benachrichtigung.** Ohne EIN ist weder 5472 noch BOI einreichbar. Der IRS warnt nicht vor Sanktionen; man bemerkt es, wenn die EIN gesperrt oder eine spätere Einreichung abgelehnt wird.
## Rechtliche und regulatorische Referenzen

Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben - und in dieser Reihenfolge gehen wir vor.

## Bank- und Steuerfakten, die es zu präzisieren gilt

Lesen Sie diesen Abschnitt als belastbare Checkliste: jeder Punkt markiert ein reales Ausfallmuster, das wir in grenzüberschreitenden LLC-Akten gesehen haben. Lassen Sie keinen aus - die meisten Nachveranlagungen und Kontoschließungen, die wir später aufräumen, lassen sich auf einen dieser Punkte zurückführen.

## Rechtliche und verfahrenstechnische Fakten

## Ihr nächster Schritt mit Exentax

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.<!-- exentax:execution-v2 -->
## Form 1120 und Form 5472: was sie sind und wann eine LLC von Nichtansässigen sie einreicht

Die Kombination 1120 + 5472 ist die zentrale Informationspflicht jeder single-member LLC im Besitz eines Nichtansässigen mit "reportable transactions" mit dem ausländischen Gesellschafter. Erzeugt keine Steuer, aber das Versäumnis löst 25.000 USD Strafe pro Jahr und Entität aus.

- **Form 1120 (pro-forma).** Nicht die typische Körperschaft-1120: eine vereinfachte Version, die die disregarded LLC als "Vehikel" zur Begleitung der 5472 nutzt. Nur Identifikationsdaten (EIN, Adresse, Geschäftsjahr). Keine Steuerberechnung. Frist: 15. April (oder 15. Oktober mit Verlängerung 7004).
- **Form 5472.** Das eigentliche Informationsformular. Meldet jede "reportable transaction" zwischen LLC und ausländischem Eigentümer (25%+ ownership): Kapitalzuführungen, Ausschüttungen, intercompany Darlehen, Zahlungen für Leistungen, Warenverkäufe. Der Betrag erzeugt keine Steuer, lässt aber den IRS grenzüberschreitende Flüsse verfolgen.
- **Wann es zutrifft.** Single-member LLC im Besitz eines Nichtansässigen (Person oder ausländische Entität) mit mindestens einer reportable transaction im Steuerjahr. Keine Bewegung = technisch kein 5472 - empfehlenswert dennoch mit "0" einreichen.
- **Strafe bei Versäumnis.** 25.000 USD pro Steuerjahr und versäumter Entität. Weitere 25.000 USD, wenn nach IRS-Benachrichtigung nicht binnen 90 Tagen korrigiert. Die teuerste Informationsstrafe für Nichtansässigen-LLCs und die am einfachsten zu vermeidende.

### Was am häufigsten gefragt wird

**Muss ich damit Bundessteuer zahlen?** Nein, außer die LLC hat effektiv verbundene Einkünfte aus einem US-Geschäft (ETBUS). Ohne ETBUS und ohne US-source income ist das Bundesergebnis 0 und das 1120/5472 nur informativ.

**Kann ich sie selbst einreichen?** Technisch ja, aber eine Fehlkategorisierung oder ein Tag Verspätung lösen die Strafe aus. Die meisten Kunden delegieren lieber.

Bei Exentax bereiten wir das 1120 + 5472 Ihrer LLC fristgerecht vor und reichen es ein, bewahren den Nachweis auf und halten den Verlauf sauber für künftige Prüfungen oder Due Diligence.
<!-- /exentax:execution-v2 -->

## Wann gelten sie genau? Tabelle nach Profil

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Zwei%20a%20href%3Dhttps%3A%2F%2Fwww%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie den gesamten Prozess im Detail sehen möchten, sehen Sie sich unsere <a href="/de/leistungen">Leistungsseite</a> mit allen enthaltenen Leistungen.
<!-- /exentax:cta-conv-v1 -->

  ### Form 1120 + 5472 für DACH-Gesellschafter: vollständiger Pflichtenstack

  Die Pflichtangaben der **Form 5472** beruhen auf **IRC §6038A(b)** und **Treas. Reg. §1.6038A-2**. Eine erhebliche Verschärfung erfolgte mit **TD 9796 vom 12.12.2016** (in Kraft ab 01.01.2017): seither werden auch **single-member LLCs** ("disregarded entities") als "reporting corporations" im Sinne der Vorschrift behandelt, sobald sie zu mindestens 25 % von einem **non-US-Person** gehalten werden. Die Frist ist der **15. April** des Folgejahres; eine **sechsmonatige Verlängerung** erhält man durch fristgerechte Einreichung der **Form 7004** (Application for Automatic Extension), wodurch sich der Stichtag auf den **15. Oktober** verschiebt.

  Die Sanktion bei Nichtabgabe oder verspäteter Abgabe beträgt **USD 25.000 pro Vorgang** (initial) nach **§6038A(d)(1)**, erhöht durch **Sec. 13301 des Tax Cuts and Jobs Act (Pub. L. 115-97 vom 22.12.2017)** — vor TCJA waren es nur USD 10.000. Bei Fortdauer nach 90-tägiger IRS-Aufforderung kommen **USD 25.000 pro 30-Tage-Periode** hinzu, ohne Höchstgrenze.

  Aus deutscher Sicht entsteht ein paralleler Pflichtenstack: die **Anzeigepflicht nach §138 Abs. 2 AO** für Beteiligungen ≥ 10 % an ausländischen Gesellschaften (Frist 14 Monate nach Ende des Wirtschaftsjahres), die **erhöhten Mitwirkungspflichten nach §90 Abs. 2 AO** bei Auslandssachverhalten und ggf. die **Hinzurechnungsbesteuerung nach §§7–14 AStG** (ATAD-Umsetzung BGBl. I 2021 S. 4147), wenn die LLC als passive Zwischengesellschaft mit Niedrigbesteuerung unter 15 % qualifiziert wird. In **Österreich** greifen die **§§109, 124–126 BAO** und das **WiEReG (BGBl. I Nr. 136/2017)** mit Sanktionen bis €200.000. In der **Schweiz** greift das **AIA-Gesetz (SR 653.1)** für den automatischen Informationsaustausch und das **FATCA-Abkommen Modell 2 (SR 0.672.933.63 vom 14.02.2013)**, das die schweizerischen Finanzinstitute zur direkten Meldung an den IRS verpflichtet.

<!-- exentax:cta-v1 -->
Wir prüfen BOI, EIN, Registered Agent und Bundespflichten, damit Sie keine Strafe überrascht. <a href="/de/leistungen">Compliance-Check anfragen</a>.
<!-- /exentax:cta-v1 -->

`;
