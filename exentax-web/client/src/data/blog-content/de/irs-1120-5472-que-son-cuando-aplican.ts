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

Verzögerungen sind nicht billig. Die 25.000-USD-Sanktion für nicht eingereichtes 5472 **gilt auch bei unvollständigen oder ungenauen Angaben**, nicht nur bei völliger Nichtabgabe. Hier kommt Exentax ins Spiel: wir reichen das Formular ein, archivieren den Beleg und, wenn die Behörde fragt, liegt Ihre Antwort bereits fertig.
### Typische Fehler bei 1120 + 5472

1. **Pro-forma 1120 wie ein echtes 1120 ausfüllen.** Sie tragen Zahlen, Bilanzen, Aufwendungen ein. Der IRS verarbeitet es als C-Corp-Erklärung, Chaos.
2. **Vergessen, dass das 5472 an das 1120 angehängt wird**, nicht allein versendet. Allein versandt gilt es nicht als eingereicht.
3. **Kein klares Operating Agreement** und Reporting von Transaktionen ohne Belege. Wenn der IRS nachfragt, gibt es nichts zu zeigen.
4. **Privat- und LLC-Konto vermischen** und am Jahresende "reportable transactions" rekonstruieren. Teuer und falsch.
5. **Sich auf "vom IRS kam nichts, alles gut" verlassen.** Der IRS warnt nicht vor Sanktionen. Jetzt ist der Moment, Hilfe zu holen. Bei Exentax eröffnen wir den Fall, reichen das Fehlende ein und antworten der Behörde für Sie.
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

Bei Zweifeln, ob Ihr Fall sauber aufgesetzt ist, zu Vorjahren oder zur Bereinigung verspäteter Einreichungen: **wir prüfen es mit Ihnen** in einer kostenlosen 30-minütigen Beratung. Besser einmal richtig verstehen, als jährlich vermeidbare Sanktionen zahlen. Und falls doch eine Aufforderung kommt: bei Exentax liegt das Dossier bereit, Sie antworten in Stunden, nicht in Wochen.
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

Die Meldepflichten gegenüber FinCEN und IRS haben sich in den letzten Jahren bewegt; aktueller Stand:

<!-- exentax:lote25-native-v1:irs-1120-5472-que-son-cuando-aplican-de -->
## Wie sich die Beziehung zwischen Form 1120 und Form 5472 als stabile jährliche Pflicht lesen lässt

Die Beziehung zwischen Form 1120 und Form 5472 liest sich ruhiger, wenn sie als stabile jährliche Pflicht der LLC mit ausländischem wirtschaftlich Berechtigten und nicht als wiederkehrende Überraschung behandelt wird. Form 1120 dient als Trägerformular, Form 5472 als Anlage für die reportierbaren Transaktionen mit verbundenen Parteien — und die Pflicht ändert sich nicht von Jahr zu Jahr.

## Wie sich die jährliche Vorbereitung der beiden Formulare in einer kurzen Notiz pflegen lässt

Die jährliche Vorbereitung pflegt sich in einer kurzen, datierten Notiz, die die wiederkehrenden reportierbaren Transaktionen und die Frist auflistet.
<!-- /exentax:lote25-native-v1:irs-1120-5472-que-son-cuando-aplican-de -->

<!-- exentax:lote29-native-v1:irs-1120-5472-que-son-cuando-aplican-de -->
## Wie sich Form 1120 und Form 5472 als stabile Pflichten­karte statt als Verwaltungs­überraschung lesen lassen

Form 1120 und Form 5472 lesen sich nützlicher als stabile Pflichten­karte zwischen der Art der LLC (Single-Member oder Multi-Member), dem Status der Gesellschafter (US-Personen oder Nicht-Residenten) und der entsprechenden jährlichen Erklärungs­pflicht denn als Verwaltungs­überraschung. Diese Karte ändert sich nicht von Jahr zu Jahr — nur die Zahlen, die in jedes Formular eingetragen werden, ändern sich.

Eine kurze, datierte Notiz im LLC-Ordner mit dem LLC-Typ, dem Gesellschafter­status und der entsprechenden Erklärungs­pflicht macht die Position jederzeit nachlesbar.
<!-- /exentax:lote29-native-v1:irs-1120-5472-que-son-cuando-aplican-de -->

<!-- exentax:lote29-native-v1-bis:irs-1120-5472-que-son-cuando-aplican-de -->
## Warum die Notiz auf den LLC-Typ und nicht auf das Formular allein bezogen sein sollte

Die Notiz bezieht sich auf den LLC-Typ und auf den Gesellschafter­status — nicht auf das Formular allein, weil die Erklärungs­pflicht aus diesen beiden Achsen folgt und nicht umgekehrt, und diese Sicht erlaubt eine schnelle Selbst­überprüfung.
<!-- /exentax:lote29-native-v1-bis:irs-1120-5472-que-son-cuando-aplican-de -->

Bevor Sie weiterlesen, bringen Sie Zahlen in Ihren Fall: Der <a href="/de#calculadora">Exentax-Rechner</a> vergleicht in unter 2 Minuten Ihre aktuelle Steuerlast mit der, die Sie mit einer im Wohnsitzland korrekt deklarierten US-LLC tragen würden.

<!-- exentax:calc-cta-v1 -->
> <a href="/de/buchen">Sprechen Sie mit unserem Team</a>
<!-- /exentax:calc-cta-v1 -->

### Kernpunkte

- **BOI / Corporate Transparency Act: Ihre LLC ist NICHT verpflichtet (ein Wettbewerbsvorteil).** Nach der **FinCEN Interim Final Rule vom März 2025** wurde die BOI-Meldepflicht **auf „foreign reporting companies" beschränkt** (außerhalb der USA gegründete Einheiten, die in einem Bundesstaat zur Geschäftstätigkeit registriert sind). Eine **in den USA von einem Nicht-Residenten gegründete LLC reicht KEINEN BOI Report ein**: eine Meldung weniger im Kalender, weniger Bürokratie und eine sauberere Struktur als je zuvor. Wenn Ihre LLC vor März 2025 gegründet wurde und das BOI bereits eingereicht ist, Bestätigung aufbewahren. Der Regelstatus kann erneut wechseln: **wir überwachen FinCEN.gov bei jeder Einreichung** und, falls die Pflicht zurückkehrt, übernehmen wir sie ohne Aufpreis. Aktueller Stand auf [fincen.gov/boi](https://www.fincen.gov/boi) prüfbar.
- **Form 5472 + Pro-forma-1120.** Für eine **Single-Member LLC im Eigentum eines Nicht-Residenten** behandeln die Schlussregelungen Treas. Reg. §1.6038A-1 (seit 2017 in Kraft) die LLC für 5472-Zwecke als Corporation. Verfahren: **Pro-forma Form 1120** (nur Kopf: Name, Adresse, EIN, Steuerjahr) mit **Form 5472 als Anlage**. Einreichung **per Einschreiben oder Fax an das IRS Service Center Ogden, Utah**, **keine E-Einreichung über das Standard-MeF**. Frist: **15. April**; Verlängerung über **Form 7004** bis **15. Oktober**. **Sanktion: 25.000 USD pro Formular und Jahr, plus 25.000 USD je weitere 30 Tage** Nichteinreichung nach IRS-Mitteilung.
- **Substantielles Form 1120.** Nur wenn die LLC per Check-the-Box-Wahl zur C-Corp optiert hat (Form 8832): dann 21 % Bundessteuer und ein substantielles 1120. Eine Standard-disregarded LLC **reicht kein substantielles 1120 ein und zahlt keine bundesstaatliche Körperschaftsteuer**.
- **EIN und Benachrichtigung.** Ohne EIN ist weder 5472 noch BOI einreichbar. Der IRS warnt nicht vor Sanktionen; man bemerkt es, wenn die EIN gesperrt oder eine spätere Einreichung abgelehnt wird. Bleiben Sie ruhig: bei Exentax ist das unser Wochengeschäft, wir schließen es ab, bevor der Brief in Ihrem Postfach landet.
## Rechtliche und regulatorische Referenzen

Was folgt, ist die operative Sicht, nicht die aus dem Lehrbuch. Wir haben dieses Muster oft genug umgesetzt, um zu wissen, welche Variablen unter der Prüfung einer Steuerbehörde oder einer Bank-Compliance zuerst nachgeben - und in dieser Reihenfolge gehen wir vor. Und falls doch eine Aufforderung kommt: bei Exentax liegt das Dossier bereit, Sie antworten in Stunden, nicht in Wochen.

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
- **Strafe bei Versäumnis.** 25.000 USD pro Steuerjahr und versäumter Entität. Weitere 25.000 USD, wenn nach IRS-Benachrichtigung nicht binnen 90 Tagen korrigiert. Die teuerste Informationsstrafe für Nichtansässigen-LLCs und die am einfachsten zu vermeidende. Hier kommt Exentax ins Spiel: wir reichen das Formular ein, archivieren den Beleg und, wenn die Behörde fragt, liegt Ihre Antwort bereits fertig.

### Was am häufigsten gefragt wird

**Muss ich damit Bundessteuer zahlen?** Nein, außer die LLC hat effektiv verbundene Einkünfte aus einem US-Geschäft (ETBUS). Ohne ETBUS und ohne US-source income ist das Bundesergebnis 0 und das 1120/5472 nur informativ.

**Kann ich sie selbst einreichen?** Technisch ja, aber eine Fehlkategorisierung oder ein Tag Verspätung lösen die Strafe aus. Die meisten Kunden delegieren lieber.

Bei Exentax bereiten wir das 1120 + 5472 Ihrer LLC fristgerecht vor und reichen es ein, bewahren den Nachweis auf und halten den Verlauf sauber für künftige Prüfungen oder Due Diligence.
<!-- /exentax:execution-v2 -->

## Wann gelten sie genau? Tabelle nach Profil

Diesen Block behandeln wir als eine der tragenden Entscheidungen der LLC-Strategie: ein Fehler hier und der Rest der Struktur verliert Steuern, Bankzugang oder Compliance. Die folgenden Hinweise spiegeln wider, was wir mit Mandanten in genau diesem Fall tatsächlich tun, mit Priorität auf den Variablen, die das Ergebnis bewegen.

<!-- exentax:defensa-fiscal-v1 -->
## Was, wenn das Finanzamt nach meiner LLC fragt?

  Das ist die Frage, die in der ersten Beratung am häufigsten gestellt wird, und die kurze Antwort lautet: Ihre LLC ist nicht intransparent, und bei korrekter Deklaration schließt eine Prüfung mit Standardformularen ab. Das deutsche Finanzamt, das österreichische Finanzamt oder die kantonale Steuerverwaltung können das Certificate of Formation des Bundesstaats (Wyoming, Delaware oder New Mexico), die vom <a href="https://www.irs.gov" target="_blank" rel="noopener">IRS</a> ausgestellte EIN, das unterzeichnete Operating Agreement, die Mercury- oder Wise-Auszüge des Geschäftsjahres, den eingereichten Form 5472 mit 1120 pro-forma sowie die Buchhaltung anfordern, die Einnahmen, Ausgaben und Bewegungen abstimmt. Liegt all das geordnet vor, eskaliert die Prüfung nicht. Atmen Sie durch: bei Exentax ist das Routine, wir bringen Sie auf den Stand und die nächste Prüfung schließt in einer Runde, ohne Drama.

  Was die Steuerbehörden zu Recht verfolgen, sind Strohmannstrukturen, Papier-Steueransässigkeit und nicht erklärte Auslandskonten. Eine sauber aufgesetzte LLC ist genau das Gegenteil: Sie erscheinen als **wirtschaftlich Berechtigter** im BOI Report, wenn er anwendbar ist (überprüfbar unter <a href="https://www.fincen.gov/boi" target="_blank" rel="noopener">fincen.gov/boi</a>), Sie unterschreiben die Bankkonten und Sie erklären das Einkommen dort, wo Sie leben. Die Struktur ist beim Secretary of State des Bundesstaats registriert, in den IRS-Akten und, sobald eine europäische Bank im Spiel ist, innerhalb des CRS-Perimeters der <a href="https://www.oecd.org" target="_blank" rel="noopener">OECD</a>.

  Der Fehler, der eine Prüfung wirklich entgleisen lässt, ist nicht die LLC selbst, sondern die fehlerhafte Zuordnung des Einkommens in der persönlichen Einkommensteuererklärung, das fehlende KAP/AUS bei deutschen Residenten oder die unterlassene Anlage A1 und Beilagen E25/E26 bei österreichischen Residenten. Diese drei Fronten schließen wir vor der Anfrage, nicht danach. Genau deshalb halten wir bei Exentax Ihren Kalender bündig — Sie müssen nicht mehr an Fristen denken, wir schließen sie ab, bevor sie zubeißen.

  ## Was eine LLC NICHT tut

  - **Sie befreit Sie nicht von der Steuerpflicht zu Hause.** Wer in Deutschland, Österreich oder der Schweiz steuerlich ansässig ist, versteuert das Welteinkommen vor Ort. Die LLC ordnet den US-Teil (null Bundesteuer für die SMLLC pass-through ohne ECI), sie schaltet die heimische Besteuerung nicht ab. Die Einkommensteuer wird auf den zugewiesenen Gewinn berechnet, nicht auf die tatsächlich ausgeschütteten Beträge.
  - **Sie ist kein Offshore-Konstrukt und keine BEPS-Struktur.** Sie ist eine vom IRS anerkannte US-Gesellschaft, in einem konkreten Bundesstaat mit physischer Adresse, registriertem Agenten und jährlichen Informationspflichten registriert. Klassische Offshore-Standorte (BVI, Belize, Seychellen) hinterlassen keine öffentliche Spur; eine LLC hinterlässt fünf.
  - **Sie schützt Sie nicht bei vermischten Vermögen.** Das *pierce the corporate veil* greift, sobald ein Gericht erkennt, dass LLC und Gesellschafter dieselbe Geldbörse sind: vermischte Konten, private Ausgaben aus der LLC, kein Operating Agreement, keine Buchhaltung. Drei verdächtige Bewegungen genügen.
  - **Sie spart keine Sozialbeiträge im Inland.** Freiberufler in Deutschland, Selbständige in Österreich, AHV-Pflichtige in der Schweiz: der monatliche Beitrag bleibt identisch. Die LLC bedient die internationale Kundschaft; der persönliche Sozialbeitrag bleibt unabhängig. Siehe Bekanntmachungen im Bundesgesetzblatt sowie spanische Vergleichsregelungen im <a href="https://www.boe.es" target="_blank" rel="noopener">BOE</a>.
  - **Sie befreit Sie nicht von der Auslandskonto-Meldepflicht.** Deutschland: KAP/AUS, ggf. § 138 AO Anzeige bei Beteiligungen über 10 %. Österreich: Beilagen E25/E26 zur Einkommensteuererklärung. Schweiz: kantonale Vermögensdeklaration. Diese Pflichten liegen bei der Person, nicht bei der LLC.

  Bei Exentax schließen wir diese fünf Fronten jedes Jahr parallel zum US-Bundeskalender (Form 5472, 1120 pro-forma, FBAR, staatlicher Annual Report, BOI Report bei Anwendbarkeit). Ziel ist, dass keine Prüfung ein loses Ende findet und die Struktur einer rückwirkenden Prüfung über 5 bis 7 Jahre standhält.
<!-- /exentax:defensa-fiscal-v1 -->

<!-- exentax:cta-conv-v1 -->
<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20lese%20den%20Artikel%20%22Zwei%20a%20href%3Dhttps%3A%2F%2Fwww%22%20und%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>

Wenn Sie den gesamten Prozess im Detail sehen möchten, sehen Sie sich unsere <a href="/de/leistungen">Leistungsseite</a> mit allen enthaltenen Leistungen.

<!-- exentax:conv-fill-v1 -->
Oder rufen Sie uns direkt an: <a href="tel:+34614916910">+34 614 916 910</a>, wenn Sie lieber sprechen möchten.

Für staatsspezifische Details siehe unsere <a href="/de/leistungen/llc-wyoming">Wyoming-LLC-Leistungsseite</a> mit festen Kosten und Fristen.

<!-- /exentax:conv-fill-v1 -->
<!-- /exentax:cta-conv-v1 -->

  ### Form 1120 + 5472 für DACH-Gesellschafter: vollständiger Pflichtenkatalog

  Die Pflichtangaben der **Form 5472** beruhen auf **IRC §6038A(b)** und **Treas. Reg. §1.6038A-2**. Eine erhebliche Verschärfung erfolgte mit **TD 9796 vom 12.12.2016** (in Kraft ab 01.01.2017): seither werden auch **single-member LLCs** ("disregarded entities") als "reporting corporations" im Sinne der Vorschrift behandelt, sobald sie zu mindestens 25 % von einem **non-US-Person** gehalten werden. Die Frist ist der **15. April** des Folgejahres; eine **sechsmonatige Verlängerung** erhält man durch fristgerechte Einreichung der **Form 7004** (Application for Automatic Extension), wodurch sich der Stichtag auf den **15. Oktober** verschiebt.

  Die Sanktion bei Nichtabgabe oder verspäteter Abgabe beträgt **USD 25.000 pro Vorgang** (initial) nach **§6038A(d)(1)**, erhöht durch **Sec. 13301 des Tax Cuts and Jobs Act (Pub. L. 115-97 vom 22.12.2017)** — vor TCJA waren es nur USD 10.000. Bei Fortdauer nach 90-tägiger IRS-Aufforderung kommen **USD 25.000 pro 30-Tage-Periode** hinzu, ohne Höchstgrenze. Atmen Sie durch: bei Exentax ist das Routine, wir bringen Sie auf den Stand und die nächste Prüfung schließt in einer Runde, ohne Drama.

  Aus deutscher Sicht entsteht ein paralleler Pflichtenkatalog: die **Anzeigepflicht nach §138 Abs. 2 AO** für Beteiligungen ≥ 10 % an ausländischen Gesellschaften (Frist 14 Monate nach Ende des Wirtschaftsjahres), die **erhöhten Mitwirkungspflichten nach §90 Abs. 2 AO** bei Auslandssachverhalten und ggf. die **Hinzurechnungsbesteuerung nach §§7–14 AStG** (ATAD-Umsetzung BGBl. I 2021 S. 4147), wenn die LLC als passive Zwischengesellschaft mit Niedrigbesteuerung unter 15 % qualifiziert wird. In **Österreich** greifen die **§§109, 124–126 BAO** und das **WiEReG (BGBl. I Nr. 136/2017)** mit Sanktionen bis €200.000. In der **Schweiz** greift das **AIA-Gesetz (SR 653.1)** für den automatischen Informationsaustausch und das **FATCA-Abkommen Modell 2 (SR 0.672.933.63 vom 14.02.2013)**, das die schweizerischen Finanzinstitute zur direkten Meldung an den IRS verpflichtet. Bei Exentax haben wir Mandanten in genau dieser Lage ohne Strafe geschlossen. Früh sprechen lohnt sich — und spart Ihnen fünf Stellen.

<!-- exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->
## Was 1120 + Form 5472 tatsächlich melden (und was nicht)

Für eine Single-Member LLC, die einer nicht-US Person gehört und für
US-Steuerzwecke als disregarded behandelt wird, verlangt die IRS
eine Pro-forma-1120-Hülle, die ausschließlich als Träger für Form
5472 dient. Dieses Paar erhebt keine US-Steuer auf eine
ausländisch gehaltene disregarded LLC; es dokumentiert, dass
bestimmte meldepflichtige Transaktionen zwischen der LLC und ihrem
ausländischen Eigentümer (oder verbundenen Parteien) tatsächlich
stattgefunden haben. Die IRS will Sichtbarkeit auf diese Flüsse,
nicht zwingend Einnahmen.

| Position         | Was sie meldet                                          |
|------------------|---------------------------------------------------------|
| Pro-forma 1120   | Identifikations-Hülle: LLC-Name, EIN, Adresse, Jahr     |
| Form 5472        | Jede meldepflichtige Transaktion mit der ausländischen  |
|                  | verbundenen Partei (Kapitaleinlagen, Ausschüttungen,    |
|                  | Darlehen, Dienstleistungen usw.)                         |

Hatte das Jahr keine meldepflichtigen Transaktionen, wird das Paar
in der Regel trotzdem mit Werten auf null eingereicht, damit die IRS
den Aktivitätsstatus ausdrücklich sieht. Das Auslassen der Meldung
löst die bekannte Strafmassen-Exposition nach den Vorschriften aus.

## Drei reale Einreichungsmuster, die wir umsetzen

Eine Single-Member LLC mit einer Kapitaleinlage zur Gründung, einer
kleinen monatlichen Entnahme an den ausländischen Eigentümer und
keinen weiteren verbundenen Flüssen. Das 5472 meldet die Einlage und
die Entnahmen; das Pro-forma-1120 trägt die Hülle. Die Saison
dauert ein paar Stunden strukturierte Arbeit, einschließlich
Buchhaltungs-Abgleich.

Eine Single-Member LLC, die einer verbundenen ausländischen
Gesellschaft Geld geliehen hatte, später zurückgezahlt, mit
marktüblichem Zins. Das 5472 meldet die Darlehensgewährung und die
Rückzahlung; die Zinsabgrenzung ist Teil der LLC-Bücher und wird in
der Heimaterklärung des Eigentümers gespiegelt. Dokumentation ist
hier der Freund: der Darlehensvertrag und der Tilgungsplan liegen im
Compliance-Ordner der LLC.

Eine mehrjährige LLC ohne Aktivität im laufenden Jahr. Wir reichen
trotzdem Pro-forma-1120 + 5472 mit Nullen ein, hängen ein kurzes
internes Memo zur ruhenden Phase an und halten die Akte bereit für
den Moment, in dem die LLC wieder aktiv wird.

## Fehler, die zu Strafbriefen führen

- Das Paar als Steuererklärung behandeln, die "nichts schuldet", und
  überspringen. Es ist eine Meldung; das Fehlen einer Steuer
  beseitigt die Pflicht nicht.
- Persönliche Ausgaben des Eigentümers in die LLC-Bücher mischen
  und dann zum Einreichungszeitpunkt abstimmen wollen. Die Grenze
  monatlich sauber halten.
- Vergessen, dass eine Entnahme an den ausländischen Eigentümer
  eine meldepflichtige Transaktion ist. Sie ist es oft, je nach
  ihrer Natur (Kapitalrückzahlung, Ausschüttung usw.).
- Spät einreichen. Die Strafe für ein versäumtes Form 5472 ist. Und falls doch eine Aufforderung kommt: bei Exentax liegt das Dossier bereit, Sie antworten in Stunden, nicht in Wochen.
  erheblich und gilt auch ohne fällige US-Steuer.

## Checkliste vor der Einreichung

- LLC-EIN stimmt mit dem IRS-Schreiben (CP575) überein.
- Geschäftsjahr bestätigt (Kalenderjahr als Standard für eine
  Single-Member disregarded LLC).
- Buchhaltung abgeschlossen und mit Banken abgestimmt.
- Verbundene-Parteien-Flüsse den 5472-Zeilenkategorien zugeordnet.
- Identitätsdokument des Eigentümers in der Akte stimmt mit der
  BOI-Meldung überein.
- Einreichungskanal bereit (Papier oder E-File via autorisierten
  Anbieter).

Wir behandeln 1120 + 5472 als jährlichen Handschlag der LLC mit der
IRS: ruhig, vorhersehbar, strukturiert. Eine saubere Einreichung in
diesem Jahr macht das nächste Jahr noch ruhiger.

<!-- /exentax:lote7-native-v1:irs-1120-5472-que-son-cuando-aplican -->

<!-- exentax:cross-refs-v1 -->
## Zum gleichen Thema

- [Was passiert, wenn Sie Form 5472 nicht einreichen: IRS-Strafen und Korrektur](/de/blog/was-passiert-wenn-sie-form-5472-nicht-einreichen-irs-strafen)
- [W-8BEN und W-8BEN-E: ein vollständiger, ruhiger Leitfaden](/de/blog/w8-ben-und-w8-ben-e-der-vollstandige-leitfaden)
- [Was ist der IRS und wie betrifft er Ihre US-LLC tatsächlich](/de/blog/was-ist-der-irs-und-wie-betrifft-er-ihre-us-llc)
<!-- /exentax:cross-refs-v1 -->

<!-- exentax:cta-v1 -->
Wir prüfen BOI, EIN, Registered Agent und Bundespflichten, damit Sie keine Strafe überrascht. <a href="/de/leistungen">Compliance-Check anfragen</a>.
<!-- /exentax:cta-v1 -->

`;
