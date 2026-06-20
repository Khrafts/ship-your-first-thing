import { recordEmail } from "./outbox";

// Email transport selection mirrors the database driver pattern in
// src/db/index.ts: a configured SMTP_HOST (PurelyMail in production) routes to
// Nodemailer; otherwise mail is captured to the in-memory outbox so local dev
// and the e2e suite need no mail service. nodemailer is imported lazily so it
// never enters the captured/dev path's module graph.

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail(message: MailMessage): Promise<void> {
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
