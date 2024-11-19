import { getDb } from '@/server/db';
import { checkUser } from '@/server/user.store';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let db = await getDb();

	let { token } = await request.json();

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
		if (token) {
			db.authenticate(token);
			let user = await db.info<User>();

			cookies.set('jwt', token, {
				path: '/',
				sameSite: 'lax',
			});
			let userData = await checkUser(token);

			return json(
				{
					title: 'Willkommen zurück',
					desc: `Wo warst du so lange ${user ? user.name : ''}`,
					error: false,
					userData,
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
