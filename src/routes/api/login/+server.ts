import { DB_NS } from '$env/static/private';
import { PUBLIC_DB_DB } from '$env/static/public';
import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import { checkUser } from '@/server/user.store';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let db = await getDb();

	let { data } = await request.json();

	if (!db)
		return jres(
			400,
			'Dang',
			'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
		);
	try {
		const token = await db.signin({
			namespace: DB_NS,
			database: PUBLIC_DB_DB,
			access: 'user',
			variables: {
				email: data.email,
				password: data.password,
			},
		});
		if (token) {
			let q = `SELECT name FROM user WHERE email = $dataMail`;
			let [user] = await db.query<Array<Array<User>>>(q, {
				dataMail: data.email,
			});

			cookies.set('jwt', token, {
				path: '/',
				sameSite: 'lax',
			});
			let userData = await checkUser(token);
			return json(
				{
					title: 'Willkommen zurück',
					desc: `Wo warst du so lange ${user[0].name}`,
					error: false,
					userData,
				},
				{ status: 200 },
			);
		}
	} catch (e) {
		console.error(e);
		return jres(
			400,
			'Oops',
			'Sicher dass alle deine Daten korrekt eingetragen sind?',
		);
	}

	return json({
		title: 'Wie?',
		desc: 'Wie kamst du an diese Stelle von meinem code...',
		error: true,
	});
};
