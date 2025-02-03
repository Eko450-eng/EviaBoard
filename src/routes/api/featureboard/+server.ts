import { EJ_TOKEN } from '$env/static/private';
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

let token = EJ_TOKEN;

async function setTyperStatus(id: string, state: string): Promise<Response> {
	if (!token) return jres(401);
	const ejParams = new URLSearchParams({
		type: 'ekoapi',
		token: token,
		action: 'setState',
		key: id,
		state: state,
	}).toString();
	const ejAPI = 'https://ejberichtsheft.de/';
	await fetch(`${ejAPI}?${ejParams}`, {}).then(async (response) => {
		let respon = await response.json();
	});
	return jres(200);
}

async function getEJData(data: ReportString[]): Promise<ReportString[]> {
	if (!token) return data;
	const ejParams = new URLSearchParams({
		type: 'ekoapi',
		token: token,
		action: 'getReports',
	}).toString();
	const ejAPI = 'https://ejberichtsheft.de/';

	const response = await fetch(`${ejAPI}?${ejParams}`, {}).then(
		async (response) => {
			// eslint-disable-next-line
			let respon: Array<any> = await response.json();
			let results: ReportString[] = [];
			respon.forEach((res) => {
				let result: ReportString = {
					source: 'Typer',
					id: res.report_key,
					title: res.report_title,
					body: res.report_description,
					status: res.report_state,
					category: res.report_type,
					upvotes: 0,
					owner: res.user_name,
					priority: 0,
				};
				results.push(result);
			});
			let oldSet = data;
			return (oldSet = [...oldSet, ...results]);
		},
	);
	return response;
}

export const GET: RequestHandler = async ({ locals }) => {
	let db = await getDb();
	let token = locals.jwt;
	if (!token) return jres(401);
	db?.authenticate(token);

	let preData: ReportString[] = [];
	let data: ReportString[] = [];

	await db
		?.query<Report[][]>(
			'SELECT id, title, body, status, category, priority, created_at, count(->bug_vote->votes)AS upvotes, owner.name as owner FROM bugreports WHERE status != 10 ORDER created_at DESC',
		)
		.then(async (v) => {
			let responses = v[0];

			responses.forEach((res) => {
				let result: ReportString = {
					source: 'Eviaboard',
					id: res.id?.toString() ?? '',
					title: res.title,
					body: res.body,
					status: res.status,
					category: res.category,
					upvotes: res.upvotes,
					owner: res.owner,
					priority: res.priority,
				};
				preData.push(result);
			});

			data = await getEJData(preData);
		});
	return json({ data }, { status: 200 });
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
