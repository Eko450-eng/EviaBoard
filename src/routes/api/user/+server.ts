import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { ChannelsWithSub } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { endpoint, user } = await request.json();

		let query = `SELECT * FROM channels`;
		if (endpoint && user) {
			query = `SELECT *, (SELECT COUNT() FROM pushkey_channel WHERE in.user = ${user.id} AND out = $parent.id AND in.data.endpoint = "${endpoint}" AND active) as subbed FROM channels`;
		}

		let channelsQuery = await db?.query<Array<Array<ChannelsWithSub>>>(query);
		if (!channelsQuery) return jres(404);

		return json({ channel: channelsQuery[0] }, { status: 200 });
	} else {
		return jres(401);
	}
};
