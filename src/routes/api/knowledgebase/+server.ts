import { getDb } from '@/server/db';
import type { Post, Topic } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { RecordId } from 'surrealdb';

export const GET: RequestHandler = async ({ locals }) => {
	let token = locals.jwt;
	if (!token) return json({ status: 500 });
	let db = await getDb();
	db?.authenticate(token);

	let query = `select id, body, title, topic.name as topic, owner.id, owner.name, owner.image, deleted, created_at, count(->post_vote) AS upvoteCount, (SELECT out.voter.name as name FROM post_vote WHERE in.id == $parent.id) as voter from posts WHERE  !deleted OR deleted AND owner = $auth.id ORDER created_at DESC`;
	let posts_raw = await db?.query<Array<Array<Post>>>(query);
	let raw_data = await db?.query<Topic[][]>('select * from topics');

	if (!posts_raw || !raw_data) return json({ status: 500 });

	return json({ posts: posts_raw[0], topics: raw_data[0] }, { status: 200 });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return json({ status: 500 });
	db?.authenticate(token);

	let { id, state }: { id: RecordId | string; state: boolean } =
		await request.json();

	try {
		await db
			?.query(`UPDATE posts SET deleted = ${state} WHERE id = ${id}`)
			.then(() => {
				return json({ title: 'Post wurde geupdatet' }, { status: 200 });
			});
		return json({ title: 'Post wurde vielleicht geupdatet' }, { status: 200 });
	} catch (e) {
		console.error(e);
		return json({ title: 'Post wurde nicht geupdatet' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return json({ status: 500 });
	db?.authenticate(token);

	let { postData } = await request.json();
	try {
		if (!postData) return json({ status: 500 });
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
		return json(
			{
				title: 'Posted',
				description: 'Dein Beitrag wurde gepostet',
			},
			{ status: 200 },
		);
	} catch (e) {
		console.error(e);
		return json(
			{
				title: 'Fehler',
				description: `This failed due to: ${e}, probably not my fault`,
			},
			{ status: 500 },
		);
	}
};
