import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LessonLocked } from "@/components/lesson-locked";

// The locked card is the one place a learner who hit a gate reads what to do.
// Both branches must name the gating lesson as a link (chain order: Module 2
// Lesson 3's gate is Module 0 Lesson 6), and the signed-out branch must keep
// the open-access explanation and the course-start link.

const GATE = {
  title: "Build your first thing",
  href: "/modules/00-welcome/06-build-your-first-thing",
  label: "Module 0, Lesson 6",
};
const FIRST = { title: "Welcome", href: "/modules/00-welcome/01-welcome" };

describe("LessonLocked", () => {
  it("signed in: names and links the gating lesson", () => {
    const html = renderToStaticMarkup(
      <LessonLocked signedIn gate={GATE} firstLesson={FIRST} />,
    );
    expect(html).toContain(`href="${GATE.href}"`);
    expect(html).toContain("Build your first thing");
    expect(html).toContain("(Module 0, Lesson 6)");
    expect(html).not.toContain("/signin");
  });

  it("signed out: explains open access, names the gate, and links sign-in and the course start", () => {
    const html = renderToStaticMarkup(
      <LessonLocked signedIn={false} gate={GATE} firstLesson={FIRST} />,
    );
    expect(html).toContain("Module 0 is open to everyone");
    expect(html).toContain(`href="${GATE.href}"`);
    expect(html).toContain('href="/signin"');
    expect(html).toContain(`href="${FIRST.href}"`);
  });

  it("signed out with no gate: still offers the course start", () => {
    const html = renderToStaticMarkup(
      <LessonLocked signedIn={false} gate={null} firstLesson={FIRST} />,
    );
    expect(html).not.toContain("opens after");
    expect(html).toContain(`href="${FIRST.href}"`);
  });
});
