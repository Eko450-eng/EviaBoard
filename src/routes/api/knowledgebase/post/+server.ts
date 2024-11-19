import { getDb } from '@/server/db';
import type { Post, Topic } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	let id = url.searchParams.get('id');
	if (!id) return json({ status: 400 });

	let token = locals.jwt;
	if (!token) return json({ status: 500 });
	let db = await getDb();
	db?.authenticate(token);

	let query = `select id, body, title, solution, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE id=${id}`;
	let posts_raw = await db?.query<Array<Array<Post>>>(query);
	let raw_data = await db?.query<Topic[][]>('select * from topics');

	if (!posts_raw || !raw_data) return json({ status: 500 });

	return json({ posts: posts_raw[0], topics: raw_data[0] }, { status: 200 });
};
