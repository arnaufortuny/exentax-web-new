// Adds a `## Florida` section to the comparative state article in es/fr/de/pt/ca.
// Idempotent: if the file already mentions "Florida" it is left untouched.
// English already covers Florida via prior edits, so it is skipped here.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "client/src/data/blog-content");
const FILE = "nuevo-mexico-vs-wyoming-vs-delaware.ts";

const SECTIONS = {
  es: {
    afterHeading: "## Delaware: para C-Corps y grandes empresas",
    title: "## Florida: el cuarto estado a considerar",
    body: `Florida se ha popularizado por su ausencia de state income tax y por su reputación pro-negocios. Para un no residente, sin embargo, conviene tener claros los matices.

- **Annual Report obligatorio:** se presenta cada año antes del 1 de mayo. Si te lo saltas, el estado disuelve la LLC y aplica sanciones.
- **Privacidad baja:** los nombres de members y managers aparecen en el registro público Sunbiz.org.
- **Coste estatal:** filing fee inicial superior al de Nuevo México y similar a Wyoming, más el Annual Report cada año.
- **Tiempos:** 1-3 días hábiles en estándar; mismo día con tasa exprés.
- **Ideal para:** emprendedores con presencia física en EE. UU., operaciones reales o equipo en el estado.

Para un negocio puramente digital y sin nexus en EE. UU., Nuevo México o Wyoming siguen ofreciendo mejor relación coste-privacidad. Florida tiene sentido cuando hay actividad operativa real en el estado o cuando la marca del cliente está vinculada al ecosistema floridano. Si tu caso es Florida, revisa nuestro <a href="/es/servicios/llc-florida">plan LLC Florida</a> con todo el detalle del Annual Report y las particularidades de Sunbiz.`,
  },
  fr: {
    afterHeading: "## Delaware: pour les C-Corps et les grandes entreprises",
    title: "## Floride: le quatrième État à considérer",
    body: `La Floride est connue pour son absence de state income tax et son image pro-business. Pour un non-résident, il faut toutefois bien comprendre les nuances.

- **Annual Report obligatoire:** à déposer chaque année avant le 1er mai. En cas d'oubli, l'État dissout la LLC et applique des pénalités.
- **Confidentialité faible:** les noms des members et managers apparaissent dans le registre public Sunbiz.org.
- **Coût étatique:** frais de constitution supérieurs au Nouveau-Mexique et proches du Wyoming, plus l'Annual Report chaque année.
- **Délais:** 1 à 3 jours ouvrés en standard; même jour en express.
- **Idéal pour:** les entrepreneurs avec présence physique aux États-Unis, des opérations réelles ou une équipe dans l'État.

Pour un business 100 % digital sans nexus aux États-Unis, le Nouveau-Mexique ou le Wyoming offrent toujours un meilleur rapport coût-confidentialité. La Floride prend du sens quand l'activité est réellement présente sur place. Si c'est votre cas, consultez notre <a href="/fr/services/llc-floride">offre LLC Floride</a> avec le détail de l'Annual Report et des spécificités de Sunbiz.`,
  },
  de: {
    afterHeading: "## Delaware: Für C-Corps und große Unternehmen",
    title: "## Florida: Der vierte Bundesstaat zur Auswahl",
    body: `Florida ist beliebt wegen der nicht vorhandenen State Income Tax und seines wirtschaftsfreundlichen Rufs. Für Nichtansässige sollten jedoch einige Punkte klar sein.

- **Pflicht-Annual-Report:** jedes Jahr bis spätestens 1. Mai einzureichen. Wer den Termin verpasst, dessen LLC wird vom Staat aufgelöst und mit Strafen belegt.
- **Geringe Privatsphäre:** Namen von Members und Managern erscheinen im öffentlichen Register Sunbiz.org.
- **Staatliche Kosten:** Gründungsgebühr höher als New Mexico und ähnlich Wyoming, plus jährlicher Annual Report.
- **Zeitrahmen:** 1-3 Werktage Standard; gleicher Tag im Express.
- **Ideal für:** Unternehmer mit physischer Präsenz in den USA, echten Operationen oder einem Team im Bundesstaat.

Für ein rein digitales Geschäft ohne US-Nexus bieten New Mexico oder Wyoming weiterhin ein besseres Verhältnis von Kosten zu Privatsphäre. Florida ergibt Sinn, wenn dort tatsächlich operative Aktivität stattfindet. Trifft das auf dich zu, schau dir unser <a href="/de/leistungen/llc-florida">LLC-Florida-Angebot</a> mit allen Details zum Annual Report und Sunbiz-Spezifika an.`,
  },
  pt: {
    afterHeading: "## Delaware: para C-Corps e grandes empresas",
    title: "## Florida: o quarto estado a considerar",
    body: `A Florida ficou popular pela ausência de state income tax e pela sua reputação pró-negócios. Para um não residente, contudo, há nuances importantes.

- **Annual Report obrigatório:** apresenta-se todos os anos antes de 1 de maio. Se for esquecido, o estado dissolve a LLC e aplica sanções.
- **Privacidade baixa:** os nomes dos members e managers aparecem no registo público Sunbiz.org.
- **Custo estadual:** filing fee inicial superior ao do Novo México e semelhante ao do Wyoming, mais o Annual Report todos os anos.
- **Prazos:** 1-3 dias úteis em standard; no próprio dia com taxa expressa.
- **Ideal para:** empreendedores com presença física nos EUA, operações reais ou equipa no estado.

Para um negócio puramente digital e sem nexus nos EUA, o Novo México ou o Wyoming continuam a oferecer melhor relação custo-privacidade. A Florida faz sentido quando há atividade operacional real no estado. Se for o seu caso, consulte o nosso <a href="/pt/servicos/llc-florida">plano LLC Florida</a> com o detalhe do Annual Report e das especificidades do Sunbiz.`,
  },
  ca: {
    afterHeading: "## Delaware: per a C-Corps i grans empreses",
    title: "## Florida: el quart estat a considerar",
    body: `Florida s'ha popularitzat per l'absència de state income tax i per la seva reputació pro-negocis. Per a un no resident, però, convé tenir clars els matisos.

- **Annual Report obligatori:** es presenta cada any abans de l'1 de maig. Si te'l saltes, l'estat dissol la LLC i aplica sancions.
- **Privacitat baixa:** els noms de members i managers apareixen al registre públic Sunbiz.org.
- **Cost estatal:** filing fee inicial superior al de Nou Mèxic i similar al de Wyoming, més l'Annual Report cada any.
- **Temps:** 1-3 dies hàbils en estàndard; mateix dia amb taxa exprés.
- **Ideal per a:** emprenedors amb presència física als EUA, operacions reals o equip a l'estat.

Per a un negoci purament digital i sense nexus als EUA, Nou Mèxic o Wyoming continuen oferint millor relació cost-privacitat. Florida té sentit quan hi ha activitat operativa real a l'estat. Si és el teu cas, consulta el nostre <a href="/ca/serveis/llc-florida">pla LLC Florida</a> amb tot el detall de l'Annual Report i les particularitats de Sunbiz.`,
  },
};

let touched = 0;
for (const [lang, spec] of Object.entries(SECTIONS)) {
  const file = path.join(ROOT, lang, FILE);
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  if (/florida/i.test(src)) continue; // already covered
  const idx = src.indexOf(spec.afterHeading);
  if (idx === -1) {
    console.warn(`[${lang}] anchor not found, skipping`);
    continue;
  }
  // Insert before the next "## " (or "### ") heading after the Delaware section.
  const searchFrom = idx + spec.afterHeading.length;
  const next = src.slice(searchFrom).search(/\n## /);
  const insertAt = next === -1 ? src.lastIndexOf("`") : searchFrom + next + 1;
  const block = `${spec.title}\n\n${spec.body}\n\n`;
  const out = src.slice(0, insertAt) + block + src.slice(insertAt);
  fs.writeFileSync(file, out);
  touched++;
  console.log(`[${lang}] Florida section inserted`);
}
console.log(`Total files modified: ${touched}`);
