import { useState } from "react";
import { useSearch } from "wouter";
import { useTranslation } from "react-i18next";

import SEO from "@/components/SEO";
import { useLangPath } from "@/hooks/useLangPath";
import BookingCalendar from "@/components/BookingCalendar";
import { CALC_ACTIVITY_KEYS } from "@/lib/calculator";

interface FormData {
  situacion: string;
  actividad: string;
  actividadOtra: string;
  facturacion: string;
  inversion: string;
  inicio: string;
  beneficioNeto: string;
  clientesInternacionales: string;
  operaDigital: string;
  compromiso: string;
}

function SelectionCard({
  label,
  selected,
  onClick,
  testId,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={`w-full text-left px-5 py-2.5 min-h-[44px] flex items-center rounded-full border-2 transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 font-body text-sm cursor-pointer ${
        selected
          ? "border-[#00E510] bg-[#00E510]/10 text-[var(--text-1)] font-semibold"
          : "border-[var(--border-subtle)] bg-transparent text-[var(--text-2)] hover:border-[#00E510]/50 hover:text-[var(--text-1)]"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ${
            selected ? "border-[#00E510] bg-[#00E510]" : "border-[var(--border-subtle)]"
          }`}
        >
          {selected && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {label}
      </span>
    </button>
  );
}

function CustomSelect({
  value,
  onChange,
  options,
  kvOptions,
  placeholder,
  testId,
}: {
  value: string;
  onChange: (val: string) => void;
  options?: string[];
  kvOptions?: { v: string; l: string }[];
  placeholder: string;
  testId: string;
}) {
  return (
    <select
      data-testid={testId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-2.5 min-h-[44px] rounded-full border-2 border-[var(--border-subtle)] bg-transparent text-[var(--text-1)] font-body text-base appearance-none cursor-pointer focus:outline-none focus:border-[#00E510] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {kvOptions ? kvOptions.map((opt) => (
        <option key={opt.v} value={opt.v}>
          {opt.l}
        </option>
      )) : options?.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={`step-${i}`}
          className={`h-1.5 flex-1 rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300 ${
            i < current ? "bg-[#00E510]" : "bg-[var(--border-subtle)]"
          }`}
        />
      ))}
      <span className="text-sm font-body text-[var(--text-2)] whitespace-nowrap ml-1">
        {label}
      </span>
    </div>
  );
}

export default function ReservarPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const prefillName = params.get("name") || "";
  const prefillEmail = params.get("email") || "";
  const prefillPhone = params.get("phone") || "";
  const prefillContext = params.get("context") || "";
  const isReschedule = !!(prefillName || prefillEmail);
  const paymentStatus = params.get("status");
  const isPaymentSuccess = paymentStatus === "success";
  const isPaymentCancelled = paymentStatus === "cancelled";

  const [showCalendar, setShowCalendar] = useState(isReschedule);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    situacion: "",
    actividad: "",
    actividadOtra: "",
    facturacion: "",
    inversion: "",
    inicio: "",
    beneficioNeto: "",
    clientesInternacionales: "",
    operaDigital: "",
    compromiso: "",
  });

  const totalSteps = 3;

  const SITUACION_OPTIONS = t("reservar.situacionOptions", { returnObjects: true }) as string[];
  const ACTIVIDAD_KV = CALC_ACTIVITY_KEYS.map(k => ({ v: k, l: t(`calculator.activityLabels.${k}`, k) }));
  const FACTURACION_OPTIONS = t("reservar.facturacionOptions", { returnObjects: true }) as string[];
  const INVERSION_OPTIONS = t("reservar.inversionOptions", { returnObjects: true }) as string[];
  const INICIO_OPTIONS = t("reservar.inicioOptions", { returnObjects: true }) as string[];

  const update = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canAdvance = () => {
    if (step === 0) return formData.actividad !== "" && formData.facturacion !== "";
    if (step === 1) return formData.situacion !== "" && formData.beneficioNeto !== "" && formData.clientesInternacionales !== "" && formData.operaDigital !== "" && formData.compromiso === "yes";
    if (step === 2) return formData.inversion !== "" && formData.inicio !== "";
    return false;
  };

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const next = () => {
    if (step === totalSteps - 1) {
      setShowCalendar(true);
      scrollUp();
    } else {
      setStep((s) => s + 1);
      scrollUp();
    }
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollUp();
  };

  const buildPrefilledContext = (data: FormData): string => {
    return [
      `${t("reservar.context.situacion")}: ${data.situacion}`,
      `${t("reservar.context.actividad")}: ${t(`calculator.activityLabels.${data.actividad}`, data.actividad)}${data.actividadOtra ? ` — ${data.actividadOtra}` : ""}`,
      `${t("reservar.context.facturacion")}: ${data.facturacion}`,
      `${t("reservar.context.inversion")}: ${data.inversion}`,
      `${t("reservar.context.inicio")}: ${data.inicio}`,
      `${t("reservar.context.beneficioNeto")}: ${data.beneficioNeto}`,
      `${t("reservar.context.clientesInternacionales")}: ${data.clientesInternacionales === "yes" ? t("reservar.step2.yes") : t("reservar.step2.no")}`,
      `${t("reservar.context.operaDigital")}: ${data.operaDigital === "yes" ? t("reservar.step2.yes") : t("reservar.step2.no")}`,
    ].join(" | ");
  };

  return (
    <><SEO
        title={t("reservarPage.seoTitle")}
        description={t("reservarPage.seoDesc")}
        keywords={t("reservarPage.seoKeywords")}
        path="/agendar-asesoria"
        breadcrumbs={[{ name: t("reservarPage.seoTitle"), path: "/agendar-asesoria" }]}
      />

      {isPaymentSuccess ? (
        <section className="pt-14 lg:pt-20 pb-16 lg:pb-24 min-h-[calc(100svh-72px)]">
          <div className="max-w-[500px] mx-auto px-4 sm:px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#00E510]/10 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h1 className="font-heading font-bold text-2xl lg:text-3xl text-[var(--text-1)] mb-3">{t("reservar.paymentSuccess.title")}</h1>
            <p className="text-[var(--text-2)] font-body mb-6">{t("reservar.paymentSuccess.desc")}</p>
            <p className="text-sm text-[var(--text-3)] font-body">{t("reservar.paymentSuccess.email")}</p>
          </div>
        </section>
      ) : isPaymentCancelled ? (
        <section className="pt-14 lg:pt-20 pb-16 lg:pb-24 min-h-[calc(100svh-72px)]">
          <div className="max-w-[500px] mx-auto px-4 sm:px-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(0,229,16,0.06)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00c40e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h1 className="font-heading font-bold text-2xl lg:text-3xl text-[var(--text-1)] mb-3">{t("reservar.paymentCancelled.title")}</h1>
            <p className="text-[var(--text-2)] font-body mb-6">{t("reservar.paymentCancelled.desc")}</p>
            <a href={lp("/agendar-asesoria")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00E510] text-white font-semibold text-sm hover:opacity-90 transition-opacity" data-testid="button-retry-booking">
              {t("reservar.paymentCancelled.retry")}
            </a>
          </div>
        </section>
      ) : !showCalendar ? (
        <section className="pt-14 lg:pt-20 pb-16 lg:pb-24 min-h-[calc(100svh-72px)]">
          <div className="max-w-[600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h1 className="font-heading font-bold text-3xl lg:text-[42px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-4">
                {t("reservar.hero.h1")}{" "}
                <span className="relative inline-block text-[#00E510]">
                  {t("reservar.hero.h1green")}
                  <svg className="absolute top-full mt-1 left-0 w-full" style={{ height: '7px' }} viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                    <path className="draw-path-now" d="M2 7c40-6 80 6 140-3s80 5 156-2" stroke="#00E510" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-base text-[var(--text-2)] font-body max-w-[480px] mx-auto leading-relaxed">
                {t("reservar.hero.subtitle")}
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] p-6 sm:p-8" style={{ background: "var(--bg-2)", border: "1px solid var(--border-subtle)" }}>
              <ProgressBar
                current={step + 1}
                total={totalSteps}
                label={t("reservar.progressLabel", { current: step + 1, total: totalSteps })}
              />

              {step === 0 && (
                <div data-testid="step-negocio">
                  <h2 className="font-heading font-bold text-xl text-[var(--text-1)] mb-6">
                    {t("reservar.step1.h2")}
                  </h2>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block font-body font-medium text-sm text-[var(--text-2)] mb-2">
                        {t("reservar.step1.labelActividad")}
                      </label>
                      <CustomSelect
                        value={formData.actividad}
                        onChange={(v) => { update("actividad", v); if (v !== "otherDigital") update("actividadOtra", ""); }}
                        kvOptions={ACTIVIDAD_KV}
                        placeholder={t("reservar.step1.placeholderActividad")}
                        testId="select-actividad"
                      />
                      {formData.actividad === "otherDigital" && (
                        <input
                          data-testid="input-actividad-otra"
                          type="text"
                          value={formData.actividadOtra}
                          onChange={(e) => update("actividadOtra", e.target.value)}
                          placeholder={t("reservar.step1.placeholderOtra")}
                          className="w-full mt-3 px-5 py-3 rounded-full border-2 border-[var(--border-subtle)] bg-transparent text-[var(--text-1)] font-body text-base focus:outline-none focus:border-[#00E510] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block font-body font-medium text-sm text-[var(--text-2)] mb-2">
                        {t("reservar.step1.labelFacturacion")}
                      </label>
                      <CustomSelect
                        value={formData.facturacion}
                        onChange={(v) => update("facturacion", v)}
                        options={Array.isArray(FACTURACION_OPTIONS) ? FACTURACION_OPTIONS : []}
                        placeholder={t("reservar.step1.placeholderFacturacion")}
                        testId="select-facturacion"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div data-testid="step-situacion">
                  <h2 className="font-heading font-bold text-xl text-[var(--text-1)] mb-6">
                    {t("reservar.step2.h2")}
                  </h2>
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="block font-body font-medium text-sm text-[var(--text-2)] mb-2">
                        {t("reservar.step2.labelSituacion")}
                      </label>
                      <div className="flex flex-col gap-2.5">
                        {Array.isArray(SITUACION_OPTIONS) && SITUACION_OPTIONS.map((opt, i) => (
                          <SelectionCard
                            key={opt}
                            label={opt}
                            selected={formData.situacion === opt}
                            onClick={() => update("situacion", opt)}
                            testId={`card-situacion-${i}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-body font-medium text-sm text-[var(--text-2)] mb-2">
                        {t("reservar.step2.labelBeneficio")} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        data-testid="input-beneficio-neto"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.beneficioNeto}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          update("beneficioNeto", val);
                        }}
                        placeholder={t("reservar.step2.placeholderBeneficio")}
                        className="w-full px-4 py-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-1)] font-body text-sm outline-none focus:border-[#00E510] focus:ring-2 focus:ring-[#00E510]/10 transition-all"
                      />
                    </div>
                    <div>
                      <p className="font-body font-medium text-sm text-[var(--text-1)] mb-3">
                        {t("reservar.step2.labelClientesInternacionales")} <span className="text-[#DC2626]">*</span>
                      </p>
                      <div className="flex gap-3">
                        <SelectionCard label={t("reservar.step2.yes")} selected={formData.clientesInternacionales === "yes"} onClick={() => update("clientesInternacionales", "yes")} testId="card-intl-yes" />
                        <SelectionCard label={t("reservar.step2.no")} selected={formData.clientesInternacionales === "no"} onClick={() => update("clientesInternacionales", "no")} testId="card-intl-no" />
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-medium text-sm text-[var(--text-1)] mb-3">
                        {t("reservar.step2.labelOperaDigital")} <span className="text-[#DC2626]">*</span>
                      </p>
                      <div className="flex gap-3">
                        <SelectionCard label={t("reservar.step2.yes")} selected={formData.operaDigital === "yes"} onClick={() => update("operaDigital", "yes")} testId="card-digital-yes" />
                        <SelectionCard label={t("reservar.step2.no")} selected={formData.operaDigital === "no"} onClick={() => update("operaDigital", "no")} testId="card-digital-no" />
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-medium text-sm text-[var(--text-1)] mb-3">
                        {t("reservar.step2.labelCompromiso")} <span className="text-[#DC2626]">*</span>
                      </p>
                      <p className="text-xs text-[var(--text-2)] mb-3 leading-relaxed">
                        {t("reservar.step2.compromisoDesc")}
                      </p>
                      <div className="flex gap-3">
                        <SelectionCard label={t("reservar.step2.compromisoYes")} selected={formData.compromiso === "yes"} onClick={() => update("compromiso", "yes")} testId="card-compromiso-yes" />
                        <SelectionCard label={t("reservar.step2.no")} selected={formData.compromiso === "no"} onClick={() => update("compromiso", "no")} testId="card-compromiso-no" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div data-testid="step-compromiso">
                  <h2 className="font-heading font-bold text-xl text-[var(--text-1)] mb-6">
                    {t("reservar.step3.h2")}
                  </h2>
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="font-body font-medium text-sm text-[var(--text-1)] mb-3">
                        {t("reservar.step3.labelInversion")}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {Array.isArray(INVERSION_OPTIONS) && INVERSION_OPTIONS.map((opt, i) => (
                          <SelectionCard
                            key={opt}
                            label={opt}
                            selected={formData.inversion === opt}
                            onClick={() => update("inversion", opt)}
                            testId={`card-inversion-${i}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-body font-medium text-sm text-[var(--text-1)] mb-3">
                        {t("reservar.step3.labelInicio")}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {Array.isArray(INICIO_OPTIONS) && INICIO_OPTIONS.map((opt, i) => (
                          <SelectionCard
                            key={opt}
                            label={opt}
                            selected={formData.inicio === opt}
                            onClick={() => update("inicio", opt)}
                            testId={`card-inicio-${i}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    data-testid="button-back"
                    className="border border-[var(--border-subtle)] text-[var(--text-2)] hover:text-[var(--text-1)] font-body font-semibold px-8 py-3 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                  >
                    {t("reservar.btnBack")}
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={!canAdvance()}
                  data-testid="button-next"
                  className="bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === totalSteps - 1 ? t("reservar.btnVerHorarios") : t("reservar.btnNext")}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-14 lg:pt-20 pb-16 lg:pb-24 min-h-[calc(100svh-72px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[520px] mx-auto" id="calendario">
              <BookingCalendar
                prefilledContext={isReschedule ? (prefillContext || t("reservar.context.reagendamiento")) : buildPrefilledContext(formData)}
                prefilledName={prefillName}
                prefilledEmail={prefillEmail}
                prefilledPhone={prefillPhone}
                prefilledBeneficio={formData.beneficioNeto || undefined}
                prefilledClientesMundiales={formData.clientesInternacionales ? formData.clientesInternacionales === "yes" : undefined}
                prefilledOperaDigital={formData.operaDigital ? formData.operaDigital === "yes" : undefined}
                prefilledActivity={formData.actividad || undefined}
              />
            </div>
          </div>
        </section>
      )}</>
  );
}
