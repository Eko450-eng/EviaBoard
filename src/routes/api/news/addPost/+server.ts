import { getDb } from '@/server/db';
import type { News, Newspost } from '@/types';
import { json } from '@sveltejs/kit';

export async function POST({ request }: any) {
	let {
		postData,
		post,
		token,
	}: { postData: Newspost; post: News; token: string } = await request.json();
	let db = await getDb();
	db?.authenticate(token);
	try {
		if (!postData) return;
		await db?.create('newspost', postData).then(async (data) => {
			let newPost = data;
			await db?.insert_relation('news_post', {
				in: post?.id,
				out: newPost[0].id,
			});
		});
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

	return json(
		{
			title: 'Posted',
			description: `Dieser Beitrag wurde gepostet WOHOO`,
		},
		{ status: 200 },
	);
}
