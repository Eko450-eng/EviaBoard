import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { News_newspost } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	let db = await getDb();

	const query =
		'SELECT *, owner.name, owner.image, -> news_post.out.* as newspost from news ORDER BY date desc';

	const res = await db?.query<Array<Array<News_newspost>>>(query);

	if (!res || !res[0]) return jres(400);

	return json({ data: res[0] }, { status: 200 });
};
