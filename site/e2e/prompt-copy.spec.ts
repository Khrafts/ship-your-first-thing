import { expect, test, type Page } from "@playwright/test";

// Copy controls on `prompt` fences (src/lib/content/prompt-blocks.ts renders
// the markup, src/lib/prompt-copy.ts wires the button). The contract under
// test: the button copies the prompt text exactly, "Copied" appears only after
// a real clipboard write, a failed write leaves the prompt selected with an
// honest notice, and diagrams / code fences get no control.
//
// Every candidate lesson below is open to signed-out visitors (Module 0, and
// Module 2 Lessons 1–2 never gate — see src/lib/unlock.ts), so no sign-in is
// needed. The first candidate that carries a prompt block is used, so the
// suite tracks the curriculum rather than one lesson's wording.

const PROMPT_LESSON_CANDIDATES = [
  "/modules/00-welcome/06-build-your-first-thing",
  "/modules/02-toolchain/01-your-ai-coding-agent",
] as const;
const DIAGRAM_LESSON_URL = "/modules/01-mental-models/01-how-the-web-works";

/** Open the first public lesson that renders a prompt block; return its path. */
async function gotoPromptLesson(page: Page): Promise<string> {
  for (const url of PROMPT_LESSON_CANDIDATES) {
    await page.goto(url);
    if ((await page.locator(".prompt-block").count()) > 0) return url;
  }
  throw new Error(
    `no prompt block on any public candidate lesson: ${PROMPT_LESSON_CANDIDATES.join(", ")}`,
  );
}
const MERMAID_TIMEOUT = 30_000;

const COPIED = "Copied";
const FAILED = /Couldn't copy/;

function firstBlock(page: Page) {
  return page.locator(".prompt-block").first();
}

/** The fence text as written: the rendered <code> ends in the fence's own
 *  newline, which is syntax, not prompt. */
async function promptTextOf(block: ReturnType<Page["locator"]>): Promise<string> {
  const raw = await block.locator("pre code").innerText();
  return raw.endsWith("\n") ? raw.slice(0, -1) : raw;
}

test.describe("prompt copy (clipboard granted)", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("server markup: every prompt block is labelled, with a status region and a control", async ({
    page,
  }) => {
    await gotoPromptLesson(page);
    const blocks = page.locator(".prompt-block");
    const count = await blocks.count();
    expect(count, "the build-first lesson ships copyable prompts").toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i += 1) {
      const block = blocks.nth(i);
      await expect(block.locator(".prompt-block-label")).toHaveText("Prompt");
      await expect(block.locator('[role="status"]')).toHaveCount(1);
      await expect(block.getByRole("button", { name: "Copy prompt" })).toBeVisible();
    }
    // One control per prompt, none anywhere else.
    expect(await page.locator(".prompt-copy").count()).toBe(count);
  });

  test("click copies the exact prompt text and shows Copied, which then clears", async ({
    page,
  }) => {
    await gotoPromptLesson(page);
    const block = firstBlock(page);
    const expected = await promptTextOf(block);
    expect(expected.length).toBeGreaterThan(0);

    await block.getByRole("button", { name: "Copy prompt" }).click();
    const status = block.locator('[role="status"]');
    await expect(status).toHaveText(COPIED);

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe(expected);
    expect(clipboard).not.toMatch(/^Prompt/);
    expect(clipboard).not.toMatch(/Copy$/);

    // The notice is transient; the control stays.
    await expect(status).toHaveText("", { timeout: 5_000 });
    await expect(block.getByRole("button", { name: "Copy prompt" })).toBeVisible();
  });

  test("copy survives theme changes in both directions", async ({ page }) => {
    await gotoPromptLesson(page);
    const block = firstBlock(page);
    const button = block.getByRole("button", { name: "Copy prompt" });
    for (const theme of ["dark", "light"]) {
      await page.getByRole("button", { name: `Switch to ${theme} theme` }).click();
      await expect(button).toBeVisible();
      await button.click();
      await expect(block.locator('[role="status"]')).toHaveText(COPIED);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await promptTextOf(block));
    }
  });

  test("keyboard: Tab reaches the control with a visible focus ring, Enter copies", async ({
    page,
  }) => {
    await gotoPromptLesson(page);
    const block = firstBlock(page);
    const expected = await promptTextOf(block);
    const button = block.getByRole("button", { name: "Copy prompt" });

    // Real keyboard path: from the top of the content (<main> is the skip-link
    // target, so clicking it sets the focus start point), Tab forward until
    // the control takes focus. Bounded so an unreachable control fails fast.
    await page.locator("main").click({ position: { x: 4, y: 4 } });
    let reached = false;
    for (let i = 0; i < 150 && !reached; i += 1) {
      await page.keyboard.press("Tab");
      reached = await button.evaluate((el) => el === document.activeElement);
    }
    expect(reached, "Tab reaches the copy control").toBe(true);
    await expect(button).toBeFocused();
    const outline = await button.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        visible: el.matches(":focus-visible"),
        style: style.outlineStyle,
        width: style.outlineWidth,
      };
    });
    expect(outline.visible).toBe(true);
    expect(outline.style).toBe("solid");
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);

    await page.keyboard.press("Enter");
    await expect(block.locator('[role="status"]')).toHaveText(COPIED);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  });

  test("repeated copies keep working and each prompt copies its own text", async ({
    page,
  }) => {
    await gotoPromptLesson(page);
    const blocks = page.locator(".prompt-block");
    const count = await blocks.count();
    const first = blocks.first();
    const firstText = await promptTextOf(first);

    await first.getByRole("button", { name: "Copy prompt" }).click();
    await expect(first.locator('[role="status"]')).toHaveText(COPIED);
    await first.getByRole("button", { name: "Copy prompt" }).click();
    await expect(first.locator('[role="status"]')).toHaveText(COPIED);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(firstText);

    if (count > 1) {
      const last = blocks.nth(count - 1);
      const lastText = await promptTextOf(last);
      await last.scrollIntoViewIfNeeded();
      await last.getByRole("button", { name: "Copy prompt" }).click();
      await expect(last.locator('[role="status"]')).toHaveText(COPIED);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(lastText);
      // The first block's notice is its own, not shared page state.
      expect(lastText).not.toBe(firstText);
    }
  });

  test("navigating away and back leaves no stale notice and no duplicate controls", async ({
    page,
  }) => {
    const lessonUrl = await gotoPromptLesson(page);
    const block = firstBlock(page);
    await block.getByRole("button", { name: "Copy prompt" }).click();
    await expect(block.locator('[role="status"]')).toHaveText(COPIED);

    await page.getByRole("link", { name: /Next →/ }).click();
    await page.waitForURL((url) => url.pathname !== lessonUrl);
    await page.goBack();
    await page.waitForURL(lessonUrl);

    const blocks = page.locator(".prompt-block");
    const count = await blocks.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(await page.locator(".prompt-copy").count()).toBe(count);
    for (let i = 0; i < count; i += 1) {
      await expect(blocks.nth(i).locator('[role="status"]')).toHaveText("");
      await expect(blocks.nth(i).getByRole("button", { name: "Copy prompt" })).toBeVisible();
    }
  });

  test("diagrams and code fences get no copy control", async ({ page }) => {
    await page.goto(DIAGRAM_LESSON_URL);
    await expect(page.locator(".mermaid-figure svg").first()).toBeVisible({
      timeout: MERMAID_TIMEOUT,
    });
    expect(await page.locator(".mermaid-figure .prompt-copy").count()).toBe(0);
    expect(await page.locator("pre:not(.prompt-block-text) + .prompt-copy").count()).toBe(0);
    // Any control on the page belongs to a prompt block.
    expect(await page.locator(".prompt-copy:not(.prompt-block .prompt-copy)").count()).toBe(0);
  });

  test("reference docs carry the same control", async ({ page }) => {
    await page.goto("/docs/cheatsheet");
    const blocks = page.locator(".prompt-block");
    const count = await blocks.count();
    test.skip(count === 0, "the cheatsheet has no prompt fences yet");
    const block = blocks.first();
    const expected = await promptTextOf(block);
    await block.getByRole("button", { name: "Copy prompt" }).click();
    await expect(block.locator('[role="status"]')).toHaveText(COPIED);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  });
});

test.describe("prompt copy (clipboard unavailable)", () => {
  test.beforeEach(async ({ context }) => {
    // Simulate a browser that refuses both copy paths — a denied permission,
    // an insecure context, or a locked-down profile. No permission dialog is
    // involved: the write rejects outright.
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: () => Promise.reject(new DOMException("denied", "NotAllowedError")),
        },
      });
      document.execCommand = () => false;
    });
  });

  test("a failed copy never says Copied; it selects the prompt and says what to do", async ({
    page,
  }) => {
    await gotoPromptLesson(page);
    const block = firstBlock(page);
    const expected = await promptTextOf(block);
    const status = block.locator('[role="status"]');

    await block.getByRole("button", { name: "Copy prompt" }).click();
    await expect(status).toHaveText(FAILED);
    await expect(status).not.toHaveText(COPIED);

    const selected = await page.evaluate(() => String(window.getSelection()));
    expect(selected.replace(/\n$/, "")).toBe(expected);
    expect(selected).not.toContain("Prompt");

    // The notice stays until the next attempt, unlike the transient success.
    await page.waitForTimeout(2_500);
    await expect(status).toHaveText(FAILED);
  });
});

test.describe("prompt copy (mobile)", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    permissions: ["clipboard-read", "clipboard-write"],
  });

  test("the control fits a phone width without horizontal overflow", async ({ page }) => {
    await gotoPromptLesson(page);
    const block = firstBlock(page);
    const button = block.getByRole("button", { name: "Copy prompt" });
    await expect(button).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const box = await button.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);

    await button.tap();
    await expect(block.locator('[role="status"]')).toHaveText(COPIED);
  });
});

// Lifecycle regressions (R1 correction round 1). These drive the real
// attach/cleanup path: server markup, delegated click, the async clipboard
// write, the reset timer, and the effect cleanup on client-side navigation.
test.describe("prompt copy (lifecycle)", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("a rapid second click before the first reset keeps its own full Copied interval", async ({
    page,
  }) => {
    await gotoPromptLesson(page);
    // Fake time so the 2 s reset is exact and the run is fast. The clipboard
    // write itself is real (microtasks are unaffected).
    await page.clock.install();
    const block = firstBlock(page);
    const button = block.getByRole("button", { name: "Copy prompt" });
    const status = block.locator('[role="status"]');

    await button.click();
    await expect(status).toHaveText(COPIED);
    await page.clock.runFor(1000);
    await button.click();
    await expect(status).toHaveText(COPIED);
    // 1.1 s later the FIRST click's reset would have fired: still Copied.
    await page.clock.runFor(1100);
    await expect(status).toHaveText(COPIED);
    // The second click's own interval ends 2 s after it.
    await page.clock.runFor(1000);
    await expect(status).toHaveText("");
  });

  test("two blocks keep independent notices", async ({ page }) => {
    await gotoPromptLesson(page);
    const blocks = page.locator(".prompt-block");
    test.skip((await blocks.count()) < 2, "needs a lesson with two prompts");
    await page.clock.install();
    const a = blocks.nth(0);
    const b = blocks.nth(1);
    await a.getByRole("button", { name: "Copy prompt" }).click();
    await expect(a.locator('[role="status"]')).toHaveText(COPIED);
    await page.clock.runFor(1000);
    await b.getByRole("button", { name: "Copy prompt" }).click();
    await expect(b.locator('[role="status"]')).toHaveText(COPIED);
    await page.clock.runFor(1100);
    await expect(a.locator('[role="status"]')).toHaveText("");
    await expect(b.locator('[role="status"]')).toHaveText(COPIED);
  });

  test("a write that resolves after navigating away changes nothing, old or new", async ({
    page,
  }) => {
    // Hold every clipboard write until the test releases it.
    await page.addInitScript(() => {
      const w = window as unknown as { __release: Array<() => void> };
      w.__release = [];
      const real = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = (text: string) =>
        new Promise<void>((resolve, reject) => {
          w.__release.push(() => real(text).then(resolve, reject));
        });
    });
    const lessonUrl = await gotoPromptLesson(page);
    const block = firstBlock(page);
    const oldStatus = await block.locator('[role="status"]').elementHandle();
    await block.getByRole("button", { name: "Copy prompt" }).click();
    // Still pending: no notice yet.
    await expect(block.locator('[role="status"]')).toHaveText("");

    // Client-side navigation swaps the article and runs the effect cleanup.
    await page.getByRole("link", { name: /Next →/ }).click();
    await page.waitForURL((url) => url.pathname !== lessonUrl);

    // Now let the old write finish.
    await page.evaluate(() => {
      const w = window as unknown as { __release: Array<() => void> };
      for (const release of w.__release.splice(0)) release();
    });
    await page.waitForTimeout(300);

    // The detached status node was never written to …
    expect(await oldStatus?.evaluate((el) => el.textContent)).toBe("");
    // … and nothing on the new page shows a notice it never earned.
    await expect(page.locator(".prompt-copy-status").filter({ hasText: /./ })).toHaveCount(0);
  });

  test("concurrent pending writes: the last click's outcome wins", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as {
        __pending: Array<{ ok: () => void; fail: () => void }>;
      };
      w.__pending = [];
      const real = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = (text: string) =>
        new Promise<void>((resolve, reject) => {
          w.__pending.push({
            ok: () => real(text).then(resolve, reject),
            fail: () => reject(new DOMException("denied", "NotAllowedError")),
          });
        });
      document.execCommand = () => false;
    });
    await gotoPromptLesson(page);
    const block = firstBlock(page);
    const button = block.getByRole("button", { name: "Copy prompt" });
    const status = block.locator('[role="status"]');
    const expected = await promptTextOf(block);

    await button.click();
    await button.click();
    await expect(status).toHaveText("");
    const settle = (i: number, ok: boolean) =>
      page.evaluate(
        ([index, good]) => {
          const w = window as unknown as {
            __pending: Array<{ ok: () => void; fail: () => void }>;
          };
          const entry = w.__pending[index as number];
          if (good) entry.ok();
          else entry.fail();
        },
        [i, ok] as const,
      );

    // The first (stale) write succeeds: no notice, because a newer click is pending.
    await settle(0, true);
    await page.waitForTimeout(200);
    await expect(status).toHaveText("");
    // The latest write fails: that is what the learner is told.
    await settle(1, false);
    await expect(status).toHaveText(FAILED);
    expect((await page.evaluate(() => String(window.getSelection()))).replace(/\n$/, "")).toBe(
      expected,
    );

    // Reverse order on a fresh pair: the latest succeeds, then a stale failure
    // arrives and must not overwrite Copied.
    await button.click();
    await button.click();
    await settle(3, true);
    await expect(status).toHaveText(COPIED);
    await settle(2, false);
    await page.waitForTimeout(200);
    await expect(status).toHaveText(COPIED);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  });
});
