import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let db = await getDb();
	let token = locals.jwt;
	if (!token) return jres(401);
	db?.authenticate(token);

	let data_raw = await db?.query(`SHOW CHANGES FOR TABLE user SINCE 1`);
	if (!data_raw) return jres(404);
	console.log(data_raw);

	return json({ status: 200 });
};
