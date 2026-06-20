import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Driver selection: a DATABASE_URL means real Postgres (Railway in
// production, Docker locally if you prefer). Without one we fall back to an
// embedded PGlite database so local dev and the Playwright suite need no
// external services. Both drivers expose the same Drizzle query API; the
// PGlite instance is cast to the node-postgres database type, which is safe
// for the query surface this app uses.

export type Db = ReturnType<typeof drizzleNodePg<typeof schema>>;

// The handle is cached on globalThis, not a module-level variable, on purpose.
// A Next.js production build instantiates this module separately in the
// server-action/RSC graph and in the route-handler graph, so a module-level
// promise would create TWO database handles per process. For Postgres that
// just wastes a connection pool; for the embedded PGlite driver it's a
// correctness bug — two instances on the same data dir don't share in-memory
// writes, so e.g. a token written by a server action is invisible to the
// /verify-email route handler. A Symbol.for-keyed slot on globalThis is one
// handle shared across every server bundle in the process.
const DB_KEY = Symbol.for("ship-your-first-thing.db.promise");

type GlobalWithDb = typeof globalThis & {
  [DB_KEY]?: Promise<Db> | null;
};

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
  const g = globalThis as GlobalWithDb;
  if (!g[DB_KEY]) {
    const promise = createDb();
    // A failed init must not be cached forever — clear the slot so the next
    // request retries. The resolved-promise fast path stays: a successful
    // promise is never evicted.
    promise.catch(() => {
      if (g[DB_KEY] === promise) {
        g[DB_KEY] = null;
      }
    });
    g[DB_KEY] = promise;
  }
  return g[DB_KEY];
}

export { schema };
