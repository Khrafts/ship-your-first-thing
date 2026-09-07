import { mkdtemp, mkdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { GET } from "@/app/course-screenshots/[...path]/route";
import {
  isScreenshotImagePath,
  readScreenshot,
  screenshotRoute,
} from "@/lib/content/screenshots";

// The helper reads <CONTENT_ROOT>/screenshots — the same root the markdown
// loader uses. These tests build a throwaway root with one real PNG, one
// JPEG mislabeled as .png, decoys for every boundary, and a symlink that
// points outside the directory, then point CONTENT_ROOT at it.

const PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);

let root: string;
let outside: string;
const previousRoot = process.env.CONTENT_ROOT;

const get = (segments: string[], headers?: Record<string, string>) =>
  GET(new Request(`http://t/course-screenshots/${segments.join("/")}`, { headers }), {
    params: Promise.resolve({ path: segments }),
  });

beforeAll(async () => {
  const tmp = await realpath(await mkdtemp(path.join(os.tmpdir(), "syft-shots-")));
  root = path.join(tmp, "repo");
  outside = path.join(tmp, "outside");
  const shots = path.join(root, "screenshots", "m0", "06-build-your-first-thing");
  await mkdir(shots, { recursive: true });
  await mkdir(outside, { recursive: true });
  await writeFile(path.join(shots, "checklist-example.png"), PNG);
  await writeFile(path.join(shots, "photo-in-png-clothing.png"), JPEG);
  await writeFile(path.join(shots, "not-an-image.png"), "<svg onload=alert(1)/>");
  await writeFile(path.join(root, "screenshots", "README.md"), "# Screenshots\n");
  await writeFile(path.join(root, "secret.png"), PNG); // real PNG, but outside screenshots/
  await writeFile(path.join(outside, "leak.png"), PNG);
  await symlink(path.join(outside, "leak.png"), path.join(shots, "escape-link.png"));
  await symlink(outside, path.join(root, "screenshots", "escape-dir"));
  process.env.CONTENT_ROOT = root;
});

afterAll(async () => {
  if (previousRoot === undefined) delete process.env.CONTENT_ROOT;
  else process.env.CONTENT_ROOT = previousRoot;
  await rm(path.dirname(root), { recursive: true, force: true });
});

describe("screenshot route mapping", () => {
  it("recognises raster images below screenshots/ only", () => {
    expect(isScreenshotImagePath("screenshots/m4/02-sign-in/confirm-email-off.png")).toBe(true);
    expect(isScreenshotImagePath("screenshots/m0/x/y.webp")).toBe(true);
    expect(isScreenshotImagePath("screenshots/m0/x/y.svg")).toBe(false);
    expect(isScreenshotImagePath("screenshots/README.md")).toBe(false);
    expect(isScreenshotImagePath("diagrams/m1/flow.png")).toBe(false);
    expect(isScreenshotImagePath("screenshots-old/a.png")).toBe(false);
  });

  it("maps a repo path onto the same-origin route", () => {
    expect(screenshotRoute("screenshots/m4/02-sign-in/confirm-email-off.png")).toBe(
      "/course-screenshots/m4/02-sign-in/confirm-email-off.png",
    );
  });
});

describe("readScreenshot", () => {
  it("reads an existing PNG from CONTENT_ROOT/screenshots", async () => {
    const file = await readScreenshot(["m0", "06-build-your-first-thing", "checklist-example.png"]);
    expect(file).not.toBeNull();
    expect(file!.contentType).toBe("image/png");
    expect(Buffer.compare(file!.body, PNG)).toBe(0);
    expect(file!.etag).toMatch(/^"[0-9a-f]+-[0-9a-f]+"$/);
  });

  it("reports the sniffed type when the extension lies", async () => {
    const file = await readScreenshot([
      "m0",
      "06-build-your-first-thing",
      "photo-in-png-clothing.png",
    ]);
    expect(file!.contentType).toBe("image/jpeg");
  });

  it("refuses missing files, directories, non-image extensions and mislabeled content", async () => {
    expect(await readScreenshot(["m0", "06-build-your-first-thing", "nope.png"])).toBeNull();
    expect(await readScreenshot(["m0", "06-build-your-first-thing"])).toBeNull();
    expect(await readScreenshot(["m0"])).toBeNull();
    expect(await readScreenshot([])).toBeNull();
    expect(await readScreenshot(["README.md"])).toBeNull();
    expect(await readScreenshot(["m0", "06-build-your-first-thing", "not-an-image.png"])).toBeNull();
  });

  it("refuses traversal, absolute, hidden and encoded-escape segments", async () => {
    expect(await readScreenshot(["..", "secret.png"])).toBeNull();
    expect(await readScreenshot(["m0", "..", "..", "secret.png"])).toBeNull();
    expect(
      await readScreenshot([".", "m0", "06-build-your-first-thing", "checklist-example.png"]),
    ).toBeNull();
    expect(await readScreenshot(["../secret.png"])).toBeNull();
    expect(await readScreenshot(["..%2Fsecret.png"])).toBeNull();
    expect(await readScreenshot(["%2e%2e", "secret.png"])).toBeNull();
    expect(await readScreenshot(["..\\secret.png"])).toBeNull();
    expect(await readScreenshot(["/etc/passwd.png"])).toBeNull();
    expect(await readScreenshot([`${root}/secret.png`])).toBeNull();
    expect(await readScreenshot(["", "m0"])).toBeNull();
    expect(await readScreenshot([".hidden.png"])).toBeNull();
    expect(await readScreenshot(["m0 ", "x.png"])).toBeNull();
  });

  it("refuses symlinks that resolve outside screenshots/", async () => {
    expect(await readScreenshot(["m0", "06-build-your-first-thing", "escape-link.png"])).toBeNull();
    expect(await readScreenshot(["escape-dir", "leak.png"])).toBeNull();
  });
});

describe("GET /course-screenshots/[...path]", () => {
  it("serves an image with its MIME type, nosniff and a revalidating cache policy", async () => {
    const res = await get(["m0", "06-build-your-first-thing", "checklist-example.png"]);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Cache-Control")).toContain("must-revalidate");
    expect(res.headers.get("Content-Length")).toBe(String(PNG.length));
    expect(Buffer.compare(Buffer.from(await res.arrayBuffer()), PNG)).toBe(0);
  });

  it("answers 304 to a matching If-None-Match", async () => {
    const first = await get(["m0", "06-build-your-first-thing", "checklist-example.png"]);
    const etag = first.headers.get("ETag")!;
    const res = await get(["m0", "06-build-your-first-thing", "checklist-example.png"], {
      "if-none-match": etag,
    });
    expect(res.status).toBe(304);
  });

  it("returns the same 404 for missing, traversal, non-image and symlink-escape requests", async () => {
    for (const segments of [
      ["m0", "06-build-your-first-thing", "missing.png"],
      ["..", "secret.png"],
      ["m0", "06-build-your-first-thing", "not-an-image.png"],
      ["m0", "06-build-your-first-thing", "escape-link.png"],
      ["README.md"],
      ["m0", "06-build-your-first-thing"],
    ]) {
      const res = await get(segments);
      expect(res.status, segments.join("/")).toBe(404);
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("Content-Type")).not.toMatch(/^image\//);
    }
  });
});
