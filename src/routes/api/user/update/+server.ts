import { getDb } from '@/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { user, id, confirmPassword } = await request.json();

		if (confirmPassword != user.password) {
			return json(
				{
					title: 'Woops',
					description: 'Die Passwörter stimmen nicht überein',
				},
				{ status: 500 },
			);
		}
		if (user.email.length < 3 || user.name.length < 3) {
			return json(
				{
					title: 'Woops',
					description:
						'Überprüfe bitte deine E-Mail und deinen Usernamen, dein Username muss mindestens 3 Zeichen lang sein',
				},
				{ status: 500 },
			);
		}

		let image = `https://minio.eko450eng.org/eviaboard/${id}.png`;

		let query = `UPDATE user SET
		    email = "${user.email}",
		    name = "${user.name}",
		    image = "${image}",
		    password = crypto::argon2::generate('${user.password}')
		    WHERE id = ${id}
		  `;
		await db?.query(query).then(async (res) => {
			return json(
				{ title: 'Yey', description: 'Profil geupdated' },
				{ status: 200 },
			);
		});
		return json(
			{ title: 'Yey', description: 'Profil geupdated' },
			{ status: 200 },
		);
	} else {
		return json({ status: 404 });
	}
};
