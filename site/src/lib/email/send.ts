import { verificationEmail } from "./templates";
import { sendMail } from "./transport";

/** Render and send the account-confirmation email. `url` is the absolute
 *  verification link (built with getBaseUrl + the raw token). */
export async function sendVerificationEmail(
  email: string,
  url: string,
): Promise<void> {
  const content = verificationEmail(url);
  await sendMail({ to: email, ...content });
}
