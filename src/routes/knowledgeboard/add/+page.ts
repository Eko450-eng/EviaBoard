import { db } from "@/db";
import type { Topic } from "@/types";

async function queryTopics() {
	const raw_data = await db?.select<Topic>("topics");
	return raw_data;
}

export const ssr = false;

// eslint-disable-next-line
export async function load({ parent }: any) {
	await parent();
	const topics = await queryTopics();
	return {
		topics,
	};
}
