import type { BlogCountryCode } from "@/data/blog-posts";

const ISO_CODES: Record<BlogCountryCode, string> = {
  ES: "es",
  MX: "mx",
  CO: "co",
  AR: "ar",
  FR: "fr",
  DE: "de",
  PT: "pt",
  IT: "it",
};

export default function CountryFlagImg({
  code,
  size = 18,
  alt,
}: {
  code: BlogCountryCode;
  size?: number;
  alt: string;
}) {
  const iso = ISO_CODES[code];
  return (
    <img
      src={`https://flagcdn.com/w160/${iso}.png`}
      srcSet={`https://flagcdn.com/w320/${iso}.png 2x`}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        objectPosition: "center",
        flexShrink: 0,
        display: "block",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
      loading="lazy"
      data-testid={`img-country-flag-${code}`}
    />
  );
}
