import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { Post, PostVotes } from '@/types';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return jres(401);
	db?.authenticate(token);
	let { userId, recordId } = await request.json();

	try {
		let post = await db?.select<Post>(recordId);
		let query =
			'SELECT * FROM postVote WHERE voter = type::record($userId) AND post = type::record($postId)';

		let votes = await db?.query<Array<Array<PostVotes>>>(query, {
			userId: userId,
			postId: recordId,
		});

		if (!post || !votes) return jres(404);

		if (votes[0].length >= 1) {
			let v = votes[0][0];
			await db?.delete(v.id!);
		} else {
			await db
				?.query(`CREATE postVote SET
				post = ${recordId},
				voter = ${userId}
        `)
				.then(async (v) => {
					let vote = v as PostVotes[][];
					let q = `RELATE ${recordId} -> post_vote -> $vote`;

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
