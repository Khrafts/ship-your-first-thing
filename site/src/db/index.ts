import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Driver selection: a DATABASE_URL means real Postgres (Railway in
// production, Docker locally if you prefer). Without one we fall back to an
// embedded PGlite database so local dev and the Playwright suite need no
// external services. Both drivers expose the same Drizzle query API; the
// PGlite instance is cast to the node-postgres database type, which is safe
// for the query surface this app uses.

export type Db = ReturnType<typeof drizzleNodePg<typeof schema>>;

let dbPromise: Promise<Db> | null = null;

async function createDb(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url && url.length > 0) {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url });
    return drizzleNodePg(pool, { schema });
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const { mkdirSync } = await import("node:fs");
  const dataDir = process.env.PGLITE_DATA_DIR || ".data/pglite";
  mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  return drizzlePglite(client, { schema }) as unknown as Db;
}

export function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
}

export { schema };
