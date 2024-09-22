import { env } from "$env/dynamic/public";
import { Surreal } from "surrealdb";

let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
  if (db) return db;
  db = new Surreal();
  try {
    await db.connect(env.PUBLIC_DB_HOST, {
      auth: {
        username: env.PUBLIC_DB_ROOT_NAME,
        password: env.PUBLIC_DB_ROOT_PW,
      }
    });
    await db.use({
      namespace: env.PUBLIC_DB_NS,
      database: env.PUBLIC_DB_DB,
    });

    return db;
  } catch (err) {
    console.error("Failed to connect to SurrealDB:", err);
    throw err;
  }
}

export async function closeDb(): Promise<void> {
  if (!db) return;
  await db.close();
  db = undefined;
}

export function getDb(): Surreal | undefined {
  return db;
}
