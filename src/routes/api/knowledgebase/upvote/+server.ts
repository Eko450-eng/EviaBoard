import { getDb } from '@/server/db';
import type { Post, PostVotes } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return json({ status: 500 });
	db?.authenticate(token);
	let { userId, recordId } = await request.json();

	try {
		let post = await db?.select<Post>(recordId);
		let query = `SELECT * FROM postVote WHERE voter = ${'user:' + userId.id} AND post = ${recordId}`;
		let votes = await db?.query<Array<Array<PostVotes>>>(query);

		if (!post || !votes) return json({ status: 500 });
		let newUpvotes = post?.upvoteCount ?? 0;

		if (votes[0]?.length >= 1) {
			let v = votes[0][0];
			await db?.delete(v.id!);
			newUpvotes -= 1;
		} else {
			newUpvotes += 1;
		}

		await db
			?.query(`CREATE postVote SET
				post = ${recordId},
				voter = ${userId}
        `)
			.then(async (v) => {
				let vote = v as PostVotes[][];
				let q = `RELATE ${recordId} -> post_vote -> ${vote![0][0].id}`;
				await db?.query(q);
			});

		return json(
			{ title: 'Du hast gevoted', description: 'Dein Vote wurde gevotetetet' },
			{ status: 200 },
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
};
