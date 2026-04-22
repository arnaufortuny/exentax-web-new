import React from "react";
import { useTranslation } from "react-i18next";

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ComplianceIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3l8 3v5.5c0 4.5-3.4 8.5-8 9.5-4.6-1-8-5-8-9.5V6l8-3z" />
      <path d="M9 12l2.2 2.2L15 10.5" />
    </svg>
  );
}

function GuiasIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 5.5C9.8 4.2 7.4 3.8 5 4v14c2.4-.2 4.8.2 7 1.5" />
      <path d="M12 5.5C14.2 4.2 16.6 3.8 19 4v14c-2.4-.2-4.8.2-7 1.5" />
      <path d="M12 5.5v14" />
    </svg>
  );
}

function FiscalidadIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M4 18V8" />
      <path d="M4 18l5-5 4 3 7-8" />
      <path d="M14 8h6v6" />
    </svg>
  );
}

function ComparativasIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M5 20V11" />
      <path d="M12 20V5" />
      <path d="M19 20v-6" />
    </svg>
  );
}

function HerramientasIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M14.5 5.5a4 4 0 015.4 5.4l-9.6 9.6a2 2 0 11-2.8-2.8l9.6-9.6a4 4 0 01-2.6-2.6z" />
      <path d="M9 12l3 3" />
    </svg>
  );
}

function OperativaIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M3 12a9 9 0 0115-6.7L20 7" />
      <path d="M21 12a9 9 0 01-15 6.7L4 17" />
      <path d="M20 3v4h-4" />
      <path d="M4 21v-4h4" />
    </svg>
  );
}

function LegalIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 4v16" />
      <path d="M5 7h14" />
      <path d="M5 7l-2.5 6a3 3 0 005 0L5 7z" />
      <path d="M19 7l-2.5 6a3 3 0 005 0L19 7z" />
      <path d="M8 20h8" />
    </svg>
  );
}

export const CATEGORY_ICON_MAP: Record<string, () => React.ReactElement> = {
  Todos: GuiasIcon,
  Compliance: ComplianceIcon,
  "Guías": GuiasIcon,
  Fiscalidad: FiscalidadIcon,
  Comparativas: ComparativasIcon,
  Herramientas: HerramientasIcon,
  Operativa: OperativaIcon,
  Legal: LegalIcon,
};

export function CategoryBadge({ category, testId }: { category: string; testId?: string }) {
  const { t } = useTranslation();
  const Icon = CATEGORY_ICON_MAP[category] || GuiasIcon;
  return (
    <span className="editorial-badge" data-cat={category} data-testid={testId || `badge-${category.toLowerCase()}`}>
      <Icon />
      {t(`blogPost.categories.${category}`, category)}
    </span>
  );
}
