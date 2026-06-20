import type { NextConfig } from "next";

// Baseline security headers for every route. No Content-Security-Policy yet:
// a useful script-src needs nonce plumbing through Next's inline runtime and
// the client-side mermaid renderer, which is its own piece of work.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Native/wasm packages the bundler must leave to Node's resolver.
  serverExternalPackages: ["@electric-sql/pglite", "pg", "bcryptjs", "nodemailer"],
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
