import { initDb } from "@/db";


export async function load() {
  await initDb()
  return null;
}

