import { getDb } from '@/server/db';
import type { Channel } from '@/types';
import { json } from '@sveltejs/kit';

export async function POST({ request }: any) {
	let tokenRaw = request.headers.get('Authorization');
	if (!tokenRaw) return json({}, { status: 500 });

	let token = tokenRaw.replace('Bearer ', '');
	let { endpoint, user } = await request.json();

	let db = await getDb();
	db?.authenticate(token);

	let query = `SELECT * FROM channels`;
	if (endpoint && user) {
		query = `SELECT *, (SELECT COUNT() FROM pushkey_channel WHERE in.user = ${user.id} AND out = $parent.id AND in.data.endpoint = "${endpoint}") as subbed FROM channels`;
	}

	let channelsQuery = await db?.query<Array<Array<Channel>>>(query);
	if (!channelsQuery) return;

	return json({ channel: channelsQuery[0] }, { status: 200 });
}
