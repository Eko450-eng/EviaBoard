import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { User, Report, Votes } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import { RecordId } from 'surrealdb';

type ReportString = {
	source?: string;
	title: string;
	body: string;
	status: number;
	category: number;
	upvotes: number;
	owner: User | RecordId;
	created_at?: Date;
	id: string;
	priority: number;
};

export const GET: RequestHandler = async ({ locals }) => {
	let db = await getDb();
	let token = locals.jwt;
	if (!token) return jres(401);
	db?.authenticate(token);

	let users_raw = await db?.query<User[][]>(
		`SELECT * FROM user ORDER role desc`,
	);
	if (!users_raw) return jres(404);
	let [users] = users_raw;

	return json({ users }, { status: 200 });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	let db = await getDb();
	let token = locals.jwt;
	if (!token) return jres(401);
	db?.authenticate(token);

	let { postData, selectedTopic, selectedPriority } = await request.json();

	let category = 0;
	switch (selectedTopic) {
		case 'Bug':
			category = 0;
			break;
		case 'Feature':
			category = 1;
			break;
		case 'Question':
			category = 2;
			break;
		default:
			category = 0;
			break;
	}
	let res = await db
		?.query(
			`CREATE bugreports 
        SET 
          title = $title,
          body = $body,
          status = $status,
          category = $category,
          priority = $prio,
          upvotes = 0,
          owner = $auth
        `,
			{
				title: postData.title,
				body: postData.body,
				status: postData.status,
				category: category,
				prio: parseInt(selectedPriority),
			},
		)
		.then(() => {
			const message = () => {
				switch (category) {
					case 0:
						return `Jemand bemängelt ${postData.title}`;
					case 1:
						return `Jemand will ${postData.title}`;
					case 2:
						return `Jemand fragte ${postData.title}`;
					default:
						return `Jemand bemängelt ${postData.title}`;
				}
			};
			return json(
				{ title: 'Yey', desc: 'Danke für dein Feedback!', pushMsg: message },
				{ status: 200 },
			);
		});
	if (res && res.status === 200) {
		return res;
	} else {
		return jres(400);
	}
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	let db = await getDb();
	let token = locals.jwt;
	if (!token) return jres(401);
	db?.authenticate(token);

	let { id, change, value, app } = await request.json();
	if (app === 'Typer') {
		if (change === 'status') {
			await setTyperStatus(id, value);
			return jres(200, 'Yey', 'Status geändert');
		} else {
			return jres(404);
		}
	} else if (app === 'Eviaboard') {
		if (change === 'status') {
			await db?.query(
				'UPDATE bugreports SET status = $value WHERE id = type::record($id)',
				{
					value: value,
					id: id,
				},
			);
			return jres(200, 'Yey', 'Status geändert');
		} else if (change === 'category') {
			await db?.query(
				'UPDATE bugreports SET category = $value WHERE id = type::record($id)',
				{
					value: value,
					id: id,
				},
			);
			return jres(200, 'Yey', 'Kategorie geändert');
		} else if (change === 'prio') {
			await db?.query(
				'UPDATE bugreports SET priority = $value WHERE id = type::record($id)',
				{
					value: value,
					id: id,
				},
			);
			return jres(200, 'Yey', 'Priorität geändert');
		} else if (change == 'upvote') {
			let report = await db?.select<Report>(id);
			let votes = await db?.query<Array<Array<Votes>>>(
				`SELECT * FROM votes WHERE
	                 voter = type::record($token.ID) 
	                 AND
	                 bugreport = ${id}`,
				{ id: id },
			);

			if (!report || !votes) return jres(404);

			if (votes[0]?.length >= 1) {
				let v = votes[0][0];
				await db?.delete(v.id!);
				await db?.query<Votes[][]>(
					`
        DELETE votes WHERE
          bugreport = ${id} AND
          voter = type::record($token.ID) 
        `,
				);
				return jres(201);
			} else {
				await db
					?.query<Votes[][]>(
						`
        CREATE votes SET
          bugreport = ${id},
          voter = type::record($token.ID) 
        `,
					)
					.then(async (vote) => {
						await db.query(`RELATE ${id} -> bug_vote -> ${vote[0][0].id}`);
					});
				return jres(201);
			}
		} else {
			return jres(400);
		}
	} else {
		return jres(400);
	}
};
