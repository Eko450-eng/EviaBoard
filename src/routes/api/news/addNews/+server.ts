import { getDb } from '@/server/db';
import { sendPush } from '@/helpers/push';
import type { News } from '@/types';
import { json } from '@sveltejs/kit';
import { RecordId } from 'surrealdb';

export async function POST({ request }: any) {
	let { postData, token }: { postData: News; token: string } =
		await request.json();
	let db = await getDb();
	db?.authenticate(token);
	try {
		if (!postData) return;
		await db
			?.create<News>('news', {
				title: postData.title,
				owner: postData.owner.id as RecordId,
			})
			.then(() => {
				try {
					sendPush('New News', `Brand neu! - ${postData.title}`);
				} catch (e) {
					return json(
						{
							title: 'Fehler',
							description: `This failed due to: ${e}, probably not my fault`,
						},
						{ status: 500 },
					);
				}
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
