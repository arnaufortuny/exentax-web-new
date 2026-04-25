#!/usr/bin/env node
/**
 * Replaces the legacy BOI/CTA bullet that (incorrectly) stated the BOI
 * Report is no longer mandatory for foreign-owned US LLCs with an updated
 * bullet that affirms BOIR filing remains MANDATORY.
 *
 * The legacy bullet was inserted across ~450 articles citing the FinCEN
 * "interim final rule of March 2025". Per editorial direction, BOIR is
 * mandatory and the article corpus must reflect that.
 *
 * Detection: matches the bullet starting with `- **BOI / Corporate
 * Transparency Act.**` (or its localized variants) and ending at the next
 * blank line or the next bullet start. Replacement is per language.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../client/src/data/blog-content/", import.meta.url).pathname;
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// New bullet per language. Anchored on FinCEN.gov, deadlines, sanctions,
// and a clear "mandatory" verb so neither the reader nor the masterpiece
// audit can interpret BOI as optional.
const NEW_BULLET = {
  es: `- **BOI / BOIR (Beneficial Ownership Information Report).** **Obligatorio** para tu LLC USA ante FinCEN: identifica al beneficiario efectivo (titulares con \u2265 25 % de participación o control sustancial). Se presenta online en **boiefiling.fincen.gov**, es **gratuito** y se completa en minutos. Plazos: **30 días** desde la constitución para nuevas LLCs y **30 días** para reportar cualquier cambio (cambio de domicilio del beneficiario, nuevo socio, etc.). **Sanciones civiles de hasta 591 USD/día** (cuantía ajustada anualmente a la inflación) y sanciones penales de hasta **10.000 USD y 2 años de prisión** por incumplimiento doloso. Conserva el **BOIR Confirmation Number** en tu archivo legal.`,
  en: `- **BOI / BOIR (Beneficial Ownership Information Report).** **Mandatory** for your US LLC with FinCEN: identifies the beneficial owner (anyone holding \u2265 25 % ownership or substantial control). Filed online at **boiefiling.fincen.gov**, **free** and completed in minutes. Deadlines: **30 days** from formation for new LLCs and **30 days** to report any change (beneficial owner address change, new member, etc.). **Civil penalties up to $591 per day** (amount adjusted annually for inflation) and criminal penalties up to **$10,000 and 2 years' imprisonment** for willful non-compliance. Keep the **BOIR Confirmation Number** in your legal file.`,
  fr: `- **BOI / BOIR (Beneficial Ownership Information Report).** **Obligatoire** pour votre LLC US auprès de FinCEN : identifie le bénéficiaire effectif (toute personne détenant \u2265 25 % ou exerçant un contrôle substantiel). Dépôt en ligne sur **boiefiling.fincen.gov**, **gratuit** et complété en quelques minutes. Délais : **30 jours** à compter de la constitution pour les nouvelles LLC et **30 jours** pour signaler tout changement (changement d'adresse du bénéficiaire, nouvel associé, etc.). **Sanctions civiles jusqu'à 591 USD par jour** (montant ajusté chaque année à l'inflation) et sanctions pénales jusqu'à **10 000 USD et 2 ans de prison** en cas de manquement délibéré. Conservez le **BOIR Confirmation Number** dans votre dossier légal.`,
  de: `- **BOI / BOIR (Beneficial Ownership Information Report).** Für Ihre US-LLC bei FinCEN **verpflichtend**: identifiziert den wirtschaftlich Berechtigten (Personen mit \u2265 25 % Beteiligung oder substanzieller Kontrolle). Einreichung online auf **boiefiling.fincen.gov**, **kostenfrei** und in Minuten erledigt. Fristen: **30 Tage** ab Gründung bei neuen LLCs und **30 Tage** zur Meldung jeder Änderung (Adressänderung des Berechtigten, neues Mitglied usw.). **Zivilrechtliche Sanktionen bis 591 USD pro Tag** (jährlich an die Inflation angepasst) und strafrechtliche Sanktionen bis **10 000 USD und 2 Jahre Haft** bei vorsätzlicher Nichteinhaltung. **BOIR Confirmation Number** in Ihrer Rechtsakte aufbewahren.`,
  pt: `- **BOI / BOIR (Beneficial Ownership Information Report).** **Obrigatório** para a tua LLC USA junto da FinCEN: identifica o beneficiário efectivo (titulares com \u2265 25 % de participação ou controlo substancial). Submete-se online em **boiefiling.fincen.gov**, é **gratuito** e completa-se em minutos. Prazos: **30 dias** desde a constituição para novas LLCs e **30 dias** para reportar qualquer alteração (mudança de morada do beneficiário, novo sócio, etc.). **Sanções civis até 591 USD por dia** (montante ajustado anualmente à inflação) e sanções penais até **10.000 USD e 2 anos de prisão** por incumprimento doloso. Guarda o **BOIR Confirmation Number** no teu arquivo legal.`,
  ca: `- **BOI / BOIR (Beneficial Ownership Information Report).** **Obligatori** per a la teva LLC USA davant la FinCEN: identifica el beneficiari efectiu (titulars amb \u2265 25 % de participació o control substancial). Es presenta online a **boiefiling.fincen.gov**, és **gratuït** i es completa en minuts. Terminis: **30 dies** des de la constitució per a noves LLCs i **30 dies** per reportar qualsevol canvi (canvi de domicili del beneficiari, nou soci, etc.). **Sancions civils de fins a 591 USD per dia** (quantitat ajustada anualment a la inflació) i sancions penals de fins a **10.000 USD i 2 anys de presó** per incompliment dolós. Conserva el **BOIR Confirmation Number** al teu arxiu legal.`,
};

// The legacy bullet always starts with this stem. We capture from there
// up to (but not including) the next bullet (`\n-`), the next paragraph
// break (`\n\n`), or the next heading (`\n##`). Tolerant of both straight
// and curly quotes around "foreign reporting companies".
const LEGACY_BULLET = /-\s+\*\*BOI\s*\/\s*Corporate Transparency Act\.\*\*[^\n]*(?:\n(?!\s*-\s|\s*##|\s*\n|\s*<!--|\s*\*\*)[^\n]*)*/g;

let touched = 0, unchanged = 0, missing = 0;
const perLang = Object.fromEntries(LANGS.map((l) => [l, 0]));

for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const path = join(dir, f);
    const before = readFileSync(path, "utf8");
    if (!LEGACY_BULLET.test(before)) {
      LEGACY_BULLET.lastIndex = 0;
      if (/\bBOI\b/.test(before) && /Corporate Transparency Act/.test(before)) {
        // Has BOI + CTA but no match: anomaly to inspect
        missing++;
        console.warn(`[anomaly] ${lang}/${f}: BOI bullet present but regex did not match`);
      }
      continue;
    }
    LEGACY_BULLET.lastIndex = 0;
    const after = before.replace(LEGACY_BULLET, NEW_BULLET[lang]);
    if (after === before) { unchanged++; continue; }
    writeFileSync(path, after, "utf8");
    touched++;
    perLang[lang]++;
  }
}

console.log(`[boi-rewrite] touched=${touched} unchanged=${unchanged} anomalies=${missing}`);
console.log(`[boi-rewrite] per-lang: ${JSON.stringify(perLang)}`);
