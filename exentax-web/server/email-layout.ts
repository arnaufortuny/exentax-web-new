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
export const C_CARD     = "#FFFFFF";
export const C_CARD_FT  = "#F0F0F0";
export const C_NEON     = "#00E510";
export const C_NEON_BG  = "rgba(0,229,16,0.06)";
export const C_NEON_DK  = "#00C80E";
export const C_TEXT_1   = "#111111";
export const C_TEXT_2   = "#4B5563";
export const C_TEXT_3   = "#9CA3AF";
export const C_BORDER   = "#E5E7EB";
export const C_ACCENT     = C_NEON_DK;
export const C_ACCENT_BG  = "rgba(0,200,14,0.06)";
export const C_ACCENT_BD  = "rgba(0,200,14,0.15)";
export const C_HIGHLIGHT_BG = C_NEON_BG;
export const C_HIGHLIGHT_BD = "rgba(0,229,16,0.15)";
export const C_HIGHLIGHT_TX = C_NEON_DK;
export const F_STACK    = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const LOGO_URL = `${SITE_URL}/ex-icon-green.png`;


const SOCIAL_COLORS: Record<string, string> = {
  Instagram: "#111111",
  TikTok: "#111111",
  YouTube: "#111111",
  Facebook: "#111111",
  WhatsApp: "#00E510",
};

function socialCircle(href: string, label: string, initial: string): string {
  const bg = SOCIAL_COLORS[label] || C_NEON;
  return `<a href="${href}" title="${label}" style="text-decoration:none;display:inline-block;margin:0 6px;vertical-align:middle;">
    <div style="width:36px;height:36px;border-radius:50%;background:${bg};display:inline-block;text-align:center;line-height:36px;">
      <span style="font-family:${F_STACK};font-size:14px;font-weight:700;color:#FFFFFF;line-height:36px;">${initial}</span>
    </div>
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
    body { margin:0 !important; padding:0 !important; background:${C_BG} !important; background-color:${C_BG} !important; color:${C_TEXT_2}; font-family:${F_STACK}; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    * { box-sizing:border-box; }
    h1, h2, h3 { color:${C_TEXT_1}; }
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

const TEAM_LABEL: Record<string, string> = {
  es: "Equipo", en: "The", fr: "L'équipe", de: "Team", pt: "Equipa", ca: "Equip",
};

export function signOff(closing: string, lang?: string): string {
  const l = lang && TEAM_LABEL[lang] ? lang : "es";
  const teamPrefix = TEAM_LABEL[l];
  const teamStr = l === "en" ? `${teamPrefix} ${_BRAND_NAME} Team` : `${teamPrefix} ${_BRAND_NAME}`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:28px;">
    <tr><td>
      <p class="txt-2" style="font-family:${F_STACK};font-size:15px;color:${C_TEXT_2};margin:0;line-height:1.7;">
        ${closing},<br/>
        <strong class="txt-1" style="color:${C_TEXT_1};font-weight:700;">${teamStr}</strong>
      </p>
    </td></tr>
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

export function meetBlock(meetLink: string | null, lang = "es"): string {
  const t = MEET_I18N[lang] || MEET_I18N.es;
  if (meetLink) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C_NEON_BG};background-color:${C_NEON_BG};border:1px solid ${C_BORDER};border-radius:16px;margin:0 0 24px;" bgcolor="${C_NEON_BG}">
      <tr><td style="padding:24px 24px;background:${C_NEON_BG};background-color:${C_NEON_BG};text-align:center;" bgcolor="${C_NEON_BG}">
        ${label(t.title)}
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0 12px;">
          <tr><td align="center">
            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${meetLink}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="50%" fillcolor="${C_NEON}"><center style="color:#000000;font-family:${F_STACK};font-size:15px;font-weight:bold;">&#9654; ${t.joinBtn}</center></v:roundrect><![endif]-->
            <!--[if !mso]><!--><a href="${meetLink}" class="bg-neon txt-black"
              style="display:inline-block;background:${C_NEON};background-color:${C_NEON};color:#000000;font-family:${F_STACK};font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;text-decoration:none;mso-hide:all;" bgcolor="${C_NEON}">&#9654;&nbsp; ${t.joinBtn}</a><!--<![endif]-->
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
