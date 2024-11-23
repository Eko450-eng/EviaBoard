import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { Post, Topic } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { RecordId } from 'surrealdb';

export const GET: RequestHandler = async ({ locals }) => {
	let token = locals.jwt;
	if (!token) return jres(401);
	let db = await getDb();
	db?.authenticate(token);

	let query = `select id, body, title, topic.name as topic, owner.id, owner.name, owner.image, deleted, created_at, count(->post_vote) AS upvoteCount, (SELECT out.voter.name as name FROM post_vote WHERE in.id == $parent.id) as voter from posts WHERE  !deleted OR deleted AND owner = $auth.id ORDER created_at DESC`;
	let posts_raw = await db?.query<Array<Array<Post>>>(query);
	let raw_data = await db?.query<Topic[][]>('select * from topics');

	if (!posts_raw || !raw_data) return jres(404);

	return json({ posts: posts_raw[0], topics: raw_data[0] }, { status: 200 });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return jres(401);
	db?.authenticate(token);

	let { id, state }: { id: RecordId | string; state: boolean } =
		await request.json();

	try {
		await db
			?.query(`UPDATE posts SET deleted = ${state} WHERE id = ${id}`)
			.then(() => {
				return jres(200, 'Post wurde geupdatet');
			});
		return jres(200, 'Post wurde vielleicht geupdatet');
	} catch (e) {
		console.error(e);
		return jres(400, 'Fehler', 'Post wurde nicht geupdatet');
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return jres(401);
	db?.authenticate(token);

	let { postData } = await request.json();
	try {
		if (!postData) jres(400);
		await db?.query(
			`CREATE posts 
        SET 
				deleted = false,
				title = "${postData.title}",
				body = "${postData.body}",
				solution = "${postData.solution}",
				owner = ${postData.owner},
				topic = ${postData.topic}
`,
		);
		return jres(200, 'Posted', 'Dein Beitrag wurde gepostet');
	} catch (e) {
		console.error(e);
		return jres(400);
	}
};
