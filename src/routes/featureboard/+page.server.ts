import { env } from '$env/dynamic/public';
import { getDb } from '@/db';
import type { Report, User } from '@/types';
import type { RecordId } from 'surrealdb';

let token = env.PUBLIC_EJ_TOKEN;

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
};

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
				};
				results.push(result);
			});
			let oldSet = data;
			return (oldSet = [...oldSet, ...results]);
		},
	);
	return response;
}

export async function load() {
	let db = await getDb();
	let preData: ReportString[] = [];
	let data: ReportString[] = [];
	if (db && db.ready) {
		await db
			?.query<Report[][]>(
				'SELECT id, title, body, status, category, count(->bug_vote->votes)AS upvotes, owner.name as owner FROM bugreports WHERE status != 10',
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
					};
					preData.push(result);
				});

				data = await getEJData(preData);
			});
	}
	return { data };
}