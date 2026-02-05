const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const safeUrl = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return "";
};

const applyTokens = (html: string, tokens: Record<string, string>) => {
  let output = html;
  for (const [key, value] of Object.entries(tokens)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
};

interface EmailBranding {
  clientName?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

interface RenderEmailOptions {
  htmlBody: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  tokens?: Record<string, string | number | null | undefined>;
  branding: EmailBranding;
}

export function renderEmail({
  htmlBody,
  ctaText,
  ctaUrl,
  tokens = {},
  branding,
}: RenderEmailOptions) {
  const primary = branding.primaryColor || "#0ea5e9";
  const logo = safeUrl(branding.logoUrl);
  const name = branding.clientName ? escapeHtml(branding.clientName) : "";
  const contactEmail = branding.contactEmail || "";
  const contactPhone = branding.contactPhone || "";

  const tokenMap: Record<string, string> = {
    clientName: name,
    contactEmail: escapeHtml(contactEmail),
    contactPhone: escapeHtml(contactPhone),
    primaryColor: primary,
    ctaText: ctaText ? escapeHtml(ctaText) : "",
    ctaUrl: ctaUrl ? escapeHtml(ctaUrl) : "",
  };

  for (const [key, value] of Object.entries(tokens)) {
    tokenMap[key] =
      value === null || value === undefined ? "" : escapeHtml(String(value));
  }

  const bodyWithTokens = applyTokens(htmlBody || "", tokenMap);

  const cta =
    ctaText && ctaUrl
      ? `<a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:${primary};color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">${escapeHtml(
          ctaText
        )}</a>`
      : "";

  return `
  <div style="background:#f6f8fb;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 10px 30px rgba(15,23,42,0.08);overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid #eef2f7;display:flex;align-items:center;gap:12px;">
        ${logo ? `<img src="${logo}" alt="${name}" style="width:40px;height:40px;border-radius:10px;object-fit:contain;" />` : ""}
        ${name ? `<div style="font-size:18px;font-weight:700;">${name}</div>` : ""}
      </div>
      <div style="padding:28px;">
        ${bodyWithTokens}
        ${cta ? `<div style="margin-top:20px;">${cta}</div>` : ""}
      </div>
      <div style="padding:16px 28px;background:#0f172a;color:#e2e8f0;font-size:12px;">
        ${name ? `${name}` : ""}
        ${contactEmail ? ` · ${escapeHtml(contactEmail)}` : ""}
        ${contactPhone ? ` · ${escapeHtml(contactPhone)}` : ""}
      </div>
    </div>
  </div>
  `;
}
