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

export const ChevronLeftIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
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

export const InfoCircleIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1.2" fill="currentColor"/>
  </svg>
);

export const WarningTriangleIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1.2" fill="currentColor"/>
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

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <polyline points="12 5 19 12 12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <polyline points="12 19 5 12 12 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SectionIcon = ({ d, ...props }: IconProps & { d: string }) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
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

export const CalendarClockIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M21 11V7a3 3 0 00-3-3H6a3 3 0 00-3 3v11a3 3 0 003 3h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
    <circle cx="18" cy="18" r="4.5" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M18 16v2l1.5 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WhatsAppIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
    <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.713 1.448h.005c6.585 0 11.946-5.336 11.948-11.896 0-3.176-1.24-6.165-3.487-8.411z" stroke="currentColor" strokeWidth="0.8"/>
  </svg>
);
