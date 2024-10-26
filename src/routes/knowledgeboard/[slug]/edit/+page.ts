import { db } from "@/db";
import type { Topic } from "@/types";

async function queryTopics() {
  let raw_data = await db?.select<Topic>("topics");
  return raw_data;
}

export let ssr = false;

// eslint-disable-next-line
export async function load({ params, parent }: any) {
  await parent()
  let topics = await queryTopics();
  return {
    topics,
    params
  }
}
