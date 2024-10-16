import { initDb } from "@/db";

export async function load({ params }: any) {
  await initDb()
  return null;
}
