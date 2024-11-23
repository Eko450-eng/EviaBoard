import { jres } from '@/helpers/responsesWithToast';
import { getDb } from '@/server/db';
import type { Comments, Post } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { RecordId } from 'surrealdb';

type CommentRelation = {
	comments: Comments[];
};

type Kb_comment = {
	id?: RecordId;
	in: Post;
	out: Comments;
};

export const GET: RequestHandler = async ({ locals, url }) => {
	let id = url.searchParams.get('id');
	if (!id) return jres(400);
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return jres(401);
	db?.authenticate(token);

	let query = `
     SELECT
         ->kb_comment.out[*].{
             comment,
             created_at,
             id,
             owner: owner.*
         } AS comments
     FROM posts WHERE id = type::record($id)`;

	let comments = await db
		?.query<Array<Array<CommentRelation>>>(query, { id: id })
		.then((value: CommentRelation[][]) => {
			return value[0][0].comments;
			if (!value[0][0]) return jres(404);
			let comments = value[0][0].comments;
			comments.sort((a: Comments, b: Comments) => {
				const dateA = new Date(a.created_at!).getTime();
				const dateB = new Date(b.created_at!).getTime();
				return dateB - dateA;
			});
		});

	return json({ comments }, { status: 200 });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (!token) return jres(401);
	db?.authenticate(token);
	let { message, id } = await request.json();

	let createQuery = `CREATE kbcomment SET owner=type::record($token.ID), comment=$message, created_at = time::now();`;
	let comment = await db?.query<Array<Array<Comments>>>(createQuery, {
		message: message,
	});
	if (!comment) return jres(400);
	let relateQuery = `RELATE ${id} -> kb_comment -> ${comment[0][0].id}`;
	await db?.query<Array<Array<Kb_comment>>>(relateQuery);

	return jres(201);
};
