import { defineConfig } from "drizzle-kit";

// Migrations are generated from src/db/schema.ts (the source of truth) into
// ./drizzle. The runtime driver (Postgres vs PGlite) is chosen in
// src/db/index.ts; drizzle-kit only needs the dialect here.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : undefined,
});
