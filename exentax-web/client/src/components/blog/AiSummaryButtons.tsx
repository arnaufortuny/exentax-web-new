import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import { getTranslatedSlug } from "@/data/blog-posts";

type Service = "chatgpt" | "perplexity" | "gemini" | "grok";

function buildServiceUrl(service: Service, prompt: string): string {
  const q = encodeURIComponent(prompt);
  switch (service) {
    case "chatgpt":
      return `https://chatgpt.com/?q=${q}`;
    case "perplexity":
      return `https://www.perplexity.ai/search?q=${q}`;
    case "gemini":
      return `https://gemini.google.com/app?q=${q}`;
    case "grok":
      return `https://grok.com/?q=${q}`;
  }
}

function ChatGptIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.142-.08 4.774-2.758a.795.795 0 0 0 .392-.681v-6.737l2.018 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.488 4.493zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.778 2.758a.793.793 0 0 0 .787 0l5.834-3.367v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.804 3.354-2.018 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.594 3.86l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.41-.66zm2.01-3.025l-.142-.085-4.77-2.782a.776.776 0 0 0-.787 0L9.41 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904.1577v6.932H1.6023v10.0683h2.8881V23.932l7.4123-6.4153v6.3261h1.1554v-6.4148l7.5094 6.3742v-6.9096h2.3106V7.0896zm-3.4661-4.4153v4.4153h-5.2104l5.2104-4.4153zm-13.8281.0676l5.2095 4.3477H5.1035V2.7419zM2.7577 16.0383V8.246h8.0476l-6.3052 5.4422v2.3501H2.7577zm2.3458 5.5098v-6.0274l5.9783-5.1554v6.7878l-5.9783 4.395zm7.1337.6635v-12.165l5.978 5.1525v6.6469l-5.978-5.1163v5.4819h-.0001zm9.4429-6.1733h-2.3106v2.4034l-5.2104-4.4252h7.521v2.0218z"/>
    </svg>
  );
}

function GeminiIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12"/>
    </svg>
  );
}

function GrokIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.27 15.29 16.79 4h2.81l-9.54 14.31H7.18zM4.34 20l5.41-7.94 1.74 2.49L7.16 20H4.34zm10.45-7.74L20 20h-2.82l-3.7-5.45 1.31-2.29zm.36-3.5L17.84 4h2.82l-2.7 4.76h-2.81z"/>
    </svg>
  );
}

const SERVICES: { id: Service; labelKey: string; icon: () => React.ReactElement; hover: string }[] = [
  { id: "chatgpt", labelKey: "ChatGPT", icon: ChatGptIcon, hover: "#10A37F" },
  { id: "perplexity", labelKey: "Perplexity", icon: PerplexityIcon, hover: "#20808D" },
  { id: "gemini", labelKey: "Google AI", icon: GeminiIcon, hover: "#4285F4" },
  { id: "grok", labelKey: "Grok", icon: GrokIcon, hover: "var(--text-1)" },
];

export default function AiSummaryButtons({
  title,
  slug,
  lang,
}: {
  title: string;
  slug: string;
  lang: string;
}) {
  const { t } = useTranslation();
  const translatedSlug = getTranslatedSlug(slug, lang);
  const url = `${CONTACT.SITE_URL}/${lang}/blog/${translatedSlug}`;

  const promptTemplate = t("blogPost.aiSummary.prompt", {
    title,
    url,
    defaultValue: `Actúa como asesor experto en fiscalidad internacional y LLC en EE.UU. Lee el artículo "${title}" disponible en ${url} y respóndeme en español con esta estructura exacta: 1) TL;DR en 3 líneas con la conclusión práctica para un autónomo o freelancer; 2) 5-7 puntos clave con las cifras exactas (importes, porcentajes, plazos, formularios IRS); 3) Riesgos legales y errores frecuentes que el artículo señala; 4) Checklist accionable de los próximos pasos concretos. Cita ${url} como fuente al final.`,
  });

  return (
    <section
      aria-label={t("blogPost.aiSummary.title")}
      className="glass-editorial p-5 sm:p-6 my-10"
      data-testid="ai-summary-block"
    >
      <div
        className="font-heading font-semibold text-[15.5px] sm:text-base text-[var(--text-1)] mb-4"
        data-testid="ai-summary-title"
      >
        {t("blogPost.aiSummary.title")}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const href = buildServiceUrl(s.id, promptTemplate);
          const ariaLabel = t("blogPost.aiSummary.openWith", {
            service: s.labelKey,
            defaultValue: `Resumir con ${s.labelKey}`,
          });
          return (
            <a
              key={s.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              title={ariaLabel}
              data-testid={`ai-summary-${s.id}`}
              className="ai-summary-btn group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2.5 text-[13px] font-body font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-active)] transition-colors duration-200"
              style={{ ["--ai-hover" as string]: s.hover }}
            >
              <span className="flex-shrink-0 text-[var(--text-3)] group-hover:text-[var(--ai-hover)] transition-colors duration-200">
                <Icon />
              </span>
              <span className="truncate">{s.labelKey}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
