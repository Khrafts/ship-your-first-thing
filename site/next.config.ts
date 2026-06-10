import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/wasm packages the bundler must leave to Node's resolver.
  serverExternalPackages: ["@electric-sql/pglite", "pg", "bcryptjs"],
};

export default nextConfig;
