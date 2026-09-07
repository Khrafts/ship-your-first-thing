import path from "node:path";

/** Repo root holding modules/, screenshots/, GLOSSARY.md, SETUP.md. The site
 *  always runs with cwd = site/ (dev, build, start, Docker), so the parent
 *  directory is the default; CONTENT_ROOT overrides it for unusual layouts. */
export function contentRoot(): string {
  const override = process.env.CONTENT_ROOT;
  if (override && override.length > 0) {
    return path.resolve(override);
  }
  return path.resolve(process.cwd(), "..");
}
