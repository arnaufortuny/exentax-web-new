import {
  BRAND_NAME as _BRAND_NAME,
  SITE_URL as _SITE_URL,
  WHATSAPP_URL as _WHATSAPP_URL,
  DOMAIN as _DOMAIN,
  COMPANY_ADDRESS_SHORT as _COMPANY_ADDRESS,
  INSTAGRAM_URL,
  TIKTOK_URL,
  YOUTUBE_URL,
  FACEBOOK_URL,
} from "./server-constants";

export const SITE_URL = _SITE_URL;
export const WHATSAPP_URL = _WHATSAPP_URL;

export const C_BG       = "#F7F7F7";
const C_CARD     = "#FFFFFF";
const C_CARD_FT  = "#F0F0F0";
export const C_NEON     = "#00E510";
const C_NEON_BG  = "rgba(0,229,16,0.06)";
export const C_NEON_DK  = "#00C80E";
export const C_TEXT_1   = "#111111";
export const C_TEXT_2   = "#4B5563";
export const C_TEXT_3   = "#9CA3AF";
export const C_BORDER   = "#E5E7EB";
export const C_ACCENT     = C_NEON_DK;
export const C_ACCENT_BG  = "rgba(0,200,14,0.06)";
export const C_ACCENT_BD  = "rgba(0,200,14,0.15)";
const C_HIGHLIGHT_BG = C_NEON_BG;
const C_HIGHLIGHT_BD = "rgba(0,229,16,0.15)";
const C_HIGHLIGHT_TX = C_NEON_DK;
export const F_STACK    = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const LOGO_URL = `${SITE_URL}/ex-icon-green.png`;


const SOCIAL_NEON = "#00E510";

const SOCIAL_BRANDS: Record<string, { color: string; svg: string }> = {
  Instagram: {
    color: SOCIAL_NEON,
    svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
  },
  TikTok: {
    color: SOCIAL_NEON,
    svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  },
  YouTube: {
    color: SOCIAL_NEON,
    svg: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  },
  Facebook: {
    color: SOCIAL_NEON,
    svg: '<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>',
  },
  WhatsApp: {
    color: SOCIAL_NEON,
    svg: '<path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.099 4.518l-.999 3.648 3.749-.985zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>',
  },
};

function socialCircle(href: string, label: string, _initial?: string): string {
  const brand = SOCIAL_BRANDS[label];
  if (!brand) return "";
  const { color, svg } = brand;
  return `<a href="${href}" title="${label}" aria-label="${label}" style="text-decoration:none;display:inline-block;margin:0 6px;vertical-align:middle;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;border-spacing:0;"><tr><td align="center" valign="middle" bgcolor="${color}" style="width:36px;height:36px;background:${color};background-color:${color};border-radius:50%;text-align:center;vertical-align:middle;mso-line-height-rule:exactly;line-height:36px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF" style="display:inline-block;vertical-align:middle;">${svg}</svg>
    </td></tr></table>
  </a>`;
}

export function emailHtml(body: string, preheader?: string, lang = "es"): string {
  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;color:${C_BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}${"&zwnj;&nbsp;".repeat(40)}</div>`
    : "";
  const rightsText = ({ es: "Todos los derechos reservados", en: "All rights reserved", fr: "Tous droits réservés", de: "Alle Rechte vorbehalten", pt: "Todos os direitos reservados", ca: "Tots els drets reservats" } as Record<string, string>)[lang] || "All rights reserved";
  return `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="background-color:${C_BG};">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="color-scheme" content="light"/>
  <meta name="supported-color-schemes" content="light"/>
  <title>${_BRAND_NAME}</title>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
    body { margin:0 !important; padding:0 !important; background:${C_BG} !important; background-color:${C_BG} !important; color:${C_TEXT_2}; font-family:${F_STACK}; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    * { box-sizing:border-box; }
    h1, h2, h3 { color:${C_TEXT_1}; font-family:'Archivo Black', ${F_STACK}; font-weight:900; text-transform:uppercase; letter-spacing:-0.01em; }
    p, span, li { color:${C_TEXT_2}; }
    strong, b { color:${C_TEXT_1}; }
    a { color:${C_NEON_DK}; }
    .txt-1 { color:${C_TEXT_1} !important; }
    .txt-2 { color:${C_TEXT_2} !important; }
    .txt-3 { color:${C_TEXT_3} !important; }
    .txt-neon { color:${C_NEON_DK} !important; }
    .txt-neon-bright { color:${C_NEON} !important; }
    .txt-highlight { color:${C_NEON_DK} !important; }
    .txt-accent { color:${C_NEON_DK} !important; }
    .txt-black { color:#000000 !important; }
    .bg-neon { background:${C_NEON} !important; background-color:${C_NEON} !important; }
    .bg-neon a, .bg-neon span, .bg-neon td { color:#000000 !important; background-color:${C_NEON} !important; }
    .bg-card { background:${C_CARD} !important; background-color:${C_CARD} !important; }
    .bg-dark { background:${C_CARD} !important; background-color:${C_CARD} !important; }
    img { opacity:1 !important; }
    @media only screen and (max-width:600px) {
      .email-card { border-radius:16px !important; }
      .email-body { padding:28px 20px 24px !important; }
      .email-footer { padding:20px 20px !important; border-radius:0 0 16px 16px !important; }
      .email-logo img { width:120px !important; height:auto !important; }
    }
  </style>
  <!--[if mso]><style>body,table,td,p,span,div,h1,h2,h3,a,strong{background-color:${C_CARD} !important;color:${C_TEXT_1} !important;} .bg-neon{background-color:${C_NEON} !important;} .bg-neon a,.bg-neon span,.bg-neon td{color:#000000 !important;} .txt-black{color:#000000 !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${C_BG};background-color:${C_BG};color:${C_TEXT_2};font-family:${F_STACK};-webkit-font-smoothing:antialiased;" bgcolor="${C_BG}">
${preheaderHtml}
<div role="article" aria-roledescription="email" style="background:${C_BG};background-color:${C_BG};width:100%;table-layout:fixed;" bgcolor="${C_BG}">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C_BG};background-color:${C_BG};padding:40px 16px 48px;" bgcolor="${C_BG}">
  <tr><td align="center" style="background:${C_BG};background-color:${C_BG};" bgcolor="${C_BG}">

    <table role="presentation" class="email-card" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;border:1px solid ${C_BORDER};border-radius:20px;overflow:hidden;background-color:${C_CARD};" bgcolor="${C_CARD}">

      <tr><td class="email-logo" align="center" style="background:${C_CARD};background-color:${C_CARD};padding:40px 48px 28px;" bgcolor="${C_CARD}">
        <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;">
          <img src="${LOGO_URL}" width="180" alt="${_BRAND_NAME}"
            style="display:block;width:180px;height:auto;margin:0 auto;border:0;" />
        </a>
      </td></tr>

      <tr><td class="email-body" style="background:${C_CARD};background-color:${C_CARD};padding:0 48px 36px;" bgcolor="${C_CARD}">
        ${body}
      </td></tr>

      <tr><td class="email-footer" style="background:${C_CARD_FT};background-color:${C_CARD_FT};padding:28px 48px 24px;border-top:1px solid ${C_BORDER};" bgcolor="${C_CARD_FT}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${C_CARD_FT};" bgcolor="${C_CARD_FT}">
          <tr><td align="center" style="padding-bottom:14px;background:${C_CARD_FT};background-color:${C_CARD_FT};" bgcolor="${C_CARD_FT}">
            ${socialCircle(INSTAGRAM_URL, "Instagram", "IG")}
            ${socialCircle(TIKTOK_URL, "TikTok", "TK")}
            ${socialCircle(YOUTUBE_URL, "YouTube", "YT")}
            ${socialCircle(FACEBOOK_URL, "Facebook", "FB")}
            ${socialCircle(WHATSAPP_URL, "WhatsApp", "WA")}
          </td></tr>
          <tr><td align="center" style="background:${C_CARD_FT};background-color:${C_CARD_FT};" bgcolor="${C_CARD_FT}">
            <p class="txt-3" style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_3};margin:0 0 4px;line-height:1.6;">
              <a href="${SITE_URL}" class="txt-neon" style="color:${C_NEON_DK};font-weight:600;text-decoration:none;">${_DOMAIN}</a>
            </p>
            <p class="txt-3" style="font-family:${F_STACK};font-size:11px;color:${C_TEXT_3};margin:0 0 6px;line-height:1.5;">
              &copy; ${new Date().getFullYear()} ${_BRAND_NAME} LLC &middot; ${rightsText}
            </p>
            <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};margin:0;line-height:1.5;">
              ${_COMPANY_ADDRESS}
            </p>
          </td></tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</div>
</body>
</html>`;
}

export function label(text: string): string {
  return `<p class="txt-neon" style="font-family:${F_STACK};font-size:11px;font-weight:700;color:${C_NEON_DK};text-transform:uppercase;margin:0 0 12px;">${text}</p>`;
}

export function heading(text: string): string {
  return `<p class="txt-1" style="font-family:${F_STACK};font-size:24px;font-weight:800;color:${C_TEXT_1};margin:0 0 18px;line-height:1.3;">${text}</p>`;
}

export function bodyText(text: string, mb = "18px"): string {
  return `<p class="txt-2" style="font-family:${F_STACK};font-size:15px;color:${C_TEXT_2};line-height:1.75;margin:0 0 ${mb};">${text}</p>`;
}

export function divider(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:12px 0;"><tr><td style="height:1px;font-size:0;line-height:0;border-top:1px solid ${C_BORDER};">&nbsp;</td></tr></table>`;
}

export function ctaButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0 8px;">
    <tr><td align="center" style="background-color:${C_CARD};" bgcolor="${C_CARD}">
      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="50%" fillcolor="${C_NEON}"><center style="color:#000000;font-family:${F_STACK};font-size:15px;font-weight:bold;">${text}</center></v:roundrect><![endif]-->
      <!--[if !mso]><!--><a href="${href}" class="bg-neon txt-black"
        style="display:inline-block;background:${C_NEON};background-color:${C_NEON};color:#000000;font-family:${F_STACK};font-size:15px;font-weight:700;padding:14px 40px;border-radius:50px;text-decoration:none;mso-hide:all;" bgcolor="${C_NEON}">${text}</a><!--<![endif]-->
    </td></tr>
  </table>`;
}

const SIGNATURE_I18N: Record<string, { line1: string; line2: string }> = {
  es: { line1: "Estructuración fiscal internacional", line2: "Banca, inversión y operativa global." },
  en: { line1: "International tax structuring", line2: "Banking, investment and global operations." },
  fr: { line1: "Structuration fiscale internationale", line2: "Banque, investissement et opérations internationales." },
  de: { line1: "Internationale Steuerstrukturierung", line2: "Banking, Investitionen und globale Geschäftstätigkeit." },
  pt: { line1: "Estruturação fiscal internacional", line2: "Banca, investimento e operações globais." },
  ca: { line1: "Estructuració fiscal internacional", line2: "Banca, inversió i operativa global." },
};

export function brandSignature(lang?: string, closing?: string): string {
  const l = lang && SIGNATURE_I18N[lang] ? lang : "es";
  const sig = SIGNATURE_I18N[l];
  const closingHtml = closing
    ? `<p class="txt-2" style="font-family:${F_STACK};font-size:15px;color:${C_TEXT_2};margin:0 0 20px;line-height:1.7;">${closing}</p>`
    : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:28px;">
    <tr><td>
      ${closingHtml}
      <p class="txt-1" style="font-family:${F_STACK};font-size:16px;font-weight:800;color:${C_TEXT_1};margin:0 0 4px;line-height:1.4;">${_BRAND_NAME}</p>
      <p class="txt-2" style="font-family:${F_STACK};font-size:13px;color:${C_TEXT_2};margin:0 0 2px;line-height:1.5;">${sig.line1}</p>
      <p class="txt-3" style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_3};margin:0;line-height:1.5;">${sig.line2}</p>
    </td></tr>
  </table>`;
}

export function bulletList(items: string[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    ${items.map(item => `<tr><td style="padding:5px 0;font-family:${F_STACK};font-size:14px;color:${C_TEXT_2};line-height:1.7;"><span class="txt-neon" style="color:${C_NEON_DK};font-weight:700;margin-right:8px;">&#8594;</span>${item}</td></tr>`).join("")}
  </table>`;
}

export function unsubNote(text: string): string {
  return `<p class="txt-3" style="font-family:${F_STACK};font-size:11px;color:${C_TEXT_3};text-align:center;margin:20px 0 0;line-height:1.6;">${text}</p>`;
}

const SVG_ICONS: Record<string, string> = {
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C_ACCENT}" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4" stroke-linecap="round"/><path d="M3 10h18"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C_ACCENT}" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C_ACCENT}" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
};

export function infoCard(rows: Array<{ icon: string; label: string; value: string }>): string {
  const rowsHtml = rows.map((r, idx) => {
    const svgIcon = SVG_ICONS[r.icon] || SVG_ICONS.pin;
    const borderBottom = idx < rows.length - 1 ? `border-bottom:1px solid ${C_BORDER};` : "";
    return `
    <tr>
      <td style="padding:14px 20px;background:${C_CARD};background-color:${C_CARD};${borderBottom}" bgcolor="${C_CARD}">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${C_CARD};" bgcolor="${C_CARD}">
          <tr>
            <td width="40" style="vertical-align:middle;background:${C_CARD};background-color:${C_CARD};padding-right:12px;" bgcolor="${C_CARD}">
              <div style="width:34px;height:34px;background:${C_NEON_BG};border-radius:10px;display:flex;align-items:center;justify-content:center;">${svgIcon}</div>
            </td>
            <td style="vertical-align:middle;background:${C_CARD};background-color:${C_CARD};" bgcolor="${C_CARD}">
              <p class="txt-3" style="font-family:${F_STACK};font-size:10px;color:${C_TEXT_3};text-transform:uppercase;margin:0 0 2px;font-weight:600;letter-spacing:0.5px;">${r.label}</p>
              <p class="txt-1" style="font-family:${F_STACK};font-size:14px;font-weight:700;color:${C_TEXT_1};margin:0;">${r.value}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C_CARD};background-color:${C_CARD};border:1px solid ${C_BORDER};border-radius:16px;overflow:hidden;margin:0 0 24px;" bgcolor="${C_CARD}">
    ${rowsHtml}
  </table>`;
}

export function greenPanel(labelText: string, content: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C_NEON_BG};background-color:${C_NEON_BG};border:1px solid ${C_BORDER};border-radius:16px;margin:0 0 24px;" bgcolor="${C_NEON_BG}">
    <tr><td style="padding:24px 24px;background:${C_NEON_BG};background-color:${C_NEON_BG};" bgcolor="${C_NEON_BG}">
      ${label(labelText)}
      ${content}
    </td></tr>
  </table>`;
}

const MEET_I18N: Record<string, { title: string; joinBtn: string; joinSub: string; pending: string }> = {
  es: { title: "Videollamada Google Meet", joinBtn: "Unirme a la reunión", joinSub: "Únete desde cualquier dispositivo a la hora acordada.", pending: "Te enviaremos el enlace de Google Meet en las próximas horas, antes de la reunión." },
  en: { title: "Google Meet Video Call", joinBtn: "Join meeting", joinSub: "Join from any device at the scheduled time.", pending: "We'll send you the Google Meet link in the next few hours, before the meeting." },
  fr: { title: "Appel vidéo Google Meet", joinBtn: "Rejoindre la réunion", joinSub: "Rejoignez depuis n'importe quel appareil à l'heure prévue.", pending: "Nous vous enverrons le lien Google Meet dans les prochaines heures, avant la réunion." },
  de: { title: "Google Meet Videoanruf", joinBtn: "An Besprechung teilnehmen", joinSub: "Treten Sie zur geplanten Zeit von jedem Gerät bei.", pending: "Wir senden Ihnen den Google Meet Link in den nächsten Stunden vor dem Termin." },
  pt: { title: "Videochamada Google Meet", joinBtn: "Entrar na reunião", joinSub: "Entre de qualquer dispositivo no horário agendado.", pending: "Enviaremos o link do Google Meet nas próximas horas, antes da reunião." },
  ca: { title: "Videotrucada Google Meet", joinBtn: "Unir-me a la reunió", joinSub: "Uneix-te des de qualsevol dispositiu a l'hora acordada.", pending: "T'enviarem l'enllaç de Google Meet en les properes hores, abans de la reunió." },
};

const PHONE_I18N: Record<string, { title: string; intro: (phone: string) => string; sub: string; pendingTitle: string; pendingBody: string }> = {
  es: { title: "Llamada telefónica", intro: (p) => `Te llamaremos al <strong>${p}</strong> a la hora acordada.`, sub: "Asegúrate de tener cobertura y un sitio tranquilo para hablar.", pendingTitle: "Llamada telefónica", pendingBody: "Te llamaremos al teléfono que nos indicaste a la hora acordada." },
  en: { title: "Phone call", intro: (p) => `We'll call you at <strong>${p}</strong> at the scheduled time.`, sub: "Make sure you have coverage and a quiet place to talk.", pendingTitle: "Phone call", pendingBody: "We'll call you at the phone number you provided at the scheduled time." },
  fr: { title: "Appel téléphonique", intro: (p) => `Nous vous appellerons au <strong>${p}</strong> à l'heure prévue.`, sub: "Assurez-vous d'avoir du réseau et un endroit calme pour parler.", pendingTitle: "Appel téléphonique", pendingBody: "Nous vous appellerons au numéro que vous nous avez fourni à l'heure prévue." },
  de: { title: "Telefonanruf", intro: (p) => `Wir rufen Sie zum vereinbarten Zeitpunkt unter <strong>${p}</strong> an.`, sub: "Stellen Sie sicher, dass Sie Empfang und einen ruhigen Ort zum Sprechen haben.", pendingTitle: "Telefonanruf", pendingBody: "Wir rufen Sie zur vereinbarten Zeit unter der angegebenen Telefonnummer an." },
  pt: { title: "Chamada telefónica", intro: (p) => `Ligaremos para o <strong>${p}</strong> à hora agendada.`, sub: "Garanta que tem rede e um local tranquilo para falar.", pendingTitle: "Chamada telefónica", pendingBody: "Ligaremos para o número que nos indicou à hora agendada." },
  ca: { title: "Trucada telefònica", intro: (p) => `Et trucarem al <strong>${p}</strong> a l'hora acordada.`, sub: "Assegura't de tenir cobertura i un lloc tranquil per parlar.", pendingTitle: "Trucada telefònica", pendingBody: "Et trucarem al telèfon que ens vas indicar a l'hora acordada." },
};

export function phoneCallBlock(phone: string | null | undefined, lang = "es"): string {
  const t = PHONE_I18N[lang] || PHONE_I18N.es;
  if (phone && phone.trim()) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C_NEON_BG};background-color:${C_NEON_BG};border:1px solid ${C_BORDER};border-radius:16px;margin:0 0 24px;" bgcolor="${C_NEON_BG}">
      <tr><td style="padding:24px 24px;background:${C_NEON_BG};background-color:${C_NEON_BG};text-align:center;" bgcolor="${C_NEON_BG}">
        ${label(t.title)}
        <p style="font-family:${F_STACK};font-size:15px;color:${C_TEXT_1};margin:12px 0 8px;line-height:1.6;">${t.intro(phone)}</p>
        <p class="txt-3" style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_3};margin:8px 0 0;line-height:1.6;">${t.sub}</p>
      </td></tr>
    </table>`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:${C_CARD};" bgcolor="${C_CARD}">
    <tr><td style="background:${C_HIGHLIGHT_BG};background-color:${C_HIGHLIGHT_BG};border:1px solid ${C_HIGHLIGHT_BD};border-radius:16px;padding:16px 20px;">
      <p class="txt-highlight" style="font-family:${F_STACK};font-size:14px;color:${C_HIGHLIGHT_TX};margin:0;line-height:1.7;">${t.pendingBody}</p>
    </td></tr>
  </table>`;
}

export function meetingBlock(opts: { meetingType?: "google_meet" | "phone_call"; meetLink: string | null; phone?: string | null; lang?: string }): string {
  const lang = opts.lang || "es";
  if (opts.meetingType === "phone_call") return phoneCallBlock(opts.phone, lang);
  return meetBlock(opts.meetLink, lang);
}

export function meetBlock(meetLink: string | null, lang = "es"): string {
  const t = MEET_I18N[lang] || MEET_I18N.es;
  if (meetLink) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C_NEON_BG};background-color:${C_NEON_BG};border:1px solid ${C_BORDER};border-radius:16px;margin:0 0 24px;" bgcolor="${C_NEON_BG}">
      <tr><td style="padding:24px 24px;background:${C_NEON_BG};background-color:${C_NEON_BG};text-align:center;" bgcolor="${C_NEON_BG}">
        ${label(t.title)}
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0 12px;">
          <tr><td align="center">
            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${meetLink}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="50%" fillcolor="${C_NEON}"><center style="color:#000000;font-family:${F_STACK};font-size:15px;font-weight:bold;">${t.joinBtn}</center></v:roundrect><![endif]-->
            <!--[if !mso]><!--><a href="${meetLink}" class="bg-neon txt-black"
              style="display:inline-block;background:${C_NEON};background-color:${C_NEON};color:#000000;font-family:${F_STACK};font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;text-decoration:none;mso-hide:all;" bgcolor="${C_NEON}">${t.joinBtn}</a><!--<![endif]-->
          </td></tr>
        </table>
        <p class="txt-3" style="font-family:${F_STACK};font-size:12px;color:${C_TEXT_3};margin:8px 0 0;line-height:1.6;">${t.joinSub}</p>
      </td></tr>
    </table>`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:${C_CARD};" bgcolor="${C_CARD}">
    <tr><td style="background:${C_HIGHLIGHT_BG};background-color:${C_HIGHLIGHT_BG};border:1px solid ${C_HIGHLIGHT_BD};border-radius:16px;padding:16px 20px;">
      <p class="txt-highlight" style="font-family:${F_STACK};font-size:14px;color:${C_HIGHLIGHT_TX};margin:0;line-height:1.7;">${t.pending}</p>
    </td></tr>
  </table>`;
}
