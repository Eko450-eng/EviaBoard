import { jres } from '@/helpers/responsesWithToast';
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
			return jres(404);
		}
		return json({ asbcheck }, { status: 200 });
	}
	return jres(401);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { user } = await request.json();

		await db
			?.query(
				`
          let $list = SELECT name FROM ASBCheck;
          IF ($list.name CONTAINS $user){
              return true
          }else{
              return false
          };
        `,
				{
					user: user.email,
				},
			)
			.then(async (v) => {
				if (v) {
					await db
						?.query(`DELETE ASBCheck WHERE name = $email`, {
							email: user?.email,
						})
						.then(() => {
							return jres(200);
						});
				} else {
					await db
						?.create('ASBCheck', {
							name: user?.email,
						})
						.then(() => {
							return jres(200);
						});
				}
			});
	}
	return jres(401);
};
