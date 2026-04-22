import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { BrandTick } from "@/components/calculator/BrandIcons";
import { useLangPath } from "@/hooks/useLangPath";
import { CONTACT } from "@/lib/constants";
import { trackWhatsAppClick } from "@/components/Tracking";
import ExistingLlcCallout from "./ExistingLlcCallout";

export default function Services() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const approach = t("services.approach", { returnObjects: true }) as { label: string; text: string }[];
  const items = t("services.items", { returnObjects: true }) as {
    title: string;
    desc: string;
    includes: string[];
    footer: string;
  }[];

  return (
    <section id="servicios" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
                    <span className="section-chip">{t("services.tag")}</span>
          <h2 className="section-h2 mb-5">
            {t("services.title")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("services.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("services.desc2")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("services.desc3")}
          </p>
        </div>

        {/* Approach: 3 verb-pillars + 1 closing statement */}
        <div className="reveal mb-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {approach.slice(0, 3).map((item, i) => (
            <div
              key={item.label}
              className="reveal rounded-[28px] p-7 lg:p-9 flex flex-col"
              style={{
                background: '#00E510',
                transitionDelay: `${i * 100}ms`,
              }}
              data-testid={`approach-pillar-${i}`}
            >
              <h3
                className="text-[26px] sm:text-[30px] lg:text-[36px] leading-[1.05] mb-4 break-words"
                style={{ color: '#0B0D0C', hyphens: 'auto' }}
              >
                {item.label}
              </h3>
              <p
                className="text-[15px] lg:text-base leading-relaxed"
                style={{ color: 'rgba(11,13,12,0.82)' }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Closing statement — no card, narrative climax */}
        {approach[3] && (
          <div
            className="reveal mb-24 max-w-3xl mx-auto text-center"
            style={{ transitionDelay: '320ms' }}
            data-testid="approach-closing"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-[40px] text-[var(--text-1)] leading-[1.1] mb-5">
              {approach[3].label}
            </h3>
            <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
              {approach[3].text}
            </p>
          </div>
        )}

        <ExistingLlcCallout variant="section" testIdSuffix="home" />

        <div className="space-y-10 lg:space-y-12">
          {items.map((service, i) => (
            <div
              key={service.title}
              className="reveal relative rounded-[32px] p-8 sm:p-10 lg:p-14 overflow-hidden"
              style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(28px) saturate(1.7)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.7)',
                border: '1px solid rgba(0,229,16,0.20)',
                borderTop: '2px solid #00E510',
                transitionDelay: `${i * 120}ms`,
              }}
              data-testid={`block-service-${i}`}
            >
              {/* ambient liquid glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(70% 50% at 0% 0%, rgba(0,229,16,0.10), transparent 60%), radial-gradient(60% 45% at 100% 100%, rgba(0,229,16,0.07), transparent 65%)',
                }}
              />

              <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left: title + desc + footer + CTAs */}
                <div className="lg:col-span-7 flex flex-col">
                  <h3 className="text-[28px] sm:text-[34px] lg:text-[44px] leading-[1.05] text-[var(--text-1)] mb-5">
                    {service.title}
                  </h3>
                  <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  {service.footer && (
                    <p className="text-base lg:text-[17px] text-[#0FA958] leading-relaxed font-medium mb-8">
                      {service.footer}
                    </p>
                  )}

                  {i < items.length - 1 && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Link
                        href={lp("our_services")}
                        className="inline-flex items-center justify-center btn-primary px-6 py-3 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
                        data-testid={`button-service-${i}-book`}
                      >
                        {t("forWho.bookNow")}
                      </Link>
                      <a
                        href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("hero.whatsappMsg"))}`}
                        onClick={() => trackWhatsAppClick(`services_block_${i}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-6 py-3 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
                        data-testid={`button-service-${i}-whatsapp`}
                      >
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          {t("talkWhatsapp")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Right: checklist panel */}
                <div className="lg:col-span-5">
                  <div
                    className="rounded-2xl p-6 lg:p-7 h-full"
                    style={{
                      background: 'rgba(0,229,16,0.05)',
                      border: '1px solid rgba(0,229,16,0.18)',
                    }}
                  >
                    <ul className="flex flex-col gap-3.5">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 mt-1"><BrandTick /></span>
                          <span className="text-[15px] lg:text-base text-[var(--text-1)] leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
