import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);

		let isValid = await db?.authenticate(token);
		let userRaw = await db?.query<Array<Array<User>>>(
			'SELECT * FROM user WHERE id = $token.id',
		);

		if (!isValid || !userRaw) return jres(403);
		let user = userRaw[0][0];
		return json({ isValid, user }, { status: 200 });
	}
	return jres(401);
};
