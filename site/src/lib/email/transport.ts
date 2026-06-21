import { recordEmail } from "./outbox";

// Email transport selection, in priority order:
//   1. BREVO_API_KEY set  -> Brevo transactional HTTPS API (port 443).
//   2. SMTP_HOST set      -> Nodemailer over SMTP.
//   3. neither            -> in-memory outbox capture (local dev / e2e).
//
// The HTTPS API is first on purpose: Railway disables outbound SMTP (ports
// 25/465/587) on Free/Trial/Hobby plans, so a nodemailer connection to Brevo's
// relay times out (ETIMEDOUT/CONN) and the confirmation email never sends. The
// HTTPS API uses port 443, which is never blocked, so it works on every plan.
// The SMTP path is retained for self-hosting / Railway Pro / other providers.
// nodemailer is imported lazily so it never enters the API/captured path's graph.

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const BREVO_API_URL =
  process.env.BREVO_API_URL ?? "https://api.brevo.com/v3/smtp/email";

// How long to wait on the Brevo API before giving up. A bounded timeout means a
// provider hiccup surfaces as a fast error instead of a hung signup request.
const BREVO_TIMEOUT_MS = 15_000;

/** Split an EMAIL_FROM value into Brevo's `{ name, email }` sender shape.
 *  Accepts both `"Display Name <addr@host>"` and a bare `"addr@host"`. */
export function parseEmailFrom(value: string): { email: string; name?: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    const name = match[1].trim();
    const email = match[2].trim();
    return name ? { name, email } : { email };
  }
  return { email: value.trim() };
}

async function sendViaBrevoApi(
  apiKey: string,
  message: MailMessage,
): Promise<void> {
  const sender = parseEmailFrom(
    process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? "",
  );

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: message.to }],
        subject: message.subject,
        htmlContent: message.html,
        textContent: message.text,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    // Surface Brevo's error body (e.g. unauthenticated key, unverified sender)
    // so a failed send is a loud, diagnosable exception — never a silent drop.
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Brevo API send failed: ${response.status} ${response.statusText} ${detail}`.trim(),
    );
  }
}

export async function sendMail(message: MailMessage): Promise<void> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey && brevoKey.length > 0) {
    await sendViaBrevoApi(brevoKey, message);
    return;
  }

  const host = process.env.SMTP_HOST;
  if (host && host.length > 0) {
    const mod = await import("nodemailer");
    const createTransport = mod.createTransport ?? mod.default.createTransport;
    const port = Number(process.env.SMTP_PORT ?? "587");
    const user = process.env.SMTP_USER;
    const transporter = createTransport({
      host,
      port,
      // Implicit TLS on 465; STARTTLS (upgraded) on 587 and others.
      secure: port === 465,
      auth: user ? { user, pass: process.env.SMTP_PASSWORD } : undefined,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? user,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    return;
  }

  recordEmail({ ...message, sentAt: Date.now() });
  console.log(
    `[email:captured] to=${message.to} subject=${JSON.stringify(message.subject)}`,
  );
}
