import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { Post, Topic } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	let id = url.searchParams.get('id');
	if (!id) return jres(400);

	let token = locals.jwt;
	if (!token) return json(401);
	let db = await getDb();
	db?.authenticate(token);

	let posts_raw = await db?.query<Array<Array<Post>>>(
		'select id, body, title, solution, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE id = type::record($id)',
		{ id: id },
	);

	let raw_data = await db?.query<Topic[][]>('select * from topics');

	if (!posts_raw || !raw_data) return jres(404);

	return json({ posts: posts_raw[0], topics: raw_data[0] }, { status: 200 });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	let { postData } = await request.json();
	let token = locals.jwt;
	if (!postData) return jres(400);
	if (!token) return jres(401);
	let db = await getDb();
	db?.authenticate(token);

	await db
		?.query(
			`
      UPDATE posts SET
        title = $title,
        body = $body,
        deleted = $deleted,
        solution = "$solution"
        WHERE id = type::record($id)
    `,
			{
				title: postData.title,
				body: postData.body,
				deleted: postData.deleted,
				solution: postData.solution,
				id: postData.id,
			},
		)
		.then((res) => {
			if (res) {
				return jres(200, 'Geupdated', 'Update hochgeladen');
			} else {
				return jres(404);
			}
		});
	return jres(200, 'Geupdated', 'Update hochgeladen');
};
