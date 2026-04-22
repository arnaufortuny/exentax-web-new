export function BrandTick() {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden="true" className="text-[var(--green)]">
      <circle cx="11" cy="11" r="11" fill="rgba(var(--green-rgb),0.14)" />
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="0.8" />
      <path d="M7 11.3l2.8 2.7 5.2-5.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandCross() {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="11" fill="rgba(239,68,68,0.12)" />
      <circle cx="11" cy="11" r="10" stroke="rgba(239,68,68,0.45)" strokeWidth="0.8" />
      <path d="M7.5 7.5l7 7M14.5 7.5l-7 7" stroke="#f87171" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
