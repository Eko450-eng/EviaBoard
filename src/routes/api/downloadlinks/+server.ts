import { getDb } from '@/server/db';
import type { Downloadlinks } from '@/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	let token = locals.jwt;
	let db = await getDb();
	if (token) {
		db?.authenticate(token);
		let downloadlinks = await db?.select<Downloadlinks>('downloadlinks');
		if (!downloadlinks) {
			return json({ status: 200 });
		}
		return json({ downloadlinks }, { status: 200 });
	}
	return json({ status: 500 });
};

export async function PATCH({ request }: { request: Request }) {}

export async function POST({ request }: { request: Request }) {}
