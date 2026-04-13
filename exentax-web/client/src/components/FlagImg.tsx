import { FLAG_CODES } from "@/lib/lang-utils";
import type { SupportedLang } from "@/i18n";
import { LANG_LABELS } from "@/i18n";

export default function FlagImg({ lang, size = 16 }: { lang: SupportedLang; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w160/${FLAG_CODES[lang]}.png`}
      srcSet={`https://flagcdn.com/w320/${FLAG_CODES[lang]}.png 2x`}
      alt={LANG_LABELS[lang]}
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
      data-testid={`img-flag-${lang}`}
    />
  );
}
