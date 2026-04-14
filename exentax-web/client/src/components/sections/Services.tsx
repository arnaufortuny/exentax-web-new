import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { BrandTick } from "@/components/calculator/BrandIcons";

export default function Services() {
  const { t } = useTranslation();
  const ref = useReveal();

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
          <span className="section-label mb-3">{t("services.tag")}</span>
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

        <div className="reveal mb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approach.map((item, i) => (
            <div
              key={item.label}
              className="rounded-2xl p-6 transition-[border-color,box-shadow] duration-300"
              style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: '1px solid var(--border-subtle)',
                borderTop: '2px solid #00E510',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <span className="section-label mb-3">{item.label}</span>
              <p className="text-[15px] text-[var(--text-2)] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {items.map((service, i) => (
            <div
              key={service.title}
              className="reveal rounded-[var(--radius-xl)] overflow-hidden transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300"
              style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: '1px solid var(--border-subtle)',
                transitionDelay: `${i * 120}ms`,
              }}
              data-testid={`card-service-${i}`}
            >
              <div className="p-8 lg:p-10">
                <div className="mb-6">
                  <h3 className="font-heading font-bold text-xl lg:text-2xl text-[var(--text-1)] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    {service.includes.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5"><BrandTick /></span>
                        <span className="text-base lg:text-lg text-[var(--text-2)]">{item}</span>
                      </div>
                    ))}
                  </div>

                  {service.footer && (
                    <div className="flex items-start">
                      <div className="rounded-xl p-5" style={{ background: 'rgba(0,229,16,0.04)', border: '1px solid rgba(0,229,16,0.10)' }}>
                        <p className="text-base text-[#0FA958] leading-relaxed">
                          {service.footer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
