import { getDb } from '@/server/db';
import type { Pushkey } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { subscription, userId, channel } = await request.json();

		try {
			const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
				Array<Array<Pushkey>>
			>(
				`SELECT * FROM pushkey WHERE user = ${userId} AND data.endpoint = "${subscription?.endpoint}"`,
			);
			if (!pushKey) return json({ status: 400 });

			// TODO: Upsert subscription to Pushkey Table
			// Relate that entry to the pushkey_channel
			console.log(subscription.endpoint, subscription);

			await db?.query(`RELATE  ${userId} -> user_channels -> ${channel}`);
			await db?.query(
				`RELATE  ${subscription.endpoint} -> pushkey_channel -> ${channel}`,
			);

			return json({ status: 200 });
		} catch (e) {
			return json({ status: 500 });
		}
	} else {
		return json({ status: 404 });
	}
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { subscription, userId, channel } = await request.json();

		// TODO: Fixup
		try {
			const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
				Array<Array<Pushkey>>
			>(
				`SELECT * FROM pushkey WHERE user = ${userId} AND data.endpoint = "${subscription?.endpoint}"`,
			);
			if (!pushKey) return json({ status: 400 });

			await db?.query(
				`DELETE FROM user_channels WHERE out = ${channel} AND in = ${userId}`,
			);

			pushKey[0].forEach(async (key) => {
				const query = `DELETE FROM pushkey_channel WHERE in = ${key.id} AND out = ${channel} AND in.data.endpoint = '${subscription?.endpoint}'`;
				await db?.query(query);
			});
			return json({ status: 200 });
		} catch (e) {
			return json({ status: 500 });
		}
	} else {
		return json({ status: 404 });
	}
};
