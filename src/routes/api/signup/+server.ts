import { DB_NS } from '$env/static/private';
import { PUBLIC_DB_DB } from '$env/static/public';
import { getDb } from '@/server/db';
import { checkUser } from '@/server/user.store';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let db = await getDb();

	let { data, confirmPass } = await request.json();

	if (data.password !== confirmPass) {
		return json(
			{
				title: 'Oops',
				desc: 'Versuch mal in beiden Feldern dasselbe Passwort',
				error: true,
			},
			{ status: 500 },
		);
	}

	if (data.password.length < 8) {
		return json(
			{
				title: 'Oops',
				desc: 'Passwort zu kurz',
				error: true,
			},
			{ status: 500 },
		);
	}

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
			return json(
				{
					title: 'Nice',
					desc: 'Willkommen an Board',
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
