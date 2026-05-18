import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../database/schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDb | null = null;

function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const client = postgres(connectionString, { ssl: "require", max: 1 });
  _db = drizzle(client, { schema });
}

export const db = new Proxy<DrizzleDb>({} as DrizzleDb, {
  get(_, prop) {
    if (!_db) initDb();
    return _db![prop as keyof DrizzleDb];
  },
});

export type DB = DrizzleDb;
