import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { user, id, confirmPassword } = await request.json();

		if (confirmPassword != user.password) {
			return jres(400, 'Woops', 'Die Passwörter stimmen nicht überein');
		}
		if (user.email.length < 3 || user.name.length < 3) {
			return jres(
				400,
				'Woops',
				'Überprüfe bitte deine E-Mail und deinen Usernamen, dein Username muss mindestens 3 Zeichen lang sein',
			);
		}

		let image = `https://minio.eko450eng.org/eviaboard/${id}.png`;

		await db
			?.query(
				`
          UPDATE user SET
            email = "${user.email}",
            name = "${user.name}",
            image = "${image}",
            password = crypto::argon2::generate("${user.password}")
          WHERE id = $token.ID
        `,
			)
			.then(() => {
				return jres(200, 'Yey', 'Profil geupdated');
			});
		return jres(200, 'Yey', 'Profil geupdated');
	} else {
		return jres(401);
	}
};
