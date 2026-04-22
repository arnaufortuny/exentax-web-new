import { useTranslation } from "react-i18next";
import { SOCIAL } from "@/lib/constants";

export type StatDef = {
  value?: string;
  prefix?: string;
  suffix?: string;
  target?: number;
  duration?: number;
  label: string;
  href?: string;
  decimals?: number;
};

export function useStatsHome(): StatDef[] {
  const { t } = useTranslation();
  return [
    { prefix: "−", suffix: "%", target: 40, duration: 1600, label: t("heroStats.reductionLabel") },
    { prefix: "+", target: 50, duration: 1400, label: t("heroStats.clientsLabel") },
    { value: "5.0", suffix: "★", label: t("heroStats.ratingLabel"), href: SOCIAL.TRUSTPILOT },
  ];
}

export function useStatsPrecios(): StatDef[] {
  const { t } = useTranslation();
  return [
    { prefix: "+", target: 8, duration: 1200, label: t("heroStats.countriesLabel") },
    { prefix: "", suffix: "", target: 0, duration: 800, label: t("heroStats.noCosts") },
    { value: "5.0", suffix: "★", label: t("heroStats.ratingLabel"), href: SOCIAL.TRUSTPILOT },
  ];
}
