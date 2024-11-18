import { getDb } from '@/server/db';
import type { Post, Topic } from '@/types';

export let ssr = false;

async function queryPosts(id: string) {
	let db = await getDb();
	let query = `select id, body, title, solution, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE id=${id}`;
	let posts_raw = await db?.query<Array<Array<Post>>>(query);
	if (!posts_raw) return;
	return posts_raw[0];
}

async function queryTopics() {
	let db = await getDb();
	let raw_data = await db?.select<Topic>('topics');
	return raw_data;
}

async function loadPageData(id: string) {
	let response;
	let resPosts = await queryPosts(id);
	let resTopics = await queryTopics();
	response = {
		posts: resPosts,
		topics: resTopics,
		failed: false,
	};
	return response;
}

// eslint-disable-next-line
export async function load({ params, parent }: any) {
	await parent();
	let data = await loadPageData(params.slug);
	return data;
}
