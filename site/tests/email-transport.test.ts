import { beforeEach, describe, expect, it } from "vitest";
import { clearOutbox, getOutbox, latestEmailTo } from "@/lib/email/outbox";
import { sendMail } from "@/lib/email/transport";

// With no SMTP_HOST in the environment, sendMail uses the captured transport:
// it records to the in-memory outbox instead of hitting a network service.
describe("captured email transport", () => {
  beforeEach(() => {
    clearOutbox();
    delete process.env.SMTP_HOST;
    delete process.env.BREVO_API_KEY;
  });

  it("records a sent message to the outbox", async () => {
    await sendMail({
      to: "learner@example.com",
      subject: "Confirm your email",
      html: "<p>hi</p>",
      text: "hi",
    });

    const box = getOutbox();
    expect(box).toHaveLength(1);
    expect(box[0].to).toBe("learner@example.com");
    expect(box[0].subject).toBe("Confirm your email");
  });

  it("latestEmailTo returns the most recent message for an address", async () => {
    await sendMail({ to: "a@example.com", subject: "first", html: "", text: "" });
    await sendMail({ to: "a@example.com", subject: "second", html: "", text: "" });
    await sendMail({ to: "b@example.com", subject: "other", html: "", text: "" });

    expect(latestEmailTo("a@example.com")?.subject).toBe("second");
    expect(latestEmailTo("nobody@example.com")).toBeUndefined();
  });
});
