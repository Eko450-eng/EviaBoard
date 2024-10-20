import { initDb } from "@/db";
import { DB } from './store'


export async function load() {
  let db = await initDb()
  if (!db) return
  DB.set(db)
  return null;
}

