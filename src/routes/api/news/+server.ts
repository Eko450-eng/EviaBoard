import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { News, News_newspost, NewsVotes } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	let db = await getDb();

	const query =
		'SELECT *, owner.name, owner.image, -> news_post.out.* as newspost, count(->news_vote) AS upvoteCount, (SELECT out.voter.name as name FROM news_vote WHERE in.id == $parent.id) as voter from news ORDER BY date desc';

	const res = await db?.query<Array<Array<News_newspost>>>(query);

	if (!res || !res[0]) return jres(400);

	return json({ data: res[0] }, { status: 200 });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return jres(401);
	db?.authenticate(token);
	let { userId, recordId } = await request.json();

	try {
		let post = await db?.select<News>(recordId);
		let query =
			'SELECT * FROM newsVote WHERE voter = type::record($userId) AND post = type::record($postId)';

		let votes = await db?.query<Array<Array<NewsVotes>>>(query, {
			userId: userId,
			postId: recordId,
		});

		if (!post || !votes) return jres(404);

		if (votes[0].length >= 1) {
			let v = votes[0][0];
			await db?.delete(v.id!);
		} else {
			await db
				?.query(`CREATE newsVote SET
				post = ${recordId},
				voter = ${userId}
        `)
				.then(async (v) => {
					let vote = v as NewsVotes[][];
					let q = `RELATE ${recordId} -> news_vote -> $vote`;

					await db?.query(q, {
						vote: vote![0][0].id,
					});
				});
		}

		return jres(200, 'Du hast gevoted', 'Dein Vote wurde gevotetetet');
	} catch (e) {
		console.error(e);
		return jres(400);
	}
};
