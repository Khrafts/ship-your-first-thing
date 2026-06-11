// Applies ./drizzle migrations against whichever database the environment
// selects (Postgres via DATABASE_URL, embedded PGlite otherwise). Runs as a
// separate process before the server starts — never inside the build.
import path from "node:path";

const migrationsFolder = path.resolve(__dirname, "..", "drizzle");

async function main() {
  const url = process.env.DATABASE_URL;
  if (url && url.length > 0) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    const pool = new Pool({ connectionString: url });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder });
    await pool.end();
    console.log("migrations applied (postgres)");
    return;
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const { mkdirSync } = await import("node:fs");
  const dataDir = process.env.PGLITE_DATA_DIR || ".data/pglite";
  mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  const db = drizzle(client);
  await migrate(db, { migrationsFolder });
  await client.close();
  console.log(`migrations applied (pglite at ${dataDir})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
