import type { CSSProperties } from "react";

interface IconProps {
  className?: string;
  size?: number;
  style?: CSSProperties;
}

const defaults = { className: "w-5 h-5", size: 20 };

function p(props: IconProps) {
  return {
    className: props.className || defaults.className,
    width: props.size || defaults.size,
    height: props.size || defaults.size,
    style: props.style,
  };
}

export const CalendarIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
    <rect x="7" y="13" width="3" height="3" rx="1" fill="currentColor" className="opacity-50"/>
    <rect x="14" y="13" width="3" height="3" rx="1" fill="currentColor" className="opacity-30"/>
    <rect x="7" y="17.5" width="3" height="1.5" rx="0.75" fill="currentColor" className="opacity-20"/>
  </svg>
);

export const CheckCircleIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XCircleIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export const CookieIcon = (props: IconProps) => (
  <svg {...p({ ...props, size: props.size || 22 })} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="8" cy="9" r="1.5" fill="currentColor" className="opacity-50"/>
    <circle cx="14.5" cy="7.5" r="1" fill="currentColor" className="opacity-50"/>
    <circle cx="16" cy="13" r="1.5" fill="currentColor" className="opacity-50"/>
    <circle cx="10" cy="15.5" r="1" fill="currentColor" className="opacity-50"/>
  </svg>
);

export const CalculatorIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="3" stroke="currentColor" strokeWidth="2.2"/>
    <rect x="7" y="5" width="10" height="4" rx="1.5" fill="currentColor" className="opacity-25"/>
    <circle cx="8.5" cy="13" r="1" fill="currentColor"/>
    <circle cx="12" cy="13" r="1" fill="currentColor"/>
    <circle cx="15.5" cy="13" r="1" fill="currentColor"/>
    <circle cx="8.5" cy="17" r="1" fill="currentColor" className="opacity-50"/>
    <circle cx="12" cy="17" r="1" fill="currentColor" className="opacity-50"/>
    <rect x="14.5" y="16" width="2" height="2" rx="0.5" fill="currentColor" className="opacity-50"/>
  </svg>
);

export const ClockCircleIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <polyline points="12 19 5 12 12 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SpinnerIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export const VideoIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M16 10l5-3v10l-5-3v-4z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
  </svg>
);

export const CalendarXIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M9 14l6 6M15 14l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
  </svg>
);

export const CalendarClockIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M21 11V7a3 3 0 00-3-3H6a3 3 0 00-3 3v11a3 3 0 003 3h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
    <circle cx="18" cy="18" r="4.5" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M18 16v2l1.5 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// WhatsApp official glyph. Centralised here so consumers stop reaching for
// `react-icons/si` (banned by the no-icon-libraries rule) and stop
// duplicating the path. Existing inline copies in Navbar.tsx and go.tsx were
// kept for now — they're not regressions and the rule allows ad-hoc inline
// SVGs as long as they're not from a third-party library.
export const WhatsAppIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

