import { getDb } from '@/db';
import type { Post, Topic, User } from '@/types';
import { json } from '@sveltejs/kit';
import { RecordId } from 'surrealdb';

export async function GET({ request }: { request: Request }) {
	let tokenRaw = request.headers.get('Authorization');
	if (!tokenRaw) return json({}, { status: 500 });

	let token = tokenRaw.replace('Bearer ', '');
	let db = await getDb();
	db?.authenticate(token);

	let query = `select id, body, title, topic.name as topic, owner.id, owner.name, owner.image, deleted, created_at, count(->post_vote) AS upvoteCount, (SELECT out.voter.name as name FROM post_vote WHERE in.id == $parent.id) as voter from posts WHERE  !deleted OR deleted AND owner = $auth.id ORDER created_at DESC`;
	let posts_raw = await db?.query<Array<Array<Post>>>(query);
	let raw_data = await db?.query<Topic[][]>('select * from topics');

	if (!posts_raw || !raw_data) return;

	return json({ posts: posts_raw[0], topics: raw_data[0] });
}

export async function PATCH({ request }: { request: Request }) {
	let tokenRaw = request.headers.get('Authorization');
	if (!tokenRaw) return json({}, { status: 500 });

	let token = tokenRaw.replace('Bearer ', '');
	let db = await getDb();
	db?.authenticate(token);

	let { id, state }: { id: RecordId | string; state: boolean } =
		await request.json();

	try {
		console.log('id ist: ', id);
		await db
			?.query(`UPDATE posts SET deleted = ${state} WHERE id = ${id}`)
			.then(() => {
				return json({ title: 'Post wurde geupdatet' }, { status: 200 });
			});
		return json({ title: 'Post wurde vielleicht geupdatet' }, { status: 200 });
	} catch (e) {
		console.error(e);
		return json({ title: 'Post wurde nicht geupdatet' }, { status: 500 });
	}
}

export async function POST({ request }: { request: Request }) {
	let db = await getDb();

	let { postData } = await request.json();
	console.log(postData.owner);
	try {
		if (!postData) return;
		await db
			?.query(
				`CREATE posts 
        SET 
				deleted = false,
				title = "${postData.title}",
				body = "${postData.body}",
				solution = "${postData.solution}",
				owner = ${postData.owner},
				topic = ${postData.topic}
`,
			)
			.then(async (res) => {
				console.log(res);
				return json(
					{
						title: 'Posted',
						description: 'Dein Beitrag wurde gepostet',
					},
					{ status: 200 },
				);
			});
		return json(
			{
				title: 'Not posted',
				description: 'Dein Beitrag wurde nicht gepostet',
			},
			{ status: 500 },
		);
	} catch (e) {
		console.error(e);
		return json(
			{
				title: 'Fehler',
				description: `This failed due to: ${e}, probably not my fault`,
			},
			{ status: 500 },
		);
	}
}
