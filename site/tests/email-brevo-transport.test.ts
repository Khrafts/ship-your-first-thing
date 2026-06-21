import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearOutbox, getOutbox } from "@/lib/email/outbox";
import { parseEmailFrom, sendMail } from "@/lib/email/transport";

// Railway disables outbound SMTP off the Pro plan, so the app sends
// account-confirmation mail through Brevo's transactional HTTPS API (port 443)
// instead of nodemailer/SMTP. These tests pin that transport's request shape and
// error handling, and that BREVO_API_KEY takes precedence over SMTP_HOST.

describe("parseEmailFrom", () => {
  it("splits a 'Name <email>' from-header into name + email", () => {
    expect(
      parseEmailFrom("Ship Your First Thing <no-reply@shipyourfirstthing.com>"),
    ).toEqual({
      name: "Ship Your First Thing",
      email: "no-reply@shipyourfirstthing.com",
    });
  });

  it("returns a bare address with no name", () => {
    expect(parseEmailFrom("no-reply@shipyourfirstthing.com")).toEqual({
      email: "no-reply@shipyourfirstthing.com",
    });
  });
});

describe("Brevo HTTPS API transport", () => {
  const ENV_SNAPSHOT = { ...process.env };

  beforeEach(() => {
    clearOutbox();
    delete process.env.SMTP_HOST;
    process.env.BREVO_API_KEY = "xkeysib-test-key";
    process.env.EMAIL_FROM =
      "Ship Your First Thing <no-reply@shipyourfirstthing.com>";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...ENV_SNAPSHOT };
  });

  it("POSTs the message to Brevo's transactional API with the api-key header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ messageId: "<abc>" }), { status: 201 }),
      );

    await sendMail({
      to: "learner@example.com",
      subject: "Confirm your email",
      html: "<p>hi</p>",
      text: "hi",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({
      "api-key": "xkeysib-test-key",
      "content-type": "application/json",
    });
    const body = JSON.parse(init?.body as string);
    expect(body.sender).toEqual({
      name: "Ship Your First Thing",
      email: "no-reply@shipyourfirstthing.com",
    });
    expect(body.to).toEqual([{ email: "learner@example.com" }]);
    expect(body.subject).toBe("Confirm your email");
    expect(body.htmlContent).toBe("<p>hi</p>");
    expect(body.textContent).toBe("hi");
    // Must not silently fall through to the captured dev outbox.
    expect(getOutbox()).toHaveLength(0);
  });

  it("throws when Brevo responds with a non-2xx status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ code: "unauthorized", message: "Key not found" }),
        { status: 401 },
      ),
    );

    await expect(
      sendMail({ to: "learner@example.com", subject: "x", html: "x", text: "x" }),
    ).rejects.toThrow(/Brevo/i);
    expect(getOutbox()).toHaveLength(0);
  });

  it("takes precedence over SMTP when both BREVO_API_KEY and SMTP_HOST are set", async () => {
    process.env.SMTP_HOST = "smtp-relay.brevo.com";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 201 }));

    await sendMail({ to: "x@example.com", subject: "x", html: "x", text: "x" });

    // Routed through the HTTPS API (fetch), never the blocked SMTP path.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
