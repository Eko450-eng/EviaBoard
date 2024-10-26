import { db } from "@/db";
import type { Post, Topic } from "@/types";

export const ssr = false;

async function queryPosts(id: string) {
	const query = `select id, body, title, solution, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE id=${id}`;
	const posts_raw = await db?.query<Array<Array<Post>>>(query);
	if (!posts_raw) return;
	return posts_raw[0];
}

async function queryTopics() {
	const raw_data = await db?.select<Topic>("topics");
	return raw_data;
}

async function loadPageData(id: string) {
	let response;
	const resPosts = await queryPosts(id);
	const resTopics = await queryTopics();
	response = {
		posts: resPosts,
		topics: resTopics,
		failed: false,
	};
	return response;
}

// eslint-disable-next-line
export async function load({ params }: any) {
	console.time("Startd");
	const data = await loadPageData(params.slug);
	console.timeEnd("Startd");
	return data;
}
