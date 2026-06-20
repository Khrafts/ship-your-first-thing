import { describe, expect, it } from "vitest";
import { verificationEmail } from "@/lib/email/templates";

describe("verificationEmail", () => {
  const url = "https://shipyourfirstthing.com/verify-email?token=abc123";
  const mail = verificationEmail(url);

  it("has a non-empty subject", () => {
    expect(mail.subject.length).toBeGreaterThan(0);
  });

  it("embeds the confirmation URL in both html and plain text", () => {
    expect(mail.html).toContain(url);
    expect(mail.text).toContain(url);
  });

  it("escapes the URL in the html href so a crafted token can't break out", () => {
    const evil = verificationEmail(
      'https://x.example/verify?token="><script>alert(1)</script>',
    );
    expect(evil.html).not.toContain("<script>alert(1)</script>");
  });
});
