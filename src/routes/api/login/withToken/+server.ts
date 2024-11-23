import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import { checkUser } from '@/server/user.store';
import type { User } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let db = await getDb();

	let { token } = await request.json();

	if (!db)
		return jres(
			400,
			'Dang',
			'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
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
