import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { News, Newspost } from '@/types';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (!token) return jres(401);
	let db = await getDb();
	db?.authenticate(token);
	let { postData, post }: { postData: Newspost; post: News } =
		await request.json();

	try {
		if (!postData) return jres(400);
		await db
			?.query<Newspost[][]>(
				`CREATE newspost SET
      name = $name,
      owner = type::record($token.ID)
    `,
				{
					name: postData.name,
				},
			)
			.then(async (data) => {
				let newPost = data;
				await db?.query(
					`RELATE ${post.id} -> news_post -> ${newPost[0][0].id}`,
					{
						in: post?.id,
						out: newPost[0][0].id,
					},
				);
			});
	} catch (e) {
		console.error(e);
		return jres(400);
	}

	return jres(201, 'Posted', `Dieser Beitrag wurde gepostet WOHOO`);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (!token) return jres(401);
	let db = await getDb();
	db?.authenticate(token);
	let { recordId } = await request.json();

	try {
		if (!recordId) return jres(400);
		await db?.query<Newspost[][]>(
			`DELETE newspost WHERE id = type::record($recordId)`,
			{
				recordId: recordId,
			},
		);
	} catch (e) {
		console.error(e);
		return jres(400);
	}

	return jres(200, 'Deleted', `Dieser Beitrag wurde gelöscht`);
};
