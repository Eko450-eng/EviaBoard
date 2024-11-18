import { getDb } from '@/server/db';
import type { ASBCheck } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let asbcheck = await db?.select<ASBCheck>('ASBCheck');
		if (!asbcheck) {
			return json({ status: 500 });
		}
		return json({ asbcheck }, { status: 200 });
	}
	return json({ status: 500 });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let { user } = await request.json();
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		await db
			?.query(`DELETE ASBCheck WHERE name = '${user?.email}'`)
			.then(() => {
				return json({ status: 200 });
			});
	}
	return json({ status: 500 });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { user } = await request.json();

		db?.create('ASBCheck', {
			name: user?.email,
		}).then(() => {
			return json({ status: 200 });
		});
	}
	return json({ status: 500 });
};
