import { db } from '@/db';
import type { News_newspost } from '@/types';

export async function load() {
	const query =
		'SELECT *, owner.name, owner.image, -> news_post.out.* as newspost from news ORDER BY date desc';

	const res = await db?.query<Array<Array<News_newspost>>>(query);

	if (!res) return;
	const data = res[0];
	return {data};
}
