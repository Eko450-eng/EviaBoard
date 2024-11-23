import { getDb } from '@/server/db';
import { sendPush } from '@/helpers/push';
import type { News } from '@/types';
import { RecordId } from 'surrealdb';
import { jres } from '@/helpers/responsesWithToast';

export async function POST({ request }: any) {
	let { postData, token }: { postData: News; token: string } =
		await request.json();
	let db = await getDb();
	db?.authenticate(token);
	try {
		if (!postData) return jres(400);
		await db
			?.create<News>('news', {
				title: postData.title,
				owner: postData.owner.id as RecordId,
			})
			.then(() => {
				try {
					sendPush('New News', `Brand neu! - ${postData.title}`);
				} catch (e) {
					return jres(400);
				}
			});
	} catch (e) {
		console.error(e);
		return jres(400);
	}

	return jres(200, 'Posted', `Dieser Beitrag wurde gepostet WOHOO`);
}
