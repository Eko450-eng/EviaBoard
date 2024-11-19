import { getDb } from '@/server/db';
import type { Pushkey } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	if (token) {
		let db = await getDb();
		db?.authenticate(token);
		let { subscription, userId, channel, state } = await request.json();

		try {
			const pushKey: Array<Array<Pushkey>> | undefined = await db?.query<
				Array<Array<Pushkey>>
			>(
				`SELECT * FROM pushkey WHERE user = ${userId} AND data.endpoint = "${subscription?.endpoint}"`,
			);
			if (!pushKey) return json({ status: 400 });

			let queryOpum = `
      let $endpoint = "${subscription.endpoint.replace(/(\r\n|\n|\r)/gm, '')}";
      let $user = ${userId};
      let $channel = ${channel};

      let $num = (SELECT COUNT() FROM pushkey_channel WHERE user = $user
              AND in.data.endpoint = $endpoint
              AND out = $channel);

      IF !$num {
          RELATE  (SELECT id from pushkey WHERE data.endpoint = $endpoint) -> pushkey_channel -> $channel
          SET     user = $user,
                  active = ${state};
          RETURN $num;
      } ELSE {
          UPDATE pushkey_channel SET
              active = ${state}
          WHERE user = $user
              AND in.data.endpoint = $endpoint
              AND out = $channel; 
          RETURN $num;
      }
`;

			await db?.query(`RELATE  ${userId} -> user_channels -> ${channel}`);
			await db?.query(queryOpum);

			return json({ status: 200 });
		} catch (e) {
			return json({ status: 500 });
		}
	} else {
		return json({ status: 404 });
	}
};
