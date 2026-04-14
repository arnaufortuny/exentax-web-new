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

export const CalendarClockIcon = (props: IconProps) => (
  <svg {...p(props)} viewBox="0 0 24 24" fill="none">
    <path d="M21 11V7a3 3 0 00-3-3H6a3 3 0 00-3 3v11a3 3 0 003 3h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="2.2"/>
    <circle cx="18" cy="18" r="4.5" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M18 16v2l1.5 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

