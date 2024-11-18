import { DB_NS } from '$env/static/private';
import { PUBLIC_DB_DB } from '$env/static/public';
import { getDb } from '@/server/db';
import { checkUser } from '@/stores/user.store';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let db = await getDb();

	let { data } = await request.json();

	if (!db)
		return json(
			{
				title: 'Dang',
				desc: 'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
				error: true,
			},
			{ status: 404 },
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
			let q = `SELECT name FROM user WHERE email = '${data.email}'`;
			let [user] = await db.query<Array<Array<User>>>(q);

			cookies.set('jwt', token, { path: '/' });
			await checkUser(token);
			return json(
				{
					title: 'Willkommen zurück',
					desc: `Wo warst du so lange ${user[0].name}`,
					error: false,
				},
				{ status: 200 },
			);
		}
	} catch (e) {
		console.error(e);
		return json(
			{
				title: 'Oops',
				desc: 'Sicher dass alle deine Daten korrekt eingetragen sind?',
				error: true,
			},
			{ status: 500 },
		);
	}
	return json({
		title: 'Wie?',
		desc: 'Wie kamst du an diese Stelle von meinem code...',
		error: true,
	});
};
