import { db } from "@/db";
import type { Post, Topic } from "@/types";
import { checkLoggedIn } from "../store";

async function queryPosts() {
	const query =
		"select id, body, title, topic.name as topic, owner.id, owner.name, owner.image, deleted, created_at from posts WHERE  !deleted OR deleted AND owner = $auth.id";
	const posts_raw = await db?.query<Array<Array<Post>>>(query);
	if (!posts_raw) return;
	return posts_raw[0];
}

async function queryTopics() {
	const raw_data = await db?.select<Topic>("topics");
	return raw_data;
}

export const ssr = false;
export const csr = true;

async function loadPageData() {
	checkLoggedIn();
	let response;
	const resPosts = await queryPosts();
	const resTopics = await queryTopics();
	response = {
		res: resPosts,
		topics: resTopics,
		failed: false,
	};
	return response;
}

// eslint-disable-next-line
export async function load({ parent }: any) {
	await parent();
	const data = await loadPageData();
	return {
		posts: data?.res,
		topics: data?.topics,
		failed: data?.failed,
	};
}
