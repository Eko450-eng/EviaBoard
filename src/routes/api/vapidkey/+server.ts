import { DB_DB, DB_NS, DB_ROOT_PW } from '$env/static/private';
import { PUBLIC_DB_HOST, PUBLIC_VAPID_PUBLIC } from '$env/static/public';
import type { Pushkey } from '@/types';
import { json, type RequestHandler, error } from '@sveltejs/kit';
import Surreal, { RecordId } from 'surrealdb';

let HOST = PUBLIC_DB_HOST;
let NS = DB_NS;
let DB_KEY = DB_DB;
let ADMINPW = DB_ROOT_PW;
let ADMINUSER = 'admin';

const VAPID_PUBLIC_KEY = PUBLIC_VAPID_PUBLIC;
export const GET = (() => {
	return json({ data: VAPID_PUBLIC_KEY });
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = await request.json();

	try {
		if (!body.subscription) {
			console.error('No subscription passed to addSubscription', body);
			throw error(400, 'Bad Request');
		}

		if (body.user.id === 'user:tada') return json({ success: false });

		let userId = body.user.id as string;
		let userID = new RecordId('user', userId.replace('user:', ''));

		let db = new Surreal();
		await db.connect(HOST!, {
			auth: {
				namespace: NS,
				database: DB_KEY,
				username: ADMINUSER,
				password: ADMINPW,
			},
		});

		try {
			let query = `SELECT * FROM pushkey WHERE data.endpoint = '${body.subscription.endpoint}'`;
			let exists = await db?.query<Array<Array<Pushkey>>>(query);
			if (exists && exists[0].length <= 0) {
				await db?.create('pushkey', {
					user: userID,
					data: body.subscription,
				});
			}
		} catch (e) {
			console.error(e);
		}

		return json({ success: true });
	} catch (e) {
		console.error('Failed to add subscription: ', e);
	}

	return json({ success: true });
}) satisfies RequestHandler;
