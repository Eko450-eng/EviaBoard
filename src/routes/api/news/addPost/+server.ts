import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { News, Newspost } from '@/types';

export async function POST({ request }: any) {
	let {
		postData,
		post,
		token,
	}: { postData: Newspost; post: News; token: string } = await request.json();
	let db = await getDb();
	db?.authenticate(token);
	try {
		if (!postData) return jres(400);
		await db?.create('newspost', postData).then(async (data) => {
			let newPost = data;
			await db?.insert_relation('news_post', {
				in: post?.id,
				out: newPost[0].id,
			});
		});
	} catch (e) {
		console.error(e);
		return jres(400);
	}

	return jres(200, 'Posted', `Dieser Beitrag wurde gepostet WOHOO`);
}
