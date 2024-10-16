import { initDb } from "@/db";

export async function load({ params }: any) {
  console.log("Loading DB initializing")
  await initDb()
  return null;
}
