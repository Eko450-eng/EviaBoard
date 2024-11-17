import { getDb } from '@/server/db';
import type { News_newspost } from '@/types';
import { json } from '@sveltejs/kit';

export async function GET() {
	let db = await getDb();
	const query =
		'SELECT *, owner.name, owner.image, -> news_post.out.* as newspost from news ORDER BY date desc';

	const res = await db?.query<Array<Array<News_newspost>>>(query);

	if (!res || !res[0]) return;
	let data = res[0];

	return json(data);
}
