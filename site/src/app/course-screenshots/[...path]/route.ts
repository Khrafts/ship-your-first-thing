import { readScreenshot } from "@/lib/content/screenshots";

// Serves the canonical `screenshots/` directory from the deployed checkout so
// lesson images match the markdown they ship with. readScreenshot owns every
// boundary (segment shape, directory containment, symlink realpath, raster
// magic bytes); this handler only turns its answer into a response. Every
// refusal is the same 404 — no listing, no "exists but forbidden" signal.

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(req: Request, { params }: RouteContext): Promise<Response> {
  const { path: segments } = await params;
  const file = await readScreenshot(Array.isArray(segments) ? segments : []);
  if (!file) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
    });
  }

  const headers = {
    "Content-Type": file.contentType,
    "X-Content-Type-Options": "nosniff",
    // Short lifetime: a redeploy can replace an image at the same URL (e.g. a
    // privacy-redacted recapture), and the ETag revalidates cheaply after.
    "Cache-Control": "public, max-age=300, must-revalidate",
    ETag: file.etag,
  };
  if (req.headers.get("if-none-match") === file.etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(new Uint8Array(file.body), {
    status: 200,
    headers: { ...headers, "Content-Length": String(file.body.byteLength) },
  });
}
