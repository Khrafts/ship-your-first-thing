// Same-origin delivery for the canonical `screenshots/` directory. Lessons
// reference images as `../../screenshots/m4/<lesson>/<name>.png`; rewriteUrl
// maps those onto SCREENSHOT_ROUTE_PREFIX and the route handler under
// src/app/course-screenshots/ reads the file from the deployed checkout via
// this module. Serving from the checkout (not raw.githubusercontent.com/main)
// means a lesson shows the image that ships with it — new files exist, and a
// privacy-redacted file replaces the old one instead of the remote original.

import { open, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { contentRoot } from "./root";

/** Public URL prefix the rewritten `<img src>` values start with. */
export const SCREENSHOT_ROUTE_PREFIX = "/course-screenshots";

/** Repo-relative directory the route serves from. Nothing outside it is
 *  reachable, whatever the request says. */
export const SCREENSHOT_DIR = "screenshots";

/** Raster formats the route serves: extension → the byte runs (at their
 *  offsets) the file must carry. SVG is deliberately absent (it is markup,
 *  can carry script, and is not a screenshot). */
interface RasterType {
  mime: string;
  magic: Array<[offset: number, bytes: number[]]>;
}

const RASTER_TYPES: Record<string, RasterType> = {
  png: { mime: "image/png", magic: [[0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]]] },
  jpg: { mime: "image/jpeg", magic: [[0, [0xff, 0xd8, 0xff]]] },
  jpeg: { mime: "image/jpeg", magic: [[0, [0xff, 0xd8, 0xff]]] },
  gif: { mime: "image/gif", magic: [[0, [0x47, 0x49, 0x46, 0x38]]] },
  // "RIFF" <size> "WEBP"
  webp: {
    mime: "image/webp",
    magic: [
      [0, [0x52, 0x49, 0x46, 0x46]],
      [8, [0x57, 0x45, 0x42, 0x50]],
    ],
  },
};

const RASTER_EXTENSION = new RegExp(`\\.(?:${Object.keys(RASTER_TYPES).join("|")})$`, "i");

/** A path segment the route accepts: kebab/snake names with an optional
 *  extension. No leading dot (hidden files), no slashes, backslashes,
 *  percent-escapes, or anything else that could smuggle a path separator. */
const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

/** True when a normalized repo-relative path is a raster image under the
 *  screenshots directory — the only image references rewriteUrl routes. */
export function isScreenshotImagePath(repoRelative: string): boolean {
  return repoRelative.startsWith(`${SCREENSHOT_DIR}/`) && RASTER_EXTENSION.test(repoRelative);
}

/** Site route for a normalized repo-relative screenshot path. */
export function screenshotRoute(repoRelative: string): string {
  return `${SCREENSHOT_ROUTE_PREFIX}/${repoRelative.slice(SCREENSHOT_DIR.length + 1)}`;
}

export interface ScreenshotFile {
  body: Buffer;
  contentType: string;
  etag: string;
}

/** Sniff the raster type from the leading bytes. Returns null when the bytes
 *  match none of the supported formats (a non-image with an image extension,
 *  or a truncated file). */
function sniffRaster(head: Buffer): string | null {
  for (const { mime, magic } of Object.values(RASTER_TYPES)) {
    if (magic.every(([offset, bytes]) => bytes.every((b, i) => head[offset + i] === b))) {
      return mime;
    }
  }
  return null;
}

/**
 * Resolve URL path segments (already URL-decoded by the router) to a
 * screenshot file, or null when the request must be refused. Every refusal is
 * a null — the route answers 404 for all of them, so the response never
 * distinguishes "outside the directory" from "no such file".
 *
 * Boundaries, in order:
 *   1. every segment matches SAFE_SEGMENT (no `.`, `..`, empty, hidden, or
 *      separator-bearing segments, so no traversal or encoded escape);
 *   2. the last segment carries a supported raster extension;
 *   3. the joined path stays below <contentRoot>/screenshots lexically;
 *   4. the realpath of the file stays below the realpath of that directory
 *      (a symlink pointing outside is refused);
 *   5. the target is a regular file whose leading bytes are a supported
 *      raster format (directories, listings, and mislabeled files are refused).
 */
export async function readScreenshot(segments: string[]): Promise<ScreenshotFile | null> {
  if (segments.length === 0 || segments.length > 8) return null;
  if (!segments.every((segment) => SAFE_SEGMENT.test(segment))) return null;
  const relative = segments.join("/");
  if (!RASTER_EXTENSION.test(relative)) return null;

  const rootDir = path.join(contentRoot(), SCREENSHOT_DIR);
  const candidate = path.resolve(rootDir, ...segments);
  if (!candidate.startsWith(rootDir + path.sep)) return null;

  let realRoot: string;
  let realFile: string;
  try {
    [realRoot, realFile] = await Promise.all([realpath(rootDir), realpath(candidate)]);
  } catch {
    return null; // missing file or directory
  }
  if (!realFile.startsWith(realRoot + path.sep)) return null;

  const info = await stat(realFile);
  if (!info.isFile()) return null;

  const handle = await open(realFile, "r");
  try {
    const head = Buffer.alloc(12);
    const { bytesRead } = await handle.read(head, 0, head.length, 0);
    const contentType = sniffRaster(head.subarray(0, bytesRead));
    if (!contentType) return null;
    const body = await handle.readFile();
    return {
      body,
      contentType,
      etag: `"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`,
    };
  } finally {
    await handle.close();
  }
}
