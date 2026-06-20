import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "@/db/schema";
import type { Db } from "@/db";

const DB_KEY = Symbol.for("ship-your-first-thing.db.promise");

/**
 * Fresh in-memory PGlite with all migrations applied, bound to the same
 * globalThis slot getDb() reads — so code under test that calls getDb()
 * transparently uses this database. Returns the handle for direct seeding.
 */
export async function setupTestDb(): Promise<Db> {
  const client = new PGlite(); // in-memory; gone when the process exits
  const db = drizzle(client, { schema }) as unknown as Db;
  await migrate(db as never, {
    migrationsFolder: path.resolve(__dirname, "..", "..", "drizzle"),
  });
  (globalThis as Record<symbol, unknown>)[DB_KEY] = Promise.resolve(db);
  return db;
}

/** Insert a user row so foreign keys (user_id) are satisfiable. */
export async function seedUser(db: Db, id = "u-test"): Promise<string> {
  await db
    .insert(schema.users)
    .values({ id, email: `${id}@example.com` })
    .onConflictDoNothing();
  return id;
}
