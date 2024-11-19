import { getDb } from '@/server/db';
import type { Channel } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { endpoint, user } = await request.json();

		let query = `SELECT * FROM channels`;
		if (endpoint && user) {
			query = `SELECT *, (SELECT COUNT() FROM pushkey_channel WHERE in.user = ${user.id} AND out = $parent.id AND in.data.endpoint = "${endpoint}") as subbed FROM channels`;
		}

		let channelsQuery = await db?.query<Array<Array<Channel>>>(query);
		if (!channelsQuery) return json({ status: 404 });

		return json({ channel: channelsQuery[0] }, { status: 200 });
	} else {
		return json({ status: 404 });
	}
};
