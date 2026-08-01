import { Pool } from "pg";
import runner from "node-pg-migrate";
import { join } from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

runner({
  databaseUrl: process.env.DATABASE_URL!,
  dir: join(__dirname, "../migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
  log: () => {},
}).catch(console.error);

export default pool;
