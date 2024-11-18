import { getDb } from '@/server/db';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	let token = cookies.get('jwt');
	if (token) {
		let db = await getDb();

		let isValid = await db?.authenticate(token);
		let userRaw = await db?.query<Array<Array<User>>>(
			'SELECT * FROM user WHERE id = $auth.id',
		);

		if (!isValid || !userRaw) return json({ status: 500 });
		let user = userRaw[0][0];
		return json({ isValid, user }, { status: 200 });
	}
	return json({ status: 500 });
};
