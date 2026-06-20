import { SITE_NAME } from "@/lib/copy";

// HTML-escape any value interpolated into the email markup. The verification
// URL carries an attacker-influenced token, so escaping it before it lands in
// an href/text node prevents a crafted token from injecting markup.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export function verificationEmail(url: string): EmailContent {
  const safeUrl = escapeHtml(url);
  const subject = `Confirm your email for ${SITE_NAME}`;

  const html = `<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.5; color: #1a1a1a;">
    <h1 style="font-size: 20px;">Confirm your email</h1>
    <p>Thanks for signing up for ${SITE_NAME}. Confirm this email address to activate your account.</p>
    <p>
      <a href="${safeUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Confirm my email</a>
    </p>
    <p>Or paste this link into your browser:</p>
    <p><a href="${safeUrl}">${safeUrl}</a></p>
    <p style="color: #666; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
  </body>
</html>`;

  const text = `Confirm your email for ${SITE_NAME}

Thanks for signing up. Confirm this email address to activate your account:

${url}

This link expires in 24 hours. If you didn't create an account, you can ignore this email.`;

  return { subject, html, text };
}
