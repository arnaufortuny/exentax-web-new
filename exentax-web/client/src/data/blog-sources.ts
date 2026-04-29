/**
 * Source-of-truth registry for the per-article "Sources / Fuentes" block
 * rendered at the bottom of every blog post (just before the final CTA).
 *
 * Convention (see also `docs/blog-sources.md`):
 *  - Every base slug (Spanish slug under `client/src/data/blog-content/es/`)
 *    must declare in SOURCES_BY_SLUG which sections of which internal docs
 *    actually back the article. The hardcoded "§BOI/CTA and §Form 5472"
 *    line that used to sit in every Markdown file is dead and forbidden.
 *  - The renderer (post.tsx) strips any leftover legacy "Sources:" line and
 *    "verified facts file is kept at docs/...md" intro line, then appends a
 *    visually-distinct block built from the entries below.
 *  - Documents are presented with human-readable labels (translated). The
 *    raw `docs/...md` path is never shown to the reader.
 *  - All docs in DOC_REGISTRY are internal Exentax editorial sources, so we
 *    do NOT emit anchor URLs to them; the reader sees only the document
 *    label and its section.
 */

export type SupportedLang = "es" | "en" | "fr" | "de" | "pt" | "ca";

const LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];

type I18nString = Record<SupportedLang, string>;

export type DocSection = {
  /** Stable id within the doc (matches a § / heading in the .md file). */
  id: string;
  /** Translated section label (without the leading § sign). */
  label: I18nString;
  /** Heading text in the actual .md file used by the check script to verify
   *  the section still exists. Plain ASCII substring match is enough. */
  headingMatch: string;
};

export type DocEntry = {
  id: string;
  /** Path relative to the repository root used by the check script only. */
  path: string;
  /** Reader-facing title for the document (translated). */
  label: I18nString;
  sections: Record<string, DocSection>;
};

export const DOC_REGISTRY: Record<string, DocEntry> = {
  "banking-facts-2026": {
    id: "banking-facts-2026",
    path: "exentax-web/docs/banking-facts-2026.md",
    label: {
      es: "Exentax Banking Facts 2026",
      en: "Exentax Banking Facts 2026",
      fr: "Exentax Banking Facts 2026",
      de: "Exentax Banking Facts 2026",
      pt: "Exentax Banking Facts 2026",
      ca: "Exentax Banking Facts 2026",
    },
    sections: {
      "mercury": {
        id: "mercury",
        headingMatch: "## Mercury",
        label: {
          es: "Mercury",
          en: "Mercury",
          fr: "Mercury",
          de: "Mercury",
          pt: "Mercury",
          ca: "Mercury",
        },
      },
      "slash": {
        id: "slash",
        headingMatch: "## Slash",
        label: { es: "Slash", en: "Slash", fr: "Slash", de: "Slash", pt: "Slash", ca: "Slash" },
      },
      "relay": {
        id: "relay",
        headingMatch: "## Relay",
        label: { es: "Relay", en: "Relay", fr: "Relay", de: "Relay", pt: "Relay", ca: "Relay" },
      },
      "wallester": {
        id: "wallester",
        headingMatch: "## Wallester",
        label: { es: "Wallester", en: "Wallester", fr: "Wallester", de: "Wallester", pt: "Wallester", ca: "Wallester" },
      },
      "wise-business": {
        id: "wise-business",
        headingMatch: "## Wise Business",
        label: { es: "Wise Business", en: "Wise Business", fr: "Wise Business", de: "Wise Business", pt: "Wise Business", ca: "Wise Business" },
      },
      "revolut-business": {
        id: "revolut-business",
        headingMatch: "## Revolut Business",
        label: { es: "Revolut Business", en: "Revolut Business", fr: "Revolut Business", de: "Revolut Business", pt: "Revolut Business", ca: "Revolut Business" },
      },
      "stripe": {
        id: "stripe",
        headingMatch: "## Stripe",
        label: { es: "Stripe", en: "Stripe", fr: "Stripe", de: "Stripe", pt: "Stripe", ca: "Stripe" },
      },
      "payoneer": {
        id: "payoneer",
        headingMatch: "## Payoneer",
        label: { es: "Payoneer", en: "Payoneer", fr: "Payoneer", de: "Payoneer", pt: "Payoneer", ca: "Payoneer" },
      },
      "ibkr": {
        id: "ibkr",
        headingMatch: "## Interactive Brokers",
        label: { es: "Interactive Brokers (IBKR)", en: "Interactive Brokers (IBKR)", fr: "Interactive Brokers (IBKR)", de: "Interactive Brokers (IBKR)", pt: "Interactive Brokers (IBKR)", ca: "Interactive Brokers (IBKR)" },
      },
      "kraken": {
        id: "kraken",
        headingMatch: "## Kraken",
        label: { es: "Kraken", en: "Kraken", fr: "Kraken", de: "Kraken", pt: "Kraken", ca: "Kraken" },
      },
      "recommended-stacks": {
        id: "recommended-stacks",
        headingMatch: "## Recommended primary stacks",
        label: {
          es: "Stacks bancarios recomendados (2026)",
          en: "Recommended primary stacks (2026)",
          fr: "Stacks bancaires recommandés (2026)",
          de: "Empfohlene Primär-Stacks (2026)",
          pt: "Stacks bancários recomendados (2026)",
          ca: "Stacks bancaris recomanats (2026)",
        },
      },
      "boi-cta": {
        id: "boi-cta",
        headingMatch: "### BOI / CTA",
        label: {
          es: "BOI / Corporate Transparency Act",
          en: "BOI / Corporate Transparency Act",
          fr: "BOI / Corporate Transparency Act",
          de: "BOI / Corporate Transparency Act",
          pt: "BOI / Corporate Transparency Act",
          ca: "BOI / Corporate Transparency Act",
        },
      },
      "form-5472": {
        id: "form-5472",
        headingMatch: "### Form 5472 + pro-forma Form 1120",
        label: {
          es: "Form 5472 + 1120 pro-forma",
          en: "Form 5472 + pro-forma 1120",
          fr: "Form 5472 + 1120 pro-forma",
          de: "Form 5472 + Pro-forma 1120",
          pt: "Form 5472 + 1120 pro-forma",
          ca: "Form 5472 + 1120 pro-forma",
        },
      },
      "form-1120-substantive": {
        id: "form-1120-substantive",
        headingMatch: "### Form 1120 (substantive)",
        label: {
          es: "Form 1120 sustantivo",
          en: "Form 1120 (substantive)",
          fr: "Form 1120 (substantif)",
          de: "Form 1120 (materiell)",
          pt: "Form 1120 (substantivo)",
          ca: "Form 1120 substantiu",
        },
      },
      "crs": {
        id: "crs",
        headingMatch: "### CRS",
        label: {
          es: "CRS — Estándar Común de Comunicación",
          en: "CRS — Common Reporting Standard",
          fr: "CRS — Standard Commun de Déclaration",
          de: "CRS — Gemeinsamer Meldestandard",
          pt: "CRS — Norma Comum de Comunicação",
          ca: "CRS — Estàndard Comú de Comunicació",
        },
      },
      "fatca": {
        id: "fatca",
        headingMatch: "### FATCA",
        label: {
          es: "FATCA — Foreign Account Tax Compliance Act",
          en: "FATCA — Foreign Account Tax Compliance Act",
          fr: "FATCA — Foreign Account Tax Compliance Act",
          de: "FATCA — Foreign Account Tax Compliance Act",
          pt: "FATCA — Foreign Account Tax Compliance Act",
          ca: "FATCA — Foreign Account Tax Compliance Act",
        },
      },
      "primary-sources": {
        id: "primary-sources",
        headingMatch: "### Primary sources",
        label: {
          es: "Fuentes primarias 2026 (IRS, FinCEN, OCDE, EUR-Lex, BOE)",
          en: "Primary sources 2026 (IRS, FinCEN, OECD, EUR-Lex, BOE)",
          fr: "Sources primaires 2026 (IRS, FinCEN, OCDE, EUR-Lex, BOE)",
          de: "Primärquellen 2026 (IRS, FinCEN, OECD, EUR-Lex, BOE)",
          pt: "Fontes primárias 2026 (IRS, FinCEN, OCDE, EUR-Lex, BOE)",
          ca: "Fonts primàries 2026 (IRS, FinCEN, OCDE, EUR-Lex, BOE)",
        },
      },
      "crs-terminology": {
        id: "crs-terminology",
        headingMatch: "## CRS terminology by language",
        label: {
          es: "Terminología CRS por idioma",
          en: "CRS terminology by language",
          fr: "Terminologie CRS par langue",
          de: "CRS-Terminologie nach Sprache",
          pt: "Terminologia CRS por idioma",
          ca: "Terminologia CRS per idioma",
        },
      },
    },
  },
  "fact-check-2026": {
    id: "fact-check-2026",
    path: "exentax-web/docs/fact-check-2026.md",
    label: {
      es: "Exentax Fact-Check 2026",
      en: "Exentax Fact-Check 2026",
      fr: "Exentax Fact-Check 2026",
      de: "Exentax Fact-Check 2026",
      pt: "Exentax Fact-Check 2026",
      ca: "Exentax Fact-Check 2026",
    },
    sections: {
      "audit": {
        id: "audit",
        headingMatch: "# Fact-check audit report",
        label: {
          es: "Auditoría editorial 2026",
          en: "Editorial audit report 2026",
          fr: "Rapport d'audit éditorial 2026",
          de: "Editorial-Audit-Bericht 2026",
          pt: "Relatório de auditoria editorial 2026",
          ca: "Informe d'auditoria editorial 2026",
        },
      },
    },
  },
  "tax-content-annual-review": {
    id: "tax-content-annual-review",
    path: "exentax-web/docs/tax-content-annual-review.md",
    label: {
      es: "Revisión anual de contenido fiscal Exentax",
      en: "Exentax annual tax content review",
      fr: "Revue annuelle du contenu fiscal Exentax",
      de: "Jährliche Steuerinhaltsprüfung Exentax",
      pt: "Revisão anual de conteúdo fiscal Exentax",
      ca: "Revisió anual de contingut fiscal Exentax",
    },
    sections: {
      "annual-review": {
        id: "annual-review",
        headingMatch: "## Figures to re-verify",
        label: {
          es: "Cifras IRS verificadas anualmente (Pub. 515 / 901, W-8BEN-E, 1042-S)",
          en: "Annually verified IRS figures (Pub. 515 / 901, W-8BEN-E, 1042-S)",
          fr: "Données IRS vérifiées chaque année (Pub. 515 / 901, W-8BEN-E, 1042-S)",
          de: "Jährlich überprüfte IRS-Zahlen (Pub. 515 / 901, W-8BEN-E, 1042-S)",
          pt: "Valores IRS verificados anualmente (Pub. 515 / 901, W-8BEN-E, 1042-S)",
          ca: "Xifres IRS verificades anualment (Pub. 515 / 901, W-8BEN-E, 1042-S)",
        },
      },
    },
  },
  "veracity-audit": {
    id: "veracity-audit",
    path: "exentax-web/docs/veracity-audit.md",
    label: {
      es: "Auditoría de veracidad de contenido Exentax",
      en: "Exentax content veracity audit",
      fr: "Audit de véracité du contenu Exentax",
      de: "Exentax-Inhalts-Wahrheitsprüfung",
      pt: "Auditoria de veracidade de conteúdo Exentax",
      ca: "Auditoria de veracitat de contingut Exentax",
    },
    sections: {
      "veracity": {
        id: "veracity",
        headingMatch: "## Criterios aplicados",
        label: {
          es: "Criterios editoriales (sin promesas, lenguaje condicional)",
          en: "Editorial criteria (no promises, conditional language)",
          fr: "Critères éditoriaux (pas de promesses, langage conditionnel)",
          de: "Redaktionelle Kriterien (keine Versprechen, konditionale Sprache)",
          pt: "Critérios editoriais (sem promessas, linguagem condicional)",
          ca: "Criteris editorials (sense promeses, llenguatge condicional)",
        },
      },
    },
  },
};

/** A reference inside the per-article "Sources" block. Two flavours:
 *   - Internal: `{ doc, section }` resolves to a DOC_REGISTRY entry
 *     (Exentax editorial doc) and renders as plain text "Doc · §Section".
 *   - External: `{ external }` resolves to OFFICIAL_SOURCES (primary
 *     authority URL — IRS, FinCEN, AEAT, Seg-Social, EUR-Lex, OECD, BOE)
 *     and renders as a real anchor link opened in a new tab. Required by
 *     the audit for articles citing 2026 figures (BOI/CTA, Form 5472,
 *     RETA, DAC7/8, CDI EE.UU.–España, CRS). */
export type SourceRef =
  | { doc: string; section: string }
  | { external: string };

/** Primary external authority sources cited at the bottom of critical
 *  articles (Task #6 follow-up). Each entry is a single URL the reader
 *  can click to verify the underlying figure or rule. The label includes
 *  the issuing organisation so the source carries authority signal. */
export type ExternalSource = {
  id: string;
  url: string;
  /** Reader-facing label (translated). Should start with the issuing
   *  organisation, e.g. "FinCEN — Beneficial Ownership Information". */
  label: I18nString;
};

export const OFFICIAL_SOURCES: Record<string, ExternalSource> = {
  "fincen-boi": {
    id: "fincen-boi",
    url: "https://www.fincen.gov/boi",
    label: {
      es: "FinCEN — Beneficial Ownership Information (BOI)",
      en: "FinCEN — Beneficial Ownership Information (BOI)",
      fr: "FinCEN — Beneficial Ownership Information (BOI)",
      de: "FinCEN — Beneficial Ownership Information (BOI)",
      pt: "FinCEN — Beneficial Ownership Information (BOI)",
      ca: "FinCEN — Beneficial Ownership Information (BOI)",
    },
  },
  "irs-form-5472": {
    id: "irs-form-5472",
    url: "https://www.irs.gov/forms-pubs/about-form-5472",
    label: {
      es: "IRS — About Form 5472",
      en: "IRS — About Form 5472",
      fr: "IRS — About Form 5472",
      de: "IRS — About Form 5472",
      pt: "IRS — About Form 5472",
      ca: "IRS — About Form 5472",
    },
  },
  "irs-form-1120": {
    id: "irs-form-1120",
    url: "https://www.irs.gov/forms-pubs/about-form-1120",
    label: {
      es: "IRS — About Form 1120",
      en: "IRS — About Form 1120",
      fr: "IRS — About Form 1120",
      de: "IRS — About Form 1120",
      pt: "IRS — About Form 1120",
      ca: "IRS — About Form 1120",
    },
  },
  "us-spain-treaty": {
    id: "us-spain-treaty",
    url: "https://www.irs.gov/pub/irs-trty/spain.pdf",
    label: {
      es: "Convenio Doble Imposición EE. UU.–España (texto oficial IRS)",
      en: "U.S.–Spain Double Taxation Treaty (IRS official text)",
      fr: "Convention de double imposition USA–Espagne (texte officiel IRS)",
      de: "Doppelbesteuerungsabkommen USA–Spanien (IRS Originaltext)",
      pt: "Convenção de Dupla Tributação EUA–Espanha (texto oficial IRS)",
      ca: "Conveni de Doble Imposició EUA–Espanya (text oficial IRS)",
    },
  },
  "aeat-cdi": {
    id: "aeat-cdi",
    url: "https://www.hacienda.gob.es/es-ES/Normativa%20y%20doctrina/Normativa/CDI/Paginas/cdi.aspx",
    label: {
      es: "Hacienda — Convenios para evitar la doble imposición firmados por España",
      en: "Hacienda (Spain) — Double-taxation treaties signed by Spain",
      fr: "Hacienda (Espagne) — Conventions de double imposition signées par l'Espagne",
      de: "Hacienda (Spanien) — Von Spanien unterzeichnete Doppelbesteuerungsabkommen",
      pt: "Hacienda (Espanha) — Convenções de dupla tributação assinadas pela Espanha",
      ca: "Hisenda (Espanya) — Convenis per evitar la doble imposició signats per Espanya",
    },
  },
  "seg-social-reta": {
    id: "seg-social-reta",
    url: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537",
    label: {
      es: "Seguridad Social — Cotización del RETA (autónomos) 2026",
      en: "Seguridad Social — RETA self-employed contributions 2026",
      fr: "Sécurité Sociale (Espagne) — Cotisations RETA travailleurs autonomes 2026",
      de: "Spanische Sozialversicherung — RETA-Beiträge für Selbständige 2026",
      pt: "Segurança Social (Espanha) — Quotas do RETA (autónomos) 2026",
      ca: "Seguretat Social — Cotització del RETA (autònoms) 2026",
    },
  },
  "eu-dac7": {
    id: "eu-dac7",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32021L0514",
    label: {
      es: "EUR-Lex — Directiva (UE) 2021/514 (DAC7)",
      en: "EUR-Lex — Directive (EU) 2021/514 (DAC7)",
      fr: "EUR-Lex — Directive (UE) 2021/514 (DAC7)",
      de: "EUR-Lex — Richtlinie (EU) 2021/514 (DAC7)",
      pt: "EUR-Lex — Diretiva (UE) 2021/514 (DAC7)",
      ca: "EUR-Lex — Directiva (UE) 2021/514 (DAC7)",
    },
  },
  "eu-dac8": {
    id: "eu-dac8",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023L2226",
    label: {
      es: "EUR-Lex — Directiva (UE) 2023/2226 (DAC8)",
      en: "EUR-Lex — Directive (EU) 2023/2226 (DAC8)",
      fr: "EUR-Lex — Directive (UE) 2023/2226 (DAC8)",
      de: "EUR-Lex — Richtlinie (EU) 2023/2226 (DAC8)",
      pt: "EUR-Lex — Diretiva (UE) 2023/2226 (DAC8)",
      ca: "EUR-Lex — Directiva (UE) 2023/2226 (DAC8)",
    },
  },
  "oecd-crs": {
    id: "oecd-crs",
    url: "https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/",
    label: {
      es: "OCDE — Common Reporting Standard (CRS)",
      en: "OECD — Common Reporting Standard (CRS)",
      fr: "OCDE — Common Reporting Standard (CRS)",
      de: "OECD — Common Reporting Standard (CRS)",
      pt: "OCDE — Common Reporting Standard (CRS)",
      ca: "OCDE — Common Reporting Standard (CRS)",
    },
  },
  "eu-dac": {
    id: "eu-dac",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02011L0016-20230101",
    label: {
      es: "EUR-Lex — Directiva 2011/16/UE (DAC, cooperación administrativa)",
      en: "EUR-Lex — Directive 2011/16/EU (DAC, administrative cooperation)",
      fr: "EUR-Lex — Directive 2011/16/UE (DAC, coopération administrative)",
      de: "EUR-Lex — Richtlinie 2011/16/EU (DAC, Amtshilfe)",
      pt: "EUR-Lex — Diretiva 2011/16/UE (DAC, cooperação administrativa)",
      ca: "EUR-Lex — Directiva 2011/16/UE (DAC, cooperació administrativa)",
    },
  },
  "boe-irpf": {
    id: "boe-irpf",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764",
    label: {
      es: "BOE — Ley 35/2006 del IRPF (texto consolidado)",
      en: "BOE — Spanish Personal Income Tax Act 35/2006 (consolidated text)",
      fr: "BOE — Loi espagnole 35/2006 sur l'IRPF (texte consolidé)",
      de: "BOE — Spanisches Einkommensteuergesetz 35/2006 (konsolidierte Fassung)",
      pt: "BOE — Lei espanhola 35/2006 do IRPF (texto consolidado)",
      ca: "BOE — Llei 35/2006 de l'IRPF (text consolidat)",
    },
  },
  "boe-lis": {
    id: "boe-lis",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2014-12328",
    label: {
      es: "BOE — Ley 27/2014 del Impuesto sobre Sociedades (texto consolidado)",
      en: "BOE — Spanish Corporate Income Tax Act 27/2014 (consolidated text)",
      fr: "BOE — Loi espagnole 27/2014 sur l'Impôt sur les Sociétés (texte consolidé)",
      de: "BOE — Spanisches Körperschaftsteuergesetz 27/2014 (konsolidierte Fassung)",
      pt: "BOE — Lei espanhola 27/2014 do Imposto sobre Sociedades (texto consolidado)",
      ca: "BOE — Llei 27/2014 de l'Impost sobre Societats (text consolidat)",
    },
  },
  "aeat-modelo-100": {
    id: "aeat-modelo-100",
    url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G600.shtml",
    label: {
      es: "AEAT — Modelo 100 (declaración del IRPF)",
      en: "AEAT — Form 100 (Spanish Personal Income Tax return)",
      fr: "AEAT — Formulaire 100 (déclaration espagnole d'IRPF)",
      de: "AEAT — Formular 100 (spanische Einkommensteuererklärung)",
      pt: "AEAT — Modelo 100 (declaração espanhola de IRPF)",
      ca: "AEAT — Model 100 (declaració de l'IRPF)",
    },
  },
  "aeat-modelo-200": {
    id: "aeat-modelo-200",
    url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/GI49.shtml",
    label: {
      es: "AEAT — Modelo 200 (declaración del Impuesto sobre Sociedades)",
      en: "AEAT — Form 200 (Spanish Corporate Income Tax return)",
      fr: "AEAT — Formulaire 200 (déclaration espagnole d'IS)",
      de: "AEAT — Formular 200 (spanische Körperschaftsteuererklärung)",
      pt: "AEAT — Modelo 200 (declaração espanhola de IS)",
      ca: "AEAT — Model 200 (declaració de l'Impost sobre Societats)",
    },
  },
  "aeat-modelo-349": {
    id: "aeat-modelo-349",
    url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G415.shtml",
    label: {
      es: "AEAT — Modelo 349 (operaciones intracomunitarias)",
      en: "AEAT — Form 349 (recapitulative statement, EU intra-community operations)",
      fr: "AEAT — Formulaire 349 (état récapitulatif des opérations intracommunautaires)",
      de: "AEAT — Formular 349 (zusammenfassende Meldung innergemeinschaftlicher Umsätze)",
      pt: "AEAT — Modelo 349 (operações intracomunitárias)",
      ca: "AEAT — Model 349 (operacions intracomunitàries)",
    },
  },
  "eu-vat-directive": {
    id: "eu-vat-directive",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02006L0112-20240101",
    label: {
      es: "EUR-Lex — Directiva 2006/112/CE del IVA (consolidada)",
      en: "EUR-Lex — VAT Directive 2006/112/EC (consolidated)",
      fr: "EUR-Lex — Directive 2006/112/CE relative à la TVA (consolidée)",
      de: "EUR-Lex — Mehrwertsteuer-Richtlinie 2006/112/EG (konsolidiert)",
      pt: "EUR-Lex — Diretiva 2006/112/CE do IVA (consolidada)",
      ca: "EUR-Lex — Directiva 2006/112/CE de l'IVA (consolidada)",
    },
  },
  "irs-fatca": {
    id: "irs-fatca",
    url: "https://www.irs.gov/businesses/corporations/foreign-account-tax-compliance-act-fatca",
    label: {
      es: "IRS — Foreign Account Tax Compliance Act (FATCA)",
      en: "IRS — Foreign Account Tax Compliance Act (FATCA)",
      fr: "IRS — Foreign Account Tax Compliance Act (FATCA)",
      de: "IRS — Foreign Account Tax Compliance Act (FATCA)",
      pt: "IRS — Foreign Account Tax Compliance Act (FATCA)",
      ca: "IRS — Foreign Account Tax Compliance Act (FATCA)",
    },
  },
  "treasury-fatca-igas": {
    id: "treasury-fatca-igas",
    url: "https://home.treasury.gov/policy-issues/tax-policy/foreign-account-tax-compliance-act",
    label: {
      es: "U.S. Treasury — FATCA y acuerdos intergubernamentales (IGAs)",
      en: "U.S. Treasury — FATCA and Intergovernmental Agreements (IGAs)",
      fr: "U.S. Treasury — FATCA et accords intergouvernementaux (IGAs)",
      de: "U.S. Treasury — FATCA und zwischenstaatliche Abkommen (IGAs)",
      pt: "U.S. Treasury — FATCA e acordos intergovernamentais (IGAs)",
      ca: "U.S. Treasury — FATCA i acords intergovernamentals (IGAs)",
    },
  },
  "delaware-doc": {
    id: "delaware-doc",
    url: "https://corp.delaware.gov/",
    label: {
      es: "Delaware Division of Corporations — registro oficial de entidades",
      en: "Delaware Division of Corporations — official entity registry",
      fr: "Delaware Division of Corporations — registre officiel des entités",
      de: "Delaware Division of Corporations — offizielles Unternehmensregister",
      pt: "Delaware Division of Corporations — registo oficial de entidades",
      ca: "Delaware Division of Corporations — registre oficial d'entitats",
    },
  },
  "oecd-carf": {
    id: "oecd-carf",
    url: "https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm",
    label: {
      es: "OCDE — Crypto-Asset Reporting Framework (CARF) y enmiendas al CRS",
      en: "OECD — Crypto-Asset Reporting Framework (CARF) and CRS amendments",
      fr: "OCDE — Crypto-Asset Reporting Framework (CARF) et amendements au CRS",
      de: "OECD — Crypto-Asset Reporting Framework (CARF) und CRS-Änderungen",
      pt: "OCDE — Crypto-Asset Reporting Framework (CARF) e alterações ao CRS",
      ca: "OCDE — Crypto-Asset Reporting Framework (CARF) i esmenes al CRS",
    },
  },
};

/** Reader-facing label for the whole block, per language. */
export const SOURCES_LABEL: I18nString = {
  es: "Fuentes Exentax",
  en: "Exentax Sources",
  fr: "Les sources Exentax",
  de: "Exentax-Quellen",
  pt: "Fontes Exentax",
  ca: "Fonts Exentax",
};

// ── Topic-based source bundles ──────────────────────────────────────────

const BANKING_STACK: SourceRef[] = [
  { doc: "banking-facts-2026", section: "recommended-stacks" },
  { doc: "banking-facts-2026", section: "mercury" },
  { doc: "banking-facts-2026", section: "wise-business" },
];

const BOI_5472: SourceRef[] = [
  { doc: "banking-facts-2026", section: "boi-cta" },
  { doc: "banking-facts-2026", section: "form-5472" },
  { doc: "banking-facts-2026", section: "primary-sources" },
];

const CRS_FATCA: SourceRef[] = [
  { doc: "banking-facts-2026", section: "crs" },
  { doc: "banking-facts-2026", section: "fatca" },
  { doc: "banking-facts-2026", section: "primary-sources" },
];

const LLC_FUNDAMENTALS: SourceRef[] = [
  { doc: "banking-facts-2026", section: "form-5472" },
  { doc: "banking-facts-2026", section: "form-1120-substantive" },
  { doc: "fact-check-2026", section: "audit" },
];

const SPAIN_TAX: SourceRef[] = [
  { doc: "veracity-audit", section: "veracity" },
  { doc: "fact-check-2026", section: "audit" },
  { doc: "banking-facts-2026", section: "form-5472" },
];

const INTL_JURISDICTIONS: SourceRef[] = [
  { doc: "veracity-audit", section: "veracity" },
  { doc: "banking-facts-2026", section: "crs" },
  { doc: "fact-check-2026", section: "audit" },
];

const NICHE_BUSINESS: SourceRef[] = [
  { doc: "banking-facts-2026", section: "recommended-stacks" },
  { doc: "fact-check-2026", section: "audit" },
  { doc: "tax-content-annual-review", section: "annual-review" },
];

const W8_BROKER: SourceRef[] = [
  { doc: "tax-content-annual-review", section: "annual-review" },
  { doc: "banking-facts-2026", section: "fatca" },
  { doc: "fact-check-2026", section: "audit" },
];

/** Per-article (Spanish base slug) source assignment. Every base slug under
 *  client/src/data/blog-content/es/ MUST appear here. The check script
 *  enforces that. */
export const SOURCES_BY_SLUG: Record<string, SourceRef[]> = {
  // ── banking-stack ───────────────────────────────────────────────────
  "bancos-vs-fintech-llc-donde-abrir-cuenta": BANKING_STACK,
  "cambiar-divisas-llc-mejores-opciones": [
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "recommended-stacks" },
    { doc: "banking-facts-2026", section: "relay" },
  ],
  "cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad": [
    { doc: "banking-facts-2026", section: "boi-cta" },
    { doc: "banking-facts-2026", section: "form-5472" },
    { doc: "fact-check-2026", section: "audit" },
  ],
  "cuenta-bancaria-mercury-llc-extranjero": [
    { doc: "banking-facts-2026", section: "mercury" },
    { doc: "banking-facts-2026", section: "recommended-stacks" },
    { doc: "banking-facts-2026", section: "relay" },
  ],
  "due-diligence-bancario-llc-americana": BANKING_STACK,
  "evitar-bloqueos-mercury-wise-revolut": [
    { doc: "banking-facts-2026", section: "mercury" },
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "revolut-business" },
  ],
  "iban-swift-routing-number-que-son": [
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "wallester" },
    { doc: "banking-facts-2026", section: "relay" },
  ],
  "justificar-origen-fondos-kyc-bancario-segunda-ronda": BANKING_STACK,
  "pasarelas-pago-llc-stripe-paypal-dodo": [
    { doc: "banking-facts-2026", section: "stripe" },
    { doc: "banking-facts-2026", section: "payoneer" },
    { doc: "banking-facts-2026", section: "recommended-stacks" },
  ],
  "reorganizar-banca-llc-mercury-relay-wise": [
    { doc: "banking-facts-2026", section: "mercury" },
    { doc: "banking-facts-2026", section: "relay" },
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "recommended-stacks" },
  ],
  "tiempos-pagos-ach-wire-transfer": [
    { doc: "banking-facts-2026", section: "relay" },
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "recommended-stacks" },
  ],
  "wise-bancos-llc-stack-bancaria-completa": [
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "recommended-stacks" },
    { doc: "banking-facts-2026", section: "crs" },
  ],
  "wise-business-llc-guia": [
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "fatca" },
  ],
  "visa-mastercard-reporting-tarjetas-hacienda": [
    { doc: "banking-facts-2026", section: "wallester" },
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "fatca" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],

  // ── boi/cta + 5472 ──────────────────────────────────────────────────
  // Critical 2026-figures articles get a primary external authority URL
  // (FinCEN BOI / IRS Form 5472) appended to the standard internal bundle.
  "boi-report-fincen-guia-completa-2026": [
    ...BOI_5472,
    { external: "fincen-boi" },
  ],
  "form-5472-que-es-como-presentarlo": [
    ...BOI_5472,
    { external: "irs-form-5472" },
    { external: "irs-form-1120" },
  ],
  "irs-1120-5472-que-son-cuando-aplican": [
    { doc: "banking-facts-2026", section: "form-5472" },
    { doc: "banking-facts-2026", section: "form-1120-substantive" },
    { doc: "banking-facts-2026", section: "primary-sources" },
  ],
  "que-pasa-si-no-presentas-5472-multas-irs": [
    ...BOI_5472,
    { external: "irs-form-5472" },
  ],
  "recuperar-llc-boi-5472-atrasados-procedimiento": [
    ...BOI_5472,
    { external: "fincen-boi" },
    { external: "irs-form-5472" },
  ],
  "extension-irs-form-1120-como-solicitarla": [
    { doc: "banking-facts-2026", section: "form-5472" },
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "banking-facts-2026", section: "form-1120-substantive" },
  ],
  "mantenimiento-anual-llc-obligaciones": [
    ...BOI_5472,
    { external: "fincen-boi" },
    { external: "irs-form-5472" },
  ],
  "ein-numero-fiscal-llc-como-obtenerlo": [
    { doc: "banking-facts-2026", section: "form-5472" },
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "fact-check-2026", section: "audit" },
  ],
  "como-obtener-itin-numero-fiscal-irs": [
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "tax-content-annual-review", section: "annual-review" },
    { doc: "fact-check-2026", section: "audit" },
  ],
  "itin-ssn-que-son-como-obtenerlos": [
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "tax-content-annual-review", section: "annual-review" },
    { doc: "fact-check-2026", section: "audit" },
  ],
  "que-es-irs-guia-duenos-llc": BOI_5472,
  "documentos-llc-cuales-necesitas": BOI_5472,
  "auditoria-rapida-llc-12-puntos-30-minutos": BOI_5472,

  // ── crs / fatca / reporting ────────────────────────────────────────
  "crs-cuentas-bancarias-llc-intercambio-informacion": [
    ...CRS_FATCA,
    { external: "oecd-crs" },
    { external: "eu-dac" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "crs-residentes-espana-latam-implicaciones": [
    ...CRS_FATCA,
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "cuentas-bancarias-usa-reportan-hacienda-verdad": [
    ...CRS_FATCA,
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "dac7-plataformas-digitales-reporting-2026": [
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "banking-facts-2026", section: "fatca" },
    { external: "eu-dac7" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "dac8-criptomonedas-reporting-fiscal-2026": [
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "banking-facts-2026", section: "fatca" },
    { external: "eu-dac8" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
  ],
  "modelo-720-721-residentes-espana-cuentas-cripto-extranjero": [
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "primary-sources" },
    { doc: "veracity-audit", section: "veracity" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "privacidad-llc-americana-secreto-ventaja": CRS_FATCA,
  "revolut-business-crs-reporting-fiscal": [
    { doc: "banking-facts-2026", section: "revolut-business" },
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "fatca" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "w8-ben-y-w8-ben-e-guia-completa": W8_BROKER,
  "wise-business-crs-reporting-fiscal": [
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "fatca" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],
  "wise-iban-llc-que-reporta-hacienda": [
    { doc: "banking-facts-2026", section: "wise-business" },
    { doc: "banking-facts-2026", section: "crs" },
    { doc: "banking-facts-2026", section: "fatca" },
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "eu-dac8" },
  ],

  // ── llc fundamentals ────────────────────────────────────────────────
  "constituir-llc-proceso-paso-a-paso": LLC_FUNDAMENTALS,
  "como-disolver-cerrar-llc-paso-a-paso": LLC_FUNDAMENTALS,
  "como-operar-llc-dia-a-dia": LLC_FUNDAMENTALS,
  "cuanto-cuesta-constituir-llc": LLC_FUNDAMENTALS,
  "documentar-separacion-fondos-llc-historial": LLC_FUNDAMENTALS,
  "llc-estados-unidos-guia-completa-2026": [
    ...LLC_FUNDAMENTALS,
    { doc: "banking-facts-2026", section: "boi-cta" },
  ],
  "llc-seguridad-juridica-proteccion-patrimonial": LLC_FUNDAMENTALS,
  "llc-unica-estructura-holding-cuando-como-cuesta": LLC_FUNDAMENTALS,
  "nuevo-mexico-vs-wyoming-vs-delaware": LLC_FUNDAMENTALS,
  "operating-agreement-llc-que-es": LLC_FUNDAMENTALS,
  "por-que-abrir-llc-estados-unidos-ventajas": LLC_FUNDAMENTALS,
  "primer-mes-llc-que-esperar": LLC_FUNDAMENTALS,
  "problemas-comunes-llc-como-evitarlos": LLC_FUNDAMENTALS,
  "registered-agent-que-es-por-que-necesitas": LLC_FUNDAMENTALS,
  "residentes-no-residentes-llc-diferencias": LLC_FUNDAMENTALS,
  "separar-dinero-personal-llc-por-que-importa": LLC_FUNDAMENTALS,
  "single-member-multi-member-llc-implicaciones-fiscales": LLC_FUNDAMENTALS,
  "tengo-llc-checklist-gestion-correcta": LLC_FUNDAMENTALS,
  "tributacion-llc-segun-actividad-economica": LLC_FUNDAMENTALS,
  "tributacion-pass-through-llc-como-funciona": LLC_FUNDAMENTALS,
  "vender-o-cerrar-llc-comparativa-practica": LLC_FUNDAMENTALS,
  "ventajas-desventajas-llc-no-residentes": LLC_FUNDAMENTALS,
  "bookkeeping-llc-paso-a-paso": LLC_FUNDAMENTALS,
  "errores-criticos-llc-ya-constituida": LLC_FUNDAMENTALS,
  "gastos-deducibles-llc-que-puedes-deducir": LLC_FUNDAMENTALS,
  "holding-empresarial-como-funciona": LLC_FUNDAMENTALS,
  "prevencion-blanqueo-capitales-llc": [
    { doc: "banking-facts-2026", section: "boi-cta" },
    { doc: "fact-check-2026", section: "audit" },
    { doc: "veracity-audit", section: "veracity" },
  ],
  "testaferros-prestanombres-llc-ilegal-riesgos": [
    { doc: "banking-facts-2026", section: "boi-cta" },
    { doc: "fact-check-2026", section: "audit" },
    { doc: "veracity-audit", section: "veracity" },
  ],

  // ── spain tax comparison ───────────────────────────────────────────
  "autonomo-espana-vs-llc-estados-unidos": SPAIN_TAX,
  "autonomos-espana-por-que-dejar-de-serlo": SPAIN_TAX,
  "boe-febrero-2020-llc-doctrina-administrativa": [
    { doc: "fact-check-2026", section: "audit" },
    { doc: "veracity-audit", section: "veracity" },
    { doc: "tax-content-annual-review", section: "annual-review" },
  ],
  "caminos-legales-minimos-impuestos": SPAIN_TAX,
  "convenio-doble-imposicion-usa-espana-llc": [
    { doc: "tax-content-annual-review", section: "annual-review" },
    { doc: "veracity-audit", section: "veracity" },
    { doc: "fact-check-2026", section: "audit" },
    { external: "us-spain-treaty" },
    { external: "aeat-cdi" },
  ],
  "errores-fiscales-freelancers-espanoles": SPAIN_TAX,
  "impuestos-clientes-internacionales-espana": SPAIN_TAX,
  "iva-servicios-digitales-internacional": [
    { doc: "veracity-audit", section: "veracity" },
    { doc: "fact-check-2026", section: "audit" },
    { doc: "tax-content-annual-review", section: "annual-review" },
  ],
  "llc-alternativa-autonomo-espana": SPAIN_TAX,
  "llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais": SPAIN_TAX,
  "pagar-cero-impuestos-legalmente-llc": SPAIN_TAX,

  // ── international jurisdictions ────────────────────────────────────
  "crear-empresa-andorra-ventajas": INTL_JURISDICTIONS,
  "dubai-uae-mito-no-impuestos": INTL_JURISDICTIONS,
  "empresa-bulgaria-10-tributacion": INTL_JURISDICTIONS,
  "empresa-panama-fiscalidad-residencia": INTL_JURISDICTIONS,
  "empresa-reino-unido-uk-ltd": INTL_JURISDICTIONS,
  "estructura-offshore-beneficios-riesgos": INTL_JURISDICTIONS,
  "fiscalidad-estonia-como-funciona": INTL_JURISDICTIONS,
  "hong-kong-offshore-realidad": INTL_JURISDICTIONS,
  "por-que-no-abrir-empresa-estonia": INTL_JURISDICTIONS,
  "nomada-digital-residencia-fiscal": INTL_JURISDICTIONS,
  "fiscalidad-internacional-emprendedores-digitales": INTL_JURISDICTIONS,
  "fiscalidad-llc-por-pais-residencia": INTL_JURISDICTIONS,
  "fiscalidad-socios-llc-cambio-residencia-mid-year": INTL_JURISDICTIONS,
  "diseno-estructura-fiscal-internacional-solida": INTL_JURISDICTIONS,
  "estructura-fiscal-optima-freelancer-internacional": INTL_JURISDICTIONS,
  "riesgos-fiscales-mala-estructuracion-internacional": INTL_JURISDICTIONS,
  "exit-tax-espana-llc-cripto-interactive-brokers": [
    { doc: "veracity-audit", section: "veracity" },
    { doc: "banking-facts-2026", section: "ibkr" },
    { doc: "banking-facts-2026", section: "kraken" },
  ],

  // ── niche business ─────────────────────────────────────────────────
  "amazon-ecommerce-llc-vender-online": [
    { doc: "banking-facts-2026", section: "stripe" },
    { doc: "banking-facts-2026", section: "payoneer" },
    { doc: "fact-check-2026", section: "audit" },
  ],
  "criptomonedas-trading-llc-impuestos": [
    { doc: "banking-facts-2026", section: "kraken" },
    { doc: "banking-facts-2026", section: "slash" },
    { doc: "banking-facts-2026", section: "crs" },
  ],
  "escalar-negocio-digital-llc-americana": NICHE_BUSINESS,
  "llc-agencias-marketing-digital": NICHE_BUSINESS,
  "llc-creadores-contenido-youtube-twitch": NICHE_BUSINESS,
  "llc-desarrolladores-software-saas": NICHE_BUSINESS,
  "llc-interactive-brokers-invertir-bolsa-usa": [
    { doc: "banking-facts-2026", section: "ibkr" },
    { doc: "tax-content-annual-review", section: "annual-review" },
    { doc: "banking-facts-2026", section: "fatca" },
  ],
  "tramos-irpf-2026": [
    ...SPAIN_TAX,
    { external: "boe-irpf" },
    { external: "aeat-modelo-100" },
  ],
  "cuota-autonomo-2026": [
    ...SPAIN_TAX,
    { external: "seg-social-reta" },
  ],
  "cuotas-autonomos-2026-guia-completa": [
    ...SPAIN_TAX,
    { external: "seg-social-reta" },
  ],
  "gastos-deducibles-autonomos-2026": [
    ...SPAIN_TAX,
    { external: "boe-irpf" },
    { external: "aeat-modelo-100" },
  ],
  "iva-intracomunitario-servicios-europa": [
    ...SPAIN_TAX,
    { external: "eu-vat-directive" },
    { external: "aeat-modelo-349" },
  ],
  "retenciones-irpf-factura": [
    ...SPAIN_TAX,
    { external: "boe-irpf" },
  ],
  "sociedad-limitada-espana-costes-ventajas": [
    ...SPAIN_TAX,
    { external: "boe-lis" },
    { external: "aeat-modelo-200" },
  ],
  "modulos-vs-estimacion-directa-2026": [
    ...SPAIN_TAX,
    { external: "boe-irpf" },
    { external: "aeat-modelo-100" },
  ],
  "diferencia-llc-corporation-s-corp-c-corp": LLC_FUNDAMENTALS,
  "facturar-sin-ser-autonomo-alternativas-2026": SPAIN_TAX,
  // CRS 2.0 + CARF deep-dive — extra primary externals beyond the CRS_FATCA bundle.
  "crs-2-0-carf-por-que-usa-no-firmara-llc": [
    ...CRS_FATCA,
    { external: "oecd-crs" },
    { external: "oecd-carf" },
    { external: "irs-fatca" },
    { external: "treasury-fatca-igas" },
    { external: "eu-dac" },
    { external: "delaware-doc" },
  ],
};

/** Resolve sources for a slug in a given language and return rendered HTML
 *  for the styled "Sources" block. Returns an empty string if the slug has
 *  no entry — the renderer treats that as "no block". */
export function renderSourcesBlockHtml(slug: string, lang: SupportedLang): string {
  const refs = SOURCES_BY_SLUG[slug];
  if (!refs || refs.length === 0) return "";
  const safeLang: SupportedLang = LANGS.includes(lang) ? lang : "es";
  const items: string[] = [];
  for (const ref of refs) {
    if ("external" in ref) {
      const ext = OFFICIAL_SOURCES[ref.external];
      if (!ext) continue;
      const extLabel = escapeHtml(ext.label[safeLang]);
      const extUrl = escapeHtml(ext.url);
      items.push(
        `<li class="article-sources__item article-sources__item--external"><a class="article-sources__link" href="${extUrl}" target="_blank" rel="noopener noreferrer nofollow">${extLabel}</a></li>`,
      );
      continue;
    }
    const doc = DOC_REGISTRY[ref.doc];
    if (!doc) continue;
    const sec = doc.sections[ref.section];
    if (!sec) continue;
    const docLabel = escapeHtml(doc.label[safeLang]);
    const secLabel = escapeHtml(sec.label[safeLang]);
    items.push(
      `<li class="article-sources__item"><span class="article-sources__doc">${docLabel}</span> <span class="article-sources__sep">·</span> <span class="article-sources__section">${secLabel}</span></li>`,
    );
  }
  if (items.length === 0) return "";
  const heading = escapeHtml(SOURCES_LABEL[safeLang]);
  return [
    `<aside class="article-sources" aria-label="${heading}" data-testid="article-sources">`,
    `<div class="article-sources__heading">${heading}</div>`,
    `<ul class="article-sources__list">${items.join("")}</ul>`,
    `</aside>`,
  ].join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Regex used by both runtime stripping and the lint script to detect any
 *  leftover legacy "Sources:" / "verified facts file" lines and raw
 *  `docs/...md` paths in the rendered Markdown. */
export const LEGACY_SOURCES_LINE_REGEX =
  /^(?:Sources|Sources |Fuentes|Quellen|Fontes|Fonts)\s*:\s*`?docs\/[^`\n]+`?[^\n]*\n?/gm;

export const LEGACY_VERIFIED_FACTS_INTRO_REGEX =
  /^[^\n]*`docs\/banking-facts-2026\.md`[^\n]*\n?/gm;

export const RAW_DOCS_PATH_REGEX = /docs\/[a-z0-9-]+\.md/gi;
