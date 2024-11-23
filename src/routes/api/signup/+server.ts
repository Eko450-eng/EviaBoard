import { DB_NS } from '$env/static/private';
import { PUBLIC_DB_DB } from '$env/static/public';
import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import { checkUser } from '@/server/user.store';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let db = await getDb();

	let { data, confirmPass } = await request.json();

	if (data.password !== confirmPass) {
		return jres(400, 'Oops', 'Versuch mal in beiden Feldern dasselbe Passwort');
	}

	if (data.password.length < 8) {
		return jres(400, 'Oops', 'Passwort zu kurz');
	}

	if (!db)
		return jres(
			400,
			'Dang',
			'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
		);
	try {
		const token = await db?.signup({
			namespace: DB_NS,
			database: PUBLIC_DB_DB,
			access: 'user',
			variables: {
				email: data.email,
				image: '',
				user: data.name,
				password: data.password,
				role: 0,
			},
		});
		if (token) {
			cookies.set('jwt', token, { path: '/', sameSite: 'lax' });
			await checkUser(token);
			return jres(200, 'Nice', 'Willkommen an Board');
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
